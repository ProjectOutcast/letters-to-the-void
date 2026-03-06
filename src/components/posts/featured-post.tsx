import Link from "next/link";
import { formatDate, readingTime } from "@/lib/utils";
import type { PostWithAuthor } from "@/types";

export function FeaturedPost({ post }: { post: PostWithAuthor }) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="relative overflow-hidden rounded-xl border border-void-border transition-all duration-200 hover:border-void-border-hover">
        {post.coverImage ? (
          <div className="relative aspect-[21/9]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <FeaturedContent post={post} />
            </div>
          </div>
        ) : (
          <div className="bg-void-surface p-8">
            <FeaturedContent post={post} />
          </div>
        )}
      </article>
    </Link>
  );
}

function FeaturedContent({ post }: { post: PostWithAuthor }) {
  return (
    <>
      <span className="inline-block rounded-full bg-void-white/10 px-3 py-1 text-xs text-void-white backdrop-blur-sm">
        Featured
      </span>
      <h2 className="mt-3 font-serif text-2xl font-medium text-void-white transition-colors group-hover:text-white md:text-3xl">
        {post.title}
      </h2>
      {post.excerpt && (
        <p className="mt-2 max-w-2xl text-sm text-void-accent">
          {post.excerpt}
        </p>
      )}
      <div className="mt-4 flex items-center gap-3 text-xs text-void-accent">
        <span>{post.author.name}</span>
        <span className="opacity-40">&middot;</span>
        <time dateTime={post.publishedAt?.toISOString()}>
          {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
        </time>
        <span className="opacity-40">&middot;</span>
        <span>{readingTime(post.contentHtml)}</span>
      </div>
    </>
  );
}
