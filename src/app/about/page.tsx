import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Letters to The Void — a space for thoughts cast into the darkness.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 pt-24 pb-16">
        <section className="animate-fade-in py-16">
          <h1 className="font-serif text-3xl font-medium text-void-heading md:text-4xl">
            About
          </h1>
          <div className="mt-8 h-px bg-void-border" />
        </section>

        <div className="animate-fade-in-up space-y-6 font-serif text-lg leading-relaxed text-void-text">
          <p>
            This is a space where thoughts exist without expectation. Letters
            written not to be answered, but to be released — cast into the
            void between signal and silence.
          </p>
          <p>
            Some words are too heavy to carry and too light to hold. They
            belong here, in this dark and quiet place where meaning finds
            its own gravity.
          </p>
          <p className="text-void-muted">
            Nothing is expected of you. Read, or don&apos;t. The void is
            patient.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
