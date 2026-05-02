"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

type RecipeInput = Omit<Recipe, "id">;

interface AdminFormProps {
  initialData?: Recipe;
  isEdit?: boolean;
}

export function AdminForm({ initialData, isEdit = false }: AdminFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<RecipeInput>({
    titleEn: initialData?.titleEn || "",
    titleId: initialData?.titleId || "",
    descEn: initialData?.descEn || "",
    descId: initialData?.descId || "",
    image: initialData?.image || "",
    ingredients: initialData?.ingredients?.length ? initialData.ingredients : [""],
    steps: initialData?.steps?.length ? initialData.steps : [""],
    category: initialData?.category || "Main Course",
    cookingTime: initialData?.cookingTime || 30,
    difficulty: initialData?.difficulty || "Medium",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleArrayChange = (field: "ingredients" | "steps", index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: "ingredients" | "steps") => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayItem = (field: "ingredients" | "steps", index: number) => {
    if (formData[field].length > 1) {
      const newArray = [...formData[field]];
      newArray.splice(index, 1);
      setFormData({ ...formData, [field]: newArray });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, image: data.url });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to upload image");
      }
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Filter out empty ingredients/steps
    const submitData = {
      ...formData,
      ingredients: formData.ingredients.filter(i => i.trim() !== ""),
      steps: formData.steps.filter(s => s.trim() !== ""),
      cookingTime: Number(formData.cookingTime)
    };

    try {
      const url = isEdit ? `/api/recipes/${initialData?.id}` : "/api/recipes";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        router.push("/admin/recipes");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Failed to save recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-stone-950 p-6 rounded-lg border border-stone-200 dark:border-stone-800">
      {error && <div className="text-red-500 bg-red-50 p-3 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title (English)</label>
          <input required className="w-full p-2 border rounded-md dark:bg-stone-900 dark:border-stone-700" value={formData.titleEn} onChange={(e) => setFormData({...formData, titleEn: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Title (Indonesian)</label>
          <input required className="w-full p-2 border rounded-md dark:bg-stone-900 dark:border-stone-700" value={formData.titleId} onChange={(e) => setFormData({...formData, titleId: e.target.value})} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Description (English)</label>
          <textarea required className="w-full p-2 border rounded-md dark:bg-stone-900 dark:border-stone-700" value={formData.descEn} onChange={(e) => setFormData({...formData, descEn: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description (Indonesian)</label>
          <textarea required className="w-full p-2 border rounded-md dark:bg-stone-900 dark:border-stone-700" value={formData.descId} onChange={(e) => setFormData({...formData, descId: e.target.value})} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Image</label>
        <input type="file" accept="image/*" className="w-full p-2 border rounded-md dark:bg-stone-900 dark:border-stone-700" onChange={handleImageUpload} disabled={uploadingImage} />
        {uploadingImage && <p className="text-sm text-stone-500">Uploading...</p>}
        {formData.image && (
          <div className="mt-2">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={formData.image} alt="Preview" className="h-32 w-auto object-cover rounded-md" />
             <input type="hidden" value={formData.image} required />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <input required className="w-full p-2 border rounded-md dark:bg-stone-900 dark:border-stone-700" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Cooking Time (minutes)</label>
          <input required type="number" min="1" className="w-full p-2 border rounded-md dark:bg-stone-900 dark:border-stone-700" value={formData.cookingTime} onChange={(e) => setFormData({...formData, cookingTime: parseInt(e.target.value)})} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty</label>
          <select required className="w-full p-2 border rounded-md dark:bg-stone-900 dark:border-stone-700" value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value as "Easy" | "Medium" | "Hard"})}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Ingredients</label>
          <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("ingredients")}>
            <Plus className="h-4 w-4 mr-2" /> Add Ingredient
          </Button>
        </div>
        {formData.ingredients.map((ing, i) => (
          <div key={i} className="flex gap-2">
            <input required className="flex-1 p-2 border rounded-md dark:bg-stone-900 dark:border-stone-700" value={ing} onChange={(e) => handleArrayChange("ingredients", i, e.target.value)} />
            <Button type="button" variant="destructive" size="icon" onClick={() => removeArrayItem("ingredients", i)} disabled={formData.ingredients.length === 1}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Steps</label>
          <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("steps")}>
            <Plus className="h-4 w-4 mr-2" /> Add Step
          </Button>
        </div>
        {formData.steps.map((step, i) => (
          <div key={i} className="flex gap-2">
            <textarea required className="flex-1 p-2 border rounded-md dark:bg-stone-900 dark:border-stone-700" value={step} onChange={(e) => handleArrayChange("steps", i, e.target.value)} />
            <Button type="button" variant="destructive" size="icon" onClick={() => removeArrayItem("steps", i)} disabled={formData.steps.length === 1}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Recipe"}</Button>
      </div>
    </form>
  );
}
