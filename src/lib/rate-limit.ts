// In-memory rate limiter for anonymous vents
// 1 vent per 5 minutes, max 10 per day per IP

const ventTimestamps = new Map<string, number[]>();

const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_PER_WINDOW = 1;
const DAILY_LIMIT = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterMs?: number;
} {
  const now = Date.now();
  const timestamps = ventTimestamps.get(ip) || [];

  // Clean entries older than 24h
  const recent = timestamps.filter((t) => now - t < DAY_MS);

  // Check daily limit
  if (recent.length >= DAILY_LIMIT) {
    return { allowed: false, retryAfterMs: DAY_MS - (now - recent[0]) };
  }

  // Check 5-minute window
  const inWindow = recent.filter((t) => now - t < WINDOW_MS);
  if (inWindow.length >= MAX_PER_WINDOW) {
    const oldest = inWindow[0];
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - oldest) };
  }

  recent.push(now);
  ventTimestamps.set(ip, recent);
  return { allowed: true };
}
