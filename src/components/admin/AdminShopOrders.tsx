import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types/database';
import padelRacketVertexImg from '../../assets/images/padel_racket_vertex_1794765127055.jpg';
import padelBallsHeadImg from '../../assets/images/padel_balls_head_1794765127966.jpg';
import padelRacketNoxImg from '../../assets/images/padel_racket_nox_1794765127749.jpg';
import padelShoesAsicsImg from '../../assets/images/padel_shoes_asics_1794765128696.jpg';
import {
  ShoppingBag,
  Package,
  Plus,
  CheckCircle2,
  TrendingUp,
  Search,
  DollarSign,
  ArrowUpRight,
  ArrowLeft,
  X,
  Check,
  Tag,
  Boxes,
  Percent,
  User,
  CreditCard,
  Wallet,
  Banknote,
  Receipt,
  Printer,
  Building2,
  Eye,
  Share2,
} from 'lucide-react';
import { AdminSectionHeader } from './AdminSectionHeader';

export interface ShopOrder {
  id: string;
  customerName: string;
  customerType: 'member' | 'walk_in';
  memberNum?: string;
  items: {
    productId: string;
    productName: string;
    category: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  totalAmount: number;
  paymentMethod: 'card' | 'cash' | 'wallet' | 'direct_debit';
  status: 'entregado' | 'preparado' | 'pendiente' | 'cancelado';
  createdAt: string;
  venueId?: string;
  venueName?: string;
  notes?: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface MockCustomer {
  id: string;
  name: string;
  memberNum: string;
  balance: number;
  email: string;
}

const MOCK_CUSTOMERS: MockCustomer[] = [
  { id: 'c-1', name: 'Carlos Méndez', memberNum: 'SM-408', balance: 45.0, email: 'carlos.mendez@galiciapadel.com' },
  { id: 'c-2', name: 'Diego Soto', memberNum: 'SM-409', balance: 18.5, email: 'diego.soto@email.es' },
  { id: 'c-3', name: 'Laura Gómez', memberNum: 'SM-410', balance: 62.0, email: 'laura.gomez@padelclub.com' },
  { id: 'c-4', name: 'Marcos Varela', memberNum: 'SM-411', balance: 10.0, email: 'marcos.varela@email.com' },
  { id: 'c-5', name: 'Ana Belén Vázquez', memberNum: 'SM-412', balance: 85.0, email: 'anabelen@padelgalicia.com' },
];

const INITIAL_ORDERS: ShopOrder[] = [
  {
    id: 'PED-2026-804',
    customerName: 'Carlos Méndez',
    customerType: 'member',
    memberNum: 'SM-408',
    items: [
      { productId: 'prod-1', productName: 'Bullpadel Vertex 04 2026', category: 'palas', quantity: 1, unitPrice: 285.0, subtotal: 285.0 },
      { productId: 'prod-4', productName: 'Tripack Pelotas Head Padel Pro S', category: 'accesorios', quantity: 2, unitPrice: 7.0, subtotal: 14.0 },
    ],
    totalAmount: 299.0,
    paymentMethod: 'card',
    status: 'entregado',
    createdAt: 'Hoy, 12:45',
    venueId: 'venue-san-mateo',
    venueName: 'Sede Central Narón',
    notes: 'Recogido en mostrador de tienda.',
  },
  {
    id: 'PED-2026-803',
    customerName: 'Laura Gómez',
    customerType: 'member',
    memberNum: 'SM-410',
    items: [
      { productId: 'prod-3', productName: 'Asics Gel-Resolution Padel Clay', category: 'zapatillas', quantity: 1, unitPrice: 145.0, subtotal: 145.0 },
    ],
    totalAmount: 145.0,
    paymentMethod: 'wallet',
    status: 'preparado',
    createdAt: 'Hoy, 11:20',
    venueId: 'venue-coruna',
    venueName: 'Sede A Coruña',
    notes: 'Preparado en recepción para entrega antes de su partido.',
  },
  {
    id: 'PED-2026-802',
    customerName: 'Diego Soto',
    customerType: 'member',
    memberNum: 'SM-409',
    items: [
      { productId: 'prod-4', productName: 'Cajón 24 Botes Pelotas Head Padel Pro S', category: 'accesorios', quantity: 1, unitPrice: 120.0, subtotal: 120.0 },
      { productId: 'prod-5', productName: 'Pack 3 Overgrips Wilson Pro Comfort', category: 'accesorios', quantity: 3, unitPrice: 6.0, subtotal: 18.0 },
    ],
    totalAmount: 138.0,
    paymentMethod: 'direct_debit',
    status: 'entregado',
    createdAt: 'Ayer, 18:30',
    venueId: 'venue-san-mateo',
    venueName: 'Sede Central Narón',
  },
  {
    id: 'PED-2026-801',
    customerName: 'Cliente Mostrador (Venta Rápida)',
    customerType: 'walk_in',
    items: [
      { productId: 'prod-5', productName: 'Pack 3 Overgrips Wilson Pro Comfort', category: 'accesorios', quantity: 2, unitPrice: 6.0, subtotal: 12.0 },
      { productId: 'prod-4', productName: 'Bote Pelotas Head Padel Pro S', category: 'accesorios', quantity: 1, unitPrice: 7.0, subtotal: 7.0 },
    ],
    totalAmount: 19.0,
    paymentMethod: 'cash',
    status: 'entregado',
    createdAt: 'Ayer, 16:15',
    venueId: 'venue-santiago',
    venueName: 'Sede Santiago',
  },
  {
    id: 'PED-2026-800',
    customerName: 'Marcos Varela',
    customerType: 'member',
    memberNum: 'SM-411',
    items: [
      { productId: 'prod-2', productName: 'Nox AT10 Genius 18K Agustín Tapia', category: 'palas', quantity: 1, unitPrice: 299.0, subtotal: 299.0 },
    ],
    totalAmount: 299.0,
    paymentMethod: 'card',
    status: 'pendiente',
    createdAt: '02/10/2026',
    venueId: 'venue-san-mateo',
    venueName: 'Sede Central Narón',
    notes: 'Pendiente de llegada de almacén central.',
  },
];

const LOCAL_PRODUCT_IMAGE_MAP: Record<string, string> = {
  'prod-1': padelRacketVertexImg,
  'prod-2': padelRacketNoxImg,
  'prod-3': padelShoesAsicsImg,
  'prod-4': padelBallsHeadImg,
};

const getFallbackProductImage = (category: Product['category'] | string) => {
  switch (category) {
    case 'palas':
      return padelRacketVertexImg;
    case 'zapatillas':
    case 'ropa':
      return padelShoesAsicsImg;
    case 'accesorios':
    case 'paleteros':
    default:
      return padelBallsHeadImg;
  }
};

interface ProductThumbProps {
  src?: string;
  alt: string;
  className?: string;
  category?: string;
}

const ProductThumb: React.FC<ProductThumbProps> = ({ src, alt, className = 'w-11 h-11 rounded-xl', category = 'palas' }) => {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = !hasError && src ? src : getFallbackProductImage(category);

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-[#071220] border border-slate-200/70 dark:border-[#1A314D] shrink-0 flex items-center justify-center ${className}`}>
      {!hasError ? (
        <img
          src={resolvedSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <ShoppingBag className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229] opacity-60" />
      )}
    </div>
  );
};

export const AdminShopOrders: React.FC = () => {
  const { products, triggerDemoToast, currentTenant, isMultiVenue, venues, navigateToPlayerProfile, addToCart } = useApp();

  // Vista activa: 'tienda' | 'pedidos' | 'new_order'
  const [activeView, setActiveView] = useState<'tienda' | 'pedidos' | 'new_order'>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p.includes('/pedidos/nuevo') || p.includes('/nuevo-pedido')) return 'new_order';
      if (p.includes('/pedidos')) return 'pedidos';
    }
    return 'tienda';
  });

  // Menú desplegable "+"
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setIsActionMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lista de productos con imágenes locales fiables y desglose multi-sede
  const [productList, setProductList] = useState<(Product & { venueStock?: Record<string, number> })[]>(() => {
    return products.map((p, idx) => {
      const total = p.stock || 8;
      const sanMateo = Math.ceil(total * 0.6);
      const coruna = Math.floor(total * 0.25);
      const santiago = Math.max(0, total - sanMateo - coruna);
      const localImg = LOCAL_PRODUCT_IMAGE_MAP[p.id] || getFallbackProductImage(p.category);

      return {
        ...p,
        imageUrl: localImg,
        specs: p.specs || {
          Forma: idx % 2 === 0 ? 'Diamante' : 'Lágrima',
          Balance: idx % 2 === 0 ? 'Alto (Potencia)' : 'Medio (Control)',
          Peso: '365 - 375 gr',
          Núcleo: 'Goma MultiEVA Soft',
          Marco: '100% CarbonTube',
          Nivel: 'Avanzado / Profesional',
        },
        venueStock: {
          'venue-san-mateo': sanMateo,
          'venue-coruna': coruna,
          'venue-santiago': santiago,
        },
      };
    });
  });

  // Pedidos
  const [orders, setOrders] = useState<ShopOrder[]>(() => {
    try {
      const saved = localStorage.getItem('setmio_demo_shop_orders_v2');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('setmio_demo_shop_orders_v2', JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  // Filtros y búsqueda
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pendiente' | 'preparado' | 'entregado'>('all');
  const [orderVenueFilter, setOrderVenueFilter] = useState<string>('all');

  // Gráfico interactivo de Evolución de Ingresos
  const [timeRange, setTimeRange] = useState<'month' | 'day'>('month');
  const [selectedBarIndex, setSelectedBarIndex] = useState<number>(11);

  // Modales
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<(Product & { venueStock?: Record<string, number> }) | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<ShopOrder | null>(null);
  const [stockModalProduct, setStockModalProduct] = useState<(Product & { venueStock?: Record<string, number> }) | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState<number>(10);
  const [stockAdjustmentVenue, setStockAdjustmentVenue] = useState<string>('venue-san-mateo');
  const [stockMinAlert, setStockMinAlert] = useState<number>(3);

  // Nuevo pedido (TPV)
  const [orderCustomerType, setOrderCustomerType] = useState<'walk_in' | 'member'>('walk_in');
  const [selectedCustomer, setSelectedCustomer] = useState<MockCustomer | null>(null);
  const [orderCart, setOrderCart] = useState<OrderItem[]>([]);
  const [orderPaymentMethod, setOrderPaymentMethod] = useState<'card' | 'cash' | 'wallet' | 'direct_debit'>('card');
  const [orderDiscount, setOrderDiscount] = useState<number>(0);
  const [orderVenue, setOrderVenue] = useState<string>('venue-san-mateo');
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState<string | null>(null);

  // Formulario Nuevo Producto
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    brand: 'Bullpadel',
    category: 'palas' as Product['category'],
    price: 180,
    costPrice: 110,
    stock: 8,
    targetVenue: 'venue-san-mateo',
    imageUrl: padelRacketVertexImg,
    description: 'Pala oficial de competición con fibra de carbono 12K y tubular 100% de grafeno.',
  });

  const navigateTo = (view: 'tienda' | 'pedidos' | 'new_order', url: string) => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Datos de gráfico
  const monthlySales = useMemo(
    () => [
      { label: 'Ene', fullLabel: 'Enero', sales: 4200, orders: 48 },
      { label: 'Feb', fullLabel: 'Febrero', sales: 3800, orders: 41 },
      { label: 'Mar', fullLabel: 'Marzo', sales: 5600, orders: 62 },
      { label: 'Abr', fullLabel: 'Abril', sales: 6100, orders: 70 },
      { label: 'May', fullLabel: 'Mayo', sales: 7400, orders: 84 },
      { label: 'Jun', fullLabel: 'Junio', sales: 8900, orders: 98 },
      { label: 'Jul', fullLabel: 'Julio', sales: 9200, orders: 104 },
      { label: 'Ago', fullLabel: 'Agosto', sales: 7800, orders: 86 },
      { label: 'Sep', fullLabel: 'Septiembre', sales: 11200, orders: 128 },
      { label: 'Oct', fullLabel: 'Octubre', sales: 12450, orders: 142 },
      { label: 'Nov', fullLabel: 'Noviembre', sales: 13100, orders: 150 },
      { label: 'Dic', fullLabel: 'Diciembre', sales: 14800, orders: 168 },
    ],
    []
  );

  const dailySales = useMemo(
    () => [
      { label: 'Lun', fullLabel: 'Lunes', sales: 380, orders: 4 },
      { label: 'Mar', fullLabel: 'Martes', sales: 520, orders: 6 },
      { label: 'Mié', fullLabel: 'Miércoles', sales: 450, orders: 5 },
      { label: 'Jue', fullLabel: 'Jueves', sales: 680, orders: 8 },
      { label: 'Vie', fullLabel: 'Viernes', sales: 940, orders: 11 },
      { label: 'Sáb', fullLabel: 'Sábado', sales: 1450, orders: 18 },
      { label: 'Dom', fullLabel: 'Domingo', sales: 1120, orders: 14 },
    ],
    []
  );

  const chartData = timeRange === 'month' ? monthlySales : dailySales;
  const maxSale = Math.max(...chartData.map((d) => d.sales), 1);
  const safeSelectedIndex = Math.min(selectedBarIndex, chartData.length - 1);
  const activeChartPoint = chartData[safeSelectedIndex];

  const handleTimeRangeChange = (nextRange: 'month' | 'day') => {
    setTimeRange(nextRange);
    setSelectedBarIndex(nextRange === 'month' ? monthlySales.length - 1 : dailySales.length - 1);
  };

  // Top Ventas del Mes con miniaturas locales verificadas (sin iconos de imagen rota)
  const topSellers = useMemo(
    () => [
      {
        id: 'top-1',
        productId: 'prod-1',
        name: 'Bullpadel Vertex 04 2026',
        brand: 'Bullpadel',
        category: 'palas',
        unitsSold: 34,
        revenue: 8840,
        stock: 7,
        avatar: padelRacketVertexImg,
      },
      {
        id: 'top-2',
        productId: 'prod-4',
        name: 'Cajón 24 Botes Head Padel Pro S',
        brand: 'Head',
        category: 'accesorios',
        unitsSold: 62,
        revenue: 7440,
        stock: 35,
        avatar: padelBallsHeadImg,
      },
      {
        id: 'top-3',
        productId: 'prod-2',
        name: 'Nox AT10 Genius 18K Tapia',
        brand: 'Nox',
        category: 'palas',
        unitsSold: 28,
        revenue: 7280,
        stock: 4,
        avatar: padelRacketNoxImg,
      },
      {
        id: 'top-4',
        productId: 'prod-3',
        name: 'Zapatillas Asics Gel-Resolution',
        brand: 'Asics',
        category: 'zapatillas',
        unitsSold: 41,
        revenue: 5330,
        stock: 12,
        avatar: padelShoesAsicsImg,
      },
    ],
    []
  );

  // Filtrado de catálogo
  const filteredProducts = useMemo(() => {
    return productList.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [productList, search, selectedCategory]);

  // Filtrado de pedidos
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.items.some((i) => i.productName.toLowerCase().includes(q));

      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const matchVenue = orderVenueFilter === 'all' || o.venueId === orderVenueFilter;
      return matchSearch && matchStatus && matchVenue;
    });
  }, [orders, search, orderStatusFilter, orderVenueFilter]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) return;

    const initialStock = Number(newProductForm.stock);
    const created: Product & { venueStock?: Record<string, number> } = {
      id: `prod-${Date.now()}`,
      tenantId: currentTenant.id,
      name: newProductForm.name.trim(),
      brand: newProductForm.brand.trim(),
      category: newProductForm.category,
      price: Number(newProductForm.price),
      stock: initialStock,
      imageUrl: newProductForm.imageUrl.trim() || getFallbackProductImage(newProductForm.category),
      description: newProductForm.description,
      isFeatured: true,
      specs: {
        Forma: 'Lágrima',
        Balance: 'Medio',
        Peso: '365 gr',
        Núcleo: 'Goma EVA Pro',
        Marco: 'Carbono 100%',
        Nivel: 'Competición',
      },
      venueStock: {
        [newProductForm.targetVenue]: initialStock,
      },
    };

    setProductList((prev) => [created, ...prev]);
    setIsNewProductModalOpen(false);
    setNewProductForm({
      name: '',
      brand: 'Bullpadel',
      category: 'palas',
      price: 180,
      costPrice: 110,
      stock: 8,
      targetVenue: 'venue-san-mateo',
      imageUrl: padelRacketVertexImg,
      description: 'Pala oficial de competición con fibra de carbono 12K y tubular 100% de grafeno.',
    });
    triggerDemoToast(
      'Producto Creado',
      `"${created.name}" añadido al catálogo con ${created.stock} unidades.`,
      'success'
    );
  };

  const handleSaveStock = () => {
    if (!stockModalProduct) return;
    const currentVenueStock = stockModalProduct.venueStock || {};
    const existingInVenue = currentVenueStock[stockAdjustmentVenue] || 0;
    const newInVenue = Math.max(0, existingInVenue + stockAdjustment);

    const updatedVenueStock = {
      ...currentVenueStock,
      [stockAdjustmentVenue]: newInVenue,
    };

    const newTotalStock = Object.values(updatedVenueStock).reduce((a, b) => a + b, 0);

    setProductList((prev) =>
      prev.map((p) =>
        p.id === stockModalProduct.id
          ? { ...p, stock: newTotalStock, venueStock: updatedVenueStock }
          : p
      )
    );

    const venueObj = venues?.find((v) => v.id === stockAdjustmentVenue);
    triggerDemoToast(
      'Stock Actualizado',
      `Inventario de "${stockModalProduct.name}" actualizado en ${venueObj?.name || 'Sede Seleccionada'}: ${newInVenue} uds (${newTotalStock} totales).`,
      'success'
    );
    setStockModalProduct(null);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: ShopOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    triggerDemoToast(
      'Estado del Pedido Actualizado',
      `El pedido ${orderId} ahora está marcado como "${newStatus.toUpperCase()}".`,
      'success'
    );
  };

  const handleStartSaleWithProduct = (product: Product) => {
    addToCart(product);
    setOrderCart([{ product, quantity: 1 }]);
    setLastCreatedOrderId(null);
    setOrderDiscount(0);
    navigateTo('new_order', '/admin/tienda/pedidos/nuevo');
  };

  const handleCompleteOrder = () => {
    if (orderCart.length === 0) {
      triggerDemoToast('Cesta vacía', 'Añade al menos un producto para procesar el pedido.', 'warning');
      return;
    }

    const subtotal = orderCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const total = Math.max(0, subtotal - orderDiscount);
    const orderId = `PED-2026-${Math.floor(805 + Math.random() * 50)}`;
    const venueObj = venues?.find((v) => v.id === orderVenue);

    const newOrder: ShopOrder = {
      id: orderId,
      customerName: orderCustomerType === 'member' && selectedCustomer ? selectedCustomer.name : 'Cliente Mostrador (Venta Rápida)',
      customerType: orderCustomerType,
      memberNum: selectedCustomer?.memberNum,
      items: orderCart.map((ci) => ({
        productId: ci.product.id,
        productName: ci.product.name,
        category: ci.product.category,
        quantity: ci.quantity,
        unitPrice: ci.product.price,
        subtotal: ci.product.price * ci.quantity,
      })),
      totalAmount: total,
      paymentMethod: orderPaymentMethod,
      status: 'entregado',
      createdAt: 'Ahora mismo',
      venueId: orderVenue,
      venueName: venueObj?.name || 'Sede Central Narón',
    };

    setProductList((prev) =>
      prev.map((p) => {
        const cartItem = orderCart.find((ci) => ci.product.id === p.id);
        if (cartItem) {
          const newTotal = Math.max(0, p.stock - cartItem.quantity);
          const currentVs = p.venueStock || {};
          const currentInVenue = currentVs[orderVenue] ?? newTotal;
          const updatedVs = { ...currentVs, [orderVenue]: Math.max(0, currentInVenue - cartItem.quantity) };
          return { ...p, stock: newTotal, venueStock: updatedVs };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrderId(orderId);
    triggerDemoToast(
      'Venta Completada',
      `Ticket #${orderId} registrado por ${total.toFixed(2)} €. Stock actualizado.`,
      'success'
    );
  };

  const resetNewOrder = () => {
    setOrderCart([]);
    setOrderDiscount(0);
    setSelectedCustomer(null);
    setLastCreatedOrderId(null);
  };

  const getProductCost = (price: number) => Math.round(price * 0.58);
  const getProductMarginPercent = (price: number) => {
    const cost = getProductCost(price);
    return Math.round(((price - cost) / price) * 100);
  };

  const totalCatalogUnits = productList.reduce((acc, p) => acc + p.stock, 0);
  const totalCatalogValue = productList.reduce((acc, p) => acc + p.price * p.stock, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pendiente' || o.status === 'preparado').length;

  return (
    <div className="max-w-7xl mx-auto pb-24 sm:pb-16 space-y-5 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased animate-in fade-in duration-150">
      {/* ======================================================================
          1. CABECERA LIMPIA + MENÚ DESPLEGABLE "+" + SELECTOR DE SEDE UNIFICADO
          ====================================================================== */}
      <AdminSectionHeader
        title="Tienda"
        rightSlot={
          <div className="relative shrink-0" ref={actionMenuRef}>
            <button
              type="button"
              onClick={() => setIsActionMenuOpen((prev) => !prev)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition-colors cursor-pointer active:scale-95"
              title="Nuevo Producto o Nuevo Pedido"
              aria-label="Nuevo Producto o Nuevo Pedido"
              aria-expanded={isActionMenuOpen}
            >
              <Plus className="w-6 h-6 stroke-[2.2]" />
            </button>

            {isActionMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] shadow-xl py-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    setIsNewProductModalOpen(true);
                  }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#132A45] hover:text-[#0B1A2D] dark:hover:text-[#B7F229] flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Package className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                  <span>Nuevo Producto</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    resetNewOrder();
                    navigateTo('new_order', '/admin/tienda/pedidos/nuevo');
                  }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#132A45] hover:text-[#0B1A2D] dark:hover:text-[#B7F229] flex items-center gap-2.5 transition cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Nuevo Pedido</span>
                </button>
              </div>
            )}
          </div>
        }
      />

      {/* ====================================================================
          2. SELECTOR SIMPLIFICADO DE DOS PESTAÑAS (ANCHO COMPLETO)
          ==================================================================== */}
      {activeView === 'new_order' ? (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigateTo('tienda', '/admin/tienda')}
            className="inline-flex items-center gap-2 min-h-[42px] px-3.5 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs font-bold text-[#0B1A2D] dark:text-white hover:bg-slate-50 dark:hover:bg-[#132A45] transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Tienda</span>
          </button>
          <span className="text-xs font-bold text-[#8B5CF6] dark:text-[#B7F229]">
            Nuevo Pedido de Mostrador
          </span>
        </div>
      ) : (
        <div className="p-1 bg-slate-100 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-2xl grid grid-cols-2 gap-1 w-full text-xs sm:text-sm select-none shadow-2xs">
          <button
            type="button"
            onClick={() => navigateTo('tienda', '/admin/tienda')}
            className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeView === 'tienda'
                ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Tienda</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('pedidos', '/admin/tienda/pedidos')}
            className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeView === 'pedidos'
                ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4 shrink-0" />
            <span>Pedidos</span>
            <span className="font-mono tabular-nums text-[11px] opacity-75">({orders.length})</span>
          </button>
        </div>
      )}

      {/* ======================================================================
          VISTA 1: TIENDA (KPIS + GRÁFICO INTERACTIVO + TOP VENTAS + CATÁLOGO)
          ====================================================================== */}
      {activeView === 'tienda' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* KPIs Financieros Compactos (Paleta Setmio) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between gap-1.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Facturación Mes
                </span>
                <TrendingUp className="w-4 h-4 text-[#82b805] dark:text-[#B7F229] shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#0B1A2D] dark:text-[#B7F229] font-mono tabular-nums tracking-tight truncate">
                12.450 €
              </div>
              <div className="text-[11px] font-semibold text-[#82b805] dark:text-[#B7F229] flex items-center gap-1 truncate">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                <span>+18,4% vs mes anterior</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between gap-1.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Ventas Hoy
                </span>
                <DollarSign className="w-4 h-4 text-[#8B5CF6] shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums tracking-tight truncate">
                680,00 €
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                8 pedidos completados
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between gap-1.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Ticket Medio
                </span>
                <Percent className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums tracking-tight truncate">
                87,60 €
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                Margen medio 42%
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between gap-1.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Valor del Stock
                </span>
                <Boxes className="w-4 h-4 text-[#8B5CF6] shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums tracking-tight truncate">
                {totalCatalogValue.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                {totalCatalogUnits} uds en almacén
              </span>
            </div>
          </div>

          {/* Gráfico Interactivo + Top Ventas del Mes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Evolución de Ingresos (Responsive, Sin Desborde en Móvil) */}
            <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4 min-w-0 overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                    Evolución de Ingresos
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Toca cualquier barra para consultar la cifra exacta
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#071220] border border-slate-200/70 dark:border-[#1A314D] p-1 rounded-xl text-xs font-bold shrink-0">
                  <button
                    type="button"
                    onClick={() => handleTimeRangeChange('month')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      timeRange === 'month'
                        ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                    }`}
                  >
                    Meses
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeRangeChange('day')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      timeRange === 'day'
                        ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                    }`}
                  >
                    Semana
                  </button>
                </div>
              </div>

              {/* Indicador Detallado del Periodo Seleccionado */}
              {activeChartPoint && (
                <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/70 dark:border-[#1A314D] text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#B7F229] ring-2 ring-[#0B1A2D]/15 dark:ring-[#B7F229]/25 shrink-0" />
                    <span className="font-bold text-[#0B1A2D] dark:text-white truncate">
                      {activeChartPoint.fullLabel}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums shrink-0">
                      {activeChartPoint.orders} pedidos
                    </span>
                  </div>
                  <span className="font-mono tabular-nums font-extrabold text-sm text-[#0B1A2D] dark:text-[#B7F229] shrink-0">
                    {activeChartPoint.sales.toLocaleString('es-ES')} €
                  </span>
                </div>
              )}

              {/* Barras Interactivas (100% ajustadas al ancho móvil) */}
              <div className="w-full h-52 sm:h-56 pt-9 pb-1 flex items-end gap-1 sm:gap-2">
                {chartData.map((d, i) => {
                  const heightPercent = Math.max(12, Math.round((d.sales / maxSale) * 100));
                  const isSelected = i === safeSelectedIndex;
                  const tooltipPositionClass =
                    i <= 1
                      ? 'left-0'
                      : i >= chartData.length - 2
                      ? 'right-0'
                      : 'left-1/2 -translate-x-1/2';

                  return (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => setSelectedBarIndex(i)}
                      aria-label={`${d.fullLabel}: ${d.sales.toLocaleString('es-ES')} € (${d.orders} pedidos)`}
                      aria-pressed={isSelected}
                      className="flex-1 min-w-0 h-full flex flex-col items-center justify-end gap-1.5 group cursor-pointer focus:outline-none relative"
                    >
                      {/* Tooltip flotante sobre la barra activa */}
                      {isSelected && (
                        <div
                          className={`absolute -top-8 z-10 px-2 py-0.5 rounded-lg bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D] font-mono tabular-nums text-[10px] font-bold shadow-sm whitespace-nowrap pointer-events-none ${tooltipPositionClass}`}
                        >
                          {d.sales.toLocaleString('es-ES')} €
                        </div>
                      )}

                      <div className="w-full flex-1 flex items-end">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-lg sm:rounded-t-xl transition-all duration-150 ${
                            isSelected
                              ? 'bg-[#0B1A2D] dark:bg-[#B7F229] ring-2 ring-[#B7F229]/60 dark:ring-[#8B5CF6]/50'
                              : 'bg-slate-200/90 dark:bg-[#1A314D] group-hover:bg-[#8B5CF6]/55 dark:group-hover:bg-[#8B5CF6]/65'
                          }`}
                        />
                      </div>

                      <span
                        className={`text-[9px] sm:text-[11px] font-bold truncate max-w-full transition-colors ${
                          isSelected
                            ? 'text-[#0B1A2D] dark:text-[#B7F229]'
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                        }`}
                      >
                        {d.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Top Ventas del Mes (Sin Cajas Anidadas + Miniaturas Uniformes) */}
            <div className="lg:col-span-5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-3 min-w-0">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#1A314D]">
                <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white truncate">
                  Top Ventas del Mes
                </h2>
                <span className="text-[11px] font-bold text-[#8B5CF6] dark:text-[#B7F229] shrink-0">
                  Ranking
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-[#1A314D]">
                {topSellers.map((item, idx) => {
                  const matchedProduct = productList.find((p) => p.id === item.productId);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => matchedProduct && setSelectedProductDetail(matchedProduct)}
                      className="w-full py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3 text-left text-xs hover:bg-slate-50/70 dark:hover:bg-white/[0.02] rounded-xl px-1.5 -mx-1.5 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono tabular-nums font-bold text-slate-400 dark:text-slate-500 w-5 text-center shrink-0">
                          #{idx + 1}
                        </span>
                        <ProductThumb
                          src={item.avatar}
                          alt={item.name}
                          category={item.category}
                          className="w-11 h-11 rounded-xl"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-[#0B1A2D] dark:text-white truncate">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums truncate">
                            {item.unitsSold} uds · Stock: {item.stock}
                          </div>
                        </div>
                      </div>

                      <span className="font-mono tabular-nums font-extrabold text-[#0B1A2D] dark:text-[#B7F229] shrink-0">
                        {item.revenue.toLocaleString('es-ES')} €
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Catálogo de Productos (Limpio, sin carruseles ni contenedores anidados) */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar producto o marca..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full min-h-[40px] pl-10 pr-8 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs sm:text-sm text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] shadow-2xs"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
                    aria-label="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'palas', label: 'Palas' },
                  { id: 'zapatillas', label: 'Calzado' },
                  { id: 'accesorios', label: 'Pelotas & Grips' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-2xs'
                        : 'bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-10 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-center text-xs text-slate-400">
                No hay productos que coincidan con tu búsqueda.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {filteredProducts.map((p) => {
                  const isLowStock = p.stock > 0 && p.stock <= 4;
                  const isOut = p.stock === 0;

                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D]/35 dark:hover:border-[#B7F229]/45 transition shadow-2xs flex flex-col justify-between gap-3 group"
                    >
                      <div className="space-y-3">
                        <div
                          onClick={() => setSelectedProductDetail(p)}
                          className="relative cursor-pointer"
                        >
                          <ProductThumb
                            src={p.imageUrl}
                            alt={p.name}
                            category={p.category}
                            className="w-full h-40 rounded-xl"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#0B1A2D]/85 text-white font-mono font-bold text-[10px] uppercase backdrop-blur-xs">
                            {p.brand}
                          </span>
                          {isLowStock && (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                              Stock bajo
                            </span>
                          )}
                          {isOut && (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px]">
                              Agotado
                            </span>
                          )}
                        </div>

                        <div>
                          <h3
                            onClick={() => setSelectedProductDetail(p)}
                            className="font-bold text-sm text-[#0B1A2D] dark:text-white line-clamp-1 cursor-pointer hover:underline"
                          >
                            {p.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {p.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono tabular-nums font-extrabold text-base text-[#0B1A2D] dark:text-[#B7F229]">
                            {p.price.toFixed(2)} €
                          </span>
                          <span
                            className={`font-mono tabular-nums font-bold ${
                              isOut
                                ? 'text-rose-600 dark:text-rose-400'
                                : isLowStock
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {p.stock} uds
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedProductDetail(p)}
                            className="w-full py-2 px-2 rounded-xl bg-slate-100 dark:bg-[#071220] hover:bg-slate-200 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ficha</span>
                          </button>
                          <button
                            type="button"
                            disabled={isOut}
                            onClick={() => handleStartSaleWithProduct(p)}
                            className={`w-full py-2 px-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 ${
                              isOut
                                ? 'bg-slate-200 dark:bg-[#071220] text-slate-400 cursor-not-allowed'
                                : 'bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] cursor-pointer'
                            }`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Vender</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================
          VISTA 2: GESTIÓN DE PEDIDOS
          ====================================================================== */}
      {activeView === 'pedidos' && (
        <div className="space-y-6 animate-in fade-in duration-150 mb-8">
          {/* Métricas de Pedidos */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Pedidos</span>
              <div className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-[#0B1A2D] dark:text-white">
                {orders.length}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Tickets emitidos</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pendientes / Prep.</span>
              <div className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-[#8B5CF6]">
                {pendingOrdersCount}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Por entregar en mano</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Facturación Pedidos</span>
              <div className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-[#0B1A2D] dark:text-[#B7F229]">
                {orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString('es-ES')} €
              </div>
              <div className="text-[11px] text-[#82b805] dark:text-[#B7F229] font-semibold">100% cobrado</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ticket Medio</span>
              <div className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-[#0B1A2D] dark:text-white">
                {(orders.reduce((acc, o) => acc + o.totalAmount, 0) / (orders.length || 1)).toFixed(2)} €
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Promedio por compra</div>
            </div>
          </div>

          {/* Buscador y Filtros de Pedidos (Sin contenedor envolvente pesado) */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por Nº de pedido, cliente o producto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full min-h-[40px] pl-10 pr-8 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs sm:text-sm text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] shadow-2xs"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
                    aria-label="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>

              {isMultiVenue && (
                <select
                  value={orderVenueFilter}
                  onChange={(e) => setOrderVenueFilter(e.target.value)}
                  className="min-h-[40px] px-3 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs font-bold text-[#0B1A2D] dark:text-slate-200 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] shadow-2xs"
                >
                  <option value="all">Todas las Sedes</option>
                  <option value="venue-san-mateo">Sede Central Narón</option>
                  <option value="venue-coruna">Sede A Coruña</option>
                  <option value="venue-santiago">Sede Santiago</option>
                </select>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x">
              {([
                { id: 'all', label: 'Todos' },
                { id: 'pendiente', label: 'Pendientes' },
                { id: 'preparado', label: 'Preparados' },
                { id: 'entregado', label: 'Entregados' },
              ] as const).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setOrderStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                    orderStatusFilter === st.id
                      ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-2xs'
                      : 'bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla de Pedidos */}
          <div className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-[#071220] border-b border-slate-200/80 dark:border-[#1A314D] text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-4 whitespace-nowrap">Ticket</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Cliente</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Artículos</th>
                    <th className="py-3.5 px-3 whitespace-nowrap">Sede</th>
                    <th className="py-3.5 px-3 text-right whitespace-nowrap">Total</th>
                    <th className="py-3.5 px-3 whitespace-nowrap">Pago</th>
                    <th className="py-3.5 px-3 whitespace-nowrap">Estado</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1A314D]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-xs text-slate-400">
                        No hay pedidos que coincidan con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition">
                        <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-[#B7F229] whitespace-nowrap">
                          <div>{o.id}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{o.createdAt}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#0B1A2D] dark:text-white flex items-center gap-1.5">
                            <span>{o.customerName}</span>
                            {o.memberNum && (
                              <button
                                type="button"
                                onClick={() => navigateToPlayerProfile(o.customerName, 'pos_cafe')}
                                className="text-[10px] text-[#8B5CF6] dark:text-[#B7F229] font-bold hover:underline cursor-pointer"
                                title="Ver ficha socio"
                              >
                                ({o.memberNum})
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5 max-w-[220px]">
                            {o.items.map((it, idx) => (
                              <div key={idx} className="text-slate-600 dark:text-slate-300 truncate">
                                <strong className="text-[#0B1A2D] dark:text-white font-mono tabular-nums">{it.quantity}x</strong> {it.productName}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {o.venueName || 'Sede Central'}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono tabular-nums font-extrabold text-[#0B1A2D] dark:text-white whitespace-nowrap">
                          {o.totalAmount.toFixed(2)} €
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {o.paymentMethod === 'card' && 'Tarjeta'}
                          {o.paymentMethod === 'cash' && 'Efectivo'}
                          {o.paymentMethod === 'wallet' && 'Monedero'}
                          {o.paymentMethod === 'direct_debit' && 'Domiciliación'}
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as ShopOrder['status'])}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer border ${
                              o.status === 'entregado'
                                ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] border-[#B7F229]/50'
                                : o.status === 'preparado'
                                ? 'bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 text-[#6D28D9] dark:text-[#C4B5FD] border-[#8B5CF6]/30'
                                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                            }`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="preparado">Preparado</option>
                            <option value="entregado">Entregado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderDetail(o)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#071220] hover:bg-[#0B1A2D] hover:text-white dark:hover:bg-[#B7F229] dark:hover:text-[#0B1A2D] text-[#0B1A2D] dark:text-slate-200 transition font-bold text-xs cursor-pointer"
                          >
                            Ver Ticket
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          VISTA 3: NUEVO PEDIDO DE MOSTRADOR
          ====================================================================== */}
      {activeView === 'new_order' && (
        <div className="space-y-6 animate-in fade-in duration-150 mb-8">
          {lastCreatedOrderId ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-[#0E2239] border border-[#B7F229]/60 text-center space-y-4 max-w-xl mx-auto shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#82b805] dark:text-[#B7F229] mx-auto flex items-center justify-center border border-[#B7F229]/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-[#82b805] dark:text-[#B7F229] font-mono tracking-wider">
                  Ticket Registrado: {lastCreatedOrderId}
                </span>
                <h2 className="text-xl font-bold text-[#0B1A2D] dark:text-white mt-1">
                  Venta Completada con Éxito
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  El stock de los productos se ha actualizado en tiempo real y el importe ha quedado registrado en pedidos.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={resetNewOrder}
                  className="px-5 py-2.5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] font-bold text-xs transition shadow-2xs cursor-pointer"
                >
                  Nuevo Pedido
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('pedidos', '/admin/tienda/pedidos')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Ver Pedidos
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Izquierda: Cliente, Artículos y Pago */}
              <div className="lg:col-span-7 space-y-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-3">
                  <h3 className="text-sm font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />
                    <span>1. Identificación del Cliente</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setOrderCustomerType('walk_in');
                        setSelectedCustomer(null);
                      }}
                      className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer ${
                        orderCustomerType === 'walk_in'
                          ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229]/15 dark:border-[#B7F229] dark:text-[#B7F229]'
                          : 'bg-slate-50 dark:bg-[#071220] border-slate-200 dark:border-[#1A314D] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span>Cliente Mostrador</span>
                        {orderCustomerType === 'walk_in' && <Check className="w-4 h-4 text-[#B7F229]" />}
                      </div>
                      <span className="text-[10px] font-normal opacity-80 block">Venta rápida sin ficha</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderCustomerType('member')}
                      className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer ${
                        orderCustomerType === 'member'
                          ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229]/15 dark:border-[#B7F229] dark:text-[#B7F229]'
                          : 'bg-slate-50 dark:bg-[#071220] border-slate-200 dark:border-[#1A314D] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span>Socio del Club</span>
                        {orderCustomerType === 'member' && <Check className="w-4 h-4 text-[#B7F229]" />}
                      </div>
                      <span className="text-[10px] font-normal opacity-80 block">Permite cargo en monedero</span>
                    </button>
                  </div>

                  {orderCustomerType === 'member' && (
                    <select
                      value={selectedCustomer?.id || ''}
                      onChange={(e) => {
                        const found = MOCK_CUSTOMERS.find((c) => c.id === e.target.value);
                        setSelectedCustomer(found || null);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-xs font-medium text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                    >
                      <option value="">-- Elige un socio del club --</option>
                      {MOCK_CUSTOMERS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.memberNum}) — Saldo: {c.balance.toFixed(2)} €
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />
                      <span>2. Seleccionar Artículos</span>
                    </h3>
                    <span className="text-xs text-slate-400">Pulsa + para añadir</span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-[#1A314D] max-h-80 overflow-y-auto">
                    {productList.map((product) => {
                      const isOutOfStock = product.stock <= 0;
                      return (
                        <div
                          key={product.id}
                          className="py-2.5 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <ProductThumb
                              src={product.imageUrl}
                              alt={product.name}
                              category={product.category}
                              className="w-10 h-10 rounded-xl"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-[#0B1A2D] dark:text-white truncate">
                                {product.name}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                                {product.price.toFixed(2)} € · Stock: {product.stock}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={isOutOfStock}
                            onClick={() => {
                              const existing = orderCart.find((ci) => ci.product.id === product.id);
                              if (existing) {
                                setOrderCart((prev) =>
                                  prev.map((ci) =>
                                    ci.product.id === product.id ? { ...ci, quantity: ci.quantity + 1 } : ci
                                  )
                                );
                              } else {
                                setOrderCart((prev) => [...prev, { product, quantity: 1 }]);
                              }
                            }}
                            className={`p-2 rounded-xl font-bold transition shrink-0 ${
                              isOutOfStock
                                ? 'bg-slate-200 dark:bg-[#071220] text-slate-400 cursor-not-allowed'
                                : 'bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] cursor-pointer'
                            }`}
                            title="Añadir al pedido"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-3">
                  <h3 className="text-sm font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#8B5CF6]" />
                    <span>3. Método de Cobro</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      { id: 'card', label: 'Tarjeta / TPV', icon: CreditCard },
                      { id: 'cash', label: 'Efectivo', icon: Banknote },
                      { id: 'wallet', label: 'Monedero', icon: Wallet },
                      { id: 'direct_debit', label: 'Domiciliación', icon: Receipt },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSelected = orderPaymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setOrderPaymentMethod(m.id as ShopOrder['paymentMethod'])}
                          className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                            isSelected
                              ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229]/15 dark:border-[#B7F229] dark:text-[#B7F229]'
                              : 'bg-slate-50 dark:bg-[#071220] border-slate-200 dark:border-[#1A314D] text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[11px]">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isMultiVenue && (
                    <select
                      value={orderVenue}
                      onChange={(e) => setOrderVenue(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-xs font-medium text-[#0B1A2D] dark:text-white"
                    >
                      <option value="venue-san-mateo">Sede Central Narón</option>
                      <option value="venue-coruna">Sede A Coruña</option>
                      <option value="venue-santiago">Sede Santiago</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Derecha: Ticket */}
              <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4 lg:sticky lg:top-20">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#8B5CF6]" />
                    <span>Resumen del Pedido</span>
                  </h3>
                  <span className="text-xs font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                    {orderCart.reduce((a, b) => a + b.quantity, 0)} uds
                  </span>
                </div>

                {orderCart.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400 space-y-2">
                    <ShoppingBag className="w-8 h-8 mx-auto opacity-40" />
                    <div>Tu cesta está vacía.</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="divide-y divide-slate-100 dark:divide-[#1A314D] max-h-60 overflow-y-auto">
                      {orderCart.map((item) => (
                        <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs gap-2">
                          <div className="min-w-0">
                            <div className="font-bold text-[#0B1A2D] dark:text-white truncate">
                              {item.product.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                              {item.product.price.toFixed(2)} € / ud
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-white">
                              {(item.product.price * item.quantity).toFixed(2)} €
                            </span>
                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#071220] rounded-lg p-0.5 border border-slate-200 dark:border-[#1A314D]">
                              <button
                                type="button"
                                onClick={() => {
                                  if (item.quantity === 1) {
                                    setOrderCart((prev) => prev.filter((ci) => ci.product.id !== item.product.id));
                                  } else {
                                    setOrderCart((prev) =>
                                      prev.map((ci) =>
                                        ci.product.id === item.product.id ? { ...ci, quantity: ci.quantity - 1 } : ci
                                      )
                                    );
                                  }
                                }}
                                className="w-5 h-5 rounded flex items-center justify-center font-bold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-5 text-center font-mono tabular-nums font-bold">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setOrderCart((prev) =>
                                    prev.map((ci) =>
                                      ci.product.id === item.product.id ? { ...ci, quantity: ci.quantity + 1 } : ci
                                    )
                                  );
                                }}
                                className="w-5 h-5 rounded flex items-center justify-center font-bold cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Descuento (€):</span>
                        <input
                          type="number"
                          min="0"
                          value={orderDiscount}
                          onChange={(e) => setOrderDiscount(Number(e.target.value))}
                          className="w-20 px-2 py-1 rounded-lg bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] font-mono tabular-nums text-right"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#1A314D] text-sm font-bold">
                        <span>Total a Cobrar:</span>
                        <span className="text-xl font-mono tabular-nums font-extrabold text-[#0B1A2D] dark:text-[#B7F229]">
                          {Math.max(
                            0,
                            orderCart.reduce((a, b) => a + b.product.price * b.quantity, 0) - orderDiscount
                          ).toFixed(2)}{' '}
                          €
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCompleteOrder}
                      className="w-full py-3 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] font-bold text-sm transition shadow-2xs active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Cobrar y Emitir Ticket</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          MODAL: FICHA DE PRODUCTO
          ===================================================================== */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Ficha del Producto
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProductDetail(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
              <div className="sm:col-span-5 space-y-3">
                <div className="relative">
                  <ProductThumb
                    src={selectedProductDetail.imageUrl}
                    alt={selectedProductDetail.name}
                    category={selectedProductDetail.category}
                    className="w-full h-56 rounded-2xl"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#0B1A2D]/85 text-white font-mono font-bold text-[10px] uppercase">
                    {selectedProductDetail.brand}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/70 dark:border-[#1A314D] text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
                    <span>Rentabilidad</span>
                    <span className="text-[#82b805] dark:text-[#B7F229]">Margen Bruto</span>
                  </div>
                  <div className="flex items-center justify-between font-mono tabular-nums font-bold text-sm text-[#0B1A2D] dark:text-white">
                    <span>Coste: {getProductCost(selectedProductDetail.price)} €</span>
                    <span className="text-[#82b805] dark:text-[#B7F229]">
                      ~{getProductMarginPercent(selectedProductDetail.price)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-7 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0B1A2D] dark:text-white">
                    {selectedProductDetail.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {selectedProductDetail.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/70 dark:border-[#1A314D]">
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block">PVP con IVA</span>
                    <span className="text-2xl font-extrabold font-mono tabular-nums text-[#0B1A2D] dark:text-[#B7F229]">
                      {selectedProductDetail.price.toFixed(2)} €
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block">Stock Total</span>
                    <span className="text-2xl font-extrabold font-mono tabular-nums text-[#0B1A2D] dark:text-white">
                      {selectedProductDetail.stock} uds
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#0B1A2D] dark:text-white">
                    <Building2 className="w-4 h-4 text-[#8B5CF6]" />
                    <span>Stock por Sede</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-[#1A314D] rounded-xl border border-slate-200/70 dark:border-[#1A314D] px-3">
                    {[
                      { id: 'venue-san-mateo', name: 'Sede Central Narón', defaultVal: Math.ceil(selectedProductDetail.stock * 0.6) },
                      { id: 'venue-coruna', name: 'Sede A Coruña', defaultVal: Math.floor(selectedProductDetail.stock * 0.25) },
                      { id: 'venue-santiago', name: 'Sede Santiago', defaultVal: Math.max(0, selectedProductDetail.stock - Math.ceil(selectedProductDetail.stock * 0.6) - Math.floor(selectedProductDetail.stock * 0.25)) },
                    ].map((v) => (
                      <div key={v.id} className="py-2 flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{v.name}</span>
                        <span className="font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                          {selectedProductDetail.venueStock?.[v.id] ?? v.defaultVal} uds
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedProductDetail.specs && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedProductDetail.specs).map(([k, val]) => (
                      <div key={k} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/70 dark:border-[#1A314D]">
                        <span className="text-[10px] text-slate-400 block">{k}</span>
                        <span className="font-bold text-[#0B1A2D] dark:text-slate-200">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setStockModalProduct(selectedProductDetail);
                  setStockAdjustment(10);
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071220] dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Boxes className="w-4 h-4 text-[#8B5CF6]" />
                <span>Ajustar Stock</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductDetail(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const p = selectedProductDetail;
                    setSelectedProductDetail(null);
                    handleStartSaleWithProduct(p);
                  }}
                  className="py-2.5 px-5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] font-bold text-xs transition cursor-pointer flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Vender</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: TICKET DETALLADO DE PEDIDO
          ===================================================================== */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#8B5CF6]" />
                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Ticket #{selectedOrderDetail.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetail(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/70 dark:border-[#1A314D] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Cliente:</span>
                  <strong className="text-[#0B1A2D] dark:text-white">{selectedOrderDetail.customerName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Sede:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedOrderDetail.venueName || 'Sede Central'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Fecha:</span>
                  <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">{selectedOrderDetail.createdAt}</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-[#1A314D] rounded-2xl border border-slate-200/70 dark:border-[#1A314D] px-3.5">
                {selectedOrderDetail.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#0B1A2D] dark:text-white">
                        {item.quantity}x {item.productName}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                        {item.unitPrice.toFixed(2)} € / ud
                      </div>
                    </div>
                    <span className="font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-white">
                      {item.subtotal.toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-sm font-bold">
                <span>Total Abonado:</span>
                <span className="text-xl font-mono tabular-nums font-extrabold text-[#0B1A2D] dark:text-[#B7F229]">
                  {selectedOrderDetail.totalAmount.toFixed(2)} €
                </span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    triggerDemoToast('Imprimiendo Ticket', `Ticket ${selectedOrderDetail.id} enviado a la impresora.`, 'info');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071220] text-[#0B1A2D] dark:text-slate-200 font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerDemoToast('Enviado por WhatsApp', `Copia del ticket enviada a ${selectedOrderDetail.customerName}.`, 'success');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: NUEVO PRODUCTO
          ===================================================================== */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Nuevo Producto
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewProductModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Siux Diablo Revolution 3 Pro"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Marca</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.brand}
                    onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as Product['category'] })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  >
                    <option value="palas">Palas</option>
                    <option value="zapatillas">Calzado</option>
                    <option value="ropa">Textil</option>
                    <option value="accesorios">Pelotas & Accesorios</option>
                    <option value="paleteros">Paleteros</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">PVP (€)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl font-mono tabular-nums text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Coste (€)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newProductForm.costPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl font-mono tabular-nums text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl font-mono tabular-nums text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>
              </div>

              {isMultiVenue && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sede Inicial</label>
                  <select
                    value={newProductForm.targetVenue}
                    onChange={(e) => setNewProductForm({ ...newProductForm, targetVenue: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white"
                  >
                    <option value="venue-san-mateo">Sede Central Narón</option>
                    <option value="venue-coruna">Sede A Coruña</option>
                    <option value="venue-santiago">Sede Santiago</option>
                  </select>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] font-bold transition cursor-pointer"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: AJUSTE DE STOCK MULTI-SEDE
          ===================================================================== */}
      {stockModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-[#8B5CF6]" />
                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white truncate">
                  Ajuste de Stock
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStockModalProduct(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/70 dark:border-[#1A314D] flex items-center justify-between">
                <span className="text-slate-500 truncate pr-2">{stockModalProduct.name}</span>
                <span className="font-mono tabular-nums font-bold text-sm text-[#0B1A2D] dark:text-white shrink-0">
                  {stockModalProduct.stock} uds
                </span>
              </div>

              {isMultiVenue && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sede</label>
                  <select
                    value={stockAdjustmentVenue}
                    onChange={(e) => setStockAdjustmentVenue(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white"
                  >
                    <option value="venue-san-mateo">Sede Central Narón</option>
                    <option value="venue-coruna">Sede A Coruña</option>
                    <option value="venue-santiago">Sede Santiago</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Unidades (+ / -)
                  </label>
                  <input
                    type="number"
                    value={stockAdjustment}
                    onChange={(e) => setStockAdjustment(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl font-mono tabular-nums text-[#0B1A2D] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Alerta mínima
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stockMinAlert}
                    onChange={(e) => setStockMinAlert(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl font-mono tabular-nums text-[#0B1A2D] dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStockModalProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveStock}
                  className="px-5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] font-bold transition cursor-pointer"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShopOrders;
