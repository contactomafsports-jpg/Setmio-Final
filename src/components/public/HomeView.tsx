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
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    currentTenant,
    courts,
    tournaments,
    products,
    blogPosts,
    setPublicPage,
    setSelectedArticleId,
    addToCart,
    toggleFavorite,
    isFavorite,
    pageBlocks,
  } = useApp();

  const [quickDate, setQuickDate] = useState('2026-10-01');
  const [quickTime, setQuickTime] = useState('19:00');
  const [quickCourtType, setQuickCourtType] = useState('all');

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const activeTournaments = tournaments.slice(0, 2);
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
    <div className="space-y-16 pb-16 text-slate-100">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              {/* Quiet kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-400">
                <span>{currentTenant.branding.badgeText}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">{currentTenant.city}, Galicia</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                {currentTenant.branding.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                {currentTenant.branding.heroSubtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleStartBooking}
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-extrabold text-slate-950 text-sm shadow-xl shadow-emerald-950/60 flex items-center gap-2 transition hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Pista Ahora</span>
                </button>

                <button
                  onClick={() => {
                    setPublicPage('matches');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 font-semibold text-slate-200 text-sm flex items-center gap-2 transition"
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Partidos Abiertos</span>
                </button>
              </div>

              {/* Key Trust Metrics */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-2xl font-black text-white">8 Pistas</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Césped WPT Oficial</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400">14 Horas</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Apertura Diaria</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-cyan-400">+450</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Jugadores Activos</div>
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
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700 text-xs">
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span className="font-semibold text-white">Pista 1 Central Panorámica</span>
                    <span className="text-emerald-400 font-bold">Disponible Hoy</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Iluminación LED de competición TV y césped Mondo Supercourt XN Azul
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK COURT BOOKING BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Fecha del Partido
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={quickDate}
                  onChange={(e) => setQuickDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Franja Horaria
              </label>
              <select
                value={quickTime}
                onChange={(e) => setQuickTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="17:30">17:30 - 19:00 (Tarde)</option>
                <option value="19:00">19:00 - 20:30 (Hora Punta)</option>
                <option value="20:30">20:30 - 22:00 (Nocturno)</option>
                <option value="10:00">10:00 - 11:30 (Mañana)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Tipo de Pista
              </label>
              <select
                value={quickCourtType}
                onChange={(e) => setQuickCourtType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="all">Todas las 8 Pistas</option>
                <option value="panoramic">Panorámicas WPT (1, 2, 3)</option>
                <option value="single">Individual 1 vs 1 (Pista 7)</option>
              </select>
            </div>

            <div className="pt-2 sm:pt-4">
              <button
                onClick={handleStartBooking}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-xs text-slate-950 flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Calendar className="w-4 h-4" />
                <span>Ver Disponibilidad</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COURTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Instalaciones Profesionales
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              8 Pistas Panorámicas de Última Generación
            </h2>
          </div>

          <button
            onClick={() => {
              setPublicPage('courts');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition group"
          >
            <span>Ver Especificaciones Técnicas</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courts.slice(0, 4).map((court) => (
            <div
              key={court.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden hover:border-slate-700 transition flex flex-col group shadow-lg"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={court.photoUrl}
                  alt={court.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-950/80 backdrop-blur-md text-[11px] font-mono font-bold text-emerald-400 border border-slate-800">
                  {court.hourlyRate.toFixed(2)} €/h
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {court.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{court.surface}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    {court.isPanoramic ? 'Panorámica WPT' : 'Indoor Estándar'}
                  </span>
                  <button
                    onClick={handleStartBooking}
                    className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                  >
                    <span>Reservar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TOURNAMENTS & COMPETITIONS TEASER */}
      <section className="bg-slate-900/60 border-y border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Competición Oficial
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Próximos Torneos y Ligas Sociales
              </h2>
            </div>

            <button
              onClick={() => {
                setPublicPage('tournaments');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition group"
            >
              <span>Ver Calendario Completo</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeTournaments.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-emerald-400 font-semibold">{t.dates}</span>
                    <span>Inscripción: {t.entryFee} €/jugador</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{t.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{t.description}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Premios y Cuadros:</div>
                  <div className="text-slate-200 mt-0.5">{t.prizes}</div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    {t.categories.length} Categorías disponibles
                  </div>
                  <button
                    onClick={() => {
                      setPublicPage('tournaments');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
                  >
                    Inscribir Pareja
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ACADEMY & COACHES TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Escuela Oficial Federada
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Aprende y Compite con Entrenadores Nacionales
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Desde iniciación hasta competición autonómica. Grupos reducidos de máximo 4 alumnos por pista con videoanálisis, seguimiento táctico y torneos internos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Escuela Infantil (8 a 16 años)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Clases Particulares 1 a 1</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Perfeccionamiento de Adultos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Preparación Física de Pádel</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  setPublicPage('academy');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-slate-950 text-xs shadow-lg transition"
              >
                Conocer la Escuela & Tarifas
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                alt="Mateo Varela"
                className="w-full h-44 object-cover"
              />
              <div className="p-3 text-xs">
                <div className="font-bold text-white">Mateo Varela</div>
                <div className="text-[10px] text-emerald-400">Head Coach · Nivel 2 FEP</div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                alt="Laura Senra"
                className="w-full h-44 object-cover"
              />
              <div className="p-3 text-xs">
                <div className="font-bold text-white">Laura Senra</div>
                <div className="text-[10px] text-emerald-400">Entrenadora Competición</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRO SHOP & BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Pro Shop Oficial
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Material Oficial y Novedades de Pádel
            </h2>
          </div>

          <button
            onClick={() => {
              setPublicPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition group"
          >
            <span>Ver Toda la Tienda</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition flex flex-col justify-between group shadow-lg"
            >
              <div className="relative h-52 bg-slate-950 overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => toggleFavorite(p.id)}
                  className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition ${
                    isFavorite(p.id)
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-900/80 text-slate-300 hover:text-white'
                  }`}
                  title="Guardar en favoritos"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
                <div className="absolute bottom-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900/90 text-emerald-400 border border-slate-700">
                  {p.brand}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                  {p.name}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">{p.description}</p>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-black text-white font-mono">{p.price.toFixed(2)} €</div>
                    {p.compareAtPrice && (
                      <div className="text-[10px] text-slate-400 line-through">
                        {p.compareAtPrice.toFixed(2)} €
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(p, 1)}
                    className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow"
                    title="Añadir a la cesta"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. LATEST BLOG POSTS */}
      <section className="bg-slate-900/40 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Actualidad & Consejos
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Blog de Pádel San Mateo
              </h2>
            </div>

            <button
              onClick={() => {
                setPublicPage('blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition group"
            >
              <span>Ver Todos los Artículos</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => handleOpenArticle(article.id)}
                className="cursor-pointer rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden hover:border-slate-700 transition flex flex-col justify-between group shadow-lg"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 text-[10px] font-semibold text-slate-200 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-800">
                    {article.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[10px] text-slate-400 mb-1">
                      {article.author} · {article.readingTime} min lectura
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{article.summary}</p>
                  </div>

                  <div className="pt-2 font-bold text-xs text-emerald-400 flex items-center gap-1">
                    <span>Leer Artículo Completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LOCATION & NARÓN VENUE CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Ubicación Privilegiada
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Instalaciones en Polígono Río do Pozo, Narón
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Fácil acceso desde la autopista AP-9 y autovía Ferrol-Vilalba. Amplio aparcamiento gratuito para más de 80 vehículos y parada de transporte comarcal en la entrada del polígono.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{currentTenant.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{currentTenant.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lunes a Domingo ininterrumpido (08:30 - 23:30)</span>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => {
                  setPublicPage('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition"
              >
                Cómo Llegar & Contacto
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-64 flex items-center justify-center relative">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
              alt="Mapa Narón Pádel San Mateo"
              className="w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/90 text-slate-950 flex items-center justify-center font-black text-lg shadow-xl mb-2">
                SM
              </div>
              <div className="font-bold text-white text-sm">Centro de Pádel San Mateo</div>
              <div className="text-xs text-slate-300">Narón, Ferrolterra (Galicia)</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
