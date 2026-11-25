import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Search,
  ShieldCheck,
} from "lucide-react";

import { findApprovedQuittanceByNumber } from "@/lib/queries";
import {
  formatDateFr,
  formatDateTimeFr,
  formatFcfa,
  maskName,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vérifier une quittance",
  description:
    "Contrôlez l'authenticité d'une quittance de formation FORTIS à partir de son numéro unique.",
  robots: { index: false, follow: true },
};

export default async function VerifierPage({
  searchParams,
}: {
  searchParams: Promise<{ numero?: string }>;
}) {
  const params = await searchParams;
  const raw = typeof params.numero === "string" ? params.numero.trim() : "";
  const query = raw.replace(/\s+/g, "").toUpperCase();
  const result = query ? await findApprovedQuittanceByNumber(query) : null;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Vérifier une quittance</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <span className="eyebrow">Contrôle d&apos;authenticité</span>
              <h1>Une quittance à vérifier ?</h1>
              <p className="lead">
                Saisissez le numéro figurant sur le document. Le contrôle
                n&apos;affiche que des informations limitées, pour protéger les
                données du bénéficiaire.
              </p>
            </div>
            <div className="hero-fact">
              <ShieldCheck size={17} aria-hidden="true" />
              <span>
                <strong>Source officielle</strong>
                Le résultat provient directement des quittances validées par
                l&apos;administration FORTIS.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <form className="form-card" method="get" action="/verifier">
            <div className="field">
              <label htmlFor="numero">Numéro de quittance</label>
              <input
                id="numero"
                name="numero"
                defaultValue={raw}
                placeholder="FORTIS-2026-0001"
                autoComplete="off"
                spellCheck={false}
                required
              />
              <span className="field-hint">
                Format attendu : FORTIS-ANNÉE-NUMÉRO, par exemple
                FORTIS-2026-0001.
              </span>
            </div>
            <div className="form-actions">
              <button className="btn" type="submit">
                <Search size={16} aria-hidden="true" />
                Vérifier le document
              </button>
            </div>
          </form>

          {query && result ? (
            <div className="panel" style={{ marginTop: 20 }}>
              <div className="alert alert-success">
                <CheckCircle2 size={19} aria-hidden="true" />
                <span>
                  <strong>Quittance authentique.</strong> Ce numéro correspond à
                  une quittance validée par FORTIS.
                </span>
              </div>
              <dl className="kv">
                <dt>Numéro</dt>
                <dd>{result.quittanceNumber}</dd>
                <dt>Bénéficiaire</dt>
                <dd>{maskName(result.clientName)}</dd>
                <dt>Formation</dt>
                <dd>{result.formation}</dd>
                <dt>Période</dt>
                <dd>
                  du {formatDateFr(result.periodStart)} au{" "}
                  {formatDateFr(result.periodEnd)}
                </dd>
                <dt>Montant réglé</dt>
                <dd>{formatFcfa(result.amount)}</dd>
                <dt>Date de validation</dt>
                <dd>{formatDateTimeFr(result.reviewedAt)}</dd>
              </dl>
              <p className="form-note">
                Les nom et coordonnées complets ne sont pas affichés publiquement.
                Pour une vérification approfondie, contactez l&apos;administration.
              </p>
            </div>
          ) : null}

          {query && !result ? (
            <div className="alert alert-error" style={{ marginTop: 20 }}>
              <AlertCircle size={19} aria-hidden="true" />
              <span>
                <strong>Aucune quittance validée ne correspond à ce numéro.</strong>{" "}
                Vérifiez la saisie (lettres et chiffres) ou contactez
                l&apos;administration. Une demande encore en attente ne peut pas
                être vérifiée ici.
              </span>
            </div>
          ) : null}

          <div className="alert alert-info" style={{ marginTop: 20 }}>
            <ShieldCheck size={18} aria-hidden="true" />
            <span>
              Vous êtes une entreprise ou une institution ?{" "}
              <Link href="/contact?sujet=Quittance" className="table-link">
                Écrivez à l&apos;administration
              </Link>{" "}
              pour obtenir une confirmation écrite.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
