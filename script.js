// WIB = UTC+7; each date is the boundary for the named phase
const PHASE_1_END   = new Date("2026-07-04T00:00:00+07:00").getTime(); // Registration closes
const PHASE_2_START = new Date("2026-07-05T00:00:00+07:00").getTime(); // Extended registration opens
const PHASE_2_END   = new Date("2026-07-19T00:00:00+07:00").getTime(); // Extended registration closes (2 weeks)
const PHASE_3_END   = new Date("2026-07-31T00:00:00+07:00").getTime(); // Opening

const PHASE_CONFIG = [
  { from: 0,            to: PHASE_1_END,   label: "Registration Closes In...",       showForms: true  },
  { from: PHASE_1_END,  to: PHASE_2_START, label: null,                              showForms: false },
  { from: PHASE_2_START,to: PHASE_2_END,   label: "Extended Registration Period...", showForms: true  },
  { from: PHASE_2_END,  to: PHASE_3_END,   label: "Opening Starts In...",            showForms: false },
  { from: PHASE_3_END,  to: Infinity,      label: null,                              showForms: false },
];

const BOOKMARKS_KEY = "seranova-bookmarks";

const els = {
  days: document.querySelectorAll(".days"),
  hours: document.querySelectorAll(".hours"),
  minutes: document.querySelectorAll(".minutes"),
  seconds: document.querySelectorAll(".seconds"),
  countdownWrappers: document.querySelectorAll(".countdown-wrapper"),
  sidebar: document.getElementById("sidebar"),
  mainContent: document.querySelector(".main-content"),
  openBtn: document.getElementById("sidebar-open-btn"),
  closeBtn: document.querySelector("#btn"),
  pages: document.querySelectorAll(".page-section"),
  bookmarksList: document.getElementById("bookmarks-list"),
  bookmarksEmpty: document.getElementById("bookmarks-empty")
};

let countdownInterval = null;

const flipUpdate = (nodeList, value) => {
  nodeList.forEach(el => {
    if (el.textContent === value) return;
    el.classList.remove("flip");
    void el.offsetWidth;
    el.classList.add("flip");
    setTimeout(() => { el.textContent = value; }, 250);
    setTimeout(() => { el.classList.remove("flip"); }, 500);
  });
};

const hideSignUpForms = () => {
  document
    .querySelectorAll('a.action-button[href*="docs.google.com/forms"]')
    .forEach(a => { a.style.display = "none"; });
};

const showSignUpForms = () => {
  document
    .querySelectorAll('a.action-button[href*="docs.google.com/forms"]')
    .forEach(a => { a.style.display = ""; });
};

const getCurrentPhase = (now) =>
  PHASE_CONFIG.find(p => now >= p.from && now < p.to) || PHASE_CONFIG[PHASE_CONFIG.length - 1];

const updateCountdown = () => {
  const now = Date.now();
  const phase = getCurrentPhase(now);

  if (phase.showForms) showSignUpForms(); else hideSignUpForms();

  if (!phase.label) {
    els.countdownWrappers.forEach(el => el.classList.add("expired"));
    return;
  }

  els.countdownWrappers.forEach(el => el.classList.remove("expired"));
  document.querySelectorAll(".countdown-title").forEach(el => {
    if (el.textContent !== phase.label) el.textContent = phase.label;
  });

  const distance = phase.to - now;
  if (distance <= 0) return;

  flipUpdate(els.days,    String(Math.floor(distance / 86400000)).padStart(2, "0"));
  flipUpdate(els.hours,   String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0"));
  flipUpdate(els.minutes, String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0"));
  flipUpdate(els.seconds, String(Math.floor((distance % 60000) / 1000)).padStart(2, "0"));
};

updateCountdown();
countdownInterval = setInterval(updateCountdown, 1000);


const getBookmarks = () => {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

const saveBookmarks = (arr) => {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(arr));
};

const isBookmarked = (compId) => getBookmarks().includes(compId);

const toggleBookmark = (compId, sourceBtn) => {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(compId);
  if (idx === -1) bookmarks.push(compId);
  else bookmarks.splice(idx, 1);
  saveBookmarks(bookmarks);
  refreshBookmarkButtons();
  if (sourceBtn) {
    sourceBtn.classList.remove("pop");
    void sourceBtn.offsetWidth;
    sourceBtn.classList.add("pop");
  }
};

const refreshBookmarkButtons = () => {
  document.querySelectorAll(".bookmark-toggle").forEach(btn => {
    const compId = btn.dataset.compId;
    const icon = btn.querySelector("i");
    if (!icon) return;
    if (isBookmarked(compId)) {
      btn.classList.add("active");
      icon.className = "bx bxs-star";
    } else {
      btn.classList.remove("active");
      icon.className = "bx bx-star";
    }
  });
};

const createBookmarkToggle = (compId) => {
  const btn = document.createElement("button");
  btn.className = "bookmark-toggle";
  btn.dataset.compId = compId;
  btn.setAttribute("aria-label", "Toggle bookmark");
  btn.innerHTML = '<i class="bx bx-star"></i>';
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleBookmark(compId, btn);
  });
  return btn;
};

const initBookmarkButtons = () => {
  document.querySelectorAll("#kompetisi-page .info-card").forEach(card => {
    const seeMoreBtn = card.querySelector(".action-button");
    const onclick = seeMoreBtn?.getAttribute("onclick") || "";
    const match = onclick.match(/'([^']+)'/);
    if (!match) return;
    const compId = match[1];
    card.dataset.compId = compId;
    card.insertBefore(createBookmarkToggle(compId), card.firstChild);
  });
  refreshBookmarkButtons();
};

const renderBookmarksPage = () => {
  if (!els.bookmarksList || !els.bookmarksEmpty) return;
  const bookmarks = getBookmarks();

  els.bookmarksList.innerHTML = "";

  if (bookmarks.length === 0) {
    els.bookmarksEmpty.style.display = "block";
    els.bookmarksList.style.display = "none";
    return;
  }

  els.bookmarksEmpty.style.display = "none";
  els.bookmarksList.style.display = "flex";

  bookmarks.forEach(compId => {
    const sourceCard = document.querySelector(`#kompetisi-page .info-card[data-comp-id="${compId}"]`);
    if (!sourceCard) return;
    const sourceImg = sourceCard.querySelector("img");
    if (!sourceImg) return;

    const card = document.createElement("div");
    card.className = "info-card";
    card.dataset.compId = compId;

    card.appendChild(createBookmarkToggle(compId));

    const h2 = document.createElement("h2");
    const newImg = document.createElement("img");
    newImg.src = sourceImg.getAttribute("src");
    newImg.alt = sourceImg.alt;
    newImg.className = "kompetisi-title-image";
    h2.appendChild(newImg);
    card.appendChild(h2);

    const seeMoreBtn = document.createElement("button");
    seeMoreBtn.className = "action-button sm";
    seeMoreBtn.textContent = "See More";
    seeMoreBtn.addEventListener("click", () => switchPage(compId));
    card.appendChild(seeMoreBtn);

    els.bookmarksList.appendChild(card);
  });

  refreshBookmarkButtons();
};

initBookmarkButtons();


const toggleSidebarBtn = (show) => {
  if (els.openBtn) els.openBtn.style.display = show ? "block" : "none";
};

const closeSidebar = () => {
  els.sidebar?.classList.remove("active");
  toggleSidebarBtn(true);
  els.mainContent?.classList.remove("sidebar-open");
};

toggleSidebarBtn(true);

els.closeBtn?.addEventListener("click", (e) => {
  closeSidebar();
  e.stopPropagation();
});

els.openBtn?.addEventListener("click", (e) => {
  els.sidebar?.classList.add("active");
  toggleSidebarBtn(false);
  els.mainContent?.classList.add("sidebar-open");
  e.stopPropagation();
});

document.addEventListener("click", (e) => {
  if (els.sidebar?.classList.contains("active") && !els.sidebar.contains(e.target) && e.target !== els.openBtn) {
    closeSidebar();
  }
});


window.switchPage = (pageId) => {
  stopAllVideos();
  els.pages.forEach(section => section.classList.remove("active"));
  document.getElementById(pageId)?.classList.add("active");
  if (pageId === "bookmarks-page") {
    renderBookmarksPage();
  }
};

window.goBackFromComp = () => {
  const active = document.querySelector(".page-section.active");
  const compId = active?.id;
  if (compId && isBookmarked(compId)) {
    switchPage("bookmarks-page");
  } else {
    switchPage("kompetisi-page");
  }
};

function stopAllVideos() {
  document.querySelectorAll("video").forEach(v => {
    try {
      v.pause();
      v.currentTime = 0;
    } catch (e) {}
  });
  document.querySelectorAll("iframe").forEach(iframe => {
    const src = iframe.src;
    if (src) {
      iframe.src = "";
      iframe.src = src;
    }
  });
}
