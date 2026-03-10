export interface Product {
  id: string;
  name: string;
  category: string;
  variants: Variant[];
}

export interface Variant {
  id: string;
  name: string;
  productInfo: ProductInfo;
  components: ComponentItem[];
  manufacturing: Manufacturing;
  usePhase: UsePhase;
  endOfLife: EndOfLife;
  results?: CalculationResult;
}

export interface ProductInfo {
  name: string;
  category: string;
  variantName: string;
  totalWeight: number;
  componentCount: number;
}

export type ComponentIconId =
  | 'cube'
  | 'layers'
  | 'mountain'
  | 'droplet'
  | 'flask'
  | 'shield'
  | 'tree-pine'
  | 'gem'
  | 'bolt'
  | 'circle-dot'
  | 'box'
  | 'cylinder';

export interface ComponentItem {
  id: string;
  name: string;
  icon: ComponentIconId;
  materialId: string;
  mass: number;
  primaryMaterialContent: number;
  productionLoss: number;
  productionLossTreatment: LossTreatment;
  transport: TransportConfig;
}

export interface LossTreatment {
  recyclingWithoutLoss: number;
  recyclingWithLoss: number;
  disposal: number;
}

export interface TransportConfig {
  distance: number;
  modes: TransportModeEntry[];
}

export interface TransportModeEntry {
  modeId: string;
  share: number;
}

export interface Manufacturing {
  electricity: EnergyInput;
  heat: EnergyInput;
}

export interface EnergyInput {
  consumption: number;
  mixId: string;
}

export interface UsePhase {
  lifetime: number;
}

export interface EndOfLife {
  scenario: 'recycling' | 'cascading' | 'disposal';
  transport: TransportConfig;
  materialRecycling: MaterialRecyclingEntry[];
}

export interface MaterialRecyclingEntry {
  componentId: string;
  recyclingWithoutLoss: number;
  recyclingWithLoss: number;
  disposal: number;
}

export interface ERPEntry {
  id: string;
  name: string;
  category: 'material' | 'electricity' | 'heat' | 'transport';
  unit: string;
  erp: number;
  limitingBoundary: 'CO2' | 'biophysical' | 'biodiversity';
}

export interface EnergyMix {
  id: string;
  name: string;
  type: 'electricity' | 'heat';
  sources: EnergySource[];
}

export interface EnergySource {
  erpId: string;
  share: number;
}

export interface TransportModeDefinition {
  id: string;
  name: string;
  erpId: string;
}

export interface CalculationResult {
  totalTau: number;
  breakdown: TauBreakdown[];
  timestamp: Date;
}

export interface TauBreakdown {
  category: 'Material' | 'Energy' | 'Transport';
  name: string;
  tau: number;
  percentage: number;
  color: string;
}

export type SectionId =
  | 'product-info'
  | `component-${number}`
  | 'manufacturing'
  | 'use-phase'
  | 'end-of-life';
