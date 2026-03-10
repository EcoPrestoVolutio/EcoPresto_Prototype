import React from 'react';
import { NumberInput } from './NumberInput';
import { SelectInput } from './SelectInput';

interface ManufacturingFormProps {
  manufacturing: {
    electricity: { consumption: number; mixId: string };
    heat: { consumption: number; mixId: string };
  };
  onUpdate: (updates: Partial<ManufacturingFormProps['manufacturing']>) => void;
  electricityMixOptions: { value: string; label: string }[];
  heatMixOptions: { value: string; label: string }[];
}

export function ManufacturingForm({
  manufacturing,
  onUpdate,
  electricityMixOptions,
  heatMixOptions,
}: ManufacturingFormProps) {
  return (
    <section className="bg-white">
      <h2 className="border-b border-gray-200 pb-2 text-lg font-bold text-gray-900">
        Manufacturing
      </h2>

      <div className="mt-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Electricity Consumption</h3>

        <NumberInput
          label="Energy per unit"
          value={manufacturing.electricity.consumption}
          unit="kWh"
          min={0}
          step={0.1}
          onBlur={(value) =>
            onUpdate({
              electricity: { ...manufacturing.electricity, consumption: value },
            })
          }
        />

        <SelectInput
          label="Energy Source"
          value={manufacturing.electricity.mixId}
          options={electricityMixOptions}
          onChange={(mixId) =>
            onUpdate({
              electricity: { ...manufacturing.electricity, mixId },
            })
          }
        />
      </div>

      <hr className="my-6 border-gray-200" />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Heat Consumption</h3>

        <NumberInput
          label="Energy per unit"
          value={manufacturing.heat.consumption}
          unit="kWh"
          min={0}
          step={0.1}
          onBlur={(value) =>
            onUpdate({
              heat: { ...manufacturing.heat, consumption: value },
            })
          }
        />

        <SelectInput
          label="Heat Source"
          value={manufacturing.heat.mixId}
          options={heatMixOptions}
          onChange={(mixId) =>
            onUpdate({
              heat: { ...manufacturing.heat, mixId },
            })
          }
        />
      </div>
    </section>
  );
}
