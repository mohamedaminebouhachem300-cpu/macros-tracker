'use client';

import React, { useState, useEffect } from 'react';
import { useMacroContext } from '@/context/MacroContext';
import { Settings2 } from 'lucide-react';

export default function GoalManager() {
  const { userGoals, updateUserGoals } = useMacroContext();
  
  // Local state for sliders before saving
  const [calories, setCalories] = useState(userGoals.calories);
  
  // Percentages
  const [proteinPct, setProteinPct] = useState(30);
  const [carbsPct, setCarbsPct] = useState(40);
  const [fatsPct, setFatsPct] = useState(30);

  // Initialize percentages from absolute goals if possible
  useEffect(() => {
    if (userGoals.calories > 0) {
      const p = Math.round((userGoals.protein * 4 / userGoals.calories) * 100);
      const c = Math.round((userGoals.carbs * 4 / userGoals.calories) * 100);
      const f = Math.round((userGoals.fats * 9 / userGoals.calories) * 100);
      setProteinPct(p); setCarbsPct(c); setFatsPct(f);
      setCalories(userGoals.calories);
    }
  }, [userGoals]);

  const handlePctChange = (type: 'protein' | 'carbs' | 'fats', val: number) => {
    // Optional: auto-balance the other two, but for simplicity we just allow manual balancing or limit it.
    // We'll just set it.
    if (type === 'protein') setProteinPct(val);
    if (type === 'carbs') setCarbsPct(val);
    if (type === 'fats') setFatsPct(val);
  };

  const handleSave = () => {
    const proteinGrams = Math.round((calories * (proteinPct / 100)) / 4);
    const carbsGrams = Math.round((calories * (carbsPct / 100)) / 4);
    const fatsGrams = Math.round((calories * (fatsPct / 100)) / 9);

    updateUserGoals({
      calories,
      protein: proteinGrams,
      carbs: carbsGrams,
      fats: fatsGrams
    });
  };

  const totalPct = proteinPct + carbsPct + fatsPct;

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
            <span className={`text-xs font-bold ${totalPct === 100 ? 'text-emerald-500' : 'text-rose-500'} bg-[#1e293b] px-2.5 py-1 rounded-md border border-slate-700/40`}>
              {totalPct}% / 100%
            </span>
          </div>

          <div className="space-y-8">
            {/* PROTEIN */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-slate-200">Protein</span>
                <span className="text-2xl font-black text-white">{proteinPct}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="5"
                value={proteinPct}
                onChange={(e) => handlePctChange('protein', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs font-mono mt-3 uppercase tracking-wider">
                <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">≈ {Math.round((calories * (proteinPct / 100)) / 4)}g per day</span>
                <span className="text-slate-500">100%</span>
              </div>
            </div>

            {/* CARBS */}
            <div className="pt-4 border-t border-slate-700/30">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-slate-200">Carbs</span>
                <span className="text-2xl font-black text-white">{carbsPct}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="5"
                value={carbsPct}
                onChange={(e) => handlePctChange('carbs', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs font-mono mt-3 uppercase tracking-wider">
                <span className="text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">≈ {Math.round((calories * (carbsPct / 100)) / 4)}g per day</span>
                <span className="text-slate-500">100%</span>
              </div>
            </div>

            {/* FATS */}
            <div className="pt-4 border-t border-slate-700/30">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-slate-200">Fats</span>
                <span className="text-2xl font-black text-white">{fatsPct}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="5"
                value={fatsPct}
                onChange={(e) => handlePctChange('fats', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs font-mono mt-3 uppercase tracking-wider">
                <span className="text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md">≈ {Math.round((calories * (fatsPct / 100)) / 9)}g per day</span>
                <span className="text-slate-500">100%</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={totalPct !== 100}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-[12px] transition-all shadow-lg shadow-emerald-500/20 text-lg active:scale-[0.98]"
        >
          {totalPct === 100 ? 'Save Goals' : `Macros equal ${totalPct}%, must be 100%`}
        </button>
      </div>
    </div>
  );
}
