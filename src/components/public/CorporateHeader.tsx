import React from 'react';
import { Menu, X } from 'lucide-react';

interface CorporateHeaderProps { onOpenDemo?: () => void }

export function CorporateHeader({ onOpenDemo }: CorporateHeaderProps) {
  const [open, setOpen] = React.useState(false);
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
      <nav className="hidden items-center gap-5 text-xs font-bold md:flex" aria-label="Navegación corporativa">
        <a href="/soluciones" className="hover:text-emerald-600">Soluciones</a><a href="/funcionalidades" className="hover:text-emerald-600">Funcionalidades</a><a href="/modulos-domotica" className="hover:text-emerald-600">Módulos y domótica</a><a href="/blog" className="hover:text-emerald-600">Blog</a><a href="/precios" className="hover:text-emerald-600">Precios</a><a href="/demo" className="rounded-lg bg-emerald-600 px-3 py-2 text-white">Ver demo</a>
      </nav>
    </div>
    {open && <div className="fixed inset-0 top-16 overscroll-none bg-slate-950/40 md:hidden" onClick={close}><nav className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-white p-5 shadow-2xl dark:bg-slate-950" onClick={(event) => event.stopPropagation()} aria-label="Menú corporativo móvil"><div className="grid gap-2 text-sm font-bold"><a onClick={close} href="/soluciones" className="rounded-xl p-3 hover:bg-emerald-50 dark:hover:bg-slate-900">Soluciones</a><a onClick={close} href="/funcionalidades" className="rounded-xl p-3 hover:bg-emerald-50 dark:hover:bg-slate-900">Funcionalidades</a><a onClick={close} href="/modulos-domotica" className="rounded-xl p-3 hover:bg-emerald-50 dark:hover:bg-slate-900">Módulos y domótica</a><a onClick={close} href="/blog" className="rounded-xl p-3 hover:bg-emerald-50 dark:hover:bg-slate-900">Blog</a><a onClick={close} href="/precios" className="rounded-xl p-3 hover:bg-emerald-50 dark:hover:bg-slate-900">Precios</a><a onClick={close} href="/contacto" className="rounded-xl p-3 hover:bg-emerald-50 dark:hover:bg-slate-900">Contacto</a></div></nav></div>}
  </header>;
}

export function CorporateFooter() { return <footer className="border-t border-slate-800 bg-slate-950 text-slate-400"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><strong className="text-white">SETMIO</strong><span>Software de marca blanca para clubes y profesionales del pádel.</span><span>© {new Date().getFullYear()} Setmio</span></div></footer>; }
