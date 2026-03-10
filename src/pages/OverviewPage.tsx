import { useMemo, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { Variant, CalculationResult, TauBreakdown } from '../types';
import { getSleeperType } from '../data/sleeperTypes';
import { formatTau, formatNumber } from '../utils/formatters';

interface OverviewPageProps {
  variants: Variant[];
  results: Map<string, CalculationResult>;
}

type DataRow = {
  variant: Variant;
  result: CalculationResult;
  agg: { Material: number; Energy: number; Transport: number };
  sleeper: ReturnType<typeof getSleeperType>;
  energyDetail: { electricity: number; heat: number };
};

const CAT_COLORS = {
  Material: '#4B5563',
  Electricity: '#FACC15',
  Heat: '#FB923C',
  Transport: '#A855F7',
} as const;

const MATERIAL_PALETTE = ['#1F2937', '#374151', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB'];

function aggregateByCategory(breakdown: TauBreakdown[]) {
  const agg = { Material: 0, Energy: 0, Transport: 0 };
  for (const item of breakdown) agg[item.category] += item.tau;
  return agg;
}

function getEnergyDetail(breakdown: TauBreakdown[]) {
  const electricity = breakdown.find(b => b.name === 'Electricity')?.tau ?? 0;
  const heat = breakdown.find(b => b.name === 'Heat')?.tau ?? 0;
  return { electricity, heat };
}

function TauMono({ tau, className = '' }: { tau: number; className?: string }) {
  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {tau === 0 ? '0' : formatTau(tau)}
    </span>
  );
}

function getItemColor(item: TauBreakdown, idx: number): string {
  if (item.category === 'Energy') {
    return item.name === 'Heat' ? CAT_COLORS.Heat : CAT_COLORS.Electricity;
  }
  if (item.category === 'Transport') return CAT_COLORS.Transport;
  return MATERIAL_PALETTE[idx % MATERIAL_PALETTE.length];
}

// ─── Vertical Stacked Bar Chart ─────────────────────────────────────────────

const CHART_TOP = 24;
const CHART_HEIGHT = 260;
const LABEL_AREA = 56;
const VB_WIDTH = 700;
const LEFT_PAD = 110;

interface BarTooltipData {
  variantName: string;
  totalTau: number;
  segments: { label: string; tau: number; color: string; pct: number }[];
  x: number;
  y: number;
}

function StackedBarChart({
  data,
  maxTau,
  bestIdx,
  onBarClick,
  selectedId,
}: {
  data: DataRow[];
  maxTau: number;
  bestIdx: number;
  onBarClick: (id: string) => void;
  selectedId: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<BarTooltipData | null>(null);

  const usableWidth = VB_WIDTH - LEFT_PAD - 20;
  const slotWidth = usableWidth / data.length;
  const barWidth = Math.min(56, Math.max(28, slotWidth * 0.55));
  const totalHeight = CHART_TOP + CHART_HEIGHT + LABEL_AREA;

  const yTicks = useMemo(() => {
    const count = 5;
    return Array.from({ length: count }, (_, i) => {
      const frac = i / (count - 1);
      return { frac, val: maxTau * frac };
    });
  }, [maxTau]);

  const handleBarEnter = useCallback((d: DataRow, barCenterVB: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const svgScale = rect.width / VB_WIDTH;
    const segments = [
      { label: 'Material', tau: d.agg.Material, color: CAT_COLORS.Material, pct: d.result.totalTau > 0 ? (d.agg.Material / d.result.totalTau) * 100 : 0 },
      { label: 'Electricity', tau: d.energyDetail.electricity, color: CAT_COLORS.Electricity, pct: d.result.totalTau > 0 ? (d.energyDetail.electricity / d.result.totalTau) * 100 : 0 },
      { label: 'Heat', tau: d.energyDetail.heat, color: CAT_COLORS.Heat, pct: d.result.totalTau > 0 ? (d.energyDetail.heat / d.result.totalTau) * 100 : 0 },
      { label: 'Transport', tau: d.agg.Transport, color: CAT_COLORS.Transport, pct: d.result.totalTau > 0 ? (d.agg.Transport / d.result.totalTau) * 100 : 0 },
    ].filter(s => s.tau > 0);

    setTip({
      variantName: d.variant.name,
      totalTau: d.result.totalTau,
      segments,
      x: rect.left + barCenterVB * svgScale,
      y: rect.top + CHART_TOP * svgScale,
    });
  }, []);

  const handleBarLeave = useCallback(() => setTip(null), []);

  return (
    <>
      <div ref={containerRef}>
        <svg
          width="100%"
          viewBox={`0 0 ${VB_WIDTH} ${totalHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="select-none"
        >
          {/* Y-axis grid lines and tick labels */}
          {yTicks.map(t => {
            const y = CHART_TOP + CHART_HEIGHT - t.frac * CHART_HEIGHT;
            return (
              <g key={t.frac}>
                <line x1={LEFT_PAD} y1={y} x2={VB_WIDTH - 10} y2={y} stroke="#F3F4F6" strokeWidth={1} />
                <text x={LEFT_PAD - 8} y={y + 3} textAnchor="end" fontSize={9} fill="#9CA3AF" fontFamily="ui-monospace, monospace">
                  {t.val === 0 ? '0' : formatTau(t.val)}
                </text>
              </g>
            );
          })}

          {/* Baseline */}
          <line x1={LEFT_PAD} y1={CHART_TOP + CHART_HEIGHT} x2={VB_WIDTH - 10} y2={CHART_TOP + CHART_HEIGHT} stroke="#E5E7EB" strokeWidth={1} />

          {/* Bars */}
          {data.map((d, i) => {
            const x = LEFT_PAD + i * slotWidth + (slotWidth - barWidth) / 2;
            const cx = x + barWidth / 2;
            const totalH = maxTau > 0 ? (d.result.totalTau / maxTau) * CHART_HEIGHT : 0;
            const isBest = i === bestIdx;
            const isSelected = d.variant.id === selectedId;

            const matH = maxTau > 0 ? (d.agg.Material / maxTau) * CHART_HEIGHT : 0;
            const elecH = maxTau > 0 ? (d.energyDetail.electricity / maxTau) * CHART_HEIGHT : 0;
            const heatH = maxTau > 0 ? (d.energyDetail.heat / maxTau) * CHART_HEIGHT : 0;
            const transH = maxTau > 0 ? (d.agg.Transport / maxTau) * CHART_HEIGHT : 0;

            const baseY = CHART_TOP + CHART_HEIGHT;
            let cy = baseY;
            const segs = [
              { h: matH, color: CAT_COLORS.Material },
              { h: elecH, color: CAT_COLORS.Electricity },
              { h: heatH, color: CAT_COLORS.Heat },
              { h: transH, color: CAT_COLORS.Transport },
            ];

            return (
              <g
                key={d.variant.id}
                className="cursor-pointer"
                onClick={() => onBarClick(d.variant.id)}
                onMouseEnter={() => handleBarEnter(d, cx)}
                onMouseLeave={handleBarLeave}
              >
                {/* Hover/selection highlight */}
                <rect
                  x={x - 6}
                  y={CHART_TOP - 4}
                  width={barWidth + 12}
                  height={CHART_HEIGHT + LABEL_AREA + 8}
                  rx={6}
                  fill={isSelected ? 'rgba(245, 158, 11, 0.06)' : 'transparent'}
                  className="transition-colors hover:fill-[rgba(0,0,0,0.02)]"
                />

                {/* Stacked segments */}
                {segs.map((seg, si) => {
                  if (seg.h <= 0) return null;
                  cy -= seg.h;
                  const segY = cy;
                  const isTop = si === segs.length - 1 - [...segs].reverse().findIndex(s => s.h > 0);
                  return (
                    <rect
                      key={si}
                      x={x}
                      y={segY}
                      width={barWidth}
                      height={seg.h}
                      fill={seg.color}
                      rx={isTop ? 4 : 0}
                      ry={isTop ? 4 : 0}
                    />
                  );
                })}

                {/* Best indicator */}
                {isBest && totalH > 0 && (
                  <circle cx={cx} cy={baseY - totalH - 12} r={3.5} fill="#22C55E" />
                )}

                {/* Selection ring */}
                {isSelected && totalH > 0 && (
                  <rect
                    x={x - 2}
                    y={baseY - totalH - 2}
                    width={barWidth + 4}
                    height={totalH + 4}
                    rx={5}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                  />
                )}

                {/* Variant name label */}
                <text
                  x={cx}
                  y={baseY + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={isSelected ? 700 : 500}
                  fill={isSelected ? '#B45309' : isBest ? '#15803D' : '#374151'}
                >
                  {d.variant.name}
                </text>
                {/* Sub-label */}
                <text
                  x={cx}
                  y={baseY + 30}
                  textAnchor="middle"
                  fontSize={8}
                  fill="#9CA3AF"
                >
                  {d.variant.usePhase.lifetime}y · {formatNumber(d.variant.productInfo.totalWeight, 0)} kg
                </text>

                {/* Tau value above bar */}
                {totalH > 0 && (
                  <text
                    x={cx}
                    y={baseY - totalH - (isBest ? 20 : 6)}
                    textAnchor="middle"
                    fontSize={9}
                    fontFamily="ui-monospace, monospace"
                    fontWeight={600}
                    fill="#374151"
                  >
                    {formatTau(d.result.totalTau)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Portal tooltip */}
      {tip && createPortal(
        <div
          style={{
            position: 'fixed',
            left: tip.x,
            top: tip.y - 8,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <div className="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-xs shadow-xl text-gray-900 w-max">
            <p className="font-semibold mb-1">{tip.variantName}</p>
            <p className="font-mono tabular-nums text-gray-500 mb-2">τ = {formatTau(tip.totalTau)}</p>
            <div className="space-y-1">
              {tip.segments.map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-gray-600">{s.label}</span>
                  <span className="ml-auto font-mono tabular-nums text-gray-900 whitespace-nowrap">{formatTau(s.tau)}</span>
                  <span className="text-gray-400 w-8 text-right font-mono tabular-nums">{s.pct.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

// ─── Drill-Down Detail Panel ────────────────────────────────────────────────

function DrillDownPanel({ d, onClose }: { d: DataRow; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [detailTip, setDetailTip] = useState<{ label: string; tau: number; pct: number; color: string; x: number; y: number } | null>(null);

  const items = useMemo(() => {
    return d.result.breakdown.map((b, i) => ({
      label: b.name,
      tau: b.tau,
      pct: b.percentage,
      color: getItemColor(b, i),
    })).filter(it => it.tau > 0);
  }, [d]);

  const maxItemTau = Math.max(...items.map(it => it.tau), 1e-30);
  const DD_VB = 700;
  const DD_LEFT = 100;
  const chartH = 200;
  const ddTop = 16;
  const labelArea = 50;
  const ddUsable = DD_VB - DD_LEFT - 20;
  const ddSlot = ddUsable / Math.max(items.length, 1);
  const ddBarW = Math.min(44, Math.max(24, ddSlot * 0.55));

  const yTicks = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const frac = i / 4;
      return { frac, val: maxItemTau * frac };
    });
  }, [maxItemTau]);

  const handleEnter = useCallback((item: typeof items[0], barCenterVB: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scale = rect.width / DD_VB;
    setDetailTip({
      ...item,
      x: rect.left + barCenterVB * scale,
      y: rect.top + ddTop * scale,
    });
  }, []);

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-amber-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{d.variant.name}</h3>
          <p className="text-[10px] text-gray-500 font-mono tabular-nums mt-0.5">
            τ total = {formatTau(d.result.totalTau)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div ref={containerRef} className="p-5">
        <svg
          width="100%"
          viewBox={`0 0 ${DD_VB} ${ddTop + chartH + labelArea}`}
          preserveAspectRatio="xMidYMid meet"
          className="select-none"
        >
          {yTicks.map(t => {
            const y = ddTop + chartH - t.frac * chartH;
            return (
              <g key={t.frac}>
                <line x1={DD_LEFT} y1={y} x2={DD_VB - 10} y2={y} stroke="#FDE68A" strokeWidth={1} strokeOpacity={0.5} />
                <text x={DD_LEFT - 8} y={y + 3} textAnchor="end" fontSize={9} fill="#9CA3AF" fontFamily="ui-monospace, monospace">
                  {t.val === 0 ? '0' : formatTau(t.val)}
                </text>
              </g>
            );
          })}

          <line x1={DD_LEFT} y1={ddTop + chartH} x2={DD_VB - 10} y2={ddTop + chartH} stroke="#E5E7EB" strokeWidth={1} />

          {items.map((item, i) => {
            const x = DD_LEFT + i * ddSlot + (ddSlot - ddBarW) / 2;
            const cx = x + ddBarW / 2;
            const h = maxItemTau > 0 ? (item.tau / maxItemTau) * chartH : 0;
            const baseY = ddTop + chartH;

            return (
              <g
                key={item.label}
                onMouseEnter={() => handleEnter(item, cx)}
                onMouseLeave={() => setDetailTip(null)}
              >
                <rect x={x} y={baseY - h} width={ddBarW} height={h} fill={item.color} rx={3} ry={3} />

                {h > 0 && (
                  <text
                    x={cx}
                    y={baseY - h - 5}
                    textAnchor="middle"
                    fontSize={8}
                    fontFamily="ui-monospace, monospace"
                    fontWeight={600}
                    fill="#374151"
                  >
                    {item.pct.toFixed(0)}%
                  </text>
                )}

                <text
                  x={cx}
                  y={baseY + 14}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={500}
                  fill="#374151"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {detailTip && createPortal(
        <div
          style={{
            position: 'fixed',
            left: detailTip.x,
            top: detailTip.y - 8,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-xl text-gray-900 w-max">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: detailTip.color }} />
              <span className="font-semibold">{detailTip.label}</span>
            </div>
            <p className="font-mono tabular-nums text-gray-700">{formatTau(detailTip.tau)}</p>
            <p className="text-gray-400 font-mono tabular-nums">{detailTip.pct.toFixed(1)}% of total</p>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

// ─── Main Overview Page ─────────────────────────────────────────────────────

export function OverviewPage({ variants, results }: OverviewPageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const data = useMemo(() => {
    return variants
      .filter(v => results.has(v.id))
      .map(v => {
        const r = results.get(v.id)!;
        return {
          variant: v,
          result: r,
          agg: aggregateByCategory(r.breakdown),
          sleeper: getSleeperType(v.productInfo.sleeperType),
          energyDetail: getEnergyDetail(r.breakdown),
        };
      });
  }, [variants, results]);

  const bestIdx = useMemo(() => {
    if (data.length < 2) return -1;
    let minIdx = 0;
    for (let i = 1; i < data.length; i++) {
      if (data[i].result.totalTau < data[minIdx].result.totalTau) minIdx = i;
    }
    return minIdx;
  }, [data]);

  const maxTau = useMemo(() => Math.max(...data.map(d => d.result.totalTau), 1e-30), [data]);

  const selectedData = useMemo(() => {
    if (!selectedId) return null;
    return data.find(d => d.variant.id === selectedId) ?? null;
  }, [selectedId, data]);

  const handleBarClick = useCallback((id: string) => {
    setSelectedId(prev => (prev === id ? null : id));
  }, []);

  if (data.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-12 text-center">
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12">
          <p className="text-lg font-medium text-gray-900">No variants to compare</p>
          <p className="mt-2 text-sm text-gray-500">
            Switch to Variant Config and add at least one variant with components.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-2">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Cross-variant resource pressure comparison · {data.length} variant{data.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Summary Cards — horizontal scroll when >4 */}
      <div className="flex gap-4 overflow-x-auto pt-3 pb-1 sleek-scroll">
        {data.map((d, idx) => {
          const isBest = idx === bestIdx;
          const isSelected = d.variant.id === selectedId;
          return (
            <div
              key={d.variant.id}
              onClick={() => handleBarClick(d.variant.id)}
              className={`relative flex-shrink-0 w-56 rounded-xl border p-4 shadow-sm transition-all cursor-pointer ${
                isSelected
                  ? 'border-amber-300 bg-amber-50/50 ring-1 ring-amber-200'
                  : isBest
                    ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-200 hover:shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {isBest && (
                <span className="absolute -top-2.5 right-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
                  Lowest τ
                </span>
              )}
              <h3 className="truncate text-sm font-semibold text-gray-900">{d.variant.name}</h3>
              <p className="mt-0.5 text-[10px] text-gray-500">
                {d.sleeper?.label ?? d.variant.productInfo.sleeperType} · {d.variant.usePhase.lifetime}y · {formatNumber(d.variant.productInfo.totalWeight, 0)} kg
              </p>
              <p className="mt-2.5 text-base font-bold tracking-tight text-gray-900">
                <TauMono tau={d.result.totalTau} />
              </p>
              <div className="mt-2.5 flex h-1 overflow-hidden rounded-full bg-gray-100">
                {d.agg.Material > 0 && <div style={{ width: `${(d.agg.Material / d.result.totalTau) * 100}%`, backgroundColor: CAT_COLORS.Material }} />}
                {d.agg.Energy > 0 && <div style={{ width: `${(d.agg.Energy / d.result.totalTau) * 100}%`, backgroundColor: CAT_COLORS.Electricity }} />}
                {d.agg.Transport > 0 && <div style={{ width: `${(d.agg.Transport / d.result.totalTau) * 100}%`, backgroundColor: CAT_COLORS.Transport }} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vertical Stacked Bar Chart */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Resource Pressure by Category
          </h2>
          <div className="flex items-center gap-4">
            {[
              { label: 'Material', color: CAT_COLORS.Material },
              { label: 'Electricity', color: CAT_COLORS.Electricity },
              { label: 'Heat', color: CAT_COLORS.Heat },
              { label: 'Transport', color: CAT_COLORS.Transport },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: l.color }} />
                <span className="text-[10px] text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-5 py-4">
          <StackedBarChart
            data={data}
            maxTau={maxTau}
            bestIdx={bestIdx}
            onBarClick={handleBarClick}
            selectedId={selectedId}
          />
          <p className="mt-2 text-[10px] text-gray-400 text-center">
            Click a bar to see detailed breakdown
          </p>
        </div>
      </div>

      {/* Drill-Down Detail (conditionally shown) */}
      {selectedData && (
        <DrillDownPanel d={selectedData} onClose={() => setSelectedId(null)} />
      )}

      {/* Detailed Comparison Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Detailed Comparison
          </h2>
        </div>
        <div className="overflow-x-auto sleek-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Metric
                </th>
                {data.map(d => (
                  <th key={d.variant.id} className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    {d.variant.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <TauRow label="Total τ" data={data} extract={d => d.result.totalTau} highlight />
              <TauRow label="Material τ" data={data} extract={d => d.agg.Material} />
              <TauRow label="Electricity τ" data={data} extract={d => d.energyDetail.electricity} />
              <TauRow label="Heat τ" data={data} extract={d => d.energyDetail.heat} />
              <TauRow label="Transport τ" data={data} extract={d => d.agg.Transport} />
              <tr className="h-px"><td colSpan={data.length + 1} className="border-b border-gray-200" /></tr>
              <MetricRow label="Lifetime" data={data} extract={d => `${d.variant.usePhase.lifetime} yr`} />
              <MetricRow label="Total Mass" data={data} extract={d => `${formatNumber(d.variant.productInfo.totalWeight)} kg`} />
              <MetricRow label="Components" data={data} extract={d => String(d.variant.components.length)} />
              <MetricRow label="Sleeper Type" data={data} extract={d => d.sleeper?.label ?? '—'} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Table helper components ────────────────────────────────────────────────

function TauRow({ label, data, extract, highlight }: { label: string; data: DataRow[]; extract: (d: DataRow) => number; highlight?: boolean }) {
  return (
    <tr className={highlight ? 'bg-gray-50/80' : ''}>
      <td className={`px-5 py-2.5 text-xs ${highlight ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
        {label}
      </td>
      {data.map(d => (
        <td key={d.variant.id} className={`px-5 py-2.5 text-right ${highlight ? 'font-bold' : ''}`}>
          <TauMono tau={extract(d)} className={`text-xs ${highlight ? 'text-gray-900' : 'text-gray-700'}`} />
        </td>
      ))}
    </tr>
  );
}

function MetricRow({ label, data, extract }: { label: string; data: DataRow[]; extract: (d: DataRow) => string }) {
  return (
    <tr>
      <td className="px-5 py-2.5 text-xs font-medium text-gray-600">{label}</td>
      {data.map(d => (
        <td key={d.variant.id} className="px-5 py-2.5 text-right text-xs font-mono tabular-nums text-gray-700">
          {extract(d)}
        </td>
      ))}
    </tr>
  );
}
