import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { auth } from "@/lib/auth-config";
import { eq } from "drizzle-orm";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const post = db.select().from(posts).where(eq(posts.id, id)).get();
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (body.title !== undefined) updateData.title = body.title;
  if (body.slug !== undefined) updateData.slug = body.slug;
  if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
  if (body.content !== undefined) updateData.content = body.content;
  if (body.contentHtml !== undefined) updateData.contentHtml = body.contentHtml;
  if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.featured !== undefined) updateData.featured = body.featured;
  if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
  if (body.metaDescription !== undefined)
    updateData.metaDescription = body.metaDescription;
  if (body.publishedAt !== undefined)
    updateData.publishedAt = body.publishedAt
      ? new Date(body.publishedAt)
      : null;

  const result = db
    .update(posts)
    .set(updateData)
    .where(eq(posts.id, id))
    .returning()
    .get();

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  db.delete(posts).where(eq(posts.id, id)).run();

  return NextResponse.json({ success: true });
}
