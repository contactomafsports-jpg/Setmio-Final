import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Send,
  Sparkles,
  Bot,
  Move,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const DraggableAIAgent: React.FC = () => {
  const {
    currentTenant,
    currentUser,
    aiMessages,
    sendAIMessage,
    isAiThinking,
    currentView,
  } = useApp();

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
        // Minimized floating bubble
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
            className="group relative flex items-center gap-2 cursor-grab active:cursor-grabbing p-3 sm:px-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-2xl hover:scale-105 transition-transform touch-none"
            title="Arrastra para mover o haz clic para abrir el Asistente IA"
            aria-label="Abrir Asistente IA"
          >
            <div className="relative">
              <Bot className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-emerald-950 animate-pulse" />
            </div>
            <span className="hidden sm:inline text-xs font-bold tracking-tight pr-1">
              Asistente {currentTenant.shortName}
            </span>
            <div className="opacity-40 group-hover:opacity-100 transition-opacity">
              <Move className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      ) : (
        // Expanded Chat Window (Supports Fullscreen on desktop or full fixed overlay on mobile)
        <div
          style={
            isFullscreen || (typeof window !== 'undefined' && window.innerWidth < 640)
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
              ? 'fixed inset-2 sm:inset-6 z-[70] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150'
              : 'fixed inset-0 z-50 sm:inset-auto sm:w-[380px] sm:h-[520px] sm:max-h-[82vh] bg-slate-900 sm:border sm:border-slate-700 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150'
          }
        >
          {/* Header & Drag Handle */}
          <div
            onPointerDown={isFullscreen || (typeof window !== 'undefined' && window.innerWidth < 640) ? undefined : handlePointerDown}
            onPointerMove={isFullscreen || (typeof window !== 'undefined' && window.innerWidth < 640) ? undefined : handlePointerMove}
            onPointerUp={isFullscreen || (typeof window !== 'undefined' && window.innerWidth < 640) ? undefined : handlePointerUp}
            className={`${
              isFullscreen || (typeof window !== 'undefined' && window.innerWidth < 640)
                ? 'cursor-default'
                : 'cursor-grab active:cursor-grabbing'
            } bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white tracking-tight">{headerInfo.title}</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono">
                    {headerInfo.badge}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">{headerInfo.subtitle}</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* WhatsApp Divert button if mode is 'both' */}
              {widgetMode === 'both' && (
                <a
                  href={whatsappDivertUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold transition mr-1"
                  title="Desviar conversación a WhatsApp oficial"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              )}

              {/* Fullscreen Expand / Restore */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title={isFullscreen ? 'Reducir tamaño' : 'Pantalla completa'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsFullscreen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Multichannel status strip */}
          <div className="bg-slate-950/70 border-b border-slate-800/80 px-3 py-1 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Web Chat: Activo</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              {widgetMode === 'both' ? (
                <a
                  href={whatsappDivertUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Desviar a WhatsApp</span>
                </a>
              ) : (
                <span>Atención Setmio IA</span>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-900/90">
            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {isAiThinking && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-8">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Analizando datos del club...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-1.5 bg-slate-950/60 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => sendAIMessage('¿Qué pistas y horarios tenéis libres hoy?')}
              className="whitespace-nowrap px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 transition"
            >
              🎾 Pistas libres
            </button>
            <button
              onClick={() => sendAIMessage('Información de la escuela y clases')}
              className="whitespace-nowrap px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 transition"
            >
              🎓 Escuela y tarifas
            </button>
            <button
              onClick={() => sendAIMessage('¿Dónde está ubicado el club en Narón?')}
              className="whitespace-nowrap px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 transition"
            >
              📍 Cómo llegar
            </button>
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pregunta sobre reservas, escuela, pistas..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-bold transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
