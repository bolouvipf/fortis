import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  Download,
  FileText,
  Mail,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import { findQuittanceByToken } from "@/lib/queries";
import { formatDateFr, formatDateTimeFr, formatFcfa } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Suivi de ma demande",
  description: "Suivez l'état de votre demande de quittance FORTIS.",
  robots: { index: false, follow: false },
};

const pillClass = {
  pending: "pill-pending",
  approved: "pill-approved",
  rejected: "pill-rejected",
} as const;

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const request = await findQuittanceByToken(token);

  if (!request) notFound();

  const statusLabel =
    request.status === "approved"
      ? "Validée"
      : request.status === "rejected"
        ? "À corriger"
        : "En attente de validation";

  const timeline = [
    {
      title: "Demande reçue",
      detail: `Enregistrée le ${formatDateTimeFr(request.createdAt)}`,
      state: "is-done",
      icon: Check,
    },
    {
      title:
        request.status === "pending"
          ? "Vérification en cours"
          : "Demande examinée",
      detail:
        request.status === "pending"
          ? "L'administration contrôle le paiement et les informations."
          : `Traitée le ${formatDateTimeFr(request.reviewedAt)}`,
      state: request.status === "pending" ? "is-active" : "is-done",
      icon: Search,
    },
    request.status === "approved"
      ? {
          title: "Quittance délivrée",
          detail: `N° ${request.quittanceNumber ?? request.reference} · envoyée à ${request.clientEmail}`,
          state: "is-done",
          icon: Mail,
        }
      : request.status === "rejected"
        ? {
            title: "Correction nécessaire",
            detail: "Vous pouvez soumettre une nouvelle demande.",
            state: "is-active",
            icon: X,
          }
        : {
            title: "Envoi de la quittance",
            detail:
              "Après validation, le PDF sera envoyé à votre adresse email.",
            state: "",
            icon: Mail,
          },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <Link href="/quittance">Ma quittance</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Suivi</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <span className="eyebrow">Suivi de demande</span>
              <h1>Votre demande de quittance.</h1>
              <p className="lead">
                Référence <strong>{request.reference}</strong> — conservez ce lien
                pour suivre l&apos;avancement.
              </p>
            </div>
            <div className="hero-fact">
              <ShieldCheck size={17} aria-hidden="true" />
              <span>
                <strong>{statusLabel}</strong>
                {request.status === "pending"
                  ? "Une validation humaine est nécessaire avant tout envoi."
                  : request.status === "approved"
                    ? "Le document est disponible et envoyé par email."
                    : "Une nouvelle demande est nécessaire."}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <div>
            <div className="panel">
              <div className="panel-head">
                <h2 style={{ fontSize: "1rem" }}>
                  État de la demande
                </h2>
                <span className={`pill ${pillClass[request.status]}`}>
                  {statusLabel}
                </span>
              </div>

              <ol className="timeline">
                {timeline.map((step) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.title} className={step.state}>
                      <span className="timeline-dot">
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <div>
                        <b>{step.title}</b>
                        <small>{step.detail}</small>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <hr className="divider" />

              <dl className="kv">
                <dt>Référence</dt>
                <dd>{request.reference}</dd>
                <dt>Formation</dt>
                <dd>{request.formation}</dd>
                <dt>Période</dt>
                <dd>
                  du {formatDateFr(request.periodStart)} au{" "}
                  {formatDateFr(request.periodEnd)}
                </dd>
                <dt>Montant</dt>
                <dd>{formatFcfa(request.amount)}</dd>
                <dt>Mode de paiement</dt>
                <dd>{request.paymentMethod}</dd>
                <dt>Date du paiement</dt>
                <dd>{formatDateFr(request.paymentDate)}</dd>
                <dt>Email de réception</dt>
                <dd>{request.clientEmail}</dd>
                {request.quittanceNumber ? (
                  <>
                    <dt>N° de quittance</dt>
                    <dd>{request.quittanceNumber}</dd>
                  </>
                ) : null}
              </dl>
            </div>

            {request.status === "rejected" ? (
              <div className="alert alert-error" style={{ marginTop: 18 }}>
                <X size={18} aria-hidden="true" />
                <span>
                  <strong>Motif :</strong>{" "}
                  {request.rejectionReason ?? "Informations incomplètes."}
                </span>
              </div>
            ) : null}
          </div>

          <aside className="aside-stack">
            {request.status === "approved" ? (
              <div className="info-card info-card-dark">
                <h3>Quittance disponible</h3>
                <p>
                  Votre document a été validé par l&apos;administration. Il est
                  joint à l&apos;email envoyé à {request.clientEmail}.
                </p>
                <div className="btn-row" style={{ marginTop: 14 }}>
                  <Link className="btn btn-sm" href={`/q/${token}`}>
                    Consulter
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                  <a
                    className="btn btn-sm btn-light"
                    href={`/q/${token}/pdf`}
                  >
                    <Download size={14} aria-hidden="true" />
                    PDF
                  </a>
                </div>
              </div>
            ) : request.status === "pending" ? (
              <div className="info-card">
                <h3>Prochaine étape</h3>
                <p>
                  L&apos;administration vérifie votre paiement. Vous recevrez un
                  email à <strong>{request.clientEmail}</strong> dès la décision.
                </p>
                <p style={{ marginTop: 10 }}>
                  Aucun téléchargement n&apos;est possible avant validation : c&apos;est
                  ce qui garantit l&apos;authenticité du document.
                </p>
              </div>
            ) : (
              <div className="info-card">
                <h3>Que faire maintenant ?</h3>
                <p>
                  Corrigez les informations signalées, puis envoyez une nouvelle
                  demande. L&apos;administration vous répondra à nouveau.
                </p>
                <Link className="btn btn-sm" href="/quittance">
                  Nouvelle demande
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            )}

            <div className="info-card">
              <h3 style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <FileText size={16} aria-hidden="true" />
                Une question ?
              </h3>
              <p>
                Contactez l&apos;administration en indiquant votre référence{" "}
                <strong>{request.reference}</strong>.
              </p>
              <Link
                className="btn btn-sm btn-outline"
                href={`/contact?sujet=Quittance`}
              >
                Écrire à l&apos;administration
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
