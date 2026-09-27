import React, { useState } from 'react';
import { generateWhatsAppLink, buildGeneralInquiryMessage } from '../../lib/whatsapp';
import { Navigation, MapPin, Sliders, MessageSquare, Star, Store, Sparkles, Truck } from 'lucide-react';

interface NearMeRadarProps {
  onOpenBusiness: (businessId: string) => void;
}

export const NearMeRadar: React.FC<NearMeRadarProps> = ({ onOpenBusiness }) => {
  const [radiusKm, setRadiusKm] = useState(25);
  const [showRadiusSlider, setShowRadiusSlider] = useState(false);

  const localMakers = [
    {
      id: 'biz-meera',
      name: 'Aura Pottery & Terracotta Studio',
      distance: '3.2 km away',
      badge: 'Open Today',
      description: 'Artisanal stoneware, pit-fired cookware & pottery workshops.',
      rating: 4.96,
      visits: 142,
      phone: '+919876543210',
      actionText: 'WhatsApp Studio',
      icon: 'storefront',
      color: 'text-[#1E5E4B]',
      bg: 'bg-[#E8F5F0]'
    },
    {
      id: 'biz-amani',
      name: 'Wild Honey & Forest Foragers Guild',
      distance: '7.8 km away',
      badge: 'Same-Day Pickup',
      description: 'Raw organic multi-flora honey, beeswax balms, and wild tisanes.',
      rating: 5.0,
      visits: 89,
      phone: '+254712345678',
      actionText: 'WhatsApp Guild',
      icon: 'local_florist',
      color: 'text-[#D97706]',
      bg: 'bg-[#FEF3C7]'
    },
    {
      id: 'biz-sunita',
      name: 'Kalamkari & Natural Indigo Atelier',
      distance: '12.4 km away',
      badge: 'Free Local Delivery',
      description: 'Hand-carved block prints on organic certified GOTS cotton yardage.',
      rating: 4.98,
      visits: 310,
      phone: '+919811223344',
      actionText: 'WhatsApp Atelier',
      icon: 'palette',
      color: 'text-[#A43E25]',
      bg: 'bg-[#F7EBE7]'
    }
  ];

  return (
    <section className="w-full py-16 bg-[#FFFDF9] border-b border-[#EADBCE]" id="near-me">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5F0] text-[#1E5E4B] text-xs font-bold tracking-wider uppercase mb-2 border border-[#1E5E4B]/20">
              <Navigation className="w-3.5 h-3.5 animate-pulse" />
              <span>Geolocation Sister Discovery</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-[#2B211E]">
              Women Entrepreneurs Near You
            </h2>
            <p className="text-[#6E5B55] text-sm sm:text-base mt-1">
              Connect with sovereign matriarchs, studios, and local cooperatives within driving distance or your local shipping radius.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FBF5EE] border border-[#EADBCE] text-xs font-medium text-[#2B211E]">
              <MapPin className="w-3.5 h-3.5 text-[#C86D51]" />
              <span>Detecting: {radiusKm} km Radius</span>
            </div>

            <button
              onClick={() => setShowRadiusSlider(!showRadiusSlider)}
              className="px-4 py-2 rounded-full bg-white hover:bg-[#FBF5EE] border border-[#EADBCE] text-xs font-bold text-[#2B211E] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-[#A43E25]" />
              <span>Adjust Radius</span>
            </button>
          </div>
        </div>

        {/* Radius adjustment interactive drawer */}
        {showRadiusSlider && (
          <div className="mb-8 p-4 bg-[#FBF5EE] rounded-2xl border border-[#EADBCE] max-w-md flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#2B211E]">
              <span>Search Distance Radius:</span>
              <span className="text-[#A43E25] tabular-nums font-mono">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-[#A43E25] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6E5B55]">
              <span>5 km (Local Walk)</span>
              <span>25 km (Regional Studio)</span>
              <span>100 km (Courier Radius)</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {localMakers.map((maker) => {
            const waUrl = generateWhatsAppLink(
              maker.phone,
              buildGeneralInquiryMessage(maker.name)
            );

            return (
              <div
                key={maker.name}
                onClick={() => onOpenBusiness(maker.id)}
                className="bg-white rounded-2xl border border-[#EADBCE] p-5 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl ${maker.bg} ${maker.color} flex items-center justify-center shrink-0 shadow-xs`}>
                    <span className="material-symbols-outlined text-2xl">{maker.icon}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${maker.color} ${maker.bg} px-2 py-0.5 rounded-full`}>
                        {maker.distance}
                      </span>
                      <span className="text-[11px] text-[#6E5B55]">• {maker.badge}</span>
                    </div>

                    <h4 className="font-display font-bold text-base text-[#2B211E] mt-1 group-hover:text-[#A43E25] transition-colors">
                      {maker.name}
                    </h4>

                    <p className="text-xs text-[#6E5B55] mt-0.5 leading-relaxed">
                      {maker.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#EADBCE]/60 text-xs">
                  <span className="text-[#6E5B55] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#D97706] fill-current" />
                    <span className="font-bold text-[#2B211E] tabular-nums">{maker.rating}</span> ({maker.visits} patrons)
                  </span>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-bold text-[#1E5E4B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{maker.actionText}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
