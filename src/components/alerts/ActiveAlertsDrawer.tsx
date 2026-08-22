'use client';

import React from 'react';
import { SpaceWatch, CampusLocation } from '@/types';
import { X, Eye, Trash2, CheckCircle2 } from 'lucide-react';

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
  if (!isOpen) return null;

  const activeWatches = alerts.filter((a) => a.is_active);
  const triggeredWatches = alerts.filter((a) => !a.is_active);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-surface-container-lowest/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md h-full bg-surface-container-high border-l border-primary-container shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-surface-variant mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-tertiary-container text-tertiary border border-tertiary/40">
                <Eye className="w-4 h-4 text-tertiary" />
              </div>
              <div>
                <h3 className="font-sora text-base font-bold text-on-surface">My Watches</h3>
                <p className="text-xs text-on-surface-variant font-inter">
                  {activeWatches.length} space{activeWatches.length === 1 ? '' : 's'} being monitored
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of watches */}
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1 no-scrollbar">
            {alerts.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-surface-container border border-primary-container/60">
                <Eye className="w-8 h-8 text-outline mx-auto mb-2 opacity-50" />
                <h4 className="font-sora text-sm font-bold text-on-surface mb-1">You&apos;re not watching any spaces yet</h4>
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
                                <strong className="text-tertiary font-sora">{watch.threshold_percentage}%</strong> (Currently{' '}
                                <strong className="text-on-surface font-sora">{curPct}%</strong>)
                              </p>

                              {loc && (
                                <button
                                  onClick={() => {
                                    onSelectLocation(loc);
                                    onClose();
                                  }}
                                  className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 font-inter"
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
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-surface-variant">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface text-xs font-sora font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
