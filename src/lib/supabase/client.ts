import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SeatBooking } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('your-project-id')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// ==============================================================================
// 1. SUPABASE AUTHENTICATION ENGINE
// ==============================================================================

/**
 * Sign in using Google OAuth with SST domain redirection
 */
export const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
  if (!supabase) {
    // Graceful fallback for mock demo
    return { error: null };
  }

  const redirectUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : 'http://localhost:3000/auth/callback';

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        hd: 'scaler.com', // Highlights Scaler/SST student accounts
        prompt: 'select_account',
      },
    },
  });

  return { error };
};

/**
 * Send passwordless Magic Link / OTP Code to SST Campus Email
 */
export const signInWithSstEmail = async (email: string): Promise<{ error: Error | null }> => {
  if (!supabase) {
    return { error: null };
  }

  const redirectUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : 'http://localhost:3000/auth/callback';

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
      shouldCreateUser: true,
    },
  });

  return { error };
};

/**
 * Verify SST 4/6-Digit OTP Token
 */
export const verifySstCode = async (
  email: string,
  token: string
): Promise<{ error: Error | null; session: any | null }> => {
  if (!supabase) {
    return { error: null, session: { user: { email } } };
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  return { error, session: data.session };
};

/**
 * Sign out active student session
 */
export const signOutUser = async (): Promise<void> => {
  if (supabase) {
    await supabase.auth.signOut();
  }
};

/**
 * Get active student user session
 */
export const getActiveUserSession = async (): Promise<{ email: string | null; name: string | null }> => {
  if (!supabase) {
    return { email: null, name: null };
  }

  const { data } = await supabase.auth.getSession();
  if (data?.session?.user) {
    const user = data.session.user;
    return {
      email: user.email || null,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
    };
  }

  return { email: null, name: null };
};

// ==============================================================================
// 2. REAL-TIME BOOKING & TELEMETRY PERSISTENCE
// ==============================================================================

/**
 * Persist Seat Booking to Supabase Cloud Database
 */
export const createSeatBookingInDb = async (booking: {
  location_id: string;
  location_name: string;
  location_floor: string;
  table_number: number;
  seat_number: string;
  user_email: string;
  duration_hours: number;
}): Promise<{ id: string; error: Error | null }> => {
  if (!supabase) {
    return { id: `local-seat-${Date.now()}`, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('seat_bookings')
      .insert([
        {
          location_id: booking.location_id,
          location_name: booking.location_name,
          location_floor: booking.location_floor,
          table_number: booking.table_number,
          seat_number: booking.seat_number,
          user_email: booking.user_email,
          duration_hours: booking.duration_hours,
          is_active: true,
        },
      ])
      .select('id')
      .single();

    return { id: data?.id || `seat-${Date.now()}`, error: error ? new Error(error.message) : null };
  } catch (err: any) {
    console.warn('[Spotly DB] Seat booking fallback:', err);
    return { id: `local-seat-${Date.now()}`, error: null };
  }
};

/**
 * Cancel an active seat booking
 */
export const cancelSeatBookingInDb = async (bookingId: string): Promise<void> => {
  if (!supabase) return;
  try {
    await supabase
      .from('seat_bookings')
      .update({ is_active: false })
      .eq('id', bookingId);
  } catch (err) {
    console.warn('[Spotly DB] Seat cancel fallback:', err);
  }
};

/**
 * Persist Sports Court & Gear Reservation to Supabase Cloud Database
 */
export const createSportsBookingInDb = async (booking: {
  location_id: string;
  location_name: string;
  court_slot: string;
  gear_items: string[];
  duration_minutes: number;
  user_email: string;
}): Promise<{ id: string; error: Error | null }> => {
  if (!supabase) {
    return { id: `local-sports-${Date.now()}`, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('sports_bookings')
      .insert([
        {
          location_id: booking.location_id,
          location_name: booking.location_name,
          court_slot: booking.court_slot,
          gear_items: booking.gear_items,
          duration_minutes: booking.duration_minutes,
          user_email: booking.user_email,
          is_active: true,
        },
      ])
      .select('id')
      .single();

    return { id: data?.id || `sports-${Date.now()}`, error: error ? new Error(error.message) : null };
  } catch (err: any) {
    console.warn('[Spotly DB] Sports booking fallback:', err);
    return { id: `local-sports-${Date.now()}`, error: null };
  }
};

/**
 * Update Location Occupancy in Database
 */
export const updateLocationOccupancyInDb = async (
  locationId: string,
  newOccupancy: number
): Promise<void> => {
  if (!supabase) return;
  try {
    await supabase
      .from('locations')
      .update({ current_occupancy: newOccupancy, updated_at: new Date().toISOString() })
      .eq('id', locationId);
  } catch (err) {
    console.warn('[Spotly DB] Location occupancy update fallback:', err);
  }
};
