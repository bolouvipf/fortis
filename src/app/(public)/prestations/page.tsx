import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, FileText, ShieldCheck } from "lucide-react";

import { MessageForm } from "@/components/forms/message-form";
import { prestations, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Prestations administratives",
  description:
    "CV, lettre de motivation, RCCM, IFU, passeport, casier judiciaire : FORTIS accompagne vos démarches administratives. Décrivez votre besoin en ligne.",
  alternates: { canonical: "/prestations" },
};

export default async function PrestationsPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const requested = typeof params.service === "string" ? params.service : "";
  const selected = (prestations as readonly string[]).includes(requested)
    ? requested
    : undefined;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Prestations</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <span className="eyebrow">Service · Démarches</span>
              <h1>Vos démarches administratives, accompagnées.</h1>
              <p className="lead">
                CV, lettre de motivation, RCCM, IFU, passeport, casier judiciaire…
                Décrivez votre besoin : nous vous indiquons les documents à fournir
                et le tarif avant de commencer.
              </p>
            </div>
            <div className="hero-fact">
              <ShieldCheck size={17} aria-hidden="true" />
              <span>
                <strong>Demande enregistrée</strong>
                Votre message reçoit une référence de suivi et arrive directement
                dans l&apos;espace de l&apos;administration.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="formulaire">
        <div className="container content-grid">
          <div>
            <span className="eyebrow">Choisir une prestation</span>
            <h2 className="section-title" style={{ marginBottom: 18 }}>
              De quoi avez-vous besoin ?
            </h2>
            <div className="chip-grid-light" style={{ marginBottom: 26 }}>
              {prestations.map((prestation) => (
                <Link
                  className="chip-light"
                  href={`/prestations?service=${encodeURIComponent(prestation)}#formulaire`}
                  key={prestation}
                  aria-current={selected === prestation ? "true" : undefined}
                >
                  <FileText size={14} aria-hidden="true" />
                  {prestation}
                </Link>
              ))}
            </div>

            <MessageForm
              kind="prestation"
              subjects={prestations}
              defaultSubject={selected}
              resetHref="/prestations"
            />
          </div>

          <aside className="aside-stack">
            <div className="info-card">
              <h3 style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Clock size={16} aria-hidden="true" />
                Comment ça se passe
              </h3>
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
                      background: "var(--green-50)",
                      color: "var(--green)",
                      fontSize: 11,
                      fontWeight: 700,
                      flex: "0 0 auto",
                    }}
                  >
                    1
                  </span>
                  <span>Vous envoyez votre demande avec le formulaire.</span>
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
                      background: "var(--green-50)",
                      color: "var(--green)",
                      fontSize: 11,
                      fontWeight: 700,
                      flex: "0 0 auto",
                    }}
                  >
                    2
                  </span>
                  <span>Nous vous indiquons les documents et le tarif.</span>
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
                      background: "var(--green-50)",
                      color: "var(--green)",
                      fontSize: 11,
                      fontWeight: 700,
                      flex: "0 0 auto",
                    }}
                  >
                    3
                  </span>
                  <span>La démarche est lancée après votre accord.</span>
                </li>
              </ul>
            </div>

            <div className="info-card">
              <h3>Documents à fournir</h3>
              <p>
                Chaque démarche a ses exigences. Précisez dans votre message les
                documents dont vous disposez déjà : cela accélère la réponse.
              </p>
              <p style={{ marginTop: 10, fontSize: "0.8rem" }}>
                Les tarifs et les délais sont communiqués avant tout engagement.
              </p>
            </div>

            <div className="info-card info-card-dark">
              <h3>Besoin d&apos;un échange direct ?</h3>
              <p>
                Appelez l&apos;administration ou écrivez-nous par email. Nous
                répondons aux demandes dans l&apos;ordre d&apos;arrivée.
              </p>
              <a className="btn btn-sm" href={`tel:${site.phone}`}>
                {site.phoneDisplay}
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="alert alert-info">
            <CheckCircle2 size={18} aria-hidden="true" />
            <span>
              Une demande envoyée via ce formulaire est enregistrée et visible par
              l&apos;administration. Vous pouvez aussi nous joindre par téléphone
              pour une urgence.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
