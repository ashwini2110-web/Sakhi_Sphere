import React from 'react';
import { Users, HeartHandshake, GraduationCap, MessagesSquare, CheckCircle2 } from 'lucide-react';

export const ImpactStats: React.FC = () => {
  return (
    <section className="w-full py-16 bg-[#FBF5EE] border-y border-[#EADBCE] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A43E25]">
            Sovereignty In Action
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#2B211E] mt-1">
            Our Sisterhood in Numbers
          </h2>
          <p className="text-[#6E5B55] text-sm sm:text-base mt-2">
            Every figure below represents real meals on family tables, sovereign bank accounts, and daughters attending universities.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
          {/* Metric 1 */}
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-[#EADBCE]/80 shadow-warm-sm">
            <span className="w-10 h-10 rounded-full bg-[#F7EBE7] text-[#A43E25] flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </span>
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#A43E25] tabular-nums">
              14,280+
            </span>
            <span className="font-bold text-sm text-[#2B211E] mt-1">Women Sovereigns</span>
            <span className="text-xs text-[#6E5B55] mt-1">
              Across 38 countries sustaining indigenous craft
            </span>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-[#EADBCE]/80 shadow-warm-sm">
            <span className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-3">
              <HeartHandshake className="w-5 h-5" />
            </span>
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#D97706] tabular-nums">
              $42.4M
            </span>
            <span className="font-bold text-sm text-[#2B211E] mt-1">Direct to Mothers</span>
            <span className="text-xs text-[#6E5B55] mt-1">
              100% transparent zero-cut escrow payouts
            </span>
          </div>

          {/* Metric 3 */}
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-[#EADBCE]/80 shadow-warm-sm">
            <span className="w-10 h-10 rounded-full bg-[#E8F5F0] text-[#1E5E4B] flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5" />
            </span>
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E5E4B] tabular-nums">
              98.7%
            </span>
            <span className="font-bold text-sm text-[#2B211E] mt-1">Family Reinvestment</span>
            <span className="text-xs text-[#6E5B55] mt-1">
              Earnings spent on daughter education &amp; health
            </span>
          </div>

          {/* Metric 4 */}
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-[#EADBCE]/80 shadow-warm-sm">
            <span className="w-10 h-10 rounded-full bg-[#F7EBE7] text-[#C86D51] flex items-center justify-center mb-3">
              <MessagesSquare className="w-5 h-5" />
            </span>
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#C86D51] tabular-nums">
              48,000+
            </span>
            <span className="font-bold text-sm text-[#2B211E] mt-1">Mentorship Circles</span>
            <span className="text-xs text-[#6E5B55] mt-1">
              Weekly sister sessions &amp; vocal AI coaching
            </span>
          </div>

          {/* Metric 5 */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-[#EADBCE]/80 shadow-warm-sm">
            <span className="w-10 h-10 rounded-full bg-[#E8F5F0] text-[#1E5E4B] flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#2B211E] tabular-nums">
              Zero
            </span>
            <span className="font-bold text-sm text-[#2B211E] mt-1">Anonymous Sellers</span>
            <span className="text-xs text-[#6E5B55] mt-1">
              100% identity and provenance peer-vouched
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
