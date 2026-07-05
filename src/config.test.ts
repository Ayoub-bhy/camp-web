import { describe, expect, it } from "vitest";
import { whatsappLink } from "./config";

describe("whatsappLink", () => {
  it("builds a wa.me URL with encoded Arabic message", () => {
    const url = whatsappLink("966500000000", "مرحباً");
    expect(url.startsWith("https://wa.me/966500000000?text=")).toBe(true);
    expect(url).not.toContain("مرحباً"); // must be percent-encoded
    expect(decodeURIComponent(url.split("text=")[1])).toBe("مرحباً");
  });
});
