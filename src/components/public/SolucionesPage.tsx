import React from 'react';
import { ArrowRight, Building2, GraduationCap, Users, Trophy, CheckCircle2 } from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { useApp } from '../../context/AppContext';

interface SolucionesPageProps {
  onBack: () => void;
  onOpenDemo: () => void;
  onOpenRegister?: () => void;
  roleId?: string;
  onOpenRole?: (roleId: string) => void;
}

const solutions = [
  { id: 'clubes', icon: Building2, titleKey: 'solutions.clubes.title', textKey: 'solutions.clubes.text', color: 'text-emerald-600 dark:text-emerald-400', details: ['agenda', 'crm', 'tournaments', 'whitelabel'] },
  { id: 'escuelas', icon: GraduationCap, titleKey: 'solutions.escuelas.title', textKey: 'solutions.escuelas.text', color: 'text-cyan-600 dark:text-cyan-400', details: ['planning', 'attendance', 'academyPayments', 'familyComms'] },
  { id: 'profesores', icon: GraduationCap, titleKey: 'solutions.profesores.title', textKey: 'solutions.profesores.text', color: 'text-teal-600 dark:text-teal-400', details: ['classCalendar', 'studentProgress', 'coachPayments', 'playerComms'] },
  { id: 'jugadores', icon: Users, titleKey: 'solutions.jugadores.title', textKey: 'solutions.jugadores.text', color: 'text-blue-600 dark:text-blue-400', details: ['mobileBooking', 'openMatches', 'playerStats', 'benefits'] },
  { id: 'profesionales', icon: Trophy, titleKey: 'solutions.profesionales.title', textKey: 'solutions.profesionales.text', color: 'text-amber-600 dark:text-amber-400', details: ['proProfile', 'proCalendar', 'sponsors', 'opportunities'] },
];

export function SolucionesPage({ onBack, onOpenDemo, onOpenRegister, roleId, onOpenRole }: SolucionesPageProps) {
  const pathRole = typeof window !== 'undefined' ? ({ '/soluciones/clubes': 'clubes', '/soluciones/escuelas': 'escuelas', '/soluciones/profesores': 'profesores', '/soluciones/jugadores': 'jugadores', '/soluciones/jugadores-profesionales': 'profesionales' } as Record<string, string>)[window.location.pathname] : undefined;
  const { t, currentLanguage } = useApp();
  void currentLanguage;
  const selectedRole = solutions.find((solution) => solution.id === (roleId ?? pathRole));
  const copy = (key: string, fallback: string) => t(key, fallback);
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SubpageHeaderNav onBack={onBack} />
        {selectedRole ? (
          <section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/30 sm:p-10">
            <div className="flex items-start gap-4"><selectedRole.icon className={`mt-1 h-10 w-10 shrink-0 ${selectedRole.color}`} /><div><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">{t('solutions.detailLabel', 'Detalle por rol')}</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">{t('solutions.forRole', 'Setmio para')} {t(selectedRole.titleKey, selectedRole.titleKey)}</h1><p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">{copy(selectedRole.textKey, selectedRole.textKey)} {t('solutions.detailIntro', 'Descubre una experiencia completa, conectada y lista para crecer contigo.')}</p></div></div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-white p-4 dark:bg-slate-900"><strong className="block text-2xl font-black text-emerald-600">24/7</strong><span className="text-xs text-slate-500">{t('solutions.metricConnected', 'Operación conectada')}</span></div><div className="rounded-2xl bg-white p-4 dark:bg-slate-900"><strong className="block text-2xl font-black text-emerald-600">-40%</strong><span className="text-xs text-slate-500">{t('solutions.metricManual', 'Tareas manuales')}</span></div><div className="rounded-2xl bg-white p-4 dark:bg-slate-900"><strong className="block text-2xl font-black text-emerald-600">1 panel</strong><span className="text-xs text-slate-500">{t('solutions.metricFlow', 'Todo tu flujo')}</span></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{selectedRole.details.map((detail) => <div key={detail} className="flex gap-3 rounded-2xl border border-white/80 bg-white p-4 text-sm font-semibold shadow-sm dark:border-slate-800 dark:bg-slate-900"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />{t(`solutions.details.${detail}`, detail)}</div>)}</div>
            <div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={onOpenDemo} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-500">{t('solutions.demo', 'Ver demo para')} {t(selectedRole.titleKey, selectedRole.titleKey)}<ArrowRight className="h-4 w-4" /></button><button type="button" onClick={onOpenRegister} className="inline-flex items-center gap-2 rounded-2xl border border-emerald-600 px-5 py-3 text-sm font-black text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40">{t('nav.register', 'Registrarse')}<ArrowRight className="h-4 w-4" /></button></div>
          </section>
        ) : <div className="max-w-3xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">{t('solutions.eyebrow', 'Soluciones Setmio')}</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{t('solutions.heading', 'Una plataforma para cada protagonista del pádel.')}</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">{t('solutions.description', 'Conecta la operación del club con la experiencia de profesores, jugadores y profesionales desde un único ecosistema.')}</p>
        </div>}
        {!selectedRole && <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {solutions.map(({ id, icon: Icon, titleKey, textKey, color }) => (
            <article key={id} className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Icon className={`h-8 w-8 ${color}`} />
              <h2 className="mt-6 text-2xl font-black">{t(titleKey, titleKey)}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t(textKey, textKey)}</p>
              <button type="button" onClick={() => onOpenRole?.(id)} className="mt-6 inline-flex items-center gap-2 text-sm font-black text-emerald-700 hover:gap-3 dark:text-emerald-400">{t('solutions.more', 'Ver más')} <ArrowRight className="h-4 w-4" /></button>
            </article>
          ))}
        </div>}
        {!selectedRole && <div className="mt-12 flex flex-wrap gap-3">
          <button type="button" onClick={onBack} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-bold transition hover:border-emerald-500 dark:border-slate-700">{t('solutions.learn', 'Conocer Setmio')}</button>
        </div>}
      </div>
    </main>
  );
}
