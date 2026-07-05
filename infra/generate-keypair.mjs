#!/usr/bin/env node
/**
 * NUT-104 v2 — one-time camp keypair generation (FOUNDER runs this locally).
 *   node infra/generate-keypair.mjs
 * Prints:
 *   1. PUBLIC key JWK  → paste into CAMP_PUBLIC_KEY_JWK in src/config.ts (safe to commit)
 *   2. PRIVATE key JWK → save OFFLINE (password manager). NEVER commit, never share.
 */
const pair = await crypto.subtle.generateKey(
  { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
  true,
  ["encrypt", "decrypt"],
);
const pub = await crypto.subtle.exportKey("jwk", pair.publicKey);
const priv = await crypto.subtle.exportKey("jwk", pair.privateKey);
console.log("== PUBLIC (commit to src/config.ts) ==\n" + JSON.stringify(pub));
console.log("\n== PRIVATE (keep OFFLINE — never commit) ==\n" + JSON.stringify(priv));
