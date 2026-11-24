export interface OrderablePost {
  title: string;
  published_at: string;
  slug?: string;
}

export const PINNED_POST_SLUGS = [
  "pm-consulting-secrets-how-to-make-10kmo", // #1 EP7 - PM Consulting Secrets - How to make $10kmo+
  "student-results", // #2 Student screenshots post (auto-displays if/when published in Ghost)
  "my-18k-mo-fintech-data-ai-pm-consultant-story", // #3 From $3,500/Month to $18,000/Month
  "9-reasons-this-pm-consultant-training-program-is-different-from-all-the-others", // #4 9 Reasons...
] as const;

const PINNED_TITLE_PATTERNS: RegExp[] = [
  /^EP\s*#?\s*7\b/i,
  /^student results/i,
  /^From \$3,500\/Month to \$18,000\/Month/i,
  /^9 Reasons This PM Consultant Training/i,
];

/** Index in PINNED_POST_SLUGS (by slug, or by title prefix when slug is absent), else null. */
export function getPinnedPostRank(post: { slug?: string; title?: string }): number | null {
  if (post.slug) {
    const i = (PINNED_POST_SLUGS as readonly string[]).indexOf(post.slug);
    return i === -1 ? null : i;
  }
  const title = post.title?.trim() ?? "";
  const i = PINNED_TITLE_PATTERNS.findIndex((re) => re.test(title));
  return i === -1 ? null : i;
}

/** Returns the Talking Head episode number from titles like "EP18 - ..." or "EP #18: ...". */
export function getEpisodeNumber(title: string): number | null {
  const match = title.trim().match(/^EP\s*#?\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

/** Pinned posts first (in pin order), then episodes (highest first), then other posts newest first. */
export function sortBlogPosts<T extends OrderablePost>(posts: T[]): T[] {
  const time = (p: T) => new Date(p.published_at).getTime() || 0;
  return [...posts].sort((a, b) => {
    const pa = getPinnedPostRank(a);
    const pb = getPinnedPostRank(b);
    if (pa !== null && pb !== null) return pa - pb;
    if (pa !== null) return -1;
    if (pb !== null) return 1;
    const ea = getEpisodeNumber(a.title);
    const eb = getEpisodeNumber(b.title);
    if (ea !== null && eb !== null) return eb - ea || time(b) - time(a);
    if (ea !== null) return -1;
    if (eb !== null) return 1;
    return time(b) - time(a);
  });
}

const VIDEO_SRC_RE = /(youtube\.com|youtube-nocookie\.com|youtu\.be|vimeo\.com)/i;

function iframeSrc(tag: string): string {
  return tag.match(/\bsrc=["']?([^"'\s>]+)/i)?.[1] ?? "";
}

function isVideoIframeTag(tag: string): boolean {
  const src = iframeSrc(tag);
  return VIDEO_SRC_RE.test(src) && !/linkedin\.com\/embed/i.test(src);
}

/** True when a single video iframe is portrait (Shorts URL or height > width). */
export function isVerticalIframeTag(tag: string): boolean {
  if (!isVideoIframeTag(tag)) return false;
  if (/youtube\.com\/(embed\/)?shorts/i.test(iframeSrc(tag))) return true;
  const w = Number(tag.match(/\bwidth=["']?(\d+)/i)?.[1]);
  const h = Number(tag.match(/\bheight=["']?(\d+)/i)?.[1]);
  if (w > 0 && h > 0) return h > w;
  return false;
}

/** True only when every video iframe in the post is portrait. */
export function isVerticalVideo(_title?: string, html?: string): boolean {
  if (!html) return false;
  const videoIframes = (html.match(/<iframe[^>]*>/gi) || []).filter(isVideoIframeTag);
  return videoIframes.length > 0 && videoIframes.every(isVerticalIframeTag);
}
