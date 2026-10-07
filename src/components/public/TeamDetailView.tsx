import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClubTeam, ClubTeamPlayer } from '../../types/database';
import {
  ArrowLeft,
  Users,
  Trophy,
  Calendar,
  Shield,
  Star,
  Clock,
  MapPin,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface TeamDetailViewProps {
  teamId?: string;
  onBack?: () => void;
  onSelectPlayer?: (playerId: string) => void;
}

export const TeamDetailView: React.FC<TeamDetailViewProps> = ({
  teamId,
  onBack,
  onSelectPlayer,
}) => {
  const { currentTenant, setPublicPage } = useApp();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setPublicPage('teams');
    }
  };

  const team: ClubTeam = {
    id: teamId || 'team-masculino-1',
    name: 'Pádel San Mateo - Absoluto Masculino A',
    category: '1ª Categoría Gallega',
    gender: 'masculino',
    division: 'División de Honor FGP',
    coach: 'Laura Senra',
    captain: 'Mateo Varela',
    photoUrl: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1200&q=80',
    matchesWon: 8,
    matchesPlayed: 10,
    nextMatch: {
      opponent: 'Club de Campo Ferrol',
      date: '12 de Octubre, 2026',
      time: '11:00',
      location: 'Pistas Centrales San Mateo',
    },
    players: [
      { id: 'p1', name: 'Mateo Varela', level: 5.5, hand: 'diestro', position: 'reves', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { id: 'p2', name: 'Carlos Méndez', level: 4.85, hand: 'diestro', position: 'drive', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' },
      { id: 'p3', name: 'Diego Soto', level: 4.5, hand: 'zurdo', position: 'drive', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { id: 'p4', name: 'Rubén Loureiro', level: 4.75, hand: 'diestro', position: 'reves', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
      { id: 'p5', name: 'Javier Fraga', level: 4.25, hand: 'diestro', position: 'ambas', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80' },
      { id: 'p6', name: 'Adrián Pena', level: 4.0, hand: 'diestro', position: 'drive', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
    ],
  };

  const handlePlayerClick = (p: ClubTeamPlayer) => {
    if (onSelectPlayer) {
      onSelectPlayer(p.id);
    } else {
      setPublicPage('player_profile');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* 1. TOP BAR WITH BACK BUTTON */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
          aria-label="Volver al listado de equipos"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Equipos</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* 2. TEAM HERO */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="relative h-72 sm:h-96 w-full">
          <img
            src={team.photoUrl}
            alt={team.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500 font-bold text-xs uppercase tracking-wider">
                {team.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/80 text-slate-200 border border-slate-700 text-xs font-semibold">
                {team.division}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {team.name}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm">
              Entrenadora: <strong>{team.coach}</strong> · Capitanía Oficial: <strong>{team.captain}</strong>
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 text-center text-xs">
          <div className="border-r border-slate-200 dark:border-slate-800 last:border-r-0">
            <div className="text-slate-500 dark:text-slate-400">Victorias</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              {team.matchesWon} / {team.matchesPlayed}
            </div>
            <div className="text-[10px] text-emerald-600">80% efectividad</div>
          </div>
          <div className="border-r border-slate-200 dark:border-slate-800 last:border-r-0">
            <div className="text-slate-500 dark:text-slate-400">Plantilla</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
              {team.players.length} Jugadores
            </div>
            <div className="text-[10px] text-slate-400">Convocatoria activa</div>
          </div>
          <div className="border-r border-slate-200 dark:border-slate-800 last:border-r-0">
            <div className="text-slate-500 dark:text-slate-400">Capitán</div>
            <div className="text-base font-black text-amber-500 mt-1 truncate">
              {team.captain}
            </div>
            <div className="text-[10px] text-amber-500">Líder en pista</div>
          </div>
          <div>
            <div className="text-slate-500 dark:text-slate-400">Club Sede</div>
            <div className="text-base font-black text-slate-900 dark:text-white mt-1 truncate">
              {currentTenant.name}
            </div>
            <div className="text-[10px] text-slate-400">{currentTenant.city}</div>
          </div>
        </div>
      </div>

      {/* 3. CAPITÁN HIGHLIGHT BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border border-amber-800/40 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Star className="w-7 h-7 fill-amber-400" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Figura de Capitanía</span>
            <h3 className="text-lg font-black text-white">{team.captain}</h3>
            <p className="text-xs text-slate-300">
              Responsable de actas oficiales, sorteo de pista y convocatorias del equipo ante la Federación Gallega de Pádel.
            </p>
          </div>
        </div>

        <button
          onClick={() => setPublicPage('player_profile')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shrink-0"
        >
          Ver Ficha del Capitán
        </button>
      </div>

      {/* 4. ROSTER GRID (Click opens independent public player profile) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Plantilla de Jugadores Convocados</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Haz clic en un jugador para abrir su perfil público completo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.players.map((player) => {
            const isCaptain = player.name.includes(team.captain) || player.name.includes('Capitán');
            return (
              <div
                key={player.id}
                onClick={() => handlePlayerClick(player)}
                className="group cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs hover:shadow-lg transition-all duration-200 flex items-center gap-3.5"
              >
                <div className="relative">
                  <img
                    src={player.avatarUrl}
                    alt={player.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/30 group-hover:scale-105 transition-transform"
                  />
                  {isCaptain && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow">
                      <Star className="w-3 h-3 fill-slate-950" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate text-sm">
                      {player.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Nivel FEP {player.level.toFixed(2)} · {player.position.toUpperCase()}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold capitalize mt-0.5">
                    Mano: {player.hand}
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
};
