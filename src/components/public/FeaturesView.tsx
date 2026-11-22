import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Bot,
  Calendar,
  Check,
  CreditCard,
  Globe,
  GraduationCap,
  Shield,
  ShoppingBag,
  Trophy,
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
import { CORPORATE_MODULES, FeatureModuleDetail } from './corporate/corporateData';

interface FeaturesViewProps {
  onBack?: () => void;
  onOpenOnboarding?: () => void;
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
}) => {
  const { setPublicPage, setIsCorporateLanding } = useApp();
  const [filter, setFilter] = useState<ModuleFilter>('all');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

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
      window.history.pushState({}, '', '/modulos');
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

  const selectedModule = selectedModuleId
    ? CORPORATE_MODULES.find((m) => m.id === selectedModuleId) || null
    : null;

  // LEVEL 3 MODULE DETAIL VIEW
  if (selectedModule) {
    const Icon = MODULE_ICONS[selectedModule.id] || Calendar;
    const siblingModules = CORPORATE_MODULES.filter((m) => m.id !== selectedModule.id).slice(0, 3);

    return (
      <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white py-12 sm:py-16 transition-colors">
        <CorporateContainer className="space-y-12">
          <CorporateBreadcrumb
            items={[
              { label: 'Inicio', onClick: () => navigate('/', 'home') },
              { label: 'Módulos', onClick: handleBackToCatalog },
              { label: selectedModule.title },
            ]}
            onBack={handleBackToCatalog}
            backLabel="Todos los módulos"
          />

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] text-[#B7F229] dark:text-[#0B1A2D] inline-flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </span>
                <CorporateEyebrow>
                  {selectedModule.order} · {selectedModule.categoryLabel}
                </CorporateEyebrow>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
                {selectedModule.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {selectedModule.fullDesc}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <CorporatePrimaryButton onClick={handleOpenOnboardingClick}>
                  Probar módulo en mi centro
                </CorporatePrimaryButton>
                <CorporateSecondaryButton onClick={() => navigate('/soluciones', 'solutions')}>
                  Ver perfiles compatibles
                </CorporateSecondaryButton>
              </div>
            </div>

            <aside className="lg:col-span-4 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-6 space-y-5">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Perfiles compatibles
                </div>
                <ul className="mt-3 space-y-2 text-xs font-semibold text-[#0B1A2D] dark:text-slate-200">
                  {selectedModule.applicableProfiles.map((prof) => (
                    <li key={prof} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B7F229]" aria-hidden="true" />
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
          </section>

          <section className="rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-7 sm:p-9 space-y-5">
            <h2 className="text-xl font-bold text-[#0B1A2D] dark:text-white font-display">
              Funcionalidades incluidas en este módulo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedModule.bullets.map((bullet) => (
                <div
                  key={bullet}
                  className="p-4 rounded-xl bg-white dark:bg-[#0B1A2D] border border-slate-200/80 dark:border-[#1A314D] flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200"
                >
                  <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white">
              Otros módulos relacionados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {siblingModules.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => handleSelectModule(mod.id)}
                  className="text-left p-6 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/60 transition-colors space-y-3 cursor-pointer group"
                >
                  <div className="text-[11px] font-mono font-bold text-slate-400">
                    {mod.order} · {mod.categoryLabel}
                  </div>
                  <div className="text-base font-bold text-[#0B1A2D] dark:text-white group-hover:underline">
                    {mod.title}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {mod.shortDesc}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <CorporateCtaBanner
            title="Activa la plataforma completa bajo tu propia marca"
            subtitle="Todos los módulos comparten una única base de socios, pistas y facturación sin coste extra por migración."
            primaryLabel="Empezar prueba de 30 días"
            onPrimary={handleOpenOnboardingClick}
            secondaryLabel="Ver precios"
            onSecondary={() => navigate('/precios', 'pricing')}
          />
        </CorporateContainer>
      </main>
    );
  }

  // LEVEL 1 & LEVEL 2 CATALOG VIEW
  const categories: { id: ModuleFilter; label: string }[] = [
    { id: 'all', label: 'Todos los módulos' },
    { id: 'operacion', label: 'Operación y Pistas' },
    { id: 'escuela', label: 'Escuela y Equipos' },
    { id: 'ingresos', label: 'Ingresos y TPV' },
    { id: 'ia', label: 'IA y Marca Blanca' },
  ];

  const visibleModules =
    filter === 'all'
      ? CORPORATE_MODULES
      : CORPORATE_MODULES.filter((m) => m.category === filter);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white py-12 sm:py-16 transition-colors">
      <CorporateContainer className="space-y-12">
        <CorporateBreadcrumb
          items={[
            { label: 'Inicio', onClick: () => navigate('/', 'home') },
            { label: 'Módulos y Funcionalidades' },
          ]}
          onBack={handleBackRoot}
          backLabel="Volver al inicio"
        />

        <section className="max-w-3xl space-y-4">
          <CorporateEyebrow>Ecosistema Modular Setmio</CorporateEyebrow>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
            Módulos conectados para operar cada área de tu organización.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Activa reservas, escuelas, torneos, gestión de equipos, TPV, pagos divididos y marca blanca sobre una base unificada.
          </p>
        </section>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar border-b border-slate-200/80 dark:border-[#1A314D]">
          {categories.map((cat) => {
            const active = filter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0E2239]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Modules Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleModules.map((mod) => {
            const Icon = MODULE_ICONS[mod.id] || Calendar;
            return (
              <article
                key={mod.id}
                className="p-7 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/60 transition-colors flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229]/15 text-[#B7F229] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {mod.order} · {mod.categoryLabel}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-[#0B1A2D] dark:text-white font-display">
                      {mod.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {mod.shortDesc}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-3 border-t border-slate-200/80 dark:border-[#1A314D] text-xs text-slate-700 dark:text-slate-300">
                    {mod.bullets.slice(0, 3).map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {mod.applicableProfiles[0]}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectModule(mod.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:gap-2.5 transition-all cursor-pointer"
                  >
                    <span>Ver detalle técnico</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <CorporateCtaBanner
          eyebrow="Domótica e Iluminación IoT"
          title="¿Necesitas automatizar focos LED y apertura de puertas?"
          subtitle="Conecta el hardware de tus pistas directamente con el cuadrante de reservas para operar horarios no tripulados con seguridad."
          primaryLabel="Ver Domótica y Accesos"
          onPrimary={() => navigate('/domotica', 'modules')}
          secondaryLabel="Solicitar prueba"
          onSecondary={handleOpenOnboardingClick}
        />
      </CorporateContainer>
    </main>
  );
};
