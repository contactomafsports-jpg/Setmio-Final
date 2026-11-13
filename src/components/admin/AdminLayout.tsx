import React, { useEffect, useState } from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import {
  LogOut,
  ChevronRight,
  X,
  User,
} from 'lucide-react';
import { AdminHeader } from './AdminHeader';
import { PrivateMobileNav } from '../common/PrivateMobileNav';
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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMoreOpen(false);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
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
    <div data-admin-shell className="min-h-screen bg-slate-50 dark:bg-[#0B1A2D] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row pb-28 md:pb-0 transition-colors duration-200 w-full max-w-full overflow-x-hidden font-sans">
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
        {/* Header Superior Nativo Modular (Oculto en páginas secundarias de Nivel 2 como 'all_bookings', 'new_match' y 'new_booking') */}
        {adminTab !== 'all_bookings' && adminTab !== 'new_match' && adminTab !== 'new_booking' && (
          <AdminHeader
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onSelectTab={handleSelectTab}
          />
        )}

        {/* Contenido Dinámico de la Pestaña Activa con márgenes generosos */}
        <main className={`flex-1 px-4 py-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto ${(adminTab === 'all_bookings' || adminTab === 'new_match' || adminTab === 'new_booking') ? 'pt-5 sm:pt-7' : ''}`}>
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
          VISTA A PANTALLA COMPLETA "PANEL DE CONTROL" (+)
          ====================================================================== */}
      {mobileMoreOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Panel de Control"
          className="fixed inset-0 z-50 flex flex-col min-h-dvh h-dvh w-screen bg-slate-50 dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {/* Cabecera Minimalista: Solo Título y Botón de Cierre */}
          <header className="px-5 sm:px-8 pt-[max(1.75rem,env(safe-area-inset-top))] pb-4 shrink-0">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1A2D] dark:text-white leading-tight truncate">
                Panel de Control
              </h2>
              <button
                type="button"
                onClick={() => setMobileMoreOpen(false)}
                className="min-h-[44px] min-w-[44px] w-11 h-11 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] flex items-center justify-center text-[#0B1A2D] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer active:scale-95 shrink-0"
                aria-label="Cerrar panel de control"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Contenedor Único Maestro con Lista Continua */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8 pt-2 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <div className="max-w-2xl mx-auto bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs overflow-hidden divide-y divide-slate-100 dark:divide-white/5">
              {secondaryItems.map((tab) => {
                const Icon = tab.icon;
                const isActive = adminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setMobileMoreOpen(false);
                      handleSelectTab(tab.id);
                    }}
                    className={`w-full h-14 px-4 sm:px-5 flex items-center justify-between gap-3 text-left transition-colors duration-150 cursor-pointer group active:bg-slate-100/80 dark:active:bg-white/10 min-w-0 ${
                      isActive
                        ? 'bg-slate-50 dark:bg-white/[0.06]'
                        : 'hover:bg-slate-50/80 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                            : 'bg-slate-100/90 dark:bg-[#071220] text-[#0B1A2D] dark:text-[#B7F229] group-hover:bg-[#F0FCCF] dark:group-hover:bg-[#132A45]'
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                      </div>
                      <span
                        className={`text-[15px] tracking-tight truncate ${
                          isActive
                            ? 'font-bold text-[#0B1A2D] dark:text-[#B7F229]'
                            : 'font-semibold text-[#0B1A2D] dark:text-slate-100'
                        }`}
                      >
                        {tab.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {tab.badge && (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-md font-semibold tracking-tight whitespace-nowrap ${
                            isActive
                              ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                              : 'bg-[#F0FCCF] dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] border border-[#B7F229]/40'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                          isActive
                            ? 'text-[#0B1A2D] dark:text-[#B7F229]'
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-[#0B1A2D] dark:group-hover:text-white'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
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
