/**
 * In-memory rate limiter using token bucket algorithm
 * Falls back to this when Redis is not available
 */

export interface RateLimitOptions {
  identifier: string;
  type: string;
  limit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
  windowMs: number;
}

// In-memory rate limit store
const rateLimitStore = new Map<string, RateLimitBucket>();

/**
 * Check rate limit using token bucket algorithm
 */
export function checkRateLimitMemory(options: RateLimitOptions): RateLimitResult {
  const { identifier, type, limit, windowSeconds } = options;
  const key = `rate:${type}:${identifier}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let bucket = rateLimitStore.get(key);

  // Initialize or refill bucket
  if (!bucket) {
    bucket = {
      tokens: limit,
      lastRefill: now,
      windowMs,
    };
  } else {
    // Refill tokens based on elapsed time
    const elapsed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor((elapsed / windowMs) * limit);
    
    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(limit, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }
  }

  // Check if request is allowed
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    rateLimitStore.set(key, bucket);
    
    return {
      allowed: true,
      remaining: bucket.tokens,
      resetAt: new Date(now + windowMs),
    };
  }

  // Rate limit exceeded
  return {
    allowed: false,
    remaining: 0,
    resetAt: new Date(bucket.lastRefill + windowMs),
  };
}

/**
 * Cleanup expired rate limit entries (call periodically)
 */
export function cleanupExpiredRateLimits(): void {
  const now = Date.now();
  for (const [key, bucket] of rateLimitStore.entries()) {
    const expired = now - bucket.lastRefill > bucket.windowMs * 2;
    if (expired && bucket.tokens >= bucket.limit) {
      rateLimitStore.delete(key);
    }
  }
}

