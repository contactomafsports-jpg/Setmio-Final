import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types/database';
import { BookingListItem, BookingListItemData } from './BookingListItem';
import { ReservationDrawer, ReservationDrawerData } from './ReservationDrawer';
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
  const [venueFilter, setVenueFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedDrawerBooking, setSelectedDrawerBooking] = useState<ReservationDrawerData | null>(null);

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
      const matchesVenue = !isMultiVenue || venueFilter === 'all' || b.venueId === venueFilter;

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

  // KPIs
  const totalCount = bookings.length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed').length;
  const pendingCount = bookings.filter((b) => b.paymentStatus === 'pending' || b.status === 'pending').length;
  const totalAmountSum = bookings
    .filter((b) => b.status !== 'canceled')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-12">
      {/* ======================================================================
          HEADER DE PÁGINA (Sin etiqueta verde obsoleta, botones corregidos)
          ====================================================================== */}
      {!isModal ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                {t('allBookings.title', 'Historial de Reservas')}
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {t('allBookings.subtitle', 'Histórico completo y gestión operativa de reservas')}
            </p>
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
      ) : (
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Filtra y gestiona el histórico de reservas sin perder tu fecha activa en el cuadrante.
          </p>
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
          <div className="text-xl sm:text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
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

          {/* Selectores de Sede (si Multi-Sede), Pista y Fecha */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {/* Filtro de Sede ÚNICAMENTE en Multi-Sede (Condicionalidad Dinámica Tarea 1) */}
            {isMultiVenue && (
              <select
                value={venueFilter}
                onChange={(e) => setVenueFilter(e.target.value)}
                className="px-2.5 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/80 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 focus:outline-none focus:border-indigo-500 transition font-bold shadow-2xs cursor-pointer max-w-[150px]"
                title="Filtrar por Sede"
              >
                <option value="all">Todas las Sedes</option>
                {venues.filter(v => v.id !== 'all').map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.shortName}
                  </option>
                ))}
              </select>
            )}

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
          {/* 1. Filtro Temporal: Pasadas vs Futuras */}
          <div className="inline-flex w-full p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs gap-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setTimeFilter('all')}
              className={`flex-1 py-1 px-2 rounded-lg font-bold text-[11px] transition text-center cursor-pointer ${
                timeFilter === 'all'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('allBookings.timeFilter.all', 'Todas')}
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
              <span>{t('allBookings.timeFilter.upcoming', 'Futuras / Hoy')}</span>
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
              <span>{t('allBookings.timeFilter.past', 'Pasadas')}</span>
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
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
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
          MODAL DE NUEVA RESERVA DIRECTO (Resuelve problema de botón "Nueva reserva")
          ====================================================================== */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Nueva Reserva en Cuadrante
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Registro de pista y asignación de tarifa
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewBookingModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBookingSubmit} className="space-y-3.5 text-xs">
              {/* Tipo de Reserva / Actividad */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Tipo de Reserva</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setNewClientType('member')}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition ${
                      newClientType === 'member'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Privada / Socio
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewClientType('activity')}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition ${
                      newClientType === 'activity'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Escuela / Grupo
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewClientType('tournament')}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition ${
                      newClientType === 'tournament'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Torneo
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewClientType('block')}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition ${
                      newClientType === 'block'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Bloqueo
                  </button>
                </div>
              </div>

              {/* Sede: ÚNICAMENTE visible si Multi-Sede (Condicionalidad Dinámica Tarea 1) */}
              {isMultiVenue && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Sede de la Instalación
                  </label>
                  <select
                    value={newVenueId}
                    onChange={(e) => setNewVenueId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {venues.filter(v => v.id !== 'all').map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Pista y Fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Pista</label>
                  <select
                    value={newCourtId}
                    onChange={(e) => setNewCourtId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {courts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.hourlyRate}€/h)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Fecha</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Hora y Duración */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Hora Inicio</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Duración</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value) as 60 | 90 | 120)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={60}>60 minutos (1h)</option>
                    <option value={90}>90 minutos (1.5h)</option>
                    <option value={120}>120 minutos (2h)</option>
                  </select>
                </div>
              </div>

              {/* Titular */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {newClientType === 'block' ? 'Concepto del Bloqueo' : 'Titular / Jugador'}
                </label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder={newClientType === 'block' ? 'Mantenimiento / Evento' : 'Nombre del socio o jugador'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Tarifa / Precio (Regla 0€ explicada) */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">Tarifa en Pista</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {newClientType === 'activity' || newClientType === 'tournament'
                      ? 'Tarifa 0,00 € automática para constancia operativa'
                      : 'Importe calculado según tarifa de pista'}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono font-black text-base text-emerald-600 dark:text-emerald-400">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-16 text-right bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs"
                  />
                  <span>€</span>
                </div>
              </div>

              {/* Botones del Modal */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition active:scale-95"
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

export default AllBookingsPage;
