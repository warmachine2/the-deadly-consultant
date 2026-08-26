# Fix Header as One Responsive Layout

## Implementation
- Reorganize `TopNav` into explicit left and right groups with equal 16px+ outer padding.
- Keep logo, full `PM CONSULTING JOB BOARD` label, and desktop search together on the left with a fixed separation between the button and search.
- Keep Roadmap and Log-in together on the right with `flex-shrink: 0` so both remain fully inside the viewport.
- Keep middle navigation links collapsed into the existing hamburger at laptop widths; only expose them where the complete row has sufficient room.
- Preserve the existing mobile menu and all destinations/content.

## Verification
- Test at Chrome 100% equivalents: 1366px and 1440px wide.
- Confirm complete Job Board text, 8–12px+ search separation, fully visible Roadmap and Log-in borders, and no horizontal overflow.
- Test phone width and open the hamburger to confirm it remains functional.

## Scope
- Change only `src/components/TopNav.tsx`; do not touch Job Board ingestion, source mappings, or `/book-session` logic.
