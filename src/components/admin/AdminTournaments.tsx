import React, { useState } from 'react';
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
} from 'lucide-react';

export const AdminTournaments: React.FC = () => {
  const { tournaments, courts, createBooking, triggerDemoToast, currentTenant } = useApp();

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'tournaments' | 'rankings' | 'draws' | 'inscriptions'>('tournaments');
  const [selectedTournament, setSelectedTournament] = useState<Tournament>(tournaments[0]);
  const [posterModalUrl, setPosterModalUrl] = useState<string | null>(null);
  const [tournamentSearch, setTournamentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'registration_open' | 'in_progress' | 'completed'>('all');

  // URL Sync for /gestion/torneos/[id]
  React.useEffect(() => {
    const handleUrlTournament = () => {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      if (pathname.startsWith('/gestion/torneos/')) {
        const idOrSlug = pathname.replace('/gestion/torneos/', '').trim().toLowerCase();
        if (idOrSlug) {
          const found = tournaments.find(
            (t) =>
              t.id.toLowerCase() === idOrSlug ||
              t.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-') === idOrSlug ||
              t.title.toLowerCase().includes(idOrSlug.replace(/-/g, ' '))
          );
          if (found) {
            setSelectedTournament(found);
            setActiveAdminSubTab('draws');
          }
        }
      }
    };
    handleUrlTournament();
    window.addEventListener('popstate', handleUrlTournament);
    return () => window.removeEventListener('popstate', handleUrlTournament);
  }, [tournaments]);

  // New Tournament Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFormat, setNewFormat] = useState<'elimination' | 'league' | 'pozo' | 'league_and_elimination'>('elimination');
  const [newRanking, setNewRanking] = useState('Circuito Setmio Oro');
  const [newPaymentMethod, setNewPaymentMethod] = useState<'online' | 'club' | 'both'>('both');
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

  // Rankings Leaderboard Data
  const rankingsData = [
    { rank: 1, name: 'Mateo Varela', points: 3450, tournamentsWon: 3, matches: 28, trend: '+2' },
    { rank: 2, name: 'Laura Senra', points: 3100, tournamentsWon: 2, matches: 24, trend: '=' },
    { rank: 3, name: 'Rubén Loureiro', points: 2850, tournamentsWon: 2, matches: 26, trend: '+1' },
    { rank: 4, name: 'Carlos Méndez', points: 2420, tournamentsWon: 1, matches: 22, trend: '+3' },
    { rank: 5, name: 'Rosa Carballo', points: 2200, tournamentsWon: 1, matches: 19, trend: '-1' },
    { rank: 6, name: 'Diego Soto', points: 1980, tournamentsWon: 1, matches: 18, trend: '=' },
    { rank: 7, name: 'Javier Fraga', points: 1650, tournamentsWon: 0, matches: 14, trend: '-2' },
  ];

  // Tournament Sponsors
  const tournamentSponsors: TournamentSponsor[] = [
    { id: 'sp-1', name: 'Estrella Galicia 0,0', logoUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=200&q=80', websiteUrl: 'https://estrellagalicia.es', description: 'Patrocinador oficial de avituallamiento y entrega de premios.' },
    { id: 'sp-2', name: 'Bullpadel Oficial', logoUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=200&q=80', websiteUrl: 'https://bullpadel.com', description: 'Pala oficial del torneo y paleteros para campeones.' },
    { id: 'sp-3', name: 'Clínica Fisioterapia Narón', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&q=80', websiteUrl: 'https://fisionaron.es', description: 'Atención fisioterapéutica en pista durante semifinales y finales.' },
  ];

  const handleBlockCourtsInAgenda = () => {
    // Automatically block courts in the club's reservation agenda for this tournament!
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

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-6xl">
      {/* 1. Header with View Title & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Competiciones, Cuadros & Rankings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentTenant.name} · Módulo integral de gestión de torneos, cuadros, inscripciones y rankings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInscriptionModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 transition flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Inscribir Pareja</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Torneo</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-TABS NAVIGATION */}
      <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold overflow-x-auto">
        {[
          { id: 'tournaments', label: 'Torneos Activos', icon: Trophy },
          { id: 'inscriptions', label: 'Fase de Inscripción (Parejas)', icon: Users },
          { id: 'draws', label: 'Gestión de Cuadros (Brackets)', icon: Calendar },
          { id: 'rankings', label: 'Gestión de Rankings del Club', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminSubTab(tab.id as typeof activeAdminSubTab)}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: TORNEOS ACTIVOS LIST & CARDS */}
      {activeAdminSubTab === 'tournaments' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Barra de Filtros y Buscador de Competiciones */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar torneo por título, formato o ranking..."
                value={tournamentSearch}
                onChange={(e) => setTournamentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                Todos ({tournaments.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('registration_open')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === 'registration_open'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                Inscripción Abierta
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('in_progress')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === 'in_progress'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                En Juego
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tournaments
              .filter((t) => {
                const matchSearch =
                  t.title.toLowerCase().includes(tournamentSearch.toLowerCase()) ||
                  t.description.toLowerCase().includes(tournamentSearch.toLowerCase()) ||
                  (t.rankingCategory && t.rankingCategory.toLowerCase().includes(tournamentSearch.toLowerCase()));
                const matchStatus = statusFilter === 'all' || t.status === statusFilter;
                return matchSearch && matchStatus;
              })
              .map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">
                      {t.dates}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase">
                      {t.status === 'registration_open' ? 'Inscripción Abierta' : 'En Curso'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.description}</p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-slate-400 text-[10px]">Formato de Juego:</div>
                      <div className="font-bold text-slate-900 dark:text-white capitalize mt-0.5">
                        {t.format || 'Eliminación Directa'}
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-slate-400 text-[10px]">Ranking Vinculado:</div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {t.rankingCategory || 'Circuito Setmio Oro'}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Badge */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Pago: <strong>Online o en Club</strong></span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {t.entryFee.toFixed(2)} €/jugador
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedTournament(t);
                      setActiveAdminSubTab('draws');
                      if (typeof window !== 'undefined') {
                        window.history.pushState({}, '', `/gestion/torneos/${t.id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition text-center cursor-pointer shadow-xs"
                  >
                    Ver Cuadros, Fases & Horarios
                  </button>

                  {/* Poster Visor Button */}
                  <button
                    onClick={() => setPosterModalUrl(t.bannerUrl)}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                    title="Ver cartel oficial a pantalla completa"
                  >
                    <Eye className="w-4 h-4 text-emerald-500" />
                    <span>Cartel</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tournament Sponsors Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-500" />
                  <span>Patrocinadores Oficiales de Competición</span>
                </h3>
                <p className="text-xs text-slate-500">Sponsors visibles en cartelería, cuadros y entrega de trofeos.</p>
              </div>

              <button
                onClick={() => triggerDemoToast('Añadir Sponsor', 'Formulario para vincular patrocinador abierto.', 'info')}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                + Vincular Sponsor
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tournamentSponsors.map((sp) => (
                <div key={sp.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <img src={sp.logoUrl} alt={sp.name} className="w-12 h-12 rounded-xl object-cover border border-slate-300 dark:border-slate-700" />
                  <div className="min-w-0 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white truncate">{sp.name}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{sp.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: FASE DE INSCRIPCIÓN (PAREJAS) */}
      {activeAdminSubTab === 'inscriptions' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Fase de Inscripción de Parejas (Sin Cuadros Públicos)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Los jugadores se registran con sus datos de socio. Ambos integrantes deben confirmar para entrar en el sorteo.
              </p>
            </div>

            <button
              onClick={() => setIsInscriptionModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Inscribir Pareja en Torneo</span>
            </button>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Jugador 1 (Titular)</th>
                  <th className="py-3 px-4">Jugador 2 (Pareja)</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Pago</th>
                  <th className="py-3 px-4">Estado Confirmación</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {registeredPairs.map((pair) => (
                  <tr key={pair.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{pair.player1.name}</div>
                      <div className="text-[11px] text-slate-500">Nivel {pair.player1.level.toFixed(2)} · {pair.player1.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{pair.player2.name}</div>
                      <div className="text-[11px] text-slate-500">Nivel {pair.player2.level.toFixed(2)} · {pair.player2.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {pair.category}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pair.paymentStatus === 'paid'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                      }`}>
                        {pair.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente Pago'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-max ${
                        pair.status === 'confirmed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{pair.status === 'confirmed' ? 'Ambos Confirmados' : 'Pendiente Aceptación Pareja'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => triggerDemoToast('Recordatorio Enviado', `Notificación in-app enviada a ${pair.player2.name}.`, 'info')}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-[11px] font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Reenviar Notif.
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB 3: GESTIÓN DE CUADROS & BLOQUEO AUTOMÁTICO DE PISTAS */}
      {activeAdminSubTab === 'draws' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Cuadros Oficiales (Brackets)
              </div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white mt-0.5">
                {selectedTournament.title} · Cuadro Principal
              </h3>
              <p className="text-xs text-slate-500">
                Generación automática de cruces y asignación de pistas para evitar solapamientos.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* REQUIREMENT: Bloqueo automático de pistas en la agenda */}
              <button
                onClick={handleBlockCourtsInAgenda}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>Bloquear Pistas en Agenda</span>
              </button>

              <button
                onClick={() => triggerDemoToast('Cuadro Sorteado', 'Nuevo cuadro generado con cabezas de serie FGP.', 'success')}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition"
              >
                Regenerar Sorteo
              </button>
            </div>
          </div>

          {/* Visual Bracket Matches List */}
          <div className="space-y-3">
            {brackets.map((match) => (
              <div
                key={match.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-20 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs text-center border border-emerald-500/30">
                    {match.round}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {match.team1} <span className="text-slate-400 font-normal">vs</span> {match.team2}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        {match.scheduledTime}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        {match.courtName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                    Resultado: <strong className="text-emerald-600 dark:text-emerald-400">{match.score}</strong>
                  </span>
                  <button
                    onClick={() => {
                      const newScore = prompt('Introduce resultado:', match.score || '6-3, 6-4');
                      if (newScore) {
                        setBrackets((prev) => prev.map((b) => b.id === match.id ? { ...b, score: newScore, isCompleted: true } : b));
                        triggerDemoToast('Resultado Actualizado', `Marcador guardado: ${newScore}`, 'success');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Editar Score
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 4: GESTIÓN DE RANKINGS DEL CLUB */}
      {activeAdminSubTab === 'rankings' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Rankings Oficiales del Club ({newRanking})
              </h3>
              <p className="text-xs text-slate-500">
                Puntuación acumulada de torneos: Campeón (+1000 pts), Finalista (+600 pts), Semis (+360 pts).
              </p>
            </div>

            <button
              onClick={() => triggerDemoToast('Puntos Recalculados', 'La tabla de ranking se ha sincronizado con los últimos resultados.', 'success')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Recalcular Puntos
            </button>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Posición</th>
                  <th className="py-3 px-4">Jugador</th>
                  <th className="py-3 px-4">Puntos Totales</th>
                  <th className="py-3 px-4">Torneos Ganados</th>
                  <th className="py-3 px-4">Partidos</th>
                  <th className="py-3 px-4 text-right">Tendencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {rankingsData.map((row) => (
                  <tr key={row.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                    <td className="py-3.5 px-4 font-mono font-black text-sm">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        row.rank === 1 ? 'bg-amber-400 text-slate-950 font-bold' : row.rank === 2 ? 'bg-slate-300 text-slate-950 font-bold' : row.rank === 3 ? 'bg-amber-700 text-white font-bold' : 'text-slate-500'
                      }`}>
                        #{row.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {row.points} pts
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {row.tournamentsWon} títulos
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {row.matches} jugados
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-500">
                      {row.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. FULLSCREEN POSTER VIEWER MODAL WITH DOWNLOAD (Requirement) */}
      {posterModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Cartel Oficial de Competición</h3>
              <button
                onClick={() => setPosterModalUrl(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 h-[65vh]">
              <img
                src={posterModalUrl}
                alt="Cartel oficial del torneo"
                className="w-full h-full object-contain bg-slate-950"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Resolución alta definición 300 DPI</span>
              <a
                href={posterModalUrl}
                download="cartel-torneo-setmio.jpg"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Cartel</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL CREAR NUEVO TORNEO (Con Formatos y Rankings) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Crear Nuevo Torneo</h3>
              <p className="text-xs text-slate-500 mt-0.5">Configura formato, ranking puntuable y modalidades de pago.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Nombre del Torneo</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. II Open Primavera Setmio"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Formato de Competición</label>
                <select
                  value={newFormat}
                  onChange={(e) => setNewFormat(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="elimination">Eliminación Directa (Principal + Consolación)</option>
                  <option value="league">Liga Regular (Fase de grupos todos contra todos)</option>
                  <option value="pozo">Pozo / Mixing (Americano dinámico por tiempo)</option>
                  <option value="league_and_elimination">Liga + Eliminación (Grupos y cuadro eliminatorio)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Ranking Puntuable</label>
                <select
                  value={newRanking}
                  onChange={(e) => setNewRanking(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="Circuito Setmio Oro">Circuito Setmio Oro (Oficial Club)</option>
                  <option value="Ranking Social San Mateo">Ranking Social San Mateo</option>
                  <option value="Circuito Federación Gallega">Circuito Federación Gallega</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Modalidad de Pago</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="both">Ambos (Online y en Club)</option>
                    <option value="online">Solo Pago Online</option>
                    <option value="club">Solo Pago en Recepción Club</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Tarifa (€/jugador)</label>
                  <input
                    type="number"
                    value={newEntryFee}
                    onChange={(e) => setNewEntryFee(parseFloat(e.target.value) || 25)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  triggerDemoToast('Torneo Creado', `El torneo "${newTitle || 'Nuevo Torneo'}" ha sido publicado con éxito.`, 'success');
                }}
                className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
              >
                Publicar Torneo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL INSCRIBIR PAREJA CON AUTOCOMPLETADO */}
      {isInscriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <form onSubmit={handleRegisterPair} className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <button
              type="button"
              onClick={() => setIsInscriptionModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Inscripción de Pareja</h3>
              <p className="text-xs text-slate-500 mt-0.5">Selecciona los jugadores desde la base de datos de socios del club.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Jugador 1 (Titular)</label>
                <select
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                >
                  {clubMembers.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} (Nivel {m.level.toFixed(2)}) · {m.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Jugador 2 (Pareja)</label>
                <select
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                >
                  {clubMembers.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} (Nivel {m.level.toFixed(2)}) · {m.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Categoría</label>
                  <select
                    value={pairCategory}
                    onChange={(e) => setPairCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="1ª Categoría Masculina">1ª Masculina</option>
                    <option value="2ª Categoría Masculina">2ª Masculina</option>
                    <option value="1ª Categoría Femenina">1ª Femenina</option>
                    <option value="2ª Categoría Femenina">2ª Femenina</option>
                    <option value="Mixto A">Mixto A</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Modalidad Pago</label>
                  <select
                    value={pairPaymentMethod}
                    onChange={(e) => setPairPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="club">Pago en Club (Recepción / Bizum)</option>
                    <option value="online">Pago Online (Tarjeta)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-800 dark:text-emerald-300">
                <strong>Confirmación obligatoria:</strong> Tras registrar la pareja, se enviará una notificación in-app y WhatsApp a {player2Name} para aceptar formalmente la inscripción.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => setIsInscriptionModalOpen(false)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
              >
                Confirmar Inscripción
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
