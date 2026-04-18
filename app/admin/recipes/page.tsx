"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/lib/types";

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRecipes = async () => {
      try {
        const res = await fetch("/api/recipes");
        const data = await res.json();
        if (isMounted) {
          setRecipes(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch recipes", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchRecipes();
    return () => { isMounted = false; };
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRecipes(prev => prev.filter(r => r.id !== id));
      } else {
        alert("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Failed to delete recipe", error);
    }
  };

  if (loading) return <div>Loading recipes...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Recipes</h1>
        <Link href="/admin/recipes/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Recipe
          </Button>
        </Link>
      </div>

      <div className="rounded-md border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-stone-700 uppercase bg-stone-50 dark:bg-stone-900 dark:text-stone-400">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Difficulty</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe.id} className="border-b border-stone-200 dark:border-stone-800">
                <td className="px-6 py-4">{recipe.id}</td>
                <td className="px-6 py-4 font-medium text-stone-900 dark:text-stone-50">{recipe.titleEn}</td>
                <td className="px-6 py-4">{recipe.category}</td>
                <td className="px-6 py-4">{recipe.difficulty}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/admin/recipes/${recipe.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(recipe.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {recipes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-stone-500">
                  No recipes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
