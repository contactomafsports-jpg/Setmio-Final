import React from 'react';
import { ArrowRight, Building2, GraduationCap, Users, Trophy, CheckCircle2 } from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';

interface SolucionesPageProps {
  onBack: () => void;
  onOpenDemo: () => void;
  roleId?: string;
  onOpenRole?: (roleId: string) => void;
}

const solutions = [
  { id: 'clubes', icon: Building2, title: 'Clubes', text: 'Gestiona reservas, socios, pistas, torneos y operaciones desde una plataforma con tu propia marca.', color: 'text-emerald-600 dark:text-emerald-400', details: ['Agenda y reservas con disponibilidad en tiempo real', 'CRM de socios, cuotas, bonos y facturación', 'Torneos, escuela, tienda y comunicación centralizada', 'Marca blanca, dominios propios y multi-sede'] },
  { id: 'profesores', icon: GraduationCap, title: 'Profesores', text: 'Organiza alumnos, clases, grupos, disponibilidad y cobros sin perder tiempo en tareas administrativas.', color: 'text-cyan-600 dark:text-cyan-400', details: ['Calendario de clases individuales y grupos', 'Seguimiento de alumnos y evolución deportiva', 'Cobros, bonos y control de asistencia', 'Comunicación directa con jugadores y familias'] },
  { id: 'jugadores', icon: Users, title: 'Jugadores', text: 'Descubre partidos, reserva pistas, sigue tu progreso y conecta con la comunidad de tu club.', color: 'text-blue-600 dark:text-blue-400', details: ['Reservas y pagos desde cualquier dispositivo', 'Partidos abiertos y comunidad del club', 'Perfil deportivo, estadísticas y objetivos', 'Notificaciones y beneficios personalizados'] },
  { id: 'profesionales', icon: Trophy, title: 'Profesionales', text: 'Centraliza tu calendario, objetivos, contenidos y oportunidades comerciales en un perfil profesional.', color: 'text-amber-600 dark:text-amber-400', details: ['Perfil profesional con presencia de marca', 'Calendario, objetivos y contenidos', 'Relación con clubes, alumnos y patrocinadores', 'Métricas para convertir actividad en oportunidades'] },
];

export function SolucionesPage({ onBack, onOpenDemo, roleId, onOpenRole }: SolucionesPageProps) {
  const pathRole = typeof window !== 'undefined' ? ({ '/soluciones/clubes': 'clubes', '/soluciones/profesores': 'profesores', '/soluciones/jugadores': 'jugadores', '/soluciones/jugadores-profesionales': 'profesionales' } as Record<string, string>)[window.location.pathname] : undefined;
  const selectedRole = solutions.find((solution) => solution.id === (roleId ?? pathRole));
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SubpageHeaderNav onBack={onBack} />
        {selectedRole ? (
          <section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/30 sm:p-10">
            <div className="flex items-start gap-4"><selectedRole.icon className={`mt-1 h-10 w-10 shrink-0 ${selectedRole.color}`} /><div><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Detalle por rol</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Setmio para {selectedRole.title}</h1><p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">{selectedRole.text} Descubre una experiencia completa, conectada y lista para crecer contigo.</p></div></div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">{selectedRole.details.map((detail) => <div key={detail} className="flex gap-3 rounded-2xl border border-white/80 bg-white p-4 text-sm font-semibold shadow-sm dark:border-slate-800 dark:bg-slate-900"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />{detail}</div>)}</div>
            <button type="button" onClick={onOpenDemo} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-500">Ver demo para {selectedRole.title}<ArrowRight className="h-4 w-4" /></button>
          </section>
        ) : <div className="max-w-3xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">Soluciones Setmio</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Una plataforma para cada protagonista del pádel.</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">Conecta la operación del club con la experiencia de profesores, jugadores y profesionales desde un único ecosistema.</p>
        </div>}
        {!selectedRole && <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {solutions.map(({ id, icon: Icon, title, text, color }) => (
            <article key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Icon className={`h-8 w-8 ${color}`} />
              <h2 className="mt-6 text-2xl font-black">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{text}</p>
              <button type="button" onClick={() => onOpenRole?.(id)} className="mt-6 inline-flex items-center gap-2 text-sm font-black text-emerald-700 hover:gap-3 dark:text-emerald-400">Ver más <ArrowRight className="h-4 w-4" /></button>
            </article>
          ))}
        </div>}
        {!selectedRole && <div className="mt-12 flex flex-wrap gap-3">
          <button type="button" onClick={onOpenDemo} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-500">Explorar demo <ArrowRight className="h-4 w-4" /></button>
          <button type="button" onClick={onBack} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-bold transition hover:border-emerald-500 dark:border-slate-700">Conocer Setmio</button>
        </div>}
      </div>
    </main>
  );
}
