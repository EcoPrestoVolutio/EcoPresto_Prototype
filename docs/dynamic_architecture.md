# Resource Pressure Calculator - Dynamic Architecture

## Your Understanding: Validated & Refined ✓

You've correctly identified the layers:

| Excel Sheet | Purpose | Web App Equivalent |
|-------------|---------|-------------------|
| Sheet 3 (ERP) | Industry standard data | **Reference Data** (read-only) |
| Sheet 2 (Materials & Energy) | Configuration database | **User Configuration** (editable) |
| Sheets 4-6 (RP_*) | Calculations | **Calculation Engine** (code) |
| Sheet 1 (Overview) | Dashboard results | **UI Dashboard** |

---

## The Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LAYER 1: REFERENCE DATA (Fixed/Read-Only)                │
│                    ═══════════════════════════════════════                  │
│   Industry-standard ERP values from ecoinvent/ERA research                  │
│   Managed by system admins, rarely changes                                  │
│                                                                             │
│   • ERP Database (materials, electricity, heat, transport)                  │
│   • Limiting boundaries (CO₂, biophysical, biodiversity)                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 LAYER 2: ORGANIZATION CONFIGURATION (Reusable)              │
│                 ══════════════════════════════════════════════              │
│   Organization's library of materials, energy mixes, transport profiles    │
│   Set up once, reused across many projects                                  │
│                                                                             │
│   • Material Library (their commonly used materials)                        │
│   • Energy Mix Profiles (e.g., "Swiss Grid", "100% Renewable")              │
│   • Transport Profiles (e.g., "European Rail", "Global Shipping")           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LAYER 3: PROJECT & SCENARIOS (Dynamic)                   │
│                    ══════════════════════════════════════                   │
│   Specific product analysis with multiple what-if scenarios                 │
│   Created per project, compared side-by-side                                │
│                                                                             │
│   • Product Definition (bill of materials, lifetime, transport)             │
│   • Scenarios (different configurations to compare)                         │
│   • Calculation Results (τ values, breakdowns)                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Refined Entity Model

### Layer 1: Reference Data (System-Managed)

```typescript
// Fixed ERP database - from ecoinvent/ERA research
// Users SELECT from this, they don't modify it

interface ERPEntry {
  id: string;                    // "el_coal", "cement_unspecified", etc.
  name: string;                  // "electricity, coal"
  processDescription: string;    // Full ecoinvent process name
  category: "electricity" | "heat" | "transport" | "material";
  unit: string;                  // "kWh", "kg", "tkm"
  erpEffective: number;          // e.g., 7.57e11 - sustainable annual budget
  limitingBoundary: string;      // "CO_2", "biophysical", "biodiversity"
  dataSource: string;            // "ecoinvent3_9"
}

// Examples from Sheet 3:
// - "el_coal" → ERP = 7.57×10¹¹ kWh/year (limited by CO₂)
// - "cement_unspecified" → ERP = 1.32×10¹² kg/year (limited by CO₂)
// - "hardwood" → ERP = 3.00×10¹² kg/year (limited by biophysical)
```

### Layer 2: Organization Configuration (User-Managed, Reusable)

```typescript
interface Organization {
  id: string;
  name: string;
  // Default profiles used when creating new projects
  defaultElectricityMixId?: string;
  defaultHeatMixId?: string;
  defaultTransportLandMixId?: string;
  defaultTransportOverseasMixId?: string;
}

// Material in organization's library
// Maps to ERP reference + adds org-specific parameters
interface MaterialDefinition {
  id: string;
  organizationId: string;
  
  // Identity
  name: string;                  // "Portland Cement CEM I"
  erpEntryId: string;            // FK to ERPEntry → "cement_unspecified"
  category: "bulk" | "reinforcement" | "form" | "chemicals" | "other";
  
  // Default properties (can be overridden per scenario)
  defaultMassPerUnit?: number;   // If commonly used at specific mass
  
  // Manufacturing parameters
  manufacturingLosses: number;   // 0.1 = 10% waste
  electricityPerKg: number;      // kWh needed to process 1 kg
  heatPerKg: number;             // kWh heat needed per kg
  
  // Circularity parameters - Basic scenario
  basicPrimaryContent: number;   // Fraction virgin material (0-1)
  basicCollectionRate: number;   // Collection at end-of-life
  basicRecyclingRate: number;    // Recycling of collected
  basicCascadingRate: number;    // Downcycling of collected
  
  // Circularity parameters - Green/Optimized scenario
  greenPrimaryContent: number;
  greenCollectionRate: number;
  greenRecyclingRate: number;
  greenCascadingRate: number;
  
  // Metadata
  notes?: string;
  sourceReference?: string;
}

// Energy/Transport mix profile
// Reusable across projects
interface MixProfile {
  id: string;
  organizationId: string;
  name: string;                  // "Swiss Electricity Grid 2024"
  type: "electricity" | "heat" | "transport_land" | "transport_overseas";
  shares: MixShare[];
}

interface MixShare {
  erpEntryId: string;            // FK to ERPEntry
  share: number;                 // 0-1, must sum to 1 within profile
}

// Examples:
// Swiss Grid: {hydro: 0.65, nuclear: 0.29, gas: 0.02, wind: 0.01, solar: 0.02, wood: 0.01}
// 100% Renewable: {hydro: 0.4, wind: 0.3, solar: 0.3}
// Heat Pump + Solar: {heat_pump: 0.5, solar: 0.5}
```

### Layer 3: Project & Scenarios (Project-Specific)

```typescript
// The product being analyzed (replaces "SleeperType")
interface Product {
  id: string;
  organizationId: string;
  
  name: string;                  // "Railway Sleeper Model A" or "Steel Bridge Component"
  description?: string;
  
  lifetime: number;              // Years of service
  functionalUnit: string;        // "per sleeper", "per meter", "per kg output"
  
  // Transport distances (km)
  manufacturingTransportDistance: number;
  installationTransportDistance: number;
  disposalTransportDistance: number;
  
  // Bill of Materials
  components: ProductComponent[];
}

interface ProductComponent {
  id: string;
  productId: string;
  materialDefinitionId: string;  // FK to MaterialDefinition
  
  mass: number;                  // kg per functional unit
  use: "bulk" | "reinforcement" | "form" | "chemicals" | "other";
  notes?: string;
}

// A specific configuration to calculate
interface Scenario {
  id: string;
  productId: string;
  
  name: string;                  // "Base Case", "Green Energy", "High Recycling"
  description?: string;
  
  // Which mix profiles to use
  electricityMixId: string;
  heatMixId: string;
  transportLandMixId: string;
  transportOverseasMixId: string;
  
  // Material variant selection
  materialVariant: "basic" | "green";  // Which circularity params to use
  
  // Optional: Override specific materials for this scenario
  componentOverrides?: ComponentOverride[];
  
  // Optional: Override lifetime for comparison
  lifetimeOverride?: number;
}

interface ComponentOverride {
  productComponentId: string;
  
  // Any of these can override the material defaults
  massOverride?: number;
  primaryContentOverride?: number;
  manufacturingLossesOverride?: number;
  collectionRateOverride?: number;
  recyclingRateOverride?: number;
  cascadingRateOverride?: number;
}

// Calculation output
interface CalculationResult {
  id: string;
  scenarioId: string;
  calculatedAt: Date;
  
  // Total
  tauTotal: number;
  
  // Breakdown by component type
  tauByComponent: {
    materials: { [componentId: string]: number };
    electricity: number;
    heat: number;
    transportLand: number;
    transportOverseas: number;
  };
  
  // Which boundary is most stressed
  limitingBoundary: string;
  
  // Detailed breakdown for analysis
  details: CalculationDetails;
}
```

---

## User Flow: Creating a New Project

### Step 1: Set Up Organization (One-Time)
```
Organization: "Swiss Federal Railways (SBB)"
├── Material Library:
│   ├── "Portland Cement" → links to ERP "cement_unspecified"
│   ├── "Recycled Steel" → links to ERP "low-alloyed steel"
│   ├── "Swiss Hardwood" → links to ERP "hardwood"
│   └── ... (their commonly used materials)
│
├── Energy Profiles:
│   ├── "SBB Grid Mix" (hydro: 90%, nuclear: 5%, other: 5%)
│   ├── "100% Renewable" (hydro: 50%, solar: 30%, wind: 20%)
│   └── "Standard Industrial Heat" (gas: 50%, oil: 50%)
│
└── Transport Profiles:
    ├── "Swiss Rail Network" (electric train: 100%)
    └── "European Mixed" (electric train: 60%, diesel train: 20%, lorry: 20%)
```

### Step 2: Create a Product (Per Project)
```
Product: "B70 Concrete Sleeper"
├── Lifetime: 40 years
├── Functional Unit: "per sleeper"
├── Transport Distances: mfg=0km, install=150km, disposal=100km
│
└── Bill of Materials:
    ├── Portland Cement: 170 kg (bulk)
    ├── Gravel: 100 kg (bulk)
    ├── Recycled Steel: 20 kg (reinforcement)
    └── PUR Foam: 5 kg (form)
```

### Step 3: Create Scenarios to Compare
```
Scenario A: "Current Practice"
├── Electricity: "Standard Industrial"
├── Heat: "Standard Industrial Heat"
├── Transport: "European Mixed"
└── Materials: "basic" variant

Scenario B: "Green Transition"
├── Electricity: "100% Renewable"
├── Heat: "Heat Pump + Solar"
├── Transport: "Swiss Rail Network"
└── Materials: "green" variant

Scenario C: "Extended Lifetime"
├── ... same as A ...
└── Lifetime Override: 50 years
```

### Step 4: View Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│                    B70 Concrete Sleeper                         │
│                    Resource Pressure Comparison                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Scenario          │ τ Total    │ Limiting   │ Reduction     │
│   ──────────────────┼────────────┼────────────┼───────────────│
│   Current Practice  │ 5.02×10⁻¹² │ CO₂        │ baseline      │
│   Green Transition  │ 3.15×10⁻¹² │ biophysical│ -37%          │
│   Extended Lifetime │ 4.02×10⁻¹² │ CO₂        │ -20%          │
│                                                                 │
│   [Stacked bar chart showing breakdown by component]            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## The Dynamic Part: No Code Changes Needed

The key insight is that **all variability is in the data**, not the code:

| What Changes | Where It's Stored | Who Changes It |
|--------------|-------------------|----------------|
| New ERP values (rare) | ERPEntry table | System Admin |
| New materials | MaterialDefinition table | Organization User |
| New energy mixes | MixProfile table | Organization User |
| New products | Product + ProductComponent tables | Project User |
| New scenarios | Scenario table | Project User |

The **calculation engine** (your code) stays the same:

```typescript
function calculateResourcePressure(scenario: Scenario): CalculationResult {
  const product = getProduct(scenario.productId);
  const electricityMix = getMixProfile(scenario.electricityMixId);
  const heatMix = getMixProfile(scenario.heatMixId);
  // ... etc
  
  let tauTotal = 0;
  const tauByComponent = {};
  
  // For each material component
  for (const component of product.components) {
    const material = getMaterialDefinition(component.materialDefinitionId);
    const erp = getERPEntry(material.erpEntryId);
    const params = scenario.materialVariant === 'green' 
      ? getGreenParams(material) 
      : getBasicParams(material);
    
    // Apply overrides if any
    const finalParams = applyOverrides(params, scenario.componentOverrides, component.id);
    
    // THE UNIVERSAL FORMULA - same for ALL materials
    const tau = calculateMaterialTau(
      component.mass,
      erp.erpEffective,
      finalParams.manufacturingLosses,
      product.lifetime,
      finalParams.primaryContent,
      calculateRecyclability(finalParams),
      calculateCascadability(finalParams)
    );
    
    tauByComponent.materials[component.id] = tau;
    tauTotal += tau;
  }
  
  // Electricity τ - same formula regardless of source mix
  const tauElectricity = calculateEnergyTau(
    calculateTotalElectricity(product, scenario),
    product.lifetime,
    electricityMix.shares
  );
  tauTotal += tauElectricity;
  
  // ... heat, transport similarly
  
  return { tauTotal, tauByComponent, ... };
}
```

---

## Summary: Your Corrected Entity Model

```
┌─────────────────────────────────────────────────────────────────┐
│                     REFERENCE DATA (Fixed)                      │
├─────────────────────────────────────────────────────────────────┤
│  ERPEntry                                                       │
│  ├── id, name, category, unit                                   │
│  ├── erpEffective (sustainable budget)                          │
│  └── limitingBoundary                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ references
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ORGANIZATION CONFIG (Reusable)                 │
├─────────────────────────────────────────────────────────────────┤
│  Organization                                                   │
│  └── has many ───┬── MaterialDefinition                         │
│                  │   ├── links to ERPEntry                      │
│                  │   ├── manufacturing params                   │
│                  │   └── circularity params (basic/green)       │
│                  │                                              │
│                  └── MixProfile                                 │
│                      ├── type (electricity/heat/transport)      │
│                      └── shares [{erpEntryId, percentage}]      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PROJECT DATA (Dynamic)                       │
├─────────────────────────────────────────────────────────────────┤
│  Product (was "SleeperType" - now generic)                      │
│  ├── name, lifetime, transport distances                        │
│  └── has many ─── ProductComponent                              │
│                   ├── links to MaterialDefinition               │
│                   └── mass, use category                        │
│                              │                                  │
│                              │ configured by                    │
│                              ▼                                  │
│  Scenario                                                       │
│  ├── links to Product                                           │
│  ├── links to MixProfiles (el, heat, transport)                 │
│  ├── materialVariant (basic/green)                              │
│  └── optional overrides                                         │
│                              │                                  │
│                              │ produces                         │
│                              ▼                                  │
│  CalculationResult                                              │
│  ├── tauTotal                                                   │
│  ├── tauByComponent breakdown                                   │
│  └── limitingBoundary                                           │
└─────────────────────────────────────────────────────────────────┘
```

This is exactly the dynamic system you envisioned - **configure once, calculate anything**!
