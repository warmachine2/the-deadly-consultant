import { expect, test } from 'bun:test';
import { countActiveSources } from '../src/lib/jobSources';

test('counts unique recruitment sources present in the data', () => {
  const jobs = [
    { source: 'Motion Recruitment' },
    { source: 'Kforce' },
    { source: '  kforce  ' },
    { source: 'TEKsystems' },
    { source: '' },
    { source: undefined },
  ];
  expect(countActiveSources(jobs)).toBe(3);
});

test('returns 0 when no source is recorded', () => {
  expect(countActiveSources([{ source: '' }, {}])).toBe(0);
});

test('reports 19 distinct agencies when 19 sources appear', () => {
  const jobs = Array.from({ length: 19 }, (_, i) => ({ source: `Source ${i}` }));
  jobs.push({ source: 'source 0' });
  expect(countActiveSources(jobs)).toBe(19);
});
