import React, { useState } from 'react';
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
  Lock,
  Unlock,
  Power,
  Activity,
  Layers,
  Sparkles,
  CreditCard,
  ShoppingBag,
  Flame,
  Check,
  RefreshCw,
  Sliders,
  Filter,
} from 'lucide-react';

export const ClubDashboard: React.FC = () => {
  const {
    currentTenant,
    courts,
    bookings,
    setAdminTab,
    toggleCourtLight,
    openCourtDoor,
    toggleDeviceOnline,
    triggerDemoToast,
    isClubOpen,
    toggleClubOpenState,
    enterWhiteLabelPlayerPreview,
    t,
  } = useApp();

  const [sportFilter, setSportFilter] = useState<'all' | 'padel' | 'tennis' | 'pickleball'>('all');
  const [openingDoorId, setOpeningDoorId] = useState<string | null>(null);

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

  // Real-time IoT metrics
  const activeCourtsWithLights = courts.filter((c) => c.isLightOn).length;
  const onlineDevicesCount = courts.filter((c) => c.isDeviceOnline !== false).length;
  const totalCourtsCount = courts.length;
  const occupiedCourtsCount = 6;
  const occupancyPercentage = Math.round((occupiedCourtsCount / totalCourtsCount) * 100);

  const filteredCourts = courts.filter((c) => {
    if (sportFilter === 'all') return true;
    return c.sport === sportFilter;
  });

  const handleOpenDoor = (courtId: string, courtName: string) => {
    setOpeningDoorId(courtId);
    openCourtDoor(courtId);
    setTimeout(() => {
      setOpeningDoorId(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto">
      {/* 1. Welcome Enterprise Banner */}
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
              {currentTenant.city}, {currentTenant.region} · Todos los módulos conectados en tiempo real: Domótica IoT, TPV Bar, Reservas Online y Marca Blanca.
            </p>
          </div>

          {/* Quick Access CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setAdminTab('agenda')}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('club.nav.courts', 'Pistas & Reservas')}</span>
            </button>

            <button
              onClick={() => setAdminTab('smart_courts')}
              className="px-4 py-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-2 active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{t('club.nav.iot', 'Domótica IoT')}</span>
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

      {/* 2. ENTERPRISE KPI CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: Ingresos de Hoy & Facturación del Mes */}
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

        {/* KPI 2: % Ocupación en Tiempo Real y Horas Punta */}
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

        {/* KPI 3: Próximas Reservas e Incidencias Activas */}
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
              Partidos y entrenamientos programados para hoy
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

        {/* KPI 4: Resumen de Domótica IoT */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {t('club.kpi.iot_summary', 'Domótica IoT')}
            </span>
            <div className="p-2 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <span>{activeCourtsWithLights} ON</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">/ {totalCourtsCount} pistas</span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              {t('club.kpi.iot_lights_on', 'Luces LED encendidas')}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">{t('club.kpi.iot_doors_connected', 'Tornos')}:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {onlineDevicesCount} online
            </span>
          </div>
        </div>
      </section>

      {/* 3. GESTIÓN DE PISTAS MULTIDEPORTE Y CONTROL DOMÓTICO IoT EN TIEMPO REAL */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('iot.court_controls', 'Control Domótico IoT de Pistas en Tiempo Real')}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Control táctil estilo iOS/Android de iluminación LED, apertura remota de varchi/puertas e indicador de telemetría por pista.
            </p>
          </div>

          {/* Sport Selector Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            {(['all', 'padel', 'tennis', 'pickleball'] as const).map((sport) => (
              <button
                key={sport}
                onClick={() => setSportFilter(sport)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  sportFilter === sport
                    ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sport === 'all' && 'Todos los Deportes'}
                {sport === 'padel' && '🎾 Pádel (6)'}
                {sport === 'tennis' && '🎾 Tenis (1)'}
                {sport === 'pickleball' && '🏓 Pickleball (1)'}
              </button>
            ))}
          </div>
        </div>

        {/* Multisport Court Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCourts.map((court) => {
            const isLightActive = Boolean(court.isLightOn);
            const isOnline = court.isDeviceOnline !== false;
            const isOpeningThisDoor = openingDoorId === court.id || court.isDoorOpen;

            return (
              <div
                key={court.id}
                className={`relative rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between space-y-4 shadow-sm ${
                  isLightActive
                    ? 'bg-gradient-to-b from-white to-amber-50/40 dark:from-slate-900 dark:to-amber-950/20 border-amber-400/60 dark:border-amber-500/40 shadow-amber-500/5 ring-1 ring-amber-400/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Court Top Info */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {court.sport?.toUpperCase() || 'PADEL'} · {court.courtType.toUpperCase()}
                    </span>

                    {/* IoT Device Online Status Pill */}
                    <button
                      onClick={() => toggleDeviceOnline(court.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition border ${
                        isOnline
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                      }`}
                      title="Haz clic para simular desconexión IoT"
                    >
                      <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      <span>
                        {isOnline ? t('iot.device_online', 'Online') : t('iot.device_offline', 'Offline')}
                      </span>
                    </button>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-950 dark:text-white leading-snug">
                    {court.name}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {court.surface}
                  </p>
                </div>

                {/* Court Image Preview */}
                <div className="relative h-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img
                    src={court.photoUrl}
                    alt={court.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Status Banner inside photo */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-bold text-white">
                    <span>{court.hourlyRate.toFixed(2)} €/h</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-[10px] text-emerald-400">
                      PIN: {court.accessPin || '4821#'}
                    </span>
                  </div>
                </div>

                {/* iOS / Android Style IoT Controls */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {/* Control 1: LED Light Switch Toggle */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-xl transition ${isLightActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {t('iot.lights_toggle', 'Iluminación LED')}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {isLightActive ? t('iot.lights_on', 'Encendida') : t('iot.lights_off', 'Apagada')}
                        </div>
                      </div>
                    </div>

                    {/* Native tactile Switch */}
                    <button
                      type="button"
                      onClick={() => toggleCourtLight(court.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        isLightActive ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      aria-label={`Conmutar luz de ${court.name}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isLightActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Control 2: Door / Turnstile Unlock Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenDoor(court.id, court.name)}
                    disabled={isOpeningThisDoor}
                    className={`w-full py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-[0.98] ${
                      isOpeningThisDoor
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isOpeningThisDoor ? (
                      <>
                        <Unlock className="w-4 h-4 animate-bounce text-white" />
                        <span>{t('iot.door_opening', 'Acceso Abierto (PIN Activo)...')}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{t('iot.door_open', 'Abrir Puerta / Torno')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PRÓXIMAS RESERVAS Y ACTIVIDAD EN VIVO */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings table */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Agenda de Partidos Hoy
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Reservas y partidas abiertas con código PIN de apertura asignado.
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
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex flex-col items-center justify-center text-[10px]">
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
        </div>

        {/* Quick TPV / POS Widget */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Caja Rápida / TPV Bar
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Consumos en barra, alquiler de palas y pelotas.
                </p>
              </div>
              <button
                onClick={() => setAdminTab('pos_cafe')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition"
              >
                <CreditCard className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 space-y-1">
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                Total Facturado en Barra Hoy
              </div>
              <div className="text-3xl font-black font-mono text-slate-950 dark:text-white">
                {tpvRevenueToday.toFixed(2)} €
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                34 tickets emitidos · Promedio 14,57 €/ticket
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Cafetería & Bebidas Isotónicas</span>
                <span className="font-bold text-slate-900 dark:text-white">245,00 €</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Tubos Pelotas Bullpadel Next Pro</span>
                <span className="font-bold text-slate-900 dark:text-white">135,50 €</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Alquiler Test Palas Nox AT10</span>
                <span className="font-bold text-slate-900 dark:text-white">115,00 €</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setAdminTab('pos_cafe')}
            className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 active:scale-98"
          >
            <span>Abrir Terminal TPV</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
