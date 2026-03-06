import Link from "next/link";
import Image from "next/image";
import { formatDate, readingTime } from "@/lib/utils";
import type { PostWithAuthor } from "@/types";

export function PostCard({ post }: { post: PostWithAuthor }) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="overflow-hidden rounded-lg border border-void-border bg-void-surface transition-all duration-200 hover:border-void-border-hover hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]">
        {post.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
          </div>
        )}
        <div className="p-5">
          <h2 className="font-serif text-xl font-medium text-void-heading transition-colors group-hover:text-void-white">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm text-void-muted">
              {post.excerpt}
            </p>
          )}
          <div className="mt-4 flex items-center gap-3 text-xs text-void-muted">
            <span>{post.author.name}</span>
            <span className="text-void-border">&middot;</span>
            <time dateTime={post.publishedAt?.toISOString()}>
              {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
            </time>
            <span className="text-void-border">&middot;</span>
            <span>{readingTime(post.contentHtml)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
