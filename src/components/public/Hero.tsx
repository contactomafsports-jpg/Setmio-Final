import React from 'react';
import { useApp } from '../../context/AppContext';
import heroPadelImg from '../../assets/images/hero_padel_club_1794872242820.jpg';
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

  const heroImage = currentTenant?.branding?.heroImageUrl || heroPadelImg;

  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-[#0B1A2D] border-b border-[#1A314D] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url('${heroImage}')` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#071220]/90 via-[#0B1A2D]/85 to-[#0B1A2D]" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
        <div className="mx-auto max-w-4xl space-y-6 text-white">
          <div className="text-xs font-mono uppercase tracking-[0.16em] text-[#B7F229]">
            {t('home.corporate.trustBadge', 'Tecnología de Vanguardia para la Industria del Pádel')}
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08] text-balance">
            {t('corporate.heroTitle', 'Software de Marca Blanca integral para profesionales del pádel.')}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
            {t('home.corporate.heroSubtitle', 'Incluye Web Pública, App de Gestión Interna, App para Personal y Clientes, y Agente de IA para web y redes.')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenDemo}
              className="min-h-[46px] px-7 py-3 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-[#0B1A2D]" />
              <span>{t('nav.demo', 'Ver demo')}</span>
            </button>

            <button
              type="button"
              onClick={onOpenRegister}
              className="min-h-[46px] px-6 py-3 rounded-xl bg-[#0E2239] hover:bg-[#132A45] text-white font-semibold text-sm border border-[#1A314D] transition flex items-center gap-2 cursor-pointer"
            >
              <span>{t('nav.register', 'Registrarse')}</span>
              <ArrowRight className="w-4 h-4 text-[#B7F229]" />
            </button>

            <button
              type="button"
              onClick={onOpenFeatures}
              className="min-h-[46px] px-6 py-3 rounded-xl bg-transparent hover:bg-white/5 border border-white/15 text-slate-200 font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#a78bfa]" />
              <span>{t('home.hero.discover_features', 'Descubrir funcionalidades')}</span>
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-300 pt-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#B7F229]" /> {t('home.corporate.guarantee1', 'Sin permanencia')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#B7F229]" /> {t('home.corporate.guarantee2', 'Migración de datos en 24h')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#B7F229]" /> {t('home.corporate.guarantee3', 'Soporte personalizado 365 días')}
            </span>
          </div>
        </div>

        {/* Clean SaaS Mockup Preview */}
        <div className="pt-4 max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden bg-[#071220] border border-[#1A314D]">
            <div className="px-4 py-3 bg-[#0E2239] border-b border-[#1A314D] flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px] text-slate-300">
                https://tu-club.setmio.app/gestion
              </span>
              <div className="font-mono text-[11px] text-[#B7F229] tabular-nums">
                {t('home.corporate.mockup.active', '8 pistas activas · 94% ocupación hoy')}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#1A314D] text-left text-xs">
              <div className="p-5">
                <div className="text-slate-400 text-[10px] font-mono uppercase">Ingresos Hoy</div>
                <div className="text-lg font-extrabold text-[#B7F229] font-mono tabular-nums mt-1">1.275,50 €</div>
              </div>
              <div className="p-5">
                <div className="text-slate-400 text-[10px] font-mono uppercase">Ocupación</div>
                <div className="text-lg font-extrabold text-white font-mono tabular-nums mt-1">75% (6/8)</div>
              </div>
              <div className="p-5">
                <div className="text-slate-400 text-[10px] font-mono uppercase">Domótica IoT</div>
                <div className="text-lg font-extrabold text-[#a78bfa] font-mono tabular-nums mt-1">4 Luces ON</div>
              </div>
              <div className="p-5">
                <div className="text-slate-400 text-[10px] font-mono uppercase">Partidos Hoy</div>
                <div className="text-lg font-extrabold text-white font-mono tabular-nums mt-1">18 Reservas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
