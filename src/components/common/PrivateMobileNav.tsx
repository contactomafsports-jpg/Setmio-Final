import React from 'react';
import { Plus } from 'lucide-react';
import { useApp, AdminTab } from '../../context/AppContext';
import { getAdminNavConfig } from '../../lib/adminNavigation';

interface PrivateMobileNavProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onMore: () => void;
  moreOpen: boolean;
}

export const PrivateMobileNav: React.FC<PrivateMobileNavProps> = ({
  currentTab,
  onSelectTab,
  onMore,
  moreOpen,
}) => {
  const { t, currentTenant, currentUser, isMultiVenue, venues } = useApp();

  const navConfig = getAdminNavConfig(currentTenant, currentUser, isMultiVenue, venues);
  const primaryNavItems = navConfig.primaryItems;

  return (
    <nav
      aria-label="Navegación principal de club"
      className="md:hidden fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 bg-white/95 dark:bg-[#0B1A2D]/95 backdrop-blur-xl border border-slate-200/80 dark:border-[#1A314D] px-2.5 py-1.5 rounded-full flex items-center justify-around shadow-[0_8px_30px_rgba(11,26,45,0.12)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.45)]"
    >
      {/* 1º y 2º items principales a la izquierda (Inicio y Reservas) */}
      {primaryNavItems.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive =
          (currentTab === item.id ||
            (item.id === 'agenda' && (currentTab === 'all_bookings' || currentTab === 'bookings'))) &&
          !moreOpen;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl transition-all duration-150 active:scale-95 cursor-pointer flex-1 max-w-[72px] ${
              isActive
                ? 'text-[#0B1A2D] dark:text-white font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-xl transition ${isActive ? 'bg-[#B7F229]/20 dark:bg-[#B7F229]/15' : ''}`}>
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.75} />
            </div>
            <span className="text-[10px] tracking-tight truncate max-w-[64px]">{item.label}</span>
          </button>
        );
      })}

      {/* Botón flotante central "+" con acento de marca Setmio (Luz y Contraste Óptimo en Modo Claro y Oscuro) */}
      <button
        type="button"
        onClick={onMore}
        className="relative -top-3.5 flex items-center justify-center p-0 transition-all duration-200 active:scale-95 cursor-pointer shrink-0 mx-1"
        aria-label="Más módulos y herramientas (+)"
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 border-white dark:border-[#0B1A2D] ${
            moreOpen
              ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D] rotate-45 scale-105 shadow-lg shadow-[#0B1A2D]/20 dark:shadow-[0_8px_24px_rgba(183,242,41,0.35)] ring-4 ring-slate-200/80 dark:ring-[#B7F229]/40'
              : 'bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3dc20] text-white dark:text-[#0B1A2D] shadow-lg shadow-[#0B1A2D]/20 dark:shadow-[0_8px_20px_rgba(183,242,41,0.28)] hover:scale-105 ring-4 ring-[#B7F229]/25 dark:ring-[#B7F229]/30'
          }`}
        >
          <Plus className="w-6 h-6 transition-transform duration-200 text-white dark:text-[#0B1A2D]" strokeWidth={2.75} />
        </div>
      </button>

      {/* 3º y 4º items principales a la derecha (Partidas y TPV/Caja) */}
      {primaryNavItems.slice(2).map((item) => {
        const Icon = item.icon;
        const isActive =
          (currentTab === item.id ||
            (item.id === 'agenda' && (currentTab === 'all_bookings' || currentTab === 'bookings'))) &&
          !moreOpen;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl transition-all duration-150 active:scale-95 cursor-pointer flex-1 max-w-[72px] ${
              isActive
                ? 'text-[#0B1A2D] dark:text-white font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-xl transition ${isActive ? 'bg-[#B7F229]/20 dark:bg-[#B7F229]/15' : ''}`}>
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.75} />
            </div>
            <span className="text-[10px] tracking-tight truncate max-w-[64px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default PrivateMobileNav;
