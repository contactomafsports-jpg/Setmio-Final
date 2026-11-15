import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Plus,
  Users,
  Search,
  Filter,
  Calendar,
  MapPin,
  Award,
  ChevronRight,
  ArrowLeft,
  X,
  Navigation,
  Dumbbell,
  ExternalLink,
  Share2,
  Copy,
  Trophy,
  Target,
  UserCheck,
  Crown,
  Lock,
} from 'lucide-react';

const TeamBannerImage: React.FC<{
  src?: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full bg-linear-to-br from-[#0B1A2D] via-[#0E2239] to-[#1A314D] flex items-center justify-center ${className}`}
      >
        <Shield className="w-10 h-10 text-[#B7F229]/40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};

export interface TeamPlayer {
  id: string;
  name: string;
  level: number;
  position: 'Drive' | 'Revés' | 'Ambas';
  isCaptain?: boolean;
  phone?: string;
  avatar?: string;
  federationLicense?: string;
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
  positionMode?: 'fixed' | 'recommended';
}

export interface TeamStanding {
  position: number;
  teamName: string;
  isOurClub?: boolean;
  played: number;
  won: number;
  lost: number;
  points: number;
  setsWon: number;
  setsLost: number;
  setsDiff: string;
}

export interface CompetitionMatch {
  id: string;
  round: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  isHome: boolean;
  court: string;
  location: string;
  mapCoordinates?: string;
  status: 'played' | 'scheduled' | 'live';
  result?: string;
  pairs?: {
    pairNumber: number;
    ourPair: string;
    rivalPair: string;
    result: string;
    isWon?: boolean;
  }[];
}

export interface ClubTeamFull {
  id: string;
  name: string;
  category: string;
  gender: 'masculino' | 'femenino' | 'mixto';
  ageGroup: 'absoluto' | 'veteranos' | 'menores';
  venueId?: string;
  venueName?: string;
  photoUrl?: string;
  captainName: string;
  coachName: string;
  coachSpecialty?: string;
  coachPhone?: string;
  tacticalStyle?: string;
  players: TeamPlayer[];
  callouts: MatchCallout[];
  trainings: TeamTraining[];
  standings?: TeamStanding[];
  matches?: CompetitionMatch[];
  updatedAt: string;
}

const INITIAL_TEAMS: ClubTeamFull[] = [
  {
    id: 'team-1',
    name: 'Pádel San Mateo — 1ª Categoría Masculina A',
    category: '1ª Categoría FGP',
    gender: 'masculino',
    ageGroup: 'absoluto',
    venueId: 'venue-1',
    venueName: 'Sede Central Narón',
    photoUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
    captainName: 'Carlos Méndez',
    coachName: 'Mateo Varela',
    coachSpecialty: 'Alta Competición FIP & FGP',
    coachPhone: '+34 600 11 22 33',
    tacticalStyle: 'Presión alta en red, transición rápida desde fondo y juego agresivo por el centro.',
    updatedAt: '03/10/2026',
    players: [
      { id: 'p1', name: 'Carlos Méndez', level: 3.85, position: 'Revés', isCaptain: true, phone: '+34 611 22 33 44', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', federationLicense: 'GA-9924-M' },
      { id: 'p2', name: 'Diego Soto', level: 3.9, position: 'Drive', phone: '+34 622 33 44 55', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', federationLicense: 'GA-8831-M' },
      { id: 'p3', name: 'Mateo Varela', level: 5.5, position: 'Revés', phone: '+34 600 11 22 33', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', federationLicense: 'GA-1029-M' },
      { id: 'p4', name: 'Javier Fraga', level: 4.1, position: 'Ambas', phone: '+34 644 55 66 77', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80', federationLicense: 'GA-7712-M' },
      { id: 'p5', name: 'Rubén Loureiro', level: 4.5, position: 'Revés', phone: '+34 666 77 88 99', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', federationLicense: 'GA-6540-M' },
      { id: 'p6', name: 'David Castro', level: 4.1, position: 'Drive', phone: '+34 677 88 99 00', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', federationLicense: 'GA-5421-M' },
      { id: 'p7', name: 'Marcos Varela', level: 4.25, position: 'Drive', phone: '+34 655 88 99 11', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80', federationLicense: 'GA-4310-M' },
      { id: 'p8', name: 'Alejandro Ramos', level: 4.0, position: 'Revés', phone: '+34 644 33 22 11', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', federationLicense: 'GA-3290-M' },
    ],
    callouts: [
      {
        id: 'cal-1',
        rivalClub: 'Club Pádel Coruña Indoor',
        rivalTeam: 'Pádel Coruña Pro A',
        date: 'Domingo 12 Octubre 2026',
        time: '11:00',
        address: 'Rúa Severo Ochoa 24, Polígono A Grela, 15008 A Coruña',
        mapCoordinates: '43.3551,-8.4239',
        competition: 'Liga Gallega FGP — 1ª Categoría (Jornada 4)',
        status: 'upcoming',
        attendance: [
          { playerId: 'p1', playerName: 'Carlos Méndez', status: 'confirmed' },
          { playerId: 'p2', playerName: 'Diego Soto', status: 'confirmed' },
          { playerId: 'p3', playerName: 'Mateo Varela', status: 'confirmed' },
          { playerId: 'p4', playerName: 'Javier Fraga', status: 'doubt' },
          { playerId: 'p5', playerName: 'Rubén Loureiro', status: 'confirmed' },
          { playerId: 'p6', playerName: 'David Castro', status: 'declined' },
          { playerId: 'p7', playerName: 'Marcos Varela', status: 'confirmed' },
          { playerId: 'p8', playerName: 'Alejandro Ramos', status: 'confirmed' },
        ],
      },
    ],
    trainings: [
      { id: 'tr-1', day: 'Martes', time: '20:30 - 22:00', courtName: 'Pista 1 Central Pro', focus: 'Transición defensa-ataque y salidas de pared con bola rápida' },
      { id: 'tr-2', day: 'Jueves', time: '20:30 - 22:00', courtName: 'Pista 2 Panorámica', focus: 'Defensa de dobles, bloqueo de remate rival y puntos bajo presión (Tie-Break)' },
    ],
    standings: [
      { position: 1, teamName: 'Pádel San Mateo A', isOurClub: true, played: 3, won: 3, lost: 0, points: 9, setsWon: 14, setsLost: 2, setsDiff: '+12' },
      { position: 2, teamName: 'Pádel Coruña Pro A', isOurClub: false, played: 3, won: 2, lost: 1, points: 6, setsWon: 10, setsLost: 5, setsDiff: '+5' },
      { position: 3, teamName: 'Squash Santiago Pádel', isOurClub: false, played: 3, won: 2, lost: 1, points: 6, setsWon: 9, setsLost: 6, setsDiff: '+3' },
      { position: 4, teamName: 'Ferrol Pádel Club 1ª', isOurClub: false, played: 3, won: 1, lost: 2, points: 3, setsWon: 6, setsLost: 10, setsDiff: '-4' },
      { position: 5, teamName: 'Club Tenis Coruña Pádel', isOurClub: false, played: 3, won: 1, lost: 2, points: 3, setsWon: 5, setsLost: 11, setsDiff: '-6' },
      { position: 6, teamName: 'Indoor Vigo Pádel Team', isOurClub: false, played: 3, won: 0, lost: 3, points: 0, setsWon: 2, setsLost: 12, setsDiff: '-10' },
    ],
    matches: [
      {
        id: 'mat-1',
        round: 'Jornada 1',
        date: '14 Sep 2026',
        time: '11:00',
        homeTeam: 'Pádel San Mateo A',
        awayTeam: 'Club Tenis Coruña Pádel',
        isHome: true,
        court: 'Pistas Central & Panorámica',
        location: 'Sede Central · Pádel San Mateo',
        status: 'played',
        result: '5 - 0',
        pairs: [
          { pairNumber: 1, ourPair: 'M. Varela / C. Méndez', rivalPair: 'A. Rey / P. Piñeiro', result: '6-2, 6-4', isWon: true },
          { pairNumber: 2, ourPair: 'D. Soto / R. Loureiro', rivalPair: 'J. Seoane / B. Caride', result: '6-3, 7-5', isWon: true },
          { pairNumber: 3, ourPair: 'J. Fraga / D. Castro', rivalPair: 'G. Nogueira / M. Díaz', result: '6-1, 6-2', isWon: true },
        ],
      },
      {
        id: 'mat-2',
        round: 'Jornada 2',
        date: '21 Sep 2026',
        time: '12:00',
        homeTeam: 'Squash Santiago Pádel',
        awayTeam: 'Pádel San Mateo A',
        isHome: false,
        court: 'Pista 3 Cubierta',
        location: 'Rúa do Restollal 48, Santiago de Compostela',
        status: 'played',
        result: '1 - 4',
        pairs: [
          { pairNumber: 1, ourPair: 'M. Varela / D. Soto', rivalPair: 'T. Conde / X. Ramos', result: '6-4, 6-3', isWon: true },
          { pairNumber: 2, ourPair: 'C. Méndez / J. Fraga', rivalPair: 'E. Vidal / L. Bouza', result: '4-6, 5-7', isWon: false },
          { pairNumber: 3, ourPair: 'R. Loureiro / M. Varela', rivalPair: 'C. Lema / A. Pose', result: '6-3, 6-2', isWon: true },
        ],
      },
      {
        id: 'mat-3',
        round: 'Jornada 3',
        date: '28 Sep 2026',
        time: '18:00',
        homeTeam: 'Pádel San Mateo A',
        awayTeam: 'Ferrol Pádel Club 1ª',
        isHome: true,
        court: 'Pistas 1 y 2',
        location: 'Sede Central · Pádel San Mateo',
        status: 'played',
        result: '4 - 1',
        pairs: [
          { pairNumber: 1, ourPair: 'M. Varela / C. Méndez', rivalPair: 'O. Bello / R. Pena', result: '6-1, 6-3', isWon: true },
          { pairNumber: 2, ourPair: 'D. Soto / M. Varela', rivalPair: 'I. Lago / S. Barbeito', result: '6-2, 6-4', isWon: true },
          { pairNumber: 3, ourPair: 'R. Loureiro / J. Fraga', rivalPair: 'P. Sueiras / F. Dopico', result: '7-6, 6-3', isWon: true },
        ],
      },
      {
        id: 'mat-4',
        round: 'Jornada 4',
        date: '12 Oct 2026',
        time: '11:00',
        homeTeam: 'Pádel Coruña Pro A',
        awayTeam: 'Pádel San Mateo A',
        isHome: false,
        court: 'Pista Central A Grela',
        location: 'Rúa Severo Ochoa 24, Polígono A Grela, 15008 A Coruña',
        mapCoordinates: '43.3551,-8.4239',
        status: 'scheduled',
      },
      {
        id: 'mat-5',
        round: 'Jornada 5',
        date: '25 Oct 2026',
        time: '17:30',
        homeTeam: 'Pádel San Mateo A',
        awayTeam: 'Indoor Vigo Pádel Team',
        isHome: true,
        court: 'Pista 1 Central Pro',
        location: 'Sede Central · Pádel San Mateo',
        status: 'scheduled',
      },
    ],
  },
  {
    id: 'team-2',
    name: 'Pádel San Mateo — 2ª División Femenina',
    category: '2ª División FGP',
    gender: 'femenino',
    ageGroup: 'absoluto',
    venueId: 'venue-1',
    venueName: 'Sede Central Narón',
    photoUrl: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=800&q=80',
    captainName: 'Ana Belén Vázquez',
    coachName: 'Laura Senra',
    coachSpecialty: 'Técnica de Defensa & Dobles Femeninos',
    coachPhone: '+34 655 44 33 22',
    tacticalStyle: 'Juego de fondo paciente, bolas globadas profundas a la esquina y definición en red.',
    updatedAt: '01/10/2026',
    players: [
      { id: 'p201', name: 'Ana Belén Vázquez', level: 3.2, position: 'Drive', isCaptain: true, phone: '+34 633 44 55 66', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', federationLicense: 'GA-7819-F' },
      { id: 'p202', name: 'Elena Permuy', level: 2.75, position: 'Drive', phone: '+34 655 66 77 88', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', federationLicense: 'GA-6512-F' },
      { id: 'p203', name: 'Laura Senra', level: 5.0, position: 'Revés', phone: '+34 655 44 33 22', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', federationLicense: 'GA-2190-F' },
      { id: 'p204', name: 'Rosa Carballo', level: 4.5, position: 'Revés', phone: '+34 633 11 44 22', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80', federationLicense: 'GA-4309-F' },
      { id: 'p205', name: 'Patricia Romero', level: 3.5, position: 'Ambas', phone: '+34 622 11 88 44', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', federationLicense: 'GA-5429-F' },
    ],
    callouts: [
      {
        id: 'cal-2',
        rivalClub: 'Ferrol Pádel Club',
        rivalTeam: 'Ferrol Pádel Femenino',
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
          { playerId: 'p205', playerName: 'Patricia Romero', status: 'doubt' },
        ],
      },
    ],
    trainings: [
      { id: 'tr-201', day: 'Miércoles', time: '19:30 - 21:00', courtName: 'Pista 3 Indoor Pro', focus: 'Bandejas profundas y posicionamiento táctico en pared' },
    ],
    standings: [
      { position: 1, teamName: 'Ferrol Pádel Femenino', isOurClub: false, played: 2, won: 2, lost: 0, points: 6, setsWon: 8, setsLost: 2, setsDiff: '+6' },
      { position: 2, teamName: 'Pádel San Mateo Fem', isOurClub: true, played: 2, won: 2, lost: 0, points: 6, setsWon: 7, setsLost: 3, setsDiff: '+4' },
      { position: 3, teamName: 'Club Marítimo Oza', isOurClub: false, played: 2, won: 1, lost: 1, points: 3, setsWon: 5, setsLost: 5, setsDiff: '0' },
      { position: 4, teamName: 'Pádel Narón Fem B', isOurClub: false, played: 2, won: 0, lost: 2, points: 0, setsWon: 1, setsLost: 8, setsDiff: '-7' },
    ],
    matches: [
      {
        id: 'mat-f1',
        round: 'Jornada 1',
        date: '20 Sep 2026',
        time: '10:00',
        homeTeam: 'Pádel San Mateo Fem',
        awayTeam: 'Pádel Narón Fem B',
        isHome: true,
        court: 'Pista 3',
        location: 'Sede Central · Pádel San Mateo',
        status: 'played',
        result: '4 - 1',
      },
      {
        id: 'mat-f2',
        round: 'Jornada 2',
        date: '27 Sep 2026',
        time: '12:00',
        homeTeam: 'Club Marítimo Oza',
        awayTeam: 'Pádel San Mateo Fem',
        isHome: false,
        court: 'Pista 1 Oza',
        location: 'Paseo Marítimo Oza, A Coruña',
        status: 'played',
        result: '2 - 3',
      },
    ],
  },
  {
    id: 'team-3',
    name: 'Pádel San Mateo — Veteranos +40 Masculino',
    category: 'Liga Veteranos +40',
    gender: 'masculino',
    ageGroup: 'veteranos',
    venueId: 'venue-2',
    venueName: 'Sede Puerto Dársena',
    photoUrl: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=800&q=80',
    captainName: 'Marcos Blanco',
    coachName: 'Mateo Varela',
    coachSpecialty: 'Estrategia Veteranos & Control de Juego',
    coachPhone: '+34 600 11 22 33',
    tacticalStyle: 'Puntos largos con mínimo error no forzado, juego al cuerpo y voleas anguladas.',
    updatedAt: '28/09/2026',
    players: [
      { id: 'p301', name: 'Marcos Blanco', level: 4.3, position: 'Revés', isCaptain: true, phone: '+34 688 99 00 11', federationLicense: 'GA-1102-V' },
      { id: 'p302', name: 'Sergio Ramos', level: 4.5, position: 'Drive', phone: '+34 699 00 11 22', federationLicense: 'GA-2204-V' },
      { id: 'p303', name: 'Alberto Morales', level: 4.0, position: 'Ambas', phone: '+34 600 22 33 44', federationLicense: 'GA-3305-V' },
      { id: 'p304', name: 'Joaquín Paz', level: 3.9, position: 'Drive', phone: '+34 611 77 88 99', federationLicense: 'GA-4406-V' },
    ],
    callouts: [],
    trainings: [
      { id: 'tr-301', day: 'Viernes', time: '19:00 - 20:30', courtName: 'Pista 4 Cubierta', focus: 'Estrategia de desgaste, colocación de volea y defensa de pared lateral' },
    ],
    standings: [
      { position: 1, teamName: 'Pádel San Mateo +40', isOurClub: true, played: 1, won: 1, lost: 0, points: 3, setsWon: 4, setsLost: 1, setsDiff: '+3' },
      { position: 2, teamName: 'Veteranos Ferrolterra', isOurClub: false, played: 1, won: 1, lost: 0, points: 3, setsWon: 3, setsLost: 2, setsDiff: '+1' },
      { position: 3, teamName: 'Betanzos Padel Master', isOurClub: false, played: 1, won: 0, lost: 1, points: 0, setsWon: 2, setsLost: 3, setsDiff: '-1' },
    ],
    matches: [
      {
        id: 'mat-v1',
        round: 'Jornada 1',
        date: '26 Sep 2026',
        time: '19:00',
        homeTeam: 'Pádel San Mateo +40',
        awayTeam: 'Betanzos Padel Master',
        isHome: true,
        court: 'Pista 4',
        location: 'Sede Central · Pádel San Mateo',
        status: 'played',
        result: '4 - 1',
      },
    ],
  },
];

export const AdminTeams: React.FC = () => {
  const { currentTenant, triggerDemoToast, navigateToPlayerProfile, venues, isMultiVenue, courts } = useApp();

  const [teams, setTeams] = useState<ClubTeamFull[]>(() => {
    try {
      const saved = localStorage.getItem('setmio_demo_teams_v3');
      return saved ? JSON.parse(saved) : INITIAL_TEAMS;
    } catch {
      return INITIAL_TEAMS;
    }
  });

  const [selectedTeam, setSelectedTeam] = useState<ClubTeamFull | null>(null);
  const [activeTeamTab, setActiveTeamTab] = useState<'players' | 'standings' | 'matches' | 'callouts' | 'trainings' | 'coaching'>('players');
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'masculino' | 'femenino' | 'mixto'>('all');
  const [filterAge, setFilterAge] = useState<'all' | 'absoluto' | 'veteranos' | 'menores'>('all');
  const [filterVenue, setFilterVenue] = useState<string>('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Header "+" Action Dropdown
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setIsActionMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Modals
  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isNewCalloutModalOpen, setIsNewCalloutModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppCallout, setWhatsAppCallout] = useState<MatchCallout | null>(null);
  const [isNewTrainingModalOpen, setIsNewTrainingModalOpen] = useState(false);

  // Forms
  const [newTeamForm, setNewTeamForm] = useState({
    name: '',
    category: '1ª Categoría FGP',
    gender: 'masculino' as 'masculino' | 'femenino' | 'mixto',
    ageGroup: 'absoluto' as 'absoluto' | 'veteranos' | 'menores',
    venueId: venues?.[0]?.id || 'venue-1',
    captainName: '',
    coachName: 'Mateo Varela',
    initialPlayersText: '',
    photoUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
  });

  const [newPlayerForm, setNewPlayerForm] = useState({
    name: '',
    level: 3.5,
    position: 'Revés' as 'Drive' | 'Revés' | 'Ambas',
    phone: '',
    federationLicense: '',
    isCaptain: false,
  });

  const [newCalloutForm, setNewCalloutForm] = useState({
    rivalClub: 'Club Pádel Dársena',
    rivalTeam: 'Dársena Máster A',
    date: 'Domingo 26 Octubre 2026',
    time: '11:30',
    address: 'Paseo Marítimo s/n, A Coruña',
    mapCoordinates: '43.3680,-8.4010',
    competition: 'Liga Gallega FGP — 1ª Categoría',
  });

  const [newTrainingForm, setNewTrainingForm] = useState({
    day: 'Miércoles',
    time: '20:00 - 21:30',
    courtName: 'Pista 1 Central Pro',
    focus: 'Estrategia de ataque con remate x3 y salida de pared',
    positionMode: 'recommended' as 'fixed' | 'recommended',
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('setmio_demo_teams_v3', JSON.stringify(teams));
    } catch {
      // Ignore local storage error
    }
  }, [teams]);

  // Keep selectedTeam synced with teams state
  useEffect(() => {
    if (selectedTeam) {
      const refreshed = teams.find((t) => t.id === selectedTeam.id);
      if (refreshed) {
        setSelectedTeam(refreshed);
      }
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
      venueId: newTeamForm.venueId,
      venueName: venues?.find((v) => v.id === newTeamForm.venueId)?.name || 'Sede Principal',
      photoUrl: newTeamForm.photoUrl || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
      captainName: newTeamForm.captainName || (parsedPlayers[0]?.name ?? 'Sin asignar'),
      coachName: newTeamForm.coachName,
      coachSpecialty: 'Entrenador de Equipo Federado',
      coachPhone: '+34 600 11 22 33',
      tacticalStyle: 'Juego equilibrado con enfoque en regularidad y transición rápida a la red.',
      players: parsedPlayers,
      callouts: [],
      trainings: [
        {
          id: `tr-${Date.now()}`,
          day: 'Miércoles',
          time: '20:00 - 21:30',
          courtName: 'Pista 1 Central Pro',
          focus: 'Preparación táctica de competición',
        },
      ],
      standings: [
        { position: 1, teamName: newTeamForm.name.trim(), isOurClub: true, played: 0, won: 0, lost: 0, points: 0, setsWon: 0, setsLost: 0, setsDiff: '0' },
      ],
      matches: [],
      updatedAt: new Date().toLocaleDateString('es-ES'),
    };

    setTeams((prev) => [created, ...prev]);
    setIsNewTeamModalOpen(false);
    triggerDemoToast(
      'Equipo Creado',
      `"${created.name}" registrado en la competición con éxito.`,
      'success'
    );
  };

  // Handle Create Training Session
  const handleCreateTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    const newTr: TeamTraining = {
      id: `tr-${Date.now()}`,
      day: newTrainingForm.day,
      time: newTrainingForm.time,
      courtName: newTrainingForm.courtName,
      focus: newTrainingForm.focus.trim() || 'Sesión técnico-táctica de equipo',
      positionMode: newTrainingForm.positionMode,
    };

    const updated = teams.map((team) => {
      if (team.id !== selectedTeam.id) return team;
      return {
        ...team,
        trainings: [newTr, ...team.trainings],
      };
    });

    setTeams(updated);
    setIsNewTrainingModalOpen(false);
    triggerDemoToast(
      'Sesión de Entrenamiento Programada',
      `Sesión para ${newTrainingForm.day} a las ${newTrainingForm.time} (${newTrainingForm.positionMode === 'fixed' ? 'Posiciones Fijas' : 'Posiciones Recomendadas'}).`,
      'success'
    );
  };

  // Toggle Attendance
  const handleToggleAttendance = (calloutId: string, playerId: string, currentStatus: string) => {
    if (!selectedTeam) return;

    const nextStatus = currentStatus === 'confirmed' ? 'doubt' : currentStatus === 'doubt' ? 'declined' : 'confirmed';

    const updatedTeams = teams.map((team) => {
      if (team.id !== selectedTeam.id) return team;

      const updatedCallouts = team.callouts.map((c) => {
        if (c.id !== calloutId) return c;
        return {
          ...c,
          attendance: c.attendance.map((att) =>
            att.playerId === playerId ? { ...att, status: nextStatus as 'confirmed' | 'doubt' | 'declined' } : att
          ),
        };
      });

      return { ...team, callouts: updatedCallouts };
    });

    setTeams(updatedTeams);
  };

  // Set Captain
  const handleSetCaptain = (player: TeamPlayer) => {
    if (!selectedTeam) return;

    const updatedTeams = teams.map((team) => {
      if (team.id !== selectedTeam.id) return team;

      const updatedPlayers = team.players.map((p) => ({
        ...p,
        isCaptain: p.id === player.id,
      }));

      return {
        ...team,
        captainName: player.name,
        players: updatedPlayers,
      };
    });

    setTeams(updatedTeams);
    triggerDemoToast(
      'Capitán Actualizado',
      `${player.name} ha sido designado capitán oficial de "${selectedTeam.name}".`,
      'success'
    );
  };

  // Add Player to Team
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !newPlayerForm.name.trim()) return;

    const newP: TeamPlayer = {
      id: `pl-${Date.now()}`,
      name: newPlayerForm.name.trim(),
      level: Number(newPlayerForm.level) || 3.5,
      position: newPlayerForm.position,
      phone: newPlayerForm.phone || '+34 600 00 00 00',
      federationLicense: newPlayerForm.federationLicense || `GA-${Math.floor(1000 + Math.random() * 9000)}-M`,
      isCaptain: newPlayerForm.isCaptain,
    };

    const updatedTeams = teams.map((t) => {
      if (t.id !== selectedTeam.id) return t;

      let players = [...t.players];
      if (newPlayerForm.isCaptain) {
        players = players.map((p) => ({ ...p, isCaptain: false }));
      }
      players.push(newP);

      // Also add to active callouts as doubt
      const callouts = t.callouts.map((c) => ({
        ...c,
        attendance: [...c.attendance, { playerId: newP.id, playerName: newP.name, status: 'doubt' as const }],
      }));

      return {
        ...t,
        players,
        callouts,
        captainName: newPlayerForm.isCaptain ? newP.name : t.captainName,
      };
    });

    setTeams(updatedTeams);
    setIsAddPlayerModalOpen(false);
    setNewPlayerForm({
      name: '',
      level: 3.5,
      position: 'Revés',
      phone: '',
      federationLicense: '',
      isCaptain: false,
    });
    triggerDemoToast('Jugador Fichado', `${newP.name} ha sido añadido a la plantilla oficial.`, 'success');
  };

  // Create Callout
  const handleCreateCallout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    const created: MatchCallout = {
      id: `cal-${Date.now()}`,
      rivalClub: newCalloutForm.rivalClub,
      rivalTeam: newCalloutForm.rivalTeam,
      date: newCalloutForm.date,
      time: newCalloutForm.time,
      address: newCalloutForm.address,
      mapCoordinates: newCalloutForm.mapCoordinates,
      competition: newCalloutForm.competition,
      status: 'upcoming',
      attendance: selectedTeam.players.map((p) => ({
        playerId: p.id,
        playerName: p.name,
        status: 'doubt',
      })),
    };

    const updatedTeams = teams.map((t) => {
      if (t.id !== selectedTeam.id) return t;
      return {
        ...t,
        callouts: [created, ...t.callouts],
      };
    });

    setTeams(updatedTeams);
    setIsNewCalloutModalOpen(false);
    triggerDemoToast('Convocatoria Abierta', `Se ha generado la convocatoria para el encuentro vs ${created.rivalTeam}.`, 'success');
  };

  // Generate WhatsApp text for callout
  const getWhatsAppMessage = (call: MatchCallout, team: ClubTeamFull) => {
    const confirmed = call.attendance.filter((a) => a.status === 'confirmed');
    const doubts = call.attendance.filter((a) => a.status === 'doubt');
    const declined = call.attendance.filter((a) => a.status === 'declined');

    return `🎾 *CONVOCATORIA OFICIAL — ${team.name.toUpperCase()}*
🏆 *Competición:* ${call.competition}
⚔️ *Rival:* ${call.rivalTeam} (${call.rivalClub})
📅 *Fecha:* ${call.date}
⏰ *Hora Citación:* ${call.time}
📍 *Lugar:* ${call.address}
🗺️ *Ruta Google Maps:* https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(call.address)}

👑 *Capitán:* ${team.captainName}
📋 *Entrenador:* ${team.coachName}

✅ *JUGADORES CONFIRMADOS (${confirmed.length}):*
${confirmed.map((p, i) => `${i + 1}. ${p.playerName}`).join('\n')}

⏳ *PENDIENTES DE CONFIRMAR (${doubts.length}):*
${doubts.map((p) => `• ${p.playerName}`).join('\n')}

❌ *BAJAS NOTIFICADAS (${declined.length}):*
${declined.map((p) => `• ${p.playerName}`).join('\n')}

⚠️ *Por favor, confirmad asistencia antes del jueves a las 20:00h en Setmio.*`;
  };

  // Filtered Teams
  const filteredTeams = teams.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.captainName.toLowerCase().includes(search.toLowerCase()) ||
      t.coachName.toLowerCase().includes(search.toLowerCase());

    const matchGender = filterGender === 'all' || t.gender === filterGender;
    const matchAge = filterAge === 'all' || t.ageGroup === filterAge;
    const matchVenue = !isMultiVenue || filterVenue === 'all' || t.venueId === filterVenue;

    return matchSearch && matchGender && matchAge && matchVenue;
  });

  const activeFiltersCount =
    (filterGender !== 'all' ? 1 : 0) +
    (filterAge !== 'all' ? 1 : 0) +
    (isMultiVenue && filterVenue !== 'all' ? 1 : 0);

  // =========================================================================
  // VISTA DE DETALLES DEL EQUIPO SELECCIONADO
  // =========================================================================
  if (selectedTeam) {
    const totalPlayers = selectedTeam.players.length;
    const upcomingCallout = selectedTeam.callouts.find((c) => c.status === 'upcoming');
    const currentPoints = selectedTeam.standings?.find((s) => s.isOurClub)?.points ?? 9;
    const currentPos = selectedTeam.standings?.find((s) => s.isOurClub)?.position ?? 1;

    return (
      <div className="max-w-7xl mx-auto pt-3 pb-24 sm:pb-16 space-y-6 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased animate-in fade-in duration-150">
        {/* Barra superior de regreso y acciones */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-[#1A314D]">
          <button
            type="button"
            onClick={() => {
              setSelectedTeam(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs font-bold text-[#0B1A2D] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#132A45] transition cursor-pointer shadow-2xs active:scale-95 self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Equipos</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">
              Actualizado: {selectedTeam.updatedAt}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#B7F229]/20 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] font-bold text-[10px] uppercase border border-[#B7F229]/40">
              Equipo Oficial FGP
            </span>
          </div>
        </div>

        {/* HERO CARD DEL EQUIPO: PALETA SETMIO */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0B1A2D] via-[#0E2239] to-[#071220] text-white p-6 sm:p-8 border border-[#1A314D] shadow-xl space-y-6">
          {selectedTeam.photoUrl && (
            <div className="absolute inset-0 opacity-15 mix-blend-luminosity pointer-events-none">
              <TeamBannerImage src={selectedTeam.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#B7F229]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#8B5CF6]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#B7F229] text-[#0B1A2D] text-xs font-extrabold uppercase tracking-wider">
                  {selectedTeam.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-bold capitalize border border-white/15">
                  {selectedTeam.gender} · {selectedTeam.ageGroup}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Capitán: {selectedTeam.captainName}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {selectedTeam.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>
                  Responsable Técnico:{' '}
                  <strong className="text-[#B7F229] font-bold">{selectedTeam.coachName}</strong>{' '}
                  {selectedTeam.coachSpecialty && `(${selectedTeam.coachSpecialty})`}
                </span>
                <span>·</span>
                <span>
                  Sede Oficial:{' '}
                  <strong className="text-white font-semibold">
                    {selectedTeam.venueName || (isMultiVenue && venues?.[0]?.name) || currentTenant.name}
                  </strong>
                </span>
              </p>

              {selectedTeam.tacticalStyle && (
                <div className="pt-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                    <Target className="w-3.5 h-3.5 text-[#B7F229] shrink-0" />
                    <span>
                      <strong className="text-white">Estilo Táctico:</strong> {selectedTeam.tacticalStyle}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-[#071220]/70 border border-[#1A314D] backdrop-blur-xs text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Plantilla</div>
                <div className="text-2xl font-extrabold font-mono text-[#B7F229] mt-0.5">
                  {totalPlayers}
                </div>
                <div className="text-[10px] text-slate-400">fichas activas</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#071220]/70 border border-[#1A314D] backdrop-blur-xs text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Puesto Liga</div>
                <div className="text-2xl font-extrabold font-mono text-amber-400 mt-0.5">
                  #{currentPos}
                </div>
                <div className="text-[10px] text-slate-400">{currentPoints} pts clasif.</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#071220]/70 border border-[#1A314D] backdrop-blur-xs text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Convocados</div>
                <div className="text-2xl font-extrabold font-mono text-white mt-0.5">
                  {upcomingCallout
                    ? upcomingCallout.attendance.filter((a) => a.status === 'confirmed').length
                    : 0}
                </div>
                <div className="text-[10px] text-slate-400">para próx. partido</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#071220]/70 border border-[#1A314D] backdrop-blur-xs text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Entrenamientos</div>
                <div className="text-2xl font-extrabold font-mono text-[#8B5CF6] mt-0.5">
                  {selectedTeam.trainings.length}
                </div>
                <div className="text-[10px] text-slate-400">turnos/semana</div>
              </div>
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN POR SUBPESTAÑAS DE LA FICHA DEL EQUIPO */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200 dark:border-[#1A314D] scrollbar-none">
          {[
            { id: 'players', label: `Plantilla (${totalPlayers})`, icon: Users },
            { id: 'standings', label: 'Clasificación', icon: Trophy },
            { id: 'matches', label: 'Partidos', icon: Calendar },
            { id: 'callouts', label: `Convocatorias (${selectedTeam.callouts.length})`, icon: Navigation },
            { id: 'trainings', label: `Entrenamientos (${selectedTeam.trainings.length})`, icon: Dumbbell },
            { id: 'coaching', label: 'Cuerpo Técnico', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTeamTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTeamTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition cursor-pointer ${
                  isActive
                    ? 'border-[#0B1A2D] text-[#0B1A2D] dark:border-[#B7F229] dark:text-[#B7F229]'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ===================================================================
            SUBPESTAÑA 1: PLANTILLA OFICIAL DE JUGADORES
            =================================================================== */}
        {activeTeamTab === 'players' && (
          <div className="space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                  <span>Jugadores Inscritos</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Haz clic en cualquier jugador para abrir su perfil o asignarlo como Capitán.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddPlayerModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold text-xs flex items-center gap-1.5 transition shadow-2xs self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Jugador</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {selectedTeam.players.map((p) => {
                const isCap = p.isCaptain || p.name === selectedTeam.captainName;

                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border transition shadow-2xs flex flex-col justify-between group ${
                      isCap
                        ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                        : 'bg-white dark:bg-[#0E2239] border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D]/30 dark:hover:border-[#B7F229]/40'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {p.avatar ? (
                            <img
                              src={p.avatar}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-[#1A314D]"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D] font-extrabold text-sm flex items-center justify-center shrink-0">
                              {p.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div>
                            <div className="font-bold text-sm text-[#0B1A2D] dark:text-white flex items-center gap-1.5">
                              <span>{p.name}</span>
                              {isCap && (
                                <span className="p-0.5 rounded-full bg-amber-400 text-[#0B1A2D]" title="Capitán Oficial">
                                  <Crown className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              Licencia: {p.federationLicense || 'FGP-Oficial'}
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#071220] text-[#0B1A2D] dark:text-[#B7F229] border border-slate-200/70 dark:border-[#1A314D] text-[10px] font-bold font-mono">
                          Nivel {p.level.toFixed(2)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-[#1A314D]">
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/60 dark:border-[#1A314D]">
                          <span className="text-[10px] text-slate-400 block font-bold">Lado de Pista</span>
                          <span className="font-bold text-[#0B1A2D] dark:text-slate-200">{p.position}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/60 dark:border-[#1A314D]">
                          <span className="text-[10px] text-slate-400 block font-bold">Teléfono</span>
                          <span className="font-bold text-[#0B1A2D] dark:text-slate-200 truncate block">
                            {p.phone || 'Sin registrar'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => navigateToPlayerProfile(p.name, 'teams')}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-[#0B1A2D] hover:text-white dark:bg-[#071220] dark:hover:bg-[#B7F229] dark:hover:text-[#0B1A2D] text-[#0B1A2D] dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Ver Perfil</span>
                      </button>

                      {!isCap && (
                        <button
                          type="button"
                          onClick={() => handleSetCaptain(p)}
                          className="py-2 px-2.5 rounded-xl border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold transition cursor-pointer"
                          title="Nombrar como Capitán del equipo"
                        >
                          <Crown className="w-3.5 h-3.5 inline mr-1" />
                          <span>Capitán</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            SUBPESTAÑA 2: COMPETICIÓN & CLASIFICACIÓN
            =================================================================== */}
        {activeTeamTab === 'standings' && (
          <div className="space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Clasificación Oficial — {selectedTeam.category}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Puntos, sets disputados y balance de partidos en la Federación Gallega de Pádel.
                </p>
              </div>

              <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#0E2239] text-[#0B1A2D] dark:text-[#B7F229] font-bold text-xs border border-slate-200 dark:border-[#1A314D] self-start sm:self-auto">
                Fase Regular · 1ª Vuelta
              </span>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#071220] border-b border-slate-200 dark:border-[#1A314D] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-3 px-4 text-center w-12">Pos</th>
                      <th className="py-3 px-4">Equipo</th>
                      <th className="py-3 px-3 text-center">PJ</th>
                      <th className="py-3 px-3 text-center">PG</th>
                      <th className="py-3 px-3 text-center">PP</th>
                      <th className="py-3 px-3 text-center">Sets +</th>
                      <th className="py-3 px-3 text-center">Sets -</th>
                      <th className="py-3 px-3 text-center">Dif Sets</th>
                      <th className="py-3 px-4 text-right">Puntos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1A314D]">
                    {(selectedTeam.standings || []).map((row) => (
                      <tr
                        key={row.position}
                        className={`transition ${
                          row.isOurClub
                            ? 'bg-[#B7F229]/15 dark:bg-[#B7F229]/10 font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-[#132A45]/60'
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-extrabold text-xs ${
                              row.position === 1
                                ? 'bg-[#B7F229] text-[#0B1A2D]'
                                : row.position <= 2
                                ? 'bg-slate-200 dark:bg-[#1A314D] text-[#0B1A2D] dark:text-slate-200'
                                : 'text-slate-400'
                            }`}
                          >
                            {row.position}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0B1A2D] dark:text-white">
                              {row.teamName}
                            </span>
                            {row.isOurClub && (
                              <span className="px-2 py-0.5 rounded-md bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D] text-[9px] font-extrabold uppercase">
                                Nuestro Club
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                          {row.played}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-[#6e9e02] dark:text-[#B7F229] font-bold">
                          {row.won}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-rose-500 font-bold">
                          {row.lost}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                          {row.setsWon}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                          {row.setsLost}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                          {row.setsDiff}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-sm font-extrabold font-mono text-[#0B1A2D] dark:text-[#B7F229]">
                            {row.points} pts
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            SUBPESTAÑA 3: PARTIDOS & CALENDARIO
            =================================================================== */}
        {activeTeamTab === 'matches' && (
          <div className="space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                  <span>Calendario Oficial de Jornadas y Resultados</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Histórico de enfrentamientos por parejas, canchas asignadas y próximos duelos.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsNewCalloutModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold text-xs flex items-center gap-1.5 transition shadow-2xs self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Programar Partido</span>
              </button>
            </div>

            <div className="space-y-4 mb-8">
              {(selectedTeam.matches || []).map((match) => {
                const isPlayed = match.status === 'played';

                return (
                  <div
                    key={match.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-4 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-[#1A314D] pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#071220] text-[#0B1A2D] dark:text-slate-300 text-[10px] font-bold uppercase">
                          {match.round}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                          {match.date} · {match.time}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            match.isHome
                              ? 'bg-[#0B1A2D]/10 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229]'
                              : 'bg-[#8B5CF6]/15 text-[#6d28d9] dark:text-[#c4b5fd]'
                          }`}
                        >
                          {match.isHome ? 'Local' : 'Visitante'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPlayed ? (
                          <span className="px-3 py-1 rounded-xl bg-[#B7F229]/25 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] font-bold text-xs">
                            Resultado: {match.result}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs">
                            Programado
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5 text-left md:text-right space-y-0.5">
                        <div className="text-xs text-slate-400 uppercase font-bold">Equipo Local</div>
                        <div className="text-base font-extrabold text-[#0B1A2D] dark:text-white">
                          {match.homeTeam}
                        </div>
                      </div>

                      <div className="md:col-span-2 text-center py-2 px-3 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/60 dark:border-[#1A314D]">
                        <span className="text-xs font-mono font-bold text-slate-400 block">VS</span>
                        <span className="text-lg font-extrabold font-mono text-[#0B1A2D] dark:text-[#B7F229]">
                          {match.result || 'Próximo'}
                        </span>
                      </div>

                      <div className="md:col-span-5 text-left space-y-0.5">
                        <div className="text-xs text-slate-400 uppercase font-bold">Equipo Visitante</div>
                        <div className="text-base font-extrabold text-[#0B1A2D] dark:text-white">
                          {match.awayTeam}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/60 dark:border-[#1A314D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>
                          <strong>Instalación:</strong> {match.location} ({match.court})
                        </span>
                      </div>

                      {!match.isHome && match.location && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.location)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#0B1A2D] dark:text-[#B7F229] font-bold hover:underline"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Cómo llegar (GPS)</span>
                        </a>
                      )}
                    </div>

                    {match.pairs && match.pairs.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#1A314D]">
                        <span className="text-[11px] font-bold uppercase text-slate-400 block">
                          Resultados por Parejas Federadas
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {match.pairs.map((p) => (
                            <div
                              key={p.pairNumber}
                              className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/70 dark:border-[#1A314D] space-y-1 text-xs"
                            >
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                                <span>Punto {p.pairNumber}</span>
                                <span className={p.isWon ? 'text-[#6e9e02] dark:text-[#B7F229] font-extrabold' : 'text-rose-500'}>
                                  {p.result}
                                </span>
                              </div>
                              <div className="font-bold text-[#0B1A2D] dark:text-white truncate">
                                {p.ourPair}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">
                                vs {p.rivalPair}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            SUBPESTAÑA 4: CONVOCATORIAS ACTIVAS & DESPLAZAMIENTOS
            =================================================================== */}
        {activeTeamTab === 'callouts' && (
          <div className="space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                  <span>Convocatorias Activas, Asistencia y Rutas</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Control en tiempo real de jugadores disponibles para los encuentros fuera y dentro de casa.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsNewCalloutModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold text-xs flex items-center gap-1.5 transition shadow-2xs self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Convocar Encuentro</span>
              </button>
            </div>

            {selectedTeam.callouts.length === 0 ? (
              <div className="p-12 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-center space-y-2 mb-8">
                <Navigation className="w-10 h-10 mx-auto text-slate-400 opacity-60" />
                <div className="font-bold text-sm">No hay convocatorias activas para este equipo</div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Crea una nueva convocatoria para citar a los jugadores, compartir la ubicación por WhatsApp y confirmar su asistencia.
                </p>
              </div>
            ) : (
              <div className="space-y-6 mb-8">
                {selectedTeam.callouts.map((call) => {
                  const confirmed = call.attendance.filter((a) => a.status === 'confirmed');
                  const doubts = call.attendance.filter((a) => a.status === 'doubt');
                  const declined = call.attendance.filter((a) => a.status === 'declined');

                  return (
                    <div
                      key={call.id}
                      className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-5 shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#1A314D] pb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#B7F229]/25 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] font-bold text-[10px] uppercase">
                              {call.competition}
                            </span>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              {call.date} · {call.time}h
                            </span>
                          </div>
                          <h3 className="text-lg font-extrabold text-[#0B1A2D] dark:text-white">
                            Rival Oficial: {call.rivalTeam} ({call.rivalClub})
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setWhatsAppCallout(call);
                            setIsWhatsAppModalOpen(true);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold text-xs flex items-center gap-2 shadow-2xs transition active:scale-95 cursor-pointer self-start sm:self-auto"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Compartir por WhatsApp</span>
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[#0B1A2D] dark:text-white block text-xs">
                                Instalación del Encuentro:
                              </span>
                              <span className="text-xs text-slate-600 dark:text-slate-400 block">
                                {call.address}
                              </span>
                            </div>
                          </div>

                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(call.address)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:bg-slate-100 dark:hover:bg-[#132A45] transition shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Abrir en Google Maps</span>
                          </a>
                        </div>

                        <div className="relative h-44 rounded-xl overflow-hidden bg-slate-200 dark:bg-[#0B1A2D] border border-slate-200 dark:border-[#1A314D]">
                          <iframe
                            title={`Mapa ${call.rivalClub}`}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(call.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                            className="w-full h-full opacity-95 hover:opacity-100 transition"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-[#0B1A2D] dark:text-white">
                              Estado:
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#B7F229]/25 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] font-bold text-xs">
                              {confirmed.length} Confirmados
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs">
                              {doubts.length} Pendientes
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold text-xs">
                              {declined.length} Bajas
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Toca sobre un jugador para cambiar su estado
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {call.attendance.map((att) => {
                            const isConfirmed = att.status === 'confirmed';
                            const isDoubt = att.status === 'doubt';

                            return (
                              <button
                                key={att.playerId}
                                type="button"
                                onClick={() => handleToggleAttendance(call.id, att.playerId, att.status)}
                                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-left transition cursor-pointer active:scale-95 ${
                                  isConfirmed
                                    ? 'bg-[#B7F229]/15 dark:bg-[#B7F229]/10 border-[#B7F229]/60 text-[#0B1A2D] dark:text-[#B7F229]'
                                    : isDoubt
                                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                                }`}
                              >
                                <span className="font-bold text-xs truncate">{att.playerName}</span>
                                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-white/80 dark:bg-[#071220] shrink-0">
                                  {isConfirmed ? 'Disponible' : isDoubt ? 'En Duda' : 'Baja'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            SUBPESTAÑA 5: ENTRENAMIENTOS & TÁCTICA
            =================================================================== */}
        {activeTeamTab === 'trainings' && (
          <div className="space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                  <span>Sesiones Semanales de Equipo & Táctica</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pistas bloqueadas de forma recurrente, objetivos de preparación y ejercicios recomendados.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsNewTrainingModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold text-xs flex items-center gap-1.5 transition shadow-2xs self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Sesión</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {selectedTeam.trainings.map((tr) => (
                <div
                  key={tr.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-2.5 gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />
                      <span className="font-bold text-[#0B1A2D] dark:text-white text-sm">
                        {tr.day} · {tr.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          tr.positionMode === 'fixed'
                            ? 'bg-[#8B5CF6]/15 text-[#6d28d9] dark:text-[#c4b5fd] border border-[#8B5CF6]/30'
                            : 'bg-slate-100 dark:bg-[#071220] text-[#0B1A2D] dark:text-slate-300 border border-slate-200 dark:border-[#1A314D]'
                        }`}
                      >
                        {tr.positionMode === 'fixed' ? 'Posiciones Fijas' : 'Modo Recomendado'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#B7F229]/20 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] font-bold text-xs border border-[#B7F229]/30">
                        {tr.courtName}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Enfoque Técnico y Táctico:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      {tr.focus}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Entrenador: {selectedTeam.coachName}</span>
                    <span className="text-[#6e9e02] dark:text-[#B7F229] font-bold">Pista Reservada en Cuadrante</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            SUBPESTAÑA 6: CUERPO TÉCNICO & STAFF
            =================================================================== */}
        {activeTeamTab === 'coaching' && (
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                <span>Cuerpo Técnico y Liderazgo Deportivo</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Entrenador jefe, capitanes y directrices metodológicas del equipo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Entrenador Principal */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-4 shadow-2xs">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D] font-extrabold text-xl flex items-center justify-center shrink-0">
                    {selectedTeam.coachName.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#B7F229]/25 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] font-bold text-[10px] uppercase">
                      Entrenador Jefe
                    </span>
                    <h3 className="text-lg font-extrabold text-[#0B1A2D] dark:text-white">
                      {selectedTeam.coachName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedTeam.coachSpecialty || 'Alta Competición FIP & FGP'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-3 border-t border-slate-100 dark:border-[#1A314D]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Contacto Directo:</span>
                    <span className="font-bold text-[#0B1A2D] dark:text-slate-200">{selectedTeam.coachPhone || '+34 600 11 22 33'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Certificación:</span>
                    <span className="font-bold text-[#6e9e02] dark:text-[#B7F229]">Nivel 2 Federación Española</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/60 dark:border-[#1A314D] text-xs space-y-1">
                  <span className="font-bold text-[#0B1A2D] dark:text-white block">Filosofía de Juego:</span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {selectedTeam.tacticalStyle || 'Presión en la red y control de ritmos en puntos largos.'}
                  </p>
                </div>
              </div>

              {/* Capitán Designado */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-4 shadow-2xs">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500 text-[#0B1A2D] font-extrabold text-xl flex items-center justify-center shrink-0">
                    <Crown className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px] uppercase">
                      Capitán Oficial
                    </span>
                    <h3 className="text-lg font-extrabold text-[#0B1A2D] dark:text-white">
                      {selectedTeam.captainName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Voz del equipo en acta arbitral y sorteos de pista.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-3 border-t border-slate-100 dark:border-[#1A314D]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Funciones:</span>
                    <span className="font-bold text-[#0B1A2D] dark:text-slate-200">Alineación, actas y pista</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Federación:</span>
                    <span className="font-bold text-[#6e9e02] dark:text-[#B7F229]">Habilitado para firma digital</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigateToPlayerProfile(selectedTeam.captainName, 'teams')}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#0B1A2D] hover:text-white dark:bg-[#071220] dark:hover:bg-[#B7F229] dark:hover:text-[#0B1A2D] text-[#0B1A2D] dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Ver Ficha del Capitán</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: AÑADIR JUGADOR A LA PLANTILLA */}
        {isAddPlayerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                    Añadir Jugador a {selectedTeam.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddPlayerModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPlayer} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre Completo del Jugador *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Rodrigo Valenzuela"
                    value={newPlayerForm.name}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nivel de Juego (1.0 - 7.0)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="1.0"
                      max="7.0"
                      value={newPlayerForm.level}
                      onChange={(e) => setNewPlayerForm({ ...newPlayerForm, level: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Lado Habitual
                    </label>
                    <select
                      value={newPlayerForm.position}
                      onChange={(e) => setNewPlayerForm({ ...newPlayerForm, position: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                    >
                      <option value="Revés">Revés</option>
                      <option value="Drive">Drive</option>
                      <option value="Ambas">Ambas</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono Móvil
                    </label>
                    <input
                      type="tel"
                      placeholder="+34 600..."
                      value={newPlayerForm.phone}
                      onChange={(e) => setNewPlayerForm({ ...newPlayerForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nº Licencia FGP
                    </label>
                    <input
                      type="text"
                      placeholder="GA-9912-M"
                      value={newPlayerForm.federationLicense}
                      onChange={(e) => setNewPlayerForm({ ...newPlayerForm, federationLicense: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] font-mono"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPlayerForm.isCaptain}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, isCaptain: e.target.checked })}
                    className="rounded accent-[#0B1A2D] dark:accent-[#B7F229]"
                  />
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Designar directamente como Capitán del Equipo
                  </span>
                </label>

                <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddPlayerModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold transition shadow-2xs cursor-pointer"
                  >
                    Añadir Jugador
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: NUEVA CONVOCATORIA DE PARTIDO */}
        {isNewCalloutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                    Abrir Convocatoria Oficial
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewCalloutModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCallout} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Competición Oficial
                  </label>
                  <input
                    type="text"
                    required
                    value={newCalloutForm.competition}
                    onChange={(e) => setNewCalloutForm({ ...newCalloutForm, competition: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Club Rival
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Club Pádel Coruña"
                      value={newCalloutForm.rivalClub}
                      onChange={(e) => setNewCalloutForm({ ...newCalloutForm, rivalClub: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Equipo Específico
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Coruña Pro A"
                      value={newCalloutForm.rivalTeam}
                      onChange={(e) => setNewCalloutForm({ ...newCalloutForm, rivalTeam: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Fecha del Encuentro
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Domingo 19 Octubre 2026"
                      value={newCalloutForm.date}
                      onChange={(e) => setNewCalloutForm({ ...newCalloutForm, date: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Hora de Citación
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="11:00"
                      value={newCalloutForm.time}
                      onChange={(e) => setNewCalloutForm({ ...newCalloutForm, time: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dirección / Ubicación de la Instalación
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Calle, número, código postal y ciudad..."
                    value={newCalloutForm.address}
                    onChange={(e) => setNewCalloutForm({ ...newCalloutForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewCalloutModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold transition shadow-2xs cursor-pointer"
                  >
                    Lanzar Convocatoria
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: COMPARTIR CONVOCATORIA WHATSAPP */}
        {isWhatsAppModalOpen && whatsAppCallout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                    Difusión por WhatsApp del Equipo
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWhatsAppModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600 dark:text-slate-400">
                  Mensaje formateado listo para enviar al grupo de WhatsApp del equipo con las confirmaciones actuales y el enlace de Google Maps:
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto text-[#0B1A2D] dark:text-slate-200">
                  {getWhatsAppMessage(whatsAppCallout, selectedTeam)}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(getWhatsAppMessage(whatsAppCallout, selectedTeam));
                      triggerDemoToast('Mensaje Copiado', 'Texto de la convocatoria copiado al portapapeles.', 'success');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071220] dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-slate-200 font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copiar Texto</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(getWhatsAppMessage(whatsAppCallout, selectedTeam))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs text-center"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Abrir WhatsApp Web</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PROGRAMAR ENTRENAMIENTO */}
        {isNewTrainingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                    Programar Turno de Entrenamiento
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewTrainingModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTraining} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Día de la Semana
                    </label>
                    <select
                      value={newTrainingForm.day}
                      onChange={(e) => setNewTrainingForm({ ...newTrainingForm, day: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                    >
                      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Horario
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="20:00 - 21:30"
                      value={newTrainingForm.time}
                      onChange={(e) => setNewTrainingForm({ ...newTrainingForm, time: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pista Asignada
                  </label>
                  <select
                    value={newTrainingForm.courtName}
                    onChange={(e) => setNewTrainingForm({ ...newTrainingForm, courtName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white font-bold focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  >
                    {(courts || []).map((c: any) => (
                      <option key={c.id} value={c.name}>
                        {c.name} {c.surface ? `(${c.surface})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Enfoque Técnico / Táctico
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newTrainingForm.focus}
                    onChange={(e) => setNewTrainingForm({ ...newTrainingForm, focus: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[#0B1A2D] dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />
                      <span>Sistema de Posiciones y Parejas</span>
                    </label>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        newTrainingForm.positionMode === 'fixed'
                          ? 'bg-[#8B5CF6]/15 text-[#6d28d9] dark:text-[#c4b5fd]'
                          : 'bg-[#B7F229]/25 text-[#0B1A2D] dark:bg-[#B7F229]/15 dark:text-[#B7F229]'
                      }`}
                    >
                      {newTrainingForm.positionMode === 'fixed' ? 'Posiciones Fijas' : 'Recomendadas'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewTrainingForm({ ...newTrainingForm, positionMode: 'recommended' })}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        newTrainingForm.positionMode === 'recommended'
                          ? 'bg-white dark:bg-[#0E2239] border-[#0B1A2D] dark:border-[#B7F229] text-[#0B1A2D] dark:text-white font-bold shadow-2xs'
                          : 'bg-slate-100 dark:bg-[#0E2239]/50 border-slate-200 dark:border-[#1A314D] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-bold">Modo Recomendado</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-snug">
                        Los jugadores rotan lado (Drive/Revés) y pareja de entrenamiento.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewTrainingForm({ ...newTrainingForm, positionMode: 'fixed' })}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        newTrainingForm.positionMode === 'fixed'
                          ? 'bg-white dark:bg-[#0E2239] border-[#8B5CF6] text-[#0B1A2D] dark:text-white font-bold shadow-2xs'
                          : 'bg-slate-100 dark:bg-[#0E2239]/50 border-slate-200 dark:border-[#1A314D] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#8B5CF6]" />
                        <span>Posiciones Fijas</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-snug">
                        Posición estricta asignada por el entrenador sin cambio.
                      </div>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewTrainingModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold transition shadow-2xs cursor-pointer"
                  >
                    Guardar Sesión
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VISTA PRINCIPAL: EQUIPOS (DISEÑO MINIMALISTA SETMIO)
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto pt-3 pb-24 sm:pb-16 space-y-6 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased animate-in fade-in duration-150">
      {/* 1. Cabecera Limpia con Título "Equipos" + Menú Desplegable "+" */}
      <section className="pt-2 pb-1 space-y-4" data-purpose="header-section">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 tracking-wide block mb-1">
              {currentTenant?.name || 'Centro de Pádel San Mateo'}
            </span>
            <h1 className="text-[26px] sm:text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight leading-tight">
              Equipos
            </h1>
          </div>

          <div className="relative shrink-0" ref={actionMenuRef}>
            <button
              type="button"
              onClick={() => setIsActionMenuOpen((prev) => !prev)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition-colors cursor-pointer active:scale-95"
              title="Añadir Equipo"
              aria-label="Añadir Equipo"
              aria-expanded={isActionMenuOpen}
            >
              <Plus className="w-6 h-6 stroke-[2.2]" />
            </button>

            {isActionMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] shadow-xl py-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    setIsNewTeamModalOpen(true);
                  }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#132A45] hover:text-[#0B1A2D] dark:hover:text-[#B7F229] flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                  <span>Nuevo Equipo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Barra de Búsqueda + Filtro Flotando Directamente en Una Única Línea */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 w-full">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar equipo, categoría o capitán..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] text-xs sm:text-sm text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] transition shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            aria-label="Filtros de equipos"
            title="Filtros"
            className={`shrink-0 h-[40px] sm:h-[42px] px-3 sm:px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border shadow-2xs active:scale-95 ${
              activeFiltersCount > 0
                ? 'bg-[#0B1A2D] text-[#B7F229] border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229]'
                : 'bg-white dark:bg-[#0E2239] border-slate-200/90 dark:border-[#1A314D] text-[#0B1A2D] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#132A45]'
            }`}
          >
            <Filter className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <span
                className={`w-4 h-4 rounded-full font-mono text-[10px] flex items-center justify-center font-extrabold ${
                  activeFiltersCount > 0
                    ? 'bg-[#B7F229] text-[#0B1A2D] dark:bg-[#0B1A2D] dark:text-[#B7F229]'
                    : ''
                }`}
              >
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Chips activos directamente sobre el fondo si hay filtros */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {filterGender !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-slate-200 font-semibold capitalize">
                <span>Género: {filterGender}</span>
                <button type="button" onClick={() => setFilterGender('all')} className="hover:text-rose-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filterAge !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-slate-200 font-semibold capitalize">
                <span>Edad: {filterAge}</span>
                <button type="button" onClick={() => setFilterAge('all')} className="hover:text-rose-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {isMultiVenue && filterVenue !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-[#B7F229] font-semibold">
                <MapPin className="w-3 h-3 shrink-0" />
                <span>{venues.find((v) => v.id === filterVenue)?.name || filterVenue}</span>
                <button type="button" onClick={() => setFilterVenue('all')} className="hover:text-rose-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setFilterGender('all');
                setFilterAge('all');
                setFilterVenue('all');
              }}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition cursor-pointer px-2 py-1"
            >
              Limpiar
            </button>
          </div>
        )}
      </div>

      {/* 3. Grid de Tarjetas de Equipos */}
      {filteredTeams.length === 0 ? (
        <div className="p-12 mb-8 rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-center space-y-3 shadow-2xs">
          <Shield className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
            No hay equipos que coincidan con la búsqueda
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Prueba a modificar los filtros de género, edad o sede para ver más equipos registrados.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setFilterGender('all');
              setFilterAge('all');
              setFilterVenue('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-[#0B1A2D] dark:text-slate-200 font-bold text-xs cursor-pointer hover:bg-slate-200 dark:hover:bg-[#132A45] transition"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-8">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D]/30 dark:hover:border-[#B7F229]/50 shadow-2xs overflow-hidden flex flex-col justify-between transition group hover:shadow-md"
            >
              {/* Imagen representativa del equipo */}
              <div className="relative h-44 w-full bg-[#071220] overflow-hidden">
                <TeamBannerImage
                  src={team.photoUrl}
                  alt={team.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#071220] via-[#071220]/30 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#B7F229] text-[#0B1A2D] font-extrabold text-[10px] uppercase shadow-sm truncate max-w-[60%]">
                    {team.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#071220]/85 backdrop-blur-xs text-white text-[10px] font-bold border border-white/15 capitalize shrink-0">
                    {team.gender} · {team.ageGroup}
                  </span>
                </div>

                {team.venueName && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071220]/90 backdrop-blur-xs text-white text-[10px] font-bold border border-white/15 shadow-sm">
                    <MapPin className="w-3 h-3 text-[#B7F229] shrink-0" />
                    <span className="truncate max-w-[200px]">{team.venueName}</span>
                  </div>
                )}
              </div>

              {/* Contenido del equipo */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white leading-tight">
                    {team.name}
                  </h2>

                  <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-100 dark:border-[#1A314D]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Capitán</span>
                      </span>
                      <strong className="text-[#0B1A2D] dark:text-slate-100 font-bold truncate">
                        {team.captainName}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span>Entrenador</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {team.coachName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span>Jugadores</span>
                      <span className="font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                        {team.players.length} fichas
                      </span>
                    </div>
                  </div>

                  {team.callouts.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/70 dark:border-[#1A314D] text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 truncate">
                        <Navigation className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
                        <span className="truncate">Próximo encuentro</span>
                      </span>
                      <span className="font-bold text-[#0B1A2D] dark:text-white shrink-0">
                        {team.callouts[0].date.split(' ')[0]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D]">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTeam(team);
                      setActiveTeamTab('players');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:hover:bg-[#c8fa48] dark:text-[#0B1A2D] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <span>Ver Equipo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================================
          MODAL MINIMALISTA DE FILTROS (GÉNERO, EDAD Y MULTI-SEDE)
          ===================================================================== */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl space-y-5 text-[#0B1A2D] dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Filtros de Equipos
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {isMultiVenue && venues.length > 1 && (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />
                    <span>Sede del Club:</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFilterVenue('all')}
                      className={`p-2.5 rounded-xl border text-left font-bold transition cursor-pointer ${
                        filterVenue === 'all'
                          ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229]'
                          : 'bg-slate-50 dark:bg-[#071220] border-slate-200 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      Todas las Sedes
                    </button>
                    {venues.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setFilterVenue(v.id)}
                        className={`p-2.5 rounded-xl border text-left font-bold transition cursor-pointer truncate ${
                          filterVenue === v.id
                            ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229]'
                            : 'bg-slate-50 dark:bg-[#071220] border-slate-200 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Modalidad / Género:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['all', 'masculino', 'femenino', 'mixto'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFilterGender(g)}
                      className={`py-2 px-3 rounded-xl border text-center font-bold capitalize transition cursor-pointer ${
                        filterGender === g
                          ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229] shadow-2xs'
                          : 'bg-slate-50 dark:bg-[#071220] border-slate-200 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {g === 'all' ? 'Todos' : g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Categoría de Edad:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['all', 'absoluto', 'veteranos', 'menores'] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setFilterAge(a)}
                      className={`py-2 px-3 rounded-xl border text-center font-bold capitalize transition cursor-pointer ${
                        filterAge === a
                          ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229] shadow-2xs'
                          : 'bg-slate-50 dark:bg-[#071220] border-slate-200 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {a === 'all' ? 'Todos' : a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setFilterGender('all');
                  setFilterAge('all');
                  setFilterVenue('all');
                }}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white font-bold text-xs cursor-pointer"
              >
                Limpiar Todo
              </button>

              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold text-xs transition shadow-2xs cursor-pointer active:scale-95"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: NUEVO EQUIPO
          ===================================================================== */}
      {isNewTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl text-[#0B1A2D] dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Crear Nuevo Equipo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewTeamModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>
              </div>

              {isMultiVenue && venues.length > 1 && (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />
                    <span>Sede del Equipo *</span>
                  </label>
                  <select
                    value={newTeamForm.venueId}
                    onChange={(e) => setNewTeamForm({ ...newTeamForm, venueId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  >
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL de Imagen Representativa
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newTeamForm.photoUrl}
                  onChange={(e) => setNewTeamForm({ ...newTeamForm, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jugadores iniciales (uno por línea)
                </label>
                <textarea
                  rows={3}
                  placeholder={'Carlos Méndez\nDiego Soto\nMateo Varela'}
                  value={newTeamForm.initialPlayersText}
                  onChange={(e) => setNewTeamForm({ ...newTeamForm, initialPlayersText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTeamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold transition shadow-2xs cursor-pointer"
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
