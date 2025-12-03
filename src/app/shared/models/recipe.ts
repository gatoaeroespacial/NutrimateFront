export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  preparation_steps: string;
  nutritional_info: {
    per_serving?: NutritionInfo;
    per_100g?: NutritionInfo;
  };
  image_url?: string;
  image?: string;
  meal: string;
  goal: string;
  tags?: number[];

  // Legacy properties for backward compatibility with admin panel
  short_description?: string;
  preparation?: string;
  nutrition?: {
    per_serving?: NutritionInfo;
    per_100g?: NutritionInfo;
  };
  imageFile?: File;
}

export interface NutritionInfo {
  serving_g?: number | null;
  calories_kcal?: number | null;
  protein_g?: number | null;
  fat_g?: number | null;
  saturated_fat_g?: number | null;
  total_fat_g?: number | null;
  trans_fat_g?: number | null;
  cholesterol_mg?: number | null;
  sodium_mg?: number | null;
  carbs_g?: number | null;
  fiber_g?: number | null;
  sugars_g?: number | null;
  vitamin_d_mcg?: number | null;
  calcium_mg?: number | null;
  iron_mg?: number | null;
  potassium_mg?: number | null;
}
