import React, { useState } from 'react';
import { Business } from '../../types/database';
import { playArtisanVoiceNote } from '../../lib/storage';
import { generateWhatsAppLink, buildSisterhoodEncouragementMessage } from '../../lib/whatsapp';
import { MapPin, Volume2, BookOpen, MessageSquare, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface FounderStoryCardsProps {
  businesses: Business[];
  onOpenBusiness: (businessId: string) => void;
  onExploreDirectory: () => void;
}

export const FounderStoryCards: React.FC<FounderStoryCardsProps> = ({
  businesses,
  onOpenBusiness,
  onExploreDirectory,
}) => {
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const handleVoicePlay = (founder: Business, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingVoiceId === founder.id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(founder.id);
      playArtisanVoiceNote(founder.owner_name, () => {
        setPlayingVoiceId(null);
      });
    }
  };

  const badgeConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
    'biz-meera': {
      label: 'Gold Sovereign Sister',
      bg: 'bg-[#FEF3C7]',
      text: 'text-[#D97706]',
      icon: 'stars'
    },
    'biz-amani': {
      label: 'Co-Op Elder',
      bg: 'bg-[#E8F5F0]',
      text: 'text-[#1E5E4B]',
      icon: 'eco'
    },
    'biz-elena': {
      label: 'Digital Sovereign',
      bg: 'bg-[#F7EBE7]',
      text: 'text-[#A43E25]',
      icon: 'terminal'
    },
    'biz-sunita': {
      label: 'Heritage Guardian',
      bg: 'bg-[#FEF3C7]',
      text: 'text-[#D97706]',
      icon: 'history_edu'
    }
  };

  const impactProof: Record<string, { label: string; icon: string }> = {
    'biz-meera': {
      label: 'Supported by 1,240 conscious patrons',
      icon: 'diversity_2'
    },
    'biz-amani': {
      label: '64 matriarchs share 100% of dividends',
      icon: 'diversity_1'
    },
    'biz-elena': {
      label: 'Translated in 6 indigenous languages',
      icon: 'code'
    },
    'biz-sunita': {
      label: '100% natural river-friendly plant dyes',
      icon: 'water_drop'
    }
  };

  // Filter 4 featured founders
  const featuredFounders = businesses.filter(b => ['biz-meera', 'biz-amani', 'biz-elena', 'biz-sunita'].includes(b.id));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" id="founders">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A43E25]">
            <span className="material-symbols-outlined text-sm">nature_people</span>
            Sacred Craft &amp; Generational Wisdom
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#2B211E] mt-1">
            Meet the Women Behind the Vision
          </h2>
          <p className="text-[#6E5B55] text-base mt-2">
            We don’t believe in cold product listings. Learn their names, hear their voices, and build genuine relationships with the matriarchs who create with their own hands.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExploreDirectory}
            className="px-5 py-2.5 rounded-full border border-[#EADBCE] bg-[#FBF5EE] text-[#2B211E] text-xs sm:text-sm font-semibold hover:border-[#A43E25] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">filter_vintage</span> All Disciplines
          </button>
          
          <button
            onClick={onExploreDirectory}
            className="text-xs sm:text-sm font-bold text-[#A43E25] hover:underline flex items-center gap-1 cursor-pointer"
          >
            View Entire Sisterhood Directory <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredFounders.map((founder) => {
          const badge = badgeConfig[founder.id] || { label: 'Verified Matriarch', bg: 'bg-[#E8F5F0]', text: 'text-[#1E5E4B]', icon: 'verified' };
          const proof = impactProof[founder.id] || { label: `${founder.patron_count} verified patrons`, icon: 'diversity_1' };
          const isPlayingVoice = playingVoiceId === founder.id;

          const whatsappEncouragementUrl = generateWhatsAppLink(
            founder.whatsapp_number,
            buildSisterhoodEncouragementMessage(founder.owner_name, founder.name)
          );

          return (
            <article
              key={founder.id}
              onClick={() => onOpenBusiness(founder.id)}
              className="bg-white rounded-2xl border border-[#EADBCE] overflow-hidden shadow-warm-sm hover:shadow-warm-lg transition-all flex flex-col group cursor-pointer"
            >
              {/* Photo Area */}
              <div className="relative aspect-[4/5] bg-[#FBF5EE] overflow-hidden">
                <img
                  src={founder.owner_avatar}
                  alt={founder.owner_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B211E]/80 via-transparent to-transparent pointer-events-none" />

                {/* Trust Badge */}
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full ${badge.bg} ${badge.text} text-[11px] font-bold flex items-center gap-1 shadow-xs`}>
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {badge.icon}
                  </span>
                  {badge.label}
                </span>

                {/* Voice clip trigger */}
                <button
                  onClick={(e) => handleVoicePlay(founder, e)}
                  title={`Voice of ${founder.owner_name} (${founder.voice_note_duration})`}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm hover:scale-110 transition-transform shadow-xs cursor-pointer ${
                    isPlayingVoice
                      ? 'bg-[#A43E25] text-white animate-pulse'
                      : 'bg-white/90 text-[#A43E25]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    graphic_eq
                  </span>
                </button>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <MapPin className="w-3 h-3 text-[#E8A838]" />
                    <span>{founder.location}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg leading-tight mt-0.5">
                    {founder.owner_name}
                  </h3>
                </div>
              </div>

              {/* Text Area */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#C86D51] uppercase tracking-wider block">
                    {founder.name}
                  </span>

                  <p className="text-sm text-[#6E5B55] italic leading-relaxed line-clamp-3">
                    “{founder.tagline}”
                  </p>

                  <div className="bg-[#FBF5EE]/80 p-2.5 rounded-xl border border-[#EADBCE]/60 flex items-center gap-2 text-xs text-[#2B211E]">
                    <span className="material-symbols-outlined text-[#1E5E4B] text-base">{proof.icon}</span>
                    <span className="line-clamp-1">{proof.label}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#EADBCE]/60">
                  <button
                    onClick={() => onOpenBusiness(founder.id)}
                    className="w-full py-2.5 rounded-xl bg-[#A43E25] text-white text-center font-semibold text-xs hover:bg-[#7F2C17] transition-colors flex items-center justify-center gap-1.5 shadow-warm-sm cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Origin Story &amp; Listen</span>
                  </button>

                  <a
                    href={whatsappEncouragementUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full py-2 rounded-xl bg-[#FBF5EE] text-[#1E5E4B] text-center font-medium text-xs hover:bg-[#E8F5F0] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Send Encouragement on WhatsApp</span>
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
