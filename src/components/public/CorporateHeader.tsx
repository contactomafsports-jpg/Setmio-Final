import React from 'react';
import { ArrowRight, BookOpen, CreditCard, Globe, Home, Layers, Lock, Mail, Menu, Moon, Play, Sliders, Sparkles, Sun, X, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../lib/i18n';
import { OfficialFlag } from '../common/OfficialFlag';

interface CorporateHeaderProps {
  onOpenDemo?: () => void;
  onOpenAuth?: () => void;
  onOpenRegister?: () => void;
}

const menuItems = [
  [Home, 'nav.home', 'Inicio', '/'],
  [Layers, 'nav.solutions', 'Soluciones', '/soluciones'],
  [Sliders, 'nav.features', 'Módulos / Funcionalidades', '/modulos'],
  [Zap, 'nav.domotica', 'Domótica & Automatizaciones', '/domotica'],
  [Play, 'nav.demo', 'Ver Demo', '/demo'],
  [CreditCard, 'nav.pricing', 'Precios', '/precios'],
  [BookOpen, 'nav.blog', 'Blog', '/blog'],
  [Mail, 'nav.contact', 'Contacto', '/contacto'],
] as const;

export function CorporateHeader({ onOpenDemo, onOpenAuth, onOpenRegister }: CorporateHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = React.useState(false);
  const langRef = React.useRef<HTMLDivElement>(null);
  const { t, language, setLanguage, corporateTheme, toggleCorporateTheme } = useApp();
  const close = () => setOpen(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault();
    close();
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const handleRegisterClick = () => {
    close();
    window.history.pushState({}, '', '/registro');
    window.dispatchEvent(new PopStateEvent('popstate'));
    onOpenRegister?.();
  };

  React.useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? 'hidden' : previousOverflow;
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  return (
    <header className={`sticky top-0 z-50 w-full max-w-full border-b transition-all duration-200 ${
      scrolled
        ? 'border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm'
        : 'border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xs'
    } text-slate-900 dark:text-white`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => {
            close();
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          className="flex items-center gap-2 font-black tracking-tight text-slate-900 dark:text-white cursor-pointer"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/20">
            S
          </span>
          <span>SETMIO</span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          <div ref={langRef} className={`relative ${open ? 'hidden lg:block' : 'block'}`}>
            <button
              type="button"
              onClick={() => setLanguageMenuOpen((value) => !value)}
              aria-expanded={languageMenuOpen}
              aria-label={t('nav.language', 'Idioma')}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
            >
              <OfficialFlag code={language} />
              <span className="hidden sm:inline uppercase text-[11px] font-mono">{language}</span>
            </button>
            {languageMenuOpen && (
              <div className="absolute right-0 top-11 z-50 grid w-52 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                {SUPPORTED_LANGUAGES.map((item) => (
                  <button
                    type="button"
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setLanguageMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-bold hover:bg-emerald-50 dark:hover:bg-slate-800 ${
                      language === item.code
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <OfficialFlag code={item.code as SupportedLanguage} />
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleCorporateTheme}
            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
            aria-label={corporateTheme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}
          >
            {corporateTheme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={onOpenAuth}
            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
            aria-label={t('nav.userAccess', 'Acceso Usuarios / Socios')}
            title={t('nav.userAccess', 'Acceso Usuarios / Socios')}
          >
            <Lock className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer lg:hidden"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-3 xl:gap-4 text-xs font-bold lg:flex text-slate-700 dark:text-slate-300" aria-label={t('nav.mainNav', 'Navegación principal')}>
          <a href="/" onClick={(event) => navigate(event, '/')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {t('nav.home', 'Inicio')}
          </a>
          <a href="/soluciones" onClick={(event) => navigate(event, '/soluciones')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {t('nav.solutions', 'Soluciones')}
          </a>
          <a href="/modulos" onClick={(event) => navigate(event, '/modulos')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {t('nav.features', 'Módulos')}
          </a>
          <a href="/domotica" onClick={(event) => navigate(event, '/domotica')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {t('nav.domotica', 'Domótica')}
          </a>
          <button
            type="button"
            onClick={onOpenDemo}
            className="rounded-lg bg-emerald-600/10 hover:bg-emerald-600 hover:text-white text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 transition-colors font-bold cursor-pointer"
          >
            {t('nav.demo', 'Ver Demo')}
          </button>
          <a href="/precios" onClick={(event) => navigate(event, '/precios')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {t('nav.pricing', 'Precios')}
          </a>
          <a href="/blog" onClick={(event) => navigate(event, '/blog')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {t('nav.blog', 'Blog')}
          </a>
          <a href="/contacto" onClick={(event) => navigate(event, '/contacto')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {t('nav.contact', 'Contacto')}
          </a>
          <button
            type="button"
            onClick={onOpenAuth}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-slate-800 dark:text-slate-100 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('nav.userAccess', 'Acceso Usuarios / Socios')}</span>
          </button>
        </nav>
      </div>
      {open && <div className="fixed inset-0 top-16 overscroll-none bg-slate-950/40" onClick={close}>
        <nav className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-white p-5 shadow-2xl dark:bg-slate-950 text-slate-900 dark:text-slate-100" onClick={(event) => event.stopPropagation()} aria-label={t('nav.mobileMenu', 'Menú móvil')}>
          <div className="grid gap-1 text-sm font-bold">
            {menuItems.map(([Icon, key, label, href]) => {
              if (key === 'nav.demo') {
                return (
                  <button key={key} type="button" onClick={() => { close(); onOpenDemo?.(); }} className="flex items-center justify-between rounded-xl p-3 text-left text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-900">
                    <span className="flex items-center gap-3"><Icon className="h-4 w-4 text-emerald-600" />{t(key, label)}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </button>
                );
              }
              return href ? (
                <a key={key} onClick={(event) => navigate(event, href)} href={href} className="flex items-center justify-between rounded-xl p-3 text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-900">
                  <span className="flex items-center gap-3"><Icon className="h-4 w-4 text-emerald-600" />{t(key, label)}</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </a>
              ) : null;
            })}
          </div>
          <div className="mt-4 grid gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <button type="button" onClick={() => setLanguageMenuOpen((value) => !value)} className="flex items-center justify-between rounded-xl p-3 text-left text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900" aria-expanded={languageMenuOpen}><span className="flex items-center gap-3"><Globe className="h-4 w-4 text-emerald-600" /><OfficialFlag code={language} /> {t('nav.language', 'Idioma')}: {SUPPORTED_LANGUAGES.find((item) => item.code === language)?.name ?? t('language.es', 'Español')}</span><span>⌄</span></button>{languageMenuOpen && <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2 dark:bg-slate-900">{SUPPORTED_LANGUAGES.map((item) => <button type="button" key={item.code} onClick={() => { setLanguage(item.code); setLanguageMenuOpen(false); }} className={`rounded-lg px-2 py-2 text-left text-xs font-bold hover:bg-emerald-100 dark:hover:bg-slate-800 ${language === item.code ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}><OfficialFlag code={item.code} /> <span className="ml-1">{item.name}</span></button>)}</div>}
            <button type="button" onClick={handleRegisterClick} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white">{t('nav.register', 'Registrarse')} <ArrowRight className="ml-1 inline h-4 w-4" /></button>
            <button type="button" onClick={() => { close(); onOpenAuth?.(); }} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition"><Lock className="mr-2 inline h-4 w-4 text-emerald-600" />{t('nav.userAccess', 'Acceso Usuarios / Socios')}</button>
          </div>
        </nav>
      </div>}
    </header>
  );
}

export { CorporateFooter } from '../common/CorporateFooter';
