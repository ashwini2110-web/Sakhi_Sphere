import React from 'react';
import { Heart, Lock, Handshake, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string, param?: string) => void;
  onOpenArchitecture: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenArchitecture }) => {
  return (
    <footer className="w-full bg-[#FBF5EE] border-t border-[#EADBCE] text-[#6E5B55] pt-16 pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Spirit */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#A43E25] text-white flex items-center justify-center font-bold text-lg">
                🌸
              </div>
              <span className="font-display font-bold text-xl text-[#2B211E]">
                Sakhi<span className="text-[#A43E25]">Sphere</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6E5B55] leading-relaxed">
              The sovereign ecosystem engineered for women founders, generational artisans, and peer-to-peer solidarity worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#A43E25] font-semibold">
              <Heart className="w-4 h-4 fill-current text-[#A43E25]" />
              <span>Built for humanity, not venture extraction.</span>
            </div>
          </div>

          {/* Col 2: Sisterhood Pillars */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#2B211E] mb-4">
              Our Sisterhood
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('discover')} className="hover:text-[#A43E25] transition-colors text-left">
                  Meet the Founders
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reels')} className="hover:text-[#A43E25] transition-colors text-left">
                  Sisterhood Reels &amp; Craft Streams
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('discover')} className="hover:text-[#A43E25] transition-colors text-left">
                  Artisan Origin Stories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#A43E25] transition-colors text-left">
                  Sister Safety Reserve (Mutual Aid)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Empowerment Tech */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#2B211E] mb-4">
              Empowerment Tech
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#A43E25] transition-colors text-left">
                  AI Sakhi Voice Assistant (14 Languages)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('discover')} className="hover:text-[#A43E25] transition-colors text-left">
                  Direct WhatsApp Voice Bridge
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#A43E25] transition-colors text-left">
                  Zero-Fee Escrow Protocol
                </button>
              </li>
              <li>
                <button onClick={onOpenArchitecture} className="hover:text-[#A43E25] transition-colors text-left text-[#1E5E4B] font-semibold">
                  Next.js + Supabase Schema Docs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Ethics & Covenant */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#2B211E] mb-4">
              Ethics &amp; Covenant
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <span className="hover:text-[#A43E25] cursor-pointer">Community Constitution</span>
              </li>
              <li>
                <span className="hover:text-[#A43E25] cursor-pointer">Anti-Predatory Guarantee</span>
              </li>
              <li>
                <span className="hover:text-[#A43E25] cursor-pointer">Peer Elder Verification Code</span>
              </li>
              <li>
                <span className="hover:text-[#A43E25] cursor-pointer">Public Transparency Ledger</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="pt-8 border-t border-[#EADBCE] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 SakhiSphere Global Collective Inc. Grounded in trust, craft, and sisterhood.</p>
          <div className="flex items-center gap-6 text-[#1E5E4B] font-medium">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> 100% Escrow Shield
            </span>
            <span className="flex items-center gap-1">
              <Handshake className="w-3.5 h-3.5" /> Peer Elder Authenticated
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 0% Exploitative Cut
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
