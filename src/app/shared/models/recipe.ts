export interface Recipe {
  id: number;
  name: string;
  short_description: string;
  image?: string;
  ingredients?: string[];
  preparation?: string;
  nutrition?: {
    per_serving?: NutritionInfo;
    per_100g?: NutritionInfo;
  };
  tags?: {
    conditions?: string[];
    type?: string;
    intentions?: string[];
  };
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
