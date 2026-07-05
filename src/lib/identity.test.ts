import { describe, expect, it } from "vitest";
import {
  encryptChildName,
  generateChildCode,
  isNickname,
  pickNickname,
} from "./identity";

describe("generateChildCode", () => {
  it("matches CP-XXXX-XXXX with unambiguous alphabet", () => {
    for (let i = 0; i < 20; i++) {
      expect(generateChildCode()).toMatch(/^CP-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$/);
    }
  });
});

describe("pickNickname", () => {
  it("is deterministic per code and from the curated list", () => {
    const code = "CP-AB23-CD45";
    expect(pickNickname(code)).toBe(pickNickname(code));
    expect(isNickname(pickNickname(code))).toBe(true);
    expect(isNickname(pickNickname(generateChildCode()))).toBe(true);
  });
});

describe("encryptChildName — decryptable only with the private key", () => {
  it("round-trips with the private key and never contains plaintext", async () => {
    const pair = await crypto.subtle.generateKey(
      { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
      true,
      ["encrypt", "decrypt"],
    );
    const jwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
    const blob = await encryptChildName("سارة", jwk);

    expect(blob).not.toContain("سارة");
    expect(blob.length).toBeGreaterThan(300); // 2048-bit RSA ct in base64

    const pt = await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      pair.privateKey,
      Uint8Array.from(atob(blob), (c) => c.charCodeAt(0)),
    );
    expect(new TextDecoder().decode(pt)).toBe("سارة");
  });

  it("produces different ciphertexts for the same name (OAEP randomness)", async () => {
    const pair = await crypto.subtle.generateKey(
      { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
      true,
      ["encrypt", "decrypt"],
    );
    const jwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
    expect(await encryptChildName("سارة", jwk)).not.toBe(await encryptChildName("سارة", jwk));
  });
});
