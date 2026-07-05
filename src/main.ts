// camp-web entry point. Landing page v1 lands here (NUT-103).
// HARD CAP scope: landing + registration/consent + checkout + parent-lite. Nothing else.
import { earlyBirdSeatsLeft } from "./lib/seats";

const el = document.querySelector<HTMLElement>("#app");
if (el) {
  el.dataset.earlyBirdSeats = String(earlyBirdSeatsLeft(0));
}
