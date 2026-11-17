import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import playerPadelImg from '../../assets/images/player_padel_action_1794872242959.jpg';
import {
  GraduationCap,
  Calendar,
  Star,
  CheckCircle2,
  ShieldCheck,
  Video,
  Award,
  MessageCircle,
  Zap,
  Check,
  X,
  Send,
  Ticket,
} from 'lucide-react';

export const CoachPublicView: React.FC = () => {
  const { currentTenant, triggerDemoToast } = useApp();
  const coachStats = currentTenant.coachStats || {
    certifications: ['Entrenador Nacional Nivel 2 FEP', 'Especialista en Biomecánica de Golpeo', 'Ex-jugador Profesional'],
    hourlyRate: 45.0,
    activeStudents: 38,
    weeklyLessons: 24,
    rating: 4.96,
  };

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>('Clase Particular 1 a 1');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('Tarde (17:00 - 21:00)');
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentLevel, setStudentLevel] = useState('Nivel 3.0 - 4.0 (Intermedio)');
  const [studentNotes, setStudentNotes] = useState('');

  const services = [
    {
      id: 'individual',
      title: 'Clase Particular 1 a 1',
      badge: 'Individual',
      price: `${coachStats.hourlyRate.toFixed(2)} €/h`,
      desc: 'Sesión intensiva con videoanálisis en directo en pista, corrección biomecánica y cuaderno de trabajo táctico.',
      features: [
        'Videoanálisis HD con software de trazada',
        'Bolas Head Pro nuevas incluidas',
        'Pistas cubiertas climatizadas',
        'Plan de ejercicios personalizados',
      ],
    },
    {
      id: 'duo',
      title: 'Entrenamiento Parejas de Competición',
      badge: 'Parejas',
      price: '60.00 €/h (30€/jugador)',
      desc: 'Optimización de sincronización en pista, salidas de pared compartidas y patrones tácticos en torneos federados.',
      features: [
        'Táctica defensiva y transiciones a la red',
        'Estrategia de saque, resto y primer pase',
        'Simulación de puntos de presión (Tie-break)',
        'Seguimiento en torneos de circuito',
      ],
    },
    {
      id: 'clinic',
      title: 'Clinic Intensivo Fin de Semana',
      badge: 'Grupo Reducido',
      price: '120.00 € / jugador',
      desc: 'Sábado y domingo (8 horas totales). Grupos reducidos de 4 jugadores con preparación física y torneo evaluativo.',
      features: [
        '8 horas de pista y preparación física',
        'Comida con el entrenador incluida',
        'Test de palas de competición de alta gama',
        'Certificado de aprovechamiento y video grabado',
      ],
    },
  ];

  const bonos = [
    {
      id: 'bono-5',
      title: 'Bono 5 Clases Particulares',
      price: '200.00 €',
      saving: 'Ahorras 25€ (40€/clase)',
      desc: 'Plan mensual para asimilar correcciones técnicas de bandejas, víboras y remates con continuidad.',
      features: ['5 sesiones de 60 min', 'Validez de 3 meses', 'Reserva preferente de horario', 'Videoanálisis comparativo inicial y final'],
      popular: false,
    },
    {
      id: 'bono-10',
      title: 'Bono 10 Clases + Videoanálisis Pro',
      price: '380.00 €',
      saving: 'Ahorras 70€ (38€/clase)',
      desc: 'Programa integral de transformación de juego. Biomecánica completa y acompañamiento a partidos reales.',
      features: ['10 sesiones de 60 min', 'Validez de 6 meses', 'Informe biomecánico en PDF', 'Acceso directo a chat WhatsApp para dudas tácticas'],
      popular: true,
    },
  ];

  const testimonials = [
    {
      name: 'Sergio Bermúdez',
      level: 'Nivel 4.25 (1ª Cat. Gallega)',
      comment: 'Mateo corrigió mi punto de impacto en la víbora en sólo 3 sesiones. Pasé de cometer 5 errores no forzados por set a ganar un 70% de los puntos con el remate.',
      rating: 5,
    },
    {
      name: 'Lucía Santamaría',
      level: 'Nivel 3.5 (Jugadora Social)',
      comment: 'Sus clases particulares son dinámicas y sin tiempos muertos. El videoanálisis en la tableta a pie de pista hace que entiendas inmediatamente lo que debes cambiar.',
      rating: 5,
    },
  ];

  const handleOpenBooking = (programTitle: string) => {
    setSelectedProgram(programTitle);
    setBookingModalOpen(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    triggerDemoToast(
      'Solicitud de Clase Recibida',
      `Petición para "${selectedProgram}" enviada con éxito. ${currentTenant.name} te contactará en el ${studentPhone || 'teléfono'} para confirmar fecha y pista.`,
      'success'
    );
    setBookingModalOpen(false);
    setStudentName('');
    setStudentPhone('');
    setStudentNotes('');
  };

  return (
    <div className="bg-white dark:bg-[#0B1A2D] space-y-20 pb-24 text-[#0B1A2D] dark:text-slate-100 transition-colors">
      {/* 1. Hero Personal del Entrenador */}
      <section className="bg-[#0B1A2D] text-white py-14 lg:py-20 border-b border-[#1A314D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-[#B7F229] font-semibold text-xs tracking-wide">
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>{currentTenant.branding.badgeText || 'CERTIFIED FEP MASTER COACH'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-white leading-[1.08] text-balance">
                {currentTenant.branding.heroTitle || 'Tecnificación y Alto Rendimiento de Pádel'}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                {currentTenant.branding.heroSubtitle ||
                  'Entrenador Nacional Nivel 2 FEP. Planes biomecánicos individuales, preparación táctica de competición y clinics intensivos.'}
              </p>

              {/* KPI Strip */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#1A314D]">
                <div>
                  <div className="flex items-center gap-1.5 text-[#B7F229]">
                    <Star className="w-4 h-4 fill-current shrink-0" />
                    <span className="font-bold text-2xl text-white font-mono tabular-nums">{coachStats.rating}</span>
                  </div>
                  <span className="text-xs text-slate-400">Valoración Media</span>
                </div>

                <div>
                  <div className="text-2xl font-bold text-[#B7F229] font-mono tabular-nums">+{coachStats.activeStudents}</div>
                  <span className="text-xs text-slate-400">Alumnos Activos</span>
                </div>

                <div>
                  <div className="text-2xl font-bold text-[#a78bfa] font-mono tabular-nums">{coachStats.weeklyLessons}h</div>
                  <span className="text-xs text-slate-400">Clases / Semana</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenBooking('Clase Particular 1 a 1')}
                  className="min-h-[44px] px-6 py-3 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Reservar Clase / Disponibilidad</span>
                </button>

                <a
                  href={`https://wa.me/${currentTenant.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    currentTenant.settings.whatsappGreetingMessage || 'Hola, me gustaría consultar disponibilidad de clases de pádel.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-5 py-3 rounded-xl bg-[#0E2239] hover:bg-[#132A45] text-white font-semibold text-sm border border-[#1A314D] flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#B7F229] shrink-0" />
                  <span>Contactar por WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Coach Photo Frame */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-[#1A314D] bg-[#0E2239] shadow-2xl">
                <img
                  src={currentTenant.branding.heroImageUrl || playerPadelImg}
                  alt={currentTenant.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D] via-[#0B1A2D]/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white text-xs space-y-1">
                  <div className="font-bold text-lg text-white">{currentTenant.name}</div>
                  <div className="text-[#B7F229] font-medium">
                    Entrenador Nacional Nivel 2 FEP · Biomecánica & Rendimiento
                  </div>
                  <div className="text-slate-300">
                    {currentTenant.city}, {currentTenant.region} · Instalaciones cubiertas oficiales
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Programas y Tarifas de Clases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-left sm:text-center space-y-2 max-w-2xl sm:mx-auto">
          <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide">
            Formatos Individuales y de Parejas
          </span>
          <h2 className="text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight">
            Sesiones de Entrenamiento en Pista
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Todas las sesiones incluyen pista cubierta climatizada, bolas nuevas y videoanálisis biomecánico en directo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="p-7 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-5 flex flex-col justify-between hover:border-[#8B5CF6]/50 dark:hover:border-[#B7F229]/40 transition-colors group"
            >
              <div className="space-y-4">
                <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] block">
                  {s.badge}
                </span>
                <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white tracking-tight">
                  {s.title}
                </h3>
                <div className="text-2xl font-bold text-[#0B1A2D] dark:text-[#B7F229] font-mono tabular-nums">
                  {s.price}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>

                <div className="pt-4 border-t border-slate-100 dark:border-[#1A314D] space-y-2.5 text-xs">
                  {s.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] dark:text-[#B7F229] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenBooking(s.title)}
                className="w-full min-h-[42px] py-2.5 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Solicitar Horario</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Bonos de Clases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-left sm:text-center space-y-2 max-w-2xl sm:mx-auto">
          <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide flex items-center sm:justify-center gap-1.5">
            <Ticket className="w-4 h-4 shrink-0" />
            <span>Packs con Descuento por Fidelidad</span>
          </span>
          <h2 className="text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight">Bonos de Tecnificación</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Contrata un bono de entrenamiento con tarifas reducidas por sesión y reserva anticipada prioritaria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {bonos.map((b) => (
            <div
              key={b.id}
              className={`p-7 sm:p-8 rounded-2xl space-y-5 flex flex-col justify-between ${
                b.popular
                  ? 'bg-[#0B1A2D] text-white border-2 border-[#B7F229]'
                  : 'bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D]'
              }`}
            >
              <div className="space-y-4">
                <div>
                  {b.popular && (
                    <span className="text-xs font-semibold text-[#B7F229] block mb-1">Más Popular</span>
                  )}
                  <h3 className={`text-xl font-bold tracking-tight ${b.popular ? 'text-white' : 'text-[#0B1A2D] dark:text-white'}`}>
                    {b.title}
                  </h3>
                  <p className={`text-sm mt-1 ${b.popular ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                    {b.desc}
                  </p>
                </div>

                <div className="flex flex-wrap items-baseline gap-3">
                  <div className={`text-3xl font-bold font-mono tabular-nums ${b.popular ? 'text-[#B7F229]' : 'text-[#0B1A2D] dark:text-white'}`}>
                    {b.price}
                  </div>
                  <span className={`text-xs font-semibold ${b.popular ? 'text-[#a78bfa]' : 'text-[#8B5CF6] dark:text-[#B7F229]'}`}>
                    {b.saving}
                  </span>
                </div>

                <div className={`pt-4 border-t space-y-2.5 text-xs ${b.popular ? 'border-[#1A314D] text-slate-200' : 'border-slate-200/80 dark:border-[#1A314D] text-slate-700 dark:text-slate-300'}`}>
                  {b.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className={`w-4 h-4 shrink-0 ${b.popular ? 'text-[#B7F229]' : 'text-[#8B5CF6] dark:text-[#B7F229]'}`} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenBooking(b.title)}
                className={`w-full min-h-[44px] py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  b.popular
                    ? 'bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D]'
                    : 'bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#132A45] dark:hover:bg-[#1A314D]'
                }`}
              >
                <Ticket className="w-4 h-4 shrink-0" />
                <span>Adquirir {b.title}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Metodología y Biomecánica */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1A2D] border border-[#1A314D] text-white p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold text-[#B7F229] tracking-wide">Metodología de Alto Nivel</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Los 4 Pilares del Método Técnico</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Un enfoque científico del pádel que combina biomecánica de golpeo, software de trazada de impacto y psicología de puntos de presión.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {[
              { icon: Video, title: '01. Biomecánica en Pista', desc: 'Trazada del plano de impacto, punto dulce de la pala y cadena cinética del cuerpo.' },
              { icon: Zap, title: '02. Apoyos y Transición', desc: 'Pasos de ajuste en esquinas, salidas de pared sin pérdida de equilibrio y subida sincronizada a la red.' },
              { icon: ShieldCheck, title: '03. Táctica Situacional', desc: 'Elegir el tiro correcto según la profundidad del rival, el viento y la velocidad de la pista.' },
              { icon: Award, title: '04. Puntos de Presión', desc: 'Entrenamiento con bola de break en contra, resolución en tie-break y lenguaje no verbal positivo.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-5 rounded-2xl bg-[#0E2239] border border-[#1A314D] space-y-2.5">
                  <Icon className="w-5 h-5 text-[#B7F229]" />
                  <h3 className="font-bold text-sm text-white">{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Testimonios de Alumnos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide">
            Opiniones Reales
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight">
            Lo que dicen los Alumnos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-4"
            >
              <div className="flex items-center gap-1 text-[#8B5CF6] dark:text-[#B7F229]">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                "{item.comment}"
              </p>
              <div className="pt-3 border-t border-slate-200/80 dark:border-[#1A314D] text-xs">
                <div className="font-bold text-[#0B1A2D] dark:text-white">{item.name}</div>
                <div className="text-slate-500 dark:text-slate-400">{item.level}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. MODAL INTERACTIVO DE RESERVA DE CLASE O BONO */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1A2D]/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#0B1A2D] dark:text-slate-100 space-y-5">
            <button
              type="button"
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa]">
                Formulario de Contacto Directo
              </span>
              <h3 className="text-xl font-bold text-[#0B1A2D] dark:text-white mt-1 tracking-tight">
                Solicitar {selectedProgram}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Indica tus preferencias y {currentTenant.name} contactará contigo hoy mismo.
              </p>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1.5">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ej. Carlos Méndez"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-[#F8FAFC] dark:bg-[#071220] text-sm focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1.5">Teléfono / WhatsApp:</label>
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="Ej. +34 600 11 22 33"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-[#F8FAFC] dark:bg-[#071220] text-sm font-mono tabular-nums focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1.5">Franja Horaria Preferida:</label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-[#F8FAFC] dark:bg-[#071220] text-sm focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="Mañana (09:00 - 13:00)">Mañana (09:00 - 13:00)</option>
                    <option value="Mediodía (13:00 - 16:00)">Mediodía (13:00 - 16:00)</option>
                    <option value="Tarde (16:00 - 21:00)">Tarde (16:00 - 21:00)</option>
                    <option value="Fin de Semana">Fin de Semana</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1.5">Nivel Estimado:</label>
                  <select
                    value={studentLevel}
                    onChange={(e) => setStudentLevel(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-[#F8FAFC] dark:bg-[#071220] text-sm focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="Iniciación (Nivel 1.5 - 2.5)">Iniciación (1.5 - 2.5)</option>
                    <option value="Intermedio (Nivel 3.0 - 4.0)">Intermedio (3.0 - 4.0)</option>
                    <option value="Avanzado / Competición (4.5+)">Avanzado / Competición (4.5+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1.5">Notas u Objetivos (opcional):</label>
                <textarea
                  rows={2}
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="Ej. Quiero mejorar la bandeja y salidas de pared con giro..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-[#F8FAFC] dark:bg-[#071220] text-sm focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-3 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>Enviar Solicitud</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
