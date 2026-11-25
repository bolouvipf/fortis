import "server-only";

import { headers } from "next/headers";

/** Best-effort client identifier for rate limiting. */
export async function clientKey(scope: string) {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    store.get("x-real-ip") ||
    store.get("cf-connecting-ip") ||
    "local";
  return `${scope}:${ip}`;
}
