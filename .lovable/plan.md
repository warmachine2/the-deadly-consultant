

# Fix Mobile Flickering - Updated Comprehensive Plan

## Problem Analysis

After a thorough code review, I identified **multiple sources of mobile flickering** that were not fully addressed in the previous fix:

### Root Causes Found

| Issue | Location | Description |
|-------|----------|-------------|
| Inline `hover:scale` Tailwind classes | Multiple TSX files | These bypass the CSS media query protection |
| `group-hover:scale` transforms | JobAlertsPage.tsx | Scale on hover applied to child elements |
| Entrance animation with `translateY` | index.css `glass-fade-in` | Initial transform on every volumetric element |
| Constant pulse animations | CTA buttons | May cause rendering jitter on low-end mobile devices |

---

## Implementation Plan

### Phase 1: Create CSS-Based Desktop-Only Scale Utility

Instead of using Tailwind's `hover:scale-*` classes (which apply on all devices), we'll create protected CSS classes.

**File: `src/index.css`**

Add new utility classes inside the existing desktop-only media query block:

```css
@media (hover: hover) and (pointer: fine) {
  /* Existing hover-lift, hover-glow, volumetric-glass hover rules... */
  
  /* NEW: Desktop-only scale utilities */
  .desktop-hover-scale-105:hover {
    transform: scale(1.05);
  }
  
  .desktop-hover-scale-103:hover {
    transform: scale(1.03);
  }
  
  .desktop-group-hover-scale-110:hover {
    transform: scale(1.10);
  }
}
```

---

### Phase 2: Update Components to Use Protected Classes

Replace all inline `hover:scale-*` classes with the new CSS utility classes:

| File | Line | Current | Replace With |
|------|------|---------|--------------|
| `Sidebar.tsx` | 82 | `hover:scale-[1.03]` | `desktop-hover-scale-103` |
| `BookSessionPage.tsx` | 270 | `hover:scale-105` | `desktop-hover-scale-105` |
| `RoadmapPage.tsx` | 69 | `hover:scale-105` | `desktop-hover-scale-105` |
| `JobAlertsPage.tsx` | 347, 447, 557, 1048, 1060, 1075, 1109 | `hover:scale-105` | `desktop-hover-scale-105` |
| `JobAlertsPage.tsx` | 565 | `group-hover:scale-110` | Wrap in desktop-only logic |

---

### Phase 3: Stabilize Entrance Animation for Mobile

Modify the `glass-fade-in` animation to avoid `translateY` on mobile, which can cause layout shifts:

**Option A (Recommended):** Make entrance animation desktop-only
```css
.volumetric-glass {
  /* Remove: animation: glass-fade-in 0.5s ease; */
}

@media (hover: hover) and (pointer: fine) {
  .volumetric-glass {
    animation: glass-fade-in 0.5s ease;
  }
}
```

**Option B:** Change animation to use opacity only (no transform)
```css
@keyframes glass-fade-in-mobile {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
```

---

### Phase 4: Reduce Animation Intensity on Mobile (Optional)

For CTA pulse animations, add reduced-motion preference support:

```css
@media (prefers-reduced-motion: reduce) {
  .cta-glow-pulse,
  .cta-glow-pulse-red,
  .cta-glow-pulse-subtle,
  .cta-glow-pulse-gentle {
    animation: none;
  }
}
```

---

## Files to Modify

1. **`src/index.css`**
   - Add desktop-only scale utility classes
   - Move entrance animations to desktop-only media query
   - Add prefers-reduced-motion support

2. **`src/components/Sidebar.tsx`** (line 82)
   - Replace `hover:scale-[1.03]` with `desktop-hover-scale-103`

3. **`src/pages/BookSessionPage.tsx`** (line 270)
   - Replace `hover:scale-105` with `desktop-hover-scale-105`

4. **`src/pages/RoadmapPage.tsx`** (line 69)
   - Replace `hover:scale-105` with `desktop-hover-scale-105`

5. **`src/pages/JobAlertsPage.tsx`** (~8 locations)
   - Replace all `hover:scale-105` with `desktop-hover-scale-105`
   - Handle `group-hover:scale-110` case appropriately

---

## Technical Details

### Why Tailwind `hover:scale-*` Doesn't Work

Tailwind generates:
```css
.hover\:scale-105:hover { transform: scale(1.05); }
```

This applies on ALL devices. Touch events on mobile trigger `:hover` state briefly, causing:
1. Element scales up on touch
2. Touch ends, hover state removed
3. Element scales back down
4. This happens rapidly = **flickering**

### The Media Query Solution

```css
@media (hover: hover) and (pointer: fine) { ... }
```

- `hover: hover` - Device has true hover capability
- `pointer: fine` - Device has a precise pointer (mouse, not finger)

Combined, this targets only desktop devices with mice.

---

## Testing Checklist

After implementation, verify on:
- [ ] iPhone Safari (most common issue)
- [ ] Android Chrome
- [ ] iPad (tablet touch)
- [ ] Desktop Chrome/Firefox/Safari

Elements to test:
- [ ] Hero CTA buttons - no flicker on tap
- [ ] Blog cards - no flicker on tap
- [ ] Sidebar strategy session button - no flicker
- [ ] Job Alerts page CTA buttons - no flicker
- [ ] Book Session form submit button - no flicker

