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

const asText = (value: unknown): string =>
  typeof value === 'string' ? value : value == null ? '' : String(value);

// US state + Canadian province codes accepted by the generic city parse
// (case-sensitive, so lowercase sentence words never match).
const CITY_STATE_CODES = 'CA|TN|NJ|NY|TX|IL|WA|MA|FL|GA|NC|VA|OH|PA|CO|AZ|AB|BC|ON|QC|MB|SK';
const CITY_STATE_RE = new RegExp(`(?:^|[\\n;•|:\\-–—])\\s*([A-Za-z][A-Za-z .']*?),?\\s+(${CITY_STATE_CODES})\\b`, 'g');
const LEADING_NOISE_RE = /^(?:in|at|or|and|onsite|on-site|on site|hybrid|remote)\b[\s,\-–—]*/i;

/**
 * Parse "City, ST" / "City ST" patterns (e.g. "Irvine, CA", "Nashville, TN")
 * from recruiter free text. Returns the city name or '' when no match.
 */
const parseCityStateCode = (text: string): string => {
  if (!text) return '';
  CITY_STATE_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = CITY_STATE_RE.exec(text))) {
    let city = m[1].trim().replace(/[\s,.\-–—]+$/, '');
    let prev: string;
    do {
      prev = city;
      city = city.replace(LEADING_NOISE_RE, '').trim().replace(/^[\s,.\-–—]+/, '');
    } while (city !== prev);
    if (city && !/^(in|at|or|and|onsite|hybrid|remote)$/i.test(city)) return city;
  }
  return '';
};

/**
 * Map known cities to filter labels from the work-type/location description
 * string. Shared by the City filter dropdown and the job-card/table city
 * display so they always agree on one city label.
 */
export const extractCity = (workType: string, location: string = '', comments: string = ''): string => {
  const combined = `${asText(workType)} ${asText(location)} ${asText(comments)}`.trim();
  if (!combined) return 'Unknown';
  const lower = combined.toLowerCase();

  // 7 Target Cities (KAN-227)
  if (lower.includes('toronto')) return 'Toronto';
  if (lower.includes('new york city') || lower.includes('new york') || /\bnyc\b/.test(lower) || lower.includes('jersey city') || lower.includes('white plains')) return 'New York';
  if (lower.includes('chicago')) return 'Chicago';
  if (lower.includes('san francisco') || lower.includes('bay area') || lower.includes('san jose') || lower.includes('santa clara') || lower.includes('oakland') || lower.includes('sunnyvale')) return 'San Francisco';
  if (lower.includes('boston') || lower.includes('massachusetts')) return 'Boston';
  if (lower.includes('dallas') || lower.includes('dfw') || lower.includes('fort worth') || lower.includes('plano') || lower.includes('irving') || lower.includes('el paso')) return 'Dallas';
  if (lower.includes('austin')) return 'Austin';

  // Generic "<City>, <2-letter state/province code>" parse (e.g. recruiter
  // emails like "Irvine, CA" or "Nashville, TN") before the broad fallbacks.
  const parsed = parseCityStateCode(asText(location)) || parseCityStateCode(asText(comments));
  if (parsed) return parsed;

  // Remote-only roles
  if (lower === 'true' || (lower.includes('remote') && !lower.includes('onsite') && !lower.includes('in-office') && !lower.includes('in person') && !lower.includes('in-person'))) {
    return 'Remote';
  }

  // Canadian cities
  if (lower.includes('mississauga')) return 'Mississauga';
  if (lower.includes('vancouver')) return 'Vancouver';
  if (lower.includes('calgary')) return 'Calgary';
  if (lower.includes('winnipeg')) return 'Winnipeg';
  if (lower.includes('ottawa')) return 'Ottawa';
  if (lower.includes('montreal')) return 'Montreal';
  if (lower.includes('brampton')) return 'Brampton';
  if (lower.includes('hamilton')) return 'Hamilton';
  if (lower.includes('london')) return 'London';
  if (lower.includes('canada')) return 'Canada';

  // Other US cities
  if (lower.includes('charlotte')) return 'Charlotte';
  if (lower.includes('harrisburg')) return 'Harrisburg';
  if (lower.includes('buffalo')) return 'Buffalo';
  if (lower.includes('columbia')) return 'Columbia';
  if (lower.includes('jackson')) return 'Jackson';
  if (lower.includes('miami')) return 'Miami';
  if (lower.includes('usa') || lower.includes('united states')) return 'USA';

  return 'Other';
};

/** Minimal job shape needed for the card/table city label. */
export interface CardCityJob {
  workType?: string;
  location?: string;
  comments?: string;
}

export const CITY_NOT_LISTED = 'City not listed';

/**
 * City label for job card headers and the table Location column, built on the
 * exact same extraction the City filter dropdown uses so card and filter
 * always match. Bare country buckets and unknowns become "City not listed".
 */
export const formatCardCity = (job: CardCityJob): string => {
  const city = extractCity(job.workType ?? '', job.location ?? '', job.comments ?? '');
  const country = formatLocationLabel(job.location);
  if (
    !city ||
    city === 'Unknown' ||
    city === 'Other' ||
    city === 'Canada' ||
    city === 'USA' ||
    (country !== '' && city === country)
  ) {
    return CITY_NOT_LISTED;
  }
  if (city === 'Remote') return 'Remote';
  return city;
};

/**
 * Full "City • Country" label for card headers and the table Location column.
 * Never duplicates the city when the country string already starts with it,
 * and never returns a blank string.
 */
export const formatCardCityCountry = (job: CardCityJob): string => {
  const city = formatCardCity(job);
  const country = formatLocationLabel(job.location);
  if (!country) return city;
  if (country === city || country.startsWith(city)) return country;
  return `${city}, ${country}`;
};

export const extractChartCountry = (location: string, source?: string): 'Canada' | 'USA' | 'Other' => {
  const c = normalizeCountry(location, source);
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
