import React, { useState } from 'react';
import {
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Cpu,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { useApp, PublicPage } from '../../context/AppContext';
import {
  CorporateContainer,
  CorporateEyebrow,
  CorporatePrimaryButton,
  navigateCorporateRoute,
} from './corporate/CorporatePrimitives';

export const ContactFAQView: React.FC<{ onBack?: () => void }> = ({ onBack: _onBack }) => {
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

  void _onBack;

  const navigate = (path: string, page: PublicPage) => {
    navigateCorporateRoute(path, page, setPublicPage);
  };

  const corporateFaqs = [
    {
      q: '¿Cómo funciona la suscripción y qué incluye el coste de instalación inicial?',
      a: 'Todas las suscripciones (mensuales o anuales) conllevan un coste único de instalación inicial. Esta puesta en marcha incluye la configuración de pistas, tarifas, dominio SSL, pasarela de cobro directo e importación ordenada de tus socios y bonos activos.',
    },
    {
      q: '¿Cómo se realiza la migración de datos desde nuestro sistema actual?',
      a: 'Durante la implantación asistida, nuestro equipo técnico importa tu base de socios, saldos de monedero, grupos de escuela y reservas futuras en 24 horas sin detener la operativa diaria del centro.',
    },
    {
      q: '¿Qué requiere instalar la domótica de luces y cerraduras por PIN?',
      a: 'Preparamos el esquema eléctrico para relés industriales y cerraduras IP compatibles. Un electricista autorizado realiza la conexión en cuadro sin obra civil.',
    },
    {
      q: '¿Existen comisiones sobre reservas o pagos divididos?',
      a: 'No. Setmio funciona mediante suscripción modular fija mensual o anual tras la instalación inicial. El 100 % de los cobros de tus jugadores llega directamente a la cuenta bancaria de tu organización.',
    },
    {
      q: '¿Pueden contratar la plataforma ayuntamientos, federaciones, entrenadores o jugadores profesionales?',
      a: 'Sí. Disponemos de planes modulares para entrenadores, equipos y jugadores profesionales, además de configuraciones completas para clubes, academias y propuestas a medida para administraciones públicas y federaciones.',
    },
    {
      q: '¿Cómo protege Setmio la relación de nuestra entidad con sus socios?',
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
    <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200 overflow-x-clip">
      {/* 1. COMPACT HERO & SINGLE-LINE BREADCRUMB */}
      <section className="border-b border-slate-200/80 dark:border-[#1A314D] py-7 sm:py-11">
        <CorporateContainer className="space-y-5 sm:space-y-6">
          <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 text-xs whitespace-nowrap">
            <button
              type="button"
              onClick={() => navigate('/', 'home')}
              className="font-medium text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer"
            >
              Inicio
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />
            <span className="font-semibold text-[#0B1A2D] dark:text-white">
              Contacto
            </span>
          </nav>

          <div className="max-w-3xl space-y-3.5 animate-float-in">
            <CorporateEyebrow accent="lime">Contacto Directo Setmio</CorporateEyebrow>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
              Hablemos sobre la digitalización de tu organización.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Asesoramiento técnico y comercial para clubes, academias, entrenadores, administraciones públicas, federaciones, equipos y jugadores profesionales.
            </p>
          </div>
        </CorporateContainer>
      </section>

      {/* 2. DIRECT CHANNELS + FORM & SIDEBAR */}
      <section className="py-10 sm:py-16 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
        <CorporateContainer className="space-y-8 sm:space-y-10">
          {/* Direct Channels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            <article className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none p-6 sm:p-7 flex flex-col justify-between space-y-5 min-w-0">
              <div className="space-y-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#0B1A2D] dark:text-white font-display leading-snug">
                  Comercial y Demostraciones
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Presentaciones personalizadas según tu perfil, módulos activos y número de pistas.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-[#1A314D] space-y-1.5 text-xs font-mono">
                <a
                  href="mailto:ventas@setmio.com"
                  className="block font-semibold text-[#0B1A2D] dark:text-white hover:underline"
                >
                  ventas@setmio.com
                </a>
                <a
                  href="tel:+34910038412"
                  className="block text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] tabular-nums transition-colors"
                >
                  +34 910 038 412
                </a>
              </div>
            </article>

            <article className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none p-6 sm:p-7 flex flex-col justify-between space-y-5 min-w-0">
              <div className="space-y-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#0B1A2D] dark:text-white font-display leading-snug">
                  Soporte Técnico y Domótica
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Consultas sobre cuadros eléctricos, relés IP, accesos por PIN y pasarelas de pago.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-[#1A314D] space-y-1.5 text-xs font-mono">
                <a
                  href="mailto:soporte@setmio.com"
                  className="block font-semibold text-[#0B1A2D] dark:text-white hover:underline"
                >
                  soporte@setmio.com
                </a>
                <a
                  href="tel:+34981380000"
                  className="block text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] tabular-nums transition-colors"
                >
                  +34 981 38 00 00
                </a>
              </div>
            </article>

            <article className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none p-6 sm:p-7 flex flex-col justify-between space-y-5 min-w-0">
              <div className="space-y-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#0B1A2D] dark:text-white font-display leading-snug">
                  Sector Público y Federaciones
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Memorias técnicas, licitaciones municipales y convenios federativos multi-sede.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-[#1A314D] space-y-1.5 text-xs">
                <a
                  href="mailto:partners@setmio.com"
                  className="block font-mono font-semibold text-[#0B1A2D] dark:text-white hover:underline"
                >
                  partners@setmio.com
                </a>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Madrid · Barcelona · A Coruña</span>
                </div>
              </div>
            </article>
          </div>

          {/* Form + Guarantees & Direct Phone Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] space-y-6 min-w-0">
              <div className="space-y-2">
                <CorporateEyebrow accent="lime">Formulario de Contacto</CorporateEyebrow>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-white font-display tracking-tight">
                  Cuéntanos qué necesita tu entidad
                </h2>
              </div>

              {submitted && (
                <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-[#B7F229] flex items-start gap-3 text-xs sm:text-sm animate-float-in">
                  <CheckCircle2 className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
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
                    <label
                      htmlFor="contact-name"
                      className="block text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs mb-1.5"
                    >
                      Nombre y apellidos *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="ej. Mateo Varela"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] transition-colors duration-150 motion-reduce:transition-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs mb-1.5"
                    >
                      Correo electrónico *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="contacto@tuorganizacion.es"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] transition-colors duration-150 motion-reduce:transition-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs mb-1.5"
                    >
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      placeholder="+34 600 000 000"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white placeholder:text-slate-400 text-sm font-mono tabular-nums focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] transition-colors duration-150 motion-reduce:transition-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-entity"
                      className="block text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs mb-1.5"
                    >
                      Perfil de entidad
                    </label>
                    <select
                      id="contact-entity"
                      value={formEntityType}
                      onChange={(e) => setFormEntityType(e.target.value)}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white text-sm focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] transition-colors duration-150 motion-reduce:transition-none cursor-pointer"
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
                  <label
                    htmlFor="contact-courts"
                    className="block text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs mb-1.5"
                  >
                    Pistas, sedes o tamaño de plantilla
                  </label>
                  <input
                    id="contact-courts"
                    type="text"
                    placeholder="ej. 6 pistas indoor, escuela de 120 alumnos o equipo de 18 jugadores"
                    value={formCourts}
                    onChange={(e) => setFormCourts(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] transition-colors duration-150 motion-reduce:transition-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs mb-1.5"
                  >
                    Mensaje *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Indícanos tus objetivos, plazos o dudas sobre módulos, instalación y domótica..."
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F9FC] dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] transition-colors duration-150 motion-reduce:transition-none"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="rgpd-contact"
                    checked={rgpdAccepted}
                    onChange={(e) => setRgpdAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 dark:border-[#1A314D] accent-[#0B1A2D] dark:accent-[#B7F229] cursor-pointer"
                  />
                  <label htmlFor="rgpd-contact" className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed cursor-pointer">
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

            <div className="lg:col-span-5 space-y-6 min-w-0">
              <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0B1A2D] dark:text-white font-display">
                  <ShieldCheck className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                  <span>Garantías operativas Setmio</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                    <span>Instalación guiada y migración inicial de datos en 24 horas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                    <span>Sin comisiones por reserva ni retenciones sobre tus cobros.</span>
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

              <div className="p-6 sm:p-7 rounded-2xl bg-[#0B1A2D] dark:bg-[#071220] text-white border border-[#1A314D] space-y-4">
                <div className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#B7F229]">
                  <span className="h-[2px] w-4 bg-[#B7F229]" aria-hidden="true" />
                  <span>Atención telefónica directa</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Si prefieres resolver dudas sobre implantación, suscripción modular o domótica por teléfono, habla directamente con nuestro equipo técnico.
                </p>
                <a
                  href="tel:+34981380000"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-xl border border-[#244163] bg-[#0E2239] hover:border-[#B7F229]/60 px-5 py-2.5 text-sm font-mono font-bold text-white hover:text-[#B7F229] transition-colors duration-150 motion-reduce:transition-none tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#B7F229] shrink-0" />
                  <span>+34 981 38 00 00</span>
                </a>
              </div>
            </div>
          </div>
        </CorporateContainer>
      </section>

      {/* 3. FAQS */}
      <section className="py-12 sm:py-16">
        <CorporateContainer className="space-y-6 sm:space-y-8">
          <div className="max-w-2xl space-y-2.5">
            <CorporateEyebrow accent="lime">Preguntas Frecuentes</CorporateEyebrow>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-white font-display tracking-tight">
              Dudas habituales antes de empezar
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-[#1A314D] bg-[#F7F9FC] dark:bg-[#0E2239] divide-y divide-slate-200/80 dark:divide-[#1A314D] overflow-hidden">
            {corporateFaqs.map((faq, idx) => {
              const isOpen = activeFAQ === idx;
              const panelId = `contact-faq-panel-${idx}`;
              const triggerId = `contact-faq-trigger-${idx}`;

              return (
                <div key={faq.q}>
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setActiveFAQ(isOpen ? null : idx)}
                    className="w-full min-h-[56px] px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#0B1A2D] dark:text-white hover:bg-white/70 dark:hover:bg-[#132A45]/60 transition-colors duration-150 motion-reduce:transition-none cursor-pointer"
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                        isOpen ? 'rotate-180 text-[#0B1A2D] dark:text-[#B7F229]' : 'text-slate-400 dark:text-slate-400'
                      }`}
                    />
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-5 pt-0.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CorporateContainer>
      </section>
    </div>
  );
};

export default ContactFAQView;
