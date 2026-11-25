import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Globe,
  Lock,
  Menu,
  Moon,
  Play,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { useApp, PublicPage } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../lib/i18n';
import { i18n } from '../../i18n';
import { OfficialFlag } from '../common/OfficialFlag';
import { SetmioLogo } from '../common/SetmioLogo';
import { SETMIO_PRO_SEGMENTS } from './corporate/corporateData';

interface CorporateHeaderProps {
  onOpenDemo?: () => void;
  onOpenAuth?: () => void;
  onOpenRegister?: () => void;
}

export function CorporateHeader({ onOpenDemo, onOpenAuth, onOpenRegister }: CorporateHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);

  const {
    t,
    language,
    setLanguage,
    corporateTheme,
    toggleCorporateTheme,
    publicPage,
    setPublicPage,
  } = useApp();

  const closeAll = () => {
    setMobileOpen(false);
    setSolutionsOpen(false);
    setLanguageMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? 'hidden' : previousOverflow;
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const navigate = (path: string, page?: PublicPage, event?: React.MouseEvent) => {
    event?.preventDefault();
    closeAll();
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    if (page) setPublicPage(page);
  };

  const handleRegisterClick = () => {
    closeAll();
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/registro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    onOpenRegister?.();
  };

  const isSolutionsActive =
    publicPage === 'solutions' ||
    publicPage === 'solution_clubs' ||
    publicPage === 'solution_schools' ||
    publicPage === 'solution_coaches' ||
    publicPage === 'solution_councils' ||
    publicPage === 'solution_federations' ||
    publicPage === 'solution_teams' ||
    publicPage === 'solution_pro_players' ||
    publicPage === 'players_app';

  const navLinkClass = (active: boolean) =>
    `relative py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
      active
        ? 'text-[#0B1A2D] dark:text-white after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-[#0B1A2D] dark:after:bg-[#B7F229]'
        : 'text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full max-w-full border-b border-slate-200/80 dark:border-[#1A314D] bg-white/95 dark:bg-[#0B1A2D]/95 backdrop-blur-md transition-shadow duration-200 ${
        scrolled ? 'shadow-sm shadow-[#0B1A2D]/5 dark:shadow-[#071220]/40' : 'shadow-none'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => navigate('/', 'home')}
          className="flex items-center cursor-pointer focus:outline-none shrink-0"
          title="Setmio Pádel — Plataforma SaaS"
        >
          <SetmioLogo variant="horizontal" size="sm" showSubtitle={true} />
        </button>

        {/* Desktop Center Navigation */}
        <nav
          className="hidden lg:flex items-center gap-6"
          aria-label={t('nav.mainNav', 'Navegación principal')}
        >
          <a
            href="/"
            onClick={(e) => navigate('/', 'home', e)}
            className={navLinkClass(publicPage === 'home')}
          >
            {t('nav.home', 'Inicio')}
          </a>

          {/* Solutions Dropdown (L1 + L2) */}
          <div ref={solutionsRef} className="relative">
            <button
              type="button"
              onClick={() => setSolutionsOpen((v) => !v)}
              aria-expanded={solutionsOpen}
              className={`inline-flex items-center gap-1 cursor-pointer ${navLinkClass(isSolutionsActive)}`}
            >
              <span>{t('nav.solutions', 'Soluciones')}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  solutionsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {solutionsOpen && (
              <div className="absolute left-0 top-10 z-50 w-[340px] rounded-2xl border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] p-3 shadow-xl shadow-[#0B1A2D]/10 dark:shadow-[#040B14]/60">
                <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Setmio Pro · Gestión Profesional
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/soluciones', 'solutions')}
                    className="text-[11px] font-semibold text-[#0B1A2D] dark:text-[#B7F229] hover:underline cursor-pointer"
                  >
                    Ver todas
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-0.5">
                  {SETMIO_PRO_SEGMENTS.map((seg) => (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => navigate(seg.path, seg.pageKey)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium text-[#0B1A2D] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#132A45] transition-colors cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                          {seg.order}
                        </span>
                        <span className="font-semibold group-hover:text-[#0B1A2D] dark:group-hover:text-[#B7F229]">
                          {seg.shortTitle}
                        </span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-[#0B1A2D] dark:group-hover:text-[#B7F229] transition-colors" />
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#1A314D]">
                  <button
                    type="button"
                    onClick={() => navigate('/para-jugadores', 'players_app')}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left bg-[#F7F9FC] dark:bg-[#0B1A2D] hover:border-[#B7F229]/60 border border-transparent transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#0B1A2D] dark:text-white">
                        Setmio Player
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Estadísticas, análisis e historial con tu club
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <a
            href="/modulos"
            onClick={(e) => navigate('/modulos', 'features', e)}
            className={navLinkClass(publicPage === 'features')}
          >
            {t('nav.features', 'Módulos')}
          </a>

          <a
            href="/domotica"
            onClick={(e) => navigate('/domotica', 'modules', e)}
            className={navLinkClass(publicPage === 'modules')}
          >
            {t('nav.domotica', 'Domótica')}
          </a>

          <a
            href="/precios"
            onClick={(e) => navigate('/precios', 'pricing', e)}
            className={navLinkClass(publicPage === 'pricing')}
          >
            {t('nav.pricing', 'Precios')}
          </a>

          <a
            href="/blog"
            onClick={(e) => navigate('/blog', 'blog', e)}
            className={navLinkClass(publicPage === 'blog' || publicPage === 'article')}
          >
            {t('nav.blog', 'Blog')}
          </a>

          <a
            href="/contacto"
            onClick={(e) => navigate('/contacto', 'contact', e)}
            className={navLinkClass(publicPage === 'contact')}
          >
            {t('nav.contact', 'Contacto')}
          </a>
        </nav>

        {/* Desktop & Mobile Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Switcher */}
          <div ref={langRef} className="relative">
            <button
              type="button"
              onClick={() => setLanguageMenuOpen((v) => !v)}
              aria-expanded={languageMenuOpen}
              aria-label={t('nav.language', 'Idioma')}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] px-2.5 text-xs font-semibold text-[#0B1A2D] dark:text-slate-200 hover:border-slate-300 dark:hover:border-[#244163] transition-colors cursor-pointer"
            >
              <OfficialFlag code={language} />
              <span className="hidden sm:inline uppercase font-mono text-[11px]">{language}</span>
            </button>

            {languageMenuOpen && (
              <div className="absolute right-0 top-11 z-50 grid w-48 gap-1 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] p-1.5 shadow-xl">
                {SUPPORTED_LANGUAGES.map((item) => (
                  <button
                    type="button"
                    key={item.code}
                    onClick={() => {
                      i18n.changeLanguage(item.code);
                      setLanguage(item.code);
                      setLanguageMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-colors cursor-pointer ${
                      language === item.code
                        ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                        : 'text-[#0B1A2D] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#132A45]'
                    }`}
                  >
                    <OfficialFlag code={item.code as SupportedLanguage} />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleCorporateTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] text-[#0B1A2D] dark:text-slate-200 hover:border-slate-300 dark:hover:border-[#B7F229]/50 transition-colors cursor-pointer"
            aria-label={corporateTheme === 'dark' ? t('nav.themeLight', 'Modo claro') : t('nav.themeDark', 'Modo oscuro')}
            title={corporateTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {corporateTheme === 'dark' ? <Sun className="h-4 w-4 text-[#B7F229]" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* AI Assistant Trigger (cleanly anchored in top bar next to Language & Theme) */}
          <button
            type="button"
            onClick={() => {
              closeAll();
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('setmio:toggle-corporate-ai'));
              }
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] text-[#0B1A2D] dark:text-[#B7F229] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/60 transition-colors cursor-pointer"
            aria-label={t('nav.aiAssistant', 'Abrir Asistente IA Setmio')}
            title={t('nav.aiAssistant', 'Asistente IA Setmio')}
          >
            <Sparkles className="h-4 w-4" />
          </button>

          {/* Desktop Action Buttons */}
          <button
            type="button"
            onClick={onOpenDemo}
            className="hidden xl:inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] px-3 text-xs font-semibold text-[#0B1A2D] dark:text-slate-200 hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{t('nav.demo', 'Demo')}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAuth}
            className="hidden lg:inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            aria-label={t('nav.userAccess', 'Acceso')}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{t('nav.loginShort', 'Acceso')}</span>
          </button>

          <button
            type="button"
            onClick={handleRegisterClick}
            className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] px-4 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{t('nav.register', 'Empezar')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/90 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white lg:hidden cursor-pointer"
            aria-label={mobileOpen ? t('nav.closeMenu', 'Cerrar menú') : t('nav.openMenu', 'Abrir menú')}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-[#071220]/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <nav
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-slate-200 dark:border-[#1A314D] bg-white dark:bg-[#0B1A2D] p-5 text-[#0B1A2D] dark:text-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
            aria-label={t('nav.mobileMenu', 'Menú móvil')}
          >
            <div className="space-y-1">
              <a
                href="/"
                onClick={(e) => navigate('/', 'home', e)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-[#0E2239]"
              >
                <span>{t('nav.home', 'Inicio')}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>

              <div>
                <button
                  type="button"
                  onClick={() => setMobileSolutionsOpen((v) => !v)}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-[#0E2239] cursor-pointer"
                  aria-expanded={mobileSolutionsOpen}
                >
                  <span>{t('nav.solutions', 'Soluciones')}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      mobileSolutionsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileSolutionsOpen && (
                  <div className="ml-3 pl-3 border-l border-slate-200 dark:border-[#1A314D] space-y-1 my-1">
                    <a
                      href="/soluciones"
                      onClick={(e) => navigate('/soluciones', 'solutions', e)}
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229]"
                    >
                      Todas las soluciones Setmio Pro
                    </a>
                    {SETMIO_PRO_SEGMENTS.map((seg) => (
                      <a
                        key={seg.id}
                        href={seg.path}
                        onClick={(e) => navigate(seg.path, seg.pageKey, e)}
                        className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white"
                      >
                        {seg.order}. {seg.shortTitle}
                      </a>
                    ))}
                    <a
                      href="/para-jugadores"
                      onClick={(e) => navigate('/para-jugadores', 'players_app', e)}
                      className="block rounded-lg px-3 py-2 text-xs font-semibold text-[#0B1A2D] dark:text-white"
                    >
                      Setmio Player (Jugadores)
                    </a>
                  </div>
                )}
              </div>

              <a
                href="/modulos"
                onClick={(e) => navigate('/modulos', 'features', e)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-[#0E2239]"
              >
                <span>{t('nav.features', 'Módulos y Funcionalidades')}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>

              <a
                href="/domotica"
                onClick={(e) => navigate('/domotica', 'modules', e)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-[#0E2239]"
              >
                <span>{t('nav.domotica', 'Domótica y Accesos')}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>

              <a
                href="/precios"
                onClick={(e) => navigate('/precios', 'pricing', e)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-[#0E2239]"
              >
                <span>{t('nav.pricing', 'Precios')}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>

              <a
                href="/blog"
                onClick={(e) => navigate('/blog', 'blog', e)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-[#0E2239]"
              >
                <span>{t('nav.blog', 'Blog')}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>

              <a
                href="/contacto"
                onClick={(e) => navigate('/contacto', 'contact', e)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-[#0E2239]"
              >
                <span>{t('nav.contact', 'Contacto')}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            <div className="mt-5 pt-5 border-t border-slate-200 dark:border-[#1A314D] grid gap-2.5">
              <button
                type="button"
                onClick={handleRegisterClick}
                className="w-full min-h-[44px] rounded-xl bg-[#B7F229] text-[#0B1A2D] px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('nav.register', 'Empezar prueba de 30 días')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    closeAll();
                    onOpenDemo?.();
                  }}
                  className="min-h-[42px] rounded-xl border border-slate-200 dark:border-[#1A314D] px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{t('nav.demo', 'Ver Demo')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeAll();
                    onOpenAuth?.();
                  }}
                  className="min-h-[42px] rounded-xl border border-slate-200 dark:border-[#1A314D] px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t('nav.loginShort', 'Acceso')}</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export { CorporateFooter } from '../common/CorporateFooter';
