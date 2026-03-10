import { useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { CalculationResult } from '../../types';
import { formatTau } from '../../utils/formatters';

interface ResultsChartProps {
  variants: { id: string; name: string }[];
  results: Map<string, CalculationResult>;
}

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
}

function TooltipContent({ payload, label }: { payload: TooltipEntry[]; label: string }) {
  const tauSum = payload.reduce((sum, e) => sum + (e.value || 0), 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-xl text-gray-900 w-max">
      <p className="mb-1 font-semibold">{label}</p>
      <p className="mb-2 font-mono tabular-nums text-gray-500">
        τ = {formatTau(tauSum)}
      </p>
      <div className="space-y-0.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 whitespace-nowrap">{entry.name}</span>
            <span className="ml-auto font-mono tabular-nums text-gray-900 whitespace-nowrap">
              {formatTau(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResultsChart({ variants, results }: ResultsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const { chartData, breakdownKeys, colorMap } = useMemo(() => {
    const keys = new Set<string>();
    const colors: Record<string, string> = {};

    const data = variants
      .filter((v) => results.has(v.id))
      .map((v) => {
        const result = results.get(v.id)!;
        const row: Record<string, string | number> = { name: v.name };
        for (const item of result.breakdown) {
          row[item.name] = item.tau;
          keys.add(item.name);
          colors[item.name] = item.color;
        }
        return row;
      });

    return { chartData: data, breakdownKeys: Array.from(keys), colorMap: colors };
  }, [variants, results]);

  const hasData =
    chartData.length > 0 &&
    chartData.some((row) =>
      Object.entries(row).some(([k, v]) => k !== 'name' && typeof v === 'number' && v > 0),
    );

  if (!hasData) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-200 text-xs text-gray-400">
        Configure variants to see comparison
      </div>
    );
  }

  const barHeight = Math.max(36, chartData.length * 50);

  return (
    <div ref={chartRef} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-100">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Comparison
        </h3>
      </div>
      <div className="px-2 py-3">
        <ResponsiveContainer width="100%" height={barHeight}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
            barCategoryGap="20%"
          >
            <XAxis
              type="number"
              tickFormatter={(v: number) => formatTau(v)}
              tick={{ fill: '#9CA3AF', fontSize: 8 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              content={({ active, payload, label, coordinate }: any) => {
                if (!active || !payload?.length || !chartRef.current) return null;

                const rect = chartRef.current.getBoundingClientRect();
                const left = rect.left + (coordinate?.x ?? 0) + 12;
                const top = rect.top + (coordinate?.y ?? 0);

                const entries: TooltipEntry[] = payload.map((p: any) => ({
                  name: p.name ?? p.dataKey ?? '',
                  value: p.value ?? 0,
                  color: p.fill ?? p.color ?? '#888',
                }));

                return createPortal(
                  <div
                    style={{
                      position: 'fixed',
                      left,
                      top,
                      transform: 'translateY(-50%)',
                      zIndex: 9999,
                      pointerEvents: 'none',
                    }}
                  >
                    <TooltipContent payload={entries} label={String(label ?? '')} />
                  </div>,
                  document.body,
                );
              }}
            />
            {breakdownKeys.map((key) => (
              <Bar key={key} dataKey={key} stackId="tau" fill={colorMap[key]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
