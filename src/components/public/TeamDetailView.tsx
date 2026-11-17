import React from 'react';
import { useApp } from '../../context/AppContext';
import { ClubTeam, ClubTeamPlayer } from '../../types/database';
import heroPadelImg from '../../assets/images/hero_padel_club_1794872242820.jpg';
import {
  ArrowLeft,
  Users,
  Star,
  ChevronRight,
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
    photoUrl: heroPadelImg,
    matchesWon: 8,
    matchesPlayed: 10,
    nextMatch: {
      opponent: 'Club de Campo Ferrol',
      date: '12 de Octubre, 2026',
      time: '11:00',
      location: 'Pistas Centrales San Mateo',
    },
    players: [
      { id: 'p1', name: 'Mateo Varela', level: 5.5, hand: 'diestro', position: 'reves', avatarUrl: '' },
      { id: 'p2', name: 'Carlos Méndez', level: 4.85, hand: 'diestro', position: 'drive', avatarUrl: '' },
      { id: 'p3', name: 'Diego Soto', level: 4.5, hand: 'zurdo', position: 'drive', avatarUrl: '' },
      { id: 'p4', name: 'Rubén Loureiro', level: 4.75, hand: 'diestro', position: 'reves', avatarUrl: '' },
      { id: 'p5', name: 'Javier Fraga', level: 4.25, hand: 'diestro', position: 'ambas', avatarUrl: '' },
      { id: 'p6', name: 'Adrián Pena', level: 4.0, hand: 'diestro', position: 'drive', avatarUrl: '' },
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 animate-in fade-in duration-200">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-slate-200 hover:border-[#0B1A2D] dark:hover:border-[#B7F229] font-semibold text-xs transition cursor-pointer"
          aria-label="Volver al listado de equipos"
        >
          <ArrowLeft className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
          <span>Volver a Equipos</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* Team Hero */}
        <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D]">
          <div className="relative h-72 sm:h-88 w-full bg-[#071220]">
            <img
              src={team.photoUrl}
              alt={team.name}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071220] via-[#071220]/45 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-0.5 rounded-md bg-[#B7F229] text-[#0B1A2D] font-bold uppercase tracking-wider">
                  {team.category}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-200">{team.division}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {team.name}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm">
                Entrenadora: <strong className="text-white">{team.coach}</strong> · Capitanía Oficial: <strong className="text-white">{team.captain}</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:divide-[#1A314D] border-t border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] text-center text-xs">
            <div className="p-5">
              <div className="text-slate-500 dark:text-slate-400">Victorias</div>
              <div className="text-2xl font-extrabold text-[#0B1A2D] dark:text-[#B7F229] font-mono tabular-nums mt-0.5">
                {team.matchesWon} / {team.matchesPlayed}
              </div>
              <div className="text-[10px] font-mono tabular-nums text-[#8B5CF6] dark:text-[#a78bfa]">80% efectividad</div>
            </div>
            <div className="p-5">
              <div className="text-slate-500 dark:text-slate-400">Plantilla</div>
              <div className="text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums mt-0.5">
                {team.players.length} Jugadores
              </div>
              <div className="text-[10px] text-slate-400">Convocatoria activa</div>
            </div>
            <div className="p-5">
              <div className="text-slate-500 dark:text-slate-400">Capitán</div>
              <div className="text-base font-bold text-[#0B1A2D] dark:text-white mt-1 truncate">
                {team.captain}
              </div>
              <div className="text-[10px] text-[#8B5CF6] dark:text-[#a78bfa]">Líder en pista</div>
            </div>
            <div className="p-5">
              <div className="text-slate-500 dark:text-slate-400">Club Sede</div>
              <div className="text-base font-bold text-[#0B1A2D] dark:text-white mt-1 truncate">
                {currentTenant.name}
              </div>
              <div className="text-[10px] text-slate-400">{currentTenant.city}</div>
            </div>
          </div>
        </div>

        {/* Captain Banner */}
        <div className="p-6 rounded-2xl bg-[#0B1A2D] border border-[#1A314D] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#B7F229] text-[#0B1A2D] flex items-center justify-center shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#B7F229]">Figura de Capitanía</span>
              <h3 className="text-lg font-bold text-white">{team.captain}</h3>
              <p className="text-xs text-slate-300">
                Responsable de actas oficiales, sorteo de pista y convocatorias del equipo ante la Federación.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPublicPage('player_profile')}
            className="min-h-[40px] px-5 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition shrink-0 cursor-pointer"
          >
            Ver Ficha del Capitán
          </button>
        </div>

        {/* Roster Grid */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-2xl font-extrabold text-[#0B1A2D] dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#8B5CF6] dark:text-[#a78bfa]" />
              <span>Plantilla de Jugadores Convocados</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Pulsa en un jugador para abrir su ficha pública
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.players.map((player) => {
              const isCaptain = player.name.includes(team.captain) || player.name.includes('Capitán');
              const initials = player.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')
                .toUpperCase();
              return (
                <div
                  key={player.id}
                  onClick={() => handlePlayerClick(player)}
                  className="group cursor-pointer p-4 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D] dark:hover:border-[#B7F229] transition flex items-center gap-3.5"
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] text-[#B7F229] dark:text-[#0B1A2D] font-bold text-sm flex items-center justify-center">
                      {initials}
                    </div>
                    {isCaptain && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center">
                        <Star className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 text-xs">
                    <div className="font-bold text-[#0B1A2D] dark:text-white truncate text-sm">
                      {player.name}
                    </div>
                    <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 mt-0.5">
                      Nivel {player.level.toFixed(2)} · {player.position.toUpperCase()}
                    </div>
                    <div className="text-[10px] text-[#8B5CF6] dark:text-[#a78bfa] font-semibold capitalize mt-0.5">
                      Mano: {player.hand}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B1A2D] dark:group-hover:text-[#B7F229] transition shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
