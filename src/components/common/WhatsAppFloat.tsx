import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  const { currentTenant, currentView } = useApp();

  const isEnabled = currentTenant.settings.whatsappWidgetEnabled;
  const mode = currentTenant.settings.chatWidgetMode || 'both';

  // Only render dedicated WhatsApp float button if mode is specifically 'whatsapp'
  if (!isEnabled || mode !== 'whatsapp') return null;

  // Clean phone number for wa.me
  const cleanPhone = (currentTenant.whatsappNumber || currentTenant.contactPhone || '')
    .replace(/[^\d+]/g, '')
    .replace('+', '');

  const greeting = encodeURIComponent(
    currentTenant.settings.whatsappGreetingMessage ||
      `¡Hola! Escribo desde la web de ${currentTenant.name}. Quisiera consultar información.`
  );

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${greeting}`;

  return (
    <div
      style={{
        position: 'fixed',
        left: '20px',
        bottom: currentView === 'admin' || currentView === 'player' ? '76px' : '20px',
        zIndex: 40,
      }}
      className="select-none"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 p-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-xl shadow-emerald-950/40 hover:scale-105 transition-all"
        title="Abrir chat en WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-slate-950 text-emerald-500" />
        <span className="hidden md:inline text-xs pr-1 font-bold text-slate-950">
          WhatsApp Club
        </span>
      </a>
    </div>
  );
};
