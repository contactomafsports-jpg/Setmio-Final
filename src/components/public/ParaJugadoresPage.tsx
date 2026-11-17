import React from 'react';
import {
  Smartphone,
  Calendar,
  Users,
  Trophy,
  Wallet,
  Zap,
  CheckCircle2,
  ArrowRight,
  Activity,
  Play,
} from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { useApp } from '../../context/AppContext';

interface ParaJugadoresPageProps {
  onBack: () => void;
  onOpenDemo: () => void;
  onOpenRegister?: () => void;
}

export function ParaJugadoresPage({ onBack, onOpenDemo }: ParaJugadoresPageProps) {
  const { t, setCurrentView } = useApp();

  const handleOpenPlayerPortal = () => {
    setCurrentView('player');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const playerFeaturesMeta = [
    { id: 1, icon: Calendar },
    { id: 2, icon: Users },
    { id: 3, icon: Wallet },
    { id: 4, icon: Zap },
    { id: 5, icon: Trophy },
    { id: 6, icon: Activity },
  ];

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-slate-100 px-4 py-12 sm:px-6 lg:px-8 lg:py-20 transition-colors duration-200">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-start">
          <SubpageHeaderNav onBack={onBack} className="mb-0" />
        </div>

        <div className="space-y-20">
          {/* Hero Section para Jugadores */}
          <section className="rounded-3xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#8B5CF6] dark:text-[#a78bfa]">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>{t('playerPage.eyebrow', 'Portal Setmio Player')}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] text-balance">
                  {t('playerPage.title', 'Tu partido de pádel,')}{' '}
                  <span className="text-[#8B5CF6] dark:text-[#B7F229]">
                    {t('playerPage.titleHighlight', 'en un solo toque')}
                  </span>
                </h1>

                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                  {t('playerPage.subtitle', 'Reserva pistas en segundos, divide el pago con tus amigos, consulta tu PIN de acceso domótico y sigue la evolución de tu nivel deportivo.')}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleOpenPlayerPortal}
                    className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Smartphone className="w-4 h-4 shrink-0" />
                    <span>{t('playerPage.ctaMain', 'Abrir Portal del Jugador')}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={onOpenDemo}
                    className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-[#0B1A2D] hover:bg-slate-50 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-white font-semibold text-sm border border-slate-200 dark:border-[#1A314D] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-[#8B5CF6] dark:text-[#a78bfa]" />
                    <span>{t('playerPage.ctaDemo', 'Explorar Demo Club')}</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-200/80 dark:border-[#1A314D] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] dark:text-[#B7F229] shrink-0" />
                    <span>{t('playerPage.stat1', 'Sin comisiones de gestión')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] dark:text-[#B7F229] shrink-0" />
                    <span>{t('playerPage.stat2', 'Pago dividido automático')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] dark:text-[#B7F229] shrink-0" />
                    <span>{t('playerPage.stat3', 'Acceso PIN directo a pista')}</span>
                  </div>
                </div>
              </div>

              {/* Mobile App Preview Frame */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[336px] rounded-3xl bg-[#0B1A2D] text-white border border-[#1A314D] p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-400 pb-3 border-b border-[#1A314D]">
                    <span>19:30</span>
                    <span className="text-[#B7F229] font-semibold tracking-wide">
                      {t('home.player.cardTitle', 'SETMIO PLAYER')}
                    </span>
                    <span>iOS · Android</span>
                  </div>

                  {/* Next Match Summary (flat hairline inside phone frame, zero nested box shadow) */}
                  <div className="space-y-2 pb-4 border-b border-[#1A314D]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#a78bfa]">
                        {t('home.player.nextMatch', 'Próximo Partido')}
                      </span>
                      <span className="text-[#B7F229] font-medium">
                        {t('common.confirmed', 'Confirmado')}
                      </span>
                    </div>
                    <div className="font-bold text-white text-base font-mono tabular-nums">
                      {t('playerPage.todayMatch', 'Hoy 19:30 - 21:00')}
                    </div>
                    <div className="text-xs text-slate-300">
                      {t('playerPage.courtExample', 'Pista 1 Central · Pádel San Mateo')}
                    </div>
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-300">
                      <span>
                        {t('home.player.pinLabel', 'PIN de acceso:')}{' '}
                        <strong className="font-mono tabular-nums text-[#B7F229] text-sm">#4829</strong>
                      </span>
                      <span className="font-mono tabular-nums">
                        {t('playerPage.yourShare', 'Tu parte:')}{' '}
                        <strong className="text-white">7,00 €</strong>
                      </span>
                    </div>
                  </div>

                  {/* Key Player Metrics */}
                  <div className="grid grid-cols-2 divide-x divide-[#1A314D] py-1">
                    <div className="pr-4">
                      <span className="text-[11px] text-slate-400 block">
                        {t('home.player.levelLabel', 'Nivel Deportivo')}
                      </span>
                      <span className="text-xl font-bold text-[#a78bfa] font-mono tabular-nums mt-0.5 block">
                        3.85
                      </span>
                    </div>
                    <div className="pl-4">
                      <span className="text-[11px] text-slate-400 block">
                        {t('home.player.walletLabel', 'Saldo Monedero')}
                      </span>
                      <span className="text-xl font-bold text-[#B7F229] font-mono tabular-nums mt-0.5 block">
                        45,00 €
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenPlayerPortal}
                    className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition-colors text-center cursor-pointer whitespace-nowrap"
                  >
                    {t('playerPage.openPortalBtn', 'Abrir Portal del Jugador')}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Grid de Funcionalidades para Jugadores */}
          <section className="space-y-8">
            <div className="text-left space-y-2 max-w-2xl">
              <div className="text-xs font-semibold tracking-wide text-[#8B5CF6] dark:text-[#a78bfa]">
                {t('playerPage.experienceEyebrow', 'Experiencia del Jugador')}
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#0B1A2D] dark:text-white tracking-tight text-balance">
                {t('playerPage.experienceTitle', 'Todo lo que necesitas para tu partido semanal')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                {t('playerPage.experienceSubtitle', 'Diseñado pensando exclusivamente en la agilidad del jugador amateur y competitivo.')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playerFeaturesMeta.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.id}
                    className="rounded-2xl border border-slate-200/80 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] p-7 flex flex-col justify-between hover:border-[#8B5CF6]/50 dark:hover:border-[#B7F229]/40 transition-colors"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-[#a78bfa] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {t(`playerPage.f${feat.id}.badge`, 'Setmio Player')}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white tracking-tight">
                        {t(`playerPage.f${feat.id}.title`, `Funcionalidad ${feat.id}`)}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {t(`playerPage.f${feat.id}.desc`, '')}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0B1A2D] dark:text-[#B7F229]">
                        {t(`playerPage.f${feat.id}.highlight`, 'Incluido')}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CTA Banner Final */}
          <section className="rounded-3xl bg-[#0B1A2D] border border-[#1A314D] p-8 sm:p-12 text-center space-y-5 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
              {t('playerPage.ctaClubTitle', '¿Gestionas un club o escuela de pádel?')}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              {t('playerPage.ctaClubDesc', 'Descubre cómo Setmio conecta la experiencia del jugador con tu sistema de gestión de cuadrante, domótica IoT y facturación para aumentar tus ingresos sin esfuerzo.')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenPlayerPortal}
                className="min-h-[44px] px-6 py-3 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                {t('playerPage.enterPortal', 'Entrar al Portal del Jugador')}
              </button>
              <button
                type="button"
                onClick={onBack}
                className="min-h-[44px] px-6 py-3 rounded-xl bg-[#132A45] hover:bg-[#1A314D] text-white font-semibold text-sm border border-[#1A314D] transition-colors cursor-pointer whitespace-nowrap"
              >
                {t('playerPage.viewClubSolutions', 'Ver Soluciones para Clubes')}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ParaJugadoresPage;
