import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Download, ShieldCheck } from "lucide-react";

import { PrintButton } from "@/components/site/print-button";
import { amountInWords } from "@/lib/amount-in-words";
import { findQuittanceByToken } from "@/lib/queries";
import { formatDateFr, formatDateTimeFr, formatFcfa } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quittance de formation",
  description: "Quittance de formation validée par FORTIS.",
  robots: { index: false, follow: false },
};

export default async function QuittanceDocumentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const request = await findQuittanceByToken(token);

  if (!request) notFound();

  if (request.status !== "approved") {
    redirect(`/quittance/confirmation/${token}`);
  }

  const number = request.quittanceNumber ?? request.reference;

  return (
    <section className="doc-shell">
      <div className="container" style={{ maxWidth: 820 }}>
        <div
          className="no-print"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <Link
            className="btn btn-ghost btn-sm"
            href={`/quittance/confirmation/${token}`}
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Retour au suivi
          </Link>
          <div className="btn-row">
            <PrintButton />
            <a className="btn btn-sm" href={`/q/${token}/pdf`}>
              <Download size={15} aria-hidden="true" />
              Télécharger le PDF
            </a>
          </div>
        </div>

        <article className="doc">
          <header className="doc-head">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Image
                src="/logo.jpg"
                alt="FORTIS"
                width={52}
                height={52}
                sizes="52px"
              />
              <div>
                <p className="doc-head-title">Document officiel</p>
                <h1>Quittance de formation</h1>
              </div>
            </div>
            <div className="doc-meta">
              <strong>{number}</strong>
              Délivrée le {formatDateTimeFr(request.reviewedAt)}
            </div>
          </header>

          <div className="doc-body">
            <div className="doc-section">
              <h2>Bénéficiaire</h2>
              <dl className="doc-rows">
                <div className="doc-row">
                  <dt>Nom / raison sociale</dt>
                  <dd>{request.clientName}</dd>
                </div>
                <div className="doc-row">
                  <dt>Formation suivie</dt>
                  <dd>{request.formation}</dd>
                </div>
                <div className="doc-row">
                  <dt>Période</dt>
                  <dd>
                    du {formatDateFr(request.periodStart)} au{" "}
                    {formatDateFr(request.periodEnd)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="doc-section">
              <h2>Règlement</h2>
              <dl className="doc-rows">
                <div className="doc-row">
                  <dt>Mode de paiement</dt>
                  <dd>{request.paymentMethod}</dd>
                </div>
                <div className="doc-row">
                  <dt>Date du paiement</dt>
                  <dd>{formatDateFr(request.paymentDate)}</dd>
                </div>
                {request.paymentRef ? (
                  <div className="doc-row">
                    <dt>Référence du paiement</dt>
                    <dd>{request.paymentRef}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="doc-amount">
                <span>Montant réglé</span>
                <strong>{formatFcfa(request.amount)}</strong>
                <small>Soit {amountInWords(request.amount)}</small>
              </div>
            </div>

            <div className="doc-sign">
              <p className="doc-sign-note">
                Cette quittance atteste uniquement du règlement indiqué ci-dessus.
                Elle a été générée électroniquement après validation par
                l&apos;administration FORTIS. Son authenticité peut être contrôlée
                en ligne avec le numéro <strong>{number}</strong>.
                <br />
                <Link href="/verifier" className="table-link">
                  Vérifier ce document
                </Link>
              </p>
              <div className="doc-sign-box">
                <p>Pour la Direction de FORTIS</p>
                <Image
                  src="/cachet.png"
                  alt="Cachet FORTIS"
                  width={90}
                  height={90}
                  sizes="90px"
                />
              </div>
            </div>
          </div>

          <footer className="doc-foot">
            <ShieldCheck
              size={13}
              aria-hidden="true"
              style={{ display: "inline", marginRight: 5, verticalAlign: "-2px" }}
            />
            Référence interne : {request.reference} · Document émis par FORTIS ·
            Bénin
          </footer>
        </article>

        <p className="form-note" style={{ textAlign: "center", marginTop: 16 }}>
          Une copie de ce document a été envoyée à {request.clientEmail}.
        </p>
      </div>
    </section>
  );
}
