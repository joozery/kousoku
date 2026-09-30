import test from 'node:test';
import assert from 'node:assert/strict';
import { validateQuoteRequest } from '../src/lib/quote-request-validation.ts';

const valid = {
  requestId: '8b3ce9c7-f83d-4b77-a345-530cced28460', name: ' Customer ', company: '',
  email: 'CUSTOMER@example.com', phone: '+66 81 234 5678',
  products: 'Copper tube 1/2 inch', quantity: '50 lengths', details: '', locale: 'th',
};
test('accepts a complete enquiry and normalizes contact details', () => {
  const value = validateQuoteRequest(valid);
  assert.equal(value.name, 'Customer');
  assert.equal(value.email, 'customer@example.com');
  assert.equal(value.quantity, '50 lengths');
});
test('rejects missing fields, invalid contacts and invalid locales', () => {
  for (const patch of [{ name: ' ' }, { products: '' }, { quantity: '' }, { email: 'invalid' }, { phone: '.......' }, { locale: 'xx' }, { requestId: 'not-a-uuid' }]) {
    assert.equal(validateQuoteRequest({ ...valid, ...patch }), null);
  }
});
test('rejects non-object payloads and query operator injection', () => {
  for (const value of [null, [], 'text', { ...valid, email: { $ne: null } }, { ...valid, quantity: 0 }]) assert.equal(validateQuoteRequest(value), null);
});
test('rejects oversized values and excludes unknown client fields', () => {
  assert.equal(validateQuoteRequest({ ...valid, products: 'x'.repeat(2001) }), null);
  const value = validateQuoteRequest({ ...valid, status: 'approved', createdAt: '2000-01-01' });
  assert.equal('status' in value, false);
  assert.equal('createdAt' in value, false);
});
