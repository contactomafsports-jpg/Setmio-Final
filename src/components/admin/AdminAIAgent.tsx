import { Bot, MessageSquareText } from 'lucide-react'

export function AdminAIAgent() {
  return (
    <section className="max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <Bot aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Asistente Setmio
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            Agente de IA para administración
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Consulta información del club y prepara acciones administrativas desde un único espacio.
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
        <MessageSquareText aria-hidden="true" className="shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>El asistente estará disponible aquí para ayudarte con la gestión diaria.</span>
      </div>
    </section>
  )
}
