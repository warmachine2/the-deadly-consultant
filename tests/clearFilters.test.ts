import { test, expect } from "bun:test";
import { startOfMonth, endOfMonth } from "date-fns";
import { INITIAL_JOB_FILTERS, clearedJobFilters } from "../src/lib/jobFilterState";

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
