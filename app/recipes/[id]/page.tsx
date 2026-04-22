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

  if (loading) return <div className="container mx-auto p-12 text-center text-earth dark:text-cream">Loading recipe details...</div>;
  if (!recipe) return <div className="container mx-auto p-12 text-center text-xl text-earth dark:text-cream">Recipe not found</div>;

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="relative aspect-video w-full mb-8 rounded-3xl overflow-hidden bg-stone-200 dark:bg-stone-800 border border-earth/20 texture-ceramic shadow-lg">
        <Image
          src={recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80"}
          alt={language === "en" ? recipe.titleEn : recipe.titleId}
          fill
          className="object-cover opacity-90"
        />
      </div>

      <div className="mb-12">
        <div className="flex gap-2 mb-4">
          <span className="inline-flex items-center rounded-full bg-earth/10 px-3 py-1 text-sm font-medium text-earth dark:bg-cream/10 dark:text-cream">
            {recipe.category}
          </span>
          <span className="inline-flex items-center rounded-full bg-earth/10 px-3 py-1 text-sm font-medium text-earth dark:bg-cream/10 dark:text-cream">
            🕒 {recipe.cookingTime} mins
          </span>
          <span className="inline-flex items-center rounded-full bg-earth/10 px-3 py-1 text-sm font-medium text-earth dark:bg-cream/10 dark:text-cream">
            💪 {recipe.difficulty}
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-caveat tracking-wide mb-4 text-earth dark:text-cream leading-tight">
          {language === "en" ? recipe.titleEn : recipe.titleId}
        </h1>
        <p className="text-xl text-earth/80 dark:text-cream/80">
          {language === "en" ? recipe.descEn : recipe.descId}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12 border-t border-earth/20 pt-12">
        <div className="md:col-span-1">
          <h2 className="text-3xl font-caveat text-earth dark:text-cream mb-6">Ingredients</h2>
          <ul className="space-y-3 text-earth/90 dark:text-cream/90">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2 text-earth/50">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-3xl font-caveat text-earth dark:text-cream mb-6">Instructions</h2>
          <ol className="space-y-8">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-earth text-pale dark:bg-cream dark:text-earth font-lora text-sm">
                  {idx + 1}
                </span>
                <p className="pt-1 text-earth/90 dark:text-cream/90 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}
