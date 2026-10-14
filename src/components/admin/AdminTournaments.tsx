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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t('tournaments.eyebrow', 'Circuito Oficial & Competiciones')}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                {t('tournaments.competitions_title', 'Competiciones')}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {t(
                  'tournaments.competitions_subtitle',
                  'Torneos oficiales, cuadros de cruces, inscripciones y rankings del club'
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedTournamentForInscription(tournaments[0]?.id || '');
                  setIsInscriptionModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Users className="w-4 h-4 text-emerald-500" />
                <span>{t('tournaments.btn_register_pair', 'Inscribir Pareja')}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{t('tournaments.btn_create', 'Crear Torneo')}</span>
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
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
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
                      className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 transition-all duration-200 shadow-xs hover:shadow-md overflow-hidden flex flex-col md:flex-row group"
                    >
                      {/* Portada */}
                      <div className="relative w-full md:w-72 lg:w-80 h-48 md:h-auto shrink-0 overflow-hidden bg-slate-950">
                        <img
                          src={tournament.bannerUrl}
                          alt={tournament.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent" />

                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${
                              tournament.status === 'registration_open'
                                ? 'bg-emerald-500 text-slate-950'
                                : tournament.status === 'in_progress'
                                ? 'bg-blue-500 text-white'
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
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{tournament.dates}</span>
                        </div>
                      </div>

                      {/* Cuerpo Central */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                                {tournament.categories.map((c) => c.name).join(' · ')}
                              </span>
                              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                {tournament.rankingCategory || 'Circuito Setmio Oro'}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-xs text-slate-400">Cuota: </span>
                              <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                                {tournament.entryFee.toFixed(2)} €
                              </span>
                            </div>
                          </div>

                          <h2
                            onClick={() => handleOpenDetail(tournament)}
                            className="text-lg font-black text-slate-900 dark:text-white tracking-tight hover:text-emerald-500 transition cursor-pointer"
                          >
                            {tournament.title}
                          </h2>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {tournament.description}
                          </p>
                        </div>

                        {/* Resumen Ejecutivo */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/80">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Inscritos</span>
                            <span className="font-black text-slate-900 dark:text-white font-mono text-xs">
                              {totalPairs} / {maxPairs} parejas
                            </span>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full transition-all"
                                style={{ width: `${percentFilled}%` }}
                              />
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/80">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Formato</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs capitalize truncate block">
                              {tournament.format || 'Eliminación Directa'}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/80">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Categorías</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs font-mono">
                              {tournament.categories.length} oficiales
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/80">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Premios</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs truncate block font-mono">
                              1.500 € + Trofeos
                            </span>
                          </div>
                        </div>

                        {/* Barra de Acciones de la Tarjeta con botón Inscribirse directo */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2">
                            {/* Botón Ver Cartel compacto */}
                            <button
                              type="button"
                              onClick={() => setPosterModalUrl(tournament.bannerUrl)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                              title="Ver Cartel Oficial"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{t('tournaments.btn_view_poster', 'Ver cartel')}</span>
                            </button>

                            {/* Botón Inscribirse Directo */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTournamentForInscription(tournament.id);
                                setIsInscriptionModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>{t('tournaments.btn_register_direct', 'Inscribirse')}</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenDetail(tournament)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 ml-auto"
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
          {/* Barra Superior de Navegación & Acciones Limpia y Minimalista */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
            {/* Botón Volver Rediseñado Minimalista */}
            <button
              type="button"
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-2xs font-bold text-xs transition cursor-pointer active:scale-95 group self-start"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-500 group-hover:-translate-x-0.5 transition-transform" />
              <span>{t('tournaments.btn_back', 'Volver al Listado de Torneos')}</span>
            </button>

            {/* Acciones Reubicadas Fuera del Contenedor de Imagen */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
              <button
                type="button"
                onClick={() => setPosterModalUrl(selectedTournament.bannerUrl)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 shadow-2xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Ver Cartel Oficial"
              >
                <Eye className="w-4 h-4 text-emerald-500" />
                <span>{t('tournaments.btn_view_poster', 'Ver cartel')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedTournamentForInscription(selectedTournament.id);
                  setIsInscriptionModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Users className="w-4 h-4" />
                <span>{t('tournaments.btn_register_pair', 'Inscribir Pareja')}</span>
              </button>
            </div>
          </div>

          {/* Cabecera / Primer Contenedor del Torneo: Máximo Contraste y Legibilidad */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row">
            {/* Imagen del Cartel / Banner Limpia y Delimitada */}
            <div className="relative w-full md:w-80 lg:w-96 h-52 md:h-auto shrink-0 bg-slate-950 overflow-hidden">
              <img
                src={selectedTournament.bannerUrl}
                alt={selectedTournament.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                  {selectedTournament.status === 'registration_open' ? 'Inscripción Abierta' : 'En Curso'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold border border-white/20">
                  {selectedTournament.rankingCategory || 'Circuito Setmio Oro'}
                </span>
              </div>
            </div>

            {/* Contenido Informativo con Fondo Sólido de Alto Contraste */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>{selectedTournament.dates}</span>
                  <span>·</span>
                  <span className="text-slate-500 dark:text-slate-400 font-normal">Sede Oficial Club</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {selectedTournament.title}
                </h1>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {selectedTournament.description}
                </p>
              </div>

              {/* Métricas y Datos Clave en Cajas Limpias */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Inscripción</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                    {selectedTournament.entryFee.toFixed(2)} €
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">por jugador</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Parejas</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {selectedTournament.categories.reduce((acc, c) => acc + c.teamsCount, 0)} inscritas
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">en cuadros oficiales</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Categorías</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {selectedTournament.categories.length} divisiones
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">Masc / Fem / Mixto</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Premios</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    1.500 € + Trofeos
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">y textil oficial</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Tabs de Navegación del Detalle */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs font-semibold overflow-x-auto">
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
                  className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
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
              {/* Barra de Categorías del Cuadro & Acción de Agenda */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                {/* Selector de Categoría para el Cuadro */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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

                <button
                  type="button"
                  onClick={handleBlockCourtsInAgenda}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('tournaments.sync_agenda', 'Bloquear Pistas en Agenda')}</span>
                </button>
              </div>

              {/* Visualizador de Cuadros/Cruces Estilo Pádel Profesional */}
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
                        className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs space-y-2.5 text-xs transition ${
                          m.status === 'live'
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
                        }`}
                      >
                        {/* Cabecera del partido */}
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

                        {/* Equipos y Marcadores */}
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

                        {/* Botón interactivo para Anotar Marcador */}
                        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleOpenScoreEditor(m)}
                            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
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
                        className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs space-y-2.5 text-xs transition ${
                          m.status === 'live'
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] border-b border-slate-100 dark:border-slate-800 pb-1.5">
                          <span className="text-slate-400 font-mono">{m.scheduledTime}</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{m.courtName}</span>
                        </div>

                        <div className="space-y-1.5 pt-0.5">
                          <div className="flex items-center justify-between p-1.5 rounded-lg">
                            <span className="font-bold text-slate-900 dark:text-white truncate">{m.team1}</span>
                            <div className="flex items-center gap-2 font-mono font-bold text-emerald-600">
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

                        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleOpenScoreEditor(m)}
                            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
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
                        className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border border-amber-300 dark:border-amber-800/80 shadow-sm space-y-3 text-xs"
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

                        <div className="pt-2 border-t border-amber-100 dark:border-amber-900/50 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleOpenScoreEditor(m)}
                            className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{t('tournaments.edit_score', 'Anotar Marcador')}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
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
          MODAL: INSCRIBIR PAREJA EN COMPETICIÓN (FLUJO CON TORNEO & CATEGORÍA)
          ====================================================================== */}
      {isInscriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Inscribir Pareja en Competición
              </h3>
              <button
                type="button"
                onClick={() => setIsInscriptionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterPair} className="space-y-3.5 text-xs">
              {/* Selector de Torneo */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
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
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
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
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Categoría Específica *
                </label>
                <select
                  value={pairCategory}
                  onChange={(e) => setPairCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
                >
                  {inscriptionAvailableCategories.map((cName) => (
                    <option key={cName} value={cName}>
                      {cName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jugador 1 (Capitán / Titular)
                </label>
                <select
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
                >
                  {clubMembers.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} (Nivel FEP: {m.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jugador 2 (Compañero)
                </label>
                <select
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
                >
                  {clubMembers.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} (Nivel FEP: {m.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Método de Pago de la Cuota
                </label>
                <select
                  value={pairPaymentMethod}
                  onChange={(e) => setPairPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="club">Pago en Recepción / Mostrador</option>
                  <option value="online">Pasarela Online (Stripe Tarjeta / Bizum)</option>
                  <option value="wallet">Monedero del Socio / Saldo Virtual</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInscriptionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm active:scale-95 cursor-pointer"
                >
                  Confirmar Inscripción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: CREAR NUEVA COMPETICIÓN
          ====================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Crear Nueva Competición Oficial
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
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
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Título del Torneo *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ej. I Open Pádel San Mateo Invierno"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Fechas de Celebración
                </label>
                <input
                  type="text"
                  value={newDates}
                  onChange={(e) => setNewDates(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Formato
                  </label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="elimination">Eliminación Directa</option>
                    <option value="league">Liga / Round Robin</option>
                    <option value="pozo">Formato Pozo Exprés</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tarifa Inscripción (€)
                  </label>
                  <input
                    type="number"
                    value={newEntryFee}
                    onChange={(e) => setNewEntryFee(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm active:scale-95 cursor-pointer"
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm active:scale-95 cursor-pointer"
                >
                  {t('tournaments.btnCreateRanking', 'Crear Ranking')}
                </button>
              </div>
            </form>
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
