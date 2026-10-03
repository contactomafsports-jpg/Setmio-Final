import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  GraduationCap,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  DollarSign,
  Star,
  Award,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface ClassGroupDetailViewProps {
  groupId?: string;
  onBack?: () => void;
}

export const ClassGroupDetailView: React.FC<ClassGroupDetailViewProps> = ({
  groupId,
  onBack,
}) => {
  const { currentTenant, setPublicPage, triggerDemoToast } = useApp();

  const [registered, setRegistered] = useState(false);
  const [purchasedSingleSeat, setPurchasedSingleSeat] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setPublicPage('academy');
    }
  };

  const group = {
    id: groupId || 'grp-1',
    name: 'Grupo Adultos Perfeccionamiento & Táctica',
    level: 'Nivel 3.5 a 4.5',
    schedule: 'Martes y Jueves · 19:30 a 20:30',
    location: 'Pistas 1 y 2 Centrales WPT',
    monthlyPrice: 65.0,
    singleClassPrice: 18.0,
    maxStudents: 4,
    currentStudents: 3, // 1 free slot available!
    waitingListCount: 2,
    period: 'Trimestral (Renovación automática)',
    coach: {
      name: 'Laura Senra',
      title: 'Directora de Tecnificación & Entrenadora Nacional N2 FEP',
      rating: 4.95,
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      bio: 'Ex-jugadora World Padel Tour y especialista en biomecánica de golpeo y transiciones defensa-ataque.',
    },
    students: [
      { name: 'Carlos Méndez', level: 3.85, attendance: '100%' },
      { name: 'Brais Quintana', level: 3.60, attendance: '95%' },
      { name: 'Marcos Seijo', level: 3.90, attendance: '90%' },
    ],
  };

  const freeSlots = group.maxStudents - group.currentStudents;

  const handleJoinMonthly = () => {
    setRegistered(true);
    triggerDemoToast(
      'Inscripción Trimestral Confirmada',
      `Te has inscrito al grupo de ${group.name}. Plaza reservada con Laura Senra.`,
      'success'
    );
  };

  const handleBuySingleSeat = () => {
    setPurchasedSingleSeat(true);
    triggerDemoToast(
      'Plaza Suelta Adquirida (18,00 €)',
      `Has reservado 1 sesión individual suelta para el próximo Martes a las 19:30 en ${group.name}.`,
      'success'
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP BAR WITH BACK BUTTON */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-xs shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Escuela</span>
        </button>

        <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-mono text-xs font-bold">
          {freeSlots > 0 ? `¡${freeSlots} Plaza Libre Disponible!` : 'Grupo Completo (Lista de Espera)'}
        </span>
      </div>

      {/* 2. GROUP HERO CARD */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/60 shadow-2xl space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>Escuela Oficial de Tecnificación · {currentTenant.name}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {group.name}
          </h1>

          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Programa de entrenamiento periódico enfocado en juego aéreo (bandeja, víbora y remate de definición), salida de pared de fondo y táctica de compenetración en la red.
          </p>
        </div>

        {/* Group Specs Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-indigo-900/60 text-xs">
          <div>
            <div className="text-slate-400">Horario Semanal</div>
            <div className="font-bold text-white mt-0.5">{group.schedule}</div>
          </div>
          <div>
            <div className="text-slate-400">Nivel Requerido</div>
            <div className="font-bold text-emerald-400 mt-0.5">{group.level}</div>
          </div>
          <div>
            <div className="text-slate-400">Cupo Máximo</div>
            <div className="font-bold text-white mt-0.5">{group.currentStudents} / {group.maxStudents} Alumnos</div>
          </div>
          <div>
            <div className="text-slate-400">Cuota Mensual</div>
            <div className="font-black text-xl text-amber-400 font-mono">{group.monthlyPrice.toFixed(2)} €/mes</div>
          </div>
        </div>
      </div>

      {/* 3. LÓGICA DE PLAZAS SUELTAS VS MENSUAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option A: Monthly Enrollment */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs">
                Opción Regular
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {group.monthlyPrice.toFixed(2)} €<span className="text-xs text-slate-400 font-normal">/mes</span>
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Inscripción al Grupo Trimestral
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Reserva tu plaza fija en el grupo con acceso a 8 clases al mes, evaluaciones mensuales de nivel y preparación para torneos federados.
            </p>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>8 sesiones de entrenamiento intensivo al mes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Seguimiento de progresión y grabación en vídeo</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleJoinMonthly}
            disabled={registered}
            className={`w-full py-3 rounded-xl font-bold text-xs transition shadow-sm ${
              registered
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {registered ? '✓ Ya estás Inscrito al Grupo' : 'Inscribirme al Grupo Trimestral'}
          </button>
        </div>

        {/* Option B: Loose Class Drop-in Seat */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 border-2 border-purple-300 dark:border-purple-800/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-purple-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Novedad: Plaza Suelta</span>
              </span>
              <span className="text-2xl font-black text-purple-700 dark:text-purple-300 font-mono">
                {group.singleClassPrice.toFixed(2)} €<span className="text-xs text-slate-400 font-normal">/sesión</span>
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Comprar 1 Plaza Suelta (Hueco Libre)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ¿No puedes comprometerte todo el mes? Aprovecha los huecos libres del grupo para unirte a una sesión individual sin cuota periódica.
            </p>

            <div className="p-3 rounded-xl bg-purple-100/70 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 text-xs text-purple-950 dark:text-purple-200">
              <strong>1 plaza disponible</strong> para la próxima sesión del <strong>Martes a las 19:30</strong> con Laura Senra.
            </div>
          </div>

          <button
            onClick={handleBuySingleSeat}
            disabled={purchasedSingleSeat}
            className={`w-full py-3 rounded-xl font-bold text-xs transition shadow-sm ${
              purchasedSingleSeat
                ? 'bg-purple-700 text-white cursor-default'
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            {purchasedSingleSeat ? '✓ Plaza Suelta Reservada para el Martes' : `Comprar Plaza Suelta (${group.singleClassPrice.toFixed(2)} €)`}
          </button>
        </div>
      </div>

      {/* 4. COACH BIO & STUDENTS ROSTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coach card */}
        <div className="md:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={group.coach.avatarUrl}
              alt={group.coach.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500"
            />
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">{group.coach.name}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{group.coach.title}</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">{group.coach.bio}</p>
        </div>

        {/* Current Students */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 dark:text-white text-base">Alumnos del Grupo ({group.students.length}/{group.maxStudents})</h3>
            <span className="text-xs text-slate-400">{group.waitingListCount} en lista de espera</span>
          </div>

          <div className="space-y-2.5">
            {group.students.map((student, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-[11px]">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">{student.name}</strong>
                    <div className="text-[10px] text-slate-400">Nivel FEP {student.level.toFixed(2)}</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 font-bold">{student.attendance} Asistencia</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
