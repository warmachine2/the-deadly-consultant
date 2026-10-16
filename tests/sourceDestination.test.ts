import { test, expect } from "bun:test";
import { getSourceDestinationUrl } from "../src/pages/JobAlertsPage";

const IG_SEARCH = "https://insightglobal.com/jobs/search/all/project?page=1&size=10";
const TEK_CAREERS = "https://careers.teksystems.com/us/en/search-results";

// Insight Global: direct postings live under /jobs/, so /job/ links must be rewritten to return 200 OK.
test("Insight Global rewrites /job/<uuid> links to /jobs/<uuid>", () => {
  expect(
    getSourceDestinationUrl(
      "Insight Global",
      "https://www.insightglobal.com/job/8f2c1e9a-1234-4abc-9def-0123456789ab"
    )
  ).toBe("https://www.insightglobal.com/jobs/8f2c1e9a-1234-4abc-9def-0123456789ab");
});

test("Insight Global leaves already-normalized /jobs/ links untouched", () => {
  const direct = "https://www.insightglobal.com/jobs/8f2c1e9a-1234-4abc-9def-0123456789ab";
  expect(getSourceDestinationUrl("Insight Global", direct)).toBe(direct);
});

test("Insight Global without a job link falls back to the project search", () => {
  expect(getSourceDestinationUrl("Insight Global", "")).toBe(IG_SEARCH);
  expect(getSourceDestinationUrl("Insight Global")).toBe(IG_SEARCH);
  expect(getSourceDestinationUrl("Insight Global Dallas", "   ")).toBe(IG_SEARCH);
});

// TEKsystems: prefer the posting link, otherwise the public careers search.
test("TEKsystems uses the direct job link when present", () => {
  const direct = "https://careers.teksystems.com/us/en/job/123456/data-orchestration-project-manager";
  expect(getSourceDestinationUrl("TEKsystems", direct)).toBe(direct);
  expect(getSourceDestinationUrl("TEKsystems Austin", direct)).toBe(direct);
});

test("TEKsystems without a job link falls back to the careers search", () => {
  expect(getSourceDestinationUrl("TEKsystems", "")).toBe(TEK_CAREERS);
  expect(getSourceDestinationUrl("TEKsystems")).toBe(TEK_CAREERS);
  expect(getSourceDestinationUrl("TEK Systems")).toBe(TEK_CAREERS);
});

// Hassan's Recruiter Network listings are attribution-only, never clickable.
test("Hassan's recruiter Network is never clickable", () => {
  expect(getSourceDestinationUrl("Hassan's recruiter Network", "https://example.com/job/1")).toBeNull();
  expect(getSourceDestinationUrl("Hassan's Email")).toBeNull();
});
