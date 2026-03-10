import { formatTau } from '../../utils/formatters';

interface TauDisplayProps {
  totalTau: number;
  variantName: string;
}

export function TauDisplay({ totalTau, variantName }: TauDisplayProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 px-5 py-4 text-white shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          τ total
        </p>
      </div>
      <p className="mt-2 font-mono text-[1.65rem] font-extrabold leading-none tracking-tight tabular-nums">
        {totalTau === 0 ? '—' : formatTau(totalTau)}
      </p>
      <p className="mt-1.5 truncate text-xs text-gray-400">{variantName}</p>
    </div>
  );
}
