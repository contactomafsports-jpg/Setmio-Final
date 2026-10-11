import React from 'react';
import { Clock, KeyRound, CheckCircle2, AlertCircle, XCircle, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReservationDrawerData } from './ReservationDrawer';

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
  const { isMultiVenue, currentUser, currentView } = useApp();

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

  // Format Status Badge
  const getStatusInfo = () => {
    const raw = String(booking.status || '').toLowerCase();
    const payRaw = String(booking.paymentStatus || '').toLowerCase();

    if (raw === 'canceled' || raw === 'cancelada') {
      return {
        label: 'CANCELADA',
        style: 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        icon: <XCircle className="w-3 h-3 text-rose-500" />,
      };
    }
    if (raw === 'pendiente tpv' || raw === 'pending' || payRaw === 'pending' || payRaw === 'partially_paid') {
      return {
        label: 'PENDIENTE TPV',
        style: 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        icon: <AlertCircle className="w-3 h-3 text-amber-500" />,
      };
    }
    // Pagado or Confirmada
    if (raw === 'pagado' || payRaw === 'paid') {
      return {
        label: 'PAGADO',
        style: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" />,
      };
    }
    return {
      label: 'CONFIRMADA',
      style: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" />,
    };
  };

  const statusInfo = getStatusInfo();
  const timeText = formatTimeSlot();
  const pinCode = booking.accessPin || '4821#';
  const typeText =
    booking.title ||
    (booking.category === 'academy'
      ? 'Clase de Escuela'
      : booking.category === 'tournament'
      ? 'Torneo Oficial'
      : booking.category === 'private'
      ? 'Pista Privada'
      : 'Pádel Abierto 4.0');

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`w-full p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/60 hover:shadow-md transition text-left cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-sm ${className}`}
    >
      {/* IZQUIERDA: Badge con hora (en tonalidad menta) + Tag de Pista */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs shrink-0 group-hover:border-emerald-500/50 transition">
          <Clock className="w-3.5 h-3.5 text-emerald-500" />
          <span>{timeText}</span>
        </div>

        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-600/70">
          {booking.courtName}
        </span>

        {isMultiVenue && (booking.venueShortName || booking.venueName) && (
          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] border border-indigo-200 dark:border-indigo-800 shrink-0 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-indigo-500 shrink-0" />
            <span className="truncate max-w-[120px]">{booking.venueShortName || booking.venueName}</span>
          </span>
        )}
      </div>

      {/* CENTRO: Nombre del Titular + Tipo de reserva */}
      <div className="min-w-0 flex-1">
        <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition truncate">
          {booking.creatorName}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span>{typeText}</span>
          {booking.mode && (
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                booking.mode === 'competitive'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              {booking.mode === 'competitive' ? 'Competitivo' : 'Amistoso'}
            </span>
          )}
          {booking.gender && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
              {booking.gender === 'male' ? 'Masc' : booking.gender === 'female' ? 'Fem' : 'Mixto'}
            </span>
          )}
          {booking.sport && (
            <>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">{booking.sport}</span>
            </>
          )}
        </div>
      </div>

      {/* DERECHA: Columna vertical limpia: Arriba precio en negrita mono, abajo Badge de estado + Código PIN alineados */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        {/* Arriba: Precio en negrita mono destacado bien alineado a la derecha */}
        <div className="font-black font-mono text-base text-slate-900 dark:text-white sm:text-right tracking-tight">
          {formatPrice()}
        </div>

        {/* Abajo: Badge de estado + Código PIN alineados horizontalmente */}
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 border shadow-xs whitespace-nowrap ${statusInfo.style}`}
          >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 whitespace-nowrap">
            <KeyRound className="w-3 h-3 text-amber-500" />
            <span>PIN: <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{pinCode}</strong></span>
          </span>
        </div>
      </div>
    </div>
  );
};
