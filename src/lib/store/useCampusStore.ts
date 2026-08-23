'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CampusLocation,
  SpaceWatch,
  UserPreferences,
  SpaceType,
  CampusId,
  CampusResourceCategory,
  CrowdTrend,
  SeatBooking,
} from '@/types';
import { INITIAL_CAMPUS_LOCATIONS } from '@/lib/supabase/seed-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getOrCreateSessionId } from '@/lib/utils/session';
import { playAlertChime } from '@/lib/engine/sound';
import {
  UserCoordinates,
  GeolocationPermissionState,
  requestSessionLocation,
} from '@/lib/utils/geolocation';

// BroadcastChannel for instant multi-tab sync across browser windows
const BROADCAST_CHANNEL_NAME = 'spotly_realtime_channel';

// In-memory global store to share state across components in the same tab
let globalLocations: CampusLocation[] = [...INITIAL_CAMPUS_LOCATIONS];
let globalAlerts: SpaceWatch[] = [];
let globalTickets: SeatBooking[] = [];
let globalActiveTicket: SeatBooking | null = null;
let globalSelectedCampus: CampusId = 'sst_bangalore';
let globalSelectedCategory: CampusResourceCategory | 'all' = 'all';
let globalSelectedFloor: string = 'all';
let globalSelectedLocation: CampusLocation | null = null;
let globalIsFindModalOpen = false;
let globalIsNotifyModalOpen = false;
let globalIsSimulatorOpen = false;
let globalIsTicketModalOpen = false;
let globalActiveTab: 'cards' | 'map' = 'cards';
let globalFilterType: SpaceType | 'all' = 'all';
let globalFilterQuietOnly = false;
let globalFilterChargingOnly = false;
let globalUserPreferences: UserPreferences = {
  category: 'all',
  study: true,
  quiet: false,
  charging: false,
  wifi: false,
  low_crowd: false,
  nearby: false,
  type: 'all',
  floor: 'all',
};
let globalListeners: Set<() => void> = new Set();
let broadcastChannel: BroadcastChannel | null = null;

if (typeof window !== 'undefined') {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not supported in this environment', e);
  }
}

function notifyGlobalListeners() {
  globalListeners.forEach((listener) => listener());
}

export function useCampusStore() {
  const [, setTick] = useState(0);
  const [activeAlertTrigger, setActiveAlertTrigger] = useState<{
    alert: SpaceWatch;
    location: CampusLocation;
    occupancyPct: number;
  } | null>(null);

  // User Geolocation State
  const [userCoordinates, setUserCoordinates] = useState<UserCoordinates | null>(null);
  const [locationPermissionState, setLocationPermissionState] =
    useState<GeolocationPermissionState>('prompt');
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  // Re-render when global store changes
  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1);
    globalListeners.add(handleUpdate);
    return () => {
      globalListeners.delete(handleUpdate);
    };
  }, []);

  // Request browser geolocation (One-shot, safe session level)
  const requestLocation = useCallback(async () => {
    setIsRequestingLocation(true);
    const result = await requestSessionLocation();
    setUserCoordinates(result.coordinates);
    setLocationPermissionState(result.state);
    setIsRequestingLocation(false);
  }, []);

  // Check and fire alerts when occupancy changes
  const evaluateAlertsLocally = useCallback((updatedLoc: CampusLocation) => {
    const occPct = Math.round(
      (updatedLoc.current_occupancy / Math.max(1, updatedLoc.capacity)) * 100
    );
    const sessionId = getOrCreateSessionId();

    globalAlerts = globalAlerts.map((alert) => {
      if (
        alert.location_id === updatedLoc.id &&
        alert.is_active &&
        occPct <= alert.threshold_percentage
      ) {
        // Trigger alert!
        const triggeredAlert: SpaceWatch = {
          ...alert,
          is_active: false,
          triggered_at: new Date().toISOString(),
        };

        if (alert.user_session_id === sessionId) {
          // Play synthesized Web Audio chime
          playAlertChime();

          // Dispatch native browser notification if granted
          if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
              try {
                new Notification(`Spotly: ${updatedLoc.name} is ready!`, {
                  body: `Occupancy dropped to ${occPct}%, which is below your ${alert.threshold_percentage}% threshold.`,
                  icon: '/favicon.ico',
                });
              } catch (e) {
                // notification fallback
              }
            }
          }

          // Show in-app hero toast
          setActiveAlertTrigger({
            alert: triggeredAlert,
            location: updatedLoc,
            occupancyPct: occPct,
          });
        }
        return triggeredAlert;
      }
      return alert;
    });
    notifyGlobalListeners();
  }, []);

  // Broadcast channel message listener (for multi-tab sync)
  useEffect(() => {
    if (!broadcastChannel) return;

    const handleBroadcast = (event: MessageEvent) => {
      const { type, payload } = event.data || {};
      if (type === 'OCCUPANCY_UPDATE') {
        const { locationId, newOccupancy, trend } = payload;
        const target = globalLocations.find((l) => l.id === locationId);
        if (target) {
          target.current_occupancy = newOccupancy;
          if (trend) target.trend = trend;
          evaluateAlertsLocally(target);
          notifyGlobalListeners();
        }
      } else if (type === 'CROWD_REPORT') {
        const { locationId, newOccupancy, trend, reportCount } = payload;
        const target = globalLocations.find((l) => l.id === locationId);
        if (target) {
          target.current_occupancy = newOccupancy;
          target.trend = trend;
          target.report_count = reportCount;
          target.last_reported_minutes_ago = 0;
          target.confidence = 'high';
          evaluateAlertsLocally(target);
          notifyGlobalListeners();
        }
      } else if (type === 'NEW_ALERT') {
        if (!globalAlerts.some((a) => a.id === payload.id)) {
          globalAlerts = [payload, ...globalAlerts];
          notifyGlobalListeners();
        }
      } else if (type === 'RESET_ALL') {
        globalLocations = [...INITIAL_CAMPUS_LOCATIONS];
        notifyGlobalListeners();
      }
    };

    broadcastChannel.addEventListener('message', handleBroadcast);
    return () => {
      broadcastChannel?.removeEventListener('message', handleBroadcast);
    };
  }, [evaluateAlertsLocally]);

  // Update occupancy action
  const updateOccupancy = useCallback(
    async (locationId: string, newOccupancy: number) => {
      const loc = globalLocations.find((l) => l.id === locationId);
      if (!loc) return;

      const clampedOccupancy = Math.max(
        0,
        Math.min(loc.capacity, Math.round(newOccupancy))
      );
      
      const prevOcc = loc.current_occupancy;
      loc.current_occupancy = clampedOccupancy;

      // Calculate dynamic trend
      let calculatedTrend: CrowdTrend = 'steady';
      if (clampedOccupancy > prevOcc + 1) calculatedTrend = 'getting_busier';
      else if (clampedOccupancy < prevOcc - 1) calculatedTrend = 'clearing_up';
      loc.trend = calculatedTrend;

      evaluateAlertsLocally(loc);
      notifyGlobalListeners();

      // Broadcast to other browser tabs
      broadcastChannel?.postMessage({
        type: 'OCCUPANCY_UPDATE',
        payload: { locationId, newOccupancy: clampedOccupancy, trend: calculatedTrend },
      });

      // Update Supabase if connected
      if (isSupabaseConfigured() && supabase) {
        try {
          await supabase
            .from('locations')
            .update({ current_occupancy: clampedOccupancy })
            .eq('id', locationId);
        } catch (e) {
          console.warn('Failed to update Supabase:', e);
        }
      }
    },
    [evaluateAlertsLocally]
  );

  // Submit Student Crowd Report (1-Tap community validation)
  const submitCrowdReport = useCallback(
    async (locationId: string, level: 'empty' | 'moderate' | 'full') => {
      const loc = globalLocations.find((l) => l.id === locationId);
      if (!loc) return;

      let targetCount = loc.current_occupancy;
      let targetTrend: CrowdTrend = 'steady';

      if (level === 'empty') {
        targetCount = Math.max(0, Math.round(loc.capacity * 0.2));
        targetTrend = 'clearing_up';
      } else if (level === 'moderate') {
        targetCount = Math.round(loc.capacity * 0.5);
        targetTrend = 'steady';
      } else if (level === 'full') {
        targetCount = Math.min(loc.capacity, Math.round(loc.capacity * 0.85));
        targetTrend = 'getting_busier';
      }

      loc.current_occupancy = targetCount;
      loc.trend = targetTrend;
      loc.report_count = (loc.report_count || 5) + 1;
      loc.last_reported_minutes_ago = 0;
      loc.confidence = 'high';

      evaluateAlertsLocally(loc);
      notifyGlobalListeners();

      // Broadcast across tabs
      broadcastChannel?.postMessage({
        type: 'CROWD_REPORT',
        payload: {
          locationId,
          newOccupancy: targetCount,
          trend: targetTrend,
          reportCount: loc.report_count,
        },
      });
    },
    [evaluateAlertsLocally]
  );

  // Create Watch / Alert Action
  const createAlert = useCallback(
    async (locationId: string, thresholdPercentage: number) => {
      // Also request notification permission in background if not asked yet
      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'default'
      ) {
        Notification.requestPermission().catch(() => {});
      }

      const sessionId = getOrCreateSessionId();
      const loc = globalLocations.find((l) => l.id === locationId);
      const newWatch: SpaceWatch = {
        id: 'watch_' + Math.random().toString(36).substring(2, 9),
        user_session_id: sessionId,
        location_id: locationId,
        location_name: loc?.name || 'SST Space',
        location_floor: loc?.floor,
        location_building: loc?.building,
        threshold_percentage: thresholdPercentage,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      globalAlerts = [newWatch, ...globalAlerts];
      notifyGlobalListeners();

      broadcastChannel?.postMessage({
        type: 'NEW_ALERT',
        payload: newWatch,
      });

      if (isSupabaseConfigured() && supabase) {
        try {
          await supabase.from('alerts').insert([
            {
              id: newWatch.id,
              user_session_id: sessionId,
              location_id: locationId,
              threshold_percentage: thresholdPercentage,
              is_active: true,
            },
          ]);
        } catch (e) {
          console.warn('Failed to save alert to Supabase:', e);
        }
      }

      // If current occupancy is ALREADY below threshold, trigger immediately
      if (loc) {
        const currentPct = Math.round((loc.current_occupancy / loc.capacity) * 100);
        if (currentPct <= thresholdPercentage) {
          evaluateAlertsLocally(loc);
        }
      }
    },
    [evaluateAlertsLocally]
  );

  // Remove watch
  const removeAlert = useCallback((alertId: string) => {
    globalAlerts = globalAlerts.filter((a) => a.id !== alertId);
    notifyGlobalListeners();
  }, []);

  // Demo Scenario Presets
  const runPresetScenario = useCallback(
    (scenario: 'hero_alert' | 'rush_hour' | 'quiet_night' | 'reset') => {
      if (scenario === 'hero_alert') {
        // Drop Coding Pod B (SST-POD-B) from 20 (83%) to 11 (46%) -> triggers <= 50% alert!
        const podB = globalLocations.find((l) => l.code === 'SST-POD-B');
        if (podB) {
          updateOccupancy(podB.id, 11);
        }
      } else if (scenario === 'rush_hour') {
        // High occupancy across SST campus
        globalLocations.forEach((loc) => {
          updateOccupancy(loc.id, Math.round(loc.capacity * 0.88));
        });
      } else if (scenario === 'quiet_night') {
        // Low occupancy across campus
        globalLocations.forEach((loc) => {
          updateOccupancy(loc.id, Math.round(loc.capacity * 0.22));
        });
      } else if (scenario === 'reset') {
        INITIAL_CAMPUS_LOCATIONS.forEach((initial) => {
          updateOccupancy(initial.id, initial.current_occupancy);
        });
      }
    },
    [updateOccupancy]
  );

  // Filtered by active campus & optional category
  const currentCampusLocations = globalLocations.filter(
    (l) =>
      l.campus_id === globalSelectedCampus &&
      (globalSelectedCategory === 'all' || l.category === globalSelectedCategory)
  );

  const totalCapacity = currentCampusLocations.reduce((acc, l) => acc + l.capacity, 0);
  const totalOccupancy = currentCampusLocations.reduce(
    (acc, l) => acc + l.current_occupancy,
    0
  );
  const campusOccupancyPercentage = Math.round(
    (totalOccupancy / Math.max(1, totalCapacity)) * 100
  );

  const activeUserAlerts = globalAlerts.filter(
    (a) => a.user_session_id === getOrCreateSessionId()
  );

  return {
    locations: globalLocations,
    currentCampusLocations,
    selectedCampus: globalSelectedCampus,
    setSelectedCampus: (c: CampusId) => {
      globalSelectedCampus = c;
      notifyGlobalListeners();
    },
    selectedCategory: globalSelectedCategory,
    setSelectedCategory: (cat: CampusResourceCategory | 'all') => {
      globalSelectedCategory = cat;
      notifyGlobalListeners();
    },
    selectedFloor: globalSelectedFloor,
    setSelectedFloor: (f: string) => {
      globalSelectedFloor = f;
      notifyGlobalListeners();
    },
    userCoordinates,
    locationPermissionState,
    isRequestingLocation,
    requestLocation,
    alerts: activeUserAlerts,
    allAlerts: globalAlerts,
    activeAlertTrigger,
    clearAlertTrigger: () => setActiveAlertTrigger(null),
    campusOccupancyPercentage,
    totalAvailableSeats: Math.max(0, totalCapacity - totalOccupancy),
    selectedLocation: globalSelectedLocation,
    setSelectedLocation: (loc: CampusLocation | null) => {
      globalSelectedLocation = loc;
      notifyGlobalListeners();
    },
    isFindModalOpen: globalIsFindModalOpen,
    setIsFindModalOpen: (open: boolean) => {
      globalIsFindModalOpen = open;
      notifyGlobalListeners();
    },
    isNotifyModalOpen: globalIsNotifyModalOpen,
    setIsNotifyModalOpen: (open: boolean) => {
      globalIsNotifyModalOpen = open;
      notifyGlobalListeners();
    },
    isSimulatorOpen: globalIsSimulatorOpen,
    setIsSimulatorOpen: (open: boolean) => {
      globalIsSimulatorOpen = open;
      notifyGlobalListeners();
    },
    tickets: globalTickets,
    activeTicket: globalActiveTicket,
    addTicket: (t: SeatBooking) => {
      globalTickets = [t, ...globalTickets.filter((item) => item.id !== t.id)];
      globalActiveTicket = t;
      notifyGlobalListeners();
    },
    removeTicket: (ticketId: string) => {
      globalTickets = globalTickets.filter((item) => item.id !== ticketId);
      if (globalActiveTicket?.id === ticketId) {
        globalActiveTicket = globalTickets.length > 0 ? globalTickets[0] : null;
      }
      notifyGlobalListeners();
    },
    setActiveTicket: (t: SeatBooking | null) => {
      globalActiveTicket = t;
      notifyGlobalListeners();
    },
    isTicketModalOpen: globalIsTicketModalOpen,
    setIsTicketModalOpen: (open: boolean) => {
      globalIsTicketModalOpen = open;
      notifyGlobalListeners();
    },
    activeTab: globalActiveTab,
    setActiveTab: (tab: 'cards' | 'map') => {
      globalActiveTab = tab;
      notifyGlobalListeners();
    },
    filterType: globalFilterType,
    setFilterType: (t: SpaceType | 'all') => {
      globalFilterType = t;
      notifyGlobalListeners();
    },
    filterQuietOnly: globalFilterQuietOnly,
    setFilterQuietOnly: (q: boolean) => {
      globalFilterQuietOnly = q;
      notifyGlobalListeners();
    },
    filterChargingOnly: globalFilterChargingOnly,
    setFilterChargingOnly: (c: boolean) => {
      globalFilterChargingOnly = c;
      notifyGlobalListeners();
    },
    userPreferences: globalUserPreferences,
    setUserPreferences: (p: UserPreferences) => {
      globalUserPreferences = p;
      notifyGlobalListeners();
    },
    updateOccupancy,
    submitCrowdReport,
    createAlert,
    removeAlert,
    runPresetScenario,
  };
}
