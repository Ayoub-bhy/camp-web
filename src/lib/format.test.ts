import { describe, expect, it } from "vitest";
import { toEasternArabic } from "./format";

describe("toEasternArabic", () => {
  it("converts digits", () => {
    expect(toEasternArabic(15)).toBe("١٥");
    expect(toEasternArabic(0)).toBe("٠");
    expect(toEasternArabic(379)).toBe("٣٧٩");
  });
});
