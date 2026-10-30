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
  concept: string;
  amount: number;
  paymentMethod: string;
  venueId?: string;
  venueName?: string;
  customerName?: string;
  cashierName?: string;
  items?: Array<{ name: string; qty: number; unitPrice: number; category?: string }>;
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
  const [sessionSalesTotal, setSessionSalesTotal] = useState(148.5);

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

  // Modal: Todos los Pagos (Historial del Turno)
  const [transactionsModalOpen, setTransactionsModalOpen] = useState(false);
  // Modal: Detalle Específico de un Pago
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState<POSTransactionItem | null>(null);

  const [posTransactions, setPosTransactions] = useState<POSTransactionItem[]>([
    {
      id: 'TX-101',
      time: '09:15',
      date: 'Hoy',
      concept: '2x Agua Mineral + 1x Café Espresso',
      amount: 5.5,
      paymentMethod: 'Tarjeta',
      venueId: venues?.[0]?.id || 'v-1',
      venueName: venues?.[0]?.name || 'Sede Principal',
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
      concept: 'Reserva Pista 2 (10:00) — Cuota 1/4',
      amount: 7.0,
      paymentMethod: 'Efectivo',
      venueId: venues?.[0]?.id || 'v-1',
      venueName: venues?.[0]?.name || 'Sede Principal',
      customerName: 'Diego Soto',
      cashierName: 'Laura Senra (Mostrador)',
      items: [
        { name: 'Reserva Pista 2 (10:00) — Cuota 1/4', qty: 1, unitPrice: 7.0, category: 'Reserva Pista' },
      ],
    },
    {
      id: 'TX-103',
      time: '11:20',
      date: 'Hoy',
      concept: 'Bote Bolas Head Pro S + 2x Powerade',
      amount: 12.0,
      paymentMethod: 'Monedero Socio',
      venueId: venues?.[1]?.id || venues?.[0]?.id || 'v-2',
      venueName: venues?.[1]?.name || 'Sede Indoor Norte',
      customerName: 'Ana Belén Vázquez',
      cashierName: 'Carlos M. (Entrenador)',
      items: [
        { name: 'Bote Bolas Head Pro S', qty: 1, unitPrice: 6.0, category: 'Grip/Pelotas' },
        { name: 'Isotónico Powerade', qty: 2, unitPrice: 3.0, category: 'Bebidas' },
      ],
    },
    {
      id: 'TX-104',
      time: '12:45',
      date: 'Hoy',
      concept: 'Recarga Monedero Socio (#SM-390)',
      amount: 50.0,
      paymentMethod: 'Tarjeta',
      venueId: venues?.[0]?.id || 'v-1',
      venueName: venues?.[0]?.name || 'Sede Principal',
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
      concept: '1x Overgrip Wilson + 1x Agua 1.5L',
      amount: 4.5,
      paymentMethod: 'Bizum / Online',
      venueId: venues?.[0]?.id || 'v-1',
      venueName: venues?.[0]?.name || 'Sede Principal',
      customerName: 'Javier Fraga',
      cashierName: 'Laura Senra (Mostrador)',
      items: [
        { name: 'Overgrip Wilson Pro', qty: 1, unitPrice: 2.5, category: 'Grip/Pelotas' },
        { name: 'Agua Mineral 1.5L', qty: 1, unitPrice: 2.0, category: 'Bebidas' },
      ],
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
  const [showInlineNewCategory, setShowInlineNewCategory] = useState(false);
  const [inlineCategoryName, setInlineCategoryName] = useState('');

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

    const activeVenueObj = hasMultipleVenues && posVenueFilter !== 'all'
      ? venues.find((v) => v.id === posVenueFilter)
      : (venues?.[0] || undefined);

    const methodLabel = availablePaymentMethods.find((m) => m.id === paymentMethod)?.label || 'TPV';

    const customerMeta =
      posCart.find((i) => i.meta?.memberName)?.meta?.memberName ||
      posCart.find((i) => i.meta?.participantName)?.meta?.participantName ||
      'Cliente Mostrador';

    const newTx: POSTransactionItem = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('es-ES'),
      concept: posCart.map((i) => `${i.qty}x ${i.product.name}`).join(', '),
      amount: cartTotal,
      paymentMethod: methodLabel,
      venueId: activeVenueObj?.id,
      venueName: activeVenueObj?.name,
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
    setProductFormData({
      name: '',
      category: customCategories[0] || 'Bebidas',
      price: 2.5,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=400&q=80',
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
    <div className="max-w-7xl mx-auto pt-2 pb-16 space-y-4 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased">
      {/* ======================================================================
          1. CABECERA LIMPIA Y SIMÉTRICA (ESTILO INICIO, RESERVAS & PARTIDAS)
          ====================================================================== */}
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
                    <span>Todas las Sedes (Consolidado)</span>
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
                {filteredTransactions.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">tickets</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">En sesión de caja</span>
          </div>

          <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ticket Medio</span>
            <div className="my-0.5">
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-[#0B1A2D] dark:text-white tracking-tight">
                {filteredTransactions.length > 0 ? (sessionSalesTotal / filteredTransactions.length).toFixed(2) : '0.00'} €
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

        {/* Retícula Simétrica 2x2 de Acciones Principales (Diseño Unificado, Alineación a la Izquierda) */}
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

          {/* 2. Nuevo Producto */}
          <button
            type="button"
            onClick={openNewProductModal}
            className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-[#0E2239] hover:bg-slate-50 dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex items-center justify-start text-left gap-2.5 sm:gap-3 transition active:scale-95 cursor-pointer group"
            title="Añadir nuevo producto al mostrador"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#152e4d] flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 group-hover:text-[#0B1A2D] dark:group-hover:text-[#B7F229] transition-colors">
              <Package className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#0B1A2D] dark:text-white truncate">
              Nuevo Producto
            </span>
          </button>

          {/* 3. Todos los Pagos */}
          <button
            type="button"
            onClick={() => setTransactionsModalOpen(true)}
            className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-[#0E2239] hover:bg-slate-50 dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex items-center justify-start text-left gap-2.5 sm:gap-3 transition active:scale-95 cursor-pointer group"
            title="Ver todos los pagos del turno"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#152e4d] flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 group-hover:text-[#0B1A2D] dark:group-hover:text-[#B7F229] transition-colors">
              <Receipt className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#0B1A2D] dark:text-white truncate">
              Todos los Pagos
            </span>
            <span className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#152e4d] text-slate-600 dark:text-slate-300 font-bold shrink-0">
              {filteredTransactions.length}
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

      {/* 2. POS Interface: Product Catalog + Fast Ticket Register */}
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

            {posTransactions.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                No hay pagos registrados todavía en este turno.
              </div>
            ) : (
              <div className="space-y-2">
                {posTransactions.slice(0, 5).map((tx) => (
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

      {/* ======================================================================
          2.5 MODAL FIJO: "TODOS LOS PAGOS" (HISTORIAL COMPLETO CON SCROLL INTERIOR)
          ====================================================================== */}
      {transactionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1A2D]/75 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col max-h-[88vh] overflow-hidden">
            {/* Header Fijo con X perfectamente alineada a la derecha */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center font-bold shrink-0">
                  <Receipt className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-[#0B1A2D] dark:text-white truncate">
                      Todos los Pagos
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#0B1A2D] dark:text-slate-300 font-mono text-[10px] font-black">
                      {filteredTransactions.length}
                    </span>
                  </div>
                  {/* Resumen simplificado de sede y empleado/usuario del turno */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      <span>{hasMultipleVenues && posVenueFilter !== 'all' ? (venues.find(v => v.id === posVenueFilter)?.name || selectedVenue.name) : (isConsolidatedView ? 'Todas las sedes' : selectedVenue.name)}</span>
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <User className="w-3.5 h-3.5 text-[#82b805] dark:text-[#B7F229]" />
                      <span>Atendido por: <strong>{currentUser?.name || 'Recepción Mostrador'}</strong></span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {hasMultipleVenues && (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border border-slate-200/80 dark:border-slate-700/80">
                    <Building2 className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
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
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Cerrar ventana"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Listado de Pagos con Scroll Interior Controlado */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-2.5 overscroll-contain">
              {filteredTransactions.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <Receipt className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                  No hay transacciones registradas en este turno.
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => {
                      setSelectedPaymentDetail(tx);
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#071220]/60 hover:bg-white dark:hover:bg-[#132A45] border border-slate-200/80 dark:border-[#1A314D] transition-all flex items-center justify-between gap-4 text-xs cursor-pointer group shadow-2xs hover:shadow-sm"
                    title="Haz clic para abrir los detalles específicos de este pago"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-400 text-[11px] shrink-0">{tx.time}</span>
                        <span className="font-mono font-black text-[10px] px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                          #{tx.id}
                        </span>
                        <span className="font-bold text-[#0B1A2D] dark:text-white truncate group-hover:text-[#8B5CF6] transition-colors">
                          {tx.concept}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{tx.customerName || 'Cliente Mostrador'}</span>
                        <span>·</span>
                        <span className="text-[#8B5CF6] font-medium">{tx.paymentMethod}</span>
                        <span>·</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium inline-flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Atendido por: <strong>{tx.cashierName || 'Recepción Mostrador'}</strong></span>
                        </span>
                        {tx.venueName && (
                          <>
                            <span>·</span>
                            <span className="text-slate-400 text-[10px]">{tx.venueName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-3">
                      <div>
                        <div className="font-mono font-black text-sm text-[#0B1A2D] dark:text-[#B7F229]">
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
            </div>

            {/* Footer Fijo con Totalizador */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between text-xs bg-slate-50/60 dark:bg-[#071220]/50 shrink-0">
              <span className="text-slate-500 font-semibold">
                Total en turno ({filteredTransactions.length} pagos):
              </span>
              <span className="font-mono font-black text-lg text-[#0B1A2D] dark:text-white">
                {filteredTransactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          2.6 MODAL: PÁGINA DE DETALLES ESPECÍFICOS DEL PAGO SELECCIONADO
          ====================================================================== */}
      {selectedPaymentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1A2D]/80 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center font-bold">
                  <Receipt className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-[#0B1A2D] dark:text-white">
                      Detalle del Pago #{selectedPaymentDetail.id}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] border border-[#B7F229]/50 font-black text-[9px] uppercase tracking-wider">
                      Completado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {selectedPaymentDetail.date || 'Hoy'} · {selectedPaymentDetail.time}
                  </p>
                </div>
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
                    {selectedPaymentDetail.venueName || selectedVenue.name}
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
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-[#1A314D] flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/60 dark:bg-[#071220]/50 shrink-0">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0B1A2D] dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Imprimir Recibo</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerDemoToast('Recibo Enviado', `Comprobante digital enviado a ${selectedPaymentDetail.customerName || 'cliente'}.`, 'success');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0B1A2D] dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Enviar Recibo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentDetail(null)}
                  className="px-4 py-2 rounded-xl bg-[#0B1A2D] dark:bg-white text-white dark:text-[#0B1A2D] font-bold text-xs transition cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          3. MODAL: CIERRE / ARQUEO DE CAJA DEL TURNO (REDISENO MINIMALISTA ELEGANTE)
          ====================================================================== */}
      {arqueoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1A2D]/75 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header Fijo con X correctamente alineada */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center font-bold">
                  <Calculator className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0B1A2D] dark:text-white">
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
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenedor Superior de Resumen de Arqueo Rediseñado (Minimalista y Elegante) */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain">
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
                    {sessionSalesTotal.toFixed(2)} €
                  </div>
                  <div className="text-right text-[11px] text-slate-300 space-y-0.5">
                    <div>{new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                    <div className="font-mono text-slate-300">Apertura: 08:30 h</div>
                  </div>
                </div>
                <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-slate-300 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#B7F229]" />
                    <span>{isConsolidatedView ? 'Todas las Sedes' : selectedVenue.name}</span>
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
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                        <CreditCard className="w-3.5 h-3.5 text-[#8B5CF6]" /> TPV / Tarjeta
                      </span>
                    </div>
                    <div className="text-lg font-mono font-black text-[#0B1A2D] dark:text-white">
                      {(sessionSalesTotal * 0.58).toFixed(2)} €
                    </div>
                    <div className="text-[10px] text-slate-400">58% de las operaciones</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                        <Banknote className="w-3.5 h-3.5 text-emerald-500" /> Efectivo
                      </span>
                    </div>
                    <div className="text-lg font-mono font-black text-[#0B1A2D] dark:text-white">
                      {(sessionSalesTotal * 0.28).toFixed(2)} €
                    </div>
                    <div className="text-[10px] text-slate-400">Cajón portamonedas</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                        <Wallet className="w-3.5 h-3.5 text-purple-500" /> Monedero
                      </span>
                    </div>
                    <div className="text-lg font-mono font-black text-[#0B1A2D] dark:text-white">
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
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-2 text-xs">
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
                    <span className="font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                      {(sessionSalesTotal * 0.38).toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Recargas de Saldo y Material</span>
                    <span className="font-mono font-bold">{(sessionSalesTotal * 0.14).toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer de Arqueo: Fila superior de 2 botones y botón inferior "Cerrar Turno Oficial" ocupando exactamente el mismo ancho total */}
            <div className="p-5 border-t border-slate-100 dark:border-[#1A314D] space-y-2.5 bg-slate-50/60 dark:bg-[#071220]/50 shrink-0">
              {/* Fila Superior: 2 botones en grid de ancho total */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  type="button"
                  onClick={handleExportArqueoCSV}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0B1A2D] dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span className="truncate">Exportar CSV/PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintThermalArqueo}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0B1A2D] dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="truncate">Imprimir Ticket (80mm)</span>
                </button>
              </div>

              {/* Botón Inferior: Exactamente el mismo ancho total (w-full) en Azul Profundo #0B1A2D con texto en Verde Lima #B7F229 */}
              <button
                type="button"
                onClick={() => {
                  setSessionSalesTotal(0);
                  setArqueoModalOpen(false);
                  triggerDemoToast('Caja Cerrada', 'El turno ha sido cerrado y el contador de caja reiniciado a 0.00 €.', 'success');
                }}
                className="w-full py-3 rounded-xl bg-[#0B1A2D] dark:bg-[#071220] hover:bg-[#132A45] dark:hover:bg-[#0E2239] text-[#B7F229] border border-[#0B1A2D] dark:border-[#1A314D] font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.99]"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1A2D]/75 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
                  <Package className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B1A2D] dark:text-white">
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
                  className="px-3 py-1.5 rounded-xl bg-[#B7F229] hover:bg-[#a6e61f] text-[#0B1A2D] font-black text-xs shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>+ Producto</span>
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
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs hover:border-[#8B5CF6]/50 transition cursor-pointer"
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
                      <div className="font-bold text-[#0B1A2D] dark:text-white truncate">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
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
                      className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition cursor-pointer"
                      title="Ver detalle del producto"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditProductModal(p)}
                      className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-[#8B5CF6] hover:text-white transition cursor-pointer"
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

      {/* ======================================================================
          FORMULARIO NUEVO / EDITAR PRODUCTO (CON SELECTOR DE CATEGORÍA OBLIGATORIO Y ACCESO DIRECTO PARA CREAR NUEVA)
          ====================================================================== */}
      {productFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1A2D]/75 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <h3 className="text-base font-black text-[#0B1A2D] dark:text-white">
                {editingProduct ? 'Editar Producto TPV' : 'Nuevo Producto TPV'}
              </h3>
              <button
                type="button"
                onClick={() => setProductFormModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  placeholder="Ej: Zumo de Naranja Natural"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              {/* Selector Obligatorio de Categoría + Acceso Directo Limpio para Crear Nueva Categoría */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Categoría <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowInlineNewCategory(!showInlineNewCategory)}
                    className="text-[11px] font-bold text-[#8B5CF6] hover:text-[#7c3aed] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                    <span>{showInlineNewCategory ? 'Cancelar' : '+ Nueva Categoría'}</span>
                  </button>
                </div>

                {showInlineNewCategory ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nombre de la nueva categoría..."
                      value={inlineCategoryName}
                      onChange={(e) => setInlineCategoryName(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-[#8B5CF6] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCreateInlineCategory}
                      className="px-3.5 py-2 bg-[#0B1A2D] hover:bg-[#132A45] text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6] font-semibold"
                  >
                    {customCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Precio (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Stock Inicial (uds)</label>
                  <input
                    type="number"
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({ ...productFormData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Imagen del Producto (URL o Presets)
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
                    Presets de imagen recomendados:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_PRODUCT_IMAGES.map((imgItem) => (
                      <button
                        key={imgItem.label}
                        type="button"
                        onClick={() => setProductFormData({ ...productFormData, imageUrl: imgItem.url })}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                          productFormData.imageUrl === imgItem.url
                            ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-[#8B5CF6]'
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
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0B1A2D] dark:text-slate-300 font-bold rounded-xl cursor-pointer flex items-center gap-1 shrink-0 transition text-xs border border-slate-200/80 dark:border-slate-700/80">
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

              <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6e61f] text-[#0B1A2D] font-black shadow-xs cursor-pointer active:scale-95"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: PÁGINA DE DETALLE COMPLETO DE PRODUCTO
          ====================================================================== */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1A2D]/75 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
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
              <span className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-xl bg-[#0B1A2D]/85 backdrop-blur-xs text-xs font-mono font-black text-white">
                {selectedProductDetail.price.toFixed(2)} €
              </span>
              <span className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
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
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Precio Venta</span>
                <span className="text-base font-black font-mono text-[#0B1A2D] dark:text-[#B7F229]">
                  {selectedProductDetail.price.toFixed(2)} €
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Existencias</span>
                <span className="text-base font-black font-mono text-[#0B1A2D] dark:text-white">
                  {selectedProductDetail.stock} uds
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Estado</span>
                <span className="text-xs font-bold text-[#8B5CF6]">
                  {selectedProductDetail.active !== false ? 'Activo en Caja' : 'Inactivo'}
                </span>
              </div>
            </div>

            {/* Acciones principales */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1A2D]/75 backdrop-blur-xs p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1A2D]/75 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
                  <Layers className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <h3 className="text-base font-black text-[#0B1A2D] dark:text-white">
                  Cobro de Reserva o Recarga de Socio
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pestañas: Reservas vs Monedero */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setAssignTab('bookings')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  assignTab === 'bookings'
                    ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#8B5CF6]"
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
                                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#8B5CF6] text-left text-[11px] transition flex items-center justify-between cursor-pointer active:scale-95"
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
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#8B5CF6]"
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
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
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
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs w-32 focus:outline-none focus:border-[#8B5CF6]"
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
      )}

      {/* ======================================================================
          MODAL: GESTIÓN DE CATEGORÍAS (ALTA CON BOTÓN DE MARCA AZUL/LIMA, EDICIÓN Y AÑADIR PRODUCTOS ÁGIL)
          ====================================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1A2D]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0E2239] rounded-3xl max-w-lg w-full border border-slate-200 dark:border-[#1A314D] shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
            {/* Header Limpio sin subtítulos innecesarios, con X alineada a la derecha */}
            <div className="p-5 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-[#0B1A2D] dark:text-white">
                  Categorías de Hostelería y Tienda
                </h3>
              </div>

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
