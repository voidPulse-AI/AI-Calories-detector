import React, { useState, useEffect } from 'react';
import { Home, Camera, BookOpen, User, Sparkles } from 'lucide-react';
import CameraCapture from './components/CameraCapture';
import ResultsView from './components/ResultsView';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import { AppState, AnalysisResult, UserProfile, DiaryEntry } from './types';
import { analyzeImage } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.AUTH);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  
  // Temporary State for Scanning
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to apply theme class
  const applyTheme = (theme: 'dark' | 'light') => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Initialize from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('nutriscan_user');
    const savedDiary = localStorage.getItem('nutriscan_diary');

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setAppState(AppState.DASHBOARD);
        // Apply theme immediately
        applyTheme(parsedUser.theme);
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem('nutriscan_user');
      }
    }
    if (savedDiary) {
      try {
        setDiary(JSON.parse(savedDiary));
      } catch (e) {
        console.error("Failed to parse diary", e);
      }
    }
  }, []);

  const handleAuthComplete = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('nutriscan_user', JSON.stringify(profile));
    applyTheme(profile.theme);
    setAppState(AppState.DASHBOARD);
  };

  const updateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('nutriscan_user', JSON.stringify(updatedUser));
    applyTheme(updatedUser.theme);
  };

  const handleSignOut = () => {
    localStorage.removeItem('nutriscan_user');
    setUser(null);
    setAppState(AppState.AUTH);
    applyTheme('light'); // Reset to light or default on sign out
  };

  const clearData = () => {
    if (window.confirm("Are you sure you want to delete all diary entries? This cannot be undone.")) {
      setDiary([]);
      localStorage.removeItem('nutriscan_diary');
    }
  };

  const deleteEntry = (id: string) => {
    const updated = diary.filter(e => e.id !== id);
    setDiary(updated);
    localStorage.setItem('nutriscan_diary', JSON.stringify(updated));
  };

  const handleImageCaptured = async (image: string) => {
    setImageSrc(image);
    setAppState(AppState.ANALYZING);
    setError(null);
    try {
      const result = await analyzeImage(image, user?.language || 'en');
      setAnalysisResult(result);
      setAppState(AppState.RESULTS);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze. Please try again.");
      setAppState(AppState.ERROR);
    }
  };

  const saveToDiary = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    if (analysisResult && imageSrc) {
      const newEntry: DiaryEntry = {
        ...analysisResult,
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageSrc,
        mealType
      };
      const updatedDiary = [...diary, newEntry];
      setDiary(updatedDiary);
      localStorage.setItem('nutriscan_diary', JSON.stringify(updatedDiary));
      
      // Cleanup and go home
      setAnalysisResult(null);
      setImageSrc(null);
      setAppState(AppState.DASHBOARD);
    }
  };

  // ---------------- Render Views ----------------

  if (appState === AppState.AUTH) {
    return <AuthScreen onComplete={handleAuthComplete} />;
  }

  if (appState === AppState.CAMERA) {
    return <CameraCapture onCapture={handleImageCaptured} onClose={() => setAppState(AppState.DASHBOARD)} />;
  }

  if (appState === AppState.RESULTS && analysisResult && imageSrc) {
    return (
      <ResultsView 
        data={analysisResult} 
        imageSrc={imageSrc} 
        onReset={() => {
          setAppState(AppState.DASHBOARD);
          setImageSrc(null);
          setAnalysisResult(null);
        }} 
        onSave={saveToDiary}
      />
    );
  }

  if (appState === AppState.ANALYZING && imageSrc) {
    return (
      <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
         <img src={imageSrc} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl" alt="Processing" />
         <div className="relative z-10 flex flex-col items-center p-6 text-center">
           <div className="w-20 h-20 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
           <Sparkles className="w-8 h-8 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full animate-pulse" />
           <h2 className="text-2xl font-bold text-white mb-2">Analyzing Meal...</h2>
           <p className="text-slate-400">Identifying nutrients, vitamins, and minerals.</p>
         </div>
      </div>
    );
  }

  // Main App Shell (Dashboard, Diary, Profile)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      
      {appState === AppState.DASHBOARD && user && (
        <Dashboard 
          user={user} 
          todayEntries={diary.filter(d => new Date(d.timestamp).setHours(0,0,0,0) === new Date().setHours(0,0,0,0))}
          onScan={() => setAppState(AppState.CAMERA)}
          onViewHistory={() => setAppState(AppState.DIARY)}
        />
      )}

      {appState === AppState.DIARY && (
        <HistoryView entries={diary} onDelete={deleteEntry} />
      )}

      {appState === AppState.PROFILE && user && (
        <ProfileView 
          user={user} 
          onUpdateUser={updateUser} 
          onSignOut={handleSignOut}
          onClearData={clearData}
        />
      )}

      {appState === AppState.ERROR && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
           <div className="text-red-500 mb-4 text-lg font-bold">Oops!</div>
           <p className="text-slate-400 mb-6">{error}</p>
           <button onClick={() => setAppState(AppState.DASHBOARD)} className="px-6 py-2 bg-slate-800 rounded-full text-white">Go Back</button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe pt-2 px-6 flex justify-between items-center z-40 h-20">
        <button 
          onClick={() => setAppState(AppState.DASHBOARD)}
          className={`flex flex-col items-center gap-1 p-2 ${appState === AppState.DASHBOARD ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button 
           onClick={() => setAppState(AppState.CAMERA)}
           className="w-14 h-14 -mt-8 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-lg shadow-emerald-500/40 flex items-center justify-center text-white transition-transform active:scale-95"
        >
          <Camera className="w-7 h-7" />
        </button>

        <button 
          onClick={() => setAppState(AppState.DIARY)}
          className={`flex flex-col items-center gap-1 p-2 ${appState === AppState.DIARY ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-[10px] font-medium">Diary</span>
        </button>

        <button 
          onClick={() => setAppState(AppState.PROFILE)}
          className={`flex flex-col items-center gap-1 p-2 ${appState === AppState.PROFILE ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default App;