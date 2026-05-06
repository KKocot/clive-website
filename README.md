# clive-website

Official website and blog for **Clive** — Hive blockchain CLI/TUI wallet.

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Starts local dev server at `http://localhost:4321`.

## Build

```bash
pnpm build
```

Output goes to `dist/`.

## Preview

```bash
pnpm preview
```

## Tech stack

- [Astro 5](https://astro.build) — static site generator
- [Tailwind CSS 4](https://tailwindcss.com) — CSS-first, via `@tailwindcss/vite`
- [SolidJS](https://solidjs.com) — interactive islands (CopyButton, MobileNav, InstallTabs)
- [MDX](https://mdxjs.com) — blog content
- TypeScript strict mode

## Deploy notes

Target: Cloudflare Pages (TBD).

Set `site` in `astro.config.mjs` to final domain before first deploy.
