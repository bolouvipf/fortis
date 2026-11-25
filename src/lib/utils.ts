export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

/** Formats an integer amount with narrow French thousands separators. */
export function formatNumber(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatFcfa(value: number) {
  return `${formatNumber(value)} FCFA`;
}

/** Formats a YYYY-MM-DD string without any timezone conversion. */
export function formatDateFr(value: string | null | undefined) {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export function formatDateTimeFr(value: Date | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Porto-Novo",
  }).format(value);
}

export function statusLabel(status: string) {
  switch (status) {
    case "pending":
      return "En attente";
    case "approved":
      return "Validée";
    case "rejected":
      return "Rejetée";
    case "new":
      return "Nouveau";
    case "read":
      return "Lu";
    case "handled":
      return "Traité";
    case "sent":
      return "Envoyé";
    case "failed":
      return "Échec";
    case "skipped":
      return "Simulé (dev)";
    default:
      return status;
  }
}

/** Keeps the first letter of each name part, e.g. "Kossi ADJOVI" → "K**** A****". */
export function maskName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => (part.length <= 1 ? part : part[0] + "*".repeat(Math.min(part.length - 1, 6))))
    .join(" ");
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function truncate(value: string, length: number) {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}
