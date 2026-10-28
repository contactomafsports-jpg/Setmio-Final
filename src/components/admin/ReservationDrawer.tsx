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
  Smile,
  Edit3,
  Trash2,
  Building2,
  Lock,
  DollarSign,
  Info,
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
  venueId?: string;
  venueName?: string;
  venueShortName?: string;
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
  category?: 'match' | 'academy' | 'private' | 'tournament' | 'maintenance';
  mode?: 'friendly' | 'competitive';
  gender?: 'male' | 'female' | 'mixed';
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
  userRole?: 'admin' | 'player';
}

export const ReservationDrawer: React.FC<ReservationDrawerProps> = ({
  isOpen,
  onClose,
  reservation,
  onOpenTPV,
  onReassignCourt,
  onCancelReservation,
  onOpenPlayerProfile,
  userRole,
}) => {
  const {
    currentUser,
    currentView,
    currentTenant,
    courts,
    venues,
    setAdminTab,
    triggerDemoToast,
    setPosPendingCharge,
    navigateToPlayerProfile,
    updateBooking,
    deleteBooking,
    isMultiVenue,
    language,
    t,
  } = useApp();

  const [copiedPin, setCopiedPin] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);
  const [tpvChoiceModal, setTpvChoiceModal] = useState(false);
  const [selectedNewCourt, setSelectedNewCourt] = useState(reservation?.courtName || '');
  const [matchScoreInput, setMatchScoreInput] = useState(reservation?.matchScore || '');
  const [isScoreHidden, setIsScoreHidden] = useState(reservation?.isScoreHiddenInPublicProfile || false);
  const [isScoreSaved, setIsScoreSaved] = useState(false);

  // Cancellation policies confirmation modal state
  const [isCancelConfirmModalOpen, setIsCancelConfirmModalOpen] = useState(false);

  // Player edit spot modal state
  const [isPlayerEditModalOpen, setIsPlayerEditModalOpen] = useState(false);
  const [playerSpotNotes, setPlayerSpotNotes] = useState('');

  // Admin edit reservation modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCourtName, setEditCourtName] = useState(reservation?.courtName || '');
  const [editPrice, setEditPrice] = useState(String(reservation?.totalPrice ?? 28));
  const [editNotes, setEditNotes] = useState(reservation?.notes || '');
  const [editStatus, setEditStatus] = useState(reservation?.status || 'confirmed');
  const [editMode, setEditMode] = useState<'friendly' | 'competitive'>(reservation?.mode || 'competitive');
  const [editGender, setEditGender] = useState<'male' | 'female' | 'mixed'>(reservation?.gender || 'mixed');
  const [editDate, setEditDate] = useState(() => {
    if (!reservation?.startTime) return '2026-10-10';
    return reservation.startTime.includes('T') ? reservation.startTime.split('T')[0] : reservation.startTime.slice(0, 10);
  });
  const [editStartTime, setEditStartTime] = useState(() => {
    if (!reservation?.startTime) return '17:00';
    return reservation.startTime.includes('T') ? reservation.startTime.split('T')[1].slice(0, 5) : '17:00';
  });

  const isPlayerRole =
    userRole === 'player' ||
    currentView === 'player' ||
    currentUser.role === 'PLAYER' ||
    currentUser.role === 'PROFESSIONAL_PLAYER';
  const isAdmin =
    userRole === 'admin' ||
    (!isPlayerRole &&
      (currentUser.role === 'TENANT_ADMIN' ||
        currentUser.role === 'TENANT_OWNER' ||
        currentUser.role === 'SUPERADMIN' ||
        currentUser.role === 'RECEPTION' ||
        currentUser.role === 'STORE_MANAGER' ||
        currentUser.role === 'ACADEMY_MANAGER'));

  const handleOpenEditModal = () => {
    if (!reservation) return;
    setEditCourtName(reservation.courtName);
    setEditPrice(String(reservation.totalPrice ?? 28));
    setEditNotes(reservation.notes || '');
    setEditStatus(reservation.status || 'confirmed');
    setEditMode(reservation.mode || 'competitive');
    setEditGender(reservation.gender || 'mixed');
    const d = reservation.startTime.includes('T') ? reservation.startTime.split('T')[0] : reservation.startTime.slice(0, 10);
    const time = reservation.startTime.includes('T') ? reservation.startTime.split('T')[1].slice(0, 5) : '17:00';
    setEditDate(d);
    setEditStartTime(time);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation) return;
    const priceNum = parseFloat(editPrice) || 0;
    const targetCourt = courts.find((c) => c.name === editCourtName);
    const startISO = `${editDate}T${editStartTime}:00`;

    updateBooking(reservation.id, {
      courtId: targetCourt?.id || reservation.courtId || 'court-1',
      courtName: editCourtName,
      startTime: startISO,
      totalPrice: priceNum,
      mode: editMode,
      gender: editGender,
      notes: editNotes,
      status: editStatus as any,
    });
    triggerDemoToast('Reserva Modificada', `Cambios guardados con éxito en la reserva de ${reservation.creatorName}.`, 'success');
    setIsEditModalOpen(false);
    onClose();
  };

  const handleSavePlayerSpot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation) return;
    updateBooking(reservation.id, {
      notes: playerSpotNotes ? `[Jugador]: ${playerSpotNotes}` : reservation.notes,
    });
    triggerDemoToast('Plaza Actualizada', 'Tus preferencias de plaza han sido actualizadas.', 'success');
    setIsPlayerEditModalOpen(false);
  };

  const handleDelete = () => {
    if (!reservation) return;
    if (window.confirm(`¿Estás seguro de eliminar permanentemente la reserva de ${reservation.creatorName} en ${reservation.courtName}? Esta acción liberará la pista en la agenda.`)) {
      deleteBooking(reservation.id);
      onClose();
    }
  };

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
  const sportType = reservation.sport || 'Pádel Indoor WPT';

  // 1. Date calculation: single date with explicit day of the week and full date
  const formatFullExplicitDate = (dateStr: string) => {
    try {
      const rawDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.split(' ')[0];
      const [y, m, d] = rawDate.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d, 12, 0, 0);
      const weekday = dateObj.toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', { weekday: 'long' });
      const capWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
      const month = dateObj.toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', { month: 'long' });
      const capMonth = month.charAt(0).toUpperCase() + month.slice(1);
      return `${capWeekday}, ${d} de ${capMonth}, ${y}`;
    } catch {
      return dateStr;
    }
  };

  // Clean time slot without any duplicated dates
  const startClean = reservation.startTime.includes('T')
    ? reservation.startTime.split('T')[1].slice(0, 5)
    : reservation.startTime.slice(0, 5);
  const endClean = reservation.endTime?.includes('T')
    ? reservation.endTime.split('T')[1].slice(0, 5)
    : (reservation.endTime?.slice(0, 5) || '');
  const cleanTimeSlot = endClean ? `${startClean} - ${endClean}` : startClean;

  const formattedExplicitDate = formatFullExplicitDate(reservation.startTime);

  // Has the reservation already elapsed or is it pending/upcoming?
  const now = new Date();
  const rawDateString = reservation.startTime.includes('T')
    ? reservation.startTime.split('T')[0]
    : reservation.startTime.split(' ')[0] || new Date().toISOString().split('T')[0];
  const parsedDate = new Date(reservation.startTime.includes('T') ? reservation.startTime : `${rawDateString}T12:00:00`);
  const endDateTime = reservation.endTime
    ? new Date(reservation.endTime.includes('T') ? reservation.endTime : `${rawDateString}T${reservation.endTime}:00`)
    : parsedDate;

  const isPast = !isNaN(endDateTime.getTime()) && endDateTime < now;

  // Pricing calculations
  const totalCourtPrice = typeof reservation.totalPrice === 'number'
    ? reservation.totalPrice
    : parseFloat(String(reservation.totalPrice)) || 28.0;

  // Default participants list
  const participants: ReservationDrawerParticipant[] = reservation.participants && reservation.participants.length > 0
    ? reservation.participants
    : [
        {
          name: reservation.creatorName,
          level: 4.15,
          paid: reservation.paymentStatus === 'paid',
          amount: totalCourtPrice / 4,
          paymentMethod: reservation.paymentStatus === 'paid' ? 'Tarjeta Online' : 'Pendiente',
          statusText: reservation.paymentStatus === 'paid' ? 'Pagado 1/4' : 'Pendiente TPV',
        },
        {
          name: 'Mateo Varela',
          level: 4.0,
          paid: true,
          amount: totalCourtPrice / 4,
          paymentMethod: 'Monedero Club',
          statusText: 'Pagado 2/4',
        },
        {
          name: 'Lucas Piñeiro',
          level: 3.85,
          paid: false,
          amount: totalCourtPrice / 4,
          paymentMethod: 'TPV Barra',
          statusText: 'Pendiente TPV',
        },
        {
          name: 'David Castro',
          level: 4.1,
          paid: true,
          amount: totalCourtPrice / 4,
          paymentMethod: 'Bizum',
          statusText: 'Pagado 4/4',
        },
      ];

  const pricePerPlayer = participants[0]?.amount ?? (totalCourtPrice / 4);

  // Character of the match: Friendly vs Competitive
  const matchMode: 'friendly' | 'competitive' = reservation.mode || 'competitive';
  // Gender of the match: Male, Female, Mixed
  const matchGender: 'male' | 'female' | 'mixed' = reservation.gender || 'mixed';
  // Venue / Club
  const venueDisplayName = reservation.venueName || (
    reservation.venueId ? venues.find((v) => v.id === reservation.venueId)?.name : null
  ) || currentTenant.name || 'Centro de Pádel San Mateo';

  // Club Cancellation Policies evaluation
  const cancellationWindowHours = currentTenant.settings?.policies?.cancellationWindowHours ?? currentTenant.settings?.cancellationWindowHours ?? 12;
  const cancellationRefundType = currentTenant.settings?.policies?.cancellationRefundType ?? 'partial';
  const cancellationPenaltyPercent = currentTenant.settings?.policies?.cancellationPenaltyPercent ?? 50;

  const startTimestamp = new Date(reservation.startTime.includes('T') ? reservation.startTime : `${rawDateString}T${startClean}:00`).getTime();
  const nowTimestamp = Date.now();
  const hoursUntilMatch = Math.max(0, (startTimestamp - nowTimestamp) / (1000 * 60 * 60));

  const isFreeCancellationWindow = cancellationRefundType !== 'no_refund' && (cancellationRefundType === 'full' || hoursUntilMatch >= cancellationWindowHours);
  
  // Refund amounts calculation based on policy
  const baseTargetAmount = isPlayerRole ? pricePerPlayer : totalCourtPrice;
  let retentionAmount = 0;
  let refundAmount = baseTargetAmount;

  if (cancellationRefundType === 'no_refund') {
    retentionAmount = baseTargetAmount;
    refundAmount = 0;
  } else if (!isFreeCancellationWindow) {
    retentionAmount = (baseTargetAmount * cancellationPenaltyPercent) / 100;
    refundAmount = baseTargetAmount - retentionAmount;
  }

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
      `📅 Fecha: ${formattedExplicitDate}\n` +
      `⏰ Horario: ${cleanTimeSlot}\n` +
      `🏟️ Pista: ${reservation.courtName} (${venueDisplayName})\n` +
      `🔑 Código PIN de acceso y luces: ${pinCode}\n` +
      `¡Buen partido!`
    );
    window.open(`https://wa.me/${phone.replace('+', '')}?text=${message}`, '_blank');
  };

  const handleGoToTPV = () => {
    const hasUnpaid = participants.some((p) => !p.paid);
    if (reservation.category === 'match' || reservation.paymentStatus === 'partially_paid' || (hasUnpaid && participants.length > 1)) {
      setTpvChoiceModal(true);
      return;
    }

    setPosPendingCharge({
      id: reservation.id,
      concept: `Reserva ${reservation.courtName} — Pago Total`,
      amount: totalCourtPrice,
      reservationId: reservation.id,
      courtName: reservation.courtName,
      type: 'reservation_full',
    });
    triggerDemoToast('Cargado en TPV', `Reserva completa de ${reservation.courtName} (${totalCourtPrice.toFixed(2)}€) precargada en la caja.`, 'success');
    onClose();
    setAdminTab('pos_cafe');
  };

  const chargeFullInTPV = () => {
    setPosPendingCharge({
      id: reservation.id,
      concept: `Reserva ${reservation.courtName} — Pago Total`,
      amount: totalCourtPrice,
      reservationId: reservation.id,
      courtName: reservation.courtName,
      type: 'reservation_full',
    });
    setTpvChoiceModal(false);
    triggerDemoToast('Cargado en TPV', `Pago completo (${totalCourtPrice.toFixed(2)}€) precargado en la caja TPV.`, 'success');
    onClose();
    setAdminTab('pos_cafe');
  };

  const chargeParticipantInTPV = (p: ReservationDrawerParticipant, index: number) => {
    const shareAmount = p.amount || pricePerPlayer;
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

  const handleExecuteCancellation = () => {
    if (onCancelReservation) {
      onCancelReservation(reservation.id);
    }
    const message = isFreeCancellationWindow
      ? `Cancelación sin coste. Reembolso de ${refundAmount.toFixed(2)}€ ingresado en el monedero.`
      : cancellationRefundType === 'no_refund'
      ? 'Reserva cancelada según la política de no reembolsos del club.'
      : `Cancelación efectuada con retención de ${retentionAmount.toFixed(2)}€ (${cancellationPenaltyPercent}%). ${refundAmount.toFixed(2)}€ devueltos.`;

    triggerDemoToast('Reserva Cancelada', message, isFreeCancellationWindow ? 'success' : 'info');
    setIsCancelConfirmModalOpen(false);
    onClose();
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

        {/* 1. ENCABEZADO CON FECHA ÚNICA COMPLETA, PISTA, DEPORTE Y SEDE */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-md">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="min-w-0 space-y-1">
              {/* Título de Pista y Deporte */}
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

              {/* FECHA EXPLÍCITA ÚNICA: Día de la semana + Fecha Completa (Sin duplicidades) */}
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-slate-100 capitalize">
                <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{formattedExplicitDate}</span>
                <span className="text-slate-300 dark:text-slate-600 font-normal">·</span>
                <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{cleanTimeSlot}</span>
              </div>

              {/* SEDE / CLUB DONDE SE DISPUTA */}
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Sede: <strong>{venueDisplayName}</strong></span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 cursor-pointer"
            title="Cerrar detalle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. CARÁCTER (AMISTOSO VS COMPETITIVO) Y GÉNERO DEL PARTIDO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {/* Carácter: Competitivo vs Amistoso */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Carácter de la Reserva
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {matchMode === 'competitive' ? 'Competitivo Oficial' : 'Partido Amistoso'}
              </span>
            </div>
            {matchMode === 'competitive' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Trophy className="w-3 h-3 text-indigo-500" />
                <span>Afecta Nivel / ELO</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Smile className="w-3 h-3 text-emerald-500" />
                <span>Sin alteración de ELO</span>
              </span>
            )}
          </div>

          {/* Género del Partido */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Categoría / Género
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white capitalize">
                {matchGender === 'male' ? 'Masculino' : matchGender === 'female' ? 'Femenino' : 'Mixto'}
              </span>
            </div>
            <span
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                matchGender === 'male'
                  ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : matchGender === 'female'
                  ? 'bg-fuchsia-50 dark:bg-fuchsia-950/80 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800'
                  : 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
              }`}
            >
              Modalidad {matchGender === 'male' ? 'Masculina' : matchGender === 'female' ? 'Femenina' : 'Mixta'}
            </span>
          </div>
        </div>

        {/* 3. DESGLOSE DE PRECIOS SEGÚN ROL:
            - Cliente / Jugador: Solo ve su precio individual por jugador.
            - Administrador / Gerente: Ve el precio total de la pista + desglose. */}
        {isPlayerRole ? (
          /* VISTA JUGADOR / CLIENTE: Solo cuota individual */
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
                Tu Cuota Individual
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Tarifa individual por jugador (1/4 del turno de pista)
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {pricePerPlayer.toFixed(2)} €
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">IVA incluido</span>
            </div>
          </div>
        ) : (
          /* VISTA ADMINISTRACIÓN / GERENTE: Precio total de la pista + desglose individual */
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Tarifa de Pista (Vista Administración)
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Cuota individual por jugador: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{pricePerPlayer.toFixed(2)} €</strong> (4 jugadores)
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Precio Total Pista</div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {totalCourtPrice.toFixed(2)} €
              </div>
            </div>
          </div>
        )}

        {/* 4. BLOQUEO SI YA TRANSCURRIÓ */}
        {isPast && (
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <Lock className="w-5 h-5 text-slate-400 shrink-0" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block">Reserva ya transcurrida</strong>
              <span>
                {isAdmin
                  ? 'Esta reserva ya finalizó. Como Administrador dispones de permisos especiales para corregir datos o registrar el marcador.'
                  : 'Esta reserva ya ha finalizado. Ha quedado bloqueada para edición y cancelaciones.'}
              </span>
            </div>
          </div>
        )}

        {/* 5. TITULAR Y AUTOMATIZACIÓN DOMÓTICA (PIN / LUCES) */}
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
                <KeyRound className="w-4 h-4 text-[#0B1A2D] dark:text-slate-300" />
                <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                  PIN: <strong className="text-[#0B1A2D] dark:text-white text-sm tracking-wider">{pinCode}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopyPin}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Copiar código PIN"
                >
                  {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppPin}
                  className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition cursor-pointer"
                  title="Reenviar PIN por WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6. JUGADORES CONFIRMADOS */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px]">
              Jugadores Confirmados ({participants.filter((p) => p.paid).length}/4 Pagados)
            </span>
            {!isPlayerRole && (
              <span className="font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap shrink-0">
                Total Pista: {totalCourtPrice.toFixed(2)} €
              </span>
            )}
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

                <div className="text-right shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold block border ${
                      p.paid
                        ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] border-[#B7F229]/50'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700'
                    }`}
                  >
                    {p.statusText || (p.paid ? 'Pagado' : 'Pendiente TPV')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {(p.amount ?? pricePerPlayer).toFixed(2)} €
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. REGISTRO DE RESULTADO (ADMIN / POST-PARTIDO) */}
        {(!isPlayerRole || isPast) && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Resultado del Partido {matchMode === 'competitive' && '(Actualiza ELO)'}</span>
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
        )}

        {/* 8. BOTONERA OPERATIVA DIFERENCIADA POR ROL */}
        {isPlayerRole ? (
          /* VISTA JUGADOR: Si está pendiente (!isPast), puede editar plaza o cancelar plaza. Eliminar NO disponible */
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            {!isPast ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsPlayerEditModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Editar mi plaza</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCancelConfirmModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-xs transition border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cancelar mi plaza</span>
                </button>
              </>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                Reserva finalizada (Sin acciones disponibles)
              </span>
            )}
          </div>
        ) : (
          /* VISTA ADMINISTRADOR: Acciones completas según especificación */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Abrir en TPV */}
            <button
              type="button"
              onClick={handleGoToTPV}
              className="py-2.5 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Abrir en TPV</span>
            </button>

            {/* Editar (Admin siempre habilitado, incluso en reservas pasadas) */}
            <button
              type="button"
              onClick={handleOpenEditModal}
              className="py-2.5 px-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">Editar</span>
            </button>

            {/* Reasignar Pista */}
            <button
              type="button"
              onClick={() => setIsReassigning(!isReassigning)}
              className="py-2.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">Reasignar</span>
            </button>

            {/* Reenviar PIN por WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsAppPin}
              className="py-2.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>

            {/* Cancelar Reserva (Evaluando políticas del club) */}
            <button
              type="button"
              onClick={() => setIsCancelConfirmModalOpen(true)}
              className="py-2.5 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-xs transition border border-amber-200 dark:border-amber-800 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">Cancelar</span>
            </button>

            {/* Eliminar Reserva (Solo Admin) */}
            <button
              type="button"
              onClick={handleDelete}
              className="py-2.5 px-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs transition border border-rose-200 dark:border-rose-800 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate">Eliminar</span>
            </button>
          </div>
        )}

        {/* MODAL INFORMATIVO DE CANCELACIÓN SEGÚN POLÍTICAS DEL CLUB */}
        {isCancelConfirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Confirmar Cancelación
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Evaluación de políticas de cancelación del club
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCancelConfirmModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Información de la reserva */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">
                  {reservation.courtName} · {venueDisplayName}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  {formattedExplicitDate} a las {cleanTimeSlot}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Importe sujeto a política: <strong className="font-mono text-slate-900 dark:text-white">{baseTargetAmount.toFixed(2)} €</strong>
                </div>
              </div>

              {/* Evaluación dinámica de la política configurada */}
              {cancellationRefundType === 'no_refund' ? (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Política Estricta: Sin Devolución</span>
                  </div>
                  <p className="text-[11px]">
                    El club tiene configurada una política sin reembolsos para cancelaciones. Si confirmas, se anulará la reserva y se liberará la pista, pero no se reembolsará ningún importe.
                  </p>
                </div>
              ) : isFreeCancellationWindow ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Cancelación 100% Gratuita</span>
                  </div>
                  <p className="text-[11px]">
                    Faltan {hoursUntilMatch.toFixed(1)} horas para el inicio (antelación mínima exigida: {cancellationWindowHours}h). Tienes derecho a reembolso íntegro.
                  </p>
                  <div className="font-bold font-mono text-xs pt-1 text-emerald-600 dark:text-emerald-400">
                    Se devolverán: {refundAmount.toFixed(2)} € al monedero de socio.
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Cancelación Fuera de Plazo ({cancellationPenaltyPercent}% retención)</span>
                  </div>
                  <p className="text-[11px]">
                    Quedan {hoursUntilMatch.toFixed(1)} horas para el turno (límite para cancelación gratuita: {cancellationWindowHours}h). Aplica la penalización configurada por el club.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                    <div>Retención penalización: <strong className="text-rose-600 dark:text-rose-400">{retentionAmount.toFixed(2)} €</strong></div>
                    <div>Reembolso monedero: <strong className="text-emerald-600 dark:text-emerald-400">{refundAmount.toFixed(2)} €</strong></div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCancelConfirmModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition"
                >
                  No cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExecuteCancellation}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm cursor-pointer transition active:scale-95"
                >
                  Confirmar Cancelación
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL JUGADOR: EDITAR MI PLAZA */}
        {isPlayerEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Editar Datos de mi Plaza
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlayerEditModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePlayerSpot} className="space-y-3.5 text-xs">
                <p className="text-slate-500 dark:text-slate-400">
                  Puedes registrar notas adicionales para tu plaza (ej. preferencia de posición, aviso a los demás jugadores o datos de contacto).
                </p>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Observaciones / Preferencias
                  </label>
                  <textarea
                    rows={3}
                    value={playerSpotNotes}
                    onChange={(e) => setPlayerSpotNotes(e.target.value)}
                    placeholder="Ej. Juego al revés, llegaré 10 min antes..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlayerEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL ADMINISTRADOR: EDICIÓN COMPLETA DE TODOS LOS DATOS */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Edición Completa de Reserva (Admin)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
                {/* Pista */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Pista</label>
                  <select
                    value={editCourtName}
                    onChange={(e) => setEditCourtName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {courts.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.courtType} · {c.hourlyRate}€/h)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fecha y Hora */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Fecha</label>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Hora Inicio</label>
                    <input
                      type="time"
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Carácter y Género */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Carácter</label>
                    <select
                      value={editMode}
                      onChange={(e) => setEditMode(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="competitive">Competitivo (Afecta ELO)</option>
                      <option value="friendly">Amistoso (Sin efecto en ELO)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Género</label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                      <option value="mixed">Mixto</option>
                    </select>
                  </div>
                </div>

                {/* Importe y Estado */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Importe Total Pista (€)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Estado Operativo</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="confirmed">Confirmada</option>
                      <option value="pending">Pendiente</option>
                      <option value="canceled">Cancelada</option>
                    </select>
                  </div>
                </div>

                {/* Notas Internas */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Notas Internas</label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Observaciones de recepción..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
