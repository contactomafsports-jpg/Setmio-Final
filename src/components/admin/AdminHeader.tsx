import React, { useState, useRef, useEffect } from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Eye,
  Sun,
  Moon,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../lib/i18n';
import { OfficialFlag } from '../common/OfficialFlag';

interface AdminHeaderProps {
  onOpenProfileModal?: () => void;
  onSelectTab?: (tab: AdminTab) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenProfileModal,
  onSelectTab,
}) => {
  const {
    currentUser,
    logoutOrExitDemo,
    theme,
    toggleTheme,
    language,
    setLanguage,
    isClubOpen,
    toggleClubOpenState,
    enterWhiteLabelPlayerPreview,
    setAdminTab,
    t,
  } = useApp();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

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

  const handleGoToSettings = () => {
    setUserMenuOpen(false);
    if (onSelectTab) {
      onSelectTab('settings');
    } else {
      setAdminTab('settings');
    }
  };

  const handleOpenProfile = () => {
    setUserMenuOpen(false);
    onOpenProfileModal?.();
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logoutOrExitDemo();
  };

  return (
    <header className="sticky top-0 z-40 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between gap-2 shadow-xs transition-colors">
      {/* Left: Logo Setmio en versión compacta ("SM") + Badge de estado "Abierto/Cerrado" */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Setmio Compact Logo Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-slate-950 border border-emerald-500/50 text-emerald-400 font-black flex items-center justify-center text-xs shadow-xs">
            SM
          </div>
          <span className="font-black text-xs text-slate-900 dark:text-white tracking-wider hidden sm:inline">
            SETMIO
          </span>
        </div>

        <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>

        {/* Badge de estado "Abierto/Cerrado" */}
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
          <span className="text-[11px] font-extrabold">
            {isClubOpen ? t('club.status.open', 'Abierto') : t('club.status.closed', 'Cerrado')}
          </span>
        </button>
      </div>

      {/* Right: Actions (Idioma, Vista Jugador, Theme, Avatar con Dropdown) - SIN BOTÓN EXPLÍCITO DE LOGOUT */}
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

        {/* AVATAR DE USUARIO con MENÚ DESPLEGABLE (👤 Mi Perfil, ⚙️ Ajustes del Club, 🚪 Cerrar Sesión) */}
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

          {/* Menú Desplegable (Dropdown) Limpio y Moderno */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100 text-xs text-slate-800 dark:text-slate-200">
              {/* Tarjeta de Identificación */}
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

              {/* Opciones del Dropdown */}
              <div className="space-y-0.5 py-1">
                {/* 👤 Mi Perfil */}
                <button
                  type="button"
                  onClick={handleOpenProfile}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition text-left"
                >
                  <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('club.menu.myProfile', '👤 Mi Perfil')}</span>
                </button>

                {/* ⚙️ Ajustes del Club */}
                <button
                  type="button"
                  onClick={handleGoToSettings}
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
                onClick={handleLogout}
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
  );
};

export default AdminHeader;
