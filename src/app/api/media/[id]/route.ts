import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { media } from "@/db/schema";
import { auth } from "@/lib/auth-config";
import { eq } from "drizzle-orm";
import { deleteImageFile } from "@/lib/upload";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const result = db
    .update(media)
    .set({ alt: body.alt })
    .where(eq(media.id, id))
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
  const item = db.select().from(media).where(eq(media.id, id)).get();

  if (item) {
    await deleteImageFile(item.url);
    db.delete(media).where(eq(media.id, id)).run();
  }

  return NextResponse.json({ success: true });
}
