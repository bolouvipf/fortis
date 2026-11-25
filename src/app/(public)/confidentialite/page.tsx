import type { Metadata } from "next";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment FORTIS collecte, utilise et conserve les données transmises via ses formulaires.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Confidentialité</span>
          </nav>
          <span className="eyebrow">Vos données</span>
          <h1>Politique de confidentialité.</h1>
          <p className="lead">
            Cette page explique quelles données sont collectées par le site
            FORTIS, pourquoi elles le sont et comment exercer vos droits.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose" style={{ maxWidth: 780 }}>
            <h2>Qui est responsable ?</h2>
            <p>
              Le site est édité par FORTIS, société de services au Bénin. Pour
              toute question relative à vos données, écrivez à{" "}
              <a href={`mailto:${site.email}`} className="table-link">
                {site.email}
              </a>{" "}
              ou appelez le {site.phoneDisplay}.
            </p>

            <h2 style={{ marginTop: 30 }}>Quelles données sont collectées ?</h2>
            <p>
              Les formulaires du site collectent uniquement les informations que
              vous saisissez :
            </p>
            <ul style={{ margin: "12px 0 0 20px", color: "var(--muted)", lineHeight: 1.8 }}>
              <li>
                <strong>Demande de quittance :</strong> nom ou raison sociale,
                email, téléphone, formation, période, montant, mode et date de
                paiement, référence de paiement et précisions éventuelles.
              </li>
              <li>
                <strong>Contact et prestations :</strong> nom, email et/ou
                téléphone, sujet et contenu du message.
              </li>
              <li>
                <strong>Espace administration :</strong> adresse email et mot de
                passe pour les comptes autorisés. Le mot de passe est stocké sous
                forme chiffrée (hachage) et n&apos;est jamais lisible.
              </li>
            </ul>

            <h2 style={{ marginTop: 30 }}>Pourquoi ces données ?</h2>
            <p>
              Les informations servent à vérifier un paiement, établir et envoyer
              une quittance, répondre à un message, ou traiter une demande de
              prestation. Elles ne sont ni vendues ni utilisées pour de la
              publicité.
            </p>

            <h2 style={{ marginTop: 30 }}>Combien de temps sont-elles conservées ?</h2>
            <p>
              Les demandes de quittance et les messages sont conservés le temps
              nécessaire à leur traitement et au suivi administratif et comptable
              de FORTIS. Les données peuvent ensuite être supprimées ou
              anonymisées, sauf obligation légale de conservation.
            </p>

            <h2 style={{ marginTop: 30 }}>Qui peut y accéder ?</h2>
            <p>
              Seules les personnes autorisées de l&apos;administration FORTIS
              accèdent aux demandes. Le site s&apos;appuie sur des prestataires
              techniques pour l&apos;hébergement et l&apos;envoi des emails ; ils
              traitent les données pour ce seul compte.
            </p>

            <h2 style={{ marginTop: 30 }}>Cookies</h2>
            <p>
              Le site public ne dépose pas de cookie publicitaire ni de cookie de
              mesure d&apos;audience. L&apos;espace administration utilise un
              cookie de session strictement nécessaire à la connexion, protégé et
              limité à la durée de la session.
            </p>

            <h2 style={{ marginTop: 30 }}>Vos droits</h2>
            <p>
              Vous pouvez demander l&apos;accès à vos informations, leur
              rectification ou leur suppression, dans les limites des obligations
              légales de conservation. Adressez votre demande à{" "}
              <a href={`mailto:${site.email}`} className="table-link">
                {site.email}
              </a>{" "}
              en précisant la référence concernée (par exemple une référence de
              quittance ou de message).
            </p>

            <div className="alert alert-info" style={{ marginTop: 30 }}>
              <Lock size={18} aria-hidden="true" />
              <span>
                Les échanges sont chiffrés en transit (HTTPS). L&apos;accès à
                l&apos;espace administration est protégé par mot de passe et
                journalisé.
              </span>
            </div>

            <div className="btn-row" style={{ marginTop: 26 }}>
              <a className="btn btn-outline" href={`mailto:${site.email}`}>
                <Mail size={16} aria-hidden="true" />
                Contacter l&apos;administration
              </a>
              <Link className="btn" href="/contact">
                Formulaire de contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
