'use client';

import React, { useState, useEffect } from 'react';
import { FoodItem, MealCategory, LogEntry } from '@/types/food';
import { calculateMacros } from '@/lib/macro-calculator';
import { useMacroContext } from '@/context/MacroContext';
import { Search, X, Plus } from 'lucide-react';
import AddFoodModal from './AddFoodModal';

export default function FoodSearch() {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

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

  const handleAdd = (weight: number, mealCategory: MealCategory) => {
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
        <AddFoodModal 
          food={selectedFood}
          isOpen={!!selectedFood}
          onClose={() => setSelectedFood(null)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
