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

### Screen rotation (defined in `content.js` → `screens` array — current as of session 4)
1. **Directory** — floor-by-floor tenant list, tenant logos instead of names where available, TSP logo top-right (shown longest: 22s)
2. **Story** — one building fact at a time, cycles through `facts[]` (12 facts)
3. **Gallery (index 2)** — Kindred Studios' "Web of Life" exhibition photo (13s)
4. **Gallery (index 4, 5)** — Emilia Wickstead bridal editorial, split layout (text left / photo right) (13s each)
5. **Gallery (index 8)** — Perfect Moment brand film, muted/looping, hero overlay text, logo in footer (14s)

Events screen is paused (commented out in `screens[]`) — only Life Drawing is weekly right now, not enough for its own slide.

### Key behaviour
- Transitions: 800ms CSS opacity crossfade
- Auto-reload: page reloads every 30 minutes to pick up `content.js` changes
- Fullscreen: triggered on first click (browser security requirement)
- No server needed: content loaded via `<script src="content.js">`, not fetch()
- Gallery items support optional `fact`, `eyebrow`, `logo` (+ `logoHeight`/`logoPosition: "footer"` overrides), `layout: "split"`, `images: [a, b]` (side-by-side diptych), `video` (local file or YouTube), `videoSize`, and `overlayText` (hero headline on the photo/video) — see comments in `content.js` for each

### Deployment
- Live at **dominikaonodi.github.io/kiosk** (repo: `github.com/DominikaOnodi/kiosk`, branch `main`)
- Deploys via a GitHub Actions workflow (`.github/workflows/pages.yml`) — pushing to `main` triggers it automatically, usually live within ~1 minute
- The legacy "Deploy from a branch" Pages mechanism was unreliable (repeated unexplained timeouts/cancellations even with a tiny payload) — don't switch back to it; Actions-based deploy has been solid since session 4
- Netlify (`gramophonekiosk.netlify.app`) exists but was never properly connected — still serving a stale old snapshot, not part of the real deploy path. Ignore it unless asked to fix it.
- `gramophone-kiosk-master/` (the folder one level up containing this folder) is **not** part of the repo — only `gramophone-kiosk/` itself is tracked in git

### How to update content
Edit `content.js`, commit, and push to `main` — that's it, no build step.

### How to activate a new tenant photo
1. Drop image in `images/` (or video in `videos/`)
2. In `content.js`, add/edit the matching `gallery[]` entry
3. In `content.js → screens`, add a matching `{ type: "gallery", galleryIndex: N, duration: 13000 }`
4. Commit and push

---

## Design Direction

- **Aesthetic:** editorial/gallery — Kinfolk magazine meets minimal art gallery
- **Background:** navy `#1F3462`
- **Text:** cream `#F6F2EC`
- **Font:** DM Sans (Google Fonts) — used throughout (headings, floor numbers, facts, captions); no separate serif
- **Rules:** flat, no shadows, no rounded cards, no gradients
- **Type sizes:** large for distance viewing (floor numbers ~64–112px, facts ~26–60px)
- **Tenant/TSP logos:** top-right on directory/events, top-left overlay on gallery photos; `filter: invert(1)` + `mix-blend-mode: screen` makes dark logo art read white against the navy background

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

### Session 3 — 6 August 2026
- **Cleaned up a duplicate project copy:** the parent folder (`gramophone-kiosk-master/`) had a full second copy of the site loose at its root — leftover from session 1, still cream/Fraunces. Deleted those stale files (`index.html`, `styles.css`, `app.js`, `content.js`, `content.json`, `netlify.toml`, top-level `images/`) so `gramophone-kiosk/` is now the only copy. This `CLAUDE.md`'s Design Direction section was also out of date (still described cream/Fraunces from session 1) — corrected to match the actual navy/DM Sans design shipped in session 2.
- **Added first tenant page: Emilia Wickstead** (Floor 4), sourced from `emiliawickstead.com` editorial content:
  - Two Bridal 2026 × Yoko London editorial photos, each with a short fact pulled from the article (pearl craftsmanship, bridal silhouette philosophy)
  - One "New Arrivals" slide (Pre-Fall 2026, "Bonjour Tristesse") — designed to be swapped each season
  - Images added: `emilia-bridal-01.webp`, `emilia-bridal-02.webp`, `emilia-new-arrivals.png`, `emilia-logo.png`
- **Extended the gallery screen** (reusable for future tenants, e.g. Perfect Moment next):
  - Gallery items now support an optional `fact` field — italic caption line shown above name/meta
  - Gallery items now support an optional `logo` field — tenant logo overlaid top-left on the photo (same invert+screen treatment as the TSP logo)
  - Changes in `index.html` (`.gallery-logo-wrap`, `.gallery-fact`, `.gallery-caption-row`), `styles.css`, `app.js` (`renderGallery`)
- Rotation is now: Directory → Story → Building photo → Emilia bridal ×2 → Emilia new arrivals → Events (gallery indices 1, 4, 5, 6)

### Session 4 — 6 August 2026
- **Gallery images were cropping badly:** portrait editorial photos were using `object-fit: cover` in a landscape frame, so most of each photo was cut off. Switched to `object-fit: contain` (applies to the whole gallery, all tenants) — photos now always show in full, letterboxed against navy.
- **Added a "split" layout modifier** for portrait photos that still felt empty full-bleed: `layout: "split"` on a gallery item puts the text panel on the left and the photo on the right, full height, instead of a bottom caption bar. Used for all three Emilia slides. CSS in `styles.css` under `.screen--gallery.layout-split`.
- **Added an `eyebrow` field** to gallery items — a small section label shown above the fact (e.g. "Latest Arrivals"). Renders between the logo and the fact text.
- Emilia's logo (in split layout) moved to a fixed top-left position and enlarged (~44–84px, was ~24–36px) so it reads as the page's primary mark rather than an inline lockup.
- Renamed the "New Arrivals" slide to **"Latest Arrivals"** per request; content now split across `eyebrow: "Latest Arrivals"` + `medium: "Pre-Fall 2026"` instead of one combined string.
- **Removed the empty "Gramophone Works" building-info slide** from the rotation — `images/building-info.png` was never added, so it was showing as a blank/placeholder screen. The gallery array entry (index 1) is left in place for whenever that photo arrives; just add it back to `screens[]`.
- **Directory screen:** TSP logo enlarged (~64–112px, was ~56–100px) and now has a "Building managed by" label above it (directory screen only — the same markup on the events screen, which shows the Kindred logo, is unaffected).
- **Added Perfect Moment's brand film** (Floor 5) as a gallery slide: gallery items now support an optional `video` field (any YouTube URL or bare video ID) — renders as a muted, looping, chrome-free embed (`youtube-nocookie.com`, `controls=0`) filling the same frame a photo would. Helpers `youtubeId()` / `youtubeEmbed()` in `app.js`. Logo `images/perfect-moment-logo.png` added; slide uses the default (non-split) layout since the video is landscape and fills the frame well full-bleed.
- **Folder cleanup:** deleted the stale top-level `CLAUDE.md` (was still describing the session-1 cream/Fraunces design, fully superseded by this file). This file (`gramophone-kiosk/CLAUDE.md`) is now the only one — read this one, not any other.
- **Switched both brand films from YouTube embeds to local video files** — the YouTube iframe wasn't playing reliably, and the client downloaded both videos directly. `item.video` now points at a local file (`videos/*.mp4`) and renders as a native `<video autoplay muted loop playsinline>`; a YouTube URL/bare ID still works too (falls back to the `youtube-nocookie.com` iframe) if a local file isn't available. New helper `videoEmbed()` in `app.js` picks the right one by file extension.
  - Added `gramophone-kiosk/videos/emilia-brand-film.mp4` (27MB) and `videos/perfect-moment-brand-film.mp4` (0.9MB)
  - **Replaced the Emilia "Latest Arrivals" slide (gallery index 6) with the Emilia brand film** — client said the seasonal-arrivals concept isn't needed anymore now there's a video. `images/emilia-new-arrivals.png` is now unused (left in place, not deleted, in case it's wanted again). The Emilia video slide has no `fact`/`eyebrow` yet — nobody's told me what's in the video, so nothing was invented; add one if wanted.
  - Perfect Moment's video slide keeps its existing `eyebrow`/`fact` ("Watch" / "Hit the slopes...") since that came from the video's own YouTube title, still accurate.
- Added a hero-style **`overlayText`** field for gallery items — large bold uppercase headline overlaid directly on the photo/video (not the bottom caption bar), styled after Perfect Moment's own homepage hero banners. Perfect Moment's brand film now shows "Ski in your Perfect Moment" over the video. Implementation restructured `.gallery-visual` into a persistent wrapper with an inner `.gallery-media` (rebuilt each render) plus a sibling `.gallery-overlay`, so the headline survives the media swap and always centers on the visual regardless of layout (`split` or default).
- Added a **`videoSize`** override field (e.g. `"55%"`) for gallery items — lets a specific video display smaller than the default 88%, since Emilia's clip looked blurry stretched to that size (lower source resolution).
- **Paused the Emilia brand film** — even at 55% it still wasn't good enough quality, client wants to wait for a better clip. Removed from `screens[]` but left the gallery entry in place (index 6) for whenever a replacement arrives.
- **Reordered the rotation:** Kindred events now come right after the building story, ahead of the Emilia and Perfect Moment slides (was previously last, after everything).
- **Building fact corrected:** landlord is particular that this is *the* most sustainable creative workplace in West London, not just "one of" — wording updated in `facts[]`.
- Added an **editorial diptych layout** — `images: [a, b]` on a gallery item shows two photos side by side, full height, thin navy seam between, each cropped tight (`object-fit: cover`) for a high-fashion spread feel. New `.gallery-duo` CSS + `galleryDuo()` helper in `app.js`. Used for two new Perfect Moment editorial photos (`perfect-moment-editorial-01.avif`, `-02.avif`), gallery index 8, no fact/logo caption content invented — just name/medium/logo.
- **Found and fixed a misplaced folder:** the whole `images/` folder had been accidentally dragged inside `videos/` (client's slip in File Explorer while adding the new PM editorial photos) — this would have broken every image path on the site. Moved back to `gramophone-kiosk/images/`, sitting alongside `videos/` as it should.
- Noted in passing: `videos/perfect-moment-brand-film.mp4` is now 19MB (was 0.9MB earlier this session) — client appears to have replaced it with a higher-quality version at some point; not investigated further, just flagging the size jump.
- **Swapped Perfect Moment's slide order:** brand film now plays before the editorial diptych (was diptych then film).
- **Perfect Moment video duration matched to actual length:** read via Windows Shell metadata (no ffprobe available) — clip is 14s, was set to a generic 25s. `screens[]` duration for that slide now 14000ms so it doesn't loop mid-viewing before advancing.
- **Added Kindred's first real photo** — a poster for their "Web of Life" exhibition (4 Aug – 29 Sept 2026, Tue 11–7 & Sat 2–5, free entry), replacing the placeholder `kindred-01.jpg` entry (gallery index 2) with `images/kindred-event.jpeg`. Poster has its own text baked in, so no separate fact/logo added — kept the caption minimal (name/medium/floor only).
- **Fixed a long-standing bug in passing:** `images/kindred-logo.png.png` had a Windows double-extension (same issue session 2's log already flagged for three other files, apparently missed for this one) — renamed to `kindred-logo.png`, now matches what `content.js`'s `kindred.logo` field expects.
- **Paused the events (Kindred schedule) screen** — only Life Drawing is still weekly, not enough content to justify its own slide right now. Commented out in `screens[]` rather than deleted; the underlying `recurringEvents`/`upcomingEvents` data is untouched (Qi Gong / Choir / Artist Support Group entries are still there but unverified — worth checking if they're still running before reactivating).
- Rotation is now: Directory → Story → Kindred exhibition photo → Emilia bridal ×2 (split) → Perfect Moment brand film (with "Ski in your Perfect Moment" overlay) → Perfect Moment diptych (gallery indices 2, 4, 5, 9, 8)

- **Connected the project to git and GitHub Pages for the first time.** This local folder had never been a git repo. Discovered the GitHub repo (`dominikaonodi/gramophone-kiosk`, since renamed to `DominikaOnodi/kiosk`) had **two unrelated histories**: `master` (an old messy "Add files via upload" snapshot with the same duplicate-folder problem cleaned up earlier this session) and `main` (a separate, more advanced line of building-content work — correct address, a rich 12-item `facts[]` — made independently from a different computer, entirely disconnected from this session's tenant-page work). Reconciled by hand: kept all of this session's tenant work, pulled in `main`'s corrected `building.address` ("326 Kensal Rd, W10 5BZ" — independently confirmed by the Kindred exhibition poster itself) and full facts list, restored `images/building-info.png` (existed on `main`, was missing locally). Pushed on top of `main`.
- **GitHub Pages deployment saga:** the classic "Deploy from a branch" Pages mechanism failed repeatedly — `Timeout reached, aborting!` and later `Deployment cancelled.` — regardless of payload size (even after cutting video weight by 80%) or a full Pages settings reset. No GitHub-wide incident reported. Root cause never fully identified. Fixed by replacing it with an explicit **GitHub Actions workflow** (`.github/workflows/pages.yml`, standard checkout → upload-pages-artifact → deploy-pages), with `Settings → Pages → Source` switched to "GitHub Actions". Deploys have been fast and reliable since (~1 minute). **Don't switch back to the legacy branch-deploy mechanism.**
- **Compressed the video assets** (installed ffmpeg via winget) while debugging the above: Perfect Moment's brand film re-encoded at CRF 23 with audio stripped (it's always muted anyway) — 19MB → 8.7MB, visually identical (spot-checked a frame). Emilia's brand film (27MB, already paused for quality reasons) removed from git tracking entirely via `.gitignore` — kept locally, not shipped, since most of its 6.5min length was never even seen when it was active.
- **Directory tenant logos:** floor list now shows each tenant's official logo instead of their name (Kindred, Emilia, Perfect Moment — Ground floor stays as text, those are building amenities not brands). New tenant schema: `{ name, logo, logoHeight? }` alongside the existing plain-string option; falls back to text if a logo fails to load. Perfect Moment's logo file has more internal padding than the others so it read smaller at the same height — added a `logoHeight` override.
- **Emilia split-layout text enlarged** — fact/name/meta were too small to read on the actual big screen at reception.
- **Perfect Moment brand film footer redesigned:** logo moved from a top-left overlay on the video into the footer caption bar (new `logoPosition: "footer"` field, reusable), enlarged twice more per feedback, "Watch" eyebrow removed, redundant "Perfect Moment" name text removed (`name: ""`) since the logo already shows it — footer now just shows the logo + fact + medium/floor meta.
- Fixed a stale address in this file's own Project Overview section (was still "Ladbroke Grove, W10 5BU").

### In Progress
*(nothing — clean end to session 4)*

### Next Up
- Client is gathering more material for **both Kindred and Perfect Moment** — expect more photos/video next session
- **Events screen paused** (commented out in `screens[]`) — re-add once the weekly schedule has more than just Life Drawing, and double-check the other recurring entries are still accurate first
- **Emilia brand film paused, untracked in git** (gallery index 6 in `content.js`, not in `screens[]`, excluded via `.gitignore`) — waiting on a higher-quality clip; once one arrives, remove the `.gitignore` line, add the file to `videos/`, and add `{ type: "gallery", galleryIndex: 6, duration: N }` back to `screens[]`
- **Perfect Moment diptych (index 8) has no fact/eyebrow** — add one if a caption is wanted, nothing was invented since there's no source copy for these photos yet
- Perfect Moment photos still pending — `images/perfect-moment-01.jpg` (gallery index 7) referenced but not yet added
- Kindred's second photo slot still open (`kindred-02.jpg`, gallery index 3) — add one and wire into `screens[]` when available
- Building-info photo now exists (`images/building-info.png`, recovered from `main`) but isn't shown anywhere — add a `screens[]` entry if that slide is wanted back
- The old `master` branch on GitHub still exists, untouched, with the old messy duplicate-folder snapshot — harmless to leave, but could be deleted once confident nothing there is needed
- Netlify (`gramophonekiosk.netlify.app`) is still disconnected/stale — either properly connect it to `main` or ignore it; not part of the real deploy path right now
- Consider whether the `gramophone-kiosk-master/gramophone-kiosk/` nested local folder structure should be flattened — only `gramophone-kiosk/` is actually the git repo, the outer wrapper folder isn't part of it at all
- Consider custom domain / tablet mounting setup for permanent display

---

## How to Resume

Say: *"Please read CLAUDE.md and summarise the current state of the kiosk project, then let's continue."*
