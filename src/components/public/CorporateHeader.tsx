import React from 'react';
import { Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../lib/i18n';

interface CorporateHeaderProps { onOpenDemo?: () => void }

export function CorporateHeader({ onOpenDemo }: CorporateHeaderProps) {
  const [open, setOpen] = React.useState(false);
const { t, language, setLanguage } = useApp();
  React.useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = open ? 'hidden' : previous;
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  const close = () => setOpen(false);
  return <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <a href="/" onClick={close} className="flex items-center gap-2 font-black tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white">S</span> SETMIO</a>
      <button type="button" className="rounded-xl p-2 text-slate-700 dark:text-slate-200 md:hidden" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      <nav className="hidden items-center gap-4 text-xs font-bold md:flex" aria-label="Navegación corporativa">
        <a href="/soluciones" className="hover:text-emerald-600">{t('nav.solutions', 'Soluciones')}</a><a href="/funcionalidades" className="hover:text-emerald-600">{t('nav.features', 'Funcionalidades')}</a><a href="/modulos-domotica" className="hover:text-emerald-600">{t('nav.modules', 'Módulos y domótica')}</a><a href="/blog" className="hover:text-emerald-600">{t('nav.blog', 'Blog')}</a><a href="/precios" className="hover:text-emerald-600">{t('nav.pricing', 'Precios')}</a><button type="button" onClick={onOpenDemo} className="rounded-lg bg-emerald-600 px-3 py-2 text-white">{t('nav.demo', 'Ver demo')}</button><select aria-label="Idioma" value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs dark:border-slate-700 dark:bg-slate-900">{SUPPORTED_LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.code.toUpperCase()}</option>)}</select>
      </nav>
    </div>
    {open && <div className="fixed inset-0 top-16 overscroll-none bg-slate-950/40 md:hidden" onClick={close}><nav className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-white p-5 shadow-2xl dark:bg-slate-950" onClick={(event) => event.stopPropagation()} aria-label="Menú corporativo móvil"><div className="grid gap-2 text-sm font-bold"><a onClick={close} href="/" className="rounded-xl p-3 hover:bg-emerald-50 dark:hover:bg-slate-900">{t('nav.home', 'Inicio')}</a><a onClick={close} href="/soluciones" className="rounded-xl p-3 hover:bg-emerald-50 dark:hover:bg-slate-900">{t('nav.solutions', 'Soluciones')}</a><a onClick={close} href="/funcionalidades" className="rounded-xl p-3 hover:bg-emerald-50 dark:hover:bg-slate-900">{t('nav.features', 'Funcionalidades')}</a><a onClick={close} href="/modulos-domotica" className="rounded-xl p-3 hover:bg-emerald-50 dark:hover:bg-slate-900">{t('nav.modules', 'Módulos y domótica')}</a><a onClick={close} href="/blog" className="rounded-xl p-3 hover:bg-emerald-50 dark:hover:bg-slate-900">{t('nav.blog', 'Blog')}</a><button type="button" onClick={() => { close(); onOpenDemo?.(); }} className="rounded-xl bg-emerald-600 p-3 text-left text-white">{t('nav.demo', 'Ver demo')}</button><a onClick={close} href="/precios" className="rounded-xl p-3 hover:bg-emerald-50 dark:hover:bg-slate-900">{t('nav.pricing', 'Precios')}</a><a onClick={close} href="/contacto" className="rounded-xl p-3 hover:bg-emerald-50 dark:hover:bg-slate-900">{t('nav.contact', 'Contacto')}</a></div></nav></div>}
  </header>;
}

export function CorporateFooter() { const { t } = useApp(); return <footer className="border-t border-slate-800 bg-slate-950 text-slate-400"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><strong className="text-white">SETMIO</strong><span>{t('footer.tagline', 'Software de marca blanca para clubes y profesionales del pádel.')}</span><span>© {new Date().getFullYear()} Setmio</span></div></footer>; }
