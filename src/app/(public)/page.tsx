import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  Mail,
  MailCheck,
  Phone,
  Search,
  ShieldCheck,
  Clock,
  MessageCircle,
} from "lucide-react";

import { ActivityGlyph } from "@/components/site/activity-glyph";
import {
  activities,
  formatPhone,
  prestations,
  promoters,
  site,
} from "@/lib/site";
import { initials } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FORTIS — BTP, comptabilité, formation et commerce",
  description:
    "Bâtir. Gérer. Développer. FORTIS accompagne vos projets de construction, votre comptabilité, vos formations et vos démarches administratives au Bénin.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Société de services · Bénin</span>
            <h1>
              <span className="word-ink">Bâtir.</span>{" "}
              <span className="word-green">Gérer.</span>
              <br />
              <span className="word-orange">Développer.</span>
            </h1>
            <p className="lead">
              Quatre métiers complémentaires au service de vos projets : le
              bâtiment et les travaux publics, la comptabilité, la formation et
              le commerce. Une seule adresse pour avancer.
            </p>
            <div className="hero-actions">
              <Link className="btn" href="/quittance">
                Demander ma quittance
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link className="btn btn-outline" href="#activites">
                Découvrir nos activités
              </Link>
            </div>
            <ul className="hero-trust">
              <li>
                <ShieldCheck size={17} aria-hidden="true" />
                Quittance validée par l&apos;administration
              </li>
              <li>
                <MailCheck size={17} aria-hidden="true" />
                PDF envoyé par email
              </li>
              <li>
                <Clock size={17} aria-hidden="true" />
                Suivi de votre demande en ligne
              </li>
            </ul>
          </div>

          <div className="flow-wrap">
            <div className="flow-card">
              <Image
                className="flow-seal"
                src="/logo.jpg"
                alt=""
                width={62}
                height={62}
                sizes="62px"
              />
              <div className="flow-head">
                <span className="flow-head-title">
                  <FileText size={17} aria-hidden="true" />
                  Dossier de quittance
                </span>
                <span className="badge badge-orange">Validation requise</span>
              </div>
              <ol className="flow-list">
                <li className="flow-item" data-state="done">
                  <span className="flow-icon">
                    <Check size={17} aria-hidden="true" />
                  </span>
                  <span>
                    <b>Demande enregistrée</b>
                    <small>Vos informations et le paiement sont transmis.</small>
                  </span>
                  <span className="flow-tag">Étape 1</span>
                </li>
                <li className="flow-item" data-state="active">
                  <span className="flow-icon">
                    <Search size={17} aria-hidden="true" />
                  </span>
                  <span>
                    <b>Vérification administrative</b>
                    <small>
                      L&apos;administration contrôle le règlement et les
                      informations.
                    </small>
                  </span>
                  <span className="flow-tag">Étape 2</span>
                </li>
                <li className="flow-item">
                  <span className="flow-icon">
                    <Mail size={17} aria-hidden="true" />
                  </span>
                  <span>
                    <b>Quittance envoyée</b>
                    <small>
                      Le PDF signé arrive par email, avec un lien de
                      vérification.
                    </small>
                  </span>
                  <span className="flow-tag">Étape 3</span>
                </li>
              </ol>
              <div className="flow-foot">
                <ShieldCheck size={15} aria-hidden="true" />
                <span>
                  Aucune quittance n&apos;est délivrée automatiquement : chaque
                  document passe par une validation humaine.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="activites">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Nos activités</span>
              <h2 className="section-title">Quatre domaines, une même exigence.</h2>
              <p className="lead">
                Chaque activité est portée par un spécialiste identifié. Vous
                savez à qui vous parlez et qui suit votre dossier.
              </p>
            </div>
            <Link className="section-link" href="/contact">
              Parler à un spécialiste
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="activity-grid">
            {activities.map((activity, index) => (
              <Link
                className="activity-card"
                href={activity.href}
                key={activity.href}
              >
                <div className="activity-top">
                  <span className="activity-icon">
                    <ActivityGlyph name={activity.icon} />
                  </span>
                  <span className="activity-num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3>{activity.name}</h3>
                <p>{activity.description}</p>
                <ul className="activity-list">
                  {activity.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <span className="activity-link">
                  Voir le détail
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="banner">
            <div className="banner-grid">
              <div>
                <span className="eyebrow">Prestations administratives</span>
                <h2>Vos démarches, accompagnées de bout en bout.</h2>
                <p>
                  CV, lettre de motivation, RCCM, IFU, passeport, casier
                  judiciaire… Décrivez votre besoin : l&apos;administration vous
                  indique les documents à fournir et le tarif avant de commencer.
                </p>
                <div className="btn-row">
                  <Link className="btn btn-light" href="/prestations">
                    Demander une prestation
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="chip-grid" aria-label="Exemples de prestations">
                {prestations.slice(0, 8).map((prestation) => (
                  <Link
                    className="chip"
                    href={`/prestations?service=${encodeURIComponent(prestation)}`}
                    key={prestation}
                  >
                    <FileText size={14} aria-hidden="true" />
                    {prestation}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="quittance">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Quittance de formation</span>
              <h2 className="section-title">
                Une quittance en règle, sans improvisation.
              </h2>
              <p className="lead">
                Le document n&apos;est plus généré automatiquement par le
                visiteur. La demande est enregistrée, vérifiée, puis la
                quittance est délivrée par l&apos;administration.
              </p>
            </div>
          </div>

          <div className="steps">
            <article className="step">
              <span className="step-num">01</span>
              <div>
                <h3>Vous transmettez la demande</h3>
                <p>
                  Nom, formation suivie, période, montant et mode de paiement.
                  Vous recevez immédiatement une référence de suivi par email.
                </p>
              </div>
            </article>
            <article className="step">
              <span className="step-num">02</span>
              <div>
                <h3>L&apos;administration vérifie</h3>
                <p>
                  Le paiement et les informations sont contrôlés. En cas de
                  pièce manquante, vous êtes contacté avec un motif clair.
                </p>
              </div>
            </article>
            <article className="step">
              <span className="step-num">03</span>
              <div>
                <h3>Vous recevez votre quittance</h3>
                <p>
                  Après validation, le PDF est envoyé par email. Chaque document
                  porte un numéro unique et peut être vérifié en ligne.
                </p>
              </div>
            </article>
          </div>

          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn" href="/quittance">
              Commencer ma demande
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="btn btn-outline" href="/verifier">
              Vérifier une quittance
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="interlocuteurs">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Vos interlocuteurs</span>
              <h2 className="section-title">Des personnes, pas un guichet anonyme.</h2>
              <p className="lead">
                Deux spécialistes suivent les activités FORTIS. Contactez
                directement la personne concernée par votre demande.
              </p>
            </div>
          </div>

          <div className="promoter-grid">
            {promoters.map((promoter) => (
              <article className="promoter" key={promoter.key}>
                <span className="avatar" aria-hidden="true">
                  {initials(promoter.name)}
                </span>
                <div>
                  <h3>{promoter.name}</h3>
                  <p className="role">{promoter.role}</p>
                  <div className="contact-links">
                    {promoter.phones.map((phone) => (
                      <a href={`tel:+229${phone}`} key={phone}>
                        <Phone size={14} aria-hidden="true" />
                        {formatPhone(phone)}
                      </a>
                    ))}
                    <a href={`mailto:${promoter.email}`}>
                      <Mail size={14} aria-hidden="true" />
                      {promoter.email}
                    </a>
                    <a
                      href={`https://wa.me/${promoter.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle size={14} aria-hidden="true" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Un projet, une démarche, une question ?</h2>
              <p>
                Écrivez-nous : votre message est enregistré et transmis à
                l&apos;administration avec une référence de suivi. Vous pouvez
                aussi nous appeler directement.
              </p>
            </div>
            <div className="btn-row">
              <Link className="btn" href="/contact">
                Nous écrire
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a className="btn btn-outline" href={`tel:${site.phone}`}>
                <Phone size={16} aria-hidden="true" />
                {site.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
