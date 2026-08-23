'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
  Zap,
  LayoutGrid,
  ListFilter,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { SportsBookingModal } from './SportsBookingModal';
import { createSeatBookingInDb, cancelSeatBookingInDb } from '@/lib/supabase/client';
import { useCampusStore } from '@/lib/store/useCampusStore';

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
  const { setActiveTicket, setIsTicketModalOpen } = useCampusStore();
  if (location?.category === 'sports') {
    return <SportsBookingModal location={location} isOpen={isOpen} onClose={onClose} />;
  }
  const [selectedSeat, setSelectedSeat] = useState<SeatInfo | null>(null);
  const [durationHours, setDurationHours] = useState<number>(2);
  const [activeBooking, setActiveBooking] = useState<SeatBooking | null>(null);
  const [viewMode, setViewMode] = useState<'all_tables' | 'free_only'>('all_tables');

  // Reset local state when location changes
  useEffect(() => {
    setSelectedSeat(null);
    setActiveBooking(null);
  }, [location?.id]);

  const tableCount = location?.table_count || Math.max(1, Math.ceil((location?.capacity || 20) / 4));

  // Build the complete room seat layout for ALL tables
  const allTablesData = useMemo(() => {
    if (!location) return [];

    const baseSeatsPerTable = Math.floor(location.capacity / tableCount);
    const tablesWithExtraSeat = location.capacity % tableCount;
    let seatCounter = 0;

    const tables: {
      tableNumber: number;
      seats: SeatInfo[];
      freeCount: number;
      totalCount: number;
    }[] = [];

    for (let t = 1; t <= tableCount; t++) {
      const seatsAtTable = baseSeatsPerTable + (t <= tablesWithExtraSeat ? 1 : 0);
      const seats: SeatInfo[] = [];

      for (let s = 1; s <= seatsAtTable; s++) {
        seatCounter++;
        const serialNumber = `T${t}-S${s}`;
        const isOccupied = seatCounter <= location.current_occupancy;

        seats.push({
          id: serialNumber,
          serial_number: serialNumber,
          table_number: t,
          seat_index: s,
          is_occupied: isOccupied,
          booked_by_user: activeBooking?.seat_number === serialNumber,
        });
      }

      const freeCount = seats.filter((st) => !st.is_occupied || st.booked_by_user).length;
      tables.push({
        tableNumber: t,
        seats,
        freeCount,
        totalCount: seatsAtTable,
      });
    }

    return tables;
  }, [location, tableCount, activeBooking]);

  if (!isOpen || !location) return null;

  const freeSeatCount = Math.max(0, location.capacity - location.current_occupancy);

  // List of all free seats across the entire room
  const allFreeSeats = allTablesData.flatMap((t) =>
    t.seats.filter((st) => !st.is_occupied || st.booked_by_user)
  );

  const handleSeatClick = (seat: SeatInfo) => {
    if (seat.is_occupied && !seat.booked_by_user) return;
    setSelectedSeat(seat);
  };

  const handleQuickPick = () => {
    if (allFreeSeats.length > 0) {
      setSelectedSeat(allFreeSeats[0]);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSeat) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const booking: SeatBooking = {
      id: `booking-${Date.now()}`,
      ticket_code: `SPT-${randomSuffix}-SST`,
      location_id: location.id,
      location_name: location.name,
      location_floor: location.floor,
      location_building: location.building,
      seat_number: selectedSeat.serial_number,
      table_number: selectedSeat.table_number,
      user_name: 'Abinivesh (SST)',
      user_email: 'student@sst.scaler.com',
      booked_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      booked_timestamp: Date.now(),
      expires_in_minutes: durationHours * 60,
      status: 'active',
    };

    setActiveBooking(booking);
    setActiveTicket(booking);

    try {
      await createSeatBookingInDb({
        location_id: location.id,
        location_name: location.name,
        location_floor: location.floor,
        table_number: selectedSeat.table_number,
        seat_number: selectedSeat.serial_number,
        user_email: 'student@sst.scaler.com',
        duration_hours: durationHours,
      });

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

  const handleCancelBooking = async () => {
    if (activeBooking) {
      try {
        await cancelSeatBookingInDb(activeBooking.id);
      } catch (e) {
        // fallback
      }
    }
    setActiveBooking(null);
    setSelectedSeat(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-surface-container-lowest/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-surface-container-high border-2 border-primary-container shadow-2xl p-5 sm:p-7 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-8">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-primary-container text-primary border border-primary font-mono">
              INTERACTIVE SEAT MAP
            </span>
            <span className="text-xs text-on-surface-variant font-inter font-medium">
              {location.floor} • {location.building}
            </span>
          </div>

          <h3 className="font-sora text-xl sm:text-2xl font-bold text-on-surface leading-tight">
            {location.name}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant mt-2 font-inter">
            <span>
              All Tables: <strong className="text-on-surface font-sora font-bold">{tableCount}</strong>
            </span>
            <span>•</span>
            <span>
              Total Seats: <strong className="text-on-surface font-sora font-bold">{location.capacity}</strong>
            </span>
            <span>•</span>
            <span className="text-primary font-sora font-bold bg-primary-container/40 px-2 py-0.5 rounded-md border border-primary-container">
              {freeSeatCount} free seats available
            </span>
          </div>
        </div>

        {/* View Mode Switcher + Legend + Quick Pick */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-2 px-3 rounded-2xl bg-surface-container border border-primary-container/70 mb-4">
          {/* View Mode Buttons */}
          <div className="flex items-center gap-1 bg-surface-container-high p-1 rounded-xl border border-primary-container/60">
            <button
              onClick={() => setViewMode('all_tables')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-sora font-semibold transition-all cursor-pointer ${
                viewMode === 'all_tables'
                  ? 'bg-tertiary text-on-tertiary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Full Room Layout</span>
            </button>
            <button
              onClick={() => setViewMode('free_only')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-sora font-semibold transition-all cursor-pointer ${
                viewMode === 'free_only'
                  ? 'bg-tertiary text-on-tertiary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Free Seats ({allFreeSeats.length})</span>
            </button>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-4 text-xs font-inter self-center sm:self-auto">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-on-surface-variant text-[11px]">Free</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-error/70" />
              <span className="text-on-surface-variant text-[11px]">Occupied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-tertiary" />
              <span className="text-tertiary font-bold text-[11px]">Selected</span>
            </div>
          </div>

          {/* Quick Pick Best Available Button */}
          {freeSeatCount > 0 && (
            <button
              onClick={handleQuickPick}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-container text-primary hover:bg-primary-container/80 text-xs font-sora font-bold border border-primary transition-all active:scale-95 cursor-pointer self-stretch sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Pick Free Seat</span>
            </button>
          )}
        </div>

        {/* Front Presentation Indicator */}
        <div className="w-full flex flex-col items-center mb-3">
          <div className="w-3/4 h-1.5 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/70 font-mono">
            FRONT / WHITEBOARD &amp; SCREEN
          </span>
        </div>

        {/* Multi-View: 1. Full Room Table Matrix / 2. Free Seats Fast List */}
        <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-4">
          {viewMode === 'all_tables' ? (
            /* View 1: Full Room Table Grid (All tables & seats visible simultaneously) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {allTablesData.map((table) => {
                const isTableFull = table.freeCount === 0;

                return (
                  <div
                    key={table.tableNumber}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                      isTableFull
                        ? 'bg-surface-container/60 border-surface-variant/40 opacity-75'
                        : 'bg-surface-container border-primary-container/70 hover:border-primary'
                    }`}
                  >
                    {/* Table Header with Live Free Badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-sora text-xs font-bold text-on-surface">
                        Table {table.tableNumber}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          isTableFull
                            ? 'bg-error-container/40 text-error'
                            : 'bg-primary-container/60 text-primary'
                        }`}
                      >
                        {isTableFull ? 'FULL' : `${table.freeCount} FREE`}
                      </span>
                    </div>

                    {/* All Seats at this Table */}
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {table.seats.map((seat) => {
                        const isSelected = selectedSeat?.id === seat.id;
                        const isUserBooked = activeBooking?.seat_number === seat.serial_number;

                        return (
                          <button
                            key={seat.id}
                            type="button"
                            disabled={seat.is_occupied && !isUserBooked}
                            onClick={() => handleSeatClick(seat)}
                            className={`p-2 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                              isUserBooked
                                ? 'bg-primary text-on-primary border-2 border-primary shadow-md'
                                : isSelected
                                ? 'bg-tertiary text-on-tertiary border-2 border-tertiary-fixed scale-105 shadow-md shadow-tertiary/20'
                                : seat.is_occupied
                                ? 'bg-surface-variant/30 text-on-surface-variant/40 border border-error/20 cursor-not-allowed'
                                : 'bg-primary-container/20 hover:bg-primary-container text-on-surface border border-primary/50 hover:border-primary'
                            }`}
                            title={
                              seat.is_occupied
                                ? `Seat ${seat.serial_number} (Occupied)`
                                : `Seat ${seat.serial_number} (Available)`
                            }
                          >
                            <Armchair
                              className={`w-3.5 h-3.5 mb-0.5 ${
                                isSelected
                                  ? 'text-on-tertiary'
                                  : isUserBooked
                                  ? 'text-on-primary'
                                  : seat.is_occupied
                                  ? 'text-error/50'
                                  : 'text-primary'
                              }`}
                            />
                            <span className="text-[10px]">{seat.serial_number}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* View 2: Free Seats Only (Quick Clean View) */
            <div className="space-y-3">
              <div className="text-xs text-on-surface-variant font-inter">
                Showing all <strong className="text-primary font-bold">{allFreeSeats.length}</strong> available seats sorted by Table:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {allFreeSeats.map((seat) => {
                  const isSelected = selectedSeat?.id === seat.id;
                  const isUserBooked = activeBooking?.seat_number === seat.serial_number;

                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isUserBooked
                          ? 'bg-primary text-on-primary border-2 border-primary shadow-md'
                          : isSelected
                          ? 'bg-tertiary text-on-tertiary border-2 border-tertiary-fixed scale-105 shadow-md'
                          : 'bg-surface-container hover:bg-primary-container/30 border border-primary/50 text-on-surface'
                      }`}
                    >
                      <Armchair className={`w-4 h-4 ${isSelected ? 'text-on-tertiary' : 'text-primary'}`} />
                      <span className="font-mono text-xs font-bold">{seat.serial_number}</span>
                      <span className="text-[10px] text-on-surface-variant">Table {seat.table_number}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Booking Confirmation Pass or Action Tray */}
        <div className="mt-4 pt-3.5 border-t border-surface-variant">
          {activeBooking ? (
            <div className="p-4 rounded-2xl bg-primary-container/40 border border-primary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
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
                    Table {activeBooking.table_number} • Reserved at {activeBooking.booked_at} • Valid for {durationHours} hours
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
                  onClick={handleCancelBooking}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-error/15 hover:bg-error/25 text-error text-xs font-sora font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : selectedSeat ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 animate-in fade-in">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-on-surface-variant font-inter">Selected Seat:</span>
                  <span className="font-mono font-black text-tertiary bg-surface-container px-2.5 py-1 rounded-lg border border-tertiary/40 text-sm">
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
                    className="bg-surface-container border border-primary-container rounded-lg px-2 py-0.5 text-xs text-on-surface focus:outline-none"
                  >
                    <option value={1}>1 Hour</option>
                    <option value={2}>2 Hours (Default)</option>
                    <option value={4}>4 Hours</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSeat(null)}
                  className="px-3 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface-variant text-xs font-semibold cursor-pointer"
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
              <span>Tap any green seat to claim your spot directly.</span>
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
