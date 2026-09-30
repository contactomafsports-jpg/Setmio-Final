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
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { currentTenant, updateCurrentTenant, triggerDemoToast } = useApp();

  const [whatsappEnabled, setWhatsappEnabled] = useState(currentTenant.settings.whatsappWidgetEnabled);
  const [whatsappNumber, setWhatsappNumber] = useState(currentTenant.whatsappNumber);
  const [whatsappGreeting, setWhatsappGreeting] = useState(currentTenant.settings.whatsappGreetingMessage);

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
      },
    });

    triggerDemoToast(
      'Configuración del Club Guardada',
      'Las políticas de reserva, contacto y botón de WhatsApp se han actualizado.',
      'success'
    );
  };

  return (
    <div className="space-y-8 text-slate-100 max-w-5xl">
      <div>
        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          Ajustes del Sistema
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Configuración General de {currentTenant.shortName}
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Administra las reglas de negocio de pistas, datos de contacto oficiales, pasarelas de cobro y widget flotante de WhatsApp.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* WhatsApp Widget Configuration (Requirement 25) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Configuración del Botón Flotante de WhatsApp</span>
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Activar botón:</span>
              <button
                type="button"
                onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  whatsappEnabled ? 'bg-emerald-500' : 'bg-slate-700'
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

          <p className="text-slate-400 text-[11px] leading-relaxed">
            Permite a los visitantes y jugadores contactar con recepción en un clic. Se abrirá la aplicación oficial de WhatsApp con el mensaje inicial preparado.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Número de WhatsApp del Club</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Mensaje Inicial Automático</label>
              <input
                type="text"
                value={whatsappGreeting}
                onChange={(e) => setWhatsappGreeting(e.target.value)}
                placeholder="¡Hola! Quisiera consultar pistas..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Booking Rules & Advance window */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Políticas de Reserva y Cancelación</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Días de Antelación de Reserva</label>
              <input
                type="number"
                value={bookingAdvanceDays}
                onChange={(e) => setBookingAdvanceDays(parseInt(e.target.value) || 7)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-500">Máximo número de días vista</span>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Plazo Cancelación Gratuita</label>
              <input
                type="number"
                value={cancellationHours}
                onChange={(e) => setCancellationHours(parseInt(e.target.value) || 24)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-500">Horas antes del partido</span>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Permitir Pago Dividido (Split)</label>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSplitPayment(!splitPayment)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    splitPayment
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {splitPayment ? 'Activado (4 Partes)' : 'Desactivado (Pago Único)'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Gateways Config (Stripe / Redsys / Bizum) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Pasarelas de Cobro de Jugadores (Club Gateway)</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Modo Demostración Activo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-white">Stripe Connect</div>
              <div className="text-[10px] text-slate-400">Tarjetas Visa, Mastercard, Apple Pay, Google Pay</div>
              <div className="text-emerald-400 font-semibold text-[10px] pt-1">Conectado (Demo)</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-white">Redsys TPV Virtual</div>
              <div className="text-[10px] text-slate-400">Pasarela bancaria directa española (Sabadell / Caixa)</div>
              <div className="text-slate-400 text-[10px] pt-1">Preparado para producción</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-white">Bizum Pay</div>
              <div className="text-[10px] text-slate-400">Cobro instantáneo mediante número de móvil</div>
              <div className="text-emerald-400 font-semibold text-[10px] pt-1">Habilitado</div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración General</span>
          </button>
        </div>
      </form>
    </div>
  );
};
