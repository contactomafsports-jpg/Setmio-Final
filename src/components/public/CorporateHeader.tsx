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
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const mobileLinkClass = (active: boolean) =>
    `w-full flex items-center justify-between py-3.5 px-2.5 rounded-xl text-[15px] transition-colors ${
      active
        ? 'font-bold text-[#0B1A2D] dark:text-[#B7F229] bg-[#F7F9FC] dark:bg-[#0E2239]'
        : 'font-semibold text-[#0B1A2D] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-[#0E2239]/80'
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full max-w-full border-b transition-shadow duration-200 ${
          mobileOpen
            ? 'border-slate-200 dark:border-[#1A314D] bg-white dark:bg-[#0B1A2D] shadow-none'
            : `border-slate-200/80 dark:border-[#1A314D] bg-white/95 dark:bg-[#0B1A2D]/95 backdrop-blur-md ${
                scrolled ? 'shadow-sm shadow-[#0B1A2D]/5 dark:shadow-[#071220]/40' : 'shadow-none'
              }`
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
                onClick={() => {
                  setMobileOpen(false);
                  setLanguageMenuOpen((v) => !v);
                }}
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

            {/* AI Assistant Trigger (punctual violet accent so it does not compete with primary lime CTA) */}
            <button
              type="button"
              onClick={() => {
                closeAll();
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('setmio:toggle-corporate-ai'));
                }
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] text-[#8B5CF6] dark:text-[#A78BFA] hover:border-[#8B5CF6]/60 dark:hover:border-[#8B5CF6]/70 hover:bg-[#8B5CF6]/[0.05] transition-colors cursor-pointer"
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
              <span>{t('nav.demo', 'Ver demo')}</span>
            </button>

            <button
              type="button"
              onClick={onOpenAuth}
              className="hidden lg:inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              aria-label={t('nav.userAccess', 'Acceso')}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('nav.access', 'Acceso')}</span>
            </button>

            <button
              type="button"
              onClick={handleRegisterClick}
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] px-4 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{t('nav.register', 'Registrarse')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => {
                setLanguageMenuOpen(false);
                setSolutionsOpen(false);
                setMobileOpen((v) => !v);
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] text-[#0B1A2D] dark:text-white hover:border-slate-300 dark:hover:border-[#244163] transition-colors lg:hidden cursor-pointer"
              aria-label={mobileOpen ? t('nav.closeMenu', 'Cerrar menú') : t('nav.openMenu', 'Abrir menú')}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Height Opaque Mobile Navigation Drawer (rendered outside <header> so backdrop-filter never clips fixed viewport bounds) */}
      {mobileOpen && (
        <div
          className="fixed inset-x-0 top-16 bottom-0 z-40 flex h-[calc(100dvh-4rem)] flex-col bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.mobileMenu', 'Menú móvil')}
        >
          {/* Smooth Internal Scrollable Links Area */}
          <nav
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-smooth px-4 sm:px-6 py-3"
            aria-label={t('nav.mobileMenu', 'Menú móvil')}
          >
            <div className="divide-y divide-slate-200/75 dark:divide-[#1A314D]">
              <div className="py-1">
                <a
                  href="/"
                  onClick={(e) => navigate('/', 'home', e)}
                  className={mobileLinkClass(publicPage === 'home')}
                >
                  <span>{t('nav.home', 'Inicio')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                </a>
              </div>

              {/* Solutions Expandable Section */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => setMobileSolutionsOpen((v) => !v)}
                  className={`${mobileLinkClass(isSolutionsActive)} cursor-pointer`}
                  aria-expanded={mobileSolutionsOpen}
                >
                  <span>{t('nav.solutions', 'Soluciones')}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 dark:text-slate-400 transition-transform duration-200 shrink-0 ${
                      mobileSolutionsOpen ? 'rotate-180 text-[#0B1A2D] dark:text-[#B7F229]' : ''
                    }`}
                  />
                </button>

                {mobileSolutionsOpen && (
                  <div className="mt-1 mb-2.5 ml-3 pl-3.5 border-l-2 border-slate-200 dark:border-[#1A314D] space-y-1">
                    <div className="flex items-center justify-between px-2.5 pt-1 pb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Setmio Pro
                      </span>
                      <a
                        href="/soluciones"
                        onClick={(e) => navigate('/soluciones', 'solutions', e)}
                        className="text-[11px] font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:underline"
                      >
                        Ver todas
                      </a>
                    </div>

                    {SETMIO_PRO_SEGMENTS.map((seg) => {
                      const active = publicPage === seg.pageKey;
                      return (
                        <a
                          key={seg.id}
                          href={seg.path}
                          onClick={(e) => navigate(seg.path, seg.pageKey, e)}
                          className={`flex items-center justify-between rounded-xl px-2.5 py-2.5 text-[13px] transition-colors ${
                            active
                              ? 'bg-[#F7F9FC] dark:bg-[#0E2239] font-bold text-[#0B1A2D] dark:text-[#B7F229]'
                              : 'font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0E2239]/70 hover:text-[#0B1A2D] dark:hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <span className="font-mono text-[10px] font-semibold text-slate-400 dark:text-slate-500 tabular-nums shrink-0">
                              {seg.order}
                            </span>
                            <span className="truncate">{seg.shortTitle}</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                        </a>
                      );
                    })}

                    <div className="pt-2 mt-2 border-t border-slate-200/80 dark:border-[#1A314D]">
                      <a
                        href="/para-jugadores"
                        onClick={(e) => navigate('/para-jugadores', 'players_app', e)}
                        className={`flex items-center justify-between rounded-xl px-2.5 py-2.5 transition-colors ${
                          publicPage === 'players_app'
                            ? 'bg-[#0B1A2D] text-white dark:bg-[#132A45]'
                            : 'bg-[#F7F9FC] dark:bg-[#0E2239] hover:bg-slate-100 dark:hover:bg-[#132A45]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div
                            className={`text-[13px] font-bold ${
                              publicPage === 'players_app'
                                ? 'text-[#B7F229]'
                                : 'text-[#0B1A2D] dark:text-white'
                            }`}
                          >
                            Setmio Player
                          </div>
                          <div
                            className={`text-[11px] truncate ${
                              publicPage === 'players_app'
                                ? 'text-slate-300'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            Estadísticas, análisis y clubes
                          </div>
                        </div>
                        <ArrowRight
                          className={`w-3.5 h-3.5 shrink-0 ${
                            publicPage === 'players_app'
                              ? 'text-[#B7F229]'
                              : 'text-[#0B1A2D] dark:text-[#B7F229]'
                          }`}
                        />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="py-1">
                <a
                  href="/modulos"
                  onClick={(e) => navigate('/modulos', 'features', e)}
                  className={mobileLinkClass(publicPage === 'features')}
                >
                  <span>{t('nav.features', 'Funcionalidades')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                </a>
              </div>

              <div className="py-1">
                <a
                  href="/domotica"
                  onClick={(e) => navigate('/domotica', 'modules', e)}
                  className={mobileLinkClass(publicPage === 'modules')}
                >
                  <span>{t('nav.domotica', 'Domótica')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                </a>
              </div>

              <div className="py-1">
                <a
                  href="/precios"
                  onClick={(e) => navigate('/precios', 'pricing', e)}
                  className={mobileLinkClass(publicPage === 'pricing')}
                >
                  <span>{t('nav.pricing', 'Precios')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                </a>
              </div>

              <div className="py-1">
                <a
                  href="/blog"
                  onClick={(e) => navigate('/blog', 'blog', e)}
                  className={mobileLinkClass(publicPage === 'blog' || publicPage === 'article')}
                >
                  <span>{t('nav.blog', 'Blog')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                </a>
              </div>

              <div className="py-1">
                <a
                  href="/contacto"
                  onClick={(e) => navigate('/contacto', 'contact', e)}
                  className={mobileLinkClass(publicPage === 'contact')}
                >
                  <span>{t('nav.contact', 'Contacto')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                </a>
              </div>
            </div>
          </nav>

          {/* Pinned Bottom Action Dock — Opaque Surface, Clear Hierarchy */}
          <div className="shrink-0 border-t border-slate-200/90 dark:border-[#1A314D] bg-[#F7F9FC] dark:bg-[#081424] px-4 sm:px-6 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-2.5">
            <button
              type="button"
              onClick={handleRegisterClick}
              className="w-full min-h-[46px] rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{t('nav.register', 'Registrarse')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  closeAll();
                  onOpenDemo?.();
                }}
                className="min-h-[42px] rounded-xl border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] hover:border-slate-300 dark:hover:border-[#244163] text-[#0B1A2D] dark:text-white px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t('nav.demo', 'Ver demo')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  closeAll();
                  onOpenAuth?.();
                }}
                className="min-h-[42px] rounded-xl border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] hover:border-slate-300 dark:hover:border-[#244163] text-[#0B1A2D] dark:text-white px-3 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{t('nav.access', 'Acceso')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { CorporateFooter } from '../common/CorporateFooter';
