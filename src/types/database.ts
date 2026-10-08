import { SupportedLanguage } from '../lib/i18n';

export type TenantType =
  | 'PADEL_CLUB'
  | 'ACADEMY'
  | 'COACH'
  | 'PRO_PLAYER'
  | 'ONLINE_STORE'
  | 'TOURNAMENT_ORGANIZER'
  | 'TEAM'
  | 'PROFESSIONAL';

export type UserRole =
  | 'SUPERADMIN'
  | 'TENANT_OWNER'
  | 'TENANT_ADMIN'
  | 'RECEPTION'
  | 'COACH'
  | 'PLAYER'
  | 'TOURNAMENT_ORGANIZER'
  | 'STORE_MANAGER'
  | 'ACADEMY_MANAGER'
  | 'TEAM_MANAGER'
  | 'PROFESSIONAL_PLAYER'
  | 'PARENT_OR_GUARDIAN'
  | 'STAFF';

export type PlanTier = 'free' | 'starter' | 'pro' | 'elite';

export interface Plan {
  id: PlanTier;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  maxCourts: number;
  maxUsers: number;
  hasPublicWeb: boolean;
  hasCustomDomain: boolean;
  hasAcademy: boolean;
  hasTournaments: boolean;
  hasStore: boolean;
  hasAiAgent: boolean;
  hasSmartCourtAutomation: boolean;
  hasPosModule: boolean;
  storageLimitMb: number;
  badge?: string;
}

export interface TenantBranding {
  logoUrl?: string;
  iconUrl?: string;
  primaryColor: string; // e.g. '#10b981'
  secondaryColor: string; // e.g. '#0f172a'
  accentColor: string; // e.g. '#06b6d4'
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroMediaType?: 'image' | 'video' | 'minimal';
  heroVideoUrl?: string;
  badgeText: string;
}

export interface TenantDomain {
  id: string;
  tenantId: string;
  hostname: string;
  isPrimary: boolean;
  isCustom: boolean;
  status: 'pending_verification' | 'dns_configured' | 'ssl_generating' | 'active' | 'failed';
  dnsExpected: {
    type: 'CNAME' | 'A';
    name: string;
    value: string;
    ttl: number;
  };
  dnsVerifiedAt?: string;
  sslActive: boolean;
}

export interface SponsorItem {
  id: string;
  name: string;
  category: string;
  logoText: string;
  websiteUrl?: string;
}

export interface Tenant {
  id: string;
  slug: string; // 'sanmateo', 'martinsanchez', 'galiciastore', etc.
  custom_domain?: string | null; // e.g. 'padelsanmateo.com'
  name: string;
  shortName: string;
  type: TenantType;
  planId: PlanTier;
  status: 'active' | 'suspended' | 'trial';
  isDemo: boolean;
  demo_locked?: boolean; // Section 10: locked demo tenant properties
  supportedLanguages: SupportedLanguage[];
  country: string;
  city: string;
  region: string;
  address: string;
  timezone: string;
  currency: string;
  locale: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  branding: TenantBranding;
  /** Public routes available to this club's white-label website. */
  publicPages?: string[];
  domains: TenantDomain[];
  settings: {
    bookingAdvanceDays: number;
    cancellationWindowHours: number;
    splitPaymentAllowed: boolean;
    playerMatchCreationAllowed: boolean;
    openingHours: {
      days: string;
      hours: string;
    }[];
    whatsappWidgetEnabled: boolean;
    whatsappGreetingMessage: string;
    chatWidgetMode?: 'whatsapp' | 'ai' | 'both';
    purchasePolicies?: string;
    paymentMethods?: {
      cash: boolean;
      manualPos: boolean;
      stripeTerminal: boolean;
      stripeTerminalReaderCode?: string;
      stripeTerminalStatus?: 'connected' | 'disconnected' | 'pairing';
      pushCharge: boolean;
      wallet: boolean;
      onlineGateway: boolean;
    };
    policies?: {
      requireOnlinePayment: boolean;
      allowCounterPayment: boolean;
      cancellationRefundType: 'full' | 'partial' | 'penalty' | 'no_refund';
      cancellationWindowHours: number;
      cancellationPenaltyPercent: number;
      memberCourtDiscountPercent: number;
      memberShopDiscountPercent: number;
    };
    coupons?: DiscountCoupon[];
    classVouchers?: ClassVoucher[];
  };
  // Specific contextual metadata
  proPlayerStats?: {
    fipRanking: number;
    premierRanking: number;
    titlesCount: number;
    matchesWon: number;
    matchesPlayed: number;
    partnerName: string;
    dominantHand: string;
    position: string;
    racketModel: string;
  };
  coachStats?: {
    certifications: string[];
    hourlyRate: number;
    activeStudents: number;
    weeklyLessons: number;
    rating: number;
  };
  sponsors?: SponsorItem[];
}

export interface Club {
  id: string;
  slug: string;
  name: string;
  short_name?: string;
  custom_domain?: string | null;
  plan_id?: string;
  city?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  whatsapp_number?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  playLevel: number; // e.g. 3.75
  dominantHand: 'right' | 'left';
  preferredPosition: 'drive' | 'reves' | 'both';
  isSuperadmin: boolean;
  preferredLanguage?: SupportedLanguage;
}

export interface Court {
  id: string;
  tenantId: string;
  name: string;
  sport?: 'padel' | 'tennis' | 'pickleball';
  courtType: 'indoor' | 'outdoor' | 'covered';
  surface: string; // 'Mondo Supercourt WPT'
  isPanoramic: boolean;
  isSingle: boolean;
  hasLights: boolean;
  hourlyRate: number;
  displayOrder: number;
  photoUrl: string;
  smartDeviceId?: string;
  isLightOn?: boolean;
  isDoorOpen?: boolean;
  isDeviceOnline?: boolean;
  accessPin?: string;
}

export interface Booking {
  id: string;
  tenantId: string;
  courtId: string;
  courtName: string;
  creatorId: string;
  creatorName: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: 'confirmed' | 'pending' | 'completed' | 'canceled';
  totalPrice: number;
  paymentStatus: 'paid' | 'pending' | 'partially_paid';
  isSplitPayment: boolean;
  participants: {
    name: string;
    paid: boolean;
    amount: number;
    avatar?: string;
  }[];
  accessPin?: string;
  notes?: string;
  matchScore?: string;
  isScoreHiddenInPublicProfile?: boolean;
}

export interface OpenMatch {
  id: string;
  tenantId: string;
  courtId: string;
  courtName: string;
  creatorName: string;
  creatorLevel: number;
  startTime: string;
  durationMinutes: number;
  minLevel: number;
  maxLevel: number;
  pricePerPlayer: number;
  status: 'open' | 'full' | 'completed' | 'canceled';
  mode?: 'competitive' | 'friendly';
  matchScore?: string;
  isScoreHiddenInPublicProfile?: boolean;
  players: {
    id: string;
    name: string;
    level: number;
    position: 'drive' | 'reves' | 'both';
    paid: boolean;
  }[];
}

export interface Coach {
  id: string;
  tenantId: string;
  name: string;
  roleTitle: string;
  bio: string;
  certification: string;
  hourlyRate: number;
  rating: number;
  photoUrl: string;
}

export interface AcademyGroup {
  id: string;
  tenantId: string;
  coachId: string;
  coachName: string;
  name: string;
  levelCategory: 'iniciacion' | 'intermedio' | 'competicion' | 'menores';
  maxStudents: number;
  currentStudents: number;
  monthlyFee: number;
  schedule: string;
}

export interface TournamentSponsor {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  description: string;
}

export interface RegisteredPair {
  id: string;
  player1: {
    id: string;
    name: string;
    email: string;
    phone: string;
    level: number;
  };
  player2: {
    id: string;
    name: string;
    email: string;
    phone: string;
    level: number;
  };
  category: string;
  paymentStatus: 'paid' | 'pending';
  paymentMethod: 'online' | 'club';
  status: 'confirmed' | 'pending_partner';
  createdAt: string;
}

export interface TournamentBracketMatch {
  id: string;
  round: string; // '1/16', 'Octavos', 'Cuartos', 'Semifinal', 'Final'
  matchIndex: number;
  team1: string;
  team2: string;
  score?: string;
  scheduledTime?: string;
  courtName?: string;
  courtId?: string;
  isCompleted: boolean;
}

export interface Tournament {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  dates: string;
  registrationDeadline: string;
  entryFee: number;
  bannerUrl: string;
  posterUrl?: string;
  categories: {
    name: string;
    teamsCount: number;
    maxTeams: number;
  }[];
  status: 'upcoming' | 'registration_open' | 'in_progress' | 'completed';
  format?: 'elimination' | 'league' | 'pozo' | 'league_and_elimination';
  rankingCategory?: string; // e.g. 'Circuito Setmio Oro'
  rankingPoints?: {
    champion: number;
    finalist: number;
    semifinalist: number;
    quarterfinalist: number;
  };
  paymentMethod?: 'online' | 'club' | 'both';
  sponsors?: TournamentSponsor[];
  registeredPairs?: RegisteredPair[];
  brackets?: TournamentBracketMatch[];
  prizes: string;
  description: string;
}

export interface ClubTeamPlayer {
  id: string;
  name: string;
  level: number;
  hand: 'diestro' | 'zurdo';
  position: 'drive' | 'reves' | 'ambas';
  avatarUrl?: string;
}

export interface ClubTeam {
  id: string;
  tenantId?: string;
  name: string;
  category: string; // e.g. '1ª Categoría Gallega', 'Veteranos +40'
  gender: 'masculino' | 'femenino' | 'mixto' | 'menores';
  division?: string;
  coach: string;
  captain: string;
  photoUrl: string;
  players: ClubTeamPlayer[];
  matchesWon?: number;
  matchesPlayed?: number;
  nextMatch?: {
    opponent: string;
    date: string;
    time: string;
    location: string;
  };
  updatedAt?: string;
}

export interface Product {
  id: string;
  tenantId: string;
  category: 'palas' | 'zapatillas' | 'paleteros' | 'ropa' | 'accesorios';
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  isFeatured: boolean;
  imageUrl: string;
  description: string;
  specs: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BlogPost {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  readingTime: number;
  publishedAt: string;
  titleKey?: string;
  excerptKey?: string;
  summaryKey?: string;
  authorKey?: string;
  readingTimeKey?: string;
  tagsKey?: string;
}

export interface PageBlock {
  id: string;
  type: 'hero' | 'quick_booking' | 'courts_grid' | 'tournaments_banner' | 'academy_teaser' | 'featured_products' | 'latest_blog' | 'contact_card' | 'ranking_kpis' | 'sponsors_grid' | 'coaching_services';
  title?: string;
  subtitle?: string;
  isVisible: boolean;
  order: number;
  customData?: Record<string, unknown>;
}

export interface SmartCourtDevice {
  id: string;
  tenantId: string;
  courtId: string;
  courtName: string;
  name: string;
  deviceType: 'light_relay' | 'pin_pad_lock' | 'smart_meter';
  provider: 'Shelly Cloud Pro' | 'Salto KS Cloud' | 'Sonoff IoT' | 'Tuya Pro';
  status: 'connected_demo' | 'online' | 'offline';
  ipOrCloudId: string;
  relayState: boolean;
  currentAccessPin?: string;
  lastSync: string;
}

export interface CafeProduct {
  id: string;
  tenantId?: string;
  name: string;
  category: 'Bebidas' | 'Café' | 'Snacks' | 'Bocadillos' | 'Grip/Pelotas' | 'Reserva Pista' | 'Recarga Monedero' | string;
  price: number;
  stock: number;
  active?: boolean;
  imageUrl?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'match' | 'tournament' | 'system' | 'payment';
  timestamp: string;
  read: boolean;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  scope: 'global' | 'shop' | 'courts';
  active: boolean;
  expiresAt?: string;
}

export interface ClassVoucher {
  id: string;
  title: string;
  classesCount: number;
  price: number;
  validityDays: number;
  active: boolean;
}

export interface RankingLeaderboardEntry {
  id: string;
  rank: number;
  playerId: string;
  playerName: string;
  avatarUrl?: string;
  isMember: boolean;
  level: number;
  points: number;
  matchesWon: number;
  matchesPlayed: number;
  streak: string;
}

export interface ClubRanking {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  season: string;
  description: string;
  active: boolean;
  linkedTournamentIds: string[];
  leaderboard: RankingLeaderboardEntry[];
}

