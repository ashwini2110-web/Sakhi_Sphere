import React, { useState } from 'react';
import { INITIAL_SUCCESS_STORIES } from '../../lib/mockData';
import { playArtisanVoiceNote } from '../../lib/storage';
import { showToast } from '../ui/Toast';
import { Mic, Play, Pause, CheckCircle2, ChevronLeft, ChevronRight, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';

interface TransformationArcProps {
  onOpenFounder?: (businessId: string) => void;
}

export const TransformationArc: React.FC<TransformationArcProps> = ({ onOpenFounder }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const story = INITIAL_SUCCESS_STORIES[selectedIndex] || INITIAL_SUCCESS_STORIES[0];

  const handlePlayVoice = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playArtisanVoiceNote(story.founder_name, () => {
        setIsPlaying(false);
      });
    }
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % INITIAL_SUCCESS_STORIES.length);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + INITIAL_SUCCESS_STORIES.length) % INITIAL_SUCCESS_STORIES.length);
    setIsPlaying(false);
  };

  return (
    <section className="w-full py-20 bg-[#FBF5EE] border-y border-[#EADBCE]" id="transformation-stories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A43E25]">
              <span className="material-symbols-outlined text-sm">timeline</span>
              10 Verified Transformation Journeys
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#2B211E] mt-1">
              From Solitary Struggle to Sovereign Strength
            </h2>
            <p className="text-[#6E5B55] text-sm sm:text-base mt-1 max-w-2xl">
              What happens when an underestimated woman is handed radical belief, fair zero-fee capital, and sisterhood?
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#6E5B55]">
              Story {selectedIndex + 1} of {INITIAL_SUCCESS_STORIES.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white border border-[#EADBCE] hover:bg-[#F7EBE7] text-[#2B211E] flex items-center justify-center transition-colors cursor-pointer"
                title="Previous Case Journey"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white border border-[#EADBCE] hover:bg-[#F7EBE7] text-[#2B211E] flex items-center justify-center transition-colors cursor-pointer"
                title="Next Case Journey"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Deep Narrative Spotlight */}
        <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 sm:p-10 shadow-warm-lg grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Visual & Audio Memo */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#F4EAE0]">
              <img
                src={story.avatar_url}
                alt={story.founder_name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B211E]/80 via-transparent to-transparent" />

              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#A43E25] flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E5E4B]" />
                <span>Audited Case {story.audit_escrow_id}</span>
              </div>

              <div className="absolute top-3 right-3 bg-[#E8F5F0] px-3 py-1 rounded-full text-xs font-bold text-[#1E5E4B] flex items-center gap-1 shadow-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{story.revenue_multiplier}</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-medium opacity-90">{story.location}</p>
                <h4 className="font-display font-bold text-xl">{story.founder_name}</h4>
                <p className="text-xs text-[#EADBCE] font-medium">{story.business_name}</p>
              </div>
            </div>

            {/* Voice Memo Audio Highlight Bar */}
            <div className="p-4 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#A43E25] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Mic className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#2B211E] truncate">
                    Artisan Memo: {story.founder_name}
                  </p>
                  <p className="text-[11px] text-[#6E5B55] truncate">
                    Authentic voice recording • Studio acoustic lineage
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlayVoice}
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#EADBCE] text-xs font-bold text-[#A43E25] hover:bg-[#F7EBE7] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                <span>{isPlaying ? 'Playing...' : 'Play Audio'}</span>
              </button>
            </div>
          </div>

          {/* Right: Milestone Breakdown */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FAF0EC] text-[#A43E25] text-xs font-bold font-mono">
                CASE {story.audit_escrow_id}
              </span>
              <span className="text-xs text-[#6E5B55]">• Verified Direct Escrow Thriving</span>
            </div>

            <blockquote className="font-display font-bold text-xl sm:text-2xl text-[#2B211E] leading-snug italic border-l-4 border-[#A43E25] pl-4">
              {story.hero_quote}
            </blockquote>

            {/* 3 Timeline steps */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#F7EBE7] text-[#A43E25] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#A43E25]/20 font-mono">
                  01
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#2B211E]">The Solitary Struggle (Before)</h5>
                  <p className="text-xs sm:text-sm text-[#6E5B55] mt-0.5 leading-relaxed">
                    {story.before_situation}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#D97706]/20 font-mono">
                  02
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#2B211E]">The Sisterhood Intervention</h5>
                  <p className="text-xs sm:text-sm text-[#6E5B55] mt-0.5 leading-relaxed">
                    {story.sisterhood_intervention}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#E8F5F0] text-[#1E5E4B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#1E5E4B]/20 font-mono">
                  03
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#2B211E]">Collective Sovereign Thriving (Outcome)</h5>
                  <p className="text-xs sm:text-sm text-[#6E5B55] mt-0.5 leading-relaxed">
                    {story.after_outcome}
                  </p>
                </div>
              </div>
            </div>

            {/* Peer Endorsement Stamp & Action */}
            <div className="p-4 rounded-xl bg-[#E8F5F0]/60 border border-[#1E5E4B]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#1E5E4B] shrink-0" />
                <span className="text-xs text-[#1E5E4B] font-medium leading-relaxed">
                  Endorsed by: <strong>{story.endorsement}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => showToast(`Audit Record ${story.audit_escrow_id}: ${story.founder_name} — 100% peer verified payout with zero platform fees.`, 'info')}
                  className="text-xs font-bold text-[#1E5E4B] hover:underline cursor-pointer"
                >
                  Verify Audit
                </button>
                {onOpenFounder && (
                  <button
                    type="button"
                    onClick={() => onOpenFounder(story.business_id)}
                    className="px-3 py-1.5 rounded-full bg-[#A43E25] text-white text-xs font-bold hover:bg-[#7F2C17] transition-colors cursor-pointer"
                  >
                    View Studio
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 10 Stories Quick Pill Strip */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2">
          {INITIAL_SUCCESS_STORIES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedIndex(idx);
                setIsPlaying(false);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedIndex === idx
                  ? 'bg-[#A43E25] text-white shadow-xs'
                  : 'bg-white border border-[#EADBCE] text-[#6E5B55] hover:bg-[#F7EBE7]'
              }`}
            >
              <img
                src={s.avatar_url}
                alt={s.founder_name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{s.founder_name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedIndex === idx ? 'bg-white/20 text-white' : 'bg-[#E8F5F0] text-[#1E5E4B]'}`}>
                {s.revenue_multiplier.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
