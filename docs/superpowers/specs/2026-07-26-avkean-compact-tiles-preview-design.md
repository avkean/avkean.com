# Avkean compact tiles preview

## Scope

Replace the current `refs/redesign6` prototype with a four-page, static,
clickable preview. The production Astro site remains untouched until the
preview is accepted.

The preview contains:

- home
- infra
- dn42
- mirrors

All factual copy, addresses, keys, names, links, and navigation destinations
come from the current site and the accepted prototypes. The redesign changes
presentation, not meaning.

## Design thesis

The site is a compact editorial page with a small number of substantial
plates. It should feel deliberate and unusually well typeset, not like a
dashboard, spreadsheet, terminal, or collection of cards.

The wordmark is the only identity object. It is large, clear, and unframed on
the home page. Colored plates appear only where they improve comprehension:
machines, dn42 nodes, and network addresses.

The primary reading path is:

1. identity and navigation
2. page purpose
3. core information
4. technical detail
5. quiet footer

This path stays vertical. Prose and technical fields never split into
competing desktop columns.

Related information stays close. Captions and attached labels use 14px,
ordinary prose and subgroups use 28px, and major regions use 42px on narrow
screens or 56px on desktop. On desktop viewports at least 1000px tall, the
shell opening grows to 56px and the final footer separation to 84px. This
height response uses the existing spacing tokens rather than arbitrary
viewport-unit values.

## Composition

### Shared frame

- Centered canvas with a maximum width of 700px.
- The canvas uses one continuous rule: 28px minimum side clearance, then a
  centered 700px cap. It does not jump to a different gutter at a breakpoint.
- Header is one 84px row at every width. The plain-language `about` anchor sits
  on the left and the three named destinations sit on the right.
- No separate text logo appears in the header. The full self-similar wordmark
  remains the home page's identity object.
- A single low-contrast rule anchors the header. No boxes surround the page.
- Persistent navigation is `about / infra / dn42 / mirrors`.
- The current page uses a short dusty-plum bar, not a badge or filled pill.
- Footer follows the content naturally. It is not forced to the viewport
  bottom when a page is short.

### Home

- The 5x7 self-similar `avner` wordmark shares the exact canvas edges used by
  the header, prose, rows, and footer.
- The wordmark uses five closely related cool tones from steel blue through
  dusty plum.
- The alias sits 14px below the mark.
- Both introductory paragraphs remain ordinary 19px/28px serif prose on the
  dark ground. They use no ornamental emphasis, colored nouns, split columns,
  filled bands, or extra copy.
- Contact is the page's secondary visual moment: one near-black calling card
  with the shared two-corner cut, never a grid of smaller cards.
- Contact methods are stacked in one reading column. Each label sits directly
  above its destination, with no desktop label/value rails and no repeated row
  rules.
- The four destinations move through a restrained cool sequence from steel
  blue to dusty plum. Persistent underlines keep link meaning independent of
  color.
- One oversized, extremely faint `@` is cropped into the lower-right corner as
  a recognizable contact seal. It is decorative, non-interactive, and remains
  behind the information.
- At 320px the fingerprint uses a compact 14px/28px mono treatment and two
  lines, preventing it from dominating the card.

### Infra

- A large title and one-line introduction lead.
- Services form one dense vertical list with quiet labels and prominent
  values.
- The three machines form one horizontal plate group.
- Each machine receives one cool fill and dark ink.
- Plates have two 14px cut corners, echoing physical network labels without
  adding illustrative machinery.
- The closing sentence follows the plate group closely.

### dn42

- Peering information remains ordinary prose on the dark ground.
- The two nodes are stacked substantial plates at every size.
- Full endpoints, WireGuard keys, link-local addresses, and network addresses
  remain visible and selectable.
- Each node uses one header divider. Its internal fields rely on typographic
  grouping rather than repeated rules.
- Network metadata returns to the dark ground in one compact vertical field.
  On desktop, its value rail starts about one third of the way across the
  canvas rather than clustering against the left edge.
- The network field keeps aligned label and value rails while the supplied
  values fit, then stacks below 375px so IPv6 never wraps solely because its
  value rail became too narrow.
- No topology drawing, port diagram, or unexplained network metaphor appears.

### Mirrors

- The explanation leads directly into four address plates.
- Each network is a full-width row with a compact label and selectable value.
- The plate colors move gradually from steel blue to dusty plum.
- The I2P plate presents two explicitly labelled alternatives: the memorable
  `avkean.i2p` name first, then the full B32 address.
- Long onion and I2P values may wrap at safe character boundaries without
  increasing page width.

## Typography

The preview uses two families and four CSS text sizes:

- system serif, 32px/42px, page titles
- system serif, 19px/28px, prose and important plate copy
- Commit Mono, 16px/28px, navigation, labels, values, and footer
- Commit Mono, 14px/28px, only the PGP fingerprint at the narrowest breakpoint

The SVG wordmark geometry remains responsive within its view box rather than
introducing another CSS text size.

Weights are limited to regular and bold. Labels are muted through color rather
than reduced to tiny text. Ordinary body text is never smaller than 16px.

## Color

The ground remains `#080a0e`.

Text roles:

- primary: cool near-white
- secondary: blue-grey
- muted: slate
- links: desaturated periwinkle
- current-page marker: dusty plum

Plate fills:

- steel blue: `#7397b3`
- muted violet: `#918ab3`
- dusty plum: `#ad819c`

These values lift the earlier dull palette without becoming saturated. Each
plate fill provides at least 6:1 contrast with the near-black ink.
There is no ochre, amber, yellow, beige, or brown.

## Responsive behavior

### Wide, 960px and above

- Canvas remains capped at 700px so the composition has a natural reading
  measure and does not become a thin band inside a wide frame.
- Major regions use 56px separation. Tall desktop viewports promote only the
  shell opening and footer gap, leaving compact relationships unchanged.
- Home wordmark spans the canvas and uses a corrected view box so its painted
  bounds align with the content frame.
- Prose, service, contact, node, and network fields remain one column.
- The contact calling card uses the full editorial measure, with its faint seal
  balancing the stacked destinations rather than creating another column.
- Machine plates use three columns.

### Intermediate, 640px to 959px

- The same canvas keeps its 28px minimum side clearance and grows continuously
  until it reaches the 700px cap.
- Machine plates remain three columns while their internal copy simplifies
  naturally.
- Every other content group remains a single reading column.

### Narrow, below 640px

- Header remains one 84px row without hiding navigation.
- Side clearance is 28px.
- Major regions retain 42px separation instead of collapsing to the ordinary
  28px prose rhythm.
- Wordmark scales to the available content width.
- Every plate group becomes one column.
- Labels remain visually close to their values.
- Long technical values wrap without horizontal scrolling.
- DOM order and visual order remain identical.

## Interaction and accessibility

- No JavaScript.
- No inline styles.
- Strict-CSP compatible.
- One `h1` on every page.
- Navigation uses `aria-current="page"`.
- Visible focus rings use the plum accent.
- Selectable technical values use ordinary text selection.
- Link meaning never depends on color alone.
- Reduced motion requires no special case because the design is static.

## Acceptance criteria

- Four pages are reachable through the persistent navigation.
- The home wordmark is the immediate visual focus.
- Home prose remains plain and uncluttered.
- The contact calling card introduces restrained color and one recognizable
  visual seal without becoming a table, terminal, stripe, or card grid.
- Body copy is visibly larger and content groups are materially denser than
  round 6.
- Prose and data use one continuous reading column; only the compact machine
  triptych may use parallel columns.
- Colored plates are limited to meaningful technical groups.
- There is no warm yellow-brown cast.
- No horizontal overflow occurs at 320, 360, 375, 639, 640, 768, 1280, or
  1600px.
- Long dn42 keys and mirror addresses remain readable and selectable.
- Each HTML file plus its shared CSS remains 25KB or less,
  excluding cached font files.
- The preview contains no scripts or inline style attributes.
