# Avkean Compact Tiles Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a four-page clickable preview that combines the wordmark-first identity with a compact, cool-toned editorial tile layout.

**Architecture:** Replace the ignored static prototype in `refs/redesign6` while leaving the production Astro site untouched. Four semantic HTML pages share one CSS file and two existing Commit Mono subsets. A dependency-free Node QA script enforces structural, CSP, size, and content contracts before browser-based responsive verification.

**Tech Stack:** Static HTML5, CSS, inline SVG, Commit Mono WOFF2 subsets, Node.js built-ins, in-app browser verification.

## Global Constraints

- Ground is `#080a0e`.
- Canvas maximum width is 896px.
- Spacing uses 14px, 28px, 42px, 56px, and 84px tokens.
- Typography uses system serif plus Commit Mono and no more than four effective sizes.
- Plate fills are steel blue `#718aa3`, muted violet `#827a9c`, and dusty plum `#9a718a`.
- There is no ochre, amber, yellow, beige, or brown.
- The 5x7 self-similar `avner` wordmark is the only identity object.
- Persistent navigation is `~ / infra / dn42 / mirrors`.
- No JavaScript is shipped to the browser.
- No inline style attributes are allowed.
- Each HTML file plus shared CSS is at most 25KB, excluding font files.
- The prototype must not overflow horizontally at 320, 375, 768, 1280, or 1600px.

---

### Task 1: Static preview contract

**Files:**
- Create: `refs/redesign6/qa.mjs`
- Test: `refs/redesign6/qa.mjs`

**Interfaces:**
- Consumes: the four HTML files and `style.css` in `refs/redesign6`
- Produces: a zero-exit QA command with one assertion group per page

- [ ] **Step 1: Write the failing contract**

Create a Node script using `node:assert/strict`, `node:fs`, and `node:path`.
For every page, assert one `h1`, four primary-navigation links, one
`aria-current="page"`, no `<script`, no `style=`, and HTML plus CSS at or below
25,600 bytes. Assert that the home page contains `class="wordmark"`; infra
contains `class="plates machines"`; dn42 contains `class="plates nodes"`; and
mirrors contains `class="plates addresses"`. Assert that CSS contains the
exact three fill values and `max-width: 896px`.

- [ ] **Step 2: Run the contract and verify the red state**

Run:

```bash
node refs/redesign6/qa.mjs
```

Expected: FAIL because the current prototype lacks the new `plates` structures
and 896px compact canvas contract.

- [ ] **Step 3: Keep the failing contract for subsequent tasks**

Do not weaken assertions to match the current implementation. The remaining
tasks make this contract pass.

### Task 2: Shared frame and home composition

**Files:**
- Modify: `refs/redesign6/style.css`
- Modify: `refs/redesign6/index.html`

**Interfaces:**
- Consumes: existing font files under `refs/redesign6/assets/fonts`
- Produces: shared tokens, header, navigation, footer, wordmark, prose, and contact-field styles used by every page

- [ ] **Step 1: Replace the shared CSS foundation**

Implement:

```css
.site {
  width: min(calc(100% - 84px), 896px);
  margin-inline: auto;
}

.plates {
  display: grid;
  gap: 14px;
}

.plate {
  color: #080a0e;
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px,
    100% 100%, 14px 100%, 0 calc(100% - 14px));
}
```

Use 32px/42px titles, 19px/28px prose, and 16px/28px mono. Keep the cool
round-6 text palette. Use 42px for major section separation and 28px for
ordinary groups.

- [ ] **Step 2: Recompose the home page**

Keep the existing wordmark text geometry and factual copy. Place the wordmark
at nearly the full canvas width, with alias 14px below. Follow with a compact
intro group and a two-column contact field using faint horizontal rules.
Retain semantic `h1` and `dl` markup.

- [ ] **Step 3: Run the contract**

Run:

```bash
node refs/redesign6/qa.mjs
```

Expected: FAIL only on inner-page plate structures that are not yet rebuilt.

### Task 3: Infra plates

**Files:**
- Modify: `refs/redesign6/infra/index.html`
- Modify: `refs/redesign6/style.css`

**Interfaces:**
- Consumes: `.plates`, `.plate`, `.fill-steel`, `.fill-violet`, and `.fill-plum`
- Produces: `.machines` three-column desktop group and stacked phone layout

- [ ] **Step 1: Rebuild the service field**

Render the five existing services as a dense two-column definition list.
Preserve every destination and proper name.

- [ ] **Step 2: Rebuild the machine group**

Use:

```html
<ul class="plates machines" aria-label="Machines">
  <li class="plate fill-steel">...</li>
  <li class="plate fill-violet">...</li>
  <li class="plate fill-plum">...</li>
</ul>
```

Show only the supplied machine names and locations. Keep the closing sentence
immediately after the plates.

- [ ] **Step 3: Run the contract**

Run `node refs/redesign6/qa.mjs`.

Expected: infra assertions pass; dn42 and mirrors plate assertions still fail.

### Task 4: dn42 node plates and network field

**Files:**
- Modify: `refs/redesign6/dn42/index.html`
- Modify: `refs/redesign6/style.css`

**Interfaces:**
- Consumes: shared plate and definition-field styles
- Produces: `.nodes` two-column node group, `.node-fields`, and `.network-grid`

- [ ] **Step 1: Preserve the reading sequence**

Keep title, lede, peering text, nodes, then network metadata. Do not add a
diagram or explanatory metaphor.

- [ ] **Step 2: Build two substantial node plates**

Use `class="plates nodes"` and one steel/violet plate per node. Preserve full
endpoint, WireGuard key, link-local, IPv4, and IPv6 values. Apply
`overflow-wrap: anywhere` and `user-select: all` to technical values.

- [ ] **Step 3: Build the ground-level network field**

Render ASN, IPv4, IPv6, registry, contact, and looking glass in a compact
three-column desktop grid that collapses to one column on phones.

- [ ] **Step 4: Run the contract**

Run `node refs/redesign6/qa.mjs`.

Expected: dn42 assertions pass; mirrors plate assertion still fails.

### Task 5: Mirror address plates

**Files:**
- Modify: `refs/redesign6/mirrors/index.html`
- Modify: `refs/redesign6/style.css`

**Interfaces:**
- Consumes: shared plate fill roles and technical-value wrapping
- Produces: `.addresses` four-row plate group

- [ ] **Step 1: Build the address group**

Use `class="plates addresses"` with clearnet, Tor, I2P, and dn42 rows. Give
each row a compact mono label and the exact supplied address. Cycle the three
cool fill roles without introducing another hue.

- [ ] **Step 2: Verify long values**

Ensure onion and I2P values wrap within their plate at 320px and remain
selectable. Clearnet remains a working link; non-browser networks remain
copyable values.

- [ ] **Step 3: Run the full static contract**

Run:

```bash
node refs/redesign6/qa.mjs
```

Expected: PASS with a concise per-page summary.

### Task 6: Browser verification and polish

**Files:**
- Modify if required: `refs/redesign6/style.css`
- Modify if required: any `refs/redesign6/**/index.html`

**Interfaces:**
- Consumes: the complete static preview at `http://localhost:4400/round6/`
- Produces: visually verified desktop and mobile layouts

- [ ] **Step 1: Verify click-through navigation**

Starting on home, click infra, dn42, mirrors, then `~`. Confirm the destination
after every click and confirm one current-page marker.

- [ ] **Step 2: Verify responsive layout**

At 320, 375, 768, 1280, and 1600px, inspect all four pages for horizontal
overflow. Visually review home at 1280 and 320, infra at 1280, dn42 at 375,
and mirrors at 320.

- [ ] **Step 3: Run mechanical design checks**

Run:

```bash
node .agents/skills/impeccable/scripts/detect.mjs --json --scope layout refs/redesign6
node refs/redesign6/qa.mjs
```

Expected: no unexplained detector findings and all QA assertions pass.

- [ ] **Step 4: Leave the preview open**

Reset the browser viewport, navigate to
`http://localhost:4400/round6/`, and retain that tab as the deliverable.
