import { useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { NumberInput } from './NumberInput';
import { SelectInput } from './SelectInput';
import type { ProductInfo, SleeperType, ComponentItem } from '../../types';
import { SLEEPER_TYPE_OPTIONS } from '../../data/sleeperTypes';
import { formatNumber } from '../../utils/formatters';

interface ProductInfoFormProps {
  productInfo: ProductInfo;
  lifetime: number;
  components: ComponentItem[];
  onUpdate: (info: Partial<ProductInfo>) => void;
  onLifetimeChange: (lifetime: number) => void;
  onComponentCountChange: (count: number) => void;
  onSleeperTypeChange: (sleeperType: SleeperType) => void;
  onUpdateComponent: (componentId: string, updates: Partial<ComponentItem>) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'building', label: 'Building' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'other', label: 'Other' },
];

export function ProductInfoForm({
  productInfo,
  lifetime,
  components,
  onUpdate,
  onLifetimeChange,
  onComponentCountChange,
  onSleeperTypeChange,
  onUpdateComponent,
}: ProductInfoFormProps) {

  const totalMass = useMemo(
    () => components.reduce((sum, c) => sum + c.mass, 0),
    [components],
  );

  const handleSleeperTypeChange = (value: string) => {
    const st = value as SleeperType;
    onUpdate({ sleeperType: st });
    onSleeperTypeChange(st);
  };

  const handleAddComponent = () => {
    const next = components.length + 1;
    if (next > 10) return;
    onComponentCountChange(next);
  };

  const handleRemoveComponent = () => {
    if (components.length <= 1) return;
    onComponentCountChange(components.length - 1);
  };

  return (
    <div>
      <div className="pb-3 mb-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Product Information</h2>
      </div>

      <div className="space-y-3">
        <div className="py-1.5">
          <label className="block text-sm text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            value={productInfo.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            onBlur={() => onUpdate({ name: productInfo.name.trim() })}
            placeholder="e.g. Railway sleeper"
            className="w-full px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <SelectInput
          label="Category"
          value={productInfo.category}
          onChange={(category) => onUpdate({ category })}
          options={CATEGORY_OPTIONS}
        />

        <SelectInput
          label="Sleeper Type"
          value={productInfo.sleeperType}
          onChange={handleSleeperTypeChange}
          options={SLEEPER_TYPE_OPTIONS}
        />

        <NumberInput
          label="Lifetime"
          value={lifetime}
          onChange={onLifetimeChange}
          unit="years"
          min={1}
          max={100}
          step={1}
          tooltip="Product service life. Auto-set from sleeper type. τ is inversely proportional to lifetime."
        />

        <div className="py-1.5">
          <label className="block text-sm text-gray-700 mb-1">Variant Name</label>
          <input
            type="text"
            value={productInfo.variantName}
            onChange={(e) => onUpdate({ variantName: e.target.value })}
            onBlur={() => onUpdate({ variantName: productInfo.variantName.trim() })}
            placeholder="e.g. V1-Concrete"
            className="w-full px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Components table with name + mass */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Components</label>
            <div className="flex items-center gap-1">
              <button
                onClick={handleRemoveComponent}
                disabled={components.length <= 1}
                className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Remove last component"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={handleAddComponent}
                disabled={components.length >= 10}
                className="p-1 rounded text-gray-400 hover:text-amber-600 hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Add component"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 w-8">#</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">Name</th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 w-28">Mass (kg)</th>
                </tr>
              </thead>
              <tbody>
                {components.map((c, i) => (
                  <tr key={c.id} className={`border-b border-gray-100 last:border-0 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-3 py-1.5 text-xs text-gray-400 tabular-nums">{i + 1}</td>
                    <td className="px-3 py-1.5">
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => onUpdateComponent(c.id, { name: e.target.value })}
                        onBlur={() => onUpdateComponent(c.id, { name: c.name.trim() })}
                        placeholder="Component name"
                        className="w-full px-2 py-1 text-sm text-gray-900 border border-transparent rounded bg-transparent hover:border-gray-300 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </td>
                    <td className="px-3 py-1.5">
                      <input
                        type="number"
                        value={c.mass}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val >= 0) {
                            onUpdateComponent(c.id, { mass: val });
                          }
                        }}
                        min={0}
                        step={0.1}
                        className="w-full px-2 py-1 text-sm text-right text-gray-900 font-mono tabular-nums border border-transparent rounded bg-transparent hover:border-gray-300 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Mass (derived) */}
          <div className="mt-2 flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">Total Mass</span>
            <span className="font-mono text-sm font-semibold tabular-nums text-gray-900">
              {formatNumber(totalMass)} kg
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500">
            Changing the sleeper type will reset components to the default configuration
            for that type. Energy and transport mix profiles can be configured on the
            Materials & Energy page.
          </p>
        </div>
      </div>
    </div>
  );
}
