export const fmt = (n: number) => '₪' + Math.round(n).toLocaleString('en-US');

/** The monthly equivalent of an annual figure, e.g. "₪13,000/ח׳" — shown as a mini sub-line. */
export const fmtMo = (n: number) => fmt(n / 12) + '/ח׳';

export function fmtK(n: number): string {
  n = Math.round(n);
  const a = Math.abs(n);
  if (a >= 1e6) return '₪' + (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (a >= 1e3) return '₪' + Math.round(n / 1000).toLocaleString('en-US') + 'K';
  return '₪' + n.toLocaleString('en-US');
}
