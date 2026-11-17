import React, { useState, useEffect } from 'react';
import {
  Building2,
  GraduationCap,
  Trophy,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Zap,
  ShieldCheck,
  CreditCard,
  Smartphone,
  BarChart3,
  Calendar,
  Layers,
  Receipt,
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
  const { triggerDemoToast, t, language } = useApp();
  void language;

  const resolveSelectedRole = (): ProfessionalRoleKey | null => {
    if (roleId === 'clubes') return 'clubes';
    if (roleId === 'profesores' || roleId === 'escuelas' || roleId === 'schools') return 'profesores';
    if (roleId === 'profesionales' || roleId === 'pro_players') return 'profesionales';
    return null;
  };

  const [selectedRoleKey, setSelectedRoleKey] = useState<ProfessionalRoleKey | null>(resolveSelectedRole);

  useEffect(() => {
    setSelectedRoleKey(resolveSelectedRole());
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
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/registro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    if (onOpenRegister) {
      onOpenRegister();
    }
  };

  if (selectedRoleKey) {
    const activeRole = PROFESSIONAL_ROLES_META[selectedRoleKey];
    const Icon = activeRole.icon;
    const badgeText = t(`solutions.${activeRole.id}.badge`);
    const titleText = t(`solutions.${activeRole.id}.detailTitle`);
    const subtitleText = t(`solutions.${activeRole.id}.detailSubtitle`);
    const heroDescText = t(`solutions.${activeRole.id}.heroDesc`);

    return (
      <main className="min-h-[calc(100vh-5rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              type="button"
              onClick={handleBackToGrid}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-xs font-semibold text-[#0B1A2D] transition hover:border-[#8B5CF6] hover:text-[#8B5CF6] dark:border-[#1A314D] dark:bg-[#0E2239] dark:text-slate-200 dark:hover:border-[#B7F229] dark:hover:text-[#B7F229] cursor-pointer active:scale-95"
            >
              <ArrowLeft className="h-4 w-4 text-[#8B5CF6] dark:text-[#B7F229]" />
              <span>{t('common.back', 'Volver a Soluciones')}</span>
            </button>

            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
              Setmio Pro · {badgeText}
            </span>
          </div>

          <div className="space-y-20">
            {/* Hero Detail */}
            <section className="space-y-6 max-w-4xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8B5CF6] dark:text-[#a78bfa]">
                <Icon className="w-4 h-4" />
                <span>{badgeText}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08]">
                {titleText}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {subtitleText}
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl pt-2 border-t border-slate-200/80 dark:border-[#1A314D]">
                {heroDescText}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDemoClick(badgeText)}
                  className="min-h-[44px] px-6 py-3 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs sm:text-sm transition cursor-pointer active:scale-95"
                >
                  {t('solutions.detail.demoBtn', 'Ver demo')}
                </button>

                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="min-h-[44px] px-6 py-3 rounded-xl bg-[#0B1A2D] dark:bg-[#0E2239] text-white font-bold text-xs sm:text-sm border border-[#1A314D] hover:border-[#8B5CF6] transition cursor-pointer active:scale-95"
                >
                  {t('solutions.detail.registerBtn', 'Registrarse')}
                </button>
              </div>
            </section>

            {/* 4 Key Metrics */}
            <section className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 md:divide-x divide-slate-200/80 dark:divide-[#1A314D] border-y border-slate-200/80 dark:border-[#1A314D]">
              {Array.from({ length: activeRole.metricsCount }).map((_, mIdx) => (
                <div key={mIdx} className="p-6 space-y-1.5 text-left">
                  <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-[#0B1A2D] dark:text-[#B7F229]">
                    {t(`solutions.${activeRole.id}.metrics.${mIdx}.val`)}
                  </div>
                  <div className="text-xs font-bold text-[#0B1A2D] dark:text-white">
                    {t(`solutions.${activeRole.id}.metrics.${mIdx}.label`)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {t(`solutions.${activeRole.id}.metrics.${mIdx}.sub`)}
                  </div>
                </div>
              ))}
            </section>

            {/* 4 Pillars */}
            <section className="space-y-8">
              <div className="space-y-1.5 text-left">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#8B5CF6] dark:text-[#a78bfa]">
                  {t('solutions.detail.pillarsEyebrow', 'Arquitectura Funcional')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0B1A2D] dark:text-white tracking-tight">
                  {t('solutions.detail.pillarsTitle', 'Pilares Tecnológicos y Operativos')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeRole.pillars.map((pillar, idx) => {
                  const PillarIcon = pillar.icon;
                  return (
                    <div
                      key={idx}
                      className="p-8 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-6 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229]/15 text-[#B7F229] flex items-center justify-center">
                          <PillarIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-[#0B1A2D] dark:text-white">
                          {t(`solutions.${activeRole.id}.pillars.${idx}.title`)}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {t(`solutions.${activeRole.id}.pillars.${idx}.desc`)}
                        </p>
                        <ul className="space-y-2.5 pt-3 border-t border-slate-200/80 dark:border-[#1A314D]">
                          {Array.from({ length: pillar.bulletCount }).map((_, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                              <Check className="w-4 h-4 text-[#8B5CF6] dark:text-[#B7F229] shrink-0 mt-0.5" />
                              <span>{t(`solutions.${activeRole.id}.pillars.${idx}.b.${bIdx}`)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-slate-200/80 dark:border-[#1A314D] text-[11px] text-slate-500 dark:text-slate-400">
                        <strong className="text-[#0B1A2D] dark:text-slate-200">{t('solutions.detail.techSpec', 'Especificación técnica:')} </strong>
                        {t(`solutions.${activeRole.id}.pillars.${idx}.tech`)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Workflow Steps */}
            <section className="space-y-8">
              <div className="space-y-1.5 text-left">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#8B5CF6] dark:text-[#a78bfa]">
                  {t('solutions.detail.workflowEyebrow', 'Flujo de Trabajo')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0B1A2D] dark:text-white tracking-tight">
                  {t('solutions.detail.workflowTitle', '¿Cómo opera el sistema en el día a día?')}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {Array.from({ length: activeRole.workflowStepsCount }).map((_, wfIdx) => (
                  <div
                    key={wfIdx}
                    className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3"
                  >
                    <span className="text-xl font-black font-mono tabular-nums text-[#8B5CF6] dark:text-[#B7F229]">
                      {t(`solutions.${activeRole.id}.workflow.${wfIdx}.step`)}
                    </span>
                    <h4 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
                      {t(`solutions.${activeRole.id}.workflow.${wfIdx}.title`)}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t(`solutions.${activeRole.id}.workflow.${wfIdx}.desc`)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Specs */}
            <section className="space-y-6 pt-4 border-t border-slate-200/80 dark:border-[#1A314D]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#8B5CF6] dark:text-[#B7F229]" />
                <h3 className="text-lg font-black text-[#0B1A2D] dark:text-white">
                  {t('solutions.detail.complianceTitle', 'Ficha Técnica de Integración y Cumplimiento')}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: activeRole.specsCount }).map((_, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      <span>{t(`solutions.${activeRole.id}.specs.${sIdx}.category`)}</span>
                      <span className="text-[#8B5CF6] dark:text-[#B7F229] text-[10px] font-mono">
                        {t(`solutions.${activeRole.id}.specs.${sIdx}.badge`)}
                      </span>
                    </div>
                    <p className="text-xs text-[#0B1A2D] dark:text-slate-300 font-medium leading-relaxed">
                      {t(`solutions.${activeRole.id}.specs.${sIdx}.desc`)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ROI Banner */}
            <section className="p-8 sm:p-12 rounded-2xl bg-[#0B1A2D] dark:bg-[#071220] border border-[#1A314D] text-white space-y-6">
              <div className="max-w-3xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#B7F229]">
                  {t('solutions.detail.roiEyebrow', 'Impacto Demostrable')}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {t(`solutions.${activeRole.id}.roiTitle`)}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: activeRole.roiBulletCount }).map((_, rIdx) => (
                  <div key={rIdx} className="flex items-start gap-3 text-xs text-slate-200 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#B7F229] shrink-0 mt-0.5" />
                    <span>{t(`solutions.${activeRole.id}.roiBullets.${rIdx}`)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoClick(badgeText)}
                  className="min-h-[44px] px-6 py-3 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs transition cursor-pointer active:scale-95"
                >
                  {t('solutions.detail.demoBtn', 'Solicitar Demostración Guiada')}
                </button>
                <button
                  type="button"
                  onClick={handleBackToGrid}
                  className="min-h-[44px] px-5 py-3 rounded-xl bg-[#0E2239] hover:bg-[#132A45] text-slate-200 font-semibold text-xs border border-[#1A314D] transition cursor-pointer active:scale-95"
                >
                  {t('solutions.detail.otherSolutionsBtn', 'Ver Otras Soluciones')}
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    );
  }

  const roleCards = [
    {
      id: 'clubes' as ProfessionalRoleKey,
      itemKey: 'item_1',
      icon: Building2,
      accent: 'lime' as const,
    },
    {
      id: 'profesores' as ProfessionalRoleKey,
      itemKey: 'item_2',
      icon: GraduationCap,
      accent: 'violet' as const,
    },
    {
      id: 'profesionales' as ProfessionalRoleKey,
      itemKey: 'item_3',
      icon: Trophy,
      accent: 'lime' as const,
    },
  ];

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-start">
          <SubpageHeaderNav onBack={onBack} className="mb-0" />
        </div>

        <div className="space-y-16">
          <div className="space-y-4 max-w-3xl text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8B5CF6] dark:text-[#a78bfa]">
              <Layers className="w-4 h-4" />
              <span>{t('solutions.eyebrowBadge', 'Soluciones Especializadas por Perfil Profesional')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0B1A2D] dark:text-white tracking-tight leading-[1.08]">
              {t('solutions.mainTitle', 'Una plataforma diseñada para cada protagonista del pádel')}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              {t('solutions.mainSubtitle', 'Descubre las soluciones de software de gestión integral y marca blanca diseñadas a medida para instalaciones deportivas, academias docentes y atletas profesionales de élite.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {roleCards.map((role) => {
              const Icon = role.icon;
              const isLime = role.accent === 'lime';
              return (
                <article
                  key={role.id}
                  className="p-8 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#8B5CF6]/60 dark:hover:border-[#B7F229]/60 transition-colors flex flex-col justify-between space-y-8"
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          isLime
                            ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229]/15 dark:text-[#B7F229]'
                            : 'bg-[#8B5CF6] text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Setmio Pro
                      </span>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6] dark:text-[#a78bfa]">
                        {t(`solutions.${role.itemKey}.badge`)}
                      </div>
                      <h2 className="text-2xl font-black text-[#0B1A2D] dark:text-white mt-1">
                        {t(`solutions.${role.itemKey}.title`)}
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                        {t(`solutions.${role.itemKey}.desc`)}
                      </p>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/80 dark:border-[#1A314D] pt-5">
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                        <span>{t(`solutions.${role.itemKey}.f1`)}</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                        <span>{t(`solutions.${role.itemKey}.f2`)}</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                        <span>{t(`solutions.${role.itemKey}.f3`)}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-5 border-t border-slate-200/80 dark:border-[#1A314D]">
                    <button
                      type="button"
                      onClick={() => handleSelectRole(role.id)}
                      className={`w-full min-h-[44px] py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                        isLime
                          ? 'bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:hover:bg-[#c5f64e] dark:text-[#0B1A2D]'
                          : 'bg-[#8B5CF6] hover:bg-[#7c4def] text-white'
                      }`}
                    >
                      <span>{t(`solutions.${role.itemKey}.btn`)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default SolucionesPage;
