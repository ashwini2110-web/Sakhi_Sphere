export type UserRole = 'customer' | 'entrepreneur' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface Business {
  id: string;
  owner_id: string;
  owner_name: string;
  owner_avatar: string;
  name: string;
  slug: string;
  tagline: string;
  story: string;
  category_id: string;
  category_name: string;
  location: string;
  latitude: number;
  longitude: number;
  distance_km?: number;
  whatsapp_number: string;
  banner_url: string;
  logo_url: string;
  voice_note_url?: string;
  voice_note_duration?: string;
  is_verified: boolean;
  elder_vouched: boolean;
  days_in_circle: number;
  rating: number;
  review_count: number;
  patron_count: number;
  delivery_info?: string;
  hours_info?: string;
  created_at: string;
  updated_at: string;
}

export type CatalogItemType = 'product' | 'service';

export interface CatalogItem {
  id: string;
  business_id: string;
  type: CatalogItemType;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration?: string; // For services, e.g. "60 mins"
  image_url: string;
  is_in_stock: boolean;
  created_at: string;
}

export interface Reel {
  id: string;
  business_id: string;
  business_name: string;
  founder_name: string;
  founder_avatar: string;
  founder_location: string;
  category: string;
  video_url: string;
  thumbnail_url: string;
  caption: string;
  duration: string;
  tagged_item_title?: string;
  tagged_item_price?: number;
  likes_count: number;
  bookmarks_count: number;
  shares_count: number;
  whatsapp_number: string;
  audio_title?: string;
  created_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  customer_id: string;
  customer_name: string;
  customer_avatar?: string;
  customer_location?: string;
  rating: number;
  title: string;
  content: string;
  is_verified_patron: boolean;
  created_at: string;
}

export interface SavedBusiness {
  id: string;
  customer_id: string;
  business_id: string;
  created_at: string;
  business?: Business;
}

export interface SuccessStory {
  id: string;
  founder_name: string;
  business_name: string;
  business_id: string;
  location: string;
  avatar_url: string;
  hero_quote: string;
  before_situation: string;
  sisterhood_intervention: string;
  after_outcome: string;
  revenue_multiplier: string;
  audit_escrow_id: string;
  endorsement: string;
}

