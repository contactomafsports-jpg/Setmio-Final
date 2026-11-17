import React from 'react';
import { useApp } from '../../context/AppContext';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import {
  Calendar,
  GraduationCap,
  Coffee,
  Trophy,
  Users,
  CreditCard,
  Bot,
  Globe,
  CheckCircle2,
  ArrowRight,
  Layers,
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

  const softwareModulesMeta = [
    { id: 0, icon: Calendar, accent: 'lime' as const, bulletCount: 4 },
    { id: 1, icon: GraduationCap, accent: 'violet' as const, bulletCount: 4 },
    { id: 2, icon: Coffee, accent: 'lime' as const, bulletCount: 4 },
    { id: 3, icon: Trophy, accent: 'violet' as const, bulletCount: 4 },
    { id: 4, icon: Users, accent: 'lime' as const, bulletCount: 4 },
    { id: 5, icon: CreditCard, accent: 'violet' as const, bulletCount: 4 },
    { id: 6, icon: Bot, accent: 'violet' as const, bulletCount: 4 },
    { id: 7, icon: Globe, accent: 'lime' as const, bulletCount: 4 },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white py-12 sm:py-20 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <SubpageHeaderNav onBack={handleBack} className="mb-0" />

          {onOpenOnboarding && (
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs transition cursor-pointer active:scale-95"
            >
              {t('features.register', 'Activar Mi Club')}
            </button>
          )}
        </div>

        <div className="space-y-16">
          {/* Header */}
          <div className="text-left space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8B5CF6] dark:text-[#a78bfa]">
              <Layers className="w-4 h-4" />
              <span>{t('features.eyebrow', 'Módulos de Software SaaS Setmio')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0B1A2D] dark:text-white tracking-tight leading-[1.08]">
              {t('features.mainTitle', 'Módulos y Funcionalidades de Setmio')}
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed font-normal">
              {t('features.mainSubtitle', 'Una plataforma modular y conectada para profesionalizar la gestión deportiva, automatizar reservas y cobros, y ofrecer a tus jugadores la mejor experiencia del pádel.')}
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {softwareModulesMeta.map((item) => {
              const Icon = item.icon;
              const isLime = item.accent === 'lime';
              return (
                <article
                  key={item.id}
                  className="p-8 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#8B5CF6]/50 dark:hover:border-[#B7F229]/50 transition-colors space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          isLime
                            ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229]/15 dark:text-[#B7F229]'
                            : 'bg-[#8B5CF6]/15 text-[#8B5CF6] dark:text-[#a78bfa]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t(`features.module.${item.id}.badge`)}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-xl font-black text-[#0B1A2D] dark:text-white">
                        {t(`features.module.${item.id}.title`)}
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        {t(`features.module.${item.id}.desc`)}
                      </p>
                    </div>

                    <ul className="space-y-2.5 pt-4 border-t border-slate-200/80 dark:border-[#1A314D] text-xs text-slate-700 dark:text-slate-300">
                      {Array.from({ length: item.bulletCount }).map((_, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                          <span>{t(`features.module.${item.id}.f.${fIdx}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>

          {/* CTA to Domótica */}
          <section className="rounded-2xl bg-[#0B1A2D] dark:bg-[#071220] border border-[#1A314D] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-[#B7F229] uppercase tracking-[0.16em]">
                {t('features.domoticaBadge', 'Hardware & Pistas Inteligentes')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                {t('features.domoticaTitle', '¿Buscas automatizar luces y cerraduras?')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {t('features.domoticaDesc', 'Descubre nuestro módulo exclusivo de Domótica IoT para control de iluminación LED, aperturas por PIN temporal y cámaras de repetición.')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                window.history.pushState({}, '', '/domotica');
                setPublicPage('modules');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="min-h-[44px] px-6 py-3.5 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs transition flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
            >
              <span>{t('features.domoticaBtn', 'Ver Módulos de Domótica IoT')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        </div>
      </div>
    </main>
  );
};
