import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-config";
import { db } from "@/db";
import { media } from "@/db/schema";
import { processAndSaveImage } from "@/lib/upload";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const result = await processAndSaveImage(file);

    const record = db
      .insert(media)
      .values({
        filename: result.originalFilename,
        storedFilename: result.storedFilename,
        mimeType: result.mimeType,
        size: result.size,
        width: result.width,
        height: result.height,
        url: result.url,
        uploadedBy: session.user.id,
      })
      .returning()
      .get();

    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
