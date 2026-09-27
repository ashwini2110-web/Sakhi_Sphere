import React, { useState } from 'react';
import { Business, CatalogItem, Reel, Review, Profile } from '../../types/database';
import { saveBusiness, addCatalogItem, addReel } from '../../lib/storage';
import { INITIAL_CATEGORIES } from '../../lib/mock-data';
import { showToast } from '../ui/Toast';
import { 
  Store, Package, Wrench, Video, Star, DollarSign, Plus, CheckCircle2, 
  Trash2, Edit3, MessageSquare, TrendingUp, ShieldCheck, ExternalLink, Image as ImageIcon 
} from 'lucide-react';

interface EntrepreneurDashboardProps {
  business?: Business;
  catalogItems: CatalogItem[];
  reels: Reel[];
  reviews: Review[];
  currentUser: Profile;
  onRefreshData: () => void;
  onViewPublicProfile: (businessId: string) => void;
}

export const EntrepreneurDashboard: React.FC<EntrepreneurDashboardProps> = ({
  business,
  catalogItems,
  reels,
  reviews,
  currentUser,
  onRefreshData,
  onViewPublicProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'products' | 'services' | 'reels' | 'reviews'>('overview');

  // Business Profile Edit Form State
  const [name, setName] = useState(business?.name || `${currentUser.full_name}'s Artisan Studio`);
  const [tagline, setTagline] = useState(business?.tagline || 'Sovereign craft and generational lineage');
  const [story, setStory] = useState(business?.story || '');
  const [categoryId, setCategoryId] = useState(business?.category_id || 'cat-handloom');
  const [location, setLocation] = useState(business?.location || currentUser.location || 'Local Workshop');
  const [whatsappNumber, setWhatsappNumber] = useState(business?.whatsapp_number || '+919876543210');
  const [bannerUrl, setBannerUrl] = useState(business?.banner_url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80');

  // New Product Form State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [prodTitle, setProdTitle] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');

  // New Service Form State
  const [showAddService, setShowAddService] = useState(false);
  const [servTitle, setServTitle] = useState('');
  const [servPrice, setServPrice] = useState('');
  const [servDuration, setServDuration] = useState('60 mins');
  const [servDesc, setServDesc] = useState('');

  // New Reel Form State
  const [showAddReel, setShowAddReel] = useState(false);
  const [reelCaption, setReelCaption] = useState('');
  const [reelCategory, setReelCategory] = useState('Craft Masterclass');
  const [reelThumbnail, setReelThumbnail] = useState('');
  const [reelTaggedItem, setReelTaggedItem] = useState('');
  const [reelTaggedPrice, setReelTaggedPrice] = useState('');

  const currentBusinessId = business?.id || `biz-${currentUser.id}`;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = INITIAL_CATEGORIES.find(c => c.id === categoryId);
    const updatedBiz: Business = {
      id: currentBusinessId,
      owner_id: currentUser.id,
      owner_name: currentUser.full_name,
      owner_avatar: currentUser.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      tagline,
      story,
      category_id: categoryId,
      category_name: cat ? cat.name : 'Handloom Weaves',
      location,
      latitude: business?.latitude || 0,
      longitude: business?.longitude || 0,
      distance_km: business?.distance_km || 5.0,
      whatsapp_number: whatsappNumber,
      banner_url: bannerUrl,
      logo_url: currentUser.avatar_url || bannerUrl,
      voice_note_url: business?.voice_note_url || 'voice_custom',
      voice_note_duration: business?.voice_note_duration || '0:45',
      is_verified: true,
      elder_vouched: true,
      days_in_circle: business?.days_in_circle || 120,
      rating: business?.rating || 5.0,
      review_count: business?.review_count || 0,
      patron_count: business?.patron_count || 48,
      delivery_info: 'Worldwide Courier with 100% Escrow Shield',
      hours_info: 'Open Mon - Sat',
      created_at: business?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    saveBusiness(updatedBiz);
    onRefreshData();
    showToast('Business Profile updated successfully!', 'success');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodPrice) return;

    const newItem: CatalogItem = {
      id: `item-${Date.now()}`,
      business_id: currentBusinessId,
      type: 'product',
      title: prodTitle.trim(),
      description: prodDesc.trim() || 'Handcrafted authentic artisan piece.',
      price: parseFloat(prodPrice),
      currency: 'USD',
      image_url: prodImage.trim() || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      is_in_stock: true,
      created_at: new Date().toISOString(),
    };

    addCatalogItem(newItem);
    setProdTitle('');
    setProdPrice('');
    setProdDesc('');
    setProdImage('');
    setShowAddProduct(false);
    onRefreshData();
    showToast('Handcrafted product uploaded to your catalog!', 'success');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servTitle || !servPrice) return;

    const newItem: CatalogItem = {
      id: `item-${Date.now()}`,
      business_id: currentBusinessId,
      type: 'service',
      title: servTitle.trim(),
      description: servDesc.trim() || 'Interactive virtual workshop and mentorship.',
      price: parseFloat(servPrice),
      currency: 'USD',
      duration: servDuration,
      image_url: business?.banner_url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      is_in_stock: true,
      created_at: new Date().toISOString(),
    };

    addCatalogItem(newItem);
    setServTitle('');
    setServPrice('');
    setServDesc('');
    setShowAddService(false);
    onRefreshData();
    showToast('Workshop/Service added to your offerings!', 'success');
  };

  const handleAddReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelCaption) return;

    const newReel: Reel = {
      id: `reel-${Date.now()}`,
      business_id: currentBusinessId,
      business_name: name,
      founder_name: currentUser.full_name,
      founder_avatar: currentUser.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      founder_location: location,
      category: reelCategory,
      video_url: 'video_user_reel',
      thumbnail_url: reelThumbnail.trim() || bannerUrl,
      caption: reelCaption.trim(),
      duration: '0:60',
      tagged_item_title: reelTaggedItem.trim() || undefined,
      tagged_item_price: reelTaggedPrice ? parseFloat(reelTaggedPrice) : undefined,
      likes_count: 140,
      bookmarks_count: 32,
      shares_count: 12,
      whatsapp_number: whatsappNumber,
      audio_title: 'Artisan Workshop Live Beat',
      created_at: new Date().toISOString()
    };

    addReel(newReel);
    setReelCaption('');
    setReelThumbnail('');
    setReelTaggedItem('');
    setReelTaggedPrice('');
    setShowAddReel(false);
    onRefreshData();
    showToast('Sisterhood Reel uploaded successfully! Patrons can now watch and inquire over WhatsApp.', 'success');
  };

  const bizCatalog = catalogItems.filter(i => i.business_id === currentBusinessId);
  const bizProducts = bizCatalog.filter(i => i.type === 'product');
  const bizServices = bizCatalog.filter(i => i.type === 'service');
  const bizReels = reels.filter(r => r.business_id === currentBusinessId);
  const bizReviews = reviews.filter(r => r.business_id === currentBusinessId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      {/* Top Banner & Profile Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F0] text-[#1E5E4B] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sovereign Entrepreneur Workspace</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#2B211E]">
            {name}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5B55] mt-1">
            Zero platform commissions • Direct peer WhatsApp commerce • Community escrow protected
          </p>
        </div>

        {business && (
          <button
            onClick={() => onViewPublicProfile(business.id)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#FBF5EE] border border-[#EADBCE] text-xs font-bold text-[#A43E25] shadow-xs cursor-pointer"
          >
            <span>View Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EADBCE] mb-8 overflow-x-auto pb-1">
        {[
          { key: 'overview', label: 'Overview & Ledger', icon: TrendingUp },
          { key: 'profile', label: 'Business Profile', icon: Store },
          { key: 'products', label: `Products (${bizProducts.length})`, icon: Package },
          { key: 'services', label: `Services (${bizServices.length})`, icon: Wrench },
          { key: 'reels', label: `Sisterhood Reels (${bizReels.length})`, icon: Video },
          { key: 'reviews', label: `Verified Reviews (${bizReviews.length})`, icon: Star },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-3 font-display text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[#A43E25] text-[#A43E25]'
                  : 'border-transparent text-[#6E5B55] hover:text-[#2B211E]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#EADBCE] shadow-warm-sm">
              <span className="text-xs font-bold text-[#6E5B55] uppercase tracking-wider block">Total Sales Volume</span>
              <span className="font-display font-extrabold text-3xl text-[#2B211E] mt-2 block tabular-nums">
                $4,850.00
              </span>
              <span className="text-xs text-[#1E5E4B] font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Released via Escrow
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EADBCE] shadow-warm-sm">
              <span className="text-xs font-bold text-[#6E5B55] uppercase tracking-wider block">Platform Cut / Fees</span>
              <span className="font-display font-extrabold text-3xl text-[#1E5E4B] mt-2 block tabular-nums">
                $0.00 (0%)
              </span>
              <span className="text-xs text-[#6E5B55] mt-1 block">
                SakhiSphere takes zero fees on your venture
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EADBCE] shadow-warm-sm">
              <span className="text-xs font-bold text-[#6E5B55] uppercase tracking-wider block">Conscious Patrons</span>
              <span className="font-display font-extrabold text-3xl text-[#D97706] mt-2 block tabular-nums">
                {business?.patron_count || 48}
              </span>
              <span className="text-xs text-[#6E5B55] mt-1 block">
                Direct WhatsApp connections
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EADBCE] shadow-warm-sm">
              <span className="text-xs font-bold text-[#6E5B55] uppercase tracking-wider block">Sovereign Score</span>
              <div className="flex items-center gap-1.5 mt-2">
                <Star className="w-6 h-6 text-[#D97706] fill-current" />
                <span className="font-display font-extrabold text-3xl text-[#2B211E] tabular-nums">
                  {business?.rating || 5.0}
                </span>
              </div>
              <span className="text-xs text-[#1E5E4B] font-semibold mt-1 block">
                Peer Elder Endorsed
              </span>
            </div>
          </div>

          {/* WhatsApp Direct Inquiries Ledger */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCE] shadow-warm-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-xl text-[#2B211E]">
                  Recent Patron Inquiries (WhatsApp Bridge)
                </h3>
                <p className="text-xs text-[#6E5B55] mt-0.5">
                  Patrons who clicked your WhatsApp link with prefilled inquiries.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E8F5F0] text-[#1E5E4B] text-xs font-bold">
                Direct P2P
              </span>
            </div>

            <div className="divide-y divide-[#EADBCE]/60">
              {[
                { name: 'Claire Henderson (London)', time: '2 hours ago', inquiry: 'Inquiry on Handcrafted Tapestry custom dimensions' },
                { name: 'Amira Kassam (Toronto)', time: 'Yesterday', inquiry: 'Order inquiry for 2x Wild Rosehip Dew 50ml' },
                { name: 'Sophia Mueller (Berlin)', time: '3 days ago', inquiry: 'Booking consultation for virtual loom masterclass' },
              ].map((inq, i) => (
                <div key={i} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <h5 className="font-bold text-[#2B211E]">{inq.name}</h5>
                    <p className="text-[#6E5B55] mt-0.5">{inq.inquiry}</p>
                  </div>
                  <span className="text-[11px] text-[#6E5B55] shrink-0">{inq.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Profile Edit */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCE] shadow-warm-sm max-w-3xl space-y-6">
          <h3 className="font-display font-bold text-xl text-[#2B211E] pb-2 border-b border-[#EADBCE]">
            Edit Business &amp; Craft Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B211E] mb-1">
                Business / Studio Name:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E] focus:outline-none focus:border-[#A43E25]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B211E] mb-1">
                Craft Discipline / Category:
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E] focus:outline-none focus:border-[#A43E25] cursor-pointer"
              >
                {INITIAL_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B211E] mb-1">
              Short Tagline (Shown on cards &amp; reels):
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Preserving 500-year-old resist-block traditions with river-friendly plant dyes"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E] focus:outline-none focus:border-[#A43E25]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B211E] mb-1">
                Workshop Location:
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kutch, Gujarat or Manali, Himachal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E] focus:outline-none focus:border-[#A43E25]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B211E] mb-1">
                WhatsApp Studio Phone Number:
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. +919876543210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E] focus:outline-none focus:border-[#A43E25]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B211E] mb-1">
              Cover Banner Image URL:
            </label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E] focus:outline-none focus:border-[#A43E25]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B211E] mb-1">
              Origin Story &amp; Lineage:
            </label>
            <textarea
              rows={5}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Tell patrons about your generational training, materials used, and the families supported by your craft..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E] focus:outline-none focus:border-[#A43E25]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-7 py-3 rounded-full bg-[#A43E25] text-white text-xs font-bold shadow-warm-sm hover:bg-[#7F2C17] cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* Tab: Products */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-[#2B211E]">
              Handcrafted Product Catalog
            </h3>
            <button
              onClick={() => setShowAddProduct(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#A43E25] text-white text-xs font-bold hover:bg-[#7F2C17] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Handcrafted Product</span>
            </button>
          </div>

          {/* Add Product Modal */}
          {showAddProduct && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 max-w-lg w-full shadow-2xl">
                <h4 className="font-display font-bold text-lg text-[#2B211E] pb-3 border-b border-[#EADBCE]">
                  Add Product to Catalog
                </h4>
                <form onSubmit={handleAddProduct} className="space-y-4 pt-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2B211E] mb-1">Product Title:</label>
                    <input
                      type="text"
                      required
                      value={prodTitle}
                      onChange={(e) => setProdTitle(e.target.value)}
                      placeholder="e.g. Himalayan Rosehip Dew"
                      className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2B211E] mb-1">Price (USD):</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="e.g. 48"
                      className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2B211E] mb-1">Description:</label>
                    <textarea
                      rows={3}
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      placeholder="Describe the materials, distillation, or knot density..."
                      className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2B211E] mb-1">Photo Image URL:</label>
                    <input
                      type="url"
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      placeholder="Paste image link or leave blank for default"
                      className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="px-4 py-2 rounded-full border border-[#EADBCE] text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#A43E25] text-white text-xs font-bold"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bizProducts.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-[#EADBCE] overflow-hidden shadow-warm-sm p-4 flex flex-col justify-between">
                <div>
                  <img src={p.image_url} alt={p.title} className="w-full aspect-[4/3] object-cover rounded-xl mb-3" />
                  <div className="flex items-center justify-between">
                    <h5 className="font-display font-bold text-base text-[#2B211E]">{p.title}</h5>
                    <span className="font-bold text-sm text-[#A43E25]">${p.price}</span>
                  </div>
                  <p className="text-xs text-[#6E5B55] mt-1 line-clamp-2">{p.description}</p>
                </div>
                <div className="pt-3 border-t border-[#EADBCE]/60 flex items-center justify-between mt-3 text-xs">
                  <span className="text-[#1E5E4B] font-semibold">Active in Store</span>
                  <span className="text-[#6E5B55]">Escrow Protected</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Services */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-[#2B211E]">
              Workshops &amp; Consultations
            </h3>
            <button
              onClick={() => setShowAddService(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E5E4B] text-white text-xs font-bold hover:bg-[#1E5E4B]/90 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Virtual Workshop</span>
            </button>
          </div>

          {/* Add Service Modal */}
          {showAddService && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 max-w-lg w-full shadow-2xl">
                <h4 className="font-display font-bold text-lg text-[#2B211E] pb-3 border-b border-[#EADBCE]">
                  Add Service or Workshop
                </h4>
                <form onSubmit={handleAddService} className="space-y-4 pt-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2B211E] mb-1">Service Title:</label>
                    <input
                      type="text"
                      required
                      value={servTitle}
                      onChange={(e) => setServTitle(e.target.value)}
                      placeholder="e.g. 1-on-1 Loom Knotting Masterclass"
                      className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#2B211E] mb-1">Price (USD):</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={servPrice}
                        onChange={(e) => setServPrice(e.target.value)}
                        placeholder="e.g. 65"
                        className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2B211E] mb-1">Duration:</label>
                      <input
                        type="text"
                        required
                        value={servDuration}
                        onChange={(e) => setServDuration(e.target.value)}
                        placeholder="e.g. 60 mins"
                        className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2B211E] mb-1">Description:</label>
                    <textarea
                      rows={3}
                      value={servDesc}
                      onChange={(e) => setServDesc(e.target.value)}
                      placeholder="Details on what participants will learn..."
                      className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddService(false)}
                      className="px-4 py-2 rounded-full border border-[#EADBCE] text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#1E5E4B] text-white text-xs font-bold"
                    >
                      Save Service
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bizServices.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-[#EADBCE] p-5 shadow-warm-sm flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#1E5E4B] bg-[#E8F5F0] px-2 py-0.5 rounded-full">
                      {s.duration} Live Session
                    </span>
                    <span className="font-bold text-base text-[#A43E25]">${s.price}</span>
                  </div>
                  <h5 className="font-display font-bold text-lg text-[#2B211E] mt-2">{s.title}</h5>
                  <p className="text-xs text-[#6E5B55] mt-1">{s.description}</p>
                </div>
                <div className="pt-3 border-t border-[#EADBCE]/60 text-xs text-[#6E5B55] flex justify-between">
                  <span>Available on WhatsApp Booking</span>
                  <span className="text-[#1E5E4B] font-semibold">100% Payout</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Reels */}
      {activeTab === 'reels' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-[#2B211E]">
              Your Sisterhood Reels
            </h3>
            <button
              onClick={() => setShowAddReel(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#A43E25] text-white text-xs font-bold hover:bg-[#7F2C17] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload 60s Reel</span>
            </button>
          </div>

          {/* Add Reel Modal */}
          {showAddReel && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 max-w-lg w-full shadow-2xl">
                <h4 className="font-display font-bold text-lg text-[#2B211E] pb-3 border-b border-[#EADBCE]">
                  Post a Craft / Story Reel
                </h4>
                <form onSubmit={handleAddReel} className="space-y-4 pt-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2B211E] mb-1">Caption / Story Pitch:</label>
                    <textarea
                      required
                      rows={3}
                      value={reelCaption}
                      onChange={(e) => setReelCaption(e.target.value)}
                      placeholder='e.g. "Distilling pure Himalayan Rosehip petals steeped at dawn"'
                      className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#2B211E] mb-1">Reel Category:</label>
                      <select
                        value={reelCategory}
                        onChange={(e) => setReelCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
                      >
                        <option>Craft Masterclass</option>
                        <option>Live Harvest</option>
                        <option>New Drop</option>
                        <option>Founder Lesson</option>
                        <option>Patron Unboxing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2B211E] mb-1">Thumbnail / Photo URL:</label>
                      <input
                        type="url"
                        value={reelThumbnail}
                        onChange={(e) => setReelThumbnail(e.target.value)}
                        placeholder="Image URL or leave blank"
                        className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#2B211E] mb-1">Tagged Product Name:</label>
                      <input
                        type="text"
                        value={reelTaggedItem}
                        onChange={(e) => setReelTaggedItem(e.target.value)}
                        placeholder="e.g. Rosehip Dew"
                        className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2B211E] mb-1">Tagged Product Price ($):</label>
                      <input
                        type="number"
                        value={reelTaggedPrice}
                        onChange={(e) => setReelTaggedPrice(e.target.value)}
                        placeholder="e.g. 48"
                        className="w-full px-3 py-2 rounded-xl bg-[#FBF5EE] border border-[#EADBCE] text-xs text-[#2B211E]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddReel(false)}
                      className="px-4 py-2 rounded-full border border-[#EADBCE] text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#A43E25] text-white text-xs font-bold"
                    >
                      Publish Reel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {bizReels.map(r => (
              <div key={r.id} className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-warm-sm">
                <img src={r.thumbnail_url} alt={r.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                  <p className="font-bold line-clamp-2">{r.caption}</p>
                  <span className="text-[10px] text-white/80 mt-1 block">❤️ {r.likes_count} likes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h3 className="font-display font-bold text-xl text-[#2B211E]">
            Verified Patron Reviews &amp; Testimonials
          </h3>
          {bizReviews.length === 0 ? (
            <p className="text-xs text-[#6E5B55]">No reviews recorded yet for this studio.</p>
          ) : (
            <div className="space-y-3">
              {bizReviews.map(r => (
                <div key={r.id} className="p-5 bg-white rounded-2xl border border-[#EADBCE] space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-sm text-[#2B211E]">{r.customer_name}</h5>
                    <div className="flex text-[#D97706]">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <h6 className="font-semibold text-xs text-[#2B211E]">{r.title}</h6>
                  <p className="text-xs text-[#6E5B55] italic">“{r.content}”</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
