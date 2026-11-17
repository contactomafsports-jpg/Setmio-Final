import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import heroPadelImg from '../../assets/images/hero_padel_club_1794872242820.jpg';
import playerPadelImg from '../../assets/images/player_padel_action_1794872242959.jpg';
import {
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  Users,
  Sparkles,
  ChevronRight,
  Heart,
  ShoppingBag,
  Trophy,
  GraduationCap,
  Zap,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    currentTenant,
    courts,
    tournaments,
    products,
    openMatches,
    setPublicPage,
    setSelectedCourtsForBooking,
    setSelectedTeamId,
    addToCart,
    toggleFavorite,
    isFavorite,
    triggerDemoToast,
    t,
    language,
    currentLanguage,
  } = useApp();
  void language;
  void currentLanguage;

  const [selectedCourtIds] = useState<string[]>(['court-1']);
  const [tournamentFilter, setTournamentFilter] = useState<'all' | 'open' | 'progress' | 'upcoming'>('all');

  const [searchDate, setSearchDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchTimeSlot, setSearchTimeSlot] = useState('afternoon');
  const [searchPlayersFormat, setSearchPlayersFormat] = useState('4');

  const handleAvailabilitySearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCourt =
      searchPlayersFormat === '2'
        ? courts.find((c) => c.isSingle)?.id || courts[0]?.id
        : searchPlayersFormat === 'indoor'
        ? courts.find((c) => c.courtType === 'indoor')?.id || courts[0]?.id
        : courts[0]?.id;

    if (targetCourt) {
      setSelectedCourtsForBooking([targetCourt]);
    }
    setPublicPage('booking');
    triggerDemoToast(
      t('home.availabilityToastTitle', 'Disponibilidad Consultada'),
      t('home.availabilityToastDescription', `Filtros aplicados para el ${searchDate}. Redirigiendo a reservas en tiempo real.`),
      'success'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const upcomingMatches = openMatches.slice(0, 3);
  const heroPhoto = currentTenant.branding.heroImageUrl || heroPadelImg;

  const previewTeams = [
    {
      id: 'team-masculino-1',
      name: t('home.teams.masculino1.name', 'Primer Equipo Masculino'),
      category: t('home.teams.masculino1.category', '1ª División Autonómica'),
      gender: 'masculino',
      photoUrl: playerPadelImg,
      captain: t('home.teams.masculino1.captain', 'Carlos Martínez'),
      rosterCount: 8,
    },
    {
      id: 'team-femenino-1',
      name: t('home.teams.femenino1.name', 'Primer Equipo Femenino'),
      category: t('home.teams.femenino1.category', '1ª División Autonómica'),
      gender: 'femenino',
      photoUrl: heroPadelImg,
      captain: t('home.teams.femenino1.captain', 'Laura Gómez'),
      rosterCount: 8,
    },
    {
      id: 'team-veteranos-1',
      name: t('home.teams.veteranos1.name', 'Equipo Veteranos +40'),
      category: t('home.teams.veteranos1.category', 'Liga Interclubes Veteranos'),
      gender: 'masculino',
      photoUrl: playerPadelImg,
      captain: t('home.teams.veteranos1.captain', 'Marcos Suárez'),
      rosterCount: 6,
    },
    {
      id: 'team-menores-1',
      name: t('home.teams.menores1.name', 'Cantera & Menores Sub-16'),
      category: t('home.teams.menores1.category', 'Campeonato Promesas'),
      gender: 'menores',
      photoUrl: heroPadelImg,
      captain: t('home.teams.menores1.captain', 'David Rivas'),
      rosterCount: 6,
    },
  ];

  const handleStartBookingWithCourts = () => {
    setSelectedCourtsForBooking(selectedCourtIds);
    setPublicPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTournaments = tournaments.filter((item) => {
    if (tournamentFilter === 'open') return item.status === 'registration_open';
    if (tournamentFilter === 'progress') return item.status === 'in_progress';
    if (tournamentFilter === 'upcoming') return item.status === 'upcoming';
    return true;
  });

  return (
    <div className="bg-white dark:bg-[#0B1A2D] space-y-20 lg:space-y-24 pb-24 text-[#0B1A2D] dark:text-slate-100 transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0B1A2D] pt-14 pb-20 lg:pt-20 lg:pb-24 border-b border-[#1A314D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-semibold tracking-wide text-[#B7F229]">
                {currentTenant.name} · {currentTenant.city}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-white leading-[1.08] text-balance">
                {t('home.hero.title', '20 años acompañando a padeleros y padeleras.')}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                {t('home.hero.subtitle', 'Reservas, partidas, competiciones y escuela. Una oferta completa para disfrutar del pádel.')}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleStartBookingWithCourts}
                  className="min-h-[44px] px-6 py-3 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] font-bold text-[#0B1A2D] text-sm flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>{t('home.cta.book', 'Reservar Pista Ahora')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPublicPage('matches');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-5 py-3 rounded-xl bg-[#0E2239] hover:bg-[#132A45] border border-[#1A314D] font-semibold text-white text-sm flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Users className="w-4 h-4 text-[#B7F229] shrink-0" />
                  <span>{t('home.cta.matches', 'Partidos Abiertos ("Play!")')}</span>
                </button>
              </div>

              {/* Key Value Metrics */}
              <div className="pt-8 border-t border-[#1A314D] grid grid-cols-3 gap-6 text-xs">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
                    {t('home.metric.courts', '8 Pistas')}
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    {t('home.metric.courtsDetail', '4 indoor, 3 outdoor (1 individual)')}
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#B7F229]">
                    {t('home.metric.academy', 'Escuela de Pádel')}
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    {t('home.metric.academyDetail', 'Adultos y Menores')}
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#a78bfa]">
                    {t('home.metric.competition', 'Competición')}
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    {t('home.metric.competitionDetail', 'Ligas y Torneos Oficiales')}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#1A314D] bg-[#0E2239] shadow-2xl">
                <img
                  src={heroPhoto}
                  alt={currentTenant.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-[400px] lg:h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D] via-[#0B1A2D]/25 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-xs text-white">
                  <div>
                    <div className="font-bold text-sm text-white">
                      {t('home.hero.courtName', 'Pista 1 Central Panorámica')}
                    </div>
                    <div className="text-slate-300 text-xs mt-0.5">
                      {currentTenant.name} · {t('home.hero.courtSpecs', 'Iluminación LED y césped oficial')}
                    </div>
                  </div>
                  <span className="text-[#B7F229] font-semibold shrink-0">
                    {t('home.hero.availableToday', 'Disponible Hoy')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORY SHORTCUTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-30">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'all', page: 'home' },
            { id: 'courts', page: 'courts' },
            { id: 'matches', page: 'matches' },
            { id: 'tournaments', page: 'tournaments' },
            { id: 'academy', page: 'academy' },
            { id: 'teams', page: 'teams' },
            { id: 'shop', page: 'shop' },
          ].map((filter) => (
            <button
              type="button"
              key={filter.id}
              onClick={() => {
                if (filter.page !== 'home') {
                  setPublicPage(filter.page as any);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors border cursor-pointer ${
                filter.id === 'all'
                  ? 'bg-[#B7F229] text-[#0B1A2D] border-[#B7F229]'
                  : 'bg-white dark:bg-[#0E2239] text-[#0B1A2D] dark:text-slate-200 border-slate-200 dark:border-[#1A314D] hover:border-[#8B5CF6] dark:hover:border-[#B7F229]'
              }`}
            >
              {t('home.filters.' + filter.id, filter.id)}
            </button>
          ))}
        </div>
      </section>

      {/* 2. FORMULARIO DE BÚSQUEDA DE DISPONIBILIDAD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-[#1A314D] pb-5">
            <div>
              <div className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{t('home.search.eyebrow', 'Búsqueda Rápida de Disponibilidad')}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1A2D] dark:text-white mt-1 tracking-tight">
                {t('home.search.title', 'Reserva tu pista en tiempo real')}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setPublicPage('courts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="min-h-[40px] text-xs font-semibold text-[#0B1A2D] dark:text-[#B7F229] hover:text-[#8B5CF6] flex items-center gap-1 transition-colors self-start sm:self-auto px-3 py-1.5 rounded-xl cursor-pointer whitespace-nowrap"
            >
              <span>{t('home.search.catalog', 'Ver catálogo de 8 pistas')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAvailabilitySearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('home.search.date', 'Fecha del Partido')}
              </label>
              <input
                type="date"
                value={searchDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-white dark:bg-[#071220] text-[#0B1A2D] dark:text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('home.search.time', 'Franja Horaria Preferida')}
              </label>
              <select
                value={searchTimeSlot}
                onChange={(e) => setSearchTimeSlot(e.target.value)}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-white dark:bg-[#071220] text-[#0B1A2D] dark:text-white text-sm focus:outline-none focus:border-[#8B5CF6] transition-colors cursor-pointer"
              >
                <option value="any">{t('home.search.anyTime', 'Cualquier Horario Disponible')}</option>
                <option value="morning">{t('home.search.morning', 'Mañanas (08:30 - 14:00)')}</option>
                <option value="afternoon">{t('home.search.afternoon', 'Tardes (16:00 - 20:00)')}</option>
                <option value="evening">{t('home.search.evening', 'Noche Prime (20:00 - 23:30)')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('home.search.players', 'Jugadores / Modalidad')}
              </label>
              <select
                value={searchPlayersFormat}
                onChange={(e) => setSearchPlayersFormat(e.target.value)}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-white dark:bg-[#071220] text-[#0B1A2D] dark:text-white text-sm focus:outline-none focus:border-[#8B5CF6] transition-colors cursor-pointer"
              >
                <option value="4">{t('home.search.players.4', '4 Jugadores (Pista Dobles WPT)')}</option>
                <option value="2">{t('home.search.players.2', '2 Jugadores (Pista Individual 1 vs 1)')}</option>
                <option value="indoor">{t('home.search.players.indoor', 'Pista Indoor Climatizada')}</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full min-h-[44px] py-2.5 px-6 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{t('home.search.submit', 'Consultar Disponibilidad')}</span>
              </button>
            </div>
          </form>

          {/* Carrusel Deslizante Horizontal de Instalaciones */}
          <div className="pt-5 border-t border-slate-200/80 dark:border-[#1A314D]">
            <div className="flex items-center justify-between mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>{t('home.search.featured', 'Instalaciones destacadas:')}</span>
              <button
                type="button"
                onClick={() => {
                  setPublicPage('courts');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#8B5CF6] dark:text-[#B7F229] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{t('home.search.all', 'Ver todas')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
              {courts.map((court) => (
                <div
                  key={court.id}
                  onClick={() => {
                    setSelectedCourtsForBooking([court.id]);
                    setPublicPage('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-w-[240px] sm:min-w-[270px] snap-start rounded-2xl bg-white dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] p-3 hover:border-[#8B5CF6]/50 dark:hover:border-[#B7F229]/40 transition-colors cursor-pointer space-y-2.5 shrink-0 group"
                >
                  <div className="relative h-28 rounded-xl overflow-hidden bg-[#0B1A2D]">
                    <img
                      src={court.photoUrl || heroPadelImg}
                      alt={court.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-[#0B1A2D]/90 text-[#B7F229] font-mono tabular-nums font-bold text-[11px]">
                      {court.hourlyRate.toFixed(2)} €/h
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-[#8B5CF6] dark:text-[#a78bfa] capitalize">{court.courtType}</span>
                    <span className="truncate">{court.surface}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-sm text-[#0B1A2D] dark:text-white truncate">{court.name}</div>
                    <span className="text-xs text-[#0B1A2D] dark:text-[#B7F229] font-semibold shrink-0">
                      {t('home.search.book', 'Reservar →')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN VENTAJAS & FUNCIONALIDADES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-left sm:text-center max-w-2xl sm:mx-auto space-y-2">
          <div className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide flex items-center sm:justify-center gap-1.5">
            <Zap className="w-4 h-4 shrink-0" />
            <span>{t('home.advantages.eyebrow', 'Experiencia Digital Integral')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0B1A2D] dark:text-white tracking-tight text-balance">
            {t('home.advantages.title', 'Todo pensado para que solo te preocupes de jugar')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            {t('home.advantages.description', 'Automatización total en acceso, pagos divididos y competiciones del club.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 'iot', icon: Zap },
            { id: 'matches', icon: Users },
            { id: 'academy', icon: GraduationCap },
            { id: 'tournaments', icon: Trophy },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-[#a78bfa] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#0B1A2D] dark:text-white tracking-tight">
                  {t('home.advantages.' + item.id + '.title', item.id)}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('home.advantages.' + item.id + '.description', '')}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CONOCE NUESTROS EQUIPOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide flex items-center gap-1.5">
              <Shield className="w-4 h-4 shrink-0" />
              <span>{t('home.teams.eyebrow', 'Competición y Club')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight">
              {t('home.teams.title', 'Conoce nuestros equipos')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {t('home.teams.description', `Plantillas que compiten en las ligas federadas e interclubes representando a ${currentTenant.name}.`)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setPublicPage('teams');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] hover:border-[#8B5CF6] font-semibold text-xs text-[#0B1A2D] dark:text-white transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer whitespace-nowrap"
          >
            <span>{t('home.teams.all', 'Ver todos los equipos')}</span>
            <ArrowRight className="w-4 h-4 text-[#8B5CF6] dark:text-[#B7F229]" />
          </button>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] divide-y divide-slate-200/80 dark:divide-[#1A314D] overflow-hidden">
          {previewTeams.map((team) => (
            <div
              key={team.id}
              onClick={() => {
                setSelectedTeamId(team.id);
                setPublicPage('teams');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cursor-pointer p-4 sm:p-5 hover:bg-[#F8FAFC] dark:hover:bg-[#132A45] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={team.photoUrl}
                  alt={team.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-[#1A314D]"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1 text-xs">
                    <span className="font-semibold text-[#8B5CF6] dark:text-[#a78bfa] capitalize">
                      {t('home.teams.gender.' + team.gender, team.gender)}
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {t('home.teams.captain', 'Capitán:')}{' '}
                      <strong className="text-[#0B1A2D] dark:text-slate-200 font-semibold">{team.captain}</strong>
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0B1A2D] dark:text-white group-hover:text-[#8B5CF6] dark:group-hover:text-[#B7F229] transition-colors truncate">
                    {team.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{team.category}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0">
                <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {team.rosterCount} {t('home.teams.players', 'jugadores')}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] group-hover:translate-x-1 transition-transform">
                  <span>{t('home.teams.view', 'Ver ficha')}</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SECCIÓN COMPETICIONES */}
      <section className="bg-[#F8FAFC] dark:bg-[#071220] border-y border-slate-200/80 dark:border-[#1A314D] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide flex items-center gap-1.5">
                <Trophy className="w-4 h-4 shrink-0" />
                <span>{t('home.tournaments.eyebrow', 'Competición y Ligas')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight">
                {t('home.tournaments.title', 'Torneos y Circuitos Activos')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {t('home.tournaments.description', 'Inscríbete con tu pareja en torneos puntuables con cuadros oficiales y premios.')}
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-semibold self-start sm:self-auto">
              {[
                { key: 'all', label: t('home.tournaments.filterAll', 'Todos') },
                { key: 'open', label: t('home.tournaments.filterOpen', 'Inscripción Abierta') },
                { key: 'progress', label: t('home.tournaments.filterProgress', 'En Curso') },
              ].map((tab) => (
                <button
                  type="button"
                  key={tab.key}
                  onClick={() => setTournamentFilter(tab.key as any)}
                  className={`min-h-[36px] px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    tournamentFilter === tab.key
                      ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="rounded-2xl overflow-hidden bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-[#0B1A2D]">
                    <img
                      src={tournament.bannerUrl || heroPadelImg}
                      alt={tournament.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D] via-[#0B1A2D]/30 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="text-xs font-mono tabular-nums text-[#B7F229] font-semibold">
                        {tournament.dates} ·{' '}
                        {tournament.status === 'registration_open'
                          ? t('home.tournaments.open', 'Inscripción Abierta')
                          : t('home.tournaments.upcoming', 'Próximamente')}
                      </div>
                      <h3 className="font-bold text-lg text-white truncate">{tournament.title}</h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>{t('home.tournaments.registration', 'Inscripción:')}</span>
                      <strong className="font-mono tabular-nums text-[#0B1A2D] dark:text-white text-sm">
                        {tournament.entryFee.toFixed(2)} €/jugador
                      </strong>
                    </div>

                    <div className="text-slate-500 dark:text-slate-400">
                      {t('home.tournaments.prizes', 'Premios:')}{' '}
                      <strong className="text-[#0B1A2D] dark:text-slate-200">{tournament.prizes}</strong>
                    </div>

                    <div className="text-slate-500 dark:text-slate-400 pt-1">
                      {tournament.categories.map((c) => `${c.name} (${c.teamsCount}/${c.maxTeams})`).join(' · ')}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-[#1A314D]">
                  <button
                    type="button"
                    onClick={() => {
                      setPublicPage('tournaments');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full min-h-[40px] py-2.5 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{t('home.tournaments.register', 'Inscribirme al Torneo')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setPublicPage('tournaments');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#8B5CF6] dark:text-[#B7F229] hover:underline cursor-pointer"
            >
              <span>{t('home.tournaments.all', 'Ver todas las competiciones y clasificaciones')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. PARTIDOS ABIERTOS ("PLAY!") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide">
              {t('home.matches.eyebrow', 'Comunidad & Partidos Abiertos')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight">
              {t('home.matches.title', '¿Te falta un jugador? Apúntate a un "Play!"')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
              {t('home.matches.subtitle', 'Partidas niveladas con plazas libres para hoy y los próximos días. Únete con un solo clic.')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setPublicPage('matches');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#8B5CF6] dark:text-[#B7F229] hover:underline self-start sm:self-auto cursor-pointer whitespace-nowrap"
          >
            <span>{t('home.matches.all', 'Ver todos los partidos abiertos')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingMatches.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-6 flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-[#8B5CF6] dark:text-[#a78bfa] font-mono tabular-nums">
                    {t('home.matches.level', 'Nivel')} {m.minLevel.toFixed(1)} - {m.maxLevel.toFixed(1)}
                  </span>
                  <span className="font-mono tabular-nums text-[#0B1A2D] dark:text-[#B7F229] font-bold">
                    {m.pricePerPlayer.toFixed(2)} {t('home.matches.pricePlayer', '€/jugador')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">{m.courtName}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-mono tabular-nums">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#a78bfa]" />
                    <span>{m.startTime.split('T')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#B7F229]" />
                    <span>{m.startTime.split('T')[1]?.slice(0, 5)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#1A314D]">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2.5 flex items-center justify-between">
                    <span>{t('home.matches.available', 'Plazas disponibles:')}</span>
                    <span className="font-bold font-mono tabular-nums text-[#0B1A2D] dark:text-[#B7F229]">
                      {4 - m.players.length} {t('home.matches.free', 'libres')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          m.players[idx]
                            ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                            : 'bg-[#F8FAFC] dark:bg-[#071220] text-slate-400 border border-dashed border-slate-300 dark:border-[#1A314D]'
                        }`}
                      >
                        {m.players[idx] ? m.players[idx].name.charAt(0) : '+'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPublicPage('matches');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a6de1f] text-white dark:text-[#0B1A2D] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{t('home.matches.join', 'Unirme a esta Partida')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PRO SHOP TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide">
              {t('home.shop.eyebrow', 'Material Oficial en el Club')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight">
              {t('home.shop.title', 'Tienda Oficial & Test Center')}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setPublicPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1 text-xs font-semibold text-[#8B5CF6] dark:text-[#B7F229] hover:underline cursor-pointer whitespace-nowrap"
          >
            <span>{t('home.shop.all', 'Ver Tienda Completa')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-[#F8FAFC] dark:bg-[#071220]">
                <img
                  src={product.imageUrl || heroPadelImg}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/95 dark:bg-[#0B1A2D]/90 text-slate-600 dark:text-slate-300 hover:text-[#8B5CF6] flex items-center justify-center border border-slate-200/80 dark:border-[#1A314D] transition-colors cursor-pointer"
                  aria-label="Favorito"
                >
                  <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-[#8B5CF6] text-[#8B5CF6]' : ''}`} />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <div className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa]">{product.brand}</div>
                <h3 className="font-bold text-sm text-[#0B1A2D] dark:text-white truncate">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono tabular-nums font-bold text-base text-[#0B1A2D] dark:text-white">
                    {product.price.toFixed(2)} €
                  </span>
                  {product.compareAtPrice && (
                    <span className="font-mono tabular-nums text-xs line-through text-slate-400">
                      {product.compareAtPrice.toFixed(2)} €
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="w-full min-h-[40px] py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#132A45] hover:bg-[#B7F229] hover:text-[#0B1A2D] border border-slate-200/80 dark:border-[#1A314D] font-semibold text-xs text-[#0B1A2D] dark:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t('home.shop.add', 'Añadir al Carrito')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
