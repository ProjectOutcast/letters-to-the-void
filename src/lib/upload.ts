import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_WIDTH = 1600;

export async function processAndSaveImage(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Allowed: JPEG, PNG, GIF, WebP");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("File too large. Maximum size is 5MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const id = randomUUID();
  const now = new Date();
  const dir = `uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const filename = `${id}.webp`;
  const fullDir = path.join(process.cwd(), "public", dir);

  await fs.mkdir(fullDir, { recursive: true });

  const metadata = await sharp(buffer).metadata();

  await sharp(buffer)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(fullDir, filename));

  const stats = await fs.stat(path.join(fullDir, filename));

  const finalWidth = Math.min(metadata.width || 0, MAX_WIDTH);
  const aspectRatio =
    metadata.width && metadata.height
      ? metadata.height / metadata.width
      : 1;
  const finalHeight = Math.round(finalWidth * aspectRatio);

  return {
    storedFilename: filename,
    url: `/${dir}/${filename}`,
    width: finalWidth,
    height: finalHeight,
    size: stats.size,
    mimeType: "image/webp" as const,
    originalFilename: file.name,
  };
}

export async function deleteImageFile(url: string) {
  const filePath = path.join(process.cwd(), "public", url);
  try {
    await fs.unlink(filePath);
  } catch {
    // File may already be deleted
  }
}
