"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "id";

type Dictionary = {
  [key in Language]: {
    [key: string]: string;
  };
};

const dictionary: Dictionary = {
  en: {
    "nav.home": "Home",
    "nav.recipes": "Recipes",
    "nav.about": "About",
    "hero.title": "Welcome to Yanti's Kitchen",
    "hero.subtitle": "Discover authentic Indonesian recipes, snacks, and traditional cakes.",
    "hero.cta": "Browse Recipes",
    "featured.title": "Featured Recipes",
    "featured.subtitle": "Try our most loved dishes",
    "recipe.view": "View Recipe",
    "footer.rights": "All rights reserved.",
  },
  id: {
    "nav.home": "Beranda",
    "nav.recipes": "Resep",
    "nav.about": "Tentang",
    "hero.title": "Selamat Datang di Dapur Yanti",
    "hero.subtitle": "Temukan resep masakan autentik Indonesia, jajanan, dan kue tradisional.",
    "hero.cta": "Lihat Resep",
    "featured.title": "Resep Pilihan",
    "featured.subtitle": "Cobalah hidangan favorit kami",
    "recipe.view": "Lihat Resep",
    "footer.rights": "Hak cipta dilindungi.",
  },
};

interface I18nContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return dictionary[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
