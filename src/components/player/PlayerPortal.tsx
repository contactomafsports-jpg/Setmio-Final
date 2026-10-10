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
    t,
  } = useApp();

  const [activePlayerTab, setActivePlayerTab] = useState<
    'overview' | 'booking' | 'matches' | 'tournaments' | 'teams' | 'academy' | 'stats' | 'profile' | 'shop'
  >('overview');

  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [publicProfileModalOpen, setPublicProfileModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [tournamentSubTab, setTournamentSubTab] = useState<'inscribed' | 'in_progress' | 'upcoming'>('inscribed');

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-[calc(6rem+env(safe-area-inset-bottom))] transition-colors duration-200 w-full max-w-full overflow-x-hidden">
      {/* 0. FIXED TOP FLOATING BANNER (When testing White Label Player View) */}
      {isWhiteLabelPlayerPreview && (
        <aside
          aria-label="Banner de conmutación a modo administración"
          className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-emerald-500/40 px-4 py-2 text-white shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200"
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

      {/* 1. TOP APP HEADER (App Shell Privada) */}
      <PlayerHeader
        onToggleMobileDrawer={() => setMobileDrawerOpen(true)}
        onOpenPublicProfile={() => setPublicProfileModalOpen(true)}
        onOpenLegalModal={() => setLegalModalOpen(true)}
      />

      {/* 2. PLAYER HERO PROFILE BANNER */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px]">
                {currentUser.playLevel.toFixed(2)}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{currentUser.name}</h1>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 font-mono font-bold">
                  Socio #{currentTenant.slug === 'sanmateo' ? 'SM-408' : 'SOC-101'}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentTenant.name} {selectedVenue && selectedVenue.id !== 'all' ? `· ${selectedVenue.name}` : `· ${currentTenant.city}`} · Posición preferida: <strong>Revés</strong> · Diestro
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePlayerTab('booking')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5 ${
                activePlayerTab === 'booking'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Reservar Pista</span>
            </button>
            <button
              onClick={() => setActivePlayerTab('matches')}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                activePlayerTab === 'matches'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Partidos "Play!"</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. DESKTOP / TABLET SUB-TABS NAVIGATION */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <nav className="flex space-x-2 py-2" aria-label="Pestañas de navegación">
            {[
              { id: 'overview', label: 'Mi Espacio', icon: Home },
              { id: 'booking', label: 'Reservar Pista', icon: Calendar },
              { id: 'matches', label: 'Partidos Abiertos', icon: Users },
              { id: 'tournaments', label: 'Mis Competiciones', icon: Trophy },
              { id: 'teams', label: 'Mis Equipos', icon: Shield },
              { id: 'academy', label: 'Escuela & Clases', icon: GraduationCap },
              { id: 'shop', label: 'Tienda Club', icon: ShoppingBag },
              { id: 'stats', label: 'Nivel & Stats', icon: TrendingUp },
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

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  Las luces se encenderán automáticamente 5 minutos antes del inicio de tu reserva.
                </div>
              </div>
            )}

            {/* Quick Stats Grid with AUDITED "Nivel" label (No FEP) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">Nivel:</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                  {currentUser.playLevel.toFixed(2)}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">+0.15 este mes</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">Partidos Jugados:</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">34</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">22 victorias (64%)</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">Saldo Monedero:</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">24.50 €</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Recarga en cafetería o app</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">Equipos Oficiales:</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">2</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">1ª Categoría Gallega</div>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => setActivePlayerTab('booking')}
                className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition group space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  Reservar Pista en el Club
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Accede al cuadrante directo con tarifas de socio y pago dividido.
                </p>
              </div>

              <div
                onClick={() => setActivePlayerTab('matches')}
                className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition group space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-cyan-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  Partidos Abiertos ("Play!")
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Únete a partidas niveladas con jugadores de tu mismo rango.
                </p>
              </div>

              <div
                onClick={() => setActivePlayerTab('tournaments')}
                className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition group space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  Mis Competiciones
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Consulta tus cuadros, horarios de cruces y suma puntos de ranking.
                </p>
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
            />
          </div>
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
    </div>
  );
};
