"use client";

import { useI18n } from "@/lib/i18n";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

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
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
                alt="Indonesian cuisine spread"
                fill
                className="object-cover opacity-90"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
