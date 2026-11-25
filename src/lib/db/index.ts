import "server-only";

import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

function createDb() {
  const url = process.env.TURSO_DATABASE_URL ?? "file:./data/fortis.db";

  // A local libSQL database is a plain file. Make sure its folder exists
  // before the client tries to create it.
  if (url.startsWith("file:")) {
    const filePath = url.slice("file:".length);
    mkdirSync(dirname(resolve(process.cwd(), filePath)), { recursive: true });
  }

  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  });

  return drizzle(client, { schema });
}

const globalForDb = globalThis as unknown as {
  fortisDb?: ReturnType<typeof createDb>;
};

export const db = globalForDb.fortisDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.fortisDb = db;
}
