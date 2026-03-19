import { FoodItem, CalculatedMacros } from '@/types/food';

/**
 * Calculates macros based on weight in grams.
 * Formula: (Weight * Macro) / 100
 * If macros are missing from the data, it uses a generic breakdown:
 * 15% Protein, 55% Carbs, 30% Fats.
 */
export function calculateMacros(food: FoodItem, weightInGrams: number): CalculatedMacros {
  const calories = (weightInGrams * food.kcal_per_100g) / 100;
  
  // Try to use explicit macros if they exist, otherwise estimate
  const p100 = food.proteines_per_100g ?? ((food.kcal_per_100g * 0.15) / 4);
  const f100 = food.lipides_per_100g ?? ((food.kcal_per_100g * 0.3) / 9);
  const c100 = food.glucides_per_100g ?? ((food.kcal_per_100g * 0.55) / 4);

  return {
    calories: calories,
    protein: (weightInGrams * p100) / 100,
    fats: (weightInGrams * f100) / 100,
    carbs: (weightInGrams * c100) / 100,
    weight_g: weightInGrams,
  };
}
