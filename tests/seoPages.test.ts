import { test, expect } from "bun:test";
import { SEO_PAGES, renderSeoPageIntoShell, stripSeoPrerender } from "../src/lib/seoPages";

const SHELL = `<!doctype html><html lang="en"><head>
<title>Ghost Site Title</title>
<meta name="description" content="Ghost site description" />
<link rel="canonical" href="https://www.zerotopmconsultant.com/" />
<meta property="og:title" content="Ghost Site Title" />
<meta property="og:description" content="Ghost site description" />
<meta property="og:url" content="https://www.zerotopmconsultant.com/" />
<meta name="twitter:title" content="Ghost Site Title" />
<meta name="twitter:description" content="Ghost site description" />
</head><body><div id="root"></div></body></html>`;

const pageFor = (route: string) => {
  const page = SEO_PAGES.find((entry) => entry.route === route);
  if (!page) throw new Error(`no prerender page for ${route}`);
  return page;
};

// KAN-474: every key public route must ship a readable static file.
test("all key public routes get a prerendered file", () => {
  const routes = SEO_PAGES.map((page) => page.route);
  for (const route of [
    "/",
    "/free-workshop",
    "/are-you-ready-to-pivot-to-pm-consulting",
    "/about",
    "/proof",
    "/book-session",
    "/pm-job-board-canada",
    "/ai-bi-fintech-pm-job-alerts-repo",
    "/pm-strategy-guide-pdf",
    "/2026-bi-fintech-consulting-roadmap-pdf-unlock",
  ]) {
    expect(routes).toContain(route);
  }
});

// The private intake page must never be written into dist/ as static HTML.
test("private /seat intake page is never prerendered", () => {
  expect(SEO_PAGES.some((page) => page.route.includes("seat"))).toBe(false);
  expect(SEO_PAGES.some((page) => page.file.includes("seat"))).toBe(false);
});

test("each page carries its own title, description and canonical", () => {
  for (const page of SEO_PAGES) {
    expect(page.file.endsWith(".html")).toBe(true);
    expect(page.canonical.startsWith("https://www.zerotopmconsultant.com")).toBe(true);
    expect(page.body.length).toBeGreaterThan(400);
    if (page.route !== "/") {
      expect(page.title).toInclude("Zero to PM Consultant");
      expect(page.description!.length).toBeGreaterThan(60);
    }
  }
});

test("page copy is real: workshop, quiz and board headlines are present", () => {
  expect(pageFor("/free-workshop").body).toInclude(
    "Free Live Workshop: How to Land $10k&ndash;$18k/mo Data &amp; AI Orchestration PM Consulting Contracts",
  );
  expect(pageFor("/are-you-ready-to-pivot-to-pm-consulting").body).toInclude(
    "Are You Ready to Pivot Into $10,000&ndash;$18,000/Mo Data &amp; AI PM Consulting Contracts?",
  );
  expect(pageFor("/ai-bi-fintech-pm-job-alerts-repo").body).toInclude(
    "Data &amp; AI Orchestration PM Consulting Contracts Job Board",
  );
  expect(pageFor("/ai-bi-fintech-pm-job-alerts-repo").body).toInclude("48 hours");
  expect(pageFor("/proof").body).toInclude("$11k/mo after tax");
  expect(pageFor("/2026-bi-fintech-consulting-roadmap-pdf-unlock").body).toInclude(
    "Your complete guide to becoming a 10k/mo+ consultant",
  );
});

test("readable content lands inside the root div and head meta is rewritten", () => {
  const html = renderSeoPageIntoShell(SHELL, pageFor("/proof"));
  const root = html.match(/<div id="root">([\s\S]*?)<\/div>/);
  expect(root).not.toBeNull();
  expect(root![1]).toInclude("Student Results");
  expect(html).toInclude("<title>Student Results | Zero to PM Consultant</title>");
  expect(html).toInclude('rel="canonical" href="https://www.zerotopmconsultant.com/proof"');
  expect(html).toInclude('property="og:url" content="https://www.zerotopmconsultant.com/proof"');
});

// The homepage keeps the Ghost-provided build-time title/description.
test("homepage keeps the shell title and description", () => {
  const html = renderSeoPageIntoShell(SHELL, pageFor("/"));
  expect(html).toInclude("<title>Ghost Site Title</title>");
  expect(html).toInclude('name="description" content="Ghost site description"');
  expect(html).toInclude("Zero-To-PM-Consultant");
  expect(html).toInclude('href="/free-workshop"');
});

// Idempotency: re-running the pass must not stack duplicate content or meta.
test("re-running the prerender pass does not duplicate content", () => {
  const once = renderSeoPageIntoShell(SHELL, pageFor("/free-workshop"));
  const twice = renderSeoPageIntoShell(once, pageFor("/free-workshop"));
  expect(twice).toBe(once);
  expect(twice.match(/<title>/g)!.length).toBe(1);
  expect(stripSeoPrerender(once)).toBe(stripSeoPrerender(twice));
});
