import { describe, expect, test } from 'bun:test';
import { sortBlogPosts, isVerticalVideo } from '../src/lib/blogOrdering';

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
});

describe('isVerticalVideo', () => {
  test('EP titles are vertical', () => expect(isVerticalVideo('EP27 - X', '')).toBe(true));
  test('113x200 iframe is vertical', () =>
    expect(isVerticalVideo('Post', '<iframe width="113" height="200" src="https://www.youtube.com/embed/a">')).toBe(true));
  test('16:9 walkthrough stays landscape', () =>
    expect(isVerticalVideo('Full Walkthrough', '<iframe width="200" height="113" src="https://www.youtube.com/embed/a">')).toBe(false));
});
