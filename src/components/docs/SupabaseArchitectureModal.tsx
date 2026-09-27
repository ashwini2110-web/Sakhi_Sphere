import React, { useState } from 'react';
import { X, Copy, Check, Database, Terminal, FileCode, Server, Layers, ShieldCheck, Rocket } from 'lucide-react';

interface SupabaseArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseArchitectureModal: React.FC<SupabaseArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'env' | 'steps' | 'folders'>('sql');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const sqlSchemaCode = `-- ==============================================================================
-- SAKHISPHERE PRODUCTION DATABASE SCHEMA (PostgreSQL / Supabase)
-- Vision: "Trust the Woman. Believe in the Craft. Back the Vision."
-- Tables: profiles, businesses, categories, catalog_items, reels, reviews, saved_businesses
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Enums
CREATE TYPE user_role_type AS ENUM ('customer', 'entrepreneur', 'admin');
CREATE TYPE catalog_item_type AS ENUM ('product', 'service');

-- 1. Profiles Table (Linked with Supabase auth.users)
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

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Businesses Table (Women Entrepreneurs)
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

-- 4. Catalog Items (Products & Services)
CREATE TABLE IF NOT EXISTS public.catalog_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    type catalog_item_type NOT NULL DEFAULT 'product',
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    duration TEXT,
    image_url TEXT,
    is_in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Sisterhood Reels Table
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

-- 6. Reviews Table (Verified Patron Reviews)
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

-- 7. Saved Businesses Table (Customer Bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_customer_business_bookmark UNIQUE (customer_id, business_id)
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Businesses are viewable by everyone" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Entrepreneurs can insert own business" ON public.businesses FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Entrepreneurs can update own business" ON public.businesses FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Catalog items are viewable by everyone" ON public.catalog_items FOR SELECT USING (true);
CREATE POLICY "Reels are viewable by everyone" ON public.reels FOR SELECT USING (true);
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can submit a review" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users can view own bookmarks" ON public.saved_businesses FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Users can toggle bookmarks" ON public.saved_businesses FOR INSERT WITH CHECK (auth.uid() = customer_id);`;

  const envCode = `# .env.local (Next.js 15 + Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_PREFIX=https://wa.me/
GEMINI_API_KEY=your_gemini_api_key_here`;

  const folderStructureCode = `sakhisphere/
├── app/                         # Next.js 15 App Router
│   ├── layout.tsx               # Root Layout with Sisterhood Top Banner & Theme
│   ├── page.tsx                 # Home Page (Hero, Reels preview, Impact, Founders)
│   ├── discover/
│   │   └── page.tsx             # Discover & Geolocation Radar Search
│   ├── business/[slug]/
│   │   └── page.tsx             # Dynamic Business Profile (Catalog, Voice memo, Reviews)
│   ├── reels/
│   │   └── page.tsx             # Fullscreen Sisterhood Reels Feed
│   ├── dashboard/
│   │   ├── entrepreneur/page.tsx # Maker Studio Hub (Add products, reels, ledger)
│   │   └── patron/page.tsx       # Customer Space (Bookmarks, my reviews)
│   ├── login/page.tsx           # Authentication with Role Selection
│   └── api/
│       └── whatsapp/route.ts    # WhatsApp deep link & order tracking bridge
├── components/
│   ├── ui/                      # ShadCN UI components (Button, Dialog, Slider, Tabs)
│   ├── layout/                  # Navbar, Footer, Sisterhood Pledge Banner
│   ├── reels/                   # ReelsPlayer, InteractionRail, TaggedProductBox
│   └── voice/                   # VoiceMemoPlayer (Acoustic audio synthesizer)
├── lib/
│   ├── supabase/                # Client, Server, and Middleware Supabase helpers
│   ├── whatsapp.ts              # Pre-formatted message templates
│   └── storage.ts               # Storage state & caching
├── supabase/
│   └── schema.sql               # Production PostgreSQL Migration with RLS
├── types/
│   └── database.ts              # Database TypeScript Definitions
└── package.json`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#EADBCE] max-w-4xl w-full h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#EADBCE] flex items-center justify-between bg-[#FBF5EE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E5E4B] text-white flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-xl text-[#2B211E]">
                  SakhiSphere Supabase &amp; Next.js 15 Architecture
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5F0] text-[#1E5E4B] text-[10px] font-bold uppercase tracking-wider">
                  Production Ready
                </span>
              </div>
              <p className="text-xs text-[#6E5B55] mt-0.5">
                Complete database migrations, Row Level Security policies, folder tree, and deployment guide.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#F7EBE7] flex items-center justify-center text-[#6E5B55] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center px-6 pt-3 border-b border-[#EADBCE] bg-[#FBF5EE]/50 gap-2">
          {[
            { id: 'sql', label: 'Supabase schema.sql', icon: Database },
            { id: 'env', label: 'Environment Variables (.env)', icon: FileCode },
            { id: 'steps', label: 'Implementation Steps (1 - 9)', icon: Rocket },
            { id: 'folders', label: 'Next.js 15 Folder Tree', icon: Layers },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#A43E25] text-[#A43E25] bg-white rounded-t-xl'
                    : 'border-transparent text-[#6E5B55] hover:text-[#2B211E]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF6F0]">
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6E5B55] font-medium">
                  Run this SQL in your <strong>Supabase Dashboard &gt; SQL Editor</strong> to bootstrap the 7 core tables and RLS security policies.
                </span>
                <button
                  onClick={() => copyToClipboard(sqlSchemaCode, 'sql')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A43E25] text-white text-xs font-bold shadow-xs hover:bg-[#7F2C17] cursor-pointer"
                >
                  {copied === 'sql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'sql' ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-[#1e293b] text-[#f8fafc] text-xs font-mono overflow-x-auto leading-relaxed border border-[#334155]">
                {sqlSchemaCode}
              </pre>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6E5B55] font-medium">
                  Add these to your local <code className="text-[#A43E25]">.env.local</code> and Vercel Project Settings.
                </span>
                <button
                  onClick={() => copyToClipboard(envCode, 'env')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A43E25] text-white text-xs font-bold shadow-xs hover:bg-[#7F2C17] cursor-pointer"
                >
                  {copied === 'env' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'env' ? 'Copied Env!' : 'Copy .env.local'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-[#1e293b] text-[#f8fafc] text-xs font-mono overflow-x-auto leading-relaxed border border-[#334155]">
                {envCode}
              </pre>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-6">
              {[
                {
                  step: 'Step 1: Project Setup',
                  desc: 'Initialize Next.js 15 App Router with TypeScript, Tailwind CSS v4, Lucide React, and Motion.',
                  code: 'npx create-next-app@latest sakhisphere --typescript --tailwind --app\nnpm install @supabase/supabase-js lucide-react motion'
                },
                {
                  step: 'Step 2: Supabase Setup',
                  desc: 'Create a new project on supabase.com, retrieve SUPABASE_URL and SUPABASE_ANON_KEY from Project Settings > API.',
                  code: 'npx supabase init\nnpx supabase db push'
                },
                {
                  step: 'Step 3: Authentication & Role Selection',
                  desc: 'Configure auth.users with public.profiles trigger. Set user metadata role to "entrepreneur" or "customer".',
                  code: '// supabase.auth.signUp({ email, password, options: { data: { role, full_name } } })'
                },
                {
                  step: 'Step 4: Database Migrations',
                  desc: 'Execute schema.sql creating profiles, businesses, categories, catalog_items, reels, reviews, saved_businesses with RLS.',
                  code: 'cat supabase/schema.sql | psql $DATABASE_URL'
                },
                {
                  step: 'Step 5: Business Profiles Implementation',
                  desc: 'Implement dynamic route /business/[slug] with server-rendered metadata, audio synthesizer, and products tab.',
                  code: 'export default async function BusinessPage({ params }: { params: { slug: string } })'
                },
                {
                  step: 'Step 6: Discover Page with Geolocation Radar',
                  desc: 'Implement haversine distance filtering and category filtering with instant client-side response.',
                  code: 'SELECT *, (6371 * acos(...)) AS distance_km FROM businesses HAVING distance_km < $maxDistance;'
                },
                {
                  step: 'Step 7: Reviews & Mutual Respect Rating',
                  desc: 'Store verified patron reviews and update business sovereign rating trigger automatically.',
                  code: 'INSERT INTO reviews (business_id, customer_id, rating, title, content) VALUES (...);'
                },
                {
                  step: 'Step 8: Sisterhood Reels Immersive Feed',
                  desc: 'Vertical 9:16 reels feed with like counter, tagged product inquiry box, and direct WhatsApp bridge.',
                  code: '<ReelsFeedView reels={reels} onOpenFounderProfile={...} />'
                },
                {
                  step: 'Step 9: Production Deployment',
                  desc: 'Deploy to Vercel with zero-configuration Next.js 15 build and configure custom domain.',
                  code: 'vercel --prod'
                }
              ].map(s => (
                <div key={s.step} className="p-4 bg-white rounded-2xl border border-[#EADBCE] space-y-2">
                  <h4 className="font-display font-bold text-sm text-[#A43E25]">{s.step}</h4>
                  <p className="text-xs text-[#6E5B55]">{s.desc}</p>
                  <pre className="p-2.5 rounded-xl bg-[#1e293b] text-white text-[11px] font-mono overflow-x-auto">
                    {s.code}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'folders' && (
            <div className="space-y-4">
              <span className="text-xs text-[#6E5B55] font-medium">
                Complete Next.js 15 App Router production folder architecture:
              </span>
              <pre className="p-4 rounded-2xl bg-[#1e293b] text-[#f8fafc] text-xs font-mono overflow-x-auto leading-relaxed border border-[#334155]">
                {folderStructureCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
