// Landing page v1 (NUT-103). HARD CAP scope only.
import { EARLY_BIRD_SOLD, whatsappLink } from "./config";
import { toEasternArabic } from "./lib/format";
import { earlyBirdSeatsLeft } from "./lib/seats";

// All CTAs → WhatsApp (GTM rule: every CTA goes to WhatsApp).
document.querySelectorAll<HTMLAnchorElement>("a[data-wa]").forEach((a) => {
  a.href = whatsappLink();
  a.target = "_blank";
  a.rel = "noopener";
});

// Early-bird seats-left counter (trust asset, counters R12).
const seatsEl = document.querySelector<HTMLElement>("#seats-left");
if (seatsEl) {
  seatsEl.textContent = toEasternArabic(earlyBirdSeatsLeft(EARLY_BIRD_SOLD));
}
