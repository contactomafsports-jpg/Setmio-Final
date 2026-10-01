import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, Court } from '../../types/database';
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
  } = useApp();

  const [currentDate, setCurrentDate] = useState('2026-09-30');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

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
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header & Date Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Reservas y disponibilidad</h2>
          <p className="text-xs text-slate-400">Cuadrante de pistas, historial y gestión completa del club</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setCurrentDate('2026-09-29')}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="bg-transparent text-white font-semibold text-xs focus:outline-none px-2"
            />
            <button
              onClick={() => setCurrentDate('2026-10-01')}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Reserva</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid Matrix */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto shadow-2xl">
        <div className="min-w-[900px]">
          {/* Header Courts Row */}
          <div className="grid grid-cols-9 border-b border-slate-800 bg-slate-950 text-xs font-semibold text-slate-300">
            <div className="p-3 text-center text-slate-500 border-r border-slate-800">
              Hora
            </div>
            {courts.map((court) => (
              <div
                key={court.id}
                className="p-3 border-r border-slate-800 last:border-r-0 flex flex-col justify-between"
              >
                <div className="font-bold text-white truncate text-[11px]">{court.name.split('—')[0]}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{court.hourlyRate}€/h</span>
                  <button
                    onClick={() => toggleCourtLight(court.id)}
                    className={`p-1 rounded transition ${
                      court.isLightOn ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
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
              className="grid grid-cols-9 border-b border-slate-800/60 hover:bg-slate-800/20 text-xs"
            >
              <div className="p-3 text-center font-mono text-slate-400 border-r border-slate-800 bg-slate-950/60">
                {time}
              </div>

              {courts.map((court) => {
                const booking = getBookingForSlot(court.id, time);
                return (
                  <div
                    key={court.id}
                    className="p-1 border-r border-slate-800/60 last:border-r-0 min-h-[58px] flex items-center"
                  >
                    {booking ? (
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="w-full h-full p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-left hover:border-emerald-400 transition"
                      >
                        <div className="font-bold text-emerald-300 truncate text-[11px]">
                          {booking.creatorName}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span>{booking.totalPrice}€</span>
                          <span className="font-mono text-amber-300">PIN {booking.accessPin}</span>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setNewCourtId(court.id);
                          setNewTime(time);
                          setShowNewModal(true);
                        }}
                        className="w-full h-full rounded-lg hover:bg-slate-800/50 flex items-center justify-center text-slate-700 hover:text-slate-400 text-[10px] transition"
                      >
                        + Libre
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Reservation history */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div><h3 className="font-bold text-white text-sm">Todas las reservas</h3><p className="text-[11px] text-slate-400">Histórico completo, incluidas canceladas</p></div>
          <span className="text-[11px] rounded-full bg-slate-800 px-2.5 py-1 text-slate-300">{bookings.length} registros</span>
        </div>
        <div className="divide-y divide-slate-800/80">
          {bookings.map((booking) => (
            <button key={booking.id} onClick={() => setSelectedBooking(booking)} className="w-full p-4 text-left flex flex-wrap items-center gap-3 hover:bg-slate-800/50 transition">
              <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><Calendar className="w-4 h-4" /></div>
              <div className="min-w-[150px] flex-1"><div className="text-xs font-bold text-white">{booking.creatorName}</div><div className="text-[11px] text-slate-400">{booking.courtName} · {booking.startTime.replace('T', ' ')}</div></div>
              <span className={`text-[10px] font-bold uppercase ${booking.status === 'canceled' ? 'text-rose-400' : 'text-emerald-400'}`}>{booking.status === 'canceled' ? 'Cancelada' : 'Confirmada'}</span>
              <span className="text-xs font-mono text-slate-300">{booking.totalPrice.toFixed(2)} €</span>
            </button>
          ))}
        </div>
      </section>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Detalle de la Reserva</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Pista:</span>
                <span className="font-bold text-white">{selectedBooking.courtName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Titular:</span>
                <span className="text-slate-200">{selectedBooking.creatorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Horario:</span>
                <span className="font-mono text-emerald-400">{selectedBooking.startTime.replace('T', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PIN Cerradura:</span>
                <span className="font-mono text-amber-300 font-bold">{selectedBooking.accessPin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total:</span>
                <span className="font-mono font-bold text-white">{selectedBooking.totalPrice.toFixed(2)} €</span>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  const nextName = window.prompt('Titular de la reserva', selectedBooking.creatorName);
                  if (nextName?.trim()) updateBooking(selectedBooking.id, { creatorName: nextName.trim() });
                  setSelectedBooking(null);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition"
              >
                Editar titular
              </button>
              <button
                onClick={() => {
                  cancelBooking(selectedBooking.id);
                  setSelectedBooking(null);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-bold text-xs transition"
              >
                Cancelar y Liberar Pista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Reservation Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-1">Nueva Reserva en Mostrador</h3>
            <p className="text-xs text-slate-400 mb-4">Recepción Pádel San Mateo</p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Tipo de Operación</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setClientType('existing')}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition ${
                      clientType === 'existing' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Socio Club
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientType('new')}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition ${
                      clientType === 'new' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Nuevo / Libre
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientType('block')}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition ${
                      clientType === 'block' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bloqueo Pista
                  </button>
                </div>
              </div>

              {clientType === 'existing' && (
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Socio del Club</label>
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-medium"
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
                    <label className="block text-slate-300 mb-1 font-semibold">Nombre Cliente</label>
                    <input
                      type="text"
                      required
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      placeholder="+34 600..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {clientType === 'block' && (
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Motivo del Bloqueo</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Ej. Mantenimiento césped o Cuadro de Torneo"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 font-semibold text-rose-300"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Duración de la Reserva</label>
                <div className="grid grid-cols-3 gap-2">
                  {[60, 90, 120].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDurationMinutes(dur as typeof durationMinutes)}
                      className={`py-1.5 px-2 rounded-xl font-bold border transition text-center ${
                        durationMinutes === dur
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {dur} min {dur === 90 ? '(1h 30m)' : dur === 120 ? '(2 horas)' : '(1 hora)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Pista</label>
                  <select
                    value={newCourtId}
                    onChange={(e) => setNewCourtId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {courts.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Hora Inicio</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    {timeRows.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {clientType !== 'block' && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-300">
                    <input
                      type="checkbox"
                      checked={newSplit}
                      onChange={(e) => setNewSplit(e.target.checked)}
                      className="rounded accent-emerald-500 w-4 h-4"
                    />
                    <span>Habilitar Pago Dividido (Split 4 jugadores)</span>
                  </label>

                  {newSplit && (
                    <div className="space-y-1.5 pt-1 text-[11px]">
                      <span className="text-slate-400 block font-medium">Invitar compañeros (email o nombre):</span>
                      <input
                        type="text"
                        placeholder="Jugador 2: ej. marcos@email.es"
                        value={invitedPlayer2}
                        onChange={(e) => setInvitedPlayer2(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Jugador 3: ej. brais@email.es"
                        value={invitedPlayer3}
                        onChange={(e) => setInvitedPlayer3(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Jugador 4: ej. lucia@email.es"
                        value={invitedPlayer4}
                        onChange={(e) => setInvitedPlayer4(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow"
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
