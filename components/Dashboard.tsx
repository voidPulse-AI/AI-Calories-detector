import React from 'react';
import { UserProfile, DiaryEntry } from '../types';
import { Camera, Plus, Flame, TrendingUp } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  todayEntries: DiaryEntry[];
  onScan: () => void;
  onViewHistory: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, todayEntries, onScan, onViewHistory }) => {
  // Calculate totals
  const totalCalories = todayEntries.reduce((acc, curr) => acc + curr.total.calories, 0);
  const totalProtein = todayEntries.reduce((acc, curr) => acc + curr.total.protein, 0);
  const totalCarbs = todayEntries.reduce((acc, curr) => acc + curr.total.carbs, 0);
  const totalFat = todayEntries.reduce((acc, curr) => acc + curr.total.fat, 0);

  const percentage = Math.min((totalCalories / user.calorieGoal) * 100, 100);
  const remaining = Math.max(user.calorieGoal - totalCalories, 0);

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto pb-24">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white text-slate-900">Hello, {user.name} 👋</h1>
          <p className="dark:text-slate-400 text-slate-500 text-sm">Let's hit your goals today!</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-600 dark:text-slate-300">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* Main Stats Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
           <div>
             <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Calories Left</span>
             <div className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">{remaining}</div>
           </div>
           <div className="text-right">
             <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Goal</span>
             <div className="text-lg font-bold text-emerald-500">{user.calorieGoal}</div>
           </div>
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Protein</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{Math.round(totalProtein)}g</div>
          </div>
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Carbs</div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{Math.round(totalCarbs)}g</div>
          </div>
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Fat</div>
            <div className="text-lg font-bold text-orange-500 dark:text-orange-400">{Math.round(totalFat)}g</div>
          </div>
        </div>
      </div>

      {/* Recent Meals */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Today's Meals</h2>
        {todayEntries.length > 0 && (
          <button onClick={onViewHistory} className="text-sm text-emerald-500 font-medium hover:text-emerald-600">
            View Diary
          </button>
        )}
      </div>

      {todayEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Flame className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 mb-4">No meals tracked yet today.</p>
          <button 
            onClick={onScan}
            className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-medium hover:opacity-90 transition"
          >
            Track First Meal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {todayEntries.slice().reverse().map((entry) => (
            <div key={entry.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0">
                <img src={entry.imageSrc} alt="Food" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                   <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{entry.items.map(i => i.name).join(', ')}</h3>
                   <span className="text-sm font-bold text-emerald-500">{entry.total.calories}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 capitalize mb-2">{entry.mealType} • {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div className="flex gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {Math.round(entry.total.protein)}p</span>
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> {Math.round(entry.total.carbs)}c</span>
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> {Math.round(entry.total.fat)}f</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-30">
        <button 
          onClick={onScan}
          className="w-16 h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          <Camera className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
