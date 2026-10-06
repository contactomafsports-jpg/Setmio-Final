import React, { useState } from 'react';
import { Check, Sparkles, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { useApp } from '../../context/AppContext';

interface PricingViewProps {
  onBack: () => void;
  onOpenDemo: () => void;
  onOpenRegister?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onBack, onOpenDemo, onOpenRegister }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { t } = useApp();

  const pricingTiers = [
    {
      id: 'coach',
      badge: 'Entrenadores & Academias',
      name: 'Plan Coach',
      priceMonthly: 39,
      priceYearly: 32,
      description: 'Para entrenadores individuales, preparadores físicos y pequeñas escuelas sin instalaciones propias.',
      features: [
        'Hasta 40 alumnos activos simultáneos',
        'Cobro recurrente mensual de cuotas',
        'Cuadrante táctil de clases particulares',
        'Ficha técnica y seguimiento de nivel de juego',
        'Portal web propio del profesor',
      ],
      featured: false,
      ctaText: 'Elegir Plan Coach',
    },
    {
      id: 'club_base',
      badge: 'Más Demandado',
      badgeHighlight: true,
      name: 'Plan Club Base',
      priceMonthly: 79,
      priceYearly: 65,
      description: 'Ideal para clubes de pádel de hasta 4 pistas que desean informatizar sus reservas y automatizar cobros.',
      features: [
        'Hasta 4 pistas de pádel',
        'Reservas online ilimitadas sin comisiones',
        'Web y App móvil de marca blanca',
        'Split Payments (1/4 por jugador)',
        'Control básico de socios e ingresos',
        'Soporte técnico prioritario por WhatsApp',
      ],
      featured: true,
      ctaText: 'Empezar con Club Base',
    },
    {
      id: 'club_pro',
      badge: 'Clubes en Crecimiento',
      name: 'Plan Club Pro',
      priceMonthly: 149,
      priceYearly: 119,
      description: 'Para clubes completos con escuela, torneos oficiales, bar cafetería y automatización domótica de pistas.',
      features: [
        'Pistas ilimitadas',
        'Módulo completo de Escuela y Academias',
        'Domótica IoT (Encendido automático de luces LED)',
        'Apertura de pistas por PIN y Código QR',
        'TPV Táctil de Bar, Cafetería y Tienda',
        'Gestor de Torneos, Ligas y Rankings FEP',
        'Copiloto IA 24/7 en WhatsApp oficial',
      ],
      featured: false,
      ctaText: 'Elegir Plan Pro',
    },
    {
      id: 'enterprise',
      badge: 'Cadenas & Franquicias',
      name: 'Plan Enterprise',
      priceMonthly: null,
      priceYearly: null,
      description: 'Solución a medida para grandes complejos deportivos, cadenas multi-club y federaciones de pádel.',
      features: [
        'Gestión multi-sede centralizada',
        'Dominio propio personalizado (tuclub.com)',
        'Integración API con tornos y cerraduras industriales',
        'Facturación electrónica y remesas SEPA bancarias',
        'Gestor de cuenta y onboarding presencial dedicado',
        'SLA garantizado del 99.9% de disponibilidad',
      ],
      featured: false,
      ctaText: 'Contactar con Setmio',
    },
  ];

  const handleAction = () => {
    if (onOpenDemo) {
      onOpenDemo();
    } else if (onOpenRegister) {
      onOpenRegister();
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Navigation alineada limpiamente a la izquierda */}
        <div className="flex items-center justify-start">
          <SubpageHeaderNav onBack={onBack} />
        </div>

        {/* Header Estrictamente Centrado */}
        <div className="space-y-6 text-center">
          <div className="max-w-3xl mx-auto space-y-4 text-center">
            <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tarifas Transparentes · Sin Comisiones Ocultas</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Planes adaptados a la dimensión real de tu club
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Todos los planes incluyen actualizaciones gratuitas, soporte telefónico, web pública y app móvil de marca blanca sin intermediarios.
            </p>

            {/* Selector de Periodo de Facturación Estrictamente Centrado */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <span
                className={`text-xs font-bold transition-colors ${
                  billingCycle === 'monthly' ? 'text-slate-900 dark:text-white font-black' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Facturación Mensual
              </span>

              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 rounded-full bg-emerald-600 transition p-0.5 cursor-pointer shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                aria-label="Alternar facturación mensual y anual"
              >
                <span
                  className={`block w-6 h-6 rounded-full bg-white transition-transform duration-200 shadow-md ${
                    billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>

              <span
                className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  billingCycle === 'yearly' ? 'text-slate-900 dark:text-white font-black' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <span>Facturación Anual</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-[10px] tracking-wide border border-emerald-500/30">
                  Ahorra 2 meses (20%)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Grid de Precios con Cada Tarjeta Estrictamente Centrada */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {pricingTiers.map((tier) => {
            const price = billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly;

            return (
              <article
                key={tier.id}
                className={`relative rounded-3xl p-7 flex flex-col justify-between text-center items-center transition-all duration-200 hover:-translate-y-1.5 shadow-sm hover:shadow-xl ${
                  tier.featured
                    ? 'bg-white dark:bg-slate-900 border-2 border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg'
                    : 'bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800'
                }`}
              >
                {/* Badge Superior Centrado */}
                <div className="w-full flex justify-center mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      tier.badgeHighlight
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>

                {/* Contenido Principal de la Tarjeta Estrictamente Centrado */}
                <div className="w-full space-y-4 flex flex-col items-center text-center">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center">
                    {tier.name}
                  </h2>

                  {/* Precio Centrado */}
                  <div className="flex items-baseline justify-center gap-1 border-b border-slate-100 dark:border-slate-800/80 pb-4 w-full">
                    {price === null ? (
                      <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        A medida
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                          {price}€
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                          /mes
                        </span>
                      </>
                    )}
                  </div>

                  {/* Descripción Centrada */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 min-h-12 leading-relaxed text-center px-1">
                    {tier.description}
                  </p>

                  {/* Lista de Características Centrada */}
                  <ul className="w-full space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col items-center text-center">
                    {tier.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 text-center"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="text-center">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botón de Acción Centrado */}
                <div className="w-full pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex justify-center">
                  <button
                    type="button"
                    onClick={handleAction}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
                      tier.featured
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 shadow-md'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Garantía y FAQ Breve Estrictamente Centrado */}
        <section className="rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white text-center">
            Garantía Setmio: 30 Días de Prueba Sin Compromiso
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-center">
            Configuramos tu club, importamos tu base de socios y te formamos a ti y a tu equipo de recepción de forma completamente gratuita. Sin contratos de permanencia ni costes de alta ocultos.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleAction}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
            >
              <span>Solicitar Demo o Alta Directa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};
