'use client';

import { useState, useEffect, useCallback } from 'react';
import { CampusLocation, SpaceAlert, UserPreferences, SpaceType } from '@/types';
import { INITIAL_CAMPUS_LOCATIONS } from '@/lib/supabase/seed-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getOrCreateSessionId } from '@/lib/utils/session';
import { playAlertChime } from '@/lib/engine/sound';

// BroadcastChannel for instant multi-tab sync across browser windows
const BROADCAST_CHANNEL_NAME = 'campus_space_realtime_channel';

// In-memory global store to share state across components in the same tab
let globalLocations: CampusLocation[] = [...INITIAL_CAMPUS_LOCATIONS];
let globalAlerts: SpaceAlert[] = [];
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
    alert: SpaceAlert;
    location: CampusLocation;
    occupancyPct: number;
  } | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [isFindModalOpen, setIsFindModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'cards' | 'map'>('cards');
  const [filterType, setFilterType] = useState<SpaceType | 'all'>('all');
  const [filterQuietOnly, setFilterQuietOnly] = useState(false);
  const [filterChargingOnly, setFilterChargingOnly] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    quiet: false,
    charging: false,
    wifi: false,
    low_crowd: false,
    type: 'all',
  });

  // Re-render when global store changes
  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1);
    globalListeners.add(handleUpdate);
    return () => {
      globalListeners.delete(handleUpdate);
    };
  }, []);

  // Check and fire alerts when occupancy changes
  const evaluateAlertsLocally = useCallback((updatedLoc: CampusLocation) => {
    const occPct = Math.round((updatedLoc.current_occupancy / Math.max(1, updatedLoc.capacity)) * 100);
    const sessionId = getOrCreateSessionId();

    globalAlerts = globalAlerts.map((alert) => {
      if (
        alert.location_id === updatedLoc.id &&
        alert.is_active &&
        occPct <= alert.threshold_percentage
      ) {
        // Trigger alert!
        const triggeredAlert: SpaceAlert = {
          ...alert,
          is_active: false,
          triggered_at: new Date().toISOString(),
        };

        if (alert.user_session_id === sessionId) {
          playAlertChime();
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
        const { locationId, newOccupancy } = payload;
        const target = globalLocations.find((l) => l.id === locationId);
        if (target) {
          target.current_occupancy = newOccupancy;
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

  // Supabase real-time sync if configured
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    // Fetch initial data from Supabase
    supabase
      .from('locations')
      .select('*')
      .then(({ data, error }) => {
        if (data && data.length > 0 && !error) {
          globalLocations = data as CampusLocation[];
          notifyGlobalListeners();
        }
      });

    // Subscribe to Postgres changes
    const channel = supabase
      .channel('campus-realtime-public')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'locations' },
        (payload) => {
          const updated = payload.new as CampusLocation;
          const idx = globalLocations.findIndex((l) => l.id === updated.id);
          if (idx !== -1) {
            globalLocations[idx] = updated;
            evaluateAlertsLocally(updated);
            notifyGlobalListeners();
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [evaluateAlertsLocally]);

  // Update occupancy action (used by simulator or crowd report)
  const updateOccupancy = useCallback(
    async (locationId: string, newOccupancy: number) => {
      const loc = globalLocations.find((l) => l.id === locationId);
      if (!loc) return;

      const clampedOccupancy = Math.max(0, Math.min(loc.capacity, Math.round(newOccupancy)));
      loc.current_occupancy = clampedOccupancy;

      evaluateAlertsLocally(loc);
      notifyGlobalListeners();

      // Broadcast to other browser tabs
      broadcastChannel?.postMessage({
        type: 'OCCUPANCY_UPDATE',
        payload: { locationId, newOccupancy: clampedOccupancy },
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

  // Create Alert Action
  const createAlert = useCallback(
    async (locationId: string, thresholdPercentage: number) => {
      const sessionId = getOrCreateSessionId();
      const loc = globalLocations.find((l) => l.id === locationId);
      const newAlert: SpaceAlert = {
        id: 'alert_' + Math.random().toString(36).substring(2, 9),
        user_session_id: sessionId,
        location_id: locationId,
        location_name: loc?.name || 'Campus Space',
        threshold_percentage: thresholdPercentage,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      globalAlerts = [newAlert, ...globalAlerts];
      notifyGlobalListeners();

      broadcastChannel?.postMessage({
        type: 'NEW_ALERT',
        payload: newAlert,
      });

      if (isSupabaseConfigured() && supabase) {
        try {
          await supabase.from('alerts').insert([
            {
              id: newAlert.id,
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

  // Remove alert
  const removeAlert = useCallback((alertId: string) => {
    globalAlerts = globalAlerts.filter((a) => a.id !== alertId);
    notifyGlobalListeners();
  }, []);

  // Demo Scenario Presets
  const runPresetScenario = useCallback(
    (scenario: 'hero_alert' | 'rush_hour' | 'quiet_night' | 'reset') => {
      if (scenario === 'hero_alert') {
        // Drop Study Room B from 20 (83%) to 11 (46%) -> triggers <= 50% alert!
        const srB = globalLocations.find((l) => l.code === 'SR-B');
        if (srB) {
          updateOccupancy(srB.id, 11);
        }
      } else if (scenario === 'rush_hour') {
        // High occupancy across campus
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

  // Computed Values
  const totalCapacity = globalLocations.reduce((acc, l) => acc + l.capacity, 0);
  const totalOccupancy = globalLocations.reduce((acc, l) => acc + l.current_occupancy, 0);
  const campusOccupancyPercentage = Math.round((totalOccupancy / Math.max(1, totalCapacity)) * 100);

  const activeUserAlerts = globalAlerts.filter(
    (a) => a.user_session_id === getOrCreateSessionId()
  );

  return {
    locations: globalLocations,
    alerts: activeUserAlerts,
    allAlerts: globalAlerts,
    activeAlertTrigger,
    clearAlertTrigger: () => setActiveAlertTrigger(null),
    campusOccupancyPercentage,
    totalAvailableSeats: totalCapacity - totalOccupancy,
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
    createAlert,
    removeAlert,
    runPresetScenario,
  };
}
