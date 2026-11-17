import React, { useState, useRef, useEffect } from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import {
  Sparkles,
  ExternalLink,
  Sun,
  Moon,
  ChevronDown,
  Check,
  Globe,
  X,
  Send,
  Building2,
  CalendarCheck,
  TrendingUp,
  GraduationCap,
} from 'lucide-react';
import { NotificationsPopover } from '../common/NotificationsPopover';
import { UserProfileDropdown } from '../common/UserProfileDropdown';
import { OfficialFlag } from '../common/OfficialFlag';
import { SUPPORTED_LANGUAGES } from '../../lib/i18n';
import { i18n } from '../../i18n';
import { getAdminNavConfig } from '../../lib/adminNavigation';
import { SetmioLogo } from '../common/SetmioLogo';

interface AdminHeaderProps {
  onOpenProfileModal?: () => void;
  onSelectTab?: (tab: AdminTab) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenProfileModal,
  onSelectTab,
}) => {
  const {
    currentTenant,
    currentUser,
    viewEntityWeb,
    theme,
    toggleTheme,
    language,
    setLanguage,
    aiMessages,
    sendAIMessage,
    isAiThinking,
    isMultiVenue,
    venues,
    selectedVenueId,
    selectedVenue,
    setSelectedVenueId,
    isConsolidatedView,
    t,
    switchDemoAccount,
    activeDemoAccount,
  } = useApp();

  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [venueDropdownOpen, setVenueDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const venueRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const isProAthleteAdmin =
    currentTenant.type === 'PRO_PLAYER' || currentUser.role === 'PROFESSIONAL_PLAYER';
  const isReception = currentUser.role === 'RECEPTION';

  const navConfig = getAdminNavConfig(currentTenant, currentUser, isMultiVenue, venues);
  const { hasMultipleVenues } = navConfig;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (venueRef.current && !venueRef.current.contains(e.target as Node)) {
        setVenueDropdownOpen(false);
      }
    };
    if (langDropdownOpen || venueDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langDropdownOpen, venueDropdownOpen]);

  useEffect(() => {
    if (aiDrawerOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, aiDrawerOpen]);

  const handleSendAi = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiInputText.trim()) return;
    sendAIMessage(aiInputText);
    setAiInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendAIMessage(prompt);
  };

  const currentLangOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-2 bg-slate-50/80 dark:bg-[#0B1A2D]/80 backdrop-blur-md transition-colors">
        {/* Left: BRANDING CONDICIONAL (Recepción = Marca Blanca Club / Admin = Oficial Setmio Pro) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {isReception ? (
            /* Vista Recepción: Marca Blanca propia del Club de ejemplo */
            <div className="flex items-center gap-2.5 shrink-0">
              <div
                className="w-8 h-8 rounded-xl text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0 select-none"
                style={{ backgroundColor: currentTenant.branding?.primaryColor || '#10b981' }}
              >
                {currentTenant.shortName.slice(0, 3).toUpperCase()}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-none">
                  {currentTenant.name}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-900 px-2 py-0.5 rounded-md">
                  Recepción · Marca Blanca Club
                </span>
              </div>
            </div>
          ) : (
            /* Admin de club / escuela / profesor / atleta: wordmark oficial adaptable al tema */
            <div className="flex min-w-0 items-center gap-2.5">
              <button
                type="button"
                onClick={() => onSelectTab?.('dashboard')}
                className="inline-flex min-w-0 max-w-[148px] items-center rounded-md p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B7F229] sm:max-w-[190px]"
                title="Ir al inicio de Setmio"
                aria-label="Ir al inicio de Setmio"
              >
                <SetmioLogo variant="horizontal" size="md" className="max-w-full" />
              </button>
              <div className="flex items-center gap-2">
                {isProAthleteAdmin ? (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold text-red-400 bg-red-950/70 border border-red-800 px-2 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Atleta Pro · {currentTenant.shortName}
                  </span>
                ) : currentTenant.type === 'ACADEMY' ? (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold text-[#c4b5fd] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-2 py-0.5 rounded-md">
                    Admin Escuela · {currentTenant.shortName}
                  </span>
                ) : currentTenant.type === 'COACH' ? (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold text-sky-400 bg-sky-950/70 border border-sky-800 px-2 py-0.5 rounded-md">
                    Admin Profesor · {currentTenant.shortName}
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold text-[#c4b5fd] bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 px-2 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#87F229] animate-pulse" />
                    SaaS Pro · {currentTenant.shortName}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Selector Rápido de Roles Anidados (Demo Club) */}
          {activeDemoAccount === 'club' && (
            <div className="hidden xl:flex items-center ml-2 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => switchDemoAccount('club', 'admin')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  currentUser.role === 'TENANT_OWNER'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Admin Club
              </button>
              <button
                type="button"
                onClick={() => switchDemoAccount('club', 'player')}
                className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                Jugador Club [MB]
              </button>
              <button
                type="button"
                onClick={() => switchDemoAccount('club', 'coach')}
                className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                Profesor [MB]
              </button>
              <button
                type="button"
                onClick={() => switchDemoAccount('club', 'reception')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  isReception
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Recepción [MB]
              </button>
            </div>
          )}

          {/* Selector Global de Sede Activa (SOLO si el Club gestiona múltiples localizaciones físicas) */}
          {hasMultipleVenues && (
            <div className="hidden lg:flex items-center ml-1 sm:ml-2">
              <div className="relative" ref={venueRef}>
                <button
                  type="button"
                  onClick={() => setVenueDropdownOpen(!venueDropdownOpen)}
                  className="px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/50 hover:bg-emerald-100/70 text-emerald-800 dark:text-emerald-300 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  title="Cambiar sede asignada"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate max-w-[170px]">
                    {selectedVenue?.shortName || selectedVenue?.name || 'Sede'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400 opacity-70" />
                </button>

                {venueDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span>Sedes Asignadas</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[9px] bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                        {isConsolidatedView ? 'Consolidado' : 'Sede Única'}
                      </span>
                    </div>
                    <div className="max-h-56 overflow-y-auto py-1">
                      {venues.map((v) => {
                        const isSelected = selectedVenueId === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => {
                              setSelectedVenueId(v.id);
                              setVenueDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-xs text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                              isSelected
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="truncate">
                              <div className="font-bold">{v.name}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{v.city} · {v.courtsCount} pistas</div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Acciones del Header */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Web Oficial / Marca Blanca (para atleta pro) */}
          {isProAthleteAdmin && (
            <button
              type="button"
              onClick={() => viewEntityWeb(currentTenant.slug)}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer shadow-xs"
              title={`Ver Web Oficial de Marca Blanca de ${currentTenant.name}`}
            >
              <Globe className="w-3.5 h-3.5 text-red-500" />
              <span className="truncate max-w-[130px]">Web Marca Blanca</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          )}

          {/* Selector de Idiomas (Oculto en barra superior móvil, disponible en Menú Hamburguesa móvil y en Escritorio) */}
          <div className="hidden md:block relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Cambiar idioma de la plataforma"
              aria-label="Seleccionar idioma"
            >
              <OfficialFlag code={language} />
              <span className="hidden sm:inline font-mono uppercase text-[11px] font-bold">
                {language.toUpperCase()}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  Idiomas Soportados
                </div>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      i18n.changeLanguage(l.code);
                      setLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-xs text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                      language === l.code
                        ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/60 dark:bg-emerald-950/40'
                        : 'text-slate-800 dark:text-slate-200 font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <OfficialFlag code={l.code} />
                      <span>{l.name}</span>
                    </span>
                    {language === l.code && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Conmutador directo de Tema Claro / Oscuro (Oculto en barra superior móvil, disponible en Menú Hamburguesa móvil y en Escritorio) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden md:inline-flex p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Elementos de la derecha flotantes y limpios sin cajas */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 1. Centro Global de Notificaciones (Campanita con badge dinámico) */}
            <NotificationsPopover variant="admin" />

            {/* 2. Asistente IA Copiloto (Paleta Oficial #0B1A2D + #B7F229) */}
            <button
              type="button"
              onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer relative ${
                aiDrawerOpen
                  ? 'bg-[#B7F229] text-[#0B1A2D] shadow-sm ring-2 ring-[#B7F229]/30'
                  : 'text-[#0B1A2D] dark:text-[#B7F229] hover:bg-[#0B1A2D]/8 dark:hover:bg-white/10'
              }`}
              title="Copiloto y Asistente IA Setmio"
              aria-label="Abrir Asistente IA"
              aria-expanded={aiDrawerOpen}
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* 3. Avatar del Usuario con Menú Desplegable Unificado */}
            <UserProfileDropdown
              variant="admin"
              onOpenProfileModal={onOpenProfileModal}
              onSelectTab={onSelectTab}
            />
          </div>
        </div>
      </header>

      {/* PANEL FLOTANTE DEL COPILOTO IA */}
      {aiDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Copiloto IA"
          className="fixed inset-0 z-50 flex flex-col justify-end px-3 pt-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-8 bg-[#040B15]/55 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        >
          {/* Backdrop Click Handler */}
          <div
            className="flex-1 w-full"
            onClick={() => setAiDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Floating Chat Container */}
          <div className="w-full max-w-xl mx-auto bg-[#0B1A2D] border border-white/12 rounded-3xl shadow-[0_24px_64px_rgba(3,9,20,0.65)] flex flex-col overflow-hidden max-h-[calc(100dvh-8.5rem)] sm:max-h-[600px] text-white animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Cabecera Minimalista */}
            <div className="px-5 pt-5 pb-3 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles className="w-4 h-4 text-[#B7F229] shrink-0" />
                <div className="flex items-baseline gap-2 min-w-0">
                  <h2 className="text-[15px] font-bold tracking-tight text-white shrink-0">
                    Copiloto IA
                  </h2>
                  <span className="text-xs font-medium text-slate-300/75 truncate">
                    {selectedVenue?.name || currentTenant.name}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAiDrawerOpen(false)}
                className="w-10 h-10 -mr-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.08] flex items-center justify-center transition cursor-pointer shrink-0"
                title="Cerrar Copiloto IA"
                aria-label="Cerrar Copiloto IA"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mensajes del Asistente */}
            <div className="flex-1 overflow-y-auto px-5 py-2.5 space-y-3.5 text-[13px] min-h-[200px] tabular-nums">
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#B7F229] text-[#0B1A2D] font-medium px-4 py-2.5 rounded-br-sm shadow-xs'
                        : 'bg-white/[0.06] text-slate-100 border border-white/[0.08] px-4 py-3.5 rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-slate-300 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#B7F229] animate-pulse shrink-0" />
                  <span>Consultando datos de {currentTenant.shortName}...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Píldoras de sugerencia rápida */}
            <div className="px-5 pt-2 pb-1 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              <button
                type="button"
                onClick={() => handleQuickPrompt('¿Cuál es el estado de ocupación y pistas libres hoy?')}
                className="whitespace-nowrap min-h-[36px] px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#B7F229]/75 hover:bg-[#B7F229]/12 text-xs font-medium text-slate-100 hover:text-white inline-flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-[#B7F229] shrink-0" />
                <span>Pistas libres hoy</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Resume los ingresos totales de hoy entre online y cafetería.')}
                className="whitespace-nowrap min-h-[36px] px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#B7F229]/75 hover:bg-[#B7F229]/12 text-xs font-medium text-slate-100 hover:text-white inline-flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#B7F229] shrink-0" />
                <span>Resumen de ingresos</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('¿Cuántas clases de escuela tenemos programadas esta tarde?')}
                className="whitespace-nowrap min-h-[36px] px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#B7F229]/75 hover:bg-[#B7F229]/12 text-xs font-medium text-slate-100 hover:text-white inline-flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#B7F229] shrink-0" />
                <span>Clases de escuela</span>
              </button>
            </div>

            {/* Barra de entrada flotante */}
            <form onSubmit={handleSendAi} className="px-4 pt-2 pb-4 shrink-0">
              <div className="flex items-center gap-2 rounded-full bg-[#071220] border border-white/15 focus-within:border-[#B7F229] pl-4 pr-1.5 py-1.5 transition-colors">
                <input
                  type="text"
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  placeholder={`Pregunta a la IA sobre pistas, agenda o socios de ${currentTenant.shortName}...`}
                  className="flex-1 min-w-0 bg-transparent py-1.5 text-[13px] text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!aiInputText.trim() || isAiThinking}
                  className="w-9 h-9 rounded-full bg-[#B7F229] hover:bg-[#a6de1f] disabled:opacity-35 disabled:hover:bg-[#B7F229] text-[#0B1A2D] flex items-center justify-center transition active:scale-95 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  title="Enviar mensaje"
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
