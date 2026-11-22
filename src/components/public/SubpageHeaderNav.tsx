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
      className={`mb-6 inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-slate-200/80 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] px-3.5 py-1.5 text-xs font-semibold text-[#0B1A2D] dark:text-slate-200 transition-colors hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 cursor-pointer ${
        className || ''
      }`}
    >
      <ArrowLeft className="h-3.5 w-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />
      <span>{label || t('common.back', 'Volver')}</span>
    </button>
  );
}
