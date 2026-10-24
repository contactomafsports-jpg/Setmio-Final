import React, { useState, useEffect, useMemo } from 'react';
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
  FileText,
  Download,
  Edit2,
  Package,
  Tag,
  AlertCircle,
  Receipt,
  Calculator,
  Upload,
  Smartphone,
  ShoppingBag,
  Info,
  ExternalLink,
  Building2,
  History,
} from 'lucide-react';

interface LinkedChargeMeta {
  bookingId?: string;
  participantName?: string;
  isWalletTopup?: boolean;
  memberId?: string;
  memberName?: string;
}

export interface POSTransactionItem {
  id: string;
  time: string;
  concept: string;
  amount: number;
  paymentMethod: string;
  venueId?: string;
  venueName?: string;
  customerName?: string;
}

export const AdminCafePOS: React.FC = () => {
  const {
    currentTenant,
    cafeProducts,
    addCafeProduct,
    updateCafeProduct,
    deleteCafeProduct,
    recordCafeSale,
    triggerDemoToast,
    bookings,
    markBookingPaid,
    posPendingCharge,
    setPosPendingCharge,
    setAdminTab,
    isMultiVenue,
    venues,
    t,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [posCart, setPosCart] = useState<{ product: CafeProduct; qty: number; meta?: LinkedChargeMeta }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [sessionSalesTotal, setSessionSalesTotal] = useState(148.5);

  const configuredMethods = currentTenant.settings?.paymentMethods;
  const availablePaymentMethods = useMemo(() => {
    const list: Array<{ id: string; label: string; icon: any }> = [];

    // 1. Efectivo (Mostrador)
    if (configuredMethods ? configuredMethods.cash !== false : true) {
      list.push({ id: 'cash', label: t('pos.paymentMethods.cash', 'Efectivo'), icon: Banknote });
    }
    // 2. Datáfono del Banco (Manual)
    if (configuredMethods ? configuredMethods.manualPos !== false : true) {
      list.push({ id: 'card', label: t('pos.paymentMethods.manualPos', 'Datáfono Banco (Manual)'), icon: CreditCard });
    }
    // 3. Datáfono Integrado (Stripe Terminal)
    if (configuredMethods ? configuredMethods.stripeTerminal !== false : true) {
      list.push({ id: 'stripe_terminal', label: t('pos.paymentMethods.stripeTerminal', 'Stripe Terminal'), icon: CreditCard });
    }
    // 4. Cobro por Notificación Push / App del Socio
    if (configuredMethods ? configuredMethods.pushCharge !== false : true) {
      list.push({ id: 'push_charge', label: t('pos.paymentMethods.pushCharge', 'Cobro Push / App'), icon: Smartphone });
    }
    // 5. Monedero / Saldo de Socio y Bonos
    if (configuredMethods ? configuredMethods.wallet !== false : true) {
      list.push({ id: 'member_wallet', label: t('pos.paymentMethods.wallet', 'Monedero Socio'), icon: Wallet });
    }

    if (list.length === 0) {
      list.push({ id: 'cash', label: t('pos.paymentMethods.cash', 'Efectivo'), icon: Banknote });
    }
    return list;
  }, [configuredMethods, t]);

  useEffect(() => {
    if (availablePaymentMethods.length > 0 && !availablePaymentMethods.some((m) => m.id === paymentMethod)) {
      setPaymentMethod(availablePaymentMethods[0].id);
    }
  }, [availablePaymentMethods, paymentMethod]);

  const hasMultipleVenues = Boolean(isMultiVenue) && Array.isArray(venues) && venues.length > 1;
  const [posVenueFilter, setPosVenueFilter] = useState<string>('all');
  const [transactionsModalOpen, setTransactionsModalOpen] = useState(false);

  const [posTransactions, setPosTransactions] = useState<POSTransactionItem[]>([
    {
      id: 'tx-101',
      time: '09:15',
      concept: '2x Agua Mineral + 1x Café Espresso',
      amount: 5.5,
      paymentMethod: 'Tarjeta',
      venueId: venues?.[0]?.id || 'v-1',
      venueName: venues?.[0]?.name || 'Sede Principal',
      customerName: 'Carlos Méndez',
    },
    {
      id: 'tx-102',
      time: '10:00',
      concept: 'Reserva Pista 2 (10:00) — Cuota 1/4',
      amount: 7.0,
      paymentMethod: 'Efectivo',
      venueId: venues?.[0]?.id || 'v-1',
      venueName: venues?.[0]?.name || 'Sede Principal',
      customerName: 'Diego Soto',
    },
    {
      id: 'tx-103',
      time: '11:20',
      concept: 'Bote Bolas Head Pro S + 2x Powerade',
      amount: 12.0,
      paymentMethod: 'Monedero Socio',
      venueId: venues?.[1]?.id || venues?.[0]?.id || 'v-2',
      venueName: venues?.[1]?.name || 'Sede Indoor Norte',
      customerName: 'Ana Belén Vázquez',
    },
    {
      id: 'tx-104',
      time: '12:45',
      concept: 'Recarga Monedero Socio (#SM-390)',
      amount: 50.0,
      paymentMethod: 'Tarjeta',
      venueId: venues?.[0]?.id || 'v-1',
      venueName: venues?.[0]?.name || 'Sede Principal',
      customerName: 'Elena Permuy',
    },
  ]);

  // Modal: Asignar Reserva / Pago de Jugador
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTab, setAssignTab] = useState<'bookings' | 'wallet'>('bookings');
  const [bookingSearch, setBookingSearch] = useState('');
  const [walletSearch, setWalletSearch] = useState('');
  const [selectedWalletMember, setSelectedWalletMember] = useState<{ id: string; name: string; memberNum: string; balance: number } | null>(null);
  const [walletAmount, setWalletAmount] = useState<number>(20);
  const [customWalletInput, setCustomWalletInput] = useState<string>('');

  // Modal: Arqueo / Cierre de Caja
  const [arqueoModalOpen, setArqueoModalOpen] = useState(false);

  // Modal: Gestión de Catálogo de Productos
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [productFormModalOpen, setProductFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CafeProduct | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<CafeProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<CafeProduct | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'Bebidas',
    price: 2.0,
    stock: 50,
    imageUrl: '',
  });

  const PRESET_PRODUCT_IMAGES = [
    { label: 'Agua Mineral', url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=400&q=80' },
    { label: 'Isotónico / Powerade', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80' },
    { label: 'Estrella Galicia 0,0', url: 'https://images.unsplash.com/photo-1608270546103-979c3d4e0e5a?auto=format&fit=crop&w=400&q=80' },
    { label: 'Café Espresso', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80' },
    { label: 'Bocadillo Jamón Ibérico', url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=400&q=80' },
    { label: 'Barrita Proteica', url: 'https://images.unsplash.com/photo-1622484216805-4c0734cba8f0?auto=format&fit=crop&w=400&q=80' },
    { label: 'Bote Bolas Head Pro S', url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80' },
    { label: 'Overgrip Wilson Pro', url: 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&w=400&q=80' },
    { label: 'Pala de Pádel Pro', url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=400&q=80' },
  ];

  const CATEGORY_PLACEHOLDERS: Record<string, string> = {
    Bebidas:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" fill="none"><rect width="300" height="200" fill="%230f172a"/><rect x="15" y="15" width="270" height="170" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="1.5"/><circle cx="150" cy="85" r="32" fill="%2306b6d4" fill-opacity="0.15" stroke="%2306b6d4" stroke-width="2"/><path d="M142 65h16v8h-16zM139 73h22l4 28a4 4 0 0 1-4 4h-18a4 4 0 0 1-4-4l4-28z" stroke="%2306b6d4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="150" y="142" fill="%2338bdf8" font-family="system-ui,sans-serif" font-size="12" font-weight="700" text-anchor="middle">BEBIDA / AGUA</text><text x="150" y="158" fill="%2364748b" font-family="system-ui,sans-serif" font-size="9" font-weight="600" text-anchor="middle">SETMIO TPV PRO</text></svg>',
    Café:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" fill="none"><rect width="300" height="200" fill="%230f172a"/><rect x="15" y="15" width="270" height="170" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="1.5"/><circle cx="150" cy="85" r="32" fill="%23f59e0b" fill-opacity="0.15" stroke="%23f59e0b" stroke-width="2"/><path d="M136 78h24v16a6 6 0 0 1-6 6h-12a6 6 0 0 1-6-6V78zm24 3h6a4 4 0 0 1 0 8h-6M132 104h32" stroke="%23f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="150" y="142" fill="%23fbbf24" font-family="system-ui,sans-serif" font-size="12" font-weight="700" text-anchor="middle">CAFETERÍA / EXPRESSO</text><text x="150" y="158" fill="%2364748b" font-family="system-ui,sans-serif" font-size="9" font-weight="600" text-anchor="middle">SETMIO TPV PRO</text></svg>',
    Bocadillos:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" fill="none"><rect width="300" height="200" fill="%230f172a"/><rect x="15" y="15" width="270" height="170" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="1.5"/><circle cx="150" cy="85" r="32" fill="%2310b981" fill-opacity="0.15" stroke="%2310b981" stroke-width="2"/><path d="M132 82c3-8 33-8 36 0v6H132v-6zm0 10h36v4c0 3-3 6-6 6h-24c-3 0-6-3-6-6v-4z" stroke="%2310b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="150" y="142" fill="%2334d399" font-family="system-ui,sans-serif" font-size="12" font-weight="700" text-anchor="middle">BOCADILLO / TOSTA</text><text x="150" y="158" fill="%2364748b" font-family="system-ui,sans-serif" font-size="9" font-weight="600" text-anchor="middle">SETMIO TPV PRO</text></svg>',
    Snacks:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" fill="none"><rect width="300" height="200" fill="%230f172a"/><rect x="15" y="15" width="270" height="170" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="1.5"/><circle cx="150" cy="85" r="32" fill="%23a855f7" fill-opacity="0.15" stroke="%23a855f7" stroke-width="2"/><path d="M134 76h32l-4 22h-24l-4-22zm-4 4l-4 4 4 4m40-8l4 4-4 4" stroke="%23a855f7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="150" y="142" fill="%23c084fc" font-family="system-ui,sans-serif" font-size="12" font-weight="700" text-anchor="middle">SNACK / BARRITA</text><text x="150" y="158" fill="%2364748b" font-family="system-ui,sans-serif" font-size="9" font-weight="600" text-anchor="middle">SETMIO TPV PRO</text></svg>',
    'Grip/Pelotas':
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" fill="none"><rect width="300" height="200" fill="%230f172a"/><rect x="15" y="15" width="270" height="170" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="1.5"/><circle cx="150" cy="85" r="32" fill="%23eab308" fill-opacity="0.15" stroke="%23eab308" stroke-width="2"/><circle cx="150" cy="85" r="16" stroke="%23eab308" stroke-width="2.5"/><path d="M140 75c6 3 14 17 20 20m0-20c-6 3-14 17-20 20" stroke="%23eab308" stroke-width="2" stroke-linecap="round"/><text x="150" y="142" fill="%23facc15" font-family="system-ui,sans-serif" font-size="12" font-weight="700" text-anchor="middle">PELOTAS / OVERGRIP</text><text x="150" y="158" fill="%2364748b" font-family="system-ui,sans-serif" font-size="9" font-weight="600" text-anchor="middle">SETMIO TPV PRO</text></svg>',
    'Reserva Pista':
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" fill="none"><rect width="300" height="200" fill="%230f172a"/><rect x="15" y="15" width="270" height="170" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="1.5"/><circle cx="150" cy="85" r="32" fill="%2310b981" fill-opacity="0.15" stroke="%2310b981" stroke-width="2"/><path d="M130 85h40M150 65v40M134 70l32 30" stroke="%2310b981" stroke-width="2.5" stroke-linecap="round"/><text x="150" y="142" fill="%2334d399" font-family="system-ui,sans-serif" font-size="12" font-weight="700" text-anchor="middle">RESERVA DE PISTA</text><text x="150" y="158" fill="%2364748b" font-family="system-ui,sans-serif" font-size="9" font-weight="600" text-anchor="middle">SETMIO TPV PRO</text></svg>',
    Default:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" fill="none"><rect width="300" height="200" fill="%230f172a"/><rect x="15" y="15" width="270" height="170" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="1.5"/><circle cx="150" cy="85" r="32" fill="%2310b981" fill-opacity="0.15" stroke="%2310b981" stroke-width="2"/><path d="M138 85h24M150 73v24" stroke="%2310b981" stroke-width="3" stroke-linecap="round"/><text x="150" y="142" fill="%2334d399" font-family="system-ui,sans-serif" font-size="12" font-weight="700" text-anchor="middle">ARTÍCULO TPV</text><text x="150" y="158" fill="%2364748b" font-family="system-ui,sans-serif" font-size="9" font-weight="600" text-anchor="middle">SETMIO TPV PRO</text></svg>',
  };

  const getFallbackProductImage = (cat?: string) => {
    if (!cat) return CATEGORY_PLACEHOLDERS['Default'];
    return CATEGORY_PLACEHOLDERS[cat] || CATEGORY_PLACEHOLDERS['Default'];
  };

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
        imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80',
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

    posCart.forEach((item) => {
      if (item.meta?.bookingId) {
        markBookingPaid(item.meta.bookingId, item.meta.participantName);
      }
      if (!item.meta) {
        recordCafeSale(item.product, item.qty);
      }
    });

    const activeVenueObj = hasMultipleVenues && posVenueFilter !== 'all'
      ? venues.find((v) => v.id === posVenueFilter)
      : (venues?.[0] || undefined);

    const methodLabel = availablePaymentMethods.find((m) => m.id === paymentMethod)?.label || 'TPV';

    const customerMeta =
      posCart.find((i) => i.meta?.memberName)?.meta?.memberName ||
      posCart.find((i) => i.meta?.participantName)?.meta?.participantName ||
      'Cliente Mostrador';

    const newTx: POSTransactionItem = {
      id: `tx-${Date.now()}`,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      concept: posCart.map((i) => `${i.qty}x ${i.product.name}`).join(', '),
      amount: cartTotal,
      paymentMethod: methodLabel,
      venueId: activeVenueObj?.id,
      venueName: activeVenueObj?.name,
      customerName: customerMeta,
    };

    setPosTransactions((prev) => [newTx, ...prev]);
    setSessionSalesTotal((prev) => prev + cartTotal);

    triggerDemoToast(
      'Venta Cobrada en TPV',
      `Ticket emitido por ${cartTotal.toFixed(2)} € pagado con ${methodLabel}. Reservas y monederos actualizados.`,
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
      imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80',
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
      imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80',
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

  // Print Arqueo Ticket
  const handlePrintThermalArqueo = () => {
    window.print();
  };

  // Export Arqueo CSV
  const handleExportArqueoCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        ['Concepto', 'Metodo', 'Importe EUR'].join(','),
        ['Ventas Tarjeta / TPV', 'Datáfono', (sessionSalesTotal * 0.58).toFixed(2)],
        ['Ventas Efectivo', 'Caja Mostrador', (sessionSalesTotal * 0.28).toFixed(2)],
        ['Cobros Saldo Socio', 'Monedero Club', (sessionSalesTotal * 0.14).toFixed(2)],
        ['TOTAL TURNO', 'Consolidado', sessionSalesTotal.toFixed(2)],
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `arqueo-caja-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerDemoToast('Informe Exportado', 'El desglose de cierre de caja se ha descargado en formato CSV.', 'success');
  };

  // Open Create/Edit Product Form Modal
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      category: 'Bebidas',
      price: 2.5,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=400&q=80',
    });
    setProductFormModalOpen(true);
  };

  const openEditProductModal = (prod: CafeProduct) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      stock: prod.stock,
      imageUrl: prod.imageUrl || '',
    });
    setProductFormModalOpen(true);
  };

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name.trim()) {
      triggerDemoToast('Error', 'El nombre del producto es obligatorio.', 'warning');
      return;
    }

    if (editingProduct) {
      updateCafeProduct(editingProduct.id, {
        name: productFormData.name,
        category: productFormData.category,
        price: Number(productFormData.price),
        stock: Number(productFormData.stock),
        imageUrl: productFormData.imageUrl,
      });
      triggerDemoToast('Producto Actualizado', `"${productFormData.name}" actualizado en el catálogo.`, 'success');
    } else {
      addCafeProduct({
        name: productFormData.name,
        category: productFormData.category,
        price: Number(productFormData.price),
        stock: Number(productFormData.stock),
        active: true,
        imageUrl: productFormData.imageUrl || 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=400&q=80',
        tenantId: currentTenant.id,
      });
      triggerDemoToast('Producto Añadido', `"${productFormData.name}" disponible en TPV.`, 'success');
    }

    setProductFormModalOpen(false);
  };

  const filteredTransactions = posTransactions.filter((tx) => {
    if (hasMultipleVenues && posVenueFilter !== 'all') {
      return tx.venueId === posVenueFilter;
    }
    return true;
  });

  const filteredBookings = bookings.filter((b) => {
    const term = bookingSearch.toLowerCase().trim();
    const matchTerm = !term || b.creatorName.toLowerCase().includes(term) || b.courtName.toLowerCase().includes(term);
    if (!matchTerm) return false;
    if (hasMultipleVenues && posVenueFilter !== 'all') {
      if (b.venueId && b.venueId !== posVenueFilter) return false;
    }
    return true;
  });

  const filteredMembers = demoMembers.filter((m) => {
    const term = walletSearch.toLowerCase().trim();
    return !term || m.name.toLowerCase().includes(term) || m.memberNum.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-12">
      {/* 1. Header & POS Shift Status - Mobile Layout Rediseñado Anti-solapamientos */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
              Terminal TPV de Mostrador y Caja
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            Cobro en mostrador de consumiciones, reservas de pista y recargas de saldo socio.
          </p>
        </div>

        {/* Acciones superiores y Caja: responsive layout anti-solapamiento */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
          {/* Selector de Sede: SOLO visible si el club es Multi-Sede */}
          {hasMultipleVenues && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs text-xs font-bold col-span-2 sm:col-span-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">Sede:</span>
              <select
                value={posVenueFilter}
                onChange={(e) => setPosVenueFilter(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white font-bold outline-hidden cursor-pointer w-full sm:w-auto"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  Todas las sedes
                </option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Historial de Transacciones del Turno */}
          <button
            type="button"
            onClick={() => setTransactionsModalOpen(true)}
            className="px-3 sm:px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Ver y filtrar transacciones por sede"
          >
            <History className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate">Transacciones</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {filteredTransactions.length}
            </span>
          </button>

          {/* Asignar Reserva / Pago de Jugador */}
          <button
            type="button"
            onClick={() => setAssignModalOpen(true)}
            className="px-3 sm:px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="truncate">Asignar Reserva</span>
          </button>

          {/* Reincorporado: Cierre / Arqueo de Caja */}
          <button
            type="button"
            onClick={() => setArqueoModalOpen(true)}
            className="px-3 sm:px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate">Arqueo</span>
          </button>

          {/* Catálogo de Productos */}
          <button
            type="button"
            onClick={() => setCatalogModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200/80 dark:border-slate-700/80 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            title="Gestionar catálogo y existencias"
          >
            <Package className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Catálogo</span>
          </button>

          {/* Contenedor dinámico del "Total Turno" */}
          <div className="p-2 sm:px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center sm:text-right shadow-xs flex flex-col justify-center min-w-[95px]">
            <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Total Turno
            </div>
            <div className="text-sm sm:text-base font-mono font-black text-emerald-600 dark:text-emerald-400 leading-none mt-0.5">
              {sessionSalesTotal.toFixed(2)} €
            </div>
          </div>
        </div>
      </div>

      {/* 2. POS Interface: Product Catalog + Fast Ticket Register */}
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

          {/* Touch item cards con Imagen de Vista Previa Arriba y Badge de Categoría Superpuesto */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                role="button"
                tabIndex={0}
                onClick={() => addItemToPOS(prod)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    addItemToPOS(prod);
                  }
                }}
                className="p-2.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/50 text-left transition flex flex-col group shadow-xs hover:scale-[1.01] active:scale-[0.99] cursor-pointer overflow-hidden select-none"
              >
                {/* 1. Imagen Superior con Badges Superpuestos */}
                <div className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700/50 shrink-0">
                  <img
                    src={prod.imageUrl || getFallbackProductImage(prod.category)}
                    alt={prod.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getFallbackProductImage(prod.category);
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Botón rápido ver detalle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProductDetail(prod);
                    }}
                    className="absolute bottom-1.5 right-1.5 p-1 rounded-lg bg-slate-900/70 hover:bg-slate-900 text-white transition z-10"
                    title="Ver detalle del producto"
                  >
                    <Info className="w-3 h-3" />
                  </button>

                  {/* Badge de Categoría Superpuesto en esquina superior izquierda */}
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[9px] font-bold text-white uppercase tracking-wider shadow-xs">
                    {prod.category}
                  </span>

                  {/* Badge de Stock en esquina superior derecha */}
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-[9px] font-mono font-bold text-slate-800 dark:text-slate-200 shadow-xs">
                    {prod.stock} ud.
                  </span>
                </div>

                {/* 2. Información Inferior: Título y Precio/Botón en estructura vertical */}
                <div className="flex flex-col flex-1 justify-between pt-2">
                  <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition line-clamp-1 leading-snug">
                    {prod.name}
                  </div>

                  <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                    <span className="font-mono font-black text-xs text-emerald-600 dark:text-emerald-400">
                      {prod.price.toFixed(2)} €
                    </span>
                    <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket / POS Cart Register */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-500" />
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Ticket en Curso ({posCart.reduce((acc, i) => acc + i.qty, 0)})
              </h2>
            </div>
            {posCart.length > 0 && (
              <button
                type="button"
                onClick={() => setPosCart([])}
                className="text-[11px] font-bold text-rose-500 hover:text-rose-600 transition cursor-pointer"
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
                Ticket vacío. Selecciona artículos del catálogo o pulsa en "Asignar Reserva / Pago".
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
                      {meta?.bookingId
                        ? 'Reserva vinculada'
                        : meta?.isWalletTopup
                        ? 'Recarga de Monedero'
                        : product.category}{' '}
                      · {product.price.toFixed(2)} €/ud.
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                      <button
                        type="button"
                        onClick={() => updateQty(product.id, -1)}
                        className="px-2 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono font-bold text-xs">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(product.id, 1)}
                        className="px-2 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-xs w-14 text-right">
                      {(product.price * qty).toFixed(2)} €
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selector (Filtered by Club Settings) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Método de Cobro (Activos en Club):
            </span>
            <div className={`grid ${availablePaymentMethods.length <= 2 ? 'grid-cols-2' : availablePaymentMethods.length <= 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'} gap-2`}>
              {availablePaymentMethods.map((m) => {
                const IconComponent = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === m.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cart Total & Action */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Total a Cobrar:</span>
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {cartTotal.toFixed(2)} €
              </span>
            </div>

            <button
              type="button"
              onClick={handleChargeSale}
              disabled={posCart.length === 0}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Cobrar e Imprimir Ticket ({cartTotal.toFixed(2)} €)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================================
          2.5 MODAL: HISTORIAL Y LISTADO DE TRANSACCIONES DEL TURNO
          ====================================================================== */}
      {transactionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Transacciones y Tickets del Turno
                  </h3>
                  <p className="text-xs text-slate-500">
                    Registro de cobros emitidos en TPV de cafetería, reservas y recargas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Filtro de sede dentro del modal si es multi-sede */}
                {hasMultipleVenues && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border border-slate-200/80 dark:border-slate-700/80">
                    <Building2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <select
                      value={posVenueFilter}
                      onChange={(e) => setPosVenueFilter(e.target.value)}
                      className="bg-transparent text-slate-900 dark:text-white font-bold outline-hidden cursor-pointer"
                    >
                      <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Todas las sedes</option>
                      {venues.map((v) => (
                        <option key={v.id} value={v.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setTransactionsModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Listado de Transacciones */}
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No hay transacciones registradas para la sede seleccionada en este turno.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredTransactions.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-500 text-[11px]">{tx.time}</span>
                        <span className="font-bold text-slate-900 dark:text-white truncate">{tx.concept}</span>
                        {hasMultipleVenues && tx.venueName && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {tx.venueName}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>{tx.customerName || 'Cliente Mostrador'}</span>
                        <span>·</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">{tx.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                        +{tx.amount.toFixed(2)} €
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">OK / Cobrado</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">
                Total Transacciones Mostradas ({filteredTransactions.length}):
              </span>
              <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                {filteredTransactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          3. MODAL: CIERRE / ARQUEO DE CAJA DEL TURNO
          ====================================================================== */}
      {arqueoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Cierre y Arqueo de Caja
                  </h3>
                  <p className="text-xs text-slate-500">
                    Resumen consolidado del turno actual en {currentTenant.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setArqueoModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total general del turno */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Recaudado en Turno
                </span>
                <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {sessionSalesTotal.toFixed(2)} €
                </div>
              </div>
              <div className="text-right text-xs space-y-0.5">
                <div className="text-slate-500">Fecha: {new Date().toLocaleDateString('es-ES')}</div>
                <div className="font-mono text-emerald-600 font-bold">Turno Abierto: 08:30</div>
              </div>
            </div>

            {/* Desglose por Método de Pago */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Desglose por Método de Pago
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                      <CreditCard className="w-3.5 h-3.5 text-blue-500" /> TPV / Tarjeta
                    </span>
                  </div>
                  <div className="text-lg font-mono font-black text-slate-900 dark:text-white">
                    {(sessionSalesTotal * 0.58).toFixed(2)} €
                  </div>
                  <div className="text-[10px] text-slate-400">58% de las operaciones</div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                      <Banknote className="w-3.5 h-3.5 text-emerald-500" /> Efectivo
                    </span>
                  </div>
                  <div className="text-lg font-mono font-black text-slate-900 dark:text-white">
                    {(sessionSalesTotal * 0.28).toFixed(2)} €
                  </div>
                  <div className="text-[10px] text-slate-400">Cajón portamonedas</div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                      <Wallet className="w-3.5 h-3.5 text-purple-500" /> Monedero
                    </span>
                  </div>
                  <div className="text-lg font-mono font-black text-slate-900 dark:text-white">
                    {(sessionSalesTotal * 0.14).toFixed(2)} €
                  </div>
                  <div className="text-[10px] text-slate-400">Saldo de socios</div>
                </div>
              </div>
            </div>

            {/* Métricas por Categoría */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Ventas por Categoría
              </h4>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Bebidas & Snacks</span>
                  <span className="font-mono font-bold">{(sessionSalesTotal * 0.32).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Cafetería & Desayunos</span>
                  <span className="font-mono font-bold">{(sessionSalesTotal * 0.16).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Reservas de Pistas Cobradas</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {(sessionSalesTotal * 0.38).toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Recargas de Saldo y Material</span>
                  <span className="font-mono font-bold">{(sessionSalesTotal * 0.14).toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Acciones de Impresión y Exportación */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportArqueoCSV}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Exportar CSV/PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintThermalArqueo}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-500" />
                  <span>Imprimir Ticket (80mm)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSessionSalesTotal(0);
                  setArqueoModalOpen(false);
                  triggerDemoToast('Caja Cerrada', 'El turno ha sido cerrado y el contador de caja reiniciado a 0.00 €.', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Cerrar Turno Oficial</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          4. MODAL: GESTIÓN DE CATÁLOGO DE PRODUCTOS (CRUD)
          ====================================================================== */}
      {catalogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-500" />
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Catálogo de Productos y Existencias TPV
                  </h3>
                  <p className="text-xs text-slate-500">
                    Administra productos, precios, stock y fotos de cafetería
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openNewProductModal}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo Producto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCatalogModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Listado de Productos */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {cafeProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs hover:border-emerald-500/50 transition cursor-pointer"
                  onClick={() => setSelectedProductDetail(p)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.imageUrl || getFallbackProductImage(p.category)}
                      alt={p.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getFallbackProductImage(p.category);
                      }}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-200 dark:bg-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {p.category} · Stock: <strong className="font-mono text-slate-700 dark:text-slate-300">{p.stock} uds</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white mr-1">
                      {p.price.toFixed(2)} €
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedProductDetail(p)}
                      className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition cursor-pointer"
                      title="Ver detalle del producto"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditProductModal(p)}
                      className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white transition cursor-pointer"
                      title="Editar producto"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setProductToDelete(p)}
                      className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-rose-500 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR PRODUCTO */}
      {productFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingProduct ? 'Editar Producto TPV' : 'Nuevo Producto TPV'}
              </h3>
              <button
                type="button"
                onClick={() => setProductFormModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  placeholder="Ej: Zumo de Naranja Natural"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Bebidas">Bebidas</option>
                    <option value="Café">Café</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Bocadillos">Bocadillos</option>
                    <option value="Grip/Pelotas">Grip/Pelotas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Precio (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Stock Inicial (uds)</label>
                <input
                  type="number"
                  value={productFormData.stock}
                  onChange={(e) => setProductFormData({ ...productFormData, stock: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Imagen del Producto (URL, Archivo Local o Preset)
                </label>
                {productFormData.imageUrl && (
                  <div className="relative mb-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 h-28 flex items-center justify-center">
                    <img
                      src={productFormData.imageUrl}
                      alt="Vista previa"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getFallbackProductImage(productFormData.category);
                      }}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setProductFormData({ ...productFormData, imageUrl: '' })}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 text-white hover:bg-black transition text-xs cursor-pointer"
                      title="Eliminar imagen"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Presets de imágenes de catálogo oficiales */}
                <div className="mb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Presets de imagen oficiales:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_PRODUCT_IMAGES.map((imgItem) => (
                      <button
                        key={imgItem.label}
                        type="button"
                        onClick={() => setProductFormData({ ...productFormData, imageUrl: imgItem.url })}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                          productFormData.imageUrl === imgItem.url
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        {imgItem.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={productFormData.imageUrl}
                    onChange={(e) => setProductFormData({ ...productFormData, imageUrl: e.target.value })}
                    placeholder="URL imagen (https://...)"
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer flex items-center gap-1 shrink-0 transition text-xs border border-slate-200/80 dark:border-slate-700/80">
                    <Upload className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Subir</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) {
                              setProductFormData({ ...productFormData, imageUrl: String(evt.target.result) });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs cursor-pointer active:scale-95"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: PÁGINA DE DETALLE COMPLETO DE PRODUCTO (Requisito Bloque 2)
          ====================================================================== */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {selectedProductDetail.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ID: #{selectedProductDetail.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProductDetail(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Foto del Producto con Fallback Robusto */}
            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <img
                src={selectedProductDetail.imageUrl || getFallbackProductImage(selectedProductDetail.category)}
                alt={selectedProductDetail.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackProductImage(selectedProductDetail.category);
                }}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-xs text-xs font-mono font-black text-white">
                {selectedProductDetail.price.toFixed(2)} €
              </span>
              <span className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                Stock: {selectedProductDetail.stock} unidades
              </span>
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {selectedProductDetail.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Producto registrado en el TPV y catálogo oficial de {currentTenant.name}.
              </p>
            </div>

            {/* Ficha de datos y métricas */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Precio Venta</span>
                <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {selectedProductDetail.price.toFixed(2)} €
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Existencias</span>
                <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                  {selectedProductDetail.stock} uds
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Estado</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedProductDetail.active !== false ? 'Activo en Caja' : 'Inactivo'}
                </span>
              </div>
            </div>

            {/* Acciones principales: Editar todos los campos o Eliminar con confirmación */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const target = selectedProductDetail;
                  setSelectedProductDetail(null);
                  setProductToDelete(target);
                }}
                className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t('shop.deleteProduct', 'Eliminar Producto')}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductDetail(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const prod = selectedProductDetail;
                    setSelectedProductDetail(null);
                    openEditProductModal(prod);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar Todos los Campos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: CONFIRMACIÓN PREVIA PARA ELIMINAR PRODUCTO (Requisito Bloque 2)
          ====================================================================== */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {t('shop.deleteConfirmTitle', '¿Eliminar este producto?')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(
                  'shop.deleteConfirmDesc',
                  'Esta acción retirará el artículo del catálogo del TPV y de la tienda online de forma permanente.'
                )}
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mt-2 font-bold text-xs text-slate-800 dark:text-slate-200">
                "{productToDelete.name}" · {productToDelete.price.toFixed(2)} €
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCafeProduct(productToDelete.id);
                  triggerDemoToast(
                    'Producto Eliminado',
                    `"${productToDelete.name}" ha sido retirado del catálogo.`,
                    'info'
                  );
                  setProductToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
              >
                {t('shop.btnConfirmDelete', 'Sí, eliminar producto')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          5. MODAL: ASIGNAR RESERVA O RECARGA DE MONEDERO
          ====================================================================== */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Cobro de Reserva o Recarga de Socio
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

            {/* Pestañas: Reservas vs Monedero */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setAssignTab('bookings')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  assignTab === 'bookings'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                1. Reservas de Hoy / Pendientes ({filteredBookings.length})
              </button>
              <button
                type="button"
                onClick={() => setAssignTab('wallet')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  assignTab === 'wallet'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                2. Recargar Saldo Socio
              </button>
            </div>

            {/* TAB 1: RESERVAS */}
            {assignTab === 'bookings' && (
              <div className="space-y-3 text-xs">
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

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {filteredBookings.map((b) => {
                    const startH = b.startTime.split('T')[1]?.slice(0, 5) || '';
                    return (
                      <div
                        key={b.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white text-xs">
                              {b.courtName} ({startH})
                            </span>
                            <div className="text-[11px] text-slate-500">Titular: {b.creatorName}</div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAssignFullBooking(b)}
                            className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                          >
                            Pagar Pista Completa ({b.totalPrice.toFixed(2)} €)
                          </button>
                        </div>

                        {b.participants && b.participants.length > 0 && (
                          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              O cobrar cuota individual (1/4):
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {b.participants.map((p, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleAssignParticipant(b, p)}
                                  className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left text-[11px] transition flex items-center justify-between"
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
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
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
                          className={`px-3 py-1.5 rounded-xl font-mono font-bold text-xs transition cursor-pointer ${
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
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
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

      {/* TICKET TÉRMICO OCULTO EN PANTALLA, VISIBLE EN IMPRESIÓN (80MM / 58MM) */}
      <div className="hidden thermal-ticket-print">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0' }}>{currentTenant.name.toUpperCase()}</h2>
          <p style={{ margin: '2px 0' }}>CIF: B-15984210 · TPV MOSTRADOR</p>
          <p style={{ margin: '2px 0' }}>{currentTenant.address || 'Polígono San Mateo, Narón'}</p>
          <p style={{ margin: '2px 0' }}>CIERRE / ARQUEO DE CAJA</p>
          <hr style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />
        </div>

        <div style={{ fontSize: '11px', marginBottom: '6px' }}>
          <div>FECHA: {new Date().toLocaleDateString('es-ES')} {new Date().toLocaleTimeString('es-ES')}</div>
          <div>ESTADO: TURNO CERRADO</div>
          <hr style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />
        </div>

        <div style={{ fontSize: '11px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
            <span>Ventas TPV / Tarjeta:</span>
            <span>{(sessionSalesTotal * 0.58).toFixed(2)} €</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
            <span>Ventas Efectivo:</span>
            <span>{(sessionSalesTotal * 0.28).toFixed(2)} €</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
            <span>Cobros Monedero Club:</span>
            <span>{(sessionSalesTotal * 0.14).toFixed(2)} €</span>
          </div>
          <hr style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13px', margin: '5px 0' }}>
            <span>TOTAL TURNO:</span>
            <span>{sessionSalesTotal.toFixed(2)} €</span>
          </div>
          <hr style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />
        </div>

        <div style={{ textAlign: 'center', fontSize: '10px', marginTop: '10px' }}>
          <p>Documento justificativo de arqueo interno</p>
          <p>SETMIO PADEL PRO — Sistema de Gestión Deportiva</p>
        </div>
      </div>
    </div>
  );
};

export default AdminCafePOS;
