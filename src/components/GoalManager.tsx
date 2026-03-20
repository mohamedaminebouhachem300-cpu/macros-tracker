'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMacroContext } from '@/context/MacroContext';
import { Settings2 } from 'lucide-react';

const MIN_GRAMS = 10;

export default function GoalManager() {
  const { userGoals, updateUserGoals } = useMacroContext();
  
  // Local state for goals before saving
  const [calories, setCalories] = useState(userGoals.calories);
  const [protein, setProtein] = useState(userGoals.protein);
  const [carbs, setCarbs] = useState(userGoals.carbs);
  const [fats, setFats] = useState(userGoals.fats);

  // Track which two sliders were touched last. The one NOT in this list is the "victim".
  // Initial order: we assume protein and carbs were "touched", fats is the victim.
  const [lastUpdated, setLastUpdated] = useState<('protein' | 'carbs' | 'fats')[]>(['protein', 'carbs']);

  // Sync local state when global userGoals change (e.g., on initial load)
  useEffect(() => {
    setCalories(userGoals.calories);
    setProtein(userGoals.protein);
    setCarbs(userGoals.carbs);
    setFats(userGoals.fats);
  }, [userGoals]);

  const calculatePercentages = () => {
    if (calories <= 0) return { p: 0, c: 0, f: 0 };
    const p = Math.round((protein * 4 / calories) * 100);
    const c = Math.round((carbs * 4 / calories) * 100);
    const f = Math.round((fats * 9 / calories) * 100);
    
    // Ensure they sum to 100% despite rounding
    const total = p + c + f;
    if (total !== 100 && total > 0) {
      // Adjust the largest one to make it 100
      const diff = 100 - total;
      if (p >= c && p >= f) return { p: p + diff, c, f };
      if (c >= p && c >= f) return { p, c: c + diff, f };
      return { p, c, f: f + diff };
    }
    return { p, c, f };
  };

  const { p: proteinPct, c: carbsPct, f: fatsPct } = calculatePercentages();

  const handleMacroChange = (type: 'protein' | 'carbs' | 'fats', newVal: number) => {
    // 1. Identify roles
    // The "victim" is the macro not in lastUpdated and not the current "type"
    const others = ['protein', 'carbs', 'fats'].filter(m => m !== type) as ('protein' | 'carbs' | 'fats')[];
    const victim = others.find(m => !lastUpdated.includes(m)) || others[0];
    const secondRecent = others.find(m => m !== victim)!;

    // 2. Calculate current calorie allocation
    const currentVals = { protein, carbs, fats };
    const multipliers = { protein: 4, carbs: 4, fats: 9 };
    
    // 3. New value for the adjusted macro
    let finalNewVal = newVal;
    
    // 4. Calculate remaining calories for the other two
    const remainingAfterNew = calories - (finalNewVal * multipliers[type]);
    
    // We need to distribute 'remainingAfterNew' between victim and secondRecent
    // BUT we want to keep secondRecent fixed as much as possible.
    
    let victimVal = (remainingAfterNew - (currentVals[secondRecent] * multipliers[secondRecent])) / multipliers[victim];
    let secondRecentVal = currentVals[secondRecent];

    // 5. Apply Hard Constraints (Ceiling/Floor)
    // If victim drops below 10g, we must take from secondRecent
    if (victimVal < MIN_GRAMS) {
      victimVal = MIN_GRAMS;
      secondRecentVal = (remainingAfterNew - (victimVal * multipliers[victim])) / multipliers[secondRecent];
      
      // If secondRecent also drops below 10g, we must cap the original adjustment
      if (secondRecentVal < MIN_GRAMS) {
        secondRecentVal = MIN_GRAMS;
        // Recalculate original newVal to be the maximum possible
        finalNewVal = (calories - (victimVal * multipliers[victim]) - (secondRecentVal * multipliers[secondRecent])) / multipliers[type];
      }
    }

    // 6. Update State
    const updates = {
      [type]: Math.round(finalNewVal),
      [victim]: Math.round(victimVal),
      [secondRecent]: Math.round(secondRecentVal)
    };

    setProtein(updates.protein ?? protein);
    setCarbs(updates.carbs ?? carbs);
    setFats(updates.fats ?? fats);

    // 7. Update lastUpdated: [penultimate, latest]
    setLastUpdated(prev => {
      if (prev[1] === type) return prev; // Already most recent
      return [prev[1], type];
    });
  };

  const handleCalorieChange = (newCals: number) => {
    setCalories(newCals);
    // When calories change, we keep the ratios the same
    const currentTotal = (protein * 4) + (carbs * 4) + (fats * 9);
    const scale = newCals / currentTotal;
    
    setProtein(prev => Math.max(MIN_GRAMS, Math.round(prev * scale)));
    setCarbs(prev => Math.max(MIN_GRAMS, Math.round(prev * scale)));
    setFats(prev => Math.max(MIN_GRAMS, Math.round(prev * scale)));
  };

  const handleSave = () => {
    updateUserGoals({
      calories,
      protein,
      carbs,
      fats
    });
  };

  // Helper for slider max values (Ceiling Rule)
  // Max for a macro is: (Total - (Other1_Min * Multi1) - (Other2_Min * Multi2)) / MultiSelf
  const getMax = (type: 'protein' | 'carbs' | 'fats') => {
    const multipliers = { protein: 4, carbs: 4, fats: 9 };
    const others = (['protein', 'carbs', 'fats'] as const).filter(m => m !== type);
    const othersMinCal = others.reduce((acc, m) => acc + (MIN_GRAMS * multipliers[m]), 0);
    return Math.floor((calories - othersMinCal) / multipliers[type]);
  };

  return (
    <div className="bg-[#1e293b] p-5 rounded-[16px] shadow-xl border border-slate-700/40">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-[#0f172a] rounded-xl border border-slate-700/30">
          <Settings2 className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Goals</h2>
          <p className="text-sm text-slate-400">Set your daily nutrition targets</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* CALORIES */}
        <div className="bg-[#0f172a] p-4 rounded-[12px] border border-slate-700/30">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Daily Calorie Target</p>
          <div className="flex justify-between items-end mb-4">
            <span className="text-lg font-bold text-slate-200">Calories</span>
            <span className="text-2xl font-black text-white">{calories.toLocaleString()} <span className="text-sm text-slate-400">kcal</span></span>
          </div>
          
          <input 
            type="range" min="1200" max="4000" step="50"
            value={calories}
            onChange={(e) => handleCalorieChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-slate-500 font-mono mt-2">
            <span>1,200 kcal</span>
            <span>4,000 kcal</span>
          </div>
        </div>

        {/* MACROS */}
        <div className="bg-[#0f172a] p-4 rounded-[12px] border border-slate-700/30">
          <div className="flex justify-between items-center mb-6 border-b border-slate-700/30 pb-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Macro Split (Grams)</span>
            <div className="flex gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Automatic: </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md border border-emerald-400/20 capitalize">
                {['protein', 'carbs', 'fats'].find(m => !lastUpdated.includes(m as any))}
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {/* PROTEIN */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-200">Protein</span>
                  <span className="text-[10px] text-slate-400 font-mono">4 kcal/g • {proteinPct}%</span>
                </div>
                <span className="text-2xl font-black text-white">{protein} <span className="text-sm text-slate-400 font-normal">g</span></span>
              </div>
              <input 
                type="range" min={MIN_GRAMS} max={getMax('protein')} step="1"
                value={protein}
                onChange={(e) => handleMacroChange('protein', Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono mt-2 text-slate-500 uppercase">
                <span>{MIN_GRAMS}g</span>
                <span>{getMax('protein')}g</span>
              </div>
            </div>

            {/* CARBS */}
            <div className="pt-4 border-t border-slate-700/30">
              <div className="flex justify-between items-center mb-3">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-200">Carbs</span>
                  <span className="text-[10px] text-slate-400 font-mono">4 kcal/g • {carbsPct}%</span>
                </div>
                <span className="text-2xl font-black text-white">{carbs} <span className="text-sm text-slate-400 font-normal">g</span></span>
              </div>
              <input 
                type="range" min={MIN_GRAMS} max={getMax('carbs')} step="1"
                value={carbs}
                onChange={(e) => handleMacroChange('carbs', Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] font-mono mt-2 text-slate-500 uppercase">
                <span>10g</span>
                <span>{getMax('carbs')}g</span>
              </div>
            </div>

            {/* FATS */}
            <div className="pt-4 border-t border-slate-700/30">
              <div className="flex justify-between items-center mb-3">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-200">Fats</span>
                  <span className="text-[10px] text-slate-400 font-mono">9 kcal/g • {fatsPct}%</span>
                </div>
                <span className="text-2xl font-black text-white">{fats} <span className="text-sm text-slate-400 font-normal">g</span></span>
              </div>
              <input 
                type="range" min={MIN_GRAMS} max={getMax('fats')} step="1"
                value={fats}
                onChange={(e) => handleMacroChange('fats', Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] font-mono mt-2 text-slate-500 uppercase">
                <span>10g</span>
                <span>{getMax('fats')}g</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 rounded-[12px] transition-all shadow-lg shadow-emerald-500/20 text-lg active:scale-[0.98]"
        >
          Save Goals
        </button>
      </div>
    </div>
  );
}
