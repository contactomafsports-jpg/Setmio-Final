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
    setPosCart([]);
    triggerDemoToast(
      'Venta Cobrada en TPV',
      `Ticket emitido por ${cartTotal.toFixed(2)}€ (${paymentMethod === 'cash' ? 'Efectivo' : paymentMethod === 'card' ? 'Datáfono' : 'Saldo Socio'}). Impresora térmica lista en modo demo.`,
      'success'
    );
  };

  return (
    <div className="space-y-8 text-slate-100 max-w-6xl">
      {/* Header & POS Shift Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5" />
            <span>Cafetería & Punto de Venta (TPV Presencial)</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Terminal TPV de Mostrador y Bar
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cobro rápido de consumiciones, bolas y overgrips independiente de la tienda online.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-right">
            <div className="text-[10px] text-slate-400">Total Turno Actual:</div>
            <div className="text-sm font-mono font-bold text-emerald-400">
              {sessionSalesTotal.toFixed(2)} €
            </div>
          </div>

          <button
            onClick={() => {
              triggerDemoToast('Arqueo de Caja', `Arqueo completado: ${sessionSalesTotal.toFixed(2)}€ registrados en el turno.`, 'info');
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
          >
            Cierre / Arqueo
          </button>
        </div>
      </div>

      {/* POS Interface: Product Catalog + Fast Ticket Register */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Products Grid */}
        <div className="lg:col-span-7 space-y-4">
          {/* Categories bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === c
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
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
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition flex flex-col justify-between h-28 group shadow hover:scale-[1.01]"
              >
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">{prod.category}</div>
                  <div className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-2 mt-0.5">
                    {prod.name}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                  <span className="font-mono font-bold text-emerald-400">{prod.price.toFixed(2)} €</span>
                  <span className="text-[10px] text-slate-500">Stock: {prod.stock}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Ticket / Register Cart */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-bold text-white">Ticket de Venta en Curso</h3>
            </div>
            {posCart.length > 0 && (
              <button
                onClick={() => setPosCart([])}
                className="text-[11px] text-slate-500 hover:text-rose-400 transition"
              >
                Vaciar
              </button>
            )}
          </div>

          {/* Ticket Items */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {posCart.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Selecciona artículos a la izquierda para añadir al ticket.
              </div>
            ) : (
              posCart.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white truncate">{product.name}</div>
                    <div className="text-[10px] text-slate-500">{product.price.toFixed(2)} € c/u</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                      <button
                        onClick={() => updateQty(product.id, -1)}
                        className="p-1 hover:text-white text-slate-400"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-bold text-white text-[11px]">{qty}</span>
                      <button
                        onClick={() => updateQty(product.id, 1)}
                        className="p-1 hover:text-white text-slate-400"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="w-14 text-right font-mono font-bold text-white">
                      {(product.price * qty).toFixed(2)} €
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Método de Cobro:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-1 rounded-xl font-semibold border flex flex-col items-center gap-1 text-[11px] transition ${
                  paymentMethod === 'card'
                    ? 'bg-rose-600/20 text-rose-300 border-rose-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Tarjeta</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 px-1 rounded-xl font-semibold border flex flex-col items-center gap-1 text-[11px] transition ${
                  paymentMethod === 'cash'
                    ? 'bg-rose-600/20 text-rose-300 border-rose-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Efectivo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('member_wallet')}
                className={`py-2 px-1 rounded-xl font-semibold border flex flex-col items-center gap-1 text-[11px] transition ${
                  paymentMethod === 'member_wallet'
                    ? 'bg-rose-600/20 text-rose-300 border-rose-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Saldo Socio</span>
              </button>
            </div>
          </div>

          {/* Total & Charge CTA */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Total a Cobrar:</span>
              <span className="text-2xl font-black text-white font-mono">{cartTotal.toFixed(2)} €</span>
            </div>

            <button
              onClick={handleChargeSale}
              disabled={posCart.length === 0}
              className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-40 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-2"
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
