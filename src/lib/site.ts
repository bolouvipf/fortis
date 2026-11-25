export const site = {
  name: "FORTIS",
  tagline: "Bâtir. Gérer. Développer.",
  description:
    "FORTIS, société de services au Bénin : bâtiment et travaux publics, comptabilité, formation et commerce. Demandez votre quittance de formation en ligne, validée par l'administration.",
  email: "medericasarcasquenum@gmail.com",
  phone: "+2290154085128",
  phoneDisplay: "01 54 08 51 28",
} as const;

export const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/btp", label: "BTP" },
  { href: "/comptabilite", label: "Comptabilité" },
  { href: "/formation", label: "Formation" },
  { href: "/commerce", label: "Commerce" },
  { href: "/prestations", label: "Prestations" },
  { href: "/contact", label: "Contact" },
] as const;

export type ActivityIcon = "building" | "calculator" | "graduation" | "cart";

export const activities: Array<{
  href: string;
  name: string;
  fullName: string;
  description: string;
  icon: ActivityIcon;
  highlights: string[];
}> = [
  {
    href: "/btp",
    name: "BTP",
    fullName: "Bâtiment et travaux publics",
    description:
      "Études, suivi de chantier et accompagnement technique pour vos projets de construction.",
    icon: "building",
    highlights: ["Études et plans", "Suivi de chantier", "Conseil technique"],
  },
  {
    href: "/comptabilite",
    name: "Comptabilité",
    fullName: "Gestion comptable et conseil",
    description:
      "Tenue des comptes, inventaires et accompagnement budgétaire pour TPE, PME et indépendants.",
    icon: "calculator",
    highlights: ["Tenue des comptes", "Suivi des stocks", "Conseil financier"],
  },
  {
    href: "/formation",
    name: "Formation",
    fullName: "Formations pratiques",
    description:
      "Archicad, bureautique et intelligence artificielle : des compétences directement utiles.",
    icon: "graduation",
    highlights: ["Archicad", "Excel, Word, PowerPoint", "Outils d'IA"],
  },
  {
    href: "/commerce",
    name: "Commerce",
    fullName: "Importation et matériel",
    description:
      "Importation depuis la Chine et fourniture d'outils et consommables de génie civil.",
    icon: "cart",
    highlights: ["Importation", "Outils de génie civil", "Papier et instruments"],
  },
];

export const formations = [
  "Archicad",
  "Informatique : Excel, Word, PowerPoint",
  "Utilisation des intelligences artificielles",
] as const;

export const paymentMethods = [
  "Espèces",
  "Mobile Money",
  "Virement",
  "Chèque",
  "Autre",
] as const;

export interface Promoter {
  key: "donald" | "mederic";
  name: string;
  role: string;
  phones: string[];
  email: string;
  whatsapp: string;
}

export const promoters: Promoter[] = [
  {
    key: "donald",
    name: "ATTINZOVE Sènankpon Donald Christiano",
    role: "Spécialiste en BTP",
    phones: ["0164670966", "0197181613"],
    email: "donaldattinzove@gmail.com",
    whatsapp: "2290164670966",
  },
  {
    key: "mederic",
    name: "QUENUM Mederic Asarcas",
    role: "Spécialiste en comptabilité et informatique",
    phones: ["0154085128", "0140462927"],
    email: "medericasarcasquenum@gmail.com",
    whatsapp: "2290154085128",
  },
];

export const prestations = [
  "CV",
  "Lettre de motivation",
  "RCCM",
  "Acte de naissance sécurisé",
  "CIP (Certificat d'identification personnelle)",
  "Passeport",
  "IFU",
  "Casier judiciaire",
  "Certificat de résidence",
  "Autre démarche administrative",
] as const;

export function formatPhone(phone: string) {
  return phone.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}
