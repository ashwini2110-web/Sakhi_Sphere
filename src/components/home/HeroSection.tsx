import React, { useState } from 'react';
import { playArtisanVoiceNote } from '../../lib/storage';
import { generateWhatsAppLink, buildSisterhoodEncouragementMessage } from '../../lib/whatsapp';
import { Search, Radar, Sparkles, Users, MessageSquare, Volume2, Play, Pause, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string, category?: string) => void;
  onExplore: () => void;
  onOpenFounder: (founderId: string) => void;
  onJoin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onExplore,
  onOpenFounder,
  onJoin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedRegion, setSelectedRegion] = useState('Global Reach');
  const [selectedPrice, setSelectedPrice] = useState('Any Price');
  const [selectedScore, setSelectedScore] = useState('4.8+ Sovereign Score');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [stopAudioFn, setStopAudioFn] = useState<(() => void) | null>(null);

  const handleVoiceToggle = () => {
    if (isPlayingVoice) {
      if (stopAudioFn) stopAudioFn();
      setIsPlayingVoice(false);
      setStopAudioFn(null);
    } else {
      setIsPlayingVoice(true);
      const stop = playArtisanVoiceNote('Fatima Al-Mansoor', () => {
        setIsPlayingVoice(false);
        setStopAudioFn(null);
      });
      setStopAudioFn(() => stop);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedCategory === 'All Categories' ? undefined : selectedCategory);
  };

  const whatsappEncouragementUrl = generateWhatsAppLink(
    '+962791234567',
    buildSisterhoodEncouragementMessage('Fatima Al-Mansoor', 'Oasis Loom Collective')
  );

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Warm Ambient Glows */}
      <div className="absolute -top-12 left-1/3 w-96 h-96 rounded-full bg-[#E8A838]/15 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 -right-20 w-[420px] h-[420px] rounded-full bg-[#A43E25]/10 blur-3xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Deeply Emotional Voice */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBF5EE] border border-[#EADBCE] shadow-warm-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-bold tracking-wider uppercase text-[#A43E25]">
              A Sanctuary Built on Radical Mutual Respect
            </span>
          </div>

          {/* Emotional Headline */}
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-[50px] text-[#2B211E] leading-[1.12] tracking-tight">
            Before every craft, there is a <span className="text-[#A43E25] italic font-serif">courageous woman.</span> <br />
            Before every purchase, a bond of <span className="text-[#C86D51]">profound trust.</span>
          </h1>

          {/* Purpose Subtitle */}
          <p className="text-base sm:text-lg text-[#6E5B55] font-normal leading-relaxed max-w-2xl">
            SakhiSphere is the global sanctuary where women turn generational wisdom and resilient grit into thriving enterprises—surrounded by sisterhood, fair zero-fee capital, and patrons who believe in them.
          </p>

          {/* Search & Discovery Cockpit */}
          <form 
            onSubmit={handleSearchSubmit}
            className="w-full bg-white rounded-2xl p-3 sm:p-4 border-2 border-[#EADBCE] shadow-warm-md flex flex-col gap-3 my-1"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-[#C86D51] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search heirloom crafts, natural tinctures, founder names..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FBF5EE] text-xs sm:text-sm text-[#2B211E] border border-[#EADBCE] focus:outline-none focus:border-[#A43E25]"
                />
              </div>

              <button
                type="button"
                onClick={() => onSearch('', 'near-me')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E8F5F0] text-[#1E5E4B] hover:bg-[#1E5E4B] hover:text-white transition-all text-xs font-bold border border-[#1E5E4B]/20 shrink-0 cursor-pointer"
              >
                <Radar className="w-4 h-4 animate-pulse" />
                <span>Near Me Radar</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#A43E25] text-white hover:bg-[#7F2C17] transition-all text-xs sm:text-sm font-semibold shadow-warm-sm shrink-0 cursor-pointer"
              >
                <span>Explore</span>
              </button>
            </div>

            {/* Quick Filters Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#EADBCE]/60">
              <div className="flex items-center gap-1 text-[11px] font-medium text-[#6E5B55] bg-[#FBF5EE] px-2.5 py-1 rounded-lg border border-[#EADBCE]">
                <span className="material-symbols-outlined text-xs text-[#C86D51]">category</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-none text-[11px] font-medium text-[#2B211E] focus:outline-none cursor-pointer"
                >
                  <option>All Categories</option>
                  <option>Handloom &amp; Textiles</option>
                  <option>Botanical Apothecary</option>
                  <option>Ceramics &amp; Clay</option>
                  <option>Metalwork &amp; Bells</option>
                  <option>Culinary &amp; Spices</option>
                </select>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-medium text-[#6E5B55] bg-[#FBF5EE] px-2.5 py-1 rounded-lg border border-[#EADBCE]">
                <span className="material-symbols-outlined text-xs text-[#C86D51]">location_on</span>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-transparent border-none text-[11px] font-medium text-[#2B211E] focus:outline-none cursor-pointer"
                >
                  <option>Global Reach</option>
                  <option>South Asia</option>
                  <option>East Africa</option>
                  <option>Middle East</option>
                  <option>Latin America</option>
                </select>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-medium text-[#6E5B55] bg-[#FBF5EE] px-2.5 py-1 rounded-lg border border-[#EADBCE]">
                <span className="material-symbols-outlined text-xs text-[#D97706]">payments</span>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="bg-transparent border-none text-[11px] font-medium text-[#2B211E] focus:outline-none cursor-pointer"
                >
                  <option>Any Price</option>
                  <option>Under $30</option>
                  <option>$30 - $75</option>
                  <option>$75 - $150</option>
                  <option>$150+</option>
                </select>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-medium text-[#6E5B55] bg-[#FBF5EE] px-2.5 py-1 rounded-lg border border-[#EADBCE]">
                <span className="material-symbols-outlined text-xs text-[#D97706]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <select
                  value={selectedScore}
                  onChange={(e) => setSelectedScore(e.target.value)}
                  className="bg-transparent border-none text-[11px] font-medium text-[#2B211E] focus:outline-none cursor-pointer"
                >
                  <option>4.8+ Sovereign Score</option>
                  <option>Elder-Vouched Only</option>
                  <option>Top Reciprocity</option>
                </select>
              </div>
            </div>
          </form>

          {/* Dual Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
            <button
              onClick={onExplore}
              className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-[#A43E25] text-white font-semibold text-sm sm:text-base shadow-warm-md hover:bg-[#7F2C17] hover:scale-[1.01] transition-all group cursor-pointer"
            >
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Walk Alongside Her • Meet Our Founders</span>
            </button>

            <button
              onClick={onJoin}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FBF5EE] border-2 border-[#EADBCE] text-[#2B211E] font-semibold text-sm sm:text-base hover:border-[#A43E25]/50 hover:bg-[#F4EAE0] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C86D51]" />
              <span>Begin Your Journey • Get Mentored</span>
            </button>
          </div>

          {/* Micro-Trust Anchor Note */}
          <div className="flex items-center gap-2 pt-1 text-xs sm:text-sm text-[#6E5B55]">
            <ShieldCheck className="w-4 h-4 text-[#1E5E4B] shrink-0" />
            <span>No predatory fees. No dropshippers. Direct bank escrow released directly to each matriarch.</span>
          </div>
        </div>

        {/* Right: The Sacred Story Spotlight Card */}
        <div className="lg:col-span-5 relative">
          {/* Handcrafted frame glow */}
          <div className="absolute -inset-3 bg-gradient-to-tr from-[#E8A838]/25 via-[#C86D51]/20 to-[#A43E25]/20 rounded-3xl -rotate-1 -z-10 blur-xs" />

          <div className="relative bg-white rounded-2xl p-6 sm:p-7 shadow-warm-lg border border-[#EADBCE]/80 flex flex-col gap-5">
            {/* Card Header Ribbon */}
            <div className="flex items-center justify-between border-b border-[#EADBCE]/60 pb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F0] text-[#1E5E4B] text-xs font-bold">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
                Peer Elder Verified Sister
              </span>
              <span className="text-xs font-medium text-[#C86D51] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Day 840 in Circle
              </span>
            </div>

            {/* Founder Portrait with Voice Memo Audio Badge */}
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#FBF5EE]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5KGsINVUyvnVVmzhAB8KzpKV_HtmAax4FL7ag_-DHUF_brvUgBU2mSWiFZb1YnHFPiWo1vi8DWY5HQfsyINeu7gn1EX_nLQySXFEmznd0A5Oqf8tipys_5IR6DbOF4MIkvHwn-Nlpi2aijxW6xpRl_PWxPBjE9PcqJYBrXLj8mohbRlt2jcJ7C9to4WhL0j7OVrJBKP3ymg0_zszsoRdqqRdd1rGF1ve5zbucwKi11U1TQxE9Aj2v"
                alt="Fatima Al-Mansoor smiling warmly in her sunlit loom sanctuary"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B211E]/80 via-[#2B211E]/20 to-transparent" />

              {/* Voice Memo Audio Player Pill */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-xl bg-white/95 backdrop-blur-md shadow-warm-sm border border-[#EADBCE]/80">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleVoiceToggle}
                    aria-label="Play audio snippet"
                    className="w-9 h-9 rounded-full bg-[#A43E25] text-white flex items-center justify-center hover:scale-105 transition-transform shrink-0 shadow-xs cursor-pointer"
                  >
                    {isPlayingVoice ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#2B211E] leading-none">
                      {isPlayingVoice ? "Playing Fatima's Story..." : "Listen to Fatima's Voice"}
                    </span>
                    <span className="text-[11px] text-[#6E5B55] mt-0.5">
                      40s voice note • Heritage Loom
                    </span>
                  </div>
                </div>

                {/* Equalizer animation */}
                <div className="flex items-end gap-0.5 h-4 pr-1">
                  <div className={`w-1 bg-[#A43E25] rounded-full ${isPlayingVoice ? 'h-3 animate-pulse' : 'h-1.5'}`} />
                  <div className={`w-1 bg-[#A43E25] rounded-full ${isPlayingVoice ? 'h-4 animate-bounce' : 'h-3'}`} />
                  <div className={`w-1 bg-[#A43E25] rounded-full ${isPlayingVoice ? 'h-2 animate-pulse' : 'h-2'}`} />
                  <div className={`w-1 bg-[#A43E25] rounded-full ${isPlayingVoice ? 'h-3.5 animate-bounce' : 'h-1'}`} />
                </div>
              </div>
            </div>

            {/* Heart-Centered Quote */}
            <div className="flex flex-col gap-3">
              <blockquote className="text-base italic font-serif text-[#2B211E] leading-snug">
                “When the bank said no, my sisters in SakhiSphere said yes. Today, my looms support 14 families across our valley.”
              </blockquote>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="font-display font-bold text-base text-[#2B211E]">Fatima Al-Mansoor</h4>
                  <p className="text-xs text-[#6E5B55]">Master Handloom Weaver • Oasis Collective</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-[#1E5E4B] bg-[#E8F5F0] px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">handshake</span> 100% Peer Backed
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Connection Buttons */}
            <div className="pt-2 border-t border-[#EADBCE]/60 flex items-center gap-3">
              <button
                onClick={() => onOpenFounder('biz-fatima')}
                className="flex-1 py-3 px-4 rounded-xl bg-[#A43E25] text-white text-center font-semibold text-xs sm:text-sm hover:bg-[#7F2C17] transition-all flex items-center justify-center gap-2 shadow-warm-sm cursor-pointer"
              >
                <span>Read Fatima’s Journey</span>
              </button>
              
              <a
                href={whatsappEncouragementUrl}
                target="_blank"
                rel="noreferrer"
                title="Send Sisterhood Encouragement on WhatsApp"
                className="p-3 rounded-xl bg-[#FBF5EE] text-[#1E5E4B] hover:bg-[#E8F5F0] transition-colors flex items-center justify-center border border-[#EADBCE]"
              >
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
