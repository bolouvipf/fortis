"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { adminUsers, messages, quittanceRequests } from "@/lib/db/schema";
import {
  clearSessionCookie,
  createSessionToken,
  getSession,
  requireAdmin,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { sendMail } from "@/lib/email";
import { approvedEmail, rejectedEmail } from "@/lib/email-templates";
import { buildQuittancePdf } from "@/lib/pdf/quittance";
import { nextQuittanceNumber, writeAudit } from "@/lib/queries";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { clientKey } from "@/lib/request";
import {
  collectFieldErrors,
  loginSchema,
  rejectionSchema,
  type FormState,
} from "@/lib/validation";

export type AdminActionState = {
  ok: boolean;
  message?: string;
  tone?: "success" | "warning" | "error";
};

export async function loginAdmin(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = {
    email: String(formData.get("email") ?? ""),
  };
  const key = await clientKey("login");
  const limited = rateLimit(key, { limit: 6, windowMs: 15 * 60_000 });

  if (!limited.allowed) {
    return {
      ok: false,
      message: `Trop de tentatives. Réessayez dans ${Math.ceil(limited.retryAfterSeconds / 60)} minute(s).`,
      values,
    };
  }

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Vérifiez votre email et votre mot de passe.",
      errors: collectFieldErrors(parsed.error.issues),
      values,
    };
  }

  const email = parsed.data.email.toLowerCase();
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  const valid = user
    ? await verifyPassword(parsed.data.password, user.passwordHash)
    : false;

  if (!user || !valid) {
    await writeAudit({
      actorEmail: email,
      action: "admin.login_failed",
      targetType: "session",
      targetId: email,
    });
    return {
      ok: false,
      message: "Email ou mot de passe incorrect.",
      values,
    };
  }

  resetRateLimit(key);
  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  });
  await setSessionCookie(token);

  await writeAudit({
    actorEmail: user.email,
    action: "admin.login",
    targetType: "session",
    targetId: user.id,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const session = await getSession();
  if (session) {
    await writeAudit({
      actorEmail: session.email,
      action: "admin.logout",
      targetType: "session",
      targetId: session.sub,
    });
  }
  await clearSessionCookie();
  redirect("/admin/login");
}

function pdfName(number: string) {
  return `Quittance-FORTIS-${number.replace(/^FORTIS-/, "")}.pdf`;
}

export async function approveQuittance(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  const [request] = await db
    .select()
    .from(quittanceRequests)
    .where(eq(quittanceRequests.id, id))
    .limit(1);

  if (!request) {
    return { ok: false, tone: "error", message: "Demande introuvable." };
  }

  if (request.status === "approved") {
    return {
      ok: true,
      tone: "warning",
      message: "Cette quittance est déjà validée. Utilisez « Renvoyer l'email » si besoin.",
    };
  }

  const number = request.quittanceNumber ?? (await nextQuittanceNumber());

  let pdf: Uint8Array;

  try {
    pdf = await buildQuittancePdf({ ...request, quittanceNumber: number });
  } catch (error) {
    console.error("[pdf] génération impossible", error);
    return {
      ok: false,
      tone: "error",
      message:
        "Le PDF n'a pas pu être généré. La demande reste en attente, réessayez.",
    };
  }

  try {
    await db
      .update(quittanceRequests)
      .set({
        status: "approved",
        quittanceNumber: number,
        reviewedAt: new Date(),
        reviewedBy: session.email,
        rejectionReason: null,
        emailStatus: "pending",
        emailError: null,
      })
      .where(eq(quittanceRequests.id, request.id));
  } catch (error) {
    console.error("[quittance] validation impossible", error);
    return {
      ok: false,
      tone: "error",
      message:
        "La validation n'a pas pu être enregistrée (numéro déjà utilisé ?). Réessayez.",
    };
  }

  const mail = approvedEmail({ ...request, quittanceNumber: number });
  const result = await sendMail({
    to: request.clientEmail,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    attachments: [
      {
        filename: pdfName(number),
        content: Buffer.from(pdf).toString("base64"),
      },
    ],
  });

  await db
    .update(quittanceRequests)
    .set({
      emailStatus: result.status,
      emailSentAt: result.status === "sent" ? new Date() : null,
      emailError: result.error ?? null,
    })
    .where(eq(quittanceRequests.id, request.id));

  await writeAudit({
    actorEmail: session.email,
    action: "quittance.approved",
    targetType: "quittance",
    targetId: request.id,
    metadata: {
      number,
      emailStatus: result.status,
      emailError: result.error ?? null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/quittances");
  revalidatePath(`/admin/quittances/${request.id}`);
  revalidatePath(`/q/${request.publicToken}`);
  revalidatePath(`/quittance/confirmation/${request.publicToken}`);
  revalidatePath("/verifier");

  if (result.status === "sent") {
    return {
      ok: true,
      tone: "success",
      message: `Quittance ${number} validée et envoyée à ${request.clientEmail}.`,
    };
  }

  if (result.status === "skipped") {
    return {
      ok: true,
      tone: "warning",
      message: `Quittance ${number} validée. Email simulé : le PDF est disponible dans l'espace admin (mode développement).`,
    };
  }

  return {
    ok: true,
    tone: "warning",
    message: `Quittance ${number} validée, mais l'email n'a pas pu être envoyé : ${result.error ?? "erreur inconnue"}. Réessayez l'envoi ci-dessous.`,
  };
}

export async function rejectQuittance(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdmin();
  const parsed = rejectionSchema.safeParse({
    id: formData.get("id"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      tone: "error",
      message:
        parsed.error.issues[0]?.message ?? "Précisez le motif du rejet.",
    };
  }

  const [request] = await db
    .select()
    .from(quittanceRequests)
    .where(eq(quittanceRequests.id, parsed.data.id))
    .limit(1);

  if (!request) {
    return { ok: false, tone: "error", message: "Demande introuvable." };
  }

  if (request.status === "approved") {
    return {
      ok: false,
      tone: "error",
      message: "Une quittance déjà validée ne peut pas être rejetée.",
    };
  }

  await db
    .update(quittanceRequests)
    .set({
      status: "rejected",
      rejectionReason: parsed.data.reason,
      reviewedAt: new Date(),
      reviewedBy: session.email,
      emailStatus: "pending",
      emailError: null,
    })
    .where(eq(quittanceRequests.id, request.id));

  const mail = rejectedEmail({
    ...request,
    rejectionReason: parsed.data.reason,
  });
  const result = await sendMail({
    to: request.clientEmail,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });

  await db
    .update(quittanceRequests)
    .set({
      emailStatus: result.status,
      emailSentAt: result.status === "sent" ? new Date() : null,
      emailError: result.error ?? null,
    })
    .where(eq(quittanceRequests.id, request.id));

  await writeAudit({
    actorEmail: session.email,
    action: "quittance.rejected",
    targetType: "quittance",
    targetId: request.id,
    metadata: { reason: parsed.data.reason, emailStatus: result.status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/quittances");
  revalidatePath(`/admin/quittances/${request.id}`);
  revalidatePath(`/quittance/confirmation/${request.publicToken}`);

  return {
    ok: true,
    tone: result.status === "failed" ? "warning" : "success",
    message:
      result.status === "failed"
        ? `Demande rejetée, mais l'email n'a pas pu être envoyé : ${result.error}`
        : "Demande rejetée. Le client a été informé par email.",
  };
}

export async function resendQuittanceEmail(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  const [request] = await db
    .select()
    .from(quittanceRequests)
    .where(eq(quittanceRequests.id, id))
    .limit(1);

  if (!request || request.status !== "approved" || !request.quittanceNumber) {
    return {
      ok: false,
      tone: "error",
      message: "Seule une quittance validée peut être renvoyée.",
    };
  }

  try {
    const pdf = await buildQuittancePdf(request);
    const mail = approvedEmail(request);
    const result = await sendMail({
      to: request.clientEmail,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      attachments: [
        {
          filename: pdfName(request.quittanceNumber),
          content: Buffer.from(pdf).toString("base64"),
        },
      ],
    });

    await db
      .update(quittanceRequests)
      .set({
        emailStatus: result.status,
        emailSentAt: result.status === "sent" ? new Date() : null,
        emailError: result.error ?? null,
      })
      .where(eq(quittanceRequests.id, request.id));

    await writeAudit({
      actorEmail: session.email,
      action: "quittance.email_resent",
      targetType: "quittance",
      targetId: request.id,
      metadata: { emailStatus: result.status, emailError: result.error ?? null },
    });

    revalidatePath(`/admin/quittances/${request.id}`);

    if (result.status === "failed") {
      return {
        ok: false,
        tone: "error",
        message: `Envoi impossible : ${result.error}`,
      };
    }

    return {
      ok: true,
      tone: result.status === "skipped" ? "warning" : "success",
      message:
        result.status === "skipped"
          ? "Email simulé en développement : aperçu écrit dans .emails/."
          : `Email renvoyé à ${request.clientEmail}.`,
    };
  } catch (error) {
    console.error("[quittance] renvoi impossible", error);
    return {
      ok: false,
      tone: "error",
      message: "Le renvoi a échoué. Réessayez.",
    };
  }
}

export async function markMessageHandled(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db
    .update(messages)
    .set({
      status: "handled",
      handledAt: new Date(),
      handledBy: session.email,
    })
    .where(eq(messages.id, id));

  await writeAudit({
    actorEmail: session.email,
    action: "message.handled",
    targetType: "message",
    targetId: id,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}
