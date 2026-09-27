import React, { useState } from 'react';
import { Business, CatalogItem, Reel, Review, Profile } from '../../types/database';
import { playArtisanVoiceNote, toggleSaveBusiness, getSavedBusinessIds, addReview } from '../../lib/storage';
import { 
  generateWhatsAppLink, 
  buildProductInquiryMessage, 
  buildServiceBookingMessage, 
  buildSisterhoodEncouragementMessage,
  buildCustomOrderMessage 
} from '../../lib/whatsapp';
import { showToast } from '../ui/Toast';
import { 
  MapPin, Star, Heart, MessageSquare, Volume2, ShieldCheck, 
  Clock, ArrowLeft, Share2, ShoppingBag, Sparkles, Plus, Play, Pause, X, CheckCircle2 
} from 'lucide-react';

interface BusinessProfileViewProps {
  business: Business;
  catalogItems: CatalogItem[];
  reels: Reel[];
  reviews: Review[];
  currentUser: Profile;
  onBack: () => void;
  onOpenReel: (reelId: string) => void;
  onRefreshData: () => void;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  business,
  catalogItems,
  reels,
  reviews,
  currentUser,
  onBack,
  onOpenReel,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'reels' | 'reviews' | 'story'>('products');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isSaved, setIsSaved] = useState(getSavedBusinessIds().includes(business.id));
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');

  const products = catalogItems.filter(i => i.type === 'product');
  const services = catalogItems.filter(i => i.type === 'service');

  const handleToggleVoice = () => {
    if (isPlayingVoice) {
      setIsPlayingVoice(false);
    } else {
      setIsPlayingVoice(true);
      playArtisanVoiceNote(business.owner_name, () => {
        setIsPlayingVoice(false);
      });
    }
  };

  const handleToggleSave = () => {
    const saved = toggleSaveBusiness(business.id);
    setIsSaved(saved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${business.name} on SakhiSphere`,
        text: `Support ${business.owner_name} and her authentic craft on SakhiSphere.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Business link copied to clipboard!', 'success');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewContent.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      business_id: business.id,
      customer_id: currentUser.id,
      customer_name: currentUser.full_name,
      customer_avatar: currentUser.avatar_url,
      customer_location: currentUser.location || 'Global Patron',
      rating: reviewRating,
      title: reviewTitle.trim(),
      content: reviewContent.trim(),
      is_verified_patron: true,
      created_at: new Date().toISOString(),
    };

    addReview(newRev);
    setShowReviewModal(false);
    setReviewTitle('');
    setReviewContent('');
    onRefreshData();
    showToast('Thank you sister! Your review has been recorded with peer verification.', 'success');
  };

  const generalWhatsAppUrl = generateWhatsAppLink(
    business.whatsapp_number,
    buildCustomOrderMessage(business.name)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#A43E25] hover:underline mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Directory</span>
      </button>

      {/* Hero Header Banner */}
      <div className="bg-white rounded-3xl border border-[#EADBCE] overflow-hidden shadow-warm-md mb-8">
        {/* Cover Photo */}
        <div className="relative h-64 sm:h-80 w-full bg-[#FBF5EE] overflow-hidden">
          <img
            src={business.banner_url}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B211E]/80 via-[#2B211E]/30 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#1E5E4B] text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#1E5E4B]" />
              Peer Elder Verified Sister • Day {business.days_in_circle} in Circle
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-[#2B211E] hover:scale-110 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleSave}
                className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-red-500 hover:scale-110 flex items-center justify-center transition-all shadow-sm cursor-pointer`}
                title={isSaved ? 'Saved in My Bookmarks' : 'Save Business'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-3 border-white overflow-hidden shadow-warm-md bg-white shrink-0">
                <img
                  src={business.owner_avatar}
                  alt={business.owner_name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-[#FEF3C7] font-bold">
                  {business.category_name}
                </span>
                <h1 className="font-display font-extrabold text-2xl sm:text-4xl leading-tight">
                  {business.name}
                </h1>
                <p className="text-xs sm:text-sm text-white/90 flex items-center gap-2 mt-0.5">
                  <span>Led by {business.owner_name}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-[#E8A838]" /> {business.location}
                  </span>
                </p>
              </div>
            </div>

            {/* Score Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-[#2B211E] text-xs font-bold backdrop-blur-md shrink-0 self-start sm:self-auto">
              <Star className="w-4 h-4 fill-current text-[#D97706]" />
              <span className="text-sm font-extrabold">{business.rating}</span>
              <span className="text-[#6E5B55]">({business.review_count} reviews)</span>
            </div>
          </div>
        </div>

        {/* Action Bar Beneath Banner */}
        <div className="p-4 sm:p-6 bg-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-t border-[#EADBCE]/80">
          {/* Voice Memo Player Bar */}
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FBF5EE] border border-[#EADBCE] flex-1 max-w-lg">
            <button
              onClick={handleToggleVoice}
              className="w-10 h-10 rounded-full bg-[#A43E25] text-white flex items-center justify-center shrink-0 shadow-xs hover:scale-105 transition-transform cursor-pointer"
            >
              {isPlayingVoice ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-[#2B211E] truncate">
                {isPlayingVoice ? `Playing ${business.owner_name}’s voice...` : `Hear ${business.owner_name}’s Voice`}
              </span>
              <span className="text-[11px] text-[#6E5B55]">
                {business.voice_note_duration} voice note • Provenance &amp; Loom rhythm
              </span>
            </div>
            {/* Equalizer animation */}
            <div className="flex items-end gap-1 h-5 pr-2">
              <div className={`w-1 bg-[#A43E25] rounded-full ${isPlayingVoice ? 'h-4 animate-bounce' : 'h-2'}`} />
              <div className={`w-1 bg-[#A43E25] rounded-full ${isPlayingVoice ? 'h-5 animate-pulse' : 'h-3'}`} />
              <div className={`w-1 bg-[#A43E25] rounded-full ${isPlayingVoice ? 'h-3 animate-bounce' : 'h-1.5'}`} />
            </div>
          </div>

          {/* Direct WhatsApp Call to Action */}
          <div className="flex items-center gap-2">
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => showToast(`Connecting to ${business.owner_name} via WhatsApp (${business.whatsapp_number}) with pre-filled message...`, 'info')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-warm-sm hover:scale-[1.02] transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp Studio</span>
            </a>

            <button
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-3 rounded-full bg-[#FBF5EE] border border-[#EADBCE] text-[#2B211E] hover:bg-[#F7EBE7] text-xs font-bold transition-colors cursor-pointer"
            >
              Leave Review
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#EADBCE] mb-8 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-3 font-display text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'border-[#A43E25] text-[#A43E25]'
              : 'border-transparent text-[#6E5B55] hover:text-[#2B211E]'
          }`}
        >
          Handcrafted Products ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-5 py-3 font-display text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'services'
              ? 'border-[#A43E25] text-[#A43E25]'
              : 'border-transparent text-[#6E5B55] hover:text-[#2B211E]'
          }`}
        >
          Workshops &amp; Services ({services.length})
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`px-5 py-3 font-display text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'reels'
              ? 'border-[#A43E25] text-[#A43E25]'
              : 'border-transparent text-[#6E5B55] hover:text-[#2B211E]'
          }`}
        >
          Sisterhood Reels ({reels.length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-5 py-3 font-display text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'reviews'
              ? 'border-[#A43E25] text-[#A43E25]'
              : 'border-transparent text-[#6E5B55] hover:text-[#2B211E]'
          }`}
        >
          Patron Reviews ({reviews.length})
        </button>

        <button
          onClick={() => setActiveTab('story')}
          className={`px-5 py-3 font-display text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'story'
              ? 'border-[#A43E25] text-[#A43E25]'
              : 'border-transparent text-[#6E5B55] hover:text-[#2B211E]'
          }`}
        >
          Origin Story &amp; Provenance
        </button>
      </div>

      {/* Tab 1: Products */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {products.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#EADBCE]">
              <p className="text-sm text-[#6E5B55]">No physical products cataloged yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => {
                const productWhatsApp = generateWhatsAppLink(
                  business.whatsapp_number,
                  buildProductInquiryMessage(business.name, product.title, product.price, product.currency)
                );

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl border border-[#EADBCE] overflow-hidden shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] bg-[#FBF5EE] overflow-hidden relative">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-extrabold text-[#A43E25] shadow-xs">
                        ${product.price} {product.currency}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                      <div>
                        <h4 className="font-display font-bold text-lg text-[#2B211E]">
                          {product.title}
                        </h4>
                        <p className="text-xs text-[#6E5B55] mt-1.5 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#EADBCE]/60 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#1E5E4B] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> In Stock &amp; Direct Escrow
                        </span>
                        <a
                          href={productWhatsApp}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => showToast(`Generating WhatsApp link for "${product.title}" to ${business.whatsapp_number}`, 'info')}
                          className="px-3.5 py-2 rounded-full bg-[#A43E25] text-white hover:bg-[#7F2C17] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Order on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Services */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {services.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#EADBCE]">
              <p className="text-sm text-[#6E5B55]">No workshops or consulting services cataloged currently.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map(service => {
                const serviceWhatsApp = generateWhatsAppLink(
                  business.whatsapp_number,
                  buildServiceBookingMessage(business.name, service.title, service.price, service.duration)
                );

                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-3xl border border-[#EADBCE] p-6 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-full bg-[#E8F5F0] text-[#1E5E4B] text-[10px] font-bold uppercase tracking-wider">
                          Virtual Workshop • {service.duration}
                        </span>
                        <span className="font-display font-extrabold text-lg text-[#A43E25]">
                          ${service.price} {service.currency}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-xl text-[#2B211E]">
                        {service.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-[#6E5B55] mt-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#EADBCE]/60 flex items-center justify-between">
                      <span className="text-xs text-[#6E5B55]">1-on-1 Mentorship Live Session</span>
                      <a
                        href={serviceWhatsApp}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => showToast(`Generating WhatsApp booking link for "${service.title}" to ${business.whatsapp_number}`, 'info')}
                        className="px-4 py-2 rounded-full bg-[#1E5E4B] text-white hover:bg-[#1E5E4B]/90 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Book via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Reels */}
      {activeTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {reels.map(reel => (
            <div
              key={reel.id}
              onClick={() => onOpenReel(reel.id)}
              className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-warm-md hover:scale-[1.02] transition-transform cursor-pointer group"
            >
              <img
                src={reel.thumbnail_url}
                alt={reel.caption}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                {reel.category}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-medium line-clamp-2 leading-snug">
                  {reel.caption}
                </p>
                <div className="flex items-center justify-between text-[10px] text-white/80 mt-1">
                  <span>❤️ {(reel.likes_count / 1000).toFixed(1)}k</span>
                  <span>{reel.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-[#EADBCE]">
            <div>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-[#D97706] fill-current" />
                <span className="font-display font-extrabold text-3xl text-[#2B211E]">
                  {business.rating}
                </span>
                <span className="text-sm text-[#6E5B55]">out of 5.0 Sovereign Score</span>
              </div>
              <p className="text-xs text-[#6E5B55] mt-1">
                Based on {reviews.length} authentic, peer-verified patron purchases.
              </p>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="px-5 py-2.5 rounded-full bg-[#A43E25] text-white text-xs font-bold shadow-warm-sm hover:bg-[#7F2C17] cursor-pointer"
            >
              Write a Verified Review
            </button>
          </div>

          <div className="space-y-4">
            {reviews.map(rev => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-[#EADBCE] p-6 shadow-warm-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.customer_avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'}
                      alt={rev.customer_name}
                      className="w-10 h-10 rounded-full object-cover border border-[#EADBCE]"
                    />
                    <div>
                      <h5 className="font-bold text-sm text-[#2B211E]">{rev.customer_name}</h5>
                      <span className="text-[11px] text-[#6E5B55]">{rev.customer_location || 'Verified Patron'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[#D97706]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                <h6 className="font-bold text-sm text-[#2B211E]">{rev.title}</h6>
                <p className="text-xs sm:text-sm text-[#6E5B55] leading-relaxed italic font-serif">
                  “{rev.content}”
                </p>

                <div className="pt-2 border-t border-[#EADBCE]/50 flex items-center justify-between text-[11px] text-[#6E5B55]">
                  <span className="flex items-center gap-1 text-[#1E5E4B] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Sisterhood Purchase
                  </span>
                  <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Story & Provenance */}
      {activeTab === 'story' && (
        <div className="bg-white rounded-3xl border border-[#EADBCE] p-8 sm:p-10 shadow-warm-sm space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A43E25]">
              Generational Lineage
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#2B211E] mt-1">
              The Journey of {business.owner_name}
            </h3>
          </div>

          <p className="text-sm sm:text-base text-[#6E5B55] leading-relaxed whitespace-pre-line">
            {business.story}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#EADBCE]">
            <div className="p-4 bg-[#FBF5EE] rounded-2xl">
              <span className="text-xs font-bold text-[#A43E25] uppercase tracking-wider block">Raw Provenance</span>
              <p className="text-xs text-[#2B211E] mt-1 font-medium">100% natural indigenous materials harvested ethically without corporate middlemen.</p>
            </div>

            <div className="p-4 bg-[#FBF5EE] rounded-2xl">
              <span className="text-xs font-bold text-[#1E5E4B] uppercase tracking-wider block">Family Reinvestment</span>
              <p className="text-xs text-[#2B211E] mt-1 font-medium">Dividends support children education, local solar power, and clean water wells.</p>
            </div>

            <div className="p-4 bg-[#FBF5EE] rounded-2xl">
              <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">Elder Vouched</span>
              <p className="text-xs text-[#2B211E] mt-1 font-medium">Authenticated by regional matriarch councils for fair wages and zero exploitation.</p>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 sm:p-8 max-w-lg w-full shadow-warm-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EADBCE]">
              <div>
                <h3 className="font-display font-bold text-xl text-[#2B211E]">
                  Leave a Verified Review
                </h3>
                <p className="text-xs text-[#6E5B55]">For {business.name} ({business.owner_name})</p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 rounded-full bg-[#FBF5EE] hover:bg-[#F7EBE7] flex items-center justify-center text-[#6E5B55] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-[#2B211E] mb-1">
                  Sovereign Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'text-[#D97706] fill-current' : 'text-[#EADBCE]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#D97706] ml-2">{reviewRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B211E] mb-1">
                  Headline / Title:
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Masterful handcraft and pure soul"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E] focus:outline-none focus:border-[#A43E25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B211E] mb-1">
                  Your Experience &amp; Reflection:
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Share details of the craft provenance, communication with the maker, and packaging..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E] focus:outline-none focus:border-[#A43E25]"
                />
              </div>

              <div className="p-3 bg-[#E8F5F0] rounded-xl text-[11px] text-[#1E5E4B] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>By submitting, you confirm you are backing independent women makers with radical mutual respect.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2.5 rounded-full border border-[#EADBCE] text-xs font-semibold text-[#6E5B55] hover:bg-[#FBF5EE]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#A43E25] text-white text-xs font-bold shadow-warm-sm hover:bg-[#7F2C17]"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
