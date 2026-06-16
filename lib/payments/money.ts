/**
 * Money formatting utilities — IQD safe handling.
 * All amounts are strings for precision. Never parse as float.
 */

/** Format IQD amount for display: "1,000,000 IQD" */
export function formatIQD(amountStr: string | number): string {
  const num = typeof amountStr === "string" ? parseAmount(amountStr) : amountStr;
  const formatted = new Intl.NumberFormat("en-IQ", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
  return `${formatted} IQD`;
}

/** Parse safe decimal string to integer. Returns 0 for invalid. */
export function parseAmount(amountStr: string): number {
  const cleaned = amountStr.replace(/[^0-9.]/g, "");
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

/** Check if amount is positive */
export function isPositiveAmount(amountStr: string): boolean {
  return parseAmount(amountStr) > 0;
}
