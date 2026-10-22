import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Trophy,
  CreditCard,
  Menu,
  GraduationCap,
  Users,
  Briefcase,
  Layers,
  Building2,
} from 'lucide-react';
import { useApp, AdminTab } from '../../context/AppContext';

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
  const { t, currentTenant, currentUser } = useApp();

  const isCoach =
    currentTenant.type === 'COACH' || currentUser.role === 'COACH';
  const isAcademy =
    currentTenant.type === 'ACADEMY' || currentUser.role === 'ACADEMY_MANAGER';
  const isProAthlete =
    currentTenant.type === 'PRO_PLAYER' || currentUser.role === 'PROFESSIONAL_PLAYER';
  const isOrganizer =
    currentTenant.type === 'TOURNAMENT_ORGANIZER' || currentUser.role === 'TOURNAMENT_ORGANIZER';

  let navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [];

  if (isOrganizer) {
    navItems = [
      { id: 'tournaments', label: 'Torneos', icon: Trophy },
      { id: 'matches', label: 'Ligas', icon: Layers },
      { id: 'customers', label: 'Sponsors', icon: Briefcase },
      { id: 'courts_management', label: 'Sedes', icon: Building2 },
    ];
  } else if (isCoach) {
    navItems = [
      { id: 'academy', label: 'Mis Clases', icon: GraduationCap },
      { id: 'customers', label: 'Alumnos', icon: Users },
      { id: 'agenda', label: 'Calendario', icon: Calendar },
      { id: 'settings', label: 'Tarifas', icon: CreditCard },
    ];
  } else if (isAcademy) {
    navItems = [
      { id: 'academy', label: 'Cursos', icon: GraduationCap },
      { id: 'agenda', label: 'Asistencia', icon: Calendar },
      { id: 'customers', label: 'Alumnos', icon: Users },
      { id: 'invoicing', label: 'Pagos', icon: CreditCard },
    ];
  } else if (isProAthlete) {
    navItems = [
      { id: 'agenda', label: 'Agenda FIP', icon: Calendar },
      { id: 'customers', label: 'Sponsors', icon: Briefcase },
      { id: 'dashboard', label: 'Rendimiento', icon: LayoutDashboard },
      { id: 'matches', label: 'Estadísticas', icon: Trophy },
    ];
  } else {
    navItems = [
      { id: 'courts_management', label: 'Pistas', icon: Layers },
      { id: 'agenda', label: 'Reservas', icon: Calendar },
      { id: 'pos_cafe', label: 'TPV / Caja', icon: CreditCard },
      { id: 'customers', label: 'Miembros', icon: Users },
    ];
  }

  return (
    <nav
      aria-label="Navegación principal de club"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-12px_30px_rgba(15,23,42,0.08)]"
    >
      {navItems.map((item) => {
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
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl transition-all duration-150 active:scale-95 ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/80' : ''}`}>
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.75} />
            </div>
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}

      {/* 5. Más (Drawer táctil) */}
      <button
        type="button"
        onClick={onMore}
        className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl transition-all duration-150 active:scale-95 ${
          moreOpen
            ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
        aria-label="Abrir menú de más opciones"
      >
        <div className={`p-1 rounded-xl transition ${moreOpen ? 'bg-emerald-50 dark:bg-emerald-950/80' : ''}`}>
          <Menu className="w-5 h-5" strokeWidth={moreOpen ? 2.5 : 1.75} />
        </div>
        <span className="text-[10px] tracking-tight">{t('club.nav.more', 'Más')}</span>
      </button>
    </nav>
  );
};
