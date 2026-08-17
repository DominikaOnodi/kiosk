/* ─────────────────────────────────────────────────
   THE GRAMOPHONE WORKS — KIOSK CONTROLLER

   Works by simply opening index.html in a browser
   (no server required). Edit content.js to update
   content — the page auto-reloads every 30 min.
   ───────────────────────────────────────────────── */

const DEFAULT_DURATION  = 13_000;
const AUTO_RELOAD_MS    = 50 * 60_000; // reload page every 30 min for content updates

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
      // A tenant is either a plain string (rendered as text) or
      // { name, logo } (rendered as their logo, with text fallback).
      (floor.tenants ?? []).forEach(t => {
        if (t && typeof t === "object" && t.logo) {
          const img   = document.createElement("img");
          img.className = "tenant-logo-img";
          img.alt     = t.name ?? "";
          if (t.logoHeight) img.style.height = t.logoHeight;
          img.onerror = () => {
            const span = document.createElement("span");
            span.className   = "tenant";
            span.textContent = t.name ?? "";
            img.replaceWith(span);
          };
          tenantsEl.appendChild(img);
          img.src = t.logo;
        } else {
          const span = document.createElement("span");
          span.className   = "tenant";
          span.textContent = typeof t === "string" ? t : (t?.name ?? "");
          tenantsEl.appendChild(span);
        }
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

  document.getElementById("story-title").textContent =
    data.building?.name ?? "The Gramophone Works";

  // Facts may contain "\n" to force a specific line break (e.g. splitting
  // two sentences onto separate lines) rather than relying on natural wrap.
  const factText = facts[factCursor % facts.length];
  document.getElementById("story-fact").innerHTML =
    escHtml(factText).replace(/\n/g, "<br>");

  const bg = document.getElementById("story-bg");
  if (bg && data.storyBackground) {
    bg.style.backgroundImage = `url("${data.storyBackground}")`;
  }

  renderLogo(SCREENS.story, data.tsp);
}

function renderGallery(idx) {
  if (!data) return;
  const items = data.gallery ?? [];
  const item  = items[idx ?? 0];
  if (!item) return;

  SCREENS.gallery.classList.toggle("layout-split", item.layout === "split");

  const media = document.getElementById("gallery-media");

  if (item.images?.length) {
    media.innerHTML = "";
    media.appendChild(galleryDuo(item.images, item.name));
  } else if (item.video) {
    media.innerHTML = "";
    media.appendChild(videoEmbed(item.video, item.videoSize));
  } else if (item.image) {
    const img    = document.createElement("img");
    img.alt      = item.name ?? "";
    img.onerror  = () => { media.innerHTML = galleryPlaceholder(item.name); };
    media.innerHTML = "";
    media.appendChild(img);
    img.src = item.image; // set after append so onerror fires reliably
  } else {
    media.innerHTML = galleryPlaceholder(item.name);
  }

  const overlayEl = document.getElementById("gallery-overlay");
  overlayEl.textContent  = item.overlayText ?? "";
  overlayEl.style.display = item.overlayText ? "flex" : "none";

  // nameLogo swaps the plain-text name for a logo image, in the exact same
  // caption-row slot (unlike `logo`, which overlays top-left on the photo).
  const nameEl = document.getElementById("gallery-name");
  if (item.nameLogo) {
    nameEl.textContent = "";
    const logoImg = document.createElement("img");
    logoImg.className = "gallery-name-logo-img";
    logoImg.alt        = item.name ?? "";
    logoImg.src        = item.nameLogo;
    nameEl.appendChild(logoImg);
  } else {
    nameEl.textContent = item.name ?? "";
  }

  document.getElementById("gallery-meta").textContent =
    [item.medium, item.floor].filter(Boolean).join("  ·  ");

  const eyebrowEl = document.getElementById("gallery-eyebrow");
  eyebrowEl.textContent  = item.eyebrow ?? "";
  eyebrowEl.style.display = item.eyebrow ? "block" : "none";

  const factEl = document.getElementById("gallery-fact");
  factEl.textContent  = item.fact ?? "";
  factEl.style.display = item.fact ? "block" : "none";

  // Default (non-split) layout: fact text sits inline in the caption row,
  // centred between the name/logo and the meta text, instead of stacked
  // as its own line above the row. Split layout (Emilia) is untouched —
  // its fact text and caption row are deliberately laid out separately.
  const captionRow  = document.getElementById("gallery-caption-row");
  const captionWrap = document.getElementById("gallery-caption");
  factEl.classList.toggle("gallery-fact--inline", item.layout !== "split");
  if (item.layout === "split") {
    captionWrap.insertBefore(factEl, captionRow);
  } else {
    captionRow.insertBefore(factEl, document.getElementById("gallery-meta"));
  }

  const logoWrap = document.getElementById("gallery-logo-wrap");
  const logoImg  = document.getElementById("gallery-logo-img");
  if (item.logo) {
    logoImg.alt = item.name ?? "";
    logoImg.src = item.logo;
    logoWrap.style.display = "block";
  } else {
    logoWrap.style.display = "none";
  }
}

function galleryPlaceholder(name) {
  return `<div class="gallery-placeholder">
    <span class="gallery-placeholder-label">${escHtml(name ?? "Image")}</span>
  </div>`;
}

// Editorial diptych — two photos side by side, full height, thin seam between.
// Each panel crops independently (object-fit: cover) so a broken image only
// blanks its own half rather than the whole slide.
function galleryDuo(images, name) {
  const duo = document.createElement("div");
  duo.className = "gallery-duo";
  images.forEach(src => {
    const img   = document.createElement("img");
    img.alt     = name ?? "";
    img.onerror = () => { img.style.visibility = "hidden"; };
    duo.appendChild(img);
    img.src = src;
  });
  return duo;
}

// item.video can be a local video file (images/videos/*.mp4 etc.) or a
// YouTube URL/bare ID — local files play natively; YouTube falls back to
// an embedded player. Muted + looping either way, same footprint as a photo.
// `sizePct` (e.g. "60%") overrides the default 88% display size — handy for
// lower-resolution source clips that look blurry stretched to the default.
// Re-created (and restarted) each time this slide comes around in the rotation.
function videoEmbed(src, sizePct) {
  if (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src)) {
    const video = document.createElement("video");
    video.className   = "gallery-video";
    video.autoplay    = true;
    video.muted       = true;
    video.loop        = true;
    video.playsInline = true;
    video.src         = src;
    if (sizePct) { video.style.width = sizePct; video.style.height = sizePct; }
    return video;
  }

  const videoId = youtubeId(src);
  const iframe  = document.createElement("iframe");
  iframe.className = "gallery-video";
  iframe.src =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&mute=1&loop=1&playlist=${videoId}` +
    `&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`;
  iframe.setAttribute("allow", "autoplay; encrypted-media");
  iframe.setAttribute("frameborder", "0");
  if (sizePct) { iframe.style.width = sizePct; iframe.style.height = sizePct; }
  return iframe;
}

// Accepts a full YouTube URL (watch/youtu.be/embed) or a bare 11-char video ID.
function youtubeId(input) {
  const fromUrl = input.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube(?:-nocookie)?\.com\/embed\/)([\w-]{11})/
  );
  if (fromUrl) return fromUrl[1];
  return /^[\w-]{11}$/.test(input) ? input : null;
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

  // Auto-reload the page every 30 min so content.js changes appear
  setTimeout(() => location.reload(), AUTO_RELOAD_MS);

  // Fullscreen on first click (browsers require a user gesture)
  document.addEventListener("click", () => {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, { once: true });
}

init();
