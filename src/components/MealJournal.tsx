'use client';

import React from 'react';
import { useMacroContext } from '@/context/MacroContext';
import { MealCategory } from '@/types/food';
import { Coffee, Sun, Moon, Popcorn, X } from 'lucide-react';

const MEALS: { name: MealCategory; icon: React.ReactNode; time: string }[] = [
  { name: 'Breakfast', icon: <Coffee className="w-5 h-5 text-amber-400" />, time: '6:00 - 10:00 AM' },
  { name: 'Lunch',     icon: <Sun className="w-5 h-5 text-yellow-400" />,    time: '11:00 AM - 2:00 PM' },
  { name: 'Dinner',    icon: <Moon className="w-5 h-5 text-indigo-400" />,   time: '6:00 - 9:00 PM' },
  { name: 'Snack',     icon: <Popcorn className="w-5 h-5 text-rose-400" />,  time: 'Anytime' },
];

export default function MealJournal() {
  const { dailyLog, removeLogEntry } = useMacroContext();

  const today = new Date().toISOString().split('T')[0];
  const todaysLog = dailyLog.filter(entry => entry.date === today);
  
  const entriesByMeal = MEALS.map(meal => ({
    ...meal,
    items: todaysLog.filter(e => e.meal_category === meal.name),
  }));

  const dailyTotals = todaysLog.reduce(
    (acc, entry) => {
      acc.calories += entry.calculated_macros.calories;
      acc.protein += entry.calculated_macros.protein;
      acc.carbs += entry.calculated_macros.carbs;
      acc.fats += entry.calculated_macros.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <div className="bg-[#1e293b] p-5 md:p-6 rounded-[16px] shadow-xl border border-slate-700/40 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Daily Breakdown</h2>
          <p className="text-sm text-slate-400">Today&apos;s meal timeline</p>
        </div>
      </div>

      {/* Daily Totals Bar */}
      <div className="bg-[#0f172a] rounded-[12px] p-4 border border-slate-700/30">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Daily Totals</p>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <span className="text-2xl font-black text-white">{Math.round(dailyTotals.calories)}</span>
            <p className="text-[10px] text-slate-500 font-medium mt-1">kcal</p>
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-400">{Math.round(dailyTotals.protein)}g</span>
            <p className="text-[10px] text-emerald-600 font-medium mt-1">Protein</p>
          </div>
          <div>
            <span className="text-2xl font-black text-amber-400">{Math.round(dailyTotals.carbs)}g</span>
            <p className="text-[10px] text-amber-600 font-medium mt-1">Carbs</p>
          </div>
          <div>
            <span className="text-2xl font-black text-rose-400">{Math.round(dailyTotals.fats)}g</span>
            <p className="text-[10px] text-rose-600 font-medium mt-1">Fats</p>
          </div>
        </div>
      </div>

      {/* Meal Sections */}
      <div className="space-y-4">
        {entriesByMeal.map(mealGroup => {
          const mealCals = mealGroup.items.reduce((s, e) => s + e.calculated_macros.calories, 0);

          return (
            <div key={mealGroup.name} className="bg-[#0f172a] rounded-[12px] p-4 border border-slate-700/30">
              {/* Meal Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-700/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1e293b] rounded-xl border border-slate-700/30">
                    {mealGroup.icon}
                  </div>
                  <div>
                    <span className="font-bold text-slate-200">{mealGroup.name}</span>
                    <p className="text-[10px] text-slate-500 font-mono">{mealGroup.time}</p>
                  </div>
                </div>
                {mealGroup.items.length > 0 && (
                  <span className="text-lg font-black text-slate-300 font-mono">{Math.round(mealCals)} <span className="text-xs text-slate-500 font-normal">kcal</span></span>
                )}
              </div>

              {/* Entries */}
              <div className="space-y-2">
                {mealGroup.items.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-700/50 rounded-[12px] py-8 px-4 flex flex-col items-center justify-center gap-2">
                    <span className="text-slate-600 text-lg">🍽️</span>
                    <span className="text-xs text-slate-600 font-medium">No items added yet</span>
                  </div>
                ) : (
                  mealGroup.items.map(entry => (
                    <div 
                      key={entry.id} 
                      className="animate-fade-in-up bg-[#1e293b] p-3 rounded-[12px] border border-slate-700/30 relative group hover:border-slate-600/60 transition-colors"
                    >
                      <button 
                        onClick={() => removeLogEntry(entry.id)}
                        className="absolute top-2.5 right-2.5 text-slate-600 hover:text-rose-400 opacity-40 hover:opacity-100 transition-all bg-[#0f172a] rounded-full p-1.5 hover:bg-rose-500/10"
                        aria-label="Remove item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex gap-4 items-center">
                        <span className="text-4xl leading-none drop-shadow-md">{entry.food.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-slate-200 text-sm truncate">{entry.food.english_name}</span>
                            <span className="text-xs font-mono text-slate-500 shrink-0">{entry.weight_g}g</span>
                          </div>
                          <div className="flex gap-3 mt-2 text-[11px] font-bold">
                            <span className="text-slate-400">{Math.round(entry.calculated_macros.calories)} kcal</span>
                            <span className="text-emerald-500">P: {Math.round(entry.calculated_macros.protein)}g</span>
                            <span className="text-amber-500">C: {Math.round(entry.calculated_macros.carbs)}g</span>
                            <span className="text-rose-500">F: {Math.round(entry.calculated_macros.fats)}g</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
