import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Zap,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentTenant,
    courts,
    bookings,
    setAdminTab,
    toggleCourtLight,
    triggerDemoToast,
  } = useApp();

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const monthKey = todayKey.slice(0, 7);
  const todayBookings = bookings.filter((booking) => booking.startTime.slice(0, 10) === todayKey);
  const monthPaidBookings = bookings.filter((booking) =>
    booking.startTime.slice(0, 7) === monthKey && booking.paymentStatus === 'paid'
  );
  const activeClients = new Set(bookings.flatMap((booking) =>
    [booking.creatorName, ...booking.participants.map((participant) => participant.name)]
  )).size;
  const activeCourtsWithLights = courts.filter((c) => c.isLightOn).length;
  const confirmedRevenue = monthPaidBookings.reduce((total, booking) => total + booking.totalPrice, 0);
  const availableCourts = courts.length;

  return (
    <div className="space-y-6 sm:space-y-8 text-slate-900 dark:text-slate-100">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/80 border border-slate-800 shadow-xl">
        <div className="pointer-events-none absolute -right-12 -top-16 size-40 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative space-y-1">
<div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
  Panel de Operaciones · Plan {currentTenant.planId.toUpperCase()}
  </div>
  <h2 className="text-2xl font-black text-white">
  Bienvenido, {currentTenant.name}
  </h2>
  <p className="text-xs text-slate-100">
            {currentTenant.city}, {currentTenant.region} · Datos de demostración en este navegador
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAdminTab('agenda')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-slate-950 text-xs shadow transition flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Ver Agenda Diaria</span>
          </button>
          <button
            onClick={() => setAdminTab('domains')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs border border-slate-700 transition"
          >
            Mi Web y Enlaces
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Reservas registradas hoy</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">{todayBookings.length}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>De los datos de esta demostración</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cobros registrados este mes</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">{confirmedRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</div>
          <div className="text-[11px] text-slate-400">Solo reservas marcadas como pagadas</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Personas en reservas</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">{activeClients}</div>
          <div className="text-[11px] text-purple-400">Personas únicas en el conjunto de reservas</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Luces marcadas como activas</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {activeCourtsWithLights} / {availableCourts}
          </div>
          <div className="text-[11px] text-amber-400">Estado simulado localmente · sin conexión IoT</div>
        </div>
      </div>

      {/* Courts Status Quick Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Estado de pistas ({courts.length})</h3>
          <span className="text-xs text-slate-400">Vista local de demostración; no controla hardware conectado</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {courts.map((court) => (
            <div
              key={court.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{court.name}</div>
                <div className="text-[11px] text-slate-400">{court.hourlyRate.toFixed(2)} €/h · {court.isPanoramic ? 'WPT' : 'Classic'}</div>
              </div>

              <button
                onClick={() => toggleCourtLight(court.id)}
                className={`p-2.5 rounded-xl border transition ${
                  court.isLightOn
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-600 border-slate-800 hover:text-slate-400'
                }`}
                title={court.isLightOn ? 'Apagar focos LED' : 'Encender focos LED'}
              >
                <Zap className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Bookings Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Próximas Reservas de Hoy</h3>
          <button
            onClick={() => setAdminTab('agenda')}
            className="text-xs text-emerald-400 font-semibold hover:underline"
          >
            Ver cuadrante completo
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{b.courtName}</div>
                  <div className="text-slate-400 text-[11px]">Titular: {b.creatorName}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-300">
                <span className="font-mono text-emerald-400">{b.startTime.split('T')[1]?.slice(0, 5) || ''} - {b.endTime.split('T')[1]?.slice(0, 5) || ''}</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 font-mono text-[10px] text-amber-300 border border-slate-800">
                  PIN {b.accessPin || '4821#'}
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{b.totalPrice.toFixed(2)} €</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
