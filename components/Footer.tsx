"use client";

import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Yanti&apos;s Kitchen
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            © {year} Yanti&apos;s Kitchen. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
