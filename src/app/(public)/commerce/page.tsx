import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, Ship, Wrench } from "lucide-react";

import { PromoterCard } from "@/components/site/promoter-card";
import { promoters } from "@/lib/site";

export const metadata: Metadata = {
  title: "Commerce — Importation et matériel de génie civil",
  description:
    "FORTIS importe des produits depuis la Chine et fournit des outils de génie civil : papier A2, instruments de dessin et consommables. Renseignez-vous sur la disponibilité et les prix.",
  alternates: { canonical: "/commerce" },
};

export default function CommercePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Commerce</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <span className="eyebrow">Activité · Matériel</span>
              <h1>Importer et fournir le bon matériel.</h1>
              <p className="lead">
                Importation depuis la Chine et vente d&apos;outils de génie civil :
                papier A2, instruments de dessin et consommables pour vos travaux
                et vos études.
              </p>
            </div>
            <div className="hero-fact">
              <Info size={17} aria-hidden="true" />
              <span>
                <strong>Disponibilité sur demande</strong>
                Les prix et les délais varient selon les références. Contactez-nous
                avant de vous déplacer.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <div className="prose">
            <span className="eyebrow">Nos offres</span>
            <h2 style={{ marginTop: 12 }}>Des produits choisis pour le terrain.</h2>
            <p>
              Nous faisons venir des produits de Chine et constituons un stock
              d&apos;outils et de consommables utiles aux professionnels du
              bâtiment, aux bureaux d&apos;études et aux étudiants en génie civil.
            </p>

            <div className="detail-list">
              <div className="detail-item">
                <span className="detail-icon">
                  <Ship size={19} aria-hidden="true" />
                </span>
                <div>
                  <h3>Importation depuis la Chine</h3>
                  <p>
                    Nous faisons venir des produits de Chine. Précisez la
                    référence, la quantité et le délai souhaité pour obtenir une
                    réponse adaptée.
                  </p>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">
                  <Wrench size={19} aria-hidden="true" />
                </span>
                <div>
                  <h3>Outils de génie civil</h3>
                  <p>
                    Papier A2, instruments de dessin et autres outils de génie
                    civil. Demandez la liste disponible et les prix en cours.
                  </p>
                </div>
              </div>
            </div>

            <div className="alert alert-warning" style={{ marginTop: 26 }}>
              <Info size={18} aria-hidden="true" />
              <span>
                Pour connaître la disponibilité et les prix, contactez-nous. Une
                commande n&apos;est confirmée qu&apos;après échange avec
                l&apos;administration.
              </span>
            </div>

            <div className="btn-row" style={{ marginTop: 24 }}>
              <Link className="btn" href="/contact?sujet=Commerce">
                Demander un prix
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link className="btn btn-outline" href="/prestations">
                Voir les prestations
              </Link>
            </div>
          </div>

          <aside className="aside-stack" style={{ gridTemplateColumns: "1fr" }}>
            {promoters.map((promoter) => (
              <PromoterCard promoter={promoter} key={promoter.key} />
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
