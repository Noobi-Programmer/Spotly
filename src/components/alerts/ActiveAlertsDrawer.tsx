'use client';

import React from 'react';
import { SpaceAlert, CampusLocation } from '@/types';
import { X, Bell, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ActiveAlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: SpaceAlert[];
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

  const activeAlerts = alerts.filter((a) => a.is_active);
  const pastAlerts = alerts.filter((a) => !a.is_active);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Bell className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Your Space Alerts</h3>
                <p className="text-xs text-slate-400">
                  {activeAlerts.length} active monitoring condition{activeAlerts.length === 1 ? '' : 's'}
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

          {/* List of active alerts */}
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1 no-scrollbar">
            {alerts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <h4 className="text-sm font-bold text-slate-300 mb-1">No Active Alerts</h4>
                <p className="text-xs text-slate-400">
                  When a study room or library is full, click &ldquo;Notify Me&rdquo; on its card to get
                  alerted the instant occupancy drops.
                </p>
              </div>
            ) : (
              <>
                {activeAlerts.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2">
                      Active Telemetry Watchers ({activeAlerts.length})
                    </div>
                    <div className="space-y-2.5">
                      {activeAlerts.map((alert) => {
                        const loc = locations.find((l) => l.id === alert.location_id);
                        const curPct = loc
                          ? Math.round((loc.current_occupancy / Math.max(1, loc.capacity)) * 100)
                          : 0;

                        return (
                          <div
                            key={alert.id}
                            className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-start justify-between gap-3"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                <h4 className="text-xs font-bold text-white">
                                  {loc?.name || alert.location_name || 'Campus Space'}
                                </h4>
                              </div>

                              <p className="text-[11px] text-slate-400 mb-2">
                                Alert when occupancy &le;{' '}
                                <strong className="text-amber-300">{alert.threshold_percentage}%</strong> (Currently{' '}
                                <strong className="text-slate-200">{curPct}%</strong>)
                              </p>

                              {loc && (
                                <button
                                  onClick={() => {
                                    onSelectLocation(loc);
                                    onClose();
                                  }}
                                  className="text-[11px] text-emerald-400 hover:underline font-semibold"
                                >
                                  View details →
                                </button>
                              )}
                            </div>

                            <button
                              onClick={() => onRemoveAlert(alert.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete alert"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {pastAlerts.length > 0 && (
                  <div className="pt-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                      Triggered History ({pastAlerts.length})
                    </div>
                    <div className="space-y-2">
                      {pastAlerts.map((alert) => {
                        const loc = locations.find((l) => l.id === alert.location_id);
                        return (
                          <div
                            key={alert.id}
                            className="p-3 rounded-xl bg-slate-950/40 border border-emerald-500/20 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <div>
                                <div className="font-semibold text-slate-300">
                                  {loc?.name || 'Space'} freed up
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  Triggered at &le; {alert.threshold_percentage}%
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => onRemoveAlert(alert.id)}
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
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
