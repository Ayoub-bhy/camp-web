// Landing page v1 (NUT-103) + funnel tracking (NUT-144). HARD CAP scope only.
import { EARLY_BIRD_SOLD } from "./config";
import { toEasternArabic } from "./lib/format";
import { earlyBirdSeatsLeft } from "./lib/seats";
import { track } from "./lib/track";

// All CTAs → first-party /go/wa redirect (NUT-144: Lead logged, then wa.me).
document.querySelectorAll<HTMLAnchorElement>("a[data-wa]").forEach((a) => {
  const src = a.dataset.src ?? "landing";
  a.href = `${import.meta.env.BASE_URL}go/wa/?src=${encodeURIComponent(src)}`;
});

// Early-bird seats-left counter (trust asset, counters R12).
const seatsEl = document.querySelector<HTMLElement>("#seats-left");
if (seatsEl) {
  seatsEl.textContent = toEasternArabic(earlyBirdSeatsLeft(EARLY_BIRD_SOLD));
}

// ViewContent when pricing / teachers sections become visible (fires once each).
const seen = new Set<string>();
const observer = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      const section = (e.target as HTMLElement).dataset.track;
      if (e.isIntersecting && section && !seen.has(section)) {
        seen.add(section);
        track("ViewContent", { section });
        observer.unobserve(e.target);
      }
    }
  },
  { threshold: 0.4 },
);
document.querySelector(".pricing")?.setAttribute("data-track", "pricing");
document.querySelector(".teachers")?.setAttribute("data-track", "teachers");
document.querySelectorAll("[data-track]").forEach((el) => observer.observe(el));

// Salla redesign: subtle scroll-reveal (progressive enhancement; no-JS shows all).
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefersReduced && "IntersectionObserver" in window) {
  const revealEls = document.querySelectorAll<HTMLElement>(
    ".card, .program li, .guarantee, section > h2",
  );
  revealEls.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(26px)";
    el.style.transition =
      "opacity .6s cubic-bezier(0.175,0.885,0.32,1.275), transform .6s cubic-bezier(0.175,0.885,0.32,1.275)";
  });
  const revealObs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        revealObs.unobserve(el);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  revealEls.forEach((el) => revealObs.observe(el));
}
