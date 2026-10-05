import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  MessageCircle,
  CreditCard,
  Building2,
  Clock,
  Save,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sun,
  Moon,
  Laptop,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { currentTenant, updateCurrentTenant, triggerDemoToast, theme, setTheme, setAdminTab, courts } = useApp();

  const [whatsappEnabled, setWhatsappEnabled] = useState(currentTenant.settings.whatsappWidgetEnabled);
  const [whatsappNumber, setWhatsappNumber] = useState(currentTenant.whatsappNumber);
  const [whatsappGreeting, setWhatsappGreeting] = useState(currentTenant.settings.whatsappGreetingMessage);
  const [chatWidgetMode, setChatWidgetMode] = useState<'whatsapp' | 'ai' | 'both'>(
    currentTenant.settings.chatWidgetMode || 'both'
  );

  const [bookingAdvanceDays, setBookingAdvanceDays] = useState(currentTenant.settings.bookingAdvanceDays);
  const [cancellationHours, setCancellationHours] = useState(currentTenant.settings.cancellationWindowHours);
  const [splitPayment, setSplitPayment] = useState(currentTenant.settings.splitPaymentAllowed);

  const [contactEmail, setContactEmail] = useState(currentTenant.contactEmail);
  const [contactPhone, setContactPhone] = useState(currentTenant.contactPhone);
  const [address, setAddress] = useState(currentTenant.address);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentTenant({
      contactEmail,
      contactPhone,
      address,
      whatsappNumber,
      settings: {
        ...currentTenant.settings,
        whatsappWidgetEnabled: whatsappEnabled,
        whatsappGreetingMessage: whatsappGreeting,
        bookingAdvanceDays,
        cancellationWindowHours: cancellationHours,
        splitPaymentAllowed: splitPayment,
        chatWidgetMode,
      },
    });

    triggerDemoToast(
      'Configuración del Club Guardada',
      'Las políticas de reserva, contacto y botón de WhatsApp se han actualizado.',
      'success'
    );
  };

  return (
    <div className="space-y-8 text-slate-900 dark:text-slate-100 max-w-5xl transition-colors duration-200">
      <div>
        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Ajustes del Sistema
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          Configuración General de {currentTenant.shortName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
          Administra las reglas de negocio de pistas, modo visual (claro/oscuro), datos de contacto oficiales, pasarelas de cobro y widget flotante de WhatsApp.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Appearance & Theme Setting */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Modo Visual & Apariencia</span>
            </h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Modo Claro por Defecto
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
            Personaliza el tema visual de la plataforma. El modo claro es el predeterminado para garantizar máxima legibilidad en recepciones iluminadas y dispositivos móviles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition ${
                theme === 'light'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Modo Claro</div>
                <div className="text-[10px] text-slate-500">Predeterminado</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition ${
                theme === 'dark'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-300 flex items-center justify-center shrink-0">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Modo Oscuro</div>
                <div className="text-[10px] text-slate-500">Alto contraste nocturno</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition ${
                theme === 'system'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 dark:bg-teal-950 flex items-center justify-center shrink-0">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Automático</div>
                <div className="text-[10px] text-slate-500">Según sistema operativo</div>
              </div>
            </button>
          </div>
        </div>

        {/* Módulo de Gestión de Pistas y Tarifas */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Gestión de Pistas & Domótica IoT
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {courts.length} pistas configuradas (Indoor/Outdoor), tarifas horarias, relés de focos y pines de torno.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAdminTab('courts_management')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shrink-0"
            >
              <span>Abrir Módulo de Pistas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* White-label Hero Media Configuration */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Medio del Hero público</h3>
            <p className="text-[11px] text-slate-500 mt-1">Elige cómo presentar la cabecera de tu web de marca blanca.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'image', label: 'Imagen', description: 'Fotografía de pista' },
              { id: 'video', label: 'Vídeo', description: 'Vídeo en bucle' },
              { id: 'minimal', label: 'Sin medio / Minimalista', description: 'Degradado limpio' },
            ].map((option) => (
              <button key={option.id} type="button" className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-left hover:border-emerald-500 transition">
                <span className="block text-xs font-bold text-slate-900 dark:text-white">{option.label}</span>
                <span className="block text-[10px] text-slate-500 mt-1">{option.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* WhatsApp Widget Configuration */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Configuración del Botón Flotante de WhatsApp</span>
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs">Activar botón:</span>
              <button
                type="button"
                onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  whatsappEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    whatsappEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
            Personaliza el comportamiento del widget flotante de atención al cliente y soporte entre 3 modalidades operativas:
          </p>

          {/* 3-Mode Widget Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setChatWidgetMode('whatsapp')}
              className={`p-3.5 rounded-2xl border text-left transition ${
                chatWidgetMode === 'whatsapp'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-slate-900 dark:text-white">1) Solo WhatsApp</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                Abre chat directo en WhatsApp oficial con mensaje preconfigurado dinámico.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setChatWidgetMode('ai')}
              className={`p-3.5 rounded-2xl border text-left transition ${
                chatWidgetMode === 'ai'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                <span className="font-bold text-slate-900 dark:text-white">2) Solo Agente IA</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                Chat flotante estético, no invasivo, con avatar y respuestas automáticas inteligentes.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setChatWidgetMode('both')}
              className={`p-3.5 rounded-2xl border text-left transition ${
                chatWidgetMode === 'both'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-bold text-slate-900 dark:text-white">3) Ambos (Recomendado)</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                Abre agente IA con botón interno para desviar la consulta a WhatsApp si el usuario lo desea.
              </p>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Número de WhatsApp del Club</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Mensaje Inicial Automático</label>
              <input
                type="text"
                value={whatsappGreeting}
                onChange={(e) => setWhatsappGreeting(e.target.value)}
                placeholder="¡Hola! Quisiera consultar pistas..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Booking Rules & Advance window */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
            <span>Políticas de Reserva y Cancelación</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Días de Antelación de Reserva</label>
              <input
                type="number"
                value={bookingAdvanceDays}
                onChange={(e) => setBookingAdvanceDays(parseInt(e.target.value) || 7)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-500">Máximo número de días vista</span>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Plazo Cancelación Gratuita</label>
              <input
                type="number"
                value={cancellationHours}
                onChange={(e) => setCancellationHours(parseInt(e.target.value) || 24)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-500">Horas antes del partido</span>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Permitir Pago Dividido (Split)</label>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSplitPayment(!splitPayment)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    splitPayment
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {splitPayment ? 'Activado (4 Partes)' : 'Desactivado (Pago Único)'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Gateways Config (Stripe / Redsys / Bizum) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Pasarelas de Cobro de Jugadores (Club Gateway)</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
              Modo Demostración Activo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Stripe Connect</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Tarjetas Visa, Mastercard, Apple Pay, Google Pay</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] pt-1">Conectado (Demo)</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Redsys TPV Virtual</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Pasarela bancaria directa española (Sabadell / Caixa)</div>
              <div className="text-slate-500 text-[10px] pt-1">Preparado para producción</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Bizum Pay</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Cobro instantáneo mediante número de móvil</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] pt-1">Habilitado</div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración General</span>
          </button>
        </div>
      </form>
    </div>
  );
};
