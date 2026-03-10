import React from 'react';
import { useTheme } from '../../hooks/useTheme';

interface MainLayoutProps {
  tabs: React.ReactNode;
  nav: React.ReactNode;
  content: React.ReactNode;
  sidebar: React.ReactNode;
}

export function MainLayout({ tabs, nav, content, sidebar }: MainLayoutProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div className={`grid h-screen grid-cols-[180px_1fr_400px] grid-rows-[auto_1fr] overflow-hidden ${dark ? 'bg-[#1F1F1F]' : 'bg-gray-100'}`}>
      <div className={`col-span-3 border-b ${dark ? 'border-white/10 bg-[#1F1F1F]' : 'border-gray-200 bg-white'}`}>
        {tabs}
      </div>

      <div className="overflow-y-auto">
        {nav}
      </div>

      <main className={`overflow-y-auto p-6 ${dark ? 'bg-white text-gray-900' : 'bg-white text-gray-900'}`}>
        {content}
      </main>

      <aside className={`overflow-y-auto p-4 ${dark ? 'bg-[#1F1F1F]' : 'bg-gray-50 border-l border-gray-200'}`}>
        {sidebar}
      </aside>
    </div>
  );
}
