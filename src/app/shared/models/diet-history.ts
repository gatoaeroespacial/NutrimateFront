export interface Recipe {
    name: string;
    description: string;
    ingredients: string[];
    preparation_steps: string;
}

export interface DailyMenu {
    day: number;
    recipes: Recipe[];
}

export interface DietHistory {
    startDate: string; // yyyy-mm-dd
    endDate: string; // yyyy-mm-dd
    menus: DailyMenu[];
}
