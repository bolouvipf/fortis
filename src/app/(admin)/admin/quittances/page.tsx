import Link from "next/link";
import { and, desc, eq, like, or } from "drizzle-orm";
import { FileText, Search } from "lucide-react";

import { db } from "@/lib/db";
import { quittanceRequests } from "@/lib/db/schema";
import { getQuittanceStats } from "@/lib/queries";
import { formatFcfa, formatDateTimeFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

const allowedStatuses = ["pending", "approved", "rejected"] as const;
type StatusFilter = (typeof allowedStatuses)[number] | "all";

const pillClass = {
  pending: "pill-pending",
  approved: "pill-approved",
  rejected: "pill-rejected",
} as const;

const statusLabel = {
  pending: "En attente",
  approved: "Validée",
  rejected: "Rejetée",
} as const;

export default async function AdminQuittancesPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; q?: string }>;
}) {
  const params = await searchParams;
  const requestedStatus = typeof params.statut === "string" ? params.statut : "";
  const statut: StatusFilter = (allowedStatuses as readonly string[]).includes(
    requestedStatus,
  )
    ? (requestedStatus as (typeof allowedStatuses)[number])
    : requestedStatus === "all"
      ? "all"
      : "pending";

  const q = typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";

  const filters = [];
  if (statut !== "all") filters.push(eq(quittanceRequests.status, statut));
  if (q) {
    filters.push(
      or(
        like(quittanceRequests.clientName, `%${q}%`),
        like(quittanceRequests.reference, `%${q}%`),
        like(quittanceRequests.clientEmail, `%${q}%`),
      )!,
    );
  }

  const [rows, stats] = await Promise.all([
    db
      .select()
      .from(quittanceRequests)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(desc(quittanceRequests.createdAt))
      .limit(100),
    getQuittanceStats(),
  ]);

  const total = stats.pending + stats.approved + stats.rejected;

  const tabs: Array<{ key: StatusFilter; label: string; count: number }> = [
    { key: "pending", label: "En attente", count: stats.pending },
    { key: "approved", label: "Validées", count: stats.approved },
    { key: "rejected", label: "Rejetées", count: stats.rejected },
    { key: "all", label: "Toutes", count: total },
  ];

  const tabHref = (key: StatusFilter) =>
    `/admin/quittances?statut=${key}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1 className="admin-title">Quittances</h1>
          <p className="admin-sub">
            {rows.length} demande{rows.length > 1 ? "s" : ""} affichée
            {rows.length > 1 ? "s" : ""} · validation humaine obligatoire avant
            envoi.
          </p>
        </div>
      </header>

      <div className="tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            className="tab"
            href={tabHref(tab.key)}
            aria-current={statut === tab.key ? "page" : undefined}
          >
            {tab.label}
            <span style={{ marginLeft: 5, opacity: 0.7 }}>{tab.count}</span>
          </Link>
        ))}
      </div>

      <form className="search-bar" method="get" action="/admin/quittances">
        <input type="hidden" name="statut" value={statut} />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher un nom, un email ou une référence"
          aria-label="Rechercher une demande"
        />
        <button className="btn btn-sm" type="submit">
          <Search size={15} aria-hidden="true" />
          Rechercher
        </button>
      </form>

      <div className="table-card">
        {rows.length === 0 ? (
          <div className="empty-state">
            <FileText size={28} aria-hidden="true" />
            <p>Aucune demande dans cette catégorie.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Client</th>
                  <th>Formation</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Reçue le</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <Link
                        className="table-link"
                        href={`/admin/quittances/${request.id}`}
                      >
                        {request.reference}
                      </Link>
                      {request.quittanceNumber ? (
                        <span className="table-muted">
                          N° {request.quittanceNumber}
                        </span>
                      ) : null}
                    </td>
                    <td>
                      {request.clientName}
                      <span className="table-muted">{request.clientEmail}</span>
                    </td>
                    <td>{request.formation}</td>
                    <td>{formatFcfa(request.amount)}</td>
                    <td>
                      <span className={`pill ${pillClass[request.status]}`}>
                        {statusLabel[request.status]}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {formatDateTimeFr(request.createdAt)}
                    </td>
                    <td>
                      <Link
                        className="btn btn-sm btn-outline"
                        href={`/admin/quittances/${request.id}`}
                      >
                        Ouvrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="admin-sub" style={{ marginTop: 12 }}>
        Les 100 demandes les plus récentes sont affichées. Affinez avec la
        recherche ou les filtres.
      </p>
    </>
  );
}
