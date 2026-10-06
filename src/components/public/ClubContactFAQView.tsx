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
      a: t('contact.faqs.0.a', `Puedes cancelar tu reserva de forma autónoma desde la web o aplicación hasta con ${currentTenant.settings.cancellationWindowHours} horas de antelación sin coste alguno. El importe abonado se reintegrará automáticamente en tu saldo monedero de socio.`),
    },
    {
      q: t('contact.faqs.1.q', '¿Cómo se encienden las luces y cómo se accede a la pista?'),
      a: t('contact.faqs.1.a', 'Nuestras pistas cuentan con automatización IoT inteligente. Al confirmar tu reserva recibirás un código PIN para la cerradura. Los focos LED de competición se activarán automáticamente 5 minutos antes del inicio de tu partido y se apagarán al concluir la sesión.'),
    },
    {
      q: t('contact.faqs.2.q', '¿Se puede pagar la pista de manera dividida entre los 4 jugadores?'),
      a: t('contact.faqs.2.a', 'Sí. Al realizar la reserva puedes activar la opción "Pago Dividido (Split Payment)". Pagas tu cuarta parte y el sistema genera un enlace directo para que tus compañeros completen su pago en menos de 24 horas.'),
    },
    {
      q: t('contact.faqs.3.q', '¿Se pueden probar las palas de la tienda antes de comprarlas?'),
      a: t('contact.faqs.3.a', 'Por supuesto. En nuestra tienda física disponemos de palas de test de las principales marcas. Puedes solicitarlas en recepción para probarlas durante tus partidos.'),
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <SubpageHeaderNav onBack={onBack} />
      {/* Header */}
      <div className="max-w-3xl space-y-3 text-left">
        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span>{t('contact.eyebrow', 'Contacto & Atención al Jugador')}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {t('contact.title', 'Estamos a tu disposición en el club')}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          {t('contact.description', 'Ven a conocernos a nuestras instalaciones. Resolveremos cualquier consulta sobre reservas de pistas, escuela federada, torneos o material deportivo.')}
        </p>
      </div>

      {/* Contact Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('contact.location', 'Ubicación & Acceso')}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {currentTenant.address}<br />
            {currentTenant.city}<br />
            {t('contact.locationNote', 'Instalaciones cubiertas climatizadas')}
          </p>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
            {t('contact.parking', 'Parking privado gratuito vigilado')}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-cyan-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('contact.hours', 'Horario de Apertura')}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('contact.hoursWeekdays', 'Lunes a Viernes:')} <strong>8:00 - 23:30 h</strong><br />
            {t('contact.hoursSaturday', 'Sábados:')} <strong>{t('contact.hoursSaturdayTime', '8:30 - 23:00 h')}</strong><br />
            {t('contact.hoursSunday', 'Domingos y Festivos:')} <strong>{t('contact.hoursSundayTime', '9:00 - 22:30 h')}</strong>
          </p>
          <div className="text-[11px] text-slate-500 pt-1">
            {t('contact.shopHours', 'Cafetería y Pro Shop abiertos en horario de pistas')}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('contact.phone', 'Teléfono & WhatsApp')}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('contact.reception', 'Recepción:')} <strong>{currentTenant.contactPhone || '+34 981 39 00 00'}</strong><br />
            {t('contact.emailLabel', 'Email:')} {currentTenant.contactEmail || 'contacto@club.es'}
          </p>
          <a
            href={`https://wa.me/34${(currentTenant.contactPhone || '600000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(t('contact.whatsappPrompt', 'Hola, me gustaría recibir información sobre el club y reservas de pistas.'))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 pt-1 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('contact.whatsapp', 'Chatear por WhatsApp')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
