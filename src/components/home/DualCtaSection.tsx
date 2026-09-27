import React from 'react';
import { Heart, CheckCircle2, ArrowRight, Sparkles, Rocket } from 'lucide-react';

interface DualCtaSectionProps {
  onExploreFounders: () => void;
  onStartJourney: () => void;
}

export const DualCtaSection: React.FC<DualCtaSectionProps> = ({
  onExploreFounders,
  onStartJourney,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" id="join">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left: For Conscious Allies & Patrons */}
        <div className="bg-[#FBF5EE] rounded-3xl border-2 border-[#EADBCE] p-8 sm:p-10 flex flex-col justify-between gap-8 relative overflow-hidden shadow-warm-sm">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#E8A838]/15 rounded-bl-full pointer-events-none" />

          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F5F0] text-[#1E5E4B] text-xs font-bold">
              <Heart className="w-3.5 h-3.5 fill-current text-[#1E5E4B]" />
              For Allies, Supporters &amp; Patrons
            </span>

            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#2B211E]">
              Become a Patron of Independent Women
            </h3>

            <p className="text-sm sm:text-base text-[#6E5B55] leading-relaxed">
              Discover genuine craft, invest in generational futures, and build relationships that outlast sterile mass manufacturing. Every dollar stays with the family who made it.
            </p>

            <ul className="space-y-2 pt-2 text-xs sm:text-sm text-[#2B211E]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E5E4B]" />
                <span>Direct personal communication with makers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E5E4B]" />
                <span>Decentralized escrow security on every parcel</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E5E4B]" />
                <span>Patron voting on micro-grant distribution</span>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <button
              onClick={onExploreFounders}
              className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-full bg-[#1E5E4B] text-white font-semibold text-sm sm:text-base hover:bg-[#1E5E4B]/90 shadow-warm-sm transition-all cursor-pointer"
            >
              <span>Explore Founder Stories &amp; Support</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: For Women Ready to Rise */}
        <div className="bg-gradient-to-br from-[#A43E25] via-[#A43E25] to-[#7F2C17] rounded-3xl p-8 sm:p-10 text-white flex flex-col justify-between gap-8 relative overflow-hidden shadow-warm-lg">
          <div className="absolute -bottom-8 -right-8 w-60 h-60 bg-[#E8A838]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> For Women Ready to Rise
            </span>

            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Have a Craft, Idea, or Passion? You Are Never Alone.
            </h3>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Step into an ecosystem designed to protect your dignity. Gain access to 24/7 vocal AI Sakhi mentorship in your native language, fair micro-grants, and an unwavering global sisterhood.
            </p>

            <ul className="space-y-2 pt-2 text-xs sm:text-sm text-white/90">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E8A838] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span>Zero setup fees &amp; 0% commission on your first $1,000</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E8A838] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span>AI vocal coach for pricing, tax codes, and export logistics</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E8A838] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span>Instant placement into a local weekly peer circle</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 relative z-10">
            <button
              onClick={onStartJourney}
              className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-full bg-white text-[#A43E25] font-bold text-sm sm:text-base hover:bg-[#FBF5EE] shadow-warm-sm transition-all cursor-pointer"
            >
              <span>Start Your Journey With Us</span>
              <Rocket className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
