import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import heroPadelImg from '../../assets/images/hero_padel_club_1794872242820.jpg';
import playerPadelImg from '../../assets/images/player_padel_action_1794872242959.jpg';
import {
  GraduationCap,
  Users,
  Calendar,
  Star,
  ShieldCheck,
  Video,
  Send,
  MessageCircle,
  X,
  Check,
} from 'lucide-react';

export const AcademyPublicLanding: React.FC = () => {
  const { currentTenant, coaches, triggerDemoToast } = useApp();

  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>('Escuela de Menores');
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
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
    setStudentPhone('');
  };

  return (
    <div className="bg-white dark:bg-[#0B1A2D] space-y-20 pb-24 text-[#0B1A2D] dark:text-slate-100 transition-colors">
      {/* 1. Hero Oficial de la Academia */}
      <section className="bg-[#0B1A2D] text-white py-14 lg:py-20 border-b border-[#1A314D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-[#B7F229] font-semibold text-xs tracking-wide">
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>{currentTenant.branding.badgeText || 'ACADEMIA OFICIAL HOMOLOGADA FEP'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-white leading-[1.08] text-balance">
                {currentTenant.branding.heroTitle || 'Formación Integral y Alto Rendimiento para Jugadores de Pádel'}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                {currentTenant.branding.heroSubtitle ||
                  'Escuela federada desde iniciación hasta competición profesional. Metodología basada en biomecánica, videoanálisis táctico y preparación física específica.'}
              </p>

              {/* KPI Strip */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#1A314D]">
                <div>
                  <div className="text-2xl font-bold text-[#B7F229] font-mono tabular-nums">+140</div>
                  <span className="text-xs text-slate-400">Alumnos Formados</span>
                </div>

                <div>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">8 Grupos</div>
                  <span className="text-xs text-slate-400">Por Niveles & Edades</span>
                </div>

                <div>
                  <div className="text-2xl font-bold text-[#a78bfa] font-mono tabular-nums">4 Técnicos</div>
                  <span className="text-xs text-slate-400">Titulados FEP / FGP</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenEnrollModal('Prueba de Nivel Gratuita')}
                  className="min-h-[44px] px-6 py-3 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Solicitar Prueba de Nivel Gratuita</span>
                </button>

                <a
                  href={`https://wa.me/${currentTenant.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    currentTenant.settings.whatsappGreetingMessage || 'Hola, me gustaría información sobre inscripciones en la Escuela de Pádel.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-5 py-3 rounded-xl bg-[#0E2239] hover:bg-[#132A45] text-white font-semibold text-sm border border-[#1A314D] flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#B7F229] shrink-0" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Academy Image Frame */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-[#1A314D] bg-[#0E2239] shadow-2xl">
                <img
                  src={currentTenant.branding.heroImageUrl || heroPadelImg}
                  alt={currentTenant.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D] via-[#0B1A2D]/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white text-xs space-y-1">
                  <div className="font-bold text-lg text-white">{currentTenant.name}</div>
                  <div className="text-[#B7F229] font-medium">
                    Centro de Tecnificación Oficial · Pistas Panorámicas Cubiertas
                  </div>
                  <div className="text-slate-300">{currentTenant.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Programas Formativos de la Escuela */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-left sm:text-center space-y-2 max-w-2xl sm:mx-auto">
          <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide">
            Niveles y Edades
          </span>
          <h2 className="text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight">
            Programas de la Temporada 2026
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Plazas limitadas por grupo para garantizar atención individualizada y evolución real de cada jugador.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((p) => (
            <div
              key={p.id}
              className={`p-7 rounded-2xl space-y-5 flex flex-col justify-between ${
                p.popular
                  ? 'bg-[#0B1A2D] text-white border-2 border-[#B7F229]'
                  : 'bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D]'
              }`}
            >
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-semibold ${p.popular ? 'text-[#a78bfa]' : 'text-[#8B5CF6] dark:text-[#a78bfa]'}`}>
                      {p.badge}
                    </span>
                    {p.popular && (
                      <span className="text-xs font-semibold text-[#B7F229]">Más Solicitado</span>
                    )}
                  </div>
                  <h3 className={`text-xl font-bold mt-1.5 tracking-tight ${p.popular ? 'text-white' : 'text-[#0B1A2D] dark:text-white'}`}>
                    {p.title}
                  </h3>
                  <div className={`text-xs font-medium mt-1 ${p.popular ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    {p.age}
                  </div>
                  <div className={`text-2xl font-bold font-mono tabular-nums mt-3 ${p.popular ? 'text-[#B7F229]' : 'text-[#0B1A2D] dark:text-white'}`}>
                    {p.fee}
                  </div>
                  <div className={`text-xs ${p.popular ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {p.schedule}
                  </div>
                </div>

                <p className={`text-sm leading-relaxed border-t pt-4 ${p.popular ? 'border-[#1A314D] text-slate-300' : 'border-slate-100 dark:border-[#1A314D] text-slate-600 dark:text-slate-400'}`}>
                  {p.desc}
                </p>

                <div className="space-y-2.5 text-xs">
                  {p.features.map((f, i) => (
                    <div key={i} className={`flex items-center gap-2 ${p.popular ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>
                      <Check className={`w-4 h-4 shrink-0 ${p.popular ? 'text-[#B7F229]' : 'text-[#8B5CF6] dark:text-[#B7F229]'}`} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenEnrollModal(p.title)}
                className={`w-full min-h-[42px] py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  p.popular
                    ? 'bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D]'
                    : 'bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#132A45] dark:hover:bg-[#1A314D]'
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Solicitar Plaza / Prueba</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Claustro Técnico de Entrenadores */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide">
              Equipo Técnico
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight mt-1">
              Entrenadores Titulados
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monitores Nacionales FEP / FGP</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coaches.slice(0, 3).map((coach) => (
            <div
              key={coach.id}
              className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-60 overflow-hidden bg-[#0B1A2D]">
                <img
                  src={coach.photoUrl || playerPadelImg}
                  alt={coach.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D] via-[#0B1A2D]/20 to-transparent" />
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0B1A2D]/90 text-[#B7F229] text-xs font-mono tabular-nums font-bold border border-[#1A314D]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{coach.rating.toFixed(2)}</span>
                </div>
                <div className="absolute bottom-3 left-4 text-xs text-white">
                  <div className="font-bold text-base">{coach.name}</div>
                  <div className="text-[#B7F229] font-medium">{coach.roleTitle}</div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{coach.bio}</p>
                <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Especialidad: Biomecánica & Competición
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Metodología e Instalaciones de la Escuela */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1A2D] border border-[#1A314D] text-white p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold text-[#B7F229] tracking-wide">Metodología Formativa</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Por qué elegir nuestra Escuela</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Diseñamos cada sesión para que los alumnos aprendan con una base técnica sólida, evitando malos hábitos posturales y divirtiéndose en pista.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="p-6 rounded-2xl bg-[#0E2239] border border-[#1A314D] space-y-2.5">
              <Users className="w-5 h-5 text-[#B7F229]" />
              <h3 className="font-bold text-sm text-white">Ratios Reducidos (Máx. 4)</h3>
              <p className="text-slate-300 leading-relaxed">
                Cada alumno golpea más de 200 bolas por sesión, con constante interacción y sin colas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0E2239] border border-[#1A314D] space-y-2.5">
              <Video className="w-5 h-5 text-[#a78bfa]" />
              <h3 className="font-bold text-sm text-white">Videoanálisis en Tableta</h3>
              <p className="text-slate-300 leading-relaxed">
                Grabación in situ para corregir posición de pala, apoyos y punto de impacto en directo.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0E2239] border border-[#1A314D] space-y-2.5">
              <ShieldCheck className="w-5 h-5 text-[#B7F229]" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1A2D]/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#0B1A2D] dark:text-slate-100 space-y-5">
            <button
              type="button"
              onClick={() => setEnrollModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa]">
                Formulario de Admisión
              </span>
              <h3 className="text-xl font-bold text-[#0B1A2D] dark:text-white mt-1 tracking-tight">
                {selectedProgram}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Te asignaremos un grupo adecuado a tu nivel tras una prueba gratuita de 20 minutos.
              </p>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1.5">Nombre del Alumno:</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ej. Lucas Vázquez"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-[#F8FAFC] dark:bg-[#071220] text-sm focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1.5">Teléfono de Contacto (o Tutor):</label>
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="Ej. +34 650 99 88 77"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-[#F8FAFC] dark:bg-[#071220] text-sm font-mono tabular-nums focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1.5">Horario Preferente:</label>
                  <select
                    value={preferredSchedule}
                    onChange={(e) => setPreferredSchedule(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-[#F8FAFC] dark:bg-[#071220] text-sm focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="Mañanas (10:00 - 12:00)">Mañanas (10:00 - 12:00)</option>
                    <option value="Tardes (17:30 - 19:00)">Tardes (17:30 - 19:00)</option>
                    <option value="Noches (19:30 - 21:00)">Noches (19:30 - 21:00)</option>
                    <option value="Sábados Mañana">Sábados Mañana</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1.5">Nivel Aproximado:</label>
                  <select
                    value={studentLevel}
                    onChange={(e) => setStudentLevel(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-[#F8FAFC] dark:bg-[#071220] text-sm focus:outline-none focus:border-[#8B5CF6]"
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
                className="w-full min-h-[44px] py-3 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>Solicitar Prueba de Nivel en la Escuela</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
