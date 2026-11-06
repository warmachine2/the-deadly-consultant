export interface OrderablePost {
  title: string;
  published_at: string;
}

/** Returns the Talking Head episode number from titles like "EP18 - ..." or "EP #18: ...". */
export function getEpisodeNumber(title: string): number | null {
  const match = title.trim().match(/^EP\s*#?\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

/** Episodes first (highest number first), then non-numbered posts newest to oldest. */
export function sortBlogPosts<T extends OrderablePost>(posts: T[]): T[] {
  const time = (p: T) => new Date(p.published_at).getTime() || 0;
  return [...posts].sort((a, b) => {
    const ea = getEpisodeNumber(a.title);
    const eb = getEpisodeNumber(b.title);
    if (ea !== null && eb !== null) return eb - ea || time(b) - time(a);
    if (ea !== null) return -1;
    if (eb !== null) return 1;
    return time(b) - time(a);
  });
}

/** True for vertical Talking Head / Shorts embeds. */
export function isVerticalVideo(title: string | undefined, html: string | undefined): boolean {
  if (title && getEpisodeNumber(title) !== null) return true;
  if (!html) return false;
  if (/youtube\.com\/(embed\/)?shorts/i.test(html)) return true;
  const iframes = html.match(/<iframe[^>]*>/gi) || [];
  return iframes.some((tag) => {
    const w = Number(tag.match(/\bwidth=["']?(\d+)/i)?.[1]);
    const h = Number(tag.match(/\bheight=["']?(\d+)/i)?.[1]);
    return w > 0 && h > w;
  });
}
