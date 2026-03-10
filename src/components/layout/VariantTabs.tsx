import { useState, useRef, useEffect } from 'react';
import { Copy, X, Plus, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface VariantTabsProps {
  variants: { id: string; name: string }[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

const MAX_VARIANTS = 5;

export function VariantTabs({
  variants,
  activeId,
  onSelect,
  onAdd,
  onRemove,
  onDuplicate,
  onRename,
}: VariantTabsProps) {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  function startRename(id: string, currentName: string) {
    setEditingId(id);
    setEditValue(currentName);
  }

  function commitRename(id: string) {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== variants.find((v) => v.id === id)?.name) {
      onRename(id, trimmed);
    }
    setEditingId(null);
  }

  return (
    <div className="flex items-center gap-1 px-2 py-1.5">
      {variants.map((variant) => {
        const isActive = variant.id === activeId;
        const isEditing = editingId === variant.id;

        return (
          <div
            key={variant.id}
            className={`group relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm select-none transition-colors ${
              isActive
                ? 'bg-amber-500 text-black font-medium'
                : dark
                  ? 'bg-[#2A2A2A] text-gray-400 hover:bg-[#353535] hover:text-gray-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
            onClick={() => onSelect(variant.id)}
            onDoubleClick={() => startRename(variant.id, variant.name)}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => commitRename(variant.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename(variant.id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-24 rounded bg-black/20 px-1 py-0 text-sm outline-none ring-1 ring-amber-500/50"
              />
            ) : (
              <span className="truncate max-w-[120px]">{variant.name}</span>
            )}

            {!isEditing && (
              <div
                className={`flex items-center gap-0.5 ${
                  isActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-60'
                } transition-opacity`}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); onDuplicate(variant.id); }}
                  className="rounded p-0.5 hover:bg-black/20"
                  title="Duplicate variant"
                  disabled={variants.length >= MAX_VARIANTS}
                >
                  <Copy size={12} />
                </button>
                {variants.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(variant.id); }}
                    className="rounded p-0.5 hover:bg-black/20"
                    title="Remove variant"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {variants.length < MAX_VARIANTS && (
        <button
          onClick={onAdd}
          className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
            dark
              ? 'bg-[#2A2A2A] text-gray-400 hover:bg-[#353535] hover:text-gray-200'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
          }`}
          title="Add new variant"
        >
          <Plus size={16} />
        </button>
      )}

      <div className="ml-auto">
        <button
          onClick={toggle}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
            dark
              ? 'text-gray-400 hover:bg-white/10 hover:text-gray-200'
              : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
          }`}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
          {dark ? 'Light' : 'Dark'}
        </button>
      </div>
    </div>
  );
}
