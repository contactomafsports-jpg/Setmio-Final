import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types/database';
import { BookingListItem, BookingListItemData } from './BookingListItem';
import { ReservationDrawer, ReservationDrawerData } from './ReservationDrawer';
import { NewBookingModal } from './NewBookingModal';
import {
  Calendar,
  Search,
  Filter,
  ArrowLeft,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Building2,
  X,
  CreditCard,
  Shield,
  Layers,
} from 'lucide-react';

interface AllBookingsPageProps {
  onBackToQuadrant?: () => void;
  onOpenNewBookingModal?: () => void;
  isModal?: boolean;
}

export const AllBookingsPage: React.FC<AllBookingsPageProps> = ({
  onBackToQuadrant,
  onOpenNewBookingModal,
  isModal = false,
}) => {
  const {
    bookings,
    courts,
    venues,
    selectedVenueId,
    setSelectedVenueId,
    isMultiVenue,
    createBooking,
    setAdminTab,
    triggerDemoToast,
    navigateToPlayerProfile,
    t,
  } = useApp();

  // Scroll to top on enter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'canceled'>('all');
  const [courtFilter, setCourtFilter] = useState<string>('all');
  const [venueFilter, setVenueFilter] = useState<string>(selectedVenueId || 'all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedDrawerBooking, setSelectedDrawerBooking] = useState<ReservationDrawerData | null>(null);

  // Sincronizar bidireccionalmente con selectedVenueId de AppContext
  useEffect(() => {
    if (selectedVenueId) {
      setVenueFilter(selectedVenueId);
    }
  }, [selectedVenueId]);

  const handleVenueFilterChange = (vId: string) => {
    setVenueFilter(vId);
    setSelectedVenueId(vId);
  };

  // Modal Nueva Reserva Integrado (Soluciona Tarea 2)
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [newCourtId, setNewCourtId] = useState(courts[0]?.id || 'court-1');
  const [newVenueId, setNewVenueId] = useState(venues[1]?.id || venues[0]?.id || 'venue-san-mateo');
  const [newDate, setNewDate] = useState('2026-10-10');
  const [newTime, setNewTime] = useState('18:00');
  const [newDuration, setNewDuration] = useState<60 | 90 | 120>(90);
  const [newClientType, setNewClientType] = useState<'member' | 'activity' | 'tournament' | 'block'>('member');
  const [newClientName, setNewClientName] = useState('Carlos Méndez');
  const [newPrice, setNewPrice] = useState('28');

  // Acciones de Navegación Precisas
  const handleGoToAgenda = () => {
    setAdminTab('agenda');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/gestion/reservas');
    }
    if (onBackToQuadrant) {
      onBackToQuadrant();
    }
  };

  const handleOpenNewBooking = () => {
    setIsNewBookingModalOpen(true);
  };

  // Recalcular precio automáticamente según tipo de actividad (Regla Tarea 3: 0€ para clases/escuela/torneo)
  useEffect(() => {
    const court = courts.find((c) => c.id === newCourtId) || courts[0];
    const hours = newDuration / 60;
    const basePrice = (court?.hourlyRate || 20) * hours;

    if (newClientType === 'activity' || newClientType === 'tournament' || newClientType === 'block') {
      setNewPrice('0');
    } else {
      setNewPrice(String(basePrice));
    }
  }, [newCourtId, newDuration, newClientType, courts]);

  const handleCreateBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const court = courts.find((c) => c.id === newCourtId) || courts[0];
    const targetVenue = venues.find((v) => v.id === newVenueId) || venues[1] || venues[0];

    const startH = parseInt(newTime.split(':')[0], 10);
    const startM = parseInt(newTime.split(':')[1], 10);
    const totalMinutes = startH * 60 + startM + newDuration;
    const endH = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const endM = String(totalMinutes % 60).padStart(2, '0');

    const startISO = `${newDate}T${newTime}:00`;
    const endISO = `${newDate}T${endH}:${endM}:00`;

    const finalPrice = parseFloat(newPrice) || 0;

    let cat: 'private' | 'academy' | 'tournament' = 'private';
    let title = `Reserva ${court?.name || 'Pista'}`;
    if (newClientType === 'activity') {
      cat = 'academy';
      title = 'Clase Oficial de Escuela / Grupo';
    } else if (newClientType === 'tournament') {
      cat = 'tournament';
      title = 'Cuadro Torneo Oficial Setmio';
    } else if (newClientType === 'block') {
      title = `BLOQUEO: ${newClientName || 'Mantenimiento'}`;
    }

    createBooking({
      courtId: court?.id || 'court-1',
      courtName: court?.name || 'Pista 1',
      venueId: isMultiVenue ? targetVenue?.id : undefined,
      venueName: isMultiVenue ? targetVenue?.name : undefined,
      venueShortName: isMultiVenue ? targetVenue?.shortName : undefined,
      creatorId: 'admin-action',
      creatorName: newClientName.trim() || 'Titular',
      startTime: startISO,
      endTime: endISO,
      totalPrice: finalPrice,
      status: 'confirmed',
      paymentStatus: finalPrice === 0 ? 'paid' : 'pending',
      isSplitPayment: false,
      category: cat,
      title,
      notes: newClientType === 'activity' ? 'Actividad de escuela (tarifa 0€ en pista)' : newClientType === 'tournament' ? 'Torneo oficial (tarifa 0€)' : undefined,
      participants: [
        {
          name: newClientName.trim() || 'Titular',
          paid: finalPrice === 0,
          amount: finalPrice,
        },
      ],
    });

    setIsNewBookingModalOpen(false);
  };

  // Filter bookings with temporal state, venue, and payment filters
  const filteredBookings = useMemo(() => {
    const now = new Date();

    return bookings.filter((b) => {
      // 1. Search by player name, court, PIN or date string
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        b.creatorName.toLowerCase().includes(term) ||
        b.courtName.toLowerCase().includes(term) ||
        (b.accessPin && b.accessPin.toLowerCase().includes(term)) ||
        b.startTime.toLowerCase().includes(term);

      // 2. Filter by Temporal Status (Pasadas vs Futuras)
      const bookingDate = new Date(b.endTime || b.startTime);
      const isPast = !isNaN(bookingDate.getTime()) && bookingDate < now;
      let matchesTime = true;
      if (timeFilter === 'upcoming') {
        matchesTime = !isPast;
      } else if (timeFilter === 'past') {
        matchesTime = isPast;
      }

      // 3. Filter by payment status
      let matchesStatus = true;
      if (statusFilter === 'confirmed') {
        matchesStatus = b.paymentStatus === 'paid' || (b.status === 'confirmed' && b.paymentStatus !== 'pending' && b.paymentStatus !== 'partially_paid');
      } else if (statusFilter === 'pending') {
        matchesStatus = b.paymentStatus === 'pending' || b.paymentStatus === 'partially_paid' || b.status === 'pending';
      } else if (statusFilter === 'canceled') {
        matchesStatus = b.status === 'canceled';
      }

      // 4. Filter by court
      const matchesCourt = courtFilter === 'all' || b.courtId === courtFilter;

      // 5. Filter by venue (Only if Multi-Sede)
      const bVenue = b.venueId || courts.find((c) => c.id === b.courtId)?.venueId || 'venue-san-mateo';
      const matchesVenue = !isMultiVenue || venueFilter === 'all' || bVenue === venueFilter;

      // 6. Filter by date
      const matchesDate = !dateFilter || b.startTime.startsWith(dateFilter);

      return matchesSearch && matchesTime && matchesStatus && matchesCourt && matchesVenue && matchesDate;
    });
  }, [bookings, searchTerm, timeFilter, statusFilter, courtFilter, venueFilter, isMultiVenue, dateFilter]);

  // Convert Booking to Drawer & ListItem data
  const mapBookingToItemData = (b: Booking): BookingListItemData => {
    const timeSlot = `${b.startTime.split('T')[1]?.slice(0, 5) || ''} - ${b.endTime?.split('T')[1]?.slice(0, 5) || ''}`;
    let statusText: string = b.status === 'canceled' ? 'Cancelada' : 'Confirmada';
    if (b.paymentStatus === 'pending' || b.paymentStatus === 'partially_paid') {
      statusText = 'Pendiente TPV';
    } else if (b.paymentStatus === 'paid') {
      statusText = 'Pagado';
    }

    return {
      id: b.id,
      venueId: b.venueId,
      venueName: b.venueName,
      venueShortName: b.venueShortName,
      courtId: b.courtId,
      courtName: b.courtName,
      startTime: b.startTime,
      endTime: b.endTime,
      timeSlot,
      creatorName: b.creatorName,
      creatorPhone: '+34 611 22 33 44',
      creatorMemberNum: 'Socio #SM-408',
      totalPrice: b.totalPrice,
      status: statusText,
      paymentStatus: b.paymentStatus,
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

  const handleOpenBookingDetail = (b: Booking) => {
    const itemData = mapBookingToItemData(b);
    setSelectedDrawerBooking({
      ...itemData,
      courtType: 'Indoor Cristal Pro',
      creatorPhone: '+34 611 22 33 44',
      creatorMemberNum: 'Socio #SM-408',
      lightsStatus: 'auto',
      doorStatus: 'auto',
    });
  };

  // KPIs Dinámicos filtrados por la Sede Activa (venueFilter)
  const venueFilteredBookingsForKpis = useMemo(() => {
    if (venueFilter === 'all') return bookings;
    return bookings.filter((b) => {
      const bVenue = b.venueId || courts.find((c) => c.id === b.courtId)?.venueId || 'venue-san-mateo';
      return bVenue === venueFilter;
    });
  }, [bookings, venueFilter, courts]);

  const totalCount = venueFilteredBookingsForKpis.length;
  const confirmedCount = venueFilteredBookingsForKpis.filter(
    (b) => b.status === 'confirmed' || b.status === 'completed'
  ).length;
  const pendingCount = venueFilteredBookingsForKpis.filter(
    (b) => b.paymentStatus === 'pending' || b.paymentStatus === 'partially_paid' || b.status === 'pending'
  ).length;
  const totalAmountSum = venueFilteredBookingsForKpis
    .filter((b) => b.status !== 'canceled')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  return (
    <div className="space-y-5 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-12">
      {/* ======================================================================
          HEADER DE PÁGINA (Solo para vista de página completa, no modal)
          ====================================================================== */}
      {!isModal && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
              {t('allBookings.title', 'Historial de Reservas')}
            </h1>
          </div>

          {/* Botonera Superior */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleGoToAgenda}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs border border-slate-200 dark:border-slate-800"
              title="Ir al cuadrante diario de pistas"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{t('allBookings.agendaBtn', 'Agenda')}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenNewBooking}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap"
              title="Crear nueva reserva de pista"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>{t('allBookings.newBtn', 'Nueva reserva')}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================
          FILTRO GLOBAL DE SEDE (Afecta tanto a las métricas como a la tabla)
          ====================================================================== */}
      {isMultiVenue && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Sede Activa:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleVenueFilterChange('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                venueFilter === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              Todas las Sedes
            </button>
            {venues
              .filter((v) => v.id !== 'all')
              .map((v) => {
                const isSelected = venueFilter === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleVenueFilterChange(v.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {v.shortName || v.name}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* TARJETAS RESUMEN KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
            Total Registradas
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
            {totalCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
            Confirmadas
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {confirmedCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
            Pendiente TPV
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-800 dark:text-slate-100">
            {pendingCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
            Facturación Total
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {totalAmountSum.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
        </div>
      </div>

      {/* ======================================================================
          BARRA DE BÚSQUEDA Y FILTROS ULTRA-COMPACTOS (Directamente sobre el fondo)
          ====================================================================== */}
      <div className="space-y-2.5">
        {/* Fila 1: Buscador y Selectores Ultra-Compactos */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Buscador ultra-compacto */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por titular, pista o PIN..."
              className="w-full pl-8.5 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Selectores de Pista y Fecha */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">

            {/* Selector de Pista */}
            <select
              value={courtFilter}
              onChange={(e) => setCourtFilter(e.target.value)}
              className="px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition font-medium min-w-[120px] shadow-2xs cursor-pointer"
            >
              <option value="all">Todas las Pistas</option>
              {courts.map((court) => (
                <option key={court.id} value={court.id}>
                  {court.name}
                </option>
              ))}
            </select>

            {/* Selector de Fecha */}
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition font-medium max-w-[130px] shadow-2xs cursor-pointer"
                title="Filtrar por fecha específica"
              />
              {dateFilter && (
                <button
                  type="button"
                  onClick={() => setDateFilter('')}
                  className="text-[11px] text-slate-500 hover:text-emerald-500 font-bold px-1.5 py-1 rounded cursor-pointer shrink-0"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Fila 2: Segmented Controls Minimalistas Ultra-Compactos (Temporal + Pago) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* 1. Filtro Temporal: Todas vs Futuras vs Pasadas */}
          <div className="inline-flex w-full p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs gap-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setTimeFilter('all')}
              className={`flex-1 py-1 px-2 rounded-lg font-bold text-[11px] transition text-center cursor-pointer flex items-center justify-center gap-1 ${
                timeFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>Todas</span>
            </button>

            <button
              type="button"
              onClick={() => setTimeFilter('upcoming')}
              className={`flex-1 py-1 px-2 rounded-lg font-bold text-[11px] transition text-center cursor-pointer flex items-center justify-center gap-1 ${
                timeFilter === 'upcoming'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Futuras</span>
            </button>

            <button
              type="button"
              onClick={() => setTimeFilter('past')}
              className={`flex-1 py-1 px-2 rounded-lg font-bold text-[11px] transition text-center cursor-pointer flex items-center justify-center gap-1 ${
                timeFilter === 'past'
                  ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Pasadas</span>
            </button>
          </div>

          {/* 2. Filtro de Estado de Pago */}
          <div className="inline-flex w-full p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs gap-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`flex-1 py-1 px-1.5 rounded-lg font-bold text-[11px] transition text-center cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('allBookings.paymentFilter.all', 'Todos')}
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('confirmed')}
              className={`flex-1 py-1 px-1.5 rounded-lg font-bold text-[11px] transition text-center cursor-pointer ${
                statusFilter === 'confirmed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              Pagadas
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`flex-1 py-1 px-1.5 rounded-lg font-bold text-[11px] transition text-center cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pendientes TPV
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('canceled')}
              className={`flex-1 py-1 px-1.5 rounded-lg font-bold text-[11px] transition text-center cursor-pointer ${
                statusFilter === 'canceled'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              Canceladas
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================================
          LISTADO DE RESERVAS (Renderizado directamente sobre el fondo sin tarjeta general)
          ====================================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span className="font-bold uppercase tracking-wider text-[11px]">
            {filteredBookings.length} {filteredBookings.length === 1 ? 'Reserva' : 'Reservas'} encontradas
          </span>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="p-10 text-center text-slate-400 dark:text-slate-500 text-xs rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-800">
            <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              No se encontraron reservas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              No hay registros que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredBookings.map((b) => {
              const itemData = mapBookingToItemData(b);
              return (
                <BookingListItem
                  key={b.id}
                  booking={itemData}
                  onClick={() => handleOpenBookingDetail(b)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Sheet Drawer de Detalle Operativo (con permisos de editar, cancelar y eliminar) */}
      <ReservationDrawer
        isOpen={!!selectedDrawerBooking}
        reservation={selectedDrawerBooking}
        onClose={() => setSelectedDrawerBooking(null)}
        onOpenPlayerProfile={(playerName) => {
          setSelectedDrawerBooking(null);
          navigateToPlayerProfile(playerName);
        }}
      />

      {/* ======================================================================
          MODAL DE NUEVA RESERVA DIRECTO (Componente Unificado con todos los requerimientos)
          ====================================================================== */}
      <NewBookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        defaultVenueId={venueFilter !== 'all' ? venueFilter : undefined}
      />
    </div>
  );
};

export default AllBookingsPage;
