/* ─────────────────────────────────────────────────
   THE GRAMOPHONE WORKS — KIOSK CONTROLLER

   Works by simply opening index.html in a browser
   (no server required). Edit content.js to update
   content — the page auto-reloads every 30 min.
   ───────────────────────────────────────────────── */

const DEFAULT_DURATION  = 13_000;
// Auto-reload removed — kiosk stays on directory screen indefinitely

const DEFAULT_ROTATION = [
  { type: "directory", duration: 22_000 },
  { type: "story",     duration: 13_000 },
  { type: "gallery",   galleryIndex: 0, duration: 13_000 },
  { type: "events",    duration: 13_000 },
];

let data         = null;
let rotationIdx  = 0;
let factCursor   = 0;
let advanceTimer = null;

const SCREENS = {
  directory: document.getElementById("s-directory"),
  story:     document.getElementById("s-story"),
  gallery:   document.getElementById("s-gallery"),
  events:    document.getElementById("s-events"),
};


// ── Content loading ──────────────────────────────
// Reads from window.KIOSK_CONTENT (defined in content.js,
// loaded via <script> tag — works with file:// and http://).

function loadContent() {
  if (window.KIOSK_CONTENT) {
    data = window.KIOSK_CONTENT;
  } else {
    console.warn("[kiosk] window.KIOSK_CONTENT not found — check content.js loaded correctly");
  }
}


// ── Rotation helpers ─────────────────────────────

function getRotation() {
  return data?.screens?.length ? data.screens : DEFAULT_ROTATION;
}

function currentEntry() {
  const r = getRotation();
  return r[rotationIdx % r.length];
}


// ── Renderers ────────────────────────────────────

function renderDirectory() {
  if (!data) return;

  document.getElementById("dir-eyebrow").textContent =
    data.building?.name ?? "The Gramophone Works";

  const list = document.getElementById("dir-floors");
  list.innerHTML = "";

  (data.floors ?? []).forEach(floor => {
    const li = document.createElement("li");
    li.className = "floor-entry" +
      (floor.floor === "Ground" ? " floor-entry--ground" : "");

    const numEl = document.createElement("div");
    numEl.className   = "floor-num";
    numEl.textContent = floor.floor;

    const tenantsEl = document.createElement("div");
    tenantsEl.className = "floor-tenants";

    if (floor.floor === "Ground") {
      // Ground floor: all tenants on one line separated by a middot
      const span = document.createElement("span");
      span.className = "tenant";
      span.innerHTML = (floor.tenants ?? []).map(escHtml).join("&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;");
      tenantsEl.appendChild(span);
    } else {
      (floor.tenants ?? []).forEach(name => {
        const span = document.createElement("span");
        span.className   = "tenant";
        span.textContent = name;
        tenantsEl.appendChild(span);
      });
    }

    li.appendChild(numEl);
    li.appendChild(tenantsEl);
    list.appendChild(li);
  });

  renderLogo(SCREENS.directory, data.tsp);
}

function renderLogo(screenEl, logoData) {
  if (!data || !logoData) return;
  const logoImg  = screenEl.querySelector(".tsp-logo-img");
  const logoText = screenEl.querySelector(".tsp-logo-text");
  if (!logoImg) return;

  logoText.textContent = logoData.name ?? "";

  if (logoData.logo) {
    logoImg.alt     = logoData.name ?? "";
    logoImg.onerror = () => {
      logoImg.style.display  = "none";
      logoText.style.display = "block";
    };
    logoImg.onload = () => {
      logoImg.style.display  = "block";
      logoText.style.display = "none";
    };
    logoImg.src = logoData.logo;
  } else {
    logoImg.style.display  = "none";
    logoText.style.display = "block";
  }
}

function renderStory() {
  if (!data) return;
  const facts = data.facts ?? [];
  if (!facts.length) return;
  document.getElementById("story-fact").textContent =
    facts[factCursor % facts.length];

  const bg = document.getElementById("story-bg");
  if (bg && data.storyBackground) {
    bg.style.backgroundImage = `url("${data.storyBackground}")`;
  }
}

function renderGallery(idx) {
  if (!data) return;
  const items = data.gallery ?? [];
  const item  = items[idx ?? 0];
  if (!item) return;

  const visual = document.getElementById("gallery-visual");

  if (item.image) {
    const img    = document.createElement("img");
    img.alt      = item.name ?? "";
    img.onerror  = () => { visual.innerHTML = galleryPlaceholder(item.name); };
    visual.innerHTML = "";
    visual.appendChild(img);
    img.src = item.image; // set after append so onerror fires reliably
  } else {
    visual.innerHTML = galleryPlaceholder(item.name);
  }

  document.getElementById("gallery-name").textContent = item.name ?? "";
  document.getElementById("gallery-meta").textContent =
    [item.medium, item.floor].filter(Boolean).join("  ·  ");
}

function galleryPlaceholder(name) {
  return `<div class="gallery-placeholder">
    <span class="gallery-placeholder-label">${escHtml(name ?? "Image")}</span>
  </div>`;
}

function getEventsToShow() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = (data.upcomingEvents ?? [])
    .filter(ev => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(ev.date)) {
        const [y, m, d] = ev.date.split("-").map(Number);
        return new Date(y, m - 1, d) >= today;
      }
      return false;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const recurring = data.recurringEvents ?? data.events ?? [];
  return [...upcoming, ...recurring];
}

function renderEvents() {
  if (!data) return;

  renderLogo(SCREENS.events, data.kindred ?? data.tsp);

  document.querySelector("#s-events .events-eyebrow").textContent =
    data.eventsEyebrow ?? "What's On";
  document.querySelector("#s-events .events-heading").textContent =
    data.eventsTitle ?? "Upcoming Events";

  const list = document.getElementById("events-list");
  list.innerHTML = "";

  getEventsToShow().forEach(ev => {
    const li = document.createElement("li");
    li.className = "event-entry";

    const dateEl       = document.createElement("span");
    dateEl.className   = "event-date";
    dateEl.textContent = formatDate(ev.date);

    const titleEl       = document.createElement("span");
    titleEl.className   = "event-title";
    titleEl.textContent = ev.title ?? "";

    li.appendChild(dateEl);
    li.appendChild(titleEl);
    list.appendChild(li);
  });
}


// ── Helpers ──────────────────────────────────────

function formatDate(str) {
  if (!str) return "";
  // ISO date → formatted (e.g. "2026-07-05" → "5 July 2026")
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });
  }
  // Recurring label → show as-is ("Mondays & Wednesdays", "Every Thursday", etc.)
  return str;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


// ── Screen transitions ────────────────────────────

function showOnly(type) {
  Object.entries(SCREENS).forEach(([key, el]) => {
    el.classList.toggle("active", key === type);
  });
}

function renderEntry(entry) {
  switch (entry.type) {
    case "directory": renderDirectory();                        break;
    case "story":     renderStory();                           break;
    case "gallery":   renderGallery(entry.galleryIndex ?? 0); break;
    case "events":    renderEvents();                          break;
  }
  showOnly(entry.type);
}

// setTimeout (not setInterval) so each screen can have its own duration
function scheduleAdvance() {
  clearTimeout(advanceTimer);
  advanceTimer = setTimeout(advance, currentEntry()?.duration ?? DEFAULT_DURATION);
}

function advance() {
  const rotation = getRotation();
  rotationIdx    = (rotationIdx + 1) % rotation.length;

  const entry = rotation[rotationIdx];
  if (entry.type === "story") factCursor++;

  renderEntry(entry);
  scheduleAdvance();
}


// ── Init ─────────────────────────────────────────

function init() {
  loadContent();

  rotationIdx = 0;
  renderEntry(getRotation()[0]);
  scheduleAdvance();

  // Fullscreen on first click (browsers require a user gesture)
  document.addEventListener("click", () => {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, { once: true });
}

init();
