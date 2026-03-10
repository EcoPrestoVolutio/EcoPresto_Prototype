import { NumberInput } from './NumberInput';
import { SelectInput } from './SelectInput';
import { SliderInput } from './SliderInput';
import { ThreeSegmentSlider } from './ThreeSegmentSlider';
import { ComponentIconPicker } from './ComponentIconPicker';
import type { ComponentItem, ComponentIconId, LossTreatment, TransportModeEntry } from '../../types';

interface ComponentFormProps {
  component: ComponentItem;
  index: number;
  onUpdate: (componentId: string, updates: Partial<ComponentItem>) => void;
  materialOptions: { value: string; label: string }[];
  transportModeOptions: { value: string; label: string }[];
}

export function ComponentForm({
  component,
  index,
  onUpdate,
  materialOptions,
  transportModeOptions,
}: ComponentFormProps) {
  const update = (updates: Partial<ComponentItem>) => {
    onUpdate(component.id, updates);
  };

  const updateTransportMode = (
    modeIndex: number,
    field: keyof TransportModeEntry,
    value: string | number,
  ) => {
    const updatedModes = component.transport.modes.map((mode, i) =>
      i === modeIndex ? { ...mode, [field]: value } : mode,
    );
    update({ transport: { ...component.transport, modes: updatedModes } });
  };

  const addTransportMode = () => {
    const defaultModeId = transportModeOptions[0]?.value ?? '';
    update({
      transport: {
        ...component.transport,
        modes: [...component.transport.modes, { modeId: defaultModeId, share: 0 }],
      },
    });
  };

  const removeTransportMode = (modeIndex: number) => {
    update({
      transport: {
        ...component.transport,
        modes: component.transport.modes.filter((_, i) => i !== modeIndex),
      },
    });
  };

  const handleLossTreatmentChange = (values: LossTreatment) => {
    update({ productionLossTreatment: values });
  };

  const transportShareSum = component.transport.modes.reduce(
    (sum, m) => sum + m.share,
    0,
  );
  const transportShareValid = Math.abs(transportShareSum - 100) < 0.5;

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
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

      <div className="px-5 py-4 space-y-4">
        <SelectInput
          label="Material Type"
          value={component.materialId}
          onChange={(materialId) => update({ materialId })}
          options={materialOptions}
        />

        <NumberInput
          label="Mass"
          value={component.mass}
          onChange={(mass) => update({ mass })}
          unit="kg"
          min={0}
          step={0.1}
        />

        <SliderInput
          label="Primary Material Content"
          value={component.primaryMaterialContent}
          onChange={(primaryMaterialContent) =>
            update({ primaryMaterialContent })
          }
          min={0}
          max={1}
          step={0.01}
          tooltip="Share of primary (non-recycled) material in the total mass of the component"
        />

        <SliderInput
          label="Production Losses"
          value={component.productionLoss}
          onChange={(productionLoss) => update({ productionLoss })}
          min={0}
          max={1}
          step={0.01}
          tooltip="Share of material lost during production as scrap or waste"
        />

        <ThreeSegmentSlider
          recyclingWithoutLoss={
            component.productionLossTreatment.recyclingWithoutLoss
          }
          recyclingWithLoss={
            component.productionLossTreatment.recyclingWithLoss
          }
          disposal={component.productionLossTreatment.disposal}
          onChange={handleLossTreatmentChange}
        />

        <div className="pt-2 border-t border-gray-100">
          <div className="text-sm font-medium text-gray-700 mb-3">
            Transport
          </div>

          <NumberInput
            label="Transport Distance"
            value={component.transport.distance}
            onChange={(distance) =>
              update({ transport: { ...component.transport, distance } })
            }
            unit="km"
            min={0}
            step={1}
          />

          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">
                Transport Mode & Share
              </span>
              <button
                type="button"
                onClick={addTransportMode}
                className="w-6 h-6 flex items-center justify-center text-sm text-gray-500 border border-gray-300 rounded hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                +
              </button>
            </div>

            {component.transport.modes.length === 0 && (
              <p className="text-xs text-gray-400 py-2">
                No transport modes defined. Add one with [+].
              </p>
            )}

            <div className="space-y-2">
              {component.transport.modes.map((mode, modeIndex) => (
                <div
                  key={modeIndex}
                  className="flex items-center gap-2"
                >
                  <select
                    value={mode.modeId}
                    onChange={(e) =>
                      updateTransportMode(modeIndex, 'modeId', e.target.value)
                    }
                    className="flex-1 px-2 py-1.5 text-sm text-gray-900 border border-gray-300 rounded bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  >
                    {transportModeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={mode.share}
                      onChange={(e) =>
                        updateTransportMode(
                          modeIndex,
                          'share',
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      min={0}
                      max={100}
                      className="w-16 px-2 py-1.5 text-right font-mono text-sm text-gray-900 border border-gray-300 rounded bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTransportMode(modeIndex)}
                    className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {component.transport.modes.length > 0 && !transportShareValid && (
              <p className="mt-2 text-xs text-red-500">
                Transport shares sum to {Math.round(transportShareSum)}%
                — must equal 100%.
                {transportShareSum < 100 &&
                  ` Missing: ${Math.round(100 - transportShareSum)}%.`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
