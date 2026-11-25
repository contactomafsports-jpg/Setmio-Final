import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  Layers,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useApp, PublicPage } from '../../context/AppContext';
import { RoleSelectorModal } from '../common/RoleSelectorModal';
import {
  CorporateContainer,
  CorporateCtaBanner,
  CorporateEyebrow,
  CorporateNavyButton,
  CorporateSecondaryButton,
  navigateCorporateRoute,
} from './corporate/CorporatePrimitives';

interface PricingViewProps {
  onBack?: () => void;
  onOpenDemo?: () => void;
  onOpenRegister?: () => void;
}

interface PricingTier {
  id: string;
  order: string;
  param: string;
  badge: string;
  name: string;
  profiles: string;
  modulesSummary: string;
  priceMonthly: number;
  priceYearly: number;
  desc: string;
  includedModules: { label: string; isAi?: boolean }[];
  cta: string;
  featured: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'esencial',
    order: '01',
    param: 'esencial',
    badge: 'Inicio Modular',
    name: 'Esencial',
    profiles: 'Entrenadores, Equipos independientes y Jugador Profesional',
    modulesSummary: '3 módulos base',
    priceMonthly: 79,
    priceYearly: 65,
    desc: 'Para profesionales técnicos, equipos de liga y atletas que gestionan su agenda, convocatorias o presencia digital propia.',
    includedModules: [
      { label: 'Agenda de clases, convocatorias o calendario oficial' },
      { label: 'Gestión de bonos, cuotas de plantilla y cobros online' },
      { label: 'Constructor de alineaciones, seguimiento y marca propia' },
      { label: 'Conexión directa con Setmio Player para alumnos o equipo' },
      { label: 'Soporte técnico directo y actualizaciones incluidas' },
    ],
    cta: 'Registrarse',
    featured: false,
  },
  {
    id: 'club',
    order: '02',
    param: 'club',
    badge: 'Más habitual',
    name: 'Club & Academia',
    profiles: 'Clubes de Pádel y Academias o Escuelas deportivas',
    modulesSummary: '6 módulos conectados',
    priceMonthly: 149,
    priceYearly: 119,
    desc: 'Operación integral para centros deportivos con cuadrante de pistas, escuela por niveles, competición social y cobro directo.',
    includedModules: [
      { label: 'Cuadrante Inteligente de Reservas y Partidos Abiertos' },
      { label: 'Escuelas, Grupos por Nivel, Asistencia y Evaluaciones' },
      { label: 'Torneos, Ligas y Cuadros Automáticos en vivo' },
      { label: 'Pagos Divididos 1/4, Monedero de Club y Remesas SEPA' },
      { label: 'Gestión de Equipos del club y 0 % comisiones por pista' },
    ],
    cta: 'Registrarse',
    featured: true,
  },
  {
    id: 'pro_360',
    order: '03',
    param: 'pro',
    badge: 'Marca Blanca + IoT',
    name: 'Pro 360',
    profiles: 'Clubes de alto volumen, Cadenas multi-sede y Academias Pro',
    modulesSummary: 'Ecosistema completo (8 módulos + IoT)',
    priceMonthly: 249,
    priceYearly: 199,
    desc: 'Para instalaciones que operan bajo dominio propio, automatización 24/7 sin recepción, TPV completo y atención inteligente.',
    includedModules: [
      { label: 'Todos los módulos de Club & Academia sin límite de pistas' },
      { label: 'Marca Blanca completa, Dominio Propio SSL y App PWA' },
      { label: 'TPV Bar, Tienda Pro-Shop, Test de Palas y Facturación AEAT' },
      { label: 'Asistente IA 24/7 conectado a web, cuadrante y WhatsApp', isAi: true },
      { label: 'Domótica IoT para focos LED y control de accesos por PIN' },
    ],
    cta: 'Registrarse',
    featured: false,
  },
];

const INSTITUTIONAL_MODULES = [
  'Reglas de empadronamiento, tasas públicas y cesión a clubes locales',
  'Censo de licencias federativas, circuitos oficiales, rankings y actas arbitrales',
  'Apertura autónoma por PIN, control eléctrico LED y reporting para auditoría',
  'Despliegue multi-sede o red de clubes con documentación técnica de contratación',
];

export const PricingView: React.FC<PricingViewProps> = ({
  onBack: _onBack,
  onOpenDemo,
  onOpenRegister,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [localDemoModalOpen, setLocalDemoModalOpen] = useState(false);
  const { setPublicPage } = useApp();

  void _onBack;

  const navigate = (path: string, page: PublicPage) => {
    navigateCorporateRoute(path, page, setPublicPage);
  };

  const handleSelectPlan = (tier: PricingTier) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({ plan: tier.param }, '', `/registro?plan=${tier.param}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    onOpenRegister?.();
  };

  const handleRegisterCta = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/registro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    onOpenRegister?.();
  };

  const handleOpenDemoClick = () => {
    if (onOpenDemo) {
      onOpenDemo();
    } else {
      setLocalDemoModalOpen(true);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200 overflow-x-clip">
      {/* 1. COMPACT HERO & PERIOD TOGGLE */}
      <section className="border-b border-slate-200/80 dark:border-[#1A314D] py-7 sm:py-11">
        <CorporateContainer className="space-y-6 sm:space-y-8">
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
              Precios
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 animate-float-in">
            <div className="max-w-2xl space-y-3.5">
              <CorporateEyebrow accent="lime">Setmio Pro · Suscripción Modular</CorporateEyebrow>
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
                Planes escalonados según los módulos de tu organización.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                El 100 % de las reservas y cuotas va directamente a tu cuenta bancaria, sin comisiones por pista ni retenciones por jugador.
              </p>
            </div>

            {/* Clean Mensual / Anual Switcher */}
            <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
              <div
                role="group"
                aria-label="Periodo de suscripción"
                className="inline-flex items-center gap-1.5 p-1 rounded-xl border border-slate-200/90 dark:border-[#1A314D] bg-[#F7F9FC] dark:bg-[#0E2239]"
              >
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  aria-pressed={billingCycle === 'monthly'}
                  className={`min-h-[38px] px-4 sm:px-5 py-2 rounded-lg text-xs font-bold transition-colors duration-150 motion-reduce:transition-none cursor-pointer whitespace-nowrap ${
                    billingCycle === 'monthly'
                      ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white'
                  }`}
                >
                  Mensual
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  aria-pressed={billingCycle === 'yearly'}
                  className={`min-h-[38px] px-4 sm:px-5 py-2 rounded-lg text-xs font-bold transition-colors duration-150 motion-reduce:transition-none cursor-pointer inline-flex items-center gap-2 whitespace-nowrap ${
                    billingCycle === 'yearly'
                      ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white'
                  }`}
                >
                  <span>Anual</span>
                  <span
                    className={`font-mono text-[10px] tabular-nums ${
                      billingCycle === 'yearly'
                        ? 'text-[#B7F229] dark:text-[#0B1A2D]/80'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    −20%
                  </span>
                </button>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Todas las suscripciones conllevan un coste único de instalación inicial.
              </span>
            </div>
          </div>
        </CorporateContainer>
      </section>

      {/* 2. 3 ESCALATED MODULAR PLANS + CUSTOM INSTITUTIONAL TIER */}
      <section className="py-12 sm:py-16 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
        <CorporateContainer className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {PRICING_TIERS.map((tier) => {
              const price = billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly;

              return (
                <article
                  key={tier.id}
                  className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none min-w-0 ${
                    tier.featured
                      ? 'bg-[#0B1A2D] dark:bg-[#0E2239] text-white border-2 border-[#B7F229] shadow-lg shadow-[#0B1A2D]/10 dark:shadow-black/30'
                      : 'bg-white dark:bg-[#0E2239] text-[#0B1A2D] dark:text-white border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25'
                  }`}
                >
                  <div className="space-y-5 min-w-0">
                    {/* Tier Header */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span
                          className={`font-bold uppercase tracking-[0.14em] ${
                            tier.featured ? 'text-[#B7F229]' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {tier.badge}
                        </span>
                        <span
                          className={`font-mono font-bold tabular-nums ${
                            tier.featured ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {tier.order}
                        </span>
                      </div>

                      <h2
                        className={`text-2xl font-extrabold font-display tracking-tight ${
                          tier.featured ? 'text-white' : 'text-[#0B1A2D] dark:text-white'
                        }`}
                      >
                        {tier.name}
                      </h2>

                      <p
                        className={`text-xs leading-relaxed ${
                          tier.featured ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {tier.desc}
                      </p>
                    </div>

                    {/* Price & Setup Notice */}
                    <div
                      className={`py-4 border-y space-y-1.5 ${
                        tier.featured ? 'border-[#1A314D]' : 'border-slate-100 dark:border-[#1A314D]'
                      }`}
                    >
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`text-4xl font-extrabold font-mono tabular-nums tracking-tight ${
                            tier.featured ? 'text-[#B7F229]' : 'text-[#0B1A2D] dark:text-white'
                          }`}
                        >
                          {price}€
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            tier.featured ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          / mes · {billingCycle === 'yearly' ? 'pago anual' : 'pago mensual'}
                        </span>
                      </div>
                      <div
                        className={`text-[11px] font-medium ${
                          tier.featured ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        + coste único de instalación y puesta en marcha
                      </div>
                    </div>

                    {/* Fit Profiles & Module Summary */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div
                          className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                            tier.featured ? 'text-[#B7F229]' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          Perfiles recomendados
                        </div>
                        <p
                          className={`text-xs font-semibold leading-snug ${
                            tier.featured ? 'text-white' : 'text-[#0B1A2D] dark:text-slate-200'
                          }`}
                        >
                          {tier.profiles}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Layers
                          className={`w-3.5 h-3.5 shrink-0 ${
                            tier.featured ? 'text-[#B7F229]' : 'text-[#0B1A2D] dark:text-[#B7F229]'
                          }`}
                        />
                        <span>{tier.modulesSummary}</span>
                      </div>
                    </div>

                    {/* Included Modules List */}
                    <ul className="space-y-2.5 pt-1">
                      {tier.includedModules.map((mod) => (
                        <li
                          key={mod.label}
                          className={`text-xs flex items-start gap-2.5 leading-relaxed ${
                            tier.featured ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {mod.isAi ? (
                            <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#8B5CF6] dark:text-[#A78BFA]" />
                          ) : (
                            <Check
                              className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                tier.featured ? 'text-[#B7F229]' : 'text-[#0B1A2D] dark:text-[#B7F229]'
                              }`}
                            />
                          )}
                          <span>{mod.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Unified Card CTA */}
                  <div
                    className={`pt-6 mt-6 border-t ${
                      tier.featured ? 'border-[#1A314D]' : 'border-slate-100 dark:border-[#1A314D]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(tier)}
                      className={`w-full min-h-[44px] px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-150 motion-reduce:transition-none flex items-center justify-center gap-2 cursor-pointer ${
                        tier.featured
                          ? 'bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D]'
                          : 'bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#132A45] dark:hover:bg-[#1B385C] dark:border dark:border-[#2A4A70]'
                      }`}
                    >
                      <span>{tier.cta}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* 4. CUSTOM / INSTITUTIONAL INQUIRY PATH */}
          <article className="rounded-2xl border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              <div className="lg:col-span-8 space-y-4 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  <Building2 className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                  <span>04 · A medida · Administraciones Públicas y Federaciones</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-display">
                    Ayuntamientos, Federaciones y Configuraciones Especiales
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    Presupuesto modular adaptado al número de instalaciones municipales, red de clubes afiliados o requerimientos específicos de integración e infraestructura.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {INSTITUTIONAL_MODULES.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                    >
                      <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 lg:border-l border-slate-200/80 dark:border-[#1A314D] lg:pl-8 flex flex-col justify-between gap-4 min-w-0">
                <div className="space-y-1">
                  <div className="text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-display">
                    A medida
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Incluye estudio técnico de implantación y coste de instalación dimensionado por proyecto.
                  </p>
                </div>

                <CorporateNavyButton
                  onClick={() => navigate('/contacto', 'contact')}
                  className="w-full"
                >
                  Solicitar consulta
                </CorporateNavyButton>
              </div>
            </div>
          </article>

          {/* Transparency Strip: Installation & Setmio Player */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-6 sm:p-7 space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0B1A2D] dark:text-white font-display">
                <ShieldCheck className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                <span>Instalación y puesta en marcha asistida</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Cada alta incluye una tarifa de instalación inicial para configurar tus pistas, tarifas, dominio SSL, pasarela de pagos e importación ordenada de socios y bonos activos.
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-6 sm:p-7 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="text-sm font-bold text-[#0B1A2D] dark:text-white font-display">
                  Setmio Player incluido para tus jugadores
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Tus socios acceden a sus estadísticas, análisis de parejas y reserva directa con tu club sin cuotas adicionales ni intermediarios.
                </p>
              </div>
              <div>
                <CorporateSecondaryButton
                  onClick={() => navigate('/para-jugadores', 'players_app')}
                  className="text-xs px-4 py-2.5 min-h-[40px]"
                >
                  Conocer Setmio Player
                </CorporateSecondaryButton>
              </div>
            </div>
          </div>
        </CorporateContainer>
      </section>

      {/* 3. CLOSING DARK CTA BANNER */}
      <section className="py-14 sm:py-18">
        <CorporateContainer>
          <CorporateCtaBanner
            eyebrow="Setmio Pro · Suscripción modular con instalación guiada"
            title="Activa Setmio Pro en tu organización"
            subtitle="Configuramos tu plataforma con puesta en marcha asistida, migración inicial de datos y sin comisiones por pista."
            primaryLabel="Registrarse"
            onPrimary={handleRegisterCta}
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

export default PricingView;
