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

Related information stays close. Major groups use 42px separation; ordinary
relationships use 14px or 28px. The 56px and 84px tokens are reserved for
outer composition rather than repeated between every section.

## Composition

### Shared frame

- Centered canvas with a maximum width of 896px.
- 28px side clearance at phone widths and 42px at wider widths.
- Header is one compact row on desktop and two rows on narrow screens.
- A single low-contrast rule anchors the header. No boxes surround the page.
- Persistent navigation is `~ / infra / dn42 / mirrors`.
- The current page uses a short dusty-plum bar, not a badge or filled pill.
- Footer follows the content naturally. It is not forced to the viewport
  bottom when a page is short.

### Home

- The 5x7 self-similar `avner` wordmark spans most of the canvas width.
- The wordmark uses five closely related cool tones from steel blue through
  dusty plum.
- The alias sits 14px below the mark.
- Introductory prose sits immediately below as one readable group rather than
  being pushed to the far side of the viewport.
- Contact details form a compact two-column field on desktop and a single
  column on phones.
- Contact rows use alignment and a faint rule only. They are not colored
  tiles.

### Infra

- A large title and one-line introduction lead.
- Services form a dense two-column list with quiet labels and prominent
  values.
- The three machines form one horizontal plate group.
- Each machine receives one cool fill and dark ink.
- Plates have two 14px cut corners, echoing physical network labels without
  adding illustrative machinery.
- The closing sentence follows the plate group closely.

### dn42

- Peering information remains ordinary prose on the dark ground.
- The two nodes are equal-width substantial plates at desktop sizes.
- Full endpoints, WireGuard keys, link-local addresses, and network addresses
  remain visible and selectable.
- Network metadata returns to the dark ground in a compact multi-column field.
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

- Canvas remains capped so text and objects stay substantial.
- Home wordmark is nearly canvas width.
- Service and contact fields use two columns.
- Machine plates use three columns.
- Node plates use two columns.

### Intermediate, 640px to 959px

- The same canvas remains centered with 42px side clearance.
- Machine plates remain three columns while their internal copy simplifies
  naturally.
- Nodes remain two columns at 760px and above, then stack below 760px.

### Narrow, below 640px

- Header becomes two rows without hiding navigation.
- Side clearance is 28px.
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
- Colored plates are limited to meaningful technical groups.
- There is no warm yellow-brown cast.
- No horizontal overflow occurs at 320, 375, 768, 1280, or 1600px.
- Long dn42 keys and mirror addresses remain readable and selectable.
- Each HTML file plus its shared CSS remains 25KB or less,
  excluding cached font files.
- The preview contains no scripts or inline style attributes.
