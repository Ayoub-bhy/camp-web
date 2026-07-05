# Tracking stack — layer 1 (NUT-144)

## What's in code (ENG)

- **GTM container `GTM-TGFC6FV`** (founder's, real ID) on landing + registration. All pixels/tags live in GTM — never in code.
- **Standard events** pushed to `dataLayer` via `src/lib/track.ts`, each with `event_id` (dedup with NUT-145 server-side sends):

| Event | Fires |
| -- | -- |
| PageView | GTM built-in, every page |
| ViewContent | pricing / teachers section 40% visible (`section` param) |
| Lead | `/go/wa` first-party redirect page |
| InitiateCheckout | first interaction with registration form |
| CompleteRegistration | valid consented submit |
| Purchase | payment confirmation (wire when rails exist — NUT-105/92) |

- **`/go/wa?src=<tag>`**: every WhatsApp CTA targets our domain first → Lead logged (dataLayer + first-party beacon) → redirect to wa.me. Static-host version in `go/wa/`; server version (logs even with JS off) in `infra/cloudflare-worker-go-wa.js`.
- **First-party events table**: `infra/events-schema.sql` (+ `/events` beacon endpoint in the worker). `EVENTS_ENDPOINT` in `src/config.ts` stays empty until deployed.

## Privacy guardrails (§4 — enforced by tests)

`buildEvent()` whitelist-filters payload keys (`src, section, market, value, currency` only) — child data or form values physically cannot enter an event; the events table schema has no PII columns, no IP/UA. Registration WhatsApp handoff deliberately bypasses `/go/wa` so its message (child data) never touches our log.

## GTM container setup (GROWTH — after ad accounts exist)

For each platform, add in GTM (workspace → tags): Meta Pixel (ID `PIXEL_META_PLACEHOLDER`), TikTok (`PIXEL_TIKTOK_PLACEHOLDER`), Snap (`PIXEL_SNAP_PLACEHOLDER`), GA4 (`G-XXXXXXX_PLACEHOLDER`). Trigger each on the 6 custom events above (dataLayer event name = platform event name; pass `event_id` for dedup). Replace placeholders as accounts land post-NUT-133.

## Verification checklist (DoD)

1. GTM Preview: 6 events visible with `event_id`.
2. Each platform's event test tool shows the 6 events (screenshots to NUT-144).
3. `/go/wa` with uBlock ON: redirect works, first-party log row written.
4. SEC payload check: confirm no PII keys in dataLayer pushes.
