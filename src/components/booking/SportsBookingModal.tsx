'use client';

import React, { useState, useEffect } from 'react';
import { CampusLocation } from '@/types';
import { playAlertChime } from '@/lib/engine/sound';
import {
  X,
  Trophy,
  Check,
  Clock,
  Dumbbell,
  Users,
  CheckCircle2,
  Trash2,
  Sparkles,
  Flame,
  Zap,
  Plus,
  Minus,
  QrCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createSportsBookingInDb } from '@/lib/supabase/client';
import { useCampusStore } from '@/lib/store/useCampusStore';
import { SeatBooking } from '@/types';

interface SportsBookingModalProps {
  location: CampusLocation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SportsBookingModal: React.FC<SportsBookingModalProps> = ({
  location,
  isOpen,
  onClose,
}) => {
  const { addTicket, setIsTicketModalOpen } = useCampusStore();
  const [selectedSlot, setSelectedSlot] = useState<string>('Full Court / Pitch');
  const [selectedGear, setSelectedGear] = useState<{ [gearName: string]: number }>({});
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [activeBooking, setActiveBooking] = useState<{
    id: string;
    slot: string;
    gearList: string[];
    bookedAt: string;
    duration: number;
  } | null>(null);

  useEffect(() => {
    if (location) {
      setSelectedSlot(
        location.name.includes('Turff')
          ? 'Full 5v5 Turf Pitch'
          : location.name.includes('Badminton')
          ? 'Court 1 (Main Net)'
          : location.name.includes('Basketball')
          ? 'Full Hardcourt'
          : 'Table Tennis Table 1'
      );
      setSelectedGear({});
      setActiveBooking(null);
    }
  }, [location?.id]);

  if (!isOpen || !location) return null;

  // Realistic sports court sub-zones
  const getCourtSlots = () => {
    if (location.name.includes('Turff')) {
      return [
        { id: 'Full 5v5 Turf Pitch', name: 'Full 5v5 Pitch', status: 'available', players: '10 max' },
        { id: 'Turf Half A (Goal 1)', name: 'Half Pitch A', status: 'available', players: '5 max' },
        { id: 'Turf Half B (Goal 2)', name: 'Half Pitch B', status: 'available', players: '5 max' },
        { id: 'Box Cricket Pitch', name: 'Box Cricket Pitch', status: 'in_use', players: 'Match active (Ends in 15m)' },
      ];
    }
    if (location.name.includes('Badminton')) {
      return [
        { id: 'Court 1 (Main Net)', name: 'Court 1 (Badminton)', status: 'available', players: 'Singles / Doubles' },
        { id: 'Court 2 (Volleyball Net)', name: 'Court 2 (Volleyball)', status: 'available', players: '6v6 Team Play' },
        { id: 'Practice Wall Zone', name: 'Practice Rally Zone', status: 'available', players: '1-2 Players' },
      ];
    }
    if (location.name.includes('Basketball')) {
      return [
        { id: 'Full Hardcourt', name: 'Full Hardcourt (5v5)', status: 'available', players: '10 max' },
        { id: 'Half Court (East Hoop)', name: 'East Hoop (3v3 Half)', status: 'available', players: '6 max' },
        { id: 'Half Court (West Hoop)', name: 'West Hoop (Shooting)', status: 'in_use', players: 'Drills in progress' },
      ];
    }
    // Play zone / indoor TT
    return [
      { id: 'Table Tennis Table 1', name: 'TT Table 1 (Pro Net)', status: 'available', players: '2-4 Players' },
      { id: 'Table Tennis Table 2', name: 'TT Table 2', status: 'available', players: '2-4 Players' },
      { id: 'Foosball Arena', name: 'Foosball Table 1', status: 'in_use', players: 'Game in progress' },
    ];
  };

  const courtSlots = getCourtSlots();
  const equipment = location.equipment_items || [
    { name: 'Footballs & Cricket Balls', available: 4, total: 6 },
    { name: 'Bats & Rackets', available: 4, total: 6 },
  ];

  const handleIncrementGear = (name: string, available: number) => {
    setSelectedGear((prev) => {
      const current = prev[name] || 0;
      if (current >= available) return prev;
      return { ...prev, [name]: current + 1 };
    });
  };

  const handleDecrementGear = (name: string) => {
    setSelectedGear((prev) => {
      const current = prev[name] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: current - 1 };
    });
  };

  const handleConfirm = async () => {
    const gearStrings = Object.entries(selectedGear).map(
      ([gear, count]) => `${count}x ${gear}`
    );

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const sportsBookingTicket: SeatBooking = {
      id: `sports-pass-${Date.now()}`,
      ticket_code: `SPT-SPORTS-${randomSuffix}`,
      location_id: location.id,
      location_name: location.name,
      location_floor: location.floor,
      location_building: location.building,
      seat_number: selectedSlot,
      table_number: 1,
      user_name: 'Abinivesh (SST)',
      user_email: 'student@sst.scaler.com',
      booked_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      booked_timestamp: Date.now(),
      expires_in_minutes: durationMinutes,
      status: 'active',
    };

    setActiveBooking({
      id: sportsBookingTicket.id,
      slot: selectedSlot,
      gearList: gearStrings.length > 0 ? gearStrings : ['No extra gear requested'],
      bookedAt: sportsBookingTicket.booked_at,
      duration: durationMinutes,
    });

    addTicket(sportsBookingTicket);

    try {
      await createSportsBookingInDb({
        location_id: location.id,
        location_name: location.name,
        court_slot: selectedSlot,
        gear_items: gearStrings,
        duration_minutes: durationMinutes,
        user_email: 'student@sst.scaler.com',
      });

      playAlertChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.2 },
        colors: ['#c5cc7b', '#a6d29b', '#ffffff'],
      });
    } catch (e) {
      // fallback
    }
  };

  const isFull = location.current_occupancy >= location.capacity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-surface-container-lowest/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-surface-container-high border-2 border-primary-container shadow-2xl p-5 sm:p-7 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer border border-primary-container/40"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-8">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container border border-secondary font-mono flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              SPORTS COURT &amp; GEAR CHECKOUT
            </span>
            <span className="text-xs text-on-surface-variant font-inter">
              {location.floor} • {location.building}
            </span>
          </div>

          <h3 className="font-sora text-xl sm:text-2xl font-bold text-on-surface leading-tight">
            {location.name}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant mt-2 font-inter">
            <span className="flex items-center gap-1.5 text-primary font-bold">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {isFull ? 'Court Currently Occupied' : 'Court Open for Match & Practice'}
            </span>
            <span>•</span>
            <span>
              Players Active: <strong className="text-on-surface font-mono">{location.current_occupancy} / {location.capacity} max</strong>
            </span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-5">
          {/* Section 1: Choose Court Zone / Slot */}
          <div>
            <label className="text-xs font-sora font-bold text-on-surface uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-secondary" />
              1. Select Court Zone / Pitch Slot
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {courtSlots.map((slot) => {
                const isSelected = selectedSlot === slot.id;
                const isBusy = slot.status === 'in_use';

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={isBusy}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-secondary-container/80 border-secondary text-on-secondary-container shadow-md'
                        : isBusy
                        ? 'bg-surface-container/40 border-surface-variant/40 opacity-60 cursor-not-allowed'
                        : 'bg-surface-container hover:bg-surface-bright border-primary-container/70 text-on-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sora text-xs font-bold">{slot.name}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          isBusy ? 'bg-error-container/40 text-error' : 'bg-primary-container/60 text-primary'
                        }`}
                      >
                        {isBusy ? 'OCCUPIED' : 'OPEN'}
                      </span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant font-inter">
                      {slot.players}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Equipment Checkout Station with +/- Stepper */}
          <div>
            <label className="text-xs font-sora font-bold text-on-surface uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-primary" />
              2. Equipment &amp; Gear Checkout Station (+/- Quantity)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {equipment.map((item) => {
                const count = selectedGear[item.name] || 0;
                const isSelected = count > 0;

                return (
                  <div
                    key={item.name}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                      isSelected
                        ? 'bg-primary-container/40 border-primary shadow-sm'
                        : 'bg-surface-container border-primary-container/70'
                    }`}
                  >
                    <div>
                      <h4 className="font-sora text-xs font-bold text-on-surface">{item.name}</h4>
                      <p className="text-[11px] text-on-surface-variant font-inter mt-0.5">
                        <strong className="text-primary font-mono">{item.available}</strong> of {item.total} free in locker
                      </p>
                    </div>

                    {/* Stepper Controls (+ / -) */}
                    <div className="flex items-center gap-1.5 bg-surface-container-high p-1 rounded-xl border border-primary-container/60">
                      <button
                        type="button"
                        disabled={count <= 0}
                        onClick={() => handleDecrementGear(item.name)}
                        className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-bright flex items-center justify-center font-bold text-xs text-on-surface disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed active:scale-95 transition-all"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-6 text-center font-mono text-xs font-bold text-primary">
                        {count}
                      </span>

                      <button
                        type="button"
                        disabled={count >= item.available}
                        onClick={() => handleIncrementGear(item.name, item.available)}
                        className="w-7 h-7 rounded-lg bg-primary text-on-primary hover:bg-primary-container flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed active:scale-95 transition-all shadow-sm"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Time Duration */}
          <div className="p-3.5 rounded-2xl bg-surface-container border border-primary-container/70 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-inter text-on-surface">
              <Clock className="w-4 h-4 text-tertiary" />
              <span className="font-semibold">Slot Duration:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`px-3 py-1 rounded-xl text-xs font-sora font-bold transition-all cursor-pointer ${
                    durationMinutes === mins
                      ? 'bg-tertiary text-on-tertiary shadow-sm'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-primary-container/50'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer / Active Sports Pass */}
        <div className="mt-4 pt-3.5 border-t border-surface-variant">
          {activeBooking ? (
            <div className="p-4 rounded-2xl bg-secondary-container/60 border border-secondary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sora text-sm font-bold text-on-surface">
                      {activeBooking.slot} Confirmed
                    </span>
                    <span className="text-[10px] bg-secondary text-on-secondary px-1.5 py-0.5 rounded font-mono font-bold">
                      ACTIVE MATCH PASS
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-inter">
                    {activeBooking.duration} min slot • Booked at {activeBooking.bookedAt} • Gear: {activeBooking.gearList.join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsTicketModalOpen(true);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-tertiary hover:bg-tertiary-fixed text-on-tertiary text-xs font-sora font-bold shadow-sm transition-all cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>View E-Ticket</span>
                </button>
                <button
                  onClick={() => setActiveBooking(null)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-error/15 hover:bg-error/25 text-error text-xs font-sora font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-on-surface-variant font-inter">
                Selected: <strong className="text-on-surface font-sora">{selectedSlot}</strong> ({durationMinutes} mins)
                {Object.keys(selectedGear).length > 0 && (
                  <span className="text-primary font-bold block sm:inline sm:ml-2">
                    • Gear: {Object.entries(selectedGear).map(([g, c]) => `${c}x ${g}`).join(', ')}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface-variant text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-xs shadow-md shadow-tertiary/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Confirm Slot &amp; Gear</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
