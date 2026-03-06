import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { auth } from "@/lib/auth-config";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all");

  if (all) {
    // Admin: return all posts with author names
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        status: posts.status,
        featured: posts.featured,
        createdAt: posts.createdAt,
        publishedAt: posts.publishedAt,
        authorName: users.name,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .orderBy(desc(posts.createdAt))
      .all();

    return NextResponse.json(results);
  }

  // Public: return published posts
  const results = db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      coverImage: posts.coverImage,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .all();

  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const existing = db
    .select()
    .from(posts)
    .where(eq(posts.slug, body.slug))
    .get();

  if (existing) {
    return NextResponse.json(
      { error: "A post with this slug already exists" },
      { status: 400 }
    );
  }

  const result = db
    .insert(posts)
    .values({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      contentHtml: body.contentHtml,
      coverImage: body.coverImage,
      status: body.status || "draft",
      featured: body.featured || false,
      authorId: session.user.id,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
    })
    .returning()
    .get();

  return NextResponse.json(result, { status: 201 });
}
