import React from 'react';
import { Footer } from '../common/Footer';

export function CorporateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2 font-black tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">S</span> SETMIO</a>
          <nav className="hidden items-center gap-5 text-xs font-bold md:flex" aria-label="Navegación corporativa">
            <a href="/soluciones" className="hover:text-emerald-600">Soluciones</a>
            <a href="/funcionalidades" className="hover:text-emerald-600">Funcionalidades</a>
            <a href="/modulos-domotica" className="hover:text-emerald-600">Módulos y domótica</a>
            <a href="/blog" className="hover:text-emerald-600">Blog</a>
            <a href="/precios" className="hover:text-emerald-600">Precios</a>
            <a href="/demo" className="rounded-lg bg-emerald-600 px-3 py-2 text-white">Ver demo</a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
