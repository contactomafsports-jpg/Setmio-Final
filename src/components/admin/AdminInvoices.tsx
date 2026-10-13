import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, VerifactuStatus } from '../../types/database';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Download,
  Send,
  Plus,
  ShieldCheck,
  QrCode,
  ExternalLink,
  ChevronRight,
  Eye,
  X,
  Printer,
  Sparkles,
  ArrowUpRight,
  Landmark,
  Wallet,
  Coins,
  Check,
  RefreshCw,
  Globe,
} from 'lucide-react';

export const AdminInvoices: React.FC = () => {
  const {
    invoices,
    syncInvoiceVerifactu,
    syncAllVerifactu,
    createInvoice,
    markInvoicePaid,
    createRectificativeInvoice,
    currentTenant,
    triggerDemoToast,
    t,
  } = useApp();

  // Filters state
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'rectified'>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [verifactuFilter, setVerifactuFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showVerifactuModal, setShowVerifactuModal] = useState<Invoice | null>(null);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showRectifyModal, setShowRectifyModal] = useState<Invoice | null>(null);
  const [rectifyReason, setRectifyReason] = useState('');

  // New Invoice Form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerNif, setNewCustomerNif] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newConcept, setNewConcept] = useState('Alquiler de Pista Pádel');
  const [newCategory, setNewCategory] = useState<Invoice['category']>('courts');
  const [newAmount, setNewAmount] = useState<number>(28.0);
  const [newTaxPercent, setNewTaxPercent] = useState<number>(21);
  const [newPaymentMethod, setNewPaymentMethod] = useState<Invoice['paymentMethod']>('online');
  const [newStatus, setNewStatus] = useState<Invoice['status']>('paid');
  const [newType, setNewType] = useState<Invoice['type']>('standard');

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'rectified' && inv.status !== 'rectified') return false;
        if (statusFilter === 'paid' && inv.status !== 'paid') return false;
        if (statusFilter === 'pending' && inv.status !== 'pending') return false;
      }
      // Channel filter
      if (channelFilter !== 'all') {
        if (channelFilter === 'online' && inv.paymentMethod !== 'online') return false;
        if (channelFilter === 'pos_terminal' && inv.paymentMethod !== 'pos_terminal') return false;
        if (channelFilter === 'cash' && inv.paymentMethod !== 'cash') return false;
        if (channelFilter === 'wallet' && inv.paymentMethod !== 'wallet') return false;
        if (channelFilter === 'bank_transfer' && inv.paymentMethod !== 'bank_transfer' && inv.paymentMethod !== 'sepa') return false;
      }
      // Verifactu filter
      if (verifactuFilter !== 'all' && inv.verifactu_status !== verifactuFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesNumber = inv.number.toLowerCase().includes(query);
        const matchesCustomer = inv.customerName.toLowerCase().includes(query);
        const matchesNif = inv.customerNif?.toLowerCase().includes(query);
        const matchesConcept = inv.concept.toLowerCase().includes(query);
        if (!matchesNumber && !matchesCustomer && !matchesNif && !matchesConcept) {
          return false;
        }
      }
      return true;
    });
  }, [invoices, statusFilter, channelFilter, verifactuFilter, searchQuery]);

  // Financial KPI calculations
  const totalInvoiced = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + (inv.status !== 'canceled' ? inv.total : 0), 0);
  }, [invoices]);

  const totalPaid = useMemo(() => {
    return invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);
  }, [invoices]);

  const totalPending = useMemo(() => {
    return invoices
      .filter((inv) => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.total, 0);
  }, [invoices]);

  const pendingVerifactuCount = useMemo(() => {
    return invoices.filter((inv) => inv.verifactu_status === 'pending').length;
  }, [invoices]);

  // Payment channel breakdown
  const channelBreakdown = useMemo(() => {
    const paidInvoices = invoices.filter((i) => i.status === 'paid');
    const online = paidInvoices
      .filter((i) => i.paymentMethod === 'online')
      .reduce((sum, i) => sum + i.total, 0);
    const pos = paidInvoices
      .filter((i) => i.paymentMethod === 'pos_terminal')
      .reduce((sum, i) => sum + i.total, 0);
    const cash = paidInvoices
      .filter((i) => i.paymentMethod === 'cash')
      .reduce((sum, i) => sum + i.total, 0);
    const other = paidInvoices
      .filter((i) => i.paymentMethod !== 'online' && i.paymentMethod !== 'pos_terminal' && i.paymentMethod !== 'cash')
      .reduce((sum, i) => sum + i.total, 0);

    const total = online + pos + cash + other || 1;
    return {
      online,
      onlinePercent: Math.round((online / total) * 100),
      pos,
      posPercent: Math.round((pos / total) * 100),
      cash,
      cashPercent: Math.round((cash / total) * 100),
      other,
      otherPercent: Math.round((other / total) * 100),
    };
  }, [invoices]);

  // Handler for creating invoice
  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;

    createInvoice({
      customerName: newCustomerName,
      customerNif: newCustomerNif || 'B44556677',
      customerEmail: newCustomerEmail || `${newCustomerName.toLowerCase().replace(/\s+/g, '.')}@email.es`,
      concept: newConcept,
      category: newCategory,
      type: newType,
      total: Number(newAmount),
      paymentMethod: newPaymentMethod,
      status: newStatus,
    });

    setShowNewInvoiceModal(false);
    setNewCustomerName('');
    setNewCustomerNif('');
    setNewCustomerEmail('');
    setNewAmount(28.0);
  };

  // Handler for rectifying invoice
  const handleRectifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    createRectificativeInvoice(selectedInvoice.id, rectifyReason || 'Anulación por rectificación contable');
    setShowRectifyModal(null);
    setSelectedInvoice(null);
    setRectifyReason('');
  };

  const handleDownloadPdf = (inv: Invoice) => {
    triggerDemoToast(
      'Descargando Factura PDF',
      `Factura ${inv.number} generada en formato PDF con firma digital y código QR Veri*factu AEAT.`,
      'success'
    );
  };

  const handleResendEmail = (inv: Invoice) => {
    triggerDemoToast(
      'Factura Reenviada por Email',
      `Enviada copia oficial de la factura ${inv.number} a ${inv.customerEmail || inv.customerName}.`,
      'info'
    );
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-150">
      {/* 1. TOP HEADER & VERI*FACTU BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Pagos y Facturación
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Veri*factu Preparado</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gestión contable unificada de {currentTenant.name} · Facturación electrónica, canales de cobro y cumplimiento AEAT (RD 1007/2023).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pendingVerifactuCount > 0 ? (
            <button
              onClick={syncAllVerifactu}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Sincronizar facturas pendientes con la Agencia Tributaria"
            >
              <RefreshCw className="w-4 h-4 animate-spin-reverse" />
              <span>Sincronizar Lote Veri*factu ({pendingVerifactuCount})</span>
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>AEAT al día (0 pendientes)</span>
            </div>
          )}

          <button
            onClick={() => setShowNewInvoiceModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Factura</span>
          </button>
        </div>
      </div>

      {/* 2. DASHBOARD FINANCIERO (KPIs & Canales de Cobro) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI: Total Facturado */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold">Total Facturado</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalInvoiced.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{invoices.length} facturas emitidas este periodo</span>
          </div>
        </div>

        {/* KPI: Cobrado / Ingresado */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold">Cobros Realizados</span>
            <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalPaid.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Tasa de efectividad: <strong className="text-slate-700 dark:text-slate-200">{Math.round((totalPaid / (totalInvoiced || 1)) * 100)}%</strong>
          </div>
        </div>

        {/* KPI: Pendiente de Cobro */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold">Pendiente de Cobro</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {totalPending.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Transferencias o pagos en mostrador
          </div>
        </div>

        {/* KPI: Estado Veri*factu */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold">Cumplimiento AEAT</span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {invoices.length - pendingVerifactuCount} / {invoices.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Facturas sincronizadas con huella SHA-256
          </div>
        </div>
      </div>

      {/* 2.B DESGLOSE POR CANAL DE PAGO (Online vs TPV/Mostrador) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Desglose por Canal de Cobro</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribución de ingresos según pasarela web online vs terminal TPV de mostrador y efectivo.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Auto-sincronización Veri*factu:</span>
            <button
              onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                autoSyncEnabled
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {autoSyncEnabled ? 'Activado (Automático)' : 'Por Lotes (Manual)'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          {/* Canal Online */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Globe className="w-3.5 h-3.5 text-cyan-500" />
                <span>Pasarela Online (Stripe)</span>
              </div>
              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{channelBreakdown.onlinePercent}%</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
              {channelBreakdown.online.toFixed(2)} €
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${channelBreakdown.onlinePercent}%` }} />
            </div>
            <div className="text-[10px] text-slate-500">Reservas web y partidos abiertos</div>
          </div>

          {/* Canal TPV / Datáfono */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                <span>TPV / Datáfono</span>
              </div>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{channelBreakdown.posPercent}%</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
              {channelBreakdown.pos.toFixed(2)} €
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${channelBreakdown.posPercent}%` }} />
            </div>
            <div className="text-[10px] text-slate-500">Cobros en mostrador y Pro Shop</div>
          </div>

          {/* Canal Efectivo */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>Efectivo / Caja</span>
              </div>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{channelBreakdown.cashPercent}%</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
              {channelBreakdown.cash.toFixed(2)} €
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${channelBreakdown.cashPercent}%` }} />
            </div>
            <div className="text-[10px] text-slate-500">Cafetería y consumos directos</div>
          </div>

          {/* Canal Monedero / Transferencia */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Landmark className="w-3.5 h-3.5 text-purple-500" />
                <span>Monedero / Banco</span>
              </div>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{channelBreakdown.otherPercent}%</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
              {channelBreakdown.other.toFixed(2)} €
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${channelBreakdown.otherPercent}%` }} />
            </div>
            <div className="text-[10px] text-slate-500">Cuotas de socio y domiciliaciones</div>
          </div>
        </div>
      </div>

      {/* 3. LISTADO DE FACTURAS Y COBROS (Filtros, Tabla, Acciones y Veri*factu) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {/* Barra de Filtros y Buscador */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Sub-tabs de Estado */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'Todas las Facturas', count: invoices.length },
              { id: 'paid', label: 'Cobradas', count: invoices.filter((i) => i.status === 'paid').length },
              { id: 'pending', label: 'Pendientes', count: invoices.filter((i) => i.status === 'pending').length },
              { id: 'rectified', label: 'Rectificativas', count: invoices.filter((i) => i.status === 'rectified').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/20">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Filtros secundarios & Buscador */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Canal filter */}
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="all">Canal: Todos</option>
              <option value="online">Online (Stripe)</option>
              <option value="pos_terminal">TPV Datáfono</option>
              <option value="cash">Efectivo</option>
              <option value="wallet">Monedero</option>
              <option value="bank_transfer">Transferencia / SEPA</option>
            </select>

            {/* Verifactu filter */}
            <select
              value={verifactuFilter}
              onChange={(e) => setVerifactuFilter(e.target.value)}
              className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="all">Veri*factu: Todos</option>
              <option value="synced">Sincronizado AEAT</option>
              <option value="pending">Pendiente de Envío</option>
            </select>

            {/* Buscador */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por Nº, cliente o NIF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Tabla Responsive de Facturas */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                <th className="py-3 px-4">Nº Factura</th>
                <th className="py-3 px-3">Fecha</th>
                <th className="py-3 px-4">Cliente / NIF</th>
                <th className="py-3 px-4">Concepto Principal</th>
                <th className="py-3 px-3">Canal de Cobro</th>
                <th className="py-3 px-3 text-right">Importe Total</th>
                <th className="py-3 px-3 text-center">Estado Cobro</th>
                <th className="py-3 px-3 text-center">Estado Veri*factu</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No se han encontrado facturas que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isPaid = inv.status === 'paid';
                  const isPending = inv.status === 'pending';
                  const isRectified = inv.status === 'rectified';
                  const isSynced = inv.verifactu_status === 'synced';

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Nº Factura */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Receipt className="w-3.5 h-3.5 text-slate-400" />
                          <span>{inv.number}</span>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {inv.issueDate}
                      </td>

                      {/* Cliente */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white max-w-[150px] truncate">
                          {inv.customerName}
                        </div>
                        {inv.customerNif && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            NIF: {inv.customerNif}
                          </div>
                        )}
                      </td>

                      {/* Concepto */}
                      <td className="py-3 px-4 max-w-[200px]">
                        <div className="truncate text-slate-700 dark:text-slate-300" title={inv.concept}>
                          {inv.concept}
                        </div>
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {inv.category === 'courts'
                            ? 'Pistas'
                            : inv.category === 'academy'
                            ? 'Escuela'
                            : inv.category === 'tournaments'
                            ? 'Torneo'
                            : inv.category === 'shop'
                            ? 'Tienda'
                            : inv.category === 'pos'
                            ? 'Cafetería'
                            : 'General'}
                        </span>
                      </td>

                      {/* Canal de Cobro */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {inv.paymentMethod === 'online' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-700 dark:text-cyan-300">
                              <Globe className="w-3 h-3 text-cyan-500" />
                              <span>Online (Stripe)</span>
                            </span>
                          ) : inv.paymentMethod === 'pos_terminal' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                              <CreditCard className="w-3 h-3 text-emerald-500" />
                              <span>TPV Mostrador</span>
                            </span>
                          ) : inv.paymentMethod === 'cash' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                              <Coins className="w-3 h-3 text-amber-500" />
                              <span>Efectivo</span>
                            </span>
                          ) : inv.paymentMethod === 'wallet' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                              <Wallet className="w-3 h-3 text-purple-500" />
                              <span>Monedero</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                              <Landmark className="w-3 h-3 text-indigo-500" />
                              <span>Transferencia</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Importe Total */}
                      <td className="py-3 px-3 text-right font-mono font-bold whitespace-nowrap">
                        <span className={inv.total < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}>
                          {inv.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </span>
                        <div className="text-[10px] text-slate-400 font-normal">
                          IVA inc.
                        </div>
                      </td>

                      {/* Estado Cobro */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {isPaid && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <Check className="w-3 h-3" />
                            <span>Cobrada</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3 h-3" />
                            <span>Pendiente</span>
                          </span>
                        )}
                        {isRectified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            <RotateCcw className="w-3 h-3" />
                            <span>Rectificativa</span>
                          </span>
                        )}
                      </td>

                      {/* Estado Veri*factu (Preparación Tributaria) */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {isSynced ? (
                          <button
                            onClick={() => setShowVerifactuModal(inv)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:scale-105 transition cursor-pointer"
                            title="Ver detalles de verificación tributaria Veri*factu"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>Sincronizado</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => syncInvoiceVerifactu(inv.id)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-700 transition cursor-pointer"
                            title="Sincronizar ahora con la AEAT"
                          >
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            <span>Pendiente (Sincronizar)</span>
                          </button>
                        )}
                      </td>

                      {/* Acciones Rápidas */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Ver detalle de factura"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDownloadPdf(inv)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition cursor-pointer"
                            title="Descargar PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleResendEmail(inv)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 transition cursor-pointer"
                            title="Reenviar por Email"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          {isPending && (
                            <button
                              onClick={() => markInvoicePaid(inv.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition cursor-pointer"
                              title="Marcar como pagada"
                            >
                              Cobrar
                            </button>
                          )}

                          {isPaid && inv.type !== 'rectificative' && (
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setShowRectifyModal(inv);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                              title="Emitir Factura Rectificativa (Abono)"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL: DETALLE COMPLETO DE FACTURA (VISTA PREVIA IMPRESIÓN)
          ========================================================================= */}
      {selectedInvoice && !showRectifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Factura {selectedInvoice.number}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedInvoice.status === 'paid'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : selectedInvoice.status === 'pending'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                }`}>
                  {selectedInvoice.status.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Emisor y Receptor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Emisor</span>
                <div className="font-black text-slate-900 dark:text-white text-sm">{currentTenant.name}</div>
                <div className="text-slate-600 dark:text-slate-400">NIF: B15998877</div>
                <div className="text-slate-600 dark:text-slate-400">{currentTenant.address}</div>
                <div className="text-slate-600 dark:text-slate-400">{currentTenant.contactEmail}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cliente / Receptor</span>
                <div className="font-black text-slate-900 dark:text-white text-sm">{selectedInvoice.customerName}</div>
                <div className="text-slate-600 dark:text-slate-400">NIF/CIF: {selectedInvoice.customerNif || 'No especificado'}</div>
                <div className="text-slate-600 dark:text-slate-400">{selectedInvoice.customerAddress || 'Cliente particular'}</div>
                <div className="text-slate-600 dark:text-slate-400">{selectedInvoice.customerEmail || 'Sin email registrado'}</div>
              </div>
            </div>

            {/* Desglose de Líneas de Factura */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white">Líneas y Conceptos</div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Descripción</th>
                      <th className="py-2.5 px-2 text-center">Cant.</th>
                      <th className="py-2.5 px-3 text-right">Precio Ud.</th>
                      <th className="py-2.5 px-2 text-center">IVA %</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedInvoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-medium">{item.description}</td>
                        <td className="py-2.5 px-2 text-center text-slate-500">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">{item.unitPrice.toFixed(2)} €</td>
                        <td className="py-2.5 px-2 text-center font-mono text-slate-500">{item.taxPercent}%</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">{item.total.toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totales e Impuestos */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div>Método de pago: <strong className="text-slate-900 dark:text-white uppercase">{selectedInvoice.paymentMethod}</strong></div>
                <div>Fecha de expedición: <strong className="text-slate-900 dark:text-white">{selectedInvoice.issueDate}</strong></div>
                {selectedInvoice.notes && <div className="text-slate-500 italic">{selectedInvoice.notes}</div>}
              </div>

              <div className="text-right space-y-1 font-mono">
                <div className="text-slate-500">Base Imponible: <strong>{selectedInvoice.subtotal.toFixed(2)} €</strong></div>
                <div className="text-slate-500">Cuota IVA: <strong>{selectedInvoice.taxAmount.toFixed(2)} €</strong></div>
                <div className="text-lg font-black text-slate-900 dark:text-white border-t border-slate-300 dark:border-slate-700 pt-1">
                  Total Factura: {selectedInvoice.total.toFixed(2)} €
                </div>
              </div>
            </div>

            {/* Bloque Veri*factu del Documento */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-emerald-950 dark:text-emerald-300">
                    {selectedInvoice.verifactu_status === 'synced'
                      ? 'Factura Homologada Veri*factu (AEAT Sincronizada)'
                      : 'Factura en cola Veri*factu (Pendiente de Transmisión)'}
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono truncate max-w-sm">
                    {selectedInvoice.verifactu_hash ? `Hash: ${selectedInvoice.verifactu_hash.slice(0, 32)}...` : 'Registro contable inalterable según Ley 11/2021'}
                  </div>
                </div>
              </div>

              {selectedInvoice.verifactu_status === 'pending' ? (
                <button
                  onClick={() => {
                    syncInvoiceVerifactu(selectedInvoice.id);
                    setSelectedInvoice({ ...selectedInvoice, verifactu_status: 'synced' });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Sincronizar AEAT
                </button>
              ) : (
                <button
                  onClick={() => setShowVerifactuModal(selectedInvoice)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition cursor-pointer"
                >
                  Ver QR Tributario
                </button>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleDownloadPdf(selectedInvoice)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF</span>
              </button>

              <button
                onClick={() => handleResendEmail(selectedInvoice)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Reenviar Email</span>
              </button>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CÓDIGO QR Y HUELLA CRIPTOGRÁFICA VERI*FACTU (AEAT)
          ========================================================================= */}
      {showVerifactuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
            <button
              onClick={() => setShowVerifactuModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Verificación Tributaria Veri*factu
              </h3>
              <p className="text-xs text-slate-500">
                Factura {showVerifactuModal.number} · Homologación RD 1007/2023
              </p>
            </div>

            {/* Código QR Simulado de la AEAT */}
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 inline-block shadow-inner mx-auto">
              <div className="w-44 h-44 bg-slate-900 p-2 rounded-xl flex flex-col items-center justify-center text-white space-y-2">
                <QrCode className="w-24 h-24 text-white" />
                <span className="text-[9px] font-mono font-bold tracking-wider text-emerald-400">
                  AEAT VERI*FACTU QR
                </span>
                <span className="text-[8px] text-slate-400 font-mono">
                  B15998877 · {showVerifactuModal.total.toFixed(2)}€
                </span>
              </div>
            </div>

            {/* Metadatos Criptográficos */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-left text-xs font-mono space-y-1.5 border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Huella Hash SHA-256 (Encadenamiento):</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 break-all">
                {showVerifactuModal.verifactu_hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              </div>
              <div className="text-[10px] text-slate-500 pt-1">
                Sincronizado: <strong>{showVerifactuModal.verifactu_synced_at ? new Date(showVerifactuModal.verifactu_synced_at).toLocaleString() : 'Reciente'}</strong>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Cualquier cliente o inspector puede escanear este código QR con la cámara de su móvil para comprobar en la sede electrónica de la Agencia Tributaria que la factura fue emitida y remitida sin alteraciones.
            </p>

            <button
              onClick={() => setShowVerifactuModal(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EMISIÓN DE FACTURA RECTIFICATIVA
          ========================================================================= */}
      {showRectifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
                <RotateCcw className="w-5 h-5" />
                <span>Emitir Factura Rectificativa</span>
              </div>
              <button
                onClick={() => setShowRectifyModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-300 leading-relaxed">
              Estás a punto de emitir una factura de abono rectificativa para anular o corregir la factura <strong>{showRectifyModal.number}</strong> (Importe: {showRectifyModal.total.toFixed(2)} €). Se emitirá una nueva serie con signo negativo y reporte Veri*factu.
            </div>

            <form onSubmit={handleRectifySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Motivo de la Rectificación (Exigido por normativa)
                </label>
                <textarea
                  required
                  rows={3}
                  value={rectifyReason}
                  onChange={(e) => setRectifyReason(e.target.value)}
                  placeholder="Ej: Anulación de reserva por inclemencias meteorológicas / Error en tarifa aplicada"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRectifyModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md transition"
                >
                  Emitir Factura Rectificativa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EMISIÓN RÁPIDA DE NUEVA FACTURA
          ========================================================================= */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Emitir Nueva Factura
                </h3>
              </div>
              <button
                onClick={() => setShowNewInvoiceModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre o Razón Social Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="Ej. Carlos Méndez"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIF / CIF Receptor
                  </label>
                  <input
                    type="text"
                    value={newCustomerNif}
                    onChange={(e) => setNewCustomerNif(e.target.value)}
                    placeholder="Ej. 32849102K"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Concepto Principal *
                  </label>
                  <input
                    type="text"
                    required
                    value={newConcept}
                    onChange={(e) => setNewConcept(e.target.value)}
                    placeholder="Ej. Alquiler Pista 1 Central"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Invoice['category'])}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="courts">Alquiler de Pistas</option>
                    <option value="academy">Escuela & Clases</option>
                    <option value="tournaments">Competición / Torneo</option>
                    <option value="shop">Tienda Deportiva</option>
                    <option value="pos">Cafetería & Bar</option>
                    <option value="membership">Cuota de Socio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Importe Total (€ con IVA) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Canal de Cobro
                  </label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as Invoice['paymentMethod'])}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="online">Online (Pasarela Stripe)</option>
                    <option value="pos_terminal">TPV Datáfono</option>
                    <option value="cash">Efectivo Mostrador</option>
                    <option value="wallet">Saldo Monedero</option>
                    <option value="bank_transfer">Transferencia Bancaria</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Estado
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Invoice['status'])}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="paid">Cobrada / Pagada</option>
                    <option value="pending">Pendiente de Cobro</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Al emitir esta factura se generará automáticamente el registro contable inalterable con numeración correlativa y preparación Veri*factu.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md transition"
                >
                  Emitir y Registrar Factura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
