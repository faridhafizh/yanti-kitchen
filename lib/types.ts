export interface Recipe {
  id: number;
  titleEn: string;
  titleId: string;
  descEn: string;
  descId: string;
  image: string;
  ingredients: string[];
  steps: string[];
  category: string;
  cookingTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
}
