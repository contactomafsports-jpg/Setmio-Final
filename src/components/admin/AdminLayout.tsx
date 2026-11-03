import React, { useEffect, useState } from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import {
  LogOut,
  ChevronRight,
  X,
  Sun,
  Moon,
  Globe,
  CheckCircle2,
  User,
  Eye,
} from 'lucide-react';
import { AdminHeader } from './AdminHeader';
import { PrivateMobileNav } from '../common/PrivateMobileNav';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../lib/i18n';
import { OfficialFlag } from '../common/OfficialFlag';
import { i18n } from '../../i18n';
import { getAdminNavConfig } from '../../lib/adminNavigation';
import { SetmioLogo } from '../common/SetmioLogo';

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
    theme,
    setTheme,
    toggleTheme,
    adminTheme,
    setAdminTheme,
    language,
    setLanguage,
    enterWhiteLabelPlayerPreview,
    setSelectedCustomerId,
    isMultiVenue,
    venues,
    triggerDemoToast,
    t,
  } = useApp();

  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const branding = currentTenant.branding;
    root.style.setProperty('--color-primary', branding?.primaryColor || '#0B1A2D');
    root.style.setProperty('--color-secondary', branding?.secondaryColor || '#64748B');
    root.style.setProperty('--color-accent', branding?.accentColor || '#B7F229');
    return () => {
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--color-secondary');
      root.style.removeProperty('--color-accent');
    };
  }, [currentTenant.branding]);

  useEffect(() => {
    if (!mobileMoreOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMoreOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileMoreOpen]);

  // Configuración de navegación centralizada y unificada
  const navConfig = getAdminNavConfig(currentTenant, currentUser, isMultiVenue, venues);
  const {
    roleTitle,
    roleSubtitle,
    isReception,
    hasPhysicalInfrastructure,
    primaryItems,
    secondaryItems,
    allItems,
  } = navConfig;

  const handleSelectTab = (tab: AdminTab) => {
    // Restricción de negocio: si no cuenta con infraestructura física y se intenta abrir pistas, redirigir
    if (tab === 'courts_management' && !hasPhysicalInfrastructure && !navConfig.isOrganizer) {
      triggerDemoToast(
        'Módulo Restringido',
        'La gestión de pistas e instalaciones físicas requiere infraestructura propia.',
        'warning'
      );
      return;
    }

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
    <div data-admin-shell className="min-h-screen bg-slate-50 dark:bg-[#0B1A2D] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row pb-24 md:pb-0 transition-colors duration-200 w-full max-w-full overflow-x-hidden font-sans">
      {/* ======================================================================
          SIDEBAR LATERAL UNIFICADO (ESCRITORIO / TABLET)
          - En Marca Blanca (Recepción): Menú único, adaptado y limpio
          - En Modo Admin SaaS: Jerarquía unificada idéntica a la navegación móvil
          ====================================================================== */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#071220] border-r border-slate-200 dark:border-slate-800 shrink-0 select-none">
        {/* Cabecera de Identidad en Sidebar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {isReception ? (
            /* Vista Recepción: Marca Blanca Propia del Club (Único encabezado limpio) */
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-xl text-white font-black flex items-center justify-center shrink-0 text-xs shadow-sm select-none"
                style={{ backgroundColor: currentTenant.branding?.primaryColor || '#0B1A2D' }}
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
              <SetmioLogo variant="symbol" size="sm" />
              <div className="min-w-0">
                <div className="font-black text-xs text-slate-900 dark:text-white truncate tracking-wider">
                  {roleTitle}
                </div>
                <div className="text-[10px] text-[#8B5CF6] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#87F229] animate-pulse" />
                  {roleSubtitle}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Navegación del Menú Lateral */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 text-xs scrollbar-thin">
          {isReception ? (
            /* VISTA RECEPCIÓN MARCA BLANCA: Menú Único y Adaptado (Sin duplicidad) */
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Operaciones del Club
              </div>
              {allItems.map((tab) => {
                const Icon = tab.icon;
                const isActive =
                  adminTab === tab.id ||
                  (tab.id === 'agenda' && (adminTab === 'all_bookings' || adminTab === 'bookings'));
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSelectTab(tab.id)}
                    style={isActive ? { backgroundColor: currentTenant.branding?.primaryColor || '#0B1A2D' } : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl font-bold transition cursor-pointer ${
                      isActive
                        ? 'text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* VISTA ADMINISTRACIÓN: Jerarquía Estructurada y Sincronizada con Setmio Violet */
            <>
              {/* Bloque 1: Operaciones Principales (Compartidas con la barra inferior móvil) */}
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Operaciones Principales
                </div>
                {primaryItems.map((tab) => {
                  const Icon = tab.icon;
                  const isActive =
                    adminTab === tab.id ||
                    (tab.id === 'agenda' && (adminTab === 'all_bookings' || adminTab === 'bookings'));
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleSelectTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl font-bold transition cursor-pointer ${
                        isActive
                          ? 'bg-[#0B1A2D] text-white shadow-md shadow-[#0B1A2D]/20'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                        <span className="truncate">{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bloque 2: Gestión Integral & Módulos Especializados */}
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Gestión & Configuración
                </div>
                {secondaryItems.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = adminTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleSelectTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition cursor-pointer ${
                        isActive
                          ? 'bg-[#8B5CF6] text-white font-bold shadow-md shadow-[#8B5CF6]/25'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" strokeWidth={isActive ? 2.5 : 1.75} />
                        <span className="truncate">{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-[#8B5CF6]'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Pie de Usuario en Sidebar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050c17] flex items-center justify-between text-xs">
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
                {isReception ? 'Recepción Club' : roleSubtitle}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logoutOrExitDemo}
            className="p-1.5 text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
            title={t('club.nav.logout', 'Cerrar Sesión / Salir Demo')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ======================================================================
          CONTENEDOR PRINCIPAL
          ====================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Superior Nativo Modular (Oculto en páginas secundarias de Nivel 2 como 'all_bookings') */}
        {adminTab !== 'all_bookings' && (
          <AdminHeader
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onSelectTab={handleSelectTab}
          />
        )}

        {/* Contenido Dinámico de la Pestaña Activa con márgenes optimizados px-3.5 */}
        <main className={`flex-1 px-3.5 py-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto ${adminTab === 'all_bookings' ? 'pt-4 sm:pt-6' : ''}`}>
          {children}
        </main>
      </div>

      {/* ======================================================================
          BARRA INFERIOR MÓVIL UNIFICADA (SINCRONIZADA CON EL SIDEBAR)
          ====================================================================== */}
      <PrivateMobileNav
        currentTab={adminTab}
        onSelectTab={handleSelectTab}
        onMore={() => setMobileMoreOpen(!mobileMoreOpen)}
        moreOpen={mobileMoreOpen}
      />

      {/* ======================================================================
          DRAWER TÁCTIL "MÁS" EN MÓVIL (Módulos Secundarios en Idéntico Orden)
          ====================================================================== */}
      {mobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <SetmioLogo variant="symbol" size="sm" />
                <div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Más Módulos & Herramientas
                  </div>
                  <div className="text-[10px] text-[#8B5CF6] font-bold">
                    {roleTitle} · {currentTenant.name}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMoreOpen(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Módulos en Drawer Secundario (Línea Ejecutiva Limpia) */}
            <div className="space-y-1">
              {secondaryItems.map((tab) => {
                const Icon = tab.icon;
                const isActive = adminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-left cursor-pointer group active:scale-98 ${
                      isActive
                        ? 'bg-[#8B5CF6]/15 dark:bg-[#8B5CF6]/25 text-[#6D28D9] dark:text-[#C4B5FD] font-extrabold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#132A45]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors stroke-[2.2] ${isActive ? 'text-[#8B5CF6] dark:text-[#B7F229]' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'}`} />
                      <span className="text-xs font-bold tracking-tight truncate">{tab.label}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {tab.badge && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md font-mono font-bold bg-slate-200/80 dark:bg-slate-800 text-[#8B5CF6] dark:text-[#B7F229]">
                          {tab.badge}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ajustes Rápidos: Idioma Compacto + Tema Claro/Oscuro */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              {/* Idioma Compacto Dropdown */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Idioma</span>
                </div>
                <select
                  value={language}
                  aria-label="Seleccionar idioma de la plataforma"
                  onChange={(e) => {
                    i18n.changeLanguage(e.target.value);
                    setLanguage(e.target.value as SupportedLanguage);
                  }}
                  className="bg-transparent text-[11px] font-mono font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer pr-1"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="dark:bg-[#0B1A2D] text-slate-900 dark:text-white">
                      {l.code.toUpperCase()} · {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conmutador Modo Claro / Oscuro con pastilla minimalista */}
              <button
                type="button"
                onClick={() => {
                  const newTheme = (adminTheme === 'dark' || theme === 'dark') ? 'light' : 'dark';
                  if (setTheme) setTheme(newTheme);
                  if (setAdminTheme) setAdminTheme(newTheme);
                  if (typeof document !== 'undefined') {
                    if (newTheme === 'dark') {
                      document.documentElement.classList.add('dark');
                      document.documentElement.classList.remove('light');
                    } else {
                      document.documentElement.classList.remove('dark');
                      document.documentElement.classList.add('light');
                    }
                  }
                }}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 cursor-pointer active:scale-98 transition"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {(adminTheme === 'dark' || theme === 'dark') ? (
                    <Moon className="w-3.5 h-3.5 text-[#B7F229] shrink-0" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Tema</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-2xs">
                  {(adminTheme === 'dark' || theme === 'dark') ? 'Oscuro' : 'Claro'}
                </span>
              </button>
            </div>

            {/* Acciones Rápidas Inferiores Agrupadas */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {!isReception && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMoreOpen(false);
                    enterWhiteLabelPlayerPreview();
                  }}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#0B1A2D] dark:bg-white text-white dark:text-[#0B1A2D] font-extrabold text-xs shadow-xs transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#B7F229] dark:text-[#8B5CF6]" />
                  <span>{t('white_label.player_view', 'Vista Jugador')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={logoutOrExitDemo}
                className="w-full py-2.5 px-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-bold text-xs border border-rose-200/60 dark:border-rose-900/40 transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer hover:bg-rose-100"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>{t('club.nav.logout', 'Cerrar Sesión / Salir')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Perfil de Usuario */}
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
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isReception ? 'Personal de Recepción del Club' : 'Gestor Oficial en Setmio'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ficha del Usuario */}
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
                  {isReception ? 'Recepción · Mostrador' : roleSubtitle}
                </div>
              </div>
            </div>

            {/* Contexto del Club / Entidad */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Entidad Vinculada:</span>
                <span className="font-bold">{currentTenant.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Ubicación:</span>
                <span className="font-bold">{currentTenant.city}, {currentTenant.region}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Infraestructura Física:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {hasPhysicalInfrastructure ? 'Pistas & Domótica Activas' : 'Sin instalaciones fijas'}
                </span>
              </div>
            </div>

            {/* Botones de Cierre */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
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

export default AdminLayout;
