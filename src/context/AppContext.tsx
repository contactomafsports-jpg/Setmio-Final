import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  ClubRanking,
  PlayerGroup,
  PlayerGroupConvocatoria,
  Invoice,
  InvoiceItem,
  PlatformSaaSInvoice,
  VerifactuStatus,
  CustomerItem,
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
  INITIAL_RANKINGS,
  INITIAL_PLAYER_GROUPS,
  INITIAL_GROUP_CONVOCATORIAS,
  INITIAL_INVOICES,
  INITIAL_SAAS_INVOICES,
  INITIAL_CUSTOMERS,
} from '../data/initialData';
import { fallbackLng, SupportedLanguage, TRANSLATIONS } from '../lib/i18n';
import { i18n } from '../i18n';
import { LOCALES } from '../locales';
import { checkPermission, PermissionAction, PermissionCheckResult } from '../lib/permissions';

export type MainView = 'public' | 'admin' | 'player' | 'coach' | 'hq';

export type { CustomerItem };

export interface ClubVenue {
  id: string; // 'all' or venue id
  name: string;
  shortName: string;
  city: string;
  address: string;
  courtsCount: number;
  indoorCourts: number;
  outdoorCourts: number;
  occupiedCourtsNow: number;
  revenueToday: number;
  revenueMonth: number;
  isMain?: boolean;
}

export const INITIAL_VENUES: ClubVenue[] = [
  {
    id: 'all',
    name: 'Todas las Sedes (Vista Consolidada)',
    shortName: 'Todas las Sedes',
    city: 'Red Multi-Sede Galicia',
    address: '4 Instalaciones Deportivas Vinculadas',
    courtsCount: 24,
    indoorCourts: 18,
    outdoorCourts: 6,
    occupiedCourtsNow: 17,
    revenueToday: 2480.0,
    revenueMonth: 58240.0,
  },
  {
    id: 'venue-san-mateo',
    name: 'Sede Central · Centro de Pádel San Mateo',
    shortName: 'Sede Narón (Central)',
    city: 'Narón, A Coruña',
    address: 'Pol. Ind. Río do Pozo, Avda. dos Padelistas 14',
    courtsCount: 8,
    indoorCourts: 7,
    outdoorCourts: 1,
    occupiedCourtsNow: 6,
    revenueToday: 1275.5,
    revenueMonth: 19290.0,
    isMain: true,
  },
  {
    id: 'venue-coruna',
    name: 'Sede A Coruña · Matogrande Sport Club',
    shortName: 'Sede A Coruña',
    city: 'A Coruña',
    address: 'Rúa Enrique Mariñas 32, Matogrande',
    courtsCount: 6,
    indoorCourts: 5,
    outdoorCourts: 1,
    occupiedCourtsNow: 5,
    revenueToday: 590.0,
    revenueMonth: 15400.0,
  },
  {
    id: 'venue-santiago',
    name: 'Sede Santiago · Compostela Padel Indoor',
    shortName: 'Sede Santiago',
    city: 'Santiago de Compostela',
    address: 'Vía Edison 12, Polígono del Tambre',
    courtsCount: 4,
    indoorCourts: 4,
    outdoorCourts: 0,
    occupiedCourtsNow: 3,
    revenueToday: 340.0,
    revenueMonth: 11150.0,
  },
  {
    id: 'venue-vigo',
    name: 'Sede Vigo · Setmio Arena Rías Baixas',
    shortName: 'Sede Vigo',
    city: 'Vigo, Pontevedra',
    address: 'Avda. de Madrid 88, Vigo',
    courtsCount: 6,
    indoorCourts: 2,
    outdoorCourts: 4,
    occupiedCourtsNow: 3,
    revenueToday: 274.5,
    revenueMonth: 12400.0,
  },
];

export type PublicPage =
  | 'home'
  | 'features'
  | 'pricing'
  | 'solutions'
  | 'solution_clubs'
  | 'solution_schools'
  | 'solution_coaches'
  | 'solution_players'
  | 'solution_pro_players'
  | 'players_app'
  | 'modules'
  | 'demo'
  | 'player_profile'
  | 'club'
  | 'courts'
  | 'booking'
  | 'matches'
  | 'academy'
  | 'tournaments'
  | 'shop'
  | 'product_detail'
  | 'teams'
  | 'blog'
  | 'article'
  | 'contact'
  | 'legal';

const PUBLIC_ROUTES: Record<string, PublicPage> = {
  '/': 'home',
  '/funcionalidades': 'features',
  '/modulos': 'features',
  '/domotica': 'modules',
  '/modulos-domotica': 'modules',
  '/registro': 'home',
  '/login': 'home',
  '/soluciones': 'solutions',
  '/soluciones/clubes': 'solution_clubs',
  '/soluciones/escuelas': 'solution_schools',
  '/soluciones/profesores': 'solution_coaches',
  '/soluciones/jugadores': 'players_app',
  '/soluciones/jugadores-profesionales': 'solution_pro_players',
  '/jugadores-app': 'players_app',
  '/para-jugadores': 'players_app',
  '/demo': 'demo',
  '/precios': 'pricing',
  '/perfil-jugador': 'player_profile',
  '/club': 'club',
  '/pistas': 'courts',
  '/reservar': 'booking',
  '/partidos': 'matches',
  '/escuela': 'academy',
  '/torneos': 'tournaments',
  '/tienda': 'shop',
  '/producto': 'product_detail',
  '/equipos': 'teams',
  '/blog': 'blog',
  '/contacto': 'contact',
  '/legal': 'legal',
};

const routeForPage: Record<PublicPage, string> = {
  home: '/',
  features: '/modulos',
  solutions: '/soluciones',
  solution_clubs: '/soluciones/clubes',
  solution_schools: '/soluciones/escuelas',
  solution_coaches: '/soluciones/profesores',
  solution_players: '/para-jugadores',
  solution_pro_players: '/soluciones/jugadores-profesionales',
  players_app: '/para-jugadores',
  modules: '/domotica',
  demo: '/demo',
  pricing: '/precios',
  player_profile: '/perfil-jugador',
  club: '/club',
  courts: '/pistas',
  booking: '/reservar',
  matches: '/partidos',
  academy: '/escuela',
  tournaments: '/torneos',
  shop: '/tienda',
  product_detail: '/tienda',
  teams: '/equipos',
  blog: '/blog',
  article: '/blog',
  contact: '/contacto',
  legal: '/legal',
};

const routeForAdminTab: Record<AdminTab, string> = {
  dashboard: '/gestion',
  agenda: '/gestion/reservas',
  courts_management: '/gestion/pistas',
  all_bookings: '/gestion/todas-las-reservas',
  bookings: '/gestion/todas-las-reservas',
  matches: '/gestion/partidas',
  customers: '/gestion/clientes',
  teams: '/gestion/equipos',
  academy: '/gestion/escuela',
  tournaments: '/gestion/torneos',
  shop: '/gestion/tienda',
  smart_courts: '/gestion/pistas-inteligentes',
  pos_cafe: '/gestion/pos',
  web_editor: '/gestion/editor-web',
  domains: '/gestion/dominios',
  subscription: '/gestion/negocio',
  settings: '/gestion/configuracion',
  invoicing: '/gestion/facturacion',
};

const routeForPlayerTab: Record<PlayerTab, string> = {
  dashboard: '/app',
  my_bookings: '/app/reservas',
  my_matches: '/app/partidos',
  my_academy: '/app/escuela',
  statistics: '/app/estadisticas',
  favorites: '/app/favoritos',
  ai_coach: '/app/entrenador',
};

const readRoute = () => {
  if (typeof window === 'undefined') {
    return {
      view: 'public' as MainView,
      page: 'home' as PublicPage,
      admin: 'dashboard' as AdminTab,
      player: 'dashboard' as PlayerTab,
      clubSlug: null as string | null,
      isCorporate: true,
    };
  }

  const hostname = window.location.hostname.toLowerCase();
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  // 1. Detect Subdomain (e.g. sanmateo.setmiofinal2.vercel.app or sanmateo.localhost)
  let detectedSubdomain: string | null = null;
  if (hostname.endsWith('.setmiofinal2.vercel.app')) {
    const sub = hostname.replace('.setmiofinal2.vercel.app', '');
    if (sub && sub !== 'www' && sub !== 'app') detectedSubdomain = sub;
  } else if (hostname.endsWith('.localhost')) {
    const sub = hostname.replace('.localhost', '');
    if (sub && sub !== 'www') detectedSubdomain = sub;
  }

  // 2. Detect Custom Domain (e.g. padelsanmateo.com, padelsanmateo.es)
  let detectedCustomDomainClub: string | null = null;
  if (
    hostname === 'padelsanmateo.com' ||
    hostname === 'www.padelsanmateo.com' ||
    hostname === 'padelsanmateo.es' ||
    hostname === 'www.padelsanmateo.es'
  ) {
    detectedCustomDomainClub = 'sanmateo';
  } else if (hostname === 'padelcoruna.es') {
    detectedCustomDomainClub = 'padelcoruna';
  } else if (hostname === 'martinsanchezpadel.com') {
    detectedCustomDomainClub = 'martinsanchez';
  }

  // 3. Detect Path /p/:slug or /club/:slug
  let pathClubSlug: string | null = null;
  let remainingPath = path;
  if (path.startsWith('/p/')) {
    const parts = path.split('/');
    pathClubSlug = parts[2] || null;
    remainingPath = '/' + parts.slice(3).join('/');
    if (remainingPath === '/') remainingPath = '/';
  } else if (path.startsWith('/club/')) {
    const parts = path.split('/');
    pathClubSlug = parts[2] || null;
    remainingPath = '/' + parts.slice(3).join('/');
    if (remainingPath === '/') remainingPath = '/';
  }

  const activeClubSlug = pathClubSlug || detectedSubdomain || detectedCustomDomainClub;

  // Every public corporate route uses the Setmio layout; only club subdomains, custom domains or /club/:slug use the club layout.
  const isCorporate = !activeClubSlug;

  if (remainingPath === '/hq') {
    return {
      view: 'hq' as MainView,
      page: 'home' as PublicPage,
      admin: 'dashboard' as AdminTab,
      player: 'dashboard' as PlayerTab,
      clubSlug: activeClubSlug,
      isCorporate: false,
    };
  }
  if (
    remainingPath === '/profesor' ||
    remainingPath.startsWith('/profesor/') ||
    remainingPath === '/coach' ||
    remainingPath.startsWith('/coach/')
  ) {
    return {
      view: 'coach' as MainView,
      page: 'home' as PublicPage,
      admin: 'dashboard' as AdminTab,
      player: 'dashboard' as PlayerTab,
      clubSlug: activeClubSlug,
      isCorporate: false,
    };
  }
  if (remainingPath === '/gestion' || remainingPath.startsWith('/gestion/')) {
    const admin = (Object.entries(routeForAdminTab).find(([, route]) => route === remainingPath || remainingPath.startsWith(route))?.[0] || 'dashboard') as AdminTab;
    return {
      view: 'admin' as MainView,
      page: 'home' as PublicPage,
      admin,
      player: 'dashboard' as PlayerTab,
      clubSlug: activeClubSlug,
      isCorporate: false,
    };
  }
  if (remainingPath === '/admin' || remainingPath.startsWith('/admin/')) {
    let admin: AdminTab = 'dashboard';
    if (remainingPath === '/admin/pistas' || remainingPath.startsWith('/admin/pistas/')) {
      admin = 'courts_management';
    } else if (remainingPath === '/admin/domotica' || remainingPath.startsWith('/admin/domotica/')) {
      admin = 'smart_courts';
    } else if (remainingPath === '/admin/reservas/todas' || remainingPath.startsWith('/admin/reservas/todas') || remainingPath === '/gestion/todas-las-reservas') {
      admin = 'all_bookings';
    } else if (remainingPath === '/admin/reservas' || remainingPath.startsWith('/admin/reservas/')) {
      admin = 'agenda';
    } else if (remainingPath === '/admin/facturacion' || remainingPath.startsWith('/admin/facturacion/') || remainingPath === '/admin/invoicing') {
      admin = 'invoicing';
    } else if (remainingPath === '/admin/escuela' || remainingPath.startsWith('/admin/escuela/') || remainingPath === '/admin/academia') {
      admin = 'academy';
    } else if (remainingPath === '/admin/equipos' || remainingPath.startsWith('/admin/equipos/')) {
      admin = 'teams';
    } else if (remainingPath === '/admin/torneos' || remainingPath.startsWith('/admin/torneos/')) {
      admin = 'tournaments';
    } else if (remainingPath === '/admin/clientes' || remainingPath.startsWith('/admin/clientes/') || remainingPath === '/admin/socios' || remainingPath.startsWith('/admin/socios/')) {
      admin = 'customers';
    } else if (remainingPath === '/admin/partidas' || remainingPath.startsWith('/admin/partidas/')) {
      admin = 'matches';
    } else if (remainingPath === '/admin/tienda' || remainingPath.startsWith('/admin/tienda/')) {
      admin = 'shop';
    } else if (remainingPath === '/admin/tpv' || remainingPath.startsWith('/admin/tpv/')) {
      admin = 'pos_cafe';
    } else if (remainingPath === '/admin/ajustes' || remainingPath.startsWith('/admin/ajustes/')) {
      admin = 'settings';
    }
    return {
      view: 'admin' as MainView,
      page: 'home' as PublicPage,
      admin,
      player: 'dashboard' as PlayerTab,
      clubSlug: activeClubSlug,
      isCorporate: false,
    };
  }
  if (
    remainingPath === '/jugadores' ||
    remainingPath.startsWith('/jugadores/') ||
    remainingPath === '/gestion/jugadores' ||
    remainingPath.startsWith('/gestion/jugadores/') ||
    remainingPath === '/socios' ||
    remainingPath.startsWith('/socios/') ||
    remainingPath === '/crm' ||
    remainingPath.startsWith('/crm/') ||
    remainingPath === '/gestion/clientes'
  ) {
    return {
      view: 'admin' as MainView,
      page: 'home' as PublicPage,
      admin: 'customers' as AdminTab,
      player: 'dashboard' as PlayerTab,
      clubSlug: activeClubSlug,
      isCorporate: false,
    };
  }
  if (
    remainingPath === '/facturacion' ||
    remainingPath.startsWith('/facturacion/') ||
    remainingPath === '/gestion/facturacion' ||
    remainingPath.startsWith('/gestion/facturacion/')
  ) {
    return {
      view: 'admin' as MainView,
      page: 'home' as PublicPage,
      admin: 'invoicing' as AdminTab,
      player: 'dashboard' as PlayerTab,
      clubSlug: activeClubSlug,
      isCorporate: false,
    };
  }
  if (remainingPath === '/app' || remainingPath.startsWith('/app/')) {
    const player = (Object.entries(routeForPlayerTab).find(([, route]) => route === remainingPath)?.[0] || 'dashboard') as PlayerTab;
    return {
      view: 'player' as MainView,
      page: 'home' as PublicPage,
      admin: 'dashboard' as AdminTab,
      player,
      clubSlug: activeClubSlug,
      isCorporate: false,
    };
  }

  const page = PUBLIC_ROUTES[remainingPath] || 'home';
  return {
    view: 'public' as MainView,
    page,
    admin: 'dashboard' as AdminTab,
    player: 'dashboard' as PlayerTab,
    clubSlug: activeClubSlug,
    isCorporate,
  };
};

export type AdminTab =
  | 'dashboard'
  | 'agenda'
  | 'courts_management'
  | 'all_bookings'
  | 'bookings'
  | 'matches'
  | 'customers'
  | 'teams'
  | 'academy'
  | 'tournaments'
  | 'shop'
  | 'smart_courts'
  | 'pos_cafe'
  | 'invoicing'
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

export interface PosPendingCharge {
  id: string;
  concept: string;
  amount: number;
  reservationId?: string;
  participantIndex?: number;
  playerName?: string;
  courtName?: string;
  type: 'reservation_full' | 'reservation_split' | 'wallet_topup';
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
  // Theme & i18n (Aislamiento absoluto de temas)
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  corporateTheme: ThemeMode;
  setCorporateTheme: (theme: ThemeMode) => void;
  toggleCorporateTheme: () => void;
  clubTheme: ThemeMode;
  setClubTheme: (theme: ThemeMode) => void;
  toggleClubTheme: () => void;
  adminTheme: ThemeMode;
  setAdminTheme: (theme: ThemeMode) => void;
  toggleAdminTheme: () => void;
  language: SupportedLanguage;
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  i18n: typeof i18n;

  // Search & Onboarding modals
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;

  // Navigation & Views
  isCorporateLanding: boolean;
  setIsCorporateLanding: (isCorporate: boolean) => void;
  navigateToClub: (slug: string) => void;
  navigateToEntityWeb: (slug: string) => void;
  viewEntityWeb: (targetSlugOrType?: string) => void;
  navigateToCorporate: () => void;
  currentView: MainView;
  setCurrentView: (view: MainView) => void;
  publicPage: PublicPage;
  setPublicPage: (page: PublicPage) => void;
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedTeamId: string | null;
  setSelectedTeamId: (id: string | null) => void;
  selectedCourtsForBooking: string[];
  setSelectedCourtsForBooking: (courts: string[]) => void;
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

  // Multi-Sede & Venues
  isMultiVenue: boolean;
  toggleMultiVenueMode: () => void;
  setIsMultiVenueMode: (isMulti: boolean) => void;
  venues: ClubVenue[];
  selectedVenueId: string;
  selectedVenue: ClubVenue;
  setSelectedVenueId: (venueId: string) => void;
  isConsolidatedView: boolean;

  // Auth & Roles & Permissions
  currentUser: UserSession;
  switchUserRole: (role: UserRole) => void;
  logoutOrExitDemo: () => void;
  isSuperadmin: boolean;
  can: (action: PermissionAction) => PermissionCheckResult;

  // Domain Business Data
  isClubOpen: boolean;
  toggleClubOpenState: () => void;
  isWhiteLabelPlayerPreview: boolean;
  setIsWhiteLabelPlayerPreview: (val: boolean) => void;
  enterWhiteLabelPlayerPreview: () => void;
  exitWhiteLabelPlayerPreview: () => void;

  // Main Demo Accounts & Nested Roles
  activeDemoAccount: 'club' | 'academy' | 'coach' | 'pro_athlete' | 'setmio_player' | 'superadmin';
  switchDemoAccount: (
    demoId: 'club' | 'academy' | 'coach' | 'pro_athlete' | 'setmio_player' | 'superadmin',
    subRole?: string
  ) => void;

  courts: Court[];
  addCourt: (courtData: Omit<Court, 'id' | 'tenantId'>) => Court;
  updateCourt: (courtId: string, updates: Partial<Court>) => void;
  deleteCourt: (courtId: string) => void;
  toggleCourtLight: (courtId: string) => void;
  openCourtDoor: (courtId: string) => void;
  toggleDeviceOnline: (courtId: string) => void;
  updateCourtRate: (courtId: string, rate: number) => void;

  bookings: Booking[];
  createBooking: (newBooking: Omit<Booking, 'id' | 'tenantId'>) => Booking;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  cancelBooking: (bookingId: string) => void;
  deleteBooking: (bookingId: string) => void;
  markBookingPaid: (bookingId: string, participantName?: string) => void;
  posPendingCharge: PosPendingCharge | null;
  setPosPendingCharge: (charge: PosPendingCharge | null) => void;

  openMatches: OpenMatch[];
  createOpenMatch: (match: Omit<OpenMatch, 'id' | 'tenantId'>) => void;
  updateOpenMatch: (matchId: string, updates: Partial<OpenMatch>) => void;
  deleteOpenMatch: (matchId: string) => void;
  joinOpenMatch: (matchId: string, player: { name: string; level: number; position: 'drive' | 'reves' | 'both' }) => void;
  leaveOpenMatch: (matchId: string, playerName: string) => void;

  coaches: Coach[];
  academyGroups: AcademyGroup[];

  tournaments: Tournament[];
  createTournament: (tournament: Omit<Tournament, 'id' | 'tenantId'>) => Tournament;
  updateTournament: (tournamentId: string, updates: Partial<Tournament>) => void;
  registerTournamentTeam: (tournamentId: string, categoryName: string, teamName: string) => void;

  rankings: ClubRanking[];
  createRanking: (ranking: Omit<ClubRanking, 'id' | 'tenantId'>) => void;
  updateRanking: (id: string, updates: Partial<ClubRanking>) => void;
  linkTournamentToRanking: (rankingId: string, tournamentId: string) => void;

  playerGroups: PlayerGroup[];
  createPlayerGroup: (group: Omit<PlayerGroup, 'id' | 'tenantId' | 'createdAt'>) => void;
  updatePlayerGroup: (groupId: string, data: Partial<PlayerGroup>) => void;
  deletePlayerGroup: (groupId: string) => void;
  groupConvocatorias: PlayerGroupConvocatoria[];
  sendGroupConvocatoria: (convocatoria: Omit<PlayerGroupConvocatoria, 'id' | 'tenantId' | 'sentAt'>) => void;

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
  addCafeProduct: (product: Omit<CafeProduct, 'id'>) => void;
  updateCafeProduct: (id: string, updates: Partial<CafeProduct>) => void;
  deleteCafeProduct: (id: string) => void;
  recordCafeSale: (product: CafeProduct, qty: number) => void;

  auditLogs: AuditLogItem[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationsAsRead: () => void;
  sendNotification: (notif: { title: string; message: string; type?: NotificationItem['type']; actionUrl?: string }) => void;

  // CRM Player Profile & Customers Database
  customers: CustomerItem[];
  addCustomer: (customer: Omit<CustomerItem, 'id' | 'memberNum' | 'matches' | 'balance' | 'level'> & { balance?: number; isMember?: boolean; level?: number }) => CustomerItem;
  updateCustomer: (id: string, updates: Partial<CustomerItem>) => void;
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  playerOriginTab: AdminTab | null;
  setPlayerOriginTab: (tab: AdminTab | null) => void;
  navigateToPlayerProfile: (playerNameOrId: string, originTab?: AdminTab) => void;

  // AI Assistant Chat
  aiMessages: AIMessage[];
  sendAIMessage: (text: string) => void;
  isAiThinking: boolean;

  // Facturación, Pagos y Veri*factu
  invoices: Invoice[];
  syncInvoiceVerifactu: (invoiceId: string) => void;
  syncAllVerifactu: () => void;
  createInvoice: (invoice: Partial<Invoice>) => Invoice;
  markInvoicePaid: (invoiceId: string) => void;
  createRectificativeInvoice: (originalInvoiceId: string, reason: string) => Invoice;
  saasInvoices: PlatformSaaSInvoice[];
  syncSaasInvoiceVerifactu: (invoiceId: string) => void;

  // Demo Toast helper
  demoToast: DemoNotificationToast | null;
  triggerDemoToast: (title: string, description: string, type?: 'info' | 'success' | 'warning') => void;
  clearDemoToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function readDemoState<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function saveDemoState<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Keep the in-memory demo usable if browser storage is unavailable.
  }
}

// Initial demo profiles for role switching
const ROLE_PROFILES: Record<UserRole, UserSession> = {
  SUPERADMIN: {
    id: 'user-superadmin-01',
    name: 'Superadministrador Setmio HQ',
    email: 'contactomafsports@gmail.com',
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
  // Demo Toast (Declared early so all hooks/handlers can reference it)
  const [demoToast, setDemoToast] = useState<DemoNotificationToast | null>(null);

  const triggerDemoToast = useCallback((
    title: string,
    description: string,
    type: 'info' | 'success' | 'warning' = 'info'
  ) => {
    setDemoToast({ id: `toast-${Date.now()}`, title, description, type });
  }, []);

  const clearDemoToast = useCallback(() => setDemoToast(null), []);

  useEffect(() => {
    if (!demoToast) return;
    const timer = setTimeout(() => {
      setDemoToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [demoToast]);

  // --- AISLAMIENTO ABSOLUTO DE TEMAS ---
  // 1. Tema de la Web Pública de Setmio (SaaS Corporativo)
  const [corporateTheme, setCorporateThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('setmio_corporate_theme') as ThemeMode;
      return saved || 'light';
    } catch {
      return 'light';
    }
  });

  const setCorporateTheme = useCallback((mode: ThemeMode) => {
    setCorporateThemeState(mode);
    try {
      localStorage.setItem('setmio_corporate_theme', mode);
    } catch {
      // Ignore
    }
  }, []);

  const toggleCorporateTheme = useCallback(() => {
    setCorporateThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('setmio_corporate_theme', next);
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  // 2. Tema de la Web Pública del Club / Profesional y App Marca Blanca
  const [clubTheme, setClubThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('setmio_club_theme') as ThemeMode;
      return saved || 'light';
    } catch {
      return 'light';
    }
  });

  const setClubTheme = useCallback((mode: ThemeMode) => {
    setClubThemeState(mode);
    try {
      localStorage.setItem('setmio_club_theme', mode);
    } catch {
      // Ignore
    }
  }, []);

  const toggleClubTheme = useCallback(() => {
    setClubThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('setmio_club_theme', next);
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  // 3. Tema del Panel Admin / HQ (Predeterminado: Light Mode)
  const [adminTheme, setAdminThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('setmio_admin_theme') as ThemeMode;
      return saved || 'light';
    } catch {
      return 'light';
    }
  });

  const setAdminTheme = useCallback((mode: ThemeMode) => {
    setAdminThemeState(mode);
    try {
      localStorage.setItem('setmio_admin_theme', mode);
    } catch {
      // Ignore
    }
  }, []);

  const toggleAdminTheme = useCallback(() => {
    setAdminThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('setmio_admin_theme', next);
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  // Language state synchronized with i18n
  const normalizeSupportedLanguage = (code?: string | null): SupportedLanguage | null => {
    if (!code) return null;
    const clean = code.split('-')[0].trim().toLowerCase() as SupportedLanguage;
    const valid: SupportedLanguage[] = ['es', 'en', 'gl', 'ca', 'va', 'eu', 'ar', 'pt', 'fr', 'de', 'it'];
    return valid.includes(clean) ? clean : null;
  };

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = normalizeSupportedLanguage(localStorage.getItem('setmio_lang'));
      if (saved) return saved;
    } catch {
      // Ignore
    }
    return 'es';
  });

  const setLanguage = useCallback((lang: SupportedLanguage | string) => {
    const valid = normalizeSupportedLanguage(lang) || 'es';
    setLanguageState(valid);
    try {
      localStorage.setItem('setmio_lang', valid);
    } catch {
      // Ignore
    }
    if (i18n && typeof i18n.changeLanguage === 'function' && i18n.language !== valid) {
      i18n.changeLanguage(valid);
    }
  }, []);

  // Listen to external i18n language changes (e.g. i18n.changeLanguage or useTranslation)
  useEffect(() => {
    if (!i18n || typeof i18n.on !== 'function') return;
    const handleLanguageChanged = (newLng: string) => {
      const norm = normalizeSupportedLanguage(newLng);
      if (norm && norm !== language) {
        setLanguageState(norm);
        try {
          localStorage.setItem('setmio_lang', norm);
        } catch {
          // Ignore
        }
      }
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    if (i18n && typeof i18n.changeLanguage === 'function' && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  const t = useCallback((key: string, fallback?: string): string => {
    // 1. Check canonical LOCALES dictionary for current language
    const localVal = LOCALES[language as keyof typeof LOCALES]?.[key];
    if (localVal) return localVal;

    // 2. Check react-i18next instance
    if (i18n && i18n.isInitialized) {
      const i18nVal = i18n.t(key, { lng: language, defaultValue: '' });
      if (i18nVal && i18nVal !== key) {
        return i18nVal;
      }
    }

    // 3. Check legacy TRANSLATIONS dictionary
    const localizedValue = TRANSLATIONS[language]?.[key];
    if (localizedValue) return localizedValue;

    // 4. Fallback to English
    for (const fallbackLanguage of fallbackLng) {
      const fallbackValue = LOCALES[fallbackLanguage as keyof typeof LOCALES]?.[key] || TRANSLATIONS[fallbackLanguage]?.[key];
      if (fallbackValue) return fallbackValue;
    }

    return fallback || key;
  }, [language]);

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // Navigation
  const initialRoute = readRoute();
  const [isCorporateLanding, setIsCorporateLanding] = useState<boolean>(initialRoute.isCorporate);
  const [currentView, setCurrentViewState] = useState<MainView>(initialRoute.view);
  const [publicPage, setPublicPageState] = useState<PublicPage>(initialRoute.page);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedCourtsForBooking, setSelectedCourtsForBooking] = useState<string[]>([]);
  const [adminTab, setAdminTabState] = useState<AdminTab>(initialRoute.admin);
  const [playerTab, setPlayerTabState] = useState<PlayerTab>(initialRoute.player);

  const setCurrentView = useCallback((view: MainView) => {
    if (view !== 'public') {
      setIsCorporateLanding(false);
    }
    setCurrentViewState(view);
  }, []);
  const setPublicPage = useCallback((page: PublicPage) => setPublicPageState(page), []);
  const setAdminTab = useCallback((tab: AdminTab) => setAdminTabState(tab), []);
  const setPlayerTab = useCallback((tab: PlayerTab) => setPlayerTabState(tab), []);

  // Multi-tenant & Plans
  const [tenants, setTenants] = useState<Tenant[]>(() =>
    readDemoState('setmio_demo_tenants_v1', [INITIAL_TENANT, ...ADDITIONAL_DEMO_TENANTS])
  );
  useEffect(() => saveDemoState('setmio_demo_tenants_v1', tenants), [tenants]);

  const [currentTenantId, setCurrentTenantId] = useState<string>(() => {
    if (initialRoute.clubSlug) {
      const match = [INITIAL_TENANT, ...ADDITIONAL_DEMO_TENANTS].find((t) => t.slug === initialRoute.clubSlug);
      if (match) return match.id;
    }
    return 'tenant-san-mateo-01';
  });

  const currentTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  // --- CONDICIONALIDAD DINÁMICA: SINGLE-SEDE VS MULTI-SEDE ---
  const [isMultiVenueOverride, setIsMultiVenueOverride] = useState<boolean | null>(() => {
    try {
      const stored = localStorage.getItem('setmio_is_multivenue_mode');
      return stored !== null ? stored === 'true' : null;
    } catch {
      return null;
    }
  });

  // Evalúa si el club cuenta con suscripción multi-sede (Plan Enterprise / Pro) o gestiona más de una sede
  const isMultiVenue = isMultiVenueOverride !== null
    ? isMultiVenueOverride
    : (currentTenant.settings?.isMultiVenue ?? (currentTenant.planId === 'elite' || currentTenant.planId === 'pro'));

  const setIsMultiVenueMode = useCallback((val: boolean) => {
    setIsMultiVenueOverride(val);
    try {
      localStorage.setItem('setmio_is_multivenue_mode', String(val));
    } catch {
      // Ignore
    }
  }, []);

  const toggleMultiVenueMode = useCallback(() => {
    setIsMultiVenueOverride((prev) => {
      const current = prev !== null ? prev : isMultiVenue;
      const next = !current;
      try {
        localStorage.setItem('setmio_is_multivenue_mode', String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, [isMultiVenue]);

  // Si es Monosede, sólo existe la sede única (Central); si es Multi-Sede, existen todas las sedes
  const venues = isMultiVenue ? INITIAL_VENUES : [INITIAL_VENUES[1]];

  const [selectedVenueId, setSelectedVenueIdState] = useState<string>(() => {
    try {
      return localStorage.getItem('setmio_selected_venue_id') || 'all';
    } catch {
      return 'all';
    }
  });

  const setSelectedVenueId = useCallback((venueId: string) => {
    setSelectedVenueIdState(venueId);
    try {
      localStorage.setItem('setmio_selected_venue_id', venueId);
    } catch {
      // Ignore
    }
  }, []);

  const effectiveSelectedVenueId = isMultiVenue ? selectedVenueId : INITIAL_VENUES[1].id;
  const selectedVenue = isMultiVenue
    ? (INITIAL_VENUES.find((v) => v.id === effectiveSelectedVenueId) || INITIAL_VENUES[0])
    : INITIAL_VENUES[1];
  const isConsolidatedView = isMultiVenue && effectiveSelectedVenueId === 'all';

  // --- AISLAMIENTO DE TEMA SEGÚN ENTORNO ---
  const theme: ThemeMode =
    currentView === 'admin' || currentView === 'hq'
      ? adminTheme
      : isCorporateLanding
      ? corporateTheme
      : clubTheme;

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      if (currentView === 'admin' || currentView === 'hq') {
        setAdminTheme(mode);
        return;
      }
      if (isCorporateLanding) {
        setCorporateTheme(mode);
      } else {
        setClubTheme(mode);
      }
    },
    [currentView, isCorporateLanding, setAdminTheme, setCorporateTheme, setClubTheme]
  );

  const toggleTheme = useCallback(() => {
    if (currentView === 'admin' || currentView === 'hq') {
      toggleAdminTheme();
      return;
    }
    if (isCorporateLanding) {
      toggleCorporateTheme();
    } else {
      toggleClubTheme();
    }
  }, [currentView, isCorporateLanding, toggleAdminTheme, toggleCorporateTheme, toggleClubTheme]);

  // Sincronización del DOM con el tema activo del entorno
  useEffect(() => {
    const root = document.documentElement;

    const activeMode =
      currentView === 'admin' || currentView === 'hq'
        ? adminTheme
        : isCorporateLanding
        ? corporateTheme
        : clubTheme;

    if (activeMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (activeMode === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    }
  }, [currentView, isCorporateLanding, adminTheme, corporateTheme, clubTheme]);

  useEffect(() => {
    const root = document.documentElement;
    const branding = currentTenant?.branding;
    if (isCorporateLanding || !branding) {
      root.style.removeProperty('--club-primary');
      root.style.removeProperty('--club-secondary');
      root.style.removeProperty('--club-accent');
      return;
    }
    root.style.setProperty('--club-primary', branding.primaryColor);
    root.style.setProperty('--club-secondary', branding.secondaryColor);
    root.style.setProperty('--club-accent', branding.accentColor);
    return () => {
      root.style.removeProperty('--club-primary');
      root.style.removeProperty('--club-secondary');
      root.style.removeProperty('--club-accent');
    };
  }, [currentTenant, isCorporateLanding]);

  const navigateToEntityWeb = (slug: string) => {
    setIsCorporateLanding(false);
    const target = tenants.find((t) => t.slug === slug || t.id === slug);
    if (target) {
      setCurrentTenantId(target.id);
    }
    setCurrentViewState('public');
    setPublicPageState('home');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/p/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToClub = (slug: string) => {
    navigateToEntityWeb(slug);
  };

  const viewEntityWeb = (targetSlugOrType?: string) => {
    if (targetSlugOrType) {
      const match = tenants.find(
        (t) =>
          t.slug === targetSlugOrType ||
          t.id === targetSlugOrType ||
          t.type.toLowerCase() === targetSlugOrType.toLowerCase()
      );
      if (match) {
        navigateToEntityWeb(match.slug);
        return;
      }
    }

    // Dynamic redirection based on active role/entity:
    // 1. Profesor Independiente -> Landing personal del profesor (/p/varelacoach)
    if (currentView === 'coach' || currentUser.role === 'COACH' || currentTenant.type === 'COACH') {
      const coachTenant = tenants.find((t) => t.type === 'COACH') || currentTenant;
      navigateToEntityWeb(coachTenant.slug);
      return;
    }

    // 2. Escuela / Academia -> Página pública propia de la academia (/p/academiaelite)
    if (currentUser.role === 'ACADEMY_MANAGER' || currentTenant.type === 'ACADEMY') {
      const academyTenant = tenants.find((t) => t.type === 'ACADEMY') || currentTenant;
      navigateToEntityWeb(academyTenant.slug);
      return;
    }

    // 3. Jugador Profesional -> Portfolio público del jugador (/p/martinsanchez)
    if (currentUser.role === 'PROFESSIONAL_PLAYER' || currentTenant.type === 'PRO_PLAYER') {
      const proTenant = tenants.find((t) => t.type === 'PRO_PLAYER') || currentTenant;
      navigateToEntityWeb(proTenant.slug);
      return;
    }

    // 4. Club de Pádel -> Web pública del club activo
    const clubTenant =
      tenants.find((t) => t.id === currentTenant.id && t.type === 'PADEL_CLUB') ||
      tenants.find((t) => t.type === 'PADEL_CLUB') ||
      currentTenant;
    navigateToEntityWeb(clubTenant.slug);
  };

  const navigateToCorporate = () => {
    setIsCorporateLanding(true);
    setCurrentViewState('public');
    setPublicPageState('home');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const onPopState = () => {
      const route = readRoute();
      setIsCorporateLanding(route.isCorporate);
      setCurrentViewState(route.view);
      setPublicPageState(route.page);
      setAdminTabState(route.admin);
      setPlayerTabState(route.player);
      if (route.clubSlug) {
        const target = tenants.find((t) => t.slug === route.clubSlug);
        if (target) setCurrentTenantId(target.id);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [tenants]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isCorporateLanding) {
      const corporatePath = routeForPage[publicPage];
      if (
        window.location.pathname !== '/registro' &&
        window.location.pathname !== '/login' &&
        window.location.pathname !== corporatePath &&
        !window.location.pathname.startsWith('/club/') &&
        !window.location.pathname.startsWith('/p/')
      ) {
        window.history.pushState({}, '', corporatePath);
      }
      return;
    }
    const currentPath = window.location.pathname;
    const isPRoute = currentPath.startsWith('/p/');
    const prefix = isPRoute ? `/p/${currentTenant.slug}` : `/club/${currentTenant.slug}`;
    const path = currentView === 'admin'
      ? `${prefix}${routeForAdminTab[adminTab]}`
      : currentView === 'player'
        ? `${prefix}${routeForPlayerTab[playerTab]}`
        : currentView === 'coach'
          ? `${prefix}/profesor`
          : currentView === 'hq'
            ? `${prefix}/hq`
            : publicPage === 'home'
              ? prefix
              : `${prefix}${routeForPage[publicPage]}`;
    const nextUrl = `${path}${window.location.search}${window.location.hash}`;
    if (window.location.pathname !== path) window.history.pushState({}, '', nextUrl);
  }, [isCorporateLanding, currentTenant.slug, currentView, publicPage, adminTab, playerTab]);

  useEffect(() => {
    const root = document.documentElement;
    const { primaryColor, secondaryColor, accentColor } = currentTenant.branding;
    root.style.setProperty('--color-primary', primaryColor || '#185c43');
    root.style.setProperty('--color-secondary', secondaryColor || '#10221d');
    root.style.setProperty('--color-accent', accentColor || '#c7f36b');
    root.style.setProperty('--color-background', '#f5f6f1');
    root.style.setProperty('--color-foreground', secondaryColor || '#10221d');
  }, [currentTenant.branding]);

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
  const [currentUser, setCurrentUser] = useState<UserSession>(
    initialRoute.view === 'player' ? ROLE_PROFILES.PLAYER : ROLE_PROFILES.TENANT_OWNER
  );

  const switchUserRole = (role: UserRole) => {
    const profile = ROLE_PROFILES[role] || ROLE_PROFILES.PLAYER;
    setCurrentUser(profile);
    setIsCorporateLanding(false);

    // Auto navigate to relevant view based on role
    if (role === 'SUPERADMIN') {
      setCurrentViewState('hq');
    } else if (role === 'PLAYER' || role === 'PARENT_OR_GUARDIAN') {
      setCurrentViewState('player');
    } else if (role === 'COACH') {
      setCurrentViewState('coach');
    } else if (role === 'PROFESSIONAL_PLAYER') {
      const proTenant = tenants.find((t) => t.type === 'PRO_PLAYER') || tenants.find((t) => t.id === 'tenant-martin-pro');
      if (proTenant) {
        setCurrentTenantId(proTenant.id);
      }
      setCurrentViewState('admin');
    } else {
      setCurrentViewState('admin');
    }

    triggerDemoToast(
      `Perfil Activo: ${role}`,
      `Sesión cambiada a ${profile.name} con permisos contextuales.`,
      'info'
    );
  };

  const logoutOrExitDemo = () => {
    setCurrentUser(ROLE_PROFILES.PLAYER);
    setCurrentViewState('public');
    setPublicPage('home');
    setIsCorporateLanding(true);
    setCart([]);
    setSelectedCourtsForBooking([]);
    triggerDemoToast(
      t('auth.sessionClosed', 'Sesión Cerrada'),
      t('auth.exitDemoNotice', 'Has salido del modo demostración o sesión activa hacia la portada pública.'),
      'info'
    );
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
  const [courts, setCourts] = useState<Court[]>(() => readDemoState('setmio_demo_courts_v1', INITIAL_COURTS));
  const [bookings, setBookings] = useState<Booking[]>(() => readDemoState('setmio_demo_bookings_v1', INITIAL_BOOKINGS));
  const [openMatches, setOpenMatches] = useState<OpenMatch[]>(() => readDemoState('setmio_demo_matches_v1', INITIAL_OPEN_MATCHES));
  const [coaches] = useState<Coach[]>(INITIAL_COACHES);
  const [academyGroups] = useState<AcademyGroup[]>(INITIAL_ACADEMY_GROUPS);
  const [tournaments, setTournaments] = useState<Tournament[]>(() => readDemoState('setmio_demo_tournaments_v1', INITIAL_TOURNAMENTS));
  const [rankings, setRankings] = useState<ClubRanking[]>(() => readDemoState('setmio_demo_rankings_v1', INITIAL_RANKINGS));
  const [playerGroups, setPlayerGroups] = useState<PlayerGroup[]>(() => readDemoState('setmio_demo_player_groups_v1', INITIAL_PLAYER_GROUPS));
  const [groupConvocatorias, setGroupConvocatorias] = useState<PlayerGroupConvocatoria[]>(() => readDemoState('setmio_demo_group_convocatorias_v1', INITIAL_GROUP_CONVOCATORIAS));
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [blogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [pageBlocks, setPageBlocks] = useState<PageBlock[]>(() => readDemoState('setmio_demo_page_blocks_v1', INITIAL_PAGE_BLOCKS));
  const [smartDevices, setSmartDevices] = useState<SmartCourtDevice[]>(INITIAL_SMART_DEVICES);
  const [cafeProducts, setCafeProducts] = useState<CafeProduct[]>(INITIAL_CAFE_PRODUCTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // E-commerce Cart
  const [cart, setCart] = useState<CartItem[]>(() => readDemoState('setmio_demo_cart_v1', []));
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
  const [favorites, setFavorites] = useState<string[]>(() => readDemoState('setmio_demo_favorites_v1', ['prod-1', 'court-1', 'coach-1', 't-2026-01']));
  useEffect(() => {
    saveDemoState('setmio_demo_courts_v1', courts);
    saveDemoState('setmio_demo_bookings_v1', bookings);
    saveDemoState('setmio_demo_matches_v1', openMatches);
    saveDemoState('setmio_demo_tournaments_v1', tournaments);
    saveDemoState('setmio_demo_rankings_v1', rankings);
    saveDemoState('setmio_demo_page_blocks_v1', pageBlocks);
    saveDemoState('setmio_demo_cart_v1', cart);
    saveDemoState('setmio_demo_favorites_v1', favorites);
  }, [courts, bookings, openMatches, tournaments, rankings, pageBlocks, cart, favorites]);

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

  // Club Status & White Label Switcher
  const [isClubOpen, setIsClubOpen] = useState(true);
  const toggleClubOpenState = () => {
    setIsClubOpen((prev) => {
      const next = !prev;
      triggerDemoToast(
        t('club.status.toggle', 'Estado del Club'),
        next ? t('club.status.open_desc', 'Instalaciones abiertas y reservas en marcha.') : t('club.status.closed_desc', 'Club cerrado temporalmente. Solo acceso personal de mantenimiento.'),
        next ? 'success' : 'warning'
      );
      return next;
    });
  };

  const [isWhiteLabelPlayerPreview, setIsWhiteLabelPlayerPreview] = useState(false);
  const enterWhiteLabelPlayerPreview = () => {
    setIsWhiteLabelPlayerPreview(true);
    setCurrentUser(ROLE_PROFILES.PLAYER);
    setCurrentViewState('player');
    triggerDemoToast(
      t('white_label.player_view', 'Vista Jugador'),
      `Cargando la app del socio con la agenda, pistas y catálogo de ${currentTenant.name}`,
      'info'
    );
  };

  const exitWhiteLabelPlayerPreview = () => {
    setIsWhiteLabelPlayerPreview(false);
    setCurrentUser(ROLE_PROFILES.TENANT_OWNER);
    setCurrentViewState('admin');
    triggerDemoToast(
      `Gestión de ${currentTenant.shortName}`,
      `Has vuelto al panel de administración de ${currentTenant.name}.`,
      'info'
    );
  };

  // Main Demo Accounts & Nested Roles
  const activeDemoAccount: 'club' | 'academy' | 'coach' | 'pro_athlete' | 'setmio_player' | 'superadmin' =
    currentUser.role === 'SUPERADMIN' || currentView === 'hq'
      ? 'superadmin'
      : currentTenant.type === 'PRO_PLAYER' || currentUser.role === 'PROFESSIONAL_PLAYER'
      ? 'pro_athlete'
      : currentTenant.type === 'ACADEMY'
      ? 'academy'
      : currentTenant.type === 'COACH'
      ? 'coach'
      : currentView === 'player' && !isWhiteLabelPlayerPreview
      ? 'setmio_player'
      : 'club';

  const switchDemoAccount = useCallback(
    (
      demoId: 'club' | 'academy' | 'coach' | 'pro_athlete' | 'setmio_player' | 'superadmin',
      subRole?: string
    ) => {
      setIsCorporateLanding(false);

      if (demoId === 'club') {
        const clubTenant =
          tenants.find((t) => t.id === 'tenant-san-mateo-01') ||
          tenants.find((t) => t.type === 'PADEL_CLUB') ||
          tenants[0];
        if (clubTenant) setCurrentTenantId(clubTenant.id);

        if (subRole === 'player' || subRole === 'jugador') {
          setIsWhiteLabelPlayerPreview(true);
          setCurrentUser(ROLE_PROFILES.PLAYER);
          setCurrentViewState('player');
          triggerDemoToast('Demo Club · Jugador Club', 'Vista de la app con la marca blanca oficial de San Mateo.', 'info');
        } else if (subRole === 'coach' || subRole === 'profesor') {
          setIsWhiteLabelPlayerPreview(false);
          setCurrentUser(ROLE_PROFILES.COACH);
          setCurrentViewState('coach');
          triggerDemoToast('Demo Club · Profesor', 'Portal de entrenador con cuadrante y clases de San Mateo.', 'info');
        } else if (subRole === 'reception' || subRole === 'recepcion') {
          setIsWhiteLabelPlayerPreview(false);
          setCurrentUser(ROLE_PROFILES.RECEPTION);
          setCurrentViewState('admin');
          triggerDemoToast('Demo Club · Recepción', 'Panel de mostrador y control de accesos con marca blanca de San Mateo.', 'info');
        } else {
          // Default: Administrador Club
          setIsWhiteLabelPlayerPreview(false);
          setCurrentUser(ROLE_PROFILES.TENANT_OWNER);
          setCurrentViewState('admin');
          triggerDemoToast('Demo Club · Administrador Club', 'Panel de gestión global con branding oficial Setmio Pro.', 'success');
        }
      } else if (demoId === 'academy') {
        const acadTenant =
          tenants.find((t) => t.id === 'tenant-academia-elite') ||
          tenants.find((t) => t.type === 'ACADEMY') ||
          currentTenant;
        if (acadTenant) setCurrentTenantId(acadTenant.id);

        if (subRole === 'student' || subRole === 'alumno' || subRole === 'player') {
          setIsWhiteLabelPlayerPreview(true);
          setCurrentUser(ROLE_PROFILES.PLAYER);
          setCurrentViewState('player');
          triggerDemoToast('Demo Academia · Vista Alumno', 'App del alumno con la marca blanca de Academia Pádel Élite.', 'info');
        } else {
          // Default: Administrador Escuela
          setIsWhiteLabelPlayerPreview(false);
          setCurrentUser(ROLE_PROFILES.ACADEMY_MANAGER);
          setCurrentViewState('admin');
          triggerDemoToast('Demo Academia · Administrador Escuela', 'Gestión de profesores, cursos y matrículas con Setmio Pro.', 'success');
        }
      } else if (demoId === 'coach') {
        const coachTenant =
          tenants.find((t) => t.id === 'tenant-varela-coach') ||
          tenants.find((t) => t.type === 'COACH') ||
          currentTenant;
        if (coachTenant) setCurrentTenantId(coachTenant.id);

        if (subRole === 'student' || subRole === 'alumno') {
          setIsWhiteLabelPlayerPreview(true);
          setCurrentUser(ROLE_PROFILES.PLAYER);
          setCurrentViewState('player');
          triggerDemoToast('Demo Profesor · Vista Alumno', 'App del alumno con la marca personalizada del profesor Carlos Varela.', 'info');
        } else if (subRole === 'player' || subRole === 'jugador') {
          setIsWhiteLabelPlayerPreview(false);
          setCurrentUser(ROLE_PROFILES.PLAYER);
          setCurrentViewState('player');
          triggerDemoToast('Demo Profesor · Vista Jugador', 'Perfil de jugador propio del profesor para reservas y torneos.', 'info');
        } else {
          // Default: Panel Profesor Independiente
          setIsWhiteLabelPlayerPreview(false);
          setCurrentUser(ROLE_PROFILES.COACH);
          setCurrentViewState('coach');
          triggerDemoToast('Demo Profesor Independiente', 'Gestión personal de bonos y clases privadas con Setmio Pro.', 'success');
        }
      } else if (demoId === 'pro_athlete') {
        const proTenant =
          tenants.find((t) => t.id === 'tenant-martin-pro') ||
          tenants.find((t) => t.type === 'PRO_PLAYER') ||
          currentTenant;
        if (proTenant) setCurrentTenantId(proTenant.id);

        setIsWhiteLabelPlayerPreview(false);
        setCurrentUser(ROLE_PROFILES.PROFESSIONAL_PLAYER);
        setCurrentViewState('admin');
        triggerDemoToast('Demo Atleta Profesional', 'Gestión de sponsors, torneos FIP y rendimiento con Setmio Pro.', 'success');
      } else if (demoId === 'setmio_player') {
        const clubTenant = tenants.find((t) => t.id === 'tenant-san-mateo-01') || tenants[0];
        if (clubTenant) setCurrentTenantId(clubTenant.id);

        setIsWhiteLabelPlayerPreview(false);
        setCurrentUser(ROLE_PROFILES.PLAYER);
        setCurrentViewState('player');
        triggerDemoToast('Demo Setmio Player', 'App neutra B2C para jugador amateur (reserva multiclub, ELO y partidos).', 'success');
      } else if (demoId === 'superadmin') {
        setIsWhiteLabelPlayerPreview(false);
        setCurrentUser(ROLE_PROFILES.SUPERADMIN);
        setCurrentViewState('hq');
        triggerDemoToast('Demo Superadministrador Setmio HQ', 'Sesión vinculada a contactomafsports@gmail.com.', 'success');
      }
    },
    [tenants, currentTenant, triggerDemoToast]
  );

  // Helper for guaranteed collision-free unique IDs across rapid or batch actions
  const generateUniqueId = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  // Court Actions
  const addCourt = (courtData: Omit<Court, 'id' | 'tenantId'>): Court => {
    const newCourt: Court = {
      ...courtData,
      id: generateUniqueId('court'),
      tenantId: currentTenant.id,
      accessPin: courtData.accessPin || `${Math.floor(1000 + Math.random() * 9000)}#`,
    };
    setCourts((prev) => {
      const updated = [...prev, newCourt];
      saveDemoState('setmio_demo_courts_v1', updated);
      return updated;
    });
    return newCourt;
  };

  const updateCourt = (courtId: string, updates: Partial<Court>) => {
    setCourts((prev) => {
      const updated = prev.map((c) => (c.id === courtId ? { ...c, ...updates } : c));
      saveDemoState('setmio_demo_courts_v1', updated);
      return updated;
    });
  };

  const deleteCourt = (courtId: string) => {
    setCourts((prev) => {
      const updated = prev.filter((c) => c.id !== courtId);
      saveDemoState('setmio_demo_courts_v1', updated);
      return updated;
    });
  };

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
        id: generateUniqueId('log'),
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

  const openCourtDoor = (courtId: string) => {
    const targetCourt = courts.find((c) => c.id === courtId);
    const pin = targetCourt?.accessPin || `${Math.floor(1000 + Math.random() * 9000)}#`;
    setCourts((prev) =>
      prev.map((c) => (c.id === courtId ? { ...c, isDoorOpen: true } : c))
    );
    setAuditLogs((prev) => [
      {
        id: generateUniqueId('log'),
        timestamp: 'Ahora mismo',
        actor: currentUser.email,
        role: currentUser.role,
        action: 'Apertura de Torno/Puerta IoT',
        target: targetCourt?.name || courtId,
        details: `Apertura de acceso remoto ejecutada con PIN ${pin}. Puerta desbloqueada por sensor.`,
      },
      ...prev,
    ]);
    triggerDemoToast(
      t('iot.door_unlocked', 'Acceso Desbloqueado'),
      `${targetCourt?.name || 'Pista'}: Torno y puerta de acceso abiertos. PIN temporal: ${pin}`,
      'success'
    );
    setTimeout(() => {
      setCourts((prev) =>
        prev.map((c) => (c.id === courtId ? { ...c, isDoorOpen: false } : c))
      );
    }, 6000);
  };

  const toggleDeviceOnline = (courtId: string) => {
    setCourts((prev) =>
      prev.map((c) => (c.id === courtId ? { ...c, isDeviceOnline: c.isDeviceOnline === false } : c))
    );
    const targetCourt = courts.find((c) => c.id === courtId);
    const nextStatus = targetCourt?.isDeviceOnline === false;
    triggerDemoToast(
      'Dispositivo IoT ' + (targetCourt?.name || ''),
      `Telemetría IoT de ${targetCourt?.name || 'pista'} cambiada a ${nextStatus ? 'ONLINE' : 'OFFLINE'}.`,
      nextStatus ? 'success' : 'warning'
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

    // Regla de Precios (Tarea 3):
    // Las reservas generadas a través de clases, grupos o torneos deben registrarse a 0€ en pista
    // salvo que se trate de una clase suelta de pago individual.
    const isFromActivityOrTournament =
      newBookingData.category === 'tournament' ||
      (newBookingData.category === 'academy' && !newBookingData.notes?.toLowerCase().includes('suelta')) ||
      (newBookingData.notes && (
        newBookingData.notes.toLowerCase().includes('grupo') ||
        newBookingData.notes.toLowerCase().includes('torneo') ||
        newBookingData.notes.toLowerCase().includes('escuela') ||
        newBookingData.notes.toLowerCase().includes('clase periódica')
      ));

    const finalPrice = isFromActivityOrTournament ? 0 : (newBookingData.totalPrice ?? 0);

    const defaultVenue = isMultiVenue
      ? (selectedVenueId !== 'all' ? selectedVenue : INITIAL_VENUES[1])
      : INITIAL_VENUES[1];

    const newBooking: Booking = {
      ...newBookingData,
      totalPrice: finalPrice,
      venueId: newBookingData.venueId || defaultVenue.id,
      venueName: newBookingData.venueName || defaultVenue.name,
      venueShortName: newBookingData.venueShortName || defaultVenue.shortName,
      id: generateUniqueId('b'),
      tenantId: currentTenant.id,
      accessPin: newBookingData.accessPin || randomPin,
    };

    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      saveDemoState('setmio_demo_bookings_v1', updated);
      return updated;
    });

    // Add audit log
    const logId = generateUniqueId('log');
    setAuditLogs((prev) => [
      {
        id: logId,
        timestamp: 'Ahora mismo',
        actor: currentUser.email,
        role: currentUser.role,
        action: 'Nueva Reserva Creada',
        target: `${newBooking.courtName} (${newBooking.startTime.split('T')[1] || ''})`,
        details: `Importe pista: ${newBooking.totalPrice.toFixed(2)}€. PIN de acceso: ${newBooking.accessPin}. Sede: ${newBooking.venueShortName || newBooking.venueName || 'Central'}`,
      },
      ...prev,
    ]);

    // Send notification
    const notifId = generateUniqueId('notif');
    setNotifications((prev) => [
      {
        id: notifId,
        title: '¡Reserva Confirmada!',
        message: `Pista "${newBooking.courtName}" reservada. PIN de acceso: ${newBooking.accessPin}`,
        type: 'booking',
        timestamp: 'Ahora mismo',
        read: false,
      },
      ...prev.filter((n) => n.id !== notifId),
    ]);

    triggerDemoToast(
      'Reserva Registrada',
      `Pista confirmada (${newBooking.courtName}). PIN ${newBooking.accessPin} asignado.${finalPrice === 0 ? ' Tarifa 0,00€ por actividad/escuela.' : ''}`,
      'success'
    );

    return newBooking;
  };

  const updateBooking = (bookingId: string, updates: Partial<Booking>) => {
    setBookings((prev) => {
      const updated = prev.map((booking) => (booking.id === bookingId ? { ...booking, ...updates } : booking));
      saveDemoState('setmio_demo_bookings_v1', updated);
      return updated;
    });
    triggerDemoToast('Reserva actualizada', 'Los cambios se han guardado en el historial del club.', 'success');
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === bookingId ? { ...b, status: 'canceled' as const } : b));
      saveDemoState('setmio_demo_bookings_v1', updated);
      return updated;
    });
    setAuditLogs((prev) => [
      {
        id: generateUniqueId('log'),
        timestamp: 'Ahora mismo',
        actor: currentUser.email,
        role: currentUser.role,
        action: 'Reserva Cancelada',
        target: bookingId,
        details: 'Reserva cancelada y pista liberada en la agenda del club.',
      },
      ...prev,
    ]);
    triggerDemoToast(
      'Reserva Cancelada',
      'La reserva ha sido cancelada y la pista queda liberada en la agenda del club.',
      'info'
    );
  };

  const deleteBooking = (bookingId: string) => {
    setBookings((prev) => {
      const updated = prev.filter((b) => b.id !== bookingId);
      saveDemoState('setmio_demo_bookings_v1', updated);
      return updated;
    });
    setAuditLogs((prev) => [
      {
        id: generateUniqueId('log'),
        timestamp: 'Ahora mismo',
        actor: currentUser.email,
        role: currentUser.role,
        action: 'Reserva Eliminada',
        target: bookingId,
        details: 'Reserva eliminada permanentemente del archivo por el administrador.',
      },
      ...prev,
    ]);
    triggerDemoToast(
      'Reserva Eliminada',
      'La reserva ha sido eliminada permanentemente del registro.',
      'info'
    );
  };

  const markBookingPaid = (bookingId: string, participantName?: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) => {
        if (b.id !== bookingId) return b;
        if (!participantName) {
          return {
            ...b,
            paymentStatus: 'paid' as const,
            participants: b.participants?.map((p) => ({ ...p, paid: true })),
          };
        }
        const updatedParticipants = b.participants?.map((p) =>
          p.name === participantName ? { ...p, paid: true } : p
        );
        const allPaid = updatedParticipants?.every((p) => p.paid);
        return {
          ...b,
          paymentStatus: allPaid ? ('paid' as const) : ('partially_paid' as const),
          participants: updatedParticipants,
        };
      });
      saveDemoState('setmio_demo_bookings_v1', updated);
      return updated;
    });
  };

  const [posPendingCharge, setPosPendingCharge] = useState<PosPendingCharge | null>(null);

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

  const leaveOpenMatch = (matchId: string, playerName: string) => {
    setOpenMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        const updatedPlayers = m.players.filter((p) => p.name !== playerName);
        return {
          ...m,
          players: updatedPlayers,
          status: 'open',
        };
      })
    );
    triggerDemoToast(
      'Plaza liberada',
      'Te has desapuntado del partido correctamente.',
      'info'
    );
  };

  const updateOpenMatch = (matchId: string, updates: Partial<OpenMatch>) => {
    setOpenMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, ...updates } : m))
    );
  };

  const deleteOpenMatch = (matchId: string) => {
    setOpenMatches((prev) => prev.filter((m) => m.id !== matchId));
    triggerDemoToast(
      'Partida eliminada',
      'La partida abierta ha sido cancelada y la pista liberada correctamente.',
      'info'
    );
  };

  // Tournaments
  const createTournament = (tournamentData: Omit<Tournament, 'id' | 'tenantId'>): Tournament => {
    const newT: Tournament = {
      ...tournamentData,
      id: `t-${Date.now().toString().slice(-4)}`,
      tenantId: currentTenant.id,
    };
    setTournaments((prev) => [newT, ...prev]);
    triggerDemoToast('Torneo Creado', `Torneo "${newT.title}" publicado con éxito.`, 'success');
    return newT;
  };

  const updateTournament = (tournamentId: string, updates: Partial<Tournament>) => {
    setTournaments((prev) =>
      prev.map((t) => (t.id === tournamentId ? { ...t, ...updates } : t))
    );
  };

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

  // Rankings
  const createRanking = (rankingData: Omit<ClubRanking, 'id' | 'tenantId'>) => {
    const newR: ClubRanking = {
      ...rankingData,
      id: `rnk-${Date.now().toString().slice(-4)}`,
      tenantId: currentTenant.id,
    };
    setRankings((prev) => [newR, ...prev]);
    triggerDemoToast('Ranking Creado', `El ranking "${newR.name}" ha sido creado con éxito.`, 'success');
  };

  const updateRanking = (id: string, updates: Partial<ClubRanking>) => {
    setRankings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const linkTournamentToRanking = (rankingId: string, tournamentId: string) => {
    setRankings((prev) =>
      prev.map((r) => {
        if (r.id !== rankingId) return r;
        if (r.linkedTournamentIds.includes(tournamentId)) return r;
        return { ...r, linkedTournamentIds: [...r.linkedTournamentIds, tournamentId] };
      })
    );
    setTournaments((prev) =>
      prev.map((t) => (t.id === tournamentId ? { ...t, rankingCategory: rankings.find(rk => rk.id === rankingId)?.name || t.rankingCategory } : t))
    );
    triggerDemoToast('Torneo Vinculado', 'El torneo ha sido vinculado al ranking con éxito.', 'success');
  };

  // Player Groups & Convocatorias (WhatsApp replacement)
  const createPlayerGroup = (groupData: Omit<PlayerGroup, 'id' | 'tenantId' | 'createdAt'>) => {
    const newGroup: PlayerGroup = {
      ...groupData,
      id: `grp-${Date.now().toString().slice(-5)}`,
      tenantId: currentTenant.id,
      createdAt: new Date().toISOString().split('T')[0],
      isWhatsAppReplacement: true,
    };
    setPlayerGroups((prev) => {
      const next = [newGroup, ...prev];
      saveDemoState('setmio_demo_player_groups_v1', next);
      return next;
    });
    triggerDemoToast(
      'Grupo de Jugadores Creado',
      `El grupo "${newGroup.name}" (${newGroup.memberCount} jugadores) está listo para convocatorias instantáneas.`,
      'success'
    );
  };

  const updatePlayerGroup = (groupId: string, data: Partial<PlayerGroup>) => {
    setPlayerGroups((prev) => {
      const next = prev.map((g) => (g.id === groupId ? { ...g, ...data } : g));
      saveDemoState('setmio_demo_player_groups_v1', next);
      return next;
    });
    triggerDemoToast('Grupo Actualizado', 'Los cambios en la lista de distribución se han guardado.', 'success');
  };

  const deletePlayerGroup = (groupId: string) => {
    setPlayerGroups((prev) => {
      const next = prev.filter((g) => g.id !== groupId);
      saveDemoState('setmio_demo_player_groups_v1', next);
      return next;
    });
    triggerDemoToast('Grupo Eliminado', 'La lista de distribución ha sido retirada.', 'info');
  };

  const sendGroupConvocatoria = (convocatoria: Omit<PlayerGroupConvocatoria, 'id' | 'tenantId' | 'sentAt'>) => {
    const now = 'Ahora mismo';
    const newConv: PlayerGroupConvocatoria = {
      ...convocatoria,
      id: `cnv-${Date.now().toString().slice(-5)}`,
      tenantId: currentTenant.id,
      sentAt: now,
    };
    setGroupConvocatorias((prev) => {
      const next = [newConv, ...prev];
      saveDemoState('setmio_demo_group_convocatorias_v1', next);
      return next;
    });
    setPlayerGroups((prev) => {
      const next = prev.map((g) =>
        g.id === convocatoria.groupId
          ? {
              ...g,
              lastConvocatoriaAt: now,
              lastConvocatoriaSubject: convocatoria.title,
            }
          : g
      );
      saveDemoState('setmio_demo_player_groups_v1', next);
      return next;
    });
    triggerDemoToast(
      'Convocatoria Lanzada',
      `Convocatoria enviada con éxito a ${convocatoria.groupName} (${convocatoria.recipientsCount} jugadores notificados con enlace directo).`,
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
  const addCafeProduct = (product: Omit<CafeProduct, 'id'>) => {
    const newProd: CafeProduct = {
      ...product,
      id: `cafe-prod-${Date.now()}`,
    };
    setCafeProducts((prev) => [...prev, newProd]);
    triggerDemoToast(
      'Producto Añadido',
      `"${newProd.name}" ha sido añadido al catálogo de cafetería.`,
      'success'
    );
  };

  const updateCafeProduct = (id: string, updates: Partial<CafeProduct>) => {
    setCafeProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    triggerDemoToast(
      'Producto Actualizado',
      'El producto del TPV ha sido actualizado correctamente.',
      'info'
    );
  };

  const deleteCafeProduct = (id: string) => {
    setCafeProducts((prev) => prev.filter((p) => p.id !== id));
    triggerDemoToast(
      'Producto Eliminado',
      'El producto ha sido retirado del TPV de cafetería.',
      'info'
    );
  };

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

  // Notifications state with ID deduplication guarantee
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

  const sendNotification = useCallback((notif: { title: string; message: string; type?: NotificationItem['type']; actionUrl?: string }) => {
    const newItem: NotificationItem = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: notif.title,
      message: notif.message,
      type: notif.type || 'system',
      timestamp: 'Ahora mismo',
      read: false,
      actionUrl: notif.actionUrl,
    };
    setNotifications((prev) => [newItem, ...prev]);
  }, []);

  // CRM Player Profile & Customers Database
  const [customers, setCustomers] = useState<CustomerItem[]>(() => {
    return readDemoState<CustomerItem[]>('setmio_customers', INITIAL_CUSTOMERS);
  });

  const addCustomer = useCallback(
    (customerData: Omit<CustomerItem, 'id' | 'memberNum' | 'matches' | 'balance' | 'level'> & { balance?: number; isMember?: boolean; level?: number }): CustomerItem => {
      const newCust: CustomerItem = {
        id: `c-${Date.now()}`,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        memberNum: customerData.isMember ? `SM-${Math.floor(100 + Math.random() * 900)}` : 'Nuevo',
        level: customerData.level ?? 3.5,
        balance: customerData.balance ?? 0,
        isMember: customerData.isMember ?? false,
        matches: 0,
        avatarUrl:
          customerData.avatarUrl ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        hand: customerData.hand || 'Diestro',
        position: customerData.position || 'Ambas',
        status: 'Activo (Al día)',
        createdAt: new Date().toISOString(),
      };
      setCustomers((prev) => {
        const next = [newCust, ...prev];
        try {
          localStorage.setItem('setmio_customers', JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
      return newCust;
    },
    []
  );

  const updateCustomer = useCallback((id: string, updates: Partial<CustomerItem>) => {
    setCustomers((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      try {
        localStorage.setItem('setmio_customers', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // CRM Player Profile Navigation
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [playerOriginTab, setPlayerOriginTab] = useState<AdminTab | null>(null);

  const navigateToPlayerProfile = (playerNameOrId: string, originTab?: AdminTab) => {
    const slug = playerNameOrId
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-');
    if (originTab) {
      setPlayerOriginTab(originTab);
    }
    setSelectedCustomerId(playerNameOrId);
    setCurrentViewState('admin');
    setAdminTabState('customers');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/admin/socios/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    triggerDemoToast(
      'Ficha de Jugador',
      `Abriendo ficha técnica y perfil CRM de ${playerNameOrId}.`,
      'info'
    );
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
        reply = `Como asistente contextual de ${currentTenant.name}, puedo ayudarte con cualquier servicio deportivo, reservas y consultas. Todo el sistema está activo con aislamiento seguro de datos por club.`;
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

  // ==========================================
  // MÓDULO DE PAGOS, FACTURACIÓN Y VERI*FACTU
  // ==========================================
  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    readDemoState('setmio_demo_invoices_v1', INITIAL_INVOICES)
  );

  const [saasInvoices, setSaasInvoices] = useState<PlatformSaaSInvoice[]>(() =>
    readDemoState('setmio_demo_saas_invoices_v1', INITIAL_SAAS_INVOICES)
  );

  const syncInvoiceVerifactu = useCallback((invoiceId: string) => {
    setInvoices((prev) => {
      const next = prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const qr = `https://aeat.es/verifactu?nif=B15998877&num=${encodeURIComponent(inv.number)}&tot=${inv.total.toFixed(2)}&f=${inv.issueDate.replace(/-/g, '')}`;
        return {
          ...inv,
          verifactu_status: 'synced' as VerifactuStatus,
          verifactu_hash: hash,
          verifactu_qr_data: qr,
          verifactu_synced_at: new Date().toISOString(),
          verifactu_error_message: undefined,
        };
      });
      saveDemoState('setmio_demo_invoices_v1', next);
      return next;
    });
    triggerDemoToast(
      'Sincronizado con Veri*factu AEAT',
      'Factura transmitida a los servidores tributarios con encadenamiento SHA-256 y código QR generado conforme al RD 1007/2023.',
      'success'
    );
  }, [triggerDemoToast]);

  const syncAllVerifactu = useCallback(() => {
    setInvoices((prev) => {
      let count = 0;
      const next = prev.map((inv) => {
        if (inv.verifactu_status === 'synced') return inv;
        count++;
        const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const qr = `https://aeat.es/verifactu?nif=B15998877&num=${encodeURIComponent(inv.number)}&tot=${inv.total.toFixed(2)}&f=${inv.issueDate.replace(/-/g, '')}`;
        return {
          ...inv,
          verifactu_status: 'synced' as VerifactuStatus,
          verifactu_hash: hash,
          verifactu_qr_data: qr,
          verifactu_synced_at: new Date().toISOString(),
          verifactu_error_message: undefined,
        };
      });
      saveDemoState('setmio_demo_invoices_v1', next);
      triggerDemoToast(
        'Lote Veri*factu Sincronizado',
        `Se han transmitido ${count} facturas pendientes a la Agencia Tributaria (AEAT) con firma digital y hash encadenado.`,
        'success'
      );
      return next;
    });
  }, [triggerDemoToast]);

  const createInvoice = useCallback((invoiceData: Partial<Invoice>) => {
    const subtotal = Number(((invoiceData.total || 28.0) / 1.21).toFixed(2));
    const taxAmount = Number(((invoiceData.total || 28.0) - subtotal).toFixed(2));
    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      tenantId: currentTenant.id,
      number: `FAC-2026-00${Math.floor(100 + Math.random() * 900)}`,
      series: '2026',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date().toISOString().slice(0, 10),
      status: invoiceData.status || 'paid',
      type: invoiceData.type || 'standard',
      customerName: invoiceData.customerName || 'Cliente General',
      customerNif: invoiceData.customerNif || '44556677X',
      customerEmail: invoiceData.customerEmail,
      concept: invoiceData.concept || 'Servicios Deportivos Pádel',
      category: invoiceData.category || 'courts',
      items: invoiceData.items || [
        {
          id: `ii-${Date.now()}`,
          description: invoiceData.concept || 'Servicios Deportivos Pádel',
          quantity: 1,
          unitPrice: invoiceData.total || 28.0,
          taxPercent: 21,
          total: invoiceData.total || 28.0,
        },
      ],
      subtotal,
      taxAmount,
      total: invoiceData.total || 28.0,
      paymentMethod: invoiceData.paymentMethod || 'online',
      paymentDate: new Date().toISOString(),
      verifactu_status: 'pending',
      ...invoiceData,
    };
    setInvoices((prev) => {
      const next = [newInv, ...prev];
      saveDemoState('setmio_demo_invoices_v1', next);
      return next;
    });
    triggerDemoToast(
      'Factura Emitida',
      `Factura ${newInv.number} generada para ${newInv.customerName}. Pendiente de sincronización Veri*factu.`,
      'success'
    );
    return newInv;
  }, [currentTenant.id, triggerDemoToast]);

  const markInvoicePaid = useCallback((invoiceId: string) => {
    setInvoices((prev) => {
      const next = prev.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, status: 'paid' as const, paymentDate: new Date().toISOString() }
          : inv
      );
      saveDemoState('setmio_demo_invoices_v1', next);
      return next;
    });
    triggerDemoToast('Cobro Registrado', 'La factura ha sido marcada como Pagada.', 'success');
  }, [triggerDemoToast]);

  const createRectificativeInvoice = useCallback((originalInvoiceId: string, reason: string) => {
    let createdRec: Invoice | null = null;
    setInvoices((prev) => {
      const orig = prev.find((inv) => inv.id === originalInvoiceId);
      if (!orig) return prev;
      createdRec = {
        id: `inv-rec-${Date.now()}`,
        tenantId: orig.tenantId,
        number: `REC-2026-000${Math.floor(10 + Math.random() * 90)}`,
        series: 'REC-2026',
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date().toISOString().slice(0, 10),
        status: 'rectified',
        type: 'rectificative',
        customerId: orig.customerId,
        customerName: orig.customerName,
        customerNif: orig.customerNif,
        customerEmail: orig.customerEmail,
        concept: `Factura Rectificativa de ${orig.number}: ${reason}`,
        category: orig.category,
        items: orig.items.map((it) => ({
          ...it,
          id: `ii-rec-${Date.now()}-${it.id}`,
          quantity: -it.quantity,
          total: -it.total,
        })),
        subtotal: -orig.subtotal,
        taxAmount: -orig.taxAmount,
        total: -orig.total,
        paymentMethod: orig.paymentMethod,
        paymentDate: new Date().toISOString(),
        verifactu_status: 'synced',
        verifactu_hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        verifactu_qr_data: `https://aeat.es/verifactu?nif=B15998877&num=REC&tot=${(-orig.total).toFixed(2)}`,
        verifactu_synced_at: new Date().toISOString(),
        notes: `Rectifica a la factura original ${orig.number}. Motivo: ${reason}`,
      };
      const updatedOrig = { ...orig, status: 'rectified' as const };
      const next = [createdRec, ...prev.map((i) => (i.id === originalInvoiceId ? updatedOrig : i))];
      saveDemoState('setmio_demo_invoices_v1', next);
      return next;
    });
    triggerDemoToast(
      'Factura Rectificativa Emitida',
      `Se ha emitido la factura rectificativa con importe negativo y sincronización Veri*factu.`,
      'success'
    );
    return createdRec!;
  }, [triggerDemoToast]);

  const syncSaasInvoiceVerifactu = useCallback((invoiceId: string) => {
    setSaasInvoices((prev) => {
      const next = prev.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, verifactu_status: 'synced' as VerifactuStatus }
          : inv
      );
      saveDemoState('setmio_demo_saas_invoices_v1', next);
      return next;
    });
    triggerDemoToast(
      'Factura SaaS Sincronizada',
      'Factura de suscripción Setmio Pro transmitida al registro tributario Veri*factu.',
      'success'
    );
  }, [triggerDemoToast]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        corporateTheme,
        setCorporateTheme,
        toggleCorporateTheme,
        clubTheme,
        setClubTheme,
        toggleClubTheme,
        adminTheme,
        setAdminTheme,
        toggleAdminTheme,
        language,
        currentLanguage: language,
        setLanguage,
        t,
        i18n,

        searchModalOpen,
        setSearchModalOpen,
        onboardingOpen,
        setOnboardingOpen,

        isCorporateLanding,
        setIsCorporateLanding,
        navigateToClub,
        navigateToEntityWeb,
        viewEntityWeb,
        navigateToCorporate,

        currentView,
        setCurrentView,
        publicPage,
        setPublicPage,
        selectedArticleId,
        setSelectedArticleId,
        selectedProductId,
        setSelectedProductId,
        selectedTeamId,
        setSelectedTeamId,
        selectedCourtsForBooking,
        setSelectedCourtsForBooking,
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

        isMultiVenue,
        toggleMultiVenueMode,
        setIsMultiVenueMode,
        venues,
        selectedVenueId,
        selectedVenue,
        setSelectedVenueId,
        isConsolidatedView,

        currentUser,
        switchUserRole,
        logoutOrExitDemo,
        isSuperadmin,
        can,

        isClubOpen,
        toggleClubOpenState,
        isWhiteLabelPlayerPreview,
        setIsWhiteLabelPlayerPreview,
        enterWhiteLabelPlayerPreview,
        exitWhiteLabelPlayerPreview,

        activeDemoAccount,
        switchDemoAccount,

        courts,
        addCourt,
        updateCourt,
        deleteCourt,
        toggleCourtLight,
        openCourtDoor,
        toggleDeviceOnline,
        updateCourtRate,

        bookings,
        createBooking,
        updateBooking,
        cancelBooking,
        deleteBooking,
        markBookingPaid,
        posPendingCharge,
        setPosPendingCharge,

        openMatches,
        createOpenMatch,
        updateOpenMatch,
        deleteOpenMatch,
        joinOpenMatch,
        leaveOpenMatch,

        coaches,
        academyGroups,

        tournaments,
        createTournament,
        updateTournament,
        registerTournamentTeam,

        rankings,
        createRanking,
        updateRanking,
        linkTournamentToRanking,

        playerGroups,
        createPlayerGroup,
        updatePlayerGroup,
        deletePlayerGroup,
        groupConvocatorias,
        sendGroupConvocatoria,

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
        addCafeProduct,
        updateCafeProduct,
        deleteCafeProduct,
        recordCafeSale,

        auditLogs,
        notifications,
        unreadNotificationsCount,
        markNotificationsAsRead,
        sendNotification,

        customers,
        addCustomer,
        updateCustomer,

        selectedCustomerId,
        setSelectedCustomerId,
        playerOriginTab,
        setPlayerOriginTab,
        navigateToPlayerProfile,

        aiMessages,
        sendAIMessage,
        isAiThinking,

        // Facturación, Pagos y Veri*factu
        invoices,
        syncInvoiceVerifactu,
        syncAllVerifactu,
        createInvoice,
        markInvoicePaid,
        createRectificativeInvoice,
        saasInvoices,
        syncSaasInvoiceVerifactu,

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
