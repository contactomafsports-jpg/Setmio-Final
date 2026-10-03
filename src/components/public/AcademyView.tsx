import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coach, AcademyGroup } from '../../types/database';
import {
  Award,
  Star,
  Users,
  CheckCircle2,
  Calendar,
  Phone,
  ArrowRight,
  ShieldCheck,
  X,
  Sparkles,
  GraduationCap,
  Video,
  ArrowLeft,
  Clock,
} from 'lucide-react';

export const AcademyView: React.FC = () => {
  const { currentTenant, coaches, academyGroups, triggerDemoToast } = useApp();
  const [selectedGroup, setSelectedGroup] = useState<AcademyGroup | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  // Enrollment form state
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentLevel, setStudentLevel] = useState('Intermedio (Nivel 3.0 - 4.0)');

  // Private lesson request form state
  const [privateStudentName, setPrivateStudentName] = useState('');
  const [privateStudentPhone, setPrivateStudentPhone] = useState('');
  const [privateDatePref, setPrivateDatePref] = useState('Tardes a partir de las 18:00');

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    triggerDemoToast(
      'Solicitud de Plaza Recibida',
      `Inscripción enviada para "${selectedGroup.name}". La coordinación de la escuela de Pádel San Mateo contactará contigo en el ${studentPhone || 'teléfono indicado'} para la prueba de nivel previa.`,
      'success'
    );
    setSelectedGroup(null);
    setStudentName('');
    setStudentPhone('');
  };

  const handlePrivateLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoach) return;

    triggerDemoToast(
      'Solicitud de Clase Particular',
      `Petición de clase con ${selectedCoach.name} registrada. Te llamaremos al ${privateStudentPhone} para confirmar pista y horario.`,
      'success'
    );
    setSelectedCoach(null);
    setPrivateStudentName('');
    setPrivateStudentPhone('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4" />
          <span>Formación Oficial Federada</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Escuela de Pádel San Mateo
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          Metodología integral desarrollada por técnicos titulados por la Federación Española y Gallega de Pádel. Grupos reducidos de máximo 4 alumnos con objetivos de juego reales, preparación física y torneos internos mensuales.
        </p>
      </div>

      {/* Methodology Highlight Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Ratio Máximo 4 Alumnos</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Garantizamos alta frecuencia de golpeo por sesión sin tiempos muertos en banqueta ni esperas innecesarias.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-cyan-400 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Vídeo Análisis Biomecánico</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Grabación en pista de bandejas, víboras y salidas de pared con corrección visual instantánea en tableta.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Titulaciones FEP y FGP</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Entrenadores nacionales con experiencia en torneos del circuito profesional y ligas federadas gallegas.
          </p>
        </div>
      </div>

      {/* Coaches Showcase */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Cuerpo Técnico Profesional
            </h2>
            <p className="text-xs text-slate-500">Monitores titulados en plantilla del club</p>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Titulaciones Oficiales FEP / FGP</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between group shadow-sm hover:shadow-md"
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

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{coach.bio}</p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px]">Clase Particular 1a1:</span>
                    <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">{coach.hourlyRate.toFixed(2)} €/h</div>
                  </div>

                  <button
                    onClick={() => setSelectedCoach(coach)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition"
                  >
                    Pedir Clase
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academy Groups & Monthly Programs */}
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-teal-600 dark:text-cyan-400 uppercase tracking-wider">
            Cursos Regulares Cuatrimestrales
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Grupos y Niveles Disponibles
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Entrenamiento continuo de octubre a junio con renovación mensual sin permanencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {academyGroups.map((g) => {
            const isFull = g.currentStudents >= g.maxStudents;
            return (
              <div
                key={g.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase">{g.levelCategory}</span>
                    <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">{g.monthlyFee.toFixed(2)} €/mes</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{g.name}</h3>
                  <div className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                    Profesor: <strong className="text-slate-900 dark:text-white">{g.coachName}</strong>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Horario: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{g.schedule}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                      <span>
                        Plazas: <strong className="text-slate-900 dark:text-white">{g.currentStudents}</strong> de {g.maxStudents}
                      </span>
                    </div>
                    {isFull ? (
                      <span className="text-rose-600 dark:text-rose-400 font-semibold">Grupo Completo</span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {g.maxStudents - g.currentStudents} plazas libres
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedGroup(g)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
                >
                  <span>{isFull ? 'Unirse a Lista de Espera' : 'Solicitar Inscripción'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Private Lesson Request Modal */}
      {selectedCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Clase Particular de Pádel</h3>
                <p className="text-xs text-slate-500">Con {selectedCoach.name} · {selectedCoach.hourlyRate.toFixed(2)} €/h</p>
              </div>
              <button
                onClick={() => setSelectedCoach(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePrivateLessonSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tu Nombre y Apellidos</label>
                <input
                  type="text"
                  required
                  value={privateStudentName}
                  onChange={(e) => setPrivateStudentName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Teléfono Móvil (WhatsApp)</label>
                <input
                  type="tel"
                  required
                  value={privateStudentPhone}
                  onChange={(e) => setPrivateStudentPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Preferencia Horaria</label>
                <select
                  value={privateDatePref}
                  onChange={(e) => setPrivateDatePref(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option>Mañanas (9:00 - 13:00)</option>
                  <option>Mediodía (13:00 - 16:00)</option>
                  <option>Tardes (16:00 - 20:00)</option>
                  <option>Fines de semana</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCoach(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold transition shadow"
                >
                  Solicitar Clase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enrollment Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Inscripción en {selectedGroup.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Profesor: {selectedGroup.coachName} · {selectedGroup.schedule}
            </p>

            <form onSubmit={handleEnrollSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Nombre y Apellidos</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Teléfono de Contacto / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tu Nivel Aproximado de Pádel</label>
                <select
                  value={studentLevel}
                  onChange={(e) => setStudentLevel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option>Iniciación (Nunca he jugado o menos de 6 meses)</option>
                  <option>Intermedio (Nivel 2.5 a 3.5)</option>
                  <option>Avanzado / Competición (Nivel 4.0 o superior)</option>
                  <option>Menor de 16 años (Escuela infantil)</option>
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                Cuota mensual: <strong className="text-slate-900 dark:text-white">{selectedGroup.monthlyFee.toFixed(2)} €/mes</strong>. Incluye pista, bolas Head Pro nuevas en cada sesión y material de entrenamiento.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGroup(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold transition shadow"
                >
                  Confirmar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
