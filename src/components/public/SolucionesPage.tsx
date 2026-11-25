import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  GraduationCap,
  Landmark,
  Medal,
  Play,
  Shield,
  Trophy,
  UserCheck,
  Users,
} from 'lucide-react';
import { useApp, PublicPage } from '../../context/AppContext';
import {
  CorporateBreadcrumb,
  CorporateContainer,
  CorporateCtaBanner,
  CorporateEyebrow,
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
  onBack: () => void;
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
  onBack,
  onOpenDemo,
  onOpenRegister,
  roleId,
  onOpenRole,
}: SolucionesPageProps) {
  const { setPublicPage } = useApp();

  const resolveRole = (incoming?: string): SetmioProSegmentId | null => {
    if (!incoming) return null;
    if (incoming === 'clubes') return 'clubes';
    if (incoming === 'escuelas' || incoming === 'schools') return 'escuelas';
    if (incoming === 'profesores' || incoming === 'coaches') return 'profesores';
    if (incoming === 'administraciones' || incoming === 'ayuntamientos' || incoming === 'councils') return 'administraciones';
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

  // LEVEL 2 & LEVEL 3: SEGMENT DETAIL VIEW
  if (activeSegment) {
    const ActiveIcon = SEGMENT_ICONS[activeSegment.id];
    const l3Labels: { id: L3Tab; label: string }[] = [
      { id: 'capabilities', label: 'Capacidades clave' },
      { id: 'workflow', label: 'Flujo operativo' },
      { id: 'deployment', label: 'Implantación y alcance' },
    ];

    return (
      <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white py-12 sm:py-16 transition-colors duration-200">
        <CorporateContainer className="space-y-12">
          <CorporateBreadcrumb
            items={[
              { label: 'Inicio', onClick: () => navigate('/', 'home') },
              { label: 'Soluciones Setmio Pro', onClick: handleBackToHub },
              { label: activeSegment.shortTitle },
            ]}
            onBack={handleBackToHub}
            backLabel="Todas las soluciones"
          />

          {/* Horizontal L2 Profile Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar border-b border-slate-200/80 dark:border-[#1A314D]">
            {SETMIO_PRO_SEGMENTS.map((seg) => {
              const isCurrent = seg.id === activeSegment.id;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => handleSelectRole(seg.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0E2239]'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-70 mr-1.5">{seg.order}</span>
                  {seg.shortTitle}
                </button>
              );
            })}
          </div>

          {/* Segment Hero */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] text-[#B7F229] dark:text-[#0B1A2D] inline-flex items-center justify-center">
                  <ActiveIcon className="w-5 h-5" />
                </span>
                <CorporateEyebrow>{activeSegment.badge}</CorporateEyebrow>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
                {activeSegment.headline}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {activeSegment.heroDetail}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <CorporatePrimaryButton onClick={handleRegisterClick}>
                  Activar prueba de 30 días
                </CorporatePrimaryButton>
                <CorporateSecondaryButton
                  onClick={onOpenDemo}
                  icon={<Play className="w-3.5 h-3.5 fill-current" />}
                >
                  Ver demo guiada
                </CorporateSecondaryButton>
              </div>
            </div>

            <aside className="lg:col-span-4 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-6 space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Resumen del perfil
              </div>
              <div className="text-base font-bold text-[#0B1A2D] dark:text-white">
                {activeSegment.title}
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200/80 dark:border-[#1A314D]">
                {activeSegment.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Plan recomendado</span>
                <span className="font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                  {activeSegment.recommendedPlan}
                </span>
              </div>
            </aside>
          </section>

          {/* LEVEL 3: INTERACTIVE ARCHITECTURAL TABS */}
          <section className="space-y-8 pt-4">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 dark:border-[#1A314D]">
              {l3Labels.map((tab) => {
                const isSelected = activeL3Tab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveL3Tab(tab.id)}
                    className={`relative px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'text-[#0B1A2D] dark:text-white after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-[#B7F229]'
                        : 'text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeL3Tab === 'capabilities' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeSegment.capabilities.map((cap, idx) => (
                  <div
                    key={cap.title}
                    className="p-7 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      <span className="font-mono text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                        0{idx + 1}
                      </span>
                      <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white">
                        {cap.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {cap.desc}
                      </p>
                      <ul className="space-y-2 pt-3 border-t border-slate-200/80 dark:border-[#1A314D] text-xs text-slate-700 dark:text-slate-300">
                        {cap.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 dark:border-[#1A314D] text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {cap.specLabel}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeL3Tab === 'workflow' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-200/90 dark:border-[#1A314D] rounded-2xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200/90 dark:divide-[#1A314D] bg-[#F7F9FC] dark:bg-[#0E2239]">
                {activeSegment.workflow.map((step) => (
                  <div key={step.number} className="p-6 sm:p-7 space-y-3">
                    <span className="font-mono text-lg font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                      {step.number}
                    </span>
                    <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeL3Tab === 'deployment' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {activeSegment.deployment.map((item) => (
                    <div
                      key={item.label}
                      className="p-6 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] space-y-2"
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

                <div className="p-7 rounded-2xl border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] space-y-4">
                  <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white">
                    {activeSegment.outcomeTitle}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {activeSegment.outcomes.map((outcome) => (
                      <div
                        key={outcome}
                        className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          <CorporateCtaBanner
            eyebrow={`Setmio Pro · ${activeSegment.shortTitle}`}
            title={`Pon en marcha Setmio para ${activeSegment.shortTitle.toLowerCase()}`}
            subtitle="Solicita una demostración aplicada a tu estructura real o inicia tu periodo de prueba de 30 días sin compromiso."
            primaryLabel="Empezar prueba de 30 días"
            onPrimary={handleRegisterClick}
            secondaryLabel="Ver precios y planes"
            onSecondary={() => navigate('/precios', 'pricing')}
          />
        </CorporateContainer>
      </main>
    );
  }

  // LEVEL 1 HUB: /soluciones
  const proPlayerSegment = SETMIO_PRO_SEGMENTS.find((s) => s.id === 'profesionales');

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white py-12 sm:py-16 transition-colors duration-200">
      <CorporateContainer className="space-y-16">
        <CorporateBreadcrumb
          items={[
            { label: 'Inicio', onClick: () => navigate('/', 'home') },
            { label: 'Soluciones' },
          ]}
          onBack={onBack}
          backLabel="Volver al inicio"
        />

        {/* Hub Intro */}
        <section className="max-w-3xl space-y-4">
          <CorporateEyebrow>Setmio Pro & Setmio Player</CorporateEyebrow>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
            Soluciones adaptadas a cada perfil profesional y competitivo del pádel.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Selecciona tu tipo de entidad para consultar capacidades operativas, flujos diarios y alcance de implantación en detalle.
          </p>
        </section>

        {/* SECTION 1: SETMIO PRO (FIRST IN HIERARCHY) */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-[#1A314D] pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Nivel 1 · Gestión B2B e Institucional
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-white mt-1 font-display">
                Setmio Pro
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              7 perfiles profesionales · De clubes a Jugador Profesional
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SETMIO_PRO_CORE_SEGMENTS.map((seg) => {
              const Icon = SEGMENT_ICONS[seg.id];
              return (
                <article
                  key={seg.id}
                  className="p-7 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/60 transition-colors flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] text-[#B7F229] dark:text-[#0B1A2D] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                        {seg.order}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-[#0B1A2D] dark:text-white font-display">
                        {seg.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {seg.summary}
                      </p>
                    </div>

                    <ul className="space-y-2 pt-3 border-t border-slate-200/80 dark:border-[#1A314D] text-xs text-slate-700 dark:text-slate-300">
                      {seg.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectRole(seg.id)}
                    className="w-full max-w-full min-h-[42px] px-4 py-2.5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#132A45] dark:hover:bg-[#1B385C] dark:text-white dark:border dark:border-[#244163] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-normal text-center"
                  >
                    <span>Explorar {seg.shortTitle}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </article>
              );
            })}
          </div>

          {proPlayerSegment && (
            <div className="p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#132A45] text-[#0B1A2D] dark:text-[#B7F229] flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {proPlayerSegment.order} · {proPlayerSegment.badge}
                  </div>
                  <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white">
                    {proPlayerSegment.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                    {proPlayerSegment.summary}
                  </p>
                </div>
              </div>

              <CorporateSecondaryButton
                onClick={() => handleSelectRole('profesionales')}
                className="shrink-0"
              >
                Ver Jugador Profesional
              </CorporateSecondaryButton>
            </div>
          )}
        </section>

        {/* SECTION 2: SETMIO PLAYER (SECOND IN HIERARCHY, NO MARKETPLACE) */}
        <section className="rounded-3xl bg-[#F7F9FC] dark:bg-[#081424] border border-slate-200/90 dark:border-[#1A314D] p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0B1A2D] dark:text-[#B7F229]">
                <Users className="w-4 h-4" />
                <span>Setmio Player · Experiencia Individual</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-white font-display">
                Estadísticas personales, análisis de rivales y conexión directa con tu club.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Herramienta diseñada para que el jugador siga su rendimiento partido a partido, analice parejas y rivales, reciba pautas de entrenador con IA y acceda directamente al enlace de reserva de sus clubes.
              </p>
            </div>

            <div className="shrink-0">
              <CorporatePrimaryButton onClick={() => navigate('/para-jugadores', 'players_app')}>
                Explorar Setmio Player
              </CorporatePrimaryButton>
            </div>
          </div>
        </section>

        <CorporateCtaBanner
          title="¿No tienes claro qué configuración se adapta mejor a tu entidad?"
          subtitle="Te mostramos en directo cómo opera la plataforma aplicada a tu número de pistas, escuela, federación o equipo."
          primaryLabel="Solicitar prueba de 30 días"
          onPrimary={handleRegisterClick}
          secondaryLabel="Explorar demo interactiva"
          onSecondary={onOpenDemo}
        />
      </CorporateContainer>
    </main>
  );
}

export default SolucionesPage;
