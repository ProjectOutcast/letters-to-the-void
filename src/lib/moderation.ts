// Content moderation for anonymous vents
// Shadow-ban approach: filtered content returns { allowed: false }
// but the caller fakes success to the user

const EMAIL_REGEX = /\b[\w.-]+@[\w.-]+\.\w{2,}\b/;
const PHONE_REGEX = /\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
const SSN_REGEX = /\b\d{3}-\d{2}-\d{4}\b/;
const URL_REGEX = /https?:\/\/\S+/i;

// Basic blocked patterns — slurs, threats, extreme content
const BLOCKED_PATTERNS = [
  /\bkill\s+(your|my|him|her|them)self\b/i,
  /\bkys\b/i,
  /\bi\s+will\s+kill\b/i,
  /\bbomb\s+threat\b/i,
];

export function moderateContent(text: string): {
  allowed: boolean;
  reason?: string;
} {
  // PII detection
  if (EMAIL_REGEX.test(text)) return { allowed: false, reason: "pii" };
  if (PHONE_REGEX.test(text)) return { allowed: false, reason: "pii" };
  if (SSN_REGEX.test(text)) return { allowed: false, reason: "pii" };
  if (URL_REGEX.test(text)) return { allowed: false, reason: "pii" };

  // Threat / harmful content
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) return { allowed: false, reason: "content" };
  }

  return { allowed: true };
}
