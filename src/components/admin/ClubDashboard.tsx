import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Users,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Activity,
  Trophy,
  GraduationCap,
  Settings,
  CheckCircle2,
  Clock,
  KeyRound,
  AlertCircle,
  Zap,
  Building2,
  ChevronDown,
  ChevronRight,
  Sliders,
  X,
  LayoutGrid,
  CreditCard,
  Shield,
  Layers,
} from 'lucide-react';
import { ReservationDrawer, ReservationDrawerData } from './ReservationDrawer';

export const ClubDashboard: React.FC = () => {
  const {
    currentTenant,
    currentUser,
    setAdminTab,
    setSelectedCustomerId,
    isClubOpen,
    toggleClubOpenState,
    enterWhiteLabelPlayerPreview,
    venues,
    selectedVenueId,
    selectedVenue,
    setSelectedVenueId,
    isConsolidatedView,
    t,
  } = useApp();

  const [selectedReservation, setSelectedReservation] = useState<ReservationDrawerData | null>(null);
  const [showOperationalNotice, setShowOperationalNotice] = useState(true);
  const [isVenueSelectorOpen, setIsVenueSelectorOpen] = useState(false);
  const [showAllQuickActions, setShowAllQuickActions] = useState(false);

  // Financial Metrics: Online + TPV Bar (Dynamic based on selected venue or consolidated view)
  const totalRevenueToday = selectedVenue.revenueToday;
  const onlineRevenueToday = Math.round(totalRevenueToday * 0.61 * 100) / 100;
  const tpvRevenueToday = Math.round((totalRevenueToday - onlineRevenueToday) * 100) / 100;
  const totalRevenueMonth = selectedVenue.revenueMonth;

  // Occupancy metrics
  const totalCourtsCount = selectedVenue.courtsCount || 24;
  const occupiedCourtsCount = selectedVenue.occupiedCourtsNow || 17;
  const occupancyPercentage = Math.round((occupiedCourtsCount / totalCourtsCount) * 100);

  // User Greeting
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Marcos';
  const userRoleSubtitle =
    currentUser?.role === 'SUPERADMIN'
      ? 'Director General · Red Multisede'
      : currentUser?.role === 'RECEPTION'
      ? 'Recepción & Atención · Mostrador'
      : 'Director General · Red Deportiva San Mateo';

  // 3 Ejemplos Reales del Turno Actual según especificación exacta de diseño
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
      totalPrice: '28.00 €',
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
    <div className="max-w-md lg:max-w-3xl mx-auto px-4 sm:px-5 pt-2 pb-16 space-y-6 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased">
      {/* ======================================================================
          1. SEDE SELECTOR PILL & OPERATIONAL STATUS (Directo en canvas)
          ====================================================================== */}
      <div className="pt-2 pb-1 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[22px] font-extrabold text-[#0B1A2D] dark:text-white tracking-tight leading-tight">
              Hola, {firstName}
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {userRoleSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAdminTab('settings')}
              className="text-xs font-bold text-[#8B5CF6] dark:text-purple-300 hover:underline inline-flex items-center gap-1 mt-1 bg-[#EDE9FE]/70 dark:bg-[#8B5CF6]/20 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              <span>Gestionar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pill de Sede y Estado Operativo */}
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

            {/* Badge Dinámico de Apertura */}
            <button
              type="button"
              onClick={toggleClubOpenState}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0FCCF] dark:bg-[#B7F229]/20 border border-[#B7F229]/50 transition-all cursor-pointer hover:scale-102 shrink-0 select-none"
              title="Haz clic para conmutar estado de apertura del club"
            >
              <span className={`w-2 h-2 rounded-full ${isClubOpen ? 'bg-[#82b805] animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-[11px] font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                {isClubOpen ? 'Abierto · hasta 23:30' : 'Cerrado temporal'}
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
      </div>

      {/* ======================================================================
          2. AVISOS OPERATIVOS (Playtomic style reminder card 'No te olvides')
          ====================================================================== */}
      {showOperationalNotice && (
        <section>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Avisos Operativos
          </p>
          <div className="bg-white dark:bg-[#0E2239] rounded-2xl p-4 border border-slate-100 dark:border-[#1A314D] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer flex-1 mr-2 select-none group"
              onClick={() => setAdminTab('smart_courts')}
              title="Abrir configuración de domótica y cuadrante"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FE]/70 dark:bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] dark:text-purple-300 flex-shrink-0 group-hover:scale-105 transition-transform">
                <Sliders className="w-5 h-5 text-[#8B5CF6] dark:text-purple-300" />
              </div>
              <div className="pr-2">
                <h4 className="text-xs font-bold text-[#0B1A2D] dark:text-white group-hover:text-[#8B5CF6] transition-colors">
                  Editar preferencias de cuadrante
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                  Turno de tarde: {occupiedCourtsCount} pistas con iluminación domótica activada
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Cerrar aviso"
              onClick={() => setShowOperationalNotice(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex-shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ======================================================================
          3. ACCIONES DIRECTAS (4 BOTONES CIRCULARES ESTILO PLAYTOMIC)
          ====================================================================== */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Acciones Directas
          </h2>
          <button
            type="button"
            onClick={() => setShowAllQuickActions(!showAllQuickActions)}
            className="text-xs font-bold text-[#8B5CF6] dark:text-purple-300 hover:underline cursor-pointer"
          >
            {showAllQuickActions ? 'Ver principales' : 'Ver todos'}
          </button>
        </div>

        {/* 4 Botones Circulares Principales */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {/* 1. Cuadrante */}
          <div
            onClick={() => {
              if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/reservas');
              setAdminTab('agenda');
            }}
            className="flex flex-col items-center group cursor-pointer select-none"
          >
            <div className="w-14 h-14 rounded-full bg-[#0B1A2D] dark:bg-[#132A45] border border-slate-700/30 flex items-center justify-center text-white shadow-[0_4px_14px_rgba(11,26,45,0.25)] group-active:scale-95 group-hover:scale-105 transition-all">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-bold text-[#0B1A2D] dark:text-slate-200 mt-2 tracking-tight group-hover:text-[#8B5CF6] transition-colors">
              Cuadrante
            </span>
          </div>

          {/* 2. Partidas */}
          <div
            onClick={() => {
              if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/partidas');
              setAdminTab('matches');
            }}
            className="flex flex-col items-center group cursor-pointer select-none"
          >
            <div className="w-14 h-14 rounded-full bg-[#B7F229] flex items-center justify-center text-[#0B1A2D] shadow-[0_4px_14px_rgba(183,242,41,0.45)] group-active:scale-95 group-hover:scale-105 transition-all">
              {/* Raqueta y pelota de pádel Play! */}
              <svg className="w-6 h-6 fill-none stroke-[#0B1A2D] stroke-[2.2]" viewBox="0 0 24 24">
                <circle cx="11" cy="9" r="6" />
                <path d="m15.5 13.5 5 5c.8.8.8 2.2 0 3s-2.2.8-3 0l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="8" r="0.8" fill="#0B1A2D" />
                <circle cx="12" cy="8" r="0.8" fill="#0B1A2D" />
                <circle cx="11" cy="10" r="0.8" fill="#0B1A2D" />
                <circle cx="19.5" cy="4.5" r="2.5" fill="#0B1A2D" stroke="none" />
              </svg>
            </div>
            <span className="text-xs font-bold text-[#0B1A2D] dark:text-slate-200 mt-2 tracking-tight group-hover:text-[#82b805] transition-colors">
              Partidas
            </span>
          </div>

          {/* 3. Torneos */}
          <div
            onClick={() => {
              if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/torneos');
              setAdminTab('tournaments');
            }}
            className="flex flex-col items-center group cursor-pointer select-none"
          >
            <div className="w-14 h-14 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(139,92,246,0.35)] group-active:scale-95 group-hover:scale-105 transition-all">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-bold text-[#0B1A2D] dark:text-slate-200 mt-2 tracking-tight group-hover:text-[#8B5CF6] transition-colors">
              Torneos
            </span>
          </div>

          {/* 4. Escuela */}
          <div
            onClick={() => {
              if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/escuela');
              setAdminTab('academy');
            }}
            className="flex flex-col items-center group cursor-pointer select-none"
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 group-active:scale-95 group-hover:scale-105 transition-all">
              <GraduationCap className="w-6 h-6 text-slate-700 dark:text-slate-200" />
            </div>
            <span className="text-xs font-bold text-[#0B1A2D] dark:text-slate-200 mt-2 tracking-tight group-hover:text-[#8B5CF6] transition-colors">
              Escuela
            </span>
          </div>
        </div>

        {/* Módulos Adicionales si se pulsa "Ver todos" */}
        {showAllQuickActions && (
          <div className="grid grid-cols-4 gap-2 text-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-150">
            {/* TPV Club */}
            <div
              onClick={() => {
                if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/tpv');
                setAdminTab('pos_cafe');
              }}
              className="flex flex-col items-center group cursor-pointer select-none"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 group-active:scale-95 group-hover:scale-105 transition-all">
                <CreditCard className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </div>
              <span className="text-[11px] font-bold text-[#0B1A2D] dark:text-slate-300 mt-1.5 tracking-tight">
                TPV Club
              </span>
            </div>

            {/* Socios / CRM */}
            <div
              onClick={() => {
                setSelectedCustomerId(null);
                if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/socios');
                setAdminTab('customers');
              }}
              className="flex flex-col items-center group cursor-pointer select-none"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 group-active:scale-95 group-hover:scale-105 transition-all">
                <Users className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </div>
              <span className="text-[11px] font-bold text-[#0B1A2D] dark:text-slate-300 mt-1.5 tracking-tight">
                Socios CRM
              </span>
            </div>

            {/* Equipos */}
            <div
              onClick={() => {
                if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/equipos');
                setAdminTab('teams');
              }}
              className="flex flex-col items-center group cursor-pointer select-none"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 group-active:scale-95 group-hover:scale-105 transition-all">
                <Shield className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </div>
              <span className="text-[11px] font-bold text-[#0B1A2D] dark:text-slate-300 mt-1.5 tracking-tight">
                Equipos
              </span>
            </div>

            {/* Ajustes Club */}
            <div
              onClick={() => {
                if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/ajustes');
                setAdminTab('settings');
              }}
              className="flex flex-col items-center group cursor-pointer select-none"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 group-active:scale-95 group-hover:scale-105 transition-all">
                <Settings className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </div>
              <span className="text-[11px] font-bold text-[#0B1A2D] dark:text-slate-300 mt-1.5 tracking-tight">
                Ajustes
              </span>
            </div>
          </div>
        )}
      </section>

      {/* ======================================================================
          4. RENDIMIENTO EN VIVO (MÉTRICAS MINIMALISTAS Y DIRECTAS)
          ====================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Rendimiento en Vivo
          </h2>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            Hoy, {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
          </span>
        </div>

        {/* Tarjeta Telemetría: % Ocupación en tiempo real */}
        <div className="bg-white dark:bg-[#0E2239] rounded-2xl p-4 border border-slate-100 dark:border-[#1A314D] shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                Ocupación en tiempo real
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white font-mono">
                  {occupancyPercentage}%
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {occupiedCourtsCount} de {totalCourtsCount} Pistas
                </span>
              </div>
            </div>

            <span className="text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] flex items-center gap-1 bg-[#F0FCCF] dark:bg-[#B7F229]/20 border border-[#B7F229]/50 px-2.5 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] fill-current" />
              Hora Punta
            </span>
          </div>

          {/* Barra de Progreso Lima #B7F229 */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-[#B7F229] h-full rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${Math.min(100, Math.max(5, occupancyPercentage))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 pt-1">
            <span>Próxima rotación: 18:30</span>
            <span>Turno pico: 18:30 – 22:30</span>
          </div>
        </div>

        {/* Tarjeta de Facturación e Ingresos */}
        <div className="bg-white dark:bg-[#0E2239] rounded-2xl p-4 border border-slate-100 dark:border-[#1A314D] shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Facturación de hoy</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] bg-[#F0FCCF] dark:bg-[#B7F229]/20 border border-[#B7F229]/40 px-2.5 py-0.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />
              +18,4% mes
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="text-3xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight font-mono">
              {totalRevenueToday.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-lg font-bold text-slate-400">€</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block tracking-wider">
                Mes acumulado
              </span>
              <span className="text-xs font-bold text-[#0B1A2D] dark:text-white font-mono">
                {totalRevenueMonth.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
              </span>
            </div>
          </div>

          {/* Desglose Limpio de Canales Online y TPV */}
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-[#1A314D]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">App Online:</span>
              <span className="text-xs font-bold text-[#0B1A2D] dark:text-white font-mono">
                {onlineRevenueToday.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </span>
            </div>
            <div className="flex items-center justify-between pl-2 border-l border-slate-100 dark:border-[#1A314D]">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">TPV Club:</span>
              <span className="text-xs font-bold text-[#0B1A2D] dark:text-white font-mono">
                {tpvRevenueToday.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          5. PRÓXIMAS RESERVAS DE HOY (TICKETS AISLADOS, LIMPIOS)
          ====================================================================== */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
              Próximas Reservas de Hoy
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Turno actual y accesos domóticos
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/reservas');
              setAdminTab('agenda');
            }}
            className="text-xs font-bold text-[#8B5CF6] dark:text-purple-300 hover:underline flex items-center cursor-pointer"
          >
            <span>Ver agenda</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        {/* Botón Sólido de Marca: Todas las Reservas */}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/reservas/todas');
            setAdminTab('all_bookings');
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-[#0B1A2D] hover:bg-slate-800 dark:bg-[#132A45] dark:hover:bg-[#1a385c] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-white" />
          <span>Todas las reservas</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>

        {/* Listado de Tarjetas de Reservas (Tickets limpios de alto contraste) */}
        <div className="space-y-3">
          {upcomingTurnBookings.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelectedReservation(item)}
              className="bg-white dark:bg-[#0E2239] rounded-2xl p-4 border border-slate-100 dark:border-[#1A314D] shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-3 cursor-pointer transition hover:border-[#B7F229]/60 hover:shadow-md group"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{item.timeSlot}</span>
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 px-2.5 py-1 rounded-full">
                  {item.courtName}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#0B1A2D] dark:text-white truncate group-hover:text-[#8B5CF6] transition-colors">
                    {item.creatorName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {item.title} • {item.sport}
                  </p>
                </div>
                <span className="text-sm font-extrabold text-[#0B1A2D] dark:text-white font-mono shrink-0">
                  {item.totalPrice}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800">
                {item.paymentStatus === 'paid' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B1A2D] dark:text-[#B7F229] bg-[#F0FCCF] dark:bg-[#B7F229]/20 px-2.5 py-0.5 rounded-full border border-[#B7F229]/50">
                    <CheckCircle2 className="w-3 h-3 text-[#659b02] dark:text-[#B7F229]" />
                    <span>PAGADO</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200/50">
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    <span>PENDIENTE TPV</span>
                  </span>
                )}

                <div className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 px-2.5 py-1 rounded-full text-xs font-bold text-[#0B1A2D] dark:text-slate-200 font-mono">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>PIN: {item.accessPin}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ======================================================================
          DRAWER / MODAL OPERATIVO COMPLETO (Bottom Sheet táctil)
          ====================================================================== */}
      <ReservationDrawer
        isOpen={!!selectedReservation}
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </div>
  );
};

export default ClubDashboard;
