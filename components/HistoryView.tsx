import React from 'react';
import { DiaryEntry } from '../types';
import { CalendarDays, Trash2 } from 'lucide-react';

interface HistoryViewProps {
  entries: DiaryEntry[];
  onDelete: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ entries, onDelete }) => {
  // Group entries by date
  const groupedEntries = entries.reduce((groups, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString(undefined, {
      weekday: 'short', month: 'short', day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, DiaryEntry[]>);

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => {
    return new Date(groupedEntries[b][0].timestamp).getTime() - new Date(groupedEntries[a][0].timestamp).getTime();
  });

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold dark:text-white text-slate-900">Food Diary</h1>
        <p className="dark:text-slate-400 text-slate-500 text-sm">Track your nutritional journey.</p>
      </header>

      {entries.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
          <CalendarDays className="w-16 h-16 mb-4 text-slate-400" />
          <p className="text-lg font-medium dark:text-slate-300">Your diary is empty</p>
          <p className="text-sm dark:text-slate-500">Start scanning meals to build your history.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map(date => (
            <div key={date}>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 sticky top-0 bg-slate-50/95 dark:bg-slate-900/95 py-2 backdrop-blur-sm z-10">
                {date}
              </h2>
              <div className="space-y-4">
                {groupedEntries[date].sort((a,b) => b.timestamp - a.timestamp).map(entry => (
                  <div key={entry.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4 group">
                     <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0">
                       <img src={entry.imageSrc} alt="Food" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate pr-2">{entry.items.map(i => i.name).join(', ')}</h3>
                          <span className="font-bold text-emerald-500 whitespace-nowrap">{entry.total.calories} kcal</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 capitalize mb-3">
                          {entry.mealType} • {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        
                        <div className="flex justify-between items-end">
                           <div className="flex gap-3 text-xs dark:text-slate-300">
                             <div><span className="font-semibold">{Math.round(entry.total.protein)}g</span> Prot</div>
                             <div><span className="font-semibold">{Math.round(entry.total.carbs)}g</span> Carb</div>
                             <div><span className="font-semibold">{Math.round(entry.total.fat)}g</span> Fat</div>
                           </div>
                           <button 
                             onClick={() => onDelete(entry.id)}
                             className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
