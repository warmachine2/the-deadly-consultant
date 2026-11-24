/**
 * Static, crawlable HTML for the site's public pages.
 *
 * Non-JavaScript crawlers (Googlebot, Bingbot, GPTBot, ClaudeBot, ...) only ever
 * receive the empty `<div id="root"></div>` shell from a Vite SPA. This module
 * builds real semantic HTML for each key public route; vite.config.ts injects it
 * into `<div id="root">` inside `dist/` at the end of the build, and
 * `.seo-prerender { display: none }` in index.css keeps it out of human sight so
 * the React app stays pixel-identical.
 *
 * Every sentence below is copied from the shipped page copy in src/pages and
 * src/components - no invented numbers or claims.
 */

const SITE_ORIGIN = "https://www.zerotopmconsultant.com";
const BRAND = "Zero to PM Consultant";

export interface SeoPage {
  /** Public path this file is served from. */
  route: string;
  /** File name written into dist/. */
  file: string;
  /** Omitted when the shell's build-time (Ghost) title/description should be kept. */
  title?: string;
  description?: string;
  /** Absolute canonical URL (the app's own redirect targets, not the alias). */
  canonical: string;
  body: string;
}

const origin = (path: string) => `${SITE_ORIGIN}${path}`;

const nav = (items: Array<[string, string]>) =>
  `<nav aria-label="Site"><ul>${items
    .map(([href, label]) => `<li><a href="${href}">${label}</a></li>`)
    .join("")}</ul></nav>`;

const footer = `<footer><p>&copy; 2026 ${BRAND}. All rights reserved.</p></footer>`;

const PROGRAM_POINTS = [
  "Escape AI job vaporization.",
  "Master PMP/PSM/CPMAI trifecta.",
  "Build $60k PPM BI tools for your portfolio.",
  "Orchestrate AI Deployment/BI projects. Learn front-line PM consulting skills.",
  "Land $10k/mo+ gigs - faster, easier.",
  "Become a Certified Professional in Project Management &amp; AI Deployment Projects.",
];

const QUALIFIER_OPTIONS = [
  "Professional with 3+ years experience, currently under-earning, want $10k/mo+ PM contracts",
  "Already in PM / consulting and looking for better contracts",
  "Less than 3 years of professional experience",
  "Just researching / not sure yet",
];

const DIAGNOSTIC_COPY =
  "Book your private 15-Minute Experience Diagnostic &amp; Resume Audit directly with Hassan. We will pull up your LinkedIn live, match your background to active $85&ndash;$120/hr contracts on the board, and check if you qualify for one of our 10 Founding Case-Study Scholarships (50% Off).";

const BOARD_BODY = `<main class="container mx-auto px-4 pt-24">
<header>
<h1>Data &amp; AI Orchestration PM Consulting Contracts Job Board</h1>
<p>The Most Comprehensive Data &amp; AI Orchestration PM Consulting Contracts Job Board in North America</p>
<p>⚠️ Skip roles older than 48 hours &mdash; recruiters submit top candidates within this window.</p>
</header>
<section>
<h2>Search the board</h2>
<p>Search by role, duties, or company, then filter by source, city, country, work type and experience.</p>
<p><a href="/book-session">Free 10-Min $10k/mo Path Call</a></p>
<p>Map your career pivot and discover if my Data &amp; AI Orchestration PM Consultant Academy can help you land these roles &mdash; a personal one-on-one call with me</p>
</section>
<section>
<h2>About this board</h2>
<p>Live recruiter-sourced Data &amp; AI Orchestration PM contracts, monitored daily and grouped by recruiting network so you can see who is actually hiring right now.</p>
</section>
${nav([
  ["/", "Home"],
  ["/free-workshop", "Reserve My Free Workshop Spot"],
  ["/are-you-ready-to-pivot-to-pm-consulting", "Take the PM Consulting Readiness Quiz"],
  ["/proof", "Student Results"],
  ["/about-post", "About"],
])}
</main>
${footer}`;

const ROADMAP_BODY = `<main class="container mx-auto px-4 pt-24">
<header>
<h1>2026 Data &amp; AI Orchestration PM Roadmap &ndash; Unlock Your $10k/mo Pivot</h1>
<p>Your complete guide to becoming a 10k/mo+ consultant</p>
</header>
<section>
<h2>What the roadmap covers</h2>
<p>Stuck grinding $3k-$4k/mo despite your engineering skills? AI&rsquo;s eating jobs&mdash;pivot to Data &amp; AI Orchestration PM roles for $17k/mo+ remote freedom. Get the cracked blueprint: mindset, hybrid PM, vendor-grade tools, and certs (PMP, PSM, CPMAI).</p>
</section>
<section>
<h2>Ready to Get Started?</h2>
<p>Book a free strategy session to walk through the roadmap and map your personalized pivot plan.</p>
<p><a href="/book-session">Book Your Free Strategy Session with Roadmap Walkthrough</a></p>
</section>
${nav([
  ["/", "Home"],
  ["/free-workshop", "Reserve My Free Workshop Spot"],
  ["/ai-bi-fintech-pm-job-alerts-repo", "Browse open contracts"],
  ["/proof", "Student Results"],
  ["/about-post", "About"],
])}
</main>
${footer}`;

const ABOUT_BODY = `<main class="container mx-auto px-4 pt-24">
<article>
<header>
<p>Zero to PM Consultant &middot; About</p>
<h1>About Hassan Hammer Khan</h1>
<p>By Hassan &ldquo;Hammer&rdquo; Khan B.Eng., PMP &mdash; Principal PM Consultant &amp; Founder, ${BRAND}</p>
</header>
<section>
<h2>Who he is</h2>
<p>Hassan &ldquo;Hammer&rdquo; Khan B.Eng., PMP is the founder of ${BRAND}. He went from $3.5k/mo to $18k/mo take-home using the exact roadmap and the hidden job board he now teaches, and he helps professionals with 3+ years of experience pivot into $10k&ndash;$18k/mo Data &amp; AI Orchestration PM consulting contracts.</p>
</section>
<section>
<h2>What he teaches</h2>
<ul>${PROGRAM_POINTS.map((point) => `<li>${point}</li>`).join("")}</ul>
</section>
<section>
<h2>Read the full bio</h2>
<p>The full about post, with the complete story and article index, lives at /about-post.</p>
<p><a href="/about-post">Read the full about post</a></p>
</section>
${nav([
  ["/", "Home"],
  ["/proof", "Student Results"],
  ["/free-workshop", "Reserve My Free Workshop Spot"],
  ["/are-you-ready-to-pivot-to-pm-consulting", "Take the PM Consulting Readiness Quiz"],
  ["/ai-bi-fintech-pm-job-alerts-repo", "Browse open contracts"],
])}
</article>
</main>
${footer}`;

const HOME_BODY = `<header class="container mx-auto px-4 pt-24">
<p>Zero-To-PM-Consultant</p>
<h1>Zero-To-PM-Consultant &mdash; Data &amp; AI Orchestration PM Consulting</h1>
<p>Pivot into high-value consulting contracts.</p>
<p>How experienced professionals land $10k&ndash;$18k/mo Data and AI Orchestration PM contracts. Includes the 90-day roadmap when you register.</p>
${nav([
  ["/free-workshop", "Reserve My Free Workshop Spot"],
  ["/are-you-ready-to-pivot-to-pm-consulting", "Take the PM Consulting Readiness Quiz"],
  ["/ai-bi-fintech-pm-job-alerts-repo", "Browse open contracts"],
  ["/proof", "Student Results"],
  ["/about-post", "About"],
  ["/book-session", "Book a strategy session"],
])}
</header>
<main class="container mx-auto px-4">
<section>
<h2>The 90-day pivot to Data &amp; AI Orchestration PM consulting</h2>
<ul>${PROGRAM_POINTS.map((point) => `<li>${point}</li>`).join("")}</ul>
</section>
<section>
<h2>Open PM Consulting Contracts</h2>
<p>Live recruiter-sourced Data &amp; AI Orchestration PM contracts.</p>
<p><a href="/ai-bi-fintech-pm-job-alerts-repo">Browse open contracts</a></p>
</section>
<section>
<h2>Student Results &mdash; Real Pivots, Real Contracts</h2>
<p>Gary went from real estate administration to $11k/mo after tax. Resume first &mdash; not studying first. Recruiters reached out while he was still in the program.</p>
<p>Shiva: &ldquo;Three $10k/mo PM interviews &mdash; while still mid-program.&rdquo;</p>
<p>One student&rsquo;s result. Your outcome depends on experience, market, and work inside the program.</p>
<p><a href="/proof">See Student Results</a></p>
</section>
<section>
<h2>2026 Data &amp; AI Orchestration PM Roadmap &ndash; Unlock Your $10k/mo Pivot</h2>
<p>Stuck grinding $3k-$4k/mo despite your engineering skills? AI&rsquo;s eating jobs&mdash;pivot to Data &amp; AI Orchestration PM roles for $17k/mo+ remote freedom. Get the cracked blueprint: mindset, hybrid PM, vendor-grade tools, and certs (PMP, PSM, CPMAI).</p>
<p><a href="/2026-bi-fintech-consulting-roadmap-pdf-unlock">Unlock Full Roadmap</a></p>
</section>
<section>
<h2>About Hassan Hammer Khan</h2>
<p>Hassan &ldquo;Hammer&rdquo; Khan B.Eng., PMP is Principal PM Consultant &amp; Founder of ${BRAND}. He went from $3.5k/mo to $18k/mo take-home with the roadmap and hidden job board he now teaches.</p>
<p><a href="/about-post">About Hassan Hammer Khan</a></p>
</section>
<section>
<h2>PM Consulting Readiness Quiz</h2>
<p>Free 3-minute PM consulting readiness audit: check PMP &amp; enterprise contract eligibility (3+ years experience benchmark), audit your resume &amp; portfolio against live $85&ndash;$120/hr GTA &amp; North American specs, and unlock a custom 0&ndash;100 readiness score plus the V5 90-day pivot roadmap PDF.</p>
<p><a href="/are-you-ready-to-pivot-to-pm-consulting">Take the PM Consulting Readiness Quiz</a></p>
</section>
</main>
${footer}`;

const WORKSHOP_BODY = `<main class="container mx-auto px-4 pt-24">
<header>
<h1>Free Live Workshop: How to Land $10k&ndash;$18k/mo Data &amp; AI Orchestration PM Consulting Contracts</h1>
<p>I&rsquo;ll show you the exact roadmap + the hidden job board I used to go from $3.5k/mo to $18k/mo take-home.</p>
</header>
<section>
<h2>Live session times (America/Toronto)</h2>
<ul>
<li>Monday 12:00 PM &ndash; 1:00 PM ET</li>
<li>Wednesday 12:00 PM &ndash; 1:00 PM ET</li>
<li>Saturday 11:00 AM &ndash; 12:00 PM ET</li>
</ul>
</section>
<section>
<h2>What you learn</h2>
<ul>
<li>The exact roadmap + the hidden job board used to go from $3.5k/mo to $18k/mo take-home.</li>
<li>The 90-day roadmap, included when you register.</li>
${PROGRAM_POINTS.map((point) => `<li>${point}</li>`).join("")}
</ul>
</section>
<section>
<h2>How to register</h2>
<p>Reserve My Free Spot &mdash; the registration form asks for First Name (required), Email (required), Phone/WhatsApp, and which option best describes you.</p>
<ul>${QUALIFIER_OPTIONS.map((option) => `<li>${option}</li>`).join("")}</ul>
</section>
<section>
<h2>Have 3+ Years of Professional Experience? Skip the 48-Hour Webinar Wait.</h2>
<p>${DIAGNOSTIC_COPY}</p>
<p><a href="/book-session">Book Private 15-Min Diagnostic Call</a></p>
</section>
${nav([
  ["/", "Home"],
  ["/are-you-ready-to-pivot-to-pm-consulting", "Take the PM Consulting Readiness Quiz"],
  ["/ai-bi-fintech-pm-job-alerts-repo", "Browse open contracts"],
  ["/proof", "Student Results"],
  ["/about-post", "About"],
])}
</main>
${footer}`;

const QUIZ_BODY = `<main class="container mx-auto px-4 pt-24">
<header>
<p>FREE 3-MINUTE PM CONSULTING READINESS AUDIT</p>
<h1>Are You Ready to Pivot Into $10,000&ndash;$18,000/Mo Data &amp; AI PM Consulting Contracts?</h1>
<p>Take this 10-question diagnostic to see if your current work history qualifies for $85&ndash;$120/hr incorporated enterprise contracts&mdash;and uncover the exact packaging gaps keeping recruiters from calling you back.</p>
</header>
<section>
<h2>What the audit checks</h2>
<ul>
<li>Check Your PMP &amp; Enterprise Contract Eligibility (3+ Years Experience Benchmark)</li>
<li>Audit Your Resume &amp; Portfolio Against Live $85&ndash;$120/Hr GTA &amp; North American Specs</li>
<li>Unlock Your Custom 0&ndash;100 Readiness Score + The V5 90-Day Pivot Roadmap PDF</li>
</ul>
</section>
<section>
<h2>Who it&rsquo;s for</h2>
<ul>${QUALIFIER_OPTIONS.map((option) => `<li>${option}</li>`).join("")}</ul>
</section>
<section>
<h2>Start the assessment</h2>
<p>Start My 3-Minute Assessment &mdash; no name or email needed to begin.</p>
<p>Free &amp; Confidential &bull; 4,800+ Live Enterprise Roles Monitored Daily &bull; Trusted by GTA Data &amp; Tech Leaders</p>
</section>
${nav([
  ["/", "Home"],
  ["/free-workshop", "Reserve My Free Workshop Spot"],
  ["/ai-bi-fintech-pm-job-alerts-repo", "Browse open contracts"],
  ["/proof", "Student Results"],
  ["/about-post", "About"],
])}
</main>
${footer}`;

const PROOF_BODY = `<main class="container mx-auto px-4 pt-24">
<header>
<p>Zero to PM Consultant &middot; Proof</p>
<h1>Student Results</h1>
<p>Professionals with 3+ years of experience. Same path: Data &amp; AI Orchestration PM work, resume first, then the contracts.</p>
</header>
<section>
<h2>Gary &mdash; real estate administration &rarr; junior PM path</h2>
<p>3 yrs real estate admin &middot; Resume first &mdash; not studying first &middot; Recruiters while still in the program &middot; $11k/mo after tax</p>
<blockquote>&ldquo;We didn&rsquo;t start with studying. We remade my resume to how it would eventually look. Before I knew it, recruiters were reaching out - while I was still working through the program.&rdquo;</blockquote>
<ul>
<li>6 months in the accelerator, part-time</li>
<li>PMP and PSM complete; CPMAI in progress</li>
<li>Reverse learning: job skills, tools, and portfolio first; certifications after</li>
</ul>
</section>
<section>
<h2>Shiva &mdash; PM accelerator student &rarr; active interview pipeline</h2>
<p>Mid-program &middot; 3 PM interviews &middot; $10k/mo opportunities</p>
<blockquote>&ldquo;Three $10k/mo PM interviews &mdash; while still mid-program.&rdquo;</blockquote>
</section>
<section>
<h2>If you have 3+ years of professional experience</h2>
<p><a href="/free-workshop">Reserve My Free Workshop Spot</a></p>
<p>How experienced professionals land $10k&ndash;$18k/mo Data &amp; AI Orchestration PM contracts. Includes the 90-day roadmap when you register.</p>
<p><a href="/are-you-ready-to-pivot-to-pm-consulting">Take the PM Consulting Readiness Quiz</a></p>
<p><a href="/ai-bi-fintech-pm-job-alerts-repo">Browse open contracts</a></p>
</section>
<p>One student&rsquo;s result. Your outcome depends on experience, market, and work inside the program.</p>
${nav([
  ["/", "Home"],
  ["/about-post", "About"],
])}
</main>
${footer}`;

const BOOK_BODY = `<main class="container mx-auto px-4 pt-24">
<header>
<h1>Have 3+ Years of Professional Experience? Skip the 48-Hour Webinar Wait.</h1>
<p>${DIAGNOSTIC_COPY}</p>
</header>
<section>
<h2>Book Free 15-Min Pivot Strategy Session</h2>
<p>The booking form asks for First Name (required), Email Address (required), Current Role (e.g., Engineer, PM, Developer), Years of Professional Experience, and a WhatsApp number that enables group access.</p>
</section>
<section>
<h2>Not ready for a call yet?</h2>
<p><a href="/free-workshop">Reserve My Free Workshop Spot</a></p>
<p><a href="/are-you-ready-to-pivot-to-pm-consulting">Take the PM Consulting Readiness Quiz</a></p>
<p><a href="/ai-bi-fintech-pm-job-alerts-repo">Browse open contracts</a></p>
</section>
${nav([["/", "Home"], ["/proof", "Student Results"], ["/about-post", "About"]])}
</main>
${footer}`;

export const SEO_PAGES: SeoPage[] = [
  {
    route: "/",
    file: "index.html",
    canonical: origin("/"),
    body: HOME_BODY,
  },
  {
    route: "/free-workshop",
    file: "free-workshop.html",
    title: `Free Live Workshop: Land $10k&ndash;$18k/mo Data &amp; AI Orchestration PM Contracts | ${BRAND}`,
    description:
      "I&rsquo;ll show you the exact roadmap + the hidden job board I used to go from $3.5k/mo to $18k/mo take-home. Live Mon &amp; Wed 12:00 PM&ndash;1:00 PM ET and Sat 11:00 AM&ndash;12:00 PM ET. Register free.",
    canonical: origin("/free-workshop"),
    body: WORKSHOP_BODY,
  },
  {
    route: "/are-you-ready-to-pivot-to-pm-consulting",
    file: "are-you-ready-to-pivot-to-pm-consulting.html",
    title: `PM Consulting Readiness Quiz &mdash; Free 3-Minute Audit | ${BRAND}`,
    description:
      "Free 10-question PM consulting diagnostic: check PMP &amp; enterprise contract eligibility (3+ years benchmark), audit your resume against live $85&ndash;$120/hr GTA specs, and unlock a 0&ndash;100 readiness score plus the V5 90-day pivot roadmap PDF.",
    canonical: origin("/are-you-ready-to-pivot-to-pm-consulting"),
    body: QUIZ_BODY,
  },
  {
    route: "/about",
    file: "about.html",
    title: `About Hassan Hammer Khan B.Eng., PMP | ${BRAND}`,
    description:
      "Hassan &ldquo;Hammer&rdquo; Khan B.Eng., PMP is Principal PM Consultant &amp; Founder of Zero to PM Consultant. He went from $3.5k/mo to $18k/mo take-home and teaches professionals with 3+ years of experience to pivot into $10k&ndash;$18k/mo Data &amp; AI Orchestration PM contracts.",
    canonical: origin("/about-post"),
    body: ABOUT_BODY,
  },
  {
    route: "/about-post",
    file: "about-post.html",
    title: `About Hassan Hammer Khan B.Eng., PMP | ${BRAND}`,
    description:
      "Hassan &ldquo;Hammer&rdquo; Khan B.Eng., PMP is Principal PM Consultant &amp; Founder of Zero to PM Consultant. He went from $3.5k/mo to $18k/mo take-home and teaches professionals with 3+ years of experience to pivot into $10k&ndash;$18k/mo Data &amp; AI Orchestration PM contracts.",
    canonical: origin("/about-post"),
    body: ABOUT_BODY,
  },
  {
    route: "/proof",
    file: "proof.html",
    title: `Student Results | ${BRAND}`,
    description:
      "Gary went from real estate administration to $11k/mo after tax. Resume first. Recruiters reached out while he was still in the program.",
    canonical: origin("/proof"),
    body: PROOF_BODY,
  },
  {
    route: "/book-session",
    file: "book-session.html",
    title: `Book a Free 15-Minute Pivot Strategy Session | ${BRAND}`,
    description:
      "Have 3+ years of professional experience? Skip the 48-hour webinar wait and book a private 15-Minute Experience Diagnostic &amp; Resume Audit with Hassan: LinkedIn pulled up live, matched to active $85&ndash;$120/hr contracts.",
    canonical: origin("/book-session"),
    body: BOOK_BODY,
  },
  {
    route: "/ai-bi-fintech-pm-job-alerts-repo",
    file: "ai-bi-fintech-pm-job-alerts-repo.html",
    title: `Data &amp; AI Orchestration PM Consulting Contracts Job Board | ${BRAND}`,
    description:
      "The Most Comprehensive Data &amp; AI Orchestration PM Consulting Contracts Job Board in North America. Skip roles older than 48 hours &mdash; recruiters submit top candidates within this window.",
    canonical: origin("/ai-bi-fintech-pm-job-alerts-repo"),
    body: BOARD_BODY,
  },
  {
    route: "/pm-job-board-canada",
    file: "pm-job-board-canada.html",
    title: `PM Consulting Job Board Canada | ${BRAND}`,
    description:
      "The Most Comprehensive Data &amp; AI Orchestration PM Consulting Contracts Job Board in North America. Skip roles older than 48 hours &mdash; recruiters submit top candidates within this window.",
    canonical: origin("/ai-bi-fintech-pm-job-alerts-repo"),
    body: BOARD_BODY,
  },
  {
    route: "/pm-strategy-guide-pdf",
    file: "pm-strategy-guide-pdf.html",
    title: `2026 Data &amp; AI Orchestration PM Roadmap &ndash; Unlock Your $10k/mo Pivot | ${BRAND}`,
    description:
      "Your complete guide to becoming a 10k/mo+ consultant: mindset, hybrid PM, vendor-grade tools, and certs (PMP, PSM, CPMAI).",
    canonical: origin("/2026-bi-fintech-consulting-roadmap-pdf-unlock"),
    body: ROADMAP_BODY,
  },
  {
    route: "/2026-bi-fintech-consulting-roadmap-pdf-unlock",
    file: "2026-bi-fintech-consulting-roadmap-pdf-unlock.html",
    title: `2026 Data &amp; AI Orchestration PM Roadmap &ndash; Unlock Your $10k/mo Pivot | ${BRAND}`,
    description:
      "Your complete guide to becoming a 10k/mo+ consultant: mindset, hybrid PM, vendor-grade tools, and certs (PMP, PSM, CPMAI).",
    canonical: origin("/2026-bi-fintech-consulting-roadmap-pdf-unlock"),
    body: ROADMAP_BODY,
  },
];

export const PRERENDER_START = "<!--seo-prerender:start-->";
export const PRERENDER_END = "<!--seo-prerender:end-->";

const PRERENDER_BLOCK_RE = /<!--seo-prerender:start-->[\s\S]*?<!--seo-prerender:end-->/g;
const ROOT_DIV_RE = /<div id="root">[\s\S]*?<\/div>/;

const escapeAttr = (value: string) => value.replace(/"/g, "&quot;");

/** Remove any previously injected prerender block so re-runs stay idempotent. */
export function stripSeoPrerender(html: string): string {
  return html.replace(PRERENDER_BLOCK_RE, "");
}

const replaceTitle = (html: string, title: string) =>
  html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title}</title>`);

const replaceMeta = (html: string, selector: string, content: string) =>
  html.replace(
    new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*(")`),
    (_match, open: string, close: string) => `${open}${escapeAttr(content)}${close}`,
  );

const replaceCanonical = (html: string, href: string) =>
  html.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
    (_m, open: string, close: string) => `${open}${escapeAttr(href)}${close}`,
  );

/**
 * Inject one page's readable HTML into the built SPA shell: route-specific
 * title/description/canonical/OG tags plus semantic markup inside
 * `<div id="root">`, where createRoot replaces it on mount in real browsers.
 */
export function renderSeoPageIntoShell(shell: string, page: SeoPage): string {
  let html = stripSeoPrerender(shell);

  if (page.title) html = replaceTitle(html, page.title);
  if (page.description) {
    html = replaceMeta(html, 'name="description"', page.description);
    html = replaceMeta(html, 'property="og:description"', page.description);
    html = replaceMeta(html, 'name="twitter:description"', page.description);
  }
  if (page.title) {
    html = replaceMeta(html, 'property="og:title"', page.title);
    html = replaceMeta(html, 'name="twitter:title"', page.title);
  }
  html = replaceCanonical(html, page.canonical);
  html = replaceMeta(html, 'property="og:url"', page.canonical);

  const injected = `<div id="root">${PRERENDER_START}<div class="seo-prerender">${page.body}</div>${PRERENDER_END}</div>`;
  if (!ROOT_DIV_RE.test(html)) return html;
  return html.replace(ROOT_DIV_RE, () => injected);
}
