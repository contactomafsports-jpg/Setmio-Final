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
  Check,
} from 'lucide-react';
import { OfficialFlag } from './OfficialFlag';
import { i18n } from '../../i18n';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../lib/i18n';

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
}) => {
  const {
    currentUser,
    logoutOrExitDemo,
    theme,
    setTheme,
    adminTheme,
    setAdminTheme,
    setClubTheme,
    language,
    setLanguage,
    setAdminTab,
    setCurrentView,
    t,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);
  const [avatarImgError, setAvatarImgError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const isDark = variant === 'admin' ? adminTheme === 'dark' : theme === 'dark';

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

  const userInitials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón Disparador (Avatar del Usuario) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-1 rounded-full border border-transparent hover:border-slate-200 dark:hover:border-[#1A314D] hover:bg-slate-100/70 dark:hover:bg-[#0E2239] transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7F229] cursor-pointer"
        aria-label="Menú de usuario"
        aria-expanded={isOpen}
      >
        <div
          className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-[#1A314D] bg-[#0B1A2D] flex items-center justify-center shadow-2xs aspect-square"
          style={{ borderRadius: '9999px', overflow: 'hidden' }}
        >
          {currentUser.avatarUrl && !avatarImgError ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-full h-full object-cover rounded-full block aspect-square"
              style={{ borderRadius: '9999px', objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
              loading="eager"
              referrerPolicy="no-referrer"
              onError={() => setAvatarImgError(true)}
            />
          ) : (
            <span className="text-[#B7F229] font-bold text-xs bg-[#0B1A2D] w-full h-full flex items-center justify-center select-none">
              {userInitials}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B1A2D] dark:group-hover:text-white transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* MENÚ DESPLEGABLE DE PERFIL MINIMALISTA (ESTILO LINEAR / STRIPE) */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[310px] sm:w-[340px] rounded-2xl bg-white dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] shadow-2xl p-4 sm:p-5 z-50 animate-in fade-in-50 zoom-in-95 duration-150 text-[#0B1A2D] dark:text-slate-100">
          {/* 1. CABECERA SIMPLIFICADA: Solo Avatar + Nombre Completo + Correo */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-[#1A314D]">
            <div
              className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-[#1A314D] bg-[#0B1A2D] dark:bg-[#132A45] flex items-center justify-center aspect-square"
              style={{ borderRadius: '9999px', overflow: 'hidden' }}
            >
              {currentUser.avatarUrl && !avatarImgError ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover rounded-full block aspect-square"
                  style={{ borderRadius: '9999px', objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarImgError(true)}
                />
              ) : (
                <span className="text-[#B7F229] font-bold text-sm bg-[#0B1A2D] dark:bg-[#132A45] w-full h-full flex items-center justify-center select-none">
                  {userInitials}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-[15px] text-[#0B1A2D] dark:text-white truncate leading-snug">
                {currentUser.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {currentUser.email || 'usuario@setmio.com'}
              </div>
            </div>
          </div>

          {/* 2. PREFERENCIAS PERSONALES: Modo Claro/Oscuro e Idioma */}
          <div className="py-4 border-b border-slate-100 dark:border-[#1A314D] space-y-3.5">
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 tracking-wide">
              Preferencias personales
            </div>

            {/* Selector Modo Claro / Oscuro */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {isDark ? (
                  <Moon className="w-4 h-4 text-[#B7F229] shrink-0" />
                ) : (
                  <Sun className="w-4 h-4 text-[#0B1A2D] shrink-0" />
                )}
                <span className="text-[13px] font-semibold text-[#0B1A2D] dark:text-slate-100 whitespace-nowrap">
                  Apariencia
                </span>
              </div>

              <div className="relative flex items-center bg-slate-100 dark:bg-[#071220] p-1 rounded-xl text-xs font-semibold border border-slate-200/70 dark:border-[#1A314D] w-36 shrink-0">
                <span
                  aria-hidden="true"
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-transform duration-200 ease-out pointer-events-none ${
                    isDark
                      ? 'left-1 translate-x-full bg-[#132A45] border border-[#1E3B5C] shadow-xs'
                      : 'left-1 translate-x-0 bg-white border border-slate-200/80 shadow-xs'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => applyThemeMode('light')}
                  className={`relative z-10 flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer select-none whitespace-nowrap ${
                    !isDark
                      ? 'text-[#0B1A2D] font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Cambiar a Modo Claro"
                >
                  <Sun className={`w-3.5 h-3.5 shrink-0 ${!isDark ? 'text-amber-500' : 'text-slate-400'}`} />
                  <span>Claro</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyThemeMode('dark')}
                  className={`relative z-10 flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer select-none whitespace-nowrap ${
                    isDark
                      ? 'text-[#B7F229] font-bold'
                      : 'text-slate-500 hover:text-[#0B1A2D]'
                  }`}
                  title="Cambiar a Modo Oscuro"
                >
                  <Moon className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#B7F229]' : 'text-slate-400'}`} />
                  <span>Oscuro</span>
                </button>
              </div>
            </div>

            {/* Selector de Idioma */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Globe className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span className="text-[13px] font-semibold text-[#0B1A2D] dark:text-slate-100 whitespace-nowrap">
                    Idioma
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLanguageExpanded((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs font-semibold text-[#0B1A2D] dark:text-slate-100 hover:border-[#0B1A2D]/30 dark:hover:border-[#B7F229]/40 cursor-pointer transition whitespace-nowrap"
                  title="Cambiar idioma de la plataforma"
                >
                  <OfficialFlag code={language} />
                  <span>{SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name || 'Español'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isLanguageExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {isLanguageExpanded && (
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pt-2 border-t border-slate-100 dark:border-[#1A314D]">
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
                        className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-left transition cursor-pointer border ${
                          isSelected
                            ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229]/15 dark:border-[#B7F229]/50 dark:text-[#B7F229] font-bold'
                            : 'bg-slate-50/70 dark:bg-[#0E2239]/60 border-slate-200/70 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#132A45]'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <OfficialFlag code={l.code} />
                          <span className="truncate">{l.name}</span>
                        </span>
                        {isSelected && (
                          <Check
                            className={`w-3.5 h-3.5 shrink-0 ml-1 ${
                              isSelected ? 'text-[#B7F229]' : ''
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 3. ACCESOS DE CUENTA */}
          <div className="pt-4 space-y-1">
            <div className="pb-1 text-[11px] font-semibold text-slate-400 dark:text-slate-400 tracking-wide">
              Cuenta
            </div>

            <button
              type="button"
              onClick={handleOpenProfile}
              className="w-full min-h-[42px] flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-[#0E2239] text-[#0B1A2D] dark:text-slate-100 text-[13px] font-semibold transition text-left cursor-pointer"
            >
              <User className="w-4 h-4 text-[#8B5CF6] shrink-0" />
              <span>{t('club.menu.myProfile', 'Mi Perfil')}</span>
            </button>

            <button
              type="button"
              onClick={handleGoToSettings}
              className="w-full min-h-[42px] flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-[#0E2239] text-[#0B1A2D] dark:text-slate-100 text-[13px] font-semibold transition text-left cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
              <span>{t('club.menu.clubSettings', 'Ajustes del Club')}</span>
            </button>

            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-[#1A314D]">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full min-h-[42px] flex items-center gap-3 px-2.5 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[13px] font-semibold transition text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{t('club.nav.logout', 'Cerrar Sesión')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
