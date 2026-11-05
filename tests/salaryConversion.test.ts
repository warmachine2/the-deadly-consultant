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

// KAN salary conversion: hourly rates written without a slash (e.g. '$35 USD
// hourly') must still be detected as hourly and converted, and the badge must
// not echo the word 'hourly'.

test("'$35 USD hourly' is detected as hourly and converts at 35 * 1.14 * 160", () => {
  expect(formatEarningsMonthly('$35 USD hourly', '')).toBe('$6,384/mo USD');
  expect(getMonthlyAmount('$35 USD hourly', '')).toBe(6384);
});

test("'$45 CAD hourly' converts to CAD monthly", () => {
  expect(formatEarningsMonthly('$45 CAD hourly', '')).toBe('$8,208/mo CAD');
  expect(getMonthlyAmount('$45 CAD hourly', '')).toBe(8208);
});

test("'$35 - $42 USD hourly' converts both ends of the range", () => {
  expect(formatEarningsMonthly('$35 - $42 USD hourly', '')).toBe('$6,384 - $7,661/mo USD');
});

test("'$35 USD hourly *Est.' keeps the estimate marker without repeating 'hourly'", () => {
  expect(formatEarningsMonthly('$35 USD hourly *Est.', '')).toBe('$6,384/mo USD *Est.');
});

test("slash hourly notation is unchanged ('$91/hr USD')", () => {
  expect(formatEarningsMonthly('$91/hr USD', '')).toBe('$16,598/mo USD');
});

test("'annual' wording still converts by /12 and never matches the hourly rule", () => {
  expect(formatEarningsMonthly('$84,000 annual USD', '')).toBe('$7,000/mo USD');
});

// Shapes taken verbatim from live sheet rows: decimals, a tight dash range,
// capitalised 'Hourly', and no explicit currency (inferred from location).
test("live slash-free hourly shapes convert cleanly", () => {
  expect(formatEarningsMonthly('$100.00-$130.00 hourly', '')).toBe('$18,240 - $23,712/mo USD');
  expect(formatEarningsMonthly('$85 USD Hourly', '')).toBe('$15,504/mo USD');
  expect(formatEarningsMonthly('$51 USD Hourly', '')).toBe('$9,302/mo USD');
  expect(getMonthlyAmount('$100.00-$130.00 hourly', '')).toBe(18240);
});
