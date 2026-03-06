import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth-config";
import { hashSync } from "bcryptjs";
import { desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .all();

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  if (!body.name || !body.email || !body.password) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 }
    );
  }

  try {
    const result = db
      .insert(users)
      .values({
        name: body.name,
        email: body.email,
        passwordHash: hashSync(body.password, 12),
        role: body.role || "editor",
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .get();

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 400 }
    );
  }
}
