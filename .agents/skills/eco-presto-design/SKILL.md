---
name: eco-presto-design
description: Enforces domain-accurate, slop-free UI design and code patterns for the Eco-Presto resource pressure calculator (RPC). Use when building components, writing copy, naming variables, designing layouts, or structuring data for the RPC web application. Prevents generic AI output by grounding all decisions in the ERA/ERP scientific domain, SOB client context, and the German-first UI language.
---

# Eco-Presto (RPC) Design Standards

The Resource Pressure Calculator is a scientific instrument for SOB (Schweizerische Südostbahn). Every pixel, variable name, and label must serve the task of configuring, calculating, or comparing resource pressure (τ). Users are infrastructure planners, procurement managers, and sustainability analysts — not general consumers.

## Phase Awareness

Phase 1 is **frontend-only** — React + Vite + TypeScript, no backend, no API. Data lives in static files and local state. API design rules apply from Phase 2 onward.

## Domain Vocabulary

Use ERA methodology terms exactly. Never substitute generic alternatives.

| Correct | Never Use |
|---------|-----------|
| Resource Pressure (τ) / Ressourcendruck | Impact score, sustainability rating, eco-score |
| Variant / Variante | Configuration, setup, preset |
| ERP (Ecological Resource Potential) | Budget, capacity, limit, threshold |
| Limiting boundary | Bottleneck, constraint, risk factor |
| Component / Komponente | Part, item, element, block |
| Primary material content / Primärmaterialanteil | Virgin ratio, raw fraction |
| Production losses / Produktionsverluste | Waste rate, scrap rate, inefficiency |
| Recyclability (R) | Recycling score, circularity index |
| Cascadability (C) | Downcycling rate, secondary use rate |
| Manufacturing losses (λ) | Lambda, waste factor |
| Mix profile / Energiequelle | Energy plan, source distribution |
| Bill of materials | Parts list, ingredients, composition |
| Functional unit | Per-unit basis, reference unit |

**"Variant" is the Phase 1 comparison unit.** A Product has up to 5 Variants. Each Variant is a complete configuration (components, manufacturing, use phase, end-of-life). "Scenario" from the earlier architecture docs maps to "Variant" in the frontend.

### Greek Symbols

Render τ, λ, Σ as Unicode in UI. In code identifiers use spelled-out forms: `tauTotal`, `manufacturingLosses`.

### Scientific Notation

Display τ/ERP values as `4.21 × 10⁻¹²` with proper superscripts. Never raw floats (`0.00000000000421`) or `e-notation` (`4.21e-12`) in user-facing UI.

## German-First UI Language

German is the primary interface language. English is secondary. Use these section labels exactly:

| German (UI) | English (code/comments) |
|-------------|------------------------|
| Produktinfo | Product Info |
| Komponente 1, 2, ... | Component 1, 2, ... |
| Herstellung | Manufacturing |
| Nutzung | Use Phase |
| Nutzungsende | End of Life |
| Ressourcendruck | Resource Pressure |
| Variantenvergleich | Variant Comparison |
| Gesamtresultat | Total Result |
| Primärmaterialanteil | Primary Material Content |
| Produktionsverluste | Production Losses |
| Recycling ohne Qualitätsverlust | Recycling without quality loss |
| Recycling mit Qualitätsverlust | Recycling with quality loss |
| Verluste | Losses / Disposal |
| Lebensdauer | Lifetime |
| Stromverbrauch | Electricity Consumption |
| Wärmeverbrauch | Heat Consumption |
| Ausbau | Dismantling |

Code identifiers and comments stay in English. UI strings use German by default.

## UI Rules

### Layout: Three-Panel Structure

The app uses a fixed three-panel layout from the client mockups:

```
┌──────┬────────────────────────────┬──────────────────┐
│120px │         ~800px             │     ~400px       │
│      │                            │                  │
│ Nav  │      Main Content          │  Visualizations  │
│      │      (forms)               │  (Sankey +       │
│      │                            │   Results chart) │
└──────┴────────────────────────────┴──────────────────┘
Min width: 1200px. Variant tabs span the full top.
```

- **Left nav**: Section navigation (Produktinfo, Komponente 1, ..., Herstellung, Nutzung, Nutzungsende). Vertical, compact.
- **Center**: Active section form. One section visible at a time.
- **Right**: Sankey mass flow diagram (top) + stacked bar comparison chart (bottom). Always visible, updates in real-time.

### Color Palette

| Purpose | Hex | Usage |
|---------|-----|-------|
| Primary (active tab, highlights) | `#F59E0B` | Amber/Gold |
| App chrome | `#1F1F1F` | Dark gray background |
| Content background | `#FFFFFF` | Form areas |
| Section headers | `#F5F5F5` | Light gray |
| Validation error | `#EF4444` | Red |
| Success/best result | `#22C55E` | Green |

**Chart segment colors:**

| Category | Hex |
|----------|-----|
| Materials | `#4B5563` (gray), `#9CA3AF` (light gray) |
| Electricity | `#FDE047` (yellow) |
| Heat | `#FB923C` (orange) |
| Transport | `#A855F7` (purple) |

### Visual Hierarchy

- **Numbers are the content.** τ values get bold monospace treatment. Labels are secondary.
- **Tabular numerals** for any column of numbers so decimal points align.
- **Color is semantic only.** Chart segments, validation state, limiting boundary indicators. Never decorative.

### Charts

- **Stacked bar charts** for τ breakdown (materials, electricity, heat, transport).
- **Axis labels include units.** `τ (dimensionless)`, `Mass (kg)`, `ERP (kg/a)`.
- **No 3D, no pie charts, no gradients on bars.** Flat, clean.
- **Tooltips show full precision:** `Zement: τ = 2.14 × 10⁻¹²`

### The Three-Segment Slider

Core interaction pattern for recycling rate configuration. Two draggable handles divide a bar into three segments:

```
[Rec. ohne Qual.verl. | Rec. mit Qual.verl. |  Verluste  ]
[       0%            |       90%           |    10%     ]
 ← left handle                    right handle →
```

- Left handle controls "Recycling without quality loss" boundary
- Right handle controls "Recycling with quality loss" boundary
- Remainder = Disposal (calculated, not input)
- Values always sum to 100%. Enforce this in the component.

### Forms and Inputs

- **Units inline** with every numeric input: `kg`, `kWh`, `km`, `Jahre` (years), `%`.
- **Validate immediately**: transport mode shares must sum to 100%; rates are 0–100%; mass is positive; lifetime > 0.
- **Group by section**, matching the left nav: each section is its own form area, not one giant form.
- **Auto-save on blur.** No "Submit" button per section.

### Copy and Microcopy

- **Labels describe the data.** Use `Lebensdauer (Jahre)` not `Geben Sie die Lebensdauer ein`.
- **Tooltips explain the science.** "Die Lebensdauer beeinflusst den Ressourcendruck proportional. Längere Lebensdauer = niedrigerer τ"
- **No filler adjectives.** Not "leistungsstarker Rechner", not "umfassende Übersicht".
- **Error messages cite the constraint.** "Transportanteile summieren sich auf 120% — muss 100% ergeben."

## Code Patterns

### Component Naming (from TRD)

Use the names from the TRD. These are the canonical component names:

```typescript
// Layout
<VariantTabs />       // Top tab bar for switching variants
<SectionNav />        // Left vertical navigation
<MainLayout />        // Three-panel shell

// Forms
<ProductInfoForm />   // Produktinfo section
<ComponentForm />     // Komponente section (per component)
<ManufacturingForm /> // Herstellung section
<UsePhaseForm />      // Nutzung section
<EndOfLifeForm />     // Nutzungsende section
<SliderInput />       // Single slider with label + value input
<ThreeSegmentSlider /> // Recycling rate slider

// Visualization
<SankeyDiagram />     // Mass flow diagram
<ResultsChart />      // Stacked bar comparison
<TauDisplay />        // Formatted τ value
<BreakdownLegend />   // Chart legend
```

Never rename these to generic alternatives (`<Form />`, `<Chart />`, `<Sidebar />`).

### File Structure (from TRD)

```
src/
├── types/          (variant.ts, component.ts, erp.ts)
├── data/           (erpDatabase.ts, energyMixes.ts, sleeperPresets.ts)
├── utils/          (calculate.ts, formatters.ts, validators.ts)
├── hooks/          (useVariants.ts, useCalculation.ts, useDebounce.ts)
├── components/
│   ├── layout/     (VariantTabs, SectionNav, MainLayout)
│   ├── forms/      (ProductInfoForm, ComponentForm, SliderInput, ...)
│   ├── visualization/ (SankeyDiagram, ResultsChart, TauDisplay)
│   └── common/     (Button, Tooltip, Badge)
└── pages/          (Calculator.tsx)
```

### Function Naming

```typescript
// Domain-grounded
function calculateVariantTau(variant, erpDb)
function calculateMaterialTau(component, lifetime, erpDb)
function calculateEnergyTau(energyInput, lifetime, erpDb)
function calculateTotalTransportTau(variant, erpDb)

// Slop
function processData(input)
function calculateResult(params)
function handleSubmit(formData)
```

### Data Structures

Types reflect domain entities from the TRD:

```typescript
interface Variant { ... }           // Not: interface FormState
interface Component { ... }         // Not: interface Item
interface LossTreatment { ... }     // Not: interface Config
interface CalculationResult { ... } // Not: interface Response
interface ERPEntry { ... }          // Not: interface ReferenceData
```

### Calculation Code

- Each formula component (material τ, electricity τ, heat τ, transport τ) is a pure function.
- Intermediate values (recyclability R, cascadability C) computed in named steps.
- Unit tests compare against known Excel outputs from the SOB workbook.
- Reference the source: `// Per Desing et al. (2020), Eq. 3`

### API Design (Phase 2+)

- Endpoints reflect domain operations: `/variants/:id/calculate`, `/products/:id/components`.
- Return τ as numbers, not pre-formatted strings. Formatting is a UI concern.
- No wrapper objects with `status`/`message`. HTTP codes handle that.

## Anti-Slop Checklist

- [ ] No generic names (`data`, `item`, `result`, `config`, `info`, `handle`, `process`)
- [ ] No decorative UI elements (gradients, shadows, rounded cards that serve no grouping purpose)
- [ ] No English placeholder copy when German is needed ("Welcome!", "Get started!")
- [ ] No units missing from numeric displays
- [ ] No raw floats shown to users (scientific notation for τ/ERP values)
- [ ] No color used without semantic meaning
- [ ] No tooltip that explains UI mechanics instead of domain concepts
- [ ] No component that wraps a single `<div>` with a generic name
- [ ] No empty states that just say "Keine Daten" — say what's missing
- [ ] No "Submit" buttons — forms auto-save on blur
- [ ] No transport/mix shares that don't validate to 100%

## Additional Resources

- For concrete good/bad comparisons, see [examples.md](examples.md)
