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
}

interface AdminMemberProfileProps {
  member: AdminMemberData;
  onBack: () => void;
}

export const AdminMemberProfile: React.FC<AdminMemberProfileProps> = ({ member, onBack }) => {
  const { currentTenant, triggerDemoToast } = useApp();
  const [activeTab, setActiveTab] = useState<'matches' | 'finances' | 'academy'>('matches');
  const [currentBalance, setCurrentBalance] = useState(member.balance);
  const [currentLevel, setCurrentLevel] = useState(member.level);

  // Stats mock data
  const winRate = 68;
  const wonMatches = Math.round((member.matches * winRate) / 100);
  const lostMatches = member.matches - wonMatches;
  const streak = '+4';

  const frequentPartners = [
    { name: 'Mateo Varela', matchesCount: 14, winRate: 72, avatar: 'MV' },
    { name: 'Lucas Piñeiro', matchesCount: 9, winRate: 66, avatar: 'LP' },
    { name: 'Diego Soto', matchesCount: 7, winRate: 71, avatar: 'DS' },
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
    {
      id: 'm-4',
      date: '24 Sep 2026',
      time: '18:30 - 20:00',
      court: 'Pista 1 (Panorámica WPT)',
      result: 'Victoria',
      score: '6-2, 6-4',
      isWin: true,
      partner: 'Diego Soto',
      opponents: 'Raúl G. / Pablo F.',
      type: 'Partida Abierta Play!',
      paid: true,
      amount: '7.00 €',
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
    {
      id: 'tx-4',
      date: '28 Sep 2026, 13:00',
      concept: 'Bote Bolas Bullpadel Next Pro',
      category: 'Tienda',
      amount: -6.5,
      balanceAfter: currentBalance - 17.5,
      method: 'Monedero Club',
    },
    {
      id: 'tx-5',
      date: '20 Sep 2026, 19:00',
      concept: 'Recarga en Mostrador Recepción',
      category: 'Recarga',
      amount: 20.0,
      balanceAfter: currentBalance - 11.0,
      method: 'Efectivo',
    },
  ]);

  const handleRecharge = (amount: number) => {
    const newBal = currentBalance + amount;
    setCurrentBalance(newBal);
    setFinancialTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        date: 'Hoy, ahora mismo',
        concept: `Recarga Manual Admin (+${amount.toFixed(2)} €)`,
        category: 'Recarga',
        amount: amount,
        balanceAfter: newBal,
        method: 'Admin Panel',
      },
      ...prev,
    ]);
    triggerDemoToast('Saldo Añadido', `Se han ingresado ${amount.toFixed(2)} € en el monedero de ${member.name}.`, 'success');
  };

  const handleWhatsApp = () => {
    const phone = member.phone.replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(`Hola ${member.name}, te escribimos desde la administración de ${currentTenant.name}.`)}`, '_blank');
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-12">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Socios / CRM</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Ficha de Jugador · Panel de Administración
          </span>
        </div>
      </div>

      {/* 1. Cabecera Principal con Avatar, Nivel Oficial, Posición Preferida y Saldo */}
      <section className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar con Nivel */}
            <div className="relative shrink-0">
              <img
                src={member.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=240&q=80'}
                alt={member.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <span className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs font-mono shadow-sm">
                Nvl {currentLevel.toFixed(2)}
              </span>
            </div>

            {/* Info y Datos Técnicos */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {member.name}
                </h1>
                {member.isMember ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Socio {member.memberNum}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Jugador Esporádico
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Cuota Activa
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {member.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {member.email}
                </span>
              </div>

              {/* Posición preferida y mano dominante */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 font-semibold text-slate-800 dark:text-slate-200">
                  Posición: <strong className="text-emerald-600 dark:text-emerald-400">{member.position || 'Revés'}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 font-semibold text-slate-800 dark:text-slate-200">
                  Mano: <strong className="text-emerald-600 dark:text-emerald-400">{member.hand || 'Diestro'}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 font-semibold text-slate-800 dark:text-slate-200">
                  Club: <strong className="text-slate-900 dark:text-white">{currentTenant.name}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Saldo en Monedero y Acciones de Recarga */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700/80 space-y-3 shrink-0 lg:w-72">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Saldo en Monedero
              </span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="text-3xl font-black font-mono text-slate-950 dark:text-white tracking-tight">
              {currentBalance.toFixed(2)} €
            </div>

            {/* Botones de recarga rápida */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleRecharge(10)}
                className="flex-1 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 transition"
              >
                +10€
              </button>
              <button
                type="button"
                onClick={() => handleRecharge(20)}
                className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-mono font-bold transition shadow-xs"
              >
                +20€
              </button>
              <button
                type="button"
                onClick={() => handleRecharge(50)}
                className="flex-1 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 transition"
              >
                +50€
              </button>
            </div>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contactar por WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Tarjetas de Estadísticas Principales */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Partidos */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Partidos Jugados</span>
            <Trophy className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {member.matches}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {wonMatches}V · {lostMatches}D en {currentTenant.name}
          </div>
        </div>

        {/* % Victorias */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>% Victorias</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {winRate}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Alto rendimiento competitivo
          </div>
        </div>

        {/* Racha Actual */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Racha Actual</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {streak} Victorias
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Invicto en los últimos 4 partidos
          </div>
        </div>

        {/* Compañeros Habituales */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-1.5">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            Compañeros Habituales
          </div>
          <div className="space-y-1 pt-0.5">
            {frequentPartners.slice(0, 2).map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{p.name}</span>
                <span className="font-mono text-[11px] text-slate-500">{p.matchesCount} part.</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Pestañas de Detalle: Partidos & Reservas / Movimientos Financieros */}
      <section className="rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
        {/* Navigation Tabs Header */}
        <div className="flex border-b border-slate-200 dark:border-slate-700/80 px-4 sm:px-6 pt-3 bg-slate-50/50 dark:bg-slate-900/50 gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('matches')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'matches'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Historial de Partidos & Reservas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finances')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'finances'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Movimientos Financieros (Monedero & TPV)</span>
          </button>
        </div>

        {/* Tab 1: Historial de Partidos */}
        {activeTab === 'matches' && (
          <div className="p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-1">
              <span>Últimos partidos y reservas disputadas en el club</span>
              <span>4 resultados recientes</span>
            </div>

            <div className="space-y-2.5">
              {matchHistory.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-xs font-black shrink-0 ${
                        m.isWin
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      {m.result}
                    </span>

                    <div className="min-w-0">
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 truncate">
                        <span>Marcador: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{m.score}</strong></span>
                        <span className="text-slate-400 font-normal">·</span>
                        <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{m.type}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Pareja: <strong className="text-slate-800 dark:text-slate-200">{m.partner}</strong> vs {m.opponents} · {m.court}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-slate-900 dark:text-white font-mono">{m.date}</div>
                      <div className="text-[10px] text-slate-500">{m.time}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                      {m.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Movimientos Financieros */}
        {activeTab === 'finances' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Extracto detallado de recargas, consumos en barra y alquiler de pistas</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                Saldo Actual: {currentBalance.toFixed(2)} €
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 text-[11px] uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Fecha y Hora</th>
                    <th className="pb-3 font-semibold">Concepto / Detalle</th>
                    <th className="pb-3 font-semibold">Categoría</th>
                    <th className="pb-3 font-semibold">Método</th>
                    <th className="pb-3 font-semibold text-right">Importe</th>
                    <th className="pb-3 font-semibold text-right">Saldo Restante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {financialTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                      <td className="py-3 font-mono text-slate-500 dark:text-slate-400">{tx.date}</td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">{tx.concept}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{tx.method}</td>
                      <td className={`py-3 text-right font-mono font-black ${
                        tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      }`}>
                        {tx.amount > 0 ? `+${tx.amount.toFixed(2)} €` : `${tx.amount.toFixed(2)} €`}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-slate-500 dark:text-slate-400">
                        {tx.balanceAfter.toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminMemberProfile;
