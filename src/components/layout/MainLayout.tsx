import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface MainLayoutProps {
  pageNav: React.ReactNode;
  tabs?: React.ReactNode;
  nav?: React.ReactNode;
  content: React.ReactNode;
  sidebar?: React.ReactNode;
}

const MIN_SIDEBAR = 280;
const MAX_SIDEBAR = 600;
const DEFAULT_SIDEBAR = 380;

export function MainLayout({ pageNav, tabs, nav, content, sidebar }: MainLayoutProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const hasNav = !!nav;
  const hasSidebar = !!sidebar;

  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(DEFAULT_SIDEBAR);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startW.current = sidebarWidth;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sidebarWidth]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const delta = startX.current - e.clientX;
    setSidebarWidth(Math.min(MAX_SIDEBAR, Math.max(MIN_SIDEBAR, startW.current + delta)));
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    const cleanup = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    return cleanup;
  }, []);

  const gridCols = hasNav && hasSidebar
    ? `180px 1fr ${sidebarWidth}px`
    : hasNav
      ? '180px 1fr'
      : hasSidebar
        ? `1fr ${sidebarWidth}px`
        : '1fr';

  const colSpan = (hasNav && hasSidebar) ? 3 : (hasNav || hasSidebar) ? 2 : 1;

  return (
    <div
      className={`grid h-screen overflow-hidden ${dark ? 'bg-[#1F1F1F]' : 'bg-gray-100'}`}
      style={{
        gridTemplateColumns: gridCols,
        gridTemplateRows: tabs ? 'auto auto 1fr' : 'auto 1fr',
      }}
    >
      <div style={{ gridColumn: `1 / ${colSpan + 1}` }}>
        {pageNav}
      </div>

      {tabs && (
        <div
          className={`border-b ${dark ? 'border-white/10 bg-[#1F1F1F]' : 'border-gray-200 bg-white'}`}
          style={{ gridColumn: `1 / ${colSpan + 1}` }}
        >
          {tabs}
        </div>
      )}

      {hasNav && (
        <div className="overflow-y-auto sleek-scroll">
          {nav}
        </div>
      )}

      <main className="overflow-y-auto p-6 bg-white text-gray-900 sleek-scroll">
        {content}
      </main>

      {hasSidebar && (
        <div className="flex min-h-0 overflow-hidden">
          <div
            className={`relative w-1.5 shrink-0 cursor-col-resize group hover:bg-amber-400/40 transition-colors ${dark ? 'bg-white/5' : 'bg-gray-200/60'}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full bg-gray-400/50 group-hover:bg-amber-500 transition-colors pointer-events-none" />
          </div>
          <aside className={`flex-1 min-h-0 overflow-y-auto sleek-scroll ${dark ? 'bg-[#1F1F1F]' : 'bg-gray-50'}`}>
            {sidebar}
          </aside>
        </div>
      )}
    </div>
  );
}
