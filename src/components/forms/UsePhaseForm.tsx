import React from 'react';
import { Info } from 'lucide-react';
import { NumberInput } from './NumberInput';

interface UsePhaseFormProps {
  usePhase: { lifetime: number };
  onUpdate: (updates: { lifetime: number }) => void;
}

export function UsePhaseForm({ usePhase, onUpdate }: UsePhaseFormProps) {
  return (
    <section className="bg-white">
      <h2 className="border-b border-gray-200 pb-2 text-lg font-bold text-gray-900">
        Use Phase
      </h2>

      <div className="mt-6 space-y-4">
        <NumberInput
          label="Lifetime"
          value={usePhase.lifetime}
          unit="years"
          min={1}
          max={100}
          step={1}
          onChange={(value) => onUpdate({ lifetime: value })}
        />

        <div className="flex gap-3 rounded-lg bg-blue-50 p-4">
          <Info size={18} className="mt-0.5 shrink-0 text-blue-500" />
          <p className="text-sm leading-relaxed text-blue-800">
            Resource pressure is inversely proportional to lifetime.
            Doubling the lifetime halves the τ value.
          </p>
        </div>
      </div>
    </section>
  );
}
