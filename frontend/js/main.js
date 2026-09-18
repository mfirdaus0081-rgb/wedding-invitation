/* ============================================================
   main.js — Core entry point
   ------------------------------------------------------------
   Responsibilities:
   1. Hold wedding data in one place so it can later be swapped
      for an API call (GET /api/wedding) without touching the UI.
   2. Read the ?to= guest name from the URL for personalization.
   3. Navigation: mobile toggle + scroll state.
   4. Reveal-on-scroll via IntersectionObserver.

   Feature-specific scripts (countdown, gallery, music, rsvp,
   wishes) will be added as separate files when those sections
   are built.
   ============================================================ */

"use strict";

/* ---------- 1. Wedding data (single source of truth) ----------
   Today this is a local object. Later, replace this with a
   fetch() to GET /api/wedding and keep the same shape so the
   rest of the code does not change. */
const weddingData = {
  groom: { full: "Ahmad Pratama", short: "Ahmad" },
  bride: { full: "Aisyah Rahmani", short: "Aisyah" },
  date: "2026-12-12",            // ISO format for countdown math
  dateLabel: "12 December 2026",
  location: {
    city: "Bandung, Indonesia",
    venue: "",                   // to be filled later
    mapsUrl: ""                  // to be filled later
  }
};

/* ---------- 2. Guest personalization ----------
   Reads ?to=Guest%20Name from the URL.
   Returns a display label used by the invitation header. */
function getGuestName() {
  const params = new URLSearchParams(window.location.search);
  const to = params.get("to");
  return to ? decodeURIComponent(to).trim() : "";
}

function getGuestLabel() {
  const name = getGuestName();
  return name ? name : "Bapak/Ibu Tamu Undangan";
}

function renderGuestLabel() {
  const el = document.getElementById("guestName");
  if (el) el.textContent = getGuestLabel();
}

/* ---------- 3. Navigation ----------
   Mobile menu toggle + nav background on scroll. */
function initNavigation() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
      links.classList.toggle("nav__links--open", !isOpen);
    });

    links.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        links.classList.remove("nav__links--open");
      });
    });
  }

  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add("nav--scrolled");
      } else {
        nav.classList.remove("nav--scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
}

/* ---------- 4. Reveal-on-scroll ----------
   Uses IntersectionObserver to add .is-visible to .reveal
   elements as they enter the viewport. Safe no-op if the
   observer is unavailable or no elements exist yet. */
function initRevealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ---------- 5. Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderGuestLabel();
  initNavigation();
  initRevealOnScroll();
});

/* Expose for other modules / debugging in this prototype stage */
window.Wedding = {
  data: weddingData,
  getGuestName,
  getGuestLabel,
};
