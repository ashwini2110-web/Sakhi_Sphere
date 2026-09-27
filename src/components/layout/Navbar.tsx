import React, { useState } from 'react';
import { Profile } from '../../types/database';
import { Heart, Compass, Video, LayoutDashboard, Sparkles, User, LogIn, ChevronDown, Check, Flame } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  currentUser: Profile;
  onSwitchUserRole: () => void;
  onOpenAuth: () => void;
  onOpenArchitecture: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  currentUser,
  onSwitchUserRole,
  onOpenAuth,
  onOpenArchitecture,
}) => {
  const [langDropdown, setLangDropdown] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EADBCE]/70 shadow-xs">
      {/* Top Sisterhood Pledge Banner */}
      <div className="bg-[#FAF0EC]/95 border-b border-[#EADBCE]/50 px-4 py-2 text-center flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-[#A43E25] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
          volunteer_activism
        </span>
        <p className="text-xs sm:text-sm font-medium text-[#6E5B55]">
          <span className="font-bold text-[#A43E25]">14,280+ Sovereign Women Founders</span> Across 38 Countries • Zero Platform Cut • Governed by Peer Sisterhood
        </p>
      </div>

      {/* Main Top Bar (3-Zone Contract) */}
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#A43E25] to-[#D9822B] text-white flex items-center justify-center shadow-warm-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              all_inclusive
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl sm:text-2xl text-[#2B211E] tracking-tight flex items-center">
              Sakhi<span className="text-[#A43E25]">Sphere</span>
            </span>
            <span className="text-[9px] tracking-widest font-bold uppercase text-[#C86D51] -mt-1">
              Trust • Commerce • Sisterhood
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-[#6E5B55]">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3.5 py-2 rounded-full transition-colors font-semibold ${
              currentTab === 'home'
                ? 'text-[#A43E25] bg-[#F7EBE7]'
                : 'hover:text-[#A43E25] hover:bg-[#F7EBE7]/60'
            }`}
          >
            Our Sisterhood
          </button>
          
          <button
            onClick={() => onNavigate('discover')}
            className={`px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5 ${
              currentTab === 'discover'
                ? 'text-[#A43E25] bg-[#F7EBE7] font-semibold'
                : 'hover:text-[#A43E25] hover:bg-[#F7EBE7]/60'
            }`}
          >
            <Compass className="w-4 h-4 text-[#A43E25]" />
            Discover Makers
          </button>

          <button
            onClick={() => onNavigate('reels')}
            className={`px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5 ${
              currentTab === 'reels'
                ? 'text-[#A43E25] bg-[#F7EBE7] font-semibold'
                : 'hover:text-[#A43E25] hover:bg-[#F7EBE7]/60'
            }`}
          >
            <Video className="w-4 h-4 text-[#A43E25]" />
            Sisterhood Reels
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5 ${
              currentTab === 'dashboard'
                ? 'text-[#A43E25] bg-[#F7EBE7] font-semibold'
                : 'hover:text-[#A43E25] hover:bg-[#F7EBE7]/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#1E5E4B]" />
            {currentUser.role === 'entrepreneur' ? 'Entrepreneur Hub' : 'Patron Space'}
          </button>

          <button
            onClick={onOpenArchitecture}
            className="px-3.5 py-2 rounded-full hover:text-[#A43E25] hover:bg-[#F7EBE7]/60 transition-colors flex items-center gap-1.5 text-xs text-[#1E5E4B] bg-[#E8F5F0]/60 border border-[#1E5E4B]/20 font-medium"
            title="View Supabase Schema, Next.js Architecture & SQL Migration"
          >
            <span className="material-symbols-outlined text-sm">database</span>
            Supabase Schema
          </button>
        </nav>

        {/* Zone 3: Actions Cluster */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLangDropdown(!langDropdown)}
              className="flex items-center gap-1 text-xs text-[#6E5B55] bg-[#FBF5EE] hover:bg-[#F4EAE0] px-3 py-1.5 rounded-full border border-[#EADBCE] transition-colors"
            >
              <span className="material-symbols-outlined text-sm text-[#C86D51]">translate</span>
              <span className="font-medium">{selectedLang}</span>
              <ChevronDown className="w-3 h-3 text-[#6E5B55]" />
            </button>

            {langDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-warm-lg border border-[#EADBCE] py-1 z-50 text-xs">
                {['English', 'हिन्दी (Hindi)', 'Kiswahili', 'Español'].map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setSelectedLang(l);
                      setLangDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#F7EBE7] flex items-center justify-between text-[#2B211E]"
                  >
                    <span>{l}</span>
                    {selectedLang === l && <Check className="w-3.5 h-3.5 text-[#A43E25]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Pill Switcher */}
          <button
            onClick={onSwitchUserRole}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FBF5EE] border border-[#EADBCE] text-xs font-semibold text-[#2B211E] hover:border-[#A43E25]/50 transition-all"
            title="Toggle between Entrepreneur and Customer Role"
          >
            <span className={`w-2 h-2 rounded-full ${currentUser.role === 'entrepreneur' ? 'bg-[#A43E25]' : 'bg-[#1E5E4B]'}`} />
            <span className="truncate max-w-[120px]">
              {currentUser.role === 'entrepreneur' ? 'Role: Artisan' : 'Role: Patron'}
            </span>
            <span className="text-[10px] text-[#A43E25] underline ml-0.5">Switch</span>
          </button>

          {/* Support Founders Button */}
          <button
            onClick={() => onNavigate('discover')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#A43E25] text-[#A43E25] font-semibold text-xs sm:text-sm hover:bg-[#F7EBE7] transition-all"
          >
            <Heart className="w-4 h-4 fill-current text-[#A43E25]" />
            <span>Support Founders</span>
          </button>

          {/* Join / Profile CTA */}
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#A43E25] text-white font-semibold text-xs sm:text-sm shadow-warm-sm hover:bg-[#7F2C17] hover:shadow-warm-md transition-all"
          >
            {currentUser ? (
              <>
                <img 
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'} 
                  alt={currentUser.full_name} 
                  className="w-5 h-5 rounded-full object-cover border border-white/80"
                />
                <span className="truncate max-w-[90px] sm:max-w-[120px]">{currentUser.full_name.split(' ')[0]}</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Join Sisterhood</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
