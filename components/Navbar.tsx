"use client";

import Link from "next/link";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export function Navbar() {
  const { language, setLanguage, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Ensuring the component is mounted before rendering theme-dependent UI
    const mountTimeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(mountTimeout);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-stone-200/50 bg-white/70 backdrop-blur-lg dark:border-stone-800/50 dark:bg-black/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            <div className="relative h-8 w-8 dark:invert">
              <Image src="/logo.svg" alt="Yanti's Kitchen Logo" fill className="object-contain" />
            </div>
            Yanti&apos;s Kitchen
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#" className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50">
              {t("nav.home")}
            </Link>
            <Link href="/recipes" className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50">
              {t("nav.recipes")}
            </Link>
            <Link href="#" className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50">
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
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle Dark Mode"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200/50 bg-white/95 backdrop-blur-lg dark:border-stone-800/50 dark:bg-black/95">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/recipes"
              className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.recipes")}
            </Link>
            <Link
              href="#"
              className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/admin/login"
              className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
