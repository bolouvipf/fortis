"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { navigation } from "@/lib/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="FORTIS — accueil">
          <Image
            src="/logo.jpg"
            alt=""
            width={44}
            height={44}
            priority
            sizes="44px"
          />
          <span>
            <span className="brand-name">FORTIS</span>
            <span className="brand-tag">Bâtir · Gérer · Développer</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Navigation principale">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="btn btn-sm" href="/quittance">
            Ma quittance
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mobile-nav" id="menu-mobile">
          <nav aria-label="Navigation mobile">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link className="btn btn-block" href="/quittance">
              Demander ma quittance
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
