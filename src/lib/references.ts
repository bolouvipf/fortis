import { randomBytes, randomInt } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function dateStamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
}

/** Human-readable request reference, e.g. FORTIS-20261125-K7QF. */
export function generateReference(date = new Date()) {
  let suffix = "";
  for (let index = 0; index < 4; index += 1) {
    suffix += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `FORTIS-${dateStamp(date)}-${suffix}`;
}

/** Unguessable token used in public links. */
export function generatePublicToken() {
  return randomBytes(32).toString("base64url");
}

/** e.g. FORTIS-2026-0001 */
export function formatQuittanceNumber(year: number, sequence: number) {
  return `FORTIS-${year}-${String(sequence).padStart(4, "0")}`;
}

export function generateId(prefix: string) {
  return `${prefix}_${randomBytes(12).toString("base64url")}`;
}

export function referenceFromNumber(quittanceNumber: string) {
  return quittanceNumber.replace(/^FORTIS-/, "");
}
