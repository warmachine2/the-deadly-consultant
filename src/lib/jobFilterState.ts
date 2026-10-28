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

// KAN-444: how many filters are actually narrowing the feed right now.
// Each single-select filter counts once, every selected source counts once, and
// a date range (either bound set) counts once. Used for the "N Active" badge and
// the mobile "Clear All Filters" shortcut, so both always agree with the board.
export const countActiveJobFilters = (
  filters: Pick<
    JobFilterState,
    | "searchQuery"
    | "selectedCountry"
    | "selectedLocation"
    | "selectedRoleType"
    | "startDate"
    | "endDate"
    | "experienceFilter"
    | "salaryFilter"
    | "workTypeFilter"
    | "selectedSources"
  >,
): number => {
  let count = 0;
  if (filters.searchQuery !== "") count += 1;
  if (filters.selectedRoleType !== "all") count += 1;
  if (filters.selectedCountry !== "all") count += 1;
  if (filters.selectedLocation !== "all") count += 1;
  if (filters.experienceFilter !== "all") count += 1;
  if (filters.salaryFilter !== "all") count += 1;
  if (filters.workTypeFilter !== "all") count += 1;
  if (filters.selectedSources.length > 0) count += filters.selectedSources.length;
  if (filters.startDate || filters.endDate) count += 1;
  return count;
};
