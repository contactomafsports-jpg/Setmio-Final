import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCheck,
  Trophy,
  Calendar,
  CreditCard,
  Shield,
  Clock,
  ExternalLink,
  Settings,
  X,
  Megaphone,
} from 'lucide-react';

interface NotificationBellProps {
  role?: 'admin' | 'coach' | 'player';
  align?: 'left' | 'right';
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  role = 'admin',
  align = 'right',
  className = '',
}) => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationsAsRead,
    setAdminTab,
    setCurrentView,
    triggerDemoToast,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const displayedNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <Megaphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'booking':
        return <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'payment':
        return <CreditCard className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'tournament':
        return <Trophy className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'match':
        return 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
      case 'booking':
        return 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
      case 'payment':
        return 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
      case 'tournament':
        return 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const handleOpenPreferences = () => {
    setIsOpen(false);
    if (role === 'admin') {
      window.history.pushState({}, '', '/admin/ajustes/notificaciones');
      window.dispatchEvent(new PopStateEvent('popstate'));
      setAdminTab('settings');
    } else if (role === 'player') {
      window.history.pushState({}, '', '/jugador/perfil/notificaciones');
      window.dispatchEvent(new PopStateEvent('popstate'));
      setCurrentView('player');
    } else {
      triggerDemoToast(
        'Preferencias de Notificaciones',
        'Canales activos: App Push y WhatsApp activados para avisos de clases.',
        'info'
      );
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botón Icono Campana */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        title="Centro de Notificaciones"
        aria-label="Notificaciones"
      >
        <Bell className="w-4 h-4" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-in zoom-in-50">
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Desplegable de Avisos Recientes */}
      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150 overflow-hidden flex flex-col max-h-[85vh]`}
        >
          {/* Header del Centro de Notificaciones */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                Notificaciones
              </span>
              {unreadNotificationsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {unreadNotificationsCount} nuevas
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadNotificationsCount > 0 && (
                <button
                  type="button"
                  onClick={markNotificationsAsRead}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 cursor-pointer"
                  title="Marcar todas como leídas"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Leer todas</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filtros: Todas vs No leídas */}
          <div className="flex items-center gap-1 p-2 border-b border-slate-100 dark:border-slate-800 text-[11px]">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                filter === 'unread'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              No leídas ({unreadNotificationsCount})
            </button>
          </div>

          {/* Lista de Notificaciones */}
          <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80">
            {displayedNotifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Bell className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  No hay notificaciones {filter === 'unread' ? 'pendientes' : ''}
                </p>
                <p className="text-[11px] text-slate-400">
                  Te avisaremos cuando haya novedades en tus partidos y reservas.
                </p>
              </div>
            ) : (
              displayedNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-start gap-2.5 text-xs ${
                    !n.read ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${getNotificationBg(
                      n.type
                    )}`}
                  >
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-extrabold text-slate-900 dark:text-white truncate text-xs">
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{n.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer con Enlace a Configuración / Preferencias de Notificaciones */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleOpenPreferences}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition cursor-pointer shadow-2xs"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>
                {role === 'admin'
                  ? 'Configuración de avisos del club'
                  : role === 'player'
                  ? 'Preferencias de avisos y canales'
                  : 'Ajustes de avisos'}
              </span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
