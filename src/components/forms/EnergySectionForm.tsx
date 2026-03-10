import { NumberInput } from './NumberInput';
import { SelectInput } from './SelectInput';

interface EnergySectionFormProps {
  title: string; // "Electricity" or "Heat"
  consumption: number;
  mixId: string;
  mixOptions: { value: string; label: string }[];
  consumptionUnit?: string; // default "kWh"
  onConsumptionChange: (value: number) => void;
  onMixChange: (mixId: string) => void;
}

export function EnergySectionForm({
  title,
  consumption,
  mixId,
  mixOptions,
  consumptionUnit = 'kWh',
  onConsumptionChange,
  onMixChange,
}: EnergySectionFormProps) {
  return (
    <section className="bg-white">
      <h2 className="border-b border-gray-200 pb-2 text-lg font-bold text-gray-900">
        {title}
      </h2>

      <div className="mt-6 space-y-4">
        <NumberInput
          label="Consumption"
          value={consumption}
          unit={consumptionUnit}
          onChange={onConsumptionChange}
        />
        <SelectInput
          label="Mix"
          value={mixId}
          options={mixOptions}
          onChange={onMixChange}
        />
      </div>
    </section>
  );
}
