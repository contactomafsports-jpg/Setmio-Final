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
  Bot,
  Minimize2,
  X,
  Send,
  Building2,
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
      <header className="sticky top-0 z-50 h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3.5 sm:px-6 flex items-center justify-between gap-2 shadow-xs transition-colors">
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
            /* Vista Admin Club / Escuela / Profesor / Atleta: Branding Oficial Setmio Pro con Isotipo Cuadrado PWA */
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onSelectTab?.('dashboard')}
                className="flex items-center gap-2 cursor-pointer select-none group text-left p-0 bg-transparent border-0 focus:outline-none"
                title="Ir al Inicio de Setmio"
              >
                {/* Logotipo Cuadrado PWA Optimizado (recorte / object-fit) */}
                <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl overflow-hidden bg-[#0B1A2D] border border-slate-700/60 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-102 transition-transform">
                  <img
                    src="/icon.svg"
                    alt="Setmio Pro"
                    className="w-full h-full object-cover select-none"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[19px] sm:text-[21px] font-extrabold tracking-tight text-[#0B1A2D] dark:text-white uppercase font-sans leading-none select-none">
                    SETMIO
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#B7F229] text-[#0B1A2D] tracking-wider leading-none shrink-0 shadow-2xs border border-[#B7F229]">
                    PRO
                  </span>
                </div>
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

          {/* 1. Centro Global de Notificaciones (Campanita con badge numérico dinámico) */}
          <NotificationsPopover variant="admin" />

          {/* Asistente IA Copiloto (Acento Violeta de Marca #8B5CF6) */}
          <button
            type="button"
            onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
              aiDrawerOpen
                ? 'bg-[#8B5CF6] text-white border-[#7C3AED] shadow-sm shadow-[#8B5CF6]/30'
                : 'bg-[#EDE9FE]/80 dark:bg-[#8B5CF6]/15 hover:bg-[#EDE9FE] dark:hover:bg-[#8B5CF6]/25 text-[#7C3AED] dark:text-[#C4B5FD] border-[#8B5CF6]/30 dark:border-[#8B5CF6]/40 shadow-2xs'
            }`}
            title="Copiloto y Asistente IA Setmio"
            aria-label="Abrir Asistente IA"
          >
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#C4B5FD]" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
            </div>
            <span className="font-extrabold text-[11px] hidden sm:inline text-[#7C3AED] dark:text-[#C4B5FD]">IA</span>
          </button>

          {/* 2. Avatar del Usuario con Menú Desplegable Unificado */}
          <UserProfileDropdown
            variant="admin"
            onOpenProfileModal={onOpenProfileModal}
            onSelectTab={onSelectTab}
          />
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
