import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
} from 'lucide-react';

export const AdminAgenda: React.FC = () => {
  const {
    courts,
    bookings,
    createBooking,
    updateBooking,
    cancelBooking,
    toggleCourtLight,
    currentUser,
    triggerDemoToast,
    navigateToPlayerProfile,
  } = useApp();

  const [currentDate, setCurrentDate] = useState('2026-09-30');
  const [selectedDrawerData, setSelectedDrawerData] = useState<ReservationDrawerData | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showAllBookingsView, setShowAllBookingsView] = useState(false);
  const dateInputRef = React.useRef<HTMLInputElement>(null);

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
  const [newCourtId, setNewCourtId] = useState(courts[0]?.id || 'court-1');
  const [newTime, setNewTime] = useState('17:00');
  const [durationMinutes, setDurationMinutes] = useState<60 | 90 | 120>(90);
  const [clientType, setClientType] = useState<'existing' | 'new' | 'block'>('existing');
  const [selectedMember, setSelectedMember] = useState('Carlos Méndez (Socio 108)');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newSplit, setNewSplit] = useState(false);
  const [invitedPlayer2, setInvitedPlayer2] = useState('');
  const [invitedPlayer3, setInvitedPlayer3] = useState('');
  const [invitedPlayer4, setInvitedPlayer4] = useState('');

  const timeRows = [
    '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '17:00', '18:30', '20:00', '21:30'
  ];

  const getBookingForSlot = (courtId: string, time: string) => {
    return bookings.find(
      (b) =>
        b.courtId === courtId &&
        b.status !== 'canceled' &&
        b.startTime.includes(time)
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const court = courts.find((c) => c.id === newCourtId) || courts[0];
    const startISO = `${currentDate}T${newTime}:00`;
    const hours = durationMinutes / 60;
    const finalPrice = clientType === 'block' ? 0 : court.hourlyRate * hours;
    const clientDisplayName = clientType === 'block'
      ? `BLOQUEO: ${newClientName || 'Mantenimiento / Evento Club'}`
      : clientType === 'existing'
      ? selectedMember
      : newClientName || 'Cliente Mostrador';

    const participants = newSplit
      ? [
          { name: clientDisplayName, paid: true, amount: finalPrice / 4 },
          { name: invitedPlayer2 || 'Jugador 2 (Pendiente)', paid: false, amount: finalPrice / 4 },
          { name: invitedPlayer3 || 'Jugador 3 (Pendiente)', paid: false, amount: finalPrice / 4 },
          { name: invitedPlayer4 || 'Jugador 4 (Pendiente)', paid: false, amount: finalPrice / 4 },
        ]
      : [{ name: clientDisplayName, paid: true, amount: finalPrice }];

    const startH = parseInt(newTime.split(':')[0], 10);
    const startM = parseInt(newTime.split(':')[1], 10);
    const totalMinutes = startH * 60 + startM + durationMinutes;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    const endISO = `${currentDate}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;

    createBooking({
      courtId: court.id,
      courtName: court.name,
      creatorId: clientType === 'existing' ? 'socio-member' : 'reception-client',
      creatorName: clientDisplayName,
      startTime: startISO,
      endTime: endISO,
      status: 'confirmed',
      totalPrice: finalPrice,
      paymentStatus: clientType === 'block' ? 'paid' : newSplit ? 'partially_paid' : 'paid',
      isSplitPayment: newSplit,
      participants,
      notes: clientType === 'block' ? 'Pista bloqueada administrativamente por recepción.' : undefined,
    });

    setShowNewModal(false);
    setNewClientName('');
    setInvitedPlayer2('');
    setInvitedPlayer3('');
    setInvitedPlayer4('');
    triggerDemoToast('Reserva Registrada', `Reserva creada con éxito en ${court.name}.`, 'success');
  };

  // Convert Booking to Drawer & BookingListItem format
  const convertBookingToDrawer = (b: Booking): ReservationDrawerData => {
    const timeSlot = `${b.startTime.split('T')[1]?.slice(0, 5) || ''} - ${b.endTime.split('T')[1]?.slice(0, 5) || ''}`;
    let statusText: string = b.status === 'canceled' ? 'Cancelada' : 'Confirmada';
    if (b.paymentStatus === 'pending' || b.paymentStatus === 'partially_paid') {
      statusText = 'Pendiente TPV';
    } else if (b.paymentStatus === 'paid') {
      statusText = 'Pagado';
    }

    return {
      id: b.id,
      courtId: b.courtId,
      courtName: b.courtName,
      courtType: 'Indoor Cristal Pro',
      startTime: b.startTime.split('T')[1]?.slice(0, 5) || b.startTime,
      endTime: b.endTime?.split('T')[1]?.slice(0, 5) || '',
      timeSlot,
      creatorName: b.creatorName,
      creatorPhone: '+34 611 22 33 44',
      creatorMemberNum: 'Socio #SM-408',
      totalPrice: b.totalPrice,
      paymentStatus: b.paymentStatus,
      status: statusText,
      accessPin: b.accessPin || '4821#',
      category: b.isSplitPayment ? 'match' : 'private',
      title: b.isSplitPayment ? 'Pádel Abierto 4.0' : `Reserva ${b.courtName}`,
      sport: 'Pádel Indoor',
      participants: b.participants?.map((p) => ({
        name: p.name,
        paid: p.paid,
        amount: p.amount,
        statusText: p.paid ? 'Pagado' : 'Pendiente TPV',
      })),
      notes: b.notes,
    };
  };

  // If user navigated to "Todas las Reservas" view
  if (showAllBookingsView) {
    return (
      <AllBookingsPage
        onBackToQuadrant={() => setShowAllBookingsView(false)}
        onOpenNewBookingModal={() => setShowNewModal(true)}
      />
    );
  }

  // Filter day's bookings
  const dayBookings = bookings.filter((b) => b.startTime.startsWith(currentDate));

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto">
      {/* ======================================================================
          1. ENCABEZADO DE PÁGINA (LAYOUT DE 2 FILAS EN MÓVIL, 1 EN DESKTOP)
          ====================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        {/* Fila 1 en móvil / Izquierda en desktop: Título sin recortarse */}
        <div className="w-full sm:w-auto min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Reservas y Disponibilidad
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
            Cuadrante interactivo y gestión diaria del club
          </p>
        </div>

        {/* Fila 2 en móvil (Selector a la izquierda, Botón a la derecha) / Derecha en desktop */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
          {/* Selector de Fechas Moderno, Minimalista y Dark/Emerald */}
          <div className="inline-flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-xs transition hover:border-emerald-500/50">
            <button
              type="button"
              onClick={() => stepDate(-1)}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Día anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Pill Central Estilizada */}
            <div
              onClick={() => dateInputRef.current?.showPicker ? dateInputRef.current.showPicker() : dateInputRef.current?.focus()}
              className="relative flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition select-none"
              title="Seleccionar otra fecha"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
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
                className="absolute inset-0 opacity-0 pointer-events-auto cursor-pointer w-full h-full"
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

          {/* Botón Nueva Reserva: Sin icono + redundante */}
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs shadow-sm transition shrink-0 whitespace-nowrap cursor-pointer"
          >
            <span>Nueva Reserva</span>
          </button>
        </div>
      </div>

      {/* ======================================================================
          2. TABLA DE DISPONIBILIDAD (CUADRANTE EN MODO OSCURO CANÓNICO)
          ====================================================================== */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Header Courts Row */}
            <div className="grid grid-cols-9 border-b border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/90 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-t-xl">
              <div className="p-3 text-center text-slate-500 dark:text-slate-400 font-bold border-r border-slate-200 dark:border-slate-700/80">
                Hora
              </div>
              {courts.map((court) => (
                <div
                  key={court.id}
                  className="p-3 border-r border-slate-200 dark:border-slate-700/80 last:border-r-0 flex flex-col justify-between"
                >
                  <div className="font-extrabold text-slate-900 dark:text-white truncate text-[11px]">
                    {court.name.split('—')[0]}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{court.hourlyRate}€/h</span>
                    <button
                      type="button"
                      onClick={() => toggleCourtLight(court.id)}
                      className={`p-1 rounded transition ${
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
              ))}
            </div>

            {/* Time Rows */}
            {timeRows.map((time) => (
              <div
                key={time}
                className="grid grid-cols-9 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 text-xs transition-colors"
              >
                {/* Horario en Modo Oscuro: text-slate-200 */}
                <div className="p-3 text-center font-mono text-slate-700 dark:text-slate-200 font-bold border-r border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/90 flex items-center justify-center">
                  {time}
                </div>

                {courts.map((court) => {
                  const booking = getBookingForSlot(court.id, time);
                  return (
                    <div
                      key={court.id}
                      className="p-1.5 border-r border-slate-100 dark:border-slate-700/50 last:border-r-0 min-h-[62px] flex items-center"
                    >
                      {booking ? (
                        /* Celda ocupada: bg-slate-800 en dark mode, borde menta y texto claro */
                        <button
                          type="button"
                          onClick={() => setSelectedDrawerData(convertBookingToDrawer(booking))}
                          className="w-full h-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-emerald-500/40 text-left hover:border-emerald-500 dark:hover:border-emerald-400 transition shadow-xs group"
                        >
                          <div className="font-bold text-slate-900 dark:text-white truncate text-[11px] group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition">
                            {booking.creatorName}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-300 flex items-center justify-between font-medium mt-0.5">
                            <span className="font-bold">{booking.totalPrice}€</span>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              PIN {booking.accessPin || '4821#'}
                            </span>
                          </div>
                        </button>
                      ) : (
                        /* Celda libre: Verde Menta oficial Setmio */
                        <button
                          type="button"
                          onClick={() => {
                            setNewCourtId(court.id);
                            setNewTime(time);
                            setShowNewModal(true);
                          }}
                          className="w-full h-full rounded-xl border border-dashed border-emerald-500/25 hover:border-emerald-500 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold transition flex items-center justify-center gap-1 active:scale-95"
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
          3. BLOQUE "RESERVAS DEL DÍA"
          - Cabecera rediseñada: Título a la izquierda, Historial Completo a la derecha en la misma fila superior
          ====================================================================== */}
      <section className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              Reservas del Día
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              {dayBookings.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAllBookingsView(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-xs transition border border-slate-200/80 dark:border-slate-600/60 shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <span className="hidden sm:inline">Historial Completo / Todas las Reservas</span>
            <span className="sm:hidden">Ver Todas</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
          </button>
        </div>

        {/* Listado con el componente unificado BookingListItem */}
        {dayBookings.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            No hay reservas registradas para esta fecha. Puedes hacer clic en "+ Libre" para reservar una pista.
          </div>
        ) : (
          <div className="space-y-2.5">
            {dayBookings.map((b) => {
              const drawerData = convertBookingToDrawer(b);
              return (
                <BookingListItem
                  key={b.id}
                  booking={drawerData}
                  onClick={() => setSelectedDrawerData(drawerData)}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* DRAWER OPERATIVO DE DETALLE DE RESERVA */}
      <ReservationDrawer
        isOpen={!!selectedDrawerData}
        reservation={selectedDrawerData}
        onClose={() => setSelectedDrawerData(null)}
        onCancelReservation={(id) => {
          cancelBooking(id);
          setSelectedDrawerData(null);
        }}
        onOpenPlayerProfile={(playerName) => {
          setSelectedDrawerData(null);
          navigateToPlayerProfile(playerName);
        }}
      />

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
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs mt-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Tipo de Operación</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
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

              {clientType === 'existing' && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Socio del Club</label>
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="Carlos Méndez (Socio 108)">Carlos Méndez — Socio #108 (Nivel 3.85)</option>
                    <option value="Rosa Carballo (Socia 042)">Rosa Carballo — Socia #042 (Nivel 3.50)</option>
                    <option value="Pablo Vello (Socio 019)">Pablo Vello — Socio #019 (Nivel 4.80)</option>
                    <option value="Iván Gómez (Socio 087)">Iván Gómez — Socio #087 (Nivel 3.00)</option>
                    <option value="Laura Senra (Socia Pro)">Laura Senra — Socia Pro (Nivel 5.00)</option>
                  </select>
                </div>
              )}

              {clientType === 'new' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Nombre Cliente</label>
                    <input
                      type="text"
                      required
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Teléfono</label>
                    <input
                      type="tel"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      placeholder="600 000 000"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Pista</label>
                  <select
                    value={newCourtId}
                    onChange={(e) => setNewCourtId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium"
                  >
                    {courts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.hourlyRate}€/h)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Hora Inicio</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Duración</label>
                <div className="grid grid-cols-3 gap-2">
                  {[60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMinutes(mins as 60 | 90 | 120)}
                      className={`py-2 rounded-xl border text-xs font-bold transition ${
                        durationMinutes === mins
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>

              {clientType !== 'block' && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Pago Fraccionado (Split 4 Jugadores)</span>
                    <input
                      type="checkbox"
                      checked={newSplit}
                      onChange={(e) => setNewSplit(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                  </div>
                  {newSplit && (
                    <div className="space-y-1.5 pt-1 text-[11px]">
                      <span className="text-slate-400 block font-medium">Invitar compañeros:</span>
                      <input
                        type="text"
                        placeholder="Jugador 2: ej. marcos@email.es"
                        value={invitedPlayer2}
                        onChange={(e) => setInvitedPlayer2(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Jugador 3: ej. brais@email.es"
                        value={invitedPlayer3}
                        onChange={(e) => setInvitedPlayer3(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Jugador 4: ej. lucia@email.es"
                        value={invitedPlayer4}
                        onChange={(e) => setInvitedPlayer4(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition shadow-sm active:scale-95"
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
