# Eco-Presto Design Examples

Side-by-side comparisons. Left is what AI tends to generate. Right is what belongs in Eco-Presto (RPC).

---

## Component Naming

| Slop | Eco-Presto (from TRD) |
|------|----------------------|
| `<Dashboard />` | `<Calculator />` (the single page in Phase 1) |
| `<Tabs />` | `<VariantTabs />` |
| `<Sidebar />` | `<SectionNav />` |
| `<Form />` | `<ComponentForm />` or `<ManufacturingForm />` |
| `<Chart />` | `<ResultsChart />` |
| `<Diagram />` | `<SankeyDiagram />` |
| `<Slider />` | `<SliderInput />` or `<ThreeSegmentSlider />` |
| `<Card />` | `<TauDisplay />` |
| `<Modal />` | `<VariantRenameDialog />` |
| `<Layout />` | `<MainLayout />` |

---

## Variable and Function Naming

**Slop:**
```typescript
const data = await loadData();
const result = calculate(input);
const items = state.list.map(r => ({ ...r, value: r.val }));

function processItems(list) { ... }
function handleClick() { ... }
function updateState(newData) { ... }
```

**Eco-Presto:**
```typescript
const erpEntries = loadErpDatabase();
const tauResult = calculateVariantTau(variant, erpDb);
const mixShares = electricityMix.sources.map(s => ({
  erpId: s.erpId,
  share: s.share,
}));

function calculateMaterialTau(component, lifetime, erpDb) { ... }
function selectLossTreatment(component) { ... }
function formatTauValue(tau: number): string { ... }
```

---

## UI Copy (German-First)

### Section Headers

| Slop | Eco-Presto |
|------|------------|
| "Product Details" | "Produktinfo" |
| "Component Settings" | "Komponente 1: Zement" |
| "Energy Configuration" | "Herstellung" |
| "Results" | "Gesamtresultat / Variantenvergleich" |

### Page Titles

| Slop | Eco-Presto |
|------|------------|
| "Welcome to the Calculator" | "Bahnschwellen — Ressourcendruck" |
| "Results Overview" | "Ressourcendruck — 3 Varianten" |
| "Dashboard" | "SOB Bahnschwellen" |

### Empty States

| Slop | Eco-Presto |
|------|------------|
| "No data available" | "Keine Varianten konfiguriert. Erstellen Sie eine Variante mit [+]." |
| "Nothing to show yet" | "Keine Komponenten definiert. Setzen Sie die Anzahl Komponenten in Produktinfo." |
| "Get started!" | "Wählen Sie eine Sektion links, um die Variante zu konfigurieren." |

### Tooltips

| Slop | Eco-Presto |
|------|------------|
| "Click to view" | "τ = (m/ERP) × (1+λ) × (1/L) × Korrekturfaktor" |
| "Your score" | "Anteil am nachhaltigen jährlichen Ressourcenbudget der Erde" |
| "Info" | "Die Lebensdauer beeinflusst den Ressourcendruck proportional. Längere Lebensdauer = niedrigerer τ" |

### Form Labels

| Slop | Eco-Presto |
|------|------------|
| "Enter mass" | "Masse" + `[170] kg` |
| "Set the primary material %" | "Primärmaterialanteil" + slider 0%–100% |
| "Input lifetime" | "Lebensdauer" + `[40] Jahre` |
| "Select energy source" | "Energiequelle" + `[CH Grid Basic ▾]` |

### Button Labels

| Slop | Eco-Presto |
|------|------------|
| "Submit" | (no submit — auto-save on blur) |
| "Add New" | `[+]` tab to add variant |
| "Delete" | (double-click tab → rename; right-click → delete) |
| "Export" | "PDF Export" |

### Error Messages

| Slop | Eco-Presto |
|------|------------|
| "Something went wrong" | "ERP-Eintrag 'cement_unspecified' nicht in Referenzdaten gefunden" |
| "Invalid input" | "Produktionsverluste müssen zwischen 0% und 100% liegen (aktuell: 150%)" |
| "Please check your data" | "Transportanteile summieren sich auf 85% — muss 100% ergeben. Fehlend: 15%." |

---

## Layout Patterns

### The Main Calculator View

**Slop — single column with stacked sections:**
```
┌─────────────────────────────┐
│ Header                      │
├─────────────────────────────┤
│ Product Form                │
│ ...all fields...            │
├─────────────────────────────┤
│ Results Chart               │
└─────────────────────────────┘
```

**Eco-Presto — three-panel from mockups:**
```
┌──────┬────────────────────────────┬──────────────────┐
│      │ [V1-Beton] [Variante 2] [+]                  │
├──────┼────────────────────────────┼──────────────────┤
│      │                            │    V1-Beton      │
│○ Pro │  Produktinfo               │ ┌──────────────┐ │
│      │  ────────────              │ │  [SANKEY      │ │
│○ K1  │  Produktname  [Bahnschwel] │ │   DIAGRAM]   │ │
│      │  Kategorie    [Infrastru ] │ │              │ │
│○ Her │  Variante     [Beton     ] │ └──────────────┘ │
│      │  Gewicht      [295   ] kg  │                  │
│○ Nut │  Komponenten  [4  ↕]      │ Variantenvergl.  │
│      │                            │ ┌──────────────┐ │
│○ NE  │  ┌────────────────────┐    │ │ ████ 5.02e-12│ │
│      │  │  [PRODUCT IMAGE]   │    │ │ ▓▓▓▓         │ │
│      │  └────────────────────┘    │ │  V1  V2  V3  │ │
│      │                            │ └──────────────┘ │
└──────┴────────────────────────────┴──────────────────┘
```

### Variant Comparison

**Slop — cards with qualitative labels:**
```
┌───────────────────┐  ┌───────────────────┐
│ ★ V1-Beton        │  │ ★ V2-Holz         │
│ Score: Good       │  │ Score: Fair        │
│ [View Details →]  │  │ [View Details →]   │
└───────────────────┘  └───────────────────┘
```

**Eco-Presto — stacked bar chart with numeric breakdown:**
```
Ressourcendruck [×10⁻¹²]

V1-Beton    [████████▓▓░░▒▒] 5.02
V2-Holz     [██████████▓░▒▒] 6.86
V3-SICUT    [████▓░▒]        2.05

████ Material  ▓▓ Wärme  ░░ Strom  ▒▒ Transport
```

### Component Form (Komponente)

**Slop — flat input list:**
```
Material: [________]
Mass: [________]
Rate 1: [________]
Rate 2: [________]
Transport: [________]
```

**Eco-Presto — structured with domain sections:**
```
Komponente 1: [Schwelle                    ] 🏭

[−] Material 1:
┌──────────────────────────────────────────────────┐
│  Materialart            [Zement              ▾]  │
│  Masse                  [170          ] kg       │
│                                                  │
│  Primärmaterialanteil                            │
│  0% ═══════════════════════════● 100%            │
│                                 [100] %          │
│                                                  │
│  Produktionsverluste                             │
│  0% ════●══════════════════════ 100%             │
│                                 [10 ] %          │
│                                                  │
│  Behandlung Produktionsverluste                  │
│  ┌────────────────┬────────────────┬──────────┐  │
│  │ Rec. ohne Q.v. │ Rec. mit Q.v.  │ Verluste │  │
│  │     0%         │     90%        │   10%    │  │
│  └────────────────┴────────────────┴──────────┘  │
│  [●═══════════════════════════════════════════●]  │
│                                                  │
│  Transportweg               [0         ] km      │
│  Transportart & Anteil                           │
│  [Fracht, Zug, Diesel   ▾] [20] %               │
│  [Fracht, Zug, Elektro  ▾] [80] %               │
└──────────────────────────────────────────────────┘

[+] Material 2:
```

---

## Chart Design

**Slop:**
- 3D bar chart with gradient fills and drop shadows
- Legend: "Series 1", "Series 2"
- Y-axis: "Value"
- Title: "Results Chart"
- Colors: random rainbow

**Eco-Presto:**
- Flat stacked bars, one per variant
- Segments: Material (#4B5563), Wärme (#FB923C), Strom (#FDE047), Transport (#A855F7)
- Y-axis: variant names ("V1-Beton", "V2-Holz")
- X-axis: "τ [×10⁻¹²]" with scientific notation tick marks
- Title: "Ressourcendruck — Bahnschwellen"
- Tooltip: "Zement: τ = 2.14 × 10⁻¹² (43% Anteil)"

---

## Data File Naming

| Slop | Eco-Presto (from TRD) |
|------|----------------------|
| `data/index.ts` | `data/erpDatabase.ts` |
| `data/config.ts` | `data/energyMixes.ts` |
| `data/presets.ts` | `data/sleeperPresets.ts` |
| `utils/helpers.ts` | `utils/calculate.ts` |
| `utils/format.ts` | `utils/formatters.ts` |
| `utils/validate.ts` | `utils/validators.ts` |
| `hooks/useData.ts` | `hooks/useVariants.ts` |
| `hooks/useCalc.ts` | `hooks/useCalculation.ts` |

---

## Type Naming

| Slop | Eco-Presto (from TRD) |
|------|----------------------|
| `interface FormState` | `interface Variant` |
| `interface Item` | `interface Component` |
| `interface Config` | `interface LossTreatment` |
| `interface Result` | `interface CalculationResult` |
| `interface TauResult` | `interface TauBreakdown` |
| `interface Ref` | `interface ERPEntry` |
| `interface Mix` | `interface EnergyMix` |
| `interface Source` | `interface EnergySource` |

---

## Variant Tab States

| State | Appearance |
|-------|-----------|
| Normal | White background, black border: `[Variante 2]` |
| Active | Amber background (#F59E0B): `[V1-Beton]` |
| Hover | Light gray background |
| Add | Border only, same height: `[+]` |

## Section Nav States

| State | Appearance |
|-------|-----------|
| Normal | Empty circle, gray text: `○ Produktinfo` |
| Active | Filled circle, black text, yellow left border: `● Komponente 1` |
| Hover | Gray background |
