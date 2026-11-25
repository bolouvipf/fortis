import type { Metadata } from "next";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/auth";
import { getNewMessageCount, getPendingQuittanceCount } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdmin();
  const [pendingCount, newMessageCount] = await Promise.all([
    getPendingQuittanceCount(),
    getNewMessageCount(),
  ]);

  return (
    <div className="admin-shell">
      <AdminSidebar
        userName={session.name}
        userEmail={session.email}
        pendingCount={pendingCount}
        newMessageCount={newMessageCount}
      />
      <div className="admin-main">{children}</div>
    </div>
  );
}
