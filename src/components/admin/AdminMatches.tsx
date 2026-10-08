import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpenMatch } from '../../types/database';
import {
  Trophy,
  Users,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  Shield,
  Layers,
  Zap,
  X,
  UserCheck,
  UserPlus,
} from 'lucide-react';

export const AdminMatches: React.FC = () => {
  const {
    openMatches,
    createOpenMatch,
    joinOpenMatch,
    leaveOpenMatch,
    courts,
    currentTenant,
    triggerDemoToast,
    setAdminTab,
    t,
  } = useApp();

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'iniciacion' | 'intermedio' | 'avanzado'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'full'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMatchForAdd, setSelectedMatchForAdd] = useState<OpenMatch | null>(null);

  // New match form state
  const [selectedCourtId, setSelectedCourtId] = useState(courts[0]?.id || 'court-1');
  const [matchDate, setMatchDate] = useState('2026-10-10');
  const [matchTime, setMatchTime] = useState('19:30');
  const [minLevel, setMinLevel] = useState(3.0);
  const [maxLevel, setMaxLevel] = useState(4.25);
  const [pricePerPlayer, setPricePerPlayer] = useState(7.0);
  const [creatorName, setCreatorName] = useState('Carlos Méndez');
  const [creatorLevel, setCreatorLevel] = useState(3.85);
  const [creatorPosition, setCreatorPosition] = useState<'drive' | 'reves' | 'both'>('drive');

  // Add player to match form state
  const [guestName, setGuestName] = useState('');
  const [guestLevel, setGuestLevel] = useState(3.75);
  const [guestPosition, setGuestPosition] = useState<'drive' | 'reves' | 'both'>('both');

  const filteredMatches = openMatches.filter((m) => {
    const isFull = m.players.length >= 4;
    const matchSearch =
      m.courtName.toLowerCase().includes(search.toLowerCase()) ||
      m.creatorName.toLowerCase().includes(search.toLowerCase()) ||
      m.players.some((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    const matchLevel =
      levelFilter === 'all' ||
      (levelFilter === 'iniciacion' && m.maxLevel <= 3.25) ||
      (levelFilter === 'intermedio' && m.minLevel >= 3.0 && m.maxLevel <= 4.25) ||
      (levelFilter === 'avanzado' && m.minLevel >= 4.0);

    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'open' && !isFull) ||
      (statusFilter === 'full' && isFull);

    return matchSearch && matchLevel && matchStatus;
  });

  const totalOpenSlots = openMatches.reduce((acc, m) => acc + (4 - m.players.length), 0);
  const fullMatchesCount = openMatches.filter((m) => m.players.length >= 4).length;
  const activePlayersCount = openMatches.reduce((acc, m) => acc + m.players.length, 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const court = courts.find((c) => c.id === selectedCourtId) || courts[0];
    const startISO = `${matchDate}T${matchTime}:00Z`;

    createOpenMatch({
      courtId: court.id,
      courtName: court.name,
      creatorName: creatorName.trim() || 'Organizador Club',
      creatorLevel: Number(creatorLevel) || 3.5,
      startTime: startISO,
      durationMinutes: 90,
      minLevel: Number(minLevel),
      maxLevel: Number(maxLevel),
      pricePerPlayer: Number(pricePerPlayer),
      status: 'open',
      players: [
        {
          id: `admin-${Date.now()}`,
          name: creatorName.trim() || 'Organizador Club',
          level: Number(creatorLevel) || 3.5,
          position: creatorPosition,
          paid: true,
        },
      ],
    });

    setShowCreateModal(false);
    triggerDemoToast(
      t('matches.toastCreatedTitle', 'Partida Abierta Publicada'),
      t('matches.toastCreatedDesc', `Partida creada en ${court.name} para el ${matchDate} a las ${matchTime}. Matchmaking activo.`),
      'success'
    );
  };

  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchForAdd || !guestName.trim()) return;

    joinOpenMatch(selectedMatchForAdd.id, {
      name: guestName.trim(),
      level: Number(guestLevel),
      position: guestPosition,
    });

    triggerDemoToast(
      t('matches.toastPlayerAddedTitle', 'Jugador Añadido a la Partida'),
      t('matches.toastPlayerAddedDesc', `${guestName} ha sido confirmado en la plaza de la partida de ${selectedMatchForAdd.courtName}.`),
      'success'
    );

    setSelectedMatchForAdd(null);
    setGuestName('');
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-12">
      {/* 1. Header Oficial */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>{t('matches.headerEyebrow', 'Matchmaking & Comunidad Play!')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            {t('matches.headerTitle', 'Gestión de Partidas Abiertas')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('matches.headerSubtitle', `${currentTenant.name} · Partidas niveladas por rating decimal, división de pago a 1/4 y convocatorias de socios.`)}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAdminTab('agenda')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            {t('matches.viewAgendaBtn', 'Ver Agenda Pistas')}
          </button>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('matches.createMatchBtn', 'Nueva Partida Abierta')}</span>
          </button>
        </div>
      </div>

      {/* 2. KPIs Ejecutivos de Partidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('matches.kpiTotal', 'Total Partidas')}
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {openMatches.length}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{fullMatchesCount} {t('matches.kpiComplete', 'Completas (4/4)')}</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('matches.kpiSlots', 'Plazas Libres')}
          </span>
          <div className="text-2xl font-black text-amber-500 font-mono">
            {totalOpenSlots}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('matches.kpiSlotsDesc', 'Buscando jugadores')}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('matches.kpiPlayers', 'Jugadores Activos')}
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {activePlayersCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('matches.kpiPlayersDesc', 'En convocatoria Play!')}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('matches.kpiSplitPay', 'Cobro Fraccionado')}
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            1/4
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{t('matches.kpiSplitDesc', 'Pago por jugador')}</span>
          </span>
        </div>
      </div>

      {/* 3. Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('matches.searchPlaceholder', 'Buscar por pista o jugador...')}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('matches.filterAll', 'Todas')} ({openMatches.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('open')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'open'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('matches.filterOpen', 'Buscando')} ({openMatches.filter((m) => m.players.length < 4).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('full')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'full'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('matches.filterFull', 'Completas')} ({fullMatchesCount})
            </button>
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">{t('matches.levelAll', 'Todos los Niveles')}</option>
            <option value="iniciacion">{t('matches.levelInit', 'Iniciación (≤ 3.25)')}</option>
            <option value="intermedio">{t('matches.levelInter', 'Intermedio (3.0 - 4.25)')}</option>
            <option value="avanzado">{t('matches.levelAdv', 'Avanzado (≥ 4.0)')}</option>
          </select>
        </div>
      </div>

      {/* 4. Listado de Partidas */}
      {filteredMatches.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t('matches.emptyTitle', 'No se encontraron partidas abiertas')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {t('matches.emptyDesc', 'Crea una nueva partida abierta para dinamizar la ocupación de pistas y fomentar el juego nivelado entre los socios.')}
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('matches.createFirstBtn', 'Crear Primera Partida')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredMatches.map((m) => {
            const isFull = m.players.length >= 4;
            const openSlots = 4 - m.players.length;
            const startTimeFormatted = m.startTime.includes('T')
              ? m.startTime.replace('Z', '').split('T')[1]?.slice(0, 5) || '19:30'
              : m.startTime;
            const startDateFormatted = m.startTime.includes('T')
              ? m.startTime.split('T')[0]
              : '2026-10-10';

            return (
              <div
                key={m.id}
                className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all duration-200 space-y-5 shadow-xs hover:shadow-md flex flex-col justify-between ${
                  isFull
                    ? 'border-emerald-500/30 dark:border-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <div className="space-y-4">
                  {/* Header de la tarjeta */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{startDateFormatted} · {startTimeFormatted}</span>
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          {m.courtName}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {m.courtName} · {t('matches.cardTitle', 'Partido Play!')}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isFull
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {isFull ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{t('matches.statusFull', 'Completa (4/4)')}</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            <span>{openSlots} {t('matches.statusNeedPlayers', 'Plaza(s) Libre(s)')}</span>
                          </>
                        )}
                      </span>

                      <div className="mt-1 font-mono font-black text-xs text-slate-900 dark:text-white">
                        {m.pricePerPlayer.toFixed(2)} € <span className="text-[10px] text-slate-400 font-normal">/jugador</span>
                      </div>
                    </div>
                  </div>

                  {/* Nivel Requerido */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">
                      {t('matches.levelRange', 'Nivel Decimal Permitido:')}
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                      {m.minLevel.toFixed(2)} - {m.maxLevel.toFixed(2)}
                    </span>
                  </div>

                  {/* 4 Plazas de Jugadores */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>{t('matches.playersGridTitle', 'Alineación de Parejas (4 Plazas):')}</span>
                      <span>{m.players.length} / 4</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Jugadores confirmados */}
                      {m.players.map((p, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs shadow-2xs"
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white truncate text-[11px]">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                              <span>Nivel {p.level.toFixed(2)}</span>
                              <span>·</span>
                              <span className="capitalize">{p.position}</span>
                            </div>
                          </div>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Confirmado y Pagado" />
                        </div>
                      ))}

                      {/* Plazas Libres */}
                      {Array.from({ length: openSlots }).map((_, emptyIdx) => (
                        <button
                          key={`empty-${emptyIdx}`}
                          type="button"
                          onClick={() => setSelectedMatchForAdd(m)}
                          className="p-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer group"
                        >
                          <UserPlus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                          <span>{t('matches.addGuestBtn', '+ Inscribir Socio')}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer de Acciones Rápidas */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{t('matches.creatorLabel', 'Creado por:')} <strong className="text-slate-800 dark:text-slate-200">{m.creatorName}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isFull && (
                      <button
                        type="button"
                        onClick={() => setSelectedMatchForAdd(m)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                      >
                        {t('matches.completeMatchBtn', 'Completar Plaza')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: CREAR NUEVA PARTIDA ABIERTA */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {t('matches.modalNewTitle', 'Publicar Nueva Partida Abierta')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('matches.modalNewSubtitle', 'Abre una convocatoria en el club para que los socios se unan.')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {t('matches.formCourt', 'Pista Asignada')}
                </label>
                <select
                  value={selectedCourtId}
                  onChange={(e) => setSelectedCourtId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
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
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t('matches.formDate', 'Fecha')}
                  </label>
                  <input
                    type="date"
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t('matches.formTime', 'Hora Inicio')}
                  </label>
                  <input
                    type="time"
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t('matches.formMinLevel', 'Nivel Mínimo')}
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="1.0"
                    max="7.0"
                    value={minLevel}
                    onChange={(e) => setMinLevel(parseFloat(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t('matches.formMaxLevel', 'Nivel Máximo')}
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="1.0"
                    max="7.0"
                    value={maxLevel}
                    onChange={(e) => setMaxLevel(parseFloat(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t('matches.formPrice', 'Precio 1/4 por Jugador (€)')}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1.0"
                    value={pricePerPlayer}
                    onChange={(e) => setPricePerPlayer(parseFloat(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t('matches.formCreatorName', 'Socio Titular / Creador')}
                  </label>
                  <input
                    type="text"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    placeholder="Ej. Carlos Méndez"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {t('matches.cancelBtn', 'Cancelar')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
                >
                  {t('matches.submitCreateBtn', 'Publicar Partida')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AÑADIR JUGADOR A PARTIDA EXISTENTE */}
      {selectedMatchForAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {t('matches.modalAddTitle', 'Inscribir Socio en Partida')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedMatchForAdd.courtName} · {selectedMatchForAdd.minLevel.toFixed(2)} - {selectedMatchForAdd.maxLevel.toFixed(2)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatchForAdd(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPlayerSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {t('matches.formAddName', 'Nombre del Jugador / Socio')} *
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ej. Lucas Rey Domínguez"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t('matches.formAddLevel', 'Nivel FEP Decimal')}
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="1.0"
                    max="7.0"
                    value={guestLevel}
                    onChange={(e) => setGuestLevel(parseFloat(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t('matches.formAddPosition', 'Posición Preferida')}
                  </label>
                  <select
                    value={guestPosition}
                    onChange={(e) => setGuestPosition(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="both">Indiferente / Ambas</option>
                    <option value="drive">Drive (Derecha)</option>
                    <option value="reves">Revés (Izquierda)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs">
                <span>{t('matches.formAddNotice', 'El jugador ocupará la plaza y se cargará su 1/4 parte')} (<strong>{selectedMatchForAdd.pricePerPlayer.toFixed(2)} €</strong>) {t('matches.formAddNoticeEnd', 'en su monedero de socio o pago en recepción.')}</span>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMatchForAdd(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {t('matches.cancelBtn', 'Cancelar')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
                >
                  {t('matches.confirmAddBtn', 'Confirmar Jugador')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMatches;
