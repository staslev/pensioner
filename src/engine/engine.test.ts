import { describe, it, expect } from 'vitest';
import { project, earliestFeasibleAge, gapToRetireNow, bestPath, explainYear } from './engine';
import { DEFAULTS, DEFAULT_CHILD_TOTAL } from './defaults';
import type { Scenario } from './types';

function scenario(over: Partial<Scenario> = {}): Scenario {
  return {
    person: { currentAge: 45, sex: 'male', birthYear: 1981, grossMonthlySalary: 25000 },
    buckets: { liquid: 1_500_000, kerenHishtalmut: 500_000, pension: 1_200_000 },
    monthlyExpense: 16000,
    monthlyRent: 0,
    monthlySaving: 5000,
    children: [],
    childTotal: DEFAULT_CHILD_TOTAL,
    assumptions: { ...DEFAULTS, crashEvery: 0 }, // crashes off for deterministic base tests
    pensionPath: 'wait67',
    ...over,
  };
}

describe('project', () => {
  it('a very wealthy scenario is feasible at the current age', () => {
    const s = scenario({ buckets: { liquid: 20_000_000, kerenHishtalmut: 1_000_000, pension: 2_000_000 } });
    expect(project(s, s.person.currentAge).feasible).toBe(true);
  });

  it('a poor scenario with high spend is not feasible at the current age', () => {
    const s = scenario({ buckets: { liquid: 100_000, kerenHishtalmut: 0, pension: 0 }, monthlyExpense: 30000, monthlySaving: 0 });
    expect(project(s, s.person.currentAge).feasible).toBe(false);
  });

  it('feasibility is monotone in the retirement age (retiring later is never worse)', () => {
    const s = scenario();
    let sawFeasible = false;
    for (let age = s.person.currentAge; age <= 67; age++) {
      const f = project(s, age).feasible;
      if (sawFeasible) expect(f).toBe(true); // once feasible, stays feasible
      if (f) sawFeasible = true;
    }
  });

  it('produces funding bars only for retirement years, each summing to that year\'s expense', () => {
    const s = scenario();
    const p = project(s, 60);
    expect(p.bars.length).toBeGreaterThan(0);
    expect(p.bars[0].age).toBe(60);
    for (const b of p.bars) {
      const funded = b.fromBI + b.fromPension + b.fromPortfolio + b.shortfall;
      expect(funded).toBeCloseTo(b.expense, 0);
    }
  });
});

describe('children (temporary expense)', () => {
  it('adding a child never improves feasibility (raises or keeps the earliest age)', () => {
    const base = scenario();
    const withKid = scenario({ children: [{ currentAge: 0 }] });
    const e0 = earliestFeasibleAge(base) ?? 999;
    const e1 = earliestFeasibleAge(withKid) ?? 999;
    expect(e1).toBeGreaterThanOrEqual(e0);
  });

  it('the child expense drops off after age 18 (bars taller during child years)', () => {
    const s = scenario({ children: [{ currentAge: 0 }], monthlyExpense: 16000 });
    const p = project(s, 50);
    const childYearBar = p.bars.find((b) => b.age === 55); // child age 10 → still a dependent
    const laterBar = p.bars.find((b) => b.age === 70); // child age 25 → independent
    expect(childYearBar!.expense).toBeGreaterThan(laterBar!.expense);
  });
});

describe('market crashes', () => {
  it('enabling periodic crashes never improves feasibility', () => {
    const noCrash = scenario({ assumptions: { ...DEFAULTS, crashEvery: 0 } });
    const withCrash = scenario({ assumptions: { ...DEFAULTS, crashEvery: 5, crashPct: 0.4 } });
    const e0 = earliestFeasibleAge(noCrash) ?? 999;
    const e1 = earliestFeasibleAge(withCrash) ?? 999;
    expect(e1).toBeGreaterThanOrEqual(e0);
  });
});

describe('solve modes', () => {
  it('gapToRetireNow is 0 when already feasible now, positive otherwise', () => {
    const rich = scenario({ buckets: { liquid: 20_000_000, kerenHishtalmut: 0, pension: 0 } });
    expect(gapToRetireNow(rich).lumpSumToday).toBe(0);

    const poor = scenario({ buckets: { liquid: 200_000, kerenHishtalmut: 0, pension: 0 }, monthlyExpense: 25000, monthlySaving: 0 });
    expect(gapToRetireNow(poor).lumpSumToday).toBeGreaterThan(0);
  });

  it('bestPath returns one of the three valid paths', () => {
    expect(['wait67', 'annuitize60', 'commute60']).toContain(bestPath(scenario()));
  });
});

describe('tax fidelity', () => {
  it('higher nominal-cap erosion never improves feasibility (tax-free pension slice shrinks)', () => {
    const low = scenario({ assumptions: { ...DEFAULTS, crashEvery: 0, capErosion: 0 } });
    const high = scenario({ assumptions: { ...DEFAULTS, crashEvery: 0, capErosion: 0.03 } });
    expect((earliestFeasibleAge(high) ?? 999)).toBeGreaterThanOrEqual(earliestFeasibleAge(low) ?? 999);
  });

  it('a larger unrealized-gain fraction (more CGT) never improves feasibility', () => {
    const low = scenario({ assumptions: { ...DEFAULTS, crashEvery: 0, liquidGainFraction: 0.1 } });
    const high = scenario({ assumptions: { ...DEFAULTS, crashEvery: 0, liquidGainFraction: 0.9 } });
    expect((earliestFeasibleAge(high) ?? 999)).toBeGreaterThanOrEqual(earliestFeasibleAge(low) ?? 999);
  });

  it('the pension annuity is taxed (funding from pension is a positive net figure)', () => {
    const s = scenario({ buckets: { liquid: 500_000, kerenHishtalmut: 0, pension: 5_000_000 }, monthlyExpense: 30000 });
    const bar = project(s, 67).bars.find((b) => b.age === 70);
    expect(bar!.fromPension).toBeGreaterThan(0);
  });
});

describe('sequence risk & expense growth', () => {
  it('crash-at-retirement stress never improves feasibility', () => {
    const off = scenario({ assumptions: { ...DEFAULTS, crashEvery: 0, crashAtRetirement: false } });
    const on = scenario({ assumptions: { ...DEFAULTS, crashEvery: 0, crashAtRetirement: true, crashPct: 0.35 } });
    expect((earliestFeasibleAge(on) ?? 999)).toBeGreaterThanOrEqual(earliestFeasibleAge(off) ?? 999);
  });

  it('positive real expense growth never improves feasibility', () => {
    const flat = scenario({ assumptions: { ...DEFAULTS, crashEvery: 0, realExpenseGrowth: 0 } });
    const grow = scenario({ assumptions: { ...DEFAULTS, crashEvery: 0, realExpenseGrowth: 0.02 } });
    expect((earliestFeasibleAge(grow) ?? 999)).toBeGreaterThanOrEqual(earliestFeasibleAge(flat) ?? 999);
  });

  it('faster rent growth raises later-year expense and never improves feasibility', () => {
    const base = { ...DEFAULTS, crashEvery: 0, realExpenseGrowth: 0 };
    const slowRent = scenario({ monthlyRent: 6000, assumptions: { ...base, rentRealGrowth: 0 } });
    const fastRent = scenario({ monthlyRent: 6000, assumptions: { ...base, rentRealGrowth: 0.03 } });
    // A later retirement year: rent has compounded, so the fast-rent expense must exceed the flat one.
    const slowBar = project(slowRent, 60).bars.find((b) => b.age === 80)!;
    const fastBar = project(fastRent, 60).bars.find((b) => b.age === 80)!;
    expect(fastBar.expense).toBeGreaterThan(slowBar.expense);
    expect((earliestFeasibleAge(fastRent) ?? 999)).toBeGreaterThanOrEqual(earliestFeasibleAge(slowRent) ?? 999);
  });

  it('with rent = 0 the rent-growth knob has no effect (owner case)', () => {
    const a = scenario({ monthlyRent: 0, assumptions: { ...DEFAULTS, crashEvery: 0, rentRealGrowth: 0 } });
    const b = scenario({ monthlyRent: 0, assumptions: { ...DEFAULTS, crashEvery: 0, rentRealGrowth: 0.05 } });
    expect(project(b, 60).bars[0].expense).toBeCloseTo(project(a, 60).bars[0].expense, 6);
  });
});

describe('year explanations (ticket 02)', () => {
  it('emits one explanation per bar, aligned by age, and only exposes intermediates (numbers unchanged)', () => {
    const s = scenario({ children: [{ currentAge: 2 }], monthlyRent: 6000 });
    const p = project(s, 55);
    expect(p.explanations.length).toBe(p.bars.length);
    for (let i = 0; i < p.bars.length; i++) {
      const bar = p.bars[i];
      const ex = p.explanations[i];
      expect(ex.age).toBe(bar.age);
      // funding rows are the SAME capped amounts as the bar — this only surfaces, never re-derives.
      const byKind = (k: string) => ex.funding.rows.filter((r) => r.kind === k).reduce((sum, r) => sum + r.net, 0);
      expect(byKind('bituachLeumi')).toBeCloseTo(bar.fromBI, 6);
      expect(byKind('pension')).toBeCloseTo(bar.fromPension, 6);
      expect(byKind('liquid') + byKind('keren')).toBeCloseTo(bar.fromPortfolio, 6);
      expect(ex.shortfall).toBeCloseTo(bar.shortfall, 6);
    }
  });

  it('expense rows sum to the expense total, funding rows + shortfall reconstruct it', () => {
    const s = scenario({ children: [{ currentAge: 0 }, { currentAge: 5 }], monthlyRent: 5000 });
    const p = project(s, 58);
    for (const ex of p.explanations) {
      const expSum = ex.expense.rows.reduce((sum, r) => sum + r.amount, 0);
      expect(expSum).toBeCloseTo(ex.expense.total, 4);
      expect(ex.funding.total + ex.shortfall).toBeCloseTo(ex.expense.total, 4);
      const fundSum = ex.funding.rows.reduce((sum, r) => sum + r.net, 0);
      expect(fundSum).toBeCloseTo(ex.funding.total, 4);
    }
  });

  it('each tax line reconciles (net = gross − tax; rate = tax / gross) and the total sums the lines', () => {
    const s = scenario({ buckets: { liquid: 500_000, kerenHishtalmut: 0, pension: 5_000_000 }, monthlyExpense: 30000 });
    const p = project(s, 67);
    for (const ex of p.explanations) {
      let lineSum = 0;
      for (const l of ex.tax.lines) {
        expect(l.rate).toBeCloseTo(l.gross > 0 ? l.tax / l.gross : 0, 6);
        expect(l.base).toBeCloseTo(l.gross - l.exempt, 4);
        lineSum += l.tax;
      }
      expect(ex.tax.total).toBeCloseTo(lineSum, 4);
    }
    // a taxed annuity year carries a marginal line whose net (gross − tax) matches the funding pension row.
    const annuityYear = p.explanations.find((e) => e.phase === 'fullAnnuity' && e.tax.lines.some((l) => l.kind === 'marginal'))!;
    const marginal = annuityYear.tax.lines.find((l) => l.kind === 'marginal')!;
    const penRow = annuityYear.funding.rows.find((r) => r.kind === 'pension');
    if (penRow?.gross !== undefined) expect(penRow.net).toBeCloseTo(penRow.gross - marginal.tax, 4);
  });

  it('the §9א gate: a 60–66 early annuity is fully taxable (exempt 0); from statutory age the exemption bites', () => {
    const s = scenario({ pensionPath: 'annuitize60', buckets: { liquid: 400_000, kerenHishtalmut: 0, pension: 6_000_000 }, monthlyExpense: 28000 });
    const early = explainYear(s, 55, 63)!; // annuitized at 60, before statutory 67
    expect(early.phase).toBe('earlyAnnuity');
    const earlyMarginal = early.tax.lines.find((l) => l.kind === 'marginal')!;
    expect(earlyMarginal.exempt).toBe(0); // gate closed → nothing exempt
    const full = explainYear(s, 55, 70)!; // past statutory age
    expect(full.phase).toBe('fullAnnuity');
    const fullMarginal = full.tax.lines.find((l) => l.kind === 'marginal')!;
    expect(fullMarginal.exempt).toBeGreaterThan(0); // §9א exemption now applies
  });

  it('flags the untracked recognized-pension slice on annuity years, and the commute60 proxy on that path', () => {
    const s = scenario({ buckets: { liquid: 500_000, kerenHishtalmut: 0, pension: 5_000_000 }, monthlyExpense: 30000 });
    const annuityYear = explainYear(s, 67, 70)!;
    expect(annuityYear.caveats).toContain('NO_RECOGNIZED_PENSION_SLICE');

    const commute = scenario({ pensionPath: 'commute60', buckets: { liquid: 500_000, kerenHishtalmut: 0, pension: 6_000_000 }, monthlyExpense: 28000 });
    const commuteYear = explainYear(commute, 55, 65)!;
    expect(commuteYear.caveats).toContain('COMMUTE60_PROXY');
  });

  it('explainYear returns null for a non-retirement (accumulation) age', () => {
    const s = scenario();
    expect(explainYear(s, 60, 50)).toBeNull(); // 50 < fireAge 60 → still accumulating
    expect(explainYear(s, 60, 65)).not.toBeNull();
  });
});
