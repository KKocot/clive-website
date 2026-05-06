# Clive — Open Questions (eskalacja)

1. **License Clive:** MIT czy AGPL? Footer license badge zalezy. Prosze potwierdzic z repo `LICENSE`.
2. **GitLab repo URL:** dokladny `https://gitlab.syncad.com/<group>/clive`? Potrzebne do nav + footer + CTA.
3. **Wersja w buildzie:** czy w v1 wpisujemy hardcoded `v0.1.0-beta` czy czytamy z `package.json` build-time? Sugeruje build-time przez Astro `import.meta.env`.
4. **Demo TUI assets:** kto dostarcza asciinema/MP4? Jesli brak na launch, idziemy ze static screenshot + caption "Live demo coming soon" (pattern OK, ale zaznaczyc).
5. **Newsletter:** confirmed brak w v1. Czy w v1.1 planowany? Wplywa na footer space allocation.
6. **Author na blogu:** czy jeden czy multi-author? Wplywa na frontmatter schema.
7. **Cover images blog:** czy required czy optional? (rekomenduje optional z fallbackiem placeholder).
8. **i18n:** czy planowane w v1? Jesli tak — `astro:i18n` setup od razu, inaczej kosztowny refactor.

---

## Files created / updated

- `src/styles/tokens.css` — pelna implementacja Tailwind 4 `@theme` + reduced-motion + selection
- `design-system.md` — actionable spec dla frontend-developera (§1-§9)
- `docs/HANDOFF.md` — implementation priorities, SEO overview, A11y test plan
- `docs/OPEN_QUESTIONS.md` — this file
- `docs/SEO_ASSETS.md` — favicon / OG images source of truth
