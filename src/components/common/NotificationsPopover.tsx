import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types/database';
import {
  Bell,
  CheckCheck,
  Calendar,
  Trophy,
  Info,
  Clock,
  Settings,
  X,
  ExternalLink,
} from 'lucide-react';

interface NotificationsPopoverProps {
  variant?: 'admin' | 'coach' | 'player';
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ variant = 'admin' }) => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationsAsRead,
    setCurrentView,
    setAdminTab,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'booking' | 'match' | 'system'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredNotifications = notifications
    .filter((item, index, self) => self.findIndex((n) => n.id === item.id) === index)
    .filter((item) => {
      if (filterType === 'all') return true;
      if (filterType === 'booking') return item.type === 'booking';
      if (filterType === 'match') return item.type === 'match' || item.type === 'tournament';
      if (filterType === 'system') return item.type === 'system';
      return true;
    });

  const handleOpenPreferences = () => {
    setIsOpen(false);
    if (variant === 'player') {
      setCurrentView('player');
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/jugador/perfil/notificaciones');
      }
    } else {
      setCurrentView('admin');
      setAdminTab('settings');
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/admin/ajustes/notificaciones');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'match':
      case 'tournament':
        return <Trophy className="w-3.5 h-3.5 text-amber-500" />;
      case 'system':
      default:
        return <Info className="w-3.5 h-3.5 text-cyan-500" />;
    }
  };

  const getTypeLabel = (type: NotificationItem['type']) => {
    switch (type) {
      case 'booking':
        return 'Reserva';
      case 'match':
        return 'Partida Play!';
      case 'tournament':
        return 'Competición';
      case 'system':
      default:
        return 'Aviso del Club';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón Campana con Badge */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        title="Centro de Notificaciones"
        aria-label="Abrir centro de notificaciones"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-white font-black text-[9px] flex items-center justify-center leading-none ring-2 ring-white dark:ring-slate-900 animate-in zoom-in-75 duration-150">
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Desplegable de Avisos Recientes */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-0 z-50 animate-in fade-in-50 zoom-in-95 duration-100 text-xs overflow-hidden">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-none">
                  Notificaciones
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {unreadNotificationsCount > 0
                    ? `${unreadNotificationsCount} aviso${unreadNotificationsCount > 1 ? 's' : ''} sin leer`
                    : 'Todo al día'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadNotificationsCount > 0 && (
                <button
                  type="button"
                  onClick={markNotificationsAsRead}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition flex items-center gap-1 cursor-pointer"
                  title="Marcar todas como leídas"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span className="hidden sm:inline">Marcar leídas</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filtros rápidos */}
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-1 overflow-x-auto bg-white dark:bg-slate-900">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'match', label: 'Partidas' },
              { id: 'booking', label: 'Reservas' },
              { id: 'system', label: 'Club' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition shrink-0 cursor-pointer ${
                  filterType === f.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Listado de Notificaciones */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-1">
                <Bell className="w-6 h-6 mx-auto opacity-30" />
                <p className="text-xs font-semibold">No hay notificaciones en este filtro</p>
              </div>
            ) : (
              filteredNotifications.map((notif, index) => (
                <div
                  key={`${notif.id}-${index}`}
                  className={`p-3 transition flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                    !notif.read ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                    {getIconForType(notif.type)}
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {getTypeLabel(notif.type)}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        {notif.timestamp}
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                      {notif.title}
                    </h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5 ring-2 ring-emerald-200 dark:ring-emerald-900" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer: Acceso a Preferencias de Notificación */}
          <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between">
            <button
              type="button"
              onClick={handleOpenPreferences}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 transition text-xs font-bold cursor-pointer shadow-2xs"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>
                {variant === 'player'
                  ? 'Configurar mis canales preferidos'
                  : 'Configurar avisos y plantillas del club'}
              </span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopover;
