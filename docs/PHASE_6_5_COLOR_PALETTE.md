# Phase 6.5 — Neutral Palette Extension

## Overview

Extended the Tiqani color palette with four new neutral colors to improve visual hierarchy, warmth, readability, surfaces, borders, empty states, and light-theme consistency. Existing brand colors are preserved for actions, focus, and active states.

## New Colors

```
#d3d3d3 — neutral soft border/divider
#fefcff — clean primary surface
#f9f8f0 — warm secondary background
#dcd9cd — warm border and separator
```

## Semantic Token Names

| Token | Hex (Light) | Hex (Dark) | Role |
|---|---|---|---|
| `--surface-pure` | `#FEFCFF` | `#FFFFFF` | Clean elevated card/panel/dialog surface |
| `--surface-warm` | `#F9F8F0` | `#0D292A` | Warm secondary background, empty states, hover surfaces |
| `--border-warm` | `#DCD9CD` | `#21494A` | Warm borders, separators, card outlines |
| `--neutral-soft` | `#D3D3D3` | `#3A5A5B` | Neutral dividers, skeleton placeholders, muted icons |

## Light-Theme Mapping

| Usage | Token |
|---|---|
| App background (dashboards, auth shell) | `--background` (unchanged) |
| Section backgrounds, empty states, hover | `--surface-warm` |
| Primary card, panel, dialog surface | `--surface-pure` |
| Card borders, input borders, separators | `--border-warm` |
| Skeleton, muted dividers, disabled icons | `--neutral-soft` |
| Brand actions, focus, active states | `--primary`, `--ring` (unchanged) |

## Dark-Theme Mapping

| Usage | Token |
|---|---|
| Dark surface follows existing `--surface` | `--surface-pure` → `#FFFFFF` (clean white cards) |
| Warm secondary maps to dark panel | `--surface-warm` → `#0D292A` |
| Warm border uses existing muted border | `--border-warm` → `#21494A` |
| Neutral soft uses disabled/divider color | `--neutral-soft` → `#3A5A5B` |

## Accessibility

- `#d3d3d3` is **never** used as body text on light backgrounds
- Text uses `--foreground` and `--foreground-muted` tokens (existing)
- All contrast ratios meet WCAG AA requirements
- Status colors (success, warning, danger, info) remain unchanged
- Focus indicators use existing `--ring` color

## Correct Usage

```tsx
// Card surface — use surface-pure
<div className="bg-surface-pure border border-border-warm rounded-lg p-4">
  <h3 className="text-foreground">Card title</h3>
  <p className="text-foreground-muted">Card description</p>
</div>

// Warm section background
<section className="bg-surface-warm py-8">
  <div className="bg-surface-pure rounded-xl">Content card</div>
</section>

// Input borders
<input className="border border-border-warm bg-surface-pure rounded-lg" />

// Skeleton placeholder
<div className="h-4 bg-neutral-soft/50 rounded animate-pulse" />
```

## Incorrect Usage

```tsx
// DON'T — hardcoded colors that now have semantic tokens
<div className="bg-white border border-gray-200">...</div>
<div className="text-gray-500">...</div>
<div className="bg-gray-100">...</div>

// DON'T — body text in neutral-soft (insufficient contrast)
<p className="text-neutral-soft">Body text</p>

// DON'T — replacing brand colors with neutrals
<button className="bg-primary">Action</button>
```

## Commands

- `/caveman` — talk like caveman
- `normal mode` — revert to normal speech
