import React, { useState } from 'react';
import { Bot, Globe2, Phone, MessageCircle, MessageSquare, CalendarCheck, Clock3, Save, Sparkles, Play, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const metrics = [
  { label: 'Llamadas', value: '248', icon: Phone },
  { label: 'Minutos consumidos', value: '1.284', icon: Clock3 },
  { label: 'Chats de WhatsApp', value: '386', icon: MessageCircle },
  { label: 'Reservas realizadas', value: '94', icon: CalendarCheck },
];

export const AdminAIAgent: React.FC = () => {
  const { currentTenant, triggerDemoToast } = useApp();
  const [source, setSource] = useState<'setmio' | 'external'>('setmio');
  const [externalUrl, setExternalUrl] = useState('');
  const [name, setName] = useState('Recepción de ' + currentTenant.shortName);
  const [tone, setTone] = useState('Cercano y profesional');
  const [phone, setPhone] = useState(currentTenant.contactPhone);
  const [channels, setChannels] = useState({ chat: true, phone: true, whatsapp: true });
  const [demoMessage, setDemoMessage] = useState('Hola, ¿qué pistas tenéis disponibles esta tarde?');
  const [demoReply, setDemoReply] = useState('Tenemos pistas disponibles desde las 16:00. ¿Quieres que te ayude a reservar una?');

  const save = () => triggerDemoToast('Configuración guardada', 'La recepcionista IA está lista para atender a tus jugadores.', 'success');

  return (
    <main className="min-h-full bg-slate-100 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700"><Sparkles className="size-4" /> Automatización del club</div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Recepcionista e IA 24/7</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">Responde dudas, atiende llamadas y convierte conversaciones en reservas, incluso cuando el club está cerrado.</p>
          </div>
          <button onClick={save} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500"><Save className="size-4" /> Guardar cambios</button>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {metrics.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><Icon className="mb-4 size-5 text-emerald-600" /><div className="text-2xl font-black text-slate-950">{value}</div><div className="mt-1 text-xs font-medium text-slate-600">{label}</div></article>)}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><Bot className="size-6" /></div><div><h3 className="font-black text-slate-950">Identidad de la agente</h3><p className="text-xs text-slate-600">Define cómo representa a tu club.</p></div></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-700">Nombre del agente<input value={name} onChange={e => setName(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
              <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-700">Tono de voz<select value={tone} onChange={e => setTone(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-950 outline-none focus:border-emerald-500"><option>Cercano y profesional</option><option>Enérgico y deportivo</option><option>Formal y conciso</option></select></label>
              <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-700 sm:col-span-2">Teléfono asignado<input value={phone} onChange={e => setPhone(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h3 className="font-black text-slate-950">Canales de atención</h3><p className="mt-1 text-xs text-slate-600">Activa solo los canales que tengas configurados.</p><div className="mt-5 flex flex-col gap-3">{[ ['chat', 'Web Chat', MessageSquare], ['phone', 'Atención telefónica', Phone], ['whatsapp', 'WhatsApp', MessageCircle] ].map(([key, label, Icon]) => <label key={key as string} className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 p-3"><span className="flex items-center gap-3 text-sm font-bold text-slate-800"><Icon className="size-4 text-emerald-600" />{label as string}</span><input type="checkbox" checked={channels[key as keyof typeof channels]} onChange={e => setChannels({ ...channels, [key as string]: e.target.checked })} className="size-4 accent-emerald-600" /></label>)}</div></section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 sm:p-6"><div className="mb-4 flex items-center gap-2"><Globe2 className="size-5 text-emerald-600" /><h3 className="font-black text-slate-950">Fuente de conocimiento</h3></div><div className="grid gap-3 sm:grid-cols-2"><label className={`cursor-pointer rounded-2xl border p-4 ${source === 'setmio' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}><input type="radio" name="source" checked={source === 'setmio'} onChange={() => setSource('setmio')} className="mr-2 accent-emerald-600" /><span className="text-sm font-bold text-slate-900">Web de Setmio</span><span className="mt-1 block break-all text-xs text-slate-600">https://{currentTenant.slug}.setmiofinal2.vercel.app</span></label><label className={`cursor-pointer rounded-2xl border p-4 ${source === 'external' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}><input type="radio" name="source" checked={source === 'external'} onChange={() => setSource('external')} className="mr-2 accent-emerald-600" /><span className="text-sm font-bold text-slate-900">Web Externa</span><input value={externalUrl} onChange={e => setExternalUrl(e.target.value)} placeholder="https://tuclub.com" disabled={source !== 'external'} className="mt-2 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs text-slate-950 disabled:bg-slate-100" /></label></div></section>

          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm sm:col-span-2 sm:p-6"><div className="flex items-center justify-between gap-4"><div><h3 className="font-black text-amber-950">Modo demo / sandbox</h3><p className="mt-1 text-xs text-amber-800">Prueba conversaciones y voz sin activar ningún número real.</p></div><span className="rounded-full bg-amber-200 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-amber-950">Demo</span></div><div className="mt-5 grid gap-4 lg:grid-cols-2"><div><label className="flex flex-col gap-1.5 text-xs font-bold text-amber-950">Mensaje de prueba<textarea value={demoMessage} onChange={e => setDemoMessage(e.target.value)} className="min-h-24 rounded-xl border border-amber-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-950 outline-none focus:ring-2 focus:ring-amber-200" /></label><button onClick={() => setDemoReply('He entendido: ' + demoMessage + ' Puedo ayudarte con reservas, escuela y torneos.')} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-950 px-4 py-2.5 text-xs font-bold text-white"><Play className="size-4" /> Simular respuesta</button></div><div className="rounded-2xl border border-amber-200 bg-white p-4"><div className="flex items-center gap-2 text-xs font-bold text-slate-700"><Bot className="size-4 text-amber-600" /> {name}</div><p className="mt-3 text-sm leading-relaxed text-slate-800">{demoReply}</p><button onClick={() => triggerDemoToast('Prueba de voz', 'La reproducción de voz está disponible en el sandbox.', 'info')} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700"><Volume2 className="size-4" /> Probar voz</button></div></div><div className="mt-4 rounded-xl border border-amber-300 bg-amber-100 px-3 py-2.5 text-xs font-semibold text-amber-950">Para activar el número 24/7 e integrarlo en tu web, activa tu plan con cuota de setup inicial.</div></section>
        </div>
      </div>
    </main>
  );
};
