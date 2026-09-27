import React, { useState } from 'react';
import { Profile, UserRole } from '../../types/database';
import { DEMO_PROFILES } from '../../lib/mock-data';
import { setStoredUser } from '../../lib/storage';
import { X, LogIn, UserPlus, ShieldCheck, Heart, Sparkles, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: Profile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const user: Profile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: fullName.trim() || email.split('@')[0],
      role,
      avatar_url: role === 'entrepreneur'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC97X4rvvCgaiVRaNZyECBx79Jz4smQnekmH83dXl_RWa09shisejVv-ndUtCzywURmU_F7g-BkA850egUXCNPRdlyeDLxeAvrFSK3igkD6SkRyEMuYtP-xRFz-vOB63mPlaLjrlc1-HU-X58EN_MiVS7Rj2Hw3saXsQ2wA0oe2eJ7bqyazl9H4BGDE9Yd9Bv2yfuIEbOuyDgDBOUQR5cdBnFx9lskKI2RunSv5H9Cp0r9Mfi6ZN5v'
        : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      phone: phone || '+1234567890',
      location: location || 'Global Sanctuary',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setStoredUser(user);
    onLoginSuccess(user);
    onClose();
  };

  const handleQuickLogin = (profile: Profile) => {
    setStoredUser(profile);
    onLoginSuccess(profile);
    onClose();
  };

  const handleGoogleLogin = () => {
    const demoGoogleUser: Profile = {
      id: `usr-google-${Date.now()}`,
      email: 'ashwini.ai2110@gmail.com',
      full_name: 'Ashwini Sovereign',
      role,
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWbJ60Bh15P8Uz-gva0pBz8THGuQaJHIjG2Xh6CUCBl8rjh0fVyBYaoZWhOlnL4DdfSwsSgDAOhfXXisqBZXhcvsiUEmMdzI7qHPNlPhtEExr6YEGsqoZqAz6uTLROwxUXWiFCP8jvfqMenZY6Gfete7vU5mjSKrz6TWjsPGCGYh3R-U7WPLJEiBvydyC_VGqnfapVEcaJdSYL9KToCVpKgO-j0JikLoHRz2-bck3FVOfcz6XwMVC9',
      location: 'Bengaluru, India',
      phone: '+919845012345',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStoredUser(demoGoogleUser);
    onLoginSuccess(demoGoogleUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EADBCE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#A43E25] text-white flex items-center justify-center text-sm font-bold">
              🌸
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#2B211E]">
                {mode === 'signup' ? 'Join SakhiSphere Sisterhood' : 'Welcome Back, Sister'}
              </h3>
              <p className="text-[11px] text-[#6E5B55]">
                {mode === 'signup' ? 'Choose your path in our sovereign ecosystem' : 'Sign in to access your dashboard'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FBF5EE] hover:bg-[#F7EBE7] flex items-center justify-center text-[#6E5B55] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-[#FBF5EE] p-1 rounded-xl my-4 border border-[#EADBCE]">
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              mode === 'signup' ? 'bg-white text-[#A43E25] shadow-xs' : 'text-[#6E5B55]'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              mode === 'login' ? 'bg-white text-[#A43E25] shadow-xs' : 'text-[#6E5B55]'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Role Selector (Critical for MVP) */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-[#2B211E] mb-2">
            Select Your Role in the Sisterhood:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('entrepreneur')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                role === 'entrepreneur'
                  ? 'bg-[#F7EBE7] border-[#A43E25] ring-2 ring-[#A43E25]/20'
                  : 'bg-[#FBF5EE] border-[#EADBCE] opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-base text-[#A43E25]">handyman</span>
                {role === 'entrepreneur' && <Check className="w-3.5 h-3.5 text-[#A43E25]" />}
              </div>
              <span className="text-xs font-bold text-[#2B211E] block mt-1">Artisan / Maker</span>
              <span className="text-[10px] text-[#6E5B55] block">Showcase business, reels &amp; products</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                role === 'customer'
                  ? 'bg-[#E8F5F0] border-[#1E5E4B] ring-2 ring-[#1E5E4B]/20'
                  : 'bg-[#FBF5EE] border-[#EADBCE] opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <Heart className="w-4 h-4 text-[#1E5E4B] fill-current" />
                {role === 'customer' && <Check className="w-3.5 h-3.5 text-[#1E5E4B]" />}
              </div>
              <span className="text-xs font-bold text-[#2B211E] block mt-1">Conscious Patron</span>
              <span className="text-[10px] text-[#6E5B55] block">Discover, support &amp; WhatsApp order</span>
            </button>
          </div>
        </div>

        {/* Google One-Tap Simulator */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2.5 px-4 rounded-xl border border-[#EADBCE] bg-white hover:bg-[#FBF5EE] text-xs font-bold text-[#2B211E] flex items-center justify-center gap-2 mb-4 shadow-xs transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative text-center my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#EADBCE]" />
          </div>
          <span className="relative bg-white px-2 text-[10px] text-[#6E5B55] uppercase font-bold">
            Or with email
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-[#2B211E] mb-1">Full Name:</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Fatima Al-Mansoor"
                className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#2B211E] mb-1">Email Address:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@sisterhood.org"
              className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#2B211E] mb-1">Password:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
            />
          </div>

          {mode === 'signup' && role === 'entrepreneur' && (
            <div>
              <label className="block text-[11px] font-bold text-[#2B211E] mb-1">WhatsApp Business Phone:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+919876543210"
                className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#A43E25] text-white text-xs font-bold shadow-warm-sm hover:bg-[#7F2C17] transition-all cursor-pointer mt-2"
          >
            {mode === 'signup' ? `Join as ${role === 'entrepreneur' ? 'Artisan' : 'Patron'}` : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Switchers for Convenience */}
        <div className="mt-4 pt-3 border-t border-[#EADBCE] text-center">
          <span className="text-[10px] text-[#6E5B55] block mb-2 font-medium">Quick 1-Click Demo Profiles:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuickLogin(DEMO_PROFILES[0])}
              className="flex-1 py-1.5 px-2 rounded-lg bg-[#F7EBE7] text-[#A43E25] text-[10px] font-bold hover:bg-[#A43E25] hover:text-white transition-colors cursor-pointer"
            >
              Meera (Maker)
            </button>
            <button
              onClick={() => handleQuickLogin(DEMO_PROFILES[1])}
              className="flex-1 py-1.5 px-2 rounded-lg bg-[#E8F5F0] text-[#1E5E4B] text-[10px] font-bold hover:bg-[#1E5E4B] hover:text-white transition-colors cursor-pointer"
            >
              Claire (Patron)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
