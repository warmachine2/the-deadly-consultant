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
  "S.I. Systems": "S.i. Systems",
  "S.i. Systems": "S.i. Systems",
  "Nerdyhire": "Nerdy Hire",
  "Nerdy Hire": "Nerdy Hire",
  "Tundra": "Tundra Technical Solutions",
  "Tundra Technical": "Tundra Technical Solutions",
  "Tundra Technical Solutions": "Tundra Technical Solutions",
  "GTT": "GTT (Global Technical Talent)",
  "GTT (Global Technical Talent)": "GTT (Global Technical Talent)",
  "Global Technical Talent": "GTT (Global Technical Talent)",
  "Global Technical Talent (GTT)": "GTT (Global Technical Talent)",
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
  "Tanisha Systems": "Tanisha Systems Inc.",
  "Tanisha Systems Inc": "Tanisha Systems Inc.",
  "Tanisha Systems Inc.": "Tanisha Systems Inc.",
  "Tanisha Systems, Inc.": "Tanisha Systems Inc.",
  "Tanisha Systems, Inc": "Tanisha Systems Inc.",
};

// Case-insensitive, trimmed alias lookup so variants never appear as separate sources
const sourceAliasLookup: Record<string, string> = Object.fromEntries(
  Object.entries(sourceNameMap).map(([alias, canonical]) => [alias.trim().toLowerCase(), canonical])
);

const stripSourceQualifiers = (raw: string): string => raw.trim().replace(
  /(?:\s*\((?:for client|client undisclosed|undisclosed client|staffing agency|recruiter for|end client|via)\b[^()]*\))+\s*$/i,
  '',
).trim();

const isPlaceholderSource = (value: string): boolean =>
  /^(?:n\/?a|none|unknown|undisclosed|null|undefined|[-–—])$/i.test(value);

export const normalizeSourceName = (raw: string): string => {
  const trimmed = stripSourceQualifiers(typeof raw === 'string' ? raw : '');
  if (!trimmed || isPlaceholderSource(trimmed)) return '';
  const withoutClient = trimmed.replace(/\s+client$/i, '');
  const mapped = sourceAliasLookup[trimmed.toLowerCase()] || sourceAliasLookup[withoutClient.toLowerCase()] || trimmed;
  const lower = mapped.toLowerCase();
  // "Insight Global" and "Insight Global Dallas" are tracked as separate sources
  if (lower.includes('insight global')) {
    return lower.includes('dallas') ? 'Insight Global Dallas' : 'Insight Global';
  }
  return mapped;
};

/** Resolve any Sources-column attribution plus only known agencies in Company.
 * Word boundaries prevent short aliases (TES, GTT, NTT) matching inside words.
 * Longer aliases win when their spans overlap, keeping Dallas distinct.
 */
export const getJobMatchingSources = (job: { source?: string; company?: string }): string[] => {
  const sources = new Set<string>();
  const source = normalizeSourceName(job.source ?? '');
  if (source) sources.add(source);
  const company = stripSourceQualifiers(job.company ?? '');
  if (!company || isPlaceholderSource(company)) return [...sources];
  const occupied: Array<[number, number]> = [];
  Object.entries(sourceNameMap)
    .sort(([a], [b]) => b.length - a.length)
    .forEach(([alias, canonical]) => {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(?<!\\w)${escaped}(?!\\w)`, 'gi');
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

/** The dropdown and filtering share exactly the same source resolver. */
export const getUniqueJobSources = (
  jobs: Array<{ source?: string; company?: string }>, registeredSources: string[] = [],
): string[] => {
  const sources = new Set(registeredSources.map(normalizeSourceName).filter(Boolean));
  jobs.forEach(job => getJobMatchingSources(job).forEach(source => sources.add(source)));
  return [...sources].sort();
};

export const matchesJobSources = (
  job: { source?: string; company?: string }, selectedSources: string[],
): boolean => selectedSources.length === 0 ||
  getJobMatchingSources(job).some(source => selectedSources.some(selected => normalizeSourceName(selected) === source));
