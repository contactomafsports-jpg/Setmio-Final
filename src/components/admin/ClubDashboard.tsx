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
  Plus,
} from 'lucide-react';
import { ReservationDrawer, ReservationDrawerData } from './ReservationDrawer';
import { NewBookingModal } from './NewBookingModal';
import { NewMatchModal } from './NewMatchModal';
import { AllBookingsPage } from './AllBookingsPage';

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
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showNewMatchModal, setShowNewMatchModal] = useState(false);

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
      : isConsolidatedView
      ? 'Director General · Red Multisede'
      : `Director General · ${selectedVenue.shortName || selectedVenue.name || 'Sede Central'}`;

  // 3 Ejemplos Reales del Turno Actual según especificación exacta de diseño
  const upcomingTurnBookings: ReservationDrawerData[] = [
    {
      id: 'res-1',
      venueId: 'venue-san-mateo',
      venueName: 'Sede Narón · San Mateo',
      venueShortName: 'Narón',
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
      venueId: 'venue-coruna',
      venueName: 'Sede A Coruña · Matogrande',
      venueShortName: 'Sede A Coruña',
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
      venueId: 'venue-santiago',
      venueName: 'Sede Santiago · Compostela',
      venueShortName: 'Sede Santiago',
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

  const displayedBookings = isConsolidatedView
    ? upcomingTurnBookings
    : upcomingTurnBookings.some((b) => b.venueId === selectedVenueId)
    ? upcomingTurnBookings.filter((b) => b.venueId === selectedVenueId)
    : upcomingTurnBookings;

  const calculateDurationMinutes = (startStr?: string, endStr?: string, slotStr?: string): number => {
    let s = startStr || '';
    let e = endStr || '';
    if ((!s || !e) && slotStr && slotStr.includes('-')) {
      const parts = slotStr.split('-').map((p) => p.trim());
      s = parts[0];
      e = parts[1];
    }
    if (!s || !e) return 90;
    const parseToMins = (val: string) => {
      const timePart = val.includes('T') ? val.split('T')[1].slice(0, 5) : val.slice(0, 5);
      const [h, m] = timePart.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };
    const startM = parseToMins(s);
    let endM = parseToMins(e);
    if (endM < startM) endM += 24 * 60;
    const diff = endM - startM;
    return diff > 0 ? diff : 90;
  };

  const cleanVenueName = (name?: string) => {
    if (!name) return 'Narón';
    let clean = name.replace(/\s*\((?:Central|Centro)\)/gi, '').replace(/\bCentral\b/gi, '').trim();
    clean = clean.replace(/^Sede\s+/i, '').replace(/·.*$/, '').trim();
    if (!clean || clean.toLowerCase() === 'san mateo') return 'Narón';
    return clean;
  };

  return (
    <div className="max-w-md lg:max-w-3xl mx-auto pt-3 pb-24 sm:pb-16 space-y-7 sm:space-y-8 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased">
      {/* ======================================================================
          1. SEDE SELECTOR PILL & OPERATIONAL STATUS (Directo en canvas)
          ====================================================================== */}
      <div className="pt-2 pb-1 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            {/* Nombre del Club limpio de texto, sin contenedores, alineado a la izquierda */}
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 tracking-wide block mb-1">
              {currentTenant?.name || 'Centro de Pádel San Mateo'}
            </span>
            <h1 className="text-[26px] sm:text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight leading-tight">
              Hola, {firstName}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/ajustes');
              setAdminTab('settings');
            }}
            className="p-2 text-slate-500 hover:text-[#0B1A2D] dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer active:scale-95"
            title="Ajustes del club"
            aria-label="Ajustes del club"
          >
            <Settings className="w-6 h-6 stroke-[2]" />
          </button>
        </div>

        {/* Pill de Sede y Estado Operativo */}
        <div className="relative">
          <div className="flex items-center justify-between gap-2.5 sm:gap-3 p-3.5 sm:p-5 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            {/* Selector de Sede */}
            <div
              onClick={() => setIsVenueSelectorOpen(!isVenueSelectorOpen)}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none min-w-0 flex-1"
              title="Cambiar sede activa o ver red consolidada"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-100 dark:border-[#1A314D] flex items-center justify-center text-[#0B1A2D] dark:text-slate-200 shrink-0">
                <Building2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#0B1A2D] dark:text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-[13px] sm:text-base font-bold text-[#0B1A2D] dark:text-white truncate whitespace-nowrap">
                    {isConsolidatedView ? 'Todas las Sedes' : selectedVenue.shortName || selectedVenue.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 group-hover:text-[#0B1A2D] dark:text-slate-400 dark:group-hover:text-white transition-transform shrink-0 ${
                      isVenueSelectorOpen ? 'rotate-180 text-[#0B1A2D] dark:text-white' : ''
                    }`}
                  />
                </div>
                <span className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300 block truncate whitespace-nowrap">
                  {venues.length > 1 ? `${venues.length} sedes conectadas` : 'Sede oficial'}
                </span>
              </div>
            </div>

            {/* Badge Dinámico de Apertura / Resumen Multisede */}
            <button
              type="button"
              onClick={isConsolidatedView ? () => setIsVenueSelectorOpen((prev) => !prev) : toggleClubOpenState}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#F0FCCF] dark:bg-[#B7F229]/20 border border-[#B7F229]/50 transition-all cursor-pointer hover:scale-102 shrink-0 select-none whitespace-nowrap"
              title={
                isConsolidatedView
                  ? `Red multisede consolidada (${venues.length} sedes operativas)`
                  : 'Haz clic para conmutar estado de apertura de la sede'
              }
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isConsolidatedView
                    ? 'bg-[#82b805] dark:bg-[#B7F229]'
                    : isClubOpen
                    ? 'bg-[#82b805] animate-pulse'
                    : 'bg-rose-500'
                }`}
              />
              <span className="text-xs sm:text-[13px] font-bold text-[#0B1A2D] dark:text-[#B7F229] whitespace-nowrap">
                {isConsolidatedView
                  ? `${venues.length} Sedes Activas`
                  : isClubOpen
                  ? 'Abierto · hasta 23:30'
                  : 'Cerrado temporal'}
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
          2. AVISO OPERATIVO COMPACTO (Único aviso principal y compacto en Inicio)
          ====================================================================== */}
      {showOperationalNotice && (
        <section className="mt-6">
          <div className="bg-white dark:bg-[#0E2239] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex items-center justify-between gap-3">
            <div
              className="flex items-center gap-3.5 cursor-pointer flex-1 select-none group min-w-0"
              onClick={() => setAdminTab('smart_courts')}
              title="Abrir configuración de domótica y cuadrante"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] dark:bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] dark:text-purple-300 flex-shrink-0 group-hover:scale-105 transition-transform">
                <Sliders className="w-5 h-5 text-[#8B5CF6] dark:text-purple-300" />
              </div>
              <div className="pr-1 min-w-0">
                <h4 className="text-sm font-bold text-[#0B1A2D] dark:text-white group-hover:text-[#8B5CF6] transition-colors truncate whitespace-nowrap">
                  Preferencias de cuadrante y domótica
                </h4>
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-snug mt-1 truncate whitespace-nowrap">
                  Turno de tarde: {occupiedCourtsCount} pistas con iluminación domótica activada
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Cerrar aviso"
              onClick={() => setShowOperationalNotice(false)}
              className="p-1.5 rounded-full text-slate-500 hover:text-[#0B1A2D] dark:text-slate-400 dark:hover:text-white transition-colors flex-shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ======================================================================
          3. ACCIONES RÁPIDAS (BOTONES CIRCULARES PLANOS Y ACCIONES RÁPIDAS)
          ====================================================================== */}
      <section className="space-y-4 mt-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-[#0B1A2D] dark:text-white tracking-tight whitespace-nowrap">
            Acciones Rápidas
          </h2>
          <button
            type="button"
            onClick={() => setShowAllQuickActions(!showAllQuickActions)}
            className="text-sm font-semibold text-[#8B5CF6] dark:text-purple-400 hover:underline cursor-pointer whitespace-nowrap shrink-0"
          >
            {showAllQuickActions ? 'ver principales' : 'ver todas'}
          </button>
        </div>

        {/* Accesos directos unificados en Azul Profundo (#0B1A2D) con texto en blanco y signo '+' */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setAdminTab('new_booking');
              if (typeof window !== 'undefined') {
                window.history.pushState({}, '', '/gestion/reservas/nueva');
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-3.5 px-3 sm:px-4 rounded-2xl bg-[#0B1A2D] hover:bg-[#132A45] active:scale-98 text-white font-bold text-[13px] sm:text-sm shadow-xs border border-[#0B1A2D] dark:border-slate-700 transition-all cursor-pointer tracking-tight whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3] text-white shrink-0" />
            <span className="truncate">Nueva reserva</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAdminTab('new_match');
              if (typeof window !== 'undefined') {
                window.history.pushState({}, '', '/gestion/partidas/nueva');
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-3.5 px-3 sm:px-4 rounded-2xl bg-[#0B1A2D] hover:bg-[#132A45] active:scale-98 text-white font-bold text-[13px] sm:text-sm shadow-xs border border-[#0B1A2D] dark:border-slate-700 transition-all cursor-pointer tracking-tight whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3] text-white shrink-0" />
            <span className="truncate">Nueva partida</span>
          </button>
        </div>

        {/* 4 Botones Circulares Principales (Diseño Plano, Limpio, Sin Halos Difusos) */}
        <div className="grid grid-cols-4 gap-3 text-center pt-1">
          {/* 1. Reservas */}
          <div
            onClick={() => {
              if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/reservas');
              setAdminTab('agenda');
            }}
            className="flex flex-col items-center group cursor-pointer select-none"
          >
            <div className="w-14 h-14 rounded-full bg-[#0B1A2D] dark:bg-[#132A45] border border-[#0B1A2D] dark:border-slate-700 flex items-center justify-center text-white transition-all group-active:scale-95 group-hover:border-slate-500 shadow-xs">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-[13px] font-bold text-[#0B1A2D] dark:text-slate-200 mt-2.5 tracking-tight group-hover:text-[#8B5CF6] transition-colors">
              Reservas
            </span>
          </div>

          {/* 2. Partidas con icono nítido y probado de Material Symbols (sports_tennis) */}
          <div
            onClick={() => {
              if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/partidas');
              setAdminTab('matches');
            }}
            className="flex flex-col items-center group cursor-pointer select-none"
          >
            <div className="w-14 h-14 rounded-full bg-[#B7F229] border border-[#B7F229] flex items-center justify-center text-[#0B1A2D] transition-all group-active:scale-95 group-hover:brightness-95 shadow-xs">
              <span className="material-symbols-outlined text-[26px] text-[#0B1A2D] select-none leading-none">
                sports_tennis
              </span>
            </div>
            <span className="text-[13px] font-bold text-[#0B1A2D] dark:text-slate-200 mt-2.5 tracking-tight group-hover:text-[#82b805] transition-colors">
              Partidas
            </span>
          </div>

          {/* 3. Torneos: plano sin halo */}
          <div
            onClick={() => {
              if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/torneos');
              setAdminTab('tournaments');
            }}
            className="flex flex-col items-center group cursor-pointer select-none"
          >
            <div className="w-14 h-14 rounded-full bg-[#8B5CF6] border border-[#8B5CF6] flex items-center justify-center text-white transition-all group-active:scale-95 group-hover:brightness-95 shadow-xs">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-[13px] font-bold text-[#0B1A2D] dark:text-slate-200 mt-2.5 tracking-tight group-hover:text-[#8B5CF6] transition-colors">
              Torneos
            </span>
          </div>

          {/* 4. Escuela: plano sin halo */}
          <div
            onClick={() => {
              if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/escuela');
              setAdminTab('academy');
            }}
            className="flex flex-col items-center group cursor-pointer select-none"
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-all group-active:scale-95 group-hover:border-slate-300 dark:group-hover:border-slate-600 shadow-xs">
              <GraduationCap className="w-6 h-6 text-slate-700 dark:text-slate-200" />
            </div>
            <span className="text-[13px] font-bold text-[#0B1A2D] dark:text-slate-200 mt-2.5 tracking-tight group-hover:text-[#8B5CF6] transition-colors">
              Escuela
            </span>
          </div>
        </div>

        {/* Módulos Adicionales si se pulsa "Ver todos" */}
        {showAllQuickActions && (
          <div className="grid grid-cols-4 gap-3 text-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-150">
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
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mt-2 tracking-tight">
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
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mt-2 tracking-tight">
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
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mt-2 tracking-tight">
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
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mt-2 tracking-tight">
                Ajustes
              </span>
            </div>
          </div>
        )}
      </section>

      {/* ======================================================================
          4. RENDIMIENTO EN VIVO (MÉTRICAS MINIMALISTAS Y DIRECTAS)
          ====================================================================== */}
      <section className="space-y-4 mt-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-[#0B1A2D] dark:text-white tracking-tight whitespace-nowrap">
            Rendimiento en Vivo
          </h2>
          <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap shrink-0">
            Hoy, {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
          </span>
        </div>

        {/* Tarjeta Telemetría: % Ocupación en tiempo real */}
        <div className="bg-white dark:bg-[#0E2239] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-[#1A314D] shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-start justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 block truncate whitespace-nowrap">
                Ocupación en tiempo real
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white font-mono">
                  {occupancyPercentage}%
                </span>
                <span className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                  {occupiedCourtsCount} de {totalCourtsCount} Pistas
                </span>
              </div>
            </div>

            <span className="text-xs sm:text-[13px] font-bold text-[#0B1A2D] dark:text-[#B7F229] flex items-center gap-1.5 bg-[#F0FCCF] dark:bg-[#B7F229]/20 border border-[#B7F229]/50 px-2.5 sm:px-3 py-1 rounded-full shrink-0 whitespace-nowrap">
              <Zap className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] fill-current shrink-0" />
              <span>Hora Punta</span>
            </span>
          </div>

          {/* Barra de Progreso Lima #B7F229 */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-[#B7F229] h-full rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${Math.min(100, Math.max(5, occupancyPercentage))}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300 pt-1 min-w-0">
            <span className="truncate whitespace-nowrap">Próxima rotación: 18:30</span>
            <span className="truncate whitespace-nowrap">Turno pico: 18:30 – 22:30</span>
          </div>
        </div>

        {/* Tarjeta de Facturación e Ingresos */}
        <div className="bg-white dark:bg-[#0E2239] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-[#1A314D] shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 truncate whitespace-nowrap">Facturación de hoy</span>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#0B1A2D] dark:text-[#B7F229] bg-[#F0FCCF] dark:bg-[#B7F229]/20 border border-[#B7F229]/40 px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap shrink-0">
              <TrendingUp className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
              <span>+18,4% mes</span>
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2 mt-1">
            <div className="text-3xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight font-mono whitespace-nowrap">
              {totalRevenueToday.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-lg font-bold text-slate-500 dark:text-slate-400">€</span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300 block whitespace-nowrap">
                Mes acumulado
              </span>
              <span className="text-sm font-bold text-[#0B1A2D] dark:text-white font-mono whitespace-nowrap">
                {totalRevenueMonth.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
              </span>
            </div>
          </div>

          {/* Desglose Limpio de Canales Online y TPV */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-[#1A314D]">
            <div className="flex items-center justify-between gap-1.5 min-w-0">
              <span className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 truncate whitespace-nowrap">App Online:</span>
              <span className="text-xs sm:text-sm font-bold text-[#0B1A2D] dark:text-white font-mono whitespace-nowrap shrink-0">
                {onlineRevenueToday.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </span>
            </div>
            <div className="flex items-center justify-between gap-1.5 pl-3 border-l border-slate-100 dark:border-[#1A314D] min-w-0">
              <span className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 truncate whitespace-nowrap">TPV Club:</span>
              <span className="text-xs sm:text-sm font-bold text-[#0B1A2D] dark:text-white font-mono whitespace-nowrap shrink-0">
                {tpvRevenueToday.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          5. PRÓXIMAS RESERVAS DE HOY (TICKETS AISLADOS, LIMPIOS)
          ====================================================================== */}
      <section className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-[#0B1A2D] dark:text-white tracking-tight whitespace-nowrap">
            Próximas Reservas de Hoy
          </h2>
        </div>

        {/* Botón Sólido de Marca: Todas las Reservas (Limpio y sin flecha) */}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/reservas/todas');
            setAdminTab('all_bookings');
          }}
          className="w-full py-3.5 px-5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-white/[0.06] dark:hover:bg-white/[0.1] border border-transparent dark:border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Calendar className="w-4 h-4 text-white dark:text-[#B7F229] shrink-0" />
          <span>Todas las reservas</span>
        </button>

        {/* Listado de Tarjetas de Reservas (Tickets limpios de alto contraste) */}
        <div className="space-y-4">
          {displayedBookings.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelectedReservation(item)}
              className="bg-white dark:bg-[#0E2239] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4 cursor-pointer transition hover:border-[#8B5CF6]/50 hover:shadow-xs group min-w-0 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 min-w-0">
                {/* Pastilla de Horario con Acento Violeta Corporativo de Marca (#8B5CF6) */}
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#EDE9FE] dark:bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#6D28D9] dark:text-[#C4B5FD] text-xs sm:text-[13px] font-bold tracking-tight whitespace-nowrap shrink-0">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B5CF6] shrink-0" />
                  <span>{item.timeSlot}</span>
                  <span className="text-xs opacity-85 font-semibold">· {calculateDurationMinutes(item.startTime, item.endTime, item.timeSlot)} min</span>
                </span>
                <span className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full truncate whitespace-nowrap min-w-0 max-w-[140px] sm:max-w-none">
                  {item.courtName}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3 min-w-0">
                <div className="min-w-0 flex-1 space-y-1">
                  {/* Micro-texto de Sede en Vista Consolidada ("Todas las Sedes") */}
                  {isConsolidatedView && (item.venueShortName || item.venueName) && (
                    <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#0B1A2D] dark:text-[#B7F229] tracking-tight whitespace-nowrap truncate">
                      <Building2 className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                      <span className="truncate">{cleanVenueName(item.venueShortName || item.venueName)}</span>
                    </div>
                  )}
                  <h4 className="text-base font-bold text-[#0B1A2D] dark:text-white truncate whitespace-nowrap group-hover:text-[#8B5CF6] transition-colors">
                    {item.creatorName}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 truncate whitespace-nowrap">
                    {item.title} • {item.sport}
                  </p>
                </div>
                <span className="text-base sm:text-lg font-extrabold text-[#0B1A2D] dark:text-white font-mono shrink-0 whitespace-nowrap">
                  {item.totalPrice}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 dark:border-slate-800 gap-2 min-w-0">
                {item.paymentStatus === 'paid' ? (
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#0B1A2D] dark:text-[#B7F229] bg-[#F0FCCF] dark:bg-[#B7F229]/20 px-2.5 sm:px-3 py-1 rounded-full border border-[#B7F229]/50 whitespace-nowrap shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#659b02] dark:text-[#B7F229] shrink-0" />
                    <span>PAGADO</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 sm:px-3 py-1 rounded-full border border-slate-200/80 dark:border-slate-700 whitespace-nowrap shrink-0">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 shrink-0" />
                    <span>PENDIENTE TPV</span>
                  </span>
                )}

                {/* Tag de Acceso Domótico PIN: Contenedor neutro y limpio (#0B1A2D / Slate) */}
                <div className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-[13px] font-bold text-[#0B1A2D] dark:text-slate-200 font-mono tracking-wide shadow-2xs whitespace-nowrap shrink-0">
                  <KeyRound className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-slate-300 shrink-0" />
                  <span>PIN: <strong className="text-[#0B1A2D] dark:text-white font-black">{item.accessPin}</strong></span>
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

      {/* ======================================================================
          MODAL NIVEL 4: NUEVA RESERVA DIRECTA DESDE INICIO (RETORNO GARANTIZADO)
          ====================================================================== */}
      <NewBookingModal
        isOpen={showNewBookingModal}
        onClose={() => setShowNewBookingModal(false)}
        defaultVenueId={selectedVenueId !== 'all' ? selectedVenueId : undefined}
      />

      {/* ======================================================================
          MODAL NIVEL 4: NUEVA PARTIDA DIRECTA DESDE INICIO (RETORNO GARANTIZADO)
          ====================================================================== */}
      <NewMatchModal
        isOpen={showNewMatchModal}
        onClose={() => setShowNewMatchModal(false)}
        defaultVenueId={selectedVenueId !== 'all' ? selectedVenueId : undefined}
      />
    </div>
  );
};

export default ClubDashboard;
