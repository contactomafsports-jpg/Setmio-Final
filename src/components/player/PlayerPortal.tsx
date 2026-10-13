import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Calendar,
  Users,
  Award,
  Heart,
  Bot,
  Clock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Shield,
  Sparkles,
  CreditCard,
  User,
  Zap,
  Sun,
  Moon,
  ArrowRight,
  ClipboardList,
  UserRound,
  Trophy,
  GraduationCap,
  FileText,
  X,
  Menu,
  Phone,
  Mail,
  ExternalLink,
  Plus,
  Flame,
  LogOut,
  ShoppingBag,
} from 'lucide-react';
import { BookingFlow } from '../public/BookingFlow';
import { OpenMatchesView } from '../public/OpenMatchesView';
import { PlayerHeader } from './PlayerHeader';
import { PlayerPublicProfileView } from '../public/PlayerPublicProfileView';
import { PlayerNotificationPreferences } from './PlayerNotificationPreferences';
import { ReservationDrawer, ReservationDrawerData } from '../admin/ReservationDrawer';
import { CorporateLayout } from '../public/CorporateLayout';
import { SetmioCorporateLanding } from '../public/SetmioCorporateLanding';
import { AuthModal } from '../public/AuthModal';
import { RoleSelectorModal } from '../common/RoleSelectorModal';

export const PlayerPortal: React.FC = () => {
  const {
    currentTenant,
    currentUser,
    bookings,
    openMatches,
    favorites,
    products,
    courts,
    coaches,
    tournaments,
    triggerDemoToast,
    theme,
    toggleTheme,
    setCurrentView,
    logoutOrExitDemo,
    isWhiteLabelPlayerPreview,
    exitWhiteLabelPlayerPreview,
    selectedVenue,
    venues,
    cancelBooking,
    t,
  } = useApp();

  const [activePlayerTab, setActivePlayerTab] = useState<
    'overview' | 'booking' | 'matches' | 'tournaments' | 'teams' | 'academy' | 'stats' | 'profile' | 'shop' | 'notifications'
  >('overview');

  // URL route sync for /jugador/perfil/notificaciones
  React.useEffect(() => {
    const handleUrlSync = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path === '/jugador/perfil/notificaciones' || path.endsWith('/notificaciones')) {
          setActivePlayerTab('notifications');
        }
      }
    };
    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, []);

  const [playerAuthState, setPlayerAuthState] = useState<'registered' | 'visitor'>('registered');
  const [visitorAuthModalOpen, setVisitorAuthModalOpen] = useState(false);
  const [visitorAuthMode, setVisitorAuthMode] = useState<'login' | 'register'>('login');
  const [visitorRoleModalOpen, setVisitorRoleModalOpen] = useState(false);
  const [selectedMultiClubFilter, setSelectedMultiClubFilter] = useState<string>('all');

  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [publicProfileModalOpen, setPublicProfileModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [tournamentSubTab, setTournamentSubTab] = useState<'inscribed' | 'in_progress' | 'upcoming'>('inscribed');
  const [selectedPlayerDrawerData, setSelectedPlayerDrawerData] = useState<ReservationDrawerData | null>(null);

  const userPendingPaymentMatch = openMatches.find((m) =>
    m.players.some((p) => p.name === currentUser.name && !p.paid)
  );
  const hasUnpaidMatch = Boolean(userPendingPaymentMatch);

  const clubDisplayName = currentTenant.name;
  const clubShortName = currentTenant.shortName;
  const clubInitials = currentTenant.name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase() || 'PAD';

  const normalizedPlayerName = currentUser.name.split(' (')[0].trim().toLocaleLowerCase();
  const myBookings = bookings.filter((booking) =>
    booking.creatorId === currentUser.id ||
    booking.creatorName.split(' (')[0].trim().toLocaleLowerCase() === normalizedPlayerName
  );

  const upcomingBooking = myBookings.find((booking) =>
    new Date(booking.startTime).getTime() >= Date.now() &&
    (booking.status === 'confirmed' || booking.status === 'pending')
  );

  const openUpcomingBookingDrawer = () => {
    if (!upcomingBooking) return;
    const start = upcomingBooking.startTime.includes('T')
      ? upcomingBooking.startTime.split('T')[1].slice(0, 5)
      : upcomingBooking.startTime.slice(0, 5);
    const end = upcomingBooking.endTime
      ? (upcomingBooking.endTime.includes('T') ? upcomingBooking.endTime.split('T')[1].slice(0, 5) : upcomingBooking.endTime.slice(0, 5))
      : '19:30';

    const court = courts.find((c) => c.id === upcomingBooking.courtId);
    const venue = upcomingBooking.venueId ? venues.find((v) => v.id === upcomingBooking.venueId) : null;

    setSelectedPlayerDrawerData({
      id: upcomingBooking.id,
      courtId: upcomingBooking.courtId,
      courtName: upcomingBooking.courtName,
      courtType: court?.courtType || 'Indoor Cristal Pro',
      startTime: upcomingBooking.startTime,
      endTime: upcomingBooking.endTime,
      timeSlot: `${start} - ${end}`,
      creatorName: upcomingBooking.creatorName,
      creatorPhone: '+34 611 22 33 44',
      creatorMemberNum: 'Socio #SM-408',
      category: upcomingBooking.category || 'match',
      title: upcomingBooking.title || 'Reserva de Pista',
      sport: 'Pádel Indoor WPT',
      mode: upcomingBooking.mode || 'competitive',
      gender: upcomingBooking.gender || 'mixed',
      venueId: upcomingBooking.venueId,
      venueName: venue?.name || upcomingBooking.venueName || currentTenant.name,
      venueShortName: venue?.shortName || upcomingBooking.venueShortName,
      totalPrice: upcomingBooking.totalPrice || 28.0,
      status: upcomingBooking.status === 'canceled' ? 'Cancelada' : 'Confirmada',
      paymentStatus: upcomingBooking.paymentStatus || 'paid',
      accessPin: upcomingBooking.accessPin || '4829#',
      lightsStatus: 'auto',
      doorStatus: 'auto',
      participants: upcomingBooking.participants || [
        { name: currentUser.name, paid: true, amount: (upcomingBooking.totalPrice || 28) / 4, statusText: 'Pagado' },
        { name: 'Mateo Varela', paid: true, amount: (upcomingBooking.totalPrice || 28) / 4, statusText: 'Pagado' },
        { name: 'Lucas Piñeiro', paid: true, amount: (upcomingBooking.totalPrice || 28) / 4, statusText: 'Pagado' },
        { name: 'David Castro', paid: true, amount: (upcomingBooking.totalPrice || 28) / 4, statusText: 'Pagado' },
      ],
      notes: upcomingBooking.notes,
    });
  };

  // Player's teams
  const myTeams = [
    {
      id: 'team-masculino-1',
      name: 'Absoluto Masculino A',
      category: '1ª Categoría Gallega · División de Honor',
      role: 'Jugador Titular',
      captain: 'Mateo Varela',
      nextMatch: 'vs Club de Campo Ferrol (12 Oct, 11:00)',
      status: 'Convocado',
    },
    {
      id: 'team-social',
      name: 'Equipo Liga Social San Mateo',
      category: 'Liga Primavera Nivel 3.5 - 4.5',
      role: 'Capitán de Pareja',
      captain: currentUser.name,
      nextMatch: 'vs Pareja Gómez / Permuy (Jueves 19:30)',
      status: 'Confirmado',
    },
  ];

  // Competitions
  const enrolledTournaments = tournaments.slice(0, 1);
  const inProgressTournaments = tournaments.filter((t) => t.status === 'in_progress');
  const upcomingTournamentsList = tournaments.filter((t) => t.status === 'registration_open' || t.status === 'upcoming');

  // ESTADO 1: Usuario No Registrado / Visitante
  // Renderiza la Web corporativa pública oficial de Setmio con opciones de registro/login
  if (playerAuthState === 'visitor') {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {/* TOP DEMO AUDIT BAR: Estado 1: Usuario No Registrado / Visitante */}
        <aside
          aria-label="Selector de estado Setmio Player"
          className="sticky top-0 z-50 bg-slate-900 text-white px-4 py-2.5 border-b border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="font-extrabold text-amber-300">
              Estado 1: Usuario No Registrado / Visitante
            </span>
            <span className="hidden sm:inline text-slate-300">
              · Renderiza la Web corporativa oficial de Setmio con opciones de registro/login
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setPlayerAuthState('registered');
              triggerDemoToast(
                'Estado 2: Usuario Registrado',
                'Cargando App neutra Setmio Player con ELO global, reservas y partidos multi-club.',
                'success'
              );
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow transition cursor-pointer self-start sm:self-auto"
          >
            Cambiar a Estado 2: Usuario Registrado (App Neutra) →
          </button>
        </aside>

        <CorporateLayout
          onOpenDemo={() => setVisitorRoleModalOpen(true)}
          onOpenAuth={() => {
            setVisitorAuthMode('login');
            setVisitorAuthModalOpen(true);
          }}
          onOpenRegister={() => {
            setVisitorAuthMode('register');
            setVisitorAuthModalOpen(true);
          }}
        >
          <SetmioCorporateLanding
            onOpenAuth={() => {
              setVisitorAuthMode('login');
              setVisitorAuthModalOpen(true);
            }}
            onExploreClub={() => {
              setPlayerAuthState('registered');
            }}
            onOpenDemoRoleModal={() => setVisitorRoleModalOpen(true)}
            onOpenFeatures={() => {
              setCurrentView('public');
            }}
            onOpenOnboarding={() => {
              setVisitorAuthMode('register');
              setVisitorAuthModalOpen(true);
            }}
          />
        </CorporateLayout>

        <AuthModal
          isOpen={visitorAuthModalOpen}
          initialMode={visitorAuthMode}
          onClose={() => setVisitorAuthModalOpen(false)}
          onOpenRoleModal={() => setVisitorRoleModalOpen(true)}
        />
        <RoleSelectorModal
          isOpen={visitorRoleModalOpen}
          onClose={() => setVisitorRoleModalOpen(false)}
        />
      </div>
    );
  }

  // ESTADO 2: Usuario Registrado
  // Renderiza la App neutra Setmio Player con la marca Setmio (sin vinculación ni presencia de logos de clubes terceros)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-[calc(6rem+env(safe-area-inset-bottom))] transition-colors duration-200 w-full max-w-full overflow-x-hidden">
      {/* 0. TOP DEMO AUDIT BAR: Estado 2: Usuario Registrado */}
      <aside
        aria-label="Selector de estado del simulador Setmio Player"
        className="sticky top-0 z-50 bg-slate-900 text-white px-4 py-2 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-extrabold text-emerald-400">
            Estado 2: Usuario Registrado · App Neutra Setmio Player
          </span>
          <span className="hidden lg:inline text-slate-400">
            (Sin vinculación a clubes terceros · ELO global, reservas y partidos multi-club)
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setPlayerAuthState('visitor');
            triggerDemoToast(
              'Estado 1: Visitante / No Registrado',
              'Renderizando la Web corporativa oficial de Setmio con opciones de registro/login.',
              'info'
            );
          }}
          className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs transition cursor-pointer self-start sm:self-auto"
        >
          Simular Estado 1: Visitante / No Registrado →
        </button>
      </aside>

      {/* 0.B FIXED TOP FLOATING BANNER (When testing White Label Player View) */}
      {isWhiteLabelPlayerPreview && (
        <aside
          aria-label="Banner de conmutación a modo administración"
          className="sticky top-9 z-40 bg-slate-950/95 backdrop-blur-md border-b border-emerald-500/40 px-4 py-2 text-white shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center gap-2 min-w-0 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-bold text-white truncate">
              {t('white_label.banner_notice', 'Probando app de jugador con Marca Blanca')} · <span className="text-emerald-300 font-extrabold">{clubDisplayName}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={exitWhiteLabelPlayerPreview}
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span>{t('white_label.return_admin', `← Volver a Gestión (${currentTenant.shortName})`)}</span>
          </button>
        </aside>
      )}

      {/* 1. TOP APP HEADER (App Shell Privada con Marca Neutra Setmio Player) */}
      <PlayerHeader
        onToggleMobileDrawer={() => setMobileDrawerOpen(true)}
        onOpenPublicProfile={() => setPublicProfileModalOpen(true)}
        onOpenLegalModal={() => setLegalModalOpen(true)}
      />

      {/* 2. PLAYER HERO PROFILE BANNER (MARCA NEUTRA SETMIO PLAYER) */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-black text-[10px]">
                {currentUser.playLevel.toFixed(2)}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{currentUser.name}</h1>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800 font-mono font-bold">
                  Licencia Setmio Multi-Club #SP-9402
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Plataforma Neutra Setmio Player · ELO Global <strong>1.485 pts</strong> · Nivel Verificado {currentUser.playLevel.toFixed(2)} · Posición preferida: <strong>Revés</strong> · Diestro
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePlayerTab('booking')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer ${
                activePlayerTab === 'booking'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Reservas Multi-Club</span>
            </button>
            <button
              onClick={() => setActivePlayerTab('matches')}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activePlayerTab === 'matches'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Partidos Multi-Club</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. DESKTOP / TABLET SUB-TABS NAVIGATION */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <nav className="flex space-x-2 py-2" aria-label="Pestañas de navegación">
            {[
              { id: 'overview', label: 'Mi Espacio Neutro', icon: Home },
              { id: 'booking', label: 'Reservas Multi-Club', icon: Calendar },
              { id: 'matches', label: 'Partidos Abiertos Multi-Club', icon: Users },
              { id: 'stats', label: 'ELO & Estadísticas', icon: TrendingUp },
              { id: 'tournaments', label: 'Mis Competiciones', icon: Trophy },
              { id: 'teams', label: 'Mis Equipos', icon: Shield },
              { id: 'profile', label: 'Mi Ficha', icon: UserRound },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activePlayerTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePlayerTab(tab.id as typeof activePlayerTab)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-24 sm:pb-8 space-y-6">
        {/* OVERVIEW TAB */}
        {activePlayerTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Aviso de Pago Pendiente (Split 1/4) Mobile-First */}
            {userPendingPaymentMatch && (
              <div className="p-5 sm:p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[10px] font-extrabold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pago Dividido Pendiente · Split 1/4</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Tienes 1 plaza reservada en {userPendingPaymentMatch.courtName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Fecha: {userPendingPaymentMatch.startTime.split('T')[0]} a las {userPendingPaymentMatch.startTime.split('T')[1]?.slice(0, 5)} h · Tu cuota individual: <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{userPendingPaymentMatch.pricePerPlayer.toFixed(2)} €</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActivePlayerTab('matches')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pagar mi parte ({userPendingPaymentMatch.pricePerPlayer.toFixed(2)} €)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Next Match Highlight Card */}
            {upcomingBooking && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/40 shadow-lg space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Tu Próxima Reserva Confirmada</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold">
                    Pista Activa
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="text-slate-500 dark:text-slate-400">Pista:</div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{upcomingBooking.courtName}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 dark:text-slate-400">Horario:</div>
                    <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      {new Date(upcomingBooking.startTime).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 dark:text-slate-400">PIN Cerradura Pista:</div>
                    <div className="font-mono font-bold text-amber-500 text-lg">
                      {upcomingBooking.accessPin || '4829#'}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Las luces se encenderán automáticamente 5 minutos antes del inicio de tu reserva.</span>
                  <button
                    type="button"
                    onClick={openUpcomingBookingDrawer}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
                  >
                    <span>Ficha y Gestión de Plaza</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Stats Grid with AUDITED "Nivel" label (No FEP) */}
            {/* 1. MÓDULO ELO GLOBAL DEL JUGADOR (Requerimiento Setmio Player) */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-cyan-500/30 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                        Sistema Oficial ELO Setmio
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                        Categoría Oro
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white">ELO Global del Jugador</h3>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-mono">
                    1.485 pts
                  </div>
                  <div className="text-xs text-slate-400">
                    Nivel Verificado {currentUser.playLevel.toFixed(2)} · Top 12% Nacional
                  </div>
                </div>
              </div>

              {/* Métricas y Progresión ELO */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400">Variación ELO (30 días):</span>
                  <div className="text-lg font-black text-emerald-400 font-mono">+45 pts</div>
                  <span className="text-[10px] text-slate-400">7 partidos puntuados</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400">Racha Actual:</span>
                  <div className="text-lg font-black text-amber-400 font-mono">4 Victorias Seguidas</div>
                  <span className="text-[10px] text-slate-400">Última derrota: 28 Sep</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400">Percentil Comunitario:</span>
                  <div className="text-lg font-black text-cyan-400 font-mono">Percentil 88%</div>
                  <span className="text-[10px] text-slate-400">Red Multi-Club Setmio</span>
                </div>
              </div>

              {/* Historial Reciente de ELO */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <span className="font-bold text-slate-300">Historial de Partidos y Variación de ELO:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between border border-white/5">
                    <div>
                      <div className="font-bold text-white">vs Castro / Vello</div>
                      <div className="text-[10px] text-slate-400">Victoria 6-4, 7-5</div>
                    </div>
                    <span className="font-mono font-black text-emerald-400 text-sm">+15 pts</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between border border-white/5">
                    <div>
                      <div className="font-bold text-white">vs Gómez / Permuy</div>
                      <div className="text-[10px] text-slate-400">Derrota 4-6, 5-7</div>
                    </div>
                    <span className="font-mono font-black text-rose-400 text-sm">-8 pts</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between border border-white/5">
                    <div>
                      <div className="font-bold text-white">vs Soto / Díaz</div>
                      <div className="text-[10px] text-slate-400">Victoria 6-2, 6-3</div>
                    </div>
                    <span className="font-mono font-black text-emerald-400 text-sm">+18 pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. MÓDULO BUSCADOR DE PARTIDOS ABIERTOS MULTI-CLUB */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Buscador de Partidos Abiertos Multi-Club
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Encuentra plazas libres y partidas niveladas en todos los clubes asociados de la red Setmio.
                  </p>
                </div>

                {/* Filtro Multi-Club */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'all', label: 'Toda la Red Multi-Club' },
                    { id: 'sanmateo', label: 'Pádel San Mateo' },
                    { id: 'naron', label: 'Padel Indoor Narón' },
                    { id: 'elite', label: 'Elite Academy' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setSelectedMultiClubFilter(filter.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        selectedMultiClubFilter === filter.id
                          ? 'bg-cyan-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Partidos Abiertos en la Red */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    id: 'om-1',
                    clubName: 'Club Pádel San Mateo',
                    court: 'Pista 1 Central WPT',
                    time: 'Hoy · 19:30 - 21:00',
                    levelReq: 'Nivel 3.5 - 4.2 · ELO 1.400 - 1.550',
                    freeSlots: 2,
                    price: '7,00 €',
                    mode: 'Competitivo',
                  },
                  {
                    id: 'om-2',
                    clubName: 'Padel Indoor Narón',
                    court: 'Pista 3 Cristal Pro',
                    time: 'Mañana · 18:00 - 19:30',
                    levelReq: 'Nivel 3.8 - 4.5 · ELO 1.450 - 1.600',
                    freeSlots: 1,
                    price: '6,50 €',
                    mode: 'Competitivo',
                  },
                  {
                    id: 'om-3',
                    clubName: 'Elite Padel Academy',
                    court: 'Pista Panorámica 2',
                    time: 'Viernes · 20:00 - 21:30',
                    levelReq: 'Nivel 3.2 - 4.0 · ELO 1.350 - 1.500',
                    freeSlots: 3,
                    price: '8,00 €',
                    mode: 'Social & Amistoso',
                  },
                  {
                    id: 'om-4',
                    clubName: 'Club Pádel San Mateo',
                    court: 'Pista 4 Cubierta',
                    time: 'Sábado · 11:30 - 13:00',
                    levelReq: 'Nivel 3.5 - 4.0 · ELO 1.400 - 1.500',
                    freeSlots: 2,
                    price: '7,00 €',
                    mode: 'Competitivo',
                  },
                ]
                  .filter((m) =>
                    selectedMultiClubFilter === 'all'
                      ? true
                      : selectedMultiClubFilter === 'sanmateo'
                      ? m.clubName.includes('San Mateo')
                      : selectedMultiClubFilter === 'naron'
                      ? m.clubName.includes('Narón')
                      : m.clubName.includes('Elite')
                  )
                  .map((match) => (
                    <div
                      key={match.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[10px] uppercase text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950 px-2 py-0.5 rounded-md">
                            {match.clubName}
                          </span>
                          <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px]">
                            {match.freeSlots} {match.freeSlots === 1 ? 'plaza libre' : 'plazas libres'}
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white pt-1">
                          {match.court} · {match.time}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {match.levelReq} · {match.mode}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">
                          {match.price} <span className="text-[10px] text-slate-400 font-normal">/ jugador</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => triggerDemoToast('Inscripción a Partido', `Te has unido a la plaza en ${match.clubName}. Pago dividido confirmado.`, 'success')}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer active:scale-95 shadow-xs"
                        >
                          Unirme al Partido
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 3. MÓDULO ESTADÍSTICAS PERSONALES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>Estadísticas Personales de Competición</span>
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                    66.7% Win Rate
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px]">Jugados</span>
                    <div className="text-lg font-black text-slate-900 dark:text-white font-mono">48</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px]">Victorias</span>
                    <div className="text-lg font-black text-emerald-500 font-mono">32</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px]">Derrotas</span>
                    <div className="text-lg font-black text-slate-400 font-mono">16</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <div className="flex justify-between">
                    <span>Posición de Juego:</span>
                    <strong className="text-slate-900 dark:text-white">Revés habitual (78% victorias)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Mano Dominante:</span>
                    <strong className="text-slate-900 dark:text-white">Diestro</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tie-breaks ganados:</span>
                    <strong className="text-emerald-500 font-mono">11 de 14 (78.6%)</strong>
                  </div>
                </div>
              </div>

              {/* Efectividad técnica por golpe */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-500" />
                  <span>Efectividad Técnica por Golpe</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span>Bandeja y Víbora de control</span>
                      <strong className="text-emerald-500 font-mono">85% éxito</strong>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[85%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span>Salida de Pared y Bajada</span>
                      <strong className="text-cyan-500 font-mono">80% éxito</strong>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full w-[80%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span>Remate por Tres y Potencia</span>
                      <strong className="text-purple-500 font-mono">72% éxito</strong>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full w-[72%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. MÓDULO SISTEMA DE RESERVAS MULTI-CLUB */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Sistema de Reservas Multi-Club
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Reserva en cualquiera de los clubes integrados en la red Setmio con disponibilidad en directo.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePlayerTab('booking')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-xs"
                >
                  <span>Abrir Cuadrante Completo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Selector de Clubs con disponibilidad directa */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  {
                    name: 'Club Pádel San Mateo',
                    location: 'Narón, A Coruña',
                    courtsAvailable: '6 pistas cristal libres',
                    badge: 'Club Asociado',
                    rating: '4.9 ⭐',
                  },
                  {
                    name: 'Padel Indoor Narón',
                    location: 'Polígono Río do Pozo',
                    courtsAvailable: '4 pistas indoor libres',
                    badge: 'Club Asociado',
                    rating: '4.8 ⭐',
                  },
                  {
                    name: 'Elite Padel Academy',
                    location: 'Ferrolterra Centro',
                    courtsAvailable: '2 pistas panorámicas libres',
                    badge: 'Club Asociado',
                    rating: '4.95 ⭐',
                  },
                ].map((club, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePlayerTab('booking')}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        {club.badge}
                      </span>
                      <span className="font-bold text-[11px] text-slate-500">{club.rating}</span>
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                        {club.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{club.location}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                      <span>{club.courtsAvailable}</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOOKING TAB EMBEDDED INSIDE APP (Isolation maintained!) */}
        {activePlayerTab === 'booking' && (
          <div className="animate-in fade-in duration-150">
            <BookingFlow />
          </div>
        )}

        {/* MATCHES TAB EMBEDDED INSIDE APP */}
        {activePlayerTab === 'matches' && (
          <div className="animate-in fade-in duration-150">
            <OpenMatchesView />
          </div>
        )}

        {/* TOURNAMENTS TAB (Mis Competiciones) */}
        {activePlayerTab === 'tournaments' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Mis Competiciones</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Torneos oficiales federados, ligas sociales y rankings en los que participas.
                </p>
              </div>

              {/* Subtabs for Tournaments */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setTournamentSubTab('inscribed')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    tournamentSubTab === 'inscribed' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Inscrito (1)
                </button>
                <button
                  onClick={() => setTournamentSubTab('in_progress')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    tournamentSubTab === 'in_progress' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  En Curso ({inProgressTournaments.length})
                </button>
                <button
                  onClick={() => setTournamentSubTab('upcoming')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    tournamentSubTab === 'upcoming' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Próximas ({upcomingTournamentsList.length})
                </button>
              </div>
            </div>

            {tournamentSubTab === 'inscribed' && (
              <div className="space-y-4">
                {enrolledTournaments.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase">
                          Pareja Confirmada
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{t.title}</h3>
                        <p className="text-xs text-slate-500">{t.dates} · Cuadro 2ª Categoría</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-slate-500">Pareja:</div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">Carlos Méndez / Diego Soto</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Próximo cruce: <strong>Viernes 19:00 en Pista 2 Panorámica</strong>
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Puntúa Ranking Setmio Oro</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tournamentSubTab === 'in_progress' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgressTournaments.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-amber-500 uppercase">Fase de Cuartos</span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.title}</h4>
                    <p className="text-xs text-slate-500">{t.dates}</p>
                  </div>
                ))}
              </div>
            )}

            {tournamentSubTab === 'upcoming' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingTournamentsList.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Inscripción Abierta</span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.title}</h4>
                    <p className="text-xs text-slate-500">{t.dates} · {t.entryFee.toFixed(2)} €/jugador</p>
                    <button
                      onClick={() => triggerDemoToast('Inscripción Solicitada', `Pareja enviada para ${t.title}. Tu compañero recibirá notificación.`, 'success')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                    >
                      Inscribirme con mi pareja
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TEAMS TAB (Mis Equipos) */}
        {activePlayerTab === 'teams' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Mis Equipos</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Equipos y plantillas oficiales a las que perteneces en {currentTenant.name}.
              </p>
            </div>

            <div className="space-y-4">
              {myTeams.map((team) => (
                <div
                  key={team.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase">
                        {team.role}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{team.name}</h3>
                      <p className="text-xs text-slate-500">{team.category}</p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                      Estado: {team.status}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <div className="text-slate-400 text-[10px]">Próxima Jornada:</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{team.nextMatch}</div>
                    </div>
                    <button
                      onClick={() => triggerDemoToast('Asistencia Confirmada', 'Has confirmado tu asistencia para la convocatoria del equipo.', 'success')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Confirmar Asistencia
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACADEMY TAB (Escuela & Clases) */}
        {activePlayerTab === 'academy' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Escuela & Clases de Pádel</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tus grupos de entrenamiento, clases particulares y progreso técnico.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">
                    Grupo Cuatrimestral Activo
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    Perfeccionamiento Nivel 3.5 - 4.5
                  </h3>
                  <p className="text-xs text-slate-500">Monitora: Laura Senra · Martes y Jueves 19:30 - 20:30</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-400">Asistencia</div>
                  <div className="font-mono font-black text-base text-emerald-600">14/16 sesiones</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-300">
                <strong>Próxima sesión:</strong> Mañana a las 19:30. Trabajo intensivo de salida de pared y transición rápida de bloqueo en la red.
              </div>
            </div>
          </div>
        )}

        {/* STATS & LEVEL TAB */}
        {activePlayerTab === 'stats' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Estadísticas & Nivel</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evolución de juego y rendimiento en partidos oficiales y sociales.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white">Distribución de Victorias</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Partidos Ganados</span>
                    <strong className="text-emerald-600 font-mono">22 (64.7%)</strong>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[65%]" />
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1">
                    <span>Partidos Perdidos</span>
                    <span className="font-mono">12 (35.3%)</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white">Rendimiento por Posición</h3>
                <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Posición en Revés:</span>
                    <strong className="text-slate-900 dark:text-white">72% efectividad</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Posición en Drive:</span>
                    <strong className="text-slate-900 dark:text-white">55% efectividad</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tie-breaks ganados:</span>
                    <strong className="text-slate-900 dark:text-white">8 de 11 (72.7%)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE TAB (Vista Propio Jugador - Requerimiento 6.B) */}
        {activePlayerTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <PlayerPublicProfileView
              playerId="user-player-carlos"
              onBack={() => setActivePlayerTab('overview')}
              onOpenNotifications={() => {
                setActivePlayerTab('notifications');
                if (typeof window !== 'undefined') {
                  window.history.pushState(null, '', '/jugador/perfil/notificaciones');
                }
              }}
            />
          </div>
        )}

        {/* NOTIFICATIONS PREFERENCES TAB (/jugador/perfil/notificaciones) */}
        {activePlayerTab === 'notifications' && (
          <PlayerNotificationPreferences
            onBack={() => {
              setActivePlayerTab('profile');
              if (typeof window !== 'undefined') {
                window.history.pushState(null, '', '/jugador');
              }
            }}
          />
        )}

        {/* SHOP TAB (Tienda / Catálogo del Club) */}
        {activePlayerTab === 'shop' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Pro Shop · {currentTenant.name}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Palas oficiales, calzado técnico y accesorios con un 15% de descuento exclusivo para socios activos.
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                Tarifa Socio Aplicada (-15%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products
                .filter((p) => !p.tenantId || p.tenantId === currentTenant.id)
                .map((product) => {
                  const memberPrice = product.price * 0.85;
                  return (
                    <div
                      key={product.id}
                      className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-emerald-500/50 transition group"
                    >
                      <div className="space-y-3">
                        <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px]">
                            -15% SOCIO
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400">{product.brand} · {product.category}</span>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{product.name}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{product.description}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 line-through">{product.price.toFixed(2)} €</div>
                          <div className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-lg">
                            {memberPrice.toFixed(2)} €
                          </div>
                        </div>
                        <button
                          onClick={() => triggerDemoToast('Artículo Reservado', `"${product.name}" reservado en la recepción del club a precio de socio. Se cargará a tu monedero en entrega.`, 'success')}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-bold text-xs shadow transition active:scale-95"
                        >
                          Reservar
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>

      {/* 5. NATIVE MOBILE BOTTOM BAR (Clean, accessible, no overlapping text!) */}
      <nav
        aria-label="Navegación móvil del jugador"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_25px_rgba(15,23,42,0.08)] grid grid-cols-6 gap-1"
      >
        {[
          { id: 'overview', label: 'Inicio', icon: Home },
          { id: 'booking', label: 'Reservar', icon: Calendar },
          { id: 'matches', label: 'Partidos', icon: Users },
          { id: 'tournaments', label: 'Torneos', icon: Trophy },
          { id: 'teams', label: 'Equipos', icon: Shield },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activePlayerTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePlayerTab(item.id as typeof activePlayerTab)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-tight truncate">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={logoutOrExitDemo}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-rose-600 dark:text-rose-400 font-semibold"
          title="Cerrar Sesión / Salir Demo"
        >
          <LogOut className="w-5 h-5 mb-0.5 text-rose-600 dark:text-rose-400" />
          <span className="text-[10px] leading-tight truncate">Salir</span>
        </button>
      </nav>

      {/* 6. MODAL PERFIL PÚBLICO DEL JUGADOR */}
      {publicProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 my-8">
            <button
              onClick={() => setPublicProfileModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition z-10 cursor-pointer"
              title="Cerrar Ficha"
            >
              <X className="w-5 h-5" />
            </button>
            <PlayerPublicProfileView
              playerId="user-player-carlos"
              onBack={() => setPublicProfileModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 7. MODAL INFORMACIÓN LEGAL & NORMATIVA */}
      {legalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[85vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setLegalModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Información Legal y Normativa del Club
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">1. Titularidad y Responsabilidad</h4>
                <p>{currentTenant.name} ({currentTenant.address}) es el titular del centro deportivo y prestador de los servicios.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">2. Política de Cancelación</h4>
                <p>Las reservas podrán cancelarse sin coste hasta {currentTenant.settings.cancellationWindowHours} horas antes del horario fijado. Transcurrido dicho plazo no se reembolsará el importe.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">3. Normativa de Uso de Pistas</h4>
                <p>Obligatorio el uso de calzado específico de pádel (suela de espiga o mixta). Prohibido entrar a pista con calzado de calle o botellas de cristal.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">4. Protección de Datos (RGPD)</h4>
                <p>Tus datos se gestionan conforme a la normativa europea para la prestación de reservas, gestión deportiva y notificaciones del club.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setLegalModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-slate-900 dark:text-white transition"
              >
                Cerrar Normativa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MOBILE DRAWER MENU */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 bg-white dark:bg-slate-900 h-full p-6 shadow-2xl flex flex-col justify-between z-10 text-slate-900 dark:text-slate-100">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="font-black text-sm text-slate-900 dark:text-white">{currentTenant.shortName}</div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 text-xs font-semibold">
                {[
                  { id: 'overview', label: 'Mi Espacio', icon: Home },
                  { id: 'booking', label: 'Reservar Pista', icon: Calendar },
                  { id: 'matches', label: 'Partidos Abiertos', icon: Users },
                  { id: 'tournaments', label: 'Mis Competiciones', icon: Trophy },
                  { id: 'teams', label: 'Mis Equipos', icon: Shield },
                  { id: 'academy', label: 'Escuela & Clases', icon: GraduationCap },
                  { id: 'stats', label: 'Nivel & Estadísticas', icon: TrendingUp },
                  { id: 'profile', label: 'Mi Ficha', icon: UserRound },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activePlayerTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActivePlayerTab(item.id as typeof activePlayerTab);
                        setMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                        isActive
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setLegalModalOpen(true);
                }}
                className="w-full flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white py-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Normativa y Legal</span>
              </button>
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setCurrentView('public');
                }}
                className="w-full flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold py-1.5"
              >
                <span>Ir a Web Pública</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  logoutOrExitDemo();
                }}
                className="w-full flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold py-1.5"
              >
                <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Cerrar Sesión / Salir Demo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. MOBILE-FIRST BOTTOM NAVIGATION BAR (Acción Rápida & Navegación Táctil) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1 px-2 flex items-center justify-around shadow-lg">
        {[
          { id: 'overview', label: 'Inicio', icon: Home },
          { id: 'booking', label: 'Reservar', icon: Calendar },
          {
            id: 'matches',
            label: 'Partidos',
            icon: Users,
            badge: hasUnpaidMatch ? '!' : undefined,
          },
          { id: 'tournaments', label: 'Torneos', icon: Trophy },
          { id: 'profile', label: 'Mi Ficha', icon: UserRound },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activePlayerTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePlayerTab(tab.id as typeof activePlayerTab)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition cursor-pointer ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center animate-bounce shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Ficha de Detalles de Reserva Operativa para Jugador */}
      {selectedPlayerDrawerData && (
        <ReservationDrawer
          isOpen={true}
          reservation={selectedPlayerDrawerData}
          userRole="player"
          onClose={() => setSelectedPlayerDrawerData(null)}
          onCancelReservation={(id) => {
            cancelBooking(id);
            setSelectedPlayerDrawerData(null);
          }}
        />
      )}
    </div>
  );
};
