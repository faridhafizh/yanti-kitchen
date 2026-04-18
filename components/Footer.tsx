"use client";

import { useI18n } from "@/lib/i18n";
import { usePathname } from "next/navigation";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const pathname = usePathname();

  return (
    <footer className="w-full border-t border-stone-200/50 bg-white/70 backdrop-blur-lg py-8 dark:border-stone-800/50 dark:bg-black/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {pathname !== "/admin/login" && (
            <div className="text-lg font-bold text-stone-900 dark:text-stone-50">
              Yanti&apos;s Kitchen
            </div>
          )}
          <p className="text-sm text-stone-500 dark:text-stone-400">
            © {year} {pathname !== "/admin/login" ? "Yanti's Kitchen. " : ""}{t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
