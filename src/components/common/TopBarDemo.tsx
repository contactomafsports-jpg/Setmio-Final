import React, { useState } from 'react';
import { useApp, MainView } from '../../context/AppContext';
import { UserRole } from '../../types/database';
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
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';
import { getSupabaseStatus } from '../../lib/supabase';

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
    setIsCorporateLanding,
    navigateToClub,
    navigateToCorporate,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);

  const supabaseStatus = getSupabaseStatus();

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'TENANT_OWNER', label: 'Propietario Club', desc: 'Control total de Pádel San Mateo' },
    { role: 'TENANT_ADMIN', label: 'Gerente / Admin', desc: 'Gestión operativa del club' },
    { role: 'RECEPTION', label: 'Recepción y Pistas', desc: 'Agenda y atención a jugadores' },
    { role: 'COACH', label: 'Entrenador / Coach', desc: 'Clases y grupos de la escuela' },
    { role: 'PLAYER', label: 'Jugador Socio', desc: 'Reservas, partidos y estadísticas' },
    { role: 'STORE_MANAGER', label: 'Responsable Tienda', desc: 'Catálogo e inventario deportivo' },
    { role: 'TOURNAMENT_ORGANIZER', label: 'Organizador Torneos', desc: 'Cuadros y parejas' },
    { role: 'SUPERADMIN', label: 'Superadmin HQ', desc: 'Plataforma global Setmio Padel Pro' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-200 text-xs shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          {/* Brand & Platform Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 font-bold tracking-wider text-emerald-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white font-extrabold tracking-tight text-sm">SETMIO</span>
              <span className="text-[10px] uppercase px-1 py-0.5 rounded bg-emerald-950 border border-emerald-800/80 text-emerald-400">
                PADEL PRO
              </span>
            </div>

            <span className="hidden sm:inline text-slate-600">|</span>

            {/* Tenant Selector */}
            <div className="relative">
              <button
                onClick={() => setShowTenantMenu(!showTenantMenu)}
                className="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-slate-800 text-slate-300 transition-colors"
                title="Cambiar de empresa (Tenant)"
              >
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-slate-100 max-w-[130px] sm:max-w-[200px] truncate">
                  {currentTenant.name}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono hidden md:inline">
                  [{currentTenant.planId.toUpperCase()}]
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showTenantMenu && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Espacios disponibles
                  </div>
                  {tenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        switchTenant(t.id);
                        setShowTenantMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-800 transition ${
                        t.id === currentTenant.id ? 'bg-slate-800/90 text-emerald-400 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <div>{t.name}</div>
                        <div className="text-[10px] text-slate-400">{t.city}, {t.region} · Plan {t.planId.toUpperCase()}</div>
                      </div>
                      {t.id === currentTenant.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Core Views Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                navigateToCorporate();
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition ${
                isCorporateLanding && currentView === 'public'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Landing Corporativa de Setmio SaaS"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Setmio SaaS</span>
            </button>

            <button
              onClick={() => {
                setIsCorporateLanding(false);
                setCurrentView('public');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition ${
                !isCorporateLanding && currentView === 'public'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={`Web Pública de ${currentTenant.shortName}`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Web Club</span>
            </button>

            <button
              onClick={() => {
                setIsCorporateLanding(false);
                setCurrentView('admin');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition ${
                currentView === 'admin'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gestión Club</span>
            </button>

            <button
              onClick={() => {
                setIsCorporateLanding(false);
                setCurrentView('player');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition ${
                currentView === 'player'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">App Jugador</span>
            </button>

            <button
              onClick={() => {
                setIsCorporateLanding(false);
                switchUserRole('COACH');
                setCurrentView('coach');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition ${
                currentView === 'coach'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="hidden md:inline">Portal Coach</span>
            </button>

            <button
              onClick={() => {
                setIsCorporateLanding(false);
                switchUserRole('SUPERADMIN');
                setCurrentView('hq');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition ${
                currentView === 'hq'
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-purple-400 hover:text-purple-300'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Superadmin</span>
            </button>
          </div>

          {/* Role & Demo Controls */}
          <div className="flex items-center gap-2">
            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 py-1 px-2 rounded bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 transition"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="font-medium text-[11px]">{currentUser.role}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Cambiar Rol Activo (Simulador)
                  </div>
                  {rolesList.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchUserRole(item.role);
                        setIsCorporateLanding(false);
                        if (item.role === 'PLAYER') setCurrentView('player');
                        else if (item.role === 'COACH') setCurrentView('coach');
                        else if (item.role === 'SUPERADMIN') setCurrentView('hq');
                        else setCurrentView('admin');
                        setShowRoleMenu(false);
                        triggerDemoToast(
                          'Rol Cambiado',
                          `Cambiado al perfil "${item.label}". Se ha cargado el entorno de trabajo correspondiente.`,
                          'info'
                        );
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-800 transition ${
                        currentUser.role === item.role
                          ? 'bg-slate-800 text-cyan-400 font-semibold'
                          : 'text-slate-300'
                      }`}
                    >
                      <div className="font-medium">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              aria-label="Alternar tema claro/oscuro"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-300" />
              )}
              <span className="hidden xl:inline text-[11px] font-medium text-slate-300">
                {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
            </button>

            {/* Architecture / Info */}
            <button
              onClick={() => setShowTechModal(true)}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Información de arquitectura y despliegue"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Tech & Deployment Modal */}
      {showTechModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-200 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowTechModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
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
                  Enrutamiento Multi-Dominio (Vercel & DNS)
                </div>
                <p className="text-slate-300">
                  Cada cliente dispone de su subdominio <code className="text-emerald-300">*.setmio.com</code> o dominio propio (ej. <code className="text-emerald-300">padelsanmateo.es</code>). El backend resuelve el tenant consultando la tabla <code className="text-amber-300">tenant_domains</code> con verificación CNAME y SSL automático.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Aislamiento Multi-Tenant y Seguridad RLS
                </div>
                <p className="text-slate-300">
                  Todas las entidades de negocio (pistas, reservas, clientes, pedidos, facturas) llevan clave foránea <code className="text-cyan-300">tenant_id</code>. Las políticas RLS de Supabase garantizan que ningún usuario ni club acceda a datos de otra entidad.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  PWA (Progressive Web App) y Modo Fuera de Línea
                </div>
                <p className="text-slate-300">
                  Service Worker registrado, Web App Manifest configurado con identidad del club y botón de instalación nativo para Android, Windows, Mac y guía paso a paso para iOS Safari.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowTechModal(false)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white transition"
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
