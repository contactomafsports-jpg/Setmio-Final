import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types/database';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export const BookingFlow: React.FC = () => {
  const {
    currentTenant,
    courts,
    bookings,
    createBooking,
    currentUser,
    setPublicPage,
    selectedCourtsForBooking,
  } = useApp();

  const tenantCourts = courts.filter((c) => !c.tenantId || c.tenantId === currentTenant.id);
  const activeCourts = tenantCourts.length > 0 ? tenantCourts : courts;

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedCourtId, setSelectedCourtId] = useState<string>(
    selectedCourtsForBooking && selectedCourtsForBooking.length > 0
      ? selectedCourtsForBooking[0]
      : activeCourts[0]?.id || 'court-1'
  );
  const [selectedSlot, setSelectedSlot] = useState<string>('18:30');
  const [duration, setDuration] = useState<60 | 90>(90);
  const [isSplitPayment, setIsSplitPayment] = useState<boolean>(true);
  const [player2, setPlayer2] = useState('');
  const [player3, setPlayer3] = useState('');
  const [player4, setPlayer4] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const selectedCourt = activeCourts.find((c) => c.id === selectedCourtId) || activeCourts[0];

  const timeSlots = [
    '09:00', '10:30', '12:00', '13:30', '15:30', '17:00', '18:30', '20:00', '21:30'
  ];

  // Calculate pricing
  const multiplier = duration === 90 ? 1.5 : 1.0;
  const totalPrice = selectedCourt ? selectedCourt.hourlyRate * multiplier : 42.0;
  const pricePerPlayer = totalPrice / 4;

  // Check if slot is taken on this date for this court
  const isSlotTaken = (slotTime: string) => {
    return bookings.some(
      (b) =>
        b.courtId === selectedCourtId &&
        b.status !== 'canceled' &&
        b.startTime.includes(slotTime)
    );
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();

    const startISO = `${selectedDate}T${selectedSlot}:00`;
    const endMinutes = duration === 90 ? 90 : 60;
    const endHour = parseInt(selectedSlot.split(':')[0]) + Math.floor(endMinutes / 60);
    const endMin = (parseInt(selectedSlot.split(':')[1]) + (endMinutes % 60)) % 60;
    const endISO = `${selectedDate}T${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`;

    const participants = isSplitPayment
      ? [
          { name: currentUser.name || 'Tú (Titular)', paid: true, amount: pricePerPlayer },
          { name: player2 || 'Jugador 2 (Invitado)', paid: false, amount: pricePerPlayer },
          { name: player3 || 'Jugador 3 (Invitado)', paid: false, amount: pricePerPlayer },
          { name: player4 || 'Jugador 4 (Invitado)', paid: false, amount: pricePerPlayer },
        ]
      : [{ name: `${currentUser.name || 'Titular'} (Pago Completo)`, paid: true, amount: totalPrice }];

    const newBooking = createBooking({
      courtId: selectedCourt.id,
      courtName: selectedCourt.name,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      startTime: startISO,
      endTime: endISO,
      status: 'confirmed',
      totalPrice,
      paymentStatus: isSplitPayment ? 'partially_paid' : 'paid',
      isSplitPayment,
      participants,
    });

    setConfirmedBooking(newBooking);
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pb-24 text-[#0B1A2D] dark:text-slate-100 transition-colors duration-200">
      {confirmedBooking ? (
        <div className="max-w-xl mx-auto rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-8 sm:p-10 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-2xl bg-[#B7F229] text-[#0B1A2D] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white">
              Reserva Confirmada con Éxito
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tu pista ha quedado bloqueada en el sistema de {currentTenant.name}.
            </p>
          </div>

          {/* Ticket Summary (clean divider rows, no double boxed container nesting) */}
          <div className="border-t border-b border-slate-200/80 dark:border-[#1A314D] divide-y divide-slate-200/70 dark:divide-[#1A314D] text-left text-xs">
            <div className="flex justify-between py-3">
              <span className="text-slate-500 dark:text-slate-400">Pista</span>
              <span className="text-[#0B1A2D] dark:text-white font-semibold">{confirmedBooking.courtName}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-slate-500 dark:text-slate-400">Fecha y horario</span>
              <span className="text-[#0B1A2D] dark:text-[#B7F229] font-mono tabular-nums font-bold">
                {confirmedBooking.startTime.replace('T', ' ')} ({duration} min)
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-slate-500 dark:text-slate-400">PIN acceso a pista</span>
              <span className="text-[#8B5CF6] dark:text-[#a78bfa] font-mono tabular-nums font-bold text-sm tracking-widest">
                {confirmedBooking.accessPin}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-slate-500 dark:text-slate-400">Modalidad de cobro</span>
              <span className="text-[#0B1A2D] dark:text-slate-200 font-mono tabular-nums">
                {confirmedBooking.isSplitPayment
                  ? `Dividido (4 x ${pricePerPlayer.toFixed(2)} €)`
                  : `Pago único (${totalPrice.toFixed(2)} €)`}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#071220] text-slate-600 dark:text-slate-300 text-xs text-left flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#8B5CF6] dark:text-[#a78bfa]" />
            <span>
              <strong className="text-[#0B1A2D] dark:text-white">Integración automatizada:</strong> Los focos LED de la pista se encenderán automáticamente 5 minutos antes del inicio de la reserva mediante los relés IoT del club.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setConfirmedBooking(null)}
              className="w-full sm:flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-white dark:bg-[#071220] hover:bg-slate-50 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-white font-semibold text-xs border border-slate-200/80 dark:border-[#1A314D] transition cursor-pointer"
            >
              Hacer Otra Reserva
            </button>
            <button
              type="button"
              onClick={() => {
                setPublicPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition cursor-pointer"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#8B5CF6] dark:text-[#a78bfa]">
              Sistema de Reservas Online · {currentTenant.shortName}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight">
              Reserva tu Pista en {currentTenant.shortName}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Confirmación inmediata, generación de PIN inteligente de entrada y pago flexible individual o dividido.
            </p>
          </div>

          <form onSubmit={handleConfirmReservation} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step 1, 2, 3 & 4 */}
            <div className="lg:col-span-8 space-y-6">
              {/* Date & Duration pickers */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-5">
                <h3 className="text-sm font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                  <span>1. Selecciona Fecha y Duración</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-semibold">
                      Día
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full min-h-[42px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3.5 py-2 text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6] font-mono tabular-nums font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-semibold">
                      Duración
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDuration(60)}
                        className={`min-h-[42px] py-2 px-3 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                          duration === 60
                            ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D] border-[#0B1A2D] dark:border-[#B7F229]'
                            : 'bg-slate-50 dark:bg-[#071220] text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-[#1A314D] hover:bg-slate-100 dark:hover:bg-[#132A45]'
                        }`}
                      >
                        60 Minutos
                      </button>
                      <button
                        type="button"
                        onClick={() => setDuration(90)}
                        className={`min-h-[42px] py-2 px-3 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                          duration === 90
                            ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D] border-[#0B1A2D] dark:border-[#B7F229]'
                            : 'bg-slate-50 dark:bg-[#071220] text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-[#1A314D] hover:bg-slate-100 dark:hover:bg-[#132A45]'
                        }`}
                      >
                        90 Minutos
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Court Selector */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-5">
                <h3 className="text-sm font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                  <span>2. Elige Pista</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeCourts.map((court) => {
                    const isSelected = selectedCourtId === court.id;
                    return (
                      <button
                        key={court.id}
                        type="button"
                        onClick={() => setSelectedCourtId(court.id)}
                        className={`text-left min-h-[60px] p-4 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#0B1A2D] dark:bg-[#132A45] border-[#0B1A2D] dark:border-[#B7F229] text-white'
                            : 'bg-slate-50 dark:bg-[#071220] border-slate-200/80 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-[#0B1A2D] dark:text-white'}`}>
                            {court.name}
                          </div>
                          <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                            {court.surface}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-mono tabular-nums font-bold ${isSelected ? 'text-[#B7F229]' : 'text-[#0B1A2D] dark:text-[#B7F229]'}`}>
                            {(court.hourlyRate * multiplier).toFixed(2)} €
                          </div>
                          <div className={`text-[10px] font-mono tabular-nums ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                            {duration} min
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-5">
                <h3 className="text-sm font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                  <span>3. Horario Disponible (<span className="font-mono tabular-nums">{selectedDate}</span>)</span>
                </h3>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {timeSlots.map((slot) => {
                    const taken = isSlotTaken(slot);
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={taken}
                        onClick={() => setSelectedSlot(slot)}
                        className={`min-h-[42px] py-2.5 px-2 rounded-xl text-xs font-mono tabular-nums font-semibold text-center transition ${
                          taken
                            ? 'bg-slate-100 dark:bg-[#071220]/60 text-slate-400 dark:text-slate-600 line-through cursor-not-allowed border border-slate-200/80 dark:border-[#1A314D]'
                            : isSelected
                            ? 'bg-[#B7F229] text-[#0B1A2D] font-bold border border-[#B7F229] cursor-pointer'
                            : 'bg-slate-50 dark:bg-[#071220] text-[#0B1A2D] dark:text-slate-200 border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D] dark:hover:border-[#B7F229] cursor-pointer'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Split Payment & Participants */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                    <span>4. Modalidad de Pago y Compañeros</span>
                  </h3>

                  <div className="flex items-center gap-2.5 text-xs shrink-0">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Pago dividido</span>
                    <button
                      type="button"
                      onClick={() => setIsSplitPayment(!isSplitPayment)}
                      aria-label="Alternar pago dividido"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        isSplitPayment ? 'bg-[#0B1A2D] dark:bg-[#B7F229]' : 'bg-slate-300 dark:bg-[#1A314D]'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                          isSplitPayment
                            ? 'translate-x-6 bg-[#B7F229] dark:bg-[#0B1A2D]'
                            : 'translate-x-1 bg-white'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {isSplitPayment ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Pagarás ahora tu parte (<strong className="text-[#0B1A2D] dark:text-white font-mono tabular-nums">{pricePerPlayer.toFixed(2)} €</strong>) y el sistema enviará un enlace de pago al resto de los jugadores.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 mb-1.5 font-semibold">Jugador 2</label>
                        <input
                          type="text"
                          value={player2}
                          onChange={(e) => setPlayer2(e.target.value)}
                          placeholder="diego.soto@email.es"
                          className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#8B5CF6] font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 mb-1.5 font-semibold">Jugador 3</label>
                        <input
                          type="text"
                          value={player3}
                          onChange={(e) => setPlayer3(e.target.value)}
                          placeholder="marcos.rey@email.es"
                          className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#8B5CF6] font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 mb-1.5 font-semibold">Jugador 4</label>
                        <input
                          type="text"
                          value={player4}
                          onChange={(e) => setPlayer4(e.target.value)}
                          placeholder="ivan.gomez@email.es"
                          className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#8B5CF6] font-medium"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Pagas la pista completa ahora (<strong className="text-[#0B1A2D] dark:text-white font-mono tabular-nums">{totalPrice.toFixed(2)} €</strong>).
                  </p>
                )}
              </div>
            </div>

            {/* Right Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-6 space-y-5">
                <h3 className="text-sm font-bold text-[#0B1A2D] dark:text-white border-b border-slate-200/80 dark:border-[#1A314D] pb-3.5">
                  Resumen de Reserva
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Club</span>
                    <span className="font-semibold text-[#0B1A2D] dark:text-white">{currentTenant.shortName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Pista</span>
                    <span className="font-semibold text-[#8B5CF6] dark:text-[#a78bfa]">{selectedCourt?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Fecha</span>
                    <span className="text-[#0B1A2D] dark:text-white font-mono tabular-nums">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Hora</span>
                    <span className="text-[#0B1A2D] dark:text-white font-mono tabular-nums">{selectedSlot} ({duration} min)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Modo de pago</span>
                    <span className="text-[#0B1A2D] dark:text-slate-200">{isSplitPayment ? 'Dividido (4 partes)' : 'Pago total'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/80 dark:border-[#1A314D] flex justify-between items-baseline">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">A pagar hoy</div>
                    <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                      {isSplitPayment ? `Total pista: ${totalPrice.toFixed(2)} €` : 'Pista completa'}
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums">
                    {(isSplitPayment ? pricePerPlayer : totalPrice).toFixed(2)} €
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] font-bold text-[#0B1A2D] text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Confirmar y Reservar Pista</span>
                </button>

                <div className="text-[11px] text-center text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0" />
                  <span>Confirmación inmediata con PIN inteligente.</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
