import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import heroPadelImg from '../../assets/images/hero_padel_club_1794872242820.jpg';
import {
  Trophy,
  Calendar,
  Award,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';

export const TournamentsView: React.FC = () => {
  const { tournaments, registerTournamentTeam, currentTenant, t } = useApp();
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'bracket' | 'categories'>('info');

  // Registration modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [regCategory, setRegCategory] = useState('');

  const selectedTournament = tournaments.find((tItem) => tItem.id === selectedTournamentId) || tournaments[0];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10 text-[#0B1A2D] dark:text-slate-100 transition-colors duration-200 font-sans">
      {!selectedTournamentId ? (
        <div className="space-y-10 animate-in fade-in duration-150">
          {/* Cover Header */}
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#8B5CF6] dark:text-[#a78bfa] flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>{t('tournaments.eyebrow', 'Competición Oficial & Circuito Federado')}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight">
              {t('tournaments.public_title', 'Torneos & Competiciones')}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t(
                'tournaments.public_desc',
                'Vive la emoción de la competición en el club: cuadros oficiales, welcome pack con textil, trofeos artesanos y ranking federado.'
              )}
            </p>
          </div>

          {/* Vertical Cards List */}
          <div className="flex flex-col space-y-6">
            {tournaments.map((tItem) => {
              const totalPairs = tItem.categories.reduce((acc, cat) => acc + cat.teamsCount, 0);
              const maxPairs = tItem.categories.reduce((acc, cat) => acc + cat.maxTeams, 0);
              const percentFilled = maxPairs > 0 ? Math.round((totalPairs / maxPairs) * 100) : 75;

              return (
                <div
                  key={tItem.id}
                  className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D] dark:hover:border-[#B7F229] transition-colors duration-200 overflow-hidden flex flex-col md:flex-row group"
                >
                  {/* Cover Image */}
                  <div className="relative w-full md:w-72 lg:w-80 h-52 md:h-auto shrink-0 overflow-hidden bg-[#071220]">
                    <img
                      src={tItem.bannerUrl || heroPadelImg}
                      alt={tItem.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = heroPadelImg;
                      }}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#071220]/85 via-[#071220]/25 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          tItem.status === 'registration_open'
                            ? 'bg-[#B7F229] text-[#0B1A2D]'
                            : 'bg-[#8B5CF6] text-white'
                        }`}
                      >
                        {tItem.status === 'registration_open' ? 'Inscripción Abierta' : 'En Juego'}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 text-white text-xs font-mono tabular-nums font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#B7F229]" />
                      <span>{tItem.dates}</span>
                    </div>
                  </div>

                  {/* Executive Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-[#8B5CF6] dark:text-[#a78bfa]">
                          {tItem.categories.map((c) => c.name).join(' · ')}
                        </span>

                        <span className="text-xs font-bold font-mono tabular-nums text-[#0B1A2D] dark:text-[#B7F229]">
                          {tItem.entryFee.toFixed(2)} € / jugador
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-[#0B1A2D] dark:text-white tracking-tight">
                        {tItem.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {tItem.description}
                      </p>
                    </div>

                    {/* Clean Unboxed Metric Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200/80 dark:border-[#1A314D] text-xs">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">Inscritos</span>
                        <span className="font-bold text-[#0B1A2D] dark:text-white font-mono tabular-nums block">
                          {totalPairs} / {maxPairs} parejas
                        </span>
                        <div className="w-full bg-slate-200 dark:bg-[#071220] h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0B1A2D] dark:bg-[#B7F229] h-full rounded-full"
                            style={{ width: `${percentFilled}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">Formato</span>
                        <span className="font-semibold text-[#0B1A2D] dark:text-slate-200 capitalize block mt-1">
                          {tItem.format || 'Eliminación Directa'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">Categorías</span>
                        <span className="font-semibold text-[#0B1A2D] dark:text-slate-200 font-mono tabular-nums block mt-1">
                          {tItem.categories.length} oficiales
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">Premios</span>
                        <span className="font-bold text-[#8B5CF6] dark:text-[#a78bfa] font-mono tabular-nums block mt-1">
                          1.500 € + Trofeos
                        </span>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTournamentId(tItem.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="min-h-[40px] px-4 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition flex items-center gap-2 cursor-pointer"
                      >
                        <span>{t('tournaments.btn_view_tournament', 'Ver torneo')}</span>
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
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Top Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-[#1A314D]">
            <button
              type="button"
              onClick={() => setSelectedTournamentId(null)}
              className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#0E2239] hover:bg-slate-50 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-slate-200 border border-slate-200/80 dark:border-[#1A314D] font-semibold text-xs transition cursor-pointer self-start"
            >
              <ArrowLeft className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
              <span>{t('tournaments.btn_back', 'Volver al Listado de Torneos')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRegCategory(selectedTournament?.categories?.[0]?.name || '');
                setShowRegisterModal(true);
              }}
              className="min-h-[40px] px-5 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Trophy className="w-4 h-4" />
              <span>Inscribir Pareja Ahora</span>
            </button>
          </div>

          {/* Tournament Detail Header Card */}
          <div className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] overflow-hidden flex flex-col md:flex-row">
            <div className="relative w-full md:w-80 lg:w-96 h-56 md:h-auto shrink-0 bg-[#071220] overflow-hidden">
              <img
                src={selectedTournament.bannerUrl || heroPadelImg}
                alt={selectedTournament.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = heroPadelImg;
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#071220]/70 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#B7F229] text-[#0B1A2D] text-[10px] font-bold uppercase tracking-wider">
                  {selectedTournament.status === 'registration_open' ? 'Inscripción Abierta' : 'En Curso'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0B1A2D]/90 text-white text-[10px] font-semibold border border-white/15">
                  {selectedTournament.rankingCategory || 'Circuito Oficial'}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-[#8B5CF6] dark:text-[#a78bfa]">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>{selectedTournament.dates}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 dark:text-slate-400 font-sans">Sede Oficial {currentTenant.name}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight">
                  {selectedTournament.title}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {selectedTournament.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 dark:border-[#1A314D] text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">Inscripción</span>
                  <span className="font-mono tabular-nums font-extrabold text-[#0B1A2D] dark:text-[#B7F229] text-base mt-1 block">
                    {selectedTournament.entryFee.toFixed(2)} €
                  </span>
                  <span className="text-[11px] text-slate-500">por jugador</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">Categorías</span>
                  <span className="font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-white text-sm mt-1 block">
                    {selectedTournament.categories.length} divisiones
                  </span>
                  <span className="text-[11px] text-slate-500">oficiales</span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">Premios</span>
                  <span className="font-mono tabular-nums font-bold text-[#8B5CF6] dark:text-[#a78bfa] text-sm mt-1 block">
                    1.500 € + Trofeos
                  </span>
                  <span className="text-[11px] text-slate-500">y welcome pack</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Tabs */}
          <div className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] overflow-hidden">
            <div className="flex border-b border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] text-xs font-semibold">
              {[
                { id: 'info', label: 'Información & Premios' },
                { id: 'categories', label: `Categorías (${selectedTournament.categories.length})` },
                { id: 'bracket', label: 'Cuadro Eliminatorio' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 min-h-[44px] py-3 px-4 text-center transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-b-2 border-[#0B1A2D] dark:border-[#B7F229] text-[#0B1A2D] dark:text-[#B7F229] bg-white dark:bg-[#0E2239] font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-8">
              {activeTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed">
                  <div className="md:col-span-2 space-y-5">
                    <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">Bases del Torneo</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Competición oficial con sistema de cuadro principal y cuadro de consolación. Todos los partidos se disputan al mejor de 3 sets con punto de oro y super tie-break a 10 en caso de tercer set.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-200/80 dark:border-[#1A314D]">
                      <div className="space-y-1.5 pt-2">
                        <span className="font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                          <span>Welcome Pack Incluido</span>
                        </span>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">
                          Camiseta conmemorativa técnica oficial y grip de regalo.
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <span className="font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                          <span>Premios & Trofeos</span>
                        </span>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">
                          1.500 € en dotación económica para 1ª categoría y trofeos artesanos.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:border-l md:border-slate-200/80 md:dark:border-[#1A314D] md:pl-8 space-y-3">
                    <h4 className="font-bold text-[#0B1A2D] dark:text-white">Detalles Rápidos</h4>
                    <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                      <div>Sede: <strong className="text-[#0B1A2D] dark:text-white">{currentTenant.name}</strong></div>
                      <div>Superficie: <strong className="text-[#0B1A2D] dark:text-white">Mondo Supercourt WPT</strong></div>
                      <div>Bola Oficial: <strong className="text-[#0B1A2D] dark:text-white">Bullpadel Next Pro</strong></div>
                      <div>Pago: <strong className="text-[#0B1A2D] dark:text-white">Online o en Recepción</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedTournament.categories.map((c, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-2 text-xs"
                    >
                      <h4 className="font-bold text-[#0B1A2D] dark:text-white text-sm">{c.name}</h4>
                      <p className="text-slate-500 font-mono tabular-nums">
                        Plazas disponibles: <strong className="text-[#8B5CF6] dark:text-[#a78bfa]">{c.maxTeams - c.teamsCount}</strong>
                      </p>
                      <div className="text-slate-500 font-mono tabular-nums">
                        Inscripciones: <strong className="text-[#0B1A2D] dark:text-white">{c.teamsCount}</strong> / {c.maxTeams} parejas
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'bracket' && (
                <div className="p-8 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] text-[#B7F229] dark:text-[#0B1A2D] flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-[#0B1A2D] dark:text-white text-sm">
                    Cuadros Oficiales y Cruces Generados
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Los cuadros se encuentran disponibles y sincronizados con los horarios oficiales de cada pista. Puedes seguir el desarrollo en directo o consultar resultados en recepción.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REGISTRATION MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/80 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-6 text-[#0B1A2D] dark:text-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-[#1A314D] pb-3.5">
              <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                Inscribirme en el Torneo
              </h3>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#0B1A2D] dark:text-slate-300 mb-1.5 font-semibold">
                  Nombre de la Pareja / Equipo
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Ej. Méndez & Soto"
                  className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#0B1A2D] dark:text-slate-300 mb-1.5 font-semibold">
                    Jugador 1 (Tú)
                  </label>
                  <input
                    type="text"
                    required
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0B1A2D] dark:text-slate-300 mb-1.5 font-semibold">
                    Jugador 2
                  </label>
                  <input
                    type="text"
                    required
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    placeholder="Compañero"
                    className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0B1A2D] dark:text-slate-300 mb-1.5 font-semibold">
                  Categoría
                </label>
                <select
                  value={regCategory}
                  onChange={(e) => setRegCategory(e.target.value)}
                  className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                >
                  {selectedTournament.categories.map((c, i) => (
                    <option key={i} value={c.name}>
                      {c.name} ({c.teamsCount}/{c.maxTeams} parejas)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071220] text-[11px] text-slate-600 dark:text-slate-400">
                Importe de inscripción: <strong className="font-mono tabular-nums text-[#0B1A2D] dark:text-white">{selectedTournament.entryFee.toFixed(2)} €/jugador</strong>. Podrás abonarlo online o en recepción.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 font-semibold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-5 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold transition cursor-pointer"
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
