import { test, expect } from "bun:test";
import { normalizeCountry, extractChartCountry } from "../src/lib/countryUtils";

// USA variants must all collapse to the canonical "USA" label.
test("normalizeCountry maps US variants to USA", () => {
  expect(normalizeCountry("US")).toBe("USA");
  expect(normalizeCountry("USA")).toBe("USA");
  expect(normalizeCountry("United States")).toBe("USA");
  expect(normalizeCountry("US (New York, NY)")).toBe("USA");
  expect(normalizeCountry("Austin, TX, US")).toBe("USA");
});

// Canada variants must all collapse to the canonical "Canada" label.
test("normalizeCountry maps Canadian variants to Canada", () => {
  expect(normalizeCountry("Canada")).toBe("Canada");
  expect(normalizeCountry("Toronto, ON, Canada")).toBe("Canada");
  expect(normalizeCountry("Montreal, QC, Canada")).toBe("Canada");
});

// Other countries keep a clean country name instead of a raw location fragment.
test("normalizeCountry returns clean names for other countries", () => {
  expect(normalizeCountry("Peru")).toBe("Peru");
  expect(normalizeCountry("India")).toBe("India");
  expect(normalizeCountry("United Kingdom")).toBe("United Kingdom");
});

// Charts only bucket Canada / USA / Other.
test("extractChartCountry buckets Canada, USA and everything else", () => {
  expect(extractChartCountry("US")).toBe("USA");
  expect(extractChartCountry("US (Dallas, TX)")).toBe("USA");
  expect(extractChartCountry("Toronto, ON, Canada")).toBe("Canada");
  expect(extractChartCountry("Lima, Peru")).toBe("Other");
  expect(extractChartCountry("")).toBe("Other");
});

// The dropdown used to collect state fragments like "NY)" and "TX)" as countries.
test("no closing-parenthesis artifacts are produced", () => {
  const locations = [
    "US (New York, NY)",
    "US (Austin, TX)",
    "US (Chicago, IL)",
    "Austin, TX, US",
    "Toronto, ON, Canada",
    "US (Dallas, TX)",
  ];
  const countries = new Set<string>();
  locations.forEach(loc => {
    const country = normalizeCountry(loc);
    if (country) countries.add(country);
  });
  const entries = Array.from(countries);
  entries.forEach(entry => {
    expect(entry.endsWith(")")).toBe(false);
    expect(entry.includes(")")).toBe(false);
  });
  expect(entries).toContain("USA");
  expect(entries).toContain("Canada");
});

import { formatLocationLabel, isStandaloneUSA } from "../src/lib/countryUtils";

test("dotted and spelled-out US variants normalize to USA", () => {
  for (const v of ["United States", "U.S.A.", "US", "U.S.", "u.s.a", " USA "]) {
    expect(normalizeCountry(v)).toBe("USA");
    expect(formatLocationLabel(v)).toBe("USA");
    expect(isStandaloneUSA(v)).toBe(true);
  }
});

test("city/state and recruiter notes are never overwritten in chips", () => {
  expect(formatLocationLabel("Dallas, TX")).toBe("Dallas, TX");
  expect(formatLocationLabel("Toronto, ON")).toBe("Toronto, ON");
  expect(formatLocationLabel("Hybrid - 3 days onsite Boston, MA (US)")).toBe("Hybrid - 3 days onsite Boston, MA (US)");
  expect(normalizeCountry("Toronto, ON")).toBe("Canada");
});

import { buildCountryFilterOptions } from "../src/lib/countryUtils";

// The Country dropdown must carry the same "Other" bucket the chart's bar uses.
test("country dropdown offers an Other bucket alongside Canada and USA", () => {
  const values = buildCountryFilterOptions([
    "India",
    "Peru",
    "Canada",
    "USA",
    "Other",
    "N/A",
    "No job text provided",
  ]).map(o => o.value);

  expect(values[0]).toBe("all");
  expect(values.filter(v => v === "Other").length).toBe(1);
  expect(values.filter(v => v === "Canada").length).toBe(1);
  expect(values.filter(v => v === "USA").length).toBe(1);
  expect(values).toContain("India");
  expect(values).toContain("Peru");
  expect(values).not.toContain("N/A");
  expect(values).not.toContain("No job text provided");
  expect(values.indexOf("Other")).toBeLessThan(values.indexOf("India"));
});

test("country dropdown keeps its four buckets when the data has no countries", () => {
  expect(buildCountryFilterOptions([]).map(o => o.value)).toEqual(["all", "Canada", "USA", "Other"]);
});
