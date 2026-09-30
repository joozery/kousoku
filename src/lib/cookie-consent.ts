export const CONSENT_COOKIE = 'ksk_cookie_consent';
export const CONSENT_EVENT = 'ksk:cookie-consent';
export const CONSENT_SETTINGS_EVENT = 'ksk:cookie-settings';
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
export type CookieConsent = { version: 1; external: boolean; savedAt: number };

export function parseConsent(value: string, now = Date.now()): CookieConsent | null {
  try {
    const parsed = JSON.parse(value);
    if (parsed?.version !== 1 || typeof parsed.external !== 'boolean' || typeof parsed.savedAt !== 'number' || !Number.isFinite(parsed.savedAt) || parsed.savedAt > now || now - parsed.savedAt >= CONSENT_MAX_AGE * 1000) return null;
    return { version: 1, external: parsed.external, savedAt: parsed.savedAt };
  } catch { return null; }
}
