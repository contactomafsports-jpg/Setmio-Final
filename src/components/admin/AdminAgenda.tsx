import React, { useState } from 'react';
import { useApp, INITIAL_VENUES } from '../../context/AppContext';
import { Booking, Court } from '../../types/database';
import { ReservationDrawer, ReservationDrawerData } from './ReservationDrawer';
import { BookingListItem, BookingListItemData } from './BookingListItem';
import { AllBookingsPage } from './AllBookingsPage';
import { NewBookingModal } from './NewBookingModal';
import {
  Calendar,
  Clock,
  Plus,
  Zap,
  Lock,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  X,
  ArrowRight,
  FileSpreadsheet,
  Building2,
  User,
  UserCheck,
  Search,
  ChevronDown,
  Layers,
} from 'lucide-react';

const VENUE_THEMES: Record<string, {
  name: string;
  shortName: string;
  dotBg: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  slotBg: string;
  slotBorder: string;
  hoverBorder: string;
  pinText: string;
  accentText: string;
}> = {
  'venue-san-mateo': {
    name: 'Sede Central (San Mateo)',
    shortName: 'San Mateo (Centro)',
    dotBg: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/70',
    badgeBorder: 'border-emerald-300 dark:border-emerald-800',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    slotBg: 'bg-emerald-50/95 dark:bg-emerald-950/75',
    slotBorder: 'border-emerald-500/70 dark:border-emerald-500/80',
    hoverBorder: 'hover:border-emerald-600 dark:hover:border-emerald-400',
    pinText: 'text-emerald-700 dark:text-emerald-400',
    accentText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
  },
  'venue-coruna': {
    name: 'Sede A Coruña (Matogrande)',
    shortName: 'A Coruña (Norte)',
    dotBg: 'bg-blue-600',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/70',
    badgeBorder: 'border-blue-300 dark:border-blue-800',
    badgeText: 'text-blue-800 dark:text-blue-300',
    slotBg: 'bg-blue-50/95 dark:bg-blue-950/75',
    slotBorder: 'border-blue-500/70 dark:border-blue-500/80',
    hoverBorder: 'hover:border-blue-600 dark:hover:border-blue-400',
    pinText: 'text-blue-700 dark:text-blue-400',
    accentText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
  },
  'venue-santiago': {
    name: 'Sede Santiago (Compostela)',
    shortName: 'Santiago (Sur)',
    dotBg: 'bg-orange-500',
    badgeBg: 'bg-orange-50 dark:bg-orange-950/70',
    badgeBorder: 'border-orange-300 dark:border-orange-800',
    badgeText: 'text-orange-800 dark:text-orange-300',
    slotBg: 'bg-orange-50/95 dark:bg-orange-950/75',
    slotBorder: 'border-orange-500/70 dark:border-orange-500/80',
    hoverBorder: 'hover:border-orange-600 dark:hover:border-orange-400',
    pinText: 'text-orange-700 dark:text-orange-400',
    accentText: 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
  },
  'venue-vigo': {
    name: 'Sede Vigo (Rías Baixas)',
    shortName: 'Vigo (Arena)',
    dotBg: 'bg-purple-600',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/70',
    badgeBorder: 'border-purple-300 dark:border-purple-800',
    badgeText: 'text-purple-800 dark:text-purple-300',
    slotBg: 'bg-purple-50/95 dark:bg-purple-950/75',
    slotBorder: 'border-purple-500/70 dark:border-purple-500/80',
    hoverBorder: 'hover:border-purple-600 dark:hover:border-purple-400',
    pinText: 'text-purple-700 dark:text-purple-400',
    accentText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
  },
};

const getVenueTheme = (venueId?: string) => {
  if (venueId && VENUE_THEMES[venueId]) {
    return VENUE_THEMES[venueId];
  }
  return VENUE_THEMES['venue-san-mateo'];
};

export const AdminAgenda: React.FC = () => {
  const {
    courts,
    bookings,
    customers,
    createBooking,
    updateBooking,
    cancelBooking,
    currentUser,
    currentTenant,
    isMultiVenue,
    venues,
    selectedVenueId,
    selectedVenue,
    setSelectedVenueId,
    isConsolidatedView,
    isClubOpen,
    toggleClubOpenState,
    triggerDemoToast,
    navigateToPlayerProfile,
    addCustomer,
    sendNotification,
    currentView,
    t,
  } = useApp();

  const [currentDate, setCurrentDate] = useState('2026-09-30');
  const [isVenueSelectorOpen, setIsVenueSelectorOpen] = useState(false);
  const [selectedDrawerData, setSelectedDrawerData] = useState<ReservationDrawerData | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showAllBookingsView, setShowAllBookingsView] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        window.location.pathname.includes('/reservas/todas') ||
        window.location.pathname.includes('/todas-las-reservas')
      );
    }
    return false;
  });
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  // Sync with browser URL changes and deep links for /admin/reservas/:id
  React.useEffect(() => {
    const handleUrlSync = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const isAll = path.includes('/reservas/todas') || path.includes('/todas-las-reservas');
        setShowAllBookingsView(isAll);

        const match = path.match(/\/(?:admin|gestion)\/reservas\/([^/]+)$/);
        if (match && match[1] && match[1] !== 'todas') {
          const targetId = match[1];
          const found = bookings.find((b) => b.id === targetId);
          if (found) {
            setSelectedDrawerData(convertBookingToDrawer(found));
          }
        }
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, [bookings]);

  const stepDate = (days: number) => {
    const parts = currentDate.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dt = String(d.getDate()).padStart(2, '0');
    setCurrentDate(`${y}-${m}-${dt}`);
  };

  const formattedDateLabel = React.useMemo(() => {
    try {
      const parts = currentDate.split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      const today = new Date();
      const isToday =
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate();
      const weekday = d.toLocaleDateString('es-ES', { weekday: 'short' });
      const month = d.toLocaleDateString('es-ES', { month: 'short' });
      const capWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).replace('.', '');
      const capMonth = month.charAt(0).toUpperCase() + month.slice(1).replace('.', '');
      if (isToday) {
        return `Hoy, ${d.getDate()} ${capMonth}`;
      }
      return `${capWeekday}, ${d.getDate()} ${capMonth}`;
    } catch {
      return currentDate;
    }
  }, [currentDate]);

  // New reservation from reception
  const [formVenueId, setFormVenueId] = useState<string>(() => {
    return selectedVenueId !== 'all' ? selectedVenueId : (venues[1]?.id || venues[0]?.id || 'venue-san-mateo');
  });
  const [newCourtId, setNewCourtId] = useState(courts[0]?.id || 'court-1');
  const [newTime, setNewTime] = useState('17:00');
  const [durationMinutes, setDurationMinutes] = useState<60 | 90 | 120>(90);
  const [clientType, setClientType] = useState<'existing' | 'new' | 'club' | 'block' | 'anonymous'>('existing');
  const [isAnonymousQuick, setIsAnonymousQuick] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState('Carlos Méndez (Socio 108)');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newSplit, setNewSplit] = useState(false);

  // Requirement 2: Bloqueo de pista con opciones preconfiguradas o texto personalizado
  const [blockReasonPreset, setBlockReasonPreset] = useState('Mantenimiento y limpieza de césped');
  const [customBlockReason, setCustomBlockReason] = useState('');
  const [blockResponsible, setBlockResponsible] = useState('Personal de Mantenimiento / Recepción');

  // Requirement 2: Reserva realizada por el propio club
  const [clubReasonPreset, setClubReasonPreset] = useState('Entrenamiento de Equipo Federado');
  const [customClubReason, setCustomClubReason] = useState('');
  const [clubResponsible, setClubResponsible] = useState('Dirección Deportiva');

  // Requirement 2: Opciones de configuración de pago
  const [paymentConfig, setPaymentConfig] = useState<'both' | 'online' | 'club'>('both');

  // Requirement 2: Invitaciones a otros socios en pago dividido
  const [invitedMember2, setInvitedMember2] = useState('Pablo Vello (Socio #019 · Nivel 4.80)');
  const [invitedMember3, setInvitedMember3] = useState('Rosa Carballo (Socia #042 · Nivel 3.90)');
  const [invitedMember4, setInvitedMember4] = useState('Mateo Varela (Socio #055 · Nivel 4.15)');

  const currentCourt = courts.find((c) => c.id === newCourtId) || courts[0];
  const targetVenueId = currentCourt?.venueId || formVenueId || (selectedVenueId !== 'all' ? selectedVenueId : undefined);

  // Dynamic registered socios/usuarios filtered by active venue (or all venues if global)
  const venueRegisteredCustomers = React.useMemo(() => {
    let list = customers || [];
    if (selectedVenueId !== 'all' && targetVenueId && targetVenueId !== 'all') {
      list = list.filter((c) => !c.venueId || c.venueId === targetVenueId);
    }
    return list;
  }, [customers, targetVenueId, selectedVenueId]);

  const searchedCustomers = React.useMemo(() => {
    if (!memberSearchQuery.trim()) return venueRegisteredCustomers;
    const q = memberSearchQuery.toLowerCase().trim();
    return venueRegisteredCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.memberNum && c.memberNum.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [venueRegisteredCustomers, memberSearchQuery]);

  React.useEffect(() => {
    if (!selectedCustomer && venueRegisteredCustomers.length > 0) {
      const first = venueRegisteredCustomers[0];
      setSelectedCustomer(first);
      setSelectedMember(first.name);
      setNewClientName(first.name);
      setNewClientPhone(first.phone);
      setNewClientEmail(first.email);
    }
  }, [venueRegisteredCustomers, selectedCustomer]);

  const handleToggleAnonymousQuick = () => {
    if (!isAnonymousQuick) {
      setIsAnonymousQuick(true);
      setClientType('anonymous');
      setNewClientName('Cliente Mostrador / Anónimo');
      setSelectedMember('Cliente Mostrador / Anónimo');
      setNewClientPhone('+34 600 00 00 00');
    } else {
      setIsAnonymousQuick(false);
      setClientType('existing');
      const first = venueRegisteredCustomers[0] || customers[0];
      if (first) {
        setSelectedCustomer(first);
        setSelectedMember(first.name);
        setNewClientName(first.name);
        setNewClientPhone(first.phone);
        setNewClientEmail(first.email);
      }
    }
  };

  const handleSelectCustomer = (cust: any) => {
    setSelectedCustomer(cust);
    setSelectedMember(cust.name);
    setNewClientName(cust.name);
    setNewClientPhone(cust.phone || '');
    setNewClientEmail(cust.email || '');
    setIsAnonymousQuick(false);
    setClientType('existing');
    setIsMemberDropdownOpen(false);
    setMemberSearchQuery('');
  };
  
  // Interactive 4 players for split payment
  const [splitPlayers, setSplitPlayers] = useState<Array<{ name: string; isMember: boolean; phone?: string; email?: string }>>([
    { name: 'Carlos Méndez', isMember: true, email: 'carlos.mendez@galiciapadel.com', phone: '+34 611 22 33 44' },
    { name: 'Pablo Vello', isMember: true, email: 'pablo.vello@email.es', phone: '+34 622 33 44 55' },
    { name: 'Lucas Piñeiro', isMember: false, email: 'lucas.pineiro@email.es', phone: '+34 633 44 55 66' },
    { name: 'David Castro', isMember: false, email: 'david.castro@email.es', phone: '+34 644 55 66 77' },
  ]);

  const clubRegisteredPlayers = React.useMemo(() => [
    { name: 'Carlos Méndez', isMember: true, label: 'Carlos Méndez (Socio #108 · Nivel 4.85)' },
    { name: 'Pablo Vello', isMember: true, label: 'Pablo Vello (Socio #019 · Nivel 4.80)' },
    { name: 'Laura Senra', isMember: true, label: 'Laura Senra (Socia Pro · Nivel 5.00)' },
    { name: 'Rosa Carballo', isMember: true, label: 'Rosa Carballo (Socia #042 · Nivel 3.90)' },
    { name: 'Mateo Varela', isMember: true, label: 'Mateo Varela (Socio #055 · Nivel 4.15)' },
    { name: 'Iván Gómez', isMember: true, label: 'Iván Gómez (Socio #087 · Nivel 3.45)' },
    { name: 'Lucas Piñeiro', isMember: false, label: 'Lucas Piñeiro (Invitado · Nivel 3.85)' },
    { name: 'David Castro', isMember: false, label: 'David Castro (Invitado · Nivel 4.10)' },
    { name: 'Marcos Soto', isMember: false, label: 'Marcos Soto (Invitado · Nivel 3.50)' },
  ], []);

  const timeRows = [
    '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '17:00', '18:30', '19:00', '20:00', '21:30', '22:30', '23:00 - 00:00'
  ];

  // Venues disponibles (en caso de existir varias sedes)
  const availableVenues = React.useMemo(() => {
    return venues && venues.length > 1 ? venues : INITIAL_VENUES;
  }, [venues]);

  const isAllVenuesSelected = selectedVenueId === 'all';

  // Filter displayed courts according to venue selection
  const displayedCourts = React.useMemo(() => {
    if (selectedVenueId === 'all') {
      return courts;
    }
    return courts.filter((c) => c.venueId === selectedVenueId || (!c.venueId && selectedVenueId === 'venue-san-mateo'));
  }, [courts, selectedVenueId]);

  const getBookingForSlot = (courtId: string, time: string) => {
    const normalizedTime = time.includes(' - ') ? time.split(' - ')[0] : time;
    return bookings.find((b) => {
      if (b.courtId !== courtId || b.status === 'canceled') return false;

      // Filter strictly by active venue if a specific venue is selected
      if (selectedVenueId !== 'all') {
        const c = courts.find((item) => item.id === courtId);
        const venue = b.venueId || c?.venueId || 'venue-san-mateo';
        if (venue !== selectedVenueId) return false;
      }

      // Filter strictly by current date
      const bDate = b.startTime.includes('T') ? b.startTime.split('T')[0] : b.startTime.slice(0, 10);
      if (bDate !== currentDate) return false;

      // Match time slot
      const bStart = b.startTime.includes('T') ? b.startTime.split('T')[1].slice(0, 5) : b.startTime.slice(11, 16);
      if (bStart === normalizedTime) return true;

      // Overlap or inclusion within slot window
      if (b.startTime && b.endTime) {
        const toMin = (iso: string) => {
          const t = iso.includes('T') ? iso.split('T')[1].slice(0, 5) : iso.slice(0, 5);
          const [h, m] = t.split(':').map(Number);
          return (h || 0) * 60 + (m || 0);
        };
        const [targetH, targetM] = normalizedTime.split(':').map(Number);
        const slotM = (targetH || 0) * 60 + (targetM || 0);
        const startM = toMin(b.startTime);
        const endM = toMin(b.endTime);

        if (slotM >= startM && slotM < endM) return true;
        if (startM >= slotM && startM < slotM + 90) return true;
      }
      return false;
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const court = courts.find((c) => c.id === newCourtId) || displayedCourts[0] || courts[0];
    const resolvedCourtVenueId = court.venueId || (selectedVenueId !== 'all' ? selectedVenueId : formVenueId || 'venue-san-mateo');
    const targetVenue = venues.find((v) => v.id === resolvedCourtVenueId) || venues[1] || venues[0];
    const startISO = `${currentDate}T${newTime}:00`;
    const hours = durationMinutes / 60;
    const finalPrice = (clientType === 'block' || clientType === 'club') ? 0 : court.hourlyRate * hours;
    
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
      clientDisplayName = selectedMember;
    } else if (clientType === 'anonymous') {
      clientDisplayName = 'Anónimo / Cliente Ocasional';
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

    const memberDiscountPercent = currentTenant.settings?.policies?.memberCourtDiscountPercent ?? 20;

    let participants: Booking['participants'];
    if (newSplit && clientType !== 'block' && clientType !== 'club') {
      const baseShare = finalPrice / 4;
      const invitedList = [
        { name: clientDisplayName, isMember: clientType === 'existing' },
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
      participants = [{
        name: clientDisplayName,
        paid: clientType === 'block' || clientType === 'club' || paymentConfig === 'club',
        amount: finalPrice,
      }];
    }

    const startH = parseInt(newTime.split(':')[0], 10);
    const startM = parseInt(newTime.split(':')[1], 10);
    const totalMinutes = startH * 60 + startM + durationMinutes;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    const endISO = `${currentDate}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;

    const paymentConfigNote = paymentConfig === 'online'
      ? 'Pago Online Exclusivo (Enlace remitido al titular)'
      : paymentConfig === 'club'
      ? 'Pago en Club (Mostrador / TPV)'
      : 'Pago Flexible (Online o Mostrador)';

    const newBooking = createBooking({
      courtId: court.id,
      courtName: court.name,
      venueId: targetVenue?.id,
      venueName: targetVenue?.name,
      venueShortName: targetVenue?.shortName,
      creatorId: createdCustomerId || (clientType === 'existing' ? 'socio-member' : clientType === 'club' ? 'club-internal' : clientType === 'anonymous' ? 'anon-guest' : 'reception-client'),
      creatorName: clientDisplayName,
      startTime: startISO,
      endTime: endISO,
      status: 'confirmed',
      totalPrice: finalPrice,
      paymentStatus: (clientType === 'block' || clientType === 'club') ? 'paid' : paymentConfig === 'online' ? 'pending' : newSplit ? 'partially_paid' : 'paid',
      isSplitPayment: newSplit && clientType !== 'block' && clientType !== 'club',
      mode: 'competitive',
      gender: 'mixed',
      notes: `${paymentConfigNote}. ${clientType === 'block' ? 'Bloqueo técnico de pista.' : clientType === 'club' ? 'Reserva institucional interna del club.' : ''}`,
      participants,
    });

    // 2. Si es pago dividido, emitir notificaciones individuales a los 4 jugadores
    if (newSplit && clientType !== 'block') {
      splitPlayers.forEach((p, idx) => {
        const pName = idx === 0 && clientType === 'new' ? clientDisplayName : p.name;
        const pAmount = (finalPrice / 4).toFixed(2);
        sendNotification({
          title: `🎾 Convocatoria y Pago Pendiente (${pAmount} €)`,
          message: `Hola ${pName}, has sido añadido a la reserva de ${court.name} para el ${currentDate} a las ${newTime} h. Confirma tu plaza y realiza el pago de tu cuota de ${pAmount} €.`,
          type: 'booking',
          actionUrl: `/partida/${newBooking.id}`,
        });
      });

      triggerDemoToast(
        'Pago Dividido · Avisos Enviados',
        `Se han emitido 4 notificaciones individuales con enlace directo a la pasarela de pago para cada jugador.`,
        'success'
      );
    } else {
      triggerDemoToast('Reserva Registrada', `Reserva creada con éxito en ${court.name}.`, 'success');
    }

    setShowNewModal(false);
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
  };

  // Convert Booking to Drawer & BookingListItem format
  const convertBookingToDrawer = (b: Booking): ReservationDrawerData => {
    const timeSlot = `${b.startTime.split('T')[1]?.slice(0, 5) || ''} - ${b.endTime?.split('T')[1]?.slice(0, 5) || ''}`;
    let statusText: string = b.status === 'canceled' ? 'Cancelada' : 'Confirmada';
    if (b.paymentStatus === 'pending' || b.paymentStatus === 'partially_paid') {
      statusText = 'Pendiente TPV';
    } else if (b.paymentStatus === 'paid') {
      statusText = 'Pagado';
    }

    const court = courts.find((c) => c.id === b.courtId);
    const resolvedVenueId = b.venueId || court?.venueId || 'venue-san-mateo';
    const venueObj = INITIAL_VENUES.find((v) => v.id === resolvedVenueId);

    return {
      id: b.id,
      venueId: resolvedVenueId,
      venueName: b.venueName || venueObj?.name,
      venueShortName: b.venueShortName || venueObj?.shortName,
      courtId: b.courtId,
      courtName: b.courtName || court?.name || 'Pista',
      courtType: 'Indoor Cristal Pro',
      startTime: b.startTime,
      endTime: b.endTime,
      timeSlot,
      creatorName: b.creatorName,
      creatorPhone: '+34 611 22 33 44',
      creatorMemberNum: 'Socio #SM-408',
      totalPrice: b.totalPrice,
      paymentStatus: b.paymentStatus,
      status: statusText,
      accessPin: b.accessPin || '4821#',
      category: b.category || (b.isSplitPayment ? 'match' : 'private'),
      title: b.title || (b.isSplitPayment ? 'Pádel Abierto' : `Reserva ${b.courtName}`),
      sport: 'Pádel Indoor WPT',
      mode: b.mode || 'competitive',
      gender: b.gender || 'mixed',
      participants: b.participants?.map((p) => ({
        name: p.name,
        paid: p.paid,
        amount: p.amount,
        statusText: p.paid ? 'Pagado' : 'Pendiente TPV',
      })),
      notes: b.notes,
    };
  };

  const handleOpenBooking = (b: Booking) => {
    const drawer = convertBookingToDrawer(b);
    setSelectedDrawerData(drawer);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/admin/reservas/${b.id}`);
    }
  };

  const handleCloseBooking = () => {
    setSelectedDrawerData(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/admin/reservas');
    }
  };

  // Filter day's bookings strictly by current date and venue
  const dayBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      if (b.status === 'canceled') return false;
      const bDate = b.startTime.includes('T') ? b.startTime.split('T')[0] : b.startTime.slice(0, 10);
      if (bDate !== currentDate) return false;
      if (selectedVenueId !== 'all') {
        const court = courts.find((c) => c.id === b.courtId);
        const venue = b.venueId || court?.venueId || 'venue-san-mateo';
        if (venue !== selectedVenueId) return false;
      }
      return true;
    });
  }, [bookings, currentDate, selectedVenueId, courts]);

  const isPlayerRole =
    currentView === 'player' ||
    currentUser.role === 'PLAYER' ||
    currentUser.role === 'PROFESSIONAL_PLAYER';

  return (
    <div className="max-w-7xl mx-auto pt-2 pb-16 space-y-4 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased">
      {/* ======================================================================
          1. CABECERA LIMPIA Y SIMÉTRICA (ESTILO INICIO)
          ====================================================================== */}
      <section className="pt-[26px] pb-1 space-y-3">
        {/* Título de sección limpio y simétrico con Inicio (sin icono de calendario ni subtítulos) */}
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0B1A2D] dark:text-white tracking-tight leading-tight">
            {t('agenda.title', 'Reservas y Disponibilidad')}
          </h1>
        </div>

        {/* Pill de Sede y Estado Operativo Unificado idéntico a la página de Inicio */}
        <div className="relative">
          <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            {/* Selector de Sede */}
            <div
              onClick={() => setIsVenueSelectorOpen(!isVenueSelectorOpen)}
              className="flex items-center gap-2 cursor-pointer group select-none min-w-0"
              title="Cambiar sede activa o ver red consolidada"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-100 dark:border-[#1A314D] flex items-center justify-center text-[#0B1A2D] dark:text-slate-200 shrink-0">
                <Building2 className="w-4 h-4 text-[#0B1A2D] dark:text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#0B1A2D] dark:text-white truncate">
                    {isConsolidatedView ? 'Todas las Sedes' : selectedVenue.shortName || selectedVenue.name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B1A2D] dark:group-hover:text-white transition-transform ${
                      isVenueSelectorOpen ? 'rotate-180 text-[#0B1A2D] dark:text-white' : ''
                    }`}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-400 block truncate">
                  {venues.length > 1 ? `${venues.length} sedes conectadas` : 'Sede oficial'}
                </span>
              </div>
            </div>

            {/* Badge Dinámico de Apertura / Resumen Multisede */}
            <button
              type="button"
              onClick={isConsolidatedView ? () => setIsVenueSelectorOpen((prev) => !prev) : toggleClubOpenState}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0FCCF] dark:bg-[#B7F229]/20 border border-[#B7F229]/50 transition-all cursor-pointer hover:scale-102 shrink-0 select-none"
              title={
                isConsolidatedView
                  ? `Red multisede consolidada (${venues.length} sedes operativas)`
                  : 'Haz clic para conmutar estado de apertura de la sede'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConsolidatedView
                    ? 'bg-[#82b805] dark:bg-[#B7F229]'
                    : isClubOpen
                    ? 'bg-[#82b805] animate-pulse'
                    : 'bg-rose-500'
                }`}
              />
              <span className="text-[11px] font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                {isConsolidatedView
                  ? `${venues.length} Sedes Activas`
                  : isClubOpen
                  ? 'Abierto · hasta 23:30'
                  : 'Cerrado temporal'}
              </span>
            </button>
          </div>

          {/* Menú Desplegable de Sedes */}
          {isVenueSelectorOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-30 p-2 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200 dark:border-[#1A314D] shadow-xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1">
                Red Deportiva · Seleccionar Sede
              </div>

              {venues.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVenueId('all');
                    setIsVenueSelectorOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    isConsolidatedView
                      ? 'bg-[#B7F229]/20 text-[#0B1A2D] dark:text-white'
                      : 'hover:bg-slate-50 dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Todas las Sedes (Consolidado)</span>
                  </span>
                  {isConsolidatedView && <CheckCircle2 className="w-3.5 h-3.5 text-[#82b805]" />}
                </button>
              )}

              {venues
                .filter((v) => v.id !== 'all')
                .map((venue) => {
                  const isSelected = !isConsolidatedView && selectedVenueId === venue.id;
                  return (
                    <button
                      key={venue.id}
                      type="button"
                      onClick={() => {
                        setSelectedVenueId(venue.id);
                        setIsVenueSelectorOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                        isSelected
                          ? 'bg-[#B7F229]/20 text-[#0B1A2D] dark:text-white'
                          : 'hover:bg-slate-50 dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{venue.name}</span>
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#82b805] shrink-0" />}
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* Fila de Controles: Selector de Fecha + Botón '+ Nueva reserva' (Lado a lado) */}
        <div className="flex items-center gap-2">
          {/* Selector de Fecha Tipo Ribbon */}
          <div className="flex-1 min-w-0 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl px-2 py-2 shadow-2xs h-10">
            <button
              type="button"
              onClick={() => stepDate(-1)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-90 transition-transform cursor-pointer shrink-0"
              title="Día anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="relative flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white cursor-pointer select-none truncate">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{formattedDateLabel}</span>
              <input
                ref={dateInputRef}
                type="date"
                value={currentDate}
                onChange={(e) => {
                  if (e.target.value) setCurrentDate(e.target.value);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                aria-label="Seleccionar fecha"
              />
            </div>
            <button
              type="button"
              onClick={() => stepDate(1)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-90 transition-transform cursor-pointer shrink-0"
              title="Día siguiente"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Botón CTA '+ Nueva reserva' invertido en Azul Profundo (#0B1A2D) con acentos en Verde Lima (#B7F229) o blanco */}
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="flex-1 min-w-0 flex items-center justify-center gap-1.5 bg-[#0B1A2D] hover:bg-[#132A45] active:scale-95 text-white font-black rounded-xl px-2.5 py-2 text-xs sm:text-sm shadow-sm border border-[#0B1A2D] dark:border-slate-700 transition-all cursor-pointer h-10 group"
          >
            <Plus className="w-4 h-4 stroke-[3] text-[#B7F229] group-hover:rotate-90 transition-transform shrink-0" />
            <span className="truncate">{t('agenda.new_booking', 'Nueva reserva')}</span>
          </button>
        </div>

        {/* Acceso Rápido: Todas las reservas */}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.history.pushState({}, '', '/admin/reservas/todas');
            }
            setShowAllBookingsView(true);
          }}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold text-[#0B1A2D] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors shadow-2xs active:scale-[0.99] cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#64748B] dark:text-slate-400" />
          <span>Todas las reservas</span>
        </button>
      </section>

      {/* ======================================================================
          2. FILA DE SEDES MINIMALISTA CON MICRO-DOTS DE MARCA (RIBBON)
          ====================================================================== */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5 px-0.5">
        {availableVenues
          .filter((v) => v.id !== 'all')
          .map((v) => {
            const isSelected = selectedVenueId === v.id;
            const dotColor =
              v.id === 'venue-san-mateo'
                ? 'bg-[#B7F229] ring-[#B7F229]/40'
                : v.id === 'venue-coruna'
                ? 'bg-[#0B1A2D] dark:bg-sky-400 ring-[#0B1A2D]/30 dark:ring-sky-400/30'
                : v.id === 'venue-santiago'
                ? 'bg-[#8B5CF6] ring-[#8B5CF6]/40'
                : 'bg-sky-500 ring-sky-500/30';

            const cleanName = (v.shortName || v.name).replace(/^Sede\s+/i, '');

            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVenueId(isSelected ? 'all' : v.id)}
                className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-2xs text-[11px] sm:text-xs transition cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-[#0B1A2D] dark:border-[#B7F229] font-bold text-[#0B1A2D] dark:text-white ring-2 ring-[#0B1A2D]/15 dark:ring-[#B7F229]/25 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ring-2 shrink-0 ${dotColor}`} />
                <span className="whitespace-nowrap">{cleanName}</span>
              </button>
            );
          })}
      </div>

      {/* ======================================================================
          3. CUADRANTE DE DISPONIBILIDAD (GRID UNIFICADO HASTA LAS 00:00)
          ====================================================================== */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm space-y-3">
        {/* Cabecera del Cuadrante */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
              <Calendar className="w-4 h-4 text-[#8B5CF6]" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#0B1A2D] dark:text-white">
              Turnos en Tiempo Real
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-[#64748B] dark:text-slate-400 font-medium">
              Desliza pistas →
            </span>
          </div>
        </div>

        {/* Matriz interactiva de turnos */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[420px]">
            {/* Header Courts Row con columnas dinámicas */}
            <div
              className="pb-2.5 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 items-end"
              style={{
                display: 'grid',
                gridTemplateColumns: `80px repeat(${displayedCourts.length}, minmax(135px, 1fr))`,
                gap: '8px',
              }}
            >
              <div className="text-left pl-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  HORA
                </span>
              </div>
              {displayedCourts.map((court) => {
                const courtVenue = availableVenues.find((v) => v.id === court.venueId) || availableVenues[1] || availableVenues[0];
                const venueInfo = (() => {
                  if (court.venueId === 'venue-san-mateo' || (!court.venueId && court.name.includes('Pista'))) {
                    return { name: 'San Mateo', dot: 'bg-[#B7F229]' };
                  }
                  if (court.venueId === 'venue-coruna') {
                    return { name: 'A Coruña', dot: 'bg-[#0B1A2D] dark:bg-sky-400' };
                  }
                  if (court.venueId === 'venue-santiago') {
                    return { name: 'Santiago', dot: 'bg-[#8B5CF6]' };
                  }
                  if (court.venueId === 'venue-vigo') {
                    return { name: 'Vigo', dot: 'bg-sky-500' };
                  }
                  const name = (courtVenue?.shortName || courtVenue?.name || 'San Mateo')
                    .replace(/^Sede\s+/i, '')
                    .replace(/\s*\(.*\)$/, '')
                    .trim();
                  return { name, dot: 'bg-slate-400' };
                })();

                return (
                  <div
                    key={court.id}
                    className="rounded-xl px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-left flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {court.name.split('—')[0].trim()}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                        {court.hourlyRate}€/h
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate pt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${venueInfo.dot}`} />
                      <span className="truncate">{venueInfo.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Rows Unificadas */}
            <div className="space-y-2 pt-2">
              {timeRows.map((time) => {
                const isLateSlot = time === '23:00 - 00:00';
                return (
                  <div
                    key={time}
                    className="items-center"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `80px repeat(${displayedCourts.length}, minmax(135px, 1fr))`,
                      gap: '8px',
                    }}
                  >
                    <div className="text-xs font-semibold text-[#64748B] dark:text-slate-400 pl-1 font-mono">
                      {time}
                    </div>

                    {displayedCourts.map((court) => {
                      const booking = getBookingForSlot(court.id, time);
                      const courtVenueId = court.venueId || booking?.venueId || 'venue-san-mateo';

                      const borderAccent =
                        courtVenueId === 'venue-san-mateo'
                          ? 'border-l-4 border-l-[#B7F229]'
                          : courtVenueId === 'venue-santiago'
                          ? 'border-l-4 border-l-[#8B5CF6]'
                          : courtVenueId === 'venue-coruna'
                          ? 'border-l-4 border-l-[#0B1A2D] dark:border-l-sky-400'
                          : 'border-l-4 border-l-[#64748B]';

                      const dotAccent =
                        courtVenueId === 'venue-san-mateo'
                          ? 'bg-[#B7F229] ring-[#B7F229]/40'
                          : courtVenueId === 'venue-santiago'
                          ? 'bg-[#8B5CF6] ring-[#8B5CF6]/40'
                          : courtVenueId === 'venue-coruna'
                          ? 'bg-[#0B1A2D] dark:bg-sky-400 ring-[#0B1A2D]/30'
                          : 'bg-[#64748B] ring-[#64748B]/30';

                      if (booking) {
                        return (
                          <div
                            key={court.id}
                            onClick={() => handleOpenBooking(booking)}
                            className={`bg-white dark:bg-slate-800/90 border border-[#E5E7EB] dark:border-slate-700 rounded-xl px-2.5 py-2 shadow-2xs flex flex-col justify-between h-[58px] cursor-pointer hover:shadow-xs active:scale-98 transition ${borderAccent}`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-[#0B1A2D] dark:text-white truncate">
                                {booking.creatorName.split(' ')[0]} {booking.creatorName.split(' ')[1]?.[0] ? `${booking.creatorName.split(' ')[1][0]}.` : ''}
                              </span>
                              <span className={`w-2 h-2 rounded-full shrink-0 ring-2 ${dotAccent}`} />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-slate-400">
                              <span className="font-bold text-[#0B1A2D] dark:text-white font-mono">
                                {isPlayerRole
                                  ? `${(booking.participants?.[0]?.amount || (booking.totalPrice / 4)).toFixed(0)}€`
                                  : `${booking.totalPrice}€`}
                              </span>
                              <span className="font-mono text-[10px]">
                                {booking.accessPin ? `PIN: ${booking.accessPin}` : `#${booking.id.slice(-4)}`}
                              </span>
                            </div>
                          </div>
                        );
                      }

                      if (isLateSlot) {
                        return (
                          <button
                            key={court.id}
                            type="button"
                            onClick={() => {
                              setNewCourtId(court.id);
                              setNewTime('23:00');
                              setShowNewModal(true);
                            }}
                            className="border border-dashed border-[#E5E7EB] dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl px-2.5 py-2 text-center text-[#64748B] dark:text-slate-400 text-xs font-semibold transition active:scale-95 flex items-center justify-center gap-1.5 h-[58px] shadow-2xs cursor-pointer"
                            title={`Turno tardío / Cierre en ${court.name}`}
                          >
                            <Lock className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-500" />
                            <span>Cierre</span>
                          </button>
                        );
                      }

                      return (
                        <button
                          key={court.id}
                          type="button"
                          onClick={() => {
                            setNewCourtId(court.id);
                            setNewTime(time);
                            setShowNewModal(true);
                          }}
                          className="border border-dashed border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl px-2.5 py-2 text-center text-[#64748B] dark:text-slate-400 text-xs font-semibold transition active:scale-95 flex items-center justify-center gap-1 h-[58px] shadow-2xs cursor-pointer"
                          title={`Reservar ${court.name} a las ${time}`}
                        >
                          <Plus className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400" />
                          <span>Disponible</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          4. BLOQUE "RESERVAS DEL DÍA" (ESPACIADO GENEROSO Y COHERENCIA CON INICIO)
          ====================================================================== */}
      <section className="mt-8 pt-1 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
            Reservas del Día
          </h2>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.history.pushState({}, '', '/admin/reservas/todas');
              }
              setShowAllBookingsView(true);
            }}
            className="text-xs font-bold text-[#8B5CF6] dark:text-purple-400 hover:underline cursor-pointer"
          >
            ver todas
          </button>
        </div>

        {dayBookings.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            No hay reservas registradas para esta fecha y sede. Puedes hacer clic en una pista disponible para reservar.
          </div>
        ) : (
          <div className="space-y-3">
            {dayBookings.map((b) => {
              const drawerData = convertBookingToDrawer(b);
              return (
                <BookingListItem
                  key={b.id}
                  booking={drawerData}
                  onClick={() => handleOpenBooking(b)}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* DRAWER OPERATIVO DE DETALLE DE RESERVA (/admin/reservas/[id]) */}
      <ReservationDrawer
        isOpen={!!selectedDrawerData}
        reservation={selectedDrawerData}
        onClose={handleCloseBooking}
        onCancelReservation={(id) => {
          cancelBooking(id);
          handleCloseBooking();
        }}
        onOpenPlayerProfile={(playerName) => {
          handleCloseBooking();
          navigateToPlayerProfile(playerName);
        }}
      />

      {/* ======================================================================
          4. MODAL EXPANSIVO / OVERLAY PROFESIONAL: HISTORIAL RESERVAS
          (Conserva exactamente el contexto de navegación para regresar al cuadrante)
          ====================================================================== */}
      {showAllBookingsView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-2 sm:p-4 md:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-7xl h-[92vh] max-h-[92vh] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header del Modal Expansivo */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-white dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Historial de Reservas
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#87F229] hover:bg-[#97f842] text-[#0B1A2D] font-black text-xs shadow-md shadow-[#87F229]/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap"
                  title="Crear nueva reserva de pista"
                >
                  <Plus className="w-4 h-4 shrink-0 stroke-[3]" />
                  <span>Nueva reserva</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAllBookingsView(false);
                    if (typeof window !== 'undefined') {
                      window.history.pushState({}, '', '/admin/reservas');
                    }
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Cerrar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenido scrolleable del historial */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <AllBookingsPage
                isModal={true}
                onBackToQuadrant={() => {
                  setShowAllBookingsView(false);
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/admin/reservas');
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVA RESERVA EN MOSTRADOR */}
      <NewBookingModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        defaultDate={currentDate}
        defaultTime={newTime}
        defaultCourtId={newCourtId}
        defaultVenueId={selectedVenueId !== 'all' ? selectedVenueId : undefined}
      />
    </div>
  );
};

export default AdminAgenda;
