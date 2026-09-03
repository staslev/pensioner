// Domain types for the deterministic Pensioner engine. All money is REAL ₪ (today's shekels).
// See .wayfinder/pensioner/assets/02-engine-spec.md and ../../CONTEXT.md.

export type Money = number; // real ₪ (today's shekels)
export type Rate = number; // decimal, e.g. 0.04
export type Age = number; // integer years

/** Pension decumulation strategy (see engine spec §ScopeDirective). */
export type PensionPath = 'wait67' | 'annuitize60' | 'commute60';

export interface Child {
  /** current age of the child, in years */
  currentAge: number;
}

export interface Assumptions {
  realReturn: Rate; // trend real return on market-exposed balances
  inflation: Rate; // reference only — the projection is fully real-terms; frozen-cap erosion uses capErosion, not this
  salaryGrowthReal: Rate;
  planningAge: Age; // solvency horizon
  bequestTarget: Money; // real ₪ that must remain at planningAge
  coefficient: number; // annuity conversion factor (balance ÷ coefficient = monthly)
  coefficientDrift: Rate; // per-year real drift of the (non-guaranteed) coefficient (ticket 09)
  biMonthly: Money; // Bituach Leumi old-age allowance, monthly
  crashPct: Rate; // market-crash size (ticket 12); crashEvery 0 = off
  crashEvery: number; // crash frequency in years
  baseYear: number; // calendar year of "today" — for §9א tax schedule & nominal-cap erosion
  capErosion: Rate; // real erosion/yr of frozen nominal caps (קצבה מזכה ceiling, brackets) — ticket 13
  liquidGainFraction: Rate; // assumed unrealized-gain share of the taxable-liquid bucket (for real CGT)
  crashAtRetirement: boolean; // sequence-risk stress: force a crash the year retirement starts (ticket 12)
  realExpenseGrowth: Rate; // real drift of the NON-rent portion of the base expense — ticket 15
  rentRealGrowth: Rate; // real drift of the rent portion (typically > realExpenseGrowth) — ticket 18
}

export interface Person {
  currentAge: Age;
  sex: 'male' | 'female';
  birthYear: number; // for statutory retirement age
  grossMonthlySalary: Money;
}

export interface Buckets {
  liquid: Money; // taxable liquid (brokerage / ETF / cash)
  kerenHishtalmut: Money; // tax-free after seniority (assumed met)
  pension: Money; // pension pot (accumulating), today's value
}

export interface Scenario {
  person: Person;
  buckets: Buckets;
  monthlyExpense: Money; // BASE monthly expense (real), rent INCLUDED
  monthlyRent: Money; // rent portion of monthlyExpense (real); grows at rentRealGrowth. 0 for owners — ticket 18
  monthlySaving: Money; // discretionary saving during accumulation → liquid
  children: Child[];
  childTotal: Money; // shared total-to-18 cost per child (amortized over an age curve)
  assumptions: Assumptions;
  pensionPath: PensionPath;
}

export interface YearState {
  age: Age;
  netLiquid: Money; // drawable portfolio (liquid + keren) — the stock
}

/** One retirement year's expense funding breakdown (annual ₪). */
export interface FundingBar {
  age: Age;
  fromBI: Money; // Bituach Leumi old-age allowance
  fromPension: Money; // pension annuity
  fromPortfolio: Money; // drawdown from liquid + keren
  shortfall: Money; // uncovered (infeasibility signal)
  expense: Money; // that year's total expense (base + children)
}

export interface Projection {
  feasible: boolean;
  firstShortfallAge: Age | null;
  path: YearState[]; // net-liquid trajectory across the whole timeline
  bars: FundingBar[]; // funding breakdown, retirement years only
  peakAnnualExpense: Money; // for chart scaling
  explanations: YearExplanation[]; // per-retirement-year explanation, same index as `bars` (ticket 02)
}

// ─── Year-explanation contract (ticket 01) ──────────────────────────────────
// The typed contract the engine emits (ticket 02 populates) and the pinned
// panel renders (ticket 05). See .wayfinder/pensioner/year-explainer/. Faithful to
// the current model (option b): it surfaces the intermediates project() already
// computes and *flags* where the model simplifies, rather than faking precision.

/** A key into the UI's Hebrew content registry. The engine emits keys for closed,
 *  reused content (concept blurbs, caveat text, row labels) and never prose;
 *  the UI resolves keys → Hebrew. Hebrew-only v1, but keyed for i18n-readiness. */
export type ContentKey = string;

/** A plain-language note on a row: a `key` into the content registry (closed,
 *  reused content) or an inline `text` one-off (year-specific incidentals). */
export type Note = { key: ContentKey } | { text: string };

/** A named model simplification a row is subject to. Only simplifications that
 *  make a *shown number* misleading are flags; broader model limitations
 *  (no מס יסף, no minimum-pension floor, no פריסה/161ד, no explicit early-
 *  annuitization reduction factor, commutation not reducing the monthly
 *  exemption) live as static model documentation, not per-line flags. */
export type Simplification =
  | 'COMMUTE60_PROXY' // commute60's 30%-lump / 95%-net proxy — fires only on the commute60 path
  | 'NO_RECOGNIZED_PENSION_SLICE'; // whole pot treated as qualifying → overstates 60–66 tax for a real קצבה מוכרת slice

/** Fields shared by every explanation row. `label` normally derives from the
 *  row's `kind` via keyed content; this optional override is for rare custom rows. */
export interface RowBase {
  label?: Note; // override — default label derives from `kind`
  note?: Note; // short plain-language note
  flag?: Simplification; // marks the row as subject to a named simplification
}

export type ExpenseKind = 'base' | 'rent' | 'children';

/** One expense line (annual real ₪): grown non-rent base, grown rent, or the children curve. */
export interface ExpenseRow extends RowBase {
  kind: ExpenseKind;
  amount: Money;
}

export type FundingKind = 'bituachLeumi' | 'pension' | 'liquid' | 'keren';

/** One funding source line, NET of tax (annual real ₪). `gross` is present where
 *  the source is taxed (pension, liquid); the tax detail lives in the matching
 *  TaxLine, joined by kind (pension ↔ marginal, liquid ↔ cgt). The UI may merge
 *  the liquid + keren rows into one "portfolio" row for display. */
export interface FundingRow extends RowBase {
  kind: FundingKind;
  net: Money;
  gross?: Money;
}

export type TaxKind = 'marginal' | 'cgt';

/** One taxed source's derivation — its scalar fields ARE the formula. For the
 *  annuity (`marginal`), `exempt` is the §9א slice and `base` the taxable slice;
 *  for the portfolio draw (`cgt`), `exempt` is 0 and `base` the real gain slice.
 *  `rate` is effective (tax / gross). Label, base-label and color derive from `kind`. */
export interface TaxLine extends RowBase {
  kind: TaxKind;
  gross: Money; // taxed source, gross
  exempt: Money; // §9א exempt slice (0 for CGT)
  base: Money; // taxable base
  tax: Money; // tax paid
  rate: Rate; // effective: tax / gross
}

/** Which staged phase a retirement year sits in — derived from age vs the
 *  annuitization age and statutory age. The UI maps it to a Hebrew label. */
export type PhaseKind = 'bridge' | 'earlyAnnuity' | 'fullAnnuity';

/** One retirement year's full explanation — expenses, funding (net of tax), and
 *  the tax derivation across all taxed sources. Produced by project() during its
 *  path-dependent loop (ticket 02) and rendered by the pinned panel (ticket 05). */
export interface YearExplanation {
  age: Age;
  phase: PhaseKind;
  pensionPath: PensionPath; // echoed for the "path" descriptor line
  expense: { rows: ExpenseRow[]; total: Money };
  funding: { rows: FundingRow[]; total: Money }; // net, after tax
  tax: { lines: TaxLine[]; total: Money };
  shortfall: Money; // infeasibility residual — not a funding source
  caveats: Simplification[]; // derived: the flags that fired this year
}

/** Look up one retirement year's explanation. Runs project() once and returns
 *  that year's YearExplanation, or null if `age` is not a retirement year.
 *  Implemented in ticket 02 (needs project's path-dependent internals). */
export type ExplainYear = (s: Scenario, fireAge: Age, age: Age) => YearExplanation | null;
