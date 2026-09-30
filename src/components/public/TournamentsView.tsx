import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tournament } from '../../types/database';
import {
  Trophy,
  Calendar,
  Users,
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

export const TournamentsView: React.FC = () => {
  const { tournaments, registerTournamentTeam, triggerDemoToast } = useApp();
  const [selectedTournament, setSelectedTournament] = useState<Tournament>(tournaments[0] || {} as Tournament);
  const [selectedCategory, setSelectedCategory] = useState<string>(tournaments[0]?.categories[0]?.name || '');
  const [activeTab, setActiveTab] = useState<'info' | 'bracket' | 'categories'>('info');

  // Registration modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [regCategory, setRegCategory] = useState(selectedTournament?.categories?.[0]?.name || '');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerTournamentTeam(selectedTournament.id, regCategory, teamName || `${player1Name} / ${player2Name}`);
    setShowRegisterModal(false);
    setTeamName('');
    setPlayer1Name('');
    setPlayer2Name('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-teal-600 dark:text-cyan-400 uppercase tracking-wider">
            Competición Oficial & Circuito Federado
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Torneos & Ligas San Mateo
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
            Vive la emoción de la competición en el club: premios en metálico, welcome pack oficial con textil conmemorativo, trofeos artesanos y ambiente inigualable.
          </p>
        </div>

        <button
          onClick={() => {
            setRegCategory(selectedTournament.categories?.[0]?.name || '');
            setShowRegisterModal(true);
          }}
          className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2 self-start md:self-auto"
        >
          <Trophy className="w-4 h-4" />
          <span>Inscribir Pareja Ahora</span>
        </button>
      </div>

      {/* Tournaments Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {tournaments.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedTournament(t);
              setSelectedCategory(t.categories[0]?.name || '');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
              selectedTournament.id === t.id
                ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border border-slate-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Tournament Card Detail */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img
            src={selectedTournament.bannerUrl}
            alt={selectedTournament.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Calendar className="w-4 h-4" />
                <span>{selectedTournament.dates}</span>
                <span>·</span>
                <span>Inscripción: {selectedTournament.entryFee.toFixed(2)} €/jugador</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {selectedTournament.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setRegCategory(selectedTournament.categories?.[0]?.name || '');
                  setShowRegisterModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition"
              >
                Inscribir Pareja
              </button>
            </div>
          </div>
        </div>

        {/* Sub-tabs: Info, Bracket, Categories */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 w-fit text-xs">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'info'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Información & Premios
            </button>
            <button
              onClick={() => setActiveTab('bracket')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'bracket'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Cuadro Eliminatorio (Bracket)
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'categories'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Categorías ({selectedTournament.categories?.length || 0})
            </button>
          </div>

          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Premios & Dotación Oficial</span>
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedTournament.prizes}
                </p>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-800">
                  Welcome pack garantizado para todos los inscritos: Camiseta técnica oficial conmemorativa Bullpadel, overgrip, bote de bolas Head y vales de consumición en la cafetería del club.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                  <span>Reglamento y Plazos</span>
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Cierre de inscripciones: <strong>{selectedTournament.registrationDeadline.replace('T', ' ')}</strong>. Cada pareja tiene garantizado un mínimo de 2 partidos (cuadro principal + fase de consolación). Partidos al mejor de 3 sets con super tie-break a 10 puntos en caso de empate a un set.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'bracket' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Visualización del Cuadro de Eliminatorias:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">1ª Categoría Masculina (Fase Final)</span>
              </div>

              {/* Bracket Tree Visualizer */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <div className="min-w-[650px] grid grid-cols-3 gap-8 items-center text-xs">
                  {/* Semifinals */}
                  <div className="space-y-8">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Semifinales</div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                      <div className="flex items-center justify-between font-semibold">
                        <span>Pita / Romero</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">6 7</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                        <span>Ferreiro / Paz</span>
                        <span className="font-mono">4 5</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                      <div className="flex items-center justify-between font-semibold">
                        <span>Varela / Carballo</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">6 4 10</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                        <span>López / Díaz</span>
                        <span className="font-mono">3 6 8</span>
                      </div>
                    </div>
                  </div>

                  {/* Final */}
                  <div className="space-y-8">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400">Gran Final</div>

                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 space-y-2 shadow-md">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>Pita / Romero</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">Domingo 18:00</span>
                      </div>
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>Varela / Carballo</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">Pista 1 Central</span>
                      </div>
                    </div>
                  </div>

                  {/* Winner / Trophy */}
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-lg">
                      <Trophy className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="font-black text-sm text-slate-900 dark:text-white">Campeones 1ª Categoría</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Trofeo + 1.200 € en metálico</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {selectedTournament.categories?.map((cat) => (
                <div
                  key={cat.name}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900 dark:text-white">{cat.name}</div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                      {cat.teamsCount} / {cat.maxTeams} parejas
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Plazas restantes: <strong className="text-slate-800 dark:text-slate-200">{cat.maxTeams - cat.teamsCount}</strong>
                  </div>
                  <button
                    onClick={() => {
                      setRegCategory(cat.name);
                      setShowRegisterModal(true);
                    }}
                    className="w-full mt-2 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-[11px] transition"
                  >
                    Inscribirse en {cat.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Inscripción en Torneo
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedTournament.title}
                </p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Categoría a Disputar
                </label>
                <select
                  value={regCategory}
                  onChange={(e) => setRegCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  {selectedTournament.categories?.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.maxTeams - c.teamsCount} plazas libres)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Nombre del Equipo / Pareja
                </label>
                <input
                  type="text"
                  placeholder="Ej: Los Cañoneros de Narón"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Jugador 1 (Capitán)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo"
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Jugador 2 (Compañero)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed">
                Cuota por pareja: <strong className="text-slate-900 dark:text-white font-bold">{(selectedTournament.entryFee * 2).toFixed(2)} €</strong> ({selectedTournament.entryFee.toFixed(2)} € por jugador). Incluye 2 welcome packs completos y mínimo de 2 partidos garantizados.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold transition shadow"
                >
                  Confirmar Inscripción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
