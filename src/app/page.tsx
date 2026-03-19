'use client';

import React, { useState } from 'react';
import { MacroProvider } from '@/context/MacroContext';
import FoodSearch from '@/components/FoodSearch';
import MealJournal from '@/components/MealJournal';
import Dashboard from '@/components/Dashboard';
import GoalManager from '@/components/GoalManager';
import BottomNav, { TabType } from '@/components/BottomNav';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  return (
    <MacroProvider>
      <main className="min-h-screen bg-[#0f172a] text-slate-50 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-4 md:p-8 pb-32">
          <header className="flex flex-col gap-2 pb-6 border-b border-slate-800/60 mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500">
              Macro Tracker
            </h1>
            <p className="text-slate-400 text-lg font-medium">Precision daily nutrition logging.</p>
          </header>

          <div className="animate-fade-in-up">
            {activeTab === 'home' && <Dashboard />}
            {activeTab === 'food' && <FoodSearch />}
            {activeTab === 'daily' && <MealJournal />}
            {activeTab === 'goals' && <GoalManager />}
          </div>
        </div>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </MacroProvider>
  );
}
