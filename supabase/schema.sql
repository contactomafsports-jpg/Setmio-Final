-- ==============================================================================
-- SETMIO PADEL PRO — COMPREHENSIVE SUPABASE / POSTGRESQL SCHEMA & SEED DATA
-- Arquitectura: Multi-tenant White-Label SaaS para Clubes, Academias y Jugadores
-- Compatible con: Supabase SQL Editor (PostgreSQL 15+)
-- ==============================================================================

-- 1. EXTENSIONES REQUERIDAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. TIPOS PERSONALIZADOS (ENUMS) SEGUROS IDEMPOTENTES
DO $$ BEGIN
  CREATE TYPE tenant_type AS ENUM ('PADEL_CLUB', 'ACADEMY', 'COACH', 'PRO_PLAYER', 'ONLINE_STORE', 'TOURNAMENT_ORGANIZER', 'TEAM', 'PROFESSIONAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'SUPERADMIN', 'TENANT_OWNER', 'TENANT_ADMIN', 'RECEPTION', 'COACH', 
    'PLAYER', 'TOURNAMENT_ORGANIZER', 'STORE_MANAGER', 'ACADEMY_MANAGER', 
    'TEAM_MANAGER', 'PROFESSIONAL_PLAYER', 'PARENT_OR_GUARDIAN', 'STAFF'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'canceled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'partially_paid', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE match_status AS ENUM ('open', 'full', 'completed', 'canceled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ==============================================================================
-- 3. PLANES Y TENANTS (CLUBES / MULTI-TENANT)
-- ==============================================================================

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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  type tenant_type NOT NULL DEFAULT 'PADEL_CLUB',
  plan_id TEXT NOT NULL REFERENCES public.plans(id),
  status TEXT NOT NULL DEFAULT 'active',
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  demo_locked BOOLEAN NOT NULL DEFAULT FALSE,
  country TEXT NOT NULL DEFAULT 'España',
  city TEXT NOT NULL,
  region TEXT,
  address TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Europe/Madrid',
  currency TEXT NOT NULL DEFAULT 'EUR',
  locale TEXT NOT NULL DEFAULT 'es-ES',
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  whatsapp_number TEXT,
  public_pages TEXT[] DEFAULT ARRAY['home', 'courts', 'academy', 'tournaments', 'shop', 'contact'],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tenant_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  hostname TEXT UNIQUE NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active',
  dns_expected JSONB,
  dns_verified_at TIMESTAMPTZ,
  ssl_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tenant_settings (
  tenant_id UUID PRIMARY KEY REFERENCES public.tenants(id) ON DELETE CASCADE,
  fiscal_name TEXT,
  tax_id TEXT,
  fiscal_address TEXT,
  opening_hours JSONB,
  booking_advance_days INT NOT NULL DEFAULT 14,
  cancellation_window_hours INT NOT NULL DEFAULT 12,
  split_payment_allowed BOOLEAN NOT NULL DEFAULT TRUE,
  player_match_creation_allowed BOOLEAN NOT NULL DEFAULT TRUE,
  currency_symbol TEXT NOT NULL DEFAULT '€',
  whatsapp_widget_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  whatsapp_greeting_message TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tenant_branding (
  tenant_id UUID PRIMARY KEY REFERENCES public.tenants(id) ON DELETE CASCADE,
  logo_url TEXT,
  icon_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#185c43',
  secondary_color TEXT NOT NULL DEFAULT '#10221d',
  accent_color TEXT NOT NULL DEFAULT '#c7f36b',
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_image_url TEXT NOT NULL,
  badge_text TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. PERFILES DE USUARIO Y MEMBRESÍAS (RBAC)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  play_level NUMERIC(3,2) NOT NULL DEFAULT 3.50,
  dominant_hand TEXT NOT NULL DEFAULT 'right',
  preferred_position TEXT NOT NULL DEFAULT 'both',
  is_superadmin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
-- 5. PISTAS, RESERVAS Y PARTIDOS ABIERTOS ("PLAY!")
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.courts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  court_type TEXT NOT NULL DEFAULT 'indoor', -- 'indoor', 'outdoor', 'covered'
  surface TEXT NOT NULL DEFAULT 'Mondo Supercourt WPT',
  is_panoramic BOOLEAN NOT NULL DEFAULT TRUE,
  is_single BOOLEAN NOT NULL DEFAULT FALSE,
  has_lights BOOLEAN NOT NULL DEFAULT TRUE,
  hourly_rate NUMERIC(10,2) NOT NULL DEFAULT 28.00,
  display_order INT NOT NULL DEFAULT 1,
  photo_url TEXT,
  smart_device_id TEXT,
  is_light_on BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  court_id UUID NOT NULL REFERENCES public.courts(id) ON DELETE RESTRICT,
  court_name TEXT NOT NULL,
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  creator_name TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status booking_status NOT NULL DEFAULT 'confirmed',
  total_price NUMERIC(10,2) NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'paid',
  is_split_payment BOOLEAN NOT NULL DEFAULT FALSE,
  access_pin TEXT,
  notes TEXT,
  lighting_auto_activated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT court_no_overlap EXCLUDE USING gist (
    court_id WITH =,
    tstzrange(start_time, end_time, '[)') WITH &&
  )
);

CREATE TABLE IF NOT EXISTS public.booking_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slot_number INT NOT NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  paid BOOLEAN NOT NULL DEFAULT TRUE,
  avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  court_id UUID REFERENCES public.courts(id) ON DELETE SET NULL,
  court_name TEXT NOT NULL,
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  creator_name TEXT NOT NULL,
  creator_level NUMERIC(3,2) NOT NULL DEFAULT 3.50,
  start_time TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 90,
  min_level NUMERIC(3,2) NOT NULL DEFAULT 2.50,
  max_level NUMERIC(3,2) NOT NULL DEFAULT 4.00,
  price_per_player NUMERIC(10,2) NOT NULL DEFAULT 7.50,
  status match_status NOT NULL DEFAULT 'open',
  competitive BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.match_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  level NUMERIC(3,2) NOT NULL,
  position TEXT NOT NULL DEFAULT 'both', -- 'drive', 'reves', 'both'
  paid BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. EQUIPOS Y PLANTILLAS DEL CLUB
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.club_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  coach TEXT,
  players TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. ESCUELA, ENTRENADORES Y ACADEMIA
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  bio TEXT,
  certification TEXT NOT NULL,
  hourly_rate NUMERIC(10,2) NOT NULL DEFAULT 35.00,
  rating NUMERIC(3,2) NOT NULL DEFAULT 4.90,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.academy_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES public.coaches(id) ON DELETE SET NULL,
  coach_name TEXT NOT NULL,
  name TEXT NOT NULL,
  level_category TEXT NOT NULL, -- 'iniciacion', 'intermedio', 'competicion', 'menores'
  max_students INT NOT NULL DEFAULT 4,
  current_students INT NOT NULL DEFAULT 3,
  monthly_fee NUMERIC(10,2) NOT NULL DEFAULT 65.00,
  schedule TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 8. TORNEOS Y COMPETICIONES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  dates TEXT NOT NULL,
  registration_deadline TIMESTAMPTZ NOT NULL,
  entry_fee NUMERIC(10,2) NOT NULL DEFAULT 25.00,
  banner_url TEXT,
  prizes TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'registration_open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tournament_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  teams_count INT NOT NULL DEFAULT 0,
  max_teams INT NOT NULL DEFAULT 16,
  format TEXT NOT NULL DEFAULT 'groups_and_playoffs'
);

-- ==============================================================================
-- 9. TIENDA PRO SHOP & MATERIAL
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'palas', 'zapatillas', 'paleteros', 'ropa', 'accesorios'
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  compare_at_price NUMERIC(10,2),
  stock INT NOT NULL DEFAULT 5,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  image_url TEXT NOT NULL,
  description TEXT,
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. BLOG Y BLOQUES EDITABLES CMS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  reading_time INT NOT NULL DEFAULT 4,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 1,
  custom_data JSONB DEFAULT '{}'
);

-- ==============================================================================
-- 11. HABILITAR RLS (ROW LEVEL SECURITY) Y POLÍTICAS
-- ==============================================================================

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para la aplicación web
DROP POLICY IF EXISTS "Public read plans" ON public.plans;
CREATE POLICY "Public read plans" ON public.plans FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read active tenants" ON public.tenants;
CREATE POLICY "Public read active tenants" ON public.tenants FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read tenant branding" ON public.tenant_branding;
CREATE POLICY "Public read tenant branding" ON public.tenant_branding FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read tenant settings" ON public.tenant_settings;
CREATE POLICY "Public read tenant settings" ON public.tenant_settings FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read tenant domains" ON public.tenant_domains;
CREATE POLICY "Public read tenant domains" ON public.tenant_domains FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read active courts" ON public.courts;
CREATE POLICY "Public read active courts" ON public.courts FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read bookings" ON public.bookings;
CREATE POLICY "Public read bookings" ON public.bookings FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read booking participants" ON public.booking_participants;
CREATE POLICY "Public read booking participants" ON public.booking_participants FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read open matches" ON public.matches;
CREATE POLICY "Public read open matches" ON public.matches FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read match participants" ON public.match_participants;
CREATE POLICY "Public read match participants" ON public.match_participants FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read club teams" ON public.club_teams;
CREATE POLICY "Public read club teams" ON public.club_teams FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read coaches" ON public.coaches;
CREATE POLICY "Public read coaches" ON public.coaches FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read academy groups" ON public.academy_groups;
CREATE POLICY "Public read academy groups" ON public.academy_groups FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read tournaments" ON public.tournaments;
CREATE POLICY "Public read tournaments" ON public.tournaments FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read tournament categories" ON public.tournament_categories;
CREATE POLICY "Public read tournament categories" ON public.tournament_categories FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read blog posts" ON public.blog_posts;
CREATE POLICY "Public read blog posts" ON public.blog_posts FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read page blocks" ON public.page_blocks;
CREATE POLICY "Public read page blocks" ON public.page_blocks FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Read user profiles" ON public.user_profiles;
CREATE POLICY "Read user profiles" ON public.user_profiles FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Read memberships" ON public.memberships;
CREATE POLICY "Read memberships" ON public.memberships FOR SELECT USING (TRUE);

-- Políticas de escritura para permitir operaciones de la aplicación (Web + Admin)
DROP POLICY IF EXISTS "Insert bookings" ON public.bookings;
CREATE POLICY "Insert bookings" ON public.bookings FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Update bookings" ON public.bookings;
CREATE POLICY "Update bookings" ON public.bookings FOR UPDATE USING (TRUE);

DROP POLICY IF EXISTS "Insert booking participants" ON public.booking_participants;
CREATE POLICY "Insert booking participants" ON public.booking_participants FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Insert matches" ON public.matches;
CREATE POLICY "Insert matches" ON public.matches FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Update matches" ON public.matches;
CREATE POLICY "Update matches" ON public.matches FOR UPDATE USING (TRUE);

DROP POLICY IF EXISTS "Insert match participants" ON public.match_participants;
CREATE POLICY "Insert match participants" ON public.match_participants FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Manage club teams" ON public.club_teams;
CREATE POLICY "Manage club teams" ON public.club_teams FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Update courts state" ON public.courts;
CREATE POLICY "Update courts state" ON public.courts FOR UPDATE USING (TRUE);

DROP POLICY IF EXISTS "Manage tenant branding" ON public.tenant_branding;
CREATE POLICY "Manage tenant branding" ON public.tenant_branding FOR ALL USING (TRUE);

DROP POLICY IF EXISTS "Manage user profiles" ON public.user_profiles;
CREATE POLICY "Manage user profiles" ON public.user_profiles FOR ALL USING (TRUE);

-- ==============================================================================
-- 12. DATOS INICIALES SEMILLA (SEED DATA REALISTA Y FUNCIONAL)
-- ==============================================================================

-- 12.1. Planes de suscripción SaaS
INSERT INTO public.plans (id, name, description, price_monthly, price_yearly, currency, max_courts, max_users, has_public_web, has_custom_domain, has_academy, has_tournaments, has_store, has_ai_agent, has_smart_court_automation, has_pos_module, storage_limit_mb)
VALUES
  ('free', 'Setmio Free', 'Gestión básica para grupos pequeños y entrenadores.', 0.00, 0.00, 'EUR', 1, 2, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 250),
  ('starter', 'Setmio Starter', 'Clubes de hasta 3 pistas y entrenadores con academia.', 39.00, 390.00, 'EUR', 3, 5, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, 1000),
  ('pro', 'Setmio Pro', 'Clubes en crecimiento con torneos y escuela completa.', 89.00, 890.00, 'EUR', 6, 15, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, 5000),
  ('elite', 'Setmio Elite', 'Instalación completa de alto rendimiento y automatización.', 159.00, 1590.00, 'EUR', 20, 50, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 20000)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price_monthly = EXCLUDED.price_monthly;

-- 12.2. Club Demo Principal (Centro de Pádel San Mateo)
-- UUID fijo: 11111111-1111-1111-1111-111111111111
INSERT INTO public.tenants (
  id, slug, name, short_name, type, plan_id, status, is_demo, demo_locked,
  country, city, region, address, timezone, currency, locale,
  contact_email, contact_phone, whatsapp_number, public_pages
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'sanmateo',
  'Centro de Pádel San Mateo',
  'Pádel San Mateo',
  'PADEL_CLUB',
  'elite',
  'active',
  TRUE,
  TRUE,
  'España',
  'Narón',
  'Galicia',
  'Polígono Industrial Río do Pozo, Avda. dos Padelistas 14, Narón, A Coruña',
  'Europe/Madrid',
  'EUR',
  'es-ES',
  'info@padelsanmateo-demo.es',
  '+34 981 38 00 00',
  '+34 600 00 00 00',
  ARRAY['home', 'courts', 'academy', 'tournaments', 'shop', 'contact']
) ON CONFLICT (id) DO NOTHING;

-- Configuración de Marca y Tema Visual del Club
INSERT INTO public.tenant_branding (
  tenant_id, logo_url, icon_url, primary_color, secondary_color, accent_color,
  hero_title, hero_subtitle, hero_image_url, badge_text
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '',
  '',
  '#185c43', -- Verde Bosque Competición Setmio
  '#10221d', -- Grafito Profundo
  '#c7f36b', -- Lima Flúor Padel
  'El Templo del Pádel en Narón y Comarca',
  '8 pistas de última generación con césped oficial WPT, escuela federada, torneos semanales y club social climatizado.',
  'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1920&q=80',
  'CLUB OFICIAL ELITE · GALICIA'
) ON CONFLICT (tenant_id) DO UPDATE SET primary_color = EXCLUDED.primary_color, secondary_color = EXCLUDED.secondary_color, accent_color = EXCLUDED.accent_color;

-- Configuración Operativa del Club
INSERT INTO public.tenant_settings (
  tenant_id, fiscal_name, tax_id, fiscal_address, opening_hours,
  booking_advance_days, cancellation_window_hours, split_payment_allowed, player_match_creation_allowed,
  currency_symbol, whatsapp_widget_enabled, whatsapp_greeting_message
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Padel San Mateo Galicia S.L.',
  'B-15987456',
  'Polígono Río do Pozo, Parcela 14, 15578 Narón (A Coruña)',
  '[{"days": "Lunes a Viernes", "hours": "08:30 - 23:30"}, {"days": "Sábados", "hours": "09:00 - 22:30"}, {"days": "Domingos y Festivos", "hours": "09:00 - 21:30"}]'::jsonb,
  14,
  12,
  TRUE,
  TRUE,
  '€',
  TRUE,
  '¡Hola! Escribo desde la web de Pádel San Mateo. Me gustaría consultar disponibilidad de pistas o información de la escuela.'
) ON CONFLICT (tenant_id) DO NOTHING;

-- Dominios asociados al club
INSERT INTO public.tenant_domains (tenant_id, hostname, is_primary, is_custom, status, ssl_active)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'sanmateo.setmio.com', TRUE, FALSE, 'active', TRUE),
  ('11111111-1111-1111-1111-111111111111', 'padelsanmateo.es', FALSE, TRUE, 'pending_verification', FALSE)
ON CONFLICT (hostname) DO NOTHING;

-- 12.3. Perfiles de Usuario Cubriendo Todos los Roles
-- Nota de vinculación con Supabase Auth:
-- Al crear usuarios en Supabase Auth con estos correos, su id coincidirá con estos UUIDs.
INSERT INTO public.user_profiles (id, email, first_name, last_name, phone, avatar_url, play_level, dominant_hand, preferred_position, is_superadmin)
VALUES
  -- 1. Superadmin Plataforma
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@setmio.com', 'Superadministrador', 'Setmio HQ', '+34 900 12 34 56', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 4.50, 'right', 'both', TRUE),
  
  -- 2. Propietario / Tenant Owner
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'mateo@padelsanmateo.es', 'Mateo', 'Varela (Propietario)', '+34 607 88 99 00', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 5.50, 'right', 'reves', FALSE),
  
  -- 3. Gerente / Admin Club
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'gerencia@padelsanmateo.es', 'Rosa', 'Carballo (Gerente)', '+34 611 22 33 44', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', 3.50, 'right', 'drive', FALSE),
  
  -- 4. Recepción y Pistas
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'recepcion@padelsanmateo.es', 'Iván', 'Gómez (Recepción)', '+34 622 33 44 55', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', 3.00, 'right', 'both', FALSE),
  
  -- 5. Entrenadora Pro / Coach
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'laura.senra@padelsanmateo.es', 'Laura', 'Senra (Entrenadora)', '+34 633 44 55 66', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', 5.00, 'right', 'reves', FALSE),
  
  -- 6. Jugador Estándar / Socio
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'carlos.mendez@galiciapadel.com', 'Carlos', 'Méndez (Socio)', '+34 644 55 66 77', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80', 3.85, 'right', 'drive', FALSE),
  
  -- 7. Responsable de Pro Shop
  ('12121212-1212-1212-1212-121212121212', 'tienda@padelsanmateo.es', 'Adrián', 'Pena (Pro Shop)', '+34 655 66 77 88', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', 3.20, 'right', 'both', FALSE),
  
  -- 8. Organizador de Torneos
  ('13131313-1313-1313-1313-131313131313', 'torneos@padelsanmateo.es', 'Nacho', 'Castro (Competición)', '+34 666 77 88 99', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80', 4.00, 'left', 'reves', FALSE),
  
  -- 9. Capitán de Equipos
  ('14141414-1414-1414-1414-141414141414', 'equipos@padelsanmateo.es', 'Pablo', 'Vello (Capitán)', '+34 677 88 99 00', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', 4.80, 'right', 'both', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Asignación de Roles en el Club
INSERT INTO public.memberships (tenant_id, user_id, role, status, member_number, wallet_balance)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SUPERADMIN', 'active', 'SETMIO-001', 0.00),
  ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'TENANT_OWNER', 'active', 'SM-001', 500.00),
  ('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'TENANT_ADMIN', 'active', 'SM-002', 150.00),
  ('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'RECEPTION', 'active', 'SM-003', 50.00),
  ('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'COACH', 'active', 'SM-COACH-01', 220.00),
  ('11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'PLAYER', 'active', 'SM-SOCIO-108', 45.00),
  ('11111111-1111-1111-1111-111111111111', '12121212-1212-1212-1212-121212121212', 'STORE_MANAGER', 'active', 'SM-SHOP-01', 0.00),
  ('11111111-1111-1111-1111-111111111111', '13131313-1313-1313-1313-131313131313', 'TOURNAMENT_ORGANIZER', 'active', 'SM-TOURN-01', 0.00),
  ('11111111-1111-1111-1111-111111111111', '14141414-1414-1414-1414-141414141414', 'TEAM_MANAGER', 'active', 'SM-TEAM-01', 30.00)
ON CONFLICT (tenant_id, user_id, role) DO NOTHING;

-- 12.4. Pistas de Pádel (8 Pistas Profesionales)
INSERT INTO public.courts (
  id, tenant_id, name, court_type, surface, is_panoramic, is_single, has_lights,
  hourly_rate, display_order, photo_url, smart_device_id, is_light_on, is_active
) VALUES
  ('22222222-2222-2222-2222-000000000001', '11111111-1111-1111-1111-111111111111', 'Pista 1 — Central Panorámica WPT', 'indoor', 'Mondo Supercourt XN Azul Oficial', TRUE, FALSE, TRUE, 30.00, 1, 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80', 'device-relay-1', TRUE, TRUE),
  ('22222222-2222-2222-2222-000000000002', '11111111-1111-1111-1111-111111111111', 'Pista 2 — Panorámica Pro', 'indoor', 'Mondo Supercourt XN Azul', TRUE, FALSE, TRUE, 28.00, 2, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80', 'device-relay-2', FALSE, TRUE),
  ('22222222-2222-2222-2222-000000000003', '11111111-1111-1111-1111-111111111111', 'Pista 3 — Panorámica Pro', 'indoor', 'Mondo Supercourt XN Azul', TRUE, FALSE, TRUE, 28.00, 3, 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&w=800&q=80', 'device-relay-3', TRUE, TRUE),
  ('22222222-2222-2222-2222-000000000004', '11111111-1111-1111-1111-111111111111', 'Pista 4 — Indoor Classic', 'indoor', 'Césped Fibrilado Verde 12mm', FALSE, FALSE, TRUE, 24.00, 4, 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=800&q=80', 'device-relay-4', FALSE, TRUE),
  ('22222222-2222-2222-2222-000000000005', '11111111-1111-1111-1111-111111111111', 'Pista 5 — Indoor Classic', 'indoor', 'Césped Fibrilado Verde 12mm', FALSE, FALSE, TRUE, 24.00, 5, 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&w=800&q=80', NULL, FALSE, TRUE),
  ('22222222-2222-2222-2222-000000000006', '11111111-1111-1111-1111-111111111111', 'Pista 6 — Indoor Black Edition', 'indoor', 'Césped Monofilamento Negro Alto Contraste', TRUE, FALSE, TRUE, 26.00, 6, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80', NULL, FALSE, TRUE),
  ('22222222-2222-2222-2222-000000000007', '11111111-1111-1111-1111-111111111111', 'Pista 7 — Individual 1 vs 1', 'indoor', 'Mondo Supercourt Azul (Ancho 6m)', TRUE, TRUE, TRUE, 18.00, 7, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', NULL, FALSE, TRUE),
  ('22222222-2222-2222-2222-000000000008', '11111111-1111-1111-1111-111111111111', 'Pista 8 — Panorámica Cubierta Exterior', 'covered', 'Mondo Supercourt XN Techo Translúcido', TRUE, FALSE, TRUE, 24.00, 8, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80', NULL, FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 12.5. Reservas de Ejemplo Asociadas a Perfiles y Pistas
INSERT INTO public.bookings (
  id, tenant_id, court_id, court_name, creator_id, creator_name,
  start_time, end_time, status, total_price, payment_status, is_split_payment, access_pin, notes, lighting_auto_activated
) VALUES
  (
    '33333333-3333-3333-3333-000000000001',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-000000000001',
    'Pista 1 — Central Panorámica WPT',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'Carlos Méndez (Socio)',
    NOW() + INTERVAL '2 hours',
    NOW() + INTERVAL '3 hours 30 minutes',
    'confirmed',
    45.00,
    'paid',
    TRUE,
    '4821#',
    'Partidazo de entrenamiento socios. Luces automáticas programadas.',
    TRUE
  ),
  (
    '33333333-3333-3333-3333-000000000002',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-000000000002',
    'Pista 2 — Panorámica Pro',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Mateo Varela (Propietario)',
    NOW() + INTERVAL '5 hours',
    NOW() + INTERVAL '6 hours 30 minutes',
    'confirmed',
    42.00,
    'paid',
    FALSE,
    '7190#',
    'Reserva directa de gerencia con patrocinador.',
    FALSE
  )
ON CONFLICT (id) DO NOTHING;

-- Participantes de las Reservas
INSERT INTO public.booking_participants (booking_id, user_id, name, slot_number, amount, paid, avatar)
VALUES
  ('33333333-3333-3333-3333-000000000001', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Carlos Méndez', 1, 11.25, TRUE, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'),
  ('33333333-3333-3333-3333-000000000001', NULL, 'Manuel Fraga', 2, 11.25, TRUE, NULL),
  ('33333333-3333-3333-3333-000000000001', NULL, 'Alejandro Ramos', 3, 11.25, TRUE, NULL),
  ('33333333-3333-3333-3333-000000000001', NULL, 'David Souto', 4, 11.25, TRUE, NULL)
ON CONFLICT (id) DO NOTHING;

-- 12.6. Partido Abierto de Comunidad ("Play!")
INSERT INTO public.matches (
  id, tenant_id, court_id, court_name, creator_id, creator_name, creator_level,
  start_time, duration_minutes, min_level, max_level, price_per_player, status, competitive
) VALUES (
  '44444444-4444-4444-4444-000000000001',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-000000000003',
  'Pista 3 — Panorámica Pro',
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'Carlos Méndez',
  3.85,
  NOW() + INTERVAL '1 day 4 hours',
  90,
  3.25,
  4.25,
  7.00,
  'open',
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- Jugadores inscritos en el Partido Abierto (Falta 1 para completar)
INSERT INTO public.match_participants (match_id, user_id, name, level, position, paid)
VALUES
  ('44444444-4444-4444-4444-000000000001', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Carlos Méndez', 3.85, 'drive', TRUE),
  ('44444444-4444-4444-4444-000000000001', NULL, 'Brais Quintana', 3.60, 'reves', TRUE),
  ('44444444-4444-4444-4444-000000000001', NULL, 'Marcos Seijo', 3.90, 'both', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 12.7. Equipos y Plantillas de Competición
INSERT INTO public.club_teams (id, tenant_id, name, category, coach, players)
VALUES
  (
    '55555555-5555-5555-5555-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'San Mateo Absoluto Masculino A',
    '1ª Categoría Gallega FGP',
    'Laura Senra',
    ARRAY['Carlos Méndez', 'Pablo Vello', 'Mateo Varela', 'Javier Aneiros', 'Manuel Rico', 'David Naveiras']
  ),
  (
    '55555555-5555-5555-5555-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'San Mateo Femenino Oro',
    '2ª Categoría Provincial',
    'Laura Senra',
    ARRAY['Rosa Carballo', 'Elena Permuy', 'Lucía Casal', 'Sonia Gómez', 'Ana Belén Martínez']
  )
ON CONFLICT (id) DO NOTHING;

-- 12.8. Entrenadores y Grupos de Escuela (Academia)
INSERT INTO public.coaches (
  id, tenant_id, user_id, name, role_title, bio, certification, hourly_rate, rating, photo_url
) VALUES (
  '66666666-6666-6666-6666-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'Laura Senra',
  'Directora de Tecnificación & Entrenadora Pro',
  'Ex-jugadora World Padel Tour y seleccionadora autonómica de menores. Especialista en biomecánica del remate por tres y transición defensa-ataque.',
  'Entrenadora Nacional Nivel 2 FEP / Federación Gallega',
  38.00,
  4.95,
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.academy_groups (
  id, tenant_id, coach_id, coach_name, name, level_category, max_students, current_students, monthly_fee, schedule
) VALUES
  (
    '77777777-7777-7777-7777-000000000001',
    '11111111-1111-1111-1111-111111111111',
    '66666666-6666-6666-6666-000000000001',
    'Laura Senra',
    'Adultos Perfeccionamiento & Táctica',
    'intermedio',
    4,
    3,
    65.00,
    'Martes y Jueves 19:30 - 20:30'
  ),
  (
    '77777777-7777-7777-7777-000000000002',
    '11111111-1111-1111-1111-111111111111',
    '66666666-6666-6666-6666-000000000001',
    'Laura Senra',
    'Menores Competición Alevín/Infantil',
    'menores',
    4,
    4,
    55.00,
    'Lunes y Miércoles 17:30 - 18:30'
  )
ON CONFLICT (id) DO NOTHING;

-- 12.9. Torneo Oficial del Club
INSERT INTO public.tournaments (
  id, tenant_id, title, slug, dates, registration_deadline, entry_fee, banner_url, prizes, description, status
) VALUES (
  '88888888-8888-8888-8888-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'I Open de Primavera Pádel San Mateo & Bullpadel',
  'open-primavera-2026',
  '17 al 19 de Abril de 2026',
  NOW() + INTERVAL '12 days',
  25.00,
  'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=1200&q=80',
  '2.500 € en material Bullpadel Pro, trofeos y fin de semana en balneario.',
  'Torneo oficial federado puntuable para el ranking comarcal. Fase de grupos garantizada de 2 partidos mínimo, welcome pack con camiseta técnica Bullpadel, overgrip y agua.',
  'registration_open'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tournament_categories (tournament_id, name, teams_count, max_teams, format)
VALUES
  ('88888888-8888-8888-8888-000000000001', '1ª Masculina (Nivel 4.5+)', 12, 16, 'groups_and_playoffs'),
  ('88888888-8888-8888-8888-000000000001', '2ª Masculina (Nivel 3.5 a 4.5)', 16, 16, 'groups_and_playoffs'),
  ('88888888-8888-8888-8888-000000000001', 'Femenina Oro (Nivel Abierto)', 10, 16, 'groups_and_playoffs'),
  ('88888888-8888-8888-8888-000000000001', 'Mixto Plata', 14, 16, 'groups_and_playoffs')
ON CONFLICT (id) DO NOTHING;

-- 12.10. Tienda Pro Shop (Material Oficial de Pádel)
INSERT INTO public.products (
  id, tenant_id, category, name, brand, price, compare_at_price, stock, is_featured, image_url, description, specs
) VALUES
  (
    '99999999-9999-9999-9999-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'palas',
    'Bullpadel Vertex 04 2026',
    'Bullpadel',
    299.95,
    330.00,
    8,
    TRUE,
    'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=600&q=80',
    'Pala de máxima potencia con superficie rugosa Topspin y sistema Curvatik. La pala oficial utilizada en pista por los profesionales.',
    '{"Forma": "Diamante", "Balance": "Alto", "Núcleo": "MultiEVA", "Caras": "Xtend Carbon 12K"}'::jsonb
  ),
  (
    '99999999-9999-9999-9999-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'palas',
    'Nox AT10 Genius 18K Agustín Tapia',
    'Nox',
    289.00,
    315.00,
    5,
    TRUE,
    'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&w=600&q=80',
    'Control quirúrgico y salida de bola excepcional con carbono aluminizado 18K. Pala oficial del "Mozart de Catamarca".',
    '{"Forma": "Gota", "Balance": "Medio", "Núcleo": "MLD Black EVA", "Caras": "Carbon Alum 18K"}'::jsonb
  ),
  (
    '99999999-9999-9999-9999-000000000003',
    '11111111-1111-1111-1111-111111111111',
    'accesorios',
    'Cajón de Pelotas Head Padel Pro S (24 botes)',
    'Head',
    119.50,
    135.00,
    15,
    FALSE,
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80',
    'Pelota oficial de velocidad mejorada para climas húmedos y juego dinámico. Máxima durabilidad en pistas de moqueta.',
    '{"Contenido": "24 botes de 3 pelotas", "Presurización": "Alta competición"}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- 12.11. Blog & Contenido Formativo
INSERT INTO public.blog_posts (
  id, tenant_id, title, slug, summary, content, cover_image, author, category, reading_time, published_at
) VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'Las 5 Claves Biomecánicas para Dominar la Bandeja en Pista Rápida',
  'claves-biomecanicas-bandeja-padel',
  'Aprende a preparar el golpe a la altura de los ojos y golpear con efecto lateral cortado para evitar el rebote alto del rival.',
  'La bandeja es el golpe táctico por excelencia del pádel moderno. No busca ganar el punto de forma inmediata, sino neutralizar el globo rival...',
  'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
  'Laura Senra',
  'Técnica & Táctica',
  5,
  NOW() - INTERVAL '2 days'
) ON CONFLICT (id) DO NOTHING;
