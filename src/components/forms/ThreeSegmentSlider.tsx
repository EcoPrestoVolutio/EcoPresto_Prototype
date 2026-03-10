import { useRef, useCallback, useEffect, useState } from 'react';

interface ThreeSegmentSliderProps {
  recyclingWithoutLoss: number;
  recyclingWithLoss: number;
  disposal: number;
  onChange: (values: {
    recyclingWithoutLoss: number;
    recyclingWithLoss: number;
    disposal: number;
  }) => void;
}

const COLORS = {
  recyclingWithoutLoss: '#3B82F6',
  recyclingWithLoss: '#F59E0B',
  disposal: '#EF4444',
};

export function ThreeSegmentSlider({
  recyclingWithoutLoss,
  recyclingWithLoss,
  disposal,
  onChange,
}: ThreeSegmentSliderProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null);

  const pctA = Math.round(recyclingWithoutLoss * 100);
  const pctB = Math.round(recyclingWithLoss * 100);
  const pctC = Math.round(disposal * 100);

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
      const maxLeft = recyclingWithoutLoss + recyclingWithLoss;
      const newA = Math.max(0, Math.min(snapped, maxLeft));
      const newB = maxLeft - newA;
      onChange({
        recyclingWithoutLoss: newA,
        recyclingWithLoss: newB,
        disposal: Math.max(0, 1 - newA - newB),
      });
    } else {
      const boundary = recyclingWithoutLoss + recyclingWithLoss;
      const newBoundary = Math.max(recyclingWithoutLoss, Math.min(snapped, 1));
      const newB = newBoundary - recyclingWithoutLoss;
      onChange({
        recyclingWithoutLoss,
        recyclingWithLoss: Math.max(0, newB),
        disposal: Math.max(0, 1 - newBoundary),
      });
    }
  }, [dragging, recyclingWithoutLoss, recyclingWithLoss, positionToValue, onChange]);

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onUp = () => setDragging(null);
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, [dragging]);

  const leftHandlePos = recyclingWithoutLoss * 100;
  const rightHandlePos = (recyclingWithoutLoss + recyclingWithLoss) * 100;

  return (
    <div className="py-2">
      <div className="text-sm font-medium text-gray-700 mb-3">
        Production Loss Treatment
      </div>

      <div
        ref={barRef}
        className="relative h-10 rounded-lg overflow-visible select-none"
        style={{ touchAction: 'none' }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Colored segments */}
        <div className="absolute inset-0 flex rounded-lg overflow-hidden">
          <div
            className="h-full flex items-center justify-center text-xs font-medium text-white transition-[width] duration-75"
            style={{ width: `${pctA}%`, backgroundColor: COLORS.recyclingWithoutLoss }}
          >
            {pctA > 12 && `${pctA}%`}
          </div>
          <div
            className="h-full flex items-center justify-center text-xs font-medium text-white transition-[width] duration-75"
            style={{ width: `${pctB}%`, backgroundColor: COLORS.recyclingWithLoss }}
          >
            {pctB > 12 && `${pctB}%`}
          </div>
          <div
            className="h-full flex items-center justify-center text-xs font-medium text-white transition-[width] duration-75"
            style={{ width: `${pctC}%`, backgroundColor: COLORS.disposal }}
          >
            {pctC > 12 && `${pctC}%`}
          </div>
        </div>

        {/* Left handle */}
        {leftHandlePos > 0 && leftHandlePos < 100 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
            style={{ left: `${leftHandlePos}%` }}
            onPointerDown={handlePointerDown('left')}
          >
            <div className={`w-5 h-12 rounded-md bg-white border-2 shadow-md cursor-ew-resize flex items-center justify-center ${dragging === 'left' ? 'border-blue-600 shadow-lg scale-110' : 'border-gray-400 hover:border-blue-500'} transition-all`}>
              <div className="flex gap-px">
                <div className="w-px h-4 bg-gray-400" />
                <div className="w-px h-4 bg-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Right handle */}
        {rightHandlePos > 0 && rightHandlePos < 100 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
            style={{ left: `${rightHandlePos}%` }}
            onPointerDown={handlePointerDown('right')}
          >
            <div className={`w-5 h-12 rounded-md bg-white border-2 shadow-md cursor-ew-resize flex items-center justify-center ${dragging === 'right' ? 'border-amber-600 shadow-lg scale-110' : 'border-gray-400 hover:border-amber-500'} transition-all`}>
              <div className="flex gap-px">
                <div className="w-px h-4 bg-gray-400" />
                <div className="w-px h-4 bg-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-500 mt-3">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS.recyclingWithoutLoss }} />
          Recycling w/o loss
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS.recyclingWithLoss }} />
          Recycling w/ loss
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS.disposal }} />
          Disposal
        </div>
      </div>
    </div>
  );
}
