import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpenMatch } from '../../types/database';
import {
  Users,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  X,
  CreditCard,
  Share2,
  Wallet,
  Sparkles,
  Search,
  Filter,
  Check,
  UserCheck,
  AlertCircle,
  MapPin,
  Lock,
} from 'lucide-react';

export const OpenMatchesView: React.FC = () => {
  const {
    openMatches,
    createOpenMatch,
    updateOpenMatch,
    joinOpenMatch,
    leaveOpenMatch,
    currentUser,
    courts,
    currentTenant,
    triggerDemoToast,
  } = useApp();

  const [levelFilter, setLevelFilter] = useState<'all' | 'iniciacion' | 'intermedio' | 'avanzado'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'mine'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<OpenMatch | null>(null);
  const [selectedMatchForJoin, setSelectedMatchForJoin] = useState<OpenMatch | null>(null);
  const [selectedMatchForPayShare, setSelectedMatchForPayShare] = useState<OpenMatch | null>(null);

  // Join Modal Form State
  const [joinPosition, setJoinPosition] = useState<'drive' | 'reves' | 'both'>('both');
  const [joinPayNow, setJoinPayNow] = useState(true);

  // Pay Share Modal Form State
  const [payShareMethod, setPayShareMethod] = useState<'wallet' | 'card'>('wallet');

  // New match form state
  const [selectedCourtId, setSelectedCourtId] = useState(courts[0]?.id || 'court-1');
  const [matchDate, setMatchDate] = useState('2026-10-10');
  const [matchTime, setMatchTime] = useState('19:30');
  const [minLevel, setMinLevel] = useState(3.5);
  const [maxLevel, setMaxLevel] = useState(4.25);
  const [pricePerPlayer, setPricePerPlayer] = useState(8.0);
  const [creatorPosition, setCreatorPosition] = useState<'drive' | 'reves' | 'both'>('drive');
  const [matchGender, setMatchGender] = useState<'male' | 'female' | 'mixed'>('mixed');
  const [matchMode, setMatchMode] = useState<'friendly' | 'competitive'>('competitive');

  const filteredMatches = openMatches.filter((m) => {
    // Level filter
    if (levelFilter === 'iniciacion' && m.maxLevel > 3.25) return false;
    if (levelFilter === 'intermedio' && (m.minLevel < 3.0 || m.maxLevel > 4.5)) return false;
    if (levelFilter === 'avanzado' && m.minLevel < 4.0) return false;

    // Status filter
    if (statusFilter === 'open' && m.players.length >= 4) return false;
    if (statusFilter === 'mine' && !m.players.some((p) => p.name === currentUser.name)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCourt = m.courtName.toLowerCase().includes(q);
      const matchPlayer = m.players.some((p) => p.name.toLowerCase().includes(q));
      if (!matchCourt && !matchPlayer) return false;
    }

    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const court = courts.find((c) => c.id === selectedCourtId) || courts[0];
    const startISO = `${matchDate}T${matchTime}:00Z`;

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
      mode: matchMode,
      visibility: 'public',
      gender: matchGender,
      paymentMode: 'split',
      paymentPolicy: 'both',
      players: [
        {
          id: `p-${Date.now()}`,
          name: currentUser.name,
          level: currentUser.playLevel,
          position: creatorPosition,
          paid: true,
        },
      ],
    });

    setShowCreateModal(false);
    triggerDemoToast(
      'Partida Creada con Éxito',
      `Tu partida en ${court.name} ha sido publicada. Los jugadores de tu nivel ya pueden inscribirse.`,
      'success'
    );
  };

  const handleExecuteJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchForJoin) return;

    if (selectedMatchForJoin.players.length >= 4) {
      triggerDemoToast('Partida Completa', 'Esta partida ya no dispone de plazas libres.', 'warning');
      setSelectedMatchForJoin(null);
      return;
    }

    const alreadyJoined = selectedMatchForJoin.players.some((p) => p.name === currentUser.name);
    if (alreadyJoined) {
      triggerDemoToast('Ya Estás Inscrito', 'Ya formas parte de esta partida.', 'info');
      setSelectedMatchForJoin(null);
      return;
    }

    const updatedPlayers = [
      ...selectedMatchForJoin.players,
      {
        id: `p-${Date.now()}`,
        name: currentUser.name,
        level: currentUser.playLevel,
        position: joinPosition,
        paid: joinPayNow,
      },
    ];

    updateOpenMatch(selectedMatchForJoin.id, {
      players: updatedPlayers,
      status: updatedPlayers.length >= 4 ? 'full' : 'open',
    });

    triggerDemoToast(
      joinPayNow ? 'Plaza Reservada y Pagada' : 'Plaza Reservada',
      joinPayNow
        ? `Has pagado ${selectedMatchForJoin.pricePerPlayer.toFixed(2)} € (1/4 de pista). Tu plaza en ${selectedMatchForJoin.courtName} está confirmada.`
        : `Plaza bloqueada en ${selectedMatchForJoin.courtName}. Recuerda pagar antes del inicio en la app o mostrador.`,
      'success'
    );

    setSelectedMatchForJoin(null);
  };

  const handleExecutePayShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchForPayShare) return;

    const updatedPlayers = selectedMatchForPayShare.players.map((p) =>
      p.name === currentUser.name ? { ...p, paid: true } : p
    );

    updateOpenMatch(selectedMatchForPayShare.id, {
      players: updatedPlayers,
    });

    const methodLabel = payShareMethod === 'wallet' ? 'saldo monedero' : 'tarjeta';
    triggerDemoToast(
      'Pago de Plaza Realizado',
      `Has abonado ${selectedMatchForPayShare.pricePerPlayer.toFixed(2)} € (tu parte de 1/4) mediante ${methodLabel}. ¡Todo listo para jugar!`,
      'success'
    );

    setSelectedMatchForPayShare(null);
  };

  const handleLeave = (matchId: string) => {
    leaveOpenMatch(matchId, currentUser.name);
    setSelectedMatchForDetail(null);
    triggerDemoToast('Plaza Liberada', 'Te has desapuntado de la partida correctamente.', 'info');
  };

  const handleCopyMatchLink = (matchId: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`https://setmio.com/partida/${matchId}`);
    }
    triggerDemoToast(
      'Enlace Copiado',
      'El enlace directo a la partida ha sido copiado al portapapeles.',
      'success'
    );
  };

  const handleJoinWaitingList = (match: OpenMatch) => {
    triggerDemoToast(
      'Añadido a Lista de Espera',
      `Te avisaremos al instante si algún jugador de ${match.courtName} cancela su plaza.`,
      'info'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header Unificado estilo Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Partidos Abiertos Play! · Sistema Split 1/4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Partidas Abiertas en {currentTenant.shortName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Únete a partidas niveladas por ELO decimal, asegura tu plaza con pago dividido automático y disfruta del pádel sin complicaciones.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Partida</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda (Mobile-First) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filtros de Nivel */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setLevelFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              levelFilter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Todos los niveles
          </button>
          <button
            type="button"
            onClick={() => setLevelFilter('iniciacion')}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              levelFilter === 'iniciacion'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Iniciación (&lt;3.25)
          </button>
          <button
            type="button"
            onClick={() => setLevelFilter('intermedio')}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              levelFilter === 'intermedio'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Intermedio (3.0-4.5)
          </button>
          <button
            type="button"
            onClick={() => setLevelFilter('avanzado')}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              levelFilter === 'avanzado'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Avanzado (&gt;4.0)
          </button>
        </div>

        {/* Filtro Estado / Mis Partidas */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por pista o jugador..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <button
            type="button"
            onClick={() => setStatusFilter((prev) => (prev === 'mine' ? 'all' : 'mine'))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer whitespace-nowrap ${
              statusFilter === 'mine'
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Mis Partidas
          </button>
        </div>
      </div>

      {/* Grid de Partidas con Diseño Unificado (Exactamente igual que Admin) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMatches.map((m) => {
          const isFull = m.players.length >= 4;
          const openSlots = Math.max(0, 4 - m.players.length);
          const userInMatch = m.players.find((p) => p.name === currentUser.name);
          const isPendingMyPayment = userInMatch && !userInMatch.paid;

          return (
            <div
              key={m.id}
              className={`rounded-3xl bg-white dark:bg-slate-900 border p-5 sm:p-6 flex flex-col justify-between space-y-4 transition shadow-sm hover:shadow-md ${
                isPendingMyPayment
                  ? 'border-amber-400/80 dark:border-amber-500/60 ring-2 ring-amber-400/20'
                  : userInMatch
                  ? 'border-emerald-500/50 dark:border-emerald-500/40'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header de la Tarjeta: Badges & Precio */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Badge de Nivel Decimal */}
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-mono font-bold text-xs">
                      Nivel {m.minLevel.toFixed(2)} - {m.maxLevel.toFixed(2)}
                    </span>

                    {/* Badge de Estado Plazas */}
                    {isFull ? (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px]">
                        Completo
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                        {openSlots} plaza{openSlots > 1 ? 's' : ''} libre{openSlots > 1 ? 's' : ''}
                      </span>
                    )}

                    {/* Badge Modalidad */}
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 font-bold text-[10px]">
                      Split 1/4
                    </span>
                  </div>

                  {/* Precio por Jugador */}
                  <div className="text-right shrink-0">
                    <span className="font-mono font-black text-slate-900 dark:text-white text-base">
                      {m.pricePerPlayer.toFixed(2)} €
                    </span>
                    <span className="block text-[10px] text-slate-400">/jugador</span>
                  </div>
                </div>

                {/* Título de Pista e Info de Horario */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{m.courtName}</span>
                    {userInMatch && (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        Inscrito
                      </span>
                    )}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{m.startTime.split('T')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400" />
                      <span>{m.startTime.split('T')[1]?.slice(0, 5)} h ({m.durationMinutes} min)</span>
                    </div>
                  </div>
                </div>

                {/* Aviso Especial si el usuario tiene pago pendiente de su parte */}
                {isPendingMyPayment && (
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center justify-between text-xs animate-pulse">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="font-bold text-amber-900 dark:text-amber-200 text-[11px]">
                        Tienes pendiente el pago de tu plaza ({m.pricePerPlayer.toFixed(2)} €)
                      </span>
                    </div>
                  </div>
                )}

                {/* Avatares de Jugadores Unificados con Admin */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <span>Jugadores ({m.players.length}/4)</span>
                    <span className="text-slate-500">
                      {m.gender === 'male' ? 'Masculina' : m.gender === 'female' ? 'Femenina' : 'Mixta'} · {m.mode === 'competitive' ? 'Competitiva' : 'Amistosa'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Jugadores confirmados con avatar exacto a Admin */}
                    {m.players.map((p, idx) => (
                      <div
                        key={idx}
                        className="relative group/avatar"
                        title={`${p.name} · Nivel ${p.level.toFixed(2)} (${p.position}) · ${p.paid ? 'Pagado' : 'Pendiente de pago'}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center border-2 shadow-xs ${
                            p.name === currentUser.name
                              ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-500/30'
                              : 'bg-slate-700 dark:bg-slate-800 text-white border-white dark:border-slate-900'
                          }`}
                        >
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>

                        {/* Mini badge de posición */}
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-black flex items-center justify-center border border-white dark:border-slate-900 ${
                            p.position === 'drive'
                              ? 'bg-amber-400 text-slate-950'
                              : p.position === 'reves'
                              ? 'bg-indigo-400 text-white'
                              : 'bg-emerald-400 text-slate-950'
                          }`}
                        >
                          {p.position === 'drive' ? 'D' : p.position === 'reves' ? 'R' : 'A'}
                        </span>

                        {/* Indicador de Pago */}
                        {p.paid ? (
                          <span
                            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 text-white flex items-center justify-center border border-white dark:border-slate-900"
                            title="Pagado"
                          >
                            <Check className="w-2 h-2 stroke-[3]" />
                          </span>
                        ) : (
                          <span
                            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center border border-white dark:border-slate-900"
                            title="Pendiente de pago"
                          >
                            <Clock className="w-2 h-2" />
                          </span>
                        )}
                      </div>
                    ))}

                    {/* Plazas libres con placeholder circular unificado */}
                    {Array.from({ length: openSlots }).map((_, emptyIdx) => (
                      <button
                        key={`empty-${emptyIdx}`}
                        type="button"
                        onClick={() => setSelectedMatchForJoin(m)}
                        className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-400 hover:text-emerald-600 transition flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Plaza libre · Haz clic para reservar tu plaza"
                      >
                        +
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botones de Acción Rápida Mobile-First */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMatchForDetail(m)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Detalles
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyMatchLink(m.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Compartir enlace de la partida"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {userInMatch ? (
                    <>
                      {isPendingMyPayment && (
                        <button
                          type="button"
                          onClick={() => setSelectedMatchForPayShare(m)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pagar mi parte ({m.pricePerPlayer.toFixed(2)} €)</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleLeave(m.id)}
                        className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-800 transition cursor-pointer"
                        title="Desapuntarme de este partido"
                      >
                        Desapuntarme
                      </button>
                    </>
                  ) : isFull ? (
                    <button
                      type="button"
                      onClick={() => handleJoinWaitingList(m)}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      Lista de espera
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedMatchForJoin(m)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <span>Reservar plaza</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================================
          MODAL 1: RESERVAR MI PLAZA / UNIRME A LA PARTIDA (Mobile-First)
          ====================================================================== */}
      {selectedMatchForJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Reservar mi Plaza en la Partida
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedMatchForJoin.courtName} · {selectedMatchForJoin.startTime.split('T')[0]} a las {selectedMatchForJoin.startTime.split('T')[1]?.slice(0, 5)} h
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatchForJoin(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tarjeta de Resumen de Pago Dividido */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/20 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span>Tu cuota de pista (1/4):</span>
                <span className="font-mono text-base text-emerald-600 dark:text-emerald-400">
                  {selectedMatchForJoin.pricePerPlayer.toFixed(2)} €
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Paga de forma independiente. No dependes del pago de los demás jugadores.
              </p>
            </div>

            <form onSubmit={handleExecuteJoin} className="space-y-4 text-xs">
              {/* Selección de Posición en Pista */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tu Posición en Pista
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setJoinPosition('drive')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                      joinPosition === 'drive'
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-800 dark:text-amber-300 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}
                  >
                    Drive (Derecha)
                  </button>
                  <button
                    type="button"
                    onClick={() => setJoinPosition('reves')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                      joinPosition === 'reves'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-800 dark:text-indigo-300 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}
                  >
                    Revés (Izquierda)
                  </button>
                  <button
                    type="button"
                    onClick={() => setJoinPosition('both')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                      joinPosition === 'both'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}
                  >
                    Indiferente
                  </button>
                </div>
              </div>

              {/* Opción de Pago Inmediato o en Mostrador */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Método de Reserva & Pago
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="joinPayOption"
                      checked={joinPayNow}
                      onChange={() => setJoinPayNow(true)}
                      className="accent-emerald-600"
                    />
                    <div className="flex-1">
                      <strong className="block font-bold text-slate-900 dark:text-white">
                        Pagar ahora mi parte ({selectedMatchForJoin.pricePerPlayer.toFixed(2)} €)
                      </strong>
                      <span className="text-[11px] text-slate-500">
                        Se descuenta de tu monedero (Saldo: 24.50 €) o tarjeta.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="joinPayOption"
                      checked={!joinPayNow}
                      onChange={() => setJoinPayNow(false)}
                      className="accent-emerald-600"
                    />
                    <div className="flex-1">
                      <strong className="block font-bold text-slate-900 dark:text-white">
                        Reservar plaza y pagar después
                      </strong>
                      <span className="text-[11px] text-slate-500">
                        Podrás pagar con el botón "Pagar mi parte" o en cafetería antes de entrar a pista.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMatchForJoin(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
                >
                  Confirmar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 2: PAGAR MI PARTE (Mobile-First Acción Rápida)
          ====================================================================== */}
      {selectedMatchForPayShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500 text-white">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Pagar mi Parte (1/4 de Pista)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedMatchForPayShare.courtName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatchForPayShare(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-center space-y-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total a Abonar
              </span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {selectedMatchForPayShare.pricePerPlayer.toFixed(2)} €
              </div>
              <p className="text-[11px] text-slate-500">
                Partida del {selectedMatchForPayShare.startTime.split('T')[0]} a las {selectedMatchForPayShare.startTime.split('T')[1]?.slice(0, 5)} h
              </p>
            </div>

            <form onSubmit={handleExecutePayShare} className="space-y-3 text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Selecciona forma de pago:
              </label>

              <div
                onClick={() => setPayShareMethod('wallet')}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  payShareMethod === 'wallet'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-bold text-slate-900 dark:text-white">
                      Saldo Monedero Setmio
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      Saldo disponible: 24.50 €
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Inmediato
                </span>
              </div>

              <div
                onClick={() => setPayShareMethod('card')}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  payShareMethod === 'card'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-bold text-slate-900 dark:text-white">
                      Tarjeta / Bizum
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      Pasarela segura Stripe 3D-Secure
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  Online
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMatchForPayShare(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Abonar {selectedMatchForPayShare.pricePerPlayer.toFixed(2)} €</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 3: FICHA DETALLADA DE PARTIDA (Mobile-First)
          ====================================================================== */}
      {selectedMatchForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Ficha Oficial de Partida Play!
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {selectedMatchForDetail.courtName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatchForDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuadrante de Datos Clave */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Horario</span>
                <div className="font-bold text-slate-900 dark:text-white">
                  {selectedMatchForDetail.startTime.split('T')[0]} · {selectedMatchForDetail.startTime.split('T')[1]?.slice(0, 5)} h
                </div>
                <span className="text-[11px] text-slate-500">Duración: {selectedMatchForDetail.durationMinutes} min</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Nivel ELO Requerido</span>
                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {selectedMatchForDetail.minLevel.toFixed(2)} - {selectedMatchForDetail.maxLevel.toFixed(2)}
                </div>
                <span className="text-[11px] text-slate-500">Partida nivelada</span>
              </div>
            </div>

            {/* Desglose de Jugadores con badges de estado */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>Jugadores en la partida ({selectedMatchForDetail.players.length} de 4):</span>
                <span className="text-slate-400 text-[11px]">Cobro individual 1/4</span>
              </div>

              <div className="space-y-2">
                {selectedMatchForDetail.players.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong className="block font-bold text-slate-900 dark:text-white text-xs">
                          {p.name} {p.name === currentUser.name ? '(Tú)' : ''}
                        </strong>
                        <span className="text-[11px] text-slate-500">
                          Posición: {p.position === 'drive' ? 'Drive' : p.position === 'reves' ? 'Revés' : 'Ambos lados'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                        Niv {p.level.toFixed(2)}
                      </span>
                      {p.paid ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          Pagado
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                          Pendiente
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Huecos restantes */}
                {Array.from({ length: Math.max(0, 4 - selectedMatchForDetail.players.length) }).map((_, i) => (
                  <div
                    key={`free-${i}`}
                    className="p-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-between text-slate-400"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs">
                        +
                      </div>
                      <span className="font-semibold text-xs">Plaza libre disponible</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedMatchForDetail.pricePerPlayer.toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aviso de Iluminación y Acceso */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Acceso Domótico Setmio</span>
              </div>
              <p>
                PIN de acceso de la pista activo 10 minutos antes. La domótica inteligente encenderá los focos LED automáticamente.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleCopyMatchLink(selectedMatchForDetail.id)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copiar Enlace</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMatchForDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 4: CREAR NUEVA PARTIDA ABIERTA (Unificado con Admin)
          ====================================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Publicar Partida Abierta Play!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reserva la pista para 4 jugadores con cobro dividido a 1/4.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pista de Pádel
                </label>
                <select
                  value={selectedCourtId}
                  onChange={(e) => setSelectedCourtId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
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
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    required
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nivel Mínimo ({minLevel.toFixed(2)})
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="1.0"
                    max="7.0"
                    value={minLevel}
                    onChange={(e) => setMinLevel(parseFloat(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nivel Máximo ({maxLevel.toFixed(2)})
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="1.0"
                    max="7.0"
                    value={maxLevel}
                    onChange={(e) => setMaxLevel(parseFloat(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tu Posición
                  </label>
                  <select
                    value={creatorPosition}
                    onChange={(e) => setCreatorPosition(e.target.value as 'drive' | 'reves' | 'both')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="drive">Drive</option>
                    <option value="reves">Revés</option>
                    <option value="both">Ambos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Género
                  </label>
                  <select
                    value={matchGender}
                    onChange={(e) => setMatchGender(e.target.value as 'male' | 'female' | 'mixed')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="mixed">Mixta</option>
                    <option value="male">Masculina</option>
                    <option value="female">Femenina</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Precio/Jugador (€)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1.0"
                    value={pricePerPlayer}
                    onChange={(e) => setPricePerPlayer(parseFloat(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-slate-600 dark:text-slate-400">
                Al publicar, se bloquea la pista de forma oficial. Se envía convocatoria a los jugadores de tu rango de nivel en el club. Solo pagarás tu cuota individual ({pricePerPlayer.toFixed(2)} €).
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
                >
                  Publicar Partida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
