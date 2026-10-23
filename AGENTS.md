# Architecture rules

- Keep Student Intake validation and password-digest verification in a focused library module so submission requirements can be tested independently of rendering.
- Treat the shared-password session gate as a convenience screen, not authorization; private resume access remains controlled by database and storage policies.
- Keep country/location normalization in `src/lib/countryUtils.ts` and import it from job-board filters and analytics charts, so the dropdown, filtering and charts always agree on one country label instead of each re-implementing location string matching.
- Keep job-board filter defaults and the Clear Filters reset in `src/lib/jobFilterState.ts` and import them from the page, so the unbounded date range that shows all jobs stays testable without rendering the board.
- Keep timeline bucketing and click ranges in `src/lib/jobTimeline.ts` so chart counts and inclusive table date ranges stay aligned and independently testable.
- Give small icons and logos explicit pixel radii (e.g. `rounded-[4px]`) instead of `rounded-sm`/`rounded-md`, because this theme derives `borderRadius` from `--radius` (1.25rem) so `rounded-sm` resolves to 16px and renders a small square image as a circle.