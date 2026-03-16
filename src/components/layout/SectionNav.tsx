import { FileText, Zap, Flame, Truck, Ship, Clock, Recycle } from 'lucide-react';
import type { SectionId, ComponentIconId } from '../../types';
import type { LucideIcon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { COMPONENT_ICONS } from '../forms/ComponentIconPicker';

export interface NavSection {
  id: SectionId;
  label: string;
  group: 'product' | 'component' | 'lifecycle';
  icon?: ComponentIconId;
}

interface SectionNavProps {
  sections: NavSection[];
  activeSection: SectionId;
  onSelect: (id: SectionId) => void;
}

const LIFECYCLE_ICONS: Record<string, LucideIcon> = {
  'electricity': Zap,
  'heat': Flame,
  'transport-land': Truck,
  'transport-overseas': Ship,
  'use-phase': Clock,
  'end-of-life': Recycle,
};

export function SectionNav({ sections, activeSection, onSelect }: SectionNavProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const productSections = sections.filter(s => s.group === 'product');
  const componentSections = sections.filter(s => s.group === 'component');
  const lifecycleSections = sections.filter(s => s.group === 'lifecycle');

  const groupHeaderClass = `px-3 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`;
  const dividerClass = `mx-3 border-t ${dark ? 'border-white/5' : 'border-gray-200'}`;

  function renderItem(section: NavSection) {
    const isActive = section.id === activeSection;
    const isComponent = section.group === 'component';

    let IconComponent: LucideIcon | null = null;
    if (section.group === 'product') {
      IconComponent = FileText;
    } else if (section.group === 'lifecycle') {
      IconComponent = LIFECYCLE_ICONS[section.id] ?? Zap;
    } else if (section.icon) {
      IconComponent = COMPONENT_ICONS[section.icon]?.Icon ?? null;
    }

    return (
      <button
        key={section.id}
        onClick={() => onSelect(section.id)}
        className={`group flex items-center gap-2 rounded-md text-left text-sm transition-colors ${
          isComponent ? 'ml-2 pl-2 pr-3 py-1.5' : 'px-3 py-2'
        } ${
          isActive
            ? dark
              ? 'bg-amber-500/10 text-white font-medium'
              : 'bg-amber-50 text-gray-900 font-medium'
            : dark
              ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
        }`}
      >
        {IconComponent ? (
          <IconComponent
            size={isComponent ? 13 : 14}
            className={`flex-shrink-0 transition-colors ${
              isActive
                ? 'text-amber-500'
                : dark
                  ? 'text-gray-500 group-hover:text-gray-400'
                  : 'text-gray-400 group-hover:text-gray-500'
            }`}
          />
        ) : (
          <span
            className={`inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${
              isActive ? 'bg-amber-500' : dark ? 'bg-gray-600' : 'bg-gray-300'
            }`}
          />
        )}
        <span className="truncate">{section.label}</span>
        {isActive && (
          <span className="ml-auto h-4 w-0.5 rounded-full bg-amber-500 flex-shrink-0" />
        )}
      </button>
    );
  }

  return (
    <nav className={`flex h-full w-[180px] flex-col overflow-y-auto py-2 px-2 ${dark ? 'bg-[#1F1F1F]' : 'bg-gray-50'}`}>
      {productSections.map(renderItem)}

      {componentSections.length > 0 && (
        <>
          <div className={dividerClass} />
          <div className={groupHeaderClass}>
            Components
            <span className={`ml-1.5 ${dark ? 'text-gray-600' : 'text-gray-300'}`}>
              ({componentSections.length})
            </span>
          </div>
          {componentSections.map(renderItem)}
        </>
      )}

      {lifecycleSections.length > 0 && (
        <>
          <div className={dividerClass} />
          <div className={groupHeaderClass}>Energy & Transport</div>
          {lifecycleSections.map(renderItem)}
        </>
      )}
    </nav>
  );
}
