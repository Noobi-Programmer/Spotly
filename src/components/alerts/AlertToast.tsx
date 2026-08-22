'use client';

import React, { useEffect } from 'react';
import { SpaceAlert, CampusLocation } from '@/types';
import { Bell, Navigation, X, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AlertToastProps {
  data: {
    alert: SpaceAlert;
    location: CampusLocation;
    occupancyPct: number;
  } | null;
  onDismiss: () => void;
  onGoToSpace: (location: CampusLocation) => void;
}

export const AlertToast: React.FC<AlertToastProps> = ({
  data,
  onDismiss,
  onGoToSpace,
}) => {
  useEffect(() => {
    if (data) {
      // Fire confetti celebration when alert condition triggers!
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.15 },
          colors: ['#10b981', '#38bdf8', '#fbbf24', '#ffffff'],
        });
      } catch (err) {
        // confetti fallback
      }
    }
  }, [data]);

  if (!data) return null;

  const { alert, location, occupancyPct } = data;
  const availableSeats = Math.max(0, location.capacity - location.current_occupancy);

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg animate-in slide-in-from-top-6 duration-300">
      <div className="rounded-3xl p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-2 border-emerald-400 shadow-2xl shadow-emerald-500/30 backdrop-blur-xl relative overflow-hidden">
        {/* Glowing aura */}
        <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse" />

        <div className="relative flex items-start gap-3.5">
          {/* Pulsing Bell Avatar */}
          <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/40 animate-bounce">
            <Bell className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="flex-1 pr-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                SPACE AVAILABLE NOW
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {occupancyPct}% full
              </span>
            </div>

            <h4 className="text-base font-black text-white leading-tight mb-1">
              {location.name} is ready!
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Occupancy fell below your <strong>{alert.threshold_percentage}%</strong> target. Currently{' '}
              <strong className="text-emerald-400">{availableSeats} seats</strong> are open in {location.building}.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onGoToSpace(location);
                  onDismiss();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Go to Space</span>
              </button>

              <button
                onClick={onDismiss}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute top-0 right-0 p-1.5 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
