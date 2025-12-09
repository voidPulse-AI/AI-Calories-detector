import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { RefreshCw, ArrowLeft, Utensils, Info, CheckCircle, Droplet, Star } from 'lucide-react';

interface ResultsViewProps {
  data: AnalysisResult;
  imageSrc: string;
  onReset: () => void;
  onSave: (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
}

const MacroCard: React.FC<{ label: string; value: number; unit: string; color: string; percentage: number }> = ({ 
  label, value, unit, color, percentage 
}) => (
  <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex-1 min-w-[80px]">
    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">{label}</div>
    <div className="text-lg font-bold text-slate-900 dark:text-white">{Math.round(value)}{unit}</div>
    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
      <div 
        className="h-full rounded-full" 
        style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: color }}
      ></div>
    </div>
  </div>
);

const ResultsView: React.FC<ResultsViewProps> = ({ data, imageSrc, onReset, onSave }) => {
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [isSaving, setIsSaving] = useState(false);

  const macroData = [
    { name: 'Protein', value: data.total.protein, color: '#10b981' }, 
    { name: 'Carbs', value: data.total.carbs, color: '#3b82f6' },    
    { name: 'Fat', value: data.total.fat, color: '#f59e0b' },        
  ];

  const totalGrams = data.total.protein + data.total.carbs + data.total.fat;

  const handleSave = () => {
    setIsSaving(true);
    // Simulate short delay for UX
    setTimeout(() => {
      onSave(selectedMealType);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto">
      {/* Header Image */}
      <div className="relative h-64 w-full shrink-0">
        <img src={imageSrc} alt="Food analysis" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-90"></div>
        
        <button 
          onClick={onReset}
          className="absolute top-4 left-4 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
             <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
               AI Analysis
             </span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-1">
            {data.total.calories} <span className="text-xl font-medium text-slate-300">kcal</span>
          </h1>
          <p className="text-slate-300 text-sm line-clamp-1">
            {data.items.map(i => i.name).join(', ')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-8 -mt-6 bg-slate-50 dark:bg-slate-900 rounded-t-3xl relative z-10">
        
        {/* Macros */}
        <div className="flex gap-3 justify-between">
          <MacroCard label="Protein" value={data.total.protein} unit="g" color="#10b981" percentage={(data.total.protein / totalGrams) * 100 * 3} />
          <MacroCard label="Carbs" value={data.total.carbs} unit="g" color="#3b82f6" percentage={(data.total.carbs / totalGrams) * 100 * 3} />
          <MacroCard label="Fat" value={data.total.fat} unit="g" color="#f59e0b" percentage={(data.total.fat / totalGrams) * 100 * 3} />
        </div>

        {/* Charts & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 w-full">Distribution</h3>
            <div className="h-40 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${Math.round(value)}g`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                   <div className="text-xs text-slate-400">Total</div>
                   <div className="text-lg font-bold text-slate-800 dark:text-white">{Math.round(totalGrams)}g</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
             <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
               <Utensils className="w-5 h-5 text-slate-400" /> Items
             </h3>
             <div className="space-y-4">
               {data.items.map((item, idx) => (
                 <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-50 dark:border-slate-700 last:border-0 last:pb-0">
                    <div className="mt-1 text-emerald-500"><CheckCircle className="w-4 h-4" /></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.macros.calories}</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{item.portion}</div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
        
        {/* Micro Nutrients */}
        {data.micros && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
             <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
               <Star className="w-5 h-5 text-yellow-500" /> Micronutrients
             </h3>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Vitamins</h4>
                 <div className="flex flex-wrap gap-2">
                   {data.micros.vitamins.length > 0 ? data.micros.vitamins.map((v, i) => (
                     <span key={i} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-lg font-medium">{v}</span>
                   )) : <span className="text-xs text-slate-500 italic">None detected</span>}
                 </div>
               </div>
               <div>
                 <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Minerals</h4>
                 <div className="flex flex-wrap gap-2">
                   {data.micros.minerals.length > 0 ? data.micros.minerals.map((m, i) => (
                     <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-lg font-medium">{m}</span>
                   )) : <span className="text-xs text-slate-500 italic">None detected</span>}
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* Health Tip */}
        {data.healthTip && (
           <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-5 rounded-2xl flex gap-4">
             <div className="shrink-0">
               <Info className="w-6 h-6 text-blue-500" />
             </div>
             <div>
               <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Coach's Tip</h4>
               <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">{data.healthTip}</p>
             </div>
           </div>
        )}
        
        <div className="h-20"></div>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">Meal Type</label>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMealType(type as any)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition ${
                    selectedMealType === type 
                      ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-4">
          <button 
            onClick={onReset}
            className="px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-4 rounded-xl bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-600 transition active:scale-[0.98] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : 'Add to Diary'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
