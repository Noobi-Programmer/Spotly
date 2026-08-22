'use client';

import React, { useEffect } from 'react';
import { SpaceAlert, CampusLocation } from '@/types';
import { Bell, Navigation, X } from 'lucide-react';
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
          colors: ['#a6d29b', '#c5cc7b', '#e2e995', '#ffffff'],
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
      <div className="rounded-2xl p-5 bg-surface-container-high border-2 border-primary shadow-2xl shadow-primary/20 backdrop-blur-xl relative overflow-hidden">
        {/* Glowing aura */}
        <div className="absolute inset-0 bg-primary/10 pointer-events-none animate-pulse" />

        <div className="relative flex items-start gap-3.5">
          {/* Pulsing Bell Avatar */}
          <div className="w-11 h-11 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center shrink-0 shadow-lg shadow-tertiary/40 animate-bounce">
            <Bell className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="flex-1 pr-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container border border-primary font-sora">
                SPACE AVAILABLE NOW
              </span>
              <span className="text-xs font-bold text-primary font-mono">
                {occupancyPct}% full
              </span>
            </div>

            <h4 className="font-sora text-base font-bold text-on-surface leading-tight mb-1">
              {location.name} is ready!
            </h4>

            <p className="font-inter text-xs text-on-surface-variant leading-relaxed mb-3">
              Occupancy fell below your <strong className="text-on-surface font-sora">{alert.threshold_percentage}%</strong> target. Currently{' '}
              <strong className="text-primary font-sora">{availableSeats} seats</strong> are open in {location.building}.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onGoToSpace(location);
                  onDismiss();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Go to Space</span>
              </button>

              <button
                onClick={onDismiss}
                className="px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-sora font-semibold text-xs transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute top-0 right-0 p-1.5 rounded-full text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
