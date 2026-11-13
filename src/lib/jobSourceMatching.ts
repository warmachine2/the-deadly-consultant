// Map observed data-source spellings to the canonical source names above
export const sourceNameMap: Record<string, string> = {
  "Procom": "Procom",
  "Insight Global": "Insight Global",
  "Insight Global Dallas": "Insight Global Dallas",
  "Agilus Work Solutions": "Agilus Work Solutions",
  "ProViso": "Proviso",
  "Agilus": "Agilus Work Solutions",
  "Agilus (Canada)": "Agilus Work Solutions",
  "SI Systems": "S.i. Systems",
  "S.i. Systems": "S.i. Systems",
  "Nerdyhire": "Nerdy Hire",
  "Nerdy Hire": "Nerdy Hire",
  "Tundra": "Tundra Technical Solutions",
  "Tundra Technical": "Tundra Technical Solutions",
  "Tundra Technical Solutions": "Tundra Technical Solutions",
  "GTT": "GTT (Global Technical Talent)",
  "GTT (Global Technical Talent)": "GTT (Global Technical Talent)",
  "Global Technical Talent": "GTT (Global Technical Talent)",
  "NTT Data": "NTT Data",
  "NTT DATA": "NTT Data",
  "NTT": "NTT Data",
  "NTT DATA Services": "NTT Data",
  "HR Brain": "HR Brain",
  "hrbrain": "HR Brain",
  "HRBrain": "HR Brain",
  "Axelon Services": "Axelon Services Corporation",
  "Axelon Services Corporation": "Axelon Services Corporation",
  "Axelon": "Axelon Services Corporation",
  "Soho Square Solutions": "Soho Square Solutions",
  "Soho Square": "Soho Square Solutions",
  "Soho": "Soho Square Solutions",
  "Mondo": "Mondo",
  "mondo": "Mondo",
  "Mondo (US)": "Mondo",
  "Peterson Technology Partners": "Peterson Technology Partners (PTP)",
  "Peterson Technology Partners (PTP)": "Peterson Technology Partners (PTP)",
  "Peterson": "Peterson Technology Partners (PTP)",
  "PTP": "Peterson Technology Partners (PTP)",
  "Kforce": "Kforce",
  "kforce": "Kforce",
  "TEKsystems": "TEKsystems",
  "teksystems": "TEKsystems",
  "TEKsystems Austin": "TEKsystems",
  "TES": "TES – The Employment Solution",
  "The Employment Solution": "TES – The Employment Solution",
  "TES – The Employment Solution": "TES – The Employment Solution",
  "Motion Recruitment": "Motion Recruitment",
  "Motion": "Motion Recruitment",
  "motion recruitment": "Motion Recruitment",
  "Motion Recruitment - San Francisco": "Motion Recruitment",
};

// Case-insensitive, trimmed alias lookup so variants never appear as separate sources
const sourceAliasLookup: Record<string, string> = Object.fromEntries(
  Object.entries(sourceNameMap).map(([alias, canonical]) => [alias.trim().toLowerCase(), canonical])
);

export const normalizeSourceName = (raw: string): string => {
  const trimmed = (typeof raw === 'string' ? raw : '').trim();
  if (!trimmed) return '';
  const mapped = sourceAliasLookup[trimmed.toLowerCase()] || trimmed;
  const lower = mapped.toLowerCase();
  // "Insight Global" and "Insight Global Dallas" are tracked as separate sources
  if (lower.includes('insight global')) {
    return lower.includes('dallas') ? 'Insight Global Dallas' : 'Insight Global';
  }
  return mapped;
};

/** Resolve source attribution plus recognized agency names embedded in Company.
 * Word boundaries prevent short aliases (TES, GTT, NTT) matching inside words.
 * Longer aliases win when their spans overlap, keeping Dallas distinct.
 */
export const getJobMatchingSources = (job: { source?: string; company?: string }): string[] => {
  const sources = new Set<string>();
  const source = normalizeSourceName(job.source ?? '');
  if (source) sources.add(source);
  const company = job.company ?? '';
  const occupied: Array<[number, number]> = [];
  Object.entries(sourceNameMap)
    .sort(([a], [b]) => b.length - a.length)
    .forEach(([alias, canonical]) => {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\b${escaped}\\b`, 'gi');
      for (const match of company.matchAll(pattern)) {
        const start = match.index;
        const end = start + match[0].length;
        if (occupied.some(([a, b]) => start < b && end > a)) continue;
        occupied.push([start, end]);
        sources.add(canonical);
      }
    });
  return [...sources];
};

export const matchesJobSources = (
  job: { source?: string; company?: string }, selectedSources: string[],
): boolean => selectedSources.length === 0 ||
  getJobMatchingSources(job).some(source => selectedSources.some(selected => normalizeSourceName(selected) === source));
