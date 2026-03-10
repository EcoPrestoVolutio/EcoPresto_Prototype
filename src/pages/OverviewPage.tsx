import { useMemo } from 'react';
import type { Variant, CalculationResult, TauBreakdown } from '../types';
import { useTheme } from '../hooks/useTheme';
import { getSleeperType } from '../data/sleeperTypes';
import { formatTau } from '../utils/formatters';

interface OverviewPageProps {
  variants: Variant[];
  results: Map<string, CalculationResult>;
}

const CHART_COLORS = {
  Material: ['#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#374151'],
  Energy: ['#FDE047', '#FB923C'],
  Transport: '#A855F7',
} as const;

function TauValue({ tau }: { tau: number }) {
  if (tau === 0) return <span className="font-mono tabular-nums">0</span>;
  const exp = Math.floor(Math.log10(Math.abs(tau)));
  const mantissa = (tau / Math.pow(10, exp)).toFixed(2);
  return (
    <span className="font-mono tabular-nums">
      {mantissa} × 10<sup>{exp}</sup>
    </span>
  );
}

function aggregateByCategory(breakdown: TauBreakdown[]): { Material: number; Energy: number; Transport: number } {
  const agg = { Material: 0, Energy: 0, Transport: 0 };
  for (const item of breakdown) {
    agg[item.category] += item.tau;
  }
  return agg;
}

function getCategoryColors(breakdown: TauBreakdown[]): { Material: string[]; Energy: string[]; Transport: string } {
  const materialItems = breakdown.filter(b => b.category === 'Material');
  const energyItems = breakdown.filter(b => b.category === 'Energy');
  const materialColors = materialItems.map((_, i) => CHART_COLORS.Material[i % CHART_COLORS.Material.length]);
  const energyColors = energyItems.map((_, i) => CHART_COLORS.Energy[i % CHART_COLORS.Energy.length]);
  return {
    Material: materialColors.length ? materialColors : [CHART_COLORS.Material[0]],
    Energy: energyColors.length ? energyColors : [CHART_COLORS.Energy[0]],
    Transport: CHART_COLORS.Transport,
  };
}

export function OverviewPage({ variants, results }: OverviewPageProps) {
  const { theme } = useTheme();

  const variantsWithResults = useMemo(() => {
    return variants.filter(v => results.has(v.id));
  }, [variants, results]);

  const chartData = useMemo(() => {
    return variantsWithResults.map(v => {
      const r = results.get(v.id)!;
      const agg = aggregateByCategory(r.breakdown);
      return {
        variant: v,
        result: r,
        materialTau: agg.Material,
        energyTau: agg.Energy,
        transportTau: agg.Transport,
        totalTau: r.totalTau,
      };
    });
  }, [variantsWithResults, results]);

  const maxTau = useMemo(() => {
    if (chartData.length === 0) return 1;
    return Math.max(...chartData.map(d => d.totalTau), 1e-20);
  }, [chartData]);

  const barHeight = 28;
  const barGap = 12;
  const labelWidth = 140;
  const chartWidth = 400;
  const chartHeight = chartData.length * (barHeight + barGap) - barGap;
  const padding = { top: 20, right: 60, bottom: 50, left: labelWidth + 16 };
  const svgWidth = padding.left + chartWidth + padding.right;
  const svgHeight = padding.top + chartHeight + padding.bottom;

  if (variants.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-900 font-medium">No variants defined</p>
        <p className="mt-1 text-sm text-gray-600">
          Add variants in Variant Config to see the comparison.
        </p>
      </div>
    );
  }

  if (variantsWithResults.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-900 font-medium">No calculation results</p>
        <p className="mt-1 text-sm text-gray-600">
          Configure variants and run calculations to see the comparison.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 rounded-lg bg-white p-6 text-gray-900">
      <h1 className="text-xl font-semibold text-gray-900">Variant Comparison</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {variantsWithResults.map(v => {
          const r = results.get(v.id)!;
          const sleeperDef = getSleeperType(v.productInfo.sleeperType);
          return (
            <div
              key={v.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-amber-500/60 hover:shadow-md"
            >
              <h3 className="truncate font-medium text-gray-900">{v.name}</h3>
              <p className="mt-2 text-lg font-mono tabular-nums text-gray-900">
                <TauValue tau={r.totalTau} />
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {sleeperDef?.label ?? v.productInfo.sleeperType}
                </span>
                <span className="text-xs text-gray-600">
                  {v.usePhase.lifetime} years
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Bar Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-sm font-medium text-gray-900">Resource Pressure by Category</h2>
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="min-w-[400px] max-w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* X-axis */}
            <line
              x1={padding.left}
              y1={padding.top + chartHeight}
              x2={padding.left + chartWidth}
              y2={padding.top + chartHeight}
              stroke="#D1D5DB"
              strokeWidth={1}
            />
            {/* Y-axis labels and bars */}
            {chartData.map((d, i) => {
              const y = padding.top + i * (barHeight + barGap) + barHeight / 2;
              const barY = padding.top + i * (barHeight + barGap);
              const transportW = (d.transportTau / maxTau) * chartWidth;
              const colors = getCategoryColors(d.result.breakdown);
              let xOffset = padding.left;

              return (
                <g key={d.variant.id}>
                  <text
                    x={padding.left - 8}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="fill-gray-900 text-xs"
                    style={{ fontSize: 11, fill: '#111827' }}
                  >
                    {d.variant.name}
                  </text>
                  {/* Material segments */}
                  {colors.Material.map((color, idx) => {
                    const materialItems = d.result.breakdown.filter(b => b.category === 'Material');
                    const item = materialItems[idx];
                    const w = item ? (item.tau / maxTau) * chartWidth : 0;
                    if (w <= 0) return null;
                    const x = xOffset;
                    xOffset += w;
                    return (
                      <rect
                        key={`material-${idx}`}
                        x={x}
                        y={barY}
                        width={w}
                        height={barHeight}
                        fill={color}
                        rx={0}
                      />
                    );
                  })}
                  {/* Energy segments */}
                  {colors.Energy.map((color, idx) => {
                    const energyItems = d.result.breakdown.filter(b => b.category === 'Energy');
                    const item = energyItems[idx];
                    const w = item ? (item.tau / maxTau) * chartWidth : 0;
                    if (w <= 0) return null;
                    const x = xOffset;
                    xOffset += w;
                    return (
                      <rect
                        key={`energy-${idx}`}
                        x={x}
                        y={barY}
                        width={w}
                        height={barHeight}
                        fill={color}
                        rx={0}
                      />
                    );
                  })}
                  {/* Transport */}
                  {d.transportTau > 0 && (
                    <rect
                      x={xOffset}
                      y={barY}
                      width={transportW}
                      height={barHeight}
                      fill={colors.Transport}
                      rx={0}
                    />
                  )}
                </g>
              );
            })}
            {/* X-axis ticks */}
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const x = padding.left + t * chartWidth;
              const val = maxTau * t;
              const label = formatTau(val);
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={padding.top + chartHeight}
                    x2={x}
                    y2={padding.top + chartHeight + 4}
                    stroke="#D1D5DB"
                    strokeWidth={1}
                  />
                  <text
                    x={x}
                    y={padding.top + chartHeight + 18}
                    textAnchor="middle"
                    style={{ fontSize: 9, fill: '#374151' }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex gap-1">
              {CHART_COLORS.Material.slice(0, 2).map((c, i) => (
                <span key={i} className="h-3 w-3 rounded-sm" style={{ backgroundColor: c }} />
              ))}
            </span>
            <span className="text-xs text-gray-900">Material</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex gap-1">
              {CHART_COLORS.Energy.map((c, i) => (
                <span key={i} className="h-3 w-3 rounded-sm" style={{ backgroundColor: c }} />
              ))}
            </span>
            <span className="text-xs text-gray-900">Energy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: CHART_COLORS.Transport }} />
            <span className="text-xs text-gray-900">Transport</span>
          </div>
        </div>
      </div>

      {/* Details Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[500px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gray-900">Metric</th>
              {variantsWithResults.map(v => (
                <th key={v.id} className="px-4 py-3 text-right font-medium text-gray-900">
                  {v.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { key: 'totalTau', label: 'Total τ' },
              { key: 'materialTau', label: 'Material τ' },
              { key: 'energyTau', label: 'Energy τ' },
              { key: 'transportTau', label: 'Transport τ' },
            ].map((row, rowIdx) => (
              <tr
                key={row.key}
                className={`border-b border-gray-100 ${
                  rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="px-4 py-2.5 font-medium text-gray-900">{row.label}</td>
                {variantsWithResults.map(v => {
                  const r = results.get(v.id)!;
                  const agg = aggregateByCategory(r.breakdown);
                  const val =
                    row.key === 'totalTau'
                      ? r.totalTau
                      : row.key === 'materialTau'
                        ? agg.Material
                        : row.key === 'energyTau'
                          ? agg.Energy
                          : agg.Transport;
                  return (
                    <td key={v.id} className="px-4 py-2.5 text-right text-gray-900">
                      <TauValue tau={val} />
                    </td>
                  );
                })}
              </tr>
            ))}
            {[
              { key: 'lifetime', label: 'Lifetime (years)' },
              { key: 'totalWeight', label: 'Total Weight (kg)' },
              { key: 'componentCount', label: 'Component Count' },
            ].map((row, rowIdx) => (
              <tr
                key={row.key}
                className={`border-b border-gray-100 ${
                  (rowIdx + 4) % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="px-4 py-2.5 font-medium text-gray-900">{row.label}</td>
                {variantsWithResults.map(v => {
                  const val =
                    row.key === 'lifetime'
                      ? v.usePhase.lifetime
                      : row.key === 'totalWeight'
                        ? v.productInfo.totalWeight
                        : v.productInfo.componentCount;
                  return (
                    <td key={v.id} className="px-4 py-2.5 text-right font-mono tabular-nums text-gray-900">
                      {typeof val === 'number' ? val.toLocaleString('en-US') : val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
