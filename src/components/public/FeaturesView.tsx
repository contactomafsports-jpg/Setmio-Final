import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Bot,
  Calendar,
  Check,
  Cpu,
  CreditCard,
  Globe,
  GraduationCap,
  Shield,
  ShoppingBag,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { useApp, PublicPage } from '../../context/AppContext';
import { RoleSelectorModal } from '../common/RoleSelectorModal';
import {
  CorporateBreadcrumb,
  CorporateContainer,
  CorporateCtaBanner,
  CorporateEyebrow,
  CorporatePrimaryButton,
  CorporateSecondaryButton,
  navigateCorporateRoute,
} from './corporate/CorporatePrimitives';
import { CORPORATE_MODULES, FeatureModuleDetail } from './corporate/corporateData';

interface FeaturesViewProps {
  onBack?: () => void;
  onOpenOnboarding?: () => void;
  onOpenDemo?: () => void;
}

const MODULE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'cuadrante-reservas': Calendar,
  'escuela-academias': GraduationCap,
  'torneos-ligas': Trophy,
  'equipos-convocatorias': Shield,
  'pagos-divididos': CreditCard,
  'tpv-facturacion': ShoppingBag,
  'copiloto-ia': Bot,
  'marca-blanca': Globe,
};

type ModuleFilter = 'all' | FeatureModuleDetail['category'];

export const FeaturesView: React.FC<FeaturesViewProps> = ({
  onBack,
  onOpenOnboarding,
  onOpenDemo,
}) => {
  const { setPublicPage, setIsCorporateLanding } = useApp();
  const [filter, setFilter] = useState<ModuleFilter>('all');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [localDemoModalOpen, setLocalDemoModalOpen] = useState(false);

  useEffect(() => {
    const syncFromPath = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname;
      if (path.startsWith('/modulos/') || path.startsWith('/funcionalidades/')) {
        const slug = path.replace(/^\/(modulos|funcionalidades)\//, '').trim();
        const found = CORPORATE_MODULES.find((m) => m.id === slug);
        setSelectedModuleId(found ? found.id : null);
      } else {
        setSelectedModuleId(null);
      }
    };
    syncFromPath();
    window.addEventListener('popstate', syncFromPath);
    return () => window.removeEventListener('popstate', syncFromPath);
  }, []);

  const navigate = (path: string, page: PublicPage) => {
    navigateCorporateRoute(path, page, setPublicPage);
  };

  const handleBackRoot = () => {
    if (onBack) {
      onBack();
    } else {
      setIsCorporateLanding(true);
      navigate('/', 'home');
    }
  };

  const handleSelectModule = (id: string) => {
    setSelectedModuleId(id);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/modulos/${id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToCatalog = () => {
    setSelectedModuleId(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/funcionalidades');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenOnboardingClick = () => {
    if (onOpenOnboarding) {
      onOpenOnboarding();
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/registro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleOpenDemoClick = () => {
    if (onOpenDemo) {
      onOpenDemo();
    } else {
      setLocalDemoModalOpen(true);
    }
  };

  const selectedModule = selectedModuleId
    ? CORPORATE_MODULES.find((m) => m.id === selectedModuleId) || null
    : null;

  // LEVEL 3 MODULE DETAIL VIEW
  if (selectedModule) {
    const Icon = MODULE_ICONS[selectedModule.id] || Calendar;
    const isAiModule = selectedModule.id === 'copiloto-ia';
    const siblingModules = CORPORATE_MODULES.filter((m) => m.id !== selectedModule.id).slice(0, 3);

    return (
      <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200 overflow-x-clip">
        <section className="border-b border-slate-200/80 dark:border-[#1A314D] py-10 sm:py-16">
          <CorporateContainer className="space-y-10 sm:space-y-12">
            <CorporateBreadcrumb
              items={[
                { label: 'Inicio', onClick: () => navigate('/', 'home') },
                { label: 'Funcionalidades', onClick: handleBackToCatalog },
                { label: selectedModule.title },
              ]}
              onBack={handleBackToCatalog}
              backLabel="Todos los módulos"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start animate-float-in">
              <div className="lg:col-span-8 space-y-5 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`w-10 h-10 rounded-xl inline-flex items-center justify-center shrink-0 ${
                      isAiModule
                        ? 'bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/15 border border-[#8B5CF6]/25 text-[#8B5CF6] dark:text-[#A78BFA]'
                        : 'bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <CorporateEyebrow accent={isAiModule ? 'violet' : 'lime'}>
                    {selectedModule.order} · {selectedModule.categoryLabel}
                  </CorporateEyebrow>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
                  {selectedModule.title}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {selectedModule.fullDesc}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                  <CorporatePrimaryButton onClick={handleOpenOnboardingClick}>
                    Registrarse
                  </CorporatePrimaryButton>
                  <CorporateSecondaryButton onClick={handleOpenDemoClick}>
                    Explorar demo por perfil
                  </CorporateSecondaryButton>
                </div>
              </div>

              <aside className="lg:col-span-4 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-6 space-y-5 min-w-0">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Perfiles compatibles
                  </div>
                  <ul className="mt-3 space-y-2 text-xs font-semibold text-[#0B1A2D] dark:text-slate-200">
                    {selectedModule.applicableProfiles.map((prof) => (
                      <li key={prof} className="flex items-center gap-2">
                        <span
                          className={`h-[2px] w-3 shrink-0 ${
                            isAiModule
                              ? 'bg-[#8B5CF6] dark:bg-[#A78BFA]'
                              : 'bg-[#0B1A2D] dark:bg-[#B7F229]'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{prof}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200/80 dark:border-[#1A314D]">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Operación diaria
                  </div>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {selectedModule.workflowNotes.map((note) => (
                      <li key={note} className="leading-relaxed">
                        · {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </CorporateContainer>
        </section>

        <section className="py-14 sm:py-20 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
          <CorporateContainer className="space-y-12">
            <div className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-7 sm:p-9 space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1A2D] dark:text-white font-display">
                Capacidades incluidas en este módulo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedModule.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/80 dark:border-[#1A314D] flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200"
                  >
                    <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white font-display">
                Otros módulos relacionados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {siblingModules.map((mod) => {
                  const modIsAi = mod.id === 'copiloto-ia';
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => handleSelectModule(mod.id)}
                      className="text-left p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none space-y-3 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono font-bold">
                        <span className={modIsAi ? 'text-[#8B5CF6] dark:text-[#A78BFA]' : 'text-[#0B1A2D] dark:text-[#B7F229]'}>
                          {mod.order}
                        </span>
                        <span className="font-sans font-medium text-slate-500 dark:text-slate-400">
                          {mod.categoryLabel}
                        </span>
                      </div>
                      <div className="text-base font-bold text-[#0B1A2D] dark:text-white font-display group-hover:underline">
                        {mod.title}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {mod.shortDesc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </CorporateContainer>
        </section>

        <section className="py-16 sm:py-20">
          <CorporateContainer>
            <CorporateCtaBanner
              eyebrow="Setmio Pro · Suscripción modular con alta guiada"
              title="Activa la plataforma completa bajo tu propia marca"
              subtitle="Todos los módulos comparten una única base de socios, pistas y facturación con implantación asistida y sin comisiones por pista."
              primaryLabel="Registrarse"
              onPrimary={handleOpenOnboardingClick}
              secondaryLabel="Explorar demo por perfil"
              onSecondary={handleOpenDemoClick}
            />
          </CorporateContainer>
        </section>

        <RoleSelectorModal
          isOpen={localDemoModalOpen}
          onClose={() => setLocalDemoModalOpen(false)}
        />
      </div>
    );
  }

  // LEVEL 1 & LEVEL 2 CATALOG VIEW
  const categories: { id: ModuleFilter; label: string; count: number }[] = [
    { id: 'all', label: 'Todos', count: CORPORATE_MODULES.length },
    {
      id: 'operacion',
      label: 'Operación y Pistas',
      count: CORPORATE_MODULES.filter((m) => m.category === 'operacion').length,
    },
    {
      id: 'escuela',
      label: 'Escuela y Equipos',
      count: CORPORATE_MODULES.filter((m) => m.category === 'escuela').length,
    },
    {
      id: 'ingresos',
      label: 'Ingresos y TPV',
      count: CORPORATE_MODULES.filter((m) => m.category === 'ingresos').length,
    },
    {
      id: 'ia',
      label: 'IA y Marca Blanca',
      count: CORPORATE_MODULES.filter((m) => m.category === 'ia').length,
    },
  ];

  const visibleModules =
    filter === 'all'
      ? CORPORATE_MODULES
      : CORPORATE_MODULES.filter((m) => m.category === filter);

  return (
    <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200 overflow-x-clip">
      {/* 1. HERO & WRAPPED FILTER BAR */}
      <section className="border-b border-slate-200/80 dark:border-[#1A314D] py-10 sm:py-16">
        <CorporateContainer className="space-y-10">
          <CorporateBreadcrumb
            items={[
              { label: 'Inicio', onClick: () => navigate('/', 'home') },
              { label: 'Funcionalidades' },
            ]}
            onBack={handleBackRoot}
            backLabel="Volver al inicio"
          />

          <div className="max-w-3xl space-y-4 animate-float-in">
            <CorporateEyebrow accent="lime">Setmio Pro · Ecosistema Modular</CorporateEyebrow>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
              Módulos conectados para operar cada área de tu organización.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Activa reservas, escuelas, torneos, gestión de equipos, TPV, pagos divididos, asistente IA y marca blanca sobre una base unificada.
            </p>
          </div>

          {/* Multi-line Wrapped Category Filters — Fully Visible Without Horizontal Clipping */}
          <div
            role="tablist"
            aria-label="Filtrar módulos por área"
            className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2"
          >
            {categories.map((cat) => {
              const active = filter === cat.id;
              const isAiCategory = cat.id === 'ia';

              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(cat.id)}
                  className={`inline-flex items-center gap-2 min-h-[40px] px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 motion-reduce:transition-none cursor-pointer border ${
                    active
                      ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229] shadow-xs'
                      : 'bg-[#F7F9FC] dark:bg-[#0E2239] text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 hover:text-[#0B1A2D] dark:hover:text-white'
                  }`}
                >
                  {isAiCategory && (
                    <Sparkles
                      className={`w-3.5 h-3.5 shrink-0 ${
                        active
                          ? 'text-[#A78BFA] dark:text-[#0B1A2D]'
                          : 'text-[#8B5CF6] dark:text-[#A78BFA]'
                      }`}
                    />
                  )}
                  <span>{cat.label}</span>
                  <span
                    className={`font-mono text-[10px] tabular-nums px-1.5 py-0.5 rounded-md ${
                      active
                        ? 'bg-white/15 text-[#B7F229] dark:bg-[#0B1A2D]/15 dark:text-[#0B1A2D]'
                        : 'bg-slate-200/70 dark:bg-[#132A45] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {String(cat.count).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        </CorporateContainer>
      </section>

      {/* 2. UNIFORM MODULE CARDS CATALOG */}
      <section className="py-14 sm:py-20 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
        <CorporateContainer className="space-y-8">
          <div
            key={filter}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch animate-float-in"
          >
            {visibleModules.map((mod) => {
              const Icon = MODULE_ICONS[mod.id] || Calendar;
              const isAiModule = mod.id === 'copiloto-ia';

              return (
                <article
                  key={mod.id}
                  className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none flex flex-col justify-between space-y-6 min-w-0"
                >
                  <div className="space-y-4 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isAiModule
                            ? 'bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/15 border border-[#8B5CF6]/25 text-[#8B5CF6] dark:text-[#A78BFA]'
                            : 'bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-right">
                        <span
                          className={`font-mono font-bold tabular-nums mr-1.5 ${
                            isAiModule
                              ? 'text-[#8B5CF6] dark:text-[#A78BFA]'
                              : 'text-[#0B1A2D] dark:text-[#B7F229]'
                          }`}
                        >
                          {mod.order}
                        </span>
                        · {mod.categoryLabel}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-[#0B1A2D] dark:text-white font-display leading-snug">
                        {mod.title}
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {mod.shortDesc}
                      </p>
                    </div>

                    <ul className="space-y-2.5 pt-3.5 border-t border-slate-100 dark:border-[#1A314D] text-xs text-slate-700 dark:text-slate-300">
                      {mod.bullets.slice(0, 3).map((b) => (
                        <li key={b} className="flex items-start gap-2.5">
                          <Check
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isAiModule
                                ? 'text-[#8B5CF6] dark:text-[#A78BFA]'
                                : 'text-[#0B1A2D] dark:text-[#B7F229]'
                            }`}
                          />
                          <span className="leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between gap-3">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                      {mod.applicableProfiles[0]}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectModule(mod.id)}
                      className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:underline transition-colors cursor-pointer shrink-0"
                    >
                      <span>Ver detalle técnico</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transform-none" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Slim Architectural Cross-Link to Hardware / Domótica */}
          <div className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-[#0B1A2D] dark:text-white font-display">
                  Domótica e Iluminación IoT conectada al cuadrante
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Automatiza focos LED, cerraduras PIN y tornos de acceso para operar franjas sin recepción presencial.
                </p>
              </div>
            </div>

            <CorporateSecondaryButton
              onClick={() => navigate('/domotica', 'modules')}
              className="shrink-0 text-xs px-4 py-2.5 min-h-[40px]"
            >
              Ver Domótica y Accesos
            </CorporateSecondaryButton>
          </div>
        </CorporateContainer>
      </section>

      {/* 3. CLOSING DARK CTA BANNER — Aligned with Setmio Subscription & Guided Setup */}
      <section className="py-16 sm:py-20">
        <CorporateContainer>
          <CorporateCtaBanner
            eyebrow="Setmio Pro · Suscripción modular con alta guiada"
            title="Activa la plataforma completa bajo tu propia marca"
            subtitle="Configuramos tu entidad bajo dominio propio con migración asistida de datos, puesta en marcha guiada y sin comisiones por pista."
            primaryLabel="Registrarse"
            onPrimary={handleOpenOnboardingClick}
            secondaryLabel="Explorar demo por perfil"
            onSecondary={handleOpenDemoClick}
          />
        </CorporateContainer>
      </section>

      <RoleSelectorModal
        isOpen={localDemoModalOpen}
        onClose={() => setLocalDemoModalOpen(false)}
      />
    </div>
  );
};

