import React from 'react';
import {
  Activity,
  Bot,
  Check,
  Link2,
  Play,
  Smartphone,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useApp, PublicPage } from '../../context/AppContext';
import {
  CorporateBreadcrumb,
  CorporateContainer,
  CorporateCtaBanner,
  CorporateEyebrow,
  CorporatePrimaryButton,
  CorporateSecondaryButton,
  navigateCorporateRoute,
} from './corporate/CorporatePrimitives';
import playerFocusImg from '../../assets/images/setmio_player_focus_1795368971038.jpg';

interface ParaJugadoresPageProps {
  onBack: () => void;
  onOpenDemo: () => void;
  onOpenRegister?: () => void;
}

export function ParaJugadoresPage({ onBack, onOpenDemo }: ParaJugadoresPageProps) {
  const { setCurrentView, setPublicPage } = useApp();

  const navigate = (path: string, page: PublicPage) => {
    navigateCorporateRoute(path, page, setPublicPage);
  };

  const handleOpenPlayerPortal = () => {
    setCurrentView('player');
    window.scrollTo({ top: 0, behavior: 'instant' });
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
    <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white py-12 sm:py-16 transition-colors duration-200">
      <CorporateContainer className="space-y-16">
        <CorporateBreadcrumb
          items={[
            { label: 'Inicio', onClick: () => navigate('/', 'home') },
            { label: 'Setmio Player' },
          ]}
          onBack={onBack}
          backLabel="Volver al inicio"
        />

        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <CorporateEyebrow accent="violet">
              Setmio Player · Espacio Personal del Jugador
            </CorporateEyebrow>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
              Analiza tu juego, tus parejas y conecta directo con tus clubes.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Setmio Player está centrado en el rendimiento real del jugador: estadísticas de partido, análisis de compañeros y rivales, asistente de entrenador con IA y enlace directo con los clubes donde compites y entrenas.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <CorporatePrimaryButton
                onClick={handleOpenPlayerPortal}
                icon={<Smartphone className="w-4 h-4 shrink-0" />}
              >
                Abrir portal de jugador
              </CorporatePrimaryButton>

              <CorporateSecondaryButton
                onClick={onOpenDemo}
                icon={<Play className="w-3.5 h-3.5 fill-current" />}
              >
                Explorar demo por rol
              </CorporateSecondaryButton>
            </div>
          </div>

          {/* Minimalist Architectural Player Preview */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200/90 dark:border-[#1A314D] bg-[#F7F9FC] dark:bg-[#0E2239] overflow-hidden">
              <div className="aspect-[16/9] overflow-hidden bg-[#0B1A2D] relative">
                <img
                  src={playerFocusImg}
                  alt="Equipación y pista de pádel para análisis en Setmio Player"
                  className="w-full h-full object-cover object-center"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D]/85 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#B7F229] font-bold">
                      Ficha de rendimiento personal
                    </div>
                    <div className="text-sm font-bold mt-0.5">
                      Seguimiento táctico y vínculo directo con tu club
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 space-y-5">
                <div className="grid grid-cols-3 divide-x divide-slate-200/80 dark:divide-[#1A314D]">
                  <div className="pr-4">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Partidos registrados
                    </div>
                    <div className="font-mono text-xl font-bold text-[#0B1A2D] dark:text-white tabular-nums mt-1">
                      48
                    </div>
                  </div>
                  <div className="px-4">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Éxito con pareja habitual
                    </div>
                    <div className="font-mono text-xl font-bold text-[#0B1A2D] dark:text-[#B7F229] tabular-nums mt-1">
                      68%
                    </div>
                  </div>
                  <div className="pl-4">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Clubes vinculados
                    </div>
                    <div className="font-mono text-xl font-bold text-[#0B1A2D] dark:text-white tabular-nums mt-1">
                      2
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/80 dark:border-[#1A314D] flex items-start gap-3">
                  <Activity className="w-4 h-4 text-[#8B5CF6] dark:text-[#B7F229] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Tu resumen combina evolución de partido, lectura de emparejamientos y enlace directo a las reservas y códigos de acceso de tus clubes habituales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars */}
        <section className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <CorporateEyebrow>Capacidades de Setmio Player</CorporateEyebrow>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white font-display">
              Diseñado para tu progresión en pista, sin ruido comercial.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.number}
                  className="p-7 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229]/15 text-[#B7F229] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {pillar.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0B1A2D] dark:text-white font-display">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>

                  <ul className="space-y-2 pt-3 border-t border-slate-200/80 dark:border-[#1A314D] text-xs text-slate-700 dark:text-slate-300">
                    {pillar.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <CorporateCtaBanner
          eyebrow="Vínculo Directo Club — Jugador"
          title="¿Quieres probar la experiencia de jugador o gestionar tu club con Setmio?"
          subtitle="Explora la vista interactiva del portal del jugador o conoce cómo Setmio Pro conecta directamente con tus socios sin intermediarios."
          primaryLabel="Abrir portal del jugador"
          onPrimary={handleOpenPlayerPortal}
          secondaryLabel="Ver soluciones Setmio Pro"
          onSecondary={() => navigate('/soluciones', 'solutions')}
        />
      </CorporateContainer>
    </main>
  );
}

export default ParaJugadoresPage;
