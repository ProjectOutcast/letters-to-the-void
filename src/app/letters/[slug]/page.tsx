import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getPostBySlug } from "@/lib/posts";
import { formatDate, readingTime, SITE_URL, SITE_NAME } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name],
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    image: post.coverImage
      ? `${SITE_URL}${post.coverImage}`
      : undefined,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-6 pt-24 pb-16">
        {/* Cover image */}
        {post.coverImage && (
          <div className="animate-fade-in relative -mx-6 mb-10 aspect-[2/1] overflow-hidden md:mx-0 md:rounded-xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
          </div>
        )}

        {/* Header */}
        <header className="animate-fade-in-up mb-12">
          <h1 className="font-serif text-3xl font-medium leading-tight text-void-heading md:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-void-muted">
            <span>{post.author.name}</span>
            <span className="text-void-border">&middot;</span>
            <time dateTime={post.publishedAt?.toISOString()}>
              {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
            </time>
            <span className="text-void-border">&middot;</span>
            <span>{readingTime(post.contentHtml)}</span>
          </div>
          <div className="mt-8 h-px bg-void-border" />
        </header>

        {/* Content */}
        <div
          className="prose-void animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Back link */}
        <div className="mt-16 border-t border-void-border pt-8">
          <Link
            href="/letters"
            className="text-sm text-void-muted transition-colors hover:text-void-text"
          >
            &larr; Back to letters
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
