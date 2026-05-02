import { getDb } from './db';
import { Recipe } from './types';

// Ensure the recipes table is initialized
async function ensureRecipesTable() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titleEn TEXT NOT NULL,
      titleId TEXT NOT NULL,
      descEn TEXT NOT NULL,
      descId TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      ingredients TEXT NOT NULL DEFAULT '[]',
      steps TEXT NOT NULL DEFAULT '[]',
      category TEXT NOT NULL DEFAULT 'Main Course',
      cookingTime INTEGER NOT NULL DEFAULT 30,
      difficulty TEXT NOT NULL DEFAULT 'Medium'
    )
  `);
  return db;
}

function rowToRecipe(row: Record<string, unknown>): Recipe {
  return {
    id: row.id as number,
    titleEn: row.titleEn as string,
    titleId: row.titleId as string,
    descEn: row.descEn as string,
    descId: row.descId as string,
    image: row.image as string,
    ingredients: JSON.parse(row.ingredients as string),
    steps: JSON.parse(row.steps as string),
    category: row.category as string,
    cookingTime: row.cookingTime as number,
    difficulty: row.difficulty as 'Easy' | 'Medium' | 'Hard',
  };
}

export async function getRecipes(limit?: number): Promise<Recipe[]> {
  try {
    const db = await ensureRecipesTable();
    let query = 'SELECT * FROM recipes ORDER BY id ASC';
    const params: unknown[] = [];

    if (limit !== undefined && limit > 0) {
      query += ' LIMIT ?';
      params.push(limit);
    }

    const rows = await db.all(query, ...params);
    return rows.map(rowToRecipe);
  } catch (error) {
    console.error('Error reading recipes from DB', error);
    return [];
  }
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  try {
    const db = await ensureRecipesTable();
    const row = await db.get('SELECT * FROM recipes WHERE id = ?', id);
    if (!row) return null;
    return rowToRecipe(row);
  } catch (error) {
    console.error('Error reading recipe from DB', error);
    return null;
  }
}

export async function createRecipe(recipe: Omit<Recipe, 'id'>): Promise<Recipe> {
  const db = await ensureRecipesTable();
  const result = await db.run(
    `INSERT INTO recipes (titleEn, titleId, descEn, descId, image, ingredients, steps, category, cookingTime, difficulty)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      recipe.titleEn,
      recipe.titleId,
      recipe.descEn,
      recipe.descId,
      recipe.image,
      JSON.stringify(recipe.ingredients),
      JSON.stringify(recipe.steps),
      recipe.category,
      recipe.cookingTime,
      recipe.difficulty,
    ]
  );
  const newId = result.lastID!;
  return { ...recipe, id: newId };
}

export async function updateRecipe(id: number, updatedRecipe: Partial<Recipe>): Promise<Recipe | null> {
  const db = await ensureRecipesTable();
  const existing = await getRecipeById(id);
  if (!existing) return null;

  const merged = { ...existing, ...updatedRecipe, id };

  await db.run(
    `UPDATE recipes SET titleEn=?, titleId=?, descEn=?, descId=?, image=?, ingredients=?, steps=?, category=?, cookingTime=?, difficulty=?
     WHERE id=?`,
    [
      merged.titleEn,
      merged.titleId,
      merged.descEn,
      merged.descId,
      merged.image,
      JSON.stringify(merged.ingredients),
      JSON.stringify(merged.steps),
      merged.category,
      merged.cookingTime,
      merged.difficulty,
      id,
    ]
  );
  return merged;
}

export async function deleteRecipe(id: number): Promise<boolean> {
  const db = await ensureRecipesTable();
  const result = await db.run('DELETE FROM recipes WHERE id = ?', id);
  return (result.changes ?? 0) > 0;
}
