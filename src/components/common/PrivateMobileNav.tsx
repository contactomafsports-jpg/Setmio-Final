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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-12px_30px_rgba(15,23,42,0.08)]"
    >
      {primaryNavItems.map((item) => {
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
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl transition-all duration-150 active:scale-95 cursor-pointer ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/80' : ''}`}>
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.75} />
            </div>
            <span className="text-[10px] tracking-tight truncate max-w-[70px]">{item.label}</span>
          </button>
        );
      })}

      {/* 5º El botón flotante "+" (Despliega el menú que contiene Pistas, Miembros y más) */}
      <button
        type="button"
        onClick={onMore}
        className="flex flex-col items-center justify-center gap-0.5 py-0.5 px-2 rounded-2xl transition-all duration-150 active:scale-95 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-emerald-600"
        aria-label="Más módulos (+)"
      >
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
            moreOpen
              ? 'bg-emerald-600 text-white rotate-45 scale-105 shadow-emerald-600/30'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25 hover:scale-105'
          }`}
        >
          <Plus className="w-5 h-5 transition-transform duration-200" strokeWidth={2.5} />
        </div>
        <span className="text-[10px] font-bold tracking-tight text-slate-600 dark:text-slate-400">
          {moreOpen ? 'Cerrar' : '+'}
        </span>
      </button>
    </nav>
  );
};

export default PrivateMobileNav;
