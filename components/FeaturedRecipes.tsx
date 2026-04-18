"use client";

import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

// Mock data for recipes
const recipes = [
  {
    id: 1,
    titleEn: "Nasi Goreng Spesial",
    titleId: "Nasi Goreng Spesial",
    descEn: "Classic Indonesian fried rice with sunny-side up egg and chicken satay.",
    descId: "Nasi goreng klasik Indonesia dengan telur mata sapi dan sate ayam.",
    emoji: "🍳",
  },
  {
    id: 2,
    titleEn: "Klepon",
    titleId: "Klepon",
    descEn: "Sweet rice cake balls filled with molten palm sugar and coated in grated coconut.",
    descId: "Kue beras manis berisi gula aren cair dan dibalut parutan kelapa.",
    emoji: "🥥",
  },
  {
    id: 3,
    titleEn: "Beef Rendang",
    titleId: "Rendang Sapi",
    descEn: "Rich, slow-cooked beef stew with coconut milk and complex spices.",
    descId: "Rebusan daging sapi yang kaya rasa, dimasak perlahan dengan santan dan rempah kompleks.",
    emoji: "🥩",
  },
  {
    id: 4,
    titleEn: "Martabak Manis",
    titleId: "Martabak Manis",
    descEn: "Thick, sweet pancake filled with chocolate, cheese, and crushed peanuts.",
    descId: "Pancake tebal manis dengan isian cokelat, keju, dan kacang tanah.",
    emoji: "🥞",
  },
];

export function FeaturedRecipes() {
  const { language, t } = useI18n();

  return (
    <section id="recipes" className="w-full bg-white py-24 dark:bg-zinc-950 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {t("featured.title")}
          </h2>
          <p className="mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {t("featured.subtitle")}
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="flex flex-col overflow-hidden">
              <div className="aspect-[16/9] w-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-5xl">
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
