import "server-only";

import { and, count, desc, eq, like } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  adminUsers,
  auditLogs,
  messages,
  quittanceRequests,
  type QuittanceStatus,
} from "@/lib/db/schema";
import { formatQuittanceNumber } from "@/lib/references";

export async function getAdminEmails() {
  const rows = await db.select({ email: adminUsers.email }).from(adminUsers);
  const extra = (process.env.ADMIN_NOTIFICATION_EMAIL ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return Array.from(new Set([...rows.map((row) => row.email), ...extra]));
}

export async function getPendingQuittanceCount() {
  const [row] = await db
    .select({ value: count() })
    .from(quittanceRequests)
    .where(eq(quittanceRequests.status, "pending"));
  return row?.value ?? 0;
}

export async function getNewMessageCount() {
  const [row] = await db
    .select({ value: count() })
    .from(messages)
    .where(eq(messages.status, "new"));
  return row?.value ?? 0;
}

export async function getQuittanceStats() {
  const rows = await db
    .select({ status: quittanceRequests.status, value: count() })
    .from(quittanceRequests)
    .groupBy(quittanceRequests.status);

  const totals: Record<QuittanceStatus, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  for (const row of rows) {
    totals[row.status] = row.value;
  }

  return totals;
}

/**
 * Sequential yearly number, e.g. FORTIS-2026-0001.
 * The unique index on quittance_number remains the final guard against races.
 */
export async function nextQuittanceNumber() {
  const year = new Date().getFullYear();
  const prefix = `FORTIS-${year}-`;
  const rows = await db
    .select({ number: quittanceRequests.quittanceNumber })
    .from(quittanceRequests)
    .where(like(quittanceRequests.quittanceNumber, `${prefix}%`));

  let max = 0;
  for (const row of rows) {
    if (!row.number) continue;
    const parsed = Number.parseInt(row.number.slice(prefix.length), 10);
    if (Number.isFinite(parsed) && parsed > max) max = parsed;
  }

  return formatQuittanceNumber(year, max + 1);
}

export async function recentQuittances(limit = 8) {
  return db
    .select()
    .from(quittanceRequests)
    .orderBy(desc(quittanceRequests.createdAt))
    .limit(limit);
}

export async function writeAudit(input: {
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await db.insert(auditLogs).values({
      id: `audit_${crypto.randomUUID()}`,
      actorEmail: input.actorEmail,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    });
  } catch (error) {
    console.error("[audit] écriture impossible", error);
  }
}

export async function findQuittanceById(id: string) {
  const [row] = await db
    .select()
    .from(quittanceRequests)
    .where(eq(quittanceRequests.id, id))
    .limit(1);
  return row ?? null;
}

export async function findQuittanceByToken(token: string) {
  const [row] = await db
    .select()
    .from(quittanceRequests)
    .where(eq(quittanceRequests.publicToken, token))
    .limit(1);
  return row ?? null;
}

export async function findApprovedQuittanceByNumber(number: string) {
  const [row] = await db
    .select()
    .from(quittanceRequests)
    .where(
      and(
        eq(quittanceRequests.quittanceNumber, number),
        eq(quittanceRequests.status, "approved"),
      ),
    )
    .limit(1);
  return row ?? null;
}
