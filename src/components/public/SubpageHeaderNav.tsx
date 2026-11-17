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
      className={`mb-6 inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-xs font-semibold text-[#0B1A2D] transition hover:border-[#8B5CF6]/60 hover:text-[#8B5CF6] dark:border-[#1A314D] dark:bg-[#0E2239] dark:text-slate-200 dark:hover:border-[#B7F229]/60 dark:hover:text-[#B7F229] cursor-pointer active:scale-95 ${className || ''}`}
    >
      <ArrowLeft className="h-4 w-4 text-[#8B5CF6] dark:text-[#B7F229]" />
      <span>{label || t('common.back', 'Volver atrás')}</span>
    </button>
  );
}
