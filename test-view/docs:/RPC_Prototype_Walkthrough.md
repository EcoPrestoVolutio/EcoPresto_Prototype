# Resource Pressure Calculator
## Prototype Walkthrough & UX Flow

**Client:** SOB (Schweizerische Südostbahn)  
**Date:** March 2025  
**Purpose:** UI Prototype Demonstration

---

## Overview

The Resource Pressure Calculator transforms the Excel-based ERA methodology into an intuitive web application for comparing the environmental sustainability of railway sleepers.

**Key Principle:** Configure once, compare instantly.

---

## Screen Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [V1-Beton] [Variante 2] [+]                    Variant Tabs    │
├────────┬────────────────────────────────┬───────────────────────┤
│        │                                │                       │
│  Left  │      Center Form Area          │   Right Visuals       │
│  Nav   │      (Data Entry)              │   (Live Feedback)     │
│        │                                │                       │
└────────┴────────────────────────────────┴───────────────────────┘
```

**Three-Panel Design:**
- **Left:** Section navigation (click to switch)
- **Center:** Form inputs for current section
- **Right:** Real-time Sankey diagram + comparison chart

---

## UX Flow

```
    ┌─────────────┐
    │   START     │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐     User sees pre-configured
    │ Produktinfo │ ◄── sleeper variant (V1-Beton)
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐     Configure materials:
    │ Komponente  │ ◄── mass, primary %, losses,
    └──────┬──────┘     recycling rates, transport
           │
           ▼
    ┌─────────────┐     Set electricity &
    │ Herstellung │ ◄── heat consumption
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐     Define product
    │   Nutzung   │ ◄── lifetime (years)
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐     Configure end-of-life
    │Nutzungsende │ ◄── recycling scenarios
    └──────┬──────┘
           │
           ├──────────────────┐
           │                  │
           ▼                  ▼
    ┌─────────────┐    ┌─────────────┐
    │  View τ     │    │ Add Variant │
    │  Result     │    │    [+]      │
    └─────────────┘    └──────┬──────┘
                              │
                              ▼
                       Repeat for V2, V3...
                              │
                              ▼
                    ┌─────────────────┐
                    │ Compare Results │
                    │  (Bar Chart)    │
                    └─────────────────┘
```

---

## Screen-by-Screen Explanation

### 1. Produktinfo (Product Information)

**Purpose:** Define basic product properties

| Field | Description |
|-------|-------------|
| Produktname | Product name (e.g., "Bahnschwellen") |
| Produktkategorie | Category dropdown |
| Variantenname | Variant identifier (highlighted yellow) |
| Gewicht in kg | Total weight |
| Anzahl Komponente | Number of components (adds nav items) |

**Visual:** Product image placeholder for context

---

### 2. Komponente (Component Configuration)

**Purpose:** Define materials and their properties

This is the **core data entry screen** with expandable material panels.

**For each material:**

| Field | Input Type | Description |
|-------|------------|-------------|
| Materialart | Dropdown | Select from ERP database |
| Masse | Number + kg | Material mass |
| Primärmaterialanteil | Slider 0-100% | Virgin vs recycled content |
| Produktionsverluste | Slider 0-100% | Manufacturing waste |
| Behandlung | 3-way slider | Recycling treatment split |
| Transportweg | Number + km | Distance to factory |
| Transportart | Dropdown + % | Mode split (train/lorry) |

**Key Interaction:** The three-segment slider for recycling treatment:
```
[■■■■ Blue ■■■■|■■■ Yellow ■■■|■ Red ■]
   Recycling      Recycling     Losses
   ohne Qual.     mit Qual.
     30%            50%          20%
```

---

### 3. Herstellung (Manufacturing)

**Purpose:** Define energy consumption for production

**Two sections:**

| Section | Fields |
|---------|--------|
| Stromverbrauch | kWh consumption + energy source |
| Wärmeverbrauch | kWh consumption + heat source |

Energy sources include basic grid mix and green alternatives.

---

### 4. Nutzung (Use Phase)

**Purpose:** Define product lifetime

| Field | Impact |
|-------|--------|
| Lebensdauer (Jahre) | Directly affects τ calculation |

**Key Message:** Longer lifetime = Lower τ (more sustainable)

This is intentionally simple — lifetime is one of the most impactful variables.

---

### 5. Nutzungsende (End of Life)

**Purpose:** Define disposal and recycling scenarios

**Sections:**
1. **Ausbau** — Energy for dismantling
2. **Transport zu Abnehmer** — Distance to recycling facility
3. **Produktnutzungsende** — Recycling scenario selection
4. **Material Recycling Rates** — Per-material recycling splits

---

## Right Panel: Live Visualizations

### Sankey Diagram (Top)

Shows material flow through the product lifecycle:

```
Primary Material ──► PRODUCT ──► Final Loss
        │               │
        │               └──► Recycled ──┐
        │                               │
        └──────────────────────────────◄┘
                    ↓
              Cascaded to lower quality
```

**Updates in real-time** as user modifies inputs.

### Comparison Chart (Bottom)

Stacked bar chart showing:
- τ values for all configured variants
- Breakdown by category (materials, energy, transport)
- Numerical τ values below each bar

**Purpose:** Instant visual comparison — "which variant wins?"

---

## Key Interactions

| Action | Result |
|--------|--------|
| Click variant tab | Switch to that variant's data |
| Click [+] tab | Add new variant (copy of default) |
| Click section nav | Switch form content |
| Drag slider | Update value + recalculate τ |
| Expand/collapse material | Show/hide detailed inputs |
| Add material button | Insert new material panel |

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Form-based layout | Matches existing Excel workflow |
| Left navigation | Clear section progress indicator |
| Always-visible charts | Immediate feedback on changes |
| Yellow highlights | Draw attention to key fields |
| Collapsible materials | Manage complexity for multi-material products |
| German labels | Primary user language |

---

## What's NOT in the Prototype

| Feature | Status |
|---------|--------|
| Backend/database | Frontend only — data resets on refresh |
| User authentication | Not implemented |
| PDF export | Planned for next phase |
| Custom materials | Uses pre-defined ERP database |
| Mobile responsive | Desktop-first design |

---

## Next Steps

1. **Client feedback** on UX flow and layout
2. **Validation** of calculation accuracy vs Excel
3. **Additional variants** (Holz, SICUT presets)
4. **Export functionality** (PDF reports)
5. **Backend integration** for data persistence

---

## Questions for Discussion

1. Is the section navigation intuitive?
2. Should we add tooltips/help text for complex fields?
3. How many variants should users be able to compare?
4. Should the Sankey diagram be interactive?
5. What export formats are needed?

---

*Prototype built with React + Tailwind CSS + Recharts*
