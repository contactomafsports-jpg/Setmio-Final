import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import playerPadelImg from '../../assets/images/player_padel_action_1794872242959.jpg';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, ShieldCheck } from 'lucide-react';

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
        `Pedido registrado para recogida en ${currentTenant.name}.`,
        'success'
      );
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#071220]/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#0E2239] border-l border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-slate-100 flex flex-col transition-colors duration-200">
          {/* Header */}
          <div className="p-5 bg-slate-50 dark:bg-[#071220] border-b border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8B5CF6] dark:text-[#a78bfa]" />
              <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white tracking-tight">Tu Cesta de Compra</h2>
              <span className="text-[11px] font-mono tabular-nums text-slate-500">({cart.length})</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-[#1A314D] mb-3" />
                <p className="text-sm font-semibold text-[#0B1A2D] dark:text-slate-200">Tu cesta está vacía</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Explora las palas, zapatillas y accesorios oficiales de {currentTenant.shortName}.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 min-h-[40px] px-4 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-xs font-bold text-[#0B1A2D] transition cursor-pointer"
                >
                  Seguir Comprando
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] flex gap-3 text-xs"
                >
                  <img
                    src={product.imageUrl || playerPadelImg}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = playerPadelImg;
                    }}
                    className="w-16 h-16 object-cover rounded-xl bg-slate-200 dark:bg-[#0E2239] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-semibold text-[#0B1A2D] dark:text-slate-100 truncate">{product.name}</h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-slate-400 hover:text-[#8B5CF6] p-1 transition cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-[#8B5CF6] dark:text-[#a78bfa] font-mono mt-0.5 tabular-nums font-semibold">
                      {product.price.toFixed(2)} €
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-1.5 bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white rounded cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-white text-xs">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white rounded cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-bold text-[#0B1A2D] dark:text-slate-200 font-mono tabular-nums">
                        {(product.price * quantity).toFixed(2)} €
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-slate-50 dark:bg-[#071220] border-t border-slate-200/80 dark:border-[#1A314D] space-y-3.5 text-xs">
              <div className="flex rounded-xl bg-slate-200/70 dark:bg-[#0E2239] p-1 border border-slate-200/80 dark:border-[#1A314D]">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`flex-1 min-h-[36px] py-1.5 text-center text-xs font-semibold rounded-lg transition cursor-pointer ${
                    fulfillmentType === 'pickup'
                      ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-slate-200'
                  }`}
                >
                  Recogida en Club (Gratis)
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillmentType('shipping')}
                  className={`flex-1 min-h-[36px] py-1.5 text-center text-xs font-semibold rounded-lg transition cursor-pointer ${
                    fulfillmentType === 'shipping'
                      ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-slate-200'
                  }`}
                >
                  Envío a Domicilio
                </button>
              </div>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Cupón (ej: SANMATEO10)"
                    className="w-full min-h-[38px] pl-8 pr-3 py-1.5 bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#8B5CF6] uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D] text-[#0B1A2D] dark:text-slate-200 font-semibold text-xs transition cursor-pointer"
                >
                  Aplicar
                </button>
              </form>

              {couponCode && (
                <div className="flex items-center justify-between text-[11px] text-[#0B1A2D] dark:text-[#B7F229] font-mono tabular-nums font-semibold px-3 py-1.5 rounded-lg bg-[#B7F229]/20 border border-[#B7F229]/40">
                  <span>Cupón {couponCode} ({discountPercent}%)</span>
                  <span>-{discountAmount.toFixed(2)} €</span>
                </div>
              )}

              <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                  <span className="font-mono tabular-nums">{subtotal.toFixed(2)} €</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#8B5CF6] dark:text-[#a78bfa]">
                    <span>Descuento</span>
                    <span className="font-mono tabular-nums">-{discountAmount.toFixed(2)} €</span>
                  </div>
                )}
                {fulfillmentType === 'shipping' && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Gastos de envío</span>
                    <span className="font-mono tabular-nums">{shippingFee === 0 ? 'Gratis' : `${shippingFee.toFixed(2)} €`}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-[#0B1A2D] dark:text-white pt-2 border-t border-slate-200/80 dark:border-[#1A314D]">
                  <span>Total estimado</span>
                  <span className="text-[#0B1A2D] dark:text-[#B7F229] font-mono tabular-nums">{total.toFixed(2)} €</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full min-h-[44px] py-3 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>{isCheckingOut ? 'Procesando Pedido...' : 'Finalizar Pedido'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#a78bfa]" />
                <span>Modo demostración. Ningún cargo real será aplicado.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
