// Deterministic Pensioner projection engine. Pure functions, no I/O, no UI.
// Yearly steps, real terms (today's ₪). See assets/02-engine-spec.md.
// Tax fidelity: §9א annuity exemption/ceiling + progressive marginal tax, real (basis-aware) capital-gains
// tax on liquid draws, and nominal-cap real erosion (src/engine/tax.ts). Still simplified: the four היוון
// commutation paths (spec §7, ticket 05) — commute60 uses a rough exempt-lump proxy — see TODO.

import type {
  Scenario, PensionPath, Projection, YearState, FundingBar, Age, Money,
  YearExplanation, ExpenseRow, FundingRow, TaxLine, PhaseKind, Simplification,
} from './types';
import { statutoryAge, childCurveWeight, PENSION_CONTRIB_RATE, COEFFICIENT_CAP } from './defaults';
import { annuityTaxBreakdown, CGT_REAL } from './tax';

const PATHS: readonly PensionPath[] = ['wait67', 'annuitize60', 'commute60'];

/** Non-guaranteed coefficient drifts up with longevity, capped (research 09). */
function effectiveCoefficient(s: Scenario, annuitizeAge: Age): number {
  const { coefficient, coefficientDrift } = s.assumptions;
  const years = Math.max(0, annuitizeAge - s.person.currentAge);
  return Math.min(coefficient * Math.pow(1 + coefficientDrift, years), Math.max(COEFFICIENT_CAP, coefficient));
}

/** Total child expense (annual, real) at a given parent age, summed over children via the age curve. */
function childAnnual(s: Scenario, parentAge: Age): Money {
  return s.children.reduce((sum, c) => {
    const childAge = c.currentAge + (parentAge - s.person.currentAge);
    return sum + childCurveWeight(childAge) * s.childTotal;
  }, 0);
}

/** Market-crash multiplier applied to market-exposed balances this year (ticket 12). */
function crashFactor(s: Scenario, age: Age): number {
  const { crashEvery, crashPct } = s.assumptions;
  const yearsIn = age - s.person.currentAge;
  return crashEvery > 0 && yearsIn > 0 && yearsIn % crashEvery === 0 ? 1 - crashPct : 1;
}

/**
 * Project a scenario assuming retirement at `fireAge`. Yearly loop:
 * accumulation (now → fireAge) then staged decumulation (bridge → pension annuity → +Bituach Leumi).
 */
export function project(s: Scenario, fireAge: Age): Projection {
  const a = s.assumptions;
  const r = a.realReturn;
  const statAge = statutoryAge(s.person);
  const annuitizeAge = s.pensionPath === 'wait67' ? statAge : 60;
  const coeff = effectiveCoefficient(s, annuitizeAge);
  const baseExpense = s.monthlyExpense * 12;
  const biAnnual = a.biMonthly * 12;
  const contrib = s.person.grossMonthlySalary * 12 * PENSION_CONTRIB_RATE;
  const savingAnnual = s.monthlySaving * 12;
  // sequence-risk stress: on top of periodic crashes, optionally force one the year retirement starts (ticket 12).
  const marketCrash = (yr: Age) => crashFactor(s, yr) * (a.crashAtRetirement && yr === fireAge ? 1 - a.crashPct : 1);

  let liquid = s.buckets.liquid;
  let liquidBasis = s.buckets.liquid * (1 - a.liquidGainFraction); // real cost basis (for CGT on the gain slice)
  let keren = s.buckets.kerenHishtalmut;
  let pension = s.buckets.pension;
  let grossAnnuity = 0;
  let feasible = true;
  let firstShortfallAge: Age | null = null;

  const path: YearState[] = [];
  const bars: FundingBar[] = [];
  const explanations: YearExplanation[] = [];
  let age = s.person.currentAge;

  // --- Accumulation: still working, contributing, compounding ---
  for (; age < fireAge; age++) {
    const cf = marketCrash(age);
    liquid *= cf; keren *= cf; pension *= cf;
    path.push({ age, netLiquid: liquid + keren });
    liquid = liquid * (1 + r) + savingAnnual;
    liquidBasis += savingAnnual; // savings are after-tax principal → add to basis
    keren = keren * (1 + r);
    pension = pension * (1 + r) + contrib;
  }

  // --- Staged decumulation: no salary; income floors switch on over time ---
  for (; age <= a.planningAge; age++) {
    const year = a.baseYear + (age - s.person.currentAge);
    const cf = marketCrash(age);
    liquid *= cf; keren *= cf;

    if (age < annuitizeAge) {
      pension = pension * (1 + r); // still a market balance
    } else {
      if (age === annuitizeAge) {
        if (s.pensionPath === 'commute60') {
          // Rough proxy: ~30% commuted to (mostly tax-free) cash. TODO: exact four היוון paths +
          // minimum-pension floor (spec §7, ticket 05) — recognized-pension 15%, exempt basket, פריסה.
          const lump = pension * 0.3;
          liquid += lump * 0.95;
          liquidBasis += lump * 0.95;
          pension -= lump;
        }
        grossAnnuity = (pension / coeff) * 12;
      }
      pension = Math.max(0, pension - grossAnnuity); // pot spent down as it pays
    }

    // Income floors this year (NET of tax). Bituach Leumi is tax-free; the annuity is taxed via §9א.
    const fromBIAvail = age >= statAge ? biAnnual : 0;
    const grossPen = age >= annuitizeAge ? grossAnnuity : 0;
    // Full §9א breakdown (exempt/taxable/tax), so the explanation can surface it — not just the net.
    const annuityTax = grossPen > 0 ? annuityTaxBreakdown(grossPen, age >= statAge, a, year) : null;
    const netPension = annuityTax ? annuityTax.net : 0;
    // Rent grows at its own (usually higher) real rate; the non-rent remainder at realExpenseGrowth (ticket 18).
    const t = age - s.person.currentAge;
    const rentAnnual = Math.min(s.monthlyRent, s.monthlyExpense) * 12;
    const otherAnnual = baseExpense - rentAnnual;
    const grownRent = rentAnnual * Math.pow(1 + a.rentRealGrowth, t);
    const grownBase = otherAnnual * Math.pow(1 + a.realExpenseGrowth, t);
    const childrenAmt = childAnnual(s, age);
    const expense = grownRent + grownBase + childrenAmt;

    // Fund the expense bottom→top: Bituach Leumi → pension → portfolio (liquid w/ real CGT, then tax-free keren).
    let remaining = expense;
    const fromBI = Math.min(fromBIAvail, remaining); remaining -= fromBI;
    const fromPension = Math.min(netPension, remaining); remaining -= fromPension;
    let fromPortfolio = 0;
    // Portfolio-draw intermediates, surfaced for the CGT tax line (0 when no draw happens this year).
    let cgtGross = 0; // liquid drawn, gross
    let cgtGain = 0; // real gain slice of that draw
    let cgtTax = 0; // real CGT paid
    let netFromLiquid = 0; // net taken from the taxable-liquid bucket
    let useKeren = 0; // net taken from the tax-free keren bucket
    if (remaining > 0) {
      const gainFrac = liquid > 0 ? Math.max(0, (liquid - liquidBasis) / liquid) : 0;
      const netPerGross = 1 - gainFrac * CGT_REAL; // real CGT on the gain slice of each ₪ withdrawn
      const grossNeeded = netPerGross > 0 ? remaining / netPerGross : remaining;
      const take = Math.min(liquid, grossNeeded);
      netFromLiquid = take * netPerGross;
      cgtGross = take;
      cgtGain = take * gainFrac;
      cgtTax = cgtGain * CGT_REAL;
      liquid -= take;
      liquidBasis = Math.max(0, liquidBasis - take * (1 - gainFrac));
      fromPortfolio += netFromLiquid; remaining -= netFromLiquid;
      useKeren = Math.min(keren, remaining); // keren hishtalmut is tax-free
      keren -= useKeren; fromPortfolio += useKeren; remaining -= useKeren;
    }
    const shortfall = Math.max(0, remaining);
    if (shortfall > 0.01 && feasible) { feasible = false; firstShortfallAge = age; }

    const surplus = fromBIAvail + netPension - expense; // net floors beyond expense → reinvest as principal
    if (surplus > 0) { liquid += surplus; liquidBasis += surplus; }

    liquid = Math.max(liquid, 0) * (1 + r);
    keren = Math.max(keren, 0) * (1 + r);
    bars.push({ age, fromBI, fromPension, fromPortfolio, shortfall, expense });

    // --- Year explanation (ticket 02): surface the intermediates above; NO arithmetic changes. ---
    // Staged phase: bridge (no annuity) → earlyAnnuity (60..statutory, §9א gate closed) → fullAnnuity.
    const phase: PhaseKind = age < annuitizeAge ? 'bridge' : age < statAge ? 'earlyAnnuity' : 'fullAnnuity';

    const expenseRows: ExpenseRow[] = [];
    if (grownBase > 0) expenseRows.push({ kind: 'base', amount: grownBase });
    if (grownRent > 0) expenseRows.push({ kind: 'rent', amount: grownRent });
    if (childrenAmt > 0) expenseRows.push({ kind: 'children', amount: childrenAmt });

    const fundingRows: FundingRow[] = [];
    if (fromBI > 0) fundingRows.push({ kind: 'bituachLeumi', net: fromBI });
    if (fromPension > 0) {
      const row: FundingRow = { kind: 'pension', net: fromPension };
      // gross is meaningful only when the whole net annuity funded expense (uncapped): then net = gross − tax.
      // When the annuity over-funds (surplus reinvested), fromPension is capped below net → omit gross, note it.
      if (annuityTax && Math.abs(fromPension - annuityTax.net) < 1e-6) row.gross = annuityTax.gross;
      else row.note = { key: 'note.annuityOverfunds' };
      if (s.pensionPath === 'commute60') row.flag = 'COMMUTE60_PROXY'; // 30%-lump proxy taints the annuity
      fundingRows.push(row);
    }
    if (netFromLiquid > 0) fundingRows.push({ kind: 'liquid', net: netFromLiquid, gross: cgtGross });
    if (useKeren > 0) fundingRows.push({ kind: 'keren', net: useKeren });

    const taxLines: TaxLine[] = [];
    if (annuityTax) {
      const line: TaxLine = {
        kind: 'marginal',
        gross: annuityTax.gross,
        exempt: annuityTax.exempt,
        base: annuityTax.taxable,
        tax: annuityTax.tax,
        rate: annuityTax.gross > 0 ? annuityTax.tax / annuityTax.gross : 0,
        flag: 'NO_RECOGNIZED_PENSION_SLICE', // whole pot treated as qualifying — no קצבה מוכרת slice tracked
      };
      // §9א gate closed 60..statutory: annuity fully taxable, so the net looks smaller than "at 67 rates".
      if (phase === 'earlyAnnuity') line.note = { key: 'note.exemptGateEarly' };
      taxLines.push(line);
    }
    if (cgtGross > 0) {
      taxLines.push({
        kind: 'cgt',
        gross: cgtGross,
        exempt: 0,
        base: cgtGain,
        tax: cgtTax,
        rate: cgtGross > 0 ? cgtTax / cgtGross : 0,
      });
    }

    const caveats: Simplification[] = [];
    for (const row of [...fundingRows, ...taxLines]) {
      if (row.flag && !caveats.includes(row.flag)) caveats.push(row.flag);
    }

    explanations.push({
      age,
      phase,
      pensionPath: s.pensionPath,
      expense: { rows: expenseRows, total: expense },
      funding: { rows: fundingRows, total: fromBI + fromPension + fromPortfolio }, // = expense − shortfall
      tax: { lines: taxLines, total: (annuityTax?.tax ?? 0) + cgtTax },
      shortfall,
      caveats,
    });
    path.push({ age, netLiquid: liquid + keren });
  }

  const endNetWorth = path.length ? path[path.length - 1].netLiquid : 0;
  const bequestOk = endNetWorth >= a.bequestTarget;
  const peakAnnualExpense = bars.reduce((m, b) => Math.max(m, b.expense), baseExpense);
  return { feasible: feasible && bequestOk, firstShortfallAge, path, bars, peakAnnualExpense, explanations };
}

/**
 * Look up one retirement year's explanation. Runs project() once and returns that year's
 * YearExplanation (or null if `age` isn't a retirement year). A thin lookup — no re-derivation:
 * the path-dependent intermediates are produced inside project()'s decumulation loop (ticket 02).
 */
export function explainYear(s: Scenario, fireAge: Age, age: Age): YearExplanation | null {
  return project(s, fireAge).explanations.find((e) => e.age === age) ?? null;
}

/** Earliest age at which retirement is feasible (the hero). Feasibility is monotone in fireAge. */
export function earliestFeasibleAge(s: Scenario, maxAge: Age = statutoryAge(s.person)): Age | null {
  for (let age = s.person.currentAge; age <= maxAge; age++) {
    if (project(s, age).feasible) return age;
  }
  return null;
}

/** "How much more to retire NOW" — extra lump sum today (bisection). 0 if already feasible. */
export function gapToRetireNow(s: Scenario): { lumpSumToday: Money } {
  if (project(s, s.person.currentAge).feasible) return { lumpSumToday: 0 };
  let lo = 0;
  let hi = 20_000_000;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const withLump: Scenario = { ...s, buckets: { ...s.buckets, liquid: s.buckets.liquid + mid } };
    if (project(withLump, s.person.currentAge).feasible) hi = mid; else lo = mid;
  }
  return { lumpSumToday: hi };
}

/** The pension decumulation path that allows the earliest retirement. */
export function bestPath(s: Scenario): PensionPath {
  let best: PensionPath = s.pensionPath;
  let bestAge = Infinity;
  for (const p of PATHS) {
    const e = earliestFeasibleAge({ ...s, pensionPath: p });
    const age = e ?? 999;
    if (age < bestAge) { bestAge = age; best = p; }
  }
  return best;
}
