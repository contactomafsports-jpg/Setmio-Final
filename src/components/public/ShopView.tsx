import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types/database';
import {
  Search,
  SlidersHorizontal,
  Heart,
  ShoppingBag,
  Check,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Truck,
} from 'lucide-react';

export const ShopView: React.FC = () => {
  const {
    products,
    addToCart,
    toggleFavorite,
    isFavorite,
    currentTenant,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'palas', label: 'Palas' },
    { id: 'zapatillas', label: 'Zapatillas' },
    { id: 'paleteros', label: 'Paleteros' },
    { id: 'accesorios', label: 'Accesorios & Bolas' },
  ];

  const brands = ['all', 'Bullpadel', 'Nox', 'Asics', 'Head', 'Wilson'];

  // Filtering & Sorting
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchBrand = selectedBrand === 'all' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchBrand && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      {/* Ecommerce Promo Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/70 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="max-w-xl space-y-3 relative z-10">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pro Shop Oficial Pádel San Mateo</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Equípate con las mejores marcas del circuito
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Pruébalas en pista antes de decidirte. Asesoramiento personalizado por nuestros entrenadores y recogida inmediata en las instalaciones del club en Narón.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Recogida gratuita en club</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Prueba de palas en pista</span>
            </div>
          </div>
        </div>

        {/* Decorative corner background */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80"
            alt="Padel racket gear"
            className="w-full h-full object-cover object-right"
          />
        </div>
      </div>

      {/* Search, Filter Bar & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por pala, marca o modelo..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Brand & Sort Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b === 'all' ? 'Todas las Marcas' : b}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'featured' | 'price_asc' | 'price_desc')}
            className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="featured">Destacados</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((p) => {
          const favorite = isFavorite(p.id);
          return (
            <div
              key={p.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition flex flex-col justify-between group shadow-xl"
            >
              {/* Image & Badges */}
              <div className="relative h-60 bg-slate-950 overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  onClick={() => setSelectedProduct(p)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                />

                <button
                  onClick={() => toggleFavorite(p.id)}
                  className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition ${
                    favorite ? 'bg-rose-500 text-white' : 'bg-slate-900/80 text-slate-300 hover:text-white'
                  }`}
                  title="Guardar en favoritos"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>

                <div className="absolute bottom-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900/90 text-emerald-400 border border-slate-700">
                  {p.brand}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div onClick={() => setSelectedProduct(p)} className="cursor-pointer space-y-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-base font-black text-white font-mono">{p.price.toFixed(2)} €</div>
                    {p.compareAtPrice && (
                      <div className="text-[11px] text-slate-500 line-through">
                        {p.compareAtPrice.toFixed(2)} €
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(p, 1)}
                    className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow"
                    title="Añadir a la cesta"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 h-72 sm:h-80">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    {selectedProduct.brand} · {selectedProduct.category}
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">{selectedProduct.name}</h3>
                </div>

                <div className="flex items-baseline gap-3">
                  <div className="text-2xl font-black text-white font-mono">
                    {selectedProduct.price.toFixed(2)} €
                  </div>
                  {selectedProduct.compareAtPrice && (
                    <div className="text-xs text-slate-500 line-through">
                      {selectedProduct.compareAtPrice.toFixed(2)} €
                    </div>
                  )}
                  <div className="text-[11px] text-emerald-400 font-semibold">
                    Stock: {selectedProduct.stock} unidades en club
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed">{selectedProduct.description}</p>

                {/* Technical Specs */}
                {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1">
                      Ficha Técnica
                    </div>
                    {Object.entries(selectedProduct.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-[11px] text-slate-400">
                        <span>{key}:</span>
                        <span className="text-slate-200 font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-xs text-slate-950 flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Añadir a la Cesta</span>
                  </button>

                  <button
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    className={`p-3 rounded-xl border transition ${
                      isFavorite(selectedProduct.id)
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
