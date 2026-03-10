import type { TauBreakdown } from '../../types';
import { formatTau } from '../../utils/formatters';

interface BreakdownLegendProps {
  breakdown: TauBreakdown[];
}

export function BreakdownLegend({ breakdown }: BreakdownLegendProps) {
  const maxTau = Math.max(...breakdown.map(b => b.tau), 1e-30);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-100">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Breakdown
        </h3>
      </div>
      <div className="divide-y divide-gray-50">
        {breakdown.map((item) => {
          const barPct = maxTau > 0 ? (item.tau / maxTau) * 100 : 0;
          return (
            <div key={`${item.category}-${item.name}`} className="group relative px-4 py-2 hover:bg-gray-50/70 transition-colors">
              <div
                className="absolute inset-y-0 left-0 opacity-[0.06]"
                style={{ width: `${barPct}%`, backgroundColor: item.color }}
              />
              <div className="relative flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                  style={{ backgroundColor: item.color }}
                />
                <span className="flex-1 truncate text-xs font-medium text-gray-700">
                  {item.name}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-gray-900 font-semibold">
                  {formatTau(item.tau)}
                </span>
                <span className="w-9 text-right font-mono text-[10px] tabular-nums text-gray-400">
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
