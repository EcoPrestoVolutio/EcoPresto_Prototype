import { useMemo } from 'react';
import { formatMass } from '../../utils/formatters';
import { useTheme } from '../../hooks/useTheme';

interface SankeyDiagramProps {
  components: {
    name: string;
    mass: number;
    primaryMaterialContent: number;
    productionLoss: number;
    productionLossTreatment: {
      recyclingWithoutLoss: number;
      recyclingWithLoss: number;
      disposal: number;
    };
  }[];
  totalWeight: number;
}

const FLOW_COLORS = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  product: '#F59E0B',
  recycled: '#22C55E',
  cascaded: '#EAB308',
  loss: '#EF4444',
} as const;

export function SankeyDiagram({ components, totalWeight }: SankeyDiagramProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const textFill = dark ? '#fff' : '#1F2937';

  const flows = useMemo(() => {
    let totalPrimary = 0;
    let totalSecondary = 0;
    let totalRecycled = 0;
    let totalCascaded = 0;
    let totalLoss = 0;

    for (const c of components) {
      const massWithLoss = c.mass * (1 + c.productionLoss);
      totalPrimary += c.mass * c.primaryMaterialContent * (1 + c.productionLoss);
      totalSecondary += c.mass * (1 - c.primaryMaterialContent) * (1 + c.productionLoss);
      totalRecycled += massWithLoss * c.productionLossTreatment.recyclingWithoutLoss;
      totalCascaded += massWithLoss * c.productionLossTreatment.recyclingWithLoss;
      totalLoss += massWithLoss * c.productionLossTreatment.disposal;
    }

    return { totalPrimary, totalSecondary, totalRecycled, totalCascaded, totalLoss };
  }, [components]);

  if (components.length === 0 || totalWeight === 0) {
    return (
      <div className={`flex h-[250px] items-center justify-center text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
        Add components to view mass flow
      </div>
    );
  }

  return (
    <div>
      <h3 className={`mb-2 text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>Mass Flow</h3>
      <svg viewBox="0 0 520 210" className="w-full" style={{ height: 250 }}>
        <path d="M 100,42 C 147,42 148,75 195,75" fill="none" stroke={FLOW_COLORS.primary} strokeWidth={3} strokeOpacity={0.5} strokeLinecap="round" />
        <path d="M 100,147 C 147,147 148,120 195,120" fill="none" stroke={FLOW_COLORS.secondary} strokeWidth={3} strokeOpacity={0.5} strokeLinecap="round" />
        <path d="M 305,75 C 352,75 353,30 400,30" fill="none" stroke={FLOW_COLORS.recycled} strokeWidth={3} strokeOpacity={0.5} strokeLinecap="round" />
        <path d="M 305,97 C 352,97 353,105 400,105" fill="none" stroke={FLOW_COLORS.cascaded} strokeWidth={3} strokeOpacity={0.5} strokeLinecap="round" />
        <path d="M 305,120 C 352,120 353,180 400,180" fill="none" stroke={FLOW_COLORS.loss} strokeWidth={3} strokeOpacity={0.5} strokeLinecap="round" />

        <rect x={0} y={17} width={100} height={50} rx={4} fill={FLOW_COLORS.primary} fillOpacity={0.15} stroke={FLOW_COLORS.primary} strokeWidth={1} />
        <text x={50} y={36} textAnchor="middle" fill={textFill} fontSize={10} fontWeight={500}>Primary Input</text>
        <text x={50} y={54} textAnchor="middle" fill={FLOW_COLORS.primary} fontSize={10} fontFamily="monospace">{formatMass(flows.totalPrimary)}</text>

        <rect x={0} y={122} width={100} height={50} rx={4} fill={FLOW_COLORS.secondary} fillOpacity={0.15} stroke={FLOW_COLORS.secondary} strokeWidth={1} />
        <text x={50} y={141} textAnchor="middle" fill={textFill} fontSize={10} fontWeight={500}>Secondary Input</text>
        <text x={50} y={159} textAnchor="middle" fill={FLOW_COLORS.secondary} fontSize={10} fontFamily="monospace">{formatMass(flows.totalSecondary)}</text>

        <rect x={195} y={45} width={110} height={100} rx={4} fill={FLOW_COLORS.product} fillOpacity={0.15} stroke={FLOW_COLORS.product} strokeWidth={1} />
        <text x={250} y={88} textAnchor="middle" fill={textFill} fontSize={12} fontWeight={600}>Product</text>
        <text x={250} y={108} textAnchor="middle" fill={FLOW_COLORS.product} fontSize={11} fontFamily="monospace">{formatMass(totalWeight)}</text>

        <rect x={400} y={5} width={120} height={50} rx={4} fill={FLOW_COLORS.recycled} fillOpacity={0.15} stroke={FLOW_COLORS.recycled} strokeWidth={1} />
        <text x={460} y={24} textAnchor="middle" fill={textFill} fontSize={10} fontWeight={500}>Recycled</text>
        <text x={460} y={42} textAnchor="middle" fill={FLOW_COLORS.recycled} fontSize={10} fontFamily="monospace">{formatMass(flows.totalRecycled)}</text>

        <rect x={400} y={80} width={120} height={50} rx={4} fill={FLOW_COLORS.cascaded} fillOpacity={0.15} stroke={FLOW_COLORS.cascaded} strokeWidth={1} />
        <text x={460} y={99} textAnchor="middle" fill={textFill} fontSize={10} fontWeight={500}>Cascaded</text>
        <text x={460} y={117} textAnchor="middle" fill={FLOW_COLORS.cascaded} fontSize={10} fontFamily="monospace">{formatMass(flows.totalCascaded)}</text>

        <rect x={400} y={155} width={120} height={50} rx={4} fill={FLOW_COLORS.loss} fillOpacity={0.15} stroke={FLOW_COLORS.loss} strokeWidth={1} />
        <text x={460} y={174} textAnchor="middle" fill={textFill} fontSize={10} fontWeight={500}>Loss</text>
        <text x={460} y={192} textAnchor="middle" fill={FLOW_COLORS.loss} fontSize={10} fontFamily="monospace">{formatMass(flows.totalLoss)}</text>
      </svg>
    </div>
  );
}
