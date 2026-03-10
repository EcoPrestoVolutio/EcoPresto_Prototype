import type { ComponentItem, MaterialEnergyRates, EnergyMix } from '../types';

export const HEAT_PUMP_FACTOR = 0.33;
export const HEAT_PUMP_SOURCE_ID = 'ht_heatpump';

export interface ElectricityBreakdown {
  manufacture: number;
  heatPump: number;
  recycleCascade: number;
  total: number;
}

export interface HeatBreakdown {
  manufacture: number;
  recycleCascade: number;
  totalProduced: number;
  heatPumpShare: number;
  fromHeatPump: number;
  netHeat: number;
}

export function computeHeatBreakdown(
  components: ComponentItem[],
  getMaterialRate: (id: string) => MaterialEnergyRates | undefined,
  heatMix?: EnergyMix,
): HeatBreakdown {
  let manufacture = 0;
  let recycleCascade = 0;

  for (const comp of components) {
    const rate = getMaterialRate(comp.materialId);
    if (!rate) continue;

    const massRequired = comp.mass * (1 + comp.manufacturingLossRate);
    manufacture += massRequired * rate.heatManufRate;

    const manufLossKg = comp.mass * comp.manufacturingLossRate;
    const manufCollected = manufLossKg * comp.manufacturingLossTreatment.collectionRate;
    const eolCollected = comp.mass * comp.eolTreatment.collectionRate;
    recycleCascade += (manufCollected + eolCollected) * rate.heatRecycleRate;
  }

  const totalProduced = manufacture + recycleCascade;

  const heatPumpShare = heatMix
    ? heatMix.sources.find(s => s.erpId === HEAT_PUMP_SOURCE_ID)?.share ?? 0
    : 0;

  const fromHeatPump = totalProduced * heatPumpShare;
  const netHeat = totalProduced - fromHeatPump;

  return { manufacture, recycleCascade, totalProduced, heatPumpShare, fromHeatPump, netHeat };
}

export function computeElectricityBreakdown(
  components: ComponentItem[],
  getMaterialRate: (id: string) => MaterialEnergyRates | undefined,
  heatBreakdown: HeatBreakdown,
): ElectricityBreakdown {
  let manufacture = 0;
  let recycleCascade = 0;

  for (const comp of components) {
    const rate = getMaterialRate(comp.materialId);
    if (!rate) continue;

    const massRequired = comp.mass * (1 + comp.manufacturingLossRate);
    manufacture += massRequired * rate.electricityManufRate;

    const manufLossKg = comp.mass * comp.manufacturingLossRate;
    const manufCollected = manufLossKg * comp.manufacturingLossTreatment.collectionRate;
    const eolCollected = comp.mass * comp.eolTreatment.collectionRate;
    recycleCascade += (manufCollected + eolCollected) * rate.electricityRecycleRate;
  }

  const heatPump = heatBreakdown.fromHeatPump > 0
    ? heatBreakdown.fromHeatPump * HEAT_PUMP_FACTOR
    : 0;

  return {
    manufacture,
    heatPump,
    recycleCascade,
    total: manufacture + heatPump + recycleCascade,
  };
}
