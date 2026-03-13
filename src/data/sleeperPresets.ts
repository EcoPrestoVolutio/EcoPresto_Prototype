import type { Product } from '../types';

export const defaultProduct: Product = {
  id: 'sob-sleepers',
  name: 'Railway Sleepers',
  category: 'Infrastructure',
  variants: [
    {
      id: 'concrete-basic',
      name: 'Concrete Basic 40y',
      productInfo: {
        name: 'Railway Sleepers',
        category: 'Infrastructure',
        variantName: 'Concrete Basic 40y',
        sleeperType: 'concrete',
        totalMass: 250,
        componentCount: 4,
      },
      components: [
        {
          id: 'concrete-cement', name: 'Cement', icon: 'mountain', materialId: 'cement_unspecified', mass: 68,
          primaryContent: 1.0, manufacturingLossRate: 0.05,
          manufacturingLossTreatment: { collectionRate: 0.90, recyclingRate: 0.0, cascadingRate: 0.50, lossRate: 0.50 },
          eolTreatment: { collectionRate: 0.80, recyclingRate: 0.0, cascadingRate: 0.50, lossRate: 0.50 },
        },
        {
          id: 'concrete-gravel', name: 'Gravel', icon: 'mountain', materialId: 'gravel', mass: 170,
          primaryContent: 1.0, manufacturingLossRate: 0.02,
          manufacturingLossTreatment: { collectionRate: 0.95, recyclingRate: 0.90, cascadingRate: 0.0, lossRate: 0.10 },
          eolTreatment: { collectionRate: 0.90, recyclingRate: 0.80, cascadingRate: 0.10, lossRate: 0.10 },
        },
        {
          id: 'concrete-steel', name: 'Reinforcement Steel', icon: 'shield', materialId: 'steel_low_alloyed', mass: 8,
          primaryContent: 0.7, manufacturingLossRate: 0.02,
          manufacturingLossTreatment: { collectionRate: 1.0, recyclingRate: 0.90, cascadingRate: 0.0, lossRate: 0.10 },
          eolTreatment: { collectionRate: 1.0, recyclingRate: 0.90, cascadingRate: 0.0, lossRate: 0.10 },
        },
        {
          id: 'concrete-pur', name: 'PUR Sole', icon: 'gem', materialId: 'pur_foam', mass: 4,
          primaryContent: 1.0, manufacturingLossRate: 0.10,
          manufacturingLossTreatment: { collectionRate: 0.50, recyclingRate: 0.0, cascadingRate: 0.30, lossRate: 0.70 },
          eolTreatment: { collectionRate: 0.30, recyclingRate: 0.0, cascadingRate: 0.0, lossRate: 1.0 },
        },
      ],
      manufacturing: {
        electricity: { consumption: 80, mixId: 'ch_grid_basic' },
        heat: { consumption: 150, mixId: 'heat_basic' },
      },
      transportLand: { distance: 150, mixId: 'basic_land' },
      transportOverseas: { distance: 0, mixId: 'basic_overseas' },
      usePhase: { lifetime: 40 },
      endOfLife: {
        scenario: 'recycling',
        transport: { distance: 50, modes: [{ modeId: 'trans_lorry', share: 1.0 }] },
      },
    },
    {
      id: 'wood-basic',
      name: 'Wood Basic 25y',
      productInfo: {
        name: 'Railway Sleepers',
        category: 'Infrastructure',
        variantName: 'Wood Basic 25y',
        sleeperType: 'wood',
        totalMass: 102,
        componentCount: 3,
      },
      components: [
        {
          id: 'wood-bulk', name: 'Hardwood', icon: 'tree-pine', materialId: 'hardwood', mass: 70,
          primaryContent: 1.0, manufacturingLossRate: 0.10,
          manufacturingLossTreatment: { collectionRate: 1.0, recyclingRate: 0.0, cascadingRate: 0.90, lossRate: 0.10 },
          eolTreatment: { collectionRate: 1.0, recyclingRate: 0.0, cascadingRate: 0.0, lossRate: 1.0 },
        },
        {
          id: 'wood-steel', name: 'Low-alloyed Steel', icon: 'shield', materialId: 'steel_low_alloyed', mass: 20,
          primaryContent: 1.0, manufacturingLossRate: 0.10,
          manufacturingLossTreatment: { collectionRate: 1.0, recyclingRate: 0.90, cascadingRate: 0.0, lossRate: 0.10 },
          eolTreatment: { collectionRate: 1.0, recyclingRate: 0.90, cascadingRate: 0.0, lossRate: 0.10 },
        },
        {
          id: 'wood-chem', name: 'Carbolineum', icon: 'flask', materialId: 'carbolineum', mass: 12,
          primaryContent: 1.0, manufacturingLossRate: 0.10,
          manufacturingLossTreatment: { collectionRate: 1.0, recyclingRate: 0.0, cascadingRate: 0.0, lossRate: 1.0 },
          eolTreatment: { collectionRate: 0.50, recyclingRate: 0.0, cascadingRate: 0.0, lossRate: 1.0 },
        },
      ],
      manufacturing: {
        electricity: { consumption: 337.7, mixId: 'ch_grid_basic' },
        heat: { consumption: 13.2, mixId: 'heat_basic' },
      },
      transportLand: { distance: 500, mixId: 'basic_land' },
      transportOverseas: { distance: 0, mixId: 'basic_overseas' },
      usePhase: { lifetime: 25 },
      endOfLife: {
        scenario: 'recycling',
        transport: { distance: 100, modes: [{ modeId: 'trans_lorry', share: 1.0 }] },
      },
    },
    {
      id: 'sicut-basic-20',
      name: 'SICUT Basic 20y',
      productInfo: {
        name: 'Railway Sleepers',
        category: 'Infrastructure',
        variantName: 'SICUT Basic 20y',
        sleeperType: 'sicut',
        totalMass: 85,
        componentCount: 2,
      },
      components: [
        {
          id: 'sicut-pet', name: 'PET', icon: 'gem', materialId: 'pet', mass: 65,
          primaryContent: 0.0, manufacturingLossRate: 0.10,
          manufacturingLossTreatment: { collectionRate: 1.0, recyclingRate: 0.90, cascadingRate: 0.0, lossRate: 0.10 },
          eolTreatment: { collectionRate: 1.0, recyclingRate: 0.0, cascadingRate: 0.0, lossRate: 1.0 },
        },
        {
          id: 'sicut-glass', name: 'Glass Fibre', icon: 'cylinder', materialId: 'glass_fibre', mass: 20,
          primaryContent: 1.0, manufacturingLossRate: 0.10,
          manufacturingLossTreatment: { collectionRate: 1.0, recyclingRate: 0.90, cascadingRate: 0.0, lossRate: 0.10 },
          eolTreatment: { collectionRate: 1.0, recyclingRate: 0.0, cascadingRate: 0.0, lossRate: 1.0 },
        },
      ],
      manufacturing: {
        electricity: { consumption: 200, mixId: 'ch_grid_basic' },
        heat: { consumption: 300, mixId: 'heat_basic' },
      },
      transportLand: { distance: 600, mixId: 'basic_land' },
      transportOverseas: { distance: 0, mixId: 'basic_overseas' },
      usePhase: { lifetime: 20 },
      endOfLife: {
        scenario: 'recycling',
        transport: { distance: 200, modes: [{ modeId: 'trans_train_electric', share: 1.0 }] },
      },
    },
  ],
};
