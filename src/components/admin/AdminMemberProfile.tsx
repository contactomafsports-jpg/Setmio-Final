import React, { useState } from 'react';
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

  const [activeTab, setActiveTab] = useState<'sports' | 'matches' | 'tournaments' | 'finances'>('sports');
  const [currentBalance, setCurrentBalance] = useState(member.balance);

  // All Matches Modal State
  const [allMatchesModalOpen, setAllMatchesModalOpen] = useState(false);

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

  // Stats mock data
  const winRate = 68;
  const wonMatches = Math.round((memberData.matches * winRate) / 100);
  const lostMatches = memberData.matches - wonMatches;
  const streak = '+4 Victorias';

  // Metrics: Compañero más frecuente, Rival habitual, Ranking del Club
  const frequentPartner = {
    name: 'Mateo Varela',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    level: 5.5,
    matchesTogether: 18,
    winRateTogether: 78,
  };

  const habitualRival = {
    name: 'David Castro',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    level: 4.1,
    h2hMatches: 14,
    balance: '8V - 6D',
  };

  const clubRanking = {
    rank: 7,
    totalPlayers: 240,
    category: '1ª Categoría Club',
    points: 2450,
  };

  const levelHistory = [
    { month: 'Jun', level: 3.4, height: '45%' },
    { month: 'Jul', level: 3.55, height: '60%' },
    { month: 'Ago', level: 3.65, height: '70%' },
    { month: 'Sep', level: 3.75, height: '82%' },
    { month: 'Oct', level: memberData.level, height: '95%' },
  ];

  // Match History with 4 distinct players (Team 1 vs Team 2), photos, and score
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
      team1: [
        { name: memberData.name, avatar: memberData.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', level: memberData.level },
        { name: 'Mateo Varela', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', level: 5.5 },
      ],
      team2: [
        { name: 'Sergio Ramos', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80', level: 4.5 },
        { name: 'Marcos Blanco', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', level: 4.3 },
      ],
      type: 'Liga Social de Primavera',
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
  ];

  // Tournaments History
  const tournamentHistory = [
    {
      id: 'tourn-1',
      name: 'I Open Primavera Pádel San Mateo 2026',
      date: 'Sep 2026',
      category: '2ª Categoría Masculina',
      position: 'Subcampeón (Finalista)',
      partner: 'Mateo Varela',
      rounds: '5 Rondas superadas',
      badge: '🥈 Plata',
    },
    {
      id: 'tourn-2',
      name: 'Torneo Nocturno Estrella Galicia Pro',
      date: 'Ago 2026',
      category: '3ª Categoría Oro',
      position: 'Campeón de Cuadro Principal',
      partner: 'Lucas Piñeiro',
      rounds: 'Campeones invictos',
      badge: '🏆 Oro',
    },
    {
      id: 'tourn-3',
      name: 'Liga Autonómica Gallega FGP — Fase Interclubes',
      date: 'Jul 2026',
      category: 'Federado 1ª División Club',
      position: 'Cuartos de Final',
      partner: 'Diego Soto',
      rounds: 'Clasificados para playoff',
      badge: '⭐ Cuartos',
    },
  ];

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

  // Universal Back Handler
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
    }));

    setIsEditModalOpen(false);
    triggerDemoToast(
      'Ficha Actualizada',
      `Los datos y el equipamiento de ${editFormData.name} han sido guardados en el CRM del club.`,
      'success'
    );
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-5xl mx-auto pb-16">
      {/* 1. NAVEGACIÓN UNIVERSAL Y ACCIONES SEGÚN ROL */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleUniversalBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition shadow-xs cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('crm.goToMembers', 'Ir a Socios & CRM')}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Indicador de rol activo */}
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {isAdmin ? 'Vista Admin' : isSelf ? 'Mi Perfil' : 'Perfil Público'}
          </span>

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
              <span>Editar Ficha</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. CABECERA PRÉMIUM DE LA FICHA DE JUGADOR */}
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
                          const parsed = parseFloat(customRechargeInput);
                          if (parsed > 0) initiateRecharge(parsed);
                        }}
                        disabled={!customRechargeInput || parseFloat(customRechargeInput) <= 0}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                      >
                        Recargar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 4. GRÁFICOS E INDICADORES DE RENDIMIENTO (Requerimiento 6.2) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Win Rate */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
              Eficacia en Partidos
            </span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono text-sm">
              {winRate}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${winRate}%` }} />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{wonMatches} Victorias</span>
            <span>{lostMatches} Derrotas</span>
          </div>
        </div>

        {/* Racha y Experiencia */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
            Racha & Partidos
          </span>
          <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{memberData.matches} jugados</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Mejor racha: 6 victorias seguidas</span>
          </div>
        </div>

        {/* Evolución de Nivel */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
            Evolución de Nivel FEP
          </span>
          <div className="flex items-end justify-between gap-1.5 h-9 pt-1">
            {levelHistory.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-0.5">
                <div
                  className="w-full bg-emerald-500/80 hover:bg-emerald-500 rounded-t transition"
                  style={{ height: item.height }}
                  title={`${item.month}: Nivel ${item.level}`}
                />
                <span className="text-[9px] text-slate-400 font-mono">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. FICHA TÉCNICA DE EQUIPAMIENTO (Requerimiento 6.2) */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Ficha Técnica de Equipamiento
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">
            Perfil Deportivo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
              Pala Oficial del Jugador
            </span>
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{memberData.racket}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Forma Diamante · Potencia Pro</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
              Lado Favorito & Golpeo
            </span>
            <div className="font-bold text-slate-900 dark:text-white">
              {memberData.position} ({memberData.hand})
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Bandeja ofensiva y remate x3</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
              Grip & Complementos
            </span>
            <div className="font-bold text-slate-900 dark:text-white">
              2 Overgrips + ShockOut
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Amortiguación antivibración</span>
          </div>
        </div>
      </section>

      {/* 5.5 MÉTRICAS DEPORTIVAS CLAVE: Compañero más frecuente, Rival habitual, Ranking del Club */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Compañero más frecuente */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Compañero más frecuente
            </span>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {frequentPartner.matchesTogether} partidos
            </span>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={frequentPartner.avatar}
              alt={frequentPartner.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/40"
            />
            <div className="min-w-0">
              <div className="font-bold text-slate-900 dark:text-white truncate text-xs">
                {frequentPartner.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Nivel {frequentPartner.level.toFixed(2)} · {frequentPartner.winRateTogether}% victorias juntos
              </div>
            </div>
          </div>
        </div>

        {/* Rival habitual */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rival habitual
            </span>
            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
              {habitualRival.h2hMatches} cruces
            </span>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={habitualRival.avatar}
              alt={habitualRival.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-500/40"
            />
            <div className="min-w-0">
              <div className="font-bold text-slate-900 dark:text-white truncate text-xs">
                {habitualRival.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Nivel {habitualRival.level.toFixed(2)} · Balance: {habitualRival.balance}
              </div>
            </div>
          </div>
        </div>

        {/* Ranking del Club */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ranking del Club
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
                {clubRanking.points} Pts oficiales · de {clubRanking.totalPlayers} socios
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. CARRUSEL HORIZONTAL DE PARTIDOS DISPUTADOS (Atraviesa contenedor de lado a lado con 4 jugadores por tarjeta) */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Historial de Partidos Disputados
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setAllMatchesModalOpen(true)}
            className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Carrusel edge-to-edge atravesando el contenedor con 4 tarjetas de jugadores y marcador */}
        <div className="-mx-5 px-5 overflow-x-auto no-scrollbar flex items-stretch gap-3.5 pb-2">
          {matchHistory.map((m) => (
            <div
              key={m.id}
              className="min-w-[320px] max-w-[320px] p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3 shrink-0 shadow-xs hover:border-emerald-500/50 transition flex flex-col justify-between"
            >
              {/* Cabecera del partido: Resultado, Marcador y Pista */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      m.isWin
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {m.result}
                  </span>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                    {m.score}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between mb-2">
                  <span className="truncate">{m.court}</span>
                  <span className="font-mono text-[10px] shrink-0">{m.date}</span>
                </div>
              </div>

              {/* 4 Jugadores: Pareja 1 vs Pareja 2 con Fotos y Nivel */}
              <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                {/* Pareja 1 */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block tracking-wider">
                    Pareja 1 {m.isWin && '⭐ Ganadores'}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {m.team1.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 min-w-0"
                      >
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-6 h-6 rounded-md object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                            {p.name.split(' ')[0]}
                          </div>
                          <div className="text-[9px] text-slate-400 font-mono leading-none">
                            Nv {p.level.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Separador VS */}
                <div className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest my-0.5">
                  vs
                </div>

                {/* Pareja 2 */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                    Pareja 2 {!m.isWin && '⭐ Ganadores'}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {m.team2.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 min-w-0"
                      >
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-6 h-6 rounded-md object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                            {p.name.split(' ')[0]}
                          </div>
                          <div className="text-[9px] text-slate-400 font-mono leading-none">
                            Nv {p.level.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. SECCIÓN DE TORNEOS DISPUTADOS (Clic en torneo navega a sus detalles /gestion/torneos/[id]) */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Historial de Torneos y Competiciones
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono font-bold">
            {tournamentHistory.length} Torneos Oficiales
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {tournamentHistory.map((t) => (
            <div
              key={t.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setAdminTab('tournaments');
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', `/gestion/torneos/${t.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                triggerDemoToast(
                  'Competición Oficial',
                  `Abriendo detalles, cuadros y horarios de "${t.name}".`,
                  'info'
                );
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setAdminTab('tournaments');
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', `/gestion/torneos/${t.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
              }}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/70 hover:bg-emerald-50/20 dark:hover:bg-slate-900/80 space-y-1.5 transition cursor-pointer group"
              title="Haz clic para ver detalles del torneo, cuadros y horarios"
            >
              <div className="flex items-center justify-between">
                <span className="text-base">{t.badge}</span>
                <span className="text-[10px] font-mono text-slate-400 font-bold group-hover:text-emerald-500 transition">
                  {t.date} ↗
                </span>
              </div>
              <div className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                {t.name}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {t.position}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Pareja en torneo: <strong className="text-slate-700 dark:text-slate-300">{t.partner}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. MOVIMIENTOS Y TICKETS (Solo Admin o Propio Jugador) */}
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
          9. MODAL: DETALLE COMPLETO DE TODOS LOS PARTIDOS
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
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
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
          10. MODAL: EDICIÓN COMPLETA DE DATOS DE JUGADOR & PALA
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
          11. MODAL: PASARELA DE COBRO EN RECARGA DE SALDO
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
    </div>
  );
};

export default AdminMemberProfile;
