"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { recipes } from "@/lib/recipes";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export function RecipeSearch() {
  const { language, t } = useI18n();
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== "") {
      setHasSearched(true);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    if (!query) return true;
    const searchStr = query.toLowerCase();
    const title = language === "en" ? recipe.titleEn.toLowerCase() : recipe.titleId.toLowerCase();
    const desc = language === "en" ? recipe.descEn.toLowerCase() : recipe.descId.toLowerCase();
    return title.includes(searchStr) || desc.includes(searchStr);
  });

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] bg-stone-50 dark:bg-black">
      <motion.div
        layout
        className={`flex flex-col w-full ${hasSearched ? "pt-12 px-4 sm:px-6 lg:px-8" : "flex-1 items-center justify-center px-4"}`}
      >
        <motion.div
          layout
          className={`w-full ${hasSearched ? "max-w-3xl mx-auto" : "max-w-xl"}`}
        >
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim() !== "") {
                  setHasSearched(true);
                } else {
                  setHasSearched(false);
                }
              }}
              placeholder={t("search.placeholder")}
              className="w-full h-14 pl-6 pr-14 text-lg rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 transition-shadow"
            />
            <button
              type="submit"
              className="absolute right-2 p-3 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full container mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8"
          >
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredRecipes.map((recipe) => (
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
            ) : (
              <div className="text-center py-20 text-stone-500 dark:text-stone-400 text-lg">
                {t("search.no_results")}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
