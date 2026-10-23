import { expect, test } from 'bun:test';
import { formatEarningsMonthly, getMonthlyAmount } from '../src/pages/JobAlertsPage';

// KAN salary conversion: 'k'/'K' thousands multiplier support.

test("'$120k - $140k/yr' expands k amounts and converts to monthly", () => {
  expect(formatEarningsMonthly('$120k - $140k/yr', '')).toBe('$10,000 - $11,667/mo USD');
});

test("'$10k - $12k/mo' expands k amounts in the already-monthly path", () => {
  expect(formatEarningsMonthly('$10k - $12k/mo', '')).toBe('$10,000 - $12,000/mo USD');
});

test('full annual numbers keep converting exactly as before', () => {
  expect(formatEarningsMonthly('$120,000 - $140,000/yr', '')).toBe('$10,000 - $11,667/mo USD');
});

test('hourly rates keep converting exactly as before', () => {
  expect(formatEarningsMonthly('$75 - $90/hr', '')).toBe('$13,680 - $16,416/mo USD');
});

test('getMonthlyAmount sees the k-expanded amount so salary filters group correctly', () => {
  expect(getMonthlyAmount('$120k - $140k/yr', '')).toBe(10000);
  expect(getMonthlyAmount('$10k - $12k/mo', '')).toBe(10000);
  expect(getMonthlyAmount('$95k/yr', '')).toBe(7917);
});

test("a 'k' without a dollar amount (e.g. '401k') is not treated as thousands", () => {
  expect(getMonthlyAmount('$60k/yr plus 401k', '')).toBe(5000);
});

// KAN salary conversion: single-amount regression set covering every input shape.
// Currency is always appended (USD inferred from an empty/non-Canadian location),
// so the assertions include the suffix the board actually renders.

test("'$120k/yr' converts to '$10,000/mo'", () => {
  expect(formatEarningsMonthly('$120k/yr', '')).toBe('$10,000/mo USD');
  expect(getMonthlyAmount('$120k/yr', '')).toBe(10000);
});

test("'$120k - $140k/yr USD' converts to '$10,000 - $11,667/mo USD'", () => {
  expect(formatEarningsMonthly('$120k - $140k/yr USD', '')).toBe('$10,000 - $11,667/mo USD');
  expect(getMonthlyAmount('$120k - $140k/yr USD', '')).toBe(10000);
});

test("'$10k/mo' converts to '$10,000/mo'", () => {
  expect(formatEarningsMonthly('$10k/mo', '')).toBe('$10,000/mo USD');
  expect(getMonthlyAmount('$10k/mo', '')).toBe(10000);
});

test("'$75/hr' converts with the hourly formula 75 * 1.14 * 160 = '$13,680/mo'", () => {
  expect(formatEarningsMonthly('$75/hr', '')).toBe('$13,680/mo USD');
  expect(getMonthlyAmount('$75/hr', '')).toBe(13680);
});

test("'$150,000/yr' converts to '$12,500/mo'", () => {
  expect(formatEarningsMonthly('$150,000/yr', '')).toBe('$12,500/mo USD');
  expect(getMonthlyAmount('$150,000/yr', '')).toBe(12500);
});
