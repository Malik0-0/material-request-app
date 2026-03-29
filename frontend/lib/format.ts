export function formatPrice(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '-';
  const n = typeof value === 'string' ? Number(value) : value;
  return Number.isNaN(n) ? String(value) : String(n);
}
