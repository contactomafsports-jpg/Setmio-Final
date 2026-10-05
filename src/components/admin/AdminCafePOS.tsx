import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CafeProduct } from '../../types/database';
import {
  Coffee,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  User,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const AdminCafePOS: React.FC = () => {
  const { currentTenant, cafeProducts, recordCafeSale, triggerDemoToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [posCart, setPosCart] = useState<{ product: CafeProduct; qty: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'member_wallet'>('card');
  const [cashRegisterOpen, setCashRegisterOpen] = useState(true);
  const [sessionSalesTotal, setSessionSalesTotal] = useState(148.5);

  const categories = ['all', 'Bebidas', 'Café', 'Snacks', 'Bocadillos', 'Grip/Pelotas'];

  const filteredProducts = cafeProducts.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  const addItemToPOS = (p: CafeProduct) => {
    setPosCart((prev) => {
      const exists = prev.find((item) => item.product.id === p.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === p.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product: p, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setPosCart((prev) =>
      prev
        .map((item) => (item.product.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const cartTotal = posCart.reduce((acc, item) => acc + item.product.price * item.qty, 0);

  const handleChargeSale = () => {
    if (posCart.length === 0) return;

    posCart.forEach(({ product, qty }) => {
      recordCafeSale(product, qty);
    });

    setSessionSalesTotal((prev) => prev + cartTotal);
    triggerDemoToast(
      'Venta Cobrada en TPV',
      `Ticket emitido por ${cartTotal.toFixed(2)} € pagado con ${
        paymentMethod === 'card' ? 'Tarjeta' : paymentMethod === 'cash' ? 'Efectivo' : 'Saldo de Socio'
      }.`,
      'success'
    );
    setPosCart([]);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto">
      {/* Header & POS Shift Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Terminal TPV de Mostrador y Bar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
            Cobro rápido de consumiciones, bolas y overgrips independiente de la tienda online
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-right shadow-sm">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Total Turno Actual:
            </div>
            <div className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">
              {sessionSalesTotal.toFixed(2)} €
            </div>
          </div>

          <button
            onClick={() => {
              triggerDemoToast('Arqueo de Caja', `Arqueo completado: ${sessionSalesTotal.toFixed(2)}€ registrados en el turno.`, 'info');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-slate-700/80 transition active:scale-95"
          >
            Cierre / Arqueo
          </button>
        </div>
      </div>

      {/* POS Interface: Product Catalog + Fast Ticket Register */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Products Grid */}
        <div className="lg:col-span-7 space-y-4">
          {/* Categories bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeCategory === c
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                {c === 'all' ? 'Todos' : c}
              </button>
            ))}
          </div>

          {/* Touch item cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((prod) => (
              <button
                key={prod.id}
                onClick={() => addItemToPOS(prod)}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/50 text-left transition flex flex-col justify-between h-28 group shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {prod.category}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mt-0.5">
                    {prod.name}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                    {prod.price.toFixed(2)} €
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    Stock: {prod.stock}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Ticket / Register Cart */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0">
                Ticket de Venta en Curso
              </h2>
            </div>
            {posCart.length > 0 && (
              <button
                onClick={() => setPosCart([])}
                className="text-[11px] text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 font-bold transition"
              >
                Vaciar
              </button>
            )}
          </div>

          {/* Ticket Items */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {posCart.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                Selecciona artículos a la izquierda para añadir al ticket.
              </div>
            ) : (
              posCart.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-xs"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="font-bold text-slate-900 dark:text-white truncate">{product.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {product.price.toFixed(2)} € c/u
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
                      <button
                        onClick={() => updateQty(product.id, -1)}
                        className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold px-1.5 min-w-[20px] text-center text-slate-900 dark:text-white">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQty(product.id, 1)}
                        className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-slate-900 dark:text-white min-w-[50px] text-right">
                      {(product.price * qty).toFixed(2)} €
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Forma de Pago:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-1 rounded-xl font-bold border flex flex-col items-center gap-1 text-[11px] transition ${
                  paymentMethod === 'card'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                <span>Tarjeta</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 px-1 rounded-xl font-bold border flex flex-col items-center gap-1 text-[11px] transition ${
                  paymentMethod === 'cash'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                <Banknote className="w-3.5 h-3.5 text-emerald-500" />
                <span>Efectivo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('member_wallet')}
                className={`py-2 px-1 rounded-xl font-bold border flex flex-col items-center gap-1 text-[11px] transition ${
                  paymentMethod === 'member_wallet'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-500" />
                <span>Saldo Socio</span>
              </button>
            </div>
          </div>

          {/* Total & Charge CTA */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Total a Cobrar:</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {cartTotal.toFixed(2)} €
              </span>
            </div>

            <button
              onClick={handleChargeSale}
              disabled={posCart.length === 0}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cobrar & Emitir Ticket</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCafePOS;
