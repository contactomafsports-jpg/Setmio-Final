import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Settings, Send } from 'lucide-react';

export function AdminAIAgent() {
  const { currentTenant, setAdminTab, aiMessages, sendAIMessage, isAiThinking } = useApp();
  const [input, setInput] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendAIMessage(input.trim());
    setInput('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1A2D] dark:text-white tracking-tight">
            Copiloto IA
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-300/75 mt-0.5">
            {currentTenant.name}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAdminTab('settings')}
          className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 dark:bg-[#0E2239] dark:hover:bg-[#132A45] border border-slate-200 dark:border-white/12 text-[#0B1A2D] dark:text-slate-100 font-semibold text-xs flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Settings className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />
          <span>Configurar Canales</span>
        </button>
      </div>

      {/* Panel de Chat Interactivo */}
      <div className="rounded-3xl border border-white/12 bg-[#0B1A2D] p-5 shadow-[0_20px_50px_rgba(3,9,20,0.45)] space-y-4 text-white">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B7F229]" />
            <h2 className="text-sm font-bold text-white">
              Copiloto IA
            </h2>
            <span className="text-xs text-slate-300/75">{currentTenant.shortName}</span>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 tabular-nums">
          {aiMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-[13px] ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#B7F229] text-[#0B1A2D] font-medium px-4 py-2.5 rounded-br-sm'
                    : 'bg-white/[0.06] text-slate-100 border border-white/[0.08] px-4 py-3.5 rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isAiThinking && (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-slate-300 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B7F229] animate-pulse" />
              <span>El asistente está respondiendo...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="pt-2">
          <div className="flex items-center gap-2 rounded-full bg-[#071220] border border-white/15 focus-within:border-[#B7F229] pl-4 pr-1.5 py-1.5 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Pregunta a la IA sobre pistas, agenda o socios de ${currentTenant.shortName}...`}
              className="flex-1 min-w-0 bg-transparent py-1.5 text-[13px] text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isAiThinking}
              className="w-9 h-9 rounded-full bg-[#B7F229] hover:bg-[#a6de1f] disabled:opacity-35 text-[#0B1A2D] flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0"
              aria-label="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AdminAIAgent;
