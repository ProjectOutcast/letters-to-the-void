import Link from "next/link";
import { Header } from "@/components/layout/header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="animate-fade-in text-center">
          <p className="text-6xl font-light text-void-border">404</p>
          <h1 className="mt-4 font-serif text-2xl text-void-heading">
            Lost in the Void
          </h1>
          <p className="mt-2 text-sm text-void-muted">
            This letter was never written, or has been reclaimed by the darkness.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block text-sm text-void-subtle transition-colors hover:text-void-text"
          >
            &larr; Return to the void
          </Link>
        </div>
      </main>
    </>
  );
}
