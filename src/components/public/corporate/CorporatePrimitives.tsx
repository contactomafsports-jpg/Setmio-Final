import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { PublicPage } from '../../../context/AppContext';

export function navigateCorporateRoute(
  path: string,
  page: PublicPage,
  setPublicPage: (page: PublicPage) => void,
  behavior: ScrollBehavior = 'smooth'
) {
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior });
  }
  setPublicPage(page);
}

export const CorporateContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}> = ({ children, className = '', narrow = false }) => (
  <div
    className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${
      narrow ? 'max-w-4xl' : 'max-w-[1180px]'
    } ${className}`}
  >
    {children}
  </div>
);

export const CorporateEyebrow: React.FC<{
  children: React.ReactNode;
  accent?: 'lime' | 'navy' | 'violet';
  className?: string;
}> = ({ children, accent = 'lime', className = '' }) => {
  const ruleColor =
    accent === 'violet'
      ? 'bg-[#8B5CF6]/70 dark:bg-[#8B5CF6]/80'
      : accent === 'navy'
      ? 'bg-[#0B1A2D] dark:bg-[#B7F229]'
      : 'bg-[#B7F229]';

  return (
    <div
      className={`inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300 ${className}`}
    >
      <span className={`h-[2px] w-4 shrink-0 ${ruleColor}`} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
};

export const CorporateSurface: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'subtle';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => (
  <div
    className={`rounded-2xl border border-slate-200/90 dark:border-[#1A314D] ${
      variant === 'subtle'
        ? 'bg-[#F7F9FC] dark:bg-[#081424]'
        : 'bg-white dark:bg-[#0E2239]'
    } ${className}`}
  >
    {children}
  </div>
);

export const CorporateMediaFrame: React.FC<{
  src: string;
  alt: string;
  aspectClass?: string;
  fallbackLabel?: string;
  className?: string;
}> = ({
  src,
  alt,
  aspectClass = 'aspect-[16/10]',
  fallbackLabel = 'Setmio',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`group rounded-2xl overflow-hidden border border-slate-200/90 dark:border-[#1A314D] bg-[#0B1A2D] ${aspectClass} ${className}`}
    >
      {hasError ? (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#071220] via-[#0B1A2D] to-[#132A45] p-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            {fallbackLabel}
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:transform-none"
        />
      )}
    </div>
  );
};

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export const CorporateBreadcrumb: React.FC<{
  items: BreadcrumbItem[];
  onBack?: () => void;
  backLabel?: string;
  className?: string;
}> = ({ items, onBack, backLabel = 'Volver', className = '' }) => (
  <div
    className={`flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-slate-200/80 dark:border-[#1A314D] ${className}`}
  >
    <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-1.5 text-xs">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${idx}`}>
            {item.onClick && !isLast ? (
              <button
                type="button"
                onClick={item.onClick}
                className="font-medium text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span
                className={
                  isLast
                    ? 'font-semibold text-[#0B1A2D] dark:text-white'
                    : 'font-medium text-slate-500 dark:text-slate-400'
                }
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </nav>

    {onBack && (
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200/80 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] px-3 py-1.5 text-xs font-semibold text-[#0B1A2D] dark:text-slate-200 hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />
        <span>{backLabel}</span>
      </button>
    )}
  </div>
);

export const CorporatePrimaryButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ReactNode }
> = ({ children, className = '', icon, ...props }) => (
  <button
    type="button"
    {...props}
    className={`inline-flex max-w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-sm px-5 sm:px-6 py-3 transition-colors cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed whitespace-normal text-center leading-snug ${className}`}
  >
    <span>{children}</span>
    {icon !== undefined ? icon : <ArrowRight className="w-4 h-4 shrink-0" />}
  </button>
);

export const CorporateSecondaryButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ReactNode }
> = ({ children, className = '', icon, ...props }) => (
  <button
    type="button"
    {...props}
    className={`inline-flex max-w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-300/90 dark:border-[#244163] bg-white dark:bg-[#0E2239] hover:border-[#0B1A2D] dark:hover:border-[#B7F229]/60 text-[#0B1A2D] dark:text-white font-semibold text-sm px-5 sm:px-6 py-3 transition-colors cursor-pointer active:scale-[0.98] disabled:opacity-60 whitespace-normal text-center leading-snug ${className}`}
  >
    {icon}
    <span>{children}</span>
  </button>
);

export const CorporateNavyButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ReactNode }
> = ({ children, className = '', icon, ...props }) => (
  <button
    type="button"
    {...props}
    className={`inline-flex max-w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#132A45] dark:hover:bg-[#1B385C] dark:text-white dark:border dark:border-[#2A4A70] font-bold text-sm px-5 sm:px-6 py-3 transition-colors cursor-pointer active:scale-[0.98] whitespace-normal text-center leading-snug ${className}`}
  >
    <span>{children}</span>
    {icon !== undefined ? icon : <ArrowRight className="w-4 h-4 shrink-0" />}
  </button>
);

export const CorporateSectionHeader: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  accent?: 'lime' | 'navy' | 'violet';
  action?: React.ReactNode;
}> = ({ eyebrow, title, subtitle, align = 'left', accent = 'lime', action }) => (
  <div
    className={`flex flex-col gap-6 ${
      action ? 'md:flex-row md:items-end md:justify-between' : ''
    } ${align === 'center' && !action ? 'items-center text-center mx-auto max-w-3xl' : 'max-w-3xl'}`}
  >
    <div className="space-y-3.5">
      {eyebrow && <CorporateEyebrow accent={accent}>{eyebrow}</CorporateEyebrow>}
      <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.12] text-balance font-display">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const CorporateCtaBanner: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}> = ({
  eyebrow = 'Setmio Pro · Suscripción modular con alta guiada',
  title,
  subtitle,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}) => (
  <section className="rounded-3xl bg-[#0B1A2D] dark:bg-[#071220] border border-[#1A314D] p-7 sm:p-12 lg:p-14 text-white">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
      <div className="space-y-3.5 max-w-2xl">
        <div className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B7F229]">
          <span className="h-[2px] w-4 bg-[#B7F229]" aria-hidden="true" />
          <span>{eyebrow}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-[1.12] text-white text-balance font-display">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
        <CorporatePrimaryButton onClick={onPrimary}>
          {primaryLabel}
        </CorporatePrimaryButton>
        {secondaryLabel && onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="inline-flex max-w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#244163] bg-[#0E2239] hover:border-[#B7F229]/60 text-white font-semibold text-sm px-5 sm:px-6 py-3 transition-colors cursor-pointer whitespace-normal text-center leading-snug"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  </section>
);
