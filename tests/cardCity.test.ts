import { describe, it, expect } from 'vitest';
import { extractCity, formatCardCity, formatCardCityCountry, CITY_NOT_LISTED } from '@/lib/countryUtils';

describe('formatCardCity', () => {
  it('returns the extracted city for known cities', () => {
    expect(formatCardCity({ workType: 'Hybrid', location: 'Toronto, ON', comments: '' })).toBe('Toronto');
    expect(formatCardCity({ workType: 'Onsite - Calgary, AB', location: '', comments: '' })).toBe('Calgary');
    expect(formatCardCity({ workType: '', location: 'New York, NY', comments: '' })).toBe('New York');
  });

  it('matches the City filter extraction exactly (workType + location + comments)', () => {
    const job = { workType: 'Remote', location: 'Canada', comments: 'Based in Vancouver' };
    expect(formatCardCity(job)).toBe(extractCity(job.workType, job.location, job.comments));
  });

  it('returns "Remote" for remote-only roles', () => {
    expect(formatCardCity({ workType: 'Remote', location: 'Canada', comments: '' })).toBe('Remote');
    expect(formatCardCity({ workType: 'Remote', location: 'USA', comments: '' })).toBe('Remote');
  });

  it('returns "City not listed" for Unknown / Other / empty extraction', () => {
    expect(formatCardCity({ workType: '', location: '', comments: '' })).toBe(CITY_NOT_LISTED);
    expect(formatCardCity({ workType: 'Onsite', location: 'Someplace', comments: '' })).toBe(CITY_NOT_LISTED);
  });

  it('returns "City not listed" when extraction is a bare country bucket', () => {
    expect(formatCardCity({ workType: 'Hybrid', location: 'Canada', comments: '' })).toBe(CITY_NOT_LISTED);
    expect(formatCardCity({ workType: 'Hybrid', location: 'United States', comments: '' })).toBe(CITY_NOT_LISTED);
  });

  it('returns "City not listed" when the city equals the formatted country string', () => {
    // location "London" extracts city "London" and the country label is also "London"
    expect(formatCardCity({ workType: '', location: 'London', comments: '' })).toBe(CITY_NOT_LISTED);
  });

  it('parses "<City>, <state code>" from recruiter emails', () => {
    expect(formatCardCity({ workType: '', location: 'Irvine, CA', comments: '' })).toBe('Irvine');
    expect(formatCardCity({ workType: '', location: 'Nashville, TN', comments: '' })).toBe('Nashville');
    expect(formatCardCity({ workType: '', location: 'Alameda, CA', comments: '' })).toBe('Alameda');
    expect(formatCardCity({ workType: '', location: 'Irvine CA', comments: '' })).toBe('Irvine');
    expect(formatCardCity({ workType: 'Onsite', location: '', comments: 'Location: Burbank, CA' })).toBe('Burbank');
  });

  it('maps NYC and Jersey City to New York', () => {
    expect(formatCardCity({ workType: '', location: 'NYC', comments: '' })).toBe('New York');
    expect(formatCardCity({ workType: '', location: 'Jersey City, NJ', comments: '' })).toBe('New York');
  });

  it('ignores leading work-type words when parsing city/state', () => {
    expect(formatCardCity({ workType: '', location: 'Onsite - Irvine, CA', comments: '' })).toBe('Irvine');
    expect(formatCardCity({ workType: '', location: 'Hybrid - Nashville, TN', comments: '' })).toBe('Nashville');
  });

  it('still returns Remote for remote-only roles with a state code', () => {
    expect(formatCardCity({ workType: 'Remote', location: 'Remote, ON', comments: '' })).toBe('Remote');
  });

  it('never swallows lowercase words or digits into the city', () => {
    expect(formatCardCity({ workType: '', location: 'Oil and Gas sector in Calgary, AB', comments: '' })).toBe('Calgary');
    expect(formatCardCity({ workType: '', location: 'onsite from day 1 in Nashville, TN', comments: '' })).toBe('Nashville');
  });

  it('does not extract non-city capitalized words', () => {
    expect(formatCardCity({ workType: '', location: 'supporting BC Hydro', comments: '' })).toBe(CITY_NOT_LISTED);
    expect(formatCardCity({ workType: '', location: 'Project, ON', comments: '' })).toBe(CITY_NOT_LISTED);
  });

  it('checks known cities before the generic City, ST fallback', () => {
    expect(formatCardCity({ workType: '', location: 'Plano, TX', comments: '' })).toBe('Dallas');
    expect(formatCardCity({ workType: '', location: 'San Jose, CA', comments: '' })).toBe('San Francisco');
    expect(formatCardCity({ workType: '', location: 'London, ON', comments: '' })).toBe('London');
  });
});

describe('formatCardCityCountry', () => {
  it('renders "City, Country" when both are present and distinct', () => {
    expect(formatCardCityCountry({ workType: 'Hybrid - Calgary', location: 'Canada', comments: '' })).toBe('Calgary, Canada');
    expect(formatCardCityCountry({ workType: 'Remote', location: 'Canada', comments: '' })).toBe('Remote, Canada');
    expect(formatCardCityCountry({ workType: 'Onsite', location: 'Canada', comments: '' })).toBe('City not listed, Canada');
  });

  it('does not duplicate the city when the location already starts with it', () => {
    expect(formatCardCityCountry({ workType: '', location: 'Toronto, ON', comments: '' })).toBe('Toronto, ON');
    expect(formatCardCityCountry({ workType: '', location: 'New York, NY', comments: '' })).toBe('New York, NY');
  });

  it('never returns a blank string', () => {
    expect(formatCardCityCountry({ workType: '', location: '', comments: '' })).toBe(CITY_NOT_LISTED);
    expect(formatCardCityCountry({})).toBe(CITY_NOT_LISTED);
  });

  it('keeps bare US labels as USA', () => {
    expect(formatCardCityCountry({ workType: 'Remote', location: 'US', comments: '' })).toBe('Remote, USA');
  });
});
