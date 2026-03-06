import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "letters-to-the-void.db");

// During build on Railway, the DB file won't exist.
// Create it if missing so better-sqlite3 doesn't crash.
// The seed script / migrations will populate it at deploy time.
if (!fs.existsSync(dbPath)) {
  // Touch the file so better-sqlite3 can open it
  fs.writeFileSync(dbPath, "");
}

const sqlite = new Database(dbPath);

sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
