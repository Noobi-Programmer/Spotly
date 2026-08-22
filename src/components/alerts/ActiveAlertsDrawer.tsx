'use client';

import React from 'react';
import { SpaceWatch, CampusLocation } from '@/types';
import { X, Eye, Trash2, CheckCircle2, Navigation } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Eye className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">My Watches</h3>
                <p className="text-xs text-slate-400">
                  {activeWatches.length} space{activeWatches.length === 1 ? '' : 's'} being monitored
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of watches */}
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1 no-scrollbar">
            {alerts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <Eye className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <h4 className="text-sm font-bold text-slate-300 mb-1">You&apos;re not watching any spaces yet</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  When a study room or library is crowded, tap &ldquo;Watch this space&rdquo; to get notified
                  the moment occupancy drops below your target.
                </p>
              </div>
            ) : (
              <>
                {activeWatches.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2">
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
                            className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-start justify-between gap-3"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                <h4 className="text-xs font-bold text-white">
                                  {loc?.name || watch.location_name || 'Campus Space'}
                                </h4>
                              </div>

                              <p className="text-[11px] text-slate-400 mb-2">
                                Watching for &le;{' '}
                                <strong className="text-amber-300">{watch.threshold_percentage}%</strong> (Currently{' '}
                                <strong className="text-slate-200">{curPct}%</strong>)
                              </p>

                              {loc && (
                                <button
                                  onClick={() => {
                                    onSelectLocation(loc);
                                    onClose();
                                  }}
                                  className="text-[11px] text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                                >
                                  <span>View space details</span>
                                  <span>→</span>
                                </button>
                              )}
                            </div>

                            <button
                              onClick={() => onRemoveAlert(watch.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                      Triggered Availability Alerts ({triggeredWatches.length})
                    </div>
                    <div className="space-y-2">
                      {triggeredWatches.map((watch) => {
                        const loc = locations.find((l) => l.id === watch.location_id);
                        return (
                          <div
                            key={watch.id}
                            className="p-3 rounded-xl bg-slate-950/40 border border-emerald-500/20 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <div>
                                <div className="font-semibold text-slate-300">
                                  {loc?.name || 'Space'} freed up!
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  Fell below {watch.threshold_percentage}% target
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => onRemoveAlert(watch.id)}
                              className="text-slate-500 hover:text-slate-300 p-1"
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
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
