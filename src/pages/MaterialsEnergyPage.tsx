import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useMaterialsEnergy } from '../hooks/useMaterialsEnergy';
import { useTheme } from '../hooks/useTheme';
import { formatTau } from '../utils/formatters';
import { transportModes } from '../data/transportModes';
import type { EnergyMix, EnergySource, TransportMix, TransportModeEntry } from '../types';

type TabId = 'electricity' | 'heat' | 'transport' | 'materials';

const BAR_COLORS = [
  '#FDE047', // yellow
  '#FB923C', // orange
  '#A855F7', // purple
  '#4B5563', // gray
  '#9CA3AF', // light gray
  '#22C55E', // green
  '#3B82F6', // blue
];

function formatErp(value: number): string {
  return formatTau(value);
}

export function MaterialsEnergyPage() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const {
    electricityMixes,
    heatMixes,
    transportMixes,
    materials,
    updateEnergyMix,
    addEnergyMix,
    removeEnergyMix,
    updateTransportMix,
    addTransportMix,
    removeTransportMix,
    getErpEntry,
  } = useMaterialsEnergy();

  const [activeTab, setActiveTab] = useState<TabId>('electricity');

  const electricityOptions = materials
    .filter((m) => m.category === 'electricity')
    .map((m) => ({ value: m.id, label: m.name }));

  const heatOptions = materials
    .filter((m) => m.category === 'heat')
    .map((m) => ({ value: m.id, label: m.name }));

  const transportModeOptions = transportModes.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  const materialEntries = materials.filter((m) => m.category === 'material');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'electricity', label: 'Electricity Mixes' },
    { id: 'heat', label: 'Heat Mixes' },
    { id: 'transport', label: 'Transport Profiles' },
    { id: 'materials', label: 'Material Data' },
  ];

  function handleAddElectricityMix() {
    addEnergyMix({
      id: `mix_${Date.now()}`,
      name: 'New Electricity Mix',
      type: 'electricity',
      sources: electricityOptions.length > 0 ? [{ erpId: electricityOptions[0].value, share: 1 }] : [],
    });
  }

  function handleAddHeatMix() {
    addEnergyMix({
      id: `mix_${Date.now()}`,
      name: 'New Heat Mix',
      type: 'heat',
      sources: heatOptions.length > 0 ? [{ erpId: heatOptions[0].value, share: 1 }] : [],
    });
  }

  function handleAddTransportMix(type: 'land' | 'overseas') {
    addTransportMix({
      id: `mix_${Date.now()}`,
      name: type === 'land' ? 'New Land Profile' : 'New Overseas Profile',
      type,
      modes:
        transportModeOptions.length > 0
          ? [{ modeId: transportModeOptions[0].value, share: 1 }]
          : [],
    });
  }

  function updateEnergySource(mix: EnergyMix, sourceIdx: number, updates: Partial<EnergySource>) {
    const sources = [...mix.sources];
    sources[sourceIdx] = { ...sources[sourceIdx], ...updates };
    updateEnergyMix(mix.id, { sources });
  }

  function addEnergySource(mix: EnergyMix) {
    const options = mix.type === 'electricity' ? electricityOptions : heatOptions;
    const newSource: EnergySource = {
      erpId: options[0]?.value ?? '',
      share: 0,
    };
    updateEnergyMix(mix.id, {
      sources: [...mix.sources, newSource],
    });
  }

  function removeEnergySource(mix: EnergyMix, sourceIdx: number) {
    const sources = mix.sources.filter((_, i) => i !== sourceIdx);
    updateEnergyMix(mix.id, { sources });
  }

  function updateTransportMode(mix: TransportMix, modeIdx: number, updates: Partial<TransportModeEntry>) {
    const modes = [...mix.modes];
    modes[modeIdx] = { ...modes[modeIdx], ...updates };
    updateTransportMix(mix.id, { modes });
  }

  function addTransportMode(mix: TransportMix) {
    const newMode: TransportModeEntry = {
      modeId: transportModeOptions[0]?.value ?? '',
      share: 0,
    };
    updateTransportMix(mix.id, {
      modes: [...mix.modes, newMode],
    });
  }

  function removeTransportMode(mix: TransportMix, modeIdx: number) {
    const modes = mix.modes.filter((_, i) => i !== modeIdx);
    updateTransportMix(mix.id, { modes });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Materials & Energy</h1>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map(({ id, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-md transition-colors ${
                isActive
                  ? 'bg-amber-500 text-black'
                  : dark
                    ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === 'electricity' && (
          <div className="space-y-4">
            {electricityMixes.map((mix) => (
              <EnergyMixCard
                key={mix.id}
                mix={mix}
                sourceOptions={electricityOptions}
                barColors={BAR_COLORS}
                getErpEntry={getErpEntry}
                onUpdateName={(name) => updateEnergyMix(mix.id, { name })}
                onUpdateSource={(idx, updates) => updateEnergySource(mix, idx, updates)}
                onAddSource={() => addEnergySource(mix)}
                onRemoveSource={(idx) => removeEnergySource(mix, idx)}
                onDelete={() => removeEnergyMix(mix.id)}
              />
            ))}
            <button
              onClick={handleAddElectricityMix}
              className="flex items-center gap-2 px-4 py-3 w-full rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/50 transition-colors"
            >
              <Plus size={18} />
              Add Profile
            </button>
          </div>
        )}

        {activeTab === 'heat' && (
          <div className="space-y-4">
            {heatMixes.map((mix) => (
              <EnergyMixCard
                key={mix.id}
                mix={mix}
                sourceOptions={heatOptions}
                barColors={BAR_COLORS}
                getErpEntry={getErpEntry}
                onUpdateName={(name) => updateEnergyMix(mix.id, { name })}
                onUpdateSource={(idx, updates) => updateEnergySource(mix, idx, updates)}
                onAddSource={() => addEnergySource(mix)}
                onRemoveSource={(idx) => removeEnergySource(mix, idx)}
                onDelete={() => removeEnergyMix(mix.id)}
              />
            ))}
            <button
              onClick={handleAddHeatMix}
              className="flex items-center gap-2 px-4 py-3 w-full rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/50 transition-colors"
            >
              <Plus size={18} />
              Add Profile
            </button>
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Land</h3>
              <div className="space-y-4">
                {transportMixes
                  .filter((m) => m.type === 'land')
                  .map((mix) => (
                    <TransportMixCard
                      key={mix.id}
                      mix={mix}
                      modeOptions={transportModeOptions}
                      barColors={BAR_COLORS}
                      onUpdateName={(name) => updateTransportMix(mix.id, { name })}
                      onUpdateMode={(idx, updates) => updateTransportMode(mix, idx, updates)}
                      onAddMode={() => addTransportMode(mix)}
                      onRemoveMode={(idx) => removeTransportMode(mix, idx)}
                      onDelete={() => removeTransportMix(mix.id)}
                    />
                  ))}
                <button
                  onClick={() => handleAddTransportMix('land')}
                  className="flex items-center gap-2 px-4 py-3 w-full rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/50 transition-colors"
                >
                  <Plus size={18} />
                  Add Land Profile
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Overseas</h3>
              <div className="space-y-4">
                {transportMixes
                  .filter((m) => m.type === 'overseas')
                  .map((mix) => (
                    <TransportMixCard
                      key={mix.id}
                      mix={mix}
                      modeOptions={transportModeOptions}
                      barColors={BAR_COLORS}
                      onUpdateName={(name) => updateTransportMix(mix.id, { name })}
                      onUpdateMode={(idx, updates) => updateTransportMode(mix, idx, updates)}
                      onAddMode={() => addTransportMode(mix)}
                      onRemoveMode={(idx) => removeTransportMode(mix, idx)}
                      onDelete={() => removeTransportMix(mix.id)}
                    />
                  ))}
                <button
                  onClick={() => handleAddTransportMix('overseas')}
                  className="flex items-center gap-2 px-4 py-3 w-full rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/50 transition-colors"
                >
                  <Plus size={18} />
                  Add Overseas Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Material</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">ERP</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Unit</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Limiting Boundary</th>
                </tr>
              </thead>
              <tbody>
                {materialEntries.map((m, i) => (
                  <tr
                    key={m.id}
                    className={`border-b border-gray-100 ${
                      i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-900">{m.name}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-gray-900">
                      {formatErp(m.erp)}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{m.unit}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{m.limitingBoundary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

interface EnergyMixCardProps {
  mix: EnergyMix;
  sourceOptions: { value: string; label: string }[];
  barColors: string[];
  getErpEntry: (id: string) => { name: string } | undefined;
  onUpdateName: (name: string) => void;
  onUpdateSource: (idx: number, updates: Partial<EnergySource>) => void;
  onAddSource: () => void;
  onRemoveSource: (idx: number) => void;
  onDelete: () => void;
}

function EnergyMixCard({
  mix,
  sourceOptions,
  barColors,
  getErpEntry,
  onUpdateName,
  onUpdateSource,
  onAddSource,
  onRemoveSource,
  onDelete,
}: EnergyMixCardProps) {
  const totalShare = mix.sources.reduce((s, src) => s + src.share, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <input
          type="text"
          value={mix.name}
          onChange={(e) => onUpdateName(e.target.value)}
          onBlur={(e) => onUpdateName(e.target.value.trim() || mix.name)}
          className="flex-1 text-base font-semibold text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-amber-500 focus:outline-none px-1 py-0.5 -ml-1"
        />
        <button
          onClick={onDelete}
          className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Delete profile"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Share bar */}
      {mix.sources.length > 0 && (
        <div className="h-2 rounded-full overflow-hidden flex mb-4 bg-gray-100">
          {mix.sources.map((src, i) => (
            <div
              key={`${src.erpId}-${i}`}
              style={{
                width: `${(src.share / Math.max(totalShare, 0.001)) * 100}%`,
                backgroundColor: barColors[i % barColors.length],
              }}
              title={getErpEntry(src.erpId)?.name ?? src.erpId}
            />
          ))}
        </div>
      )}

      <div className="space-y-2">
        {mix.sources.map((src, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <select
              value={src.erpId}
              onChange={(e) => onUpdateSource(idx, { erpId: e.target.value })}
              className="flex-1 px-2 py-1.5 text-sm text-gray-900 border border-gray-300 rounded bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              {sourceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={Math.round(src.share * 100)}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v)) onUpdateSource(idx, { share: Math.max(0, Math.min(100, v)) / 100 });
                }}
                min={0}
                max={100}
                step={1}
                className="w-16 px-2 py-1.5 text-right text-sm font-mono text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-500 w-6">%</span>
            </div>
            <button
              onClick={() => onRemoveSource(idx)}
              className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
              title="Remove source"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={onAddSource}
          className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium"
        >
          <Plus size={14} />
          Add Source
        </button>
      </div>
    </div>
  );
}

interface TransportMixCardProps {
  mix: TransportMix;
  modeOptions: { value: string; label: string }[];
  barColors: string[];
  onUpdateName: (name: string) => void;
  onUpdateMode: (idx: number, updates: Partial<TransportModeEntry>) => void;
  onAddMode: () => void;
  onRemoveMode: (idx: number) => void;
  onDelete: () => void;
}

function TransportMixCard({
  mix,
  modeOptions,
  barColors,
  onUpdateName,
  onUpdateMode,
  onAddMode,
  onRemoveMode,
  onDelete,
}: TransportMixCardProps) {
  const totalShare = mix.modes.reduce((s, m) => s + m.share, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <input
          type="text"
          value={mix.name}
          onChange={(e) => onUpdateName(e.target.value)}
          onBlur={(e) => onUpdateName(e.target.value.trim() || mix.name)}
          className="flex-1 text-base font-semibold text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-amber-500 focus:outline-none px-1 py-0.5 -ml-1"
        />
        <button
          onClick={onDelete}
          className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Delete profile"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {mix.modes.length > 0 && (
        <div className="h-2 rounded-full overflow-hidden flex mb-4 bg-gray-100">
          {mix.modes.map((mode, i) => (
            <div
              key={`${mode.modeId}-${i}`}
              style={{
                width: `${(mode.share / Math.max(totalShare, 0.001)) * 100}%`,
                backgroundColor: barColors[i % barColors.length],
              }}
              title={modeOptions.find((o) => o.value === mode.modeId)?.label ?? mode.modeId}
            />
          ))}
        </div>
      )}

      <div className="space-y-2">
        {mix.modes.map((mode, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <select
              value={mode.modeId}
              onChange={(e) => onUpdateMode(idx, { modeId: e.target.value })}
              className="flex-1 px-2 py-1.5 text-sm text-gray-900 border border-gray-300 rounded bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              {modeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={Math.round(mode.share * 100)}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v)) onUpdateMode(idx, { share: Math.max(0, Math.min(100, v)) / 100 });
                }}
                min={0}
                max={100}
                step={1}
                className="w-16 px-2 py-1.5 text-right text-sm font-mono text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-500 w-6">%</span>
            </div>
            <button
              onClick={() => onRemoveMode(idx)}
              className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
              title="Remove mode"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={onAddMode}
          className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium"
        >
          <Plus size={14} />
          Add Mode
        </button>
      </div>
    </div>
  );
}
