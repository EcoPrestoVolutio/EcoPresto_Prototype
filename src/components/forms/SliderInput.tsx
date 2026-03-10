import { useState, useMemo } from 'react';
import { Info } from 'lucide-react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatDisplay?: (v: number) => string;
  tooltip?: string;
}

export function SliderInput({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  formatDisplay,
  tooltip,
}: SliderInputProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const displayValue = useMemo(() => {
    if (formatDisplay) return formatDisplay(value);
    return `${Math.round(value * 100)}%`;
  }, [value, formatDisplay]);

  const filledPercent = ((value - min) / (max - min)) * 100;

  const trackStyle = useMemo(
    () => ({
      background: `linear-gradient(to right, #F59E0B ${filledPercent}%, #E5E7EB ${filledPercent}%)`,
    }),
    [filledPercent],
  );

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-2">
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
        <span className="text-sm font-mono text-gray-900 tabular-nums">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={trackStyle}
        className="slider-track w-full h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-grab [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-grab"
      />
    </div>
  );
}
