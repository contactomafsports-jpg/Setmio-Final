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
    navigateToEntityWeb,
    viewEntityWeb,
    navigateToCorporate,
    setIsWhiteLabelPlayerPreview,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);

  const supabaseStatus = getSupabaseStatus();

  const rolesList: {
    id: string;
    role: UserRole;
    ecosystem: 'club' | 'independent' | 'neutral' | 'hq';
    label: string;
    desc: string;
    tenantId?: string;
    tenantType?: string;
    isWhiteLabelPlayer?: boolean;
    view: MainView;
  }[] = [
    // 1. Ecosistema Club (Centro de Pádel San Mateo)
    {
      id: 'club_admin',
      role: 'TENANT_OWNER',
      ecosystem: 'club',
      label: 'Admin Club (San Mateo)',
      desc: 'Control total de pistas, TPV y reservas',
      tenantId: 'tenant-san-mateo-01',
      tenantType: 'PADEL_CLUB',
      view: 'admin',
    },
    {
      id: 'coach_club',
      role: 'COACH',
      ecosystem: 'club',
      label: 'Profesor de Club',
      desc: 'Marca San Mateo, cuadrante y alumnos asignados',
      tenantId: 'tenant-san-mateo-01',
      tenantType: 'PADEL_CLUB',
      view: 'coach',
    },
    {
      id: 'player_club',
      role: 'PLAYER',
      ecosystem: 'club',
      label: 'Jugador Socio / Club',
      desc: 'App marca blanca: logo, pistas y TPV del club',
      tenantId: 'tenant-san-mateo-01',
      tenantType: 'PADEL_CLUB',
      isWhiteLabelPlayer: true,
      view: 'player',
    },

    // 2. Ecosistema Marca Blanca Independiente
    {
      id: 'coach_independent',
      role: 'COACH',
      ecosystem: 'independent',
      label: 'Profesor Independiente',
      desc: 'Carlos Varela: bonos y particulares sin pistas',
      tenantId: 'tenant-varela-coach',
      tenantType: 'COACH',
      view: 'coach',
    },
    {
      id: 'academy',
      role: 'ACADEMY_MANAGER',
      ecosystem: 'independent',
      label: 'Escuela de Pádel',
      desc: 'Academia Élite: colectivo profesores y cursos',
      tenantId: 'tenant-academia-elite',
      tenantType: 'ACADEMY',
      view: 'admin',
    },
    {
      id: 'pro_player',
      role: 'PROFESSIONAL_PLAYER',
      ecosystem: 'independent',
      label: 'Jugador Profesional',
      desc: 'Martín Diestro: patrocinios y circuito FIP',
      tenantId: 'tenant-martin-pro',
      tenantType: 'PRO_PLAYER',
      view: 'admin',
    },

    // 3. Ecosistema Setmio Player (Neutra)
    {
      id: 'player_neutral',
      role: 'PLAYER',
      ecosystem: 'neutral',
      label: 'Jugador Setmio Player',
      desc: 'App neutra B2C: ELO global, ranking y multi-club',
      isWhiteLabelPlayer: false,
      view: 'player',
    },

    // 4. Superadmin HQ
    {
      id: 'superadmin',
      role: 'SUPERADMIN',
      ecosystem: 'hq',
      label: 'Superadmin HQ',
      desc: 'Plataforma SaaS global y facturación B2B',
      view: 'hq',
    },
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
                    Clubes y Academias Activas
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
                        <div className="flex items-center gap-1.5">
                          <span>{t.name}</span>
                          <span className="text-[9px] uppercase font-bold px-1 py-0.2 rounded bg-slate-700/80 text-cyan-300">
                            {t.type === 'PADEL_CLUB' ? 'Club' : t.type === 'ACADEMY' ? 'Academia' : t.type === 'COACH' ? 'Coach' : t.type === 'PRO_PLAYER' ? 'Pro' : t.type}
                          </span>
                        </div>
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
                viewEntityWeb();
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition ${
                !isCorporateLanding && currentView === 'public'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={`Web Pública de ${currentTenant.shortName}`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {currentTenant.type === 'COACH' || currentView === 'coach'
                  ? 'Web Entrenador'
                  : currentTenant.type === 'ACADEMY' || currentUser.role === 'ACADEMY_MANAGER'
                  ? 'Web Academia'
                  : currentTenant.type === 'PRO_PLAYER' || currentUser.role === 'PROFESSIONAL_PLAYER'
                  ? 'Web Pro'
                  : 'Web Club'}
              </span>
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
                <div className="absolute top-full right-0 mt-1 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 max-h-[80vh] overflow-y-auto">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Simulador de Ecosistemas y Roles
                  </div>
                  {rolesList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setIsCorporateLanding(false);

                        if (item.tenantId) {
                          switchTenant(item.tenantId);
                        } else if (item.tenantType) {
                          const match = tenants.find((t) => t.type === item.tenantType);
                          if (match) switchTenant(match.id);
                        }

                        setIsWhiteLabelPlayerPreview(Boolean(item.isWhiteLabelPlayer));
                        switchUserRole(item.role);
                        setCurrentView(item.view);
                        setShowRoleMenu(false);

                        triggerDemoToast(
                          'Entorno Demo Actualizado',
                          `Cambiado a "${item.label}". ${item.desc}`,
                          'info'
                        );
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-800 transition ${
                        currentUser.role === item.role
                          ? 'bg-slate-800 text-cyan-400 font-semibold'
                          : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {item.ecosystem.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{item.desc}</div>
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
                  Aislamiento por Club y Seguridad RLS
                </div>
                <p className="text-slate-300">
                  Todas las entidades de negocio (pistas, reservas, clientes, pedidos, facturas) llevan clave foránea <code className="text-cyan-300">tenant_id</code> o <code className="text-cyan-300">club_id</code>. Las políticas RLS de Supabase garantizan que ningún usuario ni club acceda a datos de otra entidad.
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
