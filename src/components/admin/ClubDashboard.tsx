import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Users,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Activity,
  Sparkles,
  Eye,
  GraduationCap,
  Trophy,
  Settings,
  CheckCircle2,
  Clock,
  KeyRound,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { ReservationDrawer, ReservationDrawerData } from './ReservationDrawer';
import { BookingListItem } from './BookingListItem';

export const ClubDashboard: React.FC = () => {
  const {
    currentTenant,
    courts,
    setAdminTab,
    isClubOpen,
    toggleClubOpenState,
    enterWhiteLabelPlayerPreview,
    t,
  } = useApp();

  const [selectedReservation, setSelectedReservation] = useState<ReservationDrawerData | null>(null);

  // Financial Metrics: Online + TPV Bar
  const onlineRevenueToday = 780.0;
  const tpvRevenueToday = 495.5;
  const totalRevenueToday = onlineRevenueToday + tpvRevenueToday;

  const totalRevenueMonth = 19290.0;

  // Occupancy metrics
  const totalCourtsCount = courts.length || 8;
  const occupiedCourtsCount = 6;
  const occupancyPercentage = Math.round((occupiedCourtsCount / totalCourtsCount) * 100);

  // 3 Ejemplos Reales del Turno Actual según especificación exacta
  const upcomingTurnBookings: ReservationDrawerData[] = [
    {
      id: 'res-1',
      timeSlot: '18:00 - 19:30',
      startTime: '18:00',
      endTime: '19:30',
      courtName: 'Pista 1 (Panorámica)',
      courtType: 'Indoor Panorámica WPT',
      sport: 'Pádel Indoor WPT',
      title: 'Pádel Abierto Level 4.0',
      creatorName: 'Carlos Méndez',
      creatorPhone: '+34 611 22 33 44',
      creatorMemberNum: 'Socio #SM-408',
      category: 'match',
      accessPin: '4821#',
      status: 'Pagado',
      paymentStatus: 'paid',
      totalPrice: '28.00 €',
      lightsStatus: 'on',
      participants: [
        { name: 'Carlos Méndez', level: 4.15, paid: true, amount: 7.0, paymentMethod: 'Tarjeta Online', statusText: 'Pagado 1/4' },
        { name: 'Mateo Varela', level: 4.0, paid: true, amount: 7.0, paymentMethod: 'Monedero Club', statusText: 'Pagado 2/4' },
        { name: 'Lucas Piñeiro', level: 3.85, paid: true, amount: 7.0, paymentMethod: 'Monedero Club', statusText: 'Pagado 3/4' },
        { name: 'David Castro', level: 4.1, paid: true, amount: 7.0, paymentMethod: 'Bizum', statusText: 'Pagado 4/4' },
      ],
    },
    {
      id: 'res-2',
      timeSlot: '18:30 - 20:00',
      startTime: '18:30',
      endTime: '20:00',
      courtName: 'Pista 3',
      courtType: 'Indoor Cristal Pro',
      sport: 'Escuela Oficial de Pádel',
      title: 'Clase Escuela Adultos',
      creatorName: 'Carlos M. (Entrenador)',
      creatorPhone: '+34 622 33 44 55',
      creatorMemberNum: 'Coach Setmio',
      category: 'academy',
      accessPin: '7192#',
      status: 'Confirmada',
      paymentStatus: 'paid',
      totalPrice: 'Cuota Escuela',
      lightsStatus: 'auto',
      participants: [
        { name: 'Ana Belén Vázquez', level: 3.2, paid: true, statusText: 'Cuota Mensual' },
        { name: 'Javier Fraga', level: 3.4, paid: true, statusText: 'Cuota Mensual' },
        { name: 'Lucía Domínguez', level: 3.1, paid: true, statusText: 'Cuota Mensual' },
        { name: 'Marcos Soto', level: 3.3, paid: true, statusText: 'Cuota Mensual' },
      ],
    },
    {
      id: 'res-3',
      timeSlot: '19:30 - 21:00',
      startTime: '19:30',
      endTime: '21:00',
      courtName: 'Pista 2',
      courtType: 'Indoor Cristal Pro',
      sport: 'Pádel Indoor',
      title: 'Partido Privado (Socio: Juan P.)',
      creatorName: 'Juan Pérez',
      creatorPhone: '+34 633 44 55 66',
      creatorMemberNum: 'Socio #SM-319',
      category: 'private',
      accessPin: '8304#',
      status: 'Pendiente TPV',
      paymentStatus: 'pending',
      totalPrice: '32.00 €',
      lightsStatus: 'auto',
      participants: [
        { name: 'Juan Pérez', level: 3.9, paid: false, amount: 8.0, paymentMethod: 'Pendiente', statusText: 'Pendiente TPV' },
        { name: 'Roberto Díaz', level: 3.8, paid: false, amount: 8.0, paymentMethod: 'Pendiente', statusText: 'Pendiente TPV' },
        { name: 'Fernando Gómez', level: 4.0, paid: false, amount: 8.0, paymentMethod: 'Pendiente', statusText: 'Pendiente TPV' },
        { name: 'Daniel Silva', level: 3.75, paid: false, amount: 8.0, paymentMethod: 'Pendiente', statusText: 'Pendiente TPV' },
      ],
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto">
      {/* ======================================================================
          1. HEADER HERÓICO DEL CLUB ("Centro de Pádel San Mateo")
          - Mantiene badge "Abierto/Cerrado"
          - Nombre del club y ubicación
          - ÚNICAMENTE 2 botones principales: "Pistas & Reservas" y "Vista Jugador"
          - Se elimina cualquier botón de domótica
          ====================================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/80 p-5 sm:p-7 shadow-xl text-white">
        <div className="pointer-events-none absolute -right-16 -top-20 size-60 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 -bottom-16 size-48 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                SETMIO ENTERPRISE TOP
              </span>

              {/* Badge destacado Abierto / Cerrado */}
              <button
                type="button"
                onClick={toggleClubOpenState}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition border cursor-pointer ${
                  isClubOpen
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/70 hover:bg-emerald-900'
                    : 'bg-rose-950/80 text-rose-300 border-rose-600/70 hover:bg-rose-900'
                }`}
                title="Conmutar estado del club (Abierto / Cerrado)"
              >
                <span className={`w-2 h-2 rounded-full ${isClubOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                <span>{isClubOpen ? t('club.status.open', 'Abierto') : t('club.status.closed', 'Cerrado')}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {currentTenant.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
              {currentTenant.city}, {currentTenant.region} · Centro de Mandos Operativo en tiempo real
            </p>
          </div>

          {/* Únicamente 2 botones principales: "Pistas & Reservas" y "Vista Jugador" */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setAdminTab('agenda')}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('club.nav.courts', 'Pistas & Reservas')}</span>
            </button>

            <button
              type="button"
              onClick={enterWhiteLabelPlayerPreview}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-2 active:scale-95"
              title="Probar experiencia del socio en Marca Blanca"
            >
              <Eye className="w-4 h-4 text-cyan-300" />
              <span>{t('white_label.player_view', 'Vista Jugador')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================================
          2. BLOQUE KPIS FINANCIEROS Y OCUPACIÓN EN TIEMPO REAL
          - Tarjeta "Ingresos de Hoy" (Online + TPV Bar) y "Facturación del Mes"
          - Tarjeta "% Ocupación en Tiempo Real" (barra de progreso y horas punta)
          ====================================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* KPI 1: Ingresos de Hoy & Facturación del Mes */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Ingresos de Hoy
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Online + TPV Bar</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Facturación del Mes
              </span>
              <span className="font-black text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                {totalRevenueMonth.toLocaleString('es-ES', { minimumFractionDigits: 0 })} €
              </span>
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-slate-950 dark:text-white tracking-tight">
              {totalRevenueToday.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>

            {/* Desglose Online + TPV Bar */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Reservas Online</span>
                <span className="font-black font-mono text-slate-900 dark:text-white text-sm">
                  {onlineRevenueToday.toFixed(2)} €
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">TPV / Bar & Tienda</span>
                <span className="font-black font-mono text-slate-900 dark:text-white text-sm">
                  {tpvRevenueToday.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              +18,4% crecimiento mensual
            </span>
            <span>Objetivo mensual: 22.000 € (87%)</span>
          </div>
        </div>

        {/* KPI 2: % Ocupación en Tiempo Real */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  % Ocupación en Tiempo Real
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Pistas activas en este turno</span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              {occupiedCourtsCount} de {totalCourtsCount} Pistas
            </span>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-600 dark:text-cyan-400 tracking-tight">
                {occupancyPercentage}%
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Turno de Alta Ocupación
              </span>
            </div>

            {/* Barra de progreso de ocupación */}
            <div className="w-full bg-slate-100 dark:bg-slate-900 h-3 rounded-full overflow-hidden mt-3 p-0.5">
              <div
                className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-xs"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Horas Punta:</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 font-mono bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-lg">
              18:30 - 22:30
            </span>
          </div>
        </div>
      </section>

      {/* ======================================================================
          3. BLOQUE ACCESOS RÁPIDOS OPERATIVOS (POSICIONADO AQUÍ)
          - Encabezado: "ACCESOS RÁPIDOS OPERATIVOS" (exact title, sin coletillas)
          - Grid 2x2 de tarjetas compactas:
            1. 🎾 Partidas Abiertas ("Play!")
            2. 🎓 Escuela / Clases
            3. 👥 Socios / CRM
            4. ⚙️ Ajustes del Club
          ====================================================================== */}
      <section className="space-y-3">
        <h2 className="font-black text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
          ACCESOS RÁPIDOS OPERATIVOS
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Partidas Abiertas ("Play!") */}
          <button
            type="button"
            onClick={() => setAdminTab('tournaments')}
            className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/50 hover:shadow-md transition text-left group flex flex-col justify-between shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform border border-emerald-500/20">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Play!
              </span>
            </div>
            <div>
              <div className="font-black text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                🎾 Partidas Abiertas
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Matchmaking y niveles
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              <span>Gestionar partidas</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 2. Escuela / Clases */}
          <button
            type="button"
            onClick={() => setAdminTab('academy')}
            className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500/50 hover:shadow-md transition text-left group flex flex-col justify-between shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform border border-blue-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Cursos
              </span>
            </div>
            <div>
              <div className="font-black text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                🎓 Escuela / Clases
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Grupos, alumnos y profes
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-bold">
              <span>Ver cuadrícula</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 3. Socios / CRM */}
          <button
            type="button"
            onClick={() => setAdminTab('customers')}
            className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500/50 hover:shadow-md transition text-left group flex flex-col justify-between shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform border border-indigo-500/20">
                <Users className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                CRM
              </span>
            </div>
            <div>
              <div className="font-black text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                👥 Socios / CRM
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Fichas, monederos y altas
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
              <span>Listado de socios</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 4. Ajustes del Club */}
          <button
            type="button"
            onClick={() => setAdminTab('settings')}
            className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-md transition text-left group flex flex-col justify-between shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 group-hover:scale-105 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                Ajustes
              </span>
            </div>
            <div>
              <div className="font-black text-sm text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition">
                ⚙️ Ajustes del Club
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Horarios, tarifas e iluminación
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-bold">
              <span>Configuración</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* ======================================================================
          4. BLOQUE PRÓXIMAS RESERVAS DE HOY (POSICIÓN FINAL)
          - Muestra tarjetas de reservas del turno actual con diseño limpio de alto contraste.
          - Al tocar cualquier tarjeta se abre la ficha detallada en el Drawer operativo.
          ====================================================================== */}
      <section className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                Próximas Reservas de Hoy
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Turno actual en pista con códigos PIN de acceso domótico. Toca cualquier reserva para abrir el panel operativo.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAdminTab('agenda')}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>Ver Agenda Completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lista visual con las reservas del turno actual usando el componente unificado BookingListItem */}
        <div className="space-y-3">
          {upcomingTurnBookings.map((item) => (
            <BookingListItem
              key={item.id}
              booking={item}
              onClick={() => setSelectedReservation(item)}
            />
          ))}
        </div>
      </section>

      {/* DRAWER / MODAL OPERATIVO COMPLETO ESTILO APP MÓVIL NATIVA (Bottom Sheet táctil) */}
      <ReservationDrawer
        isOpen={!!selectedReservation}
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </div>
  );
};

export default ClubDashboard;
