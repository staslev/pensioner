// Sourced Israeli defaults & rules. Figures ~2024–2026 from research tickets 01/05/06/09/11/13.
// Several are flagged [verify] in those tickets — confirm against primary .gov.il sources before shipping.

import type { Assumptions, Person, Age, Rate } from './types';

export const PENSION_CONTRIB_RATE = 0.185; // mandatory pension: 6% ee + 12.5% er (research 01)
export const CGT_REAL = 0.25; // capital-gains tax on the REAL gain (research 01)

/** Coefficient plausibility cap for the longevity-drift model (research 09). */
export const COEFFICIENT_CAP = 240;

export const DEFAULTS: Assumptions = {
  realReturn: 0.07, // ~5–7% equity (research 01)
  inflation: 0.025, // BoI target 1–3%; reference only — not used by the real-terms projection (see capErosion)
  salaryGrowthReal: 0.01,
  planningAge: 92,
  bequestTarget: 0,
  coefficient: 200, // non-guaranteed, ~at age 67 (research 01/06)
  coefficientDrift: 0.004, // ~0.4%/yr longevity drift, capped (research 09)
  biMonthly: 1838, // single old-age allowance, 2026 (research 01)
  crashPct: 0.35,
  crashEvery: 7, // default crash frequency (ticket 12); 0 disables
  baseYear: 2026,
  capErosion: 0.01, // ~1%/yr long-run real erosion of frozen caps (research 13); range 0→full-inflation
  liquidGainFraction: 0.4, // assumed gain share of taxable liquid (for real CGT)
  crashAtRetirement: false, // sequence-risk stress toggle (ticket 12)
  realExpenseGrowth: 0, // flat-real non-rent expense by default (ticket 15)
  rentRealGrowth: 0.015, // rent typically outpaces general inflation (~1.5% real); only bites when rent > 0 (ticket 18)
};

/** Default shared total cost of raising one child to 18, real ₪ (research 11: ~₪1.1–1.3M typical). */
export const DEFAULT_CHILD_TOTAL = 1_200_000;

/**
 * Statutory retirement age (גיל פרישה) — when Bituach Leumi old-age allowance and the
 * UNREDUCED pension annuity begin. Men 67; women rising 62→65 by cohort, 65 for born ≥1970.
 * TODO(research 01): exact women's cohort table; this is a simplified step.
 */
export function statutoryAge(p: Person): Age {
  if (p.sex === 'male') return 67;
  return p.birthYear >= 1970 ? 65 : 64;
}

/**
 * Per-year share of a child's total 0–18 cost, following the age-cost curve
 * (daycare 0–3 and teens 12–18 heaviest; primary lightest). Sums to ~100% over 0–17. (research 11)
 */
export function childCurveWeight(childAge: number): Rate {
  if (childAge < 0 || childAge >= 18) return 0;
  if (childAge < 3) return 0.07;
  if (childAge < 6) return 0.06;
  if (childAge < 12) return 0.05;
  return 0.052;
}
