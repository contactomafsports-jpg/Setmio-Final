import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import playerPadelImg from '../../assets/images/player_padel_action_1794872242959.jpg';
import {
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
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
    currentStudents: 3,
    waitingListCount: 2,
    period: 'Trimestral (Renovación automática)',
    coach: {
      name: 'Laura Senra',
      title: 'Directora de Tecnificación & Entrenadora Nacional N2 FEP',
      rating: 4.95,
      avatarUrl: playerPadelImg,
      bio: 'Ex-jugadora profesional y especialista en biomecánica de golpeo y transiciones defensa-ataque.',
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-slate-200 hover:border-[#0B1A2D] dark:hover:border-[#B7F229] font-semibold text-xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
          <span>Volver a Escuela</span>
        </button>

        <span className="px-3 py-1 rounded-md bg-[#B7F229] text-[#0B1A2D] font-mono tabular-nums text-xs font-bold">
          {freeSlots > 0 ? `${freeSlots} Plaza Libre Disponible` : 'Grupo Completo'}
        </span>
      </div>

      <div className="space-y-8">
        {/* Hero Card */}
        <div className="p-6 sm:p-10 rounded-2xl bg-[#0B1A2D] text-white border border-[#1A314D] space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-[#B7F229]">
              <GraduationCap className="w-4 h-4" />
              <span>Escuela Oficial de Tecnificación · {currentTenant.name}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {group.name}
            </h1>

            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Programa de entrenamiento periódico enfocado en juego aéreo (bandeja, víbora y remate), salida de pared de fondo y táctica en la red.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-[#1A314D] text-xs">
            <div>
              <div className="text-slate-400">Horario Semanal</div>
              <div className="font-semibold text-white mt-0.5 font-mono tabular-nums">{group.schedule}</div>
            </div>
            <div>
              <div className="text-slate-400">Nivel Requerido</div>
              <div className="font-semibold text-[#B7F229] mt-0.5 font-mono tabular-nums">{group.level}</div>
            </div>
            <div>
              <div className="text-slate-400">Cupo Máximo</div>
              <div className="font-semibold text-white mt-0.5 font-mono tabular-nums">{group.currentStudents} / {group.maxStudents} Alumnos</div>
            </div>
            <div>
              <div className="text-slate-400">Cuota Mensual</div>
              <div className="font-extrabold text-xl text-[#B7F229] font-mono tabular-nums">{group.monthlyPrice.toFixed(2)} €/mes</div>
            </div>
          </div>
        </div>

        {/* Enrollment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8B5CF6] dark:text-[#a78bfa] font-semibold">
                  Opción Regular
                </span>
                <span className="text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums">
                  {group.monthlyPrice.toFixed(2)} €<span className="text-xs text-slate-400 font-normal">/mes</span>
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white">
                Inscripción al Grupo Trimestral
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Reserva tu plaza fija en el grupo con acceso a 8 clases al mes, evaluaciones de nivel y preparación para torneos.
              </p>

              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0" />
                  <span>8 sesiones de entrenamiento intensivo al mes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0" />
                  <span>Seguimiento de progresión y grabación en vídeo</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleJoinMonthly}
              disabled={registered}
              className={`w-full min-h-[42px] py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                registered
                  ? 'bg-[#0B1A2D] text-[#B7F229] cursor-default'
                  : 'bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D]'
              }`}
            >
              {registered ? 'Inscrito al Grupo' : 'Inscribirme al Grupo Trimestral'}
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-[#8B5CF6] space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-[#8B5CF6] text-white font-mono text-[10px] uppercase tracking-wider font-bold">
                  Plaza Suelta
                </span>
                <span className="text-2xl font-extrabold text-[#8B5CF6] dark:text-[#a78bfa] font-mono tabular-nums">
                  {group.singleClassPrice.toFixed(2)} €<span className="text-xs text-slate-400 font-normal">/sesión</span>
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white">
                Comprar 1 Plaza Suelta
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Aprovecha los huecos libres del grupo para unirte a una sesión individual sin cuota periódica.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071220] text-xs text-[#0B1A2D] dark:text-slate-200">
                <strong className="font-mono tabular-nums">1 plaza disponible</strong> para el próximo <strong>Martes a las 19:30</strong> con Laura Senra.
              </div>
            </div>

            <button
              type="button"
              onClick={handleBuySingleSeat}
              disabled={purchasedSingleSeat}
              className={`w-full min-h-[42px] py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                purchasedSingleSeat
                  ? 'bg-[#0B1A2D] text-[#B7F229] cursor-default'
                  : 'bg-[#8B5CF6] hover:bg-[#7c3aed] text-white'
              }`}
            >
              {purchasedSingleSeat ? 'Plaza Suelta Reservada' : `Comprar Plaza Suelta (${group.singleClassPrice.toFixed(2)} €)`}
            </button>
          </div>
        </div>

        {/* Coach Bio & Roster */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={group.coach.avatarUrl}
                alt={group.coach.name}
                className="w-14 h-14 rounded-xl object-cover border-2 border-[#B7F229]"
              />
              <div>
                <div className="font-bold text-sm text-[#0B1A2D] dark:text-white">{group.coach.name}</div>
                <div className="text-[11px] text-[#8B5CF6] dark:text-[#a78bfa] font-medium">{group.coach.title}</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{group.coach.bio}</p>
          </div>

          <div className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0B1A2D] dark:text-white text-base">
                Alumnos del Grupo (<span className="font-mono tabular-nums">{group.students.length}/{group.maxStudents}</span>)
              </h3>
              <span className="text-xs font-mono tabular-nums text-slate-400">{group.waitingListCount} en espera</span>
            </div>

            <div className="divide-y divide-slate-200/80 dark:divide-[#1A314D] border border-slate-200/80 dark:border-[#1A314D] rounded-xl overflow-hidden">
              {group.students.map((student, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-[#071220] text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0B1A2D] dark:bg-[#B7F229] text-[#B7F229] dark:text-[#0B1A2D] flex items-center justify-center font-bold text-xs">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <strong className="text-[#0B1A2D] dark:text-slate-200">{student.name}</strong>
                      <div className="text-[11px] font-mono tabular-nums text-slate-500">Nivel {student.level.toFixed(2)}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono tabular-nums text-[#8B5CF6] dark:text-[#a78bfa] font-semibold">
                    {student.attendance} Asistencia
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
