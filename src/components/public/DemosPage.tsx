import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Layers,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
  Users,
} from 'lucide-react';
import { useApp, PublicPage } from '../../context/AppContext';
import {
  CorporateContainer,
  CorporateCtaBanner,
  CorporateEyebrow,
  navigateCorporateRoute,
} from './corporate/CorporatePrimitives';

interface DemosPageProps {
  onOpenRegister?: () => void;
}

type DemoFilter = 'all' | 'business' | 'player_hq';

export const DemosPage: React.FC<DemosPageProps> = ({ onOpenRegister }) => {
  const { switchDemoAccount, setPublicPage } = useApp();
  const [activeFilter, setActiveFilter] = useState<DemoFilter>('all');

  const navigate = (path: string, page: PublicPage) => {
    navigateCorporateRoute(path, page, setPublicPage);
  };

  const handleLaunch = (
    demoId: 'club' | 'academy' | 'coach' | 'pro_athlete' | 'organizer' | 'setmio_player' | 'superadmin',
    subRole?: string
  ) => {
    switchDemoAccount(demoId, subRole);
  };

  const handleRegisterClick = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/registro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    onOpenRegister?.();
  };

  const filters: { id: DemoFilter; label: string; count: string }[] = [
    { id: 'all', label: 'Todas las demos', count: '07' },
    { id: 'business', label: 'Clubes, Eventos y Profesionales', count: '05' },
    { id: 'player_hq', label: 'Setmio Player y Superadmin', count: '02' },
  ];

  return (
    <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200 overflow-x-clip">
      {/* 1. COMPACT SINGLE-LINE BREADCRUMB, HERO & WRAPPED FILTERS */}
      <section className="border-b border-slate-200/80 dark:border-[#1A314D] py-7 sm:py-11">
        <CorporateContainer className="space-y-5 sm:space-y-6">
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
            <ChevronRight
              className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0"
              aria-hidden="true"
            />
            <span className="font-semibold text-[#0B1A2D] dark:text-white truncate min-w-0">
              Demos
            </span>
          </nav>

          <div className="max-w-3xl space-y-3 animate-float-in">
            <CorporateEyebrow accent="lime">
              Setmio Pro · Entornos Interactivos
            </CorporateEyebrow>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
              Explora cada perfil de Setmio en vivo.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Elige una cuenta de demostración para probar el cuadrante, la marca blanca y los permisos reales de cada rol antes de iniciar tu alta.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filtrar entornos de demostración"
            className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1"
          >
            {filters.map((tab) => {
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`inline-flex items-center gap-1.5 min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 motion-reduce:transition-none cursor-pointer border ${
                    active
                      ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229]'
                      : 'bg-[#F7F9FC] dark:bg-[#0E2239] text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 hover:text-[#0B1A2D] dark:hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`font-mono text-[10px] tabular-nums ${
                      active
                        ? 'text-[#B7F229] dark:text-[#0B1A2D]/80'
                        : 'text-slate-400 dark:text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </CorporateContainer>
      </section>

      {/* 2. UNIFIED 7 DEMO PROFILES GRID */}
      <section className="py-10 sm:py-16 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
        <CorporateContainer className="space-y-8">
          <div
            key={activeFilter}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch animate-float-in"
          >
            {/* 01. ADMINISTRADOR CLUB */}
            {(activeFilter === 'all' || activeFilter === 'business') && (
              <article className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none p-5 sm:p-6 flex flex-col justify-between gap-5 min-w-0">
                <div className="space-y-3.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-right truncate">
                      <span className="font-mono font-bold tabular-nums text-[#0B1A2D] dark:text-[#B7F229] mr-1.5">
                        01
                      </span>
                      · Centro Pádel San Mateo
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-[#0B1A2D] dark:text-white font-display leading-snug">
                      Administrador Club
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Cuadrante multi-sede, reservas, TPV, domótica y marca blanca del club.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      Accesos directos por rol
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { role: 'admin', title: 'Admin Club', sub: 'Setmio Pro' },
                        { role: 'player', title: 'Jugador', sub: 'Marca Blanca' },
                        { role: 'coach', title: 'Profesor', sub: 'Marca Blanca' },
                        { role: 'reception', title: 'Recepción', sub: 'Marca Blanca' },
                      ].map((item) => (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => handleLaunch('club', item.role)}
                          className="px-2.5 py-2 rounded-lg text-left bg-[#F7F9FC] dark:bg-[#0B1A2D] hover:bg-white dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-colors cursor-pointer min-w-0"
                        >
                          <div className="text-[11px] font-bold text-[#0B1A2D] dark:text-white truncate">
                            {item.title}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                            {item.sub}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunch('club', 'admin')}
                  className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Entrar a Demo Club</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </article>
            )}

            {/* 02. ACADEMIA / ESCUELA */}
            {(activeFilter === 'all' || activeFilter === 'business') && (
              <article className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none p-5 sm:p-6 flex flex-col justify-between gap-5 min-w-0">
                <div className="space-y-3.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-right truncate">
                      <span className="font-mono font-bold tabular-nums text-[#0B1A2D] dark:text-[#B7F229] mr-1.5">
                        02
                      </span>
                      · Academia Pádel Élite
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-[#0B1A2D] dark:text-white font-display leading-snug">
                      Academia / Escuela
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Grupos por nivel, equipo docente, matrículas y evaluaciones de alumnos.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      Accesos directos por rol
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleLaunch('academy', 'admin')}
                        className="px-2.5 py-2 rounded-lg text-left bg-[#F7F9FC] dark:bg-[#0B1A2D] hover:bg-white dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-colors cursor-pointer min-w-0"
                      >
                        <div className="text-[11px] font-bold text-[#0B1A2D] dark:text-white truncate">
                          Admin Escuela
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                          Setmio Pro
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLaunch('academy', 'student')}
                        className="px-2.5 py-2 rounded-lg text-left bg-[#F7F9FC] dark:bg-[#0B1A2D] hover:bg-white dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-colors cursor-pointer min-w-0"
                      >
                        <div className="text-[11px] font-bold text-[#0B1A2D] dark:text-white truncate">
                          Vista Alumno
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                          Marca Blanca
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunch('academy', 'admin')}
                  className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Entrar a Demo Academia</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </article>
            )}

            {/* 03. PROFESOR INDEPENDIENTE */}
            {(activeFilter === 'all' || activeFilter === 'business') && (
              <article className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none p-5 sm:p-6 flex flex-col justify-between gap-5 min-w-0">
                <div className="space-y-3.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-right truncate">
                      <span className="font-mono font-bold tabular-nums text-[#0B1A2D] dark:text-[#B7F229] mr-1.5">
                        03
                      </span>
                      · Carlos Varela Pro
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-[#0B1A2D] dark:text-white font-display leading-snug">
                      Profesor Independiente
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Agenda particular, bonos de clases, seguimiento técnico y cobros propios.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      Accesos directos por rol
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { role: 'coach', title: 'Panel Pro', sub: 'Setmio Pro' },
                        { role: 'player', title: 'Jugador', sub: 'Propio' },
                        { role: 'student', title: 'Alumno', sub: 'Marca Blanca' },
                      ].map((item) => (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => handleLaunch('coach', item.role)}
                          className="px-2 py-2 rounded-lg text-left bg-[#F7F9FC] dark:bg-[#0B1A2D] hover:bg-white dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-colors cursor-pointer min-w-0"
                        >
                          <div className="text-[11px] font-bold text-[#0B1A2D] dark:text-white truncate">
                            {item.title}
                          </div>
                          <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 truncate">
                            {item.sub}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunch('coach', 'coach')}
                  className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Entrar a Demo Profesor</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </article>
            )}

            {/* 04. ATLETA PROFESIONAL */}
            {(activeFilter === 'all' || activeFilter === 'business') && (
              <article className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none p-5 sm:p-6 flex flex-col justify-between gap-5 min-w-0">
                <div className="space-y-3.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-right truncate">
                      <span className="font-mono font-bold tabular-nums text-[#0B1A2D] dark:text-[#B7F229] mr-1.5">
                        04
                      </span>
                      · Martín Diestro (FIP Pro)
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-[#0B1A2D] dark:text-white font-display leading-snug">
                      Atleta Profesional
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Calendario de circuito, acuerdos con patrocinadores, exhibiciones y marca personal.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/80 dark:border-[#1A314D] text-xs space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400">Entorno</span>
                      <span className="font-semibold text-[#0B1A2D] dark:text-white">
                        Setmio Pro Athlete
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400">Circuito</span>
                      <span className="font-semibold text-[#0B1A2D] dark:text-white">
                        Premier Padel / FIP
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunch('pro_athlete')}
                  className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Entrar a Demo Atleta Pro</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </article>
            )}

            {/* 05. ORGANIZADOR DE EVENTOS */}
            {(activeFilter === 'all' || activeFilter === 'business') && (
              <article className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none p-5 sm:p-6 flex flex-col justify-between gap-5 min-w-0">
                <div className="space-y-3.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-right truncate">
                      <span className="font-mono font-bold tabular-nums text-[#0B1A2D] dark:text-[#B7F229] mr-1.5">
                        05
                      </span>
                      · Circuito Galego Pádel
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-[#0B1A2D] dark:text-white font-display leading-snug">
                      Organizador de Eventos
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Torneos, ligas multi-sede, cuadros automáticos, rankings y patrocinadores.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/80 dark:border-[#1A314D] text-xs space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400">Entorno</span>
                      <span className="font-semibold text-[#0B1A2D] dark:text-white">
                        Event Organizer
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400">Alcance</span>
                      <span className="font-semibold text-[#0B1A2D] dark:text-white">
                        Torneos, Ligas y Sedes
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunch('organizer')}
                  className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Entrar a Demo Organizador</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </article>
            )}

            {/* 06. SETMIO PLAYER */}
            {(activeFilter === 'all' || activeFilter === 'player_hq') && (
              <article className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none p-5 sm:p-6 flex flex-col justify-between gap-5 min-w-0">
                <div className="space-y-3.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-right truncate">
                      <span className="font-mono font-bold tabular-nums text-[#0B1A2D] dark:text-[#B7F229] mr-1">
                        06
                      </span>
                      <Sparkles className="w-3 h-3 text-[#8B5CF6] dark:text-[#A78BFA] shrink-0" />
                      <span>App Neutra B2C</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-[#0B1A2D] dark:text-white font-display leading-snug">
                      Setmio Player
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Estadísticas de partidos, análisis de parejas, asistente IA y acceso a tus clubes.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/80 dark:border-[#1A314D] text-xs space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400">Entorno</span>
                      <span className="font-semibold text-[#0B1A2D] dark:text-white">
                        Setmio Player Global
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400">Enlace</span>
                      <span className="font-semibold text-[#0B1A2D] dark:text-white">
                        Sin ruido de terceros
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunch('setmio_player')}
                  className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Entrar a Setmio Player</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </article>
            )}

            {/* 07. SUPERADMINISTRADOR */}
            {(activeFilter === 'all' || activeFilter === 'player_hq') && (
              <article className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none p-5 sm:p-6 flex flex-col justify-between gap-5 min-w-0">
                <div className="space-y-3.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-right truncate">
                      <span className="font-mono font-bold tabular-nums text-[#0B1A2D] dark:text-[#B7F229] mr-1.5">
                        07
                      </span>
                      · Consola SaaS HQ
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-[#0B1A2D] dark:text-white font-display leading-snug">
                      Superadministrador
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Aprovisionamiento de entidades, planes B2B, facturación SaaS y auditoría global.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/80 dark:border-[#1A314D] text-xs space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400">Usuario demo</span>
                      <span className="font-mono font-semibold text-[#0B1A2D] dark:text-white text-[11px] truncate">
                        demo-hq@setmio.com
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400">Ámbito</span>
                      <span className="font-semibold text-[#0B1A2D] dark:text-white">
                        Control Multi-Tenant
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunch('superadmin')}
                  className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Entrar a Superadmin HQ</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </article>
            )}
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-4 sm:p-5 flex items-start sm:items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5 sm:mt-0" />
            <span>
              Cada entorno de demostración aplica las reglas de marca blanca correspondientes y te permite cambiar entre vistas sin perder tu sesión.
            </span>
          </div>
        </CorporateContainer>
      </section>

      {/* 3. CLOSING DARK CTA BANNER */}
      <section className="py-14 sm:py-18">
        <CorporateContainer>
          <CorporateCtaBanner
            eyebrow="Setmio Pro · Suscripción modular con alta guiada"
            title="¿Listo para activar Setmio bajo tu propia marca?"
            subtitle="Inicia el registro de tu organización con instalación inicial asistida, migración de datos y tarifas modulares sin comisiones por reserva."
            primaryLabel="Registrarse"
            onPrimary={handleRegisterClick}
            secondaryLabel="Consultar precios y planes"
            onSecondary={() => navigate('/precios', 'pricing')}
          />
        </CorporateContainer>
      </section>
    </div>
  );
};

export default DemosPage;
