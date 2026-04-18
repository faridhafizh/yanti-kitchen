"use client";

import Link from "next/link";
import { Utensils } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "./ui/button";

export function Navbar() {
  const { language, setLanguage, t } = useI18n();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          <Utensils className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
          Yanti&apos;s Kitchen
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              {t("nav.home")}
            </Link>
            <Link href="#recipes" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              {t("nav.recipes")}
            </Link>
            <Link href="#" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              {t("nav.about")}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
              className="text-xs"
            >
              EN
            </Button>
            <Button
              variant={language === "id" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("id")}
              className="text-xs"
            >
              ID
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
