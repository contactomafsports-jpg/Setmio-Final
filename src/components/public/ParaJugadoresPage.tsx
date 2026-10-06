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
  ShieldCheck,
  Activity,
  Star,
  Download,
  Lock,
  ChevronRight,
  Clock,
  MapPin,
  Check,
  Play,
} from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { useApp } from '../../context/AppContext';

interface ParaJugadoresPageProps {
  onBack: () => void;
  onOpenDemo: () => void;
  onOpenRegister?: () => void;
}

export function ParaJugadoresPage({ onBack, onOpenDemo, onOpenRegister }: ParaJugadoresPageProps) {
  const { t, setCurrentView } = useApp();

  const handleOpenPlayerPortal = () => {
    setCurrentView('player');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const playerFeatures = [
    {
      icon: Calendar,
      title: 'Reserva Rápida en Menos de 15 Segundos',
      description:
        'Consulta disponibilidad de pistas cubiertas, panorámicas o exteriores en tiempo real. Selecciona turno, divide el pago y recibe tu confirmación instantánea sin intermediarios ni llamadas.',
      highlight: 'Cuadrante en Tiempo Real',
      roleBadge: 'Reservas 24/7',
      technicalDetail: 'Prevención de colisiones de reserva por microsegundo y confirmación inmediata.',
    },
    {
      icon: Users,
      title: 'Partidos Abiertos con Nivel Dinámico (Play!)',
      description:
        '¿Te falta un cuarto jugador para tu partida? Crea o únete a partidos abiertos filtrados por tu nivel decimal exacto (ej. 3.75) y tu posición preferida en pista (drive, revés o indistinto).',
      highlight: 'Algoritmo Matchmaking',
      roleBadge: 'Partidos Nivelados',
      technicalDetail: 'Algoritmo ELO adaptado a pádel por parejas que recalcula el rating tras cada partido.',
    },
    {
      icon: Wallet,
      title: 'Pago Dividido Automático (Split Payments)',
      description:
        'Cada jugador paga su 25% de la pista directamente desde su propio móvil por Bizum, tarjeta o monedero virtual. Olvídate para siempre de perseguir a tus amigos para que te paguen.',
      highlight: 'Cero Deudas',
      roleBadge: '1/4 por Jugador',
      technicalDetail: 'Liquidación directa al banco del club sin retención de fondos ni comisiones a jugadores.',
    },
    {
      icon: Zap,
      title: 'Tu Teléfono es la Llave del Club (Domótica IoT)',
      description:
        'Al confirmar tu reserva, tu aplicación genera automáticamente el código PIN y código QR para abrir tornos, cancelas de pista y encender los focos LED en el horario exacto del partido.',
      highlight: 'Pistas Autónomas',
      roleBadge: 'Acceso Inteligente',
      technicalDetail: 'Integración nativa con relés industriales y cerraduras electrónicas IP con tolerancia offline.',
    },
    {
      icon: Trophy,
      title: 'Ficha Deportiva, Nivel y Estadísticas Pro',
      description:
        'Accede a tu historial deportivo completo: porcentaje de victorias, evolución de nivel decimal, compañero más frecuente, rival habitual y posición en el ranking oficial del club.',
      highlight: 'Rating Decimal',
      roleBadge: 'Competición & Ranking',
      technicalDetail: 'Registro pormenorizado de enfrentamientos y métricas de rendimiento por temporada.',
    },
    {
      icon: Activity,
      title: 'Inscripción a Torneos, Pozos y Ligas Sociales',
      description:
        'Inscríbete junto a tu pareja en torneos federados, ligas regulares de fin de semana y pozos americanos. Consulta cuadros de juego en vivo, horarios de partidos y resultados al instante.',
      highlight: 'Cuadros en Directo',
      roleBadge: 'Torneos Oficiales',
      technicalDetail: 'Generación automática de cuadros de eliminatorias y publicación de actas en tiempo real.',
    },
  ];

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 py-8 sm:px-6 lg:px-8 lg:py-16 transition-colors duration-200">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Navigation Button alineado a la izquierda */}
        <div className="flex items-center justify-start">
          <SubpageHeaderNav onBack={onBack} />
        </div>

        {/* Hero Section para Jugadores (Alineado limpiamente a la izquierda) */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 lg:p-16 shadow-sm dark:shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider border border-cyan-500/20">
                <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Setmio Player · Para Jugadores Particulares y Amateurs</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Juega más al pádel. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 dark:from-cyan-400 dark:via-teal-300 dark:to-emerald-400">
                  Sin esperas, llamadas ni deudas.
                </span>
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                El portal móvil definitivo para los apasionados del pádel. Encuentra pista en tus clubes favoritos, completa partidos con compañeros de tu mismo nivel, divide el pago y abre la pista con tu móvil.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleOpenPlayerPortal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-200 hover:scale-[1.02] cursor-pointer text-center active:scale-95"
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  <span>Conocer Setmio Player</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={onOpenDemo}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition active:scale-95 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Ver Demo Guiada</span>
                </button>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Reserva en 15 segundos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Nivel Decimal 1.0 - 7.0</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Split Payment con Bizum</span>
                </div>
              </div>
            </div>

            {/* Mobile App Mockup Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[320px] rounded-3xl bg-slate-900 text-white border-4 border-slate-700/80 p-5 shadow-2xl space-y-3.5 relative">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span>19:30</span>
                  <span className="text-cyan-400 font-bold">SETMIO PLAYER</span>
                  <span>100% 🔋</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-cyan-400">Próximo Partido</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">Confirmado</span>
                  </div>
                  <div className="font-black text-white text-sm">Hoy 19:30 - 21:00</div>
                  <div className="text-[11px] text-slate-300">Pista 1 Central · Pádel San Mateo</div>
                  <div className="pt-2 border-t border-cyan-800/40 flex items-center justify-between text-[10px] text-cyan-300">
                    <span>PIN de acceso: <strong className="font-mono text-white text-xs">#4829</strong></span>
                    <span>Tu parte: <strong className="text-emerald-400">7,00 €</strong> (Pagado)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Nivel Deportivo</span>
                    <span className="text-lg font-black text-cyan-400 font-mono">3.85 ⭐</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Saldo Monedero</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">45,00 €</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenPlayerPortal}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs transition text-center shadow-md cursor-pointer active:scale-95"
                >
                  Abrir Portal del Jugador
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Grid de Funcionalidades para Jugadores */}
        <section className="space-y-6">
          <div className="text-left space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Experiencia del Jugador
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Todo lo que necesitas para tu partido semanal
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              Diseñado pensando exclusivamente en la agilidad del jugador amateur y competitivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playerFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-lg transition-all duration-200 group shadow-xs"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-cyan-50 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {feat.roleBadge}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {feat.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">
                      {feat.highlight}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Banner Final */}
        <section className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            ¿Gestionas un club o escuela de pádel?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Descubre cómo Setmio conecta la experiencia del jugador con tu sistema de gestión de cuadrante, domótica IoT y facturación para aumentar tus ingresos sin esfuerzo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 transition cursor-pointer active:scale-95"
            >
              Ver Soluciones para Clubes
            </button>
            <button
              type="button"
              onClick={handleOpenPlayerPortal}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-md active:scale-95"
            >
              Entrar al Portal del Jugador
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ParaJugadoresPage;
