// ──────────────────────────────────────────────────────────
//  THE GRAMOPHONE WORKS — KIOSK CONTENT
//  Edit this file to update what shows on screen.
//  Save, then refresh the browser (or it auto-reloads every 30 min).
//
//  TO ACTIVATE A TENANT PHOTO:
//   1. Drop the image in the images/ folder
//   2. Add it to the gallery array below (note the index it gets, e.g. index 6)
//   3. Add a matching entry to screens: { type: "gallery", galleryIndex: 6, duration: 13000 }
// ──────────────────────────────────────────────────────────

window.KIOSK_CONTENT = {

  building: {
    name:    "The Gramophone Works",
    address: "326 Kensal Rd, W10 5BZ"
  },

  // ── Rotation ──────────────────────────────────────────
  // Each entry is shown in order, looping forever.
  // duration = milliseconds the screen stays visible.
  // galleryIndex = which entry in the gallery array below to show.

  screens: [
    { type: "gallery",   galleryIndex: 10, duration: 5000 },
    { type: "directory", duration: 22000 },
    { type: "story",     duration: 13000 },
    // Events screen paused — only Life Drawing is still weekly, not enough
    // for its own slide right now. Add back once the schedule fills out:
    // { type: "events", duration: 20000 },
    { type: "gallery",   galleryIndex: 2, duration: 13000 },
    { type: "gallery",   galleryIndex: 4, duration: 13000 },
    { type: "gallery",   galleryIndex: 5, duration: 13000 },
    { type: "gallery",   galleryIndex: 9, duration: 14000 },
    { type: "gallery",   galleryIndex: 8, duration: 16000 }
  ],

  // ── Floor directory ───────────────────────────────────

  // A tenant is either a plain string (shown as text) or { name, logo }
  // (shown as their logo — falls back to text if the image fails to load).
  floors: [
    // logoHeight overrides the default size — Perfect Moment's logo file has
    // more internal padding than the others, so it reads smaller at the same height.
    { floor: "5",      tenants: [{ name: "Perfect Moment", logo: "images/perfect-moment-logo.png", logoHeight: "clamp(48px, 5.2vw, 84px)" }] },
    { floor: "4",      tenants: [{ name: "Emilia Wickstead", logo: "images/emilia-logo.png" }] },
    // logoHeight override — Kindred's logo was reading noticeably smaller
    // than Emilia's/Perfect Moment's at the shared default size.
    { floor: "1–3",    tenants: [{ name: "Kindred Studios",  logo: "images/kindred-logo.png", logoHeight: "clamp(46px, 4.9vw, 80px)" }] },
    { floor: "Ground", tenants: ["Café", "Reception", "Kindred Workshop Rooms"] }
  ],

  // ── Story screen background ───────────────────────────
  // This image shows faded behind the building fact text.

  storyBackground: "images/building-exterior.jpg",

  // ── Building facts (cycles one per rotation) ─────────

  facts: [
    "64,000 sq ft across six floors, overlooking the Grand Union Canal.",
    "BREEAM Excellent and EPC A certified.\nWest London's most sustainable creative workplace.",
    "Carbon-neutral timber structure. NLA Environmental Prize, 2021.",
    "655 tonnes of CO₂ saved by retaining the building's original concrete columns.",
    "A green roof supports canal-side ecology, alongside photovoltaic power and solar shading.",
    "Low-energy LED lighting with sensors and mobile phone access control throughout.",
    "Cycle park with 90 spaces and 7 showers for those arriving by bike.",
    "Full-length terraces with exceptional views across the Grand Union Canal.",
    "A creative members' club on the third floor, with a canal-side terrace and event space off reception.",
    "A double-height reception welcomes visitors on the ground floor.",
    "The feature meeting room sits within a historic tower — a nod to the building's heritage.",
    "Home to Kindred Studios, Emilia Wickstead and Perfect Moment — distinct creative businesses under one roof."
  ],

  // ── Gallery images ────────────────────────────────────
  // Indices 2 (Kindred), 4, 5 (Emilia photos), 8 (Perfect Moment diptych), 9
  // (Perfect Moment brand film) and 10 (Welcome slide, shown first) are active
  // (referenced in screens above).
  // Index 0 (building exterior) is used as the story background only, not a gallery slide.
  // Indices 1 (building info), 3 (Kindred, second photo), 6 (Emilia brand film —
  // paused, too blurry), 7 (Perfect Moment photo) are ready but not shown yet —
  // add a matching { type: "gallery", galleryIndex: N, duration: 13000 } to
  // screens[] once photos/a better video arrive.
  // `images: [a, b]` renders a side-by-side diptych instead of a single photo.
  // `video` accepts a local file (e.g. "videos/name.mp4") or a YouTube URL/bare ID —
  // either way it plays muted and looping. Swap Perfect Moment's diptych (index 8) or
  // film (index 9) any time by just replacing those fields, no need to touch screens[].

  gallery: [
    {
      image:  "images/building-exterior.jpg",
      name:   "The Gramophone Works",
      medium: "Ladbroke Grove, West London",
      floor:  "Grand Union Canal"
    },
    {
      image:  "images/building-info.png",
      name:   "The Gramophone Works",
      medium: "",
      floor:  ""
    },
    {
      image:    "images/kindred-event.jpeg",
      // nameLogo replaces the plain text name with a logo image, in the
      // exact same spot/size in the caption row (not the top-left overlay
      // or footer-block treatments `logo` normally gets).
      nameLogo: "images/kindred-logo.png",
      name:     "Kindred Studios",
      medium:   "Web of Life — Exhibition",
      floor:    "Floors 1–3"
    },
    {
      image:  "images/kindred-02.jpg",
      name:   "Kindred Studios",
      medium: "Ceramics",
      floor:  "Floors 1–3"
    },
    {
      image:  "images/emilia-bridal-01.webp",
      name:   "Emilia Wickstead",
      medium: "Bridal 2026 × Yoko London",
      floor:  "Floor 4",
      logo:   "images/emilia-logo.png",
      layout: "split",
      fact:   "Fifty years of pearl craftsmanship meets Wickstead's architectural silhouettes — a new bridal collaboration, London-made."
    },
    {
      image:  "images/emilia-bridal-02.webp",
      name:   "Emilia Wickstead",
      medium: "Bridal 2026",
      floor:  "Floor 4",
      logo:   "images/emilia-logo.png",
      layout: "split",
      fact:   "Refined silhouettes, elegant restraint — pearls chosen to symbolise love, purity and new beginnings."
    },
    // Brand film — PAUSED, not in screens[] below. Even shown small (videoSize)
    // the source clip still looked too blurry. Left here in case a
    // higher-quality file replaces it later — just add
    // { type: "gallery", galleryIndex: 6, duration: 25000 } back to screens[]
    // (right before index 4 to keep it ahead of the other Emilia slides).
    {
      video:     "videos/emilia-brand-film.mp4",
      videoSize: "55%",
      name:      "Emilia Wickstead",
      medium:    "Brand Film",
      floor:     "Floor 4",
      logo:      "images/emilia-logo.png"
    },
    {
      image:  "images/perfect-moment-01.jpg",
      name:   "Perfect Moment",
      medium: "Luxury Activewear",
      floor:  "Floor 5"
    },
    // Editorial diptych — two photos side by side. Swap either path any time.
    // Uses the logo (in the name slot) instead of text, matching the brand
    // film slide, so Perfect Moment reads consistently across both screens.
    {
      images:   [
        "images/perfect-moment-editorial-01.avif",
        "images/perfect-moment-editorial-02.avif"
      ],
      nameLogo: "images/perfect-moment-logo.png",
      name:     "Perfect Moment",
      medium:   "Editorial",
      floor:    "Floor 5"
    },
    // Brand film — plays muted and looping. Swap the `video` file any time.
    {
      video:       "videos/perfect-moment-brand-film.mp4",
      nameLogo:    "images/perfect-moment-logo.png",
      name:        "Perfect Moment",
      medium:      "Brand Film",
      floor:       "Floor 5",
      fact:        "Hit the slopes everywhere and anywhere — make it a Perfect Moment.",
      overlayText: "Ski in your Perfect Moment"
    },
    // Welcome slide — first thing shown on the rotation, brief (5s, see
    // screens[] above). Image has its own "Welcome to The Gramophone Works" /
    // "Managed by TSP" text baked in, so no separate caption content added —
    // same minimal-caption treatment as the Kindred exhibition poster (index 2).
    {
      image:  "images/Welcome-Display.png",
      name:   "The Gramophone Works",
      medium: "",
      floor:  ""
    }
  ],

  // ── Events ────────────────────────────────────────────
  // upcomingEvents: one-off events. Use "YYYY-MM-DD" — past dates are hidden automatically.
  // recurringEvents: always shown below upcoming ones.

  eventsEyebrow: "Kindred Studios",
  eventsTitle:   "Sessions & Events",

  upcomingEvents: [
    { date: "2026-06-28", title: "Open Studios" }
    // Add more from kindredstudios.co.uk/calendar as they appear
  ],

  recurringEvents: [
    { date: "Mon & Wed",      title: "Life Drawing" },
    { date: "Every Tuesday",  title: "Qi Gong" },
    { date: "Every Thursday", title: "Kindred Choir, 6–7pm" },
    { date: "First Thursday", title: "Monthly Artist Support Group" }
  ],

  // ── Branding ──────────────────────────────────────────

  tsp: {
    name: "TSP",
    // Regenerated from the original tsp-logo.png, which turned out to be an
    // opaque white rectangle (not a transparent PNG) — the old invert+screen
    // CSS trick to fake transparency against navy broke down against the
    // story screen's photo background. This version has real alpha and is
    // pre-coloured cream, so it composites cleanly on any backdrop.
    logo: "images/tsp-logo-transparent.png"
  },

  kindred: {
    name: "Kindred Studios",
    logo: "images/kindred-logo.png"
  }

};
