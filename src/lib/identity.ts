/**
 * Child identity pseudonymization (NUT-104 v2, founder spec Jul 5).
 * - Child code: random, unambiguous, the ONLY child identifier in logs/analytics.
 * - Camp nickname: deterministic from the code, doubles as in-session display name.
 * - Real first name: RSA-OAEP encrypted with the camp PUBLIC key in the browser;
 *   decryptable only by the founder's offline private key (parent-facing context).
 *   Plaintext never appears in messages, rosters, logs, or analytics.
 */

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L

export function generateChildCode(): string {
  const buf = new Uint8Array(8);
  crypto.getRandomValues(buf);
  let s = "";
  for (const b of buf) s += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return `CP-${s.slice(0, 4)}-${s.slice(4)}`;
}

// Curated, kid-positive, gender-neutral Arabic nicknames: trait × star/nature.
const NICK_A = ["أزرق", "ذهبي", "فضي", "سريع", "لامع", "شجاع", "مرح", "حكيم"];
const NICK_B = ["نجم", "قمر", "صقر", "دلفين", "شهاب", "غيمة", "لؤلؤ", "نسر"];

/** Deterministic nickname from the child code (stable across devices/re-renders). */
export function pickNickname(code: string): string {
  let h = 0;
  for (const ch of code) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const b = NICK_B[h % NICK_B.length];
  const a = NICK_A[Math.floor(h / NICK_B.length) % NICK_A.length];
  return `${b} ${a}`;
}

export function isNickname(s: string): boolean {
  const [b, a] = s.split(" ");
  return NICK_B.includes(b) && NICK_A.includes(a);
}

/** Encrypt the child's real first name with the camp public key (JWK, RSA-OAEP-256). */
export async function encryptChildName(
  name: string,
  publicKeyJwk: JsonWebKey,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "jwk",
    publicKeyJwk,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  );
  const ct = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    key,
    new TextEncoder().encode(name.trim()),
  );
  let bin = "";
  for (const b of new Uint8Array(ct)) bin += String.fromCharCode(b);
  return btoa(bin);
}
