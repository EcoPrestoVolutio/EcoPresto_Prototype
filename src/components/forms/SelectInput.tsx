import { useState } from 'react';
import { Info } from 'lucide-react';

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  tooltip?: string;
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
  tooltip,
}: SelectInputProps) {
  const [showTooltip, setShowTooltip] = useState(false);

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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1.5 text-sm text-gray-900 border border-gray-300 rounded bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
