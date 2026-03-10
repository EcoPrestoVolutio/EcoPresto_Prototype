# Universal Resource Pressure (τ) Formula System

## Your Insight is Correct ✓

Yes! The goal is to build a **general-purpose system** where ANY organization can calculate the environmental impact (resource pressure τ) of ANY product or material. The sleeper sheets (RP_wood, RP_concrete, RP_SICUT) are just **specific applications** of a universal formula.

---

## The Universal Formula

### Overview

**Resource Pressure (τ)** measures the fraction of Earth's sustainable resource budget consumed by a product over its lifetime. It's dimensionless and additive across components.

```
τ_total = Σ(τ_materials) + τ_electricity + τ_heat + τ_transport
```

---

## 1. Material Resource Pressure Formula

For **each material** in a product:

```
τ_material = 0.5 × (m / ERP) × (1 + λ) × (1 / L) × (1 + p × (1 - R) - R - C)
```

### Variables:

| Symbol | Name | Unit | Description |
|--------|------|------|-------------|
| **m** | Mass | kg | Mass of this material per product unit |
| **ERP** | Ecological Resource Potential | kg/year | Sustainable global production (from ERP database) |
| **λ** | Manufacturing losses | fraction (0-1) | Material lost during manufacturing (e.g., 0.1 = 10%) |
| **L** | Lifetime | years | Product service life |
| **p** | Primary content | fraction (0-1) | Fraction of virgin (non-recycled) material input |
| **R** | Recyclability | fraction (0-1) | Overall recycling rate (calculated below) |
| **C** | Cascadability | fraction (0-1) | Overall cascading rate (calculated below) |

### Supporting Calculations:

**Recyclability (R):**
```
R = (cr_mfg × rr_mfg × λ + cr_eol × rr_eol) / (1 + λ)
```

**Cascadability (C):**
```
C = (cr_mfg × car_mfg × λ + cr_eol × car_eol) / (1 + λ)
```

**Loss Rate (ω):**
```
ω = 1 - cr_eol × (rr_eol + car_eol)
```

Where:
- `cr_mfg` = Collection rate of manufacturing waste
- `rr_mfg` = Recycling rate of collected manufacturing waste
- `car_mfg` = Cascading rate of collected manufacturing waste
- `cr_eol` = Collection rate of end-of-life products
- `rr_eol` = Recycling rate of collected end-of-life products
- `car_eol` = Cascading rate of collected end-of-life products

---

## 2. Electricity Resource Pressure Formula

```
τ_electricity = (E_total / L) × Σᵢ(shareᵢ / ERPᵢ)
```

### Variables:

| Symbol | Name | Unit | Description |
|--------|------|------|-------------|
| **E_total** | Total electricity | kWh | All electricity needed (manufacturing + recycling + heat pump) |
| **L** | Lifetime | years | Product service life |
| **shareᵢ** | Mix share | fraction (0-1) | Fraction of electricity from source i |
| **ERPᵢ** | ERP for source i | kWh/year | Sustainable electricity from source i |

### Electricity Sources (from ERP database):
- Coal, Oil, Gas, Nuclear
- Wind (onshore/offshore), Geothermal, Wood biomass
- Hydro, Solar PV (desert/rooftop)

---

## 3. Heat Resource Pressure Formula

```
τ_heat = (H_total / L) × Σᵢ(shareᵢ / Σshares / ERPᵢ)
```

### Variables:

| Symbol | Name | Unit | Description |
|--------|------|------|-------------|
| **H_total** | Total heat | kWh | Heat needed (excluding heat pump portion) |
| **L** | Lifetime | years | Product service life |
| **shareᵢ** | Mix share | fraction (0-1) | Fraction of heat from source i |
| **ERPᵢ** | ERP for source i | kWh/year | Sustainable heat from source i |

### Heat Sources:
- Gas, Propane, Oil, Wood, Solar thermal, Heat pump

**Note:** If using heat pump, electricity for heat pump is added to electricity calculation, and heat is reduced accordingly:
```
H_effective = H_total × (1 - heat_pump_share)
E_heat_pump = H_total × heat_pump_share × heat_pump_factor  (factor ≈ 0.33)
```

---

## 4. Transport Resource Pressure Formula

```
τ_transport = (tkm / L) × Σᵢ(shareᵢ / ERPᵢ)
```

### Variables:

| Symbol | Name | Unit | Description |
|--------|------|------|-------------|
| **tkm** | Transport work | ton-kilometers | Total transport (manufacturing + installation + disposal) |
| **L** | Lifetime | years | Product service life |
| **shareᵢ** | Mix share | fraction (0-1) | Fraction by transport mode i |
| **ERPᵢ** | ERP for mode i | tkm/year | Sustainable transport from mode i |

### Transport Modes:
- Freight train (diesel/electric)
- Lorry (truck)
- Sea shipping
- Air freight

---

## Complete Calculation Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         INPUT: Product Definition                        │
├─────────────────────────────────────────────────────────────────────────┤
│  • Lifetime (L)                                                         │
│  • Bill of Materials: [{material, mass, primary_content}]               │
│  • Manufacturing: electricity (kWh/kg), heat (kWh/kg), losses (%)       │
│  • End-of-Life: collection, recycling, cascading rates                  │
│  • Transport: distances (km) for manufacturing, installation, disposal  │
│  • Energy Mix: electricity source shares, heat source shares            │
│  • Transport Mix: mode shares for land and overseas                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         ERP DATABASE LOOKUP                              │
├─────────────────────────────────────────────────────────────────────────┤
│  For each material/energy/transport → Get ERP value + limiting boundary │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         CALCULATE COMPONENTS                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  FOR EACH MATERIAL:                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 1. Calculate R (recyclability)                                   │   │
│  │ 2. Calculate C (cascadability)                                   │   │
│  │ 3. τ = 0.5 × (m/ERP) × (1+λ) × (1/L) × (1 + p×(1-R) - R - C)    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ELECTRICITY:                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ E_total = Σ(mass × kWh_per_kg) + heat_pump_electricity           │   │
│  │ τ_el = (E_total / L) × Σ(share_i / ERP_i)                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  HEAT:                                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ H_total = Σ(mass × kWh_per_kg) × (1 - heat_pump_share)           │   │
│  │ τ_heat = (H_total / L) × Σ(share_i / Σshares / ERP_i)            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  TRANSPORT:                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ tkm_land = total_mass × (dist_mfg + dist_install) / 1000         │   │
│  │ tkm_overseas = total_mass × dist_disposal / 1000                 │   │
│  │ τ_trans = (tkm / L) × Σ(share_i / ERP_i)                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              OUTPUT                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  τ_total = Σ(τ_materials) + τ_electricity + τ_heat + τ_transport        │
│                                                                         │
│  Breakdown:                                                             │
│  • τ per material component                                             │
│  • τ for electricity                                                    │
│  • τ for heat                                                           │
│  • τ for transport (land + overseas)                                    │
│  • Limiting boundary (which Earth system constraint is most stressed)   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Web Application Data Model

### Core Entities (Product-Agnostic)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         REFERENCE DATA (ERP Database)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ERPValue                                                               │
│  ├── identifier (PK)      "cement unspecified"                         │
│  ├── processName          "cement, unspecified//[CH] market..."        │
│  ├── category             "material" | "electricity" | "heat" | "transport"
│  ├── unit                 "kg" | "kWh" | "tkm"                          │
│  ├── erpEffective         1.318e+12  (annual sustainable budget)        │
│  ├── limitingBoundary     "CO_2" | "biophysical" | "biodiversity"       │
│  └── dataSource           "ecoinvent3_9"                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         USER-DEFINED DATA                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Organization                                                           │
│  ├── id (PK)                                                            │
│  ├── name                                                               │
│  └── energyMixes[]        (default electricity/heat/transport mixes)    │
│                                                                         │
│  Material (user's material library)                                     │
│  ├── id (PK)                                                            │
│  ├── organizationId (FK)                                                │
│  ├── name                 "Portland Cement"                             │
│  ├── erpIdentifier (FK)   "cement unspecified"                          │
│  ├── primaryContent       0.9  (90% virgin)                             │
│  ├── manufacturingLosses  0.1  (10% waste)                              │
│  ├── electricityPerKg     0.1  kWh/kg                                   │
│  ├── heatPerKg            0.0  kWh/kg                                   │
│  ├── collectionRate       1.0                                           │
│  ├── recyclingRate        0.0                                           │
│  └── cascadingRate        0.5                                           │
│                                                                         │
│  Product                                                                │
│  ├── id (PK)                                                            │
│  ├── organizationId (FK)                                                │
│  ├── name                 "Railway Sleeper Type A"                      │
│  ├── lifetime             40 years                                      │
│  ├── transportDistances   {manufacturing: 0, installation: 150, disposal: 0}
│  └── components[]         (BillOfMaterials)                             │
│                                                                         │
│  BillOfMaterials                                                        │
│  ├── productId (FK)                                                     │
│  ├── materialId (FK)                                                    │
│  ├── mass                 170 kg                                        │
│  └── use                  "bulk" | "reinforcement" | "form" | "chemicals"
│                                                                         │
│  EnergyMix                                                              │
│  ├── id (PK)                                                            │
│  ├── organizationId (FK)                                                │
│  ├── name                 "Swiss Grid 2024"                             │
│  ├── type                 "electricity" | "heat" | "transport_land" | "transport_overseas"
│  └── shares[]             [{erpIdentifier, share}]                      │
│                                                                         │
│  Scenario                                                               │
│  ├── id (PK)                                                            │
│  ├── productId (FK)                                                     │
│  ├── name                 "Base Case"                                   │
│  ├── electricityMixId     (FK to EnergyMix)                             │
│  ├── heatMixId            (FK to EnergyMix)                             │
│  ├── transportLandMixId   (FK to EnergyMix)                             │
│  ├── transportOverseasMixId (FK to EnergyMix)                           │
│  └── materialOverrides[]  (optional per-material adjustments)           │
│                                                                         │
│  CalculationResult                                                      │
│  ├── id (PK)                                                            │
│  ├── scenarioId (FK)                                                    │
│  ├── calculatedAt                                                       │
│  ├── tauTotal             4.21e-12                                      │
│  ├── tauBreakdown         {materials: {...}, electricity, heat, transport}
│  └── limitingBoundary     "CO_2"                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Example: Calculating τ for ANY Product

### Input: A Simple Steel Component

```javascript
const product = {
  name: "Steel Bracket",
  lifetime: 20, // years
  components: [
    { material: "low-alloyed steel", mass: 5 } // 5 kg
  ],
  transport: {
    manufacturing: 100, // km
    installation: 50,   // km
    disposal: 100       // km
  }
};

const material = {
  erpIdentifier: "low-alloyed steel",
  erpValue: 4.335e11, // kg/year
  primaryContent: 0.5, // 50% virgin, 50% recycled
  manufacturingLosses: 0.1,
  collectionRate: 1.0,
  recyclingRate: 0.9,
  cascadingRate: 0.0,
  electricityPerKg: 1.0, // kWh/kg
  heatPerKg: 0.0
};

const electricityMix = {
  "el, hydro": 0.6,
  "el, nuclear": 0.3,
  "el, gas": 0.1
};
```

### Calculation:

```javascript
// Step 1: Recyclability
const R = (1.0 * 0.9 * 0.1 + 1.0 * 0.9) / (1 + 0.1) = 0.9;

// Step 2: Cascadability
const C = 0;

// Step 3: Material τ
const tau_material = 0.5 * (5 / 4.335e11) * (1 + 0.1) * (1/20) * (1 + 0.5*(1-0.9) - 0.9 - 0)
                   = 0.5 * 1.15e-11 * 1.1 * 0.05 * 0.15
                   = 4.7e-14;

// Step 4: Electricity τ
const E_total = 5 * 1.1 * 1.0 = 5.5 kWh;
const tau_el = (5.5 / 20) * (0.6/3.67e12 + 0.3/7.03e12 + 0.1/1.42e12)
             = 0.275 * (1.63e-13 + 4.27e-14 + 7.04e-14)
             = 7.6e-14;

// Step 5: Transport τ  
const tkm = (5/1000) * (100 + 50 + 100) = 1.25 tkm;
// ... similar calculation

// Total
const tau_total = tau_material + tau_el + tau_transport;
```

---

## Key Insight: The System is Material/Product Agnostic

The **ERP database** is the only fixed reference data. Everything else is configurable:

1. **Any material** can be added if it maps to an ERP identifier
2. **Any product** can be defined as a bill of materials + lifetime
3. **Any energy mix** can be configured (e.g., 100% renewable)
4. **Any transport scenario** can be modeled

The sleeper-specific sheets in the Excel are just **pre-configured products**. Your web app should allow users to:
- Define their own materials
- Create custom products
- Compare scenarios
- See which Earth system boundary is most stressed

---

## Summary

**Yes, there is ONE universal formula system** that applies to any material/product. The formula has 4 components:

| Component | Formula |
|-----------|---------|
| **Material** | `τ = 0.5 × (m/ERP) × (1+λ) × (1/L) × (1 + p×(1-R) - R - C)` |
| **Electricity** | `τ = (E/L) × Σ(share/ERP)` |
| **Heat** | `τ = (H/L) × Σ(share/Σshares/ERP)` |
| **Transport** | `τ = (tkm/L) × Σ(share/ERP)` |

The ERP values come from the ecoinvent/ERA research and represent **how much of each resource the Earth can sustainably provide per year**.

Your web app becomes a **universal resource pressure calculator** that any organization can use for any product!
