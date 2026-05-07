# Clive — Design System Specification

> **Note:** Paleta zaktualizowana 2026-05-07 (Faithful TUI).
> Source of truth: `src/styles/tokens.css` + KB pattern `tui-coherent-web-palette`.
> ADR: 69fc7009e61d0c3b00cae5c4

**Project:** Clive (Hive blockchain CLI/TUI wallet) — landing
**Stack:** Astro 5 + Tailwind 4 (CSS-first `@theme`) + MDX + Shiki
**Status:** Beta / WIP
**Site type:** Marketing landing
**Reference aesthetic:** [toolstack.framer.website](https://toolstack.framer.website) — modern developer-tool, dark-only
**Owner of brief:** design-engineer → handoff to frontend-developer
**Tokens source of truth:** `src/styles/tokens.css`

---

## 1. Mood & Voice

Clive jest narzedziem dla **power userow Hive** — terminalowych, swiadomych developerow. Estetyka: **dark-only, terminal-inspired ale nowoczesna** (nie retro CRT, nie skeuomorficzny terminal). Electric blue (`#3b82f6`) jako primary, navy (`#1a2030`) bg — TUI-coherent z CLI: paleta odwzorowuje chrome terminala Clive (panele, ramki, alarmy), zapewniajac wizualna ciaglosc miedzy landing a aplikacja. Hive red (`#e31337`) wystepuje **tylko jako wskaznik przynaleznosci** (footer "Built for Hive", favicon korner, status indicator), aby nie kolidowac z primary blue i nie wywolywac podswiadomego "alarm/error".

Voice: rzeczowy, krotki, techniczny. Drugi person ("Get Clive", "Run it"). Bez marketingowego pufu. Beta WIP komunikowane otwarcie ale bez przesady — power user ceni szczerosc, nie panike.

---

## 2. Layout grid

| Property | Mobile | Desktop |
|---|---|---|
| Container max-width | 100% | 1200px (`--container-max`) |
| Gutter | 24px (`--container-gutter`) | 32px (`--container-gutter-lg`) |
| Section vertical rhythm | 80px (`--section-y`) | 128px (`--section-y-lg`) |
| Grid columns | 4 | 12 (CSS Grid) |
| Column gap | 16px | 24px |

**Hero height decision:** **NIE 100vh.** Uzyj `min-height: clamp(560px, 80vh, 760px)` z naturalna zawartoscia. Powod: 100vh psuje sie na mobilach z dynamicznym viewport (URL bar collapse) oraz blokuje immediate visual proof. Powyzej hero jest natychmiast widoczny pierwszy fragment Features (tease) na desktop FHD+, co w marketing-pattern (Z-pattern) zwieksza scroll-depth.

**Sticky elementy:** nav top sticky (z `backdrop-filter: blur(12px)`, opaque scroll-state).

---

## 3. Hierarchia stron

**Strony:** `index.astro` (landing) · `404.astro`

### 3.1 Landing (`index.astro`) — sekcje od gory

**Nav (sticky):** Clive wordmark + Beta badge (wariant A §7) · links: Features/Install/Demo/Docs · GitLab icon + CTA "Get Clive". Mobile: hamburger → MobileNav island.

**Hero:** Eyebrow mono `// hive blockchain wallet · v0.1 beta` → H1 "Power user wallet for Hive." (`--text-6xl`/`--text-4xl`) → subhead max 56ch → CTA group (primary "Get Clive" anchor `#install` + secondary "View on GitLab") → TerminalFrame ASCII boot-up kolumna prawa (autoplay 1x, NO loop). Background: `var(--gradient-hero-radial)` + grid SVG `opacity: 0.03`.

**Features:** 5 kart `grid-cols-3` + `grid-cols-2` (desktop), stack mobile. Karty: Dual interface, Beekeeper encryption, Mouse-driven TUI, Profile system, Full blockchain ops. Tint: indigo/emerald/amber. Pełna tabela feature kart → [docs/HANDOFF.md](docs/HANDOFF.md).

**Install (tabbed island):** Linux / macOS / Windows (WSL). Auto-detect `navigator.userAgent`, fallback Linux. `CodeBlock` + `CopyButton` + beta warning callout amber.

**Demo TUI:** TerminalFrame full-width (max 960px, 16:10). Placeholder — TODO: asciinema/MP4. Fallback: static screenshot.

**Footer:** 4 kolumny (wordmark+tagline / Product / Resources / Build info). Bottom: copyright + "Built for **Hive**" (`--color-hive` na "Hive").

### 3.2 404 — TerminalFrame centered 640px, ASCII "404", ghost buttons Home/GitLab.

---

## 4. Komponenty

### 4.1 `Button.astro`
Variants: `primary` | `secondary` | `ghost`. Sizes: `sm`/`md`/`lg`. Radius `--radius-md`. Focus-visible: `box-shadow: var(--shadow-focus-ring)` — nigdy `outline:none` bez zamiennika. Press: `translateY(1px)`. Primary hover: bg `--color-accent-primary-hover` + `--shadow-glow-blue` + arrow `translateX(2px)`. Secondary: outline 1px `--color-border-strong`. Ghost: text-muted bg-none.

### 4.2 `Card.astro`
Variants: `default` | `tint-emerald` | `tint-indigo` | `tint-amber` | `tint-hive`. Struktura: `card__glow` (blur 48px absolute) + `card__inner` (icon/title/body slots) + `card__fade` (gradient-card-fade bottom 35%). Hover: `translateY(-2px)`, border strong, glow opacity 1. Transition: `var(--duration-base) var(--ease-out-quint)`.

### 4.3 `Badge.astro`
Variants: `neutral` | `beta` | `success` | `warning` | `danger`. `--text-xs font-weight-medium tracking-wide`, padding `2px 8px`, radius `--radius-full`. Beta: bg `rgba(196,75,110,0.12)`, border 1px `var(--color-accent-danger)` (crimson), text `var(--color-accent-danger-text)` (`#ff6b8a`) + dot pulse 6px (patrz §7).

### 4.4 `TerminalFrame.astro`
`<figure>` z `terminal__bar` (36px, dots red/amber/green aria-hidden) + `<pre class="terminal__body">`. Bg `--color-bg-surface`, border 1px, radius `--radius-lg`. Body: `--font-mono --text-sm`, scroll horizontal.

### 4.5 `CodeBlock.astro` — Shiki `github-dark-default`, NO line numbers v1, slot CopyButton top-right, optional title bar.

### 4.6 `CopyButton.tsx` (island) — Copy -> Check icon 1.5s, `aria-live="polite"`. `client:visible`.

### 4.7 `InstallTabs.tsx` (island) — ARIA tablist, ArrowLeft/Right, auto-detect OS. `client:visible`.

### 4.8 `MobileNav.tsx` (island) — full-screen overlay, wlasna implementacja focus trap (~30 linii), ESC close, auto-focus first element, focus return to trigger. `client:load`.

---

## 5. Motion guidelines

**Filozofia:** pure CSS transitions + IntersectionObserver dla reveals. **Zero motion library** w v1 (nie potrzebujemy framer-motion ani Solid spring — perf budget LCP <2.0s, JS <50kb wymusza minimal).

### Animacje per element

| Element | Animacja | Duration | Easing | Trigger |
|---|---|---|---|---|
| Hero (H1, sub, CTA) | opacity 0->1, translateY 8px->0, stagger 50ms | 600ms | `--ease-out-expo` | onload |
| Hero terminal ASCII | typewriter (CSS `@keyframes` lub setInterval JS) | per-line 60ms | linear | onload, no loop |
| Card hover | translateY 0 -> -2px, shadow `--shadow-md`, border lighten | 250ms | `--ease-out-quint` | hover |
| Card glow on hover | opacity 0.5 -> 1 | 250ms | `--ease-out-quad` | hover |
| Button primary hover | bg shift, glow, arrow translateX +2px | 150ms | `--ease-out-quad` | hover |
| Button press | translateY 0 -> 1px | 75ms | `--ease-out-quad` | active |
| Section reveal | opacity 0->1, translateY 16px->0 | 400ms | `--ease-out-quint` | IntersectionObserver `threshold: 0.15` |
| Beta dot pulse | scale 1 -> 1.4, opacity 0.8 -> 0 (ring) | 1600ms | `--ease-out-quad` | infinite (chyba ze reduced-motion) |
| Tab change | crossfade content opacity 0->1 | 150ms | `--ease-out-quad` | click |
| Mobile nav open/close | translateX 100% -> 0, opacity 0->1 | 250ms | `--ease-out-expo` | toggle |
| Copy success | icon rotate-in (Copy -> Check) | 200ms | `--ease-out-quint` | click |
| Stagger inside list | 30ms delay between items | — | — | reveal |

### NIE rob

- Brak parallax (perf + motion sickness)
- Brak agresywnego skalowania (>1.05) na hoverach
- Brak autoplay video z dzwiekiem
- Brak `position: top/left/width/height` w transitions — TYLKO `transform` + `opacity` (GPU)
- Brak ciaglych animacji w viewport (poza beta dot pulse — i ta wylaczona przy reduced-motion)

### Reduced-motion

Globalny override jest juz w `tokens.css` (`@media (prefers-reduced-motion: reduce)` zeruje duration). Plus per-component:
- Hero ASCII: pokazuje koncowy frame od razu, bez typewriter
- Beta dot: brak pulsu, statyczny dot
- Section reveals: opacity 1, translate 0 od razu

---

## 6. A11y AA

- **Kontrasty (zweryfikowane vs `--color-bg #111113`):**
  - `--color-text` 18.7:1 ✓
  - `--color-text-muted` 7.2:1 ✓
  - `--color-text-subtle` 4.8:1 ✓ (AA dla normal text)
  - `--color-accent-primary` na bg: 5.1:1 ✓ (AA dla normal text)
  - Beta badge text na bg: 5.1:1 ✓
  - Test wymagany dla `--color-hive #e31337` na bg: ~4.6:1 — OK dla normal, **NIE uzywac jako primary text long-form**

- **Focus rings:** `box-shadow: var(--shadow-focus-ring)` (2px offset bg-color + 2px indigo). Aplikowane na `:focus-visible`, NIE `:focus`. Nigdy `outline: none` bez zamiennika.

- **Skip link:** w `BaseLayout.astro` pierwszy `<a href="#main">Skip to content</a>`, default `position: absolute; left: -9999px`, on focus widoczny top-left z `--shadow-focus-ring`.

- **Semantic HTML:** `<nav>`, `<main>`, `<article>`, `<section>` z `aria-labelledby`, `<footer>`. H1 raz na strone, pozniej kolejnosc h2-h3 bez przeskokow.

- **`aria-current="page"`** na aktywnym linku nav.

- **Prose w postach:** min 18px (`--text-lg`), line-height `--leading-prose` (1.75), max-width 720px (~70-75ch przy 18px).

- **Mobile nav:**
  - Focus trap (Tab/Shift+Tab cycle wewnatrz panelu)
  - ESC -> close, focus wraca do triggera
  - `aria-modal="true"`, `role="dialog"`, `aria-label="Main menu"`
  - Body scroll lock (`overflow: hidden` na `<html>`)

- **Forms:** brak w v1 (jesli newsletter -> labels + inline validation on blur, NIE placeholder-as-label).

- **Images:** `alt=""` (decorative) lub opisowe.

- **Code blocks:** `<pre>` z `tabindex="0"` zeby keyboard mogl scrollowac horyzontalnie.

- **Tabs (Install):** `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`, `aria-labelledby`. Keyboard arrows.

- **Reduced motion:** patrz §5.

- **Color-only meaning:** beta status nie tylko kolorem (badge text "Beta"); status indicators z ikona + tekstem.

---

## 7. Beta badge — 2 warianty

### Wariant A (REKOMENDOWANY) — pill outline crimson + dot pulse

```html
<span class="badge badge--beta" aria-label="Beta version">
  <span class="badge__pulse" aria-hidden="true">
    <span class="badge__dot" />
    <span class="badge__ring" />
  </span>
  Beta
</span>
```

CSS:
- Container: `--text-xs font-weight-medium tracking-wide`, padding `2px 10px 2px 8px`, radius `--radius-full`, bg `rgba(196,75,110,0.12)`, border 1px `var(--color-accent-danger)` (crimson `#c44b6e`), color `var(--color-accent-danger-text)` (`#ff6b8a`), gap 6px
- Dot: 6px circle, bg `currentColor`, full opacity
- Ring: 6px circle, border 1px `currentColor`, animate `pulse 1.6s var(--ease-out-quad) infinite` (scale 1 -> 1.6, opacity 0.8 -> 0)
- Reduced-motion: ring opacity 0 (statyczny dot)

**Zalety:** wyrazny, nie krzykliwy, pasuje do tech-aesthetic, dot daje "live" feeling bez bycia denerwujacym.

### Wariant B — textual muted

```html
<h1>
  Power user wallet for Hive.
  <small class="hero__version">v0.1 · Work in Progress</small>
</h1>
```

CSS: small jako block element pod H1, `--text-sm --color-text-subtle font-weight-regular tracking-normal`.

**Zalety:** zerowy szum wizualny. **Wady:** mniej widoczny, latwo przeoczyc — nie spelnia roli "ostrzezenia" dla power-userow ktorzy chca wiedziec co instaluja.

### Rekomendacja: **Wariant A**.
Pasuje do toolstack-style aesthetic, dot pulse to sprawdzony patern dla "live/beta status" (Linear, GitHub, Vercel uzywaja podobnego). W navi top + raz w hero (obok H1 lub jako eyebrow). NIE powtarzac w kazdej sekcji.

---

## 8. Brand integration — Hive `#e31337`

**Zasada:** sparingly. Klin wizualny, nie struktura.

**Gdzie UZYWAC:**
1. **Footer link** "Built for Hive blockchain" — slowo "Hive" w `--color-hive`, hover `--color-hive-muted`
2. **Favicon accent** — maly element (np. dot lub akcent litery `c` w mark) w `--color-hive`, reszta w `--color-text`
3. **Network status indicator** (jesli pojawi sie w v1.1+) — kropka z `--color-hive` przy "Connected to Hive mainnet"
4. **Optional:** Card variant `tint-hive` rezerwowany dla rzadkich akcentow Hive-related (nie uzywac w hero/features)

**Gdzie NIE UZYWAC:**
- Primary CTA (kolizja z indigo, podswiadome "alarm")
- Error states (nadal `--color-accent-danger #ef4444` — Hive red jest brand, nie semantic)
- Backgrounds wieksze niz 24x24px (zbyt agresywne na czarnym)
- Linki w prose (mylace — uzytkownik bedzie myslal o akcji destruktywnej)

**Bordowy fallback `--color-hive-muted #b81530`:** uzywaj kiedy Hive red wystepuje obok indigo (zeby nie konkurowaly), np. card tint glow `rgba(184, 21, 48, 0.14)` zamiast `rgba(227, 19, 55, 0.14)`.

---

## 9. Performance budgets

| Metric | Budget | Notes |
|---|---|---|
| LCP | < 2.0s | Hero H1 jest LCP — text-only, font preload obowiazkowy |
| CLS | < 0.05 | Reserve aspect-ratio na obrazach + terminal frame |
| INP | < 200ms | Tabsy: setState pure JS, brak heavy frameworkow |
| TBT | < 100ms | islands tylko 4 (CopyButton, MobileNav, InstallTabs + ewentualny TOC) |
| Total JS (landing, gzipped) | < 50kb | Astro static + 4 mini islandy = ~25kb realistic |
| Total CSS (gzipped) | < 20kb | Tailwind 4 JIT + tokens |
| Hero LCP image (jesli) | nie | LCP to text, NIE image — zero blokady |
| Fonts | Inter + JetBrains Mono local woff2, `font-display: swap`, `<link rel="preload">` dla Inter regular+semibold |
| External fonts CDN | **ZAKAZANE** (Google Fonts, etc.) |

**Asset strategy:**
- Inter: `inter-regular.woff2`, `inter-medium.woff2`, `inter-semibold.woff2`, `inter-bold.woff2` w `public/fonts/` z `@font-face` w `tokens.css` lub osobnym `fonts.css`
- JetBrains Mono: `jetbrains-mono-regular.woff2`, `jetbrains-mono-medium.woff2`
- Subset Latin only (woff2-subset jesli dostepny)
- Preload tylko Inter regular (najczesciej widoczny) — pozostale lazy

**Images:**
- Astro `<Image>` z `format="avif,webp"`, `loading="lazy"` poza fold
- OG images: 1200x630 PNG, jednorazowo wygenerowane (nie real-time)

---

## Pozostale dokumenty

- [docs/HANDOFF.md](docs/HANDOFF.md) — priorytety implementacji (P0/P1/P2), pakiety, A11y test plan, kolejnosc plikow, czego nie robic
- [docs/OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md) — nierozstrzygniete decyzje wymagajace eskalacji
- [docs/SEO_ASSETS.md](docs/SEO_ASSETS.md) — favicon, OG images, workflow generowania (source of truth)
