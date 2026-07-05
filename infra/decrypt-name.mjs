#!/usr/bin/env node
/**
 * NUT-104 v2 — decrypt a child's name blob (FOUNDER only, parent-facing context).
 *   node infra/decrypt-name.mjs '<private-key-jwk-json>' '<base64-blob>'
 * Run locally/offline. Never paste the private key anywhere else.
 */
const [, , privJson, blob] = process.argv;
if (!privJson || !blob) {
  console.error("usage: node infra/decrypt-name.mjs '<private-jwk>' '<blob>'");
  process.exit(1);
}
const key = await crypto.subtle.importKey(
  "jwk", JSON.parse(privJson), { name: "RSA-OAEP", hash: "SHA-256" }, false, ["decrypt"],
);
const pt = await crypto.subtle.decrypt(
  { name: "RSA-OAEP" }, key, Uint8Array.from(atob(blob), (c) => c.charCodeAt(0)),
);
console.log(new TextDecoder().decode(pt));
