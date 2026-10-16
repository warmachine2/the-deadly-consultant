// Shared job-board filter state (KAN-413).
//
// The board loads with an unbounded date range (both bounds undefined) so every
// job is visible, and "Clear Filters" must return to that exact same state
// instead of re-locking the range to the current month.

export type JobFilterState = {
  searchQuery: string;
  selectedCountry: string;
  selectedLocation: string;
  selectedRoleType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  experienceFilter: string;
  salaryFilter: string;
  workTypeFilter: string;
  selectedSources: string[];
  currentPage: number;
};

export const INITIAL_JOB_FILTERS: JobFilterState = {
  searchQuery: "",
  selectedCountry: "all",
  selectedLocation: "all",
  selectedRoleType: "all",
  startDate: undefined,
  endDate: undefined,
  experienceFilter: "all",
  salaryFilter: "all",
  workTypeFilter: "all",
  selectedSources: [],
  currentPage: 1,
};

// Clearing returns a fresh copy of the initial state, so the date bounds are
// never rebuilt from "today".
export const clearedJobFilters = (): JobFilterState => ({
  ...INITIAL_JOB_FILTERS,
  selectedSources: [],
});
