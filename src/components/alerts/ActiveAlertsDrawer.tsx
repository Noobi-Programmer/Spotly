'use client';

import React, { useState } from 'react';
import { SpaceWatch, CampusLocation, SeatBooking } from '@/types';
import {
  X,
  Eye,
  Trash2,
  CheckCircle2,
  QrCode,
  MapPin,
  Clock,
  Ticket,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useCampusStore } from '@/lib/store/useCampusStore';

interface ActiveAlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: SpaceWatch[];
  locations: CampusLocation[];
  onRemoveAlert: (alertId: string) => void;
  onSelectLocation: (loc: CampusLocation) => void;
}

export const ActiveAlertsDrawer: React.FC<ActiveAlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  locations,
  onRemoveAlert,
  onSelectLocation,
}) => {
  const {
    tickets = [],
    setActiveTicket,
    setIsTicketModalOpen,
    removeTicket,
  } = useCampusStore();

  const [activeTab, setActiveTab] = useState<'passes' | 'watches'>('passes');

  if (!isOpen) return null;

  const activeWatches = alerts.filter((a) => a.is_active);
  const triggeredWatches = alerts.filter((a) => !a.is_active);

  const handleOpenTicket = (ticket: SeatBooking) => {
    setActiveTicket(ticket);
    setIsTicketModalOpen(true);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-surface-container-lowest/80 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-md h-full bg-surface-container-high border-l border-primary-container shadow-2xl p-5 sm:p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header & Tab Switcher */}
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3.5 border-b border-surface-variant mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-tertiary-container text-tertiary border border-tertiary/40">
                <Ticket className="w-4 h-4 text-tertiary" />
              </div>
              <div>
                <h3 className="font-sora text-base font-bold text-on-surface">
                  Passes &amp; Notifications
                </h3>
                <p className="text-xs text-on-surface-variant font-inter">
                  {tickets.length} active pass{tickets.length === 1 ? '' : 'es'} • {activeWatches.length} watch{activeWatches.length === 1 ? '' : 'es'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Switcher: 1. My Passes (E-Tickets) / 2. Space Watches */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-container rounded-2xl border border-primary-container mb-4">
            <button
              onClick={() => setActiveTab('passes')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-sora font-semibold transition-all cursor-pointer ${
                activeTab === 'passes'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>My Passes ({tickets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('watches')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-sora font-semibold transition-all cursor-pointer ${
                activeTab === 'watches'
                  ? 'bg-tertiary text-on-tertiary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Watches ({activeWatches.length})</span>
            </button>
          </div>

          {/* Tab 1 Content: My Passes & E-Tickets */}
          {activeTab === 'passes' && (
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-230px)] pr-1 no-scrollbar">
              {tickets.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-surface-container border border-primary-container/60 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/40 text-primary flex items-center justify-center mb-3">
                    <QrCode className="w-6 h-6 opacity-70" />
                  </div>
                  <h4 className="font-sora text-sm font-bold text-on-surface mb-1">
                    No active seat passes yet
                  </h4>
                  <p className="font-inter text-xs text-on-surface-variant leading-relaxed mb-4">
                    Book any study room desk or turf slot to get your instant digital boarding pass with a scannable QR code.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((t) => {
                    return (
                      <div
                        key={t.id}
                        className="p-4 rounded-2xl bg-surface-container border-2 border-primary/50 hover:border-primary transition-all flex flex-col gap-3 shadow-md relative overflow-hidden"
                      >
                        {/* Status bar */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 bg-primary/20 border border-primary/40 px-2 py-0.5 rounded-full text-[10px] font-bold text-primary font-mono">
                            <ShieldCheck className="w-3 h-3" />
                            <span>VERIFIED PASS</span>
                          </div>
                          <span className="text-[10px] font-mono text-on-surface-variant font-bold">
                            #{t.ticket_code}
                          </span>
                        </div>

                        {/* Location and Seats */}
                        <div>
                          <h4 className="font-sora text-sm font-bold text-on-surface leading-tight">
                            {t.location_name}
                          </h4>
                          <p className="text-[11px] text-on-surface-variant font-inter mt-0.5">
                            {t.location_floor} • {t.location_building || 'Science & Tech Block'}
                          </p>
                        </div>

                        {/* Big Table & Seat Highlight */}
                        <div className="grid grid-cols-2 gap-2 bg-surface-container-high p-2.5 rounded-xl border border-primary-container">
                          <div className="text-center">
                            <span className="text-[9px] font-mono uppercase text-on-surface-variant block">
                              TABLE
                            </span>
                            <span className="font-sora text-base font-bold text-primary">
                              Table {t.table_number}
                            </span>
                          </div>
                          <div className="text-center border-l border-surface-variant">
                            <span className="text-[9px] font-mono uppercase text-tertiary block">
                              SEAT
                            </span>
                            <span className="font-sora text-base font-black text-tertiary">
                              {t.seat_number}
                            </span>
                          </div>
                        </div>

                        {/* Time details */}
                        <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-inter">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>Booked at {t.booked_at}</span>
                          </div>
                          <span>Valid for {Math.round(t.expires_in_minutes / 60)}h</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-1 border-t border-surface-variant">
                          <button
                            onClick={() => handleOpenTicket(t)}
                            className="flex-1 py-2 px-3 rounded-xl bg-tertiary hover:bg-tertiary-fixed text-on-tertiary text-xs font-sora font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Show Full QR Pass</span>
                          </button>

                          <button
                            onClick={() => removeTicket(t.id)}
                            className="p-2 rounded-xl bg-error/15 hover:bg-error/25 text-error transition-colors cursor-pointer border border-error/30"
                            title="Release Seat Early"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2 Content: Space Watches */}
          {activeTab === 'watches' && (
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-230px)] pr-1 no-scrollbar">
              {alerts.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-surface-container border border-primary-container/60">
                  <Eye className="w-8 h-8 text-outline mx-auto mb-2 opacity-50" />
                  <h4 className="font-sora text-sm font-bold text-on-surface mb-1">
                    You&apos;re not watching any spaces yet
                  </h4>
                  <p className="font-inter text-xs text-on-surface-variant leading-relaxed">
                    When a study room or library is crowded, tap &ldquo;Watch this space&rdquo; to get notified
                    the moment occupancy drops below your target.
                  </p>
                </div>
              ) : (
                <>
                  {activeWatches.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-tertiary mb-2 font-sora">
                        Active Space Watches ({activeWatches.length})
                      </div>
                      <div className="space-y-2.5">
                        {activeWatches.map((watch) => {
                          const loc = locations.find((l) => l.id === watch.location_id);
                          const curPct = loc
                            ? Math.round((loc.current_occupancy / Math.max(1, loc.capacity)) * 100)
                            : 0;

                          return (
                            <div
                              key={watch.id}
                              className="p-3.5 rounded-xl bg-surface-container border border-tertiary/40 flex items-start justify-between gap-3"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                                  <h4 className="font-sora text-xs font-bold text-on-surface">
                                    {loc?.name || watch.location_name || 'Campus Space'}
                                  </h4>
                                </div>

                                <p className="text-[11px] text-on-surface-variant mb-2 font-inter">
                                  Watching for &le;{' '}
                                  <strong className="text-tertiary font-sora">
                                    {watch.threshold_percentage}%
                                  </strong>{' '}
                                  (Currently{' '}
                                  <strong className="text-on-surface font-sora">{curPct}%</strong>)
                                </p>

                                {loc && (
                                  <button
                                    onClick={() => {
                                      onSelectLocation(loc);
                                      onClose();
                                    }}
                                    className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 font-inter cursor-pointer"
                                  >
                                    <span>View space details</span>
                                    <span>→</span>
                                  </button>
                                )}
                              </div>

                              <button
                                onClick={() => onRemoveAlert(watch.id)}
                                className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                                title="Remove watch"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {triggeredWatches.length > 0 && (
                    <div className="pt-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2 font-sora">
                        Triggered Availability Alerts ({triggeredWatches.length})
                      </div>
                      <div className="space-y-2">
                        {triggeredWatches.map((watch) => {
                          const loc = locations.find((l) => l.id === watch.location_id);
                          return (
                            <div
                              key={watch.id}
                              className="p-3 rounded-lg bg-surface-container border border-primary/30 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                <div>
                                  <div className="font-semibold text-on-surface font-sora">
                                    {loc?.name || 'Space'} freed up!
                                  </div>
                                  <div className="text-[10px] text-on-surface-variant font-inter">
                                    Fell below {watch.threshold_percentage}% target
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => onRemoveAlert(watch.id)}
                                className="text-outline hover:text-on-surface p-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3.5 border-t border-surface-variant">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface text-xs font-sora font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
