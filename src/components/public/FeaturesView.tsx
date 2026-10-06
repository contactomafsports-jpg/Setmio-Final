import React from 'react';
import { useApp } from '../../context/AppContext';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import {
  Sparkles,
  Calendar,
  GraduationCap,
  Coffee,
  Trophy,
  Users,
  CreditCard,
  Bot,
  Globe,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Layers,
  Zap,
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
    { id: 0, icon: Calendar, color: 'from-emerald-500 to-teal-700', bulletCount: 4 },
    { id: 1, icon: GraduationCap, color: 'from-cyan-500 to-blue-700', bulletCount: 4 },
    { id: 2, icon: Coffee, color: 'from-emerald-500 to-teal-700', bulletCount: 4 },
    { id: 3, icon: Trophy, color: 'from-purple-500 to-pink-700', bulletCount: 4 },
    { id: 4, icon: Users, color: 'from-blue-500 to-indigo-700', bulletCount: 4 },
    { id: 5, icon: CreditCard, color: 'from-emerald-600 to-teal-800', bulletCount: 4 },
    { id: 6, icon: Bot, color: 'from-violet-500 to-purple-800', bulletCount: 4 },
    { id: 7, icon: Globe, color: 'from-teal-500 to-cyan-700', bulletCount: 4 },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation & Action */}
        <div className="flex items-center justify-between">
          <SubpageHeaderNav onBack={handleBack} />

          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
            >
              {t('features.register', 'Activar Mi Club')}
            </button>
          )}
        </div>

        {/* Hero alineado a la izquierda */}
        <div className="text-left space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-bold">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>{t('features.eyebrow', 'Módulos de Software SaaS Setmio')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {t('features.mainTitle', 'Módulos y Funcionalidades de Setmio')}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            {t('features.mainSubtitle', 'Una plataforma modular y conectada para profesionalizar la gestión deportiva, automatizar reservas y cobros, y ofrecer a tus jugadores la mejor experiencia del pádel.')}
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {softwareModulesMeta.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.id}
                className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 space-y-6 flex flex-col justify-between hover:border-emerald-500/50"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {t(`features.module.${item.id}.badge`)}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {t(`features.module.${item.id}.title`)}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {t(`features.module.${item.id}.desc`)}
                    </p>
                  </div>

                  <ul className="space-y-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    {Array.from({ length: item.bulletCount }).map((_, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
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
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 border border-emerald-500/30 p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{t('features.domoticaBadge', 'Hardware & Pistas Inteligentes')}</span>
            <h3 className="text-2xl font-black">{t('features.domoticaTitle', '¿Buscas automatizar luces y cerraduras?')}</h3>
            <p className="text-xs text-slate-300 max-w-xl">
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
            className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <span>{t('features.domoticaBtn', 'Ver Módulos de Domótica IoT')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </div>
    </main>
  );
};
