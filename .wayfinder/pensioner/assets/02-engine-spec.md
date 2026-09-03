# Pensioner — Deterministic Projection Engine Spec

Build-ready spec for the pure calculation core. No UI, no I/O, no persistence — a set of pure TypeScript functions, unit-testable in isolation. All decisions here trace to the map's standing preferences and research tickets 01/05/06.

## 1. Principles

- **Deterministic**, **yearly** steps, **real terms** (today's ₪) throughout. No Monte Carlo.
- **One engine, always the full model.** Core vs Power is progressive disclosure of *inputs*, not a second computation. Advanced inputs default to values that collapse the full model to the simple case (no commutation, ₪0 prior severance, plain non-guaranteed pension, all-ILS, all-qualifying). The 25% real CGT and §9א annuity exemption are always applied.
- **Person abstraction:** the engine operates on `1..N` persons. Core supplies one; couple support is a downstream ticket.
- **Separation:** engine core has zero dependency on React/DOM.

## 2. Data model (inputs)

```ts
type Money = number;   // real ₪ (today's shekels)
type Rate  = number;   // decimal, e.g. 0.04
type Age   = number;   // integer years

type BucketKind = 'liquidTaxable' | 'kerenHishtalmut' | 'gemel' | 'pension' | 'realEstate';

interface LiquidTaxable { kind:'liquidTaxable'; value:Money; costBasis?:Money; foreign?:boolean; }
interface KerenHishtalmut { kind:'kerenHishtalmut'; value:Money; seniorityMet:boolean; }
interface Gemel { kind:'gemel'; value:Money; costBasis?:Money; annuitizeAt60?:boolean; }  // default annuitizeAt60=false
interface PensionHolding {
  kind:'pension';
  subtype:'kerenPensia' | 'bituachMenahalim';   // Core: kerenPensia
  balance:Money;
  recognizedFraction?:Rate;        // קצבה מוכרת share; default 0
  // ביטוח מנהלים knobs (Power); undefined ⇒ plain non-guaranteed fund
  guaranteedCoefficient?:number;   // if set, use it; else non-guaranteed default
  track?:'annuity' | 'capital';    // 'capital' = pre-2008 grandfathered lump sum; default 'annuity'
  feeBalance?:Rate; feeDeposit?:Rate;
}
interface RealEstate { kind:'realEstate'; equity?:Money; netMonthlyRent:Money; } // deep model → ticket 07
type Bucket = LiquidTaxable | KerenHishtalmut | Gemel | PensionHolding | RealEstate;

interface Person {
  currentAge:Age; sex:'male'|'female'; birthYear:number;
  // fireAge is NOT an input — it is solved as the earliest feasible age (§10). project() takes it as a parameter.
  grossAnnualSalary:Money;         // 0 if already retired
  yearsContributedNI?:number;      // Bituach Leumi seniority; default estimated from age
  buckets:Bucket[];
}

interface PensionStrategy {
  mode:'waitStatutory' | 'earlyAnnuitize60' | 'partialCommute';  // Core default: waitStatutory
  commuteAmount?:Money;            // for partialCommute
  commuteSlice?:'exempt'|'recognized'|'taxable';  // Power
}

interface Assumptions {
  realReturn:Rate;                 // default 0.04 (Core single global)
  bucketRealReturns?:Partial<Record<BucketKind,Rate>>;   // Power per-bucket
  inflation:Rate;                  // default 0.025 (nominal-threshold / NI drift only)
  salaryGrowthReal:Rate;           // default 0.01
  planningAge:Age;                 // default 92
  bequestTarget:Money;             // default 0
  fees?:Partial<Record<BucketKind,{balance:Rate;deposit:Rate}>>;  // Power; else folded into realReturn
}

interface Scenario {
  persons:Person[];                // Core: length 1
  discretionarySavings?:Money;     // annual, during accumulation, routed by savingsRouting
  savingsRouting?:Partial<Record<BucketKind,Rate>>;  // fractions; default 100% liquidTaxable
  retirementAnnualExpenses:Money;  // real; the BASE expense. default = current expenses
  currentAnnualExpenses?:Money;    // during accumulation
  children?:{ currentAge:number; total:Money }[];  // ticket 10: total (default ₪1.2M) amortized 0–18 over an age-cost curve
  //   per-year weights 0–3:7% 3–6:6% 6–12:5% 12–18:5.2% (daycare & teen peaks). expense(age)=base+Σ active child layers → bars vary. Post-18 (uni/army) = optional tail.
  assumptions:Assumptions;
  pensionStrategy:PensionStrategy;
}
```

## 3. Assumptions & defaults (all Power-editable)

| Param | Default | Source / note |
|---|---|---|
| realReturn | **4%** | research 01 (general ~3–4%, equity ~5–7%); net-of-fees in Core |
| inflation | **2.5%** | BoI 1–3% target; used only for nominal-threshold & NI drift |
| salaryGrowthReal | **1%** | modest real growth |
| planningAge | **92** | map standing preference |
| bequestTarget | **₪0** | full spend-down allowed |
| pension coefficient (non-guaranteed) | **200** | research 01/06 |
| CGT | **25% on real gain** | research 01 |
| keren hishtalmut | **tax-free if seniorityMet** | research 01 |
| Bituach Leumi (single) | **₪1,838/mo** | research 01 (2026) |
| contributions | **18.5%** of salary → pension | research 01 |
| §9א exemption % | **57.5% (2026)** → 62.5% (2027) → 67% (2028+) | research 05 |
| קצבה מזכה ceiling | **₪9,430/mo** | research 05 |
| min-pension floor (היוון) | **~₪5,306/mo (2026)** | research 05 [verify] |
| ביטוח מנהלים fees | **0.8% balance + 2% deposits** | research 06 |

## 4. Timeline & phases

Iterate yearly from `min(currentAge)` to `planningAge`. Each person has:
- **Accumulation** (`age < fireAge`): salary grows at `salaryGrowthReal`; mandatory **18.5% → pension**; `discretionarySavings` routed per `savingsRouting`; every bucket grows at its net real return.
- **Staged decumulation** (`age ≥ fireAge`): no salary. Annual `need = retirementAnnualExpenses − netActiveFloors − netRentalIncome`. If `need > 0`, draw from liquid buckets in the drawdown order, grossing up for tax. Income floors switch on in stages:
  - **~60:** gemel annuitization (if chosen); pension annuity **if** strategy `earlyAnnuitize60` (reduced; **taxable at marginal rates 60–66**, only the recognized slice tax-free); a pre-2008 **capital-track** ביטוח מנהלים pays out as a **liquid tax-free lump sum** into `liquidTaxable`.
  - **statutory age** (men 67; women 62→65 by `birthYear`): Bituach Leumi old-age allowance begins; pension annuity begins **unreduced** if strategy `waitStatutory`; §9א exemption now applies.

## 5. Per-bucket rules

| Bucket | Accumulation | Tax on drawdown | Liquidity |
|---|---|---|---|
| liquidTaxable | grows at net real return | 25% × real gain (gain = value−costBasis, real-adjusted; foreign ⇒ FX-measured) | anytime |
| kerenHishtalmut | grows | 0 if `seniorityMet` else 25% real | anytime (post-seniority) |
| gemel | grows | lump-sum: 25% real gain; **or** tax-free annuity from 60 if `annuitizeAt60` | anytime |
| pension | +18.5% salary; grows net of fees | via annuity/commutation model (§6, §7) | **illiquid until 60** |
| realEstate | equity static (Core); `netMonthlyRent` as income | rent per default track (Core: net figure as given) | illiquid unless sold (→ ticket 07) |

## 6. Income floors

- **Coefficient longevity drift (Power):** for non-guaranteed savers the coefficient set at retirement is higher than today's (longevity). Model `coeff_ret = coeff_today × (1+drift)^(annuitizeAge − currentAge)`, default **drift 0.4%/yr** (Power range 0.2–0.8), capped ~230–240 and floored near today's value. Guaranteed (pre-2013 ביטוח מנהלים) coefficients skip the drift. NB: the coefficient also embeds an interest-rate assumption (a separate, dominant, unforecastable mover) — surface a sensitivity band, not a point estimate. See research ticket 09.
- **Pension annuity** = `balance ÷ coefficient`, monthly (coefficient per the drift rule above). `coefficient` = `guaranteedCoefficient` if set (research 06: pre-2001 ~145–166 = real edge; 2001–2012 ~200 = none), else non-guaranteed default (200). Start age: 60 (`earlyAnnuitize60`) or statutory (`waitStatutory`). Net of §9א tax (§7).
- **Recognized-pension slice** (`recognizedFraction`): tax-free monthly from 60.
- **Bituach Leumi** = base(single/couple) × (1 + min(0.02 × yearsContributedNI, 0.5)); starts at statutory age; pre-70 income test on *work* income only (Power).
- **Gemel annuity** (if `annuitizeAt60`): tax-free monthly from 60.

## 7. Tax model

- **CGT:** 25% on the **real** gain. Real gain = nominal gain deflated by cumulative inflation over the (assumed) holding period; `foreign` holdings measured in foreign currency (FX untaxed). Core default: treat provided gain as already-real if no basis/holding given.
- **Credit points do NOT offset CGT** — never applied to investment income.
- **Pension annuity §9א:** exempt monthly = `exemptPct(year) × min(annuity, ceiling)`; remainder taxed at marginal brackets (passive floor 31% for the taxable pension portion is *not* applied — annuity is personal-exertion; use §121 with credit points). Exemption applies only from statutory age.
- **Commutation (היוון), Power:** four paths (research 05):
  1. recognized: principal free + **15% on gain fraction**;
  2. exempt slice: free up to basket `exemptPct × 9,430 × 180`, reduces monthly exemption by `commuted ÷ 180`;
  3. taxable slice: marginal rates, **פריסה** over ≤6 yrs;
  4. §9ב niche.
  Basket reduced by **×1.35 × prior exempt severance** (default severance ₪0 ⇒ no-op). Only above the min-pension floor.

- **Nominal-cap real erosion (Power, ticket 13):** thresholds in nominal ₪ (esp. the **קצבה מזכה ceiling ₪9,430/mo**, brackets, credit-point, surtax) lose real value in a real-terms engine — and Israel does **not** catch up after a freeze (each freeze is a permanent real notch). Model `real_cap(t) = cap_today × (1 − erosion)^t` with **two knobs**: *frozen cluster* (ceiling/brackets/credit-point/surtax) = an explicit **flat-nominal segment through 2027** (~full inflation) then **~1%/yr real erosion** long-run (range 0 → full-inflation); *indexed cluster* (gemel cap, avg-wage base, Bituach Leumi allowance) = **~0% (constant real)**. Highest impact = the קצבה מזכה ceiling (tax-exempt pension slice). **Offsetting tailwind:** §9א exemption rate rises 57→67% by 2028. Ignoring erosion overstates the tax-free pension.

## 8. Drawdown algorithm

```
need = expenses − netActiveFloors − netRentalIncome
for bucket in drawdownOrder:            // default: liquidTaxable → gemel → kerenHishtalmut
    if need <= 0: break
    gross = grossUpForTax(bucket, need) // withdraw enough so net covers `need`
    take = min(gross, bucket.value)
    bucket.value -= take; need -= netOf(take)
insolvent if need > 0 after all buckets  // pre-floor bridge years are the binding constraint
```
Pension is excluded from `drawdownOrder` (it produces a floor, not a drawdown source) except a commuted lump sum, which lands in `liquidTaxable`. Order is Power-editable; an auto "tax-optimized" order is a future Power feature.

## 9. Success criterion

`feasible` ⇔ for every year to `planningAge`: `need` is fully met (no insolvency) **and** end-of-plan net worth ≥ `bequestTarget`. Real estate equity counts toward bequest, not toward covering `need` unless sold.

## 10. Solve modes (one core, primary + explorer)

**No target-age input.** The app assumes the user wants to retire as soon as possible; `fireAge` is an **output**, not an input.

```ts
function project(scenario:Scenario, fireAge:Age):{ feasible:boolean; path:YearState[]; endNetWorth:Money; firstInsolventAge?:Age };

// PRIMARY (always computed) — the hero number: earliest age at which retirement is feasible.
// feasibility is monotone non-decreasing in fireAge → scan/bisect from currentAge upward.
function earliestFeasibleAge(s:Scenario, maxAge=statutoryAge):Age|null;   // null ⇒ infeasible even at statutory age

// THE GAP — "how much more do you need", anchored to retiring NOW (not a target the user must pick):
//   earliest>currentAge → lump = extra added to liquidTaxable today so project(s,currentAge) is feasible (bisection)
//   earliest===null     → lump = extra so project(s, statutoryAge) is feasible (make even a statutory retirement work)
function gapToRetireNow(s:Scenario):{ lumpSumToday:Money }|null;

// OPTIONAL what-if (Power): "what would it take to retire by age A?" for a user-chosen A < earliest.
// Returns lump sum AND implied monthly saving over (A−currentAge). Not a required input; defaults off.
function gapToRetireBy(s:Scenario, targetAge:Age):{ lumpSumToday:Money; extraMonthlySaving:Money };
```
Headline output: **the earliest age you can retire**. Secondary: **the Gap to retire now** (a lump sum) when they can't retire immediately. The old "retire at age X?" is demoted to the optional what-if explorer — never a required input.

## 11. Worked example (illustrative — becomes a unit-test fixture)

Single male, age 45, born 1981, salary ₪300k (**no target age** — the engine solves the earliest feasible age; ~55 here). Buckets: liquidTaxable ₪1.5M (basis ₪1.0M), kerenHishtalmut ₪500k (seniorityMet), gemel ₪300k (basis ₪250k), pension keren-pensia ₪1.2M. Retirement expenses ₪200k/yr. Assumptions: realReturn 4%, inflation 2.5%, planningAge 92, bequest 0. Strategy `waitStatutory`. Discretionary savings ₪50k/yr → liquidTaxable.

- **Accumulation 45→55:** pension gets ~₪55.5k/yr (growing) + 4% growth → ≈ **₪2.47M** at 55; liquid ≈ **₪2.82M**, keren hishtalmut ≈ **₪0.74M**, gemel ≈ **₪0.44M** → liquid total ≈ **₪4.0M**.
- **Bridge 55→67 (self-funded):** draw ~₪200k/yr (grossed to ~₪215k for CGT) from liquid, order liquidTaxable→gemel→keren; buckets still growing 4%. PV of the draw ≈ ₪2.0M vs ₪4.0M available → **feasible with margin**; ~₪2M+ liquid remains at 67.
- **Post-67 floors:** pension ≈ ₪2.47M grown to ≈ **₪3.95M** at 67 ÷ 200 = **₪19,760/mo** gross; §9א exempts ~₪5,422, remainder marginal → net ≈ ₪15k/mo; + Bituach Leumi ₪1,838 ⇒ floors ≈ **₪200k/yr**, covering expenses. Portfolio no longer drawn.
- **Verdict:** earliest feasible age ≈ **55** (the hero); `gapToRetireNow` = the lump sum needed today to retire immediately at 45.

## 11b. Market-crash stress (Power, ticket 12)

A deterministic downside overlay: **crash of size X% every N years** (inputs: size %, frequency yrs; 0 = off), applied to market-exposed balances (liquid, keren, pension pot pre-annuitization) on top of the trend return. The fixed annuity and Bituach Leumi are unaffected. Still deterministic (no Monte Carlo). **Sequence-risk caveat:** timing relative to retirement dominates — a phase/worst-case option (crash at retirement) is a pending refinement. Conservative: no recovery bounce.

## 12. Open items & handoffs

- **Implemented in `src/engine/` (2026-08-31):** yearly projection, staged bridge, buckets, coefficient longevity drift, child-cost curve, market-crash stress, and — via `tax.ts` — the **§9א annuity exemption + ceiling + progressive marginal tax**, **real basis-aware capital-gains tax** on liquid draws, and **nominal-cap real erosion**. All engine-tested. **Still simplified / TODO:** the four היוון commutation paths (`commute60` is a ~30% exempt-lump proxy — ticket 05); deep real-estate (07) & couple (08), both deferred.

- **[verify] before shipping numbers** (research 01/05/06): min-pension floor exact value, 2028 ceiling, forward-פריסה ratio, 161ד no-filing default, latest CMA fees, historical exemption stages.
- **Deep real-estate & mortgage** → ticket 07 (Power). **Couple/two-partner modeling** → ticket 08 (Power). The engine's `persons[]` and `realEstate` shapes are the extension points.
- **What-if / path comparison & visualization** → Results prototype (ticket 04). **Input surface & shell** → Input prototype (ticket 03).
