import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types/database';
import {
  Search,
  Heart,
  ShoppingBag,
  Zap,
  ArrowRight,
  X,
  ShieldCheck,
  RotateCcw,
  Truck,
  Sparkles,
} from 'lucide-react';

export const ShopView: React.FC = () => {
  const { products, addToCart, favorites, toggleFavorite, triggerDemoToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<string>('365g');
  const [selectedGrip, setSelectedGrip] = useState<string>('Grip 2 (Standard)');

  const categories = [
    { id: 'all', label: 'Todo el Catálogo' },
    { id: 'palas', label: 'Palas Oficiales' },
    { id: 'zapatillas', label: 'Zapatillas' },
    { id: 'paleteros', label: 'Paleteros & Mochilas' },
    { id: 'ropa', label: 'Ropa Técnica' },
    { id: 'accesorios', label: 'Bolas & Accesorios' },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(product);
  };

  const handleTestOnCourt = (product: Product) => {
    triggerDemoToast(
      'Pala de Test Reservada',
      `Has reservado la pala "${product.name}". Solicítala en recepción antes de entrar a pista para probarla durante tu reserva.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-900/40 p-8 sm:p-12 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-4 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Setmio Pro Shop & Test Center
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Material Oficial de Competición
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mb-6 leading-relaxed">
              Prueba tu pala en pista antes de comprar. Asesoramiento biomecánico por nuestros entrenadores
              titulados y entrega inmediata en recepción.
            </p>
            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Test en pista gratuito (20 min)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Recogida instantánea en el club</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                <span>Garantía oficial y cambio 30 días</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Categories pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar pala, marca, accesorio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isFav = favorites.includes(product.id);
            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 overflow-hidden hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image & Badges */}
                <div className="relative aspect-square bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center p-6">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Brand pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                    {product.brand}
                  </span>

                  {/* Favorite button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-sm transition-all ${
                      isFav
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/90 dark:bg-slate-900/90 text-slate-400 hover:text-rose-500 border border-slate-200/50 dark:border-slate-700/50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Test Court badge */}
                  {product.category === 'palas' && (
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      Disponible para Test
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-xl font-black text-slate-900 dark:text-white">
                          {product.price.toFixed(2)}€
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">IVA incl.</span>
                      </div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {product.stock > 0 ? `${product.stock} en stock` : 'Bajo pedido'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Comprar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        Detalles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200">No encontramos productos</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Prueba ajustando el término de búsqueda o seleccionando otra categoría.
            </p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase">
                  {selectedProduct.brand}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Ref: SET-{selectedProduct.id.slice(0, 6)}</span>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image Area */}
                <div className="bg-slate-100 dark:bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-200/60 dark:border-slate-800">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="max-h-64 object-contain"
                  />
                  <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-4 h-4" /> Distribuidor oficial certificado
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    {selectedProduct.name}
                  </h2>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      {selectedProduct.price.toFixed(2)}€
                    </span>
                    <span className="text-xs text-slate-400">IVA incluido</span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {selectedProduct.description}
                  </p>

                  {/* Racket specs if applicable */}
                  {selectedProduct.category === 'palas' && (
                    <div className="space-y-4 mb-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                          Peso seleccionado
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['360g', '365g', '370g'].map((weight) => (
                            <button
                              key={weight}
                              onClick={() => setSelectedWeight(weight)}
                              className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                                selectedWeight === weight
                                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {weight}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                          Grip & Protector
                        </label>
                        <select
                          value={selectedGrip}
                          onChange={(e) => setSelectedGrip(e.target.value)}
                          className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                        >
                          <option value="Grip 2 (Standard)">Grip 2 (Estándar recomendado)</option>
                          <option value="Grip 1 (Manos pequeñas)">Grip 1 (Junior / Femenino fino)</option>
                          <option value="Grip 3 (Con overgrip extra)">Grip 3 (+1 Overgrip ShockOut instalado)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Añadir al Carrito ({selectedProduct.price.toFixed(2)}€)
                    </button>

                    {selectedProduct.category === 'palas' && (
                      <button
                        onClick={() => handleTestOnCourt(selectedProduct)}
                        className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4 text-emerald-500" />
                        Solicitar pala de prueba para hoy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
