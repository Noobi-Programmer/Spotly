'use client';

import React, { useEffect, useState } from 'react';
import { SeatBooking } from '@/types';
import {
  X,
  ShieldCheck,
  QrCode,
  Clock,
  MapPin,
  User,
  Share2,
  Download,
  Trash2,
  Sparkles,
  CheckCircle2,
  Navigation,
  Copy,
  Check,
} from 'lucide-react';

interface CampusTicketModalProps {
  ticket: SeatBooking | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelTicket?: (ticketId: string) => void;
  onGoToSpace?: () => void;
}

export const CampusTicketModal: React.FC<CampusTicketModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onCancelTicket,
  onGoToSpace,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });

  const [copied, setCopied] = useState(false);

  // Live ticking countdown timer (every 1 second)
  useEffect(() => {
    if (!ticket) return;

    const calculateRemaining = () => {
      const expiresAt = ticket.booked_timestamp + ticket.expires_in_minutes * 60 * 1000;
      const diffMs = Math.max(0, expiresAt - Date.now());
      const totalSec = Math.floor(diffMs / 1000);

      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      setTimeLeft({ hours: h, minutes: m, seconds: s, totalSeconds: totalSec });
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const handleCopyPass = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(
        `Spotly Campus Pass: ${ticket.location_name} (Table ${ticket.table_number}, Seat ${ticket.seat_number}) - Ticket #${ticket.ticket_code}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-surface-container-lowest/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-surface-container-high border-2 border-primary shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-surface-container-lowest/70 hover:bg-surface-container-lowest text-on-surface transition-colors cursor-pointer z-20 border border-primary/40"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable E-Ticket Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* =========================================================================
              1. TICKET HEADER & SECURITY HOLOGRAPHIC SEAL
             ========================================================================= */}
          <div className="bg-gradient-to-br from-primary-container via-surface-container-high to-surface-container p-6 pb-5 border-b border-primary/40 relative overflow-hidden">
            {/* Background SVG Grid pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a6d29b_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary text-on-primary font-sora font-black text-sm flex items-center justify-center shadow-md">
                  S
                </div>
                <div>
                  <span className="font-sora font-bold text-sm text-primary tracking-tight block leading-tight">
                    Spotly Pass
                  </span>
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase">
                    Campus Digital Access
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-primary/20 border border-primary/50 px-2.5 py-1 rounded-full text-[10.5px] font-bold text-primary font-mono animate-pulse">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ACTIVE PASS</span>
              </div>
            </div>

            {/* Space Name & Location */}
            <div className="relative z-10 mt-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary block mb-0.5">
                RESERVED SPACE
              </span>
              <h2 className="font-sora text-xl font-extrabold text-on-surface leading-tight">
                {ticket.location_name}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-inter mt-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{ticket.location_floor} • {ticket.location_building || 'Science & Tech Block'}</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              2. TICKET SEAT ALLOCATION & NOTCH CUTOUTS
             ========================================================================= */}
          <div className="relative bg-surface-container px-6 py-5 border-b border-dashed border-primary-container">
            {/* Left & Right Boarding Pass Cutout Circles */}
            <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-surface-container-lowest/85 border border-primary-container" />
            <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-surface-container-lowest/85 border border-primary-container" />

            {/* Seat and Table Numbers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-surface-container-high border border-primary-container text-center flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono uppercase text-on-surface-variant font-bold">
                  TABLE NUMBER
                </span>
                <span className="font-sora text-2xl sm:text-3xl font-black text-primary">
                  Table {ticket.table_number}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-container-high border border-tertiary text-center flex flex-col items-center justify-center shadow-md shadow-tertiary/10">
                <span className="text-[10px] font-mono uppercase text-tertiary font-bold">
                  ASSIGNED SEAT
                </span>
                <span className="font-sora text-2xl sm:text-3xl font-black text-tertiary">
                  {ticket.seat_number}
                </span>
              </div>
            </div>

            {/* Live Expiration Countdown */}
            <div className="mt-4 p-3 rounded-2xl bg-surface-container-high border border-primary-container/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-xs font-sora font-semibold text-on-surface">
                  Pass Validity:
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-primary tracking-wider">
                {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
              </div>
            </div>
          </div>

          {/* =========================================================================
              3. SCANNABLE QR CODE & STUDENT CREDENTIALS
             ========================================================================= */}
          <div className="p-6 flex flex-col items-center text-center gap-4 bg-surface-container-high">
            {/* Dynamic Scannable QR Code Canvas / SVG */}
            <div className="relative p-4 rounded-2xl bg-white text-black shadow-xl flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 140 140"
                width="140"
                height="140"
                className="rounded-lg"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* QR Finder patterns (Top Left, Top Right, Bottom Left) */}
                <rect x="0" y="0" width="40" height="40" fill="#0d1604" rx="6" />
                <rect x="8" y="8" width="24" height="24" fill="#ffffff" rx="3" />
                <rect x="14" y="14" width="12" height="12" fill="#0d1604" rx="2" />

                <rect x="100" y="0" width="40" height="40" fill="#0d1604" rx="6" />
                <rect x="108" y="8" width="24" height="24" fill="#ffffff" rx="3" />
                <rect x="114" y="14" width="12" height="12" fill="#0d1604" rx="2" />

                <rect x="0" y="100" width="40" height="40" fill="#0d1604" rx="6" />
                <rect x="8" y="108" width="24" height="24" fill="#ffffff" rx="3" />
                <rect x="14" y="114" width="12" height="12" fill="#0d1604" rx="2" />

                {/* Matrix Datapoints */}
                <rect x="48" y="10" width="8" height="8" fill="#0d1604" rx="2" />
                <rect x="64" y="10" width="8" height="8" fill="#0d1604" rx="2" />
                <rect x="80" y="10" width="8" height="8" fill="#0d1604" rx="2" />
                <rect x="48" y="26" width="16" height="8" fill="#0d1604" rx="2" />
                <rect x="72" y="26" width="8" height="16" fill="#0d1604" rx="2" />

                <rect x="10" y="48" width="8" height="8" fill="#0d1604" rx="2" />
                <rect x="26" y="48" width="16" height="8" fill="#0d1604" rx="2" />
                <rect x="10" y="64" width="8" height="16" fill="#0d1604" rx="2" />
                <rect x="26" y="72" width="8" height="8" fill="#0d1604" rx="2" />

                <rect x="100" y="48" width="8" height="16" fill="#0d1604" rx="2" />
                <rect x="116" y="48" width="16" height="8" fill="#0d1604" rx="2" />
                <rect x="108" y="72" width="16" height="8" fill="#0d1604" rx="2" />

                <rect x="48" y="48" width="44" height="44" fill="#31572c" rx="8" />
                <text
                  x="70"
                  y="74"
                  fontSize="18"
                  fontWeight="bold"
                  fill="#ffffff"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  S
                </text>

                <rect x="48" y="100" width="16" height="8" fill="#0d1604" rx="2" />
                <rect x="72" y="100" width="8" height="16" fill="#0d1604" rx="2" />
                <rect x="88" y="100" width="16" height="8" fill="#0d1604" rx="2" />
                <rect x="48" y="116" width="8" height="16" fill="#0d1604" rx="2" />
                <rect x="64" y="124" width="16" height="8" fill="#0d1604" rx="2" />
                <rect x="108" y="108" width="24" height="8" fill="#0d1604" rx="2" />
                <rect x="108" y="124" width="16" height="8" fill="#0d1604" rx="2" />
              </svg>

              {/* Animated Laser Scanning Line */}
              <div className="absolute inset-x-4 h-0.5 bg-primary shadow-[0_0_8px_#a6d29b] animate-bounce opacity-80" />
            </div>

            {/* Ticket Ref & Holder Details */}
            <div>
              <div className="font-mono text-xs font-bold text-on-surface tracking-widest uppercase">
                TICKET #{ticket.ticket_code}
              </div>
              <p className="text-[11px] text-on-surface-variant font-inter mt-0.5">
                Holder: <strong className="text-on-surface font-semibold">{ticket.user_name || 'Abinivesh (SST)'}</strong> • Booked at {ticket.booked_at}
              </p>
              <p className="text-[10px] text-primary font-inter mt-1">
                Show this digital screen to library proctors or campus security upon entry.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. TICKET ACTIONS FOOTER
           ========================================================================= */}
        <div className="p-4 bg-surface-container border-t border-surface-variant flex items-center justify-between gap-2">
          <button
            onClick={handleCopyPass}
            className="flex-1 py-2.5 px-3 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-sora font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-primary-container"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-on-surface-variant" />
                <span>Copy Pass</span>
              </>
            )}
          </button>

          {onGoToSpace && (
            <button
              onClick={() => {
                onGoToSpace();
                onClose();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-sora font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Directions</span>
            </button>
          )}

          {onCancelTicket && (
            <button
              onClick={() => {
                onCancelTicket(ticket.id);
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-error/15 hover:bg-error/25 text-error text-xs font-sora font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer border border-error/30"
              title="Release Seat Early"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Release</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
