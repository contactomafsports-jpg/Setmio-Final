import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  KeyRound,
  Zap,
  CreditCard,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  User,
  Phone,
  Shield,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export interface ReservationDrawerParticipant {
  name: string;
  level?: number;
  avatar?: string;
  paid: boolean;
  amount?: number;
  paymentMethod?: string;
  statusText?: string;
}

export interface ReservationDrawerData {
  id: string;
  courtId?: string;
  courtName: string;
  courtType?: string;
  courtPhotoUrl?: string;
  sport?: string;
  creatorName: string;
  creatorPhone?: string;
  creatorMemberNum?: string;
  startTime: string;
  endTime?: string;
  timeSlot?: string;
  totalPrice?: number | string;
  paymentStatus?: 'paid' | 'pending' | 'partially_paid';
  status?: string;
  accessPin?: string;
  lightsStatus?: 'on' | 'off' | 'auto';
  doorStatus?: 'open' | 'locked' | 'auto';
  title?: string;
  category?: 'match' | 'academy' | 'private' | 'tournament';
  participants?: ReservationDrawerParticipant[];
  notes?: string;
}

interface ReservationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationDrawerData | null;
  onOpenTPV?: (reservation: ReservationDrawerData) => void;
  onReassignCourt?: (reservation: ReservationDrawerData) => void;
  onCancelReservation?: (reservationId: string) => void;
}

export const ReservationDrawer: React.FC<ReservationDrawerProps> = ({
  isOpen,
  onClose,
  reservation,
  onOpenTPV,
  onReassignCourt,
  onCancelReservation,
}) => {
  const { currentTenant, courts, setAdminTab, triggerDemoToast, t } = useApp();
  const [copiedPin, setCopiedPin] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);
  const [selectedNewCourt, setSelectedNewCourt] = useState(reservation?.courtName || '');

  if (!isOpen || !reservation) return null;

  const pinCode = reservation.accessPin || '4821#';
  const displayTime = reservation.timeSlot || `${reservation.startTime} - ${reservation.endTime || ''}`;
  const sportType = reservation.sport || 'Pádel Indoor WPT';

  // Default participants list if not provided
  const participants: ReservationDrawerParticipant[] = reservation.participants && reservation.participants.length > 0
    ? reservation.participants
    : [
        {
          name: reservation.creatorName,
          level: 4.15,
          paid: reservation.paymentStatus === 'paid',
          amount: 7.0,
          paymentMethod: reservation.paymentStatus === 'paid' ? 'Tarjeta Online' : 'Pendiente',
          statusText: reservation.paymentStatus === 'paid' ? 'Pagado 1/4' : 'Pendiente TPV',
        },
        {
          name: 'Mateo Varela',
          level: 4.0,
          paid: true,
          amount: 7.0,
          paymentMethod: 'Monedero Club',
          statusText: 'Pagado 2/4',
        },
        {
          name: 'Lucas Piñeiro',
          level: 3.85,
          paid: false,
          amount: 7.0,
          paymentMethod: 'TPV Barra',
          statusText: 'Pendiente TPV',
        },
        {
          name: 'David Castro',
          level: 4.1,
          paid: true,
          amount: 7.0,
          paymentMethod: 'Bizum',
          statusText: 'Pagado 4/4',
        },
      ];

  const handleCopyPin = () => {
    navigator.clipboard.writeText(pinCode.replace('#', ''));
    setCopiedPin(true);
    triggerDemoToast('PIN Copiado', `Código de apertura ${pinCode} copiado al portapapeles.`, 'info');
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleWhatsAppPin = () => {
    const phone = (reservation.creatorPhone || currentTenant.whatsappNumber || currentTenant.contactPhone || '').replace(/[^\d+]/g, '');
    const message = encodeURIComponent(
      `🎾 ¡Hola ${reservation.creatorName}! Te recordamos tu reserva en ${currentTenant.name}:\n` +
      `📅 Turno: ${displayTime}\n` +
      `🏟️ Pista: ${reservation.courtName}\n` +
      `🔑 Código PIN de acceso y luces: ${pinCode}\n` +
      `¡Buen partido!`
    );
    window.open(`https://wa.me/${phone.replace('+', '')}?text=${message}`, '_blank');
  };

  const handleGoToTPV = () => {
    onClose();
    if (onOpenTPV) {
      onOpenTPV(reservation);
    } else {
      setAdminTab('pos_cafe');
    }
  };

  const handleConfirmReassign = () => {
    triggerDemoToast('Pista Reasignada', `La reserva de ${reservation.creatorName} se ha trasladado a ${selectedNewCourt}. Luces y PIN reprogramados.`, 'success');
    setIsReassigning(false);
  };

  const handleCancel = () => {
    if (window.confirm(`¿Estás seguro de cancelar la reserva de ${reservation.creatorName} en ${reservation.courtName}?`)) {
      if (onCancelReservation) {
        onCancelReservation(reservation.id);
      }
      triggerDemoToast('Reserva Cancelada', `La reserva de ${reservation.creatorName} ha sido cancelada. Notificación enviada.`, 'info');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="flex-1 w-full" onClick={onClose} aria-hidden="true" />

      {/* Tactile Bottom Sheet Container */}
      <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 border-t sm:border-x sm:rounded-t-3xl border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto text-slate-900 dark:text-slate-100 animate-in slide-in-from-bottom duration-300">
        {/* Grab Handle for Touch Devices */}
        <div className="pt-1 pb-2 flex justify-center cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 transition" />
        </div>

        {/* 1. Encabezado con Foto/Icono de Pista, Horario y Deporte */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-md">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
                  {reservation.courtName}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {sportType}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{displayTime}</span>
                <span>·</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">
                  {reservation.title || 'Reserva Estándar'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
            title="Cerrar detalle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Ficha del Titular de la Reserva y Estado Domótico (Luces / PIN) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Titular */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Titular de la Reserva
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                {reservation.creatorMemberNum || 'Socio #SM-408'}
              </span>
            </div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-500" />
              <span>{reservation.creatorName}</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{reservation.creatorPhone || '+34 611 22 33 44'}</span>
            </div>
          </div>

          {/* Estado Domótico (Luces / PIN) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Automatización IoT
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                Luces Activas
              </span>
            </div>

            {/* PIN Card with Copy & WhatsApp Action */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                  PIN: <strong className="text-emerald-600 dark:text-emerald-400 text-sm tracking-wider">{pinCode}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopyPin}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Copiar código PIN"
                >
                  {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppPin}
                  className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
                  title="Reenviar PIN por WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Jugadores Confirmados (Grid con avatares, nivel y estado individual de pago) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px]">
              Jugadores Confirmados ({participants.filter(p => p.paid).length}/4 Pagados)
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              Total: {typeof reservation.totalPrice === 'number' ? `${reservation.totalPrice.toFixed(2)} €` : reservation.totalPrice || '28.00 €'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {participants.map((p, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 dark:text-white truncate text-xs">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Nivel {p.level?.toFixed(2) || '4.00'} · {p.paymentMethod || 'TPV'}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border ${
                    p.paid
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  }`}
                >
                  {p.statusText || (p.paid ? 'Pagado' : 'Pendiente TPV')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reasignar Pista Desplegable */}
        {isReassigning && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2.5 text-xs animate-in fade-in duration-150">
            <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Seleccionar Nueva Pista para el Turno {displayTime}</span>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedNewCourt}
                onChange={(e) => setSelectedNewCourt(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                {courts.map((court) => (
                  <option key={court.id} value={court.name}>
                    {court.name} ({court.courtType} · {court.hourlyRate}€/h)
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleConfirmReassign}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setIsReassigning(false)}
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* 4. Botones Operativos Claros */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Botón 1: Abrir en TPV / Cobrar */}
          <button
            type="button"
            onClick={handleGoToTPV}
            className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Abrir en TPV</span>
          </button>

          {/* Botón 2: Reasignar Pista */}
          <button
            type="button"
            onClick={() => setIsReassigning(!isReassigning)}
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
            <span>Reasignar Pista</span>
          </button>

          {/* Botón 3: Reenviar PIN por WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppPin}
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>PIN WhatsApp</span>
          </button>

          {/* Botón 4: Cancelar Reserva */}
          <button
            type="button"
            onClick={handleCancel}
            className="py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs transition border border-rose-200 dark:border-rose-800 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Cancelar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationDrawer;
