import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Plus,
  Users,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronRight,
  ArrowLeft,
  X,
  Check,
  Edit2,
  Trash2,
  Navigation,
  Activity,
  Dumbbell,
  ExternalLink,
} from 'lucide-react';

export interface TeamPlayer {
  id: string;
  name: string;
  level: number;
  position: 'Drive' | 'Revés' | 'Ambas';
  isCaptain?: boolean;
  phone?: string;
  avatar?: string;
}

export interface MatchCallout {
  id: string;
  rivalClub: string;
  rivalTeam: string;
  date: string;
  time: string;
  address: string;
  mapCoordinates: string;
  competition: string;
  status: 'upcoming' | 'finished';
  attendance: {
    playerId: string;
    playerName: string;
    status: 'confirmed' | 'doubt' | 'declined';
  }[];
}

export interface TeamTraining {
  id: string;
  day: string;
  time: string;
  courtName: string;
  focus: string;
}

export interface ClubTeamFull {
  id: string;
  name: string;
  category: string;
  gender: 'masculino' | 'femenino' | 'mixto';
  ageGroup: 'absoluto' | 'veteranos' | 'menores';
  captainName: string;
  coachName: string;
  players: TeamPlayer[];
  callouts: MatchCallout[];
  trainings: TeamTraining[];
  updatedAt: string;
}

const INITIAL_TEAMS: ClubTeamFull[] = [
  {
    id: 'team-1',
    name: 'Pádel San Mateo — 1ª Categoría Masculina A',
    category: '1ª Categoría FGP',
    gender: 'masculino',
    ageGroup: 'absoluto',
    captainName: 'Carlos Méndez',
    coachName: 'Mateo Varela',
    updatedAt: '03/10/2026',
    players: [
      { id: 'p1', name: 'Carlos Méndez', level: 3.85, position: 'Revés', isCaptain: true, phone: '+34 611 22 33 44', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' },
      { id: 'p2', name: 'Diego Soto', level: 3.9, position: 'Drive', phone: '+34 622 33 44 55', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
      { id: 'p3', name: 'Mateo Varela', level: 5.5, position: 'Revés', phone: '+34 600 11 22 33', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
      { id: 'p4', name: 'Javier Fraga', level: 4.1, position: 'Ambas', phone: '+34 644 55 66 77', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80' },
      { id: 'p5', name: 'Rubén Loureiro', level: 4.5, position: 'Revés', phone: '+34 666 77 88 99', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
      { id: 'p6', name: 'David Castro', level: 4.1, position: 'Drive', phone: '+34 677 88 99 00', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
    ],
    callouts: [
      {
        id: 'cal-1',
        rivalClub: 'Club Padel Coruña Indoor',
        rivalTeam: 'Pádel Coruña Pro A',
        date: 'Domingo 12 Octubre 2026',
        time: '11:00',
        address: 'Rúa Severo Ochoa 24, Polígono A Grela, 15008 A Coruña',
        mapCoordinates: '43.3551,-8.4239',
        competition: 'Liga Gallega FGP — Jornada 4',
        status: 'upcoming',
        attendance: [
          { playerId: 'p1', playerName: 'Carlos Méndez', status: 'confirmed' },
          { playerId: 'p2', playerName: 'Diego Soto', status: 'confirmed' },
          { playerId: 'p3', playerName: 'Mateo Varela', status: 'confirmed' },
          { playerId: 'p4', playerName: 'Javier Fraga', status: 'doubt' },
          { playerId: 'p5', playerName: 'Rubén Loureiro', status: 'confirmed' },
          { playerId: 'p6', playerName: 'David Castro', status: 'declined' },
        ],
      },
    ],
    trainings: [
      { id: 'tr-1', day: 'Martes', time: '20:30 - 22:00', courtName: 'Pista 1 Central', focus: 'Transición defensa-ataque y salidas de pared' },
      { id: 'tr-2', day: 'Jueves', time: '20:30 - 22:00', courtName: 'Pista 2 Panorámica', focus: 'Defensa de dobles y puntos bajo presión' },
    ],
  },
  {
    id: 'team-2',
    name: 'Pádel San Mateo — 2ª División Femenina',
    category: '2ª División FGP',
    gender: 'femenino',
    ageGroup: 'absoluto',
    captainName: 'Ana Belén Vázquez',
    coachName: 'Laura Senra',
    updatedAt: '01/10/2026',
    players: [
      { id: 'p201', name: 'Ana Belén Vázquez', level: 3.2, position: 'Drive', isCaptain: true, phone: '+34 633 44 55 66', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
      { id: 'p202', name: 'Elena Permuy', level: 2.75, position: 'Drive', phone: '+34 655 66 77 88', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
      { id: 'p203', name: 'Laura Senra', level: 5.0, position: 'Revés', phone: '+34 655 44 33 22', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
      { id: 'p204', name: 'Rosa Carballo', level: 4.5, position: 'Revés', phone: '+34 633 11 44 22', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
    ],
    callouts: [
      {
        id: 'cal-2',
        rivalClub: 'Ferrol Pádel Club',
        rivalTeam: 'Ferrol Padel Femenino',
        date: 'Sábado 18 Octubre 2026',
        time: '17:00',
        address: 'Camiño da Malata s/n, 15405 Ferrol',
        mapCoordinates: '43.4900,-8.2400',
        competition: 'Liga Interclubes Ferrolterra',
        status: 'upcoming',
        attendance: [
          { playerId: 'p201', playerName: 'Ana Belén Vázquez', status: 'confirmed' },
          { playerId: 'p202', playerName: 'Elena Permuy', status: 'confirmed' },
          { playerId: 'p203', playerName: 'Laura Senra', status: 'confirmed' },
          { playerId: 'p204', playerName: 'Rosa Carballo', status: 'confirmed' },
        ],
      },
    ],
    trainings: [
      { id: 'tr-201', day: 'Miércoles', time: '19:30 - 21:00', courtName: 'Pista 3 Indoor Pro', focus: 'Bandejas profundas y posicionamiento táctico' },
    ],
  },
  {
    id: 'team-3',
    name: 'Pádel San Mateo — Veteranos +40 Masculino',
    category: 'Liga Veteranos +40',
    gender: 'masculino',
    ageGroup: 'veteranos',
    captainName: 'Marcos Blanco',
    coachName: 'Mateo Varela',
    updatedAt: '28/09/2026',
    players: [
      { id: 'p301', name: 'Marcos Blanco', level: 4.3, position: 'Revés', isCaptain: true, phone: '+34 688 99 00 11' },
      { id: 'p302', name: 'Sergio Ramos', level: 4.5, position: 'Drive', phone: '+34 699 00 11 22' },
      { id: 'p303', name: 'Alberto Morales', level: 4.0, position: 'Ambas', phone: '+34 600 22 33 44' },
    ],
    callouts: [],
    trainings: [
      { id: 'tr-301', day: 'Viernes', time: '19:00 - 20:30', courtName: 'Pista 4 Cubierta', focus: 'Estrategia de desgaste y control de volea' },
    ],
  },
];

export const AdminTeams: React.FC = () => {
  const { currentTenant, triggerDemoToast } = useApp();

  const [teams, setTeams] = useState<ClubTeamFull[]>(() => {
    try {
      const saved = localStorage.getItem('setmio_demo_teams_v2');
      return saved ? JSON.parse(saved) : INITIAL_TEAMS;
    } catch {
      return INITIAL_TEAMS;
    }
  });

  const [selectedTeam, setSelectedTeam] = useState<ClubTeamFull | null>(null);
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'masculino' | 'femenino' | 'mixto'>('all');
  const [filterAge, setFilterAge] = useState<'all' | 'absoluto' | 'veteranos' | 'menores'>('all');

  // Modal: Nuevo Equipo (Oculto en modal)
  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false);
  const [newTeamForm, setNewTeamForm] = useState({
    name: '',
    category: '1ª Categoría FGP',
    gender: 'masculino' as 'masculino' | 'femenino' | 'mixto',
    ageGroup: 'absoluto' as 'absoluto' | 'veteranos' | 'menores',
    captainName: '',
    coachName: 'Mateo Varela',
    initialPlayersText: '',
  });

  useEffect(() => {
    try {
      localStorage.setItem('setmio_demo_teams_v2', JSON.stringify(teams));
    } catch {
      // Ignore local storage error
    }
  }, [teams]);

  // Handle Create Team
  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamForm.name.trim()) return;

    const parsedPlayers: TeamPlayer[] = newTeamForm.initialPlayersText
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((name, idx) => ({
        id: `pl-${Date.now()}-${idx}`,
        name,
        level: 3.5,
        position: 'Ambas',
        isCaptain: idx === 0,
      }));

    if (newTeamForm.captainName && !parsedPlayers.some((p) => p.name === newTeamForm.captainName)) {
      parsedPlayers.unshift({
        id: `pl-${Date.now()}-cap`,
        name: newTeamForm.captainName,
        level: 4.0,
        position: 'Revés',
        isCaptain: true,
      });
    }

    const created: ClubTeamFull = {
      id: `team-${Date.now()}`,
      name: newTeamForm.name.trim(),
      category: newTeamForm.category,
      gender: newTeamForm.gender,
      ageGroup: newTeamForm.ageGroup,
      captainName: newTeamForm.captainName || (parsedPlayers[0]?.name ?? 'Sin asignar'),
      coachName: newTeamForm.coachName,
      players: parsedPlayers,
      callouts: [],
      trainings: [
        {
          id: `tr-${Date.now()}`,
          day: 'Miércoles',
          time: '20:00 - 21:30',
          courtName: 'Pista 1 Central',
          focus: 'Preparación táctica de competición',
        },
      ],
      updatedAt: new Date().toLocaleDateString('es-ES'),
    };

    setTeams((prev) => [created, ...prev]);
    setIsNewTeamModalOpen(false);
    setNewTeamForm({
      name: '',
      category: '1ª Categoría FGP',
      gender: 'masculino',
      ageGroup: 'absoluto',
      captainName: '',
      coachName: 'Mateo Varela',
      initialPlayersText: '',
    });
    triggerDemoToast(
      'Equipo Creado',
      `"${created.name}" registrado con ${created.players.length} jugadores en la plantilla.`,
      'success'
    );
  };

  // Toggle Attendance
  const handleToggleAttendance = (
    calloutId: string,
    playerId: string,
    currentStatus: 'confirmed' | 'doubt' | 'declined'
  ) => {
    if (!selectedTeam) return;

    const nextStatus: 'confirmed' | 'doubt' | 'declined' =
      currentStatus === 'confirmed' ? 'doubt' : currentStatus === 'doubt' ? 'declined' : 'confirmed';

    const updatedCallouts = selectedTeam.callouts.map((c) => {
      if (c.id === calloutId) {
        return {
          ...c,
          attendance: c.attendance.map((a) =>
            a.playerId === playerId ? { ...a, status: nextStatus } : a
          ),
        };
      }
      return c;
    });

    const updatedTeam = { ...selectedTeam, callouts: updatedCallouts };
    setSelectedTeam(updatedTeam);
    setTeams((prev) => prev.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)));

    triggerDemoToast(
      'Convocatoria Actualizada',
      `Asistencia cambiada a "${nextStatus.toUpperCase()}".`,
      'info'
    );
  };

  const filteredTeams = teams.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.captainName.toLowerCase().includes(search.toLowerCase());

    const matchGender = filterGender === 'all' || t.gender === filterGender;
    const matchAge = filterAge === 'all' || t.ageGroup === filterAge;

    return matchSearch && matchGender && matchAge;
  });

  // =========================================================================
  // VISTA DE DETALLES DEL EQUIPO SELECCIONADO
  // =========================================================================
  if (selectedTeam) {
    return (
      <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-16">
        {/* Barra superior de regreso */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setSelectedTeam(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Lista de Equipos</span>
          </button>

          <span className="text-xs font-mono font-bold text-slate-400">
            Actualizado: {selectedTeam.updatedAt}
          </span>
        </div>

        {/* Cabecera del Equipo */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
                  {selectedTeam.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold capitalize">
                  {selectedTeam.gender} · {selectedTeam.ageGroup}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedTeam.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Capitán: <strong className="text-slate-800 dark:text-slate-200">{selectedTeam.captainName}</strong> · Entrenador:{' '}
                <strong className="text-slate-800 dark:text-slate-200">{selectedTeam.coachName}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Plantilla</div>
                <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {selectedTeam.players.length}
                </div>
              </span>
            </div>
          </div>
        </div>

        {/* 2 Columnas: Plantilla & Jugadores (Izquierda) + Convocatorias Externas & Entrenamientos (Derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda: Plantilla Oficial y Jugadores */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span>Plantilla de Jugadores ({selectedTeam.players.length})</span>
                </h2>
                <button
                  type="button"
                  onClick={() => triggerDemoToast('Añadir Jugador', 'Selector de socios para añadir al equipo abierto.', 'info')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition"
                >
                  + Jugador
                </button>
              </div>

              <div className="space-y-2">
                {selectedTeam.players.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {p.avatar ? (
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-9 h-9 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                          <span>{p.name}</span>
                          {p.isCaptain && (
                            <span className="px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 font-black text-[9px] uppercase">
                              Capitán
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Nivel {p.level.toFixed(2)} · Lado: {p.position} {p.phone && `· ${p.phone}`}
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-[11px] text-slate-700 dark:text-slate-300 shrink-0">
                      Ficha FGP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Planificación de Entrenamientos */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-emerald-500" />
                  <span>Planificación de Entrenamientos</span>
                </h2>
                <button
                  type="button"
                  onClick={() => triggerDemoToast('Nuevo Turno', 'Horario de entrenamiento añadido al calendario.', 'info')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  + Sesión
                </button>
              </div>

              <div className="space-y-2.5">
                {selectedTeam.trainings.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{tr.day} · {tr.time}</span>
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {tr.courtName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Objetivo técnico: <strong>{tr.focus}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Convocatorias Externas con Mapa del Rival y Asistencia */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-500" />
                  <span>Convocatorias Externas & Desplazamientos</span>
                </h2>
                <button
                  type="button"
                  onClick={() => triggerDemoToast('Nueva Convocatoria', 'Asistente de partido fuera de casa abierto.', 'info')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                >
                  + Convocar Partido
                </button>
              </div>

              {selectedTeam.callouts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No hay partidos como visitante programados para este equipo.
                </div>
              ) : (
                selectedTeam.callouts.map((call) => {
                  const confirmedCount = call.attendance.filter((a) => a.status === 'confirmed').length;

                  return (
                    <div
                      key={call.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3.5 text-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-extrabold uppercase text-emerald-600 dark:text-emerald-400">
                            {call.competition}
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {call.date} a las {call.time}
                          </span>
                        </div>
                        <h3 className="font-black text-sm text-slate-900 dark:text-white">
                          Rival: {call.rivalTeam} ({call.rivalClub})
                        </h3>
                      </div>

                      {/* Dirección del rival y Mapa Interactivo */}
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                              Instalaciones del Rival:
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                              {call.address}
                            </span>
                          </div>
                        </div>

                        {/* Visualizador de mapa integrado */}
                        <div className="relative h-28 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <iframe
                            title={`Mapa ${call.rivalClub}`}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(call.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                            className="w-full h-full filter saturate-150 opacity-90 hover:opacity-100 transition"
                          />
                        </div>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(call.address)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Abrir ruta en Google Maps / Waze</span>
                        </a>
                      </div>

                      {/* Confirmación de Asistencia Interactiva */}
                      <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            Confirmación de Asistencia ({confirmedCount}/{call.attendance.length} Disponibles)
                          </span>
                          <span className="text-slate-400">Clic para cambiar estado</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {call.attendance.map((att) => {
                            const isConfirmed = att.status === 'confirmed';
                            const isDoubt = att.status === 'doubt';

                            return (
                              <button
                                key={att.playerId}
                                type="button"
                                onClick={() => handleToggleAttendance(call.id, att.playerId, att.status)}
                                className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-left transition cursor-pointer active:scale-95 ${
                                  isConfirmed
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                                    : isDoubt
                                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                                }`}
                              >
                                <span className="font-bold text-xs truncate">{att.playerName}</span>
                                <span className="text-[10px] font-mono font-black uppercase shrink-0">
                                  {isConfirmed ? '✔ Sí' : isDoubt ? '⏳ Duda' : '✖ Baja'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VISTA PRINCIPAL: LISTA DE EQUIPOS CON FILTROS
  // =========================================================================
  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-16">
      {/* 1. Header Setmio Canónico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Competiciones Interclubes & Federadas
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Equipos y Plantillas del Club — {currentTenant.name}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Gestión de capitanes, listas de jugadores, desplazamientos externos con mapa y entrenamientos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewTeamModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo Equipo</span>
        </button>
      </div>

      {/* 2. Filtros de Categoría, Sexo, Edad y Buscador */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por equipo, categoría o capitán..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Filtros de Género */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <span className="text-[10px] text-slate-400 px-2 uppercase font-extrabold">Sexo:</span>
            {(['all', 'masculino', 'femenino', 'mixto'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setFilterGender(g)}
                className={`px-2.5 py-1 rounded-lg transition capitalize ${
                  filterGender === g
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {g === 'all' ? 'Todos' : g}
              </button>
            ))}
          </div>

          {/* Filtros de Edad */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <span className="text-[10px] text-slate-400 px-2 uppercase font-extrabold">Edad:</span>
            {(['all', 'absoluto', 'veteranos', 'menores'] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setFilterAge(a)}
                className={`px-2.5 py-1 rounded-lg transition capitalize ${
                  filterAge === a
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {a === 'all' ? 'Todos' : a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Grid de Tarjetas de Equipos Oficiales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm space-y-4 flex flex-col justify-between transition group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-[10px] uppercase border border-emerald-500/20">
                  {team.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400 capitalize">
                  {team.gender} · {team.ageGroup}
                </span>
              </div>

              <h2 className="text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                {team.name}
              </h2>

              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span>Capitán Responsable:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{team.captainName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Entrenador:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{team.coachName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Plantilla Inscrita:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {team.players.length} jugadores
                  </span>
                </div>
              </div>

              {team.callouts.length > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Próximo partido fuera</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {team.callouts[0].date.split(' ')[0]}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedTeam(team);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-600 text-slate-800 dark:text-slate-200 font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Ver Convocatorias & Plantilla</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================================
          MODAL: NUEVO EQUIPO (+ NUEVO EQUIPO OCULTO EN MODAL)
          ===================================================================== */}
      {isNewTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Crear Nuevo Equipo Oficial
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewTeamModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Equipo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pádel San Mateo — 2ª División Absoluta B"
                  value={newTeamForm.name}
                  onChange={(e) => setNewTeamForm({ ...newTeamForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Categoría o Liga Oficial
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Liga Gallega FGP · 1ª Categoría"
                  value={newTeamForm.category}
                  onChange={(e) => setNewTeamForm({ ...newTeamForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Género / Modalidad
                  </label>
                  <select
                    value={newTeamForm.gender}
                    onChange={(e) =>
                      setNewTeamForm({
                        ...newTeamForm,
                        gender: e.target.value as 'masculino' | 'femenino' | 'mixto',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="mixto">Mixto</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Grupo de Edad
                  </label>
                  <select
                    value={newTeamForm.ageGroup}
                    onChange={(e) =>
                      setNewTeamForm({
                        ...newTeamForm,
                        ageGroup: e.target.value as 'absoluto' | 'veteranos' | 'menores',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="absoluto">Absoluto</option>
                    <option value="veteranos">Veteranos (+35/+40/+45)</option>
                    <option value="menores">Menores / Junior</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Capitán Designado
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del capitán"
                    value={newTeamForm.captainName}
                    onChange={(e) => setNewTeamForm({ ...newTeamForm, captainName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Entrenador
                  </label>
                  <input
                    type="text"
                    value={newTeamForm.coachName}
                    onChange={(e) => setNewTeamForm({ ...newTeamForm, coachName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jugadores de la Plantilla (uno por línea)
                </label>
                <textarea
                  rows={4}
                  placeholder={'Carlos Méndez\nDiego Soto\nMateo Varela'}
                  value={newTeamForm.initialPlayersText}
                  onChange={(e) => setNewTeamForm({ ...newTeamForm, initialPlayersText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTeamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs"
                >
                  Crear Equipo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminTeams;
