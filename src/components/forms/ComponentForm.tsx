import { useMemo } from 'react';
import { NumberInput } from './NumberInput';
import { SelectInput } from './SelectInput';
import { SliderInput } from './SliderInput';
import { ThreeSegmentSlider } from './ThreeSegmentSlider';
import { ComponentIconPicker } from './ComponentIconPicker';
import { useMaterialsEnergy } from '../../hooks/useMaterialsEnergy';
import type { ComponentItem, ComponentIconId, RecyclingChain } from '../../types';

interface ComponentFormProps {
  component: ComponentItem;
  index: number;
  lifetime: number;
  onUpdate: (componentId: string, updates: Partial<ComponentItem>) => void;
  materialOptions: { value: string; label: string }[];
}

function deriveOverallMetrics(component: ComponentItem) {
  const mass = component.mass;
  const lossRate = component.manufacturingLossRate;
  const manufLossKg = mass * lossRate;
  const massRequired = mass + manufLossKg;

  if (massRequired <= 0) {
    return { massRequired: 0, recyclability: 0, cascadability: 0, finalLoss: 1 };
  }

  const m = component.manufacturingLossTreatment;
  const e = component.eolTreatment;

  const recyclability =
    (manufLossKg * m.collectionRate * m.recyclingRate +
      mass * e.collectionRate * e.recyclingRate) /
    massRequired;

  const cascadability =
    (manufLossKg * m.collectionRate * m.cascadingRate +
      mass * e.collectionRate * e.cascadingRate) /
    massRequired;

  const finalLoss = Math.max(0, 1 - recyclability - cascadability);

  return { massRequired, recyclability, cascadability, finalLoss };
}

export function ComponentForm({
  component,
  index,
  lifetime,
  onUpdate,
  materialOptions,
}: ComponentFormProps) {
  const me = useMaterialsEnergy();
  const update = (updates: Partial<ComponentItem>) => {
    onUpdate(component.id, updates);
  };

  const updateChain = (
    field: 'manufacturingLossTreatment' | 'eolTreatment',
    updates: Partial<RecyclingChain>,
  ) => {
    update({ [field]: { ...component[field], ...updates } });
  };

  const handleChainSliderChange = (
    field: 'manufacturingLossTreatment' | 'eolTreatment',
    values: { recycling: number; cascading: number; loss: number },
  ) => {
    update({
      [field]: {
        ...component[field],
        recyclingRate: values.recycling,
        cascadingRate: values.cascading,
        lossRate: values.loss,
      },
    });
  };

  const derived = useMemo(() => deriveOverallMetrics(component), [component]);

  const secondaryContent = Math.max(0, 1 - component.primaryContent);

  const tau = useMemo(() => {
    const erp = me.getErpEntry(component.materialId);
    if (!erp || erp.erp <= 0 || lifetime <= 0 || derived.massRequired <= 0) return 0;
    const F =
      component.primaryContent * (1 - derived.recyclability - 0.5 * derived.cascadability) +
      secondaryContent * 0.5 * derived.finalLoss;
    return (derived.massRequired / erp.erp / lifetime) * Math.max(0, F);
  }, [component, derived, lifetime, secondaryContent, me]);

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <ComponentIconPicker
            value={component.icon}
            onChange={(icon: ComponentIconId) => update({ icon })}
          />
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={component.name}
              onChange={(e) => update({ name: e.target.value })}
              onBlur={() => update({ name: component.name.trim() })}
              placeholder="Component name"
              className="w-full px-1.5 py-0.5 text-base font-semibold text-gray-900 border border-transparent rounded bg-transparent hover:border-gray-300 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <span className="flex items-center justify-center h-6 min-w-[1.5rem] px-1.5 rounded-full bg-gray-200 text-[11px] font-bold text-gray-500 tabular-nums flex-shrink-0">
            {index + 1}
          </span>
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Material & Mass */}
        <div className="space-y-1">
          <SelectInput
            label="Material"
            value={component.materialId}
            onChange={(materialId) => update({ materialId })}
            options={materialOptions}
          />

          <div className="py-1.5">
            <label className="block text-sm text-gray-700 mb-1">Mass per unit</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-1.5 text-sm font-mono tabular-nums text-gray-900 bg-gray-50 border border-gray-200 rounded">
                {component.mass.toLocaleString('en-US', { minimumFractionDigits: 1 })}
              </div>
              <span className="text-xs text-gray-400">kg</span>
            </div>
            <p className="mt-0.5 text-[10px] text-gray-400">Set in Product Info</p>
          </div>
        </div>

        {/* Primary / Secondary split */}
        <div className="space-y-1">
          <SliderInput
            label="Primary Material Content"
            value={component.primaryContent}
            onChange={(primaryContent) => update({ primaryContent })}
            min={0}
            max={1}
            step={0.01}
            tooltip="Virgin (non-recycled) fraction. Secondary = remainder."
          />
          <div className="flex justify-between text-[11px] text-gray-400 px-0.5">
            <span>Primary (virgin): {Math.round(component.primaryContent * 100)}%</span>
            <span>Secondary (recycled): {Math.round(secondaryContent * 100)}%</span>
          </div>
        </div>

        {/* Manufacturing Losses */}
        <div className="space-y-1">
          <SliderInput
            label="Manufacturing Loss Rate"
            value={component.manufacturingLossRate}
            onChange={(manufacturingLossRate) => update({ manufacturingLossRate })}
            min={0}
            max={0.5}
            step={0.01}
            tooltip="Fraction of input material lost as scrap during production"
          />
          {component.manufacturingLossRate > 0 && derived.massRequired > 0 && (
            <div className="text-[11px] text-gray-400 px-0.5">
              Loss: {(component.mass * component.manufacturingLossRate).toFixed(1)} kg
              {' · '}
              Mass required: {derived.massRequired.toFixed(1)} kg
            </div>
          )}
        </div>

        {/* Manufacturing Loss Treatment Chain */}
        <div className="border-t border-gray-100 pt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Manufacturing Loss Treatment
          </div>
          <NumberInput
            label="Collection Rate"
            value={component.manufacturingLossTreatment.collectionRate}
            onChange={(v) => updateChain('manufacturingLossTreatment', { collectionRate: v })}
            min={0}
            max={1}
            step={0.01}
            tooltip="Fraction of manufacturing waste that gets collected for treatment"
          />
          <div className="mt-2">
            <ThreeSegmentSlider
              recycling={component.manufacturingLossTreatment.recyclingRate}
              cascading={component.manufacturingLossTreatment.cascadingRate}
              loss={component.manufacturingLossTreatment.lossRate}
              onChange={(v) => handleChainSliderChange('manufacturingLossTreatment', v)}
            />
          </div>
        </div>

        {/* End of Life Treatment Chain */}
        <div className="border-t border-gray-100 pt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">
            End of Life Treatment
          </div>
          <NumberInput
            label="Collection Rate"
            value={component.eolTreatment.collectionRate}
            onChange={(v) => updateChain('eolTreatment', { collectionRate: v })}
            min={0}
            max={1}
            step={0.01}
            tooltip="Fraction of end-of-life product collected for treatment"
          />
          <div className="mt-2">
            <ThreeSegmentSlider
              recycling={component.eolTreatment.recyclingRate}
              cascading={component.eolTreatment.cascadingRate}
              loss={component.eolTreatment.lossRate}
              onChange={(v) => handleChainSliderChange('eolTreatment', v)}
            />
          </div>
        </div>

        {/* Derived Summary */}
        <div className="border-t border-gray-200 pt-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Derived Metrics
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg px-3 py-2 text-center">
              <div className="text-[11px] text-blue-600 font-medium">Recyclability</div>
              <div className="text-lg font-bold text-blue-700 tabular-nums">
                {(derived.recyclability * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg px-3 py-2 text-center">
              <div className="text-[11px] text-amber-600 font-medium">Cascadability</div>
              <div className="text-lg font-bold text-amber-700 tabular-nums">
                {(derived.cascadability * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-red-50 rounded-lg px-3 py-2 text-center">
              <div className="text-[11px] text-red-600 font-medium">Final Loss</div>
              <div className="text-lg font-bold text-red-700 tabular-nums">
                {(derived.finalLoss * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-gray-400 text-center">
            Mass required: {derived.massRequired.toFixed(1)} kg
            {' · '}
            Effective factor: {(
              component.primaryContent * (1 - derived.recyclability - 0.5 * derived.cascadability) +
              (1 - component.primaryContent) * 0.5 * derived.finalLoss
            ).toFixed(3)}
          </div>
        </div>

        {/* τ Material */}
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Resource Pressure
              </h3>
              <p className="mt-0.5 text-[10px] text-gray-500">
                {derived.massRequired.toFixed(1)} kg / {lifetime}a
              </p>
            </div>
            <span className="font-mono text-lg font-bold text-gray-900">
              {tau.toExponential(3)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
