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
  Check,
} from 'lucide-react';
import { AdminMemberProfile, AdminMemberData } from './AdminMemberProfile';

export interface CustomerItem {
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
  status?: string;
}

const INITIAL_CUSTOMERS: CustomerItem[] = [
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
    status: 'Activo (Al día)',
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
    status: 'Activo (Al día)',
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
    status: 'Activo (Al día)',
  },
  {
    id: 'c-4',
    name: 'Javier Fraga',
    email: 'javi.fraga@email.es',
    phone: '+34 644 55 66 77',
    memberNum: 'Casual',
    level: 4.1,
    balance: 0.0,
    isMember: false,
    matches: 8,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    hand: 'Diestro',
    position: 'Ambas',
    status: 'Esporádico',
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
    status: 'Activo (Al día)',
  },
  {
    id: 'c-6',
    name: 'Rubén Loureiro',
    email: 'ruben.loureiro@email.es',
    phone: '+34 666 77 88 99',
    memberNum: 'Casual',
    level: 4.5,
    balance: 5.0,
    isMember: false,
    matches: 15,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    hand: 'Diestro',
    position: 'Revés',
    status: 'Esporádico',
  },
];

export const AdminCustomers: React.FC = () => {
  const {
    currentTenant,
    triggerDemoToast,
    selectedCustomerId,
    setSelectedCustomerId,
    playerOriginTab,
    setPlayerOriginTab,
    setAdminTab,
  } = useApp();

  const [customerList, setCustomerList] = useState<CustomerItem[]>(() => {
    try {
      const saved = localStorage.getItem('setmio_demo_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'members' | 'casual'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [publicProfileModalCustomer, setPublicProfileModalCustomer] = useState<CustomerItem | null>(null);

  React.useEffect(() => {
    const handleUrlPlayer = () => {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      // Si la URL es la lista general (/socios, /crm, /gestion/jugadores, /jugadores sin slug), forzar lista general
      if (
        pathname === '/socios' ||
        pathname === '/crm' ||
        pathname === '/admin/socios' ||
        pathname === '/admin/crm' ||
        pathname === '/gestion/socios' ||
        pathname === '/gestion/crm' ||
        pathname === '/gestion/jugadores' ||
        pathname === '/jugadores'
      ) {
        setSelectedCustomer(null);
        setSelectedCustomerId(null);
        return;
      }

      if (pathname.startsWith('/jugadores/') || pathname.startsWith('/gestion/jugadores/')) {
        const slug = pathname.replace('/gestion/jugadores/', '').replace('/jugadores/', '').toLowerCase().trim();
        if (slug) {
          const found = customerList.find(
            (c) =>
              c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-') === slug ||
              c.id.toLowerCase() === slug ||
              c.name.toLowerCase().includes(slug.replace(/-/g, ' '))
          );
          if (found) {
            setSelectedCustomer(found);
            return;
          }
        }
      }

      if (!selectedCustomerId) {
        setSelectedCustomer(null);
        return;
      }

      if (selectedCustomerId) {
        const slug = selectedCustomerId.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
        const found = customerList.find(
          (c) =>
            c.id.toLowerCase() === selectedCustomerId.toLowerCase() ||
            c.name.toLowerCase() === selectedCustomerId.toLowerCase() ||
            c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-') === slug ||
            c.name.toLowerCase().includes(selectedCustomerId.toLowerCase())
        );
        if (found) {
          setSelectedCustomer(found);
        } else {
          setSelectedCustomer(null);
        }
      }
    };

    handleUrlPlayer();
    window.addEventListener('popstate', handleUrlPlayer);
    return () => window.removeEventListener('popstate', handleUrlPlayer);
  }, [customerList, selectedCustomerId, setSelectedCustomerId]);

  const handleSelectCustomer = (customer: CustomerItem) => {
    setSelectedCustomer(customer);
    setSelectedCustomerId(customer.id);
    const slug = customer.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/gestion/jugadores/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // New Player Registration Modal State (Bug Fix Requerimiento 7)
  const [isNewPlayerModalOpen, setIsNewPlayerModalOpen] = useState(false);
  const [newPlayerForm, setNewPlayerForm] = useState({
    name: '',
    email: '',
    phone: '',
    level: 3.5,
    isMember: true,
    memberNum: `SM-${415 + customerList.length}`,
    position: 'Revés' as 'Drive' | 'Revés' | 'Ambas',
    hand: 'Diestro' as 'Diestro' | 'Zurdo',
    initialBalance: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateNewPlayer = () => {
    const errs: Record<string, string> = {};
    if (!newPlayerForm.name.trim()) errs.name = 'El nombre y apellidos son obligatorios.';
    if (!newPlayerForm.email.trim()) {
      errs.email = 'El email es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(newPlayerForm.email)) {
      errs.email = 'Introduce un email válido (ej: usuario@email.com).';
    }
    if (!newPlayerForm.phone.trim()) {
      errs.phone = 'El teléfono es obligatorio.';
    } else if (newPlayerForm.phone.replace(/[^\d]/g, '').length < 8) {
      errs.phone = 'El teléfono debe contener al menos 8 dígitos.';
    }
    if (newPlayerForm.level < 1.0 || newPlayerForm.level > 7.0) {
      errs.level = 'El nivel debe estar comprendido entre 1.00 y 7.00.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateNewPlayer()) return;

    const newPlayer: CustomerItem = {
      id: `c-${Date.now()}`,
      name: newPlayerForm.name.trim(),
      email: newPlayerForm.email.trim().toLowerCase(),
      phone: newPlayerForm.phone.trim(),
      memberNum: newPlayerForm.isMember ? (newPlayerForm.memberNum || `SM-${420 + customerList.length}`) : 'Casual',
      level: Number(newPlayerForm.level),
      balance: Number(newPlayerForm.initialBalance) || 0,
      isMember: newPlayerForm.isMember,
      matches: 0,
      avatarUrl: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 10000000)}?auto=format&fit=crop&w=200&q=80`,
      hand: newPlayerForm.hand,
      position: newPlayerForm.position,
      status: newPlayerForm.isMember ? 'Activo (Al día)' : 'Esporádico',
    };

    const updated = [newPlayer, ...customerList];
    setCustomerList(updated);
    try {
      localStorage.setItem('setmio_demo_customers', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    setIsNewPlayerModalOpen(false);
    setNewPlayerForm({
      name: '',
      email: '',
      phone: '',
      level: 3.5,
      isMember: true,
      memberNum: `SM-${416 + updated.length}`,
      position: 'Revés',
      hand: 'Diestro',
      initialBalance: 0,
    });
    setErrors({});

    triggerDemoToast(
      'Jugador Registrado',
      `Ficha creada para ${newPlayer.name} con nivel ${newPlayer.level.toFixed(2)}.`,
      'success'
    );
  };

  const filtered = customerList.filter((c) => {
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

  if (selectedCustomer) {
    return (
      <AdminMemberProfile
        member={selectedCustomer}
        onBack={() => {
          setSelectedCustomer(null);
          setSelectedCustomerId(null);
          if (playerOriginTab) {
            const origin = playerOriginTab;
            setPlayerOriginTab(null);
            setAdminTab(origin);
            if (typeof window !== 'undefined') {
              const originRoute = origin === 'agenda' ? '/gestion/reservas' : '/gestion';
              window.history.pushState({}, '', originRoute);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
          }
          if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/gestion/jugadores');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Socios & CRM de Jugadores
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Base de datos oficial de {currentTenant.name} · Fichas, monederos, niveles y estadísticas.
          </p>
        </div>

        {/* CORRECCIÓN DE BUG REQUERIMIENTO 7: Abre el modal correspondiente */}
        <button
          type="button"
          onClick={() => {
            setErrors({});
            setIsNewPlayerModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition self-start sm:self-auto active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Nuevo Jugador</span>
        </button>
      </div>

      {/* Filter and search bar with canonical styling */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Todos ({customerList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('members')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'members'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Socios con Cuota ({customerList.filter((c) => c.isMember).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('casual')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'casual'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Esporádicos ({customerList.filter((c) => !c.isMember).length})
          </button>
        </div>
      </div>

      {/* Customers table */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Jugador</th>
                <th className="py-3 px-4">Nivel Oficial</th>
                <th className="py-3 px-4">Posición / Mano</th>
                <th className="py-3 px-4">Estado Socio</th>
                <th className="py-3 px-4">Saldo Monedero</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={customer.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'}
                        alt={customer.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <div
                          onClick={() => handleSelectCustomer(customer)}
                          className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                        >
                          {customer.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {customer.email} · {customer.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      Nivel {customer.level.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {customer.position || 'Revés'} · {customer.hand || 'Diestro'}
                  </td>
                  <td className="py-3 px-4">
                    {customer.isMember ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Socio #{customer.memberNum}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Esporádico</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {customer.balance.toFixed(2)} €
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSelectCustomer(customer)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-emerald-500 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition"
                    >
                      Ver Ficha CRM
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NUEVO JUGADOR CON FORMULARIO Y VALIDACIONES (Requerimiento 7) */}
      {isNewPlayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Alta de Nuevo Jugador
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPlayerModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlayer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre y Apellidos *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Marcos Regueiro"
                  value={newPlayerForm.name}
                  onChange={(e) => setNewPlayerForm({ ...newPlayerForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                {errors.name && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.name}</span>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="marcos@email.com"
                    value={newPlayerForm.email}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  {errors.email && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.email}</span>}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="text"
                    placeholder="+34 600 11 22 33"
                    value={newPlayerForm.phone}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  {errors.phone && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.phone}</span>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nivel FEP (1.0 - 7.0)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="7.0"
                    value={newPlayerForm.level}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, level: parseFloat(e.target.value) || 3.5 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  {errors.level && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.level}</span>}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Posición
                  </label>
                  <select
                    value={newPlayerForm.position}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, position: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Revés">Revés</option>
                    <option value="Drive">Drive</option>
                    <option value="Ambas">Ambas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mano
                  </label>
                  <select
                    value={newPlayerForm.hand}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, hand: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Diestro">Diestro</option>
                    <option value="Zurdo">Zurdo</option>
                  </select>
                </div>
              </div>

              {/* Condición de Socio */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={newPlayerForm.isMember}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, isMember: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Es socio del club con cuota mensual</span>
                </label>

                {newPlayerForm.isMember && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Número de Socio
                      </label>
                      <input
                        type="text"
                        value={newPlayerForm.memberNum}
                        onChange={(e) => setNewPlayerForm({ ...newPlayerForm, memberNum: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Saldo Inicial de Monedero (€)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="5"
                        value={newPlayerForm.initialBalance}
                        onChange={(e) => setNewPlayerForm({ ...newPlayerForm, initialBalance: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewPlayerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Crear Ficha de Jugador</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
