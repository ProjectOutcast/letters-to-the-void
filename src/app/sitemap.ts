import type { MetadataRoute } from "next";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const publishedPosts = db
    .select({ slug: posts.slug, updatedAt: posts.updatedAt })
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .all();

  const postEntries = publishedPosts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/about`, lastModified: new Date() },
    ...postEntries,
  ];
}
