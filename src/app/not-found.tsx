import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 620, textAlign: "center" }}>
        <FileQuestion
          size={44}
          strokeWidth={1.4}
          aria-hidden="true"
          style={{ margin: "0 auto 18px", color: "var(--line-strong)" }}
        />
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Page introuvable.</h1>
        <p className="lead" style={{ marginTop: 14 }}>
          La page demandée n&apos;existe pas ou a été déplacée. Si vous cherchez
          une quittance, utilisez le lien de suivi reçu par email.
        </p>
        <div
          className="btn-row"
          style={{ justifyContent: "center", marginTop: 26 }}
        >
          <Link className="btn" href="/">
            <ArrowLeft size={16} aria-hidden="true" />
            Retour à l&apos;accueil
          </Link>
          <Link className="btn btn-outline" href="/quittance">
            Demander une quittance
          </Link>
          <Link className="btn btn-outline" href="/contact">
            Nous écrire
          </Link>
        </div>
      </div>
    </section>
  );
}
