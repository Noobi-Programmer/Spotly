'use client';

import React, { useState, useMemo } from 'react';
import { CampusLocation, SeatInfo, SeatBooking } from '@/types';
import { playAlertChime } from '@/lib/engine/sound';
import {
  X,
  Sparkles,
  Check,
  Armchair,
  Clock,
  QrCode,
  ShieldCheck,
  Layers,
  Users,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SeatBookingModalProps {
  location: CampusLocation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SeatBookingModal: React.FC<SeatBookingModalProps> = ({
  location,
  isOpen,
  onClose,
}) => {
  const [selectedSeat, setSelectedSeat] = useState<SeatInfo | null>(null);
  const [durationHours, setDurationHours] = useState<number>(2);
  const [activeBooking, setActiveBooking] = useState<SeatBooking | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Generate deterministic seat grid for the location based on table_count & capacity
  const tableCount = location?.table_count || Math.max(1, Math.ceil((location?.capacity || 20) / 4));
  const seatsPerTable = Math.max(2, Math.floor((location?.capacity || 20) / tableCount));

  const seatMatrix = useMemo(() => {
    if (!location) return [];
    const matrix: { tableIndex: number; seats: SeatInfo[] }[] = [];
    const occupiedCount = location.current_occupancy;
    let seatCounter = 0;

    for (let t = 1; t <= tableCount; t++) {
      const tableSeats: SeatInfo[] = [];
      for (let s = 1; s <= seatsPerTable; s++) {
        seatCounter++;
        // Determine occupation deterministically (first occupiedCount seats are taken)
        const isOccupied = seatCounter <= occupiedCount;
        const seatId = `T${t}-S${s}`;

        tableSeats.push({
          id: seatId,
          serial_number: `T${t}-S${s}`,
          table_number: t,
          seat_index: s,
          is_occupied: isOccupied,
          booked_by_user: activeBooking?.seat_number === seatId,
        });
      }
      matrix.push({ tableIndex: t, seats: tableSeats });
    }
    return matrix;
  }, [location, tableCount, seatsPerTable, activeBooking]);

  if (!isOpen || !location) return null;

  const freeSeatCount = Math.max(0, location.capacity - location.current_occupancy);

  const handleSeatClick = (seat: SeatInfo) => {
    if (seat.is_occupied && !seat.booked_by_user) return;
    setSelectedSeat(seat);
  };

  const handleConfirmBooking = () => {
    if (!selectedSeat) return;

    const booking: SeatBooking = {
      id: `booking-${Date.now()}`,
      location_id: location.id,
      location_name: location.name,
      location_floor: location.floor,
      seat_number: selectedSeat.serial_number,
      table_number: selectedSeat.table_number,
      booked_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expires_in_minutes: durationHours * 60,
    };

    setActiveBooking(booking);
    setIsConfirmed(true);

    try {
      playAlertChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.2 },
        colors: ['#a6d29b', '#c5cc7b', '#ffffff'],
      });
    } catch (e) {
      // fallback
    }
  };

  const handleCancelBooking = () => {
    setActiveBooking(null);
    setSelectedSeat(null);
    setIsConfirmed(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-surface-container-lowest/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-surface-container-high border-2 border-primary-container shadow-2xl p-5 sm:p-7 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary-container text-primary border border-primary font-mono">
              BOOKMYSHOW SEAT ENGINE
            </span>
            <span className="text-xs text-on-surface-variant font-inter">
              {location.floor} • {location.building}
            </span>
          </div>

          <h3 className="font-sora text-lg sm:text-2xl font-bold text-on-surface leading-tight">
            {location.name}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant mt-1.5 font-inter">
            <span>
              Tables: <strong className="text-on-surface font-sora font-bold">{tableCount}</strong>
            </span>
            <span>•</span>
            <span>
              Total Seats: <strong className="text-on-surface font-sora font-bold">{location.capacity}</strong>
            </span>
            <span>•</span>
            <span>
              Available: <strong className="text-primary font-sora font-bold">{freeSeatCount} free</strong>
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 py-2.5 px-4 rounded-xl bg-surface-container border border-primary-container/70 text-xs font-inter mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-surface-variant border border-primary-container" />
            <span className="text-on-surface-variant text-[11px]">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-error/70 border border-error/50" />
            <span className="text-on-surface-variant text-[11px]">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-tertiary border border-tertiary-fixed shadow-sm" />
            <span className="text-tertiary font-bold text-[11px]">Selected</span>
          </div>
        </div>

        {/* Presentation / Stage Bar */}
        <div className="w-full flex flex-col items-center mb-4">
          <div className="w-3/4 h-2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/70 font-mono">
            FRONT / WHITEBOARD &amp; SCREEN
          </span>
        </div>

        {/* Seat Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 no-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {seatMatrix.map((table) => (
              <div
                key={table.tableIndex}
                className="p-3 rounded-xl bg-surface-container border border-primary-container/60 flex flex-col items-center gap-2"
              >
                <span className="text-[11px] font-sora font-bold text-on-surface-variant">
                  Table {table.tableIndex}
                </span>

                {/* 2x2 or Grid of Seats */}
                <div className="grid grid-cols-2 gap-1.5 w-full">
                  {table.seats.map((seat) => {
                    const isSelected = selectedSeat?.id === seat.id;
                    const isUserBooked = activeBooking?.seat_number === seat.serial_number;

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={seat.is_occupied && !isUserBooked}
                        onClick={() => handleSeatClick(seat)}
                        className={`p-2 rounded-lg text-xs font-mono font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isUserBooked
                            ? 'bg-primary text-on-primary border-2 border-primary shadow-md'
                            : isSelected
                            ? 'bg-tertiary text-on-tertiary border-2 border-tertiary-fixed scale-105 shadow-md shadow-tertiary/20'
                            : seat.is_occupied
                            ? 'bg-surface-variant/40 text-on-surface-variant/40 border border-error/30 cursor-not-allowed'
                            : 'bg-surface-container-high hover:bg-surface-bright text-on-surface border border-primary-container/70 hover:border-primary'
                        }`}
                        title={
                          seat.is_occupied
                            ? `Seat ${seat.serial_number} (Occupied)`
                            : `Seat ${seat.serial_number} (Available)`
                        }
                      >
                        <Armchair className="w-3.5 h-3.5 mb-0.5" />
                        <span className="text-[10px]">{seat.serial_number}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Confirmation Pass or Action Tray */}
        <div className="mt-4 pt-3.5 border-t border-surface-variant">
          {activeBooking ? (
            <div className="p-4 rounded-xl bg-primary-container/40 border border-primary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sora text-sm font-bold text-on-surface">
                      Seat {activeBooking.seat_number} Reserved
                    </span>
                    <span className="text-[10px] bg-primary text-on-primary px-1.5 py-0.5 rounded font-mono font-bold">
                      ACTIVE PASS
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-inter">
                    Table {activeBooking.table_number} • Booked at {activeBooking.booked_at} • Valid for {durationHours} hours
                  </p>
                </div>
              </div>

              <button
                onClick={handleCancelBooking}
                className="flex items-center gap-1 text-xs text-error hover:text-on-surface transition-colors cursor-pointer self-end sm:self-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel Seat</span>
              </button>
            </div>
          ) : selectedSeat ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 animate-in fade-in">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-on-surface-variant font-inter">Selected Seat:</span>
                  <span className="font-mono font-black text-tertiary bg-surface-container px-2 py-0.5 rounded border border-tertiary/40 text-sm">
                    {selectedSeat.serial_number} (Table {selectedSeat.table_number})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-1 font-inter">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Duration:</span>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    aria-label="Select reservation duration in hours"
                    className="bg-surface-container border border-primary-container rounded px-2 py-0.5 text-xs text-on-surface focus:outline-none"
                  >
                    <option value={1}>1 Hour</option>
                    <option value={2}>2 Hours (Recommended)</option>
                    <option value={4}>4 Hours</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSeat(null)}
                  className="px-3 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface-variant text-xs font-semibold"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-xs shadow-md shadow-tertiary/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Confirm Seat {selectedSeat.serial_number}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-on-surface-variant font-inter py-1">
              <span>Tap any green seat to pick your serial number and claim a spot.</span>
              <button
                type="button"
                onClick={onClose}
                className="text-primary hover:underline font-semibold font-sora cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
