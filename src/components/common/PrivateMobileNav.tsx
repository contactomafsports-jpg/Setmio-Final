import React from 'react';
import { BarChart3, CalendarDays, Home, Menu, MoreHorizontal, Users } from 'lucide-react';

interface PrivateMobileNavProps {
  title: string;
  onMore: () => void;
  onHome?: () => void;
  onCalendar?: () => void;
  onCommunity?: () => void;
}

export const PrivateMobileNav: React.FC<PrivateMobileNavProps> = ({ title, onMore, onHome, onCalendar, onCommunity }) => (
  <>
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-background/80 backdrop-blur-md border-b border-border px-4 flex items-center justify-between shadow-sm md:hidden">
      <div className="flex items-center gap-2 min-w-0">
        <div className="size-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">SM</div>
        <span className="font-bold text-sm truncate text-foreground">{title}</span>
      </div>
      <button type="button" onClick={onMore} aria-label="Abrir más opciones" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Menu strokeWidth={1.5} /></button>
    </header>
    <nav aria-label="Navegación privada móvil" className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-background/80 backdrop-blur-md border-t border-border px-2 flex items-center justify-around shadow-[0_-8px_24px_rgba(16,34,29,0.06)] safe-area-bottom md:hidden">
      <button type="button" onClick={onHome} className="flex flex-col items-center gap-1 text-muted-foreground text-[10px]"><Home strokeWidth={1.5} /><span>Inicio</span></button>
      <button type="button" onClick={onCalendar} className="flex flex-col items-center gap-1 text-muted-foreground text-[10px]"><CalendarDays strokeWidth={1.5} /><span>Agenda</span></button>
      <button type="button" onClick={onCommunity} className="flex flex-col items-center gap-1 text-muted-foreground text-[10px]"><Users strokeWidth={1.5} /><span>Comunidad</span></button>
      <button type="button" onClick={onMore} className="flex flex-col items-center gap-1 text-muted-foreground text-[10px]"><MoreHorizontal strokeWidth={1.5} /><span>Más</span></button>
    </nav>
  </>
);
