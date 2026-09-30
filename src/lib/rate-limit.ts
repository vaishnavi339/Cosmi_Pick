// In-memory sliding window rate limiter
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, ip) => {
      record.timestamps = record.timestamps.filter((t) => now - t < 60000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(ip);
      }
    });
  }, 30000);
}

export function checkRateLimit(
  identifier: string,
  limit: number = 25,
  windowMs: number = 60000
): { success: boolean; remaining: number } {
  const now = Date.now();
  let record = rateLimitStore.get(identifier);

  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(identifier, record);
  }

  // Filter out timestamps outside window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    return { success: false, remaining: 0 };
  }

  record.timestamps.push(now);
  return { success: true, remaining: limit - record.timestamps.length };
}
