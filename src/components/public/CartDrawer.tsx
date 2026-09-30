import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, Check, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    couponCode,
    discountPercent,
    applyCoupon,
    triggerDemoToast,
    currentTenant,
  } = useApp();

  const [inputCoupon, setInputCoupon] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'shipping'>('pickup');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = fulfillmentType === 'shipping' && subtotal < 100 ? 5.95 : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon) return;
    applyCoupon(inputCoupon);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    setTimeout(() => {
      setIsCheckingOut(false);
      clearCart();
      onClose();
      triggerDemoToast(
        'Pedido Realizado (Modo Demostración)',
        `Pedido registrado para recogida en ${currentTenant.name}. En producción se cobraría mediante Stripe/Redsys y generaría albarán en Supabase.`,
        'success'
      );
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex flex-col shadow-2xl transition-colors duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Tu Cesta de Compra</h2>
              <span className="text-[11px] text-slate-500 font-medium">({cart.length} productos)</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Tu cesta está vacía</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Explora las palas, zapatillas y accesorios oficiales de {currentTenant.shortName}.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
                >
                  Seguir Comprando
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex gap-3 text-xs"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{product.name}</h4>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 tabular-nums">
                      {product.price.toFixed(2)} €
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-slate-900 dark:text-white text-xs">{quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-bold text-slate-900 dark:text-slate-200 font-mono tabular-nums">
                        {(product.price * quantity).toFixed(2)} €
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              {/* Delivery method toggle */}
              <div className="flex rounded-xl bg-slate-200 dark:bg-slate-900 p-1 border border-slate-300 dark:border-slate-800">
                <button
                  onClick={() => setFulfillmentType('pickup')}
                  className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition ${
                    fulfillmentType === 'pickup'
                      ? 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Recogida en Club (Gratis)
                </button>
                <button
                  onClick={() => setFulfillmentType('shipping')}
                  className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition ${
                    fulfillmentType === 'shipping'
                      ? 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Envío a Domicilio
                </button>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Cupón (ej: SANMATEO10)"
                    className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition"
                >
                  Aplicar
                </button>
              </form>

              {couponCode && (
                <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-900/60">
                  <span>Cupón {couponCode} ({discountPercent}%)</span>
                  <span>-{discountAmount.toFixed(2)} €</span>
                </div>
              )}

              {/* Totals Breakdown */}
              <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Subtotal:</span>
                  <span className="font-mono tabular-nums">{subtotal.toFixed(2)} €</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Descuento:</span>
                    <span className="font-mono tabular-nums">-{discountAmount.toFixed(2)} €</span>
                  </div>
                )}
                {fulfillmentType === 'shipping' && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Gastos de envío:</span>
                    <span className="font-mono tabular-nums">{shippingFee === 0 ? 'Gratis' : `${shippingFee.toFixed(2)} €`}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total estimado:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">{total.toFixed(2)} €</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                <span>{isCheckingOut ? 'Procesando en Demo...' : 'Finalizar Pedido Demo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Modo demostración. Ningún cargo real será aplicado.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
