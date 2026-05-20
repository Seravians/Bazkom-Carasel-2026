# Official Event Website

**Bazkom Carasel Seranova 2026** (Senandung Rasa Nostra Pujangga) is the 2026 annual student event website for **SMAN 68 Jakarta**. It covers two related event tracks:

- **BAZKOM** - Bazaar & Kompetisi
- **CARASEL** - Cipta Karya Seni Enam Lapan, the arts performance event and event peak

This repository hosts the static single-page website used as the event information and registration hub. It is designed to be deployed with **GitHub Pages**.

---

## Live Site

[https://seravians.github.io/Bazkom-Carasel-2026/](https://seravians.github.io/Bazkom-Carasel-2026/)

---

## Project Structure

```text
/
|-- index.html          # Single-page application; all views live here
|-- script.js           # Countdown phases, form visibility, bookmarks, navigation, sidebar, video cleanup
|-- styles.css          # Layout, cards, countdown, responsive styling, animations
|-- README.md
`-- assets/
    |-- bg.jpeg
    |-- Logo.png
    |-- Logo68.png
    |-- Seranova.png
    |-- Bazkom.png
    |-- Carasel.png
    |-- SeranovaTeaser.mp4
    |-- InstagramIcon.png
    |-- TiktokIcon.png
    |-- XIcon.png
    |-- YoutubeIcon.png
    `-- competition logos and frame images
```

All app views are rendered as `<div class="page-section">` elements inside `index.html`. Navigation is handled by JavaScript with `switchPage(pageId)`, so moving between sections does not reload the page.

---

## Pages & Navigation

| Page ID | Entry Point | Description |
|---|---|---|
| `home-page` | Sidebar: Home | Main dashboard with countdown and Seranova/Bazkom/Carasel cards |
| `seranova-page` | Home -> Seranova See More | Seranova event description |
| `bazkom-page` | Home -> Bazkom See More | Bazkom event description |
| `carasel-page` | Home -> Carasel See More | Carasel event description |
| `kompetisi-page` | Sidebar: Kompetisi | Grid of all 14 Bazkom competitions |
| `bookmarks-page` | Sidebar: Bookmarks | User-saved competitions from localStorage |
| `social-media-page` | Sidebar: Social Media | Instagram, TikTok, X, YouTube, and short film video |

Competition detail pages:

| Page ID | Competition |
|---|---|
| `comp-asc` | ASEAN Simulation Conference |
| `comp-band` | Band |
| `comp-basket-putra` | Basket Putra |
| `comp-basket-putri` | Basket Putri |
| `comp-cca` | Cerdas Cermat Alkitab |
| `comp-cci` | Cerdas Cermat Islam |
| `comp-cheerleader-level-2` | Cheerleader Level 2 |
| `comp-cheerleader-level-4` | Cheerleader Level 4 |
| `comp-futsal-putra` | Futsal Putra |
| `comp-futsal-putri` | Futsal Putri |
| `comp-mlbb` | Mobile Legends |
| `comp-ratoh-jaroe` | Ratoh Jaroe |
| `comp-tari-tradisional` | Tari Tradisional |
| `comp-vocal-group` | Vocal Group |

---

## Key Features

### Countdown Phases

The countdown is phase-based and uses WIB boundaries (`UTC+7`) in `script.js`.

| Phase | Date Range (WIB) | Countdown Label | Sign Up Forms |
|---|---|---|---|
| Main registration | Before July 4, 2026 00:00 | `Registration Closes In...` | Visible |
| Registration gap | July 4, 2026 00:00 to July 5, 2026 00:00 | Hidden | Hidden |
| Extended registration | July 5, 2026 00:00 to July 19, 2026 00:00 | `Extended Registration Period...` | Visible |
| Opening countdown | July 19, 2026 00:00 to July 31, 2026 00:00 | `Opening Starts In...` | Hidden |
| After opening | From July 31, 2026 00:00 | Hidden | Hidden |

Countdown instances currently appear on:

- Home
- Kompetisi
- Bookmarks
- Social Media

All countdown instances share the same `.days`, `.hours`, `.minutes`, and `.seconds` classes. `script.js` updates every matching element together, so all visible timers stay synchronized.

When a phase has no label, `script.js` adds `.expired` to every `.countdown-wrapper`; `styles.css` hides those wrappers with `display: none`.

Sign Up Form buttons are shown or hidden automatically by selecting links whose `href` contains `docs.google.com/forms`. Guidebook links remain visible.

### Bookmarking System

Users can star competitions from the Kompetisi page. Bookmark data is stored in `localStorage` under:

```text
seranova-bookmarks
```

The saved value is a JSON array of competition page IDs, for example:

```json
["comp-asc", "comp-mlbb"]
```

The Bookmarks page is rendered dynamically from the saved IDs. It shows an empty state when no competitions have been saved.

The Back button on competition detail pages is context-aware:

- If the active competition is bookmarked, Back returns to `bookmarks-page`.
- Otherwise, Back returns to `kompetisi-page`.

### Sidebar

The sidebar can be opened with the floating menu button and closed with the menu icon inside the sidebar. Clicking outside an open sidebar also closes it. The main content receives a `sidebar-open` class while the sidebar is active.

### Social Media & Video

The Social Media page links to:

- Instagram: `@bazkomcarasel.68`
- TikTok: `@bazkomcarasel68`
- X: `@bazkomcarasel68`
- YouTube: `@BAZKOMCARASEL`

It also embeds `assets/SeranovaTeaser.mp4`.

Whenever the user switches pages, `stopAllVideos()` runs. It pauses local `<video>` elements, resets their playback time, and refreshes any `<iframe>` sources so audio/video does not continue in the background.

---

## Local Development

No build tools or package managers are required. This is a static HTML/CSS/JavaScript project.

Open `index.html` directly in a browser, or serve it with any static file server.

**VS Code + Live Server**

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
2. Right-click `index.html`.
3. Choose **Open with Live Server**.
4. The site usually opens at `http://127.0.0.1:5500`.

---

## Configuration

All countdown dates and phase behavior are defined at the top of `script.js`:

```js
const PHASE_1_END   = new Date("2026-07-04T00:00:00+07:00").getTime();
const PHASE_2_START = new Date("2026-07-05T00:00:00+07:00").getTime();
const PHASE_2_END   = new Date("2026-07-19T00:00:00+07:00").getTime();
const PHASE_3_END   = new Date("2026-07-31T00:00:00+07:00").getTime();
```

Phase labels and form visibility are controlled by `PHASE_CONFIG`:

```js
const PHASE_CONFIG = [
  { from: 0,            to: PHASE_1_END,   label: "Registration Closes In...",       showForms: true  },
  { from: PHASE_1_END,  to: PHASE_2_START, label: null,                              showForms: false },
  { from: PHASE_2_START,to: PHASE_2_END,   label: "Extended Registration Period...", showForms: true  },
  { from: PHASE_2_END,  to: PHASE_3_END,   label: "Opening Starts In...",            showForms: false },
  { from: PHASE_3_END,  to: Infinity,      label: null,                              showForms: false },
];
```

There is currently no `TEST_MODE` flag. To test a phase locally, temporarily adjust the phase date constants or stub `Date.now()` in a browser console/test harness, then restore the production dates before committing.

---

## Adding or Updating Content

### Updating a Competition Sign Up Form Link

Find the relevant `<div id="comp-*">` section in `index.html`. Each Sign Up Form button is an `<a>` tag whose `href` points to a Google Forms URL:

```html
<a href="https://docs.google.com/forms/..." class="action-button sm" target="_blank">Sign Up Form</a>
```

Replace the `href` value. The phase logic will continue to show or hide it automatically as long as the link contains `docs.google.com/forms`.

### Updating a Guidebook Link

Guidebook buttons are also inside each competition detail page:

```html
<a href="https://drive.google.com/file/d/..." class="action-button sm" target="_blank">Guidebook</a>
```

Replace only the `href`. Guidebook links are not hidden by countdown phase logic.

### Adding a New Competition

To add another competition, update:

- `index.html`: add a card in `kompetisi-page`.
- `index.html`: add a matching detail section with a unique `comp-*` ID.
- `assets/`: add the required logo/frame images.

Bookmark buttons are added automatically to cards in `#kompetisi-page` by reading each card's `See More` button `onclick` target.

---

## Deployment

The site is intended for GitHub Pages deployment from the main branch.

To update the live site:

```bash
git add .
git commit -m "Update site"
git push origin main
```

GitHub Pages should rebuild shortly after the push.

---

## Contributing

1. Create a new branch from `main`.
2. Make and test changes locally.
3. Confirm the countdown phase dates in `script.js` are production dates.
4. Confirm all Google Forms and guidebook links open correctly.
5. Open a pull request with a short description of what changed.

Direct pushes to `main` update the live site immediately, so use pull requests for anything beyond minor copy edits.
