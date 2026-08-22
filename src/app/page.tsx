'use client';

import React, { useState, useMemo } from 'react';
import { useCampusStore } from '@/lib/store/useCampusStore';
import { rankSpaces } from '@/lib/engine/recommendation';
import { CampusLocation, SpaceType } from '@/types';
import { Header } from '@/components/layout/Header';
import { LandingPageSection } from '@/components/landing/LandingPageSection';
import { LocationPermissionBanner } from '@/components/layout/LocationPermissionBanner';
import { SpaceFilters } from '@/components/spaces/SpaceFilters';
import { SpaceGrid } from '@/components/spaces/SpaceGrid';
import { SpaceDetailModal } from '@/components/spaces/SpaceDetailModal';
import { CampusMap } from '@/components/map/CampusMap';
import { FindSpaceModal } from '@/components/recommendation/FindSpaceModal';
import { RecommendationBanner } from '@/components/recommendation/RecommendationBanner';
import { NotifyModal } from '@/components/alerts/NotifyModal';
import { ActiveAlertsDrawer } from '@/components/alerts/ActiveAlertsDrawer';
import { AlertToast } from '@/components/alerts/AlertToast';
import { SimulatorControlTray } from '@/components/simulator/SimulatorControlTray';
import { Shield, Cpu, Sparkles } from 'lucide-react';

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

  const [showLanding, setShowLanding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [spaciousOnly, setSpaciousOnly] = useState(false);
  const [isActiveAlertsDrawerOpen, setIsActiveAlertsDrawerOpen] = useState(false);
  const [targetNotifyLocation, setTargetNotifyLocation] = useState<CampusLocation | null>(null);

  // Available floors in the active campus
  const availableFloors = useMemo(() => {
    return Array.from(new Set(currentCampusLocations.map((l) => l.floor)));
  }, [currentCampusLocations]);

  // Compute top recommendation within active campus using live coordinates & category
  const rankedSpaces = useMemo(() => {
    return rankSpaces(currentCampusLocations, userPreferences, userCoordinates);
  }, [currentCampusLocations, userPreferences, userCoordinates]);

  const topRecommendation = rankedSpaces.length > 0 ? rankedSpaces[0] : null;

  // Filter locations for the grid / map
  const filteredLocations = useMemo(() => {
    return currentCampusLocations.filter((loc) => {
      // Search
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Header */}
      <Header
        onOpenActiveAlerts={() => setIsActiveAlertsDrawerOpen(true)}
        showLanding={showLanding}
        onToggleLanding={() => setShowLanding(!showLanding)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {showLanding ? (
          <LandingPageSection
            onEnterApp={() => setShowLanding(false)}
            campusOccupancyPercentage={campusOccupancyPercentage}
            totalAvailableSeats={totalAvailableSeats}
          />
        ) : (
          <>
            {/* Geolocation Permission Banner */}
            <LocationPermissionBanner />

            {/* Hero Recommendation Banner */}
            <RecommendationBanner
              recommendation={topRecommendation}
              onSelect={(loc) => setSelectedLocation(loc)}
              onNotify={handleOpenNotify}
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
                highlightedId={topRecommendation?.location.id}
                onResetFilters={handleResetFilters}
                userCoordinates={userCoordinates}
              />
            ) : (
              <CampusMap
                locations={currentCampusLocations}
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
        onSelectRecommendedLocation={(loc) => setSelectedLocation(loc)}
        userCoordinates={userCoordinates}
      />

      {/* 2. Space Detail Modal with 1-Tap Crowd Reports */}
      <SpaceDetailModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onNotify={handleOpenNotify}
        onSubmitReport={submitCrowdReport}
      />

      {/* 3. Watch This Space Threshold Modal */}
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

      {/* 4. My Watches Drawer */}
      <ActiveAlertsDrawer
        isOpen={isActiveAlertsDrawerOpen}
        onClose={() => setIsActiveAlertsDrawerOpen(false)}
        alerts={alerts}
        locations={locations}
        onRemoveAlert={removeAlert}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
      />

      {/* 5. Triggered Alert Hero Toast (confetti + audio chime) */}
      <AlertToast
        data={activeAlertTrigger}
        onDismiss={clearAlertTrigger}
        onGoToSpace={(loc) => setSelectedLocation(loc)}
      />

      {/* 6. Admin / Demo Simulator Control Tray */}
      <SimulatorControlTray
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        locations={locations}
        onUpdateOccupancy={updateOccupancy}
        onRunPreset={runPresetScenario}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-8 px-4 sm:px-6 lg:px-8 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm">
              S
            </div>
            <div>
              <span className="font-bold text-slate-200">Spotly</span> — Realtime Campus Decision Engine
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              Zero-PII Privacy Guaranteed
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Cpu className="w-3.5 h-3.5" />
              Deterministic Scoring (&lt;2ms)
            </span>
            <span>•</span>
            <span className="text-slate-400">
              Built for 13h Hackathon • Scaler School of Technology
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
