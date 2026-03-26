const eventDate = new Date().getTime() + 5000;

const countdownInterval = setInterval(() => {
  const now = new Date().getTime();
  const distance = eventDate - now;

  if (distance < 0) {
    clearInterval(countdownInterval);
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    document.getElementById("countdown-view").style.display = "none";
    document.getElementById("event-view").style.display = "flex";
  } else {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
  }
}, 1000);

// View Event button
document.getElementById("enter-site-btn")?.addEventListener("click", () => {
  document.getElementById("event-view").style.display = "none";
  document.getElementById("dashboard-layout").style.display = "flex";
});

// Switch page function
function switchPage(pageId) {
  document.querySelectorAll(".page-section").forEach(section => {
    section.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");
}

// Toggle about menu
function toggleAboutMenu() {
  document.getElementById("about-dropdown").classList.toggle("show");
  const arrow = document.getElementById("about-arrow");
  if (arrow) {
    arrow.style.transform = document.getElementById("about-dropdown").classList.contains("show") 
      ? "rotate(180deg)" 
      : "rotate(0deg)";
  }
}