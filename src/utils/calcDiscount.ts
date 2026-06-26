/**
 * Calculate discount percentage.
 * Mirrors backend formula: round((originalPrice - price) / originalPrice * 100)
 */
export function calcDiscount(price: number, originalPrice: number | null | undefined): number {
  if (!originalPrice || originalPrice <= 0 || price >= originalPrice) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
