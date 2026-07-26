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
- Header is one compact row on desktop and two rows on narrow screens.
- A single low-contrast rule anchors the header. No boxes surround the page.
- Persistent navigation is `~ / infra / dn42 / mirrors`.
- The current page uses a short dusty-plum bar, not a badge or filled pill.
- Footer follows the content naturally. It is not forced to the viewport
  bottom when a page is short.

### Home

- The 5x7 self-similar `avner` wordmark shares the exact canvas edges used by
  the header, prose, rows, and footer.
- The wordmark uses five closely related cool tones from steel blue through
  dusty plum.
- The alias sits 14px below the mark.
- Introductory prose sits immediately below as one readable group rather than
  being pushed to the far side of the viewport.
- Contact details form one compact vertical field at every width.
- One faint rule introduces the contact field. Individual entries are
  separated by rhythm rather than repeated row rules, so the field does not
  resemble a spreadsheet or terminal table.

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
- No topology drawing, port diagram, or unexplained network metaphor appears.

### Mirrors

- The explanation leads directly into four address plates.
- Each network is a full-width row with a compact label and selectable value.
- The plate colors move gradually from steel blue to dusty plum.
- Long onion and I2P values may wrap at safe character boundaries without
  increasing page width.

## Typography

The preview uses two families and four effective sizes:

- system serif, 32px/42px, page titles
- system serif, 19px/28px, prose and important plate copy
- Commit Mono, 16px/28px, navigation, labels, values, and footer
- SVG wordmark geometry, responsive within its view box

Weights are limited to regular and bold. Labels are muted through color rather
than reduced to tiny text. No body text is smaller than 16px.

## Color

The ground remains `#080a0e`.

Text roles:

- primary: cool near-white
- secondary: blue-grey
- muted: slate
- links: desaturated periwinkle
- current-page marker: dusty plum

Plate fills:

- steel blue: `#718aa3`
- muted violet: `#827a9c`
- dusty plum: `#9a718a`

Each plate fill provides at least 4.8:1 contrast with the near-black ink.
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
- Machine plates use three columns.

### Intermediate, 640px to 959px

- The same canvas keeps its 28px minimum side clearance and grows continuously
  until it reaches the 700px cap.
- Machine plates remain three columns while their internal copy simplifies
  naturally.
- Every other content group remains a single reading column.

### Narrow, below 640px

- Header becomes two rows without hiding navigation.
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
- Body copy is visibly larger and content groups are materially denser than
  round 6.
- Prose and data use one continuous reading column; only the compact machine
  triptych may use parallel columns.
- Colored plates are limited to meaningful technical groups.
- There is no warm yellow-brown cast.
- No horizontal overflow occurs at 320, 375, 639, 640, 768, 1280, or 1600px.
- Long dn42 keys and mirror addresses remain readable and selectable.
- Each HTML file plus its shared CSS remains 25KB or less,
  excluding cached font files.
- The preview contains no scripts or inline style attributes.
