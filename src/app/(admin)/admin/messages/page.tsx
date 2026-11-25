import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import {
  CheckCircle2,
  Inbox,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

import { markMessageHandled } from "@/actions/admin";
import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { formatDateTimeFr, statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statuses = ["new", "handled"] as const;
type StatusFilter = (typeof statuses)[number] | "all";

const pillClass = {
  new: "pill-new",
  read: "pill-handled",
  handled: "pill-handled",
} as const;

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; type?: string }>;
}) {
  const params = await searchParams;
  const rawStatus = typeof params.statut === "string" ? params.statut : "";
  const statut: StatusFilter = (statuses as readonly string[]).includes(rawStatus)
    ? (rawStatus as (typeof statuses)[number])
    : rawStatus === "all"
      ? "all"
      : "new";

  const rawType = typeof params.type === "string" ? params.type : "";
  const type =
    rawType === "contact" || rawType === "prestation" ? rawType : undefined;

  const filters = [];
  if (statut !== "all") filters.push(eq(messages.status, statut));
  if (type) filters.push(eq(messages.type, type));

  const rows = await db
    .select()
    .from(messages)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(desc(messages.createdAt))
    .limit(150);

  const tabHref = (key: StatusFilter) =>
    `/admin/messages?statut=${key}${type ? `&type=${type}` : ""}`;

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1 className="admin-title">Messages</h1>
          <p className="admin-sub">
            Demandes de contact et de prestations reçues depuis le site.
          </p>
        </div>
      </header>

      <div className="tabs">
        <Link
          className="tab"
          href={tabHref("new")}
          aria-current={statut === "new" ? "page" : undefined}
        >
          À traiter
        </Link>
        <Link
          className="tab"
          href={tabHref("handled")}
          aria-current={statut === "handled" ? "page" : undefined}
        >
          Traités
        </Link>
        <Link
          className="tab"
          href={tabHref("all")}
          aria-current={statut === "all" ? "page" : undefined}
        >
          Tous
        </Link>
        <Link
          className="tab"
          href={`/admin/messages?statut=${statut}`}
          aria-current={!type ? "page" : undefined}
        >
          Tous types
        </Link>
        <Link
          className="tab"
          href={`/admin/messages?statut=${statut}&type=contact`}
          aria-current={type === "contact" ? "page" : undefined}
        >
          Contact
        </Link>
        <Link
          className="tab"
          href={`/admin/messages?statut=${statut}&type=prestation`}
          aria-current={type === "prestation" ? "page" : undefined}
        >
          Prestations
        </Link>
      </div>

      <div className="table-card">
        {rows.length === 0 ? (
          <div className="empty-state">
            <Inbox size={28} aria-hidden="true" />
            <p>Aucun message dans cette catégorie.</p>
          </div>
        ) : (
          rows.map((message) => (
            <details className="message-item" key={message.id}>
              <summary>
                <span className={`pill ${pillClass[message.status]}`}>
                  {statusLabel(message.status)}
                </span>
                <span className="message-head">
                  <b>
                    {message.name} — {message.subject}
                  </b>
                  <small>
                    {message.type === "prestation" ? "Prestation" : "Contact"} ·{" "}
                    {message.reference} · {formatDateTimeFr(message.createdAt)}
                  </small>
                </span>
              </summary>
              <div className="message-body">
                <p style={{ whiteSpace: "pre-wrap" }}>{message.body}</p>

                <div className="message-actions">
                  {message.email ? (
                    <a
                      className="btn btn-sm btn-outline"
                      href={`mailto:${message.email}?subject=${encodeURIComponent(
                        `Réponse FORTIS — ${message.reference}`,
                      )}`}
                    >
                      <Mail size={14} aria-hidden="true" />
                      {message.email}
                    </a>
                  ) : null}
                  {message.phone ? (
                    <>
                      <a className="btn btn-sm btn-outline" href={`tel:${message.phone}`}>
                        <Phone size={14} aria-hidden="true" />
                        {message.phone}
                      </a>
                      <a
                        className="btn btn-sm btn-outline"
                        href={`https://wa.me/${message.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle size={14} aria-hidden="true" />
                        WhatsApp
                      </a>
                    </>
                  ) : null}
                </div>

                {message.status !== "handled" ? (
                  <form action={markMessageHandled} style={{ marginTop: 14 }}>
                    <input type="hidden" name="id" value={message.id} />
                    <button className="btn btn-sm" type="submit">
                      <CheckCircle2 size={14} aria-hidden="true" />
                      Marquer comme traité
                    </button>
                  </form>
                ) : (
                  <p className="action-note" style={{ marginTop: 12 }}>
                    Traité par {message.handledBy ?? "—"} le{" "}
                    {formatDateTimeFr(message.handledAt)}.
                  </p>
                )}
              </div>
            </details>
          ))
        )}
      </div>

      <p className="admin-sub" style={{ marginTop: 12 }}>
        Les 150 messages les plus récents sont affichés.
      </p>
    </>
  );
}
