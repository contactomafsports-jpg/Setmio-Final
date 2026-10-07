import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClubTeam, ClubTeamPlayer } from '../../types/database';
import {
  Users,
  Trophy,
  Calendar,
  Shield,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Award,
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
      { id: 'p1', name: 'Mateo Varela (Capitán)', level: 5.5, hand: 'diestro', position: 'reves', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { id: 'p2', name: 'Carlos Méndez', level: 4.85, hand: 'diestro', position: 'drive', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' },
      { id: 'p3', name: 'Diego Soto', level: 4.5, hand: 'zurdo', position: 'drive', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { id: 'p4', name: 'Rubén Loureiro', level: 4.75, hand: 'diestro', position: 'reves', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
      { id: 'p5', name: 'Javier Fraga', level: 4.25, hand: 'diestro', position: 'ambas', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80' },
      { id: 'p6', name: 'Adrián Pena', level: 4.0, hand: 'diestro', position: 'drive', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
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
    photoUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80',
    matchesWon: 7,
    matchesPlayed: 8,
    nextMatch: {
      opponent: 'Pádel Coruña Norte',
      date: '18 de Octubre, 2026',
      time: '17:30',
      location: 'Complejo Narón Pistas 1 y 2',
    },
    players: [
      { id: 'pf1', name: 'Rosa Carballo (Capitana)', level: 4.5, hand: 'diestro', position: 'reves', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
      { id: 'pf2', name: 'Laura Senra', level: 5.0, hand: 'diestro', position: 'reves', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80' },
      { id: 'pf3', name: 'Ana Belén Vázquez', level: 4.0, hand: 'diestro', position: 'drive', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { id: 'pf4', name: 'Elena Permuy', level: 3.8, hand: 'zurdo', position: 'drive', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
      { id: 'pf5', name: 'Lucía Blanco', level: 3.75, hand: 'diestro', position: 'ambas', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
      { id: 'pf6', name: 'Sara Morales', level: 3.5, hand: 'diestro', position: 'drive', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
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
    photoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    matchesWon: 5,
    matchesPlayed: 6,
    nextMatch: {
      opponent: 'Veteranos Ferrolterra',
      date: '25 de Octubre, 2026',
      time: '19:00',
      location: 'Pistas Centrales San Mateo',
    },
    players: [
      { id: 'pv1', name: 'Nacho Castro (Capitán)', level: 4.25, hand: 'diestro', position: 'drive', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { id: 'pv2', name: 'Manuel Barreiro', level: 4.0, hand: 'diestro', position: 'reves', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
      { id: 'pv3', name: 'Gonzalo Fandiño', level: 3.75, hand: 'zurdo', position: 'drive', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { id: 'pv4', name: 'Alberto Dopico', level: 3.9, hand: 'diestro', position: 'reves', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80' },
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
    photoUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    matchesWon: 6,
    matchesPlayed: 7,
    nextMatch: {
      opponent: 'Academia Galega Promesas',
      date: '2 de Noviembre, 2026',
      time: '10:30',
      location: 'Pistas Indoor 3 y 4',
    },
    players: [
      { id: 'pm1', name: 'Lucas Rey Jr. (Capitán)', level: 3.5, hand: 'diestro', position: 'drive', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' },
      { id: 'pm2', name: 'Martín Permuy', level: 3.25, hand: 'diestro', position: 'reves', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { id: 'pm3', name: 'Paula Méndez', level: 3.0, hand: 'zurdo', position: 'ambas', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
      { id: 'pm4', name: 'Daniela Soto', level: 3.1, hand: 'diestro', position: 'reves', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
    ],
  },
];

export const TeamsView: React.FC = () => {
  const { currentTenant, setPublicPage } = useApp();
  const [selectedGender, setSelectedGender] = useState<'all' | 'masculino' | 'femenino' | 'menores'>('all');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const selectedTeam = DEMO_TEAMS.find((t) => t.id === selectedTeamId);

  const filteredTeams = DEMO_TEAMS.filter((team) => {
    if (selectedGender === 'all') return true;
    return team.gender === selectedGender;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* If a team is selected -> Full dynamic page (No modal) */}
      {selectedTeam ? (
        <section className="animate-in fade-in duration-150 max-w-5xl mx-auto">
          {/* Aesthetic Back Button */}
          <div className="mb-4">
            <button
              onClick={() => setSelectedTeamId(null)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Volver a Equipos del Club</span>
            </button>
          </div>

          <div className="space-y-8">
            {/* Team Detail Hero Card */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
            <div className="relative h-72 sm:h-96 w-full overflow-hidden">
              <img
                src={selectedTeam.photoUrl}
                alt={selectedTeam.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/80 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-sm">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{selectedTeam.category}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white">{selectedTeam.name}</h1>
                <p className="text-slate-300 text-xs sm:text-sm font-medium">
                  {selectedTeam.division} · Capitanía: <strong>{selectedTeam.captain}</strong> · Entrenador: <strong>{selectedTeam.coach}</strong>
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 p-4 text-center text-xs">
              <div>
                <div className="text-slate-500 dark:text-slate-400">Victorias</div>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {selectedTeam.matchesWon} / {selectedTeam.matchesPlayed}
                </div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400">Plantilla</div>
                <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                  {selectedTeam.players.length} Jugadores
                </div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400">Club Representado</div>
                <div className="text-lg font-black text-slate-900 dark:text-white truncate">
                  {currentTenant.shortName}
                </div>
              </div>
            </div>
          </div>

          {/* Next Match Banner */}
          {selectedTeam.nextMatch && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-800/40 text-white shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Próximo Encuentro de Liga</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">vs {selectedTeam.nextMatch.opponent}</h3>
                  <div className="text-xs text-slate-300 flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {selectedTeam.nextMatch.date} a las {selectedTeam.nextMatch.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {selectedTeam.nextMatch.location}
                    </span>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold self-start sm:self-auto">
                  Entrada Libre
                </span>
              </div>
            </div>
          )}

          {/* Players Roster */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Plantilla de Jugadores ({selectedTeam.players.length})</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedTeam.players.map((player) => (
                <div
                  key={player.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3"
                >
                  <img
                    src={player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={player.name}
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40 shrink-0"
                  />
                  <div className="min-w-0 flex-1 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white truncate">{player.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Nivel {player.level.toFixed(2)} · {player.position.toUpperCase()}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium capitalize">
                      Mano: {player.hand}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </section>
      ) : (
        /* Team Listing Mode */
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Competición Federada e Interclubes
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Equipos Oficiales de {currentTenant.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
                Nuestros equipos defienden los colores del club en las ligas gallegas e interclubes en todas las categorías.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl self-start md:self-auto">
              {(['all', 'masculino', 'femenino', 'menores'] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                    selectedGender === gender
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {gender === 'all' ? 'Todos' : gender}
                </button>
              ))}
            </div>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                onClick={() => {
                  setSelectedTeamId(team.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={team.photoUrl}
                      alt={team.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-sm">
                        {team.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {team.name}
                      </h3>
                      <div className="text-xs text-slate-300 mt-0.5">{team.division}</div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                      <div>Capitanía: <strong className="text-slate-900 dark:text-white">{team.captain}</strong></div>
                      <div>Entrenador: <strong className="text-slate-900 dark:text-white">{team.coach}</strong></div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {team.players.length} jugadores convocados
                      </span>
                      <span className="text-slate-500 font-mono">
                        {team.matchesWon}V / {team.matchesPlayed}PJ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                  <span>Ver plantilla completa y partidos</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
