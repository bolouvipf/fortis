import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  DraftingCompass,
  Monitor,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import { formations } from "@/lib/site";

export const metadata: Metadata = {
  title: "Formation — Archicad, bureautique et intelligence artificielle",
  description:
    "Formations pratiques FORTIS : Archicad, Excel/Word/PowerPoint et utilisation des intelligences artificielles. Demandez votre quittance de formation en ligne.",
  alternates: { canonical: "/formation" },
};

const offers = [
  {
    title: "Archicad",
    icon: DraftingCompass,
    description:
      "Prise en main du logiciel pour concevoir et dessiner des plans de bâtiment.",
    detail:
      "Une formation tournée vers la pratique, pour produire des plans propres et utilisables sur un projet réel.",
  },
  {
    title: "Informatique : Excel, Word, PowerPoint",
    icon: Monitor,
    description:
      "Maîtriser la bureautique pour le travail et les études.",
    detail:
      "Tableaux, mise en forme, présentations : les bases solides attendues dans un cadre professionnel ou académique.",
  },
  {
    title: "Utilisation des intelligences artificielles",
    icon: Sparkles,
    description:
      "Apprendre à utiliser les outils d'IA pour gagner du temps au quotidien et au travail.",
    detail:
      "Des cas concrets pour rédiger, synthétiser, préparer des visuels et organiser son travail avec les bons réflexes.",
  },
] as const;

export default function FormationPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Formation</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <span className="eyebrow">Activité · Compétences</span>
              <h1>Des formations qui servent vraiment.</h1>
              <p className="lead">
                Archicad, bureautique, intelligence artificielle : des programmes
                pratiques pour acquérir des compétences utiles au travail et dans
                les études.
              </p>
            </div>
            <div className="hero-fact">
              <ShieldCheck size={17} aria-hidden="true" />
              <span>
                <strong>Quittance vérifiée</strong>
                Après paiement, demandez votre quittance en ligne. Elle est
                validée puis envoyée par email.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Catalogue</span>
              <h2 className="section-title">Trois parcours, trois usages concrets.</h2>
              <p className="lead">
                Les dates et tarifs sont communiqués sur demande. Chaque formation
                peut faire l&apos;objet d&apos;une quittance après règlement.
              </p>
            </div>
            <Link className="section-link" href="/contact?sujet=Formation">
              Demander les dates et tarifs
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="offer-grid">
            {offers.map((offer) => {
              const Icon = offer.icon;
              return (
                <article className="offer" key={offer.title}>
                  <span className="offer-icon">
                    <Icon size={21} strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                  <p style={{ marginTop: 10, fontSize: "0.82rem" }}>
                    {offer.detail}
                  </p>
                  <div className="offer-foot">
                    <div className="btn-row">
                      <Link
                        className="btn btn-sm"
                        href={`/quittance?formation=${encodeURIComponent(offer.title)}`}
                      >
                        Demander ma quittance
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                      <Link
                        className="btn btn-sm btn-ghost"
                        href="/contact?sujet=Formation"
                      >
                        Poser une question
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Après le paiement</span>
              <h2 className="section-title">De l&apos;inscription à la quittance.</h2>
            </div>
          </div>
          <div className="steps">
            <article className="step">
              <span className="step-num">01</span>
              <div>
                <h3>Choisir sa formation</h3>
                <p>
                  Contactez-nous pour connaître les dates, le tarif et les
                  modalités de la formation qui vous intéresse.
                </p>
              </div>
            </article>
            <article className="step">
              <span className="step-num">02</span>
              <div>
                <h3>Régler les frais</h3>
                <p>
                  Le paiement se fait directement auprès de FORTIS, en espèces ou
                  par Mobile Money. Aucun paiement n&apos;est encaissé sur ce site.
                </p>
              </div>
            </article>
            <article className="step">
              <span className="step-num">03</span>
              <div>
                <h3>Demander sa quittance</h3>
                <p>
                  Remplissez le formulaire en ligne. Après vérification du
                  paiement, la quittance PDF est envoyée à votre adresse email.
                </p>
              </div>
            </article>
          </div>

          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn" href="/quittance">
              Demander ma quittance
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="btn btn-outline" href="/contact?sujet=Formation">
              Contacter l&apos;administration
            </Link>
          </div>

          <div className="alert alert-info" style={{ marginTop: 26 }}>
            <ShieldCheck size={18} aria-hidden="true" />
            <span>
              Les formations disponibles sont : {formations.join(" · ")}. Pour
              toute autre demande, précisez-la dans le formulaire de quittance ou
              contactez-nous.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
