import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export interface MailAttachment {
  filename: string;
  /** Base64 encoded content. */
  content: string;
}

export interface MailInput {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  attachments?: MailAttachment[];
  replyTo?: string;
}

export type MailResult = {
  status: "sent" | "failed" | "skipped";
  id?: string;
  error?: string;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)
    .toLowerCase();
}

async function savePreview(input: MailInput): Promise<void> {
  if (process.env.NODE_ENV === "production") return;

  try {
    const directory = path.join(process.cwd(), ".emails");
    await mkdir(directory, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const recipients = Array.isArray(input.to) ? input.to : [input.to];
    const base = `${stamp}-${slugify(input.subject)}`;
    await writeFile(path.join(directory, `${base}.html`), input.html, "utf8");
    await writeFile(
      path.join(directory, `${base}.json`),
      JSON.stringify(
        {
          to: recipients,
          subject: input.subject,
          text: input.text,
          attachments: input.attachments?.map((item) => item.filename) ?? [],
        },
        null,
        2,
      ),
      "utf8",
    );
    console.info(`[email] aperçu enregistré : .emails/${base}.html`);
  } catch (error) {
    console.warn("[email] impossible d'enregistrer l'aperçu", error);
  }
}

/**
 * Sends an email through Resend.
 * Without RESEND_API_KEY, development saves a preview in .emails/ so the
 * whole flow stays testable. Production reports a clear failure instead of
 * silently pretending the message was sent.
 */
export async function sendMail(input: MailInput): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "FORTIS <onboarding@resend.dev>";

  await savePreview(input);

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      return {
        status: "failed",
        error:
          "Service email non configuré : ajoutez RESEND_API_KEY et MAIL_FROM dans les variables d'environnement.",
      };
    }

    return {
      status: "skipped",
      error: "RESEND_API_KEY absente — email simulé dans .emails/.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
        ...(input.attachments?.length
          ? { attachments: input.attachments }
          : {}),
      }),
      signal: AbortSignal.timeout(15_000),
    });

    const payload = (await response.json().catch(() => null)) as
      | { id?: string; message?: string }
      | null;

    if (!response.ok) {
      return {
        status: "failed",
        error:
          payload?.message ??
          `Le service email a répondu ${response.status}.`,
      };
    }

    return { status: "sent", id: payload?.id };
  } catch (error) {
    return {
      status: "failed",
      error:
        error instanceof Error
          ? `Envoi impossible : ${error.message}`
          : "Envoi impossible.",
    };
  }
}
