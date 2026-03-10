import type { Variant, ComponentItem, EnergyInput, CalculationResult, TauBreakdown } from '../types';
import { getErpEntry } from '../data/erpDatabase';
import { getMixById } from '../data/energyMixes';

const CHART_COLORS = {
  material: ['#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#374151'],
  electricity: '#FDE047',
  heat: '#FB923C',
  transport: '#A855F7',
};

export function calculateVariantTau(variant: Variant): CalculationResult {
  const breakdown: TauBreakdown[] = [];
  let totalTau = 0;
  const lifetime = variant.usePhase.lifetime;

  for (let i = 0; i < variant.components.length; i++) {
    const component = variant.components[i];
    const tau = calculateMaterialTau(component, lifetime);
    breakdown.push({
      category: 'Material',
      name: component.name,
      tau,
      percentage: 0,
      color: CHART_COLORS.material[i % CHART_COLORS.material.length],
    });
    totalTau += tau;
  }

  const elecTau = calculateEnergyTau(variant.manufacturing.electricity, lifetime);
  breakdown.push({
    category: 'Energy',
    name: 'Electricity',
    tau: elecTau,
    percentage: 0,
    color: CHART_COLORS.electricity,
  });
  totalTau += elecTau;

  const heatTau = calculateEnergyTau(variant.manufacturing.heat, lifetime);
  breakdown.push({
    category: 'Energy',
    name: 'Heat',
    tau: heatTau,
    percentage: 0,
    color: CHART_COLORS.heat,
  });
  totalTau += heatTau;

  const transportTau = calculateTotalTransportTau(variant);
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

export function calculateMaterialTau(component: ComponentItem, lifetime: number): number {
  const erp = getErpEntry(component.materialId);
  if (!erp || lifetime <= 0) return 0;

  const massRequired = component.mass * (1 + component.productionLoss);
  const primaryFactor = component.primaryMaterialContent;
  const recycleFactor = component.productionLossTreatment.recyclingWithoutLoss;
  const secondaryFactor = (1 - component.primaryMaterialContent) * 0.1;
  const lossFactor = 1 - recycleFactor * 0.5;

  return (massRequired / erp.erp) * (1 / lifetime) * (primaryFactor * lossFactor + secondaryFactor);
}

export function calculateEnergyTau(energy: EnergyInput, lifetime: number): number {
  if (lifetime <= 0 || energy.consumption <= 0) return 0;

  const mix = getMixById(energy.mixId);
  if (!mix) return 0;

  let weightedErpSum = 0;
  for (const source of mix.sources) {
    const erp = getErpEntry(source.erpId);
    if (erp && erp.erp > 0) {
      weightedErpSum += source.share / erp.erp;
    }
  }

  return (energy.consumption / lifetime) * weightedErpSum;
}

export function calculateTotalTransportTau(variant: Variant): number {
  const lifetime = variant.usePhase.lifetime;
  if (lifetime <= 0) return 0;

  let totalTau = 0;
  const totalMass = variant.components.reduce((sum, c) => sum + c.mass, 0);

  for (const component of variant.components) {
    totalTau += calculateComponentTransportTau(component, lifetime);
  }

  if (variant.endOfLife.transport.distance > 0) {
    const eolTkm = (totalMass * variant.endOfLife.transport.distance) / 1000;
    for (const mode of variant.endOfLife.transport.modes) {
      const erp = getErpEntry(mode.modeId);
      if (erp && erp.erp > 0) {
        totalTau += (eolTkm * mode.share) / erp.erp / lifetime;
      }
    }
  }

  return totalTau;
}

function calculateComponentTransportTau(component: ComponentItem, lifetime: number): number {
  if (component.transport.distance <= 0) return 0;

  const tkm = (component.mass * component.transport.distance) / 1000;
  let tau = 0;

  for (const mode of component.transport.modes) {
    const erp = getErpEntry(mode.modeId);
    if (erp && erp.erp > 0) {
      tau += (tkm * mode.share) / erp.erp / lifetime;
    }
  }

  return tau;
}
