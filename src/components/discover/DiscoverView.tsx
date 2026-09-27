import React, { useState, useMemo } from 'react';
import { Business } from '../../types/database';
import { INITIAL_CATEGORIES } from '../../lib/mock-data';
import { toggleSaveBusiness, getSavedBusinessIds } from '../../lib/storage';
import { generateWhatsAppLink, buildGeneralInquiryMessage } from '../../lib/whatsapp';
import { Search, MapPin, Star, Heart, MessageSquare, Sliders, Grid, Compass, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface DiscoverViewProps {
  businesses: Business[];
  initialCategory?: string;
  initialQuery?: string;
  onOpenBusiness: (businessId: string) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  businesses,
  initialCategory,
  initialQuery,
  onOpenBusiness,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [maxDistance, setMaxDistance] = useState<number>(50);
  const [minRating, setMinRating] = useState<number>(0);
  const [elderVouchedOnly, setElderVouchedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'patrons'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'radar'>('grid');
  const [savedIds, setSavedIds] = useState<string[]>(getSavedBusinessIds());

  const handleToggleSave = (businessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveBusiness(businessId);
    setSavedIds(getSavedBusinessIds());
  };

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(biz => {
      // Category filter
      if (selectedCategory !== 'all' && biz.category_id !== selectedCategory) {
        return false;
      }
      // Elder vouched filter
      if (elderVouchedOnly && !biz.elder_vouched) {
        return false;
      }
      // Rating filter
      if (biz.rating < minRating) {
        return false;
      }
      // Distance filter
      if (biz.distance_km && biz.distance_km > maxDistance) {
        return false;
      }
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = biz.name.toLowerCase().includes(q);
        const matchesOwner = biz.owner_name.toLowerCase().includes(q);
        const matchesCategory = biz.category_name.toLowerCase().includes(q);
        const matchesLocation = biz.location.toLowerCase().includes(q);
        const matchesTagline = biz.tagline.toLowerCase().includes(q);
        if (!matchesName && !matchesOwner && !matchesCategory && !matchesLocation && !matchesTagline) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') return (a.distance_km || 999) - (b.distance_km || 999);
      if (sortBy === 'patrons') return b.patron_count - a.patron_count;
      return 0;
    });
  }, [businesses, selectedCategory, elderVouchedOnly, minRating, maxDistance, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A43E25] mb-2">
          <Compass className="w-4 h-4" />
          <span>Sovereign Sisterhood Directory</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#2B211E]">
          Discover Authentic Women Entrepreneurs
        </h1>
        <p className="text-[#6E5B55] text-sm sm:text-base mt-1 max-w-3xl">
          Search generational craftswomen, verified apothecary distillers, and organic textile weavers. Every purchase connects you directly with the maker over WhatsApp with zero platform commissions.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EADBCE] shadow-warm-sm mb-8 space-y-4">
        {/* Top Search Input & Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C86D51]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by craft, founder name, location, or technique..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF5EE] text-sm text-[#2B211E] border border-[#EADBCE] focus:outline-none focus:border-[#A43E25]"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#FBF5EE] p-1 rounded-xl border border-[#EADBCE]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-[#A43E25] shadow-xs' : 'text-[#6E5B55]'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('radar')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === 'radar' ? 'bg-white text-[#1E5E4B] shadow-xs' : 'text-[#6E5B55]'
                }`}
                title="Near Me Radar View"
              >
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">Radar</span>
              </button>
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs font-semibold text-[#2B211E] focus:outline-none cursor-pointer"
            >
              <option value="rating">Top Rated (Sovereign Score)</option>
              <option value="distance">Nearest to Me</option>
              <option value="patrons">Most Patrons</option>
            </select>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#A43E25] text-white shadow-xs'
                : 'bg-[#FBF5EE] hover:bg-[#F7EBE7] text-[#2B211E] border border-[#EADBCE]'
            }`}
          >
            All Disciplines ({businesses.length})
          </button>
          {INITIAL_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#A43E25] text-white shadow-xs'
                  : 'bg-[#FBF5EE] hover:bg-[#F7EBE7] text-[#2B211E] border border-[#EADBCE]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Granular Sliders & Toggles */}
        <div className="pt-2 border-t border-[#EADBCE]/60 flex flex-wrap items-center justify-between gap-4 text-xs text-[#6E5B55]">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Distance Slider */}
            <div className="flex items-center gap-2 bg-[#FBF5EE] px-3 py-1.5 rounded-xl border border-[#EADBCE]">
              <MapPin className="w-3.5 h-3.5 text-[#C86D51]" />
              <span>Radius: <strong className="text-[#2B211E]">{maxDistance} km</strong></span>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-20 accent-[#A43E25] cursor-pointer"
              />
            </div>

            {/* Minimum Rating */}
            <div className="flex items-center gap-1.5 bg-[#FBF5EE] px-3 py-1.5 rounded-xl border border-[#EADBCE]">
              <Star className="w-3.5 h-3.5 text-[#D97706] fill-current" />
              <span>Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-transparent border-none text-xs font-semibold text-[#2B211E] cursor-pointer focus:outline-none"
              >
                <option value="0">Any Score</option>
                <option value="4.8">4.8+ Stars</option>
                <option value="4.9">4.9+ Stars</option>
                <option value="5.0">5.0 Perfect</option>
              </select>
            </div>

            {/* Elder Vouched Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-[#FBF5EE] px-3 py-1.5 rounded-xl border border-[#EADBCE] select-none hover:bg-[#F7EBE7]/60">
              <input
                type="checkbox"
                checked={elderVouchedOnly}
                onChange={(e) => setElderVouchedOnly(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#A43E25] rounded"
              />
              <span className="font-semibold text-[#2B211E] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E5E4B]" />
                Elder Vouched Only
              </span>
            </label>
          </div>

          <div className="text-xs font-medium">
            Showing <strong className="text-[#A43E25]">{filteredBusinesses.length}</strong> sovereign businesses
          </div>
        </div>
      </div>

      {/* Grid or Radar Display */}
      {filteredBusinesses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#EADBCE] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F7EBE7] text-[#A43E25] flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#2B211E]">No makers found matching your criteria</h3>
          <p className="text-sm text-[#6E5B55] max-w-md mx-auto">
            Try expanding your search radius, selecting all categories, or adjusting your rating filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setMaxDistance(100);
              setMinRating(0);
              setElderVouchedOnly(false);
            }}
            className="px-5 py-2.5 rounded-full bg-[#A43E25] text-white text-xs font-bold shadow-warm-sm hover:bg-[#7F2C17]"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((biz) => {
            const isSaved = savedIds.includes(biz.id);
            const whatsappUrl = generateWhatsAppLink(
              biz.whatsapp_number,
              buildGeneralInquiryMessage(biz.name)
            );

            return (
              <div
                key={biz.id}
                onClick={() => onOpenBusiness(biz.id)}
                className="bg-white rounded-3xl border border-[#EADBCE] overflow-hidden shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                {/* Image Banner Header */}
                <div className="relative aspect-[16/10] bg-[#FBF5EE] overflow-hidden">
                  <img
                    src={biz.banner_url}
                    alt={biz.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B211E]/80 via-[#2B211E]/20 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1E5E4B] text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#1E5E4B]" />
                      Elder Verified
                    </span>

                    {/* Bookmark Heart Button */}
                    <button
                      onClick={(e) => handleToggleSave(biz.id, e)}
                      title={isSaved ? 'Remove from Saved' : 'Save Business'}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-red-500 hover:scale-110 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Distance Pill & Location */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#E8A838]" />
                      {biz.location} ({biz.distance_km} km)
                    </span>
                    <span className="text-[10px] opacity-90">Day {biz.days_in_circle} in Circle</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C86D51]">
                        {biz.category_name}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#D97706]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="tabular-nums">{biz.rating}</span>
                        <span className="text-[#6E5B55] text-[10px] font-normal">({biz.review_count})</span>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-lg text-[#2B211E] group-hover:text-[#A43E25] transition-colors leading-tight">
                      {biz.name}
                    </h3>

                    <p className="text-xs text-[#6E5B55] line-clamp-2 leading-relaxed">
                      {biz.tagline}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-xs text-[#6E5B55]">
                      <img
                        src={biz.owner_avatar}
                        alt={biz.owner_name}
                        className="w-5 h-5 rounded-full object-cover border border-[#EADBCE]"
                      />
                      <span className="font-medium text-[#2B211E]">{biz.owner_name}</span>
                      <span>•</span>
                      <span className="text-[11px]">{biz.patron_count} patrons</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#EADBCE]/60 flex items-center gap-2">
                    <button
                      onClick={() => onOpenBusiness(biz.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#A43E25] text-white text-center font-semibold text-xs hover:bg-[#7F2C17] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-xl bg-[#E8F5F0] hover:bg-[#1E5E4B] text-[#1E5E4B] hover:text-white transition-colors flex items-center justify-center border border-[#1E5E4B]/20"
                      title="Chat on WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
