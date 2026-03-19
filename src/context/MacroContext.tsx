'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LogEntry, UserGoals } from '@/types/food';

interface MacroContextType {
  dailyLog: LogEntry[];
  userGoals: UserGoals;
  addLogEntry: (entry: LogEntry) => void;
  removeLogEntry: (id: string) => void;
  updateUserGoals: (goals: UserGoals) => void;
}

const defaultGoals: UserGoals = {
  calories: 2000,
  protein: 150,
  fats: 70,
  carbs: 200,
};

const MacroContext = createContext<MacroContextType | undefined>(undefined);

export function MacroProvider({ children }: { children: ReactNode }) {
  const [dailyLog, setDailyLog] = useState<LogEntry[]>([]);
  const [userGoals, setUserGoals] = useState<UserGoals>(defaultGoals);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedLog = localStorage.getItem('macroTracker_dailyLog');
      const savedGoals = localStorage.getItem('macroTracker_userGoals');
      
      if (savedLog) {
        const parsed = JSON.parse(savedLog);
        if (Array.isArray(parsed)) {
          setDailyLog(parsed);
        }
      }
      if (savedGoals) setUserGoals(JSON.parse(savedGoals));
    } catch (e) {
      console.error("Failed to parse localStorage data", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes after initial load
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('macroTracker_dailyLog', JSON.stringify(dailyLog));
    localStorage.setItem('macroTracker_userGoals', JSON.stringify(userGoals));
  }, [dailyLog, userGoals, isLoaded]);

  const addLogEntry = (entry: LogEntry) => {
    setDailyLog((prev) => [...prev, entry]);
  };

  const removeLogEntry = (id: string) => {
    setDailyLog((prev) => prev.filter(entry => entry.id !== id));
  };

  const updateUserGoals = (goals: UserGoals) => {
    setUserGoals(goals);
  };

  return (
    <MacroContext.Provider value={{ dailyLog, userGoals, addLogEntry, removeLogEntry, updateUserGoals }}>
      {children}
    </MacroContext.Provider>
  );
}

export function useMacroContext() {
  const context = useContext(MacroContext);
  if (context === undefined) {
    throw new Error('useMacroContext must be used within a MacroProvider');
  }
  return context;
}
