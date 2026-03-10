import type { ERPEntry } from '../types';

export const erpDatabase: ERPEntry[] = [
  // Electricity sources
  { id: 'el_coal', name: 'Electricity, coal', category: 'electricity', unit: 'kWh', erp: 7.57e11, limitingBoundary: 'CO2' },
  { id: 'el_gas', name: 'Electricity, gas', category: 'electricity', unit: 'kWh', erp: 1.42e12, limitingBoundary: 'CO2' },
  { id: 'el_nuclear', name: 'Electricity, nuclear', category: 'electricity', unit: 'kWh', erp: 7.03e12, limitingBoundary: 'CO2' },
  { id: 'el_hydro', name: 'Electricity, hydro', category: 'electricity', unit: 'kWh', erp: 3.67e12, limitingBoundary: 'biophysical' },
  { id: 'el_wind_on', name: 'Electricity, wind onshore', category: 'electricity', unit: 'kWh', erp: 1.13e12, limitingBoundary: 'biophysical' },
  { id: 'el_wind_off', name: 'Electricity, wind offshore', category: 'electricity', unit: 'kWh', erp: 8.45e11, limitingBoundary: 'biophysical' },
  { id: 'el_pv_roof', name: 'Electricity, PV rooftop', category: 'electricity', unit: 'kWh', erp: 2.81e13, limitingBoundary: 'CO2' },
  { id: 'el_pv_desert', name: 'Electricity, PV desert', category: 'electricity', unit: 'kWh', erp: 4.12e13, limitingBoundary: 'CO2' },
  { id: 'el_geothermal', name: 'Electricity, geothermal', category: 'electricity', unit: 'kWh', erp: 5.21e12, limitingBoundary: 'CO2' },
  { id: 'el_wood', name: 'Electricity, wood biomass', category: 'electricity', unit: 'kWh', erp: 2.34e12, limitingBoundary: 'biophysical' },

  // Heat sources
  { id: 'ht_gas', name: 'Heat, natural gas', category: 'heat', unit: 'kWh', erp: 6.02e13, limitingBoundary: 'CO2' },
  { id: 'ht_propane', name: 'Heat, propane', category: 'heat', unit: 'kWh', erp: 4.81e13, limitingBoundary: 'CO2' },
  { id: 'ht_oil', name: 'Heat, oil', category: 'heat', unit: 'kWh', erp: 3.25e13, limitingBoundary: 'CO2' },
  { id: 'ht_wood', name: 'Heat, wood', category: 'heat', unit: 'kWh', erp: 4.48e12, limitingBoundary: 'biophysical' },
  { id: 'ht_solar', name: 'Heat, solar thermal', category: 'heat', unit: 'kWh', erp: 8.38e14, limitingBoundary: 'biophysical' },
  { id: 'ht_heatpump', name: 'Heat, heat pump', category: 'heat', unit: 'kWh', erp: 1.5e14, limitingBoundary: 'CO2' },

  // Transport modes
  { id: 'trans_train_diesel', name: 'Freight train, diesel', category: 'transport', unit: 'tkm', erp: 4.82e13, limitingBoundary: 'CO2' },
  { id: 'trans_train_electric', name: 'Freight train, electric', category: 'transport', unit: 'tkm', erp: 6.97e13, limitingBoundary: 'CO2' },
  { id: 'trans_lorry', name: 'Transport, lorry', category: 'transport', unit: 'tkm', erp: 3.44e12, limitingBoundary: 'CO2' },
  { id: 'trans_sea', name: 'Transport, sea', category: 'transport', unit: 'tkm', erp: 9.07e13, limitingBoundary: 'CO2' },
  { id: 'trans_air', name: 'Transport, air freight', category: 'transport', unit: 'tkm', erp: 2.15e11, limitingBoundary: 'CO2' },

  // Materials
  { id: 'cement_unspecified', name: 'Cement, unspecified', category: 'material', unit: 'kg', erp: 1.32e12, limitingBoundary: 'CO2' },
  { id: 'gravel', name: 'Gravel, crushed', category: 'material', unit: 'kg', erp: 7.37e13, limitingBoundary: 'CO2' },
  { id: 'hardwood', name: 'Sawnwood, beam, hardwood', category: 'material', unit: 'kg', erp: 3.0e12, limitingBoundary: 'biophysical' },
  { id: 'steel_low_alloyed', name: 'Steel, low-alloyed', category: 'material', unit: 'kg', erp: 4.34e11, limitingBoundary: 'CO2' },
  { id: 'pet', name: 'Polyethylene terephthalate (PET)', category: 'material', unit: 'kg', erp: 1.78e11, limitingBoundary: 'CO2' },
  { id: 'glass_fibre', name: 'Glass fibre', category: 'material', unit: 'kg', erp: 3.82e11, limitingBoundary: 'CO2' },
  { id: 'pur_foam', name: 'Polyurethane, rigid foam', category: 'material', unit: 'kg', erp: 1.21e11, limitingBoundary: 'CO2' },
  { id: 'carbolineum', name: 'Wood preservative, creosote', category: 'material', unit: 'kg', erp: 2.47e11, limitingBoundary: 'CO2' },
  { id: 'softwood', name: 'Sawnwood, beam, softwood', category: 'material', unit: 'kg', erp: 4.5e12, limitingBoundary: 'biophysical' },
  { id: 'aluminium', name: 'Aluminium, primary', category: 'material', unit: 'kg', erp: 1.89e11, limitingBoundary: 'CO2' },
  { id: 'copper', name: 'Copper, primary', category: 'material', unit: 'kg', erp: 9.45e10, limitingBoundary: 'CO2' },
  { id: 'stainless_steel', name: 'Steel, chromium stainless', category: 'material', unit: 'kg', erp: 2.67e11, limitingBoundary: 'CO2' },
];

export function getErpEntry(id: string): ERPEntry | undefined {
  return erpDatabase.find(e => e.id === id);
}

export function getErpEntriesByCategory(category: ERPEntry['category']): ERPEntry[] {
  return erpDatabase.filter(e => e.category === category);
}
