import { endOfDay, endOfWeek, format, parse, startOfDay, startOfWeek, subDays } from 'date-fns';

export interface JobTimelineBucket {
  label: string;
  count: number;
  startDate: Date;
  endDate: Date;
}

const parseJobDate = (value: string): Date | null => {
  if (!value) return null;
  for (const pattern of ['yyyy-MM-dd', 'yyyy-M-d', 'MM/dd/yyyy', 'M/d/yyyy']) {
    const date = parse(value, pattern, new Date());
    if (!isNaN(date.getTime())) return date;
  }
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

// Only the timeline is windowed; the board's default date range stays unbounded.
export const buildJobTimeline = (
  jobs: ReadonlyArray<{ date: string }>,
  now: Date = new Date(),
): JobTimelineBucket[] => {
  const windowStart = startOfDay(subDays(now, 89));
  const windowEnd = endOfDay(now);
  const buckets = new Map<number, JobTimelineBucket>();

  for (const job of jobs) {
    const date = parseJobDate(job.date);
    if (!date || date < windowStart || date > windowEnd) continue;
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const key = weekStart.getTime();
    const existing = buckets.get(key);
    if (existing) {
      existing.count++;
      continue;
    }
    buckets.set(key, {
      label: format(weekStart, 'MMM d, yyyy'),
      count: 1,
      startDate: new Date(Math.max(weekStart.getTime(), windowStart.getTime())),
      endDate: new Date(Math.min(endOfWeek(date, { weekStartsOn: 1 }).getTime(), windowEnd.getTime())),
    });
  }

  return [...buckets.entries()].sort(([a], [b]) => a - b).map(([, bucket]) => bucket);
};