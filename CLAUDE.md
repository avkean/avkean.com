# avkean.com

Personal one-page-per-topic site for Avner. Astro, static output, no client JS, strict CSP. Dark, monospace (Commit Mono subset), oklch pink/red palette. See `PRODUCT.md` for brand/voice principles — read it before touching copy.

## Voice

Plainspoken, first person, a little dry. Short sentences. No em dashes. Nothing goofy or "AI-flavored" (triads, tidy parallelism, hedging, "not X but Y").

## Pages

All routes are flat: `/`, `/infra/`, `/dn42/`, `/mirrors/`, `/404` (noindex). No nesting — a page's crumb must match its actual URL, always.

- `/` — bio, contact, links to `/infra/`.
- `/infra/` — what Avner self-hosts. Deliberately omits admin surfaces (Glances, Portainer).
- `/dn42/` — dn42 peering page for AS4242420421, published externally (registry, peerfinder). Section order is reader-task-first: intro → Peering → Nodes → Network. Never reorder this without a reason; a stranger arriving from peerfinder wants to know "can I peer and how" first.
- `/mirrors/` — where else the site is reachable (Tor, I2P, dn42). Full onion/i2p addresses live only here.

## Components

- `src/layouts/Base.astro` — head/meta. Takes `description` (always pass one, don't rely on the default bio) and `noindex` (skips canonical/og, adds robots meta).
- `src/components/PageHeader.astro` — breadcrumb (`~/page`) + red h1. Default crumb is just `~`; pass `crumbs` only if a page is genuinely nested (none currently are).
- `src/components/Footer.astro` — same on every page: `© avner · CC BY-NC-ND 4.0 · source · mirrors`. Renders its own page as plain text, not a self-link.

## Styling system (`src/styles/site.css`)

- **Spacing scale**: `--s0`..`--s4` (0.5rem–3.5rem). Use these, not arbitrary rem values.
- **Sections**: `<section><h2>Label</h2>...</section>`. No `aria-label` on the section — the h2 already names it (screen readers get the accessible name from the heading).
- **Field lists**: `<dl><div><dt>Label</dt><dd>value</dd></div></dl>` — default is a two-column grid (label + value). `<dl class="stack">` is the alternate: bold name over a description line (used for lists of named things, e.g. infra services).
- **Code chips**: wrap every machine value (keys, IPs, ASNs, endpoints, registry handles) in `<code>`. It's a tinted/bordered chip with `user-select: all` — one click selects the whole value. A placeholder segment inside a value (e.g. the `XXXX` in a port number) goes in `<var>` so it reads as fill-in-the-blank, not copy-verbatim.
- **`.note`** — muted aside paragraph. One class, used everywhere; don't invent a page-local synonym.
- External links that plausibly fail to resolve in an ordinary browser (`.onion`, `.i2p`, `.dn42`) get `target="_blank" rel="noopener"` (add `rel="me"` where it's an identity link) so a dead lookup doesn't blow away the page the visitor was reading.
- `trailingSlash: 'always'` in `astro.config.mjs` — internal links must include the trailing slash or they eat a Caddy redirect.

## Deliberate decisions (don't "fix" these)

- No status indicators, uptime badges, or static peer lists anywhere — anything that can silently go stale is left out. The dn42 looking glass is the live source of truth for peers, not a page on this site.
- PGP fingerprint on `/` is a plain muted link (`.fp`), not a code chip — tried the chip treatment, it looked wrong against the Contact list, reverted.
- On `/infra/`, the dn42 row links the text "(peering page)", not the ASN itself — linking the ASN reads as a link *about* dn42, not *to* Avner's page.
- The pixel-art wordmark is homepage-only; every other page uses a plain red `<h1>`.

## Workflow

- Dev: `npm run dev`. Build: `npm run build` (outputs `dist/`, check page count in the log).
- Deploy is Docker + Caddy on a VPS: `Caddyfile.site` is baked into the image (`Dockerfile`), so a Caddyfile change needs an image rebuild, not just a config reload.
- `git push` goes to `forge` (self-hosted Forgejo, the tracked remote for `main`); `origin` (GitHub) is a public mirror and should stay in sync too.
