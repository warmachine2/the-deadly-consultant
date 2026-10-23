/**
 * Recruitment sources are already canonicalized when the CSV is parsed
 * (normalizeSourceName in NetworkHealthPanel), so counting distinct
 * non-empty values is enough to report how many agencies are live.
 */
export const countActiveSources = (jobs: { source?: string }[]): number => {
  const sources = new Set<string>();
  jobs.forEach(job => {
    const source = (job.source ?? '').trim();
    if (source) sources.add(source.toLowerCase());
  });
  return sources.size;
};
