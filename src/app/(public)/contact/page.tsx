import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, Phone, ShieldCheck } from "lucide-react";

import { MessageForm } from "@/components/forms/message-form";
import { PromoterCard } from "@/components/site/promoter-card";
import { promoters, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écrivez à l'administration FORTIS : votre message est enregistré avec une référence de suivi. Contactez aussi directement nos spécialistes BTP et comptabilité.",
  alternates: { canonical: "/contact" },
};

const subjects = [
  "BTP",
  "Comptabilité",
  "Formation",
  "Commerce",
  "Prestations administratives",
  "Quittance",
  "Autre",
] as const;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sujet?: string }>;
}) {
  const params = await searchParams;
  const requested = typeof params.sujet === "string" ? params.sujet : "";
  const defaultSubject = (subjects as readonly string[]).includes(requested)
    ? requested
    : undefined;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Contact</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <span className="eyebrow">Nous écrire</span>
              <h1>Une question ? Un projet ? Écrivez-nous.</h1>
              <p className="lead">
                Votre message est enregistré dans l&apos;espace de
                l&apos;administration avec une référence de suivi. Vous pouvez
                aussi contacter directement le spécialiste concerné.
              </p>
            </div>
            <div className="hero-fact">
              <ShieldCheck size={17} aria-hidden="true" />
              <span>
                <strong>Suivi réel</strong>
                Chaque message reçoit une réponse par email ou par téléphone, selon
                les coordonnées que vous laissez.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <div>
            <div className="alert alert-info">
              <MessageSquare size={18} aria-hidden="true" />
              <span>
                Laissez au moins un email ou un numéro de téléphone. Sans
                coordonnées, nous ne pouvons pas vous répondre.
              </span>
            </div>
            <MessageForm
              kind="contact"
              subjects={subjects}
              defaultSubject={defaultSubject}
              resetHref="/contact"
            />
          </div>

          <aside className="aside-stack contact-side">
            <div className="info-card">
              <h3 style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Phone size={16} aria-hidden="true" />
                Contact direct
              </h3>
              <ul>
                <li>
                  <Phone size={14} aria-hidden="true" />
                  <a href={`tel:${site.phone}`} className="table-link">
                    {site.phoneDisplay}
                  </a>
                </li>
                <li>
                  <Mail size={14} aria-hidden="true" />
                  <a href={`mailto:${site.email}`} className="table-link">
                    {site.email}
                  </a>
                </li>
              </ul>
              <p style={{ marginTop: 12 }}>
                Pour une question urgente, privilégiez l&apos;appel téléphonique.
              </p>
            </div>

            <div className="promoter-grid">
              {promoters.map((promoter) => (
                <PromoterCard promoter={promoter} key={promoter.key} />
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
