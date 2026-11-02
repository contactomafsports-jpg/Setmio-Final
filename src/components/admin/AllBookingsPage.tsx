import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types/database';
import { BookingListItem, BookingListItemData } from './BookingListItem';
import { ReservationDrawer, ReservationDrawerData } from './ReservationDrawer';
import { NewBookingModal } from './NewBookingModal';
import {
  Calendar,
  Search,
  ArrowLeft,
  Plus,
  Clock,
  CheckCircle2,
  Building2,
  ChevronDown,
  Layers,
  CreditCard,
} from 'lucide-react';

interface AllBookingsPageProps {
  onBackToQuadrant?: () => void;
  onOpenNewBookingModal?: () => void;
  isModal?: boolean;
}

export const AllBookingsPage: React.FC<AllBookingsPageProps> = ({
  onBackToQuadrant,
}) => {
  const {
    bookings,
    courts,
    venues,
    selectedVenueId,
    selectedVenue,
    setSelectedVenueId,
    isConsolidatedView,
    isClubOpen,
    toggleClubOpenState,
    setAdminTab,
    navigateToPlayerProfile,
    t,
  } = useApp();

  // Scroll to top on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  // Today's date in YYYY-MM-DD format as the clear default
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [courtFilter, setCourtFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>(todayStr);

  // Venue Selector Dropdown state
  const [isVenueSelectorOpen, setIsVenueSelectorOpen] = useState(false);

  // Modals & Drawers
  const [selectedDrawerBooking, setSelectedDrawerBooking] = useState<ReservationDrawerData | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  // Dynamic Courts Filter: Filter courts belonging to the selected venue
  const availableCourts = useMemo(() => {
    if (isConsolidatedView || selectedVenueId === 'all') {
      return courts;
    }
    return courts.filter(
      (c) => c.venueId === selectedVenueId || (!c.venueId && selectedVenueId === 'venue-san-mateo')
    );
  }, [courts, selectedVenueId, isConsolidatedView]);

  // Reset court filter if selected court doesn't belong to the active venue
  useEffect(() => {
    if (courtFilter !== 'all' && !availableCourts.some((c) => c.id === courtFilter)) {
      setCourtFilter('all');
    }
  }, [selectedVenueId, availableCourts, courtFilter]);

  // Navigation handlers
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

  // KPIs Dinámicos filtrados por la Sede Activa (selectedVenueId)
  const venueFilteredBookingsForKpis = useMemo(() => {
    if (isConsolidatedView || selectedVenueId === 'all') return bookings;
    return bookings.filter((b) => {
      const bVenue = b.venueId || courts.find((c) => c.id === b.courtId)?.venueId || 'venue-san-mateo';
      return bVenue === selectedVenueId;
    });
  }, [bookings, selectedVenueId, isConsolidatedView, courts]);

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

  // Filter bookings with clean search, dynamic court and date
  const filteredBookings = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return bookings.filter((b) => {
      // 1. Search by player name, court, PIN or title
      const matchesSearch =
        !term ||
        b.creatorName.toLowerCase().includes(term) ||
        b.courtName.toLowerCase().includes(term) ||
        (b.accessPin && b.accessPin.toLowerCase().includes(term)) ||
        (b.title && b.title.toLowerCase().includes(term));

      // 2. Filter by Venue (from top master venue selector)
      const bVenue = b.venueId || courts.find((c) => c.id === b.courtId)?.venueId || 'venue-san-mateo';
      const matchesVenue = isConsolidatedView || selectedVenueId === 'all' || bVenue === selectedVenueId;

      // 3. Filter by Court
      const matchesCourt = courtFilter === 'all' || b.courtId === courtFilter;

      // 4. Filter by Date
      const matchesDate = !dateFilter || b.startTime.startsWith(dateFilter);

      return matchesSearch && matchesVenue && matchesCourt && matchesDate;
    });
  }, [bookings, searchTerm, isConsolidatedView, selectedVenueId, courtFilter, dateFilter, courts]);

  return (
    <div className="space-y-4 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-16 font-sans antialiased">
      {/* ======================================================================
          1. CABECERA LIMPIA Y SIMÉTRICA (ESTILO PARTIDAS / PAGOS)
          ====================================================================== */}
      <section className="pt-2 pb-1 space-y-3" data-purpose="header-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleGoToAgenda}
              className="p-1 -ml-1 text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition-colors cursor-pointer active:scale-95"
              title="Volver a Reservas"
              aria-label="Volver a Reservas"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <h1 className="text-[22px] font-extrabold text-[#0B1A2D] dark:text-white tracking-tight leading-tight">
              {t('allBookings.title', 'Todas las Reservas')}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleOpenNewBooking}
            className="p-1 text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition-colors cursor-pointer active:scale-95"
            title="Nueva reserva"
            aria-label="Nueva reserva"
          >
            <Plus className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>

        {/* ======================================================================
            2. SELECTOR DE SEDE SUPERIOR (COLOCADO ANTES DEL DASHBOARD DE MÉTRICAS)
            ====================================================================== */}
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
      </section>

      {/* ======================================================================
          3. TARJETAS ANALÍTICAS KPIS (DASHBOARD DE MÉTRICAS)
          ====================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
        {/* KPI 1: Total Registradas */}
        <div className="bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-2xl p-4 shadow-sm hover:border-slate-300 dark:hover:border-[#244265] transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Registradas
            </span>
            <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-[#071220] flex items-center justify-center text-slate-600 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#0B1A2D] dark:text-white tracking-tight">
            {totalCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">
            {isConsolidatedView ? 'Todas las sedes' : selectedVenue.shortName || 'Sede activa'}
          </div>
        </div>

        {/* KPI 2: Confirmadas */}
        <div className="bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-2xl p-4 shadow-sm hover:border-slate-300 dark:hover:border-[#244265] transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Confirmadas
            </span>
            <div className="w-6 h-6 rounded-lg bg-[#F0FCCF] dark:bg-[#B7F229]/20 flex items-center justify-center text-[#0B1A2D] dark:text-[#B7F229]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B7F229]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-[#B7F229] tracking-tight">
            {confirmedCount}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            {totalCount > 0 ? `${Math.round((confirmedCount / totalCount) * 100)}% de ocupación` : 'Sin registros'}
          </div>
        </div>

        {/* KPI 3: Pendiente TPV */}
        <div className="bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-2xl p-4 shadow-sm hover:border-slate-300 dark:hover:border-[#244265] transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pendiente TPV
            </span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400 tracking-tight">
            {pendingCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">
            Cobro en mostrador / split
          </div>
        </div>

        {/* KPI 4: Facturación Total */}
        <div className="bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-2xl p-4 shadow-sm hover:border-slate-300 dark:hover:border-[#244265] transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Facturación Total
            </span>
            <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-[#071220] flex items-center justify-center text-[#0B1A2D] dark:text-[#B7F229]">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#0B1A2D] dark:text-white tracking-tight">
            {totalAmountSum.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">
            Tarifas de pista sumadas
          </div>
        </div>
      </div>

      {/* ======================================================================
          4. BARRA DE BÚSQUEDA Y FILTROS MINIMALISTAS (SIN CONTENEDORES PESADOS)
          ====================================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
        {/* Buscador minimalista */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por titular, pista o PIN..."
            className="w-full pl-9 pr-8 py-2.5 bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#B7F229] transition shadow-2xs"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Selectores Dinámicos: Pista y Fecha sin envolventes pesadas */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Selector de Pista Dinámico (Filtrado por sede activa) */}
          <select
            value={courtFilter}
            onChange={(e) => setCourtFilter(e.target.value)}
            className="px-3 py-2.5 bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-slate-200 focus:outline-none focus:border-[#B7F229] transition font-bold min-w-[130px] shadow-2xs cursor-pointer"
            title="Filtrar por pista de la sede activa"
          >
            <option value="all">Todas las Pistas</option>
            {availableCourts.map((court) => (
              <option key={court.id} value={court.id}>
                {court.name}
              </option>
            ))}
          </select>

          {/* Selector de Fecha (con fecha de hoy por defecto) */}
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-2.5 py-2.5 bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-slate-200 focus:outline-none focus:border-[#B7F229] transition font-semibold min-w-[135px] shadow-2xs cursor-pointer"
              title="Filtrar por fecha específica"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter('')}
                className="text-xs text-slate-400 hover:text-rose-500 font-bold px-1.5 py-1 rounded cursor-pointer shrink-0 transition"
                title="Limpiar filtro de fecha (ver histórico completo)"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================================
          5. LISTADO DE RESERVAS (Renderizado directamente sobre el fondo limpio)
          ====================================================================== */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span className="font-bold uppercase tracking-wider text-[11px]">
            {filteredBookings.length} {filteredBookings.length === 1 ? 'Reserva' : 'Reservas'} encontradas
          </span>
          {dateFilter && (
            <span className="text-[11px] font-medium text-slate-400">
              Fecha: {dateFilter}
            </span>
          )}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="p-10 text-center text-slate-400 dark:text-slate-500 text-xs rounded-2xl bg-white/60 dark:bg-[#0E2239]/60 border border-dashed border-slate-200 dark:border-[#1A314D]">
            <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-[#0B1A2D] dark:text-white">
              No se encontraron reservas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              No hay registros que coincidan con los filtros seleccionados. Prueba a cambiar la fecha o limpiar los filtros.
            </p>
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter('')}
                className="mt-3 px-3 py-1.5 bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D] rounded-xl text-xs font-bold transition hover:opacity-90 active:scale-95 cursor-pointer"
              >
                Ver todo el histórico
              </button>
            )}
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

      {/* Bottom Sheet Drawer de Detalle Operativo */}
      <ReservationDrawer
        isOpen={!!selectedDrawerBooking}
        reservation={selectedDrawerBooking}
        onClose={() => setSelectedDrawerBooking(null)}
        onOpenPlayerProfile={(playerName) => {
          setSelectedDrawerBooking(null);
          navigateToPlayerProfile(playerName);
        }}
      />

      {/* Modal de Nueva Reserva */}
      <NewBookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        defaultVenueId={selectedVenueId !== 'all' ? selectedVenueId : undefined}
      />
    </div>
  );
};

export default AllBookingsPage;
