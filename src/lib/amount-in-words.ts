const UNITS = [
  "zéro",
  "un",
  "deux",
  "trois",
  "quatre",
  "cinq",
  "six",
  "sept",
  "huit",
  "neuf",
  "dix",
  "onze",
  "douze",
  "treize",
  "quatorze",
  "quinze",
  "seize",
  "dix-sept",
  "dix-huit",
  "dix-neuf",
] as const;

const TENS = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante"] as const;

function below100(value: number, final: boolean): string {
  if (value < 20) return UNITS[value];

  if (value < 70) {
    const tens = Math.floor(value / 10);
    const unit = value % 10;
    if (unit === 0) return TENS[tens];
    if (unit === 1) return `${TENS[tens]} et un`;
    return `${TENS[tens]}-${UNITS[unit]}`;
  }

  if (value < 80) {
    const unit = value - 60;
    if (unit === 11) return "soixante et onze";
    return `soixante-${UNITS[unit]}`;
  }

  const unit = value - 80;
  if (unit === 0) return final ? "quatre-vingts" : "quatre-vingt";
  return `quatre-vingt-${UNITS[unit]}`;
}

function below1000(value: number, final: boolean): string {
  const hundreds = Math.floor(value / 100);
  const rest = value % 100;
  let result = "";

  if (hundreds > 0) {
    result = hundreds === 1 ? "cent" : `${UNITS[hundreds]} cent`;
    if (rest === 0 && hundreds > 1 && final) result += "s";
  }

  if (rest > 0) {
    result += `${result ? " " : ""}${below100(rest, final)}`;
  }

  return result;
}

function integerInWords(value: number): string {
  if (value === 0) return "zéro";

  const billions = Math.floor(value / 1_000_000_000);
  const millions = Math.floor((value % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((value % 1_000_000) / 1_000);
  const rest = value % 1_000;

  const parts: string[] = [];

  if (billions > 0) {
    parts.push(
      billions === 1
        ? "un milliard"
        : `${below1000(billions, false)} milliards`,
    );
  }

  if (millions > 0) {
    parts.push(
      millions === 1
        ? "un million"
        : `${below1000(millions, false)} millions`,
    );
  }

  if (thousands > 0) {
    parts.push(
      thousands === 1 ? "mille" : `${below1000(thousands, false)} mille`,
    );
  }

  if (rest > 0) {
    parts.push(below1000(rest, true));
  }

  return parts.join(" ");
}

/** Converts a positive integer amount into French words, FCFA suffix included. */
export function amountInWords(amount: number): string {
  if (!Number.isFinite(amount)) throw new Error("Montant invalide");
  const value = Math.round(amount);
  if (value < 0) throw new Error("Le montant doit être positif");
  if (value > 999_999_999_999) throw new Error("Montant trop élevé");

  const words = integerInWords(value);
  return `${words.charAt(0).toUpperCase()}${words.slice(1)} francs CFA`;
}
