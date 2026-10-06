import React from 'react';
import { useApp } from '../../context/AppContext';
import { Instagram, Facebook, ShieldCheck, Mail, Phone, Lock, ExternalLink } from 'lucide-react';

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

  // Minimized Footer for Auth pages (/login & /registro) to prevent distractions
  if (minimized) {
    return (
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 py-6 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-xs">
              S
            </span>
            <span className="font-black text-slate-900 dark:text-white tracking-tight">{t('footer.brandName', 'SETMIO PADEL PRO')}</span>
            <span className="hidden md:inline text-slate-400">·</span>
            <span className="hidden md:inline text-[11px] text-slate-500">
              {t('footer.tagline', 'Software de marca blanca para clubes y profesionales del pádel.')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>
              {t('footer.copyright', '©')} {new Date().getFullYear()} {t('footer.brandCompany', 'Setmio SaaS.')} {t('footer.allRightsReserved', 'Todos los derechos reservados.')}
            </span>
            <span>·</span>
            <button
              type="button"
              onClick={() => navigateTo('/contacto', 'contact')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            >
              {t('footer.privacy', 'Privacidad & Cookies')}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => navigateTo('/contacto', 'contact')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            >
              {t('footer.legal', 'Aviso Legal')}
            </button>
          </div>
        </div>
      </footer>
    );
  }

  // Full Corporate Footer for Portada (/), Blog (/blog), and Public pages
  return (
    <footer id="contacto" className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Mission Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-500/20">
              S
            </div>
            <span className="text-base font-black text-white tracking-tight">{t('footer.brandName', 'SETMIO PADEL PRO')}</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            {t('footer.description', 'Software de Marca Blanca integral para profesionales del pádel. Incluye Web Pública, App de Gestión Interna, App para Personal y Clientes, y Agente de IA para web y redes.')}
          </p>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{t('footer.infrastructure', 'Desplegado en producción sobre Vercel Edge & Supabase PostgreSQL.')}</span>
          </div>
          {/* Social media links */}
          <div className="flex items-center gap-3 pt-1">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition"
              aria-label={t('footer.instagramAria', 'Instagram oficial')}
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition"
              aria-label={t('footer.facebookAria', 'Facebook oficial')}
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Solutions Column - Separado en Setmio Pro y Setmio Player */}
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-white mb-2 text-xs tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Setmio Pro</span>
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/soluciones/clubes', 'solution_clubs')}
                  className="hover:text-emerald-400 transition text-left"
                >
                  {t('footer.solutionsClubs', 'Para Clubes de Pádel')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/soluciones/escuelas', 'solution_schools')}
                  className="hover:text-emerald-400 transition text-left"
                >
                  {t('footer.solutionsSchools', 'Escuelas & Academias')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/soluciones/profesores', 'solution_coaches')}
                  className="hover:text-emerald-400 transition text-left"
                >
                  {t('footer.solutionsCoaches', 'Profesores & Entrenadores')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/soluciones/jugadores-profesionales', 'solution_pro_players')}
                  className="hover:text-emerald-400 transition text-left"
                >
                  Jugadores Profesionales
                </button>
              </li>
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <h4 className="font-bold text-white mb-2 text-xs tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              <span>Setmio Player</span>
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/para-jugadores', 'players_app')}
                  className="hover:text-cyan-400 transition text-left font-medium text-slate-300"
                >
                  Para Jugadores Particulares (App PWA)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Platform & Modules Column */}
        <div>
          <h4 className="font-bold text-white mb-3 text-sm tracking-wide">
            {t('footer.platformTitle', 'Módulos & Plataforma')}
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <button
                type="button"
                onClick={() => navigateTo('/modulos', 'features')}
                className="hover:text-white transition text-left flex items-center gap-1.5"
              >
                <span className="text-emerald-400 font-bold">·</span>
                <span>Módulos y Funcionalidades</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigateTo('/domotica', 'modules')}
                className="hover:text-white transition text-left flex items-center gap-1.5"
              >
                <span className="text-emerald-400 font-bold">·</span>
                <span>Domótica y Automatizaciones</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigateTo('/precios', 'pricing')}
                className="hover:text-white transition text-left"
              >
                {t('footer.platformPricing', 'Planes & Tarifas')}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigateTo('/blog', 'blog')}
                className="hover:text-white transition text-left"
              >
                {t('footer.platformBlog', 'Blog & Novedades')}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={handleOpenDemo}
                className="hover:text-white transition text-left"
              >
                {t('footer.platformDemo', 'Explorar demo por rol')}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={handleOpenAuth}
                className="hover:text-white transition text-left"
              >
                {t('footer.platformLogin', 'Login Global de Socios')}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={handleOpenRegister}
                className="hover:text-white transition text-left"
              >
                {t('footer.platformRegister', 'Alta de Nuevo Club')}
              </button>
            </li>
          </ul>
        </div>

        {/* Contact & Support Column */}
        <div>
          <h4 className="font-bold text-white mb-3 text-sm tracking-wide">
            {t('footer.contactTitle', 'Contacto & Soporte')}
          </h4>
          <p className="text-[11px] text-slate-400 mb-2">
            {t('footer.contactDirect', 'Atención directa al director del club:')}
          </p>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center gap-2 text-white font-medium">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>contacto@setmio.com</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+34 981 38 00 00</span>
            </div>
            <div className="text-emerald-400 font-semibold pt-1">
              {t('footer.contactSupportActive', 'Soporte técnico 24/7 activo')}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar: Legal, Cookies, SSL, RGPD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
        <div>
          {t('footer.copyrightFull', `© ${new Date().getFullYear()} SETMIO PADEL PRO SaaS. Todos los derechos reservados.`)}
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigateTo('/contacto', 'contact')}
            className="hover:text-slate-300 transition"
          >
            {t('footer.legal', 'Aviso Legal')}
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => navigateTo('/contacto', 'contact')}
            className="hover:text-slate-300 transition"
          >
            {t('footer.privacy', 'Privacidad & Cookies')}
          </button>
          <span>·</span>
          <span>{t('footer.rgpd', 'Cumplimiento RGPD & Certificación SSL')}</span>
        </div>
      </div>
    </footer>
  );
};

export default CorporateFooter;
