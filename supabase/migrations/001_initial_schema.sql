-- ============================================
-- MULKEEF Real Estate — Database Schema
-- Multilingual SEO-optimized structure
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROPERTIES (language-independent data)
-- ============================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AED',
  bedrooms INT,
  bathrooms INT,
  area_sqft NUMERIC,
  latitude NUMERIC,
  longitude NUMERIC,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'villa', 'penthouse', 'townhouse', 'office', 'plot', 'duplex')),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented', 'reserved')),
  featured BOOLEAN DEFAULT false,
  parking INT DEFAULT 0,
  year_built INT,
  developer TEXT,
  reference_number TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROPERTY TRANSLATIONS (SEO content per locale)
-- ============================================
CREATE TABLE property_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  slug_localized TEXT NOT NULL,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  neighborhood TEXT,
  highlights JSONB DEFAULT '[]',
  og_image_alt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, locale)
);

-- ============================================
-- PROPERTY IMAGES
-- ============================================
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  width INT,
  height INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- IMAGE TRANSLATIONS (alt text per locale)
-- ============================================
CREATE TABLE image_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_id UUID NOT NULL REFERENCES property_images(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  UNIQUE(image_id, locale)
);

-- ============================================
-- OFF-PLAN PROJECTS
-- ============================================
CREATE TABLE offplan_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  developer TEXT NOT NULL,
  completion_date DATE,
  completion_percentage INT DEFAULT 0,
  starting_price NUMERIC,
  currency TEXT DEFAULT 'AED',
  latitude NUMERIC,
  longitude NUMERIC,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'upcoming')),
  payment_plan JSONB DEFAULT '[]',
  brochure_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OFF-PLAN TRANSLATIONS
-- ============================================
CREATE TABLE offplan_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES offplan_projects(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  slug_localized TEXT NOT NULL,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  neighborhood TEXT,
  highlights JSONB DEFAULT '[]',
  UNIQUE(project_id, locale)
);

-- ============================================
-- LEADS (captured from forms, chatbot, etc.)
-- ============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'website',
  source_page TEXT,
  intent TEXT CHECK (intent IN ('buy', 'rent', 'offplan', 'general', 'valuation')),
  property_id UUID REFERENCES properties(id),
  offplan_id UUID REFERENCES offplan_projects(id),
  locale TEXT DEFAULT 'en',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SEO PAGES (static pages translated)
-- ============================================
CREATE TABLE seo_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT NOT NULL,
  locale TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  content JSONB,
  UNIQUE(page_key, locale)
);

-- ============================================
-- BLOG POSTS
-- ============================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  author TEXT DEFAULT 'MULKEEF',
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blog_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  slug_localized TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  UNIQUE(post_id, locale)
);

-- ============================================
-- AREA GUIDES
-- ============================================
CREATE TABLE area_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  cover_image TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  avg_price_sale NUMERIC,
  avg_price_rent NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE area_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area_id UUID NOT NULL REFERENCES area_guides(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  slug_localized TEXT NOT NULL,
  description TEXT,
  lifestyle TEXT,
  meta_title TEXT,
  meta_description TEXT,
  UNIQUE(area_id, locale)
);

-- ============================================
-- AGENT TOOLS (private)
-- ============================================
CREATE TABLE rental_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID,
  tenant_name TEXT NOT NULL,
  tenant_email TEXT,
  tenant_phone TEXT,
  property_address TEXT NOT NULL,
  rent_amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'AED',
  lease_start DATE NOT NULL,
  lease_end DATE NOT NULL,
  payment_frequency TEXT DEFAULT 'monthly',
  security_deposit NUMERIC,
  ejari_number TEXT,
  notes TEXT,
  pdf_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'signed', 'active', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE listing_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID,
  agent_name TEXT,
  property_type TEXT NOT NULL,
  listing_type TEXT NOT NULL,
  address TEXT NOT NULL,
  price NUMERIC,
  bedrooms INT,
  bathrooms INT,
  area_sqft NUMERIC,
  description TEXT,
  photos JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type, listing_type);
CREATE INDEX idx_properties_featured ON properties(featured) WHERE featured = true;
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_property_translations_locale ON property_translations(locale);
CREATE INDEX idx_property_translations_slug ON property_translations(slug_localized);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_blog_published ON blog_posts(published, published_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public read for published properties
CREATE POLICY "Public read properties" ON properties
  FOR SELECT USING (status != 'reserved' OR published_at IS NOT NULL);

CREATE POLICY "Public read translations" ON property_translations
  FOR SELECT USING (true);

CREATE POLICY "Public read images" ON property_images
  FOR SELECT USING (true);

-- Leads: anyone can insert, only authenticated can read
CREATE POLICY "Anyone can submit leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated read leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- UPDATED_AT trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
