'use client';

import React, { useState } from 'react';
import { CampusLocation } from '@/types';
import { X, Eye, ShieldCheck, Check } from 'lucide-react';
import { OccupancyBadge } from '../spaces/OccupancyBadge';

interface NotifyModalProps {
  location: CampusLocation | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateAlert: (locationId: string, threshold: number) => void;
}

export const NotifyModal: React.FC<NotifyModalProps> = ({
  location,
  isOpen,
  onClose,
  onCreateAlert,
}) => {
  const [threshold, setThreshold] = useState<number>(50); // Default to 50%
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !location) return null;

  const presetOptions = [
    { label: 'Below 70%', value: 70, desc: 'Moderate crowd' },
    { label: 'Below 50%', value: 50, desc: 'Half full (Recommended)' },
    { label: 'Below 30%', value: 30, desc: 'Spacious study' },
    { label: 'Available', value: 20, desc: 'Plenty of seats free' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAlert(location.id, threshold);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container-lowest/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface-container-high border-2 border-primary-container shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-tertiary-container text-tertiary border border-tertiary/40">
            <Eye className="w-5 h-5 text-tertiary" />
          </div>
          <div>
            <h3 className="font-sora text-lg sm:text-xl font-bold text-on-surface tracking-tight">
              Watch This Space
            </h3>
            <p className="text-xs text-on-surface-variant font-inter">
              Tell us when you&apos;d like to know.
            </p>
          </div>
        </div>

        {/* Target Space Summary */}
        <div className="p-4 rounded-xl bg-surface-container border border-primary-container/70 mb-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-sora text-sm font-bold text-on-surface">{location.name}</h4>
            <span className="text-xs text-on-surface-variant font-inter">
              {location.building} • {location.floor}
            </span>
          </div>
          <OccupancyBadge
            currentOccupancy={location.current_occupancy}
            capacity={location.capacity}
            trend={location.trend}
          />
        </div>

        {/* Alert Threshold Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2.5 font-sora">
              Notify me when occupancy drops:
            </label>

            {/* 4 Standard Preset Options */}
            <div className="grid grid-cols-2 gap-2.5">
              {presetOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setThreshold(opt.value)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    threshold === opt.value
                      ? 'bg-tertiary-container border-tertiary text-on-surface shadow-sm'
                      : 'bg-surface-container border-primary-container/70 text-on-surface-variant hover:border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sora text-sm font-bold text-on-surface">{opt.label}</span>
                    {threshold === opt.value && (
                      <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                    )}
                  </div>
                  <span className="text-[10px] text-on-surface-variant mt-1 font-inter">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Slider Toggle */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1.5 font-inter">
              <span>Fine-tune threshold:</span>
              <span className="font-mono font-bold text-tertiary">&le; {threshold}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={85}
              step={5}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              aria-label="Custom Occupancy Threshold Percentage"
              className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-[#c5cc7b]"
            />
          </div>

          <div className="p-3 rounded-xl bg-surface-container border border-primary-container/60 text-[11px] text-on-surface-variant flex items-start gap-2 font-inter">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              Spotly will watch <strong>{location.name}</strong> and trigger an instant notification the
              moment occupancy falls to <strong>{threshold}%</strong> or below.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-sora font-semibold text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={savedSuccess}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-sora font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer ${
                savedSuccess
                  ? 'bg-primary text-on-primary'
                  : 'bg-tertiary hover:bg-tertiary-fixed text-on-tertiary shadow-tertiary/20'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Watch Saved!</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Start Watching</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
