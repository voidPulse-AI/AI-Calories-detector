import React from 'react';
import { UserProfile, LANGUAGES } from '../types';
import { Settings, Moon, Sun, Globe, Target, LogOut, Trash } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onSignOut: () => void;
  onClearData: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser, onSignOut, onClearData }) => {
  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto pb-24">
      <header className="mb-8">
        <h1 className="text-2xl font-bold dark:text-white text-slate-900">Settings</h1>
        <p className="dark:text-slate-400 text-slate-500 text-sm">Customize your experience.</p>
      </header>

      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl text-white shadow-lg">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-2xl font-bold">
               {user.name.charAt(0).toUpperCase()}
             </div>
             <div>
               <h2 className="text-xl font-bold">{user.name}</h2>
               <p className="text-slate-400 text-sm">Goal: {user.calorieGoal} kcal/day</p>
             </div>
          </div>
          
          <div className="space-y-4">
             <div>
               <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                 <Target className="w-4 h-4" /> Daily Goal (kcal)
               </label>
               <input 
                 type="range" 
                 min="1200" 
                 max="4000" 
                 step="50"
                 value={user.calorieGoal}
                 onChange={(e) => onUpdateUser({...user, calorieGoal: parseInt(e.target.value)})}
                 className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
               />
               <div className="flex justify-between text-xs text-slate-500 mt-1">
                 <span>1200</span>
                 <span className="text-white font-mono">{user.calorieGoal}</span>
                 <span>4000</span>
               </div>
             </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
          
          {/* Theme */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">
                 {user.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <span className="font-medium text-slate-900 dark:text-white">Appearance</span>
            </div>
            <button 
              onClick={() => onUpdateUser({...user, theme: user.theme === 'dark' ? 'light' : 'dark'})}
              className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
            >
              {user.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>

          {/* Language */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">
                 <Globe className="w-5 h-5" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white">Language</span>
            </div>
            <select 
               value={user.language}
               onChange={(e) => onUpdateUser({...user, language: e.target.value})}
               className="bg-transparent text-slate-600 dark:text-slate-300 text-sm font-medium focus:outline-none cursor-pointer text-right"
            >
               {LANGUAGES.map(lang => (
                 <option key={lang.code} value={lang.code}>{lang.label}</option>
               ))}
            </select>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-3 pt-4">
          <button 
            onClick={onClearData}
            className="w-full p-4 rounded-xl border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2 transition"
          >
            <Trash className="w-5 h-5" /> Clear All History
          </button>
          
          <button 
             onClick={onSignOut}
             className="w-full p-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileView;
