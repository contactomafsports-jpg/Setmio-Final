import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Video,
  Users,
  Award,
  MessageCircle,
  Phone,
  Mail,
  Sparkles,
  Zap,
  Check,
  X,
  Send,
  Ticket,
} from 'lucide-react';

export const CoachPublicView: React.FC = () => {
  const { currentTenant, triggerDemoToast, setPublicPage } = useApp();
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
      `Petición para "${selectedProgram}" enviada con éxito. Mateo Varela te contactará en el ${studentPhone || 'teléfono'} para confirmar fecha y pista.`,
      'success'
    );
    setBookingModalOpen(false);
    setStudentName('');
    setStudentPhone('');
    setStudentNotes('');
  };

  return (
    <div className="space-y-16 pb-20 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Hero Personal del Entrenador */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 lg:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/20">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{currentTenant.branding.badgeText || 'CERTIFIED FEP MASTER COACH'}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {currentTenant.branding.heroTitle || 'Tecnificación y Alto Rendimiento de Pádel'}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed">
                {currentTenant.branding.heroSubtitle ||
                  'Entrenador Nacional Nivel 2 FEP. Planes biomecánicos individuales, preparación táctica de competición y clinics intensivos.'}
              </p>

              {/* KPI Badges */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-base text-slate-900 dark:text-white">{coachStats.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Valoración Media</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">+{coachStats.activeStudents}</div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Alumnos Activos</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="text-base font-black text-slate-900 dark:text-white font-mono">{coachStats.weeklyLessons}h</div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Clases / Semana</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenBooking('Clase Particular 1 a 1')}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition hover:scale-105 active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Clase / Disponibilidad</span>
                </button>

                <a
                  href={`https://wa.me/${currentTenant.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    currentTenant.settings.whatsappGreetingMessage || 'Hola Mateo, me gustaría consultar disponibilidad de clases de pádel.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Contactar por WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Coach Photo Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                <img
                  src={currentTenant.branding.heroImageUrl}
                  alt={currentTenant.name}
                  className="w-full h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white text-xs space-y-1">
                  <div className="font-black text-lg text-white">{currentTenant.name}</div>
                  <div className="text-emerald-300 text-[11px] font-semibold">
                    Entrenador Nacional Nivel 2 FEP · Biomecánica & Rendimiento
                  </div>
                  <div className="text-slate-300 text-[10px]">
                    {currentTenant.city}, {currentTenant.region} · Instalaciones cubiertas oficiales
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Programas y Tarifas de Clases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Formatos Individuales y de Parejas
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Sesiones de Entrenamiento en Pista</h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Todas las sesiones incluyen pista cubierta climatizada, bolas nuevas y videoanálisis biomecánico en directo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 flex flex-col justify-between shadow-sm hover:border-emerald-500/50 transition group"
            >
              <div className="space-y-3">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase">
                  {s.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {s.title}
                </h3>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{s.price}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  {s.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenBooking(s.title)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Solicitar Horario</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Bonos de Clases (Requerimiento Específico Parte 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Ticket className="w-4 h-4" />
            <span>Packs con Descuento por Fidelidad</span>
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Bonos de Tecnificación</h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Contrata un bono de entrenamiento con tarifas reducidas por sesión y reserva anticipada prioritaria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {bonos.map((b) => (
            <div
              key={b.id}
              className={`p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border ${
                b.popular ? 'border-emerald-500 shadow-xl ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800 shadow-sm'
              } space-y-5 flex flex-col justify-between relative`}
            >
              {b.popular && (
                <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase shadow-md">
                  MÁS POPULAR
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{b.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{b.desc}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{b.price}</div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                    {b.saving}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  {b.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenBooking(b.title)}
                className={`w-full py-3 rounded-xl font-bold text-xs shadow transition active:scale-95 flex items-center justify-center gap-2 ${
                  b.popular
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                    : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>Adquirir {b.title}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Metodología y Biomecánica */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Metodología de Alto Nivel</span>
            <h2 className="text-2xl sm:text-3xl font-black">Los 4 Pilares del Método Mateo Varela</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Un enfoque científico del pádel que combina biomecánica de golpeo, software de trazada de impacto y psicología de puntos de presión.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <Video className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">1. Biomecánica en Pista</h3>
              <p className="text-slate-300 leading-relaxed">
                Trazada del plano de impacto, punto dulce de la pala y cadena cinética del cuerpo.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <Zap className="w-6 h-6 text-amber-400" />
              <h3 className="font-bold text-sm text-white">2. Apoyos y Transición</h3>
              <p className="text-slate-300 leading-relaxed">
                Pasos de ajuste en esquinas, salidas de pared sin pérdida de equilibrio y subida sincronizada a la red.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">3. Táctica Situacional</h3>
              <p className="text-slate-300 leading-relaxed">
                Elegir el tiro correcto según la profundidad del rival, el viento y la velocidad de la pista.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <Award className="w-6 h-6 text-purple-400" />
              <h3 className="font-bold text-sm text-white">4. Puntos de Presión</h3>
              <p className="text-slate-300 leading-relaxed">
                Entrenamiento con bola de break en contra, resolución en tie-break y lenguaje no verbal positivo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonios de Alumnos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Opiniones Reales
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Lo que dicen los Alumnos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{t.comment}"
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">{t.name}</div>
                <div className="text-slate-400 text-[10px]">{t.level}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. MODAL INTERACTIVO DE RESERVA DE CLASE O BONO */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 space-y-5">
            <button
              type="button"
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                Formulario de Contacto Directo
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                Solicitar {selectedProgram}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Indica tus preferencias y Mateo Varela contactará contigo hoy mismo.
              </p>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ej. Carlos Méndez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Teléfono / WhatsApp:</label>
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="Ej. +34 600 11 22 33"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Franja Horaria Preferida:</label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Mañana (09:00 - 13:00)">Mañana (09:00 - 13:00)</option>
                    <option value="Mediodía (13:00 - 16:00)">Mediodía (13:00 - 16:00)</option>
                    <option value="Tarde (16:00 - 21:00)">Tarde (16:00 - 21:00)</option>
                    <option value="Fin de Semana">Fin de Semana</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Nivel Estimado:</label>
                  <select
                    value={studentLevel}
                    onChange={(e) => setStudentLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Iniciación (Nivel 1.5 - 2.5)">Iniciación (1.5 - 2.5)</option>
                    <option value="Intermedio (Nivel 3.0 - 4.0)">Intermedio (3.0 - 4.0)</option>
                    <option value="Avanzado / Competición (4.5+)">Avanzado / Competición (4.5+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Notas u Objetivos (opcional):</label>
                <textarea
                  rows={2}
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="Ej. Quiero mejorar la bandeja y salidas de pared con giro..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Solicitud a Mateo Varela</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
