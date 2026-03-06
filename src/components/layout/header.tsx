"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-void-border bg-void/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-serif text-lg tracking-wide text-void-heading transition-colors hover:text-void-white"
        >
          Letters to The Void
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm text-void-muted transition-colors hover:text-void-text"
          >
            Letters
          </Link>
          <Link
            href="/about"
            className="text-sm text-void-muted transition-colors hover:text-void-text"
          >
            About
          </Link>
          <Link
            href="/feed.xml"
            className="text-sm text-void-muted transition-colors hover:text-void-text"
            target="_blank"
          >
            RSS
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              "block h-px w-5 bg-void-text transition-all duration-200",
              menuOpen && "translate-y-[3.5px] rotate-45"
            )}
          />
          <span
            className={cn(
              "block h-px w-5 bg-void-text transition-all duration-200",
              menuOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "block h-px w-5 bg-void-text transition-all duration-200",
              menuOpen && "-translate-y-[3.5px] -rotate-45"
            )}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-void-border transition-all duration-300 md:hidden",
          menuOpen ? "max-h-48" : "max-h-0 border-t-transparent"
        )}
      >
        <div className="flex flex-col gap-4 px-6 py-4">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-void-muted transition-colors hover:text-void-text"
          >
            Letters
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-void-muted transition-colors hover:text-void-text"
          >
            About
          </Link>
          <Link
            href="/feed.xml"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-void-muted transition-colors hover:text-void-text"
            target="_blank"
          >
            RSS
          </Link>
        </div>
      </div>
    </header>
  );
}
