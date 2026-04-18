"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { RecipeCard } from "./RecipeCard";
import { Recipe } from "@/lib/types";
import Link from "next/link";
import { Button } from "./ui/button";

export function FeaturedRecipes() {
  const { t } = useI18n();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("/api/recipes");
        const data = await res.json();
        // Just show 4 recipes on home page
        setRecipes(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch recipes", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  return (
    <section id="recipes" className="w-full py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">
            {t("featured.title")}
          </h2>
          <p className="mt-2 text-lg leading-8 text-stone-600 dark:text-stone-400">
            {t("featured.subtitle")}
          </p>
        </div>

        {loading ? (
          <div className="mt-16 text-center">Loading recipes...</div>
        ) : (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/recipes">
            <Button size="lg" className="px-8">View All Recipes</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
