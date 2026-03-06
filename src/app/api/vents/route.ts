import { NextRequest, NextResponse } from "next/server";
import { getRecentVents, createVent, cleanupExpiredVents } from "@/lib/vents";
import { checkRateLimit } from "@/lib/rate-limit";
import { moderateContent } from "@/lib/moderation";
import { pushVentToSubscribers } from "./stream/subscribers";

export const dynamic = "force-dynamic";

export async function GET() {
  cleanupExpiredVents();
  const recent = getRecentVents(50);
  return NextResponse.json(recent);
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: "The void needs a moment. Try again later.",
        retryAfterMs: rateCheck.retryAfterMs,
      },
      { status: 429 }
    );
  }

  const body = await req.json();
  const content = (body.content || "").trim();

  if (!content || content.length > 280) {
    return NextResponse.json(
      { error: "Content must be 1-280 characters" },
      { status: 400 }
    );
  }

  const lat = Number(body.latitude);
  const lon = Number(body.longitude);
  if (
    isNaN(lat) ||
    isNaN(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return NextResponse.json(
      { error: "Invalid coordinates" },
      { status: 400 }
    );
  }

  const modResult = moderateContent(content);
  if (!modResult.allowed) {
    // Shadow ban: return fake success — user sees their bubble animate
    return NextResponse.json(
      {
        id: crypto.randomUUID(),
        content,
        latitude: lat,
        longitude: lon,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400 * 1000).toISOString(),
      },
      { status: 201 }
    );
  }

  const vent = createVent(content, lat, lon);
  pushVentToSubscribers(vent);
  return NextResponse.json(vent, { status: 201 });
}
