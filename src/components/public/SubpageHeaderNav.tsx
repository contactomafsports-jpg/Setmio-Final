import React from 'react';
import { ArrowLeft } from 'lucide-react';

export function SubpageHeaderNav({ onBack }: { onBack?: () => void }) {
  const handleBack = () => {
    try {
      if (typeof window !== 'undefined' && window.history.length > 1) { window.history.back(); return; }
      if (onBack) { onBack(); return; }
      if (window.history.length > 1) window.history.back();
      else window.location.assign('/');
    } catch {
      window.location.assign('/');
    }
  };
  return <button type="button" onClick={handleBack} className="mb-8 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-emerald-400"><ArrowLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Volver atrás</button>;
}
