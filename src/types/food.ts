export interface FoodItem {
  english_name: string;
  name: string; // French/searchable name
  kcal_per_100g: number;
  proteines_per_100g: number;
  lipides_per_100g: number;
  glucides_per_100g: number;
  emoji: string;
}

export interface CalculatedMacros {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  weight_g: number;
}

export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface LogEntry {
  id: string; // UUID or timestamp
  food: FoodItem;
  weight_g: number;
  meal_category: MealCategory;
  calculated_macros: CalculatedMacros;
  date: string; // e.g. YYYY-MM-DD
}

export interface UserGoals {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}
