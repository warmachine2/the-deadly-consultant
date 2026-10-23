import { describe, expect, test } from 'bun:test';
import { buildJobTimeline } from '../src/lib/jobTimeline';

const now = new Date(2026, 9, 23, 12);

describe('recent weekly job timeline', () => {
  test('excludes legacy, invalid and future dates from the last 90 days', () => {
    const timeline = buildJobTimeline([
      { date: '2024-10-01' }, { date: '2026-07-25' },
      { date: '2026-07-26' }, { date: '2026-10-23' },
      { date: '2026-10-24' }, { date: 'not a date' },
    ], now);
    expect(timeline.map(bucket => bucket.count)).toEqual([1, 1]);
    expect(timeline[0]?.startDate).toEqual(new Date(2026, 6, 26));
  });

  test('groups September and October jobs into chronological active weeks only', () => {
    const timeline = buildJobTimeline([
      { date: '10/23/2026' }, { date: '2026-09-02' },
      { date: '2026-09-06' }, { date: '2026-09-07' },
    ], now);
    expect(timeline.map(bucket => bucket.label)).toEqual(['Aug 31, 2026', 'Sep 7, 2026', 'Oct 19, 2026']);
    expect(timeline.map(bucket => bucket.count)).toEqual([2, 1, 1]);
  });

  test('each point carries its inclusive weekly table filter range', () => {
    const [bucket] = buildJobTimeline([{ date: '2026-09-02' }], now);
    expect(bucket?.startDate).toEqual(new Date(2026, 7, 31));
    expect(bucket?.endDate).toEqual(new Date(2026, 8, 6, 23, 59, 59, 999));
  });

  test('current week stops at today, including the entire current day', () => {
    const [bucket] = buildJobTimeline([{ date: '2026-10-23' }], now);
    expect(bucket?.startDate).toEqual(new Date(2026, 9, 19));
    expect(bucket?.endDate).toEqual(new Date(2026, 9, 23, 23, 59, 59, 999));
  });

  test('returns no buckets for empty or legacy-only datasets', () => {
    expect(buildJobTimeline([], now)).toEqual([]);
    expect(buildJobTimeline([{ date: '2024-10-01' }], now)).toEqual([]);
  });
});