import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Plus, Calendar, Award, CheckCircle2 } from 'lucide-react';

export const AdminTournaments: React.FC = () => {
  const { tournaments, triggerDemoToast } = useApp();

  return (
    <div className="space-y-6 text-slate-100 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Organización de Torneos & Cuadros</h2>
          <p className="text-xs text-slate-400">Pádel San Mateo · Gestión de inscripciones, horarios y resultados</p>
        </div>

        <button
          onClick={() => triggerDemoToast('Nuevo Torneo', 'Creador de torneo abierto en modo demo.', 'info')}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Torneo</span>
        </button>
      </div>

      <div className="space-y-4">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">{t.dates}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{t.title}</h3>
              </div>
              <span className="font-mono text-sm font-bold text-cyan-400">
                Inscripción: {t.entryFee.toFixed(2)} €/jugador
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {t.categories.map((c, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200">{c.name}</div>
                  <div className="text-[10px] text-slate-400">{c.teamsCount} / {c.maxTeams} parejas</div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">{t.prizes}</span>
              <button
                onClick={() => triggerDemoToast('Generar Horarios', `Horarios de partidos generados para ${t.title}.`, 'success')}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
              >
                Generar Cuadros & Pistas
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
