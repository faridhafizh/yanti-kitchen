"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/lib/types";

export default function AdminDashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
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
    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/admin/recipes/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Recipe
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
            <BookOpen className="h-4 w-4 text-stone-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipes.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Recipes</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recipes.slice(0, 3).map((recipe) => (
            <Card key={recipe.id}>
              <CardHeader>
                <CardTitle className="text-lg">{recipe.titleEn}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-500 line-clamp-2">{recipe.descEn}</p>
                <div className="mt-4 flex gap-2">
                  <span className="inline-flex items-center rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                    {recipe.category}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
