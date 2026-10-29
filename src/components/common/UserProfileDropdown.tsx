import React, { useState, useRef, useEffect } from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Globe,
  Building2,
  Check,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';
import { OfficialFlag } from './OfficialFlag';
import { i18n } from '../../i18n';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../lib/i18n';
import { getAdminNavConfig } from '../../lib/adminNavigation';

interface UserProfileDropdownProps {
  variant?: 'admin' | 'player' | 'coach';
  onOpenProfileModal?: () => void;
  onSelectTab?: (tab: AdminTab) => void;
  onOpenLegalModal?: () => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  variant = 'admin',
  onOpenProfileModal,
  onSelectTab,
  onOpenLegalModal,
}) => {
  const {
    currentUser,
    currentTenant,
    logoutOrExitDemo,
    theme,
    setTheme,
    toggleTheme,
    adminTheme,
    setAdminTheme,
    setClubTheme,
    language,
    setLanguage,
    setAdminTab,
    venues,
    selectedVenueId,
    setSelectedVenueId,
    viewEntityWeb,
    isConsolidatedView,
    isMultiVenue,
    setCurrentView,
    t,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);
  const [avatarImgError, setAvatarImgError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navConfig = getAdminNavConfig(currentTenant, currentUser, isMultiVenue, venues);
  const { hasMultipleVenues } = navConfig;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Determine dark mode state reactively based on current active theme
  const isDark = (variant === 'admin' ? adminTheme === 'dark' : theme === 'dark');

  const applyThemeMode = (mode: 'light' | 'dark') => {
    if (setTheme) {
      setTheme(mode);
    }
    if (variant === 'admin' && setAdminTheme) {
      setAdminTheme(mode);
    } else if (setClubTheme) {
      setClubTheme(mode);
    }
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (mode === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    }
  };

  const handleLanguageChange = (langCode: SupportedLanguage | string) => {
    i18n.changeLanguage(langCode);
    setLanguage(langCode as SupportedLanguage);
  };

  const handleGoToSettings = () => {
    setIsOpen(false);
    if (variant === 'admin') {
      if (onSelectTab) {
        onSelectTab('settings');
      } else {
        setAdminTab('settings');
      }
    } else {
      // In player mode, go to club settings or notifications preferences
      setCurrentView('admin');
      setAdminTab('settings');
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/admin/ajustes');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  const handleOpenProfile = () => {
    setIsOpen(false);
    if (onOpenProfileModal) {
      onOpenProfileModal();
    } else if (variant === 'player') {
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/jugador/perfil');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  const handleLogout = () => {
    setIsOpen(false);
    logoutOrExitDemo();
  };

  const handleViewClubWeb = () => {
    setIsOpen(false);
    viewEntityWeb(currentTenant.slug);
  };

  // Determine user role badge text
  const getRoleBadge = () => {
    if (variant === 'player') {
      return `Socio Activo · Nivel ${currentUser.playLevel.toFixed(2)}`;
    }
    if (variant === 'coach') {
      return 'Profesor / Entrenador';
    }
    return `Club Admin · ${currentTenant.name}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón Disparador (Avatar del Usuario) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition group focus:outline-none cursor-pointer"
        aria-label="Menú de usuario"
        aria-expanded={isOpen}
      >
        <div className="relative shrink-0">
          <div
            className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-[#0B1A2D] flex items-center justify-center shadow-xs aspect-square"
            style={{ borderRadius: '9999px', overflow: 'hidden' }}
          >
            {currentUser.avatarUrl && !avatarImgError ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-full h-full object-cover rounded-full block aspect-square"
                style={{ borderRadius: '9999px', objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                loading="eager"
                onError={() => setAvatarImgError(true)}
              />
            ) : (
              <span className="text-white font-black text-xs bg-[#0B1A2D] w-full h-full flex items-center justify-center select-none">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </span>
            )}
          </div>
          {/* Pequeño indicador circular elegante en Verde Lima (#B7F229) */}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#B7F229] ring-2 ring-white dark:ring-slate-900 pointer-events-none" />
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* MENÚ DESPLEGABLE DE PERFIL ESTRUCTURADO */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100 text-xs text-slate-800 dark:text-slate-200 divide-y divide-slate-100 dark:divide-slate-800/80">
          {/* 1. ENCABEZADO: FICHA DEL USUARIO */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 mb-2 flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-emerald-500/40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-xs aspect-square"
              style={{ borderRadius: '9999px', overflow: 'hidden' }}
            >
              {currentUser.avatarUrl && !avatarImgError ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover rounded-full block aspect-square"
                  style={{ borderRadius: '9999px', objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                  onError={() => setAvatarImgError(true)}
                />
              ) : (
                <span className="text-white font-black text-sm bg-emerald-600 w-full h-full flex items-center justify-center select-none">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {currentUser.email || 'usuario@setmio.com'}
              </div>
              <div className="mt-1 flex items-center gap-1 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {getRoleBadge()}
                </span>
              </div>
            </div>
          </div>

          {/* 2. OPCIONES DE CONFIGURACIÓN PERSONAL (TEMA & IDIOMA) */}
          <div className="py-2.5 space-y-2">
            <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Preferencias Personales
            </div>

            {/* Toggle Modo Claro / Modo Oscuro */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                {isDark ? (
                  <Moon className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    Modo {isDark ? 'Oscuro' : 'Claro'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Aspecto visual de la app
                  </div>
                </div>
              </div>

              {/* Selector interactivo con pastilla deslizante Claro / Oscuro */}
              <div className="relative flex items-center bg-slate-200/80 dark:bg-slate-950 p-1 rounded-xl text-[11px] font-bold border border-slate-300/60 dark:border-slate-800 w-36">
                {/* Pastilla deslizante animada */}
                <span
                  aria-hidden="true"
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-transform duration-200 ease-out shadow-xs pointer-events-none ${
                    isDark
                      ? 'left-1 translate-x-[calc(100%+0px)] bg-[#0B1A2D] border border-slate-700/80 shadow-xs'
                      : 'left-1 translate-x-0 bg-white border border-slate-200/80 shadow-xs'
                  }`}
                />

                <button
                  type="button"
                  onClick={() => applyThemeMode('light')}
                  className={`relative z-10 flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer select-none text-center ${
                    !isDark
                      ? 'text-slate-900 font-extrabold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Cambiar a Modo Claro"
                >
                  <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500' : 'text-slate-400'}`} />
                  <span>Claro</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyThemeMode('dark')}
                  className={`relative z-10 flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer select-none text-center ${
                    isDark
                      ? 'text-[#B7F229] font-extrabold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Cambiar a Modo Oscuro"
                >
                  <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-[#B7F229]' : 'text-slate-400'}`} />
                  <span>Oscuro</span>
                </button>
              </div>
            </div>

            {/* Selector Completo e Interactivo de Idiomas */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 p-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Idioma
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLanguageExpanded((prev) => !prev)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-500 cursor-pointer transition shadow-2xs"
                  title="Cambiar idioma de la plataforma"
                >
                  <OfficialFlag code={language} />
                  <span>{SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name || 'Español'}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isLanguageExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Lista completa de todos los idiomas con banderas oficiales */}
              {isLanguageExpanded && (
                <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto pr-0.5 pt-1.5 border-t border-slate-200/70 dark:border-slate-800/80">
                  {SUPPORTED_LANGUAGES.map((l) => {
                    const isSelected = language === l.code;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          handleLanguageChange(l.code);
                          setIsLanguageExpanded(false);
                        }}
                        className={`flex items-center justify-between p-1.5 rounded-lg text-xs text-left transition cursor-pointer border ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-2xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <OfficialFlag code={l.code} />
                          <span className="truncate text-[11px]">{l.name}</span>
                        </span>
                        {isSelected && <Check className="w-3 h-3 text-emerald-600 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 3. ENLACES OPERATIVOS */}
          <div className="py-2 space-y-0.5">
            <div className="px-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Acciones & Navegación
            </div>

            {/* Ver Web del Club */}
            <button
              type="button"
              onClick={handleViewClubWeb}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {currentTenant.type === 'ACADEMY'
                    ? 'Ver Web de la Academia'
                    : currentTenant.type === 'COACH'
                    ? 'Ver Web del Entrenador'
                    : currentTenant.type === 'PRO_PLAYER'
                    ? 'Ver Portfolio Pro'
                    : t('club.menu.viewWeb', 'Ver Web del Club')}
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Mi Perfil */}
            <button
              type="button"
              onClick={handleOpenProfile}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition text-left cursor-pointer"
            >
              <User className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span>{t('club.menu.myProfile', 'Mi Perfil')}</span>
            </button>

            {/* Ajustes del Club */}
            <button
              type="button"
              onClick={handleGoToSettings}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition text-left cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>{t('club.menu.clubSettings', 'Ajustes del Club')}</span>
            </button>
          </div>

          {/* 4. SELECTOR DE SEDE ACTIVA (SOLO si el Club gestiona múltiples localizaciones físicas) */}
          {hasMultipleVenues && (
            <div className="py-2">
              <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Sede Activa</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[9px] bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                  {isConsolidatedView ? 'Consolidado' : 'Sede Única'}
                </span>
              </div>
              <div className="space-y-0.5 max-h-36 overflow-y-auto">
                {venues.map((venue) => {
                  const isSelected = selectedVenueId === venue.id;
                  return (
                    <button
                      key={venue.id}
                      type="button"
                      onClick={() => {
                        setSelectedVenueId(venue.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{venue.name || venue.shortName}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. CIERRE DE SESIÓN */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-bold transition text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>{t('club.nav.logout', 'Cerrar Sesión / Salir Demo')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
