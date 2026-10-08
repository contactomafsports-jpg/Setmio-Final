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
} from 'lucide-react';

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

  // Navigation tab: Tournaments vs Rankings
  const [activeTab, setActiveTab] = useState<'tournaments' | 'rankings'>('tournaments');
  const [selectedRankingId, setSelectedRankingId] = useState<string | null>(null);
  const [isCreateRankingModalOpen, setIsCreateRankingModalOpen] = useState(false);
  const [newRankingForm, setNewRankingForm] = useState({
    name: '',
    category: 'Absoluto',
    season: 'Temporada 2026',
    description: '',
  });
  const [selectedTournamentToLink, setSelectedTournamentToLink] = useState('');

  // If selectedTournamentId is null, show main vertical cards list. If set, show dedicated detail page.
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);

  // Sub-tab inside the dedicated detail view
  const [detailSubTab, setDetailSubTab] = useState<'info' | 'draws' | 'schedule' | 'inscriptions'>('info');

  const [posterModalUrl, setPosterModalUrl] = useState<string | null>(null);
  const [tournamentSearch, setTournamentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'registration_open' | 'in_progress' | 'completed'>('all');

  // URL Sync for /admin/competiciones/[id] and /gestion/torneos/[id]
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
        pathname === '/gestion/torneos' ||
        pathname === '/torneos'
      ) {
        setSelectedTournamentId(null);
      }
    };

    handleUrlTournament();
    window.addEventListener('popstate', handleUrlTournament);
    return () => window.removeEventListener('popstate', handleUrlTournament);
  }, [tournaments]);

  const selectedTournament = tournaments.find((item) => item.id === selectedTournamentId) || tournaments[0];

  // New Tournament Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDates, setNewDates] = useState('18 al 21 Noviembre 2026');
  const [newFormat, setNewFormat] = useState<'elimination' | 'league' | 'pozo' | 'league_and_elimination'>('elimination');
  const [newRanking, setNewRanking] = useState('Circuito Setmio Oro');
  const [newEntryFee, setNewEntryFee] = useState(25.0);

  // Inscription pair modal
  const [isInscriptionModalOpen, setIsInscriptionModalOpen] = useState(false);
  const [player1Name, setPlayer1Name] = useState('Carlos Méndez');
  const [player2Name, setPlayer2Name] = useState('Diego Soto');
  const [pairCategory, setPairCategory] = useState('2ª Categoría Masculina');
  const [pairPaymentMethod, setPairPaymentMethod] = useState<'online' | 'club'>('club');

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
      category: '2ª Categoría Masculina',
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

  // Demo Tournament Brackets (Cruces generados)
  const [brackets, setBrackets] = useState<TournamentBracketMatch[]>([
    { id: 'b-1', round: 'Cuartos', matchIndex: 1, team1: 'Méndez / Soto', team2: 'Fraga / Pena', score: '6-4, 7-5', scheduledTime: 'Viernes 18:00', courtName: 'Pista 1 Central', courtId: 'court-1', isCompleted: true },
    { id: 'b-2', round: 'Cuartos', matchIndex: 2, team1: 'Gómez / Permuy', team2: 'Dopico / Fandiño', score: '6-3, 6-2', scheduledTime: 'Viernes 19:30', courtName: 'Pista 2 Panorámica', courtId: 'court-2', isCompleted: true },
    { id: 'b-3', round: 'Cuartos', matchIndex: 3, team1: 'Varela / Loureiro', team2: 'Barreiro / Castro', score: '6-1, 6-2', scheduledTime: 'Viernes 21:00', courtName: 'Pista 1 Central', courtId: 'court-1', isCompleted: true },
    { id: 'b-4', round: 'Cuartos', matchIndex: 4, team1: 'Rey Jr. / Permuy Jr.', team2: 'Morales / Blanco', score: 'Pendiente', scheduledTime: 'Sábado 10:00', courtName: 'Pista 3 Panorámica', courtId: 'court-3', isCompleted: false },
    { id: 'b-5', round: 'Semifinal', matchIndex: 1, team1: 'Méndez / Soto', team2: 'Gómez / Permuy', score: 'Pendiente', scheduledTime: 'Sábado 17:30', courtName: 'Pista 1 Central', courtId: 'court-1', isCompleted: false },
    { id: 'b-6', round: 'Semifinal', matchIndex: 2, team1: 'Varela / Loureiro', team2: 'Ganador Cuartos 4', score: 'Pendiente', scheduledTime: 'Sábado 19:00', courtName: 'Pista 2 Panorámica', courtId: 'court-2', isCompleted: false },
    { id: 'b-7', round: 'Final', matchIndex: 1, team1: 'Ganador Semi 1', team2: 'Ganador Semi 2', score: 'Pendiente', scheduledTime: 'Domingo 12:00', courtName: 'Pista 1 Central', courtId: 'court-1', isCompleted: false },
  ]);

  // Tournament Sponsors
  const tournamentSponsors: TournamentSponsor[] = [
    { id: 'sp-1', name: 'Estrella Galicia 0,0', logoUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=200&q=80', websiteUrl: 'https://estrellagalicia.es', description: 'Patrocinador oficial de avituallamiento y entrega de premios.' },
    { id: 'sp-2', name: 'Bullpadel Oficial', logoUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=200&q=80', websiteUrl: 'https://bullpadel.com', description: 'Pala oficial del torneo y paleteros para campeones.' },
    { id: 'sp-3', name: 'Clínica Fisioterapia Narón', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&q=80', websiteUrl: 'https://fisionaron.es', description: 'Atención fisioterapéutica en pista durante semifinales y finales.' },
  ];

  const handleOpenDetail = (tournament: Tournament) => {
    setSelectedTournamentId(tournament.id);
    setDetailSubTab('info');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/admin/competiciones/${tournament.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToList = () => {
    setSelectedTournamentId(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/admin/competiciones');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBlockCourtsInAgenda = () => {
    brackets.forEach((match, index) => {
      const targetCourt = courts.find((c) => c.name === match.courtName) || courts[index % courts.length];
      createBooking({
        courtId: targetCourt.id,
        courtName: targetCourt.name,
        creatorId: 'sys-tournament-block',
        creatorName: `Torneo: ${selectedTournament.title} (${match.round})`,
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
        notes: `Bloqueo automático para ${match.round}: ${match.team1} vs ${match.team2}`,
      });
    });

    triggerDemoToast(
      'Pistas Bloqueadas en Agenda',
      `Se han reservado y bloqueado ${brackets.length} franjas de pista en la agenda del club para los cruces del torneo.`,
      'success'
    );
  };

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
      paymentMethod: pairPaymentMethod,
      status: 'pending_partner',
      createdAt: 'Hoy',
    };

    setRegisteredPairs([newPair, ...registeredPairs]);
    setIsInscriptionModalOpen(false);

    triggerDemoToast(
      'Inscripción Registrada',
      `Pareja ${p1.name} y ${p2.name} inscrita en ${pairCategory}. Se ha enviado notificación in-app de confirmación a ${p2.name}.`,
      'success'
    );
  };

  const filteredTournaments = tournaments.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(tournamentSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(tournamentSearch.toLowerCase()) ||
      (item.rankingCategory && item.rankingCategory.toLowerCase().includes(tournamentSearch.toLowerCase())) ||
      item.categories.some((cat) => cat.name.toLowerCase().includes(tournamentSearch.toLowerCase()));

    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

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
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-12 font-sans">
      {/* ======================================================================
          VISTA 1: PÁGINA PRINCIPAL DE COMPETICIONES (LISTADO VERTICAL DE CARDS)
          ====================================================================== */}
      {!selectedTournamentId ? (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header Principal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t('tournaments.eyebrow', 'Circuito Oficial & Competiciones')}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                {t('tournaments.main_title', 'Competiciones & Torneos Oficiales')}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {t(
                  'tournaments.main_subtitle',
                  'Gestión ejecutiva de torneos, cuadros eliminatorios, inscripciones y calendario del club'
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsInscriptionModalOpen(true)}
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

          {/* Barra de Filtros y Buscador */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('tournaments.search_placeholder', 'Buscar torneo por título, formato o categoría...')}
                value={tournamentSearch}
                onChange={(e) => setTournamentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

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
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* LISTADO VERTICAL DE TARJETAS LIMPIAS (CARDS) */}
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
                  {/* Imagen de Portada */}
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

                  {/* Cuerpo Central & Resumen Ejecutivo */}
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

                        <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                          {tournament.entryFee.toFixed(2)} € / jugador
                        </span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
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

                    {/* Barra de Acciones de la Tarjeta */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPosterModalUrl(tournament.bannerUrl)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t('tournaments.btn_poster', 'Ver Cartel')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDetail(tournament)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 ml-auto"
                      >
                        <span>{t('tournaments.btn_view_detail', 'Ver Detalle del Torneo')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Patrocinadores Oficiales */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-500" />
                  <span>Patrocinadores Oficiales de Competición</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Visibles en cartelería, cuadros oficiales y entrega de premios.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tournamentSponsors.map((sp) => (
                <div
                  key={sp.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3"
                >
                  <img
                    src={sp.logoUrl}
                    alt={sp.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-300 dark:border-slate-700"
                  />
                  <div className="min-w-0 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white truncate">{sp.name}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{sp.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================================
            VISTA 2: PÁGINA DETALLE DEL TORNEO (/admin/competiciones/[id])
            ====================================================================== */
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Botón Volver Limpio y Canónico */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('tournaments.btn_back', 'Volver al Listado de Torneos')}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPosterModalUrl(selectedTournament.bannerUrl)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-emerald-500" />
                <span>{t('tournaments.btn_poster', 'Ver Cartel')}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsInscriptionModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>{t('tournaments.btn_register_pair', 'Inscribir Pareja')}</span>
              </button>
            </div>
          </div>

          {/* Hero Banner del Torneo */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="relative h-56 sm:h-72 w-full overflow-hidden">
              <img
                src={selectedTournament.bannerUrl}
                alt={selectedTournament.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm">
                  {selectedTournament.status === 'registration_open'
                    ? 'Inscripción Abierta'
                    : 'En Curso'}
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-900/90 text-white text-xs font-bold border border-slate-700">
                  {selectedTournament.rankingCategory || 'Circuito Setmio Oro'}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="text-white space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedTournament.dates}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {selectedTournament.title}
                  </h1>
                  <p className="text-xs text-slate-300 max-w-xl">
                    {selectedTournament.description}
                  </p>
                </div>

                <div className="px-4 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Inscripción</span>
                  <span className="text-lg font-black font-mono text-emerald-400">
                    {selectedTournament.entryFee.toFixed(2)} €
                  </span>
                  <span className="text-[10px] text-slate-400 block">/ jugador</span>
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

                {/* Categorías Oficiales */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>Categorías Oficiales Admitidas</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {selectedTournament.categories.map((cat, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1"
                      >
                        <span className="font-extrabold text-slate-900 dark:text-white block">{cat.name}</span>
                        <div className="text-[11px] text-slate-500">
                          Plazas: <strong className="text-emerald-600 dark:text-emerald-400">{cat.teamsCount}</strong> / {cat.maxTeams} parejas
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Columna Lateral: Patrocinadores y Sede */}
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-500" />
                    <span>Sede Oficial & Instalación</span>
                  </h3>
                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                    <div className="font-bold text-slate-900 dark:text-white">{currentTenant.name}</div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{currentTenant.address}</span>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800">
                      8 Pistas de Cristal WPT con iluminación LED domótica.
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Patrocinador Principal</h3>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <img
                      src={tournamentSponsors[0].logoUrl}
                      alt={tournamentSponsors[0].name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">{tournamentSponsors[0].name}</div>
                      <div className="text-[10px] text-slate-500">Cerveza Oficial del Torneo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO PESTAÑA DETALLE 2: CUADROS & BRACKETS */}
          {detailSubTab === 'draws' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Cuadro Eliminatorio: 1ª y 2ª Categoría Masculina
                  </h3>
                  <p className="text-xs text-slate-500">Sorteo oficial completado. Cruces y marcadores en directo.</p>
                </div>

                <button
                  type="button"
                  onClick={handleBlockCourtsInAgenda}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('tournaments.sync_agenda', 'Bloquear Pistas en Agenda')}</span>
                </button>
              </div>

              {/* Visual Elimination Brackets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cuartos de Final */}
                <div className="space-y-3">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Cuartos de Final</span>
                  </div>
                  {brackets
                    .filter((b) => b.round === 'Cuartos')
                    .map((m) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                          <span>{m.scheduledTime}</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{m.courtName}</span>
                        </div>
                        <div className="space-y-1.5 pt-0.5">
                          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                            <span>{m.team1}</span>
                            <span className="font-mono text-emerald-600 dark:text-emerald-400">{(m.score || '').split(',')[0] || '-'}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                            <span>{m.team2}</span>
                            <span className="font-mono text-slate-400">{(m.score || '').split(',')[1] || '-'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Semifinales */}
                <div className="space-y-3">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Semifinales</span>
                  </div>
                  {brackets
                    .filter((b) => b.round === 'Semifinal')
                    .map((m) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                          <span>{m.scheduledTime}</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{m.courtName}</span>
                        </div>
                        <div className="space-y-1.5 pt-0.5">
                          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                            <span>{m.team1}</span>
                            <span className="font-mono text-slate-400">-</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                            <span>{m.team2}</span>
                            <span className="font-mono text-slate-400">-</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Gran Final */}
                <div className="space-y-3">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Gran Final del Torneo</span>
                  </div>
                  {brackets
                    .filter((b) => b.round === 'Final')
                    .map((m) => (
                      <div
                        key={m.id}
                        className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border border-amber-300 dark:border-amber-800/80 shadow-xs space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-400 font-bold border-b border-amber-100 dark:border-amber-900/50 pb-1.5">
                          <span>{m.scheduledTime}</span>
                          <span>{m.courtName}</span>
                        </div>
                        <div className="space-y-2 pt-0.5">
                          <div className="flex items-center justify-between font-black text-slate-900 dark:text-white text-sm">
                            <span>{m.team1}</span>
                            <Trophy className="w-4 h-4 text-amber-500" />
                          </div>
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                            <span>{m.team2}</span>
                            <span className="font-mono text-slate-400">-</span>
                          </div>
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
                            m.isCompleted
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {m.isCompleted ? `Resultado: ${m.score}` : 'Pendiente de Juego'}
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
                  onClick={() => setIsInscriptionModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Pareja</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs text-xs">
                {registeredPairs.map((pair) => (
                  <div key={pair.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center shrink-0">
                        {pair.player1.name.slice(0, 1)}/{pair.player2.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {pair.player1.name} & {pair.player2.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {pair.category} · Registrado: {pair.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          pair.paymentStatus === 'paid'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {pair.paymentStatus === 'paid' ? 'Inscripción Pagada' : 'Pago en Recepción Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: VISOR DE CARTEL A PANTALLA COMPLETA */}
      {posterModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
            <button
              type="button"
              onClick={() => setPosterModalUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-950/70 text-white hover:bg-slate-950 transition cursor-pointer"
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

      {/* MODAL: INSCRIBIR PAREJA */}
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
                  Jugador 2 (Compañero de Pareja)
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
                  Categoría
                </label>
                <select
                  value={pairCategory}
                  onChange={(e) => setPairCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="1ª Categoría Masculina">1ª Categoría Masculina</option>
                  <option value="2ª Categoría Masculina">2ª Categoría Masculina</option>
                  <option value="1ª Categoría Femenina">1ª Categoría Femenina</option>
                  <option value="Categoría Mixta Oro">Categoría Mixta Oro</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Modalidad de Pago de la Fianza
                </label>
                <select
                  value={pairPaymentMethod}
                  onChange={(e) => setPairPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="club">Pago en Recepción / Monedero de Socio</option>
                  <option value="online">Pasarela Online (Tarjeta / Bizum)</option>
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

      {/* MODAL: CREAR TORNEO */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Crear Nueva Competición
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
                  `Torneo "${newTitle || 'Nuevo Torneo'}" registrado en el calendario oficial.`,
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
                  placeholder="Ej: III Torneo Estrella Galicia de Otoño"
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
                  placeholder="Ej: 18 al 21 Noviembre 2026"
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
                    <option value="league_and_elimination">Grupos + Cuadro</option>
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
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
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
                    Define la categoría, temporada y reglas de asignación de puntos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateRankingModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
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
                    <option value="Femenino Plata">Femenino Plata</option>
                    <option value="Mixto">Mixto Open</option>
                    <option value="Veteranos">Veteranos +40</option>
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

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('tournaments.rankingDesc', 'Descripción y Reglas de Puntuación')}
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalla cómo puntúan las partidas y torneos vinculados..."
                  value={newRankingForm.description}
                  onChange={(e) => setNewRankingForm({ ...newRankingForm, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
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
                  Guardar y Crear Ranking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTournaments;
