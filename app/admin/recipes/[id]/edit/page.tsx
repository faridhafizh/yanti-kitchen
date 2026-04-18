"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { AdminForm } from "@/components/AdminForm";
import { Recipe } from "@/lib/types";

export default function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
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

  if (loading) return <div>Loading recipe data...</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit Recipe</h1>
      <AdminForm initialData={recipe} isEdit={true} />
    </div>
  );
}
