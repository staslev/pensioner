// Israeli tax rules: §9א pension-annuity exemption, progressive income tax, capital gains, and
// nominal-cap real erosion. Figures from research tickets 01/05/13 — several [verify] before shipping.

import type { Assumptions, Money, Rate } from './types';

export const CGT_REAL = 0.25; // capital-gains tax on the REAL gain (research 01)
export const KATZAVA_CEILING_MONTHLY = 9430; // תקרת קצבה מזכה, real ₪ today (research 05)
const CREDIT_POINT_ANNUAL = 2904; // ₪242/mo × 12 (research 05)
const RESIDENT_POINTS = 2.25;

/** §9א exemption rate on the qualifying-pension ceiling, by calendar year (research 05/06). */
export function exemptPct(year: number): number {
  if (year <= 2024) return 0.52;
  if (year === 2025) return 0.57;
  if (year === 2026) return 0.575;
  if (year === 2027) return 0.625;
  return 0.67; // 2028+
}

// Marginal income-tax brackets (annual ₪, 2024/25 base). Personal-exertion; credit points apply.
const BRACKETS: readonly { upTo: number; rate: number }[] = [
  { upTo: 84120, rate: 0.1 },
  { upTo: 120720, rate: 0.14 },
  { upTo: 193800, rate: 0.2 },
  { upTo: 269280, rate: 0.31 },
  { upTo: 560280, rate: 0.35 },
  { upTo: Infinity, rate: 0.47 },
];

/** Frozen nominal caps lose real value over time (no catch-up after a freeze) — ticket 13. */
function erode(nominalToday: number, a: Assumptions, year: number): number {
  const yrs = Math.max(0, year - a.baseYear);
  return nominalToday * Math.pow(1 - a.capErosion, yrs);
}

/** Progressive income tax on taxable ordinary income, net of resident credit points (with cap erosion). */
export function marginalIncomeTax(taxable: number, a: Assumptions, year: number): number {
  if (taxable <= 0) return 0;
  let tax = 0;
  let prev = 0;
  for (const b of BRACKETS) {
    const cap = b.upTo === Infinity ? Infinity : erode(b.upTo, a, year);
    const slice = Math.min(taxable, cap) - prev;
    if (slice > 0) tax += slice * b.rate;
    prev = cap;
    if (taxable <= cap) break;
  }
  const credit = RESIDENT_POINTS * erode(CREDIT_POINT_ANNUAL, a, year);
  return Math.max(0, tax - credit);
}

/** The full §9א annuity-tax derivation for one year (annual real ₪), so callers can surface the
 *  intermediates rather than only the net. `annuityNetAnnual` is this minus the prose. */
export interface AnnuityTax {
  gross: Money; // gross annual annuity
  exemptMonthly: Money; // §9א exempt slice per month (0 before statutory age)
  exempt: Money; // annual exempt slice = exemptMonthly × 12
  taxable: Money; // annual taxable slice = gross − exempt
  tax: Money; // marginal income tax on the taxable slice (net of credit points)
  net: Money; // gross − tax
  exemptionActive: boolean; // §9א age gate: only from statutory age (a 60–66 annuity is fully taxable)
  ceilingMonthly: Money; // eroded קצבה מזכה ceiling in force that year
  exemptRate: Rate; // exemptPct(year) applied (0 when the gate is closed)
}

/**
 * Full §9א annuity-tax breakdown for one year. The exempt slice (exemptPct × min(monthly, ceiling))
 * applies only from statutory age; a 60–66 early annuity is fully taxable. The ceiling erodes (ticket 13).
 * This is the single source of the arithmetic; `annuityNetAnnual` returns just `.net`.
 */
export function annuityTaxBreakdown(grossAnnual: number, exemptionActive: boolean, a: Assumptions, year: number): AnnuityTax {
  const grossMonthly = grossAnnual / 12;
  const ceiling = erode(KATZAVA_CEILING_MONTHLY, a, year);
  const rate = exemptPct(year);
  const exemptMonthly = exemptionActive ? rate * Math.min(grossMonthly, ceiling) : 0;
  const exempt = exemptMonthly * 12;
  const taxable = Math.max(0, grossAnnual - exempt);
  const tax = marginalIncomeTax(taxable, a, year);
  return {
    gross: grossAnnual, exemptMonthly, exempt, taxable, tax, net: grossAnnual - tax,
    exemptionActive, ceilingMonthly: ceiling, exemptRate: exemptionActive ? rate : 0,
  };
}

/**
 * Net (after-tax) annual pension annuity — thin wrapper over `annuityTaxBreakdown` (same arithmetic).
 */
export function annuityNetAnnual(grossAnnual: number, exemptionActive: boolean, a: Assumptions, year: number): number {
  return annuityTaxBreakdown(grossAnnual, exemptionActive, a, year).net;
}
