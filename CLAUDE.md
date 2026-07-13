# CLAUDE.md — Gramophone Works Kiosk

> Read this at the start of every session. Update the Progress Log after each significant change.

---

## Project Overview

**Client:** The Gramophone Works, 326 Kensal Rd, West London (W10 5BZ)  
**Managed by:** TSP (building management company)  
**Purpose:** Fullscreen reception kiosk display — auto-rotates through 4 screen types on a loop  
**Type:** Static HTML/CSS/JS — no framework, no build step, no server required

---

## The Building

- 6-floor heritage creative building in West London
- 64,000 sq ft overlooking the Grand Union Canal
- BREEAM and EPC A certified; carbon-neutral timber structure
- NLA Environmental Prize 2021

### Tenants
| Floor   | Tenant                           |
|---------|----------------------------------|
| Ground  | Café, Reception, Kindred Workshop Rooms |
| 1–3     | Kindred Studios (charity, 300+ artists: jewellery, pottery, painting, etc.) |
| 4       | Emilia Wickstead                 |
| 5       | Perfect Moment                   |

---

## How the Kiosk Works

### Screen rotation (defined in `content.js` → `screens` array)
1. **Directory** — floor-by-floor tenant list with TSP logo (shown longest: 22s)
2. **Story** — one building fact at a time, large italic serif, cycles through `facts[]` (12 facts, sourced from the brochure PDF)
3. **Events** — Kindred Studios recurring sessions (13s)

Gallery screens (building/tenant photos) are defined in `gallery[]` but not currently in the rotation — add an entry like `{ type: "gallery", galleryIndex: N, duration: 13000 }` to `screens[]` to bring one back.

### Key behaviour
- Transitions: 800ms CSS opacity crossfade
- Auto-reload: page reloads every 30 minutes to pick up `content.js` changes
- Fullscreen: triggered on first click (browser security requirement)
- No server needed: content loaded via `<script src="content.js">`, not fetch()

---

## Files

```
gramophone-kiosk/
├── index.html       — 4-screen shell (no content hardcoded here)
├── styles.css       — all visual design
├── app.js           — rotation logic, renderers, transitions
├── content.js       — ALL content lives here (edit to update kiosk)
├── content.json     — inactive reference copy (content.js is the live one)
└── images/
    ├── tsp-logo.png          ✓ added
    ├── building-exterior.jpg ✓ added
    ├── building-info.jpg     ← ADD: second building image (currently placeholder)
    ├── kindred-01.jpg        ← waiting for photos
    ├── kindred-02.jpg        ← waiting for photos
    ├── emilia-01.jpg         ← waiting for photos
    └── perfect-moment-01.jpg ← waiting for photos
```

### How to update content
Edit `content.js` only. Never touch the other files unless changing layout/logic.

### How to activate a new tenant photo
1. Drop image in `images/` (e.g. `kindred-01.jpg`)
2. In `content.js`, find the matching gallery entry and confirm the path is correct
3. In `content.js → screens`, add: `{ type: "gallery", galleryIndex: 2, duration: 13000 }` (where 2 = the array index of that gallery entry)
4. Refresh the browser

---

## Design Direction

- **Aesthetic:** editorial/gallery — Kinfolk magazine meets minimal art gallery
- **Background:** warm cream `#F6F2EC`
- **Text:** near-black `#1C1815`
- **Serif font:** Fraunces (Google Fonts) — headings, floor numbers, facts, event titles
- **Sans font:** Inter (Google Fonts) — eyebrows, tenant names, dates, captions
- **Rules:** flat, no shadows, no rounded cards, no gradients
- **Type sizes:** large for distance viewing (floor numbers ~80–96px, facts ~52px)
- **TSP logo:** top-right of directory and events screens; `mix-blend-mode: multiply` strips white background

---

## Progress Log

### Session 1 — 21 June 2026
- Built full kiosk from scratch: `index.html`, `styles.css`, `app.js`, `content.json`
- 4 screen types: Directory, Building Story, Gallery, Events
- Data-driven rotation via `screens[]` array in content — adding new tenant slides = JSON edit only
- Directory screen shown for 22s, others 13s
- 800ms crossfade transition between screens
- TSP logo uses `<img>` with text fallback; `mix-blend-mode: multiply` strips white PNG background
- TSP logo + building exterior image added to `images/`
- Fixed content loading: switched from `fetch(content.json)` (breaks on file://) to `<script src="content.js">` (works everywhere including double-click)
- Page auto-reloads every 30 min to pick up content changes
- Events: Kindred Studios recurring sessions from kindredstudios.co.uk/calendar
- `CLAUDE.md` created

### Session 2 — 21 June 2026
- Removed building exterior photo as its own slide — exterior photo now used only as faded background on the facts/story screen
- Active rotation is now 4 slides: Directory (22s) → Building fact (13s) → Building info photo (13s) → Kindred events (13s)
- TSP logo moved from bottom-right to top-right; made larger (`56–100px`); added to events screen too
- Building story background: opacity tuned to `0.40`; cream `text-shadow` halo added to fact text for readability against the photo
- Directory text: sizes increased for large-screen distance viewing; weight set to `350` (Fraunces variable font)
- Ground floor tenants rendered inline on one line with `·` middot separator instead of stacked
- Events: date text enlarged and set to full ink colour for distance readability
- Fixed images not loading: Windows had added double extensions (`tsp-logo.png.png` etc.) — renamed all three files
- Fixed content loading: switched from `fetch(content.json)` to `<script src="content.js">` so it works by double-clicking without a local server
- Deployed to Netlify via GitHub (`gramophonekiosk.netlify.app`) — branch `main`, publish dir `.`, no build command
- Building-info image updated locally but not committed — pushed in this session; always `git add` + `git commit` + `git push` after replacing image files

### Session 3 — 13 July 2026
- Removed the building-info image slide from rotation — active rotation is now 3 slides: Directory (22s) → Building fact (13s) → Kindred events (13s)
- Expanded `facts[]` from 3 to 12 entries, sourced from the official brochure PDF (thegramophoneworks.com), covering sustainability stats (655 tonnes CO₂ saved, green roof, PV power, solar shading), building features (cycle park, terraces, members' club, double-height reception, tower meeting room), and current tenants
- `gallery` array and `building-info.png` entry left in place but inactive (same pattern already used for not-yet-added tenant photos) — easy to bring back into `screens[]` later
- Confirmed correct address is 326 Kensal Rd, W10 5BZ (brochure was right) — updated `content.js` and this file
- Added four one-off Kindred Studios events for July, given directly by the user (not yet listed on kindredstudios.co.uk/calendar): 15/07 Sculpting Hearts, 21/07 Adult Football, 23/07 Growing Herbs, 30/07 Reggae Aerobics. Recurring events (Life Drawing, Qi Gong, Choir, Artist Support Group) unchanged
- Pushed to git

### In Progress
*(nothing — clean end to session 3)*

### Next Up
- Tenant photos: Kindred Studios, Emilia Wickstead, Perfect Moment — drop images in `images/`, add to `screens[]` in `content.js`
- Kindred events — the four July one-offs above are past-date-filtered automatically; check kindredstudios.co.uk/calendar for August events as the month turns
- Consider custom domain / tablet mounting setup for permanent display

---

## How to Resume

Say: *"Please read CLAUDE.md and summarise the current state of the kiosk project, then let's continue."*
