import React, { useState } from 'react';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';
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

  const handleSelectPlan = (planId: string) => {
    const planParam = planId === 'club_pro' ? 'profesional' : planId === 'club_base' ? 'club' : planId;
    if (typeof window !== 'undefined') {
      window.history.pushState({ plan: planParam }, '', `/registro?plan=${planParam}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    if (onOpenRegister) {
      onOpenRegister();
    }
  };

  const handleRegisterCta = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/registro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    if (onOpenRegister) {
      onOpenRegister();
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white py-12 sm:py-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-start">
          <SubpageHeaderNav onBack={onBack} className="mb-0" />
        </div>

        <div className="space-y-16">
          {/* Header */}
          <div className="max-w-3xl mx-auto space-y-5 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B5CF6] dark:text-[#a78bfa]">
              {t('pricing.heroBadge')}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] text-balance">
              {t('pricing.heroTitle')}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {t('pricing.heroSubtitle')}
            </p>

            {/* Billing Cycle Switch */}
            <div className="inline-flex items-center justify-center gap-4 pt-3">
              <span
                className={`text-xs font-semibold transition-colors ${
                  billingCycle === 'monthly' ? 'text-[#0B1A2D] dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {t('pricing.cycleMonthly', 'Facturación Mensual')}
              </span>

              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-12 h-6 rounded-full bg-[#0B1A2D] dark:bg-[#132A45] border border-slate-300 dark:border-[#1A314D] transition p-0.5 cursor-pointer"
                aria-label={t('pricing.toggleCycle', 'Alternar facturación mensual y anual')}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-[#B7F229] transition-transform duration-200 ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>

              <span
                className={`text-xs font-semibold transition-colors flex items-center gap-2 ${
                  billingCycle === 'yearly' ? 'text-[#0B1A2D] dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <span>{t('pricing.cycleYearly', 'Facturación Anual')}</span>
                <span className="px-2 py-0.5 rounded-md bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] font-bold text-[10px] tracking-wide border border-[#B7F229]/40">
                  {t('pricing.cycleYearlyDiscount', 'Ahorra 2 meses (20%)')}
                </span>
              </span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {pricingTierConfigs.map((tier) => {
              const price = billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly;

              return (
                <article
                  key={tier.id}
                  className={`relative rounded-2xl p-7 flex flex-col justify-between transition-colors ${
                    tier.featured
                      ? 'bg-[#0B1A2D] text-white border-2 border-[#B7F229] dark:bg-[#0E2239]'
                      : 'bg-[#F8FAFC] dark:bg-[#0E2239] text-[#0B1A2D] dark:text-white border border-slate-200/80 dark:border-[#1A314D] hover:border-[#8B5CF6]/50'
                  }`}
                >
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-[0.16em] ${
                          tier.badgeHighlight
                            ? 'text-[#B7F229]'
                            : 'text-[#8B5CF6] dark:text-[#a78bfa]'
                        }`}
                      >
                        {t(`pricing.tiers.${tier.id}.badge`)}
                      </span>

                      <h2 className={`text-xl font-black ${tier.featured ? 'text-white' : 'text-[#0B1A2D] dark:text-white'}`}>
                        {t(`pricing.tiers.${tier.id}.name`)}
                      </h2>
                    </div>

                    {/* Price */}
                    <div className={`flex items-baseline gap-1.5 pb-5 border-b ${tier.featured ? 'border-[#1A314D]' : 'border-slate-200/80 dark:border-[#1A314D]'}`}>
                      {price === null ? (
                        <span className={`text-3xl font-black tracking-tight ${tier.featured ? 'text-white' : 'text-[#0B1A2D] dark:text-white'}`}>
                          {t('pricing.customPrice')}
                        </span>
                      ) : (
                        <>
                          <span className={`text-4xl font-black font-mono tabular-nums tracking-tight ${tier.featured ? 'text-[#B7F229]' : 'text-[#0B1A2D] dark:text-white'}`}>
                            {price}€
                          </span>
                          <span className={`text-xs font-medium ${tier.featured ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            {t('pricing.perMonth')}
                          </span>
                        </>
                      )}
                    </div>

                    <p className={`text-xs leading-relaxed min-h-10 ${tier.featured ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                      {t(`pricing.tiers.${tier.id}.desc`)}
                    </p>

                    <ul className={`space-y-3 pt-4 border-t ${tier.featured ? 'border-[#1A314D]' : 'border-slate-200/80 dark:border-[#1A314D]'}`}>
                      {Array.from({ length: tier.featureCount }).map((_, idx) => (
                        <li
                          key={idx}
                          className={`text-xs flex items-start gap-2.5 ${tier.featured ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}
                        >
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.featured ? 'text-[#B7F229]' : 'text-[#8B5CF6] dark:text-[#B7F229]'}`} />
                          <span>{t(`pricing.tiers.${tier.id}.f${idx + 1}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`pt-6 mt-6 border-t ${tier.featured ? 'border-[#1A314D]' : 'border-slate-200/80 dark:border-[#1A314D]'}`}>
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(tier.id)}
                      className={`w-full min-h-[44px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                        tier.featured
                          ? 'bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D]'
                          : 'bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-white dark:text-[#0B1A2D] dark:hover:bg-slate-100'
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

          {/* Guarantee Banner */}
          <section className="rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-8 sm:p-12 text-center space-y-5 max-w-4xl mx-auto">
            <div className="w-11 h-11 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229]/15 text-[#B7F229] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#0B1A2D] dark:text-white tracking-tight">
              {t('pricing.finalBadge', 'Garantía y Compromiso Setmio: Alta Guiada y Migración Sin Costes Ocultos')}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
              {t('pricing.finalSubtitle', 'Configuramos tu club, importamos tu base de socios y te formamos a ti y a tu equipo de recepción de forma completamente gratuita. Sin contratos de permanencia ni costes de alta ocultos.')}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRegisterCta}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs transition cursor-pointer active:scale-95"
              >
                <span>{t('pricing.registerBtn', 'Registrarse')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenDemo}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-[#0B1A2D] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#8B5CF6] text-[#0B1A2D] dark:text-white font-bold text-xs transition cursor-pointer active:scale-95"
              >
                <span>{t('pricing.demoBtn', 'Ver demo')}</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PricingView;
