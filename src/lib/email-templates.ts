import "server-only";

import type { Message, QuittanceRequest } from "@/lib/db/schema";
import { amountInWords } from "@/lib/amount-in-words";
import { absoluteUrl, getSiteUrl } from "@/lib/urls";
import { formatDateFr, formatFcfa } from "@/lib/utils";

const GREEN = "#0f4d3f";
const ORANGE = "#d2691e";
const INK = "#14231d";
const MUTED = "#5c6f66";
const PAPER = "#f7f5ef";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface LayoutOptions {
  title: string;
  preheader: string;
  content: string;
}

function layout({ title, preheader, content }: LayoutOptions) {
  const url = getSiteUrl();

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:${INK};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e0d7;border-radius:14px;overflow:hidden;">
      <tr>
        <td style="background:${GREEN};padding:20px 28px;">
          <table role="presentation" width="100%"><tr>
            <td style="vertical-align:middle;">
              <img src="${url}/logo.jpg" width="44" height="44" alt="FORTIS" style="border-radius:9px;background:#fff;display:block;">
            </td>
            <td style="text-align:right;vertical-align:middle;color:#ffffff;font-size:13px;letter-spacing:.14em;text-transform:uppercase;">
              Bâtir · Gérer · Développer
            </td>
          </tr></table>
        </td>
      </tr>
      <tr><td style="height:4px;background:${ORANGE};"></td></tr>
      <tr><td style="padding:32px 28px 24px;">${content}</td></tr>
      <tr>
        <td style="padding:20px 28px 28px;border-top:1px solid #e8e5db;color:${MUTED};font-size:12px;line-height:1.6;">
          <p style="margin:0 0 6px;"><strong style="color:${GREEN};">FORTIS</strong> — BTP · Comptabilité · Formation · Commerce</p>
          <p style="margin:0;">Cet email vous est envoyé dans le cadre de votre demande. Pour toute question, répondez directement à ce message ou écrivez à <a href="${url}/contact" style="color:${GREEN};">l'administration</a>.</p>
        </td>
      </tr>
    </table>
    <p style="max-width:600px;margin:14px auto 0;color:#8a9791;font-size:11px;text-align:center;">© ${new Date().getFullYear()} FORTIS · ${escapeHtml(url)}</p>
  </td></tr>
</table>
</body>
</html>`;
}

function heading(title: string, subtitle?: string) {
  return `<h1 style="margin:0 0 8px;font-size:23px;line-height:1.25;color:${GREEN};font-weight:800;">${escapeHtml(title)}</h1>
${subtitle ? `<p style="margin:0 0 22px;color:${MUTED};font-size:15px;line-height:1.6;">${escapeHtml(subtitle)}</p>` : ""}`;
}

function button(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:${GREEN};color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 22px;border-radius:9px;">${escapeHtml(label)}</a>`;
}

function details(rows: Array<[string, string]>) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0;border:1px solid #e2e0d7;border-radius:10px;overflow:hidden;">
    ${rows
      .map(
        ([label, value], index) => `<tr style="background:${index % 2 === 0 ? "#fbfaf6" : "#ffffff"};">
          <td style="padding:11px 14px;font-size:13px;color:${MUTED};width:42%;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:11px 14px;font-size:14px;color:${INK};font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>
        </tr>`,
      )
      .join("")}
  </table>`;
}

function requestRows(request: QuittanceRequest) {
  return [
    ["Référence", request.reference],
    ["Formation", request.formation],
    ["Période", `du ${formatDateFr(request.periodStart)} au ${formatDateFr(request.periodEnd)}`],
    ["Montant", formatFcfa(request.amount)],
    ["Mode de paiement", request.paymentMethod],
    ["Date du paiement", formatDateFr(request.paymentDate)],
    ...(request.paymentRef ? [["Référence du paiement", request.paymentRef] as [string, string]] : []),
  ] as Array<[string, string]>;
}

export function clientAckEmail(request: QuittanceRequest) {
  const subject = `Demande de quittance reçue — ${request.reference}`;
  const content = `
    ${heading("Votre demande est bien reçue", "Merci de votre confiance. L'administration FORTIS vérifie maintenant les informations et le paiement avant d'établir votre quittance.")}
    <p style="margin:0 0 4px;font-size:15px;line-height:1.7;">Bonjour <strong>${escapeHtml(request.clientName)}</strong>,</p>
    <p style="margin:0 0 4px;font-size:15px;line-height:1.7;">Votre demande a été enregistrée sous la référence <strong>${escapeHtml(request.reference)}</strong>.</p>
    ${details(requestRows(request))}
    <div style="background:#fdf4ec;border-left:4px solid ${ORANGE};padding:14px 16px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0;font-size:14px;line-height:1.6;color:${INK};"><strong>Prochaine étape :</strong> après validation, votre quittance au format PDF sera envoyée à cette adresse email. Aucun document n'est valable avant cette validation.</p>
    </div>
    <p style="margin:22px 0 0;">${button("Suivre ma demande", absoluteUrl(`/quittance/confirmation/${request.publicToken}`))}</p>
    <p style="margin:18px 0 0;font-size:13px;color:${MUTED};line-height:1.6;">Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
  `;

  return {
    subject,
    html: layout({
      title: subject,
      preheader: `Demande ${request.reference} reçue — validation en cours.`,
      content,
    }),
    text: `Bonjour ${request.clientName},\n\nVotre demande de quittance a bien été reçue (référence ${request.reference}).\n\nFormation : ${request.formation}\nPériode : du ${formatDateFr(request.periodStart)} au ${formatDateFr(request.periodEnd)}\nMontant : ${formatFcfa(request.amount)}\n\nAprès validation par l'administration, votre quittance PDF sera envoyée à cette adresse.\n\nSuivi : ${absoluteUrl(`/quittance/confirmation/${request.publicToken}`)}\n\nFORTIS`,
  };
}

export function adminNotificationEmail(request: QuittanceRequest) {
  const subject = `[FORTIS] Nouvelle demande de quittance — ${request.clientName}`;
  const content = `
    ${heading("Nouvelle demande à vérifier", `Référence ${request.reference}`)}
    ${details([
      ["Client", request.clientName],
      ["Email", request.clientEmail],
      ["Téléphone", request.clientPhone],
      ...requestRows(request),
      ...(request.notes ? [["Note du client", request.notes] as [string, string]] : []),
    ])}
    <p style="margin:22px 0 0;">${button("Ouvrir dans l'espace admin", absoluteUrl(`/admin/quittances/${request.id}`))}</p>
    <p style="margin:16px 0 0;font-size:13px;color:${MUTED};">La quittance ne doit être validée qu'après vérification du paiement.</p>
  `;

  return {
    subject,
    html: layout({
      title: subject,
      preheader: `${request.clientName} — ${formatFcfa(request.amount)} — ${request.formation}`,
      content,
    }),
    text: `Nouvelle demande de quittance\n\nRéférence : ${request.reference}\nClient : ${request.clientName}\nEmail : ${request.clientEmail}\nTéléphone : ${request.clientPhone}\nFormation : ${request.formation}\nMontant : ${formatFcfa(request.amount)}\n\nÀ vérifier : ${absoluteUrl(`/admin/quittances/${request.id}`)}`,
  };
}

export function approvedEmail(request: QuittanceRequest) {
  const number = request.quittanceNumber ?? request.reference;
  const subject = `Votre quittance ${number} est disponible`;
  const content = `
    ${heading("Votre quittance est validée", "Le document officiel est joint à cet email. Il est également consultable en ligne.")}
    <p style="margin:0 0 4px;font-size:15px;line-height:1.7;">Bonjour <strong>${escapeHtml(request.clientName)}</strong>,</p>
    <p style="margin:0 0 4px;font-size:15px;line-height:1.7;">Votre quittance a été vérifiée et validée par la direction de FORTIS.</p>
    ${details([
      ["N° de quittance", number],
      ["Formation", request.formation],
      ["Période", `du ${formatDateFr(request.periodStart)} au ${formatDateFr(request.periodEnd)}`],
      ["Montant réglé", formatFcfa(request.amount)],
      ["Montant en lettres", amountInWords(request.amount)],
      ["Mode de paiement", request.paymentMethod],
    ])}
    <p style="margin:22px 0 0;">${button("Consulter et télécharger", absoluteUrl(`/q/${request.publicToken}`))}</p>
    <p style="margin:16px 0 0;font-size:13px;color:${MUTED};line-height:1.6;">Vous pouvez vérifier l'authenticité de ce document à tout moment depuis <a href="${absoluteUrl("/verifier")}" style="color:${GREEN};">la page de vérification</a>, avec le numéro <strong>${escapeHtml(number)}</strong>.</p>
  `;

  return {
    subject,
    html: layout({
      title: subject,
      preheader: `Quittance ${number} — ${formatFcfa(request.amount)}`,
      content,
    }),
    text: `Bonjour ${request.clientName},\n\nVotre quittance ${number} est validée.\n\nFormation : ${request.formation}\nPériode : du ${formatDateFr(request.periodStart)} au ${formatDateFr(request.periodEnd)}\nMontant : ${formatFcfa(request.amount)}\n\nLe PDF est joint à cet email. Consultation en ligne : ${absoluteUrl(`/q/${request.publicToken}`)}\n\nVérification : ${absoluteUrl("/verifier")}\n\nFORTIS`,
  };
}

export function rejectedEmail(request: QuittanceRequest) {
  const subject = `Demande de quittance ${request.reference} — précision nécessaire`;
  const content = `
    ${heading("Votre demande nécessite une correction", "L'administration n'a pas pu valider la demande en l'état.")}
    <p style="margin:0 0 4px;font-size:15px;line-height:1.7;">Bonjour <strong>${escapeHtml(request.clientName)}</strong>,</p>
    <div style="background:#fdf1ef;border-left:4px solid #b3402f;padding:14px 16px;border-radius:0 8px 8px 0;margin:18px 0;">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8d2e21;font-weight:700;">Motif</p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:${INK};">${escapeHtml(request.rejectionReason ?? "Informations incomplètes.")}</p>
    </div>
    <p style="margin:0 0 4px;font-size:15px;line-height:1.7;">Vous pouvez corriger les informations et soumettre une nouvelle demande.</p>
    <p style="margin:22px 0 0;">${button("Nouvelle demande", absoluteUrl("/quittance"))}</p>
    <p style="margin:16px 0 0;font-size:13px;color:${MUTED};line-height:1.6;">Référence concernée : ${escapeHtml(request.reference)}</p>
  `;

  return {
    subject,
    html: layout({
      title: subject,
      preheader: request.rejectionReason ?? "Informations à corriger.",
      content,
    }),
    text: `Bonjour ${request.clientName},\n\nVotre demande ${request.reference} n'a pas pu être validée.\n\nMotif : ${request.rejectionReason ?? "Informations incomplètes."}\n\nVous pouvez soumettre une nouvelle demande : ${absoluteUrl("/quittance")}\n\nFORTIS`,
  };
}

export function contactAckEmail(message: Message) {
  const subject = `Nous avons reçu votre message — ${message.reference}`;
  const label = message.type === "prestation" ? "Demande de prestation" : "Message";
  const content = `
    ${heading("Message bien reçu", "L'administration FORTIS vous répondra dès que possible.")}
    <p style="margin:0 0 4px;font-size:15px;line-height:1.7;">Bonjour <strong>${escapeHtml(message.name)}</strong>,</p>
    <p style="margin:0 0 4px;font-size:15px;line-height:1.7;">Votre ${label.toLowerCase()} a été enregistrée sous la référence <strong>${escapeHtml(message.reference)}</strong>.</p>
    ${details([
      ["Sujet", message.subject],
      ["Votre message", message.body],
    ])}
    <p style="margin:22px 0 0;font-size:13px;color:${MUTED};">Une réponse vous sera apportée par email ou par téléphone.</p>
  `;

  return {
    subject,
    html: layout({
      title: subject,
      preheader: `Référence ${message.reference}`,
      content,
    }),
    text: `Bonjour ${message.name},\n\nVotre message a été reçu (référence ${message.reference}).\n\nSujet : ${message.subject}\n\n${message.body}\n\nFORTIS`,
  };
}

export function contactAdminEmail(message: Message) {
  const subject = `[FORTIS] ${message.type === "prestation" ? "Demande de prestation" : "Nouveau message"} — ${message.name}`;
  const content = `
    ${heading("Nouveau message", `Référence ${message.reference}`)}
    ${details([
      ["Type", message.type === "prestation" ? "Prestation" : "Contact"],
      ["Nom", message.name],
      ["Email", message.email ?? "—"],
      ["Téléphone", message.phone ?? "—"],
      ["Sujet", message.subject],
      ["Message", message.body],
    ])}
    <p style="margin:22px 0 0;">${button("Ouvrir dans l'espace admin", absoluteUrl("/admin/messages"))}</p>
  `;

  return {
    subject,
    html: layout({
      title: subject,
      preheader: message.subject,
      content,
    }),
    text: `Nouveau message\n\nRéférence : ${message.reference}\nType : ${message.type}\nNom : ${message.name}\nEmail : ${message.email ?? "—"}\nTéléphone : ${message.phone ?? "—"}\nSujet : ${message.subject}\n\n${message.body}\n\n${absoluteUrl("/admin/messages")}`,
  };
}
