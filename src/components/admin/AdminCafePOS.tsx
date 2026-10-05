import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CafeProduct, Booking } from '../../types/database';
import {
  Coffee,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  User,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Calendar,
  Wallet,
  X,
  Check,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface LinkedChargeMeta {
  bookingId?: string;
  participantName?: string;
  isWalletTopup?: boolean;
  memberId?: string;
  memberName?: string;
}

export const AdminCafePOS: React.FC = () => {
  const {
    currentTenant,
    cafeProducts,
    recordCafeSale,
    triggerDemoToast,
    bookings,
    markBookingPaid,
    posPendingCharge,
    setPosPendingCharge,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [posCart, setPosCart] = useState<{ product: CafeProduct; qty: number; meta?: LinkedChargeMeta }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'member_wallet'>('card');
  const [sessionSalesTotal, setSessionSalesTotal] = useState(148.5);

  // Modal: Asignar Reserva / Pago de Jugador
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTab, setAssignTab] = useState<'bookings' | 'wallet'>('bookings');
  const [bookingSearch, setBookingSearch] = useState('');
  const [walletSearch, setWalletSearch] = useState('');
  const [selectedWalletMember, setSelectedWalletMember] = useState<{ id: string; name: string; memberNum: string; balance: number } | null>(null);
  const [walletAmount, setWalletAmount] = useState<number>(20);
  const [customWalletInput, setCustomWalletInput] = useState<string>('');

  // Sample club members for wallet assignment
  const demoMembers = [
    { id: 'c-1', name: 'Carlos Méndez', memberNum: 'SM-408', balance: 24.5 },
    { id: 'c-2', name: 'Diego Soto', memberNum: 'SM-409', balance: 12.0 },
    { id: 'c-3', name: 'Ana Belén Vázquez', memberNum: 'SM-412', balance: 45.0 },
    { id: 'c-4', name: 'Javier Fraga', memberNum: 'Casual', balance: 0.0 },
    { id: 'c-5', name: 'Elena Permuy', memberNum: 'SM-390', balance: 60.0 },
    { id: 'c-6', name: 'Rubén Loureiro', memberNum: 'Casual', balance: 5.0 },
  ];

  // 1. Detect and Preload pending charge from Booking Drawer / Agenda
  useEffect(() => {
    if (posPendingCharge) {
      const customProd: CafeProduct = {
        id: `charge-${Date.now()}`,
        name: posPendingCharge.concept,
        price: posPendingCharge.amount,
        category: 'Reserva Pista',
        active: true,
        stock: 999,
      };

      setPosCart((prev) => [
        ...prev,
        {
          product: customProd,
          qty: 1,
          meta: {
            bookingId: posPendingCharge.reservationId,
            participantName: posPendingCharge.playerName,
          },
        },
      ]);

      triggerDemoToast(
        'Cobro Precargado en TPV',
        `${posPendingCharge.concept} (${posPendingCharge.amount.toFixed(2)}€) cargado en el ticket.`,
        'success'
      );

      // Clear pending charge once loaded
      setPosPendingCharge(null);
    }
  }, [posPendingCharge, setPosPendingCharge, triggerDemoToast]);

  const categories = ['all', 'Bebidas', 'Café', 'Snacks', 'Bocadillos', 'Grip/Pelotas'];

  const filteredProducts = cafeProducts.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  const addItemToPOS = (p: CafeProduct) => {
    setPosCart((prev) => {
      const exists = prev.find((item) => item.product.id === p.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === p.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product: p, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setPosCart((prev) =>
      prev
        .map((item) => (item.product.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const cartTotal = posCart.reduce((acc, item) => acc + item.product.price * item.qty, 0);

  const handleChargeSale = () => {
    if (posCart.length === 0) return;

    // Check if any reservation or wallet top-up items were in cart
    posCart.forEach((item) => {
      if (item.meta?.bookingId) {
        markBookingPaid(item.meta.bookingId, item.meta.participantName);
      }
      if (!item.meta) {
        recordCafeSale(item.product, item.qty);
      }
    });

    setSessionSalesTotal((prev) => prev + cartTotal);
    triggerDemoToast(
      'Venta Cobrada en TPV',
      `Ticket emitido por ${cartTotal.toFixed(2)} € pagado con ${
        paymentMethod === 'card' ? 'Tarjeta' : paymentMethod === 'cash' ? 'Efectivo' : 'Saldo de Socio'
      }. Reservas y monederos actualizados.`,
      'success'
    );
    setPosCart([]);
  };

  // Assign Full Booking to Cart
  const handleAssignFullBooking = (booking: Booking) => {
    const itemProd: CafeProduct = {
      id: `booking-${booking.id}-${Date.now()}`,
      name: `Reserva ${booking.courtName} (${booking.startTime.split('T')[1]?.slice(0, 5) || ''}) — Pago Total`,
      price: booking.totalPrice,
      category: 'Reserva Pista',
      active: true,
      stock: 999,
    };

    setPosCart((prev) => [
      ...prev,
      {
        product: itemProd,
        qty: 1,
        meta: {
          bookingId: booking.id,
        },
      },
    ]);

    setAssignModalOpen(false);
    triggerDemoToast('Reserva Asignada a TPV', `Pista ${booking.courtName} (${booking.totalPrice.toFixed(2)}€) añadida al ticket actual.`, 'success');
  };

  // Assign Split Participant to Cart
  const handleAssignParticipant = (booking: Booking, p: { name: string; amount: number; paid: boolean }) => {
    const itemProd: CafeProduct = {
      id: `split-${booking.id}-${p.name}-${Date.now()}`,
      name: `Reserva ${booking.courtName} — Cuota ${p.name} (1/4)`,
      price: p.amount || booking.totalPrice / 4,
      category: 'Reserva Pista',
      active: true,
      stock: 999,
    };

    setPosCart((prev) => [
      ...prev,
      {
        product: itemProd,
        qty: 1,
        meta: {
          bookingId: booking.id,
          participantName: p.name,
        },
      },
    ]);

    setAssignModalOpen(false);
    triggerDemoToast('Cuota de Jugador Asignada', `Cuota de ${p.name} (${(p.amount || 7).toFixed(2)}€) añadida al ticket.`, 'success');
  };

  // Assign Wallet Top-up to Cart
  const handleAddWalletTopup = () => {
    if (!selectedWalletMember) return;
    const finalAmount = customWalletInput ? parseFloat(customWalletInput) || walletAmount : walletAmount;
    if (finalAmount <= 0) return;

    const walletProd: CafeProduct = {
      id: `wallet-${selectedWalletMember.id}-${Date.now()}`,
      name: `Recarga Monedero: ${selectedWalletMember.name} (#${selectedWalletMember.memberNum})`,
      price: finalAmount,
      category: 'Recarga Monedero',
      active: true,
      stock: 999,
    };

    setPosCart((prev) => [
      ...prev,
      {
        product: walletProd,
        qty: 1,
        meta: {
          isWalletTopup: true,
          memberId: selectedWalletMember.id,
          memberName: selectedWalletMember.name,
        },
      },
    ]);

    setAssignModalOpen(false);
    setSelectedWalletMember(null);
    setCustomWalletInput('');
    triggerDemoToast('Recarga de Monedero en Ticket', `Carga de ${finalAmount.toFixed(2)}€ para ${selectedWalletMember.name} preparada para cobrar.`, 'success');
  };

  const filteredBookings = bookings.filter((b) => {
    const term = bookingSearch.toLowerCase().trim();
    return !term || b.creatorName.toLowerCase().includes(term) || b.courtName.toLowerCase().includes(term);
  });

  const filteredMembers = demoMembers.filter((m) => {
    const term = walletSearch.toLowerCase().trim();
    return !term || m.name.toLowerCase().includes(term) || m.memberNum.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-12">
      {/* Header & POS Shift Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Terminal TPV de Mostrador y Caja
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cobro en mostrador de consumiciones, reservas de pista (100% o cuota jugador) y recargas de saldo socio.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Botón principal requerido en prompt: "Asignar Reserva / Pago de Jugador" */}
          <button
            type="button"
            onClick={() => setAssignModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Asignar Reserva / Pago de Jugador</span>
          </button>

          <div className="p-2.5 px-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-right shadow-xs">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Total Turno:
            </div>
            <div className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">
              {sessionSalesTotal.toFixed(2)} €
            </div>
          </div>
        </div>
      </div>

      {/* POS Interface: Product Catalog + Fast Ticket Register */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Products Grid */}
        <div className="lg:col-span-7 space-y-4">
          {/* Categories bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === c
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                {c === 'all' ? 'Todos' : c}
              </button>
            ))}
          </div>

          {/* Touch item cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((prod) => (
              <button
                key={prod.id}
                type="button"
                onClick={() => addItemToPOS(prod)}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/50 text-left transition flex flex-col justify-between h-28 group shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {prod.category}
                  </div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition mt-0.5 line-clamp-2">
                    {prod.name}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/50">
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {prod.price.toFixed(2)} €
                  </span>
                  <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 group-hover:bg-emerald-500 group-hover:text-white transition">
                    <Plus className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Ticket / POS Cart Register */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-500" />
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Ticket de Venta en Curso ({posCart.reduce((acc, i) => acc + i.qty, 0)})
              </h2>
            </div>
            {posCart.length > 0 && (
              <button
                type="button"
                onClick={() => setPosCart([])}
                className="text-[11px] font-bold text-rose-500 hover:text-rose-600 transition"
              >
                Vaciar Ticket
              </button>
            )}
          </div>

          {/* Cart items list */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {posCart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                Ticket vacío. Selecciona artículos del catálogo o pulsa en "Asignar Reserva / Pago de Jugador".
              </div>
            ) : (
              posCart.map(({ product, qty, meta }, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {product.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {product.price.toFixed(2)} € / ud.
                      {meta?.bookingId && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold font-mono text-[9px]">
                          VINCULADO A RESERVA
                        </span>
                      )}
                      {meta?.isWalletTopup && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded-sm bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold font-mono text-[9px]">
                          RECARGA MONEDERO
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                      <button
                        type="button"
                        onClick={() => updateQty(product.id, -1)}
                        className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold px-1.5 min-w-[20px] text-center text-slate-900 dark:text-white">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(product.id, 1)}
                        className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-slate-900 dark:text-white min-w-[50px] text-right">
                      {(product.price * qty).toFixed(2)} €
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Forma de Pago en Mostrador:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-1 rounded-xl font-bold border flex flex-col items-center gap-1 text-[11px] transition cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                <span>Tarjeta</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 px-1 rounded-xl font-bold border flex flex-col items-center gap-1 text-[11px] transition cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                <Banknote className="w-3.5 h-3.5 text-emerald-500" />
                <span>Efectivo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('member_wallet')}
                className={`py-2 px-1 rounded-xl font-bold border flex flex-col items-center gap-1 text-[11px] transition cursor-pointer ${
                  paymentMethod === 'member_wallet'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-500" />
                <span>Saldo Socio</span>
              </button>
            </div>
          </div>

          {/* Total & Charge CTA */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Total a Cobrar:</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {cartTotal.toFixed(2)} €
              </span>
            </div>

            <button
              type="button"
              onClick={handleChargeSale}
              disabled={posCart.length === 0}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cobrar & Emitir Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: ASIGNAR RESERVA / PAGO DE JUGADOR (Requerimiento 5.2) */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Asignar Cobro de Reserva o Saldo Socio
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs del modal */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setAssignTab('bookings')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  assignTab === 'bookings'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Reservas del Día ({bookings.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setAssignTab('wallet')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  assignTab === 'wallet'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Carga a Monedero de Jugador</span>
              </button>
            </div>

            {/* TAB 1: RESERVAS DEL DÍA */}
            {assignTab === 'bookings' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Buscar reserva por jugador o pista..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 text-xs">
                  {filteredBookings.map((b) => {
                    const isPending = b.paymentStatus === 'pending' || b.paymentStatus === 'partially_paid';
                    return (
                      <div
                        key={b.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{b.creatorName}</span>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                                {b.courtName}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {b.startTime.split('T')[1]?.slice(0, 5) || ''} - {b.endTime.split('T')[1]?.slice(0, 5) || ''} · Total: {b.totalPrice.toFixed(2)} €
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAssignFullBooking(b)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition"
                          >
                            <span>Cobrar Total ({b.totalPrice.toFixed(2)} €)</span>
                          </button>
                        </div>

                        {/* Participantes / Cuotas individuales */}
                        {b.participants && b.participants.length > 0 && (
                          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Cuotas individuales de jugadores (Pago Dividido):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {b.participants.map((p, pIdx) => (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => handleAssignParticipant(b, p)}
                                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left flex items-center justify-between transition text-[11px]"
                                >
                                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate mr-2">
                                    {p.name}
                                  </span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0 font-mono">
                                    +{(p.amount || b.totalPrice / 4).toFixed(2)} €
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: RECARGA DE MONEDERO */}
            {assignTab === 'wallet' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    1. Seleccionar Socio / Jugador:
                  </label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={walletSearch}
                      onChange={(e) => setWalletSearch(e.target.value)}
                      placeholder="Buscar por nombre o número de socio..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                    {filteredMembers.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedWalletMember(m)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          selectedWalletMember?.id === m.id
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-bold text-slate-900 dark:text-white truncate">{m.name}</div>
                        <div className="text-[10px] text-slate-500">#{m.memberNum} · Saldo: {m.balance.toFixed(2)}€</div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedWalletMember && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 space-y-3">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300">
                      2. Importe a Recargar para {selectedWalletMember.name}:
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[10, 20, 50].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => { setWalletAmount(amt); setCustomWalletInput(''); }}
                          className={`px-3 py-1.5 rounded-xl font-mono font-bold text-xs transition ${
                            walletAmount === amt && !customWalletInput
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          +{amt} €
                        </button>
                      ))}

                      <input
                        type="number"
                        placeholder="Importe libre..."
                        value={customWalletInput}
                        onChange={(e) => setCustomWalletInput(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs w-32 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddWalletTopup}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Añadir Recarga al Ticket</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCafePOS;
