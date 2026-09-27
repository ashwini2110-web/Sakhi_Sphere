import { Business, Category, CatalogItem, Reel, Review, Profile, SuccessStory } from '../types/database';
import categoriesJson from '../data/categories.json';
import businessesJson from '../data/businesses.json';
import catalogJson from '../data/catalog.json';
import reelsJson from '../data/reels.json';
import reviewsJson from '../data/reviews.json';
import usersJson from '../data/users.json';
import successStoriesJson from '../data/success-stories.json';

export const INITIAL_CATEGORIES: Category[] = categoriesJson as Category[];
export const INITIAL_BUSINESSES: Business[] = businessesJson as Business[];
export const INITIAL_CATALOG_ITEMS: CatalogItem[] = catalogJson as CatalogItem[];
export const INITIAL_REELS: Reel[] = reelsJson as Reel[];
export const INITIAL_REVIEWS: Review[] = reviewsJson as Review[];
export const DEMO_PROFILES: Profile[] = usersJson as Profile[];
export const INITIAL_SUCCESS_STORIES: SuccessStory[] = successStoriesJson as SuccessStory[];

// Primary Demo Users
export const DEMO_CUSTOMER: Profile = DEMO_PROFILES[0]; // Claire Henderson (Customer / Conscious Patron)
export const DEMO_ENTREPRENEUR: Profile = DEMO_PROFILES[1]; // Meera Patel (Artisan Entrepreneur)

// Helper lookup functions for instant mock access
export function getBusinessById(id: string): Business | undefined {
  return INITIAL_BUSINESSES.find(b => b.id === id);
}

export function getCatalogByBusinessId(bizId: string): CatalogItem[] {
  return INITIAL_CATALOG_ITEMS.filter(c => c.business_id === bizId);
}

export function getReelsByBusinessId(bizId: string): Reel[] {
  return INITIAL_REELS.filter(r => r.business_id === bizId);
}

export function getReviewsByBusinessId(bizId: string): Review[] {
  return INITIAL_REVIEWS.filter(r => r.business_id === bizId);
}

export function getBusinessesByCategory(categoryId: string): Business[] {
  return INITIAL_BUSINESSES.filter(b => b.category_id === categoryId);
}
