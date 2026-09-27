import React, { useState } from 'react';
import { Reel } from '../../types/database';
import { likeReel, bookmarkReel, toggleFollowFounder, getFollowedFounderIds } from '../../lib/storage';
import { generateWhatsAppLink, buildProductInquiryMessage } from '../../lib/whatsapp';
import { showToast } from '../ui/Toast';
import { Play, Pause, Heart, Bookmark, Share2, MessageSquare, Volume2, VolumeX, ArrowRight, Video, Sparkles, Check } from 'lucide-react';

interface SisterhoodReelsShowcaseProps {
  reels: Reel[];
  onOpenReelsFeed: (reelId?: string) => void;
  onOpenFounderProfile: (businessId: string) => void;
  onUploadReelClick: () => void;
}

export const SisterhoodReelsShowcase: React.FC<SisterhoodReelsShowcaseProps> = ({
  reels,
  onOpenReelsFeed,
  onOpenFounderProfile,
  onUploadReelClick,
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [likedReelIds, setLikedReelIds] = useState<Record<string, boolean>>({});
  const [bookmarkedReelIds, setBookmarkedReelIds] = useState<Record<string, boolean>>({});
  const [followedFounders, setFollowedFounders] = useState<string[]>(getFollowedFounderIds());
  const [showAllReels, setShowAllReels] = useState(false);

  const categories = [
    { label: 'All Craft Reels', icon: 'apps' },
    { label: 'Live Distillations & Formulas', icon: 'science' },
    { label: 'Masterclass & Loom Craft', icon: 'handyman' },
    { label: 'Fresh Drops & Kiln Openings', icon: 'local_fire_department' },
    { label: 'Honest Founder Lessons', icon: 'record_voice_over' }
  ];

  const handleLike = (reelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const count = likeReel(reelId);
    setLikedReelIds(prev => ({ ...prev, [reelId]: !prev[reelId] }));
  };

  const handleBookmark = (reelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    bookmarkReel(reelId);
    setBookmarkedReelIds(prev => ({ ...prev, [reelId]: !prev[reelId] }));
  };

  const handleFollow = (founderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollowFounder(founderId);
    setFollowedFounders(getFollowedFounderIds());
  };

  const handleShare = (reel: Reel, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: reel.caption,
        text: `Watch ${reel.founder_name} on SakhiSphere Sisterhood Reels: ${reel.caption}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Reel link copied to clipboard!', 'success');
    }
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-[#FFFDF9] via-[#FBF5EE]/80 to-[#FFFDF9] border-y border-[#EADBCE] relative overflow-hidden" id="sisterhood-reels">
      {/* Background accents */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#E8A838]/15 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#A43E25]/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0EC] text-[#A43E25] text-xs font-bold tracking-wider uppercase mb-3 border border-[#EADBCE]/70 shadow-warm-sm">
              <span className="material-symbols-outlined text-base animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_circle
              </span>
              <span>Primary Discovery Showcase • Human-First Commerce</span>
            </div>
            
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[44px] text-[#2B211E] tracking-tight leading-tight">
              Sisterhood Reels: Craft, Life &amp; Launches
            </h2>
            
            <p className="text-[#6E5B55] text-base sm:text-lg mt-2 leading-relaxed">
              Step straight into living workshops. Discover generational crafts, verify fair-trade provenance, and support sovereign matriarchs with zero algorithmic bias.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#EADBCE] text-xs sm:text-sm font-semibold text-[#2B211E] shadow-warm-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>1,840+ Live Artisan Stories</span>
            </div>

            <button
              onClick={onUploadReelClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#A43E25] text-white font-semibold text-xs sm:text-sm shadow-warm-sm hover:bg-[#7F2C17] transition-all cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Post Your Reel</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat, idx) => {
            const isActive = (idx === 0 && activeCategory === 'All') || activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(idx === 0 ? 'All' : cat.label)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#A43E25] text-white shadow-warm-sm'
                    : 'bg-white hover:bg-[#F7EBE7]/60 border border-[#EADBCE] text-[#2B211E]'
                }`}
              >
                <span className="material-symbols-outlined text-base">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {(showAllReels ? reels : reels.slice(0, 10)).map((reel) => {
            const isLiked = likedReelIds[reel.id];
            const isBookmarked = bookmarkedReelIds[reel.id];
            const isPlaying = playingId === reel.id;
            const isFollowing = followedFounders.includes(reel.business_id);

            const inquiryWhatsAppUrl = generateWhatsAppLink(
              reel.whatsapp_number,
              buildProductInquiryMessage(
                reel.business_name,
                reel.tagged_item_title || 'Handcrafted Collection',
                reel.tagged_item_price
              )
            );

            return (
              <div
                key={reel.id}
                onClick={() => onOpenReelsFeed(reel.id)}
                className="group relative rounded-3xl overflow-hidden aspect-[9/16] bg-white border border-[#EADBCE]/90 shadow-warm-md hover:shadow-warm-lg transition-all duration-500 flex flex-col justify-between cursor-pointer"
              >
                {/* Visual Thumbnail */}
                <img
                  src={reel.thumbnail_url}
                  alt={reel.caption}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Contrast Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B211E]/95 via-[#2B211E]/40 to-[#2B211E]/60 pointer-events-none" />

                {/* Top Badge & Duration */}
                <div className="relative z-10 p-4 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#1E5E4B] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    {reel.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-medium">
                      {reel.duration}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMuted(!muted);
                      }}
                      className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Right Floating Interaction Rail */}
                <div className="absolute right-3 bottom-28 z-20 flex flex-col items-center gap-3">
                  {/* Follow */}
                  <button
                    onClick={(e) => handleFollow(reel.business_id, e)}
                    className="flex flex-col items-center gap-0.5 group/btn cursor-pointer"
                    title={isFollowing ? 'Following sister' : 'Follow sister'}
                  >
                    <div className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-warm-sm group-hover/btn:scale-110 transition-transform ${
                      isFollowing ? 'bg-[#A43E25] text-white' : 'bg-white/90 text-[#A43E25]'
                    }`}>
                      {isFollowing ? <Check className="w-4 h-4" /> : <span className="material-symbols-outlined text-lg">person_add</span>}
                    </div>
                    <span className="text-[9px] font-bold text-white drop-shadow">
                      {isFollowing ? 'Joined' : 'Follow'}
                    </span>
                  </button>

                  {/* Likes */}
                  <button
                    onClick={(e) => handleLike(reel.id, e)}
                    className="flex flex-col items-center gap-0.5 group/btn cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-red-500 flex items-center justify-center shadow-warm-sm group-hover/btn:scale-110 transition-transform">
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </div>
                    <span className="text-[10px] font-bold text-white drop-shadow">
                      {((reel.likes_count + (isLiked ? 1 : 0)) / 1000).toFixed(1)}k
                    </span>
                  </button>

                  {/* Bookmark */}
                  <button
                    onClick={(e) => handleBookmark(reel.id, e)}
                    className="flex flex-col items-center gap-0.5 group/btn cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-warm-sm group-hover/btn:scale-110 transition-transform ${
                      isBookmarked ? 'text-[#D9822B]' : 'text-[#2B211E]'
                    }`}>
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </div>
                    <span className="text-[10px] font-bold text-white drop-shadow">
                      {(reel.bookmarks_count / 1000).toFixed(1)}k
                    </span>
                  </button>

                  {/* Share */}
                  <button
                    onClick={(e) => handleShare(reel, e)}
                    className="flex flex-col items-center gap-0.5 group/btn cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-[#2B211E] flex items-center justify-center shadow-warm-sm group-hover/btn:scale-110 transition-transform">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-white drop-shadow">
                      {(reel.shares_count / 1000).toFixed(1)}k
                    </span>
                  </button>

                  {/* Direct WhatsApp button */}
                  <a
                    href={inquiryWhatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-warm-sm transition-transform hover:scale-110"
                    title="Direct WhatsApp Inquiry"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </a>
                </div>

                {/* Bottom Story & Tagged Product Module */}
                <div className="relative z-10 p-4 pr-14 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-9 h-9 rounded-full border-2 border-white/90 overflow-hidden shrink-0 shadow-xs">
                        <img
                          src={reel.founder_avatar}
                          alt={reel.founder_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-bold text-xs truncate flex items-center gap-1">
                          {reel.founder_name}
                          <span className="material-symbols-outlined text-[#D97706] text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            verified
                          </span>
                        </div>
                        <span className="text-[10px] text-white/80 truncate block">
                          {reel.business_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-white font-medium line-clamp-2 leading-snug">
                    {reel.caption}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFounderProfile(reel.business_id);
                      }}
                      className="text-[10px] font-semibold text-[#FEF3C7] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      View Profile <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Tagged Product Box */}
                  {reel.tagged_item_title && (
                    <div className="mt-1 p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#EADBCE] flex items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="material-symbols-outlined text-[#A43E25] text-sm">shopping_bag</span>
                        <span className="text-[11px] font-bold text-[#2B211E] truncate">
                          Tagged: {reel.tagged_item_title} • ${reel.tagged_item_price}
                        </span>
                      </div>
                      <a
                        href={inquiryWhatsAppUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-0.5 rounded-full bg-[#A43E25] text-white text-[10px] font-bold hover:bg-[#7F2C17] shrink-0"
                      >
                        Inquire
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* View All & Fullscreen Feed Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
          <button
            onClick={() => setShowAllReels(!showAllReels)}
            className="px-6 py-2.5 rounded-full border border-[#A43E25] text-[#A43E25] font-bold text-xs sm:text-sm hover:bg-[#F7EBE7] transition-all cursor-pointer"
          >
            {showAllReels ? 'Show Less Reels' : `View All ${reels.length} Craft Reels`}
          </button>

          <button
            onClick={() => onOpenReelsFeed()}
            className="px-6 py-2.5 rounded-full bg-[#A43E25] text-white font-bold text-xs sm:text-sm hover:bg-[#7F2C17] shadow-warm-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Open Immersive 9:16 Feed</span>
          </button>
        </div>

        {/* Upload Reel Invite Card */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#FBF5EE] via-[#F4EAE0] to-[#FBF5EE] border border-[#EADBCE] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-warm-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#A43E25] text-white flex items-center justify-center shrink-0 shadow-warm-sm">
              <span className="material-symbols-outlined text-2xl">video_call</span>
            </div>
            <div>
              <h4 className="font-display font-bold text-lg text-[#2B211E]">
                Are you a maker, artisan, or founder sister?
              </h4>
              <p className="text-xs sm:text-sm text-[#6E5B55] mt-0.5">
                Upload your 60-second craft reel to reach 240,000+ conscious patrons worldwide. Zero algorithms favoring corporate brands.
              </p>
            </div>
          </div>

          <button
            onClick={onUploadReelClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#A43E25] text-white font-semibold text-xs sm:text-sm shadow-warm-sm hover:bg-[#7F2C17] hover:scale-[1.02] transition-all shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">cloud_upload</span>
            <span>Upload Your Story / Reel</span>
          </button>
        </div>
      </div>
    </section>
  );
};
