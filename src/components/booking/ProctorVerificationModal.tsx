'use client';

import React, { useEffect, useState } from 'react';
import { decodeTicketToken, DecodedTicketPayload } from '@/lib/utils/ticketCrypto';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  X,
  MapPin,
  Clock,
  User,
  ExternalLink,
  Navigation,
  Lock,
  Sparkles,
} from 'lucide-react';

interface ProctorVerificationModalProps {
  token: string | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToSpace?: (locId: string) => void;
}

export const ProctorVerificationModal: React.FC<ProctorVerificationModalProps> = ({
  token,
  isOpen,
  onClose,
  onGoToSpace,
}) => {
  const [ticketData, setTicketData] = useState<DecodedTicketPayload | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    if (!token) return;
    const decoded = decodeTicketToken(token);
    setTicketData(decoded);
    setCheckedIn(false);
  }, [token]);

  useEffect(() => {
    if (!ticketData) return;

    const updateTimer = () => {
      const expiresAt = ticketData.time + ticketData.duration * 60 * 1000;
      const diffMs = expiresAt - Date.now();
      const isExp = diffMs <= 0;
      const totalSec = Math.max(0, Math.floor(diffMs / 1000));

      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      setTimeLeft({ hours: h, minutes: m, seconds: s, isExpired: isExp });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [ticketData]);

  if (!isOpen || !token) return null;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-surface-container-lowest/90 backdrop-blur-lg animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-surface-container-high border-2 border-primary shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container text-on-surface transition-colors cursor-pointer z-20 border border-primary/40"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary-container via-surface-container-high to-surface-container p-6 border-b border-primary/40 relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary text-on-primary font-sora font-black text-base flex items-center justify-center shadow-md">
                S
              </div>
              <div>
                <span className="font-sora font-bold text-sm text-primary tracking-tight block leading-tight">
                  Spotly Security &amp; Proctor Portal
                </span>
                <span className="text-[10px] font-mono text-on-surface-variant uppercase">
                  Scaler School of Technology • Electronic City
                </span>
              </div>
            </div>

            {/* Validation Banner */}
            {ticketData && ticketData.isValid && !timeLeft.isExpired ? (
              <div className="p-3.5 rounded-2xl bg-primary/20 border-2 border-primary flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-sora text-sm font-bold text-on-surface flex items-center gap-1.5">
                      <span>OFFICIAL VERIFIED PASS</span>
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                    <p className="text-[11px] text-primary font-mono font-semibold">
                      Cryptographic Signature Validated
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-error/20 border-2 border-error flex items-center gap-3 shadow-lg">
                <ShieldAlert className="w-8 h-8 text-error shrink-0" />
                <div>
                  <div className="font-sora text-sm font-bold text-error">
                    {timeLeft.isExpired ? 'RESERVATION EXPIRED' : 'INVALID OR MODIFIED PASS'}
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-inter">
                    This ticket signature cannot be authenticated against campus records.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Ticket Information */}
          {ticketData && (
            <div className="p-6 space-y-4 bg-surface-container-high">
              {/* Space & Seat Details */}
              <div className="p-4 rounded-2xl bg-surface-container border border-primary-container flex flex-col gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary block">
                    RESERVED LOCATION
                  </span>
                  <h3 className="font-sora text-lg font-bold text-on-surface leading-tight">
                    {ticketData.locName}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant font-inter mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{ticketData.floor || 'Floor 2'} • {ticketData.building || 'Science & Tech Block'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-surface-variant">
                  <div className="p-3 rounded-xl bg-surface-container-high border border-primary-container text-center">
                    <span className="text-[10px] font-mono text-on-surface-variant uppercase block">
                      TABLE
                    </span>
                    <span className="font-sora text-xl font-black text-primary">
                      Table {ticketData.table}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-high border border-tertiary text-center">
                    <span className="text-[10px] font-mono text-tertiary uppercase block">
                      SEAT
                    </span>
                    <span className="font-sora text-xl font-black text-tertiary">
                      {ticketData.seat}
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Credential & Security Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-surface-container border border-primary-container/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-on-surface-variant uppercase block">
                      STUDENT HOLDER
                    </span>
                    <span className="font-sora text-xs font-bold text-on-surface">
                      {ticketData.user}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-container border border-primary-container/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-on-surface-variant uppercase block">
                      TIME REMAINING
                    </span>
                    <span className="font-mono text-xs font-bold text-primary">
                      {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cryptographic Verification Details */}
              <div className="p-3.5 rounded-2xl bg-surface-container border border-primary-container/50 text-[11px] font-mono space-y-1">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Ticket Reference:</span>
                  <strong className="text-on-surface font-bold">#{ticketData.code}</strong>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Cryptographic Hash:</span>
                  <span className="text-primary truncate max-w-[180px]">{ticketData.sig}</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>SST Auth Node:</span>
                  <span className="text-tertiary">Verified (Electronic City)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions for Proctor / User */}
        <div className="p-4 bg-surface-container border-t border-surface-variant flex items-center gap-3">
          {checkedIn ? (
            <div className="flex-1 py-3 px-4 rounded-xl bg-primary text-on-primary text-xs font-sora font-bold flex items-center justify-center gap-2 shadow-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span>Student Checked In Successfully</span>
            </div>
          ) : (
            <button
              onClick={() => setCheckedIn(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-sora font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify &amp; Check In Student</span>
            </button>
          )}

          {onGoToSpace && ticketData && (
            <button
              onClick={() => {
                onGoToSpace(ticketData.locId);
                onClose();
              }}
              className="py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-sora font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-primary-container"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>View Desk</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
