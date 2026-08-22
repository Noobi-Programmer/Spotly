'use client';

import React, { useState, useMemo } from 'react';
import { useCampusStore } from '@/lib/store/useCampusStore';
import { rankSpaces } from '@/lib/engine/recommendation';
import { CampusLocation } from '@/types';
import { SST_FLOOR_ORDER } from '@/lib/supabase/seed-data';
import { Header } from '@/components/layout/Header';
import { LandingPageSection } from '@/components/landing/LandingPageSection';
import { LocationPermissionBanner } from '@/components/layout/LocationPermissionBanner';
import { SpaceFilters } from '@/components/spaces/SpaceFilters';
import { SpaceGrid } from '@/components/spaces/SpaceGrid';
import { SpaceDetailModal } from '@/components/spaces/SpaceDetailModal';
import { SeatBookingModal } from '@/components/booking/SeatBookingModal';
import { CampusMap } from '@/components/map/CampusMap';
import { FindSpaceModal } from '@/components/recommendation/FindSpaceModal';
import { RecommendationBanner } from '@/components/recommendation/RecommendationBanner';
import { NotifyModal } from '@/components/alerts/NotifyModal';
import { ActiveAlertsDrawer } from '@/components/alerts/ActiveAlertsDrawer';
import { AlertToast } from '@/components/alerts/AlertToast';
import { SimulatorControlTray } from '@/components/simulator/SimulatorControlTray';
import { Shield, Cpu, ArrowLeft } from 'lucide-react';

export default function CampusSpaceApp() {
  const {
    locations,
    currentCampusLocations,
    selectedCampus,
    setSelectedCampus,
    selectedCategory,
    setSelectedCategory,
    selectedFloor,
    setSelectedFloor,
    userCoordinates,
    locationPermissionState,
    isRequestingLocation,
    requestLocation,
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

  // DEFAULT TO LANDING PAGE
  const [showLanding, setShowLanding] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [spaciousOnly, setSpaciousOnly] = useState(false);
  const [isActiveAlertsDrawerOpen, setIsActiveAlertsDrawerOpen] = useState(false);
  const [targetNotifyLocation, setTargetNotifyLocation] = useState<CampusLocation | null>(null);
  const [targetBookingLocation, setTargetBookingLocation] = useState<CampusLocation | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Available floors in strict order: Upper Basement -> Ground Floor -> Floor 1 -> Floor 2
  const availableFloors = useMemo(() => {
    const floorSet = Array.from(new Set(currentCampusLocations.map((l) => l.floor)));
    return floorSet.sort((a, b) => {
      const idxA = SST_FLOOR_ORDER.indexOf(a);
      const idxB = SST_FLOOR_ORDER.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return a.localeCompare(b);
    });
  }, [currentCampusLocations]);

  // Compute top recommendation within active campus using live coordinates & category
  const rankedSpaces = useMemo(() => {
    const pool =
      selectedCategory !== 'all'
        ? currentCampusLocations.filter((l) => l.category === selectedCategory)
        : currentCampusLocations;
    return rankSpaces(pool.length > 0 ? pool : currentCampusLocations, userPreferences, userCoordinates);
  }, [currentCampusLocations, selectedCategory, userPreferences, userCoordinates]);

  const topRecommendation = rankedSpaces.length > 0 ? rankedSpaces[0] : null;

  // Filter locations for the grid / map
  const filteredLocations = useMemo(() => {
    return currentCampusLocations.filter((loc) => {
      // Category Filter (Study / Food / Sports)
      if (selectedCategory !== 'all' && loc.category !== selectedCategory) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          loc.name.toLowerCase().includes(q) ||
          loc.building.toLowerCase().includes(q) ||
          loc.description.toLowerCase().includes(q) ||
          loc.floor.toLowerCase().includes(q) ||
          loc.type.toLowerCase().includes(q) ||
          loc.category.toLowerCase().includes(q) ||
          (loc.mess_provider && loc.mess_provider.toLowerCase().includes(q)) ||
          (loc.meal_type && loc.meal_type.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Floor Filter
      if (selectedFloor !== 'all' && loc.floor !== selectedFloor) {
        return false;
      }

      // Space Type
      if (filterType !== 'all' && loc.type !== filterType) {
        return false;
      }

      // Quiet
      if (filterQuietOnly && !loc.is_quiet) {
        return false;
      }

      // Charging
      if (filterChargingOnly && !loc.has_charging) {
        return false;
      }

      // Spacious (<50%)
      if (spaciousOnly) {
        const pct = Math.round((loc.current_occupancy / Math.max(1, loc.capacity)) * 100);
        if (pct >= 50) return false;
      }

      return true;
    });
  }, [
    currentCampusLocations,
    selectedCategory,
    searchQuery,
    selectedFloor,
    filterType,
    filterQuietOnly,
    filterChargingOnly,
    spaciousOnly,
  ]);

  const handleOpenNotify = (loc: CampusLocation) => {
    setTargetNotifyLocation(loc);
    setIsNotifyModalOpen(true);
  };

  const handleOpenBookSeat = (loc: CampusLocation) => {
    setTargetBookingLocation(loc);
    setIsBookingModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFloor('all');
    setFilterType('all');
    setFilterQuietOnly(false);
    setFilterChargingOnly(false);
    setSpaciousOnly(false);
    setUserPreferences({
      category: 'all',
      study: true,
      quiet: false,
      charging: false,
      wifi: false,
      low_crowd: false,
      nearby: false,
      type: 'all',
      floor: 'all',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-tertiary selection:text-on-tertiary">
      {/* Top Navigation Bar */}
      <Header
        onOpenActiveAlerts={() => setIsActiveAlertsDrawerOpen(true)}
        showLanding={showLanding}
        onToggleLanding={() => setShowLanding(!showLanding)}
        onSelectCategoryNav={(cat) => setSearchQuery('')}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        alerts={alerts}
        onOpenFinder={() => setIsFindModalOpen(true)}
        isSimulatorOpen={isSimulatorOpen}
        onToggleSimulator={() => setIsSimulatorOpen(!isSimulatorOpen)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
        {showLanding ? (
          <LandingPageSection
            onEnterApp={() => setShowLanding(false)}
            campusOccupancyPercentage={campusOccupancyPercentage}
            totalAvailableSeats={totalAvailableSeats}
          />
        ) : (
          <>
            {/* Back to Overview Banner */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-surface-variant">
              <button
                onClick={() => setShowLanding(true)}
                className="flex items-center gap-1.5 text-xs font-sora font-semibold text-primary hover:text-tertiary transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Overview Landing</span>
              </button>
              <div className="text-xs text-on-surface-variant font-inter">
                {selectedCategory === 'all'
                  ? `All Campus Resources (${filteredLocations.length})`
                  : selectedCategory === 'study'
                  ? `📚 Study & Focus Spaces (${filteredLocations.length})`
                  : selectedCategory === 'food'
                  ? `🍴 Cafeteria & Mess Queues (${filteredLocations.length})`
                  : `🏀 Sports & Recreation (${filteredLocations.length})`}
              </div>
            </div>

            {/* Geolocation Permission Banner */}
            <LocationPermissionBanner
              userCoordinates={userCoordinates}
              locationPermissionState={locationPermissionState}
              isRequestingLocation={isRequestingLocation}
              onRequestLocation={requestLocation}
            />

            {/* Hero Recommendation Banner */}
            <RecommendationBanner
              recommendation={topRecommendation}
              onSelect={(loc) => setSelectedLocation(loc)}
              onNotify={handleOpenNotify}
              onBookSeat={handleOpenBookSeat}
              onOpenFinder={() => setIsFindModalOpen(true)}
            />

            {/* Filters and View Switcher */}
            <SpaceFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedType={filterType}
              onTypeChange={setFilterType}
              selectedFloor={selectedFloor}
              onFloorChange={setSelectedFloor}
              quietOnly={filterQuietOnly}
              onQuietToggle={setFilterQuietOnly}
              chargingOnly={filterChargingOnly}
              onChargingToggle={setFilterChargingOnly}
              spaciousOnly={spaciousOnly}
              onSpaciousToggle={setSpaciousOnly}
              activeView={activeTab}
              onViewChange={setActiveTab}
              availableFloors={availableFloors}
            />

            {/* Content View: Cards vs Map */}
            {activeTab === 'cards' ? (
              <SpaceGrid
                locations={filteredLocations}
                onSelect={(loc) => setSelectedLocation(loc)}
                onNotify={handleOpenNotify}
                onBookSeat={handleOpenBookSeat}
                highlightedId={topRecommendation?.location.id}
                onResetFilters={handleResetFilters}
                userCoordinates={userCoordinates}
              />
            ) : (
              <CampusMap
                locations={filteredLocations.length > 0 ? filteredLocations : currentCampusLocations}
                selectedCampus={selectedCampus}
                onSelectLocation={(loc) => setSelectedLocation(loc)}
                recommendedLocationId={topRecommendation?.location.id}
              />
            )}
          </>
        )}
      </main>

      {/* Modals and Drawers */}
      {/* 1. Find My Space Modal */}
      <FindSpaceModal
        isOpen={isFindModalOpen}
        onClose={() => setIsFindModalOpen(false)}
        locations={currentCampusLocations}
        onApplyPreferences={(prefs) => setUserPreferences(prefs)}
        onSelectRecommendedLocation={(loc) => {
          setSelectedLocation(loc);
          setShowLanding(false);
        }}
        userCoordinates={userCoordinates}
      />

      {/* 2. Space Detail Modal with 1-Tap Crowd Reports & Seat Booking */}
      <SpaceDetailModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onNotify={handleOpenNotify}
        onBookSeat={handleOpenBookSeat}
        onSubmitReport={submitCrowdReport}
      />

      {/* 3. BookMyShow Interactive Seat Booking Modal */}
      <SeatBookingModal
        location={targetBookingLocation}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setTargetBookingLocation(null);
        }}
      />

      {/* 4. Watch This Space Threshold Modal */}
      <NotifyModal
        location={targetNotifyLocation}
        isOpen={isNotifyModalOpen}
        onClose={() => {
          setIsNotifyModalOpen(false);
          setTargetNotifyLocation(null);
        }}
        onCreateAlert={(locationId, threshold) => {
          createAlert(locationId, threshold);
        }}
      />

      {/* 5. My Watches Drawer */}
      <ActiveAlertsDrawer
        isOpen={isActiveAlertsDrawerOpen}
        onClose={() => setIsActiveAlertsDrawerOpen(false)}
        alerts={alerts}
        locations={locations}
        onRemoveAlert={removeAlert}
        onSelectLocation={(loc) => {
          setSelectedLocation(loc);
          setShowLanding(false);
        }}
      />

      {/* 6. Triggered Alert Hero Toast (confetti + audio chime) */}
      <AlertToast
        data={activeAlertTrigger}
        onDismiss={clearAlertTrigger}
        onGoToSpace={(loc) => {
          setSelectedLocation(loc);
          setShowLanding(false);
        }}
      />

      {/* 7. Admin / Demo Simulator Control Tray */}
      <SimulatorControlTray
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        locations={locations}
        onUpdateOccupancy={updateOccupancy}
        onRunPreset={runPresetScenario}
      />

      {/* Footer */}
      <footer className="w-full border-t border-primary-container bg-surface-container-low py-10 px-4 sm:px-8 lg:px-12 mt-16 text-xs text-on-surface-variant font-inter">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-container border border-primary text-primary flex items-center justify-center font-sora font-black text-sm shadow-md">
              S
            </div>
            <div>
              <span className="font-sora font-bold text-on-surface text-sm">Spotly</span>
              <p className="text-[11px] text-on-surface-variant">Don&apos;t wait. Don&apos;t wander. Just know.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-on-surface-variant">
            <span className="flex items-center gap-1.5 text-primary">
              <Shield className="w-3.5 h-3.5" />
              Privacy-First Architecture
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-tertiary">
              <Cpu className="w-3.5 h-3.5" />
              &lt;2ms Real-Time Matching
            </span>
            <span>•</span>
            <span>Scaler School of Technology • Gradient Rush</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
