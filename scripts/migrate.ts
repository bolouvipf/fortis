/**
 * Applies the SQL migrations in ./drizzle to the configured database.
 * Usage: npm run db:migrate
 */
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

function databaseUrl() {
  return process.env.TURSO_DATABASE_URL?.trim() || "file:./data/fortis.db";
}

async function main() {
  const url = databaseUrl();

  if (url.startsWith("file:")) {
    const filePath = url.slice("file:".length);
    mkdirSync(dirname(resolve(process.cwd(), filePath)), { recursive: true });
  }

  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  });

  const db = drizzle(client);

  console.log(`[migrate] base : ${url.startsWith("file:") ? "fichier local" : "Turso"}`);
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("[migrate] migrations appliquées.");

  client.close();
}

main().catch((error) => {
  console.error("[migrate] échec", error);
  process.exit(1);
});
