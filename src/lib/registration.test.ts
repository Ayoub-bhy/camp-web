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

describe("buildRegistrationMessage", () => {
  it("contains only the capped fields + consent flags", () => {
    const msg = buildRegistrationMessage(valid);
    expect(msg).toContain("سارة");
    expect(msg).toContain("+966501234567");
    expect(msg).toContain("الاستخدام الإعلامي: لا");
    // exactly 7 lines — nothing extra can sneak in
    expect(msg.split("\n")).toHaveLength(7);
  });
  it("media opt-in default stays OFF unless explicitly set", () => {
    expect(buildRegistrationMessage({ ...valid, mediaOptIn: true })).toContain(
      "الاستخدام الإعلامي: نعم",
    );
  });
});
