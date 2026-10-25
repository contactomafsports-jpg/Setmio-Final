import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlanTier } from '../../types/database';
import {
  CreditCard,
  CheckCircle2,
  Calendar,
  Download,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building2,
  HardDrive,
  Bot,
} from 'lucide-react';

export const AdminSubscription: React.FC = () => {
  const { currentTenant, plans, updateCurrentTenant, triggerDemoToast } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const currentPlan = plans.find((p) => p.id === currentTenant.planId) || plans[3];

  const invoices = [
    { id: 'INV-2026-009', date: '01/09/2026', amount: '159,00 €', plan: 'Setmio Elite Mensual', status: 'Pagada' },
    { id: 'INV-2026-008', date: '01/08/2026', amount: '159,00 €', plan: 'Setmio Elite Mensual', status: 'Pagada' },
    { id: 'INV-2026-007', date: '01/07/2026', amount: '159,00 €', plan: 'Setmio Elite Mensual', status: 'Pagada' },
  ];

  const handlePlanChange = (tier: PlanTier) => {
    updateCurrentTenant({ planId: tier });
    triggerDemoToast(
      'Suscripción a Setmio Actualizada',
      `El club ha cambiado al plan ${tier.toUpperCase()}. Los límites de pistas y funciones se han actualizado.`,
      'success'
    );
  };

  return (
    <div className="space-y-8 text-slate-900 dark:text-slate-100 max-w-6xl pb-16 transition-colors duration-200">
      {/* Header */}
      <div>
        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Mi Setmio · Suscripción SaaS de la Plataforma
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          Plan y Facturación de {currentTenant.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Esta es la cuota de software que tu club abona a Setmio Padel Pro por el uso de la plataforma. Está totalmente separada de los cobros que recibes de tus jugadores.
        </p>
      </div>

      {/* Active Subscription Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              Plan Activo: {currentPlan.name}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Estado: Activo Demo</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {currentPlan.priceMonthly.toFixed(2)} € <span className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400">/ mes (facturación mensual)</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            {currentPlan.description} Incluye web multipágina de marca blanca, reservas ilimitadas, automatización IoT y agente de IA.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 dark:text-slate-300 pt-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Renovación: <strong>01/10/2026</strong></span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
              <CreditCard className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>Mastercard ···· 4829</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
              <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>CIF: B-15900000</span>
            </div>
          </div>
        </div>

        {/* Usage Gauges */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3.5 text-xs">
          <div className="font-bold text-slate-900 dark:text-white text-xs mb-1">Consumo de Recursos SaaS:</div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
              <span>Pistas Configuradas:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">8 / {currentPlan.maxCourts}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: '40%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
              <span>Almacenamiento Multimedia:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">2.4 GB / 20 GB</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: '12%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
              <span>Tokens Agente IA:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">4.800 / 50.000</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: '10%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans Comparison */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Comparativa de Planes de Setmio Padel Pro</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Escala según el número de pistas, domótica inteligente y servicios que ofrece tu club.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => {
            const isCurrent = p.id === currentTenant.planId;
            return (
              <div
                key={p.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition ${
                  isCurrent
                    ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-black text-slate-900 dark:text-white text-sm">{p.name}</h4>
                    {p.badge && (
                      <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold font-mono">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-2">
                    {p.priceMonthly.toFixed(0)} € <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/mes</span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed min-h-[32px]">{p.description}</p>

                  <ul className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Hasta <strong>{p.maxCourts} pistas</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${p.hasPublicWeb ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'} shrink-0`} />
                      <span className={p.hasPublicWeb ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}>{p.hasPublicWeb ? 'Web Pública Multipágina' : 'Sin web pública (Solo App)'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${p.hasCustomDomain ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'} shrink-0`} />
                      <span className={p.hasCustomDomain ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}>{p.hasCustomDomain ? 'Dominio Propio SSL' : 'Subdominio Setmio'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${p.hasSmartCourtAutomation ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'} shrink-0`} />
                      <span className={p.hasSmartCourtAutomation ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}>{p.hasSmartCourtAutomation ? 'Pistas Inteligentes IoT' : 'Gestión estándar'}</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlanChange(p.id)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 ${
                    isCurrent
                      ? 'bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 cursor-default border border-slate-200 dark:border-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                  }`}
                >
                  {isCurrent ? 'Plan Actual' : 'Cambiar a este Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Setmio Invoices Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Facturas Emitidas por Setmio</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Descarga en formato PDF reglamentario</span>
        </div>

        <div className="space-y-2.5 text-xs">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{inv.id}</span>
                <span className="text-slate-500 dark:text-slate-400">{inv.date}</span>
                <span className="text-slate-700 dark:text-slate-300 hidden sm:inline font-medium">{inv.plan}</span>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{inv.amount}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold border border-emerald-200 dark:border-emerald-800">
                  {inv.status}
                </span>
                <button
                  type="button"
                  onClick={() => triggerDemoToast('Descarga de Factura', `Descargando PDF de ${inv.id}...`, 'info')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Descargar PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
