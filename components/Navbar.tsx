"use client";

import Link from "next/link";
import { Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { language, setLanguage, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    // Ensuring the component is mounted before rendering theme-dependent UI
    const mountTimeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(mountTimeout);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50 p-4 md:px-8 flex justify-center pointer-events-none">
      <nav className="w-full max-w-screen-2xl bg-[#eaeaeb] dark:bg-[#2a2a2b] rounded-[16px] pointer-events-auto shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-6 w-6 dark:invert opacity-80">
                <Image src="/logo.svg" alt="Yanti's Kitchen Logo" fill className="object-contain" />
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-6 text-[15px] font-medium text-stone-900 dark:text-stone-100 font-sans">
              <Link href="/" onClick={handleHomeClick} className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                {t("nav.home")}
                <ChevronDown className="h-4 w-4" />
              </Link>
              <Link href="/recipes" className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                {t("nav.recipes")}
                <ChevronDown className="h-4 w-4" />
              </Link>
              <Link href="/about" className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                {t("nav.about")}
                <ChevronDown className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="font-medium font-sans flex items-center gap-1 text-[15px] hover:bg-transparent px-0 text-stone-900 dark:text-stone-100"
                onClick={() => setLanguage(language === "en" ? "id" : "en")}
              >
                {language.toUpperCase()}
                <ChevronDown className="h-4 w-4" />
              </Button>

              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 text-stone-900 dark:text-stone-100"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle Dark Mode"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}

              <Button
                variant="outline"
                className="rounded-full bg-white dark:bg-[#1a1a1b] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 font-sans font-medium text-[15px] px-6 h-10"
                asChild
              >
                <Link href="/admin/login">Login</Link>
              </Button>
              <Button
                className="rounded-full bg-stone-900 dark:bg-stone-800 text-white dark:text-stone-100 hover:bg-stone-800 dark:hover:bg-stone-200 font-sans font-medium text-[15px] px-6 h-10"
                asChild
              >
                <Link href="/recipes">Recipes</Link>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-stone-900 dark:text-stone-100"
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden bg-[#eaeaeb] dark:bg-[#2a2a2b] rounded-b-[16px]"
            >
              <div className="px-6 py-6 flex flex-col gap-6 text-[17px] font-medium font-sans text-stone-900 dark:text-stone-100 border-t border-stone-200 dark:border-stone-700">
                <Link
                  href="/"
                  className="flex items-center justify-between"
                  onClick={handleHomeClick}
                >
                  {t("nav.home")}
                  <ChevronDown className="h-5 w-5" />
                </Link>
                <Link
                  href="/recipes"
                  className="flex items-center justify-between"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.recipes")}
                  <ChevronDown className="h-5 w-5" />
                </Link>
                <Link
                  href="/about"
                  className="flex items-center justify-between"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.about")}
                  <ChevronDown className="h-5 w-5" />
                </Link>

                <div className="pt-4 flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-full bg-white dark:bg-[#1a1a1b] text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700 h-12 text-[15px]"
                    asChild
                  >
                    <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button
                    className="w-full rounded-full bg-stone-900 dark:bg-stone-800 text-white dark:text-stone-100 h-12 text-[15px]"
                    asChild
                  >
                    <Link href="/recipes" onClick={() => setIsMobileMenuOpen(false)}>Recipes</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
