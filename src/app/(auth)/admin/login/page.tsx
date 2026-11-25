import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Connexion administration",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="login-page">
      <div className="login-visual">
        <Link className="brand" href="/">
          <Image src="/logo.jpg" alt="" width={44} height={44} priority sizes="44px" />
          <span>
            <span className="brand-name">FORTIS</span>
            <span className="brand-tag">Bâtir · Gérer · Développer</span>
          </span>
        </Link>

        <div>
          <span className="eyebrow">Espace réservé</span>
          <h1 style={{ marginTop: 14 }}>Administration FORTIS.</h1>
          <p>
            Validez les demandes de quittance, vérifiez les paiements et répondez
            aux messages reçus depuis le site. Chaque décision est journalisée.
          </p>
        </div>

        <p style={{ fontSize: "0.78rem" }}>
          <ShieldCheck
            size={14}
            aria-hidden="true"
            style={{ display: "inline", marginRight: 6, verticalAlign: "-2px" }}
          />
          Connexion protégée · Session de 12 heures
        </p>
      </div>

      <div className="login-form-wrap">
        <div className="login-card">
          <Link className="admin-login-link" href="/">
            <ArrowLeft size={14} aria-hidden="true" />
            Retour au site
          </Link>
          <h2 style={{ marginTop: 18 }}>Connexion</h2>
          <p className="lead">
            Utilisez le compte administrateur créé lors de l&apos;installation du
            site.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
