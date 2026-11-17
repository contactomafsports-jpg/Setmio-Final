import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types/database';
import heroPadelImg from '../../assets/images/hero_padel_club_1794872242820.jpg';
import playerPadelImg from '../../assets/images/player_padel_action_1794872242959.jpg';
import {
  Search,
  Heart,
  ShoppingBag,
  Zap,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  Truck,
  CheckCircle2,
  Star,
  Layers,
  Footprints,
  Briefcase,
  Shirt,
  Target,
  Tag,
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
    { id: 'all', label: 'Todo el Catálogo', Icon: Layers },
    { id: 'palas', label: 'Palas Oficiales', Icon: Zap },
    { id: 'zapatillas', label: 'Zapatillas', Icon: Footprints },
    { id: 'paleteros', label: 'Paleteros', Icon: Briefcase },
    { id: 'ropa', label: 'Ropa Técnica', Icon: Shirt },
    { id: 'accesorios', label: 'Accesorios', Icon: Target },
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
    ? products
        .filter((p) => p.id !== selectedProduct.id && (p.category === selectedProduct.category || p.brand === selectedProduct.brand))
        .slice(0, 4)
    : [];

  const handleTestOnCourt = (product: Product) => {
    triggerDemoToast(
      'Pala de Test Reservada',
      `Has reservado la pala "${product.name}". Solicítala en recepción antes de entrar a pista para probarla durante tu reserva.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#071220] text-[#0B1A2D] dark:text-slate-100 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {selectedProduct ? (
          <section className="animate-in fade-in duration-150 max-w-5xl mx-auto space-y-12">
            <div>
              <button
                type="button"
                onClick={() => setSelectedProductId(null)}
                className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:bg-slate-50 dark:hover:bg-[#132A45] text-xs font-semibold text-[#0B1A2D] dark:text-slate-200 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                <span>Volver a la Tienda del Club</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Product Gallery */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-5">
                  <img
                    src={selectedProduct.imageUrl || playerPadelImg}
                    alt={selectedProduct.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = playerPadelImg;
                    }}
                    className="w-full h-80 sm:h-96 object-cover rounded-xl mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    className="min-h-[40px] min-w-[40px] absolute top-7 right-7 p-2.5 rounded-xl bg-white/95 dark:bg-[#0B1A2D]/95 text-slate-600 dark:text-slate-300 hover:text-[#8B5CF6] border border-slate-200/80 dark:border-[#1A314D] transition cursor-pointer flex items-center justify-center"
                    title="Favorito"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(selectedProduct.id) ? 'fill-[#8B5CF6] text-[#8B5CF6]' : ''}`} />
                  </button>
                  {selectedProduct.compareAtPrice && (
                    <div className="absolute top-7 left-7">
                      <span className="px-2.5 py-1 rounded-lg bg-[#8B5CF6] text-white font-bold text-[10px] uppercase">
                        Oferta Club
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details & Actions */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8B5CF6] dark:text-[#a78bfa] uppercase tracking-wider">
                    <span>{selectedProduct.brand}</span>
                    <span>·</span>
                    <span className="text-slate-500 dark:text-slate-400">{selectedProduct.category}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-white mt-1.5">
                    {selectedProduct.name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums">
                    {selectedProduct.price.toFixed(2)} €
                  </span>
                  {selectedProduct.compareAtPrice && (
                    <span className="text-base line-through text-slate-400 font-mono tabular-nums">
                      {selectedProduct.compareAtPrice.toFixed(2)} €
                    </span>
                  )}
                  <span className="text-xs font-semibold text-[#0B1A2D] dark:text-[#B7F229]">
                    · Stock disponible en club
                  </span>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {selectedProduct.category === 'palas' && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Peso Seleccionado
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['360g', '365g', '370g'].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setSelectedWeight(w)}
                            className={`min-h-[40px] py-2 px-3 rounded-xl text-xs font-mono tabular-nums font-bold border transition cursor-pointer ${
                              selectedWeight === w
                                ? 'bg-[#0B1A2D] dark:bg-[#B7F229] border-[#0B1A2D] dark:border-[#B7F229] text-white dark:text-[#0B1A2D]'
                                : 'bg-white dark:bg-[#0E2239] border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Grosor de Puño
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Grip 2 (Standard)', 'Grip 3 (Con Overgrip)'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setSelectedGrip(g)}
                            className={`min-h-[40px] py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                              selectedGrip === g
                                ? 'bg-[#0B1A2D] dark:bg-[#B7F229] border-[#0B1A2D] dark:border-[#B7F229] text-white dark:text-[#0B1A2D]'
                                : 'bg-white dark:bg-[#0E2239] border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => addToCart(selectedProduct)}
                    className="flex-1 min-h-[44px] py-3 px-6 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="font-mono tabular-nums">Añadir al Carrito ({selectedProduct.price.toFixed(2)} €)</span>
                  </button>

                  {selectedProduct.category === 'palas' && (
                    <button
                      type="button"
                      onClick={() => handleTestOnCourt(selectedProduct)}
                      className="min-h-[44px] py-3 px-5 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] hover:opacity-90 text-white font-semibold text-xs border border-[#1A314D] transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-[#B7F229]" />
                      <span>Probar en Pista</span>
                    </button>
                  )}
                </div>

                {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                  <div className="p-5 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-3 text-xs">
                    <div className="font-mono text-[#8B5CF6] dark:text-[#a78bfa] uppercase tracking-wider text-[11px]">
                      Especificaciones Técnicas
                    </div>
                    <dl className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-400">
                      {Object.entries(selectedProduct.specs).map(([key, val]) => (
                        <div key={key}>
                          <dt className="capitalize text-[10px] text-slate-400">{key}</dt>
                          <dd className="font-semibold text-[#0B1A2D] dark:text-slate-200">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                <div className="p-5 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-2.5 text-xs">
                  <div className="font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                    <span>Garantía Oficial {currentTenant.shortName}</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0" />
                      <span>Garantía oficial de 2 años en todas las palas de carbono.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0" />
                      <span>Cambio o devolución en 30 días naturales sin desprecintar.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0" />
                      <span>Recogida inmediata en recepción o envío a domicilio.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {relatedProducts.length > 0 && (
              <div className="pt-8 border-t border-slate-200/80 dark:border-[#1A314D] space-y-6">
                <h2 className="text-xl font-bold text-[#0B1A2D] dark:text-white">
                  Productos Relacionados
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {relatedProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProductId(p.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="cursor-pointer rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D] dark:hover:border-[#B7F229] p-4 transition flex flex-col justify-between group"
                    >
                      <div className="relative h-40 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-[#071220]">
                        <img
                          src={p.imageUrl || playerPadelImg}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = playerPadelImg;
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="text-[10px] font-mono text-[#8B5CF6] dark:text-[#a78bfa] uppercase">{p.brand}</div>
                        <h4 className="font-bold text-[#0B1A2D] dark:text-white truncate">{p.name}</h4>
                        <div className="font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-white">{p.price.toFixed(2)} €</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* 1. Header Hero */}
            <div className="rounded-2xl bg-[#0B1A2D] border border-[#1A314D] p-8 sm:p-12 text-white">
              <div className="max-w-2xl space-y-4">
                <div className="text-xs font-mono tracking-[0.14em] uppercase text-[#B7F229]">
                  Setmio Pro Shop · Test Center
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  Material Oficial de Competición
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Prueba tu pala en pista antes de comprar. Asesoramiento biomecánico por nuestros entrenadores titulados y entrega inmediata en recepción.
                </p>
                <div className="flex flex-wrap gap-6 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#B7F229]" />
                    <span>Test en pista gratuito (20 min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#B7F229]" />
                    <span>Recogida instantánea en club</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#B7F229]" />
                    <span>Garantía oficial y cambio 30 días</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Test Center Banner (workspace image asset, zero external URL) */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-[#1A314D] h-64 sm:h-72 bg-[#071220]">
              <img
                src={heroPadelImg}
                alt="Test Center de Palas en Pista"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A2D] via-[#0B1A2D]/75 to-transparent" />
              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center max-w-xl text-white space-y-3">
                <span className="text-xs font-mono text-[#B7F229] uppercase tracking-[0.14em]">
                  Test Center Oficial
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Prueba tu pala en pista antes de decidirte
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Solicita gratis cualquier pala de la nueva temporada en recepción de {currentTenant.shortName} y juega 20 minutos con ella en tu partido.
                </p>
              </div>
            </div>

            {/* 3. Categories */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Categorías del Catálogo
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.Icon;
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`min-h-[82px] p-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                        active
                          ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D] border-[#0B1A2D] dark:border-[#B7F229]'
                          : 'bg-white dark:bg-[#0E2239] border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-slate-200 hover:border-[#0B1A2D] dark:hover:border-[#B7F229]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-[#B7F229] dark:text-[#0B1A2D]' : 'text-[#8B5CF6] dark:text-[#a78bfa]'}`} />
                      <span className="text-xs font-semibold">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Offers */}
            {offersProducts.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                    <h2 className="text-xl font-bold text-[#0B1A2D] dark:text-white">
                      Selección en Oferta
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-[#8B5CF6] dark:text-[#a78bfa]">Hasta -35%</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {offersProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setSelectedProductId(product.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="cursor-pointer rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#8B5CF6] overflow-hidden transition flex flex-col justify-between group"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-[#071220]">
                        <img
                          src={product.imageUrl || playerPadelImg}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = playerPadelImg;
                          }}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#8B5CF6] text-white font-bold text-[10px] uppercase">
                            Oferta
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <div className="text-[10px] font-mono text-[#8B5CF6] dark:text-[#a78bfa] uppercase">{product.brand}</div>
                        <h4 className="font-bold text-sm text-[#0B1A2D] dark:text-white truncate">{product.name}</h4>
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono tabular-nums font-extrabold text-base text-[#0B1A2D] dark:text-[#B7F229]">
                            {product.price.toFixed(2)} €
                          </span>
                          <span className="font-mono tabular-nums text-xs line-through text-slate-400">
                            {product.compareAtPrice?.toFixed(2)} €
                          </span>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <span className="min-h-[38px] flex items-center justify-center w-full py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs group-hover:bg-[#B7F229] group-hover:text-[#0B1A2D] transition">
                          Ver Detalle
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Recommended */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                  <h2 className="text-xl font-bold text-[#0B1A2D] dark:text-white">
                    Recomendados del Club
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
                    className="cursor-pointer rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D] dark:hover:border-[#B7F229] overflow-hidden transition flex flex-col justify-between group"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-[#071220]">
                      <img
                        src={product.imageUrl || playerPadelImg}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = playerPadelImg;
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-md bg-[#B7F229] text-[#0B1A2D] font-bold text-[10px] uppercase">
                          Pro Pick
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <div className="text-[10px] font-mono text-[#8B5CF6] dark:text-[#a78bfa] uppercase">{product.brand}</div>
                      <h4 className="font-bold text-sm text-[#0B1A2D] dark:text-white truncate">{product.name}</h4>
                      <div className="font-mono tabular-nums font-extrabold text-base text-[#0B1A2D] dark:text-white">
                        {product.price.toFixed(2)} €
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <span className="min-h-[38px] flex items-center justify-center w-full py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs group-hover:bg-[#0B1A2D] group-hover:text-white dark:group-hover:bg-[#B7F229] dark:group-hover:text-[#0B1A2D] transition">
                        Ver Detalles
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Full Catalog */}
            <div className="space-y-6 pt-8 border-t border-slate-200/80 dark:border-[#1A314D]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-[#0B1A2D] dark:text-white">
                  Catálogo Completo (<span className="font-mono tabular-nums">{filteredProducts.length}</span>)
                </h2>
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar pala, zapatillas, bolas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full min-h-[40px] pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs focus:outline-none focus:border-[#8B5CF6] text-[#0B1A2D] dark:text-slate-100 placeholder-slate-400"
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
                    className="cursor-pointer rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D] dark:hover:border-[#B7F229] overflow-hidden transition flex flex-col justify-between group"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-[#071220]">
                      <img
                        src={product.imageUrl || playerPadelImg}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = playerPadelImg;
                        }}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className="min-h-[36px] min-w-[36px] absolute top-3 right-3 p-2 rounded-xl bg-white/95 dark:bg-[#0B1A2D]/95 text-slate-600 dark:text-slate-300 hover:text-[#8B5CF6] transition flex items-center justify-center cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-[#8B5CF6] text-[#8B5CF6]' : ''}`} />
                      </button>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <div className="text-[10px] font-mono text-[#8B5CF6] dark:text-[#a78bfa] uppercase">{product.brand}</div>
                      <h3 className="font-bold text-sm text-[#0B1A2D] dark:text-white truncate">{product.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono tabular-nums font-extrabold text-base text-[#0B1A2D] dark:text-white">
                          {product.price.toFixed(2)} €
                        </span>
                        {product.compareAtPrice && (
                          <span className="font-mono tabular-nums text-xs line-through text-slate-400">
                            {product.compareAtPrice.toFixed(2)} €
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="w-full min-h-[40px] py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] font-bold text-xs text-[#0B1A2D] transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Añadir al Carrito</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Purchase Policies */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#8B5CF6] dark:text-[#a78bfa]" />
                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Políticas de Compra y Condiciones de {currentTenant.name}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentTenant.settings.purchasePolicies ||
                  'Todos los productos adquiridos en Setmio Pro Shop cuentan con garantía oficial de fabricante de 2 años. Puedes recoger tu pedido en la recepción del club sin costes de envío o solicitar entrega peninsular en 24/48 horas.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 dark:border-[#1A314D] text-xs text-[#0B1A2D] dark:text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0" />
                  <span>Prueba en pista gratuita antes de comprar</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0" />
                  <span>Devolución garantizada 30 días</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0" />
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
