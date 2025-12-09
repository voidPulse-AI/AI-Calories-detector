export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MicroNutrients {
  vitamins: string[]; // e.g., ["Vitamin A", "Vitamin C"]
  minerals: string[]; // e.g., ["Iron", "Calcium"]
}

export interface FoodItem {
  name: string;
  portion: string;
  macros: MacroNutrients;
  confidence: number;
}

export interface AnalysisResult {
  items: FoodItem[];
  total: MacroNutrients;
  micros?: MicroNutrients;
  healthTip?: string;
}

export interface DiaryEntry extends AnalysisResult {
  id: string;
  timestamp: number;
  imageSrc: string; // Base64 or URL
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface UserProfile {
  name: string;
  calorieGoal: number;
  language: string; // 'en', 'es', 'fr', 'de', 'jp', 'hi'
  theme: 'dark' | 'light';
}

export enum AppState {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  CAMERA = 'CAMERA',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  DIARY = 'DIARY',
  PROFILE = 'PROFILE',
  ERROR = 'ERROR'
}

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'jp', label: '日本語' },
  { code: 'hi', label: 'हिन्दी' }
];
