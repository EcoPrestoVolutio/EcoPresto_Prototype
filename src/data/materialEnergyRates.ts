import type { MaterialEnergyRates } from '../types';

export const materialEnergyRates: MaterialEnergyRates[] = [
  { materialId: 'cement_unspecified', electricityManufRate: 0.1, electricityRecycleRate: 0.1, heatManufRate: 0, heatRecycleRate: 0 },
  { materialId: 'gravel', electricityManufRate: 0.1, electricityRecycleRate: 0.1, heatManufRate: 0, heatRecycleRate: 0 },
  { materialId: 'steel_low_alloyed', electricityManufRate: 1, electricityRecycleRate: 2, heatManufRate: 0, heatRecycleRate: 0 },
  { materialId: 'pur_foam', electricityManufRate: 1, electricityRecycleRate: 1, heatManufRate: 0, heatRecycleRate: 0 },
  { materialId: 'hardwood', electricityManufRate: 0, electricityRecycleRate: 0.1, heatManufRate: 0, heatRecycleRate: 0 },
  { materialId: 'oak', electricityManufRate: 0, electricityRecycleRate: 0.1, heatManufRate: 0, heatRecycleRate: 0 },
  { materialId: 'carbolineum', electricityManufRate: 20, electricityRecycleRate: 0, heatManufRate: 1, heatRecycleRate: 0 },
  { materialId: 'pet', electricityManufRate: 1, electricityRecycleRate: 1, heatManufRate: 0, heatRecycleRate: 0 },
  { materialId: 'glass_fibre', electricityManufRate: 1, electricityRecycleRate: 1, heatManufRate: 3, heatRecycleRate: 3 },
  { materialId: 'softwood', electricityManufRate: 0, electricityRecycleRate: 0.1, heatManufRate: 0, heatRecycleRate: 0 },
  { materialId: 'aluminium', electricityManufRate: 15, electricityRecycleRate: 1.5, heatManufRate: 0, heatRecycleRate: 0 },
  { materialId: 'copper', electricityManufRate: 5, electricityRecycleRate: 2, heatManufRate: 0, heatRecycleRate: 0 },
  { materialId: 'stainless_steel', electricityManufRate: 3, electricityRecycleRate: 2.5, heatManufRate: 0, heatRecycleRate: 0 },
];

export function getMaterialEnergyRate(materialId: string): MaterialEnergyRates | undefined {
  return materialEnergyRates.find(r => r.materialId === materialId);
}
