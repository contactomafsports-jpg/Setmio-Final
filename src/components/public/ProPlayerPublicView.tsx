import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Award,
  Calendar,
  Download,
  Share2,
  Mail,
  Instagram,
  ShoppingBag,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';

export const ProPlayerPublicView: React.FC = () => {
  const { currentTenant, triggerDemoToast, setPublicPage } = useApp();
  const stats = currentTenant.proPlayerStats || {
    fipRanking: 18,
    premierRanking: 14,
    titlesCount: 4,
    matchesWon: 142,
    matchesPlayed: 186,
    partnerName: 'Juan Tello Jr.',
    dominantHand: 'Diestro',
    position: 'Revés',
    racketModel: 'Bullpadel Vertex 04 Custom',
  };

  const upcomingTournaments = [
    { name: 'Madrid Premier Padel P1', date: '14 - 20 Octubre 2026', location: 'WiZink Center, Madrid', status: 'Cuadro Principal' },
    { name: 'Milano Premier Padel P1', date: '04 - 10 Noviembre 2026', location: 'Allianz Cloud, Milán', status: 'Confirmado' },
    { name: 'Barcelona Tour Finals 2026', date: '12 - 17 Diciembre 2026', location: 'Palau Sant Jordi, Barcelona', status: 'Clasificado' },
  ];

  return (
    <div className="space-y-16 pb-16 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Athlete Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 lg:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider border border-red-500/20">
                <Trophy className="w-3.5 h-3.5" />
                <span>{currentTenant.branding.badgeText}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {currentTenant.branding.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed">
                {currentTenant.branding.heroSubtitle}
              </p>

              {/* Player KPI Cards */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">FIP Ranking:</span>
                  <div className="text-2xl font-black text-red-500 font-mono">#{stats.fipRanking}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Títulos:</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats.titlesCount}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Victorias:</span>
                  <div className="text-2xl font-black text-emerald-500 font-mono">{stats.matchesWon}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hidden sm:block">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Pareja:</span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate pt-1">{stats.partnerName}</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => triggerDemoToast('Media Kit', 'Descargando dossier comercial y estadísticas oficiales de Martín Sánchez.', 'info')}
                  className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Media Kit 2026</span>
                </button>
                <button
                  onClick={() => {
                    setPublicPage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs border border-slate-300 dark:border-slate-700 transition"
                >
                  Contacto Patrocinios
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                <img
                  src={currentTenant.branding.heroImageUrl}
                  alt={currentTenant.name}
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white text-xs">
                  <div className="font-bold text-base">{currentTenant.name}</div>
                  <div className="text-slate-300 text-[11px]">Pala Oficial: {stats.racketModel}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Official Sponsors Showcase */}
      {currentTenant.sponsors && currentTenant.sponsors.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Marcas & Patrocinadores</span>
            <h2 className="text-2xl font-black">Apoyo Oficial en el Circuito Mundial</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {currentTenant.sponsors.map((s) => (
              <div
                key={s.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-sm"
              >
                <div className="text-lg font-black tracking-widest text-slate-800 dark:text-slate-100 font-mono">
                  {s.logoText}
                </div>
                <div className="text-[10px] text-slate-500">{s.category}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Upcoming Premier Padel Calendar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Calendario FIP / Premier</span>
            <h2 className="text-2xl font-black">Próximos Torneos Oficiales</h2>
          </div>
          <span className="text-xs text-slate-500">Temporada 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingTournaments.map((t, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-red-500">{t.date}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                  {t.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.name}</h3>
              <p className="text-xs text-slate-500">{t.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Personal Shop Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-lg">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Tienda Oficial del Jugador</span>
            <h2 className="text-2xl sm:text-3xl font-black">Consigue la Equipación y Pala Oficial de Martín</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pala Bullpadel Vertex 04 con diseño exclusivo para competición internacional, muñequeras y camisetas firmadas en edición limitada.
            </p>
          </div>

          <button
            onClick={() => {
              setPublicPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs shadow-xl flex items-center gap-2 shrink-0 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ver Colección Oficial</span>
          </button>
        </div>
      </section>
    </div>
  );
};
