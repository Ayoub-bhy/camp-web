/**
 * First-party funnel tracking (NUT-144, layer 1).
 * All events go through GTM's dataLayer; tags (Meta/TikTok/Snap/GA4) are
 * managed inside container GTM-TGFC6FV, never in code.
 *
 * PRIVACY GUARDRAIL (checklist §4): payloads are whitelist-filtered — no
 * child data, no form values, no free text can ever enter an event.
 */

export type FunnelEvent =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "InitiateCheckout"
  | "CompleteRegistration"
  | "Purchase";

/** The ONLY keys allowed in any event payload. */
const ALLOWED_KEYS = new Set(["src", "section", "market", "value", "currency"]);

export interface TrackedEvent {
  event: FunnelEvent;
  event_id: string;
  [k: string]: string | number;
}

export function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `ev-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Build a dedup-ready event, silently dropping any non-whitelisted key. */
export function buildEvent(
  name: FunnelEvent,
  params: Record<string, string | number> = {},
  eventId: string = newEventId(),
): TrackedEvent {
  const out: TrackedEvent = { event: name, event_id: eventId };
  for (const [k, v] of Object.entries(params)) {
    if (ALLOWED_KEYS.has(k)) out[k] = v;
  }
  return out;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(name: FunnelEvent, params: Record<string, string | number> = {}): TrackedEvent {
  const ev = buildEvent(name, params);
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(ev);
  return ev;
}

/** Sanitize a traffic-source tag from the URL (?src=ig_ad1). */
export function sanitizeSrc(raw: string | null): string {
  const s = (raw ?? "").toLowerCase();
  return /^[a-z0-9_-]{1,32}$/.test(s) ? s : "direct";
}
