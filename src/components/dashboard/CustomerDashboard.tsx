import React from 'react';
import { Business, Review, Profile } from '../../types/database';
import { getSavedBusinessIds, toggleSaveBusiness } from '../../lib/storage';
import { generateWhatsAppLink, buildGeneralInquiryMessage } from '../../lib/whatsapp';
import { Heart, Star, MessageSquare, Compass, ShieldCheck, ArrowRight, Trash2, Calendar } from 'lucide-react';

interface CustomerDashboardProps {
  businesses: Business[];
  currentUser: Profile;
  myReviews: Review[];
  onOpenBusiness: (businessId: string) => void;
  onExploreMakers: () => void;
  onRefreshData: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  businesses,
  currentUser,
  myReviews,
  onOpenBusiness,
  onExploreMakers,
  onRefreshData,
}) => {
  const savedIds = getSavedBusinessIds();
  const savedBusinesses = businesses.filter(b => savedIds.includes(b.id));

  const handleRemoveSaved = (businessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveBusiness(businessId);
    onRefreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300 space-y-10">
      {/* Header Profile Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 bg-white rounded-3xl border border-[#EADBCE] shadow-warm-sm">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'}
            alt={currentUser.full_name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#EADBCE] shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-2xl text-[#2B211E]">
                {currentUser.full_name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5F0] text-[#1E5E4B] text-[10px] font-bold uppercase tracking-wider">
                Conscious Patron
              </span>
            </div>
            <p className="text-xs text-[#6E5B55] mt-0.5">
              {currentUser.location || 'London, UK'} • Patron since 2024 • 100% Direct Escrow Supporter
            </p>
          </div>
        </div>

        <button
          onClick={onExploreMakers}
          className="px-5 py-2.5 rounded-full bg-[#A43E25] text-white text-xs font-bold shadow-warm-sm hover:bg-[#7F2C17] flex items-center gap-1.5 cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Discover More Makers</span>
        </button>
      </div>

      {/* Saved Businesses Bookmarks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-xl text-[#2B211E]">
              My Saved Artisans &amp; Guilds ({savedBusinesses.length})
            </h3>
            <p className="text-xs text-[#6E5B55]">
              Founders you follow and bookmark for direct WhatsApp purchases.
            </p>
          </div>
        </div>

        {savedBusinesses.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#EADBCE] space-y-3">
            <Heart className="w-10 h-10 text-[#C86D51] mx-auto" />
            <h4 className="font-display font-bold text-base text-[#2B211E]">
              No saved businesses yet
            </h4>
            <p className="text-xs text-[#6E5B55] max-w-sm mx-auto">
              Click the heart icon on any craftswoman’s card to save them to your patron list.
            </p>
            <button
              onClick={onExploreMakers}
              className="px-5 py-2 rounded-full bg-[#A43E25] text-white text-xs font-bold shadow-warm-sm"
            >
              Browse Directory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedBusinesses.map(biz => {
              const waUrl = generateWhatsAppLink(
                biz.whatsapp_number,
                buildGeneralInquiryMessage(biz.name)
              );

              return (
                <div
                  key={biz.id}
                  onClick={() => onOpenBusiness(biz.id)}
                  className="bg-white rounded-2xl border border-[#EADBCE] p-5 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={biz.owner_avatar}
                      alt={biz.owner_name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#EADBCE] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A43E25]">
                          {biz.category_name}
                        </span>
                        <button
                          onClick={(e) => handleRemoveSaved(biz.id, e)}
                          title="Remove bookmark"
                          className="text-[#6E5B55] hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-display font-bold text-base text-[#2B211E] group-hover:text-[#A43E25] transition-colors truncate">
                        {biz.name}
                      </h4>
                      <p className="text-xs text-[#6E5B55] mt-0.5 line-clamp-2">
                        {biz.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EADBCE]/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 font-bold text-[#D97706]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{biz.rating}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-full bg-[#E8F5F0] text-[#1E5E4B] hover:bg-[#1E5E4B] hover:text-white transition-colors text-xs font-bold flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>

                      <button
                        onClick={() => onOpenBusiness(biz.id)}
                        className="p-1.5 rounded-full bg-[#FBF5EE] text-[#A43E25] hover:bg-[#F7EBE7]"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My Submitted Reviews */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-xl text-[#2B211E]">
          My Verified Reviews ({myReviews.length})
        </h3>

        {myReviews.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-[#EADBCE] text-center text-xs text-[#6E5B55]">
            You have not written any reviews yet. Visit an artisan’s profile to leave verified praise!
          </div>
        ) : (
          <div className="space-y-3">
            {myReviews.map(r => (
              <div key={r.id} className="p-5 bg-white rounded-2xl border border-[#EADBCE] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E5E4B] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Patron Purchase
                  </span>
                  <div className="flex text-[#D97706]">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <h5 className="font-bold text-sm text-[#2B211E]">{r.title}</h5>
                <p className="text-xs text-[#6E5B55] italic">“{r.content}”</p>
                <span className="text-[10px] text-[#6E5B55] block pt-1">
                  Submitted on {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
