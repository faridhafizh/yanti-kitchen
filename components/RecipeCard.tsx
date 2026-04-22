"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/lib/types";
import { motion } from "framer-motion";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { language, t } = useI18n();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="flex h-full"
    >
    <Card className="flex flex-col overflow-hidden w-full group">
      <div className="relative aspect-[16/9] w-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
        <Image
          src={recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80"}
          alt={language === "en" ? recipe.titleEn : recipe.titleId}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl font-lora text-earth dark:text-cream leading-tight">
            {language === "en" ? recipe.titleEn : recipe.titleId}
          </CardTitle>
          <span className="inline-flex items-center rounded-full bg-earth/10 px-2.5 py-0.5 text-xs font-medium text-earth dark:bg-cream/10 dark:text-cream whitespace-nowrap">
            {recipe.category}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription className="text-base line-clamp-2">
          {language === "en" ? recipe.descEn : recipe.descId}
        </CardDescription>
        <div className="mt-4 flex gap-4 text-sm text-earth/70 dark:text-cream/70">
          <span>🕒 {recipe.cookingTime} mins</span>
          <span>💪 {recipe.difficulty}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/recipes/${recipe.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            {t("recipe.view")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
    </motion.div>
  );
}
