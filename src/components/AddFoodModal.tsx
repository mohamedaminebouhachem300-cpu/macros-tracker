'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FoodItem, MealCategory } from '@/types/food';
import { X, Calendar, Weight } from 'lucide-react';

interface AddFoodModalProps {
  food: FoodItem;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (weight: number, category: MealCategory) => void;
}

export default function AddFoodModal({ food, isOpen, onClose, onAdd }: AddFoodModalProps) {
  const [weight, setWeight] = useState<number>(100);
  const [category, setCategory] = useState<MealCategory>('Breakfast');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-modal-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#1e293b] w-full max-w-md rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden animate-modal-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-white/5 bg-[#0f172a]/50">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-5">
            <span className="text-5xl drop-shadow-lg">{food.emoji}</span>
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">{food.english_name}</h3>
              <p className="text-sm text-slate-400 mt-1">{food.kcal_per_100g} kcal per 100g</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Weight Input */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">
              <Weight className="w-3.5 h-3.5" />
              Serving Weight
            </label>
            <div className="relative group">
              <input 
                type="number"
                min="1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-6 py-5 bg-[#0f172a] border border-white/10 rounded-2xl text-white text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all shadow-inner"
                autoFocus
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 font-mono text-lg font-bold">g</span>
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">
              <Calendar className="w-3.5 h-3.5" />
              Meal Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-4 rounded-2xl border transition-all text-sm font-bold flex items-center justify-center gap-2 ${
                    category === cat 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                      : 'bg-[#0f172a] border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <span className="text-lg">
                    {cat === 'Breakfast' && '🌅'}
                    {cat === 'Lunch' && '☀️'}
                    {cat === 'Dinner' && '🌙'}
                    {cat === 'Snack' && '🍿'}
                  </span>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-[#0f172a]/30 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button 
            onClick={() => onAdd(weight, category)}
            className="flex-[2] px-6 py-4 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
          >
            Add to Journal
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

