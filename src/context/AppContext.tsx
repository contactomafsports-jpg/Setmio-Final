import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tenant,
  UserRole,
  Court,
  Booking,
  OpenMatch,
  Coach,
  AcademyGroup,
  Tournament,
  Product,
  CartItem,
  BlogPost,
  SmartCourtDevice,
  CafeProduct,
  AuditLogItem,
  NotificationItem,
  PageBlock,
  Plan,
} from '../types/database';
import {
  INITIAL_TENANT,
  ADDITIONAL_DEMO_TENANTS,
  INITIAL_PLANS,
  INITIAL_COURTS,
  INITIAL_BOOKINGS,
  INITIAL_OPEN_MATCHES,
  INITIAL_COACHES,
  INITIAL_ACADEMY_GROUPS,
  INITIAL_TOURNAMENTS,
  INITIAL_PRODUCTS,
  INITIAL_BLOG_POSTS,
  INITIAL_SMART_DEVICES,
  INITIAL_CAFE_PRODUCTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PAGE_BLOCKS,
} from '../data/initialData';
import { SupportedLanguage, getTranslation } from '../lib/i18n';
import { checkPermission, PermissionAction, PermissionCheckResult } from '../lib/permissions';

export type MainView = 'public' | 'admin' | 'player' | 'hq';

export type PublicPage =
  | 'home'
  | 'club'
  | 'courts'
  | 'booking'
  | 'matches'
  | 'academy'
  | 'tournaments'
  | 'shop'
  | 'blog'
  | 'article'
  | 'contact'
  | 'legal';

export type AdminTab =
  | 'dashboard'
  | 'agenda'
  | 'customers'
  | 'academy'
  | 'tournaments'
  | 'shop'
  | 'smart_courts'
  | 'pos_cafe'
  | 'web_editor'
  | 'domains'
  | 'subscription'
  | 'settings';

export type PlayerTab =
  | 'dashboard'
  | 'my_bookings'
  | 'my_matches'
  | 'my_academy'
  | 'statistics'
  | 'favorites'
  | 'ai_coach';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  playLevel: number;
}

export interface DemoNotificationToast {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning';
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AppContextType {
  // Theme & i18n
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;

  // Search & Onboarding modals
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;

  // Navigation & Views
  currentView: MainView;
  setCurrentView: (view: MainView) => void;
  publicPage: PublicPage;
  setPublicPage: (page: PublicPage) => void;
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  playerTab: PlayerTab;
  setPlayerTab: (tab: PlayerTab) => void;

  // Multi-tenant & Plans
  tenants: Tenant[];
  currentTenant: Tenant;
  updateCurrentTenant: (updated: Partial<Tenant>) => void;
  switchTenant: (tenantId: string) => void;
  plans: Plan[];
  updatePlan: (planId: string, updated: Partial<Plan>) => void;

  // Auth & Roles & Permissions
  currentUser: UserSession;
  switchUserRole: (role: UserRole) => void;
  isSuperadmin: boolean;
  can: (action: PermissionAction) => PermissionCheckResult;

  // Domain Business Data
  courts: Court[];
  toggleCourtLight: (courtId: string) => void;
  updateCourtRate: (courtId: string, rate: number) => void;

  bookings: Booking[];
  createBooking: (newBooking: Omit<Booking, 'id' | 'tenantId'>) => Booking;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  cancelBooking: (bookingId: string) => void;

  openMatches: OpenMatch[];
  createOpenMatch: (match: Omit<OpenMatch, 'id' | 'tenantId'>) => void;
  joinOpenMatch: (matchId: string, player: { name: string; level: number; position: 'drive' | 'reves' | 'both' }) => void;

  coaches: Coach[];
  academyGroups: AcademyGroup[];

  tournaments: Tournament[];
  registerTournamentTeam: (tournamentId: string, categoryName: string, teamName: string) => void;

  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  couponCode: string;
  discountPercent: number;
  applyCoupon: (code: string) => boolean;

  favorites: string[];
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;

  blogPosts: BlogPost[];
  pageBlocks: PageBlock[];
  updatePageBlocks: (blocks: PageBlock[]) => void;

  smartDevices: SmartCourtDevice[];
  toggleSmartRelay: (deviceId: string) => void;
  generateAccessPin: (deviceId: string) => string;

  cafeProducts: CafeProduct[];
  recordCafeSale: (product: CafeProduct, qty: number) => void;

  auditLogs: AuditLogItem[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationsAsRead: () => void;

  // AI Assistant Chat
  aiMessages: AIMessage[];
  sendAIMessage: (text: string) => void;
  isAiThinking: boolean;

  // Demo Toast helper
  demoToast: DemoNotificationToast | null;
  triggerDemoToast: (title: string, description: string, type?: 'info' | 'success' | 'warning') => void;
  clearDemoToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial demo profiles for role switching
const ROLE_PROFILES: Record<UserRole, UserSession> = {
  SUPERADMIN: {
    id: 'user-superadmin-01',
    name: 'Superadministrador Setmio HQ',
    email: 'admin@setmio.com',
    role: 'SUPERADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    playLevel: 4.5,
  },
  TENANT_OWNER: {
    id: 'user-mateo-owner',
    name: 'Mateo Varela (Propietario)',
    email: 'mateo@padelsanmateo.es',
    role: 'TENANT_OWNER',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    playLevel: 5.5,
  },
  TENANT_ADMIN: {
    id: 'user-admin-01',
    name: 'Rosa Carballo (Gerente)',
    email: 'gerencia@padelsanmateo.es',
    role: 'TENANT_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    playLevel: 3.5,
  },
  RECEPTION: {
    id: 'user-reception-01',
    name: 'Iván Gómez (Recepción y Pistas)',
    email: 'recepcion@padelsanmateo.es',
    role: 'RECEPTION',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    playLevel: 3.0,
  },
  COACH: {
    id: 'user-coach-laura',
    name: 'Laura Senra (Entrenadora Pro)',
    email: 'laura.senra@padelsanmateo.es',
    role: 'COACH',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    playLevel: 5.0,
  },
  PLAYER: {
    id: 'user-player-carlos',
    name: 'Carlos Méndez (Jugador Socio)',
    email: 'carlos.mendez@galiciapadel.com',
    role: 'PLAYER',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    playLevel: 3.85,
  },
  STORE_MANAGER: {
    id: 'user-store-01',
    name: 'Adrián Pena (Pro Shop)',
    email: 'tienda@padelsanmateo.es',
    role: 'STORE_MANAGER',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    playLevel: 3.2,
  },
  TOURNAMENT_ORGANIZER: {
    id: 'user-tourn-01',
    name: 'Nacho Castro (Torneos & Ligas)',
    email: 'torneos@padelsanmateo.es',
    role: 'TOURNAMENT_ORGANIZER',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    playLevel: 4.0,
  },
  ACADEMY_MANAGER: {
    id: 'user-acad-01',
    name: 'Elena Permuy (Coordinación Escuela)',
    email: 'escuela@padelsanmateo.es',
    role: 'ACADEMY_MANAGER',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    playLevel: 3.8,
  },
  TEAM_MANAGER: {
    id: 'user-team-01',
    name: 'Pablo Vello (Capitán Equipos)',
    email: 'equipos@padelsanmateo.es',
    role: 'TEAM_MANAGER',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    playLevel: 4.8,
  },
  PROFESSIONAL_PLAYER: {
    id: 'user-pro-01',
    name: 'Martín Sánchez (WPT Pro)',
    email: 'martin.pro@setmio.com',
    role: 'PROFESSIONAL_PLAYER',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    playLevel: 6.5,
  },
  PARENT_OR_GUARDIAN: {
    id: 'user-parent-01',
    name: 'Marta Calvo (Tutor Menor)',
    email: 'marta.calvo@email.es',
    role: 'PARENT_OR_GUARDIAN',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    playLevel: 2.2,
  },
  STAFF: {
    id: 'user-staff-01',
    name: 'Marcos Rúa (Mantenimiento)',
    email: 'staff@padelsanmateo.es',
    role: 'STAFF',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    playLevel: 2.5,
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state (LIGHT MODE is default per requirement 45)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('setmio_theme') as ThemeMode;
      return saved || 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Language state (default 'es' per requirement 40)
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('setmio_lang') as SupportedLanguage;
      return saved || 'es';
    } catch {
      return 'es';
    }
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('setmio_lang', lang);
    } catch {
      // Ignore
    }
  };

  const t = (key: string, fallback?: string): string => {
    return getTranslation(language, key, fallback);
  };

  // Sync theme with DOM documentElement
  useEffect(() => {
    const root = document.documentElement;
    try {
      localStorage.setItem('setmio_theme', theme);
    } catch {
      // Ignore
    }

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [theme]);

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // Navigation
  const [currentView, setCurrentView] = useState<MainView>('public');
  const [publicPage, setPublicPage] = useState<PublicPage>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [playerTab, setPlayerTab] = useState<PlayerTab>('dashboard');

  // Multi-tenant & Plans
  const [tenants, setTenants] = useState<Tenant[]>([
    INITIAL_TENANT,
    ...ADDITIONAL_DEMO_TENANTS,
  ]);

  const [currentTenantId, setCurrentTenantId] = useState<string>('tenant-san-mateo-01');
  const currentTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  const updateCurrentTenant = (updated: Partial<Tenant>) => {
    // Check if locked demo
    if (currentTenant.demo_locked && updated.type && updated.type !== currentTenant.type && currentUser.role !== 'SUPERADMIN') {
      triggerDemoToast(
        'Modificación Bloqueada',
        'Centro de Pádel San Mateo es el tenant demostración principal y su tipo PADEL_CLUB está protegido.',
        'warning'
      );
      return;
    }

    setTenants((prev) =>
      prev.map((t) => (t.id === currentTenant.id ? { ...t, ...updated } : t))
    );
  };

  const switchTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
    const target = tenants.find((t) => t.id === tenantId);
    if (target) {
      // If user language is not supported by target tenant, fallback to first supported
      if (!target.supportedLanguages.includes(language)) {
        setLanguage(target.supportedLanguages[0]);
      }
    }
    triggerDemoToast(
      'Espacio Seleccionado',
      `Ahora visualizando "${target?.name}" (${target?.type.replace('_', ' ')}). Interfaz y datos adaptados al negocio.`,
      'info'
    );
  };

  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);

  const updatePlan = (planId: string, updated: Partial<Plan>) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, ...updated } : p))
    );
    triggerDemoToast(
      'Plan Global Actualizado',
      `Configuración del plan ${planId.toUpperCase()} guardada en el catálogo global de Setmio.`,
      'success'
    );
  };

  // User & Role Switching
  const [currentUser, setCurrentUser] = useState<UserSession>(ROLE_PROFILES.TENANT_OWNER);

  const switchUserRole = (role: UserRole) => {
    const profile = ROLE_PROFILES[role] || ROLE_PROFILES.PLAYER;
    setCurrentUser(profile);

    // Auto navigate to relevant view based on role
    if (role === 'SUPERADMIN') {
      setCurrentView('hq');
    } else if (role === 'PLAYER' || role === 'PARENT_OR_GUARDIAN') {
      setCurrentView('player');
    } else {
      setCurrentView('admin');
    }

    triggerDemoToast(
      `Perfil Activo: ${role}`,
      `Sesión cambiada a ${profile.name} con permisos contextuales.`,
      'info'
    );
  };

  const isSuperadmin = currentUser.role === 'SUPERADMIN';

  // Permission check helper
  const can = (action: PermissionAction): PermissionCheckResult => {
    return checkPermission(
      currentUser.role,
      action,
      currentTenant.type,
      currentTenant.planId,
      currentTenant.demo_locked || false
    );
  };

  // Domain Business State
  const [courts, setCourts] = useState<Court[]>(INITIAL_COURTS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [openMatches, setOpenMatches] = useState<OpenMatch[]>(INITIAL_OPEN_MATCHES);
  const [coaches] = useState<Coach[]>(INITIAL_COACHES);
  const [academyGroups] = useState<AcademyGroup[]>(INITIAL_ACADEMY_GROUPS);
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [blogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [pageBlocks, setPageBlocks] = useState<PageBlock[]>(INITIAL_PAGE_BLOCKS);
  const [smartDevices, setSmartDevices] = useState<SmartCourtDevice[]>(INITIAL_SMART_DEVICES);
  const [cafeProducts, setCafeProducts] = useState<CafeProduct[]>(INITIAL_CAFE_PRODUCTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // E-commerce Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const addToCart = (product: Product, qty: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    triggerDemoToast(
      'Añadido a la Cesta',
      `Has añadido ${qty}x "${product.name}" a tu carrito de compra.`,
      'success'
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SANMATEO10' || clean === 'SETMIO10') {
      setCouponCode(clean);
      setDiscountPercent(10);
      triggerDemoToast('Cupón Aplicado', '10% de descuento aplicado con éxito.', 'success');
      return true;
    }
    if (clean === 'ELITE20') {
      setCouponCode(clean);
      setDiscountPercent(20);
      triggerDemoToast('Cupón VIP Aplicado', '20% de descuento especial aplicado.', 'success');
      return true;
    }
    triggerDemoToast('Cupón No Válido', 'Prueba con "SANMATEO10" o "ELITE20" para la demostración.', 'warning');
    return false;
  };

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(['prod-1', 'court-1', 'coach-1', 't-2026-01']);

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(itemId);
      if (exists) {
        triggerDemoToast('Eliminado de Favoritos', 'Elemento quitado de tu lista personal.', 'info');
        return prev.filter((id) => id !== itemId);
      } else {
        triggerDemoToast('Añadido a Favoritos', 'Guardado en tu lista de favoritos.', 'success');
        return [...prev, itemId];
      }
    });
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  // Court Actions
  const toggleCourtLight = (courtId: string) => {
    const perm = can('manage_smart_courts');
    if (!perm.allowed) {
      triggerDemoToast('Permiso Denegado', perm.message || 'No tienes permisos para conmutar iluminación.', 'warning');
      return;
    }

    setCourts((prev) =>
      prev.map((c) =>
        c.id === courtId ? { ...c, isLightOn: !c.isLightOn } : c
      )
    );
    const targetCourt = courts.find((c) => c.id === courtId);
    const newState = !targetCourt?.isLightOn;

    // Also update connected smart device
    setSmartDevices((prev) =>
      prev.map((d) =>
        d.courtId === courtId ? { ...d, relayState: newState, lastSync: 'Ahora mismo' } : d
      )
    );

    // Audit log
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: 'Ahora mismo',
        actor: currentUser.email,
        role: currentUser.role,
        action: newState ? 'Encendido de Iluminación' : 'Apagado de Iluminación',
        target: targetCourt?.name || courtId,
        details: `Orden enviada al adaptador Shelly Cloud IoT (${newState ? 'ON' : 'OFF'}). Modo demo activo.`,
      },
      ...prev,
    ]);

    triggerDemoToast(
      'Automatización de Pista',
      `Iluminación de ${targetCourt?.name} cambiada a ${newState ? 'ENCENDIDA' : 'APAGADA'}.`,
      'info'
    );
  };

  const updateCourtRate = (courtId: string, rate: number) => {
    setCourts((prev) =>
      prev.map((c) => (c.id === courtId ? { ...c, hourlyRate: rate } : c))
    );
    triggerDemoToast(
      'Tarifa de Pista Actualizada',
      `Nueva tarifa horaria establecida en ${rate.toFixed(2)}€/hora.`,
      'success'
    );
  };

  // Booking Actions
  const createBooking = (newBookingData: Omit<Booking, 'id' | 'tenantId'>): Booking => {
    const randomPin = `${Math.floor(1000 + Math.random() * 9000)}#`;
    const newBooking: Booking = {
      ...newBookingData,
      id: `b-${Date.now().toString().slice(-4)}`,
      tenantId: currentTenant.id,
      accessPin: randomPin,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Add audit log
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: 'Ahora mismo',
        actor: currentUser.email,
        role: currentUser.role,
        action: 'Nueva Reserva Creada',
        target: `${newBooking.courtName} (${newBooking.startTime.split('T')[1] || ''})`,
        details: `Importe: ${newBooking.totalPrice}€. Código PIN de puerta generado: ${randomPin}`,
      },
      ...prev,
    ]);

    // Send notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: '¡Reserva Confirmada!',
        message: `Tu pista "${newBooking.courtName}" está reservada. PIN de acceso al vestuario/pista: ${randomPin}`,
        type: 'booking',
        timestamp: 'Ahora mismo',
        read: false,
      },
      ...prev,
    ]);

    triggerDemoToast(
      'Reserva Registrada con Éxito',
      `Pista confirmada. PIN ${randomPin} asignado para apertura de puertas.`,
      'success'
    );

    return newBooking;
  };

  const updateBooking = (bookingId: string, updates: Partial<Booking>) => {
  setBookings((prev) => prev.map((booking) => booking.id === bookingId ? { ...booking, ...updates } : booking));
  triggerDemoToast('Reserva actualizada', 'Los cambios se han guardado en el historial del club.', 'success');
  };

  const cancelBooking = (bookingId: string) => {
  setBookings((prev) =>
  prev.map((b) => (b.id === bookingId ? { ...b, status: 'canceled' } : b))
  );
    triggerDemoToast(
      'Reserva Cancelada',
      'La reserva ha sido cancelada y la pista queda liberada en la agenda del club.',
      'info'
    );
  };

  // Open Matches
  const createOpenMatch = (matchData: Omit<OpenMatch, 'id' | 'tenantId'>) => {
    const newMatch: OpenMatch = {
      ...matchData,
      id: `match-${Date.now().toString().slice(-4)}`,
      tenantId: currentTenant.id,
    };
    setOpenMatches((prev) => [newMatch, ...prev]);
    triggerDemoToast(
      'Partido Abierto Publicado',
      `Tu partido ha sido publicado en la comunidad. Se avisará a jugadores con nivel afín (${matchData.minLevel} - ${matchData.maxLevel}).`,
      'success'
    );
  };

  const joinOpenMatch = (
    matchId: string,
    player: { name: string; level: number; position: 'drive' | 'reves' | 'both' }
  ) => {
    setOpenMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        const updatedPlayers = [
          ...m.players,
          {
            id: `p-${Date.now()}`,
            name: player.name,
            level: player.level,
            position: player.position,
            paid: true,
          },
        ];
        return {
          ...m,
          players: updatedPlayers,
          status: updatedPlayers.length >= 4 ? 'full' : 'open',
        };
      })
    );
    triggerDemoToast(
      '¡Te has unido al partido!',
      `Plaza confirmada en ${currentTenant.shortName}.`,
      'success'
    );
  };

  // Tournaments
  const registerTournamentTeam = (tournamentId: string, categoryName: string, teamName: string) => {
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id !== tournamentId) return t;
        const updatedCategories = t.categories.map((c) => {
          if (c.name === categoryName) {
            return { ...c, teamsCount: Math.min(c.maxTeams, c.teamsCount + 1) };
          }
          return c;
        });
        return { ...t, categories: updatedCategories };
      })
    );
    triggerDemoToast(
      'Inscripción de Pareja Registrada',
      `Pareja "${teamName}" inscrita en la categoría "${categoryName}".`,
      'success'
    );
  };

  // Page blocks editor
  const updatePageBlocks = (blocks: PageBlock[]) => {
    setPageBlocks(blocks);
    triggerDemoToast(
      'Estructura de Página Guardada',
      'El orden y la visibilidad de los bloques públicos han sido actualizados en borrador.',
      'success'
    );
  };

  // Smart IoT Devices
  const toggleSmartRelay = (deviceId: string) => {
    setSmartDevices((prev) =>
      prev.map((d) => {
        if (d.id !== deviceId) return d;
        const nextState = !d.relayState;
        if (d.courtId) {
          setCourts((cList) =>
            cList.map((c) => (c.id === d.courtId ? { ...c, isLightOn: nextState } : c))
          );
        }
        return { ...d, relayState: nextState, lastSync: 'Ahora mismo' };
      })
    );
    triggerDemoToast(
      'Dispositivo IoT Conmutado',
      `Relé ejecutado en modo demostración.`,
      'info'
    );
  };

  const generateAccessPin = (deviceId: string): string => {
    const pin = `${Math.floor(1000 + Math.random() * 9000)}#`;
    setSmartDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, currentAccessPin: pin, lastSync: 'Ahora mismo' } : d))
    );
    triggerDemoToast(
      'Nuevo PIN de Cerradura Generado',
      `El PIN temporal para la cerradura inteligente es ahora ${pin}.`,
      'success'
    );
    return pin;
  };

  // POS Cafetería
  const recordCafeSale = (product: CafeProduct, qty: number) => {
    setCafeProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, stock: Math.max(0, p.stock - qty) } : p
      )
    );
    triggerDemoToast(
      'Venta Rápida TPV Registrada',
      `${qty}x ${product.name} cobrado (${(product.price * qty).toFixed(2)}€). Stock actualizado.`,
      'success'
    );
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Pistas renovadas en Narón',
      message: 'Nuevo césped Mondo Supercourt WPT disponible para reserva en pistas 1 y 2.',
      type: 'system',
      timestamp: 'Hoy, 09:15',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'I Open Primavera Pádel San Mateo',
      message: 'Abiertas las inscripciones para el torneo con 1.800€ en premios.',
      type: 'tournament',
      timestamp: 'Ayer',
      read: false,
    },
  ]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Floating AI Chat
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `¡Hola! Soy el asistente inteligente de Setmio Padel Pro para ${currentTenant.name}. Puedo informarte de disponibilidad, escuela, torneos, estadísticas o ayudarte con la gestión. ¿En qué te asesoro?`,
      timestamp: 'Ahora',
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const sendAIMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Ahora',
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (currentTenant.type === 'PRO_PLAYER') {
        reply = `Hola. Soy el asistente oficial de ${currentTenant.name}. Actualmente ocupa el ranking FIP #${currentTenant.proPlayerStats?.fipRanking || 18}. Su próximo torneo es en Madrid. Para solicitudes de patrocinio, clinics o exhibiciones, puedes consultar la sección de Media Kit y Contacto.`;
      } else if (currentTenant.type === 'COACH') {
        reply = `Hola. Soy el asistente de ${currentTenant.name}. Ofrece clases individuales (tarifa ${currentTenant.coachStats?.hourlyRate || 45}€/h) y clinics grupales de fin de semana. ¿Buscas perfeccionar tu técnica o preparar torneos de competición?`;
      } else if (currentTenant.type === 'ONLINE_STORE') {
        reply = `¡Bienvenido a ${currentTenant.name}! Contamos con stock oficial de palas Bullpadel Vertex 04, Nox AT10 Agustín Tapia y calzado Asics con envíos 24h a toda la península. ¿Buscas una pala de control o potencia?`;
      } else if (lower.includes('pista') || lower.includes('reserv') || lower.includes('horario') || lower.includes('precio')) {
        reply = `En ${currentTenant.name} disponemos de 8 pistas cubiertas con césped Mondo Supercourt WPT. Las tarifas oscilan entre 18€/h y 30€/h. El club abre de 08:30 a 23:30. ¿Quieres que te muestre los huecos libres para hoy?`;
      } else if (lower.includes('escuela') || lower.includes('clase') || lower.includes('entrenador')) {
        reply = `Nuestra escuela oficial está dirigida por Mateo Varela (Nivel 2 FEP) y Laura Senra. Ofrecemos grupos de iniciación, perfeccionamiento y competición infantil desde 55€/mes.`;
      } else if (lower.includes('torneo') || lower.includes('competic')) {
        reply = `Actualmente tenemos abierta la inscripción para el "I Open Primavera Pádel San Mateo 2026" con 1.800€ en premios y material oficial Bullpadel.`;
      } else {
        reply = `Como asistente contextual de ${currentTenant.name}, puedo ayudarte con cualquier servicio deportivo, reservas y consultas. Todo el sistema está activo en modo demostración con aislamiento multi-tenant.`;
      }

      setAiMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: 'Ahora',
        },
      ]);
      setIsAiThinking(false);
    }, 600);
  };

  // Demo Toast
  const [demoToast, setDemoToast] = useState<DemoNotificationToast | null>(null);

  const triggerDemoToast = (
    title: string,
    description: string,
    type: 'info' | 'success' | 'warning' = 'info'
  ) => {
    setDemoToast({ id: `toast-${Date.now()}`, title, description, type });
  };

  const clearDemoToast = () => setDemoToast(null);

  useEffect(() => {
    if (!demoToast) return;
    const timer = setTimeout(() => {
      setDemoToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [demoToast]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        t,

        searchModalOpen,
        setSearchModalOpen,
        onboardingOpen,
        setOnboardingOpen,

        currentView,
        setCurrentView,
        publicPage,
        setPublicPage,
        selectedArticleId,
        setSelectedArticleId,
        selectedProductId,
        setSelectedProductId,
        adminTab,
        setAdminTab,
        playerTab,
        setPlayerTab,

        tenants,
        currentTenant,
        updateCurrentTenant,
        switchTenant,
        plans,
        updatePlan,

        currentUser,
        switchUserRole,
        isSuperadmin,
        can,

        courts,
        toggleCourtLight,
        updateCourtRate,

  bookings,
  createBooking,
  updateBooking,
  cancelBooking,

        openMatches,
        createOpenMatch,
        joinOpenMatch,

        coaches,
        academyGroups,

        tournaments,
        registerTournamentTeam,

        products,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        couponCode,
        discountPercent,
        applyCoupon,

        favorites,
        toggleFavorite,
        isFavorite,

        blogPosts,
        pageBlocks,
        updatePageBlocks,

        smartDevices,
        toggleSmartRelay,
        generateAccessPin,

        cafeProducts,
        recordCafeSale,

        auditLogs,
        notifications,
        unreadNotificationsCount,
        markNotificationsAsRead,

        aiMessages,
        sendAIMessage,
        isAiThinking,

        demoToast,
        triggerDemoToast,
        clearDemoToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
