# Way — Design System

| | |
|---|---|
| Date | 2026-11-04 |
| Status | Adopted at the owner's request; replaces the "evening notebook" look |
| Reference | uizze.com (owner-supplied screenshots, plus computed styles read from the live site on 2026-11-04) |

Way borrows Uizze's design *language*: chunky heavy type, glossy "squishy" pill buttons, a faint rounded-tile grid on a near-white ground, saturated primary colours, and hand-drawn doodle accents. It does not copy Uizze's identity: no Uizze logo, wordmark, illustrations, app icons, copy or layout of their marketing pages. Way keeps its own wordmark, its own content and its own screens. The product rules in `docs/2026-11-04-way-design.md` still win over anything here: the problem is the first thing on screen, one problem at a time, the set ends, no streaks or guilt, dark mode follows the system.

## What was measured on uizze.com

- Font: **Figtree** (variable 100–900, Google Fonts). Display `h1` 45px (mobile), weight **900**, letter-spacing **-0.025em**, line-height ~1.02. Body 16px/24px weight 400. Subhead 21.6px/32px, colour a mid grey.
- Accent font: a custom handwritten marker face ("doodleFont", weight 600), used for small rotated captions (about -2deg) and doodle labels.
- Tokens: `--brand-blue #3476d8` (hover `#2868c7`), `--brand-yellow #f8c808` (hover `#f0c106`, text on it `#241900`), `--brand-red #b91c1c`, `--primary #030303`, `--accent #f2f2f2`, ground ≈ `#fafafa`, hairline ≈ `#e8e8e8`, muted text ≈ `#5c5c5c`.
- Glass button: height 4rem (62px), radius 25px, text 17px weight 900, 1px border a lighter tint of the fill, box-shadow `inset 0 1px 0 #fff, inset 1px 0 0 #fff, inset -1px 0 0 rgba(255,255,255,.8), inset 0 -2px 1px #fff, 0 1px 0 rgba(126,148,181,.25), 0 4px 8px rgba(35,56,85,.08)`, plus a 112deg gloss: two thin `rgba(255,255,255,.95)` bands at ~14% and ~74% over the fill.
- Segmented control: grey track `#f2f2f2`, active item white, item height 46px, radius 17.6px, 15px weight 600.
- Neutral pill (e.g. "Get Full Access"): white, radius 16px, 14px weight 600, shadow `0 10px 24px rgba(0,0,0,.08)`.
- Ground decoration: a faint grid of rounded squares (outline only, very low contrast) behind the hero.
- Full-width saturated band (red) with white label and icons.

## Way's tokens

### Light (default)

| Token | Value | Use |
|---|---|---|
| `--ground` | `#fafafa` | page |
| `--ground-tile` | `#efefef` | rounded-tile grid lines |
| `--ink` | `#030303` | text, headings |
| `--ink-muted` | `#5c5c5c` | secondary text (≥4.5:1 on ground) |
| `--hairline` | `#e8e8e8` | dividers, input borders |
| `--surface` | `#ffffff` | cards, inputs, neutral pills |
| `--track` | `#f2f2f2` | segmented tracks, quiet pills |
| `--blue` / `--blue-hover` | `#3070d3` / `#2868c7` | primary action (Submit, Next); darkened from the measured `#3476d8` so white labels reach 4.79:1 |
| `--yellow` / `--yellow-ink` | `#f8c808` / `#241900` | secondary bright action (Run, Hint) |
| `--red` | `#b91c1c` | accent word in headings, the band, wrong-answer emphasis |
| `--black` | `#0a0a0a` | dark glass button, wordmark |

### Dark (follows `prefers-color-scheme`)

| Token | Value |
|---|---|
| `--ground` | `#0c0c0d` |
| `--ground-tile` | `#18181a` |
| `--ink` | `#f5f5f5` |
| `--ink-muted` | `#a3a3a3` |
| `--hairline` | `#262628` |
| `--surface` | `#141416` |
| `--track` | `#1c1c1f` |
| `--blue` / `--blue-hover` | `#3070d3` fill (white labels 4.79:1); `#4a8ae6` for rings and edges only |
| `--yellow` / `--yellow-ink` | `#f8c808` / `#241900` |
| `--red` | `#ef4444` (text use only on dark; the band keeps `#b91c1c`) |
| `--black` | `#f5f5f5` fill with `#0a0a0a` text (the "black" button inverts) |

Glass highlights in dark mode drop to `rgba(255,255,255,.25)` insets and the gloss bands to `.35` so buttons don't glow.

### Area tiles

Each area is an "app tile": a 44–56px rounded square (radius ~28% of size) with a saturated fill, a white glyph, the same gloss and inset highlights as the glass buttons. Fills (both modes): words `#b91c1c` red, logic `#3476d8` blue, math `#f8c808` yellow (glyph `#241900`), code `#0a0a0a` black (dark mode `#2a2a2e`), create `#16a34a` green. The tile is Way's signature object: the five tiles in slot order are the set.

## Type

- **Figtree** via `next/font/google`, weights 400, 600, 800, 900 (variable is fine), self-hosted at build.
  - Display (Done heading, About heading, problem title on desktop): 900, -0.025em, line-height 1.02; 40–56px.
  - Problem title on phone: 800, 26–30px, -0.02em.
  - UI labels and buttons: 600 (quiet) or 900 (glass buttons), 15–17px.
  - Body and problem prompt: 400, 17–18px, line-height 1.6, measure ≤ 66ch.
- **Handwritten accent**: an open Google Fonts marker face close to Uizze's doodle (pick one of `Gochi Hand`, `Shantell Sans`, `Caveat` at 600–700; the builder chooses by comparing), used sparingly for one rotated caption per screen at most and for "Come back tomorrow." Never for problem content or controls.
- **Mono** for code and code results: `JetBrains Mono` or `Geist Mono` 400/600.

## Components

- **Glass button** (`components/ui-way/GlassButton.tsx` or equivalent wrapper around the shadcn `Button`): variants `blue`, `yellow`, `black`, `white`; height 56px on phone (≥44px target), 60–62px on desktop; radius 22–25px; 900 weight; layered inset highlights, soft drop shadow and the 112deg gloss from the measurements; hover darkens fill; active presses `translateY(1px)` and halves the outer shadow; disabled at 60% opacity with no gloss; focus ring a full-strength 3px outline outside the border (visible on every fill).
- **Quiet text button** (Give up, Keep trying): no fill, ink-muted, 600, underline on hover; still ≥44px tall.
- **Pill input / textarea**: surface fill, 1px hairline, radius 20px (inputs) / 18px (textareas), 56px tall input, 17px text, inset `0 1px 2px rgba(0,0,0,.04)`, focus border `--blue` plus the focus ring. Code textarea uses the mono face and a `--track` fill.
- **Choice options**: white pills in a stack, 56px, radius 18px, 1px hairline; selected = 2px `--blue` border and a light blue tint; keep `aria-pressed`.
- **Segmented / tab pills** (only where an existing toggle exists; do not invent navigation). Also used for the EN/UZ language switch on About, Done and NoSet (not on the Problem screen).
- **Set strip**: five small area tiles (28–32px) in slot order in the header. Current = full tile with a 2px ring; solved = full tile with a small white check; gave up / failed = tile at 35% saturation with a small dash; upcoming = outline-only tile. Status is never colour-only (check, dash, ring, outline).
- **Outcome panel**: a white card with radius 24px and the soft shadow. `Solved` heading in Figtree 900 with a hand-drawn squiggle underline in `--blue`. `Not quite` uses `--red` text. `Out of attempts` / `The solution` neutral.
- **Hints**: numbered yellow-dot list items in a `--track` card; the Hint button is a yellow glass button.
- **Done screen**: display heading `That's today.` (Figtree 900, one word may take `--red` as the accent, as on uizze.com); the summary line; the five area tiles large (56px) in a row with their outcome marks; the area map as a list of rows with small tiles and the captions; a full-width **band** in `--blue` or `--red` holding `This week's deep problem` as a white link with a doodle arrow; `Come back tomorrow.` in the handwritten face, rotated −2deg.
- **NoSet / Deep done / About**: same display heading style; About shows the five area tiles with their names, the seven principles as a numbered list with large Figtree 900 numerals, and the links.
- **Ground**: the rounded-tile grid as a CSS background (repeating SVG data URI of a rounded square outline in `--ground-tile`, tile ~72px with 12px gaps), masked to fade out below the header area so it never sits under body text.
- **Doodles**: two or three inline SVG hand-drawn strokes (an arrow, a squiggle underline, a small loop), stroke-linecap round, 2–2.5px, `--ink-muted` or the accent; decorative and `aria-hidden`.

## Motion

Button press (60ms), tile pop when a mark completes (scale 0.9→1, 180ms), problem card slide/fade on Next (≤220ms). Everything inside `@media (prefers-reduced-motion: no-preference)`.

## Accessibility floor

Body and muted text ≥ 4.5:1 on their ground in both modes; button labels ≥ 4.5:1 on their fill (white on `#3070d3` is 4.79:1; `#241900` on `#f8c808` passes); field edges stay light (≈1.4:1) to match the reference, an owner's call; targets ≥ 44px; visible focus on every control; status never by colour alone; no horizontal scroll at 375px.
