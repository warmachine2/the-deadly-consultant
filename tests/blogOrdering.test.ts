import { describe, expect, test } from 'bun:test';
import { sortBlogPosts, isVerticalVideo, getPinnedPostRank } from '../src/lib/blogOrdering';

describe('sortBlogPosts', () => {
  test('episodes descend by number, then articles newest first', () => {
    const posts = [
      { title: 'EP16 - 18k/mo Contract Beats 400k/yr Salary', published_at: '2026-10-30' },
      { title: 'Old article', published_at: '2025-01-01' },
      { title: 'EP28 - Newest', published_at: '2026-01-01' },
      { title: 'EP6 - First', published_at: '2026-11-01' },
      { title: 'New article', published_at: '2026-06-01' },
      { title: 'EP18 - Why PMP Alone Fails', published_at: '2026-02-01' },
    ];
    expect(sortBlogPosts(posts).map((p) => p.title.split(' ')[0])).toEqual(['EP28', 'EP18', 'EP16', 'EP6', 'New', 'Old']);
  });

  test('pinned posts come first in exact pin order', () => {
    const posts = [
      { slug: 'ep88', title: 'EP88 - Latest', published_at: '2026-11-20' },
      { slug: '9-reasons-this-pm-consultant-training-program-is-different-from-all-the-others', title: '9 Reasons This PM Consultant Training Program Is Different', published_at: '2025-03-01' },
      { slug: 'ep6', title: 'EP6 - First', published_at: '2025-01-01' },
      { slug: 'my-18k-mo-fintech-data-ai-pm-consultant-story', title: 'From $3,500/Month to $18,000/Month', published_at: '2025-02-01' },
      { slug: 'ep87', title: 'EP87 - X', published_at: '2026-11-10' },
      { slug: 'pm-consulting-secrets-how-to-make-10kmo', title: 'EP7 - PM Consulting Secrets - How to make $10kmo+', published_at: '2025-01-05' },
    ];
    expect(sortBlogPosts(posts).map((p) => p.slug)).toEqual([
      'pm-consulting-secrets-how-to-make-10kmo',
      'my-18k-mo-fintech-data-ai-pm-consultant-story',
      '9-reasons-this-pm-consultant-training-program-is-different-from-all-the-others',
      'ep88', 'ep87', 'ep6',
    ]);
  });

  test('title fallback ranks pins when slug is missing', () => {
    expect(getPinnedPostRank({ title: 'EP7 - PM Consulting Secrets' })).toBe(0);
    expect(getPinnedPostRank({ title: 'EP70 - Other' })).toBe(null);
    expect(getPinnedPostRank({ title: 'Student Results' })).toBe(1);
  });
});

describe('isVerticalVideo', () => {
  test('EP7 landscape 200x113 iframe is not vertical', () =>
    expect(isVerticalVideo('EP7 - PM Consulting Secrets - How to make $10kmo+', '<iframe width="200" height="113" src="https://www.youtube.com/embed/rJnACxKL0Tk?feature=oembed">')).toBe(false));
  test('113x200 episode iframe is vertical', () =>
    expect(isVerticalVideo('EP27 - X', '<iframe width="113" height="200" src="https://www.youtube.com/embed/crefj2hNfTw?feature=oembed">')).toBe(true));
  test('LinkedIn embed is not vertical', () =>
    expect(isVerticalVideo('Post', '<iframe width="504" height="842" src="https://www.linkedin.com/embed/feed/update/urn:li:share:1">')).toBe(false));
  test('mixed portrait + landscape videos are not vertical', () =>
    expect(isVerticalVideo('Unboxing', '<iframe width="113" height="200" src="https://www.youtube.com/embed/a"><iframe width="200" height="113" src="https://www.youtube.com/embed/b">')).toBe(false));
});
