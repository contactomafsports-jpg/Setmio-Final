import React, { useState } from 'react';
import { Check, Sparkles, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { useApp } from '../../context/AppContext';

interface PricingViewProps {
  onBack: () => void;
  onOpenDemo: () => void;
  onOpenRegister?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onBack, onOpenDemo, onOpenRegister }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { t, language } = useApp();
  void language;

  const pricingTierConfigs = [
    {
      id: 'coach',
      priceMonthly: 39,
      priceYearly: 32,
      featureCount: 5,
      featured: false,
      badgeHighlight: false,
    },
    {
      id: 'club_base',
      priceMonthly: 79,
      priceYearly: 65,
      featureCount: 6,
      featured: true,
      badgeHighlight: true,
    },
    {
      id: 'club_pro',
      priceMonthly: 149,
      priceYearly: 119,
      featureCount: 7,
      featured: false,
      badgeHighlight: false,
    },
    {
      id: 'enterprise',
      priceMonthly: null,
      priceYearly: null,
      featureCount: 6,
      featured: false,
      badgeHighlight: false,
    },
  ];

  const handleAction = () => {
    if (onOpenDemo) {
      onOpenDemo();
    } else if (onOpenRegister) {
      onOpenRegister();
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Navigation alineada a la izquierda */}
        <div className="flex items-center justify-start">
          <SubpageHeaderNav onBack={onBack} />
        </div>

        {/* Header Estrictamente Centrado */}
        <div className="space-y-6 text-center w-full">
          <div className="max-w-3xl mx-auto space-y-4 text-center flex flex-col items-center justify-center">
            <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/20 text-center">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('pricing.heroBadge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight text-center">
              {t('pricing.heroTitle')}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed text-center font-normal">
              {t('pricing.heroSubtitle')}
            </p>

            {/* Selector de Periodo de Facturación Estrictamente Centrado */}
            <div className="flex items-center justify-center gap-3 pt-4 text-center">
              <span
                className={`text-xs font-bold transition-colors ${
                  billingCycle === 'monthly' ? 'text-slate-900 dark:text-white font-black' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {t('pricing.cycleMonthly', 'Facturación Mensual')}
              </span>

              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 rounded-full bg-emerald-600 transition p-0.5 cursor-pointer shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                aria-label={t('pricing.toggleCycle', 'Alternar facturación mensual y anual')}
              >
                <span
                  className={`block w-6 h-6 rounded-full bg-white transition-transform duration-200 shadow-md ${
                    billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>

              <span
                className={`text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  billingCycle === 'yearly' ? 'text-slate-900 dark:text-white font-black' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <span>{t('pricing.cycleYearly', 'Facturación Anual')}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-[10px] tracking-wide border border-emerald-500/30">
                  {t('pricing.cycleYearlyDiscount', 'Ahorra 2 meses (20%)')}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Grid de Precios con Cada Tarjeta y su Interior Estrictamente Centrados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {pricingTierConfigs.map((tier) => {
            const price = billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly;

            return (
              <article
                key={tier.id}
                className={`relative rounded-3xl p-7 flex flex-col justify-between text-center items-center transition-all duration-200 hover:-translate-y-1.5 shadow-sm hover:shadow-xl ${
                  tier.featured
                    ? 'bg-white dark:bg-slate-900 border-2 border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg'
                    : 'bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800'
                }`}
              >
                {/* Badge Superior Centrado */}
                <div className="w-full flex justify-center mb-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-center ${
                      tier.badgeHighlight
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t(`pricing.tiers.${tier.id}.badge`)}
                  </span>
                </div>

                {/* Contenido Principal de la Tarjeta Estrictamente Centrado */}
                <div className="w-full space-y-4 flex flex-col items-center justify-center text-center">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center w-full">
                    {t(`pricing.tiers.${tier.id}.name`)}
                  </h2>

                  {/* Precio Centrado */}
                  <div className="flex items-baseline justify-center gap-1 border-b border-slate-100 dark:border-slate-800/80 pb-4 w-full text-center">
                    {price === null ? (
                      <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center">
                        {t('pricing.customPrice')}
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400 text-center">
                          {price}€
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold text-center">
                          {t('pricing.perMonth')}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Descripción Centrada */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 min-h-12 leading-relaxed text-center px-1 w-full">
                    {t(`pricing.tiers.${tier.id}.desc`)}
                  </p>

                  {/* Lista de Características Centrada */}
                  <ul className="w-full space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col items-center justify-center text-center">
                    {Array.from({ length: tier.featureCount }).map((_, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 text-center w-full"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="text-center">{t(`pricing.tiers.${tier.id}.f${idx + 1}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botón de Acción Centrado */}
                <div className="w-full pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex justify-center text-center">
                  <button
                    type="button"
                    onClick={handleAction}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 text-center ${
                      tier.featured
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 shadow-md'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <span>{t(`pricing.tiers.${tier.id}.cta`)}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Garantía y FAQ Breve Estrictamente Centrado */}
        <section className="rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 text-center space-y-4 max-w-3xl mx-auto flex flex-col items-center justify-center">
          <div className="flex justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white text-center w-full">
            {t('home.prefooter.badge', 'Garantía Setmio: 30 Días de Prueba Sin Compromiso')}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-center w-full max-w-xl mx-auto">
            {t('home.prefooter.subtitle', 'Configuramos tu club, importamos tu base de socios y te formamos a ti y a tu equipo de recepción de forma completamente gratuita. Sin contratos de permanencia ni costes de alta ocultos.')}
          </p>

          <div className="pt-2 flex justify-center text-center">
            <button
              type="button"
              onClick={handleAction}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-md text-center active:scale-95"
            >
              <span>{t('home.corporate.demoBtn', 'Solicitar Demo o Alta Directa')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PricingView;
