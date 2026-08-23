'use client';

import React, { useState } from 'react';
import { UserPreferences, CampusLocation, CampusResourceCategory } from '@/types';
import { rankSpaces } from '@/lib/engine/recommendation';
import {
  X,
  Sparkles,
  VolumeX,
  Volume2,
  Zap,
  Wifi,
  Users,
  Navigation,
  ArrowRight,
  Check,
  BookOpen,
  Utensils,
  Dumbbell,
  Clock,
  Salad,
  Flame,
  Leaf,
  Building,
} from 'lucide-react';
import { UserCoordinates } from '@/lib/utils/geolocation';

interface FindSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: CampusLocation[];
  onApplyPreferences: (prefs: UserPreferences) => void;
  onSelectRecommendedLocation: (loc: CampusLocation) => void;
  userCoordinates?: UserCoordinates | null;
}

export const FindSpaceModal: React.FC<FindSpaceModalProps> = ({
  isOpen,
  onClose,
  locations,
  onApplyPreferences,
  onSelectRecommendedLocation,
  userCoordinates,
}) => {
  const [selectedPurpose, setSelectedPurpose] = useState<CampusResourceCategory>('study');
  const [preferences, setPreferences] = useState<UserPreferences>({
    category: 'study',
    study: true,
    quiet: true,
    charging: true,
    wifi: true,
    low_crowd: true,
    nearby: true,
    max_distance: 5,
    type: 'all',
    food_preference: 'all',
  });

  if (!isOpen) return null;

  // Filter locations by purpose first if chosen
  const filteredForModal = locations.filter(
    (l) => l.category === selectedPurpose
  );

  // Run deterministic ranking in real-time
  const ranked = rankSpaces(
    filteredForModal.length > 0 ? filteredForModal : locations,
    { ...preferences, category: selectedPurpose },
    userCoordinates
  );
  const topMatch = ranked[0];

  const handleApply = () => {
    onApplyPreferences({ ...preferences, category: selectedPurpose });
    onClose();
  };

  const handleGoToLocation = (loc: CampusLocation) => {
    onApplyPreferences({ ...preferences, category: selectedPurpose });
    onSelectRecommendedLocation(loc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-surface-container-lowest/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-surface-container-high border-2 border-primary-container shadow-2xl p-5 sm:p-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer border border-primary-container/40 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-tertiary-container text-on-tertiary-container border border-tertiary">
              <Sparkles className="w-4 h-4 text-tertiary" />
            </span>
            <h2 className="font-sora text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
              Spotly Spatial Finder
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant font-inter">
            Tell Spotly what you need right now. Deterministic weighted scoring in &lt;2ms.
          </p>
        </div>

        {/* Purpose Category Selection */}
        <div className="mb-4">
          <label className="text-xs font-sora font-bold uppercase tracking-wider text-on-surface block mb-2">
            What are you looking for?
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedPurpose('study');
                setPreferences({ ...preferences, category: 'study', food_preference: 'all' });
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedPurpose === 'study'
                  ? 'bg-primary-container text-on-primary-container border-primary font-bold shadow-sm'
                  : 'bg-surface-container border-primary-container/60 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${selectedPurpose === 'study' ? 'text-primary' : 'text-on-surface-variant'}`} />
              <span className="text-xs font-sora">Study Spaces</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPurpose('food');
                setPreferences({ ...preferences, category: 'food' });
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedPurpose === 'food'
                  ? 'bg-tertiary-container text-on-tertiary-container border-tertiary font-bold shadow-sm'
                  : 'bg-surface-container border-primary-container/60 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Utensils className={`w-4 h-4 ${selectedPurpose === 'food' ? 'text-tertiary' : 'text-on-surface-variant'}`} />
              <span className="text-xs font-sora">Food &amp; Mess</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPurpose('sports');
                setPreferences({ ...preferences, category: 'sports', food_preference: 'all' });
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedPurpose === 'sports'
                  ? 'bg-secondary-container text-on-secondary-container border-secondary font-bold shadow-sm'
                  : 'bg-surface-container border-primary-container/60 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Dumbbell className={`w-4 h-4 ${selectedPurpose === 'sports' ? 'text-secondary' : 'text-on-surface-variant'}`} />
              <span className="text-xs font-sora">Sports &amp; Turf</span>
            </button>
          </div>
        </div>

        {/* Form Body - Scrollable */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 no-scrollbar">
          {/* =========================================================================
              FOOD & MESS CRITERIA (Cheftalk, Jain, Uniworld, The Craving Brew)
             ========================================================================= */}
          {selectedPurpose === 'food' ? (
            <div className="space-y-4 animate-in fade-in">
              {/* Mess Provider / Counter Selection */}
              <div>
                <label className="text-xs font-sora font-bold uppercase tracking-wider text-on-surface block mb-2">
                  1. Select Mess Counter / Dining Partner
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                  {/* All Mess Spots */}
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, food_preference: 'all' })}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      preferences.food_preference === 'all'
                        ? 'bg-primary-container border-primary text-on-primary-container shadow-sm'
                        : 'bg-surface-container border-primary-container/60 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-surface-container-high text-primary font-bold">
                      🍽️
                    </div>
                    <div>
                      <div className="text-xs font-bold font-sora">All Mess Spots</div>
                      <div className="text-[10.5px] text-on-surface-variant font-inter">
                        Cheftalk • Jain • Uniworld • TCB
                      </div>
                    </div>
                  </button>

                  {/* Cheftalk Main Mess */}
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, food_preference: 'cheftalk' })}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      preferences.food_preference === 'cheftalk'
                        ? 'bg-primary-container border-primary text-on-primary-container shadow-sm'
                        : 'bg-surface-container border-primary-container/60 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-surface-container-high text-tertiary font-bold">
                      👨‍🍳
                    </div>
                    <div>
                      <div className="text-xs font-bold font-sora">Cheftalk Main Mess</div>
                      <div className="text-[10.5px] text-on-surface-variant font-inter">
                        Daily student breakfast, lunch, dinner
                      </div>
                    </div>
                  </button>

                  {/* Cheftalk Jain Counter */}
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, food_preference: 'jain' })}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      preferences.food_preference === 'jain'
                        ? 'bg-primary-container border-primary text-on-primary-container shadow-sm'
                        : 'bg-surface-container border-primary-container/60 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-surface-container-high text-primary font-bold">
                      🥬
                    </div>
                    <div>
                      <div className="text-xs font-bold font-sora flex items-center gap-1">
                        <span>Cheftalk — Jain</span>
                        <span className="text-[9px] bg-primary/20 text-primary px-1 py-0.2 rounded font-mono">PURE VEG</span>
                      </div>
                      <div className="text-[10.5px] text-on-surface-variant font-inter">
                        Zero onion, garlic &amp; root vegetables
                      </div>
                    </div>
                  </button>

                  {/* Uniworld Dining & Mess */}
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, food_preference: 'uniworld' })}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      preferences.food_preference === 'uniworld'
                        ? 'bg-primary-container border-primary text-on-primary-container shadow-sm'
                        : 'bg-surface-container border-primary-container/60 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-surface-container-high text-primary font-bold">
                      🏢
                    </div>
                    <div>
                      <div className="text-xs font-bold font-sora flex items-center gap-1">
                        <span>Uniworld Dining</span>
                        <span className="text-[9px] bg-tertiary/20 text-tertiary px-1 py-0.2 rounded font-mono">CAMPUS</span>
                      </div>
                      <div className="text-[10.5px] text-on-surface-variant font-inter">
                        Multi-cuisine thalis &amp; live counters
                      </div>
                    </div>
                  </button>

                  {/* The Craving Brew */}
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, food_preference: 'craving_brew' })}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer col-span-2 ${
                      preferences.food_preference === 'craving_brew'
                        ? 'bg-primary-container border-primary text-on-primary-container shadow-sm'
                        : 'bg-surface-container border-primary-container/60 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-surface-container-high text-secondary font-bold">
                      🍱
                    </div>
                    <div>
                      <div className="text-xs font-bold font-sora">The Craving Brew (Alternate Provider)</div>
                      <div className="text-[10.5px] text-on-surface-variant font-inter">
                        Curated combo platters, executive thalis &amp; hot snacks
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Speed & Crowd Toggles */}
              <div>
                <label className="text-xs font-sora font-bold uppercase tracking-wider text-on-surface block mb-2">
                  2. Speed &amp; Crowd Preferences
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPreferences({ ...preferences, low_crowd: !preferences.low_crowd })
                    }
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      preferences.low_crowd
                        ? 'bg-primary-container/60 border-primary text-on-surface'
                        : 'bg-surface-container border-primary-container/60 text-on-surface-variant'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold font-inter">Short Wait Line</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        preferences.low_crowd
                          ? 'bg-primary border-primary text-on-primary'
                          : 'border-outline-variant'
                      }`}
                    >
                      {preferences.low_crowd && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>

                  <div className="p-3 rounded-xl bg-surface-container border border-primary-container/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-on-surface-variant font-inter">Max Walk:</span>
                    </div>
                    <select
                      value={preferences.max_distance || 5}
                      onChange={(e) =>
                        setPreferences({ ...preferences, max_distance: Number(e.target.value) })
                      }
                      aria-label="Maximum Walking Distance"
                      className="bg-surface-container-high border border-primary-container rounded-lg px-2 py-1 text-xs text-on-surface focus:outline-none cursor-pointer"
                    >
                      <option value={3}>&lt; 3 mins</option>
                      <option value={5}>&lt; 5 mins</option>
                      <option value={10}>Any</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================================
                STUDY & GENERAL CRITERIA
               ========================================================================= */
            <div className="space-y-4">
              {/* Section 1: Study Vibe / Sound Environment */}
              <div>
                <label className="text-xs font-sora font-bold uppercase tracking-wider text-on-surface block mb-2">
                  1. Acoustic Environment
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, quiet: true })}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      preferences.quiet
                        ? 'bg-primary-container border-primary text-on-primary-container shadow-sm'
                        : 'bg-surface-container border-primary-container/60 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-surface-container-high text-primary">
                      <VolumeX className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-sora">Silent / Quiet Study</div>
                      <div className="text-[10.5px] text-on-surface-variant font-inter">
                        Reading rooms &amp; private carrels
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, quiet: false })}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      !preferences.quiet
                        ? 'bg-primary-container border-primary text-on-primary-container shadow-sm'
                        : 'bg-surface-container border-primary-container/60 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-surface-container-high text-tertiary">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-sora">Collaborative / Lively</div>
                      <div className="text-[10.5px] text-on-surface-variant font-inter">
                        Group pods &amp; coding labs
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Section 2: Essential Amenities */}
              <div>
                <label className="text-xs font-sora font-bold uppercase tracking-wider text-on-surface block mb-2">
                  2. Power &amp; Connectivity
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setPreferences({ ...preferences, charging: !preferences.charging })
                    }
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      preferences.charging
                        ? 'bg-primary-container/60 border-primary text-on-surface'
                        : 'bg-surface-container border-primary-container/60 text-on-surface-variant'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold font-inter">Charging Outlets</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        preferences.charging
                          ? 'bg-primary border-primary text-on-primary'
                          : 'border-outline-variant'
                      }`}
                    >
                      {preferences.charging && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPreferences({ ...preferences, wifi: !preferences.wifi })
                    }
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      preferences.wifi
                        ? 'bg-primary-container/60 border-primary text-on-surface'
                        : 'bg-surface-container border-primary-container/60 text-on-surface-variant'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold font-inter">Gigabit Wi-Fi</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        preferences.wifi
                          ? 'bg-primary border-primary text-on-primary'
                          : 'border-outline-variant'
                      }`}
                    >
                      {preferences.wifi && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              ALL RANKED RESULTS CARDS (Shows Uniworld, Cheftalk, Jain, etc.)
             ========================================================================= */}
          <div className="pt-2">
            <label className="text-xs font-sora font-bold uppercase tracking-wider text-on-surface block mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-tertiary" />
                Live Ranked Matches ({ranked.length})
              </span>
              <span className="text-[11px] font-mono text-primary font-bold">
                Deterministic Score
              </span>
            </label>

            <div className="space-y-2.5">
              {ranked.map((result, index) => {
                const loc = result.location;
                const isFirst = index === 0;

                return (
                  <div
                    key={loc.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isFirst
                        ? 'bg-surface-container border-tertiary shadow-md shadow-tertiary/10'
                        : 'bg-surface-container/60 border-primary-container/60 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {isFirst && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-tertiary text-on-tertiary font-sora uppercase">
                            #1 Top Match
                          </span>
                        )}
                        <span className="font-sora text-sm font-bold text-on-surface">
                          {loc.name}
                        </span>
                        <span className="text-xs font-bold text-primary font-mono ml-auto sm:ml-0">
                          {result.matchScore}% Match
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-inter">
                        <span>{loc.floor} • {loc.building}</span>
                        <span>•</span>
                        <span>🚶 {loc.distance_minutes} min walk</span>
                        {loc.wait_time_minutes && (
                          <>
                            <span>•</span>
                            <span className="text-primary font-semibold">
                              ⏱️ ~{loc.wait_time_minutes}m token wait
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span className="text-on-surface font-semibold">
                          {Math.max(0, loc.capacity - loc.current_occupancy)} free seats
                        </span>
                      </div>

                      {/* Reason Badges */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {result.reasons.slice(0, 2).map((r, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface border border-primary-container/50 font-inter"
                          >
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGoToLocation(loc)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-sora font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0 ${
                        isFirst
                          ? 'bg-tertiary hover:bg-tertiary-fixed text-on-tertiary shadow-sm'
                          : 'bg-surface-container-high hover:bg-surface-bright text-on-surface border border-primary-container'
                      }`}
                    >
                      <span>Select Spot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-4 pt-3.5 border-t border-surface-variant flex items-center gap-3">
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface text-xs font-sora font-semibold transition-colors cursor-pointer border border-primary-container/70"
          >
            Apply Filters to Feed
          </button>

          {topMatch && (
            <button
              onClick={() => handleGoToLocation(topMatch.location)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Take Me to #1 Spot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
