# Resource Pressure Calculator - Complete Analysis

## Executive Summary

This Excel workbook implements the **Resource Pressure Method** based on the **Ecological Resource Availability (ERA)** framework from the Desing et al. (2020) paper. It calculates the environmental sustainability of three types of railway sleepers (Schwellen in German):
- **Wood sleepers** (Holzschwelle)
- **Concrete sleepers** (Betonschwelle)  
- **SICUT sleepers** (synthetic sleepers made from PET/glass fiber)

The core output is **τ (tau) - Resource Pressure** - a dimensionless metric representing how much of Earth's sustainable resource budget a product consumes over its lifetime.

---

## Alignment with the ERA Paper

### Paper's 5-Step ERA Method → Excel Implementation

| Step | ERA Method (Paper) | Excel Implementation |
|------|-------------------|---------------------|
| 1 | Selection of Earth System Boundaries | `ERP` sheet contains pre-calculated ERP values based on 11 boundary categories (CO₂, biodiversity, etc.) |
| 2 | Resource Segment Definition | `Materials and energy` sheet defines materials for each sleeper type with Share of Production (SoP) |
| 3 | Allocation of Safe Operating Space | ERP values in `ERP` sheet represent allocated budgets per material/energy |
| 4 | Environmental Impacts of Resource Production | Calculated via formulas in `RP_wood`, `RP_concrete`, `RP_SICUT` sheets |
| 5 | Upscaling (ERA Determination) | Resource pressure τ calculated as consumption relative to ERP budget |

---

## Workbook Structure

### Sheet 1: `Overview`
**Purpose**: Dashboard comparing all sleeper types and scenarios

**Key Outputs (pulled from calculation sheets)**:
- Resource pressure by component (materials, electricity, heat, transport)
- Total resource pressure per sleeper type/scenario
- Comparison across wood, concrete, and SICUT sleepers

**Scenarios Compared**:
- Wood: Base (25y), High sawing losses (25y), Optimized (25y)
- Concrete: Base (40y), Optimized (40y)  
- SICUT: Base/Optimized at 20y, 30y, 40y lifetimes

---

### Sheet 2: `Materials and energy`
**Purpose**: Central data repository - the "configuration database"

**Tables**:

#### `tbl_material` (A6:V20) - Material Properties
| Column | Purpose |
|--------|---------|
| material | Material name (cement, hardwood, PET, etc.) |
| sleeper type | Which sleeper uses this material |
| ERP identifier | Lookup key to ERP table |
| use | Category (bulk material, reinforcement, form, chemicals) |
| mass | Mass per sleeper (kg) |
| basic/green_primary material content | Fraction of virgin vs recycled input |
| manufacturing losses | Percentage lost in production |
| collection/recycling/cascading rates | End-of-life treatment rates (basic vs green scenarios) |
| electricity/heat required | Energy to manufacture/recycle (kWh/kg) |

#### `tbl_sleeper` (A24:F27) - Sleeper Characteristics
| Field | Concrete | Wood | SICUT |
|-------|----------|------|-------|
| lifetime [years] | 40 | 25 | 20 |
| installation transport [km] | 150 | 500 | 600 |
| railway gravel thickness [m] | 0.35 | 0.25 | - |

#### `tbl_electricity` (A31:D42) - Electricity Mix
Defines share of electricity sources for basic vs green scenarios:
- Coal, Oil, Gas, Nuclear
- Renewables: Wind (on/offshore), Geothermal, Wood, Hydro, PV (desert/roof)

#### `tbl_heat` (A46:D52) - Heat Mix
Heat sources: Gas, Propane, Oil, Wood, Solar, Heat pump

#### `tbl_transport` (A56:F61) - Transport Mix
Transport modes with basic/green shares for land and overseas:
- Freight train (diesel/electric)
- Lorry, Sea, Air

**Named Ranges**:
- `lifetime_wood`: 25 years
- `lifetime_concrete`: 40 years
- `lifetime_SICUT`: 20 years
- `heat_pump_factor`: 0.33

---

### Sheet 3: `ERP` (Ecological Resource Potential)
**Purpose**: Contains the ERA-calculated sustainable budgets for each material/energy

**Table: `tbl_ERP` (A4:H61)**

| Column | Description |
|--------|-------------|
| Identifier | Lookup key (e.g., "el, coal", "cement unspecified") |
| Process/product | Full ecoinvent process name |
| Unit | Functional unit (kWh, kg, tkm) |
| FU | Functional unit value (usually 1) |
| version | Data source (ecoinvent3_9) |
| category | electricity, heat, transport, Material |
| **ERP effective [FU/a]** | **Maximum sustainable production per year** |
| limiting boundary | Which Earth system boundary constrains this (CO₂, biophysical, biodiversity) |

**Sample ERP Values**:
| Material | ERP [units/year] | Limiting Boundary |
|----------|-----------------|-------------------|
| electricity, coal | 7.57×10¹¹ kWh/a | CO₂ |
| electricity, hydro | 3.67×10¹² kWh/a | biophysical |
| cement unspecified | 1.32×10¹² kg/a | CO₂ |
| hardwood | 3.00×10¹² kg/a | biophysical |
| low-alloyed steel | 4.34×10¹¹ kg/a | CO₂ |
| PET | 1.78×10¹¹ kg/a | CO₂ |

---

### Sheets 4-6: `RP_wood`, `RP_concrete`, `RP_SICUT`
**Purpose**: Calculate Resource Pressure (τ) for each sleeper type

**Structure** (identical pattern across all three):

#### Scenario Configuration (Rows 3-8)
- Selects which data variant to use (basic vs green for materials, energy, transport)
- References `tbl_material` columns for primary material content, recycling rates, etc.

#### Component Calculations
Each component (materials, energy, transport) follows this pattern:

**1. Material Block (bulk material, form, reinforcement, chemicals)**
```
Row: Material name + ERP identifier
Row: ERP value (from tbl_ERP lookup)
Row: Primary material content
Row: Secondary material content (= 1 - primary)
Row: Mass per sleeper
Row: Manufacturing losses (%)
Row: Mass required (= mass × (1 + losses))
Row: Collection rate (manufacturing losses)
Row: Recycling rate
Row: Cascading rate
Row: Loss rate (= 1 - collection + collection × (1 - recycling - cascading))
Row: Recyclability (overall)
Row: Cascadability (overall)
Row: Final loss (= 1 - recyclability - cascadability)
Row: τ (resource pressure for this material)
```

**2. Electricity Block**
- Lists all electricity sources with ERP values
- Share column shows mix percentage (from tbl_electricity)
- Calculates electricity required for manufacturing + heat pumps + recycling
- τ = weighted sum of (electricity/ERP) across all sources

**3. Heat Block**
- Similar structure to electricity
- Accounts for heat pump conversion from electricity

**4. Transport Block (Land + Overseas)**
- Transport modes with ERP values and shares
- Calculates tkm for manufacturing, installation, disposal transport

---

## Key Formulas and Calculations

### Core Resource Pressure Formula (τ)

For materials:
```
τ = (0.5 × mass / ERP) × (1 + manufacturing_losses) × (1/lifetime) × (primary_content + loss_rate)
```

For electricity:
```
τ = (electricity_required / lifetime) × Σ(share_i / ERP_i)
```

For heat:
```
τ = (heat_required / lifetime) × Σ(share_i / SUM(shares) / ERP_i)
```

For transport:
```
τ = (tkm / lifetime) × Σ(share_i / ERP_i)
```

### Total Resource Pressure
```
τ_total = τ_bulk_material_1 + τ_bulk_material_2 + τ_reinforcement + τ_form + 
          τ_chemicals + τ_electricity + τ_heat + τ_transport_land + τ_transport_overseas
```

### Key Relationships

1. **Lifetime Impact**: τ ∝ 1/lifetime → Longer-lasting sleepers have lower resource pressure

2. **Recycling Benefit**: Higher recycling/cascading rates reduce the loss_rate term

3. **Green Energy**: Using renewable electricity reduces the weighted ERP denominator

4. **Material Selection**: Lower-impact materials (higher ERP values) reduce τ

---

## Calculated Results (Current Outputs)

### Resource Pressure Values (τ)

| Sleeper Type | Scenario | τ (dimensionless) |
|--------------|----------|-------------------|
| **Wood** | Basic (25y) | 6.86×10⁻¹² |
| | High losses (25y) | 7.09×10⁻¹² |
| | Green (25y) | 6.45×10⁻¹² |
| **Concrete** | Basic (40y) | 5.02×10⁻¹² |
| | Green (40y) | 4.21×10⁻¹² |
| **SICUT** | Basic (20y) | 1.45×10⁻¹¹ |
| | Green (20y) | 4.10×10⁻¹² |
| | Green (30y) | 2.73×10⁻¹² |
| | Green (40y) | 2.05×10⁻¹² |
| | Basic (40y) | 7.24×10⁻¹² |

**Interpretation**: Lower τ = more sustainable. Concrete sleepers (40y lifetime) and optimized SICUT (40y) show lowest resource pressure.

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Materials and energy                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │tbl_material │ │tbl_sleeper  │ │tbl_electricity│ │tbl_heat  │ │
│  │tbl_transport│ │Named Ranges │ │             │ │           │ │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └─────┬─────┘ │
└─────────┼───────────────┼───────────────┼──────────────┼───────┘
          │               │               │              │
          ▼               ▼               ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ERP Sheet                               │
│               ┌─────────────────────────┐                       │
│               │       tbl_ERP           │                       │
│               │  (ERA budgets per       │                       │
│               │   material/energy)      │                       │
│               └───────────┬─────────────┘                       │
└───────────────────────────┼─────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   RP_wood    │   │ RP_concrete  │   │  RP_SICUT    │
│              │   │              │   │              │
│ Scenarios:   │   │ Scenarios:   │   │ Scenarios:   │
│ wo_01-wo_06  │   │ co_01-co_05  │   │ si_01-si_05  │
│              │   │              │   │              │
│ τ = Σ(τi)    │   │ τ = Σ(τi)    │   │ τ = Σ(τi)    │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          ▼
               ┌──────────────────┐
               │    Overview      │
               │                  │
               │ Comparison of    │
               │ all sleeper      │
               │ types/scenarios  │
               └──────────────────┘
```

---

## Terminology Glossary

| Term | German | Definition |
|------|--------|------------|
| ERA | Ökologische Ressourcenverfügbarkeit | Ecological Resource Availability - sustainable annual production |
| ERP | Ökologisches Ressourcenpotenzial | Ecological Resource Potential - same as ERA |
| τ (tau) | Ressourcendruck | Resource Pressure - fraction of sustainable budget used |
| Schwelle | Sleeper | Railway sleeper/tie |
| Holzschwelle | Wood sleeper | Made from hardwood (beech/oak) |
| Betonschwelle | Concrete sleeper | Made from cement, gravel, steel reinforcement |
| SICUT | - | Synthetic sleeper from PET + glass fiber |
| Nutzung | Use/Lifetime | Service life in years |
| Sägeverluste | Sawing losses | Manufacturing waste |
| Kaskadierung | Cascading | Reuse in lower-value applications |
| Besohlung | Sole | PUR foam base on concrete sleepers |
| Rippenplatte | Ribbed plate | Steel mounting plate on wood sleepers |
| Teeröl/Carbolineum | Creosote | Wood preservative chemical |

---

## Web App Architecture Recommendations

### Core Entities/Models

1. **Material**
   - Properties: name, sleeperType, erpIdentifier, use, mass
   - Primary/secondary content, manufacturing losses
   - Collection/recycling/cascading rates (basic/green)
   - Electricity/heat requirements

2. **EnergySource**
   - Type: electricity or heat
   - ERPValue, limitingBoundary
   - Mix percentages for basic/green scenarios

3. **TransportMode**
   - ERPValue, mix percentages (land/overseas, basic/green)

4. **SleeperType**
   - Name, lifetime, transport distances
   - Materials used (foreign keys)

5. **Scenario**
   - SleeperType, name, description
   - Configuration flags (basic/green for materials, energy, transport)

6. **Calculation Result**
   - Scenario reference
   - Component τ values (materials, electricity, heat, transport)
   - Total τ

### Key Features to Implement

1. **Data Management**
   - CRUD for materials, energy sources, transport modes
   - ERP value management with limiting boundary tracking
   - Sleeper type configuration

2. **Scenario Builder**
   - Select sleeper type
   - Choose basic/green variants for each component
   - Adjust lifetime, transport distances
   - Override individual material parameters

3. **Calculation Engine**
   - Implement all formulas from calculation sheets
   - Real-time τ calculation
   - Breakdown by component

4. **Visualization**
   - Compare scenarios side-by-side
   - Stacked bar charts showing τ breakdown
   - Sensitivity analysis (what-if scenarios)

5. **Reporting**
   - Export results to PDF/Excel
   - Detailed methodology documentation
   - Source citations for ERP values

### Suggested Tech Stack (aligned with your preferences)

- **Backend**: Node.js + Fastify
- **Database**: PostgreSQL via Supabase
- **Frontend**: React + Vite
- **Charts**: Recharts or D3.js
- **State Management**: React Query for API state

---

## Next Steps

1. **Schema Design**: Convert tables to normalized relational schema
2. **API Design**: RESTful endpoints for CRUD + calculation
3. **Formula Validation**: Unit tests for all calculation functions
4. **UI Wireframes**: Based on Overview sheet layout
5. **Data Migration**: Import existing Excel data

Would you like me to proceed with any of these next steps?
