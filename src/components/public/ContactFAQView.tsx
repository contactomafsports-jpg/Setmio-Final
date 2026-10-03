import React, { useState } from 'react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
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
  CheckCircle2,
} from 'lucide-react';

export const ContactFAQView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { currentTenant, triggerDemoToast } = useApp();

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
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
      'Mensaje Enviado',
      `Gracias ${formName}. Tu consulta ha sido recibida en recepción de Pádel San Mateo. Te responderemos a ${formEmail}.`,
      'success'
    );
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormMessage('');
  };

  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-slate-900 dark:text-slate-100 transition-colors duration-200">
  <SubpageHeaderNav onBack={onBack} />
  {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span>Contacto & Atención al Jugador</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Estamos en Narón, Galicia
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          Ven a conocernos al Polígono Industrial Río do Pozo. Resolveremos cualquier consulta sobre reservas de pistas, escuela federada, torneos o material deportivo.
        </p>
      </div>

      {/* Contact Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Ubicación & Acceso</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {currentTenant.address}<br />
            Polígono Industrial Río do Pozo<br />
            15578 Narón, A Coruña (Galicia)
          </p>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
            Parking privado gratuito vigilado (80 plazas)
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-cyan-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Horario de Apertura</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Lunes a Viernes: <strong>8:00 - 23:30 h</strong><br />
            Sábados: <strong>8:30 - 23:00 h</strong><br />
            Domingos y Festivos: <strong>9:00 - 22:30 h</strong>
          </p>
          <div className="text-[11px] font-semibold text-teal-600 dark:text-cyan-400 pt-1">
            Cafetería y Pro Shop abiertos en horario de pistas
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Teléfono & WhatsApp</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Recepción: <strong>{currentTenant.contactPhone}</strong><br />
            Email: <strong>{currentTenant.contactEmail}</strong>
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/34981380000?text=${encodeURIComponent('Hola, me gustaría información sobre las pistas de Pádel San Mateo')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-500 transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chatear por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Grid: FAQ Accordion + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* FAQ Accordion */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Preguntas Frecuentes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Dudas comunes sobre reservas y el club
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-3 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      activeFAQ === idx ? 'rotate-180 text-emerald-500' : 'text-slate-400'
                    }`}
                  />
                </button>
                {activeFAQ === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Envíanos un Mensaje</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Te responderemos en menos de 2 horas en horario de apertura.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tu Nombre</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nombre completo"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+34 600..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Mensaje o Consulta</label>
              <textarea
                required
                rows={4}
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                placeholder="¿En qué te podemos ayudar? (reservas de grupos, clases, eventos de empresa...)"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold transition shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Consulta</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
