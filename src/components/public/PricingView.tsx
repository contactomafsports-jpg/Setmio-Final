import React, { useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
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

interface PricingViewProps {
  onBack: () => void;
  onOpenDemo: () => void;
  onOpenRegister?: () => void;
}

interface PricingTier {
  id: string;
  param: string;
  badge: string;
  name: string;
  priceMonthly: number | null;
  priceYearly: number | null;
  desc: string;
  features: string[];
  cta: string;
  featured: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'coach_teams',
    param: 'coach',
    badge: 'Entrenadores y Equipos',
    name: 'Coach / Equipos',
    priceMonthly: 39,
    priceYearly: 32,
    desc: 'Para entrenadores personales, técnicos de academia y equipos independientes de liga.',
    features: [
      'Agenda de clases o convocatorias de equipo',
      'Control de bonos de alumnos o cuotas de plantilla',
      'Constructor de alineaciones y seguimiento técnico',
      'Enlace propio de marca personal o equipo',
      'Soporte directo sin permanencia',
    ],
    cta: 'Empezar prueba de 30 días',
    featured: false,
  },
  {
    id: 'club_base',
    param: 'club',
    badge: 'Más habitual',
    name: 'Club Base',
    priceMonthly: 79,
    priceYearly: 65,
    desc: 'Operación integral para clubes de hasta 8 pistas y escuelas deportivas activas.',
    features: [
      'Cuadrante de reservas web y recepción en tiempo real',
      'Pago dividido entre jugadores y monedero de club',
      'Módulo de escuela, grupos y remesas SEPA',
      'Torneos sociales, ligas y partidos abiertos',
      '0% de comisiones por reserva en tus pistas',
      'Migración asistida inicial incluida',
    ],
    cta: 'Activar Club Base',
    featured: true,
  },
  {
    id: 'club_pro',
    param: 'profesional',
    badge: 'Marca Blanca + IoT',
    name: 'Club Pro',
    priceMonthly: 149,
    priceYearly: 119,
    desc: 'Para clubes de alto volumen que operan con domótica 24/7, TPV completo y dominio propio.',
    features: [
      'Todo lo incluido en Club Base sin límite de pistas',
      'Dominio personalizado SSL y app PWA de marca blanca',
      'Domótica IoT para encendido de LED y accesos PIN',
      'TPV táctil de bar, cafetería, tienda y Test Center',
      'Asistente IA de atención conectado a WhatsApp y web',
      'Facturación adaptada a VeriFactu y TicketBAI',
    ],
    cta: 'Activar Club Pro',
    featured: false,
  },
  {
    id: 'enterprise',
    param: 'enterprise',
    badge: 'Institucional',
    name: 'Enterprise & Público',
    priceMonthly: null,
    priceYearly: null,
    desc: 'Para ayuntamientos, administraciones públicas, federaciones y cadenas multi-sede.',
    features: [
      'Gestión multi-sede o red completa de clubes afiliados',
      'Reglas de empadronamiento y tasas públicas municipales',
      'Censo de licencias federativas, circuitos y actas',
      'Soporte de despliegue y documentación técnica para licitación',
      'Aislamiento dedicado e integraciones a medida',
    ],
    cta: 'Solicitar propuesta',
    featured: false,
  },
];

export const PricingView: React.FC<PricingViewProps> = ({
  onBack,
  onOpenDemo,
  onOpenRegister,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { setPublicPage } = useApp();

  const navigate = (path: string, page: PublicPage) => {
    navigateCorporateRoute(path, page, setPublicPage);
  };

  const handleSelectPlan = (tier: PricingTier) => {
    if (tier.id === 'enterprise') {
      navigate('/contacto', 'contact');
      return;
    }
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

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white py-12 sm:py-16 transition-colors duration-200">
      <CorporateContainer className="space-y-14">
        <CorporateBreadcrumb
          items={[
            { label: 'Inicio', onClick: () => navigate('/', 'home') },
            { label: 'Planes y Precios' },
          ]}
          onBack={onBack}
          backLabel="Volver al inicio"
        />

        {/* Header & Cycle Switch */}
        <section className="max-w-3xl mx-auto text-center space-y-5">
          <CorporateEyebrow className="justify-center">
            Suscripción Plana Sin Comisiones
          </CorporateEyebrow>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
            Precios transparentes para cada escala del sector.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            El 100% de las reservas y cuotas van directamente a la cuenta bancaria de tu entidad. Sin retenciones ni peajes por jugador.
          </p>

          <div className="inline-flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0E2239]'
              }`}
            >
              Facturación mensual
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0E2239]'
              }`}
            >
              <span>Facturación anual</span>
              <span className="font-mono text-[10px] opacity-85">−20%</span>
            </button>
          </div>
        </section>

        {/* Pricing Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {PRICING_TIERS.map((tier) => {
            const price = billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly;
            return (
              <article
                key={tier.id}
                className={`rounded-2xl p-7 flex flex-col justify-between transition-colors ${
                  tier.featured
                    ? 'bg-[#0B1A2D] text-white border-2 border-[#B7F229] dark:bg-[#0E2239]'
                    : 'bg-[#F7F9FC] dark:bg-[#0E2239] text-[#0B1A2D] dark:text-white border border-slate-200/90 dark:border-[#1A314D]'
                }`}
              >
                <div className="space-y-5">
                  <div className="space-y-2">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
                        tier.featured ? 'text-[#B7F229]' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {tier.badge}
                    </span>
                    <h2
                      className={`text-xl font-extrabold font-display ${
                        tier.featured ? 'text-white' : 'text-[#0B1A2D] dark:text-white'
                      }`}
                    >
                      {tier.name}
                    </h2>
                  </div>

                  <div
                    className={`pb-5 border-b ${
                      tier.featured ? 'border-[#1A314D]' : 'border-slate-200/80 dark:border-[#1A314D]'
                    }`}
                  >
                    {price === null ? (
                      <div className="text-2xl font-extrabold tracking-tight font-display">
                        A medida
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`text-4xl font-extrabold font-mono tabular-nums tracking-tight ${
                            tier.featured ? 'text-[#B7F229]' : 'text-[#0B1A2D] dark:text-white'
                          }`}
                        >
                          {price}€
                        </span>
                        <span
                          className={`text-xs ${
                            tier.featured ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          / mes
                        </span>
                      </div>
                    )}
                  </div>

                  <p
                    className={`text-xs leading-relaxed ${
                      tier.featured ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {tier.desc}
                  </p>

                  <ul className="space-y-2.5 pt-2">
                    {tier.features.map((feat) => (
                      <li
                        key={feat}
                        className={`text-xs flex items-start gap-2 ${
                          tier.featured ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Check
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            tier.featured ? 'text-[#B7F229]' : 'text-[#0B1A2D] dark:text-[#B7F229]'
                          }`}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`pt-6 mt-6 border-t ${
                    tier.featured ? 'border-[#1A314D]' : 'border-slate-200/80 dark:border-[#1A314D]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(tier)}
                    className={`w-full min-h-[42px] px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      tier.featured
                        ? 'bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D]'
                        : 'bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-white dark:text-[#0B1A2D] dark:hover:bg-slate-100'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* Setmio Player + Migration Guarantee */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-7 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0B1A2D] dark:text-white">
              <ShieldCheck className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />
              <span>Migración inicial sin costes ocultos</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Importamos tu base de socios, bonos activos y calendario actual de pistas en 24 horas para que no pierdas ningún dato ni interrumpas tu actividad diaria.
            </p>
          </div>

          <div className="rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-7 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-bold text-[#0B1A2D] dark:text-white">
                Setmio Player incluido para tus jugadores
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Tus jugadores acceden a sus estadísticas, análisis de parejas y reservas directas con tu club sin cuotas de intermediación.
              </p>
            </div>
            <div>
              <CorporateSecondaryButton onClick={() => navigate('/para-jugadores', 'players_app')}>
                Ver Setmio Player
              </CorporateSecondaryButton>
            </div>
          </div>
        </section>

        <CorporateCtaBanner
          title="Empieza con 30 días de prueba sin permanencia"
          subtitle="Configura tu entidad en minutos o solicita una demo guiada por perfil con nuestro equipo técnico."
          primaryLabel="Crear cuenta gratis"
          onPrimary={handleRegisterCta}
          secondaryLabel="Explorar demo"
          onSecondary={onOpenDemo}
        />
      </CorporateContainer>
    </main>
  );
};

export default PricingView;
