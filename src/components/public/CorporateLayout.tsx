import React from 'react';
import { CorporateHeader, CorporateFooter } from './CorporateHeader';

export function CorporateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <CorporateHeader />
      <main>{children}</main>
      <CorporateFooter />
    </div>
  );
}
