"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import {
  messages,
  quittanceRequests,
  type Message,
  type QuittanceRequest,
} from "@/lib/db/schema";
import { sendMail } from "@/lib/email";
import {
  clientAckEmail,
  contactAckEmail,
  contactAdminEmail,
  adminNotificationEmail,
} from "@/lib/email-templates";
import { getAdminEmails, writeAudit } from "@/lib/queries";
import { rateLimit } from "@/lib/rate-limit";
import { generateId, generatePublicToken, generateReference } from "@/lib/references";
import { clientKey } from "@/lib/request";
import {
  collectFieldErrors,
  contactFormSchema,
  pickValues,
  quittanceFormSchema,
  type FormState,
} from "@/lib/validation";

const QUITTANCE_FIELDS = [
  "clientName",
  "clientEmail",
  "clientPhone",
  "formation",
  "periodStart",
  "periodEnd",
  "amount",
  "paymentMethod",
  "paymentDate",
  "paymentRef",
  "notes",
];

export async function submitQuittance(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = pickValues(formData, QUITTANCE_FIELDS);
  const limited = rateLimit(await clientKey("quittance"), {
    limit: 6,
    windowMs: 60 * 60_000,
  });

  if (!limited.allowed) {
    return {
      ok: false,
      message:
        "Trop de demandes envoyées depuis cette connexion. Réessayez dans quelques minutes ou contactez l'administration.",
      values,
    };
  }

  const parsed = quittanceFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Vérifiez les informations signalées ci-dessous.",
      errors: collectFieldErrors(parsed.error.issues),
      values,
    };
  }

  const data = parsed.data;

  if (data.website) {
    return {
      ok: true,
      message: "Votre demande a bien été reçue.",
    };
  }

  const id = generateId("q");
  const reference = generateReference();
  const publicToken = generatePublicToken();

  let request: QuittanceRequest | null = null;

  try {
    const rows = await db
      .insert(quittanceRequests)
      .values({
        id,
        reference,
        publicToken,
        status: "pending",
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        formation: data.formation,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentDate: data.paymentDate,
        paymentRef: data.paymentRef ?? null,
        notes: data.notes ?? null,
        consentAt: new Date(),
      })
      .returning();
    request = rows[0] ?? null;
  } catch (error) {
    console.error("[quittance] création impossible", error);
    return {
      ok: false,
      message:
        "La demande n'a pas pu être enregistrée. Réessayez dans un instant ou contactez l'administration.",
      values,
    };
  }

  if (!request) {
    return {
      ok: false,
      message:
        "La demande n'a pas pu être enregistrée. Réessayez dans un instant.",
      values,
    };
  }

  // Emails must never block the request itself. Failures stay visible in the
  // admin space and can be retried there.
  const ack = clientAckEmail(request);
  await sendMail({
    to: request.clientEmail,
    subject: ack.subject,
    html: ack.html,
    text: ack.text,
  });

  try {
    const admins = await getAdminEmails();
    if (admins.length > 0) {
      const notification = adminNotificationEmail(request);
      await sendMail({
        to: admins,
        subject: notification.subject,
        html: notification.html,
        text: notification.text,
        replyTo: request.clientEmail,
      });
    }
  } catch (error) {
    console.error("[quittance] notification admin impossible", error);
  }

  await writeAudit({
    actorEmail: request.clientEmail,
    action: "quittance.requested",
    targetType: "quittance",
    targetId: request.id,
    metadata: { reference: request.reference, amount: request.amount },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/quittances");

  redirect(`/quittance/confirmation/${publicToken}`);
}

export async function submitMessage(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = pickValues(formData, [
    "name",
    "email",
    "phone",
    "subject",
    "message",
    "type",
  ]);

  const limited = rateLimit(await clientKey("message"), {
    limit: 5,
    windowMs: 15 * 60_000,
  });

  if (!limited.allowed) {
    return {
      ok: false,
      message:
        "Trop de messages envoyés depuis cette connexion. Réessayez dans quelques minutes.",
      values,
    };
  }

  const parsed = contactFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Vérifiez les informations signalées ci-dessous.",
      errors: collectFieldErrors(parsed.error.issues),
      values,
    };
  }

  const data = parsed.data;

  if (data.website) {
    return { ok: true, message: "Votre message a bien été reçu." };
  }

  const id = generateId("msg");
  const reference = generateReference();

  let message: Message | null = null;

  try {
    const rows = await db
      .insert(messages)
      .values({
        id,
        reference,
        type: data.type,
        name: data.name,
        email: data.email ?? null,
        phone: data.phone ?? null,
        subject: data.subject,
        body: data.message,
        status: "new",
      })
      .returning();
    message = rows[0] ?? null;
  } catch (error) {
    console.error("[message] enregistrement impossible", error);
    return {
      ok: false,
      message:
        "Votre message n'a pas pu être enregistré. Réessayez ou appelez directement l'administration.",
      values,
    };
  }

  if (!message) {
    return {
      ok: false,
      message: "Votre message n'a pas pu être enregistré. Réessayez.",
      values,
    };
  }

  if (message.email) {
    const ack = contactAckEmail(message);
    await sendMail({
      to: message.email,
      subject: ack.subject,
      html: ack.html,
      text: ack.text,
    });
  }

  try {
    const admins = await getAdminEmails();
    if (admins.length > 0) {
      const notification = contactAdminEmail(message);
      await sendMail({
        to: admins,
        subject: notification.subject,
        html: notification.html,
        text: notification.text,
        ...(message.email ? { replyTo: message.email } : {}),
      });
    }
  } catch (error) {
    console.error("[message] notification admin impossible", error);
  }

  await writeAudit({
    actorEmail: message.email ?? message.phone ?? "anonyme",
    action: "message.received",
    targetType: "message",
    targetId: message.id,
    metadata: { reference: message.reference, type: message.type },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/messages");

  return {
    ok: true,
    message: `Votre message a bien été enregistré sous la référence ${reference}. L'administration vous répondra dès que possible.`,
  };
}
