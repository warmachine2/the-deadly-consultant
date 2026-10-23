import { expect, test } from 'bun:test';
import { getJobRowKey } from '../src/pages/JobAlertsPage';

test('prefers the Job ID when one is recorded', () => {
  const job = { jobId: '99e0afd6-28b4-4999-9b3c-527539f00a40', jobLink: 'https://x.test/job' };
  expect(getJobRowKey(job, 5)).toBe('job-99e0afd6-28b4-4999-9b3c-527539f00a40-5');
});

test('falls back to the job link, then to the row position', () => {
  expect(getJobRowKey({ jobLink: 'https://x.test/job' }, 3)).toBe('https://x.test/job-3');
  expect(getJobRowKey({ jobId: '', jobLink: '' }, 7)).toBe('job-idx-7');
  expect(getJobRowKey({}, 7)).toBe('job-idx-7');
});

// The live feed contains the same Job ID on several scraped rows, so a bare
// Job ID key would collide and let one card's open state drive another's.
test('duplicate Job IDs on different rows still get unique keys', () => {
  const rows = Array.from({ length: 3 }, () => ({ jobId: '99e0afd6-28b4-4999-9b3c-527539f00a40' }));
  const keys = rows.map((job, index) => getJobRowKey(job, index));
  expect(new Set(keys).size).toBe(3);
});

// Card #1 on page 2 must not inherit card #1 on page 1: the same slot holds a
// different job, so the key has to change.
test('a different job in the same slot gets a different key', () => {
  const pageOne = getJobRowKey({ jobId: 'aaa' }, 0);
  const pageTwo = getJobRowKey({ jobId: 'bbb' }, 20);
  expect(pageOne).not.toBe(pageTwo);
});
