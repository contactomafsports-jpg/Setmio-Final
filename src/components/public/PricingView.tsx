import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';

interface PricingViewProps {
  onBack: () => void;
  onOpenDemo: () => void;
}

const plans = [
  { name: 'Esencial', description: 'Para clubes que empiezan a digitalizarse.', monthly: 99, features: ['Reservas y agenda', 'Web pública responsive', 'Base de clientes', 'Soporte por email'] },
  { name: 'Profesional', description: 'La operación completa para crecer con control.', monthly: 199, featured: true, features: ['Todo lo de Esencial', 'Escuela y grupos', 'Torneos y ligas', 'Tienda y TPV', 'Automatizaciones IA'] },
  { name: 'Enterprise', description: 'Marca blanca y control multi-sede.', monthly: null, features: ['Todo lo de Profesional', 'Multi-club y permisos', 'Dominios personalizados', 'Onboarding dedicado', 'SLA y soporte prioritario'] },
];

export const PricingView: React.FC<PricingViewProps> = ({ onBack, onOpenDemo }) => {
  const [annual, setAnnual] = useState(false);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="border-b border-slate-200 bg-white/80 px-4 py-12 sm:px-6 lg:px-8 lg:py-20 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mx-auto max-w-6xl">
          <SubpageHeaderNav onBack={onBack} />
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">Precios claros</p>
              <h1 className="text-balance text-4xl font-black tracking-tight sm:text-6xl">La infraestructura para hacer crecer tu club.</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Empieza con lo esencial y activa nuevos módulos cuando tu operación lo necesite.</p>
            </div>
            <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900" role="group" aria-label="Periodo de facturación">
              <button onClick={() => setAnnual(false)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!annual ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}>Mensual</button>
              <button onClick={() => setAnnual(true)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${annual ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}>Anual <span className="ml-1 text-emerald-500">-20%</span></button>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = plan.monthly === null ? null : annual ? Math.round(plan.monthly * 0.8) : plan.monthly;
            return (
              <article key={plan.name} className={`relative flex flex-col rounded-3xl border bg-white p-6 shadow-sm transition dark:bg-slate-900 hover:-translate-y-1 hover:shadow-xl ${plan.featured ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-border'}`}>
                {plan.featured && <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white"><Sparkles className="size-3" /> Más elegido</div>}
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>
                <div className="mt-6 flex items-end gap-1 border-b border-border pb-6">
                  {price === null ? <span className="text-3xl font-black">A medida</span> : <><span className="text-5xl font-black tracking-tight">{price}€</span><span className="pb-1 text-sm text-muted-foreground">/ mes</span></>}
                </div>
                <ul className="flex flex-1 flex-col gap-3 py-6 text-sm">
                  {plan.features.map((feature) => <li key={feature} className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-emerald-600" /><span>{feature}</span></li>)}
                </ul>
                <button onClick={onOpenDemo} className={`w-full rounded-xl px-4 py-3 text-sm font-bold transition ${plan.featured ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'border border-border bg-background hover:bg-muted'}`}>{price === null ? 'Hablar con Setmio' : 'Probar en demo'}</button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};
