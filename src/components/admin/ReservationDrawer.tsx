import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  MoreVertical,
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
  const [showMoreActions, setShowMoreActions] = useState(false);

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

  const drawerContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 dark:bg-black/85 backdrop-blur-md p-3 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-4 lg:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Expediente de Consulta y Auditoría de Nivel 3 (Centrado seguro con scroll interno) */}
      <div
        className="w-full sm:max-w-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] bg-white dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Barra táctil indicadora en móvil */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* 1. CABECERA MINIMALISTA FIJA (NIVEL 3 - MÁXIMO ESPACIO ÚTIL) */}
        <div className="px-5 sm:px-6 py-3 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between bg-white dark:bg-[#071220] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-3">
            <h2 className="text-base sm:text-lg font-black text-[#0B1A2D] dark:text-white truncate">
              {reservation.courtName}
            </h2>
            <span className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 shrink-0">
              #{reservation.id.slice(-6).toUpperCase()}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0E2239] transition cursor-pointer shrink-0"
            title="Cerrar expediente"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. EXPEDIENTE TIPOGRÁFICO LIMPIO (CUERPO DEL EXPEDIENTE) */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-4 text-xs flex-1">
          {/* Ficha Rápida del Turno: Sede, Estado, Fecha, Horario, Modalidad y Deporte */}
          <div className="pb-3 border-b border-slate-100 dark:border-[#1A314D] space-y-1.5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 flex-wrap">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-bold text-[#0B1A2D] dark:text-white capitalize">{formattedExplicitDate}</span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="font-mono font-bold text-[#0B1A2D] dark:text-white">{cleanTimeSlot}</span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-slate-500 dark:text-slate-400">{sportType}</span>
              </div>

              <div className="flex items-center gap-2">
                {isPast ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('booking.status_past', 'Efectuada')}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B1A2D] dark:text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('booking.status_upcoming', 'Próxima')}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
              {venueDisplayName && (
                <>
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{venueDisplayName}</span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                </>
              )}
              <span className="capitalize">{matchGender === 'male' ? 'Masculino' : matchGender === 'female' ? 'Femenino' : 'Mixto'}</span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {matchMode === 'competitive' ? 'Competitivo (ELO)' : 'Amistoso'}
              </span>
            </div>
          </div>

          {/* Bloque Financiero Tipográfico (Estilo Stripe / Linear Invoice) */}
          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#0E2239]/40 border border-slate-200/80 dark:border-[#1A314D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Estado Financiero de la Pista
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                  reservation.paymentStatus === 'paid'
                    ? 'bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#1A314D]'
                    : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900/60'
                }`}>
                  {reservation.paymentStatus === 'paid' ? 'Abonado Íntegramente' : 'Pendiente de Cobro'}
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Cuota 1/4: <strong className="font-mono text-[#0B1A2D] dark:text-white">{pricePerPlayer.toFixed(2)} €</strong>
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Turno</span>
              <span className="text-2xl font-black font-mono text-[#0B1A2D] dark:text-white">
                {totalCourtPrice.toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Titular & Domótica IoT en 2 columnas con tipografía limpia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Titular */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => handlePlayerClick(reservation.creatorName)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handlePlayerClick(reservation.creatorName);
              }}
              className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-[#1A314D] hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer group space-y-1 bg-white dark:bg-[#071220]"
              title={`Ver ficha de ${reservation.creatorName}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#0B1A2D] dark:group-hover:text-white transition flex items-center gap-1">
                  <span>Titular de la Reserva</span>
                  <span className="text-slate-400 font-normal">↗</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#0E2239] text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-[#1A314D]">
                  {reservation.creatorMemberNum || 'Socio #SM-408'}
                </span>
              </div>
              <div className="font-black text-sm text-[#0B1A2D] dark:text-white flex items-center gap-1.5 transition">
                <User className="w-4 h-4 text-slate-500" />
                <span>{reservation.creatorName}</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3" />
                <span>{reservation.creatorPhone || '+34 611 22 33 44'}</span>
              </div>
            </div>

            {/* Acceso IoT & Luces */}
            <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between bg-white dark:bg-[#071220]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Automatización IoT
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-black text-[#0B1A2D] dark:text-white tracking-wider">
                    PIN: {pinCode}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Luces OK
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopyPin}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-[#0E2239] hover:bg-slate-100 dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  title="Copiar PIN"
                >
                  {copiedPin ? <Check className="w-3.5 h-3.5 text-slate-700 dark:text-white" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppPin}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-[#0E2239] hover:bg-slate-100 dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  title="Enviar PIN por WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Panel Desplegable de Reasignación Rápida */}
          {isReassigning && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#0B1A2D] dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reasignar a Otra Pista Disponible</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsReassigning(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  value={selectedNewCourt}
                  onChange={(e) => setSelectedNewCourt(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-white"
                >
                  {courts.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.hourlyRate} €/h)
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleConfirmReassign}
                  className="px-4 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white font-black text-xs transition cursor-pointer shadow-xs active:scale-95"
                >
                  Confirmar Traslado
                </button>
              </div>
            </div>
          )}

          {/* Lista Tipográfica Limpia: Jugadores Convocados (4 Plazas) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                Jugadores Convocados ({participants.filter((p) => p.paid).length}/4 Abonados)
              </span>
              <span className="font-mono font-bold text-slate-400 text-[10px]">
                Cuota 1/4: {pricePerPlayer.toFixed(2)} €
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-[#1A314D] divide-y divide-slate-100 dark:divide-[#1A314D] overflow-hidden bg-white dark:bg-[#071220]">
              {participants.map((p, idx) => (
                <div
                  key={idx}
                  role="button"
                  tabIndex={0}
                  onClick={() => handlePlayerClick(p.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handlePlayerClick(p.name);
                  }}
                  className="p-3.5 hover:bg-slate-50/50 dark:hover:bg-[#0B1A2D]/20 transition flex items-center justify-between gap-3 text-xs cursor-pointer group"
                  title={`Ver perfil de ${p.name}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#0B1A2D] dark:bg-[#0E2239] text-white border border-slate-200 dark:border-[#1A314D] font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-[#0B1A2D] dark:text-white truncate text-xs group-hover:text-slate-600 dark:group-hover:text-slate-300 transition flex items-center gap-1">
                        <span>{p.name}</span>
                        <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Nivel {p.level?.toFixed(2) || '4.00'} · {p.paymentMethod || 'TPV'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold block border ${
                        p.paid
                          ? 'bg-slate-100 dark:bg-[#0E2239] text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-[#1A314D]'
                          : 'bg-slate-50 dark:bg-[#071220] text-slate-500 border border-slate-200/60 dark:border-[#1A314D]'
                      }`}
                    >
                      {p.statusText || (p.paid ? 'Pagado' : 'Pendiente TPV')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                      {(p.amount ?? pricePerPlayer).toFixed(2)} €
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marcador Post-Partido (Admin) */}
          {(!isPlayerRole || isPast) && (
            <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-[#1A314D] bg-slate-50/50 dark:bg-[#0B1A2D]/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0B1A2D] dark:text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Resultado del Partido {matchMode === 'competitive' && '(Actualiza ELO)'}</span>
                </span>
                {isScoreSaved && (
                  <span className="text-[10px] text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 text-slate-700 dark:text-slate-200" />
                    <span>Guardado</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ej. 6-4, 3-6, 7-6"
                  value={matchScoreInput}
                  onChange={(e) => setMatchScoreInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl font-mono text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D]"
                />
                <button
                  type="button"
                  onClick={handleSaveScore}
                  className="px-4 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white font-bold text-xs transition active:scale-95 shrink-0 cursor-pointer"
                >
                  Guardar Marcador
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. BARRA DE ACCIONES INFERIORES: ACCIÓN PRINCIPAL DESTACADA + GRUPO COMPACTO */}
        <div className="relative px-5 sm:px-6 py-3.5 border-t border-slate-100 dark:border-[#1A314D] bg-white dark:bg-[#071220] shrink-0">
          {isPlayerRole ? (
            <div className="flex items-center justify-end gap-2.5">
              {!isPast ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsPlayerEditModalOpen(true)}
                    className="h-12 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0E2239] dark:hover:bg-[#132A45] text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border border-slate-200/80 dark:border-[#1A314D] shadow-2xs active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Editar mi plaza</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCancelConfirmModalOpen(true)}
                    className="h-12 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold text-xs transition border border-amber-200/80 dark:border-amber-800/80 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Cancelar mi plaza</span>
                  </button>
                </>
              ) : (
                <span className="text-xs text-slate-400 italic">
                  Reserva finalizada (Sin acciones disponibles)
                </span>
              )}
              <button
                type="button"
                onClick={onClose}
                className="h-12 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0E2239] dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition shrink-0"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Acción Principal Destacada: Abrir en TPV (Único elemento en Verde Lima) */}
              <button
                type="button"
                onClick={handleGoToTPV}
                className="flex-1 h-12 px-4 rounded-xl bg-[#B7F229] hover:bg-[#a6df17] text-[#0B1A2D] font-black text-sm transition shadow-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                title="Cobrar en caja TPV"
              >
                <CreditCard className="w-4 h-4 shrink-0 text-[#0B1A2D]" />
                <span className="truncate">Abrir en TPV</span>
              </button>

              {/* Acción Secundaria: Editar Reserva */}
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="h-12 px-3.5 rounded-xl bg-slate-50 dark:bg-[#0E2239] hover:bg-slate-100 dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs shrink-0"
                title="Editar reserva"
              >
                <Edit3 className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Editar</span>
              </button>

              {/* Menú Contextual (···) para Reasignar, WhatsApp, Cancelar y Eliminar */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className={`h-12 w-12 rounded-xl border flex items-center justify-center transition active:scale-95 cursor-pointer shadow-2xs ${
                    showMoreActions
                      ? 'bg-[#0B1A2D] text-white border-[#0B1A2D]'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#0E2239] dark:hover:bg-[#132A45] border-slate-200/80 dark:border-[#1A314D] text-slate-700 dark:text-slate-300'
                  }`}
                  title="Más opciones de gestión"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {/* Popover hacia arriba */}
                {showMoreActions && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMoreActions(false)}
                    />
                    <div className="absolute bottom-full right-0 mb-2 w-60 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] shadow-xl p-1.5 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setShowMoreActions(false);
                          handleWhatsAppPin();
                        }}
                        className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#132A45] text-left font-bold text-[#0B1A2D] dark:text-slate-200 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 text-slate-500" />
                        <span>Enviar PIN por WhatsApp</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowMoreActions(false);
                          setIsReassigning(!isReassigning);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#132A45] text-left font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4 text-slate-500" />
                        <span>Reasignar pista</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowMoreActions(false);
                          setIsCancelConfirmModalOpen(true);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#132A45] text-left font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>Cancelar reserva</span>
                      </button>
                      <div className="h-px bg-slate-100 dark:bg-[#1A314D] my-1" />
                      <button
                        type="button"
                        onClick={() => {
                          setShowMoreActions(false);
                          handleDelete();
                        }}
                        className="w-full px-3 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-rose-500" />
                        <span>Eliminar reserva</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Botón Cerrar */}
              <button
                type="button"
                onClick={onClose}
                className="h-12 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0E2239] dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition shrink-0"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>

        {/* MODAL INFORMATIVO DE CANCELACIÓN SEGÚN POLÍTICAS DEL CLUB */}
        {isCancelConfirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
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
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-xs space-y-1">
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
                <div className="p-3.5 rounded-2xl bg-[#F0FCCF]/60 dark:bg-[#B7F229]/15 border border-[#B7F229]/40 text-xs text-[#0B1A2D] dark:text-[#B7F229] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5a8600] dark:text-[#B7F229] shrink-0" />
                    <span>Cancelación 100% Gratuita</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Faltan {hoursUntilMatch.toFixed(1)} horas para el inicio (antelación mínima exigida: {cancellationWindowHours}h). Tienes derecho a reembolso íntegro.
                  </p>
                  <div className="font-bold font-mono text-xs pt-1 text-[#0B1A2D] dark:text-[#B7F229]">
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
                    <div>Reembolso monedero: <strong className="text-[#0B1A2D] dark:text-[#B7F229]">{refundAmount.toFixed(2)} €</strong></div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCancelConfirmModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071220] dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition"
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
            <div className="relative w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#8B5CF6]" />
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
                    className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229] resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlayerEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-[#B7F229] font-bold text-xs shadow-xs cursor-pointer active:scale-95"
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
            <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#8B5CF6]" />
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
                    className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229]"
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
                      className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Hora Inicio</label>
                    <input
                      type="time"
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229]"
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
                      className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229]"
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
                      className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229]"
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
                      className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Estado Operativo</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229]"
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
                    className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229] resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071220] dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-[#B7F229] font-bold text-xs shadow-xs cursor-pointer active:scale-95"
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
            <div className="relative w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
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
                className="w-full p-3.5 rounded-2xl bg-[#F0FCCF]/60 dark:bg-[#B7F229]/15 hover:bg-[#F0FCCF] dark:hover:bg-[#B7F229]/25 border border-[#B7F229]/40 text-left transition flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-xs text-[#0B1A2D] dark:text-[#B7F229]">
                    Pago Total de la Pista (100%)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Carga el importe íntegro de la pista en el ticket
                  </div>
                </div>
                <div className="text-base font-black font-mono text-[#0B1A2D] dark:text-[#B7F229] whitespace-nowrap shrink-0">
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
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] hover:bg-slate-100 dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] text-left flex items-center justify-between transition text-xs cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#0B1A2D] text-[#B7F229] font-bold text-[10px] flex items-center justify-center">
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
                        <span className="font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229]">
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
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
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

  return typeof document !== 'undefined' ? createPortal(drawerContent, document.body) : drawerContent;
};

export default ReservationDrawer;
