import React, { useState } from 'react';
import {
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { useApp, PublicPage } from '../../context/AppContext';
import {
  CorporateBreadcrumb,
  CorporateContainer,
  CorporateEyebrow,
  CorporatePrimaryButton,
  navigateCorporateRoute,
} from './corporate/CorporatePrimitives';

export const ContactFAQView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { triggerDemoToast, setPublicPage } = useApp();

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEntityType, setFormEntityType] = useState('club');
  const [formCourts, setFormCourts] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [rgpdAccepted, setRgpdAccepted] = useState(true);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const navigate = (path: string, page: PublicPage) => {
    navigateCorporateRoute(path, page, setPublicPage);
  };

  const corporateFaqs = [
    {
      q: '¿Cómo se realiza la migración de datos desde nuestro sistema actual?',
      a: 'Nuestro equipo técnico importa tu base de socios, saldos de monedero, grupos de escuela y reservas futuras en 24 horas sin detener la operativa diaria del club.',
    },
    {
      q: '¿Qué requiere instalar la domótica de luces y cerraduras por PIN?',
      a: 'Preparamos el esquema eléctrico para relés industriales y cerraduras IP compatibles. Un electricista autorizado realiza la conexión en cuadro sin obra civil.',
    },
    {
      q: '¿Existen comisiones sobre reservas o pagos divididos?',
      a: 'No. Setmio funciona mediante suscripción fija mensual o anual. El 100% de los cobros de tus jugadores llega directamente a la cuenta bancaria de tu organización.',
    },
    {
      q: '¿Pueden contratar la plataforma ayuntamientos, federaciones o equipos independientes?',
      a: 'Sí. Disponemos de configuraciones específicas para clubes, academias, entrenadores, administraciones públicas, federaciones y equipos que gestionan su plantilla y temporada sin depender de un club.',
    },
    {
      q: '¿Cómo protege Setmio la relación del club con sus socios?',
      a: 'Toda la web y app operan bajo tu marca blanca y dominio propio. Setmio no incluye directorios de clubes competidores ni desvía tráfico a terceros.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail.trim());
    const phoneDigits = formPhone.replace(/\D/g, '');
    if (!emailValid) {
      setFormError('Introduce un correo electrónico válido.');
      return;
    }
    if (phoneDigits.length < 7) {
      setFormError('Introduce un número de teléfono válido.');
      return;
    }
    if (!rgpdAccepted) {
      setFormError('Acepta la política de privacidad para enviar la consulta.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      triggerDemoToast(
        'Consulta enviada',
        'Nuestro equipo revisará los datos de tu organización y se pondrá en contacto contigo.',
        'success'
      );
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormCourts('');
      setFormMessage('');
    }, 450);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white py-12 sm:py-16 transition-colors duration-200">
      <CorporateContainer className="space-y-16">
        <CorporateBreadcrumb
          items={[
            { label: 'Inicio', onClick: () => navigate('/', 'home') },
            { label: 'Contacto' },
          ]}
          onBack={onBack}
          backLabel="Volver al inicio"
        />

        {/* Header */}
        <section className="max-w-3xl space-y-4">
          <CorporateEyebrow>Contacto Directo Setmio</CorporateEyebrow>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
            Hablemos sobre la digitalización de tu organización.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Asesoramiento técnico y comercial para clubes, academias, entrenadores, administraciones públicas, federaciones y equipos.
          </p>
        </section>

        {/* Direct Channels */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 sm:p-7 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229]/15 text-[#B7F229] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
              Comercial y Demostraciones
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Presentaciones personalizadas según tu perfil y número de pistas.
            </p>
            <div className="pt-3 border-t border-slate-200/80 dark:border-[#1A314D] space-y-1.5 text-xs font-mono">
              <div className="text-[#0B1A2D] dark:text-white">ventas@setmio.com</div>
              <div className="text-slate-500 dark:text-slate-400 tabular-nums">+34 910 038 412</div>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229]/15 text-[#B7F229] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
              Soporte Técnico y Domótica
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Consultas sobre cuadros eléctricos, relés IP, accesos PIN y pasarelas.
            </p>
            <div className="pt-3 border-t border-slate-200/80 dark:border-[#1A314D] space-y-1.5 text-xs font-mono">
              <div className="text-[#0B1A2D] dark:text-white">soporte@setmio.com</div>
              <div className="text-slate-500 dark:text-slate-400 tabular-nums">+34 981 38 00 00</div>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229]/15 text-[#B7F229] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
              Sector Público y Federaciones
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Memorias técnicas, licitaciones municipales y convenios federativos.
            </p>
            <div className="pt-3 border-t border-slate-200/80 dark:border-[#1A314D] space-y-1.5 text-xs">
              <div className="font-mono text-[#0B1A2D] dark:text-white">partners@setmio.com</div>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Madrid · Barcelona · A Coruña</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form + Guarantees */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 p-7 sm:p-9 rounded-3xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] space-y-6">
            <div className="space-y-2">
              <CorporateEyebrow>Formulario de Contacto</CorporateEyebrow>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-white font-display">
                Cuéntanos qué necesita tu entidad
              </h2>
            </div>

            {submitted && (
              <div className="p-4 rounded-xl bg-white dark:bg-[#0B1A2D] border border-[#B7F229] flex items-start gap-3 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#B7F229] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#0B1A2D] dark:text-white">
                    Solicitud recibida correctamente
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    Un especialista revisará tus datos y responderá en horario laboral.
                  </p>
                </div>
              </div>
            )}

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs mb-1.5">
                    Nombre y apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Mateo Varela"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white dark:bg-[#0B1A2D] border border-slate-200 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white text-sm focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>

                <div>
                  <label className="block text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs mb-1.5">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contacto@tuorganizacion.es"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white dark:bg-[#0B1A2D] border border-slate-200 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white text-sm focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs mb-1.5">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+34 600 000 000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white dark:bg-[#0B1A2D] border border-slate-200 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>

                <div>
                  <label className="block text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs mb-1.5">
                    Perfil de entidad
                  </label>
                  <select
                    value={formEntityType}
                    onChange={(e) => setFormEntityType(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white dark:bg-[#0B1A2D] border border-slate-200 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white text-sm focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] cursor-pointer"
                  >
                    <option value="club">Club de pádel / centro deportivo</option>
                    <option value="school">Academia o escuela</option>
                    <option value="coach">Entrenador o profesor</option>
                    <option value="council">Administración pública / ayuntamiento</option>
                    <option value="federation">Federación territorial o nacional</option>
                    <option value="team">Equipo independiente o liga</option>
                    <option value="pro">Jugador profesional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs mb-1.5">
                  Pistas, sedes o tamaño de plantilla
                </label>
                <input
                  type="text"
                  placeholder="ej. 6 pistas indoor, escuela de 120 alumnos o equipo de 18 jugadores"
                  value={formCourts}
                  onChange={(e) => setFormCourts(e.target.value)}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white dark:bg-[#0B1A2D] border border-slate-200 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white text-sm focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                />
              </div>

              <div>
                <label className="block text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs mb-1.5">
                  Mensaje *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Indícanos tus objetivos, plazos o dudas sobre módulos y domótica..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0B1A2D] border border-slate-200 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white text-sm focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="rgpd-contact"
                  checked={rgpdAccepted}
                  onChange={(e) => setRgpdAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 dark:border-[#1A314D] accent-[#0B1A2D]"
                />
                <label htmlFor="rgpd-contact" className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                  Acepto el tratamiento de mis datos de contacto conforme al Aviso Legal y Política de Privacidad de Setmio.
                </label>
              </div>

              <CorporatePrimaryButton
                type="submit"
                disabled={isSubmitting}
                icon={<Send className="w-4 h-4 shrink-0" />}
                className="w-full"
              >
                {isSubmitting ? 'Enviando consulta...' : 'Enviar consulta'}
              </CorporatePrimaryButton>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0B1A2D] dark:text-white">
                <ShieldCheck className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />
                <span>Garantías operativas Setmio</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                  <span>Migración inicial de datos asistida en 24 horas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                  <span>Sin comisiones por reserva ni permanencia forzosa.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                  <span>Alojamiento en la Unión Europea conforme a RGPD.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                  <span>Soporte directo en español y 10 idiomas adicionales.</span>
                </li>
              </ul>
            </div>

            <div className="p-7 rounded-2xl bg-[#0B1A2D] text-white border border-[#1A314D] space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#B7F229]">
                Atención telefónica directa
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Si prefieres resolver dudas sobre despliegue o domótica por teléfono, contacta directamente con nuestro equipo.
              </p>
              <a
                href="tel:+34981380000"
                className="inline-flex items-center gap-2 text-sm font-mono font-bold text-white hover:text-[#B7F229] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#B7F229]" />
                <span>+34 981 38 00 00</span>
              </a>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <CorporateEyebrow>Preguntas Frecuentes</CorporateEyebrow>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-white font-display">
              Dudas habituales antes de empezar
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-[#1A314D] bg-[#F7F9FC] dark:bg-[#0E2239] divide-y divide-slate-200/80 dark:divide-[#1A314D] overflow-hidden">
            {corporateFaqs.map((faq, idx) => {
              const isOpen = activeFAQ === idx;
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setActiveFAQ(isOpen ? null : idx)}
                    className="w-full min-h-[56px] px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#0B1A2D] dark:text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#0B1A2D] dark:text-[#B7F229]' : 'text-slate-400'
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </CorporateContainer>
    </main>
  );
};

export default ContactFAQView;
