# Theme System

## Technology

- `next-themes` for theme management
- CSS custom properties for design tokens
- `class` strategy — dark mode toggled via `.dark` class on `<html>`

## Supported Modes

1. **Light** — Clean white/teal surfaces
2. **Dark** — Deep teal/charcoal surfaces
3. **System** — Follows OS preference

## How It Works

The theme system uses:

1. CSS custom properties defined in `app/globals.css` under `:root` (light) and `.dark` (dark)
2. `next-themes` `ThemeProvider` wrapping the app in `[locale]/layout.tsx`
3. `localStorage` persistence via `next-themes`
4. An inline script in the `<head>` prevents flash of wrong theme (FOIT)

## Theme Switcher

The `ThemeSwitcher` component cycles through light → dark → system.

- Keyboard accessible
- Screen-reader labeled
- Uses translated labels
- Shows current theme icon

## Hydration Safety

- `suppressHydrationWarning` on `<html>` element
- Inline script in `<head>` applies correct class before React hydrates
- `ThemeSwitcher` only renders theme-affected content after client mount

## Color Contrast

Both themes maintain WCAG AA contrast for body text.

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
