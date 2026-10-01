import React, { FormEvent, useEffect, useState } from 'react';
import { Plus, Shield, Trash2, Users } from 'lucide-react';

interface ClubTeam {
  id: string;
  name: string;
  category: string;
  coach: string;
  players: string[];
  updatedAt: string;
}

const STORAGE_KEY = 'setmio_demo_teams_v1';

function readTeams(): ClubTeam[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as ClubTeam[] : [];
  } catch {
    return [];
  }
}

export const AdminTeams: React.FC = () => {
  const [teams, setTeams] = useState<ClubTeam[]>(readTeams);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [coach, setCoach] = useState('');
  const [roster, setRoster] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
    } catch {
      // Browser storage can be unavailable; keep the current session usable.
    }
  }, [teams]);

  const createTeam = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !category.trim()) return;
    const players = roster.split('\n').map((player) => player.trim()).filter(Boolean);
    setTeams((current) => [{
      id: `team-${Date.now()}`,
      name: name.trim(),
      category: category.trim(),
      coach: coach.trim(),
      players,
      updatedAt: new Date().toLocaleDateString('es-ES'),
    }, ...current]);
    setName('');
    setCategory('');
    setCoach('');
    setRoster('');
  };

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700 dark:text-emerald-400">Deporte de equipo</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Equipos y plantillas</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">Organiza categorías, responsables y listas de jugadores del club.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <Shield className="h-4 w-4" /> Datos locales de demostración
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_1.25fr]">
        <form onSubmit={createTeam} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">Crear plantilla</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Añade los datos básicos del equipo.</p>
          </div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Nombre del equipo
            <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Absoluto femenino A" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </label>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Categoría o competición
            <input required value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Ej. Liga gallega · 1ª categoría" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </label>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Entrenador o responsable
            <input value={coach} onChange={(event) => setCoach(event.target.value)} placeholder="Nombre del responsable" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </label>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Jugadores (uno por línea)
            <textarea value={roster} onChange={(event) => setRoster(event.target.value)} rows={4} placeholder={'Nombre Apellido\\nNombre Apellido'} className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </label>
          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110">
            <Plus className="h-4 w-4" /> Crear equipo
          </button>
        </form>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-white">Plantillas del club</h2>
            <span className="text-xs text-slate-500">{teams.length} equipos</span>
          </div>
          {teams.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
              <Users className="mx-auto h-9 w-9 text-slate-400" />
              <h3 className="mt-3 font-bold text-slate-900 dark:text-white">Aún no hay equipos</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Crea una plantilla para empezar a organizar las convocatorias.</p>
            </div>
          ) : teams.map((team) => (
            <article key={team.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{team.name}</h3>
                  <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">{team.category}</p>
                </div>
                <button type="button" aria-label={`Eliminar ${team.name}`} onClick={() => setTeams((current) => current.filter(({ id }) => id !== team.id))} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                <p className="text-slate-600 dark:text-slate-400"><span className="font-semibold text-slate-800 dark:text-slate-200">Responsable:</span> {team.coach || 'Sin asignar'}</p>
                <p className="text-slate-600 dark:text-slate-400"><span className="font-semibold text-slate-800 dark:text-slate-200">Jugadores:</span> {team.players.length}</p>
              </div>
              {team.players.length > 0 && <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-400">{team.players.join(' · ')}</p>}
              <p className="mt-3 text-[10px] text-slate-400">Actualizado {team.updatedAt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};