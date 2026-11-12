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
      className="md:hidden fixed bottom-[max(1rem,env(safe-area-inset-bottom))] inset-x-4 max-w-md mx-auto z-40 bg-white/90 dark:bg-[#0B1A2D]/85 backdrop-blur-md border border-slate-200/80 dark:border-white/15 px-2.5 py-1.5 rounded-full flex items-center justify-around shadow-xl dark:shadow-[0_12px_36px_rgba(0,0,0,0.45)]"
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
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-2xl transition-all duration-150 active:scale-95 cursor-pointer flex-1 max-w-[74px] ${
              isActive
                ? 'text-[#0B1A2D] dark:text-[#B7F229]'
                : 'text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
            }`}
          >
            <div
              className={`px-2.5 py-1 rounded-full transition-colors ${
                isActive ? 'bg-slate-100 dark:bg-white/[0.08]' : 'bg-transparent'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-[#0B1A2D] dark:text-[#B7F229]' : ''
                }`}
                strokeWidth={isActive ? 2.4 : 1.75}
              />
            </div>
            <span
              className={`text-[11px] tracking-tight truncate max-w-[66px] leading-tight ${
                isActive ? 'font-bold' : 'font-medium'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Botón flotante central "+" con acento corporativo Verde Lima (#B7F229) e icono #0B1A2D */}
      <button
        type="button"
        onClick={onMore}
        className="relative -top-3.5 flex items-center justify-center p-0 transition-all duration-200 active:scale-95 cursor-pointer shrink-0 mx-1"
        aria-label="Más módulos y herramientas (+)"
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 border-white dark:border-[#0B1A2D] bg-[#B7F229] hover:bg-[#a6df17] text-[#0B1A2D] ring-2 ring-[#B7F229]/30 shadow-lg shadow-[#B7F229]/25 ${
            moreOpen ? 'rotate-45 scale-105' : 'hover:scale-105'
          }`}
        >
          <Plus className="w-6 h-6 transition-transform duration-200 text-[#0B1A2D]" strokeWidth={2.75} />
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
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-2xl transition-all duration-150 active:scale-95 cursor-pointer flex-1 max-w-[74px] ${
              isActive
                ? 'text-[#0B1A2D] dark:text-[#B7F229]'
                : 'text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
            }`}
          >
            <div
              className={`px-2.5 py-1 rounded-full transition-colors ${
                isActive ? 'bg-slate-100 dark:bg-white/[0.08]' : 'bg-transparent'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-[#0B1A2D] dark:text-[#B7F229]' : ''
                }`}
                strokeWidth={isActive ? 2.4 : 1.75}
              />
            </div>
            <span
              className={`text-[11px] tracking-tight truncate max-w-[66px] leading-tight ${
                isActive ? 'font-bold' : 'font-medium'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default PrivateMobileNav;
