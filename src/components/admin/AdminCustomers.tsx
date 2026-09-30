import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, Plus, UserPlus, CreditCard, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { currentTenant, triggerDemoToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'members' | 'casual'>('all');

  const customers = [
    { id: 'c-1', name: 'Carlos Méndez', email: 'carlos.mendez@galiciapadel.com', phone: '+34 611 22 33 44', memberNum: 'SM-408', level: 3.85, balance: 24.5, isMember: true, matches: 34 },
    { id: 'c-2', name: 'Diego Soto', email: 'diego.soto@email.es', phone: '+34 622 33 44 55', memberNum: 'SM-409', level: 3.9, balance: 12.0, isMember: true, matches: 28 },
    { id: 'c-3', name: 'Ana Belén Vázquez', email: 'anabelen.vazquez@email.es', phone: '+34 633 44 55 66', memberNum: 'SM-412', level: 3.2, balance: 45.0, isMember: true, matches: 19 },
    { id: 'c-4', name: 'Javier Fraga', email: 'javi.fraga@email.es', phone: '+34 644 55 66 77', memberNum: '-', level: 4.1, balance: 0.0, isMember: false, matches: 8 },
    { id: 'c-5', name: 'Elena Permuy', email: 'elena.permuy@email.es', phone: '+34 655 66 77 88', memberNum: 'SM-390', level: 2.75, balance: 60.0, isMember: true, matches: 42 },
    { id: 'c-6', name: 'Rubén Loureiro', email: 'ruben.loureiro@email.es', phone: '+34 666 77 88 99', memberNum: '-', level: 4.5, balance: 5.0, isMember: false, matches: 15 },
  ];

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchType =
      filterType === 'all' ||
      (filterType === 'members' && c.isMember) ||
      (filterType === 'casual' && !c.isMember);
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 text-slate-100 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Directorio de Socios y Clientes</h2>
          <p className="text-xs text-slate-400">Pádel San Mateo · Saldos de monedero y nivel de juego</p>
        </div>

        <button
          onClick={() => triggerDemoToast('Alta de Socio', 'Formulario de registro presencial abierto en modo demo.', 'info')}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Jugador</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({customers.length})
          </button>
          <button
            onClick={() => setFilterType('members')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'members' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Socios con Cuota
          </button>
          <button
            onClick={() => setFilterType('casual')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'casual' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Jugadores Esporádicos
          </button>
        </div>
      </div>

      {/* Customers table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Jugador</th>
                <th className="py-3 px-4">Socio #</th>
                <th className="py-3 px-4">Nivel FEP</th>
                <th className="py-3 px-4">Saldo Monedero</th>
                <th className="py-3 px-4">Partidos</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white text-xs">{c.name}</div>
                    <div className="text-[11px] text-slate-400">{c.email} · {c.phone}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {c.isMember ? (
                      <span className="text-emerald-400 font-bold">{c.memberNum}</span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400 text-xs">
                    {c.level.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white text-xs">
                    {c.balance.toFixed(2)} €
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-xs">{c.matches} partidos</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => triggerDemoToast('Recarga de Saldo', `Añadidos 20€ al monedero de ${c.name}.`, 'success')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-semibold border border-slate-700"
                    >
                      + Recargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
