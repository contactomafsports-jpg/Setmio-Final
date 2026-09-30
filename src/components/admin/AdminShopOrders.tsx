import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Package, Plus, CheckCircle2, TrendingUp } from 'lucide-react';

export const AdminShopOrders: React.FC = () => {
  const { products, triggerDemoToast } = useApp();

  return (
    <div className="space-y-6 text-slate-100 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Catálogo de Tienda & Pedidos</h2>
          <p className="text-xs text-slate-400">Pádel San Mateo · Control de stock e inventario oficial</p>
        </div>

        <button
          onClick={() => triggerDemoToast('Añadir Producto', 'Asistente de nuevo producto abierto en modo demo.', 'info')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Producto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex gap-3 text-xs shadow-lg"
          >
            <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover rounded-2xl bg-slate-950 shrink-0" />
            <div className="min-w-0 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase">{p.brand}</span>
                <h4 className="font-bold text-white truncate text-xs">{p.name}</h4>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-mono font-bold text-emerald-400">{p.price.toFixed(2)} €</span>
                <span className="text-[10px] text-slate-400">Stock: <strong className="text-white">{p.stock}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
