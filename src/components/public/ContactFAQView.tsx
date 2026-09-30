import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Send,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

export const ContactFAQView: React.FC = () => {
  const { currentTenant, triggerDemoToast } = useApp();

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Cómo funciona la cancelación de una pista reservada?',
      a: `Puedes cancelar tu reserva de forma autónoma desde la web o aplicación hasta con ${currentTenant.settings.cancellationWindowHours} horas de antelación sin coste alguno. El importe abonado se reintegrará automáticamente en tu saldo monedero de socio.`,
    },
    {
      q: '¿Cómo se encienden las luces y cómo se accede a la pista?',
      a: 'Nuestras 8 pistas cuentan con automatización IoT inteligente. Al confirmar tu reserva recibirás un código PIN para la cerradura de la puerta. Los focos LED de competición se activarán automáticamente 5 minutos antes del inicio de tu partido y se apagarán al concluir la sesión.',
    },
    {
      q: '¿Se puede pagar la pista de manera dividida entre los 4 jugadores?',
      a: 'Sí. Al realizar la reserva puedes activar la opción "Pago Dividido (Split Payment)". Pagas tu cuarta parte y el sistema genera un enlace directo para que tus compañeros completen su pago en menos de 24 horas.',
    },
    {
      q: '¿Se pueden probar las palas de la tienda antes de comprarlas?',
      a: 'Por supuesto. En nuestra tienda física disponemos de palas de test de las principales marcas (Bullpadel, Nox, Babolat, Head). Puedes solicitarlas en recepción para probarlas durante tus partidos en la Pista 1 o en la pista individual.',
    },
    {
      q: '¿Disponéis de aparcamiento privado?',
      a: 'Sí, disponemos de un aparcamiento privado gratuito de más de 80 plazas dentro del recinto de Pádel San Mateo en el Polígono Industrial Río do Pozo (Narón).',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerDemoToast(
      'Mensaje Enviado (Modo Demo)',
      `Gracias ${formName}. Tu consulta ha sido recibida en recepción de Pádel San Mateo. Te responderemos en breve a ${formEmail}.`,
      'success'
    );
    setFormName('');
    setFormEmail('');
    setFormMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-slate-100">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          Atención & Ubicación
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Contacto & Preguntas Frecuentes
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Estamos en Narón (A Coruña) a tu completa disposición. Consúltanos dudas sobre reservas, clases de la escuela, torneos o compras en nuestra tienda oficial.
        </p>
      </div>

      {/* Contact Cards & Form Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Datos de Contacto Directo</h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Centro de Pádel San Mateo</div>
                  <div className="text-slate-400">{currentTenant.address}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-slate-400">Teléfono Recepción:</div>
                  <a href={`tel:${currentTenant.contactPhone}`} className="font-semibold text-white hover:text-emerald-400">
                    {currentTenant.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-slate-400">Correo Electrónico:</div>
                  <a href={`mailto:${currentTenant.contactEmail}`} className="font-semibold text-white hover:text-emerald-400">
                    {currentTenant.contactEmail}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Horarios Ininterrumpidos:</span>
              </div>
              {currentTenant.settings.openingHours.map((h, i) => (
                <div key={i} className="flex justify-between text-[11px] text-slate-400">
                  <span>{h.days}:</span>
                  <span className="text-slate-200">{h.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Envíanos un Mensaje</h3>
          <p className="text-xs text-slate-400">
            Responderemos a tu solicitud en menos de 2 horas en horario de apertura.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="tu@email.es"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Mensaje / Consulta</label>
              <textarea
                required
                rows={4}
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                placeholder="¿En qué te podemos ayudar?"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Mensaje</span>
            </button>
          </form>
        </div>
      </div>

      {/* Accordion FAQ Section */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div>
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Respuestas Rápidas
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFAQ === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFAQ(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-white hover:text-emerald-400 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
