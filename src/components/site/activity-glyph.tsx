import {
  Building2,
  Calculator,
  GraduationCap,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

import type { ActivityIcon as ActivityIconName } from "@/lib/site";

const glyphs: Record<ActivityIconName, LucideIcon> = {
  building: Building2,
  calculator: Calculator,
  graduation: GraduationCap,
  cart: ShoppingCart,
};

export function ActivityGlyph({
  name,
  size = 22,
}: {
  name: ActivityIconName;
  size?: number;
}) {
  const Icon = glyphs[name];
  return <Icon size={size} strokeWidth={1.7} aria-hidden="true" />;
}
