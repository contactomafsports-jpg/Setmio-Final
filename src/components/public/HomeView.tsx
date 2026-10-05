import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  Award,
  Users,
  Sparkles,
  ChevronRight,
  Heart,
  ShoppingBag,
  MapPin,
  Phone,
  CheckCircle2,
  Trophy,
  GraduationCap,
  Store,
  Coffee,
  Zap,
  Star,
  Check,
  CheckSquare,
  Square,
  Flame,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    currentTenant,
    courts,
    tournaments,
    products,
    blogPosts,
    openMatches,
    coaches,
    setPublicPage,
    setSelectedArticleId,
    setSelectedCourtsForBooking,
    setSelectedTeamId,
    addToCart,
    toggleFavorite,
    isFavorite,
    triggerDemoToast,
    t,
    currentLanguage,
  } = useApp();
  void currentLanguage;

  // Multi-court visual selector state
  const [selectedCourtIds, setSelectedCourtIds] = useState<string[]>(['court-1']);
  const [tournamentFilter, setTournamentFilter] = useState<'all' | 'open' | 'progress' | 'upcoming'>('all');

  // Search Availability Form States
  const [searchDate, setSearchDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchTimeSlot, setSearchTimeSlot] = useState('afternoon');
  const [searchPlayersFormat, setSearchPlayersFormat] = useState('4');

  const handleAvailabilitySearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCourt = searchPlayersFormat === '2' 
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
  const featuredCoach = coaches[0];
  const recentArticles = blogPosts.slice(0, 3);

  // Teams preview for the home vertical list
  const previewTeams = [
    {
      id: 'team-masculino-1',
      name: t('home.teams.masculino1.name', 'Absoluto Masculino A'),
      category: t('home.teams.masculino1.category', '1ª Categoría Gallega · División de Honor'),
      gender: 'masculino',
      photoUrl: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=600&q=80',
      captain: 'Mateo Varela',
      rosterCount: 8,
    },
    {
      id: 'team-femenino-1',
      name: t('home.teams.femenino1.name', 'Absoluto Femenino A'),
      category: t('home.teams.femenino1.category', '1ª Categoría Gallega · Liga FGP'),
      gender: 'femenino',
      photoUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80',
      captain: 'Rosa Carballo',
      rosterCount: 8,
    },
    {
      id: 'team-veteranos-1',
      name: t('home.teams.veteranos1.name', 'Veteranos +40'),
      category: t('home.teams.veteranos1.category', 'Liga Interclubes Senior Rías Altas'),
      gender: 'masculino',
      photoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
      captain: 'Nacho Castro',
      rosterCount: 6,
    },
    {
      id: 'team-menores-1',
      name: t('home.teams.menores1.name', 'Escuela Promesas Junior Sub-16'),
      category: t('home.teams.menores1.category', 'Circuito Menores Federación Gallega'),
      gender: 'menores',
      photoUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
      captain: 'Lucas Rey Jr.',
      rosterCount: 6,
    },
  ];

  const handleToggleCourtSelection = (courtId: string) => {
    setSelectedCourtIds((prev) =>
      prev.includes(courtId)
        ? prev.length > 1
          ? prev.filter((id) => id !== courtId)
          : prev
        : [...prev, courtId]
    );
  };

  const handleStartBookingWithCourts = () => {
    setSelectedCourtsForBooking(selectedCourtIds);
    setPublicPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTournaments = tournaments.filter((t) => {
    if (tournamentFilter === 'open') return t.status === 'registration_open';
    if (tournamentFilter === 'progress') return t.status === 'in_progress';
    if (tournamentFilter === 'upcoming') return t.status === 'upcoming';
    return true;
  });

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 pt-12 pb-16 lg:pt-20 lg:pb-28 border-b border-slate-800 text-white">
        {/* Padel Court Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${currentTenant.branding.heroImageUrl || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=2000&q=85'})` }}
          aria-hidden="true"
        />
        {/* Dark overlay & Dark Glassmorphism aesthetic */}
        <div
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-slate-950/80"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(16,185,129,0.25),transparent_40%)]"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] text-balance">
                {t('home.hero.title', '20 años acompañando a padeleros y padeleras.')}
              </h1>

              <p className="text-base sm:text-lg text-slate-200 max-w-xl font-normal leading-relaxed">
                {t('home.hero.subtitle', 'Reservas, partidas, competiciones y escuela. Una oferta completa para disfrutar del pádel.')}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleStartBookingWithCourts}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 font-extrabold text-white dark:text-slate-950 text-sm shadow-xl shadow-emerald-600/20 flex items-center gap-2 transition hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('home.cta.book', 'Reservar Pista Ahora')}</span>
                </button>

                <button
                  onClick={() => {
                    setPublicPage('matches');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 font-semibold text-white text-sm flex items-center gap-2 transition backdrop-blur-md"
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>{t('home.cta.matches', 'Partidos Abiertos ("Play!")')}</span>
                </button>
              </div>

              {/* Key Value Metrics */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">{t('home.metric.courts', '8 Pistas')}</div>
                  <div className="text-slate-300 text-[11px] mt-0.5 font-medium">{t('home.metric.courtsDetail', '4 indoor, 3 outdoor (1 individual)')}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">{t('home.metric.academy', 'Escuela de Pádel')}</div>
                  <div className="text-slate-300 text-[11px] mt-0.5 font-medium">{t('home.metric.academyDetail', 'Adultos y Menores')}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-400">{t('home.metric.competition', 'Competición')}</div>
                  <div className="text-slate-300 text-[11px] mt-0.5 font-medium">{t('home.metric.competitionDetail', 'Ligas y Torneos Oficiales')}</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                <img
                  src={currentTenant.branding.heroImageUrl}
                  alt={currentTenant.name}
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs shadow-lg text-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{t('home.hero.courtName', 'Pista 1 Central Panorámica')}</span>
                    <span className="text-emerald-400 font-bold">{t('home.hero.availableToday', 'Disponible Hoy')}</span>
                  </div>
                  <div className="text-slate-300 text-[11px] font-medium">
                    {currentTenant.name} · {t('home.hero.courtSpecs', 'Iluminación LED y césped oficial')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BARRA DE FILTROS DEBAJO DEL HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-6 relative z-30">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
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
              key={filter.id}
              onClick={() => {
                if (filter.page !== 'home') {
                  setPublicPage(filter.page as any);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition shadow-sm border ${
                filter.id === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              {t('home.filters.' + filter.id)}
            </button>
          ))}
        </div>
      </section>

      {/* 2. FORMULARIO DE BÚSQUEDA DE DISPONIBILIDAD (Requisito: Las pistas no son lo importante en la home) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{t('home.search.eyebrow', 'Búsqueda Rápida de Disponibilidad')}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {t('home.search.title', 'Reserva tu pista en tiempo real')}
              </h2>
            </div>
            <button
              onClick={() => {
                setPublicPage('courts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition self-start sm:self-auto px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>{t('home.search.catalog', 'Ver catálogo de 8 pistas')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAvailabilitySearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('home.search.date', 'Fecha del Partido')}
              </label>
              <input
                type="date"
                value={searchDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('home.search.time', 'Franja Horaria Preferida')}
              </label>
              <select
                value={searchTimeSlot}
                onChange={(e) => setSearchTimeSlot(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 transition"
              >
                <option value="any">{t('home.search.anyTime', 'Cualquier Horario Disponible')}</option>
                <option value="morning">{t('home.search.morning', 'Mañanas (08:30 - 14:00)')}</option>
                <option value="afternoon">{t('home.search.afternoon', 'Tardes (16:00 - 20:00)')}</option>
                <option value="evening">{t('home.search.evening', 'Noche Prime (20:00 - 23:30)')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('home.search.players', 'Jugadores / Modalidad')}
              </label>
              <select
                value={searchPlayersFormat}
                onChange={(e) => setSearchPlayersFormat(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 transition"
              >
                <option value="4">{t('home.search.players.4', '4 Jugadores (Pista Dobles WPT)')}</option>
                <option value="2">{t('home.search.players.2', '2 Jugadores (Pista Individual 1 vs 1)')}</option>
                <option value="indoor">{t('home.search.players.indoor', 'Pista Indoor Climatizada')}</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('home.search.submit', 'Consultar Disponibilidad')}</span>
              </button>
            </div>
          </form>

          {/* Carrusel Deslizante Horizontal de Instalaciones */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>{t('home.search.featured', 'Instalaciones destacadas:')}</span>
              <button
                onClick={() => {
                  setPublicPage('courts');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>{t('home.search.all', 'Ver todas')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
              {courts.map((court) => (
                <div
                  key={court.id}
                  onClick={() => {
                    setSelectedCourtsForBooking([court.id]);
                    setPublicPage('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-w-[240px] sm:min-w-[270px] snap-start rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 hover:border-emerald-500 transition cursor-pointer space-y-2 shrink-0 group"
                >
                  <div className="relative h-28 rounded-xl overflow-hidden">
                    <img
                      src={court.photoUrl}
                      alt={court.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-400">
                      {court.courtType.toUpperCase()}
                    </span>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold text-[10px]">
                      {court.hourlyRate.toFixed(2)} €/h
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {court.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span className="truncate">{court.surface}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">{t('home.search.book', 'Reservar →')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN VENTAJAS & FUNCIONALIDADES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span>{t('home.advantages.eyebrow')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('home.advantages.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            {t('home.advantages.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {t('home.advantages.' + item.id + '.title')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('home.advantages.' + item.id + '.description')}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CONOCE NUESTROS EQUIPOS (VERTICAL LIST + BUTTON) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>{t('home.teams.eyebrow', 'Competición y Club')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {t('home.teams.title', 'Conoce nuestros equipos')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              {t('home.teams.description', `Plantillas que compiten en las ligas federadas e interclubes representando a ${currentTenant.name}.`)}
            </p>
          </div>

          <button
            onClick={() => {
              setPublicPage('teams');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-slate-900 dark:text-white transition flex items-center gap-2 self-start sm:self-auto shadow-sm"
          >
            <span>{t('home.teams.all', 'Ver todos los equipos')}</span>
            <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>

        {/* Vertical List of Teams */}
        <div className="space-y-3">
          {previewTeams.map((team) => (
            <div
              key={team.id}
              onClick={() => {
                setSelectedTeamId(team.id);
                setPublicPage('teams');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={team.photoUrl}
                  alt={team.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-sm shrink-0 border border-slate-200 dark:border-slate-800 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                      {t('home.teams.gender.' + team.gender, team.gender)}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {t('home.teams.captain', 'Capitán:')} <strong className="text-slate-800 dark:text-slate-200">{team.captain}</strong>
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                    {team.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {team.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {team.rosterCount} {t('home.teams.players', 'jugadores')}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>{t('home.teams.view', 'Ver ficha')}</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SECCIÓN COMPETICIONES (CAROUSEL + FILTROS) */}
      <section className="bg-slate-100/80 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-teal-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                <span>{t('home.tournaments.eyebrow', 'Competición y Ligas')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {t('home.tournaments.title', 'Torneos y Circuitos Activos')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                {t('home.tournaments.description', 'Inscríbete con tu pareja en torneos puntuables con cuadros oficiales y premios.')}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold self-start sm:self-auto">
              <button
                onClick={() => setTournamentFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  tournamentFilter === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('home.tournaments.filterAll', 'Todos')}
              </button>
              <button
                onClick={() => setTournamentFilter('open')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  tournamentFilter === 'open'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('home.tournaments.filterOpen', 'Inscripción Abierta')}
              </button>
              <button
                onClick={() => setTournamentFilter('progress')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  tournamentFilter === 'progress'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('home.tournaments.filterProgress', 'En Curso')}
              </button>
            </div>
          </div>

          {/* Tournament Carousel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={tournament.bannerUrl}
                      alt={tournament.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase shadow">
                        {tournament.status === 'registration_open' ? t('home.tournaments.open', 'Inscripción Abierta') : t('home.tournaments.upcoming', 'Próximamente')}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="text-[11px] font-mono text-emerald-400 font-bold">{tournament.dates}</div>
                      <h3 className="font-bold text-lg text-white truncate">{tournament.title}</h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>{t('home.tournaments.registration', 'Inscripción:')}</span>
                      <strong className="font-mono text-slate-900 dark:text-white text-sm">
                        {tournament.entryFee.toFixed(2)} €/jugador
                      </strong>
                    </div>

                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {t('home.tournaments.prizes', 'Premios:')} <strong className="text-slate-800 dark:text-slate-200">{tournament.prizes}</strong>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tournament.categories.map((c, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-semibold"
                        >
                          {c.name} ({c.teamsCount}/{c.maxTeams})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setPublicPage('tournaments');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
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
              onClick={() => {
                setPublicPage('tournaments');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>{t('home.tournaments.all', 'Ver todas las competiciones y clasificaciones')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. PARTIDOS ABIERTOS ("PLAY!") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {t('home.matches.eyebrow', 'Comunidad & Partidos Abiertos')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {t('home.matches.title', '¿Te falta un jugador? Apúntate a un "Play!"')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              {t('home.matches.subtitle', 'Partidas niveladas con plazas libres para hoy y los próximos días. Únete con un solo clic.')}
            </p>
          </div>

          <button
            onClick={() => {
              setPublicPage('matches');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline self-start sm:self-auto"
          >
            <span>{t('home.matches.all', 'Ver todos los partidos abiertos')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingMatches.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {t('home.matches.level', 'Nivel')} {m.minLevel.toFixed(1)} - {m.maxLevel.toFixed(1)}
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">
                    {m.pricePerPlayer.toFixed(2)} {t('home.matches.pricePlayer', '€/jugador')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{m.courtName}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{m.startTime.split('T')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400" />
                    <span>{m.startTime.split('T')[1]?.slice(0, 5)}</span>
                  </div>
                </div>

                {/* Plazas */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                    <span>{t('home.matches.available', 'Plazas disponibles:')}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{4 - m.players.length} {t('home.matches.free', 'libres')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          m.players[idx]
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-dashed border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {m.players[idx] ? m.players[idx].name.charAt(0) : '+'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setPublicPage('matches');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <span>{t('home.matches.join', 'Unirme a esta Partida')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PRO SHOP TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {t('home.shop.eyebrow', 'Material Oficial en el Club')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {t('home.shop.title', 'Tienda Oficial & Test Center')}
            </h2>
          </div>
          <button
            onClick={() => {
              setPublicPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>{t('home.shop.all', 'Ver Tienda Completa')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:text-rose-500 shadow-sm transition"
                >
                  <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">{product.brand}</div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                    {product.price.toFixed(2)} €
                  </span>
                  {product.compareAtPrice && (
                    <span className="font-mono text-xs line-through text-slate-400">
                      {product.compareAtPrice.toFixed(2)} €
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white font-bold text-xs text-slate-900 dark:text-white transition flex items-center justify-center gap-1.5"
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
