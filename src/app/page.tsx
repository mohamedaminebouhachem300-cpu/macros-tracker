import { MacroProvider } from '@/context/MacroContext';
import FoodSearch from '@/components/FoodSearch';
import MealJournal from '@/components/MealJournal';
import Dashboard from '@/components/Dashboard';
import GoalManager from '@/components/GoalManager';

export default function Home() {
  return (
    <MacroProvider>
      <main className="min-h-screen bg-[#0f172a] text-slate-50 p-4 md:p-8 font-sans selection:bg-emerald-500/30">
        <div className="max-w-7xl mx-auto space-y-8 pb-16">
          <header className="flex flex-col gap-2 pb-6 border-b border-slate-800/60">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500">
              Macro Tracker
            </h1>
            <p className="text-slate-400 text-lg font-medium">Precision daily nutrition logging.</p>
          </header>

          <Dashboard />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 xl:col-span-4 space-y-8 sticky top-8">
              <FoodSearch />
              <GoalManager />
            </div>
            <div className="lg:col-span-8 xl:col-span-8">
              <MealJournal />
            </div>
          </div>
        </div>
      </main>
    </MacroProvider>
  );
}
