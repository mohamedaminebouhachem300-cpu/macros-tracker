'use client';

import React, { useState, useEffect } from 'react';
import { useMacroContext } from '@/context/MacroContext';
import { Settings2 } from 'lucide-react';

const MIN_VALUE = 10; 

export default function GoalManager() {
  const { userGoals, updateUserGoals } = useMacroContext();
  
  const [calories, setCalories] = useState(userGoals.calories);
  
  // Macros in Grams
  const [protein, setProtein] = useState(userGoals.protein);
  const [carbs, setCarbs] = useState(userGoals.carbs);
  const [fats, setFats] = useState(userGoals.fats);

  const [lastUpdated, setLastUpdated] = useState<('protein' | 'carbs' | 'fats')[]>(['protein', 'carbs']);

  useEffect(() => {
    setProtein(userGoals.protein);
    setCarbs(userGoals.carbs);
    setFats(userGoals.fats);
    setCalories(userGoals.calories);
  }, [userGoals]);

  const calculatePercentages = () => {
    if (calories <= 0) return { p: 0, c: 0, f: 0 };
    const p = Math.round((protein * 4 / calories) * 100);
    const c = Math.round((carbs * 4 / calories) * 100);
    const f = Math.round((fats * 9 / calories) * 100);
    
    const total = p + c + f;
    if (total !== 100 && total > 0) {
      const diff = 100 - total;
      if (p >= c && p >= f) return { p: p + diff, c, f };
      if (c >= p && c >= f) return { p, c: c + diff, f };
      return { p, c, f: f + diff };
    }
    return { p, c, f };
  };

  const { p: proteinPct, c: carbsPct, f: fatsPct } = calculatePercentages();

  const handleMacroChange = (type: 'protein' | 'carbs' | 'fats', newVal: number) => {
    const multipliers: Record<'protein' | 'carbs' | 'fats', number> = { protein: 4, carbs: 4, fats: 9 };
    const maxPossible = Math.floor(calories / multipliers[type]);
    const finalNewVal = Math.min(newVal, maxPossible);

    const others = (['protein', 'carbs', 'fats'] as const).filter(m => m !== type);
    const victim = others.find(m => !lastUpdated.includes(m)) || others[0];
    const secondRecent = others.find(m => m !== victim)!;

    const currentVals = { protein, carbs, fats };
    const remainingAfterNew = calories - (finalNewVal * multipliers[type]);
    
    let victimVal = (remainingAfterNew - (currentVals[secondRecent] * multipliers[secondRecent])) / multipliers[victim];
    let secondRecentVal = currentVals[secondRecent];

    if (victimVal < MIN_VALUE) {
      victimVal = MIN_VALUE;
      secondRecentVal = (remainingAfterNew - (victimVal * multipliers[victim])) / multipliers[secondRecent];
      if (secondRecentVal < MIN_VALUE) secondRecentVal = MIN_VALUE;
    }

    setProtein(type === 'protein' ? Math.round(finalNewVal) : (victim === 'protein' ? Math.round(victimVal) : Math.round(secondRecentVal)));
    setCarbs(type === 'carbs' ? Math.round(finalNewVal) : (victim === 'carbs' ? Math.round(victimVal) : Math.round(secondRecentVal)));
    setFats(type === 'fats' ? Math.round(finalNewVal) : (victim === 'fats' ? Math.round(victimVal) : Math.round(secondRecentVal)));

    setLastUpdated(prev => (prev[1] === type ? prev : [prev[1], type]));
  };

  const handleCalorieChange = (newCals: number) => {
    const safeCals = Math.max(500, newCals); // Minimum 500 to keep macros logical
    setCalories(safeCals);
    const currentTotal = (protein * 4) + (carbs * 4) + (fats * 9);
    const scale = safeCals / currentTotal;
    
    setProtein(prev => Math.max(MIN_VALUE, Math.round(prev * scale)));
    setCarbs(prev => Math.max(MIN_VALUE, Math.round(prev * scale)));
    setFats(prev => Math.max(MIN_VALUE, Math.round(prev * scale)));
  };

  const handleSave = () => {
    updateUserGoals({ calories, protein, carbs, fats });
  };

  const getMax = (type: 'protein' | 'carbs' | 'fats') => {
    const multipliers: Record<'protein' | 'carbs' | 'fats', number> = { protein: 4, carbs: 4, fats: 9 };
    const others = (['protein', 'carbs', 'fats'] as const).filter(m => m !== type);
    const othersMinCal = others.reduce((acc, m) => acc + (MIN_VALUE * multipliers[m]), 0);
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
        {/* Calorie Section with Input */}
        <div className="bg-[#0f172a] p-4 rounded-[12px] border border-slate-700/30">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Daily Calorie Target</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold text-slate-200">Calories</span>
            <div className="flex items-baseline gap-2">
              <input 
                type="number"
                value={calories}
                onChange={(e) => handleCalorieChange(Number(e.target.value))}
                className="bg-transparent text-right text-2xl font-black text-white w-24 outline-none border-b border-emerald-500/50 focus:border-emerald-500"
              />
              <span className="text-sm text-slate-400 font-normal">kcal</span>
            </div>
          </div>
          <input 
            type="range" min="500" max="10000" step="50"
            value={calories}
            onChange={(e) => handleCalorieChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Macros Section */}
        <div className="bg-[#0f172a] p-4 rounded-[12px] border border-slate-700/30">
          <div className="space-y-8">
            {/* Protein */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-slate-200">Protein ({proteinPct}%)</span>
                <span className="text-2xl font-black text-white">{protein}g</span>
              </div>
              <input 
                type="range" min={MIN_VALUE} max={getMax('protein')} step="1"
                value={protein}
                onChange={(e) => handleMacroChange('protein', Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Carbs */}
            <div className="pt-4 border-t border-slate-700/30">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-slate-200">Carbs ({carbsPct}%)</span>
                <span className="text-2xl font-black text-white">{carbs}g</span>
              </div>
              <input 
                type="range" min={MIN_VALUE} max={getMax('carbs')} step="1"
                value={carbs}
                onChange={(e) => handleMacroChange('carbs', Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Fats */}
            <div className="pt-4 border-t border-slate-700/30">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-slate-200">Fats ({fatsPct}%)</span>
                <span className="text-2xl font-black text-white">{fats}g</span>
              </div>
              <input 
                type="range" min={MIN_VALUE} max={getMax('fats')} step="1"
                value={fats}
                onChange={(e) => handleMacroChange('fats', Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-[12px] transition-all text-lg"
        >
          Save Goals
        </button>
      </div>
    </div>
  );
}