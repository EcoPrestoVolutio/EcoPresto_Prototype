import { BarChart3, Beaker, Settings2 } from 'lucide-react';
import type { PageId } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface PageNavProps {
  activePage: PageId;
  onSelect: (page: PageId) => void;
}

const PAGES: { id: PageId; label: string; Icon: typeof BarChart3 }[] = [
  { id: 'overview', label: 'Overview', Icon: BarChart3 },
  { id: 'materials-energy', label: 'Materials & Energy', Icon: Beaker },
  { id: 'variant-config', label: 'Variant Config', Icon: Settings2 },
];

export function PageNav({ activePage, onSelect }: PageNavProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div className={`flex items-center gap-1 px-4 py-2 border-b ${dark ? 'border-white/10 bg-[#181818]' : 'border-gray-200 bg-gray-50'}`}>
      <span className={`text-sm font-bold mr-3 ${dark ? 'text-amber-400' : 'text-amber-600'}`}>
        Eco-Presto
      </span>
      <div className="flex items-center gap-0.5">
        {PAGES.map(({ id, label, Icon }) => {
          const isActive = id === activePage;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                isActive
                  ? dark
                    ? 'bg-amber-500/15 text-amber-400 font-medium'
                    : 'bg-amber-50 text-amber-700 font-medium'
                  : dark
                    ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
