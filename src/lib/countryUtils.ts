const US_STANDALONE = new Set(['US', 'USA', 'UNITEDSTATES', 'UNITEDSTATESOFAMERICA', 'AMERICA']);

/** True only when the whole string is a bare US country label (no city/state). */
export const isStandaloneUSA = (raw?: string): boolean => {
  if (typeof raw !== 'string' || !raw) return false;
  const key = raw.trim().toUpperCase().replace(/[.\s]/g, '');
  return US_STANDALONE.has(key);
};

/**
 * Display label for job card location chips. Only bare US country labels are
 * rewritten to "USA"; any city/state/address or recruiter note is kept verbatim.
 */
export const formatLocationLabel = (raw?: string): string => {
  if (!raw) return '';
  return isStandaloneUSA(raw) ? 'USA' : raw;
};

// US state abbreviations — note CA is California here, NOT Canada.
const US_STATE_PATTERN = /\b(CA|TX|MA|IL|NY|FL|WA|NJ|GA|CO|PA|VA|OH|NC)\b/;

// Canadian province abbreviations — checked BEFORE US states and generic
// city names so "London, ON" is Canada, not the United Kingdom.
const CA_PROVINCE_PATTERN = /\b(ON|BC|AB|QC|MB|SK|NS|NB|NL|PE)\b/;

/**
 * Classify a location string into a country label for the Country filter and
 * the Jobs-by-Country chart. The raw display text is never modified — this
 * only decides the bucket. Hassan/email-sourced rows and detailed recruiter
 * addresses are returned untouched (no reclassification).
 */
export const normalizeCountry = (rawLocation?: string, source?: string): string => {
  if (typeof rawLocation !== 'string' || !rawLocation) return '';
  const trimmed = rawLocation.trim().replace(/[\r\n]+/g, '');
  if (!trimmed) return '';
  const loc = trimmed.toUpperCase();
  const src = typeof source === 'string' ? source.toUpperCase() : '';

  // Guardrail: Hassan/email sources and detailed recruiter addresses keep
  // their raw text — never bucket them into a country.
  if (src.includes('HASSAN') || src.includes('EMAIL') || loc.includes('HASSAN') || loc.includes('@')) {
    return trimmed;
  }

  // Standalone US variants ("United States", "U.S.A.", "US", "U.S.") → USA
  if (isStandaloneUSA(trimmed)) return 'USA';

  // Canadian provinces first — "London, ON" must be Canada, not UK.
  if (CA_PROVINCE_PATTERN.test(loc)) return 'Canada';

  // Canada indicators
  if (
    loc.includes('CANADA') ||
    /\b(TORONTO|MONTREAL|VANCOUVER|CALGARY|OTTAWA|EDMONTON|QUEBEC|ONTARIO)\b/.test(loc)
  ) {
    return 'Canada';
  }

  // US state abbreviations — "San Francisco, CA" and "Dallas, TX" → USA.
  if (US_STATE_PATTERN.test(loc)) return 'USA';

  // USA indicators
  if (
    loc === 'US' ||
    loc === 'USA' ||
    loc === 'UNITED STATES' ||
    loc.startsWith('US') ||
    loc.endsWith(', US') ||
    loc.endsWith(' US') ||
    loc.includes(', US') ||
    loc.includes('USA') ||
    loc.includes('UNITED STATES') ||
    loc.includes(' US ')
  ) {
    return 'USA';
  }

  // Specific other countries
  if (loc.includes('UK') || loc.includes('UNITED KINGDOM') || loc.includes('ENGLAND') || loc.includes('LONDON')) return 'United Kingdom';
  if (loc.includes('INDIA')) return 'India';
  if (loc.includes('PERU')) return 'Peru';
  if (loc.includes('BRAZIL')) return 'Brazil';
  if (loc.includes('COLOMBIA')) return 'Colombia';
  if (loc.includes('THAILAND')) return 'Thailand';
  if (loc.includes('PORTUGAL')) return 'Portugal';

  return trimmed;
};

export const extractChartCountry = (location: string): 'Canada' | 'USA' | 'Other' => {
  const c = normalizeCountry(location);
  if (c === 'Canada' || c === 'USA') return c;
  return 'Other';
};

const COUNTRY_DROPDOWN_EXCLUDES = new Set(['Canada', 'USA', 'Other', 'N/A', 'No job text provided']);

/**
 * Country dropdown options: "All Countries" first, then Canada, USA and the
 * "Other" bucket (every job that is not Canada or USA), then the specific
 * countries found in the data. Keeps the dropdown in sync with the chart's
 * Canada / USA / Other grouping so a chart click and a dropdown pick agree.
 */
export const buildCountryFilterOptions = (countries: string[]): { value: string; label: string }[] => {
  const extras = countries
    .filter(c => !COUNTRY_DROPDOWN_EXCLUDES.has(c))
    .map(c => ({ value: c, label: c }));
  return [
    { value: 'all', label: 'All Countries' },
    { value: 'Canada', label: 'Canada' },
    { value: 'USA', label: 'USA' },
    { value: 'Other', label: 'Other' },
    ...extras,
  ];
};
