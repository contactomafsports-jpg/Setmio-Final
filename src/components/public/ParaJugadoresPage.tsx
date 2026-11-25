import React from 'react';
import {
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
  CorporateMediaFrame,
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

          {/* Clean Architectural Player Visual */}
          <div className="lg:col-span-6">
            <CorporateMediaFrame
              src={playerFocusImg}
              alt="Equipación y pista de pádel para análisis en Setmio Player"
              aspectClass="aspect-[4/3]"
              fallbackLabel="Setmio Player · Rendimiento Individual"
            />
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
