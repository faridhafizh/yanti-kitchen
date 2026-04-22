"use client";

import Link from "next/link";
import { Moon, Sun, Menu, X } from "lucide-react";
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
    <nav className="sticky top-0 z-50 w-full border-b border-earth/20 bg-pale/80 backdrop-blur-md dark:border-earth/30 dark:bg-stone-950/80 texture-linen">
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
          <Link href="/" className="flex items-center gap-2 text-2xl font-caveat tracking-wide text-earth dark:text-cream">
            <div className="relative h-8 w-8 dark:invert opacity-80">
              <Image src="/logo.svg" alt="Yanti's Kitchen Logo" fill className="object-contain" />
            </div>
            Yanti&apos;s Kitchen
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-base">
            <Link href="/" onClick={handleHomeClick} className="text-earth/80 hover:text-earth dark:text-cream/80 dark:hover:text-cream transition-colors">
              {t("nav.home")}
            </Link>
            <Link href="/recipes" className="text-earth/80 hover:text-earth dark:text-cream/80 dark:hover:text-cream transition-colors">
              {t("nav.recipes")}
            </Link>
            <Link href="/about" className="text-earth/80 hover:text-earth dark:text-cream/80 dark:hover:text-cream transition-colors">
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

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-earth/20 bg-pale/95 backdrop-blur-lg dark:border-earth/30 dark:bg-stone-950/95 overflow-hidden texture-linen"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4 text-lg">
              <Link
                href="/"
                className="text-earth/80 hover:text-earth dark:text-cream/80 dark:hover:text-cream"
                onClick={handleHomeClick}
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/recipes"
                className="text-earth/80 hover:text-earth dark:text-cream/80 dark:hover:text-cream"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.recipes")}
              </Link>
              <Link
                href="/about"
                className="text-earth/80 hover:text-earth dark:text-cream/80 dark:hover:text-cream"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.about")}
              </Link>
              <Link
                href="/admin/login"
                className="text-earth/80 hover:text-earth dark:text-cream/80 dark:hover:text-cream"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
