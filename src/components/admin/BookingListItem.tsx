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
        style: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700',
        icon: <AlertCircle className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />,
      };
    }
    // Pagado or Confirmada: Verde Lima #B7F229 y Azul Profundo #0B1A2D idéntico a Inicio
    if (raw === 'pagado' || payRaw === 'paid') {
      return {
        label: 'PAGADO',
        style: 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] border-[#B7F229]/50 dark:border-[#B7F229]/40',
        icon: <CheckCircle2 className="w-3 h-3 text-[#659b02] dark:text-[#B7F229] shrink-0" />,
      };
    }
    return {
      label: 'CONFIRMADA',
      style: 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] border-[#B7F229]/50 dark:border-[#B7F229]/40',
      icon: <CheckCircle2 className="w-3 h-3 text-[#659b02] dark:text-[#B7F229] shrink-0" />,
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
      ? 'Reserva Directa'
      : 'Pádel Abierto');

  const { selectedVenueId } = useApp();
  const showVenue = selectedVenueId === 'all' && (booking.venueShortName || booking.venueName);

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
      className={`w-full bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_10px_rgba(11,28,48,0.03)] space-y-3 hover:border-[#8B5CF6]/50 dark:hover:border-[#8B5CF6]/60 transition-colors text-left cursor-pointer group active:scale-[0.99] ${className}`}
    >
      {/* 1. Top Chips Ribbon: Horario y Pista */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDE9FE] dark:bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#6D28D9] dark:text-[#C4B5FD] font-bold text-xs tracking-tight">
          <Clock className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
          <span>{timeText}</span>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold text-xs truncate max-w-[200px] border border-slate-200/60 dark:border-slate-700/60">
          {booking.courtName}
        </div>
      </div>

      {/* 2. Etiqueta de Sede (Visible únicamente en vista consolidada 'Todas las Sedes') */}
      {showVenue && (
        <div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0B1A2D]/5 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] border border-slate-200/80 dark:border-[#B7F229]/30 text-xs font-bold">
            <Building2 className="w-3.5 h-3.5 shrink-0 text-[#0B1A2D] dark:text-[#B7F229]" />
            <span className="truncate">{booking.venueShortName || booking.venueName}</span>
          </div>
        </div>
      )}

      {/* 3. Nombre del Titular y Detalles de la Partida */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#8B5CF6] transition-colors truncate">
          {booking.creatorName}
          {booking.creatorMemberNum && (
            <span className="ml-1.5 text-xs font-normal text-slate-400 dark:text-slate-500">
              ({booking.creatorMemberNum})
            </span>
          )}
        </h3>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {typeText}
          </span>
          {booking.mode && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                booking.mode === 'competitive'
                  ? 'bg-[#8B5CF6]/15 dark:bg-[#8B5CF6]/30 text-[#8B5CF6] dark:text-[#c4b5fd]'
                  : 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] border border-[#B7F229]/40'
              }`}
            >
              {booking.mode === 'competitive' ? 'Competitivo' : 'Amistoso'}
            </span>
          )}
          {booking.gender && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
              {booking.gender === 'male' ? 'Masc' : booking.gender === 'female' ? 'Fem' : 'Mixto'}
            </span>
          )}
          {booking.sport && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              · {booking.sport}
            </span>
          )}
        </div>
      </div>

      {/* 4. Divisor sutil */}
      <div className="border-t border-slate-100 dark:border-slate-800/80"></div>

      {/* 5. Pie de Tarjeta: Importe + Píldora de Pago + Píldora de PIN */}
      <div className="flex items-center justify-between pt-0.5 gap-2">
        <div className="flex items-baseline gap-1">
          <span className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
            {formatPrice()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Pastilla de Estado de Pago (Estilo idéntico a Inicio) */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-2xs whitespace-nowrap ${statusInfo.style}`}
          >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </span>

          {/* Pastilla de Código PIN Domótico (Contenedor neutro y limpio) */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 text-[#0B1A2D] dark:text-slate-200 font-mono text-[11px] font-bold border border-slate-200/70 dark:border-slate-700/80 whitespace-nowrap shadow-2xs">
            <KeyRound className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-slate-300 shrink-0" />
            <span>PIN: <strong className="text-[#0B1A2D] dark:text-white font-black">{pinCode}</strong></span>
          </span>
        </div>
      </div>
    </div>
  );
};
