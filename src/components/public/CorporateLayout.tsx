import React from 'react';
import { CorporateHeader, CorporateFooter } from './CorporateHeader';

export function CorporateLayout({ children, onOpenDemo }: { children: React.ReactNode; onOpenDemo?: () => void }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <CorporateHeader onOpenDemo={onOpenDemo} />
      <main>{children}</main>
      <CorporateFooter />
    </div>
  );
}
