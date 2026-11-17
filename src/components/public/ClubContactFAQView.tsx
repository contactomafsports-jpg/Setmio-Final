import React, { useState } from 'react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Clock,
  ChevronDown,
  Send,
  MessageCircle,
} from 'lucide-react';

export const ClubContactFAQView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { currentTenant, triggerDemoToast, t } = useApp();

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);

  const faqs = [
    {
      q: t('contact.faqs.0.q', '¿Cómo funciona la cancelación de una pista reservada?'),
      a: t(
        'contact.faqs.0.a',
        `Puedes cancelar tu reserva de forma autónoma desde la web o aplicación hasta con ${currentTenant.settings.cancellationWindowHours} horas de antelación sin coste alguno. El importe abonado se reintegrará automáticamente en tu saldo monedero de socio.`
      ),
    },
    {
      q: t('contact.faqs.1.q', '¿Cómo se encienden las luces y cómo se accede a la pista?'),
      a: t(
        'contact.faqs.1.a',
        'Nuestras pistas cuentan con automatización IoT inteligente. Al confirmar tu reserva recibirás un código PIN para la cerradura. Los focos LED de competición se activarán automáticamente 5 minutos antes del inicio de tu partido y se apagarán al concluir la sesión.'
      ),
    },
    {
      q: t('contact.faqs.2.q', '¿Se puede pagar la pista de manera dividida entre los 4 jugadores?'),
      a: t(
        'contact.faqs.2.a',
        'Sí. Al realizar la reserva puedes activar la opción "Pago Dividido (Split Payment)". Pagas tu cuarta parte y el sistema genera un enlace directo para que tus compañeros completen su pago en menos de 24 horas.'
      ),
    },
    {
      q: t('contact.faqs.3.q', '¿Se pueden probar las palas de la tienda antes de comprarlas?'),
      a: t(
        'contact.faqs.3.a',
        'Por supuesto. En nuestra tienda física disponemos de palas de test de las principales marcas. Puedes solicitarlas en recepción para probarlas durante tus partidos.'
      ),
    },
    {
      q: t('contact.faqs.4.q', '¿Disponéis de aparcamiento privado?'),
      a: t('contact.faqs.4.a', 'Sí, disponemos de un aparcamiento privado gratuito vigilado dentro del recinto deportivo.'),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerDemoToast(
      t('contact.toastSuccess', 'Mensaje Enviado'),
      t('contact.toastSuccessDesc', 'Gracias. Tu consulta ha sido recibida en recepción. Te responderemos a la brevedad.'),
      'success'
    );
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormMessage('');
  };

  return (
    <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="mb-8 flex items-center justify-start">
          <SubpageHeaderNav onBack={onBack} className="mb-0" />
        </div>

        <div className="space-y-16 sm:space-y-20">
          {/* Header */}
          <div className="max-w-3xl space-y-3 text-left">
            <div className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide flex items-center gap-1.5">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{t('contact.eyebrow', 'Contacto & Atención al Jugador')}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#0B1A2D] dark:text-white tracking-tight leading-[1.08] text-balance">
              {t('contact.title', 'Estamos a tu disposición en el club')}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {t(
                'contact.description',
                'Ven a conocernos a nuestras instalaciones. Resolveremos cualquier consulta sobre reservas de pistas, escuela federada, torneos o material deportivo.'
              )}
            </p>
          </div>

          {/* Contact Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-[#B7F229] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                {t('contact.location', 'Ubicación & Acceso')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentTenant.address}
                <br />
                {currentTenant.city}
                <br />
                {t('contact.locationNote', 'Instalaciones cubiertas climatizadas')}
              </p>
              <div className="text-xs font-semibold text-[#8B5CF6] dark:text-[#B7F229] pt-1">
                {t('contact.parking', 'Parking privado gratuito vigilado')}
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-[#a78bfa] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                {t('contact.hours', 'Horario de Apertura')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('contact.hoursWeekdays', 'Lunes a Viernes:')}{' '}
                <strong className="font-mono tabular-nums text-[#0B1A2D] dark:text-white">8:00 - 23:30 h</strong>
                <br />
                {t('contact.hoursSaturday', 'Sábados:')}{' '}
                <strong className="font-mono tabular-nums text-[#0B1A2D] dark:text-white">
                  {t('contact.hoursSaturdayTime', '8:30 - 23:00 h')}
                </strong>
                <br />
                {t('contact.hoursSunday', 'Domingos y Festivos:')}{' '}
                <strong className="font-mono tabular-nums text-[#0B1A2D] dark:text-white">
                  {t('contact.hoursSundayTime', '9:00 - 22:30 h')}
                </strong>
              </p>
              <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                {t('contact.shopHours', 'Cafetería y Pro Shop abiertos en horario de pistas')}
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229]/15 text-[#B7F229] flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                {t('contact.phone', 'Teléfono & WhatsApp')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('contact.reception', 'Recepción:')}{' '}
                <strong className="font-mono tabular-nums text-[#0B1A2D] dark:text-white">
                  {currentTenant.contactPhone || '+34 981 39 00 00'}
                </strong>
                <br />
                {t('contact.emailLabel', 'Email:')}{' '}
                <span className="font-mono">{currentTenant.contactEmail || 'contacto@club.es'}</span>
              </p>
              <a
                href={`https://wa.me/34${(currentTenant.contactPhone || '600000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  t('contact.whatsappPrompt', 'Hola, me gustaría recibir información sobre el club y reservas de pistas.')
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B5CF6] dark:text-[#B7F229] hover:underline pt-1 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{t('contact.whatsapp', 'Chatear por WhatsApp')}</span>
              </a>
            </div>
          </div>

          {/* Contact Form & FAQ Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B1A2D] dark:text-white tracking-tight">
                  {t('contact.form.title', 'Envíanos un mensaje')}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {t('contact.form.subtitle', 'Nuestro equipo de recepción responderá a tu consulta lo antes posible.')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('contact.form.name', 'Nombre completo')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={t('contact.form.namePlaceholder', 'Ej. Laura Pérez')}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-sm text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t('contact.form.email', 'Email')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-sm text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t('contact.form.phone', 'Teléfono')}
                    </label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+34 600 000 000"
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-sm font-mono tabular-nums text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('contact.form.message', 'Consulta')} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder={t('contact.form.messagePlaceholder', 'Cuéntanos en qué podemos ayudarte...')}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-sm text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[44px] py-3 px-6 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>{t('contact.form.submit', 'Enviar Mensaje a Recepción')}</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <div>
                <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide">
                  {t('contact.faqEyebrow', 'Preguntas Frecuentes')}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B1A2D] dark:text-white tracking-tight mt-1">
                  {t('contact.faqTitle', 'Dudas rápidas sobre el club')}
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-200/80 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] divide-y divide-slate-200/80 dark:divide-[#1A314D] overflow-hidden">
                {faqs.map((faq, idx) => {
                  const isOpen = activeFAQ === idx;
                  return (
                    <div key={idx}>
                      <button
                        type="button"
                        onClick={() => setActiveFAQ(isOpen ? null : idx)}
                        className="w-full min-h-[54px] px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#0B1A2D] dark:text-white hover:text-[#8B5CF6] dark:hover:text-[#B7F229] transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#8B5CF6] dark:text-[#B7F229]' : 'text-slate-400'
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
