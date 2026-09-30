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
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    currentTenant,
    tournaments,
    products,
    blogPosts,
    openMatches,
    coaches,
    setPublicPage,
    setSelectedArticleId,
    addToCart,
    toggleFavorite,
    isFavorite,
    triggerDemoToast,
  } = useApp();

  const [quickDate, setQuickDate] = useState('2026-10-01');
  const [quickTime, setQuickTime] = useState('19:00');
  const [quickCourtType, setQuickCourtType] = useState('all');

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const marqueeTournament = tournaments[0];
  const upcomingMatches = openMatches.slice(0, 3);
  const featuredCoach = coaches[0];
  const recentArticles = blogPosts.slice(0, 3);

  const handleStartBooking = () => {
    setPublicPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArticle = (id: string) => {
    setSelectedArticleId(id);
    setPublicPage('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 pt-10 pb-16 lg:pt-20 lg:pb-28 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(16,185,129,0.22),transparent_34%),linear-gradient(120deg,rgba(15,23,42,0.98),rgba(15,23,42,0.76))]" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              {/* Quiet kicker */}
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                <span>{currentTenant.branding.badgeText}</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">{currentTenant.city}, Galicia</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] text-balance">
                {currentTenant.branding.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-200 max-w-xl font-normal leading-relaxed">
                {currentTenant.branding.heroSubtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleStartBooking}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 font-extrabold text-white dark:text-slate-950 text-sm shadow-xl shadow-emerald-600/20 dark:shadow-emerald-950/60 flex items-center gap-2 transition hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Pista Ahora</span>
                </button>

                <button
                  onClick={() => {
                    setPublicPage('matches');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2 transition shadow-sm"
                >
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Partidos Abiertos ("Play!")</span>
                </button>
              </div>

              {/* Key Trust Metrics */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">8 Pistas</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 font-medium">Césped WPT Oficial</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">14 Horas</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 font-medium">Apertura Diaria 8:00 - 23:00</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-teal-600 dark:text-cyan-400">+450</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 font-medium">Jugadores Activos</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-2xl group">
                <img
                  src={currentTenant.branding.heroImageUrl}
                  alt={currentTenant.name}
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-xs shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">Pista 1 Central Panorámica</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Disponible Hoy</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">
                    Iluminación LED de competición TV y césped Mondo Supercourt XN Azul
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK COURT BOOKING BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 shadow-xl backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Fecha del Partido
              </label>
              <input
                type="date"
                value={quickDate}
                onChange={(e) => setQuickDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Franja Horaria
              </label>
              <select
                value={quickTime}
                onChange={(e) => setQuickTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-semibold"
              >
                <option value="17:30">17:30 - 19:00 (Tarde)</option>
                <option value="19:00">19:00 - 20:30 (Hora Punta)</option>
                <option value="20:30">20:30 - 22:00 (Nocturno)</option>
                <option value="10:00">10:00 - 11:30 (Mañana)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Tipo de Pista
              </label>
              <select
                value={quickCourtType}
                onChange={(e) => setQuickCourtType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-semibold"
              >
                <option value="all">Todas las 8 Pistas</option>
                <option value="panoramic">Panorámicas WPT (1, 2, 3)</option>
                <option value="single">Individual 1 vs 1 (Pista 7)</option>
              </select>
            </div>

            <div className="pt-2 sm:pt-5">
              <button
                onClick={handleStartBooking}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 font-bold text-xs text-white dark:text-slate-950 flex items-center justify-center gap-2 shadow-md transition hover:scale-[1.01]"
              >
                <Calendar className="w-4 h-4" />
                <span>Ver Disponibilidad</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RESUMEN SECCIÓN 1: EL CLUB & INSTALACIONES (NO PISTAS INDIVIDUALES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Instalaciones & Complejo Deportivo
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Un estándar profesional único en Ferrolterra
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Diseñado cuidando cada detalle arquitectónico y deportivo para ofrecer la mejor experiencia de juego, comodidad y convivencia.
            </p>
          </div>

          <button
            onClick={() => {
              setPublicPage('courts');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition group self-start sm:self-auto"
          >
            <span>Ver Especificaciones Técnicas y Pistas</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Bento Grid Highlighting Facilities (Not individual courts) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                8 Pistas Panorámicas WPT
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Estructura de visión total sin esquinas opacas, cristales de 12 mm templados y césped oficial <strong>Mondo Supercourt XN</strong> azul de máxima tracción y amortiguación articular.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>11 metros de altura libre sin vigas</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Iluminación LED TV & Domótica
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                8 focos proyectores LED asimétricos con más de 650 lux homogéneos sin deslumbramiento cenital. Cerraduras inteligentes con apertura mediante código PIN automatizado.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Apertura autónoma y encendido automático</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Club Social & Vestuarios Climatizados
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Cafetería con vistas directas a la pista central, zona de tercer tiempo con terraza, pantallas con Premier Padel y vestuarios de alta capacidad con parking privado de 80 plazas.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Parking gratuito vigilado para socios</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RESUMEN SECCIÓN 2: PARTIDOS ABIERTOS "PLAY!" */}
      <section className="bg-slate-100/80 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Comunidad & Partidos Abiertos
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                ¿Te falta un jugador? Apúntate a un "Play!"
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                Partidas niveladas con plazas libres para hoy y los próximos días. Únete con un solo clic y paga únicamente tu parte de pista.
              </p>
            </div>

            <button
              onClick={() => {
                setPublicPage('matches');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition group self-start sm:self-auto"
            >
              <span>Ver Todos los Partidos Abiertos</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingMatches.map((m) => {
              const isFull = m.players.length >= 4;
              return (
                <div
                  key={m.id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        Nivel {m.minLevel.toFixed(1)} - {m.maxLevel.toFixed(1)}
                      </span>
                      <span className="font-mono text-slate-900 dark:text-white font-bold">{m.pricePerPlayer.toFixed(2)} €/jugador</span>
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
                        <span>Plazas disponibles:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{4 - m.players.length} libres</span>
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
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <span>Unirme a esta Partida</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. RESUMEN SECCIÓN 3: ESCUELA DE PÁDEL & FORMACIÓN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>Escuela de Pádel San Mateo</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Aprende y perfecciona tu juego con entrenadores federados
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              Cursos cuatrimestrales para todos los niveles: iniciación, perfeccionamiento, grupos de competición femenina y masculina, y escuela infantil. Máximo 4 alumnos por pista con monitor titulado FEP.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Test de nivel previo gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Grupos homogéneos de 4</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Análisis biomecánico en vídeo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Clases particulares 1 a 1</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  setPublicPage('academy');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <span>Conocer Grupos y Horarios</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Coach Spotlight Card */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row gap-6 items-center">
              <img
                src={featuredCoach.photoUrl}
                alt={featuredCoach.name}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-md shrink-0"
              />
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{featuredCoach.rating.toFixed(2)} (Valoración de alumnos)</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{featuredCoach.name}</h3>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{featuredCoach.roleTitle}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {featuredCoach.bio}
                </p>
                <div className="pt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  Tarifa particular: <strong className="text-slate-900 dark:text-white font-bold">{featuredCoach.hourlyRate.toFixed(2)} €/h</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RESUMEN SECCIÓN 4: TORNEOS & COMPETICIONES */}
      <section className="bg-slate-100/80 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-teal-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                <span>Competición & Torneos</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Próximos Torneos y Ligas Sociales
              </h2>
            </div>

            <button
              onClick={() => {
                setPublicPage('tournaments');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-cyan-400 hover:text-teal-700 dark:hover:text-cyan-300 transition group self-start sm:self-auto"
            >
              <span>Ver Calendario Completo</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Marquee tournament card */}
          {marqueeTournament && (
            <div className="rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-6 relative h-64 lg:h-auto min-h-[260px]">
                <img
                  src={marqueeTournament.bannerUrl}
                  alt={marqueeTournament.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-xs font-bold text-white bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700">
                  {marqueeTournament.dates}
                </div>
              </div>

              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span>CIRCUITO OFICIAL</span>
                    <span>·</span>
                    <span>{marqueeTournament.entryFee.toFixed(2)} € / jugador</span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {marqueeTournament.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Welcome pack oficial con camiseta conmemorativa, grip y bote de bolas. Cuadros eliminatorios con fase de consolación garantizada para todas las parejas inscritas.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2">
                    {marqueeTournament.categories.slice(0, 4).map((c) => (
                      <div key={c.name} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400" />
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-500">Premios en metálico y trofeos</span>
                  </div>

                  <button
                    onClick={() => {
                      setPublicPage('tournaments');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md transition"
                  >
                    Inscribir Pareja
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. RESUMEN SECCIÓN 5: PRO SHOP OFICIAL & TEST DE PALAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-4 h-4" />
              <span>Tienda Oficial Pro Shop</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Equipamiento Top con Test en Pista
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Prueba la pala en nuestras pistas antes de comprar. Disponemos de palas de test Bullpadel, Nox y Head con asesoramiento de nuestros monitores.
            </p>
          </div>

          <button
            onClick={() => {
              setPublicPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition group self-start sm:self-auto"
          >
            <span>Explorar Toda la Tienda</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => {
            const favorite = isFavorite(p.id);
            return (
              <div
                key={p.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div className="relative h-56 bg-slate-100 dark:bg-slate-950 overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => {
                      setPublicPage('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                  <button
                    onClick={() => toggleFavorite(p.id)}
                    className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition ${
                      favorite
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-rose-500'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>

                  <div className="absolute bottom-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/90 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                    {p.brand}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      onClick={() => {
                        setPublicPage('shop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-slate-900 dark:text-white font-mono">
                        {p.price.toFixed(2)} €
                      </div>
                      {p.compareAtPrice && (
                        <div className="text-[11px] text-slate-400 line-through">
                          {p.compareAtPrice.toFixed(2)} €
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(p, 1)}
                      className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold transition shadow-sm"
                      title="Añadir a la cesta"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. RESUMEN SECCIÓN 6: CLUB SOCIAL & TERCER TIEMPO */}
      <section className="bg-slate-100/80 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Coffee className="w-4 h-4" />
                <span>El Tercer Tiempo</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Cafetería, Terraza & Comunidad
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                El partido no termina en la red. En Pádel San Mateo cuidamos el ambiente posterior con nuestra cafetería climatizada con vistas a las pistas centrales, batidos recuperadores de proteína, cafés de especialidad, bebidas isotónicas frías y aperitivos para comentar la jugada con tus rivales y amigos.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Pantallas con Premier Padel</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Terraza exterior de verano</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Cobro directo con tarjeta de socio</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl h-64 lg:h-72">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
                alt="Cafetería y terraza de pádel"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. RESEÑAS & CONTACTO RÁPIDO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Opiniones Reales
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            La voz de nuestros jugadores y socios
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: 'Las pistas tienen un bote perfecto. El césped Mondo azul es idéntico al del circuito profesional y los focos LED no te ciegan en los globos altos.',
              author: 'David Romero',
              role: 'Socio Nivel 4.5',
            },
            {
              quote: 'Empecé de cero en la escuela de San Mateo y en seis meses ya estoy jugando partidos abiertos semanales. El ambiente y los monitores son de 10.',
              author: 'Laura Ferreiro',
              role: 'Alumna Escuela Adultos',
            },
            {
              quote: 'Poder reservar por la web, abrir la pista con el PIN en el móvil y tener parking privado en Narón sin dar vueltas hace que no juegue en otro sitio.',
              author: 'Carlos Pita',
              role: 'Jugador Frecuente',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{item.quote}"
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="font-bold text-xs text-slate-900 dark:text-white">{item.author}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Contact & Location Bar */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">¿Listo para jugar tu próximo partido?</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Polígono Industrial Río do Pozo, Narón (A Coruña) · Abierto todos los días de 8:00 a 23:00.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartBooking}
              className="px-6 py-3 rounded-xl bg-white text-emerald-900 font-extrabold text-xs shadow-lg hover:bg-emerald-50 transition"
            >
              Reservar Pista
            </button>
            <button
              onClick={() => {
                setPublicPage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-white font-semibold text-xs border border-emerald-500/40 transition"
            >
              Contacto & Cómo Llegar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
