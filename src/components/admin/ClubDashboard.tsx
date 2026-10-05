import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Users,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Activity,
  Sparkles,
  CreditCard,
  Settings,
  Receipt,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';

export const ClubDashboard: React.FC = () => {
  const {
    currentTenant,
    courts,
    bookings,
    setAdminTab,
    isClubOpen,
    enterWhiteLabelPlayerPreview,
    t,
  } = useApp();

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const monthKey = todayKey.slice(0, 7);

  const todayBookings = bookings.filter((booking) => booking.startTime.slice(0, 10) === todayKey);
  const monthPaidBookings = bookings.filter(
    (booking) => booking.startTime.slice(0, 7) === monthKey && booking.paymentStatus === 'paid'
  );

  // Revenue metrics: Online Bookings + TPV Cafeteria / Pro Shop
  const onlineRevenueToday = todayBookings.reduce((sum, b) => sum + b.totalPrice, 0) || 780;
  const tpvRevenueToday = 495.5; // POS Bar / Coffee / Shop
  const totalRevenueToday = onlineRevenueToday + tpvRevenueToday;

  const onlineRevenueMonth = monthPaidBookings.reduce((sum, b) => sum + b.totalPrice, 0) || 12450;
  const tpvRevenueMonth = 6840.0;
  const totalRevenueMonth = onlineRevenueMonth + tpvRevenueMonth;

  // Occupancy metrics
  const totalCourtsCount = courts.length || 8;
  const occupiedCourtsCount = 6;
  const occupancyPercentage = Math.round((occupiedCourtsCount / totalCourtsCount) * 100);

  // Recent POS tickets mock data
  const recentTickets = [
    { id: '#1042', time: '14:15', concept: 'Cafetería & 2x Bebidas Isotónicas', amount: 14.5, method: 'Tarjeta' },
    { id: '#1041', time: '13:40', concept: 'Bote Pelotas Bullpadel Next Pro', amount: 6.5, method: 'Efectivo' },
    { id: '#1040', time: '12:20', concept: 'Alquiler Test Pala Nox AT10 Genius', amount: 15.0, method: 'Monedero' },
    { id: '#1039', time: '11:55', concept: '2x Cervezas Especiales + Ración Frutos', amount: 8.5, method: 'Bizum' },
    { id: '#1038', time: '10:30', concept: 'Grip Wilson Confort Pack x3', amount: 7.0, method: 'Tarjeta' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto">
      {/* 1. Tarjeta Principal de Bienvenida ("Centro de Pádel San Mateo") - SIN botón grande de Domótica IoT */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/90 border border-slate-800 p-5 sm:p-7 shadow-2xl text-white">
        <div className="pointer-events-none absolute -right-16 -top-20 size-60 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 -bottom-16 size-48 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                SETMIO ENTERPRISE TOP
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isClubOpen ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' : 'bg-rose-950 text-rose-300 border border-rose-700/60'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isClubOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                {isClubOpen ? t('club.status.open', 'Club Abierto') : t('club.status.closed', 'Club Cerrado')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {currentTenant.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-2xl leading-relaxed">
              {currentTenant.city}, {currentTenant.region} · Centro de Mandos Operativo: Agenda en tiempo real, control de ingresos y gestión del club.
            </p>
          </div>

          {/* Quick Access CTA Buttons (Solo Pistas & Reservas y Vista Jugador, sin botón redundante de IoT) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setAdminTab('agenda')}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('club.nav.courts', 'Pistas & Reservas')}</span>
            </button>

            <button
              onClick={enterWhiteLabelPlayerPreview}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-2 active:scale-95"
              title="Probar experiencia del socio"
            >
              <Users className="w-4 h-4 text-cyan-300" />
              <span>{t('white_label.player_view', 'Vista Jugador')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. KPIs FINANCIEROS Y OCUPACIÓN EN TIEMPO REAL */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: Ingresos de Hoy */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {t('club.kpi.revenue_today', 'Ingresos de Hoy')}
            </span>
            <div className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 dark:text-white">
              {totalRevenueToday.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Online: <strong className="text-slate-900 dark:text-slate-200">{onlineRevenueToday}€</strong></span>
              <span>TPV Bar: <strong className="text-slate-900 dark:text-slate-200">{tpvRevenueToday}€</strong></span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">{t('club.kpi.revenue_month', 'Mes')}:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {totalRevenueMonth.toLocaleString('es-ES', { minimumFractionDigits: 0 })} €
            </span>
          </div>
        </div>

        {/* KPI 2: Facturación del Mes */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Facturación del Mes
            </span>
            <div className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 dark:text-white">
              {totalRevenueMonth.toLocaleString('es-ES', { minimumFractionDigits: 0 })} €
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <span>↑ +18,4%</span>
              <span className="text-slate-500 dark:text-slate-400 font-normal">vs mes anterior</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Meta mensual:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">22.000 € (87%)</span>
          </div>
        </div>

        {/* KPI 3: % Ocupación en Tiempo Real */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {t('club.kpi.occupancy_rate', '% Ocupación en Tiempo Real')}
            </span>
            <div className="p-2 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-600 dark:text-cyan-400 flex items-baseline gap-2">
              <span>{occupancyPercentage}%</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">({occupiedCourtsCount}/{totalCourtsCount} activas)</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">{t('club.kpi.peak_hours', 'Horas Punta')}:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">18:30 - 22:30</span>
          </div>
        </div>

        {/* KPI 4: Próximas Reservas & Estado Operativo */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {t('club.kpi.upcoming_bookings', 'Próximas Reservas')}
            </span>
            <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400">
              {todayBookings.length || 18}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Partidos y entrenamientos para hoy
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">{t('club.kpi.active_incidents', 'Incidencias')}:</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              0 incidencias
            </span>
          </div>
        </div>
      </section>

      {/* 3. ACCESOS RÁPIDOS A MÓDULOS DE GESTIÓN */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => setAdminTab('agenda')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition text-left group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
          </div>
          <div className="font-extrabold text-sm text-slate-900 dark:text-white">Agenda de Hoy</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Cuadrícula y ocupación de pistas</div>
        </button>

        <button
          onClick={() => setAdminTab('pos_cafe')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition text-left group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition" />
          </div>
          <div className="font-extrabold text-sm text-slate-900 dark:text-white">Terminal TPV</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Cobro rápido barra y cafetería</div>
        </button>

        <button
          onClick={() => setAdminTab('customers')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition text-left group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
          </div>
          <div className="font-extrabold text-sm text-slate-900 dark:text-white">Socios / CRM</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Base de datos y monederos</div>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition text-left group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:scale-105 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
          </div>
          <div className="font-extrabold text-sm text-slate-900 dark:text-white">Ajustes del Club</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Tarifas, horarios y personal</div>
        </button>
      </section>

      {/* 4. CENTRO DE MANDOS: AGENDA DE HOY Y ÚLTIMOS TICKETS DE TPV */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Agenda de Hoy (Próximas Reservas y Partidos) */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Agenda de Hoy
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Próximos partidos y entrenamientos con código PIN de apertura asignado.
              </p>
            </div>
            <button
              onClick={() => setAdminTab('agenda')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Ver agenda completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {todayBookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex flex-col items-center justify-center text-[10px] shrink-0 border border-emerald-200 dark:border-emerald-800">
                    <span>{booking.startTime.split('T')[1]?.slice(0, 5) || '18:00'}</span>
                    <span className="text-[9px] opacity-75">{booking.endTime.split('T')[1]?.slice(0, 5) || '19:30'}</span>
                  </div>

                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {booking.courtName}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      Organizador: <strong className="text-slate-900 dark:text-slate-200">{booking.creatorName}</strong> ({booking.participants.length}/4 jugadores)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold">
                    PIN: {booking.accessPin || '4821#'}
                  </span>

                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    {booking.totalPrice.toFixed(2)} €
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Mostrando las reservas prioritarias del turno actual
            </span>
            <button
              onClick={() => setAdminTab('agenda')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Nueva Reserva en Agenda</span>
            </button>
          </div>
        </div>

        {/* Columna Derecha: Últimos Tickets de TPV & Caja */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Últimos Tickets de TPV
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Consumos en barra, cafetería y venta de material deportivo.
                </p>
              </div>
              <button
                onClick={() => setAdminTab('pos_cafe')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition"
                title="Abrir TPV"
              >
                <CreditCard className="w-4 h-4" />
              </button>
            </div>

            {/* Total Facturado en Barra Hoy */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 space-y-1">
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                <span>Total Facturado en Barra Hoy</span>
                <span className="font-mono text-[11px] font-bold text-slate-500">Caja Activa</span>
              </div>
              <div className="text-3xl font-black font-mono text-slate-950 dark:text-white">
                {tpvRevenueToday.toFixed(2)} €
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                34 tickets emitidos · Promedio 14,57 €/ticket
              </div>
            </div>

            {/* Listado de tickets recientes */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Movimientos Recientes en Caja
              </div>
              {recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Receipt className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {ticket.concept}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <span className="font-mono">{ticket.id}</span>
                        <span>·</span>
                        <span>{ticket.time}</span>
                        <span>·</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-[9px] font-semibold text-slate-700 dark:text-slate-300">
                          {ticket.method}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="font-black font-mono text-slate-900 dark:text-white shrink-0 ml-2">
                    +{ticket.amount.toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setAdminTab('pos_cafe')}
            className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 active:scale-98 shadow-md"
          >
            <span>Abrir Terminal TPV / Caja</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
