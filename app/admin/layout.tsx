"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // Don't show sidebar on login/register page
  if (pathname === "/admin/login" || pathname === "/admin/register") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full bg-stone-50 dark:bg-stone-950">
      {/* Sidebar */}
      <div className="w-64 border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 hidden md:flex md:flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">Yanti Admin</h2>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          <Link
            href="/admin"
            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              pathname === '/admin'
                ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-50'
                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50'
            }`}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/recipes"
            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              pathname.startsWith('/admin/recipes')
                ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-50'
                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50'
            }`}
          >
            <BookOpen className="mr-3 h-5 w-5" />
            Recipes
          </Link>
        </nav>
        {/* Logout pinned to sidebar bottom */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800">
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">Yanti Admin</h2>
          <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
