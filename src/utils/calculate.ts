import type { Variant, ComponentItem, EnergyInput, CalculationResult, TauBreakdown, EnergyMix, TransportMix, VariantTransport, ERPEntry, MaterialEnergyRates } from '../types';
import { computeHeatBreakdown, computeElectricityBreakdown } from './energyBreakdown';

const CHART_COLORS = {
  material: ['#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#374151'],
  electricity: '#FDE047',
  heat: '#FB923C',
  transport: '#A855F7',
};

export interface MixLookup {
  getMix: (id: string) => EnergyMix | undefined;
  getTransportMix: (id: string) => TransportMix | undefined;
  getErp: (id: string) => ERPEntry | undefined;
  getMaterialRate: (materialId: string) => MaterialEnergyRates | undefined;
}

export function calculateVariantTau(variant: Variant, lookup: MixLookup): CalculationResult {
  const breakdown: TauBreakdown[] = [];
  let totalTau = 0;
  const lifetime = variant.usePhase.lifetime;

  for (let i = 0; i < variant.components.length; i++) {
    const component = variant.components[i];
    const tau = calculateMaterialTau(component, lifetime, lookup);
    breakdown.push({
      category: 'Material',
      name: component.name,
      tau,
      percentage: 0,
      color: CHART_COLORS.material[i % CHART_COLORS.material.length],
    });
    totalTau += tau;
  }

  const heatMix = lookup.getMix(variant.manufacturing.heat.mixId);
  const heatBd = computeHeatBreakdown(variant.components, lookup.getMaterialRate, heatMix);
  const elecBd = computeElectricityBreakdown(variant.components, lookup.getMaterialRate, heatBd);

  const elecTau = calculateMixTau(elecBd.total, variant.manufacturing.electricity.mixId, lifetime, lookup);
  breakdown.push({
    category: 'Energy',
    name: 'Electricity',
    tau: elecTau,
    percentage: 0,
    color: CHART_COLORS.electricity,
  });
  totalTau += elecTau;

  const heatTau = calculateMixTau(heatBd.totalProduced, variant.manufacturing.heat.mixId, lifetime, lookup);
  breakdown.push({
    category: 'Energy',
    name: 'Heat',
    tau: heatTau,
    percentage: 0,
    color: CHART_COLORS.heat,
  });
  totalTau += heatTau;

  const transportTau = calculateTotalTransportTau(variant, lookup);
  breakdown.push({
    category: 'Transport',
    name: 'Transport',
    tau: transportTau,
    percentage: 0,
    color: CHART_COLORS.transport,
  });
  totalTau += transportTau;

  for (const item of breakdown) {
    item.percentage = totalTau > 0 ? (item.tau / totalTau) * 100 : 0;
  }

  return { totalTau, breakdown, timestamp: new Date() };
}

/**
 * τ_material = (massRequired / ERP / lifetime) × F
 *
 * F = primaryContent × (1 - recyclability - 0.5 × cascadability)
 *   + secondaryContent × 0.5 × finalLoss
 */
export function calculateMaterialTau(component: ComponentItem, lifetime: number, lookup: MixLookup): number {
  const erp = lookup.getErp(component.materialId);
  if (!erp || lifetime <= 0 || erp.erp <= 0) return 0;

  const mass = component.mass;
  const lossRate = component.manufacturingLossRate;
  const manufLossKg = mass * lossRate;
  const massRequired = mass + manufLossKg;

  if (massRequired <= 0) return 0;

  const m = component.manufacturingLossTreatment;
  const e = component.eolTreatment;

  const recyclability =
    (manufLossKg * m.collectionRate * m.recyclingRate +
      mass * e.collectionRate * e.recyclingRate) /
    massRequired;

  const cascadability =
    (manufLossKg * m.collectionRate * m.cascadingRate +
      mass * e.collectionRate * e.cascadingRate) /
    massRequired;

  const finalLoss = Math.max(0, 1 - recyclability - cascadability);

  const primary = component.primaryContent;
  const secondary = 1 - primary;

  const F =
    primary * (1 - recyclability - 0.5 * cascadability) +
    secondary * 0.5 * finalLoss;

  return (massRequired / erp.erp / lifetime) * Math.max(0, F);
}

/**
 * τ_energy = (consumption / lifetime) × Σ(share_i / ERP_i)
 * Heat pump sources (ERP = 0) are naturally excluded.
 */
export function calculateMixTau(
  consumption: number,
  mixId: string,
  lifetime: number,
  lookup: MixLookup,
): number {
  if (lifetime <= 0 || consumption <= 0) return 0;

  const mix = lookup.getMix(mixId);
  if (!mix) return 0;

  let weightedErpSum = 0;
  for (const source of mix.sources) {
    const erp = lookup.getErp(source.erpId);
    if (erp && erp.erp > 0) {
      weightedErpSum += source.share / erp.erp;
    }
  }

  return (consumption / lifetime) * weightedErpSum;
}

export function calculateEnergyTau(energy: EnergyInput, lifetime: number, lookup: MixLookup): number {
  return calculateMixTau(energy.consumption, energy.mixId, lifetime, lookup);
}

function calculateVariantTransportTau(
  transport: VariantTransport,
  totalMass: number,
  lifetime: number,
  lookup: MixLookup,
): number {
  if (transport.distance <= 0 || totalMass <= 0 || lifetime <= 0) return 0;

  const mix = lookup.getTransportMix(transport.mixId);
  if (!mix) return 0;

  const tkm = (totalMass * transport.distance) / 1000;
  let tau = 0;

  for (const mode of mix.modes) {
    const erp = lookup.getErp(mode.modeId);
    if (erp && erp.erp > 0) {
      tau += (tkm * mode.share) / erp.erp / lifetime;
    }
  }

  return tau;
}

export function calculateTotalTransportTau(variant: Variant, lookup: MixLookup): number {
  const lifetime = variant.usePhase.lifetime;
  if (lifetime <= 0) return 0;

  const totalMass = variant.components.reduce((sum, c) => sum + c.mass, 0);

  const landTau = calculateVariantTransportTau(variant.transportLand, totalMass, lifetime, lookup);
  const overseasTau = calculateVariantTransportTau(variant.transportOverseas, totalMass, lifetime, lookup);

  let eolTau = 0;
  if (variant.endOfLife.transport.distance > 0) {
    const eolTkm = (totalMass * variant.endOfLife.transport.distance) / 1000;
    for (const mode of variant.endOfLife.transport.modes) {
      const erp = lookup.getErp(mode.modeId);
      if (erp && erp.erp > 0) {
        eolTau += (eolTkm * mode.share) / erp.erp / lifetime;
      }
    }
  }

  return landTau + overseasTau + eolTau;
}
