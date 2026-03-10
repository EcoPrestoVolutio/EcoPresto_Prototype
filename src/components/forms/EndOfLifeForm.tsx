import React from 'react';
import { NumberInput } from './NumberInput';
import { SelectInput } from './SelectInput';

interface EndOfLifeFormProps {
  endOfLife: {
    scenario: 'recycling' | 'cascading' | 'disposal';
    transport: { distance: number; modes: { modeId: string; share: number }[] };
    materialRecycling: {
      componentId: string;
      recyclingWithoutLoss: number;
      recyclingWithLoss: number;
      disposal: number;
    }[];
  };
  components: { id: string; name: string }[];
  onUpdate: (updates: Partial<EndOfLifeFormProps['endOfLife']>) => void;
  transportModeOptions: { value: string; label: string }[];
}

const SCENARIO_OPTIONS = [
  { value: 'recycling', label: 'Recycling' },
  { value: 'cascading', label: 'Cascading' },
  { value: 'disposal', label: 'Disposal' },
];

function getRecyclingEntry(
  materialRecycling: EndOfLifeFormProps['endOfLife']['materialRecycling'],
  componentId: string,
) {
  return (
    materialRecycling.find((entry) => entry.componentId === componentId) ?? {
      componentId,
      recyclingWithoutLoss: 0,
      recyclingWithLoss: 0,
      disposal: 100,
    }
  );
}

export function EndOfLifeForm({
  endOfLife,
  components,
  onUpdate,
  transportModeOptions,
}: EndOfLifeFormProps) {
  function updateMaterialRecycling(
    componentId: string,
    field: 'recyclingWithoutLoss' | 'recyclingWithLoss',
    value: number,
  ) {
    const existing = getRecyclingEntry(endOfLife.materialRecycling, componentId);
    const updated = { ...existing, [field]: value };
    updated.disposal = Math.max(0, 100 - updated.recyclingWithoutLoss - updated.recyclingWithLoss);

    const newEntries = endOfLife.materialRecycling.some((e) => e.componentId === componentId)
      ? endOfLife.materialRecycling.map((e) => (e.componentId === componentId ? updated : e))
      : [...endOfLife.materialRecycling, updated];

    onUpdate({ materialRecycling: newEntries });
  }

  return (
    <section className="bg-white">
      <h2 className="border-b border-gray-200 pb-2 text-lg font-bold text-gray-900">
        End of Life
      </h2>

      <div className="mt-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Dismantling &amp; Transport</h3>

        <SelectInput
          label="Scenario"
          value={endOfLife.scenario}
          options={SCENARIO_OPTIONS}
          onChange={(scenario) =>
            onUpdate({ scenario: scenario as EndOfLifeFormProps['endOfLife']['scenario'] })
          }
        />

        <NumberInput
          label="Transport Distance"
          value={endOfLife.transport.distance}
          unit="km"
          min={0}
          step={1}
          onBlur={(distance) =>
            onUpdate({ transport: { ...endOfLife.transport, distance } })
          }
        />

        <SelectInput
          label="Transport Mode"
          value={endOfLife.transport.modes[0]?.modeId ?? ''}
          options={transportModeOptions}
          onChange={(modeId) =>
            onUpdate({
              transport: {
                ...endOfLife.transport,
                modes: [{ modeId, share: 1 }],
              },
            })
          }
        />
      </div>

      <hr className="my-6 border-gray-200" />

      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-gray-700">
          Material Recovery
        </h3>

        {components.map((component) => {
          const entry = getRecyclingEntry(endOfLife.materialRecycling, component.id);
          const withoutLoss = entry.recyclingWithoutLoss;
          const withLoss = entry.recyclingWithLoss;
          const disposal = entry.disposal;

          return (
            <div key={component.id} className="space-y-3">
              <span className="block text-sm font-bold text-gray-800">
                {component.name}
              </span>

              <div className="flex h-3 w-full overflow-hidden rounded-full">
                <div
                  className="bg-blue-500 transition-all"
                  style={{ width: `${withoutLoss}%` }}
                />
                <div
                  className="bg-amber-400 transition-all"
                  style={{ width: `${withLoss}%` }}
                />
                <div
                  className="bg-red-500 transition-all"
                  style={{ width: `${disposal}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <NumberInput
                  label="Recycling w/o loss"
                  value={withoutLoss}
                  unit="%"
                  min={0}
                  max={100}
                  step={1}
                  onBlur={(v) => updateMaterialRecycling(component.id, 'recyclingWithoutLoss', v)}
                />
                <NumberInput
                  label="Recycling w/ loss"
                  value={withLoss}
                  unit="%"
                  min={0}
                  max={100}
                  step={1}
                  onBlur={(v) => updateMaterialRecycling(component.id, 'recyclingWithLoss', v)}
                />
                <NumberInput
                  label="Disposal"
                  value={disposal}
                  unit="%"
                  disabled
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
