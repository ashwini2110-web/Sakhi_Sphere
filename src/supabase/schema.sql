-- ==============================================================================
-- SAKHISPHERE PRODUCTION DATABASE SCHEMA (PostgreSQL / Supabase)
-- Vision: "Trust the Woman. Believe in the Craft. Back the Vision."
-- Tables: profiles, businesses, categories, catalog_items, reels, reviews, saved_businesses
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Enumerations
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('customer', 'entrepreneur', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE catalog_item_type AS ENUM ('product', 'service');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles Table (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role_type NOT NULL DEFAULT 'customer',
    avatar_url TEXT,
    phone TEXT,
    bio TEXT,
    location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Businesses Table (Women Entrepreneurs)
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT,
    story TEXT,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    location TEXT NOT NULL,
    latitude NUMERIC(10, 6) DEFAULT 0.0,
    longitude NUMERIC(10, 6) DEFAULT 0.0,
    whatsapp_number TEXT NOT NULL,
    banner_url TEXT,
    logo_url TEXT,
    voice_note_url TEXT,
    voice_note_duration TEXT DEFAULT '0:45',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    elder_vouched BOOLEAN NOT NULL DEFAULT FALSE,
    days_in_circle INTEGER NOT NULL DEFAULT 1,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    review_count INTEGER NOT NULL DEFAULT 0,
    patron_count INTEGER NOT NULL DEFAULT 0,
    delivery_info TEXT,
    hours_info TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Catalog Items (Products & Services)
CREATE TABLE IF NOT EXISTS public.catalog_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    type catalog_item_type NOT NULL DEFAULT 'product',
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    duration TEXT, -- Optional duration for services, e.g. "60 mins"
    image_url TEXT,
    is_in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Sisterhood Reels Table
CREATE TABLE IF NOT EXISTS public.reels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    caption TEXT NOT NULL,
    duration TEXT NOT NULL DEFAULT '0:60',
    category TEXT NOT NULL DEFAULT 'Craft Masterclass',
    tagged_item_title TEXT,
    tagged_item_price NUMERIC(10, 2),
    likes_count INTEGER NOT NULL DEFAULT 0,
    bookmarks_count INTEGER NOT NULL DEFAULT 0,
    shares_count INTEGER NOT NULL DEFAULT 0,
    views_count INTEGER NOT NULL DEFAULT 0,
    audio_title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Reviews Table (Verified Patron Reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_verified_patron BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Saved Businesses Table (Customer Bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_customer_business_bookmark UNIQUE (customer_id, business_id)
);

-- ==============================================================================
-- INDEXES FOR HIGH-THROUGHPUT SEARCH & RADAR QUERIES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_businesses_category ON public.businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_verified ON public.businesses(is_verified, elder_vouched);
CREATE INDEX IF NOT EXISTS idx_catalog_items_business ON public.catalog_items(business_id);
CREATE INDEX IF NOT EXISTS idx_reels_business ON public.reels(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_business ON public.reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_saved_businesses_customer ON public.saved_businesses(customer_id);

-- ==============================================================================
-- AUTOMATED UPDATED_AT TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_businesses_updated_at ON public.businesses;
CREATE TRIGGER trigger_update_businesses_updated_at
    BEFORE UPDATE ON public.businesses
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_catalog_items_updated_at ON public.catalog_items;
CREATE TRIGGER trigger_update_catalog_items_updated_at
    BEFORE UPDATE ON public.catalog_items
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_businesses ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Categories Policies
CREATE POLICY "Categories are readable by everyone" 
    ON public.categories FOR SELECT USING (true);

-- 3. Businesses Policies
CREATE POLICY "Businesses are viewable by everyone" 
    ON public.businesses FOR SELECT USING (true);

CREATE POLICY "Entrepreneurs can insert own business" 
    ON public.businesses FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Entrepreneurs can update own business" 
    ON public.businesses FOR UPDATE USING (auth.uid() = owner_id);

-- 4. Catalog Items Policies
CREATE POLICY "Catalog items are viewable by everyone" 
    ON public.catalog_items FOR SELECT USING (true);

CREATE POLICY "Entrepreneurs can insert products/services for own business" 
    ON public.catalog_items FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE id = business_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Entrepreneurs can update own catalog items" 
    ON public.catalog_items FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE id = business_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Entrepreneurs can delete own catalog items" 
    ON public.catalog_items FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE id = business_id AND owner_id = auth.uid()
        )
    );

-- 5. Reels Policies
CREATE POLICY "Reels are viewable by everyone" 
    ON public.reels FOR SELECT USING (true);

CREATE POLICY "Entrepreneurs can post reels for own business" 
    ON public.reels FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE id = business_id AND owner_id = auth.uid()
        )
    );

-- 6. Reviews Policies
CREATE POLICY "Reviews are viewable by everyone" 
    ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can submit a review" 
    ON public.reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- 7. Saved Businesses Policies
CREATE POLICY "Users can view their own saved businesses" 
    ON public.saved_businesses FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can bookmark a business" 
    ON public.saved_businesses FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can remove a bookmark" 
    ON public.saved_businesses FOR DELETE USING (auth.uid() = customer_id);

-- ==============================================================================
-- INITIAL CRAFT CATEGORY SEEDS
-- ==============================================================================
INSERT INTO public.categories (id, name, slug, icon, description) VALUES
('cat-handloom', 'Handloom Weaves', 'handloom-weaves', 'handyman', 'Ancient pit-loom & pedal-loom cotton, wool and tussar silks'),
('cat-botanical', 'Botanical Oils', 'botanical-oils', 'spa', 'Wildcrafted serums, distillations, and cold-pressed botanical essences'),
('cat-ceramics', 'Ceramics & Clay', 'ceramics-clay', 'palette', 'Stoneware, terracotta, and pit-fired chawan pottery'),
('cat-filigree', 'Filigree Jewelry', 'filigree-jewelry', 'diamond', 'Fine wire filigree and reclaimed brass artisan jewelry'),
('cat-spices', 'Heirloom Spices', 'heirloom-spices', 'nutrition', 'Monsoon-harvested saffron, single-origin cardamom & zaatar'),
('cat-shea', 'Shea & Nilotica', 'shea-nilotica', 'local_florist', 'Cold-pressed wild Nilotica butter directly from women co-ops'),
('cat-blockprint', 'Block Printing', 'block-printing', 'brush', 'Ajrakh resist and hand-carved teak block textile prints'),
('cat-metals', 'Temple Metals', 'temple-metals', 'candlestick', 'Acoustically tuned brass bells and lost-wax cast bronzes'),
('cat-paper', 'Handmade Paper', 'handmade-paper', 'history_edu', 'Recycled cotton rag, botanical petal stationery & journals'),
('cat-digital', 'Digital Tools', 'digital-tools', 'terminal', 'Sovereign open-source inventory workflows & artisan spreadsheets')
ON CONFLICT (id) DO NOTHING;
