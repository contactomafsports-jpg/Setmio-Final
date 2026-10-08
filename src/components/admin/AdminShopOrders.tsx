import React, { useState, useEffect } from 'react';
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
  Sparkles,
} from 'lucide-react';

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
];

export const AdminShopOrders: React.FC = () => {
  const { products, triggerDemoToast, currentTenant, t } = useApp();

  // Navigation View State: 'dashboard' | 'products' | 'new_order'
  const [activeView, setActiveView] = useState<'dashboard' | 'products' | 'new_order'>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p.includes('/productos')) return 'products';
      if (p.includes('/pedidos/nuevo') || p.includes('/nuevo-pedido')) return 'new_order';
    }
    return 'dashboard';
  });

  const [productList, setProductList] = useState<Product[]>(products);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [timeRange, setTimeRange] = useState<'day' | 'month'>('month');
  const [hoveredChartIndex, setHoveredChartIndex] = useState<number | null>(null);

  // Modals
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState<number>(10);
  const [stockMinAlert, setStockMinAlert] = useState<number>(3);

  // New Order State
  const [orderCustomerType, setOrderCustomerType] = useState<'walk_in' | 'member'>('walk_in');
  const [selectedCustomer, setSelectedCustomer] = useState<MockCustomer | null>(null);
  const [orderCart, setOrderCart] = useState<OrderItem[]>([]);
  const [orderPaymentMethod, setOrderPaymentMethod] = useState<'card' | 'cash' | 'wallet' | 'direct_debit'>('card');
  const [orderDiscount, setOrderDiscount] = useState<number>(0);
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState<string | null>(null);

  // Sync route on popstate
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const p = window.location.pathname;
        if (p.includes('/productos')) {
          setActiveView('products');
        } else if (p.includes('/pedidos/nuevo') || p.includes('/nuevo-pedido')) {
          setActiveView('new_order');
        } else {
          setActiveView('dashboard');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: 'dashboard' | 'products' | 'new_order', url: string) => {
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
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80',
    description: 'Pala oficial de competición con fibra de carbono 12K.',
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

  // Categories
  const categories = ['all', 'palas', 'pelotas', 'accesorios', 'ropa'];

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

  // Handle Create Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) return;

    const created: Product = {
      id: `prod-${Date.now()}`,
      tenantId: currentTenant.id,
      name: newProductForm.name.trim(),
      brand: newProductForm.brand.trim(),
      category: newProductForm.category,
      price: Number(newProductForm.price),
      stock: Number(newProductForm.stock),
      imageUrl: newProductForm.imageUrl,
      description: newProductForm.description,
      isFeatured: true,
      specs: {},
    };

    setProductList((prev) => [created, ...prev]);
    setIsNewProductModalOpen(false);
    triggerDemoToast(
      'Producto Creado',
      `"${created.name}" añadido al catálogo de la tienda con ${created.stock} unidades.`,
      'success'
    );
  };

  // Handle Save Stock Adjustment
  const handleSaveStock = () => {
    if (!stockModalProduct) return;
    const newStock = Math.max(0, stockModalProduct.stock + stockAdjustment);
    setProductList((prev) =>
      prev.map((p) => (p.id === stockModalProduct.id ? { ...p, stock: newStock } : p))
    );
    triggerDemoToast(
      'Stock Actualizado',
      `Nuevo inventario de "${stockModalProduct.name}": ${newStock} unidades disponibles. Alerta mínima en ${stockMinAlert} uds.`,
      'success'
    );
    setStockModalProduct(null);
  };

  // Order Cart Helpers
  const addToCart = (product: Product) => {
    setOrderCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          triggerDemoToast('Stock Limitado', `Solo hay ${product.stock} unidades disponibles en tienda.`, 'warning');
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setOrderCart((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  // Calculation for Order
  const subtotalCart = orderCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (subtotalCart * orderDiscount) / 100;
  const taxableAmount = Math.max(0, subtotalCart - discountAmount);
  const taxAmount = taxableAmount * 0.21;
  const totalOrderAmount = taxableAmount;

  // Handle Complete Order
  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderCart.length === 0) {
      triggerDemoToast('Carrito Vacío', 'Añade al menos un producto para crear el pedido.', 'warning');
      return;
    }

    // Decrement stock in productList
    setProductList((prev) =>
      prev.map((p) => {
        const inCart = orderCart.find((ci) => ci.product.id === p.id);
        if (inCart) {
          return { ...p, stock: Math.max(0, p.stock - inCart.quantity) };
        }
        return p;
      })
    );

    const generatedOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setLastCreatedOrderId(generatedOrderId);

    triggerDemoToast(
      t('shop.orderSuccess', 'Pedido Creado con Éxito'),
      t('shop.orderSuccessDetail', 'Se ha descontado el stock y registrado el cobro en caja.'),
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

  // Metric aggregates
  const totalCatalogUnits = productList.reduce((acc, p) => acc + p.stock, 0);
  const totalCatalogValue = productList.reduce((acc, p) => acc + p.price * p.stock, 0);

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
                {activeView === 'products'
                  ? t('shop.catalogTitle', 'Catálogo Completo de Productos')
                  : t('shop.newOrderTitle', 'Crear Nuevo Pedido')}
              </span>
            </div>
          )}

          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Control Financiero & Pro Shop
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            {activeView === 'dashboard' && `Tienda Oficial & Inventario — ${currentTenant.name}`}
            {activeView === 'products' && t('shop.catalogTitle', 'Catálogo Completo de Productos')}
            {activeView === 'new_order' && t('shop.newOrderTitle', 'Crear Nuevo Pedido — Tienda Oficial')}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {activeView === 'dashboard' && 'Métricas de ingresos, ventas por período, productos más vendidos y gestión de existencias.'}
            {activeView === 'products' && t('shop.catalogSubtitle', 'Gestión integral de existencias, tarifas y alertas de reposición.')}
            {activeView === 'new_order' && t('shop.newOrderSubtitle', 'Venta directa de material, accesorios y consumibles con cargo en caja o monedero.')}
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
              <span>{t('shop.backToShop', 'Volver a Resumen de Tienda')}</span>
            </button>
          )}

          {/* Botón "+ Nuevo Pedido" (secundario al lado de Nuevo Producto) */}
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
            <span>{t('shop.newOrder', '+ Nuevo Pedido')}</span>
          </button>

          {/* Botón "Nuevo Producto" con UN SOLO icono + */}
          <button
            type="button"
            onClick={() => setIsNewProductModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('shop.newProduct', 'Nuevo Producto')}</span>
          </button>
        </div>
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
                87,68 €
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Margen comercial: 38%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-extrabold uppercase text-[10px]">Alertas de Stock</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black font-mono text-amber-500">
                2 Artículos
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                Por debajo de 5 unidades
              </div>
            </div>
          </div>

          {/* 3. Dashboard Financiero: Gráfico de Ventas Interactivo & Más Vendidos */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Gráfico de Ventas Interactivo con Tooltip y Responsividad Corregida */}
            <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-500" />
                    <span>{t('shop.chartTitle', 'Evolución Financiera de Ventas')}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('shop.chartSubtitle', 'Comparativa de facturación consolidada en tienda')}
                  </p>
                </div>

                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setTimeRange('day');
                      setHoveredChartIndex(null);
                    }}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      timeRange === 'day'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t('shop.chartWeekly', 'Semanal / Días')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTimeRange('month');
                      setHoveredChartIndex(null);
                    }}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      timeRange === 'month'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t('shop.chartMonthly', 'Mensual')}
                  </button>
                </div>
              </div>

              {/* Contenedor del Gráfico con Fix Responsive Completo */}
              <div className="pt-6 pb-2 w-full min-w-0">
                <div className="relative w-full min-w-0">
                  <div className="w-full min-w-0 flex items-end justify-between gap-1 sm:gap-2.5 h-48 border-b border-slate-100 dark:border-slate-800 pb-2">
                    {chartData.map((d, idx) => {
                      const heightPercent = Math.max(12, Math.round((d.sales / maxSale) * 100));
                      const isHovered = hoveredChartIndex === idx;

                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoveredChartIndex(idx)}
                          onMouseLeave={() => setHoveredChartIndex(null)}
                          onClick={() => setHoveredChartIndex(idx)}
                          className="flex-1 min-w-0 flex flex-col items-center gap-1.5 h-full justify-end relative group cursor-pointer"
                        >
                          {/* TOOLTIP INTERACTIVO FLOTANTE AL PASAR EL CURSOR */}
                          {isHovered && (
                            <div className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-30 pointer-events-none w-44 p-3 rounded-2xl bg-slate-950/95 dark:bg-slate-900/95 text-white border border-slate-700 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                  {d.fullLabel}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-emerald-400">
                                  {d.orders} {t('shop.ordersCount', 'pedidos')}
                                </span>
                              </div>
                              <div className="space-y-0.5">
                                <div className="text-[10px] text-slate-400">
                                  {t('shop.totalAccumulated', 'Total acumulado')}:
                                </div>
                                <div className="text-sm font-black font-mono text-emerald-300">
                                  {d.sales.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                                </div>
                                <div className="text-[9px] text-slate-400 pt-0.5 flex items-center justify-between">
                                  <span>{t('shop.averageTicket', 'Ticket medio')}:</span>
                                  <span className="font-mono text-slate-200">
                                    {(d.sales / d.orders).toFixed(2)} €
                                  </span>
                                </div>
                              </div>
                              {/* Flecha indicadora */}
                              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 dark:bg-slate-900 border-r border-b border-slate-700 rotate-45" />
                            </div>
                          )}

                          {/* Barra estilizada */}
                          <div
                            className={`w-full max-w-[22px] sm:max-w-[34px] rounded-t-xl transition-all duration-200 shadow-xs ${
                              isHovered
                                ? 'bg-gradient-to-t from-emerald-500 to-teal-300 scale-y-105 shadow-md shadow-emerald-500/20'
                                : 'bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-emerald-500 group-hover:to-emerald-300'
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          />

                          {/* Etiqueta inferior del eje X */}
                          <span
                            className={`text-[9px] sm:text-[10px] font-mono font-bold transition-colors ${
                              isHovered
                                ? 'text-emerald-600 dark:text-emerald-400 scale-105'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {d.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 font-mono">
                  <span>0 €</span>
                  <span className="text-[10px] text-slate-500 italic">Pasa el cursor sobre cada barra para ver importe acumulado</span>
                  <span>Pico: {maxSale.toLocaleString('es-ES')} €</span>
                </div>
              </div>
            </div>

            {/* SECCIÓN "MÁS VENDIDOS" (Con botón a la derecha "Todos los productos") */}
            <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-emerald-500" />
                  <span>{t('shop.topSellersTitle', 'Más vendidos')}</span>
                </h2>

                {/* Enlace/Botón a la derecha: "Todos los productos" -> /admin/tienda/productos */}
                <button
                  type="button"
                  onClick={() => navigateTo('products', '/admin/tienda/productos')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs transition border border-slate-200 dark:border-slate-700/80 cursor-pointer group"
                  title="Ver catálogo completo de productos"
                >
                  <span>{t('shop.allProducts', 'Todos los productos')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="space-y-2.5">
                {topSellers.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs hover:border-emerald-500/50 transition shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-800 font-mono font-black text-[11px] flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {item.unitsSold} uds vendidas · Stock: {item.stock}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                        {item.revenue.toFixed(2)} €
                      </div>
                      <span className="text-[9px] uppercase font-bold text-slate-400">Facturado</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Vista previa rápida del Catálogo en Portada */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-500" />
                  <span>Artículos en Stock ({filteredProducts.length})</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Acceso rápido a gestión de stock y precios
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateTo('products', '/admin/tienda/productos')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <span>{t('shop.allProducts', 'Todos los productos')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Grid de Productos resumido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.slice(0, 4).map((p) => {
                const isLowStock = p.stock <= 4;
                return (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-emerald-500/50 transition shadow-xs group"
                  >
                    <div>
                      <div className="relative h-32 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-2">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-white font-mono font-bold text-[9px] uppercase tracking-wider backdrop-blur-xs">
                          {p.brand}
                        </span>
                        {isLowStock && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[9px] uppercase shadow-xs">
                            Stock Bajo
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                        {p.name}
                      </h4>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
                        Categoría: {p.category}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                          {p.price.toFixed(2)} €
                        </div>
                        <span className={`text-[10px] font-semibold ${isLowStock ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
                          Stock: {p.stock} uds
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setStockModalProduct(p);
                          setStockAdjustment(10);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500 font-bold text-[11px] transition cursor-pointer shadow-xs"
                      >
                        {t('shop.manageStock', 'Gestionar Stock')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          VISTA 2: LISTADO COMPLETO DE PRODUCTOS (/admin/tienda/productos)
          ====================================================================== */}
      {activeView === 'products' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Métricas rápidas del inventario */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Referencias Totales</span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {productList.length} artículos
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Unidades en Almacén</span>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {totalCatalogUnits} unidades
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Valoración Stock PVP</span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {totalCatalogValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
              </div>
            </div>
          </div>

          {/* Filtros y Buscador */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o marca..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold overflow-x-auto no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg transition capitalize whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat === 'all' ? t('shop.filterAll', 'Todos') : cat}
                    </button>
                  ))}
                </div>

                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">Todo el stock</option>
                  <option value="low">Stock Bajo (&le; 4 uds)</option>
                  <option value="out">Sin Stock (0 uds)</option>
                </select>
              </div>
            </div>

            {/* Grid Completo de Productos */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
                <Package className="w-10 h-10 mx-auto text-slate-400 opacity-60" />
                <div className="font-bold text-sm">No se encontraron productos</div>
                <p className="text-xs">Prueba con otros términos de búsqueda o cambia los filtros de categoría.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                {filteredProducts.map((p) => {
                  const isLowStock = p.stock > 0 && p.stock <= 4;
                  const isOut = p.stock === 0;

                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-emerald-500/50 transition shadow-xs group"
                    >
                      <div>
                        <div className="relative h-36 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-slate-950/80 text-white font-mono font-bold text-[9px] uppercase tracking-wider backdrop-blur-xs">
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

                        <h3 className="font-black text-sm text-slate-900 dark:text-white line-clamp-2">
                          {p.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {p.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 font-bold">
                            {p.category}
                          </span>
                          <span>ID: {p.id}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">PVP</span>
                            <div className="font-mono font-black text-base text-emerald-600 dark:text-emerald-400">
                              {p.price.toFixed(2)} €
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-medium">Existencias</span>
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
                            onClick={() => {
                              setStockModalProduct(p);
                              setStockAdjustment(10);
                            }}
                            className="w-full py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer shadow-xs text-center"
                          >
                            {t('shop.manageStock', 'Gestionar Stock')}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(p);
                              navigateTo('new_order', '/admin/tienda/pedidos/nuevo');
                            }}
                            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-xs text-center flex items-center justify-center gap-1"
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
          VISTA 3: CREACIÓN DE NUEVO PEDIDO (/admin/tienda/pedidos/nuevo)
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
                  ¡Pedido Completado y Cobrado!
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  El stock de los productos ha sido actualizado en tiempo real y el importe ha quedado reflejado en el arqueo del TPV.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Importe total cobrado:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                    {totalOrderAmount.toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Método de pago:</span>
                  <span className="capitalize">{orderPaymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Cliente:</span>
                  <span>{orderCustomerType === 'walk_in' ? 'Cliente de Mostrador' : selectedCustomer?.name}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => resetNewOrder()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  + Crear Otro Pedido
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('dashboard', '/admin/tienda')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  Volver al Panel
                </button>
              </div>
            </div>
          ) : (
            /* Formulario completo de Nuevo Pedido */
            <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Columna Izquierda: Configuración del Pedido y Selección de Productos */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Selector de Cliente */}
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3.5">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-500" />
                    <span>{t('shop.selectCustomer', 'Cliente / Socio')}</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs">
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
                        <span>{t('shop.walkInCustomer', 'Cliente Mostrador (Venta rápida)')}</span>
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
                        required
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

                {/* 2. Añadir Artículos desde la Tienda */}
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-500" />
                      <span>{t('shop.selectProducts', 'Artículos del Pedido')}</span>
                    </h3>
                    <span className="text-xs text-slate-400">Haz clic en (+) para añadir</span>
                  </div>

                  {/* Listado horizontal o grid para selección rápida */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {productList.map((product) => {
                      const inCart = orderCart.find((ci) => ci.product.id === product.id);
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
                              className="w-9 h-9 rounded-xl object-cover shrink-0"
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
                            onClick={() => addToCart(product)}
                            className={`p-2 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                              isOutOfStock
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                : inCart
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white'
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

                {/* 3. Método de Pago y Descuentos */}
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3.5">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                    <span>{t('shop.paymentMethod', 'Forma de Pago')}</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    {[
                      { id: 'card', label: t('shop.paymentCard', 'Tarjeta / TPV'), icon: CreditCard },
                      { id: 'cash', label: t('shop.paymentCash', 'Efectivo'), icon: Banknote },
                      { id: 'wallet', label: t('shop.paymentWallet', 'Saldo Monedero'), icon: Wallet },
                      { id: 'direct_debit', label: t('shop.paymentDirectDebit', 'Domiciliación'), icon: Receipt },
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Descuento (%)
                      </label>
                      <select
                        value={orderDiscount}
                        onChange={(e) => setOrderDiscount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value={0}>Sin descuento (0%)</option>
                        <option value={5}>5% Descuento Socio</option>
                        <option value={10}>10% Descuento Promoción</option>
                        <option value={15}>15% Descuento Especial</option>
                        <option value={20}>20% Liquidación</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Notas del Pedido
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Entregado en mano en pista 3..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Resumen del Pedido (Carrito Activo) */}
              <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4 sticky top-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-500" />
                    <span>{t('shop.orderSummary', 'Desglose de Cobro')}</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {orderCart.length} líneas
                  </span>
                </div>

                {/* Items seleccionados en el carrito */}
                {orderCart.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <ShoppingBag className="w-8 h-8 mx-auto opacity-40" />
                    <div className="text-xs font-bold">El carrito está vacío</div>
                    <p className="text-[11px]">Selecciona artículos de la lista de la izquierda.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {orderCart.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white truncate">
                            {item.product.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.product.price.toFixed(2)} € / ud
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Controles de Cantidad */}
                          <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 font-mono font-bold text-xs">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-bold"
                            >
                              +
                            </button>
                          </div>

                          <div className="font-mono font-black text-slate-900 dark:text-white text-xs w-16 text-right">
                            {(item.product.price * item.quantity).toFixed(2)} €
                          </div>

                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, 0)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Resumen de totales */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>{t('shop.subtotal', 'Subtotal neto')}</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {subtotalCart.toFixed(2)} €
                    </span>
                  </div>

                  {orderDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>{t('shop.discount', 'Descuento aplicado')} ({orderDiscount}%)</span>
                      <span className="font-mono font-bold">-{discountAmount.toFixed(2)} €</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500">
                    <span>{t('shop.tax', 'IVA (21% incluido)')}</span>
                    <span className="font-mono">{taxAmount.toFixed(2)} €</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {t('shop.total', 'Total a Cobrar')}
                    </span>
                    <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {totalOrderAmount.toFixed(2)} €
                    </span>
                  </div>
                </div>

                {/* Botón de Confirmar Pedido */}
                <button
                  type="submit"
                  disabled={orderCart.length === 0}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98] cursor-pointer ${
                    orderCart.length === 0
                      ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('shop.completeOrder', 'Confirmar y Cobrar Pedido')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* =====================================================================
          MODAL: NUEVO PRODUCTO EN CATÁLOGO
          ===================================================================== */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Añadir Producto a la Tienda
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewProductModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
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
                  placeholder="Ej: Pala Bullpadel Hack 03 2026"
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
                    onChange={(e) =>
                      setNewProductForm({
                        ...newProductForm,
                        category: e.target.value as Product['category'],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="palas">Palas de Pádel</option>
                    <option value="pelotas">Pelotas y Botes</option>
                    <option value="accesorios">Accesorios y Grips</option>
                    <option value="ropa">Ropa y Textil</option>
                    <option value="zapatillas">Zapatillas de Pádel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Precio Venta (€) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Coste Prov. (€)
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
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs"
                >
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: GESTIÓN DE STOCK & ENTRADA DE MERCANCÍA
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
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Stock Actual en Tienda:</span>
                <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                  {stockModalProduct.stock} unidades
                </span>
              </div>

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

              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                Stock resultante tras confirmar: <strong>{stockModalProduct.stock + stockAdjustment}</strong> unidades.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStockModalProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveStock}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs"
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
