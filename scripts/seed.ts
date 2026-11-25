/**
 * Creates the first administrator account.
 * Usage: npm run db:seed
 *
 * Reads ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_NAME from the environment
 * (or .env.local / .env). If ADMIN_PASSWORD is missing, a strong password is
 * generated and printed once — copy it, it is not stored in clear text.
 */
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomBytes } from "node:crypto";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { loadEnv } from "./env";
import { adminUsers } from "../src/lib/db/schema";

loadEnv();

function databaseUrl() {
  return process.env.TURSO_DATABASE_URL?.trim() || "file:./data/fortis.db";
}

function generatePassword() {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*-_";
  const bytes = randomBytes(20);
  return Array.from(bytes)
    .map((byte) => alphabet[byte % alphabet.length])
    .join("");
}

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@fortis.bj").trim().toLowerCase();
  const name = (process.env.ADMIN_NAME ?? "Administration FORTIS").trim();
  let password = process.env.ADMIN_PASSWORD ?? "";
  let generated = false;

  if (!password) {
    password = generatePassword();
    generated = true;
  }

  if (password.length < 10) {
    console.error(
      "[seed] ADMIN_PASSWORD trop court : 10 caractères minimum requis.",
    );
    process.exit(1);
  }

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

  const [existing] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    if (!generated) {
      await db
        .update(adminUsers)
        .set({ name, passwordHash })
        .where(eq(adminUsers.id, existing.id));
      console.log(`[seed] mot de passe mis à jour pour ${email}.`);
    } else {
      console.log(`[seed] administrateur ${email} déjà présent — inchangé.`);
    }
  } else {
    await db.insert(adminUsers).values({
      id: `admin_${randomBytes(12).toString("hex")}`,
      email,
      name,
      passwordHash,
    });
    console.log(`[seed] administrateur créé : ${email}`);
  }

  if (generated) {
    console.log("");
    console.log("  Mot de passe généré (affiché une seule fois) :");
    console.log(`  ${password}`);
    console.log("");
    console.log("  Conservez-le dans votre gestionnaire de mots de passe.");
  }

  client.close();
}

main().catch((error) => {
  console.error("[seed] échec", error);
  process.exit(1);
});
