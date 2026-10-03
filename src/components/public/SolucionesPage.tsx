import React from 'react';
import { ArrowLeft, ArrowRight, Building2, GraduationCap, Users, Trophy } from 'lucide-react';

interface SolucionesPageProps {
  onBack: () => void;
  onOpenDemo: () => void;
}

const solutions = [
  { icon: Building2, title: 'Clubes', text: 'Gestiona reservas, socios, pistas, torneos y operaciones desde una plataforma con tu propia marca.', color: 'text-emerald-600 dark:text-emerald-400' },
  { icon: GraduationCap, title: 'Profesores', text: 'Organiza alumnos, clases, grupos, disponibilidad y cobros sin perder tiempo en tareas administrativas.', color: 'text-cyan-600 dark:text-cyan-400' },
  { icon: Users, title: 'Jugadores', text: 'Descubre partidos, reserva pistas, sigue tu progreso y conecta con la comunidad de tu club.', color: 'text-blue-600 dark:text-blue-400' },
  { icon: Trophy, title: 'Profesionales', text: 'Centraliza tu calendario, objetivos, contenidos y oportunidades comerciales en un perfil profesional.', color: 'text-amber-600 dark:text-amber-400' },
];

export function SolucionesPage({ onBack, onOpenDemo }: SolucionesPageProps) {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <button type="button" onClick={onBack} className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">
          <ArrowLeft className="h-4 w-4" /> Volver a Setmio
        </button>
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">Soluciones Setmio</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Una plataforma para cada protagonista del pádel.</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">Conecta la operación del club con la experiencia de profesores, jugadores y profesionales desde un único ecosistema.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {solutions.map(({ icon: Icon, title, text, color }) => (
            <article key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Icon className={`h-8 w-8 ${color}`} />
              <h2 className="mt-6 text-2xl font-black">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <button type="button" onClick={onOpenDemo} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-500">Explorar demo <ArrowRight className="h-4 w-4" /></button>
          <button type="button" onClick={onBack} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-bold transition hover:border-emerald-500 dark:border-slate-700">Conocer Setmio</button>
        </div>
      </div>
    </main>
  );
}
