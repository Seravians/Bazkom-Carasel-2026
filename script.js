// --- Cache DOM Elements ---
const els = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  countdownView: document.getElementById("countdown-view"),
  eventView: document.getElementById("event-view"),
  enterBtn: document.getElementById("enter-site-btn"),
  dashboard: document.getElementById("dashboard-layout"),
  sidebar: document.getElementById("sidebar"),
  mainContent: document.querySelector('.main-content'),
  openBtn: document.getElementById('sidebar-open-btn'),
  closeBtn: document.querySelector("#btn"),
  pages: document.querySelectorAll(".page-section")
};

// --- Countdown Logic ---
// Set exact date and time
const targetDate = new Date("January 11, 2026 12:03:00");

// Convert target date into milliseconds for timer
const eventDate = targetDate.getTime();

const countdownInterval = setInterval(() => {
  const distance = eventDate - Date.now();

  if (distance <= 0) {
    clearInterval(countdownInterval);

    ['days', 'hours', 'minutes', 'seconds'].forEach(id => els[id].textContent = "00");
    els.countdownView.style.display = "none";
    els.eventView.style.display = "flex";

    // requestAnimationFrame ensures the display flex applies before the transition starts
    requestAnimationFrame(() => {
      els.eventView.style.opacity = "1";
      els.eventView.style.transform = "translateY(0)";
    });
    return;
  }

  els.days.textContent = String(Math.floor(distance / 86400000)).padStart(2, "0");
  els.hours.textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0");
  els.minutes.textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0");
  els.seconds.textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, "0");
}, 1000);


// --- View Event Button ---
els.enterBtn?.addEventListener("click", () => {
  els.eventView.style.display = "none";
  els.dashboard.style.display = "flex";
});


// --- Sidebar Logic ---
const toggleSidebarBtn = (show) => {
  if (els.openBtn) els.openBtn.style.display = show ? 'block' : 'none';
};

const closeSidebar = () => {
  els.sidebar?.classList.remove("active");
  toggleSidebarBtn(true);
  if (els.mainContent) els.mainContent.style.filter = "none";
};

toggleSidebarBtn(true);

els.closeBtn?.addEventListener('click', (e) => {
  closeSidebar();
  e.stopPropagation();
});

els.openBtn?.addEventListener('click', (e) => {
  els.sidebar?.classList.add("active");
  toggleSidebarBtn(false);
  if (els.mainContent) els.mainContent.style.filter = "blur(2px)";
  e.stopPropagation();
});

// Close sidebar on outside click
document.addEventListener('click', (e) => {
  if (els.sidebar?.classList.contains('active') && !els.sidebar.contains(e.target) && e.target !== els.openBtn) {
    closeSidebar();
  }
});


// --- Page Switching Logic ---
// We attach this directly to the window so the inline onclick="" in HTML can still find it
window.switchPage = (pageId) => {
  els.pages.forEach(section => section.classList.remove("active"));
  document.getElementById(pageId)?.classList.add("active");
};