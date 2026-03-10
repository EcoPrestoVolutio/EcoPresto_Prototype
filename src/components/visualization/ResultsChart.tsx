import { useMemo } from 'react';
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
import { useTheme } from '../../hooks/useTheme';

interface ResultsChartProps {
  variants: { id: string; name: string }[];
  results: Map<string, CalculationResult>;
}

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const tauSum = payload.reduce((sum, e) => sum + (e.value || 0), 0);

  return (
    <div className="rounded border border-gray-200 bg-white p-3 text-xs shadow-lg text-gray-900">
      <p className="mb-1 font-medium">{label}</p>
      <p className="mb-2 font-mono tabular-nums text-gray-500">
        τ total: {formatTau(tauSum)}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}</span>
          <span className="ml-auto font-mono tabular-nums text-gray-900">
            {formatTau(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ResultsChart({ variants, results }: ResultsChartProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

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

  const textColor = dark ? '#ffffff' : '#374151';
  const axisColor = dark ? '#4B5563' : '#D1D5DB';

  if (!hasData) {
    return (
      <div className={`flex h-[300px] items-center justify-center text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
        Configure variants to see comparison
      </div>
    );
  }

  return (
    <div>
      <h3 className={`mb-2 text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
        Resource Pressure Comparison
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 12, bottom: 4, left: 4 }}
        >
          <XAxis
            type="number"
            tickFormatter={(v: number) => formatTau(v)}
            tick={{ fill: textColor, fontSize: 9 }}
            axisLine={{ stroke: axisColor }}
            tickLine={{ stroke: axisColor }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: axisColor }}
            tickLine={false}
            width={100}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
          />
          {breakdownKeys.map((key) => (
            <Bar key={key} dataKey={key} stackId="tau" fill={colorMap[key]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
