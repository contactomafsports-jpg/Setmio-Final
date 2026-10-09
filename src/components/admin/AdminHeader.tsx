import React, { useState, useRef, useEffect } from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Bot,
  Sparkles,
  X,
  Send,
  Minimize2,
  Globe,
  Building2,
  Check,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../lib/i18n';
import { i18n } from '../../i18n';
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
    adminTheme,
    setAdminTheme,
    language,
    setLanguage,
    setAdminTab,
    currentTenant,
    navigateToClub,
    aiMessages,
    sendAIMessage,
    isAiThinking,
    venues,
    selectedVenueId,
    selectedVenue,
    setSelectedVenueId,
    isConsolidatedView,
    t,
  } = useApp();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [venueDropdownOpen, setVenueDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [avatarImgError, setAvatarImgError] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const venueRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (venueRef.current && !venueRef.current.contains(e.target as Node)) {
        setVenueDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (aiDrawerOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, aiDrawerOpen]);

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

  const isDark =
    theme === 'dark' ||
    adminTheme === 'dark' ||
    (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  const handleToggleTheme = () => {
    const nextMode = isDark ? 'light' : 'dark';
    const root = document.documentElement;
    if (nextMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    if (setAdminTheme) {
      setAdminTheme(nextMode);
    }
    toggleTheme();
  };

  const handleSendAi = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiInputText.trim()) return;
    sendAIMessage(aiInputText);
    setAiInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendAIMessage(prompt);
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between gap-2 shadow-xs transition-colors">
        {/* Left: IDENTIDAD DE MARCA OFICIAL SETMIO (Isotipo + Texto oficial) + Selector Multi-Sede */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2.5">
            {/* Isotipo Oficial Setmio */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0 select-none">
              S
            </div>
            {/* Texto Oficial Setmio */}
            <div className="flex items-center">
              <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-none">
                Setmio Pro
              </span>
            </div>
          </div>

          {/* Selector Multi-Sede / Multi-Club Accesible */}
          <div className="relative" ref={venueRef}>
            <button
              type="button"
              onClick={() => setVenueDropdownOpen(!venueDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-xs font-bold text-slate-800 dark:text-slate-200 transition border border-slate-200/80 dark:border-slate-700 cursor-pointer shadow-xs active:scale-95"
              title="Cambiar sede o ver modo consolidado"
              aria-label="Selector de sede o club"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate max-w-[110px] sm:max-w-[170px] text-[11px] sm:text-xs">
                {selectedVenue.shortName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {venueDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in-50 duration-100 text-xs">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{t('dashboard.venueSelector', 'Sede / Club')}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">Multi-Sede</span>
                </div>
                <div className="space-y-0.5 mt-1">
                  {venues.map((venue) => {
                    const isSelected = selectedVenueId === venue.id;
                    return (
                      <button
                        key={venue.id}
                        type="button"
                        onClick={() => {
                          setSelectedVenueId(venue.id);
                          setVenueDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition text-left cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white font-bold shadow-xs'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs truncate font-bold">{venue.shortName}</div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {venue.city}
                          </div>
                        </div>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1.5" />
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1.5">
                            {venue.courtsCount}p
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Acciones (Idioma, Tema, Asistente IA, Avatar con Dropdown) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Selector de Idioma */}
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
                      i18n.changeLanguage(langOpt.code);
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

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={handleToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label="Alternar tema"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            )}
          </button>

          {/* Asistente IA Elegante (Sparkles / Bot) -> Abre Bottom Sheet Drawer */}
          <button
            type="button"
            onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              aiDrawerOpen
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm shadow-emerald-500/30'
                : 'bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-800/80 shadow-xs'
            }`}
            title="Copiloto y Asistente IA Setmio"
            aria-label="Abrir Asistente IA"
          >
            <div className="relative">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="font-extrabold text-[11px] hidden sm:inline">IA</span>
          </button>

          {/* AVATAR DE USUARIO con MENÚ DESPLEGABLE (Mi Perfil, Ajustes del Club, Cerrar Sesión) */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1.5 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition group focus:outline-none"
              aria-label="Menú de usuario"
              aria-expanded={userMenuOpen}
            >
              <div className="relative shrink-0">
                <div
                  className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-xs aspect-square"
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
                    <span className="text-white font-black text-xs bg-gradient-to-br from-emerald-500 to-teal-700 w-full h-full flex items-center justify-center select-none">
                      {currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 pointer-events-none" />
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menú Desplegable Limpio */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100 text-xs text-slate-800 dark:text-slate-200">
                {/* Tarjeta de Identificación */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 mb-1 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-xs aspect-square"
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
                  <div className="min-w-0">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.email || 'admin@setmio.com'}
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Club Admin · {currentTenant.name}
                    </div>
                  </div>
                </div>

                {/* Opciones del Dropdown */}
                <div className="space-y-0.5 py-1">
                  {/* Ver Web del Club */}
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigateToClub(currentTenant.slug);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition text-left cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('club.menu.viewWeb', 'Ver Web del Club')}</span>
                  </button>

                  {/* 1. Mi Perfil */}
                  <button
                    type="button"
                    onClick={handleOpenProfile}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition text-left cursor-pointer"
                  >
                    <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('club.menu.myProfile', 'Mi Perfil')}</span>
                  </button>

                  {/* 2. Ajustes del Club */}
                  <button
                    type="button"
                    onClick={handleGoToSettings}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition text-left cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    <span>{t('club.menu.clubSettings', 'Ajustes del Club')}</span>
                  </button>
                </div>

                {/* Sección de Selección Rápida de Sede en Menú de Usuario */}
                <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Sede Activa</span>
                    <span className="text-emerald-500 font-bold text-[9px]">{isConsolidatedView ? 'Consolidado' : 'Sede Única'}</span>
                  </div>
                  <div className="space-y-0.5 px-1 max-h-36 overflow-y-auto">
                    {venues.map((venue) => {
                      const isSelected = selectedVenueId === venue.id;
                      return (
                        <button
                          key={venue.id}
                          type="button"
                          onClick={() => {
                            setSelectedVenueId(venue.id);
                            setUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate">{venue.shortName}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                {/* 3. Cerrar Sesión con icono LogOut hacia / */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-bold transition text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>{t('club.nav.logout', 'Cerrar Sesión')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* DRAWER TÁCTIL INFERIOR (BOTTOM SHEET) CON CHAT DE LA IA */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          {/* Backdrop Click Handler */}
          <div
            className="flex-1 w-full"
            onClick={() => setAiDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Bottom Sheet Modal Container */}
          <div className="w-full max-w-2xl mx-auto bg-slate-900 border-t sm:border-x sm:rounded-t-3xl border-slate-800 shadow-2xl flex flex-col max-h-[82vh] sm:max-h-[640px] text-slate-100 animate-in slide-in-from-bottom duration-300">
            {/* Grab handle táctil para móvil */}
            <div className="pt-2.5 pb-1 flex justify-center cursor-pointer" onClick={() => setAiDrawerOpen(false)}>
              <div className="w-12 h-1.5 rounded-full bg-slate-700 hover:bg-slate-600 transition" />
            </div>

            {/* Header del Drawer */}
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white">
                      Copiloto IA · {currentTenant.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                      Club Admin
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Consultas operativas, métricas de pistas y redacción automática
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setAiDrawerOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Cerrar panel de IA"
                >
                  <Minimize2 className="w-4 h-4 hidden sm:block" />
                  <X className="w-4 h-4 sm:hidden" />
                </button>
              </div>
            </div>

            {/* Mensajes del Asistente */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-900/95 min-h-[220px]">
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Consultando base de datos de {currentTenant.shortName}...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chips con prompts rápidos */}
            <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => handleQuickPrompt('¿Cuál es el estado de ocupación y pistas libres hoy?')}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-medium transition active:scale-95"
              >
                🎾 Pistas libres hoy
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Resume los ingresos totales de hoy entre online y cafetería.')}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-medium transition active:scale-95"
              >
                💶 Resumen de ingresos
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('¿Cuántas clases de escuela tenemos programadas esta tarde?')}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-medium transition active:scale-95"
              >
                🎓 Clases de escuela
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendAi} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                placeholder={`Pregunta a la IA sobre pistas, agenda o socios de ${currentTenant.shortName}...`}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
              <button
                type="submit"
                disabled={!aiInputText.trim() || isAiThinking}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-black transition active:scale-95"
                title="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
