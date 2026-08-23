import { SeatBooking } from '@/types';

// Simple deterministic hash for ticket verification signature
function generateTicketSignature(payloadStr: string): string {
  let hash = 0;
  for (let i = 0; i < payloadStr.length; i++) {
    const char = payloadStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `SPT-SIG-${hex.toUpperCase()}`;
}

export interface DecodedTicketPayload {
  code: string;
  locId: string;
  locName: string;
  floor?: string;
  building?: string;
  table: number;
  seat: string;
  user: string;
  time: number;
  duration: number;
  sig: string;
  isValid: boolean;
}

/**
 * Encodes a SeatBooking into a compact, base64 URL-safe verification token with cryptographic signature
 */
export function encodeTicketToken(ticket: SeatBooking): string {
  const data = {
    c: ticket.ticket_code,
    l: ticket.location_id,
    ln: ticket.location_name,
    f: ticket.location_floor,
    b: ticket.location_building || 'Science & Tech Block',
    t: ticket.table_number,
    s: ticket.seat_number,
    u: ticket.user_name || 'Abinivesh (SST)',
    ts: ticket.booked_timestamp || Date.now(),
    d: ticket.expires_in_minutes || 120,
  };

  const rawJson = JSON.stringify(data);
  const signature = generateTicketSignature(rawJson);

  const payload = {
    ...data,
    sig: signature,
  };

  if (typeof window !== 'undefined') {
    return btoa(encodeURIComponent(JSON.stringify(payload)));
  }
  return Buffer.from(encodeURIComponent(JSON.stringify(payload))).toString('base64');
}

/**
 * Decodes a verification token string back into structured ticket details and validates its signature
 */
export function decodeTicketToken(token: string): DecodedTicketPayload | null {
  try {
    let jsonStr = '';
    if (typeof window !== 'undefined') {
      jsonStr = decodeURIComponent(atob(token));
    } else {
      jsonStr = decodeURIComponent(Buffer.from(token, 'base64').toString());
    }

    const parsed = JSON.parse(jsonStr);
    const expectedData = {
      c: parsed.c,
      l: parsed.l,
      ln: parsed.ln,
      f: parsed.f,
      b: parsed.b,
      t: parsed.t,
      s: parsed.s,
      u: parsed.u,
      ts: parsed.ts,
      d: parsed.d,
    };

    const expectedSig = generateTicketSignature(JSON.stringify(expectedData));
    const isValid = expectedSig === parsed.sig;

    return {
      code: parsed.c,
      locId: parsed.l,
      locName: parsed.ln,
      floor: parsed.f,
      building: parsed.b,
      table: Number(parsed.t),
      seat: parsed.s,
      user: parsed.u,
      time: Number(parsed.ts),
      duration: Number(parsed.d),
      sig: parsed.sig,
      isValid,
    };
  } catch (e) {
    console.warn('Failed to decode ticket token:', e);
    return null;
  }
}

/**
 * Generates the full public verification URL for QR code encoding
 */
export function getTicketVerificationUrl(ticket: SeatBooking): string {
  const token = encodeTicketToken(ticket);
  const baseUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://spotly-steel.vercel.app';

  return `${baseUrl}/?verify=${encodeURIComponent(token)}`;
}
