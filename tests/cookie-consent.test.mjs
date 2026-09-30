import test from 'node:test';
import assert from 'node:assert/strict';
import { parseConsent, CONSENT_MAX_AGE } from '../src/lib/cookie-consent.ts';
const now = 1800000000000;
test('accepts explicit acceptance and refusal', () => {
  for (const external of [true, false]) assert.deepEqual(parseConsent(JSON.stringify({version: 1, external, savedAt: now}), now), {version: 1, external, savedAt: now});
});
test('does not enable external content for missing or invalid preferences', () => {
  for (const value of ['', 'pending', '{', 'null', '{}', '{"version":1,"external":"true","savedAt":1800000000000}']) assert.equal(parseConsent(value, now), null);
});
test('requires renewed consent for expired, future or old-version choices', () => {
  for (const patch of [{savedAt: now - CONSENT_MAX_AGE * 1000}, {savedAt: now + 1}, {version: 0}]) assert.equal(parseConsent(JSON.stringify({version: 1, external: true, savedAt: now, ...patch}), now), null);
});
