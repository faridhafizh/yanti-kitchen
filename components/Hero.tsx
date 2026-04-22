"use client";

import { useI18n } from "@/lib/i18n";
import { Button } from "./ui/button";
import Link from "next/link";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative w-full overflow-hidden py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-caveat tracking-wide text-earth sm:text-7xl dark:text-cream">
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-earth/80 dark:text-cream/80">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/recipes">
                  {t("hero.cta")}
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl shadow-lg border border-earth/20 texture-ceramic">
              {/* Note: In a real app, replace this with an actual image of food. Using a placeholder for now. */}
              <div className="absolute inset-0 bg-cream/50 dark:bg-stone-800/50 flex items-center justify-center mix-blend-multiply dark:mix-blend-screen">
                 <span className="text-6xl opacity-80">🍲</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
