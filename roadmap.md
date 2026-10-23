# KAN-364 Student Intake

- [x] Make retired intake columns nullable.
- [x] Update titles, password gate, and seven-field submission.
- [x] Verify validation and password behavior in preview (four tests passed; desktop/mobile checked; no live submission sent).

# KAN-385 Critical Resources videos

- [x] Add Video #3 "PM Consulting Secrets - How to make $10k/mo+" and remove the Coming Soon placeholder.
- [x] Center the third card on desktop, stack on mobile (typecheck passed; thank-you page checked on desktop and phone).
- [x] Add the third video's article link to /pm-consulting-secrets-how-to-make-10kmo (verified the gold link renders and the article opens).

# Workshop join page: per-day Teams rooms

- [x] Add Monday, Wednesday and Saturday session cards with their own Teams link, Meeting ID and Passcode.
- [x] Keep headline, join instructions, and Roadmap / Job Alerts quick links (desktop and phone checked in preview).

# Job board: TEKsystems source

- [x] Save the TEKsystems logo to public/ and register the source (description, aliases, "TEKsystems - Austin" label, badge logo, Network Health order and normalization).
- [x] Verify in preview: dropdown shows "TEKsystems - Austin", live card badge renders the logo on the white chip; typecheck and build clean.

# Job board: hide "About" banner for placeholder company info

- [x] Filter N/A / none / null / undefined out of company-info bullets and hide the banner when nothing valid remains.
- [x] Verify Nomura (N/A) renders no banner, LanceSoft keeps its bullets, and NTT Data keeps its four fallback bullets (desktop preview; 8 tests pass; build OK).

# Network Health: Kforce source

- [x] Add "Kforce" to SOURCE_ORDER (17 sources) and to normalizeSourceName; export both for unit testing.
- [x] Add tests/networkHealth.test.ts for Kforce aliases and the 17-source order (11 tests pass; typecheck and build clean).
- [x] Verify the live panel shows Kforce between Mondo and Peterson Technology Partners with a real Last ingest date (desktop preview).

# Job board: Insight Global and TEKsystems badge routing

- [x] Export getSourceDestinationUrl; Insight Global uses the direct posting link with /job/ normalized to /jobs/, falling back to the project search; TEKsystems uses its link, else the careers search.
- [x] Add tests/sourceDestination.test.ts for the rewrite, fallbacks and Hassan non-clickability (17 tests pass; typecheck and build clean).
- [x] Verify live badges in preview: Insight Global resolves to /jobs/<uuid> (200 OK, while /job/ 404s), TEKsystems uses its direct posting, Hassan stays a plain span (17 tests pass; typecheck and build clean).

# Job board: country normalization

- [x] Add src/lib/countryUtils.ts (normalizeCountry, extractChartCountry) and use it for the Country dropdown options, the country filter and the analytics chart buckets.
- [x] Add tests/countryNormalization.test.ts for US/Canada/other-country variants, chart buckets and the absence of "NY)"/"TX)" fragments (22 tests pass; typecheck clean).
- [x] Verify live: dropdown lists Canada, USA, Brazil, Colombia, India, Peru, Portugal, Thailand, United Kingdom with no state fragments, and USA/Canada/Peru filters return only matching jobs.

# Job board: Clear Filters date reset (KAN-413)

- [x] Add src/lib/jobFilterState.ts (INITIAL_JOB_FILTERS, clearedJobFilters) so the page load and Clear Filters share one unbounded date default.
- [x] Clear Filters now sets startDate/endDate to undefined instead of the current month; all other resets unchanged.
- [x] Add tests/clearFilters.test.ts for the undefined default, the cleared range, and the other resets (27 tests pass; typecheck clean).
- [x] Verify live: 1162 jobs on load, 123 after a start-date filter, back to 1162 with empty Start/End after Clear Filters.

# Hero: contracts banner above workshop CTA

- [x] Move the "Open PM Consulting Contracts" banner from below the bullet list to directly above the workshop CTA card, aligned to its width (desktop and phone checked in preview).

# Job board: TES – The Employment Solution (KAN-239)

- [x] Add public/tes-logo.svg (purple #493083 wordmark, viewBox 0 0 160 40) and register TES in sourceDescriptions, sourceNameMap (TES / The Employment Solution / full name), sourceDisplayNames and the SourceBadge logo slot.
- [x] Add TES to NetworkHealthPanel SOURCE_ORDER (after TEKsystems, 18 sources) and normalizeSourceName, with tests for the aliases and for the loose "tes" match not stealing other agencies (29 tests pass; typecheck clean).
- [x] Verify live: Sources search lists the option, the filtered board shows TES jobs with the logo badge, and the Sources panel lists TES with its last ingest date.

# Job board: Motion Recruitment (19th source)

- [x] Register Motion Recruitment in sourceDescriptions, sourceNameMap (Motion Recruitment / Motion / lowercase), sourceDisplayNames ("Motion Recruitment - San Francisco") and the SourceBadge logo slot, using the official `public/motion-recruitment-logo.jpg` (dark slate tile, white slanted M) rendered at `h-6 rounded-[4px]`.
- [x] Add Motion Recruitment to NetworkHealthPanel SOURCE_ORDER (after TES, 19 sources) and normalizeSourceName, with tests for the aliases, the loose "motion" match not stealing other agencies, and badge routing (direct link else motionrecruitment.com/tech-jobs).
- [x] Verify live: Sources search lists the option, the filtered board shows the Motion job with its logo badge, and the Sources panel lists Motion Recruitment 19th with last ingest 2026-10-22 (33 tests pass; typecheck and build clean).

# Job board: TES logo swap to the official image

- [x] Save the official TES mark (purple/teal interlocking ribbon on white) as `public/tes-logo.jpg` and point `tesLogoUrl` at it; the superseded `public/tes-logo.svg` is removed.
- [x] Render the TES badge at `h-6 w-auto object-contain rounded-[4px]` (explicit radius because `rounded-sm` resolves to 16px in this theme and turns a 24px square into a circle).
- [x] Verify live: Sources search lists "TES – The Employment Solution", the filtered job shows the logo badge on desktop and phone, `/tes-logo.jpg` serves HTTP 200 (33 tests pass; build clean).

# Job board: Motion Recruitment company overview fallback

- [x] Add four fixed Motion Recruitment overview bullets when the sheet gives no company info or only one bullet (same pattern as NTT Data); two or more real bullets still win.
- [x] Export parseCSV and add tests/companyInfo.test.ts cases for the empty/single-bullet fallback, the two-bullet pass-through, the unchanged NTT Data bullets, and no invented bullets for other sources (38 tests pass; typecheck and build clean).
- [x] Verify live: the "About Motion Recruitment Client" banner renders all four bullets on desktop with no clipping.


# Job board: cascading City dropdown by Country

- [x] Build city-to-country map in the location useMemo and derive `availableCities` (all cities when Country = All; country-scoped otherwise, matching the 'Other' filter rule).
- [x] Reset `selectedLocation` to 'all' automatically when it's missing from the selected country's city list; "All Cities" remains the first option.
- [x] Verify live: Canada/USA lists are country-scoped, Boston (USA) resets to "All Cities" after switching to Canada (38 tests pass; typecheck and build clean).

# Job board: experience filter parsing

- [x] Extract `parseExperienceYears` (range "5-7 years" -> 5, "5+ years"/"3 years" simple match, senior/lead/principal/director/head without a number default to 5, otherwise 0) and use it in the experience filter.
- [x] Add tests/experienceParsing.test.ts covering ranges, en dash, "to", plus, senior defaults and explicit-number precedence (53 tests pass; typecheck clean).

# Job Analytics: recent timeline

- [x] Limit timeline to active weekly buckets in the last 90 days, excluding legacy dates without changing default board filters.
- [x] Verify weekly counts and inclusive date boundaries (60 tests pass; preview build clean); live Oct 19 point sets Oct 19–23 and table displays jobs within that week.

# Job Analytics: visible "Other" country bar + Active Sources metric

- [x] Give the country bars a minimum visual height (minBarLength 14) and color "Other" muted violet (#8B5CF6) so a 13-job bar is visible, hoverable and clickable beside 1,000-job bars.
- [x] Replace the static "5 Role Types" card with a dynamic "Active Sources" count (src/lib/jobSources.ts + tests/jobSources.test.ts).
- [x] Verify live: clicking the violet bar filters the table 1561 -> 13 jobs (Portugal, India, Thailand, Peru), card 4 reads "20 Active Sources" (63 tests pass; build OK).

# Job board: card state leak + pagination overflow (audit fixes)

- [x] Key job cards and table rows with a stable identifier (`getJobRowKey` in JobAlertsPage.tsx: Job ID, then job link, then row position) so an expanded card or open video drawer no longer follows a card onto the next page; the row position is appended because the live feed repeats Job IDs across scraped rows.
- [x] Clamp `currentPage` back to 1 when the feed shrinks below it, and reset to page 1 when Refresh is clicked.
- [x] Verify live: card 1 collapsed on page 1 stays expanded on page 2; Refresh to a 5-job feed lands on page 1 with rows; table and mobile paging render with no duplicate-key warnings (69 tests pass; typecheck and build clean).

# Job board: corrupt-cache hardening

- [x] Validate localStorage hydration in JobAlertsPage.tsx (`asText`, `sanitizeCachedJob`, `sanitizeCachedJobs`): non-object rows and role-less rows are dropped, every field is coerced to a string, and `companyInfo` is kept only when it is a real array of bullets.
- [x] Make card, table and filter accessors null-safe: `asText(...)` for role, company, duties, location, term, source, recruiter fields and the sort comparator; `Array.isArray` guard on the About banner; hardened date parsing, earnings/experience/city/work-mode parsing and the country helpers in `src/lib/countryUtils.ts`.
- [x] Verify live: seeding the cache with null roles, a string `companyInfo`, numbers and junk entries still renders 4 cards and 4 table rows with no runtime error; live data still shows 20 cards, the About banner and 20 table rows per page (76 tests pass; typecheck and build clean).

# Country classification test coverage

- [x] Add explicit unit tests for the requested locations: "San Francisco, CA", "Dallas, TX", "Boston, MA" → USA; "London, ON", "Toronto, ON", "Vancouver, BC" → Canada; "Lisbon, Portugal" and "Lima, Peru" → chart bucket Other with their clean country names kept for the filter (tests/countryNormalization.test.ts).
- [x] Confirm no regressions: 83 tests pass across 11 files, typecheck and build clean.

# Salary conversion: single-amount regression tests

- [x] Add unit cases to tests/salaryConversion.test.ts for "$120k/yr" -> "$10,000/mo USD", "$120k - $140k/yr USD" -> "$10,000 - $11,667/mo USD", "$10k/mo" -> "$10,000/mo USD", "$75/hr" -> "$13,680/mo USD" (75 * 1.14 * 160), "$150,000/yr" -> "$12,500/mo USD", each also asserting getMonthlyAmount reads the same normalized amount.
- [x] Confirm no regressions: 94 tests pass across 12 files, typecheck and build clean.

