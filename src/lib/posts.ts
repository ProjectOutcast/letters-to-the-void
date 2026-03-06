import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import type { PostWithAuthor } from "@/types";

export function getPublishedPosts(
  limit = 20,
  offset = 0
): PostWithAuthor[] {
  const results = db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      contentHtml: posts.contentHtml,
      coverImage: posts.coverImage,
      status: posts.status,
      featured: posts.featured,
      authorId: posts.authorId,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      metaTitle: posts.metaTitle,
      metaDescription: posts.metaDescription,
      authorName: users.name,
      authorImage: users.image,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset)
    .all();

  return results.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    content: r.content,
    contentHtml: r.contentHtml,
    coverImage: r.coverImage,
    status: r.status,
    featured: r.featured,
    authorId: r.authorId,
    publishedAt: r.publishedAt,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    metaTitle: r.metaTitle,
    metaDescription: r.metaDescription,
    author: {
      id: r.authorId,
      name: r.authorName || "Unknown",
      image: r.authorImage,
    },
  }));
}

export function getFeaturedPost(): PostWithAuthor | null {
  const result = db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      contentHtml: posts.contentHtml,
      coverImage: posts.coverImage,
      status: posts.status,
      featured: posts.featured,
      authorId: posts.authorId,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      metaTitle: posts.metaTitle,
      metaDescription: posts.metaDescription,
      authorName: users.name,
      authorImage: users.image,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(and(eq(posts.status, "published"), eq(posts.featured, true)))
    .orderBy(desc(posts.publishedAt))
    .get();

  if (!result) return null;

  return {
    ...result,
    author: {
      id: result.authorId,
      name: result.authorName || "Unknown",
      image: result.authorImage,
    },
  };
}

export function getPostBySlug(slug: string): PostWithAuthor | null {
  const result = db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      contentHtml: posts.contentHtml,
      coverImage: posts.coverImage,
      status: posts.status,
      featured: posts.featured,
      authorId: posts.authorId,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      metaTitle: posts.metaTitle,
      metaDescription: posts.metaDescription,
      authorName: users.name,
      authorImage: users.image,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .get();

  if (!result) return null;

  return {
    ...result,
    author: {
      id: result.authorId,
      name: result.authorName || "Unknown",
      image: result.authorImage,
    },
  };
}

export function getAllPosts(): PostWithAuthor[] {
  const results = db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      contentHtml: posts.contentHtml,
      coverImage: posts.coverImage,
      status: posts.status,
      featured: posts.featured,
      authorId: posts.authorId,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      metaTitle: posts.metaTitle,
      metaDescription: posts.metaDescription,
      authorName: users.name,
      authorImage: users.image,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt))
    .all();

  return results.map((r) => ({
    ...r,
    author: {
      id: r.authorId,
      name: r.authorName || "Unknown",
      image: r.authorImage,
    },
  }));
}

export function getPostById(id: string) {
  return db.select().from(posts).where(eq(posts.id, id)).get();
}

export function getPostStats() {
  const total = db
    .select({ count: sql<number>`count(*)` })
    .from(posts)
    .get();
  const published = db
    .select({ count: sql<number>`count(*)` })
    .from(posts)
    .where(eq(posts.status, "published"))
    .get();
  const drafts = db
    .select({ count: sql<number>`count(*)` })
    .from(posts)
    .where(eq(posts.status, "draft"))
    .get();

  return {
    total: total?.count || 0,
    published: published?.count || 0,
    drafts: drafts?.count || 0,
  };
}
