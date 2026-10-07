import React, { useEffect, useState, useRef } from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  GraduationCap,
  Trophy,
  ShoppingBag,
  Zap,
  CreditCard,
  Palette,
  Globe,
  Settings,
  Bell,
  Eye,
  LogOut,
  ChevronRight,
  X,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Building2,
  Lock,
  Unlock,
  User,
  Layers,
} from 'lucide-react';
import { AdminHeader } from './AdminHeader';
import { PrivateMobileNav } from '../common/PrivateMobileNav';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../lib/i18n';
import { OfficialFlag } from '../common/OfficialFlag';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    currentTenant,
    adminTab,
    setAdminTab,
    currentUser,
    logoutOrExitDemo,
    unreadNotificationsCount,
    markNotificationsAsRead,
    notifications,
    theme,
    toggleTheme,
    language,
    setLanguage,
    isClubOpen,
    toggleClubOpenState,
    enterWhiteLabelPlayerPreview,
    t,
  } = useApp();

  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    if (!mobileMoreOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMoreOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileMoreOpen]);

  // 4 Main bottom tabs + Más
  const mainDesktopTabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: t('club.nav.dashboard', 'Inicio'), icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'agenda', label: t('club.nav.bookings', 'Reservas'), icon: <Calendar className="w-5 h-5" /> },
    { id: 'smart_courts', label: t('club.nav.iot', 'Domótica'), icon: <Zap className="w-5 h-5" /> },
    { id: 'pos_cafe', label: t('club.nav.pos', 'TPV / Caja'), icon: <CreditCard className="w-5 h-5" /> },
  ];

  // Drawer / Sidebar modules
  const moreTabs: { id: AdminTab; label: string; icon: React.ReactNode; desc: string; badge?: string }[] = [
    {
      id: 'courts_management',
      label: 'Gestión de Pistas',
      icon: <Layers className="w-5 h-5 text-emerald-500" />,
      desc: 'Altas, bajas, tarifas y domótica IoT',
      badge: 'Nuevo',
    },
    {
      id: 'customers',
      label: t('club.nav.customers', 'Socios / CRM'),
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      desc: 'Base de datos, niveles y monedero',
    },
    {
      id: 'academy',
      label: t('club.nav.academy', 'Escuela / Entrenadores'),
      icon: <GraduationCap className="w-5 h-5 text-purple-500" />,
      desc: 'Grupos, alumnos y entrenadores',
    },
    {
      id: 'tournaments',
      label: t('club.nav.tournaments', 'Torneos y Ligas'),
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      desc: 'Cuadros eliminatorios y parejas',
    },
    {
      id: 'web_editor',
      label: t('club.nav.whitelabel', 'Configuración Marca Blanca'),
      icon: <Palette className="w-5 h-5 text-emerald-500" />,
      desc: 'Logo, colores oficiales y web del club',
      badge: 'Marca Blanca',
    },
    {
      id: 'domains',
      label: t('club.nav.domains', 'Dominios y DNS'),
      icon: <Globe className="w-5 h-5 text-teal-500" />,
      desc: 'Tu propio dominio .com con SSL',
    },
    {
      id: 'shop',
      label: t('club.nav.shop', 'Tienda y Pedidos'),
      icon: <ShoppingBag className="w-5 h-5 text-blue-500" />,
      desc: 'Catálogo de palas e inventario',
    },
    {
      id: 'teams',
      label: t('club.nav.teams', 'Equipos del Club'),
      icon: <Users className="w-5 h-5 text-cyan-500" />,
      desc: 'Convocatorias y capitanes',
    },
    {
      id: 'subscription',
      label: 'Suscripción SaaS (Enterprise)',
      icon: <Briefcase className="w-5 h-5 text-slate-500" />,
      desc: 'Plan Enterprise Top activo',
      badge: 'TOP',
    },
    {
      id: 'settings',
      label: t('club.nav.settings', 'Configuración Club'),
      icon: <Settings className="w-5 h-5 text-slate-500" />,
      desc: 'Horarios, políticas y WhatsApp',
    },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    setAdminTab(tab);
    setMobileMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div data-admin-shell className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row pb-20 md:pb-0 transition-colors duration-200 w-full max-w-full overflow-x-hidden font-sans">
      {/* DESKTOP SIDEBAR (Marca Setmio B2B SaaS) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0">
        {/* Setmio SaaS Official Brand Header in Admin */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Setmio Logo Badge */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black flex items-center justify-center shrink-0 text-sm shadow-sm select-none">
              S
            </div>
            <div className="min-w-0">
              <div className="font-black text-xs text-slate-900 dark:text-white truncate tracking-wider">
                SETMIO PRO
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Admin Club (SaaS)
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 text-xs scrollbar-thin">
          {/* Main 4 Tabs */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Operaciones Principales
            </div>
            {mainDesktopTabs.map((tab) => {
              const isActive =
                adminTab === tab.id ||
                (tab.id === 'agenda' && (adminTab === 'all_bookings' || adminTab === 'bookings'));
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
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
              Gestión Integral & Marca Blanca
            </div>
            {moreTabs.map((tab) => {
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {tab.icon}
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'}`}>
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
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold truncate">Club Admin</div>
            </div>
          </div>

          <button
            onClick={logoutOrExitDemo}
            className="p-1.5 text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
            title={t('club.nav.logout', 'Cerrar Sesión / Salir Demo')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER SUPERIOR NATIVO MODULAR */}
        <AdminHeader
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onSelectTab={handleSelectTab}
        />

        {/* Content View */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* BARRA INFERIOR FIJA MÓVIL (100% limpia sin cartel flotante) */}
      <PrivateMobileNav
        currentTab={adminTab}
        onSelectTab={handleSelectTab}
        onMore={() => setMobileMoreOpen(!mobileMoreOpen)}
        moreOpen={mobileMoreOpen}
      />

      {/* DRAWER TÁCTIL "MÁS" (Menú desplegable) */}
      {mobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black flex items-center justify-center text-xs shadow-xs select-none">
                  S
                </div>
                <div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Más Módulos & Herramientas
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Panel Admin de Club · {currentTenant.name}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMoreOpen(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Módulos en Drawer */}
            <div className="grid grid-cols-1 gap-2">
              {moreTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition text-left ${
                    adminTab === tab.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                      {tab.icon}
                    </div>
                    <div>
                      <div className="font-bold text-xs">{tab.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{tab.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>

            {/* Action Buttons in Drawer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMoreOpen(false);
                  enterWhiteLabelPlayerPreview();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 active:scale-98"
              >
                <Eye className="w-4 h-4" />
                <span>{t('white_label.player_view', 'Probar Vista Jugador (Marca Blanca)')}</span>
              </button>

              <button
                type="button"
                onClick={logoutOrExitDemo}
                className="w-full py-3 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-extrabold text-xs border border-rose-200 dark:border-rose-800 transition flex items-center justify-center gap-2 active:scale-98"
              >
                <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>{t('club.nav.logout', 'Cerrar Sesión / Salir de la Demo')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* User Profile Modal Dialog */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base">Mi Perfil de Usuario</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Gestor Oficial de Club en Setmio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Identity Details */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-base truncate">{currentUser.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email || 'admin@setmio.com'}</div>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Admin Club · Plan Enterprise TOP
                </div>
              </div>
            </div>

            {/* Club Context Info */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Club Vinculado:</span>
                <span className="font-bold">{currentTenant.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Ubicación:</span>
                <span className="font-bold">{currentTenant.city}, {currentTenant.region}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Permisos y Rol:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">SUPERADMIN_CLUB (Full Access)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Control IoT & TPV:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Habilitado</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  handleSelectTab('settings');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
              >
                Ajustes del Club
              </button>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
