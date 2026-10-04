import React from 'react';
import { useApp } from '../../context/AppContext';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Globe,
  Smartphone,
  Bot,
  Calendar,
  Users,
  Trophy,
  ShoppingBag,
  CreditCard,
  Shield,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface FeaturesViewProps {
  onBack?: () => void;
  onOpenOnboarding?: () => void;
}

export const FeaturesView: React.FC<FeaturesViewProps> = ({
  onBack,
  onOpenOnboarding,
}) => {
  const { setPublicPage, setIsCorporateLanding, t } = useApp();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setIsCorporateLanding(true);
      setPublicPage('home');
    }
  };

  const featurePillars = [
    {
      icon: Globe,
      color: 'from-emerald-500 to-teal-700',
      titleKey: 'features.pillars.0.title',
      subtitleKey: 'features.pillars.0.subtitle',
      features: [
        'features.pillars.0.feature.0',
        'features.pillars.0.feature.1',
        'features.pillars.0.feature.2',
        'features.pillars.0.feature.3',
      ],
    },
    {
      icon: Smartphone,
      color: 'from-cyan-500 to-blue-700',
      titleKey: 'features.pillars.1.title',
      subtitleKey: 'features.pillars.1.subtitle',
      features: [
        'features.pillars.1.feature.0',
        'features.pillars.1.feature.1',
        'features.pillars.1.feature.2',
        'features.pillars.1.feature.3',
      ],
    },
    {
      icon: Users,
      color: 'from-indigo-500 to-purple-700',
      titleKey: 'features.pillars.2.title',
      subtitleKey: 'features.pillars.2.subtitle',
      features: [
        'features.pillars.2.feature.0',
        'features.pillars.2.feature.1',
        'features.pillars.2.feature.2',
        'features.pillars.2.feature.3',
      ],
    },
    {
      icon: Bot,
      color: 'from-amber-500 to-orange-700',
      titleKey: 'features.pillars.3.title',
      subtitleKey: 'features.pillars.3.subtitle',
      features: [
        'features.pillars.3.feature.0',
        'features.pillars.3.feature.1',
        'features.pillars.3.feature.2',
        'features.pillars.3.feature.3',
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-200">
      {/* 1. TOP HEADER & BACK BUTTON */}
      <div className="flex items-center justify-between">
  <SubpageHeaderNav onBack={handleBack} />

  <div className="flex items-center gap-3">
  {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
            >
              {t('features.register', 'Registrar Club')}
            </button>
          )}
        </div>
      </div>

      {/* 2. HERO */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>{t('features.eyebrow', 'Ecosistema Tecnológico de Nueva Generación')}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('features.title', 'Funcionalidades de')} <span className="text-emerald-600 dark:text-emerald-400">Setmio</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          {t('features.description', 'Software de Marca Blanca integral para profesionales del pádel. Diseñado para simplificar la gestión deportiva, maximizar la ocupación de pistas y potenciar la comunidad.')}
        </p>
      </div>

      {/* 3. PILLARS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featurePillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <div
              key={i}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {t(pillar.titleKey, pillar.titleKey)}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {t(pillar.subtitleKey, pillar.subtitleKey)}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {pillar.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{t(feat, feat)}</span>
                    </div>
                  ))}
                </div>
              </div>

  <div className="pt-4 border-t border-slate-100 dark:border-slate-800" />
            </div>
          );
        })}
      </div>

      {/* 4. BOTTOM CTA BANNER */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black">
            {t('features.ctaTitle', '¿Listo para modernizar tu club de pádel?')}
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            {t('features.ctaDescription', 'Agenda una demostración con nuestro equipo técnico.')}
          </p>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition hover:scale-[1.02] shrink-0 flex items-center gap-2"
        >
          <span>{t('features.start', 'Comenzar Ahora')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
