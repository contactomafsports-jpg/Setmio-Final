import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  Building2,
  GraduationCap,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Trophy,
  Users,
  Layers,
} from 'lucide-react';

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { switchDemoAccount } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'business' | 'player_hq'>('all');

  if (!isOpen) return null;

  const handleLaunch = (
    demoId: 'club' | 'academy' | 'coach' | 'pro_athlete' | 'organizer' | 'setmio_player' | 'superadmin',
    subRole?: string
  ) => {
    switchDemoAccount(demoId, subRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#071220]/80 backdrop-blur-xs">
      <div
        className="relative w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-5xl bg-white dark:bg-[#0E2239] border-0 sm:border sm:border-slate-200/90 sm:dark:border-[#1A314D] rounded-none sm:rounded-2xl px-4 py-5 sm:p-8 space-y-6 overflow-y-auto overscroll-contain text-[#0B1A2D] dark:text-white animate-float-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="min-h-[40px] min-w-[40px] flex items-center justify-center absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] transition-colors cursor-pointer"
          aria-label="Cerrar selector de demos"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 pr-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
            <span className="h-[2px] w-4 bg-[#B7F229]" aria-hidden="true" />
            <span>Entornos de Demostración Setmio</span>
          </div>
          <h2
            id="role-modal-title"
            className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight font-display"
          >
            Explora cada perfil de Setmio
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Selecciona una cuenta demo para probar el panel profesional, la marca blanca y el cambio entre roles sin perder tu sesión.
          </p>
        </div>

        {/* Wrapped Category Filters */}
        <div
          role="tablist"
          aria-label="Filtrar entornos de demostración"
          className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-b border-slate-200/80 dark:border-[#1A314D] pb-3.5"
        >
          {[
            { id: 'all', label: 'Todas las demos' },
            { id: 'business', label: 'Clubes, Eventos y Profesionales' },
            { id: 'player_hq', label: 'Setmio Player y Superadmin' },
          ].map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 motion-reduce:transition-none cursor-pointer border ${
                  active
                    ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229]'
                    : 'bg-[#F7F9FC] dark:bg-[#0B1A2D] text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div key={activeFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-float-in">
          {(activeFilter === 'all' || activeFilter === 'business') && (
            <div className="rounded-2xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 p-5 flex flex-col justify-between space-y-4 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                    <span className="font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229] mr-1">01</span>
                    · Centro Pádel San Mateo
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white font-display">
                    Administrador Club
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Cuadrante multi-sede, reservas, TPV, domótica y marca blanca del club.
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200/80 dark:border-[#1A314D] grid grid-cols-2 gap-1.5">
                  {[
                    { role: 'admin', label: 'Admin Club', sub: 'Setmio Pro' },
                    { role: 'player', label: 'Jugador', sub: 'Marca Blanca' },
                    { role: 'coach', label: 'Profesor', sub: 'Marca Blanca' },
                    { role: 'reception', label: 'Recepción', sub: 'Marca Blanca' },
                  ].map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => handleLaunch('club', r.role)}
                      className="px-2.5 py-1.5 rounded-lg text-left bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-colors cursor-pointer min-w-0"
                    >
                      <div className="text-[11px] font-bold text-[#0B1A2D] dark:text-white truncate">{r.label}</div>
                      <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 truncate">{r.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunch('club', 'admin')}
                className="w-full min-h-[40px] py-2 px-3 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Entrar a Demo Club</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {(activeFilter === 'all' || activeFilter === 'business') && (
            <div className="rounded-2xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 p-5 flex flex-col justify-between space-y-4 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                    <span className="font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229] mr-1">02</span>
                    · Academia Pádel Élite
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white font-display">
                    Academia / Escuela
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Grupos por nivel, equipo docente, matrículas y evaluaciones de alumnos.
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200/80 dark:border-[#1A314D] grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLaunch('academy', 'admin')}
                    className="px-2.5 py-1.5 rounded-lg text-left bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-colors cursor-pointer min-w-0"
                  >
                    <div className="text-[11px] font-bold text-[#0B1A2D] dark:text-white truncate">Admin Escuela</div>
                    <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 truncate">Setmio Pro</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLaunch('academy', 'student')}
                    className="px-2.5 py-1.5 rounded-lg text-left bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-colors cursor-pointer min-w-0"
                  >
                    <div className="text-[11px] font-bold text-[#0B1A2D] dark:text-white truncate">Vista Alumno</div>
                    <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 truncate">Marca Blanca</div>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunch('academy', 'admin')}
                className="w-full min-h-[40px] py-2 px-3 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Entrar a Demo Academia</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {(activeFilter === 'all' || activeFilter === 'business') && (
            <div className="rounded-2xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 p-5 flex flex-col justify-between space-y-4 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                    <span className="font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229] mr-1">03</span>
                    · Carlos Varela Pro
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white font-display">
                    Profesor Independiente
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Agenda particular, bonos de clases, seguimiento técnico y cobros propios.
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200/80 dark:border-[#1A314D] grid grid-cols-3 gap-1">
                  {[
                    { role: 'coach', label: 'Panel Pro', sub: 'Setmio Pro' },
                    { role: 'player', label: 'Jugador', sub: 'Propio' },
                    { role: 'student', label: 'Alumno', sub: 'Marca Blanca' },
                  ].map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => handleLaunch('coach', r.role)}
                      className="px-2 py-1.5 rounded-lg text-left bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-colors cursor-pointer min-w-0"
                    >
                      <div className="text-[10px] font-bold text-[#0B1A2D] dark:text-white truncate">{r.label}</div>
                      <div className="text-[8px] font-mono text-slate-500 dark:text-slate-400 truncate">{r.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunch('coach', 'coach')}
                className="w-full min-h-[40px] py-2 px-3 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Entrar a Demo Profesor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {(activeFilter === 'all' || activeFilter === 'business') && (
            <div className="rounded-2xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 p-5 flex flex-col justify-between space-y-4 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                    <span className="font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229] mr-1">04</span>
                    · Martín Diestro (FIP Pro)
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white font-display">
                    Atleta Profesional
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Calendario de circuito, acuerdos con patrocinadores, exhibiciones y marca personal.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Entorno</span>
                    <span className="font-semibold text-[#0B1A2D] dark:text-white">Setmio Pro Athlete</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Circuito</span>
                    <span className="font-semibold text-[#0B1A2D] dark:text-white">Premier Padel / FIP</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunch('pro_athlete')}
                className="w-full min-h-[40px] py-2 px-3 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Entrar a Demo Atleta Pro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {(activeFilter === 'all' || activeFilter === 'business') && (
            <div className="rounded-2xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 p-5 flex flex-col justify-between space-y-4 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                    <span className="font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229] mr-1">05</span>
                    · Circuito Galego Pádel
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white font-display">
                    Organizador de Eventos
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Torneos, ligas multi-sede, cuadros automáticos, rankings y patrocinadores.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Entorno</span>
                    <span className="font-semibold text-[#0B1A2D] dark:text-white">Event Organizer</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Alcance</span>
                    <span className="font-semibold text-[#0B1A2D] dark:text-white">Torneos, Ligas y Sedes</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunch('organizer')}
                className="w-full min-h-[40px] py-2 px-3 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Entrar a Demo Organizador</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {(activeFilter === 'all' || activeFilter === 'player_hq') && (
            <div className="rounded-2xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 p-5 flex flex-col justify-between space-y-4 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                    <span className="font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229] mr-0.5">06</span>
                    <Sparkles className="w-3 h-3 text-[#8B5CF6] dark:text-[#A78BFA] shrink-0" />
                    <span>App Neutra B2C</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white font-display">
                    Setmio Player
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Estadísticas de partidos, análisis de parejas, asistente IA y acceso a tus clubes.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Entorno</span>
                    <span className="font-semibold text-[#0B1A2D] dark:text-white">Setmio Player Global</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Enlace</span>
                    <span className="font-semibold text-[#0B1A2D] dark:text-white">Sin ruido de terceros</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunch('setmio_player')}
                className="w-full min-h-[40px] py-2 px-3 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Entrar a Setmio Player</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {(activeFilter === 'all' || activeFilter === 'player_hq') && (
            <div className="rounded-2xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 p-5 flex flex-col justify-between space-y-4 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                    <span className="font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229] mr-1">07</span>
                    · Consola SaaS HQ
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white font-display">
                    Superadministrador
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Aprovisionamiento de entidades, planes B2B, facturación SaaS y auditoría global.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 gap-2">
                    <span>Usuario demo</span>
                    <span className="font-mono font-semibold text-[#0B1A2D] dark:text-white text-[11px] truncate">
                      demo-hq@setmio.com
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Ámbito</span>
                    <span className="font-semibold text-[#0B1A2D] dark:text-white">Control Multi-Tenant</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunch('superadmin')}
                className="w-full min-h-[40px] py-2 px-3 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Entrar a Superadmin HQ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="p-3.5 rounded-xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] text-xs text-slate-600 dark:text-slate-300 flex items-start sm:items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5 sm:mt-0" />
          <span>
            Cada demo aplica dinámicamente las reglas de marca blanca correspondientes y preserva la sesión activa sin necesidad de recargar la aplicación.
          </span>
        </div>
      </div>
    </div>
  );
};
