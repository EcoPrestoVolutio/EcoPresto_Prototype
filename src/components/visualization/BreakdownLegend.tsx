import type { TauBreakdown } from '../../types';
import { formatTau } from '../../utils/formatters';
import { useTheme } from '../../hooks/useTheme';

interface BreakdownLegendProps {
  breakdown: TauBreakdown[];
}

export function BreakdownLegend({ breakdown }: BreakdownLegendProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div>
      {breakdown.map((item) => (
        <div
          key={`${item.category}-${item.name}`}
          className="flex items-center gap-2 py-1"
        >
          <span
            className="h-4 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className={`flex-1 truncate text-xs ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
            {item.name}
          </span>
          <span className={`font-mono text-xs tabular-nums ${dark ? 'text-white' : 'text-gray-900'}`}>
            {formatTau(item.tau)}
          </span>
          <span className={`w-10 text-right font-mono text-xs tabular-nums ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            {item.percentage.toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
}
