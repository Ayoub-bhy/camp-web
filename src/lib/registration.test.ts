import { describe, expect, it } from "vitest";
import {
  buildRegistrationMessage,
  normalizePhone,
  validate,
  type Registration,
} from "./registration";

const valid: Registration = {
  childFirstName: "سارة",
  childAge: 8,
  parentName: "محمد",
  parentPhone: "0501234567",
  consent: true,
  mediaOptIn: false,
};

describe("normalizePhone", () => {
  it("accepts KSA formats", () => {
    expect(normalizePhone("0501234567")).toBe("+966501234567");
    expect(normalizePhone("+966 50 123 4567")).toBe("+966501234567");
    expect(normalizePhone("00966501234567")).toBe("+966501234567");
  });
  it("accepts Jordan formats", () => {
    expect(normalizePhone("0791234567")).toBe("+962791234567");
    expect(normalizePhone("+962 79 123 4567")).toBe("+962791234567");
  });
  it("rejects garbage", () => {
    expect(normalizePhone("123")).toBeNull();
    expect(normalizePhone("+1 555 000 1111")).toBeNull();
  });
});

describe("validate", () => {
  it("passes a valid registration", () => {
    expect(validate(valid)).toEqual([]);
  });
  it("enforces age 7-10", () => {
    expect(validate({ ...valid, childAge: 6 })).toContain("childAge");
    expect(validate({ ...valid, childAge: 11 })).toContain("childAge");
  });
  it("requires consent", () => {
    expect(validate({ ...valid, consent: false })).toContain("consent");
  });
  it("requires valid phone", () => {
    expect(validate({ ...valid, parentPhone: "abc" })).toContain("parentPhone");
  });
});

describe("buildRegistrationMessage (v2 — pseudonymized)", () => {
  const id = { code: "CP-AB23-CD45", nickname: "نجم أزرق" };

  it("NEVER contains the child's plaintext name (founder spec Jul 5)", () => {
    const msg = buildRegistrationMessage(valid, id);
    expect(msg).not.toContain("سارة");
    expect(msg).toContain("CP-AB23-CD45");
    expect(msg).toContain("نجم أزرق");
    expect(msg).toContain("+966501234567");
    // exactly 8 lines without encrypted blob — nothing extra can sneak in
    expect(msg.split("\n")).toHaveLength(8);
  });

  it("appends the encrypted blob line when key configured (9 lines)", () => {
    const msg = buildRegistrationMessage(valid, { ...id, encryptedName: "QUJD…" });
    expect(msg.split("\n")).toHaveLength(9);
    expect(msg).toContain("مشفّر");
    expect(msg).not.toContain("سارة");
  });

  it("media opt-in default stays OFF unless explicitly set", () => {
    expect(buildRegistrationMessage({ ...valid, mediaOptIn: true }, id)).toContain(
      "الاستخدام الإعلامي: نعم",
    );
  });
});
