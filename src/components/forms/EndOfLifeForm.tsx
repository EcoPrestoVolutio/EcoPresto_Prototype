import { NumberInput } from './NumberInput';
import { SelectInput } from './SelectInput';
import type { EndOfLife } from '../../types';

interface EndOfLifeFormProps {
  endOfLife: EndOfLife;
  onUpdate: (updates: Partial<EndOfLife>) => void;
  transportModeOptions: { value: string; label: string }[];
}

const SCENARIO_OPTIONS = [
  { value: 'recycling', label: 'Recycling' },
  { value: 'cascading', label: 'Cascading' },
  { value: 'disposal', label: 'Disposal' },
];

export function EndOfLifeForm({
  endOfLife,
  onUpdate,
  transportModeOptions,
}: EndOfLifeFormProps) {
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
            onUpdate({ scenario: scenario as EndOfLife['scenario'] })
          }
        />

        <NumberInput
          label="Transport Distance"
          value={endOfLife.transport.distance}
          unit="km"
          min={0}
          step={1}
          onChange={(distance) =>
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

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">
          Per-component recycling, cascading, and loss rates are now configured directly
          on each component's form under "End of Life Treatment".
        </p>
      </div>
    </section>
  );
}
