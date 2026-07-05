/**
 * NUT-144 layer 2 — first-party events endpoint + /go/wa server redirect.
 * Deploy: Cloudflare Worker (free tier) + D1 database bound as `DB`.
 * FOUNDER-GATE: needs a Cloudflare account; zero cost at pilot volume.
 *
 * Routes:
 *   POST /events        — store a funnel event (beacon from the site)
 *   GET  /go/wa?src=... — log Lead server-side, 302 to wa.me (works with JS off)
 *
 * PRIVACY (§4): stores ONLY event name, event_id, src, page, timestamp.
 * No IP, no user agent, no cookies, no user data. Parents are the audience.
 */

const WHATSAPP_NUMBER = "9665XXXXXXXX"; // TODO(founder): real number (NUT-115)
const WHATSAPP_TEXT = encodeURIComponent("مرحباً، أرغب بتسجيل طفلي في المخيم الصيفي 🌟");
const ALLOWED_EVENTS = new Set([
  "PageView", "ViewContent", "Lead", "InitiateCheckout", "CompleteRegistration", "Purchase",
]);

const clean = (v, re, fallback) => (typeof v === "string" && re.test(v) ? v : fallback);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/go/wa") {
      const src = clean(url.searchParams.get("src"), /^[a-z0-9_-]{1,32}$/, "direct");
      const eventId = crypto.randomUUID();
      await env.DB.prepare(
        "INSERT INTO events (event_id, event, src, page, ts) VALUES (?1, 'Lead', ?2, '/go/wa', ?3)",
      ).bind(eventId, src, Date.now()).run();
      return Response.redirect(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`, 302);
    }

    if (url.pathname === "/events" && request.method === "POST") {
      let body;
      try { body = await request.json(); } catch { return new Response("bad json", { status: 400 }); }
      const event = ALLOWED_EVENTS.has(body.event) ? body.event : null;
      if (!event) return new Response("bad event", { status: 400 });
      await env.DB.prepare(
        "INSERT OR IGNORE INTO events (event_id, event, src, page, value, currency, ts) VALUES (?1,?2,?3,?4,?5,?6,?7)",
      ).bind(
        clean(body.event_id, /^[\w-]{8,64}$/, crypto.randomUUID()),
        event,
        clean(body.src, /^[a-z0-9_-]{1,32}$/, null),
        clean(body.page, /^[\w/\-]{1,64}$/, null),
        typeof body.value === "number" ? body.value : null,
        clean(body.currency, /^(SAR|JOD)$/, null),
        Date.now(),
      ).run();
      return new Response("ok", { status: 201 });
    }

    return new Response("not found", { status: 404 });
  },
};
