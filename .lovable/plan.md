

# Launch Stability Mode - Complete Animation Removal Plan

## Problem Diagnosis

Your Google Pixel 10 Pro Fold is experiencing a **1 Hz periodic disappearing/reappearing of multiple UI elements** even at idle (no touch required). This is caused by several CSS animations running continuously that are creating GPU compositing conflicts on the Fold's unique display hardware.

### Animations Causing the Issue

| Animation | Cycle | Effect |
|-----------|-------|--------|
| `grain-flicker` | 0.3s steps(2) infinite | Film grain overlay literally flickers by design |
| `mesh-float` | 15s infinite | Background mesh translates/rotates constantly |
| `cta-glow-pulse-*` | 2-4s infinite | CTA buttons pulsing glow |
| `bokeh-pulse` | 4s infinite | Hero section orbs pulsing |
| `subtle-glow` | 2.5s infinite | Additional button glow animations |
| `animate-pulse` | Tailwind default | Status indicators pulsing |

---

## Solution: Full Stability Mode

**Strategy:** Disable ALL animations and hover effects site-wide, replacing dynamic glows with static premium glows. This is reversible via a single toggle after launch.

---

## Phase 1: CSS Stability Overhaul

**File: `src/index.css`**

### 1.1 Disable Background Animations

```text
Changes to body overlays:
- Remove: animation: grain-flicker ... (line 139)
- Remove: animation: mesh-float ... (line 182)
- Keep the static visual appearance (grain texture + mesh gradient)
```

### 1.2 Create Static Glow Classes

Replace animated pulses with static premium glows:

```text
NEW classes to add:
- .cta-glow-static-cyan   -> Static cyan box-shadow (no animation)
- .cta-glow-static-amber  -> Static amber box-shadow (no animation)
- .cta-glow-static-red    -> Static red/cyan box-shadow (no animation)
```

### 1.3 Kill All Pulse Animations

```text
Add global override:
.cta-glow-pulse,
.cta-glow-pulse-red,
.cta-glow-pulse-subtle,
.cta-glow-pulse-gentle,
.cta-glow-pulse-blue-subtle,
.animate-subtle-glow,
.animate-glow-backdrop,
.bokeh-orb {
  animation: none !important;
}
```

### 1.4 Disable All Hover Effects

Remove or neutralize:
- `.hover-lift:hover` transforms
- `.hover-glow:hover` box-shadow changes
- `.volumetric-glass:hover` glow intensification
- `.volumetric-glass-button:hover` transforms
- All hover effects currently in desktop-only media query

---

## Phase 2: Component Cleanup

Remove inline Tailwind `hover:*` classes that cause visual flashes.

### TopNav.tsx

| Line | Current | Replace With |
|------|---------|--------------|
| 91 | `hover:text-[#F4C903] hover:bg-white/10` | Remove hover classes |
| 99 | `hover:text-[#F4C903] hover:bg-white/10` | Remove hover classes |
| 104-121 | All menu item hovers | Static styling only |
| 163-167 | Button hover classes | Remove, use focus states |
| 204 | `cta-glow-pulse` | `cta-glow-static-cyan` |
| 259, 267, etc. | `hover:text-[#F4C903]` | Remove |

### HeroSection.tsx

- Remove all `hover:text-[#F4C903]` from CTA tiles
- Replace any `cta-glow-pulse` with static glow class
- Disable bokeh orb animations

### JobAlertsPage.tsx

- Remove `hover:bg-*`, `hover:border-*`, `hover:text-*` classes
- Replace animated buttons with static styling
- Keep `focus-visible:` states for accessibility

### Other Files

- `DynamicPage.tsx` - Remove tag pill hover effects
- `AboutPage.tsx` - Remove link hover effects
- `BookSessionPage.tsx` - Replace animated CTA with static
- `Sidebar.tsx` - Remove button hover transforms

---

## Phase 3: Keep Accessibility Intact

Preserve keyboard navigation indicators:

```text
Keep these for screen readers and keyboard users:
- focus:ring-*
- focus-visible:ring-*
- focus:outline-*
```

---

## Files to Modify

1. **`src/index.css`**
   - Remove grain-flicker animation
   - Remove mesh-float animation  
   - Add static glow utility classes
   - Add global animation kill override
   - Remove all hover effect rules

2. **`src/components/TopNav.tsx`**
   - Strip all `hover:*` classes
   - Replace `cta-glow-pulse` with static class

3. **`src/components/HeroSection.tsx`**
   - Remove tile hover effects
   - Disable bokeh orb animations
   - Use static glows

4. **`src/pages/JobAlertsPage.tsx`**
   - Remove all hover styling
   - Static button appearance

5. **`src/components/Sidebar.tsx`**
   - Remove hover transforms

6. **`src/pages/BookSessionPage.tsx`**
   - Remove animated CTA styling

7. **`src/pages/DynamicPage.tsx`**
   - Remove tag/link hover effects

8. **`src/pages/AboutPage.tsx`**
   - Remove interactive hover styling

---

## Visual Result

| Before | After |
|--------|-------|
| Animated film grain flickering | Static grain texture |
| Floating mesh background | Static mesh gradient |
| Pulsing CTA glows | Elegant static glows |
| Hover color changes | Consistent colors |
| Transform on hover | No movement |

The site will maintain its premium dark glass aesthetic with static cyan/amber glows, but without any animation or hover-triggered changes that could cause rendering issues.

---

## Reversibility

After launch, when you have time to test on various devices:

1. Re-enable desktop-only hover effects inside `@media (hover: hover) and (pointer: fine)` block
2. Optionally re-enable subtle animations for desktop users
3. Keep mobile fully static

---

## Testing Checklist

After implementation, verify on your Pixel 10 Pro Fold:
- [ ] No more 1 Hz flickering at idle
- [ ] Top nav stays visible continuously
- [ ] Page elements remain stable
- [ ] Tapping buttons causes no visual flash
- [ ] Site still looks premium with static glows

