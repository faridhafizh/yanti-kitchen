"use client";

import { useEffect, useState } from "react";
import { RecipeCard } from "@/components/RecipeCard";
import { Recipe } from "@/lib/types";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("/api/recipes");
        const data = await res.json();
        setRecipes(data);
      } catch (error) {
        console.error("Failed to fetch recipes", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  const categories = ["All", ...Array.from(new Set(recipes.map(r => r.category)))];

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.titleEn.toLowerCase().includes(search.toLowerCase()) ||
                          r.titleId.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || r.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">All Recipes</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search recipes..."
          className="flex-1 p-3 border rounded-md dark:bg-stone-900 dark:border-stone-800"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-3 border rounded-md dark:bg-stone-900 dark:border-stone-800"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading recipes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
          {filteredRecipes.length === 0 && (
            <div className="col-span-full text-center py-12 text-stone-500">
              No recipes found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
