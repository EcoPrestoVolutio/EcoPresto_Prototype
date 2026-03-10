import { useState, useRef } from 'react';
import { Info } from 'lucide-react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 1,
  tooltip,
}: NumberInputProps) {
  const [localValue, setLocalValue] = useState(String(value));
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const clamp = (v: number): number => {
    let clamped = v;
    if (min !== undefined) clamped = Math.max(min, clamped);
    if (max !== undefined) clamped = Math.min(max, clamped);
    return clamped;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    const parsed = parseFloat(localValue);
    if (isNaN(parsed)) {
      setLocalValue(String(value));
      return;
    }
    const clamped = clamp(parsed);
    setLocalValue(String(clamped));
    onChange(clamped);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div className="flex items-center gap-1.5 text-sm text-gray-700">
        <span>{label}</span>
        {tooltip && (
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
            {showTooltip && (
                <div className="absolute bottom-full left-0 mb-2 px-3 py-2 text-xs text-white bg-gray-800 rounded shadow-lg z-50 w-56">
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="number"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          step={step}
          min={min}
          max={max}
          className="w-24 px-2 py-1.5 text-right font-mono text-sm text-gray-900 border border-gray-300 rounded bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
        {unit && (
          <span className="text-sm text-gray-500 min-w-[2rem]">{unit}</span>
        )}
      </div>
    </div>
  );
}
