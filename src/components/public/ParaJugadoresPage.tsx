import React from 'react';
import {
  Bot,
  Check,
  ChevronRight,
  Link2,
  Play,
  Smartphone,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useApp, PublicPage } from '../../context/AppContext';
import {
  CorporateContainer,
  CorporateCtaBanner,
  CorporateEyebrow,
  CorporateMediaFrame,
  CorporatePrimaryButton,
  CorporateSecondaryButton,
  navigateCorporateRoute,
} from './corporate/CorporatePrimitives';
import playerFocusImg from '../../assets/images/setmio_player_focus_1795368971038.jpg';

interface ParaJugadoresPageProps {
  onBack?: () => void;
  onOpenDemo: () => void;
  onOpenRegister?: () => void;
}

export function ParaJugadoresPage({
  onBack: _onBack,
  onOpenDemo,
  onOpenRegister,
}: ParaJugadoresPageProps) {
  const { setCurrentView, setPublicPage } = useApp();

  void _onBack;

  const navigate = (path: string, page: PublicPage) => {
    navigateCorporateRoute(path, page, setPublicPage);
  };

  const handleOpenPlayerPortal = () => {
    setCurrentView('player');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleRegisterClick = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/registro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    onOpenRegister?.();
  };

  const pillars = [
    {
      number: '01',
      icon: TrendingUp,
      title: 'Estadísticas de partidos y evolución',
      desc: 'Lleva el registro completo de tus encuentros jugados, sets ganados, rachas de victorias y progresión real de tu nivel deportivo.',
      bullets: [
        'Balance por formato: partido amistoso, liga por equipos o torneo',
        'Evolución histórica de nivel y frecuencia de juego mensual',
        'Registro claro de resultados y duración de cada partido',
      ],
    },
    {
      number: '02',
      icon: Users,
      title: 'Análisis de compañeros y rivales',
      desc: 'Descubre con qué pareja obtienes mejor rendimiento, cómo rindes en drive frente a revés y tu historial contra rivales frecuentes.',
      bullets: [
        'Porcentaje de victorias desglosado por compañero habitual',
        'Historial directo frente a parejas o rivales recurrentes',
        'Comparativa equilibrada para preparar partidos de liga',
      ],
    },
    {
      number: '03',
      icon: Bot,
      title: 'Asistente de entrenador con IA',
      desc: 'Un copiloto táctico que interpreta tus estadísticas recientes para proponerte focos de mejora en entrenamientos y estrategia de partido.',
      bullets: [
        'Lectura clara de patrones en terceros sets o desempates',
        'Recomendaciones prácticas antes de jugar con un compañero concreto',
        'Seguimiento conectado a las observaciones de tu entrenador',
      ],
    },
    {
      number: '04',
      icon: Link2,
      title: 'Conexión directa con tus clubes',
      desc: 'Vincula tu perfil con el enlace oficial de los clubes donde ya juegas para reservar pista, consultar tu saldo y ver tu PIN de acceso.',
      bullets: [
        'Acceso directo a la web de reserva propia de tu club habitual',
        'Monedero, bonos activos y pago dividido sin salir de tu entidad',
        'Código PIN de acceso domótico listo antes de entrar a pista',
      ],
    },
  ];

  return (
    <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200 overflow-x-clip">
      {/* 1. COMPACT HERO & SINGLE-LINE BREADCRUMB */}
      <section className="border-b border-slate-200/80 dark:border-[#1A314D] py-7 sm:py-11">
        <CorporateContainer className="space-y-6 sm:space-y-8">
          <nav
            aria-label="Ruta de navegación"
            className="flex items-center gap-1.5 text-xs whitespace-nowrap min-w-0"
          >
            <button
              type="button"
              onClick={() => navigate('/', 'home')}
              className="font-medium text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer shrink-0"
            >
              Inicio
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />
            <button
              type="button"
              onClick={() => navigate('/soluciones', 'solutions')}
              className="font-medium text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer shrink-0"
            >
              Soluciones
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />
            <span className="font-semibold text-[#0B1A2D] dark:text-white truncate min-w-0">
              Setmio Player
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center animate-float-in">
            <div className="lg:col-span-6 space-y-5 min-w-0">
              <CorporateEyebrow accent="violet">
                Setmio Player · Espacio Personal del Jugador
              </CorporateEyebrow>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
                Analiza tu juego, tus parejas y conecta directo con tus clubes.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Setmio Player está centrado en el rendimiento real del jugador: estadísticas de partido, análisis de compañeros y rivales, asistente de entrenador con IA y enlace directo con las instalaciones donde compites y entrenas.
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-1">
                <CorporatePrimaryButton
                  onClick={handleOpenPlayerPortal}
                  icon={<Smartphone className="w-4 h-4 shrink-0" />}
                >
                  Abrir Setmio Player
                </CorporatePrimaryButton>

                <CorporateSecondaryButton
                  onClick={onOpenDemo}
                  icon={<Play className="w-3.5 h-3.5 fill-current shrink-0" />}
                >
                  Explorar demo por perfil
                </CorporateSecondaryButton>
              </div>
            </div>

            <div className="lg:col-span-6 min-w-0">
              <CorporateMediaFrame
                src={playerFocusImg}
                alt="Equipación y pista de pádel para análisis en Setmio Player"
                aspectClass="aspect-[4/3]"
                fallbackLabel="Setmio Player · Rendimiento Individual"
              />
            </div>
          </div>
        </CorporateContainer>
      </section>

      {/* 2. 4 CORE PILLARS */}
      <section className="py-10 sm:py-16 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
        <CorporateContainer className="space-y-8">
          <div className="max-w-2xl space-y-2.5">
            <CorporateEyebrow accent="lime">Capacidades de Setmio Player</CorporateEyebrow>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white font-display">
              Diseñado para tu progresión en pista, sin ruido comercial.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.number}
                  className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none space-y-4 min-w-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] tabular-nums">
                      {pillar.number}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#0B1A2D] dark:text-white font-display leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>

                  <ul className="space-y-2 pt-3 border-t border-slate-100 dark:border-[#1A314D] text-xs text-slate-700 dark:text-slate-300">
                    {pillar.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </CorporateContainer>
      </section>

      {/* 3. CLOSING DARK CTA BANNER */}
      <section className="py-14 sm:py-18">
        <CorporateContainer>
          <CorporateCtaBanner
            eyebrow="Vínculo Directo Club — Jugador"
            title="Conecta tu organización con la experiencia de Setmio Player"
            subtitle="Activa Setmio Pro bajo tu dominio propio con puesta en marcha asistida o explora la plataforma por perfil."
            primaryLabel="Registrarse"
            onPrimary={handleRegisterClick}
            secondaryLabel="Explorar demo por perfil"
            onSecondary={onOpenDemo}
          />
        </CorporateContainer>
      </section>
    </div>
  );
}

export default ParaJugadoresPage;
