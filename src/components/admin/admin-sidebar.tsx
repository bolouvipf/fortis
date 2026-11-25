"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import { logoutAdmin } from "@/actions/admin";
import { initials } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/quittances", label: "Quittances", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({
  userName,
  userEmail,
  pendingCount,
  newMessageCount,
}: {
  userName: string;
  userEmail: string;
  pendingCount: number;
  newMessageCount: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/admin">
        <span>
          <strong>FORTIS</strong>
          <span>Administration</span>
        </span>
      </Link>

      <nav className="admin-nav" aria-label="Navigation administration">
        {items.map((item) => {
          const Icon = item.icon;
          const count =
            item.href === "/admin/quittances"
              ? pendingCount
              : item.href === "/admin/messages"
                ? newMessageCount
                : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              <Icon size={16} aria-hidden="true" />
              {item.label}
              {count > 0 ? <span className="count">{count}</span> : null}
            </Link>
          );
        })}
        <Link href="/" target="_blank">
          <ExternalLink size={16} aria-hidden="true" />
          Voir le site
        </Link>
      </nav>

      <div className="admin-sidebar-foot">
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
          <span className="avatar" style={{ width: 34, height: 34, fontSize: "0.68rem" }}>
            {initials(userName)}
          </span>
          <span style={{ minWidth: 0 }}>
            <strong
              style={{
                display: "block",
                color: "#fff",
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </strong>
            <span
              style={{
                display: "block",
                fontSize: "0.68rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userEmail}
            </span>
          </span>
        </div>
        <form action={logoutAdmin}>
          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: 0,
              padding: 0,
              color: "rgba(255,255,255,.78)",
              fontSize: "0.76rem",
              cursor: "pointer",
            }}
          >
            <LogOut size={14} aria-hidden="true" />
            Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  );
}
