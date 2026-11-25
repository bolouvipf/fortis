import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { activities, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="footer-brand" href="/">
              <Image src="/logo.jpg" alt="" width={42} height={42} sizes="42px" />
              <span>
                <span className="brand-name">FORTIS</span>
                <span className="brand-tag">Bâtir · Gérer · Développer</span>
              </span>
            </Link>
            <p>
              Société de services au Bénin : bâtiment et travaux publics,
              comptabilité, formation et commerce. Une équipe qui accompagne
              vos projets, de l&apos;étude à l&apos;exécution.
            </p>
          </div>

          <div>
            <h3>Activités</h3>
            <div className="footer-links">
              {activities.map((activity) => (
                <Link key={activity.href} href={activity.href}>
                  {activity.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3>Services</h3>
            <div className="footer-links">
              <Link href="/quittance">Demander une quittance</Link>
              <Link href="/prestations">Prestations administratives</Link>
              <Link href="/verifier">Vérifier une quittance</Link>
              <Link href="/contact">Nous écrire</Link>
            </div>
          </div>

          <div>
            <h3>Administration</h3>
            <div className="footer-links">
              <a href={`tel:${site.phone}`}>
                <Phone size={14} aria-hidden="true" style={{ display: "inline", marginRight: 6 }} />
                {site.phoneDisplay}
              </a>
              <a href={`mailto:${site.email}`}>
                <Mail size={14} aria-hidden="true" style={{ display: "inline", marginRight: 6 }} />
                {site.email}
              </a>
              <a
                href="https://wa.me/2290154085128"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={14} aria-hidden="true" style={{ display: "inline", marginRight: 6 }} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} FORTIS · Bénin</span>
          <Link href="/admin/login">
            <ShieldCheck size={14} aria-hidden="true" />
            Espace administration
            <ArrowUpRight size={12} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
