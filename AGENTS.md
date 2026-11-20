# Architecture rules

- Keep timestamp-based Kit unlock expiry in `jobBoardGate` and the pre-React HTML loader aligned; subscribe contract links to expiry changes so stale link attributes cannot bypass the signup prompt, while route-level popup suppression stays independent.

- Keep job source aliases, qualifier cleanup, and source/company matching in `src/lib/jobSourceMatching.ts`; use its resolver for both dropdown membership and filtering, accepting new Sources-column values but only known agency aliases from Company so end-client names never pollute Sources and recruiter attribution remains preserved.

- Keep Student Intake validation and password-digest verification in a focused library module so submission requirements can be tested independently of rendering.
- Treat the shared-password session gate as a convenience screen, not authorization; private resume access remains controlled by database and storage policies.
- Keep country/location normalization in `src/lib/countryUtils.ts` and import it from job-board filters and analytics charts, so the dropdown, filtering and charts always agree on one country label instead of each re-implementing location string matching.
- Keep job-board filter defaults and the Clear Filters reset in `src/lib/jobFilterState.ts` and import them from the page, so the unbounded date range that shows all jobs stays testable without rendering the board.
- Keep timeline bucketing and click ranges in `src/lib/jobTimeline.ts` so chart counts and inclusive table date ranges stay aligned and independently testable.
- Give small icons and logos explicit pixel radii (e.g. `rounded-[4px]`) instead of `rounded-sm`/`rounded-md`, because this theme derives `borderRadius` from `--radius` (1.25rem) so `rounded-sm` resolves to 16px and renders a small square image as a circle.
- Keep readiness quiz progression in `src/lib/quizScreens.ts` (0 = landing, 1..N = questions, N+1 = lead capture, N+2 = results) and derive the current question from that number, so progression stays independently testable.
- Keep quiz question weights and answer-derived score and qualification in `src/lib/quizDiagnostic.ts`; recompute from the answer map so answer changes cannot double-count points or leave stale qualification.
- Share quiz lead schema definitions from the quiz delivery function directory with the browser via injected Zod, so both runtimes enforce identical contact and payload validation without importing browser code into deployed functions.
- Deliver quiz leads through the server-side function to the user-selected public n8n webhook; bound waiting and retain results when delivery is unavailable.
- Keep quiz result tiers and qualification routing in `src/lib/quizResults.ts`; the results component mounts the calendar only on the Q1-qualified branch, independently of score.
- Reuse `CalendlyInlineWidget` across booking thank-you and quiz results; initialize after script load and validate resize message origin/source so delayed mounting and dynamic sizing remain safe.
- Keep crawlable page copy in `src/lib/seoPages.ts` and let the `prerender-seo-pages` Vite build plugin write it into `dist/` inside `<div id="root">`; never prerender `/seat`, keep the injected block hidden by `.seo-prerender` so humans see the React app only, and reuse that module instead of adding browser-based prerendering.
- With Vercel clean URLs enabled, keep the non-file SPA fallback pointed at `/`, not `/index.html`; filesystem-first rewrites preserve prerendered pages and avoid extension-based fallback failures.- Keep Resume Modifier password-digest checks, submission validation and in-browser DOCX/PDF text extraction in `src/lib/resumeModifier.ts` so they stay testable without rendering; the password gate is a convenience screen, and the webhook must re-verify the password.
