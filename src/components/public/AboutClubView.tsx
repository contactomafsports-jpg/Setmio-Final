import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Shield,
  Zap,
  Users,
  Coffee,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  ArrowLeft,
  Mail,
} from 'lucide-react';

export const AboutClubView: React.FC = () => {
  const { currentTenant, setPublicPage } = useApp();

  return (
    <div className="space-y-16 pb-20 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. SPECTACULAR TOP HERO / HEADER */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 lg:py-24 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.25),transparent_40%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,23,42,0.75))]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => {
              setPublicPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 hover:text-white backdrop-blur-md transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Inicio</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wider uppercase border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instalaciones Oficiales</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                {currentTenant.name}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                20 años acompañando a padeleros y padeleras. Centro deportivo de referencia con instalaciones
                de alto nivel, ambiente familiar y oferta completa para disfrutar del pádel.
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300 pt-2">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{currentTenant.address}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{currentTenant.contactPhone}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setPublicPage('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl transition flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Pista Ahora</span>
                </button>
                <button
                  onClick={() => {
                    setPublicPage('courts');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition"
                >
                  Ver Catálogo de Pistas
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl h-80 sm:h-96">
                <img
                  src={currentTenant.branding.heroImageUrl}
                  alt={currentTenant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs">
                  <div className="font-bold text-white text-sm">{currentTenant.shortName}</div>
                  <div className="text-emerald-400 font-semibold text-xs mt-0.5">8 pistas, 4 indoor, 3 outdoor (1 individual)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SIMPLIFIED COURT SPECS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-3xl">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Nuestras Instalaciones
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            8 pistas, 4 indoor, 3 outdoor (1 individual)
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Instalaciones acondicionadas para jugar los 365 días del año con la máxima visibilidad, iluminación LED de competición y vestuarios climatizados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Pistas Cubiertas (Indoor)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              4 pistas indoor con 11 metros de altura libre, césped oficial y ausencia total de condensación o viento.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Pistas Outdoor & Individual</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              3 pistas outdoor de alta visibilidad, incluyendo una pista individual reglamentaria 1 vs 1 ideal para entrenamientos técnicos intensivos.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Club Social & Cafetería</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tercer tiempo con vistas a la pista central, pantallas con retransmisiones en directo y aparcamiento privado gratuito de 80 plazas.
            </p>
          </div>
        </div>

        {/* Commitment Checklist */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Servicios integrales en {currentTenant.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Aparcamiento gratuito</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Vestuarios climatizados</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Test de palas en pista</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Desfibrilador DESA</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
