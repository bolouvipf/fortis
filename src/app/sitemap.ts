import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/urls";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const routes: Array<{ path: string; priority: number }> = [
    { path: "/", priority: 1 },
    { path: "/btp", priority: 0.8 },
    { path: "/comptabilite", priority: 0.8 },
    { path: "/formation", priority: 0.9 },
    { path: "/commerce", priority: 0.7 },
    { path: "/prestations", priority: 0.9 },
    { path: "/quittance", priority: 0.9 },
    { path: "/verifier", priority: 0.6 },
    { path: "/contact", priority: 0.8 },
    { path: "/confidentialite", priority: 0.3 },
  ];

  return routes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
