import RSS from "rss";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/utils";

export async function GET() {
  const feed = new RSS({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.xml`,
    language: "en",
  });

  const publishedPosts = db
    .select({
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      contentHtml: posts.contentHtml,
      publishedAt: posts.publishedAt,
      authorName: users.name,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(20)
    .all();

  for (const post of publishedPosts) {
    feed.item({
      title: post.title,
      description: post.excerpt || "",
      url: `${SITE_URL}/posts/${post.slug}`,
      date: post.publishedAt || new Date(),
      author: post.authorName || "Unknown",
    });
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
