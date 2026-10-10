import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Users,
  Award,
  Calendar,
  CheckCircle2,
  Star,
  ShieldCheck,
  Video,
  Clock,
  Send,
  MessageCircle,
  X,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Check,
} from 'lucide-react';

export const AcademyPublicLanding: React.FC = () => {
  const { currentTenant, coaches, academyGroups, triggerDemoToast, setPublicPage } = useApp();

  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>('Escuela de Menores');
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentAge, setStudentAge] = useState('');
  const [preferredSchedule, setPreferredSchedule] = useState('Tardes (17:30 - 19:00)');
  const [studentLevel, setStudentLevel] = useState('Iniciación / Primera vez');

  const programs = [
    {
      id: 'menores',
      title: 'Escuela de Menores (4 a 16 años)',
      badge: 'Base & Cantera',
      age: 'Benjamín · Alevín · Infantil · Júnior',
      fee: '55.00 € / mes',
      schedule: '2 días/semana (sesiones de 60 min)',
      desc: 'Formación integral enfocada en coordinación psicomotriz, técnica depurada, trabajo en equipo y diversión.',
      features: [
        'Ratio estricto: máximo 4 alumnos por monitor',
        'Material adaptado a edades formativas',
        'Ligas y jornadas de convivencia mensuales',
        'Seguimiento trimestral con informe técnico',
      ],
      popular: true,
    },
    {
      id: 'adultos',
      title: 'Adultos Iniciación & Perfeccionamiento',
      badge: 'Grupos Reducidos',
      age: 'Desde 17 años en adelante',
      fee: '65.00 € / mes',
      schedule: 'Horarios de mañana, mediodía o tarde',
      desc: 'Clases orientadas a mejorar la consistencia táctica, aprender las salidas de pared y ganar solidez en el juego social.',
      features: [
        'Grupos nivelados por PlayLevel y test previo',
        'Bolas nuevas en cada entrenamiento',
        'Partidos guiados con corrección en pista',
        'Sin cuota de permanencia anual',
      ],
      popular: false,
    },
    {
      id: 'competicion',
      title: 'Tecnificación & Alta Competición',
      badge: 'Alto Rendimiento',
      age: 'Jugadores federados con ranking',
      fee: '95.00 € / mes',
      schedule: '3 días/semana + preparación física',
      desc: 'Entrenamiento intensivo para competir en campeonatos oficiales de la Federación Gallega y Española de Pádel.',
      features: [
        'Videoanálisis biomecánico en pista cubierta',
        'Preparador físico titulado especialista en pádel',
        'Acompañamiento técnico en torneos oficiales',
        'Plan nutricional y mental en puntos clave',
      ],
      popular: false,
    },
  ];

  const handleOpenEnrollModal = (programTitle: string) => {
    setSelectedProgram(programTitle);
    setEnrollModalOpen(true);
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerDemoToast(
      'Solicitud de Admisión Enviada',
      `Hemos registrado la solicitud para "${selectedProgram}". La dirección técnica de ${currentTenant.name} te llamará al ${studentPhone || 'teléfono'} para coordinar la prueba de nivel gratuita.`,
      'success'
    );
    setEnrollModalOpen(false);
    setStudentName('');
    setParentName('');
    setStudentPhone('');
  };

  return (
    <div className="space-y-16 pb-20 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Hero Oficial de la Academia */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 lg:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/20">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{currentTenant.branding.badgeText || 'ACADEMIA OFICIAL HOMOLOGADA FEP'}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {currentTenant.branding.heroTitle || 'Formación Integral y Alto Rendimiento para Jugadores de Pádel'}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed">
                {currentTenant.branding.heroSubtitle ||
                  'Escuela federada desde iniciación hasta competición profesional. Metodología basada en biomecánica, videoanálisis táctico y preparación física específica.'}
              </p>

              {/* KPI Badges */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">+140</div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Alumnos Formados</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="text-base font-black text-slate-900 dark:text-white font-mono">8 Grupos</div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Por Niveles & Edades</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">4 Técnicos</div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Titulados FEP / FGP</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenEnrollModal('Prueba de Nivel Gratuita')}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition hover:scale-105 active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Solicitar Prueba de Nivel Gratuita</span>
                </button>

                <a
                  href={`https://wa.me/${currentTenant.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    currentTenant.settings.whatsappGreetingMessage || 'Hola, me gustaría información sobre inscripciones en la Escuela de Pádel.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Academy Image Card */}
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
                    Centro de Tecnificación Oficial · Pistas Panorámicas Cubiertas
                  </div>
                  <div className="text-slate-300 text-[10px]">
                    {currentTenant.address}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Programas Formativos de la Escuela */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Niveles y Edades
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Programas de la Temporada 2026</h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Plazas limitadas por grupo para garantizar atención individualizada y evolución real de cada jugador.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((p) => (
            <div
              key={p.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border ${
                p.popular ? 'border-emerald-500 shadow-xl ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800 shadow-sm'
              } space-y-5 flex flex-col justify-between relative hover:border-emerald-500/50 transition`}
            >
              {p.popular && (
                <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase shadow-md">
                  MÁS SOLICITADO
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">{p.badge}</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{p.title}</h3>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">{p.age}</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-2">{p.fee}</div>
                  <div className="text-[11px] text-slate-500">{p.schedule}</div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {p.desc}
                </p>

                <div className="space-y-2 text-xs">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenEnrollModal(p.title)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Solicitar Plaza / Prueba</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Claustro Técnico de Entrenadores */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Equipo Técnico
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Entrenadores Titulados</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Monitores Nacionales FEP / FGP</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coaches.slice(0, 3).map((coach) => (
            <div
              key={coach.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-emerald-500/50 transition"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={coach.photoUrl}
                  alt={coach.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950/90 text-amber-300 text-xs font-bold border border-slate-800">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{coach.rating.toFixed(2)}</span>
                </div>
                <div className="absolute bottom-3 left-3 text-xs text-white">
                  <div className="font-bold text-base">{coach.name}</div>
                  <div className="text-emerald-400 text-[11px] font-semibold">{coach.roleTitle}</div>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{coach.bio}</p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 font-semibold">
                  Especialidad: Biomecánica & Competición
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Metodología e Instalaciones de la Escuela */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Metodología Formativa</span>
            <h2 className="text-2xl sm:text-3xl font-black">Por qué elegir nuestra Escuela</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Diseñamos cada sesión para que los alumnos aprendan con una base técnica sólida, evitando malos hábitos posturales y divirtiéndose en pista.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
              <Users className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Ratios Reducidos (Máx. 4)</h3>
              <p className="text-slate-300 leading-relaxed">
                Cada alumno golpea más de 200 bolas por sesión, con constante interacción y sin colas.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
              <Video className="w-6 h-6 text-teal-400" />
              <h3 className="font-bold text-sm text-white">Videoanálisis en Tableta</h3>
              <p className="text-slate-300 leading-relaxed">
                Grabación in situ para corregir posición de pala, apoyos y punto de impacto en directo.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Educación en Valores</h3>
              <p className="text-slate-300 leading-relaxed">
                Respeto al rival, compañerismo con la pareja y deportividad dentro y fuera de la pista.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MODAL DE INSCRIPCIÓN / PRUEBA DE NIVEL */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 space-y-5">
            <button
              type="button"
              onClick={() => setEnrollModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                Formulario de Admisión
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {selectedProgram}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Te asignaremos un grupo adecuado a tu nivel tras una prueba gratuita de 20 minutos.
              </p>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nombre del Alumno:</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ej. Lucas Vázquez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Teléfono de Contacto (o Tutor):</label>
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="Ej. +34 650 99 88 77"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Horario Preferente:</label>
                  <select
                    value={preferredSchedule}
                    onChange={(e) => setPreferredSchedule(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Mañanas (10:00 - 12:00)">Mañanas (10:00 - 12:00)</option>
                    <option value="Tardes (17:30 - 19:00)">Tardes (17:30 - 19:00)</option>
                    <option value="Noches (19:30 - 21:00)">Noches (19:30 - 21:00)</option>
                    <option value="Sábados Mañana">Sábados Mañana</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Nivel Aproximado:</label>
                  <select
                    value={studentLevel}
                    onChange={(e) => setStudentLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Iniciación / Primera vez">Iniciación / Primera vez</option>
                    <option value="Básico (juega partidos)">Básico (juega partidos)</option>
                    <option value="Intermedio (3.0 - 4.0)">Intermedio (3.0 - 4.0)</option>
                    <option value="Competición Federada">Competición Federada</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Solicitar Prueba de Nivel en la Escuela</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
