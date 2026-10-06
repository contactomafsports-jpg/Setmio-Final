import React from 'react';
import { ArrowRight, Building2, GraduationCap, Trophy, CheckCircle2, Smartphone, Users, Zap, Wallet } from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { useApp } from '../../context/AppContext';

interface SolucionesPageProps {
  onBack: () => void;
  onOpenDemo: () => void;
  onOpenRegister?: () => void;
  roleId?: string;
  onOpenRole?: (roleId: string) => void;
}

// Soluciones B2B exclusivas para organizaciones y profesionales
const solutions = [
  {
    id: 'clubes',
    icon: Building2,
    titleKey: 'solutions.clubes.title',
    textKey: 'solutions.clubes.text',
    color: 'text-emerald-600 dark:text-emerald-400',
    details: ['agenda', 'crm', 'tournaments', 'whitelabel'],
  },
  {
    id: 'escuelas',
    icon: GraduationCap,
    titleKey: 'solutions.escuelas.title',
    textKey: 'solutions.escuelas.text',
    color: 'text-cyan-600 dark:text-cyan-400',
    details: ['planning', 'attendance', 'academyPayments', 'familyComms'],
  },
  {
    id: 'profesores',
    icon: GraduationCap,
    titleKey: 'solutions.profesores.title',
    textKey: 'solutions.profesores.text',
    color: 'text-teal-600 dark:text-teal-400',
    details: ['classCalendar', 'studentProgress', 'coachPayments', 'playerComms'],
  },
  {
    id: 'profesionales',
    icon: Trophy,
    titleKey: 'solutions.profesionales.title',
    textKey: 'solutions.profesionales.text',
    color: 'text-amber-600 dark:text-amber-400',
    details: ['proProfile', 'proCalendar', 'sponsors', 'opportunities'],
  },
];

export function SolucionesPage({ onBack, onOpenDemo, onOpenRegister, roleId, onOpenRole }: SolucionesPageProps) {
  const { t, currentLanguage, setPublicPage } = useApp();
  void currentLanguage;

  const navigateToPlayers = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/para-jugadores');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setPublicPage('players_app');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const pathRole =
    typeof window !== 'undefined'
      ? ({
          '/soluciones/clubes': 'clubes',
          '/soluciones/escuelas': 'escuelas',
          '/soluciones/profesores': 'profesores',
          '/soluciones/jugadores-profesionales': 'profesionales',
        } as Record<string, string>)[window.location.pathname]
      : undefined;

  // Si alguien entra a /soluciones/jugadores, redirigir automáticamente a /para-jugadores
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/soluciones/jugadores') {
      navigateToPlayers();
    }
  }, []);

  const selectedRole = solutions.find((solution) => solution.id === (roleId ?? pathRole));
  const copy = (key: string, fallback: string) => t(key, fallback);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8 lg:py-16 transition-colors">
      <div className="mx-auto max-w-6xl">
        <SubpageHeaderNav onBack={onBack} />

        {selectedRole ? (
          <section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/30 sm:p-10">
            <div className="flex items-start gap-4">
              <selectedRole.icon className={`mt-1 h-10 w-10 shrink-0 ${selectedRole.color}`} />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                  {t('solutions.detailLabel', 'Detalle por rol')}
                </p>
                <h1 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">
                  {t('solutions.forRole', 'Setmio para')} {t(selectedRole.titleKey, selectedRole.titleKey)}
                </h1>
                <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                  {copy(selectedRole.textKey, selectedRole.textKey)}{' '}
                  {t('solutions.detailIntro', 'Descubre una experiencia completa, conectada y lista para crecer contigo.')}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800">
                <strong className="block text-2xl font-black text-emerald-600">24/7</strong>
                <span className="text-xs text-slate-500">{t('solutions.metricConnected', 'Operación conectada')}</span>
              </div>
              <div className="rounded-2xl bg-white p-4 dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800">
                <strong className="block text-2xl font-black text-emerald-600">-40%</strong>
                <span className="text-xs text-slate-500">{t('solutions.metricManual', 'Tareas manuales')}</span>
              </div>
              <div className="rounded-2xl bg-white p-4 dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800">
                <strong className="block text-2xl font-black text-emerald-600">1 panel</strong>
                <span className="text-xs text-slate-500">{t('solutions.metricFlow', 'Todo tu flujo')}</span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {selectedRole.details.map((detail) => (
                <div
                  key={detail}
                  className="flex gap-3 rounded-2xl border border-white/80 bg-white p-4 text-sm font-semibold shadow-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  {t(`solutions.details.${detail}`, detail)}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onOpenDemo}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-500 transition cursor-pointer"
              >
                {t('solutions.demo', 'Ver demo para')} {t(selectedRole.titleKey, selectedRole.titleKey)}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onOpenRegister}
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-600 px-5 py-3 text-sm font-black text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40 transition cursor-pointer"
              >
                {t('nav.register', 'Registrarse')}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        ) : (
          <div className="space-y-12">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
                {t('solutions.eyebrow', 'Soluciones Setmio B2B')}
              </p>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                {t('solutions.heading', 'Plataforma SaaS para los profesionales del pádel.')}
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Optimiza la gestión, reservas, finanzas y alumnos de tu club, escuela o carrera deportiva profesional con tecnología de vanguardia.
              </p>
            </div>

            {/* Grid B2B Exclusivo (Clubes, Escuelas, Profesores, Jugadores Profesionales) */}
            <div className="grid gap-5 sm:grid-cols-2">
              {solutions.map(({ id, icon: Icon, titleKey, textKey, color }) => (
                <article
                  key={id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 hover:border-emerald-500/50 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <Icon className={`h-8 w-8 ${color}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        B2B Pro
                      </span>
                    </div>
                    <h2 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
                      {t(titleKey, titleKey)}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {t(textKey, textKey)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenRole?.(id)}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-emerald-600 hover:text-emerald-500 transition cursor-pointer"
                  >
                    {t('solutions.more', 'Ver más detalles')} <ArrowRight className="h-4 w-4" />
                  </button>
                </article>
              ))}
            </div>

            {/* SECCIÓN INDEPENDIENTE PARA JUGADORES PARTICULARES -> Redirige a /para-jugadores */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-7 sm:p-10 border border-emerald-500/30 shadow-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sección para Jugadores Particulares</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    ¿Buscas reservar pista, buscar partidos o seguir tu nivel?
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    Hemos creado una experiencia móvil independiente para jugadores: reserva en segundos, división automática del pago de pista, emparejamiento por nivel dinámico (1.0 - 7.0) y apertura automática de pistas.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-emerald-300">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Zap className="w-4 h-4 text-emerald-400" /> Reserva instantánea
                    </span>
                    <span className="flex items-center gap-1.5 font-bold">
                      <Users className="w-4 h-4 text-emerald-400" /> Partidos abiertos
                    </span>
                    <span className="flex items-center gap-1.5 font-bold">
                      <Wallet className="w-4 h-4 text-emerald-400" /> Monedero de club
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={navigateToPlayers}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
                  >
                    <span>Ir a Setmio para Jugadores</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
