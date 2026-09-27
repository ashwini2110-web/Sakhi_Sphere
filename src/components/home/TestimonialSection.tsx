import React from 'react';
import { Star } from 'lucide-react';

export const TestimonialSection: React.FC = () => {
  return (
    <section className="w-full py-20 bg-[#FBF5EE] border-y border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#A43E25]">
              Sacred Reciprocity
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#2B211E] mt-1">
              Voices of Patrons &amp; Sisters
            </h2>
          </div>

          <div className="flex items-center gap-1 text-sm font-semibold text-[#D97706] bg-white px-4 py-2 rounded-full border border-[#EADBCE] shadow-warm-sm">
            <Star className="w-4 h-4 fill-current text-[#D97706]" />
            <span className="text-[#2B211E] tabular-nums font-bold">4.98 Mutual Respect Score</span>
            <span className="text-[#6E5B55] text-xs font-normal">(Over 28,400 bonds built)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Perspective 1: The Conscious Patron */}
          <div className="bg-white p-8 rounded-3xl border border-[#EADBCE] shadow-warm-sm flex flex-col justify-between gap-6 relative">
            <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-[#1E5E4B] text-white text-[11px] font-bold tracking-wider uppercase">
              The Patron’s Perspective
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-1 text-[#D97706]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <blockquote className="font-serif italic text-lg sm:text-xl text-[#2B211E] leading-relaxed">
                “I don’t just buy tea and linen anymore; I know Sunita’s daughters’ names, and I watched her solar loom workshop get completed through community voice updates. There is no going back to nameless department stores.”
              </blockquote>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[#EADBCE]">
              <div className="w-12 h-12 rounded-full bg-[#F4EAE0] text-[#A43E25] font-display font-bold text-base flex items-center justify-center">
                CH
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#2B211E]">Claire Henderson</h4>
                <p className="text-xs text-[#6E5B55]">Conscious Patron &amp; Architect • London, UK</p>
              </div>
            </div>
          </div>

          {/* Perspective 2: The Sovereign Sister Founder */}
          <div className="bg-white p-8 rounded-3xl border border-[#EADBCE] shadow-warm-sm flex flex-col justify-between gap-6 relative">
            <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-[#A43E25] text-white text-[11px] font-bold tracking-wider uppercase">
              The Founder’s Voice
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-1 text-[#D97706]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <blockquote className="font-serif italic text-lg sm:text-xl text-[#2B211E] leading-relaxed">
                “SakhiSphere didn’t just give me customers; it gave me back my pride and 14,000 sisters who celebrate my wins. When my mother fell ill, the Sister Circle paid her bills before I could even ask.”
              </blockquote>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[#EADBCE]">
              <div className="w-12 h-12 rounded-full bg-[#F7EBE7] text-[#C86D51] font-display font-bold text-base flex items-center justify-center">
                RS
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#2B211E]">Radhika Sharma</h4>
                <p className="text-xs text-[#6E5B55]">Founder, UI Canvas Collective • Jaipur</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
