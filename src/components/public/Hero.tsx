import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Play,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface HeroProps {
  onOpenDemo?: () => void;
  onOpenRegister?: () => void;
  onOpenFeatures?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenDemo,
  onOpenRegister,
  onOpenFeatures,
}) => {
  const { currentTenant, t } = useApp();

  const heroImage =
    currentTenant?.branding?.heroImageUrl ||
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=2000&q=85';

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-slate-950 border-b border-slate-800 text-white">
      {/* 1. Imagen / Vídeo de fondo de la pista de pádel original (visible y nítida) */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url('${heroImage}')` }}
        aria-hidden="true"
      />

      {/* 2. Overlay oscuro constante y estética Glassmorphism oscuro (independiente de si el tema global es light o dark) */}
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px]" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/50 to-slate-950" aria-hidden="true" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.25),transparent_65%)] pointer-events-none" aria-hidden="true" />

      {/* 3. Contenedor central Glassmorphic con textos siempre blancos y slate-200 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/15 bg-slate-950/70 px-5 py-8 sm:px-8 sm:py-10 backdrop-blur-xl shadow-2xl space-y-6 text-white">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{t('home.corporate.trustBadge', 'Tecnología de Vanguardia para la Industria del Pádel')}</span>
          </div>

          {/* Título Principal - SIEMPRE BLANCO */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] text-balance drop-shadow-md">
            {t('corporate.heroTitle', 'Software de Marca Blanca integral para profesionales del pádel.')}
          </h1>

          {/* Subtítulo Secundario - SIEMPRE SLATE-200 / BLANCO */}
          <p className="text-base sm:text-xl text-slate-200 max-w-3xl mx-auto font-normal leading-relaxed text-balance drop-shadow-xs">
            {t('home.corporate.heroSubtitle', 'Incluye Web Pública, App de Gestión Interna, App para Personal y Clientes, y Agente de IA para web y redes.')}
          </p>

          {/* Botones de Acción / CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenFeatures}
              className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm shadow-xl backdrop-blur-md transition hover:scale-[1.02] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{t('home.hero.discover_features', 'Descubrir funcionalidades')}</span>
            </button>

            <button
              type="button"
              onClick={onOpenDemo}
              className="px-7 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 transition hover:scale-[1.02] flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{t('nav.demo', 'Ver demo')}</span>
            </button>

            <button
              type="button"
              onClick={onOpenRegister}
              className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 shadow-md transition hover:scale-[1.02] flex items-center gap-2"
            >
              <span>{t('nav.register', 'Registrarse')}</span>
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>

          {/* Micro-garantías en slate-200 */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-200 font-semibold pt-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t('home.corporate.guarantee1', 'Sin permanencia')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t('home.corporate.guarantee2', 'Migración de datos en 24h')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t('home.corporate.guarantee3', 'Soporte personalizado 365 días')}
            </span>
          </div>
        </div>

        {/* Mockup de Plataforma con Vidrio Oscuro */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950/80 backdrop-blur-md p-2 sm:p-4">
            <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-mono text-[11px] ml-2 text-slate-300">
                    https://tu-club.setmio.app/gestion
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{t('home.corporate.mockup.active', '8 pistas activas · 94% ocupación hoy')}</span>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-slate-900/90 text-left space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Ingresos Hoy</div>
                    <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">1.275,50 €</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Ocupación</div>
                    <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">75% (6/8)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Domótica IoT</div>
                    <div className="text-lg font-black text-amber-400 font-mono mt-0.5">4 Luces ON</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Partidos Hoy</div>
                    <div className="text-lg font-black text-indigo-400 font-mono mt-0.5">18 Reservas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
