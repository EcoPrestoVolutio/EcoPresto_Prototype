import type { TransportModeDefinition } from '../types';

export const transportModes: TransportModeDefinition[] = [
  { id: 'trans_train_diesel', name: 'Freight train (diesel)', erpId: 'trans_train_diesel' },
  { id: 'trans_train_electric', name: 'Freight train (electric)', erpId: 'trans_train_electric' },
  { id: 'trans_lorry', name: 'Lorry (truck)', erpId: 'trans_lorry' },
  { id: 'trans_sea', name: 'Sea shipping', erpId: 'trans_sea' },
  { id: 'trans_air', name: 'Air freight', erpId: 'trans_air' },
];

export function getTransportMode(id: string): TransportModeDefinition | undefined {
  return transportModes.find(m => m.id === id);
}
