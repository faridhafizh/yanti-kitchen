"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { Recipe } from "@/lib/types";

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { language } = useI18n();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(`/api/recipes/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setRecipe(data);
        }
      } catch (error) {
        console.error("Failed to fetch recipe", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [resolvedParams.id]);

  if (loading) return <div className="container mx-auto p-12 text-center">Loading recipe details...</div>;
  if (!recipe) return <div className="container mx-auto p-12 text-center text-xl">Recipe not found</div>;

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="relative aspect-video w-full mb-8 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900">
        <Image
          src={recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80"}
          alt={language === "en" ? recipe.titleEn : recipe.titleId}
          fill
          className="object-cover"
        />
      </div>

      <div className="mb-12">
        <div className="flex gap-2 mb-4">
          <span className="inline-flex items-center rounded-md bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
            {recipe.category}
          </span>
          <span className="inline-flex items-center rounded-md bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
            🕒 {recipe.cookingTime} mins
          </span>
          <span className="inline-flex items-center rounded-md bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
            💪 {recipe.difficulty}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-stone-900 dark:text-stone-50">
          {language === "en" ? recipe.titleEn : recipe.titleId}
        </h1>
        <p className="text-xl text-stone-600 dark:text-stone-400">
          {language === "en" ? recipe.descEn : recipe.descId}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2 text-stone-400">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Instructions</h2>
          <ol className="space-y-6">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold text-sm">
                  {idx + 1}
                </span>
                <p className="pt-1 text-stone-700 dark:text-stone-300 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}
