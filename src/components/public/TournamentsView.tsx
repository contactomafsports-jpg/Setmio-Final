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
} from 'lucide-react';

export const TournamentsView: React.FC = () => {
  const { tournaments, registerTournamentTeam, triggerDemoToast } = useApp();
  const [selectedTournament, setSelectedTournament] = useState<Tournament>(tournaments[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>(tournaments[0]?.categories[0]?.name || '');
  const [activeTab, setActiveTab] = useState<'info' | 'bracket' | 'categories'>('info');

  // Registration modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [regCategory, setRegCategory] = useState(selectedTournament.categories[0]?.name || '');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerTournamentTeam(selectedTournament.id, regCategory, teamName || `${player1Name} / ${player2Name}`);
    setShowRegisterModal(false);
    setTeamName('');
    setPlayer1Name('');
    setPlayer2Name('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Competición Oficial & Circuito
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1">
            Torneos & Ligas San Mateo
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
            Vive la emoción de la competición en el club: premios en metálico, welcome pack oficial, trofeos artesanos y ambiente inigualable.
          </p>
        </div>

        <button
          onClick={() => {
            setRegCategory(selectedTournament.categories[0]?.name || '');
            setShowRegisterModal(true);
          }}
          className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-xl transition flex items-center gap-2 self-start md:self-auto"
        >
          <Trophy className="w-4 h-4" />
          <span>Inscribir Pareja Ahora</span>
        </button>
      </div>

      {/* Tournaments Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {tournaments.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedTournament(t);
              setSelectedCategory(t.categories[0]?.name || '');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
              selectedTournament.id === t.id
                ? 'bg-slate-800 text-white border border-slate-700 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Tournament Card Detail */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
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
                  setRegCategory(selectedTournament.categories[0]?.name || '');
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
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit text-xs">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'info' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Información & Premios
            </button>
            <button
              onClick={() => setActiveTab('bracket')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'bracket' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cuadro Eliminatorio (Bracket)
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'categories' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Categorías ({selectedTournament.categories.length})
            </button>
          </div>

          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Premios & Dotación</span>
                </h3>
                <p className="text-slate-300 leading-relaxed">{selectedTournament.prizes}</p>
                <div className="text-slate-400 text-[11px] pt-2 border-t border-slate-900">
                  Welcome pack garantizado con camiseta técnica Bullpadel oficial, overgrip, bote de bolas Head y vales descuento en la tienda del club.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Reglamento y Plazos</span>
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Cierre de inscripciones: <strong>{selectedTournament.registrationDeadline.replace('T', ' ')}</strong>. Cada pareja tiene garantizado un mínimo de 2 partidos (cuadro principal + consolación). Partidos al mejor de 3 sets con super tie-break a 10 en caso de empate a un set.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'bracket' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Visualización del Cuadro de Eliminatorias:</span>
                <span className="text-emerald-400 font-semibold">1ª Categoría Masculina</span>
              </div>

              {/* Tournament Interactive Bracket Schema */}
              <div className="overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="min-w-[640px] flex items-center justify-between gap-8 text-xs font-mono">
                  {/* Cuartos */}
                  <div className="space-y-6 flex-1">
                    <div className="text-[11px] font-sans font-bold text-slate-400 mb-2">Cuartos de Final</div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
                      <div className="flex justify-between font-bold text-emerald-400">
                        <span>Méndez / Soto [1]</span>
                        <span>6 6</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Rey / Calvo</span>
                        <span>2 3</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>Pena / Veiga</span>
                        <span>4 5</span>
                      </div>
                      <div className="flex justify-between font-bold text-emerald-400">
                        <span>Fraga / Permuy [4]</span>
                        <span>6 7</span>
                      </div>
                    </div>
                  </div>

                  {/* Semifinales */}
                  <div className="space-y-12 flex-1">
                    <div className="text-[11px] font-sans font-bold text-cyan-400 mb-2">Semifinales</div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-800/80 space-y-1">
                      <div className="flex justify-between font-bold text-cyan-300">
                        <span>Méndez / Soto [1]</span>
                        <span>7 6</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Fraga / Permuy [4]</span>
                        <span>5 4</span>
                      </div>
                    </div>
                  </div>

                  {/* Gran Final */}
                  <div className="flex-1">
                    <div className="text-[11px] font-sans font-bold text-amber-300 mb-2 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Gran Final</span>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/50 space-y-1 shadow-lg">
                      <div className="flex justify-between font-bold text-white">
                        <span>Méndez / Soto [1]</span>
                        <span className="text-amber-300">6 4 10</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Gómez / Varela [2]</span>
                        <span>3 6 8</span>
                      </div>
                    </div>
                    <div className="mt-2 text-center text-[10px] text-amber-400 font-sans font-semibold">
                      ¡Campeones Méndez / Soto!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {selectedTournament.categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Parejas inscritas: {cat.teamsCount} / {cat.maxTeams}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setRegCategory(cat.name);
                      setShowRegisterModal(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs border border-slate-700"
                  >
                    Inscribir
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
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-1">
              Inscribir Pareja en {selectedTournament.title}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Precio por jugador: {selectedTournament.entryFee.toFixed(2)} € (Pago en club o demo)
            </p>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Categoría</label>
                <select
                  value={regCategory}
                  onChange={(e) => setRegCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  {selectedTournament.categories.map((c, i) => (
                    <option key={i} value={c.name}>
                      {c.name} ({c.teamsCount}/{c.maxTeams} parejas)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Nombre Pareja / Equipo</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Los Ases de Narón"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Jugador 1</label>
                  <input
                    type="text"
                    required
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    placeholder="Carlos Méndez"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Jugador 2</label>
                  <input
                    type="text"
                    required
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    placeholder="Diego Soto"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow"
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
