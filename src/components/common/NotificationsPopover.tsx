import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  ChevronLeft,
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

  useEffect(() => {
    if (!selectedNotification) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNotification(null);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNotification]);

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />;
      case 'match':
      case 'tournament':
        return <Trophy className="w-4 h-4 text-[#8B5CF6]" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-[#0B1A2D] dark:text-sky-400" />;
      case 'system':
      default:
        return <Info className="w-4 h-4 text-[#8B5CF6]" />;
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

  const getTypeBadgeClasses = (type: NotificationItem['type']) => {
    switch (type) {
      case 'booking':
        return 'bg-[#F0FCCF] dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] border border-[#B7F229]/40';
      case 'match':
      case 'tournament':
      case 'system':
        return 'bg-[#EDE9FE] dark:bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#C4B5FD] border border-[#8B5CF6]/30';
      case 'payment':
      default:
        return 'bg-slate-100 dark:bg-white/[0.08] text-[#0B1A2D] dark:text-slate-200 border border-slate-200 dark:border-white/10';
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
          className="relative w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center shrink-0 rounded-full text-[#0B1A2D] dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Centro de Notificaciones"
          aria-label="Abrir centro de notificaciones"
          aria-expanded={isOpen}
        >
          <Bell className="w-4 h-4 shrink-0 text-[#0B1A2D] dark:text-slate-200" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-4 px-1 rounded-full bg-[#B7F229] text-[#0B1A2D] font-black text-[9px] flex items-center justify-center leading-none ring-2 ring-white dark:ring-slate-900 shadow-2xs pointer-events-none animate-in zoom-in-75 duration-150">
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

            <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-96 max-w-sm sm:max-w-none max-h-[calc(100dvh-5.5rem)] rounded-2xl bg-white dark:bg-[#0B1A2D] border border-slate-200 dark:border-white/10 shadow-2xl p-0 z-50 animate-in fade-in-50 zoom-in-95 duration-100 text-xs overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-3.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.03] shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#F0FCCF] dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#0B1A2D] dark:text-white leading-none">
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
                    className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:bg-slate-100 dark:hover:bg-white/[0.06] transition flex items-center gap-1 cursor-pointer"
                    title="Marcar todas como leídas"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span className="hidden sm:inline">Marcar leídas</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filtros rápidos */}
            <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10 flex items-center gap-1 overflow-x-auto bg-white dark:bg-[#0B1A2D] shrink-0">
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
                      ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                      : 'text-slate-500 hover:text-[#0B1A2D] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Listado de Notificaciones interactivo con Click */}
            <div className="flex-1 max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/10">
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
                    className={`w-full text-left p-3 transition flex items-start gap-3 hover:bg-slate-100/80 dark:hover:bg-white/[0.06] cursor-pointer ${
                      !notif.read ? 'bg-[#F0FCCF]/40 dark:bg-[#B7F229]/[0.06]' : ''
                    }`}
                  >
                    <div className="mt-0.5 p-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] shrink-0">
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
                      <h5 className="font-bold text-xs text-[#0B1A2D] dark:text-white leading-tight">
                        {notif.title}
                      </h5>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#B7F229] shrink-0 mt-1.5 ring-2 ring-[#B7F229]/30" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer: Acceso a Preferencias de Notificación */}
            <div className="p-2.5 border-t border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={handleOpenPreferences}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-[#0B1A2D] dark:text-slate-200 hover:border-[#B7F229] dark:hover:text-[#B7F229] transition text-xs font-bold cursor-pointer shadow-2xs"
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
          VISTA / MODAL DETALLE DE NOTIFICACIÓN (PORTAL FULL-VIEWPORT SEGURO)
          ====================================================================== */}
      {selectedNotification &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] bg-slate-950/75 dark:bg-black/80 backdrop-blur-sm overflow-hidden animate-in fade-in duration-150"
            onClick={() => setSelectedNotification(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-detail-title"
          >
            <div
              className="w-full max-w-lg max-h-[calc(100dvh-2rem)] rounded-3xl bg-white dark:bg-[#0B1A2D] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden text-[#0B1A2D] dark:text-white animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cabecera limpia de Tercer Nivel: Botón < Volver, Título de Sección y Fecha/Estado */}
              <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-2 bg-white dark:bg-[#0B1A2D] shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/10 text-xs font-bold text-[#0B1A2D] dark:text-white transition cursor-pointer shrink-0"
                >
                  <ChevronLeft className="w-4 h-4 shrink-0" />
                  <span>Volver</span>
                </button>

                <div className="min-w-0 flex-1 text-center px-1">
                  <div className="text-xs sm:text-sm font-extrabold text-[#0B1A2D] dark:text-white truncate">
                    Detalles de Notificación
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 truncate">
                    <span>{selectedNotification.timestamp}</span>
                    <span>·</span>
                    <span className="font-bold text-[#0B1A2D] dark:text-[#B7F229]">Leída</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition cursor-pointer shrink-0"
                  title="Cerrar detalles"
                  aria-label="Cerrar detalles"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cuerpo con scroll interno seguro */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-5 space-y-4">
                {/* Bloque de Título y Categoría */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 shrink-0">
                    {getIconForType(selectedNotification.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${getTypeBadgeClasses(
                          selectedNotification.type
                        )}`}
                      >
                        {getTypeLabel(selectedNotification.type)}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>{selectedNotification.timestamp}</span>
                      </span>
                    </div>
                    <h3
                      id="notification-detail-title"
                      className="text-base font-black text-[#0B1A2D] dark:text-white mt-1.5 leading-snug break-words"
                    >
                      {selectedNotification.title}
                    </h3>
                  </div>
                </div>

                {/* Mensaje principal */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed break-words">
                  {selectedNotification.message}
                </div>

                {/* Sección de Origen */}
                <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5 shrink-0">
                    <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Sección de Origen:</span>
                  </span>
                  <span className="font-extrabold text-[#0B1A2D] dark:text-white text-right truncate">
                    {selectedNotification.originLabel || getActionInfo(selectedNotification).sectionName}
                  </span>
                </div>

                {/* Metadatos relevantes en cuadrícula */}
                {selectedNotification.metadata && Object.keys(selectedNotification.metadata).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Datos Relevantes del Evento
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      {Object.entries(selectedNotification.metadata).map(([key, val]) => (
                        <div
                          key={key}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between"
                        >
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">{key}</span>
                          <span className="font-bold text-[#0B1A2D] dark:text-white mt-0.5 break-words">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de acción directa */}
              <div className="px-4 sm:px-6 py-3.5 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#0B1A2D] shrink-0 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/10 text-[#0B1A2D] dark:text-slate-200 font-bold text-xs transition cursor-pointer text-center"
                >
                  Cerrar
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectAction(selectedNotification)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#B7F229] hover:bg-[#a6df17] text-[#0B1A2D] font-black text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{getActionInfo(selectedNotification).label}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default NotificationsPopover;
