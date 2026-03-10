import React from 'react';
import { useTheme } from '../../hooks/useTheme';

interface MainLayoutProps {
  pageNav: React.ReactNode;
  tabs?: React.ReactNode;
  nav?: React.ReactNode;
  content: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function MainLayout({ pageNav, tabs, nav, content, sidebar }: MainLayoutProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const hasNav = !!nav;
  const hasSidebar = !!sidebar;
  const gridCols = hasNav && hasSidebar
    ? 'grid-cols-[180px_1fr_400px]'
    : hasNav
      ? 'grid-cols-[180px_1fr]'
      : hasSidebar
        ? 'grid-cols-[1fr_400px]'
        : 'grid-cols-[1fr]';

  return (
    <div className={`grid h-screen ${gridCols} grid-rows-[auto_auto_1fr] overflow-hidden ${dark ? 'bg-[#1F1F1F]' : 'bg-gray-100'}`}>
      <div className={`${hasNav && hasSidebar ? 'col-span-3' : hasNav || hasSidebar ? 'col-span-2' : 'col-span-1'}`}>
        {pageNav}
      </div>

      {tabs && (
        <div className={`${hasNav && hasSidebar ? 'col-span-3' : hasNav || hasSidebar ? 'col-span-2' : 'col-span-1'} border-b ${dark ? 'border-white/10 bg-[#1F1F1F]' : 'border-gray-200 bg-white'}`}>
          {tabs}
        </div>
      )}

      {hasNav && (
        <div className="overflow-y-auto">
          {nav}
        </div>
      )}

      <main className="overflow-y-auto p-6 bg-white text-gray-900">
        {content}
      </main>

      {hasSidebar && (
        <aside className={`overflow-y-auto p-4 ${dark ? 'bg-[#1F1F1F]' : 'bg-gray-50 border-l border-gray-200'}`}>
          {sidebar}
        </aside>
      )}
    </div>
  );
}
