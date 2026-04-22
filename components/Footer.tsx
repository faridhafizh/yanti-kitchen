"use client";

import { useI18n } from "@/lib/i18n";
import { usePathname } from "next/navigation";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const pathname = usePathname();

  return (
    <footer className="w-full border-t border-earth/20 bg-pale/70 backdrop-blur-lg py-8 dark:border-earth/30 dark:bg-stone-950/70 texture-linen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {pathname !== "/admin/login" && (
            <div className="text-2xl font-caveat text-earth dark:text-cream">
              Yanti&apos;s Kitchen
            </div>
          )}
          <p className="text-sm text-earth/70 dark:text-cream/70">
            © {year} {pathname !== "/admin/login" ? "Yanti's Kitchen. " : ""}{t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
