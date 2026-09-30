import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Users, Clock, Plus, CheckCircle2 } from 'lucide-react';

export const AdminSchool: React.FC = () => {
  const { academyGroups, coaches, triggerDemoToast } = useApp();

  return (
    <div className="space-y-6 text-slate-100 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Gestión de la Escuela de Pádel</h2>
          <p className="text-xs text-slate-400">Control de grupos cuatrimestrales, alumnos y asignación de pistas</p>
        </div>

        <button
          onClick={() => triggerDemoToast('Crear Grupo', 'Asistente de nuevo grupo de escuela abierto en modo demo.', 'info')}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white text-xs shadow flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Grupo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {academyGroups.map((group) => (
          <div
            key={group.id}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                {group.levelCategory}
              </span>
              <span className="font-mono text-sm font-bold text-white">
                {group.monthlyFee.toFixed(2)} €/mes
              </span>
            </div>

            <h3 className="text-base font-bold text-white">{group.name}</h3>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Entrenador:</span>
                <span className="font-semibold text-white">{group.coachName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Horario:</span>
                <span className="text-emerald-400 font-medium">{group.schedule}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Ocupación:</span>
                <span>{group.currentStudents} de {group.maxStudents} alumnos</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => triggerDemoToast('Pasar Lista', `Lista de asistencia abierta para ${group.name}.`, 'info')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold"
              >
                Pasar Lista
              </button>
              <button
                onClick={() => triggerDemoToast('Asignación de Pista', `Pistas asignadas para ${group.name}.`, 'success')}
                className="px-3 py-1.5 rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/40 font-semibold"
              >
                Asignar Pista
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
