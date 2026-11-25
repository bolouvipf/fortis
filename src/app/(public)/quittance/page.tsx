import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  HelpCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { QuittanceForm } from "@/components/forms/quittance-form";
import { formations, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ma quittance de formation",
  description:
    "Demandez votre quittance de formation FORTIS en ligne. Votre demande est vérifiée par l'administration, puis la quittance PDF est envoyée par email.",
  alternates: { canonical: "/quittance" },
};

export default async function QuittancePage({
  searchParams,
}: {
  searchParams: Promise<{ formation?: string }>;
}) {
  const params = await searchParams;
  const requested = typeof params.formation === "string" ? params.formation : "";
  const defaultFormation = (formations as readonly string[]).includes(requested)
    ? requested
    : "";

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Ma quittance</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <span className="eyebrow">Service en ligne</span>
              <h1>Demander ma quittance de formation.</h1>
              <p className="lead">
                Transmettez les informations de votre paiement. L&apos;administration
                vérifie, valide, puis vous envoie la quittance officielle au format
                PDF par email.
              </p>
            </div>
            <div className="hero-fact">
              <ShieldCheck size={17} aria-hidden="true" />
              <span>
                <strong>Validation obligatoire</strong>
                Aucun document n&apos;est généré immédiatement. Chaque quittance est
                contrôlée avant délivrance.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <div>
            <div className="alert alert-warning">
              <AlertCircle size={19} aria-hidden="true" />
              <span>
                <strong>Important :</strong> ce formulaire enregistre une{" "}
                <strong>demande</strong>. La quittance n&apos;est délivrée
                qu&apos;après vérification du paiement par l&apos;administration,
                puis envoyée à votre adresse email.
              </span>
            </div>

            <QuittanceForm defaultFormation={defaultFormation} />
          </div>

          <aside className="aside-stack">
            <div className="info-card info-card-dark">
              <h3>Comment ça marche</h3>
              <ul>
                <li>
                  <span
                    aria-hidden="true"
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,.16)",
                      fontSize: 11,
                      fontWeight: 700,
                      flex: "0 0 auto",
                      marginTop: 1,
                    }}
                  >
                    1
                  </span>
                  <span>Vous remplissez le formulaire et recevez une référence par email.</span>
                </li>
                <li>
                  <span
                    aria-hidden="true"
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,.16)",
                      fontSize: 11,
                      fontWeight: 700,
                      flex: "0 0 auto",
                      marginTop: 1,
                    }}
                  >
                    2
                  </span>
                  <span>L&apos;administration vérifie le paiement et les informations.</span>
                </li>
                <li>
                  <span
                    aria-hidden="true"
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,.16)",
                      fontSize: 11,
                      fontWeight: 700,
                      flex: "0 0 auto",
                      marginTop: 1,
                    }}
                  >
                    3
                  </span>
                  <span>La quittance PDF signée arrive par email, avec un lien de vérification.</span>
                </li>
              </ul>
            </div>

            <div className="info-card">
              <h3>À préparer</h3>
              <ul>
                <li>
                  <FileText size={14} aria-hidden="true" />
                  <span>L&apos;intitulé exact de la formation suivie.</span>
                </li>
                <li>
                  <CheckCircle2 size={14} aria-hidden="true" />
                  <span>Les dates de début et de fin de la formation.</span>
                </li>
                <li>
                  <CheckCircle2 size={14} aria-hidden="true" />
                  <span>Le montant payé et la date du paiement.</span>
                </li>
                <li>
                  <CheckCircle2 size={14} aria-hidden="true" />
                  <span>La référence de la transaction, si vous l&apos;avez.</span>
                </li>
              </ul>
            </div>

            <div className="info-card">
              <h3 style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <HelpCircle size={16} aria-hidden="true" />
                Besoin d&apos;aide ?
              </h3>
              <p>
                Une question sur votre paiement ou sur le formulaire ? Écrivez à
                l&apos;administration, votre message sera enregistré avec une
                référence.
              </p>
              <Link className="btn btn-sm btn-outline" href="/contact?sujet=Quittance">
                <Mail size={14} aria-hidden="true" />
                Contacter l&apos;administration
              </Link>
              <p style={{ marginTop: 12, fontSize: "0.78rem" }}>
                Téléphone : {site.phoneDisplay}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="alert alert-info">
            <ShieldCheck size={18} aria-hidden="true" />
            <span>
              Une quittance déjà délivrée peut être contrôlée par un tiers depuis{" "}
              <Link href="/verifier" className="table-link">
                la page de vérification
              </Link>
              , à partir de son numéro unique.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
