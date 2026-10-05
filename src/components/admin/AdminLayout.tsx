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
} from 'lucide-react';
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
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileMoreOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMoreOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileMoreOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 4 Main bottom tabs + Más
  const mainDesktopTabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: t('club.nav.dashboard', 'Inicio'), icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'agenda', label: t('club.nav.courts', 'Pistas & Reservas'), icon: <Calendar className="w-5 h-5" /> },
    { id: 'smart_courts', label: t('club.nav.iot', 'Domótica IoT'), icon: <Zap className="w-5 h-5" /> },
    { id: 'pos_cafe', label: t('club.nav.pos', 'TPV / Caja'), icon: <CreditCard className="w-5 h-5" /> },
  ];

  // Drawer / Sidebar modules
  const moreTabs: { id: AdminTab; label: string; icon: React.ReactNode; desc: string; badge?: string }[] = [
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

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div data-admin-shell className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100 flex flex-col md:flex-row pb-20 md:pb-0 transition-colors duration-200 w-full max-w-full overflow-x-hidden font-sans">
      {/* DESKTOP SIDEBAR (Marca Setmio B2B SaaS) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0">
        {/* Setmio SaaS Official Brand Header in Admin */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Setmio Logo Badge */}
            <div className="w-9 h-9 rounded-2xl bg-slate-950 border border-emerald-500/40 text-emerald-400 font-black flex items-center justify-center shrink-0 text-sm shadow-sm">
              <span className="font-extrabold tracking-tighter">SM</span>
            </div>
            <div className="min-w-0">
              <div className="font-black text-xs text-slate-900 dark:text-white truncate tracking-wider">
                SETMIO PADEL PRO
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
              const isActive = adminTab === tab.id;
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
        {/* HEADER SUPERIOR NATIVO (Compacto, fijo, con todas las especificaciones de marca) */}
        <header className="sticky top-0 z-40 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between gap-2 shadow-xs">
          {/* Left: Setmio Official Brand & Tab Name */}
          <div className="flex items-center gap-2 min-w-0">
            {/* Setmio Official Logo Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-slate-950 border border-emerald-500/50 text-emerald-400 font-black flex items-center justify-center text-xs shadow-xs">
                SM
              </div>
              <span className="font-black text-xs text-slate-900 dark:text-white tracking-wider hidden sm:inline">
                SETMIO
              </span>
            </div>

            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>

            {/* Club Status Switch (Abierto / Cerrado) */}
            <button
              type="button"
              onClick={toggleClubOpenState}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition border ${
                isClubOpen
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              }`}
              title="Conmutar estado del club (Abierto / Cerrado)"
            >
              <span className={`w-2 h-2 rounded-full ${isClubOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-[11px] font-extrabold">{isClubOpen ? t('club.status.open', 'Abierto') : t('club.status.closed', 'Cerrado')}</span>
            </button>
          </div>

          {/* Right: Actions (Idioma 11i18n, Vista Jugador, Theme, Logout) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Selector de Idioma 11i18n */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-800"
                aria-label="Seleccionar idioma"
              >
                <OfficialFlag code={currentLangObj.code} />
                <span className="hidden sm:inline uppercase text-[11px] font-mono">{currentLangObj.code}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in-50 duration-100 text-xs">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Idioma / Language
                  </div>
                  {SUPPORTED_LANGUAGES.map((langOpt) => (
                    <button
                      key={langOpt.code}
                      onClick={() => {
                        setLanguage(langOpt.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition text-left ${
                        language === langOpt.code
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <OfficialFlag code={langOpt.code} />
                      <span className="truncate">{langOpt.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Conmutador "Vista Jugador" (Probar Marca Blanca) */}
            <button
              type="button"
              onClick={enterWhiteLabelPlayerPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 hover:from-emerald-500/25 hover:to-teal-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-black transition active:scale-95 shadow-xs"
              title="Probar experiencia del socio con la Marca Blanca del Club"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">{t('white_label.player_view', 'Vista Jugador')}</span>
              <span className="px-1 py-0.2 rounded text-[9px] uppercase bg-emerald-600 text-white font-mono hidden md:inline">
                Marca Blanca
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Avatar de Usuario con Menú Desplegable (👤 Mi Perfil, ⚙️ Ajustes del Club, 🚪 Cerrar Sesión) */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition group focus:outline-none"
                aria-label="Menú de usuario"
                aria-expanded={userMenuOpen}
              >
                <div className="relative">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100 text-xs text-slate-800 dark:text-slate-200">
                  {/* Tarjeta de cabecera con datos de usuario */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 mb-1 flex items-center gap-3">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center shrink-0">
                        {currentUser.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {currentUser.email || 'admin@setmio.com'}
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Club Admin · Enterprise
                      </div>
                    </div>
                  </div>

                  {/* Opciones requeridas */}
                  <div className="space-y-0.5 py-1">
                    {/* 👤 Mi Perfil */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition text-left"
                    >
                      <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{t('club.menu.myProfile', '👤 Mi Perfil')}</span>
                    </button>

                    {/* ⚙️ Ajustes del Club */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleSelectTab('settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition text-left"
                    >
                      <Settings className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                      <span>{t('club.menu.clubSettings', '⚙️ Ajustes del Club')}</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  {/* 🚪 Cerrar Sesión (con icono LogOut, que redirige a /) */}
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logoutOrExitDemo();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-bold transition text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>{t('club.nav.logout', '🚪 Cerrar Sesión')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

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
                <div className="w-8 h-8 rounded-xl bg-slate-950 text-emerald-400 font-black flex items-center justify-center text-xs">
                  SM
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
