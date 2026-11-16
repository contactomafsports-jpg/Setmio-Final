import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { PlanTier } from '../../types/database';
import {
  CreditCard,
  CheckCircle2,
  Calendar,
  Download,
  Building2,
  X,
  ArrowUpRight,
} from 'lucide-react';

export const AdminSubscription: React.FC = () => {
  const { currentTenant, plans, venues, customers, updateCurrentTenant, triggerDemoToast } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [cardBrand, setCardBrand] = useState('Mastercard');
  const [cardLast4, setCardLast4] = useState('4829');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardHolder, setCardHolder] = useState(currentTenant?.name || 'Centro de Pádel San Mateo');

  const plansSectionRef = useRef<HTMLDivElement>(null);

  const currentPlan = plans.find((p) => p.id === currentTenant.planId) || plans[3] || plans[0];

  const invoices = [
    { id: 'INV-2026-009', date: '01/09/2026', amount: '159,00 €', plan: `${currentPlan.name} Mensual`, status: 'Pagada' },
    { id: 'INV-2026-008', date: '01/08/2026', amount: '159,00 €', plan: `${currentPlan.name} Mensual`, status: 'Pagada' },
    { id: 'INV-2026-007', date: '01/07/2026', amount: '159,00 €', plan: `${currentPlan.name} Mensual`, status: 'Pagada' },
  ];

  const activeVenuesCount = venues?.length || 1;
  const maxVenues = currentPlan.id === 'elite' ? 10 : currentPlan.id === 'pro' ? 3 : 1;
  const storageUsedGb = 2.4;
  const storageLimitGb = Math.max(1, Math.round((currentPlan.storageLimitMb || 20480) / 1024));
  const usersCount = customers?.length || 48;
  const maxUsers = currentPlan.id === 'elite' ? 2500 : currentPlan.id === 'pro' ? 1000 : 300;

  const usageMetrics = [
    {
      id: 'venues',
      label: 'Sedes conectadas',
      valueLabel: `${activeVenuesCount} / ${maxVenues}`,
      percent: Math.min(100, Math.round((activeVenuesCount / maxVenues) * 100)),
      accent: 'primary' as const,
    },
    {
      id: 'storage',
      label: 'Almacenamiento',
      valueLabel: `${storageUsedGb.toFixed(1)} GB / ${storageLimitGb} GB`,
      percent: Math.min(100, Math.max(8, Math.round((storageUsedGb / storageLimitGb) * 100))),
      accent: 'lime' as const,
    },
    {
      id: 'users',
      label: 'Usuarios activos',
      valueLabel: `${usersCount} / ${maxUsers}`,
      percent: Math.min(100, Math.max(6, Math.round((usersCount / maxUsers) * 100))),
      accent: 'primary' as const,
    },
  ];

  const handlePlanChange = (tier: PlanTier) => {
    updateCurrentTenant({ planId: tier });
    triggerDemoToast(
      'Plan actualizado',
      `Suscripción cambiada a ${tier.toUpperCase()}. Los límites del club se han ajustado.`,
      'success'
    );
  };

  const handleSavePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaymentModalOpen(false);
    triggerDemoToast(
      'Método de pago actualizado',
      `${cardBrand} terminada en ${cardLast4} guardada como tarjeta principal.`,
      'success'
    );
  };

  const scrollToPlans = () => {
    plansSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getDisplayPrice = (monthly: number) => {
    if (billingCycle === 'yearly') {
      return Math.round(monthly * 0.85);
    }
    return monthly;
  };

  return (
    <div className="max-w-7xl mx-auto pt-3 pb-24 sm:pb-16 space-y-6 sm:space-y-8 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased animate-in fade-in duration-150">
      {/* =====================================================================
          1. CABECERA LIMPIA
          ===================================================================== */}
      <section className="pt-2 pb-1 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 tracking-wide block mb-1">
            {currentTenant?.name || 'Centro de Pádel San Mateo'}
          </span>
          <h1 className="text-[26px] sm:text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight leading-tight">
            Suscripción
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0E2239] hover:bg-slate-50 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-[#1A314D] flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Actualizar Método de Pago</span>
          </button>

          <button
            type="button"
            onClick={scrollToPlans}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#071220] hover:bg-slate-200/80 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-[#B7F229] font-bold text-xs border border-slate-200/80 dark:border-[#1A314D] flex items-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            <span>Cambiar Plan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* =====================================================================
          2. TARJETA PRINCIPAL DE PLAN ACTUAL + CONSUMO SUTIL
          ===================================================================== */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Resumen del Plan */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full bg-[#B7F229] text-[#0B1A2D] text-[11px] font-extrabold uppercase tracking-wide">
                {currentPlan.name}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6e9e02] dark:bg-[#B7F229]" />
                <span>Suscripción activa</span>
              </span>
            </div>

            <span className="text-xs font-mono text-slate-400">
              {billingCycle === 'yearly' ? 'Facturación anual' : 'Facturación mensual'}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums tracking-tight">
                {getDisplayPrice(currentPlan.priceMonthly).toFixed(2)} €
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                / mes + IVA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {currentPlan.description}
            </p>
          </div>

          {/* Metadatos en fila limpia con divisores sutiles */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#1A314D] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
              <span>
                Renovación: <strong className="text-[#0B1A2D] dark:text-white">01/10/2026</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <CreditCard className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
              <span>
                {cardBrand} ···· <strong className="text-[#0B1A2D] dark:text-white font-mono">{cardLast4}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Building2 className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
              <span>
                CIF: <strong className="text-[#0B1A2D] dark:text-white font-mono">B-15900000</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Consumo de Recursos con Líneas Finas */}
        <div className="lg:col-span-5 lg:border-l lg:border-slate-100 lg:dark:border-[#1A314D] lg:pl-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Límites de Uso
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Hasta {currentPlan.maxCourts} pistas
            </span>
          </div>

          <div className="space-y-4">
            {usageMetrics.map((metric) => (
              <div key={metric.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {metric.label}
                  </span>
                  <span className="font-mono font-bold text-[#0B1A2D] dark:text-white tabular-nums">
                    {metric.valueLabel}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#071220] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      metric.accent === 'lime'
                        ? 'bg-[#B7F229]'
                        : 'bg-[#0B1A2D] dark:bg-[#B7F229]/80'
                    }`}
                    style={{ width: `${metric.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. COMPARATIVA DE PLANES
          ===================================================================== */}
      <section ref={plansSectionRef} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
              Planes Disponibles
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ajusta tu suscripción según las sedes y módulos activos del club.
            </p>
          </div>

          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] text-xs font-bold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
              }`}
            >
              <span>Anual</span>
              <span className="text-[10px] font-mono text-[#6e9e02] dark:text-[#B7F229]">-15%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => {
            const isCurrent = p.id === currentTenant.planId;
            const displayPrice = getDisplayPrice(p.priceMonthly);

            return (
              <div
                key={p.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-5 transition ${
                  isCurrent
                    ? 'bg-white dark:bg-[#0E2239] border-[#0B1A2D] dark:border-[#B7F229] shadow-sm'
                    : 'bg-white dark:bg-[#0E2239] border-slate-200/80 dark:border-[#1A314D] hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-[#0B1A2D] dark:text-white text-sm">{p.name}</h3>
                    {isCurrent ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B7F229] text-[#0B1A2D] font-extrabold">
                        Actual
                      </span>
                    ) : p.badge ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#071220] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-[#1A314D] font-bold">
                        {p.badge}
                      </span>
                    ) : null}
                  </div>

                  <div className="text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums mt-2.5">
                    {displayPrice} €{' '}
                    <span className="text-xs font-sans font-normal text-slate-500 dark:text-slate-400">
                      / mes
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed min-h-[32px]">
                    {p.description}
                  </p>

                  <ul className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1A314D] space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                      <span>
                        Hasta <strong>{p.maxCourts} pistas</strong>
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          p.hasPublicWeb
                            ? 'text-[#0B1A2D] dark:text-[#B7F229]'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                      <span className={p.hasPublicWeb ? '' : 'text-slate-400 dark:text-slate-500'}>
                        {p.hasPublicWeb ? 'Web Marca Blanca' : 'Solo App interna'}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          p.hasCustomDomain
                            ? 'text-[#0B1A2D] dark:text-[#B7F229]'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                      <span className={p.hasCustomDomain ? '' : 'text-slate-400 dark:text-slate-500'}>
                        {p.hasCustomDomain ? 'Dominio propio SSL' : 'Subdominio incluido'}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          p.hasSmartCourtAutomation
                            ? 'text-[#0B1A2D] dark:text-[#B7F229]'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                      <span
                        className={
                          p.hasSmartCourtAutomation ? '' : 'text-slate-400 dark:text-slate-500'
                        }
                      >
                        {p.hasSmartCourtAutomation ? 'Domótica IoT en pistas' : 'Gestión estándar'}
                      </span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlanChange(p.id)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                    isCurrent
                      ? 'bg-slate-100 dark:bg-[#071220] text-slate-500 dark:text-[#B7F229] cursor-default border border-slate-200/80 dark:border-[#1A314D]'
                      : 'bg-slate-50 hover:bg-[#0B1A2D] hover:text-white dark:bg-[#071220] dark:hover:bg-[#B7F229] dark:hover:text-[#0B1A2D] text-[#0B1A2D] dark:text-slate-200 border border-slate-200 dark:border-[#1A314D] cursor-pointer active:scale-95'
                  }`}
                >
                  {isCurrent ? 'Plan Actual' : 'Cambiar Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          4. HISTORIAL DE FACTURAS DE SOFTWARE (LISTA LIMPIA SIN CAJAS DOBLES)
          ===================================================================== */}
      <section className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
              Facturas de Suscripción
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Recibos mensuales de tu licencia Setmio.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">PDF</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-[#1A314D]">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs hover:bg-slate-50/70 dark:hover:bg-[#132A45]/40 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono font-bold text-[#0B1A2D] dark:text-white shrink-0">
                  {inv.id}
                </span>
                <span className="text-slate-500 dark:text-slate-400 shrink-0">{inv.date}</span>
                <span className="text-slate-600 dark:text-slate-300 hidden sm:inline truncate">
                  {inv.plan}
                </span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="font-mono font-extrabold text-[#0B1A2D] dark:text-white tabular-nums">
                  {inv.amount}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B7F229]/25 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] text-[10px] font-bold">
                    {inv.status}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      triggerDemoToast('Factura descargada', `Descargando PDF de ${inv.id}.`, 'info')
                    }
                    className="p-2 rounded-xl text-slate-500 hover:text-[#0B1A2D] dark:text-slate-400 dark:hover:text-[#B7F229] hover:bg-slate-100 dark:hover:bg-[#071220] transition cursor-pointer"
                    title="Descargar PDF"
                    aria-label={`Descargar factura ${inv.id}`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          MODAL: ACTUALIZAR MÉTODO DE PAGO
          ===================================================================== */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Actualizar Método de Pago
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePaymentMethod} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titular de la Tarjeta
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Red
                  </label>
                  <select
                    value={cardBrand}
                    onChange={(e) => setCardBrand(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  >
                    <option value="Mastercard">Mastercard</option>
                    <option value="Visa">Visa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Últimos 4
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    pattern="\d{4}"
                    value={cardLast4}
                    onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white font-mono focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Caducidad
                  </label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="09/28"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white font-mono focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold transition shadow-2xs cursor-pointer"
                >
                  Guardar Tarjeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscription;
