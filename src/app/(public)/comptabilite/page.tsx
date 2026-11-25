import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Boxes,
  Building2,
  TrendingUp,
} from "lucide-react";

import { PromoterCard } from "@/components/site/promoter-card";
import { promoters } from "@/lib/site";

export const metadata: Metadata = {
  title: "Comptabilité — Tenue des comptes et conseil",
  description:
    "Tenue de la comptabilité, inventaires et suivi des stocks, conseil financier pour TPE, PME et indépendants. FORTIS travaille avec Perfecto, Hypersoft et Excel.",
  alternates: { canonical: "/comptabilite" },
};

const mederic = promoters.find((promoter) => promoter.key === "mederic")!;

export default function ComptabilitePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Comptabilité</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <span className="eyebrow">Activité · Gestion</span>
              <h1>Une comptabilité rigoureuse, sans jargon inutile.</h1>
              <p className="lead">
                Pour les TPE, PME et indépendants : tenue des comptes,
                inventaires, suivi des stocks et accompagnement budgétaire. Vous
                gardez une vision claire de votre activité.
              </p>
            </div>
            <div className="hero-fact">
              <TrendingUp size={17} aria-hidden="true" />
              <span>
                <strong>Des outils maîtrisés</strong>
                Perfecto, Hypersoft et Excel, adaptés à votre organisation.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <div className="prose">
            <span className="eyebrow">Nos interventions</span>
            <h2 style={{ marginTop: 12 }}>Ce que nous prenons en charge.</h2>
            <p>
              La comptabilité n&apos;est pas qu&apos;une obligation : c&apos;est
              un outil de décision. Nous enregistrons, suivons et expliquons vos
              chiffres pour que vous puissiez avancer avec confiance.
            </p>

            <div className="detail-list">
              <div className="detail-item">
                <span className="detail-icon">
                  <BookOpenCheck size={19} aria-hidden="true" />
                </span>
                <div>
                  <h3>Tenue de la comptabilité</h3>
                  <p>
                    Enregistrement des écritures quotidiennes, mise à jour des
                    livres comptables et des journaux.
                  </p>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">
                  <Boxes size={19} aria-hidden="true" />
                </span>
                <div>
                  <h3>Inventaires et suivi des stocks</h3>
                  <p>
                    Tableaux de suivi sous Excel pour les stocks, les inventaires
                    et les écritures associées.
                  </p>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">
                  <TrendingUp size={19} aria-hidden="true" />
                </span>
                <div>
                  <h3>Conseil financier</h3>
                  <p>
                    Accompagnement dans la stratégie budgétaire : priorités,
                    postes de dépenses, préparation des décisions.
                  </p>
                </div>
              </div>
            </div>

            <h2 style={{ marginTop: 36, fontSize: "1.35rem" }}>
              Pour qui ?
            </h2>
            <div className="chip-grid-light" style={{ marginTop: 12 }}>
              <span className="chip-light">
                <Building2 size={14} aria-hidden="true" />
                TPE
              </span>
              <span className="chip-light">
                <Building2 size={14} aria-hidden="true" />
                PME
              </span>
              <span className="chip-light">
                <Building2 size={14} aria-hidden="true" />
                Indépendants
              </span>
            </div>

            <h2 style={{ marginTop: 34, fontSize: "1.35rem" }}>
              Logiciels utilisés
            </h2>
            <div className="chip-grid-light" style={{ marginTop: 12 }}>
              <span className="chip-light">Perfecto</span>
              <span className="chip-light">Hypersoft</span>
              <span className="chip-light">Excel</span>
            </div>

            <div className="btn-row" style={{ marginTop: 28 }}>
              <Link className="btn" href="/contact?sujet=Comptabilité">
                Prendre contact
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a className="btn btn-outline" href={`mailto:${mederic.email}`}>
                Écrire à Mederic
              </a>
            </div>
          </div>

          <aside className="aside-stack" style={{ gridTemplateColumns: "1fr" }}>
            <PromoterCard promoter={mederic} />
            <div className="info-card">
              <h3>Premier échange</h3>
              <p>
                Décrivez votre situation : activité, volume d&apos;écritures,
                outils déjà utilisés. Un premier échange permet de cadrer le
                besoin avant toute proposition.
              </p>
              <Link
                className="btn btn-sm btn-outline"
                href="/contact?sujet=Comptabilité"
              >
                Ouvrir une demande
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
