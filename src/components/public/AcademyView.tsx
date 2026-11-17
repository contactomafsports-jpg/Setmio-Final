import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coach, AcademyGroup } from '../../types/database';
import playerPadelImg from '../../assets/images/player_padel_action_1794872242959.jpg';
import {
  Star,
  Users,
  ArrowRight,
  ShieldCheck,
  X,
  GraduationCap,
  Video,
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
      `Inscripción enviada para "${selectedGroup.name}". La coordinación de ${currentTenant.shortName} contactará contigo en el ${studentPhone || 'teléfono indicado'} para la prueba de nivel previa.`,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 text-[#0B1A2D] dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="text-xs font-mono text-[#8B5CF6] dark:text-[#a78bfa] uppercase tracking-[0.14em] flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4" />
          <span>Formación Oficial Federada</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight leading-tight">
          Escuela de {currentTenant.name}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          Metodología integral desarrollada por técnicos titulados. Grupos reducidos de máximo 4 alumnos con objetivos de juego reales, preparación física y torneos internos mensuales.
        </p>
      </div>

      {/* Methodology Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] text-[#B7F229] dark:text-[#0B1A2D] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">Ratio Máximo 4 Alumnos</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Garantizamos alta frecuencia de golpeo por sesión sin tiempos muertos en banqueta ni esperas innecesarias.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] dark:text-[#a78bfa] flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">Vídeo Análisis Biomecánico</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Grabación en pista de bandejas, víboras y salidas de pared con corrección visual instantánea en tableta.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] text-[#B7F229] dark:text-[#0B1A2D] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">Titulaciones Oficiales</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Entrenadores nacionales con experiencia en torneos del circuito profesional y ligas federadas.
          </p>
        </div>
      </div>

      {/* Coaches Showcase */}
      <div className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200/80 dark:border-[#1A314D] pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight">
              Cuerpo Técnico Profesional
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monitores titulados en plantilla del club</p>
          </div>
          <span className="text-xs font-mono text-[#8B5CF6] dark:text-[#a78bfa] hidden sm:inline">
            Titulaciones Oficiales FEP
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-60 overflow-hidden bg-[#071220]">
                <img
                  src={coach.photoUrl || playerPadelImg}
                  alt={coach.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = playerPadelImg;
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071220] via-[#071220]/30 to-transparent" />
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0B1A2D]/90 text-[#B7F229] text-xs font-mono tabular-nums font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{coach.rating.toFixed(2)}</span>
                </div>
                <div className="absolute bottom-3.5 left-4 text-xs text-white">
                  <div className="font-bold text-base">{coach.name}</div>
                  <div className="text-[#B7F229] text-[11px] font-semibold">{coach.roleTitle}</div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{coach.bio}</p>

                <div className="pt-4 border-t border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase block">Clase 1a1</span>
                    <div className="font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-white text-sm">
                      {coach.hourlyRate.toFixed(2)} €/h
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCoach(coach)}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] hover:opacity-90 text-white dark:text-[#0B1A2D] font-bold text-xs transition cursor-pointer"
                  >
                    Pedir Clase
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academy Groups */}
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-mono text-[#8B5CF6] dark:text-[#a78bfa] uppercase tracking-[0.14em]">
            Cursos Regulares Cuatrimestrales
          </div>
          <h2 className="text-2xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight">
            Grupos y Niveles Disponibles
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Entrenamiento continuo de octubre a junio con renovación mensual sin permanencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {academyGroups.map((g) => {
            const isFull = g.currentStudents >= g.maxStudents;
            return (
              <div
                key={g.id}
                className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8B5CF6] dark:text-[#a78bfa] font-mono uppercase tracking-wider font-semibold">
                      {g.levelCategory}
                    </span>
                    <span className="font-mono tabular-nums text-xl font-extrabold text-[#0B1A2D] dark:text-white">
                      {g.monthlyFee.toFixed(2)} €/mes
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white">{g.name}</h3>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Profesor: <strong className="text-[#0B1A2D] dark:text-white">{g.coachName}</strong>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Horario: <span className="text-[#0B1A2D] dark:text-[#B7F229] font-semibold font-mono tabular-nums">{g.schedule}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                      <Users className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                      <span>
                        Plazas: <strong className="text-[#0B1A2D] dark:text-white">{g.currentStudents}</strong> / {g.maxStudents}
                      </span>
                    </div>
                    {isFull ? (
                      <span className="text-[#8B5CF6] dark:text-[#a78bfa] font-semibold">Grupo Completo</span>
                    ) : (
                      <span className="text-[#0B1A2D] dark:text-[#B7F229] font-semibold font-mono tabular-nums">
                        {g.maxStudents - g.currentStudents} plazas libres
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedGroup(g)}
                  className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isFull ? 'Unirse a Lista de Espera' : 'Solicitar Inscripción'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Private Lesson Modal */}
      {selectedCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/80 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-6 sm:p-7 text-[#0B1A2D] dark:text-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-[#1A314D] pb-3.5">
              <div>
                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">Clase Particular de Pádel</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5">
                  Con {selectedCoach.name} · {selectedCoach.hourlyRate.toFixed(2)} €/h
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCoach(null)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePrivateLessonSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#0B1A2D] dark:text-slate-300 font-semibold mb-1.5">Tu Nombre y Apellidos</label>
                <input
                  type="text"
                  required
                  value={privateStudentName}
                  onChange={(e) => setPrivateStudentName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-[#0B1A2D] dark:text-slate-300 font-semibold mb-1.5">Teléfono Móvil</label>
                <input
                  type="tel"
                  required
                  value={privateStudentPhone}
                  onChange={(e) => setPrivateStudentPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-[#0B1A2D] dark:text-slate-300 font-semibold mb-1.5">Preferencia Horaria</label>
                <select
                  value={privateDatePref}
                  onChange={(e) => setPrivateDatePref(e.target.value)}
                  className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option>Mañanas (9:00 - 13:00)</option>
                  <option>Mediodía (13:00 - 16:00)</option>
                  <option>Tardes (16:00 - 20:00)</option>
                  <option>Fines de semana</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedCoach(null)}
                  className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-5 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/80 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-6 sm:p-7 text-[#0B1A2D] dark:text-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-[#1A314D] pb-3.5">
              <div>
                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Inscripción en {selectedGroup.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Profesor: {selectedGroup.coachName} · {selectedGroup.schedule}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGroup(null)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#0B1A2D] dark:text-slate-300 font-semibold mb-1.5">Nombre y Apellidos</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-[#0B1A2D] dark:text-slate-300 font-semibold mb-1.5">Teléfono de Contacto</label>
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-[#0B1A2D] dark:text-slate-300 font-semibold mb-1.5">Tu Nivel Aproximado</label>
                <select
                  value={studentLevel}
                  onChange={(e) => setStudentLevel(e.target.value)}
                  className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option>Iniciación (Nunca he jugado o menos de 6 meses)</option>
                  <option>Intermedio (Nivel 2.5 a 3.5)</option>
                  <option>Avanzado / Competición (Nivel 4.0 o superior)</option>
                  <option>Menor de 16 años (Escuela infantil)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071220] text-[11px] text-slate-600 dark:text-slate-400">
                Cuota mensual: <strong className="font-mono tabular-nums text-[#0B1A2D] dark:text-white">{selectedGroup.monthlyFee.toFixed(2)} €/mes</strong>. Incluye pista, bolas nuevas y material de entrenamiento.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedGroup(null)}
                  className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 font-semibold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-5 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold transition cursor-pointer"
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
