'use client';

import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './client';
import { useCampusStore } from '../store/useCampusStore';

/**
 * Hook to establish Supabase Realtime WebSocket listeners & Auth state subscriber
 */
export const useSupabaseRealtime = (
  onUserAuthChange?: (email: string | null) => void
) => {
  const { updateOccupancy, locations } = useCampusStore();

  useEffect(() => {
    // 1. Listen for Supabase Auth State Changes (Google OAuth login, OTP verification, Logout)
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          const userEmail = session?.user?.email || null;
          if (onUserAuthChange) {
            onUserAuthChange(userEmail);
          }
        }
      );

      // 2. Connect to Supabase Realtime Channel
      const realtimeChannel = supabase
        .channel('spotly-realtime-channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'locations' },
          (payload: any) => {
            if (payload.new && payload.new.id) {
              updateOccupancy(payload.new.id, payload.new.current_occupancy);
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'seat_bookings' },
          (payload: any) => {
            // When a new seat is booked, decrement available count / increment occupancy
            if (payload.new && payload.new.location_id) {
              const loc = locations.find((l) => l.id === payload.new.location_id);
              if (loc && loc.current_occupancy < loc.capacity) {
                updateOccupancy(loc.id, loc.current_occupancy + 1);
              }
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'seat_bookings' },
          (payload: any) => {
            // When a seat booking is cancelled (is_active: false), free up occupancy
            if (payload.new && payload.new.is_active === false && payload.new.location_id) {
              const loc = locations.find((l) => l.id === payload.new.location_id);
              if (loc && loc.current_occupancy > 0) {
                updateOccupancy(loc.id, loc.current_occupancy - 1);
              }
            }
          }
        )
        .subscribe();

      return () => {
        authListener.subscription.unsubscribe();
        if (supabase) {
          supabase.removeChannel(realtimeChannel);
        }
      };
    }
  }, [updateOccupancy, locations, onUserAuthChange]);
};
