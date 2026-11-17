import React from 'react';
import { useApp } from '../../context/AppContext';
import playerPadelImg from '../../assets/images/player_padel_action_1794872242959.jpg';
import {
  Trophy,
  Download,
  ShoppingBag,
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
    <div className="bg-white dark:bg-[#0B1A2D] space-y-20 pb-24 text-[#0B1A2D] dark:text-slate-100 transition-colors">
      {/* 1. Athlete Hero */}
      <section className="bg-[#0B1A2D] text-white py-14 lg:py-20 border-b border-[#1A314D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-[#B7F229] font-semibold text-xs tracking-wide">
                <Trophy className="w-4 h-4 shrink-0" />
                <span>{currentTenant.branding.badgeText || 'CIRCUITO PROFESIONAL FIP'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-white leading-[1.08] text-balance">
                {currentTenant.branding.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                {currentTenant.branding.heroSubtitle}
              </p>

              {/* Player KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-[#1A314D]">
                <div>
                  <span className="text-slate-400 text-xs block">FIP Ranking</span>
                  <div className="text-2xl font-bold text-[#B7F229] font-mono tabular-nums mt-0.5">
                    #{stats.fipRanking}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Títulos</span>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums mt-0.5">
                    {stats.titlesCount}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Victorias</span>
                  <div className="text-2xl font-bold text-[#a78bfa] font-mono tabular-nums mt-0.5">
                    {stats.matchesWon}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Pareja</span>
                  <div className="text-sm font-bold text-white truncate pt-1.5">{stats.partnerName}</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => triggerDemoToast('Media Kit', `Descargando dossier comercial y estadísticas oficiales de ${currentTenant.name}.`, 'info')}
                  className="min-h-[44px] px-6 py-3 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Descargar Media Kit 2026</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPublicPage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-5 py-3 rounded-xl bg-[#0E2239] hover:bg-[#132A45] text-white font-semibold text-sm border border-[#1A314D] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Contacto Patrocinios
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-[#1A314D] bg-[#0E2239] shadow-2xl">
                <img
                  src={currentTenant.branding.heroImageUrl || playerPadelImg}
                  alt={currentTenant.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D] via-[#0B1A2D]/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white text-xs">
                  <div className="font-bold text-base">{currentTenant.name}</div>
                  <div className="text-[#B7F229] font-medium mt-0.5">Pala Oficial: {stats.racketModel}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Official Sponsors Showcase */}
      {currentTenant.sponsors && currentTenant.sponsors.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left sm:text-center space-y-2 mb-8">
            <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide">
              Marcas & Patrocinadores
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight">
              Apoyo Oficial en el Circuito Mundial
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {currentTenant.sponsors.map((s) => (
              <div
                key={s.id}
                className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-center space-y-2"
              >
                <div className="text-lg font-bold tracking-widest text-[#0B1A2D] dark:text-white font-mono">
                  {s.logoText}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{s.category}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Upcoming Premier Padel Calendar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide">
              Calendario FIP / Premier
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight mt-1">
              Próximos Torneos Oficiales
            </h2>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">Temporada 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingTournaments.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3"
            >
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="font-semibold font-mono tabular-nums text-[#8B5CF6] dark:text-[#a78bfa]">
                  {item.date}
                </span>
                <span className="font-semibold text-[#0B1A2D] dark:text-[#B7F229]">
                  {item.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">{item.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Personal Shop Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1A2D] border border-[#1A314D] text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2.5 max-w-lg">
            <span className="text-xs font-semibold text-[#B7F229] tracking-wide">Tienda Oficial del Jugador</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Consigue la Equipación y Pala Oficial
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Pala Bullpadel Vertex 04 con diseño exclusivo para competición internacional, muñequeras y camisetas firmadas en edición limitada.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setPublicPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="min-h-[44px] px-6 py-3 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-sm flex items-center gap-2 shrink-0 transition-colors cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Ver Colección Oficial</span>
          </button>
        </div>
      </section>
    </div>
  );
};
