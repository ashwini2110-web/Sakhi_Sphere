import React, { useState } from 'react';
import { playArtisanVoiceNote } from '../../lib/storage';
import { Mic, Keyboard, ChevronRight, Sparkles, MessageCircle, X, Volume2, ShieldCheck, ChevronUp } from 'lucide-react';

export const FloatingSakhiAi: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: '“Namaste sister! I’m here to safeguard your dignity, calculate living wages, review export catalogs, and guide your venture step by step.”'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const triggerVoiceSpeak = (founderAlias: string) => {
    setIsSpeaking(true);
    playArtisanVoiceNote(founderAlias, () => {
      setIsSpeaking(false);
    });
  };

  const handleQuickPrompt = (promptType: string) => {
    let aiResponse = '';
    let userMsg = '';

    if (promptType === 'pricing') {
      userMsg = 'Help me price my handcrafted piece fairly';
      aiResponse = 'To protect your craft: add Raw Material Costs + (Hours spent × $18/hr Living Wage) + 15% Studio Overhead + 20% Reinvestment Buffer. Never discount your handmade labor!';
      triggerVoiceSpeak('Sakhi Pricing');
    } else if (promptType === 'catalog') {
      userMsg = 'Review my catalog and story tags';
      aiResponse = 'Your titles should highlight generational technique (e.g. "Pit-Loom 8-Ply Cotton") and natural provenance (e.g. "River Indigo Dyed"). Conscious patrons value the human hands behind the piece over generic adjectives.';
      triggerVoiceSpeak('Sakhi Catalog');
    } else if (promptType === 'voice_mode') {
      userMsg = 'Switch to Hindi / English voice mode';
      aiResponse = 'नमस्ते बहन! Voice mode is active. You can speak freely or send WhatsApp voice memos to our sisterhood circles.';
      triggerVoiceSpeak('Sakhi Hindi');
    }

    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: userMsg },
      { sender: 'ai', text: aiResponse }
    ]);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userQ = inputText.trim();
    setInputText('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userQ }]);

    // Simulated empathetic artisan coaching response
    setTimeout(() => {
      let reply = `Sister, regarding "${userQ}": on SakhiSphere, you have full pricing autonomy and zero platform cuts on your first $1,000. We recommend connecting directly with your regional peer circle for supplier discounts and micro-grant applications.`;
      if (userQ.toLowerCase().includes('price') || userQ.toLowerCase().includes('cost')) {
        reply = 'Benchmark your prices against fair direct-to-artisan international standards. Patrons on SakhiSphere pay for provenance and dignity, not bargain liquidation.';
      } else if (userQ.toLowerCase().includes('shipping') || userQ.toLowerCase().includes('export')) {
        reply = 'Our zero-fee escrow holds funds until tracked international delivery is signed by the patron, protecting you against credit card chargebacks.';
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      triggerVoiceSpeak('Sakhi Answer');
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded AI Companion Card */}
      {isOpen && (
        <div className="mb-2 w-80 sm:w-96 bg-white rounded-3xl p-5 shadow-warm-lg border-2 border-[#EADBCE] text-[#2B211E] animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#EADBCE]/80">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1E5E4B] to-[#E8F5F0] text-white shadow-warm-sm">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  support_agent
                </span>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
              </div>
              <div>
                <div className="font-display font-bold text-base text-[#2B211E] flex items-center gap-1.5">
                  Sakhi AI <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F5F0] text-[#1E5E4B] font-bold uppercase tracking-wider">Active Companion</span>
                </div>
                <span className="text-xs text-[#6E5B55]">Voice &amp; Business Mentor (14 Languages)</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-[#FBF5EE] hover:bg-[#F7EBE7] flex items-center justify-center text-[#6E5B55] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="max-h-56 overflow-y-auto py-3 space-y-2.5 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl ${
                  msg.sender === 'ai'
                    ? 'bg-[#FBF5EE] text-[#2B211E] border border-[#EADBCE]/60'
                    : 'bg-[#A43E25] text-white ml-6'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Quick Pillars Grid */}
          <div className="grid grid-cols-2 gap-1.5 my-2">
            <button
              onClick={() => handleQuickPrompt('pricing')}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FBF5EE] hover:bg-[#F7EBE7] border border-[#EADBCE]/60 text-[11px] text-[#2B211E] font-medium cursor-pointer text-left"
            >
              <span className="material-symbols-outlined text-[#1E5E4B] text-sm">currency_exchange</span>
              <span className="truncate">Product Pricing Advice</span>
            </button>

            <button
              onClick={() => handleQuickPrompt('catalog')}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FBF5EE] hover:bg-[#F7EBE7] border border-[#EADBCE]/60 text-[11px] text-[#2B211E] font-medium cursor-pointer text-left"
            >
              <span className="material-symbols-outlined text-[#D97706] text-sm">campaign</span>
              <span className="truncate">Catalog Story Review</span>
            </button>

            <button
              onClick={() => handleQuickPrompt('pricing')}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FBF5EE] hover:bg-[#F7EBE7] border border-[#EADBCE]/60 text-[11px] text-[#2B211E] font-medium cursor-pointer text-left"
            >
              <span className="material-symbols-outlined text-[#A43E25] text-sm">rocket_launch</span>
              <span className="truncate">Zero-Fee Escrow Help</span>
            </button>

            <button
              onClick={() => handleQuickPrompt('voice_mode')}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FBF5EE] hover:bg-[#F7EBE7] border border-[#EADBCE]/60 text-[11px] text-[#2B211E] font-medium cursor-pointer text-left"
            >
              <span className="material-symbols-outlined text-[#C86D51] text-sm">translate</span>
              <span className="truncate">Voice Hindi/English</span>
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="pt-2 border-t border-[#EADBCE]/80 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about fair pricing, taxes, or reels..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#FBF5EE] text-xs text-[#2B211E] border border-[#EADBCE] focus:outline-none focus:border-[#A43E25]"
            />

            <button
              type="button"
              onClick={() => triggerVoiceSpeak('Sakhi Voice')}
              title="Listen to vocal coach"
              className={`p-2.5 rounded-xl border border-[#EADBCE] transition-colors cursor-pointer ${
                isSpeaking ? 'bg-[#A43E25] text-white animate-pulse' : 'bg-[#FBF5EE] text-[#A43E25] hover:bg-[#F7EBE7]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#A43E25] text-white hover:bg-[#7F2C17] transition-all cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 pl-3.5 pr-3 rounded-full bg-white/95 backdrop-blur-md border-2 border-[#EADBCE] shadow-warm-lg hover:shadow-warm-lg hover:scale-105 transition-all cursor-pointer group hover:border-[#A43E25]/60"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E5E4B] to-[#E8F5F0] text-white shadow-xs">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              support_agent
            </span>
            <span className="absolute -inset-1 rounded-full border-2 border-[#1E5E4B]/50 animate-ping" />
          </div>
          <div className="flex flex-col pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-[#2B211E] leading-tight">Sakhi AI</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[10px] text-[#C86D51] font-medium leading-none">
              Voice &amp; Business Mentor (14 Languages)
            </span>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-[#FBF5EE] text-[#A43E25] flex items-center justify-center border border-[#EADBCE] group-hover:bg-[#A43E25] group-hover:text-white transition-colors">
          <ChevronUp className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </div>
  );
};
