import { NextResponse } from "next/server";
import { db } from "@/db";
import { media } from "@/db/schema";
import { auth } from "@/lib/auth-config";
import { desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = db
    .select()
    .from(media)
    .orderBy(desc(media.createdAt))
    .all();

  return NextResponse.json(items);
}
