import React from 'react';
import { ArrowRight, BookOpen, CreditCard, Globe, Home, Layers, Lock, Mail, Menu, Moon, Play, Sliders, Sparkles, Sun, X } from 'lucide-react';
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
  [Sparkles, 'nav.solutions', 'Soluciones', '/soluciones'],
  [Sliders, 'nav.features', 'Funcionalidades', '/funcionalidades'],
  [Layers, 'nav.modules', 'Módulos y domótica', '/modulos-domotica'],
  [BookOpen, 'nav.blog', 'Blog', '/blog'],
  [Play, 'nav.demo', 'Ver demo', null],
  [CreditCard, 'nav.pricing', 'Precios', '/precios'],
  [Mail, 'nav.contact', 'Contacto', '/contacto'],
] as const;

export function CorporateHeader({ onOpenDemo, onOpenAuth, onOpenRegister }: CorporateHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = React.useState(false);
  const langRef = React.useRef<HTMLDivElement>(null);
  const { t, language, setLanguage, theme, toggleTheme } = useApp();
  const close = () => setOpen(false);
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => { event.preventDefault(); close(); window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  React.useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? 'hidden' : previousOverflow;
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => { close(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="flex items-center gap-2 font-black tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white">S</span> SETMIO
        </button>
        <div className="flex items-center gap-1">
          <div ref={langRef} className={`relative ${open ? 'hidden lg:block' : 'block'}`}><button type="button" onClick={() => setLanguageMenuOpen((value) => !value)} aria-expanded={languageMenuOpen} aria-label={t('nav.language', 'Idioma')} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-900"><OfficialFlag code={language} />{SUPPORTED_LANGUAGES.find((item) => item.code === language)?.name}</button>{languageMenuOpen && <div className="absolute right-0 top-11 z-50 grid w-52 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">{SUPPORTED_LANGUAGES.map((item) => <button type="button" key={item.code} onClick={() => { setLanguage(item.code); setLanguageMenuOpen(false); }} className={`flex items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-bold hover:bg-emerald-50 dark:hover:bg-slate-800 ${language === item.code ? 'bg-emerald-50 text-emerald-700' : ''}`}><OfficialFlag code={item.code as SupportedLanguage} />{item.name}</button>)}</div>}</div>
          <button type="button" onClick={toggleTheme} className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}>{theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
          <button type="button" onClick={onOpenAuth} className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Acceso Usuarios"><Lock className="h-5 w-5" /></button>
          <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-xl p-2 text-slate-700 dark:text-slate-200" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
        <nav className="hidden items-center gap-4 text-xs font-bold lg:flex" aria-label="Navegación corporativa">
          <a href="/soluciones" onClick={(event) => navigate(event, '/soluciones')} className="hover:text-emerald-600">{t('nav.solutions', 'Soluciones')}</a>
          <a href="/funcionalidades" onClick={(event) => navigate(event, '/funcionalidades')} className="hover:text-emerald-600">{t('nav.features', 'Funcionalidades')}</a>
          <a href="/modulos-domotica" onClick={(event) => navigate(event, '/modulos-domotica')} className="hover:text-emerald-600">{t('nav.modules', 'Módulos y domótica')}</a>
          <a href="/blog" onClick={(event) => navigate(event, '/blog')} className="hover:text-emerald-600">{t('nav.blog', 'Blog')}</a>
          <a href="/precios" onClick={(event) => navigate(event, '/precios')} className="hover:text-emerald-600">{t('nav.pricing', 'Precios')}</a>
          <button type="button" onClick={onOpenDemo} className="rounded-lg bg-emerald-600 px-3 py-2 text-white">{t('nav.demo', 'Ver demo')}</button>
        </nav>
      </div>
      {open && <div className="fixed inset-0 top-16 overscroll-none bg-slate-950/40" onClick={close}>
        <nav className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-white p-5 shadow-2xl dark:bg-slate-950" onClick={(event) => event.stopPropagation()} aria-label="Menú corporativo móvil">
          <div className="grid gap-1 text-sm font-bold">
            {menuItems.map(([Icon, key, label, href]) => href ? <a key={key} onClick={(event) => navigate(event, href)} href={href} className="flex items-center justify-between rounded-xl p-3 hover:bg-emerald-50 dark:hover:bg-slate-900"><span className="flex items-center gap-3"><Icon className="h-4 w-4 text-emerald-600" />{t(key, label)}</span><ArrowRight className="h-4 w-4 text-slate-400" /></a> : <button key={key} type="button" onClick={() => { close(); onOpenDemo?.(); }} className="flex items-center justify-between rounded-xl p-3 text-left hover:bg-emerald-50 dark:hover:bg-slate-900"><span className="flex items-center gap-3"><Icon className="h-4 w-4 text-emerald-600" />{t(key, label)}</span><ArrowRight className="h-4 w-4 text-slate-400" /></button>)}
          </div>
          <div className="mt-4 grid gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <button type="button" onClick={() => setLanguageMenuOpen((value) => !value)} className="flex items-center justify-between rounded-xl p-3 text-left text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-900" aria-expanded={languageMenuOpen}><span className="flex items-center gap-3"><Globe className="h-4 w-4 text-emerald-600" /><OfficialFlag code={language} /> {t('nav.language', 'Idioma')}: {SUPPORTED_LANGUAGES.find((item) => item.code === language)?.name ?? t('language.es', 'Español')}</span><span>⌄</span></button>{languageMenuOpen && <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2 dark:bg-slate-900">{SUPPORTED_LANGUAGES.map((item) => <button type="button" key={item.code} onClick={() => { setLanguage(item.code); setLanguageMenuOpen(false); }} className={`rounded-lg px-2 py-2 text-left text-xs font-bold hover:bg-emerald-100 dark:hover:bg-slate-800 ${language === item.code ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : ''}`}><OfficialFlag code={item.code} /> <span className="ml-1">{item.name}</span></button>)}</div>}
            <button type="button" onClick={() => { close(); window.history.pushState({}, '', '/registro'); window.dispatchEvent(new PopStateEvent('popstate')); onOpenRegister?.(); }} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white">{t('nav.register', 'Registrarse')} <ArrowRight className="ml-1 inline h-4 w-4" /></button>
            <button type="button" onClick={() => { close(); onOpenAuth?.(); }} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold dark:border-slate-700"><Lock className="mr-2 inline h-4 w-4 text-emerald-600" />{t('nav.login', 'Acceso Usuarios')}</button>
          </div>
        </nav>
      </div>}
    </header>
  );
}

export function CorporateFooter() { const { t } = useApp(); return <footer className="border-t border-slate-800 bg-slate-950 text-slate-400"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><strong className="text-white">SETMIO</strong><span>{t('footer.tagline', 'Software de marca blanca para clubes y profesionales del pádel.')}</span><span>{t('footer.copyright', '©')} {new Date().getFullYear()} Setmio</span></div></footer>; }
