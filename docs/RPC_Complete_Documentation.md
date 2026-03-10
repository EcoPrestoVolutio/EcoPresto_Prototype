# Resource Pressure Calculator (RPC)
## Complete Platform Documentation

**Client:** SOB (Schweizerische Südostbahn)  
**Methodology:** ERA (Ecological Resource Availability) - Desing et al., 2020  
**Version:** 1.0  
**Date:** March 2025

---

# Table of Contents

1. [Product Requirements Document (PRD)](#part-1-product-requirements-document-prd)
2. [Technical Requirements Document (TRD)](#part-2-technical-requirements-document-trd)
3. [Excel Workbook Analysis](#part-3-excel-workbook-analysis)
4. [UX Flow & Design Guide](#part-4-ux-flow--design-guide)

---

# Part 1: Product Requirements Document (PRD)

## 1.1 Executive Summary

### Problem Statement

Railway infrastructure companies need to assess the environmental sustainability of different sleeper types (wood, concrete, synthetic) to make informed procurement decisions. Currently, this analysis is performed using a complex Excel workbook that:

- Requires specialized knowledge to operate
- Is prone to input errors
- Cannot easily compare multiple product variants
- Lacks visual feedback during configuration
- Is difficult to share or collaborate on

### Solution

The **Resource Pressure Calculator (RPC)** is a web-based application that transforms the ERA methodology Excel workbook into an intuitive, visual tool for calculating and comparing the Resource Pressure (τ) of railway sleepers and other products.

### Value Proposition

| Stakeholder | Value |
|-------------|-------|
| **Infrastructure Planners** | Quick, visual comparison of sleeper sustainability |
| **Procurement Teams** | Data-driven supplier selection based on environmental metrics |
| **Sustainability Officers** | Standardized reporting on infrastructure environmental impact |
| **Management** | Clear visualizations for board presentations and ESG reporting |

## 1.2 Project Scope

### In Scope (Phase 1 - Frontend Prototype)

- Web-based UI representing the Excel workbook functionality
- Configuration of product variants with multiple components
- Real-time τ calculation and visualization
- Side-by-side comparison of up to 5 variants
- Pre-configured sleeper data (Wood, Concrete, SICUT) for SOB
- Mass flow diagram visualization
- Stacked bar chart for results comparison
- Export functionality (PDF report)

### Out of Scope (Phase 1)

- User authentication and multi-tenancy
- Backend API and database persistence
- Custom product/material creation
- ERP database editing
- White-label deployment
- Mobile-responsive design

### Future Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| Phase 2 | Backend API, data persistence, user accounts | TBD |
| Phase 3 | Custom product builder, organization settings | TBD |
| Phase 4 | Multi-tenant SaaS, API access, integrations | TBD |

## 1.3 Core Concepts

### What is Resource Pressure (τ)?

**Resource Pressure (τ)** is a dimensionless metric that represents the fraction of Earth's sustainable annual resource budget consumed by a single product over its lifetime.

```
τ = Σ (Resource Consumption / Ecological Resource Potential) × (1 / Lifetime)
```

**Key Properties:**
- **Lower τ = More Sustainable**
- Typical values: 10⁻¹² to 10⁻¹¹
- Allows comparison across different product types
- Based on absolute Earth system boundaries (not relative benchmarks)

### What is ERA?

The **Ecological Resource Availability (ERA)** methodology (Desing et al., 2020) translates planetary boundaries into practical resource budgets. It provides:

- **ERP (Ecological Resource Potential)**: Maximum sustainable production per year for materials, energy, and transport
- **Limiting Boundaries**: The Earth system constraint that limits each resource (CO₂ emissions or biophysical capacity)

### Product Structure

```
Product (e.g., Railway Sleeper)
├── Variant 1 (e.g., "Beton Basic 40y")
│   ├── Product Info (name, category, weight, lifetime)
│   ├── Component 1 (e.g., Cement)
│   │   ├── Material type, mass, primary content
│   │   ├── Production losses & treatment
│   │   └── Transport (mode, distance)
│   ├── Component 2 (e.g., Gravel)
│   ├── Manufacturing (electricity, heat)
│   ├── Use Phase (lifetime, maintenance)
│   └── End of Life (recycling, cascading, disposal)
├── Variant 2 (e.g., "Beton Green 40y")
└── Variant 3 (e.g., "Beton Extended 50y")
```

## 1.4 User Personas

### Primary: Infrastructure Sustainability Analyst

**Profile:** Sarah, 35, Environmental Engineer at SOB
**Goals:**
- Compare environmental impact of different sleeper suppliers
- Generate reports for procurement decisions
- Track sustainability KPIs for infrastructure projects

**Pain Points:**
- Current Excel is complex and error-prone
- Difficult to present findings to non-technical stakeholders
- No easy way to test "what-if" scenarios

### Secondary: Procurement Manager

**Profile:** Thomas, 48, Procurement Lead at SOB
**Goals:**
- Select suppliers based on sustainability criteria
- Justify procurement decisions with data
- Meet regulatory environmental requirements

**Pain Points:**
- Doesn't understand technical sustainability metrics
- Needs clear visual comparisons
- Requires exportable reports for documentation

## 1.5 Functional Requirements

### FR-1: Variant Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | User can create up to 5 product variants | Must |
| FR-1.2 | Each variant has independent configuration | Must |
| FR-1.3 | Variants are displayed as tabs at top of screen | Must |
| FR-1.4 | User can rename variants | Should |
| FR-1.5 | User can duplicate a variant | Should |
| FR-1.6 | User can delete a variant (except last one) | Must |

### FR-2: Product Information

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | User can enter product name | Must |
| FR-2.2 | User can select product category from dropdown | Must |
| FR-2.3 | User can enter variant name | Must |
| FR-2.4 | User can enter total weight in kg | Must |
| FR-2.5 | User can specify number of components | Must |
| FR-2.6 | User can upload product image | Could |

### FR-3: Component Configuration

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | User can add/remove components | Must |
| FR-3.2 | User can select material type from ERP database | Must |
| FR-3.3 | User can enter component mass in kg | Must |
| FR-3.4 | User can set primary material percentage (0-100%) via slider | Must |
| FR-3.5 | User can set production loss percentage via slider | Must |
| FR-3.6 | User can configure production loss treatment (recycling rates) | Must |
| FR-3.7 | User can enter transport distance in km | Must |
| FR-3.8 | User can select transport mode(s) and percentages | Must |

### FR-4: Manufacturing Configuration

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | User can enter electricity consumption in kWh | Must |
| FR-4.2 | User can select electricity source mix | Must |
| FR-4.3 | User can enter heat consumption in kWh | Must |
| FR-4.4 | User can select heat source mix | Must |

### FR-5: Use Phase Configuration

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | User can enter product lifetime in years | Must |
| FR-5.2 | Lifetime affects τ calculation proportionally | Must |

### FR-6: End of Life Configuration

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | User can select end-of-life scenario (Recycling/Cascading/Disposal) | Must |
| FR-6.2 | User can set recycling rates per material via sliders | Must |
| FR-6.3 | User can distinguish recycling with/without quality loss | Should |
| FR-6.4 | User can configure disposal transport | Must |

### FR-7: Visualization

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-7.1 | System displays mass flow diagram (Sankey-style) | Must |
| FR-7.2 | Mass flow updates in real-time as user configures | Must |
| FR-7.3 | System displays τ result for current variant | Must |
| FR-7.4 | System displays stacked bar chart comparing all variants | Must |
| FR-7.5 | Bar chart shows component breakdown (materials, energy, transport) | Must |
| FR-7.6 | Charts update automatically when configuration changes | Must |

### FR-8: Calculation

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-8.1 | System calculates τ for each component | Must |
| FR-8.2 | System sums component τ values for total | Must |
| FR-8.3 | Calculation uses ERP values from embedded database | Must |
| FR-8.4 | Calculation matches Excel workbook formulas | Must |

### FR-9: Export

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-9.1 | User can export results to PDF | Should |
| FR-9.2 | PDF includes configuration summary and charts | Should |
| FR-9.3 | User can export data to CSV | Could |

## 1.6 Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | τ calculation completes within 100ms |
| **Performance** | Charts update within 200ms of input change |
| **Usability** | User can configure a variant in under 5 minutes |
| **Usability** | No training required for basic operation |
| **Compatibility** | Works on Chrome, Firefox, Safari, Edge (latest versions) |
| **Accessibility** | WCAG 2.1 AA compliance for color contrast |
| **Localization** | German language UI (primary), English (secondary) |

## 1.7 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Calculation Accuracy | 100% match with Excel | Automated test suite |
| User Task Completion | 90% complete variant in <5 min | User testing |
| Comparison Clarity | 95% correctly identify best variant | User testing |
| Export Usefulness | 80% find reports useful | Survey |

## 1.8 Assumptions & Constraints

### Assumptions

- Users have basic understanding of environmental assessment concepts
- ERP database values are stable (ecoinvent 3.9)
- Three sleeper types (Wood, Concrete, SICUT) are sufficient for initial release
- Client will provide actual material/energy data for their products

### Constraints

- ERP database is licensed to client; cannot be redistributed
- Must match existing Excel calculation methodology exactly
- German language is primary requirement
- No backend infrastructure available for Phase 1 (frontend-only)

## 1.9 Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Calculation mismatch with Excel | High | Medium | Comprehensive test suite against Excel outputs |
| User confusion with scientific notation | Medium | High | Add tooltips, use friendly number formatting |
| Complex form overwhelms users | Medium | Medium | Progressive disclosure, section-based navigation |
| Performance issues with real-time calculation | Low | Low | Debounce inputs, optimize calculation logic |

## 1.10 Open Questions

| # | Question | Status | Decision |
|---|----------|--------|----------|
| 1 | Should energy mixes be fully customizable or preset (basic/green)? | Open | |
| 2 | How many decimal places for τ display? | Open | |
| 3 | Should the Sankey diagram be interactive? | Open | |
| 4 | Is print-friendly view required? | Open | |
| 5 | Should variant comparison include % difference from baseline? | Open | |

---

# Part 2: Technical Requirements Document (TRD)

## 2.1 Overview

This TRD describes the technical implementation of a **frontend-only prototype** for the Resource Pressure Calculator, configured with SOB's railway sleeper data.

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | React 18 | Component-based, wide adoption |
| **Styling** | Tailwind CSS | Rapid prototyping, utility-first |
| **Charts** | Recharts | React-native, composable |
| **Diagrams** | Custom SVG / D3.js | Sankey diagram flexibility |
| **State** | React useState/useReducer | Simple, no external dependencies |
| **Build** | Vite | Fast HMR, modern bundling |
| **Language** | TypeScript | Type safety for calculations |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Application                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Pages     │  │ Components  │  │   Hooks     │             │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤             │
│  │ ProductView │  │ VariantTabs │  │ useCalculate│             │
│  │ ResultsView │  │ SectionNav  │  │ useVariants │             │
│  │ CompareView │  │ FormFields  │  │ useDebounce │             │
│  └─────────────┘  │ SankeyChart │  └─────────────┘             │
│                   │ BarChart    │                               │
│                   │ SliderInput │                               │
│                   └─────────────┘                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    Data     │  │   Utils     │  │   Types     │             │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤             │
│  │ erpDatabase │  │ calculate   │  │ Variant     │             │
│  │ sleeperData │  │ formatTau   │  │ Component   │             │
│  │ energyMixes │  │ validateIn  │  │ Material    │             │
│  │ transportMo │  │             │  │ EnergyMix   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

## 2.2 Data Structures

### Type Definitions

```typescript
// Core Types
interface Product {
  id: string;
  name: string;
  category: string;
  variants: Variant[];
}

interface Variant {
  id: string;
  name: string;
  productInfo: ProductInfo;
  components: Component[];
  manufacturing: Manufacturing;
  usePhase: UsePhase;
  endOfLife: EndOfLife;
  results?: CalculationResult;
}

interface ProductInfo {
  name: string;
  category: string;
  variantName: string;
  totalWeight: number; // kg
  componentCount: number;
  imageUrl?: string;
}

interface Component {
  id: string;
  name: string;
  materialId: string; // Reference to ERP database
  mass: number; // kg
  primaryMaterialContent: number; // 0-1
  productionLoss: number; // 0-1
  productionLossTreatment: LossTreatment;
  transport: TransportConfig;
}

interface LossTreatment {
  recyclingWithoutLoss: number; // 0-1
  recyclingWithLoss: number; // 0-1
  disposal: number; // 0-1 (calculated: 1 - above)
}

interface TransportConfig {
  distance: number; // km
  modes: TransportMode[];
}

interface TransportMode {
  modeId: string; // Reference to transport ERP
  share: number; // 0-1, must sum to 1
}

interface Manufacturing {
  electricity: EnergyInput;
  heat: EnergyInput;
}

interface EnergyInput {
  consumption: number; // kWh
  mixId: string; // Reference to energy mix
}

interface UsePhase {
  lifetime: number; // years
}

interface EndOfLife {
  scenario: 'recycling' | 'cascading' | 'disposal';
  transport: TransportConfig;
  materialRecycling: MaterialRecycling[];
}

interface MaterialRecycling {
  materialId: string;
  recyclingWithoutLoss: number;
  recyclingWithLoss: number;
  disposal: number;
}

// Reference Data Types
interface ERPEntry {
  id: string;
  name: string;
  nameDe: string;
  category: 'material' | 'electricity' | 'heat' | 'transport';
  unit: string;
  erp: number; // Ecological Resource Potential [FU/year]
  limitingBoundary: 'CO2' | 'biophysical' | 'biodiversity';
}

interface EnergyMix {
  id: string;
  name: string;
  nameDe: string;
  sources: EnergySource[];
}

interface EnergySource {
  erpId: string;
  share: number; // 0-1
}

// Calculation Results
interface CalculationResult {
  totalTau: number;
  breakdown: TauBreakdown[];
  timestamp: Date;
}

interface TauBreakdown {
  category: string;
  name: string;
  tau: number;
  percentage: number;
  color: string;
}
```

## 2.3 Pre-configured Data

### SOB Sleeper Configurations

```typescript
const sobSleeperData: Product = {
  id: 'sob-sleepers',
  name: 'Bahnschwellen',
  category: 'Infrastruktur',
  variants: [
    // Wood Sleeper - Basic
    {
      id: 'wood-basic',
      name: 'Holzschwelle Basic',
      productInfo: {
        name: 'Bahnschwellen',
        category: 'Infrastruktur',
        variantName: 'Holz Basic 25J',
        totalWeight: 100,
        componentCount: 3
      },
      components: [
        {
          id: 'wood-bulk',
          name: 'Hartholz',
          materialId: 'hardwood',
          mass: 80,
          primaryMaterialContent: 1.0,
          productionLoss: 0.40, // 40% sawing losses
          productionLossTreatment: {
            recyclingWithoutLoss: 0,
            recyclingWithLoss: 0.5,
            disposal: 0.5
          },
          transport: {
            distance: 500,
            modes: [
              { modeId: 'trans_train_diesel', share: 0.2 },
              { modeId: 'trans_train_electric', share: 0.8 }
            ]
          }
        },
        {
          id: 'wood-chem',
          name: 'Carbolineum',
          materialId: 'carbolineum',
          mass: 16,
          primaryMaterialContent: 1.0,
          productionLoss: 0.05,
          productionLossTreatment: {
            recyclingWithoutLoss: 0,
            recyclingWithLoss: 0,
            disposal: 1.0
          },
          transport: {
            distance: 200,
            modes: [{ modeId: 'trans_lorry', share: 1.0 }]
          }
        },
        {
          id: 'wood-steel',
          name: 'Rippenplatte',
          materialId: 'steel_low_alloyed',
          mass: 4,
          primaryMaterialContent: 0.7,
          productionLoss: 0.02,
          productionLossTreatment: {
            recyclingWithoutLoss: 0.9,
            recyclingWithLoss: 0.1,
            disposal: 0
          },
          transport: {
            distance: 100,
            modes: [{ modeId: 'trans_lorry', share: 1.0 }]
          }
        }
      ],
      manufacturing: {
        electricity: { consumption: 50, mixId: 'ch_grid_basic' },
        heat: { consumption: 20, mixId: 'heat_basic' }
      },
      usePhase: { lifetime: 25 },
      endOfLife: {
        scenario: 'recycling',
        transport: {
          distance: 100,
          modes: [{ modeId: 'trans_lorry', share: 1.0 }]
        },
        materialRecycling: [
          { materialId: 'hardwood', recyclingWithoutLoss: 0, recyclingWithLoss: 0.3, disposal: 0.7 },
          { materialId: 'carbolineum', recyclingWithoutLoss: 0, recyclingWithLoss: 0, disposal: 1.0 },
          { materialId: 'steel_low_alloyed', recyclingWithoutLoss: 0.8, recyclingWithLoss: 0.15, disposal: 0.05 }
        ]
      }
    },
    // Concrete Sleeper - Basic
    {
      id: 'concrete-basic',
      name: 'Betonschwelle Basic',
      productInfo: {
        name: 'Bahnschwellen',
        category: 'Infrastruktur',
        variantName: 'Beton Basic 40J',
        totalWeight: 250,
        componentCount: 4
      },
      components: [
        {
          id: 'concrete-cement',
          name: 'Zite Zement',
          materialId: 'cement_unspecified',
          mass: 68,
          primaryMaterialContent: 1.0,
          productionLoss: 0.05,
          productionLossTreatment: {
            recyclingWithoutLoss: 0,
            recyclingWithLoss: 0.5,
            disposal: 0.5
          },
          transport: {
            distance: 50,
            modes: [{ modeId: 'trans_lorry', share: 1.0 }]
          }
        },
        {
          id: 'concrete-gravel',
          name: 'Kies/Gestein',
          materialId: 'gravel',
          mass: 170,
          primaryMaterialContent: 1.0,
          productionLoss: 0.02,
          productionLossTreatment: {
            recyclingWithoutLoss: 0.9,
            recyclingWithLoss: 0.1,
            disposal: 0
          },
          transport: {
            distance: 30,
            modes: [{ modeId: 'trans_lorry', share: 1.0 }]
          }
        },
        {
          id: 'concrete-steel',
          name: 'Bewehrungsstahl',
          materialId: 'steel_low_alloyed',
          mass: 8,
          primaryMaterialContent: 0.7,
          productionLoss: 0.02,
          productionLossTreatment: {
            recyclingWithoutLoss: 0.9,
            recyclingWithLoss: 0.1,
            disposal: 0
          },
          transport: {
            distance: 100,
            modes: [{ modeId: 'trans_train_electric', share: 1.0 }]
          }
        },
        {
          id: 'concrete-pur',
          name: 'PUR-Besohlung',
          materialId: 'pur_foam',
          mass: 4,
          primaryMaterialContent: 1.0,
          productionLoss: 0.10,
          productionLossTreatment: {
            recyclingWithoutLoss: 0,
            recyclingWithLoss: 0.3,
            disposal: 0.7
          },
          transport: {
            distance: 200,
            modes: [{ modeId: 'trans_lorry', share: 1.0 }]
          }
        }
      ],
      manufacturing: {
        electricity: { consumption: 80, mixId: 'ch_grid_basic' },
        heat: { consumption: 150, mixId: 'heat_basic' }
      },
      usePhase: { lifetime: 40 },
      endOfLife: {
        scenario: 'recycling',
        transport: {
          distance: 50,
          modes: [{ modeId: 'trans_lorry', share: 1.0 }]
        },
        materialRecycling: [
          { materialId: 'cement_unspecified', recyclingWithoutLoss: 0, recyclingWithLoss: 0.5, disposal: 0.5 },
          { materialId: 'gravel', recyclingWithoutLoss: 0.9, recyclingWithLoss: 0.1, disposal: 0 },
          { materialId: 'steel_low_alloyed', recyclingWithoutLoss: 0.85, recyclingWithLoss: 0.1, disposal: 0.05 },
          { materialId: 'pur_foam', recyclingWithoutLoss: 0, recyclingWithLoss: 0, disposal: 1.0 }
        ]
      }
    },
    // SICUT Sleeper - Green 40y
    {
      id: 'sicut-green-40',
      name: 'SICUT Green 40J',
      productInfo: {
        name: 'Bahnschwellen',
        category: 'Infrastruktur',
        variantName: 'SICUT Green 40J',
        totalWeight: 125,
        componentCount: 2
      },
      components: [
        {
          id: 'sicut-pet',
          name: 'PET (recycled)',
          materialId: 'pet',
          mass: 110,
          primaryMaterialContent: 0.3, // 70% recycled
          productionLoss: 0.05,
          productionLossTreatment: {
            recyclingWithoutLoss: 0.8,
            recyclingWithLoss: 0.15,
            disposal: 0.05
          },
          transport: {
            distance: 600,
            modes: [
              { modeId: 'trans_train_electric', share: 0.7 },
              { modeId: 'trans_lorry', share: 0.3 }
            ]
          }
        },
        {
          id: 'sicut-glass',
          name: 'Glasfaser',
          materialId: 'glass_fibre',
          mass: 15,
          primaryMaterialContent: 0.9,
          productionLoss: 0.08,
          productionLossTreatment: {
            recyclingWithoutLoss: 0.2,
            recyclingWithLoss: 0.5,
            disposal: 0.3
          },
          transport: {
            distance: 300,
            modes: [{ modeId: 'trans_lorry', share: 1.0 }]
          }
        }
      ],
      manufacturing: {
        electricity: { consumption: 200, mixId: 'ch_grid_green' },
        heat: { consumption: 300, mixId: 'heat_green' }
      },
      usePhase: { lifetime: 40 },
      endOfLife: {
        scenario: 'recycling',
        transport: {
          distance: 200,
          modes: [{ modeId: 'trans_train_electric', share: 1.0 }]
        },
        materialRecycling: [
          { materialId: 'pet', recyclingWithoutLoss: 0.7, recyclingWithLoss: 0.2, disposal: 0.1 },
          { materialId: 'glass_fibre', recyclingWithoutLoss: 0.1, recyclingWithLoss: 0.4, disposal: 0.5 }
        ]
      }
    }
  ]
};
```

## 2.4 Component Architecture

### File Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── types/
│   ├── index.ts
│   ├── variant.ts
│   ├── component.ts
│   └── erp.ts
├── data/
│   ├── erpDatabase.ts
│   ├── energyMixes.ts
│   ├── transportModes.ts
│   └── sleeperPresets.ts
├── utils/
│   ├── calculate.ts
│   ├── formatters.ts
│   └── validators.ts
├── hooks/
│   ├── useVariants.ts
│   ├── useCalculation.ts
│   └── useDebounce.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── VariantTabs.tsx
│   │   ├── SectionNav.tsx
│   │   └── MainLayout.tsx
│   ├── forms/
│   │   ├── ProductInfoForm.tsx
│   │   ├── ComponentForm.tsx
│   │   ├── ManufacturingForm.tsx
│   │   ├── UsePhaseForm.tsx
│   │   ├── EndOfLifeForm.tsx
│   │   ├── SliderInput.tsx
│   │   ├── SelectInput.tsx
│   │   └── NumberInput.tsx
│   ├── visualization/
│   │   ├── SankeyDiagram.tsx
│   │   ├── ResultsChart.tsx
│   │   ├── TauDisplay.tsx
│   │   └── BreakdownLegend.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Tooltip.tsx
│       └── Badge.tsx
└── pages/
    └── Calculator.tsx
```

### Key Components

#### VariantTabs Component

```tsx
interface VariantTabsProps {
  variants: Variant[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

// Displays: [V1-Beton] [Variante 2] [Variante 3] [+]
// Active tab highlighted in yellow
// Click to switch, double-click to rename
```

#### SectionNav Component

```tsx
interface SectionNavProps {
  sections: Section[];
  activeSection: string;
  onSelect: (sectionId: string) => void;
  componentCount: number;
}

// Displays vertical navigation:
// - Produktinfo
// - Komponente 1
// - Komponente 2 (dynamic)
// - Herstellung
// - Nutzung
// - Nutzungsende
```

#### SliderInput Component

```tsx
interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (v: number) => string;
  showInput?: boolean;
  segments?: { label: string; color: string }[];
}

// Multi-segment slider for recycling rates:
// [====Recycling ohne====|==Recycling mit==|Verluste]
// [        50%           |       40%       |   10%  ]
```

## 2.5 Calculation Engine

### Core Calculation Function

```typescript
function calculateVariantTau(variant: Variant, erpDb: ERPEntry[]): CalculationResult {
  const breakdown: TauBreakdown[] = [];
  let totalTau = 0;

  // 1. Calculate τ for each component
  for (const component of variant.components) {
    const materialTau = calculateMaterialTau(component, variant.usePhase.lifetime, erpDb);
    breakdown.push({
      category: 'Material',
      name: component.name,
      tau: materialTau,
      percentage: 0, // Calculated after totaling
      color: getMaterialColor(component.materialId)
    });
    totalTau += materialTau;
  }

  // 2. Calculate τ for manufacturing electricity
  const elecTau = calculateEnergyTau(
    variant.manufacturing.electricity,
    variant.usePhase.lifetime,
    erpDb
  );
  breakdown.push({
    category: 'Energie',
    name: 'Strom',
    tau: elecTau,
    percentage: 0,
    color: '#FBBF24'
  });
  totalTau += elecTau;

  // 3. Calculate τ for manufacturing heat
  const heatTau = calculateEnergyTau(
    variant.manufacturing.heat,
    variant.usePhase.lifetime,
    erpDb
  );
  breakdown.push({
    category: 'Energie',
    name: 'Wärme',
    tau: heatTau,
    percentage: 0,
    color: '#F97316'
  });
  totalTau += heatTau;

  // 4. Calculate τ for transport (all components + EoL)
  const transportTau = calculateTotalTransportTau(variant, erpDb);
  breakdown.push({
    category: 'Transport',
    name: 'Gesamt',
    tau: transportTau,
    percentage: 0,
    color: '#A3A3A3'
  });
  totalTau += transportTau;

  // Calculate percentages
  for (const item of breakdown) {
    item.percentage = (item.tau / totalTau) * 100;
  }

  return {
    totalTau,
    breakdown,
    timestamp: new Date()
  };
}

function calculateMaterialTau(
  component: Component,
  lifetime: number,
  erpDb: ERPEntry[]
): number {
  const erp = erpDb.find(e => e.id === component.materialId);
  if (!erp) throw new Error(`ERP not found: ${component.materialId}`);

  // τ = (m / ERP) × (1 + loss) × (1 / L) × (primary + secondary_factor)
  const massRequired = component.mass * (1 + component.productionLoss);
  const primaryFactor = component.primaryMaterialContent;
  const secondaryFactor = (1 - component.primaryMaterialContent) * 0.1; // Reduced impact for recycled

  return (massRequired / erp.erp) * (1 / lifetime) * (primaryFactor + secondaryFactor);
}
```

## 2.6 UI Layout Specification

### Main Screen Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [V1-Beton] [Variante 2] [Variante 3] [+]                              [⟳]  │
├───────────────┬─────────────────────────────────────────┬───────────────────┤
│               │                                         │                   │
│ Produktinfo   │  [MAIN CONTENT AREA]                    │    V1-Beton      │
│               │                                         │ ┌───────────────┐ │
│ Komponente 1  │  Produktinfo                            │ │               │ │
│               │  ────────────────────────               │ │   [SANKEY     │ │
│ Komponente 2  │                                         │ │   DIAGRAM]    │ │
│               │  Produktname      [Bahnschwellen    ]   │ │               │ │
│ Herstellung   │                                         │ │               │ │
│               │  Produktkategorie [Infrastruktur   ]    │ └───────────────┘ │
│ Nutzung       │                                         │                   │
│               │  Variantenname    [Beton           ]    │ Gesamtresultat /  │
│ Nutzungsende  │                                         │ Variantenvergleich│
│               │  Gewicht in kg    [295             ]    │ ┌───────────────┐ │
│               │                                         │ │ Ressourcen-   │ │
│               │  Anzahl Komponente [1 ↕]               │ │ druck         │ │
│               │                                         │ │               │ │
│               │  ┌─────────────────────────────────┐    │ │ █ 5.02e-12    │ │
│               │  │                                 │    │ │ █             │ │
│               │  │     [PRODUCT IMAGE]             │    │ │ █             │ │
│               │  │                                 │    │ │               │ │
│               │  └─────────────────────────────────┘    │ │ V1  V2  V3    │ │
│               │                                         │ └───────────────┘ │
└───────────────┴─────────────────────────────────────────┴───────────────────┘
```

### Component Form Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Komponente 1: [Schwelle                              ] 🏭                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [−] Material 1:                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  Materialart                 [Zement                          ▼]   │   │
│  │                                                                     │   │
│  │  Masse                       [170        ] kg                       │   │
│  │                                                                     │   │
│  │  Primärmaterialanteil        0% ════════════════════════●  100%    │   │
│  │                                                          [100] %   │   │
│  │                                                                     │   │
│  │  Produktionsverluste im      0% ════●════════════════════  100%    │   │
│  │  Verhältnis zur Masse                                    [10 ] %   │   │
│  │                                                                     │   │
│  │  Behandlung Produktionsverluste                                     │   │
│  │  ┌──────────────────┬──────────────────┬─────────────┐             │   │
│  │  │ Recycling ohne   │ Recycling mit    │  Verluste   │             │   │
│  │  │ Qualitätsverlust │ Qualitätsverlust │             │             │   │
│  │  │      0%          │      90%         │    10%      │             │   │
│  │  └──────────────────┴──────────────────┴─────────────┘             │   │
│  │  [●════════════════════════════════════════════════●]              │   │
│  │                                                                     │   │
│  │  Durchschn. Transportweg     [0         ] km                        │   │
│  │                                                                     │   │
│  │  Transportart & Anteil                                              │   │
│  │  [Fracht, Zug, Diesel     ▼] [20 ] %                               │   │
│  │  [Fracht, Zug, Elektro    ▼] [80 ] %                               │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [+] Material 2:                                                            │
│  [+] Material ..:                                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2.7 Implementation Phases

### Phase 1: Core Structure (Week 1)
- [ ] Project setup with Vite + React + TypeScript
- [ ] Type definitions
- [ ] Data files (ERP database, presets)
- [ ] Basic layout components
- [ ] Variant tabs functionality

### Phase 2: Forms (Week 2)
- [ ] ProductInfoForm
- [ ] ComponentForm with material selection
- [ ] SliderInput component
- [ ] ManufacturingForm
- [ ] UsePhaseForm
- [ ] EndOfLifeForm

### Phase 3: Calculation (Week 3)
- [ ] Calculation engine
- [ ] Real-time updates with debounce
- [ ] τ display component
- [ ] Results breakdown

### Phase 4: Visualization (Week 4)
- [ ] Sankey diagram (mass flow)
- [ ] Stacked bar chart (comparison)
- [ ] Legend and tooltips
- [ ] Responsive adjustments

### Phase 5: Polish (Week 5)
- [ ] German localization
- [ ] Error handling
- [ ] Loading states
- [ ] PDF export
- [ ] Testing and validation

---

# Part 3: Excel Workbook Analysis

## 3.1 Workbook Overview

The SOB Excel workbook `SOB_Ressourcendruckmethode_Schwellen.xlsx` contains 6 sheets that implement the ERA methodology for railway sleeper assessment.

### Sheet Structure

| # | Sheet Name | Purpose | Type |
|---|------------|---------|------|
| 1 | Overview | Dashboard with results comparison | Output |
| 2 | Materials and energy | Configuration tables for all inputs | Configuration |
| 3 | ERP | Ecological Resource Potentials database | Reference (Read-only) |
| 4 | RP_wood | Calculations for wood sleepers | Calculation |
| 5 | RP_concrete | Calculations for concrete sleepers | Calculation |
| 6 | RP_SICUT | Calculations for SICUT sleepers | Calculation |

## 3.2 Sheet 1: Overview

### Purpose
Dashboard displaying all calculated τ values with visual comparison.

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                    RESSOURCENDRUCK ÜBERSICHT                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Sleeper Type    │ Scenario       │ τ [×10⁻¹²]  │ Rank          │
│  ────────────────┼────────────────┼─────────────┼───────────────│
│  SICUT           │ green 40y      │ 2.05        │ 1 (Best)      │
│  SICUT           │ green 30y      │ 2.73        │ 2             │
│  SICUT           │ green 20y      │ 4.10        │ 3             │
│  Concrete        │ green 40y      │ 4.21        │ 4             │
│  Concrete        │ basic 40y      │ 5.02        │ 5             │
│  Wood            │ green 25y      │ 6.45        │ 6             │
│  Wood            │ basic 25y      │ 6.86        │ 7             │
│  ...             │ ...            │ ...         │ ...           │
│                                                                  │
│  [BAR CHART VISUALIZATION]                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Connections
- Pulls τ values from RP_wood!G18, RP_concrete!G18, RP_SICUT!G16
- Sorts results by τ ascending (best first)

## 3.3 Sheet 2: Materials and Energy

### Purpose
Central configuration sheet containing 5 named tables that feed all calculations.

### Table: tbl_material (22 columns)

| Column | Name | Description | Example |
|--------|------|-------------|---------|
| A | material | Material identifier | cement unspecified |
| B | sleeper | Sleeper type | concrete |
| C | ERP_identifier | Link to ERP table | cement unspecified |
| D | use_category | Component type | bulk material 1 |
| E | mass_kg | Mass per sleeper (kg) | 68 |
| F | manufacturing_losses | Loss rate (0-1) | 0.05 |
| G | electricity_manufacturing | kWh for manufacturing | 10 |
| H | heat_manufacturing | kWh heat for manufacturing | 20 |
| I | electricity_recycling | kWh for recycling | 5 |
| J | heat_recycling | kWh heat for recycling | 10 |
| K | manuf_waste_collection | Collection rate (0-1) | 0.95 |
| L | manuf_waste_recycling | Recycling rate (0-1) | 0.8 |
| M | manuf_waste_cascading | Cascading rate (0-1) | 0.1 |
| N | basic_primary_content | Primary material % (basic) | 1.0 |
| O | basic_collection_rate | EoL collection (basic) | 0.7 |
| P | basic_recycling_rate | EoL recycling (basic) | 0.5 |
| Q | basic_cascading_rate | EoL cascading (basic) | 0.2 |
| R | green_primary_content | Primary material % (green) | 0.8 |
| S | green_collection_rate | EoL collection (green) | 0.9 |
| T | green_recycling_rate | EoL recycling (green) | 0.7 |
| U | green_cascading_rate | EoL cascading (green) | 0.2 |

### Sample Data: tbl_material

```
| material          | sleeper  | ERP_identifier    | use_category    | mass_kg | manuf_losses |
|-------------------|----------|-------------------|-----------------|---------|--------------|
| hardwood          | wood     | hardwood          | bulk material   | 80      | 0.40         |
| carbolineum       | wood     | carbolineum       | chemicals       | 16      | 0.05         |
| steel ribbed      | wood     | low-alloyed steel | reinforcement   | 4       | 0.02         |
| cement unspecified| concrete | cement unspecified| bulk material 1 | 68      | 0.05         |
| gravel            | concrete | gravel            | bulk material 2 | 170     | 0.02         |
| steel reinforced  | concrete | low-alloyed steel | reinforcement   | 8       | 0.02         |
| PUR foam          | concrete | PUR               | form            | 4       | 0.10         |
| PET               | SICUT    | PET               | bulk material   | 110     | 0.05         |
| glass fibre       | SICUT    | glass fibre       | reinforcement   | 15      | 0.08         |
```

### Table: tbl_electricity (Electricity Mix)

| Column | Name | Description |
|--------|------|-------------|
| A | source | Electricity source identifier |
| B | ERP_identifier | Link to ERP table |
| C | basic_share | Share in basic mix (0-1) |
| D | green_share | Share in green mix (0-1) |

### Sample Data: tbl_electricity

```
| source      | ERP_identifier  | basic_share | green_share |
|-------------|-----------------|-------------|-------------|
| el, coal    | el, coal        | 0.05        | 0           |
| el, gas     | el, gas         | 0.15        | 0           |
| el, nuclear | el, nuclear     | 0.35        | 0.10        |
| el, hydro   | el, hydro       | 0.30        | 0.50        |
| el, wind    | el, wind, on    | 0.10        | 0.25        |
| el, PV      | el, PV, roof    | 0.05        | 0.15        |
```

### Table: tbl_heat (Heat Mix)

```
| source     | ERP_identifier | basic_share | green_share |
|------------|----------------|-------------|-------------|
| ht, gas    | ht, gas        | 0.70        | 0.20        |
| ht, oil    | ht, oil        | 0.20        | 0           |
| ht, wood   | ht, wood       | 0.05        | 0.40        |
| ht, solar  | ht, solar      | 0.05        | 0.40        |
```

### Table: tbl_transport (Transport Modes)

```
| mode                 | ERP_identifier              | basic_land | basic_overseas | green_land | green_overseas |
|----------------------|-----------------------------|------------|----------------|------------|----------------|
| freight train diesel | trans, freight, train, diesel| 0.20       | 0              | 0          | 0              |
| freight train electric| trans, freight, train, electric| 0.30    | 0              | 0.80       | 0              |
| lorry                | trans, lorry                | 0.50       | 0.20           | 0.20       | 0.10           |
| sea                  | trans, sea                  | 0          | 0.80           | 0          | 0.90           |
```

### Table: tbl_sleeper (Sleeper Properties)

```
| sleeper  | lifetime_years | installation_transport_km | disposal_transport_km |
|----------|----------------|---------------------------|----------------------|
| wood     | 25             | 500                       | 100                  |
| concrete | 40             | 150                       | 50                   |
| SICUT    | 20             | 600                       | 200                  |
```

## 3.4 Sheet 3: ERP (Ecological Resource Potentials)

### Purpose
Reference database of sustainable resource budgets from ecoinvent 3.9.

### Structure

| Column | Name | Description |
|--------|------|-------------|
| A | Identifier | Unique ID for lookups |
| B | Process/product | Full name from ecoinvent |
| C | Unit | Functional unit (kg, kWh, tkm) |
| D | FU | Functional unit quantity (always 1) |
| E | version | ecoinvent version |
| F | category | electricity, heat, transport, Material |
| G | ERP effective [FU/a] | Sustainable budget per year |
| H | limiting boundary | CO_2, biophysical, biodiversity |

### Sample Data: ERP Database

```
| Identifier        | Process/product                    | Unit | ERP [FU/a]  | limiting |
|-------------------|---------------------------------------|------|-------------|----------|
| el, coal          | electricity, coal                     | kWh  | 7.57E+11    | CO_2     |
| el, gas           | electricity, gas                      | kWh  | 1.42E+12    | CO_2     |
| el, nuclear       | electricity, nuclear                  | kWh  | 7.03E+12    | CO_2     |
| el, hydro         | electricity, hydro                    | kWh  | 3.67E+12    | biophys  |
| el, wind, on      | electricity, wind, onshore            | kWh  | 1.13E+12    | biophys  |
| el, PV, roof      | electricity, PV, rooftop              | kWh  | 2.81E+13    | CO_2     |
| ht, gas           | heat, gas                             | kWh  | 6.02E+13    | CO_2     |
| ht, wood          | heat, wood                            | kWh  | 4.48E+12    | biophys  |
| ht, solar         | heat, solar                           | kWh  | 8.38E+14    | biophys  |
| trans, train, el  | freight, train, electric              | tkm  | 6.97E+13    | CO_2     |
| trans, lorry      | transport, lorry                      | tkm  | 3.44E+12    | CO_2     |
| trans, sea        | transport, sea                        | tkm  | 9.07E+13    | CO_2     |
| cement unspecified| cement, unspecified                   | kg   | 1.32E+12    | CO_2     |
| gravel            | gravel, crushed                       | kg   | 7.37E+13    | CO_2     |
| hardwood          | sawnwood, beam, hardwood              | kg   | 3.00E+12    | biophys  |
| low-alloyed steel | steel, low-alloyed                    | kg   | 4.34E+11    | CO_2     |
| PET               | polyethylene terephthalate            | kg   | 1.78E+11    | CO_2     |
| glass fibre       | glass fibre                           | kg   | 3.82E+11    | CO_2     |
| PUR               | polyurethane, rigid foam              | kg   | 1.21E+11    | CO_2     |
| carbolineum       | wood preservative, creosote           | kg   | 2.47E+11    | CO_2     |
```

## 3.5 Sheets 4-6: Calculation Sheets (RP_wood, RP_concrete, RP_SICUT)

### Common Structure

All three calculation sheets follow the same pattern:

```
Row 1:  Title
Row 3:  Variant headers (wo_01, wo_02, etc.)
Row 4:  Description (e.g., "wood basic 25 Jahre")
Row 5:  primary material content reference
Row 6:  collection rate reference
Row 7:  recycling rate reference
Row 8:  cascading rate reference
Row 9:  τ column headers
Rows 10-17: Component summary with τ values
Row 18: TOTAL τ = SUM(G10:G17)

Rows 20+: Detailed calculations per component
```

### Calculation Structure per Component

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ BULK MATERIAL 1 (e.g., cement)                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Row 21: material (lookup from tbl_material)                                 │
│ Row 22: ERP value (lookup from tbl_ERP)                                     │
│ Row 24: primary material content (from variant settings)                     │
│ Row 25: secondary material content (= 1 - primary)                          │
│ Row 27: mass per sleeper (from tbl_material)                                │
│ Row 28: manufacturing losses % (from tbl_material)                          │
│ Row 29: manufacturing losses kg (= mass × loss%)                            │
│ Row 30: mass required (= mass × (1 + loss%))                                │
│ Row 32: mass input primary (= mass_required × primary%)                     │
│ Row 33: mass input secondary (= mass_required × secondary%)                 │
│ ...                                                                          │
│ Row 46: τ_material = (calculations based on all above)                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Formulas

**Material τ Calculation:**
```excel
τ_material = (m_input / ERP) × (1/L) × [
    p_primary × (1 - η_EoL_recycling × f_recycling) +
    p_secondary × f_secondary +
    m_loss × (1 - η_loss_recycling × f_loss_recycling)
]
```

Where:
- `m_input` = mass required including losses
- `ERP` = Ecological Resource Potential from database
- `L` = lifetime in years
- `p_primary` = primary material content fraction
- `η_EoL_recycling` = end-of-life recycling rate
- `f_recycling` = credit factor for recycling (typically 0.5-0.9)

**Electricity τ Calculation:**
```excel
τ_electricity = Σ(share_i × consumption / ERP_i) × (1/L)
```

**Transport τ Calculation:**
```excel
τ_transport = Σ(share_j × distance × mass / ERP_j) × (1/L) / 1000
```
(divided by 1000 to convert kg·km to t·km)

### Scenario Configuration

Each calculation sheet supports multiple scenarios (columns):

**RP_wood scenarios:**
| Code | Description | Lifetime | Variant |
|------|-------------|----------|---------|
| wo_01 | Wood basic 25y | 25 | basic |
| wo_02 | Wood green 25y | 25 | green |
| wo_03 | Wood high losses | 25 | basic |

**RP_concrete scenarios:**
| Code | Description | Lifetime | Variant |
|------|-------------|----------|---------|
| co_01 | Concrete basic 40y | 40 | basic |
| co_02 | Concrete green 40y | 40 | green |

**RP_SICUT scenarios:**
| Code | Description | Lifetime | Variant |
|------|-------------|----------|---------|
| si_01 | SICUT basic 20y | 20 | basic |
| si_02 | SICUT green 20y | 20 | green |
| si_03 | SICUT green 30y | 30 | green |
| si_04 | SICUT green 40y | 40 | green |
| si_05 | SICUT basic 40y | 40 | basic |

## 3.6 Data Relationships

```
┌─────────────────┐
│   tbl_sleeper   │
│ (lifetime, dist)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  tbl_material   │────▶│    tbl_ERP      │
│  (mass, losses) │     │ (ERP values)    │
└────────┬────────┘     └────────▲────────┘
         │                       │
         ▼                       │
┌─────────────────┐              │
│ RP_* Calc Sheet │              │
│ (τ calculation) │──────────────┘
└────────┬────────┘
         │
         │ ┌─────────────────┐
         ├─│ tbl_electricity │
         │ │ (energy mix)    │
         │ └─────────────────┘
         │
         │ ┌─────────────────┐
         ├─│   tbl_heat      │
         │ │ (heat mix)      │
         │ └─────────────────┘
         │
         │ ┌─────────────────┐
         └─│ tbl_transport   │
           │ (transport mix) │
           └─────────────────┘
```

---

# Part 4: UX Flow & Design Guide

## 4.1 Design Philosophy

Based on the client mockups, the design follows these principles:

1. **Form-First Interface**: Configuration through structured forms, not cards
2. **Section-Based Navigation**: Vertical tabs for logical content sections
3. **Real-Time Feedback**: Visual updates as user modifies inputs
4. **Comparison Always Visible**: Results panel always shows variant comparison
5. **Industrial Aesthetic**: Clean, utilitarian design befitting infrastructure tools

## 4.2 Color Palette

| Purpose | Color | Hex | Usage |
|---------|-------|-----|-------|
| **Primary** | Amber/Gold | `#F59E0B` | Active tabs, highlights |
| **Background** | Dark Gray | `#1F1F1F` | Application chrome |
| **Content Background** | White | `#FFFFFF` | Form areas |
| **Secondary Background** | Light Gray | `#F5F5F5` | Section headers |
| **Text Primary** | Black | `#000000` | Labels, values |
| **Text Secondary** | Gray | `#666666` | Descriptions |
| **Success** | Green | `#22C55E` | Best results |
| **Warning** | Orange | `#F97316` | Alerts |
| **Error** | Red | `#EF4444` | Validation errors |
| **Chart Colors** | Multi | Various | Component breakdown |

### Chart Color Scale

```
Materials:  #4B5563 (Gray), #9CA3AF (Light Gray)
Electricity: #FDE047 (Yellow)
Heat:       #FB923C (Orange)
Transport:  #A855F7 (Purple)
```

## 4.3 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Application Title | System Sans | 18px | Bold |
| Section Headers | System Sans | 14px | Bold |
| Form Labels | System Sans | 13px | Regular |
| Input Values | System Sans | 13px | Regular |
| τ Value | Monospace | 14px | Bold |
| Chart Labels | System Sans | 11px | Regular |

## 4.4 Layout Grid

```
┌──────────────────────────────────────────────────────────────────────┐
│ Total Width: 1440px (min: 1200px)                                    │
├──────┬───────────────────────────────────────────┬───────────────────┤
│      │                                           │                   │
│ 120px│              ~800px                       │      ~400px       │
│      │                                           │                   │
│ Nav  │           Main Content                    │   Visualizations  │
│      │                                           │                   │
└──────┴───────────────────────────────────────────┴───────────────────┘
```

## 4.5 User Flow

### Primary Flow: Configure and Compare Variants

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER FLOW                                  │
└─────────────────────────────────────────────────────────────────────┘

     ┌──────────┐
     │  START   │
     └────┬─────┘
          │
          ▼
┌─────────────────────┐
│ 1. View Default     │  System loads with first sleeper type
│    Variant (V1)     │  pre-configured (e.g., "V1-Beton")
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 2. Review Product   │  User sees Produktinfo section
│    Info             │  - Name, Category, Weight
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 3. Configure        │  User clicks through sections:
│    Components       │  - Komponente 1, 2, ...
│                     │  - Sets materials, masses, transport
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 4. Configure        │  User sets:
│    Manufacturing    │  - Electricity consumption & mix
│                     │  - Heat consumption & mix
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 5. Configure        │  User sets:
│    Use Phase        │  - Lifetime in years
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 6. Configure        │  User sets:
│    End of Life      │  - Recycling scenario
│                     │  - Material recycling rates
│                     │  - Disposal transport
└──────────┬──────────┘
           │
           ├──────────────────────────────────────┐
           │                                      │
           ▼                                      ▼
┌─────────────────────┐               ┌─────────────────────┐
│ 7a. View τ Result   │               │ 7b. Add Variant     │
│     for V1          │               │     (click [+])     │
└──────────┬──────────┘               └──────────┬──────────┘
           │                                      │
           │                                      ▼
           │                          ┌─────────────────────┐
           │                          │ 8. Configure V2     │
           │                          │    (repeat 2-6)     │
           │                          └──────────┬──────────┘
           │                                      │
           ◄──────────────────────────────────────┘
           │
           ▼
┌─────────────────────┐
│ 9. Compare Variants │  Stacked bar chart shows all
│    in Results Panel │  configured variants side-by-side
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 10. Export Results  │  User clicks export button
│     (optional)      │  → PDF report generated
└──────────┬──────────┘
           │
           ▼
     ┌──────────┐
     │   END    │
     └──────────┘
```

### Section Navigation Flow

```
[Produktinfo] → [Komponente 1] → [Komponente 2] → ... → [Herstellung] → [Nutzung] → [Nutzungsende]
      │               │                │                     │              │              │
      ▼               ▼                ▼                     ▼              ▼              ▼
  Basic info      Material 1       Material 2           Energy          Lifetime      Recycling
  Name, Weight    Mass, %          Mass, %              kWh, Mix        Years         Rates
```

## 4.6 Screen Specifications

### Screen 1: Produktinfo (Product Information)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [V1-Beton] [Variante 2] [Variante 3] [+]                                   │
├──────────────┬──────────────────────────────────────────┬───────────────────┤
│              │                                          │                   │
│ ○ Produktinfo│  Produktname      [Bahnschwellen      ]  │    V1-Beton      │
│              │                                          │ ┌───────────────┐ │
│ ○ Komponente1│  Produktkategorie [Infrastruktur      ]  │ │ [SANKEY]      │ │
│              │                                          │ │               │ │
│ ○ Herstellung│  Variantenname    [Beton              ]  │ │ primary mat   │ │
│              │                                          │ │     ↓         │ │
│ ○ Nutzung    │  Gewicht in kg    [295                ]  │ │  product      │ │
│              │                                          │ │     ↓         │ │
│ ○ Nutzungs-  │  Anzahl Komponente [1  ↕]               │ │  recycled     │ │
│   ende       │                                          │ └───────────────┘ │
│              │  ┌──────────────────────────────────┐    │                   │
│              │  │                                  │    │ Gesamtresultat    │
│              │  │      [PRODUCT IMAGE]             │    │ ┌───────────────┐ │
│              │  │      Railway sleepers            │    │ │ Ressourcen-   │ │
│              │  │                                  │    │ │ druck         │ │
│              │  └──────────────────────────────────┘    │ │               │ │
│              │                                          │ │ ▓▓▓ 5.02e-12  │ │
│              │                                          │ │  V1           │ │
│              │                                          │ └───────────────┘ │
└──────────────┴──────────────────────────────────────────┴───────────────────┘
```

**Behavior:**
- Form fields auto-save on blur
- Component count spinner updates navigation
- Product image upload optional

### Screen 2: Komponente (Component Configuration)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [V1-Beton] [Variante 2] [Variante 3] [+]                                   │
├──────────────┬──────────────────────────────────────────┬───────────────────┤
│              │                                          │                   │
│ ○ Produktinfo│  Komponentenname: [Schwelle          ] 🏭│    V1-Beton      │
│              │                                          │ ┌───────────────┐ │
│ ● Komponente1│  ┌─ Material 1: ───────────────────────┐ │ │               │ │
│              │  │                                     │ │ │   [SANKEY]    │ │
│ ○ Herstellung│  │  Materialart      [Zement       ▼] │ │ │               │ │
│              │  │                                     │ │ │               │ │
│ ○ Nutzung    │  │  Masse            [170       ] kg  │ │ │               │ │
│              │  │                                     │ │ └───────────────┘ │
│ ○ Nutzungs-  │  │  Primärmaterialanteil              │ │                   │
│   ende       │  │  0% ════════════════════● 100%     │ │ Gesamtresultat    │
│              │  │                          [100] %   │ │ ┌───────────────┐ │
│              │  │                                     │ │ │               │ │
│              │  │  Produktionsverluste               │ │ │ ▓▓▓ 5.02e-12  │ │
│              │  │  0% ════●═══════════════ 100%     │ │ │  V1           │ │
│              │  │                          [10 ] %   │ │ │               │ │
│              │  │                                     │ │ │               │ │
│              │  │  Behandlung Produktionsverluste    │ │ │               │ │
│              │  │  [Rec. ohne|  Rec. mit  |Verluste]│ │ │               │ │
│              │  │  [●════════════════════════●]     │ │ │               │ │
│              │  │                                     │ │ │               │ │
│              │  │  Durchschn. Transportweg [0] km    │ │ │               │ │
│              │  │                                     │ │ │               │ │
│              │  │  Transportart & Anteil             │ │ │               │ │
│              │  │  [Fracht, Zug, Diesel  ▼] [20] %   │ │ │               │ │
│              │  │  [Fracht, Zug, Elektro ▼] [80] %   │ │ │               │ │
│              │  └─────────────────────────────────────┘ │ │               │ │
│              │                                          │ └───────────────┘ │
│              │  [+] Material 2:                         │                   │
│              │  [+] Material ..:                        │                   │
│              │                                          │                   │
└──────────────┴──────────────────────────────────────────┴───────────────────┘
```

**Key Interactions:**

1. **Material Dropdown**: Populated from ERP database, filtered by category
2. **Primary Material Slider**: 0-100%, affects τ calculation
3. **Production Loss Slider**: 0-100%, increases material requirement
4. **Three-Segment Slider**: 
   - Drag left handle: Recycling without quality loss
   - Drag right handle: Recycling with quality loss
   - Remainder = Disposal (calculated)
5. **Transport Modes**: Add/remove rows, percentages must sum to 100%

### Screen 3: Herstellung (Manufacturing)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [V1-Beton] [Variante 2] [+]                                                │
├──────────────┬──────────────────────────────────────────┬───────────────────┤
│              │                                          │                   │
│ ○ Produktinfo│  Herstellung                             │    V1-Beton      │
│              │  ──────────────────────────────────────  │ ┌───────────────┐ │
│ ○ Komponente1│                                          │ │   [SANKEY]    │ │
│              │  Stromverbrauch                          │ │               │ │
│ ● Herstellung│                                          │ └───────────────┘ │
│              │  Energieaufwand pro   [80      ] kWh     │                   │
│ ○ Nutzung    │  Einheit                                 │ Gesamtresultat    │
│              │                                          │ ┌───────────────┐ │
│ ○ Nutzungs-  │  Energiequelle       [CH Grid Basic  ▼] │ │               │ │
│   ende       │                                          │ │ ▓▓▓ 5.02e-12  │ │
│              │  ──────────────────────────────────────  │ │  V1           │ │
│              │                                          │ │               │ │
│              │  Wärmeverbrauch                          │ └───────────────┘ │
│              │                                          │                   │
│              │  Energieaufwand pro   [150     ] kWh     │                   │
│              │  Einheit                                 │                   │
│              │                                          │                   │
│              │  Wärmequelle         [Heat Basic    ▼]  │                   │
│              │                                          │                   │
└──────────────┴──────────────────────────────────────────┴───────────────────┘
```

### Screen 4: Nutzung (Use Phase)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [V1-Beton] [Variante 2] [+]                                                │
├──────────────┬──────────────────────────────────────────┬───────────────────┤
│              │                                          │                   │
│ ○ Produktinfo│  Nutzung                                 │    V1-Beton      │
│              │  ──────────────────────────────────────  │ ┌───────────────┐ │
│ ○ Komponente1│                                          │ │   [SANKEY]    │ │
│              │  Lebensdauer                             │ │               │ │
│ ○ Herstellung│                                          │ └───────────────┘ │
│              │  Jahre               [40      ]          │                   │
│ ● Nutzung    │                                          │ Gesamtresultat    │
│              │  ──────────────────────────────────────  │ ┌───────────────┐ │
│ ○ Nutzungs-  │                                          │ │               │ │
│   ende       │  ℹ️ Die Lebensdauer beeinflusst den      │ │ ▓▓▓ 5.02e-12  │ │
│              │    Ressourcendruck proportional.         │ │  V1           │ │
│              │    Längere Lebensdauer = niedrigerer τ   │ │               │ │
│              │                                          │ └───────────────┘ │
└──────────────┴──────────────────────────────────────────┴───────────────────┘
```

### Screen 5: Nutzungsende (End of Life)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [V1-Beton] [Variante 2] [+]                                                │
├──────────────┬──────────────────────────────────────────┬───────────────────┤
│              │                                          │                   │
│ ○ Produktinfo│  Ausbau (Dismantling)                    │    V1-Beton      │
│              │  ──────────────────────────────────────  │ ┌───────────────┐ │
│ ○ Komponente1│                                          │ │   [SANKEY]    │ │
│              │  Energieaufwand      [0       ] kWh      │ │               │ │
│ ○ Herstellung│                                          │ └───────────────┘ │
│              │  Energiequelle       [-             ▼]   │                   │
│ ○ Nutzung    │                                          │ Gesamtresultat    │
│              │  ──────────────────────────────────────  │ ┌───────────────┐ │
│ ● Nutzungs-  │  Transport zu Abnehmer                   │ │               │ │
│   ende       │                                          │ │ ▓▓▓▓ 5.02e-12 │ │
│              │  Durchschn. Transportweg [0    ] km      │ │  V1           │ │
│              │                                          │ └───────────────┘ │
│              │  Transportart        [-             ▼]   │                   │
│              │                                          │                   │
│              │  ──────────────────────────────────────  │                   │
│              │  Produktnutzungsende                     │                   │
│              │                                          │                   │
│              │  Produkt             [Recycling     ▼]   │                   │
│              │                                          │                   │
│              │                   Rec. mit    Verluste   │                   │
│              │                   Qual.verl.             │                   │
│              │  Material 1: Zement                      │                   │
│              │  [●══════════════════════════●]         │                   │
│              │       50%              50%              │                   │
│              │                                          │                   │
│              │  Material 2: Gestein                     │                   │
│              │  [══════════════════════════●═●]        │                   │
│              │              90%               10%       │                   │
│              │                                          │                   │
└──────────────┴──────────────────────────────────────────┴───────────────────┘
```

## 4.7 Component Specifications

### Variant Tab Component

```
Normal state:      [Variante 2]     - White background, black border
Active state:      [V1-Beton]       - Yellow background (#F59E0B)
Hover state:       [Variante 2]     - Light gray background
Add button:        [+]              - Border only, same height
```

### Section Navigation Item

```
Normal state:      ○ Produktinfo    - Empty circle, gray text
Active state:      ● Komponente 1   - Filled circle, black text, yellow left border
Hover state:       ○ Nutzung        - Gray background
```

### Slider Component (Single)

```
┌────────────────────────────────────────────────────┐
│ Label                                              │
│ 0% ═══════════════════●══════════════════ 100%    │
│                                          [50 ] %  │
└────────────────────────────────────────────────────┘

Track: Gray line, 4px height
Thumb: Black circle, 12px diameter
Value input: Right-aligned, linked to slider
```

### Three-Segment Slider Component

```
┌────────────────────────────────────────────────────────────────┐
│  Rec. ohne Qual.verl. │ Rec. mit Qual.verl. │    Verluste     │
│         0%            │        90%          │       10%       │
│ [●════════════════════════════════════════════════════════●]  │
│  ← Drag left handle              Drag right handle →          │
│                                                                │
│  Segment colors: Blue | Yellow | Red                          │
└────────────────────────────────────────────────────────────────┘
```

### Results Bar Chart

```
┌─────────────────────────────────────────┐
│ Ressourcendruck                         │
│                                         │
│           ┌──────────┐                  │
│           │          │                  │
│           │ ████████ │ ← Materials      │
│           │ ████████ │                  │
│  5.02e-12 │ ▓▓▓▓▓▓▓▓ │ ← Heat          │
│           │ ░░░░░░░░ │ ← Electricity   │
│           │ ▒▒▒▒▒▒▒▒ │ ← Transport     │
│           └──────────┘                  │
│              V1-Beton                   │
│                                         │
│  Legend: ████ Mat ▓▓▓▓ Heat            │
│          ░░░░ Elec ▒▒▒▒ Trans          │
└─────────────────────────────────────────┘
```

## 4.8 Sankey Diagram Specification

The Sankey diagram visualizes mass flow through the product lifecycle:

```
┌─────────────────────────────────────────────────────────────────┐
│                          V1-Beton                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  other product systems in society                                │
│  ─────────────────────────────────────────                       │
│                                                                  │
│       product system i-1                                         │
│  ┌────────────────────┐    secondary material from higher quality│
│  │                    │  ◄────────────────────────────────────── │
│  │  ┌──────────────┐  │                                          │
│  │  │   m_product  │──┼──► mass flow                             │
│  │  │   primary    │  │    required for          ───────────────►│
│  │  │   material   │  │    product           final loss          │
│  │  └──────────────┘  │         ▼                  to ERP        │
│  │        ▲           │    ┌─────────┐                           │
│  │        │           │    │ PRODUCT │                           │
│  │  Sustainable       │    └────┬────┘                           │
│  │  material input    │         │                                │
│  │  into the          │         ▼                                │
│  │  socioeconomic     │    recycled material                     │
│  │  system            │                                          │
│  │                    │    product system i                      │
│  │  Ecological        │    ─────────────────                     │
│  │  Resource          │                                          │
│  │  Budget ERP        │    cascaded material to lower quality    │
│  │                    │    ──────────────────────────────────────│
│  └────────────────────┘                                          │
│                            product system i+1                    │
│                            ───────────────────                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Flow Types:**
- **Primary Input**: Blue arrow from ERP budget
- **Secondary Input**: Gray arrow from higher quality systems
- **Product Mass**: Central flow through product
- **Recycled Output**: Loop back (same or higher quality)
- **Cascaded Output**: Flow to lower quality systems
- **Final Loss**: Red arrow to ERP (environmental impact)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 2025 | Claude/Melody | Initial documentation |

---

*End of Document*
