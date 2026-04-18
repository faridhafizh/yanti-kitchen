"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, PlusCircle, Users, Edit, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

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
  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      try {
        await fetch(`/api/recipes/${id}`, { method: "DELETE" });
        fetchStats();
      } catch (error) {
        console.error("Failed to delete recipe", error);
      }
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Manage your recipes and users.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/recipes/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Recipe
            </Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm border-stone-200/50 dark:border-stone-800/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{recipes.length}</div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Available in database</p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm border-stone-200/50 dark:border-stone-800/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Registered admins</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="border-stone-200/50 dark:border-stone-800/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-stone-50/50 dark:bg-stone-900/20 border-b border-stone-100 dark:border-stone-800">
            <CardTitle className="text-xl">All Recipes</CardTitle>
            <CardDescription>Manage and organize your recipe collection.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-stone-500 uppercase bg-stone-50 dark:bg-stone-900/50 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">Title (EN)</th>
                    <th scope="col" className="px-6 py-4 font-medium">Category</th>
                    <th scope="col" className="px-6 py-4 font-medium">Difficulty</th>
                    <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {recipes.map((recipe) => (
                    <tr key={recipe.id} className="bg-white dark:bg-black hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-stone-900 dark:text-stone-100">
                        {recipe.titleEn}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-xs font-medium text-stone-800 dark:text-stone-200">
                          {recipe.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {recipe.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/recipes/${recipe.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => handleDelete(recipe.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {recipes.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-stone-500 dark:text-stone-400">
                        No recipes found. Click &quot;New Recipe&quot; to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
