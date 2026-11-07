import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Tournament, TournamentBracketMatch, TournamentSponsor, RegisteredPair } from '../../types/database';
import {
  Trophy,
  Plus,
  Calendar,
  Award,
  CheckCircle2,
  Users,
  Search,
  Filter,
  Lock,
  Download,
  Eye,
  CreditCard,
  Building,
  Sparkles,
  Clock,
  X,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Shield,
  Layers,
  Check,
  Medal,
  Radio,
  Edit3,
  TrendingDown,
  Minus,
  Save,
  LayoutGrid,
  Phone,
  Mail,
  Share2,
  FileText,
  List,
  GitBranch,
} from 'lucide-react';

export interface ProBracketMatch {
  id: string;
  category: string;
  round: 'Cuartos' | 'Semifinal' | 'Final';
  matchIndex: number;
  seed1?: string;
  team1: string;
  seed2?: string;
  team2: string;
  status: 'live' | 'completed' | 'scheduled';
  liveStatusLabel?: string;
  courtName: string;
  scheduledTime: string;
  set1Team1?: number;
  set1Team2?: number;
  set2Team1?: number;
  set2Team2?: number;
  set3Team1?: number;
  set3Team2?: number;
  winner?: 1 | 2;
}

const INITIAL_PRO_BRACKETS: ProBracketMatch[] = [
  // 1ª Categoría Masculina
  {
    id: 'b-1',
    category: '1ª Categoría Masculina',
    round: 'Cuartos',
    matchIndex: 1,
    seed1: 'CS1',
    team1: 'Carlos Méndez / Diego Soto',
    team2: 'Javier Fraga / Alberto Pena',
    status: 'completed',
    courtName: 'Pista 1 Central',
    scheduledTime: 'Viernes 18:00',
    set1Team1: 6,
    set1Team2: 4,
    set2Team1: 7,
    set2Team2: 5,
    winner: 1,
  },
  {
    id: 'b-2',
    category: '1ª Categoría Masculina',
    round: 'Cuartos',
    matchIndex: 2,
    seed1: 'CS4',
    team1: 'Lucas Gómez / Elena Permuy',
    team2: 'Lucas Dopico / Sara Fandiño',
    status: 'completed',
    courtName: 'Pista 2 Panorámica',
    scheduledTime: 'Viernes 19:30',
    set1Team1: 6,
    set1Team2: 3,
    set2Team1: 6,
    set2Team2: 2,
    winner: 1,
  },
  {
    id: 'b-3',
    category: '1ª Categoría Masculina',
    round: 'Cuartos',
    matchIndex: 3,
    seed1: 'CS2',
    team1: 'Mateo Varela / Rubén Loureiro',
    team2: 'Brais Barreiro / Marcos Castro',
    status: 'completed',
    courtName: 'Pista 1 Central',
    scheduledTime: 'Viernes 21:00',
    set1Team1: 6,
    set1Team2: 1,
    set2Team1: 6,
    set2Team2: 2,
    winner: 1,
  },
  {
    id: 'b-4',
    category: '1ª Categoría Masculina',
    round: 'Cuartos',
    matchIndex: 4,
    seed1: 'CS3',
    team1: 'Pablo Rey Jr. / Manuel Permuy Jr.',
    team2: 'David Morales / Iván Blanco',
    status: 'completed',
    courtName: 'Pista 3 Indoor Pro',
    scheduledTime: 'Sábado 10:00',
    set1Team1: 7,
    set1Team2: 6,
    set2Team1: 3,
    set2Team2: 6,
    set3Team1: 6,
    set3Team2: 4,
    winner: 1,
  },
  {
    id: 'b-5',
    category: '1ª Categoría Masculina',
    round: 'Semifinal',
    matchIndex: 1,
    seed1: 'CS1',
    team1: 'Carlos Méndez / Diego Soto',
    team2: 'Lucas Gómez / Elena Permuy',
    status: 'live',
    liveStatusLabel: 'Set 2 en juego (4-3)',
    courtName: 'Pista 1 Central',
    scheduledTime: 'Sábado 17:30',
    set1Team1: 6,
    set1Team2: 3,
    set2Team1: 4,
    set2Team2: 3,
  },
  {
    id: 'b-6',
    category: '1ª Categoría Masculina',
    round: 'Semifinal',
    matchIndex: 2,
    seed1: 'CS2',
    team1: 'Mateo Varela / Rubén Loureiro',
    team2: 'Pablo Rey Jr. / Manuel Permuy Jr.',
    status: 'scheduled',
    courtName: 'Pista 2 Panorámica',
    scheduledTime: 'Sábado 19:00',
  },
  {
    id: 'b-7',
    category: '1ª Categoría Masculina',
    round: 'Final',
    matchIndex: 1,
    team1: 'Ganador Semifinal 1',
    team2: 'Ganador Semifinal 2',
    status: 'scheduled',
    courtName: 'Pista 1 Central',
    scheduledTime: 'Domingo 12:00',
  },

  // 2ª Categoría Masculina
  {
    id: 'b-8',
    category: '2ª Categoría Masculina',
    round: 'Cuartos',
    matchIndex: 1,
    team1: 'Rodrigo Suárez / Hugo Paz',
    team2: 'Pedro Míguez / Lucas Ramos',
    status: 'completed',
    courtName: 'Pista 3 Indoor Pro',
    scheduledTime: 'Viernes 17:00',
    set1Team1: 6,
    set1Team2: 2,
    set2Team1: 6,
    set2Team2: 4,
    winner: 1,
  },
  {
    id: 'b-9',
    category: '2ª Categoría Masculina',
    round: 'Cuartos',
    matchIndex: 2,
    team1: 'Marcos Vello / Juan Freire',
    team2: 'Alejandro Ramos / Óscar Díaz',
    status: 'completed',
    courtName: 'Pista 4 Cubierta',
    scheduledTime: 'Viernes 18:30',
    set1Team1: 6,
    set1Team2: 4,
    set2Team1: 7,
    set2Team2: 5,
    winner: 1,
  },
  {
    id: 'b-10',
    category: '2ª Categoría Masculina',
    round: 'Semifinal',
    matchIndex: 1,
    team1: 'Rodrigo Suárez / Hugo Paz',
    team2: 'Marcos Vello / Juan Freire',
    status: 'scheduled',
    courtName: 'Pista 3 Indoor Pro',
    scheduledTime: 'Sábado 16:00',
  },
  {
    id: 'b-11',
    category: '2ª Categoría Masculina',
    round: 'Final',
    matchIndex: 1,
    team1: 'Ganador Semifinal 1',
    team2: 'Ganador Semifinal 2',
    status: 'scheduled',
    courtName: 'Pista 2 Panorámica',
    scheduledTime: 'Domingo 10:30',
  },
];

export const AdminTournaments: React.FC = () => {
  const {
    tournaments,
    courts,
    createBooking,
    triggerDemoToast,
    currentTenant,
    rankings,
    createRanking,
    linkTournamentToRanking,
    customers,
    navigateToPlayerProfile,
    t,
  } = useApp();

  // Navigation tab: Competiciones vs Rankings
  const [activeTab, setActiveTab] = useState<'tournaments' | 'rankings'>('tournaments');
  const [selectedRankingCategoryFilter, setSelectedRankingCategoryFilter] = useState<string>('all');
  const [selectedRankingId, setSelectedRankingId] = useState<string>('all');
  const [isCreateRankingModalOpen, setIsCreateRankingModalOpen] = useState(false);
  const [newRankingForm, setNewRankingForm] = useState({
    name: '',
    category: 'Absoluto',
    season: 'Temporada 2026',
    description: '',
  });

  // Selected tournament ID for detailed view
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);

  // Sub-tab inside the dedicated detail view
  const [detailSubTab, setDetailSubTab] = useState<'info' | 'draws' | 'schedule' | 'inscriptions'>('info');
  const [selectedDrawCategory, setSelectedDrawCategory] = useState<string>('1ª Categoría Masculina');

  // Modo de visualización de cuadro: 'horizontal' (árbol deslizante) vs 'list' (columnas)
  const [bracketViewMode, setBracketViewMode] = useState<'horizontal' | 'list'>('horizontal');

  // Modal de detalles del partido
  const [selectedBracketMatchForDetail, setSelectedBracketMatchForDetail] = useState<ProBracketMatch | null>(null);

  // Modal de perfil público del jugador
  const [publicProfilePlayer, setPublicProfilePlayer] = useState<{
    name: string;
    avatarUrl: string;
    level: number;
    phone: string;
    email: string;
    matches: number;
    position: string;
    hand: string;
  } | null>(null);

  const [posterModalUrl, setPosterModalUrl] = useState<string | null>(null);
  const [tournamentSearch, setTournamentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'registration_open' | 'in_progress' | 'completed'>('all');

  // Interactive Brackets State
  const [brackets, setBrackets] = useState<ProBracketMatch[]>(INITIAL_PRO_BRACKETS);
  const [editingScoreMatch, setEditingScoreMatch] = useState<ProBracketMatch | null>(null);
  const [scoreForm, setScoreForm] = useState({
    set1Team1: 6,
    set1Team2: 4,
    set2Team1: 6,
    set2Team2: 3,
    set3Team1: 0,
    set3Team2: 0,
    status: 'completed' as 'live' | 'completed' | 'scheduled',
    winner: 1 as 1 | 2,
  });

  // Global Inscription Modal State
  const [isInscriptionModalOpen, setIsInscriptionModalOpen] = useState(false);
  const [selectedTournamentForInscription, setSelectedTournamentForInscription] = useState<string>(
    tournaments[0]?.id || ''
  );
  const [pairCategory, setPairCategory] = useState<string>('1ª Categoría Masculina');
  const [player1Name, setPlayer1Name] = useState('Carlos Méndez');
  const [player2Name, setPlayer2Name] = useState('Diego Soto');
  const [pairPaymentMethod, setPairPaymentMethod] = useState<'online' | 'club' | 'wallet'>('club');

  // Create Tournament Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDates, setNewDates] = useState('18 al 21 Noviembre 2026');
  const [newFormat, setNewFormat] = useState<'elimination' | 'league' | 'pozo' | 'league_and_elimination'>('elimination');
  const [newRanking, setNewRanking] = useState('Circuito Setmio Oro');
  const [newEntryFee, setNewEntryFee] = useState(25.0);

  // Club simulated members database for autocomplete
  const clubMembers = [
    { name: 'Carlos Méndez', email: 'carlos.mendez@galiciapadel.com', phone: '+34 611 22 33 44', level: 3.85 },
    { name: 'Diego Soto', email: 'diego.soto@email.es', phone: '+34 622 33 44 55', level: 3.9 },
    { name: 'Mateo Varela', email: 'mateo@padelsanmateo.es', phone: '+34 600 11 22 33', level: 5.5 },
    { name: 'Rosa Carballo', email: 'rosa.carballo@email.es', phone: '+34 633 11 44 22', level: 4.5 },
    { name: 'Laura Senra', email: 'laura.senra@padelsanmateo.es', phone: '+34 655 44 33 22', level: 5.0 },
    { name: 'Javier Fraga', email: 'javi.fraga@email.es', phone: '+34 644 55 66 77', level: 4.1 },
    { name: 'Rubén Loureiro', email: 'ruben.loureiro@email.es', phone: '+34 666 77 88 99', level: 4.5 },
  ];

  // Demo pairs list
  const [registeredPairs, setRegisteredPairs] = useState<RegisteredPair[]>([
    {
      id: 'pair-1',
      player1: { id: 'p1', name: 'Carlos Méndez', email: 'carlos.mendez@galiciapadel.com', phone: '+34 611 22 33 44', level: 3.85 },
      player2: { id: 'p2', name: 'Diego Soto', email: 'diego.soto@email.es', phone: '+34 622 33 44 55', level: 3.9 },
      category: '1ª Categoría Masculina',
      paymentStatus: 'paid',
      paymentMethod: 'club',
      status: 'confirmed',
      createdAt: '01/10/2026',
    },
    {
      id: 'pair-2',
      player1: { id: 'p3', name: 'Mateo Varela', email: 'mateo@padelsanmateo.es', phone: '+34 600 11 22 33', level: 5.5 },
      player2: { id: 'p4', name: 'Rubén Loureiro', email: 'ruben.loureiro@email.es', phone: '+34 666 77 88 99', level: 4.5 },
      category: '1ª Categoría Masculina',
      paymentStatus: 'paid',
      paymentMethod: 'online',
      status: 'confirmed',
      createdAt: '01/10/2026',
    },
    {
      id: 'pair-3',
      player1: { id: 'p5', name: 'Rosa Carballo', email: 'rosa.carballo@email.es', phone: '+34 633 11 44 22', level: 4.5 },
      player2: { id: 'p6', name: 'Laura Senra', email: 'laura.senra@padelsanmateo.es', phone: '+34 655 44 33 22', level: 5.0 },
      category: '1ª Categoría Femenina',
      paymentStatus: 'pending',
      paymentMethod: 'club',
      status: 'pending_partner',
      createdAt: '02/10/2026',
    },
  ]);

  // Tournament Sponsors
  const tournamentSponsors: TournamentSponsor[] = [
    { id: 'sp-1', name: 'Estrella Galicia 0,0', logoUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=200&q=80', websiteUrl: 'https://estrellagalicia.es', description: 'Patrocinador oficial de avituallamiento y entrega de premios.' },
    { id: 'sp-2', name: 'Bullpadel Oficial', logoUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=200&q=80', websiteUrl: 'https://bullpadel.com', description: 'Pala oficial del torneo y paleteros para campeones.' },
    { id: 'sp-3', name: 'Clínica Fisioterapia Narón', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&q=80', websiteUrl: 'https://fisionaron.es', description: 'Atención fisioterapéutica en pista durante semifinales y finales.' },
  ];

  const DEMO_PLAYER_AVATARS: Record<string, string> = {
    'Carlos Méndez': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    'Diego Soto': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    'Javier Fraga': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    'Alberto Pena': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    'Lucas Gómez': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'Elena Permuy': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    'Lucas Dopico': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    'Sara Fandiño': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'Mateo Varela': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'Rubén Loureiro': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    'Brais Barreiro': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    'Marcos Castro': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    'Pablo Rey Jr.': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    'Manuel Permuy Jr.': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'David Morales': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    'Iván Blanco': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  };

  const getPlayerAvatar = (name: string): string => {
    const cleanName = name.trim();
    if (DEMO_PLAYER_AVATARS[cleanName]) return DEMO_PLAYER_AVATARS[cleanName];
    const found = customers?.find((c) => c.name.toLowerCase() === cleanName.toLowerCase());
    if (found?.avatarUrl) return found.avatarUrl;
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
  };

  const handleViewPlayerProfile = (name: string) => {
    const cleanName = name.trim();
    const found = customers?.find((c) => c.name.toLowerCase() === cleanName.toLowerCase());
    setPublicProfilePlayer({
      name: cleanName,
      avatarUrl: getPlayerAvatar(cleanName),
      level: found?.level || 4.25,
      phone: found?.phone || '+34 600 12 34 56',
      email: found?.email || `${cleanName.toLowerCase().replace(/\s+/g, '.')}@email.es`,
      matches: found?.matches || 24,
      position: found?.position || 'Revés',
      hand: found?.hand || 'Diestro',
    });
  };

  // URL Sync
  useEffect(() => {
    const handleUrlTournament = () => {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      if (
        pathname.startsWith('/admin/competiciones/') ||
        pathname.startsWith('/gestion/competiciones/') ||
        pathname.startsWith('/gestion/torneos/') ||
        pathname.startsWith('/admin/torneos/')
      ) {
        const idOrSlug = pathname
          .replace('/admin/competiciones/', '')
          .replace('/gestion/competiciones/', '')
          .replace('/gestion/torneos/', '')
          .replace('/admin/torneos/', '')
          .trim()
          .toLowerCase();

        if (idOrSlug) {
          const found = tournaments.find(
            (item) =>
              item.id.toLowerCase() === idOrSlug ||
              item.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-') === idOrSlug ||
              item.title.toLowerCase().includes(idOrSlug.replace(/-/g, ' '))
          );
          if (found) {
            setSelectedTournamentId(found.id);
            return;
          }
        }
      }

      if (
        pathname === '/admin/competiciones' ||
        pathname === '/gestion/competiciones' ||
        pathname === '/admin/torneos' ||
        pathname === '/gestion/torneos'
      ) {
        setSelectedTournamentId(null);
      }
    };

    handleUrlTournament();
    window.addEventListener('popstate', handleUrlTournament);
    return () => window.removeEventListener('popstate', handleUrlTournament);
  }, [tournaments]);

  const selectedTournament = tournaments.find((item) => item.id === selectedTournamentId) || tournaments[0];

  // Available categories for currently selected tournament in inscription modal
  const inscriptionTournament = tournaments.find((t) => t.id === selectedTournamentForInscription) || tournaments[0];
  const inscriptionAvailableCategories = inscriptionTournament?.categories?.map((c) => c.name) || [
    '1ª Categoría Masculina',
    '2ª Categoría Masculina',
    '1ª Categoría Femenina',
    '3ª Mixta Open',
  ];

  // Handle opening tournament detail
  const handleOpenDetail = (tournament: Tournament) => {
    setSelectedTournamentId(tournament.id);
    setDetailSubTab('info');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/admin/competiciones/${tournament.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle back to competitions list
  const handleBackToList = () => {
    setSelectedTournamentId(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/admin/competiciones');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Block courts in agenda
  const handleBlockCourtsInAgenda = () => {
    brackets.forEach((match, index) => {
      const targetCourt = courts.find((c) => c.name === match.courtName) || courts[index % courts.length];
      createBooking({
        courtId: targetCourt.id,
        courtName: targetCourt.name,
        creatorId: 'sys-tournament-block',
        creatorName: `Competición: ${selectedTournament.title} (${match.round})`,
        startTime: `2026-10-10T18:00:00Z`,
        endTime: `2026-10-10T19:30:00Z`,
        status: 'confirmed',
        totalPrice: 0,
        paymentStatus: 'paid',
        isSplitPayment: false,
        participants: [
          { name: match.team1, paid: true, amount: 0 },
          { name: match.team2, paid: true, amount: 0 },
        ],
        accessPin: 'TORNEO',
        notes: `Bloqueo para ${match.round}: ${match.team1} vs ${match.team2}`,
      });
    });

    triggerDemoToast(
      'Pistas Bloqueadas en Agenda',
      `Se han reservado y bloqueado ${brackets.length} franjas en la agenda del club para los cruces oficiales.`,
      'success'
    );
  };

  // Register pair submit
  const handleRegisterPair = (e: React.FormEvent) => {
    e.preventDefault();
    const p1 = clubMembers.find((m) => m.name === player1Name) || clubMembers[0];
    const p2 = clubMembers.find((m) => m.name === player2Name) || clubMembers[1];

    const newPair: RegisteredPair = {
      id: `pair-${Date.now()}`,
      player1: { id: `u-${Date.now()}-1`, name: p1.name, email: p1.email, phone: p1.phone, level: p1.level },
      player2: { id: `u-${Date.now()}-2`, name: p2.name, email: p2.email, phone: p2.phone, level: p2.level },
      category: pairCategory,
      paymentStatus: pairPaymentMethod === 'online' ? 'paid' : 'pending',
      paymentMethod: pairPaymentMethod === 'wallet' ? 'club' : pairPaymentMethod,
      status: 'confirmed',
      createdAt: 'Hoy',
    };

    setRegisteredPairs([newPair, ...registeredPairs]);
    setIsInscriptionModalOpen(false);

    triggerDemoToast(
      'Inscripción Registrada',
      `Pareja ${p1.name} y ${p2.name} inscrita en ${pairCategory} para "${inscriptionTournament.title}".`,
      'success'
    );
  };

  // Open Score Editor for Match
  const handleOpenScoreEditor = (match: ProBracketMatch) => {
    setEditingScoreMatch(match);
    setScoreForm({
      set1Team1: match.set1Team1 ?? 6,
      set1Team2: match.set1Team2 ?? 4,
      set2Team1: match.set2Team1 ?? 6,
      set2Team2: match.set2Team2 ?? 3,
      set3Team1: match.set3Team1 ?? 0,
      set3Team2: match.set3Team2 ?? 0,
      status: match.status,
      winner: match.winner ?? 1,
    });
  };

  // Save Score Submit
  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScoreMatch) return;

    setBrackets((prev) =>
      prev.map((m) =>
        m.id === editingScoreMatch.id
          ? {
              ...m,
              status: scoreForm.status,
              winner: scoreForm.status === 'completed' ? scoreForm.winner : undefined,
              set1Team1: Number(scoreForm.set1Team1),
              set1Team2: Number(scoreForm.set1Team2),
              set2Team1: Number(scoreForm.set2Team1),
              set2Team2: Number(scoreForm.set2Team2),
              set3Team1: Number(scoreForm.set3Team1),
              set3Team2: Number(scoreForm.set3Team2),
            }
          : m
      )
    );

    triggerDemoToast(
      t('tournaments.save_score', 'Marcador Guardado'),
      `Resultado del partido actualizado en el cuadro eliminatorio.`,
      'success'
    );
    setEditingScoreMatch(null);
  };

  // Filter tournaments list
  const filteredTournaments = tournaments.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(tournamentSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(tournamentSearch.toLowerCase()) ||
      (item.rankingCategory && item.rankingCategory.toLowerCase().includes(tournamentSearch.toLowerCase())) ||
      item.categories.some((cat) => cat.name.toLowerCase().includes(tournamentSearch.toLowerCase()));

    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Filter brackets by category
  const filteredCategoryBrackets = brackets.filter((b) => b.category === selectedDrawCategory);

  // Handle create new ranking submit
  const handleCreateRankingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRankingForm.name.trim()) return;

    createRanking({
      name: newRankingForm.name.trim(),
      category: newRankingForm.category,
      season: newRankingForm.season,
      description: newRankingForm.description.trim() || 'Ranking oficial de competición y partidas puntuables.',
      active: true,
      linkedTournamentIds: [],
      leaderboard: [
        {
          id: `rkp-${Date.now()}-1`,
          rank: 1,
          playerId: 'p-1',
          playerName: 'Carlos Méndez',
          isMember: true,
          level: 4.85,
          points: 1250,
          matchesWon: 14,
          matchesPlayed: 16,
          streak: '5V',
        },
        {
          id: `rkp-${Date.now()}-2`,
          rank: 2,
          playerId: 'p-2',
          playerName: 'Pablo Vello',
          isMember: true,
          level: 4.80,
          points: 1080,
          matchesWon: 12,
          matchesPlayed: 15,
          streak: '3V',
        },
        {
          id: `rkp-${Date.now()}-3`,
          rank: 3,
          playerId: 'p-3',
          playerName: 'Laura Senra',
          isMember: true,
          level: 5.00,
          points: 950,
          matchesWon: 11,
          matchesPlayed: 13,
          streak: '2V',
        },
        {
          id: `rkp-${Date.now()}-4`,
          rank: 4,
          playerId: 'p-4',
          playerName: 'Mateo Varela',
          isMember: true,
          level: 4.15,
          points: 780,
          matchesWon: 8,
          matchesPlayed: 12,
          streak: '1D',
        },
      ],
    });

    setNewRankingForm({
      name: '',
      category: 'Absoluto',
      season: 'Temporada 2026',
      description: '',
    });
    setIsCreateRankingModalOpen(false);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-16 font-sans">
      {/* ======================================================================
          VISTA 1: LISTADO PRINCIPAL DE COMPETICIONES / RANKINGS
          ====================================================================== */}
      {!selectedTournamentId ? (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header Principal Homogéneo */}
          <div className="flex items-center justify-between gap-3 pt-2 pb-1">
            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tracking-wide block mb-0.5">
                {currentTenant?.name || 'Centro de Pádel San Mateo'}
              </span>
              <h1 className="text-[22px] font-extrabold text-[#0B1A2D] dark:text-white tracking-tight leading-tight">
                Torneos & Competiciones
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedTournamentForInscription(tournaments[0]?.id || '');
                  setIsInscriptionModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0E2239] hover:bg-slate-200 dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200/80 dark:border-[#1A314D] transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Users className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span className="hidden sm:inline">Inscribir Pareja</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="p-1.5 text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0"
                title="Crear Torneo"
                aria-label="Crear Torneo"
              >
                <Plus className="w-5 h-5 stroke-[2.2]" />
                <span className="text-xs font-bold sm:inline hidden">Crear Torneo</span>
              </button>
            </div>
          </div>

          {/* Selector de Pestañas Minimalista (Segmented Control): Competiciones vs Rankings */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Buscador */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('tournaments.search_placeholder', 'Buscar torneo por título, formato o categoría...')}
                value={tournamentSearch}
                onChange={(e) => setTournamentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Segmented Control */}
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('tournaments')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'tournaments'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('tournaments.competitions_title', 'Competiciones')} ({tournaments.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rankings')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'rankings'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('tournaments.rankings_title', 'Rankings del Club')}
              </button>
            </div>
          </div>

          {/* ======================================================================
              CONTENIDO: LISTADO DE COMPETICIONES CON BOTÓN INSCRIBIRSE DIRECTO
              ====================================================================== */}
          {activeTab === 'tournaments' && (
            <div className="space-y-4">
              {/* Filtro de estado minimalista */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: `${t('tournaments.filter_all', 'Todos')} (${tournaments.length})` },
                  { id: 'registration_open', label: t('tournaments.filter_open', 'Inscripción Abierta') },
                  { id: 'in_progress', label: t('tournaments.filter_in_progress', 'En Juego') },
                  { id: 'completed', label: t('tournaments.filter_completed', 'Finalizados') },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setStatusFilter(f.id as typeof statusFilter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      statusFilter === f.id
                        ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D] shadow-xs'
                        : 'bg-white dark:bg-[#0E2239] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-[#1A314D]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Grid / Contenedores Rediseñados de Competiciones */}
              <div className="flex flex-col space-y-4 sm:space-y-5">
                {filteredTournaments.map((tournament) => {
                  const totalPairs = tournament.categories.reduce((acc, cat) => acc + cat.teamsCount, 0);
                  const maxPairs = tournament.categories.reduce((acc, cat) => acc + cat.maxTeams, 0);
                  const percentFilled = maxPairs > 0 ? Math.round((totalPairs / maxPairs) * 100) : 75;

                  return (
                    <div
                      key={tournament.id}
                      className="rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#B7F229]/60 transition-all duration-200 shadow-xs hover:shadow-md overflow-hidden flex flex-col md:flex-row group"
                    >
                      {/* Portada */}
                      <div className="relative w-full md:w-72 lg:w-80 h-48 md:h-auto shrink-0 overflow-hidden bg-[#0B1A2D]">
                        <img
                          src={tournament.bannerUrl}
                          alt={tournament.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0B1A2D]/80 via-[#0B1A2D]/20 to-transparent" />

                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${
                              tournament.status === 'registration_open'
                                ? 'bg-[#B7F229] text-[#0B1A2D]'
                                : tournament.status === 'in_progress'
                                ? 'bg-[#8B5CF6] text-white'
                                : 'bg-slate-700 text-white'
                            }`}
                          >
                            {tournament.status === 'registration_open'
                              ? t('tournaments.filter_open', 'Inscripción Abierta')
                              : tournament.status === 'in_progress'
                              ? t('tournaments.filter_in_progress', 'En Juego')
                              : t('tournaments.filter_completed', 'Finalizado')}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 text-white text-xs font-mono font-bold flex items-center gap-1.5 drop-shadow-md">
                          <Calendar className="w-3.5 h-3.5 text-[#B7F229]" />
                          <span>{tournament.dates}</span>
                        </div>
                      </div>

                      {/* Cuerpo Central */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-[#8B5CF6] dark:text-[#C4B5FD] bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 px-2.5 py-0.5 rounded-full">
                              {tournament.rankingCategory || 'Circuito Setmio Oro'}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono font-medium">
                              {tournament.format || 'Cuadro Eliminatorio'}
                            </span>
                          </div>

                          <h2
                            onClick={() => handleOpenDetail(tournament)}
                            className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight hover:text-[#8B5CF6] dark:hover:text-[#B7F229] transition cursor-pointer"
                          >
                            {tournament.title}
                          </h2>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {tournament.description}
                          </p>
                        </div>

                        {/* Resumen Ejecutivo */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-[#1A314D] text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#071220]/70 border border-slate-200/60 dark:border-[#1A314D]">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Inscritos</span>
                            <span className="font-black text-slate-900 dark:text-white font-mono text-xs">
                              {totalPairs} / {maxPairs} parejas
                            </span>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className="bg-[#B7F229] h-full rounded-full transition-all"
                                style={{ width: `${percentFilled}%` }}
                              />
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#071220]/70 border border-slate-200/60 dark:border-[#1A314D]">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Formato</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs capitalize truncate block">
                              {tournament.format || 'Eliminación Directa'}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#071220]/70 border border-slate-200/60 dark:border-[#1A314D]">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Categorías</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs font-mono">
                              {tournament.categories.length} oficiales
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#071220]/70 border border-slate-200/60 dark:border-[#1A314D]">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Premios</span>
                            <span className="font-bold text-[#8B5CF6] dark:text-[#C4B5FD] text-xs truncate block font-mono">
                              1.500 € + Trofeos
                            </span>
                          </div>
                        </div>

                        {/* Categorías y Cuota Oficial */}
                        <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-[#071220]/80 border border-slate-200/80 dark:border-[#1A314D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                              Categorías Oficiales:
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {tournament.categories.map((c) => (
                                <span
                                  key={c.name}
                                  className="text-[11px] font-bold text-[#0B1A2D] dark:text-[#B7F229] bg-[#F0FCCF] dark:bg-[#B7F229]/15 border border-[#B7F229]/30 px-2.5 py-0.5 rounded-lg"
                                >
                                  {c.name}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-[#1A314D]">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                              Cuota Inscripción:
                            </span>
                            <div className="flex items-baseline sm:justify-end gap-1 font-mono">
                              <span className="text-base font-black text-slate-900 dark:text-white">
                                {tournament.entryFee.toFixed(2)} €
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">/ jugador</span>
                            </div>
                          </div>
                        </div>

                        {/* Barra de Acciones de la Tarjeta con botón Ver torneo destacado */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-100 dark:border-[#1A314D]">
                          <div className="flex items-center gap-2">
                            {/* Botón Ver Cartel compacto */}
                            <button
                              type="button"
                              onClick={() => setPosterModalUrl(tournament.bannerUrl)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#071220] hover:bg-slate-200 dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border border-slate-200/60 dark:border-[#1A314D]"
                              title="Ver Cartel Oficial"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#8B5CF6]" />
                              <span>{t('tournaments.btn_view_poster', 'Ver cartel')}</span>
                            </button>

                            {/* Botón Inscribirse Directo */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTournamentForInscription(tournament.id);
                                setIsInscriptionModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#F0FCCF] dark:bg-[#B7F229]/20 hover:bg-[#E5F9AE] dark:hover:bg-[#B7F229]/30 text-[#0B1A2D] dark:text-[#B7F229] border border-[#B7F229]/40 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>{t('tournaments.btn_register_direct', 'Inscribirse')}</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenDetail(tournament)}
                            className="px-5 py-2.5 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] hover:bg-[#132A45] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] font-black text-xs transition shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer active:scale-95 ml-auto"
                          >
                            <span>{t('tournaments.btn_view_tournament', 'Ver torneo')}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================================
              CONTENIDO: MÓDULO INTEGRADO DE RANKINGS DEL CLUB
              ====================================================================== */}
          {activeTab === 'rankings' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Medal className="w-5 h-5 text-amber-500" />
                      <span>{t('tournaments.rankings_title', 'Rankings del Club')}</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Clasificaciones dinámicas acumuladas por victorias y torneos puntuables.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCreateRankingModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('tournaments.btnCreateRanking', 'Crear Ranking')}</span>
                  </button>
                </div>

                {/* Segmented Controls de Rankings por Categoría */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100 dark:border-slate-800">
                  {[
                    { id: 'all', label: 'General Absoluto del Club' },
                    { id: 'masculino_1', label: '1ª Categoría Masculina' },
                    { id: 'masculino_2', label: '2ª Categoría Masculina' },
                    { id: 'femenino', label: 'Femenino Oro' },
                    { id: 'mixto', label: 'Mixto Open' },
                  ].map((rFilter) => (
                    <button
                      key={rFilter.id}
                      type="button"
                      onClick={() => setSelectedRankingCategoryFilter(rFilter.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                        selectedRankingCategoryFilter === rFilter.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {rFilter.label}
                    </button>
                  ))}
                </div>

                {/* Tabla Moderna de Rankings */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-3 w-16">Pos.</th>
                        <th className="py-3 px-4">Jugador / Socio</th>
                        <th className="py-3 px-4 text-center">Nivel ELO</th>
                        <th className="py-3 px-4 text-center">Partidos (G / J)</th>
                        <th className="py-3 px-4 text-center">Racha</th>
                        <th className="py-3 px-4 text-right">Puntos Oficiales</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {[
                        { pos: 1, trend: 'up', player: 'Carlos Méndez', level: 4.85, won: 18, played: 20, streak: '6V', points: 1420 },
                        { pos: 2, trend: 'same', player: 'Pablo Vello', level: 4.80, won: 15, played: 18, streak: '3V', points: 1210 },
                        { pos: 3, trend: 'up', player: 'Laura Senra', level: 5.00, won: 14, played: 16, streak: '4V', points: 1140 },
                        { pos: 4, trend: 'down', player: 'Mateo Varela', level: 5.50, won: 12, played: 15, streak: '1D', points: 980 },
                        { pos: 5, trend: 'up', player: 'Diego Soto', level: 3.90, won: 11, played: 14, streak: '2V', points: 870 },
                        { pos: 6, trend: 'same', player: 'Javier Fraga', level: 4.10, won: 9, played: 13, streak: '1V', points: 750 },
                      ].map((row) => (
                        <tr key={row.pos} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5 font-bold font-mono">
                              <span className="text-slate-900 dark:text-white">#{row.pos}</span>
                              {row.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
                              {row.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
                              {row.trend === 'same' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-xs">
                                {row.player.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white">{row.player}</span>
                                <span className="ml-2 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded-sm">
                                  Socio
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                            {row.level.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-slate-600 dark:text-slate-400">
                            {row.won} / {row.played}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {row.streak}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-black text-sm text-slate-900 dark:text-white">
                            {row.points.toLocaleString()} pts
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ======================================================================
            VISTA 2: PÁGINA DETALLE DEL TORNEO (/admin/competiciones/[id])
            ====================================================================== */
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Barra Superior con Botón Volver Integrado y Estado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-[#1A314D]">
            <button
              type="button"
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0E2239] hover:bg-slate-50 dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1A314D] shadow-2xs font-bold text-xs transition cursor-pointer active:scale-95 group self-start"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:-translate-x-0.5 transition-transform stroke-[2.5]" />
              <span>{t('tournaments.btn_back', 'Volver a competiciones')}</span>
            </button>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {selectedTournament.dates}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] font-black text-[10px] uppercase border border-[#B7F229]/40">
                {selectedTournament.status === 'registration_open' ? 'Inscripción Abierta' : 'En Curso'}
              </span>
            </div>
          </div>

          {/* Cabecera / Primer Contenedor del Torneo: Máximo Contraste y Compacta */}
          <div className="rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] shadow-sm overflow-hidden flex flex-col md:flex-row">
            {/* Imagen del Cartel / Banner Delimitada y Proporcionada */}
            <div className="relative w-full md:w-64 lg:w-72 h-36 md:h-auto shrink-0 bg-[#0B1A2D] overflow-hidden">
              <img
                src={selectedTournament.bannerUrl}
                alt={selectedTournament.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0B1A2D]/80 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-[#B7F229] text-[#0B1A2D] text-[10px] font-black uppercase tracking-wider shadow-sm">
                  {selectedTournament.status === 'registration_open' ? 'Inscripción Abierta' : 'En Curso'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0B1A2D]/90 backdrop-blur-xs text-white text-[10px] font-bold border border-white/20">
                  {selectedTournament.rankingCategory || 'Circuito Setmio Oro'}
                </span>
              </div>
            </div>

            {/* Contenido Informativo con Fondo Sólido de Alto Contraste */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8B5CF6] dark:text-[#C4B5FD]">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{selectedTournament.dates}</span>
                  <span>·</span>
                  <span className="text-slate-500 dark:text-slate-400 font-normal">Sede Oficial Club</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {selectedTournament.title}
                </h1>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl line-clamp-2">
                  {selectedTournament.description}
                </p>
              </div>

              {/* Métricas y Datos Clave en Tira Tipográfica Lineal */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 dark:border-[#1A314D] text-xs">
                <div className="p-2.5 rounded-2xl bg-slate-50/80 dark:bg-[#071220]/70 border border-slate-200/60 dark:border-[#1A314D]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Inscripción</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white text-base">
                    {selectedTournament.entryFee.toFixed(2)} €
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">por jugador</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-50/80 dark:bg-[#071220]/70 border border-slate-200/60 dark:border-[#1A314D]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Parejas</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {selectedTournament.categories.reduce((acc, c) => acc + c.teamsCount, 0)} inscritas
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">en cuadros oficiales</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-50/80 dark:bg-[#071220]/70 border border-slate-200/60 dark:border-[#1A314D]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Categorías</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {selectedTournament.categories.length} divisiones
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">Masc / Fem / Mixto</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-50/80 dark:bg-[#071220]/70 border border-slate-200/60 dark:border-[#1A314D]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Premios</span>
                  <span className="font-mono font-bold text-[#8B5CF6] dark:text-[#C4B5FD] text-sm">
                    1.500 € + Trofeos
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">y textil oficial</span>
                </div>
              </div>

              {/* Botones de Acción dentro de la cabecera */}
              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2.5 border-t border-slate-100 dark:border-[#1A314D]">
                <button
                  type="button"
                  onClick={() => setPosterModalUrl(selectedTournament.bannerUrl)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071220] dark:hover:bg-[#132A45] text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-[#1A314D] transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                  title="Ver Cartel Oficial"
                >
                  <Eye className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>{t('tournaments.btn_view_poster', 'Ver cartel')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTournamentForInscription(selectedTournament.id);
                    setIsInscriptionModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a3db20] text-[#0B1A2D] font-black text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Users className="w-4 h-4" />
                  <span>{t('tournaments.btn_register_pair', 'Inscribir pareja')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sub-Tabs de Navegación del Detalle */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs text-xs font-semibold overflow-x-auto no-scrollbar">
            {[
              { id: 'info', label: t('tournaments.tab_info', 'Información Técnica & Bases'), icon: Award },
              { id: 'draws', label: t('tournaments.tab_brackets', 'Cuadros & Fases (Brackets)'), icon: Calendar },
              { id: 'schedule', label: t('tournaments.tab_schedule', 'Partidos & Horarios'), icon: Clock },
              { id: 'inscriptions', label: t('tournaments.tab_inscriptions', 'Inscripciones de Parejas'), icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = detailSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDetailSubTab(tab.id as typeof detailSubTab)}
                  className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D] font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* CONTENIDO PESTAÑA DETALLE 1: INFORMACIÓN TÉCNICA */}
          {detailSubTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-150">
              <div className="md:col-span-2 space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span>Bases Técnicas y Reglamento de Competición</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Formato de Juego</span>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {selectedTournament.format || 'Cuadro Eliminatorio con Consolación'}
                      </div>
                      <span className="text-[11px] text-slate-500">Mínimo 2 partidos garantizados por pareja.</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Bola Oficial</span>
                      <div className="font-bold text-slate-900 dark:text-white">Bullpadel Next Pro</div>
                      <span className="text-[11px] text-slate-500">Bolas nuevas en cada ronda del cuadro final.</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Welcome Pack Oficial</span>
                      <div className="font-bold text-slate-900 dark:text-white">Camiseta Técnica Oficial + Overgrip</div>
                      <span className="text-[11px] text-slate-500">Entrega en recepción el primer día de juego.</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Dotación de Premios</span>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">1.500 € en Metálico + Paleteros</div>
                      <span className="text-[11px] text-slate-500">Trofeos conmemorativos para campeones y subcampeones.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Lateral con Categorías */}
              <div className="space-y-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {t('tournaments.categories_title', 'Categorías de la Competición')}
                  </h3>
                  <div className="space-y-2 text-xs">
                    {selectedTournament.categories.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                          <div className="text-[11px] text-slate-400">Nivel Oficial</div>
                        </div>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {c.teamsCount} / {c.maxTeams}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO PESTAÑA DETALLE 2: CUADRO DE CRUCES / BRACKETS (ESTILO PROFESIONAL) */}
          {detailSubTab === 'draws' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Barra Superior: Categorías del Cuadro + Selector de Vista (Horizontal vs Lista) + Bloquear Pistas */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                {/* Selector de Categoría para el Cuadro */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {['1ª Categoría Masculina', '2ª Categoría Masculina', '1ª Categoría Femenina', '3ª Mixta Open'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedDrawCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                        selectedDrawCategory === cat
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Controles de la Derecha: Selector de Modo de Visualización y Bloqueo */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* Selector de Modo: Cuadro Horizontal Deslizante vs Formato Lista */}
                  <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 shrink-0">
                    <button
                      type="button"
                      onClick={() => setBracketViewMode('horizontal')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        bracketViewMode === 'horizontal'
                          ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Vista típica en árbol de cruces horizontal de pádel con scroll deslizante"
                    >
                      <GitBranch className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Cuadro Horizontal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBracketViewMode('list')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        bracketViewMode === 'list'
                          ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Vista en columnas / listado de partidos"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>Formato Lista</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleBlockCourtsInAgenda}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                  >
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>Bloquear en Agenda</span>
                  </button>
                </div>
              </div>

              {/* MODO 1: CUADRO HORIZONTAL DESLIZANTE (Típico de Pádel/Tenis con interactividad en cada llave) */}
              {bracketViewMode === 'horizontal' ? (
                <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
                  {/* Encabezado descriptivo del cuadro interactivo */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">
                          Cuadro Oficial Eliminatorio · {selectedDrawCategory}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Desplaza horizontalmente para ver las rondas. Haz clic sobre cualquier cruce para abrir la ficha detallada del partido.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Interactivo · Clic para detalles o actas</span>
                    </div>
                  </div>

                  {/* Contenedor Horizontal Deslizante */}
                  <div className="overflow-x-auto pb-4 pt-2 scrollbar-thin">
                    <div className="flex items-stretch gap-6 min-w-[1020px] py-2">
                      {/* 1. CUARTOS DE FINAL */}
                      <div className="w-72 shrink-0 flex flex-col justify-between space-y-3">
                        <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-between text-xs">
                          <span className="font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            Cuartos de Final
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">4 Partidos</span>
                        </div>

                        <div className="space-y-4 flex-1 flex flex-col justify-around">
                          {filteredCategoryBrackets
                            .filter((b) => b.round === 'Cuartos')
                            .map((m) => (
                              <div
                                key={m.id}
                                onClick={() => setSelectedBracketMatchForDetail(m)}
                                className={`p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border transition-all cursor-pointer group shadow-sm hover:border-emerald-500 hover:shadow-emerald-500/10 active:scale-[0.99] ${
                                  m.status === 'live'
                                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                                    : 'border-slate-700/80'
                                }`}
                                title="Haz clic para ver todos los detalles y estadísticas del partido"
                              >
                                <div className="flex items-center justify-between text-[10px] font-mono border-b border-slate-700/60 pb-1 mb-1.5">
                                  <span className="text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-emerald-400" />
                                    {m.scheduledTime}
                                  </span>
                                  {m.status === 'live' ? (
                                    <span className="text-emerald-400 font-black animate-pulse uppercase text-[9px]">
                                      ● En Juego
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">{m.courtName}</span>
                                  )}
                                </div>

                                {/* Parejas */}
                                <div className="space-y-1 text-xs">
                                  <div
                                    className={`flex items-center justify-between p-1 rounded-lg transition ${
                                      m.winner === 1 ? 'bg-emerald-500/20 text-emerald-300 font-black' : 'text-slate-200'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 truncate">
                                      {m.seed1 && (
                                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-700 text-slate-300">
                                          {m.seed1}
                                        </span>
                                      )}
                                      <span className="truncate">{m.team1}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-mono font-bold ml-2">
                                      <span className="w-3 text-center">{m.set1Team1 ?? '-'}</span>
                                      <span className="w-3 text-center">{m.set2Team1 ?? '-'}</span>
                                      {m.set3Team1 ? <span className="w-3 text-center">{m.set3Team1}</span> : null}
                                    </div>
                                  </div>

                                  <div
                                    className={`flex items-center justify-between p-1 rounded-lg transition ${
                                      m.winner === 2 ? 'bg-emerald-500/20 text-emerald-300 font-black' : 'text-slate-400'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 truncate">
                                      {m.seed2 && (
                                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-700 text-slate-300">
                                          {m.seed2}
                                        </span>
                                      )}
                                      <span className="truncate">{m.team2}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-mono font-bold ml-2">
                                      <span className="w-3 text-center">{m.set1Team2 ?? '-'}</span>
                                      <span className="w-3 text-center">{m.set2Team2 ?? '-'}</span>
                                      {m.set3Team2 ? <span className="w-3 text-center">{m.set3Team2}</span> : null}
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                                  <span className="text-slate-500 group-hover:text-emerald-400 transition flex items-center gap-1 font-semibold">
                                    <span>Ver Detalles</span>
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenScoreEditor(m);
                                    }}
                                    className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Marcador</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* CONECTOR CUARTOS -> SEMIFINAL */}
                      <div className="w-6 shrink-0 flex flex-col justify-around py-10 opacity-70">
                        <div className="h-44 border-r-2 border-t-2 border-b-2 border-emerald-500/40 rounded-r-2xl" />
                        <div className="h-44 border-r-2 border-t-2 border-b-2 border-emerald-500/40 rounded-r-2xl" />
                      </div>

                      {/* 2. SEMIFINALES */}
                      <div className="w-72 shrink-0 flex flex-col justify-between space-y-3">
                        <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-between text-xs">
                          <span className="font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-400" />
                            Semifinales
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">2 Partidos</span>
                        </div>

                        <div className="space-y-8 flex-1 flex flex-col justify-around py-8">
                          {filteredCategoryBrackets
                            .filter((b) => b.round === 'Semifinal')
                            .map((m) => (
                              <div
                                key={m.id}
                                onClick={() => setSelectedBracketMatchForDetail(m)}
                                className={`p-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border transition-all cursor-pointer group shadow-sm hover:border-blue-400 hover:shadow-blue-500/10 active:scale-[0.99] ${
                                  m.status === 'live'
                                    ? 'border-blue-400 ring-2 ring-blue-400/30'
                                    : 'border-slate-700/80'
                                }`}
                                title="Haz clic para ver todos los detalles del partido"
                              >
                                <div className="flex items-center justify-between text-[10px] font-mono border-b border-slate-700/60 pb-1 mb-1.5">
                                  <span className="text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-blue-400" />
                                    {m.scheduledTime}
                                  </span>
                                  <span className="text-blue-400 font-bold">{m.courtName}</span>
                                </div>

                                <div className="space-y-1 text-xs">
                                  <div
                                    className={`flex items-center justify-between p-1 rounded-lg transition ${
                                      m.winner === 1 ? 'bg-blue-500/20 text-blue-300 font-black' : 'text-slate-200'
                                    }`}
                                  >
                                    <span className="truncate">{m.team1}</span>
                                    <div className="flex items-center gap-1.5 font-mono font-bold ml-2">
                                      <span className="w-3 text-center">{m.set1Team1 ?? '-'}</span>
                                      <span className="w-3 text-center">{m.set2Team1 ?? '-'}</span>
                                    </div>
                                  </div>
                                  <div
                                    className={`flex items-center justify-between p-1 rounded-lg transition ${
                                      m.winner === 2 ? 'bg-blue-500/20 text-blue-300 font-black' : 'text-slate-400'
                                    }`}
                                  >
                                    <span className="truncate">{m.team2}</span>
                                    <div className="flex items-center gap-1.5 font-mono font-bold ml-2">
                                      <span className="w-3 text-center">{m.set1Team2 ?? '-'}</span>
                                      <span className="w-3 text-center">{m.set2Team2 ?? '-'}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                                  <span className="text-slate-500 group-hover:text-blue-300 transition flex items-center gap-1 font-semibold">
                                    <span>Ver Detalles</span>
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenScoreEditor(m);
                                    }}
                                    className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Marcador</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* CONECTOR SEMIFINAL -> FINAL */}
                      <div className="w-6 shrink-0 flex flex-col justify-center py-20 opacity-70">
                        <div className="h-64 border-r-2 border-t-2 border-b-2 border-amber-400/50 rounded-r-2xl" />
                      </div>

                      {/* 3. GRAN FINAL */}
                      <div className="w-80 shrink-0 flex flex-col justify-between space-y-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 flex items-center justify-between text-xs">
                          <span className="font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            Gran Final Oficial
                          </span>
                          <span className="text-[10px] text-amber-400 font-mono font-bold">Trofeo FEP</span>
                        </div>

                        <div className="flex-1 flex flex-col justify-center py-8">
                          {filteredCategoryBrackets
                            .filter((b) => b.round === 'Final')
                            .map((m) => (
                              <div
                                key={m.id}
                                onClick={() => setSelectedBracketMatchForDetail(m)}
                                className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-400/80 shadow-lg space-y-3 cursor-pointer group hover:border-amber-300 hover:shadow-amber-500/20 transition-all active:scale-[0.99]"
                                title="Haz clic para ver todos los detalles del partido de la Final"
                              >
                                <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono font-bold border-b border-amber-500/30 pb-2">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {m.scheduledTime}
                                  </span>
                                  <span>{m.courtName}</span>
                                </div>

                                <div className="space-y-2 py-1">
                                  <div className="flex items-center justify-between font-black text-white text-sm p-1.5 rounded-xl bg-amber-500/10">
                                    <span className="truncate">{m.team1}</span>
                                    <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                                  </div>
                                  <div className="flex items-center justify-between text-slate-300 text-sm p-1.5">
                                    <span className="truncate">{m.team2}</span>
                                    <span className="font-mono text-slate-400">-</span>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-amber-500/30 flex items-center justify-between text-xs">
                                  <span className="text-amber-300 group-hover:text-amber-200 transition font-bold flex items-center gap-1">
                                    <span>Ficha Oficial de la Final</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenScoreEditor(m);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[11px] hover:bg-amber-400 transition cursor-pointer flex items-center gap-1"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Marcador</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* 4. CAMPEONES / PODIO */}
                      <div className="w-64 shrink-0 flex flex-col justify-center">
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-slate-800 to-slate-900 border border-amber-500/40 text-center space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto ring-4 ring-amber-500/20">
                            <Trophy className="w-7 h-7" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400 block">
                              Campeones Oficiales
                            </span>
                            <div className="font-black text-white text-sm mt-1">
                              Carlos Méndez / Diego Soto
                            </div>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">
                              1ª Categoría Masculina
                            </span>
                          </div>
                          <div className="pt-2 border-t border-slate-700/80 text-[10px] font-mono text-emerald-400">
                            Premio: 800 € + Trofeo Oro WPT
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* MODO 2: FORMATO LISTA / COLUMNAS */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 1. Cuartos de Final */}
                  <div className="space-y-3">
                    <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>{t('tournaments.roundQuarter', 'Cuartos de Final')}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">4 Partidos</span>
                    </div>

                    {filteredCategoryBrackets
                      .filter((b) => b.round === 'Cuartos')
                      .map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setSelectedBracketMatchForDetail(m)}
                          className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs space-y-2.5 text-xs transition cursor-pointer hover:border-emerald-500/60 hover:shadow-md ${
                            m.status === 'live'
                              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                          title="Haz clic para ver la ficha del partido"
                        >
                          <div className="flex items-center justify-between text-[11px] border-b border-slate-100 dark:border-slate-800 pb-1.5">
                            <span className="text-slate-400 font-mono">{m.scheduledTime}</span>
                            <div className="flex items-center gap-1.5">
                              {m.status === 'live' ? (
                                <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 animate-pulse">
                                  <Radio className="w-3 h-3" />
                                  {t('tournaments.match_live', 'En Directo')}
                                </span>
                              ) : m.status === 'completed' ? (
                                <span className="text-[10px] font-bold text-slate-400">
                                  {t('tournaments.match_completed', 'Finalizado')}
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-500">
                                  {m.courtName}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-0.5">
                            <div
                              className={`flex items-center justify-between p-1.5 rounded-lg ${
                                m.winner === 1 ? 'bg-emerald-50 dark:bg-emerald-950/50 font-black' : ''
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                {m.seed1 && (
                                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    {m.seed1}
                                  </span>
                                )}
                                <span className="truncate text-slate-900 dark:text-white">{m.team1}</span>
                              </div>
                              <div className="flex items-center gap-2 font-mono font-bold">
                                <span>{m.set1Team1 ?? '-'}</span>
                                <span>{m.set2Team1 ?? '-'}</span>
                                {m.set3Team1 ? <span>{m.set3Team1}</span> : null}
                              </div>
                            </div>

                            <div
                              className={`flex items-center justify-between p-1.5 rounded-lg ${
                                m.winner === 2 ? 'bg-emerald-50 dark:bg-emerald-950/50 font-black' : ''
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                {m.seed2 && (
                                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    {m.seed2}
                                  </span>
                                )}
                                <span className="truncate text-slate-700 dark:text-slate-300">{m.team2}</span>
                              </div>
                              <div className="flex items-center gap-2 font-mono font-bold text-slate-500">
                                <span>{m.set1Team2 ?? '-'}</span>
                                <span>{m.set2Team2 ?? '-'}</span>
                                {m.set3Team2 ? <span>{m.set3Team2}</span> : null}
                              </div>
                            </div>
                          </div>

                          <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 hover:text-emerald-500 transition flex items-center gap-1 font-semibold">
                              <span>Ficha de Partido</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenScoreEditor(m);
                              }}
                              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{t('tournaments.edit_score', 'Anotar Marcador')}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* 2. Semifinales */}
                  <div className="space-y-3">
                    <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span>{t('tournaments.roundSemi', 'Semifinales')}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">2 Partidos</span>
                    </div>

                    {filteredCategoryBrackets
                      .filter((b) => b.round === 'Semifinal')
                      .map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setSelectedBracketMatchForDetail(m)}
                          className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs space-y-2.5 text-xs transition cursor-pointer hover:border-blue-400 hover:shadow-md ${
                            m.status === 'live'
                              ? 'border-blue-400 ring-2 ring-blue-400/20'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                          title="Haz clic para ver la ficha del partido"
                        >
                          <div className="flex items-center justify-between text-[11px] border-b border-slate-100 dark:border-slate-800 pb-1.5">
                            <span className="text-slate-400 font-mono">{m.scheduledTime}</span>
                            <span className="font-bold text-blue-500">{m.courtName}</span>
                          </div>

                          <div className="space-y-1.5 pt-0.5">
                            <div className="flex items-center justify-between p-1.5 rounded-lg">
                              <span className="font-bold text-slate-900 dark:text-white truncate">{m.team1}</span>
                              <div className="flex items-center gap-2 font-mono font-bold text-blue-500">
                                <span>{m.set1Team1 ?? '-'}</span>
                                <span>{m.set2Team1 ?? '-'}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-1.5 rounded-lg">
                              <span className="text-slate-600 dark:text-slate-300 truncate">{m.team2}</span>
                              <div className="flex items-center gap-2 font-mono text-slate-400">
                                <span>{m.set1Team2 ?? '-'}</span>
                                <span>{m.set2Team2 ?? '-'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 hover:text-blue-500 transition flex items-center gap-1 font-semibold">
                              <span>Ficha de Partido</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenScoreEditor(m);
                              }}
                              className="font-bold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{t('tournaments.edit_score', 'Anotar Marcador')}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* 3. Gran Final */}
                  <div className="space-y-3">
                    <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>{t('tournaments.roundFinal', 'Gran Final')}</span>
                      </div>
                      <span className="text-[10px] text-amber-500 font-bold">Trofeo Oficial</span>
                    </div>

                    {filteredCategoryBrackets
                      .filter((b) => b.round === 'Final')
                      .map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setSelectedBracketMatchForDetail(m)}
                          className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border border-amber-300 dark:border-amber-800/80 shadow-sm space-y-3 text-xs cursor-pointer hover:border-amber-400 hover:shadow-md transition"
                          title="Haz clic para ver la ficha del partido"
                        >
                          <div className="flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-400 font-bold border-b border-amber-200 dark:border-amber-900/50 pb-1.5">
                            <span>{m.scheduledTime}</span>
                            <span>{m.courtName}</span>
                          </div>
                          <div className="space-y-2 pt-0.5">
                            <div className="flex items-center justify-between font-black text-slate-900 dark:text-white text-sm">
                              <span className="truncate">{m.team1}</span>
                              <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                            </div>
                            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                              <span className="truncate">{m.team2}</span>
                              <span className="font-mono text-slate-400">-</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-amber-100 dark:border-amber-900/50 flex items-center justify-between text-[11px]">
                            <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                              <span>Ficha de la Final</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenScoreEditor(m);
                              }}
                              className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{t('tournaments.edit_score', 'Anotar Marcador')}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CONTENIDO PESTAÑA DETALLE 3: PARTIDOS & HORARIOS */}
          {detailSubTab === 'schedule' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Programación Oficial de Cruces & Pistas
                  </h3>
                  <button
                    type="button"
                    onClick={handleBlockCourtsInAgenda}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Sincronizar con Agenda de Reservas
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {brackets.map((m) => (
                    <div key={m.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold font-mono text-[11px]">
                          {m.round}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {m.team1} vs {m.team2}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {m.courtName} · {m.scheduledTime}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            m.status === 'completed'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : m.status === 'live'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {m.status === 'completed'
                            ? `Finalizado (${m.set1Team1}-${m.set1Team2}, ${m.set2Team1}-${m.set2Team2})`
                            : m.status === 'live'
                            ? 'En Juego'
                            : 'Programado'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO PESTAÑA DETALLE 4: INSCRIPCIONES & PAREJAS */}
          {detailSubTab === 'inscriptions' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Parejas Registradas en el Torneo ({registeredPairs.length})
                  </h3>
                  <p className="text-xs text-slate-500">Validación de cobros online y en recepción.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTournamentForInscription(selectedTournament.id);
                    setIsInscriptionModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Pareja</span>
                </button>
              </div>

              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Jugador 1 (Capitán)</th>
                        <th className="py-3 px-4">Jugador 2</th>
                        <th className="py-3 px-4">Categoría</th>
                        <th className="py-3 px-4">Estado del Pago</th>
                        <th className="py-3 px-4">Canal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {registeredPairs.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 dark:text-white">{p.player1.name}</div>
                            <div className="text-[11px] text-slate-400">{p.player1.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 dark:text-white">{p.player2.name}</div>
                            <div className="text-[11px] text-slate-400">{p.player2.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.paymentStatus === 'paid'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                              }`}
                            >
                              {p.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente Recepción'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono uppercase text-[11px]">
                            {p.paymentMethod}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================================
          MODAL: ANOTAR / EDITAR MARCADOR DE PARTIDO EN CUADRO
          ====================================================================== */}
      {editingScoreMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {t('tournaments.edit_score', 'Anotar Marcador')}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {editingScoreMatch.round} · {editingScoreMatch.category}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingScoreMatch(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScore} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pareja 1: <strong className="text-slate-900 dark:text-white">{editingScoreMatch.team1}</strong>
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pareja 2: <strong className="text-slate-900 dark:text-white">{editingScoreMatch.team2}</strong>
                </div>
              </div>

              {/* Marcador por sets */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Set 1</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={scoreForm.set1Team1}
                      onChange={(e) => setScoreForm({ ...scoreForm, set1Team1: Number(e.target.value) })}
                      className="w-full text-center py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={scoreForm.set1Team2}
                      onChange={(e) => setScoreForm({ ...scoreForm, set1Team2: Number(e.target.value) })}
                      className="w-full text-center py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Set 2</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={scoreForm.set2Team1}
                      onChange={(e) => setScoreForm({ ...scoreForm, set2Team1: Number(e.target.value) })}
                      className="w-full text-center py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={scoreForm.set2Team2}
                      onChange={(e) => setScoreForm({ ...scoreForm, set2Team2: Number(e.target.value) })}
                      className="w-full text-center py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Set 3 / STB</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={scoreForm.set3Team1}
                      onChange={(e) => setScoreForm({ ...scoreForm, set3Team1: Number(e.target.value) })}
                      className="w-full text-center py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={scoreForm.set3Team2}
                      onChange={(e) => setScoreForm({ ...scoreForm, set3Team2: Number(e.target.value) })}
                      className="w-full text-center py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Estado y Ganador */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Estado del Partido
                  </label>
                  <select
                    value={scoreForm.status}
                    onChange={(e) => setScoreForm({ ...scoreForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="completed">Finalizado</option>
                    <option value="live">En Directo</option>
                    <option value="scheduled">Programado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pareja Ganadora
                  </label>
                  <select
                    value={scoreForm.winner}
                    onChange={(e) => setScoreForm({ ...scoreForm, winner: Number(e.target.value) as 1 | 2 })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value={1}>Pareja 1 (Avanza)</option>
                    <option value={2}>Pareja 2 (Avanza)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingScoreMatch(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t('tournaments.save_score', 'Guardar Resultado')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: INSCRIBIR PAREJA EN COMPETICIÓN (NIVEL 4 - HOJA / MODAL RESPONSIVE)
          ====================================================================== */}
      {isInscriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center bg-slate-950/70 dark:bg-black/85 backdrop-blur-md p-0 sm:p-4 lg:p-6 overflow-hidden animate-in fade-in duration-200">
          <div className="w-full sm:max-w-lg bg-white dark:bg-[#0E2239] border-t sm:border border-slate-200/80 dark:border-[#1A314D] rounded-t-[28px] sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden">
            {/* Tirador de arrastre táctil para móvil */}
            <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2 sm:hidden shrink-0" />

            {/* Cabecera Fija */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Inscribir Pareja en Competición
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Asignación oficial en el cuadro del torneo
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInscriptionModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterPair} className="flex-1 overflow-y-auto overscroll-contain flex flex-col">
              <div className="p-5 sm:p-6 space-y-4 text-xs flex-1">
                {/* Selector de Torneo */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Torneo / Competición *
                  </label>
                  <select
                    value={selectedTournamentForInscription}
                    onChange={(e) => {
                      setSelectedTournamentForInscription(e.target.value);
                      const targetT = tournaments.find((t) => t.id === e.target.value);
                      if (targetT && targetT.categories.length > 0) {
                        setPairCategory(targetT.categories[0].name);
                      }
                    }}
                    className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229] font-bold"
                  >
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.dates})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selector Dinámico de Categoría del Torneo */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Categoría Específica *
                  </label>
                  <select
                    value={pairCategory}
                    onChange={(e) => setPairCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229] font-bold"
                  >
                    {inscriptionAvailableCategories.map((cName) => (
                      <option key={cName} value={cName}>
                        {cName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Jugador 1 (Capitán / Titular)
                  </label>
                  <select
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229] font-bold"
                  >
                    {clubMembers.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name} (Nivel FEP: {m.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Jugador 2 (Compañero)
                  </label>
                  <select
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229] font-bold"
                  >
                    {clubMembers.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name} (Nivel FEP: {m.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Método de Pago de la Cuota
                  </label>
                  <select
                    value={pairPaymentMethod}
                    onChange={(e) => setPairPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229]"
                  >
                    <option value="club">Pago en Recepción / Mostrador</option>
                    <option value="online">Pasarela Online (Stripe Tarjeta / Bizum)</option>
                    <option value="wallet">Monedero del Socio / Saldo Virtual</option>
                  </select>
                </div>
              </div>

              {/* Botonera Inferior Simétrica 50/50 */}
              <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 dark:border-[#1A314D] bg-white dark:bg-[#071220] shrink-0 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsInscriptionModalOpen(false)}
                  className="h-12 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-slate-50 dark:bg-[#0E2239] hover:bg-slate-100 dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-12 rounded-xl bg-[#B7F229] hover:bg-[#a3db20] text-[#0B1A2D] font-black text-xs transition shadow-sm cursor-pointer"
                >
                  Confirmar Inscripción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: CREAR NUEVA COMPETICIÓN OFICIAL (NIVEL 4 - HOJA / MODAL RESPONSIVE)
          ====================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center bg-slate-950/70 dark:bg-black/85 backdrop-blur-md p-0 sm:p-4 lg:p-6 overflow-hidden animate-in fade-in duration-200">
          <div className="w-full sm:max-w-xl bg-white dark:bg-[#0E2239] border-t sm:border border-slate-200/80 dark:border-[#1A314D] rounded-t-[28px] sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden">
            {/* Tirador táctil en móvil */}
            <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2 sm:hidden shrink-0" />

            {/* Cabecera Fija */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Crear Nueva Competición Oficial
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configuración de formato, categorías y calendario oficial
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsCreateModalOpen(false);
                triggerDemoToast(
                  'Competición Creada',
                  `"${newTitle || 'Torneo Setmio'}" registrado en el calendario oficial.`,
                  'success'
                );
              }}
              className="flex-1 overflow-y-auto overscroll-contain flex flex-col"
            >
              <div className="p-5 sm:p-6 space-y-4 text-xs flex-1">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Título del Torneo *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="ej. I Open Pádel San Mateo Invierno"
                    className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Fechas de Celebración
                  </label>
                  <input
                    type="text"
                    value={newDates}
                    onChange={(e) => setNewDates(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229] font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Formato
                    </label>
                    <select
                      value={newFormat}
                      onChange={(e) => setNewFormat(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229]"
                    >
                      <option value="elimination">Eliminación Directa</option>
                      <option value="league">Liga / Round Robin</option>
                      <option value="pozo">Formato Pozo Exprés</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tarifa Inscripción (€)
                    </label>
                    <input
                      type="number"
                      value={newEntryFee}
                      onChange={(e) => setNewEntryFee(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#B7F229] font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Botonera Inferior Simétrica 50/50 */}
              <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 dark:border-[#1A314D] bg-white dark:bg-[#071220] shrink-0 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-12 rounded-xl border border-slate-200 dark:border-[#1A314D] bg-slate-50 dark:bg-[#0E2239] hover:bg-slate-100 dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-12 rounded-xl bg-[#B7F229] hover:bg-[#a3db20] text-[#0B1A2D] font-black text-xs transition shadow-sm cursor-pointer"
                >
                  Publicar Competición
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: CREAR NUEVO RANKING DEL CLUB
          ====================================================================== */}
      {isCreateRankingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Medal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t('tournaments.modalNewRankingTitle', 'Crear Nuevo Ranking del Club')}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Define la categoría, temporada y reglas de puntuación
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateRankingModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRankingSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('tournaments.rankingName', 'Nombre del Ranking')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Ranking General Pádel San Mateo 2026"
                  value={newRankingForm.name}
                  onChange={(e) => setNewRankingForm({ ...newRankingForm, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('tournaments.rankingCategory', 'Categoría')}
                  </label>
                  <select
                    value={newRankingForm.category}
                    onChange={(e) => setNewRankingForm({ ...newRankingForm, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Absoluto">Absoluto General</option>
                    <option value="Masculino Pro">Masculino 1ª Categoría (Pro)</option>
                    <option value="Masculino 2ª">Masculino 2ª Categoría</option>
                    <option value="Femenino">Femenino Oro</option>
                    <option value="Mixto">Mixto Open</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('tournaments.rankingSeason', 'Temporada / Edición')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Temporada 2026"
                    value={newRankingForm.season}
                    onChange={(e) => setNewRankingForm({ ...newRankingForm, season: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRankingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a3db20] text-[#0B1A2D] font-black transition shadow-sm active:scale-95 cursor-pointer"
                >
                  {t('tournaments.btnCreateRanking', 'Crear Ranking')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: DETALLES OFICIALES DEL PARTIDO DEL TORNEO (ACTA Y ESTADÍSTICAS)
          ====================================================================== */}
      {selectedBracketMatchForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                    {selectedBracketMatchForDetail.round === 'Final' ? 'Gran Final Oficial' : selectedBracketMatchForDetail.round}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {selectedBracketMatchForDetail.category}
                  </span>
                  {selectedBracketMatchForDetail.status === 'live' ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-slate-950 animate-pulse">
                      <Radio className="w-3 h-3" />
                      En Juego
                    </span>
                  ) : selectedBracketMatchForDetail.status === 'completed' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      ✓ Finalizado
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      Programado
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Acta Oficial de Partido — {selectedTournament.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBracketMatchForDetail(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MARCADOR OFICIAL Y ENFRENTAMIENTO */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pareja 1 */}
                <div className={`p-4 rounded-xl border transition ${
                  selectedBracketMatchForDetail.winner === 1
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500/50 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pareja A</span>
                    {selectedBracketMatchForDetail.seed1 && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Cabeza Serie: {selectedBracketMatchForDetail.seed1}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={getPlayerAvatar(selectedBracketMatchForDetail.team1.split('/')[0])}
                      alt={selectedBracketMatchForDetail.team1}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                    <div className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {selectedBracketMatchForDetail.team1}
                    </div>
                  </div>
                  {selectedBracketMatchForDetail.winner === 1 && (
                    <div className="mt-3 pt-2 border-t border-emerald-500/20 text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-emerald-500" />
                      <span>Ganadores del Encuentro</span>
                    </div>
                  )}
                </div>

                {/* Pareja 2 */}
                <div className={`p-4 rounded-xl border transition ${
                  selectedBracketMatchForDetail.winner === 2
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500/50 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pareja B</span>
                    {selectedBracketMatchForDetail.seed2 && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Cabeza Serie: {selectedBracketMatchForDetail.seed2}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={getPlayerAvatar(selectedBracketMatchForDetail.team2.split('/')[0])}
                      alt={selectedBracketMatchForDetail.team2}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                    <div className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {selectedBracketMatchForDetail.team2}
                    </div>
                  </div>
                  {selectedBracketMatchForDetail.winner === 2 && (
                    <div className="mt-3 pt-2 border-t border-emerald-500/20 text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-emerald-500" />
                      <span>Ganadores del Encuentro</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tanteo Oficial por Sets */}
              <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Marcador Oficial por Sets:</div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 font-bold text-xs text-slate-500">Pareja</div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 font-bold text-xs text-slate-500">Set 1</div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 font-bold text-xs text-slate-500">Set 2</div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 font-bold text-xs text-slate-500">Set 3</div>

                  <div className="p-2 text-left truncate font-bold text-xs">{selectedBracketMatchForDetail.team1}</div>
                  <div className="p-2 font-mono font-black text-sm">{selectedBracketMatchForDetail.set1Team1 ?? '-'}</div>
                  <div className="p-2 font-mono font-black text-sm">{selectedBracketMatchForDetail.set2Team1 ?? '-'}</div>
                  <div className="p-2 font-mono font-black text-sm">{selectedBracketMatchForDetail.set3Team1 ?? '-'}</div>

                  <div className="p-2 text-left truncate font-bold text-xs">{selectedBracketMatchForDetail.team2}</div>
                  <div className="p-2 font-mono font-black text-sm text-slate-500">{selectedBracketMatchForDetail.set1Team2 ?? '-'}</div>
                  <div className="p-2 font-mono font-black text-sm text-slate-500">{selectedBracketMatchForDetail.set2Team2 ?? '-'}</div>
                  <div className="p-2 font-mono font-black text-sm text-slate-500">{selectedBracketMatchForDetail.set3Team2 ?? '-'}</div>
                </div>
              </div>
            </div>

            {/* DETALLES OPERATIVOS & JUEZ ÁRBITRO */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Pista Asignada:</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  {selectedBracketMatchForDetail.courtName}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Horario Oficial:</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  {selectedBracketMatchForDetail.scheduledTime}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Juez Árbitro FEP:</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  R. Méndez (N2)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Pelota Oficial:</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Bullpadel Next Pro
                </span>
              </div>
            </div>

            {/* ESTADÍSTICAS OFICIALES DEL ENCUENTRO */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Estadísticas del Encuentro (Puntos de Oro & Eficiencia):
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Puntos de Oro</span>
                  <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">4 / 6 ganados</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Breaks Convertidos</span>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white">5 de 9</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Duración Real</span>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white">1h 28m</span>
                </div>
              </div>
            </div>

            {/* BOTONERA INFERIOR */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerDemoToast(
                      'Acta Oficial Generada',
                      `Descargando acta arbitral en PDF del partido ${selectedBracketMatchForDetail.team1} vs ${selectedBracketMatchForDetail.team2}.`,
                      'info'
                    );
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Descargar Acta PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerDemoToast(
                      'Resultado Notificado',
                      `Aviso enviado por WhatsApp a los 4 jugadores del cruce.`,
                      'success'
                    );
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Notificar Parejas</span>
                </button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    const matchToEdit = selectedBracketMatchForDetail;
                    setSelectedBracketMatchForDetail(null);
                    handleOpenScoreEditor(matchToEdit);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modificar Marcador / Acta</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBracketMatchForDetail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: VISUALIZADOR DE CARTEL OFICIAL
          ====================================================================== */}
      {posterModalUrl && (
        <div
          onClick={() => setPosterModalUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setPosterModalUrl(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/70 text-white hover:bg-slate-950 transition z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={posterModalUrl}
              alt="Cartel Oficial"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
