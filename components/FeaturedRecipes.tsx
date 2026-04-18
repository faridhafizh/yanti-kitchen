"use client";

import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { recipes } from "@/lib/recipes";

export function FeaturedRecipes() {
  const { language, t } = useI18n();

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
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="flex flex-col overflow-hidden">
              <div className="aspect-[16/9] w-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-5xl">
                {recipe.emoji}
              </div>
              <CardHeader>
                <CardTitle>{language === "en" ? recipe.titleEn : recipe.titleId}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-base">
                  {language === "en" ? recipe.descEn : recipe.descId}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  {t("recipe.view")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
