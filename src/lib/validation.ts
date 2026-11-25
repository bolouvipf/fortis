import { z } from "zod";

import { formations, paymentMethods } from "./site";

export type FormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
};

export const initialFormState: FormState = { ok: false };

export function collectFieldErrors(
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>,
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "_form";
    result[key] ??= [];
    result[key].push(issue.message);
  }
  return result;
}

export function pickValues(formData: FormData, keys: string[]) {
  const values: Record<string, string> = {};
  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === "string") values[key] = value;
  }
  return values;
}

const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choisissez une date valide.");

const phone = z
  .string()
  .trim()
  .min(6, "Indiquez un numéro joignable.")
  .max(30, "Numéro trop long.")
  .regex(/^[+0-9 ().-]+$/, "Numéro de téléphone invalide.");

const email = z
  .string()
  .trim()
  .min(1, "Indiquez votre adresse email.")
  .max(160, "Adresse email trop longue.")
  .email("Adresse email invalide.");

export const quittanceFormSchema = z
  .object({
    clientName: z
      .string()
      .trim()
      .min(2, "Indiquez votre nom et prénom, ou votre raison sociale.")
      .max(160, "Nom trop long."),
    clientEmail: email,
    clientPhone: phone,
    formation: z
      .string()
      .trim()
      .min(2, "Indiquez l'intitulé de la formation.")
      .max(160, "Intitulé trop long."),
    periodStart: isoDate,
    periodEnd: isoDate,
    amount: z
      .string()
      .trim()
      .min(1, "Indiquez le montant payé.")
      .transform((value) => Number(value.replace(/[\s.]/g, "")))
      .pipe(
        z
          .number()
          .int("Le montant doit être un nombre entier.")
          .min(1000, "Le montant doit être supérieur à 1 000 FCFA.")
          .max(100_000_000, "Montant trop élevé."),
      ),
    paymentMethod: z.enum(paymentMethods, "Choisissez un mode de paiement."),
    paymentDate: isoDate,
    paymentRef: z
      .string()
      .trim()
      .max(120, "Référence trop longue.")
      .optional()
      .transform((value) => value || undefined),
    notes: z
      .string()
      .trim()
      .max(1000, "Message trop long (1 000 caractères maximum).")
      .optional()
      .transform((value) => value || undefined),
    consent: z.string().optional().refine((value) => value === "on" || value === "true", {
      message: "Vous devez accepter le traitement de vos données.",
    }),
    website: z.string().max(0, "Requête invalide.").optional(),
  })
  .superRefine((data, context) => {
    if (data.periodEnd < data.periodStart) {
      context.addIssue({
        code: "custom",
        path: ["periodEnd"],
        message: "La fin de formation précède le début.",
      });
    }

    const start = new Date(`${data.periodStart}T00:00:00Z`);
    const min = new Date("2000-01-01T00:00:00Z");
    const max = new Date();
    max.setUTCFullYear(max.getUTCFullYear() + 1);

    if (Number.isNaN(start.getTime()) || start < min || start > max) {
      context.addIssue({
        code: "custom",
        path: ["periodStart"],
        message: "Date de début invalide.",
      });
    }

    if (data.paymentDate > new Date().toISOString().slice(0, 10)) {
      context.addIssue({
        code: "custom",
        path: ["paymentDate"],
        message: "La date de paiement ne peut pas être dans le futur.",
      });
    }
  });

export type QuittanceFormInput = z.infer<typeof quittanceFormSchema>;

export const contactFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Indiquez votre nom.")
      .max(120, "Nom trop long."),
    email: z
      .string()
      .trim()
      .max(160, "Adresse email trop longue.")
      .optional()
      .transform((value) => value || undefined)
      .refine(
        (value) => value === undefined || z.string().email().safeParse(value).success,
        "Adresse email invalide.",
      ),
    phone: z
      .string()
      .trim()
      .max(30, "Numéro trop long.")
      .optional()
      .transform((value) => value || undefined),
    subject: z
      .string()
      .trim()
      .min(2, "Choisissez un sujet.")
      .max(160, "Sujet trop long."),
    message: z
      .string()
      .trim()
      .min(10, "Votre message doit contenir au moins 10 caractères.")
      .max(2000, "Message trop long (2 000 caractères maximum)."),
    type: z.enum(["contact", "prestation"]).default("contact"),
    website: z.string().max(0, "Requête invalide.").optional(),
  })
  .superRefine((data, context) => {
    if (!data.email && !data.phone) {
      context.addIssue({
        code: "custom",
        path: ["email"],
        message: "Laissez un email ou un numéro de téléphone pour la réponse.",
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email requis.").email("Email invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});

export const rejectionSchema = z.object({
  id: z.string().min(1),
  reason: z
    .string()
    .trim()
    .min(5, "Précisez le motif du rejet (5 caractères minimum).")
    .max(1000, "Motif trop long."),
});

export const formationOptions = formations;
