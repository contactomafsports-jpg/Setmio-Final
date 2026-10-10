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
  Trophy,
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
  matchScore?: string;
  isScoreHiddenInPublicProfile?: boolean;
}

interface ReservationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationDrawerData | null;
  onOpenTPV?: (reservation: ReservationDrawerData) => void;
  onReassignCourt?: (reservation: ReservationDrawerData) => void;
  onCancelReservation?: (reservationId: string) => void;
  onOpenPlayerProfile?: (playerName: string) => void;
}

export const ReservationDrawer: React.FC<ReservationDrawerProps> = ({
  isOpen,
  onClose,
  reservation,
  onOpenTPV,
  onReassignCourt,
  onCancelReservation,
  onOpenPlayerProfile,
}) => {
  const { currentTenant, courts, setAdminTab, triggerDemoToast, setPosPendingCharge, navigateToPlayerProfile, updateBooking, language, t } = useApp();
  const [copiedPin, setCopiedPin] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);
  const [tpvChoiceModal, setTpvChoiceModal] = useState(false);
  const [selectedNewCourt, setSelectedNewCourt] = useState(reservation?.courtName || '');
  const [matchScoreInput, setMatchScoreInput] = useState(reservation?.matchScore || '');
  const [isScoreHidden, setIsScoreHidden] = useState(reservation?.isScoreHiddenInPublicProfile || false);
  const [isScoreSaved, setIsScoreSaved] = useState(false);

  const handleSaveScore = () => {
    if (!reservation) return;
    updateBooking(reservation.id, {
      matchScore: matchScoreInput,
      isScoreHiddenInPublicProfile: isScoreHidden,
    });
    setIsScoreSaved(true);
    triggerDemoToast('Resultado Guardado', `Marcador "${matchScoreInput}" registrado con éxito.`, 'success');
    setTimeout(() => setIsScoreSaved(false), 2000);
  };

  if (!isOpen || !reservation) return null;

  const pinCode = reservation.accessPin || '4821#';
  const displayTime = reservation.timeSlot || `${reservation.startTime} - ${reservation.endTime || ''}`;
  const sportType = reservation.sport || 'Pádel Indoor WPT';

  // Explicit reservation date calculation
  const rawDateString = reservation.startTime.includes('T')
    ? reservation.startTime.split('T')[0]
    : reservation.startTime.split(' ')[0] || new Date().toISOString().split('T')[0];

  const parsedDate = new Date(reservation.startTime.includes('T') ? reservation.startTime : `${rawDateString}T12:00:00`);
  const formattedExplicitDate = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : rawDateString;

  // Has the reservation already elapsed or is it pending/upcoming?
  const now = new Date();
  const endDateTime = reservation.endTime
    ? new Date(reservation.endTime.includes('T') ? reservation.endTime : `${rawDateString}T${reservation.endTime}:00`)
    : parsedDate;

  const isPast = !isNaN(endDateTime.getTime()) && endDateTime < now;

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
    // If it's a split payment or has multiple participants with pending payments, let receptionist choose
    const hasUnpaid = participants.some((p) => !p.paid);
    if (reservation.category === 'match' || reservation.paymentStatus === 'partially_paid' || (hasUnpaid && participants.length > 1)) {
      setTpvChoiceModal(true);
      return;
    }

    // Direct full court payment
    const totalAmount = typeof reservation.totalPrice === 'number' ? reservation.totalPrice : parseFloat(String(reservation.totalPrice)) || 28.0;
    setPosPendingCharge({
      id: reservation.id,
      concept: `Reserva ${reservation.courtName} — Pago Total`,
      amount: totalAmount,
      reservationId: reservation.id,
      courtName: reservation.courtName,
      type: 'reservation_full',
    });
    triggerDemoToast('Cargado en TPV', `Reserva completa de ${reservation.courtName} (${totalAmount.toFixed(2)}€) precargada en la caja.`, 'success');
    onClose();
    setAdminTab('pos_cafe');
  };

  const chargeFullInTPV = () => {
    const totalAmount = typeof reservation.totalPrice === 'number' ? reservation.totalPrice : parseFloat(String(reservation.totalPrice)) || 28.0;
    setPosPendingCharge({
      id: reservation.id,
      concept: `Reserva ${reservation.courtName} — Pago Total`,
      amount: totalAmount,
      reservationId: reservation.id,
      courtName: reservation.courtName,
      type: 'reservation_full',
    });
    setTpvChoiceModal(false);
    triggerDemoToast('Cargado en TPV', `Pago completo (${totalAmount.toFixed(2)}€) precargado en la caja TPV.`, 'success');
    onClose();
    setAdminTab('pos_cafe');
  };

  const chargeParticipantInTPV = (p: ReservationDrawerParticipant, index: number) => {
    const shareAmount = p.amount || 7.0;
    setPosPendingCharge({
      id: `${reservation.id}-${index}`,
      concept: `Reserva ${reservation.courtName} — Cuota ${p.name} (1/4)`,
      amount: shareAmount,
      reservationId: reservation.id,
      participantIndex: index,
      playerName: p.name,
      courtName: reservation.courtName,
      type: 'reservation_split',
    });
    setTpvChoiceModal(false);
    triggerDemoToast('Cargado en TPV', `Cuota de ${p.name} (${shareAmount.toFixed(2)}€) precargada en caja TPV.`, 'success');
    onClose();
    setAdminTab('pos_cafe');
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

  const handlePlayerClick = (playerName: string) => {
    onClose();
    if (onOpenPlayerProfile) {
      onOpenPlayerProfile(playerName);
    } else {
      navigateToPlayerProfile(playerName, 'agenda');
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
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
                  {reservation.courtName}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {sportType}
                </span>

                {/* Badge Explícito: Transcurrida vs Pendiente */}
                {isPast ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-slate-400" />
                    <span>{t('booking.status_past', 'Reserva Pasada / Efectuada')}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-2xs">
                    <Clock className="w-3 h-3 text-emerald-500 animate-pulse" />
                    <span>{t('booking.status_upcoming', 'Reserva Pendiente / Próxima')}</span>
                  </span>
                )}
              </div>

              {/* Fecha Explícita de la Reserva */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 capitalize">
                <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{formattedExplicitDate}</span>
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
          {/* Titular (Clicable -> Ficha de Jugador) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => handlePlayerClick(reservation.creatorName)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handlePlayerClick(reservation.creatorName);
            }}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/70 hover:bg-emerald-50/30 dark:hover:bg-slate-800 transition cursor-pointer group space-y-1.5 shadow-xs"
            title={`Ver ficha completa de ${reservation.creatorName}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition flex items-center gap-1">
                <span>Titular de la Reserva</span>
                <span className="text-emerald-500 font-normal">↗</span>
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                {reservation.creatorMemberNum || 'Socio #SM-408'}
              </span>
            </div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1.5 transition">
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

        {/* 3. Jugadores Confirmados (Grid con avatares clicables a ficha) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px]">
              Jugadores Confirmados ({participants.filter(p => p.paid).length}/4 Pagados)
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap shrink-0">
              Total: {typeof reservation.totalPrice === 'number' ? `${reservation.totalPrice.toFixed(2)} €` : reservation.totalPrice || '28.00 €'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {participants.map((p, idx) => (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                onClick={() => handlePlayerClick(p.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handlePlayerClick(p.name);
                }}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/70 hover:bg-emerald-50/30 dark:hover:bg-slate-800 transition flex items-center justify-between gap-2 text-xs cursor-pointer group shadow-xs"
                title={`Ver ficha completa de ${p.name}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 dark:text-white truncate text-xs group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition flex items-center gap-1">
                      <span>{p.name}</span>
                      <span className="text-[10px] text-emerald-500 font-normal opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
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

        {/* 3b. Registro de Resultado del Partido y Privacidad */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Resultado del Partido & Visibilidad</span>
            </span>
            {isScoreSaved && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Guardado</span>
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              placeholder="Ej. 6-4, 3-6, 7-6"
              value={matchScoreInput}
              onChange={(e) => setMatchScoreInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={handleSaveScore}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition active:scale-95 shrink-0 cursor-pointer"
            >
              Guardar Marcador
            </button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
            <input
              type="checkbox"
              checked={isScoreHidden}
              onChange={(e) => setIsScoreHidden(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Ocultar resultado en el perfil público del jugador</span>
          </label>
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

        {/* Modal de selección TPV (Pago Total vs Pago Individual de Jugador) */}
        {tpvChoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Cobrar Reserva en TPV
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setTpvChoiceModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                Selecciona si vas a cobrar la pista completa o únicamente la cuota individual del jugador que está en caja:
              </p>

              {/* Opción 1: Pago Total */}
              <button
                type="button"
                onClick={chargeFullInTPV}
                className="w-full p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-500/30 text-left transition flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-xs text-emerald-800 dark:text-emerald-300">
                    Pago Total de la Pista (100%)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Carga el importe íntegro de la pista en el ticket
                  </div>
                </div>
                <div className="text-base font-black font-mono text-emerald-700 dark:text-emerald-400 whitespace-nowrap shrink-0">
                  {typeof reservation.totalPrice === 'number' ? `${reservation.totalPrice.toFixed(2)} €` : reservation.totalPrice}
                </div>
              </button>

              {/* Opción 2: Pago Dividido por Jugador */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  O cobrar cuota individual (Pago dividido):
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {participants.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => chargeParticipantInTPV(p, idx)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between transition text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center">
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                          <div className="text-[10px] text-slate-500">
                            {p.paid ? 'Ya pagado (re-imprimir)' : 'Pendiente de cobro en caja'}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {(p.amount || 7.0).toFixed(2)} €
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setTpvChoiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationDrawer;
