import React from 'react';
import { Clock, KeyRound, CheckCircle2, AlertCircle, XCircle, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface BookingListItemData {
  id: string;
  venueId?: string;
  venueName?: string;
  venueShortName?: string;
  timeSlot?: string;
  startTime: string;
  endTime?: string;
  courtName: string;
  courtType?: string;
  courtId?: string;
  creatorName: string;
  creatorPhone?: string;
  creatorMemberNum?: string;
  category?: 'match' | 'academy' | 'private' | 'tournament' | 'maintenance';
  title?: string;
  sport?: string;
  mode?: 'friendly' | 'competitive';
  gender?: 'male' | 'female' | 'mixed';
  totalPrice?: number | string;
  status?: string;
  paymentStatus?: 'paid' | 'pending' | 'partially_paid';
  accessPin?: string;
  lightsStatus?: 'on' | 'off' | 'auto';
  doorStatus?: 'open' | 'locked' | 'auto';
  participants?: any[];
  notes?: string;
}

interface BookingListItemProps {
  booking: BookingListItemData;
  onClick?: () => void;
  className?: string;
  isPlayerView?: boolean;
}

export const BookingListItem: React.FC<BookingListItemProps> = ({
  booking,
  onClick,
  className = '',
  isPlayerView = false,
}) => {
  const { isMultiVenue, currentUser, currentView, isConsolidatedView } = useApp();

  const isPlayer =
    isPlayerView ||
    currentView === 'player' ||
    currentUser.role === 'PLAYER' ||
    currentUser.role === 'PROFESSIONAL_PLAYER';

  // Format Time Slot
  const formatTimeSlot = () => {
    if (booking.timeSlot) return booking.timeSlot;
    if (booking.startTime) {
      const start = booking.startTime.includes('T')
        ? booking.startTime.split('T')[1].slice(0, 5)
        : booking.startTime.slice(0, 5);
      const end = booking.endTime
        ? booking.endTime.includes('T')
          ? booking.endTime.split('T')[1].slice(0, 5)
          : booking.endTime.slice(0, 5)
        : '';
      return end ? `${start} - ${end}` : start;
    }
    return '18:00 - 19:30';
  };

  // Format Price: Player role only sees individual share
  const formatPrice = () => {
    let numeric = 28.0;
    if (typeof booking.totalPrice === 'number') {
      numeric = booking.totalPrice;
    } else if (typeof booking.totalPrice === 'string') {
      const clean = parseFloat(booking.totalPrice.replace(/[^\d.-]/g, ''));
      if (!isNaN(clean)) numeric = clean;
    }
    
    if (isPlayer) {
      const playerShare = numeric / 4;
      return `${playerShare.toFixed(2)} €`;
    }

    return `${numeric.toFixed(2)} €`;
  };

  const calculateDurationMinutes = (startStr?: string, endStr?: string, slotStr?: string): number => {
    let s = startStr || '';
    let e = endStr || '';
    if ((!s || !e) && slotStr && slotStr.includes('-')) {
      const parts = slotStr.split('-').map((p) => p.trim());
      s = parts[0];
      e = parts[1];
    }
    if (!s || !e) return 90;
    const parseToMins = (val: string) => {
      const timePart = val.includes('T') ? val.split('T')[1].slice(0, 5) : val.slice(0, 5);
      const [h, m] = timePart.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };
    const startM = parseToMins(s);
    let endM = parseToMins(e);
    if (endM < startM) endM += 24 * 60;
    const diff = endM - startM;
    return diff > 0 ? diff : 90;
  };

  const cleanVenue = (name?: string) => {
    if (!name) return 'Narón';
    let clean = name.replace(/\s*\((?:Central|Centro)\)/gi, '').replace(/\bCentral\b/gi, '').trim();
    clean = clean.replace(/^Sede\s+/i, '').replace(/·.*$/, '').trim();
    if (!clean || clean.toLowerCase() === 'san mateo') return 'Narón';
    return clean;
  };

  const timeText = formatTimeSlot();
  const pinCode = booking.accessPin || '4821#';
  const typeText =
    booking.title ||
    (booking.category === 'academy'
      ? 'Clase de Escuela'
      : booking.category === 'tournament'
      ? 'Torneo Oficial'
      : booking.category === 'private'
      ? 'Reserva Directa'
      : 'Pádel Abierto');

  const rawStatus = String(booking.status || '').toLowerCase();
  const rawPayment = String(booking.paymentStatus || '').toLowerCase();
  const isCanceled = rawStatus === 'canceled' || rawStatus === 'cancelada';
  const isPaid = rawStatus === 'pagado' || rawPayment === 'paid';

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`w-full min-w-0 overflow-hidden bg-white dark:bg-[#0E2239] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4 cursor-pointer transition hover:border-[#8B5CF6]/50 hover:shadow-xs group text-left active:scale-[0.99] ${className}`}
    >
      {/* 1. Header: Franja horaria a la izquierda, Pista a la derecha en la misma línea superior */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#EDE9FE] dark:bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#6D28D9] dark:text-[#C4B5FD] text-xs sm:text-[13px] font-bold tracking-tight shrink-0 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B5CF6] shrink-0" />
          <span>{timeText}</span>
          <span className="text-xs opacity-85 font-semibold">· {calculateDurationMinutes(booking.startTime, booking.endTime, timeText)} min</span>
        </span>

        <span className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full truncate whitespace-nowrap min-w-0 max-w-[140px] sm:max-w-none">
          {booking.courtName}
        </span>
      </div>

      {/* 2. Protagonismo del Cliente y Precio en la misma fila sin amontonamiento */}
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="min-w-0 flex-1 space-y-1">
          {/* Micro-texto de Sede en Vista Consolidada ("Todas las Sedes") */}
          {isConsolidatedView && (booking.venueShortName || booking.venueName) && (
            <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#0B1A2D] dark:text-[#B7F229] tracking-tight whitespace-nowrap truncate">
              <Building2 className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
              <span className="truncate">{cleanVenue(booking.venueShortName || booking.venueName)}</span>
            </div>
          )}
          <h4 className="text-base font-bold text-[#0B1A2D] dark:text-white truncate whitespace-nowrap group-hover:text-[#8B5CF6] transition-colors">
            {booking.creatorName}
            {booking.creatorMemberNum && (
              <span className="ml-1.5 text-xs sm:text-[13px] font-medium text-slate-500 dark:text-slate-400">
                ({booking.creatorMemberNum})
              </span>
            )}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 truncate whitespace-nowrap">
            {typeText} • {booking.sport || 'Pádel'}
          </p>
        </div>
        <span className="text-base sm:text-lg font-extrabold text-[#0B1A2D] dark:text-white font-mono shrink-0 whitespace-nowrap">
          {formatPrice()}
        </span>
      </div>

      {/* 3. Distribución Inferior Limpia: Estado de Pago a la izquierda, PIN de Acceso a la derecha */}
      <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 dark:border-slate-800 gap-2 min-w-0">
        {isCanceled ? (
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 px-2.5 sm:px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800 whitespace-nowrap shrink-0">
            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>CANCELADA</span>
          </span>
        ) : isPaid ? (
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#0B1A2D] dark:text-[#B7F229] bg-[#F0FCCF] dark:bg-[#B7F229]/20 px-2.5 sm:px-3 py-1 rounded-full border border-[#B7F229]/50 whitespace-nowrap shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#659b02] dark:text-[#B7F229] shrink-0" />
            <span>PAGADO</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 sm:px-3 py-1 rounded-full border border-slate-200/80 dark:border-slate-700 whitespace-nowrap shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 shrink-0" />
            <span>PENDIENTE TPV</span>
          </span>
        )}

        {/* Tag de Acceso Domótico PIN: Contenedor neutro y limpio (#0B1A2D / Slate) */}
        <div className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-[13px] font-bold text-[#0B1A2D] dark:text-slate-200 font-mono tracking-wide shadow-2xs whitespace-nowrap shrink-0">
          <KeyRound className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-slate-300 shrink-0" />
          <span>PIN: <strong className="text-[#0B1A2D] dark:text-white font-black">{pinCode}</strong></span>
        </div>
      </div>
    </article>
  );
};

export default BookingListItem;
