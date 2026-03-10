import type { EnergyMix } from '../types';

export const energyMixes: EnergyMix[] = [
  {
    id: 'ch_grid_basic',
    name: 'CH Grid Basic',
    type: 'electricity',
    sources: [
      { erpId: 'el_gas', share: 0.019 },
      { erpId: 'el_nuclear', share: 0.289 },
      { erpId: 'el_wind_on', share: 0.01 },
      { erpId: 'el_wood', share: 0.02 },
      { erpId: 'el_hydro', share: 0.6435 },
      { erpId: 'el_pv_roof', share: 0.0185 },
    ],
  },
  {
    id: 'ch_grid_green',
    name: 'CH Grid Green',
    type: 'electricity',
    sources: [
      { erpId: 'el_wind_on', share: 0.10 },
      { erpId: 'el_wood', share: 0.02 },
      { erpId: 'el_hydro', share: 0.38 },
      { erpId: 'el_pv_roof', share: 0.50 },
    ],
  },
  {
    id: 'renewable_100',
    name: '100% Renewable',
    type: 'electricity',
    sources: [
      { erpId: 'el_hydro', share: 0.40 },
      { erpId: 'el_wind_on', share: 0.30 },
      { erpId: 'el_pv_roof', share: 0.30 },
    ],
  },
  {
    id: 'heat_basic',
    name: 'Heat Basic',
    type: 'heat',
    sources: [
      { erpId: 'ht_gas', share: 0.50 },
      { erpId: 'ht_oil', share: 0.50 },
    ],
  },
  {
    id: 'heat_green',
    name: 'Heat Green',
    type: 'heat',
    sources: [
      { erpId: 'ht_solar', share: 0.50 },
      { erpId: 'ht_heatpump', share: 0.50 },
    ],
  },
];

export function getElectricityMixes(): EnergyMix[] {
  return energyMixes.filter(m => m.type === 'electricity');
}

export function getHeatMixes(): EnergyMix[] {
  return energyMixes.filter(m => m.type === 'heat');
}

export function getMixById(id: string): EnergyMix | undefined {
  return energyMixes.find(m => m.id === id);
}
