import React from 'react';
import { ArrowRight, CheckCircle2, LockKeyhole, Lightbulb, Wifi } from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { useApp } from '../../context/AppContext';

interface ModulosDomoticaPageProps {
  onBack: () => void;
  onOpenDemo: () => void;
}

export function ModulosDomoticaPage({ onBack, onOpenDemo }: ModulosDomoticaPageProps) {
  const { t } = useApp();
  return (
    <section className="min-h-[70vh] bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SubpageHeaderNav onBack={onBack} />
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-emerald-400">{t('modules.eyebrow', 'Módulos y domótica')}</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{t('modules.title', 'Pistas inteligentes, sin complicaciones.')}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300">{t('modules.description', 'Automatiza luces, accesos y operaciones del club desde una única plataforma conectada a tus reservas.')}</p>
          <button type="button" onClick={onOpenDemo} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 hover:bg-emerald-400">{t('nav.demo', 'Ver demo')} <ArrowRight className="h-4 w-4" /></button>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            [Lightbulb, 'Luces automáticas', 'Enciende y apaga cada pista según el calendario real de reservas.'],
            [LockKeyhole, 'Accesos seguros', 'PINs temporales y control de puertas para cada reserva.'],
            [Wifi, 'Telemetría conectada', 'Estado de dispositivos y alertas operativas en tiempo real.'],
          ].map(([Icon, title, description]) => {
            const ModuleIcon = Icon as typeof Lightbulb;
            return <article key={title as string} className="rounded-3xl border border-slate-800 bg-slate-900 p-6"><ModuleIcon className="h-7 w-7 text-emerald-400" /><h2 className="mt-5 text-lg font-black">{title as string}</h2><p className="mt-2 text-sm leading-relaxed text-slate-400">{description as string}</p><CheckCircle2 className="mt-6 h-4 w-4 text-emerald-500" /></article>;
          })}
        </div>
      </div>
    </section>
  );
}
