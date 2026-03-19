'use client';

import React from 'react';
import { useMacroContext } from '@/context/MacroContext';
import { Flame, Beef, Wheat, Droplets } from 'lucide-react';

function CircularProgress({ consumed, goal, strokeColor, size = 120, strokeWidth = 10, children }: {
  consumed: number;
  goal: number;
  strokeColor: string;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = Math.min((consumed / Math.max(goal, 1)) * 100, 100) || 0;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          strokeWidth={strokeWidth}
          stroke="#1e293b"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={strokeColor}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: `drop-shadow(0 0 6px ${strokeColor}40)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { dailyLog, userGoals } = useMacroContext();

  const today = new Date().toISOString().split('T')[0];
  const todaysLog = dailyLog.filter(entry => entry.date === today);

  const consumed = todaysLog.reduce(
    (acc, entry) => {
      acc.calories += entry.calculated_macros.calories;
      acc.protein += entry.calculated_macros.protein;
      acc.carbs += entry.calculated_macros.carbs;
      acc.fats += entry.calculated_macros.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const remaining = Math.max(0, Math.round(userGoals.calories - consumed.calories));

  return (
    <div className="bg-[#1e293b] p-6 md:p-8 rounded-[16px] shadow-2xl border border-slate-700/40">
      {/* 4 Progress Rings Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center justify-items-center">

        {/* CALORIES - Main hero ring */}
        <div className="col-span-2 md:col-span-1 flex flex-col items-center gap-3">
          <CircularProgress
            consumed={consumed.calories}
            goal={userGoals.calories}
            strokeColor="#34d399"
            size={180}
            strokeWidth={14}
          >
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Remaining</span>
            <span className="text-4xl font-black text-white leading-none mt-1">{remaining}</span>
            <span className="text-xs text-slate-400 font-medium mt-1">kcal</span>
          </CircularProgress>
          <div className="flex items-center gap-2 mt-1">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Calories</span>
          </div>
          <div className="flex gap-4 text-xs font-mono text-slate-500">
            <span>{Math.round(consumed.calories)} eaten</span>
            <span className="text-slate-600">|</span>
            <span>{userGoals.calories} goal</span>
          </div>
        </div>

        {/* PROTEIN - Emerald */}
        <div className="flex flex-col items-center gap-3">
          <CircularProgress
            consumed={consumed.protein}
            goal={userGoals.protein}
            strokeColor="#10b981"
            size={130}
            strokeWidth={10}
          >
            <span className="text-2xl font-black text-white leading-none">{Math.round(consumed.protein)}</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">/ {userGoals.protein}g</span>
          </CircularProgress>
          <div className="flex items-center gap-2">
            <Beef className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Protein</span>
          </div>
          <span className="text-xs font-mono text-emerald-500/70">{Math.max(0, Math.round(userGoals.protein - consumed.protein))}g left</span>
        </div>

        {/* CARBS - Amber */}
        <div className="flex flex-col items-center gap-3">
          <CircularProgress
            consumed={consumed.carbs}
            goal={userGoals.carbs}
            strokeColor="#f59e0b"
            size={130}
            strokeWidth={10}
          >
            <span className="text-2xl font-black text-white leading-none">{Math.round(consumed.carbs)}</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">/ {userGoals.carbs}g</span>
          </CircularProgress>
          <div className="flex items-center gap-2">
            <Wheat className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Carbs</span>
          </div>
          <span className="text-xs font-mono text-amber-500/70">{Math.max(0, Math.round(userGoals.carbs - consumed.carbs))}g left</span>
        </div>

        {/* FAT - Rose */}
        <div className="flex flex-col items-center gap-3">
          <CircularProgress
            consumed={consumed.fats}
            goal={userGoals.fats}
            strokeColor="#f43f5e"
            size={130}
            strokeWidth={10}
          >
            <span className="text-2xl font-black text-white leading-none">{Math.round(consumed.fats)}</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">/ {userGoals.fats}g</span>
          </CircularProgress>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fat</span>
          </div>
          <span className="text-xs font-mono text-rose-500/70">{Math.max(0, Math.round(userGoals.fats - consumed.fats))}g left</span>
        </div>
      </div>
    </div>
  );
}
