import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Trophy,
  Shield,
  Star,
  Activity,
  Calendar,
  Award,
  CheckCircle2,
  TrendingUp,
  Share2,
  Sparkles,
  Flame,
  Wallet,
  CreditCard,
  QrCode,
  Users,
  Swords,
  ChevronRight,
  Bell,
} from 'lucide-react';

interface PlayerProfileData {
  id: string;
  name: string;
  memberNum?: string;
  avatarUrl: string;
  level: number;
  levelHistory: { month: string; level: number }[];
  position: string;
  hand: string;
  racket: string;
  balance?: number;
  isMember?: boolean;
  matchesPlayed: number;
  matchesWon: number;
  winRate: number;
  currentStreak: string;
  bestStreak: string;
  frequentPartners?: {
    id: string;
    name: string;
    level: number;
    matchesTogether: number;
    avatarUrl: string;
  }[];
  headToHead?: {
    opponentName: string;
    wins: number;
    losses: number;
    matches: {
      date: string;
      result: 'win' | 'loss';
      score: string;
      court: string;
    }[];
  };
}

const PLAYERS_DIRECTORY: Record<string, PlayerProfileData> = {
  'user-player-carlos': {
    id: 'user-player-carlos',
    name: 'Carlos Méndez',
    memberNum: 'SM-408',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    level: 3.85,
    levelHistory: [
      { month: 'Jun', level: 3.50 },
      { month: 'Jul', level: 3.60 },
      { month: 'Ago', level: 3.70 },
      { month: 'Sep', level: 3.80 },
      { month: 'Oct', level: 3.85 },
    ],
    position: 'Revés',
    hand: 'Diestro',
    racket: 'Bullpadel Vertex 04 2026',
    balance: 24.50,
    isMember: true,
    matchesPlayed: 48,
    matchesWon: 33,
    winRate: 68,
    currentStreak: '+4 Victorias',
    bestStreak: '+6 Victorias',
    frequentPartners: [
      {
        id: 'mateo-varela',
        name: 'Mateo Varela',
        level: 4.10,
        matchesTogether: 14,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      {
        id: 'lucas-pineiro',
        name: 'Lucas Piñeiro',
        level: 3.85,
        matchesTogether: 9,
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      },
      {
        id: 'diego-soto',
        name: 'Diego Soto',
        level: 3.90,
        matchesTogether: 7,
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      },
    ],
  },
  'mateo-varela': {
    id: 'mateo-varela',
    name: 'Mateo Varela',
    memberNum: 'SM-201',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    level: 4.10,
    levelHistory: [
      { month: 'Jun', level: 3.95 },
      { month: 'Jul', level: 4.00 },
      { month: 'Ago', level: 4.05 },
      { month: 'Sep', level: 4.10 },
      { month: 'Oct', level: 4.10 },
    ],
    position: 'Drive',
    hand: 'Diestro',
    racket: 'Nox AT10 Genius 18K',
    matchesPlayed: 62,
    matchesWon: 45,
    winRate: 72,
    currentStreak: '+3 Victorias',
    bestStreak: '+8 Victorias',
    headToHead: {
      opponentName: 'Carlos Méndez',
      wins: 2,
      losses: 1,
      matches: [
        { date: '04 Oct 2026', result: 'win', score: '6-4, 7-5', court: 'Pista 1 (Panorámica WPT)' },
        { date: '21 Sep 2026', result: 'loss', score: '4-6, 5-7', court: 'Pista 3 (Indoor)' },
        { date: '08 Ago 2026', result: 'win', score: '6-2, 6-3', court: 'Pista 2 (Indoor Pro)' },
      ],
    },
  },
  'lucas-pineiro': {
    id: 'lucas-pineiro',
    name: 'Lucas Piñeiro',
    memberNum: 'SM-305',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    level: 3.85,
    levelHistory: [
      { month: 'Jun', level: 3.65 },
      { month: 'Jul', level: 3.70 },
      { month: 'Ago', level: 3.75 },
      { month: 'Sep', level: 3.80 },
      { month: 'Oct', level: 3.85 },
    ],
    position: 'Revés',
    hand: 'Zurdo',
    racket: 'Head Speed Pro X',
    matchesPlayed: 41,
    matchesWon: 27,
    winRate: 66,
    currentStreak: '+2 Victorias',
    bestStreak: '+5 Victorias',
    headToHead: {
      opponentName: 'Carlos Méndez',
      wins: 1,
      losses: 2,
      matches: [
        { date: '01 Oct 2026', result: 'loss', score: '3-6, 6-3, 6-7', court: 'Pista 3 (Indoor)' },
        { date: '14 Sep 2026', result: 'win', score: '7-5, 6-4', court: 'Pista 1 (Panorámica WPT)' },
        { date: '28 Jul 2026', result: 'loss', score: '2-6, 4-6', court: 'Pista 4 (Outdoor)' },
      ],
    },
  },
  'diego-soto': {
    id: 'diego-soto',
    name: 'Diego Soto',
    memberNum: 'SM-409',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    level: 3.90,
    levelHistory: [
      { month: 'Jun', level: 3.70 },
      { month: 'Jul', level: 3.75 },
      { month: 'Ago', level: 3.85 },
      { month: 'Sep', level: 3.90 },
      { month: 'Oct', level: 3.90 },
    ],
    position: 'Drive',
    hand: 'Zurdo',
    racket: 'Babolat Technical Viper',
    matchesPlayed: 35,
    matchesWon: 25,
    winRate: 71,
    currentStreak: '+4 Victorias',
    bestStreak: '+6 Victorias',
    headToHead: {
      opponentName: 'Carlos Méndez',
      wins: 1,
      losses: 1,
      matches: [
        { date: '24 Sep 2026', result: 'win', score: '6-2, 6-4', court: 'Pista 1 (Panorámica WPT)' },
        { date: '12 Ago 2026', result: 'loss', score: '3-6, 5-7', court: 'Pista 2 (Indoor Pro)' },
      ],
    },
  },
};

interface PlayerPublicProfileViewProps {
  playerId?: string;
  onBack?: () => void;
  onOpenNotifications?: () => void;
}

export const PlayerPublicProfileView: React.FC<PlayerPublicProfileViewProps> = ({
  playerId,
  onBack,
  onOpenNotifications,
}) => {
  const { currentTenant, triggerDemoToast, currentUser } = useApp();

  const [activePlayerId, setActivePlayerId] = useState<string>(() => {
    return playerId || 'user-player-carlos';
  });

  // Check if viewing own profile
  const isSelf = activePlayerId === 'user-player-carlos' || activePlayerId === currentUser.id;
  const player = PLAYERS_DIRECTORY[activePlayerId] || PLAYERS_DIRECTORY['user-player-carlos'];

  const handleBack = () => {
    if (activePlayerId !== 'user-player-carlos' && !playerId) {
      setActivePlayerId('user-player-carlos');
      return;
    }
    try {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        window.history.back();
      } else if (onBack) {
        onBack();
      }
    } catch {
      onBack?.();
    }
  };

  const handleShare = () => {
    triggerDemoToast(
      'Enlace Copiado',
      `Ficha deportiva de ${player.name} copiada al portapapeles.`,
      'info'
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* 1. TOP NAVIGATION WITH UNIVERSAL BACK BUTTON */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenNotifications && (
            <button
              type="button"
              onClick={onOpenNotifications}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold transition cursor-pointer active:scale-95 shadow-2xs"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Preferencias de Avisos</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition cursor-pointer active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Compartir Ficha</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* 2. HERO CARD: Diseño prémium centrado con avatar destacado */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.18),transparent_60%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 text-center md:text-left">
          <div className="relative shrink-0">
            <img
              src={player.avatarUrl}
              alt={player.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-emerald-500/40 shadow-2xl"
            />
            {player.memberNum && isSelf && (
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase ring-2 ring-slate-900">
                Socio #{player.memberNum}
              </span>
            )}
          </div>

          <div className="flex-1 space-y-2.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                Nivel Oficial {player.level.toFixed(2)}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
                {currentTenant.name}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[11px] font-semibold">
                Ficha Federada
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {player.name}
            </h1>

            {/* Estilo de juego público */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" /> Posición: <strong>{player.position}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" /> Mano: <strong>{player.hand}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Pala: <strong>{player.racket}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VISTA A: PROPIO JUGADOR (MI PERFIL - Requerimiento 6.B) */}
      {isSelf && (
        <>
          {/* Tarjeta de Socio Digital & Saldo Monedero */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Saldo de Monedero */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                  Saldo en Monedero
                </span>
                <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  {(player.balance || 24.50).toFixed(2)} €
                </div>
                <span className="text-[11px] text-slate-400">Activo para reservas y consumiciones</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Wallet className="w-7 h-7" />
              </div>
            </div>

            {/* Tarjeta de Socio Digital */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-700 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>Carnet de Socio Setmio Pádel</span>
                </div>
                <div className="text-lg font-black text-white">{player.name}</div>
                <div className="text-xs text-slate-300 font-mono">
                  Socio #{player.memberNum} · Temporada 2026
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white text-slate-900 shrink-0">
                <QrCode className="w-10 h-10" />
              </div>
            </div>
          </div>

          {/* Gráficos e Indicadores / Widgets Prémium (Requerimiento 6.B) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Widget 1: Evolución de Nivel */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Evolución de Nivel FEP
                </span>
                <span className="text-xs font-bold font-mono text-emerald-500 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                  +0.35 pts
                </span>
              </div>

              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {player.level.toFixed(2)}
              </div>

              {/* Mini gráfico de barras de evolución */}
              <div className="flex items-end justify-between gap-2 pt-2 h-16">
                {player.levelHistory.map((pt, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-md bg-emerald-500/80 hover:bg-emerald-400 transition"
                      style={{ height: `${((pt.level - 3.0) / 1.5) * 100}%` }}
                    />
                    <span className="text-[10px] text-slate-400 font-mono">{pt.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 2: Porcentaje de Victorias */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Porcentaje de Victorias
                </span>
                <Award className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {player.winRate}%
              </div>

              <div className="space-y-1.5">
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                  <div className="bg-emerald-500 h-full" style={{ width: `${player.winRate}%` }} />
                  <div className="bg-slate-300 dark:bg-slate-700 h-full flex-1" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>{player.matchesWon} Victorias</span>
                  <span>{player.matchesPlayed - player.matchesWon} Derrotas</span>
                </div>
              </div>
            </div>

            {/* Widget 3: Racha Actual */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Racha Actual
                </span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>

              <div className="text-2xl font-black text-amber-500 flex items-center gap-2">
                <span>{player.currentStreak}</span>
                <Flame className="w-6 h-6 text-amber-500 animate-bounce" />
              </div>

              <p className="text-[11px] text-slate-500">
                Mejor racha de temporada: <strong className="text-slate-800 dark:text-slate-200">{player.bestStreak}</strong>. Victorias consecutivas en liga social.
              </p>
            </div>
          </div>

          {/* Compañeros Habituales (Requerimiento 6.B: Navega a su perfil al pulsar) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Compañeros Habituales
                </h3>
              </div>
              <span className="text-xs text-slate-500">Toca sobre un compañero para ver su perfil</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {player.frequentPartners?.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePlayerId(p.id)}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/50 text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Nivel {p.level.toFixed(2)} · {p.matchesTogether} partidas
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* VISTA C: OTRO JUGADOR (PERFIL PÚBLICO / RIVAL - Requerimiento 6.C) */}
      {!isSelf && (
        <div className="space-y-6">
          {/* Estadísticas Públicas (Sin datos financieros, ni teléfono, ni monedero) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Partidos Jugados</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {player.matchesPlayed}
              </div>
              <span className="text-[10px] text-slate-400">Temporada Oficial</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">% Victorias</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {player.winRate}%
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{player.matchesWon} victorias</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Racha</div>
              <div className="text-xl sm:text-2xl font-black text-amber-500 mt-1">
                {player.currentStreak}
              </div>
              <span className="text-[10px] text-slate-400">En activo</span>
            </div>
          </div>

          {/* Historial de Enfrentamientos Mutuos (Head-to-head - Requerimiento 6.C) */}
          {player.headToHead && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Swords className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Historial de Enfrentamientos Mutuos (Cara a Cara)
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                  {player.headToHead.wins}V - {player.headToHead.losses}D vs {player.headToHead.opponentName}
                </span>
              </div>

              <div className="space-y-2.5">
                {player.headToHead.matches.map((match, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${match.result === 'win' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                          {match.result === 'win' ? 'Victoria' : 'Derrota'}
                        </span>
                        <span className="font-mono">{match.score}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {match.date} · {match.court}
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Partido Oficial Club
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default PlayerPublicProfileView;
