import { formatTau } from '../../utils/formatters';
import { useTheme } from '../../hooks/useTheme';

interface TauDisplayProps {
  totalTau: number;
  variantName: string;
}

export function TauDisplay({ totalTau, variantName }: TauDisplayProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div className="px-3 py-2">
      <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>τ total</p>
      <p className={`truncate text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{variantName}</p>
      <p className={`mt-1 font-mono text-2xl font-bold tracking-tight tabular-nums ${dark ? 'text-white' : 'text-gray-900'}`}>
        {totalTau === 0 ? '—' : formatTau(totalTau)}
      </p>
    </div>
  );
}
