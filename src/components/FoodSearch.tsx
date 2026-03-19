'use client';

import React, { useState, useEffect } from 'react';
import { FoodItem, MealCategory, LogEntry } from '@/types/food';
import { calculateMacros } from '@/lib/macro-calculator';
import { useMacroContext } from '@/context/MacroContext';
import { Search, X, Plus } from 'lucide-react';

export default function FoodSearch() {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [weight, setWeight] = useState<number>(100);
  const [mealCategory, setMealCategory] = useState<MealCategory>('Breakfast');

  const { addLogEntry } = useMacroContext();

  useEffect(() => {
    fetch('/data/@Open-food-calories.json')
      .then(res => res.json())
      .then(data => {
        setFoods(data);
        setFilteredFoods(data.slice(0, 50));
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!query) {
      setFilteredFoods(foods.slice(0, 50));
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = foods.filter(f => 
       f.english_name.toLowerCase().includes(lowerQuery) || 
       f.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredFoods(filtered.slice(0, 50));
  }, [query, foods]);

  const handleAdd = () => {
    if (!selectedFood || weight <= 0) return;
    
    const macros = calculateMacros(selectedFood, weight);
    
    const entry: LogEntry = {
      // Robust ID generation with fallback
      id: typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      food: selectedFood,
      weight_g: weight,
      meal_category: mealCategory,
      calculated_macros: macros,
      date: new Date().toISOString().split('T')[0]
    };

    addLogEntry(entry);
    setSelectedFood(null);
    setWeight(100);
  };

  return (
    <div className="bg-[#1e293b] p-5 rounded-[16px] shadow-xl flex flex-col gap-4 border border-slate-700/40">
      <h2 className="text-xl font-bold text-slate-100">Add Food</h2>
      <p className="text-sm text-slate-400 -mt-3">Search or scan to log your meals</p>
      
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input 
          type="text"
          placeholder="Search foods..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-20 py-3.5 bg-[#0f172a] border border-slate-700/60 rounded-[12px] text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium text-sm"
        />
        {query && (
          <button 
            onClick={() => setQuery('')} 
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 bg-slate-700/60 hover:bg-slate-600 rounded-lg transition-colors group"
          >
            <X className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
            <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">Clear</span>
          </button>
        )}
      </div>

      {/* Food list */}
      <div className="max-h-[420px] overflow-y-auto space-y-2 custom-scrollbar">
        {filteredFoods.map((f, i) => (
          <button
            key={`${f.name}-${i}`}
            onClick={() => setSelectedFood(f)}
            className="w-full text-left bg-[#0f172a] hover:bg-slate-800 p-4 rounded-[12px] transition-all flex items-center justify-between group border border-slate-700/30 hover:border-slate-600/60"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl leading-none drop-shadow-md">{f.emoji}</span>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-200 text-sm">{f.english_name}</span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">{f.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-slate-400 opacity-70 group-hover:opacity-100 transition-opacity">
                {f.kcal_per_100g} kcal
              </span>
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-emerald-500/10">
                <Plus className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </button>
        ))}
        {filteredFoods.length === 0 && (
          <div className="text-slate-500 text-center py-12 font-medium text-sm">No foods found.</div>
        )}
      </div>

      {/* Modal Overlay */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedFood(null)}>
          <div 
            className="bg-[#1e293b] p-8 rounded-[20px] w-full max-w-sm border border-slate-700/60 shadow-2xl relative animate-fade-in-up" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-2 bg-[#0f172a] rounded-full hover:bg-rose-500"
              onClick={() => setSelectedFood(null)}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-5 mb-8 mt-2">
              <span className="text-6xl leading-none drop-shadow-lg">{selectedFood.emoji}</span>
              <div>
                <h3 className="text-2xl font-bold text-slate-100 leading-tight">{selectedFood.english_name}</h3>
                <p className="text-sm text-slate-400 mt-1">{selectedFood.kcal_per_100g} kcal / 100g</p>
              </div>
            </div>
            
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Weight (grams)</label>
                <input 
                  type="number"
                  min="1"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-4 py-4 bg-[#0f172a] border border-slate-700/60 rounded-[12px] text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Meal</label>
                <select 
                  value={mealCategory}
                  onChange={(e) => setMealCategory(e.target.value as MealCategory)}
                  className="w-full px-4 py-4 bg-[#0f172a] border border-slate-700/60 rounded-[12px] text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none text-lg font-medium"
                >
                  <option value="Breakfast">🌅 Breakfast</option>
                  <option value="Lunch">☀️ Lunch</option>
                  <option value="Dinner">🌙 Dinner</option>
                  <option value="Snack">🍿 Snack</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleAdd}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 rounded-[12px] transition-all shadow-lg shadow-emerald-500/20 text-lg active:scale-[0.98]"
            >
              Add to Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
