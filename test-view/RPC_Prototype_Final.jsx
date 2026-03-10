import React, { useState, useMemo, useCallback, createContext, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Plus, X, RefreshCw, Maximize2, Factory, Globe } from 'lucide-react';

// =============================================================================
// I18N
// =============================================================================

const LangContext = createContext('de');
const useLang = () => useContext(LangContext);

const translations = {
  de: {
    // Materials
    mat_cement: 'Zement',
    mat_gravel: 'Gestein',
    mat_steel: 'Stahl',
    mat_hardwood: 'Hartholz',
    mat_carbolineum: 'Carbolineum',
    mat_pet: 'PET',
    mat_glass_fibre: 'Glasfaser',
    mat_pur: 'PUR-Schaum',

    // Transport
    trans_train_diesel: 'Fracht, Zug, Diesel',
    trans_train_electric: 'Fracht, Zug, Elektro',
    trans_lorry: 'LKW',
    trans_sea: 'Schiff',

    // Energy
    energy_ch_basic: 'CH Netz (Basic)',
    energy_ch_green: 'CH Netz (Green)',
    energy_solar: 'Solar',

    // Heat
    heat_gas: 'Erdgas',
    heat_wood: 'Holz',
    heat_solar: 'Solar',

    // Product categories
    cat_infrastructure: 'Infrastruktur',
    cat_building: 'Baumaterial',
    cat_transport: 'Transport',
    cat_energy: 'Energie',

    // Calculation breakdown
    calc_electricity: 'Strom',
    calc_heat: 'Wärme',
    calc_transport: 'Transport',

    // ThreeWaySlider
    rec_no_loss: 'Rec. ohne',
    rec_no_loss_sub: 'Qualitätsverlust',
    rec_with_loss: 'Rec. mit',
    rec_with_loss_sub: 'Qualitätsverlust',
    rec_disposal: 'Verluste',

    // MaterialPanel
    material_select: '(auswählen)',
    material_type: 'Materialart',
    material_mass: 'Masse',
    material_primary: 'Primärmaterialanteil',
    material_production_loss: 'Produktionsverluste im Verhältnis zur Masse in der Komponente',
    material_loss_treatment: 'Behandlung Produktionsverluste',
    material_avg_transport: 'Durchschn. Transportweg',
    material_transport_type: 'Transportart & Anteil',

    // ResultsChart
    results_title: 'Gesamtresultat / Variantenvergleich',
    results_pressure: 'Ressourcendruck',

    // ProduktinfoSection
    product_name: 'Produktname',
    product_category: 'Produktkategorie',
    variant_name_label: 'Variantenname',
    product_weight: 'Gewicht in kg',
    component_count: 'Anzahl Komponente',

    // KomponenteSection
    component_name: 'Komponentenname:',

    // HerstellungSection
    electricity_consumption: 'Stromverbrauch',
    energy_per_unit: 'Energieaufwand pro Einheit',
    energy_source: 'Energiequelle',
    heat_consumption: 'Wärmeverbrauch',
    heat_source: 'Wärmequelle',

    // NutzungSection
    use_phase: 'Nutzungsphase',
    lifetime: 'Lebensdauer',
    years: 'Jahre',
    lifetime_info: 'Die Lebensdauer beeinflusst den Ressourcendruck proportional.',
    lifetime_info2: 'Längere Lebensdauer = niedrigerer τ',

    // NutzungsendeSection
    dismantling: 'Ausbau',
    resource_demand: 'Ressourcenbedarf',
    transport_to_buyer: 'Transport zu Abnehmer',
    transport_type: 'Transportart',
    product_eol: 'Produktnutzungsende',
    product: 'Produkt',

    // Navigation
    nav_product_info: 'Produktinfo',
    nav_component: 'Komponente',
    nav_manufacturing: 'Herstellung',
    nav_use: 'Nutzung',
    nav_end_of_life: 'Nutzungsende',

    // Misc
    variant: 'Variante',
    var_short: 'Var',
  },
  en: {
    // Materials
    mat_cement: 'Cement',
    mat_gravel: 'Aggregate',
    mat_steel: 'Steel',
    mat_hardwood: 'Hardwood',
    mat_carbolineum: 'Carbolineum',
    mat_pet: 'PET',
    mat_glass_fibre: 'Glass Fibre',
    mat_pur: 'PUR Foam',

    // Transport
    trans_train_diesel: 'Freight, Train, Diesel',
    trans_train_electric: 'Freight, Train, Electric',
    trans_lorry: 'Lorry',
    trans_sea: 'Ship',

    // Energy
    energy_ch_basic: 'CH Grid (Basic)',
    energy_ch_green: 'CH Grid (Green)',
    energy_solar: 'Solar',

    // Heat
    heat_gas: 'Natural Gas',
    heat_wood: 'Wood',
    heat_solar: 'Solar',

    // Product categories
    cat_infrastructure: 'Infrastructure',
    cat_building: 'Building Material',
    cat_transport: 'Transport',
    cat_energy: 'Energy',

    // Calculation breakdown
    calc_electricity: 'Electricity',
    calc_heat: 'Heat',
    calc_transport: 'Transport',

    // ThreeWaySlider
    rec_no_loss: 'Rec. without',
    rec_no_loss_sub: 'quality loss',
    rec_with_loss: 'Rec. with',
    rec_with_loss_sub: 'quality loss',
    rec_disposal: 'Losses',

    // MaterialPanel
    material_select: '(select)',
    material_type: 'Material Type',
    material_mass: 'Mass',
    material_primary: 'Primary Material Content',
    material_production_loss: 'Production losses relative to mass in component',
    material_loss_treatment: 'Production Loss Treatment',
    material_avg_transport: 'Avg. Transport Distance',
    material_transport_type: 'Transport Mode & Share',

    // ResultsChart
    results_title: 'Overall Result / Variant Comparison',
    results_pressure: 'Resource Pressure',

    // ProduktinfoSection
    product_name: 'Product Name',
    product_category: 'Product Category',
    variant_name_label: 'Variant Name',
    product_weight: 'Weight in kg',
    component_count: 'Number of Components',

    // KomponenteSection
    component_name: 'Component Name:',

    // HerstellungSection
    electricity_consumption: 'Electricity Consumption',
    energy_per_unit: 'Energy per Unit',
    energy_source: 'Energy Source',
    heat_consumption: 'Heat Consumption',
    heat_source: 'Heat Source',

    // NutzungSection
    use_phase: 'Use Phase',
    lifetime: 'Lifetime',
    years: 'Years',
    lifetime_info: 'Lifetime affects resource pressure proportionally.',
    lifetime_info2: 'Longer lifetime = lower τ',

    // NutzungsendeSection
    dismantling: 'Dismantling',
    resource_demand: 'Resource Demand',
    transport_to_buyer: 'Transport to Buyer',
    transport_type: 'Transport Mode',
    product_eol: 'Product End of Life',
    product: 'Product',

    // Navigation
    nav_product_info: 'Product Info',
    nav_component: 'Component',
    nav_manufacturing: 'Manufacturing',
    nav_use: 'Use Phase',
    nav_end_of_life: 'End of Life',

    // Misc
    variant: 'Variant',
    var_short: 'Var',
  },
};

function useT() {
  const lang = useLang();
  return (key) => translations[lang]?.[key] ?? translations.de[key] ?? key;
}

// =============================================================================
// REFERENCE DATA (localized via hooks)
// =============================================================================

function useMaterialsDB() {
  const t = useT();
  return useMemo(() => [
    { id: 'cement', name: t('mat_cement'), erp: 1.32e12 },
    { id: 'gravel', name: t('mat_gravel'), erp: 7.37e13 },
    { id: 'steel', name: t('mat_steel'), erp: 4.34e11 },
    { id: 'hardwood', name: t('mat_hardwood'), erp: 3.00e12 },
    { id: 'carbolineum', name: t('mat_carbolineum'), erp: 2.47e11 },
    { id: 'pet', name: t('mat_pet'), erp: 1.78e11 },
    { id: 'glass_fibre', name: t('mat_glass_fibre'), erp: 3.82e11 },
    { id: 'pur', name: t('mat_pur'), erp: 1.21e11 },
  ], [t]);
}

function useTransportModes() {
  const t = useT();
  return useMemo(() => [
    { id: 'train_diesel', name: t('trans_train_diesel') },
    { id: 'train_electric', name: t('trans_train_electric') },
    { id: 'lorry', name: t('trans_lorry') },
    { id: 'sea', name: t('trans_sea') },
  ], [t]);
}

function useEnergySources() {
  const t = useT();
  return useMemo(() => [
    { id: 'ch_basic', name: t('energy_ch_basic') },
    { id: 'ch_green', name: t('energy_ch_green') },
    { id: 'solar', name: t('energy_solar') },
  ], [t]);
}

function useHeatSources() {
  const t = useT();
  return useMemo(() => [
    { id: 'gas', name: t('heat_gas') },
    { id: 'wood', name: t('heat_wood') },
    { id: 'solar', name: t('heat_solar') },
  ], [t]);
}

function useProductCategories() {
  const t = useT();
  return useMemo(() => [
    t('cat_infrastructure'),
    t('cat_building'),
    t('cat_transport'),
    t('cat_energy'),
  ], [t]);
}

const materialColors = {
  cement: '#64748B', gravel: '#94A3B8', steel: '#78716C',
  hardwood: '#D97706', carbolineum: '#EA580C',
  pet: '#10B981', glass_fibre: '#06B6D4', pur: '#A855F7',
};

const staticMaterialsDB = [
  { id: 'cement', erp: 1.32e12 },
  { id: 'gravel', erp: 7.37e13 },
  { id: 'steel', erp: 4.34e11 },
  { id: 'hardwood', erp: 3.00e12 },
  { id: 'carbolineum', erp: 2.47e11 },
  { id: 'pet', erp: 1.78e11 },
  { id: 'glass_fibre', erp: 3.82e11 },
  { id: 'pur', erp: 1.21e11 },
];

const createBetonVariant = () => ({
  id: 'v1',
  name: 'V1-Beton',
  productInfo: { productName: 'Bahnschwellen', category: 'Infrastruktur', variantName: 'Beton', weight: 295, componentCount: 1 },
  components: [{
    id: 'comp_1', name: 'Schwelle',
    materials: [
      { id: 'm1', materialId: 'cement', mass: 68, primaryContent: 100, productionLoss: 5, lossTreatment: { noLoss: 0, withLoss: 50, disposal: 50 }, transportDist: 50, transportModes: [{ id: 'lorry', share: 100 }] },
      { id: 'm2', materialId: 'gravel', mass: 170, primaryContent: 100, productionLoss: 2, lossTreatment: { noLoss: 90, withLoss: 0, disposal: 10 }, transportDist: 30, transportModes: [{ id: 'lorry', share: 100 }] },
      { id: 'm3', materialId: 'steel', mass: 8, primaryContent: 70, productionLoss: 2, lossTreatment: { noLoss: 90, withLoss: 10, disposal: 0 }, transportDist: 100, transportModes: [{ id: 'train_electric', share: 100 }] },
      { id: 'm4', materialId: 'pur', mass: 4, primaryContent: 100, productionLoss: 10, lossTreatment: { noLoss: 0, withLoss: 30, disposal: 70 }, transportDist: 200, transportModes: [{ id: 'lorry', share: 100 }] },
    ]
  }],
  manufacturing: { electricity: { consumption: 80, source: 'ch_basic' }, heat: { consumption: 150, source: 'gas' } },
  usePhase: { lifetime: 40 },
  endOfLife: { energy: 0, energySource: '', transportDist: 50, transportMode: 'lorry', scenario: 'Recycling' },
});

// =============================================================================
// CALCULATION
// =============================================================================

function useCalculateTau() {
  const t = useT();

  return useCallback((variant) => {
    if (!variant) return { total: 0, breakdown: [] };

    const lifetime = variant.usePhase?.lifetime || 40;
    const breakdown = [];
    let total = 0;

    variant.components?.forEach(comp => {
      comp.materials?.forEach(mat => {
        const material = staticMaterialsDB.find(m => m.id === mat.materialId);
        if (!material) return;

        const massReq = mat.mass * (1 + (mat.productionLoss || 0) / 100);
        const primary = (mat.primaryContent || 100) / 100;
        const tau = (massReq / material.erp) * (1 / lifetime) * (primary + (1 - primary) * 0.1);

        total += tau;
        breakdown.push({
          name: t(`mat_${mat.materialId}`) || mat.materialId,
          tau,
          color: materialColors[mat.materialId] || '#6B7280',
        });
      });
    });

    const elecTau = (variant.manufacturing?.electricity?.consumption || 0) / 1e12 / lifetime * 0.5;
    if (elecTau > 0) {
      total += elecTau;
      breakdown.push({ name: t('calc_electricity'), tau: elecTau, color: '#FDE047' });
    }

    const heatTau = (variant.manufacturing?.heat?.consumption || 0) / 1e13 / lifetime * 0.3;
    if (heatTau > 0) {
      total += heatTau;
      breakdown.push({ name: t('calc_heat'), tau: heatTau, color: '#FB923C' });
    }

    let transTau = 0;
    variant.components?.forEach(comp => {
      comp.materials?.forEach(mat => {
        transTau += ((mat.transportDist || 0) * (mat.mass || 0)) / 1e15 / lifetime;
      });
    });
    if (transTau > 0) {
      total += transTau;
      breakdown.push({ name: t('calc_transport'), tau: transTau, color: '#A78BFA' });
    }

    return { total, breakdown };
  }, [t]);
}

// =============================================================================
// UI COMPONENTS
// =============================================================================

function FormRow({ label, children, wide }) {
  return (
    <div className={`flex items-center gap-4 ${wide ? '' : ''}`}>
      <label className="text-sm text-gray-700 w-44 shrink-0">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, type = 'text', unit, placeholder, className = '' }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className={`px-3 py-2 border border-gray-300 rounded text-sm w-full ${className}`}
      />
      {unit && <span className="text-sm text-gray-500 shrink-0">{unit}</span>}
    </div>
  );
}

function SelectInput({ value, onChange, options, placeholder = '-' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded bg-white text-sm w-full"
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.id || opt} value={opt.id || opt}>
          {opt.name || opt}
        </option>
      ))}
    </select>
  );
}

function NumberSpinner({ value, onChange, min = 1, max = 10 }) {
  return (
    <div className="inline-flex items-center border border-gray-300 rounded w-20">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
        className="w-10 px-2 py-1.5 text-sm text-center border-none outline-none"
      />
      <div className="flex flex-col border-l border-gray-300">
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="px-1.5 py-0.5 hover:bg-gray-100 text-[10px] leading-none"
        >▲</button>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="px-1.5 py-0.5 hover:bg-gray-100 text-[10px] leading-none border-t border-gray-300"
        >▼</button>
      </div>
    </div>
  );
}

function Slider({ value, onChange, min = 0, max = 100, showLabels = true }) {
  return (
    <div className="flex items-center gap-3 flex-1">
      {showLabels && <span className="text-xs text-gray-400 w-6">{min}%</span>}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gray-800 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
      />
      {showLabels && <span className="text-xs text-gray-400 w-8">{max}%</span>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
        className="w-14 px-2 py-1 border border-gray-300 rounded text-sm text-right"
      />
      <span className="text-sm text-gray-500">%</span>
    </div>
  );
}

function ThreeWaySlider({ values, onChange }) {
  const t = useT();
  const { noLoss = 0, withLoss = 50, disposal = 50 } = values;

  return (
    <div className="mt-3">
      <div className="flex text-xs text-gray-500 mb-1">
        <div className="flex-1 text-center">{t('rec_no_loss')}<br/>{t('rec_no_loss_sub')}</div>
        <div className="flex-1 text-center">{t('rec_with_loss')}<br/>{t('rec_with_loss_sub')}</div>
        <div className="flex-1 text-center">{t('rec_disposal')}</div>
      </div>
      <div className="flex text-xs font-semibold mb-2">
        <div className="flex-1 text-center">{noLoss}%</div>
        <div className="flex-1 text-center">{withLoss}%</div>
        <div className="flex-1 text-center">{disposal}%</div>
      </div>
      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden flex">
        <div className="h-full bg-blue-400" style={{ width: `${noLoss}%` }} />
        <div className="h-full bg-yellow-400" style={{ width: `${withLoss}%` }} />
        <div className="h-full bg-red-400" style={{ width: `${disposal}%` }} />
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="range"
          min={0}
          max={100}
          value={noLoss}
          onChange={(e) => {
            const v = Number(e.target.value);
            const remaining = 100 - v;
            onChange({ noLoss: v, withLoss: Math.min(withLoss, remaining), disposal: remaining - Math.min(withLoss, remaining) });
          }}
          className="flex-1"
        />
        <input
          type="range"
          min={0}
          max={100 - noLoss}
          value={withLoss}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChange({ noLoss, withLoss: v, disposal: 100 - noLoss - v });
          }}
          className="flex-1"
        />
      </div>
    </div>
  );
}

function MaterialPanel({ material, index, onChange, onRemove, canRemove }) {
  const t = useT();
  const materialsDB = useMaterialsDB();
  const transportModes = useTransportModes();
  const [expanded, setExpanded] = useState(true);
  const mat = materialsDB.find(m => m.id === material.materialId);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white mb-3">
      <div
        className={`px-4 py-3 flex items-center justify-between cursor-pointer ${expanded ? 'bg-blue-50 border-b border-blue-200' : 'bg-gray-50'}`}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="font-medium text-sm">
          {expanded ? '−' : '+'} Material {index + 1}: {mat?.name || t('material_select')}
        </span>
        {canRemove && (
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-gray-400 hover:text-red-500 p-1">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {expanded && (
        <div className="p-4 space-y-5 bg-gray-50">
          <FormRow label={t('material_type')}>
            <SelectInput
              value={material.materialId}
              onChange={(v) => onChange({ ...material, materialId: v })}
              options={materialsDB}
            />
          </FormRow>

          <FormRow label={t('material_mass')}>
            <TextInput
              type="number"
              value={material.mass}
              onChange={(v) => onChange({ ...material, mass: v })}
              unit="kg"
            />
          </FormRow>

          <FormRow label={t('material_primary')}>
            <Slider
              value={material.primaryContent}
              onChange={(v) => onChange({ ...material, primaryContent: v })}
            />
          </FormRow>

          <FormRow label={t('material_production_loss')}>
            <Slider
              value={material.productionLoss}
              onChange={(v) => onChange({ ...material, productionLoss: v })}
            />
          </FormRow>

          <div>
            <label className="text-sm text-gray-700 block mb-1">{t('material_loss_treatment')}</label>
            <ThreeWaySlider
              values={material.lossTreatment}
              onChange={(v) => onChange({ ...material, lossTreatment: v })}
            />
          </div>

          <FormRow label={t('material_avg_transport')}>
            <TextInput
              type="number"
              value={material.transportDist}
              onChange={(v) => onChange({ ...material, transportDist: v })}
              unit="km"
            />
          </FormRow>

          <div>
            <label className="text-sm text-gray-700 block mb-2">{t('material_transport_type')}</label>
            {material.transportModes?.map((tm, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <SelectInput
                  value={tm.id}
                  onChange={(v) => {
                    const modes = [...material.transportModes];
                    modes[i] = { ...tm, id: v };
                    onChange({ ...material, transportModes: modes });
                  }}
                  options={transportModes}
                />
                <input
                  type="number"
                  value={tm.share}
                  onChange={(e) => {
                    const modes = [...material.transportModes];
                    modes[i] = { ...tm, share: Number(e.target.value) };
                    onChange({ ...material, transportModes: modes });
                  }}
                  className="w-16 px-2 py-2 border border-gray-300 rounded text-sm text-right"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SankeyDiagram({ variant }) {
  const t = useT();
  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className="px-3 py-2 bg-amber-400 inline-block m-3 rounded font-medium text-sm">
        {variant?.name || t('variant')}
      </div>
      <svg viewBox="0 0 380 260" className="w-full px-2 pb-3">
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#94A3B8" />
          </marker>
        </defs>

        <text x="10" y="18" fontSize="7" fill="#9CA3AF">other product systems in society</text>
        <text x="25" y="42" fontSize="7" fill="#9CA3AF">product system i − 1</text>
        <text x="250" y="42" fontSize="6" fill="#9CA3AF">secondary material from higher quality</text>

        <rect x="60" y="55" width="160" height="115" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4" rx="3" />

        <text x="70" y="75" fontSize="6" fill="#6B7280">Sustainable material input</text>
        <text x="70" y="84" fontSize="6" fill="#6B7280">into the socioeconomic system</text>
        <text x="70" y="150" fontSize="6" fill="#9CA3AF">Ecological Resource</text>
        <text x="70" y="159" fontSize="6" fill="#9CA3AF">Budget ERP</text>

        <rect x="80" y="95" width="90" height="35" fill="#DBEAFE" stroke="#3B82F6" rx="2" />
        <text x="90" y="110" fontSize="7" fill="#1E40AF">m<tspan fontSize="5" dy="2">primary</tspan></text>
        <text x="90" y="122" fontSize="6" fill="#374151">primary material</text>

        <path d="M 170 112 L 240 112 Q 250 112 250 102 L 250 85 L 320 85" fill="none" stroke="#3B82F6" strokeWidth="12" opacity="0.4" />
        <text x="255" y="70" fontSize="6" fill="#6B7280">m<tspan fontSize="5">product</tspan> mass flow</text>
        <text x="255" y="80" fontSize="6" fill="#6B7280">required for product</text>

        <rect x="310" y="95" width="55" height="35" fill="#F3F4F6" stroke="#9CA3AF" rx="2" />
        <text x="320" y="117" fontSize="8" fill="#374151" fontWeight="500">PRODUCT</text>

        <path d="M 337 130 L 337 160 L 365 160" fill="none" stroke="#EF4444" strokeWidth="5" opacity="0.5" />
        <text x="320" y="180" fontSize="6" fill="#9CA3AF">final loss to ERP</text>

        <path d="M 310 130 L 310 210 L 180 210 L 180 170" fill="none" stroke="#22C55E" strokeWidth="8" opacity="0.4" />
        <text x="200" y="225" fontSize="6" fill="#6B7280">recycled material</text>

        <path d="M 180 210 L 80 210 L 80 245" fill="none" stroke="#F59E0B" strokeWidth="5" opacity="0.4" />
        <text x="25" y="250" fontSize="6" fill="#9CA3AF">cascaded material to lower quality</text>

        <text x="170" y="198" fontSize="6" fill="#9CA3AF">product system i</text>
        <text x="60" y="240" fontSize="6" fill="#9CA3AF">product system i + 1</text>
      </svg>
    </div>
  );
}

function ResultsChart({ variants }) {
  const t = useT();
  const calculateTau = useCalculateTau();

  const data = variants.map(v => {
    const result = calculateTau(v);
    const obj = { name: v.name || t('variant'), total: result.total };
    result.breakdown.forEach(b => { obj[b.name] = b.tau; });
    return obj;
  });

  const allKeys = [...new Set(variants.flatMap(v => calculateTau(v).breakdown.map(b => b.name)))];

  const colorsByKey = {};
  variants.forEach(v => {
    calculateTau(v).breakdown.forEach(b => { colorsByKey[b.name] = b.color; });
  });

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">{t('results_title')}</span>
        <button className="p-1 hover:bg-gray-100 rounded"><Maximize2 className="w-4 h-4 text-gray-400" /></button>
      </div>
      <div className="text-xs text-gray-500 mb-2">{t('results_pressure')}</div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => v.toExponential(0)} width={45} />
          <Tooltip formatter={(v) => v.toExponential(2)} contentStyle={{ fontSize: 11 }} />
          {allKeys.map(key => (
            <Bar key={key} dataKey={key} stackId="a" fill={colorsByKey[key] || '#6B7280'} />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-around mt-3 pt-3 border-t border-gray-200">
        {data.map((d, i) => (
          <div key={i} className="text-center">
            <div className="text-sm font-mono font-bold text-gray-800">{d.total.toExponential(2)}</div>
            <div className="text-xs text-gray-500">{d.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// SECTIONS
// =============================================================================

function ProduktinfoSection({ variant, onChange }) {
  const t = useT();
  const productCategories = useProductCategories();

  const update = (key, value) => {
    onChange({ ...variant, productInfo: { ...variant.productInfo, [key]: value } });
  };

  return (
    <div className="space-y-5">
      <FormRow label={t('product_name')}>
        <TextInput value={variant.productInfo.productName} onChange={(v) => update('productName', v)} />
      </FormRow>
      <FormRow label={t('product_category')}>
        <SelectInput value={variant.productInfo.category} onChange={(v) => update('category', v)} options={productCategories} />
      </FormRow>
      <FormRow label={t('variant_name_label')}>
        <TextInput value={variant.productInfo.variantName} onChange={(v) => update('variantName', v)} className="bg-amber-100" />
      </FormRow>
      <FormRow label={t('product_weight')}>
        <TextInput type="number" value={variant.productInfo.weight} onChange={(v) => update('weight', v)} />
      </FormRow>
      <FormRow label={t('component_count')}>
        <NumberSpinner value={variant.productInfo.componentCount} onChange={(v) => update('componentCount', v)} />
      </FormRow>

      <div className="mt-6 rounded-lg overflow-hidden border border-gray-200">
        <img
          src="https://images.unsplash.com/photo-1527684651472-63dc66aa5a85?w=500&h=280&fit=crop"
          alt="Bahnschwellen"
          className="w-full h-48 object-cover"
        />
      </div>
    </div>
  );
}

function KomponenteSection({ variant, onChange, compIndex }) {
  const t = useT();
  const comp = variant.components?.[0] || { name: '', materials: [] };

  const updateComp = (updates) => {
    const newComps = [...(variant.components || [])];
    newComps[0] = { ...comp, ...updates };
    onChange({ ...variant, components: newComps });
  };

  const updateMaterial = (idx, mat) => {
    const mats = [...comp.materials];
    mats[idx] = mat;
    updateComp({ materials: mats });
  };

  const removeMaterial = (idx) => {
    updateComp({ materials: comp.materials.filter((_, i) => i !== idx) });
  };

  const addMaterial = () => {
    const newMat = {
      id: `m_${Date.now()}`,
      materialId: '',
      mass: 0,
      primaryContent: 100,
      productionLoss: 0,
      lossTreatment: { noLoss: 0, withLoss: 50, disposal: 50 },
      transportDist: 0,
      transportModes: [{ id: 'lorry', share: 100 }],
    };
    updateComp({ materials: [...comp.materials, newMat] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm text-gray-700 w-44">{t('component_name')}</label>
        <TextInput value={comp.name} onChange={(v) => updateComp({ name: v })} />
        <Factory className="w-6 h-6 text-gray-400" />
      </div>

      {comp.materials?.map((mat, idx) => (
        <MaterialPanel
          key={mat.id}
          material={mat}
          index={idx}
          onChange={(m) => updateMaterial(idx, m)}
          onRemove={() => removeMaterial(idx)}
          canRemove={comp.materials.length > 1}
        />
      ))}

      <button
        onClick={addMaterial}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Material {comp.materials.length + 1}:
      </button>
    </div>
  );
}

function HerstellungSection({ variant, onChange }) {
  const t = useT();
  const energySources = useEnergySources();
  const heatSources = useHeatSources();
  const mfg = variant.manufacturing || { electricity: {}, heat: {} };

  const updateElec = (key, value) => {
    onChange({
      ...variant,
      manufacturing: { ...mfg, electricity: { ...mfg.electricity, [key]: value } }
    });
  };

  const updateHeat = (key, value) => {
    onChange({
      ...variant,
      manufacturing: { ...mfg, heat: { ...mfg.heat, [key]: value } }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">{t('electricity_consumption')}</h3>
        <div className="space-y-4">
          <FormRow label={t('energy_per_unit')}>
            <TextInput type="number" value={mfg.electricity?.consumption || 0} onChange={(v) => updateElec('consumption', v)} unit="kWh" />
          </FormRow>
          <FormRow label={t('energy_source')}>
            <SelectInput value={mfg.electricity?.source || ''} onChange={(v) => updateElec('source', v)} options={energySources} />
          </FormRow>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">{t('heat_consumption')}</h3>
        <div className="space-y-4">
          <FormRow label={t('energy_per_unit')}>
            <TextInput type="number" value={mfg.heat?.consumption || 0} onChange={(v) => updateHeat('consumption', v)} unit="kWh" />
          </FormRow>
          <FormRow label={t('heat_source')}>
            <SelectInput value={mfg.heat?.source || ''} onChange={(v) => updateHeat('source', v)} options={heatSources} />
          </FormRow>
        </div>
      </div>
    </div>
  );
}

function NutzungSection({ variant, onChange }) {
  const t = useT();
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">{t('use_phase')}</h3>
      <FormRow label={t('lifetime')}>
        <TextInput
          type="number"
          value={variant.usePhase?.lifetime || 40}
          onChange={(v) => onChange({ ...variant, usePhase: { lifetime: v } })}
          unit={t('years')}
        />
      </FormRow>
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        {t('lifetime_info')}<br />
        {t('lifetime_info2')}
      </div>
    </div>
  );
}

function NutzungsendeSection({ variant, onChange }) {
  const t = useT();
  const materialsDB = useMaterialsDB();
  const energySources = useEnergySources();
  const transportModes = useTransportModes();
  const eol = variant.endOfLife || {};
  const allMats = variant.components?.flatMap(c => c.materials) || [];

  const update = (key, value) => {
    onChange({ ...variant, endOfLife: { ...eol, [key]: value } });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">{t('dismantling')}</h3>
        <div className="space-y-4">
          <FormRow label={t('energy_per_unit')}>
            <TextInput type="number" value={eol.energy || 0} onChange={(v) => update('energy', v)} unit="kWh" />
          </FormRow>
          <FormRow label={t('energy_source')}>
            <SelectInput value={eol.energySource || ''} onChange={(v) => update('energySource', v)} options={energySources} />
          </FormRow>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">{t('resource_demand')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <SelectInput value="" onChange={() => {}} options={materialsDB} />
          <TextInput type="number" value={0} onChange={() => {}} unit="kg" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">{t('transport_to_buyer')}</h3>
        <div className="space-y-4">
          <FormRow label={t('material_avg_transport')}>
            <TextInput type="number" value={eol.transportDist || 0} onChange={(v) => update('transportDist', v)} unit="km" />
          </FormRow>
          <FormRow label={t('transport_type')}>
            <SelectInput value={eol.transportMode || ''} onChange={(v) => update('transportMode', v)} options={transportModes} />
          </FormRow>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">{t('product_eol')}</h3>
        <FormRow label={t('product')}>
          <SelectInput value={eol.scenario || 'Recycling'} onChange={(v) => update('scenario', v)} options={['Recycling', 'Cascading', 'Disposal']} />
        </FormRow>

        <div className="mt-6 space-y-6">
          {allMats.slice(0, 2).map((mat, idx) => {
            const m = materialsDB.find(x => x.id === mat.materialId);
            return (
              <div key={idx}>
                <label className="text-sm text-gray-700 block mb-1">Material {idx + 1}: {m?.name || mat.materialId}</label>
                <ThreeWaySlider values={mat.lossTreatment} onChange={() => {}} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// LANGUAGE SWITCHER
// =============================================================================

function LanguageSwitcher({ lang, setLang }) {
  return (
    <button
      onClick={() => setLang(lang === 'de' ? 'en' : 'de')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
      title={lang === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'}
    >
      <Globe className="w-4 h-4" />
      <span>{lang === 'de' ? 'EN' : 'DE'}</span>
    </button>
  );
}

// =============================================================================
// MAIN APP
// =============================================================================

export default function App() {
  const [lang, setLang] = useState('de');
  const [variants, setVariants] = useState([createBetonVariant()]);
  const [activeId, setActiveId] = useState('v1');
  const [section, setSection] = useState('produktinfo');

  return (
    <LangContext.Provider value={lang}>
      <AppInner
        lang={lang}
        setLang={setLang}
        variants={variants}
        setVariants={setVariants}
        activeId={activeId}
        setActiveId={setActiveId}
        section={section}
        setSection={setSection}
      />
    </LangContext.Provider>
  );
}

function AppInner({ lang, setLang, variants, setVariants, activeId, setActiveId, section, setSection }) {
  const t = useT();

  const activeVariant = variants.find(v => v.id === activeId);

  const updateVariant = useCallback((updated) => {
    setVariants(prev => prev.map(v => v.id === activeId ? updated : v));
  }, [activeId, setVariants]);

  const addVariant = () => {
    const id = `v${Date.now()}`;
    setVariants([...variants, {
      ...createBetonVariant(),
      id,
      name: `${t('variant')} ${variants.length + 1}`,
      productInfo: { ...createBetonVariant().productInfo, variantName: `${t('var_short')} ${variants.length + 1}` }
    }]);
    setActiveId(id);
  };

  const removeVariant = (id) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter(v => v.id !== id));
    if (activeId === id) setActiveId(variants.find(v => v.id !== id).id);
  };

  const sections = useMemo(() => {
    const s = [{ id: 'produktinfo', name: t('nav_product_info') }];
    const count = activeVariant?.productInfo?.componentCount || 1;
    for (let i = 0; i < count; i++) s.push({ id: `komponente_${i}`, name: `${t('nav_component')} ${i + 1}` });
    s.push(
      { id: 'herstellung', name: t('nav_manufacturing') },
      { id: 'nutzung', name: t('nav_use') },
      { id: 'nutzungsende', name: t('nav_end_of_life') }
    );
    return s;
  }, [activeVariant?.productInfo?.componentCount, t]);

  const renderSection = () => {
    if (!activeVariant) return null;
    if (section === 'produktinfo') return <ProduktinfoSection variant={activeVariant} onChange={updateVariant} />;
    if (section.startsWith('komponente_')) return <KomponenteSection variant={activeVariant} onChange={updateVariant} compIndex={0} />;
    if (section === 'herstellung') return <HerstellungSection variant={activeVariant} onChange={updateVariant} />;
    if (section === 'nutzung') return <NutzungSection variant={activeVariant} onChange={updateVariant} />;
    if (section === 'nutzungsende') return <NutzungsendeSection variant={activeVariant} onChange={updateVariant} />;
    return null;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-800">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 bg-gray-800 border-b border-gray-700">
        {variants.map(v => (
          <div
            key={v.id}
            onClick={() => setActiveId(v.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t cursor-pointer text-sm font-medium transition ${
              v.id === activeId ? 'bg-amber-400 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {v.name}
            {variants.length > 1 && (
              <button onClick={(e) => { e.stopPropagation(); removeVariant(v.id); }} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        <button onClick={addVariant} className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
          <Plus className="w-4 h-4" />
        </button>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher lang={lang} setLang={setLang} />
          <button className="p-2 text-gray-400 hover:text-white"><RefreshCw className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left nav */}
        <nav className="w-36 bg-gray-100 border-r border-gray-300 shrink-0 overflow-y-auto">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`w-full px-4 py-3 text-left text-sm border-l-4 transition ${
                section === s.id
                  ? 'bg-amber-50 border-amber-400 text-gray-900 font-medium'
                  : 'border-transparent text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </nav>

        {/* Center form */}
        <main className="flex-1 bg-white p-6 overflow-y-auto">
          <div className="max-w-2xl">{renderSection()}</div>
        </main>

        {/* Right viz */}
        <aside className="w-96 bg-gray-100 border-l border-gray-300 p-4 shrink-0 overflow-y-auto space-y-4">
          <SankeyDiagram variant={activeVariant} />
          <ResultsChart variants={variants} />
        </aside>
      </div>
    </div>
  );
}
