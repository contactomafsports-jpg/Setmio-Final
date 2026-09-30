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

export interface Tournament {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  dates: string;
  registrationDeadline: string;
  entryFee: number;
  bannerUrl: string;
  categories: {
    name: string;
    teamsCount: number;
    maxTeams: number;
  }[];
  status: 'upcoming' | 'registration_open' | 'in_progress' | 'completed';
  prizes: string;
  description: string;
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
  tenantId: string;
  name: string;
  category: 'Bebidas' | 'Café' | 'Snacks' | 'Bocadillos' | 'Grip/Pelotas';
  price: number;
  stock: number;
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
