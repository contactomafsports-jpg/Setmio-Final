import React, { useState, useMemo } from 'react';
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
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<OpenMatch | null>(null);

  // New match form state
  const [selectedCourtId, setSelectedCourtId] = useState(courts[0]?.id || 'court-1');
  const [matchDate, setMatchDate] = useState('2026-10-10');
  const [matchTime, setMatchTime] = useState('19:30');
  const [minLevel, setMinLevel] = useState(3.0);
  const [maxLevel, setMaxLevel] = useState(4.25);
  const [pricePerPlayer, setPricePerPlayer] = useState(7.0);
  const [matchMode, setMatchMode] = useState<'competitive' | 'friendly'>('competitive');
  const [creatorName, setCreatorName] = useState('Carlos Méndez');
  const [creatorLevel, setCreatorLevel] = useState(3.85);
  const [creatorPosition, setCreatorPosition] = useState<'drive' | 'reves' | 'both'>('drive');

  // Add player to match form state
  const [selectedMemberOption, setSelectedMemberOption] = useState<string>('Carlos Méndez');
  const [isManualGuestName, setIsManualGuestName] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestLevel, setGuestLevel] = useState(3.75);
  const [guestPosition, setGuestPosition] = useState<'drive' | 'reves' | 'both'>('both');

  interface ClubPlayerOption {
    name: string;
    level: number;
    isMember: boolean;
    label: string;
  }

  const registeredClubMembers: ClubPlayerOption[] = useMemo(() => [
    { name: 'Carlos Méndez', level: 4.85, isMember: true, label: 'Carlos Méndez (Socio #108 · Nivel 4.85)' },
    { name: 'Pablo Vello', level: 4.80, isMember: true, label: 'Pablo Vello (Socio #019 · Nivel 4.80)' },
    { name: 'Laura Senra', level: 5.00, isMember: true, label: 'Laura Senra (Socia Pro · Nivel 5.00)' },
    { name: 'Rosa Carballo', level: 3.90, isMember: true, label: 'Rosa Carballo (Socia #042 · Nivel 3.90)' },
    { name: 'Mateo Varela', level: 4.15, isMember: true, label: 'Mateo Varela (Socio #055 · Nivel 4.15)' },
    { name: 'Iván Gómez', level: 3.45, isMember: true, label: 'Iván Gómez (Socio #087 · Nivel 3.45)' },
    { name: 'Lucas Piñeiro', level: 3.85, isMember: false, label: 'Lucas Piñeiro (Invitado · Nivel 3.85)' },
    { name: 'David Castro', level: 4.10, isMember: false, label: 'David Castro (Invitado · Nivel 4.10)' },
    { name: 'Marcos Soto', level: 3.50, isMember: false, label: 'Marcos Soto (Invitado · Nivel 3.50)' },
  ], []);

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
      mode: matchMode,
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
      t('matches.toastCreatedDesc', `Partida creada en ${court.name} para el ${matchDate} a las ${matchTime}. Matchmaking activo (${matchMode === 'competitive' ? 'Modo Competitivo' : 'Modo Amistoso'}).`),
      'success'
    );
  };

  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchForAdd) return;

    let finalName = '';
    let finalLevel = guestLevel;

    if (isManualGuestName) {
      if (!guestName.trim()) return;
      finalName = guestName.trim();
    } else {
      const found = registeredClubMembers.find((m) => m.name === selectedMemberOption);
      finalName = found ? found.name : selectedMemberOption;
      if (found) finalLevel = found.level;
    }

    joinOpenMatch(selectedMatchForAdd.id, {
      name: finalName,
      level: Number(finalLevel),
      position: guestPosition,
    });

    triggerDemoToast(
      t('matches.toastPlayerAddedTitle', 'Jugador Añadido a la Partida'),
      t('matches.toastPlayerAddedDesc', `${finalName} ha sido confirmado en la plaza de la partida de ${selectedMatchForAdd.courtName}.`),
      'success'
    );

    setSelectedMatchForAdd(null);
    setGuestName('');
    setIsManualGuestName(false);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-12">
      {/* 1. Header Oficial */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('matches.eyebrow', 'Matchmaking & Comunidad Play!')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            {t('matches.title', 'Gestión de Partidas Abiertas')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {t('matches.subtitle', `${currentTenant.name} · Partidas niveladas por rating decimal, división de pago a 1/4 y convocatorias de socios.`)}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAdminTab('agenda')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs"
          >
            {t('matches.btnAgenda', 'Agenda')}
          </button>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('matches.btnNew', 'Nueva partida')}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                onClick={() => setSelectedMatchForDetail(m)}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between cursor-pointer group ${
                  isFull
                    ? 'border-emerald-500/30 dark:border-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                <div className="space-y-3">
                  {/* Fila Superior: Fecha/Hora, Pista y Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{startDateFormatted} · {startTimeFormatted}</span>
                      </div>
                      <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {m.courtName}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isFull
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {isFull ? t('matches.statusFull', 'Completa') : `${openSlots} ${t('matches.statusNeedPlayers', 'libres')}`}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          m.mode === 'friendly'
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        {m.mode === 'friendly' ? 'Amistoso' : 'Competitivo (ELO)'}
                      </span>
                    </div>
                  </div>

                  {/* Nivel ELO & Precio */}
                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Nivel ELO: <strong className="text-slate-800 dark:text-slate-200 font-mono">{m.minLevel.toFixed(2)} - {m.maxLevel.toFixed(2)}</strong>
                    </span>
                    <span className="font-mono font-black text-slate-900 dark:text-white">
                      {m.pricePerPlayer.toFixed(2)} €
                    </span>
                  </div>

                  {/* Avatares de Jugadores Confirmados en pequeño */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      <span>Plazas ({m.players.length}/4)</span>
                      <span className="text-emerald-600 dark:text-emerald-400 lowercase font-normal group-hover:underline">
                        Ver detalle →
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Jugadores confirmados con avatar pequeño */}
                      {m.players.map((p, idx) => (
                        <div
                          key={idx}
                          className="relative group/avatar"
                          title={`${p.name} · Nivel ${p.level.toFixed(2)} (${p.position})`}
                        >
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs">
                            {p.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white dark:border-slate-900" />
                        </div>
                      ))}

                      {/* Plazas libres con placeholder circular */}
                      {Array.from({ length: openSlots }).map((_, emptyIdx) => (
                        <button
                          key={`empty-${emptyIdx}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMatchForAdd(m);
                          }}
                          className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-400 hover:text-emerald-600 flex items-center justify-center text-xs font-bold transition cursor-pointer"
                          title="Inscribir jugador en esta plaza"
                        >
                          +
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer de Acciones Rápidas */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500 truncate max-w-[130px]">
                    Por: <strong className="text-slate-700 dark:text-slate-300">{m.creatorName}</strong>
                  </span>

                  {!isFull && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMatchForAdd(m);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition cursor-pointer shadow-xs"
                    >
                      + Inscribir
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: DETALLE DE PARTIDA COMPLETA */}
      {selectedMatchForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      selectedMatchForDetail.mode === 'friendly'
                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {selectedMatchForDetail.mode === 'friendly'
                      ? t('matches.modeFriendly', 'Modo Amistoso (No altera nivelación)')
                      : t('matches.modeCompetitive', 'Modo Competitivo (Afecta ELO)')}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {selectedMatchForDetail.courtName} · Partido Play!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedMatchForDetail.startTime.split('T')[0]} a las {selectedMatchForDetail.startTime.includes('T') ? selectedMatchForDetail.startTime.split('T')[1].slice(0, 5) : '19:30'} · {selectedMatchForDetail.durationMinutes} min
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMatchForDetail(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* KPIs del partido */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nivel ELO</span>
                <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">
                  {selectedMatchForDetail.minLevel.toFixed(2)} - {selectedMatchForDetail.maxLevel.toFixed(2)}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Cuota 1/4</span>
                <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
                  {selectedMatchForDetail.pricePerPlayer.toFixed(2)} €
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Plazas Libres</span>
                <span className="text-sm font-mono font-black text-amber-500">
                  {4 - selectedMatchForDetail.players.length} / 4
                </span>
              </div>
            </div>

            {/* Lista detallada de jugadores */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Jugadores Inscritos ({selectedMatchForDetail.players.length}/4):
              </span>

              <div className="space-y-2">
                {selectedMatchForDetail.players.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-500">
                          Nivel ELO {p.level.toFixed(2)} · Posición: <span className="capitalize">{p.position}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      Confirmado
                    </span>
                  </div>
                ))}

                {Array.from({ length: 4 - selectedMatchForDetail.players.length }).map((_, emptyIdx) => (
                  <div
                    key={`slot-${emptyIdx}`}
                    className="p-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400"
                  >
                    <span>Plaza {selectedMatchForDetail.players.length + emptyIdx + 1} Libre</span>
                    <button
                      type="button"
                      onClick={() => {
                        const m = selectedMatchForDetail;
                        setSelectedMatchForDetail(null);
                        setSelectedMatchForAdd(m);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Inscribir
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedMatchForDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                {t('matches.detailClose', 'Cerrar Detalle')}
              </button>

              {selectedMatchForDetail.players.length < 4 && (
                <button
                  type="button"
                  onClick={() => {
                    const m = selectedMatchForDetail;
                    setSelectedMatchForDetail(null);
                    setSelectedMatchForAdd(m);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  + Inscribir Jugador
                </button>
              )}
            </div>
          </div>
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
              {/* Selector de Clasificación del Partido: Competitivo vs Amistoso */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Clasificación del Partido
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMatchMode('competitive')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      matchMode === 'competitive'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>Modo Competitivo</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Afecta al Nivel ELO del jugador
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMatchMode('friendly')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      matchMode === 'friendly'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-800 dark:text-indigo-300 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Modo Amistoso</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      No altera la nivelación ELO
                    </div>
                  </button>
                </div>
              </div>

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
                  {selectedMatchForAdd.courtName} · Nivel ELO {selectedMatchForAdd.minLevel.toFixed(2)} - {selectedMatchForAdd.maxLevel.toFixed(2)}
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
                  Inscripción de Jugador
                </label>
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsManualGuestName(false)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      !isManualGuestName
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Buscar Socio Registrado
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsManualGuestName(true)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      isManualGuestName
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Invitado Libre
                  </button>
                </div>

                {!isManualGuestName ? (
                  <select
                    value={selectedMemberOption}
                    onChange={(e) => {
                      setSelectedMemberOption(e.target.value);
                      const found = registeredClubMembers.find((m) => m.name === e.target.value);
                      if (found) setGuestLevel(found.level);
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                  >
                    {registeredClubMembers.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Ej. Lucas Rey Domínguez"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                )}
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
