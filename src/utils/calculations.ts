export const money = (value: number) => `€${value.toFixed(2)}`;
export function amount(value: string): number | null {
  const cleaned = value.trim().replace(',', '.');
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) {
    return null;
  }
  const number = Number(cleaned);
  return Number.isFinite(number) && number <= 10000000 ? number : null;
}
export function splitBill(total: number, guests: number) {
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / guests);
  return Array.from(
    { length: guests },
    (_, i) => (base + (i < cents % guests ? 1 : 0)) / 100,
  );
}
export const tipAmount = (total: number, percent: number) =>
  Math.round(total * percent) / 100;
export const dateLabel = (date: string | Date) =>
  new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
export const timeLabel = (date: string | Date) =>
  new Date(date).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
export const uid = () =>
  `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`.toUpperCase();
export const overlaps = (a: string, b: string) =>
  Math.abs(new Date(a).getTime() - new Date(b).getTime()) < 2 * 60 * 60 * 1000;
