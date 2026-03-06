import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { hashSync } from "bcryptjs";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import path from "path";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const sqlite = new Database(
  path.join(process.cwd(), "letters-to-the-void.db")
);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle(sqlite);

// Run migrations first
migrate(db, { migrationsFolder: "./drizzle" });

async function seed() {
  console.log("Seeding database...");

  // Check if admin already exists
  const existing = db
    .select()
    .from(users)
    .where(eq(users.email, "admin@letterstothevoid.com"))
    .get();

  if (existing) {
    console.log("Admin user already exists, skipping.");
  } else {
    db.insert(users)
      .values({
        name: "Void Admin",
        email: "admin@letterstothevoid.com",
        passwordHash: hashSync("voidwalker", 12),
        role: "admin",
      })
      .run();

    console.log("Admin user created:");
    console.log("  Email: admin@letterstothevoid.com");
    console.log("  Password: voidwalker");
    console.log("  (Change this password after first login!)");
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed();
