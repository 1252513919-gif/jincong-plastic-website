type LoginAttempt = {
  count: number;
  firstAttemptAt: number;
  blockedUntil?: number;
};

const attempts = new Map<string, LoginAttempt>();
const windowMs = 10 * 60 * 1000;
const blockMs = 15 * 60 * 1000;
const maxAttempts = 5;

export function checkLoginRateLimit(key: string, now = Date.now()) {
  const attempt = attempts.get(key);
  if (!attempt) return { ok: true };
  if (attempt.blockedUntil && attempt.blockedUntil > now) {
    return { ok: false, retryAfterSeconds: Math.ceil((attempt.blockedUntil - now) / 1000) };
  }
  if (now - attempt.firstAttemptAt > windowMs) {
    attempts.delete(key);
    return { ok: true };
  }
  return { ok: true };
}

export function recordFailedLogin(key: string, now = Date.now()) {
  const current = attempts.get(key);
  const attempt = !current || now - current.firstAttemptAt > windowMs ? { count: 0, firstAttemptAt: now } : current;
  attempt.count += 1;
  if (attempt.count >= maxAttempts) {
    attempt.blockedUntil = now + blockMs;
  }
  attempts.set(key, attempt);
}

export function clearLoginRateLimit(key: string) {
  attempts.delete(key);
}
