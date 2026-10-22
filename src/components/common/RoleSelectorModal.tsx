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
  Compass,
  Layers,
  UserCheck,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Cerrar simulador de demos"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Arquitectura Oficial de Cuentas Demo & Marcas Blancas</span>
          </div>
          <h2 id="role-modal-title" className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            7 Cuentas Demo Principales
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Los perfiles de cliente y profesor están anidados dentro de sus correspondientes demos para probar la conmutación entre marcas blancas y el panel de administración Setmio Pro.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: 'all', label: 'Todas las 7 Demos' },
            { id: 'business', label: 'Clubes, Eventos & Profesionales' },
            { id: 'player_hq', label: 'Setmio Player & Superadmin' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* GRID OF 6 CORE DEMOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. DEMO ADMINISTRADOR PROFESIONAL / CLUB */}
          {(activeFilter === 'all' || activeFilter === 'business') && (
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500 dark:hover:border-emerald-500 transition shadow-xs">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Centro Pádel San Mateo
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    1. Demo Administrador Club
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Gestión total de la instalación: cuadrante multi-sede, pistas, reservas, TPV mostrador y facturación.
                  </p>
                </div>

                {/* Sub-roles nested inside Club */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                    Conmutar Roles Anidados:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleLaunch('club', 'admin')}
                      className="px-2.5 py-1.5 rounded-lg text-left text-xs font-bold bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition cursor-pointer"
                    >
                      <div className="text-[11px]">Admin Club</div>
                      <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono">Setmio Pro</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLaunch('club', 'player')}
                      className="px-2.5 py-1.5 rounded-lg text-left text-xs font-bold bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition cursor-pointer"
                    >
                      <div className="text-[11px]">Jugador Club</div>
                      <div className="text-[9px] text-teal-600 dark:text-teal-400 font-mono">Marca Blanca</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLaunch('club', 'coach')}
                      className="px-2.5 py-1.5 rounded-lg text-left text-xs font-bold bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition cursor-pointer"
                    >
                      <div className="text-[11px]">Profesor / Entrenador</div>
                      <div className="text-[9px] text-teal-600 dark:text-teal-400 font-mono">Marca Blanca</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLaunch('club', 'reception')}
                      className="px-2.5 py-1.5 rounded-lg text-left text-xs font-bold bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition cursor-pointer"
                    >
                      <div className="text-[11px]">Recepción</div>
                      <div className="text-[9px] text-teal-600 dark:text-teal-400 font-mono">Marca Blanca</div>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunch('club', 'admin')}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>Entrar a Demo Club</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 2. DEMO ACADEMIA / ESCUELA */}
          {(activeFilter === 'all' || activeFilter === 'business') && (
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-indigo-500 dark:hover:border-indigo-500 transition shadow-xs">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                    Academia Pádel Élite
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    2. Demo Academia / Escuela
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Profesional independiente al club: colectivo de profesores, grupos por niveles, cursos y matrículas.
                  </p>
                </div>

                {/* Sub-roles nested inside Academy */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                    Conmutar Roles Anidados:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleLaunch('academy', 'admin')}
                      className="px-2.5 py-1.5 rounded-lg text-left text-xs font-bold bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-500 transition cursor-pointer"
                    >
                      <div className="text-[11px]">Admin Escuela</div>
                      <div className="text-[9px] text-indigo-600 dark:text-indigo-400 font-mono">Setmio Pro</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLaunch('academy', 'student')}
                      className="px-2.5 py-1.5 rounded-lg text-left text-xs font-bold bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-500 transition cursor-pointer"
                    >
                      <div className="text-[11px]">Vista Alumno</div>
                      <div className="text-[9px] text-indigo-600 dark:text-indigo-400 font-mono">Marca Blanca</div>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunch('academy', 'admin')}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>Entrar a Demo Academia</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 3. DEMO PROFESOR INDEPENDIENTE */}
          {(activeFilter === 'all' || activeFilter === 'business') && (
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-sky-500 dark:hover:border-sky-500 transition shadow-xs">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-cyan-700 text-white flex items-center justify-center shadow-xs">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                    Carlos Varela Pádel Pro
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    3. Demo Profesor Independiente
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Profesional autónomo / personal trainer: servicios particulares, bonos de clases y agenda de alumnos.
                  </p>
                </div>

                {/* Sub-roles nested inside Coach */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                    Conmutar Roles Anidados:
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => handleLaunch('coach', 'coach')}
                      className="px-2 py-1.5 rounded-lg text-left text-xs font-bold bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-sky-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-sky-500 transition cursor-pointer"
                    >
                      <div className="text-[10px] truncate">Panel Pro</div>
                      <div className="text-[8px] text-sky-600 dark:text-sky-400 font-mono">Setmio Pro</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLaunch('coach', 'player')}
                      className="px-2 py-1.5 rounded-lg text-left text-xs font-bold bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-sky-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-sky-500 transition cursor-pointer"
                    >
                      <div className="text-[10px] truncate">Vista Jugador</div>
                      <div className="text-[8px] text-slate-500 font-mono">Propio</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLaunch('coach', 'student')}
                      className="px-2 py-1.5 rounded-lg text-left text-xs font-bold bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-sky-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-sky-500 transition cursor-pointer"
                    >
                      <div className="text-[10px] truncate">Vista Alumno</div>
                      <div className="text-[8px] text-sky-600 dark:text-sky-400 font-mono">Marca Blanca</div>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunch('coach', 'coach')}
                className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>Entrar a Demo Profesor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 4. DEMO JUGADOR PROFESIONAL / ATLETA */}
          {(activeFilter === 'all' || activeFilter === 'business') && (
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-rose-500 dark:hover:border-rose-500 transition shadow-xs">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center shadow-xs">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                    Martín Diestro (FIP Pro)
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    4. Demo Atleta Profesional
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Dedicada al jugador/atleta profesional: gestión de sponsors, agenda de torneos FIP, exhibiciones y estadísticas.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Branding:</span>
                    <strong className="text-rose-600 dark:text-rose-400">Setmio Pro Athlete</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Circuito:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Premier Padel / FIP Tour</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunch('pro_athlete')}
                className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>Entrar a Demo Atleta Pro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 5. DEMO ORGANIZADOR DE EVENTOS (NUEVO ROL) */}
          {(activeFilter === 'all' || activeFilter === 'business') && (
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-amber-500 dark:hover:border-amber-500 transition shadow-xs">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 text-white flex items-center justify-center shadow-xs">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    Circuito Galego Pádel
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    5. Demo Organizador de Eventos
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Rol exclusivo para gestión de Competiciones, Ligas oficiales, Patrocinadores y Sedes de Evento (sin TPV de club ni pistas físicas propias).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Branding:</span>
                    <strong className="text-amber-600 dark:text-amber-400">Setmio Pro Event Organizer</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Módulos:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Torneos, Ligas, Sponsors & Sedes</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunch('organizer')}
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>Entrar a Demo Organizador</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 6. DEMO SETMIO PLAYER (B2C) */}
          {(activeFilter === 'all' || activeFilter === 'player_hq') && (
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500 dark:hover:border-cyan-500 transition shadow-xs">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
                    App Neutra B2C
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    6. Demo Setmio Player
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Entorno dedicado para el jugador amateur: reserva en red multi-club, partidas abiertas, ranking y ELO global oficial.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Branding:</span>
                    <strong className="text-cyan-600 dark:text-cyan-400">Setmio Player (Global)</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Aislamiento:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Sin logos de clubes terceros</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunch('setmio_player')}
                className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>Entrar a Setmio Player</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 7. DEMO SUPERADMINISTRADOR */}
          {(activeFilter === 'all' || activeFilter === 'player_hq') && (
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-purple-500 dark:hover:border-purple-500 transition shadow-xs">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                    SaaS HQ Global
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    7. Demo Superadministrador
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Consola global de Setmio: aprovisionamiento de tenants, planes B2B, facturación recurrente SaaS y auditoría.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Cuenta vinculada:</span>
                    <strong className="text-purple-600 dark:text-purple-400 font-mono text-[11px]">contactomafsports@gmail.com</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Permisos:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Acceso Maestro Global</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunch('superadmin')}
                className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>Entrar a Superadmin HQ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Cada demo aplica dinámicamente las reglas de marca blanca correspondientes y preserva la sesión activa sin necesidad de recargar la aplicación.
          </span>
        </div>
      </div>
    </div>
  );
};
