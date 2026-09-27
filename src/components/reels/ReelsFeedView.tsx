import React, { useState, useEffect } from 'react';
import { Reel } from '../../types/database';
import { likeReel, bookmarkReel, toggleFollowFounder, getFollowedFounderIds, playArtisanVoiceNote } from '../../lib/storage';
import { generateWhatsAppLink, buildProductInquiryMessage } from '../../lib/whatsapp';
import { showToast } from '../ui/Toast';
import { 
  Heart, Bookmark, Share2, MessageSquare, Volume2, VolumeX, 
  Play, Pause, ChevronUp, ChevronDown, Plus, X, ArrowLeft, Check, Sparkles, ShoppingBag 
} from 'lucide-react';

interface ReelsFeedViewProps {
  reels: Reel[];
  initialReelId?: string;
  onOpenFounderProfile: (businessId: string) => void;
  onUploadReelClick: () => void;
  onBack: () => void;
}

export const ReelsFeedView: React.FC<ReelsFeedViewProps> = ({
  reels,
  initialReelId,
  onOpenFounderProfile,
  onUploadReelClick,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialReelId) {
      const idx = reels.findIndex(r => r.id === initialReelId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});
  const [followedFounders, setFollowedFounders] = useState<string[]>(getFollowedFounderIds());
  const [showEncourageDrawer, setShowEncourageDrawer] = useState(false);
  const [encouragementNote, setEncouragementNote] = useState('');

  const currentReel = reels[currentIndex] || reels[0];

  // Auto-progress timer simulation for reels
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Loop or advance to next
          return 0;
        }
        return prev + 2;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex]);

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex(prev => (prev + 1) % reels.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex(prev => (prev - 1 + reels.length) % reels.length);
  };

  const handleLike = () => {
    if (!currentReel) return;
    likeReel(currentReel.id);
    setLikedIds(prev => ({ ...prev, [currentReel.id]: !prev[currentReel.id] }));
  };

  const handleBookmark = () => {
    if (!currentReel) return;
    bookmarkReel(currentReel.id);
    setBookmarkedIds(prev => ({ ...prev, [currentReel.id]: !prev[currentReel.id] }));
  };

  const handleFollow = () => {
    if (!currentReel) return;
    toggleFollowFounder(currentReel.business_id);
    setFollowedFounders(getFollowedFounderIds());
  };

  const handleVoiceSound = () => {
    if (!isMuted) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
      if (currentReel) {
        playArtisanVoiceNote(currentReel.founder_name);
      }
    }
  };

  const handleShare = () => {
    if (!currentReel) return;
    if (navigator.share) {
      navigator.share({
        title: currentReel.caption,
        text: `Watch ${currentReel.founder_name} on SakhiSphere Sisterhood Reels`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Reel link copied to clipboard!', 'success');
    }
  };

  const handleSendEncouragement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!encouragementNote.trim()) return;
    showToast(`Thank you sister! Your encouragement "${encouragementNote}" has been forwarded to ${currentReel.founder_name}’s studio circle.`, 'success');
    setEncouragementNote('');
    setShowEncourageDrawer(false);
  };

  if (!currentReel) return null;

  const isLiked = likedIds[currentReel.id];
  const isBookmarked = bookmarkedIds[currentReel.id];
  const isFollowing = followedFounders.includes(currentReel.business_id);

  const inquiryWhatsAppUrl = generateWhatsAppLink(
    currentReel.whatsapp_number,
    buildProductInquiryMessage(
      currentReel.business_name,
      currentReel.tagged_item_title || 'Craft Creation',
      currentReel.tagged_item_price
    )
  );

  return (
    <div className="relative w-full min-h-[calc(100vh-140px)] bg-[#151c29] flex items-center justify-center py-6 px-4">
      {/* Top Floating Controls */}
      <div className="absolute top-6 left-6 z-30 flex items-center gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#2B211E] backdrop-blur-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Feed</span>
        </button>

        <span className="text-xs text-white/80 hidden sm:inline">
          Reel {currentIndex + 1} of {reels.length}
        </span>
      </div>

      <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
        <button
          onClick={onUploadReelClick}
          className="px-4 py-2 rounded-full bg-[#A43E25] hover:bg-[#7F2C17] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post Your Reel</span>
        </button>
      </div>

      {/* Main 9:16 Video Player Container */}
      <div className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10 flex flex-col justify-between">
        {/* Background Visual Asset */}
        <img
          src={currentReel.thumbnail_url}
          alt={currentReel.caption}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Ambient Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

        {/* Top Progress Bar */}
        <div className="relative z-20 px-3 pt-3 flex items-center gap-1">
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-150 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Top Meta Bar */}
        <div className="relative z-20 px-4 pt-2 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-[#1E5E4B] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
            {currentReel.category}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleVoiceSound}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Center Tap to Play/Pause Overlay */}
        <div 
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-20 z-10 cursor-pointer"
        />

        {/* Right Floating Interaction Rail */}
        <div className="absolute right-3 bottom-28 z-20 flex flex-col items-center gap-3">
          {/* Follow button */}
          <button
            onClick={handleFollow}
            className="flex flex-col items-center gap-0.5 cursor-pointer group/btn"
          >
            <div className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-transform group-hover/btn:scale-110 ${
              isFollowing ? 'bg-[#A43E25] text-white' : 'bg-white/90 text-[#A43E25]'
            }`}>
              {isFollowing ? <Check className="w-5 h-5" /> : <span className="material-symbols-outlined text-xl">person_add</span>}
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow">
              {isFollowing ? 'Joined' : 'Follow'}
            </span>
          </button>

          {/* Like */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-0.5 cursor-pointer group/btn"
          >
            <div className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md text-red-500 flex items-center justify-center shadow-lg transition-transform group-hover/btn:scale-110">
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {((currentReel.likes_count + (isLiked ? 1 : 0)) / 1000).toFixed(1)}k
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={handleBookmark}
            className="flex flex-col items-center gap-0.5 cursor-pointer group/btn"
          >
            <div className={`w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg transition-transform group-hover/btn:scale-110 ${
              isBookmarked ? 'text-[#D9822B]' : 'text-[#2B211E]'
            }`}>
              <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {(currentReel.bookmarks_count / 1000).toFixed(1)}k
            </span>
          </button>

          {/* Encourage / Comment */}
          <button
            onClick={() => setShowEncourageDrawer(true)}
            className="flex flex-col items-center gap-0.5 cursor-pointer group/btn"
            title="Encourage Sister"
          >
            <div className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md text-[#2B211E] flex items-center justify-center shadow-lg transition-transform group-hover/btn:scale-110">
              <MessageSquare className="w-5 h-5 text-[#A43E25]" />
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow">Cheer</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-0.5 cursor-pointer group/btn"
          >
            <div className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md text-[#2B211E] flex items-center justify-center shadow-lg transition-transform group-hover/btn:scale-110">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow">
              {(currentReel.shares_count / 1000).toFixed(1)}k
            </span>
          </button>

          {/* Direct WhatsApp Studio */}
          <a
            href={inquiryWhatsAppUrl}
            target="_blank"
            rel="noreferrer"
            className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
            title="Chat directly on WhatsApp"
          >
            <MessageSquare className="w-5 h-5" />
          </a>
        </div>

        {/* Bottom Story & Tagged Product Module */}
        <div className="relative z-20 p-4 pr-16 flex flex-col gap-2.5">
          {/* Founder Identity */}
          <div className="flex items-center gap-2.5">
            <div 
              onClick={() => onOpenFounderProfile(currentReel.business_id)}
              className="w-10 h-10 rounded-full border-2 border-white/90 overflow-hidden shrink-0 shadow-md cursor-pointer"
            >
              <img
                src={currentReel.founder_avatar}
                alt={currentReel.founder_name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <div 
                onClick={() => onOpenFounderProfile(currentReel.business_id)}
                className="text-white font-bold text-sm truncate flex items-center gap-1 cursor-pointer hover:underline"
              >
                {currentReel.founder_name}
                <span className="material-symbols-outlined text-[#D97706] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <span className="text-[11px] text-white/80 truncate block">
                {currentReel.business_name} • {currentReel.founder_location}
              </span>
            </div>
          </div>

          {/* Caption */}
          <p className="text-xs sm:text-sm text-white font-medium line-clamp-3 leading-snug">
            {currentReel.caption}
          </p>

          {/* Audio Title Track */}
          {currentReel.audio_title && (
            <div className="flex items-center gap-1.5 text-[11px] text-white/80">
              <span className="material-symbols-outlined text-xs animate-spin">graphic_eq</span>
              <span className="truncate">{currentReel.audio_title}</span>
            </div>
          )}

          {/* Tagged Product Box */}
          {currentReel.tagged_item_title && (
            <div className="mt-1 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EADBCE] flex items-center justify-between gap-2 shadow-md">
              <div className="flex items-center gap-2 min-w-0">
                <ShoppingBag className="w-4 h-4 text-[#A43E25] shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[#2B211E] truncate block">
                    {currentReel.tagged_item_title}
                  </span>
                  <span className="text-[10px] text-[#6E5B55]">
                    ${currentReel.tagged_item_price} • Direct Artisan Escrow
                  </span>
                </div>
              </div>

              <a
                href={inquiryWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-full bg-[#A43E25] hover:bg-[#7F2C17] text-white text-xs font-bold transition-all shrink-0"
              >
                Inquire
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Vertical Navigation Stepper Buttons */}
      <div className="hidden lg:flex flex-col items-center gap-3 ml-4">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#2B211E] backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg"
          title="Previous Reel"
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#2B211E] backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg"
          title="Next Reel"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Encourage Sister Bottom Sheet */}
      {showEncourageDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE]">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌸</span>
                <h4 className="font-display font-bold text-base text-[#2B211E]">
                  Encourage {currentReel.founder_name}
                </h4>
              </div>
              <button
                onClick={() => setShowEncourageDrawer(false)}
                className="w-8 h-8 rounded-full bg-[#FBF5EE] flex items-center justify-center text-[#6E5B55]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendEncouragement} className="space-y-4 pt-4">
              <p className="text-xs text-[#6E5B55]">
                Send a sisterhood note to {currentReel.founder_name}’s weekly circle to celebrate her craft.
              </p>

              <textarea
                required
                rows={3}
                value={encouragementNote}
                onChange={(e) => setEncouragementNote(e.target.value)}
                placeholder="Sister, your technique and passion inspire me so deeply..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E] focus:outline-none focus:border-[#A43E25]"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEncourageDrawer(false)}
                  className="px-4 py-2 rounded-full border border-[#EADBCE] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#A43E25] text-white text-xs font-bold"
                >
                  Send Encouragement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
