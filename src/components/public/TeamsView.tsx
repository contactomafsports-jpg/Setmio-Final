import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClubTeam } from '../../types/database';
import heroPadelImg from '../../assets/images/hero_padel_club_1794872242820.jpg';
import playerPadelImg from '../../assets/images/player_padel_action_1794872242959.jpg';
import {
  Users,
  Calendar,
  Shield,
  ArrowLeft,
  MapPin,
  Clock,
  ChevronRight,
} from 'lucide-react';

const DEMO_TEAMS: ClubTeam[] = [
  {
    id: 'team-masculino-1',
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
      { id: 'p1', name: 'Mateo Varela (Capitán)', level: 5.5, hand: 'diestro', position: 'reves', avatarUrl: '' },
      { id: 'p2', name: 'Carlos Méndez', level: 4.85, hand: 'diestro', position: 'drive', avatarUrl: '' },
      { id: 'p3', name: 'Diego Soto', level: 4.5, hand: 'zurdo', position: 'drive', avatarUrl: '' },
      { id: 'p4', name: 'Rubén Loureiro', level: 4.75, hand: 'diestro', position: 'reves', avatarUrl: '' },
      { id: 'p5', name: 'Javier Fraga', level: 4.25, hand: 'diestro', position: 'ambas', avatarUrl: '' },
      { id: 'p6', name: 'Adrián Pena', level: 4.0, hand: 'diestro', position: 'drive', avatarUrl: '' },
    ],
  },
  {
    id: 'team-femenino-1',
    name: 'Pádel San Mateo - Absoluto Femenino A',
    category: '1ª Categoría Gallega',
    gender: 'femenino',
    division: 'Liga Federación Gallega de Pádel',
    coach: 'Laura Senra',
    captain: 'Rosa Carballo',
    photoUrl: playerPadelImg,
    matchesWon: 7,
    matchesPlayed: 8,
    nextMatch: {
      opponent: 'Pádel Coruña Norte',
      date: '18 de Octubre, 2026',
      time: '17:30',
      location: 'Complejo Narón Pistas 1 y 2',
    },
    players: [
      { id: 'pf1', name: 'Rosa Carballo (Capitana)', level: 4.5, hand: 'diestro', position: 'reves', avatarUrl: '' },
      { id: 'pf2', name: 'Laura Senra', level: 5.0, hand: 'diestro', position: 'reves', avatarUrl: '' },
      { id: 'pf3', name: 'Ana Belén Vázquez', level: 4.0, hand: 'diestro', position: 'drive', avatarUrl: '' },
      { id: 'pf4', name: 'Elena Permuy', level: 3.8, hand: 'zurdo', position: 'drive', avatarUrl: '' },
      { id: 'pf5', name: 'Lucía Blanco', level: 3.75, hand: 'diestro', position: 'ambas', avatarUrl: '' },
      { id: 'pf6', name: 'Sara Morales', level: 3.5, hand: 'diestro', position: 'drive', avatarUrl: '' },
    ],
  },
  {
    id: 'team-veteranos-1',
    name: 'Pádel San Mateo - Veteranos +40',
    category: 'Liga Interclubes Senior',
    gender: 'masculino',
    division: 'Circuito Veteranos Galicia',
    coach: 'Iván Gómez',
    captain: 'Nacho Castro',
    photoUrl: heroPadelImg,
    matchesWon: 5,
    matchesPlayed: 6,
    nextMatch: {
      opponent: 'Veteranos Ferrolterra',
      date: '25 de Octubre, 2026',
      time: '19:00',
      location: 'Pistas Centrales San Mateo',
    },
    players: [
      { id: 'pv1', name: 'Nacho Castro (Capitán)', level: 4.25, hand: 'diestro', position: 'drive', avatarUrl: '' },
      { id: 'pv2', name: 'Manuel Barreiro', level: 4.0, hand: 'diestro', position: 'reves', avatarUrl: '' },
      { id: 'pv3', name: 'Gonzalo Fandiño', level: 3.75, hand: 'zurdo', position: 'drive', avatarUrl: '' },
      { id: 'pv4', name: 'Alberto Dopico', level: 3.9, hand: 'diestro', position: 'reves', avatarUrl: '' },
    ],
  },
  {
    id: 'team-menores-1',
    name: 'Pádel San Mateo - Escuela Promesas Junior',
    category: 'Circuito Menores Sub-16',
    gender: 'menores',
    division: 'Competición Escolar FGP',
    coach: 'Laura Senra',
    captain: 'Lucas Rey Jr.',
    photoUrl: playerPadelImg,
    matchesWon: 6,
    matchesPlayed: 7,
    nextMatch: {
      opponent: 'Academia Galega Promesas',
      date: '2 de Noviembre, 2026',
      time: '10:30',
      location: 'Pistas Indoor 3 y 4',
    },
    players: [
      { id: 'pm1', name: 'Lucas Rey Jr. (Capitán)', level: 3.5, hand: 'diestro', position: 'drive', avatarUrl: '' },
      { id: 'pm2', name: 'Martín Permuy', level: 3.25, hand: 'diestro', position: 'reves', avatarUrl: '' },
      { id: 'pm3', name: 'Paula Méndez', level: 3.0, hand: 'zurdo', position: 'ambas', avatarUrl: '' },
      { id: 'pm4', name: 'Daniela Soto', level: 3.1, hand: 'diestro', position: 'reves', avatarUrl: '' },
    ],
  },
];

export const TeamsView: React.FC = () => {
  const { currentTenant } = useApp();
  const [selectedGender, setSelectedGender] = useState<'all' | 'masculino' | 'femenino' | 'menores'>('all');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const selectedTeam = DEMO_TEAMS.find((t) => t.id === selectedTeamId);

  const filteredTeams = DEMO_TEAMS.filter((team) => {
    if (selectedGender === 'all') return true;
    return team.gender === selectedGender;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10 text-[#0B1A2D] dark:text-slate-100 transition-colors duration-200">
      {selectedTeam ? (
        <section className="animate-in fade-in duration-150 max-w-5xl mx-auto space-y-8">
          <div>
            <button
              type="button"
              onClick={() => setSelectedTeamId(null)}
              className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:bg-slate-50 dark:hover:bg-[#132A45] text-xs font-semibold text-[#0B1A2D] dark:text-slate-200 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
              <span>Volver a Equipos del Club</span>
            </button>
          </div>

          {/* Team Detail Hero Card */}
          <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-[#1A314D] bg-white dark:bg-[#0E2239]">
            <div className="relative h-72 sm:h-88 w-full overflow-hidden bg-[#071220]">
              <img
                src={selectedTeam.photoUrl}
                alt={selectedTeam.name}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071220] via-[#071220]/45 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B7F229] uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{selectedTeam.category}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{selectedTeam.name}</h1>
                <p className="text-slate-300 text-xs sm:text-sm">
                  {selectedTeam.division} · Capitanía: <strong className="text-white">{selectedTeam.captain}</strong> · Entrenador: <strong className="text-white">{selectedTeam.coach}</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-200/80 dark:divide-[#1A314D] border-t border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] p-5 text-center text-xs">
              <div>
                <div className="text-slate-500 dark:text-slate-400">Victorias</div>
                <div className="text-lg font-extrabold text-[#0B1A2D] dark:text-[#B7F229] font-mono tabular-nums mt-0.5">
                  {selectedTeam.matchesWon} / {selectedTeam.matchesPlayed}
                </div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400">Plantilla</div>
                <div className="text-lg font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums mt-0.5">
                  {selectedTeam.players.length} Jugadores
                </div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400">Club</div>
                <div className="text-lg font-extrabold text-[#0B1A2D] dark:text-white truncate mt-0.5">
                  {currentTenant.shortName}
                </div>
              </div>
            </div>
          </div>

          {/* Next Match Banner */}
          {selectedTeam.nextMatch && (
            <div className="p-6 rounded-2xl bg-[#0B1A2D] border border-[#1A314D] text-white space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#B7F229] uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Próximo Encuentro de Liga</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">vs {selectedTeam.nextMatch.opponent}</h3>
                  <div className="text-xs text-slate-300 flex flex-wrap items-center gap-4 mt-1.5">
                    <span className="flex items-center gap-1.5 font-mono tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-[#B7F229]" />
                      {selectedTeam.nextMatch.date} · {selectedTeam.nextMatch.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B7F229]" />
                      {selectedTeam.nextMatch.location}
                    </span>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-lg bg-[#B7F229] text-[#0B1A2D] text-xs font-bold self-start sm:self-auto">
                  Entrada Libre
                </span>
              </div>
            </div>
          )}

          {/* Players Roster */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#8B5CF6] dark:text-[#a78bfa]" />
              <span>Plantilla de Jugadores (<span className="font-mono tabular-nums">{selectedTeam.players.length}</span>)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedTeam.players.map((player) => {
                const initials = player.name
                  .split(' ')
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase();
                return (
                  <div
                    key={player.id}
                    className="p-4 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] flex items-center gap-3.5"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] text-[#B7F229] dark:text-[#0B1A2D] font-bold text-sm flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="font-bold text-[#0B1A2D] dark:text-white truncate">{player.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono tabular-nums">
                        Nivel {player.level.toFixed(2)} · {player.position.toUpperCase()}
                      </div>
                      <div className="text-[10px] text-[#8B5CF6] dark:text-[#a78bfa] font-medium capitalize mt-0.5">
                        Mano: {player.hand}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <div className="text-xs font-mono text-[#8B5CF6] dark:text-[#a78bfa] uppercase tracking-[0.14em]">
                Competición Federada e Interclubes
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight">
                Equipos Oficiales de {currentTenant.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Nuestros equipos defienden los colores del club en las ligas federadas e interclubes en todas las categorías.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-xl self-start md:self-auto">
              {(['all', 'masculino', 'femenino', 'menores'] as const).map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => setSelectedGender(gender)}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                    selectedGender === gender
                      ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                  }`}
                >
                  {gender === 'all' ? 'Todos' : gender}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                onClick={() => {
                  setSelectedTeamId(team.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D] dark:hover:border-[#B7F229] transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-[#071220]">
                    <img
                      src={team.photoUrl}
                      alt={team.name}
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071220] via-[#071220]/30 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#B7F229] text-[#0B1A2D] font-bold text-[10px] uppercase tracking-wider">
                        {team.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-5 right-5 text-white">
                      <h3 className="text-xl font-bold text-white">
                        {team.name}
                      </h3>
                      <div className="text-xs text-slate-300 mt-0.5">{team.division}</div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                      <div>Capitanía: <strong className="text-[#0B1A2D] dark:text-white">{team.captain}</strong></div>
                      <div>Entrenador: <strong className="text-[#0B1A2D] dark:text-white">{team.coach}</strong></div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-[#1A314D] text-[11px] font-mono tabular-nums">
                      <span className="text-[#8B5CF6] dark:text-[#a78bfa] font-semibold">
                        {team.players.length} jugadores convocados
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {team.matchesWon}V / {team.matchesPlayed}PJ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-[#071220] border-t border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                  <span>Ver plantilla completa y partidos</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
