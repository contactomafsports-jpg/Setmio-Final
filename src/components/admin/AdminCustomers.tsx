import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Plus,
  UserPlus,
  CreditCard,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  X,
  ExternalLink,
  Shield,
  Activity,
  Calendar,
  MessageCircle,
} from 'lucide-react';

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberNum: string;
  level: number;
  balance: number;
  isMember: boolean;
  matches: number;
  avatarUrl?: string;
  hand?: string;
  position?: string;
}

export const AdminCustomers: React.FC = () => {
  const { currentTenant, triggerDemoToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'members' | 'casual'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [publicProfileModalCustomer, setPublicProfileModalCustomer] = useState<CustomerItem | null>(null);

  const customers: CustomerItem[] = [
    {
      id: 'c-1',
      name: 'Carlos Méndez',
      email: 'carlos.mendez@galiciapadel.com',
      phone: '+34 611 22 33 44',
      memberNum: 'SM-408',
      level: 3.85,
      balance: 24.5,
      isMember: true,
      matches: 34,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      hand: 'Diestro',
      position: 'Revés',
    },
    {
      id: 'c-2',
      name: 'Diego Soto',
      email: 'diego.soto@email.es',
      phone: '+34 622 33 44 55',
      memberNum: 'SM-409',
      level: 3.9,
      balance: 12.0,
      isMember: true,
      matches: 28,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      hand: 'Zurdo',
      position: 'Drive',
    },
    {
      id: 'c-3',
      name: 'Ana Belén Vázquez',
      email: 'anabelen.vazquez@email.es',
      phone: '+34 633 44 55 66',
      memberNum: 'SM-412',
      level: 3.2,
      balance: 45.0,
      isMember: true,
      matches: 19,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      hand: 'Diestro',
      position: 'Drive',
    },
    {
      id: 'c-4',
      name: 'Javier Fraga',
      email: 'javi.fraga@email.es',
      phone: '+34 644 55 66 77',
      memberNum: '-',
      level: 4.1,
      balance: 0.0,
      isMember: false,
      matches: 8,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      hand: 'Diestro',
      position: 'Ambas',
    },
    {
      id: 'c-5',
      name: 'Elena Permuy',
      email: 'elena.permuy@email.es',
      phone: '+34 655 66 77 88',
      memberNum: 'SM-390',
      level: 2.75,
      balance: 60.0,
      isMember: true,
      matches: 42,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      hand: 'Zurdo',
      position: 'Drive',
    },
    {
      id: 'c-6',
      name: 'Rubén Loureiro',
      email: 'ruben.loureiro@email.es',
      phone: '+34 666 77 88 99',
      memberNum: '-',
      level: 4.5,
      balance: 5.0,
      isMember: false,
      matches: 15,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      hand: 'Diestro',
      position: 'Revés',
    },
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
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Directorio de Socios y Clientes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentTenant.name} · Haz clic en cualquier jugador para abrir su ficha completa y perfil público
          </p>
        </div>

        <button
          onClick={() => triggerDemoToast('Alta de Socio', 'Formulario de registro presencial abierto en modo demo.', 'info')}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Jugador</span>
        </button>
      </div>

      {/* Filter and search bar with proper light/dark contrast */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Todos ({customers.length})
          </button>
          <button
            onClick={() => setFilterType('members')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'members'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Socios con Cuota
          </button>
          <button
            onClick={() => setFilterType('casual')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'casual'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Jugadores Esporádicos
          </button>
        </div>
      </div>

      {/* Customers table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Jugador</th>
                <th className="py-3 px-4">Socio #</th>
                <th className="py-3 px-4">Nivel</th>
                <th className="py-3 px-4">Saldo Monedero</th>
                <th className="py-3 px-4">Partidos</th>
                <th className="py-3 px-4 text-right">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={c.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{c.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    {c.isMember ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30">
                        {c.memberNum}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    {c.level.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white text-xs">
                    {c.balance.toFixed(2)} €
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                    {c.matches} jugados
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(c);
                      }}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
                    >
                      Ver Ficha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. CUSTOMER DETAIL MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={selectedCustomer.avatarUrl}
                alt={selectedCustomer.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedCustomer.name}
                  </h3>
                  {selectedCustomer.isMember && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase">
                      Socio {selectedCustomer.memberNum}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Registrado en {currentTenant.name} · {selectedCustomer.phone}
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs">
              <div>
                <div className="text-slate-400 text-[10px]">Nivel Deportivo</div>
                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base mt-0.5">
                  {selectedCustomer.level.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">Saldo Monedero</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white text-base mt-0.5">
                  {selectedCustomer.balance.toFixed(2)} €
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">Partidos Jugados</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white text-base mt-0.5">
                  {selectedCustomer.matches}
                </div>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Datos Técnicos del Jugador
              </h4>
              <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-400">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400">Mano Dominante:</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedCustomer.hand || 'Diestro'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400">Posición en Pista:</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedCustomer.position || 'Revés'}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    triggerDemoToast('Recarga Aplicada', `Se han añadido 20.00€ al monedero de ${selectedCustomer.name}.`, 'success');
                    setSelectedCustomer((prev) => prev ? { ...prev, balance: prev.balance + 20 } : null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-slate-800 dark:text-slate-200 transition flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <span>+20€ Recargar Saldo</span>
                </button>

                <button
                  onClick={() => {
                    const cleanPhone = selectedCustomer.phone.replace(/[^\d+]/g, '').replace('+', '');
                    window.open(`https://wa.me/${cleanPhone}`, '_blank');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>

              {/* Requirement: Link/Button to Public Profile */}
              <button
                onClick={() => {
                  setPublicProfileModalCustomer(selectedCustomer);
                  setSelectedCustomer(null);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver Perfil Público del Jugador</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PUBLIC PROFILE MODAL VIEW */}
      {publicProfileModalCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100">
            <button
              onClick={() => setPublicProfileModalCustomer(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 pt-2">
              <img
                src={publicProfileModalCustomer.avatarUrl}
                alt={publicProfileModalCustomer.name}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-emerald-500 mx-auto shadow-xl"
              />
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {publicProfileModalCustomer.name}
                </h3>
                <p className="text-xs text-slate-500">{currentTenant.name} · Ficha Deportiva Pública</p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs">
                <span>Nivel {publicProfileModalCustomer.level.toFixed(2)}</span>
                <span>·</span>
                <span>{publicProfileModalCustomer.hand || 'Diestro'} / {publicProfileModalCustomer.position || 'Revés'}</span>
              </div>
            </div>

            <div className="my-6 grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs">
              <div>
                <div className="text-slate-400 text-[10px]">Partidos</div>
                <div className="font-bold text-slate-900 dark:text-white text-base font-mono">
                  {publicProfileModalCustomer.matches}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">Victorias</div>
                <div className="font-bold text-emerald-600 text-base font-mono">64%</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">Posición Club</div>
                <div className="font-bold text-slate-900 dark:text-white text-base font-mono">#14</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <div className="text-slate-400 text-[10px]">Inscrito en Equipos:</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Pádel San Mateo - Absoluto Masculino A
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                1ª Categoría Gallega · División de Honor
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setPublicProfileModalCustomer(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Cerrar Perfil Público
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
