import React, { useState } from 'react';
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
  Edit2,
  Trash2,
  X,
  Check,
  Tag,
  Boxes,
  Percent,
} from 'lucide-react';

export const AdminShopOrders: React.FC = () => {
  const { products, triggerDemoToast, currentTenant } = useApp();

  const [productList, setProductList] = useState<Product[]>(products);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'day' | 'month'>('month');

  // Modals
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState<number>(10);
  const [stockMinAlert, setStockMinAlert] = useState<number>(3);

  // New Product Form
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

  // Sales Chart Mock Data (Daily & Monthly)
  const monthlySales = [
    { label: 'Ene', sales: 4200, orders: 48 },
    { label: 'Feb', sales: 3800, orders: 41 },
    { label: 'Mar', sales: 5600, orders: 62 },
    { label: 'Abr', sales: 6100, orders: 70 },
    { label: 'May', sales: 7400, orders: 84 },
    { label: 'Jun', sales: 8900, orders: 98 },
    { label: 'Jul', sales: 9200, orders: 104 },
    { label: 'Ago', sales: 7800, orders: 86 },
    { label: 'Sep', sales: 11200, orders: 128 },
    { label: 'Oct', sales: 12450, orders: 142 },
  ];

  const dailySales = [
    { label: 'Lun', sales: 380, orders: 4 },
    { label: 'Mar', sales: 520, orders: 6 },
    { label: 'Mié', sales: 450, orders: 5 },
    { label: 'Jue', sales: 680, orders: 8 },
    { label: 'Vie', sales: 940, orders: 11 },
    { label: 'Sáb', sales: 1450, orders: 18 },
    { label: 'Dom', sales: 1120, orders: 14 },
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
    return matchSearch && matchCategory;
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

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-16">
      {/* 1. Header con tipografía y estilo Setmio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Control Financiero & Pro Shop
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Tienda Oficial & Inventario — {currentTenant.name}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Métricas de ingresos, ventas por período, productos más vendidos y gestión de existencias.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewProductModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo Producto</span>
        </button>
      </div>

      {/* 2. KPIs Financieros Principales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
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

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
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

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
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

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
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

      {/* 3. Dashboard Financiero: Gráficos de Ventas por Día / Mes & Ranking Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Gráfico de Ventas Interactivo */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <span>Evolución Financiera de Ventas</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparativa de facturación consolidada en tienda
              </p>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setTimeRange('day')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  timeRange === 'day'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Semanal / Días
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('month')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  timeRange === 'month'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Mensual
              </button>
            </div>
          </div>

          {/* Barras de ventas */}
          <div className="pt-4 pb-2">
            <div className="flex items-end justify-between gap-2 h-44 border-b border-slate-100 dark:border-slate-800 pb-2">
              {chartData.map((d, idx) => {
                const heightPercent = Math.round((d.sales / maxSale) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.sales}€
                    </span>
                    <div
                      className="w-full max-w-[34px] rounded-t-xl bg-gradient-to-t from-emerald-600 to-emerald-400 hover:brightness-110 transition-all cursor-pointer shadow-xs"
                      style={{ height: `${heightPercent}%` }}
                      title={`${d.label}: ${d.sales} € (${d.orders} pedidos)`}
                    />
                    <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 font-mono">
              <span>0 €</span>
              <span>Pico máximo: {maxSale.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Ranking de Productos Más Vendidos */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-500" />
              <span>Top Productos Más Vendidos</span>
            </h2>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
              Acumulado
            </span>
          </div>

          <div className="space-y-2.5">
            {topSellers.map((item, index) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs hover:border-emerald-500/50 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-800 font-mono font-black text-[11px] flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-9 h-9 rounded-xl object-cover shrink-0"
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

      {/* 4. Catálogo de Productos y Modales de Stock */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar producto o marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Productos del Catálogo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => {
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

                  <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                    {p.name}
                  </h3>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
                    Categoría: {p.category}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                      {p.price.toFixed(2)} €
                    </div>
                    <span
                      className={`text-[10px] font-semibold ${
                        isLowStock ? 'text-amber-500 font-bold' : 'text-slate-400'
                      }`}
                    >
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
                    Gestionar Stock
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
                    <option value="accesorios">Accesorios y Pelotas</option>
                    <option value="ropa">Ropa y Textil</option>
                    <option value="zapatillas">Zapatillas de Pádel</option>
                    <option value="paleteros">Paleteros y Mochilas</option>
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
