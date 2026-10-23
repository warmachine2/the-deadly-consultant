import { expect, test } from 'bun:test';
import { asText, sanitizeCachedJob, sanitizeCachedJobs } from '../src/pages/JobAlertsPage';

test('asText coerces anything that is not a string to an empty string', () => {
  expect(asText('hello')).toBe('hello');
  expect(asText(16000)).toBe('16000');
  expect(asText(null)).toBe('');
  expect(asText(undefined)).toBe('');
  expect(asText(true)).toBe('');
  expect(asText({})).toBe('');
  expect(asText(NaN)).toBe('');
});

test('records that are not objects are dropped', () => {
  for (const bad of [null, undefined, 'x', 42, [], true]) {
    expect(sanitizeCachedJob(bad)).toBeNull();
  }
});

// A row without a role has no title to render and no text to categorise.
test('a record without a role is dropped', () => {
  expect(sanitizeCachedJob({ date: '2026-10-20', role: null })).toBeNull();
  expect(sanitizeCachedJob({ date: '2026-10-20' })).toBeNull();
  expect(sanitizeCachedJob({ role: '   ' })).toBeNull();
});

// These are the exact shapes that used to throw inside the card render.
test('corrupt field types are coerced to strings instead of crashing the card', () => {
  const job = sanitizeCachedJob({
    date: null,
    role: 'Program Manager',
    term: 6,
    duties: true,
    location: 99,
    source: null,
    earningEstimate: 16000,
  });
  expect(job).not.toBeNull();
  expect(job!.date).toBe('');
  expect(job!.role).toBe('Program Manager');
  expect(job!.term).toBe('6');
  expect(job!.duties).toBe('');
  expect(job!.location).toBe('99');
  expect(job!.source).toBe('');
  expect(job!.earningEstimate).toBe('16000');
});

test('companyInfo that is not an array is dropped, mixed arrays keep only real bullets', () => {
  expect(sanitizeCachedJob({ role: 'PM', companyInfo: 'Global IT services' })!.companyInfo).toBeUndefined();
  expect(sanitizeCachedJob({ role: 'PM', companyInfo: { a: 1 } })!.companyInfo).toBeUndefined();
  const kept = sanitizeCachedJob({
    role: 'PM',
    companyInfo: ['Real bullet', null, 42, '', '   ', 'Second'],
  })!.companyInfo;
  expect(kept).toEqual(['Real bullet', 'Second']);
});

test('a valid cached record survives untouched', () => {
  const source = {
    date: '2026-10-20',
    role: 'Program Manager',
    term: '6 months',
    duties: 'Leading delivery',
    requiredExperience: '5+ years',
    requiredSkills: 'PM',
    additionalRequirements: 'PMP',
    comments: 'Hybrid',
    workType: 'Hybrid - Toronto, ON',
    company: 'Acme',
    recruiterEmail: 'a@b.com',
    recruiterPhone: '416-555-0100',
    recruiterName: 'Jane Doe',
    recruiterLinkedIn: 'https://linkedin.com/in/jane',
    strategy: 's',
    earningEstimate: '$16,000/mo CAD',
    location: 'Toronto, ON',
    source: 'Kforce',
    companyInfo: ['Bullet one'],
    jobId: 'abc',
    jobLink: 'https://x.test/job',
  };
  expect(sanitizeCachedJob(source)).toEqual(source);
});

test('sanitizeCachedJobs filters corrupt entries out of a whole cache payload', () => {
  const clean = sanitizeCachedJobs([
    { role: 'Good', date: '2026-10-20' },
    null,
    'nope',
    7,
    [],
    { date: '2026-10-21' },
    { role: 'Also good', location: 12 },
  ]);
  expect(clean.map(job => job.role)).toEqual(['Good', 'Also good']);
  expect(sanitizeCachedJobs(undefined)).toEqual([]);
  expect(sanitizeCachedJobs({ jobs: 'x' })).toEqual([]);
});
