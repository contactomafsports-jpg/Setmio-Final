import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import playerPadelImg from '../../assets/images/player_padel_action_1794872242959.jpg';
import {
  ArrowLeft,
  Shield,
  Activity,
  Award,
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
    avatarUrl: playerPadelImg,
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
      },
      {
        id: 'lucas-pineiro',
        name: 'Lucas Piñeiro',
        level: 3.85,
        matchesTogether: 9,
      },
      {
        id: 'diego-soto',
        name: 'Diego Soto',
        level: 3.90,
        matchesTogether: 7,
      },
    ],
  },
  'mateo-varela': {
    id: 'mateo-varela',
    name: 'Mateo Varela',
    memberNum: 'SM-201',
    avatarUrl: playerPadelImg,
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
    avatarUrl: playerPadelImg,
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
    avatarUrl: playerPadelImg,
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-slate-200 hover:border-[#0B1A2D] dark:hover:border-[#B7F229] font-semibold text-xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
          <span>Volver</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenNotifications && (
            <button
              type="button"
              onClick={onOpenNotifications}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0E2239] hover:bg-slate-50 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-slate-200 border border-slate-200/80 dark:border-[#1A314D] text-xs font-semibold transition cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#a78bfa]" />
              <span>Preferencias de Avisos</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D] text-xs font-bold transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartir Ficha</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Hero Card */}
        <div className="rounded-2xl overflow-hidden bg-[#0B1A2D] text-white border border-[#1A314D] p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 text-center md:text-left">
            <div className="relative shrink-0">
              <img
                src={player.avatarUrl}
                alt={player.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-[#B7F229]"
              />
              {player.memberNum && isSelf && (
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-md bg-[#B7F229] text-[#0B1A2D] font-mono font-bold text-[10px] tracking-wider uppercase">
                  #{player.memberNum}
                </span>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-md bg-[#B7F229] text-[#0B1A2D] font-bold tabular-nums">
                  Nivel {player.level.toFixed(2)}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-300">{currentTenant.name}</span>
                <span className="text-slate-300">·</span>
                <span className="text-[#a78bfa]">Ficha Federada</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {player.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-1 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#B7F229]" /> Posición: <strong className="text-white">{player.position}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#a78bfa]" /> Mano: <strong className="text-white">{player.hand}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#B7F229]" /> Pala: <strong className="text-white">{player.racket}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SELF VIEW */}
        {isSelf && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Saldo en Monedero
                  </span>
                  <div className="text-3xl font-extrabold font-mono tabular-nums text-[#0B1A2D] dark:text-[#B7F229] mt-1">
                    {(player.balance || 24.50).toFixed(2)} €
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Activo para reservas y tienda</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#071220] text-[#8B5CF6] dark:text-[#a78bfa]">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>

              <div className="md:col-span-2 p-5 rounded-2xl bg-[#0B1A2D] text-white border border-[#1A314D] flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs text-[#B7F229] font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    <span>Carnet de Socio Setmio</span>
                  </div>
                  <div className="text-lg font-bold text-white">{player.name}</div>
                  <div className="text-xs text-slate-300 font-mono tabular-nums">
                    Socio #{player.memberNum} · Temporada 2026
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white text-[#0B1A2D] shrink-0">
                  <QrCode className="w-10 h-10" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Evolución de Nivel
                  </span>
                  <span className="text-xs font-bold font-mono tabular-nums text-[#0B1A2D] bg-[#B7F229] px-2 py-0.5 rounded-md">
                    +0.35 pts
                  </span>
                </div>

                <div className="text-2xl font-extrabold font-mono tabular-nums text-[#0B1A2D] dark:text-white">
                  {player.level.toFixed(2)}
                </div>

                <div className="flex items-end justify-between gap-2 pt-2 h-16">
                  {player.levelHistory.map((pt, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md bg-[#0B1A2D] dark:bg-[#B7F229] transition"
                        style={{ height: `${Math.max(20, ((pt.level - 3.0) / 1.5) * 100)}%` }}
                      />
                      <span className="text-[10px] text-slate-400 font-mono">{pt.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Porcentaje de Victorias
                  </span>
                  <Award className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                </div>

                <div className="text-2xl font-extrabold font-mono tabular-nums text-[#0B1A2D] dark:text-[#B7F229]">
                  {player.winRate}%
                </div>

                <div className="space-y-2">
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#071220] overflow-hidden flex">
                    <div className="bg-[#0B1A2D] dark:bg-[#B7F229] h-full" style={{ width: `${player.winRate}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    <span>{player.matchesWon} Victorias</span>
                    <span>{player.matchesPlayed - player.matchesWon} Derrotas</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Racha Actual
                  </span>
                  <Flame className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                </div>

                <div className="text-2xl font-extrabold font-mono tabular-nums text-[#8B5CF6] dark:text-[#a78bfa]">
                  {player.currentStreak}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Mejor racha de temporada: <strong className="text-[#0B1A2D] dark:text-slate-200 font-mono">{player.bestStreak}</strong>.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#8B5CF6] dark:text-[#a78bfa]" />
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                    Compañeros Habituales
                  </h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Pulsa sobre un compañero para ver su ficha</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {player.frequentPartners?.map((p) => {
                  const initials = p.name
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActivePlayerId(p.id)}
                      className="min-h-[60px] p-3.5 rounded-xl bg-slate-50 dark:bg-[#071220] hover:border-[#0B1A2D] dark:hover:border-[#B7F229] border border-slate-200/80 dark:border-[#1A314D] text-left transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] text-[#B7F229] dark:text-[#0B1A2D] font-bold text-xs flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-[#0B1A2D] dark:text-white truncate">
                            {p.name}
                          </div>
                          <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                            Niv {p.level.toFixed(2)} · {p.matchesTogether} partidos
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B1A2D] dark:group-hover:text-[#B7F229] transition shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* OTHER PLAYER VIEW */}
        {!isSelf && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 divide-x divide-slate-200/80 dark:divide-[#1A314D] rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D]">
              <div className="p-5 text-center">
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Partidos</div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#0B1A2D] dark:text-white mt-1">
                  {player.matchesPlayed}
                </div>
                <span className="text-[10px] text-slate-400">Temporada Oficial</span>
              </div>

              <div className="p-5 text-center">
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">% Victorias</div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#0B1A2D] dark:text-[#B7F229] mt-1">
                  {player.winRate}%
                </div>
                <span className="text-[10px] font-mono tabular-nums text-[#8B5CF6] dark:text-[#a78bfa] font-semibold">
                  {player.matchesWon} victorias
                </span>
              </div>

              <div className="p-5 text-center">
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Racha</div>
                <div className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-[#8B5CF6] dark:text-[#a78bfa] mt-1">
                  {player.currentStreak}
                </div>
                <span className="text-[10px] text-slate-400">En activo</span>
              </div>
            </div>

            {player.headToHead && (
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-[#1A314D] pb-3.5">
                  <div className="flex items-center gap-2">
                    <Swords className="w-5 h-5 text-[#8B5CF6] dark:text-[#a78bfa]" />
                    <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                      Historial Cara a Cara
                    </h3>
                  </div>
                  <span className="text-xs font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                    {player.headToHead.wins}V - {player.headToHead.losses}D vs {player.headToHead.opponentName}
                  </span>
                </div>

                <div className="divide-y divide-slate-200/80 dark:divide-[#1A314D] border border-slate-200/80 dark:border-[#1A314D] rounded-xl overflow-hidden">
                  {player.headToHead.matches.map((match, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 dark:bg-[#071220] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              match.result === 'win'
                                ? 'bg-[#B7F229] text-[#0B1A2D]'
                                : 'bg-slate-200 text-slate-700 dark:bg-[#132A45] dark:text-slate-300'
                            }`}
                          >
                            {match.result === 'win' ? 'Victoria' : 'Derrota'}
                          </span>
                          <span className="font-mono tabular-nums">{match.score}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono tabular-nums">
                          {match.date} · {match.court}
                        </div>
                      </div>

                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        Oficial Club
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
