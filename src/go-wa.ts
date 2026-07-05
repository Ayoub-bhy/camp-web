/**
 * /go/wa — first-party WhatsApp redirect (NUT-144).
 * Logs the Lead (GTM dataLayer + first-party beacon) then redirects to wa.me.
 * Works on any static host; survives ad-blockers for the first-party log
 * because the beacon goes to OUR endpoint, not a pixel domain.
 *
 * PRIVACY: only { event, event_id, src, page } is ever sent. No user data.
 */
import { EVENTS_ENDPOINT, whatsappLink } from "./config";
import { sanitizeSrc, track } from "./lib/track";

const src = sanitizeSrc(new URLSearchParams(location.search).get("src"));
const target = whatsappLink();

// 1. GTM/pixels (container fires Lead/Contact on this dataLayer event)
const ev = track("Lead", { src });

// 2. First-party event log (source of truth for KPIs) — no-op until endpoint configured
if (EVENTS_ENDPOINT) {
  try {
    navigator.sendBeacon(
      EVENTS_ENDPOINT,
      JSON.stringify({ ...ev, page: "/go/wa" }),
    );
  } catch {
    /* logging must never block the parent */
  }
}

// 3. Redirect (short delay lets GTM/beacon flush)
const manual = document.querySelector<HTMLAnchorElement>("#manual");
if (manual) manual.href = target;
setTimeout(() => location.replace(target), 400);
