"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "◆" },
  { href: "/admin/posts", label: "Posts", icon: "✦" },
  { href: "/admin/media", label: "Media", icon: "◎" },
];

const adminOnlyItems = [
  { href: "/admin/users", label: "Users", icon: "◇" },
];

interface AdminSidebarProps {
  userRole: string;
  userName: string;
}

export function AdminSidebar({ userRole, userName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const allItems = userRole === "admin" ? [...navItems, ...adminOnlyItems] : navItems;

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-void-border bg-void/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <Link href="/admin" className="font-serif text-sm text-void-heading">
          Void Admin
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-void-muted"
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 flex h-full w-56 flex-col border-r border-void-border bg-void-surface transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-void-border px-5 py-5">
          <Link href="/admin" className="font-serif text-sm text-void-heading">
            Void Admin
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {allItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive(item.href)
                  ? "bg-void-elevated text-void-heading"
                  : "text-void-muted hover:bg-void-elevated hover:text-void-text"
              )}
            >
              <span className="text-xs">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-void-border px-3 py-4">
          <div className="mb-3 px-3">
            <p className="text-xs text-void-subtle truncate">{userName}</p>
            <p className="text-xs text-void-muted capitalize">{userRole}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-void-muted transition-colors hover:bg-void-elevated hover:text-void-text"
          >
            <span className="text-xs">↗</span>
            Sign out
          </button>
          <Link
            href="/"
            className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-void-muted transition-colors hover:bg-void-elevated hover:text-void-text"
          >
            <span className="text-xs">←</span>
            View site
          </Link>
        </div>
      </aside>
    </>
  );
}
