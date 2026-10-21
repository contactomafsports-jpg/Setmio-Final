import React, { useState } from 'react';
import { useApp, INITIAL_VENUES } from '../../context/AppContext';
import { Booking, Court } from '../../types/database';
import { ReservationDrawer, ReservationDrawerData } from './ReservationDrawer';
import { BookingListItem, BookingListItemData } from './BookingListItem';
import { AllBookingsPage } from './AllBookingsPage';
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
    shortName: 'San Mateo',
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
    shortName: 'A Coruña',
    dotBg: 'bg-indigo-500',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/70',
    badgeBorder: 'border-indigo-300 dark:border-indigo-800',
    badgeText: 'text-indigo-800 dark:text-indigo-300',
    slotBg: 'bg-indigo-50/95 dark:bg-indigo-950/75',
    slotBorder: 'border-indigo-500/70 dark:border-indigo-500/80',
    hoverBorder: 'hover:border-indigo-600 dark:hover:border-indigo-400',
    pinText: 'text-indigo-700 dark:text-indigo-400',
    accentText: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
  },
  'venue-santiago': {
    name: 'Sede Santiago (Compostela)',
    shortName: 'Santiago',
    dotBg: 'bg-amber-500',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/70',
    badgeBorder: 'border-amber-300 dark:border-amber-800',
    badgeText: 'text-amber-800 dark:text-amber-300',
    slotBg: 'bg-amber-50/95 dark:bg-amber-950/75',
    slotBorder: 'border-amber-500/70 dark:border-amber-500/80',
    hoverBorder: 'hover:border-amber-600 dark:hover:border-amber-400',
    pinText: 'text-amber-700 dark:text-amber-400',
    accentText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
  },
  'venue-vigo': {
    name: 'Sede Vigo (Rías Baixas)',
    shortName: 'Vigo',
    dotBg: 'bg-sky-500',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/70',
    badgeBorder: 'border-sky-300 dark:border-sky-800',
    badgeText: 'text-sky-800 dark:text-sky-300',
    slotBg: 'bg-sky-50/95 dark:bg-sky-950/75',
    slotBorder: 'border-sky-500/70 dark:border-sky-500/80',
    hoverBorder: 'hover:border-sky-600 dark:hover:border-sky-400',
    pinText: 'text-sky-700 dark:text-sky-400',
    accentText: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
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
    createBooking,
    updateBooking,
    cancelBooking,
    toggleCourtLight,
    currentUser,
    currentTenant,
    isMultiVenue,
    venues,
    selectedVenueId,
    setSelectedVenueId,
    triggerDemoToast,
    navigateToPlayerProfile,
    addCustomer,
    sendNotification,
    currentView,
    t,
  } = useApp();

  const [currentDate, setCurrentDate] = useState('2026-09-30');
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
  const [clientType, setClientType] = useState<'existing' | 'new' | 'anonymous' | 'block'>('existing');
  const [selectedMember, setSelectedMember] = useState('Carlos Méndez (Socio 108)');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newSplit, setNewSplit] = useState(false);
  
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
    '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '17:00', '18:30', '19:00', '20:00', '21:30'
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
      if (bStart === time) return true;

      // Overlap or inclusion within slot window
      if (b.startTime && b.endTime) {
        const toMin = (iso: string) => {
          const t = iso.includes('T') ? iso.split('T')[1].slice(0, 5) : iso.slice(0, 5);
          const [h, m] = t.split(':').map(Number);
          return (h || 0) * 60 + (m || 0);
        };
        const [targetH, targetM] = time.split(':').map(Number);
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
    const court = courts.find((c) => c.id === newCourtId) || courts[0];
    const targetVenue = isMultiVenue
      ? (venues.find((v) => v.id === formVenueId) || venues[1] || venues[0])
      : (court.venueId ? venues.find((v) => v.id === court.venueId) : venues[1] || venues[0]);
    const startISO = `${currentDate}T${newTime}:00`;
    const hours = durationMinutes / 60;
    const finalPrice = clientType === 'block' ? 0 : court.hourlyRate * hours;
    
    let clientDisplayName = 'Cliente Mostrador';
    let createdCustomerId: string | undefined = undefined;

    if (clientType === 'block') {
      clientDisplayName = `BLOQUEO: ${newClientName || 'Mantenimiento / Evento Club'}`;
    } else if (clientType === 'existing') {
      clientDisplayName = selectedMember;
    } else if (clientType === 'anonymous') {
      clientDisplayName = 'Anónimo / Cliente Ocasional';
    } else {
      // 1. Crear nuevo cliente en la base de datos (CRM)
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
        `Ficha CRM creada para ${newCust.name} (${newCust.email}). Asignado como titular de la reserva.`,
        'success'
      );
    }

    const memberDiscountPercent = currentTenant.settings?.policies?.memberCourtDiscountPercent ?? 20;

    let participants: Booking['participants'];
    if (newSplit && clientType !== 'block') {
      const baseShare = finalPrice / 4;
      participants = splitPlayers.map((p, idx) => {
        const playerName = idx === 0 && clientType === 'new' ? clientDisplayName : (p.name || `Jugador ${idx + 1}`);
        const discounted = p.isMember ? baseShare * (1 - memberDiscountPercent / 100) : baseShare;
        return {
          name: playerName,
          paid: idx === 0,
          amount: parseFloat(discounted.toFixed(2)),
        };
      });
    } else {
      participants = [{ name: clientDisplayName, paid: true, amount: finalPrice }];
    }

    const startH = parseInt(newTime.split(':')[0], 10);
    const startM = parseInt(newTime.split(':')[1], 10);
    const totalMinutes = startH * 60 + startM + durationMinutes;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    const endISO = `${currentDate}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;

    const newBooking = createBooking({
      courtId: court.id,
      courtName: court.name,
      venueId: targetVenue?.id,
      venueName: targetVenue?.name,
      venueShortName: targetVenue?.shortName,
      creatorId: createdCustomerId || (clientType === 'existing' ? 'socio-member' : clientType === 'anonymous' ? 'anon-guest' : 'reception-client'),
      creatorName: clientDisplayName,
      startTime: startISO,
      endTime: endISO,
      status: 'confirmed',
      totalPrice: finalPrice,
      paymentStatus: clientType === 'block' ? 'paid' : newSplit ? 'partially_paid' : 'paid',
      isSplitPayment: newSplit,
      mode: 'competitive',
      gender: 'mixed',
      participants,
      notes: clientType === 'block'
        ? 'Pista bloqueada administrativamente por recepción.'
        : clientType === 'anonymous'
        ? 'Reserva mostrador anónima sin datos personales registrados.'
        : clientType === 'new'
        ? `Cliente nuevo registrado en reserva: ${newClientEmail} · ${newClientPhone}`
        : undefined,
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
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto">
      {/* ======================================================================
          1. ENCABEZADO DE PÁGINA (RESPONSIVE: 2 FILAS EN MÓVIL, 1 EN DESKTOP)
          ====================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        {/* Título y subtítulo */}
        <div className="w-full sm:w-auto min-w-0">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('agenda.eyebrow', 'Cuadrante Ocupación')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            {t('agenda.title', 'Reservas y Disponibilidad')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
            {selectedVenueId !== 'all'
              ? `Filtrado activo: ${availableVenues.find((v) => v.id === selectedVenueId)?.shortName || 'Sede Seleccionada'}`
              : t('agenda.subtitle', 'Cuadrante interactivo y gestión diaria de pistas del club')}
          </p>
        </div>

        {/* Botonera Superior Responsive:
            - Selector de Sede Dinámico
            - Selector de Fecha
            - Botón Nueva Reserva
            - Historial Reservas */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 flex-wrap">
          {/* Selector de Sede Dinámico (en caso de existir varias sedes) */}
          {availableVenues.length > 1 && (
            <div className="w-full sm:w-auto relative inline-flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-xs transition hover:border-emerald-500/50 shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-slate-400 font-medium">Sede:</span>
                </div>
                <select
                  value={selectedVenueId}
                  onChange={(e) => setSelectedVenueId(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-hidden text-xs pr-1"
                  aria-label="Filtrar por sede"
                >
                  <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">
                    Todas las sedes
                  </option>
                  {availableVenues
                    .filter((v) => v.id !== 'all')
                    .map((v) => (
                      <option
                        key={v.id}
                        value={v.id}
                        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        {v.shortName || v.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}

          {/* Fila en móvil: Selector de Fecha + Botón Nueva Reserva */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Selector de Fecha */}
            <div className="flex-1 sm:flex-none relative inline-flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-xs transition hover:border-emerald-500/50 shrink-0">
              <button
                type="button"
                onClick={() => stepDate(-1)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Día anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div
                className="relative flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition select-none flex-1 sm:flex-none"
                title="Seleccionar otra fecha"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-xs font-bold whitespace-nowrap">
                  {formattedDateLabel}
                </span>
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
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Día siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Botón Nueva Reserva (Único icono +) */}
            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="px-3.5 sm:px-4 py-2.5 sm:py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs shadow-sm transition shrink-0 whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Nueva reserva</span>
            </button>
          </div>

          {/* Historial reservas */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.history.pushState({}, '', '/admin/reservas/todas');
              }
              setShowAllBookingsView(true);
            }}
            className="w-full sm:w-auto px-3.5 py-2.5 sm:py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-xs transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Historial reservas</span>
          </button>
        </div>
      </div>

      {/* Indicador de sede activa si se filtra por sede específica */}
      {selectedVenueId !== 'all' && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-xs">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>
              Sede Activa: {availableVenues.find((v) => v.id === selectedVenueId)?.name || 'Sede'} ({displayedCourts.length} pistas en cuadrante)
            </span>
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
            {dayBookings.length} reservas para este día
          </span>
        </div>
      )}

      {/* ======================================================================
          LEYENDA DESCRIPTIVA MULTISEDE
          (Visible únicamente cuando está seleccionada la opción "Todas las sedes")
          ====================================================================== */}
      {selectedVenueId === 'all' && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Leyenda de Sedes en Cuadrante Consolidado:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {availableVenues
              .filter((v) => v.id !== 'all')
              .map((v) => {
                const theme = getVenueTheme(v.id);
                return (
                  <div
                    key={v.id}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-2xs ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${theme.dotBg} ring-2 ring-white dark:ring-slate-900 shrink-0`} />
                    <span>{v.shortName || v.name}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ======================================================================
          2. TABLA DE DISPONIBILIDAD (CUADRANTE DINÁMICO POR SEDE Y FECHA)
          ====================================================================== */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header Courts Row con columnas dinámicas estrictas según displayedCourts */}
            <div
              className="border-b border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/90 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-t-xl"
              style={{
                display: 'grid',
                gridTemplateColumns: `80px repeat(${displayedCourts.length}, minmax(130px, 1fr))`,
              }}
            >
              <div className="p-3 text-center text-slate-500 dark:text-slate-400 font-bold border-r border-slate-200 dark:border-slate-700/80 flex items-center justify-center">
                Hora
              </div>
              {displayedCourts.map((court) => {
                const courtVenueTheme = getVenueTheme(court.venueId);
                return (
                  <div
                    key={court.id}
                    className="p-3 border-r border-slate-200 dark:border-slate-700/80 last:border-r-0 flex flex-col justify-between"
                  >
                    <div>
                      {selectedVenueId === 'all' && (
                        <div className="mb-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border truncate max-w-full ${courtVenueTheme.badgeBg} ${courtVenueTheme.badgeBorder} ${courtVenueTheme.badgeText}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${courtVenueTheme.dotBg} shrink-0`} />
                            <span className="truncate">{courtVenueTheme.shortName}</span>
                          </span>
                        </div>
                      )}
                      <div className="font-extrabold text-slate-900 dark:text-white truncate text-[11px]">
                        {court.name.split('—')[0]}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{court.hourlyRate}€/h</span>
                      <button
                        type="button"
                        onClick={() => toggleCourtLight(court.id)}
                        className={`p-1 rounded transition cursor-pointer ${
                          court.isLightOn
                            ? 'text-amber-500 hover:text-amber-400'
                            : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                        }`}
                        title="Conmutar focos"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Rows dinámicas */}
            {timeRows.map((time) => (
              <div
                key={time}
                className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 text-xs transition-colors"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `80px repeat(${displayedCourts.length}, minmax(130px, 1fr))`,
                }}
              >
                <div className="p-3 text-center font-mono text-slate-700 dark:text-slate-200 font-bold border-r border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/90 flex items-center justify-center">
                  {time}
                </div>

                {displayedCourts.map((court) => {
                  const booking = getBookingForSlot(court.id, time);
                  const courtVenueId = court.venueId || booking?.venueId || 'venue-san-mateo';
                  const venueTheme = getVenueTheme(courtVenueId);

                  return (
                    <div
                      key={court.id}
                      className="p-1.5 border-r border-slate-100 dark:border-slate-700/50 last:border-r-0 min-h-[62px] flex items-center"
                    >
                      {booking ? (
                        <button
                          type="button"
                          onClick={() => handleOpenBooking(booking)}
                          className={`w-full h-full p-2 rounded-xl text-left transition shadow-xs group cursor-pointer border ${
                            selectedVenueId === 'all'
                              ? `${venueTheme.slotBg} ${venueTheme.slotBorder} ${venueTheme.hoverBorder}`
                              : 'bg-slate-100 dark:bg-slate-800 border-emerald-500/40 hover:border-emerald-500 dark:hover:border-emerald-400'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <div
                              className={`font-bold text-slate-900 dark:text-white truncate text-[11px] transition ${
                                selectedVenueId === 'all'
                                  ? venueTheme.accentText
                                  : 'group-hover:text-emerald-500 dark:group-hover:text-emerald-400'
                              }`}
                            >
                              {booking.creatorName}
                            </div>
                            {selectedVenueId === 'all' && (
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${venueTheme.dotBg} ring-1 ring-white/60 dark:ring-black/40`}
                                title={venueTheme.name}
                              />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-300 flex items-center justify-between font-medium mt-0.5">
                            <span className="font-bold">
                              {isPlayerRole
                                ? `${(booking.participants?.[0]?.amount || (booking.totalPrice / 4)).toFixed(2)}€`
                                : `${booking.totalPrice}€`}
                            </span>
                            <span
                              className={`font-mono font-bold ${
                                selectedVenueId === 'all'
                                  ? venueTheme.pinText
                                  : 'text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              PIN {booking.accessPin || '4821#'}
                            </span>
                          </div>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setNewCourtId(court.id);
                            setNewTime(time);
                            setShowNewModal(true);
                          }}
                          className="w-full h-full rounded-xl border border-dashed border-emerald-500/25 hover:border-emerald-500 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                          title={`Reservar ${court.name} a las ${time}`}
                        >
                          <Plus className="w-3 h-3 text-emerald-500" />
                          <span>Libre</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================================
          3. BLOQUE "RESERVAS DEL DÍA" (REFRESCO DINÁMICO POR FECHA Y SEDE)
          ====================================================================== */}
      <section className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              Reservas del Día ({formattedDateLabel})
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              {dayBookings.length}
            </span>
          </div>
        </div>

        {dayBookings.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            No hay reservas registradas para esta fecha y sede. Puedes hacer clic en "+ Libre" para reservar una pista.
          </div>
        ) : (
          <div className="space-y-2.5">
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
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Histórico consolidado · Manteniendo el contexto del cuadrante activo
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAllBookingsView(false);
                    if (typeof window !== 'undefined') {
                      window.history.pushState({}, '', '/admin/reservas');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>Volver a la Agenda</span>
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
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Nueva Reserva en Mostrador</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Recepción Pádel San Mateo</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs mt-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Tipo de Operación</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setClientType('existing')}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition ${
                      clientType === 'existing'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Socio Club
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientType('new')}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition ${
                      clientType === 'new'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Nuevo / Libre
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientType('anonymous')}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition ${
                      clientType === 'anonymous'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Anónimo / Ocasional
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientType('block')}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition ${
                      clientType === 'block'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Bloqueo Pista
                  </button>
                </div>
              </div>

              {clientType === 'anonymous' && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
                  Reserva rápida de mostrador: se asignará el identificador "Anónimo / Cliente Ocasional" con cobro directo en caja sin registrar ficha CRM.
                </div>
              )}

              {clientType === 'existing' && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Seleccionar Socio</label>
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {clubRegisteredPlayers.map((player, idx) => (
                      <option key={idx} value={player.label}>
                        {player.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(clientType === 'new' || clientType === 'block') && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      {clientType === 'block' ? 'Motivo del Bloqueo' : 'Nombre Cliente'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={clientType === 'block' ? 'Ej. Mantenimiento Focos' : 'Nombre completo'}
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                      {clientType === 'block' ? 'Responsable' : 'Teléfono Contacto'}
                    </label>
                    <input
                      type="text"
                      placeholder={clientType === 'block' ? 'Recepción' : '+34 600...'}
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Pista</label>
                  <select
                    value={newCourtId}
                    onChange={(e) => setNewCourtId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {courts.map((court) => (
                      <option key={court.id} value={court.id}>
                        {court.name.split('—')[0]} ({court.hourlyRate}€/h)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Hora</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {timeRows.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Duración</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value) as any)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                    <option value={120}>120 min</option>
                  </select>
                </div>
              </div>

              {clientType !== 'block' && (
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newSplit}
                      onChange={(e) => setNewSplit(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Activar pago dividido (4 jugadores independientes)
                    </span>
                  </label>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
                >
                  Confirmar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAgenda;
