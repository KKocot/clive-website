# Clive — Design System Specification

> **Note:** Paleta zaktualizowana 2026-05-07 (Faithful TUI). CLI/TUI aesthetic globalny 2026-05-07.
> Source of truth: `src/styles/tokens.css` + KB pattern `tui-coherent-web-palette`.
> ADR (palette): 69fc7009e61d0c3b00cae5c4

**Project:** Clive (Hive blockchain CLI/TUI wallet) — landing
**Stack:** Astro 5 + Tailwind 4 (CSS-first `@theme`) + MDX + Shiki
**Status:** Beta / WIP
**Site type:** Marketing landing
**Design direction:** CLI/TUI aesthetic — strona jest kontynuacja doswiadczenia TUI, nie odrebnym brandem
**Owner of brief:** design-engineer → handoff to frontend-developer
**Tokens source of truth:** `src/styles/tokens.css`

---

## 1. Mood & Voice

Clive jest narzedziem dla **power userow Hive** — terminalowych, swiadomych developerow. Estetyka: **dark-only, full CLI/TUI** — mono headlines, bracket decorations, box-drawing card frames. Nie retro CRT, nie skeuomorficzny terminal — nowoczesny TUI (jak lazygit, btop, clive). Electric blue (`#3b82f6`) jako primary, navy (`#1a2030`) bg. Paleta i typografia odwzorowuja chrome terminala Clive, zapewniajac wizualna ciaglosc miedzy landing a aplikacja.

Hive red (`#e31337`) wystepuje **tylko jako wskaznik przynaleznosci** (footer "Built for Hive", status indicator).

Voice: rzeczowy, krotki, techniczny. Eyebrow prefixes: `$` (akcje CLI), `//` (komentarze), `##` (sekcje Markdown-style). Drugi person ("Get Clive", "Run it"). Bez marketingowego pufu.

---

## 2. Typografia — CLI/TUI display

### 2.1 Font stack

| Rola | Font | Token |
|---|---|---|
| Display/Headlines | JetBrains Mono Variable | `--font-display: var(--font-mono)` |
| Body/UI | Inter | `--font-sans` |
| Code blocks | JetBrains Mono Variable | `--font-mono` |

> `--font-display` byl `Inter` — od 2026-05-07 wskazuje na `--font-mono`. H1 i nagłowki sekcji sa w 100% mono.

### 2.2 Mono headline metrics

| Token | Wartosc | Powod |
|---|---|---|
| `--tracking-mono-display` | `-0.02em` | Kompensacja szerokich glifow mono |
| `--leading-mono-display` | `1.08` | Zwiety leading dla display — TUI-like |

H1 (`--text-6xl`/`--text-4xl` na mobile): mono lowercase, tracking `-0.02em`, leading `1.08`.
H2 naglowki sekcji: prefiks `##` arialnie ukryty, mono lowercase.

### 2.3 Eyebrow/H2 prefixes (decorative, `aria-hidden="true"`)

| Kontekst | Prefix | Przyklad |
|---|---|---|
| CLI-action (Install, skrypt) | `$` | `$ install` |
| Komentarz/opis | `//` | `// why clive` |
| Markdown heading | `##` | `## features` |

Prefixes wrapowane w `<span aria-hidden="true">` lub implementowane przez `::before` pseudo — screen readery ich nie slysza.

### 2.4 Utility klasy

```css
/* global.css */
.h-display {
  font-family: var(--font-mono);
  letter-spacing: var(--tracking-mono-display);
  line-height: var(--leading-mono-display);
  text-transform: lowercase;
}
.tag-bracket::before { content: "["; color: var(--color-primary-bright); }
.tag-bracket::after  { content: "]"; color: var(--color-primary-bright); }
```

---

## 3. Layout grid

| Property | Mobile | Desktop |
|---|---|---|
| Container max-width | 100% | 1200px (`--container-max`) |
| Gutter | 24px (`--container-gutter`) | 32px (`--container-gutter-lg`) |
| Section vertical rhythm | 80px (`--section-y`) | 128px (`--section-y-lg`) |
| Grid columns | 4 | 12 (CSS Grid) |
| Column gap | 16px | 24px |

**Hero height:** `min-height: clamp(560px, 80vh, 760px)` — NIE 100vh (dynamiczny viewport mobile).

**Sticky nav:** top sticky z `backdrop-filter: blur(12px)`, opaque scroll-state.

---

## 4. Hierarchia stron

**Strony:** `index.astro` (landing) · `404.astro`

### 4.1 Landing (`index.astro`) — sekcje od gory

**Nav (sticky):** Clive wordmark · links: Features/Install/Demo/Docs · GitLab icon · CTA "Get Clive". Mobile: hamburger → MobileNav island.

**Hero:** Eyebrow `<span aria-hidden>$</span> clive --help` → H1 mono lowercase + cursor `▊` z CSS blink (`--cursor-blink-duration: 1.06s`, `prefers-reduced-motion` respect) → subhead max 56ch → CTA group (primary "Get Clive" anchor `#install` + secondary "View on GitLab"). Background: `var(--hero-gradient)` + grid SVG `opacity: 0.03`.

**Features:** Eyebrow `// why clive`, H2 `## features`. 6 kart w gridzie, ikony bracket ASCII:
- `[||]` — dual interface
- `[#]` — beekeeper encryption
- `[+]` — mouse TUI
- `[@]` — profile system
- `[$]` — blockchain ops
- `[!]` — alarm/status

**Install:** Eyebrow `$ install`, H2 `## install`. Tabbed island (Linux/macOS/Windows WSL).

**Demo:** Eyebrow `// live demo`, H2 `## demo`. Dual-pane TUI mockup z F-keys footer (TUI chrome).

**Footer:** `// built for hive blockchain`, `[MIT]` link, `[v...]` version. "Hive" w `--color-hive`. `aria-hidden` na dekoracyjnych glyphach.

### 4.2 404 — TerminalFrame centered 640px, ASCII "404", ghost buttons Home/GitLab.

---

## 5. Komponenty

### 5.1 `Button.astro`

Variants: `primary` | `secondary` | `ghost`. Sizes: `sm`/`md`/`lg`. Radius `--tui-radius` (2px — sharp TUI edges).

- **Primary:** bg `--color-primary` → hover bg `--color-primary-bright`, color `#0b1224`. **Brak box-shadow glow** (usunieto).
- **Secondary:** outline 1px `--color-border-bright`, color `--color-primary-bright`.
- **Ghost:** mono lowercase, `[ ... ]` brackets via `::before`/`::after`, `aria-hidden` przez pseudo — brak DOM node.

Focus-visible: `box-shadow: var(--shadow-focus-ring)`, border-radius `--tui-radius`.

### 5.2 `Card.astro`

**Pelny rewrite (2026-05-07) — usunieto glow/blur/glassmorphism, zastapiono TUI panel.**

Props: `title?`, `glow?` (dla Hive variant), `as?`, `class?`. Usunieto prop `fade`.

Struktura:
```html
<article class="card card--tui" data-has-title="true">
  <span class="card__titlebar" aria-hidden="true"><!-- title --></span>
  <div class="card__inner"><slot /></div>
</article>
```

Title bar via pseudo-elements:
```css
.card__titlebar::before { content: "╭─ "; color: var(--color-border-bright); }
.card__titlebar::after  { content: " ─╮"; color: var(--color-border-bright); }
```

Karta resting: `border: var(--tui-border-dim)` (blue 40%). Hover: `border-color: var(--color-border-bright)` (blue 100%) + `translateY(-1px)`. Zero blur, zero glow box-shadow.

Variant `glow-hive`: border Hive red zamiast blue.

> Poprzednia implementacja uzywala `card__glow` (blur 48px absolute) + `card__fade` (gradient overlay) + glassmorphism. Wszystkie usuniete.

### 5.3 `Badge.astro`

Variants: `neutral` | `beta` | `success` | `warning` | `danger`. Beta: crimson outline + dot pulse (szczegoly w §8).

### 5.4 `TerminalFrame.astro`

`<figure>` z `terminal__bar` (traffic-light dots aria-hidden) + `<pre class="terminal__body">`. Bg `--color-bg-surface`, border `--tui-border-dim`, radius `--tui-radius`.

### 5.5 `CodeBlock.astro` — Shiki `github-dark-default`, CopyButton top-right, optional title bar.

### 5.6 `CopyButton.tsx` (island) — Copy → Check 1.5s, `aria-live="polite"`, `client:visible`.

### 5.7 `InstallTabs.tsx` (island) — ARIA tablist, ArrowLeft/Right, auto-detect OS, `client:visible`.

### 5.8 `MobileNav.tsx` (island) — full-screen overlay, focus trap, ESC close, `client:load`.

---

## 6. Motion guidelines

**Filozofia:** pure CSS transitions + `@starting-style` CSS feature. Zero motion library.

### Cursor blink (Hero H1)

```css
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
.hero__cursor {
  animation: cursor-blink var(--cursor-blink-duration) step-end infinite;
}
@media (prefers-reduced-motion: reduce) {
  .hero__cursor { animation: none; opacity: 1; }
}
```

Token: `--cursor-blink-duration: 1.06s`.

### Animacje per element

| Element | Animacja | Duration | Trigger |
|---|---|---|---|
| Hero H1 + sub + CTA | opacity 0→1, translateY 8px→0, stagger 50ms | 600ms | onload |
| Card hover | translateY 0→-1px, border-color dim→bright | 250ms | hover |
| Button primary hover | bg shift | 150ms | hover |
| Button press | translateY 0→1px | 75ms | active |
| Section reveal | opacity 0→1, translateY 16px→0 | 400ms | `@starting-style` |
| Beta dot pulse | scale 1→1.6, opacity 0.8→0 (ring) | 1600ms | infinite |

### NIE rob

- Brak box-shadow glow na hoverach (usunieto)
- Brak parallax (perf + motion sickness)
- Brak `position: top/left/width/height` w transitions — TYLKO `transform` + `opacity`
- Brak ciaglych animacji poza cursor blink i beta dot (oba wylaczone przy reduced-motion)

### Reduced-motion

Globalny override w `tokens.css` (`@media (prefers-reduced-motion: reduce)` zeruje duration). Per-component: cursor blink → statyczny glyph, beta dot → brak pulsu, section reveals → opacity 1 od razu.

---

## 7. A11y AA

- **Kontrasty (vs `--color-bg #1a2030`):**
  - `--color-text` `#ffffff`: 17.4:1 ✓
  - `--color-text-muted` `#a8b1c4`: 7.5:1 ✓
  - `--color-text-subtle` `#9aa6bd`: 6.6:1 ✓ (bump z poprzedniej wartosci, AA na wszystkich surface wlacznie z `#2e3850`)
  - `--color-primary` na bg: 5.1:1 ✓

- **Decorative glyphs (zasada globalna):** `$`, `//`, `##`, `▊`, `╭─`, `─╮`, bracket ASCII icons — ZAWSZE w `<span aria-hidden="true">` lub w `::before`/`::after` pseudo. Nigdy jako tresc semantyczna. Screen readery ich nie slysza.

- **Focus rings:** `box-shadow: var(--shadow-focus-ring)`, border-radius `--tui-radius`. Na `:focus-visible`, NIE `:focus`. Nigdy `outline: none` bez zamiennika.

- **Skip link:** `BaseLayout.astro` — `<a href="#main">Skip to content</a>`.

- **Semantic HTML:** `<nav>`, `<main>`, `<section aria-labelledby>`, `<footer>`. H1 raz na stronie.

- **`aria-current="page"`** na aktywnym linku nav.

- **Mobile nav:** focus trap + ESC + `aria-modal="true"` + body scroll lock.

- **Tabs (Install):** `role="tablist"`, `role="tab"`, `aria-selected`, keyboard arrows.

---

## 8. Beta badge — 2 warianty

### Wariant A (REKOMENDOWANY) — pill outline crimson + dot pulse

CSS: bg `rgba(196,75,110,0.12)`, border 1px `var(--color-accent-danger)` (crimson `#c44b6e`), color `var(--color-accent-danger-text)` (`#ff6b8a`), dot 6px + ring pulse `1.6s infinite`, reduced-motion: ring hidden.

### Wariant B — textual muted

`<small>v0.1 · Work in Progress</small>` pod H1.

**Rekomendacja: Wariant A.** Dot pulse to sprawdzony pattern dla "live/beta status".

---

## 9. Brand integration — Hive `#e31337`

**Zasada:** sparingly — max 3 lokacje.

**Gdzie UZYWAC:**
1. Footer — slowo "Hive" w `--color-hive`
2. Favicon accent
3. Network status indicator (v1.1+)

**Gdzie NIE UZYWAC:** CTA, error states, backgrounds >24x24px, linki w prose.

---

## 10. TUI-specific tokens

Nowe tokeny dodane w redesignie 2026-05-07:

| Token | Wartosc | Zastosowanie |
|---|---|---|
| `--font-display` | `var(--font-mono)` | Display/headline font — globalny flip do mono |
| `--cursor-blink-duration` | `1.06s` | Hero cursor animation |
| `--cursor-glyph-width` | `0.6em` | Cursor `▊` width reserve |
| `--tui-border` | `1px solid var(--color-border-bright)` | Fully-bright TUI panel border |
| `--tui-border-dim` | `1px solid color-mix(...40%)` | Dimmed/resting panel border |
| `--tui-radius` | `var(--radius-xs)` = 2px | Sharp TUI edges (zamiast rounded) |
| `--tui-title-bar-h` | `1.5rem` | Rezerva wysokosci title bar kart |
| `--tracking-mono-display` | `-0.02em` | Mono headline letter-spacing |
| `--leading-mono-display` | `1.08` | Mono headline line-height |

---

## 11. Performance budgets

| Metric | Budget | Notes |
|---|---|---|
| LCP | < 2.0s | Hero H1 text-only (mono font preload obowiazkowy) |
| CLS | < 0.05 | Aspect-ratio reserve na terminal frame |
| INP | < 200ms | Tabs: pure JS, brak heavy frameworkow |
| TBT | < 100ms | 4 mini islandy |
| Total JS (gzipped) | < 50kb | Astro static + ~25kb realistic |
| Total CSS (gzipped) | < 20kb | Tailwind 4 JIT + tokens |

**Fonts:** Inter + JetBrains Mono Variable woff2 lokalne, `font-display: swap`, `<link rel="preload">`. **Zakaz zewnetrznych CDN (Google Fonts etc.).**

---

## Pozostale dokumenty

- [docs/HANDOFF.md](docs/HANDOFF.md) — priorytety implementacji (P0/P1/P2), pakiety, A11y test plan
- [docs/OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md) — nierozstrzygniete decyzje wymagajace eskalacji
- [docs/SEO_ASSETS.md](docs/SEO_ASSETS.md) — favicon, OG images, workflow generowania
