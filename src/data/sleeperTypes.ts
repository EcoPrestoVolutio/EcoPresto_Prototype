import type { SleeperType, ComponentItem } from '../types';

export interface SleeperTypeDefinition {
  id: SleeperType;
  label: string;
  lifetime: number;
  installationTransportKm: number;
  defaultComponents: Omit<ComponentItem, 'id'>[];
}


export const sleeperTypes: SleeperTypeDefinition[] = [
  {
    id: 'concrete',
    label: 'Concrete Sleeper',
    lifetime: 40,
    installationTransportKm: 150,
    defaultComponents: [
      {
        name: 'Cement', icon: 'mountain', materialId: 'cement_unspecified', mass: 68,
        primaryContent: 1.0, manufacturingLossRate: 0.05,
        manufacturingLossTreatment: { collectionRate: 0.90, recyclingRate: 0, cascadingRate: 0.50, lossRate: 0.50 },
        eolTreatment: { collectionRate: 0.80, recyclingRate: 0, cascadingRate: 0.50, lossRate: 0.50 },
      },
      {
        name: 'Gravel', icon: 'mountain', materialId: 'gravel', mass: 170,
        primaryContent: 1.0, manufacturingLossRate: 0.02,
        manufacturingLossTreatment: { collectionRate: 0.95, recyclingRate: 0.90, cascadingRate: 0, lossRate: 0.10 },
        eolTreatment: { collectionRate: 0.90, recyclingRate: 0.80, cascadingRate: 0.10, lossRate: 0.10 },
      },
      {
        name: 'Reinforcement Steel', icon: 'shield', materialId: 'steel_low_alloyed', mass: 8,
        primaryContent: 0.70, manufacturingLossRate: 0.02,
        manufacturingLossTreatment: { collectionRate: 1.0, recyclingRate: 0.90, cascadingRate: 0, lossRate: 0.10 },
        eolTreatment: { collectionRate: 1.0, recyclingRate: 0.90, cascadingRate: 0, lossRate: 0.10 },
      },
      {
        name: 'PUR Sole', icon: 'gem', materialId: 'pur_foam', mass: 4,
        primaryContent: 1.0, manufacturingLossRate: 0.10,
        manufacturingLossTreatment: { collectionRate: 0.50, recyclingRate: 0, cascadingRate: 0.30, lossRate: 0.70 },
        eolTreatment: { collectionRate: 0.30, recyclingRate: 0, cascadingRate: 0, lossRate: 1.0 },
      },
    ],
  },
  {
    id: 'wood',
    label: 'Wood Sleeper',
    lifetime: 25,
    installationTransportKm: 500,
    defaultComponents: [
      {
        name: 'Hardwood', icon: 'tree-pine', materialId: 'hardwood', mass: 70,
        primaryContent: 1.0, manufacturingLossRate: 0.10,
        manufacturingLossTreatment: { collectionRate: 1.0, recyclingRate: 0, cascadingRate: 0.90, lossRate: 0.10 },
        eolTreatment: { collectionRate: 1.0, recyclingRate: 0, cascadingRate: 0, lossRate: 1.0 },
      },
      {
        name: 'Low-alloyed Steel', icon: 'shield', materialId: 'steel_low_alloyed', mass: 20,
        primaryContent: 1.0, manufacturingLossRate: 0.10,
        manufacturingLossTreatment: { collectionRate: 1.0, recyclingRate: 0.90, cascadingRate: 0, lossRate: 0.10 },
        eolTreatment: { collectionRate: 1.0, recyclingRate: 0.90, cascadingRate: 0, lossRate: 0.10 },
      },
      {
        name: 'Carbolineum', icon: 'flask', materialId: 'carbolineum', mass: 12,
        primaryContent: 1.0, manufacturingLossRate: 0.10,
        manufacturingLossTreatment: { collectionRate: 1.0, recyclingRate: 0, cascadingRate: 0, lossRate: 1.0 },
        eolTreatment: { collectionRate: 0.50, recyclingRate: 0, cascadingRate: 0, lossRate: 1.0 },
      },
    ],
  },
  {
    id: 'sicut',
    label: 'SICUT Sleeper',
    lifetime: 20,
    installationTransportKm: 600,
    defaultComponents: [
      {
        name: 'PET', icon: 'gem', materialId: 'pet', mass: 65,
        primaryContent: 0.0, manufacturingLossRate: 0.10,
        manufacturingLossTreatment: { collectionRate: 1.0, recyclingRate: 0.90, cascadingRate: 0, lossRate: 0.10 },
        eolTreatment: { collectionRate: 1.0, recyclingRate: 0, cascadingRate: 0, lossRate: 1.0 },
      },
      {
        name: 'Glass Fibre', icon: 'cylinder', materialId: 'glass_fibre', mass: 20,
        primaryContent: 1.0, manufacturingLossRate: 0.10,
        manufacturingLossTreatment: { collectionRate: 1.0, recyclingRate: 0.90, cascadingRate: 0, lossRate: 0.10 },
        eolTreatment: { collectionRate: 1.0, recyclingRate: 0, cascadingRate: 0, lossRate: 1.0 },
      },
    ],
  },
];

export function getSleeperType(id: SleeperType): SleeperTypeDefinition | undefined {
  return sleeperTypes.find(s => s.id === id);
}

export const SLEEPER_TYPE_OPTIONS = sleeperTypes.map(s => ({ value: s.id, label: s.label }));
