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
  Receipt,
} from 'lucide-react';
import { AdminHeader } from './AdminHeader';
import { PrivateMobileNav } from '../common/PrivateMobileNav';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../lib/i18n';
import { OfficialFlag } from '../common/OfficialFlag';
import { i18n } from '../../i18n';

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
    setSelectedCustomerId,
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

  const isCoach =
    currentTenant.type === 'COACH' || currentUser.role === 'COACH';
  const isAcademy =
    currentTenant.type === 'ACADEMY' || currentUser.role === 'ACADEMY_MANAGER';
  const isProAthleteAdmin =
    currentTenant.type === 'PRO_PLAYER' || currentUser.role === 'PROFESSIONAL_PLAYER';
  const isOrganizer =
    currentTenant.type === 'TOURNAMENT_ORGANIZER' || currentUser.role === 'TOURNAMENT_ORGANIZER';
  const isClub = !isCoach && !isAcademy && !isProAthleteAdmin && !isOrganizer;

  // 4 Main bottom tabs + Más (contextualizados estrictamente por rol y tipo de entidad)
  let mainDesktopTabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [];
  let moreTabs: { id: AdminTab; label: string; icon: React.ReactNode; desc: string; badge?: string }[] = [];

  if (isOrganizer) {
    // ORGANIZADOR DE EVENTOS: Competiciones, Ligas, Patrocinadores, Sede de Evento
    mainDesktopTabs = [
      { id: 'tournaments', label: 'Competiciones', icon: <Trophy className="w-5 h-5" /> },
      { id: 'matches', label: 'Ligas & Cuadros', icon: <Layers className="w-5 h-5" /> },
      { id: 'customers', label: 'Patrocinadores & Marcas', icon: <Briefcase className="w-5 h-5" /> },
      { id: 'courts_management', label: 'Sedes del Evento', icon: <Building2 className="w-5 h-5" /> },
    ];
    moreTabs = [
      {
        id: 'dashboard',
        label: 'Resumen del Circuito',
        icon: <LayoutDashboard className="w-5 h-5 text-purple-500" />,
        desc: 'Métricas de parejas, cuadros y calendario oficial',
      },
      {
        id: 'agenda',
        label: 'Calendario Oficial',
        icon: <Calendar className="w-5 h-5 text-indigo-500" />,
        desc: 'Fechas de pruebas y cuadrantes',
      },
      {
        id: 'invoicing',
        label: 'Recaudación & Premios',
        icon: <Receipt className="w-5 h-5 text-emerald-500" />,
        desc: 'Bolsa de premios 25.000€ y facturación de inscripciones',
        badge: 'Premios',
      },
      {
        id: 'web_editor',
        label: 'Web Oficial Circuito',
        icon: <Palette className="w-5 h-5 text-purple-500" />,
        desc: 'Personalización de la web homologada del circuito',
        badge: 'Marca Blanca',
      },
      {
        id: 'domains',
        label: 'Dominio Oficial & SSL',
        icon: <Globe className="w-5 h-5 text-teal-500" />,
        desc: 'circuitogalego.com activo con SSL',
      },
      {
        id: 'settings',
        label: 'Ajustes de Torneo',
        icon: <Settings className="w-5 h-5 text-slate-500" />,
        desc: 'Reglamentos, cuotas y jueces árbitros',
      },
    ];
  } else if (isCoach) {
    // PROFESOR INDEPENDIENTE: Mis Clases, Alumnos, Calendario Personal, Tarifas, Valoraciones (SIN pistas club ni TPV club)
    mainDesktopTabs = [
      { id: 'academy', label: 'Mis Clases', icon: <GraduationCap className="w-5 h-5" /> },
      { id: 'customers', label: 'Alumnos', icon: <Users className="w-5 h-5" /> },
      { id: 'agenda', label: 'Calendario Personal', icon: <Calendar className="w-5 h-5" /> },
      { id: 'settings', label: 'Tarifas & Bonos', icon: <CreditCard className="w-5 h-5" /> },
    ];
    moreTabs = [
      {
        id: 'dashboard',
        label: 'Valoraciones & Reseñas',
        icon: <Trophy className="w-5 h-5 text-amber-500" />,
        desc: 'Métricas de valoración 4.96 ★ y feedback de alumnos',
        badge: '4.96 ★',
      },
      {
        id: 'invoicing',
        label: 'Cobros Directos',
        icon: <Receipt className="w-5 h-5 text-emerald-500" />,
        desc: 'Honorarios particulares y cobros directos de alumnos',
        badge: 'Directo',
      },
      {
        id: 'web_editor',
        label: 'Web Personal Marca Blanca',
        icon: <Palette className="w-5 h-5 text-sky-500" />,
        desc: 'Personalización de web propia del entrenador',
        badge: 'Marca Blanca',
      },
      {
        id: 'domains',
        label: 'Dominio Personal & SSL',
        icon: <Globe className="w-5 h-5 text-teal-500" />,
        desc: 'varelacoach.com con DNS y SSL activo',
      },
      {
        id: 'subscription',
        label: 'Plan Profesor Pro',
        icon: <Briefcase className="w-5 h-5 text-slate-500" />,
        desc: 'Suscripción Setmio Coach activa',
        badge: 'COACH',
      },
    ];
  } else if (isAcademy) {
    // ACADEMIA / ESCUELA: Cursos, Grupos, Asistencia, Profesores, Alumnos y Pagos
    mainDesktopTabs = [
      { id: 'academy', label: 'Cursos & Grupos', icon: <GraduationCap className="w-5 h-5" /> },
      { id: 'agenda', label: 'Asistencia & Horarios', icon: <Calendar className="w-5 h-5" /> },
      { id: 'customers', label: 'Alumnos', icon: <Users className="w-5 h-5" /> },
      { id: 'invoicing', label: 'Pagos & Cuotas', icon: <Receipt className="w-5 h-5" /> },
    ];
    moreTabs = [
      {
        id: 'dashboard',
        label: 'Resumen Escuela',
        icon: <LayoutDashboard className="w-5 h-5 text-purple-500" />,
        desc: 'Ocupación de grupos, matrículas y alumnos activos',
      },
      {
        id: 'web_editor',
        label: 'Web Oficial Escuela',
        icon: <Palette className="w-5 h-5 text-emerald-500" />,
        desc: 'Personalización de la web de la academia',
        badge: 'Marca Blanca',
      },
      {
        id: 'domains',
        label: 'Dominio Oficial',
        icon: <Globe className="w-5 h-5 text-teal-500" />,
        desc: 'academiaelite.com con SSL activo',
      },
      {
        id: 'subscription',
        label: 'Plan Escuela Pro',
        icon: <Briefcase className="w-5 h-5 text-slate-500" />,
        desc: 'Suscripción Setmio Pro Escuela activa',
        badge: 'PRO',
      },
      {
        id: 'settings',
        label: 'Ajustes de Escuela',
        icon: <Settings className="w-5 h-5 text-slate-500" />,
        desc: 'Reglamentos, cuotas y notificaciones de escuela',
      },
    ];
  } else if (isProAthleteAdmin) {
    // JUGADOR PROFESIONAL: Calendario de Torneos, Patrocinadores, Rendimiento, Estadísticas, Gastos de Viaje
    mainDesktopTabs = [
      { id: 'agenda', label: 'Calendario de Torneos', icon: <Calendar className="w-5 h-5" /> },
      { id: 'customers', label: 'Patrocinadores & Marcas', icon: <Briefcase className="w-5 h-5" /> },
      { id: 'dashboard', label: 'Rendimiento Pro', icon: <LayoutDashboard className="w-5 h-5" /> },
      { id: 'matches', label: 'Estadísticas & FIP', icon: <Trophy className="w-5 h-5" /> },
    ];
    moreTabs = [
      {
        id: 'invoicing',
        label: 'Gastos de Viaje & Facturas',
        icon: <Receipt className="w-5 h-5 text-emerald-500" />,
        desc: 'Presupuestos de desplazamientos, premios FIP y sponsors',
        badge: 'Viajes',
      },
      {
        id: 'academy',
        label: 'Exhibiciones & Clinics VIP',
        icon: <GraduationCap className="w-5 h-5 text-purple-500" />,
        desc: 'Partidos de exhibición y clinics comerciales',
      },
      {
        id: 'web_editor',
        label: 'Web Marca Blanca (martinsanchez.com)',
        icon: <Palette className="w-5 h-5 text-red-500" />,
        desc: 'Personalización de la web oficial del atleta',
        badge: 'Marca Blanca',
      },
      {
        id: 'domains',
        label: 'Dominio Oficial & SSL',
        icon: <Globe className="w-5 h-5 text-teal-500" />,
        desc: 'martinsanchez.com con DNS y SSL activo',
      },
      {
        id: 'subscription',
        label: 'Plan Elite Atleta Pro',
        icon: <Briefcase className="w-5 h-5 text-amber-500" />,
        desc: 'Suscripción Setmio Pro Athlete activa',
        badge: 'PRO',
      },
      {
        id: 'settings',
        label: 'Ajustes del Atleta',
        icon: <Settings className="w-5 h-5 text-slate-500" />,
        desc: 'Notificaciones, agenda y canales preferidos',
      },
    ];
  } else {
    // CLUB DE PÁDEL: Pistas, Cuadrante de Reservas, TPV/Caja, Miembros, Torneos, Escuela, Facturación
    mainDesktopTabs = [
      { id: 'courts_management', label: 'Pistas', icon: <Layers className="w-5 h-5" /> },
      { id: 'agenda', label: 'Cuadrante de Reservas', icon: <Calendar className="w-5 h-5" /> },
      { id: 'pos_cafe', label: 'TPV / Caja', icon: <CreditCard className="w-5 h-5" /> },
      { id: 'customers', label: 'Miembros', icon: <Users className="w-5 h-5" /> },
    ];
    moreTabs = [
      {
        id: 'tournaments',
        label: 'Torneos',
        icon: <Trophy className="w-5 h-5 text-amber-500" />,
        desc: 'Torneos oficiales, cuadros y rankings',
      },
      {
        id: 'academy',
        label: 'Escuela de Pádel',
        icon: <GraduationCap className="w-5 h-5 text-purple-500" />,
        desc: 'Grupos, alumnos y entrenadores',
      },
      {
        id: 'invoicing',
        label: 'Facturación & AEAT',
        icon: <Receipt className="w-5 h-5 text-emerald-500" />,
        desc: 'Dashboard financiero, facturas y Veri*factu AEAT',
        badge: 'Veri*factu',
      },
      {
        id: 'dashboard',
        label: t('club.nav.dashboard', 'Inicio / Cuadro de Mando'),
        icon: <LayoutDashboard className="w-5 h-5 text-emerald-500" />,
        desc: 'Métricas clave de facturación y ocupación',
      },
      {
        id: 'matches',
        label: t('club.nav.matches', 'Partidas Abiertas'),
        icon: <Trophy className="w-5 h-5 text-blue-500" />,
        desc: 'Partidos abiertos y división de pagos',
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
  }

  const handleSelectTab = (tab: AdminTab) => {
    if (tab === 'customers') {
      setSelectedCustomerId(null);
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/gestion/jugadores/')) {
        window.history.pushState({}, '', '/gestion/jugadores');
      }
    }
    setAdminTab(tab);
    setMobileMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div data-admin-shell className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row pb-20 md:pb-0 transition-colors duration-200 w-full max-w-full overflow-x-hidden font-sans">
      {/* DESKTOP SIDEBAR (Marca Setmio B2B SaaS o Marca Blanca si es Recepción) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0">
        {/* Header de Identidad en Sidebar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {currentUser.role === 'RECEPTION' ? (
            /* Vista Recepción: Marca Blanca Propia del Club */
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-xl text-white font-black flex items-center justify-center shrink-0 text-xs shadow-sm select-none"
                style={{ backgroundColor: currentTenant.branding?.primaryColor || '#10b981' }}
              >
                {currentTenant.shortName.slice(0, 3).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-black text-xs text-slate-900 dark:text-white truncate tracking-wider">
                  {currentTenant.name}
                </div>
                <div className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  Recepción · Marca Blanca
                </div>
              </div>
            </div>
          ) : (
            /* Vista Admin Club / Escuela / Profesor / Atleta: Setmio Pro Oficial */
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black flex items-center justify-center shrink-0 text-sm shadow-sm select-none">
                S
              </div>
              <div className="min-w-0">
                <div className="font-black text-xs text-slate-900 dark:text-white truncate tracking-wider">
                  {isProAthleteAdmin ? 'Setmio Pro Athlete' : 'Setmio Pro'}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isProAthleteAdmin
                    ? 'Admin Atleta Pro'
                    : isOrganizer
                    ? 'Admin Organizador (SaaS)'
                    : isAcademy
                    ? 'Admin Escuela (SaaS)'
                    : isCoach
                    ? 'Admin Profesor (SaaS)'
                    : 'Admin Club (SaaS)'}
                </div>
              </div>
            </div>
          )}
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
            <div
              className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center aspect-square"
              style={{ borderRadius: '9999px', overflow: 'hidden' }}
            >
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover block aspect-square"
                  style={{ borderRadius: '9999px', objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-white font-black text-xs bg-emerald-600 w-full h-full flex items-center justify-center select-none">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 dark:text-white truncate text-[11px]">{currentUser.name}</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold truncate">
                {isProAthleteAdmin
                  ? 'Atleta Pro'
                  : isOrganizer
                  ? 'Organizador'
                  : isCoach
                  ? 'Profesor'
                  : isAcademy
                  ? 'Escuela'
                  : 'Club Admin'}
              </div>
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

            {/* ======================================================================
                AJUSTES MÓVILES: CONMUTADOR DE TEMA & SELECTOR DE IDIOMAS
                ====================================================================== */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {/* Conmutador de Modo Claro / Oscuro */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                    {theme === 'dark' ? (
                      <Moon className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <Sun className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      Modo {theme === 'dark' ? 'Oscuro' : 'Claro'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Conmutar apariencia visual
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-xl font-bold text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  aria-label="Cambiar tema"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Modo Claro</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Modo Oscuro</span>
                    </>
                  )}
                </button>
              </div>

              {/* Selector Completo de Idiomas con Banderas Oficiales */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Idioma de la Plataforma
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400">
                    {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name || language.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {SUPPORTED_LANGUAGES.map((l) => {
                    const isSelected = language === l.code;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          i18n.changeLanguage(l.code);
                          setLanguage(l.code);
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs text-left transition cursor-pointer border ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-2xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <OfficialFlag code={l.code} />
                          <span className="truncate">{l.name}</span>
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
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
