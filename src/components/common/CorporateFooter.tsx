import React from 'react';
import { useApp } from '../../context/AppContext';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';
import { SetmioLogo } from './SetmioLogo';

interface CorporateFooterProps {
  minimized?: boolean;
}

export const CorporateFooter: React.FC<CorporateFooterProps> = ({ minimized = false }) => {
  const { t, setPublicPage } = useApp();

  const navigateTo = (path: string, page: Parameters<typeof setPublicPage>[0]) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setPublicPage(page);
  };

  const handleOpenAuth = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleOpenRegister = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/registro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleOpenDemo = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/demo');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  if (minimized) {
    return (
      <footer className="border-t border-slate-200/80 dark:border-[#1A314D] bg-white dark:bg-[#0B1A2D] text-slate-500 dark:text-slate-400 py-8 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <SetmioLogo variant="horizontal" size="xs" showSubtitle={true} />
            <span className="hidden md:inline text-slate-300 dark:text-[#1A314D]">|</span>
            <span className="hidden md:inline text-[11px] text-slate-500 dark:text-slate-400">
              {t('footer.tagline', 'Software de marca blanca para clubes y profesionales del pádel.')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>
              {t('footer.copyright', '©')} {new Date().getFullYear()} {t('footer.brandCompany', 'Setmio SaaS.')} {t('footer.allRightsReserved', 'Todos los derechos reservados.')}
            </span>
            <span className="text-slate-300 dark:text-[#1A314D]">·</span>
            <button
              type="button"
              onClick={() => navigateTo('/contacto', 'contact')}
              className="hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition cursor-pointer"
            >
              {t('footer.privacy', 'Privacidad & Cookies')}
            </button>
            <span className="text-slate-300 dark:text-[#1A314D]">·</span>
            <button
              type="button"
              onClick={() => navigateTo('/contacto', 'contact')}
              className="hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition cursor-pointer"
            >
              {t('footer.legal', 'Aviso Legal')}
            </button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer id="contacto" className="bg-[#0B1A2D] text-slate-400 py-20 border-t border-[#1A314D] text-xs relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#8B5CF6]/12 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#B7F229]/6 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Brand & Mission */}
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <SetmioLogo variant="horizontal" size="sm" showSubtitle={true} theme="dark" />
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            {t('footer.description', 'Software de Marca Blanca integral para profesionales del pádel. Incluye Web Pública, App de Gestión Interna, App para Personal y Clientes, y Agente de IA para web y redes.')}
          </p>
          <div className="flex items-center gap-2.5 pt-1">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-[#0E2239] hover:bg-[#132A45] border border-[#1A314D] text-slate-300 hover:text-[#B7F229] flex items-center justify-center transition"
              aria-label={t('footer.instagramAria', 'Instagram oficial')}
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-[#0E2239] hover:bg-[#132A45] border border-[#1A314D] text-slate-300 hover:text-[#B7F229] flex items-center justify-center transition"
              aria-label={t('footer.facebookAria', 'Facebook oficial')}
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Solutions Column */}
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B7F229]" />
              <span>Setmio Pro</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/soluciones/clubes', 'solution_clubs')}
                  className="hover:text-[#B7F229] transition text-left cursor-pointer"
                >
                  {t('footer.solutionsClubs', 'Para Clubes de Pádel')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/soluciones/escuelas', 'solution_schools')}
                  className="hover:text-[#B7F229] transition text-left cursor-pointer"
                >
                  {t('footer.solutionsSchools', 'Escuelas & Academias')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/soluciones/profesores', 'solution_coaches')}
                  className="hover:text-[#B7F229] transition text-left cursor-pointer"
                >
                  {t('footer.solutionsCoaches', 'Profesores & Entrenadores')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/soluciones/jugadores-profesionales', 'solution_pro_players')}
                  className="hover:text-[#B7F229] transition text-left cursor-pointer"
                >
                  Jugadores Profesionales
                </button>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-[#1A314D]">
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              <span>Setmio Player</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/para-jugadores', 'players_app')}
                  className="hover:text-[#a78bfa] transition text-left font-medium text-slate-300 cursor-pointer"
                >
                  Para Jugadores Particulares
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Platform & Modules Column */}
        <div>
          <h4 className="font-semibold text-white mb-3.5 text-xs tracking-wider uppercase">
            {t('footer.platformTitle', 'Módulos & Plataforma')}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                type="button"
                onClick={() => navigateTo('/modulos', 'features')}
                className="hover:text-white transition text-left flex items-center gap-2 cursor-pointer"
              >
                <span className="text-[#B7F229] font-bold">·</span>
                <span>{t('footer.modulesLink', 'Módulos y Funcionalidades')}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigateTo('/domotica', 'modules')}
                className="hover:text-white transition text-left flex items-center gap-2 cursor-pointer"
              >
                <span className="text-[#8B5CF6] font-bold">·</span>
                <span>{t('footer.domoticaLink', 'Domótica y Automatizaciones')}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigateTo('/precios', 'pricing')}
                className="hover:text-white transition text-left cursor-pointer"
              >
                {t('footer.platformPricing', 'Planes & Tarifas')}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigateTo('/blog', 'blog')}
                className="hover:text-white transition text-left cursor-pointer"
              >
                {t('footer.platformBlog', 'Blog & Novedades')}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={handleOpenDemo}
                className="hover:text-white transition text-left cursor-pointer"
              >
                {t('footer.platformDemo', 'Explorar demo por rol')}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={handleOpenAuth}
                className="hover:text-white transition text-left cursor-pointer"
              >
                {t('footer.platformLogin', 'Login Global de Socios')}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={handleOpenRegister}
                className="hover:text-[#B7F229] transition text-left cursor-pointer font-medium text-slate-200"
              >
                {t('footer.platformRegister', 'Alta de Nuevo Club')}
              </button>
            </li>
          </ul>
        </div>

        {/* Contact & Support Column */}
        <div>
          <h4 className="font-semibold text-white mb-3.5 text-xs tracking-wider uppercase">
            {t('footer.contactTitle', 'Contacto & Soporte')}
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            {t('footer.contactDirect', 'Atención directa al director del club:')}
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2.5 text-white font-medium">
              <Mail className="w-4 h-4 text-[#B7F229] shrink-0" />
              <span>contacto@setmio.com</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <Phone className="w-4 h-4 text-[#8B5CF6] shrink-0" />
              <span className="font-mono tabular-nums">+34 981 38 00 00</span>
            </div>
            <div className="text-[#B7F229] font-semibold pt-1.5 text-[11px] tracking-wide">
              {t('footer.contactSupportActive', 'Soporte técnico 24/7 activo')}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 pt-7 border-t border-[#1A314D] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-400">
        <div>
          {t('footer.copyrightFull', `© ${new Date().getFullYear()} SETMIO PADEL PRO SaaS. Todos los derechos reservados.`)}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigateTo('/contacto', 'contact')}
            className="hover:text-white transition cursor-pointer"
          >
            {t('footer.legal', 'Aviso Legal')}
          </button>
          <span className="text-[#1A314D]">·</span>
          <button
            type="button"
            onClick={() => navigateTo('/contacto', 'contact')}
            className="hover:text-white transition cursor-pointer"
          >
            {t('footer.privacy', 'Privacidad & Cookies')}
          </button>
          <span className="text-[#1A314D]">·</span>
          <span>{t('footer.rgpd', 'Cumplimiento RGPD & Certificación SSL')}</span>
        </div>
      </div>
    </footer>
  );
};

export default CorporateFooter;
