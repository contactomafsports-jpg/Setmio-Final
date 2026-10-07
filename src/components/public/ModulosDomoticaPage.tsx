import React, { useState } from 'react';
import {
  Zap,
  Lightbulb,
  LockKeyhole,
  Wifi,
  Video,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Power,
  Sliders,
  DollarSign,
  TrendingDown,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { useApp } from '../../context/AppContext';

interface ModulosDomoticaPageProps {
  onBack: () => void;
  onOpenDemo: () => void;
}

export interface DomoticaModuleMeta {
  id: string;
  itemKey: string;
  icon: React.ComponentType<{ className?: string }>;
  specsCount: number;
}

const DOMOTICA_MODULES_META: DomoticaModuleMeta[] = [
  { id: 'dom-luces', itemKey: 'item_1', icon: Lightbulb, specsCount: 4 },
  { id: 'dom-accesos', itemKey: 'item_2', icon: LockKeyhole, specsCount: 4 },
  { id: 'dom-video', itemKey: 'item_3', icon: Video, specsCount: 4 },
  { id: 'dom-clima', itemKey: 'item_4', icon: Thermometer, specsCount: 4 },
  { id: 'dom-radar', itemKey: 'item_5', icon: Wifi, specsCount: 4 },
  { id: 'dom-pantallas', itemKey: 'item_6', icon: Sliders, specsCount: 4 },
];

export function ModulosDomoticaPage({ onBack, onOpenDemo }: ModulosDomoticaPageProps) {
  const { t, language } = useApp();
  void language;

  // Estados interactivos para el simulador de hardware en vivo
  const [simCourtLight, setSimCourtLight] = useState<boolean>(true);
  const [simDoorLocked, setSimDoorLocked] = useState<boolean>(true);
  const [simKeyInput, setSimKeyInput] = useState<string>('');
  const [simAccessSuccess, setSimAccessSuccess] = useState<boolean | null>(null);

  const handleTestPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (simKeyInput === '4829' || simKeyInput === '1234') {
      setSimAccessSuccess(true);
      setSimDoorLocked(false);
      setTimeout(() => {
        setSimDoorLocked(true);
        setSimAccessSuccess(null);
        setSimKeyInput('');
      }, 3500);
    } else {
      setSimAccessSuccess(false);
      setTimeout(() => setSimAccessSuccess(null), 2500);
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-4 py-8 sm:px-6 lg:px-8 lg:py-16 transition-colors duration-200">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Navigation Button alineado a la izquierda */}
        <div className="flex items-center justify-start">
          <SubpageHeaderNav onBack={onBack} />
        </div>

        {/* Hero Header de Domótica & Automatizaciones (Alineado limpiamente a la izquierda) */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 lg:p-16 shadow-sm dark:shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('domotica.eyebrow')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {t('domotica.title')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
                {t('domotica.titleHighlight')}
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              {t('domotica.subtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenDemo}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <span>{t('domotica.ctaDemo')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('domotica.compatible')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Simulador Interactivo de Hardware IoT en Vivo */}
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>{t('domotica.simTitle')}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('domotica.simSubtitle')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-bold">
                {t('domotica.mqttBadge')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Control Simulado 1: Focos de Iluminación LED */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                      simCourtLight
                        ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('domotica.ledTitle')}</h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t('domotica.status')} {simCourtLight ? t('domotica.ledOn') : t('domotica.ledOff')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSimCourtLight(!simCourtLight)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    simCourtLight
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{simCourtLight ? t('domotica.turnOffLights') : t('domotica.turnOnLights')}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>{t('domotica.scheduledTime')}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{t('domotica.scheduledDetail')}</span>
              </div>
            </div>

            {/* Control Simulado 2: Cerradura Electrónica / Torno con PIN */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                      !simDoorLocked
                        ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <LockKeyhole className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('domotica.turnstileTitle')}</h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t('domotica.status')} {!simDoorLocked ? t('domotica.unlocked') : t('domotica.locked')}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    !simDoorLocked
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {!simDoorLocked ? t('domotica.authorized') : t('domotica.closed')}
                </span>
              </div>

              {/* Formulario de Test de PIN */}
              <form onSubmit={handleTestPin} className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  placeholder={t('domotica.pinPlaceholder')}
                  value={simKeyInput}
                  onChange={(e) => setSimKeyInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-emerald-500 text-center"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer active:scale-95"
                >
                  {t('domotica.validatePin')}
                </button>
              </form>

              {simAccessSuccess === true && (
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('domotica.pinSuccess')}</span>
                </div>
              )}
              {simAccessSuccess === false && (
                <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 animate-in fade-in">
                  <span>{t('domotica.pinError')}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Catálogo Exclusivo de Módulos de Domótica */}
        <section className="space-y-6">
          <div className="space-y-1 text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('domotica.catalogTitle')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('domotica.hardware.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DOMOTICA_MODULES_META.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.id}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-lg dark:hover:shadow-2xl transition duration-200 group shadow-xs"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        {t(`domotica.hardware.${item.itemKey}.badge`)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                        {t(`domotica.hardware.${item.itemKey}.title`)}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        {t(`domotica.hardware.${item.itemKey}.desc`)}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      {Array.from({ length: item.specsCount }).map((_, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{t(`domotica.hardware.${item.itemKey}.specs.${idx}`)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {t(`domotica.hardware.${item.itemKey}.kpi`)}
                    </span>
                    <button
                      type="button"
                      onClick={onOpenDemo}
                      className="text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-white transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t('domotica.auditClub')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Banner de Auditoría Técnica de Domótica */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 border border-emerald-500/30 p-8 sm:p-10 text-center space-y-4 shadow-xl text-white">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {t('domotica.bannerTitle')}
          </h3>
          <p className="text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed">
            {t('domotica.bannerSub')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenDemo}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              {t('domotica.bannerCta')}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ModulosDomoticaPage;
