# clive-website

Official website and blog for **Clive** — Hive blockchain CLI/TUI wallet.

## Documentation

- [design-system.md](./design-system.md) — Design system spec, tokens, layout, A11y
- [docs/HANDOFF.md](./docs/HANDOFF.md) — Implementation priorities, A11y test plan, build status
- [docs/OPEN_QUESTIONS.md](./docs/OPEN_QUESTIONS.md) — Outstanding decisions
- [docs/SEO_ASSETS.md](./docs/SEO_ASSETS.md) — Favicon, OG images, generation workflow

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

## Project structure

```
clive-website/
├── public/
│   ├── _headers         # Cloudflare Pages: CSP + cache headers
│   ├── _redirects       # Cloudflare Pages: URL redirects
│   ├── favicon.svg
│   └── og-default.svg   # OpenGraph fallback image
├── src/
│   ├── components/      # Astro + SolidJS components
│   ├── config/
│   │   └── links.ts     # Centralized external URL registry (single source of truth)
│   ├── content/
│   │   └── blog/        # MDX blog posts (add .mdx files here)
│   ├── content.config.ts # Astro 5 Content Layer schema (Zod)
│   ├── layouts/         # BaseLayout, BlogLayout
│   ├── pages/           # File-based routing (index.astro, blog/[slug].astro)
│   └── styles/
│       ├── tokens.css   # Tailwind 4 @theme design tokens
│       └── global.css   # @import "tailwindcss" entry point
├── astro.config.mjs
├── wrangler.toml        # Cloudflare Pages project config
└── tsconfig.json
```

## Adding blog content

Blog posts live in `src/content/blog/`. Each post is an `.mdx` file with frontmatter:

```mdx
---
title: "Post title"
description: "Short description shown in listing and meta tags"
pubDate: 2026-06-01
updatedDate: 2026-06-15   # optional
heroImage: "/blog/my-image.png"  # optional, place images in public/blog/
tags: ["release", "tutorial"]
draft: false   # set to true to hide from listing (still builds)
---

Your MDX content here. You can use standard Markdown plus JSX components.
```

Draft posts are excluded from the blog listing and RSS feed but are built to
`dist/` — use `draft: true` during writing, flip to `false` before publishing.

## Updating external links

All hardcoded URLs (GitLab, install scripts, Hive ecosystem) are registered in
`src/config/links.ts`. Edit that file when a URL changes — no grep needed.

## Deployment

Static build (`dist/`) — uploaded as-is, no SSR runtime required. Node 22+ at
build time (Astro 5). Two providers configured side-by-side: **Vercel**
(primary) via `vercel.json` and **Cloudflare Pages** (alternative) via
`public/_headers` + `wrangler.toml`. Both configs coexist — each platform
ignores the other's files.

### Vercel (production)

The Vercel project is connected to GitHub (`KKocot/clive-website`) — deploys
are triggered automatically:

- Push to `main` → **production deploy** (`https://clive-website-alpha.vercel.app`,
  later `clive.openhive.network` once DNS is wired).
- Push to any other branch → **preview deploy**.
- Pull request → preview deploy with a unique preview URL posted to the PR.

Manual CLI deploys are still available but unused in the standard flow:

- `pnpm deploy:vercel` — manual production deploy (bypasses Git).
- `pnpm deploy:vercel:preview` — manual preview deploy.

Build settings (auto-detected from `vercel.json`):

- Framework: Astro
- Build: `pnpm build`
- Output: `dist`
- Node: 22 (from `.nvmrc`)

Headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
Permissions-Policy, asset cache, RSS / sitemap content-type) are declared in
`vercel.json` — Vercel ignores `public/_headers` and `public/_redirects`,
those remain for the Cloudflare Pages fallback.

Custom domain: Vercel dashboard → project → Settings → Domains → Add
`clive.openhive.network`. CF DNS: `CNAME clive.openhive.network →
cname.vercel-dns.com` (proxied off — DNS-only — for Vercel-managed SSL).
Verify `site` in `astro.config.mjs` matches before the first prod deploy so
RSS / sitemap links resolve correctly.

### Cloudflare Pages (alternative)

Static-first deploy on **Cloudflare Pages**. Build output (`dist/`) is uploaded
as-is — no SSR runtime required. Node 22+ is required at build time (Astro 5).

#### Option 1: Git integration (recommended)

Connect the source repository directly to the Cloudflare Pages dashboard.

1. **Cloudflare dashboard** → Workers & Pages → Create → Pages → Connect to Git.
2. Pick the GitLab (`gitlab.syncad.com`) or GitHub mirror — see _Repo target_
   below.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Root directory: _(leave empty)_
4. Environment variables (Settings → Environment variables):
   - `NODE_VERSION` = `22`
   - `PNPM_VERSION` = `9` _(or pin to whatever `packageManager` declares)_
5. Custom domain: `clive.openhive.network` → see _Custom domain_ below.

Every push to `main` ships production; every other branch / MR creates a
preview deployment under `<branch>.clive-website.pages.dev`.

#### Repo target: GitLab vs GitHub mirror

The canonical Clive source lives on `gitlab.syncad.com`. Cloudflare Pages
supports both GitLab and GitHub Git integrations natively, so:

- **Preferred:** connect Pages directly to the self-hosted GitLab project (no
  extra moving parts, single source of truth).
- **Fallback:** if `gitlab.syncad.com` is not reachable from the Cloudflare
  build network or the team prefers GitHub-side CI, set up a one-way
  read-only mirror (`gitlab` → `github`) and point Pages at the mirror. In
  that case also add a GitHub Actions job that runs `pnpm install && pnpm
  build && pnpm check && pnpm lint` on every PR for parity with GitLab CI.

#### Option 2: Direct upload via Wrangler

Useful for one-shot deploys, CI without Git integration, or local debugging
of headers/redirects.

```bash
pnpm install
pnpm deploy           # production
pnpm deploy:preview   # preview branch
```

Requires:

- `CLOUDFLARE_ACCOUNT_ID` env var (account ID of the org owning the project)
- `CLOUDFLARE_API_TOKEN` env var with permission `Account → Cloudflare Pages: Edit`
- The Pages project `clive-website` already created in the dashboard
  (Wrangler will not auto-create it on first push).

The project metadata lives in `wrangler.toml` at the repo root.

#### Option 3: GitHub Actions (alternative)

If we settle on the GitHub mirror, add `.github/workflows/deploy.yml` using
`cloudflare/wrangler-action@v3` with `command: pages deploy dist
--project-name=clive-website`. Not committed yet — TODO once the repo target
decision is made.

#### Cache & security headers

Configured declaratively in [`public/_headers`](./public/_headers):

- `/_astro/*`, `/assets/*`, `*.svg`, `*.woff2` → `max-age=31536000, immutable`
- `/`, `/blog/*` → `max-age=300, s-maxage=86400, stale-while-revalidate=86400`
- `/rss.xml`, `/sitemap-*.xml` → correct `Content-Type` + 1h browser / 1d edge cache
- Global hardening: CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options:
  nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` denying camera/mic/geolocation.

CSP currently includes `'unsafe-inline'` in `script-src` because Astro emits
small inline bootstrap scripts (astro-island custom element, `client:visible`
IntersectionObserver, Solid `_$HY` hydration registry). Tightening this to
nonces or sha256 hashes is tracked as a TODO inside `_headers`.

Redirect rules live in [`public/_redirects`](./public/_redirects). The site
currently uses Astro's default `trailingSlash: 'ignore'`, so no redirects are
needed; the file documents how to enable them if the policy changes.

#### Custom domain (Cloudflare Pages)

1. **DNS** (Cloudflare zone for `openhive.network`): add `CNAME
   clive.openhive.network → clive-website.pages.dev`, proxied (orange cloud).
2. **Pages dashboard** → project `clive-website` → Custom domains → Set up a
   custom domain → enter `clive.openhive.network` → confirm.
3. SSL: automatic via Cloudflare Universal SSL — no action required.
4. Verify the canonical URL in `astro.config.mjs` (`site:
   "https://clive.openhive.network"`) matches before the first production
   deploy so RSS / sitemap links are correct.

## Deploy notes

The `site` field in `astro.config.mjs` already points at
`https://clive.openhive.network`. Update it before the first production
deploy if the final domain changes.
