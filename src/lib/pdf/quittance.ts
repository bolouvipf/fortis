import "server-only";

import QRCode from "qrcode";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

import type { QuittanceRequest } from "@/lib/db/schema";
import { amountInWords } from "@/lib/amount-in-words";
import { absoluteUrl } from "@/lib/urls";
import { formatDateFr, formatFcfa, formatDateTimeFr } from "@/lib/utils";

import { CACHET_PNG_BASE64, LOGO_JPG_BASE64 } from "./assets";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;

const GREEN = rgb(15 / 255, 77 / 255, 63 / 255);
const GREEN_DARK = rgb(10 / 255, 55 / 255, 45 / 255);
const ORANGE = rgb(210 / 255, 105 / 255, 30 / 255);
const INK = rgb(20 / 255, 35 / 255, 29 / 255);
const MUTED = rgb(92 / 255, 111 / 255, 102 / 255);
const LINE = rgb(222 / 255, 224 / 255, 215 / 255);
const SOFT = rgb(247 / 255, 245 / 255, 239 / 255);

function sanitize(text: string) {
  return text
    .replace(/[\u2018\u2019\u201B]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u00A0\u202F]/g, " ")
    .replace(/\u2026/g, "...");
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = sanitize(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

function drawRight(
  page: PDFPage,
  text: string,
  font: PDFFont,
  size: number,
  y: number,
  color = INK,
) {
  const value = sanitize(text);
  page.drawText(value, {
    x: PAGE_WIDTH - MARGIN - font.widthOfTextAtSize(value, size),
    y,
    size,
    font,
    color,
  });
}

export async function buildQuittancePdf(request: QuittanceRequest) {
  const document = await PDFDocument.create();
  const page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const logo = await document.embedJpg(Buffer.from(LOGO_JPG_BASE64, "base64"));
  const cachet = await document.embedPng(
    Buffer.from(CACHET_PNG_BASE64, "base64"),
  );

  const verifyUrl = absoluteUrl(`/q/${request.publicToken}`);
  const qrPng = await QRCode.toBuffer(verifyUrl, {
    type: "png",
    margin: 1,
    width: 320,
    color: { dark: "#0f4d3f", light: "#ffffff" },
  });
  const qr = await document.embedPng(qrPng);

  const number = request.quittanceNumber ?? request.reference;
  const issuedAt = request.reviewedAt ?? request.createdAt;

  // Header band
  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 128,
    width: PAGE_WIDTH,
    height: 128,
    color: GREEN,
  });
  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 134,
    width: PAGE_WIDTH,
    height: 6,
    color: ORANGE,
  });

  page.drawRectangle({
    x: MARGIN,
    y: PAGE_HEIGHT - 106,
    width: 58,
    height: 58,
    color: rgb(1, 1, 1),
  });
  page.drawImage(logo, {
    x: MARGIN + 3,
    y: PAGE_HEIGHT - 103,
    width: 52,
    height: 52,
  });

  page.drawText("FORTIS", {
    x: MARGIN + 72,
    y: PAGE_HEIGHT - 62,
    size: 18,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("Batir. Gerer. Developper.", {
    x: MARGIN + 72,
    y: PAGE_HEIGHT - 79,
    size: 8.5,
    font: regular,
    color: rgb(0.86, 0.94, 0.9),
  });

  drawRight(page, "QUITTANCE DE FORMATION", bold, 17, PAGE_HEIGHT - 58, rgb(1, 1, 1));
  drawRight(page, `N° ${number}`, regular, 10, PAGE_HEIGHT - 76, rgb(0.86, 0.94, 0.9));
  drawRight(
    page,
    `Delivree le ${formatDateFr(`${issuedAt.getFullYear()}-${String(issuedAt.getMonth() + 1).padStart(2, "0")}-${String(issuedAt.getDate()).padStart(2, "0")}`)}`,
    regular,
    9,
    PAGE_HEIGHT - 92,
    rgb(0.86, 0.94, 0.9),
  );

  let y = PAGE_HEIGHT - 176;

  const sectionTitle = (label: string) => {
    page.drawText(sanitize(label), {
      x: MARGIN,
      y,
      size: 9,
      font: bold,
      color: GREEN,
    });
    page.drawLine({
      start: { x: MARGIN, y: y - 6 },
      end: { x: PAGE_WIDTH - MARGIN, y: y - 6 },
      thickness: 0.7,
      color: LINE,
    });
    y -= 24;
  };

  const row = (label: string, value: string, options: { strong?: boolean } = {}) => {
    const size = options.strong ? 11 : 10;
    const font = options.strong ? bold : regular;
    page.drawText(sanitize(label), {
      x: MARGIN,
      y,
      size: 9,
      font: regular,
      color: MUTED,
    });
    const lines = wrap(value, font, size, 330);
    lines.forEach((line, index) => {
      page.drawText(line, {
        x: PAGE_WIDTH - MARGIN - font.widthOfTextAtSize(line, size),
        y: y - index * 14,
        size,
        font,
        color: INK,
      });
    });
    y -= 18 + (lines.length - 1) * 14;
  };

  sectionTitle("BENEFICIAIRE");
  row("Nom / raison sociale", request.clientName, { strong: true });
  row("Email", request.clientEmail);
  row("Telephone", request.clientPhone);

  y -= 10;
  sectionTitle("PRESTATION");
  row("Formation suivie", request.formation, { strong: true });
  row(
    "Periode",
    `du ${formatDateFr(request.periodStart)} au ${formatDateFr(request.periodEnd)}`,
  );

  // Amount highlight
  y -= 6;
  page.drawRectangle({
    x: MARGIN,
    y: y - 74,
    width: PAGE_WIDTH - MARGIN * 2,
    height: 78,
    color: SOFT,
    borderColor: LINE,
    borderWidth: 0.7,
  });
  page.drawText("MONTANT REGLE", {
    x: MARGIN + 16,
    y: y - 22,
    size: 8.5,
    font: bold,
    color: GREEN,
  });
  page.drawText(sanitize(formatFcfa(request.amount)), {
    x: MARGIN + 16,
    y: y - 50,
    size: 22,
    font: bold,
    color: INK,
  });
  const words = wrap(
    `Soit ${amountInWords(request.amount)}`,
    regular,
    8.5,
    PAGE_WIDTH - MARGIN * 2 - 32,
  );
  words.slice(0, 2).forEach((line, index) => {
    page.drawText(line, {
      x: MARGIN + 16,
      y: y - 66 - index * 10,
      size: 8.5,
      font: regular,
      color: MUTED,
    });
  });
  y -= 104;

  sectionTitle("REGLEMENT");
  row("Mode de paiement", request.paymentMethod);
  row("Date du paiement", formatDateFr(request.paymentDate));
  if (request.paymentRef) row("Reference du paiement", request.paymentRef);

  // Signature block
  const signatureTop = Math.min(y - 26, 628);
  page.drawRectangle({
    x: PAGE_WIDTH - MARGIN - 210,
    y: signatureTop - 138,
    width: 210,
    height: 138,
    borderColor: LINE,
    borderWidth: 0.8,
  });
  page.drawText("POUR LA DIRECTION DE FORTIS", {
    x: PAGE_WIDTH - MARGIN - 194,
    y: signatureTop - 18,
    size: 8,
    font: bold,
    color: GREEN,
  });
  page.drawText("Signature et cachet", {
    x: PAGE_WIDTH - MARGIN - 194,
    y: signatureTop - 30,
    size: 7.5,
    font: regular,
    color: MUTED,
  });
  page.drawImage(cachet, {
    x: PAGE_WIDTH - MARGIN - 194,
    y: signatureTop - 122,
    width: 78,
    height: 78,
    opacity: 0.92,
  });
  page.drawText(sanitize(`Etablie le ${formatDateTimeFr(issuedAt)}`), {
    x: PAGE_WIDTH - MARGIN - 194,
    y: signatureTop - 132,
    size: 6.8,
    font: regular,
    color: MUTED,
  });

  // QR + legal notice
  page.drawImage(qr, {
    x: MARGIN,
    y: 92,
    width: 62,
    height: 62,
  });
  page.drawText("VERIFIER CE DOCUMENT", {
    x: MARGIN + 76,
    y: 140,
    size: 8,
    font: bold,
    color: GREEN,
  });
  page.drawText("Scannez le QR code ou rendez-vous sur", {
    x: MARGIN + 76,
    y: 128,
    size: 7.5,
    font: regular,
    color: MUTED,
  });
  page.drawText("/verifier", {
    x: MARGIN + 76,
    y: 116,
    size: 7.5,
    font: bold,
    color: INK,
  });
  page.drawText(sanitize(`Numero a saisir : ${number}`), {
    x: MARGIN + 76,
    y: 104,
    size: 7.5,
    font: regular,
    color: MUTED,
  });

  page.drawLine({
    start: { x: MARGIN, y: 78 },
    end: { x: PAGE_WIDTH - MARGIN, y: 78 },
    thickness: 0.7,
    color: LINE,
  });
  const legal =
    "Cette quittance atteste uniquement du reglement indique ci-dessus. Document genere electroniquement apres validation par l'administration FORTIS.";
  wrap(legal, regular, 6.8, PAGE_WIDTH - MARGIN * 2).forEach((line, index) => {
    page.drawText(line, {
      x: MARGIN,
      y: 64 - index * 9,
      size: 6.8,
      font: regular,
      color: MUTED,
    });
  });
  drawRight(page, `Reference interne : ${request.reference}`, regular, 6.8, 64, MUTED);
  drawRight(page, "Page 1/1", regular, 6.8, 64 - 9, MUTED);

  // Outer frame
  page.drawRectangle({
    x: 24,
    y: 24,
    width: PAGE_WIDTH - 48,
    height: PAGE_HEIGHT - 48,
    borderColor: GREEN,
    borderWidth: 1,
  });

  document.setTitle(`Quittance ${number} - FORTIS`);
  document.setAuthor("FORTIS");
  document.setSubject(`Quittance de formation - ${request.clientName}`);
  document.setCreator("FORTIS");
  document.setProducer("FORTIS");
  document.setCreationDate(issuedAt);
  document.setModificationDate(new Date());

  return document.save();
}
