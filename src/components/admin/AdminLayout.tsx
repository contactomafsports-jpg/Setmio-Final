import React, { useEffect, useState } from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import {
  Home,
  Calendar,
  Users,
  Briefcase,
  MoreHorizontal,
  GraduationCap,
  Trophy,
  ShoppingBag,
  Zap,
  Coffee,
  Palette,
  Globe,
  Settings,
  CreditCard,
  Bell,
  Eye,
  LogOut,
  ChevronRight,
  X,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    currentTenant,
    adminTab,
    setAdminTab,
    currentUser,
    setCurrentView,
    unreadNotificationsCount,
    markNotificationsAsRead,
    notifications,
    theme,
    toggleTheme,
  } = useApp();

  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!mobileMoreOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMoreOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileMoreOpen]);

  const mainTabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
    { id: 'agenda', label: 'Reservas', icon: <Calendar className="w-5 h-5" /> },
    { id: 'customers', label: 'Clientes', icon: <Users className="w-5 h-5" /> },
    { id: 'subscription', label: 'Negocio', icon: <Briefcase className="w-5 h-5" /> },
  ];

  const moreTabs: { id: AdminTab; label: string; icon: React.ReactNode; desc: string; badge?: string }[] = [
    { id: 'web_editor', label: 'Editor Web y App', icon: <Palette className="w-5 h-5 text-emerald-500" />, desc: 'Diseño, bloques y marca blanca' },
    { id: 'teams', label: 'Equipos y plantillas', icon: <Users className="w-5 h-5 text-indigo-500" />, desc: 'Convocatorias y gestión de jugadores' },
    { id: 'domains', label: 'Mi Web y mi App', icon: <Globe className="w-5 h-5 text-teal-500" />, desc: 'Dominios, DNS y enlaces públicos', badge: 'Prioritario' },
    { id: 'smart_courts', label: 'Pistas Inteligentes', icon: <Zap className="w-5 h-5 text-amber-500" />, desc: 'Luces automáticas y PIN cerradura', badge: 'IoT' },
    { id: 'academy', label: 'Escuela y Clases', icon: <GraduationCap className="w-5 h-5 text-purple-500" />, desc: 'Grupos, alumnos y entrenadores' },
    { id: 'tournaments', label: 'Torneos y Ligas', icon: <Trophy className="w-5 h-5 text-yellow-500" />, desc: 'Cuadros eliminatorios y parejas' },
    { id: 'shop', label: 'Tienda y Pedidos', icon: <ShoppingBag className="w-5 h-5 text-blue-500" />, desc: 'Catálogo de palas e inventario' },
    { id: 'pos_cafe', label: 'Cafetería y TPV', icon: <Coffee className="w-5 h-5 text-rose-500" />, desc: 'Caja rápida y barra social', badge: 'TPV' },
    { id: 'settings', label: 'Configuración Club', icon: <Settings className="w-5 h-5 text-slate-500" />, desc: 'Horarios, políticas y WhatsApp' },
  ];

  const tabLabels: Record<AdminTab, string> = {
    dashboard: 'Resumen',
    agenda: 'Reservas',
    customers: 'Clientes',
    teams: 'Equipos y plantillas',
    subscription: 'Negocio',
    web_editor: 'Editor Web y App',
    domains: 'Mi Web y mi App',
    smart_courts: 'Pistas Inteligentes',
    academy: 'Escuela y Clases',
    tournaments: 'Torneos y Ligas',
    shop: 'Tienda y Pedidos',
    pos_cafe: 'Cafetería y TPV',
    settings: 'Configuración Club',
  };

  const handleSelectTab = (tab: AdminTab) => {
    setAdminTab(tab);
    setMobileMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div data-admin-shell className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100 flex flex-col md:flex-row pb-20 md:pb-0 transition-colors duration-200 w-full max-w-full overflow-x-hidden">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0">
        {/* Club Brand in Sidebar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {currentTenant.branding.logoUrl ? (
              <img src={currentTenant.branding.logoUrl} alt="" className="w-8 h-8 rounded-xl bg-white object-contain border border-slate-200 p-1 shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black flex items-center justify-center shrink-0 text-sm shadow-sm">
                {currentTenant.shortName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{currentTenant.shortName}</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Gestión Club</div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('public')}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Ver Web Pública"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 text-xs">
          {/* Core Section */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Operaciones
            </div>
            {mainTabs.map((tab) => {
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Módulos Especializados */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Módulos Especializados
            </div>
            {moreTabs.map((tab) => {
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {tab.icon}
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-cyan-300'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-300 dark:border-slate-700"
            />
            <div className="min-w-0">
              <div className="font-bold text-slate-900 dark:text-white truncate text-[11px]">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 font-mono">{currentUser.role}</div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('public')}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition"
            title="Ir a web pública"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Management Header */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.12)] shrink-0" />
            <h1 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white truncate">
              {tabLabels[adminTab]}
            </h1>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline truncate">
              {currentTenant.shortName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Quick Public Web button */}
            <button
              onClick={() => setCurrentView('public')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Ver Web Pública</span>
            </button>

            {/* Notifications Toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  markNotificationsAsRead();
                }}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-3 font-bold text-slate-900 dark:text-white">
                    <span>Notificaciones del Club</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">{n.title}</div>
                        <div className="text-slate-700 dark:text-slate-300 text-[11px]">{n.message}</div>
                        <div className="text-slate-400 text-[9px]">{n.timestamp}</div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-5 text-center text-slate-500 dark:text-slate-400">
                        No tienes notificaciones nuevas.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Child Tab Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_28%),#f8fafc] dark:bg-slate-950">
          {children}
        </main>
      </div>

      {/* MOBILE NATIVE BOTTOM BAR */}
      <nav aria-label="Navegación principal del club" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-12px_30px_rgba(15,23,42,0.08)]">
        {mainTabs.map((tab) => {
          const isActive = adminTab === tab.id && !mobileMoreOpen;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}

        {/* "Más" Tab Trigger */}
        <button
          onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
            mobileMoreOpen || moreTabs.some((t) => t.id === adminTab)
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px]">Más</span>
        </button>
      </nav>

      {/* MOBILE "MÁS" BOTTOM SHEET */}
      {mobileMoreOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-150"
          onClick={(event) => { if (event.target === event.currentTarget) setMobileMoreOpen(false); }}
        >
          <div role="dialog" aria-modal="true" aria-label="Módulos de gestión" className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Módulos de Gestión</h3>
              <button
                onClick={() => setMobileMoreOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Módulos organizados por áreas de gestión del club.
              </p>

              {[
                {
                  title: 'Instalaciones & Automatización',
                  tabs: moreTabs.filter((t) => ['smart_courts'].includes(t.id)),
                },
                {
                  title: 'Comunidad & Competición',
                  tabs: moreTabs.filter((t) => ['teams', 'academy', 'tournaments'].includes(t.id)),
                },
                {
                  title: 'Ventas & Restauración',
                  tabs: moreTabs.filter((t) => ['shop', 'pos_cafe'].includes(t.id)),
                },
                {
                  title: 'Marca Blanca & Configuración',
                  tabs: moreTabs.filter((t) => ['web_editor', 'domains', 'settings'].includes(t.id)),
                },
              ].map((section) => (
                <div key={section.title} className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    {section.title}
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {section.tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleSelectTab(tab.id)}
                        className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition ${
                          adminTab === tab.id
                            ? 'bg-emerald-50 dark:bg-slate-800 border-emerald-500 text-emerald-900 dark:text-white'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                            {tab.icon}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <span>{tab.label}</span>
                              {tab.badge && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                  {tab.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{tab.desc}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
