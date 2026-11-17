import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpenMatch } from '../../types/database';
import {
  Plus,
  Calendar,
  Clock,
  ArrowRight,
  X,
  CreditCard,
  Share2,
  Wallet,
  Search,
  Check,
  AlertCircle,
  Lock,
} from 'lucide-react';

export const OpenMatchesView: React.FC = () => {
  const {
    openMatches,
    createOpenMatch,
    updateOpenMatch,
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

  const ELO_SCALE = [
    1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75,
    4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 6.25, 6.5, 6.75, 7.0,
  ];
  const [pricePerPlayer, setPricePerPlayer] = useState(8.0);
  const [creatorPosition, setCreatorPosition] = useState<'drive' | 'reves' | 'both'>('drive');
  const [matchGender, setMatchGender] = useState<'male' | 'female' | 'mixed'>('mixed');
  const [matchMode] = useState<'friendly' | 'competitive'>('competitive');

  const filteredMatches = openMatches.filter((m) => {
    if (levelFilter === 'iniciacion' && m.maxLevel > 3.25) return false;
    if (levelFilter === 'intermedio' && (m.minLevel < 3.0 || m.maxLevel > 4.5)) return false;
    if (levelFilter === 'avanzado' && m.minLevel < 4.0) return false;

    if (statusFilter === 'open' && m.players.length >= 4) return false;
    if (statusFilter === 'mine' && !m.players.some((p) => p.name === currentUser.name)) return false;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-[#0B1A2D] dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-[#1A314D]">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#8B5CF6] dark:text-[#a78bfa]">
            Partidos Abiertos Play! · Split 1/4
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight">
            Partidas Abiertas en {currentTenant.shortName}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Únete a partidas niveladas por ELO decimal, asegura tu plaza con pago dividido automático y disfruta del pádel sin complicaciones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs flex items-center gap-2 transition cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Partida</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'Todos los niveles' },
            { id: 'iniciacion', label: 'Iniciación (<3.25)' },
            { id: 'intermedio', label: 'Intermedio (3.0-4.5)' },
            { id: 'avanzado', label: 'Avanzado (>4.0)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setLevelFilter(tab.id as typeof levelFilter)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
                levelFilter === tab.id
                  ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por pista o jugador..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[40px] pl-9 pr-3 py-2 bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6] font-medium"
            />
          </div>

          <button
            type="button"
            onClick={() => setStatusFilter((prev) => (prev === 'mine' ? 'all' : 'mine'))}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer whitespace-nowrap ${
              statusFilter === 'mine'
                ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white'
                : 'bg-white dark:bg-[#0E2239] border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            Mis Partidas
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.map((m) => {
          const isFull = m.players.length >= 4;
          const openSlots = Math.max(0, 4 - m.players.length);
          const userInMatch = m.players.find((p) => p.name === currentUser.name);
          const isPendingMyPayment = userInMatch && !userInMatch.paid;

          return (
            <div
              key={m.id}
              className={`rounded-2xl bg-white dark:bg-[#0E2239] border p-6 flex flex-col justify-between space-y-5 transition ${
                isPendingMyPayment
                  ? 'border-[#8B5CF6] ring-1 ring-[#8B5CF6]/30'
                  : userInMatch
                  ? 'border-[#0B1A2D] dark:border-[#B7F229]'
                  : 'border-slate-200/80 dark:border-[#1A314D] hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="space-y-4">
                {/* Inline Unboxed Metadata + Price */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono tabular-nums">
                      <span className="font-bold text-[#8B5CF6] dark:text-[#a78bfa]">
                        ELO {m.minLevel.toFixed(2)}–{m.maxLevel.toFixed(2)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span className={isFull ? 'text-slate-500' : 'text-[#0B1A2D] dark:text-[#B7F229] font-semibold'}>
                        {isFull
                          ? 'Completa'
                          : `${openSlots} plaza${openSlots > 1 ? 's' : ''} libre${openSlots > 1 ? 's' : ''}`}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span className="text-slate-500 dark:text-slate-400">Split 1/4</span>
                    </div>

                    <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                      <span>{m.courtName}</span>
                      {userInMatch && (
                        <span className="text-[11px] font-semibold text-[#0B1A2D] bg-[#B7F229] px-2 py-0.5 rounded-md">
                          Inscrito
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono tabular-nums font-extrabold text-[#0B1A2D] dark:text-white text-lg">
                      {m.pricePerPlayer.toFixed(2)} €
                    </span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400">/jugador</span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-mono tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#a78bfa]" />
                    <span>{m.startTime.split('T')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#a78bfa]" />
                    <span>{m.startTime.split('T')[1]?.slice(0, 5)} h ({m.durationMinutes} min)</span>
                  </div>
                </div>

                {/* Pending Payment Notice (no pulse animation) */}
                {isPendingMyPayment && (
                  <div className="p-3 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0" />
                    <span className="font-semibold text-[#0B1A2D] dark:text-white text-[11px] font-mono tabular-nums">
                      Pago pendiente de tu plaza: {m.pricePerPlayer.toFixed(2)} €
                    </span>
                  </div>
                )}

                {/* Players Roster Circles */}
                <div className="pt-3 border-t border-slate-200/80 dark:border-[#1A314D]">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    <span>Jugadores ({m.players.length}/4)</span>
                    <span>
                      {m.gender === 'male' ? 'Masculina' : m.gender === 'female' ? 'Femenina' : 'Mixta'} · {m.mode === 'competitive' ? 'Competitiva' : 'Amistosa'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {m.players.map((p, idx) => (
                      <div
                        key={idx}
                        className="relative"
                        title={`${p.name} · Nivel ${p.level.toFixed(2)} (${p.position}) · ${p.paid ? 'Pagado' : 'Pendiente de pago'}`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center border ${
                            p.name === currentUser.name
                              ? 'bg-[#B7F229] text-[#0B1A2D] border-[#0B1A2D]'
                              : 'bg-[#0B1A2D] dark:bg-[#132A45] text-white border-slate-200 dark:border-[#1A314D]'
                          }`}
                        >
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>

                        <span
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center border border-white dark:border-[#0E2239] ${
                            p.position === 'drive'
                              ? 'bg-[#0B1A2D] text-[#B7F229]'
                              : p.position === 'reves'
                              ? 'bg-[#8B5CF6] text-white'
                              : 'bg-[#B7F229] text-[#0B1A2D]'
                          }`}
                        >
                          {p.position === 'drive' ? 'D' : p.position === 'reves' ? 'R' : 'A'}
                        </span>

                        {p.paid ? (
                          <span
                            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#B7F229] text-[#0B1A2D] flex items-center justify-center border border-white dark:border-[#0E2239]"
                            title="Pagado"
                          >
                            <Check className="w-2 h-2 stroke-[3]" />
                          </span>
                        ) : (
                          <span
                            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center border border-white dark:border-[#0E2239]"
                            title="Pendiente de pago"
                          >
                            <Clock className="w-2 h-2" />
                          </span>
                        )}
                      </div>
                    ))}

                    {Array.from({ length: openSlots }).map((_, emptyIdx) => (
                      <button
                        key={`empty-${emptyIdx}`}
                        type="button"
                        onClick={() => setSelectedMatchForJoin(m)}
                        className="w-9 h-9 rounded-full border border-dashed border-slate-300 dark:border-[#1A314D] hover:border-[#8B5CF6] text-slate-400 hover:text-[#8B5CF6] transition flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Plaza libre · Haz clic para reservar tu plaza"
                      >
                        +
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-[#1A314D] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMatchForDetail(m)}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-[#132A45] transition cursor-pointer"
                  >
                    Detalles
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyMatchLink(m.id)}
                    className="min-h-[40px] min-w-[40px] p-2 rounded-xl text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-50 dark:hover:bg-[#132A45] transition flex items-center justify-center cursor-pointer"
                    title="Compartir enlace de la partida"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {userInMatch ? (
                    <>
                      {isPendingMyPayment && (
                        <button
                          type="button"
                          onClick={() => setSelectedMatchForPayShare(m)}
                          className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span className="font-mono tabular-nums">Pagar ({m.pricePerPlayer.toFixed(2)} €)</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleLeave(m.id)}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] hover:bg-slate-200 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-slate-300 font-semibold text-xs border border-slate-200/80 dark:border-[#1A314D] transition cursor-pointer"
                        title="Desapuntarme de este partido"
                      >
                        Salir
                      </button>
                    </>
                  ) : isFull ? (
                    <button
                      type="button"
                      onClick={() => handleJoinWaitingList(m)}
                      className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#132A45] font-semibold text-xs border border-slate-200/80 dark:border-[#1A314D] transition cursor-pointer"
                    >
                      Lista de espera
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedMatchForJoin(m)}
                      className="min-h-[40px] px-4 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
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

      {/* MODAL 1: JOIN MATCH */}
      {selectedMatchForJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071220]/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-[#1A314D] pb-3.5">
              <div>
                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Reservar Plaza en Partida
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5">
                  {selectedMatchForJoin.courtName} · {selectedMatchForJoin.startTime.split('T')[0]} · {selectedMatchForJoin.startTime.split('T')[1]?.slice(0, 5)} h
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatchForJoin(null)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-[#0B1A2D] dark:text-white">
                <span>Tu cuota de pista (1/4)</span>
                <span className="font-mono tabular-nums text-base text-[#0B1A2D] dark:text-[#B7F229]">
                  {selectedMatchForJoin.pricePerPlayer.toFixed(2)} €
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Paga de forma independiente. No dependes del pago de los demás jugadores.
              </p>
            </div>

            <form onSubmit={handleExecuteJoin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0B1A2D] dark:text-slate-200 mb-1.5">
                  Tu Posición en Pista
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'drive', label: 'Drive' },
                    { id: 'reves', label: 'Revés' },
                    { id: 'both', label: 'Indiferente' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setJoinPosition(pos.id as typeof joinPosition)}
                      className={`min-h-[40px] py-2 px-2 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                        joinPosition === pos.id
                          ? 'bg-[#0B1A2D] dark:bg-[#B7F229] border-[#0B1A2D] dark:border-[#B7F229] text-white dark:text-[#0B1A2D]'
                          : 'bg-slate-50 dark:bg-[#071220] border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-[#0B1A2D] dark:text-slate-200">
                  Método de Reserva y Pago
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] cursor-pointer">
                    <input
                      type="radio"
                      name="joinPayOption"
                      checked={joinPayNow}
                      onChange={() => setJoinPayNow(true)}
                      className="accent-[#0B1A2D]"
                    />
                    <div className="flex-1">
                      <strong className="block font-semibold text-[#0B1A2D] dark:text-white font-mono tabular-nums">
                        Pagar ahora mi parte ({selectedMatchForJoin.pricePerPlayer.toFixed(2)} €)
                      </strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Se descuenta de tu monedero (24.50 €) o tarjeta.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] cursor-pointer">
                    <input
                      type="radio"
                      name="joinPayOption"
                      checked={!joinPayNow}
                      onChange={() => setJoinPayNow(false)}
                      className="accent-[#0B1A2D]"
                    />
                    <div className="flex-1">
                      <strong className="block font-semibold text-[#0B1A2D] dark:text-white">
                        Reservar plaza y pagar después
                      </strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Podrás abonarlo antes del partido en la app o en recepción.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMatchForJoin(null)}
                  className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-[#132A45] transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-5 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition cursor-pointer"
                >
                  Confirmar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PAY SHARE */}
      {selectedMatchForPayShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071220]/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-[#1A314D] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#B7F229] text-[#0B1A2D]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                    Pagar mi Parte (1/4)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedMatchForPayShare.courtName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatchForPayShare(null)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] text-center space-y-1">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total a Abonar
              </span>
              <div className="text-3xl font-extrabold text-[#0B1A2D] dark:text-[#B7F229] font-mono tabular-nums">
                {selectedMatchForPayShare.pricePerPlayer.toFixed(2)} €
              </div>
              <p className="text-[11px] text-slate-500 font-mono tabular-nums">
                {selectedMatchForPayShare.startTime.split('T')[0]} · {selectedMatchForPayShare.startTime.split('T')[1]?.slice(0, 5)} h
              </p>
            </div>

            <form onSubmit={handleExecutePayShare} className="space-y-3 text-xs">
              <label className="block font-semibold text-[#0B1A2D] dark:text-slate-200">
                Selecciona forma de pago
              </label>

              <div
                onClick={() => setPayShareMethod('wallet')}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  payShareMethod === 'wallet'
                    ? 'border-[#0B1A2D] dark:border-[#B7F229] bg-slate-50 dark:bg-[#132A45]'
                    : 'border-slate-200/80 dark:border-[#1A314D] bg-white dark:bg-[#071220]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229]">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-semibold text-[#0B1A2D] dark:text-white">
                      Saldo Monedero Setmio
                    </strong>
                    <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                      Disponible: 24.50 €
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa]">
                  Inmediato
                </span>
              </div>

              <div
                onClick={() => setPayShareMethod('card')}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  payShareMethod === 'card'
                    ? 'border-[#0B1A2D] dark:border-[#B7F229] bg-slate-50 dark:bg-[#132A45]'
                    : 'border-slate-200/80 dark:border-[#1A314D] bg-white dark:bg-[#071220]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#0E2239] text-[#0B1A2D] dark:text-slate-200">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-semibold text-[#0B1A2D] dark:text-white">
                      Tarjeta / Bizum
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      Pasarela segura 3D-Secure
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  Online
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMatchForPayShare(null)}
                  className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-[#132A45] transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-5 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span className="font-mono tabular-nums">Abonar {selectedMatchForPayShare.pricePerPlayer.toFixed(2)} €</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: MATCH DETAIL */}
      {selectedMatchForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071220]/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-6 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-[#1A314D] pb-3.5">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#8B5CF6] dark:text-[#a78bfa]">
                  Ficha Oficial de Partida Play!
                </div>
                <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white mt-0.5">
                  {selectedMatchForDetail.courtName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatchForDetail(null)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-200/80 dark:divide-[#1A314D] border border-slate-200/80 dark:border-[#1A314D] rounded-xl bg-slate-50 dark:bg-[#071220] text-xs">
              <div className="p-3.5 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Horario</span>
                <div className="font-bold text-[#0B1A2D] dark:text-white font-mono tabular-nums">
                  {selectedMatchForDetail.startTime.split('T')[0]} · {selectedMatchForDetail.startTime.split('T')[1]?.slice(0, 5)} h
                </div>
                <span className="text-[11px] text-slate-500 font-mono tabular-nums">Duración: {selectedMatchForDetail.durationMinutes} min</span>
              </div>

              <div className="p-3.5 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Nivel ELO</span>
                <div className="font-mono tabular-nums font-bold text-[#8B5CF6] dark:text-[#a78bfa] text-sm">
                  {selectedMatchForDetail.minLevel.toFixed(2)} – {selectedMatchForDetail.maxLevel.toFixed(2)}
                </div>
                <span className="text-[11px] text-slate-500">Partida nivelada</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between font-semibold text-[#0B1A2D] dark:text-slate-200">
                <span>Jugadores en la partida ({selectedMatchForDetail.players.length}/4)</span>
                <span className="text-slate-400 text-[11px]">Cobro individual 1/4</span>
              </div>

              <div className="divide-y divide-slate-200/80 dark:divide-[#1A314D] border border-slate-200/80 dark:border-[#1A314D] rounded-xl overflow-hidden">
                {selectedMatchForDetail.players.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white dark:bg-[#071220] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D] font-bold text-xs flex items-center justify-center">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong className="block font-semibold text-[#0B1A2D] dark:text-white text-xs">
                          {p.name} {p.name === currentUser.name ? '(Tú)' : ''}
                        </strong>
                        <span className="text-[11px] text-slate-500">
                          {p.position === 'drive' ? 'Drive' : p.position === 'reves' ? 'Revés' : 'Ambos lados'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="font-mono tabular-nums font-bold text-xs text-[#0B1A2D] dark:text-slate-200">
                        Niv {p.level.toFixed(2)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        p.paid
                          ? 'bg-[#B7F229] text-[#0B1A2D]'
                          : 'bg-[#8B5CF6]/15 text-[#8B5CF6] dark:text-[#a78bfa]'
                      }`}>
                        {p.paid ? 'Pagado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071220] text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#0B1A2D] dark:text-white">
                <Lock className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#a78bfa]" />
                <span>Acceso Domótico Setmio</span>
              </div>
              <p className="text-[11px]">
                PIN de acceso activo 10 minutos antes. La domótica encenderá los focos LED automáticamente.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleCopyMatchLink(selectedMatchForDetail.id)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-[#132A45] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copiar Enlace</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMatchForDetail(null)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D] font-bold text-xs hover:opacity-90 transition cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE OPEN MATCH */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071220]/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-6 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-[#1A314D] pb-3.5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#0B1A2D] dark:text-white">
                  Publicar Partida Abierta Play!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reserva la pista para 4 jugadores con cobro dividido a 1/4.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0B1A2D] dark:text-slate-200 mb-1.5">
                  Pista de Pádel
                </label>
                <select
                  value={selectedCourtId}
                  onChange={(e) => setSelectedCourtId(e.target.value)}
                  className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6] font-semibold"
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
                  <label className="block font-semibold text-[#0B1A2D] dark:text-slate-200 mb-1.5">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white font-mono tabular-nums font-semibold focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0B1A2D] dark:text-slate-200 mb-1.5">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    required
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white font-mono tabular-nums font-semibold focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0B1A2D] dark:text-slate-200 mb-1.5">
                    Nivel Mínimo (ELO)
                  </label>
                  <select
                    value={minLevel}
                    onChange={(e) => setMinLevel(parseFloat(e.target.value))}
                    className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white font-mono tabular-nums font-semibold focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                  >
                    {ELO_SCALE.map((lvl) => (
                      <option key={`pub-min-${lvl}`} value={lvl}>
                        Nivel {lvl.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0B1A2D] dark:text-slate-200 mb-1.5">
                    Nivel Máximo (ELO)
                  </label>
                  <select
                    value={maxLevel}
                    onChange={(e) => setMaxLevel(parseFloat(e.target.value))}
                    className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white font-mono tabular-nums font-semibold focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                  >
                    {ELO_SCALE.map((lvl) => (
                      <option key={`pub-max-${lvl}`} value={lvl}>
                        Nivel {lvl.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#0B1A2D] dark:text-slate-200 mb-1.5">
                    Tu Posición
                  </label>
                  <select
                    value={creatorPosition}
                    onChange={(e) => setCreatorPosition(e.target.value as 'drive' | 'reves' | 'both')}
                    className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white font-semibold"
                  >
                    <option value="drive">Drive</option>
                    <option value="reves">Revés</option>
                    <option value="both">Ambos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#0B1A2D] dark:text-slate-200 mb-1.5">
                    Categoría
                  </label>
                  <select
                    value={matchGender}
                    onChange={(e) => setMatchGender(e.target.value as 'male' | 'female' | 'mixed')}
                    className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white font-semibold"
                  >
                    <option value="mixed">Mixta</option>
                    <option value="male">Masculina</option>
                    <option value="female">Femenina</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#0B1A2D] dark:text-slate-200 mb-1.5">
                    Precio (€)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1.0"
                    value={pricePerPlayer}
                    onChange={(e) => setPricePerPlayer(parseFloat(e.target.value))}
                    className="w-full min-h-[40px] bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-[#0B1A2D] dark:text-white font-mono tabular-nums font-semibold"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071220] text-[11px] text-slate-600 dark:text-slate-400">
                Al publicar, se bloquea la pista y se convoca a jugadores de tu nivel. Solo abonas tu cuota individual (<span className="font-mono tabular-nums font-semibold text-[#0B1A2D] dark:text-white">{pricePerPlayer.toFixed(2)} €</span>).
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#132A45] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-5 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition cursor-pointer"
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
