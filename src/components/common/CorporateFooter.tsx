import React from 'react';
import { useApp, PublicPage } from '../../context/AppContext';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';
import { SetmioLogo } from './SetmioLogo';
import { SETMIO_PRO_SEGMENTS } from '../public/corporate/corporateData';

interface CorporateFooterProps {
  minimized?: boolean;
}

export const CorporateFooter: React.FC<CorporateFooterProps> = ({ minimized = false }) => {
  const { t, setPublicPage } = useApp();

  const navigateTo = (path: string, page: PublicPage) => {
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
      <footer className="border-t border-slate-200/80 dark:border-[#1A314D] bg-white dark:bg-[#0B1A2D] text-slate-500 dark:text-slate-300 py-8 text-xs transition-colors">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <SetmioLogo variant="horizontal" size="sm" showSubtitle={true} theme="auto" />
            <span className="hidden md:inline text-slate-300 dark:text-[#1A314D]">|</span>
            <span className="hidden md:inline text-[11px] text-slate-500 dark:text-slate-300">
              {t('footer.tagline', 'Plataforma de gestión y marca blanca para el ecosistema del pádel.')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>
              © {new Date().getFullYear()} Setmio Pádel Pro. {t('footer.allRightsReserved', 'Todos los derechos reservados.')}
            </span>
            <span className="text-slate-300 dark:text-[#1A314D]">·</span>
            <button
              type="button"
              onClick={() => navigateTo('/legal', 'legal')}
              className="hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition cursor-pointer"
            >
              {t('footer.legalAndPrivacy', 'Aviso Legal y Privacidad')}
            </button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#071220] text-slate-300 py-16 sm:py-20 border-t border-[#1A314D] text-xs">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Column 1: High-contrast white wordmark on dark navy footer */}
          <div className="md:col-span-4 space-y-5">
            <button
              type="button"
              onClick={() => navigateTo('/', 'home')}
              className="inline-flex items-center cursor-pointer focus:outline-none"
              aria-label="Setmio Pádel Inicio"
            >
              <SetmioLogo variant="horizontal" size="md" showSubtitle={true} theme="dark" />
            </button>

            <p className="text-slate-300 leading-relaxed text-xs max-w-xs">
              {t(
                'footer.description',
                'Plataforma SaaS de marca blanca para clubes, escuelas, entrenadores, administraciones públicas, federaciones, equipos y jugadores.'
              )}
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#0B1A2D] hover:bg-[#132A45] border border-[#1A314D] text-slate-200 hover:text-[#B7F229] flex items-center justify-center transition-colors"
                aria-label={t('footer.instagramAria', 'Instagram oficial')}
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#0B1A2D] hover:bg-[#132A45] border border-[#1A314D] text-slate-200 hover:text-[#B7F229] flex items-center justify-center transition-colors"
                aria-label={t('footer.facebookAria', 'Facebook oficial')}
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Setmio Pro & Setmio Player */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <h4 className="font-bold text-white mb-3.5 text-[11px] tracking-[0.14em] uppercase">
                Setmio Pro
              </h4>
              <ul className="space-y-2 text-xs">
                {SETMIO_PRO_SEGMENTS.map((seg) => (
                  <li key={seg.id}>
                    <button
                      type="button"
                      onClick={() => navigateTo(seg.path, seg.pageKey)}
                      className="text-slate-300 hover:text-[#B7F229] transition-colors text-left cursor-pointer"
                    >
                      {seg.shortTitle}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#1A314D]">
              <h4 className="font-bold text-white mb-3 text-[11px] tracking-[0.14em] uppercase">
                Setmio Player
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('/para-jugadores', 'players_app')}
                    className="text-slate-300 hover:text-[#B7F229] transition-colors text-left cursor-pointer"
                  >
                    Experiencia para jugadores
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Plataforma */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-white mb-3.5 text-[11px] tracking-[0.14em] uppercase">
              {t('footer.platformTitle', 'Plataforma')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/modulos', 'features')}
                  className="text-slate-300 hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.modulesLink', 'Módulos')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/domotica', 'modules')}
                  className="text-slate-300 hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.domoticaLink', 'Domótica IoT')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/precios', 'pricing')}
                  className="text-slate-300 hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.platformPricing', 'Precios')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/blog', 'blog')}
                  className="text-slate-300 hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.platformBlog', 'Blog')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleOpenDemo}
                  className="text-slate-300 hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.platformDemo', 'Explorar demo')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleOpenAuth}
                  className="text-slate-300 hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t('footer.platformLogin', 'Acceso usuarios')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleOpenRegister}
                  className="text-[#B7F229] hover:text-[#c5f64e] font-semibold transition-colors text-left cursor-pointer"
                >
                  {t('footer.platformRegister', 'Crear cuenta')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contacto */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-white mb-3.5 text-[11px] tracking-[0.14em] uppercase">
              {t('footer.contactTitle', 'Contacto Directo')}
            </h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {t('footer.contactDirect', 'Atención comercial y técnica directa para clubes y organizaciones.')}
            </p>
            <div className="space-y-3 text-xs">
              <a
                href="mailto:contacto@setmio.com"
                className="flex items-center gap-2.5 text-white hover:text-[#B7F229] transition-colors font-medium"
              >
                <Mail className="w-4 h-4 text-[#B7F229] shrink-0" />
                <span>contacto@setmio.com</span>
              </a>
              <a
                href="tel:+34981380000"
                className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-slate-300 shrink-0" />
                <span className="font-mono tabular-nums">+34 981 38 00 00</span>
              </a>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('/contacto', 'contact')}
                  className="text-xs font-semibold text-[#B7F229] hover:underline cursor-pointer"
                >
                  Solicitar asesoramiento →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-7 border-t border-[#1A314D] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-300">
          <div>
            © {new Date().getFullYear()} SETMIO PÁDEL PRO. {t('footer.allRightsReserved', 'Todos los derechos reservados.')}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigateTo('/legal', 'legal')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.legal', 'Aviso Legal')}
            </button>
            <span className="text-[#244163]">·</span>
            <button
              type="button"
              onClick={() => navigateTo('/legal', 'legal')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.privacy', 'Privacidad y RGPD')}
            </button>
            <span className="text-[#244163]">·</span>
            <button
              type="button"
              onClick={() => navigateTo('/contacto', 'contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.support', 'Soporte')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CorporateFooter;
