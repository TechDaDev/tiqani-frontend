# Design System

## Identity

**Modern Teal Technology** — secure, professional, modern, and trustworthy.

The identity is designed for the Iraqi market, suitable for contracts and financial workflows while maintaining a technological feel without gaming aesthetics.

## Removed from Old Theme

- Magenta as a major brand color
- Constant neon glow
- Glitch effects
- Excessive pulses
- Bright cyan text shadows
- Noisy backgrounds behind content

## Retained Technology Elements

- Subtle geometric grid patterns
- Soft grid details
- Restrained gradients
- Controlled motion via fade-up animations
- Clean technical layout

## Color Tokens — Light Theme

```
--background:       #F7FAFA
--surface:          #FFFFFF
--surface-subtle:   #F1FAF9
--primary:          #0F8B8D
--primary-hover:    #0B7476
--primary-active:   #095F61
--primary-soft:     #DDF5F3
--brand-dark:       #063F40
--foreground:       #172B2D
--foreground-muted: #5F7476
--border:           #D7E4E4
--input:            #FFFFFF
--ring:             #0F8B8D
--success:          #16A36A
--success-soft:     #E7F8F0
--warning:          #D99A19
--warning-soft:     #FFF7E3
--danger:           #D64545
--danger-soft:      #FDECEC
--info:             #2B7CD3
--info-soft:        #EAF3FC
--surface-pure:     #FEFCFF
--surface-warm:     #F9F8F0
--border-warm:      #DCD9CD
--neutral-soft:     #D3D3D3
```

## Color Tokens — Dark Theme

```
--background:       #071C1D
--surface:          #0D292A
--surface-raised:   #123536
--surface-subtle:   #0B2425
--primary:          #2DD4BF
--primary-hover:    #5EEAD4
--primary-active:   #14B8A6
--primary-soft:     #113B3A
--brand-dark:       #D5FFFA
--foreground:       #F4FAFA
--foreground-muted: #A9C0C0
--border:           #21494A
--input:            #102F30
--ring:             #2DD4BF
--surface-pure:     #FFFFFF
--surface-warm:     #0D292A
--border-warm:      #21494A
--neutral-soft:     #3A5A5B
```

## Typography

- English: Inter (via next/font)
- Arabic/Kurdish: Noto Sans Arabic (via next/font)

### Hierarchy

- Display: Hero title (text-4xl to text-6xl)
- H1: Page title
- H2: Section title (text-3xl to text-4xl)
- H3: Card title (text-lg to text-xl)
- Body large: Section introduction (text-lg)
- Body: Normal text (text-base)
- Small: Supporting metadata (text-sm)

## Animation

- Fade-up: 0.6s ease-out
- Fade-in: 0.4s ease-out
- Hover lift on cards
- Mobile menu transition
- Respects `prefers-reduced-motion`
