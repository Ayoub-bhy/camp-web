import { describe, expect, it } from "vitest";
import { EARLY_BIRD_TOTAL, earlyBirdSeatsLeft } from "./seats";

describe("earlyBirdSeatsLeft", () => {
  it("starts at the full allocation", () => {
    expect(earlyBirdSeatsLeft(0)).toBe(EARLY_BIRD_TOTAL);
  });

  it("decrements per sale", () => {
    expect(earlyBirdSeatsLeft(5)).toBe(10);
  });

  it("never goes negative", () => {
    expect(earlyBirdSeatsLeft(99)).toBe(0);
  });

  it("tolerates bad input", () => {
    expect(earlyBirdSeatsLeft(-3)).toBe(EARLY_BIRD_TOTAL);
    expect(earlyBirdSeatsLeft(Number.NaN)).toBe(EARLY_BIRD_TOTAL);
  });
});
