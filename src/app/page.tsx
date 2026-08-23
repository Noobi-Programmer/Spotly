'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useCampusStore } from '@/lib/store/useCampusStore';
import { rankSpaces } from '@/lib/engine/recommendation';
import { CampusLocation } from '@/types';
import { SST_FLOOR_ORDER } from '@/lib/supabase/seed-data';
import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { LandingPageSection } from '@/components/landing/LandingPageSection';
import { LocationPermissionBanner } from '@/components/layout/LocationPermissionBanner';
import { BlockWiseSpaceView } from '@/components/spaces/BlockWiseSpaceView';
import { SpaceDetailModal } from '@/components/spaces/SpaceDetailModal';
import { SeatBookingModal } from '@/components/booking/SeatBookingModal';
import { LoginModal } from '@/components/auth/LoginModal';
import { CampusMap } from '@/components/map/CampusMap';
import { FindSpaceModal } from '@/components/recommendation/FindSpaceModal';
import { RecommendationBanner } from '@/components/recommendation/RecommendationBanner';
import { NotifyModal } from '@/components/alerts/NotifyModal';
import { ActiveAlertsDrawer } from '@/components/alerts/ActiveAlertsDrawer';
import { AlertToast } from '@/components/alerts/AlertToast';
import { SimulatorControlTray } from '@/components/simulator/SimulatorControlTray';
import {
  Sparkles,
  Search,
  Zap,
  VolumeX,
  Wifi,
  Users,
  Navigation,
  Compass,
  Home,
  SlidersHorizontal,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useSupabaseRealtime } from '@/lib/supabase/useSupabaseRealtime';
import { getActiveUserSession } from '@/lib/supabase/client';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function CampusSpaceApp() {
  const {
    locations,
    currentCampusLocations,
    selectedCampus,
    selectedCategory,
    setSelectedCategory,
    selectedFloor,
    setSelectedFloor,
    userCoordinates,
    alerts,
    activeAlertTrigger,
    clearAlertTrigger,
    campusOccupancyPercentage,
    totalAvailableSeats,
    selectedLocation,
    setSelectedLocation,
    isFindModalOpen,
    setIsFindModalOpen,
    isNotifyModalOpen,
    setIsNotifyModalOpen,
    isSimulatorOpen,
    setIsSimulatorOpen,
    activeTab,
    setActiveTab,
    filterType,
    setFilterType,
    filterQuietOnly,
    setFilterQuietOnly,
    filterChargingOnly,
    setFilterChargingOnly,
    userPreferences,
    setUserPreferences,
    updateOccupancy,
    submitCrowdReport,
    createAlert,
    removeAlert,
    runPresetScenario,
  } = useCampusStore();

  // DEFAULT VIEW: SAAS HOMEPAGE / LANDING
  const [showLanding, setShowLanding] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [spaciousOnly, setSpaciousOnly] = useState(false);
  const [isActiveAlertsDrawerOpen, setIsActiveAlertsDrawerOpen] = useState(false);
  const [targetNotifyLocation, setTargetNotifyLocation] = useState<CampusLocation | null>(null);
  const [targetBookingLocation, setTargetBookingLocation] = useState<CampusLocation | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Time-aware greeting
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning.' : currentHour < 17 ? 'Good afternoon.' : 'Good evening.';

  // Mount Supabase Realtime Listener (WebSocket & Auth state changes)
  useSupabaseRealtime((email) => {
    setCurrentUser(email);
  });

  // Restore authenticated session on mount
  useEffect(() => {
    getActiveUserSession().then(({ email }) => {
      if (email) setCurrentUser(email);
    });
  }, []);

  // Compute top recommendation within active campus using live coordinates & preferences
  const rankedSpaces = useMemo(() => {
    const pool =
      selectedCategory !== 'all'
        ? currentCampusLocations.filter((l) => l.category === selectedCategory)
        : currentCampusLocations;
    return rankSpaces(pool.length > 0 ? pool : currentCampusLocations, userPreferences, userCoordinates);
  }, [currentCampusLocations, selectedCategory, userPreferences, userCoordinates]);

  const topRecommendation = rankedSpaces.length > 0 ? rankedSpaces[0] : null;

  // Filter locations for grid/map
  const filteredLocations = useMemo(() => {
    return currentCampusLocations.filter((loc) => {
      if (selectedCategory !== 'all' && loc.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          loc.name.toLowerCase().includes(q) ||
          loc.building.toLowerCase().includes(q) ||
          loc.description.toLowerCase().includes(q) ||
          loc.floor.toLowerCase().includes(q) ||
          loc.type.toLowerCase().includes(q) ||
          loc.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [currentCampusLocations, selectedCategory, searchQuery]);

  const handleOpenNotify = (loc: CampusLocation) => {
    setTargetNotifyLocation(loc);
    setIsNotifyModalOpen(true);
  };

  const handleOpenBookSeat = (loc: CampusLocation) => {
    setTargetBookingLocation(loc);
    setIsBookingModalOpen(true);
  };

  const toggleChipPreference = (chip: 'quiet' | 'charging' | 'wifi' | 'lowCrowd' | 'nearMe') => {
    if (chip === 'quiet') {
      setUserPreferences({
        ...userPreferences,
        quiet: !userPreferences.quiet,
      });
    } else if (chip === 'charging') {
      setUserPreferences({
        ...userPreferences,
        charging: !userPreferences.charging,
      });
    } else if (chip === 'wifi') {
      setUserPreferences({
        ...userPreferences,
        wifi: !userPreferences.wifi,
      });
    } else if (chip === 'lowCrowd') {
      setUserPreferences({
        ...userPreferences,
        low_crowd: !userPreferences.low_crowd,
      });
    } else if (chip === 'nearMe') {
      setUserPreferences({
        ...userPreferences,
        nearby: !userPreferences.nearby,
      });
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-tertiary selection:text-on-tertiary pb-16 md:pb-0">
      {/* Top Navigation Bar */}
      <Header
        onOpenActiveAlerts={() => setIsActiveAlertsDrawerOpen(true)}
        activeAlertCount={alerts.filter((a) => a.is_active).length}
        showLanding={showLanding}
        onToggleLanding={() => setShowLanding(!showLanding)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        {showLanding ? (
          <LandingPageSection
            onEnterApp={() => setShowLanding(false)}
            campusOccupancyPercentage={campusOccupancyPercentage}
            totalAvailableSeats={totalAvailableSeats}
          />
        ) : (
          <>
            {/* Return to Homepage Bar */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-surface-variant">
              <button
                onClick={() => setShowLanding(true)}
                className="flex items-center gap-1.5 text-xs font-sora font-semibold text-primary hover:text-tertiary transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Return to Homepage</span>
              </button>
              <span className="text-xs font-mono text-on-surface-variant">
                SPOTLY LIVE ENGINE
              </span>
            </div>

            {/* Location Permission & Geo Banner */}
            <LocationPermissionBanner />

            {/* 🌟 APP-FIRST OPENING HERO & BRAIN QUERY BAR */}
            <section className="mb-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono block mb-1">
                    SPOTLY CAMPUS DECISION ENGINE
                  </span>
                  <h1 className="font-sora text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight">
                    {greeting} <span className="text-tertiary font-normal">What do you need right now?</span>
                  </h1>
                </div>

                {/* View Switcher: Spaces vs Map */}
                <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-2xl bg-surface-container border border-primary-container/80 text-xs">
                  <button
                    onClick={() => setActiveTab('cards')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-sora font-semibold transition-all cursor-pointer ${
                      activeTab === 'cards'
                        ? 'bg-primary text-on-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Spaces</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-sora font-semibold transition-all cursor-pointer ${
                      activeTab === 'map'
                        ? 'bg-primary text-on-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Radar Map</span>
                  </button>
                </div>
              </div>

              {/* Requirement Chips & Quick Intent Triggers */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs text-on-surface-variant font-inter font-medium hidden sm:inline mr-1">
                  Tell Spotly:
                </span>

                {/* Chip: Quiet */}
                <button
                  type="button"
                  onClick={() => toggleChipPreference('quiet')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-sora font-semibold border flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                    userPreferences.quiet
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container hover:bg-surface-container-high border-primary-container text-on-surface'
                  }`}
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Quiet Zone</span>
                </button>

                {/* Chip: Charging */}
                <button
                  type="button"
                  onClick={() => toggleChipPreference('charging')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-sora font-semibold border flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                    userPreferences.charging
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container hover:bg-surface-container-high border-primary-container text-on-surface'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Power Charging</span>
                </button>

                {/* Chip: Gigabit Wi-Fi */}
                <button
                  type="button"
                  onClick={() => toggleChipPreference('wifi')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-sora font-semibold border flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                    userPreferences.wifi
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container hover:bg-surface-container-high border-primary-container text-on-surface'
                  }`}
                >
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Gigabit Wi-Fi</span>
                </button>

                {/* Chip: Low Crowd */}
                <button
                  type="button"
                  onClick={() => toggleChipPreference('lowCrowd')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-sora font-semibold border flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                    userPreferences.low_crowd
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container hover:bg-surface-container-high border-primary-container text-on-surface'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Low Crowd (&lt;40%)</span>
                </button>

                {/* Chip: Near Me */}
                <button
                  type="button"
                  onClick={() => toggleChipPreference('nearMe')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-sora font-semibold border flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                    userPreferences.nearby
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container hover:bg-surface-container-high border-primary-container text-on-surface'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Near Me (&lt;3 min)</span>
                </button>

                {/* Open Full AI Finder */}
                <button
                  type="button"
                  onClick={() => setIsFindModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-sora font-bold bg-tertiary/20 hover:bg-tertiary/30 text-tertiary border border-tertiary/50 flex items-center gap-1 ml-auto transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Custom Match →</span>
                </button>
              </div>
            </section>

            {/* 🏆 DOMINANT RECOMMENDATION CARD (SPOTLY BRAIN RESULT) */}
            {topRecommendation && (
              <RecommendationBanner
                recommendation={topRecommendation}
                onSelect={(loc) => setSelectedLocation(loc)}
                onNotify={handleOpenNotify}
                onBookSeat={handleOpenBookSeat}
                onOpenFinder={() => setIsFindModalOpen(true)}
              />
            )}

            {/* View Switch Content: Interactive Map vs Block-Wise Layout */}
            {activeTab === 'map' ? (
              <CampusMap
                locations={currentCampusLocations}
                selectedCampus={selectedCampus}
                onSelectLocation={(loc) => setSelectedLocation(loc)}
                recommendedLocationId={topRecommendation?.location.id}
              />
            ) : (
              <BlockWiseSpaceView
                locations={filteredLocations}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
                onSelectLocation={(loc) => setSelectedLocation(loc)}
                onNotify={handleOpenNotify}
                onBookSeat={handleOpenBookSeat}
                highlightedId={topRecommendation?.location.id}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation (Home | Explore | Find | Alerts) */}
      {!showLanding && (
        <MobileBottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'cards' || tab === 'map') {
              setActiveTab(tab);
            } else if (tab === 'recommend') {
              setIsFindModalOpen(true);
            } else if (tab === 'alerts') {
              setIsActiveAlertsDrawerOpen(true);
            }
          }}
          activeAlertsCount={alerts.filter((a) => a.is_active).length}
        />
      )}

      {/* Location Details Bottom-Sheet / Modal */}
      <SpaceDetailModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onNotify={handleOpenNotify}
        onBookSeat={handleOpenBookSeat}
        onSubmitReport={submitCrowdReport}
      />

      {/* Seat Booking Modal */}
      <SeatBookingModal
        location={targetBookingLocation}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

      {/* Spotly Auth Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(email) => setCurrentUser(email)}
      />

      {/* Spotly Recommendation Finder Brain */}
      <FindSpaceModal
        isOpen={isFindModalOpen}
        onClose={() => setIsFindModalOpen(false)}
        locations={currentCampusLocations}
        onApplyPreferences={(prefs) => {
          setUserPreferences(prefs);
          if (prefs.category && prefs.category !== 'all') {
            setSelectedCategory(prefs.category);
          }
          setShowLanding(false);
        }}
        onSelectRecommendedLocation={(loc) => {
          setShowLanding(false);
          setSelectedCategory(loc.category);
          setSelectedLocation(loc);
          setIsFindModalOpen(false);
        }}
        userCoordinates={userCoordinates}
      />

      {/* Notify Watch Threshold Modal */}
      <NotifyModal
        location={targetNotifyLocation}
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        onCreateAlert={(locationId, threshold) => {
          createAlert(locationId, threshold);
        }}
      />

      {/* Active Alerts Watch Drawer */}
      <ActiveAlertsDrawer
        isOpen={isActiveAlertsDrawerOpen}
        onClose={() => setIsActiveAlertsDrawerOpen(false)}
        alerts={alerts}
        locations={locations}
        onRemoveAlert={removeAlert}
        onSelectLocation={(loc) => {
          setSelectedLocation(loc);
          setIsActiveAlertsDrawerOpen(false);
        }}
      />

      {/* Real-time Alert Toast Notification */}
      <AlertToast
        data={activeAlertTrigger}
        onDismiss={clearAlertTrigger}
        onGoToSpace={(loc) => {
          setSelectedLocation(loc);
          clearAlertTrigger();
        }}
      />

      {/* Backstage Hackathon Simulator Control Tray */}
      <SimulatorControlTray
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        locations={locations}
        onUpdateOccupancy={updateOccupancy}
        onRunPreset={runPresetScenario}
      />

      {/* Clean Hackathon Footer */}
      <footer className="w-full border-t border-primary-container bg-surface-container-low py-8 px-4 sm:px-8 lg:px-12 mt-12 text-xs text-on-surface-variant font-inter">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary-container border border-primary text-primary flex items-center justify-center font-sora font-black text-xs">
              S
            </div>
            <div>
              <span className="font-sora font-bold text-on-surface">Spotly</span>
              <span className="text-[11px] text-on-surface-variant ml-2 font-inter">
                Don&apos;t wait. Don&apos;t wander. Just know.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-on-surface-variant font-inter">
            <span className="text-primary font-sora font-semibold">
              ✨ Team Spark (Abinivesh • Khwahish • Urmi)
            </span>
            <span>•</span>
            <span>Scaler School of Technology</span>
            <span>•</span>
            <button
              onClick={() => setShowLanding(!showLanding)}
              className="text-tertiary hover:underline font-semibold cursor-pointer"
            >
              {showLanding ? 'Live Spaces' : 'Overview Landing'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  </ErrorBoundary>
  );
}
