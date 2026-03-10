import type { TransportMix } from '../types';

export const defaultTransportMixes: TransportMix[] = [
  {
    id: 'basic_land',
    name: 'Basic Land',
    type: 'land',
    modes: [
      { modeId: 'trans_train_diesel', share: 0.20 },
      { modeId: 'trans_train_electric', share: 0.80 },
    ],
  },
  {
    id: 'green_land',
    name: 'Green Land',
    type: 'land',
    modes: [
      { modeId: 'trans_train_electric', share: 1.0 },
    ],
  },
  {
    id: 'basic_overseas',
    name: 'Basic Overseas',
    type: 'overseas',
    modes: [
      { modeId: 'trans_train_electric', share: 0.50 },
      { modeId: 'trans_sea', share: 0.50 },
    ],
  },
  {
    id: 'green_overseas',
    name: 'Green Overseas',
    type: 'overseas',
    modes: [
      { modeId: 'trans_sea', share: 1.0 },
    ],
  },
];
