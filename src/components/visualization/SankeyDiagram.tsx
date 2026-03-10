import { useMemo } from 'react';
import { formatMass } from '../../utils/formatters';

interface SankeyDiagramProps {
  components: {
    name: string;
    mass: number;
    primaryContent: number;
    manufacturingLossRate: number;
    manufacturingLossTreatment: {
      collectionRate: number;
      recyclingRate: number;
      cascadingRate: number;
      lossRate: number;
    };
    eolTreatment: {
      collectionRate: number;
      recyclingRate: number;
      cascadingRate: number;
      lossRate: number;
    };
  }[];
  totalWeight: number;
}

const C = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  product: '#F59E0B',
  recycled: '#22C55E',
  cascaded: '#EAB308',
  loss: '#EF4444',
} as const;

export function SankeyDiagram({ components, totalWeight }: SankeyDiagramProps) {
  const flows = useMemo(() => {
    let totalPrimary = 0;
    let totalSecondary = 0;
    let totalRecycled = 0;
    let totalCascaded = 0;
    let totalLoss = 0;

    for (const c of components) {
      const massRequired = c.mass * (1 + c.manufacturingLossRate);
      const manufLossKg = c.mass * c.manufacturingLossRate;
      totalPrimary += massRequired * c.primaryContent;
      totalSecondary += massRequired * (1 - c.primaryContent);

      const m = c.manufacturingLossTreatment;
      const e = c.eolTreatment;
      totalRecycled += manufLossKg * m.collectionRate * m.recyclingRate + c.mass * e.collectionRate * e.recyclingRate;
      totalCascaded += manufLossKg * m.collectionRate * m.cascadingRate + c.mass * e.collectionRate * e.cascadingRate;
      totalLoss += manufLossKg * m.collectionRate * m.lossRate + c.mass * e.collectionRate * e.lossRate;
    }

    return { totalPrimary, totalSecondary, totalRecycled, totalCascaded, totalLoss };
  }, [components]);

  if (components.length === 0 || totalWeight === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 text-xs text-gray-400">
        Add components to view mass flow
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-100">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Mass Flow
        </h3>
      </div>
      <div className="p-3">
        <svg viewBox="0 0 480 190" className="w-full" style={{ height: 210 }}>
          <defs>
            {Object.entries(C).map(([key, color]) => (
              <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0.08} />
              </linearGradient>
            ))}
          </defs>

          <path d="M 88,38 C 130,38 140,68 180,68" fill="none" stroke={C.primary} strokeWidth={2.5} strokeOpacity={0.4} />
          <path d="M 88,132 C 130,132 140,108 180,108" fill="none" stroke={C.secondary} strokeWidth={2.5} strokeOpacity={0.4} />
          <path d="M 280,68 C 320,68 330,28 368,28" fill="none" stroke={C.recycled} strokeWidth={2.5} strokeOpacity={0.4} />
          <path d="M 280,88 C 320,88 330,95 368,95" fill="none" stroke={C.cascaded} strokeWidth={2.5} strokeOpacity={0.4} />
          <path d="M 280,108 C 320,108 330,162 368,162" fill="none" stroke={C.loss} strokeWidth={2.5} strokeOpacity={0.4} />

          <Node x={0} y={14} w={88} h={48} color={C.primary} label="Primary" value={formatMass(flows.totalPrimary)} />
          <Node x={0} y={108} w={88} h={48} color={C.secondary} label="Secondary" value={formatMass(flows.totalSecondary)} />
          <Node x={180} y={42} w={100} h={90} color={C.product} label="Product" value={formatMass(totalWeight)} large />
          <Node x={368} y={4} w={112} h={48} color={C.recycled} label="Recycled" value={formatMass(flows.totalRecycled)} />
          <Node x={368} y={71} w={112} h={48} color={C.cascaded} label="Cascaded" value={formatMass(flows.totalCascaded)} />
          <Node x={368} y={138} w={112} h={48} color={C.loss} label="Loss" value={formatMass(flows.totalLoss)} />
        </svg>
      </div>
    </div>
  );
}

function Node({
  x, y, w, h, color, label, value, large,
}: {
  x: number; y: number; w: number; h: number; color: string; label: string; value: string; large?: boolean;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={color} fillOpacity={0.08} stroke={color} strokeWidth={1} strokeOpacity={0.3} />
      <text x={cx} y={y + (large ? h * 0.42 : h * 0.44)} textAnchor="middle" fill="#374151" fontSize={large ? 11 : 9.5} fontWeight={large ? 700 : 500}>
        {label}
      </text>
      <text x={cx} y={y + (large ? h * 0.66 : h * 0.76)} textAnchor="middle" fill={color} fontSize={large ? 10.5 : 9} fontFamily="ui-monospace, monospace" fontWeight={600}>
        {value}
      </text>
    </g>
  );
}
