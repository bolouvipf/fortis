type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Small in-memory limiter for the admin login form.
 * On serverless platforms it protects each instance; the database-backed
 * account remains the source of truth.
 */
export function rateLimit(
  key: string,
  options: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const limit = options.limit ?? 5;
  const windowMs = options.windowMs ?? 15 * 60_000;
  const now = Date.now();
  sweep(now);

  let bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;

  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}
