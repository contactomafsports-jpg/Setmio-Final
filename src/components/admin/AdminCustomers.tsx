import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlayerGroup, PlayerGroupConvocatoria } from '../../types/database';
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
  Send,
  Bell,
  Sparkles,
  Filter,
  Trash2,
  Edit3,
  ArrowRight,
  Share2,
  Layers,
  Megaphone,
  AlertCircle,
  Lock,
  Crown,
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
  {
    id: 'c-7',
    name: 'Mateo Varela',
    email: 'mateo.varela@padelsanmateo.es',
    phone: '+34 600 11 22 33',
    memberNum: 'SM-055',
    level: 4.15,
    balance: 35.0,
    isMember: true,
    matches: 52,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    hand: 'Diestro',
    position: 'Revés',
    status: 'Activo (Socio)',
  },
  {
    id: 'c-8',
    name: 'Lucas Piñeiro',
    email: 'lucas.pineiro@email.es',
    phone: '+34 677 88 99 00',
    memberNum: 'Casual',
    level: 3.85,
    balance: 15.0,
    isMember: false,
    matches: 22,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    hand: 'Diestro',
    position: 'Drive',
    status: 'Esporádico',
  },
  {
    id: 'c-9',
    name: 'David Castro',
    email: 'david.castro@email.es',
    phone: '+34 688 99 00 11',
    memberNum: 'SM-420',
    level: 4.10,
    balance: 40.0,
    isMember: true,
    matches: 31,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    hand: 'Diestro',
    position: 'Revés',
    status: 'Activo (Al día)',
  },
  {
    id: 'c-10',
    name: 'Pablo Vello',
    email: 'pablo.vello@email.es',
    phone: '+34 699 00 11 22',
    memberNum: 'SM-019',
    level: 4.80,
    balance: 55.0,
    isMember: true,
    matches: 64,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    hand: 'Zurdo',
    position: 'Drive',
    status: 'Activo (Al día)',
  },
  {
    id: 'c-11',
    name: 'Laura Senra',
    email: 'laura.senra@padelsanmateo.es',
    phone: '+34 655 44 33 22',
    memberNum: 'SM-PRO',
    level: 5.00,
    balance: 80.0,
    isMember: true,
    matches: 90,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    hand: 'Diestro',
    position: 'Revés',
    status: 'Socia Pro',
  },
  {
    id: 'c-12',
    name: 'Rosa Carballo',
    email: 'rosa.carballo@email.es',
    phone: '+34 611 99 88 77',
    memberNum: 'SM-042',
    level: 3.90,
    balance: 22.0,
    isMember: true,
    matches: 27,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    hand: 'Diestro',
    position: 'Drive',
    status: 'Activo (Al día)',
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
    playerGroups,
    createPlayerGroup,
    updatePlayerGroup,
    deletePlayerGroup,
    groupConvocatorias,
    sendGroupConvocatoria,
    t,
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

  // Subtab: Socios CRM vs Grupos / Listas de Distribución (Sustituto de WhatsApp)
  const [crmSubTab, setCrmSubTab] = useState<'members' | 'groups'>('members');
  const [groupSearch, setGroupSearch] = useState('');
  const [groupCategoryFilter, setGroupCategoryFilter] = useState<'all' | 'level' | 'academy' | 'venue' | 'social'>('all');
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isConvocatoriaModalOpen, setIsConvocatoriaModalOpen] = useState(false);
  const [isGroupMembersModalOpen, setIsGroupMembersModalOpen] = useState(false);
  const [selectedGroupForAction, setSelectedGroupForAction] = useState<PlayerGroup | null>(null);
  const [forcePreviewGroups, setForcePreviewGroups] = useState(false);

  // New Group Form state
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState<'level' | 'academy' | 'venue' | 'social'>('level');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupMinLevel, setNewGroupMinLevel] = useState('3.50');
  const [newGroupMaxLevel, setNewGroupMaxLevel] = useState('4.00');
  const [selectedPlayerNamesForGroup, setSelectedPlayerNamesForGroup] = useState<string[]>([]);

  // Convocatoria Form state
  const [convocatoriaSubject, setConvocatoriaSubject] = useState('');
  const [convocatoriaMessage, setConvocatoriaMessage] = useState('');
  const [convocatoriaType, setConvocatoriaType] = useState<'match' | 'class' | 'general'>('match');
  const [convocatoriaUrl, setConvocatoriaUrl] = useState('https://setmio.com/partidas');
  const [convocatoriaChannels, setConvocatoriaChannels] = useState<('push' | 'email' | 'whatsapp')[]>(['push', 'email', 'whatsapp']);

  React.useEffect(() => {
    const handleUrlPlayer = () => {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      
      // Chequear si es ruta directa al módulo de grupos (/admin/socios/grupos, etc.)
      if (
        pathname === '/admin/socios/grupos' ||
        pathname === '/admin/grupos' ||
        pathname === '/gestion/socios/grupos' ||
        pathname === '/gestion/jugadores/grupos' ||
        pathname.endsWith('/grupos')
      ) {
        setCrmSubTab('groups');
        setSelectedCustomer(null);
        setSelectedCustomerId(null);
        return;
      }

      // Si la URL es la lista general (/socios, /crm, /gestion/jugadores, /admin/socios sin id), forzar lista general
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

      // Check all individual profile paths: /admin/socios/:id, /gestion/socios/:id, /gestion/jugadores/:id, /jugadores/:id
      let targetSlug = '';
      if (pathname.includes('/admin/socios/')) {
        targetSlug = pathname.split('/admin/socios/')[1]?.toLowerCase().trim() || '';
      } else if (pathname.includes('/gestion/socios/')) {
        targetSlug = pathname.split('/gestion/socios/')[1]?.toLowerCase().trim() || '';
      } else if (pathname.includes('/socios/')) {
        targetSlug = pathname.split('/socios/')[1]?.toLowerCase().trim() || '';
      } else if (pathname.includes('/gestion/jugadores/')) {
        targetSlug = pathname.split('/gestion/jugadores/')[1]?.toLowerCase().trim() || '';
      } else if (pathname.includes('/jugadores/')) {
        targetSlug = pathname.split('/jugadores/')[1]?.toLowerCase().trim() || '';
      }

      if (targetSlug === 'grupos') {
        setCrmSubTab('groups');
        setSelectedCustomer(null);
        setSelectedCustomerId(null);
        return;
      }

      const lookupKey = targetSlug || selectedCustomerId || '';

      if (lookupKey) {
        const cleanKey = lookupKey.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
        const found = customerList.find(
          (c) =>
            c.id.toLowerCase() === lookupKey.toLowerCase() ||
            c.name.toLowerCase() === lookupKey.toLowerCase() ||
            c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-') === cleanKey ||
            c.name.toLowerCase().includes(lookupKey.toLowerCase()) ||
            cleanKey.includes(c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'))
        );

        if (found) {
          setSelectedCustomer(found);
          return;
        }

        // Si no está registrado en la demo, autogenerar la ficha para garantizar 100% navegación fluida
        const fallbackPlayerName = selectedCustomerId || lookupKey.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        const dynamicPlayer: CustomerItem = {
          id: `c-${cleanKey || 'temp'}`,
          name: fallbackPlayerName,
          email: `${cleanKey || 'jugador'}@galiciapadel.com`,
          phone: '+34 611 22 33 44',
          memberNum: `SM-${Math.floor(400 + Math.random() * 50)}`,
          level: 3.90,
          balance: 25.0,
          isMember: true,
          matches: 18,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          hand: 'Diestro',
          position: 'Drive',
          status: 'Activo (Al día)',
        };
        setSelectedCustomer(dynamicPlayer);
        return;
      }

      if (!selectedCustomerId && !targetSlug) {
        setSelectedCustomer(null);
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
      window.history.pushState({}, '', `/admin/socios/${slug}`);
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
    feeAmount: 45,
    isZeroFee: false,
    chargeInitialFeeInPOS: true,
    initialFeePaymentMethod: 'card' as 'cash' | 'card' | 'app',
    recurringBilling: true,
    recurringBillingType: 'stripe' as 'stripe' | 'manual',
    recurringInterval: 'monthly' as 'monthly' | 'quarterly' | 'annual',
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

    const feeText = newPlayerForm.isMember
      ? newPlayerForm.isZeroFee
        ? 'Activo (Cuota 0€ · Exenta)'
        : `Activo (${newPlayerForm.feeAmount}€/${newPlayerForm.recurringInterval === 'monthly' ? 'mes' : newPlayerForm.recurringInterval === 'quarterly' ? 'trim' : 'año'})`
      : 'Esporádico';

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
      status: feeText,
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
      feeAmount: 45,
      isZeroFee: false,
      chargeInitialFeeInPOS: true,
      initialFeePaymentMethod: 'card',
      recurringBilling: true,
      recurringBillingType: 'stripe',
      recurringInterval: 'monthly',
    });
    setErrors({});

    const feeChargedNotice = newPlayerForm.isMember
      ? newPlayerForm.isZeroFee
        ? 'Socio registrado con Cuota 0€ (Convenio/Cortesía).'
        : newPlayerForm.chargeInitialFeeInPOS
        ? `Cuota inicial (${newPlayerForm.feeAmount}€) cobrada vía ${newPlayerForm.initialFeePaymentMethod === 'cash' ? 'Efectivo' : newPlayerForm.initialFeePaymentMethod === 'card' ? 'Tarjeta/Datáfono' : 'App Push'} en TPV.`
        : 'Cuota pendiente de abono.'
      : '';

    triggerDemoToast(
      'Jugador Registrado',
      `Ficha creada para ${newPlayer.name} con nivel ${newPlayer.level.toFixed(2)}. ${feeChargedNotice}`,
      'success'
    );
  };

  // Grupos y Convocatorias Handlers
  const isProOrEnterprise =
    currentTenant.planId === 'pro' || currentTenant.planId === 'elite' || forcePreviewGroups;

  const handleOpenNewGroupModal = () => {
    setNewGroupName('');
    setNewGroupCategory('level');
    setNewGroupDescription('');
    setNewGroupMinLevel('3.50');
    setNewGroupMaxLevel('4.00');
    const matching = customerList
      .filter((c) => c.level >= 3.5 && c.level <= 4.0)
      .map((c) => c.name);
    setSelectedPlayerNamesForGroup(matching);
    setIsNewGroupModalOpen(true);
  };

  const handleLevelFilterAutoSelect = (min: number, max: number) => {
    const matching = customerList
      .filter((c) => c.level >= min && c.level <= max)
      .map((c) => c.name);
    setSelectedPlayerNamesForGroup(matching);
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      triggerDemoToast('Nombre Requerido', 'Por favor introduce un nombre para el grupo.', 'warning');
      return;
    }
    const minL = newGroupMinLevel ? parseFloat(newGroupMinLevel) : undefined;
    const maxL = newGroupMaxLevel ? parseFloat(newGroupMaxLevel) : undefined;

    const membersData = customerList
      .filter((c) => selectedPlayerNamesForGroup.includes(c.name))
      .map((c) => ({
        id: c.id,
        name: c.name,
        level: c.level,
        phone: c.phone,
        email: c.email,
        isMember: c.isMember,
        avatarUrl: c.avatarUrl,
      }));

    createPlayerGroup({
      name: newGroupName.trim(),
      category: newGroupCategory,
      description:
        newGroupDescription.trim() ||
        `Lista de distribución oficial del club para ${newGroupName}.`,
      minLevel: minL,
      maxLevel: maxL,
      memberCount: selectedPlayerNamesForGroup.length,
      playerNames: selectedPlayerNamesForGroup,
      members: membersData,
      isWhatsAppReplacement: true,
    });

    setIsNewGroupModalOpen(false);
  };

  const handleOpenConvocatoriaModal = (group: PlayerGroup) => {
    setSelectedGroupForAction(group);
    setConvocatoriaSubject(`🏆 Convocatoria Setmio: Plazas para ${group.name}`);
    setConvocatoriaMessage(
      `¡Hola! Tenemos plazas disponibles en el club para jugadores de ${group.name}. Reserva tu plaza y confirma antes de que se agoten.`
    );
    setConvocatoriaType(group.category === 'academy' ? 'class' : 'match');
    setConvocatoriaUrl(`https://setmio.com/partidas`);
    setConvocatoriaChannels(['push', 'email', 'whatsapp']);
    setIsConvocatoriaModalOpen(true);
  };

  const handleSendConvocatoriaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupForAction) return;
    if (!convocatoriaSubject.trim()) {
      triggerDemoToast('Asunto Requerido', 'Indica un asunto para la convocatoria.', 'warning');
      return;
    }

    sendGroupConvocatoria({
      groupId: selectedGroupForAction.id,
      groupName: selectedGroupForAction.name,
      type: convocatoriaType,
      title: convocatoriaSubject.trim(),
      message: convocatoriaMessage.trim(),
      actionUrl: convocatoriaUrl.trim(),
      recipientsCount: selectedGroupForAction.memberCount,
      channels: convocatoriaChannels,
    });

    setIsConvocatoriaModalOpen(false);
  };

  const handleWhatsAppShare = () => {
    if (!selectedGroupForAction) return;
    const text = `🎾 *CONVOCATORIA OFICIAL ${currentTenant.name.toUpperCase()}*\n\n📢 *${convocatoriaSubject}*\n${convocatoriaMessage}\n\n👉 *Reserva y paga tu plaza directamente aquí:* ${convocatoriaUrl}`;
    const encoded = encodeURIComponent(text);
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/?text=${encoded}`, '_blank');
    }
  };

  const filteredGroups = playerGroups.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(groupSearch.toLowerCase()) ||
      g.description.toLowerCase().includes(groupSearch.toLowerCase());
    const matchesCat =
      groupCategoryFilter === 'all' || g.category === groupCategoryFilter;
    return matchesSearch && matchesCat;
  });

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
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            {crmSubTab === 'members' ? (
              <>
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t('crm.headerEyebrow', 'Base de Datos & Fidelización')}</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Comunidad & Convocatorias (Sustituto de WhatsApp)</span>
              </>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            {crmSubTab === 'members'
              ? t('crm.headerTitle', 'Socios & CRM de Jugadores')
              : 'Grupos de Jugadores & Listas de Distribución'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {crmSubTab === 'members'
              ? t('crm.headerSubtitle', 'Gestión integral de socios, cobro de cuotas, monederos y niveles ELO.')
              : 'Sustituye grupos informales de WhatsApp por listas oficiales segmentadas por nivel ELO, escuela o sede con convocatorias instantáneas y enlaces de pago a 1/4.'}
          </p>
        </div>

        {/* Botón Acción Principal */}
        {crmSubTab === 'members' ? (
          <button
            type="button"
            onClick={() => {
              setErrors({});
              setIsNewPlayerModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start sm:self-auto active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Nuevo Jugador</span>
          </button>
        ) : isProOrEnterprise ? (
          <button
            type="button"
            onClick={handleOpenNewGroupModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start sm:self-auto active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Crear Grupo de Jugadores</span>
          </button>
        ) : null}
      </div>

      {/* Subtabs de Navegación: CRM Socios vs Grupos WhatsApp */}
      <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs w-full sm:w-fit overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setCrmSubTab('members');
            if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/socios');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            crmSubTab === 'members'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Socios & CRM ({customerList.length})</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setCrmSubTab('groups');
            if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/socios/grupos');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            crmSubTab === 'groups'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-emerald-500" />
          <span>Grupos & Convocatorias ({playerGroups.length})</span>
          <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            Pro
          </span>
        </button>
      </div>

      {/* VISTA 1: SOCIOS & CRM TRADICIONAL */}
      {crmSubTab === 'members' && (
        <div className="space-y-6 animate-in fade-in duration-150">
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
        </div>
      )}

      {/* VISTA 2: MÓDULO DE GRUPOS DE JUGADORES Y CONVOCATORIAS (SUSTITUTO DE WHATSAPP) */}
      {crmSubTab === 'groups' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {!isProOrEnterprise ? (
            /* CONDICIONAMIENTO POR SUSCRIPCIÓN (Planes Pro/Enterprise) */
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <MessageCircle className="w-64 h-64 text-emerald-400" />
              </div>

              <div className="max-w-2xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Exclusivo para Planes Setmio Pro y Enterprise</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Sustituto Oficial de Grupos de WhatsApp para Clubes de Pádel
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  ¿Cansado de grupos de WhatsApp descontrolados donde los socios cancelan a última hora, se exponen teléfonos privados y los administradores pierden horas cuadrando partidas a mano?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-bold">Listas por Nivel Decimal</strong>
                      <span className="text-slate-400 text-[11px]">Segmentación exacta (ej. 3.5 a 4.0) basada en ELO real.</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-bold">Convocatorias en 1 Clic</strong>
                      <span className="text-slate-400 text-[11px]">Notificación push instantánea a la app del socio y SMS.</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-bold">Cobro Dividido Garantizado</strong>
                      <span className="text-slate-400 text-[11px]">Enlace directo a la plaza con pago con monedero o tarjeta.</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-bold">Cumplimiento RGPD Blindado</strong>
                      <span className="text-slate-400 text-[11px]">Sin exposición de teléfonos ni datos personales entre usuarios.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setForcePreviewGroups(true);
                      triggerDemoToast('Modo Demostración Activado', 'Probando módulo de Grupos y Convocatorias.', 'info');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Probar Módulo en Modo Demo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTab('subscription')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
                  >
                    Ver Planes y Precios
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* INTERFAZ COMPLETA DE GRUPOS & CONVOCATORIAS PRO */
            <div className="space-y-6">
              {/* KPIs de Grupos y Convocatorias */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Grupos / Listas
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {playerGroups.length}
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Segmentación activa</span>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Socios Clasificados
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {playerGroups.reduce((acc, g) => acc + g.memberCount, 0)}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Distribuidos en listas
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Convocatorias Lanzadas
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {groupConvocatorias.length}
                  </div>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" />
                    <span>Histórico guardado</span>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Tiempo Cierre Plaza
                  </span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    ~14 min
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    88% tasa de cobertura
                  </span>
                </div>
              </div>

              {/* Filtros y Buscador de Grupos */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={groupSearch}
                    onChange={(e) => setGroupSearch(e.target.value)}
                    placeholder="Buscar grupo o lista..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold">
                  {[
                    { id: 'all', label: `Todos (${playerGroups.length})` },
                    { id: 'level', label: 'Nivel ELO' },
                    { id: 'academy', label: 'Escuela' },
                    { id: 'venue', label: 'Sede' },
                    { id: 'social', label: 'Social' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setGroupCategoryFilter(cat.id as any)}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        groupCategoryFilter === cat.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid de Grupos de Jugadores */}
              {filteredGroups.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    No se encontraron grupos de jugadores
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Crea tu primer grupo de distribución segmentado para convocar partidos y sustituir chats de WhatsApp.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenNewGroupModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Crear Primer Grupo</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGroups.map((group) => {
                    return (
                      <div
                        key={group.id}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                      >
                        <div className="space-y-3">
                          {/* Encabezado: Categoría y Sustituto WhatsApp */}
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                group.category === 'level'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : group.category === 'academy'
                                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                  : group.category === 'venue'
                                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              }`}
                            >
                              {group.category === 'level'
                                ? 'Nivel ELO'
                                : group.category === 'academy'
                                ? 'Escuela Tardes'
                                : group.category === 'venue'
                                ? 'Sede Central'
                                : 'Competición'}
                            </span>

                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              <MessageCircle className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                              <span>Sustituto WhatsApp</span>
                            </span>
                          </div>

                          {/* Nombre y Descripción */}
                          <div>
                            <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                              {group.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {group.description}
                            </p>
                          </div>

                          {/* Nivel ELO si aplica */}
                          {group.minLevel && group.maxLevel && (
                            <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
                              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Rango de Nivel:</span>
                              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                                {group.minLevel.toFixed(2)} - {group.maxLevel.toFixed(2)}
                              </span>
                            </div>
                          )}

                          {/* Jugadores y Avatares */}
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                              <span>Miembros registrados</span>
                              <span className="font-mono text-slate-700 dark:text-slate-300">
                                {group.memberCount} jugadores
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap">
                              {group.playerNames.slice(0, 5).map((playerName, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-2xs shrink-0"
                                  title={playerName}
                                >
                                  {playerName.slice(0, 2).toUpperCase()}
                                </div>
                              ))}
                              {group.playerNames.length > 5 && (
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 pl-1">
                                  +{group.playerNames.length - 5} más
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Info de última convocatoria */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Send className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">
                              {group.lastConvocatoriaAt
                                ? `${group.lastConvocatoriaAt}: ${group.lastConvocatoriaSubject || 'Convocatoria'}`
                                : 'Sin convocatorias recientes'}
                            </span>
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedGroupForAction(group);
                              setIsGroupMembersModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>Ver ({group.memberCount})</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => deletePlayerGroup(group.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                              title="Eliminar grupo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenConvocatoriaModal(group)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Notificar a Grupo</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Historial de Convocatorias Realizadas */}
              {groupConvocatorias.length > 0 && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Historial de Convocatorias Instantáneas Enviadas</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {groupConvocatorias.length} registradas
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {groupConvocatorias.map((conv) => (
                      <div key={conv.id} className="py-2.5 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <strong className="font-bold text-slate-900 dark:text-white truncate">
                              {conv.title}
                            </strong>
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-bold shrink-0">
                              {conv.groupName} ({conv.recipientsCount} socios)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {conv.message}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono text-slate-400 block">{conv.sentAt}</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            Push + WhatsApp
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

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

              {/* Condición de Socio & Cuotas */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3.5">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={newPlayerForm.isMember}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, isMember: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Es socio del club con cuota de membresía</span>
                </label>

                {newPlayerForm.isMember && (
                  <div className="space-y-3 pt-1 border-t border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-2 gap-3">
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

                    {/* Opción Explícita: Cuota 0€ */}
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                        <input
                          type="checkbox"
                          checked={newPlayerForm.isZeroFee}
                          onChange={(e) => setNewPlayerForm({ ...newPlayerForm, isZeroFee: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>{t('crm.zeroFeeOption', 'Registrar Socio con Cuota 0€ (Cortesía / Convenio / Cantera)')}</span>
                      </label>
                    </div>

                    {/* Importe de la Cuota y Cobro en TPV */}
                    {!newPlayerForm.isZeroFee && (
                      <div className="space-y-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              {t('crm.initialFee', 'Cuota Inicial de Alta (€)')}
                            </label>
                            <input
                              type="number"
                              min="1"
                              step="5"
                              value={newPlayerForm.feeAmount}
                              onChange={(e) => setNewPlayerForm({ ...newPlayerForm, feeAmount: parseFloat(e.target.value) || 0 })}
                              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              {t('crm.recurringInterval', 'Periodicidad de la Cuota')}
                            </label>
                            <select
                              value={newPlayerForm.recurringInterval}
                              onChange={(e) => setNewPlayerForm({ ...newPlayerForm, recurringInterval: e.target.value as any })}
                              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                            >
                              <option value="monthly">{t('crm.intervalMonthly', 'Mensual')}</option>
                              <option value="quarterly">{t('crm.intervalQuarterly', 'Trimestral')}</option>
                              <option value="annual">{t('crm.intervalAnnual', 'Anual')}</option>
                            </select>
                          </div>
                        </div>

                        {/* Cobro inicial en TPV */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                            <input
                              type="checkbox"
                              checked={newPlayerForm.chargeInitialFeeInPOS}
                              onChange={(e) => setNewPlayerForm({ ...newPlayerForm, chargeInitialFeeInPOS: e.target.checked })}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>{t('crm.chargeInPOS', 'Cobrar cuota inicial directamente en el TPV')}</span>
                          </label>

                          {newPlayerForm.chargeInitialFeeInPOS && (
                            <div className="grid grid-cols-3 gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => setNewPlayerForm({ ...newPlayerForm, initialFeePaymentMethod: 'card' })}
                                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition ${
                                  newPlayerForm.initialFeePaymentMethod === 'card'
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {t('crm.methodCard', 'Tarjeta / Datáfono')}
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewPlayerForm({ ...newPlayerForm, initialFeePaymentMethod: 'cash' })}
                                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition ${
                                  newPlayerForm.initialFeePaymentMethod === 'cash'
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {t('crm.methodCash', 'Efectivo (Mostrador)')}
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewPlayerForm({ ...newPlayerForm, initialFeePaymentMethod: 'app' })}
                                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition ${
                                  newPlayerForm.initialFeePaymentMethod === 'app'
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {t('crm.methodApp', 'Cobro Push / App')}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Cobro recurrente periódico */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                            <input
                              type="checkbox"
                              checked={newPlayerForm.recurringBilling}
                              onChange={(e) => setNewPlayerForm({ ...newPlayerForm, recurringBilling: e.target.checked })}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>{t('crm.recurringBilling', 'Activar Cobro Recurrente Periódico')}</span>
                          </label>

                          {newPlayerForm.recurringBilling && (
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setNewPlayerForm({ ...newPlayerForm, recurringBillingType: 'stripe' })}
                                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border text-left transition ${
                                  newPlayerForm.recurringBillingType === 'stripe'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {t('crm.recurringStripe', 'Suscripción Automática Stripe')}
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewPlayerForm({ ...newPlayerForm, recurringBillingType: 'manual' })}
                                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border text-left transition ${
                                  newPlayerForm.recurringBillingType === 'manual'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {t('crm.recurringManual', 'Renovación en Mostrador / Remesa')}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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

      {/* MODAL 1: CREAR GRUPO / LISTA DE DISTRIBUCIÓN */}
      {isNewGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Nuevo Grupo / Lista de Distribución
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sustituto de grupos de WhatsApp para convocatorias de partidas y clases.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewGroupModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Grupo / Lista *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Nivel 3.5 a 4.0, Escuela Tardes, Jugadores Sede Central..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría del Grupo
                  </label>
                  <select
                    value={newGroupCategory}
                    onChange={(e) => setNewGroupCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="level">Nivel ELO / Partidos</option>
                    <option value="academy">Escuela / Academia</option>
                    <option value="venue">Sede / Ubicación</option>
                    <option value="social">Competición / Social</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rango de Nivel (Min - Max)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.25"
                      min="1.0"
                      max="7.0"
                      value={newGroupMinLevel}
                      onChange={(e) => {
                        setNewGroupMinLevel(e.target.value);
                        handleLevelFilterAutoSelect(parseFloat(e.target.value) || 1, parseFloat(newGroupMaxLevel) || 7);
                      }}
                      className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-center text-slate-900 dark:text-white"
                      placeholder="Min"
                    />
                    <span className="text-slate-400 font-bold">-</span>
                    <input
                      type="number"
                      step="0.25"
                      min="1.0"
                      max="7.0"
                      value={newGroupMaxLevel}
                      onChange={(e) => {
                        setNewGroupMaxLevel(e.target.value);
                        handleLevelFilterAutoSelect(parseFloat(newGroupMinLevel) || 1, parseFloat(e.target.value) || 7);
                      }}
                      className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-center text-slate-900 dark:text-white"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Descripción / Objetivo de la Lista
                </label>
                <textarea
                  rows={2}
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Describe el propósito del grupo para las convocatorias..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Selección de Jugadores */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Socios Incluidos ({selectedPlayerNamesForGroup.length} seleccionados)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedPlayerNamesForGroup.length === customerList.length) {
                        setSelectedPlayerNamesForGroup([]);
                      } else {
                        setSelectedPlayerNamesForGroup(customerList.map((c) => c.name));
                      }
                    }}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {selectedPlayerNamesForGroup.length === customerList.length
                      ? 'Deseleccionar todos'
                      : 'Seleccionar todos los socios'}
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 divide-y divide-slate-100 dark:divide-slate-800/60">
                  {customerList.map((player) => {
                    const isSelected = selectedPlayerNamesForGroup.includes(player.name);
                    return (
                      <label
                        key={player.id}
                        className="flex items-center justify-between p-1.5 hover:bg-white dark:hover:bg-slate-900 rounded-lg cursor-pointer transition text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPlayerNamesForGroup([...selectedPlayerNamesForGroup, player.name]);
                              } else {
                                setSelectedPlayerNamesForGroup(
                                  selectedPlayerNamesForGroup.filter((n) => n !== player.name)
                                );
                              }
                            }}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <img
                            src={player.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'}
                            alt={player.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-bold text-slate-900 dark:text-white">
                            {player.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                            Nivel {player.level.toFixed(2)}
                          </span>
                          {player.isMember && (
                            <span className="text-[10px] font-bold text-slate-500">
                              Socio
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewGroupModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Grupo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LANZAR CONVOCATORIA INSTANTÁNEA (SUSTITUTO DE WHATSAPP) */}
      {isConvocatoriaModalOpen && selectedGroupForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Lanzar Convocatoria a Grupo
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Destinatario: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedGroupForAction.name}</strong> ({selectedGroupForAction.memberCount} socios)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConvocatoriaModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendConvocatoriaSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Convocatoria
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'match', label: 'Partida Abierta' },
                    { id: 'class', label: 'Clase / Escuela' },
                    { id: 'general', label: 'Aviso del Club' },
                  ].map((tOption) => (
                    <button
                      key={tOption.id}
                      type="button"
                      onClick={() => setConvocatoriaType(tOption.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold border transition text-center ${
                        convocatoriaType === tOption.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {tOption.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Asunto / Titular de la Convocatoria *
                </label>
                <input
                  type="text"
                  required
                  value={convocatoriaSubject}
                  onChange={(e) => setConvocatoriaSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mensaje Detallado
                </label>
                <textarea
                  rows={3}
                  required
                  value={convocatoriaMessage}
                  onChange={(e) => setConvocatoriaMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Enlace Directo de Reserva o Pago Individual
                </label>
                <input
                  type="text"
                  value={convocatoriaUrl}
                  onChange={(e) => setConvocatoriaUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Canales */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Canales de Notificación Simultáneos
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={convocatoriaChannels.includes('push')}
                      onChange={(e) => {
                        if (e.target.checked) setConvocatoriaChannels([...convocatoriaChannels, 'push']);
                        else setConvocatoriaChannels(convocatoriaChannels.filter((c) => c !== 'push'));
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-[11px] font-bold">App Push</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={convocatoriaChannels.includes('email')}
                      onChange={(e) => {
                        if (e.target.checked) setConvocatoriaChannels([...convocatoriaChannels, 'email']);
                        else setConvocatoriaChannels(convocatoriaChannels.filter((c) => c !== 'email'));
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-[11px] font-bold">Email Club</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={convocatoriaChannels.includes('whatsapp')}
                      onChange={(e) => {
                        if (e.target.checked) setConvocatoriaChannels([...convocatoriaChannels, 'whatsapp']);
                        else setConvocatoriaChannels(convocatoriaChannels.filter((c) => c !== 'whatsapp'));
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-[11px] font-bold">WhatsApp Web</span>
                  </div>
                </div>
              </div>

              {/* Botón Compartir en WhatsApp directo */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-bold">
                    ¿Quieres enviarlo también por WhatsApp Web?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shrink-0"
                >
                  Abrir WhatsApp
                </button>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsConvocatoriaModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Lanzar Convocatoria Instantánea</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VER MIEMBROS DEL GRUPO */}
      {isGroupMembersModalOpen && selectedGroupForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Miembros de: {selectedGroupForAction.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {selectedGroupForAction.memberCount} jugadores registrados en la lista
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGroupMembersModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {selectedGroupForAction.playerNames.map((name, idx) => {
                  const customer = customerList.find((c) => c.name === name);
                  return (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={customer?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'}
                          alt={name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{name}</div>
                          <div className="text-[11px] text-slate-400">
                            {customer?.phone || '+34 600 00 00 00'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          Niv {customer ? customer.level.toFixed(2) : '3.80'}
                        </span>
                        {customer?.isMember && (
                          <span className="text-[10px] font-bold text-slate-500">
                            Socio
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsGroupMembersModalOpen(false);
                  handleOpenConvocatoriaModal(selectedGroupForAction);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Notificar a este Grupo</span>
              </button>
              <button
                type="button"
                onClick={() => setIsGroupMembersModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
