# Design Brief

**Purpose:** Modern Linktree-style personal link page with glassmorphic interface and warm aesthetic.

**Tone:** Premium, contemporary, inviting—slightly luxury but approachable.

**Differentiation:** Glassy layered buttons with backdrop blur and golden glow, warm gradient backgrounds that harmonize with profile images. Responsive hero layout. Signature detail: warm orange-to-amber gradient base with inset glass morphism effects.

## Palette

| Token | Light | Dark | Purpose |
|-------|-------|------|----------|
| Primary | 0.58 0.22 56 | 0.68 0.2 56 | Golden-orange CTA buttons |
| Secondary | 0.72 0.15 56 | 0.28 0.08 263 | Warm accent, secondary actions |
| Background | 0.975 0.02 56 | 0.12 0.01 263 | Page base, warm cream to deep charcoal |
| Card | 0.96 0.04 56 | 0.16 0.02 263 | Glass effect layer |
| Foreground | 0.18 0.03 263 | 0.92 0.02 56 | Text, dark to light |
| Border | 0.85 0.05 56 | 0.24 0.03 263 | Glass borders, subtle |

## Typography

| Use | Font | Weight | Scale |
|-----|------|--------|-------|
| Display/Buttons | Space Grotesk | 600 | 24–32px |
| Body | Nunito | 400–500 | 14–18px |
| Mono | Geist Mono | 400 | 12–14px |

## Structural Zones

| Zone | Treatment | Purpose |
|------|-----------|----------|
| Header | Minimal/transparent | Navigation or branding |
| Hero | Gradient warm base | Avatar (rounded-full, glow) + name + bio |
| Links | Glass cards, grid | Glassy buttons with blur, golden glow, 2px border |
| Footer | Subtle muted bg | Optional social links or copyright |

## Components & Patterns

- **Glass buttons**: `.glass` class with `backdrop-blur-md`, semi-transparent white/10, rounded-2xl, `.glow-golden` shadow
- **Hover state**: `.glass-hover` brightens background, `.glow-golden-hover` intensifies shadow
- **Gradient sections**: `.gradient-warm` (light mode), `.gradient-warm-dark` (dark mode)
- **Responsive grid**: Full-width buttons on mobile (`sm:`), 2–3 columns on tablet/desktop
- **Icon + text**: Flex layout, centered alignment inside glass buttons

## Motion

- **Fade-in**: 0.3s ease-out on initial page load
- **Slide-up**: 0.4s cubic-bezier for link buttons (staggered)
- **Hover**: 0.3s smooth transition on glass brightness and glow
- **No bouncy or excessive animations**: Focus on elegant subtlety

## Spacing & Rhythm

- Avatar: 120px (mobile), 150px (desktop)
- Gap between hero sections: 32px
- Link grid: 16px gap (mobile), 24px gap (desktop)
- Padding: 24px standard, 16px on mobile

## Constraints

- No default Bootstrap or Tailwind shadows—use glass shadow tokens only
- No raw hex colors—all colors via OKLCH tokens
- Icons optional; text content prioritized
- Mobile-first responsive
- Dark mode fully supported with warm accent preservation

## Key Files

- `src/frontend/src/index.css`: OKLCH tokens, glass utilities, gradients
- `src/frontend/tailwind.config.js`: Glass shadows, animations (fade-in, slide-up)
- Fonts: Space Grotesk (display), Nunito (body), Geist Mono (mono)
