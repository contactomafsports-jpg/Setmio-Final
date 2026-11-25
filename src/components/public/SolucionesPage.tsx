import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Landmark,
  Medal,
  Play,
  Shield,
  Sparkles,
  Trophy,
  UserCheck,
  Users,
} from 'lucide-react';
import { useApp, PublicPage } from '../../context/AppContext';
import {
  CorporateContainer,
  CorporateCtaBanner,
  CorporateEyebrow,
  CorporateNavyButton,
  CorporatePrimaryButton,
  CorporateSecondaryButton,
  navigateCorporateRoute,
} from './corporate/CorporatePrimitives';
import {
  SETMIO_PRO_CORE_SEGMENTS,
  SETMIO_PRO_SEGMENTS,
  SetmioProSegmentId,
} from './corporate/corporateData';

export interface SolucionesPageProps {
  onBack?: () => void;
  onOpenDemo: () => void;
  onOpenRegister?: () => void;
  roleId?: string;
  onOpenRole?: (roleId: string) => void;
}

const SEGMENT_ICONS: Record<SetmioProSegmentId, React.ComponentType<{ className?: string }>> = {
  clubes: Building2,
  escuelas: GraduationCap,
  profesores: UserCheck,
  administraciones: Landmark,
  federaciones: Medal,
  equipos: Shield,
  profesionales: Trophy,
};

type L3Tab = 'capabilities' | 'workflow' | 'deployment';

export function SolucionesPage({
  onBack: _onBack,
  onOpenDemo,
  onOpenRegister,
  roleId,
  onOpenRole,
}: SolucionesPageProps) {
  const { setPublicPage } = useApp();

  void _onBack;

  const resolveRole = (incoming?: string): SetmioProSegmentId | null => {
    if (!incoming) return null;
    if (incoming === 'clubes') return 'clubes';
    if (incoming === 'escuelas' || incoming === 'schools') return 'escuelas';
    if (incoming === 'profesores' || incoming === 'coaches') return 'profesores';
    if (
      incoming === 'administraciones' ||
      incoming === 'ayuntamientos' ||
      incoming === 'councils'
    ) {
      return 'administraciones';
    }
    if (incoming === 'federaciones' || incoming === 'federations') return 'federaciones';
    if (incoming === 'equipos' || incoming === 'teams') return 'equipos';
    if (incoming === 'profesionales' || incoming === 'pro_players') return 'profesionales';
    return null;
  };

  const [selectedRoleKey, setSelectedRoleKey] = useState<SetmioProSegmentId | null>(() =>
    resolveRole(roleId)
  );
  const [activeL3Tab, setActiveL3Tab] = useState<L3Tab>('capabilities');

  useEffect(() => {
    setSelectedRoleKey(resolveRole(roleId));
    setActiveL3Tab('capabilities');
  }, [roleId]);

  const navigate = (path: string, page: PublicPage) => {
    navigateCorporateRoute(path, page, setPublicPage);
  };

  const handleSelectRole = (id: SetmioProSegmentId) => {
    const seg = SETMIO_PRO_SEGMENTS.find((s) => s.id === id);
    if (!seg) return;
    setSelectedRoleKey(id);
    setActiveL3Tab('capabilities');
    onOpenRole?.(id);
    navigate(seg.path, seg.pageKey);
  };

  const handleBackToHub = () => {
    setSelectedRoleKey(null);
    navigate('/soluciones', 'solutions');
  };

  const handleRegisterClick = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/registro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    onOpenRegister?.();
  };

  const activeSegment = selectedRoleKey
    ? SETMIO_PRO_SEGMENTS.find((s) => s.id === selectedRoleKey) || null
    : null;

  // LEVEL 2 & LEVEL 3: SEGMENT DETAIL VIEW (No duplicate horizontal role bar)
  if (activeSegment) {
    const ActiveIcon = SEGMENT_ICONS[activeSegment.id];
    const l3Labels: { id: L3Tab; label: string }[] = [
      { id: 'capabilities', label: 'Capacidades clave' },
      { id: 'workflow', label: 'Flujo operativo' },
      { id: 'deployment', label: 'Implantación y alcance' },
    ];
    const otherSegments = SETMIO_PRO_SEGMENTS.filter((s) => s.id !== activeSegment.id).slice(0, 3);

    return (
      <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200 overflow-x-clip">
        {/* 1. COMPACT HERO & SUMMARY */}
        <section className="border-b border-slate-200/80 dark:border-[#1A314D] py-7 sm:py-11">
          <CorporateContainer className="space-y-6 sm:space-y-8">
            <nav
              aria-label="Ruta de navegación"
              className="flex items-center gap-1.5 text-xs whitespace-nowrap min-w-0"
            >
              <button
                type="button"
                onClick={() => navigate('/', 'home')}
                className="font-medium text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer shrink-0"
              >
                Inicio
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />
              <button
                type="button"
                onClick={handleBackToHub}
                className="font-medium text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer shrink-0"
              >
                Soluciones
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />
              <span className="font-semibold text-[#0B1A2D] dark:text-white truncate min-w-0">
                {activeSegment.shortTitle}
              </span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start animate-float-in">
              <div className="lg:col-span-8 space-y-4 sm:space-y-5 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] inline-flex items-center justify-center shrink-0">
                    <ActiveIcon className="w-5 h-5" />
                  </span>
                  <CorporateEyebrow accent="lime">
                    {activeSegment.order} · {activeSegment.badge}
                  </CorporateEyebrow>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
                  {activeSegment.headline}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {activeSegment.heroDetail}
                </p>

                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-1">
                  <CorporatePrimaryButton onClick={handleRegisterClick}>
                    Registrarse
                  </CorporatePrimaryButton>
                  <CorporateSecondaryButton
                    onClick={onOpenDemo}
                    icon={<Play className="w-3.5 h-3.5 fill-current shrink-0" />}
                  >
                    Explorar demo por perfil
                  </CorporateSecondaryButton>
                </div>
              </div>

              <aside className="lg:col-span-4 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-5 sm:p-6 space-y-3.5 min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Resumen del perfil
                </div>
                <div className="text-base font-bold text-[#0B1A2D] dark:text-white font-display">
                  {activeSegment.title}
                </div>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2.5 border-t border-slate-200/80 dark:border-[#1A314D]">
                  {activeSegment.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Plan recomendado</span>
                  <span className="font-bold text-[#0B1A2D] dark:text-[#B7F229] text-right">
                    {activeSegment.recommendedPlan}
                  </span>
                </div>
              </aside>
            </div>
          </CorporateContainer>
        </section>

        {/* 2. INTERACTIVE ARCHITECTURAL TABS & RELATED PROFILES */}
        <section className="py-10 sm:py-16 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
          <CorporateContainer className="space-y-8 sm:space-y-10">
            <div
              role="tablist"
              aria-label="Secciones de la solución"
              className="flex flex-wrap items-center gap-1.5 sm:gap-2"
            >
              {l3Labels.map((tab) => {
                const isSelected = activeL3Tab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveL3Tab(tab.id)}
                    className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 motion-reduce:transition-none cursor-pointer border ${
                      isSelected
                        ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229]'
                        : 'bg-white dark:bg-[#0E2239] text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 hover:text-[#0B1A2D] dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div key={activeL3Tab} className="animate-float-in">
              {activeL3Tab === 'capabilities' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
                  {activeSegment.capabilities.map((cap, idx) => (
                    <article
                      key={cap.title}
                      className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none flex flex-col justify-between space-y-4 min-w-0"
                    >
                      <div className="space-y-3 min-w-0">
                        <span className="font-mono text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] tabular-nums">
                          0{idx + 1}
                        </span>
                        <h2 className="text-lg font-bold text-[#0B1A2D] dark:text-white font-display leading-snug">
                          {cap.title}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {cap.desc}
                        </p>
                        <ul className="space-y-2 pt-3 border-t border-slate-100 dark:border-[#1A314D] text-xs text-slate-700 dark:text-slate-300">
                          {cap.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 leading-relaxed">
                              <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {cap.specLabel}
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {activeL3Tab === 'workflow' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-200/90 dark:border-[#1A314D] rounded-2xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200/90 dark:divide-[#1A314D] bg-white dark:bg-[#0E2239] overflow-hidden">
                  {activeSegment.workflow.map((step) => (
                    <div key={step.number} className="p-6 sm:p-7 space-y-2.5">
                      <span className="font-mono text-lg font-bold text-[#0B1A2D] dark:text-[#B7F229] tabular-nums">
                        {step.number}
                      </span>
                      <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white font-display">
                        {step.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeL3Tab === 'deployment' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {activeSegment.deployment.map((item) => (
                      <div
                        key={item.label}
                        className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] space-y-2"
                      >
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {item.label}
                        </div>
                        <div className="text-2xl font-extrabold text-[#0B1A2D] dark:text-[#B7F229] font-display">
                          {item.value}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h2 className="text-lg font-bold text-[#0B1A2D] dark:text-white font-display">
                        {activeSegment.outcomeTitle}
                      </h2>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Suscripción modular con instalación inicial guiada
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeSegment.outcomes.map((outcome) => (
                        <div
                          key={outcome}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Clean Lateral Navigation to Other Profiles */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-[#1A314D] space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm sm:text-base font-bold text-[#0B1A2D] dark:text-white font-display">
                  Otros perfiles de Setmio Pro
                </h3>
                <button
                  type="button"
                  onClick={handleBackToHub}
                  className="text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:underline cursor-pointer shrink-0"
                >
                  Ver los 7 perfiles
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {otherSegments.map((seg) => (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => handleSelectRole(seg.id)}
                    className="text-left p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none space-y-2 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                      <span className="text-[#0B1A2D] dark:text-[#B7F229] tabular-nums">
                        {seg.order}
                      </span>
                      <span className="font-sans font-medium text-slate-500 dark:text-slate-400">
                        {seg.recommendedPlan}
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-[#0B1A2D] dark:text-white font-display group-hover:underline">
                      {seg.shortTitle}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {seg.headline}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </CorporateContainer>
        </section>

        {/* 3. CLOSING DARK CTA BANNER */}
        <section className="py-14 sm:py-18">
          <CorporateContainer>
            <CorporateCtaBanner
              eyebrow={`Setmio Pro · ${activeSegment.shortTitle}`}
              title={`Activa Setmio Pro para ${activeSegment.shortTitle.toLowerCase()}`}
              subtitle="Inicia el alta de tu suscripción modular con puesta en marcha asistida o explora la plataforma aplicada a tu perfil."
              primaryLabel="Registrarse"
              onPrimary={handleRegisterClick}
              secondaryLabel="Explorar demo por perfil"
              onSecondary={onOpenDemo}
            />
          </CorporateContainer>
        </section>
      </div>
    );
  }

  // LEVEL 1 HUB: /soluciones
  const proPlayerSegment = SETMIO_PRO_SEGMENTS.find((s) => s.id === 'profesionales');

  return (
    <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200 overflow-x-clip">
      {/* 1. COMPACT HERO */}
      <section className="border-b border-slate-200/80 dark:border-[#1A314D] py-7 sm:py-11">
        <CorporateContainer className="space-y-5 sm:space-y-6">
          <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 text-xs whitespace-nowrap">
            <button
              type="button"
              onClick={() => navigate('/', 'home')}
              className="font-medium text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer"
            >
              Inicio
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />
            <span className="font-semibold text-[#0B1A2D] dark:text-white">
              Soluciones
            </span>
          </nav>

          <div className="max-w-3xl space-y-3.5 animate-float-in">
            <CorporateEyebrow accent="lime">Setmio Pro · Setmio Player</CorporateEyebrow>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
              Soluciones adaptadas a cada perfil del pádel.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Selecciona tu tipo de entidad en Setmio Pro para consultar sus capacidades, flujo operativo y conexión directa con la experiencia individual de Setmio Player.
            </p>
          </div>
        </CorporateContainer>
      </section>

      {/* 2. SETMIO PRO (7 PROFILES) + SETMIO PLAYER CONNECTION */}
      <section className="py-10 sm:py-16 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
        <CorporateContainer className="space-y-8 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 dark:border-[#1A314D] pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Setmio Pro · Gestión Profesional y Marca Blanca
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1A2D] dark:text-white mt-1 font-display">
                Siete perfiles profesionales en un ecosistema unificado
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Conectado nativamente con Setmio Player
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            {SETMIO_PRO_CORE_SEGMENTS.map((seg) => {
              const Icon = SEGMENT_ICONS[seg.id];
              return (
                <article
                  key={seg.id}
                  className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none flex flex-col min-w-0 group"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectRole(seg.id)}
                    className="w-full h-full p-5 sm:p-6 text-left flex flex-col justify-between gap-5 cursor-pointer"
                  >
                    <div className="space-y-3.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] tabular-nums">
                          {seg.order}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-lg sm:text-xl font-bold text-[#0B1A2D] dark:text-white font-display leading-snug group-hover:underline decoration-[#0B1A2D]/40 dark:decoration-[#B7F229]/60 underline-offset-4">
                          {seg.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {seg.summary}
                        </p>
                      </div>

                      <ul className="space-y-2 pt-3 border-t border-slate-100 dark:border-[#1A314D] text-xs text-slate-700 dark:text-slate-300">
                        {seg.highlights.slice(0, 3).map((h) => (
                          <li key={h} className="flex items-start gap-2 leading-relaxed">
                            <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="w-full pt-3.5 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between gap-3 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium truncate min-w-0">
                        {seg.recommendedPlan}
                      </span>
                      <span className="font-bold text-[#0B1A2D] dark:text-[#B7F229] inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                        <span>Ver solución</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transform-none" />
                      </span>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>

          {/* 07 · Jugador Profesional */}
          {proPlayerSegment && (
            <article className="rounded-2xl border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none group">
              <div className="p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      <span className="font-mono text-[#0B1A2D] dark:text-[#B7F229] mr-1.5">
                        {proPlayerSegment.order}
                      </span>
                      · {proPlayerSegment.badge}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0B1A2D] dark:text-white font-display">
                      {proPlayerSegment.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                      {proPlayerSegment.summary}
                    </p>
                  </div>
                </div>

                <CorporateNavyButton
                  onClick={() => handleSelectRole('profesionales')}
                  className="shrink-0 w-full lg:w-auto text-xs px-5 py-2.5 min-h-[42px]"
                >
                  Ver Jugador Profesional
                </CorporateNavyButton>
              </div>
            </article>
          )}

          {/* Setmio Player Connection Block */}
          <article className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
              <div className="space-y-3 max-w-2xl min-w-0">
                <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0B1A2D] dark:text-[#B7F229]">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Setmio Player · Conexión directa con tus socios y jugadores</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-display leading-snug">
                  Estadísticas personales, análisis de rivales y enlace directo a tu club.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Todos los perfiles de Setmio Pro conectan nativamente con Setmio Player para que el jugador consulte sus partidos, reciba pautas tácticas con{' '}
                  <span className="inline-flex items-center gap-1 font-semibold text-[#0B1A2D] dark:text-white">
                    <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#A78BFA]" />
                    asistente IA
                  </span>{' '}
                  y reserve directamente bajo tu marca sin intermediarios.
                </p>
              </div>

              <div className="shrink-0">
                <CorporateSecondaryButton
                  onClick={() => navigate('/para-jugadores', 'players_app')}
                  className="w-full lg:w-auto text-xs px-5 py-2.5 min-h-[44px]"
                >
                  Explorar Setmio Player
                </CorporateSecondaryButton>
              </div>
            </div>
          </article>
        </CorporateContainer>
      </section>

      {/* 3. CLOSING DARK CTA BANNER */}
      <section className="py-14 sm:py-18">
        <CorporateContainer>
          <CorporateCtaBanner
            eyebrow="Setmio Pro · Suscripción modular con alta guiada"
            title="Activa la solución adecuada para tu entidad"
            subtitle="Configuramos tu plataforma con puesta en marcha asistida, migración inicial de datos y sin comisiones por pista."
            primaryLabel="Registrarse"
            onPrimary={handleRegisterClick}
            secondaryLabel="Explorar demo por perfil"
            onSecondary={onOpenDemo}
          />
        </CorporateContainer>
      </section>
    </div>
  );
}

export default SolucionesPage;
