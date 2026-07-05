/**
 * Landing config — single place for founder-editable values.
 * FOUNDER INPUT NEEDED: real WhatsApp Business number before launch (NUT-115).
 */
export const WHATSAPP_NUMBER = "9665XXXXXXXX"; // TODO(founder): WhatsApp Business number, digits only

export const WHATSAPP_MESSAGE =
  "مرحباً، أرغب بتسجيل طفلي في المخيم الصيفي 🌟";

/** Seats already sold in the early-bird allocation. Updated manually at pilot volumes. */
export const EARLY_BIRD_SOLD = 0;

export function whatsappLink(
  number: string = WHATSAPP_NUMBER,
  message: string = WHATSAPP_MESSAGE,
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
