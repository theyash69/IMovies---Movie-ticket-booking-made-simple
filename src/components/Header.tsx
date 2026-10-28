import React from 'react';
import { AppNavTab } from '../types';
import { Ticket } from 'lucide-react';

interface HeaderProps {
  activeTab: AppNavTab;
  setActiveTab: (tab: AppNavTab) => void;
  bookingCount: number;
  onOpenMyBookings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  bookingCount,
  onOpenMyBookings,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('cinema')}
          className="text-xl font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
        >
          <span className="text-cyan-500 font-extrabold text-2xl tracking-tighter">I</span>
          <span>MOVIES</span>
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('cinema')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'cinema'
                ? 'text-white border-cyan-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Cinema
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'architecture'
                ? 'text-white border-cyan-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => setActiveTab('er-diagram')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'er-diagram'
                ? 'text-white border-cyan-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            ER Diagram
          </button>
          <button
            onClick={() => setActiveTab('mvc-model')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'mvc-model'
                ? 'text-white border-cyan-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            MVC Model
          </button>
          <button
            onClick={() => setActiveTab('system-flow')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'system-flow'
                ? 'text-white border-cyan-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            System Flow
          </button>
          <button
            onClick={() => setActiveTab('features-setup')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'features-setup'
                ? 'text-white border-cyan-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Setup Guide
          </button>
          <button
            onClick={() => setActiveTab('demo-video')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'demo-video'
                ? 'text-white border-cyan-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Demo Video
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenMyBookings}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer shadow-sm shadow-cyan-500/20"
          >
            <Ticket className="w-4 h-4" />
            <span>My Bookings</span>
            {bookingCount > 0 && (
              <span className="bg-slate-950 text-cyan-300 text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {bookingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav bar for smaller screens */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-xs">
        {(
          [
            ['cinema', 'Cinema'],
            ['architecture', 'Architecture'],
            ['er-diagram', 'ER Diagram'],
            ['mvc-model', 'MVC Model'],
            ['system-flow', 'Flows'],
            ['features-setup', 'Setup Guide'],
            ['demo-video', 'Demo Video'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              activeTab === key
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
};
