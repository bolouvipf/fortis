import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  ClipboardList,
  Info,
  MapPin,
} from "lucide-react";

import { PromoterCard } from "@/components/site/promoter-card";
import { promoters } from "@/lib/site";

export const metadata: Metadata = {
  title: "BTP — Bâtiment et travaux publics",
  description:
    "FORTIS intervient dans le bâtiment et les travaux publics au Bénin. Contactez notre spécialiste pour étudier votre projet et obtenir un devis.",
  alternates: { canonical: "/btp" },
};

const donald = promoters.find((promoter) => promoter.key === "donald")!;

export default function BtpPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">BTP</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <span className="eyebrow">Activité · Bâtiment</span>
              <h1>Bâtiment et travaux publics.</h1>
              <p className="lead">
                Construire, rénover ou aménager : FORTIS étudie votre projet avec
                vous et vous oriente vers la solution adaptée. Le catalogue
                détaillé des prestations BTP sera publié prochainement.
              </p>
            </div>
            <div className="hero-fact">
              <Info size={17} aria-hidden="true" />
              <span>
                <strong>Catalogue en préparation</strong>
                En attendant la publication du détail, chaque demande est étudiée
                directement par notre spécialiste.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <div className="prose">
            <span className="eyebrow">Votre projet</span>
            <h2 style={{ marginTop: 12 }}>Parlons de ce que vous voulez construire.</h2>
            <p>
              Un projet de bâtiment se prépare. Avant de parler de budget, il faut
              clarifier le besoin, le terrain et les contraintes. Notre spécialiste
              BTP vous aide à poser ces éléments, puis vous indique la suite.
            </p>

            <div className="detail-list">
              <div className="detail-item">
                <span className="detail-icon">
                  <ClipboardList size={19} aria-hidden="true" />
                </span>
                <div>
                  <h3>La nature du projet</h3>
                  <p>
                    Construction neuve, rénovation, extension ou aménagement :
                    décrivez ce que vous voulez obtenir.
                  </p>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">
                  <MapPin size={19} aria-hidden="true" />
                </span>
                <div>
                  <h3>Le lieu et le terrain</h3>
                  <p>
                    Indiquez la localisation, la superficie disponible et les
                    éventuelles contraintes déjà connues.
                  </p>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">
                  <CalendarClock size={19} aria-hidden="true" />
                </span>
                <div>
                  <h3>Le délai et le budget indicatif</h3>
                  <p>
                    Une échéance et une enveloppe, même approximatives, permettent
                    de proposer une réponse réaliste.
                  </p>
                </div>
              </div>
            </div>

            <div className="alert alert-info" style={{ marginTop: 26 }}>
              <Info size={18} aria-hidden="true" />
              <span>
                <strong>À venir :</strong> le détail des prestations BTP (études,
                suivi de chantier, conseil) sera publié sur cette page. Pour une
                demande précise ou un devis, contactez directement notre
                spécialiste.
              </span>
            </div>

            <div className="btn-row" style={{ marginTop: 24 }}>
              <Link className="btn" href="/contact?sujet=BTP">
                Demander un devis
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a className="btn btn-outline" href={`mailto:${donald.email}`}>
                Écrire à Donald
              </a>
            </div>
          </div>

          <aside className="aside-stack" style={{ gridTemplateColumns: "1fr" }}>
            <PromoterCard promoter={donald} />
            <div className="info-card">
              <h3 style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Building2 size={16} aria-hidden="true" />
                Bâtiment & travaux publics
              </h3>
              <p>
                FORTIS intervient dans le bâtiment et les travaux publics. Pour
                gagner du temps, préparez les informations essentielles avant
                l&apos;appel.
              </p>
              <Link className="btn btn-sm btn-outline" href="/contact?sujet=BTP">
                Ouvrir une demande
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
