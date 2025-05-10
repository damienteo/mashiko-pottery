export function formatWithCommas(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatYen(value: number): string {
  return new Intl.NumberFormat("ja‑JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  }).format(value);
}
