import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Court, Booking } from '../../types/database';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  UserPlus,
} from 'lucide-react';

export const BookingFlow: React.FC = () => {
  const {
    currentTenant,
    courts,
    bookings,
    createBooking,
    currentUser,
    setPublicPage,
    triggerDemoToast,
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
    <div className="min-h-[calc(100dvh-4rem)] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* If booking confirmed success view */}
      {confirmedBooking ? (
        <div className="max-w-xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-300 dark:border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">¡Reserva Confirmada con Éxito!</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Tu pista ha quedado bloqueada en el sistema de {currentTenant.name}.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 text-left text-xs space-y-3 font-mono">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-500 font-sans">Pista:</span>
              <span className="text-slate-900 dark:text-white font-bold font-sans">{confirmedBooking.courtName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-500 font-sans">Fecha y Horario:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {confirmedBooking.startTime.replace('T', ' ')} (90 min)
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-500 font-sans">PIN Acceso a Pista:</span>
              <span className="text-amber-500 font-bold text-sm tracking-widest">
                {confirmedBooking.accessPin}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Modalidad de Cobro:</span>
              <span className="text-slate-800 dark:text-slate-200 font-sans">
                {confirmedBooking.isSplitPayment ? `Dividido (4 x ${pricePerPlayer.toFixed(2)}€)` : `Pago único (${totalPrice.toFixed(2)}€)`}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs text-left flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>Integración Automatizada:</strong> Los focos LED de la pista se encenderán automáticamente 5 minutos antes del inicio de la reserva mediante los relés IoT Shelly de la instalación.
            </span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setConfirmedBooking(null)}
              className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs border border-slate-300 dark:border-slate-700 transition"
            >
              Hacer Otra Reserva
            </button>
            <button
              onClick={() => {
                setPublicPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs shadow transition"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      ) : (
        /* Reservation Wizard Form */
        <div className="space-y-8">
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Sistema de Reservas Online
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Reserva de Pistas en {currentTenant.shortName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Confirmación inmediata, generación de PIN inteligente de entrada y pago flexible individual o dividido.
            </p>
          </div>

          <form onSubmit={handleConfirmReservation} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Step 1 & 2: Select Date & Court */}
            <div className="lg:col-span-8 space-y-6">
              {/* Date & Duration pickers */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>1. Selecciona Fecha y Duración</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-semibold">Día</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-semibold">Duración</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDuration(60)}
                        className={`py-2 text-xs font-semibold rounded-xl border transition ${
                          duration === 60
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        60 Minutos
                      </button>
                      <button
                        type="button"
                        onClick={() => setDuration(90)}
                        className={`py-2 text-xs font-semibold rounded-xl border transition ${
                          duration === 90
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        90 Minutos (Estándar)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Court Selector */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
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
                        className={`text-left p-3.5 rounded-2xl border transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-slate-900 dark:text-white shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{court.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{court.surface}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {(court.hourlyRate * multiplier).toFixed(2)} €
                          </div>
                          <div className="text-[10px] text-slate-400">{duration} min</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>3. Horario Disponible ({selectedDate})</span>
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
                        className={`py-2.5 px-2 rounded-xl text-xs font-semibold text-center transition ${
                          taken
                            ? 'bg-slate-100 dark:bg-slate-950/50 text-slate-400 dark:text-slate-600 line-through cursor-not-allowed border border-slate-200 dark:border-slate-800'
                            : isSelected
                            ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-md shadow-emerald-600/30'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Split Payment & Participants */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>4. Modalidad de Pago y Compañeros</span>
                  </h3>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Pago Dividido:</span>
                    <button
                      type="button"
                      onClick={() => setIsSplitPayment(!isSplitPayment)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isSplitPayment ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isSplitPayment ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {isSplitPayment ? (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Pagarás ahora tu parte (<strong className="text-slate-900 dark:text-white">{pricePerPlayer.toFixed(2)} €</strong>) y el sistema enviará un enlace de pago al resto de los jugadores.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Jugador 2 (Nombre o Email)</label>
                        <input
                          type="text"
                          value={player2}
                          onChange={(e) => setPlayer2(e.target.value)}
                          placeholder="diego.soto@email.es"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Jugador 3 (Nombre o Email)</label>
                        <input
                          type="text"
                          value={player3}
                          onChange={(e) => setPlayer3(e.target.value)}
                          placeholder="marcos.rey@email.es"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Jugador 4 (Nombre o Email)</label>
                        <input
                          type="text"
                          value={player4}
                          onChange={(e) => setPlayer4(e.target.value)}
                          placeholder="ivan.gomez@email.es"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">
                    Pagas la pista completa ahora (<strong className="text-slate-900 dark:text-white">{totalPrice.toFixed(2)} €</strong>).
                  </p>
                )}
              </div>
            </div>

            {/* Right Summary Sidebar */}
            <div className="lg:col-span-4 space-y-5">
              <div className="sticky top-28 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Resumen de Reserva
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Club:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{currentTenant.shortName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Pista:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedCourt.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Fecha:</span>
                    <span className="text-slate-900 dark:text-white">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Hora:</span>
                    <span className="text-slate-900 dark:text-white font-mono">{selectedSlot} ({duration} min)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Modo de Pago:</span>
                    <span className="text-slate-800 dark:text-slate-200">{isSplitPayment ? 'Dividido (4 partes)' : 'Pago Total'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">A pagar hoy:</div>
                    <div className="text-[10px] text-slate-400">
                      {isSplitPayment ? `Total pista: ${totalPrice.toFixed(2)}€` : 'Pista completa'}
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                    {(isSplitPayment ? pricePerPlayer : totalPrice).toFixed(2)} €
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 font-extrabold text-white dark:text-slate-950 text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Confirmar y Reservar Pista</span>
                </button>

                <div className="text-[10px] text-center text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Modo demostración. Se generará PIN sin cargo bancario.</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
