import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  LayoutDashboard,
  User,
  ShieldAlert,
  ChevronDown,
  Building2,
  Sparkles,
  Info,
  CheckCircle2,
  X,
  Sun,
  Moon,
  GraduationCap,
  Users,
  Trophy,
  Compass,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { getSupabaseStatus } from '../../lib/supabase';
import { RoleSelectorModal } from './RoleSelectorModal';

export const TopBarDemo: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentTenant,
    tenants,
    switchTenant,
    currentUser,
    switchUserRole,
    triggerDemoToast,
    theme,
    toggleTheme,
    isCorporateLanding,
    viewEntityWeb,
    navigateToCorporate,
    isWhiteLabelPlayerPreview,
    activeDemoAccount,
    switchDemoAccount,
  } = useApp();

  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const supabaseStatus = getSupabaseStatus();

  // Active nested sub-role detection
  const isClubAdmin =
    activeDemoAccount === 'club' &&
    currentUser.role === 'TENANT_OWNER' &&
    currentView === 'admin';
  const isClubPlayer =
    activeDemoAccount === 'club' &&
    currentUser.role === 'PLAYER' &&
    isWhiteLabelPlayerPreview;
  const isClubCoach =
    activeDemoAccount === 'club' &&
    currentUser.role === 'COACH' &&
    currentView === 'coach';
  const isClubReception =
    activeDemoAccount === 'club' &&
    currentUser.role === 'RECEPTION';

  const isAcademyAdmin =
    activeDemoAccount === 'academy' &&
    (currentUser.role === 'ACADEMY_MANAGER' || currentView === 'admin');
  const isAcademyStudent =
    activeDemoAccount === 'academy' &&
    currentUser.role === 'PLAYER' &&
    isWhiteLabelPlayerPreview;

  const isCoachAdmin =
    activeDemoAccount === 'coach' &&
    currentUser.role === 'COACH' &&
    currentView === 'coach';
  const isCoachAsPlayer =
    activeDemoAccount === 'coach' &&
    currentUser.role === 'PLAYER' &&
    !isWhiteLabelPlayerPreview;
  const isCoachStudent =
    activeDemoAccount === 'coach' &&
    currentUser.role === 'PLAYER' &&
    isWhiteLabelPlayerPreview;

  const demoAccountsList = [
    {
      id: 'club' as const,
      title: 'Demo Admin Profesional / Club',
      shortTitle: 'Demo Club',
      badge: 'San Mateo (4 roles anidados)',
      color: 'text-emerald-400',
      desc: 'Gestión integral con roles anidados: Admin Club, Jugador Club, Profesor y Recepción.',
      nestedRoles: [
        { id: 'admin', label: 'Administrador Club', badge: 'Setmio Pro', view: 'Admin' },
        { id: 'player', label: 'Jugador Club', badge: 'Marca Blanca', view: 'Player' },
        { id: 'coach', label: 'Profesor / Entrenador', badge: 'Marca Blanca', view: 'Coach' },
        { id: 'reception', label: 'Recepción', badge: 'Marca Blanca', view: 'Admin' },
      ],
    },
    {
      id: 'academy' as const,
      title: 'Demo Academia / Escuela',
      shortTitle: 'Demo Escuela',
      badge: 'Academia Élite (Independiente)',
      color: 'text-indigo-400',
      desc: 'Gestión de escuela independiente con previsualización anidada de Vista Alumno.',
      nestedRoles: [
        { id: 'admin', label: 'Administrador Escuela', badge: 'Setmio Pro', view: 'Admin' },
        { id: 'student', label: 'Vista Alumno', badge: 'Marca Blanca', view: 'Player' },
      ],
    },
    {
      id: 'coach' as const,
      title: 'Demo Profesor Independiente',
      shortTitle: 'Demo Profesor',
      badge: 'Carlos Varela (Autónomo)',
      color: 'text-sky-400',
      desc: 'Profesional autónomo con roles anidados: Vista Jugador (propio) y Vista Alumno.',
      nestedRoles: [
        { id: 'coach', label: 'Panel Profesor', badge: 'Setmio Pro', view: 'Coach' },
        { id: 'player', label: 'Vista Jugador (Propio)', badge: 'Personal', view: 'Player' },
        { id: 'student', label: 'Vista Alumno', badge: 'Marca Blanca', view: 'Player' },
      ],
    },
    {
      id: 'pro_athlete' as const,
      title: 'Demo Jugador Profesional / Atleta',
      shortTitle: 'Demo Atleta Pro',
      badge: 'Martín Diestro (FIP)',
      color: 'text-rose-400',
      desc: 'Gestión de sponsors, torneos internacionales FIP y portfolio de atleta.',
      nestedRoles: [],
    },
    {
      id: 'setmio_player' as const,
      title: 'Demo Setmio Player',
      shortTitle: 'Setmio Player',
      badge: 'App B2C Neutra',
      color: 'text-cyan-400',
      desc: 'Producto B2C para jugador amateur (reserva multi-club, ELO y partidos abiertos).',
      nestedRoles: [],
    },
    {
      id: 'superadmin' as const,
      title: 'Demo Superadministrador',
      shortTitle: 'Superadmin HQ',
      badge: 'contactomafsports@gmail.com',
      color: 'text-purple-400',
      desc: 'Consola global de administración SaaS, suscripciones de clubes y métricas.',
      nestedRoles: [],
    },
  ];

  const currentDemoInfo =
    demoAccountsList.find((d) => d.id === activeDemoAccount) || demoAccountsList[0];

  return (
    <>
      <header className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-200 text-xs shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          {/* Brand & Main Demo Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 font-bold tracking-wider text-emerald-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white font-extrabold tracking-tight text-sm">SETMIO</span>
              <span className="text-[10px] uppercase px-1 py-0.5 rounded bg-emerald-950 border border-emerald-800/80 text-emerald-400">
                PRO
              </span>
            </div>

            <span className="text-slate-600">|</span>

            {/* 6 Core Demo Accounts Dropdown Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-100 transition-colors cursor-pointer"
                title="Cambiar entre las 6 Cuentas Demo Principales"
              >
                <span className={`w-2 h-2 rounded-full ${
                  activeDemoAccount === 'club' ? 'bg-emerald-400' :
                  activeDemoAccount === 'academy' ? 'bg-indigo-400' :
                  activeDemoAccount === 'coach' ? 'bg-sky-400' :
                  activeDemoAccount === 'pro_athlete' ? 'bg-rose-400' :
                  activeDemoAccount === 'setmio_player' ? 'bg-cyan-400' : 'bg-purple-400'
                }`} />
                <span className="font-extrabold text-xs text-white">
                  {currentDemoInfo.shortTitle}
                </span>
                <span className="text-[10px] text-slate-400 hidden md:inline font-medium">
                  ({currentDemoInfo.badge.split(' (')[0]})
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>

              {/* Demo Accounts Menu */}
              {showDemoMenu && (
                <div className="absolute top-full left-0 mt-1.5 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 max-h-[85vh] overflow-y-auto">
                  <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>6 Cuentas Demo Principales</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDemoMenu(false);
                        setShowRoleModal(true);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold lowercase text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <span>ver matriz</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {demoAccountsList.map((demo) => {
                      const isActive = activeDemoAccount === demo.id;
                      return (
                        <div key={demo.id} className="rounded-xl border border-transparent hover:border-slate-800 bg-slate-950/40 p-1.5 transition">
                          <button
                            type="button"
                            onClick={() => {
                              switchDemoAccount(demo.id);
                              setShowDemoMenu(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition cursor-pointer ${
                              isActive ? 'bg-slate-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${demo.color}`}>{demo.title}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{demo.desc}</div>
                            </div>
                            {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          </button>

                          {/* Nested roles shortcuts inside Demo card */}
                          {demo.nestedRoles.length > 0 && (
                            <div className="mt-1 pt-1 border-t border-slate-800/80 px-2 flex flex-wrap gap-1">
                              <span className="text-[9px] text-slate-500 font-medium mr-1 self-center">
                                Sub-roles:
                              </span>
                              {demo.nestedRoles.map((nr) => (
                                <button
                                  key={nr.id}
                                  type="button"
                                  onClick={() => {
                                    switchDemoAccount(demo.id, nr.id);
                                    setShowDemoMenu(false);
                                  }}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer flex items-center gap-1"
                                >
                                  <span>{nr.label}</span>
                                  <span className="text-[8px] opacity-70 font-mono">({nr.badge})</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Tenant indicator/menu (optional quick info) */}
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setShowTenantMenu(!showTenantMenu)}
                className="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-slate-800 text-slate-300 transition-colors text-[11px]"
                title="Empresa / Tenant activo"
              >
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate max-w-[130px] font-medium text-slate-300">
                  {currentTenant.shortName}
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>

              {showTenantMenu && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Tenants Activos en Demostración
                  </div>
                  {tenants.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        switchTenant(t.id);
                        setShowTenantMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs hover:bg-slate-800 transition ${
                        t.id === currentTenant.id ? 'bg-slate-800/90 text-emerald-400 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate">{t.name}</div>
                        <div className="text-[10px] text-slate-400">{t.city} · {t.type}</div>
                      </div>
                      {t.id === currentTenant.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* INTERACTIVE NESTED ROLE SWITCHER (Dynamic based on active demo) */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2 py-0.5 rounded-xl">
            {activeDemoAccount === 'club' && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-semibold hidden xl:inline mr-1">
                  Sub-roles Club:
                </span>
                <button
                  type="button"
                  onClick={() => switchDemoAccount('club', 'admin')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
                    isClubAdmin
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Administrador Club (Setmio Pro)"
                >
                  Admin Club
                </button>
                <button
                  type="button"
                  onClick={() => switchDemoAccount('club', 'player')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                    isClubPlayer
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Jugador Club (Marca Blanca San Mateo)"
                >
                  <span>Jugador Club</span>
                  <span className="text-[9px] opacity-75 font-mono hidden sm:inline">[MB]</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchDemoAccount('club', 'coach')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                    isClubCoach
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Profesor / Entrenador (Marca Blanca San Mateo)"
                >
                  <span>Profesor</span>
                  <span className="text-[9px] opacity-75 font-mono hidden sm:inline">[MB]</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchDemoAccount('club', 'reception')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                    isClubReception
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Recepción de Club (Marca Blanca San Mateo)"
                >
                  <span>Recepción</span>
                  <span className="text-[9px] opacity-75 font-mono hidden sm:inline">[MB]</span>
                </button>
              </div>
            )}

            {activeDemoAccount === 'academy' && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-semibold hidden xl:inline mr-1">
                  Sub-roles Escuela:
                </span>
                <button
                  type="button"
                  onClick={() => switchDemoAccount('academy', 'admin')}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
                    isAcademyAdmin
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Administrador Escuela (Setmio Pro)"
                >
                  Admin Escuela
                </button>
                <button
                  type="button"
                  onClick={() => switchDemoAccount('academy', 'student')}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                    isAcademyStudent
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Vista Alumno (Marca Blanca Academia)"
                >
                  <span>Vista Alumno</span>
                  <span className="text-[9px] opacity-75 font-mono">[MB]</span>
                </button>
              </div>
            )}

            {activeDemoAccount === 'coach' && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-semibold hidden xl:inline mr-1">
                  Sub-roles Profesor:
                </span>
                <button
                  type="button"
                  onClick={() => switchDemoAccount('coach', 'coach')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
                    isCoachAdmin
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Panel Profesor (Setmio Pro)"
                >
                  Panel Profesor
                </button>
                <button
                  type="button"
                  onClick={() => switchDemoAccount('coach', 'player')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
                    isCoachAsPlayer
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Vista Jugador (Propio Profesor)"
                >
                  Vista Jugador
                </button>
                <button
                  type="button"
                  onClick={() => switchDemoAccount('coach', 'student')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                    isCoachStudent
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Vista Alumno (Marca Blanca Profesor)"
                >
                  <span>Vista Alumno</span>
                  <span className="text-[9px] opacity-75 font-mono hidden sm:inline">[MB]</span>
                </button>
              </div>
            )}

            {activeDemoAccount === 'pro_athlete' && (
              <div className="flex items-center gap-1 text-[11px] text-rose-300 font-semibold px-1">
                <Trophy className="w-3.5 h-3.5 text-rose-400" />
                <span>Gestión Atleta Pro · Sponsors & FIP</span>
              </div>
            )}

            {activeDemoAccount === 'setmio_player' && (
              <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-semibold px-1">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>App Neutra Setmio Player (B2C)</span>
              </div>
            )}

            {activeDemoAccount === 'superadmin' && (
              <div className="flex items-center gap-1 text-[11px] text-purple-300 font-semibold px-1">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-mono text-[10px]">contactomafsports@gmail.com</span>
              </div>
            )}
          </div>

          {/* Quick Actions & Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Matriz Completa de Demos Modal */}
            <button
              type="button"
              onClick={() => setShowRoleModal(true)}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-800 text-emerald-300 font-bold text-xs transition cursor-pointer"
              title="Abrir Matriz Oficial de Demos y Roles"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Matriz Demos</span>
            </button>

            {/* Alternar Vista Web Pública de la Entidad Activa */}
            <button
              type="button"
              onClick={() => viewEntityWeb()}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title={`Ver web pública de ${currentTenant.shortName}`}
            >
              <Globe className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              aria-label="Alternar tema claro/oscuro"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-300" />
              )}
            </button>

            {/* Architecture / Info */}
            <button
              type="button"
              onClick={() => setShowTechModal(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
              title="Información de arquitectura y despliegue"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Role & Demo Matrix Modal */}
      <RoleSelectorModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
      />

      {/* Tech & Deployment Modal */}
      {showTechModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-200 max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowTechModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg mb-1">
              <Sparkles className="w-5 h-5" />
              Arquitectura Técnica de SETMIO PADEL PRO
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Preparado para despliegue desde GitHub a Vercel con backend relacional PostgreSQL en Supabase.
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Estado de Conexión Supabase
                </div>
                <div className="text-slate-300">
                  Modo: <span className="font-mono text-cyan-300">{supabaseStatus.mode}</span> (Base de datos PostgreSQL relacional con políticas RLS y script de inicialización en <code className="text-amber-300">/supabase/schema.sql</code>).
                </div>
                <div className="text-slate-400 text-[11px]">
                  Para conectar con tu proyecto de Supabase en producción, define las variables <code className="text-slate-200">VITE_SUPABASE_URL</code> y <code className="text-slate-200">VITE_SUPABASE_ANON_KEY</code> en Vercel.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Arquitectura Multi-Tenant & Marca Blanca
                </div>
                <p className="text-slate-300">
                  Vistas de administrador muestran el branding oficial <strong>Setmio Pro</strong>. Las vistas anidadas de clientes (Jugador Club, Alumno, Profesor de Club, Recepción) renderizan automáticamente los colores, logos y nombres oficiales de cada entidad en modo Marca Blanca.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Superadmin HQ Global
                </div>
                <p className="text-slate-300">
                  Sesión global de superadministración asignada por defecto a <code className="text-purple-300 font-bold">contactomafsports@gmail.com</code> para control de facturación SaaS B2B, aprovisionamiento y métricas.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTechModal(false)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white transition cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
