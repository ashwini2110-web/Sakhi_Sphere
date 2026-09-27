import { Business, CatalogItem, Reel, Review, SavedBusiness, Profile, UserRole } from '../types/database';
import { INITIAL_BUSINESSES, INITIAL_CATEGORIES, INITIAL_CATALOG_ITEMS, INITIAL_REELS, INITIAL_REVIEWS, DEMO_PROFILES } from './mock-data';

const STORAGE_KEYS = {
  USER: 'sakhisphere_current_user',
  BUSINESSES: 'sakhisphere_businesses',
  CATALOG: 'sakhisphere_catalog',
  REELS: 'sakhisphere_reels',
  REVIEWS: 'sakhisphere_reviews',
  SAVED: 'sakhisphere_saved_businesses',
  FOLLOWED: 'sakhisphere_followed_businesses',
};

// Default initial user (Conscious Patron by default, easily switched to Entrepreneur)
export const DEFAULT_USER: Profile = DEMO_PROFILES[0]; // Claire Henderson (Customer)
export const DEFAULT_ENTREPRENEUR: Profile = DEMO_PROFILES[1]; // Meera Patel (Entrepreneur)

export function resetToMockData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.BUSINESSES);
    localStorage.removeItem(STORAGE_KEYS.CATALOG);
    localStorage.removeItem(STORAGE_KEYS.REELS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.SAVED);
    localStorage.removeItem(STORAGE_KEYS.FOLLOWED);
  } catch (e) {
    console.error(e);
  }
}

export function getStoredUser(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_USER;
}

export function setStoredUser(user: Profile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredBusinesses(): Business[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_BUSINESSES;
}

export function saveBusiness(business: Business): void {
  const all = getStoredBusinesses();
  const idx = all.findIndex(b => b.id === business.id);
  let updated: Business[];
  if (idx >= 0) {
    updated = [...all];
    updated[idx] = business;
  } else {
    updated = [business, ...all];
  }
  localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(updated));
}

export function getStoredCatalog(businessId?: string): CatalogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATALOG);
    const all: CatalogItem[] = raw ? JSON.parse(raw) : INITIAL_CATALOG_ITEMS;
    if (businessId) {
      return all.filter(item => item.business_id === businessId);
    }
    return all;
  } catch (e) {
    console.error(e);
    return INITIAL_CATALOG_ITEMS;
  }
}

export function addCatalogItem(item: CatalogItem): void {
  const all = getStoredCatalog();
  const updated = [item, ...all];
  localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(updated));
}

export function getStoredReels(): Reel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REELS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_REELS;
}

export function addReel(reel: Reel): void {
  const all = getStoredReels();
  const updated = [reel, ...all];
  localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(updated));
}

export function likeReel(reelId: string): number {
  const all = getStoredReels();
  let newCount = 0;
  const updated = all.map(r => {
    if (r.id === reelId) {
      newCount = r.likes_count + 1;
      return { ...r, likes_count: newCount };
    }
    return r;
  });
  localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(updated));
  return newCount;
}

export function bookmarkReel(reelId: string): number {
  const all = getStoredReels();
  let newCount = 0;
  const updated = all.map(r => {
    if (r.id === reelId) {
      newCount = r.bookmarks_count + 1;
      return { ...r, bookmarks_count: newCount };
    }
    return r;
  });
  localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(updated));
  return newCount;
}

export function getStoredReviews(businessId?: string): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    const all: Review[] = raw ? JSON.parse(raw) : INITIAL_REVIEWS;
    if (businessId) {
      return all.filter(r => r.business_id === businessId);
    }
    return all;
  } catch (e) {
    console.error(e);
    return INITIAL_REVIEWS;
  }
}

export function addReview(review: Review): void {
  const all = getStoredReviews();
  const updated = [review, ...all];
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));

  // Update business average rating & review count
  const businesses = getStoredBusinesses();
  const bIndex = businesses.findIndex(b => b.id === review.business_id);
  if (bIndex >= 0) {
    const bizReviews = updated.filter(r => r.business_id === review.business_id);
    const totalScore = bizReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avgScore = Number((totalScore / bizReviews.length).toFixed(2));
    businesses[bIndex].rating = avgScore;
    businesses[bIndex].review_count = bizReviews.length;
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
  }
}

export function getSavedBusinessIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return ['biz-fatima'];
}

export function toggleSaveBusiness(businessId: string): boolean {
  const current = getSavedBusinessIds();
  let updated: string[];
  let isSaved = false;
  if (current.includes(businessId)) {
    updated = current.filter(id => id !== businessId);
    isSaved = false;
  } else {
    updated = [...current, businessId];
    isSaved = true;
  }
  localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(updated));
  return isSaved;
}

export function getFollowedFounderIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FOLLOWED);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return ['usr-meera'];
}

export function toggleFollowFounder(founderId: string): boolean {
  const current = getFollowedFounderIds();
  let updated: string[];
  let isFollowing = false;
  if (current.includes(founderId)) {
    updated = current.filter(id => id !== founderId);
    isFollowing = false;
  } else {
    updated = [...current, founderId];
    isFollowing = true;
  }
  localStorage.setItem(STORAGE_KEYS.FOLLOWED, JSON.stringify(updated));
  return isFollowing;
}

/**
 * Web Audio Synthesizer for Authentic Sister Voice Notes and Sound Bites
 * Ensures clicking "Play Fatima's Voice", "Meera's Voice", or reel sound clips works reliably.
 */
let activeAudioContext: AudioContext | null = null;
let activeAudioNodes: AudioNode[] = [];

export function playArtisanVoiceNote(founderName: string, onStop?: () => void): () => void {
  try {
    if (activeAudioContext) {
      activeAudioContext.close();
      activeAudioContext = null;
    }

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return () => {};

    const ctx = new AudioCtx();
    activeAudioContext = ctx;

    // Harmonic warm frequencies that emulate acoustic temple bells, strings, and warm voice overtones
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    // Warm resonant pitch sequence based on artisan tradition
    const baseFreq = founderName.includes('Fatima') ? 220 : founderName.includes('Sunita') ? 260 : 310;
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 1.2);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq, now + 2.5);

    osc2.frequency.setValueAtTime(baseFreq * 1.5, now);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2, now + 1.8);

    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 4);
    osc2.stop(now + 4);

    activeAudioNodes = [osc1, osc2, gainNode];

    const timer = setTimeout(() => {
      if (onStop) onStop();
    }, 4000);

    return () => {
      clearTimeout(timer);
      try {
        ctx.close();
      } catch (e) {
        // ignore
      }
      if (onStop) onStop();
    };
  } catch (e) {
    console.error('Audio synthesizer error:', e);
    return () => {};
  }
}
