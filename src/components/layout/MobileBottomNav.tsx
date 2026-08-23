'use client';

import React from 'react';
import { Home, Compass, Sparkles, Bell, QrCode } from 'lucide-react';
import { useCampusStore } from '@/lib/store/useCampusStore';

interface MobileBottomNavProps {
  activeTab: 'cards' | 'map' | 'recommend' | 'alerts';
  onSelectTab: (tab: 'cards' | 'map' | 'recommend' | 'alerts') => void;
  activeAlertsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  activeAlertsCount,
}) => {
  const { activeTicket, setIsTicketModalOpen } = useCampusStore();

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40">
      {/* Floating Active Pass Strip if student has an active reservation */}
      {activeTicket && (
        <div className="px-4 pb-2">
          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="w-full py-2 px-3.5 rounded-2xl bg-gradient-to-r from-primary via-primary to-tertiary text-on-primary font-sora font-bold text-xs flex items-center justify-between shadow-xl shadow-primary/20 animate-pulse border border-primary-container cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              <span>Active Pass: {activeTicket.seat_number} (Table {activeTicket.table_number})</span>
            </div>
            <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-mono">
              TAP TO SHOW QR →
            </span>
          </button>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="bg-surface-container-high/95 backdrop-blur-xl border-t border-primary-container/80 px-2 py-2 safe-area-pb shadow-2xl">
        <div className="grid grid-cols-4 items-center gap-1 max-w-md mx-auto">
          {/* 1. Home / Spaces */}
          <button
            onClick={() => onSelectTab('cards')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'cards'
                ? 'text-primary font-bold bg-primary-container/40'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-sora tracking-tight">Home</span>
          </button>

          {/* 2. Explore (Radar Map) */}
          <button
            onClick={() => onSelectTab('map')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'text-primary font-bold bg-primary-container/40'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-sora tracking-tight">Explore</span>
          </button>

          {/* 3. Find (Brain / Instant Match) */}
          <button
            onClick={() => onSelectTab('recommend')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'recommend'
                ? 'text-tertiary font-bold bg-tertiary-container/40'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Sparkles className="w-5 h-5 text-tertiary" />
            <span className="text-[10px] font-sora tracking-tight">Find</span>
          </button>

          {/* 4. Alerts */}
          <button
            onClick={() => onSelectTab('alerts')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all relative cursor-pointer ${
              activeTab === 'alerts'
                ? 'text-primary font-bold bg-primary-container/40'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-error text-on-error font-mono text-[9px] font-bold flex items-center justify-center">
                  {activeAlertsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-sora tracking-tight">Alerts</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
