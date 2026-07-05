/** Early-bird allocation per charter: 15 seats (379 SAR / 33 JOD). */
export const EARLY_BIRD_TOTAL = 15;

/** Seats remaining in the early-bird allocation, never negative. */
export function earlyBirdSeatsLeft(sold: number): number {
  if (!Number.isFinite(sold) || sold < 0) return EARLY_BIRD_TOTAL;
  return Math.max(0, EARLY_BIRD_TOTAL - Math.floor(sold));
}
