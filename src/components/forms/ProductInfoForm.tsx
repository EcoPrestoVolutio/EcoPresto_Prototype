import { NumberInput } from './NumberInput';
import { SelectInput } from './SelectInput';
import type { ProductInfo, SleeperType } from '../../types';
import { SLEEPER_TYPE_OPTIONS } from '../../data/sleeperTypes';

interface ProductInfoFormProps {
  productInfo: ProductInfo;
  lifetime: number;
  onUpdate: (info: Partial<ProductInfo>) => void;
  onLifetimeChange: (lifetime: number) => void;
  onComponentCountChange: (count: number) => void;
  onSleeperTypeChange: (sleeperType: SleeperType) => void;
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
  onUpdate,
  onLifetimeChange,
  onComponentCountChange,
  onSleeperTypeChange,
}: ProductInfoFormProps) {

  const handleComponentCountChange = (count: number) => {
    const rounded = Math.round(count);
    onUpdate({ componentCount: rounded });
    onComponentCountChange(rounded);
  };

  const handleSleeperTypeChange = (value: string) => {
    const st = value as SleeperType;
    onUpdate({ sleeperType: st });
    onSleeperTypeChange(st);
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

        <NumberInput
          label="Total Weight"
          value={productInfo.totalWeight}
          onChange={(totalWeight) => onUpdate({ totalWeight })}
          unit="kg"
          min={0}
          step={0.1}
          tooltip="Total mass of the product including all components"
        />

        <NumberInput
          label="Number of Components"
          value={productInfo.componentCount}
          onChange={handleComponentCountChange}
          min={1}
          max={10}
          step={1}
          tooltip="Number of different material components (max. 10)"
        />

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
