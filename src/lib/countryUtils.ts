export const normalizeCountry = (rawLocation?: string): string => {
  if (!rawLocation) return '';
  const trimmed = rawLocation.trim().replace(/[\r\n]+/g, '');
  if (!trimmed) return '';
  const loc = trimmed.toUpperCase();

  // Canada indicators
  if (
    loc.includes('CANADA') ||
    loc.endsWith(', CA') ||
    loc.endsWith(' CA') ||
    /\b(TORONTO|MONTREAL|VANCOUVER|CALGARY|OTTAWA|EDMONTON|QUEBEC|ONTARIO)\b/.test(loc)
  ) {
    return 'Canada';
  }

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
