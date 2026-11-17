import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types/database';
import {
  CreditCard,
  Receipt,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Download,
  Send,
  Plus,
  ShieldCheck,
  QrCode,
  Eye,
  X,
  Landmark,
  Wallet,
  Coins,
  Check,
  RefreshCw,
  Globe,
} from 'lucide-react';
import { AdminSectionHeader } from './AdminSectionHeader';

export const AdminInvoices: React.FC = () => {
  const {
    invoices,
    syncInvoiceVerifactu,
    syncAllVerifactu,
    createInvoice,
    markInvoicePaid,
    createRectificativeInvoice,
    currentTenant,
    selectedVenue,
    triggerDemoToast,
  } = useApp();

  // Validación geográfica y fiscal: Veri*factu / AEAT aplica exclusivamente a sedes/clubes en España
  const isSpainClub = useMemo(() => {
    const countryRaw = (currentTenant?.country || '').trim().toLowerCase();
    if (countryRaw) {
      return countryRaw === 'españa' || countryRaw === 'spain' || countryRaw === 'es';
    }
    const venueCityRaw = (selectedVenue?.city || '').trim().toLowerCase();
    return ['narón', 'coruña', 'santiago', 'vigo', 'madrid', 'barcelona', 'españa'].some((k) =>
      venueCityRaw.includes(k)
    );
  }, [currentTenant?.country, selectedVenue?.city]);

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
  const [syncConfirmTarget, setSyncConfirmTarget] = useState<'all' | Invoice | null>(null);

  // New Invoice Form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerNif, setNewCustomerNif] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newConcept, setNewConcept] = useState('Alquiler de Pista Pádel');
  const [newCategory, setNewCategory] = useState<Invoice['category']>('courts');
  const [newAmount, setNewAmount] = useState<number>(28.0);
  const [newPaymentMethod, setNewPaymentMethod] = useState<Invoice['paymentMethod']>('online');
  const [newStatus, setNewStatus] = useState<Invoice['status']>('paid');
  const [newType] = useState<Invoice['type']>('standard');

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
      // Verifactu filter (solo España)
      if (isSpainClub && verifactuFilter !== 'all' && inv.verifactu_status !== verifactuFilter) {
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
  }, [invoices, statusFilter, channelFilter, verifactuFilter, searchQuery, isSpainClub]);

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
      isSpainClub
        ? `Factura ${inv.number} generada en formato PDF con firma digital y código QR Veri*factu AEAT.`
        : `Factura ${inv.number} generada en formato PDF con firma digital.`,
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

  const handleConfirmFiscalSync = () => {
    if (!syncConfirmTarget) return;
    if (syncConfirmTarget === 'all') {
      syncAllVerifactu();
    } else {
      syncInvoiceVerifactu(syncConfirmTarget.id);
      if (selectedInvoice && selectedInvoice.id === syncConfirmTarget.id) {
        setSelectedInvoice({ ...selectedInvoice, verifactu_status: 'synced' });
      }
    }
    setSyncConfirmTarget(null);
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 sm:pb-16 space-y-5 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased animate-in fade-in duration-150">
      {/* ======================================================================
          1. CABECERA LIMPIA Y SIMÉTRICA CON SELECTOR DE SEDE UNIFICADO
          ====================================================================== */}
      <AdminSectionHeader
        title="Facturación"
        rightSlot={
          <button
            type="button"
            onClick={() => setShowNewInvoiceModal(true)}
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition-colors cursor-pointer active:scale-95 shrink-0"
            title="Emitir Factura"
            aria-label="Emitir Factura"
          >
            <Plus className="w-6 h-6 stroke-[2.2]" />
          </button>
        }
      />

      {/* Estado y sincronización fiscal Veri*factu / AEAT (solo clubes en España) */}
      {isSpainClub && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:px-5 sm:py-3.5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-[#F0FCCF] text-[#0B1A2D] dark:bg-[#B7F229]/20 dark:text-[#B7F229] border border-[#B7F229]/50 inline-flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[#82b805] dark:text-[#B7F229]" />
                <span>Veri*factu · AEAT</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {pendingVerifactuCount > 0
                  ? `${pendingVerifactuCount} ${pendingVerifactuCount === 1 ? 'registro pendiente' : 'registros pendientes'} de envío`
                  : 'Todos los registros verificados con huella SHA-256'}
              </span>
            </div>

            {pendingVerifactuCount > 0 ? (
              <button
                type="button"
                onClick={() => setSyncConfirmTarget('all')}
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] font-bold text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
                title="Sincronizar facturas pendientes con la Agencia Tributaria"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#B7F229] dark:text-[#0B1A2D] shrink-0" />
                <span>Sincronizar ({pendingVerifactuCount})</span>
              </button>
            ) : (
              <div className="px-3 py-1 rounded-xl bg-[#F0FCCF] dark:bg-[#B7F229]/15 border border-[#B7F229]/45 text-[#0B1A2D] dark:text-[#B7F229] text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#82b805] dark:text-[#B7F229] shrink-0" />
                <span>AEAT al día</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ======================================================================
          2. KPIS FINANCIEROS COMPACTOS (SINGLE-ELEVATION)
          ====================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            Total Facturado
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums tracking-tight truncate">
            {totalInvoiced.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
            {invoices.length} facturas emitidas
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            Cobros Realizados
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0B1A2D] dark:text-[#B7F229] font-mono tabular-nums tracking-tight truncate">
            {totalPaid.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
            Efectividad:{' '}
            <strong className="text-[#0B1A2D] dark:text-white font-mono tabular-nums">
              {Math.round((totalPaid / (totalInvoiced || 1)) * 100)}%
            </strong>
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            Pendiente de Cobro
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums tracking-tight truncate">
            {totalPending.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
            Transferencias / mostrador
          </span>
        </div>

        {isSpainClub ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between gap-1.5 min-w-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              Cumplimiento AEAT
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums tracking-tight">
              {invoices.length - pendingVerifactuCount} / {invoices.length}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-[#82b805] dark:text-[#B7F229] shrink-0" />
              <span>Huella SHA-256</span>
            </span>
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between gap-1.5 min-w-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              Ticket Medio
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums tracking-tight truncate">
              {(totalInvoiced / (invoices.length || 1)).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              Media por factura emitida
            </span>
          </div>
        )}
      </div>

      {/* ======================================================================
          3. DESGLOSE POR CANAL DE COBRO (COMPACTO Y SIN CAJAS ANIDADAS)
          ====================================================================== */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-[#1A314D]">
          <div className="flex items-center gap-2 min-w-0">
            <CreditCard className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
            <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white truncate">
              Desglose por Canal de Cobro
            </h2>
          </div>

          {isSpainClub && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Auto-envío Veri*factu:</span>
              <button
                type="button"
                onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer border ${
                  autoSyncEnabled
                    ? 'bg-[#F0FCCF] text-[#0B1A2D] border-[#B7F229]/50 dark:bg-[#B7F229]/15 dark:text-[#B7F229] dark:border-[#B7F229]/40'
                    : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-[#071220] dark:text-slate-400 dark:border-[#1A314D]'
                }`}
              >
                {autoSyncEnabled ? 'Auto-envío activo' : 'Por lotes'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4 text-xs">
          {/* Canal Online */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-300 truncate flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Online (Stripe)</span>
              </span>
              <span className="font-mono tabular-nums font-bold text-slate-500 dark:text-slate-400 shrink-0">
                {channelBreakdown.onlinePercent}%
              </span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums">
              {channelBreakdown.online.toFixed(2)} €
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#071220] h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#0B1A2D] dark:bg-[#B7F229] h-full rounded-full transition-all duration-300"
                style={{ width: `${channelBreakdown.onlinePercent}%` }}
              />
            </div>
          </div>

          {/* Canal TPV / Datáfono */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-300 truncate flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">TPV / Datáfono</span>
              </span>
              <span className="font-mono tabular-nums font-bold text-slate-500 dark:text-slate-400 shrink-0">
                {channelBreakdown.posPercent}%
              </span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums">
              {channelBreakdown.pos.toFixed(2)} €
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#071220] h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#82b805] dark:bg-[#B7F229]/80 h-full rounded-full transition-all duration-300"
                style={{ width: `${channelBreakdown.posPercent}%` }}
              />
            </div>
          </div>

          {/* Canal Efectivo */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-300 truncate flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Efectivo / Caja</span>
              </span>
              <span className="font-mono tabular-nums font-bold text-slate-500 dark:text-slate-400 shrink-0">
                {channelBreakdown.cashPercent}%
              </span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums">
              {channelBreakdown.cash.toFixed(2)} €
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#071220] h-1 rounded-full overflow-hidden">
              <div
                className="bg-slate-500 dark:bg-slate-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${channelBreakdown.cashPercent}%` }}
              />
            </div>
          </div>

          {/* Canal Monedero / Banco */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-300 truncate flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Monedero / Banco</span>
              </span>
              <span className="font-mono tabular-nums font-bold text-slate-500 dark:text-slate-400 shrink-0">
                {channelBreakdown.otherPercent}%
              </span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums">
              {channelBreakdown.other.toFixed(2)} €
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#071220] h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#8B5CF6] h-full rounded-full transition-all duration-300"
                style={{ width: `${channelBreakdown.otherPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================
          4. BUSCADOR Y FILTROS COMPACTOS (STICKY HEADER)
          ====================================================================== */}
      <div className="sticky top-[52px] sm:top-[56px] z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 bg-slate-50/90 dark:bg-[#0B1A2D]/90 backdrop-blur-md border-b border-slate-200/70 dark:border-white/10 transition-colors">
        <div className="space-y-2.5">
          {/* Fila 1: Buscador + Selectores compactos de Canal y Veri*factu */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por Nº, cliente o NIF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[40px] pl-10 pr-8 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs sm:text-sm text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] transition shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>

            <div className={`${isSpainClub ? 'grid grid-cols-2' : 'flex'} sm:flex sm:items-center gap-2 shrink-0`}>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                aria-label="Filtrar por canal de cobro"
                className="w-full sm:w-auto min-h-[40px] text-xs bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 font-bold text-[#0B1A2D] dark:text-slate-200 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] shadow-2xs"
              >
                <option value="all">Canal: Todos</option>
                <option value="online">Online (Stripe)</option>
                <option value="pos_terminal">TPV Datáfono</option>
                <option value="cash">Efectivo</option>
                <option value="wallet">Monedero</option>
                <option value="bank_transfer">Transferencia</option>
              </select>

              {isSpainClub && (
                <select
                  value={verifactuFilter}
                  onChange={(e) => setVerifactuFilter(e.target.value)}
                  aria-label="Filtrar por estado Veri*factu"
                  className="w-full sm:w-auto min-h-[40px] text-xs bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 font-bold text-[#0B1A2D] dark:text-slate-200 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] shadow-2xs"
                >
                  <option value="all">Veri*factu: Todos</option>
                  <option value="synced">Sincronizado AEAT</option>
                  <option value="pending">Pendiente envío</option>
                </select>
              )}
            </div>
          </div>

          {/* Fila 2: Sub-tabs compactos de Estado */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x">
            {[
              { id: 'all', label: 'Todas', count: invoices.length },
              { id: 'paid', label: 'Cobradas', count: invoices.filter((i) => i.status === 'paid').length },
              { id: 'pending', label: 'Pendientes', count: invoices.filter((i) => i.status === 'pending').length },
              { id: 'rectified', label: 'Rectificativas', count: invoices.filter((i) => i.status === 'rectified').length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  statusFilter === tab.id
                    ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-2xs'
                    : 'bg-white/80 dark:bg-[#0E2239]/80 border border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`font-mono tabular-nums text-[10px] ${
                    statusFilter === tab.id ? 'opacity-80' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================================
          5. TABLA DE FACTURAS LIMPIA Y DESPLAZABLE HORIZONTALMENTE
          ====================================================================== */}
      <div className="bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-2xl overflow-hidden shadow-2xs mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-[#071220] border-b border-slate-200/80 dark:border-[#1A314D] text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                <th className="py-3.5 px-4 whitespace-nowrap">Nº Factura</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Fecha</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Cliente / NIF</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Concepto</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Canal</th>
                <th className="py-3.5 px-3 text-right whitespace-nowrap">Importe</th>
                <th className="py-3.5 px-3 text-center whitespace-nowrap">Estado</th>
                {isSpainClub && (
                  <th className="py-3.5 px-3 text-center whitespace-nowrap">Veri*factu</th>
                )}
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1A314D] font-medium">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={isSpainClub ? 9 : 8} className="py-10 text-center text-slate-400 text-xs">
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
                      className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Nº Factura */}
                      <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Receipt className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{inv.number}</span>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td className="py-3.5 px-3 font-mono tabular-nums text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {inv.issueDate}
                      </td>

                      {/* Cliente */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#0B1A2D] dark:text-white max-w-[160px] truncate">
                          {inv.customerName}
                        </div>
                        {inv.customerNif && (
                          <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                            NIF: {inv.customerNif}
                          </div>
                        )}
                      </td>

                      {/* Concepto */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="truncate text-slate-700 dark:text-slate-300" title={inv.concept}>
                          {inv.concept}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
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
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {inv.paymentMethod === 'online' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            <span>Online</span>
                          </span>
                        ) : inv.paymentMethod === 'pos_terminal' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                            <span>TPV</span>
                          </span>
                        ) : inv.paymentMethod === 'cash' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            <Coins className="w-3.5 h-3.5 text-slate-400" />
                            <span>Efectivo</span>
                          </span>
                        ) : inv.paymentMethod === 'wallet' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            <Wallet className="w-3.5 h-3.5 text-slate-400" />
                            <span>Monedero</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            <Landmark className="w-3.5 h-3.5 text-slate-400" />
                            <span>Transferencia</span>
                          </span>
                        )}
                      </td>

                      {/* Importe Total */}
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums font-bold whitespace-nowrap">
                        <span className={inv.total < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-[#0B1A2D] dark:text-white'}>
                          {inv.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </span>
                      </td>

                      {/* Estado Cobro (Píldora Estandarizada) */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {isPaid && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0FCCF] text-[#0B1A2D] dark:bg-[#B7F229]/20 dark:text-[#B7F229] border border-[#B7F229]/50">
                            <Check className="w-3 h-3 text-[#82b805] dark:text-[#B7F229]" />
                            <span>Cobrada</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                            <Clock className="w-3 h-3" />
                            <span>Pendiente</span>
                          </span>
                        )}
                        {isRectified && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-[#071220] dark:text-slate-300 border border-slate-200 dark:border-[#1A314D]">
                            <RotateCcw className="w-3 h-3" />
                            <span>Rectificativa</span>
                          </span>
                        )}
                      </td>

                      {/* Estado Veri*factu (Solo España) */}
                      {isSpainClub && (
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          {isSynced ? (
                            <button
                              type="button"
                              onClick={() => setShowVerifactuModal(inv)}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0FCCF] text-[#0B1A2D] dark:bg-[#B7F229]/15 dark:text-[#B7F229] border border-[#B7F229]/45 hover:brightness-95 transition cursor-pointer"
                              title="Ver detalles de verificación tributaria Veri*factu"
                            >
                              <ShieldCheck className="w-3 h-3 text-[#82b805] dark:text-[#B7F229]" />
                              <span>Sincronizada</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSyncConfirmTarget(inv)}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 hover:bg-[#F0FCCF] text-[#0B1A2D] dark:bg-[#071220] dark:hover:bg-[#B7F229]/15 dark:text-slate-200 border border-slate-200 dark:border-[#1A314D] transition cursor-pointer"
                              title="Sincronizar ahora con la AEAT"
                            >
                              <AlertTriangle className="w-3 h-3 text-slate-500 dark:text-[#B7F229]" />
                              <span>Pendiente</span>
                            </button>
                          )}
                        </td>
                      )}

                      {/* Acciones Compactas y Precisas */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-0.5">
                          <button
                            type="button"
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-2 rounded-lg text-slate-500 hover:text-[#0B1A2D] dark:text-slate-400 dark:hover:text-[#B7F229] hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer"
                            title="Ver detalle de factura"
                            aria-label="Ver detalle de factura"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadPdf(inv)}
                            className="p-2 rounded-lg text-slate-500 hover:text-[#0B1A2D] dark:text-slate-400 dark:hover:text-[#B7F229] hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer"
                            title="Descargar PDF"
                            aria-label="Descargar PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleResendEmail(inv)}
                            className="p-2 rounded-lg text-slate-500 hover:text-[#0B1A2D] dark:text-slate-400 dark:hover:text-[#B7F229] hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer"
                            title="Reenviar por Email"
                            aria-label="Reenviar por Email"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          {isPending && (
                            <button
                              type="button"
                              onClick={() => markInvoicePaid(inv.id)}
                              className="ml-1 px-2.5 py-1 rounded-lg bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] font-bold text-[10px] transition cursor-pointer"
                              title="Marcar como pagada"
                            >
                              Cobrar
                            </button>
                          )}

                          {isPaid && inv.type !== 'rectificative' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setShowRectifyModal(inv);
                              }}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                              title="Emitir Factura Rectificativa (Abono)"
                              aria-label="Emitir Factura Rectificativa"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#1A314D]">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Receipt className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white">
                  Factura {selectedInvoice.number}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    selectedInvoice.status === 'paid'
                      ? 'bg-[#F0FCCF] text-[#0B1A2D] dark:bg-[#B7F229]/20 dark:text-[#B7F229]'
                      : selectedInvoice.status === 'pending'
                      ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-[#071220] dark:text-slate-300'
                  }`}
                >
                  {selectedInvoice.status === 'paid'
                    ? 'Cobrada'
                    : selectedInvoice.status === 'pending'
                    ? 'Pendiente'
                    : 'Rectificativa'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Emisor y Receptor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Emisor</span>
                <div className="font-bold text-[#0B1A2D] dark:text-white text-sm">{currentTenant.name}</div>
                <div className="text-slate-600 dark:text-slate-400 font-mono">NIF: B15998877</div>
                <div className="text-slate-600 dark:text-slate-400">{currentTenant.address}</div>
                <div className="text-slate-600 dark:text-slate-400">{currentTenant.contactEmail}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cliente / Receptor</span>
                <div className="font-bold text-[#0B1A2D] dark:text-white text-sm">{selectedInvoice.customerName}</div>
                <div className="text-slate-600 dark:text-slate-400 font-mono">
                  NIF/CIF: {selectedInvoice.customerNif || 'No especificado'}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  {selectedInvoice.customerAddress || 'Cliente particular'}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  {selectedInvoice.customerEmail || 'Sin email registrado'}
                </div>
              </div>
            </div>

            {/* Desglose de Líneas de Factura */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#0B1A2D] dark:text-white">Líneas y Conceptos</div>
              <div className="rounded-xl border border-slate-200/80 dark:border-[#1A314D] overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-[#071220] text-slate-600 dark:text-slate-300 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Descripción</th>
                      <th className="py-2.5 px-2 text-center">Cant.</th>
                      <th className="py-2.5 px-3 text-right">Precio Ud.</th>
                      <th className="py-2.5 px-2 text-center">IVA %</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1A314D]">
                    {selectedInvoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-medium">{item.description}</td>
                        <td className="py-2.5 px-2 text-center text-slate-500 font-mono tabular-nums">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                          {item.unitPrice.toFixed(2)} €
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono tabular-nums text-slate-500">{item.taxPercent}%</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-white">
                          {item.total.toFixed(2)} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totales e Impuestos */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div>
                  Método de pago:{' '}
                  <strong className="text-[#0B1A2D] dark:text-white uppercase">{selectedInvoice.paymentMethod}</strong>
                </div>
                <div>
                  Fecha de expedición:{' '}
                  <strong className="text-[#0B1A2D] dark:text-white font-mono">{selectedInvoice.issueDate}</strong>
                </div>
                {selectedInvoice.notes && <div className="text-slate-500 italic">{selectedInvoice.notes}</div>}
              </div>

              <div className="text-right space-y-1 font-mono tabular-nums">
                <div className="text-slate-500">
                  Base Imponible: <strong>{selectedInvoice.subtotal.toFixed(2)} €</strong>
                </div>
                <div className="text-slate-500">
                  Cuota IVA: <strong>{selectedInvoice.taxAmount.toFixed(2)} €</strong>
                </div>
                <div className="text-lg font-extrabold text-[#0B1A2D] dark:text-white border-t border-slate-200 dark:border-[#1A314D] pt-1">
                  Total Factura: {selectedInvoice.total.toFixed(2)} €
                </div>
              </div>
            </div>

            {/* Bloque Veri*factu del Documento (solo España) */}
            {isSpainClub && (
              <div className="p-3.5 rounded-2xl bg-[#F0FCCF]/60 dark:bg-[#B7F229]/10 border border-[#B7F229]/50 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <ShieldCheck className="w-5 h-5 text-[#82b805] dark:text-[#B7F229] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-[#0B1A2D] dark:text-white truncate">
                      {selectedInvoice.verifactu_status === 'synced'
                        ? 'Factura Homologada Veri*factu (AEAT Sincronizada)'
                        : 'Factura en cola Veri*factu (Pendiente de Transmisión)'}
                    </div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-300 font-mono truncate max-w-sm">
                      {selectedInvoice.verifactu_hash
                        ? `Hash: ${selectedInvoice.verifactu_hash.slice(0, 32)}...`
                        : 'Registro contable inalterable según Ley 11/2021'}
                    </div>
                  </div>
                </div>

                {selectedInvoice.verifactu_status === 'pending' ? (
                  <button
                    type="button"
                    onClick={() => setSyncConfirmTarget(selectedInvoice)}
                    className="px-3 py-1.5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] font-bold text-xs transition cursor-pointer shrink-0"
                  >
                    Sincronizar AEAT
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowVerifactuModal(selectedInvoice)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E2239] border border-[#0B1A2D]/20 dark:border-[#B7F229]/40 text-[#0B1A2D] dark:text-[#B7F229] font-bold text-xs hover:bg-slate-50 dark:hover:bg-[#132A45] transition cursor-pointer shrink-0"
                  >
                    Ver QR Tributario
                  </button>
                )}
              </div>
            )}

            {/* Botones de Acción */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleDownloadPdf(selectedInvoice)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] hover:bg-slate-200 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF</span>
              </button>

              <button
                type="button"
                onClick={() => handleResendEmail(selectedInvoice)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] hover:bg-slate-200 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Reenviar Email</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 rounded-xl bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] font-bold text-xs transition cursor-pointer"
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
      {isSpainClub && showVerifactuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl space-y-5 text-center">
            <button
              type="button"
              onClick={() => setShowVerifactuModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#82b805] dark:text-[#B7F229] flex items-center justify-center mx-auto shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white">
                Verificación Tributaria Veri*factu
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Factura {showVerifactuModal.number} · Homologación RD 1007/2023
              </p>
            </div>

            {/* Código QR Simulado de la AEAT */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block shadow-inner mx-auto">
              <div className="w-44 h-44 bg-[#0B1A2D] p-2 rounded-xl flex flex-col items-center justify-center text-white space-y-2">
                <QrCode className="w-24 h-24 text-white" />
                <span className="text-[9px] font-mono font-bold tracking-wider text-[#B7F229]">
                  AEAT VERI*FACTU QR
                </span>
                <span className="text-[8px] text-slate-300 font-mono">
                  B15998877 · {showVerifactuModal.total.toFixed(2)}€
                </span>
              </div>
            </div>

            {/* Metadatos Criptográficos */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071220] text-left text-xs font-mono space-y-1.5 border border-slate-200/80 dark:border-[#1A314D]">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Huella Hash SHA-256 (Encadenamiento):</div>
              <div className="text-[10px] text-[#0B1A2D] dark:text-[#B7F229] break-all">
                {showVerifactuModal.verifactu_hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              </div>
              <div className="text-[10px] text-slate-500 pt-1">
                Sincronizado:{' '}
                <strong>
                  {showVerifactuModal.verifactu_synced_at
                    ? new Date(showVerifactuModal.verifactu_synced_at).toLocaleString()
                    : 'Reciente'}
                </strong>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Cualquier cliente o inspector puede escanear este código QR con la cámara de su móvil para comprobar en la sede electrónica de la Agencia Tributaria que la factura fue emitida y remitida sin alteraciones.
            </p>

            <button
              type="button"
              onClick={() => setShowVerifactuModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#B7F229] hover:bg-[#a3db20] text-[#0B1A2D] font-bold text-xs transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1A314D]">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
                <RotateCcw className="w-5 h-5" />
                <span>Emitir Factura Rectificativa</span>
              </div>
              <button
                type="button"
                onClick={() => setShowRectifyModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-300 leading-relaxed">
              Estás a punto de emitir una factura de abono rectificativa para anular o corregir la factura{' '}
              <strong>{showRectifyModal.number}</strong> (Importe: {showRectifyModal.total.toFixed(2)} €). Se emitirá una nueva serie con signo negativo{isSpainClub ? ' y reporte Veri*factu' : ''}.
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
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRectifyModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-2xs transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1A314D]">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white">
                  Emitir Nueva Factura
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewInvoiceModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
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
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
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
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] font-mono"
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
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Invoice['category'])}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
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
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white font-mono font-bold focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Canal de Cobro
                  </label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as Invoice['paymentMethod'])}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
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
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  >
                    <option value="paid">Cobrada / Pagada</option>
                    <option value="pending">Pendiente de Cobro</option>
                  </select>
                </div>
              </div>

              {isSpainClub && (
                <div className="p-3 rounded-xl bg-[#F0FCCF]/60 dark:bg-[#B7F229]/10 border border-[#B7F229]/50 text-[11px] text-[#0B1A2D] dark:text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#82b805] dark:text-[#B7F229] shrink-0" />
                  <span>
                    Al emitir esta factura se generará automáticamente el registro contable inalterable con numeración correlativa y preparación Veri*factu.
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#1A314D]">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a3db20] text-[#0B1A2D] font-bold shadow-2xs transition cursor-pointer"
                >
                  Emitir y Registrar Factura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL CRÍTICO DE CONFIRMACIÓN: SINCRONIZACIÓN FISCAL AEAT (VERI*FACTU)
          ========================================================================= */}
      {isSpainClub && syncConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0FCCF] dark:bg-[#B7F229]/20 border border-[#B7F229]/50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#82b805] dark:text-[#B7F229]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0B1A2D] dark:text-white leading-snug">
                  Confirmación de Sincronización Fiscal
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSyncConfirmTarget(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] cursor-pointer shrink-0"
                aria-label="Cerrar confirmación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-2">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                Estás a punto de enviar los registros de facturación a la Agencia Tributaria (AEAT) mediante huella SHA-256. Esta acción oficial es irreversible y no se podrá cancelar una vez procesada.
              </p>
              <div className="text-[11px] font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-[#B7F229] pt-1">
                {syncConfirmTarget === 'all'
                  ? `Alcance: Lote de ${pendingVerifactuCount} ${pendingVerifactuCount === 1 ? 'factura pendiente' : 'facturas pendientes'}`
                  : `Factura seleccionada: ${syncConfirmTarget.number} · ${syncConfirmTarget.total.toFixed(2)} €`}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSyncConfirmTarget(null)}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] hover:bg-slate-200 dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmFiscalSync}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] font-bold text-xs shadow-2xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#B7F229] dark:text-[#0B1A2D] shrink-0" />
                <span>Confirmar y Enviar a AEAT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
