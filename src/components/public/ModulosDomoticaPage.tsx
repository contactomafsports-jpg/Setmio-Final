import React, { useState } from 'react';
import {
  Zap,
  Lightbulb,
  LockKeyhole,
  Wifi,
  Video,
  Thermometer,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Power,
  Sliders,
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
    <main className="min-h-[calc(100vh-5rem)] bg-white text-[#0B1A2D] dark:bg-[#0B1A2D] dark:text-white px-4 py-12 sm:px-6 lg:px-8 lg:py-20 transition-colors duration-200">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-start">
          <SubpageHeaderNav onBack={onBack} className="mb-0" />
        </div>

        <div className="space-y-16">
          {/* Hero */}
          <section className="max-w-3xl space-y-5 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8B5CF6] dark:text-[#a78bfa]">
              <Zap className="w-4 h-4" />
              <span>{t('domotica.eyebrow')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08]">
              {t('domotica.title')}{' '}
              <span className="text-[#8B5CF6] dark:text-[#B7F229]">
                {t('domotica.titleHighlight')}
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              {t('domotica.subtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onOpenDemo}
                className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-sm transition active:scale-95 cursor-pointer"
              >
                <span>{t('domotica.ctaDemo')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] dark:text-[#B7F229] shrink-0" />
                <span>{t('domotica.compatible')}</span>
              </div>
            </div>
          </section>

          {/* Live IoT Hardware Simulator */}
          <section className="rounded-2xl border border-slate-200/80 dark:border-[#1A314D] bg-[#0B1A2D] text-white p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A314D] pb-5">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#B7F229] uppercase tracking-wider">
                  <Cpu className="w-4 h-4" />
                  <span>{t('domotica.simTitle')}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {t('domotica.simSubtitle')}
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-[#B7F229] font-semibold">
                <span className="h-2 w-2 rounded-full bg-[#B7F229]" />
                <span>{t('domotica.mqttBadge')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LED Lights Control */}
              <div className="p-6 rounded-2xl bg-[#0E2239] border border-[#1A314D] space-y-5 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                        simCourtLight
                          ? 'bg-[#B7F229] text-[#0B1A2D]'
                          : 'bg-[#071220] text-slate-400 border border-[#1A314D]'
                      }`}
                    >
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{t('domotica.ledTitle')}</h4>
                      <span className="text-[11px] text-slate-400">
                        {t('domotica.status')} {simCourtLight ? t('domotica.ledOn') : t('domotica.ledOff')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSimCourtLight(!simCourtLight)}
                    className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      simCourtLight
                        ? 'bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D]'
                        : 'bg-[#071220] hover:bg-[#132A45] text-slate-200 border border-[#1A314D]'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{simCourtLight ? t('domotica.turnOffLights') : t('domotica.turnOnLights')}</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-[#1A314D] text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{t('domotica.scheduledTime')}</span>
                  <span className="font-mono text-[#B7F229] font-semibold tabular-nums">{t('domotica.scheduledDetail')}</span>
                </div>
              </div>

              {/* Electronic Lock / PIN Test */}
              <div className="p-6 rounded-2xl bg-[#0E2239] border border-[#1A314D] space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                        !simDoorLocked
                          ? 'bg-[#B7F229] text-[#0B1A2D]'
                          : 'bg-[#071220] text-slate-400 border border-[#1A314D]'
                      }`}
                    >
                      <LockKeyhole className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{t('domotica.turnstileTitle')}</h4>
                      <span className="text-[11px] text-slate-400">
                        {t('domotica.status')} {!simDoorLocked ? t('domotica.unlocked') : t('domotica.locked')}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
                      !simDoorLocked ? 'text-[#B7F229]' : 'text-[#a78bfa]'
                    }`}
                  >
                    {!simDoorLocked ? t('domotica.authorized') : t('domotica.closed')}
                  </span>
                </div>

                <form onSubmit={handleTestPin} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder={t('domotica.pinPlaceholder')}
                    value={simKeyInput}
                    onChange={(e) => setSimKeyInput(e.target.value)}
                    className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-[#071220] border border-[#1A314D] text-white placeholder-slate-500 font-mono tabular-nums text-xs focus:outline-none focus:border-[#B7F229] text-center"
                  />
                  <button
                    type="submit"
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7c4def] text-white font-bold text-xs transition cursor-pointer active:scale-95"
                  >
                    {t('domotica.validatePin')}
                  </button>
                </form>

                {simAccessSuccess === true && (
                  <div className="text-[11px] font-semibold text-[#B7F229] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('domotica.pinSuccess')}</span>
                  </div>
                )}
                {simAccessSuccess === false && (
                  <div className="text-[11px] font-semibold text-[#a78bfa] flex items-center gap-1.5">
                    <span>{t('domotica.pinError')}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Catalog Grid */}
          <section className="space-y-8">
            <div className="space-y-1.5 text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B1A2D] dark:text-white tracking-tight">
                {t('domotica.catalogTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {t('domotica.hardware.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {DOMOTICA_MODULES_META.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200/80 dark:border-[#1A314D] bg-[#F8FAFC] dark:bg-[#0E2239] p-6 flex flex-col justify-between hover:border-[#8B5CF6]/60 dark:hover:border-[#B7F229]/60 transition-colors"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229]/15 text-[#B7F229] flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>

                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6] dark:text-[#a78bfa]">
                          {t(`domotica.hardware.${item.itemKey}.badge`)}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-black text-[#0B1A2D] dark:text-white leading-snug">
                          {t(`domotica.hardware.${item.itemKey}.title`)}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                          {t(`domotica.hardware.${item.itemKey}.desc`)}
                        </p>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-slate-200/80 dark:border-[#1A314D]">
                        {Array.from({ length: item.specsCount }).map((_, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                            <span>{t(`domotica.hardware.${item.itemKey}.specs.${idx}`)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-5 border-t border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between text-xs">
                      <span className="font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                        {t(`domotica.hardware.${item.itemKey}.kpi`)}
                      </span>
                      <button
                        type="button"
                        onClick={onOpenDemo}
                        className="text-[11px] font-bold text-[#8B5CF6] dark:text-[#a78bfa] hover:underline flex items-center gap-1 cursor-pointer"
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

          {/* Bottom Audit Banner */}
          <section className="rounded-2xl bg-[#0B1A2D] dark:bg-[#071220] border border-[#1A314D] p-8 sm:p-12 text-center space-y-5 text-white">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {t('domotica.bannerTitle')}
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t('domotica.bannerSub')}
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenDemo}
                className="min-h-[44px] px-7 py-3 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs transition cursor-pointer active:scale-95"
              >
                {t('domotica.bannerCta')}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ModulosDomoticaPage;
