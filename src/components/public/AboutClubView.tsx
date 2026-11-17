import React from 'react';
import { useApp } from '../../context/AppContext';
import heroPadelImg from '../../assets/images/hero_padel_club_1794872242820.jpg';
import {
  Zap,
  Coffee,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  Phone,
  ArrowLeft,
} from 'lucide-react';

export const AboutClubView: React.FC = () => {
  const { currentTenant, setPublicPage } = useApp();

  return (
    <div className="bg-white dark:bg-[#0B1A2D] space-y-20 pb-24 text-[#0B1A2D] dark:text-slate-100 transition-colors duration-200">
      {/* 1. HERO HEADER */}
      <section className="bg-[#0B1A2D] text-white py-14 lg:py-20 border-b border-[#1A314D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => {
              setPublicPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="min-h-[40px] inline-flex items-center gap-2 mb-6 px-3.5 py-2 rounded-xl bg-[#0E2239] hover:bg-[#132A45] border border-[#1A314D] text-xs font-semibold text-slate-200 hover:text-[#B7F229] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Inicio</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-[#B7F229] text-xs font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Instalaciones Oficiales</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.08] text-balance">
                {currentTenant.name}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                20 años acompañando a padeleros y padeleras. Centro deportivo de referencia con instalaciones de alto nivel, ambiente familiar y oferta completa para disfrutar del pádel.
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300 pt-1">
                <div className="flex items-center gap-2 bg-[#0E2239] px-3.5 py-2 rounded-xl border border-[#1A314D]">
                  <MapPin className="w-4 h-4 text-[#B7F229] shrink-0" />
                  <span>{currentTenant.address}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#0E2239] px-3.5 py-2 rounded-xl border border-[#1A314D]">
                  <Phone className="w-4 h-4 text-[#B7F229] shrink-0" />
                  <span className="font-mono tabular-nums">{currentTenant.contactPhone}</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPublicPage('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-6 py-3 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Reservar Pista Ahora</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPublicPage('courts');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-5 py-3 rounded-xl bg-[#0E2239] hover:bg-[#132A45] text-white font-semibold text-sm border border-[#1A314D] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Ver Catálogo de Pistas
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#1A314D] bg-[#0E2239] h-80 sm:h-96">
                <img
                  src={currentTenant.branding.heroImageUrl || heroPadelImg}
                  alt={currentTenant.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D] via-[#0B1A2D]/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-xs">
                  <div className="font-bold text-white text-sm">{currentTenant.shortName}</div>
                  <div className="text-[#B7F229] font-medium text-xs mt-0.5">
                    8 pistas, 4 indoor, 3 outdoor (1 individual)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COURT SPECS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide">
            Nuestras Instalaciones
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0B1A2D] dark:text-white tracking-tight text-balance">
            8 pistas, 4 indoor, 3 outdoor (1 individual)
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Instalaciones acondicionadas para jugar los 365 días del año con la máxima visibilidad, iluminación LED de competición y vestuarios climatizados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-[#B7F229] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">Pistas Cubiertas (Indoor)</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              4 pistas indoor con 11 metros de altura libre, césped oficial y ausencia total de condensación o viento.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-[#a78bfa] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">Pistas Outdoor & Individual</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              3 pistas outdoor de alta visibilidad, incluyendo una pista individual reglamentaria 1 vs 1 ideal para entrenamientos técnicos intensivos.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229]/15 text-[#B7F229] flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">Club Social & Cafetería</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Tercer tiempo con vistas a la pista central, pantallas con retransmisiones en directo y aparcamiento privado gratuito de 80 plazas.
            </p>
          </div>
        </div>

        {/* Commitment Checklist */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D]">
          <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white mb-5">
            Servicios integrales en {currentTenant.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              'Aparcamiento gratuito',
              'Vestuarios climatizados',
              'Test de palas en pista',
              'Desfibrilador DESA',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] dark:text-[#B7F229] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
