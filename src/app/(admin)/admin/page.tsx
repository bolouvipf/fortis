import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Inbox,
  Mail,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { getSession } from "@/lib/auth";
import {
  getNewMessageCount,
  getQuittanceStats,
  recentQuittances,
} from "@/lib/queries";
import { formatDateTimeFr, formatFcfa } from "@/lib/utils";

export const dynamic = "force-dynamic";

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

export default async function AdminDashboardPage() {
  const [session, stats, newMessages, recent] = await Promise.all([
    getSession(),
    getQuittanceStats(),
    getNewMessageCount(),
    recentQuittances(6),
  ]);

  const emailReady = Boolean(process.env.RESEND_API_KEY);

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1 className="admin-title">
            Bonjour{session ? `, ${session.name.split(" ")[0]}` : ""}.
          </h1>
          <p className="admin-sub">
            Voici l&apos;état des demandes et des messages reçus.
          </p>
        </div>
        <div className="admin-user">
          <Link className="btn btn-sm btn-outline" href="/" target="_blank">
            Voir le site
          </Link>
        </div>
      </header>

      {stats.pending > 0 ? (
        <div className="alert alert-warning" style={{ background: "#fff8ec" }}>
          <AlertCircle size={18} aria-hidden="true" />
          <span>
            <strong>
              {stats.pending} demande{stats.pending > 1 ? "s" : ""} en attente de
              validation.
            </strong>{" "}
            Une quittance n&apos;est envoyée au client qu&apos;après votre
            décision.
          </span>
          <Link
            className="btn btn-sm"
            href="/admin/quittances?statut=pending"
            style={{ marginLeft: "auto" }}
          >
            Traiter
          </Link>
        </div>
      ) : null}

      {!emailReady ? (
        <div className="alert alert-info">
          <Mail size={18} aria-hidden="true" />
          <span>
            <strong>Emails non configurés.</strong> Ajoutez{" "}
            <code>RESEND_API_KEY</code> et <code>MAIL_FROM</code> dans les
            variables d&apos;environnement. En développement, les emails sont
            simulés et enregistrés dans <code>.emails/</code>.
          </span>
        </div>
      ) : null}

      <div className="stat-grid">
        <article className="stat">
          <span className="stat-label">
            <Clock size={14} aria-hidden="true" />
            En attente
          </span>
          <div className="stat-value">{stats.pending}</div>
          <p className="stat-hint">À vérifier avant délivrance</p>
        </article>
        <article className="stat">
          <span className="stat-label">
            <CheckCircle2 size={14} aria-hidden="true" />
            Validées
          </span>
          <div className="stat-value">{stats.approved}</div>
          <p className="stat-hint">Quittances délivrées</p>
        </article>
        <article className="stat">
          <span className="stat-label">
            <XCircle size={14} aria-hidden="true" />
            Rejetées
          </span>
          <div className="stat-value">{stats.rejected}</div>
          <p className="stat-hint">Demandes à corriger</p>
        </article>
        <article className="stat">
          <span className="stat-label">
            <Inbox size={14} aria-hidden="true" />
            Messages
          </span>
          <div className="stat-value">{newMessages}</div>
          <p className="stat-hint">Nouveaux messages reçus</p>
        </article>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Dernières demandes</h2>
          <Link className="section-link" href="/admin/quittances">
            Tout voir
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">
            <FileText size={28} aria-hidden="true" />
            <p>Aucune demande pour le moment.</p>
            <p style={{ marginTop: 4 }}>
              Les demandes envoyées depuis la page « Ma quittance » apparaîtront
              ici.
            </p>
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
                  <th />
                </tr>
              </thead>
              <tbody>
                {recent.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <Link
                        className="table-link"
                        href={`/admin/quittances/${request.id}`}
                      >
                        {request.reference}
                      </Link>
                      <span className="table-muted">
                        {formatDateTimeFr(request.createdAt)}
                      </span>
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

      <div className="panel">
        <div className="panel-head">
          <h2>Rappel du processus</h2>
          <ShieldCheck size={16} aria-hidden="true" />
        </div>
        <div className="steps">
          <article className="step">
            <span className="step-num">01</span>
            <div>
              <h3>Vérifier le paiement</h3>
              <p>
                Contrôlez le montant, la date, le mode et la référence avant toute
                décision.
              </p>
            </div>
          </article>
          <article className="step">
            <span className="step-num">02</span>
            <div>
              <h3>Valider ou rejeter</h3>
              <p>
                La validation attribue un numéro unique et génère le PDF avec
                cachet.
              </p>
            </div>
          </article>
          <article className="step">
            <span className="step-num">03</span>
            <div>
              <h3>Email automatique</h3>
              <p>
                Le client reçoit la quittance en pièce jointe et un lien de
                vérification.
              </p>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
