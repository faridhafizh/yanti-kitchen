import fs from 'fs/promises';
import path from 'path';
import { Recipe } from './types';

const dataFilePath = path.join(process.cwd(), 'data', 'recipes.json');

export async function getRecipes(): Promise<Recipe[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data) as Recipe[];
  } catch (error) {
    console.error('Error reading recipes file', error);
    return [];
  }
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  const recipes = await getRecipes();
  return recipes.find(recipe => recipe.id === id) || null;
}

export async function saveRecipes(recipes: Recipe[]): Promise<void> {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(recipes, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing recipes file', error);
    throw new Error('Failed to save recipes');
  }
}

export async function createRecipe(recipe: Omit<Recipe, 'id'>): Promise<Recipe> {
  const recipes = await getRecipes();
  const newId = recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1;
  const newRecipe: Recipe = { ...recipe, id: newId };
  recipes.push(newRecipe);
  await saveRecipes(recipes);
  return newRecipe;
}

export async function updateRecipe(id: number, updatedRecipe: Partial<Recipe>): Promise<Recipe | null> {
  const recipes = await getRecipes();
  const index = recipes.findIndex(r => r.id === id);
  if (index === -1) return null;

  recipes[index] = { ...recipes[index], ...updatedRecipe, id }; // Ensure ID doesn't change
  await saveRecipes(recipes);
  return recipes[index];
}

export async function deleteRecipe(id: number): Promise<boolean> {
  const recipes = await getRecipes();
  const filteredRecipes = recipes.filter(r => r.id !== id);

  if (filteredRecipes.length === recipes.length) return false;

  await saveRecipes(filteredRecipes);
  return true;
}
