import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function SubpageHeaderNav({
  onBack,
  label,
  className,
}: {
  onBack?: () => void;
  label?: string;
  className?: string;
}) {
  const { t, setPublicPage } = useApp();
  const handleBack = () => {
    try {
      if (onBack) {
        onBack();
        return;
      }
      if (typeof window !== 'undefined' && window.history.length > 1 && window.location.pathname !== '/') {
        window.history.back();
        return;
      }
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        setPublicPage('home');
      }
    } catch {
      if (typeof window !== 'undefined') {
        window.location.assign('/');
      }
    }
  };
  return (
    <button
      type="button"
      onClick={handleBack}
      className={`mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-emerald-400 cursor-pointer active:scale-95 ${className || ''}`}
    >
      <ArrowLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      <span>{label || t('common.back', 'Volver atrás')}</span>
    </button>
  );
}
