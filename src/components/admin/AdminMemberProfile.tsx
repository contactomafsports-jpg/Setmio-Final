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
}

interface AdminMemberProfileProps {
  member: AdminMemberData;
  onBack: () => void;
}

export const AdminMemberProfile: React.FC<AdminMemberProfileProps> = ({ member, onBack }) => {
  const { currentTenant, triggerDemoToast, setPosPendingCharge, setAdminTab } = useApp();

  const [memberData, setMemberData] = useState<AdminMemberData>({
    ...member,
    status: member.status || (member.isMember ? 'Activo (Al día)' : 'Esporádico'),
    hand: member.hand || 'Diestro',
    position: member.position || 'Revés',
  });

  const [activeTab, setActiveTab] = useState<'matches' | 'finances' | 'academy'>('matches');
  const [currentBalance, setCurrentBalance] = useState(member.balance);

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
  });

  // Wallet Recharge & Checkout Gateway State
  const [customRechargeInput, setCustomRechargeInput] = useState('');
  const [checkoutModalData, setCheckoutModalData] = useState<{ amount: number } | null>(null);
  const [checkoutMethod, setCheckoutMethod] = useState<'pos_card' | 'cash' | 'bizum'>('pos_card');

  // Stats mock data
  const winRate = 68;
  const wonMatches = Math.round((memberData.matches * winRate) / 100);
  const streak = '+4 Victorias';

  // Frequent partners
  const frequentPartners = [
    { name: 'Mateo Varela', matchesCount: 14, winRate: 72, avatar: 'MV', level: 4.0 },
    { name: 'Lucas Piñeiro', matchesCount: 9, winRate: 66, avatar: 'LP', level: 3.85 },
    { name: 'Diego Soto', matchesCount: 7, winRate: 71, avatar: 'DS', level: 3.9 },
  ];

  // Match History
  const matchHistory = [
    {
      id: 'm-1',
      date: '04 Oct 2026',
      time: '18:00 - 19:30',
      court: 'Pista 1 (Panorámica WPT)',
      result: 'Victoria',
      score: '6-4, 7-5',
      isWin: true,
      partner: 'Mateo Varela',
      opponents: 'Juan P. / Carlos S.',
      type: 'Partida Abierta Level 4.0',
      paid: true,
      amount: '7.00 €',
    },
    {
      id: 'm-2',
      date: '01 Oct 2026',
      time: '19:30 - 21:00',
      court: 'Pista 3 (Indoor Pro)',
      result: 'Victoria',
      score: '6-3, 3-6, 7-6(4)',
      isWin: true,
      partner: 'Lucas Piñeiro',
      opponents: 'David C. / Alberto M.',
      type: 'Partido Privado Socios',
      paid: true,
      amount: '7.00 €',
    },
    {
      id: 'm-3',
      date: '28 Sep 2026',
      time: '11:00 - 12:30',
      court: 'Pista 2 (Indoor Pro)',
      result: 'Derrota',
      score: '4-6, 5-7',
      isWin: false,
      partner: 'Mateo Varela',
      opponents: 'Sergio R. / Marcos B.',
      type: 'Liga Social de Primavera',
      paid: true,
      amount: '8.00 €',
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
      concept: 'Consumo Cafetería: 2x Gatorade + Barrita',
      category: 'TPV Bar',
      amount: -5.5,
      balanceAfter: currentBalance + 7.0,
      method: 'TPV Barra',
    },
    {
      id: 'tx-3',
      date: '01 Oct 2026, 10:15',
      concept: 'Recarga Monedero Online (Promoción +5%)',
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

  // Open Checkout Gateway Popover
  const initiateRecharge = (amount: number) => {
    if (amount <= 0) return;
    setCheckoutModalData({ amount });
  };

  // Confirm Payment in Gateway and Reflect in Wallet
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
    }));

    setIsEditModalOpen(false);
    triggerDemoToast(
      'Ficha Actualizada',
      `Los datos de ${editFormData.name} han sido guardados en el CRM del club.`,
      'success'
    );
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-5xl mx-auto pb-16">
      {/* 1. NAVEGACIÓN LIMPIA: Botón universal back() sin textos innecesarios */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleUniversalBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>

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
            });
            setIsEditModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Editar Datos</span>
        </button>
      </div>

      {/* 2. CONTENEDOR PRINCIPAL: Diseño prémium con alineación centrada y avatar destacado */}
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
          {/* Avatar destacado */}
          <div className="relative">
            <img
              src={memberData.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'}
              alt={memberData.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-emerald-500/30 shadow-xl"
            />
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase ring-2 ring-white dark:ring-slate-900">
              {memberData.memberNum}
            </span>
          </div>

          {/* Nombre & Badges */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {memberData.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {memberData.email} · {memberData.phone}
            </p>
          </div>

          {/* Badges de juego y estado */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              Nivel: {memberData.level.toFixed(2)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {memberData.position} · {memberData.hand}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
              {memberData.status}
            </span>
          </div>
        </div>

        {/* 3. MONEDERO CON PASARELA DE COBRO */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-xl mx-auto rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Saldo en Monedero Club:
                </span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {currentBalance.toFixed(2)} €
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <span>Disponible para pistas y bar</span>
              </div>
            </div>

            {/* Recarga rápida + importe personalizado */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Recargar Saldo (Pasa por cobro en recepción):
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[10, 20, 50].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => initiateRecharge(amt)}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500 font-mono font-bold text-xs border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-95 shadow-xs"
                  >
                    +{amt} €
                  </button>
                ))}

                <div className="flex items-center gap-1.5 flex-1 min-w-[160px]">
                  <input
                    type="number"
                    min="1"
                    placeholder="Otro importe (€)..."
                    value={customRechargeInput}
                    onChange={(e) => setCustomRechargeInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const parsed = parseFloat(customRechargeInput);
                      if (parsed > 0) initiateRecharge(parsed);
                    }}
                    disabled={!customRechargeInput || parseFloat(customRechargeInput) <= 0}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition shrink-0"
                  >
                    Recargar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TABS: PARTIDOS, FINANZAS, COMPAÑEROS */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('matches')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'matches'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Historial de Partidos ({matchHistory.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('finances')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'finances'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Movimientos y Tickets ({financialTransactions.length})
          </button>
        </div>

        {/* Tab Partidos */}
        {activeTab === 'matches' && (
          <div className="space-y-3">
            {matchHistory.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${m.isWin ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                      {m.result.toUpperCase()}
                    </span>
                    <span>{m.score}</span>
                    <span className="text-slate-400 font-normal">· {m.court}</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Pareja: <strong>{m.partner}</strong> vs {m.opponents} · {m.date} ({m.time})
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                  {m.amount}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Finanzas */}
        {activeTab === 'finances' && (
          <div className="space-y-2">
            {financialTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{tx.concept}</div>
                  <div className="text-[10px] text-slate-500">{tx.date} · Método: {tx.method}</div>
                </div>
                <div className="text-right">
                  <span className={`font-mono font-bold text-sm ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)} €
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono">Saldo tras op: {tx.balanceAfter.toFixed(2)}€</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. MODAL: EDICIÓN COMPLETA DE DATOS DE JUGADOR (Requerimiento 6.A) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Editar Ficha de Jugador
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

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
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
                    value={editFormData.level}
                    onChange={(e) => setEditFormData({ ...editFormData, level: parseFloat(e.target.value) || 3.5 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Número de Socio
                  </label>
                  <input
                    type="text"
                    value={editFormData.memberNum}
                    onChange={(e) => setEditFormData({ ...editFormData, memberNum: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Posición en Pista
                  </label>
                  <select
                    value={editFormData.position}
                    onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Revés">Revés</option>
                    <option value="Drive">Drive</option>
                    <option value="Ambas">Ambas / Indiferente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mano Dominante
                  </label>
                  <select
                    value={editFormData.hand}
                    onChange={(e) => setEditFormData({ ...editFormData, hand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Diestro">Diestro</option>
                    <option value="Zurdo">Zurdo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Estado de Membresía
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Ficha</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: PASARELA DE COBRO PREVIA A RECARGAR SALDO (Requerimiento 6.A) */}
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
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
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
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
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
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
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
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar y Añadir Saldo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMemberProfile;
