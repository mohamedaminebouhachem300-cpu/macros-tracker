'use client';

import React from 'react';
import { Home, Search, Calendar, Settings } from 'lucide-react';

export type TabType = 'home' | 'food' | 'daily' | 'goals';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TABS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'food', label: 'Food', icon: Search },
  { id: 'daily', label: 'Daily', icon: Calendar },
  { id: 'goals', label: 'Goals', icon: Settings },
];

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-t border-slate-800/60 safe-area-pb">
      <div className="max-w-md mx-auto h-20 flex items-center justify-around px-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center flex-1 gap-1 group relative py-2"
            >
              <div className={`
                p-2 rounded-2xl transition-all duration-300
                ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}
              `}>
                <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100 group-active:scale-90'}`} />
              </div>
              <span className={`
                text-[10px] font-bold uppercase tracking-widest transition-colors duration-300
                ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}
              `}>
                {tab.label}
              </span>
              
              {/* Active Indicator Dot */}
              {isActive && (
                <span className="absolute -top-1 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
