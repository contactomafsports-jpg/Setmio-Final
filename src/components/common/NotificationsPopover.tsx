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
  ArrowRight,
  CreditCard,
  Layers,
  Users,
  Check,
} from 'lucide-react';

interface NotificationsPopoverProps {
  variant?: 'admin' | 'coach' | 'player';
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ variant = 'admin' }) => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationsAsRead,
    markSingleNotificationAsRead,
    setCurrentView,
    setAdminTab,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'booking' | 'match' | 'system'>('all');
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
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
        return <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'match':
      case 'tournament':
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'system':
      default:
        return <Info className="w-4 h-4 text-cyan-500" />;
    }
  };

  const getTypeLabel = (type: NotificationItem['type']) => {
    switch (type) {
      case 'booking':
        return 'Reserva de Pista';
      case 'match':
        return 'Partida Play!';
      case 'tournament':
        return 'Competición Oficial';
      case 'payment':
        return 'TPV & Cobro';
      case 'system':
      default:
        return 'Aviso del Club';
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    if (markSingleNotificationAsRead) {
      markSingleNotificationAsRead(notif.id);
    }
    setSelectedNotification(notif);
    setIsOpen(false);
  };

  const handleDirectAction = (notif: NotificationItem) => {
    setSelectedNotification(null);
    setCurrentView('admin');

    const tabPathMap: Record<string, string> = {
      agenda: '/admin/reservas',
      all_bookings: '/admin/reservas/todas',
      matches: '/admin/partidas',
      pos_cafe: '/admin/tpv',
      tournaments: '/admin/competiciones',
      courts_management: '/admin/pistas',
      customers: '/admin/socios',
      academy: '/admin/escuela',
      settings: '/admin/ajustes',
      staff: '/admin/profesores',
    };

    // Resolve target tab from originSection or type
    const origin = (notif.originSection || (
      notif.type === 'booking' ? 'agenda' :
      notif.type === 'match' ? 'matches' :
      notif.type === 'tournament' ? 'tournaments' :
      notif.type === 'payment' ? 'pos_cafe' :
      'agenda'
    )) as any;

    setAdminTab(origin);

    if (typeof window !== 'undefined' && tabPathMap[origin]) {
      window.history.pushState(null, '', tabPathMap[origin]);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const getActionInfo = (notif: NotificationItem) => {
    const origin = notif.originSection || (
      notif.type === 'booking' ? 'agenda' :
      notif.type === 'match' ? 'matches' :
      notif.type === 'tournament' ? 'tournaments' :
      notif.type === 'payment' ? 'pos_cafe' :
      'agenda'
    );

    switch (origin) {
      case 'agenda':
        return { label: 'Ir al Cuadrante de Reservas', sectionName: 'Agenda & Reservas' };
      case 'all_bookings':
        return { label: 'Ver Historial de Reservas', sectionName: 'Todas las Reservas' };
      case 'matches':
        return { label: 'Ir a Partidas Abiertas', sectionName: 'Partidas Play!' };
      case 'pos_cafe':
        return { label: 'Ir a TPV / Caja Mostrador', sectionName: 'TPV / Caja Mostrador' };
      case 'tournaments':
        return { label: 'Ir a Competiciones & Cuadros', sectionName: 'Competiciones' };
      case 'courts_management':
        return { label: 'Ir a Pistas & Domótica', sectionName: 'Pistas e Instalaciones' };
      case 'customers':
        return { label: 'Ver Ficha de Clientes / Socios', sectionName: 'Miembros & Socios' };
      case 'academy':
        return { label: 'Ir a Escuela & Cursos', sectionName: 'Escuela de Pádel' };
      case 'settings':
        return { label: 'Ir a Configuración del Club', sectionName: 'Configuración' };
      case 'staff':
        return { label: 'Ir a Gestión de Profesores', sectionName: 'Personal & Entrenadores' };
      default:
        return { label: 'Ir a la sección de origen', sectionName: 'Administración' };
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Botón Campana con Badge siempre visible */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-9 h-9 flex items-center justify-center shrink-0 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Centro de Notificaciones"
          aria-label="Abrir centro de notificaciones"
          aria-expanded={isOpen}
        >
          <Bell className="w-4 h-4 shrink-0 text-slate-700 dark:text-slate-300" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-4 px-1 rounded-full bg-emerald-500 text-white font-black text-[9px] flex items-center justify-center leading-none ring-2 ring-white dark:ring-slate-900 shadow-xs pointer-events-none animate-in zoom-in-75 duration-150">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Desplegable de Avisos Recientes (Ajustado para no cortarse en móvil) */}
        {isOpen && (
          <>
            {/* Mobile Backdrop Overlay para cerrar y evitar desbordamiento */}
            <div
              className="sm:hidden fixed inset-0 bg-slate-950/40 z-40 backdrop-blur-2xs animate-in fade-in duration-100"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-96 max-w-sm sm:max-w-none rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-0 z-50 animate-in fade-in-50 zoom-in-95 duration-100 text-xs overflow-hidden">
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
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filtros rápidos */}
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-1 overflow-x-auto bg-white dark:bg-slate-900">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'booking', label: 'Reservas' },
                { id: 'match', label: 'Partidas' },
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

            {/* Listado de Notificaciones interactivo con Click */}
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredNotifications.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-1">
                  <Bell className="w-6 h-6 mx-auto opacity-30" />
                  <p className="text-xs font-semibold">No hay notificaciones en este filtro</p>
                </div>
              ) : (
                filteredNotifications.map((notif, index) => (
                  <button
                    key={`${notif.id}-${index}`}
                    type="button"
                    onClick={() => handleNotificationClick(notif)}
                    className={`w-full text-left p-3 transition flex items-start gap-3 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer ${
                      !notif.read ? 'bg-emerald-50/40 dark:bg-emerald-950/25' : ''
                    }`}
                  >
                    <div className="mt-0.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
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
                  </button>
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
        </>
      )}
      </div>

      {/* ======================================================================
          MODAL DETALLE DE NOTIFICACIÓN CON ACCIÓN DIRECTA DE REDIRECCIÓN
          ====================================================================== */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 text-slate-900 dark:text-white animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
                  {getIconForType(selectedNotification.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {getTypeLabel(selectedNotification.type)}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedNotification.timestamp}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                    {selectedNotification.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Body */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedNotification.message}
            </div>

            {/* Sección de Origen */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sección de Origen:</span>
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {selectedNotification.originLabel || getActionInfo(selectedNotification).sectionName}
              </span>
            </div>

            {/* Metadatos relevantes en cuadrícula */}
            {selectedNotification.metadata && Object.keys(selectedNotification.metadata).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Datos Relevantes del Evento
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedNotification.metadata).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/70 dark:border-slate-800/80 flex flex-col justify-between"
                    >
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">{key}</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción directa */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer text-center"
              >
                Cerrar
              </button>

              <button
                type="button"
                onClick={() => handleDirectAction(selectedNotification)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{getActionInfo(selectedNotification).label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationsPopover;
