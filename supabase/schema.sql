-- ==============================================================================
-- SETMIO PADEL PRO — COMPREHENSIVE MULTI-TENANT POSTGRESQL & SUPABASE RLS SCHEMA
-- Architecture: Row Level Security (RLS) Multi-Tenant Isolated SaaS Core
-- Target: Supabase / PostgreSQL 15+
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE tenant_type AS ENUM ('club', 'academy', 'coach', 'pro_player', 'organizer', 'team', 'store', 'other');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');
CREATE TYPE domain_status AS ENUM ('pending_verification', 'dns_configured', 'ssl_generating', 'active', 'failed', 'disabled');
CREATE TYPE user_role AS ENUM (
  'SUPERADMIN',
  'TENANT_OWNER',
  'TENANT_ADMIN',
  'RECEPTION',
  'COACH',
  'PLAYER',
  'TOURNAMENT_ORGANIZER',
  'STORE_MANAGER',
  'ACADEMY_MANAGER',
  'TEAM_MANAGER',
  'PROFESSIONAL_PLAYER',
  'PARENT_OR_GUARDIAN'
);
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'canceled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'partially_paid', 'refunded', 'failed');
CREATE TYPE match_type AS ENUM ('open', 'private', 'tournament', 'class', 'maintenance');
CREATE TYPE match_status AS ENUM ('open', 'full', 'in_progress', 'completed', 'canceled');
CREATE TYPE tournament_format AS ENUM ('single_elimination', 'double_elimination', 'round_robin', 'groups_and_playoffs');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'ready_for_pickup', 'completed', 'canceled', 'refunded');
CREATE TYPE automation_device_type AS ENUM ('light_switch', 'access_door_pin', 'turnstile', 'climate_control', 'court_camera');

-- ==============================================================================
-- 3. GLOBAL PLATFORM TABLES (SETMIO HQ)
-- ==============================================================================

-- Plans (FREE, STARTER, PRO, ELITE)
CREATE TABLE IF NOT EXISTS public.plans (
  id TEXT PRIMARY KEY, -- 'free', 'starter', 'pro', 'elite'
  name TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  price_yearly NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'EUR',
  max_courts INT NOT NULL DEFAULT 2,
  max_users INT NOT NULL DEFAULT 5,
  has_public_web BOOLEAN NOT NULL DEFAULT FALSE,
  has_custom_domain BOOLEAN NOT NULL DEFAULT FALSE,
  has_academy BOOLEAN NOT NULL DEFAULT FALSE,
  has_tournaments BOOLEAN NOT NULL DEFAULT FALSE,
  has_store BOOLEAN NOT NULL DEFAULT FALSE,
  has_ai_agent BOOLEAN NOT NULL DEFAULT FALSE,
  has_smart_court_automation BOOLEAN NOT NULL DEFAULT FALSE,
  has_pos_module BOOLEAN NOT NULL DEFAULT FALSE,
  storage_limit_mb INT NOT NULL DEFAULT 500,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tenants (Clubs, Academies, etc.)
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- e.g. 'sanmateo'
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  type tenant_type NOT NULL DEFAULT 'club',
  plan_id TEXT NOT NULL REFERENCES public.plans(id),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'trial'
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  country TEXT NOT NULL DEFAULT 'ES',
  city TEXT NOT NULL,
  region TEXT,
  timezone TEXT NOT NULL DEFAULT 'Europe/Madrid',
  currency TEXT NOT NULL DEFAULT 'EUR',
  locale TEXT NOT NULL DEFAULT 'es',
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  whatsapp_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tenant Domains
CREATE TABLE IF NOT EXISTS public.tenant_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  hostname TEXT UNIQUE NOT NULL, -- e.g. 'sanmateo.setmio.com' or 'padelsanmateo.es'
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  status domain_status NOT NULL DEFAULT 'pending_verification',
  dns_records_expected JSONB,
  dns_verified_at TIMESTAMPTZ,
  ssl_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tenant Settings & Fiscal Data
CREATE TABLE IF NOT EXISTS public.tenant_settings (
  tenant_id UUID PRIMARY KEY REFERENCES public.tenants(id) ON DELETE CASCADE,
  fiscal_name TEXT,
  tax_id TEXT, -- CIF / NIF
  fiscal_address TEXT,
  opening_hours JSONB,
  booking_advance_days INT NOT NULL DEFAULT 7,
  cancellation_window_hours INT NOT NULL DEFAULT 24,
  split_payment_allowed BOOLEAN NOT NULL DEFAULT TRUE,
  player_match_creation_allowed BOOLEAN NOT NULL DEFAULT TRUE,
  currency_symbol TEXT NOT NULL DEFAULT '€',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tenant Branding & UI Configuration
CREATE TABLE IF NOT EXISTS public.tenant_branding (
  tenant_id UUID PRIMARY KEY REFERENCES public.tenants(id) ON DELETE CASCADE,
  logo_url TEXT,
  logo_dark_url TEXT,
  icon_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#10b981', -- Emerald accent
  secondary_color TEXT NOT NULL DEFAULT '#0f172a', -- Deep slate
  accent_color TEXT NOT NULL DEFAULT '#06b6d4', -- Cyan
  font_family TEXT NOT NULL DEFAULT 'Inter, sans-serif',
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image_url TEXT,
  badge_text TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. USERS, ROLES & MEMBERSHIPS (RBAC)
-- ==============================================================================

-- Supabase auth synced user profile
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY, -- references auth.users(id)
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  play_level NUMERIC(3,2) DEFAULT 3.00, -- Padel level 1.0 to 7.0
  preferred_position TEXT DEFAULT 'both', -- 'drive', 'reves', 'both'
  dominant_hand TEXT DEFAULT 'right', -- 'right', 'left'
  is_superadmin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tenant Memberships (A user can belong to multiple clubs with distinct roles)
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'PLAYER',
  status TEXT NOT NULL DEFAULT 'active',
  member_number TEXT,
  wallet_balance NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, user_id, role)
);

-- ==============================================================================
-- 5. COURTS, BOOKINGS & OPEN MATCHES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.courts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- 'Pista 1 - Central Panorámica'
  court_type TEXT NOT NULL DEFAULT 'indoor', -- 'indoor', 'outdoor', 'covered'
  surface TEXT NOT NULL DEFAULT 'Mondo Supercourt WPT',
  is_panoramic BOOLEAN NOT NULL DEFAULT TRUE,
  is_single BOOLEAN NOT NULL DEFAULT FALSE,
  has_lights BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  hourly_rate NUMERIC(10,2) NOT NULL DEFAULT 28.00,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.court_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id UUID NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL, -- 0 Sunday to 6 Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price_per_hour NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  court_id UUID NOT NULL REFERENCES public.courts(id) ON DELETE RESTRICT,
  creator_id UUID NOT NULL REFERENCES public.user_profiles(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status booking_status NOT NULL DEFAULT 'confirmed',
  total_price NUMERIC(10,2) NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  is_split_payment BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  lighting_auto_activated BOOLEAN NOT NULL DEFAULT FALSE,
  access_pin TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Prevent double booking overlap
  CONSTRAINT court_no_overlap EXCLUDE USING gist (
    court_id WITH =,
    tstzrange(start_time, end_time, '[)') WITH &&
  )
);

CREATE TABLE IF NOT EXISTS public.booking_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  guest_name TEXT,
  slot_number INT NOT NULL, -- 1, 2, 3, 4
  amount_due NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  has_paid BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Open Matches (Public club matchmaking)
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  court_id UUID REFERENCES public.courts(id),
  creator_id UUID NOT NULL REFERENCES public.user_profiles(id),
  start_time TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 90,
  min_level NUMERIC(3,2) NOT NULL DEFAULT 2.50,
  max_level NUMERIC(3,2) NOT NULL DEFAULT 4.00,
  match_type match_type NOT NULL DEFAULT 'open',
  status match_status NOT NULL DEFAULT 'open',
  price_per_player NUMERIC(10,2) NOT NULL DEFAULT 7.00,
  competitive BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.match_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id),
  team INT NOT NULL DEFAULT 1, -- Team 1 or 2
  position TEXT DEFAULT 'reves',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  confirmed BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(match_id, user_id)
);

-- ==============================================================================
-- 6. ACADEMY & COACHES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id),
  bio TEXT,
  certification TEXT,
  hourly_rate NUMERIC(10,2) NOT NULL DEFAULT 40.00,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.academy_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES public.coaches(id),
  name TEXT NOT NULL, -- 'Adultos Nivel Intermedio Mañanas'
  level_category TEXT NOT NULL, -- 'iniciacion', 'intermedio', 'competicion', 'menores'
  max_students INT NOT NULL DEFAULT 4,
  monthly_fee NUMERIC(10,2) NOT NULL DEFAULT 65.00,
  schedule_description TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.academy_groups(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES public.coaches(id),
  court_id UUID REFERENCES public.courts(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  topic TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled'
);

CREATE TABLE IF NOT EXISTS public.class_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id),
  attended BOOLEAN NOT NULL DEFAULT TRUE,
  notes TEXT
);

-- ==============================================================================
-- 7. TOURNAMENTS & COMPETITIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  registration_deadline TIMESTAMPTZ NOT NULL,
  entry_fee NUMERIC(10,2) NOT NULL DEFAULT 25.00,
  banner_url TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'registration_open', -- 'upcoming', 'registration_open', 'in_progress', 'completed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tournament_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- '1ª Masculina', '2ª Femenina', 'Mixto Oro'
  gender TEXT NOT NULL DEFAULT 'open',
  max_teams INT NOT NULL DEFAULT 16,
  format tournament_format NOT NULL DEFAULT 'groups_and_playoffs'
);

CREATE TABLE IF NOT EXISTS public.tournament_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.tournament_categories(id) ON DELETE CASCADE,
  player1_id UUID NOT NULL REFERENCES public.user_profiles(id),
  player2_id UUID NOT NULL REFERENCES public.user_profiles(id),
  team_name TEXT,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  seed INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 8. E-COMMERCE & STORE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  image_url TEXT,
  display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  brand TEXT NOT NULL, -- 'Bullpadel', 'Nox', 'Siux', 'Babolat', 'Head'
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  compare_at_price NUMERIC(10,2),
  cost_price NUMERIC(10,2),
  stock_quantity INT NOT NULL DEFAULT 10,
  images TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.user_profiles(id),
  total_amount NUMERIC(10,2) NOT NULL,
  subtotal_amount NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2) DEFAULT 0.00,
  status order_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  shipping_address JSONB,
  fulfillment_type TEXT NOT NULL DEFAULT 'pickup_in_club', -- 'pickup_in_club', 'delivery'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL
);

-- ==============================================================================
-- 9. BLOG & CONTENT
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_name TEXT NOT NULL,
  category TEXT NOT NULL,
  reading_time_minutes INT NOT NULL DEFAULT 4,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pages & Block Editor
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  blocks JSONB NOT NULL DEFAULT '[]',
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. AI AGENTS, IOT AUTOMATION & POS CAFETERIA
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL DEFAULT 'PadelBot San Mateo',
  system_prompt TEXT,
  welcome_message TEXT NOT NULL DEFAULT '¡Hola! Soy tu asistente de Pádel San Mateo. ¿En qué te puedo ayudar hoy?',
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.user_profiles(id),
  session_id TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'web', -- 'web', 'whatsapp', 'instagram'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Intelligent Smart Court IoT Devices
CREATE TABLE IF NOT EXISTS public.integration_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  court_id UUID REFERENCES public.courts(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  device_type automation_device_type NOT NULL,
  provider TEXT NOT NULL, -- 'shelly_cloud', 'sonoff', 'salto_ks', 'tuya'
  device_identifier TEXT NOT NULL,
  ip_address TEXT,
  status TEXT NOT NULL DEFAULT 'connected_demo', -- 'connected', 'offline', 'error', 'connected_demo'
  last_heartbeat TIMESTAMPTZ,
  settings JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_event TEXT NOT NULL, -- 'booking_start', 'booking_end', 'door_pin_issued'
  delay_minutes INT NOT NULL DEFAULT 0,
  action_type TEXT NOT NULL, -- 'turn_on_lights', 'turn_off_lights', 'generate_pin'
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Cafetería & POS
CREATE TABLE IF NOT EXISTS public.cafe_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Bebidas', 'Snacks', 'Cafetería', 'Bocadillos'
  price NUMERIC(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 50,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.cafe_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.user_profiles(id),
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL, -- 'cash', 'card', 'member_wallet'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.user_profiles(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security function: Check if current authenticated user is superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_superadmin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper security function: Check membership role for a tenant
CREATE OR REPLACE FUNCTION public.has_tenant_role(t_id UUID, req_roles user_role[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.memberships
    WHERE tenant_id = t_id
      AND user_id = auth.uid()
      AND role = ANY(req_roles)
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public read access for active tenants and branding
CREATE POLICY "Public read for tenants" ON public.tenants
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public read for tenant branding" ON public.tenant_branding
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read for active courts" ON public.courts
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public read for published blog posts" ON public.blog_posts
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Public read for active products" ON public.products
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public read for active tournaments" ON public.tournaments
  FOR SELECT USING (TRUE);

-- Superadmin unrestricted access
CREATE POLICY "Superadmin full access on tenants" ON public.tenants
  FOR ALL USING (public.is_superadmin());

CREATE POLICY "Superadmin full access on domains" ON public.tenant_domains
  FOR ALL USING (public.is_superadmin());

-- Tenant Admin & Owner Management Policies
CREATE POLICY "Tenant admin write access to courts" ON public.courts
  FOR ALL USING (
    public.is_superadmin() OR
    public.has_tenant_role(tenant_id, ARRAY['TENANT_OWNER', 'TENANT_ADMIN']::user_role[])
  );

CREATE POLICY "Tenant admin write access to branding" ON public.tenant_branding
  FOR ALL USING (
    public.is_superadmin() OR
    public.has_tenant_role(tenant_id, ARRAY['TENANT_OWNER', 'TENANT_ADMIN']::user_role[])
  );

CREATE POLICY "Tenant admin write access to settings" ON public.tenant_settings
  FOR ALL USING (
    public.is_superadmin() OR
    public.has_tenant_role(tenant_id, ARRAY['TENANT_OWNER', 'TENANT_ADMIN']::user_role[])
  );

-- Bookings access: Owners/Admins see all for their tenant; players see their own
CREATE POLICY "View bookings policy" ON public.bookings
  FOR SELECT USING (
    public.is_superadmin() OR
    public.has_tenant_role(tenant_id, ARRAY['TENANT_OWNER', 'TENANT_ADMIN', 'RECEPTION']::user_role[]) OR
    creator_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.booking_participants bp
      WHERE bp.booking_id = id AND bp.user_id = auth.uid()
    )
  );

CREATE POLICY "Create bookings policy" ON public.bookings
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND creator_id = auth.uid()
  );

-- Orders: Users see their own orders, managers see all orders in tenant
CREATE POLICY "Users read own orders" ON public.orders
  FOR SELECT USING (
    user_id = auth.uid() OR
    public.has_tenant_role(tenant_id, ARRAY['TENANT_OWNER', 'TENANT_ADMIN', 'STORE_MANAGER']::user_role[])
  );
