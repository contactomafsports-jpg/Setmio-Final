import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpenMatch } from '../../types/database';
import { Users, Plus, CheckCircle2, UserCheck, Calendar, Clock, ArrowRight, Shield } from 'lucide-react';

export const OpenMatchesView: React.FC = () => {
  const {
    openMatches,
    createOpenMatch,
    joinOpenMatch,
    currentUser,
    courts,
    currentTenant,
    triggerDemoToast,
  } = useApp();

  const [levelFilter, setLevelFilter] = useState<'all' | 'iniciacion' | 'intermedio' | 'avanzado'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New match form state
  const [selectedCourtId, setSelectedCourtId] = useState(courts[0]?.id || 'court-1');
  const [matchDate, setMatchDate] = useState('2026-10-02');
  const [matchTime, setMatchTime] = useState('20:00');
  const [minLevel, setMinLevel] = useState(3.0);
  const [maxLevel, setMaxLevel] = useState(4.25);
  const [pricePerPlayer, setPricePerPlayer] = useState(7.5);
  const [creatorPosition, setCreatorPosition] = useState<'drive' | 'reves' | 'both'>('drive');

  const filteredMatches = openMatches.filter((m) => {
    if (levelFilter === 'iniciacion') return m.maxLevel <= 3.25;
    if (levelFilter === 'intermedio') return m.minLevel >= 3.0 && m.maxLevel <= 4.25;
    if (levelFilter === 'avanzado') return m.minLevel >= 4.0;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const court = courts.find((c) => c.id === selectedCourtId) || courts[0];
    const startISO = `${matchDate}T${matchTime}:00`;

    createOpenMatch({
      courtId: court.id,
      courtName: court.name,
      creatorName: currentUser.name,
      creatorLevel: currentUser.playLevel,
      startTime: startISO,
      durationMinutes: 90,
      minLevel,
      maxLevel,
      pricePerPlayer,
      status: 'open',
      players: [
        {
          id: currentUser.id,
          name: currentUser.name,
          level: currentUser.playLevel,
          position: creatorPosition,
          paid: true,
        },
      ],
    });

    setShowCreateModal(false);
  };

  const handleJoin = (match: OpenMatch) => {
    if (match.players.length >= 4) {
      triggerDemoToast('Partido Completo', 'Este partido ya no dispone de plazas libres.', 'warning');
      return;
    }
    const alreadyJoined = match.players.some((p) => p.name === currentUser.name);
    if (alreadyJoined) {
      triggerDemoToast('Ya Estás Apuntado', 'Ya formas parte de los 4 jugadores de este partido.', 'info');
      return;
    }

    joinOpenMatch(match.id, {
      name: currentUser.name,
      level: currentUser.playLevel,
      position: 'both',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Comunidad de Jugadores
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Partidos Abiertos "Play!" en {currentTenant.shortName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            ¿Te falta algún jugador o quieres jugar con gente nueva de tu mismo nivel? Apúntate a partidos abiertos o crea el tuyo propio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setLevelFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                levelFilter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setLevelFilter('iniciacion')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                levelFilter === 'iniciacion' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Iniciación (&lt;3.25)
            </button>
            <button
              onClick={() => setLevelFilter('intermedio')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                levelFilter === 'intermedio' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Medio (3.0-4.25)
            </button>
            <button
              onClick={() => setLevelFilter('avanzado')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                levelFilter === 'avanzado' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Avanzado (&gt;4.0)
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-slate-950 text-xs shadow transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Partido</span>
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.map((m) => {
          const isFull = m.players.length >= 4;
          const userInMatch = m.players.some((p) => p.name === currentUser.name);

          return (
            <div
              key={m.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-emerald-400">
                    Nivel {m.minLevel.toFixed(1)} - {m.maxLevel.toFixed(1)}
                  </span>
                  <span className="font-mono text-white font-bold">{m.pricePerPlayer.toFixed(2)} €/jugador</span>
                </div>

                <h3 className="text-base font-bold text-white">{m.courtName}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{m.startTime.split('T')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{m.startTime.split('T')[1]?.slice(0, 5)} ({m.durationMinutes} min)</span>
                  </div>
                </div>

                {/* 4 Player Slots Circles */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
                    <span>Plazas ({m.players.length}/4):</span>
                    {isFull && <span className="text-rose-400 font-bold">COMPLETO</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[0, 1, 2, 3].map((idx) => {
                      const p = m.players[idx];
                      if (p) {
                        return (
                          <div
                            key={idx}
                            className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {p.name.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-slate-200 truncate text-[11px]">{p.name}</div>
                              <div className="text-[10px] text-slate-400">Niv {p.level.toFixed(1)} · {p.position}</div>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={idx}
                          className="p-2 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 flex items-center gap-2 text-slate-500"
                        >
                          <div className="w-6 h-6 rounded-full border border-dashed border-slate-700 flex items-center justify-center text-[10px]">
                            +
                          </div>
                          <span className="text-[11px]">Plaza libre</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {userInMatch ? (
                  <div className="w-full py-2.5 rounded-xl bg-slate-800 text-emerald-400 text-xs font-bold text-center border border-slate-700 flex items-center justify-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    <span>Ya estás inscrito en este partido</span>
                  </div>
                ) : isFull ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-500 text-xs font-semibold text-center cursor-not-allowed"
                  >
                    Partido Completo
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(m)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <span>Unirme por {m.pricePerPlayer.toFixed(2)} €</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Open Match Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-1">Publicar Nuevo Partido Abierto</h3>
            <p className="text-xs text-slate-400 mb-5">
              Crea un partido para que otros 3 jugadores de tu nivel se sumen a jugar en Pádel San Mateo.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Pista</label>
                <select
                  value={selectedCourtId}
                  onChange={(e) => setSelectedCourtId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {courts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.surface})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    required
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nivel Mínimo ({minLevel.toFixed(1)})</label>
                  <input
                    type="range"
                    min="1.0"
                    max="6.0"
                    step="0.25"
                    value={minLevel}
                    onChange={(e) => setMinLevel(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nivel Máximo ({maxLevel.toFixed(1)})</label>
                  <input
                    type="range"
                    min="1.0"
                    max="6.0"
                    step="0.25"
                    value={maxLevel}
                    onChange={(e) => setMaxLevel(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Precio por Jugador (€)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={pricePerPlayer}
                    onChange={(e) => setPricePerPlayer(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tu Posición Preferida</label>
                  <select
                    value={creatorPosition}
                    onChange={(e) => setCreatorPosition(e.target.value as 'drive' | 'reves' | 'both')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="drive">Drive (Derecha)</option>
                    <option value="reves">Revés (Izquierda)</option>
                    <option value="both">Indiferente</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow"
                >
                  Publicar Partido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
