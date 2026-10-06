import React, { useState, useEffect } from 'react';
import {
  Building2,
  GraduationCap,
  Trophy,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Zap,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Cpu,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  Receipt,
  FileCheck,
  Play,
  Clock,
  ChevronRight,
  TrendingUp,
  Check,
} from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { useApp } from '../../context/AppContext';

export interface SolucionesPageProps {
  onBack: () => void;
  onOpenDemo: () => void;
  onOpenRegister?: () => void;
  roleId?: string;
  onOpenRole?: (roleId: string) => void;
}

export type ProfessionalRoleKey = 'clubes' | 'profesores' | 'profesionales';

interface PillarMeta {
  icon: React.ComponentType<{ className?: string }>;
  bulletCount: number;
}

interface RoleDetailMeta {
  id: ProfessionalRoleKey;
  icon: React.ComponentType<{ className?: string }>;
  metricsCount: number;
  pillars: PillarMeta[];
  specsCount: number;
  workflowStepsCount: number;
  roiBulletCount: number;
}

const PROFESSIONAL_ROLES_META: Record<ProfessionalRoleKey, RoleDetailMeta> = {
  clubes: {
    id: 'clubes',
    icon: Building2,
    metricsCount: 4,
    pillars: [
      { icon: Calendar, bulletCount: 3 },
      { icon: Zap, bulletCount: 3 },
      { icon: CreditCard, bulletCount: 3 },
      { icon: Receipt, bulletCount: 3 },
    ],
    specsCount: 4,
    workflowStepsCount: 4,
    roiBulletCount: 4,
  },
  profesores: {
    id: 'profesores',
    icon: GraduationCap,
    metricsCount: 4,
    pillars: [
      { icon: Calendar, bulletCount: 3 },
      { icon: CreditCard, bulletCount: 3 },
      { icon: BarChart3, bulletCount: 3 },
      { icon: Smartphone, bulletCount: 3 },
    ],
    specsCount: 4,
    workflowStepsCount: 4,
    roiBulletCount: 4,
  },
  profesionales: {
    id: 'profesionales',
    icon: Trophy,
    metricsCount: 4,
    pillars: [
      { icon: Trophy, bulletCount: 3 },
      { icon: Calendar, bulletCount: 3 },
      { icon: CreditCard, bulletCount: 3 },
      { icon: Smartphone, bulletCount: 3 },
    ],
    specsCount: 4,
    workflowStepsCount: 4,
    roiBulletCount: 4,
  },
};

export function SolucionesPage({
  onBack,
  onOpenDemo,
  onOpenRegister,
  roleId,
  onOpenRole,
}: SolucionesPageProps) {
  const { setPublicPage, triggerDemoToast, t, language } = useApp();
  void language;

  const resolveSelectedRole = (): ProfessionalRoleKey | null => {
    if (roleId === 'clubes') return 'clubes';
    if (roleId === 'profesores' || roleId === 'escuelas' || roleId === 'schools') return 'profesores';
    if (roleId === 'profesionales' || roleId === 'pro_players') return 'profesionales';
    return null;
  };

  const [selectedRoleKey, setSelectedRoleKey] = useState<ProfessionalRoleKey | null>(resolveSelectedRole);

  useEffect(() => {
    const resolved = resolveSelectedRole();
    setSelectedRoleKey(resolved);
  }, [roleId]);

  const handleSelectRole = (key: ProfessionalRoleKey) => {
    setSelectedRoleKey(key);
    if (onOpenRole) {
      onOpenRole(key);
    }
    if (typeof window !== 'undefined') {
      const pathMap: Record<ProfessionalRoleKey, string> = {
        clubes: '/soluciones/clubes',
        profesores: '/soluciones/profesores',
        profesionales: '/soluciones/jugadores-profesionales',
      };
      window.history.pushState({}, '', pathMap[key]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGrid = () => {
    setSelectedRoleKey(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/soluciones');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemoClick = (roleBadge?: string) => {
    if (onOpenDemo) {
      onOpenDemo();
    } else {
      triggerDemoToast(
        t('demo.heading', 'Demo Guiada'),
        `${t('demo.description', 'Iniciando demostración interactiva')} - ${roleBadge || 'Setmio Pro'}`,
        'info'
      );
    }
  };

  const handleRegisterClick = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/registro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // --- VISTA DETALLADA DEL ROL SELECCIONADO ---
  if (selectedRoleKey) {
    const activeRole = PROFESSIONAL_ROLES_META[selectedRoleKey];
    const Icon = activeRole.icon;
    const badgeText = t(`solutions.${activeRole.id}.badge`);
    const titleText = t(`solutions.${activeRole.id}.detailTitle`);
    const subtitleText = t(`solutions.${activeRole.id}.detailSubtitle`);
    const heroDescText = t(`solutions.${activeRole.id}.heroDesc`);

    return (
      <main className="min-h-[calc(100vh-5rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Navigation Button alineado a la izquierda */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBackToGrid}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-emerald-400 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('common.back', 'Volver a Soluciones')}</span>
            </button>

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
              Setmio Pro · {badgeText}
            </span>
          </div>

          {/* Hero Header Detallado (Alineado limpiamente a la izquierda, tipografía estandarizada) */}
          <section className="relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 lg:p-16 shadow-sm dark:shadow-2xl">
            <div className="relative z-10 max-w-4xl space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/20">
                <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{badgeText}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {titleText}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                {subtitleText}
              </p>

              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl border-l-2 border-emerald-500 pl-4">
                {heroDescText}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDemoClick(badgeText)}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition cursor-pointer active:scale-95"
                >
                  {t('solutions.detail.demoBtn', 'Solicitar Demostración Guiada')}
                </button>

                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer active:scale-95"
                >
                  {t('nav.register', 'Crear Cuenta')}
                </button>
              </div>
            </div>
          </section>

          {/* 4 Métricas Clave de Negocio */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: activeRole.metricsCount }).map((_, mIdx) => (
              <div
                key={mIdx}
                className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-left shadow-xs"
              >
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {t(`solutions.${activeRole.id}.metrics.${mIdx}.val`)}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {t(`solutions.${activeRole.id}.metrics.${mIdx}.label`)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {t(`solutions.${activeRole.id}.metrics.${mIdx}.sub`)}
                </div>
              </div>
            ))}
          </section>

          {/* 4 Pilares de la Solución */}
          <section className="space-y-6">
            <div className="space-y-1 text-left">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {t('solutions.detail.pillarsEyebrow', 'Arquitectura Funcional')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('solutions.detail.pillarsTitle', 'Pilares Tecnológicos y Operativos')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeRole.pillars.map((pillar, idx) => {
                const PillarIcon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <PillarIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {t(`solutions.${activeRole.id}.pillars.${idx}.title`)}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {t(`solutions.${activeRole.id}.pillars.${idx}.desc`)}
                      </p>
                      <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {Array.from({ length: pillar.bulletCount }).map((_, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{t(`solutions.${activeRole.id}.pillars.${idx}.b.${bIdx}`)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
                      <strong className="text-slate-800 dark:text-slate-200">{t('solutions.detail.techSpec', 'Especificación técnica:')} </strong>
                      {t(`solutions.${activeRole.id}.pillars.${idx}.tech`)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Workflow Operativo Paso a Paso */}
          <section className="space-y-6">
            <div className="space-y-1 text-left">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {t('solutions.detail.workflowEyebrow', 'Flujo de Trabajo')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('solutions.detail.workflowTitle', '¿Cómo opera el sistema en el día a día?')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: activeRole.workflowStepsCount }).map((_, wfIdx) => (
                <div
                  key={wfIdx}
                  className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 relative shadow-xs"
                >
                  <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {t(`solutions.${activeRole.id}.workflow.${wfIdx}.step`)}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t(`solutions.${activeRole.id}.workflow.${wfIdx}.title`)}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t(`solutions.${activeRole.id}.workflow.${wfIdx}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Especificaciones Técnicas y Cumplimiento */}
          <section className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {t('solutions.detail.complianceTitle', 'Ficha Técnica de Integración y Cumplimiento')}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: activeRole.specsCount }).map((_, sIdx) => (
                <div
                  key={sIdx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span>{t(`solutions.${activeRole.id}.specs.${sIdx}.category`)}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono">
                      {t(`solutions.${activeRole.id}.specs.${sIdx}.badge`)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {t(`solutions.${activeRole.id}.specs.${sIdx}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Retorno de Inversión (ROI) Demostrable */}
          <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 border border-emerald-500/30 text-white space-y-6 shadow-xl">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                {t('solutions.detail.roiEyebrow', 'Impacto Demostrable')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {t(`solutions.${activeRole.id}.roiTitle`)}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: activeRole.roiBulletCount }).map((_, rIdx) => (
                <div key={rIdx} className="flex items-start gap-3 text-xs text-slate-200 leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t(`solutions.${activeRole.id}.roiBullets.${rIdx}`)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleDemoClick(badgeText)}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-md active:scale-95"
              >
                {t('solutions.detail.demoBtn', 'Solicitar Demostración Guiada')}
              </button>
              <button
                type="button"
                onClick={handleBackToGrid}
                className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer active:scale-95"
              >
                {t('solutions.detail.otherSolutionsBtn', 'Ver Otras Soluciones')}
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // --- VISTA PRINCIPAL: CUADRÍCULA DE TARJETAS RESUMEN DE SOLUCIONES ---
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Navigation Button alineado a la izquierda */}
        <div className="flex items-center justify-start">
          <SubpageHeaderNav onBack={onBack} />
        </div>

        {/* Header Superior (Alineado limpiamente a la izquierda, tipografía estandarizada) */}
        <div className="space-y-4 max-w-3xl text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" />
            <span>{t('solutions.eyebrowBadge', 'Soluciones Especializadas por Perfil Profesional')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {t('solutions.mainTitle', 'Una plataforma diseñada para cada protagonista del pádel')}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            {t('solutions.mainSubtitle', 'Descubre las soluciones de software de gestión integral y marca blanca diseñadas a medida para instalaciones deportivas, academias docentes y atletas profesionales de élite.')}
          </p>
        </div>

        {/* Cuadrícula de Tarjetas Resumen para cada rol profesional (Setmio Pro) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Tarjeta 1: Clubes de Pádel */}
          <article className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Setmio Pro
                </span>
              </div>

              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {t('solutions.cardClubsBadge', 'Instalaciones & Complejos')}
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {t('solutions.cardClubsTitle', 'Clubes de Pádel')}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                  {t('solutions.cardClubsDesc', 'Control absoluto de cuadrante de pistas, socios y facturación con marca blanca completa, automatización domótica de luces LED y cero comisiones por reserva.')}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-800 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('solutions.clubs.f1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('solutions.clubs.f2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('solutions.clubs.f3')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSelectRole('clubes')}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{t('solutions.cardClubsBtn', 'Ver Solución Detallada para Clubes')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>

          {/* Tarjeta 2: Profesores y Academias */}
          <article className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:border-teal-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-cyan-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/10 text-teal-700 dark:text-cyan-400 border border-teal-500/20">
                  Setmio Pro
                </span>
              </div>

              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-teal-600 dark:text-cyan-400">
                  {t('solutions.cardSchoolsBadge', 'Escuelas & Entrenadores')}
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {t('solutions.cardSchoolsTitle', 'Profesores y Academias')}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                  {t('solutions.cardSchoolsDesc', 'Herramientas profesionales para impartir clases particulares y grupales, evaluar la evolución técnica del alumno y automatizar cobros recurrentes de cuotas.')}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-800 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{t('solutions.schools.f1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{t('solutions.schools.f2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{t('solutions.schools.f3')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSelectRole('profesores')}
                className="w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{t('solutions.cardSchoolsBtn', 'Ver Solución para Escuelas y Profesores')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>

          {/* Tarjeta 3: Jugadores Profesionales */}
          <article className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:border-cyan-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                  Setmio Pro
                </span>
              </div>

              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  {t('solutions.cardProBadge', 'Atletas de Competición')}
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {t('solutions.cardProTitle', 'Jugadores Profesionales')}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                  {t('solutions.cardProDesc', 'Web oficial personal de marca blanca para gestionar patrocinios, contratos, agenda de torneos FIP/Premier Padel y venta directa de clinics y exhibiciones.')}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-800 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span>{t('solutions.pro.f1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span>{t('solutions.pro.f2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span>{t('solutions.pro.f3')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSelectRole('profesionales')}
                className="w-full py-3.5 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs transition-all shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{t('solutions.cardProBtn', 'Ver Solución para Jugadores Pro')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

export default SolucionesPage;
