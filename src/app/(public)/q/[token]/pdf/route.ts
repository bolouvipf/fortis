import { findQuittanceByToken } from "@/lib/queries";
import { buildQuittancePdf } from "@/lib/pdf/quittance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const quittance = await findQuittanceByToken(token);

  if (!quittance || quittance.status !== "approved") {
    return new Response("Quittance introuvable ou non validée.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  try {
    const pdf = await buildQuittancePdf(quittance);
    const number = quittance.quittanceNumber ?? quittance.reference;
    const filename = `Quittance-FORTIS-${number.replace(/^FORTIS-/, "")}.pdf`;

    return new Response(new Blob([new Uint8Array(pdf)], { type: "application/pdf" }), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[pdf] génération impossible", error);
    return new Response("Le PDF n'a pas pu être généré.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
