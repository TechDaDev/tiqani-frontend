export function formatMoney(amount: string | number | null | undefined, currency = "IQD", locale = "en") {
  const numeric = Number(amount ?? 0);
  const safe = Number.isFinite(numeric) ? numeric : 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IQD" ? 0 : 2,
  }).format(safe);
}

export function formatDateTime(value: string | null | undefined, locale = "en") {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function formatStatus(value: string) {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export function maskReference(value: string) {
  if (!value) return "";
  if (value.includes("...") || value.includes("*")) return value;
  if (value.length <= 8) return "****";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}
