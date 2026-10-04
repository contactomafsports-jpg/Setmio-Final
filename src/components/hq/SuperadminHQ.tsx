import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tenant, Plan, PlanTier } from '../../types/database';
import {
  ShieldAlert,
  Building2,
  DollarSign,
  TrendingUp,
  Globe,
  Sliders,
  Users,
  HardDrive,
  Bot,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  RefreshCw,
  Search,
  User,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export const SuperadminHQ: React.FC = () => {
  const {
    tenants,
    plans,
    updatePlan,
    switchTenant,
    setCurrentView,
    auditLogs,
    triggerDemoToast,
    currentUser,
    switchUserRole,
    logoutOrExitDemo,
  } = useApp();

  const [activeHqTab, setActiveHqTab] = useState<'overview' | 'tenants' | 'plans' | 'domains' | 'audit'>('overview');
  const [tenantSearch, setTenantSearch] = useState('');
  const [showCreateTenantModal, setShowCreateTenantModal] = useState(false);
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  // New tenant form
  const [newClubName, setNewClubName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPlanId, setNewPlanId] = useState<PlanTier>('pro');

  const totalMRR = tenants.reduce((acc, t) => {
    const p = plans.find((plan) => plan.id === t.planId);
    return acc + (p?.priceMonthly || 0);
  }, 0);

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.city.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.slug.toLowerCase().includes(tenantSearch.toLowerCase())
  );

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    triggerDemoToast(
      'Nuevo Tenant Creado en Setmio',
      `Club "${newClubName}" aprovisionado con plan ${newPlanId.toUpperCase()} y subdominio asignado.`,
      'success'
    );
    setShowCreateTenantModal(false);
    setNewClubName('');
    setNewCity('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* Top Superadmin Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-800/60 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>SETMIO HQ · Panel de Superadministración Global</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Infraestructura Global Setmio
          </h1>
          <p className="text-xs text-slate-400">
            Control de empresas cliente, suscripciones de software, catálogo de planes y auditoría global.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Switch to Modo Jugador */}
          <button
            onClick={() => {
              switchUserRole('PLAYER');
              setCurrentView('player');
            }}
            className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition"
            title="Alternar a Modo Jugador sin cerrar sesión"
          >
            <User className="w-4 h-4" />
            <span>Modo Jugador</span>
          </button>

          <button
            onClick={() => setCurrentView('public')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Web Club</span>
          </button>

          <button
            onClick={() => setShowCreateTenantModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white text-xs shadow-lg flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Club</span>
          </button>

          {/* Cerrar Sesión / Salir Demo */}
          <button
            onClick={logoutOrExitDemo}
            className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition"
            title="Cerrar Sesión / Salir Demo"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Salir Demo</span>
          </button>
        </div>
      </div>

      {/* Global SaaS KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>MRR Global de Setmio</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{totalMRR.toFixed(2)} €</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24% crecimiento trimestral</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Empresas Activas (Tenants)</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{tenants.length}</div>
          <div className="text-[11px] text-slate-400">Clubes y Academias de Pádel</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pistas Gestionadas</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">18 Pistas</div>
          <div className="text-[11px] text-purple-400">En 3 sedes autonómicas</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Dominios Verificados SSL</span>
            <Globe className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">4 Dominios</div>
          <div className="text-[11px] text-amber-400">Vercel Multi-Domain Routing</div>
        </div>
      </div>

      {/* HQ Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setActiveHqTab('overview')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeHqTab === 'overview' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Resumen & Métricas
        </button>
        <button
          onClick={() => setActiveHqTab('tenants')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeHqTab === 'tenants' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Empresas / Tenants ({tenants.length})
        </button>
        <button
          onClick={() => setActiveHqTab('plans')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeHqTab === 'plans' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Planes y Precios (4 Planes)
        </button>
        <button
          onClick={() => setActiveHqTab('audit')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeHqTab === 'audit' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Auditoría de Acciones
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeHqTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Estado de la Red de Tenants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {tenants.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{t.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] uppercase border border-emerald-800">
                      {t.planId}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    {t.city}, {t.region} · {t.contactEmail}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-900">
                    <span className="text-slate-500 font-mono text-[10px]">{t.slug}.setmio.com</span>
                    <button
                      onClick={() => {
                        switchTenant(t.id);
                        setCurrentView('admin');
                      }}
                      className="text-xs text-purple-400 font-bold hover:underline"
                    >
                      Gestionar &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TENANTS DIRECTORY */}
      {activeHqTab === 'tenants' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={tenantSearch}
                onChange={(e) => setTenantSearch(e.target.value)}
                placeholder="Buscar por club, ciudad o slug..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={() => setShowCreateTenantModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Tenant</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {filteredTenants.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{t.name}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono text-[10px] uppercase border border-purple-800">
                      {t.planId}
                    </span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Activo Demo</span>
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {t.city}, {t.region} · Dominio: <code className="text-cyan-300">{t.domains[0]?.hostname}</code>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      switchTenant(t.id);
                      setCurrentView('admin');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
                  >
                    Entrar al Espacio
                  </button>

                  <button
                    onClick={() => {
                      triggerDemoToast('Estado Tenant', `Estado de ${t.name} verificado.`, 'info');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white text-xs border border-slate-800 transition"
                  >
                    Auditar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PLANS EDITOR */}
      {activeHqTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Catálogo de Planes Globales de Setmio</h3>
            <span className="text-xs text-slate-400">Modifica precios y límites para toda la red SaaS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {plans.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-base">{p.name}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      {p.id}
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-semibold mb-1">
                      Precio Mensual (€)
                    </label>
                    <input
                      type="number"
                      value={p.priceMonthly}
                      onChange={(e) => updatePlan(p.id, { priceMonthly: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-semibold mb-1">
                      Límite Máximo de Pistas
                    </label>
                    <input
                      type="number"
                      value={p.maxCourts}
                      onChange={(e) => updatePlan(p.id, { maxCourts: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span>Web Pública Multipágina:</span>
                      <strong className={p.hasPublicWeb ? 'text-emerald-400' : 'text-slate-500'}>
                        {p.hasPublicWeb ? 'Sí' : 'No'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Dominio Propio SSL:</span>
                      <strong className={p.hasCustomDomain ? 'text-emerald-400' : 'text-slate-500'}>
                        {p.hasCustomDomain ? 'Sí' : 'No'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Pistas Inteligentes IoT:</span>
                      <strong className={p.hasSmartCourtAutomation ? 'text-emerald-400' : 'text-slate-500'}>
                        {p.hasSmartCourtAutomation ? 'Sí' : 'No'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-[10px] text-center text-slate-500">Guardado automático en tiempo real</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeHqTab === 'audit' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Registro de Acciones Sensibles & Seguridad</h3>

          <div className="space-y-2 text-xs">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{log.action}</span>
                    <span className="text-[10px] font-mono text-purple-400">[{log.role}]</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{log.details}</div>
                </div>
                <div className="text-slate-500 font-mono text-[10px] shrink-0">{log.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Tenant Modal */}
      {showCreateTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-1">Aprovisionar Nueva Empresa / Tenant</h3>
            <p className="text-xs text-slate-400 mb-4">Se creará un nuevo subdominio aislado y base de datos con políticas RLS.</p>

            <form onSubmit={handleCreateTenant} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Nombre Comercial del Club</label>
                <input
                  type="text"
                  required
                  value={newClubName}
                  onChange={(e) => setNewClubName(e.target.value)}
                  placeholder="Club Padel Vigo"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Ciudad / Ubicación</label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="Vigo, Galicia"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Plan de Suscripción Inicial</label>
                <select
                  value={newPlanId}
                  onChange={(e) => setNewPlanId(e.target.value as PlanTier)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="free">FREE (Básico)</option>
                  <option value="starter">STARTER (39€/mes)</option>
                  <option value="pro">PRO (89€/mes)</option>
                  <option value="elite">ELITE (159€/mes)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTenantModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow"
                >
                  Aprovisionar Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR FOR SUPERADMIN */}
      <nav
        aria-label="Navegación móvil Superadmin"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 px-1 py-1 text-[10px] shadow-2xl"
      >
        <button
          onClick={() => setActiveHqTab('overview')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            activeHqTab === 'overview' ? 'text-purple-400 font-bold' : 'text-slate-400'
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span>Resumen</span>
        </button>

        <button
          onClick={() => setActiveHqTab('tenants')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            activeHqTab === 'tenants' ? 'text-purple-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Building2 className="w-5 h-5 mb-0.5" />
          <span>Clubes</span>
        </button>

        <button
          onClick={() => setShowCreateTenantModal(true)}
          className="flex flex-col items-center justify-center py-1 text-white"
        >
          <div className="w-10 h-10 -mt-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg border-2 border-slate-900">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold text-purple-400 mt-0.5">Crear</span>
        </button>

        <button
          onClick={() => setActiveHqTab('plans')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            activeHqTab === 'plans' ? 'text-purple-400 font-bold' : 'text-slate-400'
          }`}
        >
          <DollarSign className="w-5 h-5 mb-0.5" />
          <span>Planes</span>
        </button>

        <button
          onClick={() => setShowMoreDrawer(true)}
          className="flex flex-col items-center justify-center py-1.5 rounded-xl text-slate-400 hover:text-white"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Más</span>
        </button>

        <button
          onClick={logoutOrExitDemo}
          className="flex flex-col items-center justify-center py-1.5 rounded-xl text-rose-400 hover:text-rose-300 font-semibold"
          title="Cerrar Sesión / Salir Demo"
        >
          <LogOut className="w-5 h-5 mb-0.5 text-rose-400" />
          <span>Salir</span>
        </button>
      </nav>

      {/* MOBILE MORE DRAWER */}
      {showMoreDrawer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm md:hidden animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-t-3xl border-t border-slate-800 p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-purple-400" />
                <span className="font-bold text-sm text-white">Superadmin HQ · Opciones</span>
              </div>
              <button
                onClick={() => setShowMoreDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveHqTab('domains');
                  setShowMoreDrawer(false);
                }}
                className="w-full p-3 rounded-2xl bg-slate-850 bg-slate-800/80 border border-slate-700 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Enrutamiento & Dominios</div>
                    <div className="text-[10px] text-slate-400">Certificados SSL y dominios personalizados</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setActiveHqTab('audit');
                  setShowMoreDrawer(false);
                }}
                className="w-full p-3 rounded-2xl bg-slate-850 bg-slate-800/80 border border-slate-700 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Auditoría Global de Seguridad</div>
                    <div className="text-[10px] text-slate-400">Logs de accesos, reservas y cobros</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  switchUserRole('PLAYER');
                  setCurrentView('player');
                  setShowMoreDrawer(false);
                }}
                className="w-full p-3 rounded-2xl bg-emerald-950/60 border border-emerald-700 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-emerald-200">Alternar a Modo Jugador</div>
                    <div className="text-[10px] text-emerald-400">Probar la experiencia desde el móvil del socio</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('admin');
                  setShowMoreDrawer(false);
                }}
                className="w-full p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-slate-300" />
                  <div>
                    <div className="text-xs font-bold text-white">Panel de Gestión del Club Activo</div>
                    <div className="text-[10px] text-slate-400">Entrar como administrador de {tenants[0]?.shortName}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setShowMoreDrawer(false);
                  logoutOrExitDemo();
                }}
                className="w-full p-3 rounded-2xl bg-rose-950/60 border border-rose-800 text-left flex items-center justify-between text-rose-300"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-600 text-white">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-rose-200">Cerrar Sesión / Salir Demo</div>
                    <div className="text-[10px] text-rose-400">Volver a la portada pública principal</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
