import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-void-border py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="text-xs text-void-muted">
          &copy; {new Date().getFullYear()} Letters to The Void
        </p>
        <div className="flex gap-6">
          <Link
            href="/"
            className="text-xs text-void-muted transition-colors hover:text-void-text"
          >
            Vents
          </Link>
          <Link
            href="/letters"
            className="text-xs text-void-muted transition-colors hover:text-void-text"
          >
            Letters
          </Link>
          <Link
            href="/about"
            className="text-xs text-void-muted transition-colors hover:text-void-text"
          >
            About
          </Link>
          <Link
            href="/feed.xml"
            className="text-xs text-void-muted transition-colors hover:text-void-text"
            target="_blank"
          >
            RSS
          </Link>
        </div>
      </div>
    </footer>
  );
}
