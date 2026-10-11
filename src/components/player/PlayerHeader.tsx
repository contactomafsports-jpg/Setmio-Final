import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Sun,
  Moon,
  User,
  FileText,
  LogOut,
} from 'lucide-react';
import { NotificationBell } from '../common/NotificationBell';

interface PlayerHeaderProps {
  onToggleMobileDrawer?: () => void;
  onOpenPublicProfile?: () => void;
  onOpenLegalModal?: () => void;
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  onToggleMobileDrawer,
  onOpenPublicProfile,
  onOpenLegalModal,
}) => {
  const {
    currentTenant,
    theme,
    toggleTheme,
    setCurrentView,
    logoutOrExitDemo,
    isWhiteLabelPlayerPreview,
    selectedVenue,
  } = useApp();

  const clubShortName = selectedVenue && selectedVenue.id !== 'all'
    ? `${currentTenant.shortName} (${selectedVenue.shortName})`
    : currentTenant.shortName;
  const clubInitials = currentTenant.name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase() || 'PAD';

  return (
    <header
      className={`sticky ${
        isWhiteLabelPlayerPreview ? 'top-10' : 'top-0'
      } z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 shadow-xs transition-all`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* Mobile Drawer Toggle */}
          {onToggleMobileDrawer && (
            <button
              type="button"
              onClick={onToggleMobileDrawer}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Menú lateral"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="min-w-0 flex items-center gap-2.5">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white text-sm shadow-xs select-none">
              {clubInitials}
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight truncate">
                {clubShortName}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Área Privada del Jugador
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Centro de Notificaciones */}
          <NotificationBell role="player" />

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Public profile button */}
          {onOpenPublicProfile && (
            <button
              type="button"
              onClick={onOpenPublicProfile}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <User className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mi Perfil Público</span>
            </button>
          )}

          {/* Legal modal button */}
          {onOpenLegalModal && (
            <button
              type="button"
              onClick={onOpenLegalModal}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Información Legal y Normativa"
            >
              <FileText className="w-4 h-4" />
            </button>
          )}

          {/* Switch to public web */}
          <button
            type="button"
            onClick={() => setCurrentView('public')}
            className="text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 py-1 transition"
          >
            Web Pública
          </button>

          {/* Cerrar Sesión / Salir Demo */}
          <button
            type="button"
            onClick={logoutOrExitDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition shadow-xs"
            title="Cerrar Sesión / Salir Demo"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span className="hidden sm:inline">Salir Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default PlayerHeader;
