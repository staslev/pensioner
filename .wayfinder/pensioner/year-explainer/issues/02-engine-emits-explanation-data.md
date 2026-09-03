# Engine emits per-year explanation data (surface tax & CGT intermediates)

Type: task
Status: resolved
Assignee: staslev
Blocked by: 01 (resolved)

## Answer

**Built. `project()` now populates `Projection.explanations` (promoted to required) and `explainYear` is a thin lookup.** Build green, **22 engine tests pass** (16 prior + 6 new). Numbers are unchanged — this only *exposes* intermediates the loop already computed.

**What was surfaced, per retirement year (`YearExplanation`):**
- **Expense decomposition** — the `expense` sum was factored into three named components `grownBase` / `grownRent` / `childrenAmt` and emitted as `ExpenseRow[]` (`base` / `rent` / `children`), each `> 0` only. They sum to `expense.total` exactly.
- **Funding by bucket** — `FundingRow[]` uses the **same capped bar amounts** (`fromBI`, `fromPension`, and the portfolio split into `liquid`=`netFromLiquid` + `keren`=`useKeren`), so `funding.total = fromBI + fromPension + fromPortfolio = expense − shortfall`. `shortfall` stays a scalar on the year, not a row.
- **Annuity tax** — `tax.ts` gained `annuityTaxBreakdown()` returning `{gross, exemptMonthly, exempt, taxable, tax, net, exemptionActive, ceilingMonthly, exemptRate}`; `annuityNetAnnual` is now a one-line wrapper over `.net` (identical arithmetic). The engine calls the breakdown and emits a `marginal` `TaxLine` (`gross/exempt/base/tax/rate`). The §9א age gate is faithful — `exemptionActive = age ≥ statAge`, so a 60–66 early annuity shows `exempt = 0`.
- **CGT** — the portfolio-draw block now records `cgtGross` (`take`), `cgtGain` (`take × gainFrac`), `cgtTax` (`gain × 25%`); emitted as a `cgt` `TaxLine` (`exempt = 0`, `base = gain`) when a liquid draw happened.

**Decisions made while implementing (feed ticket 05):**
- **Funding vs. tax are two honest views.** Funding rows are capped-to-expense (they reconstruct the bar); the tax band is full-flow (the annuity is taxed on its whole gross regardless of how much funded expense). These diverge only in **over-funded years** (floors exceed expense, surplus reinvested) — which never have a portfolio draw, so the two views can't both be "live" and confusing at once.
- **`FundingRow.pension.gross` is set only when uncapped** (`fromPension === annuityTax.net`) so `net = gross − tax` always reads true. In the capped/over-funded case `gross` is omitted and a `note {key:'note.annuityOverfunds'}` is attached instead.
- **Flags** (RowBase.flag is singular): `NO_RECOGNIZED_PENSION_SLICE` rides the `marginal` tax line (fires whenever an annuity is present); `COMMUTE60_PROXY` rides the `pension` funding row (fires on the commute60 path). `YearExplanation.caveats` is the de-duped union of flags that fired.
- **Notes emitted (keys for ticket 05's Hebrew registry):** `note.exemptGateEarly` (on the marginal line during `earlyAnnuity`) and `note.annuityOverfunds` (on a capped pension row). Caveat *text* is keyed by the `Simplification` enum itself (per ticket 01) — the engine emits only the flag, not prose.
- **`PhaseKind`** derived as `age < annuitizeAge → bridge`, `age < statAge → earlyAnnuity`, else `fullAnnuity`.

Files: `src/engine/tax.ts` (breakdown), `src/engine/engine.ts` (populate + `explainYear`), `src/engine/types.ts` (`explanations` now required), `src/engine/engine.test.ts` (6 new tests). Not yet committed.

## Question

Implement the locked contract (01). Today `annuityNetAnnual` (`../../../src/engine/tax.ts`) computes the §9א exempt slice + marginal tax but **returns only the net**; the liquid-draw CGT logic in `project()` computes the gain fraction & tax inline and discards it; expense is a single summed number. Refactor so the engine surfaces, per retirement year:

- **Expense decomposition**: grown base (non-rent), grown rent, children-curve amount.
- **Funding by bucket**: Bituach Leumi, net pension annuity, portfolio (split liquid vs keren), shortfall.
- **Annuity tax**: gross annuity, exempt ₪ (with the rule/rate/ceiling in force that year, incl. cap erosion), taxable ₪, marginal tax paid, and whether the §9א exemption is active (statutory-age gate).
- **CGT**: gain fraction of the draw, real CGT paid.

Numbers must not change — this only *exposes* intermediates. Unit-test the breakdown sums back to the totals.

## Context

Blocked by 01 (the contract). Execution ticket (build-in-place mode). Engine: `../../../src/engine/`. Keep the tax intermediates honest per option (b); flag simplifications rather than inventing precision.
