import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Layers,
  Mountain,
  Droplet,
  FlaskConical,
  Shield,
  TreePine,
  Gem,
  Zap,
  CircleDot,
  Package,
  Cylinder,
} from 'lucide-react';
import type { ComponentIconId } from '../../types';
import type { LucideIcon } from 'lucide-react';

export const COMPONENT_ICONS: Record<ComponentIconId, { Icon: LucideIcon; label: string }> = {
  cube: { Icon: Package, label: 'Cube' },
  box: { Icon: Box, label: 'Box' },
  layers: { Icon: Layers, label: 'Layers' },
  mountain: { Icon: Mountain, label: 'Mineral' },
  droplet: { Icon: Droplet, label: 'Liquid' },
  flask: { Icon: FlaskConical, label: 'Chemical' },
  shield: { Icon: Shield, label: 'Metal' },
  'tree-pine': { Icon: TreePine, label: 'Wood' },
  gem: { Icon: Gem, label: 'Polymer' },
  bolt: { Icon: Zap, label: 'Energy' },
  'circle-dot': { Icon: CircleDot, label: 'Generic' },
  cylinder: { Icon: Cylinder, label: 'Fibre' },
};

const ALL_ICON_IDS = Object.keys(COMPONENT_ICONS) as ComponentIconId[];

interface ComponentIconPickerProps {
  value: ComponentIconId;
  onChange: (icon: ComponentIconId) => void;
}

export function ComponentIconPicker({ value, onChange }: ComponentIconPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const ActiveIcon = COMPONENT_ICONS[value]?.Icon ?? CircleDot;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
        title="Change icon"
      >
        <ActiveIcon size={18} />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1.5 z-50 rounded-xl border border-gray-200 bg-white p-2.5 shadow-xl"
          style={{ width: 224 }}
        >
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-2 px-1">
            Choose icon
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
            {ALL_ICON_IDS.map((id) => {
              const { Icon, label } = COMPONENT_ICONS[id];
              const selected = id === value;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => { onChange(id); setOpen(false); }}
                  title={label}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 2px', borderRadius: 8 }}
                  className={
                    selected
                      ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-300'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }
                >
                  <Icon size={18} />
                  <span style={{ fontSize: 9, lineHeight: '12px' }}>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
