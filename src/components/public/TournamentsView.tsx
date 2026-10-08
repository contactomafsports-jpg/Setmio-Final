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
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  MapPin,
  Eye,
} from 'lucide-react';

export const TournamentsView: React.FC = () => {
  const { tournaments, registerTournamentTeam, triggerDemoToast, currentTenant, t } = useApp();
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'info' | 'bracket' | 'categories'>('info');

  // Registration modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [regCategory, setRegCategory] = useState('');

  const selectedTournament = tournaments.find((t) => t.id === selectedTournamentId) || tournaments[0];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTournament) {
      registerTournamentTeam(selectedTournament.id, regCategory, teamName || `${player1Name} / ${player2Name}`);
      setShowRegisterModal(false);
      setTeamName('');
      setPlayer1Name('');
      setPlayer2Name('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans">
      {/* ======================================================================
          VISTA 1: LISTADO VERTICAL DE TARJETAS LIMPIAS (PORTADA DE COMPETICIONES)
          ====================================================================== */}
      {!selectedTournamentId ? (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Header de Portada */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-teal-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>{t('tournaments.eyebrow', 'Competición Oficial & Circuito Federado')}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {t('tournaments.public_title', 'Torneos & Competiciones')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
                {t(
                  'tournaments.public_desc',
                  'Vive la emoción de la competición en el club: cuadros oficiales, welcome pack con textil, trofeos artesanos y ranking federado.'
                )}
              </p>
            </div>
          </div>

          {/* Listado Vertical de Tarjetas (Cards) Limpias */}
          <div className="flex flex-col space-y-4 sm:space-y-6">
            {tournaments.map((tItem) => {
              const totalPairs = tItem.categories.reduce((acc, cat) => acc + cat.teamsCount, 0);
              const maxPairs = tItem.categories.reduce((acc, cat) => acc + cat.maxTeams, 0);
              const percentFilled = maxPairs > 0 ? Math.round((totalPairs / maxPairs) * 100) : 75;

              return (
                <div
                  key={tItem.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 transition-all duration-200 shadow-xs hover:shadow-md overflow-hidden flex flex-col md:flex-row group"
                >
                  {/* Imagen de Portada */}
                  <div className="relative w-full md:w-72 lg:w-80 h-48 md:h-auto shrink-0 overflow-hidden bg-slate-950">
                    <img
                      src={tItem.bannerUrl}
                      alt={tItem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${
                          tItem.status === 'registration_open'
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        {tItem.status === 'registration_open' ? 'Inscripción Abierta' : 'En Juego'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 text-white text-xs font-mono font-bold flex items-center gap-1.5 drop-shadow-md">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{tItem.dates}</span>
                    </div>
                  </div>

                  {/* Información Ejecutiva y Detalles */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                          {tItem.categories.map((c) => c.name).join(' · ')}
                        </span>

                        <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                          {tItem.entryFee.toFixed(2)} € / jugador
                        </span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {tItem.title}
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {tItem.description}
                      </p>
                    </div>

                    {/* Resumen Ejecutivo */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/80">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Inscritos</span>
                        <span className="font-black text-slate-900 dark:text-white font-mono text-xs">
                          {totalPairs} / {maxPairs} parejas
                        </span>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${percentFilled}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/80">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Formato</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs capitalize truncate block">
                          {tItem.format || 'Eliminación Directa'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/80">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Categorías</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs font-mono">
                          {tItem.categories.length} oficiales
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/80">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Premios</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs truncate block font-mono">
                          1.500 € + Trofeos
                        </span>
                      </div>
                    </div>

                    {/* Botón de Entrada a la Página Detalle */}
                    <div className="pt-2 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTournamentId(tItem.id);
                          setSelectedCategory(tItem.categories[0]?.name || '');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <span>{t('tournaments.btn_view_detail', 'Ver Detalle del Torneo')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ======================================================================
            VISTA 2: PÁGINA DETALLE DEL TORNEO (CON TODA LA INFORMACIÓN Y CUADROS)
            ====================================================================== */
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Botón Volver Limpio y Canónico */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSelectedTournamentId(null)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('tournaments.btn_back', 'Volver al Listado de Torneos')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRegCategory(selectedTournament?.categories?.[0]?.name || '');
                setShowRegisterModal(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>Inscribir Pareja Ahora</span>
            </button>
          </div>

          {/* Hero Banner del Torneo Seleccionado */}
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
                  <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {selectedTournament.title}
                  </h1>
                  <p className="text-xs text-slate-300 max-w-xl mt-1">
                    {selectedTournament.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRegCategory(selectedTournament.categories?.[0]?.name || '');
                      setShowRegisterModal(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition cursor-pointer"
                  >
                    Inscribir Pareja
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-Tabs del Detalle */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-3.5 text-center transition cursor-pointer ${
                  activeTab === 'info'
                    ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Información & Premios
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('categories')}
                className={`flex-1 py-3.5 text-center transition cursor-pointer ${
                  activeTab === 'categories'
                    ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Categorías ({selectedTournament.categories.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bracket')}
                className={`flex-1 py-3.5 text-center transition cursor-pointer ${
                  activeTab === 'bracket'
                    ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Cuadro Eliminatorio (Brackets)
              </button>
            </div>

            {/* Contenido de las Pestañas de Detalle */}
            <div className="p-6">
              {activeTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Bases del Torneo</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Competición oficial con sistema de cuadro principal y cuadro de consolación. Todos los partidos se disputan al mejor de 3 sets con punto de oro y super tie-break a 10 en caso de tercer set.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-emerald-500" />
                          <span>Welcome Pack Incluido</span>
                        </span>
                        <p className="text-slate-500 text-[11px]">Camiseta conmemorativa técnica oficial y grip de regalo.</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Trophy className="w-4 h-4 text-amber-500" />
                          <span>Premios & Trofeos</span>
                        </span>
                        <p className="text-slate-500 text-[11px]">1.500 € en dotación económica para 1ª categoría y trofeos artesanos.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white">Detalles Rápidos</h4>
                    <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400">
                      <div>Sede: <strong className="text-slate-900 dark:text-white">{currentTenant.name}</strong></div>
                      <div>Superficie: <strong className="text-slate-900 dark:text-white">Mondo Supercourt WPT</strong></div>
                      <div>Bola Oficial: <strong className="text-slate-900 dark:text-white">Bullpadel Next Pro</strong></div>
                      <div>Pago de Inscripción: <strong className="text-slate-900 dark:text-white">Online o en Recepción</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedTournament.categories.map((c, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                    >
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</h4>
                      <p className="text-slate-500 text-[11px]">
                        Plazas disponibles: <strong className="text-emerald-600 dark:text-emerald-400">{c.maxTeams - c.teamsCount}</strong>
                      </p>
                      <div className="text-[11px] text-slate-500">
                        Inscripciones: <strong className="text-slate-900 dark:text-white">{c.teamsCount}</strong> / {c.maxTeams} parejas
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'bracket' && (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                  <div className="p-3 w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Cuadros Oficiales y Cruces Generados
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Los cuadros se encuentran disponibles y sincronizados con los horarios oficiales de cada pista. Puedes seguir el desarrollo en directo o consultar resultados en recepción.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL INSCRIPCIÓN DE PAREJA */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Inscribirme en el Torneo
              </h3>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Nombre de la Pareja / Equipo
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Ej. Los Invencibles / Méndez & Soto"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Jugador 1 (Tú)
                  </label>
                  <input
                    type="text"
                    required
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Jugador 2 (Compañero)
                  </label>
                  <input
                    type="text"
                    required
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    placeholder="Nombre del compañero"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Categoría
                </label>
                <select
                  value={regCategory}
                  onChange={(e) => setRegCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  {selectedTournament.categories.map((c, i) => (
                    <option key={i} value={c.name}>
                      {c.name} ({c.teamsCount}/{c.maxTeams} parejas)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                Importe de inscripción: <strong>{selectedTournament.entryFee.toFixed(2)} €/jugador</strong>. Podrás abonarlo por pasarela segura o en la recepción del club.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm active:scale-95 cursor-pointer"
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

export default TournamentsView;
