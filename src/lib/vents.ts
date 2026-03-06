import { db } from "@/db";
import { vents } from "@/db/schema";
import { desc, gt, lt } from "drizzle-orm";

export function getRecentVents(limit = 50) {
  const now = new Date();
  return db
    .select()
    .from(vents)
    .where(gt(vents.expiresAt, now))
    .orderBy(desc(vents.createdAt))
    .limit(limit)
    .all();
}

export function createVent(
  content: string,
  latitude: number,
  longitude: number
) {
  return db
    .insert(vents)
    .values({ content, latitude, longitude })
    .returning()
    .get();
}

export function cleanupExpiredVents() {
  const now = new Date();
  return db.delete(vents).where(lt(vents.expiresAt, now)).run();
}
