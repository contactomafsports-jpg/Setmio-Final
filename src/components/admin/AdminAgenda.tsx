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
  const [newClientName, setNewClientName] = useState('');
  const [newSplit, setNewSplit] = useState(false);

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

    const newB = createBooking({
      courtId: court.id,
      courtName: court.name,
      creatorId: 'reception-client',
      creatorName: newClientName || 'Cliente Recepción',
      startTime: startISO,
      endTime: `${currentDate}T20:00:00`,
      status: 'confirmed',
      totalPrice: court.hourlyRate * 1.5,
      paymentStatus: 'paid',
      isSplitPayment: newSplit,
      participants: [{ name: newClientName || 'Cliente Mostrador', paid: true, amount: court.hourlyRate * 1.5 }],
    });

    setShowNewModal(false);
    setNewClientName('');
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
                <label className="block text-slate-300 mb-1">Nombre del Socio / Cliente</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Carlos Méndez"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Pista</label>
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
                  <label className="block text-slate-300 mb-1">Hora Inicio</label>
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
