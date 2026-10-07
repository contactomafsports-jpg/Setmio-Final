import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types/database';
import {
  Search,
  Heart,
  ShoppingBag,
  Zap,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  Truck,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Flame,
  Star,
  Layers,
  Award,
} from 'lucide-react';

export const ShopView: React.FC = () => {
  const {
    products,
    addToCart,
    favorites,
    toggleFavorite,
    triggerDemoToast,
    selectedProductId,
    setSelectedProductId,
    currentTenant,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWeight, setSelectedWeight] = useState<string>('365g');
  const [selectedGrip, setSelectedGrip] = useState<string>('Grip 2 (Standard)');

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const categories = [
    { id: 'all', label: 'Todo el Catálogo', icon: '🎾' },
    { id: 'palas', label: 'Palas Oficiales', icon: '⚡' },
    { id: 'zapatillas', label: 'Zapatillas', icon: '👟' },
    { id: 'paleteros', label: 'Paleteros & Mochilas', icon: '🎒' },
    { id: 'ropa', label: 'Ropa Técnica', icon: '👕' },
    { id: 'accesorios', label: 'Bolas & Accesorios', icon: '🎯' },
  ];

  const offersProducts = products.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
  const recommendedProducts = products.filter((p) => p.isFeatured);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const relatedProducts = selectedProduct
    ? products.filter((p) => p.id !== selectedProduct.id && (p.category === selectedProduct.category || p.brand === selectedProduct.brand)).slice(0, 4)
    : [];

  const handleTestOnCourt = (product: Product) => {
    triggerDemoToast(
      'Pala de Test Reservada',
      `Has reservado la pala "${product.name}". Solicítala en recepción antes de entrar a pista para probarla durante tu reserva.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* If a product is selected -> FULL DEDICATED PAGE (No modal) */}
        {selectedProduct ? (
          <section className="animate-in fade-in duration-150 max-w-5xl mx-auto">
            {/* Aesthetic Back Button */}
            <div className="mb-4">
              <button
                onClick={() => setSelectedProductId(null)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm transition"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Volver a la Tienda del Club</span>
              </button>
            </div>

            <div className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Product Gallery */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-80 sm:h-96 object-cover rounded-2xl mx-auto"
                  />
                  <button
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    className="absolute top-6 right-6 p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-rose-500 shadow-md backdrop-blur-sm transition"
                    title="Favorito"
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(selectedProduct.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                  {selectedProduct.compareAtPrice && (
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs uppercase shadow">
                        Oferta Club
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details & Actions */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <span>{selectedProduct.brand}</span>
                    <span>·</span>
                    <span className="text-slate-500">{selectedProduct.category}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedProduct.name}
                  </h1>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                    {selectedProduct.price.toFixed(2)} €
                  </span>
                  {selectedProduct.compareAtPrice && (
                    <span className="text-base line-through text-slate-400 font-mono">
                      {selectedProduct.compareAtPrice.toFixed(2)} €
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    Stock Disponible en Club
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Weight and Grip Options */}
                {selectedProduct.category === 'palas' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Peso Seleccionado
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['360g', '365g', '370g'].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setSelectedWeight(w)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                              selectedWeight === w
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Grosor de Puño
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Grip 2 (Standard)', 'Grip 3 (Con Overgrip)'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setSelectedGrip(g)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                              selectedGrip === g
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Añadir al Carrito ({selectedProduct.price.toFixed(2)} €)</span>
                  </button>

                  {selectedProduct.category === 'palas' && (
                    <button
                      onClick={() => handleTestOnCourt(selectedProduct)}
                      className="py-3.5 px-6 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-teal-400 font-bold text-xs border border-teal-500/30 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Probar en Pista (Test)</span>
                    </button>
                  )}
                </div>

                {/* Technical Specifications */}
                {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                      Especificaciones Técnicas
                    </div>
                    <dl className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                      {Object.entries(selectedProduct.specs).map(([key, val]) => (
                        <div key={key}>
                          <dt className="capitalize text-[10px] text-slate-400">{key}:</dt>
                          <dd className="font-semibold text-slate-800 dark:text-slate-200">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {/* Club Purchase Policies Box */}
                <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-2.5 text-xs">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Políticas de Compra & Garantía Oficial {currentTenant.shortName}</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Garantía oficial de 2 años en todas las palas de carbono.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Derecho de cambio o devolución en 30 días naturales sin desprecintar.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Recogida inmediata en la recepción del club o envío a domicilio.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Related Products Carousel */}
            {relatedProducts.length > 0 && (
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    <span>Productos Relacionados</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProductId(p.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                    >
                      <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">{p.brand}</div>
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{p.name}</h4>
                        <div className="font-mono font-bold text-slate-900 dark:text-white">{p.price.toFixed(2)} €</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
          </section>
        ) : (
          /* MAIN STORE LAYOUT */
          <>
            {/* 1. Header Hero */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-900/40 p-8 sm:p-12 text-white shadow-xl">
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

            {/* 2. SECOND SECTION: STYLIZED IMAGE BANNER WITH OVERLAID TEXT */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 h-64 sm:h-80">
              <img
                src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1600&q=80"
                alt="Test Center de Palas en Pista"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center max-w-xl text-white space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400 text-slate-950 font-black text-[11px] uppercase tracking-wider self-start shadow">
                  <Zap className="w-3.5 h-3.5" /> Test Center Oficial
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  Prueba tu pala en pista antes de decidirte
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Solicita gratis cualquier pala de la nueva temporada en la recepción de {currentTenant.shortName} y juega 20 minutos con ella en tu partido.
                </p>
              </div>
            </div>

            {/* 3. CATEGORIES CARDS WITH ICONS */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Categorías del Catálogo
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-bold">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. CAROUSEL DE OFERTAS */}
            {offersProducts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-rose-500" />
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Carrusel de Ofertas
                    </h2>
                  </div>
                  <span className="text-xs text-rose-500 font-bold">Descuentos de hasta el 35%</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {offersProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setSelectedProductId(product.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="cursor-pointer rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950/60 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase shadow">
                            Oferta
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">{product.brand}</div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{product.name}</h4>
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono font-black text-base text-rose-600 dark:text-rose-400">
                            {product.price.toFixed(2)} €
                          </span>
                          <span className="font-mono text-xs line-through text-slate-400">
                            {product.compareAtPrice?.toFixed(2)} €
                          </span>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <span className="block w-full py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-center font-bold text-xs group-hover:bg-rose-600 group-hover:text-white transition">
                          Ver Detalle Completo
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. CAROUSEL DE RECOMENDADOS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Carrusel de Recomendados
                  </h2>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Elección de los entrenadores</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProductId(product.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="cursor-pointer rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase shadow">
                          Pro Pick
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">{product.brand}</div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{product.name}</h4>
                      <div className="font-mono font-black text-base text-slate-900 dark:text-white">
                        {product.price.toFixed(2)} €
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <span className="block w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-center font-bold text-xs group-hover:bg-emerald-600 group-hover:text-white transition">
                        Ver Detalles
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. GENERAL SEARCH & CATALOG GRID */}
            <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Catálogo Completo ({filteredProducts.length})
                </h2>
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar pala, zapatillas, bolas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProductId(product.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="cursor-pointer rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:text-rose-500 shadow-sm transition"
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">{product.brand}</div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{product.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                          {product.price.toFixed(2)} €
                        </span>
                        {product.compareAtPrice && (
                          <span className="font-mono text-xs line-through text-slate-400">
                            {product.compareAtPrice.toFixed(2)} €
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white font-bold text-xs text-slate-900 dark:text-white transition flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Añadir al Carrito</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. PURCHASE POLICIES SECTION (CLUB EDITABLE & DISPLAYED) */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Políticas de Compra y Condiciones Oficiales de {currentTenant.name}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentTenant.settings.purchasePolicies ||
                  'Todos los productos adquiridos en Setmio Pro Shop cuentan con garantía oficial de fabricante de 2 años. Puedes recoger tu pedido en la recepción del club sin costes de envío o solicitar entrega peninsular en 24/48 horas. Se aceptan cambios y devoluciones durante los primeros 30 días naturales con el embalaje y precinto original.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Prueba en pista gratuita antes de comprar</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Devolución garantizada 30 días</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Asesoramiento por entrenadores FEP</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
