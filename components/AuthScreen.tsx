import React, { useState } from 'react';
import { UserProfile, LANGUAGES } from '../types';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';

interface AuthScreenProps {
  onComplete: (profile: UserProfile) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(2000);
  const [language, setLanguage] = useState('en');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete({
        name: name.trim(),
        calorieGoal: goal,
        language,
        theme: 'dark' // Default to dark foodie theme
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
       {/* Background decoration */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
       </div>

       <div className="w-full max-w-md z-10">
         <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to NutriScan</h1>
            <p className="text-slate-400 text-center">Your personal AI nutritionist and calorie tracker.</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700 shadow-xl">
           <div>
             <label className="block text-sm font-medium text-slate-300 mb-2">What should we call you?</label>
             <input 
               type="text" 
               required
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
               placeholder="Enter your name"
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-slate-300 mb-2">Daily Calorie Goal</label>
             <div className="flex items-center gap-4">
               <input 
                 type="range" 
                 min="1200" 
                 max="4000" 
                 step="50"
                 value={goal}
                 onChange={(e) => setGoal(parseInt(e.target.value))}
                 className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
               />
               <span className="text-xl font-bold text-emerald-400 w-20 text-right">{goal}</span>
             </div>
             <p className="text-xs text-slate-500 mt-1">Recommended: 2000-2500 for maintenance</p>
           </div>

           <div>
             <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Language</label>
             <select 
               value={language}
               onChange={(e) => setLanguage(e.target.value)}
               className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
             >
               {LANGUAGES.map(lang => (
                 <option key={lang.code} value={lang.code}>{lang.label}</option>
               ))}
             </select>
           </div>

           <button 
             type="submit"
             className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
           >
             Get Started
             <ArrowRight className="w-5 h-5" />
           </button>
         </form>

         <p className="text-center text-xs text-slate-500 mt-6">
           Privacy First: We only use your camera and microphone for food analysis. Data is stored locally on your device.
         </p>
       </div>
    </div>
  );
};

export default AuthScreen;
