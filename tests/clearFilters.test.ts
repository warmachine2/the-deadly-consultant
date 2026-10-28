import { test, expect } from "bun:test";
import { startOfMonth, endOfMonth } from "date-fns";
import { INITIAL_JOB_FILTERS, clearedJobFilters, countActiveJobFilters } from "../src/lib/jobFilterState";

// KAN-413: the board must load with no date bound so every job is visible.
test("date filters default to undefined so all jobs show on load", () => {
  expect(INITIAL_JOB_FILTERS.startDate).toBeUndefined();
  expect(INITIAL_JOB_FILTERS.endDate).toBeUndefined();
});

// KAN-413: clearing must restore the unbounded range, not this month's window.
test("clearing filters yields undefined for both date bounds", () => {
  const cleared = clearedJobFilters();
  expect(cleared.startDate).toBeUndefined();
  expect(cleared.endDate).toBeUndefined();
});

// Guards the exact regression: a cleared range must not equal the current month.
test("clearing does not lock the date range to the current month", () => {
  const cleared = clearedJobFilters();
  const now = new Date();
  expect(cleared.startDate).not.toEqual(startOfMonth(now));
  expect(cleared.endDate).not.toEqual(endOfMonth(now));
});

// Cleared state must be the same state the page loads with.
test("cleared filters match the initial load state", () => {
  expect(clearedJobFilters()).toEqual(INITIAL_JOB_FILTERS);
});

// Every other reset inside Clear Filters stays intact.
test("clearing resets the remaining filters and pagination", () => {
  const cleared = clearedJobFilters();
  expect(cleared.searchQuery).toBe("");
  expect(cleared.selectedCountry).toBe("all");
  expect(cleared.selectedLocation).toBe("all");
  expect(cleared.selectedRoleType).toBe("all");
  expect(cleared.experienceFilter).toBe("all");
  expect(cleared.salaryFilter).toBe("all");
  expect(cleared.workTypeFilter).toBe("all");
  expect(cleared.selectedSources).toEqual([]);
  expect(cleared.currentPage).toBe(1);
});

// KAN-444: the active-filter badge counts each open filter once and each source once.
test("no filters active counts zero", () => {
  expect(countActiveJobFilters(INITIAL_JOB_FILTERS)).toBe(0);
});

test("a search term counts as one active filter", () => {
  expect(countActiveJobFilters({ ...INITIAL_JOB_FILTERS, searchQuery: "pm" })).toBe(1);
});

test("each single-select filter counts once", () => {
  expect(countActiveJobFilters({ ...INITIAL_JOB_FILTERS, selectedRoleType: "technical" })).toBe(1);
  expect(countActiveJobFilters({ ...INITIAL_JOB_FILTERS, selectedCountry: "USA" })).toBe(1);
  expect(countActiveJobFilters({ ...INITIAL_JOB_FILTERS, selectedLocation: "Boston" })).toBe(1);
  expect(countActiveJobFilters({ ...INITIAL_JOB_FILTERS, experienceFilter: "more5" })).toBe(1);
  expect(countActiveJobFilters({ ...INITIAL_JOB_FILTERS, salaryFilter: "more18" })).toBe(1);
  expect(countActiveJobFilters({ ...INITIAL_JOB_FILTERS, workTypeFilter: "remote" })).toBe(1);
});

test("a date range counts once whether one or both bounds are set", () => {
  const start = new Date(2026, 0, 5);
  const end = new Date(2026, 0, 20);
  expect(countActiveJobFilters({ ...INITIAL_JOB_FILTERS, startDate: start })).toBe(1);
  expect(countActiveJobFilters({ ...INITIAL_JOB_FILTERS, endDate: end })).toBe(1);
  expect(countActiveJobFilters({ ...INITIAL_JOB_FILTERS, startDate: start, endDate: end })).toBe(1);
});

test("every selected source adds its own count", () => {
  expect(countActiveJobFilters({
    ...INITIAL_JOB_FILTERS,
    selectedSources: ["Kforce", "Mondo", "Motion Recruitment"],
  })).toBe(3);
});

test("mixed filters add up (3 active example)", () => {
  expect(countActiveJobFilters({
    ...INITIAL_JOB_FILTERS,
    searchQuery: "oracle",
    selectedCountry: "Canada",
    selectedSources: ["TEKsystems"],
  })).toBe(3);
});

test("clearing the filters drops the active count back to zero", () => {
  const cleared = clearedJobFilters();
  expect(countActiveJobFilters(cleared)).toBe(0);
});
