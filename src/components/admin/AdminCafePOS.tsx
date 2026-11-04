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
  ChevronDown,
  Sliders,
  Share2,
  ArrowLeft,
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
  date?: string;
  shift?: string;
  concept: string;
  amount: number;
  paymentMethod: string;
  venueId?: string;
  venueName?: string;
  customerName?: string;
  cashierName?: string;
  items?: Array<{ name: string; qty: number; unitPrice: number; category?: string }>;
}
 
export const formatVenueDisplayName = (name?: string, venueId?: string): string => {
  if (venueId === 'venue-san-mateo') return 'Narón';
  if (venueId === 'venue-coruna') return 'A Coruña';
  if (venueId === 'venue-santiago') return 'Santiago';
  if (venueId === 'venue-vigo') return 'Vigo';
  if (!name) return 'Narón';
  let clean = name.replace(/\(Vista Consolidada\)/gi, '').replace(/Vista Consolidada/gi, '');
  clean = clean.replace(/Sede Central\s*·\s*/gi, '').replace(/Sede\s+/gi, '').trim();
  if (clean.includes('San Mateo') || clean.includes('Narón')) return 'Narón';
  if (clean.includes('Matogrande') || clean.includes('Coruña')) return 'A Coruña';
  if (clean.includes('Santiago') || clean.includes('Compostela')) return 'Santiago';
  if (clean.includes('Vigo')) return 'Vigo';
  return clean || 'Narón';
};

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
    selectedVenueId,
    selectedVenue,
    setSelectedVenueId,
    isConsolidatedView,
    isClubOpen,
    toggleClubOpenState,
    currentUser,
    t,
  } = useApp();

  const [isVenueSelectorOpen, setIsVenueSelectorOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [posCart, setPosCart] = useState<{ product: CafeProduct; qty: number; meta?: LinkedChargeMeta }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [sessionSalesTotalOverride, setSessionSalesTotalOverride] = useState<number | null>(null);

  const configuredMethods = currentTenant.settings?.paymentMethods;
  const availablePaymentMethods = useMemo(() => {
    const list: Array<{ id: string; label: string; icon: any }> = [];

    // 1. Efectivo
    if (configuredMethods ? configuredMethods.cash !== false : true) {
      list.push({ id: 'cash', label: 'Efectivo', icon: Banknote });
    }
    // 2. Datáfono
    if (configuredMethods ? configuredMethods.manualPos !== false : true) {
      list.push({ id: 'card', label: 'Datáfono', icon: CreditCard });
    }
    // 3. Terminal Stripe
    if (configuredMethods ? configuredMethods.stripeTerminal !== false : true) {
      list.push({ id: 'stripe_terminal', label: 'Terminal', icon: CreditCard });
    }
    // 4. Cobro App
    if (configuredMethods ? configuredMethods.pushCharge !== false : true) {
      list.push({ id: 'push_charge', label: 'Cobro App', icon: Smartphone });
    }
    // 5. Monedero
    if (configuredMethods ? configuredMethods.wallet !== false : true) {
      list.push({ id: 'member_wallet', label: 'Monedero', icon: Wallet });
    }

    if (list.length === 0) {
      list.push({ id: 'cash', label: 'Efectivo', icon: Banknote });
    }
    return list;
  }, [configuredMethods]);

  useEffect(() => {
    if (availablePaymentMethods.length > 0 && !availablePaymentMethods.some((m) => m.id === paymentMethod)) {
      setPaymentMethod(availablePaymentMethods[0].id);
    }
  }, [availablePaymentMethods, paymentMethod]);

  const hasMultipleVenues = Boolean(isMultiVenue) && Array.isArray(venues) && venues.length > 1;
  const [posVenueFilter, setPosVenueFilter] = useState<string>('all');

  // Navegación Nivel 2: Gestión Integral de Catálogo e Inventario
  const [isCatalogManagementOpen, setIsCatalogManagementOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('all');
  const [catalogVenueFilter, setCatalogVenueFilter] = useState('all');

  // Modal Nivel 3: Pagos Consolidados (Historial Global de Todos los Turnos y Recepcionistas)
  const [transactionsModalOpen, setTransactionsModalOpen] = useState(false);
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState<POSTransactionItem | null>(null);

  // Filtros Avanzados para Pagos Globales
  const [paymentShiftFilter, setPaymentShiftFilter] = useState<string>('all');
  const [paymentCashierFilter, setPaymentCashierFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [paymentSearch, setPaymentSearch] = useState<string>('');

  const [posTransactions, setPosTransactions] = useState<POSTransactionItem[]>([
    // === SEDE NARÓN (venue-san-mateo) ===
    {
      id: 'TX-101',
      time: '09:15',
      date: 'Hoy',
      shift: 'Turno Mañana',
      concept: '2x Agua Mineral + 1x Café Espresso',
      amount: 5.5,
      paymentMethod: 'Tarjeta',
      venueId: 'venue-san-mateo',
      venueName: 'Narón',
      customerName: 'Carlos Méndez',
      cashierName: 'Marcos Soto (Recepción)',
      items: [
        { name: 'Agua Mineral 50cl', qty: 2, unitPrice: 1.5, category: 'Bebidas' },
        { name: 'Café Espresso', qty: 1, unitPrice: 2.5, category: 'Café' },
      ],
    },
    {
      id: 'TX-102',
      time: '10:00',
      date: 'Hoy',
      shift: 'Turno Mañana',
      concept: 'Reserva Pista 2 (10:00) — Cuota 1/4',
      amount: 7.0,
      paymentMethod: 'Efectivo',
      venueId: 'venue-san-mateo',
      venueName: 'Narón',
      customerName: 'Diego Soto',
      cashierName: 'Laura Senra (Mostrador)',
      items: [
        { name: 'Reserva Pista 2 (10:00) — Cuota 1/4', qty: 1, unitPrice: 7.0, category: 'Reserva Pista' },
      ],
    },
    {
      id: 'TX-104',
      time: '12:45',
      date: 'Hoy',
      shift: 'Turno Mañana',
      concept: 'Recarga Monedero Socio (#SM-390)',
      amount: 50.0,
      paymentMethod: 'Tarjeta',
      venueId: 'venue-san-mateo',
      venueName: 'Narón',
      customerName: 'Elena Permuy',
      cashierName: 'Marcos Soto (Recepción)',
      items: [
        { name: 'Recarga Monedero Club (#SM-390)', qty: 1, unitPrice: 50.0, category: 'Monedero' },
      ],
    },
    {
      id: 'TX-105',
      time: '13:10',
      date: 'Hoy',
      shift: 'Turno Mañana',
      concept: '1x Overgrip Wilson + 1x Agua 1.5L',
      amount: 4.5,
      paymentMethod: 'Bizum / Online',
      venueId: 'venue-san-mateo',
      venueName: 'Narón',
      customerName: 'Javier Fraga',
      cashierName: 'Laura Senra (Mostrador)',
      items: [
        { name: 'Overgrip Wilson Pro', qty: 1, unitPrice: 2.5, category: 'Grip/Pelotas' },
        { name: 'Agua Mineral 1.5L', qty: 1, unitPrice: 2.0, category: 'Bebidas' },
      ],
    },
    {
      id: 'TX-106',
      time: '13:30',
      date: 'Hoy',
      shift: 'Turno Mañana',
      concept: 'Reserva Pista 1 (12:30) — Cuota 1/4',
      amount: 7.0,
      paymentMethod: 'Efectivo',
      venueId: 'venue-san-mateo',
      venueName: 'Narón',
      customerName: 'Manuel Piñeiro',
      cashierName: 'Marcos Soto (Recepción)',
      items: [
        { name: 'Reserva Pista 1 (12:30) — Cuota 1/4', qty: 1, unitPrice: 7.0, category: 'Reserva Pista' },
      ],
    },

    // === SEDE A CORUÑA (venue-coruna) ===
    {
      id: 'TX-201',
      time: '11:20',
      date: 'Hoy',
      shift: 'Turno Mañana',
      concept: 'Bote Bolas Head Pro S + 2x Powerade',
      amount: 12.0,
      paymentMethod: 'Monedero Socio',
      venueId: 'venue-coruna',
      venueName: 'A Coruña',
      customerName: 'Ana Belén Vázquez',
      cashierName: 'Carlos M. (Entrenador)',
      items: [
        { name: 'Bote Bolas Head Pro S', qty: 1, unitPrice: 6.0, category: 'Grip/Pelotas' },
        { name: 'Isotónico Powerade', qty: 2, unitPrice: 3.0, category: 'Bebidas' },
      ],
    },
    {
      id: 'TX-202',
      time: '12:15',
      date: 'Hoy',
      shift: 'Turno Mañana',
      concept: 'Reserva Pista Panorámica 1 — Completa (4/4)',
      amount: 28.0,
      paymentMethod: 'Tarjeta',
      venueId: 'venue-coruna',
      venueName: 'A Coruña',
      customerName: 'Roberto Paz',
      cashierName: 'Iria Varela (Recepción)',
      items: [
        { name: 'Reserva Pista Panorámica 1 — Completa', qty: 1, unitPrice: 28.0, category: 'Reserva Pista' },
      ],
    },
    {
      id: 'TX-203',
      time: '13:00',
      date: 'Hoy',
      shift: 'Turno Mañana',
      concept: '2x Estrella Galicia + 1x Tosta Jamón',
      amount: 9.5,
      paymentMethod: 'Efectivo',
      venueId: 'venue-coruna',
      venueName: 'A Coruña',
      customerName: 'Marcos Rúa',
      cashierName: 'Carlos M. (Entrenador)',
      items: [
        { name: 'Estrella Galicia Especial', qty: 2, unitPrice: 2.5, category: 'Bebidas' },
        { name: 'Tosta Jamón Ibérico', qty: 1, unitPrice: 4.5, category: 'Snacks' },
      ],
    },
    {
      id: 'TX-204',
      time: '13:45',
      date: 'Hoy',
      shift: 'Turno Mañana',
      concept: '3x Protector Pala Bullpadel Custom',
      amount: 8.5,
      paymentMethod: 'Tarjeta',
      venueId: 'venue-coruna',
      venueName: 'A Coruña',
      customerName: 'Sandra Loureiro',
      cashierName: 'Iria Varela (Recepción)',
      items: [
        { name: 'Protector Pala Bullpadel', qty: 3, unitPrice: 2.83, category: 'Grip/Pelotas' },
      ],
    },

    // === SEDE SANTIAGO (venue-santiago) ===
    {
      id: 'TX-301',
      time: '09:40',
      date: 'Hoy',
      shift: 'Turno Mañana',
      concept: 'Menú Desayuno Pádel (Café + Zumo + Tostada)',
      amount: 6.5,
      paymentMethod: 'Efectivo',
      venueId: 'venue-santiago',
      venueName: 'Santiago',
      customerName: 'Antón Ramos',
      cashierName: 'Nuria Pose (Recepción)',
      items: [
        { name: 'Café con Leche', qty: 1, unitPrice: 1.8, category: 'Café' },
        { name: 'Zumo de Naranja Natural', qty: 1, unitPrice: 2.5, category: 'Bebidas' },
        { name: 'Tostada con Tomate y AOVE', qty: 1, unitPrice: 2.2, category: 'Snacks' },
      ],
    },
    {
      id: 'TX-302',
      time: '11:00',
      date: 'Hoy',
      shift: 'Turno Mañana',
      concept: 'Clase Particular con Entrenador (60 min)',
      amount: 35.0,
      paymentMethod: 'Monedero Socio',
      venueId: 'venue-santiago',
      venueName: 'Santiago',
      customerName: 'Laura Senra',
      cashierName: 'Javier Conde (Coach)',
      items: [
        { name: 'Clase Particular Pádel 60 min', qty: 1, unitPrice: 35.0, category: 'Clase' },
      ],
    },
    {
      id: 'TX-303',
      time: '12:30',
      date: 'Hoy',
      shift: 'Turno Mañana',
      concept: '1x Agua Mineral 50cl + 1x Barrita Proteica',
      amount: 3.5,
      paymentMethod: 'Tarjeta',
      venueId: 'venue-santiago',
      venueName: 'Santiago',
      customerName: 'David Castro',
      cashierName: 'Nuria Pose (Recepción)',
      items: [
        { name: 'Agua Mineral 50cl', qty: 1, unitPrice: 1.5, category: 'Bebidas' },
        { name: 'Barrita Proteica Powerbar', qty: 1, unitPrice: 2.0, category: 'Snacks' },
      ],
    },

    // === HISTÓRICOS / TURNOS ANTERIORES ===
    {
      id: 'TX-098',
      time: '18:40',
      date: 'Ayer',
      shift: 'Turno Tarde',
      concept: 'Reserva Pista 1 (18:30) — Pago Total (4/4)',
      amount: 28.0,
      paymentMethod: 'Tarjeta',
      venueId: 'venue-san-mateo',
      venueName: 'Narón',
      customerName: 'Pablo Vello',
      cashierName: 'Laura Senra (Mostrador)',
      items: [
        { name: 'Reserva Pista 1 (18:30) — Completa', qty: 1, unitPrice: 28.0, category: 'Reserva Pista' },
      ],
    },
    {
      id: 'TX-097',
      time: '19:15',
      date: 'Ayer',
      shift: 'Turno Tarde',
      concept: '2x Estrella Galicia 0,0 + 1x Patatas Artesanas',
      amount: 6.5,
      paymentMethod: 'Efectivo',
      venueId: 'venue-san-mateo',
      venueName: 'Narón',
      customerName: 'Marcos Soto',
      cashierName: 'Carlos M. (Entrenador)',
      items: [
        { name: 'Estrella Galicia 0,0', qty: 2, unitPrice: 2.25, category: 'Bebidas' },
        { name: 'Patatas Fritas Artesanas', qty: 1, unitPrice: 2.0, category: 'Snacks' },
      ],
    },
    {
      id: 'TX-096',
      time: '20:30',
      date: 'Ayer',
      shift: 'Turno Noche',
      concept: 'Clase Particular Pádel 60 min (Bono)',
      amount: 35.0,
      paymentMethod: 'Monedero Socio',
      venueId: 'venue-coruna',
      venueName: 'A Coruña',
      customerName: 'Laura Senra',
      cashierName: 'Mateo Varela (Admin)',
      items: [
        { name: 'Clase Particular 60 min', qty: 1, unitPrice: 35.0, category: 'Clase' },
      ],
    },
    {
      id: 'TX-095',
      time: '11:05',
      date: '28 Sep',
      shift: 'Turno Mañana',
      concept: '2x Bote Head Pro S + 1x Grip Perforado',
      amount: 15.0,
      paymentMethod: 'Tarjeta',
      venueId: 'venue-san-mateo',
      venueName: 'Narón',
      customerName: 'David Castro',
      cashierName: 'Marcos Soto (Recepción)',
      items: [
        { name: 'Bote Bolas Head Pro S', qty: 2, unitPrice: 6.0, category: 'Grip/Pelotas' },
        { name: 'Grip Perforado', qty: 1, unitPrice: 3.0, category: 'Grip/Pelotas' },
      ],
    },
    {
      id: 'TX-094',
      time: '21:15',
      date: '28 Sep',
      shift: 'Turno Noche',
      concept: 'Reserva Pista 4 (21:30) — Cuota 1/4',
      amount: 7.5,
      paymentMethod: 'Bizum / Online',
      venueId: 'venue-santiago',
      venueName: 'Santiago',
      customerName: 'Lucas Piñeiro',
      cashierName: 'Mateo Varela (Admin)',
      items: [
        { name: 'Reserva Pista 4 (21:30) — Cuota 1/4', qty: 1, unitPrice: 7.5, category: 'Reserva Pista' },
      ],
    },
  ]);

  // Transacciones dinámicas filtradas en tiempo real según la sede seleccionada en la cabecera
  const activeShiftTransactions = useMemo(() => {
    if (selectedVenueId && selectedVenueId !== 'all') {
      return posTransactions.filter((tx) => tx.venueId === selectedVenueId);
    }
    return posTransactions;
  }, [posTransactions, selectedVenueId]);

  const activeShiftSalesTotal = useMemo(() => {
    const todayTxs = activeShiftTransactions.filter((tx) => tx.date === 'Hoy' || !tx.date);
    return todayTxs.reduce((sum, tx) => sum + tx.amount, 0);
  }, [activeShiftTransactions]);

  const sessionSalesTotal = sessionSalesTotalOverride !== null ? sessionSalesTotalOverride : activeShiftSalesTotal;
  const setSessionSalesTotal = (val: number | ((prev: number) => number)) => {
    if (typeof val === 'function') {
      setSessionSalesTotalOverride((prev) => val(prev !== null ? prev : activeShiftSalesTotal));
    } else {
      setSessionSalesTotalOverride(val);
    }
  };

  useEffect(() => {
    setSessionSalesTotalOverride(null);
  }, [selectedVenueId]);

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
  const [arqueoVenueFilter, setArqueoVenueFilter] = useState<string>(selectedVenueId || 'all');
  const [isArqueoVenueSelectorOpen, setIsArqueoVenueSelectorOpen] = useState(false);

  useEffect(() => {
    if (selectedVenueId) {
      setArqueoVenueFilter(selectedVenueId);
    }
  }, [selectedVenueId]);

  const arqueoTransactions = useMemo(() => {
    return posTransactions.filter((tx) => {
      const isToday = tx.date === 'Hoy' || !tx.date;
      if (!isToday) return false;
      if (arqueoVenueFilter !== 'all') {
        return tx.venueId === arqueoVenueFilter;
      }
      return true;
    });
  }, [posTransactions, arqueoVenueFilter]);

  const arqueoSalesTotal = useMemo(() => {
    if (sessionSalesTotalOverride === 0 && (arqueoVenueFilter === selectedVenueId || arqueoVenueFilter === 'all')) {
      return 0;
    }
    return arqueoTransactions.reduce((acc, t) => acc + t.amount, 0);
  }, [arqueoTransactions, sessionSalesTotalOverride, arqueoVenueFilter, selectedVenueId]);

  const arqueoCardTotal = useMemo(() => {
    return arqueoTransactions
      .filter((t) => t.paymentMethod.toLowerCase().includes('tarjeta') || t.paymentMethod.toLowerCase().includes('terminal'))
      .reduce((a, b) => a + b.amount, 0);
  }, [arqueoTransactions]);

  const arqueoCashTotal = useMemo(() => {
    return arqueoTransactions
      .filter((t) => t.paymentMethod.toLowerCase().includes('efectivo'))
      .reduce((a, b) => a + b.amount, 0);
  }, [arqueoTransactions]);

  const arqueoWalletTotal = useMemo(() => {
    return arqueoTransactions
      .filter((t) => !t.paymentMethod.toLowerCase().includes('tarjeta') && !t.paymentMethod.toLowerCase().includes('terminal') && !t.paymentMethod.toLowerCase().includes('efectivo'))
      .reduce((a, b) => a + b.amount, 0);
  }, [arqueoTransactions]);

  // Modal: Gestión de Catálogo de Productos
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [productFormModalOpen, setProductFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CafeProduct | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<CafeProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<CafeProduct | null>(null);
  const [showInlineNewCategory, setShowInlineNewCategory] = useState(false);
  const [inlineCategoryName, setInlineCategoryName] = useState('');

  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'Bebidas',
    price: 2.0,
    stock: 50,
    imageUrl: '',
    venueId: '',
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

  // Prevenir scroll global cuando cualquier modal está abierto
  useEffect(() => {
    const isAnyModalOpen =
      transactionsModalOpen ||
      Boolean(selectedPaymentDetail) ||
      arqueoModalOpen ||
      catalogModalOpen ||
      productFormModalOpen ||
      assignModalOpen ||
      Boolean(selectedProductDetail) ||
      Boolean(productToDelete);

    if (isAnyModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [
    transactionsModalOpen,
    selectedPaymentDetail,
    arqueoModalOpen,
    catalogModalOpen,
    productFormModalOpen,
    assignModalOpen,
    selectedProductDetail,
    productToDelete,
  ]);

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

  // Product categories management
  const [customCategories, setCustomCategories] = useState<string[]>([
    'Bebidas',
    'Café',
    'Snacks',
    'Bocadillos',
    'Grip/Pelotas',
  ]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryOld, setEditingCategoryOld] = useState<string | null>(null);
  const [editingCategoryNew, setEditingCategoryNew] = useState('');

  // Estado para añadir producto ágil desde una categoría específica
  const [addingProductToCat, setAddingProductToCat] = useState<string | null>(null);
  const [catProductForm, setCatProductForm] = useState({
    name: '',
    price: 2.5,
    stock: 50,
    imageUrl: '',
  });

  const categories = useMemo(() => ['all', ...customCategories], [customCategories]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newCategoryName.trim();
    if (!clean) return;
    if (customCategories.some((c) => c.toLowerCase() === clean.toLowerCase())) {
      triggerDemoToast('Aviso', 'Esta categoría ya existe.', 'warning');
      return;
    }
    setCustomCategories((prev) => [...prev, clean]);
    setNewCategoryName('');
    triggerDemoToast('Categoría Creada', `Categoría "${clean}" añadida con éxito.`, 'success');
  };

  const handleCreateInlineCategory = () => {
    const clean = inlineCategoryName.trim();
    if (!clean) return;
    if (customCategories.some((c) => c.toLowerCase() === clean.toLowerCase())) {
      triggerDemoToast('Aviso', 'Esta categoría ya existe.', 'warning');
      setProductFormData((prev) => ({ ...prev, category: clean }));
      setShowInlineNewCategory(false);
      setInlineCategoryName('');
      return;
    }
    setCustomCategories((prev) => [...prev, clean]);
    setProductFormData((prev) => ({ ...prev, category: clean }));
    setShowInlineNewCategory(false);
    setInlineCategoryName('');
    triggerDemoToast('Categoría Creada', `Categoría "${clean}" añadida y seleccionada.`, 'success');
  };

  const handleSaveEditCategory = (oldName: string) => {
    const clean = editingCategoryNew.trim();
    if (!clean || clean === oldName) {
      setEditingCategoryOld(null);
      return;
    }
    setCustomCategories((prev) => prev.map((c) => (c === oldName ? clean : c)));
    if (activeCategory === oldName) setActiveCategory(clean);
    setEditingCategoryOld(null);
    setEditingCategoryNew('');
    triggerDemoToast('Categoría Actualizada', `Renombrada a "${clean}".`, 'success');
  };

  const handleDeleteCategory = (catName: string) => {
    setCustomCategories((prev) => prev.filter((c) => c !== catName));
    if (activeCategory === catName) setActiveCategory('all');
    triggerDemoToast('Categoría Eliminada', `Categoría "${catName}" eliminada.`, 'success');
  };

  // Añadir producto rápido dentro de una categoría en su modal
  const handleAddProductToCategorySubmit = (e: React.FormEvent, catName: string) => {
    e.preventDefault();
    if (!catProductForm.name.trim()) {
      triggerDemoToast('Error', 'El nombre del producto es obligatorio.', 'warning');
      return;
    }

    addCafeProduct({
      name: catProductForm.name.trim(),
      category: catName,
      price: Number(catProductForm.price) || 2.0,
      stock: Number(catProductForm.stock) || 30,
      active: true,
      imageUrl: catProductForm.imageUrl || 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=400&q=80',
      tenantId: currentTenant.id,
    });

    triggerDemoToast('Producto Añadido', `"${catProductForm.name}" incorporado a la categoría ${catName}.`, 'success');
    setAddingProductToCat(null);
    setCatProductForm({ name: '', price: 2.5, stock: 50, imageUrl: '' });
  };

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
  const activePaymentMethodObj = availablePaymentMethods.find((m) => m.id === paymentMethod) || availablePaymentMethods[0];

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

    const chosenVenueId = (selectedVenueId && selectedVenueId !== 'all')
      ? selectedVenueId
      : (posVenueFilter !== 'all' ? posVenueFilter : 'venue-san-mateo');
    const chosenVenueName = formatVenueDisplayName(selectedVenue?.name, chosenVenueId);

    const methodLabel = availablePaymentMethods.find((m) => m.id === paymentMethod)?.label || 'TPV';

    const customerMeta =
      posCart.find((i) => i.meta?.memberName)?.meta?.memberName ||
      posCart.find((i) => i.meta?.participantName)?.meta?.participantName ||
      'Cliente Mostrador';

    const newTx: POSTransactionItem = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      date: 'Hoy',
      shift: 'Turno Mañana',
      concept: posCart.map((i) => `${i.qty}x ${i.product.name}`).join(', '),
      amount: cartTotal,
      paymentMethod: methodLabel,
      venueId: chosenVenueId,
      venueName: chosenVenueName,
      customerName: customerMeta,
      cashierName: currentUser?.name || 'Recepción Mostrador',
      items: posCart.map((i) => ({
        name: i.product.name,
        qty: i.qty,
        unitPrice: i.product.price,
        category: i.product.category,
      })),
    };

    setPosTransactions((prev) => [newTx, ...prev]);
    setSessionSalesTotal((prev) => prev + cartTotal);

    triggerDemoToast(
      'Venta Cobrada en TPV',
      `Ticket #${newTx.id} emitido por ${cartTotal.toFixed(2)} € pagado con ${methodLabel}.`,
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
    triggerDemoToast('Cuota Asignada a TPV', `Cuota de ${p.name} (${itemProd.price.toFixed(2)}€) añadida al ticket.`, 'success');
  };

  // Assign Wallet Top-up
  const handleAddWalletTopup = () => {
    if (!selectedWalletMember) return;
    const finalAmount = customWalletInput ? parseFloat(customWalletInput) : walletAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      triggerDemoToast('Importe no válido', 'Introduce un importe válido para la recarga.', 'warning');
      return;
    }

    const itemProd: CafeProduct = {
      id: `wallet-${selectedWalletMember.id}-${Date.now()}`,
      name: `Recarga Monedero Socio (${selectedWalletMember.name} - #${selectedWalletMember.memberNum})`,
      price: finalAmount,
      category: 'Monedero',
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
          isWalletTopup: true,
          memberId: selectedWalletMember.id,
          memberName: selectedWalletMember.name,
        },
      },
    ]);

    setAssignModalOpen(false);
    triggerDemoToast('Recarga Añadida al Ticket', `+${finalAmount.toFixed(2)} € para ${selectedWalletMember.name}.`, 'success');
  };

  // Print Thermal Arqueo Ticket
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
    const defaultVenueId = selectedVenueId !== 'all' ? selectedVenueId : (venues?.[0]?.id || 'v-1');
    setProductFormData({
      name: '',
      category: customCategories[0] || 'Bebidas',
      price: 2.5,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=400&q=80',
      venueId: defaultVenueId,
    });
    setShowInlineNewCategory(false);
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
      venueId: prod.venueId || (selectedVenueId !== 'all' ? selectedVenueId : (venues?.[0]?.id || 'v-1')),
    });
    setShowInlineNewCategory(false);
    setProductFormModalOpen(true);
  };

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name.trim()) {
      triggerDemoToast('Error', 'El nombre del producto es obligatorio.', 'warning');
      return;
    }

    const assignedVenue = venues.find((v) => v.id === productFormData.venueId);
    const venueName = assignedVenue?.name || selectedVenue?.name || 'Sede Central';

    if (editingProduct) {
      updateCafeProduct(editingProduct.id, {
        name: productFormData.name,
        category: productFormData.category,
        price: Number(productFormData.price),
        stock: Number(productFormData.stock),
        imageUrl: productFormData.imageUrl,
        venueId: productFormData.venueId,
        venueName,
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
        venueId: productFormData.venueId,
        venueName,
      });
      triggerDemoToast('Producto Añadido', `"${productFormData.name}" disponible en TPV.`, 'success');
    }

    setProductFormModalOpen(false);
  };

  // Helper: Conmutar producto destacado en mostrador TPV (destacadoEnTPV / isFeatured)
  const toggleProductFeatured = (prod: CafeProduct) => {
    const nextFeatured = prod.isFeatured === false;
    updateCafeProduct(prod.id, { isFeatured: nextFeatured });
    triggerDemoToast(
      nextFeatured ? 'Añadido a Destacados' : 'Retirado de Destacados',
      `"${prod.name}" ${nextFeatured ? 'ahora se muestra destacado' : 'se ha ocultado'} en el mostrador del TPV.`,
      'info'
    );
  };

  // Helper: Ajuste rápido de existencias de inventario
  const adjustStock = (prod: CafeProduct, delta: number) => {
    const newStock = Math.max(0, (prod.stock || 0) + delta);
    updateCafeProduct(prod.id, { stock: newStock });
    triggerDemoToast('Stock Actualizado', `Existencias de "${prod.name}": ${newStock} uds.`, 'success');
  };

  // Productos filtrados para la Vista Nivel 2 de Catálogo Completo e Inventario
  const filteredCatalogProducts = useMemo(() => {
    return cafeProducts.filter((p) => {
      const matchVenue =
        catalogVenueFilter === 'all' ||
        !p.venueId ||
        p.venueId === catalogVenueFilter;
      const matchCat = catalogCategoryFilter === 'all' || p.category === catalogCategoryFilter;
      const term = catalogSearch.toLowerCase().trim();
      const matchTerm = !term || p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
      return matchVenue && matchCat && matchTerm;
    });
  }, [cafeProducts, catalogCategoryFilter, catalogSearch, catalogVenueFilter]);

  // Pagos Consolidados Multi-Turno y Multi-Recepcionista con Filtros Avanzados
  const filteredGlobalPayments = useMemo(() => {
    return posTransactions.filter((tx) => {
      // 1. Filtro Sede
      if (posVenueFilter !== 'all') {
        if (tx.venueId && tx.venueId !== posVenueFilter) return false;
      }
      // 2. Filtro Cajero / Recepcionista
      if (paymentCashierFilter !== 'all') {
        if (!tx.cashierName?.toLowerCase().includes(paymentCashierFilter.toLowerCase())) return false;
      }
      // 3. Filtro Método de Pago
      if (paymentMethodFilter !== 'all') {
        if (!tx.paymentMethod?.toLowerCase().includes(paymentMethodFilter.toLowerCase())) return false;
      }
      // 4. Filtro Turno / Fecha
      if (paymentShiftFilter !== 'all') {
        if (paymentShiftFilter === 'today' && tx.date !== 'Hoy') return false;
        if (paymentShiftFilter === 'yesterday' && tx.date !== 'Ayer') return false;
        if (paymentShiftFilter === 'morning' && tx.shift !== 'Turno Mañana') return false;
        if (paymentShiftFilter === 'afternoon' && tx.shift !== 'Turno Tarde') return false;
        if (paymentShiftFilter === 'night' && tx.shift !== 'Turno Noche') return false;
      }
      // 5. Búsqueda de texto
      if (paymentSearch.trim()) {
        const q = paymentSearch.toLowerCase();
        const matchConcept = tx.concept.toLowerCase().includes(q);
        const matchCustomer = tx.customerName?.toLowerCase().includes(q);
        const matchId = tx.id.toLowerCase().includes(q);
        if (!matchConcept && !matchCustomer && !matchId) return false;
      }
      return true;
    });
  }, [posTransactions, posVenueFilter, paymentCashierFilter, paymentMethodFilter, paymentShiftFilter, paymentSearch]);

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
    <div className="max-w-7xl mx-auto pt-2 pb-16 space-y-4 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased">
      {/* ======================================================================
          1. CABECERA LIMPIA Y SIMÉTRICA (ESTILO INICIO, RESERVAS & PARTIDAS)
          (Oculta cuando se abre una subpágina de Nivel 2 para evitar sangrado inferior)
          ====================================================================== */}
      {!isCatalogManagementOpen && !transactionsModalOpen && (
        <section className="pt-2 pb-1 space-y-3" data-purpose="header-section">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tracking-wide block mb-0.5">
              {currentTenant?.name || 'Centro de Pádel San Mateo'}
            </span>
            <h1 className="text-[22px] font-extrabold text-[#0B1A2D] dark:text-white tracking-tight leading-tight">
              TPV / Caja
            </h1>
          </div>
        </div>

        {/* Pill de Sede y Estado Operativo Unificado */}
        <div className="relative">
          <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            {/* Selector de Sede */}
            <div
              onClick={() => setIsVenueSelectorOpen(!isVenueSelectorOpen)}
              className="flex items-center gap-2 cursor-pointer group select-none min-w-0"
              title="Cambiar sede activa o ver red consolidada"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-100 dark:border-[#1A314D] flex items-center justify-center text-[#0B1A2D] dark:text-slate-200 shrink-0">
                <Building2 className="w-4 h-4 text-[#0B1A2D] dark:text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#0B1A2D] dark:text-white truncate">
                    {isConsolidatedView ? 'Todas las Sedes' : selectedVenue.shortName || selectedVenue.name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B1A2D] dark:group-hover:text-white transition-transform ${
                      isVenueSelectorOpen ? 'rotate-180 text-[#0B1A2D] dark:text-white' : ''
                    }`}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-400 block truncate">
                  {venues.length > 1 ? `${venues.length} sedes conectadas` : 'Sede oficial'}
                </span>
              </div>
            </div>

            {/* Badge Dinámico de Apertura / Resumen Multisede */}
            <button
              type="button"
              onClick={isConsolidatedView ? () => setIsVenueSelectorOpen((prev) => !prev) : toggleClubOpenState}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0FCCF] dark:bg-[#B7F229]/20 border border-[#B7F229]/50 transition-all cursor-pointer hover:scale-102 shrink-0 select-none"
              title={
                isConsolidatedView
                  ? `Red multisede consolidada (${venues.length} sedes operativas)`
                  : 'Haz clic para conmutar estado de apertura de la sede'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConsolidatedView
                    ? 'bg-[#82b805] dark:bg-[#B7F229]'
                    : isClubOpen
                    ? 'bg-[#82b805] animate-pulse'
                    : 'bg-rose-500'
                }`}
              />
              <span className="text-[11px] font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                {isConsolidatedView
                  ? `${venues.length} Sedes Activas`
                  : isClubOpen
                  ? 'Abierto · hasta 23:30'
                  : 'Cerrado temporal'}
              </span>
            </button>
          </div>

          {/* Menú Desplegable de Sedes */}
          {isVenueSelectorOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-30 p-2 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200 dark:border-[#1A314D] shadow-xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1">
                Red Deportiva · Seleccionar Sede
              </div>

              {venues.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVenueId('all');
                    setPosVenueFilter('all');
                    setIsVenueSelectorOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    isConsolidatedView
                      ? 'bg-[#B7F229]/20 text-[#0B1A2D] dark:text-white'
                      : 'hover:bg-slate-50 dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Todas las Sedes</span>
                  </span>
                  {isConsolidatedView && <CheckCircle2 className="w-3.5 h-3.5 text-[#82b805]" />}
                </button>
              )}

              {venues
                .filter((v) => v.id !== 'all')
                .map((venue) => {
                  const isSelected = !isConsolidatedView && selectedVenueId === venue.id;
                  return (
                    <button
                      key={venue.id}
                      type="button"
                      onClick={() => {
                        setSelectedVenueId(venue.id);
                        setPosVenueFilter(venue.id);
                        setIsVenueSelectorOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                        isSelected
                          ? 'bg-[#B7F229]/20 text-[#0B1A2D] dark:text-white'
                          : 'hover:bg-slate-50 dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{venue.name}</span>
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#82b805] shrink-0" />}
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* Componente Superior de Resumen (Total Turno, Cobros, Ticket Medio, Estado) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Turno</span>
            <div className="my-0.5">
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-[#0B1A2D] dark:text-white tracking-tight">
                {sessionSalesTotal.toFixed(2)} €
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Facturación acumulada</span>
          </div>

          <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cobros Registrados</span>
            <div className="my-0.5 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-[#0B1A2D] dark:text-white tracking-tight">
                {activeShiftTransactions.filter((tx) => tx.date === 'Hoy' || !tx.date).length}
              </span>
              <span className="text-xs text-slate-400 font-medium">tickets</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">En sesión de caja</span>
          </div>

          <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ticket Medio</span>
            <div className="my-0.5">
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-[#0B1A2D] dark:text-white tracking-tight">
                {activeShiftTransactions.filter((tx) => tx.date === 'Hoy' || !tx.date).length > 0
                  ? (sessionSalesTotal / activeShiftTransactions.filter((tx) => tx.date === 'Hoy' || !tx.date).length).toFixed(2)
                  : '0.00'}{' '}
                €
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Promedio por venta</span>
          </div>

          <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estado Mostrador</span>
            <div className="my-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#82b805] animate-pulse"></span>
              <span className="text-sm font-bold text-[#0B1A2D] dark:text-white truncate">
                Caja Operativa
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium truncate">
              {isConsolidatedView ? 'Todas las Sedes' : selectedVenue.shortName || selectedVenue.name}
            </span>
          </div>
        </div>

        {/* Retícula Simétrica 2x2 de Acciones Principales */}
        <div className="grid grid-cols-2 gap-2.5 w-full pt-1">
          {/* 1. Asignar Reserva */}
          <button
            type="button"
            onClick={() => setAssignModalOpen(true)}
            className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-[#0E2239] hover:bg-slate-50 dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex items-center justify-start text-left gap-2.5 sm:gap-3 transition active:scale-95 cursor-pointer group"
            title="Asignar o vincular una reserva de pista"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#152e4d] flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 group-hover:text-[#0B1A2D] dark:group-hover:text-[#B7F229] transition-colors">
              <Calendar className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#0B1A2D] dark:text-white truncate">
              Asignar Reserva
            </span>
          </button>

          {/* 2. Pagos */}
          <button
            type="button"
            onClick={() => setTransactionsModalOpen(true)}
            className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-[#0E2239] hover:bg-slate-50 dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex items-center justify-start text-left gap-2.5 sm:gap-3 transition active:scale-95 cursor-pointer group"
            title="Ver pagos consolidados de todos los turnos y recepcionistas"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#152e4d] flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 group-hover:text-[#0B1A2D] dark:group-hover:text-[#B7F229] transition-colors">
              <Receipt className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#0B1A2D] dark:text-white truncate">
              Pagos
            </span>
            <span className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#152e4d] text-slate-600 dark:text-slate-300 font-bold shrink-0">
              {filteredGlobalPayments.length}
            </span>
          </button>

          {/* 3. Productos */}
          <button
            type="button"
            onClick={() => setIsCatalogManagementOpen(true)}
            className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-[#0E2239] hover:bg-slate-50 dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex items-center justify-start text-left gap-2.5 sm:gap-3 transition active:scale-95 cursor-pointer group"
            title="Gestión de catálogo, existencias y productos destacados en mostrador"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#152e4d] flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 group-hover:text-[#0B1A2D] dark:group-hover:text-[#B7F229] transition-colors">
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#0B1A2D] dark:text-white truncate">
              Productos
            </span>
          </button>

          {/* 4. Arqueo de Caja */}
          <button
            type="button"
            onClick={() => setArqueoModalOpen(true)}
            className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-[#0E2239] hover:bg-slate-50 dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex items-center justify-start text-left gap-2.5 sm:gap-3 transition active:scale-95 cursor-pointer group"
            title="Arqueo y cierre de turno"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#152e4d] flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 group-hover:text-[#0B1A2D] dark:group-hover:text-[#B7F229] transition-colors">
              <Calculator className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#0B1A2D] dark:text-white truncate">
              Arqueo de Caja
            </span>
          </button>
        </div>
      </section>
      )}

      {/* ======================================================================
          NIVEL 2: PÁGINA DE DETALLE - PRODUCTOS E INVENTARIO
          (Sin barra superior global, cabecera limpia con botón ← de retroceso y título unificado, sin subtítulos)
          ====================================================================== */}
      {isCatalogManagementOpen && (
        <div className="fixed inset-0 md:left-64 z-50 bg-slate-50 dark:bg-[#0B1A2D] overflow-y-auto pb-24 md:pb-8 pt-3 sm:pt-4 px-3.5 sm:px-6 lg:px-8 animate-in fade-in duration-150" data-level="2">
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Cabecera Nivel 2 (Limpia, sin colisiones ni desbordamientos) */}
            <div className="flex items-center justify-between py-1.5 sm:py-2 gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsCatalogManagementOpen(false)}
                  className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition cursor-pointer active:scale-95 shrink-0"
                  title="Volver al mostrador TPV"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <div className="flex items-center gap-2 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-black text-[#0B1A2D] dark:text-white tracking-tight truncate">
                    Productos
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-[#152e4d] text-slate-700 dark:text-[#B7F229] font-mono text-xs font-bold shrink-0">
                    {filteredCatalogProducts.length}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={openNewProductModal}
                className="p-1.5 text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0"
                title="Nuevo Producto"
                aria-label="Nuevo Producto"
              >
                <Plus className="w-5 h-5 stroke-[2.2]" />
                <span className="text-xs font-bold sm:inline hidden">Nuevo Producto</span>
              </button>
            </div>

            {/* Tarjetas de Métricas de Inventario */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Artículos</span>
                <div className="text-xl font-black font-mono text-[#0B1A2D] dark:text-white mt-0.5">
                  {cafeProducts.length}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">En catálogo oficial</span>
              </div>
              <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Destacados TPV</span>
                <div className="text-xl font-black font-mono text-[#8B5CF6] dark:text-[#C4B5FD] mt-0.5">
                  {cafeProducts.filter((p) => p.isFeatured !== false).length}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Visibles en mostrador</span>
              </div>
              <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Existencias Totales</span>
                <div className="text-xl font-black font-mono text-[#0B1A2D] dark:text-white mt-0.5">
                  {cafeProducts.reduce((sum, p) => sum + (p.stock || 0), 0)} uds
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Unidades en stock</span>
              </div>
              <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Valor Inventario</span>
                <div className="text-xl font-black font-mono text-[#82b805] dark:text-[#B7F229] mt-0.5">
                  {cafeProducts.reduce((sum, p) => sum + p.price * (p.stock || 0), 0).toFixed(2)} €
                </div>
                <span className="text-[10px] text-slate-400 font-medium">PVP acumulado</span>
              </div>
            </div>

            {/* Filtros Limpios de Catálogo: Búsqueda, Sede y Categoría (Sin caja exterior pesada) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
              {/* Buscador */}
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Buscar artículo por nombre..."
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-semibold text-slate-900 dark:text-white shadow-2xs focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              {/* Filtro por Sede */}
              <div className="sm:col-span-3">
                <select
                  value={catalogVenueFilter}
                  onChange={(e) => setCatalogVenueFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] font-bold text-xs text-[#0B1A2D] dark:text-white shadow-2xs focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="all">Todas las Sedes</option>
                  {venues.map((v) => (
                    <option key={`venue-filter-${v.id}`} value={v.id}>
                      {v.shortName || v.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Categoría */}
              <div className="sm:col-span-3">
                <select
                  value={catalogCategoryFilter}
                  onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] font-bold text-xs text-[#0B1A2D] dark:text-white shadow-2xs focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="all">Todas las Categorías</option>
                  {categories.filter((c) => c !== 'all').map((c) => (
                    <option key={`cat-filter-${c}`} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Listado de Artículos con Diseño Minimalista */}
            <div className="space-y-2">
              {filteredCatalogProducts.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D]">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                  No hay productos que coincidan con la búsqueda o filtros.
                </div>
              ) : (
                filteredCatalogProducts.map((prod) => {
                  const isFeatured = prod.isFeatured !== false;
                  const itemVenueName =
                    prod.venueName ||
                    venues.find((v) => v.id === prod.venueId)?.name ||
                    selectedVenue?.shortName ||
                    selectedVenue?.name ||
                    'Sede Central';

                  return (
                    <div
                      key={prod.id}
                      className="p-3 sm:p-3.5 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      {/* Imagen + Datos del Producto (Nombre, Categoría, Sede, Precio sin solapamiento) */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/80 dark:border-[#1A314D] relative">
                          <img
                            src={prod.imageUrl || getFallbackProductImage(prod.category)}
                            alt={prod.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = getFallbackProductImage(prod.category);
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-[#0B1A2D] dark:text-white truncate">
                              {prod.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[10px] uppercase shrink-0">
                              {prod.category}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] text-slate-500 dark:text-slate-400 font-medium text-[10px] inline-flex items-center gap-1 shrink-0">
                              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{itemVenueName}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm sm:text-base text-[#0B1A2D] dark:text-[#B7F229]">
                              {prod.price.toFixed(2)} €
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              · Stock actual: <strong className="font-mono text-slate-700 dark:text-slate-200">{prod.stock} uds</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Control de Stock, Botón Destacado y Acciones */}
                      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                        {/* Control de Stock (+ / -) */}
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-[#071220] p-1 rounded-xl border border-slate-200/80 dark:border-[#1A314D]">
                          <button
                            type="button"
                            onClick={() => adjustStock(prod, -1)}
                            className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-black cursor-pointer text-xs transition shadow-2xs"
                            title="Reducir stock (-1)"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-mono font-bold text-xs text-[#0B1A2D] dark:text-white">
                            {prod.stock}
                          </span>
                          <button
                            type="button"
                            onClick={() => adjustStock(prod, 1)}
                            className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-black cursor-pointer text-xs transition shadow-2xs"
                            title="Añadir stock (+1)"
                          >
                            +
                          </button>
                        </div>

                        {/* Toggle Destacado en Mostrador (Simplificado a 'Destacado') */}
                        <button
                          type="button"
                          onClick={() => toggleProductFeatured(prod)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer select-none ${
                            isFeatured
                              ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 border-[#B7F229]/60 text-[#0B1A2D] dark:text-[#B7F229]'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                          }`}
                          title={isFeatured ? 'Artículo visible en mostrador' : 'Hacer clic para destacar en mostrador'}
                        >
                          <span className={`w-2 h-2 rounded-full ${isFeatured ? 'bg-[#82b805] dark:bg-[#B7F229]' : 'bg-slate-400'}`} />
                          <span>Destacado</span>
                        </button>

                        {/* Acciones Detalle, Editar y Eliminar */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedProductDetail(prod)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#8B5CF6] dark:hover:text-[#A78BFA] hover:bg-violet-50 dark:hover:bg-[#8B5CF6]/15 transition cursor-pointer"
                            title="Ver detalles / Ficha técnica"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditProductModal(prod)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Editar producto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(prod)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. POS Interface: Product Catalog + Fast Ticket Register */}
      {!isCatalogManagementOpen && !transactionsModalOpen && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Products Grid */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Categories bar con botón minimalista para gestionar categorías */}
          <div className="flex items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCategory(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer shrink-0 font-bold ${
                    activeCategory === c
                      ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                      : 'bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  {c === 'all' ? 'Todos los Artículos' : c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex items-center gap-1.5 text-xs font-bold transition cursor-pointer shrink-0"
                title="Gestionar categorías de artículos"
              >
                <Sliders className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span className="hidden sm:inline">Categorías</span>
              </button>
            </div>
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
                className="p-2.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#8B5CF6]/50 text-left transition flex flex-col group shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer overflow-hidden select-none"
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
                    className="absolute bottom-1.5 right-1.5 p-1 rounded-lg bg-[#0B1A2D]/80 hover:bg-[#0B1A2D] text-white transition z-10"
                    title="Ver detalle del producto"
                  >
                    <Info className="w-3 h-3" />
                  </button>

                  {/* Badge de Categoría Superpuesto en esquina superior izquierda */}
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#0B1A2D]/85 backdrop-blur-xs text-[9px] font-bold text-white uppercase tracking-wider shadow-xs">
                    {prod.category}
                  </span>

                  {/* Badge de Stock en esquina superior derecha */}
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-[9px] font-mono font-bold text-slate-800 dark:text-slate-200 shadow-xs">
                    {prod.stock} ud.
                  </span>
                </div>

                {/* 2. Información Inferior: Título y Precio/Botón en estructura vertical */}
                <div className="flex flex-col flex-1 justify-between pt-2">
                  <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#8B5CF6] dark:group-hover:text-[#B7F229] transition line-clamp-1 leading-snug">
                    {prod.name}
                  </div>

                  <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                    <span className="font-mono font-black text-sm text-[#0B1A2D] dark:text-[#B7F229]">
                      {prod.price.toFixed(2)} €
                    </span>
                    <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-[#0B1A2D] dark:text-slate-200 group-hover:bg-[#B7F229] group-hover:text-[#0B1A2D] transition-colors">
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket / POS Cart Register & Últimos Pagos */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
                  <ShoppingCart className="w-4 h-4 text-[#8B5CF6]" />
                </div>
                <h2 className="font-black text-xs uppercase tracking-wider text-[#0B1A2D] dark:text-white">
                  Ticket en Curso
                </h2>
                <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {posCart.reduce((acc, i) => acc + i.qty, 0)} arts.
                </span>
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
                  Ticket vacío. Selecciona artículos del catálogo o pulsa en "Asignar Reserva".
                </div>
              ) : (
                posCart.map(({ product, qty, meta }, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs"
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

                      <span className="font-mono font-black text-xs w-14 text-right text-[#0B1A2D] dark:text-white">
                        {(product.price * qty).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Payment Method Selector (Filtered by Club Settings) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Método de Cobro en Mostrador:
              </span>
              <div className={`grid ${availablePaymentMethods.length <= 2 ? 'grid-cols-2' : availablePaymentMethods.length <= 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'} gap-2`}>
                {availablePaymentMethods.map((m) => {
                  const IconComponent = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] border border-[#0B1A2D] dark:border-white shadow-xs ring-2 ring-[#0B1A2D]/10 dark:ring-white/20'
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80'
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
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{t('pos.selectedPaymentMethod', 'Método seleccionado:')}</span>
                <span className="font-bold text-[#0B1A2D] dark:text-slate-200 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
                  {activePaymentMethodObj && <activePaymentMethodObj.icon className="w-3.5 h-3.5 text-[#8B5CF6]" />}
                  <span>{activePaymentMethodObj?.label}</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total a Cobrar:</span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-[#0B1A2D] dark:text-white tracking-tight">
                  {cartTotal.toFixed(2)} €
                </span>
              </div>

              {/* Botón CTA principal de cobro en Verde Lima Setmio */}
              <button
                type="button"
                onClick={handleChargeSale}
                disabled={posCart.length === 0}
                className="w-full py-3.5 rounded-xl bg-[#B7F229] hover:bg-[#a6e61f] disabled:opacity-40 text-[#0B1A2D] font-black text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>
                  Cobrar con {activePaymentMethodObj?.label || 'TPV'}
                </span>
              </button>
            </div>
          </div>

          {/* Bloque de los Últimos Pagos Registrados (Limpio, Sin subtítulo '5 en turno', Clic abre Detalle del Pago) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Últimos Pagos
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTransactionsModalOpen(true)}
                className="text-xs font-bold text-[#8B5CF6] dark:text-purple-400 hover:underline cursor-pointer"
              >
                ver todos
              </button>
            </div>

            {activeShiftTransactions.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                No hay pagos registrados todavía en este turno para esta sede.
              </div>
            ) : (
              <div className="space-y-2">
                {activeShiftTransactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedPaymentDetail(tx)}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-[#8B5CF6]/50 dark:hover:border-slate-700 transition flex items-center justify-between gap-3 text-xs cursor-pointer group"
                    title="Haz clic para ver el detalle de este pago"
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[10px] text-slate-400 shrink-0">{tx.time}</span>
                        <span className="font-bold text-slate-900 dark:text-white truncate text-[11px] group-hover:text-[#8B5CF6] transition-colors">{tx.concept}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-1.5 truncate">
                        <span>{tx.customerName || 'Cliente Mostrador'}</span>
                        <span>·</span>
                        <span className="text-[#8B5CF6] font-medium">{tx.paymentMethod}</span>
                        <span>·</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium inline-flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{tx.cashierName || 'Recepción Mostrador'}</span>
                        </span>
                        <span>·</span>
                        <span className="text-slate-400 font-medium inline-flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{formatVenueDisplayName(tx.venueName, tx.venueId)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-black text-xs text-[#0B1A2D] dark:text-[#B7F229]">
                        +{tx.amount.toFixed(2)} €
                      </div>
                      <span className="text-[9px] font-black text-[#0B1A2D] bg-[#B7F229] px-1.5 py-0.5 rounded shadow-2xs">
                        Cobrado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* ======================================================================
          NIVEL 2: PÁGINA DE DETALLE - PAGOS (CONSOLIDADO MULTI-TURNO Y MULTI-RECEPCIÓN)
          (Sin barra superior global, cabecera limpia con botón ← de retroceso, sin subtítulos,
           componente estándar unificado de sedes y filtros globales integrados)
          ====================================================================== */}
      {transactionsModalOpen && (
        <div className="fixed inset-0 md:left-64 z-50 bg-slate-50 dark:bg-[#0B1A2D] overflow-y-auto pb-24 md:pb-8 pt-3 sm:pt-4 px-3.5 sm:px-6 lg:px-8 animate-in fade-in duration-150" data-level="2">
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Cabecera Limpia Nivel 2 (Sin contenedor pesado que envuelve al título) */}
            <div className="flex items-center justify-between py-1.5 sm:py-2">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setTransactionsModalOpen(false)}
                  className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition cursor-pointer active:scale-95 shrink-0"
                  title="Volver al mostrador TPV"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <div className="flex items-center gap-2 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-black text-[#0B1A2D] dark:text-white tracking-tight truncate">
                    Pagos
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-[#152e4d] text-slate-700 dark:text-[#B7F229] font-mono text-xs font-bold shrink-0">
                    {filteredGlobalPayments.length}
                  </span>
                </div>
              </div>

              {/* Botón de Exportación Rápida */}
              <button
                type="button"
                onClick={handleExportArqueoCSV}
                className="px-3 sm:px-3.5 py-2 rounded-xl bg-white dark:bg-[#0E2239] hover:bg-slate-50 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-white border border-slate-200/80 dark:border-[#1A314D] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span className="hidden sm:inline">Exportar CSV</span>
              </button>
            </div>

            {/* KPIs Resumen Superior Compacto */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Cobrado</span>
                <span className="text-xl font-black font-mono text-[#0B1A2D] dark:text-[#B7F229] mt-0.5 block">
                  {filteredGlobalPayments.reduce((acc, t) => acc + t.amount, 0).toFixed(2)} €
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Todos los turnos</span>
              </div>
              <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tarjeta / TPV</span>
                <span className="text-xl font-black font-mono text-[#8B5CF6] dark:text-[#C4B5FD] mt-0.5 block">
                  {filteredGlobalPayments.filter((t) => t.paymentMethod.toLowerCase().includes('tarjeta')).reduce((a, b) => a + b.amount, 0).toFixed(2)} €
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Datáfono / Terminal</span>
              </div>
              <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Efectivo</span>
                <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {filteredGlobalPayments.filter((t) => t.paymentMethod.toLowerCase().includes('efectivo')).reduce((a, b) => a + b.amount, 0).toFixed(2)} €
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Cajón portamonedas</span>
              </div>
              <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monedero / App</span>
                <span className="text-xl font-black font-mono text-[#0B1A2D] dark:text-white mt-0.5 block">
                  {filteredGlobalPayments.filter((t) => !t.paymentMethod.toLowerCase().includes('tarjeta') && !t.paymentMethod.toLowerCase().includes('efectivo')).reduce((a, b) => a + b.amount, 0).toFixed(2)} €
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Saldo y Bizum</span>
              </div>
            </div>

            {/* Barra de Filtros Compactos Integrados (Sin caja exterior pesada) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 text-xs">
              {/* 1. Buscador Rápido */}
              <div className="lg:col-span-4 relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  placeholder="Buscar por cliente, concepto o #TX..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs font-semibold text-slate-900 dark:text-white shadow-2xs focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              {/* 2. Sede Activa */}
              <div className="lg:col-span-3">
                <select
                  value={posVenueFilter}
                  onChange={(e) => setPosVenueFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] font-bold text-xs text-[#0B1A2D] dark:text-white shadow-2xs focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="all">Todas las Sedes</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Turno / Período */}
              <div className="lg:col-span-2">
                <select
                  value={paymentShiftFilter}
                  onChange={(e) => setPaymentShiftFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] font-bold text-xs text-[#0B1A2D] dark:text-white shadow-2xs focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="all">Todos los turnos</option>
                  <option value="today">Hoy</option>
                  <option value="morning">Turno Mañana</option>
                  <option value="afternoon">Turno Tarde</option>
                  <option value="night">Turno Noche</option>
                  <option value="yesterday">Ayer</option>
                </select>
              </div>

              {/* 4. Método de Pago */}
              <div className="lg:col-span-3">
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] font-bold text-xs text-[#0B1A2D] dark:text-white shadow-2xs focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="all">Todos los métodos</option>
                  <option value="Tarjeta">Tarjeta / Datáfono</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Monedero">Monedero Socio</option>
                  <option value="Bizum">Bizum / Online</option>
                </select>
              </div>
            </div>

            {/* Listado Vertical de Pagos en Tarjetas Minimalistas (Design System Global) */}
            <div className="space-y-2">
              {filteredGlobalPayments.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D]">
                  <Receipt className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                  No se encontraron pagos con los filtros seleccionados.
                </div>
              ) : (
                filteredGlobalPayments.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedPaymentDetail(tx)}
                    className="p-3.5 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition flex items-center justify-between gap-3 text-xs cursor-pointer group"
                    title="Haz clic para ver el ticket y desglose completo"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-slate-400 text-[11px] shrink-0">
                          {tx.date || 'Hoy'} · {tx.time}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold shrink-0">
                          #{tx.id}
                        </span>
                        {tx.shift && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-50 dark:bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#C4B5FD] shrink-0">
                            {tx.shift}
                          </span>
                        )}
                        <span className="font-bold text-[#0B1A2D] dark:text-white truncate group-hover:text-[#8B5CF6] transition-colors">
                          {tx.concept}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {tx.customerName || 'Cliente Mostrador'}
                        </span>
                        <span>·</span>
                        <span className="text-[#8B5CF6] font-medium">{tx.paymentMethod}</span>
                        <span>·</span>
                        <span className="text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{tx.cashierName || 'Recepción'}</span>
                        </span>
                        {tx.venueName && (
                          <>
                            <span>·</span>
                            <span className="text-slate-400 text-[10px] inline-flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{formatVenueDisplayName(tx.venueName, tx.venueId)}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-3">
                      <div>
                        <div className="font-mono font-black text-sm sm:text-base text-[#0B1A2D] dark:text-[#B7F229]">
                          +{tx.amount.toFixed(2)} €
                        </div>
                        <span className="text-[9px] font-black text-[#0B1A2D] bg-[#B7F229] px-1.5 py-0.5 rounded shadow-2xs">
                          Cobrado
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))
              )}

              {/* Totalizador inferior minimalista */}
              {filteredGlobalPayments.length > 0 && (
                <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">
                    Mostrando {filteredGlobalPayments.length} de {posTransactions.length} pagos registrados:
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-[#0B1A2D] dark:text-white">
                    {filteredGlobalPayments.reduce((acc, t) => acc + t.amount, 0).toFixed(2)} €
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          2.6 MODAL: PÁGINA DE DETALLES ESPECÍFICOS DEL PAGO SELECCIONADO
          ====================================================================== */}
      {selectedPaymentDetail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B1A2D]/80 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-[#0B1A2D] dark:text-white truncate">
                    Detalle del Pago #{selectedPaymentDetail.id}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] border border-[#B7F229]/50 font-black text-[9px] uppercase tracking-wider shrink-0">
                    Completado
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {selectedPaymentDetail.date || 'Hoy'} · {selectedPaymentDetail.time}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPaymentDetail(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido con scroll interior */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain">
              {/* Tarjeta de Importe Destacado */}
              <div className="p-4 rounded-2xl bg-[#0B1A2D] text-white border border-[#1A314D] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                    Importe Cobrado
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-[#B7F229] mt-0.5">
                    {selectedPaymentDetail.amount.toFixed(2)} €
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Método
                  </span>
                  <span className="font-bold text-white inline-flex items-center gap-1.5 mt-0.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#B7F229]" />
                    {selectedPaymentDetail.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Ficha Resumen de Sede, Atendido por y Cliente */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Sede
                  </span>
                  <div className="font-bold text-[#0B1A2D] dark:text-white truncate">
                    {formatVenueDisplayName(selectedPaymentDetail.venueName, selectedPaymentDetail.venueId)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Atendido por
                  </span>
                  <div className="font-bold text-[#0B1A2D] dark:text-white truncate">
                    {selectedPaymentDetail.cashierName || currentUser?.name || 'Recepción Mostrador'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Cliente / Socio
                  </span>
                  <div className="font-bold text-[#0B1A2D] dark:text-white truncate">
                    {selectedPaymentDetail.customerName || 'Cliente Mostrador'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Terminal / TPV
                  </span>
                  <div className="font-bold text-[#0B1A2D] dark:text-white truncate">
                    Caja Mostrador #01
                  </div>
                </div>
              </div>

              {/* Desglose de Conceptos / Artículos */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Líneas de Detalle del Ticket
                </h4>
                <div className="rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] p-3 divide-y divide-slate-200/60 dark:divide-slate-800 text-xs">
                  {selectedPaymentDetail.items && selectedPaymentDetail.items.length > 0 ? (
                    selectedPaymentDetail.items.map((item, idx) => (
                      <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-bold text-[#0B1A2D] dark:text-white truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {item.qty} ud. x {item.unitPrice.toFixed(2)} €
                          </div>
                        </div>
                        <div className="font-mono font-bold text-[#0B1A2D] dark:text-white">
                          {(item.qty * item.unitPrice).toFixed(2)} €
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-1 flex items-center justify-between">
                      <span className="font-bold text-[#0B1A2D] dark:text-white">
                        {selectedPaymentDetail.concept}
                      </span>
                      <span className="font-mono font-bold text-[#0B1A2D] dark:text-white">
                        {selectedPaymentDetail.amount.toFixed(2)} €
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Totales e Impuestos */}
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-500">
                  <span>Base Imponible:</span>
                  <span className="font-mono">{(selectedPaymentDetail.amount / 1.10).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>IVA Incluido (10% / 21%):</span>
                  <span className="font-mono">{(selectedPaymentDetail.amount - (selectedPaymentDetail.amount / 1.10)).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-black text-[#0B1A2D] dark:text-white pt-1 border-t border-slate-200/80 dark:border-slate-700">
                  <span>Total Cobrado:</span>
                  <span className="font-mono text-sm">{selectedPaymentDetail.amount.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Footer con acciones de impresión y retorno */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-[#1A314D] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50/60 dark:bg-[#071220]/50 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0B1A2D] dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Imprimir</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerDemoToast('Recibo Enviado', `Comprobante digital enviado a ${selectedPaymentDetail.customerName || 'cliente'}.`, 'success');
                  }}
                  className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0B1A2D] dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Enviar Recibo</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPaymentDetail(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0B1A2D] dark:bg-white text-white dark:text-[#0B1A2D] font-bold text-xs transition cursor-pointer text-center"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          3. MODAL: CIERRE / ARQUEO DE CAJA DEL TURNO (REDISENO MINIMALISTA ELEGANTE)
          ====================================================================== */}
      {arqueoModalOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col h-full overflow-y-auto bg-white dark:bg-[#071220] sm:bg-slate-950/70 sm:dark:bg-black/80 sm:backdrop-blur-xs sm:p-4 lg:p-6 sm:items-center sm:justify-center animate-in fade-in duration-150">
          <div className="relative w-full flex-1 sm:flex-initial flex flex-col bg-white dark:bg-[#0E2239] border-0 sm:border sm:border-slate-200/90 dark:sm:border-[#1A314D] sm:rounded-3xl sm:shadow-2xl text-slate-900 dark:text-slate-100 sm:max-w-xl my-0 sm:my-auto max-h-none sm:max-h-[92vh] overflow-hidden">
            {/* Header Fijo con X correctamente alineada */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between shrink-0">
              <h3 className="text-lg font-black text-[#0B1A2D] dark:text-white">
                Cierre y Arqueo de Caja
              </h3>

              <button
                type="button"
                onClick={() => setArqueoModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenedor Superior de Resumen de Arqueo Rediseñado (Minimalista y Elegante) */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain">
              {/* Selector de Sede Superior Idéntico al de las Páginas Principales */}
              <div className="relative">
                <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  {/* Selector de Sede */}
                  <div
                    onClick={() => setIsArqueoVenueSelectorOpen(!isArqueoVenueSelectorOpen)}
                    className="flex items-center gap-2 cursor-pointer group select-none min-w-0"
                    title="Cambiar sede de arqueo o ver consolidado"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-100 dark:border-[#1A314D] flex items-center justify-center text-[#0B1A2D] dark:text-slate-200 shrink-0">
                      <Building2 className="w-4 h-4 text-[#0B1A2D] dark:text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0B1A2D] dark:text-white truncate">
                          {arqueoVenueFilter === 'all'
                            ? 'Todas las Sedes'
                            : venues.find((v) => v.id === arqueoVenueFilter)?.shortName ||
                              venues.find((v) => v.id === arqueoVenueFilter)?.name ||
                              'Sede Central'}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B1A2D] dark:group-hover:text-white transition-transform ${
                            isArqueoVenueSelectorOpen ? 'rotate-180 text-[#0B1A2D] dark:text-white' : ''
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 block truncate">
                        {venues.filter((v) => v.id !== 'all').length > 1
                          ? `${venues.filter((v) => v.id !== 'all').length} sedes conectadas`
                          : 'Sede oficial'}
                      </span>
                    </div>
                  </div>

                  {/* Badge Dinámico de Apertura / Resumen Multisede */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0FCCF] dark:bg-[#B7F229]/20 border border-[#B7F229]/50 transition-all select-none shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#82b805] dark:bg-[#B7F229]" />
                    <span className="text-[11px] font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                      {arqueoVenueFilter === 'all'
                        ? `${venues.filter((v) => v.id !== 'all').length} Sedes Activas`
                        : 'Turno Activo'}
                    </span>
                  </div>
                </div>

                {/* Menú Desplegable de Sedes */}
                {isArqueoVenueSelectorOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-30 p-2 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200 dark:border-[#1A314D] shadow-xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1">
                      Red Deportiva · Seleccionar Sede
                    </div>

                    {venues.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setArqueoVenueFilter('all');
                          setIsArqueoVenueSelectorOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                          arqueoVenueFilter === 'all'
                            ? 'bg-[#B7F229]/20 text-[#0B1A2D] dark:text-white'
                            : 'hover:bg-slate-50 dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
                          <span>Todas las Sedes</span>
                        </span>
                        {arqueoVenueFilter === 'all' && <CheckCircle2 className="w-3.5 h-3.5 text-[#82b805]" />}
                      </button>
                    )}

                    {venues
                      .filter((v) => v.id !== 'all')
                      .map((venue) => {
                        const isSelected = arqueoVenueFilter === venue.id;
                        return (
                          <button
                            key={venue.id}
                            type="button"
                            onClick={() => {
                              setArqueoVenueFilter(venue.id);
                              setIsArqueoVenueSelectorOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                              isSelected
                                ? 'bg-[#B7F229]/20 text-[#0B1A2D] dark:text-white'
                                : 'hover:bg-slate-50 dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{venue.name}</span>
                            </div>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#82b805] shrink-0" />}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-[#0B1A2D] text-white border border-[#1A314D] shadow-md space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                    Total Recaudado en Turno
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B7F229] text-[#0B1A2D] font-black text-[10px] tracking-wider uppercase shadow-2xs">
                    Turno Activo
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl sm:text-4xl font-black font-mono text-[#B7F229] tracking-tight">
                    {arqueoSalesTotal.toFixed(2)} €
                  </div>
                  <div className="text-right text-[11px] text-slate-300 space-y-0.5">
                    <div>{new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                    <div className="font-mono text-slate-300">Apertura: 08:30 h</div>
                  </div>
                </div>
                <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-slate-300 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#B7F229]" />
                    <span>
                      {arqueoVenueFilter === 'all'
                        ? 'Todas las Sedes'
                        : formatVenueDisplayName(venues.find((v) => v.id === arqueoVenueFilter)?.name, arqueoVenueFilter)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Responsable: {currentUser?.name || 'Recepción Mostrador'}</span>
                  </div>
                </div>
              </div>

              {/* Desglose por Método de Pago */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Desglose por Método de Pago
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                        <CreditCard className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        <span>TPV / Tarjeta</span>
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-mono font-black text-[#0B1A2D] dark:text-white">
                      {arqueoCardTotal.toFixed(2)} €
                    </div>
                    <div className="text-[11px] font-medium text-slate-400">
                      {arqueoSalesTotal > 0 ? ((arqueoCardTotal / arqueoSalesTotal) * 100).toFixed(0) : 0}% de operaciones
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                        <Banknote className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        <span>Efectivo</span>
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-mono font-black text-[#0B1A2D] dark:text-white">
                      {arqueoCashTotal.toFixed(2)} €
                    </div>
                    <div className="text-[11px] font-medium text-slate-400">
                      Cajón portamonedas
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                        <Wallet className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        <span>Monedero</span>
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-mono font-black text-[#0B1A2D] dark:text-white">
                      {arqueoWalletTotal.toFixed(2)} €
                    </div>
                    <div className="text-[11px] font-medium text-slate-400">
                      Saldo de socios
                    </div>
                  </div>
                </div>
              </div>

              {/* Métricas por Categoría */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ventas por Categoría
                </h4>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Bebidas & Snacks</span>
                    <span className="font-mono font-bold">{(arqueoSalesTotal * 0.32).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Cafetería & Desayunos</span>
                    <span className="font-mono font-bold">{(arqueoSalesTotal * 0.16).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Reservas de Pistas Cobradas</span>
                    <span className="font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                      {(arqueoSalesTotal * 0.38).toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Recargas de Saldo y Material</span>
                    <span className="font-mono font-bold">{(arqueoSalesTotal * 0.14).toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer de Arqueo: Botones modificados según directrices */}
            <div className="p-5 border-t border-slate-100 dark:border-[#1A314D] space-y-2.5 bg-slate-50/60 dark:bg-[#071220]/50 shrink-0">
              {/* Fila Superior: 2 botones en grid de ancho total */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  type="button"
                  onClick={handleExportArqueoCSV}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0B1A2D] dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Exportar</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintThermalArqueo}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0B1A2D] dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Imprimir</span>
                </button>
              </div>

              {/* Botón Inferior: Cerrar Turno Oficial con texto blanco y fondo Azul Profundo #0B1A2D */}
              <button
                type="button"
                onClick={() => {
                  setSessionSalesTotal(0);
                  setArqueoModalOpen(false);
                  triggerDemoToast('Caja Cerrada', 'El turno ha sido cerrado y el contador de caja reiniciado a 0.00 €.', 'success');
                }}
                className="w-full py-3 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white border border-[#1A314D] font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.99]"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span className="text-white">Cerrar Turno Oficial</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          4. MODAL: GESTIÓN DE CATÁLOGO DE PRODUCTOS (CRUD)
          ====================================================================== */}
      {catalogModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B1A2D]/75 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
                  <Package className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B1A2D] dark:text-white">
                    Catálogo de Productos y Existencias TPV
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Administra productos, precios, stock y fotos de cafetería
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openNewProductModal}
                  className="px-3 py-1.5 rounded-xl bg-[#B7F229] hover:bg-[#a6e61f] text-[#0B1A2D] font-black text-xs shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Nuevo Producto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCatalogModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
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
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between gap-3 text-xs hover:border-[#8B5CF6]/50 transition cursor-pointer"
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
                      className="w-10 h-10 rounded-lg object-cover bg-slate-200 dark:bg-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-[#0B1A2D] dark:text-white truncate">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {p.category} · Stock: <strong className="font-mono text-slate-700 dark:text-slate-300">{p.stock} uds</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <span className="font-mono font-black text-sm text-[#0B1A2D] dark:text-white mr-1">
                      {p.price.toFixed(2)} €
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedProductDetail(p)}
                      className="p-1.5 rounded-lg bg-slate-200 dark:bg-[#132A45] text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition cursor-pointer"
                      title="Ver detalle del producto"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditProductModal(p)}
                      className="p-1.5 rounded-lg bg-slate-200 dark:bg-[#132A45] text-slate-700 dark:text-slate-200 hover:bg-[#8B5CF6] hover:text-white transition cursor-pointer"
                      title="Editar producto"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setProductToDelete(p)}
                      className="p-1.5 rounded-lg bg-slate-200 dark:bg-[#132A45] text-rose-500 hover:bg-rose-600 hover:text-white transition cursor-pointer"
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

      {/* ======================================================================
          FORMULARIO NUEVO / EDITAR PRODUCTO (CON SELECTOR DE CATEGORÍA OBLIGATORIO Y ACCESO DIRECTO PARA CREAR NUEVA)
          ====================================================================== */}
      {productFormModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col h-full overflow-y-auto bg-white dark:bg-[#071220] sm:bg-slate-950/70 sm:dark:bg-black/80 sm:backdrop-blur-xs sm:p-4 lg:p-6 sm:items-center sm:justify-center animate-in fade-in duration-150">
          <div className="w-full flex-1 sm:flex-initial flex flex-col bg-white dark:bg-[#071220] sm:max-w-lg sm:rounded-3xl sm:shadow-2xl border-0 sm:border sm:border-slate-200/90 dark:sm:border-[#1A314D] my-0 sm:my-auto max-h-none sm:max-h-[92vh] overflow-hidden">
            {/* Cabecera Limpia y Exclusiva con botón X */}
            <div className="sticky top-0 z-20 px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between bg-white/95 dark:bg-[#071220]/95 backdrop-blur-md shrink-0">
              <h2 className="text-lg sm:text-xl font-black text-[#0B1A2D] dark:text-white tracking-tight">
                {editingProduct ? 'Editar Producto TPV' : 'Nuevo Producto TPV'}
              </h2>
              <button
                type="button"
                onClick={() => setProductFormModalOpen(false)}
                className="p-2 -mr-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-[#0E2239] transition-colors cursor-pointer shrink-0"
                title="Cerrar formulario"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido sin scrollbars anidadas - Estilo Linear/Stripe */}
            <form onSubmit={handleSaveProductSubmit} className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4 sm:space-y-5 text-xs text-slate-900 dark:text-slate-100">
              {/* Nombre del Producto */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5 text-xs">
                  Nombre del Producto <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  placeholder="Ej: Zumo de Naranja Natural"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-semibold text-[#0B1A2D] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                />
              </div>

              {/* Selector Obligatorio de Categoría + Acceso Directo para Crear Nueva */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs">
                    Categoría <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowInlineNewCategory(!showInlineNewCategory)}
                    className="text-[11px] font-bold text-[#8B5CF6] hover:text-[#7c3aed] flex items-center gap-1 cursor-pointer transition"
                  >
                    {showInlineNewCategory ? (
                      <span>Cancelar</span>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                        <span>Añadir categoría</span>
                      </>
                    )}
                  </button>
                </div>

                {showInlineNewCategory ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nombre de la nueva categoría..."
                      value={inlineCategoryName}
                      onChange={(e) => setInlineCategoryName(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-[#071220] border border-[#8B5CF6] rounded-xl text-xs font-semibold text-[#0B1A2D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
                    />
                    <button
                      type="button"
                      onClick={handleCreateInlineCategory}
                      className="px-4 py-2.5 bg-[#0B1A2D] hover:bg-[#132A45] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition"
                    >
                      <Check className="w-3.5 h-3.5 text-[#B7F229]" />
                      <span>Crear</span>
                    </button>
                  </div>
                ) : (
                  <select
                    required
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-semibold text-[#0B1A2D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                  >
                    {customCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Precio y Stock Inicial - Retícula limpia 2 columnas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5 text-xs">
                    Precio (€) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-mono font-bold text-[#0B1A2D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5 text-xs">
                    Stock Inicial (uds)
                  </label>
                  <input
                    type="number"
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({ ...productFormData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-mono font-bold text-[#0B1A2D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                  />
                </div>
              </div>

              {/* Selector de Sede Asignada al Producto */}
              {venues && venues.length > 0 && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5 text-xs">
                    Sede Asignada
                  </label>
                  <select
                    value={productFormData.venueId}
                    onChange={(e) => setProductFormData({ ...productFormData, venueId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-semibold text-[#0B1A2D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                  >
                    {venues.map((v) => (
                      <option key={`prod-form-venue-${v.id}`} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Imagen del Producto (URL o Presets) */}
              <div className="space-y-2">
                <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs">
                  Imagen del Producto
                </label>

                {productFormData.imageUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] h-32 flex items-center justify-center">
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
                      className="absolute top-2 right-2 p-1.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white transition cursor-pointer"
                      title="Eliminar imagen"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Presets de imágenes de catálogo oficiales */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                    Presets de imagen recomendados
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_PRODUCT_IMAGES.map((imgItem) => (
                      <button
                        key={imgItem.label}
                        type="button"
                        onClick={() => setProductFormData({ ...productFormData, imageUrl: imgItem.url })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                          productFormData.imageUrl === imgItem.url
                            ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] border-transparent shadow-xs'
                            : 'bg-slate-100 dark:bg-[#071220] border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {imgItem.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input URL + Botón Subir Archivo */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={productFormData.imageUrl}
                    onChange={(e) => setProductFormData({ ...productFormData, imageUrl: e.target.value })}
                    placeholder="URL de imagen (https://...)"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-medium text-[#0B1A2D] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#B7F229] focus:border-[#B7F229] transition shadow-2xs"
                  />
                  <label className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#0E2239] dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 transition text-xs border border-slate-200/80 dark:border-[#1A314D]">
                    <Upload className="w-3.5 h-3.5 text-[#8B5CF6]" />
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
            </form>

            {/* Modal Footer Sólido y Simétrico a Ancho Completo (Distribución Equitativa 50/50) */}
            <div className="sticky bottom-0 z-20 px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 dark:border-[#1A314D] bg-white/95 dark:bg-[#071220]/95 backdrop-blur-md shrink-0 mt-auto">
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setProductFormModalOpen(false)}
                  className="w-full py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0E2239] dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm border border-slate-200/80 dark:border-[#1A314D] transition cursor-pointer active:scale-[0.99] flex items-center justify-center text-center whitespace-nowrap"
                >
                  <span>Cancelar</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveProductSubmit}
                  className="w-full py-3 px-3 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:hover:bg-[#a6e61f] dark:text-[#0B1A2D] font-bold text-xs sm:text-sm border border-transparent shadow-md transition active:scale-[0.99] cursor-pointer flex items-center justify-center text-center whitespace-nowrap"
                >
                  <span>Guardar Producto</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: PÁGINA DE DETALLE COMPLETO DE PRODUCTO
          ====================================================================== */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B1A2D]/75 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D]">
                  {selectedProductDetail.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ID: #{selectedProductDetail.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProductDetail(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Foto del Producto */}
            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D]">
              <img
                src={selectedProductDetail.imageUrl || getFallbackProductImage(selectedProductDetail.category)}
                alt={selectedProductDetail.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackProductImage(selectedProductDetail.category);
                }}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-xl bg-[#0B1A2D]/85 backdrop-blur-xs text-xs font-mono font-black text-white">
                {selectedProductDetail.price.toFixed(2)} €
              </span>
              <span className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl bg-white/95 dark:bg-[#0E2239]/95 backdrop-blur-xs text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                Stock: {selectedProductDetail.stock} unidades
              </span>
            </div>

            <div>
              <h2 className="text-lg font-black text-[#0B1A2D] dark:text-white">
                {selectedProductDetail.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Producto registrado en el TPV y catálogo oficial de {currentTenant.name}.
              </p>
            </div>

            {/* Ficha de datos y métricas */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D]">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Precio Venta</span>
                <span className="text-base font-black font-mono text-[#0B1A2D] dark:text-[#B7F229]">
                  {selectedProductDetail.price.toFixed(2)} €
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D]">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Existencias</span>
                <span className="text-base font-black font-mono text-[#0B1A2D] dark:text-white">
                  {selectedProductDetail.stock} uds
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D]">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Estado</span>
                <span className="text-xs font-bold text-[#8B5CF6]">
                  {selectedProductDetail.active !== false ? 'Activo en Caja' : 'Inactivo'}
                </span>
              </div>
            </div>

            {/* Acciones principales */}
            <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between gap-3">
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
                <span>Eliminar Producto</span>
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
                  className="px-4 py-2.5 rounded-xl bg-[#B7F229] hover:bg-[#a6e61f] text-[#0B1A2D] font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar Producto</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: CONFIRMACIÓN PARA ELIMINAR PRODUCTO
          ====================================================================== */}
      {productToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B1A2D]/75 backdrop-blur-xs p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                ¿Eliminar este producto?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Esta acción retirará el artículo del catálogo del TPV y de la cafetería de forma permanente.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] mt-2 font-bold text-xs text-slate-800 dark:text-slate-200">
                "{productToDelete.name}" · {productToDelete.price.toFixed(2)} €
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-[#1A314D] font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCafeProduct(productToDelete.id);
                  triggerDemoToast('Producto Eliminado', `"${productToDelete.name}" retirado del catálogo.`, 'info');
                  setProductToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
              >
                Sí, eliminar producto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          5. MODAL: ASIGNAR RESERVA O RECARGA DE MONEDERO
          ====================================================================== */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B1A2D]/75 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header Limpio sin icono deformado */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between shrink-0">
              <h3 className="text-lg font-black text-[#0B1A2D] dark:text-white">
                Asignar Reserva o Recarga
              </h3>
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pestañas: Reservas vs Monedero */}
            <div className="px-5 sm:px-6 pt-3 pb-3 flex items-center gap-2 border-b border-slate-100 dark:border-[#1A314D] shrink-0">
              <button
                type="button"
                onClick={() => setAssignTab('bookings')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  assignTab === 'bookings'
                    ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                    : 'bg-slate-100 dark:bg-[#132A45] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                1. Reservas de Hoy ({filteredBookings.length})
              </button>
              <button
                type="button"
                onClick={() => setAssignTab('wallet')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  assignTab === 'wallet'
                    ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                    : 'bg-slate-100 dark:bg-[#132A45] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                2. Recargar Saldo Socio
              </button>
            </div>

            {/* Contenido con scroll */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain">
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
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {filteredBookings.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        No hay reservas activas disponibles para cobrar.
                      </div>
                    ) : (
                      filteredBookings.map((b) => {
                        const startH = b.startTime.split('T')[1]?.slice(0, 5) || '';
                        return (
                          <div
                            key={b.id}
                            className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-[#0B1A2D] dark:text-white text-xs">
                                  {b.courtName} ({startH})
                                </span>
                                <div className="text-[11px] text-slate-500">Titular: {b.creatorName}</div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAssignFullBooking(b)}
                                className="px-3 py-1.5 rounded-xl bg-[#B7F229] hover:bg-[#a6e61f] text-[#0B1A2D] font-black text-[11px] shadow-xs cursor-pointer active:scale-95"
                              >
                                Pagar Pista Completa ({b.totalPrice.toFixed(2)} €)
                              </button>
                            </div>

                            {b.participants && b.participants.length > 0 && (
                              <div className="pt-2 border-t border-slate-200/60 dark:border-[#1A314D]">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                  O cobrar cuota individual (1/4):
                                </span>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {b.participants.map((p, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => handleAssignParticipant(b, p)}
                                      className="p-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] hover:border-[#8B5CF6] text-left text-[11px] transition flex items-center justify-between cursor-pointer active:scale-95"
                                    >
                                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate mr-2">
                                        {p.name}
                                      </span>
                                      <span className="font-bold text-[#8B5CF6] dark:text-[#B7F229] shrink-0 font-mono">
                                        +{(p.amount || b.totalPrice / 4).toFixed(2)} €
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
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
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#8B5CF6]"
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
                              ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-[#0B1A2D] dark:text-white font-bold'
                              : 'bg-slate-50 dark:bg-[#071220] border-slate-200/80 dark:border-[#1A314D] hover:border-slate-300'
                          }`}
                        >
                          <div className="font-bold text-slate-900 dark:text-white truncate">{m.name}</div>
                          <div className="text-[10px] text-slate-500">#{m.memberNum} · Saldo: {m.balance.toFixed(2)}€</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedWalletMember && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
                      <div className="font-bold text-[#0B1A2D] dark:text-white">
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
                                ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                                : 'bg-white dark:bg-[#0E2239] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1A314D]'
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
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] font-mono text-xs w-32 focus:outline-none focus:border-[#8B5CF6]"
                        />
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddWalletTopup}
                          className="px-4 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6e61f] text-[#0B1A2D] font-black text-xs shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>Añadir Recarga al Ticket</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: GESTIÓN DE CATEGORÍAS (ALTA CON BOTÓN DE MARCA AZUL/LIMA, EDICIÓN Y AÑADIR PRODUCTOS ÁGIL)
          ====================================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0B1A2D]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0E2239] rounded-3xl max-w-lg w-full border border-slate-200 dark:border-[#1A314D] shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
            {/* Header Limpio y homogéneo con el Design System global */}
            <div className="p-5 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between shrink-0">
              <h3 className="text-base sm:text-lg font-black text-[#0B1A2D] dark:text-white">
                Categorías de Productos
              </h3>

              <button
                type="button"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCategoryOld(null);
                  setNewCategoryName('');
                  setAddingProductToCat(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario para Añadir Categoría con Botón Oficial de Marca (Azul Profundo #0B1A2D y Letras Blancas/Limas) */}
            <form onSubmit={handleAddCategory} className="p-4 border-b border-slate-100 dark:border-[#1A314D] bg-slate-50/60 dark:bg-[#071220]/60 shrink-0">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                Crear Nueva Categoría
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ej. Batidos, Cervezas, Ropa..."
                    className="w-full pl-8.5 pr-3 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] text-xs font-semibold text-[#0B1A2D] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                {/* Botón con Fondo Azul #0B1A2D y Letras Blancas / Acento Verde Lima #B7F229 */}
                <button
                  type="submit"
                  disabled={!newCategoryName.trim()}
                  className="px-4 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs shrink-0 border border-[#0B1A2D]"
                >
                  <Plus className="w-3.5 h-3.5 text-[#B7F229]" />
                  <span className="text-white">Añadir Categoría</span>
                </button>
              </div>
            </form>

            {/* Lista de categorías con edición, borrado y botón ágil para añadir productos a cada una */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 overscroll-contain">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Categorías Activas ({customCategories.length})
              </div>

              {customCategories.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No hay categorías configuradas. Añade una para comenzar.
                </div>
              ) : (
                customCategories.map((cat) => {
                  const isEditing = editingCategoryOld === cat;
                  const catProducts = cafeProducts.filter((p) => p.category === cat);
                  const isAddingProduct = addingProductToCat === cat;

                  return (
                    <div
                      key={cat}
                      className="rounded-2xl bg-white dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs overflow-hidden transition"
                    >
                      {/* Cabecera de la categoría */}
                      <div className="flex items-center justify-between p-3 gap-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <input
                              type="text"
                              value={editingCategoryNew}
                              onChange={(e) => setEditingCategoryNew(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEditCategory(cat);
                                if (e.key === 'Escape') setEditingCategoryOld(null);
                              }}
                              autoFocus
                              className="w-full px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-[#0E2239] border border-[#8B5CF6] text-xs font-bold text-[#0B1A2D] dark:text-white focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditCategory(cat)}
                              className="p-1.5 rounded-lg bg-[#B7F229] text-[#0B1A2D] hover:bg-[#a5e01b] transition cursor-pointer"
                              title="Guardar nombre"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCategoryOld(null)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                              title="Cancelar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] shrink-0"></span>
                              <span className="text-xs font-bold text-[#0B1A2D] dark:text-white truncate">
                                {cat}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold shrink-0">
                                {catProducts.length} {catProducts.length === 1 ? 'artículo' : 'artículos'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {/* Botón ágil añadir producto a esta categoría */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (isAddingProduct) {
                                    setAddingProductToCat(null);
                                  } else {
                                    setAddingProductToCat(cat);
                                    setCatProductForm({ name: '', price: 2.5, stock: 50, imageUrl: '' });
                                  }
                                }}
                                className="px-2 py-1 rounded-lg bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] border border-[#B7F229]/50 hover:scale-102 text-[10px] font-black flex items-center gap-1 transition cursor-pointer"
                                title="Añadir producto directamente a esta categoría"
                              >
                                <Plus className="w-3 h-3 stroke-[2.5]" />
                                <span>Añadir Producto</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCategoryOld(cat);
                                  setEditingCategoryNew(cat);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                title="Editar nombre de categoría"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat)}
                                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                title="Eliminar categoría"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Formulario desplegable ágil para añadir producto directamente a esta categoría */}
                      {isAddingProduct && (
                        <form
                          onSubmit={(e) => handleAddProductToCategorySubmit(e, cat)}
                          className="p-3 bg-slate-50 dark:bg-[#0E2239] border-t border-slate-100 dark:border-[#1A314D] space-y-2.5 text-xs animate-in fade-in duration-150"
                        >
                          <div className="font-bold text-[#0B1A2D] dark:text-white text-[11px] flex items-center justify-between">
                            <span>Nuevo producto para "{cat}":</span>
                            <button
                              type="button"
                              onClick={() => setAddingProductToCat(null)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Nombre (ej. Café Doble)"
                              value={catProductForm.name}
                              onChange={(e) => setCatProductForm({ ...catProductForm, name: e.target.value })}
                              className="sm:col-span-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-xs font-semibold"
                            />
                            <div className="flex gap-2">
                              <input
                                type="number"
                                step="0.10"
                                required
                                placeholder="Precio €"
                                value={catProductForm.price}
                                onChange={(e) => setCatProductForm({ ...catProductForm, price: parseFloat(e.target.value) || 0 })}
                                className="w-1/2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-xs font-mono font-bold"
                              />
                              <input
                                type="number"
                                placeholder="Stock"
                                value={catProductForm.stock}
                                onChange={(e) => setCatProductForm({ ...catProductForm, stock: parseInt(e.target.value) || 0 })}
                                className="w-1/2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-xs font-mono font-bold"
                              />
                            </div>
                            <input
                              type="url"
                              placeholder="URL imagen (opcional)"
                              value={catProductForm.imageUrl}
                              onChange={(e) => setCatProductForm({ ...catProductForm, imageUrl: e.target.value })}
                              className="sm:col-span-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-xs"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            {/* Presets rápidos */}
                            <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
                              {PRESET_PRODUCT_IMAGES.slice(0, 3).map((p) => (
                                <button
                                  key={p.label}
                                  type="button"
                                  onClick={() => setCatProductForm({ ...catProductForm, imageUrl: p.url })}
                                  className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 font-medium hover:bg-slate-300"
                                >
                                  {p.label}
                                </button>
                              ))}
                            </div>

                            <button
                              type="submit"
                              className="px-3.5 py-1.5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white font-black text-xs flex items-center gap-1 transition cursor-pointer shadow-xs shrink-0"
                            >
                              <Plus className="w-3.5 h-3.5 text-[#B7F229]" />
                              <span>Crear Producto</span>
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Mini listado de productos existentes en esta categoría */}
                      {catProducts.length > 0 && (
                        <div className="px-3 pb-2.5 pt-1 border-t border-slate-100/60 dark:border-slate-800 flex flex-wrap gap-1.5">
                          {catProducts.map((p) => (
                            <span
                              key={p.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-[10px] text-slate-700 dark:text-slate-300"
                            >
                              <span className="font-semibold">{p.name}</span>
                              <span className="font-mono text-slate-400">({p.price.toFixed(2)}€)</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 dark:border-[#1A314D] flex justify-end bg-slate-50/50 dark:bg-slate-900/20 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setAddingProductToCat(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-[#0B1A2D] dark:bg-white text-white dark:text-[#0B1A2D] text-xs font-bold hover:bg-[#132A45] transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TICKET TÉRMICO OCULTO EN PANTALLA, VISIBLE EN IMPRESIÓN (80MM / 58MM) */}
      <div className="hidden thermal-ticket-print">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0' }}>{currentTenant.name.toUpperCase()}</h2>
          <p style={{ margin: '2px 0' }}>CIF: B-15984210 · TPV MOSTRADOR</p>
          <p style={{ margin: '2px 0' }}>{currentTenant.address || 'Polígono San Mateo, Narón'}</p>
          <p style={{ margin: '2px 0' }}>
            {selectedPaymentDetail ? `RECIBO DE VENTA #${selectedPaymentDetail.id}` : 'CIERRE / ARQUEO DE CAJA'}
          </p>
          <hr style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />
        </div>

        <div style={{ fontSize: '11px', marginBottom: '6px' }}>
          <div>FECHA: {new Date().toLocaleDateString('es-ES')} {new Date().toLocaleTimeString('es-ES')}</div>
          <div>ATENDIDO POR: {currentUser?.name || 'Recepción Mostrador'}</div>
          <div>ESTADO: {selectedPaymentDetail ? 'COBRADO / PAGADO' : 'TURNO CERRADO'}</div>
          <hr style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />
        </div>

        {selectedPaymentDetail ? (
          <div style={{ fontSize: '11px' }}>
            <div style={{ margin: '4px 0', fontWeight: 'bold' }}>DETALLE DE ARTÍCULOS:</div>
            {selectedPaymentDetail.items?.map((it, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                <span>{it.qty}x {it.name}</span>
                <span>{(it.qty * it.unitPrice).toFixed(2)} €</span>
              </div>
            ))}
            <hr style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13px', margin: '5px 0' }}>
              <span>TOTAL PAGADO:</span>
              <span>{selectedPaymentDetail.amount.toFixed(2)} €</span>
            </div>
            <div>MÉTODO: {selectedPaymentDetail.paymentMethod}</div>
          </div>
        ) : (
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
        )}

        <div style={{ textAlign: 'center', fontSize: '10px', marginTop: '10px' }}>
          <p>Documento justificativo de compra / TPV</p>
          <p>SETMIO PADEL PRO — Sistema de Gestión Deportiva</p>
        </div>
      </div>
    </div>
  );
};

export default AdminCafePOS;
