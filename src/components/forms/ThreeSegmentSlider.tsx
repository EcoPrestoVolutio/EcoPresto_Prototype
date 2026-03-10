import { useRef, useCallback, useEffect, useState } from 'react';

interface ThreeSegmentSliderProps {
  recycling: number;
  cascading: number;
  loss: number;
  onChange: (values: { recycling: number; cascading: number; loss: number }) => void;
  title?: string;
}

const COLORS = {
  recycling: '#3B82F6',
  cascading: '#F59E0B',
  loss: '#EF4444',
};

export function ThreeSegmentSlider({
  recycling,
  cascading,
  loss,
  onChange,
  title,
}: ThreeSegmentSliderProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null);

  const pctA = Math.round(recycling * 100);
  const pctB = Math.round(cascading * 100);
  const pctC = Math.round(loss * 100);

  const positionToValue = useCallback((clientX: number): number => {
    if (!barRef.current) return 0;
    const rect = barRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const handlePointerDown = useCallback((handle: 'left' | 'right') => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(handle);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const pos = positionToValue(e.clientX);
    const step = 0.01;
    const snapped = Math.round(pos / step) * step;

    if (dragging === 'left') {
      const maxLeft = recycling + cascading;
      const newA = Math.max(0, Math.min(snapped, maxLeft));
      const newB = maxLeft - newA;
      onChange({
        recycling: newA,
        cascading: newB,
        loss: Math.max(0, 1 - newA - newB),
      });
    } else {
      const newBoundary = Math.max(recycling, Math.min(snapped, 1));
      const newB = newBoundary - recycling;
      onChange({
        recycling,
        cascading: Math.max(0, newB),
        loss: Math.max(0, 1 - newBoundary),
      });
    }
  }, [dragging, recycling, cascading, positionToValue, onChange]);

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onUp = () => setDragging(null);
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, [dragging]);

  const leftHandlePos = recycling * 100;
  const rightHandlePos = (recycling + cascading) * 100;

  return (
    <div className="py-1">
      {title && (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {title}
        </div>
      )}

      <div
        ref={barRef}
        className="relative h-8 rounded-lg overflow-visible select-none"
        style={{ touchAction: 'none' }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="absolute inset-0 flex rounded-lg overflow-hidden">
          <div
            className="h-full flex items-center justify-center text-[11px] font-medium text-white transition-[width] duration-75"
            style={{ width: `${pctA}%`, backgroundColor: COLORS.recycling }}
          >
            {pctA > 10 && `${pctA}%`}
          </div>
          <div
            className="h-full flex items-center justify-center text-[11px] font-medium text-white transition-[width] duration-75"
            style={{ width: `${pctB}%`, backgroundColor: COLORS.cascading }}
          >
            {pctB > 10 && `${pctB}%`}
          </div>
          <div
            className="h-full flex items-center justify-center text-[11px] font-medium text-white transition-[width] duration-75"
            style={{ width: `${pctC}%`, backgroundColor: COLORS.loss }}
          >
            {pctC > 10 && `${pctC}%`}
          </div>
        </div>

        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          style={{ left: `${leftHandlePos}%` }}
          onPointerDown={handlePointerDown('left')}
        >
          <div className={`w-4 h-10 rounded bg-white border-2 shadow-md cursor-ew-resize flex items-center justify-center ${dragging === 'left' ? 'border-blue-600 shadow-lg scale-110' : 'border-gray-400 hover:border-blue-500'} transition-all`}>
            <div className="flex gap-px">
              <div className="w-px h-3 bg-gray-400" />
              <div className="w-px h-3 bg-gray-400" />
            </div>
          </div>
        </div>

        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          style={{ left: `${rightHandlePos}%` }}
          onPointerDown={handlePointerDown('right')}
        >
          <div className={`w-4 h-10 rounded bg-white border-2 shadow-md cursor-ew-resize flex items-center justify-center ${dragging === 'right' ? 'border-amber-600 shadow-lg scale-110' : 'border-gray-400 hover:border-amber-500'} transition-all`}>
            <div className="flex gap-px">
              <div className="w-px h-3 bg-gray-400" />
              <div className="w-px h-3 bg-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 text-[11px] text-gray-500 mt-2">
        <div className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS.recycling }} />
          Recycling
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS.cascading }} />
          Cascading
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS.loss }} />
          Loss
        </div>
      </div>
    </div>
  );
}
