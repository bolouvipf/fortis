import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Mail,
  MailWarning,
  Phone,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  ApproveBox,
  RejectBox,
  ResendBox,
} from "@/components/admin/quittance-actions";
import { CopyLink } from "@/components/admin/copy-link";
import { amountInWords } from "@/lib/amount-in-words";
import { findQuittanceById } from "@/lib/queries";
import { getSiteUrl } from "@/lib/urls";
import {
  formatDateFr,
  formatDateTimeFr,
  formatFcfa,
  statusLabel,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

const pillClass = {
  pending: "pill-pending",
  approved: "pill-approved",
  rejected: "pill-rejected",
} as const;

export default async function AdminQuittanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await findQuittanceById(id);

  if (!request) notFound();

  const publicUrl = `${getSiteUrl()}/q/${request.publicToken}`;
  const emailTone =
    request.emailStatus === "sent"
      ? "alert-success"
      : request.emailStatus === "failed"
        ? "alert-error"
        : "alert-info";

  return (
    <>
      <header className="admin-topbar">
        <div>
          <Link className="admin-login-link" href="/admin/quittances">
            <ArrowLeft size={14} aria-hidden="true" />
            Toutes les quittances
          </Link>
          <h1 className="admin-title" style={{ marginTop: 8 }}>
            {request.reference}
          </h1>
          <p className="admin-sub">
            Reçue le {formatDateTimeFr(request.createdAt)} · {request.clientName}
          </p>
        </div>
        <span className={`pill ${pillClass[request.status]}`}>
          {statusLabel(request.status)}
        </span>
      </header>

      <div className="admin-detail-grid">
        <div>
          <section className="panel">
            <div className="panel-head">
              <h2>Demande du client</h2>
              {request.status === "approved" && request.quittanceNumber ? (
                <span className="badge badge-green">{request.quittanceNumber}</span>
              ) : null}
            </div>

            <dl className="kv">
              <dt>Nom / raison sociale</dt>
              <dd>{request.clientName}</dd>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${request.clientEmail}`}>{request.clientEmail}</a>
              </dd>
              <dt>Téléphone</dt>
              <dd>
                <a href={`tel:${request.clientPhone}`}>
                  <Phone size={12} aria-hidden="true" style={{ marginRight: 4 }} />
                  {request.clientPhone}
                </a>
              </dd>
              <dt>Formation</dt>
              <dd>{request.formation}</dd>
              <dt>Période</dt>
              <dd>
                du {formatDateFr(request.periodStart)} au{" "}
                {formatDateFr(request.periodEnd)}
              </dd>
              <dt>Montant déclaré</dt>
              <dd>
                {formatFcfa(request.amount)}
                <span className="table-muted">{amountInWords(request.amount)}</span>
              </dd>
              <dt>Mode de paiement</dt>
              <dd>{request.paymentMethod}</dd>
              <dt>Date du paiement</dt>
              <dd>{formatDateFr(request.paymentDate)}</dd>
              <dt>Référence du paiement</dt>
              <dd>{request.paymentRef ?? "—"}</dd>
              <dt>Précisions du client</dt>
              <dd style={{ fontWeight: 400, whiteSpace: "pre-wrap" }}>
                {request.notes ?? "—"}
              </dd>
              <dt>Consentement</dt>
              <dd>{formatDateTimeFr(request.consentAt)}</dd>
            </dl>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h2>Décision</h2>
              {request.reviewedAt ? (
                <span className="badge">
                  {statusLabel(request.status)} par {request.reviewedBy ?? "—"} le{" "}
                  {formatDateTimeFr(request.reviewedAt)}
                </span>
              ) : (
                <span className="badge badge-orange">En attente de décision</span>
              )}
            </div>

            {request.status === "pending" ? (
              <div className="alert alert-warning">
                <Clock size={18} aria-hidden="true" />
                <span>
                  Vérifiez le paiement avant toute décision. La validation attribue
                  un numéro unique, génère le PDF avec cachet et l&apos;envoie au
                  client.
                </span>
              </div>
            ) : null}

            {request.status === "approved" ? (
              <div className="alert alert-success">
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>
                  Quittance <strong>{request.quittanceNumber}</strong> délivrée.
                  Le PDF reste téléchargeable ci-contre.
                </span>
              </div>
            ) : null}

            {request.status === "rejected" ? (
              <div className="alert alert-error">
                <XCircle size={18} aria-hidden="true" />
                <span>
                  <strong>Motif du rejet :</strong> {request.rejectionReason}
                </span>
              </div>
            ) : null}

            <dl className="kv" style={{ marginTop: 14 }}>
              <dt>Statut de l&apos;email</dt>
              <dd>{statusLabel(request.emailStatus)}</dd>
              <dt>Envoyé le</dt>
              <dd>{formatDateTimeFr(request.emailSentAt)}</dd>
              {request.emailError ? (
                <>
                  <dt>Erreur d&apos;envoi</dt>
                  <dd style={{ color: "var(--danger)", fontWeight: 400 }}>
                    {request.emailError}
                  </dd>
                </>
              ) : null}
            </dl>

            {request.status !== "pending" ? (
              <>
                <hr className="divider" />
                <div className={`alert ${emailTone}`}>
                  <MailWarning size={18} aria-hidden="true" />
                  <span>
                    Le client est informé par email à{" "}
                    <strong>{request.clientEmail}</strong>. En cas d&apos;échec ou
                    de doute, utilisez le renvoi.
                  </span>
                </div>
                <ResendBox id={request.id} />
              </>
            ) : null}
          </section>
        </div>

        <aside>
          {request.status === "pending" ? (
            <section className="panel">
              <div className="panel-head">
                <h2>Traiter la demande</h2>
                <ShieldCheck size={16} aria-hidden="true" />
              </div>
              <ApproveBox id={request.id} />
              <hr className="divider" />
              <RejectBox id={request.id} />
            </section>
          ) : null}

          {request.status === "approved" && request.quittanceNumber ? (
            <section className="panel">
              <div className="panel-head">
                <h2>Document</h2>
                <ShieldCheck size={16} aria-hidden="true" />
              </div>
              <div className="status-row">
                <span>Numéro</span>
                <strong>{request.quittanceNumber}</strong>
              </div>
              <div className="status-row">
                <span>Émis le</span>
                <strong>{formatDateTimeFr(request.reviewedAt)}</strong>
              </div>
              <div className="btn-row" style={{ marginTop: 14 }}>
                <a
                  className="btn btn-sm"
                  href={`/q/${request.publicToken}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download size={14} aria-hidden="true" />
                  Télécharger le PDF
                </a>
                <Link
                  className="btn btn-sm btn-outline"
                  href={`/q/${request.publicToken}`}
                  target="_blank"
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  Version web
                </Link>
              </div>
              <p className="action-note" style={{ marginTop: 12 }}>
                Lien public du client (à ne pas partager publiquement) :
              </p>
              <CopyLink value={publicUrl} />
            </section>
          ) : null}

          <section className="panel">
            <div className="panel-head">
              <h2>Suivi client</h2>
              <Mail size={16} aria-hidden="true" />
            </div>
            <p className="action-note">
              Page de suivi envoyée au client avec sa référence. Elle affiche
              l&apos;état de la demande, sans permettre le téléchargement avant
              validation.
            </p>
            <div className="btn-row" style={{ marginTop: 12 }}>
              <Link
                className="btn btn-sm btn-outline"
                href={`/quittance/confirmation/${request.publicToken}`}
                target="_blank"
              >
                <ExternalLink size={14} aria-hidden="true" />
                Ouvrir le suivi
              </Link>
            </div>
            <p className="action-note" style={{ marginTop: 12 }}>
              Référence de suivi : <strong>{request.reference}</strong>
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
