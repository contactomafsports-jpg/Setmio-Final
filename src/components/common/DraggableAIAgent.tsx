import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Send,
  Sparkles,
  Move,
  CalendarCheck,
  GraduationCap,
  MapPin,
} from 'lucide-react';

export const DraggableAIAgent: React.FC = () => {
  const {
    currentTenant,
    currentUser,
    aiMessages,
    sendAIMessage,
    isAiThinking,
    currentView,
    isCorporateLanding,
  } = useApp();

  const isPublicCorporate = isCorporateLanding && currentView === 'public';

  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 24, y: 88 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 24,
    posY: 88,
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  const widgetMode = currentTenant.settings.chatWidgetMode || 'both';

  // Restore position from sessionStorage if exists
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('setmio_ai_agent_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          setPosition(parsed);
          dragRef.current.posX = parsed.x;
          dragRef.current.posY = parsed.y;
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Listen for top-bar AI toggle event on public corporate pages
  useEffect(() => {
    const handleToggleCorporateAi = () => setIsOpen((prev) => !prev);
    window.addEventListener('setmio:toggle-corporate-ai', handleToggleCorporateAi);
    return () => window.removeEventListener('setmio:toggle-corporate-ai', handleToggleCorporateAi);
  }, []);

  // Auto scroll chat to bottom & block body scroll on mobile
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [aiMessages, isOpen]);

  // In admin view or whatsapp-only mode, the floating AI agent is not rendered
  // (In admin view, the AI agent is integrated directly in AdminHeader as a bottom sheet drawer)
  if (widgetMode === 'whatsapp' || currentView === 'admin') {
    return null;
  }

  // Precomputed WhatsApp URL for diverting conversations
  const cleanPhone = (currentTenant.whatsappNumber || currentTenant.contactPhone || '')
    .replace(/[^\d+]/g, '')
    .replace('+', '');

  const greeting = encodeURIComponent(
    currentTenant.settings.whatsappGreetingMessage ||
      `¡Hola! Escribo desde la web de ${currentTenant.name}. Quisiera hablar con recepción tras consultar el asistente virtual.`
  );

  const whatsappDivertUrl = `https://wa.me/${cleanPhone}?text=${greeting}`;

  // Touch and Mouse Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag from the drag handle or minimized button
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = dragRef.current.startX - e.clientX;
    const deltaY = dragRef.current.startY - e.clientY;

    const newX = Math.max(12, Math.min(window.innerWidth - 70, dragRef.current.posX + deltaX));
    const newY = Math.max(12, Math.min(window.innerHeight - 70, dragRef.current.posY + deltaY));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    // Save to session storage
    sessionStorage.setItem('setmio_ai_agent_pos', JSON.stringify(position));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendAIMessage(inputText);
    setInputText('');
  };

  // Determine Agent Mode Title
  const getAgentHeader = () => {
    if (isPublicCorporate) {
      return {
        title: 'Asistente Setmio',
        badge: 'Setmio Pro & Player',
        subtitle: 'Plataforma de Pádel',
      };
    }
    if (currentView === 'player') {
      return {
        title: `Coach Personal IA`,
        badge: 'Área Jugador',
        subtitle: 'Táctica, nivel y preparación de partidos',
      };
    }
    return {
      title: `Asistente ${currentTenant.shortName}`,
      badge: 'Atención al Cliente',
      subtitle: 'Disponibilidad, escuela, reservas y tarifas',
    };
  };

  const headerInfo = getAgentHeader();

  return (
    <>
      {!isOpen ? (
        isPublicCorporate ? null : (
          // Minimized floating bubble (non-corporate / client white-label & player views)
          <div
            style={{
              position: 'fixed',
              right: `${position.x}px`,
              bottom: `${position.y}px`,
              zIndex: 50,
            }}
            className="touch-none select-none transition-shadow"
          >
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={() => {
              if (!isDragging) setIsOpen(true);
            }}
            className="group relative flex items-center gap-2 cursor-grab active:cursor-grabbing p-3 sm:px-4 rounded-full bg-[#0B1A2D] border border-white/15 text-white shadow-[0_14px_36px_rgba(11,26,45,0.45)] hover:border-[#B7F229]/60 hover:scale-[1.03] transition-all touch-none"
            title="Arrastra para mover o haz clic para abrir el Copiloto IA"
            aria-label="Abrir Copiloto IA"
          >
            <Sparkles className="w-5 h-5 text-[#B7F229] shrink-0" />
            <span className="hidden sm:inline text-xs font-bold tracking-tight pr-0.5">
              Copiloto IA
            </span>
            <div className="opacity-40 group-hover:opacity-100 transition-opacity">
              <Move className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>
        </div>
        )
      ) : (
        // Expanded Chat Window
        <div
          style={
            isPublicCorporate || isFullscreen || (typeof window !== 'undefined' && window.innerWidth < 640)
              ? undefined
              : {
                  position: 'fixed',
                  right: `${Math.min(position.x, typeof window !== 'undefined' ? window.innerWidth - 400 : 20)}px`,
                  bottom: `${Math.min(position.y, typeof window !== 'undefined' ? window.innerHeight - 540 : 20)}px`,
                  zIndex: 50,
                }
          }
          className={
            isFullscreen
              ? 'fixed inset-2 sm:inset-6 z-[70] bg-[#0B1A2D] border border-white/12 rounded-3xl shadow-[0_24px_64px_rgba(3,9,20,0.65)] flex flex-col overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150'
              : isPublicCorporate
              ? 'fixed inset-x-3 top-20 bottom-4 z-50 sm:inset-auto sm:top-20 sm:right-6 sm:w-[380px] sm:h-[520px] sm:max-h-[calc(100dvh-6rem)] bg-[#0B1A2D] border border-[#1A314D] rounded-3xl shadow-[0_24px_64px_rgba(3,9,20,0.65)] flex flex-col overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150'
              : 'fixed inset-x-3 bottom-20 top-12 z-50 sm:inset-auto sm:w-[380px] sm:h-[520px] sm:max-h-[82vh] bg-[#0B1A2D] border border-white/12 rounded-3xl shadow-[0_24px_64px_rgba(3,9,20,0.65)] flex flex-col overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150'
          }
        >
          {/* Header & Drag Handle */}
          <div
            onPointerDown={isPublicCorporate || isFullscreen || (typeof window !== 'undefined' && window.innerWidth < 640) ? undefined : handlePointerDown}
            onPointerMove={isPublicCorporate || isFullscreen || (typeof window !== 'undefined' && window.innerWidth < 640) ? undefined : handlePointerMove}
            onPointerUp={isPublicCorporate || isFullscreen || (typeof window !== 'undefined' && window.innerWidth < 640) ? undefined : handlePointerUp}
            className={`${
              isPublicCorporate || isFullscreen || (typeof window !== 'undefined' && window.innerWidth < 640)
                ? 'cursor-default'
                : 'cursor-grab active:cursor-grabbing'
            } px-5 pt-4 pb-2.5 flex items-center justify-between gap-2 shrink-0 border-b border-white/10`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-[#B7F229] shrink-0" />
              <div className="flex items-baseline gap-2 min-w-0">
                <span className="text-sm font-bold text-white tracking-tight shrink-0">
                  {headerInfo.title}
                </span>
                <span className="text-[11px] font-medium text-slate-300/75 truncate">
                  {isPublicCorporate ? headerInfo.subtitle : currentTenant.shortName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {widgetMode === 'both' && (
                <a
                  href={whatsappDivertUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/[0.06] hover:border-[#B7F229]/60 border border-white/12 text-slate-200 hover:text-white text-[11px] font-medium transition mr-0.5"
                  title="Desviar conversación a WhatsApp oficial"
                >
                  <MessageCircle className="w-3 h-3 text-[#B7F229]" />
                  <span>WhatsApp</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-9 h-9 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.08] flex items-center justify-center transition cursor-pointer"
                title={isFullscreen ? 'Reducir tamaño' : 'Pantalla completa'}
                aria-label={isFullscreen ? 'Reducir tamaño' : 'Pantalla completa'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsFullscreen(false);
                }}
                className="w-9 h-9 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.08] flex items-center justify-center transition cursor-pointer"
                title="Cerrar"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3 text-[13px] tabular-nums">
            {aiMessages.map((msg, index) => {
              const displayMsgText =
                isPublicCorporate && index === 0 && msg.sender === 'assistant'
                  ? '¡Hola! Soy el asistente de Setmio. Puedo informarte sobre nuestras soluciones para clubes, escuelas, entrenadores, administraciones, federaciones, equipos y jugadores profesionales, además de planes y domótica. ¿Qué necesitas consultar?'
                  : msg.text;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[86%] rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#B7F229] text-[#0B1A2D] font-medium px-4 py-2.5 rounded-br-sm shadow-xs'
                        : 'bg-white/[0.06] text-slate-100 border border-white/[0.08] px-4 py-3 rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{displayMsgText}</p>
                  </div>
                </div>
              );
            })}

            {isAiThinking && (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-slate-300 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#B7F229] animate-pulse shrink-0" />
                <span>{isPublicCorporate ? 'Consultando plataforma Setmio...' : 'Analizando datos del club...'}</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 pt-2 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {isPublicCorporate ? (
              <>
                <button
                  type="button"
                  onClick={() => sendAIMessage('¿Cómo funciona la marca blanca y los precios?')}
                  className="whitespace-nowrap min-h-[34px] px-3 py-1 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#B7F229]/75 hover:bg-[#B7F229]/12 text-[11px] font-medium text-slate-100 inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <CalendarCheck className="w-3 h-3 text-[#B7F229] shrink-0" />
                  <span>Marca blanca y precios</span>
                </button>
                <button
                  type="button"
                  onClick={() => sendAIMessage('¿Qué incluye la domótica de pistas 24/7?')}
                  className="whitespace-nowrap min-h-[34px] px-3 py-1 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#B7F229]/75 hover:bg-[#B7F229]/12 text-[11px] font-medium text-slate-100 inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <GraduationCap className="w-3 h-3 text-[#B7F229] shrink-0" />
                  <span>Domótica 24/7</span>
                </button>
                <button
                  type="button"
                  onClick={() => sendAIMessage('¿Qué soluciones tenéis para jugadores y equipos?')}
                  className="whitespace-nowrap min-h-[34px] px-3 py-1 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#B7F229]/75 hover:bg-[#B7F229]/12 text-[11px] font-medium text-slate-100 inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <MapPin className="w-3 h-3 text-[#B7F229] shrink-0" />
                  <span>Equipos y jugador</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => sendAIMessage('¿Qué pistas y horarios tenéis libres hoy?')}
                  className="whitespace-nowrap min-h-[34px] px-3 py-1 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#B7F229]/75 hover:bg-[#B7F229]/12 text-[11px] font-medium text-slate-100 inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <CalendarCheck className="w-3 h-3 text-[#B7F229] shrink-0" />
                  <span>Pistas libres hoy</span>
                </button>
                <button
                  type="button"
                  onClick={() => sendAIMessage('Información de la escuela y clases')}
                  className="whitespace-nowrap min-h-[34px] px-3 py-1 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#B7F229]/75 hover:bg-[#B7F229]/12 text-[11px] font-medium text-slate-100 inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <GraduationCap className="w-3 h-3 text-[#B7F229] shrink-0" />
                  <span>Escuela y tarifas</span>
                </button>
                <button
                  type="button"
                  onClick={() => sendAIMessage('¿Dónde está ubicado el club en Narón?')}
                  className="whitespace-nowrap min-h-[34px] px-3 py-1 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#B7F229]/75 hover:bg-[#B7F229]/12 text-[11px] font-medium text-slate-100 inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <MapPin className="w-3 h-3 text-[#B7F229] shrink-0" />
                  <span>Cómo llegar</span>
                </button>
              </>
            )}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSubmit} className="px-4 pt-2 pb-4 shrink-0">
            <div className="flex items-center gap-2 rounded-full bg-[#071220] border border-white/15 focus-within:border-[#B7F229] pl-4 pr-1.5 py-1.5 transition-colors">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isPublicCorporate ? 'Pregunta sobre Setmio Pro o Player...' : 'Pregunta a la IA sobre pistas, escuela...'}
                className="flex-1 min-w-0 bg-transparent py-1 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isAiThinking}
                className="w-8 h-8 rounded-full bg-[#B7F229] hover:bg-[#a6de1f] disabled:opacity-35 disabled:hover:bg-[#B7F229] text-[#0B1A2D] flex items-center justify-center transition active:scale-95 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                title="Enviar mensaje"
                aria-label="Enviar mensaje"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
