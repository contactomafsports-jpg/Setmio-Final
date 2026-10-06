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

  const handleDownloadApp = () => {
    // Navigate to player portal demo or install prompt
    setCurrentView('player');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const playerFeatures = [
    {
      icon: Calendar,
      title: 'Reserva en menos de 15 segundos',
      description:
        'Olvídate de llamar por teléfono o cruzar mensajes de WhatsApp. Consulta disponibilidad en tiempo real en todos tus clubes favoritos y reserva tu pista con un toque.',
      highlight: 'Disponibilidad 24/7',
      roleBadge: 'Alquiler: Jugador',
    },
    {
      icon: Users,
      title: 'Partidos Abiertos por Nivel',
      description:
        '¿Te falta un cuarto jugador? Únete a partidos abiertos filtrados por tu nivel dinámico (1.0 a 7.0). El sistema equilibra parejas para partidos siempre competitivos.',
      highlight: 'Level Matchmaking',
      roleBadge: 'Partidos: Jugador',
    },
    {
      icon: Wallet,
      title: 'Pago Dividido y Monedero Club',
      description:
        'Paga únicamente tu parte de la pista directamente desde tu saldo o tarjeta. Recarga tu monedero con bonificaciones exclusivas del club y olvídate de deudas entre amigos.',
      highlight: 'Cero morosidad',
      roleBadge: 'Finanzas: Jugador',
    },
    {
      icon: Trophy,
      title: 'Historial, Ranking y Estadísticas',
      description:
        'Accede a tu ficha deportiva completa: porcentaje de victorias, evolución de nivel, compañero más frecuente, rival habitual y posición en el ranking oficial del club.',
      highlight: 'Estadísticas Pro',
      roleBadge: 'Competición: Jugador',
    },
    {
      icon: Zap,
      title: 'Acceso y Focos Automatizados (IoT)',
      description:
        'Tu móvil es la llave del club. Abre puertas, tornos y activa la iluminación LED de tu pista automáticamente con código PIN o QR vinculado a tu reserva.',
      highlight: 'Autonomía Total',
      roleBadge: 'Domótica: Jugador',
    },
    {
      icon: Activity,
      title: 'Inscripción a Torneos y Pozos',
      description:
        'Inscríbete junto a tu pareja en torneos federados, ligas de fin de semana y pozos americanos. Consulta cuadros de juego en vivo, horarios y actas de partidos.',
      highlight: 'Ligas & Torneos',
      roleBadge: 'Torneos: Jugador',
    },
  ];

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 py-8 sm:px-6 lg:px-8 lg:py-16 transition-colors">
      <div className="mx-auto max-w-6xl">
        <SubpageHeaderNav onBack={onBack} />

        {/* Hero Section para Jugadores */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl mb-12">
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Setmio Player App · Para Jugadores de Pádel</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Juega más al pádel. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Sin esperas ni llamadas.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                La aplicación móvil diseñada para que encuentres pista, completes partidos por nivel, pagues tu parte y compitas con tus amigos en los mejores clubes.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadApp}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Probar App de Jugador</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenDemo}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition active:scale-95 cursor-pointer backdrop-blur-xs"
                >
                  <span>Ver Demo Completa</span>
                </button>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Web App PWA Instalable</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Nivel Oficial 1.0 - 7.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Pago Seguro Stripe / Bizum</span>
                </div>
              </div>
            </div>

            {/* Mobile App Mockup Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[300px] rounded-3xl bg-slate-900 border-4 border-slate-700/80 p-4 shadow-2xl space-y-3 relative">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span>9:41</span>
                  <span className="text-emerald-400 font-bold">SETMIO PLAY</span>
                  <span>100% 🔋</span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-emerald-400">Próximo Partido</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">Confirmado</span>
                  </div>
                  <div className="font-black text-white mt-1">Hoy 19:30 - 21:00</div>
                  <div className="text-[11px] text-slate-300">Pista 1 Central · Pádel San Mateo</div>
                  <div className="mt-2 pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[10px] text-emerald-300">
                    <span>PIN de acceso: <strong>#4829</strong></span>
                    <span>Tu cuota: <strong>7.00 € (Pagado)</strong></span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1.5">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Mi Rendimiento</div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Nivel Dinámico</span>
                    <span className="font-black text-emerald-400">3.85 ⭐</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Tasa de Victorias</span>
                    <span className="font-bold text-white">68% (+4 racha)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadApp}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition text-center shadow-xs cursor-pointer"
                >
                  Abrir Portal del Jugador
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Grid de Funcionalidades para Jugadores */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              Experiencia del Jugador
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Todo lo que necesitas para tu partido
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Diseñado pensando exclusivamente en la agilidad del jugador amateur y competitivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {playerFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-6 flex flex-col justify-between hover:border-emerald-500/50 transition shadow-xs group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
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

                  <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
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
        <section className="mt-12 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            ¿Gestionas un club o escuela de pádel?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Descubre cómo Setmio conecta la aplicación del jugador con tu sistema de reservas, TPV, escuela y domótica para aumentar tus ingresos y ahorrar horas de gestión.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
            >
              Ver Soluciones para Clubes
            </button>
            <button
              type="button"
              onClick={handleDownloadApp}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
            >
              Entrar al Portal del Jugador
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
