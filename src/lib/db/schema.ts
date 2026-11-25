import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const quittanceStatuses = ["pending", "approved", "rejected"] as const;
export type QuittanceStatus = (typeof quittanceStatuses)[number];

export const emailStatuses = ["pending", "sent", "failed", "skipped"] as const;
export type EmailStatus = (typeof emailStatuses)[number];

export const messageTypes = ["contact", "prestation"] as const;
export type MessageType = (typeof messageTypes)[number];

export const messageStatuses = ["new", "read", "handled"] as const;
export type MessageStatus = (typeof messageStatuses)[number];

export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const quittanceRequests = sqliteTable(
  "quittance_requests",
  {
    id: text("id").primaryKey(),
    reference: text("reference").notNull().unique(),
    publicToken: text("public_token").notNull().unique(),
    status: text("status", { enum: quittanceStatuses })
      .notNull()
      .default("pending"),
    clientName: text("client_name").notNull(),
    clientEmail: text("client_email").notNull(),
    clientPhone: text("client_phone").notNull(),
    formation: text("formation").notNull(),
    periodStart: text("period_start").notNull(),
    periodEnd: text("period_end").notNull(),
    amount: integer("amount").notNull(),
    paymentMethod: text("payment_method").notNull(),
    paymentDate: text("payment_date").notNull(),
    paymentRef: text("payment_ref"),
    notes: text("notes"),
    quittanceNumber: text("quittance_number").unique(),
    consentAt: integer("consent_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
    reviewedBy: text("reviewed_by"),
    rejectionReason: text("rejection_reason"),
    emailStatus: text("email_status", { enum: emailStatuses })
      .notNull()
      .default("pending"),
    emailSentAt: integer("email_sent_at", { mode: "timestamp" }),
    emailError: text("email_error"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("quittance_status_idx").on(table.status),
    index("quittance_created_idx").on(table.createdAt),
  ],
);

export const messages = sqliteTable(
  "messages",
  {
    id: text("id").primaryKey(),
    reference: text("reference").notNull().unique(),
    type: text("type", { enum: messageTypes }).notNull().default("contact"),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    subject: text("subject").notNull(),
    body: text("body").notNull(),
    status: text("status", { enum: messageStatuses }).notNull().default("new"),
    handledAt: integer("handled_at", { mode: "timestamp" }),
    handledBy: text("handled_by"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("message_status_idx").on(table.status),
    index("message_created_idx").on(table.createdAt),
  ],
);

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  actorEmail: text("actor_email").notNull(),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  metadata: text("metadata"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type QuittanceRequest = typeof quittanceRequests.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
