// ──────────────────────────────────────────────────────────
//  THE GRAMOPHONE WORKS — KIOSK CONTENT
//  Edit this file to update what shows on screen.
//  Save, then refresh the browser to apply changes.
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
    { type: "directory", duration: 22000 },
    { type: "story",     duration: 13000 },
    { type: "events",    duration: 13000 }
  ],

  // ── Floor directory ───────────────────────────────────

  floors: [
    { floor: "Ground", tenants: ["Café", "Reception", "Kindred Workshop Rooms"] },
    { floor: "1–3",    tenants: ["Kindred Studios"] },
    { floor: "4",      tenants: ["Emilia Wickstead"] },
    { floor: "5",      tenants: ["Perfect Moment"] }
  ],

  // ── Story screen background ───────────────────────────
  // This image shows faded behind the building fact text.

  storyBackground: "images/building-exterior.jpg",

  // ── Building facts (cycles one per rotation) ─────────

  facts: [
    "64,000 sq ft across six floors, overlooking the Grand Union Canal.",
    "BREEAM Excellent and EPC A certified — one of West London's most sustainable creative workplaces.",
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
  // No gallery screens are active in the rotation right now (the building-info
  // image slide was removed — its facts were folded into the story rotation above).
  // Add an entry to screens[] (e.g. { type: "gallery", galleryIndex: 2, duration: 13000 })
  // to bring any of these back once tenant photos arrive.

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
      image:  "images/kindred-01.jpg",
      name:   "Kindred Studios",
      medium: "Jewellery & Mixed Media",
      floor:  "Floors 1–3"
    },
    {
      image:  "images/kindred-02.jpg",
      name:   "Kindred Studios",
      medium: "Ceramics",
      floor:  "Floors 1–3"
    },
    {
      image:  "images/emilia-01.jpg",
      name:   "Emilia Wickstead",
      medium: "Womenswear",
      floor:  "Floor 4"
    },
    {
      image:  "images/perfect-moment-01.jpg",
      name:   "Perfect Moment",
      medium: "Luxury Activewear",
      floor:  "Floor 5"
    }
  ],

  // ── Events ────────────────────────────────────────────
  // upcomingEvents: one-off events. Use "YYYY-MM-DD" — past dates are hidden automatically.
  // recurringEvents: always shown below upcoming ones.

  eventsEyebrow: "Kindred Studios",
  eventsTitle:   "Sessions & Events",

  upcomingEvents: [
    // Add dated events from kindredstudios.co.uk/calendar as they appear
    // e.g. { date: "2026-07-12", title: "Open Studios" }
    { date: "2026-07-15", title: "Sculpting Hearts" },
    { date: "2026-07-21", title: "Adult Football" },
    { date: "2026-07-23", title: "Growing Herbs" },
    { date: "2026-07-30", title: "Reggae Aerobics" }
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
    logo: "images/tsp-logo.png"
  },

  kindred: {
    name: "Kindred Studios",
    logo: "images/kindred-logo.png"
  }

};
