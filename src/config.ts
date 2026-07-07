/**
 * Landing config — single place for founder-editable values.
 * FOUNDER INPUT NEEDED: real WhatsApp Business number before launch (NUT-115).
 */
export const WHATSAPP_NUMBER = "905349761550"; // WhatsApp Business number (set Jul 2026)

export const WHATSAPP_MESSAGE =
  "مرحباً، أرغب بتسجيل طفلي في المخيم الصيفي 🌟";

/** Seats already sold in the early-bird allocation. Updated manually at pilot volumes. */
export const EARLY_BIRD_SOLD = 0;

/** GTM container (founder's — real ID per NUT-144, not a placeholder). */
export const GTM_ID = "GTM-TGFC6FV";

/** First-party events endpoint (NUT-144 layer 2). Empty = beacon disabled. */
export const EVENTS_ENDPOINT = ""; // TODO(founder): set after hosting decision, e.g. https://<domain>/events

/**
 * Camp PUBLIC key (NUT-104 v2): browser encrypts the child's real name with
 * this; only the founder's offline PRIVATE key decrypts. Until configured,
 * registrations send code + nickname ONLY (no name at all — fail-safe).
 * Generate with: node infra/generate-keypair.mjs   (FOUNDER-GATE)
 */
export const CAMP_PUBLIC_KEY_JWK: JsonWebKey | null = null;

export function whatsappLink(
  number: string = WHATSAPP_NUMBER,
  message: string = WHATSAPP_MESSAGE,
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
