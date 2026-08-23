'use client';

import { useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from './client';
import { useCampusStore } from '../store/useCampusStore';

/**
 * Hook to establish Supabase Realtime WebSocket listeners & Auth state subscriber
 * Built with bulletproof error handling so network drops or missing tables never throw.
 */
export const useSupabaseRealtime = (
  onUserAuthChange?: (email: string | null) => void
) => {
  const { updateOccupancy, locations } = useCampusStore();
  const locationsRef = useRef(locations);
  const updateOccupancyRef = useRef(updateOccupancy);
  const onAuthChangeRef = useRef(onUserAuthChange);

  // Keep refs up to date without triggering useEffect re-subscriptions
  useEffect(() => {
    locationsRef.current = locations;
  }, [locations]);

  useEffect(() => {
    updateOccupancyRef.current = updateOccupancy;
  }, [updateOccupancy]);

  useEffect(() => {
    onAuthChangeRef.current = onUserAuthChange;
  }, [onUserAuthChange]);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      return;
    }

    let authSubscription: { unsubscribe: () => void } | null = null;
    let realtimeChannel: any = null;

    try {
      // 1. Listen for Supabase Auth State Changes (Google OAuth login, OTP verification, Logout)
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          try {
            const userEmail = session?.user?.email || null;
            if (onAuthChangeRef.current) {
              onAuthChangeRef.current(userEmail);
            }
          } catch (err) {
            console.warn('[Spotly Auth] Handler warning:', err);
          }
        }
      );
      authSubscription = authListener?.subscription || null;

      // 2. Connect to Supabase Realtime Channel with a unique channel key
      const channelName = `spotly-realtime-${Math.random().toString(36).substring(2, 9)}`;
      realtimeChannel = supabase.channel(channelName);

      realtimeChannel
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'locations' },
          (payload: any) => {
            try {
              if (payload.new && payload.new.id && typeof payload.new.current_occupancy === 'number') {
                updateOccupancyRef.current(payload.new.id, payload.new.current_occupancy);
              }
            } catch (err) {
              console.warn('[Spotly Realtime] Location update error:', err);
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'seat_bookings' },
          (payload: any) => {
            try {
              if (payload.new && payload.new.location_id) {
                const loc = locationsRef.current.find((l) => l.id === payload.new.location_id);
                if (loc && loc.current_occupancy < loc.capacity) {
                  updateOccupancyRef.current(loc.id, loc.current_occupancy + 1);
                }
              }
            } catch (err) {
              console.warn('[Spotly Realtime] Seat booking update error:', err);
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'seat_bookings' },
          (payload: any) => {
            try {
              if (payload.new && payload.new.is_active === false && payload.new.location_id) {
                const loc = locationsRef.current.find((l) => l.id === payload.new.location_id);
                if (loc && loc.current_occupancy > 0) {
                  updateOccupancyRef.current(loc.id, loc.current_occupancy - 1);
                }
              }
            } catch (err) {
              console.warn('[Spotly Realtime] Seat release update error:', err);
            }
          }
        )
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            console.log('[Spotly Realtime] Connected to live campus WebSocket');
          }
        });
    } catch (err) {
      console.warn('[Spotly Realtime] Initialization warning (gracefully falling back to local state):', err);
    }

    return () => {
      try {
        if (authSubscription) {
          authSubscription.unsubscribe();
        }
        if (supabase && realtimeChannel) {
          supabase.removeChannel(realtimeChannel);
        }
      } catch (err) {
        // Silent cleanup
      }
    };
  }, []); // Run ONLY once on mount
};
