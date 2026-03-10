# Data Model Validation & Corrections

## Summary: Your Diagrams Are ~85% Correct

The calculation flow is accurate, but the data model is missing some important details from the Excel structure. Here are the corrections:

---

## Issue #1: Material Has TWO Sets of Circularity Parameters

The Excel has **separate rates for manufacturing waste vs end-of-life products**:

```
From tbl_material columns:

MANUFACTURING WASTE (single values):
├── Col 10: collection rate (of manufacturing losses)
├── Col 11: recycling rate (of collected manufacturing losses)
└── Col 12: cascading rate (of collected manufacturing losses)

END-OF-LIFE PRODUCTS (basic AND green variants):
├── Col 17: basic_collection rate
├── Col 18: green_collection rate
├── Col 19: basic_recycling rate
├── Col 20: green_recycling rate
├── Col 21: basic_cascading rate
└── Col 22: green_cascading rate
```

**Why this matters:** The recyclability formula uses BOTH:
```
R = (cr_mfg × rr_mfg × λ + cr_eol × rr_eol) / (1 + λ)
     ─────────────────────   ───────────────
     manufacturing waste     end-of-life
```

---

## Issue #2: Material Has TWO Sets of Energy Parameters

The Excel separates energy for manufacturing vs recycling:

```
From tbl_material columns:

├── Col 13: electricity to manufacture product (kWh/kg)
├── Col 14: electricity to recycle/cascade product (kWh/kg)  ← SEPARATE!
├── Col 15: heat to manufacture product (kWh/kg)
└── Col 16: heat to recycle/cascade product (kWh/kg)  ← SEPARATE!
```

**Why this matters:** Total electricity is:
```
E_total = E_manufacture + E_heat_pump + E_recycle
```

Your model only had `electricityPerKg` (one value), but needs two.

---

## Issue #3: Primary Content Has Basic/Green Variants

```
├── Col 7: basic_primary material content
└── Col 8: green_primary material content
```

Your model only showed one `primaryContent` value.

---

## Corrected Data Model

### Reference Data (No Changes Needed) ✓

```typescript
interface ERPEntry {
  identifier: string;           // PK - "cement_unspecified"
  processName: string;          // Full ecoinvent name
  category: "material" | "electricity" | "heat" | "transport";
  unit: string;                 // "kg" | "kWh" | "tkm"
  erpEffective: number;         // Sustainable annual budget
  limitingBoundary: string;     // "CO_2" | "biophysical" | "biodiversity"
  dataSource: string;           // "ecoinvent3_9"
}
```

### Material Definition (CORRECTED)

```typescript
interface MaterialDefinition {
  id: string;
  organizationId: string;
  
  // Identity
  name: string;                          // "Portland Cement"
  erpIdentifier: string;                 // FK to ERPEntry
  category: "bulk" | "reinforcement" | "form" | "chemicals" | "other";
  
  // Mass (optional default)
  defaultMass?: number;                  // kg, if commonly used at specific mass
  remarks?: string;
  
  // Manufacturing parameters (single values - not scenario-dependent)
  manufacturingLosses: number;           // 0.1 = 10% waste
  
  // Energy for MANUFACTURING (kWh per kg of product)
  electricityToManufacture: number;      // Col 13
  heatToManufacture: number;             // Col 15
  
  // Energy for RECYCLING/CASCADING (kWh per kg)
  electricityToRecycle: number;          // Col 14
  heatToRecycle: number;                 // Col 16
  
  // Manufacturing waste circularity (single values)
  mfgWasteCollectionRate: number;        // Col 10
  mfgWasteRecyclingRate: number;         // Col 11
  mfgWasteCascadingRate: number;         // Col 12
  
  // === BASIC SCENARIO (End-of-Life) ===
  basicPrimaryContent: number;           // Col 7 - fraction virgin material
  basicEolCollectionRate: number;        // Col 17
  basicEolRecyclingRate: number;         // Col 19
  basicEolCascadingRate: number;         // Col 21
  
  // === GREEN SCENARIO (End-of-Life) ===
  greenPrimaryContent: number;           // Col 8 - fraction virgin material
  greenEolCollectionRate: number;        // Col 18
  greenEolRecyclingRate: number;         // Col 20
  greenEolCascadingRate: number;         // Col 22
}
```

### Product (Minor Clarification)

```typescript
interface Product {
  id: string;
  organizationId: string;
  
  name: string;
  description?: string;
  lifetime: number;                      // Years
  functionalUnit: string;                // "per unit", "per meter", etc.
  
  // Transport distances (km) - from tbl_sleeper
  manufacturingTransportDistance: number;  // Land transport
  installationTransportDistance: number;   // Land transport
  disposalTransportDistance: number;       // Can be overseas
  
  components: ProductComponent[];
}

interface ProductComponent {
  id: string;
  productId: string;
  materialDefinitionId: string;
  
  mass: number;                          // kg per functional unit
  category: "bulk" | "reinforcement" | "form" | "chemicals" | "other";
  notes?: string;
}
```

### Energy/Transport Mix (No Changes Needed) ✓

```typescript
interface MixProfile {
  id: string;
  organizationId: string;
  
  name: string;                          // "Swiss Grid 2024"
  type: "electricity" | "heat" | "transport_land" | "transport_overseas";
  shares: MixShare[];
}

interface MixShare {
  erpEntryId: string;                    // FK to ERPEntry
  share: number;                         // 0-1, must sum to 1
}
```

### Scenario (Minor Addition)

```typescript
interface Scenario {
  id: string;
  productId: string;
  
  name: string;
  description?: string;
  
  // Energy/Transport mix selections
  electricityMixId: string;
  heatMixId: string;
  transportLandMixId: string;
  transportOverseasMixId: string;
  
  // NEW: Which material variant to use
  materialVariant: "basic" | "green";    // Selects which EoL rates to use
  
  // Optional: Override lifetime for comparison
  lifetimeOverride?: number;
  
  // Optional: Override specific component parameters
  componentOverrides?: ComponentOverride[];
}

interface ComponentOverride {
  productComponentId: string;
  
  // Override any of these
  massOverride?: number;
  primaryContentOverride?: number;
  eolCollectionRateOverride?: number;
  eolRecyclingRateOverride?: number;
  eolCascadingRateOverride?: number;
}
```

### Calculation Result (No Changes Needed) ✓

```typescript
interface CalculationResult {
  id: string;
  scenarioId: string;
  calculatedAt: Date;
  
  tauTotal: number;
  
  tauBreakdown: {
    materials: Record<string, number>;   // componentId → τ
    electricity: number;
    heat: number;
    transportLand: number;
    transportOverseas: number;
  };
  
  limitingBoundary: string;
  
  // Detailed intermediate values for debugging/transparency
  details?: CalculationDetails;
}
```

---

## Corrected Calculation Flow

### For Materials:

```
FOR EACH component in product:
  
  material = getMaterialDefinition(component.materialDefinitionId)
  erp = getERPEntry(material.erpIdentifier)
  
  // Select variant based on scenario
  IF scenario.materialVariant == "basic":
    p = material.basicPrimaryContent
    cr_eol = material.basicEolCollectionRate
    rr_eol = material.basicEolRecyclingRate
    car_eol = material.basicEolCascadingRate
  ELSE:
    p = material.greenPrimaryContent
    cr_eol = material.greenEolCollectionRate
    rr_eol = material.greenEolRecyclingRate
    car_eol = material.greenEolCascadingRate
  
  // Manufacturing waste rates (same for both variants)
  cr_mfg = material.mfgWasteCollectionRate
  rr_mfg = material.mfgWasteRecyclingRate
  car_mfg = material.mfgWasteCascadingRate
  
  λ = material.manufacturingLosses
  m = component.mass
  L = product.lifetime (or scenario.lifetimeOverride)
  
  // Calculate circularity metrics
  R = (cr_mfg × rr_mfg × λ + cr_eol × rr_eol) / (1 + λ)
  C = (cr_mfg × car_mfg × λ + cr_eol × car_eol) / (1 + λ)
  
  // Resource pressure for this material
  τ_material = 0.5 × (m / erp.erpEffective) × (1 + λ) × (1 / L) × (1 + p × (1 - R) - R - C)
```

### For Electricity:

```
// Sum electricity across all components
E_manufacture = Σ(component.mass × (1 + material.manufacturingLosses) × material.electricityToManufacture)
E_recycle = Σ(component.mass × (1 + material.manufacturingLosses) × material.electricityToRecycle)

// Heat pump contribution (if heat pump in heat mix)
heatPumpShare = getHeatPumpShare(scenario.heatMixId)
H_total_raw = Σ(component.mass × (1 + λ) × (material.heatToManufacture + material.heatToRecycle))
E_heatPump = heatPumpShare × H_total_raw × HEAT_PUMP_FACTOR  // Factor ≈ 0.33

E_total = E_manufacture + E_recycle + E_heatPump

// Calculate τ
electricityMix = getMixProfile(scenario.electricityMixId)
τ_electricity = (E_total / L) × Σ(share_i / erp_i)
```

### For Heat:

```
H_manufacture = Σ(component.mass × (1 + λ) × material.heatToManufacture)
H_recycle = Σ(component.mass × (1 + λ) × material.heatToRecycle)
H_total_raw = H_manufacture + H_recycle

// Subtract heat pump portion (provided by electricity instead)
heatPumpShare = getHeatPumpShare(scenario.heatMixId)
H_total = H_total_raw × (1 - heatPumpShare)

// Calculate τ
heatMix = getMixProfile(scenario.heatMixId)  // excluding heat pump entry
τ_heat = (H_total / L) × Σ(share_i / Σshares / erp_i)
```

### For Transport:

```
totalMass = Σ(component.mass)

// Land transport (manufacturing + installation)
tkm_land = totalMass × (product.manufacturingTransportDistance + product.installationTransportDistance) / 1000
transportLandMix = getMixProfile(scenario.transportLandMixId)
τ_transport_land = (tkm_land / L) × Σ(share_i / erp_i)

// Overseas transport (disposal)
tkm_overseas = totalMass × product.disposalTransportDistance / 1000
transportOverseasMix = getMixProfile(scenario.transportOverseasMixId)
τ_transport_overseas = (tkm_overseas / L) × Σ(share_i / erp_i)
```

### Total:

```
τ_total = Σ(τ_materials) + τ_electricity + τ_heat + τ_transport_land + τ_transport_overseas
```

---

## Visual Comparison: Before vs After

### Material Entity

| Your Original | Corrected |
|---------------|-----------|
| `electricityPerKg` | `electricityToManufacture` + `electricityToRecycle` |
| `heatPerKg` | `heatToManufacture` + `heatToRecycle` |
| `primaryContent` | `basicPrimaryContent` + `greenPrimaryContent` |
| `collectionRate` | `mfgWasteCollectionRate` + `basicEolCollectionRate` + `greenEolCollectionRate` |
| `recyclingRate` | `mfgWasteRecyclingRate` + `basicEolRecyclingRate` + `greenEolRecyclingRate` |
| `cascadingRate` | `mfgWasteCascadingRate` + `basicEolCascadingRate` + `greenEolCascadingRate` |

### Total Fields in Material

| Your Original | Corrected |
|---------------|-----------|
| ~10 fields | ~18 fields |

---

## Summary of Corrections

1. **Material needs TWO energy values**: manufacture vs recycle
2. **Material needs THREE sets of circularity rates**: 
   - Manufacturing waste (single)
   - End-of-life basic
   - End-of-life green
3. **Primary content** needs basic + green variants
4. **Scenario** needs `materialVariant: "basic" | "green"` selector
5. **Calculation** must sum electricity for manufacture + recycle + heat pump

Everything else in your diagrams is correct!
