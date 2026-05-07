# Clive — Handoff Notes

**Handoff status:** READY FOR IMPLEMENTATION
**Next agent:** `frontend-developer` (Astro 5 + Tailwind 4 specialist)
**Followup agent po implementacji:** `ui-harden` (a11y + perf audit)

---

## SEO / OG (overview)

Pelna specyfikacja favicon, OG images i workflow generowania: **[docs/SEO_ASSETS.md](./SEO_ASSETS.md)** (source of truth).

Skrot wymagan per strona:

- `<title>`: `<page-title> · Clive` (max 60 chars)
- `<meta name="description">`: 150-160 chars, action-oriented
- `<meta property="og:type">`: `website` (landing)
- `<link rel="canonical">`: zawsze
- `<meta name="twitter:card" content="summary_large_image">` + `twitter:image` = OG image
- Sitemap: `@astrojs/sitemap` — sprawdz config

### Schema.org (JSON-LD)

- Landing: `SoftwareApplication` (name, applicationCategory: "DeveloperApplication", operatingSystem: "Linux, macOS, Windows")
- Wstrzyknac przez `<script type="application/ld+json">` w `BaseLayout.astro` slot

---

## Priorytet implementacji

1. **P0** — `tokens.css` (DONE), `BaseLayout.astro` (font preload, skip link, theme), `Button`, `Card`, `Badge`, `TerminalFrame`, `CodeBlock`, `Hero`, `Features`, `Install`, `Footer`
2. **P1** — `Demo` (placeholder), `404.astro`, `MobileNav`, `CopyButton`, `InstallTabs`
3. **P2** — OG image generator, schema.org

---

## Pakiety — tylko z whitelist (sprawdzone)

Z istniejacego `node_modules` widze: Astro 5.18.1, Sharp 0.34.5, `@astrojs/sitemap` 3.7.2, Zod 3.25.76. **Nie dodawaj nowych pakietow bez decision w KB.**

**Potrzebne (sprawdz czy juz sa, jesli nie -> instalacja):**
- `astro` 5.18.x (jest)
- `@astrojs/sitemap` (jest)
- `tailwindcss` 4.x — CSS-first, **NIE config JS**
- `@tailwindcss/vite` — plugin Vite dla Tailwind 4
- `shiki` lub `astro-expressive-code` — dla kod highlight (`shiki` lzejszy, `expressive-code` ladniejszy ale +20kb)
- `lucide-astro` lub inline SVG icons (rekomenduje **inline SVG** dla performance — kazda ikona 2-3 uses, brak runtime tree-shake potrzebnego)
- `sharp` (jest, do Astro Image)

**ZABRONIONE bez decision:**
- `framer-motion` (nie jest potrzebny — pure CSS)
- `gsap` (nie jest potrzebny)
- `swiper`, `embla-carousel` (brak karuzel w designie)
- `focus-trap-react` (focus trap implementuj recznie, ~30 linii)
- jakiekolwiek pakiety z dat <30 dni od opublikowania (supply chain ryzyko)

---

## Stack-specific instructions (Astro 5 + Tailwind 4)

**Tailwind 4 setup** (`astro.config.mjs`):
```js
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

**`global.css`**:
```css
@import "tailwindcss";
@import "./tokens.css";
/* potem custom layers jesli potrzeba */
```

**Tokens w Tailwind klasach** — Tailwind 4 generuje utilities z `@theme` automatycznie:
- `--color-bg` -> `bg-bg`, `text-bg`, `border-bg`
- `--color-accent-primary` -> `bg-accent-primary`, etc.
- `--font-mono` -> `font-mono`
- `--space-8` -> `p-8`, `mt-8` (jesli zmapowane na Tailwind scale)

**Islands hydration:** `client:load` tylko dla MobileNav (potrzebne od razu do interakcji), `client:visible` dla CopyButton i InstallTabs (lazy).

**Shiki integration:** w `astro.config.mjs`:
```js
markdown: {
  shikiConfig: { theme: 'github-dark-default', wrap: false }
}
```

---

## A11y test plan

Frontend-developer po implementacji uruchamia (handoff do agenta `ui-harden`):
1. **axe-core** scan (Playwright + `@axe-core/playwright`) — zero violations critical/serious
2. **Keyboard-only nav test:** od top do bottom przez Tab, sprawdz focus visible na kazdym elemencie, ESC zamyka MobileNav, Enter aktywuje wszystkie buttony
3. **Screen reader smoke test** (VoiceOver macOS): hero H1 czyta sie pierwszy, nav landmarks rozpoznawalne, beta badge ma label
4. **Reduced-motion test:** Safari devtools -> Render -> Emulate `prefers-reduced-motion: reduce` — wszystkie animacje znikaja
5. **Lighthouse:** desktop >=98 (perf, a11y, best-practice, SEO), mobile >=92 (perf), CI gate
6. **Color contrast verify:** axe juz to robi, plus manualny check `--color-text-subtle` na `--color-bg-surface` (nie tylko vs `--color-bg`)
7. **Mobile touch targets:** wszystkie >=44x44px (bottom nav links, CTA, copy buttons)

---

## Implementacja — kolejnosc plikow

1. `src/styles/tokens.css` DONE
2. `src/styles/global.css` (import Tailwind + tokens + base resets)
3. `astro.config.mjs` (Tailwind plugin, MDX, Shiki)
4. `src/layouts/BaseLayout.astro` (head, fonts preload, skip link, SEO slots)
5. `src/components/ui/Button.astro`
6. `src/components/ui/Card.astro`
7. `src/components/ui/Badge.astro`
8. `src/components/ui/TerminalFrame.astro` (NEW — utworzyc)
9. `src/components/ui/CodeBlock.astro` (NEW — utworzyc)
10. `src/components/sections/*` (Hero, Features, Install, Demo, Footer)
11. `src/components/islands/*` (MobileNav, CopyButton, InstallTabs)
12. `src/pages/index.astro`
13. `src/pages/404.astro`
14. SEO: `src/components/seo/SEO.astro`, OG image generator

---

## Co NIE robic samodzielnie (wracaj do design-engineera)

- Zmiany w paletce kolorow (np. inny hue dla primary)
- Inny rytm sekcji (nie 80/128 — wymaga rebriefa)
- Dodanie nowego componenta nie wymienionego tu
- Zmiana motion philosophy (np. dodanie GSAP, parallax)
- Inna typografia / inna H1 size scale
- Inny site-type focus (np. zamiana na full marketing z lead capture)
