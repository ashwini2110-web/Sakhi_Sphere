import React, { useState, useEffect } from 'react';
import { 
  getStoredUser, setStoredUser, getStoredBusinesses, getStoredCatalog, 
  getStoredReels, getStoredReviews, DEFAULT_ENTREPRENEUR, DEFAULT_USER 
} from './lib/storage';
import { Business, CatalogItem, Reel, Review, Profile, UserRole } from './types/database';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { CategoryGrid } from './components/home/CategoryGrid';
import { SisterhoodReelsShowcase } from './components/home/SisterhoodReelsShowcase';
import { ImpactStats } from './components/home/ImpactStats';
import { NearMeRadar } from './components/home/NearMeRadar';
import { FounderStoryCards } from './components/home/FounderStoryCards';
import { TransformationArc } from './components/home/TransformationArc';
import { TrustPillars } from './components/home/TrustPillars';
import { TestimonialSection } from './components/home/TestimonialSection';
import { DualCtaSection } from './components/home/DualCtaSection';
import { FloatingSakhiAi } from './components/home/FloatingSakhiAi';
import { DiscoverView } from './components/discover/DiscoverView';
import { BusinessProfileView } from './components/business/BusinessProfileView';
import { ReelsFeedView } from './components/reels/ReelsFeedView';
import { EntrepreneurDashboard } from './components/dashboard/EntrepreneurDashboard';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { SupabaseArchitectureModal } from './components/docs/SupabaseArchitectureModal';
import { ToastContainer, showToast } from './components/ui/Toast';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'discover' | 'profile' | 'reels' | 'dashboard'>('home');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('biz-meera');
  const [selectedReelId, setSelectedReelId] = useState<string | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<Profile>(getStoredUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<string | undefined>(undefined);

  // Live Data State from Storage
  const [businesses, setBusinesses] = useState<Business[]>(getStoredBusinesses);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(() => getStoredCatalog());
  const [reels, setReels] = useState<Reel[]>(getStoredReels);
  const [reviews, setReviews] = useState<Review[]>(() => getStoredReviews());

  // Modals State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  const refreshData = () => {
    setBusinesses(getStoredBusinesses());
    setCatalogItems(getStoredCatalog());
    setReels(getStoredReels());
    setReviews(getStoredReviews());
    setCurrentUser(getStoredUser());
  };

  const handleNavigate = (tab: string, param?: string) => {
    if (tab === 'profile' && param) {
      setSelectedBusinessId(param);
    }
    if (tab === 'reels' && param) {
      setSelectedReelId(param);
    }
    setCurrentTab(tab as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchFromHero = (query: string, category?: string) => {
    setSearchQuery(query);
    setSearchCategory(category);
    setCurrentTab('discover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchUserRole = () => {
    const nextRole: UserRole = currentUser.role === 'entrepreneur' ? 'customer' : 'entrepreneur';
    const updated: Profile = nextRole === 'entrepreneur' ? DEFAULT_ENTREPRENEUR : DEFAULT_USER;
    setCurrentUser(updated);
    setStoredUser(updated);
    showToast(
      `Switched to Demo ${nextRole === 'entrepreneur' ? 'Entrepreneur (Meera Patel - Artisan Hub)' : 'Customer (Claire Henderson - Patron Space)'}`,
      'info'
    );
  };

  const currentBusiness = businesses.find(b => b.id === selectedBusinessId) || businesses[0];
  const userBusiness = businesses.find(b => b.owner_id === currentUser.id) || businesses[1]; // default to Meera for demo
  const myReviews = reviews.filter(r => r.customer_id === currentUser.id);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B211E] flex flex-col font-body selection:bg-[#FEF3C7] selection:text-[#A43E25]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab, param) => handleNavigate(tab, param)}
        currentUser={currentUser}
        onSwitchUserRole={handleSwitchUserRole}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-32 pb-16">
        {/* VIEW: HOME */}
        {currentTab === 'home' && (
          <div className="space-y-4">
            <HeroSection
              onSearch={handleSearchFromHero}
              onExplore={() => handleNavigate('discover')}
              onOpenFounder={(id) => handleNavigate('profile', id)}
              onJoin={() => setIsAuthOpen(true)}
            />

            <CategoryGrid
              selectedCategory={searchCategory}
              onSelectCategory={(catId) => {
                setSearchCategory(catId);
                setCurrentTab('discover');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <SisterhoodReelsShowcase
              reels={reels}
              onOpenReelsFeed={(reelId) => handleNavigate('reels', reelId)}
              onOpenFounderProfile={(bizId) => handleNavigate('profile', bizId)}
              onUploadReelClick={() => {
                if (currentUser.role !== 'entrepreneur') {
                  handleSwitchUserRole();
                }
                setCurrentTab('dashboard');
              }}
            />

            <ImpactStats />

            <NearMeRadar
              onOpenBusiness={(bizId) => handleNavigate('profile', bizId)}
            />

            <FounderStoryCards
              businesses={businesses}
              onOpenBusiness={(bizId) => handleNavigate('profile', bizId)}
              onExploreDirectory={() => handleNavigate('discover')}
            />

            <TransformationArc
              onOpenFounder={(bizId) => handleNavigate('profile', bizId)}
            />

            <TrustPillars />

            <TestimonialSection />

            <DualCtaSection
              onExploreFounders={() => handleNavigate('discover')}
              onStartJourney={() => setIsAuthOpen(true)}
            />

            <FloatingSakhiAi />
          </div>
        )}

        {/* VIEW: DISCOVER */}
        {currentTab === 'discover' && (
          <DiscoverView
            businesses={businesses}
            initialCategory={searchCategory}
            initialQuery={searchQuery}
            onOpenBusiness={(bizId) => handleNavigate('profile', bizId)}
          />
        )}

        {/* VIEW: BUSINESS PROFILE */}
        {currentTab === 'profile' && currentBusiness && (
          <BusinessProfileView
            business={currentBusiness}
            catalogItems={catalogItems.filter(i => i.business_id === currentBusiness.id)}
            reels={reels.filter(r => r.business_id === currentBusiness.id)}
            reviews={reviews.filter(r => r.business_id === currentBusiness.id)}
            currentUser={currentUser}
            onBack={() => handleNavigate('discover')}
            onOpenReel={(reelId) => handleNavigate('reels', reelId)}
            onRefreshData={refreshData}
          />
        )}

        {/* VIEW: SISTERHOOD REELS FEED */}
        {currentTab === 'reels' && (
          <ReelsFeedView
            reels={reels}
            initialReelId={selectedReelId}
            onOpenFounderProfile={(bizId) => handleNavigate('profile', bizId)}
            onUploadReelClick={() => {
              if (currentUser.role !== 'entrepreneur') {
                handleSwitchUserRole();
              }
              setCurrentTab('dashboard');
            }}
            onBack={() => handleNavigate('home')}
          />
        )}

        {/* VIEW: DASHBOARD (Role-Aware) */}
        {currentTab === 'dashboard' && (
          <div>
            {currentUser.role === 'entrepreneur' ? (
              <EntrepreneurDashboard
                business={userBusiness}
                catalogItems={catalogItems}
                reels={reels}
                reviews={reviews}
                currentUser={currentUser}
                onRefreshData={refreshData}
                onViewPublicProfile={(bizId) => handleNavigate('profile', bizId)}
              />
            ) : (
              <CustomerDashboard
                businesses={businesses}
                currentUser={currentUser}
                myReviews={myReviews}
                onOpenBusiness={(bizId) => handleNavigate('profile', bizId)}
                onExploreMakers={() => handleNavigate('discover')}
                onRefreshData={refreshData}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      {currentTab !== 'reels' && (
        <Footer
          onNavigate={(tab, param) => handleNavigate(tab, param)}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          refreshData();
        }}
      />

      {/* Supabase Architecture & Deployment Guide Modal */}
      <SupabaseArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Non-blocking in-app toasts */}
      <ToastContainer />
    </div>
  );
}
