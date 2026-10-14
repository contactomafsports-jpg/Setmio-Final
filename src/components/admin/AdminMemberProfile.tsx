import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  User,
  CreditCard,
  Trophy,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  TrendingUp,
  Activity,
  Award,
  Clock,
  Sparkles,
  MessageCircle,
  Plus,
  Receipt,
  FileText,
  Shield,
  Edit2,
  DollarSign,
  ChevronRight,
  Flame,
  Check,
  X,
  Lock,
  Swords,
  Layers,
  ChevronLeft,
  Eye,
  Star,
  Search,
  Filter,
  ExternalLink,
  Users,
  Target,
  BarChart3,
  Percent,
  Zap,
  Info,
} from 'lucide-react';

export interface AdminMemberData {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberNum: string;
  level: number;
  balance: number;
  isMember: boolean;
  matches: number;
  avatarUrl?: string;
  hand?: string;
  position?: string;
  status?: string;
  racket?: string;
  racketBrand?: string;
}

interface AdminMemberProfileProps {
  member: AdminMemberData;
  onBack: () => void;
}

export const AdminMemberProfile: React.FC<AdminMemberProfileProps> = ({ member, onBack }) => {
  const { currentUser, currentTenant, triggerDemoToast, setAdminTab, t } = useApp();

  // Role detection
  const isAdmin =
    currentUser.role === 'SUPERADMIN' ||
    currentUser.role === 'TENANT_OWNER' ||
    currentUser.role === 'RECEPTION' ||
    currentUser.role === 'COACH';

  const isSelf =
    currentUser.role === 'PLAYER' &&
    (currentUser.email === member.email || currentUser.name === member.name);

  // Both Admin and the Player themselves can edit racket, level, position, hand and contact info
  const canEdit = isAdmin || isSelf;

  // If viewing as external rival / public, hide financial details
  const isPublicRival = !isAdmin && !isSelf;

  const [memberData, setMemberData] = useState<AdminMemberData>({
    ...member,
    status: member.status || (member.isMember ? 'Activo (Al día)' : 'Esporádico'),
    hand: member.hand || 'Diestro',
    position: member.position || 'Revés',
    racket: member.racket || 'Bullpadel Vertex 04 2026',
    racketBrand: member.racketBrand || 'Bullpadel',
  });

  const [currentBalance, setCurrentBalance] = useState(member.balance);
  const [paymentPermission, setPaymentPermission] = useState<'default' | 'all' | 'online_only' | 'counter_allowed'>(
    (member as any).paymentMethodPermission || 'default'
  );
  const [customDiscount, setCustomDiscount] = useState<string>(
    (member as any).customDiscountType || 'none'
  );

  // Modals state
  const [allMatchesModalOpen, setAllMatchesModalOpen] = useState(false);
  const [selectedMatchDetail, setSelectedMatchDetail] = useState<any | null>(null);
  const [allCompetitionsModalOpen, setAllCompetitionsModalOpen] = useState(false);
  const [selectedCompetitionDetail, setSelectedCompetitionDetail] = useState<any | null>(null);
  const [selectedPartnerDetail, setSelectedPartnerDetail] = useState<any | null>(null);
  const [selectedRivalDetail, setSelectedRivalDetail] = useState<any | null>(null);

  // Interactive Chart state
  const [chartTimeframe, setChartTimeframe] = useState<'6m' | 'season' | 'all'>('6m');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Horizontal Carousels Smooth Scroll Refs
  const partnersScrollRef = useRef<HTMLDivElement>(null);
  const rivalsScrollRef = useRef<HTMLDivElement>(null);

  const scrollPartners = (direction: 'left' | 'right') => {
    if (partnersScrollRef.current) {
      partnersScrollRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth',
      });
    }
  };

  const scrollRivals = (direction: 'left' | 'right') => {
    if (rivalsScrollRef.current) {
      rivalsScrollRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth',
      });
    }
  };

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: memberData.name,
    email: memberData.email,
    phone: memberData.phone,
    memberNum: memberData.memberNum,
    level: memberData.level,
    position: memberData.position || 'Revés',
    hand: memberData.hand || 'Diestro',
    status: memberData.status || 'Activo (Al día)',
    racket: memberData.racket || 'Bullpadel Vertex 04 2026',
    racketBrand: memberData.racketBrand || 'Bullpadel',
  });

  // Wallet Recharge & Checkout Gateway State
  const [customRechargeInput, setCustomRechargeInput] = useState('');
  const [checkoutModalData, setCheckoutModalData] = useState<{ amount: number } | null>(null);
  const [checkoutMethod, setCheckoutMethod] = useState<'pos_card' | 'cash' | 'bizum'>('pos_card');

  // Competitions Modal filters
  const [compSearchQuery, setCompSearchQuery] = useState('');
  const [compCategoryFilter, setCompCategoryFilter] = useState('all');

  // Stats mock data ricos y completos
  const totalMatches = Math.max(memberData.matches || 38, 28);
  const winRate = 68.4;
  const wonMatches = Math.round((totalMatches * winRate) / 100);
  const lostMatches = totalMatches - wonMatches;
  const streak = '+4 Victorias';
  const setsWon = 58;
  const setsLost = 26;

  // Tendencia de nivel ELO certificada
  const levelTrend = {
    delta: '+0.45 ELO',
    percentage: '+13.2%',
    initialLevel: 3.40,
    currentLevel: Number((memberData.level || 3.85).toFixed(2)),
    status: 'En Progresión Alta',
    reliability: '96% FEP Certificado',
    period: 'Últimos 90 días',
  };

  // Ranking del club
  const clubRanking = {
    rank: 7,
    totalPlayers: 240,
    category: '1ª Categoría Club',
    points: 2450,
  };

  // Histórico de Nivel ELO mes a mes (Gráficos)
  const eloHistoryPoints = [
    {
      month: 'May',
      fullName: 'Mayo 2026',
      level: 3.35,
      elo: 1380,
      matches: 4,
      milestone: 'Inicio de temporada oficial FEP',
      delta: '+0.00',
    },
    {
      month: 'Jun',
      fullName: 'Junio 2026',
      level: 3.40,
      elo: 1420,
      matches: 6,
      milestone: 'Campeón Consolación · Torneo Benéfico Rías Altas',
      delta: '+0.05',
    },
    {
      month: 'Jul',
      fullName: 'Julio 2026',
      level: 3.55,
      elo: 1485,
      matches: 8,
      milestone: 'Playoff Cuartos · Liga Autonómica Interclubes',
      delta: '+0.15',
    },
    {
      month: 'Ago',
      fullName: 'Agosto 2026',
      level: 3.65,
      elo: 1530,
      matches: 7,
      milestone: '🏆 Campeón Cuadro Principal · Nocturno Estrella Galicia',
      delta: '+0.10',
    },
    {
      month: 'Sep',
      fullName: 'Septiembre 2026',
      level: 3.75,
      elo: 1595,
      matches: 8,
      milestone: '🥈 Finalista Subcampeón · I Open Primavera San Mateo',
      delta: '+0.10',
    },
    {
      month: 'Oct',
      fullName: 'Octubre 2026',
      level: Number((memberData.level || 3.85).toFixed(2)),
      elo: 1640,
      matches: 5,
      milestone: 'Certificación FEP Oficial · Nivel Consolidado en Top 3%',
      delta: '+0.10',
    },
  ];

  // Top 5 Compañeros habituales (carrusel horizontal full-width)
  const frequentPartners = [
    {
      id: 'p-1',
      name: 'Mateo Varela',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      level: 5.5,
      matchesTogether: 18,
      wonTogether: 14,
      lostTogether: 4,
      winRateTogether: 78,
      position: 'Drive',
      streakTogether: '+4 Victorias',
      compatibility: 96,
      bestTournament: 'Torneo Nocturno Estrella Galicia (Campeones)',
      playStyle: 'Volea agresiva y salida de pared rápida',
    },
    {
      id: 'p-2',
      name: 'Lucas Piñeiro',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      level: 3.85,
      matchesTogether: 12,
      wonTogether: 9,
      lostTogether: 3,
      winRateTogether: 75,
      position: 'Revés',
      streakTogether: '+2 Victorias',
      compatibility: 91,
      bestTournament: 'I Open Primavera (Finalistas)',
      playStyle: 'Control táctico y bandeja profunda',
    },
    {
      id: 'p-3',
      name: 'Diego Soto',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      level: 3.9,
      matchesTogether: 9,
      wonTogether: 6,
      lostTogether: 3,
      winRateTogether: 67,
      position: 'Drive',
      streakTogether: '+1 Victoria',
      compatibility: 88,
      bestTournament: 'Liga Autonómica Interclubes FGP (Cuartos)',
      playStyle: 'Zurdo técnico con globo milimétrico',
    },
    {
      id: 'p-4',
      name: 'Pablo Álvarez',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      level: 4.2,
      matchesTogether: 7,
      wonTogether: 5,
      lostTogether: 2,
      winRateTogether: 71,
      position: 'Ambas',
      streakTogether: '+1 Victoria',
      compatibility: 85,
      bestTournament: 'Master Final San Mateo (Semifinalistas)',
      playStyle: 'Pegada potente y remate en suspensión',
    },
    {
      id: 'p-5',
      name: 'Javier Domínguez',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      level: 4.0,
      matchesTogether: 6,
      wonTogether: 4,
      lostTogether: 2,
      winRateTogether: 66,
      position: 'Revés',
      streakTogether: '+2 Victorias',
      compatibility: 82,
      bestTournament: 'Torneo Social Club San Mateo',
      playStyle: 'Solidez en defensa y bloqueo de red',
    },
  ];

  // Top 5 Rivales habituales (carrusel horizontal full-width)
  const habitualRivals = [
    {
      id: 'r-1',
      name: 'David Castro',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      level: 4.1,
      position: 'Revés',
      h2hMatches: 14,
      winsAgainst: 8,
      lossesAgainst: 6,
      balance: '8V - 6D',
      winRate: 57,
      lastMatch: 'Victoria 6-4, 7-5 (04 Oct 2026)',
      setsRatio: '18 - 14',
      rivalryType: 'Duelo Clásico de Revés',
      intensity: 'Muy Alta',
    },
    {
      id: 'r-2',
      name: 'Sergio Ramos',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      level: 4.5,
      position: 'Drive',
      h2hMatches: 11,
      winsAgainst: 5,
      lossesAgainst: 6,
      balance: '5V - 6D',
      winRate: 45,
      lastMatch: 'Derrota 4-6, 5-7 (28 Sep 2026)',
      setsRatio: '12 - 13',
      rivalryType: 'Máxima Exigencia Física',
      intensity: 'Extrema',
    },
    {
      id: 'r-3',
      name: 'Carlos Soto',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      level: 4.0,
      position: 'Drive',
      h2hMatches: 9,
      winsAgainst: 6,
      lossesAgainst: 3,
      balance: '6V - 3D',
      winRate: 67,
      lastMatch: 'Victoria 6-3, 6-4 (18 Sep 2026)',
      setsRatio: '13 - 7',
      rivalryType: 'Reto Técnico en Red',
      intensity: 'Alta',
    },
    {
      id: 'r-4',
      name: 'Manuel Gómez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      level: 3.6,
      position: 'Revés',
      h2hMatches: 8,
      winsAgainst: 7,
      lossesAgainst: 1,
      balance: '7V - 1D',
      winRate: 88,
      lastMatch: 'Victoria 6-2, 6-3 (24 Sep 2026)',
      setsRatio: '14 - 3',
      rivalryType: 'Dominio Táctico de Fondo',
      intensity: 'Media',
    },
    {
      id: 'r-5',
      name: 'Alberto Morales',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      level: 4.0,
      position: 'Drive',
      h2hMatches: 7,
      winsAgainst: 4,
      lossesAgainst: 3,
      balance: '4V - 3D',
      winRate: 57,
      lastMatch: 'Victoria 6-3, 3-6, 7-6 (01 Oct 2026)',
      setsRatio: '9 - 8',
      rivalryType: 'Desempate en Super Tie-Break',
      intensity: 'Alta',
    },
  ];

  // Match History (6 partidos realistas con todos los detalles)
  const matchHistory = [
    {
      id: 'm-1',
      date: '04 Oct 2026',
      time: '18:00 - 19:30',
      court: 'Pista 1 Central (Panorámica WPT)',
      courtImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80',
      result: 'Victoria',
      score: '6-4, 7-5',
      isWin: true,
      minLevel: 3.75,
      maxLevel: 4.5,
      gender: 'male',
      visibility: 'public',
      isClubCreated: true,
      paymentMode: 'split',
      pricePerPlayer: 7.0,
      paymentPolicy: 'both',
      players: [
        { name: memberData.name, level: memberData.level, position: 'reves', paid: true },
        { name: 'Mateo Varela', level: 5.5, position: 'drive', paid: true },
        { name: 'Juan Pena', level: 3.9, position: 'reves', paid: true },
        { name: 'Carlos Soto', level: 4.0, position: 'drive', paid: true },
      ],
      team1: [
        { name: memberData.name, avatar: memberData.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', level: memberData.level },
        { name: 'Mateo Varela', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', level: 5.5 },
      ],
      team2: [
        { name: 'Juan Pena', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80', level: 3.9 },
        { name: 'Carlos Soto', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', level: 4.0 },
      ],
      type: 'Partida Abierta Level 4.0',
      paid: true,
      amount: '7.00 €',
    },
    {
      id: 'm-2',
      date: '01 Oct 2026',
      time: '19:30 - 21:00',
      court: 'Pista 3 (Indoor Pro)',
      courtImage: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=400&q=80',
      result: 'Victoria',
      score: '6-3, 3-6, 7-6(4)',
      isWin: true,
      minLevel: 3.5,
      maxLevel: 4.25,
      gender: 'male',
      visibility: 'group',
      restrictedGroupName: 'Veteranos A',
      isClubCreated: false,
      creatorName: 'Lucas Piñeiro',
      paymentMode: 'split',
      pricePerPlayer: 7.0,
      paymentPolicy: 'online_only',
      players: [
        { name: memberData.name, level: memberData.level, position: 'reves', paid: true },
        { name: 'Lucas Piñeiro', level: 3.85, position: 'drive', paid: true },
        { name: 'David Castro', level: 4.1, position: 'reves', paid: true },
        { name: 'Alberto Morales', level: 4.0, position: 'drive', paid: true },
      ],
      team1: [
        { name: memberData.name, avatar: memberData.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', level: memberData.level },
        { name: 'Lucas Piñeiro', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', level: 3.85 },
      ],
      team2: [
        { name: 'David Castro', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', level: 4.1 },
        { name: 'Alberto Morales', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', level: 4.0 },
      ],
      type: 'Partido Privado Socios',
      paid: true,
      amount: '7.00 €',
    },
    {
      id: 'm-3',
      date: '28 Sep 2026',
      time: '11:00 - 12:30',
      court: 'Pista 2 (Panorámica)',
      courtImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80',
      result: 'Derrota',
      score: '4-6, 5-7',
      isWin: false,
      minLevel: 4.0,
      maxLevel: 5.0,
      gender: 'mixed',
      visibility: 'public',
      isClubCreated: true,
      paymentMode: 'split',
      pricePerPlayer: 8.0,
      paymentPolicy: 'both',
      players: [
        { name: memberData.name, level: memberData.level, position: 'reves', paid: true },
        { name: 'Mateo Varela', level: 5.5, position: 'drive', paid: true },
        { name: 'Sergio Ramos', level: 4.5, position: 'reves', paid: true },
        { name: 'Marcos Blanco', level: 4.3, position: 'drive', paid: true },
      ],
      team1: [
        { name: memberData.name, avatar: memberData.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', level: memberData.level },
        { name: 'Mateo Varela', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', level: 5.5 },
      ],
      team2: [
        { name: 'Sergio Ramos', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80', level: 4.5 },
        { name: 'Marcos Blanco', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', level: 4.3 },
      ],
      type: 'Liga Social de Primavera - J4',
      paid: true,
      amount: '8.00 €',
    },
    {
      id: 'm-4',
      date: '24 Sep 2026',
      time: '20:00 - 21:30',
      court: 'Pista 4 (Cubierta)',
      courtImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      result: 'Victoria',
      score: '6-2, 6-3',
      isWin: true,
      minLevel: 3.5,
      maxLevel: 4.0,
      gender: 'male',
      visibility: 'public',
      isClubCreated: true,
      paymentMode: 'split',
      pricePerPlayer: 6.5,
      paymentPolicy: 'counter_only',
      players: [
        { name: memberData.name, level: memberData.level, position: 'reves', paid: true },
        { name: 'Diego Soto', level: 3.9, position: 'drive', paid: true },
        { name: 'Manuel Gómez', level: 3.6, position: 'reves', paid: true },
        { name: 'Jorge López', level: 3.8, position: 'drive', paid: true },
      ],
      team1: [
        { name: memberData.name, avatar: memberData.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', level: memberData.level },
        { name: 'Diego Soto', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', level: 3.9 },
      ],
      team2: [
        { name: 'Manuel Gómez', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', level: 3.6 },
        { name: 'Jorge López', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', level: 3.8 },
      ],
      type: 'Partido Amistoso Reto',
      paid: true,
      amount: '6.50 €',
    },
    {
      id: 'm-5',
      date: '19 Sep 2026',
      time: '17:30 - 19:00',
      court: 'Pista 1 Central (Panorámica WPT)',
      courtImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80',
      result: 'Victoria',
      score: '6-4, 6-2',
      isWin: true,
      minLevel: 3.8,
      maxLevel: 4.6,
      gender: 'male',
      visibility: 'public',
      isClubCreated: true,
      paymentMode: 'split',
      pricePerPlayer: 8.0,
      paymentPolicy: 'both',
      players: [
        { name: memberData.name, level: memberData.level, position: 'reves', paid: true },
        { name: 'Mateo Varela', level: 5.5, position: 'drive', paid: true },
        { name: 'Alberto Morales', level: 4.0, position: 'reves', paid: true },
        { name: 'Carlos Soto', level: 4.0, position: 'drive', paid: true },
      ],
      team1: [
        { name: memberData.name, avatar: memberData.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', level: memberData.level },
        { name: 'Mateo Varela', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', level: 5.5 },
      ],
      team2: [
        { name: 'Alberto Morales', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', level: 4.0 },
        { name: 'Carlos Soto', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', level: 4.0 },
      ],
      type: 'Semifinal Cuadro Social Oro',
      paid: true,
      amount: '8.00 €',
    },
    {
      id: 'm-6',
      date: '12 Sep 2026',
      time: '10:30 - 12:00',
      court: 'Pista 5 (Cristal Pro)',
      courtImage: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=400&q=80',
      result: 'Derrota',
      score: '6-7(5), 4-6',
      isWin: false,
      minLevel: 3.75,
      maxLevel: 4.25,
      gender: 'male',
      visibility: 'public',
      isClubCreated: false,
      creatorName: 'David Castro',
      paymentMode: 'split',
      pricePerPlayer: 7.5,
      paymentPolicy: 'online_only',
      players: [
        { name: memberData.name, level: memberData.level, position: 'reves', paid: true },
        { name: 'Pablo Álvarez', level: 4.2, position: 'drive', paid: true },
        { name: 'David Castro', level: 4.1, position: 'reves', paid: true },
        { name: 'Sergio Ramos', level: 4.5, position: 'drive', paid: true },
      ],
      team1: [
        { name: memberData.name, avatar: memberData.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', level: memberData.level },
        { name: 'Pablo Álvarez', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80', level: 4.2 },
      ],
      team2: [
        { name: 'David Castro', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', level: 4.1 },
        { name: 'Sergio Ramos', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80', level: 4.5 },
      ],
      type: 'Interclubes Amistoso Rías Altas',
      paid: true,
      amount: '7.50 €',
    },
  ];

  // Tournaments History (5 torneos completos y realistas)
  const tournamentHistory = [
    {
      id: 'tourn-1',
      name: 'I Open Primavera Pádel San Mateo 2026',
      date: 'Sep 2026',
      category: '2ª Categoría Masculina',
      position: 'Subcampeón (Finalista)',
      partner: 'Mateo Varela',
      rounds: '5 Rondas superadas (4V - 1D)',
      badge: '🥈 Plata',
      imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80',
      matchesWon: 4,
      matchesLost: 1,
      prize: '150 € + Material Deportivo Bullpadel',
      pointsEarned: '+180 Puntos Ranking Club',
    },
    {
      id: 'tourn-2',
      name: 'Torneo Nocturno Estrella Galicia Pro',
      date: 'Ago 2026',
      category: '3ª Categoría Oro',
      position: 'Campeón de Cuadro Principal',
      partner: 'Lucas Piñeiro',
      rounds: 'Campeones invictos (5V - 0D)',
      badge: '🏆 Oro',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      matchesWon: 5,
      matchesLost: 0,
      prize: 'Trofeo Oficial + Pala Bullpadel Vertex 04',
      pointsEarned: '+250 Puntos Ranking Club',
    },
    {
      id: 'tourn-3',
      name: 'Liga Autonómica Gallega FGP — Fase Interclubes',
      date: 'Jul 2026',
      category: 'Federado 1ª División Club',
      position: 'Cuartos de Final (Playoff)',
      partner: 'Diego Soto',
      rounds: 'Clasificados para playoff autonómico (3V - 2D)',
      badge: '⭐ Cuartos',
      imageUrl: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=600&q=80',
      matchesWon: 3,
      matchesLost: 2,
      prize: 'Puntos Oficiales Ranking FEP / FGP',
      pointsEarned: '+120 Puntos Ranking Club',
    },
    {
      id: 'tourn-4',
      name: 'Master Final San Mateo 2025',
      date: 'Dic 2025',
      category: '1ª Categoría Oro',
      position: 'Semifinalista de Cuadro',
      partner: 'Mateo Varela',
      rounds: '3 Rondas disputadas (2V - 1D)',
      badge: '🥉 Bronce',
      imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
      matchesWon: 2,
      matchesLost: 1,
      prize: 'Bolsa de deporte Bullpadel Pro Tour',
      pointsEarned: '+100 Puntos Ranking Club',
    },
    {
      id: 'tourn-5',
      name: 'Torneo Benéfico de Verano Rías Altas',
      date: 'Jun 2025',
      category: 'Categoría Abierta Mixta',
      position: 'Campeón de Consolación',
      partner: 'Elena Castro',
      rounds: '4 Rondas superadas (3V - 1D)',
      badge: '🏅 Consolación',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      matchesWon: 3,
      matchesLost: 1,
      prize: 'Pack hidratación + Toalla oficial microfibra',
      pointsEarned: '+80 Puntos Ranking Club',
    },
  ];

  // Filtered competitions for the modal
  const filteredCompetitions = useMemo(() => {
    return tournamentHistory.filter((t) => {
      const matchSearch =
        compSearchQuery === '' ||
        t.name.toLowerCase().includes(compSearchQuery.toLowerCase()) ||
        t.partner.toLowerCase().includes(compSearchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(compSearchQuery.toLowerCase());

      const matchCat =
        compCategoryFilter === 'all' ||
        (compCategoryFilter === '1' && t.category.includes('1ª')) ||
        (compCategoryFilter === '2' && t.category.includes('2ª')) ||
        (compCategoryFilter === '3' && t.category.includes('3ª')) ||
        (compCategoryFilter === 'fed' && t.category.toLowerCase().includes('federad'));

      return matchSearch && matchCat;
    });
  }, [tournamentHistory, compSearchQuery, compCategoryFilter]);

  // Financial Ledger
  const [financialTransactions, setFinancialTransactions] = useState([
    {
      id: 'tx-1',
      date: '04 Oct 2026, 17:45',
      concept: 'Pago Pista Turno 18:00 - Pista 1',
      category: 'Pistas',
      amount: -7.0,
      balanceAfter: currentBalance,
      method: 'Monedero Club',
    },
    {
      id: 'tx-2',
      date: '03 Oct 2026, 12:30',
      concept: 'Consumo Cafetería: 2x Powerade + Barrita',
      category: 'TPV Bar',
      amount: -5.5,
      balanceAfter: currentBalance + 7.0,
      method: 'TPV Barra',
    },
    {
      id: 'tx-3',
      date: '01 Oct 2026, 10:15',
      concept: 'Recarga Monedero Mostrador (+5% Promo)',
      category: 'Recarga',
      amount: 30.0,
      balanceAfter: currentBalance + 12.5,
      method: 'Tarjeta Stripe',
    },
  ]);

  // Universal Back Handler coherente
  const handleUniversalBack = () => {
    try {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        window.history.back();
      } else {
        onBack();
      }
    } catch {
      onBack();
    }
  };

  const initiateRecharge = (amount: number) => {
    if (amount <= 0) return;
    setCheckoutModalData({ amount });
  };

  const confirmRecharge = () => {
    if (!checkoutModalData) return;
    const amount = checkoutModalData.amount;
    const newBal = currentBalance + amount;
    setCurrentBalance(newBal);

    const methodName =
      checkoutMethod === 'pos_card'
        ? 'TPV Mostrador / Tarjeta'
        : checkoutMethod === 'cash'
        ? 'Efectivo en Recepción'
        : 'Bizum / Transferencia';

    setFinancialTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        date: 'Hoy, ahora mismo',
        concept: `Recarga en Mostrador (${methodName})`,
        category: 'Recarga',
        amount: amount,
        balanceAfter: newBal,
        method: methodName,
      },
      ...prev,
    ]);

    triggerDemoToast(
      'Recarga Procesada',
      `Se han cobrado ${amount.toFixed(2)} € mediante ${methodName} y acreditado al saldo de ${memberData.name}.`,
      'success'
    );

    setCheckoutModalData(null);
    setCustomRechargeInput('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberData((prev) => ({
      ...prev,
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone,
      memberNum: editFormData.memberNum,
      level: Number(editFormData.level),
      position: editFormData.position,
      hand: editFormData.hand,
      status: editFormData.status,
      racket: editFormData.racket,
      racketBrand: editFormData.racketBrand,
    }));

    setIsEditModalOpen(false);
    triggerDemoToast(
      'Ficha Actualizada',
      `Los datos y el equipamiento de ${editFormData.name} han sido guardados en el CRM del club.`,
      'success'
    );
  };

  const openMatchDetail = (match: any) => {
    setSelectedMatchDetail(match);
  };

  const openCompetitionDetail = (comp: any) => {
    setSelectedCompetitionDetail(comp);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-5xl mx-auto pb-16">
      {/* 1. NAVEGACIÓN UNIVERSAL ESTÁNDAR Y BOTÓN EDITAR FICHA INTEGRADO */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleUniversalBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition shadow-xs cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('crm.backStandard', 'Volver a Socios')}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Indicador de rol activo (sin texto tosco) */}
          {isSelf && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Mi Perfil
            </span>
          )}

          {canEdit && (
            <button
              type="button"
              onClick={() => {
                setEditFormData({
                  name: memberData.name,
                  email: memberData.email,
                  phone: memberData.phone,
                  memberNum: memberData.memberNum,
                  level: memberData.level,
                  position: memberData.position || 'Revés',
                  hand: memberData.hand || 'Diestro',
                  status: memberData.status || 'Activo (Al día)',
                  racket: memberData.racket || 'Bullpadel Vertex 04 2026',
                  racketBrand: memberData.racketBrand || 'Bullpadel',
                });
                setIsEditModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t('crm.editTechnicalSheet', 'Editar Ficha')}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. CABECERA PRÉMIUM DE LA FICHA DE JUGADOR (CON RANKING DEL CLUB INTEGRADO) */}
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar destacado */}
          <div className="relative shrink-0">
            <img
              src={memberData.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'}
              alt={memberData.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-emerald-500/30 shadow-lg"
            />
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase ring-2 ring-white dark:ring-slate-900">
              {memberData.memberNum}
            </span>
          </div>

          {/* Información principal */}
          <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {memberData.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                Nivel {memberData.level.toFixed(2)}
              </span>

              {/* Botón rápido de edición integrado en la cabecera */}
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Editar datos del socio"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {!isPublicRival && (
              <p className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span>{memberData.email}</span>
                <span>·</span>
                <span>{memberData.phone}</span>
              </p>
            )}

            {/* Badges deportivas */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {memberData.position} · {memberData.hand}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {memberData.status}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>{streak}</span>
              </span>
            </div>
          </div>

          {/* RANKING DEL CLUB MOVIDO AL CONTENEDOR SUPERIOR PRINCIPAL */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 shrink-0 text-left w-full sm:w-auto min-w-[210px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span>Ranking del Club</span>
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-mono">
                Top 3%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-sm flex items-center justify-center shadow-xs">
                #{clubRanking.rank}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 dark:text-white text-xs">
                  {clubRanking.category}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {clubRanking.points} Pts · de {clubRanking.totalPlayers} socios
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MONEDERO CON PASARELA DE COBRO (Solo visible para Admin o Propio Jugador) */}
        {!isPublicRival && (
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Saldo en Monedero del Club
                </span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {currentBalance.toFixed(2)} €
                </div>
                <span className="text-[11px] text-slate-500">Saldo listo para reservas y consumiciones</span>
              </div>

              {/* Botones de recarga con importes predefinidos o personalizados */}
              {isAdmin && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Recarga Rápida en Caja:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {[10, 20, 50].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => initiateRecharge(amt)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500 font-mono font-bold text-xs border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-95 shadow-xs"
                      >
                        +{amt} €
                      </button>
                    ))}

                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        placeholder="Otro..."
                        value={customRechargeInput}
                        onChange={(e) => setCustomRechargeInput(e.target.value)}
                        className="w-20 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = parseFloat(customRechargeInput);
                          if (!isNaN(val) && val > 0) {
                            initiateRecharge(val);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer active:scale-95"
                      >
                        Cobrar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Configuración individual de formas de pago y tarifas para este socio */}
            {isAdmin && (
              <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Formas de Pago Autorizadas & Reglas de Descuento Individual</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Reglas CRM Personalizadas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1 text-[11px]">
                      Vías de Pago Permitidas:
                    </label>
                    <select
                      value={paymentPermission}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setPaymentPermission(val);
                        triggerDemoToast('Permisos de Pago Actualizados', `Formas de pago para ${memberData.name} guardadas con éxito.`, 'success');
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="default">Por defecto según categoría ({memberData.isMember ? 'Socio Oficial' : 'Cliente'})</option>
                      <option value="counter_allowed">Permitir Pago en Mostrador / Recepción</option>
                      <option value="online_only">Exigir Exclusivamente Pago Online Previo</option>
                      <option value="all">Todas las vías autorizadas (Online, Mostrador, Monedero)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1 text-[11px]">
                      Tarifa Especial / Descuento Asignado:
                    </label>
                    <select
                      value={customDiscount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomDiscount(val);
                        triggerDemoToast('Tarifa Actualizada', `Tarifa para ${memberData.name} actualizada: ${val === 'free_staff' ? 'Tarifa 0€ Staff (Gratis)' : val === 'free_coach' ? 'Tarifa 0€ Monitor (Gratis)' : val === 'vip_25' ? 'Descuento VIP 25%' : 'Tarifa Estándar'}.`, 'success');
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="none">Tarifa Estándar del Club</option>
                      <option value="free_staff">Tarifa 0€ (Gratis) — Personal y Empleados (Staff)</option>
                      <option value="free_coach">Tarifa 0€ (Gratis) — Monitor / Profesor Oficial</option>
                      <option value="vip_25">Descuento Especial VIP (25% en reservas y partidas)</option>
                      <option value="vip_50">Descuento Convenio (50% en reservas)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. ESTADÍSTICAS Y MÉTRICAS COMPLETAS (AUDITADAS PARA VALIDAR DISEÑO FINAL) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Métrica 1: Eficacia en Partidos (Win Rate) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-emerald-500" />
              <span>Eficacia en Partidos</span>
            </span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono text-sm">
              {winRate}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${winRate}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
              <Check className="w-3 h-3" />
              <span>{wonMatches} Victorias</span>
            </span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono">
              <span>{lostMatches} Derrotas</span>
            </span>
          </div>
        </div>

        {/* Métrica 2: Partidos Jugados & Racha Activa */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              <span>Partidos & Racha</span>
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800/80 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>{streak}</span>
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white flex items-baseline gap-1.5 font-mono">
            <span>{totalMatches}</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans">
              partidos oficiales
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-0.5 border-t border-slate-100 dark:border-slate-800">
            <span>Sets: <strong className="font-mono text-slate-700 dark:text-slate-300">{setsWon}G - {setsLost}P</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">Récord: 6V seguidas</span>
          </div>
        </div>

        {/* Métrica 3: Tendencia de Nivel FEP / ELO (Requerimiento Clave) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Tendencia de Nivel</span>
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/80">
              {levelTrend.status}
            </span>
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-baseline gap-1.5 font-mono">
            <span>{levelTrend.delta}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ({levelTrend.percentage})
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-0.5 border-t border-slate-100 dark:border-slate-800">
            <span>{levelTrend.period}</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{levelTrend.initialLevel.toFixed(2)} → {levelTrend.currentLevel.toFixed(2)}</span>
          </div>
        </div>

        {/* Métrica 4: Puntos de Ranking & Percentil Club */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Ranking Club</span>
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800/80 font-mono">
              Top 3%
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white flex items-baseline gap-1.5 font-mono">
            <span>{clubRanking.points.toLocaleString()}</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans">
              puntos acumulados
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-0.5 border-t border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-700 dark:text-slate-300">{clubRanking.category}</span>
            <span>Puesto #{clubRanking.rank}</span>
          </div>
        </div>
      </div>

      {/* 5. GRÁFICO DEDICADO: EVOLUCIÓN DE NIVEL ELO EN LOS ÚLTIMOS MESES */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
        {/* Cabecera del gráfico con selector de periodo y badge oficial */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  Evolución de Nivel ELO & Histórico de Puntuación
                </h3>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {levelTrend.delta} ({levelTrend.percentage})
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calibración matemática y certificación continua según resultados federados y partidas del club
              </p>
            </div>
          </div>

          {/* Selector interactivo de periodo */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl text-xs shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setChartTimeframe('6m')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                chartTimeframe === '6m'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Últimos 6 Meses
            </button>
            <button
              type="button"
              onClick={() => setChartTimeframe('season')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                chartTimeframe === 'season'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Temporada 2026
            </button>
            <button
              type="button"
              onClick={() => setChartTimeframe('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                chartTimeframe === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Histórico
            </button>
          </div>
        </div>

        {/* Lienzo SVG interactivo de alta fidelidad */}
        <div className="relative pt-2 pb-1">
          <div className="h-56 sm:h-64 w-full">
            <svg
              viewBox="0 0 600 200"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="eloAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                  <stop offset="60%" stopColor="#10b981" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
                </linearGradient>
                <filter id="glowShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10b981" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* Líneas horizontales de referencia con marcas de nivel FEP y puntos ELO */}
              {[
                { y: 30, level: '4.00', elo: '1,700' },
                { y: 65, level: '3.80', elo: '1,620' },
                { y: 100, level: '3.60', elo: '1,510' },
                { y: 135, level: '3.40', elo: '1,420' },
                { y: 170, level: '3.20', elo: '1,350' },
              ].map((line, idx) => (
                <g key={idx}>
                  <line
                    x1="45"
                    y1={line.y}
                    x2="590"
                    y2={line.y}
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800/80"
                    strokeWidth="1"
                    strokeDasharray={idx === 1 ? 'none' : '3 3'}
                  />
                  <text
                    x="5"
                    y={line.y + 4}
                    className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500 font-semibold"
                  >
                    Nv {line.level}
                  </text>
                  <text
                    x="595"
                    y={line.y + 4}
                    className="text-[9px] font-mono fill-slate-300 dark:fill-slate-600 hidden sm:inline"
                    textAnchor="start"
                  >
                    {line.elo}
                  </text>
                </g>
              ))}

              {/* Curva y Área de evolución de Nivel ELO */}
              {/* Coordenadas X: May(70), Jun(170), Jul(270), Ago(370), Sep(470), Oct(570) */}
              {/* Coordenadas Y: 3.35(143), 3.40(135), 3.55(108), 3.65(91), 3.75(74), 3.85(56) */}
              <path
                d="M 70 143 C 120 143, 120 135, 170 135 C 220 135, 220 108, 270 108 C 320 108, 320 91, 370 91 C 420 91, 420 74, 470 74 C 520 74, 520 56, 570 56 L 570 180 L 70 180 Z"
                fill="url(#eloAreaGradient)"
              />

              <path
                d="M 70 143 C 120 143, 120 135, 170 135 C 220 135, 220 108, 270 108 C 320 108, 320 91, 370 91 C 420 91, 420 74, 470 74 C 520 74, 520 56, 570 56"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#glowShadow)"
              />

              {/* Puntos de datos interactivos con animaciones y tooltips */}
              {[
                { x: 70, y: 143, idx: 0 },
                { x: 170, y: 135, idx: 1 },
                { x: 270, y: 108, idx: 2 },
                { x: 370, y: 91, idx: 3 },
                { x: 470, y: 74, idx: 4 },
                { x: 570, y: 56, idx: 5 },
              ].map((pt) => {
                const item = eloHistoryPoints[pt.idx];
                const isHovered = hoveredPointIndex === pt.idx;
                return (
                  <g
                    key={pt.idx}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredPointIndex(pt.idx)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                    onClick={() => setHoveredPointIndex(pt.idx)}
                  >
                    {/* Anillo de enfoque al pasar el cursor */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 12 : 7}
                      fill="#10b981"
                      fillOpacity={isHovered ? 0.25 : 0.15}
                      className="transition-all duration-200"
                    />
                    {/* Punto principal */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 4.5}
                      fill="#ffffff"
                      stroke="#10b981"
                      strokeWidth={isHovered ? 3 : 2.5}
                      className="transition-all duration-200 dark:fill-slate-900"
                    />

                    {/* Valor numérico flotante permanente */}
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      className={`text-[10px] font-mono font-bold transition-all duration-200 ${
                        isHovered
                          ? 'fill-emerald-600 dark:fill-emerald-400 text-xs'
                          : 'fill-slate-700 dark:fill-slate-300'
                      }`}
                    >
                      {item.level.toFixed(2)}
                    </text>

                    {/* Etiqueta del mes inferior */}
                    <text
                      x={pt.x}
                      y="195"
                      textAnchor="middle"
                      className={`text-[11px] font-bold font-mono transition-colors ${
                        isHovered
                          ? 'fill-emerald-600 dark:fill-emerald-400'
                          : 'fill-slate-500 dark:fill-slate-400'
                      }`}
                    >
                      {item.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Tooltip flotante con información rica del hito deportivo seleccionado o activo */}
          {hoveredPointIndex !== null && (
            <div className="mt-3 p-3 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-black text-xs shrink-0">
                  Nv {eloHistoryPoints[hoveredPointIndex].level.toFixed(2)}
                </div>
                <div>
                  <div className="font-bold flex items-center gap-2">
                    <span>{eloHistoryPoints[hoveredPointIndex].fullName}</span>
                    <span className="font-mono text-emerald-400 text-[11px]">
                      {eloHistoryPoints[hoveredPointIndex].elo} pts ELO
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px]">
                      {eloHistoryPoints[hoveredPointIndex].delta}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {eloHistoryPoints[hoveredPointIndex].milestone}
                  </div>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400 shrink-0 font-mono">
                {eloHistoryPoints[hoveredPointIndex].matches} partidos disputados
              </div>
            </div>
          )}
        </div>

        {/* Resumen inferior de indicadores clave del gráfico */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Nivel Inicial (May)</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">3.40 FEP</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Nivel Máximo</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">3.88 FEP</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold block">Nivel Consolidado</span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-sm">
              {levelTrend.currentLevel.toFixed(2)} FEP (~1,640 ELO)
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Fiabilidad Oficial</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">96% (38 Partidos)</span>
          </div>
        </div>
      </section>

      {/* 6. FICHA TÉCNICA (RENOMBRADA Y EDITABLE) */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {t('crm.technicalSheet', 'Ficha técnica')}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t('crm.technicalSheetDesc', 'Pala, preferencias de golpeo y complementos deportivos')}
              </p>
            </div>
          </div>
          {canEdit && (
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              <Edit2 className="w-3 h-3 text-emerald-500" />
              <span>Editar</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div
            onClick={() => canEdit && setIsEditModalOpen(true)}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 hover:border-emerald-500/50 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Pala Oficial del Jugador
              </span>
              <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{memberData.racket}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Forma Diamante · Potencia Pro</span>
          </div>

          <div
            onClick={() => canEdit && setIsEditModalOpen(true)}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 hover:border-emerald-500/50 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Lado Favorito & Golpeo
              </span>
              <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="font-bold text-slate-900 dark:text-white">
              {memberData.position} ({memberData.hand})
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Bandeja ofensiva y remate x3</span>
          </div>

          <div
            onClick={() => canEdit && setIsEditModalOpen(true)}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 hover:border-emerald-500/50 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Grip & Complementos
              </span>
              <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="font-bold text-slate-900 dark:text-white">
              2 Overgrips + ShockOut
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Amortiguación antivibración</span>
          </div>
        </div>
      </section>

      {/* 7. CARRUSELES HORIZONTALES FULL-WIDTH: COMPAÑEROS HABITUALES Y RIVALES HABITUALES */}
      <div className="space-y-6">
        {/* CARRUSEL: COMPAÑEROS HABITUALES (TOP 5) */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('crm.frequentPartners', 'Compañeros habituales')}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t('crm.frequentPartnersSubtitle', 'Top 5 parejas más recurrentes en partidos oficiales')}
                </p>
              </div>
            </div>

            {/* Controles de navegación y pill de contador */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase hidden sm:inline">
                Top 5 Parejas
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollPartners('left')}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  title="Desplazar a la izquierda"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollPartners('right')}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  title="Desplazar a la derecha"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Carrusel edge-to-edge con overflow horizontal fluido */}
          <div
            ref={partnersScrollRef}
            className="-mx-5 px-5 overflow-x-auto no-scrollbar flex items-stretch gap-3.5 pb-2 pt-1 scroll-smooth"
          >
            {frequentPartners.map((partner, idx) => (
              <div
                key={partner.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedPartnerDetail(partner)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSelectedPartnerDetail(partner);
                }}
                className="min-w-[260px] max-w-[260px] p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shrink-0 space-y-3 hover:border-emerald-500/60 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                title="Haz clic para ver el desglose completo con este compañero"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={partner.avatar}
                        alt={partner.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/40 group-hover:ring-emerald-500 transition"
                      />
                      <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-emerald-600 text-white font-mono font-black text-[10px] flex items-center justify-center shadow-xs">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 dark:text-white truncate text-xs group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {partner.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        Nv {partner.level.toFixed(2)} · {partner.position}
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {partner.streakTogether}
                      </span>
                    </div>
                  </div>

                  {/* Barra de compatibilidad y efectividad */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Compatibilidad táctica:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        {partner.compatibility}%
                      </strong>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${partner.compatibility}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Juntos</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      {partner.matchesTogether} ({partner.wonTogether}V-{partner.lostTogether}D)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Eficacia</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                      {partner.winRateTogether}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CARRUSEL: RIVALES HABITUALES (TOP 5) */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-amber-500" />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('crm.habitualRivals', 'Rivales habituales')}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t('crm.habitualRivalsSubtitle', 'Top 5 contrincantes directos en pistas')}
                </p>
              </div>
            </div>

            {/* Controles de navegación y pill de contador */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase hidden sm:inline">
                Top 5 Rivales
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollRivals('left')}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  title="Desplazar a la izquierda"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRivals('right')}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  title="Desplazar a la derecha"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Carrusel edge-to-edge con overflow horizontal fluido */}
          <div
            ref={rivalsScrollRef}
            className="-mx-5 px-5 overflow-x-auto no-scrollbar flex items-stretch gap-3.5 pb-2 pt-1 scroll-smooth"
          >
            {habitualRivals.map((rival, idx) => (
              <div
                key={rival.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedRivalDetail(rival)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSelectedRivalDetail(rival);
                }}
                className="min-w-[260px] max-w-[260px] p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shrink-0 space-y-3 hover:border-amber-500/60 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                title="Haz clic para ver el historial H2H completo"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={rival.avatar}
                        alt={rival.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-500/40 group-hover:ring-amber-500 transition"
                      />
                      <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-mono font-black text-[10px] flex items-center justify-center shadow-xs">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 dark:text-white truncate text-xs group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                        {rival.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        Nv {rival.level.toFixed(2)} · {rival.position}
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[9px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        {rival.rivalryType}
                      </span>
                    </div>
                  </div>

                  {/* Detalle de sets y último cruce */}
                  <div className="text-[10px] space-y-1 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Sets H2H:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">{rival.setsRatio}</strong>
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate font-semibold">
                      Último: {rival.lastMatch}
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Enfrentamientos</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      {rival.h2hMatches} partidos
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Balance H2H</span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                      {rival.balance}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 7. ÚLTIMOS PARTIDOS (TARJETAS IDÉNTICAS A /admin/partidas, CON REDIRECCIÓN AL DETALLE) */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {t('crm.recentMatches', 'Últimos partidos')}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Partidos recientes disputados con estadísticas y parejas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAllMatchesModalOpen(true)}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition flex items-center gap-1 cursor-pointer"
            >
              <span>{t('crm.viewAllCompetitions', 'Ver todas')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cuadrícula con las MISMAS TARJETAS que en /admin/partidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchHistory.map((m) => {
            const isFull = true;
            return (
              <div
                key={m.id}
                onClick={() => openMatchDetail(m)}
                className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/60 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between cursor-pointer group"
                title="Haz clic para ver el detalle completo del partido"
              >
                <div className="space-y-3">
                  {/* Fila Superior: Fecha, Pista y Badges Pro */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{m.date} · {m.time}</span>
                      </div>
                      <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {m.court}
                      </div>

                      {/* Creador / Club */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {m.isClubCreated ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <Shield className="w-3 h-3" />
                            <span>Club Oficial</span>
                          </span>
                        ) : (
                          <span className="truncate">Org: {m.creatorName || 'Socio'}</span>
                        )}
                      </div>
                    </div>

                    {/* Resultado / Estado */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          m.isWin
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {m.result} ({m.score})
                      </span>

                      {/* Género + Visibilidad */}
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {m.gender === 'female' ? 'Femenina' : m.gender === 'mixed' ? 'Mixta' : 'Masculina'}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {m.visibility === 'group' ? (m.restrictedGroupName || 'Grupo') : m.visibility === 'private' ? 'Privada' : 'Pública'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nivel ELO & Modalidad de Cobro */}
                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Nivel: <strong className="text-slate-800 dark:text-slate-200 font-mono">{m.minLevel.toFixed(2)} - {m.maxLevel.toFixed(2)}</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-slate-900 dark:text-white">
                        {m.pricePerPlayer.toFixed(2)} €
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold">
                        (1/4)
                      </span>
                    </div>
                  </div>

                  {/* 4 Jugadores con Avatares Pro pequeños y badges de posición */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      <span>Jugadores convocados (4/4)</span>
                      <span className="text-emerald-600 dark:text-emerald-400 lowercase font-normal group-hover:underline">
                        Ver detalle →
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {m.players.map((p, idx) => (
                        <div
                          key={idx}
                          className="relative group/avatar"
                          title={`${p.name} · Nivel ${p.level.toFixed(2)} (${p.position}) · ${p.paid ? 'Pagado' : 'Pendiente'}`}
                        >
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs">
                            {p.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span
                            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-black flex items-center justify-center border border-white dark:border-slate-900 ${
                              p.position === 'drive'
                                ? 'bg-amber-400 text-slate-950'
                                : p.position === 'reves'
                                ? 'bg-indigo-400 text-white'
                                : 'bg-emerald-400 text-slate-950'
                            }`}
                          >
                            {p.position === 'drive' ? 'D' : p.position === 'reves' ? 'R' : 'A'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer de Acciones Rápidas */}
                <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <CreditCard className="w-3 h-3 text-slate-400" />
                    <span>Split Payment</span>
                  </div>

                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
                    <span>Detalle de partido</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. HISTORIAL COMPETICIONES (CON IMAGEN DEL TORNEO, CATEGORÍA Y BOTÓN "VER TODAS") */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {t('crm.competitionsHistory', 'Historial Competiciones')}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Torneos federados, open y ligas disputadas por el socio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAllCompetitionsModalOpen(true)}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition flex items-center gap-1 cursor-pointer"
            >
              <span>{t('crm.viewAllCompetitions', 'Ver todas')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarjetas rediseñadas con imagen del torneo, categoría y datos oficiales */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          {tournamentHistory.slice(0, 3).map((tItem) => (
            <div
              key={tItem.id}
              role="button"
              tabIndex={0}
              onClick={() => openCompetitionDetail(tItem)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') openCompetitionDetail(tItem);
              }}
              className="overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/70 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
              title="Haz clic para ver el detalle oficial de la competición"
            >
              {/* Imagen del torneo con overlay y badge */}
              <div className="relative h-28 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img
                  src={tItem.imageUrl}
                  alt={tItem.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-black bg-white/90 dark:bg-slate-900/90 text-slate-950 dark:text-white backdrop-blur-xs">
                  {tItem.badge}
                </span>
                <span className="absolute bottom-2 left-2.5 text-[10px] font-mono font-bold text-white/90">
                  {tItem.date}
                </span>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition text-xs">
                    {tItem.name}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    {tItem.category}
                  </div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-1">
                    {tItem.position}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Pareja: <strong className="text-slate-700 dark:text-slate-300">{tItem.partner}</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline">
                    Ver ↗
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. MOVIMIENTOS Y TICKETS (Solo Admin o Propio Jugador) */}
      {!isPublicRival && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Movimientos Contables y Tickets
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {financialTransactions.length} Operaciones
            </span>
          </div>

          <div className="space-y-2">
            {financialTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{tx.concept}</div>
                  <div className="text-[10px] text-slate-500">{tx.date} · Método: {tx.method}</div>
                </div>
                <div className="text-right">
                  <span className={`font-mono font-bold text-sm ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)} €
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono">Saldo: {tx.balanceAfter.toFixed(2)}€</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ======================================================================
          10. MODAL: DETALLE COMPLETO DE PARTIDO (CON REDIRECCIÓN DIRECTA)
          ====================================================================== */}
      {selectedMatchDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Detalle del Partido
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatchDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {selectedMatchDetail.court}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    selectedMatchDetail.isWin ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {selectedMatchDetail.result} ({selectedMatchDetail.score})
                  </span>
                </div>
                <div className="text-slate-500">
                  {selectedMatchDetail.date} · {selectedMatchDetail.time}
                </div>
              </div>

              {/* Jugadores del partido */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Jugadores y Parejas
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase block">Pareja 1</span>
                    {selectedMatchDetail.team1?.map((p: any, idx: number) => (
                      <div key={idx} className="font-bold text-slate-900 dark:text-white truncate">
                        • {p.name} (Nv {p.level})
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Pareja 2</span>
                    {selectedMatchDetail.team2?.map((p: any, idx: number) => (
                      <div key={idx} className="font-bold text-slate-900 dark:text-white truncate">
                        • {p.name} (Nv {p.level})
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modalidad de pago */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500">Precio abonado por jugador:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {selectedMatchDetail.amount || `${selectedMatchDetail.pricePerPlayer?.toFixed(2)} €`}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setSelectedMatchDetail(null);
                  setAdminTab('matches');
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/admin/partidas');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition"
              >
                <span>Ir a Gestión de Partidas</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedMatchDetail(null)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          11. MODAL EXTENSO / FULLSCREEN: TODAS LAS COMPETICIONES JUGADAS
          ====================================================================== */}
      {allCompetitionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {t('crm.allCompetitionsModalTitle', 'Historial Completo de Competiciones')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {memberData.name} · {tournamentHistory.length} competiciones registradas en el club
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAllCompetitionsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filtros minimalistas y buscador */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('crm.searchCompetitions', 'Buscar torneo o liga...')}
                  value={compSearchQuery}
                  onChange={(e) => setCompSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Píldoras de categoría */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
                {[
                  { id: 'all', label: 'Todas' },
                  { id: '1', label: '1ª Cat' },
                  { id: '2', label: '2ª Cat' },
                  { id: '3', label: '3ª Cat' },
                  { id: 'fed', label: 'Federado' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCompCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      compCategoryFilter === cat.id
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Listado interactivo de competiciones */}
            <div className="space-y-2.5 pt-1">
              {filteredCompetitions.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => {
                    setAllCompetitionsModalOpen(false);
                    openCompetitionDetail(comp);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/70 hover:bg-emerald-50/20 dark:hover:bg-slate-900/60 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={comp.imageUrl}
                      alt={comp.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-800"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {comp.name}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {comp.category} · {comp.position}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Pareja: <strong>{comp.partner}</strong> · {comp.rounds}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-800">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-mono">
                      {comp.date}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 group-hover:underline">
                      <span>Ver detalle</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}

              {filteredCompetitions.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No se encontraron competiciones con el filtro seleccionado.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          12. MODAL: DETALLE DE COMPETICIÓN SELECCIONADA
          ====================================================================== */}
      {selectedCompetitionDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Detalle Oficial de Competición
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompetitionDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="relative h-32 w-full rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img
                  src={selectedCompetitionDetail.imageUrl}
                  alt={selectedCompetitionDetail.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-3 text-white font-bold text-sm">
                  {selectedCompetitionDetail.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Categoría</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedCompetitionDetail.category}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Resultado</span>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {selectedCompetitionDetail.position}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Pareja oficial:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedCompetitionDetail.partner}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Rondas / Fases:</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedCompetitionDetail.rounds}</span>
                </div>
                {selectedCompetitionDetail.prize && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-slate-800">
                    <span className="text-slate-500">Premio obtenido:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{selectedCompetitionDetail.prize}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setSelectedCompetitionDetail(null);
                  setAdminTab('tournaments');
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', `/gestion/torneos/${selectedCompetitionDetail.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition"
              >
                <span>Ir al Cuadro Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedCompetitionDetail(null)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          13. MODAL: DETALLE COMPLETO DE TODOS LOS PARTIDOS
          ====================================================================== */}
      {allMatchesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Historial Completo de Partidos — {memberData.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAllMatchesModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {matchHistory.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setAllMatchesModalOpen(false);
                    openMatchDetail(m);
                  }}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:border-emerald-500/60 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        m.isWin ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {m.result.toUpperCase()}
                      </span>
                      <span>{m.score}</span>
                      <span className="text-slate-400 font-normal">· {m.court}</span>
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      Pareja: <strong>{m.team1.map((p) => p.name).join(' & ')}</strong> vs {m.team2.map((p) => p.name).join(' & ')} · {m.date} ({m.time})
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                    {m.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          14. MODAL: EDICIÓN COMPLETA DE DATOS DE JUGADOR & PALA
          ====================================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Editar Ficha y Equipamiento
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfono *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Ficha técnica: Pala del jugador */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Marca y Modelo de Pala
                </label>
                <input
                  type="text"
                  value={editFormData.racket}
                  onChange={(e) => setEditFormData({ ...editFormData, racket: e.target.value })}
                  placeholder="Ej: Bullpadel Vertex 04 / Nox AT10 Genius"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nivel FEP (1.0 - 7.0)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="7.0"
                    value={editFormData.level}
                    onChange={(e) => setEditFormData({ ...editFormData, level: parseFloat(e.target.value) || 3.5 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Número de Socio</label>
                  <input
                    type="text"
                    value={editFormData.memberNum}
                    onChange={(e) => setEditFormData({ ...editFormData, memberNum: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Posición en Pista</label>
                  <select
                    value={editFormData.position}
                    onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Revés">Revés</option>
                    <option value="Drive">Drive</option>
                    <option value="Ambas">Ambas / Indiferente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mano Dominante</label>
                  <select
                    value={editFormData.hand}
                    onChange={(e) => setEditFormData({ ...editFormData, hand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Diestro">Diestro</option>
                    <option value="Zurdo">Zurdo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Estado de Membresía</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Activo (Al día)">Activo (Al día)</option>
                  <option value="Cuota Pendiente">Cuota Pendiente</option>
                  <option value="Inactivo / Baja Temporal">Inactivo / Baja Temporal</option>
                  <option value="Esporádico">Esporádico (Sin cuota)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Ficha</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          15. MODAL: PASARELA DE COBRO EN RECARGA DE SALDO
          ====================================================================== */}
      {checkoutModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Cobro de Recarga
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutModalData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-center space-y-1">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Importe a cobrar en caja</div>
              <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {checkoutModalData.amount.toFixed(2)} €
              </div>
              <div className="text-[10px] text-slate-500">
                Nuevo saldo de {memberData.name}: {(currentBalance + checkoutModalData.amount).toFixed(2)} €
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-xs text-slate-700 dark:text-slate-300">
                Pasarela de cobro aplicada:
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutMethod('pos_card')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                    checkoutMethod === 'pos_card'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600'
                  }`}
                >
                  Tarjeta TPV
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutMethod('cash')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                    checkoutMethod === 'cash'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600'
                  }`}
                >
                  Efectivo
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutMethod('bizum')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                    checkoutMethod === 'bizum'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600'
                  }`}
                >
                  Bizum
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCheckoutModalData(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmRecharge}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar y Cobrar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          16. MODAL: DETALLE COMPLETO DE COMPAÑERO HABITUAL
          ====================================================================== */}
      {selectedPartnerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Desglose de Pareja Oficial
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPartnerDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ficha rápida de pareja */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <img
                src={selectedPartnerDetail.avatar}
                alt={selectedPartnerDetail.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/50"
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedPartnerDetail.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Nivel {selectedPartnerDetail.level.toFixed(2)} · {selectedPartnerDetail.position}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {selectedPartnerDetail.streakTogether}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Compatibilidad: <strong className="text-emerald-600 font-mono">{selectedPartnerDetail.compatibility}%</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Métricas de rendimiento conjunto */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Partidos Juntos</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {selectedPartnerDetail.matchesTogether} partidos
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {selectedPartnerDetail.wonTogether} Victorias · {selectedPartnerDetail.lostTogether} Derrotas
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold block">% Eficacia</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                  {selectedPartnerDetail.winRateTogether}%
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                  Pareja de Alto Rendimiento
                </span>
              </div>
            </div>

            {/* Estilo y Mayor Logro */}
            <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Complementariedad Táctica</span>
                <span className="text-slate-800 dark:text-slate-200 text-[11px] font-medium">
                  {selectedPartnerDetail.playStyle}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Mayor Logro Conjunto</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                  {selectedPartnerDetail.bestTournament}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedPartnerDetail(null);
                  triggerDemoToast(
                    'Convocatoria Preparada',
                    `Se ha configurado la pareja ${memberData.name} & ${selectedPartnerDetail.name} para la próxima partida abierta.`,
                    'success'
                  );
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Convocatoria Rápida
              </button>
              <button
                type="button"
                onClick={() => setSelectedPartnerDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          17. MODAL: DETALLE COMPLETO DE RIVAL HABITUAL (HEAD TO HEAD)
          ====================================================================== */}
      {selectedRivalDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Historial Head to Head (H2H)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRivalDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ficha de rival */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <img
                src={selectedRivalDetail.avatar}
                alt={selectedRivalDetail.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/50"
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedRivalDetail.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Nivel {selectedRivalDetail.level.toFixed(2)} · {selectedRivalDetail.position}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    {selectedRivalDetail.rivalryType}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Intensidad: <strong className="text-amber-600">{selectedRivalDetail.intensity}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Métricas de cruces directos */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Balance Global</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {selectedRivalDetail.balance}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {selectedRivalDetail.h2hMatches} enfrentamientos directos
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Sets Disputados</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {selectedRivalDetail.setsRatio}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {selectedRivalDetail.winRate}% efectividad
                </span>
              </div>
            </div>

            {/* Último cruce registrado */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Último Partido Oficial</span>
              <div className="text-slate-900 dark:text-white font-bold text-[11px]">
                {selectedRivalDetail.lastMatch}
              </div>
              <p className="text-[10px] text-slate-500">
                Partido registrado en el ranking oficial del club bajo reglas de la FEP.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRivalDetail(null);
                  triggerDemoToast(
                    'Reto Generado',
                    `Se ha enviado una invitación de reto deportivo a ${selectedRivalDetail.name}.`,
                    'success'
                  );
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs cursor-pointer"
              >
                Lanzar Reto Directo
              </button>
              <button
                type="button"
                onClick={() => setSelectedRivalDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMemberProfile;
