'use client';

import React, { useState, useEffect } from 'react';
import { useMacroContext } from '@/context/MacroContext';
import { Settings2 } from 'lucide-react';

export default function GoalManager() {
  const { userGoals, updateUserGoals } = useMacroContext();
  
  // Local state for sliders before saving
  const [calories, setCalories] = useState(userGoals.calories);
  
  // Macros in Grams
  const [protein, setProtein] = useState(userGoals.protein);
  const [carbs, setCarbs] = useState(userGoals.carbs);
  const [fats, setFats] = useState(userGoals.fats);

  // Track the order of slider moves to determine which one is the "automatic" third
  // The first element is the "remainder" macro (the victim)
  const [touchedOrder, setTouchedOrder] = useState<('protein' | 'carbs' | 'fats')[]>(['fats', 'carbs', 'protein']);

  // Initialize grams from context
  useEffect(() => {
    setProtein(userGoals.protein);
    setCarbs(userGoals.carbs);
    setFats(userGoals.fats);
    setCalories(userGoals.calories);
  }, [userGoals]);

  const handleMacroChange = (type: 'protein' | 'carbs' | 'fats', newVal: number) => {
    const multipliers: Record<'protein' | 'carbs' | 'fats', number> = { protein: 4, carbs: 4, fats: 9 };
    const current: Record<'protein' | 'carbs' | 'fats', number> = { protein, carbs, fats };
    
    // 1. Determine "victim" macro
    const remainder = touchedOrder.find((m: 'protein' | 'carbs' | 'fats') => m !== type)!;
    const other = touchedOrder.find((m: 'protein' | 'carbs' | 'fats') => m !== type && m !== remainder)!;

    // 2. Calculate constraints
    const otherCal = current[other] * multipliers[other];
    const availableCal = calories - otherCal;
    const minRemainderGrams = 10;
    const minRemainderCal = minRemainderGrams * multipliers[remainder];
    
    const maxTypeCal = availableCal - minRemainderCal;
    const maxTypeGrams = Math.floor(maxTypeCal / multipliers[type]);

    // 3. Clamp new value
    let finalTypeVal = Math.max(10, Math.min(newVal, maxTypeGrams));
    const typeCal = finalTypeVal * multipliers[type];

    // 4. Calculate remainder
    const finalRemainderCal = calories - otherCal - typeCal;
    const finalRemainderVal = Math.max(10, Math.round(finalRemainderCal / multipliers[remainder]));

    // 5. Update State
    if (type === 'protein') setProtein(finalTypeVal);
    if (type === 'carbs') setCarbs(finalTypeVal);
    if (type === 'fats') setFats(finalTypeVal);

    if (remainder === 'protein') setProtein(finalRemainderVal);
    if (remainder === 'carbs') setCarbs(finalRemainderVal);
    if (remainder === 'fats') setFats(finalRemainderVal);

    // 6. Update Touched Order
    setTouchedOrder((prev: ('protein' | 'carbs' | 'fats')[]) => {
      const filtered = prev.filter((m: string) => m !== type);
      return [...filtered, type];
    });
  };

  const handleSave = () => {
    updateUserGoals({
      calories,
      protein,
      carbs,
      fats
    });
  };

  const currentTotalCal = (protein * 4) + (carbs * 4) + (fats * 9);
  const pPct = Math.round((protein * 4 / calories) * 100);
  const cPct = Math.round((carbs * 4 / calories) * 100);
  const fPct = 100 - pPct - cPct; // Ensure it sums to 100 roughly

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
            onChange={(e) => setCalories(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 font-mono mt-2">
            <span>1,200 kcal</span>
            <span>4,000 kcal</span>
          </div>
        </div>

        {/* MACROS */}
        <div className="bg-[#0f172a] p-4 rounded-[12px] border border-slate-700/30">
          <div className="flex justify-between items-center mb-6 border-b border-slate-700/30 pb-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Macro Split</span>
            <span className={`text-xs font-bold ${Math.abs(currentTotalCal - calories) < 10 ? 'text-emerald-500' : 'text-rose-500'} bg-[#1e293b] px-2.5 py-1 rounded-md border border-slate-700/40`}>
              {currentTotalCal} / {calories} kcal
            </span>
          </div>

          <div className="space-y-8">
            {/* PROTEIN */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-slate-200">Protein</span>
                <span className="text-2xl font-black text-white">{protein}g <span className="text-sm text-slate-400">({pPct}%)</span></span>
              </div>
              <input 
                type="range" min="10" max={Math.floor((calories - 40 - 90) / 4)} step="1"
                value={protein}
                onChange={(e) => handleMacroChange('protein', Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-xs font-mono mt-3 uppercase tracking-wider">
                <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">{protein * 4} kcal</span>
                <span className="text-slate-500">{Math.floor((calories - 40 - 90) / 4)}g max</span>
              </div>
            </div>

            {/* CARBS */}
            <div className="pt-4 border-t border-slate-700/30">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-slate-200">Carbs</span>
                <span className="text-2xl font-black text-white">{carbs}g <span className="text-sm text-slate-400">({cPct}%)</span></span>
              </div>
              <input 
                type="range" min="10" max={Math.floor((calories - 40 - 90) / 4)} step="1"
                value={carbs}
                onChange={(e) => handleMacroChange('carbs', Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-xs font-mono mt-3 uppercase tracking-wider">
                <span className="text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">{carbs * 4} kcal</span>
                <span className="text-slate-500">{Math.floor((calories - 40 - 90) / 4)}g max</span>
              </div>
            </div>

            {/* FATS */}
            <div className="pt-4 border-t border-slate-700/30">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-slate-200">Fats</span>
                <span className="text-2xl font-black text-white">{fats}g <span className="text-sm text-slate-400">({fPct}%)</span></span>
              </div>
              <input 
                type="range" min="10" max={Math.floor((calories - 40 - 40) / 9)} step="1"
                value={fats}
                onChange={(e) => handleMacroChange('fats', Number(e.target.value))}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-xs font-mono mt-3 uppercase tracking-wider">
                <span className="text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md">{fats * 9} kcal</span>
                <span className="text-slate-500">{Math.floor((calories - 40 - 40) / 9)}g max</span>
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
