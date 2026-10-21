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
