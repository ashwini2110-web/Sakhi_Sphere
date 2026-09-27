import React from 'react';
import { ArrowRight } from 'lucide-react';

export const TrustPillars: React.FC = () => {
  const pillars = [
    {
      title: '1. Radical Identity Verification',
      description: 'Every founder is personally interviewed and vouched for by local peer elders. We have zero synthetic bots, anonymous drop-shippers, or deceptive middle agencies.',
      cta: 'Community Elder Charter',
      icon: 'fingerprint',
      color: 'text-[#A43E25]',
      bg: 'bg-[#F7EBE7]'
    },
    {
      title: '2. Direct WhatsApp Voice Bridge',
      description: 'Patrons speak directly with the hands creating their piece. You can ask questions, celebrate milestones, and hear the heartbeat of the workshop in real-time.',
      cta: 'Human Connection Protocol',
      icon: 'perm_phone_msg',
      color: 'text-[#1E5E4B]',
      bg: 'bg-[#E8F5F0]'
    },
    {
      title: '3. 0% Extractive Platform Cut',
      description: 'We take 0% of early revenue. 100% of the first $1,000 and the vast majority of subsequent sales flow directly into family savings, groceries, and micro-grants.',
      cta: 'Fair Flow Ledger',
      icon: 'percent',
      color: 'text-[#D97706]',
      bg: 'bg-[#FEF3C7]'
    },
    {
      title: '4. Sisterhood Safety Net',
      description: 'A collective mutual-aid emergency reserve funded by community tips protects women against monsoon damages, medical crises, and market volatility.',
      cta: 'Mutual Aid Architecture',
      icon: 'shield_with_heart',
      color: 'text-[#C86D51]',
      bg: 'bg-[#FAF0EC]'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-[#A43E25]">
          Dignity by Design
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#2B211E] mt-1">
          Why SakhiSphere Feels Like Family, Not a Corporation
        </h2>
        <p className="text-[#6E5B55] text-base mt-2">
          We dismantled the extractive corporate marketplace blueprint and rebuilt commerce around human decency and sovereign protection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="bg-white p-6 sm:p-7 rounded-2xl border border-[#EADBCE] flex flex-col gap-4 shadow-warm-sm hover:shadow-warm-md transition-all"
          >
            <div className={`w-12 h-12 rounded-xl ${pillar.bg} ${pillar.color} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {pillar.icon}
              </span>
            </div>

            <h3 className="font-display font-bold text-lg text-[#2B211E]">
              {pillar.title}
            </h3>

            <p className="text-sm text-[#6E5B55] leading-relaxed">
              {pillar.description}
            </p>

            <span className={`mt-auto text-xs font-bold ${pillar.color} flex items-center gap-1`}>
              {pillar.cta} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
