import React, { useState } from 'react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Send,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Cpu,
  MapPin,
  ArrowRight,
  Globe,
  Check,
} from 'lucide-react';

export const ContactFAQView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { triggerDemoToast, t } = useApp();

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEntityType, setFormEntityType] = useState('club');
  const [formCourts, setFormCourts] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [rgpdAccepted, setRgpdAccepted] = useState(true);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const corporateFaqs = [
    {
      q: t('corporateContact.faqs.0.q', '¿Cómo es el proceso de migración de datos desde nuestro software actual?'),
      a: t('corporateContact.faqs.0.a', 'Nuestro equipo de ingeniería se encarga del 100% de la migración de tu base de socios, historiales y reservas en menos de 24 horas sin interrumpir la operación habitual de tu club.'),
    },
    {
      q: t('corporateContact.faqs.1.q', '¿Cuánto tiempo requiere la instalación de la domótica de luces y accesos?'),
      a: t('corporateContact.faqs.1.a', 'El hardware IoT de Setmio se envía preconfigurado bajo normativa europea. Un electricista autorizado de tu zona completa la conexión en el cuadro general en menos de 48 horas sin obras civiles.'),
    },
    {
      q: t('corporateContact.faqs.2.q', '¿Setmio cobra comisiones por pista reservada o por split payment?'),
      a: t('corporateContact.faqs.2.a', 'No, rotunda y categóricamente. Setmio opera bajo un modelo de suscripción plana mensual o anual. El 100% de los cobros de tus jugadores va directo a tu cuenta bancaria sin intermediarios ni retenciones.'),
    },
    {
      q: t('corporateContact.faqs.3.q', '¿El software incluye aplicación móvil de marca blanca para nuestros socios?'),
      a: t('corporateContact.faqs.3.a', 'Sí. Tu club dispondrá de su propia web y app corporativa con tu logotipo, colores oficiales y dominio dedicado (ej. tuclub.com), sin referencias visibles a proveedores externos.'),
    },
    {
      q: t('corporateContact.faqs.4.q', '¿Qué formación y soporte técnico recibe nuestro equipo de recepción?'),
      a: t('corporateContact.faqs.4.a', 'Ofrecemos formación telefónica y por videollamada personalizada para gerencia y personal de mostrador, además de soporte técnico prioritario los 365 días del año.'),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rgpdAccepted) {
      triggerDemoToast(
        t('common.notice', 'Aviso'),
        t('corporateContact.form.rgpdError', 'Por favor, acepta la política de privacidad para continuar.'),
        'info'
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      triggerDemoToast(
        t('corporateContact.toastSuccess', 'Solicitud Corporativa Enviada'),
        t('corporateContact.toastSuccessDesc', 'Gracias por contactar con Setmio. Nuestro equipo directivo revisará tu consulta y te responderá a la brevedad.'),
        'success'
      );
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormCourts('');
      setFormMessage('');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navigation Button alineado a la izquierda */}
      <div className="flex items-center justify-start">
        <SubpageHeaderNav onBack={onBack} />
      </div>

      {/* Header Corporativo (Alineado limpiamente a la izquierda) */}
      <div className="max-w-3xl space-y-4 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t('corporateContact.eyebrow', 'Contacto & Expansión Setmio SaaS')}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {t('corporateContact.title', 'Hablemos sobre el futuro digital de tu club de pádel')}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
          {t('corporateContact.subtitle', 'Nuestro equipo de consultores y especialistas en software deportivo está a tu disposición para asesorarte sobre domótica IoT, migración de datos y planes a medida.')}
        </p>
      </div>

      {/* Tarjetas de Canales de Contacto Corporativo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Ventas y Demostraciones */}
        <div className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {t('corporateContact.sales.title', 'Ventas & Demostraciones')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('corporateContact.sales.desc', 'Asesoramiento para comités, gerentes de club y academias. Demo personalizada en menos de 24h.')}
            </p>
            <div className="space-y-1 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-mono">{t('corporateContact.sales.email', 'ventas@setmio.com')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-mono">{t('corporateContact.sales.phone', '+34 910 038 412')}</span>
              </div>
            </div>
          </div>
          <a
            href="mailto:ventas@setmio.com?subject=Solicitud%20de%20Demostracion%20Setmio"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs active:scale-95 text-center"
          >
            <span>{t('corporateContact.sales.action', 'Agendar Demo de 20 min')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Card 2: Soporte Técnico & IoT */}
        <div className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 hover:shadow-lg transition-all duration-200 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {t('corporateContact.support.title', 'Soporte Técnico & Hardware IoT')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('corporateContact.support.desc', 'Asistencia técnica para cuadros eléctricos, relés IP, tornos de acceso y pasarelas bancarias.')}
            </p>
            <div className="space-y-1 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400" />
                <span className="font-mono">{t('corporateContact.support.email', 'soporte@setmio.com')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400" />
                <span className="font-mono">{t('corporateContact.support.phone', '+34 622 918 340')}</span>
              </div>
            </div>
          </div>
          <a
            href="https://wa.me/34622918340?text=Hola,%20contacto%20desde%20la%20web%20de%20Setmio%20para%20una%20consulta%20técnica."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-xs active:scale-95 text-center"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{t('corporateContact.support.action', 'Canal Técnico WhatsApp')}</span>
          </a>
        </div>

        {/* Card 3: Alianzas & Federaciones */}
        <div className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-500/50 hover:shadow-lg transition-all duration-200 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {t('corporateContact.partners.title', 'Alianzas, Cadenas & Federaciones')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('corporateContact.partners.desc', 'Integraciones API a medida, acuerdos federativos e implantaciones multi-sede a escala internacional.')}
            </p>
            <div className="space-y-1 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span className="font-mono">{t('corporateContact.partners.email', 'partners@setmio.com')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>{t('corporateContact.partners.location', 'Madrid · Barcelona · A Coruña')}</span>
              </div>
            </div>
          </div>
          <a
            href="mailto:partners@setmio.com?subject=Propuesta%20de%20Alianza%20o%20Cadena%20Deportiva"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition shadow-xs active:scale-95 text-center"
          >
            <span>{t('corporateContact.partners.action', 'Contactar con Dirección')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Formulario de Contacto Corporativo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {t('corporateContact.form.badge', 'Formulario de Contacto Oficial')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('corporateContact.form.title', 'Solicita un Estudio de Digitalización o Contacta con Nosotros')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('corporateContact.form.subtitle', 'Indícanos los datos de tus instalaciones y te responderemos en menos de 2 horas laborables.')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {t('corporateContact.form.name', 'Nombre y Apellidos')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('corporateContact.form.namePlaceholder', 'ej. Mateo Varela')}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {t('corporateContact.form.email', 'Email Corporativo')} *
                </label>
                <input
                  type="email"
                  required
                  placeholder={t('corporateContact.form.emailPlaceholder', 'gerencia@tuclub.es')}
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {t('corporateContact.form.phone', 'Teléfono / WhatsApp')} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder={t('corporateContact.form.phonePlaceholder', '+34 600 000 000')}
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {t('corporateContact.form.entityType', 'Tipo de Organización')}
                </label>
                <select
                  value={formEntityType}
                  onChange={(e) => setFormEntityType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="club">{t('corporateContact.form.typeClub', 'Club de Pádel / Instalación Deportiva')}</option>
                  <option value="school">{t('corporateContact.form.typeSchool', 'Escuela de Pádel / Academia Docente')}</option>
                  <option value="pro">{t('corporateContact.form.typePro', 'Jugador Profesional / Atleta de Élite')}</option>
                  <option value="chain">{t('corporateContact.form.typeChain', 'Cadena Deportiva / Multi-Club')}</option>
                  <option value="other">{t('corporateContact.form.typeOther', 'Otro (Federación, Empresa, Inversor)')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                {t('corporateContact.form.courtsCount', 'Número de Pistas o Instalaciones')}
              </label>
              <input
                type="text"
                placeholder={t('corporateContact.form.courtsPlaceholder', 'ej. 8 pistas (4 cubiertas + 4 exteriores)')}
                value={formCourts}
                onChange={(e) => setFormCourts(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                {t('corporateContact.form.message', 'Mensaje o Consulta Técnica')} *
              </label>
              <textarea
                required
                rows={4}
                placeholder={t('corporateContact.form.messagePlaceholder', 'Cuéntanos sobre tu club: software actual, necesidades de domótica, fecha estimada de inicio...')}
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="rgpd"
                checked={rgpdAccepted}
                onChange={(e) => setRgpdAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="rgpd" className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                {t('corporateContact.form.rgpd', 'Acepto el tratamiento de mis datos de contacto con fines informativos según la Política de Privacidad de Setmio.')}
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-70"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? t('common.loading', 'Enviando...') : t('corporateContact.form.submit', 'Enviar Consulta Corporativa')}</span>
            </button>
          </form>
        </div>

        {/* Garantías y Beneficios de Setmio SaaS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {t('corporateContact.commitment.title', 'Compromiso de Calidad Setmio')}
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>{t('corporateContact.commitment.migration', 'Migración 100% gratuita')}:</strong> {t('corporateContact.commitment.migrationDesc', 'Tu base de socios, pistas y deudas queda configurada en 24h.')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>{t('corporateContact.commitment.zeroCommissions', 'Cero comisiones')}:</strong> {t('corporateContact.commitment.zeroCommissionsDesc', 'No cobramos ningún porcentaje sobre las reservas de tus pistas.')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>{t('corporateContact.commitment.hardware', 'Hardware homologado')}:</strong> {t('corporateContact.commitment.hardwareDesc', 'Compatibilidad con relés Schneider, Finder, Shelly y tornos IP.')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>{t('corporateContact.commitment.support', 'Soporte prioritario')}:</strong> {t('corporateContact.commitment.supportDesc', 'Contacto directo con ingenieros sin bots impersonales.')}</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
            <span className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-400 font-bold">
              {t('corporateContact.international.badge', 'Despliegue Internacional')}
            </span>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              {t('corporateContact.international.title', 'Soporte Multilingüe y Multidivisa')}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('corporateContact.international.desc', 'Infraestructura preparada para operar en 11 idiomas con pasarelas de pago locales (Bizum, Redsys, Stripe, SEPA) para clubes en España, Portugal, Italia, Francia, Alemania y Oriente Medio.')}
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Corporativas */}
      <div className="space-y-8 pt-4">
        <div className="space-y-2 text-left">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {t('corporateContact.faqEyebrow', 'Preguntas Frecuentes')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('corporateContact.faqTitle', 'Dudas habituales sobre la implantación de Setmio')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            {t('corporateContact.faqSubtitle', 'Todo lo que necesitas saber sobre migración, hardware y modelo de negocio.')}
          </p>
        </div>

        <div className="space-y-3">
          {corporateFaqs.map((faq, idx) => {
            const isOpen = activeFAQ === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setActiveFAQ(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-500' : 'text-slate-400'}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-150">
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

export default ContactFAQView;
