import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types/database';
import {
  ShoppingBag,
  Package,
  Plus,
  CheckCircle2,
  TrendingUp,
  Search,
  Filter,
  DollarSign,
  BarChart3,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Edit2,
  Trash2,
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
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  Building2,
  Eye,
  Send,
  Layers,
  Clock,
  ExternalLink,
  Share2,
} from 'lucide-react';

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
      { productId: 'prod-2', productName: 'Bote Pelotas Head Padel Pro S', category: 'pelotas', quantity: 2, unitPrice: 7.0, subtotal: 14.0 },
    ],
    totalAmount: 299.0,
    paymentMethod: 'card',
    status: 'entregado',
    createdAt: 'Hoy, 12:45',
    venueId: 'venue-san-mateo',
    venueName: 'Sede Central Narón',
    notes: 'Recogido en mostrador de pro shop.',
  },
  {
    id: 'PED-2026-803',
    customerName: 'Laura Gómez',
    customerType: 'member',
    memberNum: 'SM-410',
    items: [
      { productId: 'prod-4', productName: 'Zapatillas Asics Gel-Resolution Padel', category: 'ropa', quantity: 1, unitPrice: 145.0, subtotal: 145.0 },
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
      { productId: 'prod-2', productName: 'Cajón 24 Botes Pelotas Head Padel Pro S', category: 'pelotas', quantity: 1, unitPrice: 120.0, subtotal: 120.0 },
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
      { productId: 'prod-2', productName: 'Bote Pelotas Head Padel Pro S', category: 'pelotas', quantity: 1, unitPrice: 7.0, subtotal: 7.0 },
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
      { productId: 'prod-3', productName: 'Nox AT10 Genius Agustín Tapia 18K', category: 'palas', quantity: 1, unitPrice: 299.0, subtotal: 299.0 },
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

export const AdminShopOrders: React.FC = () => {
  const { products, triggerDemoToast, currentTenant, t, isMultiVenue, venues, navigateToPlayerProfile, addToCart } = useApp();

  // Navigation View State: 'dashboard' | 'products' | 'orders' | 'new_order'
  const [activeView, setActiveView] = useState<'dashboard' | 'products' | 'orders' | 'new_order'>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p.includes('/pedidos/nuevo') || p.includes('/nuevo-pedido')) return 'new_order';
      if (p.includes('/pedidos')) return 'orders';
      if (p.includes('/productos')) return 'products';
    }
    return 'dashboard';
  });

  // Display mode in products view: 'carousels' | 'grid'
  const [catalogDisplayMode, setCatalogDisplayMode] = useState<'carousels' | 'grid'>('carousels');

  // Product List with Multi-Venue Stock initialization
  const [productList, setProductList] = useState<Product[]>(() => {
    return products.map((p, idx) => {
      // Seed multi-venue stock breakdown if not already present
      const total = p.stock || 8;
      const sanMateo = Math.ceil(total * 0.6);
      const coruna = Math.floor(total * 0.25);
      const santiago = Math.max(0, total - sanMateo - coruna);

      return {
        ...p,
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
      } as Product & { venueStock?: Record<string, number> };
    });
  });

  // Orders State
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

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pendiente' | 'preparado' | 'entregado' | 'cancelado'>('all');
  const [orderVenueFilter, setOrderVenueFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'day' | 'month'>('month');

  // Modals
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<(Product & { venueStock?: Record<string, number> }) | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<ShopOrder | null>(null);
  const [stockModalProduct, setStockModalProduct] = useState<(Product & { venueStock?: Record<string, number> }) | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState<number>(10);
  const [stockAdjustmentVenue, setStockAdjustmentVenue] = useState<string>('venue-san-mateo');
  const [stockMinAlert, setStockMinAlert] = useState<number>(3);

  // New Order State
  const [orderCustomerType, setOrderCustomerType] = useState<'walk_in' | 'member'>('walk_in');
  const [selectedCustomer, setSelectedCustomer] = useState<MockCustomer | null>(null);
  const [orderCart, setOrderCart] = useState<OrderItem[]>([]);
  const [orderPaymentMethod, setOrderPaymentMethod] = useState<'card' | 'cash' | 'wallet' | 'direct_debit'>('card');
  const [orderDiscount, setOrderDiscount] = useState<number>(0);
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [orderVenue, setOrderVenue] = useState<string>('venue-san-mateo');
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState<string | null>(null);

  // Refs for category carousel horizontal scroll
  const carouselRefs = {
    palas: useRef<HTMLDivElement>(null),
    pelotas: useRef<HTMLDivElement>(null),
    ropa: useRef<HTMLDivElement>(null),
    accesorios: useRef<HTMLDivElement>(null),
  };

  const scrollCarousel = (cat: 'palas' | 'pelotas' | 'ropa' | 'accesorios', direction: 'left' | 'right') => {
    const el = carouselRefs[cat]?.current;
    if (el) {
      const scrollAmount = 340;
      el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const navigateTo = (view: 'dashboard' | 'products' | 'orders' | 'new_order', url: string) => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // New Product Form State
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    brand: 'Bullpadel',
    category: 'palas' as Product['category'],
    price: 180,
    costPrice: 110,
    stock: 8,
    targetVenue: 'venue-san-mateo',
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80',
    description: 'Pala oficial de competición con fibra de carbono 12K y tubular 100% de grafeno.',
  });

  // Sales Chart Data
  const monthlySales = [
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
  ];

  const dailySales = [
    { label: 'Lun', fullLabel: 'Lunes', sales: 380, orders: 4 },
    { label: 'Mar', fullLabel: 'Martes', sales: 520, orders: 6 },
    { label: 'Mié', fullLabel: 'Miércoles', sales: 450, orders: 5 },
    { label: 'Jue', fullLabel: 'Jueves', sales: 680, orders: 8 },
    { label: 'Vie', fullLabel: 'Viernes', sales: 940, orders: 11 },
    { label: 'Sáb', fullLabel: 'Sábado', sales: 1450, orders: 18 },
    { label: 'Dom', fullLabel: 'Domingo', sales: 1120, orders: 14 },
  ];

  const chartData = timeRange === 'month' ? monthlySales : dailySales;
  const maxSale = Math.max(...chartData.map((d) => d.sales));

  // Top Selling Products
  const topSellers = [
    {
      id: 'top-1',
      name: 'Bullpadel Vertex 04 2026',
      brand: 'Bullpadel',
      unitsSold: 34,
      revenue: 8840,
      stock: 6,
      avatar: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'top-2',
      name: 'Cajón 24 Botes Pelotas Head Padel Pro S',
      brand: 'Head',
      unitsSold: 62,
      revenue: 7440,
      stock: 14,
      avatar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'top-3',
      name: 'Nox AT10 Genius Agustín Tapia 18K',
      brand: 'Nox',
      unitsSold: 28,
      revenue: 7280,
      stock: 4,
      avatar: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'top-4',
      name: 'Zapatillas Asics Gel-Resolution Padel',
      brand: 'Asics',
      unitsSold: 41,
      revenue: 5330,
      stock: 9,
      avatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
    },
  ];

  // Filtered Products for Grid View
  const filteredProducts = productList.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && p.stock > 0 && p.stock <= 4) ||
      (stockFilter === 'out' && p.stock === 0);
    return matchSearch && matchCategory && matchStock;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.productName.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchVenue = orderVenueFilter === 'all' || o.venueId === orderVenueFilter;

    return matchSearch && matchStatus && matchVenue;
  });

  // Handle Create Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) return;

    const initialStock = Number(newProductForm.stock);
    const created = {
      id: `prod-${Date.now()}`,
      tenantId: currentTenant.id,
      name: newProductForm.name.trim(),
      brand: newProductForm.brand.trim(),
      category: newProductForm.category,
      price: Number(newProductForm.price),
      stock: initialStock,
      imageUrl: newProductForm.imageUrl,
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
    } as Product & { venueStock?: Record<string, number> };

    setProductList((prev) => [created, ...prev]);
    setIsNewProductModalOpen(false);
    triggerDemoToast(
      'Producto Creado',
      `"${created.name}" añadido al catálogo con ${created.stock} unidades.`,
      'success'
    );
  };

  // Handle Save Stock Adjustment (with Multi-Venue Assignment)
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

  // Handle Update Order Status
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

  // Handle Complete New Order
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
      notes: orderNotes || undefined,
    };

    // Deduct stock from product list
    setProductList((prev) =>
      prev.map((p) => {
        const cartItem = orderCart.find((ci) => ci.product.id === p.id);
        if (cartItem) {
          const newTotal = Math.max(0, p.stock - cartItem.quantity);
          const currentVs = (p as any).venueStock || {};
          const currentInVenue = currentVs[orderVenue] || newTotal;
          const updatedVs = { ...currentVs, [orderVenue]: Math.max(0, currentInVenue - cartItem.quantity) };
          return { ...p, stock: newTotal, venueStock: updatedVs };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrderId(orderId);
    triggerDemoToast(
      '¡Venta Completada!',
      `Ticket #${orderId} registrado por un importe de ${total.toFixed(2)} €. Stock actualizado.`,
      'success'
    );
  };

  const resetNewOrder = () => {
    setOrderCart([]);
    setOrderDiscount(0);
    setOrderNotes('');
    setSelectedCustomer(null);
    setLastCreatedOrderId(null);
  };

  // Helper for Product Margin
  const getProductCost = (price: number) => Math.round(price * 0.58);
  const getProductMarginPercent = (price: number) => {
    const cost = getProductCost(price);
    return Math.round(((price - cost) / price) * 100);
  };

  // Metric aggregates
  const totalCatalogUnits = productList.reduce((acc, p) => acc + p.stock, 0);
  const totalCatalogValue = productList.reduce((acc, p) => acc + p.price * p.stock, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pendiente' || o.status === 'preparado').length;

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-16">
      {/* 1. Header con botones y navegación breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb si estamos en subvista */}
          {activeView !== 'dashboard' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
              <button
                type="button"
                onClick={() => navigateTo('dashboard', '/admin/tienda')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
              >
                Tienda Oficial
              </button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {activeView === 'products' && 'Catálogo & Carruseles de Productos'}
                {activeView === 'orders' && 'Módulo de Pedidos & Ventas'}
                {activeView === 'new_order' && 'Crear Nuevo Pedido'}
              </span>
            </div>
          )}

          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Control Financiero & Pro Shop
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            {activeView === 'dashboard' && `Tienda Oficial & Inventario — ${currentTenant.name}`}
            {activeView === 'products' && 'Catálogo de Productos & Carruseles'}
            {activeView === 'orders' && 'Gestión de Pedidos & Clientes'}
            {activeView === 'new_order' && 'Crear Nuevo Pedido — Tienda Oficial'}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {activeView === 'dashboard' && 'Métricas de facturación, carruseles de material, inventario multi-sede y arqueo.'}
            {activeView === 'products' && 'Listas desplazables por categorías, fichas técnicas con márgenes y existencias por instalación.'}
            {activeView === 'orders' && 'Historial de compras, tickets de caja, preparación de material y seguimiento de socios.'}
            {activeView === 'new_order' && 'Venta en mostrador con descuento, imputación a socio o cliente de paso y stock en tiempo real.'}
          </p>
        </div>

        {/* Botones de acción principales */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {activeView !== 'dashboard' && (
            <button
              type="button"
              onClick={() => navigateTo('dashboard', '/admin/tienda')}
              className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Resumen</span>
            </button>
          )}

          {/* Botón "Lista de Pedidos" con badge de pendientes */}
          <button
            type="button"
            onClick={() => navigateTo('orders', '/admin/tienda/pedidos')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border shadow-xs transition active:scale-95 cursor-pointer relative ${
              activeView === 'orders'
                ? 'bg-emerald-600 text-white border-transparent'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Receipt className="w-4 h-4 text-emerald-500" />
            <span>Lista de Pedidos</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          {/* Botón "+ Nuevo Pedido" */}
          <button
            type="button"
            onClick={() => {
              resetNewOrder();
              navigateTo('new_order', '/admin/tienda/pedidos/nuevo');
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border shadow-xs transition active:scale-95 cursor-pointer ${
              activeView === 'new_order'
                ? 'bg-slate-900 dark:bg-slate-700 text-white border-transparent'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-500" />
            <span>+ Nuevo Pedido</span>
          </button>

          {/* Botón "Nuevo Producto" */}
          <button
            type="button"
            onClick={() => setIsNewProductModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* BARRA DE NAVEGACIÓN MODULAR DE LA TIENDA */}
      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => navigateTo('dashboard', '/admin/tienda')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
            activeView === 'dashboard'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard & Finanzas</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('products', '/admin/tienda/productos')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
            activeView === 'products'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Catálogo & Carruseles</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('orders', '/admin/tienda/pedidos')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
            activeView === 'orders'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Gestión de Pedidos</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">
            {orders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            resetNewOrder();
            navigateTo('new_order', '/admin/tienda/pedidos/nuevo');
          }}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
            activeView === 'new_order'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Terminal de Venta (TPV)</span>
        </button>
      </div>

      {/* ======================================================================
          VISTA 1: DASHBOARD GENERAL DE TIENDA
          ====================================================================== */}
      {activeView === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* 2. KPIs Financieros Principales */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-extrabold uppercase text-[10px]">Facturación Mensual</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                12.450 €
              </div>
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>+18.4% vs mes anterior</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-extrabold uppercase text-[10px]">Ventas Hoy</span>
                <DollarSign className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                680,00 €
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                8 pedidos completados
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-extrabold uppercase text-[10px]">Ticket Medio</span>
                <Percent className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                87,60 €
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Margen medio aprox. 42%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-extrabold uppercase text-[10px]">Valor del Stock</span>
                <Boxes className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {totalCatalogValue.toLocaleString('es-ES')} €
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {totalCatalogUnits} uds en almacén
              </div>
            </div>
          </div>

          {/* Gráfico y Top Sellers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    Evolución de Ingresos de Pro Shop
                  </h2>
                  <p className="text-xs text-slate-500">Histórico de ventas mensuales con desglose de pedidos.</p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setTimeRange('month')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      timeRange === 'month' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Meses
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeRange('day')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      timeRange === 'day' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Semana
                  </button>
                </div>
              </div>

              {/* Bar Chart Visual */}
              <div className="h-60 pt-4 flex items-end gap-2 sm:gap-3">
                {chartData.map((d, i) => {
                  const heightPercent = Math.round((d.sales / maxSale) * 100);
                  const isCurrent = i === chartData.length - 1;

                  return (
                    <div key={d.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                        {d.sales}€
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-xl transition-all ${
                          isCurrent
                            ? 'bg-emerald-600 hover:bg-emerald-500'
                            : 'bg-slate-200 dark:bg-slate-800 hover:bg-emerald-500/50'
                        }`}
                      />
                      <span className="text-[10px] font-bold text-slate-500">{d.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Ventas */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Top Ventas del Mes</span>
                </h2>
                <button
                  type="button"
                  onClick={() => navigateTo('products', '/admin/tienda/productos')}
                  className="text-xs text-emerald-600 font-bold hover:underline"
                >
                  Ver Catálogo
                </button>
              </div>

              <div className="space-y-3">
                {topSellers.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono font-black text-slate-400 w-4 text-center">
                        #{idx + 1}
                      </span>
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.unitsSold} uds vendidas · Stock: {item.stock}
                        </div>
                      </div>
                    </div>

                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      {item.revenue.toLocaleString('es-ES')} €
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carrusel Destacado en Dashboard */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-500" />
                  <span>Palas y Material de Alta Competición (Carrusel Rápido)</span>
                </h2>
                <p className="text-xs text-slate-500">Desplaza horizontalmente para consultar unidades o vender en caja.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollCarousel('palas', 'left')}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel('palas', 'right')}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={carouselRefs.palas}
              className="flex items-stretch gap-4 overflow-x-auto pb-3 snap-x scrollbar-none scroll-smooth"
            >
              {productList
                .filter((p) => p.category === 'palas')
                .map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProductDetail(p as any)}
                    className="w-72 shrink-0 p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 transition cursor-pointer flex flex-col justify-between group shadow-xs"
                  >
                    <div>
                      <div className="relative h-36 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-white font-mono font-bold text-[9px] uppercase backdrop-blur-xs">
                          {p.brand}
                        </span>
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[9px]">
                          Margen ~{getProductMarginPercent(p.price)}%
                        </span>
                      </div>

                      <h3 className="font-black text-sm text-slate-900 dark:text-white line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {p.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">PVP Oficial</span>
                        <span className="font-mono font-black text-base text-emerald-600 dark:text-emerald-400">
                          {p.price.toFixed(2)} €
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Stock Disponible</span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                          {p.stock} uds
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          VISTA 2: CATÁLOGO COMPLETO & CARRUSELES HORIZONTALES POR CATEGORÍA
          ====================================================================== */}
      {activeView === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Barra de Controles y Selector de Vista (Carruseles vs Cuadrícula) */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar producto por nombre, marca o modelo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Selector de Modo: Carruseles vs Cuadrícula */}
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCatalogDisplayMode('carousels')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    catalogDisplayMode === 'carousels'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Carruseles por Categoría</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCatalogDisplayMode('grid')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    catalogDisplayMode === 'grid'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Boxes className="w-3.5 h-3.5" />
                  <span>Cuadrícula & Filtros</span>
                </button>
              </div>
            </div>
          </div>

          {/* MODO A: CARRUSELES HORIZONTALES DESPLAZABLES POR CATEGORÍA */}
          {catalogDisplayMode === 'carousels' && (
            <div className="space-y-8">
              {[
                { key: 'palas' as const, title: '🎾 Palas de Pádel de Competición & Control', subtitle: 'Modelos de gama alta con carbono 12K y tubular de grafeno' },
                { key: 'pelotas' as const, title: '🟡 Pelotas & Cajones de Torneo', subtitle: 'Botes presurizados homologados por la FIP y Federación Gallega' },
                { key: 'ropa' as const, title: '👕 Textil Técnico & Calzado Pro', subtitle: 'Zapatillas con suela de espiga para pádel y equipaciones transpirables' },
                { key: 'accesorios' as const, title: '🎒 Accesorios, Overgrips & Paleteros', subtitle: 'Protectores de marco, grips acolchados y bolsas térmicas' },
              ].map((categoryItem) => {
                const categoryProducts = productList.filter((p) => p.category === categoryItem.key);

                return (
                  <div
                    key={categoryItem.key}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{categoryItem.title}</span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">
                            {categoryProducts.length} modelos
                          </span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {categoryItem.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => scrollCarousel(categoryItem.key, 'left')}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollCarousel(categoryItem.key, 'right')}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {categoryProducts.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No hay productos registrados en esta categoría.
                      </div>
                    ) : (
                      <div
                        ref={carouselRefs[categoryItem.key]}
                        className="flex items-stretch gap-4 overflow-x-auto pb-4 snap-x scrollbar-none scroll-smooth"
                      >
                        {categoryProducts.map((p) => {
                          const isLowStock = p.stock > 0 && p.stock <= 4;
                          const isOut = p.stock === 0;

                          return (
                            <div
                              key={p.id}
                              className="w-72 shrink-0 p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 transition flex flex-col justify-between group shadow-xs"
                            >
                              <div>
                                <div
                                  onClick={() => setSelectedProductDetail(p as any)}
                                  className="relative h-40 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-3 cursor-pointer"
                                >
                                  <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-white font-mono font-bold text-[9px] uppercase backdrop-blur-xs">
                                    {p.brand}
                                  </span>
                                  {isLowStock && (
                                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[9px] uppercase shadow-xs">
                                      Stock Bajo
                                    </span>
                                  )}
                                  {isOut && (
                                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-rose-600 text-white font-bold text-[9px] uppercase shadow-xs">
                                      Agotado
                                    </span>
                                  )}
                                </div>

                                <h3
                                  onClick={() => setSelectedProductDetail(p as any)}
                                  className="font-black text-sm text-slate-900 dark:text-white line-clamp-1 hover:text-emerald-600 transition cursor-pointer"
                                >
                                  {p.name}
                                </h3>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                  {p.description}
                                </p>
                              </div>

                              <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-2.5">
                                <div className="flex items-center justify-between text-xs">
                                  <div>
                                    <span className="text-[10px] text-slate-400 block font-medium">PVP</span>
                                    <div className="font-mono font-black text-base text-emerald-600 dark:text-emerald-400">
                                      {p.price.toFixed(2)} €
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] text-slate-400 block font-medium">Stock Total</span>
                                    <span
                                      className={`text-xs font-mono font-bold ${
                                        isOut
                                          ? 'text-rose-600'
                                          : isLowStock
                                          ? 'text-amber-500'
                                          : 'text-slate-700 dark:text-slate-200'
                                      }`}
                                    >
                                      {p.stock} uds
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedProductDetail(p as any)}
                                    className="w-full py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer shadow-xs text-center flex items-center justify-center gap-1"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Ficha</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      addToCart(p);
                                      navigateTo('new_order', '/admin/tienda/pedidos/nuevo');
                                    }}
                                    className="w-full py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-xs text-center flex items-center justify-center gap-1"
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
                );
              })}
            </div>
          )}

          {/* MODO B: VISTA CUADRÍCULA CON FILTROS CLÁSICOS */}
          {catalogDisplayMode === 'grid' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-emerald-500/50 transition shadow-xs group"
                  >
                    <div>
                      <div
                        onClick={() => setSelectedProductDetail(p as any)}
                        className="relative h-40 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-3 cursor-pointer"
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-white font-mono font-bold text-[9px] uppercase backdrop-blur-xs">
                          {p.brand}
                        </span>
                      </div>

                      <h3
                        onClick={() => setSelectedProductDetail(p as any)}
                        className="font-black text-sm text-slate-900 dark:text-white line-clamp-1 hover:text-emerald-600 transition cursor-pointer"
                      >
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {p.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                          {p.price.toFixed(2)} €
                        </span>
                        <span className="font-mono font-bold text-slate-500">
                          {p.stock} uds
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedProductDetail(p as any)}
                          className="w-full py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                        >
                          Detalles
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(p);
                            navigateTo('new_order', '/admin/tienda/pedidos/nuevo');
                          }}
                          className="w-full py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                        >
                          Vender
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================================
          VISTA 3: MÓDULO DE GESTIÓN DE PEDIDOS
          ====================================================================== */}
      {activeView === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Métricas de Pedidos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black">Total Pedidos</span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {orders.length}
              </div>
              <div className="text-[11px] text-slate-500">tickets emitidos</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black">Pendientes / Preparados</span>
              <div className="text-2xl font-black font-mono text-amber-500">
                {pendingOrdersCount}
              </div>
              <div className="text-[11px] text-amber-600 font-bold">por entregar en mano</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black">Facturación Pedidos</span>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString('es-ES')} €
              </div>
              <div className="text-[11px] text-emerald-600 font-bold">100% cobrado</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black">Ticket Medio</span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {(orders.reduce((acc, o) => acc + o.totalAmount, 0) / (orders.length || 1)).toFixed(2)} €
              </div>
              <div className="text-[11px] text-slate-500">promedio por compra</div>
            </div>
          </div>

          {/* Filtros de Pedidos */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por Nº de Pedido, Cliente o Producto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Filtro de Estado */}
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
                {(['all', 'pendiente', 'preparado', 'entregado'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg transition capitalize cursor-pointer ${
                      orderStatusFilter === st
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'Todos los Estados' : st}
                  </button>
                ))}
              </div>

              {/* Filtro de Sede */}
              {isMultiVenue && (
                <select
                  value={orderVenueFilter}
                  onChange={(e) => setOrderVenueFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">Todas las Sedes</option>
                  <option value="venue-san-mateo">Sede Central Narón</option>
                  <option value="venue-coruna">Sede A Coruña</option>
                  <option value="venue-santiago">Sede Santiago</option>
                </select>
              )}
            </div>
          </div>

          {/* Tabla de Pedidos */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Ticket</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Artículos</th>
                    <th className="py-3 px-3">Sede</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3">Pago</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {o.id}
                        <div className="text-[10px] text-slate-400 font-normal">{o.createdAt}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{o.customerName}</span>
                          {o.memberNum && (
                            <button
                              type="button"
                              onClick={() => navigateToPlayerProfile(o.customerName, 'pos_cafe')}
                              className="text-[10px] text-emerald-600 font-bold hover:underline cursor-pointer"
                              title="Ver ficha socio CRM"
                            >
                              ({o.memberNum})
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="text-slate-600 dark:text-slate-300">
                              <strong className="text-slate-900 dark:text-white">{it.quantity}x</strong> {it.productName}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                          {o.venueName || 'Sede Central'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-black text-slate-900 dark:text-white">
                        {o.totalAmount.toFixed(2)} €
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="capitalize text-slate-600 dark:text-slate-400">
                          {o.paymentMethod === 'card' && 'Tarjeta'}
                          {o.paymentMethod === 'cash' && 'Efectivo'}
                          {o.paymentMethod === 'wallet' && 'Monedero'}
                          {o.paymentMethod === 'direct_debit' && 'Domiciliación'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                          className={`px-2 py-1 rounded-xl text-[10px] font-black uppercase cursor-pointer border ${
                            o.status === 'entregado'
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 border-emerald-300 dark:border-emerald-800'
                              : o.status === 'preparado'
                              ? 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 border-cyan-300 dark:border-cyan-800'
                              : 'bg-amber-50 dark:bg-amber-950 text-amber-800 border-amber-300 dark:border-amber-800'
                          }`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="preparado">Preparado</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderDetail(o)}
                          className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white transition font-bold text-xs cursor-pointer shadow-xs"
                        >
                          Ver Ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          VISTA 4: CREACIÓN DE NUEVO PEDIDO (/admin/tienda/pedidos/nuevo)
          ====================================================================== */}
      {activeView === 'new_order' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {lastCreatedOrderId ? (
            /* Confirmación de Pedido Creado con Éxito */
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/30 text-center space-y-4 max-w-xl mx-auto shadow-xl">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-emerald-600 font-mono tracking-wider">
                  Ticket Registrado: {lastCreatedOrderId}
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  ¡Venta Completada con Éxito!
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  El stock de los productos ha sido actualizado en tiempo real y el importe ha quedado reflejado en el arqueo del TPV.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={resetNewOrder}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                >
                  + Nueva Venta / Pedido
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('orders', '/admin/tienda/pedidos')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Ver Lista de Pedidos
                </button>
              </div>
            </div>
          ) : (
            /* Pantalla del TPV / Terminal de Pedidos */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Columna Izquierda: Selección de Cliente y Catálogo Rápido */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Tipo de Cliente */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-500" />
                      <span>1. Identificación del Cliente</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setOrderCustomerType('walk_in');
                        setSelectedCustomer(null);
                      }}
                      className={`p-3 rounded-2xl border text-left font-bold transition cursor-pointer ${
                        orderCustomerType === 'walk_in'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span>Cliente Mostrador (Venta rápida)</span>
                        {orderCustomerType === 'walk_in' && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <span className="text-[10px] font-normal opacity-80 block">Sin registro en ficha de socio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderCustomerType('member')}
                      className={`p-3 rounded-2xl border text-left font-bold transition cursor-pointer ${
                        orderCustomerType === 'member'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span>Socio del Club (CRM)</span>
                        {orderCustomerType === 'member' && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <span className="text-[10px] font-normal opacity-80 block">Permite cargo en monedero</span>
                    </button>
                  </div>

                  {orderCustomerType === 'member' && (
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Seleccionar Socio Registrado
                      </label>
                      <select
                        value={selectedCustomer?.id || ''}
                        onChange={(e) => {
                          const found = MOCK_CUSTOMERS.find((c) => c.id === e.target.value);
                          setSelectedCustomer(found || null);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">-- Elige un socio del club --</option>
                        {MOCK_CUSTOMERS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.memberNum}) — Saldo: {c.balance.toFixed(2)} €
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* 2. Catálogo para Añadir al Carrito */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-500" />
                      <span>2. Seleccionar Artículos para el Pedido</span>
                    </h3>
                    <span className="text-xs text-slate-400">Clic en (+) para añadir</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                    {productList.map((product) => {
                      const isOutOfStock = product.stock <= 0;

                      return (
                        <div
                          key={product.id}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-10 h-10 rounded-xl object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 dark:text-white truncate">
                                {product.name}
                              </div>
                              <div className="text-[10px] text-slate-500">
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
                            className={`p-2 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                              isOutOfStock
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                            }`}
                            title="Añadir a la cesta"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Forma de Pago y Sede de Venta */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                    <span>3. Método de Cobro & Sede</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    {[
                      { id: 'card', label: 'Tarjeta / TPV', icon: CreditCard },
                      { id: 'cash', label: 'Efectivo', icon: Banknote },
                      { id: 'wallet', label: 'Saldo Monedero', icon: Wallet },
                      { id: 'direct_debit', label: 'Domiciliación', icon: Receipt },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSelected = orderPaymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setOrderPaymentMethod(m.id as any)}
                          className={`p-3 rounded-2xl border text-center font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[11px]">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isMultiVenue && (
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Sede de Salida de Stock
                      </label>
                      <select
                        value={orderVenue}
                        onChange={(e) => setOrderVenue(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                      >
                        <option value="venue-san-mateo">Sede Central Narón</option>
                        <option value="venue-coruna">Sede A Coruña</option>
                        <option value="venue-santiago">Sede Santiago</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Resumen del Ticket y Confirmación */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4 sticky top-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-500" />
                    <span>Ticket de Compra</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    {orderCart.reduce((a, b) => a + b.quantity, 0)} artículos
                  </span>
                </div>

                {orderCart.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                    <ShoppingBag className="w-8 h-8 mx-auto opacity-40" />
                    <div>No hay artículos en el pedido todavía.</div>
                    <p className="text-[11px]">Añade productos desde el panel izquierdo.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {orderCart.map((item) => (
                        <div
                          key={item.product.id}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-bold text-slate-900 dark:text-white truncate">
                              {item.product.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {item.product.price.toFixed(2)} € / ud
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                              {(item.product.price * item.quantity).toFixed(2)} €
                            </span>
                            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
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
                                className="w-5 h-5 rounded flex items-center justify-center font-bold hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-5 text-center font-mono font-bold">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setOrderCart((prev) =>
                                    prev.map((ci) =>
                                      ci.product.id === item.product.id ? { ...ci, quantity: ci.quantity + 1 } : ci
                                    )
                                  );
                                }}
                                className="w-5 h-5 rounded flex items-center justify-center font-bold hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Descuentos & Totales */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Subtotal (PVP con IVA):</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {orderCart
                            .reduce((a, b) => a + b.product.price * b.quantity, 0)
                            .toFixed(2)}{' '}
                          €
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Descuento aplicado:</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            value={orderDiscount}
                            onChange={(e) => setOrderDiscount(Number(e.target.value))}
                            className="w-16 px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-right text-xs"
                          />
                          <span>€</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-black text-slate-900 dark:text-white">
                        <span>Total a Cobrar:</span>
                        <span className="text-xl font-mono text-emerald-600 dark:text-emerald-400">
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
                      className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-2"
                    >
                      <Check className="w-5 h-5" />
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
          MODAL: DETALLES COMPLETOS DEL PRODUCTO (CLICK EN CUALQUIER ÍTEM)
          ===================================================================== */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Ficha Oficial del Producto
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProductDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
              {/* Imagen y Tags */}
              <div className="sm:col-span-5 space-y-3">
                <div className="relative h-60 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <img
                    src={selectedProductDetail.imageUrl}
                    alt={selectedProductDetail.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-slate-950/80 text-white font-mono font-bold text-[10px] uppercase">
                    {selectedProductDetail.brand}
                  </span>
                  <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] uppercase">
                    {selectedProductDetail.category}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                    <span>Rentabilidad Comercial</span>
                    <span className="text-emerald-600">Margen Bruto</span>
                  </div>
                  <div className="flex items-center justify-between font-mono font-black text-sm text-slate-900 dark:text-white">
                    <span>Coste: {getProductCost(selectedProductDetail.price)} €</span>
                    <span className="text-emerald-600">
                      +{selectedProductDetail.price - getProductCost(selectedProductDetail.price)} € (~
                      {getProductMarginPercent(selectedProductDetail.price)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Información y Especificaciones Técnicas */}
              <div className="sm:col-span-7 space-y-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedProductDetail.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {selectedProductDetail.description}
                  </p>
                </div>

                {/* Precios y Stock General */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black block">PVP con IVA</span>
                    <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {selectedProductDetail.price.toFixed(2)} €
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black block">Existencias Totales</span>
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                      {selectedProductDetail.stock} uds
                    </span>
                  </div>
                </div>

                {/* Desglose Multi-Sede del Producto */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-500" />
                      <span>Distribución de Stock por Sede</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Club Multi-Sede Galicia</span>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { id: 'venue-san-mateo', name: 'Sede Central Narón', defaultVal: Math.ceil(selectedProductDetail.stock * 0.6) },
                      { id: 'venue-coruna', name: 'Sede A Coruña', defaultVal: Math.floor(selectedProductDetail.stock * 0.25) },
                      { id: 'venue-santiago', name: 'Sede Santiago', defaultVal: Math.max(0, selectedProductDetail.stock - Math.ceil(selectedProductDetail.stock * 0.6) - Math.floor(selectedProductDetail.stock * 0.25)) },
                    ].map((v) => {
                      const stockInV = selectedProductDetail.venueStock?.[v.id] ?? v.defaultVal;

                      return (
                        <div key={v.id} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{v.name}</span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {stockInV} unidades
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Especificaciones Técnicas */}
                {selectedProductDetail.specs && (
                  <div className="space-y-1.5 text-xs">
                    <span className="font-black text-slate-900 dark:text-white uppercase text-[10px] block">
                      Especificaciones Técnicas:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedProductDetail.specs).map(([k, val]) => (
                        <div key={k} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 block">{k}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Acciones de la Ficha */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setStockModalProduct(selectedProductDetail);
                  setStockAdjustment(10);
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Boxes className="w-4 h-4 text-emerald-500" />
                <span>Entrada / Ajuste de Stock</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductDetail(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Cerrar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(selectedProductDetail);
                    setSelectedProductDetail(null);
                    navigateTo('new_order', '/admin/tienda/pedidos/nuevo');
                  }}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Vender en Mostrador</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Ticket de Venta #{selectedOrderDetail.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cliente:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedOrderDetail.customerName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sede:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{selectedOrderDetail.venueName || 'Sede Central'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Fecha y Hora:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{selectedOrderDetail.createdAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Método de Pago:</span>
                  <span className="font-bold uppercase text-emerald-600">{selectedOrderDetail.paymentMethod}</span>
                </div>
              </div>

              {/* Desglose de Líneas */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-black uppercase">Artículos Adquiridos:</span>
                {selectedOrderDetail.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{item.quantity}x {item.productName}</span>
                      <div className="text-[10px] text-slate-400">{item.unitPrice.toFixed(2)} € / ud</div>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {item.subtotal.toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm font-black">
                <span>Total Abonado:</span>
                <span className="text-xl font-mono text-emerald-600 dark:text-emerald-400">
                  {selectedOrderDetail.totalAmount.toFixed(2)} €
                </span>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    triggerDemoToast('Imprimiendo Ticket', `Ticket ${selectedOrderDetail.id} enviado a la impresora de caja.`, 'info');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerDemoToast('Enviado por WhatsApp', `Copia del ticket enviada al móvil de ${selectedOrderDetail.customerName}.`, 'success');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Enviar por WhatsApp</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Añadir Nuevo Producto al Catálogo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewProductModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Comercial del Producto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Siux Diablo Revolution 3 Pro"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Marca
                  </label>
                  <input
                    type="text"
                    required
                    value={newProductForm.brand}
                    onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="palas">Palas</option>
                    <option value="pelotas">Pelotas</option>
                    <option value="ropa">Ropa & Calzado</option>
                    <option value="accesorios">Accesorios & Grips</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    PVP con IVA (€)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Coste Compra (€)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newProductForm.costPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {isMultiVenue && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sede Inicial de Recepción
                  </label>
                  <select
                    value={newProductForm.targetVenue}
                    onChange={(e) => setNewProductForm({ ...newProductForm, targetVenue: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="venue-san-mateo">Sede Central Narón</option>
                    <option value="venue-coruna">Sede A Coruña</option>
                    <option value="venue-santiago">Sede Santiago</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL de Imagen Oficial
                </label>
                <input
                  type="url"
                  value={newProductForm.imageUrl}
                  onChange={(e) => setNewProductForm({ ...newProductForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: GESTIÓN DE STOCK & ENTRADA MULTI-SEDE DE MERCANCÍA
          ===================================================================== */}
      {stockModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Ajuste de Stock — {stockModalProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStockModalProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Stock Total en Club:</span>
                <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                  {stockModalProduct.stock} unidades
                </span>
              </div>

              {isMultiVenue && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sede a la que Asignar / Sumar Mercancía
                  </label>
                  <select
                    value={stockAdjustmentVenue}
                    onChange={(e) => setStockAdjustmentVenue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="venue-san-mateo">Sede Central Narón</option>
                    <option value="venue-coruna">Sede A Coruña</option>
                    <option value="venue-santiago">Sede Santiago</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Entrada de Mercancía (+ uds a sumar)
                </label>
                <input
                  type="number"
                  value={stockAdjustment}
                  onChange={(e) => setStockAdjustment(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Umbral de Alerta de Stock Mínimo
                </label>
                <input
                  type="number"
                  min="1"
                  value={stockMinAlert}
                  onChange={(e) => setStockMinAlert(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStockModalProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveStock}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Confirmar Entrada
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
