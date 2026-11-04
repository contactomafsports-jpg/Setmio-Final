import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types/database';
import {
  X,
  Calendar,
  Clock,
  Building2,
  Users,
  Lock,
  CreditCard,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

export interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultTime?: string;
  defaultCourtId?: string;
  defaultVenueId?: string;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  isOpen,
  onClose,
  defaultDate,
  defaultTime,
  defaultCourtId,
  defaultVenueId,
}) => {
  const {
    courts,
    venues,
    isMultiVenue,
    selectedVenueId,
    createBooking,
    addCustomer,
    customers,
    triggerDemoToast,
    currentTenant,
    setAdminTab,
    setNewBookingDraft,
    t,
  } = useApp();


  // Helper date
  const todayStr = useMemo(() => {
    if (defaultDate) return defaultDate;
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [defaultDate]);

  // Initial venue resolution
  const activeVenues = useMemo(() => venues.filter((v) => v.id !== 'all'), [venues]);
  const hasMultipleVenues = isMultiVenue && activeVenues.length > 1;

  const initialVenueId = useMemo(() => {
    if (defaultVenueId && defaultVenueId !== 'all') return defaultVenueId;
    if (selectedVenueId && selectedVenueId !== 'all') return selectedVenueId;
    return activeVenues[0]?.id || 'venue-san-mateo';
  }, [defaultVenueId, selectedVenueId, activeVenues]);

  // Form states
  const [formVenueId, setFormVenueId] = useState<string>(initialVenueId);
  const [formDate, setFormDate] = useState<string>(todayStr);
  const [formTime, setFormTime] = useState<string>(defaultTime || '17:00');
  const [formDuration, setFormDuration] = useState<60 | 90 | 120>(90);
  const [formCourtId, setFormCourtId] = useState<string>(defaultCourtId || courts[0]?.id || 'court-1');

  // Operation Type: 'existing' (Socio Club) | 'new' (Nuevo) | 'club' (Reserva del Propio Club) | 'block' (Bloqueo Pista)
  const [clientType, setClientType] = useState<'existing' | 'new' | 'club' | 'block'>('existing');

  // Prevenir scroll de fondo mientras el modal está activo
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Socio Club selection
  const clubRegisteredPlayers = useMemo(() => {
    if (customers && customers.length > 0) {
      return customers.map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        isMember: c.isMember,
        label: `${c.name} (${c.isMember ? 'Socio' : 'Cliente'}${c.phone ? ` · ${c.phone}` : ''})`,
      }));
    }
    return [
      { id: 'c-1', name: 'Carlos Méndez', phone: '+34 611 22 33 44', email: 'carlos.mendez@galiciapadel.com', isMember: true, label: 'Carlos Méndez (Socio #108 · 611 22 33 44)' },
      { id: 'c-2', name: 'Laura Senra', phone: '+34 655 44 33 22', email: 'laura.senra@padelsanmateo.es', isMember: true, label: 'Laura Senra (Socia #214 · 655 44 33 22)' },
      { id: 'c-3', name: 'Diego Soto', phone: '+34 622 33 44 55', email: 'diego.soto@email.es', isMember: true, label: 'Diego Soto (Socio #305 · 622 33 44 55)' },
      { id: 'c-4', name: 'Mateo Varela', phone: '+34 600 11 22 33', email: 'mateo@padelsanmateo.es', isMember: true, label: 'Mateo Varela (Socio #412 · 600 11 22 33)' },
      { id: 'c-5', name: 'Rosa Carballo', phone: '+34 633 11 44 22', email: 'rosa.carballo@email.es', isMember: true, label: 'Rosa Carballo (Socia #519 · 633 11 44 22)' },
      { id: 'c-6', name: 'Rubén Loureiro', phone: '+34 666 77 88 99', email: 'ruben.loureiro@email.es', isMember: true, label: 'Rubén Loureiro (Socio #601 · 666 77 88 99)' },
    ];
  }, [customers]);

  const [selectedMember, setSelectedMember] = useState(clubRegisteredPlayers[0]?.label || 'Carlos Méndez (Socio #108)');

  // Nuevo Cliente (Nombre y Teléfono obligatorios, Correo opcional)
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');

  // Reserva del Propio Club
  const [clubReasonPreset, setClubReasonPreset] = useState('Entrenamiento de Equipo Federado');
  const [customClubReason, setCustomClubReason] = useState('');
  const [clubResponsible, setClubResponsible] = useState('Dirección Deportiva / Staff');

  // Bloqueo de Pista (Preconfigurados o Personalizado)
  const [blockReasonPreset, setBlockReasonPreset] = useState('Mantenimiento y limpieza de césped');
  const [customBlockReason, setCustomBlockReason] = useState('');
  const [blockResponsible, setBlockResponsible] = useState('Personal de Mantenimiento / Recepción');

  // Pago Dividido
  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [invitedMember2, setInvitedMember2] = useState(clubRegisteredPlayers[1]?.label || 'Laura Senra (Socia #214)');
  const [invitedMember3, setInvitedMember3] = useState(clubRegisteredPlayers[2]?.label || 'Diego Soto (Socio #305)');
  const [invitedMember4, setInvitedMember4] = useState(clubRegisteredPlayers[3]?.label || 'Mateo Varela (Socio #412)');

  // Configuración de Pago: 'both' (Ambas vías) | 'online' (Pago online exclusivo) | 'club' (Pago en club)
  const [paymentConfig, setPaymentConfig] = useState<'both' | 'online' | 'club'>('both');

  // Sync available courts with selected venue
  const availableCourts = useMemo(() => {
    if (!hasMultipleVenues) return courts;
    const filtered = courts.filter((c) => c.venueId === formVenueId || (!c.venueId && formVenueId === 'venue-san-mateo'));
    return filtered.length > 0 ? filtered : courts;
  }, [courts, formVenueId, hasMultipleVenues]);

  // Ensure formCourtId is valid for the selected venue
  useEffect(() => {
    if (availableCourts.length > 0 && !availableCourts.some((c) => c.id === formCourtId)) {
      setFormCourtId(availableCourts[0].id);
    }
  }, [availableCourts, formCourtId]);

  // Sync default props when modal opens
  useEffect(() => {
    if (isOpen) {
      if (defaultDate) setFormDate(defaultDate);
      if (defaultTime) setFormTime(defaultTime);
      if (defaultCourtId) setFormCourtId(defaultCourtId);
      if (defaultVenueId && defaultVenueId !== 'all') setFormVenueId(defaultVenueId);
    }
  }, [isOpen, defaultDate, defaultTime, defaultCourtId, defaultVenueId]);

  if (!isOpen) return null;

  // Selected Court & Calculated Price
  const currentCourt = courts.find((c) => c.id === formCourtId) || availableCourts[0] || courts[0];
  const hours = formDuration / 60;
  const isZeroPrice = clientType === 'block' || clientType === 'club';
  const calculatedPrice = isZeroPrice ? 0 : (currentCourt?.hourlyRate || 28) * hours;

  // Time options for select
  const timeOptions = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Resolve Target Venue
    const resolvedCourtVenueId = currentCourt.venueId || formVenueId || 'venue-san-mateo';
    const targetVenue = venues.find((v) => v.id === resolvedCourtVenueId) || activeVenues[0] || venues[0];

    // 2. Resolve Client Name & CRM
    let clientDisplayName = 'Cliente Mostrador';
    let createdCustomerId: string | undefined = undefined;

    if (clientType === 'block') {
      const reasonText = blockReasonPreset === 'Otro motivo personalizado'
        ? (customBlockReason.trim() || 'Mantenimiento preventivo')
        : blockReasonPreset;
      clientDisplayName = `BLOQUEO: ${reasonText} (${blockResponsible || 'Mantenimiento'})`;
    } else if (clientType === 'club') {
      const reasonText = clubReasonPreset === 'Otro motivo oficial'
        ? (customClubReason.trim() || 'Actividad Oficial')
        : clubReasonPreset;
      clientDisplayName = `CLUB: ${reasonText} (${clubResponsible || 'Dirección Deportiva'})`;
    } else if (clientType === 'existing') {
      clientDisplayName = selectedMember.split(' (')[0];
    } else {
      // Tipo "Nuevo": Crear cliente en la base de datos (CRM)
      const newCust = addCustomer({
        name: newClientName.trim() || 'Nuevo Cliente',
        email: newClientEmail.trim() || `cliente.${Date.now()}@setmio.com`,
        phone: newClientPhone.trim() || '+34 600 00 00 00',
        level: 3.5,
        isMember: false,
      });
      createdCustomerId = newCust.id;
      clientDisplayName = newCust.name;
      triggerDemoToast(
        'Nuevo Cliente Registrado',
        `Ficha CRM creada para ${newCust.name} (${newCust.phone}). Asignado como titular de la reserva.`,
        'success'
      );
    }

    // 3. Resolve Participants & Split
    const memberDiscountPercent = currentTenant.settings?.policies?.memberCourtDiscountPercent ?? 20;
    let participants: Booking['participants'];

    if (isSplitPayment && clientType === 'existing') {
      const baseShare = calculatedPrice / 4;
      const invitedList = [
        { name: clientDisplayName, isMember: true },
        { name: invitedMember2.split(' (')[0], isMember: true },
        { name: invitedMember3.split(' (')[0], isMember: true },
        { name: invitedMember4.split(' (')[0], isMember: true },
      ];

      participants = invitedList.map((p, idx) => {
        const discounted = p.isMember ? baseShare * (1 - memberDiscountPercent / 100) : baseShare;
        return {
          name: p.name,
          paid: idx === 0 && paymentConfig !== 'online',
          amount: parseFloat(discounted.toFixed(2)),
          statusText: idx === 0 ? 'Titular Reserva' : 'Socio Convocado (Pago 1/4)',
        };
      });
    } else {
      participants = [
        {
          name: clientDisplayName,
          paid: isZeroPrice || paymentConfig === 'club',
          amount: calculatedPrice,
        },
      ];
    }

    // 4. Calculate start and end ISO
    const startISO = `${formDate}T${formTime}:00`;
    const startH = parseInt(formTime.split(':')[0], 10);
    const startM = parseInt(formTime.split(':')[1], 10);
    const totalMinutes = startH * 60 + startM + formDuration;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    const endISO = `${formDate}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;

    // 5. Payment configuration note
    const paymentConfigNote = paymentConfig === 'online'
      ? 'Pago Online Exclusivo (Enlace remitido al titular)'
      : paymentConfig === 'club'
      ? 'Pago en Club (Mostrador / TPV)'
      : 'Pago Flexible (Online o Mostrador)';

    // 6. Create Booking
    createBooking({
      courtId: currentCourt.id,
      courtName: currentCourt.name,
      venueId: targetVenue?.id,
      venueName: targetVenue?.name,
      venueShortName: targetVenue?.shortName,
      creatorId: createdCustomerId || (clientType === 'existing' ? 'socio-member' : clientType === 'club' ? 'club-internal' : 'reception-client'),
      creatorName: clientDisplayName,
      startTime: startISO,
      endTime: endISO,
      status: 'confirmed',
      totalPrice: calculatedPrice,
      paymentStatus: isZeroPrice ? 'paid' : paymentConfig === 'online' ? 'pending' : isSplitPayment ? 'partially_paid' : 'paid',
      isSplitPayment: isSplitPayment && clientType === 'existing',
      mode: 'competitive',
      gender: 'mixed',
      notes: `${paymentConfigNote}. ${clientType === 'block' ? 'Bloqueo técnico de pista.' : clientType === 'club' ? 'Reserva institucional interna del club.' : ''}`,
      participants,
    });

    triggerDemoToast(
      clientType === 'block' ? 'Pista Bloqueada' : 'Reserva Confirmada',
      `${currentCourt.name} para el ${formDate} a las ${formTime} (${formDuration} min).`,
      'success'
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center bg-slate-950/60 dark:bg-black/75 backdrop-blur-xs p-0 sm:p-4 lg:p-6 animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full flex flex-col bg-white dark:bg-[#071220] rounded-t-[28px] sm:rounded-3xl shadow-2xl border-t border-slate-200/90 dark:border-[#1A314D] sm:border max-h-[90vh] sm:max-h-[92vh] sm:max-w-2xl lg:max-w-3xl overflow-hidden mt-auto sm:my-auto animate-in slide-in-from-bottom-4 duration-200">
        {/* Drag handle táctil en móvil */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Modal Header Limpio y Exclusivo */}
        <div className="sticky top-0 z-20 px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between bg-white/95 dark:bg-[#071220]/95 backdrop-blur-md shrink-0">
          <h2 className="text-lg sm:text-xl font-black text-[#0B1A2D] dark:text-white tracking-tight">
            Nueva Reserva
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-[#0E2239] transition-colors cursor-pointer shrink-0"
            title="Cerrar formulario"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Con scroll vertical garantizado */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 text-xs text-slate-900 dark:text-slate-100">
          {/* 1. SELECTOR DE SEDE (SOLO SI ES ENTORNO MULTI-SEDE) */}
          {hasMultipleVenues && (
            <div className="space-y-1.5">
              <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />
                  <span>Sede de la Instalación <strong className="text-rose-500">*</strong></span>
                </span>
                <span className="text-[10px] text-[#0B1A2D] dark:text-[#B7F229] font-bold bg-[#B7F229]/20 px-2 py-0.5 rounded-md">
                  Obligatorio
                </span>
              </label>
              <select
                required
                value={formVenueId}
                onChange={(e) => {
                  const vId = e.target.value;
                  setFormVenueId(vId);
                  const matchingCourts = courts.filter((c) => c.venueId === vId || (!c.venueId && vId === 'venue-san-mateo'));
                  if (matchingCourts.length > 0) {
                    setFormCourtId(matchingCourts[0].id);
                  }
                }}
                className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2.5 text-xs font-bold text-[#0B1A2D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
              >
                {activeVenues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.shortName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 2. TIPO DE OPERACIÓN: Socio Club, Nuevo, Reserva Club, Bloqueo Pista */}
          <div className="space-y-1.5">
            <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              Tipo de Operación
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-[#071220] rounded-2xl border border-slate-200/80 dark:border-[#1A314D]">
              <button
                type="button"
                onClick={() => setClientType('existing')}
                className={`py-2 px-2 rounded-xl font-bold text-xs transition cursor-pointer text-center ${
                  clientType === 'existing'
                    ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                }`}
              >
                Socio Club
              </button>
              <button
                type="button"
                onClick={() => setClientType('new')}
                className={`py-2 px-2 rounded-xl font-bold text-xs transition cursor-pointer text-center ${
                  clientType === 'new'
                    ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                }`}
              >
                Nuevo
              </button>
              <button
                type="button"
                onClick={() => setClientType('club')}
                className={`py-2 px-2 rounded-xl font-bold text-xs transition cursor-pointer text-center ${
                  clientType === 'club'
                    ? 'bg-[#8B5CF6] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                }`}
              >
                Reserva Club
              </button>
              <button
                type="button"
                onClick={() => setClientType('block')}
                className={`py-2 px-2 rounded-xl font-bold text-xs transition cursor-pointer text-center ${
                  clientType === 'block'
                    ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                }`}
              >
                Bloqueo Pista
              </button>
            </div>
          </div>

          {/* 3. CAMPOS ESPECÍFICOS SEGÚN TIPO (LIMPIOS Y SIN CAJAS ANIDADAS) */}
          {clientType === 'existing' && (
            <div className="space-y-1.5">
              <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs">
                Seleccionar Socio Titular:
              </label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#0B1A2D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
              >
                {clubRegisteredPlayers.map((player) => (
                  <option key={player.id} value={player.label}>
                    {player.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {clientType === 'new' && (
            <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#071220]/70 border border-slate-200/80 dark:border-[#1A314D] space-y-3">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Datos del Nuevo Usuario</span>
                <span className="text-[10px] text-[#0B1A2D] dark:text-[#B7F229] font-bold bg-[#B7F229]/20 px-2 py-0.5 rounded-md">
                  Crea Ficha CRM
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold text-xs">
                    Nombre Completo <strong className="text-rose-500">*</strong>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. Rodrigo Silva"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-full bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#0B1A2D] dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold text-xs">
                    Teléfono <strong className="text-rose-500">*</strong>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+34 600 00 00 00"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      className="w-full bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#0B1A2D] dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold text-xs">
                  Correo Electrónico <span className="text-slate-400 font-normal">(Opcional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com (opcional)"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#0B1A2D] dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                  />
                </div>
              </div>
            </div>
          )}

          {clientType === 'club' && (
            <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#071220]/70 border border-slate-200/80 dark:border-[#1A314D] space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#8B5CF6]" />
                <span className="font-extrabold text-[#0B1A2D] dark:text-white text-xs">
                  Reserva Oficial del Club
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold text-xs">
                    Motivo / Actividad:
                  </label>
                  <select
                    value={clubReasonPreset}
                    onChange={(e) => setClubReasonPreset(e.target.value)}
                    className="w-full bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#0B1A2D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                  >
                    <option value="Entrenamiento de Equipo Federado">Entrenamiento de Equipo Federado</option>
                    <option value="Clase Magistral / Clinic Oficial">Clase Magistral / Clinic Oficial</option>
                    <option value="Reserva Institucional / Patrocinadores">Reserva Institucional / Patrocinadores</option>
                    <option value="Evento Interno / Actividad Social">Evento Interno / Actividad Social</option>
                    <option value="Calibración y Pruebas Domóticas">Calibración y Pruebas Domóticas</option>
                    <option value="Otro motivo oficial">Otro motivo oficial (especificar)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold text-xs">
                    Responsable / Departamento:
                  </label>
                  <input
                    type="text"
                    placeholder="Dirección Deportiva / Staff"
                    value={clubResponsible}
                    onChange={(e) => setClubResponsible(e.target.value)}
                    className="w-full bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl px-3 py-2.5 text-xs text-[#0B1A2D] dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                  />
                </div>
              </div>
              {clubReasonPreset === 'Otro motivo oficial' && (
                <div>
                  <input
                    type="text"
                    placeholder="Escribe el motivo oficial de la reserva..."
                    value={customClubReason}
                    onChange={(e) => setCustomClubReason(e.target.value)}
                    className="w-full bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl px-3 py-2.5 text-xs text-[#0B1A2D] dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                    required
                  />
                </div>
              )}
              <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-[#132A45]/50 border border-slate-200/60 dark:border-[#1A314D] p-2.5 rounded-xl flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#B7F229] shrink-0" />
                <span>Se registrará a tarifa 0,00 € garantizando control de pista, activación de luces y PIN de acceso.</span>
              </p>
            </div>
          )}

          {clientType === 'block' && (
            <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#071220]/70 border border-slate-200/80 dark:border-[#1A314D] space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />
                <span className="font-extrabold text-[#0B1A2D] dark:text-white text-xs">
                  Bloqueo Administrativo de Pista
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold text-xs">
                    Motivo de Bloqueo:
                  </label>
                  <select
                    value={blockReasonPreset}
                    onChange={(e) => setBlockReasonPreset(e.target.value)}
                    className="w-full bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#0B1A2D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                  >
                    <option value="Mantenimiento y limpieza de césped">Mantenimiento y limpieza de césped</option>
                    <option value="Reparación de red y postes">Reparación de red y postes</option>
                    <option value="Revisión técnica de iluminación LED">Revisión técnica de iluminación LED</option>
                    <option value="Sustitución / Reparación de cristal">Sustitución / Reparación de cristal</option>
                    <option value="Condiciones meteorológicas adversas">Condiciones meteorológicas adversas</option>
                    <option value="Entrenamiento oficial del club">Entrenamiento oficial del club</option>
                    <option value="Otro motivo personalizado">Otro motivo personalizado (redactar)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold text-xs">
                    Responsable del Bloqueo:
                  </label>
                  <input
                    type="text"
                    placeholder="Personal de Mantenimiento / Recepción"
                    value={blockResponsible}
                    onChange={(e) => setBlockResponsible(e.target.value)}
                    className="w-full bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl px-3 py-2.5 text-xs text-[#0B1A2D] dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                  />
                </div>
              </div>
              {blockReasonPreset === 'Otro motivo personalizado' && (
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Torneo express o arreglo urgente"
                    value={customBlockReason}
                    onChange={(e) => setCustomBlockReason(e.target.value)}
                    className="w-full bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl px-3 py-2.5 text-xs text-[#0B1A2D] dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                  />
                </div>
              )}
            </div>
          )}

          {/* 4. FECHA, PISTA, HORA Y DURACIÓN (RETÍCULA SIMÉTRICA 2X2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold text-xs">
                Fecha de Reserva <strong className="text-rose-500">*</strong>
              </label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#0B1A2D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold text-xs">
                Pista Asignada <strong className="text-rose-500">*</strong>
              </label>
              <select
                value={formCourtId}
                onChange={(e) => setFormCourtId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#0B1A2D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
              >
                {availableCourts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name.split('—')[0]} ({court.hourlyRate}€/h)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold text-xs">
                Hora de Inicio <strong className="text-rose-500">*</strong>
              </label>
              <select
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-[#0B1A2D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold text-xs">
                Duración
              </label>
              <select
                value={formDuration}
                onChange={(e) => setFormDuration(Number(e.target.value) as 60 | 90 | 120)}
                className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#0B1A2D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
              >
                <option value={60}>60 min (1 hora)</option>
                <option value={90}>90 min (1.5h - Predeterminada)</option>
                <option value={120}>120 min (2 horas)</option>
              </select>
            </div>
          </div>

          {/* 5. PAGO DIVIDIDO E INVITACIÓN A OTROS SOCIOS */}
          {clientType !== 'block' && clientType !== 'club' && (
            <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#071220]/70 border border-slate-200/80 dark:border-[#1A314D] space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isSplitPayment}
                  onChange={(e) => setIsSplitPayment(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0B1A2D] accent-[#0B1A2D] dark:accent-[#B7F229] focus:ring-[#B7F229] cursor-pointer"
                />
                <div>
                  <span className="font-extrabold text-[#0B1A2D] dark:text-white text-xs block">
                    Activar Pago Dividido (4 Jugadores Independientes)
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Cada jugador abona únicamente su cuota de 1/4 de pista
                  </span>
                </div>
              </label>

              {clientType === 'existing' && isSplitPayment && (
                <div className="pt-3 border-t border-slate-200/80 dark:border-[#1A314D] space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#B7F229]" />
                      <span>Invitar a otros socios del club</span>
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
                      3 plazas convocadas
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Plaza 2 (Socio Convocado):
                      </label>
                      <select
                        value={invitedMember2}
                        onChange={(e) => setInvitedMember2(e.target.value)}
                        className="w-full bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl px-3 py-2 text-xs text-[#0B1A2D] dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                      >
                        {clubRegisteredPlayers.map((p) => (
                          <option key={`p2-${p.id}`} value={p.label}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Plaza 3 (Socio Convocado):
                      </label>
                      <select
                        value={invitedMember3}
                        onChange={(e) => setInvitedMember3(e.target.value)}
                        className="w-full bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl px-3 py-2 text-xs text-[#0B1A2D] dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                      >
                        {clubRegisteredPlayers.map((p) => (
                          <option key={`p3-${p.id}`} value={p.label}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Plaza 4 (Socio Convocado):
                      </label>
                      <select
                        value={invitedMember4}
                        onChange={(e) => setInvitedMember4(e.target.value)}
                        className="w-full bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl px-3 py-2 text-xs text-[#0B1A2D] dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                      >
                        {clubRegisteredPlayers.map((p) => (
                          <option key={`p4-${p.id}`} value={p.label}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-[#132A45]/50 border border-slate-200/60 dark:border-[#1A314D] p-2.5 rounded-xl flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#B7F229] shrink-0" />
                    <span>Se enviará notificación automática a los socios convocados con su enlace de pago correspondiente.</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 6. CONFIGURACIÓN DE PAGO (ONLINE EXCLUSIVO, PAGO EN CLUB, O AMBAS) */}
          {clientType !== 'block' && clientType !== 'club' && (
            <div className="space-y-2">
              <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] flex items-center justify-between">
                <span>Configuración de Pago</span>
                <span className="text-[10px] text-slate-400 normal-case font-normal">
                  Reglas para socios y no socios
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentConfig('both')}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    paymentConfig === 'both'
                      ? 'bg-[#0B1A2D] dark:bg-[#B7F229] border-[#0B1A2D] dark:border-[#B7F229] text-white dark:text-[#0B1A2D] font-bold shadow-xs'
                      : 'bg-slate-50/70 dark:bg-[#071220]/70 border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs">Ambas Vías</div>
                  <div className={`text-[10px] font-normal ${paymentConfig === 'both' ? 'text-slate-300 dark:text-[#0B1A2D]/80' : 'text-slate-400'}`}>
                    Online o mostrador
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentConfig('online')}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    paymentConfig === 'online'
                      ? 'bg-[#0B1A2D] dark:bg-[#B7F229] border-[#0B1A2D] dark:border-[#B7F229] text-white dark:text-[#0B1A2D] font-bold shadow-xs'
                      : 'bg-slate-50/70 dark:bg-[#071220]/70 border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs">Pago Online</div>
                  <div className={`text-[10px] font-normal ${paymentConfig === 'online' ? 'text-slate-300 dark:text-[#0B1A2D]/80' : 'text-slate-400'}`}>
                    Enlace previo
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentConfig('club')}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    paymentConfig === 'club'
                      ? 'bg-[#0B1A2D] dark:bg-[#B7F229] border-[#0B1A2D] dark:border-[#B7F229] text-white dark:text-[#0B1A2D] font-bold shadow-xs'
                      : 'bg-slate-50/70 dark:bg-[#071220]/70 border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs">Pago en Club</div>
                  <div className={`text-[10px] font-normal ${paymentConfig === 'club' ? 'text-slate-300 dark:text-[#0B1A2D]/80' : 'text-slate-400'}`}>
                    Mostrador / TPV
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Tarifa Final en Pista */}
          <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#071220]/70 border border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-[#0B1A2D] dark:text-white block">
                {isZeroPrice ? 'Tarifa Administrativa' : 'Importe Total de la Reserva'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isZeroPrice
                  ? 'Tarifa 0,00 € automática para control operativo'
                  : `${formDuration} min en ${currentCourt.name.split('—')[0]} (${currentCourt.hourlyRate} €/h)`}
              </span>
            </div>
            <div className="font-mono font-black text-xl sm:text-2xl text-[#82b805] dark:text-[#B7F229]">
              {calculatedPrice.toFixed(2)} €
            </div>
          </div>
        </form>
        </div>

        {/* Modal Footer Sólido y Simétrico (Distribución Equitativa 50/50) */}
        <div className="sticky bottom-0 z-20 px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 dark:border-[#1A314D] bg-white/95 dark:bg-[#071220]/95 backdrop-blur-md shrink-0 mt-auto">
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0E2239] dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm border border-slate-200/80 dark:border-[#1A314D] transition cursor-pointer active:scale-[0.99] flex items-center justify-center text-center whitespace-nowrap"
            >
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-3 px-3 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:hover:bg-[#a6e61f] dark:text-[#0B1A2D] font-bold text-xs sm:text-sm border border-transparent shadow-md transition active:scale-[0.99] cursor-pointer flex items-center justify-center text-center whitespace-nowrap"
            >
              <span>{clientType === 'block' ? 'Confirmar Bloqueo' : 'Confirmar Reserva'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBookingModal;
