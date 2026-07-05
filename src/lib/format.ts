const EASTERN = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Render a non-negative integer using Eastern Arabic numerals. */
export function toEasternArabic(n: number): string {
  return String(n).replace(/\d/g, (d) => EASTERN[Number(d)]);
}
