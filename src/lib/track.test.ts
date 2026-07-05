import { describe, expect, it } from "vitest";
import { buildEvent, sanitizeSrc } from "./track";

describe("buildEvent — privacy guardrail", () => {
  it("strips ALL non-whitelisted keys (no PII can enter an event)", () => {
    const ev = buildEvent("CompleteRegistration", {
      src: "landing_hero",
      childFirstName: "سارة", // must be dropped
      parentPhone: "0501234567", // must be dropped
      note: "free text", // must be dropped
    } as unknown as Record<string, string>);
    expect(Object.keys(ev).sort()).toEqual(["event", "event_id", "src"]);
  });

  it("keeps whitelisted commerce keys and generates event_id for dedup", () => {
    const ev = buildEvent("Purchase", { value: 379, currency: "SAR" });
    expect(ev.value).toBe(379);
    expect(ev.currency).toBe("SAR");
    expect(String(ev.event_id).length).toBeGreaterThan(8);
  });
});

describe("sanitizeSrc", () => {
  it("accepts clean tags, rejects injection/garbage", () => {
    expect(sanitizeSrc("ig_ad1")).toBe("ig_ad1");
    expect(sanitizeSrc("IG_AD1")).toBe("ig_ad1");
    expect(sanitizeSrc('"><script>')).toBe("direct");
    expect(sanitizeSrc(null)).toBe("direct");
    expect(sanitizeSrc("x".repeat(40))).toBe("direct");
  });
});
